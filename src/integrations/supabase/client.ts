// Supabase client (safe + explicit)
// Do not edit env names unless you change your .env

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Read env vars from Vite (must start with VITE_)
// Temporary hardcoded values to bypass env loading issues
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mikltjgbvxrxndtszorb.supabase.co"
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70"

// Debug: Log environment variables to help diagnose issues
console.log('Environment check:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  final_SUPABASE_URL: SUPABASE_URL,
  final_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'Present' : 'Missing'
});

// Fail fast if config is missing
if (!SUPABASE_URL) {
  console.error('Missing VITE_SUPABASE_URL. Available env vars:', Object.keys(import.meta.env));
  throw new Error("❌ Missing VITE_SUPABASE_URL in .env (project root)")
}
if (!SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_PUBLISHABLE_KEY. Available env vars:', Object.keys(import.meta.env));
  throw new Error("❌ Missing VITE_SUPABASE_PUBLISHABLE_KEY in .env (project root)")
}

// Create client with safe defaults
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
