// blogListing — the list of posts the public blog pages show, built from the
// blog directory (src/lib/blogDirectory.js) on the server.
//
// Order matches what useBlogs() always produced in the browser: admin posts
// first (newest first), then the built-in posts in src/data/blogs.js order.
// Retired duplicates never appear (RH-02).
import { blogs as staticBlogs } from '../data/blogs.js'
import { resolveBlogImage } from './blogImages.js'
import { RETIRED_BLOG_SLUGS } from './seoDuplicates.js'

export function buildBlogListing(directory = []) {
  const remote = directory.filter((entry) => entry.remote)
  const remoteSlugs = new Set(remote.map((entry) => entry.slug))

  const remoteItems = remote.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    category: entry.category || 'General',
    excerpt: entry.excerpt || '',
    image: resolveBlogImage({
      slug: entry.slug,
      image: entry.image || '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
    }),
    readMins: entry.readMins || 5,
    isFeatured: !!entry.isFeatured,
    iso: entry.iso,
    date: entry.date,
    _remote: true,
  }))

  const staticItems = staticBlogs
    .filter((blog) => !remoteSlugs.has(blog.slug))
    .map((blog) => ({ ...blog, image: resolveBlogImage(blog) }))

  return [...remoteItems, ...staticItems].filter((blog) => !RETIRED_BLOG_SLUGS.has(blog.slug))
}

export function blogCategories(listing) {
  return ['All', ...Array.from(new Set(listing.map((b) => b.category)))]
}
