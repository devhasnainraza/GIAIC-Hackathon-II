"""
Migration: Add password reset fields to users table

This migration adds reset_token and reset_token_expires fields to the users table
to support password reset functionality.

Run this migration:
    python -m src.migrations.add_password_reset_fields
"""
from sqlmodel import create_engine, text
from src.config import settings

def run_migration():
    """Add password reset fields to users table."""
    engine = create_engine(settings.DATABASE_URL)

    with engine.connect() as conn:
        # Check if columns already exist
        check_query = text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('reset_token', 'reset_token_expires')
        """)

        existing_columns = conn.execute(check_query).fetchall()
        existing_column_names = [row[0] for row in existing_columns]

        # Add reset_token if it doesn't exist
        if 'reset_token' not in existing_column_names:
            print("Adding reset_token column...")
            conn.execute(text("""
                ALTER TABLE users
                ADD COLUMN reset_token VARCHAR(255) NULL
            """))
            conn.commit()
            print("[OK] reset_token column added")
        else:
            print("[OK] reset_token column already exists")

        # Add reset_token_expires if it doesn't exist
        if 'reset_token_expires' not in existing_column_names:
            print("Adding reset_token_expires column...")
            conn.execute(text("""
                ALTER TABLE users
                ADD COLUMN reset_token_expires TIMESTAMP NULL
            """))
            conn.commit()
            print("[OK] reset_token_expires column added")
        else:
            print("[OK] reset_token_expires column already exists")

        # Create index on reset_token for faster lookups
        print("Creating index on reset_token...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_users_reset_token
                ON users(reset_token)
            """))
            conn.commit()
            print("[OK] Index created on reset_token")
        except Exception as e:
            print(f"Note: Index might already exist - {e}")

    print("/n[SUCCESS] Migration completed successfully!")

if __name__ == "__main__":
    print("Running migration: Add password reset fields to users table/n")
    run_migration()
