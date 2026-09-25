// /blogs/<slug> — every article, with its full body in the HTML.
//
// Posts known at build time are prerendered. Posts published from the admin
// panel afterwards are rendered on first request and cached (dynamicParams +
// ISR, RH-01). Retired duplicates are redirected by src/proxy.js before they
// get here; unknown slugs are a real 404.
import { notFound } from 'next/navigation'
import BlogPostPage from '../../../../views/BlogPostPage.jsx'
import JsonLd from '../../../../components/JsonLd.js'
import { resolveBlogImage } from '../../../../lib/blogImages.js'
import { buildArticleSchemas, detectArticleLang, getHreflangAlternates } from '../../../../lib/blogSeo.js'
import { metadataForPath, toMetadata } from '../../../../lib/nextSeo.js'
import { getArticle, getBlogListing, getDirectory } from '../../../../lib/serverData.js'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  const directory = await getDirectory()
  return directory.map((article) => ({ slug: article.slug }))
}

function describe(article, directory, html) {
  const liveSlugs = new Set(directory.map((item) => item.slug))
  return {
    lang: detectArticleLang(article),
    heroImage: resolveBlogImage(article, html || ''),
    alternates: getHreflangAlternates(article.slug, { isLive: (slug) => liveSlugs.has(slug) }),
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const resolved = await getArticle(decodeURIComponent(slug))
  if (!resolved) return metadataForPath('/404-not-a-route')

  const { article, html, directory } = resolved
  const { lang, heroImage, alternates } = describe(article, directory, html)
  return toMetadata({
    path: `/blogs/${article.slug}`,
    title: article.title,
    description: article.excerpt,
    image: heroImage,
    type: 'article',
    lang,
    alternates,
  })
}

export default async function BlogArticleRoute({ params }) {
  const { slug } = await params
  const resolved = await getArticle(decodeURIComponent(slug))
  if (!resolved) notFound()

  const { article, html, directory } = resolved
  const { lang, heroImage } = describe(article, directory, html)

  // Sidebar: up to four posts from the same category, topped up with others.
  const listing = await getBlogListing()
  const related = listing.filter((b) => b.slug !== article.slug && b.category === article.category).slice(0, 4)
  const fill = related.length < 4
    ? listing.filter((b) => b.slug !== article.slug && !related.includes(b)).slice(0, 4 - related.length)
    : []
  const sidebar = [...related, ...fill].map(({ slug: itemSlug, title, image }) => ({ slug: itemSlug, title, image }))

  const listed = listing.find((b) => b.slug === article.slug)
  const blog = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: listed?.date || article.date,
    readMins: listed?.readMins || article.readMins,
  }

  return (
    <>
      <JsonLd data={buildArticleSchemas(article, html, { lang, image: heroImage })} />
      <BlogPostPage blog={blog} html={html} sidebar={sidebar} heroImage={heroImage} lang={lang} />
    </>
  )
}
