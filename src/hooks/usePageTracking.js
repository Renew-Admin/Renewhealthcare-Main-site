'use client'
// usePageTracking — the single source of GA4 page_view events on the public
// site (gtag config uses send_page_view:false and the stream's history-based
// page views are switched off, so nothing else sends them).
//
// One page_view per genuine route change. The title is read once
// Next.js has written the new route's <title>: a MutationObserver on <head>
// resolves as soon as the title changes; a 1.5 s backstop covers routes whose
// title is identical to the previous one.
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { GA_MEASUREMENT_ID, analyticsAllowed, cleanPageLocation, pageCategory, sanitizeParams } from '../lib/analytics.js'

let lastTrackedLocation = ''
let lastTrackedTitle = ''

function waitForTitle(previousTitle, onReady) {
  if (document.title && document.title !== previousTitle) {
    onReady()
    return () => {}
  }
  let done = false
  const finish = () => {
    if (done) return
    done = true
    observer.disconnect()
    window.clearTimeout(backstop)
    onReady()
  }
  const observer = new MutationObserver(() => {
    if (document.title && document.title !== previousTitle) finish()
  })
  observer.observe(document.head, { subtree: true, childList: true, characterData: true })
  const backstop = window.setTimeout(finish, 1500)
  return () => {
    done = true
    observer.disconnect()
    window.clearTimeout(backstop)
  }
}

export function usePageTracking() {
  // usePathname only: useSearchParams would force every static page into a
  // Suspense boundary. The full URL (with campaign params) is read from
  // window.location inside the effect.
  const pathname = usePathname() || '/'

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const pageLocation = cleanPageLocation(window.location.href)
    if (!pageLocation || pageLocation === lastTrackedLocation) return undefined

    return waitForTitle(lastTrackedTitle, () => {
      if (pageLocation === lastTrackedLocation) return
      if (!analyticsAllowed() || typeof window.gtag !== 'function') return
      lastTrackedLocation = pageLocation
      lastTrackedTitle = document.title
      const params = sanitizeParams('page_view', {
        page_location: pageLocation,
        page_title: document.title,
        page_category: pageCategory(pathname),
      })
      window.gtag('event', 'page_view', { ...params, send_to: GA_MEASUREMENT_ID })
    })
  }, [pathname])
}

export function PageTracking() {
  usePageTracking()
  return null
}
