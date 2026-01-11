
import React from 'react';
import { ArrowLeft, Shield, Gavel, FileText } from 'lucide-react';
import { ViewState, SiteContent } from '../types.ts';

interface LegalPageProps {
  type: 'PRIVACY_POLICY' | 'KVKK_TEXT' | 'TERMS_OF_USE';
  content: SiteContent;
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, content, onBack }) => {
  const configs = {
    PRIVACY_POLICY: {
      title: 'GİZLİLİK POLİTİKASI',
      icon: Shield,
      text: content.legal.privacy
    },
    KVKK_TEXT: {
      title: 'KVKK AYDINLATMA METNİ',
      icon: FileText,
      text: content.legal.kvkk
    },
    TERMS_OF_USE: {
      title: 'KULLANIM KOŞULLARI',
      icon: Gavel,
      text: content.legal.terms
    }
  };

  const current = configs[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="container mx-auto max-w-4xl">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          GERİ DÖN
        </button>

        <div className="glass-panel p-10 md:p-16 rounded-[3.5rem] border border-white/5 relative overflow-hidden bg-slate-900/10">
          <div className="flex items-center gap-6 mb-12">
            <div className="bg-orange-500/10 p-5 rounded-3xl text-orange-500">
              <Icon size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{current.title}</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">
              {current.text || "Bu içerik henüz düzenlenmemiş."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
