// ui.jsx — small shared building blocks for the admin panel:
// a toast system and a modal dialog.
import { createContext, useCallback, useContext, useState } from 'react'

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
const ToastCtx = createContext(() => {})
export function useToast() {
  return useContext(ToastCtx)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { id, message, type }])
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3600)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="admin-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            <span className="admin-toast-dot" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export function Modal({ open, title, subtitle, onClose, children, footer, wide }) {
  if (!open) return null
  return (
    <div className="admin-modal-overlay" onMouseDown={onClose}>
      <div className={`admin-modal ${wide ? 'is-wide' : ''}`} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="admin-muted">{subtitle}</p>}
          </div>
          <button type="button" className="admin-modal-x" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tiny presentational helpers
// ---------------------------------------------------------------------------
export function EmptyState({ icon = '✦', title, children }) {
  return (
    <div className="admin-card admin-empty">
      <div className="admin-empty-icon">{icon}</div>
      <strong>{title}</strong>
      {children}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="admin-spinner">
      <span className="admin-spinner-ring" />
      {label}
    </div>
  )
}
