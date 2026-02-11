'use client';

import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import ConversationList from './ConversationList';
import { X, Menu } from 'lucide-react';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: number | null;
}

/**
 * Mobile Chat Widget - Popup Style - Matches Landing Page Design
 *
 * Features:
 * - Popup from bottom-right
 * - Gradient header (emerald to purple)
 * - Sidebar toggle for conversations
 * - Full chat interface in compact view
 * - Smooth animations
 */
export default function ChatWidget({ isOpen, onClose, initialConversationId }: ChatWidgetProps) {
  const [conversationId, setConversationId] = useState<number | null>(initialConversationId || null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Update conversationId when initialConversationId changes
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  const handleConversationCreated = (newConversationId: number) => {
    setConversationId(newConversationId);
  };

  const handleConversationSelect = (selectedId: number) => {
    setConversationId(selectedId);
    setShowSidebar(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Chat Widget Popup */}
      <div className="fixed bottom-0 right-0 w-full h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col animate-slideUp overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Conversations */}
          {showSidebar && (
            <>
              <div
                className="absolute inset-0 bg-black/30 z-10"
                onClick={() => setShowSidebar(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white z-20 shadow-xl">
                <ConversationList
                  currentConversationId={conversationId}
                  onConversationSelect={handleConversationSelect}
                  isMobile={true}
                  onClose={() => setShowSidebar(false)}
                />
              </div>
            </>
          )}

          {/* Chat Interface */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              conversationId={conversationId}
              onConversationCreated={handleConversationCreated}
            />
          </div>
        </div>
      </div>
    </>
  );
}
