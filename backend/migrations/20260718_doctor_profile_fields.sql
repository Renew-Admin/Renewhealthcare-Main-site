-- Adds extended doctor profile fields used by the admin panel.
-- Safe to run more than once in Supabase SQL Editor.

alter table public.doctors
  add column if not exists experience_years text default '',
  add column if not exists milestone_stat text default '',
  add column if not exists qualifications jsonb not null default '[]'::jsonb,
  add column if not exists specializations jsonb not null default '[]'::jsonb,
  add column if not exists languages jsonb not null default '[]'::jsonb,
  add column if not exists past_attachments jsonb not null default '[]'::jsonb,
  add column if not exists clinic_address text default '',
  add column if not exists service_areas jsonb not null default '[]'::jsonb,
  add column if not exists faqs jsonb not null default '[]'::jsonb;

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
