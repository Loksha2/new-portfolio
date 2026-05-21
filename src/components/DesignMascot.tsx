import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from './ThemeContext';

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
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt
  const tiltXVal = useMotionValue(0);
  const tiltYVal = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(tiltXVal, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(tiltYVal, { stiffness: 90, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Local coordinates of the cursor relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized cursor coordinate range: -0.5 to 0.5
    const normX = (x / width) - 0.5;
    const normY = (y / height) - 0.5;

    // Apply tilt values (limit tilt angle to ~12 degrees max)
    tiltXVal.set(-normY * 12);
    tiltYVal.set(normX * 12);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltXVal.set(0);
    tiltYVal.set(0);
  };

  // Cycle tips
  const nextTip = useCallback(() => {
    setTipIndex((i) => (i + 1) % TIPS.length);
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    nextTip();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative flex flex-col items-center select-none cursor-pointer perspective-[1000px]"
    >
      {/* Premium speech bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-2xl text-[12px] font-bold tracking-wide text-center"
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

      {/* Futuristic floating 3D container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[280px] h-[280px] flex items-center justify-center"
      >
        {/* Soft Radial Glow behind the mascot */}
        <motion.div
          className="absolute w-44 h-44 rounded-full blur-[50px] pointer-events-none"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle, #7c5cfc 0%, #4f7cff 70%, transparent 100%)'
              : 'radial-gradient(circle, #4f7cff 0%, #7c5cfc 70%, transparent 100%)',
          }}
          animate={{
            scale: isHovered ? 1.25 : 1.0,
            opacity: theme === 'dark'
              ? (isHovered ? 0.45 : 0.3)
              : (isHovered ? 0.25 : 0.12),
          }}
          transition={{ duration: 0.4 }}
        />

        {/* The 3D Rendered Mascot Image with Parallax translateZ */}
        <motion.img
          src={theme === 'dark' ? '/images/cyber_mascot_dark.png' : '/images/cyber_mascot_light.png'}
          alt="Cyber Designer Assistant"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
          style={{
            transform: 'translateZ(30px)',
          }}
        />
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
