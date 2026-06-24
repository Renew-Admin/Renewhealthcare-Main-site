// Single shared Supabase client for the whole app.
// Reads credentials from the .env file (VITE_ vars are injected at build time).
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars are missing we keep `supabase` null so the public site still
// works (it just falls back to the static blogs and the admin panel shows a
// helpful message instead of crashing).
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
