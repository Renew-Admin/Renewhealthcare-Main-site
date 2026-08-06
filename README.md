# Renew Healthcare Main Site

React + Vite marketing and admin site for Renew Healthcare, built for a fertility and women’s health clinic in Kolkata.

## What This Repo Contains

- Public website with a homepage, services, doctors, locations, blogs, success stories, and content pages.
- A dedicated admin panel at `/admin` for managing blogs, leads, doctors, testimonials, FAQs, and site settings.
- Supabase-backed content storage for admin-managed data.
- Static fallback content for core public pages so the site still works even if Supabase is not configured.

## Tech Stack

- React 18
- Vite
- React Router
- Framer Motion
- Supabase Auth, Database, and Storage

## Key Features

- Responsive public site with a shared header, footer, announcement banner, and floating contact actions.
- SEO metadata handled in-app with canonical tags, Open Graph tags, Twitter cards, and JSON-LD.
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
  components/     Shared UI sections and reusable blocks
  pages/          Public pages and page-specific layouts
  admin/          Admin panel, editors, tables, auth, and UI helpers
  data/           Static fallback content
  hooks/          Data loading and lead submission hooks
  lib/            Supabase client, storage, content, and blog APIs
public/
  blog-content/   Static blog article HTML
  images/         Site assets
  sitemap.xml     Search-engine sitemap
scripts/
  generate-sitemap.js
                  Generates robots.txt and the sitemaps from the blog directory
  fix-internal-links.mjs
                  Rewrites legacy internal links in public/blog-content/
  prepare-cloudflare-worker-build.mjs
                  Removes Pages-only files from Worker asset uploads
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

3. Run the dev server:

```bash
npm run dev
```

The app will usually start on `http://127.0.0.1:5173/` or the next available port.

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
- `npm run generate:sitemap` - regenerate `public/sitemap.xml` and `public/robots.txt`
- `npm run fix:links` - rewrite internal links in `public/blog-content/` to their
  current paths so none of them costs a redirect hop
- `npm run check:links` - report-only version of the above; exits non-zero if any
  article still links through a redirect (run this in CI after a content import)
- `npm run build` - regenerate SEO files and build the production bundle into `build/`
- `npm run deploy:cloudflare` - build and deploy to Cloudflare Workers static assets
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Cloudflare Workers Deployment

Use Cloudflare Workers static assets for this project.

- Build command: `npm run build`
- Build output directory: `build`
- Root directory: `/`
- Deploy command: `npx wrangler deploy`

The Worker is configured in `wrangler.toml` with `not_found_handling = "single-page-application"` for React Router direct URLs.
Do not use `wrangler pages deploy` for this project because the production URL is `renewhealthcare.lokesh-7e0.workers.dev`.

### Required Worker secrets

The Worker resolves blog routes and sitemaps against Supabase at request time,
so it needs the same two values the browser bundle uses. Set them once per
environment before deploying:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
```

For local `wrangler dev`, copy `.dev.vars.example` to `.dev.vars` and fill it in.

Without these the site still serves every page, but blog routes and sitemaps
fall back to the built-in list in `src/data/blogs.js`, and posts published from
the admin panel since the last deploy will return 404 again.

## How Blog URLs Resolve

A post published from `/admin` exists only in Supabase. The Worker looks up
`/blogs/:slug` against the live blog directory (`src/lib/blogDirectory.js`,
60-second cache) rather than a build-time list, so a new post answers 200 and
appears in `post-sitemap.xml` with no rebuild or cache purge.

`src/data/blogs.js` is the offline fallback, not the source of truth. The route
manifest, the sitemaps and the `/blogs` listing all read the same directory, so
a post cannot be listed in one place and missing from another.

Duplicate URLs are retired in `src/lib/seoDuplicates.js` — one entry per pair,
retired path on the left and surviving path on the right. Adding a pair there
gives you the 301, drops the URL from the sitemap, and hides it from the blog
listing in one edit.

## SEO Files

- `public/robots.txt`
- `public/sitemap.xml` — build-time baseline; the Worker serves this and
  `post-sitemap.xml` live from the blog directory
- `public/sitemap.xsl`

## Notes For Contributors

- Keep public pages responsive across mobile, tablet, and desktop widths.
- Preserve the static fallback content when touching blog or content loading code.
- Keep admin-only changes scoped to `src/admin/` unless the public data shape changes.
