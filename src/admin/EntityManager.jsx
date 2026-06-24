// EntityManager — a reusable list + create/edit modal + delete manager for the
// simple content collections (doctors, testimonials, faqs). Driven by config:
//   columns -> how the table looks
//   fields  -> the form inside the modal
import { useEffect, useState } from 'react'
import MediaPicker from './MediaPicker.jsx'
import { EmptyState, Modal, Spinner, useToast } from './ui.jsx'

function emptyForm(fields, defaults) {
  const base = {}
  fields.forEach((f) => { base[f.key] = f.type === 'toggle' ? false : f.type === 'number' ? 0 : '' })
  return { ...base, ...defaults }
}

export default function EntityManager({ title, subtitle, addLabel = '+ Add', api, columns, fields, defaults = {}, onMutate }) {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = () => {
    setStatus('loading')
    api.listAll()
      .then((rows) => { setItems(rows); setStatus('ready') })
      .catch((err) => { setError(err?.message || 'Failed to load'); setStatus('error') })
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const openCreate = () => { setEditing(null); setForm(emptyForm(fields, defaults)); setOpen(true) }
  const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm(fields, defaults), ...row }); setOpen(true) }

  const save = async (e) => {
    e.preventDefault()
    const required = fields.find((f) => f.required && !String(form[f.key] ?? '').trim())
    if (required) return toast(`${required.label} is required`, 'error')
    const payload = {}
    fields.forEach((f) => { payload[f.key] = form[f.key] })
    try {
      setSaving(true)
      if (editing) await api.update(editing.id, payload)
      else await api.create(payload)
      toast(editing ? 'Saved' : 'Added')
      setOpen(false)
      onMutate?.()
      load()
    } catch (err) {
      toast(err?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (row) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    try {
      await api.remove(row.id)
      setItems((list) => list.filter((x) => x.id !== row.id))
      onMutate?.()
      toast('Deleted')
    } catch (err) {
      toast(err?.message || 'Delete failed', 'error')
    }
  }

  const cell = (col, row) => {
    const v = row[col.key]
    if (col.type === 'image') return v ? <img className="admin-thumb" src={v} alt="" /> : <span className="admin-muted">—</span>
    if (col.type === 'toggle') return <em className={`admin-pill ${v ? 'live' : 'draft'}`}>{v ? 'Visible' : 'Hidden'}</em>
    if (col.type === 'rating') return '★'.repeat(Number(v) || 0)
    if (col.truncate) return <span className="admin-clip">{v || '—'}</span>
    return v || <span className="admin-muted">—</span>
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="admin-muted">{subtitle}</p>}
        </div>
        <button type="button" className="admin-btn primary" onClick={openCreate}>{addLabel}</button>
      </div>

      {status === 'loading' && <Spinner />}
      {status === 'error' && <div className="admin-error">{error}</div>}

      {status === 'ready' && items.length === 0 && (
        <EmptyState title="Nothing here yet">
          <button type="button" className="admin-btn primary" onClick={openCreate}>{addLabel}</button>
        </EmptyState>
      )}

      {status === 'ready' && items.length > 0 && (
        <div className="admin-table" style={{ '--cols': columns.length + 1 }}>
          <div className="admin-tr admin-th" style={{ gridTemplateColumns: gridCols(columns) }}>
            {columns.map((c) => <span key={c.key}>{c.label || ''}</span>)}
            <span />
          </div>
          {items.map((row) => (
            <div className="admin-tr" key={row.id} style={{ gridTemplateColumns: gridCols(columns) }}>
              {columns.map((c) => <span key={c.key} className={c.type === 'image' ? 'admin-td-img' : ''}>{cell(c, row)}</span>)}
              <span className="admin-td-actions">
                <button type="button" className="admin-btn ghost sm" onClick={() => openEdit(row)}>Edit</button>
                <button type="button" className="admin-btn danger sm" onClick={() => remove(row)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        title={editing ? `Edit ${title.replace(/s$/, '')}` : `New ${title.replace(/s$/, '')}`}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" form="em-form" className="admin-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        <form id="em-form" className="admin-form-grid" onSubmit={save}>
          {fields.map((f) => (
            <Field key={f.key} field={f} value={form[f.key]} onChange={(val) => set({ [f.key]: val })} />
          ))}
        </form>
      </Modal>
    </section>
  )
}

function gridCols(columns) {
  return columns.map((c) => (c.type === 'image' ? '64px' : c.grow ? '2fr' : '1fr')).join(' ') + ' auto'
}

function Field({ field, value, onChange }) {
  const { type, label, options, placeholder, full, kind } = field
  const cls = `admin-field ${full || type === 'textarea' || type === 'image' ? 'full' : ''}`

  if (type === 'image') {
    return (
      <label className={cls}>{label}
        <MediaPicker value={value || ''} onChange={onChange} kind={kind || 'general'} />
      </label>
    )
  }
  if (type === 'toggle') {
    return (
      <label className="admin-field admin-switch full">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    )
  }
  if (type === 'textarea') {
    return (
      <label className={cls}>{label}
        <textarea rows={4} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  }
  if (type === 'select') {
    return (
      <label className={cls}>{label}
        <input list={`opt-${field.key}`} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        <datalist id={`opt-${field.key}`}>{(options || []).map((o) => <option key={o} value={o} />)}</datalist>
      </label>
    )
  }
  if (type === 'number') {
    return (
      <label className={cls}>{label}
        <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    )
  }
  return (
    <label className={cls}>{label}
      <input type="text" value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
