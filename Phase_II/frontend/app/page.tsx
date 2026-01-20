'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import InteractivePreview from '@/components/landing/InteractivePreview';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import UserMenu from '@/components/ui/UserMenu';
import { getUser } from '@/lib/auth';

/**
 * Pure Tasks - Premium Minimalist Landing Page
 * Automatically redirects logged-in users to dashboard
 */
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setIsLoading(false);

    // Redirect logged-in users to dashboard
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render landing page if user is logged in (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 scroll-smooth">
      {/* Professional Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="bg-emerald-600 rounded-lg p-2 transition-colors group-hover:bg-emerald-700">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Pure Tasks</h1>
              </div>
            </Link>

            {/* Navigation Buttons - Visible on all screen sizes */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/signin"
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors px-3 sm:px-4 py-2 text-sm sm:text-base"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <InteractivePreview />
        <StatsSection />
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
