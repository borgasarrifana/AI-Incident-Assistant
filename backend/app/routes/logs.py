from fastapi import APIRouter, Request
from pydantic import BaseModel, field_validator
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.openai_service import analyze_text
from app.websocket_manager import manager

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

MAX_INPUT_LENGTH = 8000  # logs can be longer


class LogRequest(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        v = v.strip()
        if not v:
            raise ValueError("Log content cannot be empty.")
        if len(v) > MAX_INPUT_LENGTH:
            raise ValueError(
                f"Input too long. Maximum {MAX_INPUT_LENGTH} characters allowed."
            )
        return v


@router.post("/analyze")
@limiter.limit("10/minute")
async def analyze_logs(request: Request, req: LogRequest):
    prompt = f"""
You are a senior software engineer and SRE.

Analyze these logs:
{req.text}

Identify the severity, relevant tags, root cause, business impact,
and concrete steps to fix the issue.
"""
    result = await analyze_text(prompt)

    await manager.broadcast("New log analysis completed")

    return {"result": result}