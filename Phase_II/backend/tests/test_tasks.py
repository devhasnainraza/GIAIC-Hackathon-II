"""Tests for task API endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from src.models.user import User
from src.models.task import Task
from src.models.project import Project
from src.models.tag import Tag
from datetime import datetime, timedelta


@pytest.mark.api
class TestTaskList:
    """Test task listing endpoint."""

    def test_list_tasks_empty(self, client: TestClient, auth_headers: dict):
        """Test listing tasks when user has no tasks."""
        response = client.get("/api/tasks", headers=auth_headers)

        assert response.status_code == 200
        assert response.json() == []

    def test_list_tasks_with_data(self, client: TestClient, auth_headers: dict, multiple_tasks: list[Task]):
        """Test listing tasks with existing data."""
        response = client.get("/api/tasks", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 10
        assert all("id" in task for task in data)
        assert all("title" in task for task in data)

    def test_list_tasks_user_isolation(self, client: TestClient, auth_headers: dict,
                                       second_user: User, session: Session):
        """Test that users only see their own tasks."""
        # Create task for first user
        task1 = Task(title="User 1 Task", user_id=1, status="todo", priority="medium")
        session.add(task1)

        # Create task for second user
        task2 = Task(title="User 2 Task", user_id=second_user.id, status="todo", priority="medium")
        session.add(task2)
        session.commit()

        response = client.get("/api/tasks", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        titles = [task["title"] for task in data]
        assert "User 1 Task" in titles
        assert "User 2 Task" not in titles

    def test_list_tasks_unauthorized(self, client: TestClient):
        """Test listing tasks without authentication."""
        response = client.get("/api/tasks")

        assert response.status_code == 401


@pytest.mark.api
class TestTaskCreate:
    """Test task creation endpoint."""

    def test_create_task_minimal(self, client: TestClient, auth_headers: dict):
        """Test creating task with minimal required fields."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "New Task"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Task"
        assert data["status"] == "todo"  # Default
        assert data["priority"] == "medium"  # Default
        assert data["is_complete"] is False
        assert "id" in data
        assert "created_at" in data

    def test_create_task_full(self, client: TestClient, auth_headers: dict,
                             test_project: Project, test_tag: Tag):
        """Test creating task with all fields."""
        due_date = (datetime.now() + timedelta(days=7)).isoformat()

        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Complete Task",
                "description": "This is a complete task with all fields",
                "status": "in_progress",
                "priority": "high",
                "due_date": due_date,
                "project_id": test_project.id,
                "tag_ids": [test_tag.id]
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Complete Task"
        assert data["description"] == "This is a complete task with all fields"
        assert data["status"] == "in_progress"
        assert data["priority"] == "high"
        assert data["due_date"] is not None
        assert data["project_id"] == test_project.id

    def test_create_task_empty_title(self, client: TestClient, auth_headers: dict):
        """Test creating task with empty title fails."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": ""
            }
        )

        assert response.status_code in [400, 422]

    def test_create_task_long_title(self, client: TestClient, auth_headers: dict):
        """Test creating task with very long title."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "A" * 300  # Very long title
            }
        )

        # Should either succeed or fail validation
        assert response.status_code in [201, 400, 422]

    def test_create_task_invalid_status(self, client: TestClient, auth_headers: dict):
        """Test creating task with invalid status."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Task",
                "status": "invalid_status"
            }
        )

        assert response.status_code == 422

    def test_create_task_invalid_priority(self, client: TestClient, auth_headers: dict):
        """Test creating task with invalid priority."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Task",
                "priority": "invalid_priority"
            }
        )

        assert response.status_code == 422

    def test_create_task_unauthorized(self, client: TestClient):
        """Test creating task without authentication."""
        response = client.post(
            "/api/tasks",
            json={"title": "Unauthorized Task"}
        )

        assert response.status_code == 401


