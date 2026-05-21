import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // جلب كلاينت السيرفر

const easeOut = [0.22, 1, 0.36, 1] as const;
type Category = 'brand' | 'social';

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
  isUserProject?: boolean;
  additionalImages?: string[];
  previewImage?: string;
}

const STATIC_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Minimal Coffee Brand Identity',
    category: 'brand',
    categoryLabel: 'Brand Identity',
    description: 'A warm, artisanal identity for a specialty coffee brand blending warmth and minimalism.',
    brief: 'The client needed a premium yet approachable brand identity for their single-origin coffee shop targeting design-conscious millennials.',
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
    brief: 'A B2B SaaS startup needed a complete visual identity to pitch to investors and launch their product.',
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
    brief: 'A boutique fashion brand wanted to reposition from mid-market to luxury.',
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
    brief: 'A real estate firm expanding regionally needed a brand that signals trust.',
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
    brief: 'A restaurant chain launching a seasonal menu needed a 6-post social campaign.',
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
    brief: 'A cosmetics brand launching a new skincare line needed 8 Instagram posts.',
    tags: ['Instagram', 'Product', 'Luxury'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #7c5cfc 75%, #e9d5ff 100%)',
    accentColor: '#7c5cfc',
    mockContent: 'BEAUTY',
  },
];

const DetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const allImages: string[] = [];
  if (project.previewImage) allImages.push(project.previewImage);
  else if (project.imageSrc) allImages.push(project.imageSrc);
  if (project.additionalImages) allImages.push(...project.additionalImages);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const accent = project.accentColor;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.97 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1c1c22] border border-white/5"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white"><X size={16} /></button>
          {allImages.length > 0 && (
            <div className="relative w-full overflow-hidden rounded-t-3xl h-[340px]">
              <img src={allImages[currentImg]} alt="" className="w-full h-full object-cover" />
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setCurrentImg(i => Math.max(0, i - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"><ChevronLeft size={18} /></button>
                  <button onClick={() => setCurrentImg(i => Math.min(allImages.length - 1, i + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"><ChevronRight size={18} /></button>
                </>
              )}
            </div>
          )}
          <div className="p-8">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-white/5" style={{ color: accent }}>{project.categoryLabel}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-2">{project.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{project.description}</p>
            {project.brief && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-6">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Project Details</div>
                <p className="text-xs text-gray-300 leading-relaxed">{project.brief}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/5 text-gray-400">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // جلب المشاريع السحابية من قاعدة بيانات Supabase وقت تحميل الصفحة للزوار
  useEffect(() => {
    const loadCloudProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      if (!error && data) {
        setUserProjects(data);
      }
      setLoading(false);
    };
    loadCloudProjects();
  }, []);

  const allProjects = [...STATIC_PROJECTS, ...userProjects];
  const filtered = activeFilter === 'all' ? allProjects : allProjects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Selected <span className="text-gradient">Projects</span></h2>
          <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
            {(['all', 'brand', 'social'] as const).map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${activeFilter === f ? 'bg-white text-black' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'}`}>
                {f === 'all' ? 'All Projects' : f === 'brand' ? 'Brand Identity' : 'Social Media'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#4f7cff]" />
            <p className="text-xs">جاري تحميل أحدث أعمال محمد أشرف السحابية...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => {
              const mainImage = project.previewImage || project.imageSrc;
              return (
                <motion.div
                  key={project.id} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setDetailProject(project)} className="group bg-[#1c1c22] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-800" style={{ background: project.gradient }}>
                    {mainImage && <img src={mainImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-5">
                    <h3 className="text-md font-bold text-white mb-1.5">{project.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {project.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400">{t}</span>)}
                      </div>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      {detailProject && <DetailModal project={detailProject} onClose={() => setDetailProject(null)} />}
    </section>
  );
}
