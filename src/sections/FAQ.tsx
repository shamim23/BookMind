import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What file formats are supported?',
    answer: 'We support PDF, EPUB, and TXT files. PDFs work best for scanned books and academic papers. EPUB is ideal for e-books, and TXT files are great for plain text documents. Maximum file size is 50MB per upload.',
  },
  {
    question: 'How accurate are the summaries?',
    answer: 'Our AI uses advanced natural language processing to generate highly accurate summaries that capture the key points and main ideas of each chapter. While no AI is perfect, our users consistently report that our summaries help them understand books faster and retain more information.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We take data security very seriously. All uploaded files are encrypted in transit and at rest. We never share your data with third parties, and you can delete your books and associated data at any time.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. When you cancel, you\'ll continue to have access to your plan until the end of your current billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied with BookMind AI for any reason, contact our support team within 14 days for a full refund.',
  },
  {
    question: 'What is the Power Reader feature?',
    answer: 'Power Reader uses RSVP (Rapid Serial Visual Presentation) technology to help you read 3x faster. It displays one word at a time with optimal recognition point highlighting, reducing eye movement and increasing reading speed.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 bg-white overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d0ff59]/20 text-black text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-black/60 text-lg">
            Everything you need to know about BookMind AI.
          </p>
        </motion.div>

        {/* FAQ Grid - Two Columns on Desktop */}
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`border rounded-xl overflow-hidden transition-all ${
                openIndex === index 
                  ? 'border-[#d0ff59] bg-[#d0ff59]/5' 
                  : 'border-black/10 bg-[#f8f8f8] hover:border-black/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-black text-sm pr-4">{faq.question}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  openIndex === index ? 'bg-[#d0ff59]' : 'bg-black/10'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-black/60" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-black/70 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
