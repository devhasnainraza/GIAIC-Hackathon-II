'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, CheckCircle2, Zap, Star } from 'lucide-react';

const stats = [
  { value: 50000, suffix: '+', label: 'Active Users', icon: Users, color: 'emerald' },
  { value: 2000000, suffix: '+', label: 'Tasks Completed', icon: CheckCircle2, color: 'blue' },
  { value: 99.9, suffix: '%', label: 'Uptime', icon: Zap, color: 'amber' },
  { value: 4.9, suffix: '/5', label: 'User Rating', icon: Star, color: 'purple' },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return count;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-semibold text-emerald-700">Trusted Worldwide</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Join Thousands of
            <span className="block text-emerald-600 mt-2">
              Productive Professionals
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Trusted by teams and individuals who value efficiency and simplicity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, isVisible, delay }: { stat: typeof stats[0]; isVisible: boolean; delay: number }) {
  const count = useCountUp(stat.value, 2000, isVisible);
  const Icon = stat.icon;
  const colors = colorMap[stat.color];

  return (
    <div
      className={`bg-white rounded-xl p-8 border border-slate-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
        {stat.value < 100 ? count.toFixed(1) : formatNumber(count)}
        <span className={`${colors.text}`}>{stat.suffix}</span>
      </div>

      {/* Label */}
      <div className="text-sm text-slate-600 font-medium">
        {stat.label}
      </div>
    </div>
  );
}
