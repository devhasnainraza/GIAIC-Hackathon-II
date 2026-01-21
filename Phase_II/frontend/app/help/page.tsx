'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, HelpCircle, Search, MessageCircle, Mail, Phone, Book, Video, FileText, Zap } from 'lucide-react';

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first task?',
          a: 'Click the "New Task" button in the top right corner, enter your task details, and click "Create". You can add a title, description, priority, and due date.'
        },
        {
          q: 'How do I organize my tasks?',
          a: 'Use priorities (Low, Medium, High, Urgent) and statuses (To Do, In Progress, Review, Done) to organize your tasks. You can also use projects and tags for better organization.'
        },
        {
          q: 'Can I use Pure Tasks on mobile?',
          a: 'Yes! Pure Tasks is fully responsive and works great on mobile devices. Simply access it through your mobile browser.'
        }
      ]
    },
    {
      title: 'Account & Billing',
      questions: [
        {
          q: 'How do I change my password?',
          a: 'Go to Settings → Account → Security, then click "Change Password". Enter your current password and your new password twice.'
        },
        {
          q: 'Is Pure Tasks free?',
          a: 'Yes! Pure Tasks offers a free tier with all core features. Premium plans with advanced features are also available.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Go to Settings → Account → Danger Zone, then click "Delete Account". This action is permanent and cannot be undone.'
        }
      ]
    },
    {
      title: 'Features & Functionality',
      questions: [
        {
          q: 'What are the different views?',
          a: 'Pure Tasks offers three views: List (traditional task list), Board (Kanban-style), and Timeline (Gantt chart). Switch between them using the view toggle buttons.'
        },
        {
          q: 'How do I export my tasks?',
          a: 'Click the "Export" button in the tasks page and choose your preferred format: CSV, JSON, Excel, PDF, or Markdown.'
        },
        {
          q: 'Can I set recurring tasks?',
          a: 'Recurring tasks are available in the premium plan. You can set tasks to repeat daily, weekly, monthly, or with custom intervals.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      questions: [
        {
          q: 'Tasks not loading?',
          a: 'Try refreshing the page. If the issue persists, check your internet connection and clear your browser cache. Contact support if the problem continues.'
        },
        {
          q: 'Forgot my password?',
          a: 'Click "Forgot Password" on the sign-in page. Enter your email and we'll send you a reset link.'
        },
        {
          q: 'Not receiving notifications?',
          a: 'Check your notification settings in Settings → Notifications. Make sure browser notifications are enabled and not blocked.'
        }
      ]
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      available: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      action: 'Send Email',
      available: 'Response within 24h'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our guides',
      action: 'View Docs',
      available: 'Self-service'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch how-to videos',
      action: 'Watch Videos',
      available: '50+ tutorials'
    }
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
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            How Can We Help You?
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Find answers to common questions, browse guides, or contact our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{option.title}</h3>
                  <p className="text-slate-600 text-sm mb-3">{option.description}</p>
                  <p className="text-xs text-emerald-600 font-semibold mb-4">{option.available}</p>
                  <button className="w-full px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-semibold transition-all duration-200">
                    {option.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about Pure Tasks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{category.title}</h3>
                {category.questions.map((item, itemIndex) => (
                  <details
                    key={itemIndex}
                    className="group bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                      <span className="text-emerald-600 group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Need More Help?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Our support team is ready to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@puretasks.com"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Contact Support
            </a>
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
