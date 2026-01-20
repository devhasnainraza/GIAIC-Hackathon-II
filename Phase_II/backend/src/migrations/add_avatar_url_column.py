"""
Migration: Add avatar_url column to users table

This migration adds the avatar_url column to the users table if it doesn't exist.
"""
from sqlalchemy import text, inspect
from src.database import engine
import logging

logger = logging.getLogger(__name__)


def upgrade():
    """Add avatar_url column to users table."""
    try:
        # Check if column already exists
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]

        if 'avatar_url' in columns:
            logger.info("avatar_url column already exists in users table")
            return

        # Add the column
        with engine.connect() as conn:
            conn.execute(text("""
                ALTER TABLE users
                ADD COLUMN avatar_url VARCHAR(500)
            """))
            conn.commit()
            logger.info("Successfully added avatar_url column to users table")

    except Exception as e:
        logger.error(f"Failed to add avatar_url column: {str(e)}")
        raise


def downgrade():
    """Remove avatar_url column from users table."""
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                ALTER TABLE users
                DROP COLUMN IF EXISTS avatar_url
            """))
            conn.commit()
            logger.info("Successfully removed avatar_url column from users table")

    except Exception as e:
        logger.error(f"Failed to remove avatar_url column: {str(e)}")
        raise


if __name__ == "__main__":
    # Run migration when executed directly
    print("Running migration: add_avatar_url_column")
    upgrade()
    print("Migration completed successfully")
