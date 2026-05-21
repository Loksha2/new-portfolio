import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

const TIPS = [
  "Great design is invisible.",
  "Color tells the story.",
  "Typography is voice.",
  "White space is power.",
  "Grids bring order.",
  "Contrast creates focus.",
  "Less is always more.",
  "Every pixel matters.",
  "Design with purpose.",
  "Brands need systems.",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export const DesignMascot = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Eye tracking
  const eyeOffsetX = useSpring(0, { stiffness: 120, damping: 18 });
  const eyeOffsetY = useSpring(0, { stiffness: 120, damping: 18 });

  // Cycle tips
  const nextTip = useCallback(() => {
    setTipIndex(i => (i + 1) % TIPS.length);
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 3200);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking for eye movement
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.38;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 220;
      const clamp = Math.min(dist, maxDist) / maxDist;
      eyeOffsetX.set((dx / dist) * clamp * 4.5);
      eyeOffsetY.set((dy / dist) * clamp * 4.5);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [eyeOffsetX, eyeOffsetY]);

  // Blink loop
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    };
    const scheduleNext = () => {
      const delay = 2500 + Math.random() * 3000;
      return setTimeout(() => { blink(); scheduleNext(); }, delay);
    };
    const t = scheduleNext();
    return () => clearTimeout(t);
  }, []);

  // Greeting on mount
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasGreeted) {
        setIsWaving(true);
        setShowTip(true);
        setHasGreeted(true);
        setTimeout(() => { setIsWaving(false); }, 1800);
        setTimeout(() => setShowTip(false), 3200);
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [hasGreeted]);

  const handleClick = () => {
    nextTip();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-2xl text-[13px] font-semibold whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
              color: 'white',
              boxShadow: '0 8px 30px var(--color-accent-blue-glow)',
              maxWidth: '220px',
              whiteSpace: 'normal',
              textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {TIPS[tipIndex]}
            {/* Bubble tail */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid var(--color-accent-purple)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The character SVG */}
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        title="Click me for a design tip!"
        data-cursor-hover
      >
        <svg
          width="180"
          height="220"
          viewBox="0 0 180 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── DROP SHADOW ── */}
          <ellipse cx="90" cy="212" rx="40" ry="7" fill="rgba(0,0,0,0.12)" />

          {/* ── BODY / TABLET ── */}
          {/* Tablet body */}
          <rect x="38" y="100" width="104" height="96" rx="18" fill="url(#bodyGrad)" />
          {/* Tablet screen */}
          <rect x="48" y="110" width="84" height="66" rx="10" fill="#0f0f1a" />
          {/* Screen glow */}
          <rect x="48" y="110" width="84" height="66" rx="10" fill="url(#screenGlow)" opacity="0.6" />

          {/* Screen content — mini design grid */}
          <rect x="56" y="118" width="30" height="4" rx="2" fill="var(--color-accent-blue)" opacity="0.9" />
          <rect x="56" y="126" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
          <rect x="56" y="133" width="25" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
          {/* Mini color swatches on screen */}
          {['var(--color-accent-blue)','var(--color-accent-purple)','var(--color-accent-warm)','#C8883A'].map((c, i) => (
            <rect key={c} x={56 + i * 13} y="142" width="10" height="10" rx="3" fill={c} />
          ))}
          {/* Screen cursor line */}
          <rect x="104" y="118" width="2" height="30" rx="1" fill="var(--color-accent-blue)" opacity="0.5" />
          <rect x="104" y="118" width="16" height="16" rx="3" fill="var(--color-accent-blue-glow)" stroke="var(--color-accent-blue)" strokeWidth="1" />
          {/* Pen tool icon on screen */}
          <path d="M108 122 L116 130 L110 136 L106 132 Z" fill="var(--color-accent-purple)" opacity="0.8" />

          {/* Home button */}
          <circle cx="90" cy="189" r="5" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* ── HEAD ── */}
          {/* Head shape */}
          <rect x="44" y="30" width="92" height="78" rx="22" fill="url(#headGrad)" />
          {/* Head highlight */}
          <rect x="54" y="36" width="50" height="20" rx="10" fill="rgba(255,255,255,0.08)" />

          {/* ── BERET (designer hat) ── */}
          <ellipse cx="90" cy="32" rx="40" ry="12" fill="url(#beretGrad)" />
          <ellipse cx="90" cy="28" rx="28" ry="16" fill="url(#beretTop)" />
          {/* Beret pompom */}
          <circle cx="90" cy="14" r="6" fill="var(--color-accent-warm)" />
          <circle cx="90" cy="14" r="3.5" fill="color-mix(in oklab, var(--color-accent-warm) 80%, white)" />

          {/* ── EYES ── */}
          {/* Eye whites */}
          <ellipse cx="72" cy="68" rx="13" ry={isBlinking ? 1.5 : 11} fill="white" />
          <ellipse cx="108" cy="68" rx="13" ry={isBlinking ? 1.5 : 11} fill="white" />

          {/* Pupils — follow mouse via motion values */}
          {!isBlinking && (
            <>
              <motion.circle
                cx={72} cy={68} r="6"
                fill="#1a1a1a"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
              />
              <motion.circle
                cx={108} cy={68} r="6"
                fill="#1a1a1a"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
              />
              {/* Iris accent */}
              <motion.circle cx={72} cy={68} r="3" fill="var(--color-accent-blue)" style={{ x: eyeOffsetX, y: eyeOffsetY }} />
              <motion.circle cx={108} cy={68} r="3" fill="var(--color-accent-blue)" style={{ x: eyeOffsetX, y: eyeOffsetY }} />
              {/* Eye shine */}
              <motion.circle cx={74} cy={65} r="1.5" fill="white" opacity="0.9" style={{ x: eyeOffsetX, y: eyeOffsetY }} />
              <motion.circle cx={110} cy={65} r="1.5" fill="white" opacity="0.9" style={{ x: eyeOffsetX, y: eyeOffsetY }} />
            </>
          )}

          {/* ── MOUTH ── */}
          <path d="M78 88 Q90 96 102 88" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* ── CHEEK blush ── */}
          <ellipse cx="60" cy="82" rx="8" ry="5" fill="var(--color-accent-warm)" opacity="0.18" />
          <ellipse cx="120" cy="82" rx="8" ry="5" fill="var(--color-accent-warm)" opacity="0.18" />

          {/* ── ARMS ── */}
          {/* Left arm */}
          <rect x="18" y="108" width="24" height="50" rx="12" fill="url(#headGrad)" />
          {/* Left hand holding pencil */}
          <ellipse cx="30" cy="162" rx="11" ry="11" fill="url(#headGrad)" />
          {/* Pencil */}
          <rect x="22" y="158" width="5" height="28" rx="2.5" fill="#ffd700" transform="rotate(-20 26 165)" />
          <path d="M19 176 L22 183 L27 178 Z" fill="var(--color-accent-warm)" transform="rotate(-20 23 179)" />
          <rect x="22" y="158" width="5" height="5" rx="1" fill="#e8bfbf" transform="rotate(-20 26 165)" />

          {/* Right arm — waving */}
          <motion.g
            animate={isWaving ? { rotate: [0, -20, 15, -15, 10, 0] } : {}}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ originX: '138px', originY: '115px' }}
          >
            <rect x="138" y="108" width="24" height="50" rx="12" fill="url(#headGrad)" />
            <ellipse cx="150" cy="162" rx="11" ry="11" fill="url(#headGrad)" />
            {/* Palette in right hand */}
            <ellipse cx="153" cy="166" rx="13" ry="11" fill="#f5f0e8" transform="rotate(-10 150 162)" />
            {['var(--color-accent-blue)','var(--color-accent-purple)','var(--color-accent-warm)'].map((c, i) => (
              <circle key={c} cx={147 + i * 6} cy={165} r="3" fill={c} transform="rotate(-10 150 162)" />
            ))}
            <circle cx="155" cy="170" r="2.5" fill="#C8883A" transform="rotate(-10 150 162)" />
            {/* Thumb hole */}
            <circle cx="148" cy="162" r="3" fill="rgba(0,0,0,0.15)" transform="rotate(-10 150 162)" />
          </motion.g>

          {/* ── LEGS / STAND ── */}
          <rect x="72" y="194" width="16" height="20" rx="6" fill="url(#headGrad)" />
          <rect x="92" y="194" width="16" height="20" rx="6" fill="url(#headGrad)" />
          {/* Shoes */}
          <rect x="66" y="210" width="26" height="10" rx="5" fill="#1a1a1a" />
          <rect x="88" y="210" width="26" height="10" rx="5" fill="#1a1a1a" />

          {/* ── GRADIENTS ── */}
          <defs>
            <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5e6d3" />
              <stop offset="100%" stopColor="#e8ccb0" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2a2a35" />
              <stop offset="100%" stopColor="#1a1a25" />
            </linearGradient>
            <linearGradient id="beretGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#2d2d3a" />
            </linearGradient>
            <linearGradient id="beretTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d2d3a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <radialGradient id="screenGlow" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-accent-purple)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Click hint */}
      <motion.p
        className="text-[11px] font-medium mt-1 tracking-wide"
        style={{ color: 'var(--text-faint)' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        click for design tips ✦
      </motion.p>
    </div>
  );
};

export default DesignMascot;
