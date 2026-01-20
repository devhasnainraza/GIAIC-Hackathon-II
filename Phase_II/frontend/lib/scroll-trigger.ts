'use client';

// Auto-hide scrollbar functionality
let scrollTimeout: NodeJS.Timeout;

export function initScrollTrigger() {
  // Handle scrollbar auto-hide
  const handleScroll = () => {
    document.body.classList.add('scrolling');

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 1000); // Hide scrollbar 1 second after scrolling stops
  };

  // Handle scroll trigger animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-trigger class
  const scrollTriggerElements = document.querySelectorAll('.scroll-trigger');
  scrollTriggerElements.forEach((el) => observer.observe(el));

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    observer.disconnect();
    clearTimeout(scrollTimeout);
  };
}

// Hook for React components
export function useScrollTrigger() {
  if (typeof window !== 'undefined') {
    return initScrollTrigger();
  }
  return () => {};
}