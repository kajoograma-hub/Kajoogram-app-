
import { createClient } from "@supabase/supabase-js";

// Access environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.warn("Supabase URL is missing. Authentication will fail.");
}

// Initialize Supabase client
// Use a placeholder URL if missing to prevent the "supabaseUrl is required" error during initial load
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);
