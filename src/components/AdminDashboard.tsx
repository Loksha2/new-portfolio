import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Pencil, LogOut, Folder, 
  Layers, Image as ImageIcon, LayoutDashboard, 
  Upload, X, Tag, FileText, Lock, Eye, Loader2, CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabaseClient'; // الربط مع الكلاينت الجديد

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('portfolio_admin_session') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
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
  const [gallerySuccess, setGallerySuccess] = useState(false);

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
      setProjects(data);
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
    setGallerySuccess(false);
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
    setGallerySuccess(false);
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
    setGallerySuccess(false);

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadToSupabaseStorage(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setAdditionalImages(prev => [...prev, ...uploadedUrls]);
      setGallerySuccess(true);
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
        .update(updatedData)
        .eq('id', editingProject.id);

      if (!error) {
        fetchProjects();
        setShowModal(false);
      } else {
        alert('حدث خطأ أثناء تحديث البيانات السحابية!');
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

      const { error } = await supabase.from('projects').insert([newProject]);

      if (!error) {
        fetchProjects();
        setShowModal(false);
      } else {
        alert('حدث خطأ أثناء إضافة البيانات السحابية لقاعدة البيانات!');
      }
    }
  };

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

  return (
    <div className="admin-dashboard-root min-h-screen bg-[#111114] text-[#edeae4] font-sans">
      <nav className="border-b border-white/5 bg-[#17171b] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4f7cff] to-[#7c5cfc] flex items-center justify-center text-white font-black shadow-md">M</div>
          <div>
            <h1 className="text-md font-black tracking-tight text-white">لوحة Supabase السحابية</h1>
            <p className="text-xs text-gray-400">مرحبا محمد أشرف</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl text-xs font-semibold hover:bg-white/10"><Eye size={14} /> معاينة الموقع</button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold px-3 py-1.5"><LogOut size={14} /> خروج</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3 text-gray-400">
            <Loader2 size={32} className="animate-spin text-[#4f7cff]" />
            <p className="text-sm font-semibold">جاري جلب بيانات معرض الأعمال من السيرفر...</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              <div className="bg-[#1c1c22] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4f7cff]/10 text-[#4f7cff] flex items-center justify-center"><LayoutDashboard size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-white">{projects.length}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">مشاريع Supabase</div>
                </div>
              </div>
              <div className="bg-[#1c1c22] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 text-[#7c5cfc] flex items-center justify-center"><Layers size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-white">{projects.filter(p=>p.category==='brand').length}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">Brand Identity</div>
                </div>
              </div>
              <div className="bg-[#1c1c22] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center"><ImageIcon size={22} /></div>
                <div>
                  <div className="text-2xl font-black text-white">{projects.filter(p=>p.category==='social').length}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">Social Media</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">إدارة الداتا الحية</h3>
                <p className="text-xs text-gray-400 mt-0.5">أي إضافة أو تعديل هنا ستظهر فوراً لجميع العملاء في العالم</p>
              </div>
              <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4f7cff] to-[#7c5cfc] text-white rounded-xl text-sm font-bold shadow-md"><Plus size={16} /> إضافة مشروع جديد</button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20 bg-[#1c1c22] border border-dashed border-white/10 rounded-2xl">
                <p className="text-sm text-gray-400">قاعدة البيانات السحابية فارغة حالياً ملوكشا، أضف مشروعاً لبدء التشغيل!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-[#1c1c22] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group">
                    <div className="relative h-44 bg-gray-800" style={{ background: project.gradient }}>
                      {project.previewImage && <img src={project.previewImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h4 className="text-md font-bold text-white mb-2">{project.title}</h4>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-300">{project.categoryLabel}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(project)} className="w-8 h-8 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center"><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(project.id)} className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}
