'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare,
  CheckSquare,
  BarChart3,
  Calendar,
  Flag,
  Zap,
  TrendingUp,
  Smartphone,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI-Powered Assistant',
    description: 'Natural language task management through intelligent conversation. Create, update, and organize tasks effortlessly.',
    color: 'emerald',
  },
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description: 'Intuitive organization with drag-and-drop interface. Prioritize and categorize tasks with intelligent automation.',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive productivity insights with visual dashboards. Track completion rates and identify trends.',
    color: 'purple',
  },
  {
    icon: Calendar,
    title: 'Calendar Integration',
    description: 'Visual timeline with deadline tracking. Smart reminders ensure you never miss important dates.',
    color: 'amber',
  },
  {
    icon: Flag,
    title: 'Priority Management',
    description: 'Color-coded priority system with intelligent suggestions. Focus on what matters most.',
    color: 'rose',
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Instant updates across all devices. Stay synchronized with seamless cloud integration.',
    color: 'cyan',
  },
  {
    icon: TrendingUp,
    title: 'Productivity Metrics',
    description: 'AI-powered scoring and personalized insights. Track progress and celebrate achievements.',
    color: 'pink',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Responsive interface optimized for all devices. Native-like experience everywhere.',
    color: 'indigo',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
};

export default function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 60);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-semibold text-emerald-700">Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Everything You Need
            <span className="block text-emerald-600 mt-2">
              To Stay Productive
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Comprehensive tools designed for modern professionals who value efficiency and simplicity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];

            return (
              <div
                key={index}
                className={`group relative bg-white rounded-xl p-6 border border-slate-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Bottom Border Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg} ${colors.border} border-t transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-24 bg-slate-50 rounded-2xl p-10 md:p-16 border border-slate-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Trusted by Teams Worldwide
            </h3>
            <p className="text-lg text-slate-600">
              Join thousands of professionals optimizing their workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, text: 'Fast Performance', color: 'amber' },
              { icon: CheckSquare, text: 'Easy to Use', color: 'emerald' },
              { icon: Smartphone, text: 'Mobile Ready', color: 'blue' },
              { icon: TrendingUp, text: 'AI Powered', color: 'purple' },
            ].map((item, index) => {
              const Icon = item.icon;
              const colors = colorMap[item.color];
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 text-center">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-slate-200">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '2M+', label: 'Tasks Completed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
