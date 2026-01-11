
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SiteContent, ContactMessage } from '../types.ts';

interface ContactPageProps {
  content: SiteContent;
  onBack: () => void;
  onAddMessage: (msg: ContactMessage) => void;
  hideBackButton?: boolean;
}

const ContactPage: React.FC<ContactPageProps> = ({ content, onBack, onAddMessage, hideBackButton }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    if (!hideBackButton) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [hideBackButton]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    const newMessage: ContactMessage = {
      id: `MSG_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      subject: 'Kurumsal İletişim Formu',
      message: formData.message.trim(),
      date: new Date().toISOString(),
      status: 'new'
    };
    
    setTimeout(() => {
      onAddMessage(newMessage);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-transparent ${hideBackButton ? 'py-16 md:py-24' : 'pt-28 md:pt-40 pb-24'} px-4 md:px-6 animate-in fade-in duration-1000 relative`}>
      <div className="container mx-auto max-w-7xl">
        {!hideBackButton && (
          <button onClick={onBack} className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-12 md:mb-16 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            GERİ
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 space-y-12 md:space-y-16">
            <div className="space-y-6 md:space-y-8">
              <p className="text-orange-500 font-black text-[10px] md:text-[11px] uppercase tracking-[0.6em] animate-fade-up">
                {content.contact.sidebarTopText}
              </p>
              <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] animate-fade-up" style={{ animationDelay: '100ms' }}>
                {content.contact.sidebarMainTitle1} <br/><span className="text-slate-600 italic">{content.contact.sidebarMainTitle2}</span>
              </h1>
              <p className="text-slate-400 text-base md:text-xl font-medium leading-relaxed max-w-md animate-fade-up" style={{ animationDelay: '200ms' }}>
                {content.contact.subtitle}
              </p>
            </div>

            <div className="space-y-8 md:space-y-10 animate-fade-up" style={{ animationDelay: '300ms' }}>
              {content.contact.showEmail && (
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div className="truncate">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">E-POSTA</p>
                    <p className="text-white font-bold text-lg md:text-2xl tracking-tight truncate">{content.contact.email}</p>
                  </div>
                </div>
              )}
              {content.contact.showPhone && (
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">TELEFON</p>
                    <p className="text-white font-bold text-lg md:text-2xl tracking-tight">{content.contact.phone}</p>
                  </div>
                </div>
              )}
              {content.contact.showAddress && (
                <div className="flex items-center gap-6 md:gap-8 group">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">ADRES</p>
                    <p className="text-white font-bold text-lg md:text-2xl tracking-tight whitespace-pre-wrap">{content.contact.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 relative animate-fade-up" style={{ animationDelay: '500ms' }}>
            {formStatus === 'success' ? (
              <div className="glass-panel p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] border border-emerald-500/20 bg-emerald-500/5 min-h-[400px] flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                <CheckCircle2 size={48} className="text-emerald-500 mb-6" />
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase mb-4 tracking-tight">MESAJ ALINDI</h3>
                <p className="text-slate-500 font-medium text-sm md:text-lg mb-10">Tilkilerimiz en kısa sürede dönüş yapacak.</p>
                <button onClick={() => setFormStatus('idle')} className="px-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-orange-600 hover:text-white transition-all">YENİ MESAJ</button>
              </div>
            ) : (
              <div className="glass-panel p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 bg-black/40 shadow-2xl relative overflow-hidden group">
                <div className="text-center mb-10 md:mb-12">
                   <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em]">{content.contact.formTitle}</h3>
                   <p className="text-slate-500 text-[9px] font-black uppercase mt-3 tracking-widest">{content.contact.formSubtitle}</p>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{content.contact.nameLabel}</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white font-bold outline-none focus:border-orange-500/50 transition-all text-xs" placeholder={content.contact.namePlaceholder} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{content.contact.emailLabel}</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white font-bold outline-none focus:border-orange-500/50 transition-all text-xs" placeholder={content.contact.emailPlaceholder} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{content.contact.phoneLabel}</label>
                      <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white font-bold outline-none focus:border-orange-500/50 transition-all text-xs" placeholder={content.contact.phonePlaceholder} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{content.contact.messageLabel}</label>
                    <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl text-white font-bold outline-none focus:border-orange-500/50 transition-all h-32 md:h-44 resize-none text-xs leading-relaxed" placeholder={content.contact.messagePlaceholder} />
                  </div>
                  <button disabled={formStatus === 'sending'} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 md:py-7 rounded-[1.5rem] md:rounded-[1.8rem] transition-all flex items-center justify-center gap-4 text-[11px] md:text-sm uppercase tracking-[0.4em] shadow-2xl shadow-orange-950/40">
                    {formStatus === 'sending' ? "GÖNDERİLİYOR..." : <>{content.contact.buttonText} <Send size={18} /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
