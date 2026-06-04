import React, { useState, useEffect } from 'react'
import Hero from './components/Hero/Hero.js'
import AboutRenew from './components/AboutRenew/AboutRenew.js'
import SiteFooter from './components/SiteFooter/SiteFooter.js'
import './App.css'

const NAV_ITEMS = [
  { label: 'About Renew', href: '#about-renew' },
  { label: 'Patient Care', href: '#contact' },
  { label: 'Visit Clinic', href: '#contact' },
  { label: 'Call Back', href: '#contact' },
  { label: 'Contact', href: '#contact' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Keep the transparent header across the WHOLE hero. Only give it a
  // solid backdrop once the content sections have reached the top.
  useEffect(() => {
    const onScroll = () => {
      const about = document.querySelector('.about-renew')
      setScrolled(about ? about.getBoundingClientRect().top <= 72 : window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="rh-root">
      {/* Fixed header — stays in view across every section */}
      <header className={`rh-header ${scrolled ? 'is-solid' : ''}`}>
        <a href="#" className="rh-logo" aria-label="Renew Healthcare">
          <img src="/images/Logo.png" alt="Renew Healthcare" className="rh-logo-mark" />
        </a>

        <nav className={`rh-nav ${menuOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href} className="rh-navlink" onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="rh-header-right">
          <button className="rh-book-btn">Book Appointment</button>
          <button
            className={`rh-menu-toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main>
        <Hero />
        <AboutRenew />
        <SiteFooter />
      </main>
    </div>
  )
}
