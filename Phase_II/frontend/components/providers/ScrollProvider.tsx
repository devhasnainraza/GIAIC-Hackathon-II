'use client';

import { useEffect } from 'react';
import { initScrollTrigger } from '@/lib/scroll-trigger';

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = initScrollTrigger();
    return cleanup;
  }, []);

  return <>{children}</>;
}