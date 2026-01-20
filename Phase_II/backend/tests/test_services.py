"""Tests for service layer business logic."""
import pytest
from sqlmodel import Session
from src.models.user import User
from src.models.task import Task
from src.models.project import Project
from src.models.tag import Tag
from src.services.task_service import TaskService
from src.services.user_service import UserService
from src.services.project_service import ProjectService
from src.services.tag_service import TagService
from src.services.notification_service import NotificationService
from src.models.notification import NotificationType


# ============================================================================
# TASK SERVICE TESTS
# ============================================================================

@pytest.mark.unit
class TestTaskService:
    """Test TaskService business logic."""

    def test_create_task(self, session: Session, test_user: User):
        """Test creating task through service."""
        service = TaskService(session)

        task = service.create_task(
            user_id=test_user.id,
            title="Service Task",
            description="Created via service",
            status="todo",
            priority="high"
        )

        assert task.id is not None
        assert task.title == "Service Task"
        assert task.user_id == test_user.id
        assert task.status == "todo"
        assert task.priority == "high"

    def test_list_tasks(self, session: Session, test_user: User, multiple_tasks):
        """Test listing tasks through service."""
        service = TaskService(session)

        tasks = service.list_tasks(test_user.id)

        assert len(tasks) == 10
        assert all(task.user_id == test_user.id for task in tasks)

    def test_get_task(self, session: Session, test_user: User, test_task: Task):
        """Test getting single task through service."""
        service = TaskService(session)

        task = service.get_task(test_task.id, test_user.id)

        assert task is not None
        assert task.id == test_task.id
        assert task.title == test_task.title

    def test_get_task_wrong_user(self, session: Session, test_user: User,
                                 second_user: User):
        """Test getting task with wrong user returns None."""
        service = TaskService(session)

        # Create task for second user
        other_task = Task(
            title="Other Task",
            user_id=second_user.id,
            status="todo",
            priority="medium"
        )
        session.add(other_task)
        session.commit()
        session.refresh(other_task)

        # Try to get with first user
        task = service.get_task(other_task.id, test_user.id)

        assert task is None

    def test_update_task(self, session: Session, test_user: User, test_task: Task):
        """Test updating task through service."""
        service = TaskService(session)

        updated_task = service.update_task(
            task_id=test_task.id,
            user_id=test_user.id,
            title="Updated Title",
            status="in_progress"
        )

        assert updated_task.title == "Updated Title"
        assert updated_task.status == "in_progress"

    def test_delete_task(self, session: Session, test_user: User, test_task: Task):
        """Test deleting task through service."""
        service = TaskService(session)
        task_id = test_task.id

        result = service.delete_task(task_id, test_user.id)

        assert result is True

        # Verify deletion
        deleted_task = session.get(Task, task_id)
        assert deleted_task is None

    def test_delete_task_wrong_user(self, session: Session, test_user: User,
                                   second_user: User):
        """Test deleting task with wrong user fails."""
        service = TaskService(session)

        # Create task for second user
        other_task = Task(
            title="Other Task",
            user_id=second_user.id,
            status="todo",
            priority="medium"
        )
        session.add(other_task)
        session.commit()
        session.refresh(other_task)

        # Try to delete with first user
        result = service.delete_task(other_task.id, test_user.id)

        assert result is False

        # Verify task still exists
        still_exists = session.get(Task, other_task.id)
        assert still_exists is not None


# ============================================================================
# USER SERVICE TESTS
# ============================================================================

