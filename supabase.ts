import { createClient } from '@supabase/supabase-js'

// TEST İÇİN: Doğrudan senin değerlerini buraya yazıyoruz
const supabaseUrl = 'https://uhumcehwtkbsotyacluw.supabase.co'
const supabaseAnonKey = 'sb_publishable_Dcup08i-tg1MmTY7T2g0PA_6AsQaf2a'

console.log("Bağlantı kuruluyor...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey)