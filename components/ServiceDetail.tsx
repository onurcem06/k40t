
import React from 'react';
import { ArrowLeft, CheckCircle2, Clapperboard, Share2, Target, Palette, ArrowRight } from 'lucide-react';
import { ViewState, SiteContent } from '../types.ts';

interface ServiceDetailProps {
  view: string;
  siteContent: SiteContent;
  onBack: () => void;
}

const IconMap = {
  Share2: Share2,
  Clapperboard: Clapperboard,
  Target: Target,
  Palette: Palette
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ view, siteContent, onBack }) => {
  const service = siteContent.services.find(s => s.id === view);

  if (!service) return null;
  const Icon = (IconMap as any)[service.iconType] || Target;

  return (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="bg-white/5 w-fit p-5 rounded-[2rem] border border-white/10 mb-6"><Icon size={40} className="text-orange-500" /></div>
              <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.5em]">{service.tagline}</p>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">{service.title}</h1>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">{service.detailedDesc || service.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(service.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                  <span className="text-slate-300 text-xs font-bold uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {((service.detailedImages || []).length > 0 ? (service.detailedImages || []) : [service.image]).map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-[2.5rem] overflow-hidden group glass-panel border border-white/10 p-2">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
