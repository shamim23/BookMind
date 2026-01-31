import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Graduate Student',
    content: 'This tool cut my research time in half. Absolutely incredible!',
    avatar: 'SM',
    rating: 5,
  },
  {
    name: 'David K.',
    role: 'Software Engineer',
    content: 'The concept extraction feature is a game-changer for learning.',
    avatar: 'DK',
    rating: 5,
  },
  {
    name: 'Emily R.',
    role: 'Book Blogger',
    content: 'Chapter summaries are like having a personal tutor. Love it!',
    avatar: 'ER',
    rating: 5,
  },
  {
    name: 'Michael T.',
    role: 'Entrepreneur',
    content: "I've read more books this month than ever before. Game changer!",
    avatar: 'MT',
    rating: 5,
  },
  {
    name: 'Lisa Chen',
    role: 'High School Teacher',
    content: 'Perfect for students. I recommend it to all my classes.',
    avatar: 'LC',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Research Analyst',
    content: 'Identifies key themes across papers instantly. Essential tool.',
    avatar: 'JW',
    rating: 5,
  },
  {
    name: 'Anna P.',
    role: 'Law Student',
    content: 'Helps me digest case law faster than ever. Highly recommend!',
    avatar: 'AP',
    rating: 5,
  },
  {
    name: 'Robert L.',
    role: 'CEO',
    content: 'My entire executive team uses this for business book summaries.',
    avatar: 'RL',
    rating: 5,
  },
];

export function Testimonials() {
  // Split into two rows for scrolling effect
  const row1 = [...testimonials.slice(0, 4), ...testimonials.slice(0, 4)];
  const row2 = [...testimonials.slice(4, 8), ...testimonials.slice(4, 8)];

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d0ff59]/5 blur-[200px]" />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 px-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d0ff59]/10 text-[#d0ff59] text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Loved by Readers Worldwide
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Join thousands who've transformed their reading experience.
          </p>
        </motion.div>

        {/* Scrolling Testimonials */}
        <div className="space-y-4">
          {/* Row 1 - Scrolls Left */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: [0, -25 * 4 + '%'] }}
              transition={{
                x: {
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {row1.map((testimonial, index) => (
                <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Scrolls Right */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: [-25 * 4 + '%', 0] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {row2.map((testimonial, index) => (
                <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all">
      {/* Header with stars */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-0.5">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#d0ff59] text-[#d0ff59]" />
          ))}
        </div>
        <Quote className="w-4 h-4 text-[#d0ff59]/30" />
      </div>

      {/* Content */}
      <p className="text-white/80 text-sm leading-relaxed mb-4">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] font-semibold text-xs">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="text-white text-sm font-medium">{testimonial.name}</h4>
          <p className="text-white/50 text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
