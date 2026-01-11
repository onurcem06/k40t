
import React, { useState, useMemo } from 'react';
import { 
  LogOut, LayoutDashboard, Activity, DollarSign, Calendar, ChevronRight, TrendingUp
} from 'lucide-react';
import StatCard from './ui/StatCard.tsx';
import { SiteContent, ClientProfile, UserAccount, MonthlyData } from '../types.ts';

interface DashboardProps {
  content: SiteContent;
  clients: ClientProfile[];
  user: UserAccount;
  onLogout: () => void;
}

const MONTHS_LIST = [
  { id: '01', name: 'Ocak' }, { id: '02', name: 'Şubat' }, { id: '03', name: 'Mart' },
  { id: '04', name: 'Nisan' }, { id: '05', name: 'Mayıs' }, { id: '06', name: 'Haziran' },
  { id: '07', name: 'Temmuz' }, { id: '08', name: 'Ağustos' }, { id: '09', name: 'Eylül' },
  { id: '10', name: 'Ekim' }, { id: '11', name: 'Kasım' }, { id: '12', name: 'Aralık' }
];

const YEARS = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());

const Dashboard: React.FC<DashboardProps> = ({ content, clients, user, onLogout }) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(now.getFullYear().toString());
  const [startMonth, setStartMonth] = useState<string>('01');
  const [endMonth, setEndMonth] = useState<string>((now.getMonth() + 1).toString().padStart(2, '0'));
  const [activeTab, setActiveTab] = useState('Genel Bakış');
  
  const myClient: ClientProfile = clients.find(c => c.id === user.clientId) || clients[0];

  const aggregatedData = useMemo(() => {
    const total: MonthlyData = {
      spend: '₺0', roas: '0x', visits: '0', agencyRevenue: '₺0',
      plan: { targetPosts: 0, completedPosts: 0, targetVideos: 0, completedVideos: 0, currentAdsBudget: '₺0', status: 'Yayında', totalViews: '0' }
    };

    let spendSum = 0;
    let visitSum = 0;
    let targetPostSum = 0;
    let compPostSum = 0;
    let targetVidSum = 0;
    let compVidSum = 0;
    let roasSum = 0;
    let monthCount = 0;
    const chartPoints: number[] = [];

    const start = parseInt(startMonth);
    const end = parseInt(endMonth);

    // Added type cast for val to MonthlyData to fix "unknown" type errors
    Object.entries(myClient.monthlyHistory).forEach(([key, val]) => {
      const m = val as MonthlyData;
      const [y, mStr] = key.split('-');
      const mInt = parseInt(mStr);
      
      if (y === selectedYear && mInt >= start && mInt <= end) {
        spendSum += parseInt(m.spend.replace(/\D/g, '') || '0');
        visitSum += parseInt(m.plan.totalViews.replace(/\D/g, '') || '0');
        targetPostSum += m.plan.targetPosts;
        compPostSum += m.plan.completedPosts;
        targetVidSum += m.plan.targetVideos;
        compVidSum += m.plan.completedVideos;
        const rValue = parseFloat(m.roas.replace('x', '') || '0');
        roasSum += rValue;
        monthCount++;
        chartPoints.push(rValue);
      }
    });

    total.spend = `₺${spendSum.toLocaleString('tr-TR')}`;
    total.plan.totalViews = visitSum.toLocaleString('tr-TR');
    total.plan.targetPosts = targetPostSum;
    total.plan.completedPosts = compPostSum;
    total.plan.targetVideos = targetVidSum;
    total.plan.completedVideos = compVidSum;
    total.roas = monthCount > 0 ? `${(roasSum / monthCount).toFixed(2)}x` : '0x';

    return { total, chartPoints };
  }, [myClient.monthlyHistory, selectedYear, startMonth, endMonth]);

  const metrics = [];
  if (myClient.visibility.showSpend) metrics.push({ label: 'TOPLAM HARCAMA', value: aggregatedData.total.spend, change: '+12.4%', isPositive: true });
  if (myClient.visibility.showRoas) metrics.push({ label: 'ORTALAMA ROAS', value: aggregatedData.total.roas, change: '+0.2x', isPositive: true });
  if (myClient.visibility.showVisits) metrics.push({ label: 'TOPLAM ERİŞİM', value: aggregatedData.total.plan.totalViews, change: '+15%', isPositive: true });

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 glass-panel border-r border-white/5 flex flex-col h-full bg-[#080B14]/80">
        <div className="p-10 border-b border-white/5 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <img src={content.branding.logoUrl} className="h-8 w-auto object-contain" alt="Logo" />
          </div>
          <span className="font-black text-orange-500 text-[10px] uppercase tracking-[0.4em]">CLIENT OS</span>
        </div>
        <nav className="flex-1 p-8 space-y-2">
          {['Genel Bakış', 'Varlıklar', 'İş Planı'].map((item) => (
            <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/20 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <LayoutDashboard size={18} /> {item}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full bg-rose-500/10 text-rose-500 py-5 rounded-[1.8rem] font-black text-[9px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all">GÜVENLİ ÇIKIŞ</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950/30">
        <header className="glass-panel p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center backdrop-blur-3xl gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{content.portals.client.welcomeMsg}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{myClient.name} • PERFORMANS MERKEZİ</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             {/* Year Selector */}
             <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl border border-white/10 bg-black/40">
                <Calendar size={14} className="text-orange-500" />
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent text-white font-black text-[10px] outline-none cursor-pointer">
                   {YEARS.map(y => <option key={y} value={y} className="bg-slate-950">{y}</option>)}
                </select>
             </div>

             {/* Range Selector */}
             <div className="flex items-center gap-4 glass-panel p-2 rounded-2xl border border-white/10 bg-black/40">
                <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="bg-transparent text-white font-black text-[10px] px-4 py-1.5 outline-none cursor-pointer">
                   {MONTHS_LIST.map(m => <option key={m.id} value={m.id} className="bg-slate-950">{m.name}</option>)}
                </select>
                <ChevronRight size={14} className="text-slate-700" />
                <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="bg-transparent text-white font-black text-[10px] px-4 py-1.5 outline-none cursor-pointer">
                   {MONTHS_LIST.map(m => <option key={m.id} value={m.id} className="bg-slate-950">{m.name}</option>)}
                </select>
             </div>
             
             <div className="w-16 h-16 bg-white p-3 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
                <img src={myClient.logo} className="w-full h-auto object-contain" alt="Client Logo" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          {activeTab === 'Genel Bakış' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metrics.map((m, idx) => <StatCard key={idx} metric={m} />)}
              </section>

              {/* TREND ANALİZ GRAFİĞİ */}
              <div className="glass-panel p-12 rounded-[4rem] border border-white/5 space-y-10 bg-black/20">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3"><TrendingUp size={18} className="text-orange-500" /> PERFORMANS TRENDİ (ROAS)</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SEÇİLİ ARALIK: {MONTHS_LIST.find(m=>m.id===startMonth)?.name} - {MONTHS_LIST.find(m=>m.id===endMonth)?.name}</p>
                 </div>
                 <div className="h-64 w-full flex items-end gap-3 px-2">
                    {aggregatedData.chartPoints.length > 0 ? aggregatedData.chartPoints.map((p, i) => (
                       <div key={i} className="flex-1 bg-white/5 rounded-t-2xl relative group hover:bg-orange-500/20 transition-all border-t border-white/10 shadow-lg" style={{ height: `${Math.min(p * 15, 100)}%` }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-orange-500 bg-black/60 px-3 py-1.5 rounded-xl border border-orange-500/20">{p}x</div>
                       </div>
                    )) : (
                      <div className="w-full h-full border-2 border-dashed border-white/5 rounded-[3rem] flex items-center justify-center opacity-20">
                        <p className="font-black text-[10px] uppercase">Seçili dönemde veri yok</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {myClient.visibility.showPlan && (
                    <div className="glass-panel p-12 rounded-[4rem] border border-white/5 space-y-10 bg-black/10">
                       <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3"><Activity size={18} className="text-orange-500" /> İŞ PLANI İLERLEMESİ</h3>
                       <div className="space-y-8">
                          <div className="space-y-3">
                             <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>SOSYAL MEDYA İÇERİKLERİ</span>
                                <span className="text-white">{aggregatedData.total.plan.completedPosts} / {aggregatedData.total.plan.targetPosts}</span>
                             </div>
                             <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000" style={{ width: `${(aggregatedData.total.plan.completedPosts / (aggregatedData.total.plan.targetPosts || 1)) * 100}%` }}></div>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>PRODÜKSİYON / REELS</span>
                                <span className="text-white">{aggregatedData.total.plan.completedVideos} / {aggregatedData.total.plan.targetVideos}</span>
                             </div>
                             <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000" style={{ width: `${(aggregatedData.total.plan.completedVideos / (aggregatedData.total.plan.targetVideos || 1)) * 100}%` }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {myClient.visibility.showBudget && (
                    <div className="glass-panel p-12 rounded-[4rem] border border-emerald-500/10 bg-emerald-500/5 space-y-10 flex flex-col justify-center text-center">
                       <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-3"><DollarSign size={18} /> SEÇİLİ ARALIK TOPLAM REKLAM BÜTÇESİ</h3>
                       <div className="py-6">
                          <h4 className="text-5xl font-black text-white mb-3 tracking-tighter">{aggregatedData.total.spend}</h4>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">ONAYLANMIŞ MEDYA PLANI ÜZERİNDEN HESAPLANMIŞTIR</p>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'Varlıklar' && myClient.visibility.showAssets && (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in slide-in-from-bottom-6">
                {myClient.assets.map(asset => (
                  <div key={asset.id} className="glass-panel p-3 rounded-[2.5rem] border border-white/5 group transition-all hover:scale-105 hover:border-orange-500/30 cursor-pointer bg-black/20 shadow-xl">
                     <div className="aspect-square bg-slate-900 rounded-[2rem] overflow-hidden mb-4 border border-white/5">
                        <img src={asset.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                     <p className="text-[10px] font-black text-white uppercase px-3 truncate">{asset.title}</p>
                     <p className="text-[8px] font-bold text-slate-600 px-3 uppercase tracking-widest mt-1">{new Date(asset.date).toLocaleDateString()}</p>
                  </div>
                ))}
                {myClient.assets.length === 0 && <p className="col-span-full text-center py-20 text-slate-600 font-black uppercase text-xs opacity-30 tracking-[0.5em]">Henüz paylaşılan bir varlık yok.</p>}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
