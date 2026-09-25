// useBlogs — gives every blog page one merged list: Supabase posts first
// (newest, added from the admin panel), then the built-in static posts.
// The static posts are never modified; remote posts are simply layered on top.
import { useEffect, useState } from 'react'
import { blogs as staticBlogs } from '../data/blogs.js'
import { fetchPublishedPostRows } from '../lib/publicApi.js'
import { toBlog } from '../lib/blogRow.js'
import { resolveBlogImage } from '../lib/blogImages.js'
import { RETIRED_BLOG_SLUGS } from '../lib/seoDuplicates.js'

// Module-level cache so we fetch the remote posts once per page load and reuse
// them as the user navigates between blog pages.
let cache = null
let inflight = null

function loadRemote() {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchPublishedPostRows()
      .then((rows) => rows.map(toBlog))
      .then((posts) => {
        cache = posts
        return posts
      })
      .catch(() => {
        cache = []
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

// Call after creating/updating/deleting a post in admin so the public list
// re-fetches fresh data next time it mounts.
export function invalidateBlogsCache() {
  cache = null
}

function merge(remote) {
  // Remote posts win on slug collisions (lets admin override a static post).
  const remoteSlugs = new Set(remote.map((b) => b.slug))
  const statics = staticBlogs.filter((b) => !remoteSlugs.has(b.slug))
  return [
    ...remote.map((blog) => ({ ...blog, image: resolveBlogImage(blog) })),
    ...statics.map((blog) => ({ ...blog, image: resolveBlogImage(blog) })),
    // Retired duplicates (RH-02) redirect to their surviving URL, so the
    // listing must not link to them or the sitemap and the listing disagree.
  ].filter((blog) => !RETIRED_BLOG_SLUGS.has(blog.slug))
}

// `initial` is the finished listing built on the server (buildBlogListing).
// The first render uses it, so the server HTML and the hydrated page agree;
// after mount the list is refreshed from Supabase so posts published since the
// last deploy appear (an empty/failed read keeps `initial`).
export function useBlogs(initial) {
  const hasInitial = Array.isArray(initial)
  const [remote, setRemote] = useState(null)
  const [loading, setLoading] = useState(!hasInitial)

  useEffect(() => {
    let active = true
    loadRemote().then((posts) => {
      if (!active) return
      if (!hasInitial || posts.length) setRemote(posts)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [hasInitial])

  const blogs = remote ? merge(remote) : hasInitial ? initial : merge([])
  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category)))]
  return { blogs, categories, loading }
}
