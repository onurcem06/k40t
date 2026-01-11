
import React from 'react';
import { ArrowLeft, ArrowRight, Share2, Clapperboard, Target, Palette } from 'lucide-react';
import { SiteContent } from '../types.ts';

interface ServicesListProps {
  siteContent: SiteContent;
  onBack: () => void;
  onServiceClick: (id: string) => void;
}

const IconMap = {
  Share2: Share2,
  Clapperboard: Clapperboard,
  Target: Target,
  Palette: Palette
};

const ServicesList: React.FC<ServicesListProps> = ({ siteContent, onBack, onServiceClick }) => {
  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-40 pb-20 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto max-w-6xl">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          ANA SAYFA
        </button>

        <header className="mb-12 md:mb-20">
          <p className="text-orange-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.5em] mb-4">UZMANLIK ALANLARIMIZ</p>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">NELER <br/> YAPIYORUZ?</h1>
          <p className="text-slate-500 mt-6 md:mt-8 max-w-xl text-base md:text-lg font-medium leading-relaxed">Fikir aşamasından prodüksiyona, performans takibinden topluluk yönetimine kadar tüm süreci uçtan uca yönetiyoruz.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {siteContent.services.map((s) => {
            const Icon = (IconMap as any)[s.iconType] || Target;
            return (
              <div 
                key={s.id} 
                onClick={() => onServiceClick(s.id)}
                className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 hover:border-orange-500/20 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-8 md:mb-10">
                  <div className="bg-white/5 p-4 md:p-5 rounded-2xl group-hover:bg-orange-600/10 transition-colors">
                    <Icon size={28} className="text-orange-500" />
                  </div>
                  <ArrowRight size={20} className="text-slate-800 group-hover:text-orange-500 transition-all" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-4">{s.title}</h3>
                <p className="text-slate-500 font-bold text-xs md:text-sm leading-relaxed mb-8">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[8px] font-black text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg uppercase tracking-widest">{f}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
