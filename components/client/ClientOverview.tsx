
import React from 'react';
import StatCard from '../ui/StatCard.tsx';
import { ClientProfile, MonthlyData } from '../../types.ts';

interface ClientOverviewProps {
  client: ClientProfile;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ client }) => {
  const latestMonth = Object.keys(client.monthlyHistory).sort().reverse()[0];
  const data = client.monthlyHistory[latestMonth];

  if (!data) return <p className="text-slate-500 uppercase font-black text-xs">Veri henüz yüklenmemiş.</p>;

  const metrics = [
    { label: 'AYLIK HARCAMA', value: data.spend, change: '+5.2%', isPositive: true },
    { label: 'ROAS PERFORMANSI', value: data.roas, change: '+0.4x', isPositive: true },
    { label: 'TOPLAM ERİŞİM', value: data.plan.totalViews, change: '+12%', isPositive: true }
  ];

  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((m, i) => <StatCard key={i} metric={m} />)}
      </section>

      <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/20">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">AYLIK HARCAMA TRENDİ</h3>
         </div>
         <div className="h-64 flex items-end gap-3">
            {/* Cast the values to MonthlyData[] to ensure type safety in the map function */}
            {(Object.values(client.monthlyHistory) as MonthlyData[]).map((m, i) => (
               <div key={i} className="flex-1 bg-white/5 rounded-t-2xl border-t border-white/10 relative group" style={{ height: `${(parseInt(m.spend.replace(/\D/g, '')) / 1000000) * 100}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black p-2 rounded text-[9px] text-orange-500 font-black">{m.spend}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ClientOverview;
