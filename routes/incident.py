from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import analyze_text

router = APIRouter()

class IncidentRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze_incident(req: IncidentRequest):
    prompt = f"""
    You are an incident management expert.

    Analyze this incident:
    {req.text}

    Return:
    1. Summary
    2. Severity (Low, Medium, High)
    3. Recommended actions
    """

    result = analyze_text(prompt)
    return {"result": result}