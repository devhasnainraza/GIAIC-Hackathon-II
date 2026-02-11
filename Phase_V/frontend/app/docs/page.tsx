'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Book, Search, CheckSquare, Calendar, BarChart3, Settings, Zap, Users, Shield, Code } from 'lucide-react';

export default function DocsPage() {
  const docCategories = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Quick start guide and basic concepts',
      articles: [
        'Creating Your First Task',
        'Understanding Task Statuses',
        'Setting Priorities',
        'Using Due Dates'
      ]
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Master task organization and workflows',
      articles: [
        'Advanced Task Filtering',
        'Bulk Actions',
        'Task Templates',
        'Recurring Tasks'
      ]
    },
    {
      icon: Calendar,
      title: 'Views & Organization',
      description: 'Different ways to visualize your work',
      articles: [
        'List View Guide',
        'Board View (Kanban)',
        'Timeline View',
        'Calendar Integration'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track progress and productivity',
      articles: [
        'Understanding Analytics',
        'Exporting Data',
        'Custom Reports',
        'Productivity Insights'
      ]
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Work together with your team',
      articles: [
        'Sharing Tasks',
        'Team Workspaces',
        'Comments & Mentions',
        'Notifications'
      ]
    },
    {
      icon: Settings,
      title: 'Settings & Customization',
      description: 'Personalize your experience',
      articles: [
        'Account Settings',
        'Preferences',
        'Keyboard Shortcuts',
        'Theme Customization'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Keep your data safe',
      articles: [
        'Two-Factor Authentication',
        'Data Encryption',
        'Privacy Controls',
        'GDPR Compliance'
      ]
    },
    {
      icon: Code,
      title: 'API & Integrations',
      description: 'Connect with other tools',
      articles: [
        'API Documentation',
        'Webhooks',
        'Third-party Integrations',
        'Developer Resources'
      ]
    }
  ];

  const popularArticles = [
    'How to Create Your First Task',
    'Understanding Task Priorities',
    'Using Keyboard Shortcuts',
    'Exporting Tasks to CSV',
    'Setting Up Notifications'
  ];

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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
            <Book className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Pure Tasks Documentation
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Everything you need to know to master Pure Tasks and boost your productivity.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Articles</h2>
          <div className="flex flex-wrap gap-3">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={`/docs/${article.toLowerCase()}`}
                className="px-4 py-2 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 rounded-lg font-medium transition-all duration-200"
              >
                {article}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find guides and tutorials organized by topic.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {docCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link
                          href={`/docs/${article.toLowerCase()}`}
                          className="text-sm text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2 group/link"
                        >
                          <span className="w-1 h-1 bg-slate-400 rounded-full group-hover/link:bg-emerald-600"></span>
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Quick Start Guide
            </h2>
            <p className="text-lg text-slate-600">
              Get up and running in minutes with these simple steps.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up with your email and set up your profile in seconds.'
              },
              {
                step: '2',
                title: 'Add Your First Task',
                description: 'Click the "New Task" button and enter your task details.'
              },
              {
                step: '3',
                title: 'Organize with Priorities',
                description: 'Set priorities (Low, Medium, High, Urgent) to focus on what matters.'
              },
              {
                step: '4',
                title: 'Track Progress',
                description: 'Move tasks through statuses: To Do → In Progress → Review → Done.'
              },
              {
                step: '5',
                title: 'Explore Views',
                description: 'Switch between List, Board, and Timeline views to find your perfect workflow.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Our support team is here to help you get the most out of Pure Tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Visit Help Center
            </Link>
            <Link
              href="/community"
              className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all duration-300 hover:scale-105"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
