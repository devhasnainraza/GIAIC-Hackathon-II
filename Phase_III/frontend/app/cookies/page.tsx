'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cookie, Shield, Eye, Settings } from 'lucide-react';

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly',
      examples: ['Authentication', 'Security', 'Session management'],
      canDisable: false
    },
    {
      icon: Eye,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      examples: ['Page views', 'User behavior', 'Performance metrics'],
      canDisable: true
    },
    {
      icon: Settings,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences',
      examples: ['Language', 'Theme', 'Layout preferences'],
      canDisable: true
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
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <Cookie className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Cookie Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-slate-600">
              Last updated: January 22, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8">

            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Cookies?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit our website.
                They help us provide you with a better experience by remembering your preferences and
                understanding how you use our service.
              </p>
              <p className="text-slate-600 leading-relaxed">
                This Cookie Policy explains what cookies are, how we use them, and how you can control them.
              </p>
            </div>

            {/* Types of Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Types of Cookies We Use</h2>
              <div className="space-y-6">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-slate-900">{type.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              type.canDisable
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {type.canDisable ? 'Optional' : 'Required'}
                            </span>
                          </div>
                          <p className="text-slate-600 mb-3">{type.description}</p>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Examples:</p>
                            <ul className="space-y-1">
                              {type.examples.map((example, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How We Use Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Authentication & Security</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We use cookies to keep you signed in and protect your account from unauthorized access.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Preferences</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Cookies remember your settings like theme, language, and layout preferences.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We use analytics cookies to understand how users interact with our service and improve it.
                  </p>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to decide whether to accept or reject cookies. You can manage your
                cookie preferences through:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-sm">1</span>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Cookie Settings</p>
                    <p className="text-slate-600">Use our cookie preference center to enable or disable optional cookies.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-sm">2</span>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Browser Settings</p>
                    <p className="text-slate-600">Most browsers allow you to refuse cookies or delete existing ones.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-bold text-sm">3</span>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Third-Party Tools</p>
                    <p className="text-slate-600">Use opt-out tools provided by advertising networks and analytics providers.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Disabling essential cookies may affect the functionality of our website
                  and prevent you from using certain features.
                </p>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Cookies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may use third-party services that set cookies on your device. These include:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Google Analytics for website analytics
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Authentication providers for secure login
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Content delivery networks for performance
                </li>
              </ul>
            </div>

            {/* Updates */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Updates to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Cookie Policy from time to time. We will notify you of any changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-slate-600 mb-2">
                  <strong className="text-slate-900">Email:</strong> privacy@puretasks.com
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-900">Address:</strong> Pure Tasks, Inc., 123 Productivity Lane, San Francisco, CA 94102
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Manage Your Cookie Preferences</h2>
            <p className="text-emerald-100 mb-6">
              Control which cookies you want to allow on your device.
            </p>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105">
              Cookie Settings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
