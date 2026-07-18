-- ============================================================================
-- Renew Healthcare — Supabase backend (one file).
--
-- WHAT THIS GIVES YOU
--   Tables (all managed from the /admin panel):
--     • blogs         — blog posts
--     • leads         — every enquiry from any form on the site (+ status pipeline)
--     • doctors       — team / doctor profiles
--     • testimonials  — patient stories / reviews
--     • faqs          — frequently asked questions
--     • site_settings — editable site config (phones, banner, etc.)
--   Storage:
--     • a public `media` bucket — ALL admin-uploaded images live here (.webp)
--   Security:
--     • Row Level Security so the public can READ published content and SUBMIT
--       leads, while a logged-in admin can manage everything.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL Editor -> New query -> paste this whole file ->
--   click "Run". It is safe to run more than once (it is idempotent).
--
-- CREATE THE ADMIN LOGIN (do this once, after running this file)
--   Supabase dashboard -> Authentication -> Users -> "Add user" ->
--   "Create new user". Enter the admin email + password and tick
--   "Auto Confirm User". That email/password is what you log in with at /admin.
--
-- IMPORTANT: This does NOT touch the existing static content shipped in the
--   frontend code (133 blog posts, the doctors list, etc.). Everything here is
--   purely additive — the website merges these rows on top of the static data.
-- ============================================================================


-- gen_random_uuid() lives in pgcrypto (already enabled on Supabase, but be safe).
create extension if not exists pgcrypto;

-- Reusable: keep updated_at fresh on any row update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;


-- ---------------------------------------------------------------------------
-- BLOGS
-- ---------------------------------------------------------------------------
-- Migrate older installs: rename `posts` -> `blogs`, but ONLY if `posts`
-- exists and `blogs` does not (so re-running can never error).
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'posts')
     and not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'blogs') then
    alter table public.posts rename to blogs;
  end if;
end $$;

create table if not exists public.blogs (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  category     text not null default 'General',
  excerpt      text default '',
  content      text default '',
  cover_image  text default '',
  read_mins    integer not null default 5,
  published    boolean not null default true,
  is_featured  boolean not null default false,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.blogs add column if not exists is_featured boolean not null default false;
create index if not exists blogs_published_idx on public.blogs (published, published_at desc);
create index if not exists blogs_featured_idx on public.blogs (is_featured, published_at desc);
create index if not exists blogs_slug_idx on public.blogs (slug);
drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at before update on public.blogs
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- LEADS (every form submission) + status pipeline
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  phone      text,
  email      text,
  service    text,
  message    text,
  source     text not null default 'website',
  page_path  text,
  status     text not null default 'new',   -- new | contacted | converted | closed
  created_at timestamptz not null default now()
);
alter table public.leads add column if not exists status text not null default 'new';
alter table public.leads add column if not exists customer_number text;
alter table public.leads add column if not exists whatsapp_number text;
alter table public.leads add column if not exists purpose text;
alter table public.leads add column if not exists form_date text;
create index if not exists leads_created_idx on public.leads (created_at desc);


-- ---------------------------------------------------------------------------
-- DOCTORS / TEAM
-- ---------------------------------------------------------------------------
create table if not exists public.doctors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text default '',          -- designation, e.g. "Fertility Specialist"
  qualification text default '',
  category      text default 'Our Experts',
  photo         text default '',
  bio           text default '',
  experience_years text default '',
  milestone_stat text default '',
  qualifications jsonb not null default '[]'::jsonb,
  specializations jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  past_attachments jsonb not null default '[]'::jsonb,
  clinic_address text default '',
  service_areas jsonb not null default '[]'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.doctors add column if not exists experience_years text default '';
alter table public.doctors add column if not exists milestone_stat text default '';
alter table public.doctors add column if not exists qualifications jsonb not null default '[]'::jsonb;
alter table public.doctors add column if not exists specializations jsonb not null default '[]'::jsonb;
alter table public.doctors add column if not exists languages jsonb not null default '[]'::jsonb;
alter table public.doctors add column if not exists past_attachments jsonb not null default '[]'::jsonb;
alter table public.doctors add column if not exists clinic_address text default '';
alter table public.doctors add column if not exists service_areas jsonb not null default '[]'::jsonb;
alter table public.doctors add column if not exists faqs jsonb not null default '[]'::jsonb;
update public.doctors
set experience_years = coalesce(experience_years, ''),
    milestone_stat = coalesce(milestone_stat, ''),
    qualifications = coalesce(qualifications, '[]'::jsonb),
    specializations = coalesce(specializations, '[]'::jsonb),
    languages = coalesce(languages, '[]'::jsonb),
    past_attachments = coalesce(past_attachments, '[]'::jsonb),
    clinic_address = coalesce(clinic_address, ''),
    service_areas = coalesce(service_areas, '[]'::jsonb),
    faqs = coalesce(faqs, '[]'::jsonb);
