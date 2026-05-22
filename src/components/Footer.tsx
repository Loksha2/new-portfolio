import { motion } from 'framer-motion';
import { useSiteSettings } from './SiteSettingsContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const siteName = settings.general.name;
  const siteTitle = settings.general.title;
  const logoImage = settings.general.logoImage;

  return (
    <footer
      className="py-8 px-6 lg:px-10 border-t"
      style={{
        background: 'transparent',
        borderColor: 'var(--border-medium)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo / name */}
        <div className="flex items-center gap-2">
          {logoImage ? (
            <img src={logoImage} alt={siteName} className="w-7 h-7 rounded-lg object-cover" />
          ) : (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M17.5 2.5L21.5 6.5L8.5 19.5L3 21L4.5 15.5L17.5 2.5Z" fill="white" />
                <circle cx="4.5" cy="20" r="1.2" fill="var(--color-accent-blue)" />
              </svg>
            </div>
          )}
          <span
            className="text-[13px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {siteName}
          </span>
        </div>

        {/* Copyright */}
        <p className="text-[12px] text-center" style={{ color: 'var(--text-faint)' }}>
          © {currentYear} {siteName}. {siteTitle}. All rights reserved.
        </p>

        {/* Tagline */}
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
