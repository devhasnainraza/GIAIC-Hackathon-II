import Link from 'next/link';
import { CheckSquare, ArrowLeft, Shield, Lock, Eye, Database, Users, Bell } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Pure Tasks',
  description: 'How Pure Tasks collects, uses, and protects your personal information',
};

/**
 * Privacy Policy Page
 */
export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-slate-600">Last updated: January 21, 2026</p>
          </div>

          {/* Quick Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Your Privacy Matters</h3>
                <p className="text-emerald-800 text-sm leading-relaxed">
                  At Pure Tasks, we take your privacy seriously. We collect only the information necessary to provide
                  our service, use enterprise-grade encryption, and never sell your data to third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pure Tasks ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our task management application
                and services (the "Service").
              </p>
              <p className="text-slate-700 leading-relaxed">
                By using Pure Tasks, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-slate-50 rounded-lg p-4">
                  <Users className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2.1 Personal Information</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      When you create an account, we collect:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                      <li>Email address</li>
                      <li>Password (encrypted)</li>
                      <li>Name (optional)</li>
                      <li>Profile picture (optional)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-lg p-4">
                  <Database className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2.2 Usage Data</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      We automatically collect certain information when you use the Service:
                    </p>
                    <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                      <li>Device information (browser type, operating system)</li>
                      <li>IP address and location data</li>
                      <li>Usage patterns and preferences</li>
                      <li>Log data and analytics</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-slate-50 rounded-lg p-4">
                  <Eye className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2.3 Task and Content Data</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We store the tasks, notes, and other content you create within the Service to provide
                      functionality and sync across your devices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                <li>To provide, maintain, and improve the Service</li>
                <li>To create and manage your account</li>
                <li>To sync your data across devices</li>
                <li>To send you important updates and notifications</li>
                <li>To respond to your support requests</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <Lock className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">Enterprise-Grade Security</h3>
                  <p className="text-emerald-800 leading-relaxed">
                    We implement industry-standard security measures to protect your data, including encryption
                    at rest and in transit, secure authentication, and regular security audits.
                  </p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">
                However, no method of transmission over the internet is 100% secure. While we strive to protect
                your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Sharing and Disclosure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">5.1 We Do Not Sell Your Data</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">5.2 Service Providers</h3>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    We may share your information with trusted third-party service providers who assist us in:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                    <li>Cloud hosting and storage</li>
                    <li>Email delivery</li>
                    <li>Analytics and monitoring</li>
                    <li>Payment processing (if applicable)</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-2">
                    These providers are contractually obligated to protect your data and use it only for the
                    purposes we specify.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">5.3 Legal Requirements</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We may disclose your information if required by law, court order, or government regulation,
                    or to protect our rights, property, or safety.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-semibold text-sm">✓</span>
                  </span>
                  <p className="text-slate-700"><strong>Access:</strong> Request a copy of your personal data</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-semibold text-sm">✓</span>
                  </span>
                  <p className="text-slate-700"><strong>Correction:</strong> Update or correct inaccurate information</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-semibold text-sm">✓</span>
                  </span>
                  <p className="text-slate-700"><strong>Deletion:</strong> Request deletion of your account and data</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-semibold text-sm">✓</span>
                  </span>
                  <p className="text-slate-700"><strong>Export:</strong> Download your data in a portable format</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 font-semibold text-sm">✓</span>
                  </span>
                  <p className="text-slate-700"><strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and
                remember your preferences. You can control cookie settings through your browser, but disabling
                cookies may affect Service functionality.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Data Retention</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide
                the Service. If you delete your account, we will delete your data within 30 days, except where we
                are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact
                us immediately.
              </p>
            </section>

            {/* International Users */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last updated" date. We encourage you to review
                this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-slate-700">
                  <strong>Email:</strong> privacy@puretasks.com<br />
                  <strong>Data Protection Officer:</strong> dpo@puretasks.com<br />
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
