import os
import asyncio
from dotenv import load_dotenv
from groq import Groq, GroqError
from fastapi import HTTPException

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are a senior SRE and incident management expert.

Respond STRICTLY in this format (do not add extra text before or after):

Severity:
<one of: Critical, High, Medium, Low>

Tags:
<tag1>, <tag2>, <tag3>

Root Cause:
<concise root cause explanation>

Impact:
<business and technical impact>

Recommended Actions:
- action 1
- action 2
- action 3
"""


def _call_groq(prompt: str) -> str:
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured on the server."
        )
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # fast, free, very capable
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            max_tokens=600,
            temperature=0.3,
        )
        return response.choices[0].message.content

    except GroqError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Groq API error: {str(e)}"
        )


async def analyze_text(prompt: str) -> str:
    return await asyncio.to_thread(_call_groq, prompt)