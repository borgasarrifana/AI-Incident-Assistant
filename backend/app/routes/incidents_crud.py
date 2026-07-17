from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Incident, IncidentEvent
from app.schemas import (
    IncidentCreate,
    IncidentOut,
    IncidentStatusUpdate,
    IncidentEventOut,
)

router = APIRouter()


def _to_out(incident: Incident) -> dict:
    """Reshape the flat DB row into the nested { result: {...} } shape the frontend expects."""
    return {
        "id": incident.id,
        "incident": incident.incident,
        "locationName": incident.location_name,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "status": incident.status,
        "createdAt": incident.created_at,
        "resolvedAt": incident.resolved_at,
        "result": {
            "severity": incident.severity,
            "tags": [t for t in (incident.tags or "").split(",") if t],
            "rootCause": incident.root_cause,
            "impact": incident.impact,
            "actions": incident.actions,
            "summary": incident.summary,
            "confidence": incident.confidence,
            "relatedIncidents": incident.related_incidents,
            "assignee": incident.assignee,
        },
    }


def _event_to_out(event: IncidentEvent) -> dict:
    return {
        "id": event.id,
        "action": event.action,
        "detail": event.detail,
        "actor": event.actor,
        "createdAt": event.created_at,
    }


def _log_event(db: Session, incident_id: str, action: str, detail: str = "", actor: str = "Unknown"):
    """Attach an audit event to the current transaction (committed by the caller)."""
    db.add(
        IncidentEvent(
            incident_id=incident_id,
            action=action,
            detail=detail,
            actor=actor or "Unknown",
        )
    )


@router.get("/", response_model=list[IncidentOut])
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    return [_to_out(i) for i in incidents]


@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return _to_out(incident)


@router.get("/{incident_id}/events", response_model=list[IncidentEventOut])
def list_incident_events(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    events = (
        db.query(IncidentEvent)
        .filter(IncidentEvent.incident_id == incident_id)
        .order_by(IncidentEvent.created_at.desc())
        .all()
    )
    return [_event_to_out(e) for e in events]


@router.post("/", response_model=IncidentOut)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    incident = Incident(
        id=payload.id,  # None is fine — model default will generate one
        incident=payload.incident,
        location_name=payload.locationName,
        latitude=payload.latitude,
        longitude=payload.longitude,
        status=payload.status,
        workspace_id=payload.workspaceId,
        severity=payload.result.severity,
        tags=",".join(payload.result.tags),
        root_cause=payload.result.rootCause,
        impact=payload.result.impact,
        actions=payload.result.actions,
        summary=payload.result.summary,
        confidence=payload.result.confidence,
        related_incidents=payload.result.relatedIncidents,
        assignee=payload.result.assignee,
    )
    db.add(incident)
    db.flush()  # populate incident.id before logging the event

    _log_event(
        db,
        incident.id,
        action="created",
        detail=f"Severity {incident.severity} · assigned to {incident.assignee}",
        actor=payload.actor,
    )

    db.commit()
    db.refresh(incident)
    return _to_out(incident)


@router.patch("/{incident_id}/status", response_model=IncidentOut)
def update_incident_status(incident_id: str, payload: IncidentStatusUpdate, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    old_status = incident.status
    incident.status = payload.status
    if payload.status == "Resolved":
        incident.resolved_at = datetime.utcnow()

    if old_status != payload.status:
        _log_event(
            db,
            incident.id,
            action="status_changed",
            detail=f"{old_status} → {payload.status}",
            actor=payload.actor,
        )

    db.commit()
    db.refresh(incident)
    return _to_out(incident)


@router.delete("/")
def clear_incidents(db: Session = Depends(get_db)):
    # Events are removed automatically via the DB-level ON DELETE CASCADE
    db.query(Incident).delete()
    db.commit()
    return {"detail": "All incidents cleared"}
