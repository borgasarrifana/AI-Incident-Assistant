from sqlalchemy import String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional
import uuid

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incidents: Mapped[list["Incident"]] = relationship(
        "Incident", back_populates="workspace", cascade="all, delete-orphan"
    )


class Assignee(Base):
    __tablename__ = "assignees"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    workspace_id: Mapped[Optional[str]] = mapped_column(ForeignKey("workspaces.id"), nullable=True)

    incident: Mapped[str] = mapped_column(Text, nullable=False)
    location_name: Mapped[str] = mapped_column(String, default="Unknown")
    latitude: Mapped[float] = mapped_column(Float, default=0)
    longitude: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String, default="Open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    severity: Mapped[str] = mapped_column(String, default="Low")
    tags: Mapped[str] = mapped_column(Text, default="")
    root_cause: Mapped[str] = mapped_column(Text, default="")
    impact: Mapped[str] = mapped_column(Text, default="")
    actions: Mapped[str] = mapped_column(Text, default="")
    summary: Mapped[str] = mapped_column(Text, default="")
    confidence: Mapped[int] = mapped_column(Integer, default=70)
    related_incidents: Mapped[int] = mapped_column(Integer, default=0)
    assignee: Mapped[str] = mapped_column(String, default="Unassigned")

    workspace: Mapped[Optional["Workspace"]] = relationship("Workspace", back_populates="incidents")
    events: Mapped[list["IncidentEvent"]] = relationship(
        "IncidentEvent", back_populates="incident_ref", cascade="all, delete-orphan"
    )


class IncidentEvent(Base):
    __tablename__ = "incident_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    incident_id: Mapped[str] = mapped_column(
        ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    action: Mapped[str] = mapped_column(String, nullable=False)   # e.g. "created", "status_changed"
    detail: Mapped[str] = mapped_column(Text, default="")          # e.g. "Open → Resolved"
    actor: Mapped[str] = mapped_column(String, default="Unknown")  # user email (mock auth for now)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    incident_ref: Mapped["Incident"] = relationship("Incident", back_populates="events")
