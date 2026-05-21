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
  const profileImage = settings?.instagram?.profileImage || settings?.hero?.profileImage || '/images/about-portrait.jpg';
  const profileName = settings?.instagram?.profileName || settings?.general?.name || 'Mohamad Ashraf';
  const username = settings?.instagram?.username || profileName.toLowerCase().replace(/\s+/g, '.');
  const instagramUrl = settings.contact?.socialLinks?.instagram || 'https://instagram.com';

  // highlights
  const instagram = settings.instagram;
  const highlights = instagram.highlights || [];

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      {/* Outer iPad Container (Landscape Aspect Ratio) */}
      <div 
        className="relative mx-auto w-full max-w-[760px] aspect-[4/3] rounded-[36px] border-[16px] border-[#1e1e24] bg-[#050508] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 15px rgba(255,255,255,0.05)'
        }}
      >
        {/* iPad Camera Dot in top bezel (Landscape Center) */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0d0d11] border border-white/10 z-30" />

        {/* Screen Container */}
        <div className="flex-1 flex flex-col bg-[#050508] select-none text-left h-full overflow-hidden" dir="ltr">
          
          {/* Instagram Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 shrink-0 bg-[#050508]/80 backdrop-blur-md z-15">
            <ChevronLeft size={20} className="text-white cursor-pointer" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white tracking-wide">{username}</span>
              {/* Verified Badge */}
              <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent-blue)] flex items-center justify-center text-white text-[7px] font-bold">✓</span>
            </div>
            <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
          </div>

          {/* Main Landscape Split Body */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            
            {/* Left Column: Profile Bio & Stats (Fixed sidebar) */}
            <div className="w-[38%] border-r border-white/5 p-5 flex flex-col justify-between overflow-y-auto scrollbar-none shrink-0 bg-[#07070a]">
              <div>
                <div className="flex items-center gap-3">
                  {/* Profile Image */}
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shrink-0">
                    <div className="w-14 h-14 rounded-full bg-black p-0.5">
                      <img src={profileImage} alt="" className="w-full h-full object-cover rounded-full" />
                    </div>
                  </div>
                  {/* Names */}
                  <div className="overflow-hidden">
                    <h2 className="text-xs font-black text-white truncate">{profileName}</h2>
                    <p className="text-[10px] text-gray-500 font-mono truncate">@{username}</p>
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="flex justify-between text-center mt-5 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <div>
                    <div className="text-xs font-black text-white">{socialProjects.length}</div>
                    <div className="text-[9px] text-gray-400">posts</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{instagram.followersCount || '12.5K'}</div>
                    <div className="text-[9px] text-gray-400">followers</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{instagram.followingCount || '480'}</div>
                    <div className="text-[9px] text-gray-400">following</div>
                  </div>
                </div>

                {/* Profile Bio */}
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{instagram.bioTitle}</p>
                  <p className="text-[10px] text-gray-300 mt-1.5 leading-relaxed whitespace-pre-wrap">
                    {instagram.bioDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6">
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 py-2 rounded-lg bg-[var(--color-accent-blue)] hover:opacity-90 text-white text-[11px] font-bold transition-all text-center flex items-center justify-center cursor-pointer"
                >
                  Follow
                </a>
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold border border-white/5 transition-all text-center flex items-center justify-center cursor-pointer"
                >
                  Message
                </a>
              </div>
            </div>

            {/* Right Column: Highlights & Feed (Scrollable) */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-none bg-[#050508]">
              
              {/* Highlights */}
              {highlights.length > 0 && (
                <div className="flex items-center gap-4 px-5 py-4 overflow-x-auto scrollbar-none border-b border-white/5 bg-[#050508]/50 shrink-0">
                  {highlights.map((h, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                      <div className="w-12 h-12 rounded-full p-[1px] bg-white/10 flex items-center justify-center hover:scale-105 transition-all">
                        <div className="w-[44px] h-[44px] rounded-full bg-black p-[1px] overflow-hidden">
                          <img src={h.img} alt="" className="w-full h-full object-cover rounded-full filter grayscale-[15%]" />
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold">{h.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabs Bar */}
              <div className="flex justify-around border-b border-white/5 bg-white/[0.01] shrink-0 sticky top-0 z-10 backdrop-blur-md">
                <button 
                  onClick={() => setActiveTab('grid')}
                  className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'grid' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setActiveTab('reels')}
                  className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'reels' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
                >
                  <Tv size={16} />
                </button>
                <button 
                  onClick={() => setActiveTab('tagged')}
                  className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'tagged' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
                >
                  <UserSquare2 size={16} />
                </button>
              </div>

              {/* Grid Content */}
              <div className="flex-1 overflow-y-auto scrollbar-none min-h-0 bg-[#050508]">
                {activeTab === 'grid' ? (
                  <div className="grid grid-cols-3 gap-[2px] p-[2px] bg-black">
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

                    {socialProjects.length === 0 && (
                      <div className="col-span-3 text-center py-10 text-gray-500 text-xs">
                        No social media projects available.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 text-xs min-h-[150px]">
                    <p>No posts available in this tab.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Simulated iOS Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#1a1a20] rounded-full z-30" />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] animate-ping" />
        <span>Fully Interactive: Click on any post to view details & engagement metrics</span>
      </div>
    </div>
  );
}
