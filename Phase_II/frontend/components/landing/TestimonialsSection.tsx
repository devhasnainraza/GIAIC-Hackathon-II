'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Play, Award, TrendingUp, Users } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    image: '👩‍💼',
    rating: 5,
    quote: 'Pure Tasks has completely transformed how I manage my daily workflow. The clean interface and powerful features make it a joy to use every day.',
    achievement: '300% productivity increase',
    verified: true,
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    company: 'StartupXYZ',
    image: '👨‍💻',
    rating: 5,
    quote: 'As a developer, I appreciate the attention to detail and smooth animations. This is the most polished task manager I\'ve ever used.',
    achievement: 'Manages 50+ projects',
    verified: true,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Designer',
    company: 'Independent',
    image: '👩‍🎨',
    rating: 5,
    quote: 'The minimalist design is exactly what I needed. No clutter, no distractions - just pure productivity. Highly recommend!',
    achievement: 'Completed 1000+ tasks',
    verified: true,
  },
  {
    name: 'David Park',
    role: 'Marketing Director',
    company: 'GrowthCo',
    image: '👨‍💼',
    rating: 5,
    quote: 'Our entire team switched to Pure Tasks and productivity has increased significantly. The cross-device sync is seamless.',
    achievement: 'Team of 25 users',
    verified: true,
  },
  {
    name: 'Lisa Anderson',
    role: 'CEO',
    company: 'InnovateLabs',
    image: '👩‍💼',
    rating: 5,
    quote: 'The best investment we made for our company. Pure Tasks keeps our entire organization aligned and productive.',
    achievement: 'Saved 20 hours/week',
    verified: true,
  },
  {
    name: 'James Wilson',
    role: 'Entrepreneur',
    company: 'StartupHub',
    image: '👨‍💼',
    rating: 5,
    quote: 'I\'ve tried every task manager out there. Pure Tasks is the only one that stuck. It\'s simply the best.',
    achievement: '3 years active user',
    verified: true,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

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
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch/Swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-full mb-4 shadow-lg shadow-emerald-500/10">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">Verified Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">
            Loved by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 mt-2">
              Thousands of Users
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what real users have to say about Pure Tasks.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">50K+</div>
              </div>
              <div className="text-xs md:text-sm text-slate-600 font-medium">Active Users</div>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">4.9/5</div>
              </div>
              <div className="text-xs md:text-sm text-slate-600 font-medium">User Rating</div>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">98%</div>
              </div>
              <div className="text-xs md:text-sm text-slate-600 font-medium">Satisfaction</div>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">2K+</div>
              </div>
              <div className="text-xs md:text-sm text-slate-600 font-medium">Reviews</div>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-5xl mx-auto mb-16">
          {/* Auto-play Control */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isAutoPlaying ? (
                <>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600">Auto-playing</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-slate-700 group-hover:text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600">Play</span>
                </>
              )}
            </button>
          </div>

          {/* Main Testimonial Card */}
          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  <div className="group relative bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-6 md:p-10 lg:p-14 border-2 border-slate-200 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:border-emerald-300">
                    {/* Verified Badge */}
                    {testimonial.verified && (
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg">
                        <Award className="w-3 h-3 text-white" />
                        <span className="text-xs font-bold text-white">Verified</span>
                      </div>
                    )}

                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 text-emerald-500/20">
                      <Quote className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" />
                    </div>

                    {/* Quote Text */}
                    <div className="relative z-10">
                      <p className="text-lg md:text-2xl lg:text-3xl text-slate-700 mb-6 md:mb-10 leading-relaxed font-medium">
                        "{testimonial.quote}"
                      </p>

                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-6 md:mb-8">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400 hover:scale-125 transition-transform duration-300"
                          />
                        ))}
                      </div>

                      {/* Achievement Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-full mb-6 md:mb-8">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">{testimonial.achievement}</span>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {testimonial.image}
                        </div>
                        <div>
                          <div className="font-bold text-lg md:text-xl text-slate-900">
                            {testimonial.name}
                          </div>
                          <div className="text-sm md:text-base text-slate-600 font-medium">
                            {testimonial.role}
                          </div>
                          <div className="text-xs md:text-sm text-emerald-600 font-semibold">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-b-3xl"></div>

                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 bg-white p-4 rounded-2xl shadow-2xl border-2 border-slate-200 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 group-hover:text-emerald-600 transition-colors" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 bg-white p-4 rounded-2xl shadow-2xl border-2 border-slate-200 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-emerald-600 transition-colors" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-10 md:w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                    : 'w-2.5 bg-slate-300 hover:bg-emerald-400 hover:w-6'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="md:hidden text-center mt-6">
            <p className="text-sm text-slate-500 font-medium">
              ← Swipe to see more →
            </p>
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 md:mb-12">
            More Success Stories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className="group cursor-pointer bg-white rounded-2xl p-5 md:p-6 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm md:text-base text-slate-600 mb-5 leading-relaxed line-clamp-3">
                  "{testimonial.quote}"
                </p>

                {/* Achievement */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">{testimonial.achievement}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                  {testimonial.verified && (
                    <Award className="w-4 h-4 text-emerald-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="inline-flex items-center gap-4 px-6 md:px-8 py-4 bg-gradient-to-r from-emerald-50 via-white to-amber-50 border-2 border-emerald-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex -space-x-3">
              {['👨‍💼', '👩‍💻', '👨‍🎨', '👩‍💼', '👨‍💻'].map((emoji, i) => (
                <div key={i} className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center border-3 border-white text-lg shadow-lg hover:scale-110 transition-transform duration-300">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-lg md:text-xl font-bold text-slate-900">
                Join 50,000+ happy users
              </div>
              <div className="text-sm text-slate-600 font-medium">
                Start your productivity journey today
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
