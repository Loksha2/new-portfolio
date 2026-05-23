import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useSiteSettings } from './SiteSettingsContext';
import DesignMascot from './DesignMascot';
import BlurText from './BlurText';
import { smoothScrollTo } from '../utils/scroll';

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
      style={{ background: 'radial-gradient(circle, var(--color-accent-purple-glow) 0%, transparent 70%)' }} />
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
      style={{ background: 'radial-gradient(circle, var(--color-accent-blue-glow) 0%, transparent 70%)' }} />

    {/* Animated dot grid */}
    <div className="absolute inset-0 opacity-[0.022]"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
      }} />

    {/* Floating accent pills removed */}
  </div>
);

const getDynamicColor = (color: string) => {
  const c = color?.toLowerCase();
  if (c === '#4f7cff' || c === '#b72120') return 'var(--color-accent-blue)';
  if (c === '#7c5cfc' || c === '#8c1615') return 'var(--color-accent-purple)';
  if (c === '#ff6b35' || c === '#e03c3b') return 'var(--color-accent-warm)';
  return color;
};

// ─── HERO ────────────────────────────────────────────────────────────────────
const Hero = ({ isVisible = true }: { isVisible?: boolean }) => {
  const { settings } = useSiteSettings();
  const hero = settings.hero;
  const handleScroll = (href: string) => {
    smoothScrollTo(href);
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
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              trigger={isVisible}
              className="font-black leading-[1.05] tracking-tight mb-6"
              style={{
                fontSize: 'clamp(38px, 5.5vw, 68px)',
                color: 'var(--text-primary)',
              }}
              as="h1"
            />

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
                      style={{ color: getDynamicColor(stat.color) }}
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
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
            className="hidden lg:flex flex-col items-center justify-center gap-6 relative"
          >
            {/* Mascot */}
            <DesignMascot />
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
