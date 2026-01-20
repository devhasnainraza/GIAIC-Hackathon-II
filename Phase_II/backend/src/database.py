"""Database configuration and session management."""
from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
from src.config import settings
import logging

logger = logging.getLogger(__name__)

# Import all models to ensure they are registered with SQLModel
# This must happen before init_db() is called
from src.models.user import User, UserSettings, UserActivity
from src.models.task import Task
from src.models.notification import Notification
from src.models.project import Project
from src.models.tag import Tag, TaskTag

# Create engine with connection pooling and optimized settings
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",  # Log SQL queries only in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=settings.DATABASE_POOL_SIZE,  # Connection pool size
    max_overflow=settings.DATABASE_MAX_OVERFLOW,  # Max connections beyond pool_size
    pool_recycle=3600,  # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 30,  # Increased timeout to 30 seconds for Neon cold starts
        "options": "-c timezone=utc"  # Set timezone to UTC
    }
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI routes to get database session.

    This is an alias for get_session() to maintain compatibility.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


def get_session() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI routes to get database session.

    Yields:
        Session: SQLModel database session
    """
    yield from get_db()


def init_db() -> None:
    """
    Create all tables in the database.
    Should be called on application startup.
    """
    try:
        logger.info("Initializing database tables")
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables initialized successfully")

        # Verify tables exist
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"Database tables: {', '.join(tables)}")

    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}", exc_info=True)
        raise


def close_db() -> None:
    """
    Close database connections.
    Should be called on application shutdown.
    """
    try:
        logger.info("Closing database connections")
        engine.dispose()
        logger.info("Database connections closed successfully")
    except Exception as e:
        logger.error(f"Error closing database connections: {str(e)}", exc_info=True)

