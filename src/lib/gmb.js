import { supabase, isSupabaseConfigured } from './supabase.js'
import { deleteGmbImage } from './gmbStorage.js'

export const GMB_LOCATIONS = [
  { id: 'Salt Lake', label: 'Salt Lake', slug: 'saltlake', envKey: 'VITE_GMB_WEBHOOK_SALTLAKE', disabled: true },
  { id: 'Ballygunge', label: 'Ballygunge', slug: 'ballygunge', envKey: 'VITE_GMB_WEBHOOK_BALLYGUNGE', disabled: false },
  { id: 'Jamshedpur', label: 'Jamshedpur', slug: 'jamshedpur', envKey: 'VITE_GMB_WEBHOOK_JAMSHEDPUR', disabled: true },
]

export const GMB_TIME_SCHEDULES = [
  { label: '10:00 AM (Asia/Kolkata)', value: '10:00 AM', 24: '10:00' },
  { label: '6:00 PM (Asia/Kolkata)', value: '6:00 PM', 24: '18:00' },
]

export function formatTime24(timeVal) {
  if (!timeVal) return '10:00'
  const str = String(timeVal).trim().toLowerCase()
  if (str.includes('6') || str.includes('18') || str.includes('pm')) {
    return '18:00'
  }
  return '10:00'
}

export function getWebhookUrlForLocation(locationId) {
  const loc = GMB_LOCATIONS.find((l) => l.id === locationId || l.slug === locationId)
  if (!loc) return null

  // Check Vite environment variable for location
  // Vite exposes variables starting with VITE_ to the browser bundle
  const envVal = import.meta.env[loc.envKey] || import.meta.env[loc.envKey.replace('VITE_', '')]
  return envVal || null
}

export function formatDateTime(rawDate) {
  if (!rawDate) return ''
  const str = String(rawDate).trim()

  // Match YYYY-MM-DD directly
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/)
  if (match) {
    return match[1]
  }

  // Fallback ISO/Date parser
  const d = new Date(rawDate)
  if (isNaN(d.getTime())) return str

  const YYYY = d.getFullYear()
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const DD = String(d.getDate()).padStart(2, '0')

  return `${YYYY}-${MM}-${DD}`
}

export async function triggerGmbWebhook(locationId, postRecord) {
  const webhookUrl = getWebhookUrlForLocation(locationId)
  if (!webhookUrl) {
    console.warn(`[GMB Webhook] No webhook URL configured for location "${locationId}". Skipping webhook invocation.`)
    return { success: false, reason: 'No webhook URL configured' }
  }

  // Prepare payload with PostDate (YYYY-MM-DD) and TimeSchedule in 24-hour format (HH:mm:ss)
  const payload = {
    ...postRecord,
    PostDate: formatDateTime(postRecord.PostDate),
    TimeSchedule: formatTime24(postRecord.TimeSchedule),
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(`[GMB Webhook] Trigger failed with status ${response.status}: ${response.statusText}`)
      return { success: false, status: response.status }
    }

    return { success: true }
  } catch (err) {
    console.error(`[GMB Webhook] Failed to call webhook for ${locationId}:`, err)
    return { success: false, error: err }
  }
}

export const gmbPostsApi = {
  async listAll() {
    if (!isSupabaseConfigured) return []
    const { data, error } = await supabase
      .from('gmb_posts')
      .select('*')
      .order('PostDate', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      // If table doesn't exist or error, throw error for EntityManager to handle
      throw error
    }
    return data || []
  },

  async create(record) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase
      .from('gmb_posts')
      .insert(record)
      .select()
      .single()

    if (error) throw error

    // Trigger location webhook after saving successfully
    if (data && data.Location) {
      triggerGmbWebhook(data.Location, data).catch((err) => {
        console.error('[GMB] Webhook dispatch error:', err)
      })
    }

    return data
  },

  async update(id, record) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase
      .from('gmb_posts')
      .update(record)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
    // Fetch row first to delete image from bucket
    const { data: row } = await supabase.from('gmb_posts').select('ImageURL').eq('id', id).single()
    if (row && row.ImageURL) {
      await deleteGmbImage(row.ImageURL)
    }

    const { error } = await supabase.from('gmb_posts').delete().eq('id', id)
    if (error) throw error
  },
}
