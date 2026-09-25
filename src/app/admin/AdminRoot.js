'use client'
// Loads the admin SPA in the browser only (it depends on Supabase Auth and
// browser storage), code-split away from every public page.
import dynamic from 'next/dynamic'

const AdminSpa = dynamic(() => import('../../admin/AdminSpa.jsx'), {
  ssr: false,
  loading: () => <div className="admin admin-screen admin-center">Loading…</div>,
})

export default function AdminRoot() {
  return <AdminSpa />
}
