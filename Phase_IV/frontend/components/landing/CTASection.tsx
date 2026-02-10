'use client';

import Link from 'next/link';
import { ArrowRight, Check, MessageSquare } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Subtle Gradient Accent */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-emerald-50 to-transparent blur-3xl opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-emerald-700">Get Started Today</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Ready to Transform
              <span className="block text-emerald-600 mt-2">
                Your Productivity?
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
              Join thousands of professionals who have streamlined their workflow with Pure Tasks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white border-2 border-slate-200 text-slate-900 font-semibold hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
                Sign In
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <MessageSquare className="w-5 h-5" />
                Try AI Chat
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-slate-600">
              {[
                'Free Forever',
                'No Credit Card',
                'AI-Powered',
                '24/7 Support'
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '2M+', label: 'Tasks Completed' },
                { value: '4.9/5', label: 'User Rating' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-4 text-sm font-medium">
              Trusted by professionals worldwide
            </p>
            <div className="flex justify-center items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-lg text-slate-900 font-bold">4.9/5</span>
              <span className="text-slate-600 text-sm">from 2,000+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
