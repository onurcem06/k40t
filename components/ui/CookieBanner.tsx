
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('agencyos_cookie_consent_v2');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('agencyos_cookie_consent_v2', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl animate-fade-up">
      <div className="glass-panel p-6 md:px-8 md:py-5 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl bg-slate-900/60">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-500">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-white text-[11px] font-black uppercase tracking-widest">Çerez Politikası</p>
            <p className="text-slate-400 text-[10px] font-medium leading-tight">
              Size daha iyi bir deneyim sunmak için <span className="text-slate-200">çerezleri</span> kullanıyoruz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none bg-white text-black hover:bg-orange-500 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Check size={14} strokeWidth={4} /> KABUL ET
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-3 text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
