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
        LOG_LEVEL: Logging level (DEBUG/INFO/WARNING/ERROR/CRITICAL)
        RATE_LIMIT_PER_MINUTE: Maximum requests per minute per IP (production only)
        DATABASE_POOL_SIZE: Database connection pool size
        DATABASE_MAX_OVERFLOW: Maximum overflow connections
        CLOUDINARY_CLOUD_NAME: Cloudinary cloud name
        CLOUDINARY_API_KEY: Cloudinary API key
        CLOUDINARY_API_SECRET: Cloudinary API secret
    """
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 168  # 7 days
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    RATE_LIMIT_PER_MINUTE: int = 60
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    # Cloudinary settings for image storage
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Email settings
    EMAIL_PROVIDER: str = "console"  # Options: resend, gmail, console
    RESEND_API_KEY: str = ""
    GMAIL_EMAIL: str = ""
    GMAIL_APP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@puretasks.com"
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def validate_production_config(self):
        """Validate production configuration."""
        if self.ENVIRONMENT == "production":
            # Email provider validation
            if self.EMAIL_PROVIDER == "console":
                raise ValueError("Console email provider not allowed in production. Use 'resend' or 'gmail'.")

            if self.EMAIL_PROVIDER == "resend" and not self.RESEND_API_KEY:
                raise ValueError("RESEND_API_KEY is required when EMAIL_PROVIDER is 'resend'")

            if self.EMAIL_PROVIDER == "gmail":
                if not self.GMAIL_EMAIL or not self.GMAIL_APP_PASSWORD:
                    raise ValueError("GMAIL_EMAIL and GMAIL_APP_PASSWORD are required when EMAIL_PROVIDER is 'gmail'")

            # HTTPS enforcement
            if not self.FRONTEND_URL.startswith("https://"):
                raise ValueError("FRONTEND_URL must use HTTPS in production")

            # JWT secret strength
            if len(self.JWT_SECRET) < 32:
                raise ValueError("JWT_SECRET must be at least 32 characters in production")

            # Database SSL
            if "sslmode=require" not in self.DATABASE_URL:
                import warnings
                warnings.warn("DATABASE_URL should include 'sslmode=require' in production")

# Global settings instance
settings = Settings()

