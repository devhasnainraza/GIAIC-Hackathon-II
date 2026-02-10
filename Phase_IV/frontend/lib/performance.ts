/**
 * Performance Monitoring and Optimization Utilities
 *
 * This module provides performance monitoring, metrics collection,
 * and optimization utilities for the TaskMaster application.
 */

import React from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

// Performance observer for monitoring
class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      this.observeNavigationTiming();
    }

    // Monitor resource loading
    if ('PerformanceObserver' in window) {
      this.observeResourceTiming();
      this.observeLargestContentfulPaint();
      this.observeFirstInputDelay();
    }
  }

  private observeNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
    }
  }

  private observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('/api/')) {
          this.metrics.apiResponseTime = entry.duration;
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private observeLargestContentfulPaint() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.renderTime = lastEntry.startTime;
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  private observeFirstInputDelay() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Log first input delay for interactivity metrics
        // Type assertion for first-input entries which have processingStart
        const firstInputEntry = entry as any;
        if (firstInputEntry.processingStart) {
          console.log('First Input Delay:', firstInputEntry.processingStart - entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    return { ...this.metrics };
  }

  /**
   * Log performance metrics to console (development only)
   */
  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.table(this.getMetrics());
      console.groupEnd();
    }
  }

  /**
   * Clean up observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Memory leak prevention utilities
export class MemoryManager {
  private static intervals: Set<NodeJS.Timeout> = new Set();
  private static timeouts: Set<NodeJS.Timeout> = new Set();
  private static eventListeners: Map<EventTarget, Map<string, EventListener>> = new Map();

  /**
   * Safe interval that auto-cleans up
   */
  static setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay);
    this.intervals.add(interval);
    return interval;
  }

  /**
   * Safe timeout that auto-cleans up
   */
  static setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(timeout);
    }, delay);
    this.timeouts.add(timeout);
    return timeout;
  }

  /**
   * Safe event listener that auto-cleans up
   */
  static addEventListener(
    target: EventTarget,
    event: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(event, listener, options);

    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, new Map());
    }
    this.eventListeners.get(target)!.set(event, listener);
  }

  /**
   * Clean up all managed resources
   */
  static cleanup() {
    // Clear intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Clear timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();

    // Remove event listeners
    this.eventListeners.forEach((listeners, target) => {
      listeners.forEach((listener, event) => {
        target.removeEventListener(event, listener);
      });
    });
    this.eventListeners.clear();
  }
}

// Image optimization utilities
export class ImageOptimizer {
  /**
   * Lazy load images with intersection observer
   */
  static lazyLoadImages(selector: string = 'img[data-src]') {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const images = document.querySelectorAll(selector);

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Preload critical images
   */
  static preloadImages(urls: string[]) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Bundle optimization utilities
export class BundleOptimizer {
  /**
   * Preload critical chunks
   */
  static preloadChunks(chunkNames: string[]) {
    chunkNames.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/_next/static/chunks/${chunk}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Prefetch non-critical chunks
   */
  static prefetchChunks(chunkNames: string[]) {
    chunkNames.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/_next/static/chunks/${chunk}`;
      document.head.appendChild(link);
    });
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.cleanup();
    MemoryManager.cleanup();
  });

  // Log metrics in development
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.logMetrics();
      }, 2000);
    });
  }
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<Partial<PerformanceMetrics>>({});

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    updateMetrics();
    const interval = MemoryManager.setInterval(updateMetrics, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return metrics;
}

export default {
  PerformanceMonitor,
  MemoryManager,
  ImageOptimizer,
  BundleOptimizer,
  performanceMonitor
};