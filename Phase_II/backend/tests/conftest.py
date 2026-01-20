"""Pytest configuration and shared fixtures."""
import os
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

# Set test environment before importing app
os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET"] = "test-secret-key-for-testing-only"
os.environ["LOG_LEVEL"] = "ERROR"

from src.main import app
from src.database import get_session
from src.models.user import User
from src.models.task import Task
from src.models.project import Project
from src.models.tag import Tag
from src.models.notification import Notification
from src.services.auth import hash_password, create_access_token


@pytest.fixture(name="engine")
def engine_fixture():
    """Create a test database engine with in-memory SQLite."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="session")
def session_fixture(engine) -> Generator[Session, None, None]:
    """Create a test database session."""
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with database session override."""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session) -> User:
    """Create a test user."""
    user = User(
        email="test@example.com",
        name="Test User",
        hashed_password=hash_password("testpassword123")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="test_user_token")
def test_user_token_fixture(test_user: User) -> str:
    """Create a JWT token for the test user."""
    return create_access_token({"sub": str(test_user.id), "email": test_user.email})


@pytest.fixture(name="auth_headers")
def auth_headers_fixture(test_user_token: str) -> dict:
    """Create authorization headers with test user token."""
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture(name="second_user")
def second_user_fixture(session: Session) -> User:
    """Create a second test user for isolation testing."""
    user = User(
        email="second@example.com",
        name="Second User",
        hashed_password=hash_password("password456")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="second_user_token")
def second_user_token_fixture(second_user: User) -> str:
    """Create a JWT token for the second user."""
    return create_access_token({"sub": str(second_user.id), "email": second_user.email})


@pytest.fixture(name="test_task")
def test_task_fixture(session: Session, test_user: User) -> Task:
    """Create a test task."""
    task = Task(
        title="Test Task",
        description="This is a test task",
        status="todo",
        priority="medium",
        user_id=test_user.id,
        is_complete=False
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@pytest.fixture(name="test_project")
def test_project_fixture(session: Session, test_user: User) -> Project:
    """Create a test project."""
    project = Project(
        name="Test Project",
        description="This is a test project",
        color="#10b981",
        user_id=test_user.id
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@pytest.fixture(name="test_tag")
def test_tag_fixture(session: Session, test_user: User) -> Tag:
    """Create a test tag."""
    tag = Tag(
        name="Test Tag",
        color="#3b82f6",
        user_id=test_user.id
    )
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag


@pytest.fixture(name="multiple_tasks")
def multiple_tasks_fixture(session: Session, test_user: User) -> list[Task]:
    """Create multiple test tasks."""
    tasks = [
        Task(
            title=f"Task {i}",
            description=f"Description {i}",
            status=["todo", "in_progress", "review", "done"][i % 4],
            priority=["low", "medium", "high", "urgent"][i % 4],
            user_id=test_user.id,
            is_complete=i % 2 == 0
        )
        for i in range(10)
    ]
    for task in tasks:
        session.add(task)
    session.commit()
    for task in tasks:
        session.refresh(task)
    return tasks


@pytest.fixture(autouse=True)
def reset_database(session: Session):
    """Reset database before each test."""
    # This fixture runs automatically before each test
    # The session fixture already handles cleanup
    yield
