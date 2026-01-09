"""Database configuration and session management."""
from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
from src.config import settings

# Create engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # Log SQL queries in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,  # Connection pool size
    max_overflow=10  # Max connections beyond pool_size
)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency for FastAPI routes to get database session.

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session

def init_db() -> None:
    """
    Create all tables in the database.
    Should be called on application startup.
    """
    SQLModel.metadata.create_all(engine)
