import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

const Navigation = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Skills', href: '#skills' },
    { name: 'Workflows', href: '#workflows' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white">Vinay</span>
            <span className="text-orange-500">Tambe</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboard && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-300 hover:text-orange-500 transition-colors duration-300 font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            {!isDashboard ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-zinc-300 hover:text-orange-500 transition-colors duration-300 font-medium relative group"
                >
                  <BarChart3 size={18} />
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
                </Link>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Let's Talk
                </Button>
              </>
            ) : (
              <Link to="/">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                >
                  Back to Portfolio
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-zinc-300 hover:text-orange-500 transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-6"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Let's Talk
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
