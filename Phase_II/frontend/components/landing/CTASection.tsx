'use client';

import { useState, MouseEvent } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Shield, CheckCircle, ArrowRight, Star, Users, TrendingUp, Award } from 'lucide-react';

export default function CTASection() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const createRipple = (event: MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  const features = [
    { icon: Zap, text: 'Lightning Fast', color: 'from-amber-500 to-amber-600' },
    { icon: Shield, text: 'Secure & Private', color: 'from-blue-500 to-blue-600' },
    { icon: CheckCircle, text: 'Easy to Use', color: 'from-emerald-500 to-emerald-600' },
    { icon: Users, text: 'Team Collaboration', color: 'from-purple-500 to-purple-600' },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '4.9/5', label: 'User Rating', icon: Star },
    { value: '98%', label: 'Satisfaction', icon: TrendingUp },
    { value: '24/7', label: 'Support', icon: Award },
  ];

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/30 to-amber-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98130_1px,transparent_1px),linear-gradient(to_bottom,#10b98130_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Badge */}
          <div className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-500 rounded-full text-white text-sm font-bold shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 hover:scale-105 animate-pulse-slow overflow-hidden">
            {/* Shine Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

            <Sparkles className="w-4 h-4 animate-pulse relative z-10" />
            <span className="relative z-10">Limited Time Offer • Premium Features Free Forever</span>
            <Sparkles className="w-4 h-4 animate-pulse relative z-10" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Ready to Transform
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 mt-2 animate-gradient">
              Your Productivity?
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Join over 50,000 professionals who have transformed their workflow with Pure Tasks.
            Start organizing your life today with our premium features.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                    hoveredFeature === index ? 'shadow-2xl shadow-emerald-500/20' : ''
                  }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="text-sm md:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feature.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-8">
            <Link
              href="/signup"
              onClick={createRipple}
              className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 md:px-12 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Ripple Effects */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                  }}
                />
              ))}

              {/* Shine Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </Link>

            <Link
              href="/signin"
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 hover:border-emerald-400/50 text-white px-10 md:px-12 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 pt-6 md:pt-8 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm md:text-base font-medium">Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm md:text-base font-medium">No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm md:text-base font-medium">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm md:text-base font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-slate-400 mb-6 text-sm md:text-base font-medium">
            Trusted by professionals worldwide
          </p>
          <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400 hover:scale-125 transition-transform duration-300" />
            ))}
            <span className="ml-2 text-lg md:text-xl text-white font-bold">4.9/5</span>
            <span className="text-slate-400 text-sm md:text-base">from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
