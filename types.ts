
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT'
}

export interface UserPermissions {
  canViewPerformance: boolean;
  canEditTasks: boolean;
  canUploadAssets: boolean;
  canViewFinancials: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  clientId?: string;
  permissions: UserPermissions;
}

export interface Asset {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  date: string;
}

export interface NavItem {
  id: string;
  label: string;
  view: string;
  isEnabled: boolean;
}

export interface ReferenceItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  link: string;
  workImages: string[];
}

export interface ClientVisibility {
  showSpend: boolean;
  showRoas: boolean;
  showVisits: boolean;
  showPlan: boolean;
  showAssets: boolean;
  showBudget: boolean;
}

export interface SocialMediaPlan {
  targetPosts: number;
  completedPosts: number;
  targetVideos: number;
  completedVideos: number;
  currentAdsBudget: string;
  status: 'Hazırlanıyor' | 'Yayında' | 'Onay Bekliyor' | 'Tamamlandı';
  totalViews: string;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export interface MonthlyData {
  spend: string;
  roas: string;
  visits: string;
  agencyRevenue: string;
  plan: SocialMediaPlan;
  metaData?: MetaCampaign[];
}

export interface ClientProfile {
  id: string;
  name: string;
  logo: string;
  visibility: ClientVisibility;
  assets: Asset[];
  monthlyHistory: Record<string, MonthlyData>;
  metaSettings?: {
    accessToken: string;
    adAccountId: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  iconType: string;
  image: string;
  accent: string;
  features: string[];
  detailedDesc: string;
  detailedImages: string[];
}

export type BlogBlockType = 'p' | 'h1' | 'h2' | 'img' | 'ul' | 'quote';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  content: string;
  listItems?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  blocks: BlogBlock[];
  content?: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: string;
}

export interface SiteContent {
  seo: {
    siteTitle: string;
    siteDescription: string;
    metaKeywords: string;
  };
  navigation: NavItem[];
  references: {
    title: string;
    description: string;
    items: ReferenceItem[];
  };
  branding: { 
    logoUrl: string; 
    socials: { platform: string; url: string }[];
    footerText: string;
    footerTagline1: string;
    footerTagline2: string;
    footerTagline3: string;
  };
  login: { title: string; subtext: string };
  hero: {
    titlePart1: string;
    titlePart2: string;
    titlePart3: string;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
  };
  corporate: {
    manifesto: { title: string; content: string; icon: string };
    about: { title: string; content: string; icon: string };
  };
  legal: {
    privacy: string;
    kvkk: string;
    terms: string;
  };
  services: ServiceItem[];
  blogPosts: BlogPost[];
  blogPage: {
    topTitle: string;
    mainTitle1: string;
    mainTitle2: string;
    description: string;
  };
  contact: {
    sidebarTopText: string;
    sidebarMainTitle1: string;
    sidebarMainTitle2: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    email: string;
    phone: string;
    address: string;
    showEmail: boolean;
    showPhone: boolean;
    showAddress: boolean;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    buttonText: string;
  };
  portals: {
    client: { welcomeMsg: string; metricsHeader: string; projectsHeader: string };
    employee: { welcomeMsg: string; tasksHeader: string };
  };
}

export type ViewState = string;
