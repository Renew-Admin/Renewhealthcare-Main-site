// AnnouncementBanner — a slim site-wide bar driven by Admin → Settings.
// Shows only when the admin has enabled it and entered text.
import { useState } from 'react'
import { useSettings } from '../../hooks/useContent.js'
import './AnnouncementBanner.css'

export default function AnnouncementBanner() {
  const { settings } = useSettings()
  const [closed, setClosed] = useState(() => {
    try { return sessionStorage.getItem('rh-ann-closed') === '1' } catch { return false }
  })

  const text = settings.announcement
  if (closed || settings.announcement_active !== 'true' || !text) return null

  const dismiss = () => {
    setClosed(true)
    try { sessionStorage.setItem('rh-ann-closed', '1') } catch { /* ignore */ }
  }

  return (
    <div className="rh-announce">
      <p>{text}</p>
      <button type="button" onClick={dismiss} aria-label="Dismiss announcement">×</button>
    </div>
  )
}
