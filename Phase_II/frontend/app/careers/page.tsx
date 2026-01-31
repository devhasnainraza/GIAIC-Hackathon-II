'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Users, Heart, Zap, Globe, TrendingUp, Award, Coffee } from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'Build and scale our core platform with modern technologies.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $150k',
      description: 'Create beautiful, intuitive experiences for millions of users.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110k - $160k',
      description: 'Ensure our infrastructure is reliable, scalable, and secure.'
    },
    {
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $120k',
      description: 'Tell our story and help users discover Pure Tasks.'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Work From Anywhere',
      description: 'Fully remote team with flexible hours and location independence.'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs.'
    },
    {
      icon: TrendingUp,
      title: 'Growth & Learning',
      description: 'Annual learning budget and conference attendance.'
    },
    {
      icon: Coffee,
      title: 'Unlimited PTO',
      description: 'Take the time you need to recharge and stay productive.'
    },
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'Market-leading compensation and equity packages.'
    },
    {
      icon: Users,
      title: 'Amazing Team',
      description: 'Work with talented, passionate people who care.'
    }
  ];

  const values = [
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'We ship quickly and iterate based on feedback.'
    },
    {
      icon: Heart,
      title: 'Care Deeply',
      description: 'We put users first in everything we build.'
    },
    {
      icon: Award,
      title: 'Aim High',
      description: 'We set ambitious goals and achieve them together.'
    },
    {
      icon: Users,
      title: 'Collaborate',
      description: 'We believe the best work happens together.'
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
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Build the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Productivity Together
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            We're looking for talented, passionate people to help us build tools that empower millions
            to achieve more. Join us in creating something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#positions"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              View Open Positions
            </a>
            <a
              href="#culture"
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 hover:border-emerald-500 rounded-xl font-bold transition-all duration-300 hover:scale-105"
            >
              Learn About Our Culture
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="culture" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide how we work, make decisions, and treat each other.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We invest in our team's success, health, and happiness.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find your next opportunity and help us build something amazing.
            </p>
          </div>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {position.title}
                    </h3>
                    <p className="text-slate-600">{position.description}</p>
                  </div>
                  <Link
                    href={`/careers/${position.title.toLowerCase()}`}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30 whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {position.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {position.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {position.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {position.salary}
                  </div>
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
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            We're always looking for talented people. Send us your resume and let's talk about how you can contribute.
          </p>
          <a
            href="mailto:careers@puretasks.com"
            className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
