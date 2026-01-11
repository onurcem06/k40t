
import React from 'react';
import { ArrowLeft, Sparkles, Target, TrendingUp, Share2, Clapperboard, Palette, Monitor, Shield, Globe } from 'lucide-react';
import FoxIcons, { FoxIconType } from './ui/FoxIcons.tsx';
import { SiteContent } from '../types.ts';

interface InfoPageProps {
  type: 'manifesto' | 'about';
  content: SiteContent;
  onBack: () => void;
}

const IconMap: { [key: string]: any } = {
  Sparkles, Target, TrendingUp, Share2, Clapperboard, Palette, Monitor, Shield, Globe
};

const InfoPage: React.FC<InfoPageProps> = ({ type, content, onBack }) => {
  const data = content.corporate[type];
  
  const renderIcon = (iconName: string) => {
    const FoxIconNames = ['FoxHead', 'FoxSitting', 'FoxRunning', 'FoxSleeping', 'FoxAlert'];
    if (FoxIconNames.includes(iconName)) {
      return <FoxIcons type={iconName as FoxIconType} size={24} className="text-orange-500" />;
    }
    const IconComp = IconMap[iconName] || (type === 'manifesto' ? Sparkles : Target);
    return <IconComp size={24} className="text-orange-500" />;
  };

  const renderLargeIcon = (iconName: string) => {
    const FoxIconNames = ['FoxHead', 'FoxSitting', 'FoxRunning', 'FoxSleeping', 'FoxAlert'];
    if (FoxIconNames.includes(iconName)) {
      return <FoxIcons type={iconName as FoxIconType} size={300} className="text-white" />;
    }
    const IconComp = IconMap[iconName] || (type === 'manifesto' ? Sparkles : Target);
    return <IconComp size={300} className="text-white" />;
  };

  return (
    <div className="min-h-screen bg-transparent pt-40 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="container mx-auto max-w-4xl relative z-20">
        <button 
          type="button"
          onClick={onBack} 
          className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group relative z-30"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          GERİ DÖN
        </button>

        <div className="glass-panel p-12 md:p-20 rounded-[3.5rem] border border-white/5 relative overflow-hidden bg-[#050810]/60 backdrop-blur-3xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            {renderLargeIcon(data.icon)}
          </div>

          <div className="relative z-10">
            <div className="bg-orange-500/10 w-fit p-4 rounded-2xl mb-8">
              {renderIcon(data.icon)}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-10 leading-none">{data.title}</h1>
            <div className="w-20 h-1 bg-orange-500 mb-12 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
            <p className="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-wrap">
              {data.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
