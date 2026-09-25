// blogRow — a Supabase `blogs` row -> the object shape the blog UI uses.
// Pure (no Supabase import) so the public bundle can use it without the SDK.
import { resolveBlogImage } from './blogImages.js'

// The website's BlogCard / BlogPostPage expect: slug, title, date, iso,
// category, excerpt, image, readMins. `content` is the full HTML and
// `_remote: true` marks admin-published posts.
export function toBlog(row) {
  const iso = (row.published_at || row.created_at || '').slice(0, 10)
  const date = iso
    ? new Date(row.published_at || row.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || 'General',
    excerpt: row.excerpt || '',
    content: row.content || '',
    image: resolveBlogImage({
      slug: row.slug,
      image: row.cover_image || '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
    }),
    readMins: row.read_mins || 5,
    published: row.published,
    isFeatured: !!row.is_featured,
    iso,
    date,
    _remote: true,
  }
}
