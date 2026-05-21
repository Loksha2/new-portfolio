import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Lightbulb, Paintbrush, RefreshCw, Send } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: '01',
    icon: <Search size={22} />,
    title: 'Discover',
    description: 'Deep dive into your brand, audience, competitors, and goals. Understanding the "why" before touching any design tool.',
    color: 'var(--color-accent-blue)',
  },
  {
    number: '02',
    icon: <Lightbulb size={22} />,
    title: 'Concept',
    description: 'Translate insights into creative directions. Mood boards, visual references, and initial concept sketches.',
    color: 'var(--color-accent-purple)',
  },
  {
    number: '03',
    icon: <Paintbrush size={22} />,
    title: 'Design',
    description: 'Craft pixel-perfect visuals with intention — every color, font, and shape serves the brand strategy.',
    color: 'var(--color-accent-warm)',
  },
  {
    number: '04',
    icon: <RefreshCw size={22} />,
    title: 'Refine',
    description: 'Collaborative feedback rounds. Iterate until the design is exactly right — not just good enough.',
    color: 'var(--color-accent-blue)',
  },
  {
    number: '05',
    icon: <Send size={22} />,
    title: 'Deliver',
    description: 'Final files in all formats, brand guidelines, and ongoing support. Your brand is ready to launch.',
    color: 'var(--color-accent-purple)',
  },
];

const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="process"
      className="section-padding relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-[0.04] blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--color-accent-purple) 0%, var(--color-accent-blue) 50%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-accent-blue" />
            <span className="text-[12px] font-semibold text-accent-blue tracking-[0.2em] uppercase">
              How I Work
            </span>
            <div className="h-px w-8 bg-accent-blue" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="text-[38px] sm:text-[46px] font-black tracking-tight leading-[1.1] mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            A process built for{' '}
            <span className="text-gradient">great outcomes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            className="text-[15px] max-w-[460px] mx-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            Every project follows a clear, collaborative process designed to deliver
            exceptional results — on time, every time.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <motion.div
            className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px z-0"
            style={{ background: 'linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent)' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: easeOut }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: easeOut }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon box */}
                <motion.div
                  className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center mb-5 relative"
                  style={{
                    background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-md)',
                    color: step.color,
                  }}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: `0 8px 30px color-mix(in oklab, ${step.color} 18%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${step.color} 30%, transparent)`,
                  }}
                >
                  {step.icon}
                  <div
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: step.color, fontSize: '9px', fontWeight: 700, color: 'white' }}
                  >
                    {i + 1}
                  </div>
                </motion.div>

                <div
                  className="text-[11px] font-semibold tracking-widest uppercase mb-1.5"
                  style={{ color: step.color }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-[17px] font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.7] max-w-[180px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom timeline card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: easeOut }}
          className="mt-16 rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-10 blur-[60px]"
            style={{ background: 'radial-gradient(circle, var(--color-accent-blue) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 opacity-10 blur-[40px]"
            style={{ background: 'radial-gradient(circle, var(--color-accent-purple) 0%, transparent 70%)' }}
          />
          <div className="relative z-10">
            <div className="text-[12px] font-semibold text-white/40 tracking-[0.2em] uppercase mb-3">
              Typical Timeline
            </div>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
              {[
                { label: 'Brand Identity',      time: '5–10 days' },
                { label: 'Social Media Set',    time: '2–4 days' },
                { label: 'Full Visual Direction', time: '10–14 days' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className="text-[22px] font-black text-white leading-none mb-1">{item.time}</span>
                  <span className="text-[12px] text-white/50">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
