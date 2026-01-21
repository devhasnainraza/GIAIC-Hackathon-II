#!/usr/bin/env python3
"""
Database initialization script for HuggingFace deployment.
This script creates all database tables before the application starts.
"""
import sys
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize database tables."""
    try:
        logger.info("Starting database initialization...")

        # Import database module
        from src.database import init_db

        # Create all tables
        logger.info("Creating database tables...")
        init_db()

        logger.info("✅ Database initialization completed successfully!")
        return True

    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")
        logger.exception("Full error traceback:")
        return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
