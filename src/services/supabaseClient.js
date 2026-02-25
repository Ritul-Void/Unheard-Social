import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_PROJECT_URL';
const PUBLISHABLE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_PUBLISHABLE_ANON_KEY';

export const supabase = createClient(PROJECT_URL, PUBLISHABLE_ANON_KEY);
