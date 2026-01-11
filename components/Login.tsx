
import React, { useState } from 'react';
import { ArrowRight, Lock, Loader2, User, ShieldAlert } from 'lucide-react';
import { UserAccount } from '../types.ts';

interface LoginProps {
  users: UserAccount[];
  onLoginAttempt: (username: string, password: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ users, onLoginAttempt }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Güvenlik simülasyonu için kısa bir gecikme
    setTimeout(() => {
      // Trim ekleyerek boşluk hatalarını önle
      const success = onLoginAttempt(username.trim(), password);
      if (!success) {
        setError("Giriş bilgileri hatalı veya yetkisiz erişim denemesi.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center p-6 relative">
      <div className="glass-panel w-full max-w-lg p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative border border-white/10 z-10 animate-in zoom-in-95 duration-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">KULLANICI ADI</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(null); }}
                className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/30 font-bold transition-all placeholder:text-slate-700"
                placeholder="Kullanıcı adınızı girin..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ŞİFRE</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-emerald-500/30 font-bold transition-all placeholder:text-slate-700"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={16} />
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-4 group text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "SİSTEME ERİŞİM SAĞLA"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] text-center">
            AGENCY OS SECURE LOGIN GATEWAY
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
