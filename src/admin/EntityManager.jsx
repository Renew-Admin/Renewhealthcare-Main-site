// EntityManager — a reusable list + create/edit modal + delete manager for the
// simple content collections (doctors, testimonials, faqs). Driven by config:
//   columns -> how the table looks
//   fields  -> the form inside the modal
import { useEffect, useState } from 'react'
import MediaPicker from './MediaPicker.jsx'
import { EmptyState, Modal, Spinner, useToast } from './ui.jsx'

function emptyForm(fields, defaults) {
  const base = {}
  fields.forEach((f) => { base[f.key] = emptyFieldValue(f) })
  return { ...base, ...defaults }
}

function emptyFieldValue(field) {
  if (Object.prototype.hasOwnProperty.call(field, 'emptyValue')) return cloneValue(field.emptyValue)
  if (field.type === 'toggle') return false
  if (field.type === 'number') return 0
  if (field.type === 'pairList') return []
  return ''
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map((item) => cloneValue(item))
  if (value && typeof value === 'object') return { ...value }
  return value
}

function fieldHasValue(field, value) {
  if (field.isEmpty) return !field.isEmpty(value)
  if (field.type === 'toggle') return !!value
  if (field.type === 'pairList') return Array.isArray(value) && value.length > 0
  return String(value ?? '').trim().length > 0
}

export default function EntityManager({ title, subtitle, addLabel = '+ Add', api, columns, fields, defaults = {}, onMutate, modalWide = false, customValidation, successMessage, topNote }) {
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
  const openEdit = (row) => {
    const next = { ...emptyForm(fields, defaults) }
    fields.forEach((f) => {
      const rawValue = Object.prototype.hasOwnProperty.call(row, f.key) ? row[f.key] : next[f.key]
      next[f.key] = f.fromStorage ? f.fromStorage(rawValue, row) : cloneValue(rawValue)
    })
    setEditing(row)
    setForm(next)
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    if (customValidation) {
      const err = customValidation(form)
      if (err) return toast(err, 'error')
    }
    const required = fields.find((f) => f.required && !fieldHasValue(f, form[f.key]))
    if (required) return toast(`${required.label} is required`, 'error')
    const payload = {}
    fields.forEach((f) => {
      payload[f.key] = f.toStorage ? f.toStorage(form[f.key], form) : form[f.key]
    })
    try {
      setSaving(true)
      if (editing) await api.update(editing.id, payload)
      else await api.create(payload)
      toast(successMessage || (editing ? 'Saved' : 'Added'))
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

      {topNote && <div style={{ marginBottom: '20px' }}>{topNote}</div>}

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
        wide={modalWide}
        footer={
          <>
            <button type="button" className="admin-btn ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" form="em-form" className="admin-btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        <form id="em-form" className="admin-form-grid" onSubmit={save}>
          {fields.map((f) => (
            <Field key={f.key} field={f} value={form[f.key]} form={form} onChange={(val) => set({ [f.key]: val })} />
          ))}
        </form>
      </Modal>
    </section>
  )
}

function gridCols(columns) {
  return columns.map((c) => (c.type === 'image' ? '64px' : c.grow ? '2fr' : '1fr')).join(' ') + ' auto'
}

function Field({ field, value, onChange, form }) {
  const { type, label, options, placeholder, full, kind, help, customRender } = field
  const cls = `admin-field ${full || type === 'textarea' || type === 'list' || type === 'image' || type === 'pairList' || customRender ? 'full' : ''}`

  if (customRender) {
    return customRender({ value, onChange, help, form, field })
  }

  if (type === 'image') {
    return (
      <label className={cls}>{label}
        <MediaPicker value={value || ''} onChange={onChange} kind={kind || 'general'} />
        <FieldHelp text={help} />
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
        <FieldHelp text={help} />
      </label>
    )
  }
  if (type === 'list') {
    return (
      <label className={cls}>{label}
        <textarea rows={field.rows || 5} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        <FieldHelp text={help || 'Write one item per line.'} />
      </label>
    )
  }
  if (type === 'pairList') return <PairListField className={cls} field={field} value={value} onChange={onChange} />
  if (type === 'select') {
    return (
      <label className={cls}>{label}
        <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {(options || []).map((o) => {
            const isObj = typeof o === 'object' && o !== null
            const val = isObj ? o.value || o.label : o
            const lbl = isObj ? o.label : o
            const isDisabled = isObj ? !!o.disabled : false
            return (
              <option key={val} value={val} disabled={isDisabled}>
                {lbl}{isDisabled ? ' (Coming Soon)' : ''}
              </option>
            )
          })}
        </select>
        <FieldHelp text={help} />
      </label>
    )
  }
  if (type === 'date') {
    return (
      <label className={cls}>{label}
        <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        <FieldHelp text={help} />
      </label>
    )
  }
  if (type === 'number') {
    return (
      <label className={cls}>{label}
        <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
        <FieldHelp text={help} />
      </label>
    )
  }
  return (
    <label className={cls}>{label}
      <input type="text" value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      <FieldHelp text={help} />
    </label>
  )
}

function FieldHelp({ text }) {
  return text ? <small className="admin-field-help">{text}</small> : null
}

function PairListField({ className, field, value, onChange }) {
  const rows = Array.isArray(value) ? value : []
  const subfields = field.fields || []

  const addRow = () => {
    const next = {}
    subfields.forEach((subfield) => { next[subfield.key] = '' })
    onChange([...rows, next])
  }

  const updateRow = (index, key, nextValue) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: nextValue } : row)))
  }

  const removeRow = (index) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className={`${className} admin-pair-list`}>
      <span className="admin-field-label">{field.label}</span>
      <FieldHelp text={field.help} />
      {rows.length > 0 && (
        <div className="admin-pair-list-rows">
          {rows.map((row, index) => (
            <div className="admin-pair-row" key={index}>
              {subfields.map((subfield) => (
                <label key={subfield.key}>
                  <span>{subfield.label}</span>
                  {subfield.type === 'textarea' ? (
                    <textarea
                      rows={subfield.rows || 3}
                      value={row?.[subfield.key] || ''}
                      placeholder={subfield.placeholder}
                      onChange={(e) => updateRow(index, subfield.key, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={row?.[subfield.key] || ''}
                      placeholder={subfield.placeholder}
                      onChange={(e) => updateRow(index, subfield.key, e.target.value)}
                    />
                  )}
                </label>
              ))}
              <button type="button" className="admin-btn danger sm" onClick={() => removeRow(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="admin-btn ghost sm admin-pair-add" onClick={addRow}>{field.addLabel || '+ Add row'}</button>
    </div>
  )
}
