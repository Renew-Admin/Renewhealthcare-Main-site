// doctorRegistrations — medical council registration numbers shown on the
// doctor pages (website brief for renewhealthcare.in, checked 23 Oct 2026:
// "no doctor page shows a registration number yet").
//
// Keyed by the doctor's page slug (src/lib/doctorsModel.js slugifyName). The
// CMS has no registration column, so the number lives here and is merged into
// the doctor record whichever list (Supabase or src/data/doctors.js) is in
// use. Add a doctor ONLY with the number from their council certificate; a
// wrong number on a medical page is worse than none.
//
// Pending from the clinic (24 Oct 2026): Dr. Dorothy P Ghosh, Dr. Neha Yadav,
// Dr. Sonam Agarwal, Dr. Arnab Kundu and the visiting consultants.

export const DOCTOR_REGISTRATIONS = {
  // Same number the doctor's own site shows in its footer and Physician schema.
  'dr-rajeev-agarwal': { council: 'West Bengal Medical Council', number: 'WBMC52540' },
}

export function getDoctorRegistration(slug) {
  return DOCTOR_REGISTRATIONS[String(slug || '')] || null
}

/** "West Bengal Medical Council Reg. No. WBMC52540" */
export function formatRegistration(registration) {
  if (!registration?.number) return ''
  return `${registration.council} Reg. No. ${registration.number}`
}
