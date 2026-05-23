import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// ─── TypeScript Interfaces ───────────────────────────────────────────────────

interface GeneralSettings {
  name: string;
  title: string;
  logoImage: string;
  marqueeItems: string[];
}

interface HeroStat {
  value: string;
  label: string;
  color: string;
}

interface HeroSettings {
  availabilityText: string;
  headline: string;
  name: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  profileImage: string;
  stats: HeroStat[];
  floatingPills: string[];
}

interface AboutStat {
  value: string;
  unit: string;
  label: string;
  color: string;
}

interface AboutSkill {
  label: string;
  level: number;
}

interface AboutSettings {
  sectionTitle: string;
  bio1: string;
  bio2: string;
  portraitImage: string;
  nameOverlay: string;
  locationOverlay: string;
  quote: string;
  stats: AboutStat[];
  skills: AboutSkill[];
}

interface ServiceItem {
  title: string;
  tagline: string;
  description: string;
  features: string[];
}

interface ServicesSettings {
  sectionTitle: string;
  sectionSubtitle: string;
  items: ServiceItem[];
}

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  popular: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
}

interface PricingSettings {
  sectionTitle: string;
  sectionSubtitle: string;
  tiers: PricingTier[];
}

interface FaqSettings {
  sectionTitle: string;
  categories: any[];
}

interface ContactSocialLinks {
  behance: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
}

interface ContactSettings {
  heading: string;
  description: string;
  email: string;
  socialLinks: ContactSocialLinks;
  statusItems: string[];
}

export interface InstagramHighlight {
  label: string;
  img: string;
}

export interface InstagramSettings {
  profileImage?: string;
  username?: string;
  profileName?: string;
  bioTitle: string;
  bioDescription: string;
  followersCount: string;
  followingCount: string;
  highlights: InstagramHighlight[];
}

export interface SiteSettings {
  general: GeneralSettings;
  hero: HeroSettings;
  about: AboutSettings;
  services: ServicesSettings;
  pricing: PricingSettings;
  faq: FaqSettings;
  contact: ContactSettings;
  instagram: InstagramSettings;
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSection: (section: string, content: any) => Promise<void>;
  loading: boolean;
}

// ─── Default Values ──────────────────────────────────────────────────────────

const defaultGeneral: GeneralSettings = {
  name: "Mohamad Ashraf",
  title: "Graphic Designer",
  logoImage: "",
  marqueeItems: [
    "Brand Identity",
    "Logo Design",
    "Social Media Posters",
    "Color Palette",
    "Typography",
    "Visual Direction",
    "Instagram Posts",
    "Facebook Campaigns",
    "Brand Guidelines"
  ]
};

const defaultHero: HeroSettings = {
  availabilityText: "Available for new projects",
  headline: "Designing visual [identities] that make brands *impossible* to ignore.",
  name: "Mohamad Ashraf",
  description:
    "a graphic designer specializing in brand identity systems and scroll-stopping social media posters for Facebook, Instagram, and digital campaigns.",
  ctaPrimary: "View My Work",
  ctaSecondary: "See Pricing",
  profileImage: "",
  stats: [
    { value: "1+", label: "Year Experience", color: "#b72120" },
    { value: "30+", label: "Projects Delivered", color: "#8c1615" },
    { value: "100%", label: "Client Satisfaction", color: "#3e525a" }
  ],
  floatingPills: ["Logo Design", "Brand Identity", "Social Media", "Typography"]
};

const defaultAbout: AboutSettings = {
  sectionTitle: "A designer who builds memorable visual worlds.",
  bio1:
    "I am Mohamad Ashraf, a graphic designer with one year of hands-on experience creating brand identities and social media visuals. My work focuses on building clean, memorable, and visually consistent designs that help brands look professional and communicate clearly across digital platforms.",
  bio2:
    "Every project I take on starts with a clear understanding of the brand's voice, its audience, and its goals. I then translate that understanding into visual systems that are both beautiful and strategically effective.",
  portraitImage: "/images/about-portrait.jpg",
  nameOverlay: "Mohamad Ashraf",
  locationOverlay: "Graphic Designer · Egypt 🇪🇬",
  quote:
    "Good design is not just how something looks — it is how something feels, communicates, and endures in the mind of the viewer.",
  stats: [
    { value: "1+", unit: "Year", label: "Experience", color: "#b72120" },
    { value: "∞", unit: "", label: "Brand Identity Design", color: "#8c1615" },
    { value: "30+", unit: "", label: "Social Media Posters", color: "#3e525a" }
  ],
  skills: [
    { label: "Brand Identity", level: 90 },
    { label: "Logo Design", level: 88 },
    { label: "Social Media Posters", level: 92 },
    { label: "Typography", level: 85 },
    { label: "Color Theory", level: 88 },
    { label: "Visual Direction", level: 82 }
  ]
};

const defaultServices: ServicesSettings = {
  sectionTitle: "Services built for visual impact",
  sectionSubtitle:
    "Every service is focused on making your brand feel premium, polished, and unmistakably yours.",
  items: [
    {
      title: "Brand Identity Design",
      tagline: "The complete visual foundation.",
      description:
        "A comprehensive identity system that gives your brand a unified, professional, and memorable presence across every touchpoint.",
      features: [
        "Logo System",
        "Color Palette",
        "Typography",
        "Brand Guidelines",
        "Stationery Design"
      ]
    },
    {
      title: "Social Media Posters",
      tagline: "Scroll-stopping visuals.",
      description:
        "Eye-catching, on-brand poster designs optimized for Facebook, Instagram, and digital marketing campaigns.",
      features: [
        "Instagram Posts",
        "Facebook Campaigns",
        "Story Designs",
        "Carousel Posts",
        "Ad Creatives"
      ]
    },
    {
      title: "Visual Direction",
      tagline: "Strategic creative vision.",
      description:
        "End-to-end creative direction that ensures every visual element aligns with your brand strategy and resonates with your audience.",
      features: [
        "Mood Boards",
        "Style Guides",
        "Photo Direction",
        "Layout Systems",
        "Content Strategy"
      ]
    }
  ]
};

