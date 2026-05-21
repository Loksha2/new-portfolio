import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';

interface ColorPalette {
  id: string;
  nameAr: string;
  nameEn: string;
  blue: string;
  purple: string;
  warm: string;
  blueGlow: string;
  purpleGlow: string;
  warmGlow: string;
}

const PALETTES: ColorPalette[] = [
  {
    id: 'default',
    nameAr: 'الهوية الافتراضية',
    nameEn: 'Default Premium',
    blue: '#4f7cff',
    purple: '#7c5cfc',
    warm: '#ff6b35',
    blueGlow: 'rgba(79,124,255,0.3)',
    purpleGlow: 'rgba(124,92,252,0.3)',
    warmGlow: 'rgba(255,107,53,0.3)'
  },
  {
    id: 'cyberpunk',
    nameAr: 'نيون سايبربانك',
    nameEn: 'Cyberpunk Neon',
    blue: '#00f0ff',
    purple: '#ff007f',
    warm: '#ad00ff',
    blueGlow: 'rgba(0,240,255,0.4)',
    purpleGlow: 'rgba(255,0,127,0.4)',
    warmGlow: 'rgba(173,0,255,0.4)'
  },
  {
    id: 'aurora',
    nameAr: 'أورورا الزمردي',
    nameEn: 'Emerald Aurora',
    blue: '#059669',
    purple: '#10b981',
    warm: '#f59e0b',
    blueGlow: 'rgba(5,150,105,0.3)',
    purpleGlow: 'rgba(16,185,129,0.3)',
    warmGlow: 'rgba(245,158,11,0.3)'
  },
  {
    id: 'earthy',
    nameAr: 'ترابي دافئ',
    nameEn: 'Warm Earthy',
    blue: '#a78bfa',
    purple: '#c084fc',
    warm: '#c8883a',
    blueGlow: 'rgba(167,139,250,0.3)',
    purpleGlow: 'rgba(192,132,252,0.3)',
    warmGlow: 'rgba(200,136,58,0.3)'
  },
  {
    id: 'sunset',
    nameAr: 'شروق الشمس الكوني',
    nameEn: 'Cosmic Sunset',
    blue: '#ff0055',
    purple: '#ff5500',
    warm: '#ffcc00',
    blueGlow: 'rgba(255,0,85,0.3)',
    purpleGlow: 'rgba(255,85,0,0.3)',
    warmGlow: 'rgba(255,204,0,0.3)'
  }
];

export default function BrandPaletteSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePalette, setActivePalette] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('selected-brand-palette');
    if (saved) {
      const palette = PALETTES.find(p => p.id === saved);
      if (palette) {
        applyPalette(palette);
      }
    }
  }, []);

  const applyPalette = (palette: ColorPalette) => {
    setActivePalette(palette.id);
    localStorage.setItem('selected-brand-palette', palette.id);

    // Apply values to HTML document
    document.documentElement.style.setProperty('--color-accent-blue', palette.blue);
    document.documentElement.style.setProperty('--color-accent-purple', palette.purple);
    document.documentElement.style.setProperty('--color-accent-warm', palette.warm);
    document.documentElement.style.setProperty('--color-accent-blue-glow', palette.blueGlow);
    document.documentElement.style.setProperty('--color-accent-purple-glow', palette.purpleGlow);
    document.documentElement.style.setProperty('--color-accent-warm-glow', palette.warmGlow);
  };

  return (
    <div className="fixed right-6 bottom-24 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-72 rounded-2xl border border-white/10 bg-black/85 p-4 shadow-2xl backdrop-blur-md text-right"
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Palette size={16} className="text-accent-blue" />
                مغيّر الألوان التفاعلي
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              اختر ألوان الهوية البصرية للموقع بالكامل لتجربتها مباشرة:
            </p>

            <div className="flex flex-col gap-2">
              {PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => applyPalette(palette)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border text-xs text-right ${
                    activePalette === palette.id
                      ? 'border-white/20 bg-white/5 text-white'
                      : 'border-transparent hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {activePalette === palette.id && <Check size={12} className="text-emerald-400" />}
                    <span className="font-semibold">{palette.nameAr}</span>
                  </div>
                  
                  {/* Colors Swatch */}
                  <div className="flex items-center gap-1">
                    <span 
                      className="w-3 h-3 rounded-full border border-white/10" 
                      style={{ backgroundColor: palette.blue }}
                    />
                    <span 
                      className="w-3 h-3 rounded-full border border-white/10" 
                      style={{ backgroundColor: palette.purple }}
                    />
                    <span 
                      className="w-3 h-3 rounded-full border border-white/10" 
                      style={{ backgroundColor: palette.warm }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-md border border-white/10 transition-all cursor-pointer bg-black/60 hover:bg-black/80"
        style={{
          boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
        title="تغيير ألوان الهوية"
      >
        <Palette size={20} className="animate-pulse" style={{ color: 'var(--color-accent-blue)' }} />
      </motion.button>
    </div>
  );
}
