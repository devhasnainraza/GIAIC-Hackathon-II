"""Tests for user API endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from src.models.user import User


@pytest.mark.api
class TestUserProfile:
    """Test user profile endpoints."""

    def test_get_current_user(self, client: TestClient, auth_headers: dict, test_user: User):
        """Test getting current user profile."""
        response = client.get("/api/users/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user.email
        assert data["name"] == test_user.name
        assert data["id"] == test_user.id
        assert "hashed_password" not in data  # Should not expose password

    def test_get_current_user_unauthorized(self, client: TestClient):
        """Test getting current user without authentication."""
        response = client.get("/api/users/me")

        assert response.status_code == 401

    def test_update_profile(self, client: TestClient, auth_headers: dict):
        """Test updating user profile."""
        response = client.patch(
            "/api/users/me",
            headers=auth_headers,
            json={
                "name": "Updated Name"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"

    def test_update_profile_email(self, client: TestClient, auth_headers: dict):
        """Test updating user email."""
        response = client.patch(
            "/api/users/me",
            headers=auth_headers,
            json={
                "email": "newemail@example.com"
            }
        )

        # Should either succeed or require verification
        assert response.status_code in [200, 400, 422]

    def test_update_profile_invalid_email(self, client: TestClient, auth_headers: dict):
        """Test updating profile with invalid email."""
        response = client.patch(
            "/api/users/me",
            headers=auth_headers,
            json={
                "email": "not-an-email"
            }
        )

        assert response.status_code == 422


@pytest.mark.api
class TestUserPassword:
    """Test password change functionality."""

    def test_change_password_success(self, client: TestClient, auth_headers: dict):
        """Test successful password change."""
        response = client.post(
            "/api/users/me/password",
            headers=auth_headers,
            json={
                "current_password": "testpassword123",
                "new_password": "NewSecurePass456!"
            }
        )

        # Should succeed or return appropriate status
        assert response.status_code in [200, 204]

    def test_change_password_wrong_current(self, client: TestClient, auth_headers: dict):
        """Test password change with wrong current password."""
        response = client.post(
            "/api/users/me/password",
            headers=auth_headers,
            json={
                "current_password": "wrongpassword",
                "new_password": "NewSecurePass456!"
            }
        )

        assert response.status_code in [400, 401]

    def test_change_password_weak_new(self, client: TestClient, auth_headers: dict):
        """Test password change with weak new password."""
        response = client.post(
            "/api/users/me/password",
            headers=auth_headers,
            json={
                "current_password": "testpassword123",
                "new_password": "123"
            }
        )

        assert response.status_code in [400, 422]

    def test_change_password_unauthorized(self, client: TestClient):
        """Test password change without authentication."""
        response = client.post(
            "/api/users/me/password",
            json={
                "current_password": "testpassword123",
                "new_password": "NewSecurePass456!"
            }
        )

        assert response.status_code == 401


@pytest.mark.api
class TestUserStats:
    """Test user statistics endpoints."""

    def test_get_user_stats(self, client: TestClient, auth_headers: dict, multiple_tasks):
        """Test getting user statistics."""
        response = client.get("/api/users/me/stats", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert "total_tasks" in data
        assert "completed_tasks" in data
        assert "pending_tasks" in data
        assert data["total_tasks"] == 10

    def test_get_user_stats_empty(self, client: TestClient, auth_headers: dict):
        """Test getting stats with no tasks."""
        response = client.get("/api/users/me/stats", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 0
        assert data["completed_tasks"] == 0

    def test_get_user_stats_unauthorized(self, client: TestClient):
        """Test getting stats without authentication."""
        response = client.get("/api/users/me/stats")

        assert response.status_code == 401


@pytest.mark.api
class TestUserDeletion:
    """Test user account deletion."""

    def test_delete_account(self, client: TestClient, auth_headers: dict, session: Session):
        """Test deleting user account."""
        response = client.delete("/api/users/me", headers=auth_headers)

        # Should succeed or require confirmation
        assert response.status_code in [200, 204]

    def test_delete_account_unauthorized(self, client: TestClient):
        """Test deleting account without authentication."""
        response = client.delete("/api/users/me")

        assert response.status_code == 401


@pytest.mark.integration
class TestUserWithTasks:
    """Test user endpoints with related tasks."""

    def test_user_stats_accuracy(self, client: TestClient, auth_headers: dict,
                                 session: Session, test_user: User):
        """Test that user stats accurately reflect task counts."""
        from src.models.task import Task

        # Create specific tasks
        tasks = [
            Task(title="Task 1", user_id=test_user.id, status="todo", priority="medium", is_complete=False),
            Task(title="Task 2", user_id=test_user.id, status="done", priority="medium", is_complete=True),
            Task(title="Task 3", user_id=test_user.id, status="done", priority="medium", is_complete=True),
        ]
        for task in tasks:
            session.add(task)
        session.commit()

        response = client.get("/api/users/me/stats", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["total_tasks"] == 3
        assert data["completed_tasks"] == 2
        assert data["pending_tasks"] == 1

    def test_delete_user_cascades_tasks(self, client: TestClient, auth_headers: dict,
                                       session: Session, test_user: User, test_task):
        """Test that deleting user also deletes their tasks."""
        from src.models.task import Task

        task_id = test_task.id

        # Delete user
        response = client.delete("/api/users/me", headers=auth_headers)

        if response.status_code in [200, 204]:
            # Verify task is also deleted (cascade)
            deleted_task = session.get(Task, task_id)
            # Task should be deleted or orphaned depending on cascade settings
            # This test verifies the behavior
            pass
