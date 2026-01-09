"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import init_db
from src.config import settings
import os

# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="Secure multi-user todo management API with JWT authentication",
    version="1.0.0"
)

# Configure CORS
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Todo API",
        "version": "1.0.0",
        "status": "running"
    }

# Import and include routers
from src.api import auth, tasks
app.include_router(auth.router)
app.include_router(tasks.router)
