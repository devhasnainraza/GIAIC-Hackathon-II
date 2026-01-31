'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronRight } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AIChatPreview from '@/components/landing/AIChatPreview';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import InteractivePreview from '@/components/landing/InteractivePreview';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import { getUser } from '@/lib/auth';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Testimonials', href: '#testimonials' },
];

/**
 * Pure Tasks - Premium AI-Powered Landing Page
 * Automatically redirects logged-in users to dashboard
 */
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      {/* Enhanced Professional Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/brand-logo.PNG"
                  alt="Pure Tasks"
                  width={36}
                  height={36}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-tight">Pure Tasks</span>
                <span className="text-xs text-emerald-600 font-medium leading-tight">AI-Powered</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/signin"
                className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="group relative px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 py-6 bg-white border-t border-slate-100 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <Link
                href="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-3 text-center text-base font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-6 py-3 text-center text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <AIChatPreview />
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
