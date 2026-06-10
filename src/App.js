import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GlobalHeader from './components/GlobalHeader/GlobalHeader.js'
import CallbackModal from './components/CallbackModal/CallbackModal.js'
import SiteFooter from './components/SiteFooter/SiteFooter.js'
import './App.css'

export default function App() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="rh-root">
      <GlobalHeader onCallback={() => setCallbackOpen(true)} />
      <Outlet />
      <SiteFooter onCallback={() => setCallbackOpen(true)} />
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  )
}
