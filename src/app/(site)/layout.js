// Layout for every public page: header, footer and the rest of the site chrome.
// The admin panel (src/app/admin) is outside this group and gets none of it.
// Global public stylesheet first, so it defines the cascade order.
import '../siteStyles.js'
import SiteShell from '../../components/SiteShell.js'

export default function SiteLayout({ children }) {
  return <SiteShell>{children}</SiteShell>
}
