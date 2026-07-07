from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from app.services.openai_service import analyze_text
from app.websocket_manager import manager

router = APIRouter()

MAX_INPUT_LENGTH = 4000


class IncidentRequest(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Incident description cannot be empty.")
        if len(v) > MAX_INPUT_LENGTH:
            raise ValueError(
                f"Input too long. Maximum {MAX_INPUT_LENGTH} characters allowed."
            )
        return v


@router.post("/analyze")
async def analyze_incident(req: IncidentRequest):
    prompt = f"""
You are an incident management expert.

Analyze this incident:
{req.text}

Identify the severity, tags, root cause, business impact, and recommended actions.
"""
    result = await analyze_text(prompt)

    await manager.broadcast("New incident analyzed")

    return {"result": result}