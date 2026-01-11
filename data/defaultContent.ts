
import { SiteContent, UserRole, UserAccount } from '../types.ts';
import { MOCK_BLOG_POSTS } from './blogPosts.ts';

export const INITIAL_CONTENT: SiteContent = {
  seo: { siteTitle: 'AgencyOS | Kafamda Kırk Tilki', siteDescription: 'Dijital Reklam ve Veri Ajansı Deneyimi.', metaKeywords: 'reklam, ajans, veri, pazarlama' },
  navigation: [
    { id: 'NAV_SERVICES', label: 'Hizmetler', view: 'SERVICES_LIST', isEnabled: true },
    { id: 'NAV_ABOUT', label: 'Hakkımızda', view: 'ABOUT', isEnabled: true },
    { id: 'NAV_BLOG', label: 'Blog', view: 'BLOG', isEnabled: true },
    { id: 'NAV_REFS', label: 'Referanslar', view: 'REFERENCES', isEnabled: true },
    { id: 'NAV_CONTACT', label: 'İletişim', view: 'CONTACT_PAGE', isEnabled: true }
  ],
  references: { title: 'REFERANSLARIMIZ', description: 'Birlikte avlandığımız markalar ve başarı hikayelerimiz.', items: [] },
  branding: {
    logoUrl: 'https://drive.google.com/uc?export=view&id=19gNN5Jnqz_Qy6qszIbdXR4lXXdJcXuPK',
    socials: [
      { platform: 'Instagram', url: 'https://instagram.com/agencyos' },
      { platform: 'Linkedin', url: 'https://linkedin.com/company/agencyos' }
    ],
    footerText: '© 2025 KAFAMDA KIRK TİLKİ. TÜM HAKLARI SAKLIDIR.',
    footerTagline1: 'DİJİTAL', footerTagline2: 'DENEYİM', footerTagline3: 'MERKEZİ'
  },
  login: { title: 'AGENCY OS ERİŞİM', subtext: 'Kafamda Kırk Tilki Dijital Deneyim Merkezi' },
  hero: { 
    titlePart1: 'ZİHNİMİZDE', titlePart2: 'TİLKİLER', titlePart3: 'DOLAŞIYOR', 
    subtitle: 'Geleneksel reklamcılığın sınırlarını yaratıcı zeka ve klinik veri ile aşıyoruz.', 
    primaryCTA: 'STRATEJİNİZİ OLUŞTURUN', secondaryCTA: 'MANIFESTO' 
  },
  corporate: { 
    manifesto: { title: 'TİLKİ MANİFESTOSU', content: 'Biz sadece reklam yapmıyoruz; markaların ruhunu dijitalde bulup gün yüzüne çıkarıyoruz.', icon: 'FoxHead' }, 
    about: { title: 'YAKLAŞIMIMIZ', content: 'Stratejimiz Gözlemle, Analiz Et ve Harekete Geç üzerine kurulu.', icon: 'Target' } 
  },
  legal: { privacy: "...", kvkk: "...", terms: "..." },
  services: [
    { id: 'S1', title: 'PERFORMANS PAZARLAMASI', tagline: 'ROAS Odaklı Büyüme', desc: 'Veri odaklı reklam yönetimi.', iconType: 'TrendingUp', image: '', accent: '#f97316', features: ['Meta Ads', 'Google Ads'], detailedDesc: '...', detailedImages: [] }
  ],
  blogPosts: MOCK_BLOG_POSTS,
  blogPage: { topTitle: 'HABERLER VE İÇERİKLER', mainTitle1: 'TILKI', mainTitle2: 'GÜNCESİ', description: 'Sektörel öngörülerimiz.' },
  contact: {
    sidebarTopText: 'TEMAS KURUN', sidebarMainTitle1: 'BİRLİKTE', sidebarMainTitle2: 'AVLANALIM.',
    subtitle: 'Markanızın dijital dünyadaki ayak izlerini güçlendirmeye hazırız.',
    formTitle: 'PROJE TALEP FORMU', formSubtitle: 'DİJİTAL DÖNÜŞÜMÜNÜZ BURADA BAŞLIYOR',
    email: 'hello@kafamdakirktilki.com', phone: '+90 (212) 000 00 00', address: 'Levent, İstanbul',
    showEmail: true, showPhone: true, showAddress: true,
    nameLabel: 'KİMLİK BİLGİLERİ', namePlaceholder: 'Adınız ve Soyadınız',
    emailLabel: 'E-POSTA', emailPlaceholder: 'hello@company.com',
    phoneLabel: 'İRTİBAT', phonePlaceholder: '05xx xxx xx xx',
    messageLabel: 'PROJE ÖZETİ', messagePlaceholder: 'Hayalinizdeki projeden bahsedin...',
    buttonText: 'MESAJI GÖNDER'
  },
  portals: {
    client: { welcomeMsg: 'PANELİNİZE HOŞ GELDİNİZ', metricsHeader: 'REKLAM PERFORMANSI', projectsHeader: 'PMI PROJE TAKİBİ' },
    employee: { welcomeMsg: 'GÜNAYDIN, EKİP ARKADAŞIM', tasksHeader: 'GÜNLÜK GÖREV LİSTESİ' }
  }
};

export const DEFAULT_USERS: UserAccount[] = [
  { id: 'admin1', username: 'admin', password: '123', role: UserRole.ADMIN, permissions: { canViewPerformance: true, canEditTasks: true, canUploadAssets: true, canViewFinancials: true } }
];
