import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './FloatingActions.css'

const PHONE_DISPLAY = '062922 69060'
const TEL = 'tel:06292269060'
const WHATSAPP = 'https://api.whatsapp.com/send?phone=916292269060&text=' +
  encodeURIComponent("Hi Renew Healthcare, I'd like to know more about your fertility treatments.")
const INSTAGRAM = 'https://www.instagram.com/renewhealthcare/'

function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', width: 22, height: 22, 'aria-hidden': true }
  switch (name) {
    case 'whatsapp':
      return (
        <svg {...common} fill="currentColor">
          <path d="M.5 23.5l1.65-6A11.4 11.4 0 0 1 .6 11.6C.6 5.3 5.8.1 12.1.1c3 0 5.9 1.2 8 3.3a11.3 11.3 0 0 1 3.4 8.2c0 6.3-5.2 11.5-11.5 11.5-1.9 0-3.8-.5-5.4-1.4l-6.1 1.8zm6.4-3.7l.4.2c1.4.8 3 1.3 4.7 1.3 5.2 0 9.5-4.3 9.5-9.6 0-2.5-1-5-2.8-6.8a9.5 9.5 0 0 0-6.7-2.8C6.9 2.3 2.6 6.6 2.6 11.8c0 1.8.5 3.5 1.4 5l.3.4-1 3.6 3.6-1zm11.4-5.3c-.1-.1-.3-.2-.6-.4-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.2-1.3z" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )
    case 'up':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 15 6-6 6 6" />
        </svg>
      )
    default:
      return null
  }
}

export default function FloatingActions({ onCallback }) {
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fab-root" aria-live="polite">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            key="top"
            className="fab fab-top"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <Icon name="up" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fab-stack">
        <AnimatePresence>
          {open && (
            <motion.div
              className="fab-panel"
              key="panel"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="fab-panel-head">
                <div>
                  <strong>Renew Healthcare</strong>
                  <span><span className="fab-dot" /> We usually reply within minutes</span>
                </div>
                <button type="button" className="fab-panel-close" onClick={() => setOpen(false)} aria-label="Close chat menu">
                  <Icon name="close" />
                </button>
              </div>

              <p className="fab-panel-lead">Hi! 👋 How would you like to reach us?</p>

              <a className="fab-opt is-whatsapp" href={WHATSAPP} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                <span className="fab-opt-icon"><Icon name="whatsapp" /></span>
                <span><strong>Chat on WhatsApp</strong><small>Fastest response</small></span>
              </a>
              <a className="fab-opt is-call" href={TEL} onClick={() => setOpen(false)}>
                <span className="fab-opt-icon"><Icon name="phone" /></span>
                <span><strong>Call us now</strong><small>{PHONE_DISPLAY}</small></span>
              </a>
              <button
                type="button"
                className="fab-opt is-book"
                onClick={() => { setOpen(false); onCallback && onCallback() }}
              >
                <span className="fab-opt-icon"><Icon name="calendar" /></span>
                <span><strong>Request a call back</strong><small>We'll call you</small></span>
              </button>
              <a className="fab-opt is-insta" href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                <span className="fab-opt-icon"><Icon name="instagram" /></span>
                <span><strong>Follow on Instagram</strong><small>@renewhealthcare</small></span>
              </a>
              <Link className="fab-panel-foot" to="/contact" onClick={() => setOpen(false)}>
                Book your appointment online →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <a
          className="fab fab-whatsapp"
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Renew Healthcare on WhatsApp"
        >
          <Icon name="whatsapp" />
          <span className="fab-whatsapp-pulse" aria-hidden="true" />
        </a>

        <button
          type="button"
          className={`fab fab-chat ${open ? 'is-open' : ''}`}
          onClick={() => setOpen(value => !value)}
          aria-label={open ? 'Close contact menu' : 'Open contact menu'}
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'chat'} />
        </button>
      </div>
    </div>
  )
}
