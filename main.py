from fastapi import FastAPI
from app.routes import incident, logs
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incident.router, prefix="/incident")
app.include_router(logs.router, prefix="/logs")

@app.get("/")
def root():
    return {"status": "API running"}