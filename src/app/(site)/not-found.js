// 404 for notFound() inside a public page (unknown blog post, doctor, …).
// The (site) layout already renders the header and footer around it; the root
// src/app/not-found.js brings its own chrome for URLs that match no route.
import NotFound from '../../views/NotFound.jsx'

export const metadata = {
  title: { absolute: 'Page not found | Renew Healthcare' },
  description: 'The page you are looking for could not be found on Renew Healthcare.',
  robots: 'noindex, follow',
}

export default function SiteNotFound() {
  return <NotFound />
}
