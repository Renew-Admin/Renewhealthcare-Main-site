// branchContacts — which phone and WhatsApp line a page should offer.
//
// Website brief (checked 23 Oct 2026): every branch page used the same
// site-wide pair (the call button dialled Salt Lake, WhatsApp went to
// Mandeville Gardens), so a Jamshedpur visitor reached neither. On a branch
// page the buttons now use that branch's own number from
// src/data/locations.js; everywhere else the site-wide pair is unchanged.
//
// Pure functions, no React: shared by the floating buttons (client) and the
// branch page (server), and covered by tests/branchContacts.test.mjs.
import { locations } from '../data/locations.js'
import { normalizePath } from './seoUtils.js'

export const SITE_CONTACT = {
  slug: '',
  name: 'Renew Healthcare',
  phoneDisplay: '062923 12076',
  tel: 'tel:06292312076',
  whatsapp: '916292269060',
  message: "Hi Renew Healthcare, I'd like to know more about your fertility treatments.",
}

// Owner's decision, 24 Oct 2026: branch pages use the clinic's central
// WhatsApp line (+91 62923 12116, the number the clinic's ads also use) with
// a message that names the branch, so the front desk routes the chat.
export const BRANCH_WHATSAPP = '916292312116'

/** '+91 62922 69061' -> { display: '062922 69061', tel: 'tel:06292269061' } */
export function formatPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '')
  const national = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  if (!national) return { display: '', tel: '' }
  return {
    display: national.length === 10 ? `0${national.slice(0, 5)} ${national.slice(5)}` : `0${national}`,
    tel: `tel:0${national}`,
  }
}

export function whatsappUrl(number, message) {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`
}

/** Contact details for one branch (locations.js entry). */
export function branchContact(location) {
  const phone = formatPhone(location.phone)
  // A branch with its own WhatsApp line (locations.js `whatsapp`) uses it;
  // otherwise the central line, with the branch named in the message.
  const own = String(location.whatsapp || '').replace(/\D/g, '')
  const shortName = location.name.replace(/^Renew\s+/, '')
  const branchName = location.gbpName === 'Renew Healthcare' ? `Renew Healthcare ${shortName}` : location.name
  return {
    slug: location.slug,
    name: branchName,
    phoneDisplay: phone.display,
    tel: phone.tel,
    whatsapp: own || BRANCH_WHATSAPP,
    message: own
      ? `Hi ${branchName}, I'd like to know more about your fertility treatments.`
      : `Hi Renew Healthcare, I'd like to know more about fertility treatments at your ${shortName} centre.`,
  }
}

/** The contact pair for a page path: the branch's own on /locations/<slug>, the site-wide pair elsewhere. */
export function contactForPath(pathname) {
  const path = normalizePath(pathname || '/')
  const match = path.match(/^\/locations\/([^/]+)$/)
  if (!match) return SITE_CONTACT
  const location = locations.find(item => item.slug === match[1])
  return location ? branchContact(location) : SITE_CONTACT
}

/** Google Maps driving directions to the branch. */
export function directionsUrl(location) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.gbpName || location.name}, ${location.gbpAddress || location.address}`)}`
}
