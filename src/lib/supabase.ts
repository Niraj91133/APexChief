import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ndvzzpyyctbbywvbrnzj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdnp6cHl5Y3RiYnl3dmJybnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzczNjksImV4cCI6MjEwNDExMzM2OX0.nu42l_-RE6NPY0eUe9fKO1jhjrqmxC3nNNxYo9hHPOU';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdnp6cHl5Y3RiYnl3dmJybnpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODUzNzM2OSwiZXhwIjoyMTA0MTEzMzY5fQ.dDtdisngxTjm6pIV_Xq51ttMa3MHxiRBUUOB60e30EE';

// Client for browser and general queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with full bypass privileges (for server-side sync & API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
