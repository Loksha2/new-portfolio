import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient'; // جلب كلاينت السيرفر
import InstagramGridSimulator from './InstagramGridSimulator';

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

const STATIC_PROJECTS: Project[] = [];

const getDynamicColor = (color: string) => {
  if (!color) return 'var(--color-accent-blue)';
  const lowerColor = color.toLowerCase();
  if (lowerColor === '#4f7cff') return 'var(--color-accent-blue)';
  if (lowerColor === '#7c5cfc') return 'var(--color-accent-purple)';
  if (lowerColor === '#ff6b35') return 'var(--color-accent-warm)';
  return color;
};

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

  useEffect(() => {
    // Preload all images in the background to avoid any download lag
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [allImages]);

  const accent = getDynamicColor(project.accentColor || '#4f7cff');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.97 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1c1c22] border border-white/5 scrollbar-none"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"><X size={16} /></button>
          {allImages.length > 0 && (
            <div className="relative w-full flex items-center justify-center bg-black/45 p-4 md:p-6 rounded-t-3xl min-h-[300px] overflow-hidden">
              {allImages.map((imgUrl, idx) => (
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt=""
                  className={`max-w-full max-h-[65vh] h-auto object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ${
                    idx === currentImg
                      ? 'opacity-100 relative z-10 scale-100'
                      : 'opacity-0 absolute pointer-events-none z-0 scale-95'
                  }`}
                />
              ))}
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setCurrentImg(i => Math.max(0, i - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors z-20"><ChevronLeft size={18} /></button>
                  <button onClick={() => setCurrentImg(i => Math.min(allImages.length - 1, i + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors z-20"><ChevronRight size={18} /></button>
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

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'all' | Category>('all');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'instagram'>('grid');
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
        setUserProjects(data.map(mapFromDb));
      }
      setLoading(false);
    };
    loadCloudProjects();
  }, []);

  // Switch default view mode when category changes
  useEffect(() => {
    if (activeFilter === 'social') {
      setViewMode('instagram');
    } else {
      setViewMode('grid');
    }
  }, [activeFilter]);

  const allProjects = [...STATIC_PROJECTS, ...userProjects];
  const filtered = activeFilter === 'all' ? allProjects : allProjects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 relative overflow-hidden" ref={ref} style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Selected <span className="text-gradient">Projects</span></h2>
          
          {/* Main Filter Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
            {(['all', 'brand', 'social'] as const).map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2 rounded-full text-xs font-bold border transition-all ${activeFilter === f ? 'bg-white text-black' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'}`}>
                {f === 'all' ? 'All Projects' : f === 'brand' ? 'Brand Identity' : 'Social Media'}
              </button>
            ))}
          </div>

          {/* Sub-toggle for Social Media View Mode */}
          {activeFilter === 'social' && (
            <div className="flex items-center justify-center gap-2 mt-5 text-xs">
              <button 
                onClick={() => setViewMode('instagram')} 
                className={`px-4 py-1.5 rounded-full border transition-all font-semibold ${viewMode === 'instagram' ? 'bg-[var(--color-accent-blue)] border-[var(--color-accent-blue)] text-white shadow-lg' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'}`}
              >
                📱 محاكي انستجرام
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`px-4 py-1.5 rounded-full border transition-all font-semibold ${viewMode === 'grid' ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'}`}
              >
                🎨 شبكة المشاريع
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin text-accent-blue" />
            <p className="text-xs">جاري تحميل أحدث أعمال محمد أشرف السحابية...</p>
          </div>
        ) : activeFilter === 'social' && viewMode === 'instagram' ? (
          <InstagramGridSimulator 
            projects={allProjects} 
            onSelectProject={(project) => setDetailProject(project)} 
          />
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
