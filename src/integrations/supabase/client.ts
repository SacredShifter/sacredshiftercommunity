// Supabase client (safe + explicit)
// Do not edit env names unless you change your .env

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Read env vars from Vite (must start with VITE_)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

// Fail fast if config is missing
if (!SUPABASE_URL) {
  throw new Error("❌ Missing VITE_SUPABASE_URL in .env (project root)")
}
if (!SUPABASE_ANON_KEY) {
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
