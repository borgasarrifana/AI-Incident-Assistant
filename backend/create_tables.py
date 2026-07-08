from app.database import engine, Base
from app.models import Workspace, Assignee, Incident

Base.metadata.create_all(bind=engine)
print("Tables created successfully.")