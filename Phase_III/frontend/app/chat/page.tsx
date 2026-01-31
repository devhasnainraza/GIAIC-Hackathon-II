'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import ConversationList from '@/components/chat/ConversationList';
import FloatingChatButton from '@/components/chat/FloatingChatButton';
import ChatWidget from '@/components/chat/ChatWidget';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Responsive Chat Page - Matches Landing Page Design
 *
 * Desktop/Tablet (≥768px): Full page with resizable sidebar
 * Mobile (<768px): Floating chat widget with popup
 */
export default function ChatPage() {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      const smallMobile = width < 768;

      setIsMobile(mobile);
      setIsSmallMobile(smallMobile);

      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load saved sidebar state
  useEffect(() => {
    const savedWidth = localStorage.getItem('chatSidebarWidth');
    const savedCollapsed = localStorage.getItem('chatSidebarCollapsed');

    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth));
    }
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      if (newWidth >= 280 && newWidth <= 480) {
        setSidebarWidth(newWidth);
        localStorage.setItem('chatSidebarWidth', newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleConversationCreated = (newConversationId: number) => {
    setConversationId(newConversationId);
    router.push(`/chat/${newConversationId}`);
  };

  const handleConversationSelect = (selectedId: number) => {
    setConversationId(selectedId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    router.push(`/chat/${selectedId}`);
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('chatSidebarCollapsed', newCollapsed.toString());
  };

  const handleResizeStart = () => {
    if (!isMobile && !isCollapsed) {
      setIsResizing(true);
    }
  };

  // Mobile Widget View
  if (isSmallMobile) {
    return (
      <>
        <FloatingChatButton
          isOpen={chatWidgetOpen}
          onClick={() => setChatWidgetOpen(!chatWidgetOpen)}
        />
        <ChatWidget
          isOpen={chatWidgetOpen}
          onClose={() => setChatWidgetOpen(false)}
        />
      </>
    );
  }

  // Desktop/Tablet Full Page View
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Mobile Menu Button - Tablet Only */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      )}

      {/* Sidebar - Conversation List */}
      <aside
        className={`fixed lg:relative h-full bg-white border-r-2 border-slate-200 shadow-xl transition-all duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? '' : 'lg:translate-x-0'}`}
        style={{
          width: isMobile ? '85vw' : isCollapsed ? '80px' : `${sidebarWidth}px`,
          maxWidth: isMobile ? '360px' : 'none',
          transitionProperty: isResizing ? 'none' : 'all'
        }}
      >
        <div className="flex flex-col h-full relative">
          {/* Resize Handle - Desktop Only */}
          {!isMobile && !isCollapsed && (
            <div
              className="absolute right-0 top-0 bottom-0 w-[3px] group z-20 cursor-col-resize"
              onMouseDown={handleResizeStart}
            >
              <div className="absolute inset-y-0 -left-2 -right-2" />
              <div className="absolute inset-y-0 left-0 w-[3px] bg-slate-200 group-hover:bg-emerald-500 transition-colors" />
            </div>
          )}

          {/* Collapse Toggle - Desktop Only */}
          {!isMobile && (
            <button
              onClick={handleToggleCollapse}
              className="absolute -right-3 top-6 z-30 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-500 transition-all shadow-md"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-hidden">
            <ConversationList
              currentConversationId={conversationId}
              onConversationSelect={handleConversationSelect}
              isCollapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay - Tablet Only */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;

            const handleTouchMove = (e: TouchEvent) => {
              const touch = e.touches[0];
              const currentX = touch.clientX;
              const diff = currentX - startX;

              if (diff < -50) {
                setIsSidebarOpen(false);
                document.removeEventListener('touchmove', handleTouchMove);
              }
            };

            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', () => {
              document.removeEventListener('touchmove', handleTouchMove);
            }, { once: true });
          }}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 overflow-hidden">
          <ChatInterface
            conversationId={conversationId}
            onConversationCreated={handleConversationCreated}
          />
        </div>
      </div>
    </div>
  );
}
