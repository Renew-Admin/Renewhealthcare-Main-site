// AdminApp — self-contained admin section mounted at /admin/*, with its own
// sidebar layout, auth guard, toasts and routing.
import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { ToastProvider } from './ui.jsx'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminBlogs from './AdminBlogs.jsx'
import AdminEditor from './AdminEditor.jsx'
import AdminLeads from './AdminLeads.jsx'
import AdminDoctors from './AdminDoctors.jsx'
import AdminTestimonials from './AdminTestimonials.jsx'
import AdminFaqs from './AdminFaqs.jsx'
import AdminSettings from './AdminSettings.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'
import './Admin.css'

const ICONS = {
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  blogs: 'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  leads: 'M3 5h18v14H3z M3 7l9 6 9-6',
  doctors: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  testimonials: 'M12 2l2.9 6.3 6.8.7-5.1 4.6 1.4 6.7L12 17.8 6 20.6l1.4-6.7L2.3 9l6.8-.7z',
  faqs: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7 M12 17h.01',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L14.5 2h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5L4.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5z',
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].split(' M').map((d, i) => <path key={i} d={(i ? 'M' : '') + d} />)}
    </svg>
  )
}

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/blogs', label: 'Blog posts', icon: 'blogs' },
  { to: '/admin/leads', label: 'Leads', icon: 'leads' },
  { to: '/admin/doctors', label: 'Doctors', icon: 'doctors' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'testimonials' },
  { to: '/admin/faqs', label: 'FAQs', icon: 'faqs' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="admin admin-screen admin-center">Loading…</div>
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

function Shell({ children }) {
  const { user, signOut } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  return (
    <div className="admin">
      {navOpen && <div className="admin-scrim" onClick={() => setNavOpen(false)} />}
      <aside className={`admin-side ${navOpen ? 'is-open' : ''}`}>
        <Link to="/admin" className="admin-side-brand" onClick={() => setNavOpen(false)}>Renew<span>Admin</span></Link>
        <nav className="admin-side-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setNavOpen(false)}>
              <Icon name={n.icon} />{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="admin-side-link">View website ↗</a>
          <div className="admin-side-user">
            <span title={user?.email}>{user?.email}</span>
            <button type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar">
          <button type="button" className="admin-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu">☰</button>
          <Link to="/admin" className="admin-side-brand">Renew<span>Admin</span></Link>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}

const guard = (el) => <RequireAuth><Shell>{el}</Shell></RequireAuth>

export default function AdminApp() {
  if (!isSupabaseConfigured) {
    return (
      <div className="admin admin-screen admin-center">
        <div className="admin-card admin-notice">
          <h1>Backend not configured</h1>
          <p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file, then restart the dev server.</p>
        </div>
      </div>
    )
  }
  return (
    <ToastProvider>
      <div className="admin-mobile-gate">
        <div className="amg-card">
          <div className="amg-icon">🖥️</div>
          <h1>Desktop only</h1>
          <p>The Renew admin panel isn’t built for phones. Please open it on a laptop or desktop for the best experience.</p>
        </div>
      </div>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route path="" element={guard(<AdminDashboard />)} />
          <Route path="blogs" element={guard(<AdminBlogs />)} />
          <Route path="new" element={guard(<AdminEditor />)} />
          <Route path="edit/:id" element={guard(<AdminEditor />)} />
          <Route path="leads" element={guard(<AdminLeads />)} />
          <Route path="doctors" element={guard(<AdminDoctors />)} />
          <Route path="testimonials" element={guard(<AdminTestimonials />)} />
          <Route path="faqs" element={guard(<AdminFaqs />)} />
          <Route path="settings" element={guard(<AdminSettings />)} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  )
}
