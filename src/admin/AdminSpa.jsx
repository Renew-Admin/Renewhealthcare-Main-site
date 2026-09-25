// AdminSpa — the admin panel's own client-side router, mounted by
// src/app/admin/[[...path]]/page.js. The admin is an authenticated tool with
// nothing to index, so it stays a browser-only React Router app; Next.js loads
// it as a separate chunk that public pages never download.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminApp from './AdminApp.jsx'

export default function AdminSpa() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  )
}
