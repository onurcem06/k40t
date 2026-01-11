
import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Clapperboard, Share2, Target, Palette, Instagram, Linkedin, Twitter, Youtube, Facebook, Globe, Monitor, Shield, TrendingUp, Mail, Phone, MapPin, Send, CheckCircle2, Lock
} from 'lucide-react';
import FoxIcons, { FoxIconType } from '../components/ui/FoxIcons.tsx';
import { SiteContent, ViewState, ContactMessage } from '../types.ts';

interface MarketingHomeProps {
  content: SiteContent;
  onLoginClick: () => void;
  onServiceClick: (serviceId: string) => void;
  onNavigate: (view: ViewState) => void;
  onAddMessage: (msg: ContactMessage) => void;
}

const IconMap: { [key: string]: any } = {
  Share2, Clapperboard, Target, Palette, Sparkles, Monitor, Shield, TrendingUp, Globe
};

const SocialIconMap: { [key: string]: any } = {
  Instagram, Linkedin, Twitter, Youtube, Facebook, Globe
};

const MarketingHome: React.FC<MarketingHomeProps> = ({ content, onLoginClick, onServiceClick, onNavigate, onAddMessage }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const navigateToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onNavigate('CONTACT_PAGE');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    const newMessage: ContactMessage = {
      id: `MSG_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim() || 'Ana Sayfa İletişim',
      message: formData.message.trim(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setTimeout(() => {
      onAddMessage(newMessage);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const renderIcon = (iconName: string, size = 32) => {
    const FoxIconNames = ['FoxHead', 'FoxSitting', 'FoxRunning', 'FoxSleeping', 'FoxAlert'];
    if (FoxIconNames.includes(iconName)) {
      return <FoxIcons type={iconName as FoxIconType} size={size} />;
    }
    const IconComp = IconMap[iconName] || Target;
    return <IconComp size={size} />;
  };

  return (
    <main className="flex min-h-screen flex-col relative overflow-x-hidden bg-transparent">
      {/* Header */}
      <header className="container mx-auto px-6 md:px-10 py-8 md:py-12 flex justify-between items-center relative z-20 animate-in fade-in duration-700">
        <div onClick={() => onNavigate('MARKETING')} className="flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
          <img src={content.branding.logoUrl} alt="Logo" className="h-14 md:h-20 w-auto object-contain drop-shadow-2xl" />
        </div>

        <nav className="hidden lg:flex items-center gap-2 glass-panel p-2 rounded-[1.8rem] border border-white/10 bg-black/40 shadow-2xl">
          <button onClick={() => onNavigate('SERVICES_LIST')} className="px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:bg-white/5 transition-all">Hizmetler</button>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <button onClick={() => onNavigate('ABOUT')} className="px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:bg-white/5 transition-all">Hakkımızda</button>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <button onClick={() => onNavigate('BLOG')} className="px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:bg-white/5 transition-all">Blog</button>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <button onClick={navigateToContact} className="px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:bg-white/5 transition-all">İletişim</button>
        </nav>

        <div className="glass-panel p-2 rounded-[1.8rem] border border-white/10 bg-black/40 shadow-2xl flex items-center">
          <button onClick={onLoginClick} className="px-6 md:px-8 py-2.5 md:py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:text-orange-500 hover:bg-white/5 transition-all flex items-center gap-3 group/login">
            <Lock size={12} className="text-orange-500 group-hover/login:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Giriş Yap</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-10 py-16 md:py-32 lg:py-48 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-7xl lg:text-[7.5rem] font-black text-white mb-8 leading-[1] tracking-tighter uppercase animate-in slide-in-from-bottom-10 duration-1000">
          <span className="block opacity-90">{content.hero.titlePart1}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-orange-500">{content.hero.titlePart2}</span>
          <span className="block opacity-90">{content.hero.titlePart3}</span>
        </h1>
        <p className="text-slate-400 text-base md:text-xl leading-relaxed font-medium max-w-3xl mb-12 opacity-80">{content.hero.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-6">
          <button onClick={() => onNavigate('SERVICES_LIST')} className="px-10 md:px-14 py-5 md:py-6 bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-orange-900/40">
            {content.hero.primaryCTA} <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={() => onNavigate('MANIFESTO')} className="px-10 md:px-14 py-5 md:py-6 bg-white/5 text-white border border-white/10 hover:border-white/25 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all backdrop-blur-xl flex items-center justify-center gap-3">
            <FoxIcons type="FoxHead" size={18} className="text-orange-500" /> {content.hero.secondaryCTA}
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-6 md:px-10 py-20 relative z-10" id="services">
        <div className="mb-12">
          <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">UZMANLIK ALANLARIMIZ</p>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">NELER <span className="text-slate-600">YAPIYORUZ?</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((s) => (
            <article key={s.id} onClick={() => onServiceClick(s.id)} className="glass-panel p-10 rounded-[3.5rem] border border-white/5 transition-all duration-500 group cursor-pointer hover:-translate-y-2 flex flex-col hover:border-orange-500/40 hover:shadow-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-orange-500 border border-white/10 mb-8 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xl">
                {renderIcon(s.iconType, 32)}
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-none">{s.title}</h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed line-clamp-3">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer vb. bölümler aynı kalabilir, ana görsel ve navigasyon fixleri Layout içinde halledildi */}
    </main>
  );
};

export default MarketingHome;
