import { motion } from 'framer-motion';
import { Upload, Brain, Layers, BookOpen, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload Your Book',
    description: 'Drop your PDF, EPUB, or TXT file. We support all major book formats up to 50MB.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our AI reads and understands the entire book structure, identifying chapters and key sections.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Smart Breakdown',
    description: 'Chapters are automatically identified and summarized with key insights and takeaways.',
    icon: Layers,
  },
  {
    number: '04',
    title: 'Learn & Explore',
    description: 'Explore concepts, ask questions, and export your personalized summary in multiple formats.',
    icon: BookOpen,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d0ff59]/20 text-black text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Four Steps to Book Mastery
          </h2>
          <p className="text-black/60 text-lg max-w-2xl mx-auto">
            Our AI analyzes your book and transforms it into structured, actionable knowledge.
          </p>
        </motion.div>

        {/* Steps - Vertical Timeline Layout */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#d0ff59] via-[#d0ff59]/50 to-transparent hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${index > 0 ? 'lg:mt-12' : ''}`}
              >
                {/* Content Side */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative bg-[#f8f8f8] rounded-2xl p-6 lg:p-8 group hover:shadow-xl transition-shadow">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-[#d0ff59] flex items-center justify-center font-bold text-black">
                      {step.number}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0 mt-2">
                        <step.icon className="w-6 h-6 text-[#d0ff59]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black mb-2">
                          {step.title}
                        </h3>
                        <p className="text-black/60 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#d0ff59]" />
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15, type: 'spring' }}
                    className="w-4 h-4 rounded-full bg-[#d0ff59] border-4 border-white shadow-lg"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
