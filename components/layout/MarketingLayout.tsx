
import React, { useState } from 'react';
import { 
  Lock, Mail, Phone, Globe, Instagram, Linkedin, Twitter, Youtube, Facebook, 
  Menu, X as CloseIcon 
} from 'lucide-react';
import ObsidianGraph from '../ui/ObsidianGraph.tsx';
import { SiteContent, ViewState } from '../../types.ts';

interface MarketingLayoutProps {
  children: React.ReactNode;
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
  onLoginClick: () => void;
}

const SocialIconMap: { [key: string]: any } = {
  Instagram, Linkedin, Twitter, Youtube, Facebook, Globe
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children, content, onNavigate, onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeNavItems = content.navigation.filter(item => item.isEnabled);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-[#020617] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ObsidianGraph />
      </div>

      <header className="absolute top-0 left-0 w-full z-[100] px-6 md:px-12 py-10 flex justify-between items-center pointer-events-none">
        <div onClick={() => onNavigate('MARKETING')} className="cursor-pointer hover:scale-105 transition-all relative z-[110] pointer-events-auto">
          <img 
            src={content.branding.logoUrl} 
            alt="Logo" 
            className="h-14 md:h-20 lg:h-24 w-auto object-contain drop-shadow-2xl" 
          />
        </div>

        <nav className="hidden lg:flex items-center gap-1 glass-panel p-1.5 rounded-full border border-white/10 bg-black/60 shadow-2xl pointer-events-auto backdrop-blur-3xl">
          {activeNavItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button onClick={() => onNavigate(item.view)} className="px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-all hover:bg-white/5 whitespace-nowrap">
                {item.label}
              </button>
              {idx < activeNavItems.length - 1 && <div className="h-3 w-px bg-white/10 mx-1"></div>}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-3 relative z-[110] pointer-events-auto">
          <button onClick={onLoginClick} className="glass-panel px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:text-orange-500 border border-white/10 flex items-center gap-2 transition-all bg-black/40 backdrop-blur-md">
            <Lock size={12} className="text-orange-500" /> Giriş
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden glass-panel p-3 rounded-2xl border border-white/10 text-white bg-black/60">
            {isMobileMenuOpen ? <CloseIcon size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#020617]/98 backdrop-blur-3xl z-[105] lg:hidden flex flex-col items-center justify-center p-10 pointer-events-auto">
             <div className="flex flex-col gap-4 w-full max-w-xs">
                {activeNavItems.map((item) => (
                  <button key={item.id} onClick={() => { onNavigate(item.view); setIsMobileMenuOpen(false); }} className="w-full py-6 rounded-3xl border border-white/5 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">{item.label}</button>
                ))}
             </div>
          </div>
        )}
      </header>

      <main className="flex-1 relative z-10">{children}</main>

      {/* FOOTER UI FIX */}
      <footer className="w-full px-4 md:px-12 pb-8 mt-12 relative z-20">
        <div className="max-w-[1700px] mx-auto flex flex-col items-center gap-6">
          
          <div className="glass-panel w-full px-8 py-4 md:py-6 rounded-[2rem] md:rounded-full border border-white/10 bg-[#050810]/60 backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 overflow-hidden">
            
            {/* SOL: LOGO VE SLOGAN (BÖLME ÇİZGİSİ DÜZELTİLDİ) */}
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="shrink-0 flex items-center justify-center">
                <img 
                  src={content.branding.logoUrl} 
                  className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-all hover:scale-105" 
                  alt="Logo" 
                />
              </div>
              <div className="hidden xl:flex flex-col justify-center gap-0.5 leading-none shrink-0 border-l border-white/10 pl-5 ml-2">
                <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.25em]">{content.branding.footerTagline1 || 'DİJİTAL'}</p>
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.25em]">{content.branding.footerTagline2 || 'DENEYİM'}</p>
                <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.25em]">{content.branding.footerTagline3 || 'MERKEZİ'}</p>
              </div>
            </div>

            {/* ORTA: NAVİGASYON VE YASAL */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex items-center gap-5">
                {activeNavItems.slice(0, 3).map((item, i) => (
                  <React.Fragment key={item.id}>
                    <button onClick={() => onNavigate(item.view)} className="text-[9px] font-black text-white/70 hover:text-orange-500 transition-colors tracking-widest uppercase">{item.label}</button>
                    {i < 2 && i < activeNavItems.length - 1 && <div className="h-2 w-px bg-white/10"></div>}
                  </React.Fragment>
                ))}
              </div>

              <div className="h-6 w-px bg-white/5 mx-1 hidden lg:block"></div>

              <div className="flex items-center gap-5">
                <button onClick={() => onNavigate('KVKK_TEXT')} className="text-[8px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">KVKK</button>
                <button onClick={() => onNavigate('PRIVACY_POLICY')} className="text-[8px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">GİZLİLİK</button>
                <button onClick={() => onNavigate('TERMS_OF_USE')} className="text-[8px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">KOŞULLAR</button>
              </div>
            </div>

            {/* SAĞ: SOSYAL */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="flex items-center gap-3">
                {content.branding.socials.map((social, idx) => {
                  const Icon = SocialIconMap[social.platform] || Globe;
                  return (
                    <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-500 transition-all hover:scale-110 p-2 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-top-1 duration-1000">
             <p className="text-[8px] font-black text-orange-500/60 uppercase tracking-[0.4em] whitespace-nowrap text-center opacity-80 hover:opacity-100 transition-opacity">
                {content.branding.footerText}
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
