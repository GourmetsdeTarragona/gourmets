
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://redojogbxdtqxqzxvyhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZG9qb2dieGR0cXhxenh2eWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjM1NTAsImV4cCI6MjA1OTMzOTU1MH0.HZMMSs3PWH1g2m00nr9Gczgz4DCIdU36nSvk_Sg8M68';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
