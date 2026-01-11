
import React, { useState, useEffect } from 'react';
import CookieBanner from './components/ui/CookieBanner.tsx';
import HomeView from './views/HomeView.tsx';
import LoginView from './views/LoginView.tsx';
import AdminView from './views/AdminView.tsx';
import BlogView from './views/BlogView.tsx';
import ServicesView from './views/ServicesView.tsx';
import AboutView from './views/AboutView.tsx';
import LegalView from './views/LegalView.tsx';
import ContactView from './views/ContactView.tsx';
import ReferencesView from './views/ReferencesView.tsx';
import ClientView from './views/ClientView.tsx';
import EmployeeView from './views/EmployeeView.tsx';
import FoxIcons from './components/ui/FoxIcons.tsx';
import { ApiService } from './services/api.ts';
import { INITIAL_CONTENT, DEFAULT_USERS } from './data/defaultContent.ts';
import { ViewState, UserRole, SiteContent, ClientProfile, UserAccount, ContactMessage } from './types.ts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('MARKETING');
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const savedUsers = localStorage.getItem('agencyos_users');
    return savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;
  });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const startTime = Date.now();
      
      try {
        const [remoteContent, remoteClients, remoteMessages] = await Promise.all([
          ApiService.getSiteContent(),
          ApiService.getClients(),
          ApiService.getMessages()
        ]);
        
        if (remoteContent) setSiteContent(remoteContent);
        if (remoteClients) setClients(remoteClients);
        if (remoteMessages) setMessages(remoteMessages);
      } catch (err) {
        // Sessiz hata yönetimi - INITIAL_CONTENT zaten set edildi
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 1500 - elapsed);
        setTimeout(() => setIsLoading(false), delay);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (siteContent.branding.logoUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) link.href = siteContent.branding.logoUrl;
    }
    document.title = siteContent.seo.siteTitle || 'Kafamda Kırk Tilki';
  }, [siteContent.branding.logoUrl, siteContent.seo.siteTitle]);

  const handleUpdateContent = async (content: SiteContent) => {
    setSiteContent(content);
    await ApiService.saveSiteContent(content);
  };

  const handleUpdateClients = async (updatedClients: ClientProfile[]) => {
    setClients(updatedClients);
    await ApiService.saveClients(updatedClients);
  };

  const handleAddMessage = async (msg: ContactMessage) => {
    const newMessages = [msg, ...messages];
    setMessages(newMessages);
    await ApiService.sendMessage(msg);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative">
             <div className="w-24 h-24 border-2 border-orange-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
             <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                <FoxIcons type="FoxHead" size={40} className="animate-pulse" />
             </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white font-black text-[10px] uppercase tracking-[0.8em] animate-pulse">AGENCY OS</h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
            <p className="text-slate-500 font-bold text-[8px] uppercase tracking-[0.4em] mt-2">DİJİTAL DENEYİM MERKEZİ YÜKLENİYOR</p>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (currentUser) {
      if (currentUser.role === UserRole.ADMIN && view.startsWith('ADMIN')) {
        return <AdminView 
          content={siteContent} 
          clients={clients} 
          users={users} 
          messages={messages} 
          onLogout={() => {setCurrentUser(null); setView('MARKETING')}} 
          onUpdateContent={handleUpdateContent} 
          onUpdateClients={handleUpdateClients} 
          onUpdateUsers={setUsers} 
          onUpdateMessages={setMessages} 
        />;
      }
      if (currentUser.role === UserRole.CLIENT) {
        return <ClientView content={siteContent} clients={clients} user={currentUser} onLogout={() => {setCurrentUser(null); setView('MARKETING')}} />;
      }
      if (currentUser.role === UserRole.EMPLOYEE) {
        return <EmployeeView content={siteContent} tasks={[]} onLogout={() => {setCurrentUser(null); setView('MARKETING')}} />;
      }
    }

    const isServiceDetail = siteContent.services.some(s => s.id === view);
    const isBlogPostDetail = siteContent.blogPosts.some(p => p.id === view);

    if (view === 'MARKETING') return <HomeView content={siteContent} onNavigate={setView} onAddMessage={handleAddMessage} />;
    if (view === 'SERVICES_LIST') return <ServicesView type="list" siteContent={siteContent} onNavigate={setView} />;
    if (isServiceDetail) return <ServicesView type="detail" view={view} siteContent={siteContent} onNavigate={setView} />;
    if (view === 'BLOG') return <BlogView posts={siteContent.blogPosts} content={siteContent} onNavigate={setView} />;
    if (isBlogPostDetail) return <BlogView posts={siteContent.blogPosts} content={siteContent} onNavigate={setView} initialPostId={view} />;
    if (view === 'REFERENCES') return <ReferencesView content={siteContent} onNavigate={setView} />;
    if (['MANIFESTO', 'ABOUT'].includes(view)) return <AboutView type={view.toLowerCase() as any} content={siteContent} onNavigate={setView} />;
    if (view === 'CONTACT_PAGE') return <ContactView content={siteContent} onNavigate={setView} onAddMessage={handleAddMessage} />;
    if (view === 'LOGIN') return <LoginView content={siteContent} users={users} onLoginAttempt={(u,p) => {
      const user = users.find(x => x.username === u && x.password === p);
      if (user) { 
        setCurrentUser(user);
        if (user.role === UserRole.ADMIN) setView('ADMIN_DASHBOARD');
        else if (user.role === UserRole.CLIENT) setView('CLIENT_PORTAL');
        else setView('EMPLOYEE_PORTAL');
        return true; 
      }
      return false;
    }} onNavigate={setView} />;
    if (['PRIVACY_POLICY', 'KVKK_TEXT', 'TERMS_OF_USE'].includes(view)) return <LegalView type={view as any} content={siteContent} onNavigate={setView} />;
    
    return <HomeView content={siteContent} onNavigate={setView} onAddMessage={handleAddMessage} />;
  };

  return (
    <div className="min-h-screen text-slate-50 overflow-x-hidden relative bg-[#020617]">
      <div className="relative z-10 w-full min-h-screen bg-transparent">
        {renderView()}
      </div>
      <CookieBanner />
    </div>
  );
};

export default App;
