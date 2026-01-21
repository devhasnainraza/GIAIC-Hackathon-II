'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckSquare, Zap, Shield, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  type: 'signin' | 'signup';
}

/**
 * Full-Screen Split Layout for Authentication
 * Left: Auth Form | Right: Branding & Features
 * Inspired by Lark Base / Slack design
 */
export function AuthLayout({ children, type }: AuthLayoutProps) {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Blazing fast performance with instant sync across all devices'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with end-to-end encryption'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time updates'
    },
    {
      icon: TrendingUp,
      title: 'Boost Productivity',
      description: 'Get 10x more done with smart task management'
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:max-w-md py-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mb-6 group">
            <div className="transition-all duration-300 group-hover:scale-105">
              <Image
                src="/brand-logo.PNG"
                alt="Pure Tasks"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Pure Tasks</h1>
              <p className="text-xs text-slate-500">Simplify your workflow</p>
            </div>
          </Link>

          {/* Form Content */}
          <div className="space-y-4">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              {type === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <Link
                href={type === 'signin' ? '/signup' : '/signin'}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {type === 'signin' ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center text-xs text-slate-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-700">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-slate-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content - with overflow scroll as fallback */}
        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-10 text-white py-6 overflow-y-auto">
          {/* Main Heading */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-3">
              <Star className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-semibold">Trusted by 10,000+ teams</span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-bold mb-2 leading-tight">
              {type === 'signin'
                ? 'Welcome back to Pure Tasks'
                : 'Start your productivity journey'}
            </h2>
            <p className="text-base text-emerald-100 leading-relaxed">
              {type === 'signin'
                ? 'Sign in to access your tasks and continue where you left off.'
                : 'Join thousands of teams who trust Pure Tasks to get things done.'}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-3 mb-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-start gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-0.5">{feature.title}</h3>
                  <p className="text-emerald-100 text-xs leading-snug">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-emerald-100">
            <span className="text-xs font-medium">Learn more about Pure Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
