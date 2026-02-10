'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FloatingChatButton from './FloatingChatButton';
import ChatWidget from './ChatWidget';

/**
 * Global Chat Widget - Mobile Only
 *
 * Features:
 * - Floating button in bottom-right corner (mobile only)
 * - Opens chat popup on click
 * - Automatically hides on dedicated chat pages
 * - Only visible on screens < 768px (mobile/tablet)
 * - Desktop users access chat via navigation link
 */
export default function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide on dedicated chat pages to avoid duplicate chat interfaces
  const isChatPage = pathname?.startsWith('/chat');

  // Close widget when navigating to chat page
  useEffect(() => {
    if (isChatPage) {
      setIsOpen(false);
    }
  }, [isChatPage]);

  // Don't render on chat pages or on desktop
  if (isChatPage || !isMobile) {
    return null;
  }

  return (
    <>
      <FloatingChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
      <ChatWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
