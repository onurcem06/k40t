
import React from 'react';
import Login from '../../components/Login.tsx';
import { UserRole, ViewState, SiteContent, UserAccount } from '../../types.ts';

interface LoginPageProps {
  content: SiteContent;
  users: UserAccount[];
  onLoginAttempt: (username: string, password: string) => boolean;
  onNavigate: (view: ViewState) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ content, users, onLoginAttempt, onNavigate }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button 
        onClick={() => onNavigate('MARKETING')}
        className="fixed top-8 left-8 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors z-50"
      >
        ← Ana Sayfa
      </button>
      
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="mb-6 inline-block">
            <img src={content.branding.logoUrl} alt="Logo" className="h-20 md:h-28 w-auto object-contain drop-shadow-2xl" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{content.login.title}</h2>
          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{content.login.subtext}</p>
        </div>
        <Login users={users} onLoginAttempt={onLoginAttempt} />
      </div>
    </div>
  );
};

export default LoginPage;
