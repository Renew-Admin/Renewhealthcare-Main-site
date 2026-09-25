# Renew Healthcare Main Site

Next.js (App Router) marketing and admin site for Renew Healthcare, built for a fertility and women’s health clinic in Kolkata.

Every public page is rendered on the server (static generation, with 5-minute
incremental regeneration where content comes from the admin panel), so the HTML
response already contains the page's headings, text, links, metadata and JSON-LD.
See [docs/NEXTJS-MIGRATION.md](./docs/NEXTJS-MIGRATION.md) for the architecture
and the remaining Cloudflare deployment steps.

## What This Repo Contains

- Public website with a homepage, services, doctors, locations, blogs, success stories, and content pages.
- A dedicated admin panel at `/admin` for managing blogs, leads, doctors, testimonials, FAQs, and site settings.
- Supabase-backed content storage for admin-managed data.
- Static fallback content for core public pages so the site still works even if Supabase is not configured.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Framer Motion
- React Router (admin panel only)
- Supabase Auth, Database, and Storage

## Key Features

- Responsive public site with a shared header, footer, announcement banner, and floating contact actions.
- SEO metadata rendered on the server from one route manifest (`src/lib/seoRoutes.js` → `src/lib/nextSeo.js`): title, description, canonical, robots, Open Graph, Twitter cards and JSON-LD.
- Blog system with:
  - public blog listing and article pages
  - static blog-content HTML fallbacks
  - admin-created posts stored in Supabase
  - featured-blog selection for the blog home page
  - inline image upload support in the editor
- Lead capture from multiple forms with status tracking in the admin panel.
- Admin-managed content for doctors, testimonials, FAQs, and contact/site settings.

## Project Structure

```text
src/
  app/            Next.js routes: (site)/ public pages, admin/, sitemaps, api/
  proxy.js        410s and 301s (retired, duplicate, legacy, trailing-slash URLs)
  views/          Page components rendered by the routes in src/app
  components/     Shared UI sections and reusable blocks
  admin/          Admin panel (client-only React Router app mounted at /admin)
  data/           Static content and fallbacks
  hooks/          Client data hooks and lead submission
  lib/            SEO, server data, sitemaps, Supabase clients, blog helpers
public/
  blog-content/   Static blog article HTML (rendered into /blogs/<slug> on the server)
  images/         Site assets
scripts/
  generate-sitemap.js
                  Prebuild: stamps the build date and writes robots.txt
  fix-internal-links.mjs
                  Rewrites legacy internal links in public/blog-content/
  prepare-cloudflare-worker-build.mjs
                  Obsolete (Vite/Worker build); kept until the OpenNext deploy lands
backend/
  schema.sql      Supabase schema and RLS setup
  seed.sql        Initial data for doctors/testimonials/faqs/settings
```

## Public Routes

- `/` home
- `/services` and `/services/:slug`
- `/doctors` and `/doctor/:slug`
- `/locations` and `/locations/:slug`
- `/about-us`
- `/why-renew`
- `/success-stories`
- `/blogs` and `/blogs/:slug`
- `/contact`
- `/admin/*` admin panel

## Admin Panel

The admin panel supports:

- Blog post create/edit/delete
- Featured blog selection
- Lead pipeline management
- Doctors management
- Testimonials management
- FAQ management
- Site settings

## Blog Image Rules

The blog cover image and any in-body image accept **any picture** — JPG, PNG,
WebP, GIF, AVIF — at any size. Nothing needs converting by hand.

Every blog upload is stored as **WebP under 100 KB**. The conversion happens in
the browser in [`src/lib/storage.js`](./src/lib/storage.js) before the file
reaches Supabase: the image is decoded, resized down from 1600px as needed, and
re-encoded at the highest WebP quality that still fits the 100 KB budget. A file
that is already a small enough WebP is passed through untouched rather than
re-encoded.

Two limits come from the browser, not from us. **HEIC** (the iPhone default)
only decodes in Safari — Chrome and Firefox reject it, and the upload fails with
a message asking for a JPG or PNG instead. Set iPhone cameras to "Most
Compatible" to get JPGs, or upload from Safari. **Animated GIFs** upload fine but
keep only their first frame, since the conversion draws to a canvas.

The ceiling lives in one place — `BLOG_IMAGE_MAX_BYTES` in `src/lib/storage.js`.

## GMB Image Rules

