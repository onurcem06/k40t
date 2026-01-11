
import React, { useMemo, useState } from 'react';
import { TrendingUp, Activity, DollarSign, BarChart3, Calendar, ChevronRight } from 'lucide-react';
import { ClientProfile, MonthlyData } from '../../types.ts';

interface AdminOverviewProps {
  clients: ClientProfile[];
}

const YEARS = Array.from({ length: 11 }, (_, i) => (2020 + i).toString()); // 2020 - 2030
const MONTHS = [
  { id: '01', name: 'Ocak' }, { id: '02', name: 'Şubat' }, { id: '03', name: 'Mart' },
  { id: '04', name: 'Nisan' }, { id: '05', name: 'Mayıs' }, { id: '06', name: 'Haziran' },
  { id: '07', name: 'Temmuz' }, { id: '08', name: 'Ağustos' }, { id: '09', name: 'Eylül' },
  { id: '10', name: 'Ekim' }, { id: '11', name: 'Kasım' }, { id: '12', name: 'Aralık' }
];

const AdminOverview: React.FC<AdminOverviewProps> = ({ clients }) => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [startMonth, setStartMonth] = useState('01');
  const [endMonth, setEndMonth] = useState('12');
  const [chartType, setChartType] = useState<'ROAS' | 'SPEND'>('ROAS');

  const stats = useMemo(() => {
    return MONTHS.filter(m => parseInt(m.id) >= parseInt(startMonth) && parseInt(m.id) <= parseInt(endMonth)).map(m => {
      let totalRoas = 0;
      let totalSpend = 0;
      let clientCount = 0;
      const key = `${selectedYear}-${m.id}`;

      clients.forEach(c => {
        const data = c.monthlyHistory[key];
        if (data) {
          totalRoas += parseFloat(String(data.roas).replace('x', '')) || 0;
          totalSpend += parseInt(String(data.spend).replace(/\D/g, '')) || 0;
          clientCount++;
        }
      });

      return {
        month: m.name,
        monthId: m.id,
        roas: clientCount > 0 ? (totalRoas / clientCount) : 0,
        spend: totalSpend
      };
    });
  }, [clients, selectedYear, startMonth, endMonth]);

  const maxVal = Math.max(...stats.map(s => chartType === 'ROAS' ? s.roas : s.spend), 1);

  return (
    <div className="space-y-12 animate-fade-up">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">SİSTEM ANALİTİĞİ</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">DİNAMİK VERİ PROJEKSİYONU VE TREND TAKİBİ</p>
        </div>
        <div className="flex flex-wrap gap-4 bg-[#0D1225] p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 px-4 border-r border-white/10">
            <Calendar size={14} className="text-orange-500" />
            <select value={selectedYear} onChange={(e)=>setSelectedYear(e.target.value)} className="bg-transparent text-[11px] font-black text-white outline-none cursor-pointer">
              {YEARS.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 px-4 border-r border-white/10">
            <select value={startMonth} onChange={(e)=>setStartMonth(e.target.value)} className="bg-transparent text-[11px] font-black text-white outline-none">
              {MONTHS.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
            </select>
            <ChevronRight size={14} className="text-slate-700" />
            <select value={endMonth} onChange={(e)=>setEndMonth(e.target.value)} className="bg-transparent text-[11px] font-black text-white outline-none">
              {MONTHS.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
            </select>
          </div>
          <div className="flex p-1 bg-black/40 rounded-xl">
            <button onClick={() => setChartType('ROAS')} className={`px-5 py-2 rounded-lg text-[9px] font-black transition-all ${chartType === 'ROAS' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>ROAS</button>
            <button onClick={() => setChartType('SPEND')} className={`px-5 py-2 rounded-lg text-[9px] font-black transition-all ${chartType === 'SPEND' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>HARCAMA</button>
          </div>
        </div>
      </header>

      <div className="bg-[#0D1225] border border-white/5 p-12 rounded-[4rem] relative overflow-hidden">
        <div className="flex justify-between items-center mb-12">
           <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
             <BarChart3 size={18} className="text-orange-500" /> {chartType} TRENDİ ({selectedYear})
           </h4>
        </div>
        <div className="h-96 flex items-end gap-4 px-4">
          {stats.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
              <div 
                className={`w-full rounded-t-2xl transition-all duration-700 relative ${chartType === 'ROAS' ? 'bg-orange-600/40 group-hover:bg-orange-600' : 'bg-indigo-600/40 group-hover:bg-indigo-600'}`}
                style={{ height: `${((chartType === 'ROAS' ? s.roas : s.spend) / maxVal) * 100}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black p-2 rounded-lg text-[10px] font-black text-white border border-white/10 whitespace-nowrap z-50">
                   {chartType === 'ROAS' ? `${s.roas.toFixed(2)}x` : `₺${s.spend.toLocaleString()}`}
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest h-12 flex items-center text-center leading-tight">{s.month}</span>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-20">
              <p className="text-xs font-black uppercase">Seçili dönemde veri yok</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'TOPLAM HARCAMA', value: `₺${stats.reduce((a,b)=>a+b.spend, 0).toLocaleString()}`, icon: DollarSign, color: 'text-white' },
          { label: 'ORTALAMA ROAS', value: `${(stats.length > 0 ? stats.reduce((a,b)=>a+b.roas, 0) / stats.length : 0).toFixed(2)}x`, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'AKTİF KAMPANYA AYI', value: stats.length, icon: Activity, color: 'text-orange-500' }
        ].map((s, i) => (
          <div key={i} className="bg-[#0D1225] p-10 rounded-[3rem] border border-white/5 space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
            <h3 className={`text-4xl font-black ${s.color} tracking-tight`}>{s.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
