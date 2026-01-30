
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "ATTENTION: Configuration Supabase incomplète.\n" +
    "Assurez-vous que SUPABASE_URL et SUPABASE_ANON_KEY sont définis dans vos variables d'environnement."
  );
}

// Instantiate with fallbacks to prevent crash on load
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
