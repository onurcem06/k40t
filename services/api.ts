
import { SiteContent, ClientProfile, UserAccount, ContactMessage } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';

import { db } from '../firebase';
import { ref, get, set, child, push } from 'firebase/database';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''; // No longer needed


/**
 * ApiService: Sunucuya bağlanmaya çalışır, bulamazsa yerel veriyi döner.
 * Hata mesajlarını konsolda daha temiz hale getirir.
 */
export const ApiService = {
  getSiteContent: async (): Promise<SiteContent> => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'siteContent'));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Veritabanında yoksa varsayılanı yükle ve veritabanına kaydet
        await set(ref(db, 'siteContent'), INITIAL_CONTENT);
        return INITIAL_CONTENT;
      }
    } catch (error) {
      console.error("Firebase getSiteContent Error:", error);
      return INITIAL_CONTENT;
    }
  },

  saveSiteContent: async (content: SiteContent): Promise<boolean> => {
    try {
      await set(ref(db, 'siteContent'), content);
      return true;
    } catch (error) {
      console.error("Firebase saveSiteContent Error:", error);
      return false;
    }
  },

  getClients: async (): Promise<ClientProfile[]> => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'clients'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Firebase array'leri objeye çevirebilir, bu yüzden kontrol et
        return Array.isArray(data) ? data : Object.values(data);
      }
      return [];
    } catch (error) {
      console.error("Firebase getClients Error:", error);
      return [];
    }
  },

  saveClients: async (clients: ClientProfile[]): Promise<boolean> => {
    try {
      await set(ref(db, 'clients'), clients);
      return true;
    } catch (error) {
      console.error("Firebase saveClients Error:", error);
      return false;
    }
  },

  sendMessage: async (message: ContactMessage): Promise<boolean> => {
    try {
      // Mesajları benzersiz ID'lerle listeye ekle
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, message);
      return true;
    } catch (error) {
      console.error("Firebase sendMessage Error:", error);
      return false;
    }
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'messages'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Object to array conversion for list display
        return Object.keys(data).map(key => ({
          ...data[key],
          // Eğer id yoksa key'i id olarak kullanabiliriz, ama types.ts'deki yapıya bağlı
        })).reverse(); // En yeniden eskiye
      }
      return [];
    } catch (error) {
      console.error("Firebase getMessages Error:", error);
      return [];
    }
  }
};
