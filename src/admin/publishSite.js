// publishSite — asks the server to rebuild the live site after an admin edit.
// Never throws: a failed request only changes the message shown to the admin.
import { supabase } from '../lib/supabase.js'

/** Resolves to true when a rebuild was started. */
export async function requestSiteRebuild() {
  try {
    const { data } = await supabase.auth.getSession()
    const token = data?.session?.access_token
    if (!token) return false
    const response = await fetch('/api/rebuild', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    })
    return response.ok
  } catch {
    return false
  }
}

/** Toast text for a saved change, depending on whether the rebuild started. */
export function liveMessage(base, started) {
  return started
    ? `${base}. Live on the website in about 3 minutes.`
    : `${base}. It will appear on the website at the next deploy.`
}
