'use client'
// ConsentBanner — first-visit privacy choice. Nothing non-essential is stored
// until the visitor chooses; the choice can be changed any time from the footer
// "Cookie settings" link (withdrawal is as easy as consent).
import { useEffect, useState } from 'react'
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from '../lib/consent.js'

const box = {
  // Stacking: above the header (90) but below the callback modal (120), so the
  // banner never covers a form the visitor opened. right: 88 keeps the
  // floating WhatsApp/call buttons (bottom-right) clear of the banner buttons.
  position: 'fixed', left: 16, right: 88, bottom: 16, zIndex: 115,
  maxWidth: 560, margin: '0 auto', background: '#ffffff', color: '#1f2933',
  borderRadius: 14, boxShadow: '0 10px 40px rgba(7,40,70,.25)', padding: '18px 20px',
  fontFamily: 'Manrope, system-ui, sans-serif', fontSize: 14, lineHeight: 1.5, textAlign: 'left',
}
const row = { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }
const btn = {
  flex: '1 1 140px', minHeight: 44, borderRadius: 10, fontWeight: 700, fontSize: 14,
  cursor: 'pointer', border: '1.5px solid #075a91', padding: '10px 14px',
}
const primary = { ...btn, background: '#075a91', color: '#ffffff' }
const secondary = { ...btn, background: '#ffffff', color: '#075a91' }

export default function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [ads, setAds] = useState(false)

  useEffect(() => {
    if (!readConsent()) setOpen(true)
    const reopen = () => {
      const current = readConsent()
      setAnalytics(current ? current.analytics === 'granted' : true)
      setAds(current?.ads === 'granted')
      setShowDetails(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen)
  }, [])

  if (!open) return null

  const choose = (analytics, adsChoice) => {
    saveConsent({ analytics, ads: adsChoice })
    setOpen(false)
  }

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="rh-consent-title" style={box} data-consent-banner="">
      <strong id="rh-consent-title" style={{ fontSize: 15 }}>Your privacy</strong>
      <p style={{ margin: '6px 0 0' }}>
        We use cookies to understand how visitors use this site and to measure our ads. We never send your
        name, contact details or health information to analytics or ad platforms.{' '}
        <a href="/privacy-policy" style={{ color: '#075a91', fontWeight: 600 }}>Privacy policy</a>
      </p>
      {showDetails && (
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input type="checkbox" checked disabled style={{ marginTop: 3 }} />
            <span><b>Essential</b> — needed for the site and forms to work.</span>
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} style={{ marginTop: 3 }} />
            <span><b>Analytics</b> — anonymous visit statistics (Google Analytics).</span>
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input type="checkbox" checked={ads} disabled={!analytics} onChange={e => setAds(e.target.checked)} style={{ marginTop: 3 }} />
            <span><b>Ad measurement</b> — lets us see which ads bring enquiries. No personalised ads.</span>
          </label>
        </div>
      )}
      <div style={row}>
        <button type="button" style={secondary} onClick={() => choose('denied', 'denied')}>Reject non-essential</button>
        {showDetails ? (
          <button type="button" style={primary} onClick={() => choose(analytics ? 'granted' : 'denied', analytics && ads ? 'granted' : 'denied')}>Save choices</button>
        ) : (
          <>
            <button type="button" style={secondary} onClick={() => setShowDetails(true)}>Customise</button>
            <button type="button" style={primary} onClick={() => choose('granted', 'granted')}>Accept all</button>
          </>
        )}
      </div>
    </div>
  )
}
