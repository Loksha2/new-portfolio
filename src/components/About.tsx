import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Palette, Star } from 'lucide-react';
import { useSiteSettings } from './SiteSettingsContext';

const easeOut = [0.22, 1, 0.36, 1] as const;

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { settings } = useSiteSettings();
  const about = settings.about;

  const iconMap = [<Star size={20} />, <Layers size={20} />, <Palette size={20} />];
  const bgMap = ['rgba(79,124,255,0.08)', 'rgba(124,92,252,0.08)', 'rgba(255,107,53,0.08)'];

  return (
    <section
      id="about"
      className="section-padding pb-32 relative overflow-visible"
      style={{ background: 'transparent' }}
    >
      {/* Decorative bg */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] opacity-10 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f7cff 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="h-px w-8 bg-[#4f7cff]" />
          <span className="text-[12px] font-semibold text-[#4f7cff] tracking-[0.2em] uppercase">
            About Me
          </span>
        </motion.div>

        {/* Single grid: portrait spans full right side */}
        <div className="grid lg:grid-cols-2 gap-x-16 lg:gap-x-20 gap-y-8" style={{ gridTemplateRows: 'auto auto auto' }}>
          
          {/* Left Row 1 — text + skills */}
          <div style={{ gridColumn: '1', gridRow: '1' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
              className="text-[38px] sm:text-[44px] font-black leading-[1.1] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {about.sectionTitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
              className="text-[16px] leading-[1.8] mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              {about.bio1}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28, ease: easeOut }}
              className="text-[15px] leading-[1.8] mb-10"
              style={{ color: 'var(--text-muted)' }}
            >
              {about.bio2}
            </motion.p>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.36, ease: easeOut }}
              className="space-y-4"
            >
              {about.skills.map((skill, i) => (
                <div key={skill.label} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium w-[140px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {skill.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: easeOut }}
                      style={{
                        background: `linear-gradient(90deg, ${['#4f7cff','#7c5cfc','#ff6b35','#C8883A','#c084fc','#ff4444'][i % 6]}, ${['#7c5cfc','#c084fc','#C8883A','#ff6b35','#4f7cff','#ff6b35'][i % 6]})`,
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold w-[35px] text-right" style={{ color: 'var(--text-muted)' }}>
                    {skill.level}%
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — portrait image spanning all rows */}
          <div className="hidden lg:block" style={{ gridColumn: '2', gridRow: '1 / 4' }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
              className="rounded-2xl overflow-hidden relative h-full"
              style={{
                minHeight: '520px',
                background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={about.portraitImage}
                alt={`${about.nameOverlay} — Graphic Designer`}
                className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(0deg, rgba(26,26,26,0.85) 0%, transparent 100%)' }}
              >
                <div className="text-white font-bold text-[16px]">{about.nameOverlay}</div>
                <div className="text-white/60 text-[12px] mt-0.5">{about.locationOverlay}</div>
              </div>
            </motion.div>
          </div>

          {/* Mobile-only portrait (shows above stats on mobile) */}
          <div className="lg:hidden" style={{ gridColumn: '1' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
              className="rounded-2xl overflow-hidden relative"
              style={{
                height: '400px',
                background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              <img
                src={about.portraitImage}
                alt={`${about.nameOverlay} — Graphic Designer`}
                className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(0deg, rgba(26,26,26,0.85) 0%, transparent 100%)' }}
              >
                <div className="text-white font-bold text-[16px]">{about.nameOverlay}</div>
                <div className="text-white/60 text-[12px] mt-0.5">{about.locationOverlay}</div>
              </div>
            </motion.div>
          </div>

          {/* Left Row 2 — stat cards */}
          <div className="flex flex-col gap-4" style={{ gridColumn: '1' }}>
            {about.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: easeOut }}
                className="flex items-center gap-5 p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-md)',
                }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bgMap[i % bgMap.length], color: stat.color }}
                >
                  {iconMap[i % iconMap.length]}
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-[28px] font-black leading-none"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-[14px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Left Row 3 — quote card */}
          <div style={{ gridColumn: '1' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: easeOut }}
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{ background: 'radial-gradient(circle, #4f7cff 0%, transparent 70%)' }}
              />
              <div className="text-[28px] text-white/30 font-black leading-none mb-3">"</div>
              <p className="text-[14px] text-white/80 leading-[1.7] italic">
                {about.quote}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-px bg-[#4f7cff]" />
                <span className="text-[11px] text-white/40 font-medium tracking-wide">
                  {about.nameOverlay}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
