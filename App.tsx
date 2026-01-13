
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
  // Loading state removed for immediate render
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [remoteContent, remoteClients, remoteMessages, remoteUsers] = await Promise.all([
          ApiService.getSiteContent(),
          ApiService.getClients(),
          ApiService.getMessages(),
          ApiService.getUsers()
        ]);

        if (remoteContent) setSiteContent(remoteContent);
        if (remoteClients) setClients(remoteClients);
        if (remoteMessages) setMessages(remoteMessages);
        if (remoteUsers && remoteUsers.length > 0) {
          setUsers(remoteUsers);
          localStorage.setItem('agencyos_users', JSON.stringify(remoteUsers));
        }
      } catch (err) {
        console.error("Data init error", err);
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

  const handleUpdateUsers = async (updatedUsers: UserAccount[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('agencyos_users', JSON.stringify(updatedUsers));
    await ApiService.saveUsers(updatedUsers);
  };

  const handleAddMessage = async (msg: ContactMessage) => {
    const newMessages = [msg, ...messages];
    setMessages(newMessages);
    await ApiService.sendMessage(msg);
  };

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
                onUpdateUsers={handleUpdateUsers}
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
