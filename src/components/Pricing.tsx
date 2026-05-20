import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Sparkles, ArrowUpRight, Zap } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface PricingTier {
  id: number;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  color: string;
  gradient: string;
  border: string;
  accent: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    id: 1,
    name: 'Starter',
    tagline: 'Perfect for new businesses',
    price: '$120',
    priceNote: 'one-time',
    color: '#4f7cff',
    gradient: 'linear-gradient(135deg, rgba(79,124,255,0.06) 0%, rgba(124,92,252,0.04) 100%)',
    border: 'rgba(79,124,255,0.18)',
    accent: 'rgba(79,124,255,0.10)',
    features: [
      'Logo design (3 concepts)',
      'Primary color palette',
      'Typography selection',
      '2 revision rounds',
      'Final files (SVG, PNG, PDF)',
      'Basic usage guidelines',
    ],
    cta: 'Get Started',
    ctaHref: 'https://wa.me/201202638313',
  },
  {
    id: 2,
    name: 'Brand Identity',
    tagline: 'Most popular — complete brand system',
    price: '$320',
    priceNote: 'one-time',
    color: '#7c5cfc',
    gradient: 'linear-gradient(135deg, rgba(124,92,252,0.10) 0%, rgba(79,124,255,0.06) 100%)',
    border: 'rgba(124,92,252,0.25)',
    accent: 'rgba(124,92,252,0.12)',
    popular: true,
    features: [
      'Everything in Starter',
      'Full brand identity system',
      'Business card & letterhead',
      'Social media profile kit',
      '5 revision rounds',
      'Brand guidelines document',
      '10 social media templates',
      'Priority delivery (5–7 days)',
    ],
    cta: 'Start a Project',
    ctaHref: 'https://wa.me/201202638313',
  },
  {
    id: 3,
    name: 'Social Media',
    tagline: 'Ongoing content for your brand',
    price: '$180',
    priceNote: '/ month',
    color: '#ff6b35',
    gradient: 'linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(255,150,80,0.04) 100%)',
    border: 'rgba(255,107,53,0.18)',
    accent: 'rgba(255,107,53,0.10)',
    features: [
      '12 custom social posts',
      'Facebook + Instagram formats',
      'Consistent visual style',
      'Campaign & promo designs',
      'Story templates included',
      'Delivered in 2–4 days/batch',
    ],
    cta: 'Get a Quote',
    ctaHref: 'https://wa.me/201202638313',
  },
];

