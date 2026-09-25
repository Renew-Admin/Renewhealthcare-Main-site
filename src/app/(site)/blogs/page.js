// /blogs — static HTML built from the blog directory at deploy time. In the
// browser, useBlogs() then refreshes the list from Supabase, so posts
// published in the admin panel show up for visitors without a rebuild.
import BlogListPage from '../../../views/BlogListPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { absoluteImageUrl, canonicalUrl } from '../../../lib/seoUtils.js'
import { getBlogListing } from '../../../lib/serverData.js'

export const metadata = metadataForPath('/blogs')

export default async function BlogsRoute() {
  const listing = await getBlogListing()

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Renew Healthcare Blog',
    url: canonicalUrl('/blogs'),
    description: 'Expert articles on IVF, IUI, fertility, pregnancy, and reproductive health from Renew Healthcare, Kolkata.',
    blogPost: listing.slice(0, 20).map((blog) => ({
      '@type': 'BlogPosting',
      headline: blog.title,
      datePublished: blog.iso || undefined,
      url: canonicalUrl(`/blogs/${blog.slug}`),
      image: absoluteImageUrl(blog.image),
    })),
  }

  return (
    <>
      <JsonLd data={[blogSchema, breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blogs', path: '/blogs' }])]} />
      <BlogListPage initialBlogs={listing} />
    </>
  )
}
