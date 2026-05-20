import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Palette, Star } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const stats = [
  {
    icon: <Star size={20} />,
    value: '1+',
    unit: 'Year',
    label: 'Experience',
    color: '#4f7cff',
    bg: 'rgba(79,124,255,0.08)',
  },
  {
    icon: <Layers size={20} />,
    value: '∞',
    unit: '',
    label: 'Brand Identity Design',
    color: '#7c5cfc',
    bg: 'rgba(124,92,252,0.08)',
  },
  {
    icon: <Palette size={20} />,
    value: '30+',
    unit: '',
    label: 'Social Media Posters',
    color: '#ff6b35',
    bg: 'rgba(255,107,53,0.08)',
  },
];

const skills = [
  { label: 'Brand Identity',       level: 90 },
  { label: 'Logo Design',          level: 88 },
  { label: 'Social Media Posters', level: 92 },
  { label: 'Typography',           level: 85 },
  { label: 'Color Theory',         level: 88 },
  { label: 'Visual Direction',     level: 82 },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
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

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left — text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
              className="text-[38px] sm:text-[44px] font-black leading-[1.1] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              A designer who builds
              {' '}<span className="text-gradient">memorable</span>{' '}
              visual worlds.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
              className="text-[16px] leading-[1.8] mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              I am{' '}
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Mohamad Ashraf
              </span>
              , a graphic designer with one year of hands-on experience creating brand
              identities and social media visuals. My work focuses on building clean,
              memorable, and visually consistent designs that help brands look professional
              and communicate clearly across digital platforms.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28, ease: easeOut }}
              className="text-[15px] leading-[1.8] mb-10"
              style={{ color: 'var(--text-muted)' }}
            >
              Every project I take on starts with a clear understanding of the brand's voice,
              its audience, and its goals. I then translate that understanding into visual
              systems that are both beautiful and strategically effective.
            </motion.p>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.36, ease: easeOut }}
              className="space-y-4"
            >
              {skills.map((skill, i) => (
                <div key={skill.label} className="flex items-center gap-4">
                  <span
                    className="text-[13px] font-medium w-36 flex-shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {skill.label}
                  </span>
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--bg-section-alt2)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          i % 3 === 0
                            ? 'linear-gradient(90deg, #4f7cff, #7c5cfc)'
                            : i % 3 === 1
                            ? 'linear-gradient(90deg, #7c5cfc, #ff6b35)'
                            : 'linear-gradient(90deg, #ff6b35, #4f7cff)',
                      }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: easeOut }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-medium w-8 text-right"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {skill.level}%
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — portrait + stats */}
          <div className="flex flex-col gap-5">
            {/* Portrait card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
              className="rounded-2xl overflow-hidden relative"
              style={{
                height: '220px',
                background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <img
                src="/images/about-portrait.jpg"
                alt="Mohamad Ashraf — Graphic Designer"
                className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{ background: 'linear-gradient(0deg, rgba(26,26,26,0.8) 0%, transparent 100%)' }}
              >
                <div className="text-white font-bold text-[15px]">Mohamad Ashraf</div>
                <div className="text-white/60 text-[12px]">Graphic Designer · Egypt 🇪🇬</div>
              </div>
            </motion.div>

            {/* Stat cards */}
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: easeOut }}
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
                  style={{ background: stat.bg, color: stat.color }}
                >
                  {stat.icon}
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

            {/* Quote card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55, ease: easeOut }}
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
                Good design is not just how something looks — it's how it makes people feel
                about a brand, instantly.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-px bg-[#4f7cff]" />
                <span className="text-[11px] text-white/40 font-medium tracking-wide">
                  Mohamad Ashraf
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
