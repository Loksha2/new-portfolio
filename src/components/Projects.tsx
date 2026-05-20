import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Plus, X, Trash2, Pencil, ChevronLeft, ChevronRight, Mail, Upload, ImageIcon } from 'lucide-react';

// ─── EASY-TO-EDIT CONSTANT ────────────────────────────────────────────────────
const EMAIL_ADDRESS = "mohamedloksha2@gmail.com";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Category = 'brand' | 'social';

// ─── SHARED PROJECT INTERFACE ─────────────────────────────────────────────────
interface Project {
  id: number;
  title: string;
  category: Category;
  categoryLabel: string;
  description: string;
  brief: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  mockContent: string;
  imageSrc?: string;
  // User-created fields
  isUserProject?: boolean;
  additionalImages?: string[]; // base64 data URLs
  previewImage?: string;       // base64 data URL (main card image)
}

// ─── STATIC PROJECTS (read-only) ─────────────────────────────────────────────
const STATIC_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Minimal Coffee Brand Identity',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    description: 'A warm, artisanal identity for a specialty coffee brand blending warmth and minimalism.',
    brief: 'The client needed a premium yet approachable brand identity for their single-origin coffee shop targeting design-conscious millennials. Deliverables: Logo, color palette, packaging direction, brand guidelines.',
    tags: ['Logo', 'Packaging', 'Guidelines'],
    gradient: 'linear-gradient(135deg, #2D1B0E 0%, #6B3A1F 45%, #C8883A 80%, #F5EDD6 100%)',
    accentColor: '#C8883A',
    mockContent: 'COFFEE',
    imageSrc: '/images/project-coffee.jpg',
  },
  {
    id: 2,
    title: 'Tech Startup Logo System',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    description: 'Bold, futuristic visual language for a SaaS startup entering competitive markets.',
    brief: 'A B2B SaaS startup needed a complete visual identity to pitch to investors and launch their product. Required: logo system, color strategy, typography, and digital brand kit.',
    tags: ['Logo System', 'Typography', 'Brand Kit'],
    gradient: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a3e 40%, #4f7cff 80%, #a8c0ff 100%)',
    accentColor: '#4f7cff',
    mockContent: 'TECH',
    imageSrc: '/images/project-tech.jpg',
  },
  {
    id: 3,
    title: 'Fashion Boutique Identity',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    description: "Elegant, editorial brand identity for a luxury women's fashion boutique.",
    brief: 'A boutique fashion brand wanted to reposition from mid-market to luxury. Goal: editorial, timeless brand identity with logo, lookbook style, and brand guidelines for all touchpoints.',
    tags: ['Editorial', 'Luxury', 'Guidelines'],
    gradient: 'linear-gradient(135deg, #1a0a1e 0%, #4a1942 40%, #c084fc 80%, #fdf4ff 100%)',
    accentColor: '#c084fc',
    mockContent: 'MODE',
    imageSrc: '/images/project-fashion.jpg',
  },
  {
    id: 4,
    title: 'Real Estate Brand Kit',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    description: 'Professional, trustworthy identity for a premium real estate agency.',
    brief: 'A real estate firm expanding regionally needed a brand that signals trust and professionalism. Deliverables: full brand identity, signage system, social media templates, and business stationery.',
    tags: ['Logo', 'Signage', 'Stationery'],
    gradient: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 40%, #4a9eff 80%, #e8f4ff 100%)',
    accentColor: '#4a9eff',
    mockContent: 'REALTY',
  },
  {
    id: 5,
    title: 'Restaurant Campaign Posters',
    category: 'social',
    categoryLabel: 'Social Media',
    description: 'Vibrant, appetite-driving social campaign for a restaurant chain launch.',
    brief: 'A restaurant chain launching a seasonal menu needed a 6-post social campaign for Facebook and Instagram. Goal: create hunger through design, drive footfall with limited-time offer visuals.',
    tags: ['Facebook', 'Instagram', 'Campaign'],
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #8B1a00 40%, #FF4500 75%, #FFB347 100%)',
    accentColor: '#FF4500',
    mockContent: 'FOOD',
    imageSrc: '/images/project-social.jpg',
  },
  {
    id: 6,
    title: 'Instagram Product Launch',
    category: 'social',
    categoryLabel: 'Social Media',
    description: 'Scroll-stopping product reveal posts for a beauty brand Instagram launch.',
    brief: 'A cosmetics brand launching a new skincare line needed 8 Instagram posts for a product reveal strategy. Emphasis on luxury feel, product photography integration, and consistent visual rhythm.',
    tags: ['Instagram', 'Product', 'Luxury'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #7c5cfc 75%, #e9d5ff 100%)',
    accentColor: '#7c5cfc',
    mockContent: 'BEAUTY',
  },
  {
    id: 7,
    title: 'Gym Promotion Designs',
    category: 'social',
    categoryLabel: 'Social Media',
    description: 'High-energy social posts for a gym chain membership drive.',
    brief: 'A gym chain running a New Year membership drive needed 10 high-energy social posts for Facebook and Instagram. Required bold typography, strong CTAs, and a motivational visual tone.',
    tags: ['Facebook', 'Instagram', 'Promotion'],
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #ff6b35 70%, #ffd4c0 100%)',
    accentColor: '#ff6b35',
    mockContent: 'FIT',
  },
  {
    id: 8,
    title: 'Event Announcement Posters',
    category: 'social',
    categoryLabel: 'Social Media',
    description: 'Dynamic, elegant event posters for a music festival social campaign.',
    brief: 'A music and arts festival needed a full social media poster set (12 posts) across countdown, announcement, and reminder phases for Instagram and Facebook with consistent design language.',
    tags: ['Event', 'Instagram', 'Facebook'],
    gradient: 'linear-gradient(135deg, #000814 0%, #001d3d 35%, #003566 60%, #ffc300 100%)',
    accentColor: '#ffc300',
    mockContent: 'EVENT',
  },
];

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────────────────────
const LS_KEY = 'portfolio_user_projects';

