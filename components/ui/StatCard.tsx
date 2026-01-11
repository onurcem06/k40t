
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Metric } from '../../types.ts';

interface StatCardProps { metric: Metric; }

const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 border border-white/5 hover:border-orange-500/30 group relative overflow-hidden">
      {/* Decorative accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 blur-3xl rounded-full opacity-10 transition-all duration-500 group-hover:opacity-30 ${metric.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      
      <p className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-2 sm:mb-3">{metric.label}</p>
      <div className="flex items-end justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter truncate">{metric.value}</h3>
        <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-black mb-1 px-2 py-1 rounded-lg flex-shrink-0 ${metric.isPositive ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
          {metric.isPositive ? <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> : <TrendingDown size={12} className="sm:w-[14px] sm:h-[14px]" />}
          <span>{metric.change}</span>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${metric.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
          style={{ width: '70%' }}
        />
      </div>
    </div>
  );
};

export default StatCard;
