// Rendered with HTTP 404 for unknown URLs and for notFound() in any page.
// It sits above the (site) group, so it brings the site chrome itself.
import './siteStyles.js'
import SiteShell from '../components/SiteShell.js'
import NotFound from '../views/NotFound.jsx'

export const metadata = {
  title: { absolute: 'Page not found | Renew Healthcare' },
  description: 'The page you are looking for could not be found on Renew Healthcare.',
  robots: 'noindex, follow',
}

export default function NotFoundPage() {
  return (
    <SiteShell>
      <NotFound />
    </SiteShell>
  )
}
