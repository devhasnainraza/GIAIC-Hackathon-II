'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import LarkSidebar from './LarkSidebar';
import LarkTopHeader from './SimpleTopHeader';
import MobileBottomNav from './SimpleBottomNav';

interface LarkLayoutProps {
  children: React.ReactNode;
}

/**
 * Lark Base-inspired Layout with Resizable Sidebar
 *
 * Features:
 * - Desktop: Resizable sidebar (200-400px, collapsible to 64px)
 * - Mobile: Overlay sidebar with hamburger menu
 * - Smooth animations and localStorage persistence
 */
export default function LarkLayout({ children }: LarkLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const pathname = usePathname();

  // Load saved sidebar state from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');

    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth));
    }
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, always show sidebar; on mobile, always start closed
      setIsSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Handle resize mouse events
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isMobile) return;

    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', newWidth.toString());
    }
  }, [isResizing, isMobile]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = () => {
    if (!isMobile && !isCollapsed) {
      setIsResizing(true);
    }
  };

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  // Calculate actual sidebar width
  const actualSidebarWidth = isCollapsed ? 64 : sidebarWidth;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa]">
      {/* Sidebar - Desktop only, always visible */}
      {!isMobile && (
        <LarkSidebar
          isOpen={true}
          isMobile={false}
          width={actualSidebarWidth}
          isCollapsed={isCollapsed}
          isResizing={isResizing}
          onClose={() => {}}
          onResizeStart={handleResizeStart}
          onToggleCollapse={toggleCollapse}
        />
      )}

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          marginLeft: !isMobile ? `${actualSidebarWidth}px` : '0'
        }}
      >
        {/* Top Header */}
        <LarkTopHeader />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          <div className="p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation - only visible on mobile */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
