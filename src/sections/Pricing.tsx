import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    priceUnit: '/month',
    description: 'Perfect for trying out BookMind AI',
    features: [
      '3 books per month',
      'Basic chapter summaries',
      'Text export only',
      'Community support',
    ],
    cta: 'Get Started',
    isPopular: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 96,
    priceUnit: '/month',
    description: 'For serious readers and learners',
    features: [
      'Unlimited books',
      'Advanced AI analysis',
      'All export formats',
      'Priority support',
      'Concept extraction',
      'Audio summaries',
    ],
    cta: 'Start Pro Trial',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 49,
    annualPrice: 399,
    priceUnit: '/month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Team collaboration',
      'Advanced analytics',
    ],
    cta: 'Contact Sales',
    isPopular: false,
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 bg-white overflow-hidden">
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
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#d0ff59]/20 text-black text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Choose Your Plan
          </h2>
          <p className="text-black/60 text-lg max-w-xl mx-auto mb-8">
            Start free, upgrade when you need more power.
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-black' : 'text-black/50'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-black/10 transition-colors"
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#d0ff59]"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-black' : 'text-black/50'}`}>
              Annual
            </span>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 rounded-full bg-[#d0ff59]/20 text-[#d0ff59] text-xs font-semibold"
              >
                Save 33%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <div className={`
                relative rounded-3xl p-6 lg:p-8 h-full flex flex-col
                ${plan.isPopular 
                  ? 'bg-black text-white shadow-2xl ring-2 ring-[#d0ff59]/50' 
                  : 'bg-[#f8f8f8] text-black border border-black/10'
                }
              `}>
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d0ff59] text-black text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.isPopular ? 'text-white' : 'text-black'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.isPopular ? 'text-white/60' : 'text-black/60'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isAnnual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-black'}`}>
                        ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className={plan.isPopular ? 'text-white/60' : 'text-black/60'}>
                        {plan.priceUnit}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                  {isAnnual && plan.annualPrice > 0 && (
                    <p className={`text-xs mt-1 ${plan.isPopular ? 'text-white/40' : 'text-black/40'}`}>
                      Billed annually (${plan.annualPrice}/year)
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.isPopular ? 'text-[#d0ff59]' : 'text-black'}`} />
                      <span className={`text-sm ${plan.isPopular ? 'text-white/80' : 'text-black/80'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`
                    w-full py-5 font-semibold transition-all
                    ${plan.isPopular 
                      ? 'bg-[#d0ff59] text-black hover:bg-[#b8e04d]' 
                      : 'bg-black text-white hover:bg-black/90'
                    }
                  `}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
