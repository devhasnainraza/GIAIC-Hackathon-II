'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckSquare, Calendar, BarChart3, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-float"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50 animate-float-delayed"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Premium Task Management</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Organize Your Life
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mt-2">
                  Beautifully Simple
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl">
                A premium task management platform designed for professionals who value clarity, efficiency, and beautiful design.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></div>
              </Link>
              <Link
                href="/signin"
                className="group bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600">Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600">Cancel anytime</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <div className="text-3xl font-bold text-slate-900">10K+</div>
                <div className="text-sm text-slate-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-600">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Premium Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative group">
              {/* Main Dashboard Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-500 group-hover:shadow-emerald-500/20 group-hover:scale-[1.02]">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">My Tasks</h3>
                        <p className="text-sm text-emerald-100">Today, Jan 12</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-100">Live</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-xs text-emerald-100">Total</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-xs text-emerald-100">Done</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">4</div>
                      <div className="text-xs text-emerald-100">Active</div>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="p-6 space-y-3">
                  {[
                    { title: 'Review Q1 Analytics Report', status: 'done', priority: 'high', time: '9:00 AM' },
                    { title: 'Team Standup Meeting', status: 'done', priority: 'medium', time: '10:30 AM' },
                    { title: 'Update Project Documentation', status: 'active', priority: 'high', time: '2:00 PM' },
                    { title: 'Client Presentation Prep', status: 'active', priority: 'urgent', time: '4:00 PM' },
                  ].map((task, index) => (
                    <div
                      key={index}
                      className="group/task flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 hover:shadow-md"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                          task.status === 'done'
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 group-hover/task:border-emerald-400'
                        }`}
                      >
                        {task.status === 'done' && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              task.status === 'done'
                                ? 'text-slate-400 line-through'
                                : 'text-slate-700'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              task.priority === 'urgent'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'high'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{task.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Task
                  </button>
                </div>
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute -right-4 top-20 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Analytics</span>
                </div>
                <p className="text-xs text-slate-600">Track your productivity</p>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-amber-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs font-medium text-slate-500">Scroll to explore</span>
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
