// Single shared Supabase client for the whole app.
// Reads the public URL + anon key that next.config.mjs maps from .env (the
// VITE_* names are kept there). Only the anon key may ever reach the browser.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
