from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    incidents = relationship("Incident", back_populates="workspace", cascade="all, delete-orphan")


class Assignee(Base):
    __tablename__ = "assignees"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=generate_uuid)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=True)

    incident = Column(Text, nullable=False)
    location_name = Column(String, default="Unknown")
    latitude = Column(Float, default=0)
    longitude = Column(Float, default=0)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # AI analysis result fields (flattened rather than a separate table —
    # simpler to query, and this data is always created together)
    severity = Column(String, default="Low")
    tags = Column(Text, default="")  # stored as comma-separated, split on the way out
    root_cause = Column(Text, default="")
    impact = Column(Text, default="")
    actions = Column(Text, default="")
    summary = Column(Text, default="")
    confidence = Column(Integer, default=70)
    related_incidents = Column(Integer, default=0)
    assignee = Column(String, default="Unassigned")

    workspace = relationship("Workspace", back_populates="incidents")