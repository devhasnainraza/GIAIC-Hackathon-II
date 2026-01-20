"""Cloudinary cloud storage service for avatar uploads."""
import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
import io
from src.config import settings


class CloudinaryStorageService:
    """Service for handling file uploads to Cloudinary."""

    def __init__(self):
        """Initialize Cloudinary configuration."""
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )

    def validate_image(self, file: UploadFile) -> bool:
        """Validate uploaded image file."""
        # Check file type
        allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )

        # Check file size (5MB limit)
        max_size = 5 * 1024 * 1024  # 5MB
        if file.size and file.size > max_size:
            raise HTTPException(
                status_code=400,
                detail="File size too large. Maximum size is 5MB."
            )

        return True

    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        """
        Upload avatar to Cloudinary and return the public URL.

        Args:
            file: The uploaded file
            user_id: User ID for organizing uploads

        Returns:
            str: Public URL of the uploaded image
        """
        try:
            # Validate the file
            self.validate_image(file)

            # Read file content
            content = await file.read()

            # Upload to Cloudinary with transformations
            result = cloudinary.uploader.upload(
                content,
                folder=f"pure-tasks/avatars/{user_id}",
                public_id=f"avatar_{user_id}",
                overwrite=True,
                transformation=[
                    {
                        'width': 300,
                        'height': 300,
                        'crop': 'fill',
                        'gravity': 'face'
                    },
                    {
                        'quality': 'auto:good',
                        'fetch_format': 'auto'
                    }
                ],
                tags=['avatar', f'user_{user_id}']
            )

            # Return the secure URL
            return result['secure_url']

        except cloudinary.exceptions.Error as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload to Cloudinary: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error uploading avatar: {str(e)}"
            )

    def delete_avatar(self, avatar_url: str) -> bool:
        """
        Delete avatar from Cloudinary.

        Args:
            avatar_url: The Cloudinary URL of the image

        Returns:
            bool: True if deleted successfully
        """
        try:
            # Extract public_id from URL
            # URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            if 'cloudinary.com' not in avatar_url:
                return False

            # Extract public_id from URL
            parts = avatar_url.split('/')
            if 'upload' in parts:
                upload_index = parts.index('upload')
                # Get everything after 'upload' and version
                public_id_parts = parts[upload_index + 2:]  # Skip 'upload' and version
                public_id = '/'.join(public_id_parts).split('.')[0]  # Remove extension

                # Delete from Cloudinary
                result = cloudinary.uploader.destroy(public_id)
                return result.get('result') == 'ok'

            return False

        except Exception as e:
            print(f"Error deleting from Cloudinary: {str(e)}")
            return False

    def get_avatar_url(self, avatar_url: Optional[str], base_url: str = None) -> Optional[str]:
        """
        Return the avatar URL (already a full URL from Cloudinary).

        Args:
            avatar_url: The Cloudinary URL
            base_url: Not used for Cloudinary (kept for compatibility)

        Returns:
            Optional[str]: The avatar URL or None
        """
        return avatar_url


# Global instance
cloudinary_storage = CloudinaryStorageService()
