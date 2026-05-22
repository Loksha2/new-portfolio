import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings } from './SiteSettingsContext';

const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const { settings } = useSiteSettings();

  useEffect(() => {
    // Check if already shown in this session
    const seen = sessionStorage.getItem('splash_seen');
    if (seen) {
      setPhase('out');
      onDone();
      return;
    }

    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 1800);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('splash_seen', '1');
      onDone();
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: '#0f0f14' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Animated pen nib logo */}
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="16" fill="url(#splashGrad)" />
                 <path
                  d="M38 12 L46 20 L26 40 L14 44 L18 32 Z"
                  fill="white"
                />
                <circle cx="15" cy="43" r="3" fill="var(--color-accent-blue)" />
                <defs>
                  <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#2d2d2d" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-white font-black text-[22px] tracking-tight">
                {settings.general.name}
              </span>
              <span
                className="text-[13px] font-medium tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {settings.general.title}
              </span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-32 h-[2px] rounded-full overflow-hidden mt-2"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-purple), var(--color-accent-warm))' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;
