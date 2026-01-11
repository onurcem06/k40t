
import React from 'react';
import { Activity, DollarSign } from 'lucide-react';
import { ClientProfile } from '../../types.ts';

interface ClientWorkPlanProps {
  client: ClientProfile;
}

const ClientWorkPlan: React.FC<ClientWorkPlanProps> = ({ client }) => {
  const latestMonth = Object.keys(client.monthlyHistory).sort().reverse()[0];
  const data = client.monthlyHistory[latestMonth];

  if (!data) return <div>Veri yok.</div>;

  const plan = data.plan;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="glass-panel p-12 rounded-[4rem] border border-white/5 space-y-10 bg-black/10">
         <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3"><Activity size={18} className="text-orange-500" /> İŞ PLANI İLERLEMESİ</h3>
         <div className="space-y-8">
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>SOSYAL MEDYA İÇERİKLERİ</span>
                  <span className="text-white">{plan.completedPosts} / {plan.targetPosts}</span>
               </div>
               <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${(plan.completedPosts / (plan.targetPosts || 1)) * 100}%` }}></div>
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>VİDEO PRODÜKSİYON</span>
                  <span className="text-white">{plan.completedVideos} / {plan.targetVideos}</span>
               </div>
               <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(plan.completedVideos / (plan.targetVideos || 1)) * 100}%` }}></div>
               </div>
            </div>
         </div>
      </div>

      <div className="glass-panel p-12 rounded-[4rem] border border-emerald-500/10 bg-emerald-500/5 space-y-10 flex flex-col justify-center text-center">
         <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-3"><DollarSign size={18} /> ONAYLI REKLAM BÜTÇESİ</h3>
         <div className="py-6">
            <h4 className="text-6xl font-black text-white mb-3 tracking-tighter">{plan.currentAdsBudget}</h4>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{latestMonth} DÖNEMİ İÇİN BELİRLENEN LİMİT</p>
         </div>
      </div>
    </div>
  );
};

export default ClientWorkPlan;
