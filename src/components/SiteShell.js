'use client'
// SiteShell — the public site's chrome (announcement bar, header, footer,
// floating actions, callback modal). Replaces the old src/App.js layout route.
// Page content arrives as `children`, already rendered on the server.
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import GlobalHeader from './GlobalHeader/GlobalHeader.js'
import AnnouncementBanner from './AnnouncementBanner/AnnouncementBanner.jsx'
import CallbackModal from './CallbackModal/CallbackModal.js'
import SiteFooter from './SiteFooter/SiteFooter.js'
import FloatingActions from './FloatingActions/FloatingActions.js'
import { PageTracking } from '../hooks/usePageTracking.js'
import MetaPixel from './MetaPixel.js'
import '../App.css'

const SiteContext = createContext({ onCallback: () => {} })

/** Replaces react-router's useOutletContext(): { onCallback } opens the callback modal. */
export function useSiteContext() {
  return useContext(SiteContext)
}

export default function SiteShell({ children }) {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const openCallback = useCallback(() => setCallbackOpen(true), [])
  const context = useMemo(() => ({ onCallback: openCallback }), [openCallback])

  return (
    <SiteContext.Provider value={context}>
      <PageTracking />
      <MetaPixel />
      <div className="rh-root">
        <AnnouncementBanner />
        <GlobalHeader onCallback={openCallback} />
        {children}
        <SiteFooter onCallback={openCallback} />
        <FloatingActions onCallback={openCallback} />
        <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
      </div>
    </SiteContext.Provider>
  )
}
