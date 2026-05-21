import { motion } from 'framer-motion';
import { useSiteSettings } from './SiteSettingsContext';

const MarqueeRow = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => (
  <div className="flex overflow-hidden relative">
    <motion.div
      className="flex gap-6 items-center flex-shrink-0 whitespace-nowrap"
      animate={{ x: reverse ? ['0%', '50%'] : ['-50%', '0%'] }}
      transition={{ duration: reverse ? 30 : 25, repeat: Infinity, ease: 'linear' }}
    >
      {[...items, ...items, ...items, ...items].map((item, i) => (
        <span
          key={i}
          className={
            item === '✦'
              ? 'text-[#4f7cff] text-[10px]'
              : 'text-[13px] font-semibold tracking-wide uppercase'
          }
          style={{ color: item === '✦' ? '#4f7cff' : 'var(--text-muted)' }}
        >
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

const Marquee = () => {
  const { settings } = useSiteSettings();
  const marqueeItems = settings.general.marqueeItems;
  
  // Build items array with ✦ separators
  const items: string[] = [];
  marqueeItems.forEach((item, i) => {
    items.push(item);
    if (i < marqueeItems.length - 1) items.push('✦');
  });
  items.push('✦');

  return (
    <div
      className="py-5 border-y overflow-hidden relative"
      style={{
        borderColor: 'var(--border-medium)',
        background: 'transparent',
      }}
    >
      {/* Fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg-page) 0%, transparent 100%)', opacity: 0.8 }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg-page) 0%, transparent 100%)', opacity: 0.8 }}
      />
      <MarqueeRow items={items} />
    </div>
  );
};

export default Marquee;
