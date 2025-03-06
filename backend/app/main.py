from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reports

app = FastAPI(title="Hyderabad Wrong Address Report API")



# Allow requests from your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Include routes
app.include_router(reports.router)

@app.get("/")
def home():
    print("Server running -------")
    return {"message": "FastAPI server is running!"}
    
