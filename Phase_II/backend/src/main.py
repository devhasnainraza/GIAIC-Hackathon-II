"""FastAPI application entry point with comprehensive improvements."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import logging
import os
from pathlib import Path

from src.database import init_db, close_db
from src.config import settings
from src.logging_config import setup_logging
from src.middleware import (
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    RateLimitMiddleware,
    PerformanceMonitoringMiddleware
)
from src.exceptions import (
    AppException,
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler
)

# Setup logging
setup_logging(
    log_level=settings.LOG_LEVEL,
    json_logs=settings.ENVIRONMENT == "production"
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting application", extra={"environment": settings.ENVIRONMENT})

    # Validate production configuration
    if settings.ENVIRONMENT == "production":
        try:
            settings.validate_production_config()
            logger.info("Production configuration validated successfully")
        except ValueError as e:
            logger.error(f"Production configuration validation failed: {e}")
            raise

    # Ensure upload directories exist
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    (upload_dir / "avatars").mkdir(exist_ok=True)
    logger.info("Upload directories initialized")

    init_db()
    logger.info("Database initialized successfully")
    yield
    # Shutdown
    logger.info("Shutting down application")
    close_db()
    logger.info("Application shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="Pure Tasks API",
    description="Secure multi-user task management API with JWT authentication",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT == "development" else None,
    openapi_url="/api/openapi.json" if settings.ENVIRONMENT == "development" else None
)

# Mount static files for uploads
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time"]
)

# Add custom middleware (order matters!)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(PerformanceMonitoringMiddleware, slow_request_threshold=1.0)
app.add_middleware(RequestLoggingMiddleware)

# Add rate limiting only in production
if settings.ENVIRONMENT == "production":
    app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)

# Register exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Register rate limit exceeded handler
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "name": "Pure Tasks API",
        "version": "2.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/api/docs" if settings.ENVIRONMENT == "development" else None
    }


# Import and include routers
from src.api import auth, tasks, users, notifications, projects, tags, health, newsletter

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(tags.router, prefix="/api")
app.include_router(newsletter.router)

logger.info(
    "Application started successfully",
    extra={
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "cors_origins": origins
    }
)

