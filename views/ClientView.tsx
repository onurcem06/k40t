
import React, { useState } from 'react';
import { LayoutDashboard, Activity, Image as ImageIcon, LogOut } from 'lucide-react';
import ClientOverview from '../components/client/ClientOverview.tsx';
import ClientAssets from '../components/client/ClientAssets.tsx';
import ClientWorkPlan from '../components/client/ClientWorkPlan.tsx';
import { SiteContent, ClientProfile, UserAccount } from '../types.ts';

interface ClientViewProps {
  content: SiteContent;
  clients: ClientProfile[];
  user: UserAccount;
  onLogout: () => void;
}

const ClientView: React.FC<ClientViewProps> = ({ content, clients, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const myClient = clients.find(c => c.id === user.clientId) || clients[0];

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 glass-panel border-r border-white/5 flex flex-col h-full bg-[#080B14]/80 relative z-20">
        <div className="p-10 border-b border-white/5 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <img src={content.branding.logoUrl} className="h-8 w-auto object-contain" alt="Logo" />
          </div>
          <span className="font-black text-orange-500 text-[10px] uppercase tracking-[0.4em]">CLIENT OS</span>
        </div>
        
        <nav className="flex-1 p-8 space-y-2">
          {[
            { id: 'OVERVIEW', label: 'GENEL BAKIŞ', icon: LayoutDashboard },
            { id: 'ASSETS', label: 'VARLIKLAR', icon: ImageIcon },
            { id: 'PLAN', label: 'İŞ PLANI', icon: Activity },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/20 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full bg-rose-500/10 text-rose-500 py-5 rounded-[1.8rem] font-black text-[9px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all">GÜVENLİ ÇIKIŞ</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950/30 relative z-10">
        <header className="glass-panel p-10 border-b border-white/5 flex justify-between items-center backdrop-blur-3xl">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">HOŞ GELDİNİZ</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{myClient.name} PERFORMANS MERKEZİ</p>
          </div>
          <div className="w-16 h-16 bg-white p-3 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
             <img src={myClient.logo} className="w-full h-auto object-contain" alt="Client Logo" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'OVERVIEW' && <ClientOverview client={myClient} />}
            {activeTab === 'ASSETS' && <ClientAssets client={myClient} />}
            {activeTab === 'PLAN' && <ClientWorkPlan client={myClient} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientView;
