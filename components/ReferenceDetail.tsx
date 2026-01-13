import React from 'react';
import { ArrowLeft, ExternalLink, Globe, Clapperboard } from 'lucide-react';
import MarketingLayout from './layout/MarketingLayout.tsx';
import { SiteContent } from '../types.ts';

interface ReferenceDetailProps {
    view: string;
    siteContent: SiteContent;
    onBack: () => void;
}

const ReferenceDetail: React.FC<ReferenceDetailProps> = ({ view, siteContent, onBack }) => {
    const reference = siteContent.references.items.find(r => r.id === view);

    if (!reference) return null;

    return (
        <MarketingLayout content={siteContent} onNavigate={(view) => { if (view === 'REFERENCES') onBack(); else window.location.href = view === 'Home' ? '/' : `/${view.toLowerCase()}`; }} onLoginClick={() => { }}>
            <div className="min-h-screen bg-transparent pt-40 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="container mx-auto max-w-6xl relative z-20">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group relative z-30"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        GERİ DÖN
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Left Column: Info */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="w-32 h-32 bg-white rounded-[2rem] p-6 flex items-center justify-center shadow-2xl border border-white/10 mb-8">
                                {reference.logo ? (
                                    <img src={reference.logo} className="w-full h-auto object-contain" alt={reference.name} />
                                ) : (
                                    <Globe className="text-slate-400" size={40} />
                                )}
                            </div>

                            <div>
                                <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">{reference.category}</p>
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">{reference.name}</h1>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">{reference.description}</p>
                            </div>

                            {reference.link && reference.link !== '#' && (
                                <a
                                    href={reference.link.startsWith('http') ? reference.link : `https://${reference.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:shadow-orange-900/40"
                                >
                                    PROJEYİ İNCELE <ExternalLink size={16} />
                                </a>
                            )}
                        </div>

                        {/* Right Column: Gallery */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Clapperboard className="text-orange-500" size={20} />
                                <h3 className="text-white font-black text-sm uppercase tracking-widest">PROJE GÖRSELLERİ</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {(reference.workImages && reference.workImages.length > 0 ? reference.workImages : []).map((img, idx) => (
                                    <div key={idx} className="relative w-full rounded-[2.5rem] overflow-hidden group glass-panel border border-white/10 p-2">
                                        <div className="w-full h-full rounded-[2rem] overflow-hidden">
                                            <img src={img} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" alt={`${reference.name} Work ${idx + 1}`} />
                                        </div>
                                    </div>
                                ))}

                                {(!reference.workImages || reference.workImages.length === 0) && (
                                    <div className="h-64 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-700">
                                        <Clapperboard size={32} className="mb-4 opacity-50" />
                                        <p className="font-bold text-xs uppercase tracking-widest">Görsel Bulunamadı</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
};

export default ReferenceDetail;
