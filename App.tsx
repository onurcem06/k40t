
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
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

// Wrapper Components defined outside App to prevent re-mounts
const ServiceWrapper = ({ siteContent, onNavigate }: { siteContent: SiteContent, onNavigate: (v: ViewState) => void }) => {
  const { id } = useParams();
  return <ServicesView type="detail" view={id} siteContent={siteContent} onNavigate={onNavigate} />;
};

const BlogWrapper = ({ siteContent, onNavigate }: { siteContent: SiteContent, onNavigate: (v: ViewState) => void }) => {
  const { id } = useParams();
  return <BlogView posts={siteContent.blogPosts} content={siteContent} onNavigate={onNavigate} initialPostId={id} />;
};

const App: React.FC = () => {

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

  const handleUpdateContent = (content: SiteContent) => {
    setSiteContent(content);
  };

  const handleSaveContent = async (content: SiteContent) => {
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

  const navigate = useNavigate();
  // const [view, setView] = useState<ViewState>('MARKETING'); // Removed

  // Navigation Logic
  const handleNavigate = (view: ViewState) => {
    const staticRoutes: { [key: string]: string } = {
      'MARKETING': '/',
      'HOME': '/',
      'SERVICES_LIST': '/hizmetler',
      'BLOG': '/blog',
      'REFERENCES': '/referanslar',
      'MANIFESTO': '/manifesto',
      'ABOUT': '/hakkimizda',
      'CONTACT_PAGE': '/iletisim',
      'LOGIN': '/giris',
      'ADMIN_DASHBOARD': '/admin',
      'CLIENT_PORTAL': '/portal',
      'EMPLOYEE_PORTAL': '/calisan',
      'PRIVACY_POLICY': '/gizlilik-politikasi',
      'KVKK_TEXT': '/kvkk',
      'TERMS_OF_USE': '/kullanim-kosullari',
    };

    if (staticRoutes[view]) {
      navigate(staticRoutes[view]);
      return;
    }

    if (siteContent.services.some(s => s.id === view)) {
      navigate(`/hizmetler/${view}`);
      return;
    }
    if (siteContent.blogPosts.some(p => p.id === view)) {
      navigate(`/blog/${view}`);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen text-slate-50 overflow-x-hidden relative bg-[#020617]">
      <div className="relative z-10 w-full min-h-screen bg-transparent">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeView content={siteContent} onNavigate={handleNavigate} onAddMessage={handleAddMessage} />} />
          <Route path="/hizmetler" element={<ServicesView type="list" siteContent={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/hizmetler/:id" element={<ServiceWrapper siteContent={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/blog" element={<BlogView posts={siteContent.blogPosts} content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/blog/:id" element={<BlogWrapper siteContent={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/referanslar" element={<ReferencesView content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/manifesto" element={<AboutView type="manifesto" content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/hakkimizda" element={<AboutView type="about" content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/iletisim" element={<ContactView content={siteContent} onNavigate={handleNavigate} onAddMessage={handleAddMessage} />} />

          {/* Legal Routes */}
          <Route path="/gizlilik-politikasi" element={<LegalView type="PRIVACY_POLICY" content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/kvkk" element={<LegalView type="KVKK_TEXT" content={siteContent} onNavigate={handleNavigate} />} />
          <Route path="/kullanim-kosullari" element={<LegalView type="TERMS_OF_USE" content={siteContent} onNavigate={handleNavigate} />} />

          {/* Login & Protected Routes */}
          <Route path="/giris" element={
            <LoginView content={siteContent} users={users} onLoginAttempt={(u, p) => {
              const user = users.find(x => x.username === u && x.password === p);
              if (user) {
                setCurrentUser(user);
                if (user.role === UserRole.ADMIN) navigate('/admin');
                else if (user.role === UserRole.CLIENT) navigate('/portal');
                else navigate('/calisan');
                return true;
              }
              return false;
            }} onNavigate={handleNavigate} />
          } />

          <Route path="/admin" element={
            currentUser?.role === UserRole.ADMIN ? (
              <AdminView
                content={siteContent}
                clients={clients}
                users={users}
                messages={messages}
                onLogout={() => { setCurrentUser(null); navigate('/'); }}
                onUpdateContent={handleUpdateContent}
                onSaveContent={handleSaveContent}
                onUpdateClients={handleUpdateClients}
                onUpdateUsers={setUsers}
                onUpdateMessages={setMessages}
              />
            ) : <Navigate to="/giris" />
          } />

          <Route path="/portal" element={
            currentUser?.role === UserRole.CLIENT ? (
              <ClientView content={siteContent} clients={clients} user={currentUser} onLogout={() => { setCurrentUser(null); navigate('/'); }} />
            ) : <Navigate to="/giris" />
          } />

          <Route path="/calisan" element={
            currentUser?.role === UserRole.EMPLOYEE ? (
              <EmployeeView content={siteContent} tasks={[]} onLogout={() => { setCurrentUser(null); navigate('/'); }} />
            ) : <Navigate to="/giris" />
          } />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <CookieBanner />
    </div>
  );
};

export default App;
