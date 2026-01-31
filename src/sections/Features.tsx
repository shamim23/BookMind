import { motion } from 'framer-motion';
import { 
  FileText, 
  Lightbulb, 
  Search, 
  Download, 
  Headphones,
  Zap,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';

const features = [
  {
    title: 'Chapter Summaries',
    description: 'Get concise, accurate summaries of every chapter in seconds with AI-powered analysis.',
    icon: FileText,
    size: 'large',
  },
  {
    title: 'Concept Extraction',
    description: 'Automatically identify and explain key concepts.',
    icon: Lightbulb,
    size: 'small',
  },
  {
    title: 'Smart Search',
    description: 'Ask questions and get answers based on the book\'s content.',
    icon: Search,
    size: 'small',
  },
  {
    title: 'Power Reader',
    description: 'Read 3x faster with our RSVP speed reading mode. Focus on one word at a time with optimal recognition point highlighting.',
    icon: Zap,
    size: 'large',
  },
  {
    title: 'AI Chat Assistant',
    description: 'Have a conversation about any chapter. Ask questions, get explanations, and dive deeper into concepts.',
    icon: MessageSquare,
    size: 'medium',
  },
  {
    title: 'First Principles',
    description: 'Break down complex ideas to their fundamental truths.',
    icon: TrendingUp,
    size: 'small',
  },
  {
    title: 'Reading Progress',
    description: 'Track your reading journey.',
    icon: Clock,
    size: 'small',
  },
  {
    title: 'Export Options',
    description: 'Save your analysis as PDF, Markdown, or share via link.',
    icon: Download,
    size: 'small',
  },
  {
    title: 'Audio Summary',
    description: 'Listen to chapter summaries on the go.',
    icon: Headphones,
    size: 'small',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 bg-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d0ff59]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Master Any Book
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Powerful AI tools designed to transform how you understand and retain knowledge.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {features.map((feature, index) => {
            const sizeClasses = {
              large: 'md:col-span-2 md:row-span-2',
              medium: 'md:col-span-2',
              small: 'col-span-1',
            };

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`group relative ${sizeClasses[feature.size as keyof typeof sizeClasses]} ${feature.size === 'small' ? 'row-span-1' : ''}`}
              >
                <div className="relative h-full bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-[#d0ff59]/50 transition-colors">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d0ff59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center mb-4 group-hover:bg-[#d0ff59]/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-[#d0ff59]" />
                    </div>

                    {/* Text */}
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed flex-1">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#d0ff59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
