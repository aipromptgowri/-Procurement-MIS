import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://odgkpzugflmrgeezrnpm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZ2twenVnZmxtcmdlZXpybnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODYyNDksImV4cCI6MjA4MDc2MjI0OX0.cMzHrQg3qBzh5L9vCjgsIZTbiWXROKEoILrpD7sDFuE';

export const supabase = createClient(supabaseUrl, supabaseKey);