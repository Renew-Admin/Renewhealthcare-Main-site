'use client'
// MetaPixel — Meta Pixel base code for the public site (not the admin panel).
// Sends PageView on the first load and on every client-side navigation.
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { META_PIXEL_ID, trackMetaEvent } from '../lib/metaPixel.js'
import { CONSENT_EVENT, adsConsentGranted } from '../lib/consent.js'

export default function MetaPixel() {
  const pathname = usePathname()
  const isFirstView = useRef(true)
  // The Pixel is an advertising tag: it loads only after the visitor allows
  // ad measurement in the consent banner.
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(adsConsentGranted())
    const onChange = () => setAllowed(adsConsentGranted())
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  useEffect(() => {
    if (!META_PIXEL_ID || !allowed) return
    // The base code below already tracks the first PageView.
    if (isFirstView.current) {
      isFirstView.current = false
      return
    }
    trackMetaEvent('PageView')
  }, [pathname, allowed])

  if (!META_PIXEL_ID || !allowed) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
