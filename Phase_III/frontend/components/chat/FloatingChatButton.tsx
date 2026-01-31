'use client';

import { MessageSquare, X } from 'lucide-react';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

/**
 * Floating Chat Button for Mobile
 *
 * Features:
 * - Fixed position bottom-right
 * - Unread count badge
 * - Smooth animations
 * - Toggle between chat icon and close icon
 */
export default function FloatingChatButton({
  isOpen,
  onClick,
  unreadCount = 0,
}: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed right-6 z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
        isOpen
          ? 'bg-slate-700 hover:bg-slate-800'
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
      } active:scale-95`}
      style={{ bottom: 'calc(4rem + 1.5rem)' }}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <>
          <MessageSquare className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}