@pytest.mark.api
class TestTaskGet:
    """Test task retrieval endpoint."""

    def test_get_task_success(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test getting a specific task."""
        response = client.get(f"/api/tasks/{test_task.id}", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == test_task.id
        assert data["title"] == test_task.title

    def test_get_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test getting non-existent task."""
        response = client.get("/api/tasks/99999", headers=auth_headers)

        assert response.status_code == 404

    def test_get_task_wrong_user(self, client: TestClient, auth_headers: dict,
                                 second_user: User, session: Session):
        """Test getting another user's task fails."""
        # Create task for second user
        other_task = Task(
            title="Other User Task",
            user_id=second_user.id,
            status="todo",
            priority="medium"
        )
        session.add(other_task)
        session.commit()
        session.refresh(other_task)

        response = client.get(f"/api/tasks/{other_task.id}", headers=auth_headers)

        assert response.status_code == 404  # Should not reveal existence

    def test_get_task_unauthorized(self, client: TestClient, test_task: Task):
        """Test getting task without authentication."""
        response = client.get(f"/api/tasks/{test_task.id}")

        assert response.status_code == 401


@pytest.mark.api
class TestTaskUpdate:
    """Test task update endpoint."""

    def test_update_task_title(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test updating task title."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={"title": "Updated Title"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["id"] == test_task.id

    def test_update_task_status(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test updating task status."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={"status": "done"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "done"

    def test_update_task_complete(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test marking task as complete."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={"is_complete": True}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_complete"] is True
        assert "completed_at" in data

    def test_update_task_multiple_fields(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test updating multiple fields at once."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={
                "title": "Multi Update",
                "status": "in_progress",
                "priority": "high",
                "description": "Updated description"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Multi Update"
        assert data["status"] == "in_progress"
        assert data["priority"] == "high"
        assert data["description"] == "Updated description"

    def test_update_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test updating non-existent task."""
        response = client.patch(
            "/api/tasks/99999",
            headers=auth_headers,
            json={"title": "Updated"}
        )

        assert response.status_code == 404

    def test_update_task_wrong_user(self, client: TestClient, auth_headers: dict,
                                    second_user: User, session: Session):
        """Test updating another user's task fails."""
        other_task = Task(
            title="Other Task",
            user_id=second_user.id,
            status="todo",
            priority="medium"
        )
        session.add(other_task)
        session.commit()
        session.refresh(other_task)

        response = client.patch(
            f"/api/tasks/{other_task.id}",
            headers=auth_headers,
            json={"title": "Hacked"}
        )

        assert response.status_code == 404

    def test_update_task_invalid_status(self, client: TestClient, auth_headers: dict, test_task: Task):
        """Test updating task with invalid status."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            headers=auth_headers,
            json={"status": "invalid"}
        )

        assert response.status_code == 422

    def test_update_task_unauthorized(self, client: TestClient, test_task: Task):
        """Test updating task without authentication."""
        response = client.patch(
            f"/api/tasks/{test_task.id}",
            json={"title": "Unauthorized Update"}
        )

        assert response.status_code == 401


@pytest.mark.api
class TestTaskDelete:
    """Test task deletion endpoint."""

    def test_delete_task_success(self, client: TestClient, auth_headers: dict,
                                 test_task: Task, session: Session):
        """Test deleting a task."""
        task_id = test_task.id

        response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)

        assert response.status_code == 204

        # Verify task is deleted
        deleted_task = session.get(Task, task_id)
        assert deleted_task is None

    def test_delete_task_not_found(self, client: TestClient, auth_headers: dict):
        """Test deleting non-existent task."""
        response = client.delete("/api/tasks/99999", headers=auth_headers)

        assert response.status_code == 404

    def test_delete_task_wrong_user(self, client: TestClient, auth_headers: dict,
                                    second_user: User, session: Session):
        """Test deleting another user's task fails."""
        other_task = Task(
            title="Other Task",
            user_id=second_user.id,
            status="todo",
            priority="medium"
        )
        session.add(other_task)
        session.commit()
        session.refresh(other_task)

        response = client.delete(f"/api/tasks/{other_task.id}", headers=auth_headers)

        assert response.status_code == 404

        # Verify task still exists
        still_exists = session.get(Task, other_task.id)
        assert still_exists is not None

    def test_delete_task_unauthorized(self, client: TestClient, test_task: Task):
        """Test deleting task without authentication."""
        response = client.delete(f"/api/tasks/{test_task.id}")

        assert response.status_code == 401


@pytest.mark.integration
class TestTaskWithRelations:
    """Test tasks with projects and tags."""

    def test_create_task_with_project(self, client: TestClient, auth_headers: dict,
                                      test_project: Project):
        """Test creating task with project."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Project Task",
                "project_id": test_project.id
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["project_id"] == test_project.id

    def test_create_task_with_tags(self, client: TestClient, auth_headers: dict,
                                   test_tag: Tag):
        """Test creating task with tags."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Tagged Task",
                "tag_ids": [test_tag.id]
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert "tags" in data or "tag_ids" in data

    def test_create_task_invalid_project(self, client: TestClient, auth_headers: dict):
        """Test creating task with non-existent project."""
        response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={
                "title": "Task",
                "project_id": 99999
            }
        )

        assert response.status_code in [400, 404]


@pytest.mark.smoke
class TestTaskSmokeTests:
    """Critical smoke tests for task functionality."""

    def test_task_crud_flow(self, client: TestClient, auth_headers: dict):
        """Test complete CRUD flow for tasks."""
        # Create
        create_response = client.post(
            "/api/tasks",
            headers=auth_headers,
            json={"title": "CRUD Test Task"}
        )
        assert create_response.status_code == 201
        task_id = create_response.json()["id"]

        # Read
        get_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert get_response.status_code == 200
        assert get_response.json()["title"] == "CRUD Test Task"

        # Update
        update_response = client.patch(
            f"/api/tasks/{task_id}",
            headers=auth_headers,
            json={"title": "Updated CRUD Task"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["title"] == "Updated CRUD Task"

        # Delete
        delete_response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
        assert delete_response.status_code == 204

        # Verify deletion
        verify_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert verify_response.status_code == 404
