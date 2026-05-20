import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
  once?: boolean;
}

const directionMap = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  fade: { x: 0, y: 0 },
};

const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
