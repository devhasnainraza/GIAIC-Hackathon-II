'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, CheckCircle2, Zap, Star, TrendingUp } from 'lucide-react';

const stats = [
  { value: 50000, suffix: '+', label: 'Active Users', icon: Users, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
  { value: 2000000, suffix: '+', label: 'Tasks Completed', icon: CheckCircle2, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { value: 99.9, suffix: '%', label: 'Uptime', icon: Zap, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50' },
  { value: 4.9, suffix: '/5', label: 'User Rating', icon: Star, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
];

const companies = [
  { name: 'Google', logo: '🔍' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Meta', logo: '👥' },
  { name: 'Netflix', logo: '🎬' },
];

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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Trusted Worldwide</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Join Thousands of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500 mt-2">
              Happy Users
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Join a growing community of productive individuals and teams who trust Pure Tasks.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Trusted By Companies */}
        <div className="text-center">
          <p className="text-slate-600 mb-8 font-medium">
            Trusted by professionals at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companies.map((company, index) => (
              <div
                key={index}
                className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
              >
                <div className="text-4xl md:text-5xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {company.logo}
                </div>
                <span className="text-sm font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors duration-300">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, isVisible, delay }: { stat: typeof stats[0]; isVisible: boolean; delay: number }) {
  const count = useCountUp(stat.value, 2000, isVisible);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = stat.icon;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-transparent ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`w-7 h-7 text-${stat.color.split('-')[1]}-600`} />
        </div>
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
        {stat.value < 100 ? count.toFixed(1) : formatNumber(count)}
        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>{stat.suffix}</span>
      </div>

      {/* Label */}
      <div className="text-slate-600 font-medium">
        {stat.label}
      </div>

      {/* Gradient Border on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}></div>

      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-20`}></div>

      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
    </div>
  );
}
