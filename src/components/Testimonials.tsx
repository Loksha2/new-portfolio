import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string; // initials fallback
  avatarColor: string;
  text: string;
  rating: number;
  project: string;
}

// ─── REPLACE THESE with real client testimonials ───────────────────────────
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Al-Rashidi',
    role: 'Founder',
    company: 'Bloom Café',
    avatar: 'SA',
    avatarColor: '#C8883A',
    text: 'Mohamad took our vague idea and turned it into a complete brand identity that truly represents us. The logo, colors, and guidelines he delivered were beyond what we imagined. Our customers constantly compliment the visual identity.',
    rating: 5,
    project: 'Brand Identity',
  },
  {
    id: 2,
    name: 'Karim Hassan',
    role: 'Marketing Director',
    company: 'TechNova',
    avatar: 'KH',
    avatarColor: '#4f7cff',
    text: "The social media posters Mohamad designed increased our engagement by over 40%. He understands how design and marketing work together. Fast delivery, clear communication, and the designs were scroll-stopping.",
    rating: 5,
    project: 'Social Media Campaign',
  },
  {
    id: 3,
    name: 'Layla Mansour',
    role: 'CEO',
    company: 'Mode Boutique',
    avatar: 'LM',
    avatarColor: '#c084fc',
    text: 'We needed a luxury rebrand and Mohamad delivered exactly that. The editorial feel, the refined typography, every detail was thoughtful. Our new visual identity has attracted a completely new level of clientele.',
    rating: 5,
    project: 'Brand Redesign',
  },
  {
    id: 4,
    name: 'Ahmed Nour',
    role: 'Owner',
    company: 'FitZone',
    avatar: 'AN',
    avatarColor: '#ff6b35',
    text: "High energy, bold, and exactly on-brand. Mohamad's gym campaign designs drove our January membership sign-ups to a record high. I'll be working with him every quarter going forward.",
    rating: 5,
    project: 'Promotion Campaign',
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        fill={i < rating ? '#fbbf24' : 'none'}
        stroke={i < rating ? '#fbbf24' : 'currentColor'}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive((next + testimonials.length) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Decorative */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[400px] opacity-[0.04] blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#ff6b35]" />
            <span className="text-[12px] font-semibold text-[#ff6b35] tracking-[0.2em] uppercase">
              Client Love
            </span>
            <div className="h-px w-8 bg-[#ff6b35]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="text-[38px] sm:text-[46px] font-black tracking-tight leading-[1.1]"
            style={{ color: 'var(--text-primary)' }}
          >
            What clients{' '}
            <span className="text-gradient">say</span>
          </motion.h2>
        </div>

        {/* Main testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
          className="relative"
        >
          <div
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Big quote mark */}
            <div
              className="absolute top-6 right-8 opacity-[0.06]"
              style={{ color: 'var(--text-primary)' }}
            >
              <Quote size={120} fill="currentColor" />
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start relative z-10">
              <div>
                {/* Stars */}
                <div className="mb-4">
                  <StarRating rating={t.rating} />
                </div>

                {/* Quote */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={t.id}
                    initial={{ opacity: 0, x: dir * 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -dir * 20 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    className="text-[17px] leading-[1.8] mb-6 font-medium italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    "{t.text}"
                  </motion.p>
                </AnimatePresence>

                {/* Author */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`author-${t.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    {/* Avatar */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                      style={{ background: t.avatarColor }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                        {t.name}
                      </div>
                      <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        {t.role} · {t.company}
                      </div>
                    </div>
                    {/* Project tag */}
                    <span
                      className="ml-2 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${t.avatarColor}18`,
                        color: t.avatarColor,
                        border: `1px solid ${t.avatarColor}30`,
                      }}
                    >
                      {t.project}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex md:flex-col gap-3 items-center">
                <motion.button
                  onClick={() => go(active - 1)}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--bg-section-alt2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  whileHover={{ scale: 1.1, background: '#4f7cff', color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-hover
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  onClick={() => go(active + 1)}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: 'var(--bg-section-alt2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  whileHover={{ scale: 1.1, background: '#4f7cff', color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor-hover
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === active ? '24px' : '8px',
                  height: '8px',
                  background: i === active
                    ? 'linear-gradient(90deg, #4f7cff, #7c5cfc)'
                    : 'var(--border-subtle)',
                }}
                data-cursor-hover
              />
            ))}
          </div>
        </motion.div>

        {/* Mini cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {testimonials.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => go(i)}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: easeOut }}
              className="p-4 rounded-2xl text-left transition-all"
              style={{
                background: active === i
                  ? `${item.avatarColor}12`
                  : 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                border: active === i
                  ? `1.5px solid ${item.avatarColor}40`
                  : '1px solid var(--border-subtle)',
              }}
              whileHover={{ y: -3 }}
              data-cursor-hover
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: item.avatarColor }}
                >
                  {item.avatar}
                </div>
                <StarRating rating={item.rating} />
              </div>
              <div className="text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {item.company}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
