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

  const tickerItems = Array.from({ length: 6 }, () => text)

  return (
    <div className="rh-announce" role="region" aria-label="Site announcement">
      <span className="rh-announce__label">Update</span>
      <p className="rh-announce__sr">{text}</p>
      <div className="rh-announce__viewport" aria-hidden="true">
        <div className="rh-announce__track">
          {[0, 1].map(group => (
            <div className="rh-announce__group" key={group}>
              {tickerItems.map((item, index) => (
                <span className="rh-announce__item" key={`${group}-${index}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button className="rh-announce__close" type="button" onClick={dismiss} aria-label="Dismiss announcement">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
