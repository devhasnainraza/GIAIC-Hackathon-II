'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, ArrowRight, TrendingUp, Zap, Target } from 'lucide-react';

export default function BlogPage() {
  const featuredPost = {
    title: '10 Productivity Hacks That Will Transform Your Workflow',
    excerpt: 'Discover proven strategies to boost your productivity and accomplish more in less time with Pure Tasks.',
    author: 'Muhammad Hasnain',
    date: 'January 20, 2026',
    readTime: '8 min read',
    category: 'Productivity',
    image: '/brand-logo.PNG',
    slug: 'productivity-hacks-transform-workflow'
  };

  const blogPosts = [
    {
      title: 'Getting Started with Pure Tasks: A Complete Guide',
      excerpt: 'Learn how to set up your workspace, create your first tasks, and master the basics of Pure Tasks.',
      author: 'Muhammad Hasnain',
      date: 'January 18, 2026',
      readTime: '5 min read',
      category: 'Tutorial',
      image: '/brand-logo.PNG',
      slug: 'getting-started-guide'
    },
    {
      title: 'The Science Behind Effective Task Management',
      excerpt: 'Explore the psychology and research that informs how Pure Tasks helps you stay organized and focused.',
      author: 'Muhammad Hasnain',
      date: 'January 15, 2026',
      readTime: '6 min read',
      category: 'Research',
      image: '/brand-logo.PNG',
      slug: 'science-task-management'
    },
    {
      title: 'How Teams Use Pure Tasks to Collaborate Better',
      excerpt: 'Real stories from teams who have transformed their collaboration with Pure Tasks.',
      author: 'Muhammad Hasnain',
      date: 'January 12, 2026',
      readTime: '7 min read',
      category: 'Case Study',
      image: '/brand-logo.PNG',
      slug: 'teams-collaborate-better'
    },
    {
      title: 'New Features: Timeline View and Advanced Filters',
      excerpt: 'Discover the latest features that make task management even more powerful and intuitive.',
      author: 'Muhammad Hasnain',
      date: 'January 10, 2026',
      readTime: '4 min read',
      category: 'Product Updates',
      image: '/brand-logo.PNG',
      slug: 'new-features-timeline-filters'
    },
    {
      title: 'Building a Sustainable Productivity System',
      excerpt: 'Learn how to create habits and systems that support long-term productivity without burnout.',
      author: 'Muhammad Hasnain',
      date: 'January 8, 2026',
      readTime: '9 min read',
      category: 'Productivity',
      image: '/brand-logo.PNG',
      slug: 'sustainable-productivity-system'
    },
    {
      title: 'Pure Tasks vs Traditional To-Do Lists',
      excerpt: 'Why digital task management beats pen and paper, and how Pure Tasks takes it to the next level.',
      author: 'Muhammad Hasnain',
      date: 'January 5, 2026',
      readTime: '6 min read',
      category: 'Comparison',
      image: '/brand-logo.PNG',
      slug: 'pure-tasks-vs-todo-lists'
    }
  ];

  const categories = ['All', 'Productivity', 'Tutorial', 'Product Updates', 'Case Study', 'Research'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brand-logo.PNG"
                  alt="Pure Tasks"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Pure Tasks</h1>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Pure Tasks Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Insights & Updates
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tips, tutorials, and stories to help you get the most out of Pure Tasks
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  category === 'All'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-64 md:h-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/90 to-blue-600/90"></div>
                <div className="relative">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    width={200}
                    height={200}
                    className="object-contain opacity-20"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    FEATURED
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-4">
                  <Zap className="w-4 h-4" />
                  {featuredPost.category}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/80 to-blue-600/80"></div>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="relative object-contain opacity-30"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Stay Updated</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Never Miss an Update
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Get the latest productivity tips, product updates, and insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-slate-900"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
