# Renew Healthcare Backend Integration Guide

This backend is Supabase-based. There is no separate Node/Express server to run.
The browser uses the Supabase anon key, and Supabase Row Level Security controls
what public visitors and logged-in admins can do.

## Package Contents

The backend zip includes:

| Path | Purpose |
|------|---------|
| `backend/migrations/20260630_renew_healthcare_backend.sql` | Main idempotent Supabase migration |
| `backend/schema.sql` | Same schema as a dashboard-friendly SQL file |
| `backend/seed.sql` | Optional starter data for doctors, testimonials and FAQs |
| `backend/README.md` | Current project backend notes |
| `backend/INTEGRATION_GUIDE.md` | This portable install guide |
| `backend/package-dependencies.json` | Dependencies needed by the integration files |
| `.env.example` | Environment variable names |
| `src/lib/` | Supabase client, CRUD APIs, media upload helper |
| `src/hooks/` | React hooks used by the public site/forms |
| `src/admin/` | Complete React admin panel |
| `src/data/blogs.js`, `src/data/doctors.js` | Static fallback data required by the included hooks |

## Tables And Storage Needed

Run the migration before using the admin panel or forms.

| Type | Name | Required for |
|------|------|--------------|
| Table | `blogs` | Admin-created blog posts and drafts |
| Table | `leads` | All website enquiries/contact form submissions |
| Table | `doctors` | Admin-managed doctor/team profiles |
| Table | `testimonials` | Patient stories/reviews |
| Table | `faqs` | FAQ entries |
| Table | `site_settings` | Phone, WhatsApp, email, announcement bar |
| Storage bucket | `media` | Admin-uploaded images, public WebP URLs |
| Supabase Auth | `auth.users` | Admin login users |

No custom `users` table is required. Admin access currently means any signed-in
Supabase Auth user can manage backend content, so only create trusted users in
Supabase Authentication. If the target project has customer/member logins, add a
separate admin-role policy before sharing this backend with those users.

## Main Columns

### `blogs`

`id`, `slug`, `title`, `category`, `excerpt`, `content`, `cover_image`,
`read_mins`, `published`, `is_featured`, `published_at`, `created_at`,
`updated_at`

### `leads`

`id`, `name`, `phone`, `email`, `service`, `message`, `source`, `page_path`,
`status`, `created_at`

Allowed lead statuses used by the admin UI: `new`, `contacted`, `converted`,
`closed`.

### `doctors`

`id`, `name`, `role`, `qualification`, `category`, `photo`, `bio`,
`display_order`, `active`, `created_at`, `updated_at`

### `testimonials`

`id`, `name`, `location`, `treatment`, `quote`, `photo`, `rating`,
`display_order`, `active`, `created_at`, `updated_at`

### `faqs`

`id`, `question`, `answer`, `category`, `display_order`, `active`,
`created_at`, `updated_at`

### `site_settings`

`key`, `value`, `updated_at`

Starter keys inserted by the migration: `phone`, `whatsapp`, `email`,
`announcement`, `announcement_active`.

## Step-by-step Setup In A New Codebase

### 1. Create or choose a Supabase project

Open Supabase Dashboard and create/select the project that should store this
site data.

### 2. Run the migration

Use either option.

Supabase Dashboard:

1. Open `SQL Editor`.
2. Start a new query.
3. Paste `backend/migrations/20260630_renew_healthcare_backend.sql`.
4. Run it.

Supabase CLI:

1. Place `backend/migrations/20260630_renew_healthcare_backend.sql` in the
   target project's `supabase/migrations/` folder.
2. Run:

```bash
supabase db push
```

The migration is idempotent and safe to run again.

### 3. Run optional seed data

Run `backend/seed.sql` only if you want the current Renew Healthcare doctors,
testimonials and FAQs loaded into the new Supabase project.

The seed checks whether each table is empty before inserting, so re-running does
not duplicate those rows.

### 4. Create an admin login

In Supabase Dashboard:

1. Go to `Authentication -> Users`.
2. Add a user.
3. Enter the admin email and password.
4. Enable auto-confirm.

That email/password logs into the `/admin` panel.

### 5. Add environment variables

For Vite/React projects:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

These values are in Supabase Dashboard under `Project Settings -> API`.

For non-Vite projects, keep the same values but rename them to the framework's
public environment variable convention, then update `src/lib/supabase.js`.

### 6. Install required dependencies

Minimum for the Supabase client:

```bash
npm install @supabase/supabase-js
```

For the included React admin panel:

```bash
npm install @supabase/supabase-js react react-dom react-router-dom
```

### 7. Add backend client files

Move these folders/files into the target React app, keeping their relative paths
unless you also update imports:

```text
src/lib/
src/hooks/
src/admin/
src/data/blogs.js
src/data/doctors.js
```

Important files:

| File | What it does |
|------|--------------|
| `src/lib/supabase.js` | Creates the Supabase browser client |
| `src/lib/blogApi.js` | Blog CRUD and lead CRUD |
| `src/lib/content.js` | Doctors, testimonials, FAQs and settings CRUD |
| `src/lib/storage.js` | Uploads images to the `media` bucket |
| `src/hooks/useLeadSubmit.js` | Shared lead form submit hook |
| `src/admin/AdminApp.jsx` | Admin panel root |

`src/hooks/useBlogs.js` and `src/hooks/useContent.js` import static fallback data
from this Renew Healthcare frontend. The package includes the needed fallback
files. In a different codebase, you can keep them, replace them with your own
data, or remove those fallback imports and use only Supabase rows.

### 8. Wire the admin route

In a React Router app, mount the admin app:

```jsx
import AdminApp from './admin/AdminApp.jsx'

<Route path="/admin/*" element={<AdminApp />} />
```

If the target project does not use React Router, keep the Supabase `src/lib/*`
files and rebuild the admin screens in that router/framework.

### 9. Connect public lead forms

Use the hook:

```jsx
import { useLeadSubmit } from './hooks/useLeadSubmit.js'

const { status, error, submit } = useLeadSubmit()

await submit({
  name,
  phone,
  email,
  service,
  message,
  source: 'contact-page',
})
```

Or use the API directly:

```js
import { createLead } from './lib/blogApi.js'

await createLead({
  name: 'Patient name',
  phone: '9999999999',
  source: 'website',
})
```

### 10. Connect public content

Use these APIs for framework-agnostic integration:

```js
import { fetchPublishedPosts } from './lib/blogApi.js'
import { doctorsApi, testimonialsApi, faqsApi, fetchSettings } from './lib/content.js'

const blogs = await fetchPublishedPosts()
const doctors = await doctorsApi.listActive()
const testimonials = await testimonialsApi.listActive()
const faqs = await faqsApi.listActive()
const settings = await fetchSettings()
```

### 11. Verify after installation

Run these checks:

1. Open `/admin` and log in with the Supabase Auth user.
2. Create a test blog post with `published = true`.
3. Submit a public lead form.
4. Upload one image from the admin panel.
5. Confirm these rows exist in Supabase:

```sql
select count(*) from public.blogs;
select count(*) from public.leads;
select count(*) from public.doctors;
select count(*) from public.testimonials;
select count(*) from public.faqs;
select * from public.site_settings;
```

Also confirm the `media` storage bucket exists and is public.

## Deployment Notes

- Use the Supabase anon public key in frontend builds. Do not use the service
  role key in browser code.
- Keep Row Level Security enabled.
- The migration creates public read access for published/active content and
  public insert access for leads.
- All admin writes require a logged-in Supabase Auth session.
- For production sites with many authenticated user types, tighten admin RLS
  before launch.
