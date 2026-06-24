// AdminLeads — enquiries from every form, with a status pipeline, filters,
// search and one-click CSV export.
import { useEffect, useMemo, useState } from 'react'
import { fetchLeads, deleteLead, updateLeadStatus, LEAD_STATUSES } from '../lib/blogApi.js'
import { SOURCE_LABELS, STATUS_LABELS } from './leadsMeta.js'
import { EmptyState, Spinner, useToast } from './ui.jsx'

const fmt = (iso) => {
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) } catch { return iso }
}

const csvCell = (v) => {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function AdminLeads() {
  const toast = useToast()
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading')
  const [q, setQ] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = () => {
    setStatus('loading')
    fetchLeads()
      .then((rows) => { setLeads(rows); setStatus('ready') })
      .catch((err) => { toast(err?.message || 'Failed to load', 'error'); setStatus('error') })
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sources = useMemo(() => [...new Set(leads.map((l) => l.source))], [leads])

  const filtered = useMemo(() => leads.filter((l) => {
    const matchesQ = `${l.name || ''} ${l.phone || ''} ${l.email || ''} ${l.message || ''} ${l.service || ''}`
      .toLowerCase().includes(q.toLowerCase())
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter
    const matchesStatus = statusFilter === 'all' || (l.status || 'new') === statusFilter
    return matchesQ && matchesSource && matchesStatus
  }), [leads, q, sourceFilter, statusFilter])

  const changeStatus = async (lead, value) => {
    const prev = lead.status
    setLeads((list) => list.map((x) => (x.id === lead.id ? { ...x, status: value } : x)))
    try {
      await updateLeadStatus(lead.id, value)
    } catch (err) {
      setLeads((list) => list.map((x) => (x.id === lead.id ? { ...x, status: prev } : x)))
      toast(err?.message || 'Could not update status', 'error')
    }
  }

  const remove = async (lead) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return
    try {
      await deleteLead(lead.id)
      setLeads((p) => p.filter((x) => x.id !== lead.id))
      toast('Lead deleted')
    } catch (err) {
      toast(err?.message || 'Delete failed', 'error')
    }
  }

  const exportCsv = () => {
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Service', 'Message', 'Source', 'Page', 'Status']
    const rows = filtered.map((l) => [fmt(l.created_at), l.name, l.phone, l.email, l.service, l.message, l.source, l.page_path, l.status])
    const csv = [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Leads {status === 'ready' && <span className="admin-count">{leads.length}</span>}</h1>
          <p className="admin-muted">Enquiries from every lead form on the website.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-btn ghost" onClick={load}>Refresh</button>
          <button type="button" className="admin-btn primary" onClick={exportCsv} disabled={filtered.length === 0}>↓ Export CSV</button>
        </div>
      </div>

      {status === 'loading' && <Spinner />}

      {status === 'ready' && leads.length === 0 && (
        <EmptyState icon="✉" title="No leads yet"><p className="admin-muted">Submissions from the website will appear here.</p></EmptyState>
      )}

      {status === 'ready' && leads.length > 0 && (
        <>
          <div className="admin-toolbar">
            <input className="admin-search" placeholder="Search name, phone, message…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="all">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s] || s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <span className="admin-muted">{filtered.length} shown</span>
          </div>

          <div className="admin-table leads">
            <div className="admin-tr admin-th">
              <span>Received</span><span>Name</span><span>Contact</span><span>Service</span><span>Source</span><span>Status</span><span>Message</span><span></span>
            </div>
            {filtered.map((l) => (
              <div className="admin-tr" key={l.id}>
                <span className="admin-lead-date">{fmt(l.created_at)}</span>
                <span><strong>{l.name || '—'}</strong></span>
                <span className="admin-lead-contact">
                  {l.phone && (
                    <a href={`tel:${l.phone}`} className="admin-lead-contact-item">
                      <small>Phone</small>
                      <strong>{l.phone}</strong>
                    </a>
                  )}
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="admin-lead-contact-item">
                      <small>Email</small>
                      <strong>{l.email}</strong>
                    </a>
                  )}
                  {!l.phone && !l.email && <span className="admin-muted">—</span>}
                </span>
                <span>{l.service || '—'}</span>
                <span>
                  <em className="admin-pill src">{SOURCE_LABELS[l.source] || l.source}</em>
                  {l.page_path && <small className="admin-lead-path">{l.page_path}</small>}
                </span>
                <span>
                  <select className={`status-select s-${l.status || 'new'}`} value={l.status || 'new'} onChange={(e) => changeStatus(l, e.target.value)}>
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </span>
                <span className="admin-lead-msg">{l.message || '—'}</span>
                <span className="admin-td-actions">
                  <button type="button" className="admin-btn danger sm" onClick={() => remove(l)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
