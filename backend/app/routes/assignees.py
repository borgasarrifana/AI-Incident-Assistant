from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Assignee
from app.schemas import AssigneeCreate, AssigneeUpdate, AssigneeOut

router = APIRouter()


@router.get("/", response_model=list[AssigneeOut])
def list_assignees(db: Session = Depends(get_db)):
    return db.query(Assignee).order_by(Assignee.created_at).all()


@router.post("/", response_model=AssigneeOut)
def create_assignee(payload: AssigneeCreate, db: Session = Depends(get_db)):
    assignee = Assignee(name=payload.name)
    db.add(assignee)
    db.commit()
    db.refresh(assignee)
    return assignee


@router.put("/{assignee_id}", response_model=AssigneeOut)
def update_assignee(assignee_id: str, payload: AssigneeUpdate, db: Session = Depends(get_db)):
    assignee = db.query(Assignee).filter(Assignee.id == assignee_id).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")
    assignee.name = payload.name
    assignee.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(assignee)
    return assignee


@router.delete("/{assignee_id}")
def delete_assignee(assignee_id: str, db: Session = Depends(get_db)):
    assignee = db.query(Assignee).filter(Assignee.id == assignee_id).first()
    if not assignee:
        raise HTTPException(status_code=404, detail="Assignee not found")
    db.delete(assignee)
    db.commit()
    return {"detail": "Assignee deleted"}