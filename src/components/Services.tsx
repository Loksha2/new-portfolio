import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Image, Eye, ArrowUpRight } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    id: 1,
    icon: <Layers size={24} />,
    title: 'Brand Identity Design',
    tagline: 'Build a brand that speaks before you do.',
    description:
      'Logo direction, color palette, typography, visual language, brand guidelines, and complete identity systems that make your brand instantly recognizable and deeply consistent.',
    features: ['Logo Design', 'Color Palette', 'Typography System', 'Brand Guidelines', 'Visual Language'],
    color: '#4f7cff',
    border: 'rgba(79,124,255,0.15)',
    accent: 'rgba(79,124,255,0.10)',
    hoverGradient: 'linear-gradient(135deg, rgba(79,124,255,0.07) 0%, rgba(124,92,252,0.04) 100%)',
  },
  {
    id: 2,
    icon: <Image size={24} />,
    title: 'Social Media Posters',
    tagline: 'Content that stops the scroll.',
    description:
      'Creative, high-impact posts for Facebook, Instagram, campaigns, offers, announcements, and branded content that maintains visual consistency and drives engagement.',
    features: ['Instagram Posts', 'Facebook Covers', 'Campaign Visuals', 'Offer Designs', 'Story Templates'],
    color: '#7c5cfc',
    border: 'rgba(124,92,252,0.15)',
    accent: 'rgba(124,92,252,0.10)',
    hoverGradient: 'linear-gradient(135deg, rgba(124,92,252,0.07) 0%, rgba(79,124,255,0.04) 100%)',
  },
  {
    id: 3,
    icon: <Eye size={24} />,
    title: 'Visual Direction',
    tagline: 'See your brand clearly, consistently.',
    description:
      'Moodboards, layout direction, content style frameworks, and consistent digital brand appearance strategies that give your brand a clear and cohesive visual identity across all channels.',
    features: ['Moodboards', 'Layout Direction', 'Content Style', 'Brand Consistency', 'Art Direction'],
    color: '#ff6b35',
    border: 'rgba(255,107,53,0.15)',
    accent: 'rgba(255,107,53,0.10)',
    hoverGradient: 'linear-gradient(135deg, rgba(255,107,53,0.07) 0%, rgba(255,150,80,0.04) 100%)',
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: easeOut }}
      className="group relative rounded-2xl p-7 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-alt) 100%)',
        border: `1px solid ${service.border}`,
        boxShadow: 'var(--shadow-md)',
      }}
      whileHover={{
        y: -6,
        boxShadow: `0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px ${service.border}`,
        transition: { duration: 0.3 },
      }}
      data-cursor-hover
    >
      {/* Hover gradient fill */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: service.hoverGradient }}
      />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: service.accent, color: service.color }}
        >
          {service.icon}
        </div>
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
          style={{ background: service.color }}
          initial={{ rotate: -45 }}
          whileHover={{ rotate: 0 }}
        >
          <ArrowUpRight size={14} className="text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div
          className="text-[11px] font-semibold tracking-widest uppercase mb-2"
          style={{ color: service.color }}
        >
          0{service.id} — Service
        </div>
        <h3
          className="text-[20px] font-bold mb-1 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {service.title}
        </h3>
        <p
          className="text-[13px] font-medium mb-4 italic"
          style={{ color: 'var(--text-muted)' }}
        >
          {service.tagline}
        </p>
        <p
          className="text-[14px] leading-[1.75] mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="text-[11px] font-medium px-3 py-1 rounded-full"
              style={{
                background: service.accent,
                color: service.color,
                border: `1px solid ${service.border}`,
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
      />
    </motion.div>
  );
};

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      className="section-padding relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[300px] opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c5cfc 0%, transparent 70%)' }}
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
              What I Do
            </span>
            <div className="h-px w-8 bg-[#7c5cfc]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="text-[38px] sm:text-[46px] font-black tracking-tight leading-[1.1] mb-5"
            style={{ color: 'var(--text-primary)' }}
          >
            Services built for{' '}
            <span className="text-gradient">visual impact</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
            className="text-[16px] max-w-[500px] mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Every service is focused on making your brand feel premium,
            consistent, and impossible to forget.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: easeOut }}
          className="text-center mt-14"
        >
          <p className="text-[14px] mb-4" style={{ color: 'var(--text-faint)' }}>
            Have a project in mind? Let's talk about it.
          </p>
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Start a Project
            <ArrowUpRight size={15} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
