'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    image: '👩‍💼',
    rating: 5,
    quote: 'Pure Tasks has completely transformed how I manage my daily workflow. The clean interface and powerful features make it a joy to use every day.',
    achievement: '300% productivity increase',
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    company: 'StartupXYZ',
    image: '👨‍💻',
    rating: 5,
    quote: 'As a developer, I appreciate the attention to detail and smooth performance. This is the most polished task manager I\'ve ever used.',
    achievement: 'Manages 50+ projects',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Designer',
    company: 'Independent',
    image: '👩‍🎨',
    rating: 5,
    quote: 'The minimalist design is exactly what I needed. No clutter, no distractions - just pure productivity. Highly recommend!',
    achievement: 'Completed 1000+ tasks',
  },
  {
    name: 'David Park',
    role: 'Marketing Director',
    company: 'GrowthCo',
    image: '👨‍💼',
    rating: 5,
    quote: 'Our entire team switched to Pure Tasks and productivity has increased significantly. The cross-device sync is seamless.',
    achievement: 'Team of 25 users',
  },
  {
    name: 'Lisa Anderson',
    role: 'CEO',
    company: 'InnovateLabs',
    image: '👩‍💼',
    rating: 5,
    quote: 'The best investment we made for our company. Pure Tasks keeps our entire organization aligned and productive.',
    achievement: 'Saved 20 hours/week',
  },
  {
    name: 'James Wilson',
    role: 'Entrepreneur',
    company: 'StartupHub',
    image: '👨‍💼',
    rating: 5,
    quote: 'I\'ve tried every task manager out there. Pure Tasks is the only one that stuck. It\'s simply the best.',
    achievement: '3 years active user',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Testimonials</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Loved by
            <span className="block text-emerald-600 mt-2">
              Thousands of Users
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            See what our users have to say about their experience with Pure Tasks.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 shadow-lg">
                    {/* Rating Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xl md:text-2xl text-slate-700 mb-8 text-center leading-relaxed">
                      "{testimonial.quote}"
                    </p>

                    {/* Achievement Badge */}
                    <div className="flex justify-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">{testimonial.achievement}</span>
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.image}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg text-slate-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white p-3 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white p-3 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-emerald-600'
                    : 'w-2 bg-slate-300 hover:bg-emerald-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className="cursor-pointer bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-lg">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
