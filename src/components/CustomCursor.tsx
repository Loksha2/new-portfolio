import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const arrow = arrowRef.current;
    const ring = ringRef.current;
    if (!arrow || !ring) return;

    let mouseX = -300;
    let mouseY = -300;
    let ringX = -300;
    let ringY = -300;
    let ringVx = 0;
    let ringVy = 0;
    let isVisible = false;
    let isPointer = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        arrow.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const hoverState = (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[data-cursor-hover]') !== null ||
        getComputedStyle(target).cursor === 'pointer'
      );

      if (hoverState !== isPointer) {
        isPointer = hoverState;
        if (isPointer) {
          ring.classList.add('is-pointer');
          arrow.classList.add('is-pointer');
        } else {
          ring.classList.remove('is-pointer');
          arrow.classList.remove('is-pointer');
        }
      }

      arrow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onMouseEnter = () => {
      isVisible = true;
      arrow.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const onMouseLeave = () => {
      isVisible = false;
      arrow.style.opacity = '0';
      ring.style.opacity = '0';
    };

    let animId = 0;
    const updateRing = () => {
      // Smoothly interpolate trailing ring using spring physics
      const fx = (mouseX - ringX) * 0.15;
      const fy = (mouseY - ringY) * 0.15;
      
      ringVx = (ringVx + fx) * 0.65;
      ringVy = (ringVy + fy) * 0.65;
      
      ringX += ringVx;
      ringY += ringVy;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      animId = requestAnimationFrame(updateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <style>{`
        .custom-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9998;
          transform: translate3d(-300px, -300px, 0);
          will-change: transform;
          transition: opacity 0.2s ease;
        }
        .custom-cursor-ring-inner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(26,26,26,0.18);
          background: transparent;
          transform: translate(-50%, -50%) scale(1);
          transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
          will-change: transform;
        }
        .custom-cursor-ring.is-pointer .custom-cursor-ring-inner {
          border-color: color-mix(in oklab, var(--color-accent-blue) 55%, transparent);
          background-color: color-mix(in oklab, var(--color-accent-blue) 6%, transparent);
          transform: translate(-50%, -50%) scale(2.2);
        }
        
        .custom-cursor-arrow {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          transform: translate3d(-300px, -300px, 0);
          will-change: transform;
          transition: opacity 0.2s ease;
        }
        .custom-cursor-arrow-inner {
          transform: scale(1);
          transition: transform 0.2s ease, filter 0.2s ease;
          will-change: transform;
        }
        
        .custom-cursor-arrow svg {
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
        }
        
        .custom-cursor-arrow.is-pointer .custom-cursor-arrow-inner {
          transform: scale(1.1);
        }
        .custom-cursor-arrow.is-pointer svg {
          filter: drop-shadow(0 0 5px color-mix(in oklab, var(--color-accent-blue) 60%, transparent)) drop-shadow(0 1px 2px rgba(0,0,0,0.4));
        }

        .custom-cursor-arrow path {
          fill: #1a1a1a;
          stroke: #fff;
          transition: fill 0.2s ease, stroke 0.2s ease;
        }

        .custom-cursor-arrow.is-pointer path {
          fill: color-mix(in oklab, var(--color-accent-blue) 80%, black);
          stroke: var(--color-accent-blue);
        }
        
        /* Support dark mode overrides */
        [data-theme='dark'] .custom-cursor-ring-inner {
          border-color: rgba(255,255,255,0.22);
        }
        [data-theme='dark'] .custom-cursor-ring.is-pointer .custom-cursor-ring-inner {
          border-color: color-mix(in oklab, var(--color-accent-blue) 65%, transparent);
          background-color: color-mix(in oklab, var(--color-accent-blue) 10%, transparent);
        }
        [data-theme='dark'] .custom-cursor-arrow path {
          fill: #edeae4;
          stroke: #111114;
        }
        [data-theme='dark'] .custom-cursor-arrow.is-pointer path {
          fill: color-mix(in oklab, var(--color-accent-blue) 80%, black);
          stroke: var(--color-accent-blue);
        }
      `}</style>
      
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{ opacity: 0 }}
      >
        <div className="custom-cursor-ring-inner" />
      </div>

      {/* Arrow cursor */}
      <div
        ref={arrowRef}
        className="custom-cursor-arrow"
        style={{ opacity: 0 }}
      >
        <div className="custom-cursor-arrow-inner">
          <svg
            width="28"
            height="34"
            viewBox="0 0 28 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1 L1 25 L7.5 19 L13 30 L17 28 L11.5 17.5 L20 17.5 Z"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
