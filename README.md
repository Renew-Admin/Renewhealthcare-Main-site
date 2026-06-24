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

Blog images are restricted to:

- WebP format only
- Under 200 KB

This is enforced in the admin upload flow before the file is accepted.

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
- `npm run build` - build the production bundle
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## SEO Files

- `public/robots.txt`
- `public/sitemap.xml`
- `public/sitemap.xsl`

## Notes For Contributors

- Keep public pages responsive across mobile, tablet, and desktop widths.
- Preserve the static fallback content when touching blog or content loading code.
- Keep admin-only changes scoped to `src/admin/` unless the public data shape changes.

