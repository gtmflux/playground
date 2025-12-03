import React from 'react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Mail, href: 'mailto:vinay@example.com', label: 'Email' }
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold mb-2">
              <span className="text-white">Vinay</span>
              <span className="text-orange-500">Tambe</span>
            </div>
            <p className="text-zinc-400 text-sm">
              GTM Engineer • RevOps Architect
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-orange-500/20 border border-zinc-800 hover:border-orange-500/50 flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center text-sm text-zinc-500">
          © {currentYear} Vinay Tambe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
