from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import analyze_text

router = APIRouter()

class LogRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze_logs(req: LogRequest):
    prompt = f"""
    You are a senior software engineer.

    Analyze these logs:
    {req.text}

    Explain:
    1. What is the issue
    2. Likely root cause
    3. Suggested fix
    """

    result = analyze_text(prompt)
    return {"result": result}