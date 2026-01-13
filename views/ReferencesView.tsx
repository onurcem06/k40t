
import React from 'react';
import { ArrowLeft, ExternalLink, Globe, ChevronRight } from 'lucide-react';
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

          <div className="space-y-20">
            {(items || []).map((item) => (
              <div key={item.id} className="glass-panel p-10 md:p-14 rounded-[3.5rem] border border-white/5 bg-black/20 group relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  {/* Marka Info */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className="w-28 h-28 bg-white rounded-3xl p-5 flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                      <img src={item.logo} className="w-full h-auto object-contain grayscale group-hover:grayscale-0 transition-all" alt={item.name} />
                    </div>
                    <div className="space-y-4">
                      <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest">{item.category}</p>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{item.name}</h3>
                      <p className="text-slate-400 font-bold text-sm leading-relaxed">{item.description}</p>
                    </div>
                    {item.link && item.link !== '#' && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-white hover:text-orange-500 transition-colors font-black text-[10px] uppercase tracking-widest group/link">
                        PROJEYİ İNCELE <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>

                  {/* İş Görselleri Galerisi */}
                  <div className="lg:col-span-8">
                    {item.workImages && item.workImages.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                            ÇALIŞMA GÖRSELLERİ <ChevronRight size={10} className="text-orange-500" />
                          </span>
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">({item.workImages.length} GÖRSEL)</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                          {(item.workImages || []).map((workImg, idx) => (
                            <div key={idx} className="min-w-[280px] md:min-w-[340px] aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 snap-center group/work">
                              <img src={workImg} className="w-full h-full object-cover opacity-80 group-hover/work:opacity-100 group-hover/work:scale-105 transition-all duration-700" alt={`Work ${idx}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video w-full border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-800">
                        <Globe size={48} className="mb-4 opacity-20" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Çalışma görselleri yükleniyor...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center p-24 opacity-30">
              <Globe size={64} className="text-slate-700 mb-6" />
              <p className="text-[12px] font-black text-slate-700 uppercase tracking-[0.6em]">DAHA FAZLA HİKAYE YOLDA</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ReferencesView;
