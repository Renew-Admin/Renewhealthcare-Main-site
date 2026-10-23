// doctorArticles — blog pages whose text has been replaced by an article
// written by Dr. Rajeev Agarwal (Lokesh's brief "old blogs, new blogs and
// redirects", 23 Oct 2026).
//
// Each page listed here:
//   - shows the byline below and a "Last updated" date (`updated`; set it to
//     the day the new text goes live, and change it whenever the text is revised);
//   - uses the exact meta title and meta description from the brief;
//   - uses the brief's FAQ answers for the FAQPage schema;
//   - names Dr. Rajeev Agarwal (a Person) as the author in the BlogPosting schema.
//
// Add a page ONLY on the day its new text goes live. Listing a page whose old
// text is still published would credit that text to Dr. Agarwal.

export const DOCTOR_BYLINE = 'Written by Dr. Rajeev Agarwal, MBBS, MD (Obstetrics & Gynaecology)'

export const DOCTOR_AUTHOR = {
  '@type': 'Person',
  name: 'Dr. Rajeev Agarwal',
  honorificSuffix: 'MBBS, MD (Obstetrics & Gynaecology)',
  jobTitle: 'Fertility specialist',
  url: 'https://drrajeevagarwal.co.in/about-me',
}

export const DOCTOR_ARTICLES = {
  'placentrex-injection-uses-benefits-risks-dosage': {
    // Date the new text went live: shown as "Last updated" and used as dateModified.
    updated: '2026-10-23',
    metaTitle: 'Placentrex Injection in Pregnancy & Infertility: Evidence | Dr Rajeev Agarwal',
    metaDescription:
      'Is Placentrex (human placental extract) injection useful for thin endometrium, miscarriage or IVF? What it is, what it is studied for, and what the evidence shows.',
    faqs: [
      {
        question: 'What is Placentrex injection?',
        answer:
          'An injectable extract of human placenta, sold in India and prescribed for conditions such as wound healing and some inflammatory conditions.',
      },
      {
        question: 'Does Placentrex help you get pregnant?',
        answer: 'A PubMed search found no randomised trial showing more pregnancies or live births with placental extract.',
      },
      {
        question: 'Is Placentrex useful for a thin endometrium?',
        answer: 'There is no trial evidence that it improves live birth in women with a thin lining.',
      },
      {
        question: 'Does Placentrex prevent miscarriage?',
        answer: 'No trial has shown that it reduces miscarriage, and fertility guidelines do not recommend it for this.',
      },
    ],
  },
}

export function getDoctorArticle(slug) {
  return DOCTOR_ARTICLES[String(slug || '')] || null
}

/** "2026-10-23" -> "October 23, 2026" (the format the blog listing uses). */
export function formatLastUpdated(iso) {
  if (!iso) return ''
  const parsed = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}
