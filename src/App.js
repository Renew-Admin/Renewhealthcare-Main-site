import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GlobalHeader from './components/GlobalHeader/GlobalHeader.js'
import AnnouncementBanner from './components/AnnouncementBanner/AnnouncementBanner.jsx'
import CallbackModal from './components/CallbackModal/CallbackModal.js'
import SiteFooter from './components/SiteFooter/SiteFooter.js'
import FloatingActions from './components/FloatingActions/FloatingActions.js'
import Seo from './components/Seo.js'
import { getSeoForPath } from './lib/seoRoutes.js'
import { normalizePath } from './lib/seoUtils.js'
import './App.css'

export default function App() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const routeSeo = getSeoForPath(pathname)
  const fallbackPath = normalizePath(pathname)

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return undefined
    }

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  // Blog articles manage their own head tags: BlogPostPage knows the post's
  // language, hreflang pair and schema, and the static manifest here cannot
  // see posts published since the last build. Rendering both would make this
  // one briefly stamp "Page not found" over a live article.
  const isBlogArticle = /^\/blogs\/[^/]+$/.test(fallbackPath)

  return (
    <div className="rh-root">
      {isBlogArticle ? null : routeSeo ? (
        <Seo
          title={routeSeo.title}
          description={routeSeo.description}
          path={routeSeo.path}
          image={routeSeo.image}
          type={routeSeo.type}
          robots={routeSeo.robots}
        />
      ) : (
        <Seo
          title="Page not found"
          description="The page you are looking for could not be found on Renew Healthcare."
          path={fallbackPath}
          robots="noindex, follow"
        />
      )}
      <AnnouncementBanner />
      <GlobalHeader onCallback={() => setCallbackOpen(true)} />
      <Outlet context={{ onCallback: () => setCallbackOpen(true) }} />
      <SiteFooter onCallback={() => setCallbackOpen(true)} />
      <FloatingActions onCallback={() => setCallbackOpen(true)} />
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  )
}
