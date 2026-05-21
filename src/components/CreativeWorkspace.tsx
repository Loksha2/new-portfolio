import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const CreativeWorkspace = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState('#7c5cfc');

  // Motion values for 3D tilt
  const tiltXVal = useMotionValue(0);
  const tiltYVal = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(tiltXVal, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(tiltYVal, { stiffness: 90, damping: 20 });

  // Spring values for SVG Bezier path handles (initial coordinates)
  const handle1X = useSpring(100, { stiffness: 70, damping: 15 });
  const handle1Y = useSpring(120, { stiffness: 70, damping: 15 });
  const handle2X = useSpring(280, { stiffness: 70, damping: 15 });
  const handle2Y = useSpring(320, { stiffness: 70, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Local coordinates of the cursor relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x: Math.round(x), y: Math.round(y) });

    // Normalized cursor coordinate range: -0.5 to 0.5
    const normX = (x / width) - 0.5;
    const normY = (y / height) - 0.5;

    // Apply tilt values (limit tilt angle to ~15 degrees max)
    tiltXVal.set(-normY * 16);
    tiltYVal.set(normX * 16);

    // Make vector handles slide towards the mouse dynamically based on proximity
    const halfWidth = width / 2;
    if (x < halfWidth) {
      handle1X.set(100 + (x - 100) * 0.18);
      handle1Y.set(120 + (y - 120) * 0.18);
    } else {
      handle2X.set(280 + (x - 280) * 0.18);
      handle2Y.set(320 + (y - 320) * 0.18);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltXVal.set(0);
    tiltYVal.set(0);
    // Reset bezier handles to standard defaults
    handle1X.set(100);
    handle1Y.set(120);
    handle2X.set(280);
    handle2Y.set(320);
    setCoords({ x: 0, y: 0 });
  };

  // Convert bezier coordinates to animated SVG path templates dynamically
  const bezierPath = useTransform(
    [handle1X, handle1Y, handle2X, handle2Y],
    ([h1x, h1y, h2x, h2y]) => `M 50 240 C ${h1x} ${h1y}, ${h2x} ${h2y}, 350 240`
  );

  const swatches = [
    { name: 'Brand Indigo', hex: '#7c5cfc' },
    { name: 'Digital Blue',  hex: '#4f7cff' },
    { name: 'Ochre Glow',   hex: '#C8883A' },
    { name: 'Accent Coral',  hex: '#ff6b35' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-full max-w-[460px] aspect-[4/5] perspective-[1000px] select-none"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-[28px] overflow-hidden flex flex-col p-5"
        animate={{
          boxShadow: isHovered
            ? '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 40px rgba(124, 92, 252, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0px rgba(124, 92, 252, 0)',
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Glassmorphic Background Panel */}
        <div
          className="absolute inset-0 z-0 backdrop-blur-[12px]"
          style={{
            background: 'linear-gradient(135deg, rgba(28, 28, 38, 0.7) 0%, rgba(18, 18, 24, 0.85) 100%)',
            border: '1px solid var(--border-subtle)',
          }}
        />

        {/* Dotted Grid Pattern overlay */}
        <div
          className="absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Artboard Frame & Ruler Dials */}
        <div className="absolute top-0 left-0 right-0 h-4 z-10 flex border-b border-white/5 bg-white/[0.02] text-[8px] text-white/20 font-mono items-center px-6 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-8 border-l border-white/10 h-2 flex items-start pl-0.5">
              {i * 20}
            </div>
          ))}
        </div>
        <div className="absolute top-4 left-0 bottom-0 w-4 z-10 flex flex-col border-r border-white/5 bg-white/[0.02] text-[8px] text-white/20 font-mono items-center py-2 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-8 border-t border-white/10 w-2 flex items-end pt-0.5 justify-center">
              {i * 20}
            </div>
          ))}
        </div>

        {/* Artboard Header Label */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/40 mb-5 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeColor }} />
            <span>artboard_01.sketch (75%)</span>
          </div>
          <div>1080 x 1350 px</div>
        </div>

        {/* Core Canvas Workspace Composition */}
        <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/5 bg-black/30 flex items-center justify-center p-4">
          
          {/* Decorative Glowing Radial Orb inside canvas */}
          <motion.div
            className="absolute w-52 h-52 rounded-full blur-[60px] opacity-20 pointer-events-none"
            style={{ background: activeColor }}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Interactive Bezier Vector Line (Pen Tool representation) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Draw Handle Lines */}
            {isHovered && (
              <>
                <motion.line
                  x1={50} y1={240}
                  x2={handle1X} y2={handle1Y}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <motion.line
                  x1={350} y1={240}
                  x2={handle2X} y2={handle2Y}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              </>
            )}

            {/* Main Bezier Curve */}
            <motion.path
              d={bezierPath}
              fill="none"
              stroke={activeColor}
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            {/* Anchor Points */}
            <circle cx={50} cy={240} r="4.5" fill="#1c1c26" stroke={activeColor} strokeWidth="2" />
            <circle cx={350} cy={240} r="4.5" fill="#1c1c26" stroke={activeColor} strokeWidth="2" />

            {/* Bezier Handles (only show on hover) */}
            {isHovered && (
              <>
                <motion.circle cx={handle1X} cy={handle1Y} r="4" fill={activeColor} />
                <motion.circle cx={handle2X} cy={handle2Y} r="4" fill={activeColor} />
              </>
            )}
          </svg>

          {/* Draggable Design Element: Brand Initials Mockup */}
          <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -120, bottom: 120 }}
            dragElastic={0.1}
            whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
            className="absolute z-20 cursor-grab px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-1">LOGO MARK</span>
            <div className="flex items-baseline font-black tracking-tight" style={{ color: activeColor }}>
              <span className="text-4xl">M</span>
              <span className="text-2xl opacity-60">A</span>
            </div>
            <div className="w-12 h-1 bg-white/20 rounded-full mt-2" />
          </motion.div>

          {/* Draggable Layer Card 2: Poster Grid Concept */}
          <motion.div
            drag
            dragConstraints={{ left: -120, right: 120, top: -140, bottom: 140 }}
            dragElastic={0.15}
            whileDrag={{ scale: 1.05 }}
            className="absolute top-6 left-6 z-10 cursor-grab p-3 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-1 w-24"
          >
            <div className="w-full h-1 bg-[#ff6b35] rounded-full opacity-60" />
            <div className="w-3/4 h-1 bg-white/20 rounded-full" />
            <div className="w-full h-8 bg-white/[0.04] rounded-md mt-1 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21" />
              </svg>
            </div>
          </motion.div>

          {/* Floating layers indicator at bottom-right */}
          <div className="absolute bottom-3 right-3 text-[9px] font-mono bg-black/40 text-white/50 px-2 py-1 rounded border border-white/5">
            DRAG_LAYERS
          </div>
        </div>

        {/* Footer: Color Swatches & Coords info */}
        <div className="relative z-10 flex items-center justify-between mt-4 pl-3">
          
          {/* Swatches Container */}
          <div className="flex items-center gap-2">
            {swatches.map((color) => (
              <motion.button
                key={color.hex}
                onClick={() => setActiveColor(color.hex)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all`}
                style={{
                  background: color.hex,
                  borderColor: activeColor === color.hex ? 'white' : 'transparent',
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                title={color.name}
              >
                {activeColor === color.hex && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Live Coords read-out */}
          <div className="flex flex-col text-right font-mono text-[9px] text-white/40">
            {isHovered ? (
              <>
                <div>X: {coords.x}px</div>
                <div>Y: {coords.y}px</div>
              </>
            ) : (
              <>
                <div>X: --</div>
                <div>Y: --</div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreativeWorkspace;
