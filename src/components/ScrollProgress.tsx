import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const spring = useSpring(0, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const pct = total > 0 ? (current / total) * 100 : 0;
      setProgress(pct);
      spring.set(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [spring]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1000] h-[3px]"
      style={{ background: 'var(--border-subtle)' }}
    >
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--color-accent-blue) 0%, var(--color-accent-purple) 50%, var(--color-accent-warm) 100%)',
          boxShadow: '0 0 8px var(--color-accent-purple)',
        }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
};

export default ScrollProgress;
