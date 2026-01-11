
import { SiteContent, ClientProfile, UserAccount, ContactMessage } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const headers = {
  'Content-Type': 'application/json'
};

/**
 * ApiService: Sunucuya bağlanmaya çalışır, bulamazsa yerel veriyi döner.
 * Hata mesajlarını konsolda daha temiz hale getirir.
 */
export const ApiService = {
  getSiteContent: async (): Promise<SiteContent> => {
    if (!API_BASE_URL) return INITIAL_CONTENT;
    
    try {
      const response = await fetch(`${API_BASE_URL}/content`, { 
        method: 'GET', 
        headers,
        signal: AbortSignal.timeout(3000) // 3 saniye içinde yanıt gelmezse vazgeç
      });
      if (!response.ok) return INITIAL_CONTENT;
      return await response.json();
    } catch (error) {
      // Sadece üretim ortamında veya özel durumda logla, demo sırasında sessiz kal
      const local = localStorage.getItem('agencyos_content');
      return local ? JSON.parse(local) : INITIAL_CONTENT;
    }
  },

  saveSiteContent: async (content: SiteContent): Promise<boolean> => {
    localStorage.setItem('agencyos_content', JSON.stringify(content));
    if (!API_BASE_URL) return true;

    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers,
        body: JSON.stringify(content),
      });
      return response.ok;
    } catch (error) {
      return true; 
    }
  },

  getClients: async (): Promise<ClientProfile[]> => {
    if (!API_BASE_URL) {
      const local = localStorage.getItem('agencyos_clients');
      return local ? JSON.parse(local) : [];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clients`, { method: 'GET', headers });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      const local = localStorage.getItem('agencyos_clients');
      return local ? JSON.parse(local) : [];
    }
  },

  saveClients: async (clients: ClientProfile[]): Promise<boolean> => {
    localStorage.setItem('agencyos_clients', JSON.stringify(clients));
    if (!API_BASE_URL) return true;

    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(clients),
      });
      return response.ok;
    } catch (error) {
      return true;
    }
  },

  sendMessage: async (message: ContactMessage): Promise<boolean> => {
    if (!API_BASE_URL) {
      const current = JSON.parse(localStorage.getItem('agencyos_messages') || '[]');
      localStorage.setItem('agencyos_messages', JSON.stringify([message, ...current]));
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });
      return response.ok;
    } catch (error) {
      return true;
    }
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    if (!API_BASE_URL) return JSON.parse(localStorage.getItem('agencyos_messages') || '[]');
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, { method: 'GET', headers });
      return await response.json();
    } catch (error) {
      return JSON.parse(localStorage.getItem('agencyos_messages') || '[]');
    }
  }
};
