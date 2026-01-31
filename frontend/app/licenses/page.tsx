'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Code, Shield, Award } from 'lucide-react';

export default function LicensesPage() {
  const openSourceLibraries = [
    {
      name: 'React',
      version: '18.2.0',
      license: 'MIT',
      description: 'A JavaScript library for building user interfaces',
      url: 'https://reactjs.org/'
    },
    {
      name: 'Next.js',
      version: '14.0.0',
      license: 'MIT',
      description: 'The React Framework for Production',
      url: 'https://nextjs.org/'
    },
    {
      name: 'Tailwind CSS',
      version: '3.4.0',
      license: 'MIT',
      description: 'A utility-first CSS framework',
      url: 'https://tailwindcss.com/'
    },
    {
      name: 'Lucide React',
      version: '0.294.0',
      license: 'ISC',
      description: 'Beautiful & consistent icon toolkit',
      url: 'https://lucide.dev/'
    },
    {
      name: 'date-fns',
      version: '3.0.0',
      license: 'MIT',
      description: 'Modern JavaScript date utility library',
      url: 'https://date-fns.org/'
    },
    {
      name: 'FastAPI',
      version: '0.109.0',
      license: 'MIT',
      description: 'Modern, fast web framework for building APIs',
      url: 'https://fastapi.tiangolo.com/'
    },
    {
      name: 'SQLModel',
      version: '0.0.14',
      license: 'MIT',
      description: 'SQL databases in Python with type hints',
      url: 'https://sqlmodel.tiangolo.com/'
    },
    {
      name: 'PostgreSQL',
      version: '16.0',
      license: 'PostgreSQL License',
      description: 'Powerful, open source object-relational database',
      url: 'https://www.postgresql.org/'
    }
  ];

  const licenseTypes = [
    {
      icon: Code,
      name: 'MIT License',
      description: 'Permissive license allowing commercial use, modification, and distribution',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      name: 'ISC License',
      description: 'Functionally equivalent to MIT, with simplified language',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      name: 'PostgreSQL License',
      description: 'Liberal open source license similar to BSD or MIT',
      color: 'from-purple-500 to-purple-600'
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
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Open Source Licenses</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Licenses & Attributions
            </h1>
            <p className="text-lg text-slate-600">
              Pure Tasks is built with amazing open source software
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Open Source</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Pure Tasks is built on the shoulders of giants. We use and contribute to open source software,
              and we're grateful to the developers and communities that make these projects possible.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This page lists all the open source libraries and tools we use, along with their respective licenses.
              We comply with all license requirements and give credit where credit is due.
            </p>
          </div>

          {/* License Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">License Types Used</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {licenseTypes.map((license, index) => {
                const Icon = license.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${license.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{license.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{license.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Source Libraries */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Source Libraries</h2>
            <div className="space-y-4">
              {openSourceLibraries.map((library, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{library.name}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded">
                          v{library.version}
                        </span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                          {library.license}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2">{library.description}</p>
                      <a
                        href={library.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        {library.url} →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIT License Text */}
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">MIT License (Example)</h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed">
{`MIT License

Copyright (c) 2026 Pure Tasks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>
            </div>
          </div>

          {/* Attribution */}
          <div className="mt-12 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Thank You</h2>
            <p className="text-slate-700 leading-relaxed">
              We extend our heartfelt thanks to all the open source developers and communities who make
              their work freely available. Your contributions make projects like Pure Tasks possible.
              We're committed to giving back to the open source community and supporting the ecosystem
              that supports us.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About Licensing?</h2>
            <p className="text-emerald-100 mb-6">
              If you have questions about our use of open source software or licensing, please contact us.
            </p>
            <a
              href="mailto:legal@puretasks.com"
              className="inline-block px-8 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105"
            >
              Contact Legal Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
