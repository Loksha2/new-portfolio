import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus, Trash2, Pencil, LogOut,
  Layers, Image as ImageIcon, LayoutDashboard,
  X, Lock, Eye, Loader2, CheckCircle2,
  FolderOpen, Crosshair, User, Briefcase,
  DollarSign, HelpCircle, Phone, Settings,
  Upload, GripVertical
} from 'lucide-react';

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import { supabase } from '../supabaseClient'; // الربط مع الكلاينت الجديد
import { useSiteSettings } from './SiteSettingsContext';

const ADMIN_PASSWORD = "admin123";
const BUCKET_NAME = 'portfolio-images'; // اسم الـ Bucket في Supabase Storage

interface Project {
  id: number;
  title: string;
  category: 'brand' | 'social';
  categoryLabel: string;
  description: string;
  brief: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  mockContent: string;
  previewImage?: string;
  additionalImages?: string[];
  isUserProject?: boolean;
}

const mapFromDb = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title || '',
    category: dbProject.category || 'brand',
    categoryLabel: dbProject.categorylabel || dbProject.categoryLabel || '',
    description: dbProject.description || '',
    brief: dbProject.brief || '',
    tags: dbProject.tags || [],
    gradient: dbProject.gradient || '',
    accentColor: dbProject.accentcolor || dbProject.accentColor || '',
    mockContent: dbProject.mockcontent || dbProject.mockContent || '',
    previewImage: dbProject.previewimage || dbProject.previewImage || '',
    additionalImages: dbProject.additionalimages || dbProject.additionalImages || [],
    isUserProject: dbProject.isuserproject !== undefined ? dbProject.isuserproject : dbProject.isUserProject
  };
};

const mapToDb = (project: any): any => {
  return {
    title: project.title,
    category: project.category,
    categorylabel: project.categoryLabel,
    description: project.description,
    brief: project.brief,
    tags: project.tags,
    gradient: project.gradient,
    accentcolor: project.accentColor,
    mockcontent: project.mockContent,
    previewimage: project.previewImage,
    additionalimages: project.additionalImages,
    isuserproject: project.isUserProject
  };
};

const USER_ACCENT_COLORS = {
  brand: ['#4f7cff', '#7c5cfc', '#C8883A', '#c084fc', '#4a9eff'],
  social: ['#ff6b35', '#FF4500', '#7c5cfc', '#ffc300', '#25d366'],
};

const USER_GRADIENTS = {
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

// ─── Reusable style constants ────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 16px',
  background: '#111114',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
  outline: 'none',
  fontSize: '14px',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical' as const,
  minHeight: '80px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: '#9ca3af',
  marginBottom: '8px',
};

const cardStyle: React.CSSProperties = {
  background: '#1c1c22',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '16px',
  padding: '24px',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const dangerBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: 'rgba(239,68,68,0.1)',
  color: '#f87171',
  border: 'none',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.05)',
  color: '#d1d5db',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 900,
  color: '#fff',
  marginBottom: '4px',
};

const sectionDescStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#6b7280',
  marginBottom: '24px',
};

// ─── Tab types ───────────────────────────────────────────────────────────────

type TabId = 'dashboard' | 'projects' | 'instagram' | 'hero' | 'about' | 'services' | 'pricing' | 'faq' | 'contact' | 'general';

interface SidebarTab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const sidebarTabs: SidebarTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={18} /> },
  { id: 'instagram', label: 'Instagram Simulator', icon: <InstagramIcon size={18} /> },
  { id: 'hero', label: 'Hero Section', icon: <Crosshair size={18} /> },
  { id: 'about', label: 'About Me', icon: <User size={18} /> },
  { id: 'services', label: 'Services', icon: <Briefcase size={18} /> },
  { id: 'pricing', label: 'Pricing', icon: <DollarSign size={18} /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
  { id: 'contact', label: 'Contact', icon: <Phone size={18} /> },
  { id: 'general', label: 'General Settings', icon: <Settings size={18} /> },
];

// ─── Upload helper (reused by section editors) ──────────────────────────────

const uploadToStorage = async (file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
};

// ─── Image Upload Button Component ──────────────────────────────────────────

