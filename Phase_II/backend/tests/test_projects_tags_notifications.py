"""Tests for project, tag, and notification API endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from src.models.user import User
from src.models.project import Project
from src.models.tag import Tag
from src.models.notification import Notification


# ============================================================================
# PROJECT TESTS
# ============================================================================

@pytest.mark.api
class TestProjectList:
    """Test project listing endpoint."""

    def test_list_projects_empty(self, client: TestClient, auth_headers: dict):
        """Test listing projects when user has none."""
        response = client.get("/api/projects", headers=auth_headers)

        assert response.status_code == 200
        assert response.json() == []

    def test_list_projects_with_data(self, client: TestClient, auth_headers: dict,
                                     test_project: Project):
        """Test listing projects with data."""
        response = client.get("/api/projects", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(p["id"] == test_project.id for p in data)

    def test_list_projects_user_isolation(self, client: TestClient, auth_headers: dict,
                                          second_user: User, session: Session):
        """Test users only see their own projects."""
        # Create project for second user
        other_project = Project(
            name="Other Project",
            color="#ff0000",
            user_id=second_user.id
        )
        session.add(other_project)
        session.commit()

        response = client.get("/api/projects", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        project_ids = [p["id"] for p in data]
        assert other_project.id not in project_ids


@pytest.mark.api
class TestProjectCreate:
    """Test project creation endpoint."""

    def test_create_project_minimal(self, client: TestClient, auth_headers: dict):
        """Test creating project with minimal fields."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={
                "name": "New Project"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Project"
        assert "id" in data
        assert "color" in data

    def test_create_project_full(self, client: TestClient, auth_headers: dict):
        """Test creating project with all fields."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={
                "name": "Complete Project",
                "description": "Project description",
                "color": "#10b981"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Complete Project"
        assert data["description"] == "Project description"
        assert data["color"] == "#10b981"

    def test_create_project_empty_name(self, client: TestClient, auth_headers: dict):
        """Test creating project with empty name fails."""
        response = client.post(
            "/api/projects",
            headers=auth_headers,
            json={"name": ""}
        )

        assert response.status_code in [400, 422]


@pytest.mark.api
class TestProjectUpdate:
    """Test project update endpoint."""

    def test_update_project(self, client: TestClient, auth_headers: dict, test_project: Project):
        """Test updating project."""
        response = client.patch(
            f"/api/projects/{test_project.id}",
            headers=auth_headers,
            json={"name": "Updated Project"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Project"

    def test_update_project_not_found(self, client: TestClient, auth_headers: dict):
        """Test updating non-existent project."""
        response = client.patch(
            "/api/projects/99999",
            headers=auth_headers,
            json={"name": "Updated"}
        )

        assert response.status_code == 404


@pytest.mark.api
class TestProjectDelete:
    """Test project deletion endpoint."""

    def test_delete_project(self, client: TestClient, auth_headers: dict, test_project: Project):
        """Test deleting project."""
        response = client.delete(f"/api/projects/{test_project.id}", headers=auth_headers)

        assert response.status_code == 204

    def test_delete_project_not_found(self, client: TestClient, auth_headers: dict):
        """Test deleting non-existent project."""
        response = client.delete("/api/projects/99999", headers=auth_headers)

        assert response.status_code == 404


# ============================================================================
# TAG TESTS
# ============================================================================

@pytest.mark.api
class TestTagList:
    """Test tag listing endpoint."""

    def test_list_tags_empty(self, client: TestClient, auth_headers: dict):
        """Test listing tags when user has none."""
        response = client.get("/api/tags", headers=auth_headers)

        assert response.status_code == 200
        assert response.json() == []

    def test_list_tags_with_data(self, client: TestClient, auth_headers: dict, test_tag: Tag):
        """Test listing tags with data."""
        response = client.get("/api/tags", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(t["id"] == test_tag.id for t in data)


@pytest.mark.api
class TestTagCreate:
    """Test tag creation endpoint."""

    def test_create_tag_minimal(self, client: TestClient, auth_headers: dict):
        """Test creating tag with minimal fields."""
        response = client.post(
            "/api/tags",
            headers=auth_headers,
            json={"name": "New Tag"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Tag"
        assert "id" in data
        assert "color" in data

    def test_create_tag_full(self, client: TestClient, auth_headers: dict):
        """Test creating tag with all fields."""
        response = client.post(
            "/api/tags",
            headers=auth_headers,
            json={
                "name": "Complete Tag",
                "color": "#ef4444"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Complete Tag"
        assert data["color"] == "#ef4444"

    def test_create_tag_empty_name(self, client: TestClient, auth_headers: dict):
        """Test creating tag with empty name fails."""
        response = client.post(
            "/api/tags",
            headers=auth_headers,
            json={"name": ""}
        )

        assert response.status_code in [400, 422]


@pytest.mark.api
class TestTagUpdate:
    """Test tag update endpoint."""

    def test_update_tag(self, client: TestClient, auth_headers: dict, test_tag: Tag):
        """Test updating tag."""
        response = client.patch(
            f"/api/tags/{test_tag.id}",
            headers=auth_headers,
            json={"name": "Updated Tag"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Tag"


@pytest.mark.api
class TestTagDelete:
    """Test tag deletion endpoint."""

    def test_delete_tag(self, client: TestClient, auth_headers: dict, test_tag: Tag):
        """Test deleting tag."""
        response = client.delete(f"/api/tags/{test_tag.id}", headers=auth_headers)

        assert response.status_code == 204


# ============================================================================
# NOTIFICATION TESTS
# ============================================================================

@pytest.mark.api
class TestNotificationList:
    """Test notification listing endpoint."""

    def test_list_notifications_empty(self, client: TestClient, auth_headers: dict):
        """Test listing notifications when user has none."""
        response = client.get("/api/notifications", headers=auth_headers)

        assert response.status_code == 200
        assert response.json() == []

    def test_list_notifications_with_data(self, client: TestClient, auth_headers: dict,
                                         session: Session, test_user: User):
        """Test listing notifications with data."""
        from src.models.notification import NotificationType

        notification = Notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="Test Notification",
            description="Test description",
            is_read=False
        )
        session.add(notification)
        session.commit()

        response = client.get("/api/notifications", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(n["title"] == "Test Notification" for n in data)

    def test_list_notifications_user_isolation(self, client: TestClient, auth_headers: dict,
                                               second_user: User, session: Session):
        """Test users only see their own notifications."""
        from src.models.notification import NotificationType

        other_notification = Notification(
            user_id=second_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="Other Notification",
            description="Other description",
            is_read=False
        )
        session.add(other_notification)
        session.commit()

        response = client.get("/api/notifications", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        titles = [n["title"] for n in data]
        assert "Other Notification" not in titles


@pytest.mark.api
class TestNotificationMarkRead:
    """Test marking notifications as read."""

    def test_mark_notification_read(self, client: TestClient, auth_headers: dict,
                                    session: Session, test_user: User):
        """Test marking notification as read."""
        from src.models.notification import NotificationType

        notification = Notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="Unread Notification",
            description="Description",
            is_read=False
        )
        session.add(notification)
        session.commit()
        session.refresh(notification)

        response = client.patch(
            f"/api/notifications/{notification.id}/read",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert data["is_read"] is True

    def test_mark_all_notifications_read(self, client: TestClient, auth_headers: dict,
                                        session: Session, test_user: User):
        """Test marking all notifications as read."""
        from src.models.notification import NotificationType

        # Create multiple unread notifications
        for i in range(3):
            notification = Notification(
                user_id=test_user.id,
                notification_type=NotificationType.TASK_CREATED,
                title=f"Notification {i}",
                description="Description",
                is_read=False
            )
            session.add(notification)
        session.commit()

        response = client.post("/api/notifications/read-all", headers=auth_headers)

        assert response.status_code == 200

        # Verify all are read
        list_response = client.get("/api/notifications", headers=auth_headers)
        data = list_response.json()
        assert all(n["is_read"] for n in data)


@pytest.mark.api
class TestNotificationUnreadCount:
    """Test unread notification count."""

    def test_get_unread_count(self, client: TestClient, auth_headers: dict,
                             session: Session, test_user: User):
        """Test getting unread notification count."""
        from src.models.notification import NotificationType

        # Create unread notifications
        for i in range(5):
            notification = Notification(
                user_id=test_user.id,
                notification_type=NotificationType.TASK_CREATED,
                title=f"Notification {i}",
                description="Description",
                is_read=i < 2  # First 2 are read
            )
            session.add(notification)
        session.commit()

        response = client.get("/api/notifications/unread-count", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["unread_count"] == 3


@pytest.mark.api
class TestNotificationDelete:
    """Test notification deletion."""

    def test_delete_notification(self, client: TestClient, auth_headers: dict,
                                 session: Session, test_user: User):
        """Test deleting notification."""
        from src.models.notification import NotificationType

        notification = Notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="To Delete",
            description="Description",
            is_read=False
        )
        session.add(notification)
        session.commit()
        session.refresh(notification)

        response = client.delete(f"/api/notifications/{notification.id}", headers=auth_headers)

        assert response.status_code == 204
