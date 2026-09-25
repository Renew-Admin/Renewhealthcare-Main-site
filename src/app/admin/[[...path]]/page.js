// /admin and every /admin/* path. Never indexed (robots.txt disallows /admin,
// this metadata says noindex, and next.config.mjs adds an X-Robots-Tag header).
import AdminRoot from '../AdminRoot.js'
// Base variables/resets the admin styles build on (Admin.css loads with the panel).
import '../../../index.css'

export const metadata = {
  title: { absolute: 'Renew Healthcare Admin' },
  description: 'Renew Healthcare admin area.',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  return <AdminRoot />
}