Google Business Profile posts are served as JPG, so the GMB section stores
**JPG only** — the opposite of the blog. Both inputs end at the same place:

- **Upload a file** — any picture is converted to JPEG and saved as `.jpg`.
- **Paste an image link** — the picture is downloaded, converted, and re-hosted
  in the `gmb-posts` bucket. A `xyz.webp` link comes back out as `xyz.jpg`.

The link is re-hosted rather than renamed on purpose: rewriting `.webp` to
`.jpg` in the text would point at a file that does not exist. Pasted links only
work if the remote host allows cross-origin reads — if it doesn't, the panel
says so and asks for a file upload instead.

Transparency is flattened onto white, since JPEG has no alpha channel.

Run [`scripts/gmb-jpeg-only.sql`](./scripts/gmb-jpeg-only.sql) to enforce the
same rule in Supabase. Read step 2's warning before running step 3.

Both formats share one converter — [`src/lib/imageConvert.js`](./src/lib/imageConvert.js).

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The `VITE_` names are kept for compatibility; `next.config.mjs` maps them to
`NEXT_PUBLIC_*`. Only the public anon key may go here — never a service-role key.

3. Run the dev server:

```bash
npm run dev
```

The app starts on `http://localhost:3000/`.

To build and run the production server without contacting Supabase at all
(static fallback content; lead forms become a local dry run):

```bash
npm run build:offline
npm run start:offline
```

## Supabase Setup

1. Open the Supabase project.
2. Run [`backend/schema.sql`](./backend/schema.sql).
3. Run [`backend/seed.sql`](./backend/seed.sql) once to import the initial content.
4. Create an authenticated admin user in Supabase Auth.
5. Log in at `/admin`.

## Environment Notes

- If Supabase is not configured, the public site still runs using static content.
- The admin panel will show a setup notice until the Supabase env vars are provided.
- All admin image uploads go to the `media` bucket.

## Scripts

- `npm run dev` - start the local development server
- `npm run build` / `npm run start` - production build and server
- `npm run build:offline` / `npm run start:offline` - same, with Supabase disabled
- `npm run generate:sitemap` - stamp the build date and regenerate `public/robots.txt`
- `npm run fix:links` - rewrite internal links in `public/blog-content/` to their
  current paths so none of them costs a redirect hop
- `npm run check:links` - report-only version of the above; exits non-zero if any
  article still links through a redirect (run this in CI after a content import)
- `npm run lint` - run ESLint

## Cloudflare Deployment

Not wired up yet. The previous Workers static-assets deploy (Vite build +
`src/worker.js`) no longer applies, and `npm run deploy:cloudflare` was removed
so the new build cannot be deployed by accident. The Next.js app deploys to
Cloudflare Workers through the OpenNext adapter — see
[docs/NEXTJS-MIGRATION.md](./docs/NEXTJS-MIGRATION.md#cloudflare-deployment-not-done).
`wrangler.toml` still describes the old Worker and must be replaced as part of
that step.

## How Blog URLs Resolve

A post published from `/admin` exists only in Supabase. `/blogs/[slug]` is
prerendered for every post known at build time; a post published later is
rendered on its first request (`dynamicParams`) from the live blog directory
(`src/lib/blogDirectory.js`) and cached for 5 minutes, and it appears in
`post-sitemap.xml` within the same window — no rebuild needed. The article body
is always in the server HTML.

`src/data/blogs.js` is the offline fallback, not the source of truth. The route
manifest, the sitemaps and the `/blogs` listing all read the same directory, so
a post cannot be listed in one place and missing from another.

Duplicate URLs are retired in `src/lib/seoDuplicates.js` — one entry per pair,
retired path on the left and surviving path on the right. Adding a pair there
gives you the 301, drops the URL from the sitemap, and hides it from the blog
listing in one edit.

## SEO Files

- `public/robots.txt`
- `/sitemap_index.xml`, `/sitemap.xml`, `/page-sitemap.xml`, `/services-sitemap.xml`,
  `/course-sitemap.xml`, `/post-sitemap.xml` — route handlers in `src/app/`,
  rendered from the live blog directory and doctor list (5-minute revalidation)
- `public/sitemap.xsl`

## Notes For Contributors

- Keep public pages responsive across mobile, tablet, and desktop widths.
- Preserve the static fallback content when touching blog or content loading code.
- Keep admin-only changes scoped to `src/admin/` unless the public data shape changes.