const PricingCard = ({ tier, index }: { tier: PricingTier; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: easeOut }}
      className="relative rounded-2xl p-7 flex flex-col"
      style={{
        background: tier.popular
          ? 'linear-gradient(135deg, #1a1a1a 0%, #252525 60%, #1a1a2e 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #faf6f1 100%)',
        border: tier.popular ? '1px solid rgba(124,92,252,0.4)' : `1px solid ${tier.border}`,
        boxShadow: tier.popular
          ? '0 24px 80px rgba(124,92,252,0.2), 0 8px 24px rgba(0,0,0,0.15)'
          : '0 4px 24px rgba(0,0,0,0.04)',
      }}
      whileHover={{
        y: -8,
        boxShadow: tier.popular
          ? `0 32px 100px rgba(124,92,252,0.3), 0 8px 24px rgba(0,0,0,0.15)`
          : `0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px ${tier.border}`,
        transition: { duration: 0.3 },
      }}
    >
      {/* Popular glow */}
      {tier.popular && (
        <>
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-20 blur-[60px] pointer-events-none rounded-2xl"
            style={{ background: 'radial-gradient(circle, #7c5cfc 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 opacity-15 blur-[40px] pointer-events-none rounded-2xl"
            style={{ background: 'radial-gradient(circle, #4f7cff 0%, transparent 70%)' }}
          />
        </>
      )}

      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold text-white tracking-wide uppercase"
            style={{
              background: 'linear-gradient(135deg, #7c5cfc, #4f7cff)',
              boxShadow: '0 4px 16px rgba(124,92,252,0.5)',
            }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={10} />
            Most Popular
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 mb-6">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: tier.popular ? 'rgba(124,92,252,0.15)' : tier.accent,
            color: tier.color,
          }}
        >
          <Zap size={20} />
        </div>

        <div
          className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-1"
          style={{ color: tier.popular ? 'rgba(255,255,255,0.45)' : tier.color }}
        >
          {tier.name}
        </div>
        <h3
          className="text-[18px] font-bold mb-1 leading-tight"
          style={{ color: tier.popular ? 'white' : '#1a1a1a' }}
        >
          {tier.tagline}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-4">
          <span
            className="text-[44px] font-black leading-none"
            style={{ color: tier.popular ? 'white' : tier.color }}
          >
            {tier.price}
          </span>
          <span
            className="text-[13px] font-medium"
            style={{ color: tier.popular ? 'rgba(255,255,255,0.4)' : '#8a8a8a' }}
          >
            {tier.priceNote}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full mb-5 relative z-10"
        style={{
          background: tier.popular
            ? 'rgba(255,255,255,0.08)'
            : `rgba(237,232,223,0.9)`,
        }}
      />

      {/* Features */}
      <ul className="relative z-10 space-y-3 flex-1 mb-7">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: tier.popular ? 'rgba(124,92,252,0.2)' : tier.accent,
                color: tier.color,
              }}
            >
              <Check size={11} strokeWidth={2.5} />
            </div>
            <span
              className="text-[13.5px] leading-snug"
              style={{ color: tier.popular ? 'rgba(255,255,255,0.7)' : '#5a5a5a' }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.a
        href={tier.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-[14px] transition-all"
        style={
          tier.popular
            ? {
                background: 'linear-gradient(135deg, #7c5cfc, #4f7cff)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(124,92,252,0.4)',
              }
            : {
                background: 'transparent',
                color: tier.color,
                border: `1.5px solid ${tier.border}`,
              }
        }
        whileHover={{
          scale: 1.03,
          boxShadow: tier.popular
            ? '0 8px 30px rgba(124,92,252,0.55)'
            : `0 8px 24px ${tier.accent}`,
        }}
        whileTap={{ scale: 0.97 }}
        data-cursor-hover
      >
        {tier.cta}
        <ArrowUpRight size={15} />
      </motion.a>
    </motion.div>
  );
};

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pricing"
      className="section-padding relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.04] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c5cfc 0%, #4f7cff 50%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#7c5cfc]" />
            <span className="text-[12px] font-semibold text-[#7c5cfc] tracking-[0.2em] uppercase">
              Pricing
            </span>
            <div className="h-px w-8 bg-[#7c5cfc]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="text-[38px] sm:text-[46px] font-black tracking-tight text-[#1a1a1a] leading-[1.1] mb-5"
          >
            Transparent{' '}
            <span className="text-gradient">pricing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            className="text-[15px] text-[#6b6b6b] max-w-[480px] mx-auto leading-relaxed"
          >
            No hidden fees. No surprises. Every package is scoped clearly
            so you know exactly what you're getting.
          </motion.p>

          {/* Custom note */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-[12px] font-medium"
            style={{
              background: 'rgba(79,124,255,0.07)',
              border: '1px solid rgba(79,124,255,0.15)',
              color: '#4f7cff',
            }}
          >
            <Sparkles size={12} />
            Have a custom scope? Message me and I'll put together a tailored quote.
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        {/* Bottom reassurance row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: easeOut }}
          className="flex flex-wrap items-center justify-center gap-8 mt-14"
        >
          {[
            { icon: '✦', text: '100% satisfaction guarantee' },
            { icon: '✦', text: 'Revisions included in every plan' },
            { icon: '✦', text: 'Source files always delivered' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-[#4f7cff] text-[10px]">{item.icon}</span>
              <span className="text-[13px] text-[#6b6b6b] font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
