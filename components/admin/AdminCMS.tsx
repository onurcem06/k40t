
import React, { useState, useRef, memo, useCallback } from 'react';
import {
  Plus, Trash2, Image as ImageIcon, Layout, FileText, Phone, Sparkles,
  X, Save, UploadCloud, ChevronRight, Star, Shield, Gavel, Search,
  Target, Globe, Palette, Share2, Clapperboard, Monitor, TrendingUp, Eye, EyeOff,
  Navigation, MousePointer2, Info, Megaphone, Zap, Cpu, Layers, Video, Smartphone,
  BarChart, LifeBuoy, Code, PenTool, Instagram, Linkedin, Twitter, Youtube, Facebook, Mail, MapPin, BookOpen, Hash,
  Database, Download, HardDriveDownload, AlertTriangle
} from 'lucide-react';
import { SiteContent, ServiceItem, ReferenceItem, NavItem, ClientProfile, UserAccount, ContactMessage } from '../../types.ts';
import { compressImage } from '../../utils/imageCompression.ts';

const RICH_ICONS = [
  { id: 'Megaphone', icon: Megaphone }, { id: 'Zap', icon: Zap }, { id: 'Cpu', icon: Cpu },
  { id: 'Layers', icon: Layers }, { id: 'Video', icon: Video }, { id: 'Smartphone', icon: Smartphone },
  { id: 'BarChart', icon: BarChart }, { id: 'LifeBuoy', icon: LifeBuoy }, { id: 'Code', icon: Code },
  { id: 'PenTool', icon: PenTool }, { id: 'Target', icon: Target }, { id: 'Palette', icon: Palette },
  { id: 'Clapperboard', icon: Clapperboard }, { id: 'Share2', icon: Share2 }, { id: 'Sparkles', icon: Sparkles },
  { id: 'Monitor', icon: Monitor }, { id: 'Shield', icon: Shield }, { id: 'TrendingUp', icon: TrendingUp },
  { id: 'Globe', icon: Globe }
];

const SOCIAL_PLATFORMS_OPTIONS = [
  { id: 'Instagram', icon: Instagram },
  { id: 'Linkedin', icon: Linkedin },
  { id: 'Twitter', icon: Twitter },
  { id: 'Youtube', icon: Youtube },
  { id: 'Facebook', icon: Facebook },
  { id: 'Web', icon: Globe }
];

const FOX_ICONS = ['FoxHead', 'FoxSitting', 'FoxRunning', 'FoxSleeping', 'FoxAlert'];

const InputField = memo(({ label, value, onChange, placeholder = "", type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-slate-300 text-sm h-48 md:h-64 resize-none focus:border-orange-500/50 outline-none transition-all custom-scrollbar"
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black text-xs focus:border-orange-500/50 outline-none transition-all"
      />
    )}
  </div>
));

const Dropzone = memo(({ currentImage, label, onUpload, aspect = "aspect-video", hint = "" }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // CORS/Storage hatasını aşmak için: İstemci tarafında sıkıştırıp Base64 olarak kaydet
        const compressedBase64 = await compressImage(file, 800, 0.7);
        onUpload(compressedBase64);
      } catch (error) {
        console.error("Compression failed", error);
        alert("Görsel işlenirken hata oluştu.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end px-1">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[8px] font-bold text-orange-500/70 uppercase">{hint}</span>}
      </div>
      <div
        onClick={() => !isUploading && fileRef.current?.click()}
        className={`${aspect} rounded-2xl border-2 border-dashed border-white/10 bg-black/40 hover:border-orange-500/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group relative`}
      >
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">YÜKLENİYOR...</span>
          </div>
        ) : currentImage ? (
          <img src={currentImage} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" alt="Preview" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={32} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Görsel Yükle</span>
          </div>
        )}
      </div>
    </div>
  );
});

