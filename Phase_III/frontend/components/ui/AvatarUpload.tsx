'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Camera, X, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarChange?: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarUpload({
  currentAvatarUrl = null,
  onAvatarChange,
  size = 'md',
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------- size config -------------------- */
  const sizeMap = { sm: 64, md: 128, lg: 160 };
  const sizePx = sizeMap[size];

  /* -------------------- sync external avatar -------------------- */
  useEffect(() => {
    setPreview(currentAvatarUrl);
  }, [currentAvatarUrl]);

  /* -------------------- validation -------------------- */
  const validateFile = (file: File): string | null => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Only JPG, PNG or WebP images are allowed.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be under 5MB.';
    }
    return null;
  };

  /* -------------------- upload -------------------- */
  const uploadAvatar = async (file: File) => {
    const token = getToken();
    if (!token) {
      setError('Authentication required.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/avatar`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();
      console.log('Avatar upload response:', data);

      // Update preview with the returned avatar URL
      if (data.avatar_url) {
        setPreview(data.avatar_url);
        onAvatarChange?.(data.avatar_url);
      }

    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setError(err.message || 'Upload failed');
      setPreview(currentAvatarUrl);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* -------------------- delete -------------------- */
  const deleteAvatar = async () => {
    const token = getToken();
    if (!token) {
      setError('Authentication required.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/avatar`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Delete failed');
      }

      setPreview(null);
      onAvatarChange?.(null);

    } catch (err: any) {
      console.error('Avatar delete error:', err);
      setError(err.message || 'Delete failed');
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- handlers -------------------- */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setError(error);
      return;
    }

    uploadAvatar(file);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl"
        style={{ width: sizePx, height: sizePx }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
          </div>
        ) : preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error:', preview);
              setError('Failed to load image');
              setPreview(null);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <User className="text-gray-400 w-12 h-12" />
          </div>
        )}

        {!isUploading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 hover:opacity-100">
            <div className="bg-white/90 rounded-full p-2">
              <Camera className="text-gray-700 w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {preview && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteAvatar();
          }}
          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 font-medium transition-colors"
        >
          <X className="w-4 h-4" />
          Remove Avatar
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        hidden
      />

      {error && (
        <p className="text-xs text-red-600 text-center max-w-[200px]">
          {error}
        </p>
      )}
    </div>
  );
}
