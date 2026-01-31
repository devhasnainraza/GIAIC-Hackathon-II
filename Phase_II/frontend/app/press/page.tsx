'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Newspaper, Download, Mail, Award, TrendingUp, Users, Calendar } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      title: 'Pure Tasks Reaches 10,000 Active Users Milestone',
      date: 'January 15, 2026',
      excerpt: 'Pure Tasks celebrates a major milestone as the platform surpasses 10,000 active users worldwide.',
      category: 'Company News'
    },
    {
      title: 'Pure Tasks Launches Advanced Timeline View',
      date: 'January 10, 2026',
      excerpt: 'New timeline view feature helps teams visualize project schedules and dependencies more effectively.',
      category: 'Product Launch'
    },
    {
      title: 'Pure Tasks Wins Best Productivity App Award',
      date: 'December 20, 2025',
      excerpt: 'Pure Tasks recognized as the best productivity application of 2025 by Tech Innovation Awards.',
      category: 'Awards'
    }
  ];

  const mediaKit = [
    {
      title: 'Brand Logo (PNG)',
      description: 'High-resolution logo files',
      size: '2.4 MB'
    },
    {
      title: 'Product Screenshots',
      description: 'App interface screenshots',
      size: '8.1 MB'
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key facts and figures',
      size: '156 KB'
    },
    {
      title: 'Executive Photos',
      description: 'High-res team photos',
      size: '4.2 MB'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '1M+', label: 'Tasks Completed' },
    { value: '150+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' }
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
            <Newspaper className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Press & Media</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Pure Tasks in the News
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Latest news, press releases, and media resources for journalists and content creators.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest Press Releases
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stay updated with our latest announcements and company news.
            </p>
          </div>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        {release.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {release.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {release.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/press/${release.title.toLowerCase()}`}
                    className="px-6 py-3 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Media Resources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Media Kit
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Download logos, screenshots, and other brand assets for your coverage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 mb-2">{item.description}</p>
                    <p className="text-sm text-slate-500">{item.size}</p>
                  </div>
                  <button className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-xl transition-all duration-300 group-hover:scale-110">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30">
              Download Complete Media Kit
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-semibold">Media Inquiries</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              For press inquiries, interviews, or additional information, please contact our media team.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-emerald-100 mb-2">Email</p>
                <a
                  href="mailto:press@puretasks.com"
                  className="text-2xl font-bold hover:text-emerald-200 transition-colors"
                >
                  press@puretasks.com
                </a>
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="text-emerald-100 mb-4">Follow us for updates</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://twitter.com/puretasks"
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">𝕏</span>
                  </a>
                  <a
                    href="https://linkedin.com/company/puretasks"
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-xl">in</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
