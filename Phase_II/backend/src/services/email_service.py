"""
Email Service for sending transactional emails.

Supports multiple email providers:
1. Resend (Recommended - Modern, free tier, easy setup)
2. Gmail SMTP (Free, uses your Gmail account)
3. Console (Development - prints to console)
"""
import os
import secrets
import logging
from typing import Optional
from datetime import datetime, timedelta
from src.config import settings

# Setup logging
logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails using various providers."""

    def __init__(self):
        # Load provider from settings (not os.getenv)
        self.provider = settings.EMAIL_PROVIDER.lower()

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """
        Send password reset email to user.

        Args:
            to_email: Recipient email address
            reset_token: Password reset token

        Returns:
            True if email sent successfully, False otherwise
        """
        logger.info(f"Preparing password reset email for: {to_email}")

        # Enforce HTTPS in production
        if settings.ENVIRONMENT == "production" and not settings.FRONTEND_URL.startswith("https://"):
            logger.error("FRONTEND_URL must use HTTPS in production")
            raise ValueError("FRONTEND_URL must use HTTPS in production")

        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

        subject = "Reset Your Password - Pure Tasks"
        html_content = self._get_password_reset_html(reset_link)
        text_content = self._get_password_reset_text(reset_link)

        try:
            result = await self._send_email(to_email, subject, html_content, text_content)

            if result:
                logger.info(f"Password reset email sent successfully to: {to_email}")
            else:
                logger.error(f"Failed to send password reset email to: {to_email}")

            return result
        except Exception as e:
            logger.error(f"Error sending password reset email to {to_email}: {e}", exc_info=True)
            return False

    async def _send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str
    ) -> bool:
        """
        Send email using configured provider.

        Args:
            to_email: Recipient email
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text email body

        Returns:
            True if sent successfully
        """
        try:
            if self.provider == "resend":
                return await self._send_via_resend(to_email, subject, html_content)
            elif self.provider == "gmail":
                return await self._send_via_gmail(to_email, subject, html_content, text_content)
            else:
                # Console mode for development
                return self._send_via_console(to_email, subject, text_content)
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    async def _send_via_resend(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email via Resend API."""
        try:
            import resend

            if not settings.RESEND_API_KEY:
                logger.error("RESEND_API_KEY not configured")
                return False

            resend.api_key = settings.RESEND_API_KEY

            params = {
                "from": settings.FROM_EMAIL,
                "to": [to_email],
                "subject": subject,
                "html": html_content,
            }

            email = resend.Emails.send(params)
            logger.info(f"Email sent via Resend: {email}")
            return True
        except Exception as e:
            logger.error(f"Resend error: {e}")
            return False

    async def _send_via_gmail(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str
    ) -> bool:
        """Send email via Gmail SMTP."""
        try:
            import aiosmtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            if not settings.GMAIL_EMAIL or not settings.GMAIL_APP_PASSWORD:
                logger.error("Gmail credentials not configured")
                return False

            # Create message
            message = MIMEMultipart("alternative")
            message["From"] = settings.GMAIL_EMAIL
            message["To"] = to_email
            message["Subject"] = subject

            # Add text and HTML parts
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            message.attach(part1)
            message.attach(part2)

            # Send via Gmail SMTP
            await aiosmtplib.send(
                message,
                hostname="smtp.gmail.com",
                port=587,
                start_tls=True,
                username=settings.GMAIL_EMAIL,
                password=settings.GMAIL_APP_PASSWORD,
            )

            logger.info(f"Email sent via Gmail to: {to_email}")
            return True
        except Exception as e:
            logger.error(f"Gmail SMTP error: {e}")
            return False

    def _send_via_console(self, to_email: str, subject: str, text_content: str) -> bool:
        """Print email to console (development mode)."""
        try:
            print("/n" + "="*80)
            print("EMAIL (Console Mode - Development Only)")
            print("="*80)
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("-"*80)
            # Remove emojis and special characters for Windows console
            safe_content = text_content.encode('ascii', 'ignore').decode('ascii')
            print(safe_content)
            print("="*80 + "/n")
        except Exception as e:
            # Fallback if encoding fails
            print("/n" + "="*80)
            print("EMAIL (Console Mode)")
            print("="*80)
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("-"*80)
            print("[Email content contains special characters]")
            print(f"Reset link: {text_content.split('http')[1].split()[0] if 'http' in text_content else 'See email'}")
            print("="*80 + "/n")
        return True

    def _get_password_reset_html(self, reset_link: str) -> str:
        """Get HTML template for password reset email."""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                                Hi there,
                            </p>
                            <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your <strong>Pure Tasks</strong> account. Click the button below to create a new password:
                            </p>

                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{reset_link}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0 0 20px; padding: 12px; background-color: #f1f5f9; border-radius: 8px; color: #475569; font-size: 14px; word-break: break-all;">
                                {reset_link}
                            </p>

                            <p style="margin: 20px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                <strong>This link will expire in 24 hours.</strong>
                            </p>

                            <p style="margin: 20px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #94a3b8; font-size: 14px;">
                                Best regards,<br>
                                <strong style="color: #059669;">The Pure Tasks Team</strong>
                            </p>
                            <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 12px;">
                                2026 Pure Tasks. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

    def _get_password_reset_text(self, reset_link: str) -> str:
        """Get plain text template for password reset email."""
        return f"""
Reset Your Password - Pure Tasks

Hi there,

We received a request to reset your password for your Pure Tasks account.

Click the link below to create a new password:
{reset_link}

This link will expire in 24 hours.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The Pure Tasks Team

2026 Pure Tasks. All rights reserved.
"""


def generate_reset_token() -> str:
    """Generate a secure random token for password reset."""
    return secrets.token_urlsafe(32)


def get_token_expiry() -> datetime:
    """Get expiry time for reset token (24 hours from now)."""
    return datetime.utcnow() + timedelta(hours=24)


# Singleton instance
email_service = EmailService()


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str = ""
) -> bool:
    """
    Send email using the configured email provider.

    This is a convenience function that uses the singleton EmailService instance.

    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_content: HTML email body
        text_content: Plain text email body (optional)

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    return await email_service._send_email(to_email, subject, html_content, text_content)