function ImageUploadButton({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSuccess(false);
    const url = await uploadToStorage(file);
    if (url) {
      onChange(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('فشل رفع الملف لـ Supabase Storage!');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
      {uploading ? (
        <div style={{ width: '100%', border: '2px dashed rgba(79,124,255,0.4)', borderRadius: '16px', padding: '32px 0', background: '#111114', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#4f7cff' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f7cff' }}>جاري رفع الملف... 🚀</span>
        </div>
      ) : value ? (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '140px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {success && (
            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(34,197,94,0.9)', color: '#fff', borderRadius: '999px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700 }}>
              <CheckCircle2 size={12} /> تم الرفع
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '6px' }}>
            <button type="button" onClick={() => inputRef.current?.click()} style={{ ...secondaryBtnStyle, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: '11px' }}>تغيير</button>
            <button type="button" onClick={() => onChange('')} style={{ ...dangerBtnStyle, fontSize: '11px', padding: '4px 10px' }}>حذف</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} style={{ width: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px 0', background: '#111114', color: '#6b7280', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Upload size={16} /> اضغط لرفع الصورة
        </button>
      )}
    </div>
  );
}

// ─── Save feedback button ───────────────────────────────────────────────────

function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      style={{
        ...primaryBtnStyle,
        opacity: saving ? 0.7 : 1,
        minWidth: '160px',
        justifyContent: 'center',
      }}
    >
      {saving ? (
        <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> جاري الحفظ...</>
      ) : saved ? (
        <><CheckCircle2 size={16} /> تم الحفظ بنجاح</>
      ) : (
        'حفظ التغييرات'
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function HeroEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [availabilityText, setAvailabilityText] = useState('');
  const [headline, setHeadline] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ctaPrimary, setCtaPrimary] = useState('');
  const [ctaSecondary, setCtaSecondary] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [stats, setStats] = useState<{ value: string; label: string; color: string }[]>([]);
  const [floatingPills, setFloatingPills] = useState<string[]>([]);

  useEffect(() => {
    const h = settings.hero;
    setAvailabilityText(h.availabilityText || '');
    setHeadline(h.headline || '');
    setName(h.name || '');
    setDescription(h.description || '');
    setCtaPrimary(h.ctaPrimary || '');
    setCtaSecondary(h.ctaSecondary || '');
    setProfileImage(h.profileImage || '');
    setStats(h.stats?.map(s => ({ ...s })) || []);
    setFloatingPills([...(h.floatingPills || [])]);
  }, [settings.hero]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('hero', { availabilityText, headline, name, description, ctaPrimary, ctaSecondary, profileImage, stats, floatingPills });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Hero Section</h2>
      <p style={sectionDescStyle}>تعديل محتوى القسم الرئيسي في الصفحة الأولى</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Availability Text</label>
              <input style={inputStyle} value={availabilityText} onChange={e => setAvailabilityText(e.target.value)} placeholder="Available for new projects" />
            </div>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Headline</label>
            <textarea style={textareaStyle} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Main headline" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea style={textareaStyle} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={labelStyle}>CTA Primary</label>
              <input style={inputStyle} value={ctaPrimary} onChange={e => setCtaPrimary(e.target.value)} placeholder="View My Work" />
            </div>
            <div>
              <label style={labelStyle}>CTA Secondary</label>
              <input style={inputStyle} value={ctaSecondary} onChange={e => setCtaSecondary(e.target.value)} placeholder="See Pricing" />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <ImageUploadButton label="Profile Image" value={profileImage} onChange={setProfileImage} />
        </div>

        {/* Stats */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Stats</label>
            <button type="button" onClick={() => setStats(prev => [...prev, { value: '', label: '', color: '#4f7cff' }])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add Stat
            </button>
          </div>
          {stats.map((stat, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input style={inputStyle} value={stat.value} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], value: e.target.value }; setStats(ns); }} placeholder="Value (e.g. 30+)" />
              <input style={inputStyle} value={stat.label} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], label: e.target.value }; setStats(ns); }} placeholder="Label" />
              <input type="color" value={stat.color} onChange={e => { const ns = [...stats]; ns[i] = { ...ns[i], color: e.target.value }; setStats(ns); }} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
              <button type="button" onClick={() => setStats(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {stats.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد إحصائيات. اضغط "Add Stat" لإضافة واحدة.</p>}
        </div>

        {/* Floating Pills */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Floating Pills</label>
            <button type="button" onClick={() => setFloatingPills(prev => [...prev, ''])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add Pill
            </button>
          </div>
          {floatingPills.map((pill, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <GripVertical size={16} style={{ color: '#4b5563', flexShrink: 0 }} />
              <input style={{ ...inputStyle, flex: 1 }} value={pill} onChange={e => { const np = [...floatingPills]; np[i] = e.target.value; setFloatingPills(np); }} placeholder="Pill text" />
              <button type="button" onClick={() => setFloatingPills(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {floatingPills.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد عناصر.</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function AboutEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sectionTitle, setSectionTitle] = useState('');
  const [bio1, setBio1] = useState('');
  const [bio2, setBio2] = useState('');
  const [portraitImage, setPortraitImage] = useState('');
  const [nameOverlay, setNameOverlay] = useState('');
  const [locationOverlay, setLocationOverlay] = useState('');
  const [quote, setQuote] = useState('');
  const [skills, setSkills] = useState<{ label: string; level: number }[]>([]);
  const [aboutStats, setAboutStats] = useState<{ value: string; unit: string; label: string; color: string }[]>([]);

  useEffect(() => {
    const a = settings.about;
    setSectionTitle(a.sectionTitle || '');
    setBio1(a.bio1 || '');
    setBio2(a.bio2 || '');
    setPortraitImage(a.portraitImage || '');
    setNameOverlay(a.nameOverlay || '');
    setLocationOverlay(a.locationOverlay || '');
    setQuote(a.quote || '');
    setSkills(a.skills?.map(s => ({ ...s })) || []);
    setAboutStats(a.stats?.map(s => ({ ...s })) || []);
  }, [settings.about]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('about', { sectionTitle, bio1, bio2, portraitImage, nameOverlay, locationOverlay, quote, skills, stats: aboutStats });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>About Me</h2>
      <p style={sectionDescStyle}>تعديل قسم "من أنا" والمهارات والإحصائيات</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} placeholder="Section title" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Bio Paragraph 1</label>
            <textarea style={textareaStyle} value={bio1} onChange={e => setBio1(e.target.value)} placeholder="First paragraph" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Bio Paragraph 2</label>
            <textarea style={textareaStyle} value={bio2} onChange={e => setBio2(e.target.value)} placeholder="Second paragraph" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={labelStyle}>Name Overlay</label>
              <input style={inputStyle} value={nameOverlay} onChange={e => setNameOverlay(e.target.value)} placeholder="Name overlay text" />
            </div>
            <div>
              <label style={labelStyle}>Location Overlay</label>
              <input style={inputStyle} value={locationOverlay} onChange={e => setLocationOverlay(e.target.value)} placeholder="Location text" />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Quote</label>
            <textarea style={textareaStyle} value={quote} onChange={e => setQuote(e.target.value)} placeholder="Inspirational quote" />
          </div>
        </div>

        <div style={cardStyle}>
          <ImageUploadButton label="Portrait Image" value={portraitImage} onChange={setPortraitImage} />
        </div>

        {/* Skills */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Skills</label>
            <button type="button" onClick={() => setSkills(prev => [...prev, { label: '', level: 50 }])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add Skill
            </button>
          </div>
          {skills.map((skill, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
              <input style={inputStyle} value={skill.label} onChange={e => { const ns = [...skills]; ns[i] = { ...ns[i], label: e.target.value }; setSkills(ns); }} placeholder="Skill name" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={e => { const ns = [...skills]; ns[i] = { ...ns[i], level: Number(e.target.value) }; setSkills(ns); }}
                  style={{ flex: 1, accentColor: '#4f7cff' }}
                />
                <span style={{ fontSize: '12px', color: '#9ca3af', minWidth: '32px', textAlign: 'right' }}>{skill.level}%</span>
              </div>
              <button type="button" onClick={() => setSkills(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {skills.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد مهارات.</p>}
        </div>

        {/* Stats */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Stats</label>
            <button type="button" onClick={() => setAboutStats(prev => [...prev, { value: '', unit: '', label: '', color: '#4f7cff' }])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add Stat
            </button>
          </div>
          {aboutStats.map((stat, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr auto auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input style={inputStyle} value={stat.value} onChange={e => { const ns = [...aboutStats]; ns[i] = { ...ns[i], value: e.target.value }; setAboutStats(ns); }} placeholder="Value" />
              <input style={inputStyle} value={stat.unit} onChange={e => { const ns = [...aboutStats]; ns[i] = { ...ns[i], unit: e.target.value }; setAboutStats(ns); }} placeholder="Unit" />
              <input style={inputStyle} value={stat.label} onChange={e => { const ns = [...aboutStats]; ns[i] = { ...ns[i], label: e.target.value }; setAboutStats(ns); }} placeholder="Label" />
              <input type="color" value={stat.color} onChange={e => { const ns = [...aboutStats]; ns[i] = { ...ns[i], color: e.target.value }; setAboutStats(ns); }} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
              <button type="button" onClick={() => setAboutStats(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {aboutStats.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد إحصائيات.</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function ServicesEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [svcTitle, setSvcTitle] = useState('');
  const [svcSubtitle, setSvcSubtitle] = useState('');
  const [items, setItems] = useState<{ title: string; tagline: string; description: string; features: string[] }[]>([]);

  useEffect(() => {
    const s = settings.services;
    setSvcTitle(s.sectionTitle || '');
    setSvcSubtitle(s.sectionSubtitle || '');
    setItems(s.items?.map(item => ({ ...item, features: [...item.features] })) || []);
  }, [settings.services]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('services', { sectionTitle: svcTitle, sectionSubtitle: svcSubtitle, items });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  const addService = () => setItems(prev => [...prev, { title: '', tagline: '', description: '', features: [] }]);
  const removeService = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, field: string, value: any) => {
    setItems(prev => {
      const n = [...prev];
      n[i] = { ...n[i], [field]: value };
      return n;
    });
  };

  const addFeature = (i: number) => {
    setItems(prev => {
      const n = [...prev];
      n[i] = { ...n[i], features: [...n[i].features, ''] };
      return n;
    });
  };

  const removeFeature = (i: number, fi: number) => {
    setItems(prev => {
      const n = [...prev];
      n[i] = { ...n[i], features: n[i].features.filter((_, idx) => idx !== fi) };
      return n;
    });
  };

  const updateFeature = (i: number, fi: number, val: string) => {
    setItems(prev => {
      const n = [...prev];
      const feats = [...n[i].features];
      feats[fi] = val;
      n[i] = { ...n[i], features: feats };
      return n;
    });
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Services</h2>
      <p style={sectionDescStyle}>إدارة الخدمات المعروضة في الموقع</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={svcTitle} onChange={e => setSvcTitle(e.target.value)} placeholder="Section title" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Section Subtitle</label>
            <textarea style={textareaStyle} value={svcSubtitle} onChange={e => setSvcSubtitle(e.target.value)} placeholder="Section subtitle" />
          </div>
        </div>

        {items.map((item, i) => (
          <div key={i} style={{ ...cardStyle, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#d1d5db' }}>Service #{i + 1}</span>
              <button type="button" onClick={() => removeService(i)} style={dangerBtnStyle}><Trash2 size={14} /> Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} placeholder="Service title" />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input style={inputStyle} value={item.tagline} onChange={e => updateItem(i, 'tagline', e.target.value)} placeholder="Short tagline" />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={textareaStyle} value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Service description" />
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Features</label>
                <button type="button" onClick={() => addFeature(i)} style={{ ...secondaryBtnStyle, fontSize: '11px', padding: '4px 10px' }}><Plus size={12} /> Add</button>
              </div>
              {item.features.map((feat, fi) => (
                <div key={fi} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={feat} onChange={e => updateFeature(i, fi, e.target.value)} placeholder="Feature name" />
                  <button type="button" onClick={() => removeFeature(i, fi)} style={dangerBtnStyle}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="button" onClick={addService} style={{ ...secondaryBtnStyle, justifyContent: 'center', padding: '14px', borderStyle: 'dashed' }}>
          <Plus size={16} /> Add New Service
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function PricingEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [prcTitle, setPrcTitle] = useState('');
  const [prcSubtitle, setPrcSubtitle] = useState('');
  const [tiers, setTiers] = useState<{ name: string; tagline: string; price: string; priceNote: string; popular: boolean; features: string[]; cta: string; ctaHref: string }[]>([]);

  useEffect(() => {
    const p = settings.pricing;
    setPrcTitle(p.sectionTitle || '');
    setPrcSubtitle(p.sectionSubtitle || '');
    setTiers(p.tiers?.map(t => ({ ...t, features: [...t.features] })) || []);
  }, [settings.pricing]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('pricing', { sectionTitle: prcTitle, sectionSubtitle: prcSubtitle, tiers });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  const addTier = () => setTiers(prev => [...prev, { name: '', tagline: '', price: '', priceNote: '', popular: false, features: [], cta: '', ctaHref: '' }]);
  const removeTier = (i: number) => setTiers(prev => prev.filter((_, idx) => idx !== i));

  const updateTier = (i: number, field: string, value: any) => {
    setTiers(prev => {
      const n = [...prev];
      n[i] = { ...n[i], [field]: value };
      return n;
    });
  };

  const addTierFeature = (i: number) => {
    setTiers(prev => {
      const n = [...prev];
      n[i] = { ...n[i], features: [...n[i].features, ''] };
      return n;
    });
  };

  const removeTierFeature = (i: number, fi: number) => {
    setTiers(prev => {
      const n = [...prev];
      n[i] = { ...n[i], features: n[i].features.filter((_, idx) => idx !== fi) };
      return n;
    });
  };

  const updateTierFeature = (i: number, fi: number, val: string) => {
    setTiers(prev => {
      const n = [...prev];
      const feats = [...n[i].features];
      feats[fi] = val;
      n[i] = { ...n[i], features: feats };
      return n;
    });
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Pricing</h2>
      <p style={sectionDescStyle}>إدارة باقات الأسعار وتفاصيلها</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div>
            <label style={labelStyle}>Section Title</label>
            <input style={inputStyle} value={prcTitle} onChange={e => setPrcTitle(e.target.value)} placeholder="Section title" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Section Subtitle</label>
            <textarea style={textareaStyle} value={prcSubtitle} onChange={e => setPrcSubtitle(e.target.value)} placeholder="Section subtitle" />
          </div>
        </div>

        {tiers.map((tier, i) => (
          <div key={i} style={{ ...cardStyle, position: 'relative', border: tier.popular ? '1px solid rgba(79,124,255,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#d1d5db' }}>Tier #{i + 1}</span>
                {tier.popular && <span style={{ fontSize: '10px', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>POPULAR</span>}
              </div>
              <button type="button" onClick={() => removeTier(i)} style={dangerBtnStyle}><Trash2 size={14} /> Remove</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} placeholder="Tier name" />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input style={inputStyle} value={tier.tagline} onChange={e => updateTier(i, 'tagline', e.target.value)} placeholder="Short tagline" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={labelStyle}>Price</label>
                <input style={inputStyle} value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} placeholder="$120" />
              </div>
              <div>
                <label style={labelStyle}>Price Note</label>
                <input style={inputStyle} value={tier.priceNote} onChange={e => updateTier(i, 'priceNote', e.target.value)} placeholder="one-time" />
              </div>
              <div>
                <label style={labelStyle}>CTA Text</label>
                <input style={inputStyle} value={tier.cta} onChange={e => updateTier(i, 'cta', e.target.value)} placeholder="Get Started" />
              </div>
              <div>
                <label style={labelStyle}>CTA Link</label>
                <input style={inputStyle} value={tier.ctaHref} onChange={e => updateTier(i, 'ctaHref', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={tier.popular}
                  onChange={e => updateTier(i, 'popular', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#4f7cff', borderRadius: '4px' }}
                />
                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>Mark as Popular</span>
              </label>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Features</label>
                <button type="button" onClick={() => addTierFeature(i)} style={{ ...secondaryBtnStyle, fontSize: '11px', padding: '4px 10px' }}><Plus size={12} /> Add</button>
              </div>
              {tier.features.map((feat, fi) => (
                <div key={fi} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={feat} onChange={e => updateTierFeature(i, fi, e.target.value)} placeholder="Feature" />
                  <button type="button" onClick={() => removeTierFeature(i, fi)} style={dangerBtnStyle}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="button" onClick={addTier} style={{ ...secondaryBtnStyle, justifyContent: 'center', padding: '14px', borderStyle: 'dashed' }}>
          <Plus size={16} /> Add New Tier
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function FaqEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [faqTitle, setFaqTitle] = useState('');
  const [categories, setCategories] = useState<{ name: string; items: { question: string; answer: string }[] }[]>([]);

  useEffect(() => {
    const f = settings.faq;
    setFaqTitle(f.sectionTitle || '');
    setCategories(
      f.categories?.map((cat: any) => ({
        name: cat.name || '',
        items: (cat.items || []).map((item: any) => ({ question: item.question || '', answer: item.answer || '' })),
      })) || []
    );
  }, [settings.faq]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('faq', { sectionTitle: faqTitle, categories });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  const addCategory = () => setCategories(prev => [...prev, { name: '', items: [] }]);
  const removeCategory = (i: number) => setCategories(prev => prev.filter((_, idx) => idx !== i));

  const updateCategoryName = (i: number, name: string) => {
    setCategories(prev => {
      const n = [...prev];
      n[i] = { ...n[i], name };
      return n;
    });
  };

  const addQA = (catIdx: number) => {
    setCategories(prev => {
      const n = [...prev];
      n[catIdx] = { ...n[catIdx], items: [...n[catIdx].items, { question: '', answer: '' }] };
      return n;
    });
  };

  const removeQA = (catIdx: number, qaIdx: number) => {
    setCategories(prev => {
      const n = [...prev];
      n[catIdx] = { ...n[catIdx], items: n[catIdx].items.filter((_, idx) => idx !== qaIdx) };
      return n;
    });
  };

  const updateQA = (catIdx: number, qaIdx: number, field: 'question' | 'answer', value: string) => {
    setCategories(prev => {
      const n = [...prev];
      const items = [...n[catIdx].items];
      items[qaIdx] = { ...items[qaIdx], [field]: value };
      n[catIdx] = { ...n[catIdx], items };
      return n;
    });
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>FAQ</h2>
      <p style={sectionDescStyle}>إدارة الأسئلة الشائعة حسب التصنيفات</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <label style={labelStyle}>Section Title</label>
          <input style={inputStyle} value={faqTitle} onChange={e => setFaqTitle(e.target.value)} placeholder="Frequently Asked Questions" />
        </div>

        {categories.map((cat, ci) => (
          <div key={ci} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#d1d5db' }}>Category #{ci + 1}</span>
              <button type="button" onClick={() => removeCategory(ci)} style={dangerBtnStyle}><Trash2 size={14} /> Remove</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Category Name</label>
              <input style={inputStyle} value={cat.name} onChange={e => updateCategoryName(ci, e.target.value)} placeholder="Category name" />
            </div>

            <div style={{ paddingLeft: '16px', borderLeft: '2px solid rgba(79,124,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Questions & Answers</label>
                <button type="button" onClick={() => addQA(ci)} style={{ ...secondaryBtnStyle, fontSize: '11px', padding: '4px 10px' }}><Plus size={12} /> Add Q&A</button>
              </div>

              {cat.items.map((qa, qi) => (
                <div key={qi} style={{ background: '#111114', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>Q&A #{qi + 1}</span>
                    <button type="button" onClick={() => removeQA(ci, qi)} style={dangerBtnStyle}><X size={12} /></button>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ ...labelStyle, fontSize: '11px' }}>Question</label>
                    <textarea style={{ ...textareaStyle, minHeight: '50px' }} value={qa.question} onChange={e => updateQA(ci, qi, 'question', e.target.value)} placeholder="Enter question" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '11px' }}>Answer</label>
                    <textarea style={{ ...textareaStyle, minHeight: '60px' }} value={qa.answer} onChange={e => updateQA(ci, qi, 'answer', e.target.value)} placeholder="Enter answer" />
                  </div>
                </div>
              ))}

              {cat.items.length === 0 && <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', padding: '12px 0' }}>لا توجد أسئلة في هذا التصنيف.</p>}
            </div>
          </div>
        ))}

        <button type="button" onClick={addCategory} style={{ ...secondaryBtnStyle, justifyContent: 'center', padding: '14px', borderStyle: 'dashed' }}>
          <Plus size={16} /> Add New Category
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function ContactEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [heading, setHeading] = useState('');
  const [contactDesc, setContactDesc] = useState('');
  const [email, setEmail] = useState('');
  const [behance, setBehance] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [statusItems, setStatusItems] = useState<string[]>([]);

  useEffect(() => {
    const c = settings.contact;
    setHeading(c.heading || '');
    setContactDesc(c.description || '');
    setEmail(c.email || '');
    setBehance(c.socialLinks?.behance || '');
    setWhatsapp(c.socialLinks?.whatsapp || '');
    setInstagram(c.socialLinks?.instagram || '');
    setLinkedin(c.socialLinks?.linkedin || '');
    setStatusItems([...(c.statusItems || [])]);
  }, [settings.contact]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('contact', {
        heading,
        description: contactDesc,
        email,
        socialLinks: { behance, whatsapp, instagram, linkedin },
        statusItems,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Contact</h2>
      <p style={sectionDescStyle}>تعديل معلومات التواصل وروابط السوشيال ميديا</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div>
            <label style={labelStyle}>Heading</label>
            <textarea style={textareaStyle} value={heading} onChange={e => setHeading(e.target.value)} placeholder="Contact heading" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea style={textareaStyle} value={contactDesc} onChange={e => setContactDesc(e.target.value)} placeholder="Contact description" />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
        </div>

        <div style={cardStyle}>
          <label style={{ ...labelStyle, marginBottom: '16px' }}>Social Links</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ ...labelStyle, fontSize: '11px' }}>Behance</label>
              <input style={inputStyle} value={behance} onChange={e => setBehance(e.target.value)} placeholder="https://behance.net/..." />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '11px' }}>WhatsApp</label>
              <input style={inputStyle} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="https://wa.me/..." />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '11px' }}>Instagram</label>
              <input style={inputStyle} value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: '11px' }}>LinkedIn</label>
              <input style={inputStyle} value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Status Items</label>
            <button type="button" onClick={() => setStatusItems(prev => [...prev, ''])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add
            </button>
          </div>
          {statusItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, flex: 1 }} value={item} onChange={e => { const n = [...statusItems]; n[i] = e.target.value; setStatusItems(n); }} placeholder="Status text" />
              <button type="button" onClick={() => setStatusItems(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {statusItems.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد عناصر حالة.</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL SETTINGS EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

function GeneralEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [genName, setGenName] = useState('');
  const [genTitle, setGenTitle] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);

  useEffect(() => {
    const g = settings.general;
    setGenName(g.name || '');
    setGenTitle(g.title || '');
    setLogoImage(g.logoImage || '');
    setMarqueeItems([...(g.marqueeItems || [])]);
  }, [settings.general]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('general', { name: genName, title: genTitle, logoImage, marqueeItems });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء الحفظ!');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>General Settings</h2>
      <p style={sectionDescStyle}>الإعدادات العامة للموقع</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Site Name</label>
              <input style={inputStyle} value={genName} onChange={e => setGenName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle}>Site Title</label>
              <input style={inputStyle} value={genTitle} onChange={e => setGenTitle(e.target.value)} placeholder="Your title" />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <ImageUploadButton label="Logo Image" value={logoImage} onChange={setLogoImage} />
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Marquee Items</label>
            <button type="button" onClick={() => setMarqueeItems(prev => [...prev, ''])} style={secondaryBtnStyle}>
              <Plus size={14} /> Add
            </button>
          </div>
          {marqueeItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
              <GripVertical size={16} style={{ color: '#4b5563', flexShrink: 0 }} />
              <input style={{ ...inputStyle, flex: 1 }} value={item} onChange={e => { const n = [...marqueeItems]; n[i] = e.target.value; setMarqueeItems(n); }} placeholder="Marquee text" />
              <button type="button" onClick={() => setMarqueeItems(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
          {marqueeItems.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد عناصر ماركي.</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

function InstagramEditor() {
  const { settings, updateSection } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [bioTitle, setBioTitle] = useState('');
  const [bioDescription, setBioDescription] = useState('');
  const [followersCount, setFollowersCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [highlights, setHighlights] = useState<{ label: string; img: string }[]>([]);

  useEffect(() => {
    const inst = settings.instagram;
    if (inst) {
      setBioTitle(inst.bioTitle || '');
      setBioDescription(inst.bioDescription || '');
      setFollowersCount(inst.followersCount || '');
      setFollowingCount(inst.followingCount || '');
      setHighlights(inst.highlights?.map(h => ({ ...h })) || []);
    }
  }, [settings.instagram]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSection('instagram', { bioTitle, bioDescription, followersCount, followingCount, highlights });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('حدث خطأ أثناء حفظ بيانات انستجرام!');
    }
    setSaving(false);
  };

  const updateHighlight = (i: number, key: 'label' | 'img', val: string) => {
    const next = [...highlights];
    next[i] = { ...next[i], [key]: val };
    setHighlights(next);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Instagram Simulator</h2>
      <p style={sectionDescStyle}>التحكم في بيانات محاكي انستجرام المعروض على الموقع</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>عدد المتابعين (Followers)</label>
              <input style={inputStyle} value={followersCount} onChange={e => setFollowersCount(e.target.value)} placeholder="مثال: 12.5K" />
            </div>
            <div>
              <label style={labelStyle}>يتابعهم (Following)</label>
              <input style={inputStyle} value={followingCount} onChange={e => setFollowingCount(e.target.value)} placeholder="مثال: 480" />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>العنوان الفرعي للسيرة الذاتية (Bio Title)</label>
            <input style={inputStyle} value={bioTitle} onChange={e => setBioTitle(e.target.value)} placeholder="مثال: مصمم جرافيك | هويات بصرية وسوشيال ميديا 🎨" />
          </div>
          <div>
            <label style={labelStyle}>الوصف والسيرة الذاتية (Bio Description)</label>
            <textarea style={textareaStyle} value={bioDescription} onChange={e => setBioDescription(e.target.value)} placeholder="اكتب نبذة تظهر في المحاكي..." />
          </div>
        </div>

        {/* Highlights List */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>قصص انستجرام البارزة (Story Highlights)</label>
            <button type="button" onClick={() => setHighlights(prev => [...prev, { label: '', img: '' }])} style={secondaryBtnStyle}>
              <Plus size={14} /> إضافة هايلايت
            </button>
          </div>
          {highlights.map((hl, i) => (
            <div key={i} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '12px', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af' }}>هايلايت #{i + 1}</span>
                <button type="button" onClick={() => setHighlights(prev => prev.filter((_, idx) => idx !== i))} style={dangerBtnStyle}>
                  <Trash2 size={14} /> حذف الهايلايت
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>اسم الهايلايت</label>
                  <input style={inputStyle} value={hl.label} onChange={e => updateHighlight(i, 'label', e.target.value)} placeholder="مثال: Branding" />
                </div>
                <div>
                  <ImageUploadButton label="صورة الهايلايت" value={hl.img} onChange={url => updateHighlight(i, 'img', url)} />
                </div>
              </div>
            </div>
          ))}
          {highlights.length === 0 && <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>لا توجد هايلايتس معروضة حالياً.</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveButton saving={saving} saved={saved} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('portfolio_admin_session') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'brand' | 'social'>('brand');
  const [description, setDescription] = useState('');
  const [brief, setBrief] = useState('');
  const [tags, setTags] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  // Loading indicator states
  const [isPreviewUploading, setIsPreviewUploading] = useState(false);
  const [previewSuccess, setPreviewSuccess] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const previewInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // جلب المشاريع من قاعدة بيانات Supabase الحقيقية
  const fetchProjects = async () => {
    setLoadingProjects(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });
    
    if (!error && data) {
      setProjects(data.map(mapFromDb));
    }
    setLoadingProjects(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('كلمة المرور غير صحيحة ملوكشا!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('portfolio_admin_session');
    window.location.hash = '';
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('brand');
    setDescription('');
    setBrief('');
    setTags('');
    setPreviewImage('');
    setAdditionalImages([]);
    setPreviewSuccess(false);
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setBrief(project.brief || '');
    setTags(project.tags.join(', '));
    setPreviewImage(project.previewImage || '');
    setAdditionalImages(project.additionalImages || []);
    setPreviewSuccess(false);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع نهائياً من سحابة Supabase؟')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        alert('حدث خطأ أثناء الحذف!');
      }
    }
  };

  // رفع الصورة لـ Supabase Storage Bucket والحصول على رابط عام مباشر للملف
  const uploadToSupabaseStorage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPreviewUploading(true);
    setPreviewSuccess(false);

    const publicUrl = await uploadToSupabaseStorage(file);
    if (publicUrl) {
      setPreviewImage(publicUrl);
      setPreviewSuccess(true);
    } else {
      alert("فشل رفع الملف لـ Supabase Storage! تأكد أن الـ Bucket عام ومفتوح الـ Policies.");
    }
    setIsPreviewUploading(false);
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsGalleryUploading(true);

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadToSupabaseStorage(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setAdditionalImages(prev => [...prev, ...uploadedUrls]);
    }
    setIsGalleryUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPreviewUploading || isGalleryUploading) return;

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProject) {
      const updatedData = {
        title,
        category,
        categoryLabel: category === 'brand' ? 'Brand Identity' : 'Social Media',
        description,
        brief,
        tags: parsedTags,
        previewImage,
        additionalImages
      };

      const { error } = await supabase
        .from('projects')
        .update(mapToDb(updatedData))
        .eq('id', editingProject.id);

      if (!error) {
        fetchProjects();
        setShowModal(false);
      } else {
        console.error("Update error:", error);
        alert('حدث خطأ أثناء تحديث البيانات السحابية: ' + error.message);
      }
    } else {
      const colorIdx = projects.length % USER_ACCENT_COLORS[category].length;
      const gradIdx = projects.length % USER_GRADIENTS[category].length;

      const newProject = {
        title,
        category,
        categoryLabel: category === 'brand' ? 'Brand Identity' : 'Social Media',
        description,
        brief,
        tags: parsedTags,
        gradient: USER_GRADIENTS[category][gradIdx],
        accentColor: USER_ACCENT_COLORS[category][colorIdx],
        mockContent: title.substring(0, 4).toUpperCase(),
        previewImage,
        additionalImages,
        isUserProject: true
      };

      const { error } = await supabase.from('projects').insert([mapToDb(newProject)]);

      if (!error) {
        fetchProjects();
        setShowModal(false);
      } else {
        console.error("Insert error:", error);
        alert('حدث خطأ أثناء إضافة البيانات السحابية لقاعدة البيانات: ' + error.message);
      }
    }
  };

  // ─── Login Screen ──────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-root min-h-screen flex items-center justify-center bg-[#111114] px-4 font-sans">
        <div className="w-full max-w-md bg-[#1c1c22] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#4f7cff] to-[#7c5cfc] rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">لوحة تحكم المعرض السحابية</h2>
            <p className="text-sm text-gray-400 mt-1">سجل دخولك لإرسال الداتا لـ Supabase</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#111114] border border-white/10 rounded-xl text-white outline-none focus:border-[#4f7cff] transition-all text-center tracking-widest"
              />
            </div>
            {loginError && <p className="text-xs text-red-400 text-center font-medium">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-white text-[#111114] font-bold rounded-xl transition-all hover:bg-gray-100">
              دخول اللوحة
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Render tab content ────────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={sectionTitleStyle}>Dashboard Overview</h2>
            <p style={sectionDescStyle}>نظرة عامة على إحصائيات الموقع</p>
            {loadingProjects ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px', color: '#9ca3af' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#4f7cff' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>جاري جلب البيانات...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79,124,255,0.1)', color: '#4f7cff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LayoutDashboard size={22} /></div>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>{projects.length}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>مشاريع Supabase</div>
                    </div>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124,92,252,0.1)', color: '#7c5cfc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Layers size={22} /></div>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>{projects.filter(p => p.category === 'brand').length}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>Brand Identity</div>
                    </div>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,107,53,0.1)', color: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={22} /></div>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>{projects.filter(p => p.category === 'social').length}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>Social Media</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={sectionTitleStyle}>إدارة الداتا الحية</h3>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>أي إضافة أو تعديل هنا ستظهر فوراً لجميع العملاء في العالم</p>
              </div>
              <button onClick={openAddModal} style={primaryBtnStyle}><Plus size={16} /> إضافة مشروع جديد</button>
            </div>

            {loadingProjects ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px', color: '#9ca3af' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#4f7cff' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>جاري جلب بيانات معرض الأعمال من السيرفر...</p>
              </div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', background: '#1c1c22', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>قاعدة البيانات السحابية فارغة حالياً ملوكشا، أضف مشروعاً لبدء التشغيل!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {projects.map(project => (
                  <div key={project.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '176px', background: project.gradient || '#374151' }}>
                      {project.previewImage && <img src={project.previewImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{project.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: '#d1d5db' }}>{project.categoryLabel}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => openEditModal(project)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#d1d5db', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(project.id)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'hero':
        return <HeroEditor />;
      case 'about':
        return <AboutEditor />;
      case 'instagram':
        return <InstagramEditor />;
      case 'services':
        return <ServicesEditor />;
      case 'pricing':
        return <PricingEditor />;
      case 'faq':
        return <FaqEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'general':
        return <GeneralEditor />;
      default:
        return null;
    }
  };

  // ─── Main Layout ───────────────────────────────────────────────────────────

  return (
    <div className="admin-dashboard-root" style={{ minHeight: '100vh', background: '#111114', color: '#edeae4', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#17171b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f7cff, #7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px', boxShadow: '0 4px 12px rgba(79,124,255,0.3)' }}>M</div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>لوحة Supabase السحابية</h1>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>مرحبا محمد أشرف</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => window.open('/', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d1d5db', border: 'none', cursor: 'pointer' }}><Eye size={14} /> معاينة الموقع</button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '10px', fontSize: '12px', fontWeight: 600, padding: '6px 14px', border: 'none', cursor: 'pointer' }}><LogOut size={14} /> خروج</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: '240px', minWidth: '240px', background: '#111114', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 12px', marginBottom: '8px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px' }}>Navigation</p>
          </div>
          {sidebarTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: 'calc(100% - 24px)',
                  margin: '2px 12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#9ca3af',
                  background: isActive ? 'rgba(79,124,255,0.12)' : 'transparent',
                  transition: 'all 0.15s ease',
                  textAlign: 'left' as const,
                }}
              >
                <span style={{ color: isActive ? '#4f7cff' : '#6b7280', display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Project Modal – preserved exactly */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[#1c1c22] border border-white/10 rounded-3xl my-auto shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#1c1c22] z-10">
                <h3 className="text-lg font-black text-white">{editingProject ? 'تعديل مشروع سحابي' : 'إضافة مشروع سحابي جديد'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"><X size={16} /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">القسم</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setCategory('brand')} className={`py-3 rounded-xl text-xs font-bold border ${category === 'brand' ? 'bg-white text-[#111114]' : 'bg-[#111114] text-gray-400 border-white/5'}`}>Brand Identity</button>
                    <button type="button" onClick={() => setCategory('social')} className={`py-3 rounded-xl text-xs font-bold border ${category === 'social' ? 'bg-white text-[#111114]' : 'bg-[#111114] text-gray-400 border-white/5'}`}>Social Media</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">عنوان المشروع</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-[#111114] border border-white/5 rounded-xl text-white outline-none focus:border-[#4f7cff] text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">وصف قصير للكارد</label>
                  <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-[#111114] border border-white/5 rounded-xl text-white outline-none text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">الوصف الكامل (Client Brief)</label>
                  <textarea rows={3} value={brief} onChange={e => setBrief(e.target.value)} className="w-full px-4 py-3 bg-[#111114] border border-white/5 rounded-xl text-white outline-none text-sm resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">الوسوم / التاجز (مفصولة بفصلة)</label>
                  <input type="text" placeholder="Logo, Branding, Identity" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-4 py-3 bg-[#111114] border border-white/5 rounded-xl text-white outline-none text-sm" />
                </div>

                {/* IMAGE COMPRESSION INTEGRATED AUTOMATICALLY INTO SUPABASE CLOUD FILE STREAM STORAGE */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center gap-1"><ImageIcon size={12} /> الصورة الرئيسية للكارد (تُرفع سحابياً)</label>
                  <input ref={previewInputRef} type="file" accept="image/*" className="hidden" onChange={handlePreviewUpload} disabled={isPreviewUploading} />
                  
                  {isPreviewUploading ? (
                    <div className="w-full border-2 border-dashed border-[#4f7cff]/40 rounded-2xl py-10 bg-[#111114] flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={24} className="animate-spin text-[#4f7cff]" />
                      <span className="text-xs font-bold text-[#4f7cff] animate-pulse">جاري رفع الملف لـ Supabase Storage Stream... 🚀</span>
                    </div>
                  ) : previewImage ? (
                    <div className="relative rounded-2xl overflow-hidden h-40 border border-white/10 group">
                      <img src={previewImage} alt="" className="w-full h-full object-cover" />
                      {previewSuccess && <div className="absolute top-3 right-3 bg-green-500/90 text-white rounded-full p-1 flex items-center gap-1 text-[10px] font-bold px-2 shadow-md"><CheckCircle2 size={12} /> تم الحفظ والتأمين السحابي</div>}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                        <button type="button" onClick={() => previewInputRef.current?.click()} className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-semibold">تغيير</button>
                        <button type="button" onClick={() => { setPreviewImage(''); setPreviewSuccess(false); }} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold">حذف</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => previewInputRef.current?.click()} className="w-full border-2 border-dashed border-white/10 rounded-2xl py-8 bg-[#111114] text-gray-400 text-xs font-semibold">اضغط لرفع الصورة السحابية</button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">الصور والتطبيقات الإضافية للمودال</label>
                  <input ref={additionalInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdditionalUpload} disabled={isGalleryUploading} />
                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {additionalImages.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/5">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setAdditionalImages(prev => prev.filter((_, idx)=>idx!==i))} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-red-400">X</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {isGalleryUploading ? (
                    <div className="w-full border-2 border-dashed border-[#7c5cfc]/40 rounded-xl py-6 bg-[#111114] flex items-center justify-center gap-3 text-gray-400">
                      <Loader2 size={18} className="animate-spin text-[#7c5cfc]" />
                      <span className="text-xs font-bold text-[#7c5cfc] animate-pulse">جاري الرفع المتعدد السحابي... 📂</span>
                    </div>
                  ) : (
                    <button type="button" onClick={() => additionalInputRef.current?.click()} className="w-full py-2.5 bg-[#111114] border border-dashed border-white/10 rounded-xl text-xs text-gray-400 font-medium">+ إضافة المزيد من الصور للـ Storage</button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl text-xs font-bold">إلغاء</button>
                  <button type="submit" disabled={isPreviewUploading || isGalleryUploading} className="px-5 py-2 bg-white text-[#111114] rounded-xl text-xs font-bold">حفظ ونشر البيانات</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Spin animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
