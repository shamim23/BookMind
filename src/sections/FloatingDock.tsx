import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Library,
  Zap,
  ChevronUp,
  BarChart3,
  Share2,
  TrendingUp
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const dockItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Library, label: 'Library', href: '/library' },
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: TrendingUp, label: 'Trending', href: '/trending' },
  { icon: Share2, label: 'Knowledge Graph', href: '/knowledge-graph' },
  { icon: Zap, label: 'Power Reader', href: '/reader' },
];

export function FloatingDock() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show dock after scrolling past hero section
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on reader page
  if (location.pathname === '/reader') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative">
            {/* Main Dock */}
            <motion.div
              className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl"
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              {dockItems.map((item, index) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/' && location.pathname === '/');
                
                return (
                  <Link key={item.label} to={item.href}>
                    <motion.div
                      className={`
                        relative flex items-center justify-center rounded-xl transition-all
                        ${isActive 
                          ? 'bg-[#d0ff59] text-black' 
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                        }
                      `}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        width: isExpanded ? 100 : 44,
                        height: 44,
                      }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-2 text-sm font-medium whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 mx-1" />

              {/* Scroll to top button */}
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center w-11 h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute -inset-1 rounded-2xl bg-[#d0ff59]/10 blur-xl -z-10 opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