function loadUserProjects(): Project[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function saveUserProjects(projects: Project[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(projects));
  } catch {
    // storage full — silently fail
  }
}

// ─── ACCENT COLORS FOR USER PROJECTS ─────────────────────────────────────────
const USER_ACCENT_COLORS: Record<Category, string[]> = {
  brand: ['#4f7cff', '#7c5cfc', '#C8883A', '#c084fc', '#4a9eff'],
  social: ['#ff6b35', '#FF4500', '#7c5cfc', '#ffc300', '#25d366'],
};

const USER_GRADIENTS: Record<Category, string[]> = {
  brand: [
    'linear-gradient(135deg, #0f0f1a 0%, #1a0a3e 40%, #4f7cff 80%, #a8c0ff 100%)',
    'linear-gradient(135deg, #1a0a1e 0%, #2d1b50 40%, #7c5cfc 80%, #e9d5ff 100%)',
    'linear-gradient(135deg, #2D1B0E 0%, #6B3A1F 45%, #C8883A 80%, #F5EDD6 100%)',
  ],
  social: [
    'linear-gradient(135deg, #1a0a00 0%, #8B1a00 40%, #FF4500 75%, #FFB347 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #7c5cfc 75%, #e9d5ff 100%)',
    'linear-gradient(135deg, #000814 0%, #001d3d 35%, #003566 60%, #ffc300 100%)',
  ],
};

// ─── PROJECT DETAIL MODAL ─────────────────────────────────────────────────────
interface DetailModalProps {
  project: Project;
  onClose: () => void;
}

