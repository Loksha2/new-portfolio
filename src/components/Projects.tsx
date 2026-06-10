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
  if (lowerColor === '#4f7cff' || lowerColor === '#b72120' || lowerColor === '#008b8b') return 'var(--color-accent-blue)';
  if (lowerColor === '#7c5cfc' || lowerColor === '#8c1615' || lowerColor === '#005a5a') return 'var(--color-accent-purple)';
  if (lowerColor === '#ff6b35' || lowerColor === '#e03c3b' || lowerColor === '#3e525a' || lowerColor === '#95a5a6') return 'var(--color-accent-warm)';
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
                <span
                  key={tag}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border border-[var(--color-accent-warm-glow)]"
                  style={{ backgroundColor: 'var(--color-accent-warm-glow)', color: 'var(--color-accent-warm)' }}
                >
                  {tag}
                </span>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Touch/swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allProjects = [...STATIC_PROJECTS, ...userProjects];
  const filtered = activeFilter === 'all' ? allProjects : allProjects.filter(p => p.category === activeFilter);

  // Clamp activeIndex when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(filtered.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered.length]);

  const navigate = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setActiveIndex(prev => Math.max(0, prev - 1));
    } else {
      setActiveIndex(prev => Math.min(filtered.length - 1, prev + 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 'right' : 'left');
    }
  };

  // Supabase fetch
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

  // Compute card 3D transforms — true coverflow with cards peeking from behind
  const getCardStyle = (index: number): React.CSSProperties => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    const direction = offset < 0 ? -1 : 1;

    // All cards sit in the same grid cell (stacked centered)
    // We only apply transforms to fan them out
    const gridBase: React.CSSProperties = {
      gridArea: '1 / 1',
      transition: 'all 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
    };

    // Hide cards beyond 2 positions away
    if (absOffset > 2) {
      return { ...gridBase, opacity: 0, pointerEvents: 'none', transform: 'scale(0.5)', zIndex: 0 };
    }

    // Center card: front and center, no rotation
    if (absOffset === 0) {
      return {
        ...gridBase,
        transform: 'translateX(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 5,
        filter: 'none',
      };
    }

    // Side cards: peek from behind the center card
    const tx = direction * (260 + (absOffset - 1) * 100);
    const ry = direction * -40;
    const s = 0.72 - (absOffset - 1) * 0.08;
    const z = 5 - absOffset;
    const b = Math.max(0.35, 0.55 - (absOffset - 1) * 0.15);
    const o = Math.max(0.3, 0.9 - (absOffset - 1) * 0.3);

    return {
      ...gridBase,
      transform: `translateX(${tx}px) rotateY(${ry}deg) scale(${s})`,
      opacity: o,
      zIndex: z,
      filter: `brightness(${b})`,
    };
  };

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
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <p className="text-sm">لا توجد مشاريع في هذا التصنيف.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Coverflow 3D Carousel */}
            <div 
              className="w-full"
              style={{ 
                display: 'grid',
                placeItems: 'center',
                perspective: '1200px',
                minHeight: '650px',
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {filtered.map((project, i) => {
                const mainImage = project.previewImage || project.imageSrc;
                const offset = i - activeIndex;
                const absOffset = Math.abs(offset);
                if (absOffset > 2) return null;

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      if (i === activeIndex) {
                        setDetailProject(project);
                      } else {
                        setActiveIndex(i);
                      }
                    }}
                    className={`group/card w-[340px] sm:w-[400px] md:w-[460px] rounded-[20px] overflow-hidden cursor-pointer ${'border-[6px] border-[#1a1a1e]'} ${
                      i === activeIndex 
                        ? 'shadow-[0_8px_80px_rgba(0,0,0,0.9)]' 
                        : ''
                    }`}
                    style={{
                      ...getCardStyle(i),
                      transformStyle: 'preserve-3d' as const,
                      background: '#0e0e12',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Full-size project poster */}
                    <div 
                      className="relative w-full overflow-hidden bg-gray-900" 
                      style={{ 
                        height: '580px',
                        background: project.gradient || '#111',
                      }}
                    >
                      {mainImage ? (
                        <img 
                          src={mainImage} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <ExternalLink size={32} />
                        </div>
                      )}
                      {/* Bottom gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Title & Description overlay at bottom of card */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className={`font-black text-white mb-1 tracking-tight transition-all duration-300 ${
                          i === activeIndex ? 'text-lg' : 'text-sm'
                        }`}>
                          {project.title}
                        </h3>
                        {i === activeIndex && (
                          <p className="text-xs text-gray-300 line-clamp-1 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {filtered.length > 1 && (
              <>
                <button 
                  onClick={() => navigate('left')} 
                  disabled={activeIndex === 0}
                  className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl transition-all z-30 cursor-pointer ${
                    activeIndex === 0 ? 'opacity-30 cursor-not-allowed border-white/5' : 'border-white/15 hover:bg-white hover:text-black hover:border-white hover:scale-110'
                  }`}
                  aria-label="Previous Project"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  onClick={() => navigate('right')} 
                  disabled={activeIndex === filtered.length - 1}
                  className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl transition-all z-30 cursor-pointer ${
                    activeIndex === filtered.length - 1 ? 'opacity-30 cursor-not-allowed border-white/5' : 'border-white/15 hover:bg-white hover:text-black hover:border-white hover:scale-110'
                  }`}
                  aria-label="Next Project"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Bottom dot indicators + project counter */}
            {filtered.length > 1 && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {filtered.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIndex 
                          ? 'w-6 h-2 bg-[var(--color-accent-blue)]' 
                          : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to project ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-medium">
                  {activeIndex + 1} / {filtered.length}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {detailProject && <DetailModal project={detailProject} onClose={() => setDetailProject(null)} />}
    </section>
  );
}