update public.doctors
set qualifications = jsonb_build_array(qualification)
where qualification is not null
  and qualification <> ''
  and qualifications = '[]'::jsonb;
alter table public.doctors
  alter column experience_years set default '',
  alter column milestone_stat set default '',
  alter column qualifications set default '[]'::jsonb,
  alter column qualifications set not null,
  alter column specializations set default '[]'::jsonb,
  alter column specializations set not null,
  alter column languages set default '[]'::jsonb,
  alter column languages set not null,
  alter column past_attachments set default '[]'::jsonb,
  alter column past_attachments set not null,
  alter column clinic_address set default '',
  alter column service_areas set default '[]'::jsonb,
  alter column service_areas set not null,
  alter column faqs set default '[]'::jsonb,
  alter column faqs set not null;
drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- TESTIMONIALS / PATIENT STORIES
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  location      text default '',          -- city / relation, shown under the name
  treatment     text default '',
  quote         text not null default '',
  photo         text default '',
  rating        integer not null default 5,
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- FAQS
-- ---------------------------------------------------------------------------
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null default '',
  category      text default 'general',   -- home | blog | general
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- SITE SETTINGS (simple key/value store)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      text default '',
  updated_at timestamptz not null default now()
);


-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================

-- Helper note: "published/active read for public, full write for admin".

-- BLOGS -------------------------------------------------------------------
alter table public.blogs enable row level security;
drop policy if exists "blogs public read" on public.blogs;
create policy "blogs public read" on public.blogs for select to anon, authenticated
  using (published = true or auth.role() = 'authenticated');
drop policy if exists "blogs admin write" on public.blogs;
create policy "blogs admin write" on public.blogs for all to authenticated
  using (true) with check (true);

-- LEADS -------------------------------------------------------------------
alter table public.leads enable row level security;
drop policy if exists "leads anyone insert" on public.leads;
create policy "leads anyone insert" on public.leads for insert to anon, authenticated
  with check (true);
drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads for select to authenticated using (true);
drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update" on public.leads for update to authenticated
  using (true) with check (true);
drop policy if exists "leads admin delete" on public.leads;
create policy "leads admin delete" on public.leads for delete to authenticated using (true);

-- DOCTORS / TESTIMONIALS / FAQS (same pattern) ----------------------------
alter table public.doctors enable row level security;
drop policy if exists "doctors public read" on public.doctors;
create policy "doctors public read" on public.doctors for select to anon, authenticated
  using (active = true or auth.role() = 'authenticated');
drop policy if exists "doctors admin write" on public.doctors;
create policy "doctors admin write" on public.doctors for all to authenticated
  using (true) with check (true);

alter table public.testimonials enable row level security;
drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials for select to anon, authenticated
  using (active = true or auth.role() = 'authenticated');
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials for all to authenticated
  using (true) with check (true);

alter table public.faqs enable row level security;
drop policy if exists "faqs public read" on public.faqs;
create policy "faqs public read" on public.faqs for select to anon, authenticated
  using (active = true or auth.role() = 'authenticated');
drop policy if exists "faqs admin write" on public.faqs;
create policy "faqs admin write" on public.faqs for all to authenticated
  using (true) with check (true);

-- SITE SETTINGS -----------------------------------------------------------
alter table public.site_settings enable row level security;
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings for select to anon, authenticated
  using (true);
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings for all to authenticated
  using (true) with check (true);


-- ===========================================================================
-- STORAGE — single public `media` bucket for ALL admin-uploaded images (.webp)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media');
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media');


-- ===========================================================================
-- Optional starter settings (edit later in Admin -> Settings)
-- ===========================================================================
insert into public.site_settings (key, value) values
  ('phone',         '062922 69060'),
  ('whatsapp',      '916292269060'),
  ('email',         'info@renewhealthcare.in'),
  ('announcement',  ''),
  ('announcement_link', ''),
  ('announcement_active', 'false')
on conflict (key) do nothing;

-- ============================================================================
-- Done. Create an admin user (see top), then log in at /admin
-- ============================================================================
