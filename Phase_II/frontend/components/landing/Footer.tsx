'use client';

import Link from 'next/link';
import { Twitter, Github, Linkedin, Youtube, Mail} from 'lucide-react';
import Image from 'next/image';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

const footerLinks = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Security', href: '/#security' },
    { name: 'Roadmap', href: '/#roadmap' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'API Reference', href: '/docs#api' },
    { name: 'Community', href: '/community' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Licenses', href: '/licenses' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://x.com/mhattari1112', icon: Twitter },
  { name: 'GitHub', href: 'https://github.com/devhasnainraza', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/md-nain', icon: Linkedin },
  { name: 'YouTube', href: 'https://www.youtube.com/@1-nain', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/5 to-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br  rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Image                                                                                                                 
                      src="/brand-logo.PNG"                                                                                                
                       alt="Pure Tasks"                                                                                                     
                     width={40}                                                                                                           
                      height={40}                                                                                                          
                      className="object-contain"                                                                                           
                      priority                                                                                                             
                     />   
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Pure Tasks</h3>
                <p className="text-xs text-emerald-400 font-semibold">Premium Edition</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              A premium, minimalist task management application designed for clarity, simplicity, and efficiency.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="group p-3 bg-slate-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-emerald-600 text-slate-400 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/30"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold mb-5 capitalize text-sm tracking-wider">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group text-slate-400 hover:text-emerald-400 transition-all duration-300 inline-flex items-center gap-2 text-sm"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-slate-800">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-800/50 rounded-full mb-4">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Newsletter</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-3">Stay Updated</h4>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Get the latest updates, tips, and productivity insights delivered to your inbox.
            </p>
            <NewsletterForm variant="compact" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              © {new Date().getFullYear()} Pure Tasks. All rights reserved. Made with{' '}
              <span className="text-emerald-500">❤️</span> for productivity.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 font-medium hover:scale-105 inline-block">
                Privacy Policy
              </a>
              <span className="text-slate-700">•</span>
              <a href="/terms" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 font-medium hover:scale-105 inline-block">
                Terms of Service
              </a>
              <span className="text-slate-700">•</span>
              <a href="/cookies" className="text-slate-500 hover:text-emerald-400 transition-all duration-300 font-medium hover:scale-105 inline-block">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
