import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Lightbulb, Zap, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.querySelector('#how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-image.jpg" 
          alt="AI Book Analysis" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#d0ff59]/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d0ff59]/10 border border-[#d0ff59]/30 mb-6"
            >
              <Brain className="w-4 h-4 text-[#d0ff59]" />
              <span className="text-sm text-white/90">Expand Your Mind</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block"
              >
                Think More Clearly
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block text-[#d0ff59]"
              >
                Connect Deeper
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed"
            >
              We use the world's best books as a foundation to expand your mind, 
              sharpen critical thinking, and help you see connections across disciplines.
            </motion.p>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {[
                { icon: Brain, text: 'Critical Thinking' },
                { icon: Lightbulb, text: 'First Principles' },
                { icon: Sparkles, text: 'Deeper Understanding' },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm">
                  <item.icon className="w-4 h-4 text-[#d0ff59]" />
                  {item.text}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <Link to="/onboarding">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-[#d0ff59] text-black hover:bg-[#b8e04d] font-semibold px-8 py-6 text-lg group"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={scrollToHowItWorks}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-6 text-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2 text-white/50">
                <Brain className="w-5 h-5" />
                <span className="text-sm">Build Mental Models</span>
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <Zap className="w-5 h-5 text-[#d0ff59]" />
                <span className="text-sm">Powered by GPT-4</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-8 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
              >
                <div className="text-3xl font-bold text-[#d0ff59]">50K+</div>
                <div className="text-white/60 text-sm">Ideas Connected</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/3 -left-8 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
              >
                <div className="text-3xl font-bold text-[#d0ff59]">3x</div>
                <div className="text-white/60 text-sm">Deeper Understanding</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-0 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20"
              >
                <div className="text-3xl font-bold text-[#d0ff59]">8</div>
                <div className="text-white/60 text-sm">Disciplines</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[5] pointer-events-none" />
    </section>
  );
}
