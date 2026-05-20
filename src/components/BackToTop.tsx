import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[800] w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            color: 'white',
          }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: '0 6px 25px rgba(79,124,255,0.35)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
          data-cursor-hover
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
