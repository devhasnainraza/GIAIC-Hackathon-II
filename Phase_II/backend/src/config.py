"""Environment configuration management."""
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        DATABASE_URL: PostgreSQL connection string
        JWT_SECRET: Secret key for JWT token signing/verification
        JWT_ALGORITHM: Algorithm for JWT encoding (default: HS256)
        JWT_EXPIRATION_HOURS: Token expiration time in hours (default: 168 = 7 days)
        CORS_ORIGINS: Comma-separated list of allowed CORS origins
        ENVIRONMENT: Application environment (development/production)
    """
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 168  # 7 days
    CORS_ORIGINS: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()
