from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# --- Workspace ---
class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceOut(BaseModel):
    id: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Assignee ---
class AssigneeCreate(BaseModel):
    name: str


class AssigneeUpdate(BaseModel):
    name: str


class AssigneeOut(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


# --- Incident ---
class IncidentResultIn(BaseModel):
    severity: str = "Low"
    tags: List[str] = []
    rootCause: str = ""
    impact: str = ""
    actions: str = ""
    summary: str = ""
    confidence: int = 70
    relatedIncidents: int = 0
    assignee: str = "Unassigned"


class IncidentCreate(BaseModel):
    id: Optional[str] = None  # frontend currently generates its own id (Date.now()); allow it, or auto-generate if omitted
    incident: str
    locationName: str = "Unknown"
    latitude: float = 0
    longitude: float = 0
    status: str = "Open"
    workspaceId: Optional[str] = None
    result: IncidentResultIn


class IncidentStatusUpdate(BaseModel):
    status: str


class IncidentResultOut(BaseModel):
    severity: str
    tags: List[str]
    rootCause: str
    impact: str
    actions: str
    summary: str
    confidence: int
    relatedIncidents: int
    assignee: str


class IncidentOut(BaseModel):
    id: str
    incident: str
    locationName: str
    latitude: float
    longitude: float
    status: str
    createdAt: datetime
    resolvedAt: Optional[datetime] = None
    result: IncidentResultOut

    class Config:
        from_attributes = True