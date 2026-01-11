
import React from 'react';
import { ArrowRight, Share2, Clapperboard, Target, Palette, Sparkles, Monitor, Shield, TrendingUp, Globe } from 'lucide-react';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import ContactPage from '../components/ContactPage.tsx';
import FoxIcons from '../components/ui/FoxIcons.tsx';
import { SiteContent, ViewState, ContactMessage } from '../types.ts';

interface HomeViewProps {
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
  onAddMessage: (msg: ContactMessage) => void;
}

const IconMap: { [key: string]: any } = {
  Share2, Clapperboard, Target, Palette, Sparkles, Monitor, Shield, TrendingUp, Globe
};

const HomeView: React.FC<HomeViewProps> = ({ content, onNavigate, onAddMessage }) => {
  const isNavVisible = (view: string) => content.navigation.find(n => n.view === view)?.isEnabled;

  return (
    <MarketingLayout content={content} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      {/* HERO SECTION - SEO Optimized H1 */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-32 lg:py-48 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-600/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[8rem] font-black text-white mb-6 md:mb-10 leading-[1] tracking-tighter uppercase animate-in slide-in-from-bottom-8 duration-700">
          <span className="block opacity-90">{content.hero.titlePart1}</span>
          <span className="relative inline-block group cursor-default">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-500 relative z-10 transition-all duration-500 group-hover:tracking-wider">
              {content.hero.titlePart2}
            </span>
            {/* SINGLE NEON LINE EFFECT */}
            <span className="absolute -bottom-2 left-0 w-0 h-1 md:h-2 bg-orange-600 rounded-full group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(249,115,22,1)]"></span>
          </span>
          <span className="block opacity-90">{content.hero.titlePart3}</span>
        </h1>
        
        <p className="text-slate-400 text-xs md:text-lg max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed opacity-80 px-4">
          {content.hero.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <button 
            onClick={() => onNavigate('SERVICES_LIST')} 
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-orange-600 hover:bg-orange-500 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl hover:shadow-orange-900/40"
          >
            {content.hero.primaryCTA} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <button 
            onClick={() => onNavigate('MANIFESTO')} 
            className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white/5 border border-white/10 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3 group"
          >
            <FoxIcons type={(content.corporate.manifesto.icon as any) || 'FoxHead'} size={18} className="text-orange-500 group-hover:rotate-12 transition-transform" />
            {content.hero.secondaryCTA}
          </button>
        </div>
      </section>

      {/* COMPACT SERVICE VITRINE SECTION */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div className="space-y-2">
            <p className="text-orange-500 font-black text-[9px] uppercase tracking-[0.5em]">DİJİTAL UZMANLIKLARIMIZ</p>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">NELER <span className="text-slate-700">YAPIYORUZ?</span></h2>
          </div>
          <button 
            onClick={() => onNavigate('SERVICES_LIST')} 
            className="flex items-center gap-3 text-[9px] font-black text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-[0.3em] group"
          >
            TÜMÜNÜ GÖR <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* KÜÇÜLTÜLMÜŞ KARTLAR - MOBİL/TABLET OPTİMİZASYONU */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {content.services.slice(0, 4).map((s) => {
            const Icon = IconMap[s.iconType] || Target;
            return (
              <div 
                key={s.id} 
                onClick={() => onNavigate(s.id)}
                className="glass-panel rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer bg-slate-900/10 flex flex-col overflow-hidden h-full min-h-[280px] md:min-h-[400px]"
              >
                {/* Slimmer Visual Area */}
                <div className="h-28 md:h-44 relative overflow-hidden bg-black/40">
                   {s.image ? (
                     <img src={s.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" alt={s.title} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-800">
                        <Icon size={40} className="opacity-20" />
                     </div>
                   )}
                   <div className="absolute top-3 left-3 w-8 h-8 md:w-12 md:h-12 bg-black/60 backdrop-blur-xl rounded-lg md:rounded-xl flex items-center justify-center text-orange-500 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-lg">
                      <Icon size={16} className="md:w-6 md:h-6" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                </div>

                {/* Compact Content Area */}
                <div className="p-3 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-xs md:text-lg font-black text-white uppercase tracking-tight mb-1.5 md:mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-[9px] md:text-xs font-bold leading-relaxed mb-3 line-clamp-2 md:line-clamp-3">
                    {s.desc}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                     <div className="h-px flex-1 bg-white/5 group-hover:bg-orange-500/30 transition-colors"></div>
                     <ArrowRight size={12} className="text-slate-800 group-hover:text-orange-500 transition-all ml-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SHARED CONTACT SECTION */}
      <section id="contact" className="border-t border-white/5">
        <ContactPage 
          content={content} 
          onBack={() => {}} 
          onAddMessage={onAddMessage} 
          hideBackButton={true} 
        />
      </section>
    </MarketingLayout>
  );
};

export default HomeView;
