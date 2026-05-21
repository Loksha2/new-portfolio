import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid, Tv, UserSquare2, Heart, MessageCircle, 
  ChevronLeft, MoreHorizontal
} from 'lucide-react';
import { useSiteSettings } from './SiteSettingsContext';

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

interface InstagramGridSimulatorProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function InstagramGridSimulator({ projects, onSelectProject }: InstagramGridSimulatorProps) {
  const { settings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  
  // Custom statistics/simulated engagement for each project ID to make it look realistic
  const simulatedEngagement: Record<number, { likes: string; comments: string }> = {
    6: { likes: '1.2K', comments: '84' },
    7: { likes: '942', comments: '51' },
    8: { likes: '1.5K', comments: '120' },
    9: { likes: '2.1K', comments: '168' },
  };

  const socialProjects = projects.filter(p => p.category === 'social');
  const profileImage = settings?.hero?.profileImage || '/images/about-portrait.jpg';
  const profileName = settings?.general?.name || 'Mohamad Ashraf';
  const username = profileName.toLowerCase().replace(/\s+/g, '.');

  // highlights
  const instagram = settings.instagram;
  const highlights = instagram.highlights || [];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      {/* Outer Phone Container */}
      <div 
        className="relative mx-auto w-full max-w-[360px] aspect-[9/19] rounded-[48px] border-[10px] border-[#222228] bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 15px rgba(255,255,255,0.05)'
        }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#000] rounded-full z-30 flex items-center justify-center border border-white/5">
          {/* Camera Lens */}
          <div className="absolute right-3 w-2.5 h-2.5 rounded-full bg-[#111] border border-white/5" />
          {/* Dynamic Island Light Indicator */}
          <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
        </div>

        {/* Speaker line */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1a1a20] rounded-full z-30" />

        {/* Screen Scrollable Container */}
        <div className="flex-1 overflow-y-auto pt-10 scrollbar-none flex flex-col bg-[#050508] select-none text-right" dir="rtl">
          
          {/* Instagram Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white tracking-wide">{username}</span>
              {/* Verified Badge */}
              <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center text-white text-[7px] font-bold">✓</span>
            </div>
            <ChevronLeft size={20} className="text-white cursor-pointer rotate-180" />
          </div>

          {/* Profile Section */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between gap-4">
              
              {/* Profile Image (Right aligned in RTL) */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                <div className="w-16 h-16 rounded-full bg-black p-0.5">
                  <img src={profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>

              {/* Stats Counters (Left side of profile image) */}
              <div className="flex-1 flex justify-around text-center px-2">
                <div>
                  <div className="text-sm font-black text-white">{socialProjects.length}</div>
                  <div className="text-[10px] text-gray-400">منشورات</div>
                </div>
                <div>
                  <div className="text-sm font-black text-white">{instagram.followersCount || '12.5K'}</div>
                  <div className="text-[10px] text-gray-400">متابعون</div>
                </div>
                <div>
                  <div className="text-sm font-black text-white">{instagram.followingCount || '480'}</div>
                  <div className="text-[10px] text-gray-400">متابعة</div>
                </div>
              </div>

            </div>

            {/* Profile Bio */}
            <div className="mt-3 text-right">
              <h2 className="text-xs font-black text-white">{profileName}</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">{instagram.bioTitle}</p>
              <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
                {instagram.bioDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 text-center">
              <button className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold border border-white/5 transition-all">
                مراسلة
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-[var(--color-accent-blue)] hover:opacity-90 text-white text-[11px] font-bold transition-all">
                متابعة
              </button>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-none border-b border-white/5">
            {highlights.map((h, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                <div className="w-11 h-11 rounded-full p-[1px] bg-white/10 flex items-center justify-center hover:scale-105 transition-all">
                  <div className="w-[42px] h-[42px] rounded-full bg-black p-[1px] overflow-hidden">
                    <img src={h.img} alt="" className="w-full h-full object-cover rounded-full filter grayscale-[30%]" />
                  </div>
                </div>
                <span className="text-[9px] text-gray-400">{h.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs Bar */}
          <div className="flex justify-around border-b border-white/5 bg-white/[0.01]">
            <button 
              onClick={() => setActiveTab('grid')}
              className={`flex-1 py-2.5 flex justify-center transition-colors ${activeTab === 'grid' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('reels')}
              className={`flex-1 py-2.5 flex justify-center transition-colors ${activeTab === 'reels' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            >
              <Tv size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('tagged')}
              className={`flex-1 py-2.5 flex justify-center transition-colors ${activeTab === 'tagged' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            >
              <UserSquare2 size={16} />
            </button>
          </div>

          {/* Grid Content */}
          {activeTab === 'grid' ? (
            <div className="grid grid-cols-3 gap-[2px] p-[2px] bg-black flex-1">
              {socialProjects.map((project) => {
                const engagement = simulatedEngagement[project.id] || { likes: '350', comments: '18' };
                return (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => onSelectProject(project)}
                    className="relative aspect-square bg-gray-900 group cursor-pointer overflow-hidden"
                  >
                    {project.previewImage && (
                      <img 
                        src={project.previewImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Hover Stats Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-xs font-bold z-10">
                      <div className="flex items-center gap-1">
                        <Heart size={14} fill="white" className="text-white" />
                        <span>{engagement.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} fill="white" className="text-white" />
                        <span>{engagement.comments}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pad grid with empty blocks if there are fewer projects */}
              {socialProjects.length === 0 && (
                <div className="col-span-3 text-center py-10 text-gray-500 text-xs">
                  لا توجد مشاريع سوشيال ميديا معروضة حالياً.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 text-xs">
              <p>لا توجد منشورات متوفرة في هذا التبويب حالياً.</p>
            </div>
          )}

        </div>

        {/* Simulated iOS Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#1a1a20] rounded-full z-30" />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] animate-ping" />
        <span>تفاعلي بالكامل: اضغط على أي بوست لعرض تفاصيله ومعلوماته كاملة</span>
      </div>
    </div>
  );
}
