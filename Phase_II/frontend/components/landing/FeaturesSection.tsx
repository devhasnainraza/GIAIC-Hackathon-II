'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckSquare, Eye, Zap, RefreshCw, Shield, Smartphone } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Smart Organization',
    description: 'Intelligent task categorization and priority management that adapts to your workflow and helps you focus on what matters most.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Eye,
    title: 'Focus Mode',
    description: 'Distraction-free environment that helps you concentrate on one task at a time with customizable focus sessions and break reminders.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Zap,
    title: 'Quick Capture',
    description: 'Instantly capture tasks with keyboard shortcuts, voice input, or quick add buttons. Never lose a thought or idea again.',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: RefreshCw,
    title: 'Cross-Device Sync',
    description: 'Seamlessly sync your tasks across all your devices in real-time. Access your tasks anywhere, anytime, on any device.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

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
              }, index * 150);
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <span className="text-sm font-semibold text-emerald-700">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mt-2">
              Stay Productive
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Powerful features wrapped in a beautiful, intuitive interface designed for modern professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-8 border border-slate-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-transparent ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-20`}></div>
              </div>
            );
          })}
        </div>

        {/* Additional Features List */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Shield, text: 'Secure', color: 'text-emerald-600' },
            { icon: Zap, text: 'Fast', color: 'text-amber-600' },
            { icon: Smartphone, text: 'Mobile', color: 'text-blue-600' },
            { icon: RefreshCw, text: 'Sync', color: 'text-purple-600' },
            { icon: Eye, text: 'Private', color: 'text-slate-600' },
            { icon: CheckSquare, text: 'Reliable', color: 'text-emerald-600' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 bg-slate-50 group-hover:bg-emerald-50 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors duration-300">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
