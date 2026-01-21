"""Vercel serverless entry point for FastAPI application."""
import sys
import os
from pathlib import Path

# Add the parent directory to the path so we can import from src
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Check for required environment variables before importing
REQUIRED_ENV_VARS = {
    "DATABASE_URL": "PostgreSQL connection string (e.g., postgresql://user:pass@host.neon.tech/db?sslmode=require)",
    "JWT_SECRET": "Secret key for JWT tokens (minimum 32 characters)",
}

missing_vars = []
for var, description in REQUIRED_ENV_VARS.items():
    if not os.environ.get(var):
        missing_vars.append(f"  - {var}: {description}")

if missing_vars:
    # Create a simple ASGI app that returns error message
    async def app(scope, receive, send):
        if scope["type"] == "http":
            error_html = f"""
            <html>
            <head><title>Configuration Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #e74c3c;">⚠️ Backend Configuration Error</h1>
                <p style="font-size: 18px;">The backend server cannot start because required environment variables are missing.</p>

                <h2>Missing Environment Variables:</h2>
                <pre style="background: #f4f4f4; padding: 20px; border-radius: 5px; overflow-x: auto;">
{'//n'.join(missing_vars)}
                </pre>

                <h2>How to Fix:</h2>
                <ol style="line-height: 1.8;">
                    <li>Go to <a href="https://vercel.com/dashboard">Vercel Dashboard</a></li>
                    <li>Select your project: <strong>pure-tasks-backend</strong></li>
                    <li>Click <strong>Settings</strong> → <strong>Environment Variables</strong></li>
                    <li>Add the missing variables listed above</li>
                    <li>Select <strong>Production</strong>, <strong>Preview</strong>, and <strong>Development</strong> for each variable</li>
                    <li>Click <strong>Save</strong></li>
                    <li>Go to <strong>Deployments</strong> tab and click <strong>Redeploy</strong></li>
                </ol>

                <h2>Additional Required Variables:</h2>
                <pre style="background: #f4f4f4; padding: 20px; border-radius: 5px; overflow-x: auto;">
  - CORS_ORIGINS: http://localhost:3000,https://your-frontend.vercel.app
  - ENVIRONMENT: production
  - FRONTEND_URL: https://your-frontend.vercel.app
  - EMAIL_PROVIDER: console
  - FROM_EMAIL: noreply@puretasks.com
                </pre>

                <p style="margin-top: 30px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107;">
                    <strong>Note:</strong> After setting environment variables, you must redeploy for changes to take effect.
                </p>

                <p style="margin-top: 20px; color: #666;">
                    For detailed instructions, see: <code>CRITICAL_FIX_ROOT_DIRECTORY.md</code> in the backend folder.
                </p>
            </body>
            </html>
            """

            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [
                    [b"content-type", b"text/html; charset=utf-8"],
                ],
            })
            await send({
                "type": "http.response.body",
                "body": error_html.encode("utf-8"),
            })

    handler = app
else:
    # All required env vars present, import the actual app
    try:
        from src.main import app
        handler = app
    except Exception as e:
        # If import fails for other reasons, show the error
        import traceback
        error_details = traceback.format_exc()

        async def app(scope, receive, send):
            if scope["type"] == "http":
                error_html = f"""
                <html>
                <head><title>Application Error</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                    <h1 style="color: #e74c3c;">⚠️ Application Startup Error</h1>
                    <p style="font-size: 18px;">The backend server failed to start due to an error.</p>

                    <h2>Error Details:</h2>
                    <pre style="background: #f4f4f4; padding: 20px; border-radius: 5px; overflow-x: auto; font-size: 12px;">
{error_details}
                    </pre>

                    <p style="margin-top: 20px; color: #666;">
                        Check Vercel Function Logs for more details.
                    </p>
                </body>
                </html>
                """

                await send({
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [
                        [b"content-type", b"text/html; charset=utf-8"],
                    ],
                })
                await send({
                    "type": "http.response.body",
                    "body": error_html.encode("utf-8"),
                })

        handler = app
