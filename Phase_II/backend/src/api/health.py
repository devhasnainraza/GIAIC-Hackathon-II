"""Health check and monitoring endpoints."""
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from src.database import get_db
from datetime import datetime
import psutil
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Health & Monitoring"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(db: Session = Depends(get_db)):
    """
    Comprehensive health check endpoint.

    Checks:
    - API availability
    - Database connectivity
    - System resources

    Returns:
        Health status with detailed information
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }

    # Check database connectivity
    try:
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "Database connection successful"
        }
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }

    # Check system resources (optional in serverless environments)
    try:
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()

        health_status["checks"]["system"] = {
            "status": "healthy",
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent
        }

        # Try to get disk usage (may not work in serverless)
        try:
            disk = psutil.disk_usage('/')
            health_status["checks"]["system"]["disk_percent"] = disk.percent
        except:
            pass  # Disk metrics not available in serverless

        # Warn if resources are high
        if cpu_percent > 80 or memory.percent > 80:
            health_status["checks"]["system"]["status"] = "warning"
            health_status["checks"]["system"]["message"] = "High resource usage detected"

    except Exception as e:
        logger.warning(f"System health check failed: {str(e)}")
        health_status["checks"]["system"] = {
            "status": "unknown",
            "message": "System metrics not available (serverless environment)"
        }

    # Set overall status
    if any(check.get("status") == "unhealthy" for check in health_status["checks"].values()):
        health_status["status"] = "unhealthy"
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=health_status
        )

    return health_status


@router.get("/health/ready", status_code=status.HTTP_200_OK)
async def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness probe for Kubernetes/container orchestration.

    Returns 200 if the service is ready to accept traffic.
    """
    try:
        # Check database connectivity
        db.execute(text("SELECT 1"))
        return {"status": "ready", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "not_ready",
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }
        )


@router.get("/health/live", status_code=status.HTTP_200_OK)
async def liveness_check():
    """
    Liveness probe for Kubernetes/container orchestration.

    Returns 200 if the service is alive (doesn't check dependencies).
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/metrics", status_code=status.HTTP_200_OK)
async def metrics(db: Session = Depends(get_db)):
    """
    Application metrics endpoint.

    Returns:
        System and application metrics
    """
    try:
        # System metrics (optional in serverless)
        system_metrics = {}
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            system_metrics = {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_available_mb": memory.available / (1024 * 1024)
            }

            # Try to get disk metrics (may not work in serverless)
            try:
                disk = psutil.disk_usage('/')
                system_metrics["disk_percent"] = disk.percent
                system_metrics["disk_free_gb"] = disk.free / (1024 * 1024 * 1024)
            except:
                pass
        except Exception as e:
            logger.warning(f"Could not collect system metrics: {str(e)}")
            system_metrics = {"status": "unavailable", "message": "Serverless environment"}

        # Database metrics
        db_result = db.execute(text("""
            SELECT
                (SELECT count(*) FROM users) as total_users,
                (SELECT count(*) FROM tasks) as total_tasks,
                (SELECT count(*) FROM tasks WHERE is_complete = true) as completed_tasks
        """))
        db_stats = db_result.fetchone()

        metrics_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "system": system_metrics,
            "database": {
                "total_users": db_stats[0] if db_stats else 0,
                "total_tasks": db_stats[1] if db_stats else 0,
                "completed_tasks": db_stats[2] if db_stats else 0
            }
        }

        return metrics_data

    except Exception as e:
        logger.error(f"Metrics collection failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Failed to collect metrics",
                "message": str(e)
            }
        )