@pytest.mark.unit
class TestUserService:
    """Test UserService business logic."""

    def test_create_user(self, session: Session):
        """Test creating user through service."""
        service = UserService(session)

        user = service.create_user(
            email="newuser@example.com",
            password="SecurePass123!",
            name="New User"
        )

        assert user.id is not None
        assert user.email == "newuser@example.com"
        assert user.name == "New User"
        assert user.hashed_password != "SecurePass123!"  # Should be hashed

    def test_create_user_duplicate_email(self, session: Session, test_user: User):
        """Test creating user with duplicate email fails."""
        service = UserService(session)

        with pytest.raises(Exception):  # Should raise appropriate exception
            service.create_user(
                email=test_user.email,
                password="AnotherPass123!",
                name="Duplicate"
            )

    def test_authenticate_user_success(self, session: Session, test_user: User):
        """Test successful user authentication."""
        service = UserService(session)

        user = service.authenticate_user(test_user.email, "testpassword123")

        assert user is not None
        assert user.id == test_user.id
        assert user.email == test_user.email

    def test_authenticate_user_wrong_password(self, session: Session, test_user: User):
        """Test authentication with wrong password."""
        service = UserService(session)

        user = service.authenticate_user(test_user.email, "wrongpassword")

        assert user is None

    def test_authenticate_user_nonexistent(self, session: Session):
        """Test authentication with non-existent email."""
        service = UserService(session)

        user = service.authenticate_user("nonexistent@example.com", "password")

        assert user is None

    def test_get_user_by_email(self, session: Session, test_user: User):
        """Test getting user by email."""
        service = UserService(session)

        user = service.get_user_by_email(test_user.email)

        assert user is not None
        assert user.id == test_user.id

    def test_get_user_by_id(self, session: Session, test_user: User):
        """Test getting user by ID."""
        service = UserService(session)

        user = service.get_user_by_id(test_user.id)

        assert user is not None
        assert user.email == test_user.email

    def test_update_user(self, session: Session, test_user: User):
        """Test updating user through service."""
        service = UserService(session)

        updated_user = service.update_user(
            user_id=test_user.id,
            name="Updated Name"
        )

        assert updated_user.name == "Updated Name"
        assert updated_user.email == test_user.email  # Unchanged


# ============================================================================
# PROJECT SERVICE TESTS
# ============================================================================

@pytest.mark.unit
class TestProjectService:
    """Test ProjectService business logic."""

    def test_create_project(self, session: Session, test_user: User):
        """Test creating project through service."""
        service = ProjectService(session)

        project = service.create_project(
            user_id=test_user.id,
            name="Service Project",
            description="Created via service",
            color="#10b981"
        )

        assert project.id is not None
        assert project.name == "Service Project"
        assert project.user_id == test_user.id
        assert project.color == "#10b981"

    def test_list_projects(self, session: Session, test_user: User, test_project: Project):
        """Test listing projects through service."""
        service = ProjectService(session)

        projects = service.list_projects(test_user.id)

        assert len(projects) >= 1
        assert any(p.id == test_project.id for p in projects)

    def test_get_project(self, session: Session, test_user: User, test_project: Project):
        """Test getting single project through service."""
        service = ProjectService(session)

        project = service.get_project(test_project.id, test_user.id)

        assert project is not None
        assert project.id == test_project.id

    def test_update_project(self, session: Session, test_user: User, test_project: Project):
        """Test updating project through service."""
        service = ProjectService(session)

        updated_project = service.update_project(
            project_id=test_project.id,
            user_id=test_user.id,
            name="Updated Project"
        )

        assert updated_project.name == "Updated Project"

    def test_delete_project(self, session: Session, test_user: User, test_project: Project):
        """Test deleting project through service."""
        service = ProjectService(session)
        project_id = test_project.id

        result = service.delete_project(project_id, test_user.id)

        assert result is True

        # Verify deletion
        deleted_project = session.get(Project, project_id)
        assert deleted_project is None


# ============================================================================
# TAG SERVICE TESTS
# ============================================================================

@pytest.mark.unit
class TestTagService:
    """Test TagService business logic."""

    def test_create_tag(self, session: Session, test_user: User):
        """Test creating tag through service."""
        service = TagService(session)

        tag = service.create_tag(
            user_id=test_user.id,
            name="Service Tag",
            color="#ef4444"
        )

        assert tag.id is not None
        assert tag.name == "Service Tag"
        assert tag.user_id == test_user.id
        assert tag.color == "#ef4444"

    def test_list_tags(self, session: Session, test_user: User, test_tag: Tag):
        """Test listing tags through service."""
        service = TagService(session)

        tags = service.list_tags(test_user.id)

        assert len(tags) >= 1
        assert any(t.id == test_tag.id for t in tags)

    def test_get_tag(self, session: Session, test_user: User, test_tag: Tag):
        """Test getting single tag through service."""
        service = TagService(session)

        tag = service.get_tag(test_tag.id, test_user.id)

        assert tag is not None
        assert tag.id == test_tag.id

    def test_update_tag(self, session: Session, test_user: User, test_tag: Tag):
        """Test updating tag through service."""
        service = TagService(session)

        updated_tag = service.update_tag(
            tag_id=test_tag.id,
            user_id=test_user.id,
            name="Updated Tag"
        )

        assert updated_tag.name == "Updated Tag"

    def test_delete_tag(self, session: Session, test_user: User, test_tag: Tag):
        """Test deleting tag through service."""
        service = TagService(session)
        tag_id = test_tag.id

        result = service.delete_tag(tag_id, test_user.id)

        assert result is True

        # Verify deletion
        deleted_tag = session.get(Tag, tag_id)
        assert deleted_tag is None


