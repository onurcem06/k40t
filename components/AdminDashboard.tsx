
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, User, LogOut, Trash2, Briefcase, Layout, Save, Shield, BarChart4, DollarSign, Calendar, TrendingUp, Sparkles, Target, Share2, Clapperboard, Palette, Globe, Plus, MessageSquare, ToggleLeft, ToggleRight, Activity, ArrowRight, FileText, Settings, PenTool, BookOpen, ChevronRight, Mail, Phone, X, CheckCircle2
} from 'lucide-react';
import { UserRole, SiteContent, ClientProfile, UserAccount, MonthlyData, ContactMessage, ServiceItem, BlogPost, Task } from '../types.ts';

interface AdminDashboardProps {
  onLogout: () => void;
  siteContent: SiteContent;
  onUpdateContent: (content: SiteContent) => void;
  clients: ClientProfile[];
  onUpdateClients: (clients: ClientProfile[]) => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  messages: ContactMessage[];
  onUpdateMessages: (msgs: ContactMessage[]) => void;
}

const MONTHS = [
  { id: '01', name: 'Ocak' }, { id: '02', name: 'Şubat' }, { id: '03', name: 'Mart' },
  { id: '04', name: 'Nisan' }, { id: '05', name: 'Mayıs' }, { id: '06', name: 'Haziran' },
  { id: '07', name: 'Temmuz' }, { id: '08', name: 'Ağustos' }, { id: '09', name: 'Eylül' },
  { id: '10', name: 'Ekim' }, { id: '11', name: 'Kasım' }, { id: '12', name: 'Aralık' }
];

