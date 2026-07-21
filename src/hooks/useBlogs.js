// useBlogs — gives every blog page one merged list: Supabase posts first
// (newest, added from the admin panel), then the built-in static posts.
// The static posts are never modified; remote posts are simply layered on top.
import { useEffect, useState } from 'react'
import { blogs as staticBlogs } from '../data/blogs.js'
import { fetchPublishedPosts } from '../lib/blogApi.js'
import { resolveBlogImage } from '../lib/blogImages.js'

// Module-level cache so we fetch the remote posts once per page load and reuse
// them as the user navigates between blog pages.
let cache = null
let inflight = null

function loadRemote() {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchPublishedPosts()
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
  ]
}

export function useBlogs() {
  const [remote, setRemote] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    let active = true
    if (cache) {
      setRemote(cache)
      setLoading(false)
      return
    }
    loadRemote().then((posts) => {
      if (active) {
        setRemote(posts)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const blogs = merge(remote)
  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category)))]
  return { blogs, categories, loading }
}
