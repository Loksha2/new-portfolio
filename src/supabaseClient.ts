import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wbigjhzgurqxqzmazbhy.supabase.co";
const supabaseAnonKey = "sb_publishable_gyF_p7I8ksWzqgu0uyvbhw_Zh7RKV69";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);