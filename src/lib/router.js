'use client'
// router — the small slice of the react-router API the public site used,
// implemented on top of Next.js navigation. Components keep writing
// <Link to="/services"> and useLocation(); both now render real <a href>
// elements on the server, so every internal link is in the initial HTML.
//
// The admin panel still runs its own react-router instance (see
// src/app/admin) and does not use this module.
import { forwardRef, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation'

// prefetch defaults to false: the header and footer carry ~80 links, and
// viewport prefetching every one of them on each page view is wasted
// bandwidth. Next still prefetches on hover.
export const Link = forwardRef(function Link({ to, href, replace, prefetch = false, state: _state, ...rest }, ref) {
  return <NextLink ref={ref} href={to ?? href ?? '/'} replace={replace} prefetch={prefetch} {...rest} />
})

// search and hash are only known in the browser. They start empty so the
// server render and the first client render agree, then sync after mount.
export function useLocation() {
  const pathname = usePathname() || '/'
  const [extra, setExtra] = useState({ search: '', hash: '' })

  useEffect(() => {
    const sync = () => setExtra({ search: window.location.search, hash: window.location.hash })
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [pathname])

  return { pathname, ...extra }
}

export function useParams() {
  return useNextParams() || {}
}

export function useNavigate() {
  const router = useRouter()
  return (to, options = {}) => (options.replace ? router.replace(to) : router.push(to))
}