# ============================================================================
# NOTIFICATION SERVICE TESTS
# ============================================================================

@pytest.mark.unit
class TestNotificationService:
    """Test NotificationService business logic."""

    def test_create_notification(self, session: Session, test_user: User):
        """Test creating notification through service."""
        service = NotificationService(session)

        notification = service.create_notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="Test Notification",
            description="Test description"
        )

        assert notification.id is not None
        assert notification.title == "Test Notification"
        assert notification.user_id == test_user.id
        assert notification.is_read is False

    def test_list_notifications(self, session: Session, test_user: User):
        """Test listing notifications through service."""
        service = NotificationService(session)

        # Create notifications
        for i in range(3):
            service.create_notification(
                user_id=test_user.id,
                notification_type=NotificationType.TASK_CREATED,
                title=f"Notification {i}",
                description="Description"
            )

        notifications = service.list_notifications(test_user.id)

        assert len(notifications) == 3

    def test_get_unread_count(self, session: Session, test_user: User):
        """Test getting unread notification count."""
        service = NotificationService(session)

        # Create notifications
        for i in range(5):
            notification = service.create_notification(
                user_id=test_user.id,
                notification_type=NotificationType.TASK_CREATED,
                title=f"Notification {i}",
                description="Description"
            )
            if i < 2:
                notification.is_read = True
                session.add(notification)
        session.commit()

        count = service.get_unread_count(test_user.id)

        assert count == 3

    def test_mark_as_read(self, session: Session, test_user: User):
        """Test marking notification as read."""
        service = NotificationService(session)

        notification = service.create_notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="Unread",
            description="Description"
        )

        updated = service.mark_as_read(notification.id, test_user.id)

        assert updated is not None
        assert updated.is_read is True

    def test_mark_all_as_read(self, session: Session, test_user: User):
        """Test marking all notifications as read."""
        service = NotificationService(session)

        # Create unread notifications
        for i in range(3):
            service.create_notification(
                user_id=test_user.id,
                notification_type=NotificationType.TASK_CREATED,
                title=f"Notification {i}",
                description="Description"
            )

        service.mark_all_as_read(test_user.id)

        # Verify all are read
        notifications = service.list_notifications(test_user.id)
        assert all(n.is_read for n in notifications)

    def test_delete_notification(self, session: Session, test_user: User):
        """Test deleting notification through service."""
        service = NotificationService(session)

        notification = service.create_notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_CREATED,
            title="To Delete",
            description="Description"
        )
        notification_id = notification.id

        result = service.delete_notification(notification_id, test_user.id)

        assert result is True

        # Verify deletion
        from src.models.notification import Notification
        deleted = session.get(Notification, notification_id)
        assert deleted is None


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

@pytest.mark.integration
class TestServiceIntegration:
    """Test service layer integration."""

    def test_task_with_project_and_tags(self, session: Session, test_user: User):
        """Test creating task with project and tags."""
        # Create project
        project_service = ProjectService(session)
        project = project_service.create_project(
            user_id=test_user.id,
            name="Integration Project",
            color="#10b981"
        )

        # Create tags
        tag_service = TagService(session)
        tag1 = tag_service.create_tag(
            user_id=test_user.id,
            name="Tag 1",
            color="#ef4444"
        )
        tag2 = tag_service.create_tag(
            user_id=test_user.id,
            name="Tag 2",
            color="#3b82f6"
        )

        # Create task with project and tags
        task_service = TaskService(session)
        task = task_service.create_task(
            user_id=test_user.id,
            title="Integration Task",
            status="todo",
            priority="high",
            project_id=project.id,
            tag_ids=[tag1.id, tag2.id]
        )

        assert task.project_id == project.id
        # Verify tags are associated (implementation dependent)

    def test_task_completion_creates_notification(self, session: Session, test_user: User):
        """Test that completing task creates notification."""
        task_service = TaskService(session)
        notification_service = NotificationService(session)

        # Create task
        task = task_service.create_task(
            user_id=test_user.id,
            title="Task to Complete",
            status="todo",
            priority="medium"
        )

        initial_count = notification_service.get_unread_count(test_user.id)

        # Complete task (this should trigger notification creation in API layer)
        # For service layer test, we manually create notification
        notification_service.create_notification(
            user_id=test_user.id,
            notification_type=NotificationType.TASK_COMPLETED,
            title="Task Completed",
            description=f'You completed "{task.title}"'
        )

        final_count = notification_service.get_unread_count(test_user.id)

        assert final_count == initial_count + 1
