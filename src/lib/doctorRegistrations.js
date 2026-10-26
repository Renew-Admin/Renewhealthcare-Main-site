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
// Numbers as supplied by the client (task B1, 26 Oct 2026), written exactly
// as given. Dr. Sonam Agarwal has no entry on purpose (the client asked for
// the field to stay empty), so her page shows no registration line. Still
// pending: the visiting consultants.

export const DOCTOR_REGISTRATIONS = {
  'dr-rajeev-agarwal': { council: 'West Bengal Medical Council', number: 'WBMC 52540' },
  'dr-dorothy-p-ghosh': { council: 'West Bengal Medical Council', number: 'WBMC 56403' },
  'dr-arnab-kundu': { council: 'West Bengal Medical Council', number: 'WBMC 67050' },
  'dr-neha-yadav': { council: 'West Bengal Medical Council', number: 'WBMC 85882' },
}

export function getDoctorRegistration(slug) {
  return DOCTOR_REGISTRATIONS[String(slug || '')] || null
}

/** "West Bengal Medical Council Reg. No. WBMC 52540" */
export function formatRegistration(registration) {
  if (!registration?.number) return ''
  return `${registration.council} Reg. No. ${registration.number}`
}
