import { createClient } from '@supabase/supabase-js';

// املأ البيانات دي من إعدادات مشروعك في Supabase (Project Settings -> API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
