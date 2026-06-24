// AdminSettings — edit site-wide settings (contact details + announcement bar).
import { useEffect, useState } from 'react'
import { fetchSettings, saveSettings } from '../lib/content.js'
import { invalidateSettings } from '../hooks/useContent.js'
import { Spinner, useToast } from './ui.jsx'

const FIELDS = [
  { key: 'phone', label: 'Primary phone', placeholder: '062922 69060' },
  { key: 'whatsapp', label: 'WhatsApp number (with country code)', placeholder: '916292269060' },
  { key: 'email', label: 'Contact email', placeholder: 'info@renewhealthcare.in' },
  { key: 'announcement', label: 'Announcement bar text', placeholder: 'e.g. Free fertility consultation this month', full: true },
]

export default function AdminSettings() {
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
      .then((s) => setForm({ announcement_active: 'false', ...s }))
      .catch(() => setForm({}))
  }, [])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const save = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await saveSettings(form)
      invalidateSettings()
      toast('Settings saved')
    } catch (err) {
      toast(err?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <Spinner />

  return (
    <section className="admin-page admin-page-narrow">
      <div className="admin-page-head">
        <div>
          <h1>Site settings</h1>
          <p className="admin-muted">Contact details and the announcement bar — edit content without touching code.</p>
        </div>
        <button type="submit" form="settings-form" className="admin-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
      </div>

      <form id="settings-form" className="admin-card admin-form-grid" onSubmit={save}>
        {FIELDS.map((f) => (
          <label key={f.key} className={`admin-field ${f.full ? 'full' : ''}`}>{f.label}
            <input value={form[f.key] || ''} placeholder={f.placeholder} onChange={(e) => set({ [f.key]: e.target.value })} />
          </label>
        ))}
        <label className="admin-field admin-switch full">
          <input type="checkbox" checked={form.announcement_active === 'true'} onChange={(e) => set({ announcement_active: e.target.checked ? 'true' : 'false' })} />
          <span>Show the announcement bar on the site</span>
        </label>
      </form>
    </section>
  )
}
