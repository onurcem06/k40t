
import React, { useState } from 'react';
import { BarChart4, Briefcase, Layout, PenTool, MessageSquare, Shield, LogOut, Save, Loader2 } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview.tsx';
import AdminClientManager from '../components/admin/AdminClientManager.tsx';
import AdminCMS from '../components/admin/AdminCMS.tsx';
import AdminBlogManager from '../components/admin/AdminBlogManager.tsx';
import AdminMessages from '../components/admin/AdminMessages.tsx';
import AdminUserManager from '../components/admin/AdminUserManager.tsx';
import { SiteContent, ClientProfile, UserAccount, ContactMessage } from '../types.ts';

interface AdminViewProps {
  content: SiteContent;
  clients: ClientProfile[];
  users: UserAccount[];
  messages: ContactMessage[];
  onLogout: () => void;
  onUpdateContent: (c: SiteContent) => Promise<void>;
  onUpdateClients: (c: ClientProfile[]) => Promise<void>;
  onUpdateUsers: (u: UserAccount[]) => void;
  onUpdateMessages: (m: ContactMessage[]) => void;
}

const AdminView: React.FC<AdminViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState('CMS');
  const [isSaving, setIsSaving] = useState(false);

  const menuItems = [
    { id: 'OVERVIEW', label: 'PERFORMANS', icon: BarChart4 },
    { id: 'CLIENTS', label: 'MARKALAR', icon: Briefcase },
    { id: 'CMS', label: 'İÇERİK STÜDYOSU', icon: Layout },
    { id: 'BLOG', label: 'BLOG YAZARI', icon: PenTool },
    { id: 'MESSAGES', label: 'MESAJLAR', icon: MessageSquare },
    { id: 'USERS', label: 'YETKİLER', icon: Shield },
  ];

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      // Hem içeriği hem müşteri listesini (Meta verileri dahil) sunucuya it
      await Promise.all([
        props.onUpdateContent(props.content),
        props.onUpdateClients(props.clients)
      ]);
      alert("Tüm değişiklikler başarıyla sunucuya kaydedildi ve yayına alındı.");
    } catch (err) {
      alert("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050810] text-slate-200 overflow-hidden font-sans">
      <aside className="w-80 border-r border-white/5 bg-[#080B14] flex flex-col h-full shrink-0 relative z-20">
        <div className="p-10 border-b border-white/5 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
             <img src={props.content.branding.logoUrl} className="h-10 w-auto object-contain" alt="Logo" />
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-orange-500">ADMIN CONTROL</span>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar pt-8">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-950/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button 
            onClick={handleGlobalSave} 
            disabled={isSaving}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            CANLIYA AL
          </button>
          <button onClick={props.onLogout} className="w-full bg-rose-500/10 text-rose-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={14} /> ÇIKIŞ
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-black/20 custom-scrollbar relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'OVERVIEW' && <AdminOverview clients={props.clients} />}
          {activeTab === 'CLIENTS' && <AdminClientManager clients={props.clients} onUpdateClients={props.onUpdateClients} />}
          {activeTab === 'CMS' && (
            <AdminCMS 
              content={props.content} 
              clients={props.clients}
              users={props.users}
              messages={props.messages}
              onUpdateContent={props.onUpdateContent} 
              onUpdateClients={props.onUpdateClients}
              onUpdateUsers={props.onUpdateUsers}
              onUpdateMessages={props.onUpdateMessages}
            />
          )}
          {activeTab === 'BLOG' && <AdminBlogManager posts={props.content.blogPosts} onUpdateContent={props.onUpdateContent} content={props.content} />}
          {activeTab === 'MESSAGES' && <AdminMessages messages={props.messages} onUpdateMessages={props.onUpdateMessages} />}
          {activeTab === 'USERS' && <AdminUserManager users={props.users} onUpdateUsers={props.onUpdateUsers} clients={props.clients} />}
        </div>
      </main>
    </div>
  );
};

export default AdminView;
