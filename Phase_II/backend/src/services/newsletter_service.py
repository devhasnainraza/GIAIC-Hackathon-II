"""Email service for newsletter functionality."""
import logging
from typing import Optional
from src.services.email_provider import send_email
from src.config import settings

logger = logging.getLogger(__name__)


async def send_newsletter_confirmation(email: str, verification_token: str) -> bool:
    """
    Send newsletter subscription confirmation email.

    Args:
        email: Subscriber email address
        verification_token: Verification token for email confirmation

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    verification_url = f"{settings.FRONTEND_URL}/newsletter/verify/{verification_token}"

    subject = "Confirm Your Newsletter Subscription - Pure Tasks"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .button {{
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Welcome to Pure Tasks Newsletter!</h1>
        </div>
        <div class="content">
            <h2>Confirm Your Subscription</h2>
            <p>Thank you for subscribing to the Pure Tasks newsletter! You're one step away from receiving:</p>
            <ul>
                <li>📊 Productivity tips and best practices</li>
                <li>🚀 Product updates and new features</li>
                <li>💡 Task management insights</li>
                <li>🎯 Exclusive content and resources</li>
            </ul>
            <p>Please confirm your email address by clicking the button below:</p>
            <div style="text-align: center;">
                <a href="{verification_url}" class="button">Confirm Subscription</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
                Or copy and paste this link into your browser:<br>
                {verification_url}
            </p>
            <p style="margin-top: 30px;">
                If you didn't subscribe to our newsletter, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>© 2026 Pure Tasks. All rights reserved.</p>
            <p>Made with ❤️ for productivity</p>
        </div>
    </body>
    </html>
    """

    text_content = f"""
    Welcome to Pure Tasks Newsletter!

    Thank you for subscribing! Please confirm your email address by visiting:
    {verification_url}

    You'll receive:
    - Productivity tips and best practices
    - Product updates and new features
    - Task management insights
    - Exclusive content and resources

    If you didn't subscribe, you can safely ignore this email.

    © 2026 Pure Tasks. All rights reserved.
    """

    try:
        success = await send_email(
            to_email=email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

        if success:
            logger.info(f"Newsletter confirmation email sent to {email}")
        else:
            logger.error(f"Failed to send newsletter confirmation email to {email}")

        return success
    except Exception as e:
        logger.error(f"Error sending newsletter confirmation email to {email}: {str(e)}")
        return False


async def send_newsletter_update(
    email: str,
    subject: str,
    content: str,
    unsubscribe_token: Optional[str] = None
) -> bool:
    """
    Send newsletter update to subscriber.

    Args:
        email: Subscriber email address
        subject: Email subject
        content: Newsletter content (HTML)
        unsubscribe_token: Optional token for unsubscribe link

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    unsubscribe_url = f"{settings.FRONTEND_URL}/newsletter/unsubscribe?email={email}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: white;
                padding: 30px;
                border: 1px solid #e5e7eb;
            }}
            .footer {{
                background: #f9fafb;
                padding: 20px;
                text-align: center;
                border-radius: 0 0 10px 10px;
                color: #6b7280;
                font-size: 14px;
            }}
            .unsubscribe {{
                color: #6b7280;
                text-decoration: none;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Pure Tasks Newsletter</h1>
        </div>
        <div class="content">
            {content}
        </div>
        <div class="footer">
            <p>© 2026 Pure Tasks. All rights reserved.</p>
            <p>
                <a href="{unsubscribe_url}" class="unsubscribe">Unsubscribe from this newsletter</a>
            </p>
        </div>
    </body>
    </html>
    """

    text_content = f"""
    Pure Tasks Newsletter

    {content}

    ---
    © 2026 Pure Tasks. All rights reserved.

    Unsubscribe: {unsubscribe_url}
    """

    try:
        success = await send_email(
            to_email=email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

        if success:
            logger.info(f"Newsletter update sent to {email}")
        else:
            logger.error(f"Failed to send newsletter update to {email}")

        return success
    except Exception as e:
        logger.error(f"Error sending newsletter update to {email}: {str(e)}")
        return False


async def send_welcome_newsletter(email: str) -> bool:
    """
    Send welcome newsletter after email verification.

    Args:
        email: Subscriber email address

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    subject = "Welcome to Pure Tasks Newsletter! 🎉"

    content = """
    <h2>Welcome to the Pure Tasks Community!</h2>
    <p>We're thrilled to have you on board! 🚀</p>

    <p>As a subscriber, you'll be the first to know about:</p>
    <ul>
        <li><strong>New Features:</strong> Be the first to try our latest productivity tools</li>
        <li><strong>Pro Tips:</strong> Expert advice on task management and productivity</li>
        <li><strong>Success Stories:</strong> Learn from other users' experiences</li>
        <li><strong>Exclusive Content:</strong> Guides, templates, and resources</li>
    </ul>

    <h3>Get Started</h3>
    <p>Here are some resources to help you get the most out of Pure Tasks:</p>
    <ul>
        <li><a href="{settings.FRONTEND_URL}/docs">Documentation</a> - Learn all the features</li>
        <li><a href="{settings.FRONTEND_URL}/blog">Blog</a> - Read our latest articles</li>
        <li><a href="{settings.FRONTEND_URL}/community">Community</a> - Connect with other users</li>
    </ul>

    <p>Thank you for joining us on this productivity journey!</p>

    <p>Best regards,<br>
    The Pure Tasks Team</p>
    """

    return await send_newsletter_update(email, subject, content)
