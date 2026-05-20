import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    name: 'General Info',
    icon: <Sparkles size={16} />,
    items: [
      {
        id: 1,
        question: 'What design and development services do you offer?',
        answer: 'I offer a full suite of visual services including branding & identity design, graphic design for social media, print & editorial design, and custom React/Next.js/Vite front-end web development with responsive layouts and advanced micro-animations.',
      },
      {
        id: 2,
        question: 'Do you work with international clients?',
        answer: 'Yes, absolutely! I work with clients globally. We coordinate through Zoom/Google Meet, utilize Slack/Discord for messaging, and use Figma and GitHub to collaborate in real-time, ensuring a smooth process regardless of time zones.',
      },
      {
        id: 3,
        question: 'What software and technologies do you use?',
        answer: 'For design, I use Figma, Adobe Illustrator, and Photoshop. For coding, I primarily use React, TypeScript, Next.js, and TailwindCSS to build fast, responsive, and SEO-friendly web applications, styled with clean vanilla CSS or custom UI modules.',
      },
      {
        id: 4,
        question: 'Can you work with my existing branding?',
        answer: 'Yes, absolutely. If you already have brand guidelines, a logo, or established colors, I can adapt to your design system and build new assets or web pages that perfectly align with your current brand identity.',
      },
    ],
  },
  {
    id: 'process',
    name: 'Process & Work',
    icon: <MessageSquare size={16} />,
    items: [
      {
        id: 5,
        question: 'How long does a typical project take?',
        answer: 'Timelines vary by complexity: Brand identity packages take 2-3 weeks. A standard landing page takes 1-2 weeks. Full custom interactive websites take 3-5 weeks. Smaller items like social media posts can be completed in 3-5 days.',
      },
      {
        id: 6,
        question: 'What is your revision policy?',
        answer: 'Every project includes 3 rounds of comprehensive revisions during the design phase. I make sure we align on wireframes and mood boards early on so that the final designs are exactly what you expect.',
      },
      {
        id: 7,
        question: 'Do I own the source files and assets?',
        answer: 'Yes, absolutely. Once final payment is made, all visual assets, design source files (Figma), and codebase files (GitHub repository) are fully transferred to you with complete ownership rights.',
      },
      {
        id: 8,
        question: 'How do we keep track of project progress?',
        answer: 'We utilize collaborative tools like Notion or Trello to track milestones, share updates, and manage project files. I also provide weekly status check-ins so you are always updated on the progress.',
      },
    ],
  },
  {
    id: 'billing',
    name: 'Payments & Support',
    icon: <ShieldCheck size={16} />,
    items: [
      {
        id: 9,
        question: 'Do you offer flexible payment plans?',
        answer: 'Yes! Typically, projects are divided into a 50% upfront deposit to secure the slot, and 50% upon final sign-off and assets delivery. For larger projects, we can split it into 3-4 milestone-based payments.',
      },
      {
        id: 10,
        question: 'What post-launch support do you provide?',
        answer: 'I offer 30 days of free post-launch support to resolve any bugs, explain cms/code management, and ensure a seamless handover. Long-term updates or monthly maintenance retainers are also available if you need ongoing help.',
      },
      {
        id: 11,
        question: 'What happens if I need changes months after delivery?',
        answer: 'For updates after the 30-day support window, you can hire me on an hourly basis, or we can set up a monthly maintenance retainer for ongoing support and enhancements.',
      },
      {
        id: 12,
        question: 'Do you provide domain and hosting setup?',
        answer: 'Yes, I can guide you through purchasing a domain name and setting up hosting (on platforms like Vercel, Netlify, or Hostinger). I make sure the site is live, secure with SSL, and ready to go.',
      },
    ],
  },
];

const AccordionItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={false}
      className="mb-4 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen
          ? 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-end) 100%)'
          : 'var(--bg-card)',
        border: isOpen ? '1px solid #4f7cff40' : '1px solid var(--border-subtle)',
        boxShadow: isOpen ? '0 10px 30px -15px rgba(79, 124, 255, 0.15)' : 'none',
      }}
    >
      <button
        onClick={onClick}
        className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 font-semibold text-[15px] sm:text-[17px] transition-colors"
        style={{ color: isOpen ? '#4f7cff' : 'var(--text-primary)' }}
        data-cursor-hover
      >
        <span className="flex items-center gap-3">
          <HelpCircle size={18} className={isOpen ? 'text-[#4f7cff]' : 'text-gray-400'} />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: isOpen ? '#4f7cff1a' : 'var(--bg-section-alt2)' }}
        >
          <ChevronDown size={16} className={isOpen ? 'text-[#4f7cff]' : 'var(--text-muted)'} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <div
              className="px-6 pb-7 md:px-7 md:pb-8 text-[14px] sm:text-[15px] leading-[1.8] font-medium border-t"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState<string>('general');
  const [openId, setOpenId] = useState<number | null>(1); // Open first item by default

  const activeCategory = faqCategories.find((cat) => cat.id === activeTab) || faqCategories[0];

  return (
    <section
      id="faq"
      className="section-padding relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Dynamic Background Glow */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] opacity-[0.03] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c5cfc 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-12 left-10 w-[400px] h-[400px] opacity-[0.03] blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f7cff 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-[#4f7cff]" />
            <span className="text-[12px] font-semibold text-[#4f7cff] tracking-[0.2em] uppercase">
              Got Questions?
            </span>
            <div className="h-px w-8 bg-[#4f7cff]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
            className="text-[38px] sm:text-[46px] font-black tracking-tight leading-[1.1] mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
            className="text-[15px] max-w-lg mx-auto font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Here are some quick answers to common questions about my design, coding process, and workflow.
          </motion.p>
        </div>

        {/* Tab Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
          className="flex justify-center flex-wrap gap-2 md:gap-3 mb-10"
        >
          {faqCategories.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  // Auto-open first item of the new active tab
                  if (category.items.length > 0) {
                    setOpenId(category.items[0].id);
                  } else {
                    setOpenId(null);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: isActive ? '#4f7cff12' : 'var(--bg-card)',
                  borderColor: isActive ? '#4f7cff' : 'var(--border-subtle)',
                  color: isActive ? '#4f7cff' : 'var(--text-secondary)',
                }}
                data-cursor-hover
              >
                {category.icon}
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeCategory.items.map((item) => (
                <AccordionItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openId === item.id}
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Direct contact footnote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
          className="mt-12 text-center p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="text-left">
            <h4 className="font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>
              Still have a question?
            </h4>
            <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              Send me a message directly and I will respond within 24 hours.
            </p>
          </div>
          <a
            href="#contact"
            className="flex items-center gap-2 text-[13px] font-bold text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md"
            style={{
              background: 'linear-gradient(90deg, #4f7cff, #7c5cfc)',
            }}
            data-cursor-hover
          >
            Ask Me Personally
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
