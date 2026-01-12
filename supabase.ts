
import { createClient } from '@supabase/supabase-js';

/**
 * Ortam değişkenlerine güvenli erişim.
 * Vercel'de process.env, Vite'da import.meta.env kullanılır.
 */
const getEnv = (key: string) => {
  // @ts-ignore
  const env = import.meta.env;
  let val = env?.[key] || (typeof process !== 'undefined' ? process.env?.[key] : undefined);
  
  if (val === 'undefined' || val === 'null' || val === '') return undefined;
  return val;
};

/**
 * DİKKAT: 'sb_publishable_...' ile başlayan anahtarlar Supabase'in yeni mimarisine aittir.
 * Standart tablo sorguları (SELECT/INSERT) genellikle 'anon public' (eyJ... ile başlayan) 
 * anahtarını gerektirir. Eğer 'Invalid API Key' hatası alıyorsanız, 
 * lütfen Dashboard -> Settings -> API sayfasındaki 'anon' anahtarını kullanın.
 */
const FALLBACK_URL = 'https://uhumcehwtkbsotyacluw.supabase.co';
const FALLBACK_KEY = 'sb_publishable_DcfOUmjkw43oi7X7XKGNZA_M9l6O2qV'; 

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || FALLBACK_KEY;

let client = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    // Temel URL doğrulaması
    new URL(supabaseUrl);
    
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: { 'x-application-name': 'agency-os' }
      }
    });

    // Başlangıçta anahtar formatı kontrolü
    if (supabaseAnonKey.startsWith('sb_publishable')) {
      console.info("%c[Supabase Bilgi]:%c 'sb_publishable' formatında bir anahtar kullanılıyor. Veri çekme hatası alırsanız Dashboard'dan 'anon' key'i alıp güncelleyin.", "color: #f97316; font-weight: bold", "color: inherit");
    }
  } catch (e) {
    console.warn("Supabase başlatılamadı: Geçersiz parametreler.");
  }
}

export const supabase = client;
