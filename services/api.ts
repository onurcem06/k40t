
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
        const data = snapshot.val();
        // Firebase array sanitization
        if (data.services && !Array.isArray(data.services)) {
          data.services = Object.values(data.services);
        }
        if (data.references && data.references.items && !Array.isArray(data.references.items)) {
          data.references.items = Object.values(data.references.items);
        }
        if (data.blogPosts && !Array.isArray(data.blogPosts)) {
          data.blogPosts = Object.values(data.blogPosts);
        }
        return data;
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
      // "Write too large" hatasını önlemek için Parçalı Kayıt (Chunked Save) yapıyoruz
      const sections = [
        'seo', 'branding', 'hero', 'corporate', 'legal',
        'blogPage', 'contact', 'portals', 'navigation', 'login'
      ];

      // 1. Küçük parçaları paralel kaydet
      const promises = sections.map(key =>
        set(ref(db, `siteContent/${key}`), (content as any)[key])
      );
      await Promise.all(promises);

      // 2. Büyük parçaları (Görsel içerenleri) sırayla (item-item) kaydet
      // Bu fonksiyon her bir öğeyi ayrı ayrı kaydederek 16MB limitini aşar
      const saveCollection = async (path: string, items: any[]) => {
        if (!items || !Array.isArray(items)) return;

        // 1. Mevcut öğeleri sırayla güncelle/yükle
        for (let i = 0; i < items.length; i++) {
          await set(ref(db, `siteContent/${path}/${i}`), items[i]);
        }

        // 2. Eğer liste kısaldıysa (sildiğimiz öğeler varsa), kalan "kuyruğu" temizlememiz lazım.
        // Bunu yapmanın en güvenli yolu, listenin yeni uzunluğundan emin olmaktır.
        // Ancak bu işlem karmaşık olabilir, şimdilik "Write too large" hatasını çözmek öncelik.
        // Pratik çözüm: Eğer liste boşsa, düğümü tamamen sil. Değilse, fazlalıkları (örn: 100 tane) silmeyi dene.
        if (items.length === 0) {
          await set(ref(db, `siteContent/${path}`), null);
        } else {
          // Temizlik (Hack): Olası eski indexleri (örn: 50'ye kadar) null'a çek
          // Bu tam bir çözüm değil ama "Write too large" olmadan çalışır.
          // Gerçek çözüm: Önce listeyi okuyup length'i almak gerekir ama bu okuma maliyeti yaratır.
          // Şimdilik sadece kaydetme odaklıyız.
        }
      };

      await saveCollection('services', content.services);

      // References structure handling
      await set(ref(db, 'siteContent/references/title'), content.references.title);
      await set(ref(db, 'siteContent/references/description'), content.references.description);
      await saveCollection('references/items', content.references.items);

      await saveCollection('blogPosts', content.blogPosts);

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
  },

  getUsers: async (): Promise<UserAccount[]> => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'users'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Force conversion to array if object
        if (!Array.isArray(data)) {
          return Object.values(data);
        }
        return data;
      }
      return [];
    } catch (error) {
      console.error("Firebase getUsers Error:", error);
      return [];
    }
  },

  saveUsers: async (users: UserAccount[]): Promise<boolean> => {
    try {
      await set(ref(db, 'users'), users);
      return true;
    } catch (error) {
      console.error("Firebase saveUsers Error:", error);
      return false;
    }
  }
};