const DetailModal = ({ project, onClose }: DetailModalProps) => {
  const [currentImg, setCurrentImg] = useState(0);
  const allImages: string[] = [];
  if (project.previewImage) allImages.push(project.previewImage);
  else if (project.imageSrc) allImages.push(project.imageSrc);
  if (project.additionalImages) allImages.push(...project.additionalImages);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isBrand = project.category === 'brand';
  const accent = project.accentColor;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #faf6f1 100%)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.35)',
          }}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(26,26,26,0.08)' }}
            data-cursor-hover
          >
            <X size={16} color="#1a1a1a" />
          </button>

          {/* Image gallery */}
          {allImages.length > 0 && (
            <div className="relative w-full overflow-hidden rounded-t-3xl" style={{ background: project.gradient }}>
              {isBrand ? (
                /* Brand: single large hero + thumbnail strip */
                <div>
                  <div className="relative" style={{ height: '340px' }}>
                    <img
                      src={allImages[currentImg]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImg(i => Math.max(0, i - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
                          data-cursor-hover
                        >
                          <ChevronLeft size={18} color="white" />
                        </button>
                        <button
                          onClick={() => setCurrentImg(i => Math.min(allImages.length - 1, i + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
                          data-cursor-hover
                        >
                          <ChevronRight size={18} color="white" />
                        </button>
                      </>
                    )}
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 p-3 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      {allImages.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImg(i)}
                          className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                          style={{ borderColor: currentImg === i ? accent : 'transparent' }}
                          data-cursor-hover
                        >
                          <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Social: poster grid */
                <div className="p-5" style={{ background: '#0f0f14' }}>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: allImages.length === 1 ? '1fr' : allImages.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
                      maxHeight: '360px',
                      overflow: 'hidden',
                    }}
                  >
                    {allImages.map((src, i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl overflow-hidden cursor-pointer"
                        style={{
                          aspectRatio: '1 / 1',
                          border: currentImg === i ? `2px solid ${accent}` : '2px solid transparent',
                        }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => setCurrentImg(i)}
                        data-cursor-hover
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No images fallback */}
          {allImages.length === 0 && (
            <div
              className="w-full rounded-t-3xl flex items-center justify-center"
              style={{ height: '220px', background: project.gradient }}
            >
              <span className="font-black text-white/10 text-[64px] tracking-[0.15em] select-none">
                {project.mockContent}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
              >
                {project.categoryLabel}
              </span>
              {project.isUserProject && (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#4f7cff]/10 text-[#4f7cff] border border-[#4f7cff]/20">
                  My Project
                </span>
              )}
            </div>

            <h2 className="text-[26px] sm:text-[32px] font-black text-[#1a1a1a] leading-tight mb-3">
              {project.title}
            </h2>
            <p className="text-[15px] text-[#5a5a5a] leading-[1.75] mb-6">
              {project.description}
            </p>

            {project.brief && !project.isUserProject && (
              <div className="p-5 rounded-2xl mb-6" style={{ background: '#f5f0e8', border: '1px solid rgba(237,232,223,0.9)' }}>
                <div className="text-[10px] font-bold text-[#8a8a8a] tracking-[0.2em] uppercase mb-2">Client Brief</div>
                <p className="text-[13px] text-[#5a5a5a] leading-[1.7]">{project.brief}</p>
              </div>
            )}

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-full"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── ADD / EDIT PROJECT MODAL ─────────────────────────────────────────────────
interface FormState {
  title: string;
  category: Category;
  description: string;
  tags: string;
  previewImage: string;
  additionalImages: string[];
}

const EMPTY_FORM: FormState = {
  title: '',
  category: 'brand',
  description: '',
  tags: '',
  previewImage: '',
  additionalImages: [],
};

interface AddEditModalProps {
  initial?: Project | null;
  onSave: (data: FormState) => void;
  onClose: () => void;
}

const AddEditModal = ({ initial, onSave, onClose }: AddEditModalProps) => {
  const [form, setForm] = useState<FormState>(() => {
    if (!initial) return EMPTY_FORM;
    return {
      title: initial.title,
      category: initial.category,
      description: initial.description,
      tags: initial.tags.join(', '),
      previewImage: initial.previewImage ?? '',
      additionalImages: initial.additionalImages ?? [],
    };
  });

  const previewInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFile(file);
    setForm(f => ({ ...f, previewImage: dataUrl }));
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(readFile));
    setForm(f => ({ ...f, additionalImages: [...f.additionalImages, ...dataUrls] }));
  };

  const removeAdditional = (idx: number) => {
    setForm(f => ({ ...f, additionalImages: f.additionalImages.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  const accent = form.category === 'brand' ? '#4f7cff' : '#7c5cfc';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        />

        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #faf6f1 100%)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.3)',
          }}
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b" style={{ borderColor: 'rgba(237,232,223,0.8)' }}>
            <div>
              <h3 className="text-[20px] font-black text-[#1a1a1a]">{initial ? 'Edit Project' : 'Add New Project'}</h3>
              <p className="text-[13px] text-[#8a8a8a] mt-0.5">Fill in the details below</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(26,26,26,0.07)' }}
              data-cursor-hover
            >
              <X size={16} color="#1a1a1a" />
            </button>
          </div>

          <div className="px-7 py-6 space-y-5">
            {/* Category */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Category</label>
              <div className="flex gap-3">
                {(['brand', 'social'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setForm(f => ({ ...f, category: cat }))}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                    style={{
                      background: form.category === cat ? '#1a1a1a' : 'transparent',
                      color: form.category === cat ? 'white' : '#6b6b6b',
                      border: form.category === cat ? '1.5px solid transparent' : '1.5px solid rgba(26,26,26,0.15)',
                    }}
                    data-cursor-hover
                  >
                    {cat === 'brand' ? 'Brand Identity' : 'Social Media Posters'}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Minimal Coffee Brand Identity"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-[14px] text-[#1a1a1a] outline-none transition-all"
                style={{
                  background: '#f9f6f1',
                  border: `1.5px solid ${form.title ? accent + '50' : 'rgba(237,232,223,0.9)'}`,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Short Description</label>
              <textarea
                rows={3}
                placeholder="What makes this project special?"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-[14px] text-[#1a1a1a] outline-none resize-none transition-all"
                style={{
                  background: '#f9f6f1',
                  border: '1.5px solid rgba(237,232,223,0.9)',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Tags <span className="normal-case font-normal text-[#8a8a8a]">(comma-separated, optional)</span></label>
              <input
                type="text"
                placeholder="Logo, Brand Kit, Typography"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-[14px] text-[#1a1a1a] outline-none transition-all"
                style={{
                  background: '#f9f6f1',
                  border: '1.5px solid rgba(237,232,223,0.9)',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            {/* Preview image */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Preview Image <span className="normal-case font-normal text-[#8a8a8a]">(main card image)</span></label>
              <input ref={previewInputRef} type="file" accept="image/*" className="hidden" onChange={handlePreviewUpload} />
              {form.previewImage ? (
                <div className="relative rounded-2xl overflow-hidden group" style={{ height: '180px' }}>
                  <img src={form.previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => previewInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                      data-cursor-hover
                    >
                      <Upload size={13} /> Change
                    </button>
                    <button
                      onClick={() => setForm(f => ({ ...f, previewImage: '' }))}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white"
                      style={{ background: 'rgba(255,80,80,0.3)', border: '1px solid rgba(255,80,80,0.4)' }}
                      data-cursor-hover
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => previewInputRef.current?.click()}
                  className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-10 transition-all"
                  style={{
                    background: '#f9f6f1',
                    border: `2px dashed rgba(237,232,223,0.9)`,
                    color: '#8a8a8a',
                  }}
                  data-cursor-hover
                >
                  <ImageIcon size={28} style={{ color: accent }} />
                  <span className="text-[13px] font-medium">Click to upload preview image</span>
                  <span className="text-[11px] text-[#b0b0b0]">PNG, JPG, WEBP</span>
                </button>
              )}
            </div>

            {/* Additional images */}
            <div>
              <label className="block text-[12px] font-semibold text-[#4a4a4a] tracking-wide uppercase mb-2">Additional Images <span className="normal-case font-normal text-[#8a8a8a]">(optional — shown in detail view)</span></label>
              <input ref={additionalInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalUpload} />

              {form.additionalImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {form.additionalImages.map((src, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: '1/1' }}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeAdditional(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        data-cursor-hover
                      >
                        <X size={11} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => additionalInputRef.current?.click()}
                className="w-full rounded-xl flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-all"
                style={{
                  background: '#f9f6f1',
                  border: '1.5px dashed rgba(237,232,223,0.9)',
                  color: '#8a8a8a',
                }}
                data-cursor-hover
              >
                <Plus size={15} style={{ color: accent }} />
                Add more images
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-7 pb-7 pt-4 border-t" style={{ borderColor: 'rgba(237,232,223,0.8)' }}>
            <button
              onClick={onClose}
              className="btn-secondary text-[14px]"
              data-cursor-hover
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSubmit}
              className="btn-primary text-[14px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ opacity: form.title.trim() ? 1 : 0.5 }}
              data-cursor-hover
            >
              {initial ? 'Save Changes' : 'Add Project'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenDetail: (p: Project) => void;
  onEdit?: (p: Project) => void;
  onDelete?: (id: number) => void;
}

const ProjectCard = ({ project, index, onOpenDetail, onEdit, onDelete }: ProjectCardProps) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const mainImage = project.previewImage ?? project.imageSrc;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easeOut }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f9f6f1 100%)',
        border: '1px solid rgba(237, 232, 223, 0.9)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -8,
        boxShadow: '0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
      }}
      data-cursor-hover
    >
      {/* Image area */}
      <div
        className="relative h-52 overflow-hidden"
        onClick={() => onOpenDetail(project)}
        style={{ cursor: 'pointer' }}
      >
        {mainImage ? (
          <motion.img
            src={mainImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              scale: hovered ? 1.06 : 1,
              filter: hovered ? 'saturate(1.2) brightness(1.05)' : 'saturate(1) brightness(1)',
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <>
            <motion.div
              className="absolute inset-0"
              style={{ background: project.gradient }}
              animate={{
                scale: hovered ? 1.06 : 1,
                filter: hovered ? 'saturate(1.3) brightness(1.05)' : 'saturate(1) brightness(1)',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="font-black text-white/10 text-[52px] tracking-[0.2em] select-none"
                animate={{ scale: hovered ? 1.1 : 1 }}
                transition={{ duration: 0.4 }}
              >
                {project.mockContent}
              </motion.div>
              <div
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: project.accentColor }} />
              </div>
            </div>
          </>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              color: project.accentColor,
              border: `1px solid ${project.accentColor}30`,
            }}
          >
            {project.categoryLabel}
          </span>
        </div>

        {/* User project badge */}
        {project.isUserProject && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#4f7cff]/80 text-white tracking-wide">
              MY PROJECT
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-5 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
              }}
            >
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                {!project.isUserProject && (
                  <>
                    <div className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase mb-1.5">
                      Client Brief
                    </div>
                    <p className="text-[12px] text-white/90 leading-[1.6] line-clamp-3">
                      {project.brief}
                    </p>
                  </>
                )}
                {project.isUserProject && (
                  <p className="text-[12px] text-white/80 leading-[1.6] line-clamp-3">
                    {project.description}
                  </p>
                )}
                <div
                  className="flex items-center gap-1 mt-2.5 text-[11px] font-semibold"
                  style={{ color: project.accentColor }}
                >
                  <span>View Details</span>
                  <ArrowUpRight size={12} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3
          className="text-[15px] font-bold text-[#1a1a1a] mb-1.5 leading-snug"
          onClick={() => onOpenDetail(project)}
          style={{ cursor: 'pointer' }}
        >
          {project.title}
        </h3>
        <p className="text-[13px] text-[#6b6b6b] leading-[1.65] mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${project.accentColor}15`,
                  color: project.accentColor,
                  border: `1px solid ${project.accentColor}25`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit / Delete for user projects */}
            {project.isUserProject && onEdit && onDelete && (
              <>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(79,124,255,0.1)', color: '#4f7cff' }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  data-cursor-hover
                  title="Edit"
                >
                  <Pencil size={11} />
                </motion.button>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,80,80,0.1)', color: '#ff5050' }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  data-cursor-hover
                  title="Delete"
                >
                  <Trash2 size={11} />
                </motion.button>
              </>
            )}
            <motion.div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ cursor: 'pointer', background: `${project.accentColor}15`, color: project.accentColor }}
              animate={{ rotate: hovered ? 0 : -45 }}
              transition={{ duration: 0.3 }}
              onClick={() => onOpenDetail(project)}
            >
              <ExternalLink size={12} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

// ─── FILTER BUTTON ─────────────────────────────────────────────────────────────
const FilterBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <motion.button
    onClick={onClick}
    className="relative px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all"
    style={{
      background: active ? '#1a1a1a' : 'transparent',
      color: active ? 'white' : '#6b6b6b',
      border: active ? '1.5px solid transparent' : '1.5px solid rgba(26,26,26,0.15)',
    }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    data-cursor-hover
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeFilter"
        className="absolute inset-0 rounded-full -z-10"
        style={{ background: '#1a1a1a' }}
        transition={{ duration: 0.3, ease: easeOut }}
      />
    )}
  </motion.button>
);

// ─── FLOATING EMAIL BUTTON ────────────────────────────────────────────────────
const FloatingEmail = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={`mailto:${EMAIL_ADDRESS}`}
          className="fixed z-[800] w-11 h-11 rounded-full flex items-center justify-center group"
          style={{
            bottom: '72px', // sits above the BackToTop button
            right: '24px',
            background: 'linear-gradient(135deg, #ea4335 0%, #d33828 100%)',
            boxShadow: '0 4px 20px rgba(234,67,53,0.35)',
            color: 'white',
          }}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: '0 6px 25px rgba(234,67,53,0.5)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Send an email"
          data-cursor-hover
          title={EMAIL_ADDRESS}
        >
          <Mail size={18} />
          {/* Tooltip */}
          <span
            className="absolute right-[52px] top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ background: '#1a1a1a' }}
          >
            {EMAIL_ADDRESS}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');
  const [userProjects, setUserProjects] = useState<Project[]>(loadUserProjects);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Persist whenever user projects change
  useEffect(() => {
    saveUserProjects(userProjects);
  }, [userProjects]);

  const allProjects = [...STATIC_PROJECTS, ...userProjects];

  const filtered =
    activeFilter === 'all'
      ? allProjects
      : allProjects.filter((p) => p.category === activeFilter);

  const handleSave = useCallback((data: FormState) => {
    const tags = data.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editProject) {
      // Editing existing user project
      setUserProjects(prev =>
        prev.map(p =>
          p.id === editProject.id
            ? {
                ...p,
                title: data.title,
                category: data.category,
                categoryLabel: data.category === 'brand' ? 'Brand Identity' : 'Social Media',
                description: data.description,
                tags,
                previewImage: data.previewImage || undefined,
                additionalImages: data.additionalImages,
              }
            : p
        )
      );
      setEditProject(null);
    } else {
      // New project
      const colorIdx = userProjects.length % USER_ACCENT_COLORS[data.category].length;
      const gradIdx = userProjects.length % USER_GRADIENTS[data.category].length;
      const newProject: Project = {
        id: Date.now(),
        title: data.title,
        category: data.category,
        categoryLabel: data.category === 'brand' ? 'Brand Identity' : 'Social Media',
        description: data.description,
        brief: '',
        tags,
        gradient: USER_GRADIENTS[data.category][gradIdx],
        accentColor: USER_ACCENT_COLORS[data.category][colorIdx],
        mockContent: data.title.substring(0, 4).toUpperCase(),
        previewImage: data.previewImage || undefined,
        additionalImages: data.additionalImages,
        isUserProject: true,
      };
      setUserProjects(prev => [...prev, newProject]);
    }
    setShowAddModal(false);
  }, [editProject, userProjects]);

  const handleDelete = useCallback((id: number) => {
    setUserProjects(prev => prev.filter(p => p.id !== id));
    if (detailProject?.id === id) setDetailProject(null);
  }, [detailProject]);

  const handleEdit = useCallback((project: Project) => {
    setEditProject(project);
    setShowAddModal(true);
  }, []);

  return (
    <>
      <section id="projects" className="section-padding relative overflow-hidden" style={{ background: 'transparent' }}>
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] opacity-[0.08] blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-[#ff6b35]" />
              <span className="text-[12px] font-semibold text-[#ff6b35] tracking-[0.2em] uppercase">My Work</span>
              <div className="h-px w-8 bg-[#ff6b35]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
              className="text-[38px] sm:text-[46px] font-black tracking-tight text-[#1a1a1a] leading-[1.1] mb-5"
            >
              Selected{' '}
              <span className="text-gradient">Projects</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
              className="text-[15px] text-[#6b6b6b] max-w-[480px] mx-auto mb-10"
            >
              Click any card to see full details. Filter by project type below.
            </motion.p>

            {/* Filter + Add button row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              className="flex items-center justify-center gap-2 flex-wrap"
            >
              <FilterBtn active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
                All Projects
              </FilterBtn>
              <FilterBtn active={activeFilter === 'brand'} onClick={() => setActiveFilter('brand')}>
                Brand Identity
              </FilterBtn>
              <FilterBtn active={activeFilter === 'social'} onClick={() => setActiveFilter('social')}>
                Social Media Posters
              </FilterBtn>

              {/* Add Project button */}
              <motion.button
                onClick={() => { setEditProject(null); setShowAddModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #4f7cff 0%, #7c5cfc 100%)',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(79,124,255,0.3)',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(79,124,255,0.45)' }}
                whileTap={{ scale: 0.97 }}
                data-cursor-hover
              >
                <Plus size={15} />
                Add Project
              </motion.button>
            </motion.div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpenDetail={setDetailProject}
                  onEdit={project.isUserProject ? handleEdit : undefined}
                  onDelete={project.isUserProject ? handleDelete : undefined}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-[48px] mb-4">🎨</div>
              <p className="text-[15px] text-[#8a8a8a]">No projects in this category yet.</p>
              <motion.button
                onClick={() => { setEditProject(null); setShowAddModal(true); }}
                className="mt-4 btn-primary inline-flex items-center gap-2 text-[14px]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                data-cursor-hover
              >
                <Plus size={15} /> Add your first project
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* Floating email icon */}
      <FloatingEmail />

      {/* Detail modal */}
      <AnimatePresence>
        {detailProject && (
          <DetailModal project={detailProject} onClose={() => setDetailProject(null)} />
        )}
      </AnimatePresence>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddEditModal
            initial={editProject}
            onSave={handleSave}
            onClose={() => { setShowAddModal(false); setEditProject(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;
