import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const smoothX = useSpring(cursorX, { damping: 28, stiffness: 420, mass: 0.3 });
  const smoothY = useSpring(cursorY, { damping: 28, stiffness: 420, mass: 0.3 });

  /* Trailing ring */
  const trailX = useMotionValue(-300);
  const trailY = useMotionValue(-300);
  const smoothTX = useSpring(trailX, { damping: 38, stiffness: 160, mass: 0.9 });
  const smoothTY = useSpring(trailY, { damping: 38, stiffness: 160, mass: 0.9 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
      setIsVisible(true);
    };

    const onHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsPointer(
        t.tagName === 'BUTTON' ||
        t.tagName === 'A' ||
        t.closest('button') !== null ||
        t.closest('a') !== null ||
        t.closest('[data-cursor-hover]') !== null ||
        getComputedStyle(t).cursor === 'pointer'
      );
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousemove', onHover);
    document.addEventListener('mouseenter', () => setIsVisible(true));
    document.addEventListener('mouseleave', () => setIsVisible(false));

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', onHover);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  if (isTouchDevice) return null;

  /*
   * Arrow cursor — tip at top-left (0, 0) of the SVG.
   * No offset needed since the hotspot is at the origin.
   */
  return (
    <>
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: smoothTX,
          y: smoothTY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 2.2 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.18 }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `1.5px solid ${isPointer ? 'color-mix(in oklab, var(--color-accent-blue) 55%, transparent)' : 'rgba(26,26,26,0.18)'}`,
            background: isPointer ? 'color-mix(in oklab, var(--color-accent-blue) 6%, transparent)' : 'transparent',
            transition: 'border-color 0.2s, background 0.2s',
          }}
        />
      </motion.div>

      {/* Arrow cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '0px',
          translateY: '0px',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPointer ? 1.1 : 1,
        }}
        transition={{ duration: 0.12 }}
      >
        <svg
          width="28"
          height="34"
          viewBox="0 0 28 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: isPointer
              ? 'drop-shadow(0 0 5px color-mix(in oklab, var(--color-accent-blue) 60%, transparent)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))'
              : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            transition: 'filter 0.2s ease',
          }}
        >
          {/* Arrow pointer shape — classic cursor */}
          <path
            d="M1 1 L1 25 L7.5 19 L13 30 L17 28 L11.5 17.5 L20 17.5 Z"
            fill={isPointer ? 'color-mix(in oklab, var(--color-accent-blue) 80%, black)' : '#1a1a1a'}
            stroke={isPointer ? 'var(--color-accent-blue)' : '#fff'}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </>
  );
};

export default CustomCursor;
