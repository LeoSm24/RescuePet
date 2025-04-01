import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ycifjthxbmzgjukbxfki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljaWZqdGh4Ym16Z2p1a2J4ZmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjUzMTIsImV4cCI6MjA1OTA0MTMxMn0.4TSsLzYKSlo8Cc_dgwgfIluh9mLD18KH02z7Trhrwv8';

export const supabase = createClient(supabaseUrl, supabaseKey);
