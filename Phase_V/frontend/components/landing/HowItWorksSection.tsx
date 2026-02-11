'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, Plus, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. No credit card required, no complicated setup.',
    icon: UserPlus,
    color: 'emerald',
  },
  {
    number: '02',
    title: 'Add Your Tasks',
    description: 'Capture tasks, ideas, and to-dos. Organize with tags, priorities, and due dates.',
    icon: Plus,
    color: 'blue',
  },
  {
    number: '03',
    title: 'Stay Productive',
    description: 'Focus on completing tasks. Track progress and achieve your goals efficiently.',
    icon: TrendingUp,
    color: 'purple',
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
              }, index * 200);
            });
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-semibold text-emerald-700">Simple Process</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Get Started in
            <span className="block text-emerald-600 mt-2">
              Three Easy Steps
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            No learning curve, no complexity. Start being productive in minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-slate-200 -z-10">
            <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: visibleSteps.length > 0 ? '100%' : '0%' }}></div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];

            return (
              <div
                key={index}
                className={`relative transition-all duration-500 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step Card */}
                <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-center leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
