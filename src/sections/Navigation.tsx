import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, Zap, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#d0ff59] flex items-center justify-center"
              whileHover={{ rotateY: 15, rotateX: -10 }}
              transition={{ duration: 0.2 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <BookOpen className="w-5 h-5 text-black" />
            </motion.div>
            <span className="text-xl font-bold text-white">BookMind AI</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative text-white/80 hover:text-white transition-colors text-sm font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#d0ff59] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
            <Link
              to="/library"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Library
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-white/80 hover:text-[#d0ff59] transition-colors text-sm font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/trending"
              className="flex items-center gap-1 text-white/80 hover:text-[#d0ff59] transition-colors text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Link>
            <Link
              to="/reader"
              className="flex items-center gap-1 text-[#d0ff59] hover:text-[#b8e04d] transition-colors text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              Power Reader
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
            >
              <Link to="/onboarding">
                <Button
                  className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] font-semibold px-6"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-white/80 hover:text-white py-2 text-lg"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/library"
                className="block text-white/80 hover:text-white py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Library
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-[#d0ff59] py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                to="/trending"
                className="flex items-center gap-2 text-white/80 hover:text-[#d0ff59] py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                Trending
              </Link>
              <Link
                to="/reader"
                className="flex items-center gap-2 text-[#d0ff59] py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Zap className="w-5 h-5" />
                Power Reader
              </Link>
              <Link to="/onboarding" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-[#d0ff59] text-black hover:bg-[#b8e04d] font-semibold mt-4"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
