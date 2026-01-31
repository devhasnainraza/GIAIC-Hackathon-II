"""Tests for authentication endpoints."""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from src.models.user import User


@pytest.mark.api
@pytest.mark.auth
class TestAuthRegistration:
    """Test user registration endpoint."""

    def test_register_success(self, client: TestClient):
        """Test successful user registration."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "name": "New User"
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["name"] == "New User"
        assert "id" in data["user"]

    def test_register_duplicate_email(self, client: TestClient, test_user: User):
        """Test registration with duplicate email fails."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": test_user.email,
                "password": "AnotherPass123!",
                "name": "Duplicate User"
            }
        )

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email format."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "not-an-email",
                "password": "SecurePass123!",
                "name": "Invalid Email"
            }
        )

        assert response.status_code == 422

    def test_register_weak_password(self, client: TestClient):
        """Test registration with weak password."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "weak@example.com",
                "password": "123",
                "name": "Weak Password"
            }
        )

        # Should fail validation (password too short)
        assert response.status_code in [400, 422]

    def test_register_missing_fields(self, client: TestClient):
        """Test registration with missing required fields."""
        response = client.post(
            "/api/auth/register",
            json={"email": "incomplete@example.com"}
        )

        assert response.status_code == 422


@pytest.mark.api
@pytest.mark.auth
class TestAuthLogin:
    """Test user login endpoint."""

    def test_login_success(self, client: TestClient, test_user: User):
        """Test successful login."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "testpassword123"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == test_user.email

    def test_login_wrong_password(self, client: TestClient, test_user: User):
        """Test login with incorrect password."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": test_user.email,
                "password": "wrongpassword"
            }
        )

        assert response.status_code == 401
        assert "invalid" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with non-existent email."""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "somepassword"
            }
        )

        assert response.status_code == 401

    def test_login_missing_credentials(self, client: TestClient):
        """Test login with missing credentials."""
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com"}
        )

        assert response.status_code == 422


@pytest.mark.api
@pytest.mark.auth
class TestAuthToken:
    """Test JWT token authentication."""

    def test_valid_token_access(self, client: TestClient, auth_headers: dict):
        """Test accessing protected endpoint with valid token."""
        response = client.get("/api/users/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "id" in data

    def test_missing_token(self, client: TestClient):
        """Test accessing protected endpoint without token."""
        response = client.get("/api/users/me")

        assert response.status_code == 401

    def test_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        response = client.get(
            "/api/users/me",
            headers={"Authorization": "Bearer invalid-token-here"}
        )

        assert response.status_code == 401

    def test_malformed_token_header(self, client: TestClient):
        """Test accessing protected endpoint with malformed authorization header."""
        response = client.get(
            "/api/users/me",
            headers={"Authorization": "InvalidFormat token"}
        )

        assert response.status_code == 401

    def test_expired_token(self, client: TestClient):
        """Test accessing protected endpoint with expired token."""
        # Create a token with negative expiration
        from src.services.auth import create_access_token
        from datetime import timedelta

        expired_token = create_access_token(
            {"sub": "1", "email": "test@example.com"},
            expires_delta=timedelta(seconds=-1)
        )

        response = client.get(
            "/api/users/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )

        assert response.status_code == 401


@pytest.mark.unit
@pytest.mark.auth
class TestPasswordHashing:
    """Test password hashing utilities."""

    def test_hash_password(self):
        """Test password hashing."""
        from src.services.auth import hash_password

        password = "SecurePassword123!"
        hashed = hash_password(password)

        assert hashed != password
        assert len(hashed) > 0
        assert hashed.startswith("$2b$")  # bcrypt prefix

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        from src.services.auth import hash_password, verify_password

        password = "SecurePassword123!"
        hashed = hash_password(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        from src.services.auth import hash_password, verify_password

        password = "SecurePassword123!"
        hashed = hash_password(password)

        assert verify_password("WrongPassword", hashed) is False

    def test_same_password_different_hashes(self):
        """Test that same password produces different hashes (salt)."""
        from src.services.auth import hash_password

        password = "SecurePassword123!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)

        assert hash1 != hash2  # Different due to random salt


@pytest.mark.unit
@pytest.mark.auth
class TestJWTTokens:
    """Test JWT token creation and validation."""

    def test_create_access_token(self):
        """Test JWT token creation."""
        from src.services.auth import create_access_token

        data = {"sub": "123", "email": "test@example.com"}
        token = create_access_token(data)

        assert isinstance(token, str)
        assert len(token) > 0
        assert token.count(".") == 2  # JWT has 3 parts separated by dots

    def test_decode_valid_token(self):
        """Test decoding valid JWT token."""
        from src.services.auth import create_access_token
        from jose import jwt
        from src.config import settings

        data = {"sub": "123", "email": "test@example.com"}
        token = create_access_token(data)

        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        assert decoded["sub"] == "123"
        assert decoded["email"] == "test@example.com"
        assert "exp" in decoded

    def test_token_with_custom_expiration(self):
        """Test token creation with custom expiration."""
        from src.services.auth import create_access_token
        from datetime import timedelta
        from jose import jwt
        from src.config import settings
        import time

        data = {"sub": "123"}
        token = create_access_token(data, expires_delta=timedelta(hours=1))

        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        # Check expiration is approximately 1 hour from now
        exp_time = decoded["exp"]
        current_time = time.time()
        time_diff = exp_time - current_time

        assert 3500 < time_diff < 3700  # ~1 hour (with some tolerance)
