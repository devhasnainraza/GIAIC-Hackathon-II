"""Migration script to add status column to tasks table."""
from sqlalchemy import text
from src.database import engine

def migrate():
    """Add status column to tasks table if it doesn't exist."""
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name='tasks' AND column_name='status'
        """))

        if result.fetchone() is None:
            # Add status column with default value
            conn.execute(text("""
                ALTER TABLE tasks
                ADD COLUMN status VARCHAR(20) DEFAULT 'todo' NOT NULL
            """))
            conn.commit()
            print("Added status column to tasks table")
        else:
            print("Status column already exists")

if __name__ == "__main__":
    migrate()
