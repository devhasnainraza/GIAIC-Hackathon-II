'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, Plus, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. No credit card required, no complicated setup process.',
    icon: UserPlus,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    number: '02',
    title: 'Add Your Tasks',
    description: 'Quickly capture all your tasks, ideas, and to-dos. Organize them with tags, priorities, and due dates.',
    icon: Plus,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    number: '03',
    title: 'Stay Productive',
    description: 'Focus on completing tasks one at a time. Track your progress and celebrate your achievements.',
    icon: TrendingUp,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [lineProgress, setLineProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate steps sequentially
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
              }, index * 400);
            });

            // Animate connecting line
            setTimeout(() => {
              setLineProgress(100);
            }, 200);

            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <span className="text-sm font-semibold text-emerald-700">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Get Started in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mt-2">
              Three Easy Steps
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            No learning curve, no complexity. Start being productive in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 transition-all duration-2000 ease-out"
              style={{ width: `${lineProgress}%` }}
            ></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 ${
                    visibleSteps.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  {/* Step Card */}
                  <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-transparent">
                    {/* Step Number Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 relative`}>
                          {step.number}
                        </div>
                        {/* Pulse Animation */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full animate-ping opacity-20`}></div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mt-8 mb-6">
                      <div className={`w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className={`w-10 h-10 ${step.iconColor}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center group-hover:text-emerald-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-center leading-relaxed">
                      {step.description}
                    </p>

                    {/* Gradient Border on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>

                    {/* Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-20`}></div>
                  </div>

                  {/* Connecting Arrow (Mobile) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-6">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <a
            href="/signup"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
          >
            Get Started Now
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
