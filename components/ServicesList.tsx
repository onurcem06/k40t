
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
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">NELER <br /> YAPIYORUZ?</h1>
          <p className="text-slate-500 mt-6 md:mt-8 max-w-xl text-base md:text-lg font-medium leading-relaxed">Fikir aşamasından prodüksiyona, performans takibinden topluluk yönetimine kadar tüm süreci uçtan uca yönetiyoruz.</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.services.map((s) => {
            const Icon = (IconMap as any)[s.iconType] || Target;
            return (
              <div
                key={s.id}
                onClick={() => onServiceClick(s.id)}
                className="glass-panel rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer bg-slate-900/10 flex flex-col overflow-hidden h-full min-h-[350px]"
              >
                {/* Slimmer Visual Area - Match HomeView */}
                <div className="h-32 md:h-44 relative overflow-hidden bg-black/40">
                  {s.image ? (
                    <img src={s.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={s.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-800">
                      <Icon size={40} className="opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-xl rounded-lg md:rounded-xl flex items-center justify-center text-orange-500 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-lg">
                    <Icon size={18} className="md:w-6 md:h-6" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                </div>

                {/* Compact Content Area */}
                <div className="p-5 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-[10px] md:text-sm font-bold leading-relaxed mb-6 line-clamp-3">
                    {s.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="h-px flex-1 bg-white/5 group-hover:bg-orange-500/30 transition-colors"></div>
                    <ArrowRight size={14} className="text-slate-800 group-hover:text-orange-500 transition-all ml-3" />
                  </div>
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
