import { createClient } from '@supabase/supabase-js';

// 1. Try to get keys from Environment Variables (Vite/Vercel standard)
// 2. Fallback to hardcoded demo keys if env vars are missing
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://odgkpzugflmrgeezrnpm.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZ2twenVnZmxtcmdlZXpybnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYyNDksImV4cCI6MjA4MDc2MjI0OX0.cMzHrQg3qBzh5L9vCjgsIZTbiWXROKEoILrpD7sDFuE';

export const supabase = createClient(supabaseUrl, supabaseKey);