
import React from 'react';
import { ArrowLeft, ExternalLink, Globe, ChevronRight, Clapperboard } from 'lucide-react';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import { SiteContent, ViewState } from '../types.ts';

interface ReferencesViewProps {
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
}

const ReferencesView: React.FC<ReferencesViewProps> = ({ content, onNavigate }) => {
  const { title, description, items } = content.references;

  return (
    <MarketingLayout content={content} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="container mx-auto max-w-6xl">
          <button onClick={() => onNavigate('MARKETING')} className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-[10px] uppercase tracking-[0.4em] mb-16 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            ANA SAYFAYA DÖN
          </button>

          <header className="mb-20">
            <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">BAŞARI HİKAYELERİMİZ</p>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">{title}</h1>
            <p className="text-slate-500 mt-8 max-w-xl text-lg font-medium">{description}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(items || []).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group relative bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-900/20 cursor-pointer"
              >
                {/* Card Image Area */}
                <div className="h-48 bg-black/40 relative overflow-hidden group-hover:h-40 transition-all duration-500">
                  {/* Background Image (First Work Image or Generic Pattern) */}
                  {item.workImages && item.workImages.length > 0 ? (
                    <img src={item.workImages[0]} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Work Preview" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black opacity-50" />
                  )}

                  {/* Logo Overlay */}
                  <div className="absolute -bottom-6 left-6 w-20 h-20 bg-white rounded-2xl p-3 shadow-lg flex items-center justify-center border border-white/10 z-10 group-hover:scale-90 transition-transform origin-bottom-left">
                    {item.logo ? (
                      <img src={item.logo} className="w-full h-full object-contain" alt={item.name} />
                    ) : (
                      <Globe className="text-slate-400" size={24} />
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-10 pb-6 px-6 relative">
                  <div className="mb-4">
                    <p className="text-orange-500 font-black text-[9px] uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-orange-500 transition-colors">{item.name}</h3>
                  </div>

                  <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {item.description}
                  </p>

                  {/* Actions / Info */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    {item.link && item.link !== '#' ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[9px] font-black text-white hover:text-orange-500 transition-colors uppercase tracking-wider">
                        İNCELE <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span></span>
                    )}

                    {item.workImages && item.workImages.length > 0 && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                        <Clapperboard size={10} /> {item.workImages.length} GÖRSEL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add More Placeholder */}
            <div className="min-h-[300px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 opacity-30 hover:opacity-50 transition-opacity">
              <Globe size={48} className="text-slate-700 mb-4" />
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] text-center">DAHA FAZLA HİKAYE YOLDA</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ReferencesView;
