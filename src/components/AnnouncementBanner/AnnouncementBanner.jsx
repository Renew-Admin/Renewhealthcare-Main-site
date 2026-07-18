// AnnouncementBanner — a slim site-wide bar driven by Admin → Settings.
// Shows only when the admin has enabled it and entered text.
import { useState } from 'react'
import { useSettings } from '../../hooks/useContent.js'
import './AnnouncementBanner.css'

function getAnnouncementHref(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  if (raw.startsWith('#')) return raw
  if (raw.startsWith('?')) return raw
  if (raw.startsWith('/')) return raw.startsWith('//') ? `https:${raw}` : raw

  const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(raw)
  if (!hasProtocol && !/^[^/\s]+\.[^/\s]+/.test(raw)) return `/${raw.replace(/^\/+/, '')}`

  const href = hasProtocol ? raw : `https://${raw}`

  try {
    const url = new URL(href)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function AnnouncementContent({ href, text, tickerItems }) {
  const content = (
    <>
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
    </>
  )

  if (href) {
    return (
      <a className="rh-announce__content rh-announce__content--link" href={href}>
        {content}
      </a>
    )
  }

  return <div className="rh-announce__content">{content}</div>
}

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
  const href = getAnnouncementHref(settings.announcement_link)

  return (
    <div className="rh-announce" role="region" aria-label="Site announcement">
      <AnnouncementContent href={href} text={text} tickerItems={tickerItems} />
      <button className="rh-announce__close" type="button" onClick={dismiss} aria-label="Dismiss announcement">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}
