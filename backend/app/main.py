from fastapi import FastAPI
from app.routers import reports

app = FastAPI(title="Hyderabad Wrong Address Report API")

# Include routes
app.include_router(reports.router)

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}
