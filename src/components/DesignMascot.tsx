import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

const TIPS = [
  "✦ Great design is invisible.",
  "✦ Color tells the brand's story.",
  "✦ Typography is the brand's voice.",
  "✦ Contrast creates strong focus.",
  "✦ Less elements, more visual power.",
  "✦ Aligning layout grids brings order.",
  "✦ Every pixel communicates value.",
  "✦ Design with strategic purpose.",
  "✦ Brand identity is a visual system.",
  "✦ Whitespace is active room to breathe.",
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export const DesignMascot = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Eye tracking values
  const eyeOffsetX = useSpring(0, { stiffness: 140, damping: 16 });
  const eyeOffsetY = useSpring(0, { stiffness: 140, damping: 16 });

  // Cycle tips
  const nextTip = useCallback(() => {
    setTipIndex((i) => (i + 1) % TIPS.length);
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking for eyes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.32; // Center of eyes area
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      const clamp = Math.min(dist, maxDist) / maxDist;
      
      // Maximum eye offset inside eye sockets (approx 4.5px)
      if (dist > 0) {
        eyeOffsetX.set((dx / dist) * clamp * 5);
        eyeOffsetY.set((dy / dist) * clamp * 4);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [eyeOffsetX, eyeOffsetY]);

  // Blink cycle loop
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 4000;
      return setTimeout(() => {
        blink();
        scheduleNext();
      }, delay);
    };

    const t = scheduleNext();
    return () => clearTimeout(t);
  }, []);

  // Initial greeting
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasGreeted) {
        setIsWaving(true);
        setShowTip(true);
        setHasGreeted(true);
        setTimeout(() => setIsWaving(false), 1600);
        setTimeout(() => setShowTip(false), 3500);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [hasGreeted]);

  const handleClick = () => {
    nextTip();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none">
      
      {/* Premium speech bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-2xl text-[12px] font-bold tracking-wide text-center"
            style={{
              background: 'linear-gradient(135deg, #4f7cff 0%, #7c5cfc 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(124, 92, 252, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.15)',
              minWidth: '200px',
              maxWidth: '240px',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.85 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            {TIPS[tipIndex]}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #7c5cfc',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic floating container */}
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        data-cursor-hover
      >
        <svg
          width="200"
          height="240"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neon Glow Filters */}
          <defs>
            <filter id="neonBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neonCoralGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient Definitions */}
            <linearGradient id="bodyPlateGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e1e2d" />
              <stop offset="50%" stopColor="#12121e" />
              <stop offset="100%" stopColor="#08080f" />
            </linearGradient>
            <linearGradient id="metalChromeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f7cff" />
              <stop offset="100%" stopColor="#7c5cfc" />
            </linearGradient>
            <linearGradient id="glassFaceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c2c3e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1a1a26" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="beretDesignGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2a2a35" />
              <stop offset="50%" stopColor="#3d3d52" />
              <stop offset="100%" stopColor="#1e1e2a" />
            </linearGradient>
          </defs>

          {/* ── GROUND SHADOW (PULSING) ── */}
          <ellipse cx="100" cy="230" rx="42" ry="6" fill="rgba(0,0,0,0.3)" filter="blur(4px)" />

          {/* ── FLOATING THRUSTER GLOW ── */}
          <ellipse cx="100" cy="214" rx="14" ry="4" fill="#7c5cfc" opacity="0.6" filter="url(#neonBlueGlow)" />
          <path d="M90 205 L100 216 L110 205 Z" fill="url(#metalChromeGrad)" opacity="0.8" />

          {/* ── MAIN MECHANICAL CHASSIS (BODY) ── */}
          {/* Carbon Fiber Backing Plates */}
          <rect x="52" y="116" width="96" height="84" rx="24" fill="url(#bodyPlateGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          {/* White outline/edge highlights */}
          <path d="M 58 116 L 142 116" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <path d="M 52 140 L 52 180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* ── CHEST NEON CORE (ENERGY CORE) ── */}
          {/* Outer Ring */}
          <circle cx="100" cy="158" r="22" fill="none" stroke="rgba(79, 124, 255, 0.15)" strokeWidth="1.5" />
          <circle cx="100" cy="158" r="18" fill="none" stroke="#7c5cfc" strokeWidth="1" opacity="0.3" />
          {/* Glowing Center Core */}
          <circle cx="100" cy="158" r="11" fill="#4f7cff" filter="url(#neonBlueGlow)" opacity="0.8" />
          <circle cx="100" cy="158" r="7" fill="white" />
          {/* Mini Tech HUD markings around chest */}
          <rect x="74" y="132" width="6" height="2" rx="1" fill="#ff6b35" opacity="0.8" />
          <rect x="120" y="132" width="6" height="2" rx="1" fill="#ff6b35" opacity="0.8" />
          <path d="M94 182 L106 182" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" />

          {/* ── HEAD AND DIGITAL SCREEN ── */}
          {/* Cyber Head Base */}
          <rect x="48" y="32" width="104" height="78" rx="26" fill="url(#bodyPlateGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          {/* Curved Visor Screen (Glassmorphism overlay) */}
          <rect x="54" y="38" width="92" height="66" rx="20" fill="url(#glassFaceGrad)" stroke="rgba(79, 124, 255, 0.25)" strokeWidth="1" />
          
          {/* Screen Tech Grid lines */}
          <path d="M 64 38 L 64 104 M 136 38 L 136 104" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="54" y1="71" x2="146" y2="71" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

          {/* ── CYBER DESIGNER BERET ── */}
          <path d="M 52 35 C 52 18, 148 18, 148 35 Z" fill="url(#beretDesignGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <ellipse cx="100" cy="20" rx="18" ry="4" fill="#ff6b35" opacity="0.85" filter="url(#neonCoralGlow)" />
          <circle cx="100" cy="17" r="3" fill="white" />

          {/* ── GLOWING LED EYES ── */}
          {!isBlinking ? (
            <>
              {/* Left Eye HUD Target */}
              <circle cx="78" cy="65" r="10" fill="none" stroke="rgba(79, 124, 255, 0.2)" strokeWidth="1" />
              {/* Glowing Iris */}
              <motion.circle
                cx={78} cy={65} r="6.5"
                fill="#4f7cff"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
                filter="url(#neonBlueGlow)"
              />
              <motion.circle
                cx={78} cy={65} r="2.5"
                fill="white"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
              />

              {/* Right Eye HUD Target */}
              <circle cx="122" cy="65" r="10" fill="none" stroke="rgba(79, 124, 255, 0.2)" strokeWidth="1" />
              {/* Glowing Iris */}
              <motion.circle
                cx={122} cy={65} r="6.5"
                fill="#4f7cff"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
                filter="url(#neonBlueGlow)"
              />
              <motion.circle
                cx={122} cy={65} r="2.5"
                fill="white"
                style={{ x: eyeOffsetX, y: eyeOffsetY }}
              />
            </>
          ) : (
            <>
              {/* Blink State (Blinking Line) */}
              <line x1="72" y1="65" x2="84" y2="65" stroke="#4f7cff" strokeWidth="2" strokeLinecap="round" filter="url(#neonBlueGlow)" />
              <line x1="116" y1="65" x2="128" y2="65" stroke="#4f7cff" strokeWidth="2" strokeLinecap="round" filter="url(#neonBlueGlow)" />
            </>
          )}

          {/* ── SOUNDWAVE LED MOUTH ── */}
          <path d="M 86 86 Q 100 93 114 86" stroke="#4f7cff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" filter="url(#neonBlueGlow)" />
          {/* LED Blush */}
          <ellipse cx="64" cy="80" rx="5" ry="3" fill="#ff6b35" opacity="0.35" filter="url(#neonCoralGlow)" />
          <ellipse cx="136" cy="80" rx="5" ry="3" fill="#ff6b35" opacity="0.35" filter="url(#neonCoralGlow)" />

          {/* ── LEFT ARM: DRAWING NEON VECTOR ── */}
          <g>
            {/* Joint */}
            <circle cx="34" cy="130" r="5.5" fill="#1e1e2d" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Upper arm / forearm */}
            <path d="M30 132 L18 160 C 14 168, 20 178, 30 174 L42 166" stroke="url(#metalChromeGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Stylus Pen */}
            <rect x="36" y="160" width="4.5" height="24" rx="2" fill="#ff6b35" transform="rotate(-30 36 160)" filter="url(#neonCoralGlow)" />
            <path d="M37 182 L42 188 L46 181 Z" fill="white" />
          </g>

          {/* ── GLOWING VECTOR DRAWING PATH (drawn by robot stylus) ── */}
          <path d="M 12 186 C 18 202, 38 198, 44 186" fill="none" stroke="#ff6b35" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonCoralGlow)" opacity="0.75" />
          <circle cx="44" cy="186" r="3.5" fill="#12121e" stroke="#ff6b35" strokeWidth="1.5" />
          <circle cx="12" cy="186" r="3.5" fill="#12121e" stroke="#ff6b35" strokeWidth="1.5" />

          {/* ── RIGHT ARM: CYBER PALETTE (WAVING ACTION) ── */}
          <motion.g
            animate={isWaving ? { rotate: [0, -22, 16, -16, 12, 0] } : {}}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            style={{ originX: '166px', originY: '130px' }}
          >
            {/* Joint */}
            <circle cx="166" cy="130" r="5.5" fill="#1e1e2d" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Arm */}
            <path d="M170 132 L182 160 C 186 168, 180 178, 170 174 L158 166" stroke="url(#metalChromeGrad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Floating Glassmorphic Color Palette */}
            <ellipse cx="152" cy="172" rx="14" ry="11" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
            <circle cx="145" cy="168" r="3" fill="#4f7cff" filter="url(#neonBlueGlow)" />
            <circle cx="153" cy="168" r="3" fill="#7c5cfc" />
            <circle cx="160" cy="172" r="3" fill="#ff6b35" filter="url(#neonCoralGlow)" />
            <circle cx="148" cy="177" r="2.5" fill="#C8883A" />
            {/* Hand grab overlay */}
            <circle cx="166" cy="172" r="3.5" fill="#12121e" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </motion.g>
        </svg>
      </motion.div>

      {/* Floating neon text indicator */}
      <motion.p
        className="text-[10px] font-bold mt-2.5 tracking-widest uppercase text-center"
        style={{ color: 'var(--text-faint)' }}
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        tap for design core tips ✦
      </motion.p>
    </div>
  );
};

export default DesignMascot;
