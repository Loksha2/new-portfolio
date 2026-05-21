import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, ExternalLink, Mail } from 'lucide-react';
import { SiBehance } from 'react-icons/si';
import { FaWhatsapp, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useSiteSettings } from './SiteSettingsContext';

const easeOut = [0.22, 1, 0.36, 1] as const;

interface SocialLink {
  label: string; href: string; icon: React.ReactNode;
  color: string; glow: string; bg: string;
}

const buildSocialLinks = (contactSettings: any): SocialLink[] => [
  { label: 'Behance',   href: contactSettings.socialLinks.behance,    icon: <SiBehance size={20} />,    color: '#1769ff', glow: 'rgba(23,105,255,0.35)',  bg: 'rgba(23,105,255,0.08)'  },
  { label: 'WhatsApp',  href: contactSettings.socialLinks.whatsapp,   icon: <FaWhatsapp size={20} />,   color: '#25d366', glow: 'rgba(37,211,102,0.35)', bg: 'rgba(37,211,102,0.08)' },
  { label: 'Instagram', href: contactSettings.socialLinks.instagram,  icon: <FaInstagram size={20} />,  color: '#e1306c', glow: 'rgba(225,48,108,0.35)', bg: 'rgba(225,48,108,0.08)' },
  { label: 'LinkedIn',  href: contactSettings.socialLinks.linkedin,   icon: <FaLinkedinIn size={20} />, color: '#0a66c2', glow: 'rgba(10,102,194,0.35)',  bg: 'rgba(10,102,194,0.08)'  },
  { label: 'Gmail',     href: `mailto:${contactSettings.email}`,      icon: <Mail size={20} />,         color: '#ea4335', glow: 'rgba(234,67,53,0.35)',  bg: 'rgba(234,67,53,0.08)'  },
];

const SocialIcon = ({ link }: { link: SocialLink }) => (
  <motion.a
    href={link.href}
    target={link.href.startsWith('mailto') ? '_self' : '_blank'}
    rel="noopener noreferrer"
    aria-label={link.label}
    className="group relative w-12 h-12 rounded-xl flex items-center justify-center"
    style={{ background: link.bg, border: `1px solid ${link.color}25`, color: link.color }}
    whileHover={{ scale: 1.18, rotate: 8, boxShadow: `0 0 20px ${link.glow}, 0 4px 16px ${link.glow}`, y: -4 }}
    whileTap={{ scale: 0.94 }}
    transition={{ duration: 0.25, ease: easeOut }}
    data-cursor-hover
  >
    {link.icon}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/80 bg-[#1a1a1a] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {link.label}
    </span>
  </motion.a>
);

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { settings } = useSiteSettings();
  const contact = settings.contact;
  const socialLinks = buildSocialLinks(contact);

  return (
    <section id="contact" className="section-padding relative overflow-hidden" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.05] blur-[100px]"
          style={{ background: 'radial-gradient(ellipse, var(--color-accent-blue) 0%, var(--color-accent-purple) 50%, transparent 100%)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: easeOut }}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #252525 50%, #1a1a2e 100%)', boxShadow: '0 30px 80px rgba(0,0,0,0.25)' }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 opacity-15 blur-[80px]" style={{ background: 'radial-gradient(circle, var(--color-accent-blue) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 opacity-10 blur-[60px]" style={{ background: 'radial-gradient(circle, var(--color-accent-purple) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 px-8 py-14 md:px-14 md:py-16 text-center">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15, ease: easeOut }} className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-8 bg-[var(--color-accent-blue)]" />
              <span className="text-[11px] font-semibold text-[var(--color-accent-blue)] tracking-[0.25em] uppercase">Let's Work Together</span>
              <div className="h-px w-8 bg-[var(--color-accent-blue)]" />
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 25 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
              className="text-[32px] sm:text-[42px] md:text-[50px] font-black text-white leading-[1.1] tracking-tight mb-5">
              {contact.heading}
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              className="text-[15px] text-white/50 max-w-[480px] mx-auto leading-relaxed mb-10">
              {contact.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
              className="flex flex-wrap gap-3 justify-center mb-12">
              <motion.a href={contact.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-[14px] text-white"
                style={{ background: 'linear-gradient(135deg, #25d366, #1da851)', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} data-cursor-hover>
                <MessageCircle size={17} /> WhatsApp Me
              </motion.a>
              <motion.a href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-[14px] text-white"
                style={{ background: 'linear-gradient(135deg, #ea4335, #d33828)', boxShadow: '0 4px 20px rgba(234,67,53,0.35)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} data-cursor-hover>
                <Mail size={17} /> Email Me
              </motion.a>
              <motion.a href={contact.socialLinks.behance} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-[14px]"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(10px)' }}
                whileHover={{ background: 'rgba(255,255,255,0.12)', scale: 1.05 }} whileTap={{ scale: 0.97 }} data-cursor-hover>
                <ExternalLink size={16} /> View Behance
              </motion.a>
            </motion.div>

            <div className="w-full h-px mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

            <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5, ease: easeOut }}
              className="flex items-center justify-center gap-3 flex-wrap">
              {socialLinks.map((link) => <SocialIcon key={link.label} link={link} />)}
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.7, ease: easeOut }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10">
          {contact.statusItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i === 0 && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
              <span className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>{item}</span>
              {i < contact.statusItems.length - 1 && (
                <div className="w-1 h-1 rounded-full ml-4" style={{ background: 'var(--border-subtle)' }} />
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
