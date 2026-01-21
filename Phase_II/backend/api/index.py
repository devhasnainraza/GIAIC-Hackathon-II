"""Simple Vercel serverless entry point for FastAPI application."""
import sys
from pathlib import Path

# Add the parent directory to the path so we can import from src
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app
from src.main import app

# Export for Vercel
handler = app
