import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials
const DEFAULT_SUPABASE_URL = 'https://wsbwuctjqpteiftiapul.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_DmedHnuoDeB_54n8rNqytQ_FP81ztvs';

const metaEnv = (import.meta as any).env || {};
export const supabaseUrl = 
  metaEnv.VITE_SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

export const supabaseAnonKey = 
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || 
  metaEnv.VITE_SUPABASE_ANON_KEY || 
  metaEnv.VITE_SUPABASE_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
