import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useSiteSettings } from './SiteSettingsContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { settings } = useSiteSettings();
  const logoImage = settings.general.logoImage;
  const siteName = settings.general.name;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 400);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[900] transition-all duration-500"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled ? 'var(--navbar-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled
            ? '1px solid var(--navbar-border)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            {logoImage ? (
              <img src={logoImage} alt={siteName} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.5 2.5L21.5 6.5L8.5 19.5L3 21L4.5 15.5L17.5 2.5Z"
                    fill="white"
                    strokeWidth="0"
                  />
                  <circle cx="4.5" cy="20" r="1.2" fill="var(--color-accent-blue)" />
                </svg>
              </div>
            )}
            <span
              className="font-bold text-[15px] tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {siteName}
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors relative group"
                style={{ color: 'var(--text-muted)' }}
                whileHover={{ scale: 1.02 }}
              >
                {link.label}
                <span
                  className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)]
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
                />
              </motion.a>
            ))}
          </nav>

          {/* Right side: theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode toggle */}
            <motion.button
              onClick={handleToggle}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${spinning ? 'theme-toggle-spin' : ''}`}
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.06)',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(26,26,26,0.1)',
                color: isDark ? '#fbbf24' : '#6b6b6b',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
              data-cursor-hover
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.a
              href="#projects"
              onClick={(e) => { e.preventDefault(); handleNavClick('#projects'); }}
              className="btn-primary text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Projects
            </motion.a>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={handleToggle}
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,26,0.06)',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--border-subtle)',
                color: isDark ? '#fbbf24' : '#6b6b6b',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
              data-cursor-hover
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{
                border: '1px solid var(--border-subtle)',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                color: 'var(--text-primary)',
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[800] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-[70px] left-4 right-4 rounded-2xl p-6"
              style={{
                background: isDark ? 'rgba(20,20,26,0.97)' : 'rgba(250, 248, 244, 0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
              }}
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors"
                    style={{
                      color: 'var(--text-primary)',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); handleNavClick('#projects'); }}
                className="btn-primary w-full text-center block"
              >
                View Projects
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
