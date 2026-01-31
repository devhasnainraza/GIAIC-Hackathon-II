'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Users, MessageSquare, Github, Twitter, Linkedin, Youtube, Heart, Star, TrendingUp, Award } from 'lucide-react';

export default function CommunityPage() {
  const communityStats = [
    { value: '10,000+', label: 'Community Members' },
    { value: '500+', label: 'Daily Active Users' },
    { value: '1,000+', label: 'Discussions' },
    { value: '50+', label: 'Countries' }
  ];

  const communityChannels = [
    {
      icon: MessageSquare,
      title: 'Discord Server',
      description: 'Join our Discord community for real-time discussions, support, and updates.',
      members: '5,000+ members',
      link: 'https://discord.gg/puretasks',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Github,
      title: 'GitHub Discussions',
      description: 'Share feedback, report bugs, and contribute to the development of Pure Tasks.',
      members: '2,000+ contributors',
      link: 'https://github.com/puretasks/discussions',
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: Twitter,
      title: 'Twitter Community',
      description: 'Follow us for updates, tips, and connect with other productivity enthusiasts.',
      members: '3,000+ followers',
      link: 'https://twitter.com/puretasks',
      color: 'from-blue-400 to-blue-500'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Group',
      description: 'Professional networking and productivity discussions with industry experts.',
      members: '1,500+ professionals',
      link: 'https://linkedin.com/company/puretasks',
      color: 'from-blue-600 to-blue-700'
    }
  ];

  const featuredMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Community Leader',
      contribution: 'Helped 500+ users get started',
      avatar: '/brand-logo.PNG'
    },
    {
      name: 'Michael Chen',
      role: 'Top Contributor',
      contribution: 'Created 50+ helpful guides',
      avatar: '/brand-logo.PNG'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Beta Tester',
      contribution: 'Reported 100+ bugs',
      avatar: '/brand-logo.PNG'
    },
    {
      name: 'David Kim',
      role: 'Plugin Developer',
      contribution: 'Built 10+ integrations',
      avatar: '/brand-logo.PNG'
    }
  ];

  const communityGuidelines = [
    {
      icon: Heart,
      title: 'Be Respectful',
      description: 'Treat everyone with kindness and respect. We\'re all here to learn and grow together.'
    },
    {
      icon: Star,
      title: 'Share Knowledge',
      description: 'Help others by sharing your experiences, tips, and solutions to common problems.'
    },
    {
      icon: TrendingUp,
      title: 'Stay On Topic',
      description: 'Keep discussions relevant to Pure Tasks and productivity. Off-topic posts may be removed.'
    },
    {
      icon: Award,
      title: 'Give Credit',
      description: 'Always credit others for their ideas and contributions. Plagiarism is not tolerated.'
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
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Join Our Community</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Connect with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Productivity Enthusiasts
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users sharing tips, asking questions, and helping each other get the most out of Pure Tasks.
          </p>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
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

      {/* Community Channels */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Where to Connect
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your preferred platform and join the conversation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {communityChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <a
                  key={index}
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {channel.title}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {channel.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-600">{channel.members}</span>
                    <span className="text-emerald-600 group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Community Members
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Meet some of our most active and helpful community members.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMembers.map((member, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="rounded-full object-contain p-4"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm text-emerald-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-slate-600">{member.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Community Guidelines
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Help us maintain a positive, welcoming environment for everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityGuidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{guideline.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{guideline.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Connect with thousands of users, share your experiences, and learn from others.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/puretasks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Join Discord
            </a>
            <Link
              href="/signup"
              className="px-8 py-4 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
