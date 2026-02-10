'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckSquare, MessageSquare, BarChart3, ArrowRight, Check } from 'lucide-react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-emerald-50 to-transparent blur-3xl opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-emerald-700">AI-Powered Task Management</span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                Intelligent Task
                <span className="block text-emerald-600 mt-2">
                  Management
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl font-light">
                Streamline your workflow with AI-powered task management. Organize, prioritize, and accomplish more with intelligent automation.
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: MessageSquare, text: 'AI Assistant' },
                { icon: BarChart3, text: 'Analytics' },
                { icon: CheckSquare, text: 'Smart Tasks' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white border-2 border-slate-200 text-slate-900 font-semibold hover:border-slate-300 hover:shadow-sm transition-all duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200">
              {[
                'No credit card required',
                'Free forever plan',
                'Enterprise-grade security'
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-slate-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-600 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">2M+</div>
                <div className="text-sm text-slate-600 mt-1">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600 mt-1">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Preview */}
          <div
            className={`relative transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative">
              {/* Main Chat Card */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        {/* <MessageSquare className="w-5 h-5 text-white" /> */}
                        <img src="/Logo.png" alt="AI-Logo" className='w-10 h-10' />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">Pure Task Assistant</h3>
                        <p className="text-sm text-emerald-100">Ready to help</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                      <span className="text-sm text-emerald-100">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 bg-slate-50 h-80 overflow-y-auto">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg rounded-tr-sm max-w-xs">
                      <p className="text-sm">Create a task to review the Q1 report by Friday</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg rounded-tl-sm max-w-xs">
                      <p className="text-sm text-slate-700 mb-3">Task created successfully:</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Review Q1 Report</p>
                            <p className="text-xs text-slate-600 mt-1">Due: Friday</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">High Priority</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg rounded-tr-sm max-w-xs">
                      <p className="text-sm">Show my productivity stats</p>
                    </div>
                  </div>

                  {/* AI Response with Stats */}
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg rounded-tl-sm max-w-xs">
                      <p className="text-sm text-slate-700 mb-3">Your productivity overview:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                          <div className="text-xl font-bold text-emerald-600">12</div>
                          <div className="text-xs text-slate-600">Completed</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                          <div className="text-xl font-bold text-blue-600">4</div>
                          <div className="text-xs text-slate-600">In Progress</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ask AI to manage your tasks..."
                      className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                      disabled
                    />
                    <button className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtle Shadow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100/20 to-slate-100/20 rounded-3xl blur-2xl -z-10 opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
