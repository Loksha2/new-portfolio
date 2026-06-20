import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

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

const TOAST_MESSAGES = [
  { message: "✓ Auto-saved to Cloud", type: "success" },
  { message: "✦ Design Canvas optimized", type: "success" },
  { message: "🎨 Color Palette updated", type: "info" },
  { message: "✓ Layer 'Logo Mark' duplicated", type: "success" },
  { message: "✨ Parallax perspective adjusted", type: "info" },
  { message: "⚡ Render engine running at 60fps", type: "success" },
  { message: "Bezier handles aligned", type: "info" },
  { message: "⚠ Out of artboard bounds", type: "warning" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

// Shared panel style
const panelStyle = (bg = '#16161e'): React.CSSProperties => ({
  background: bg,
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.06) inset',
  willChange: 'transform',
});

export const DesignMascot = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [activeTool, setActiveTool] = useState(2);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Different parallax intensities for different depth layers
  const rx = useTransform(mouseY, [-400, 400], [8, -8]);
  const ry = useTransform(mouseX, [-400, 400], [-8, 8]);
  const srx = useSpring(rx, { stiffness: 50, damping: 20 });
  const sry = useSpring(ry, { stiffness: 50, damping: 20 });

  // Floating elements get more movement
  const fx = useTransform(mouseX, [-400, 400], [-15, 15]);
  const fy = useTransform(mouseY, [-400, 400], [-15, 15]);
  const sfx = useSpring(fx, { stiffness: 60, damping: 18 });
  const sfy = useSpring(fy, { stiffness: 60, damping: 18 });

  // Far floating icons get even more
  const ix = useTransform(mouseX, [-400, 400], [-25, 25]);
  const iy = useTransform(mouseY, [-400, 400], [-25, 25]);
  const six = useSpring(ix, { stiffness: 70, damping: 16 });
  const siy = useSpring(iy, { stiffness: 70, damping: 16 });

  const [toasts, setToasts] = useState<{ id: string; message: string; type: string }[]>([]);

  const particles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 340 - 170,
      y: Math.random() * 320 - 160,
      z: Math.random() * 80 - 20,
      size: Math.random() * 2.5 + 1.5,
      color: ['var(--color-accent-blue)', 'var(--color-accent-purple)', 'var(--color-accent-warm)'][i % 3],
      delay: Math.random() * 4,
      duration: Math.random() * 5 + 5,
    }));
  }, []);

  useEffect(() => {
    const showRandomToast = () => {
      const random = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, ...random }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    const firstTimeout = setTimeout(showRandomToast, 4000);
    const interval = setInterval(showRandomToast, 9000);
    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  const nextTip = useCallback(() => {
    setTipIndex(i => (i + 1) % TIPS.length);
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };
    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3200);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => nextTip();

  const tools = [
    'M12 2L8 6h3v5H6V8l-4 4 4 4v-3h5v5H8l4 4 4-4h-3v-5h5v3l4-4-4-4v3h-5V6h3z',
    'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86z',
    'M2 4v3h5v12h3V7h5V4H2zm19 5h-9v3h3v7h3v-7h3V9z',
    'M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5z',
    'M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.42-1.42-1.41 1.42 1.41 1.41L3 17.25V21h3.75l9.43-9.43 1.41 1.41 1.42-1.41-1.42-1.42 3.12-3.12a1 1 0 000-1.4z',
    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z',
    'M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31A7.98 7.98 0 0012 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31z',
  ];

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none">
      {/* Toast notifications container */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 20, transition: { duration: 0.2 } }}
              className="px-3.5 py-2 rounded-xl text-[10px] font-semibold flex items-center gap-2 border shadow-lg backdrop-blur-md"
              style={{
                background: t.type === 'warning' ? 'rgba(200, 136, 58, 0.15)' : 'rgba(22, 22, 30, 0.85)',
                borderColor: t.type === 'warning' ? 'rgba(200, 136, 58, 0.3)' : t.type === 'success' ? 'rgba(0, 180, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: t.type === 'warning' ? '#f5b041' : '#f5f5f5',
                boxShadow: t.type === 'success' ? '0 4px 20px rgba(0, 180, 255, 0.1)' : '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {t.type === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              {t.type === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
              {t.type === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl text-[13px] font-semibold"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))',
              color: 'white',
              boxShadow: '0 8px 40px var(--color-accent-blue-glow)',
              maxWidth: '240px', whiteSpace: 'normal', textAlign: 'center',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {TIPS[tipIndex]}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
              style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid var(--color-accent-purple)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ 3D SCENE ═══════ */}
      <motion.div
        onClick={handleClick}
        className="relative cursor-pointer"
        style={{
          width: '480px',
          height: '460px',
          perspective: '1200px',
          perspectiveOrigin: '50% 45%',
        }}
        title="Click for a design tip!"
        data-cursor-hover
      >
        {/* ── BASE ROTATION GROUP ── */}
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            rotateX: srx,
            rotateY: sry,
          }}
        >
          {/* ━━━ FLOATING 3D PARTICLES ━━━ */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                background: p.color,
                x: p.x,
                y: p.y,
                z: p.z,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
              animate={{
                y: [p.y - 15, p.y + 15, p.y - 15],
                x: [p.x - 10, p.x + 10, p.x - 10],
                opacity: [0.1, 0.7, 0.1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* ━━━ PANEL 1: MAIN CANVAS (center, back layer) ━━━ */}
          <motion.div
            className="absolute overflow-hidden"
            style={{
              ...panelStyle('#111118'),
              width: '310px',
              height: '240px',
              left: '85px',
              top: '110px',
              transformStyle: 'preserve-3d',
              z: -20,
            }}
            whileHover={{
              z: 10,
              scale: 1.03,
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 15px rgba(0,180,255,0.2), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Canvas grid */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
            {/* Artboard area */}
            <div className="absolute inset-3 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
              {/* Logo composition */}
              <div className="absolute" style={{ left: '10%', top: '10%' }}>
                <motion.svg width="90" height="90" viewBox="0 0 90 90" fill="none"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.circle cx="45" cy="45" r="38" stroke="var(--color-accent-blue)" strokeWidth="1.5" fill="none"
                    strokeDasharray="239" animate={{ strokeDashoffset: [239, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  />
                  <motion.circle cx="45" cy="45" r="25" stroke="var(--color-accent-purple)" strokeWidth="1" fill="none" opacity={0.4}
                    strokeDasharray="157" animate={{ strokeDashoffset: [0, 157] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  />
                  <motion.polygon points="45,14 68,45 45,76 22,45" stroke="var(--color-accent-blue)" strokeWidth="1.5"
                    fill="var(--color-accent-blue)" fillOpacity={0.07}
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '45px 45px' }}
                  />
                  <motion.circle cx="45" cy="45" r="4" fill="var(--color-accent-blue)"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}
                  />
                  <circle cx="45" cy="45" r="1.5" fill="white" opacity={0.9} />
                </motion.svg>
                {/* Selection handles */}
                {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((p,i) => (
                  <div key={i} className="absolute w-[5px] h-[5px] bg-white border rounded-[1px]"
                    style={{ top: p.t !== undefined ? -2 : undefined, bottom: p.b !== undefined ? -2 : undefined, left: p.l !== undefined ? -2 : undefined, right: p.r !== undefined ? -2 : undefined, borderColor: 'var(--color-accent-blue)' }}
                  />
                ))}
              </div>

              {/* Brand text */}
              <div className="absolute" style={{ right: '8%', top: '12%' }}>
                <motion.div className="text-[18px] font-black tracking-tight text-white/90"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >LOKSHA</motion.div>
                <motion.div className="text-[7px] font-bold tracking-[0.35em] mt-0.5"
                  style={{ color: 'var(--color-accent-blue)', overflow: 'hidden' }}
                  animate={{ width: ['0px', '80px', '80px', '0px'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.7, 1] }}
                ><div className="whitespace-nowrap">CREATIVE STUDIO</div></motion.div>
              </div>

              {/* Typography */}
              <div className="absolute" style={{ left: '10%', bottom: '20%' }}>
                <motion.div className="text-[14px] font-black" style={{ color: 'var(--color-accent-purple)' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >Aa Bb</motion.div>
                <div className="flex flex-col gap-[2px] mt-1">
                  <div className="h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.12)', width: '60px' }} />
                  <div className="h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)', width: '45px' }} />
                </div>
              </div>

              {/* Bezier */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path d="M 25 190 C 60 130, 180 160, 260 100" stroke="var(--color-accent-warm)"
                  strokeWidth="1" fill="none" opacity={0.3} strokeDasharray="350"
                  animate={{ strokeDashoffset: [350, 0, 0, 350] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', times: [0, 0.35, 0.65, 1] }}
                />
              </svg>

              {/* Color swatches */}
              <div className="absolute flex gap-[5px]" style={{ right: '8%', bottom: '15%' }}>
                {['var(--color-accent-blue)', 'var(--color-accent-purple)', 'var(--color-accent-warm)', '#C8883A', '#f5f5f5'].map((c, i) => (
                  <motion.div key={i} className="w-[14px] h-[14px] rounded-[4px]"
                    style={{ background: c, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ━━━ PANEL 2: TOP CONTROL BAR (floating above) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#1a1a24'),
              width: '260px', height: '38px',
              left: '110px', top: '68px',
              x: sfx, y: sfy,
              z: 30,
              rotateX: 2,
            }}
            whileHover={{
              z: 60,
              scale: 1.05,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center h-full px-3 gap-2">
              {/* Color swatches */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-md border border-white/10" style={{ background: 'var(--color-accent-blue)' }} />
                <div className="w-5 h-5 rounded-md border border-white/10 relative overflow-hidden" style={{ background: '#1a1a1a' }}>
                  <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, #ff5f57, #ff5f57 2px, white 2px, white 4px)' }} />
                </div>
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              {/* Stroke width */}
              <span className="text-[8px] text-gray-500">Stroke:</span>
              <div className="bg-white/[0.04] rounded px-2 py-0.5">
                <span className="text-[8px] text-gray-400 font-mono">1.5 pt</span>
              </div>
              <div className="w-px h-5 bg-white/[0.06]" />
              <span className="text-[8px] text-gray-500">Opacity:</span>
              <div className="bg-white/[0.04] rounded px-2 py-0.5">
                <span className="text-[8px] text-gray-400 font-mono">100%</span>
              </div>
              <div className="flex-1" />
              <span className="text-[8px] text-gray-600">&gt;</span>
            </div>
          </motion.div>

          {/* ━━━ PANEL 3: LEFT TOOLBAR (floating left) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#18181f'),
              width: '42px',
              padding: '8px 6px',
              left: '22px', top: '120px',
              x: sfx, y: sfy,
              z: 40,
              rotateY: 6,
            }}
            whileHover={{
              z: 75,
              scale: 1.06,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 15px rgba(0,180,255,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="flex flex-col items-center gap-[3px]">
              {tools.map((path, i) => (
                <button key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveTool(i); }}
                  className="w-[28px] h-[28px] rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: activeTool === i
                      ? 'linear-gradient(135deg, var(--color-accent-blue), color-mix(in oklab, var(--color-accent-blue) 70%, var(--color-accent-purple)))'
                      : 'transparent',
                    boxShadow: activeTool === i ? '0 2px 10px var(--color-accent-blue-glow)' : 'none',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={activeTool === i ? 'white' : '#505058'}>
                    <path d={path} />
                  </svg>
                </button>
              ))}
              <div className="w-5 h-px bg-white/[0.06] my-1" />
              {/* FG/BG colors */}
              <div className="relative w-[24px] h-[24px]">
                <div className="absolute top-0 left-0 w-[16px] h-[16px] rounded-[4px] z-10 border-2"
                  style={{ background: 'var(--color-accent-blue)', borderColor: '#18181f' }} />
                <div className="absolute bottom-0 right-0 w-[16px] h-[16px] rounded-[4px] border-2"
                  style={{ background: 'white', borderColor: '#18181f' }} />
              </div>
            </div>
          </motion.div>

          {/* ━━━ PANEL 4: LAYERS (floating right) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#18181f'),
              width: '145px',
              left: '345px', top: '130px',
              x: sfx, y: sfy,
              z: 45,
              rotateY: -5,
            }}
            whileHover={{
              z: 80,
              scale: 1.05,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 15px rgba(0,180,255,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-bold text-gray-400 tracking-wider">Layers</span>
                <div className="flex gap-2">
                  <span className="text-[10px] text-gray-600">+</span>
                  <span className="text-[10px] text-gray-600">⋯</span>
                </div>
              </div>
              {[
                { name: 'Logo Mark', color: 'var(--color-accent-blue)', active: true },
                { name: 'Typography', color: 'var(--color-accent-purple)', active: false },
                { name: 'Color System', color: 'var(--color-accent-warm)', active: false },
                { name: 'Background', color: '#555', active: false },
              ].map((layer, i) => (
                <motion.div key={i}
                  className="flex items-center gap-2 py-[5px] px-2 rounded-lg mb-[2px]"
                  style={{
                    background: layer.active ? 'rgba(0,139,139,0.12)' : 'transparent',
                    borderLeft: layer.active ? '2px solid var(--color-accent-blue)' : '2px solid transparent',
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  {/* Eye icon */}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#555">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  <div className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ background: layer.color }} />
                  <span className={`text-[8px] truncate flex-1 font-medium ${layer.active ? 'text-gray-300' : 'text-gray-500'}`}>
                    {layer.name}
                  </span>
                  {/* Lock icon */}
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#444">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ━━━ PANEL 5: COLOR/GRADIENT PANEL (bottom right, floating forward) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#1a1a24'),
              width: '170px',
              left: '290px', top: '330px',
              x: sfx, y: sfy,
              z: 55,
              rotateX: -3,
              rotateY: -3,
            }}
            whileHover={{
              z: 90,
              scale: 1.05,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 15px rgba(255,95,87,0.15), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-gray-400 tracking-wider">Gradient</span>
                <span className="text-[8px] text-gray-600">Type: Linear</span>
              </div>
              {/* Gradient bar */}
              <div className="relative h-[18px] rounded-lg overflow-hidden mb-2"
                style={{ background: 'linear-gradient(90deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 50%, var(--color-accent-warm) 100%)' }}
              >
                {/* Stops */}
                {[0, 50, 100].map(pos => (
                  <div key={pos} className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[14px] rounded-[3px] border-2 border-white"
                    style={{ left: `calc(${pos}% - 5px)`, boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] text-gray-500">Opacity:</span>
                  <span className="text-[8px] text-gray-400 font-mono">100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] text-gray-500">Location:</span>
                  <span className="text-[8px] text-gray-400 font-mono">50%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ━━━ PANEL 6: PATHFINDER (bottom left, floating) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#1a1a24'),
              width: '130px',
              left: '15px', top: '345px',
              x: sfx, y: sfy,
              z: 50,
              rotateX: -2,
              rotateY: 4,
            }}
            whileHover={{
              z: 85,
              scale: 1.05,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <div className="p-3">
              <span className="text-[9px] font-bold text-gray-400 tracking-wider">Shape Modes</span>
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[
                  'M3 3h18v18H3V3zm2 2v14h14V5H5z',
                  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
                  'M3 3h8v8H3V3zm2 2v4h4V5H5z',
                  'M12 2l9 19H3L12 2z',
                ].map((d, i) => (
                  <div key={i} className="w-[24px] h-[24px] rounded-md flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#666"><path d={d} /></svg>
                  </div>
                ))}
              </div>
              <span className="text-[8px] font-bold text-gray-500 tracking-wider mt-2.5 block">Pathfinder:</span>
              <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-[24px] h-[24px] rounded-md bg-white/[0.03] border border-white/[0.04]" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ━━━ PANEL 7: Mini AI logo icon (top right, floating far forward) ━━━ */}
          <motion.div
            className="absolute"
            style={{
              ...panelStyle('#1e1e28'),
              width: '48px', height: '48px',
              left: '405px', top: '70px',
              x: sfx, y: sfy,
              z: 65,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            whileHover={{
              z: 100,
              scale: 1.1,
              boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 20px rgba(0,180,255,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))' }}>
              <div className="w-full h-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* ━━━ FLOATING ICONS (scattered, furthest layer) ━━━ */}
          {/* T icon */}
          <motion.div className="absolute" style={{ left: '-5px', top: '80px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          >
            <motion.div className="w-[34px] h-[34px] rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-[16px] font-black" style={{ color: 'var(--color-accent-purple)', opacity: 0.7 }}>T</span>
            </motion.div>
          </motion.div>

          {/* Cursor icon */}
          <motion.div className="absolute" style={{ right: '-10px', top: '260px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          >
            <motion.div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 20" fill="none">
                <path d="M1 1L1 15L5 11L9 18L11.5 17L7.5 9L12 9L1 1Z" fill="var(--color-accent-blue)" opacity={0.6} />
              </svg>
            </motion.div>
          </motion.div>

          {/* Star/sparkle */}
          <motion.div className="absolute" style={{ left: '430px', top: '42px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-accent-warm)" opacity={0.5}>
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Color wheel icon */}
          <motion.div className="absolute" style={{ left: '-15px', top: '310px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          >
            <motion.div className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
              style={{ border: '1.5px solid rgba(255,255,255,0.08)' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-[20px] h-[20px] rounded-full"
                style={{ background: 'conic-gradient(var(--color-accent-blue), var(--color-accent-purple), var(--color-accent-warm), var(--color-accent-blue))', opacity: 0.5 }}
              />
            </motion.div>
          </motion.div>

          {/* Pen bezier dots */}
          <motion.div className="absolute" style={{ left: '455px', top: '300px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          >
            <motion.svg width="20" height="20" viewBox="0 0 20 20"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx="3" cy="17" r="2.5" fill="var(--color-accent-blue)" opacity={0.5} />
              <circle cx="17" cy="3" r="2.5" fill="var(--color-accent-blue)" opacity={0.5} />
              <line x1="3" y1="17" x2="17" y2="3" stroke="var(--color-accent-blue)" strokeWidth="0.8" opacity={0.3} />
            </motion.svg>
          </motion.div>

          {/* Diamond shape */}
          <motion.div className="absolute" style={{ left: '70px', top: '35px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          >
            <motion.div className="w-[18px] h-[18px] rounded-[3px] rotate-45"
              style={{ background: 'var(--color-accent-warm)', opacity: 0.3 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Circle outline */}
          <motion.div className="absolute" style={{ left: '440px', top: '170px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          >
            <motion.div className="w-[22px] h-[22px] rounded-full border"
              style={{ borderColor: 'var(--color-accent-purple)', opacity: 0.3 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Zigzag decoration top */}
          <motion.div className="absolute" style={{ left: '140px', top: '25px', x: six, y: siy }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
          >
            <motion.svg width="60" height="12" viewBox="0 0 60 12"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polyline points="0,10 7,2 14,10 21,2 28,10 35,2 42,10 49,2 56,10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Click hint */}
      <motion.p className="text-[11px] font-medium mt-2 tracking-wide"
        style={{ color: 'var(--text-faint)' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        click for design tips ✦
      </motion.p>
    </div>
  );
};

export default DesignMascot;
