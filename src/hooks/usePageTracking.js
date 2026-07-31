import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = 'G-VL7SJC7ENL'

let lastTrackedPage = ''

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const pagePath = `${location.pathname}${location.search}`
    const pageLocation = window.location.href

    const timeoutId = window.setTimeout(() => {
      if (typeof window.gtag !== 'function') return
      if (lastTrackedPage === pageLocation) return

      lastTrackedPage = pageLocation
      window.gtag('event', 'page_view', {
        send_to: GA_MEASUREMENT_ID,
        page_path: pagePath,
        page_location: pageLocation,
        page_title: document.title,
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.pathname, location.search])
}

export function PageTracking() {
  usePageTracking()
  return null
}
