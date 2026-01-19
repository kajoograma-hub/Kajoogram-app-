
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Define process.env variables so they can be replaced during build. 
      // Default to "" to avoid 'undefined' being injected into code.
      
      // Gemini
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ""),
      
      // Supabase (Support both standard and Next.js style naming for convenience)
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""),
    },
  };
});
