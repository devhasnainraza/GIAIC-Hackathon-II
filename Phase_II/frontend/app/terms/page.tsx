import Link from 'next/link';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Pure Tasks',
  description: 'Terms and conditions for using Pure Tasks',
};

/**
 * Terms of Service Page
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-2 shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Pure Tasks</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-slate-600">Last updated: January 21, 2026</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Welcome to Pure Tasks ("we," "our," or "us"). By accessing or using our task management application
                and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                By creating an account or using Pure Tasks, you acknowledge that you have read, understood, and agree
                to be bound by these Terms and our Privacy Policy. These Terms apply to all users of the Service.
              </p>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">3.1 Account Creation</h3>
                  <p className="text-slate-700 leading-relaxed">
                    To use certain features of the Service, you must create an account. You agree to provide accurate,
                    current, and complete information during registration and to update such information to keep it accurate.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">3.2 Account Security</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account. You must notify us immediately of any unauthorized use
                    of your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">3.3 Account Termination</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We reserve the right to suspend or terminate your account if you violate these Terms or engage in
                    any fraudulent, abusive, or illegal activity.
                  </p>
                </div>
              </div>
            </section>

            {/* Use of Service */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Use of Service</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">4.1 Permitted Use</h3>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                    <li>Use the Service in any way that violates applicable laws or regulations</li>
                    <li>Attempt to gain unauthorized access to any part of the Service</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Upload or transmit viruses, malware, or other malicious code</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Use automated systems to access the Service without permission</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Content */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Content</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">5.1 Your Content</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You retain all rights to the content you create, upload, or share through the Service ("User Content").
                    By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use,
                    store, and display your content solely for the purpose of providing the Service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">5.2 Content Responsibility</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You are solely responsible for your User Content. We do not endorse or guarantee the accuracy,
                    quality, or reliability of any User Content.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                The Service, including its design, features, and functionality, is owned by Pure Tasks and is protected
                by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or
                create derivative works based on the Service without our express written permission.
              </p>
            </section>

            {/* Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disclaimers</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. YOUR USE OF
                THE SERVICE IS AT YOUR OWN RISK.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PURE TASKS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by
                posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the
                Service after such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-700">
                  <strong>Email:</strong> legal@puretasks.com<br />
                  <strong>Address:</strong> Pure Tasks Inc., 123 Task Street, Productivity City, PC 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-600">
        <p>© 2026 Pure Tasks. All rights reserved.</p>
      </footer>
    </div>
  );
}
