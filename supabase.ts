console.log("Supabase URL yüklendi mi?:", !!import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key yüklendi mi?:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
import { createClient } from '@supabase/supabase-js'

// TypeScript'e 'env' özelliğinin var olduğunu bu şekilde anlatıyoruz
const env = (import.meta as any).env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("KRİTİK HATA: Supabase anahtarları .env.local dosyasından okunamadı!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)