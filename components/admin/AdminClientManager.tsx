
import React, { useState, useRef } from 'react';
import { ToggleLeft, ToggleRight, Plus, Trash2, Layout, Image as ImageIcon, X, Check, Upload, Settings, DollarSign, Activity, UploadCloud, Target, TrendingUp, RefreshCw, Facebook, Info, ChevronRight, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { ClientProfile, MonthlyData, MetaCampaign } from '../../types.ts';

interface AdminClientManagerProps {
  clients: ClientProfile[];
  onUpdateClients: (c: ClientProfile[]) => void;
}

const AdminClientManager: React.FC<AdminClientManagerProps> = ({ clients, onUpdateClients }) => {
  const [selectedId, setSelectedId] = useState(clients[0]?.id || null);
  const [entryYear, setEntryYear] = useState('2025');
  const [entryMonth, setEntryMonth] = useState('01');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  const current = clients.find(c => c.id === selectedId);
  const monthKey = `${entryYear}-${entryMonth}`;
  const monthData = current?.monthlyHistory[monthKey] || {
    spend: '₺0', roas: '0x', visits: '0', agencyRevenue: '₺0',
    plan: { targetPosts: 12, completedPosts: 0, targetVideos: 4, completedVideos: 0, status: 'Yayında', totalViews: '0', currentAdsBudget: '₺0' },
    metaData: []
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    const newId = `c_${Date.now()}`;
    const newClient: ClientProfile = {
      id: newId,
      name: newClientName.toUpperCase(),
      logo: '',
      visibility: { showSpend: true, showRoas: true, showVisits: true, showPlan: true, showAssets: true, showBudget: true },
      assets: [],
      monthlyHistory: {
        "2025-01": {
          spend: '₺0', roas: '0x', visits: '0', agencyRevenue: '₺0',
          plan: { targetPosts: 12, completedPosts: 0, targetVideos: 4, completedVideos: 0, status: 'Yayında', totalViews: '0', currentAdsBudget: '₺0' },
          metaData: []
        }
      }
    };
    onUpdateClients([...clients, newClient]);
    setSelectedId(newId);
    setShowAddModal(false);
    setNewClientName('');
  };

  const updateClient = (updates: Partial<ClientProfile>) => {
    onUpdateClients(clients.map(c => c.id === selectedId ? { ...c, ...updates } : c));
  };

  const updateMonthly = (field: string, value: any) => {
    if (!current) return;
    const history = { ...current.monthlyHistory };
    const month = JSON.parse(JSON.stringify(monthData));
    
    const keys = field.split('.');
    if (keys.length > 1) {
      let obj = month;
      for(let i=0; i<keys.length-1; i++) obj = obj[keys[i]];
      obj[keys[keys.length-1]] = value;
    } else {
      month[field] = value;
    }

    history[monthKey] = month;
    updateClient({ monthlyHistory: history });
  };

  // --- GERÇEK META API FETCH FONKSİYONU ---
  const fetchMetaData = async () => {
    if (!current || !current.metaSettings?.accessToken || !current.metaSettings?.adAccountId) {
      alert("Lütfen önce Meta API ayarlarına (Token ve Hesap ID) girin.");
      setShowApiSettings(true);
      return;
    }

    setIsFetchingMeta(true);
    
    try {
      const { accessToken, adAccountId } = current.metaSettings;
      const firstDay = `${entryYear}-${entryMonth}-01`;
      const lastDay = new Date(parseInt(entryYear), parseInt(entryMonth), 0).toISOString().split('T')[0];

      // act_ eklemesi kontrolü
      const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

      // Meta Graph API URL (v19.0)
      const url = `https://graph.facebook.com/v19.0/${formattedAccountId}/insights?` + 
        new URLSearchParams({
          access_token: accessToken,
          level: 'campaign',
          fields: 'campaign_name,spend,impressions,inline_link_clicks,actions,ctr,cpc,objective',
          time_range: JSON.stringify({ since: firstDay, until: lastDay }),
          limit: '100'
        });

      const response = await fetch(url);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Meta verisini kampanya modeline dönüştür
      const mappedData: MetaCampaign[] = result.data.map((item: any) => {
        // Dönüşümleri actions dizisinden bul (Purchase veya Lead gibi ana hedefler)
        const conversions = item.actions?.find((a: any) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase' || a.action_type === 'lead')?.value || 0;

        return {
          id: item.campaign_id || Math.random().toString(36),
          name: item.campaign_name || 'İsimsiz Kampanya',
          status: 'ACTIVE',
          spend: parseFloat(item.spend || 0),
          impressions: parseInt(item.impressions || 0),
          clicks: parseInt(item.inline_link_clicks || 0),
          conversions: parseInt(conversions),
          ctr: parseFloat(item.ctr || 0) * 100,
          cpc: parseFloat(item.cpc || 0)
        };
      });

      updateMonthly('metaData', mappedData);
      
      // Toplamları otomatik güncelle
      const totalSpend = mappedData.reduce((acc, c) => acc + c.spend, 0);
      const totalReach = mappedData.reduce((acc, c) => acc + c.impressions, 0);
      
      updateMonthly('spend', `₺${totalSpend.toLocaleString('tr-TR')}`);
      updateMonthly('plan.totalViews', totalReach.toLocaleString('tr-TR'));
      
      alert(`Başarılı! ${mappedData.length} kampanya verisi çekildi.`);
    } catch (error: any) {
      console.error("Meta API error:", error);
      alert("Meta verileri çekilemedi: " + error.message);
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleFile = (file: File, callback: (base64: string) => void) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const LogoDropzone = ({ currentLogo, onUpload }: { currentLogo?: string, onUpload: (b64: string) => void }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    return (
      <div 
        onClick={() => fileRef.current?.click()}
        className={`w-full aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group border-white/10 bg-black/40 hover:border-white/20`}
      >
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file, onUpload);
        }} />
        {currentLogo ? (
          <>
            <img src={currentLogo} className="h-full w-auto max-w-[80%] object-contain p-4 group-hover:scale-105 transition-transform" alt="Logo" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <UploadCloud size={24} className="text-white mb-2" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">LOGO DEĞİŞTİR</span>
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="text-slate-700 mb-4" size={32} />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">LOGO YÜKLE</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">MARKA MERKEZİ</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">DİNAMİK VERİ GİRİŞİ VE KPI KONTROLÜ</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <select value={selectedId || ''} onChange={(e)=>setSelectedId(e.target.value)} className="bg-[#0D1225] border border-white/10 text-[11px] font-black text-white px-8 py-3 rounded-2xl outline-none cursor-pointer">
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
           <button onClick={() => setShowAddModal(true)} className="bg-orange-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl flex items-center gap-2">
             <Plus size={14}/> YENİ MARKA
           </button>
        </div>
      </header>

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0D1225] border border-white/10 p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
             <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Marka Ekle</h4>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">MARKA ADI</label>
                   <input 
                     autoFocus
                     value={newClientName} 
                     onChange={(e)=>setNewClientName(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && handleAddClient()}
                     placeholder="Örn: BSH TÜRKİYE" 
                     className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white font-black outline-none focus:border-orange-500/50" 
                   />
                </div>
                <div className="flex gap-4">
                   <button onClick={handleAddClient} className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">OLUŞTUR</button>
                   <button onClick={() => setShowAddModal(false)} className="flex-1 bg-white/5 text-slate-400 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">İPTAL</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {current ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* AY SEÇİCİ VE TEMEL VERİLER */}
            <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/10 space-y-10 shadow-2xl">
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="text-xs font-black uppercase text-orange-500 tracking-widest flex items-center gap-3"><TrendingUp size={18}/> PERFORMANS ÖZETİ</h3>
                  <div className="flex gap-3">
                     <select value={entryYear} onChange={(e)=>setEntryYear(e.target.value)} className="bg-black/40 border border-white/5 text-[10px] font-black text-white p-2.5 rounded-xl outline-none">
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                     </select>
                     <select value={entryMonth} onChange={(e)=>setEntryMonth(e.target.value)} className="bg-black/40 border border-white/5 text-[10px] font-black text-white p-2.5 rounded-xl outline-none">
                        {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TOPLAM HARCAMA (₺)</label>
                     <input value={monthData.spend} onChange={(e)=>updateMonthly('spend', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">GERÇEKLEŞEN ROAS</label>
                     <input value={monthData.roas} onChange={(e)=>updateMonthly('roas', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-emerald-500 font-black outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">AJANS HAKEDİŞİ (₺)</label>
                     <input value={monthData.agencyRevenue} onChange={(e)=>updateMonthly('agencyRevenue', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-orange-500 font-black outline-none focus:border-orange-500/50" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">TOPLAM ERİŞİM / GÖRÜNTÜLEME</label>
                     <input value={monthData.plan.totalViews} onChange={(e)=>updateMonthly('plan.totalViews', e.target.value)} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black outline-none focus:border-orange-500/50" />
                  </div>
               </div>
            </div>

            {/* META ADS VERİ MERKEZİ */}
            <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-blue-500/20 space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Facebook size={120} className="text-blue-500" />
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                  <div>
                    <h3 className="text-xs font-black uppercase text-blue-400 tracking-widest flex items-center gap-3">
                      <Facebook size={18}/> META ADS VERİ MERKEZİ
                    </h3>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">GERÇEK ZAMANLI GRAPH API ENTEGRASYONU</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowApiSettings(!showApiSettings)}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10"
                    >
                      <Settings size={14} /> API AYARLARI
                    </button>
                    <button 
                      onClick={fetchMetaData}
                      disabled={isFetchingMeta}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
                    >
                      {isFetchingMeta ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
                      {isFetchingMeta ? 'ÇEKİLİYOR...' : 'VERİLERİ SENKRONİZE ET'}
                    </button>
                  </div>
               </div>

               {showApiSettings && (
                 <div className="bg-black/40 p-8 rounded-3xl border border-blue-500/20 space-y-6 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                       <Key size={16} />
                       <h5 className="text-[10px] font-black uppercase">META GRAPH API KİMLİK BİLGİLERİ</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-500 uppercase">ACCESS TOKEN (SYSTEM USER)</label>
                          <input 
                            type="password"
                            value={current.metaSettings?.accessToken || ''} 
                            onChange={(e) => updateClient({ metaSettings: { ...current.metaSettings!, accessToken: e.target.value, adAccountId: current.metaSettings?.adAccountId || '' } })}
                            placeholder="EAA..."
                            className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-white font-mono text-[10px] outline-none focus:border-blue-500/50"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-black text-slate-500 uppercase">AD ACCOUNT ID</label>
                          <input 
                            value={current.metaSettings?.adAccountId || ''} 
                            onChange={(e) => updateClient({ metaSettings: { ...current.metaSettings!, adAccountId: e.target.value, accessToken: current.metaSettings?.accessToken || '' } })}
                            placeholder="act_..."
                            className="w-full bg-black/60 border border-white/10 p-4 rounded-xl text-white font-mono text-[10px] outline-none focus:border-blue-500/50"
                          />
                       </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                       <ShieldCheck size={14} className="text-blue-500" />
                       <p className="text-[8px] font-bold text-slate-500 uppercase">Bu bilgiler şifrelenmiş olarak yerel tarayıcı hafızasında saklanır.</p>
                    </div>
                 </div>
               )}

               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">KAMPANYA ADI</th>
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">DURUM</th>
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">HARCAMA</th>
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">ERİŞİM</th>
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">CTR</th>
                        <th className="py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">SONUÇ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {monthData.metaData && monthData.metaData.length > 0 ? monthData.metaData.map((camp: MetaCampaign) => (
                        <tr key={camp.id} className="group/row hover:bg-white/5 transition-colors">
                          <td className="py-4 pr-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover/row:text-blue-400 transition-colors">{camp.name}</p>
                            <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">ID: {camp.id}</p>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${camp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                              <span className={`w-1 h-1 rounded-full ${camp.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                              {camp.status === 'ACTIVE' ? 'AKTİF' : 'DURDU'}
                            </span>
                          </td>
                          <td className="py-4 text-[10px] font-bold text-slate-300">₺{camp.spend.toLocaleString('tr-TR')}</td>
                          <td className="py-4 text-[10px] font-bold text-slate-300">{camp.impressions.toLocaleString('tr-TR')}</td>
                          <td className="py-4 text-[10px] font-black text-blue-400 text-center">%{camp.ctr.toFixed(2)}</td>
                          <td className="py-4 text-right">
                             <p className="text-[10px] font-black text-white">{camp.conversions}</p>
                             <p className="text-[8px] font-bold text-slate-600 uppercase">DÖNÜŞÜM</p>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4 opacity-20">
                               <Facebook size={40} />
                               <p className="text-[9px] font-black uppercase tracking-[0.4em]">VERİLERİ ÇEKMEK İÇİN SENKRONİZE EDİN</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
               
               {monthData.metaData && monthData.metaData.length > 0 && (
                 <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Check size={12} className="text-emerald-500" />
                       <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
                          VERİLER META ADS API ÜZERİNDEN DOĞRULANMIŞTIR
                       </p>
                    </div>
                    <button onClick={()=>updateMonthly('metaData', [])} className="text-[8px] font-black text-rose-500/50 hover:text-rose-500 uppercase tracking-widest">VERİLERİ TEMİZLE</button>
                 </div>
               )}
            </div>

            {/* İŞ PLANI VE HEDEFLER */}
            <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
               <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest flex items-center gap-3"><Activity size={18}/> İŞ PLANI VE OPERASYON KONTROLÜ</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SOSYAL MEDYA İÇERİK TAKİBİ</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-slate-500">HEDEF</label>
                           <input type="number" value={monthData.plan.targetPosts} onChange={(e)=>updateMonthly('plan.targetPosts', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-white font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-slate-500">TAMAMLANAN</label>
                           <input type="number" value={monthData.plan.completedPosts} onChange={(e)=>updateMonthly('plan.completedPosts', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-white font-bold outline-none" />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">VİDEO / REELS PRODÜKSİYON</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-slate-500">HEDEF</label>
                           <input type="number" value={monthData.plan.targetVideos} onChange={(e)=>updateMonthly('plan.targetVideos', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-white font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-slate-500">TAMAMLANAN</label>
                           <input type="number" value={monthData.plan.completedVideos} onChange={(e)=>updateMonthly('plan.completedVideos', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-white font-bold outline-none" />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="space-y-3 pt-6 border-t border-white/5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">KAMPANYA DURUMU</label>
                  <select value={monthData.plan.status} onChange={(e)=>updateMonthly('plan.status', e.target.value)} className="w-full bg-orange-600 border-none p-4 rounded-xl text-white font-black uppercase text-xs outline-none cursor-pointer">
                     <option value="Yayında">YAYINDA</option>
                     <option value="Hazırlanıyor">HAZIRLANIYOR</option>
                     <option value="Onay Bekliyor">ONAY BEKLİYOR</option>
                     <option value="Tamamlandı">TAMAMLANDI</option>
                  </select>
               </div>
            </div>
          </div>

          {/* SAĞ PANEL: LOGO VE GÖRÜNÜRLÜK */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/5 space-y-6">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MARKA LOGOSU</label>
               <LogoDropzone currentLogo={current.logo} onUpload={(b64) => updateClient({ logo: b64 })} />
            </div>

            <div className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/5 space-y-6">
               <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-4">PANEL GÖRÜNÜRLÜĞÜ</h4>
               <div className="space-y-3">
                  {(Object.keys(current.visibility) as (keyof typeof current.visibility)[]).map(key => (
                     <div key={key} onClick={() => {
                        const vis = { ...current.visibility, [key]: !current.visibility[key] };
                        updateClient({ visibility: vis });
                     }} className="flex items-center justify-between cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{String(key).replace('show', '')}</span>
                        {current.visibility[key] ? <ToggleRight className="text-orange-500" size={24} /> : <ToggleLeft className="text-slate-800" size={24} />}
                     </div>
                  ))}
               </div>
            </div>
            
            <button 
              onClick={() => { if(confirm('Bu markayı ve tüm verilerini silmek istediğinize emin misiniz?')){ onUpdateClients(clients.filter(c=>c.id!==selectedId)); setSelectedId(clients[0]?.id || null); } }}
              className="w-full py-4 rounded-2xl border border-rose-500/20 text-rose-500/50 hover:bg-rose-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
            >
              MARKAYI SİSTEMDEN SİL
            </button>
          </div>
        </div>
      ) : <div className="py-40 text-center opacity-30 text-sm font-black uppercase tracking-[0.5em]">Lütfen bir marka seçin.</div>}
    </div>
  );
};

export default AdminClientManager;
