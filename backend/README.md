# Renew Healthcare — Backend (Supabase)

There is no separate Node server. The "backend" is **Supabase** (database +
storage + auth), driven entirely from the **/admin** panel in the frontend.

## What's in here

| Area | Table / bucket | Notes |
|------|----------------|-------|
| Blog posts | `blogs` | public reads published; admin manages |
| Leads | `leads` | every site form submits here; status pipeline |
| Doctors | `doctors` | team profiles shown on the Doctors page |
| Testimonials | `testimonials` | patient stories shown in the reviews wall |
| FAQs | `faqs` | shown in the FAQ section |
| Site settings | `site_settings` | phone, WhatsApp, email, announcement bar |
| Images | `media` bucket | **all** admin image uploads, stored as `.webp` |

The browser talks to Supabase directly with the **anon key** (safe to ship —
Row Level Security decides what it can do).

> The existing static content (133 blog posts, the built-in doctors list, the
> default FAQs and Google reviews) stays in the frontend code. Everything in
> Supabase is **additive** — the site merges admin rows on top of the static data.

---

## One-time setup (about 3 minutes)

### 1. Create the structure
1. Open your Supabase project: <https://supabase.com/dashboard/projects>
2. **SQL Editor → New query** → paste all of [`schema.sql`](./schema.sql) → **Run**.
   - Safe to run repeatedly (idempotent). Re-run it now to add the new tables.

### 1b. Import your existing data (run ONCE, after schema.sql)
3. **SQL Editor → New query** → paste all of [`seed.sql`](./seed.sql) → **Run**.
   - This loads your current in-code doctors, testimonials and FAQs into Supabase
     so you can **edit** them in the admin instead of retyping. Each block only
     runs while its table is empty, so re-running won't duplicate.
   - Regenerate it any time from the codebase: `node tools/gen_seed.mjs > backend/seed.sql`

> After seeding, the website reads doctors / testimonials / FAQs from Supabase.
> The in-code lists are kept only as a fallback for when a table is empty.
> (Blog posts are different: the 133 static posts always stay, and Supabase posts
> are added on top.)

### 2. Create your admin login
**Authentication → Users → Add user → Create new user** → email + password →
tick **Auto Confirm User**. Use that to log in at **/admin**.

### 3. Run the site
```bash
npm install
npm run dev
```
- Public site: <http://localhost:5173/>
- Admin panel: <http://localhost:5173/admin>

Add the Supabase URL + anon key from **Project Settings → API** to `.env`.
Use [`.env.example`](../.env.example) for the required variable names.

---

## Admin panel (`/admin`)

| Page | What it does |
|------|--------------|
| **Dashboard** | KPI cards, leads-by-source breakdown, recent leads |
| **Blog posts** | create/edit/delete posts, rich text, cover + inline images |
| **Leads** | status pipeline (New→Contacted→Converted→Closed), search, source filter, **CSV export** |
| **Doctors** | add/edit team members with photo, department, bio |
| **Testimonials** | patient stories with photo + rating |
| **FAQs** | question/answer entries |
| **Settings** | contact details + the announcement bar |

All image uploads are converted to **WebP** and stored in the `media` bucket.

## How the code is wired
- `src/lib/supabase.js` — shared client (reads `.env`).
- `src/lib/storage.js` — `media` bucket upload/list/delete (+ WebP conversion).
- `src/lib/blogApi.js` — blogs + leads.
- `src/lib/content.js` — doctors / testimonials / faqs / settings.
- `src/hooks/` — `useBlogs`, `useContent` (doctors/testimonials/faqs/settings),
  `useLeadSubmit` — merge Supabase data with the static data on the public site.
- `src/admin/` — the whole admin panel.

## Lead form sources
Every form tags its submission with a `source` so you can tell them apart:
`callback-modal`, `footer`, `blog-enquiry`, `contact-page`.