interface AdminCMSProps {
  content: SiteContent;
  clients: ClientProfile[];
  users: UserAccount[];
  messages: ContactMessage[];
  onUpdateContent: (c: SiteContent) => void;
  onUpdateClients: (c: ClientProfile[]) => void;
  onUpdateUsers: (u: UserAccount[]) => void;
  onUpdateMessages: (m: ContactMessage[]) => void;
}

const AdminCMS: React.FC<AdminCMSProps> = ({
  content, clients, users, messages,
  onUpdateContent, onUpdateClients, onUpdateUsers, onUpdateMessages
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'NAV' | 'PAGES' | 'BRANDING' | 'SYSTEM'>('HOME');
  const [subTab, setSubTab] = useState<string>('HERO');
  const [editingId, setEditingId] = useState<string | null>(null);
  const restoreFileRef = useRef<HTMLInputElement>(null);

  const updateNested = useCallback((path: string, value: any) => {
    const keys = path.split('.');
    const newContent = JSON.parse(JSON.stringify(content));
    let curr = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!curr[keys[i]]) curr[keys[i]] = {};
      curr = curr[keys[i]];
    }
    curr[keys[keys.length - 1]] = value;
    onUpdateContent(newContent);
  }, [content, onUpdateContent]);

  const handleWorkImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, refId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 0.7);
        const currentItems = content.references.items;
        const updatedItems = currentItems.map(r =>
          r.id === refId ? { ...r, workImages: [...(r.workImages || []), compressedBase64] } : r
        );
        updateNested('references.items', updatedItems);
      } catch (error) {
        console.error("Image processing failed", error);
        alert("Görsel işlenemedi.");
      }
    }
  }, [content.references.items, updateNested]);

  // --- BACKUP & RESTORE LOGIC ---
  const handleBackup = () => {
    const fullState = {
      content,
      clients,
      users,
      messages,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toLocaleDateString('tr-TR').replace(/\./g, '_');
    link.href = url;
    link.download = `tilki_yedek_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('DİKKAT: Mevcut tüm veriler silinecek ve yedek dosyasındaki veriler yüklenecektir. Devam etmek istiyor musunuz?')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const restoredData = JSON.parse(event.target?.result as string);

        if (!restoredData.content || !restoredData.users) {
          throw new Error('Geçersiz yedek dosyası formatı.');
        }

        // State update with localStorage synchronization
        onUpdateContent(restoredData.content);
        onUpdateClients(restoredData.clients || []);
        onUpdateUsers(restoredData.users);
        onUpdateMessages(restoredData.messages || []);

        // Manual localstorage sync to be extra safe before reload
        localStorage.setItem('agencyos_content', JSON.stringify(restoredData.content));
        localStorage.setItem('agencyos_clients', JSON.stringify(restoredData.clients || []));
        localStorage.setItem('agencyos_users', JSON.stringify(restoredData.users));
        localStorage.setItem('agencyos_messages', JSON.stringify(restoredData.messages || []));

        alert('Sistem başarıyla geri yüklendi! Sayfa yenileniyor...');
        setTimeout(() => window.location.reload(), 500);
      } catch (err) {
        alert('Hata: Yedek dosyası yüklenemedi. Dosya bozuk veya geçersiz.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const renderHomeTab = () => (
    <div className="grid grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 pb-40">
      <div className="col-span-3 space-y-2">
        {[
          { id: 'HERO', label: 'HERO ALANI', icon: Sparkles },
          { id: 'VITRINE', label: 'HİZMET VİTRİNİ', icon: MousePointer2 },
          { id: 'FOOTER_TAGS', label: 'FOOTER SLOGANLARI', icon: Layout }
        ].map(st => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${subTab === st.id ? 'bg-[#0D1225] border-white/10 text-orange-500 shadow-xl' : 'bg-white/5 border-white/5 text-slate-600'}`}
          >
            {st.label} <st.icon size={14} />
          </button>
        ))}
      </div>
      <div className="col-span-9 bg-[#0D1225] p-10 rounded-[3rem] border border-white/10 space-y-8 min-h-[500px]">
        {subTab === 'HERO' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-3 gap-4">
              <InputField label="BAŞLIK SATIR 1" value={content.hero.titlePart1} onChange={(v: string) => updateNested('hero.titlePart1', v)} />
              <InputField label="BAŞLIK SATIR 2" value={content.hero.titlePart2} onChange={(v: string) => updateNested('hero.titlePart2', v)} />
              <InputField label="BAŞLIK SATIR 3" value={content.hero.titlePart3} onChange={(v: string) => updateNested('hero.titlePart3', v)} />
            </div>
            <InputField label="HERO ALT METNİ" type="textarea" value={content.hero.subtitle} onChange={(v: string) => updateNested('hero.subtitle', v)} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="ANA CTA BUTON" value={content.hero.primaryCTA} onChange={(v: string) => updateNested('hero.primaryCTA', v)} />
              <InputField label="İKİNCİL CTA BUTON" value={content.hero.secondaryCTA} onChange={(v: string) => updateNested('hero.secondaryCTA', v)} />
            </div>
          </div>
        )}
        {subTab === 'FOOTER_TAGS' && (
          <div className="space-y-6 animate-in fade-in">
            <InputField label="FOOTER TELİF METNİ" value={content.branding.footerText} onChange={(v: string) => updateNested('branding.footerText', v)} />
            <div className="grid grid-cols-3 gap-4">
              <InputField label="SLOGAN 1" value={content.branding.footerTagline1} onChange={(v: string) => updateNested('branding.footerTagline1', v)} />
              <InputField label="SLOGAN 2" value={content.branding.footerTagline2} onChange={(v: string) => updateNested('branding.footerTagline2', v)} />
              <InputField label="SLOGAN 3" value={content.branding.footerTagline3} onChange={(v: string) => updateNested('branding.footerTagline3', v)} />
            </div>
          </div>
        )}
        {subTab === 'VITRINE' && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hizmet Vitrini Ayarları</h4>
            <p className="text-[9px] text-slate-600 italic">* Anasayfada ilk 4 hizmet otomatik listelenir.</p>
            <div className="grid grid-cols-2 gap-4">
              {content.services.slice(0, 4).map(s => (
                <div key={s.id} className="p-4 bg-black/20 rounded-xl border border-white/5 text-[10px] font-black text-white uppercase">{s.title}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNavTab = () => (
    <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/10 space-y-6 max-w-4xl animate-in fade-in pb-40">
      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">MENÜ NAVİGASYONU</h4>
      <div className="space-y-3">
        {content.navigation.map((nav, idx) => (
          <div key={nav.id} className="bg-black/20 p-5 rounded-2xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-500"><Navigation size={18} /></div>
              <input
                value={nav.label}
                onChange={(e) => {
                  const newList = [...content.navigation];
                  newList[idx].label = e.target.value;
                  updateNested('navigation', newList);
                }}
                className="bg-transparent text-white font-black text-xs uppercase outline-none focus:border-b border-orange-500/30 flex-1"
              />
            </div>
            <button
              onClick={() => {
                const newList = [...content.navigation];
                newList[idx].isEnabled = !newList[idx].isEnabled;
                updateNested('navigation', newList);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${nav.isEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}
            >
              {nav.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />} {nav.isEnabled ? 'AÇIK' : 'KAPALI'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPagesTab = () => (
    <div className="grid grid-cols-12 gap-10 animate-in slide-in-from-right-4 pb-40">
      <div className="col-span-3 space-y-2">
        {[
          { id: 'SERVICES', label: 'HİZMETLER', icon: Sparkles },
          { id: 'REFERENCES', label: 'REFERANSLAR', icon: Star },
          { id: 'CORPORATE', label: 'KURUMSAL', icon: Info },
          { id: 'BLOG_PAGE', label: 'BLOG SAYFASI', icon: BookOpen },
          { id: 'CONTACT', label: 'İLETİŞİM', icon: Phone },
          { id: 'LEGAL_PAGES', label: 'YASAL & SEO', icon: Shield }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => { setSubTab(p.id); setEditingId(null); }}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${subTab === p.id ? 'bg-[#0D1225] border-white/10 text-orange-500 shadow-xl' : 'bg-white/5 border-white/5 text-slate-600'}`}
          >
            {p.label} <p.icon size={14} />
          </button>
        ))}
      </div>

      <div className="col-span-9 bg-[#0D1225] p-10 rounded-[3rem] border border-white/10 min-h-[600px] overflow-visible">
        {subTab === 'SERVICES' && (
          <div className="space-y-8 animate-in fade-in pb-20">
            {!editingId ? (
              <div className="grid grid-cols-2 gap-4">
                {content.services.map(s => (
                  <div key={s.id} onClick={() => setEditingId(s.id)} className="p-5 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-orange-500/30 transition-all">
                    <span className="text-[10px] font-black text-white uppercase">{s.title}</span>
                    <ChevronRight size={14} className="text-slate-700" />
                  </div>
                ))}
                <button onClick={() => {
                  const nId = `S_${Date.now()}`;
                  updateNested('services', [...content.services, { id: nId, title: 'YENİ HİZMET', tagline: 'Hizmet Alt Başlık', desc: 'Kısa özet...', iconType: 'Target', image: '', accent: '#f97316', features: [], detailedDesc: '', detailedImages: [] }]);
                  setEditingId(nId);
                }} className="p-5 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-600 flex items-center justify-center gap-2 hover:border-orange-500/30 transition-all">+ YENİ HİZMET EKLE</button>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 pb-40">
                <button onClick={() => setEditingId(null)} className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 hover:text-white transition-colors">← Geri</button>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <InputField label="HİZMET BAŞLIĞI" value={content.services.find(s => s.id === editingId)?.title} onChange={(v: string) => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, title: v.toUpperCase() } : s))} />
                    <InputField label="ALT BAŞLIK / TAGLINE" value={content.services.find(s => s.id === editingId)?.tagline} onChange={(v: string) => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, tagline: v } : s))} />
                  </div>
                  <Dropzone label="HİZMET KAPAK GÖRSELİ" currentImage={content.services.find(s => s.id === editingId)?.image} onUpload={(v: string) => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, image: v } : s))} />
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">İKON SEÇİCİ</label>
                  <div className="grid grid-cols-10 gap-2 bg-black/40 p-4 rounded-2xl border border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                    {RICH_ICONS.map(i => (
                      <button
                        key={i.id}
                        onClick={() => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, iconType: i.id } : s))}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-center ${content.services.find(s => s.id === editingId)?.iconType === i.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/40 border-white/5 text-slate-600 hover:text-white'}`}
                      >
                        <i.icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">HİZMET ÖZELLİKLERİ / TAGLAR</label>
                  <div className="flex flex-wrap gap-2 items-center bg-black/40 p-5 rounded-2xl border border-white/5 min-h-[70px]">
                    {content.services.find(s => s.id === editingId)?.features.map((feature, fIdx) => (
                      <span key={fIdx} className="bg-orange-600/20 text-orange-500 text-[9px] font-black px-4 py-2 rounded-xl flex items-center gap-3 border border-orange-500/20">
                        {feature}
                        <button onClick={() => {
                          const currentService = content.services.find(s => s.id === editingId);
                          if (currentService) {
                            const newFeatures = currentService.features.filter((_, i) => i !== fIdx);
                            updateNested('services', content.services.map(s => s.id === editingId ? { ...s, features: newFeatures } : s));
                          }
                        }} className="hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <div className="relative flex-1 min-w-[200px]">
                      <input
                        placeholder="YENİ ÖZELLİK EKLE + ENTER"
                        className="w-full bg-transparent border-none outline-none text-[10px] font-black uppercase text-white px-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            const currentService = content.services.find(s => s.id === editingId);
                            if (currentService) {
                              const newFeatures = [...currentService.features, e.currentTarget.value.trim().toUpperCase()];
                              updateNested('services', content.services.map(s => s.id === editingId ? { ...s, features: newFeatures } : s));
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <InputField label="KISA AÇIKLAMA (LİSTE EKRANI)" type="textarea" value={content.services.find(s => s.id === editingId)?.desc} onChange={(v: string) => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, desc: v } : s))} />
                  <InputField label="DETAYLI İÇERİK (HİZMET SAYFASI)" type="textarea" value={content.services.find(s => s.id === editingId)?.detailedDesc} onChange={(v: string) => updateNested('services', content.services.map(s => s.id === editingId ? { ...s, detailedDesc: v } : s))} />
                </div>

                <button onClick={() => { if (confirm('Bu hizmeti silmek istediğinize emin misiniz?')) { updateNested('services', content.services.filter(s => s.id !== editingId)); setEditingId(null); } }} className="text-rose-500 text-[9px] font-black uppercase tracking-widest hover:text-rose-400">HİZMETİ SİL</button>
              </div>
            )}
          </div>
        )}

        {subTab === 'REFERENCES' && (
          <div className="space-y-8 animate-in fade-in pb-40">
            {!editingId ? (
              <div className="grid grid-cols-3 gap-4">
                {content.references.items.map(r => (
                  <div key={r.id} onClick={() => setEditingId(r.id)} className="p-6 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center gap-3 cursor-pointer hover:border-orange-500/30 transition-all">
                    <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center shadow-lg">
                      {r.logo ? <img src={r.logo} className="w-full h-full object-contain" /> : <Star size={20} className="text-slate-300" />}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase truncate w-full text-center">{r.name}</span>
                  </div>
                ))}
                <button onClick={() => {
                  const nId = `R_${Date.now()}`;
                  updateNested('references.items', [...content.references.items, { id: nId, name: 'YENİ MARKA', logo: '', category: 'DİJİTAL', description: 'Marka özeti...', workImages: [], link: '#' }]);
                  setEditingId(nId);
                }} className="p-6 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-600 flex items-center justify-center gap-2 hover:border-orange-500/30 transition-all">+ MARKA EKLE</button>
              </div>
            ) : (
              <div className="space-y-8 animate-in zoom-in-95 pb-40">
                <button onClick={() => setEditingId(null)} className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 hover:text-white transition-colors">← Geri</button>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <InputField label="MARKA ADI" value={content.references.items.find(r => r.id === editingId)?.name} onChange={(v: string) => updateNested('references.items', content.references.items.map(r => r.id === editingId ? { ...r, name: v.toUpperCase() } : r))} />
                    <InputField label="KATEGORİ" value={content.references.items.find(r => r.id === editingId)?.category} onChange={(v: string) => updateNested('references.items', content.references.items.map(r => r.id === editingId ? { ...r, category: v.toUpperCase() } : r))} />
                  </div>
                  <Dropzone label="MARKA LOGOSU" aspect="aspect-square" currentImage={content.references.items.find(r => r.id === editingId)?.logo} onUpload={(v: string) => updateNested('references.items', content.references.items.map(r => r.id === editingId ? { ...r, logo: v } : r))} />
                </div>

                <InputField label="PROJE AÇIKLAMASI" type="textarea" value={content.references.items.find(r => r.id === editingId)?.description} onChange={(v: string) => updateNested('references.items', content.references.items.map(r => r.id === editingId ? { ...r, description: v } : r))} />

                <div className="space-y-6 pt-10 border-t border-white/5">
                  <div className="flex justify-between items-center px-1">
                    <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">İŞ GÖRSELLERİ (PORTFOLYO)</h5>
                    <label className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[9px] font-black cursor-pointer hover:bg-orange-500 shadow-lg">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleWorkImageUpload(e, editingId!)} />
                      + GÖRSEL EKLE
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {content.references.items.find(r => r.id === editingId)?.workImages?.map((img, idx) => (
                      <div key={idx} className="aspect-video rounded-xl overflow-hidden relative group border border-white/10 shadow-xl bg-black/40">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <button
                          onClick={() => updateNested('references.items', content.references.items.map(r => r.id === editingId ? { ...r, workImages: r.workImages.filter((_, i) => i !== idx) } : r))}
                          className="absolute inset-0 bg-rose-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => { if (confirm('Bu referansı silmek istediğinize emin misiniz?')) { updateNested('references.items', content.references.items.filter(r => r.id !== editingId)); setEditingId(null); } }} className="text-rose-500 text-[9px] font-black uppercase tracking-widest hover:text-rose-400 mt-10">REFERANSI SİL</button>
              </div>
            )}
          </div>
        )}

        {subTab === 'CORPORATE' && (
          <div className="space-y-12 animate-in fade-in pb-40">
            <div className="space-y-6">
              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">MANİFESTO SAYFASI</h5>
              <InputField label="BAŞLIK" value={content.corporate.manifesto.title} onChange={(v: string) => updateNested('corporate.manifesto.title', v)} />
              <InputField label="İÇERİK" type="textarea" value={content.corporate.manifesto.content} onChange={(v: string) => updateNested('corporate.manifesto.content', v)} />
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">İKON SEÇİCİ</label>
                <div className="grid grid-cols-5 gap-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                  {FOX_ICONS.map(f => (
                    <button
                      key={f}
                      onClick={() => updateNested('corporate.manifesto.icon', f)}
                      className={`p-4 rounded-xl border text-[8px] font-black transition-all ${content.corporate.manifesto.icon === f ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/40 border-transparent text-slate-600 hover:text-white'}`}
                    >
                      {f.replace('Fox', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6 pt-10 border-t border-white/5">
              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">HAKKIMIZDA SAYFASI</h5>
              <InputField label="BAŞLIK" value={content.corporate.about.title} onChange={(v: string) => updateNested('corporate.about.title', v)} />
              <InputField label="İÇERİK" type="textarea" value={content.corporate.about.content} onChange={(v: string) => updateNested('corporate.about.content', v)} />
            </div>
          </div>
        )}

        {subTab === 'BLOG_PAGE' && (
          <div className="space-y-6 animate-in fade-in pb-40">
            <InputField label="MAKALE ÜST BAŞLIK" value={content.blogPage?.topTitle} onChange={(v: string) => updateNested('blogPage.topTitle', v)} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="ANA BAŞLIK 1" value={content.blogPage?.mainTitle1} onChange={(v: string) => updateNested('blogPage.mainTitle1', v)} />
              <InputField label="ANA BAŞLIK 2" value={content.blogPage?.mainTitle2} onChange={(v: string) => updateNested('blogPage.mainTitle2', v)} />
            </div>
            <InputField label="GENEL AÇIKLAMA" type="textarea" value={content.blogPage?.description} onChange={(v: string) => updateNested('blogPage.description', v)} />
          </div>
        )}

        {subTab === 'CONTACT' && (
          <div className="space-y-8 animate-in fade-in pb-40">
            <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2">İLETİŞİM BİLGİLERİ</h5>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="E-POSTA" value={content.contact.email} onChange={(v: string) => updateNested('contact.email', v)} />
              <InputField label="TELEFON" value={content.contact.phone} onChange={(v: string) => updateNested('contact.phone', v)} />
            </div>
            <InputField label="ADRES" type="textarea" value={content.contact.address} onChange={(v: string) => updateNested('contact.address', v)} />
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
              {[
                { k: 'contact.showEmail', l: 'E-POSTA GÖSTER' },
                { k: 'contact.showPhone', l: 'TEL GÖSTER' },
                { k: 'contact.showAddress', l: 'ADRES GÖSTER' }
              ].map(item => (
                <button
                  key={item.k}
                  onClick={() => {
                    const keys = item.k.split('.');
                    updateNested(item.k, !(content.contact as any)[keys[1]]);
                  }}
                  className={`p-4 rounded-xl border text-[9px] font-black uppercase transition-all ${(content.contact as any)[item.k.split('.')[1]] ? 'bg-orange-600/10 border-orange-500/30 text-orange-500 shadow-xl' : 'bg-black/40 border-white/5 text-slate-700'}`}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {subTab === 'LEGAL_PAGES' && (
          <div className="space-y-12 animate-in fade-in pb-40">
            <div className="space-y-6">
              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-3">
                <Search size={16} /> GOOGLE & SEO AYARLARI
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="SİTE META BAŞLIĞI (TITLE)" value={content.seo.siteTitle} onChange={(v: string) => updateNested('seo.siteTitle', v)} />
                <InputField label="SİTE ANAHTAR KELİMELERİ" value={content.seo.metaKeywords} onChange={(v: string) => updateNested('seo.metaKeywords', v)} />
              </div>
              <InputField label="SİTE META AÇIKLAMASI (DESCRIPTION)" type="textarea" value={content.seo.siteDescription} onChange={(v: string) => updateNested('seo.siteDescription', v)} />
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h5 className="text-[11px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-3">
                <Shield size={16} /> KVKK AYDINLATMA METNİ
              </h5>
              <InputField label="METİN İÇERİĞİ" type="textarea" value={content.legal.kvkk} onChange={(v: string) => updateNested('legal.kvkk', v)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBrandingTab = () => (
    <div className="bg-[#0D1225] p-12 rounded-[4rem] border border-white/10 space-y-12 max-w-4xl animate-in fade-in shadow-2xl overflow-visible pb-40">
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-6">
          <Dropzone label="ANA LOGO (BEYAZ)" currentImage={content.branding.logoUrl} onUpload={(v: string) => updateNested('branding.logoUrl', v)} />
          <InputField label="SEO SİTE BAŞLIĞI" value={content.seo.siteTitle} onChange={(v: string) => updateNested('seo.siteTitle', v)} />
        </div>
        <div className="space-y-3">
          <InputField label="FOOTER TELİF METNİ" value={content.branding.footerText} onChange={(v: string) => updateNested('branding.footerText', v)} />
          <InputField label="SEO SİTE AÇIKLAMASI" type="textarea" value={content.seo.siteDescription} onChange={(v: string) => updateNested('seo.siteDescription', v)} />
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-8 pb-20">
        <div className="flex justify-between items-center">
          <h5 className="text-[11px] font-black uppercase text-orange-500 tracking-[0.4em]">SOSYAL MEDYA HESAPLARI</h5>
          <button onClick={() => {
            const newSocials = [...content.branding.socials, { platform: 'Instagram', url: 'https://' }];
            updateNested('branding.socials', newSocials);
          }} className="text-white bg-orange-600 px-6 py-2.5 rounded-xl text-[9px] font-black flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg">+ HESAP EKLE</button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {content.branding.socials.map((s, i) => {
            const CurrentIcon = SOCIAL_PLATFORMS_OPTIONS.find(opt => opt.id === s.platform)?.icon || Globe;
            return (
              <div key={i} className="flex gap-4 items-center bg-black/20 p-6 rounded-[2.5rem] border border-white/5 group relative shadow-inner">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/5 shrink-0">
                  <CurrentIcon size={20} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <select
                      value={s.platform}
                      onChange={(e) => {
                        const n = [...content.branding.socials];
                        n[i].platform = e.target.value;
                        updateNested('branding.socials', n);
                      }}
                      className="bg-[#050810] text-[10px] font-black text-orange-500 uppercase outline-none focus:text-white transition-colors cursor-pointer p-2 rounded-lg border border-white/5"
                    >
                      {SOCIAL_PLATFORMS_OPTIONS.map(opt => <option key={opt.id} value={opt.id} className="bg-slate-900">{opt.id}</option>)}
                    </select>
                    <button onClick={() => {
                      updateNested('branding.socials', content.branding.socials.filter((_, idx) => idx !== i));
                    }} className="text-rose-500/20 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <input
                    placeholder="Profil Linki..."
                    value={s.url}
                    onChange={(e) => {
                      const n = [...content.branding.socials]; n[i].url = e.target.value; updateNested('branding.socials', n);
                    }}
                    className="bg-transparent text-[10px] font-mono text-slate-500 w-full outline-none focus:text-indigo-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="bg-[#0D1225] p-12 rounded-[4rem] border border-white/10 space-y-12 max-w-4xl animate-in fade-in shadow-2xl pb-40">
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
          <Database className="text-orange-500" size={28} /> SİSTEM GÜVENLİĞİ VE YEDEKLEME
        </h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
          Tüm veritabanını, içerikleri, kullanıcıları ve mesajları yerel bir dosya olarak yedekleyebilir veya sistem çökmesi durumunda geri yükleyebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/20 p-8 rounded-[3rem] border border-white/5 space-y-6 group hover:border-orange-500/20 transition-all">
          <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
            <Download size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">VERİLERİ YEDEKLE</h4>
            <p className="text-[10px] font-bold text-slate-600 uppercase leading-relaxed">
              Mevcut sistemin tam bir kopyasını (JSON formatında) bilgisayarınıza indirir.
            </p>
          </div>
          <button
            onClick={handleBackup}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-xl shadow-orange-950/20"
          >
            YEDEĞİ ŞİMDİ AL <HardDriveDownload size={16} />
          </button>
        </div>

        <div className="bg-black/20 p-8 rounded-[3rem] border border-white/5 space-y-6 group hover:border-indigo-500/20 transition-all">
          <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
            <UploadCloud size={32} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">YEDEKTEN GERİ YÜKLE</h4>
            <p className="text-[10px] font-bold text-slate-600 uppercase leading-relaxed">
              Daha önce aldığınız bir yedek dosyasını seçerek sistemi o tarihe döndürür.
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              ref={restoreFileRef}
              className="hidden"
              accept=".json"
              onChange={handleRestore}
            />
            <button
              onClick={() => restoreFileRef.current?.click()}
              className="w-full bg-white/5 border border-white/10 hover:bg-indigo-600 hover:text-white text-indigo-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
            >
              YEDEK DOSYASI SEÇ <Database size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] flex items-start gap-6 animate-pulse">
        <AlertTriangle className="text-rose-500 shrink-0" size={24} />
        <div>
          <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">KRİTİK UYARI</h5>
          <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
            Geri yükleme işlemi, mevcut tüm verilerinizin üzerine yazacaktır. Bu işlem geri alınamaz.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 min-h-full flex flex-col">
      <header className="space-y-6 shrink-0">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">İçerik Stüdyosu</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">DİJİTAL VARLIK VE SİTE KONTROL MERKEZİ</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit shadow-2xl">
          {[
            { id: 'HOME', label: 'ANASAYFA', icon: Layout },
            { id: 'NAV', label: 'NAVİGASYON', icon: Navigation },
            { id: 'PAGES', label: 'SAYFALAR', icon: FileText },
            { id: 'BRANDING', label: 'KİMLİK & SOSYAL', icon: ImageIcon },
            { id: 'SYSTEM', label: 'SİSTEM', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSubTab(tab.id === 'HOME' ? 'HERO' : (tab.id === 'PAGES' ? 'SERVICES' : '')); setEditingId(null); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border ${activeTab === tab.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-transparent border-transparent text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-visible">
        {activeTab === 'HOME' && renderHomeTab()}
        {activeTab === 'NAV' && renderNavTab()}
        {activeTab === 'PAGES' && renderPagesTab()}
        {activeTab === 'BRANDING' && renderBrandingTab()}
        {activeTab === 'SYSTEM' && renderSystemTab()}
      </div>
    </div>
  );
};

export default AdminCMS;
