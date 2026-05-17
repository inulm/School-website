// =============================================
// SUPABASE CONFIGURATION
// Replace these values with your Supabase project credentials
// Go to: https://supabase.com → Your Project → Settings → API
// =============================================

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// Initialize Supabase client (loaded via CDN in HTML)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
