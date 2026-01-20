"""File storage utilities for handling avatar uploads."""
import os
import uuid
import shutil
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException
from PIL import Image
import io

class FileStorageService:
    """Service for handling file uploads and storage."""

    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.avatars_dir = self.upload_dir / "avatars"
        self._ensure_directories()

    def _ensure_directories(self):
        """Ensure upload directories exist."""
        self.upload_dir.mkdir(exist_ok=True)
        self.avatars_dir.mkdir(exist_ok=True)

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

    def generate_filename(self, original_filename: str) -> str:
        """Generate unique filename for uploaded file."""
        file_extension = Path(original_filename).suffix.lower()
        unique_id = str(uuid.uuid4())
        return f"{unique_id}{file_extension}"

    def resize_avatar(self, image_data: bytes, size: Tuple[int, int] = (300, 300)) -> bytes:
        """Resize avatar image to specified dimensions."""
        try:
            image = Image.open(io.BytesIO(image_data))

            # Convert to RGB if necessary (for PNG with transparency)
            if image.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background

            # Resize image maintaining aspect ratio
            image.thumbnail(size, Image.Resampling.LANCZOS)

            # Create a square image with white background
            square_image = Image.new('RGB', size, (255, 255, 255))

            # Center the resized image
            x = (size[0] - image.width) // 2
            y = (size[1] - image.height) // 2
            square_image.paste(image, (x, y))

            # Save to bytes
            output = io.BytesIO()
            square_image.save(output, format='JPEG', quality=85, optimize=True)
            return output.getvalue()

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error processing image: {str(e)}"
            )

    async def save_avatar(self, file: UploadFile, user_id: int) -> str:
        """Save avatar file and return the file path."""
        # Validate the file
        self.validate_image(file)

        # Read file content
        content = await file.read()

        # Resize the image
        resized_content = self.resize_avatar(content)

        # Generate filename
        filename = self.generate_filename(file.filename or "avatar.jpg")
        file_path = self.avatars_dir / filename

        # Save the file
        with open(file_path, "wb") as f:
            f.write(resized_content)

        # Return relative path for URL generation
        return f"avatars/{filename}"

    def delete_avatar(self, file_path: str) -> bool:
        """Delete avatar file."""
        try:
            full_path = self.upload_dir / file_path
            if full_path.exists():
                full_path.unlink()
                return True
            return False
        except Exception:
            return False

    def get_avatar_url(self, file_path: Optional[str], base_url: str) -> Optional[str]:
        """Generate full URL for avatar."""
        if not file_path:
            return None
        return f"{base_url}/uploads/{file_path}"

# Global instance
file_storage = FileStorageService()