const defaultPricing: PricingSettings = {
  sectionTitle: "Transparent pricing",
  sectionSubtitle:
    "No hidden fees. No surprises. Every package is scoped clearly so you know exactly what you're getting.",
  tiers: [
    {
      name: "Starter",
      tagline: "Perfect for a quick, focused project.",
      price: "$120",
      priceNote: "one-time",
      popular: false,
      features: [
        "1 Logo Concept (2 Revisions)",
        "Basic Color Palette",
        "1 Social Media Template",
        "PNG + SVG Delivery",
        "48h Response Time",
        "1 Week Delivery"
      ],
      cta: "Get Started",
      ctaHref: "https://wa.me/201202638313"
    },
    {
      name: "Brand Identity",
      tagline: "The full visual foundation your brand needs.",
      price: "$320",
      priceNote: "one-time",
      popular: true,
      features: [
        "3 Logo Concepts (Unlimited Revisions)",
        "Full Color System",
        "Typography System",
        "Brand Guidelines PDF",
        "Stationery Design",
        "Social Media Kit",
        "All Source Files",
        "Priority Support"
      ],
      cta: "Most Popular",
      ctaHref: "https://wa.me/201202638313"
    },
    {
      name: "Social Media",
      tagline: "Consistent, on-brand content every month.",
      price: "$180",
      priceNote: "/month",
      popular: false,
      features: [
        "12 Custom Posts/Month",
        "Story Templates",
        "Carousel Designs",
        "Ad Creatives",
        "Content Calendar",
        "2 Revisions Per Post"
      ],
      cta: "Subscribe",
      ctaHref: "https://wa.me/201202638313"
    }
  ]
};

const defaultFaq: FaqSettings = {
  sectionTitle: "Frequently Asked Questions",
  categories: []
};

const defaultContact: ContactSettings = {
  heading: "Let's create a visual identity your audience remembers.",
  description:
    "Available for brand identity projects, social media poster designs, and full visual direction. Let's bring your brand vision to life.",
  email: "mohamedloksha2@gmail.com",
  socialLinks: {
    behance: "https://behance.net/mohamedashraf5055",
    whatsapp: "https://wa.me/201202638313",
    instagram: "https://instagram.com/mohamedashraf_26/",
    linkedin: "https://linkedin.com/in/mo7amed-ashraf/"
  },
  statusItems: [
    "Available for new projects",
    "Response within 24 hours",
    "Based in Egypt 🇪🇬"
  ]
};

const defaultInstagram: InstagramSettings = {
  profileImage: "",
  username: "mohamedashraf_26",
  profileName: "Mohamad Ashraf",
  bioTitle: "Graphic Designer | Brand Identity & Social Media 🎨",
  bioDescription: "Designs that capture attention and leave a unique footprint. Let's work together! 🔥",
  followersCount: "12.5K",
  followingCount: "480",
  highlights: [
    { label: "Branding", img: "/images/social_tech_post.png" },
    { label: "Feed 📱", img: "/images/social_fashion_post.png" },
    { label: "Campaigns", img: "/images/social_coffee_post.png" },
    { label: "Concepts", img: "/images/social_sport_post.png" }
  ]
};

const defaultSettings: SiteSettings = {
  general: defaultGeneral,
  hero: defaultHero,
  about: defaultAbout,
  services: defaultServices,
  pricing: defaultPricing,
  faq: defaultFaq,
  contact: defaultContact,
  instagram: defaultInstagram
};

// ─── Context ─────────────────────────────────────────────────────────────────

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: defaultSettings,
  updateSection: async () => {},
  loading: true
});

// ─── Deep merge helper ───────────────────────────────────────────────────────

function deepMerge<T extends Record<string, any>>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults };
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const val = overrides[key];
    if (
      val !== null &&
      val !== undefined &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key])
    ) {
      result[key] = deepMerge(
        defaults[key] as Record<string, any>,
        val as Record<string, any>
      ) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // جلب الإعدادات من قاعدة البيانات عند تحميل التطبيق
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('section, content');

        if (error) {
          console.error('Error fetching site settings:', error);
          return;
        }

        if (data && data.length > 0) {
          const merged = { ...defaultSettings };

          for (const row of data) {
            const section = row.section as keyof SiteSettings;
            if (section in defaultSettings) {
              merged[section] = deepMerge(
                defaultSettings[section] as Record<string, any>,
                (row.content || {}) as Record<string, any>
              ) as any;
            }
          }

          setSettings(merged);
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // تحديث قسم معين في الإعدادات
  const updateSection = useCallback(async (section: string, content: any): Promise<void> => {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { section, content },
        { onConflict: 'section' }
      );

    if (error) {
      console.error(`Error updating section "${section}":`, error);
      throw error;
    }

    // تحديث الحالة المحلية
    setSettings((prev) => ({
      ...prev,
      [section]: section in defaultSettings
        ? deepMerge(
            defaultSettings[section as keyof SiteSettings] as Record<string, any>,
            content as Record<string, any>
          )
        : content
    }));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSection, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useSiteSettings = (): SiteSettingsContextValue => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
