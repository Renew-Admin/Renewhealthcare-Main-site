// content.js — CRUD for the simple content collections managed in the admin
// panel: doctors, testimonials, faqs, plus the site_settings key/value store.
import { supabase, isSupabaseConfigured } from './supabase.js'

// Generic CRUD for a table that has `display_order`, `active`, timestamps.
function collection(table) {
  return {
    // Admin: everything, ordered for editing.
    async listAll() {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    // Public: active rows only. Never throws (site keeps working offline).
    async listActive() {
      if (!isSupabaseConfigured) return []
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) {
        console.warn(`[content] ${table} listActive failed:`, error.message)
        return []
      }
      return data || []
    },
    async create(row) {
      const { data, error } = await supabase.from(table).insert(row).select().single()
      if (error) throw error
      return data
    },
    async update(id, row) {
      const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    async remove(id) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
  }
}

export const doctorsApi = collection('doctors')
export const testimonialsApi = collection('testimonials')
export const faqsApi = collection('faqs')

// ---------------------------------------------------------------------------
// SITE SETTINGS — a flat key/value map.
// ---------------------------------------------------------------------------
export async function fetchSettings() {
  if (!isSupabaseConfigured) return {}
  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) {
    console.warn('[content] fetchSettings failed:', error.message)
    return {}
  }
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]))
}

export async function saveSettings(map) {
  const rows = Object.entries(map).map(([key, value]) => ({
    key,
    value: value == null ? '' : String(value),
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('site_settings').upsert(rows)
  if (error) throw error
}
