import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useSiteSettings } from './SiteSettingsContext';
import CreativeWorkspace from './CreativeWorkspace';
import BlurText from './BlurText';

const easeOut = [0.22, 1, 0.36, 1] as const;

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '' }: { target: number | string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const isNum = typeof target === 'number';

  useEffect(() => {
    if (!isInView || !isNum) return;
    const duration = 1400;
    const steps = 50;
    const increment = (target as number) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= (target as number)) {
        setCount(target as number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target, isNum]);

  return (
    <span ref={ref}>
      {isNum ? count : target}{suffix}
    </span>
  );
};

// ─── FLOATING DESIGN ELEMENTS ────────────────────────────────────────────────
const FloatingElements = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Radial glows */}
    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-[120px]"
      style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.3) 0%, transparent 70%)' }} />
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
      style={{ background: 'radial-gradient(circle, rgba(79,124,255,0.25) 0%, transparent 70%)' }} />

    {/* Animated dot grid */}
    <div className="absolute inset-0 opacity-[0.022]"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
      }} />

    {/* Floating accent pills */}
    {[
      { label: 'Logo Design ✦',     top: '12%', left: '6%',  delay: 0,   color: '#4f7cff' },
      { label: 'Brand Identity ✦',  top: '70%', left: '3%',  delay: 1.2, color: '#7c5cfc' },
      { label: 'Social Media ✦',    top: '18%', right: '4%', delay: 0.6, color: '#ff6b35' },
      { label: 'Typography ✦',      top: '75%', right: '5%', delay: 1.8, color: '#C8883A' },
    ].map((item) => (
      <motion.div
        key={item.label}
        className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
        style={{
          top: item.top,
          left: (item as any).left,
          right: (item as any).right,
          background: `${item.color}12`,
          border: `1px solid ${item.color}30`,
          color: item.color,
          backdropFilter: 'blur(8px)',
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4 + (item as any).delay, repeat: Infinity, ease: 'easeInOut', delay: item.delay }}
      >
        {item.label}
      </motion.div>
    ))}
  </div>
);

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { settings } = useSiteSettings();
  const hero = settings.hero;
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <FloatingElements />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col">

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 w-fit"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                {hero.availabilityText}
              </span>
            </motion.div>

            {/* Headline */}
            <BlurText
              text={hero.headline}
              delay={50}
              animateBy="words"
              direction="top"
              className="font-black leading-[1.05] tracking-tight mb-6"
              style={{
                fontSize: 'clamp(38px, 5.5vw, 68px)',
                color: 'var(--text-primary)',
              }}
              as="h1"
            />

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
              className="text-[16px] lg:text-[17px] leading-relaxed max-w-[500px] mb-10"
              style={{ color: 'var(--text-secondary)' }}
            >
              I'm{' '}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {hero.name}
              </span>
              , {hero.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: easeOut }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <motion.button
                onClick={() => handleScroll('#projects')}
                className="btn-primary flex items-center gap-2 group"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                {hero.ctaPrimary}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => handleScroll('#pricing')}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={14} />
                {hero.ctaSecondary}
              </motion.button>
            </motion.div>

            {/* Stats row with animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.46, ease: easeOut }}
              className="flex flex-wrap gap-8"
            >
              {hero.stats.map((stat) => {
                const numMatch = stat.value.match(/^(\d+)(.*)$/);
                const numericVal = numMatch ? parseInt(numMatch[1]) : stat.value;
                const suffix = numMatch ? numMatch[2] : '';
                return (
                  <div key={stat.label} className="flex flex-col">
                    <span
                      className="text-[32px] font-black leading-none"
                      style={{ color: stat.color }}
                    >
                      {typeof numericVal === 'number' ? (
                        <AnimatedCounter target={numericVal} suffix={suffix} />
                      ) : (
                        <>{stat.value}</>
                      )}
                    </span>
                    <span
                      className="text-[12px] font-medium mt-1.5 tracking-wide"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Mascot + floating cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
            className="hidden lg:flex flex-col items-center justify-center gap-6 relative"
          >
            {/* Creative Workspace Artboard */}
            <CreativeWorkspace />

            {/* Mini floating info cards around mascot */}
            <div className="absolute -left-8 top-[15%]">
              <motion.div
                className="rounded-2xl p-3.5 flex items-center gap-3 min-w-[160px]"
                style={{
                  background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(79,124,255,0.1)', color: '#4f7cff' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <path d="M9 9h6M9 13h4"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>Brand Kit</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>Logo · Colors · Type</div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -right-6 top-[20%]">
              <motion.div
                className="rounded-2xl p-3.5 flex items-center gap-3 min-w-[150px]"
                style={{
                  background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex gap-1.5">
                  {['#4f7cff','#7c5cfc','#ff6b35','#C8883A','#1a1a1a'].map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white/20 shadow-sm" style={{ background: c }} />
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="absolute -left-4 bottom-[18%]">
              <motion.div
                className="rounded-2xl px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)',
                  boxShadow: '0 8px 30px rgba(79,124,255,0.35)',
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="text-white font-black text-[13px]">5★ Rated</div>
                <div className="text-white/60 text-[10px]">By every client</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => handleScroll('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        data-cursor-hover
      >
        <span className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: 'var(--text-ghost)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} style={{ color: 'var(--text-ghost)' }} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