const YEARS = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, siteContent, onUpdateContent, clients, onUpdateClients, users, onUpdateUsers, tasks, onUpdateTasks, messages, onUpdateMessages
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CLIENTS' | 'CMS' | 'BLOG' | 'MESSAGES' | 'USERS' | 'SYSTEM'>('OVERVIEW');
  const [cmsSubTab, setCmsSubTab] = useState<'BRANDING' | 'HERO' | 'SERVICES' | 'CORPORATE' | 'LEGAL' | 'CONTACT'>('BRANDING');
  
  // Analiz Filtreleri
  const [filterYear, setFilterYear] = useState('2025');
  const [filterStartMonth, setFilterStartMonth] = useState('01');
  const [filterEndMonth, setFilterEndMonth] = useState('12');

  // Veri Giriş Filtreleri
  const [entryYear, setEntryYear] = useState('2025');
  const [entryMonth, setEntryMonth] = useState(new Date().toISOString().slice(5, 7));

  // Yerel State (Performans için)
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);
  const [localClients, setLocalClients] = useState<ClientProfile[]>(clients);
  const [localUsers, setLocalUsers] = useState<UserAccount[]>(users);
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id || null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null);

  useEffect(() => {
    setEditContent(siteContent);
    setLocalClients(clients);
    setLocalUsers(users);
  }, [siteContent, clients, users]);

  const handleSaveAll = () => {
    onUpdateContent(editContent);
    onUpdateClients(localClients);
    onUpdateUsers(localUsers);
    alert('Sistem başarıyla güncellendi. Tüm değişiklikler portal genelinde yayında.');
  };

  const updateNestedContent = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = JSON.parse(JSON.stringify(editContent));
    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEditContent(newContent);
  };

  // --- ANALİZ HESAPLAMALARI ---
  const stats = useMemo(() => {
    let spend = 0, revenue = 0, roasSum = 0, count = 0;
    const chartPoints: number[] = [];
    
    localClients.forEach(c => {
      Object.entries(c.monthlyHistory).forEach(([key, val]) => {
        const [y, m] = key.split('-');
        if (y === filterYear && m >= filterStartMonth && m <= filterEndMonth) {
          const data = val as MonthlyData;
          spend += parseInt(String(data.spend).replace(/\D/g, '') || '0');
          revenue += parseInt(String(data.agencyRevenue).replace(/\D/g, '') || '0');
          const r = parseFloat(String(data.roas).replace('x', ''));
          if (r > 0) { roasSum += r; count++; chartPoints.push(r); }
        }
      });
    });

    return { 
      spend: `₺${spend.toLocaleString('tr-TR')}`, 
      revenue: `₺${revenue.toLocaleString('tr-TR')}`, 
      roas: count > 0 ? `${(roasSum / count).toFixed(2)}x` : '0x',
      points: chartPoints.slice(-12)
    };
  }, [localClients, filterYear, filterStartMonth, filterEndMonth]);

  // --- MARKA İŞLEMLERİ ---
  const currentClient = localClients.find(c => c.id === selectedClientId);
  const currentMonthKey = `${entryYear}-${entryMonth}`;
  const currentMonthData = currentClient?.monthlyHistory[currentMonthKey] || {
    spend: '₺0', roas: '0x', visits: '0', agencyRevenue: '₺0',
    plan: { targetPosts: 0, completedPosts: 0, targetVideos: 0, completedVideos: 0, currentAdsBudget: '₺0', status: 'Hazırlanıyor', totalViews: '0' }
  };

  const updateClientValue = (path: string, value: any) => {
    if (!selectedClientId) return;
    setLocalClients(localClients.map(c => {
      if (c.id !== selectedClientId) return c;
      const history = { ...c.monthlyHistory };
      const current = JSON.parse(JSON.stringify(currentMonthData));
      const keys = path.split('.');
      let obj = current;
      for(let i=0; i<keys.length-1; i++) obj = obj[keys[i]];
      obj[keys[keys.length-1]] = value;
      history[currentMonthKey] = current;
      return { ...c, monthlyHistory: history };
    }));
  };

  // --- BLOG İŞLEMLERİ ---
  const addBlogPost = () => {
    const newId = `blog_${Date.now()}`;
    // Fixed: Added missing property 'blocks' to satisfy the BlogPost interface.
    const newPost: BlogPost = { 
      id: newId, 
      title: 'YENİ YAZI', 
      excerpt: 'Özet...', 
      blocks: [], // blocks property added here
      content: 'İçerik...', 
      author: 'Admin', 
      date: new Date().toISOString().split('T')[0], 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 
      category: 'GENEL',
      readTime: '0 dk',
      tags: []
    };
    updateNestedContent('blogPosts', [...editContent.blogPosts, newPost]);
    setEditingBlogPostId(newId);
  };

  return (
    <div className="flex h-screen bg-[#050810] text-slate-200 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-white/5 bg-[#080B14] flex flex-col h-full shrink-0">
        <div className="p-10 border-b border-white/5 flex flex-col items-center gap-4">
          <img src={editContent.branding.logoUrl} className="h-16 w-auto object-contain" alt="Logo" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-orange-500">ADMIN CONTROL</span>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar pt-8">
          {[
            { id: 'OVERVIEW', icon: BarChart4, label: 'PERFORMANS' },
            { id: 'CLIENTS', icon: Briefcase, label: 'MARKALAR' },
            { id: 'CMS', icon: Layout, label: 'İÇERİK (CMS)' },
            { id: 'BLOG', icon: PenTool, label: 'BLOG' },
            { id: 'MESSAGES', icon: MessageSquare, label: 'MESAJLAR' },
            { id: 'USERS', icon: Shield, label: 'YETKİLER' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button onClick={handleSaveAll} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg">
             <Save size={14} /> TÜMÜNÜ KAYDET
          </button>
          <button onClick={onLogout} className="w-full bg-rose-500/10 text-rose-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
             <LogOut size={14} /> ÇIKIŞ
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-12 bg-black/20 custom-scrollbar relative">
        
        {/* 1. PERFORMANS ANALİZİ */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter">AJANS PERFORMANS ANALİZİ</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">10 YILLIK DİNAMİK VERİ PROJEKSİYONU</p>
                </div>
                <div className="flex items-center gap-4 bg-[#0D1225] border border-white/10 p-2 rounded-2xl">
                   <select value={filterYear} onChange={(e)=>setFilterYear(e.target.value)} className="bg-transparent text-[10px] font-black text-white outline-none px-4 border-r border-white/5 cursor-pointer">
                      {YEARS.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                   </select>
                   <div className="flex items-center gap-2 px-4">
                      <select value={filterStartMonth} onChange={(e)=>setFilterStartMonth(e.target.value)} className="bg-transparent text-[10px] font-black text-white outline-none cursor-pointer">
                         {MONTHS.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
                      </select>
                      <ChevronRight size={14} className="text-slate-700" />
                      <select value={filterEndMonth} onChange={(e)=>setFilterEndMonth(e.target.value)} className="bg-transparent text-[10px] font-black text-white outline-none cursor-pointer">
                         {MONTHS.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
                      </select>
                   </div>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0D1225] p-10 rounded-[2.5rem] border border-white/5 space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TOPLAM HARCAMA</p>
                   <h3 className="text-3xl font-black text-white">{stats.spend}</h3>
                </div>
                <div className="bg-[#0D1225] p-10 rounded-[2.5rem] border border-white/5 space-y-3">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ORTALAMA ROAS</p>
                   <h3 className="text-3xl font-black text-emerald-500">{stats.roas}</h3>
                </div>
                <div className="bg-[#0D1225] p-10 rounded-[2.5rem] border border-white/5 space-y-3 border-orange-500/20">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AJANS HAKEDİŞ</p>
                   <h3 className="text-3xl font-black text-orange-400">{stats.revenue}</h3>
                </div>
             </div>

             <div className="bg-[#0D1225] border border-white/5 p-12 rounded-[4rem] relative overflow-hidden group">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-3"><Activity size={18} className="text-orange-500" /> PERFORMANS TRENDİ</h4>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">ROAS VERİ NOKTALARI</span>
                </div>
                <div className="h-64 w-full flex items-end gap-3 px-2">
                   {stats.points.length > 0 ? stats.points.map((p, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-xl relative group/bar hover:bg-orange-500/20 transition-all border-t border-white/10" style={{ height: `${Math.min(p * 10, 100)}%` }}>
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[10px] font-black text-orange-500 bg-black/40 px-3 py-1.5 rounded-lg border border-orange-500/20">{p}x</div>
                      </div>
                   )) : (
                     <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20 text-center">
                        <TrendingUp size={48} className="mb-4" />
                        <p className="font-black text-[10px] uppercase">Seçili dönemde veri bulunamadı</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* 2. MARKA YÖNETİMİ */}
        {activeTab === 'CLIENTS' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <header className="flex justify-between items-center border-b border-white/5 pb-8">
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter">MARKA MERKEZİ</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">DİNAMİK VERİ GİRİŞİ VE GÖRÜNÜRLÜK</p>
                </div>
                <div className="flex gap-4">
                   <select value={selectedClientId || ''} onChange={(e)=>setSelectedClientId(e.target.value)} className="bg-[#0D1225] border border-white/10 text-[11px] font-black text-white px-8 py-3 rounded-2xl outline-none cursor-pointer">
                      {localClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                   <button onClick={()=>{ /* addClient function */ }} className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">+ YENİ MARKA</button>
                </div>
             </header>

             {currentClient && (
                <div className="grid grid-cols-12 gap-10">
                   <div className="col-span-8 space-y-8">
                      <div className="bg-[#0D1225] border border-white/10 p-10 rounded-[3rem] space-y-10">
                         <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h4 className="text-[11px] font-black uppercase text-orange-500 tracking-widest">AYLIK VERİ GİRİŞİ</h4>
                            <div className="flex gap-4">
                               <select value={entryYear} onChange={(e)=>setEntryYear(e.target.value)} className="bg-black/40 text-[10px] font-black text-white p-2.5 rounded-xl outline-none border border-white/5">
                                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                               </select>
                               <select value={entryMonth} onChange={(e)=>setEntryMonth(e.target.value)} className="bg-black/40 text-[10px] font-black text-white p-2.5 rounded-xl outline-none border border-white/5">
                                  {MONTHS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">HARCAMA (₺)</label>
                               <input value={currentMonthData.spend} onChange={(e)=>updateClientValue('spend', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ROAS</label>
                               <input value={currentMonthData.roas} onChange={(e)=>updateClientValue('roas', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-emerald-500 font-black" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">AJANS HAKEDİŞ (₺)</label>
                               <input value={currentMonthData.agencyRevenue} onChange={(e)=>updateClientValue('agencyRevenue', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-orange-500 font-black" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TOPLAM ERİŞİM</label>
                               <input value={currentMonthData.plan.totalViews} onChange={(e)=>updateClientValue('plan.totalViews', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black" />
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="col-span-4 space-y-6">
                      <div className="bg-[#0D1225] border border-white/10 p-8 rounded-[3rem] space-y-6">
                         <h4 className="text-[11px] font-black uppercase text-orange-500 tracking-widest border-b border-white/5 pb-4">PANEL KONTROLÜ</h4>
                         <div className="space-y-4">
                            {(Object.keys(currentClient.visibility) as (keyof typeof currentClient.visibility)[]).map(key => (
                               <div key={key} onClick={() => {
                                  setLocalClients(localClients.map(c => c.id === selectedClientId ? { ...c, visibility: { ...c.visibility, [key]: !c.visibility[key] } } : c));
                               }} className="flex items-center justify-between cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-all">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{String(key).replace('show', '')}</span>
                                  {currentClient.visibility[key] ? <ToggleRight className="text-orange-500" /> : <ToggleLeft className="text-slate-700" />}
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* 3. CMS (SERVICES & SOCIALS) */}
        {activeTab === 'CMS' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <header className="flex justify-between items-center border-b border-white/5 pb-8">
                <div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter">İÇERİK YÖNETİMİ</h2>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">HİZMET KARTLARI VE MARKA KİMLİĞİ</p>
                </div>
                <div className="flex gap-2 bg-[#0D1225] p-2 rounded-2xl border border-white/10 overflow-x-auto">
                   {['BRANDING', 'HERO', 'SERVICES', 'CORPORATE', 'LEGAL', 'CONTACT'].map(t => (
                      <button key={t} onClick={()=>setCmsSubTab(t as any)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${cmsSubTab === t ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                   ))}
                </div>
             </header>

             {cmsSubTab === 'SERVICES' && (
                <div className="grid grid-cols-12 gap-10">
                   <div className="col-span-4 space-y-4">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-widest">HİZMET LİSTESİ</h3>
                         <button onClick={()=>{
                            const newId = `S_${Date.now()}`;
                            const newS = { id: newId, title: 'YENİ HİZMET', tagline: 'Alt Başlık', desc: 'Açıklama...', iconType: 'Target', image: '', accent: '', features: [], detailedDesc: '', detailedImages: [] };
                            updateNestedContent('services', [...editContent.services, newS]);
                         }} className="text-orange-500 hover:text-white transition-colors"><Plus size={18}/></button>
                      </div>
                      <div className="space-y-3">
                         {editContent.services.map(s => (
                            <div key={s.id} onClick={() => setEditingServiceId(s.id)} className={`p-5 rounded-3xl cursor-pointer border transition-all flex justify-between items-center ${editingServiceId === s.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>
                               <p className="text-[10px] font-black uppercase tracking-widest truncate">{s.title}</p>
                               <button onClick={(e)=>{ e.stopPropagation(); updateNestedContent('services', editContent.services.filter(x=>x.id!==s.id)); }} className="text-rose-500/50 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="col-span-8">
                      {editingServiceId ? (
                         <div className="bg-[#0D1225] p-12 rounded-[4rem] border border-white/10 space-y-8 animate-in zoom-in-95">
                            <div className="grid grid-cols-2 gap-8">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BAŞLIK</label>
                                  <input value={editContent.services.find(s=>s.id===editingServiceId)?.title} onChange={(e)=>{
                                     const list = editContent.services.map(s => s.id === editingServiceId ? { ...s, title: e.target.value } : s);
                                     updateNestedContent('services', list);
                                  }} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ALT BAŞLIK</label>
                                  <input value={editContent.services.find(s=>s.id===editingServiceId)?.tagline} onChange={(e)=>{
                                     const list = editContent.services.map(s => s.id === editingServiceId ? { ...s, tagline: e.target.value } : s);
                                     updateNestedContent('services', list);
                                  }} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AÇIKLAMA</label>
                               <textarea value={editContent.services.find(s=>s.id===editingServiceId)?.desc} onChange={(e)=>{
                                  const list = editContent.services.map(s => s.id === editingServiceId ? { ...s, desc: e.target.value } : s);
                                  updateNestedContent('services', list);
                               }} className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl text-slate-300 h-32 leading-relaxed" />
                            </div>
                         </div>
                      ) : (
                         <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center opacity-20">
                            <Palette size={48} className="mb-4 text-orange-500" />
                            <p className="font-black text-[10px] uppercase tracking-widest">Düzenlemek için bir hizmet seçin</p>
                         </div>
                      )}
                   </div>
                </div>
             )}

             {cmsSubTab === 'BRANDING' && (
                <div className="bg-[#0D1225] p-12 rounded-[4rem] border border-white/10 space-y-12 max-w-4xl">
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LOGO URL</label>
                         <input value={editContent.branding.logoUrl} onChange={(e)=>updateNestedContent('branding.logoUrl', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-mono text-xs" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ALT BİLGİ METNİ</label>
                         <input value={editContent.branding.footerText} onChange={(e)=>updateNestedContent('branding.footerText', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black" />
                      </div>
                   </div>
                   
                   <div className="pt-8 border-t border-white/5 space-y-8">
                      <div className="flex justify-between items-center">
                         <h5 className="text-[11px] font-black uppercase text-orange-500 tracking-[0.4em]">SOSYAL MEDYA HESAPLARI</h5>
                         <button onClick={() => {
                            const newSocials = [...editContent.branding.socials, { platform: 'Instagram', url: 'https://' }];
                            updateNestedContent('branding.socials', newSocials);
                         }} className="text-white bg-orange-600 px-6 py-2.5 rounded-xl text-[9px] font-black flex items-center gap-2 hover:bg-orange-500 transition-all">+ HESAP EKLE</button>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         {editContent.branding.socials.map((s, i) => (
                            <div key={i} className="flex gap-4 items-end bg-black/20 p-6 rounded-[2.5rem] border border-white/5 group relative">
                               <div className="flex-1 space-y-3">
                                  <div className="flex justify-between items-center">
                                     <input value={s.platform} onChange={(e) => {
                                        const n = [...editContent.branding.socials]; n[i].platform = e.target.value; updateNestedContent('branding.socials', n);
                                     }} className="bg-transparent text-[10px] font-black text-orange-500 uppercase outline-none focus:text-white transition-colors" />
                                     <button onClick={() => {
                                        updateNestedContent('branding.socials', editContent.branding.socials.filter((_, idx)=>idx!==i));
                                     }} className="text-rose-500/20 hover:text-rose-500 transition-colors"><X size={14}/></button>
                                  </div>
                                  <input value={s.url} onChange={(e) => {
                                     const n = [...editContent.branding.socials]; n[i].url = e.target.value; updateNestedContent('branding.socials', n);
                                  }} className="bg-transparent text-[10px] font-mono text-slate-500 w-full outline-none focus:text-indigo-400" />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* 4. BLOG YÖNETİMİ */}
        {activeTab === 'BLOG' && (
           <div className="space-y-10 animate-in fade-in duration-500">
              <header className="flex justify-between items-center border-b border-white/5 pb-8">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">BLOG MERKEZİ</h2>
                 <button onClick={addBlogPost} className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">+ YENİ YAZI</button>
              </header>
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-4 space-y-3">
                   {editContent.blogPosts.map(p => (
                      <div key={p.id} onClick={()=>setEditingBlogPostId(p.id)} className={`p-5 rounded-3xl cursor-pointer border transition-all ${editingBlogPostId === p.id ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>
                         <p className="text-[10px] font-black uppercase tracking-tight truncate">{p.title}</p>
                         <p className="text-[8px] opacity-60 mt-1 uppercase">{p.date}</p>
                      </div>
                   ))}
                </div>
                <div className="col-span-8">
                   {editingBlogPostId ? (
                      <div className="bg-[#0D1225] p-12 rounded-[4rem] border border-white/10 space-y-6">
                         <input value={editContent.blogPosts.find(p=>p.id===editingBlogPostId)?.title} onChange={(e)=>{
                            updateNestedContent('blogPosts', editContent.blogPosts.map(p=>p.id===editingBlogPostId ? {...p, title: e.target.value} : p));
                         }} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black uppercase tracking-tight text-xl" />
                         <textarea value={editContent.blogPosts.find(p=>p.id===editingBlogPostId)?.content} onChange={(e)=>{
                            updateNestedContent('blogPosts', editContent.blogPosts.map(p=>p.id===editingBlogPostId ? {...p, content: e.target.value} : p));
                         }} className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl text-slate-300 h-64 leading-relaxed outline-none" />
                         <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <button onClick={()=>updateNestedContent('blogPosts', editContent.blogPosts.filter(p=>p.id!==editingBlogPostId))} className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Yazıyı Sil</button>
                         </div>
                      </div>
                   ) : <div className="h-64 border-2 border-dashed border-white/5 rounded-[4rem] flex items-center justify-center opacity-20"><BookOpen size={48}/></div>}
                </div>
              </div>
           </div>
        )}

        {/* 5. MESAJLAR */}
        {activeTab === 'MESSAGES' && (
           <div className="space-y-10 animate-in fade-in duration-500">
              <header className="border-b border-white/5 pb-8">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">GELEN MESAJLAR</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">({messages.length}) YENİ İLETİŞİM TALEBİ</p>
              </header>
              <div className="grid grid-cols-1 gap-6">
                 {messages.map(msg => (
                    <div key={msg.id} className="bg-[#0D1225] border border-white/10 p-10 rounded-[3rem] group relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
                       <div className="flex flex-col md:flex-row justify-between gap-10">
                          <div className="space-y-4 flex-1">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-400 border border-white/5"><User size={24} /></div>
                                <div>
                                   <h4 className="text-xl font-black text-white uppercase tracking-tight">{msg.name}</h4>
                                   <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                                      <span className="flex items-center gap-1.5"><Mail size={12} className="text-orange-500"/> {msg.email}</span>
                                      <span className="flex items-center gap-1.5"><Phone size={12} className="text-orange-500"/> {msg.phone}</span>
                                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-orange-500"/> {new Date(msg.date).toLocaleDateString()}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 text-slate-300 text-sm leading-relaxed shadow-inner italic">
                                "{msg.message}"
                             </div>
                          </div>
                          <button onClick={() => onUpdateMessages(messages.filter(m=>m.id!==msg.id))} className="self-start text-rose-500/20 hover:text-rose-500 transition-colors p-4"><Trash2 size={24} /></button>
                       </div>
                    </div>
                 ))}
                 {messages.length === 0 && <p className="text-center py-20 text-slate-600 font-black uppercase tracking-widest text-xs opacity-30">Okunmamış mesaj bulunamadı.</p>}
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
