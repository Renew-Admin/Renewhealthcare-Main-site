// consultationDays — which doctor consults at which branch on which days
// (owner's confirmation, 24 Oct 2026). Shown on each branch page under
// "Doctors At This Clinic" and on the doctor's own page. Times are the branch
// opening hours (src/data/locations.js OPENING_HOURS).
//
// Add a doctor ONLY from the clinic's own roster; a wrong day sends a patient
// to the wrong building. Jamshedpur days are still to be supplied.
import { locations } from '../data/locations.js'

export const CONSULTATION_DAYS = {
  saltlake: [
    { doctor: 'Dr. Rajeev Agarwal', days: 'Wednesday and Friday' },
    { doctor: 'Dr. Neha Yadav', days: 'Monday to Saturday' },
  ],
  gariahat: [
    { doctor: 'Dr. Rajeev Agarwal', days: 'Monday, Tuesday, Thursday and Saturday' },
    { doctor: 'Dr. Arnab Kundu', days: 'Monday to Saturday' },
    { doctor: 'Dr. Sonam Agarwal', days: 'Monday to Saturday' },
  ],
  jamshedpur: [],
}

/** [{ doctor, days }] for a branch slug. */
export function consultationDaysForBranch(slug) {
  return CONSULTATION_DAYS[String(slug || '')] || []
}

/** [{ branch, slug, days }] for a doctor's name, in branch order. */
export function consultationDaysForDoctor(name) {
  const wanted = String(name || '').trim()
  return locations.flatMap(location =>
    consultationDaysForBranch(location.slug)
      .filter(entry => entry.doctor === wanted)
      .map(entry => ({ branch: branchLabel(location), slug: location.slug, days: entry.days })),
  )
}

/** "Renew Ballygunge" -> "Mandeville Gardens, Ballygunge"; others by name. */
export function branchLabel(location) {
  if (location.slug === 'gariahat') return 'Mandeville Gardens, Ballygunge'
  if (location.slug === 'saltlake') return 'Salt Lake'
  return location.name
}
