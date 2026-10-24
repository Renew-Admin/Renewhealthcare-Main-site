// articleSeoOverrides — exact <title> and meta description for blog posts
// where the SEO brief supplies them (the same mechanism the doctor's site
// uses in src/data/articleSeoOverrides.js). URL, H1 and body text are never
// touched here.
//
// Keyed by slug. `metaTitle` is used word for word as the full <title> (no
// "| Renew Healthcare" suffix is added); `metaDescription` is used word for
// word (not clipped). Pages in src/lib/doctorArticles.js take their meta
// from there and ignore this list.
//
// Website brief for renewhealthcare.in (18 Oct 2026), Part 5, task 16:
// "Paste these SEO titles exactly. Leave the URL, H1 and text unchanged."
// Applied 24 Oct 2026.

export const ARTICLE_SEO_OVERRIDES = {
  'how-to-choose-the-right-ivf-clinic': { metaTitle: 'How to Choose the Best IVF Centre in Kolkata | Renew' }, // 16.1
  'hsg-test-procedure-benefits': { metaTitle: 'HSG Test for Infertility: Procedure, Pain and Results | Renew' }, // 16.2
  'what-is-endometrial-thickness': { metaTitle: 'Endometrial Thickness: Normal Size in mm and Pregnancy | Renew' }, // 16.3
  'the-five-stages-of-ivf-treatment': { metaTitle: 'IVF Step by Step: The Five Stages Explained | Renew' }, // 16.4
  'embryo-transfer-how-does-it-happen': { metaTitle: 'Embryo Transfer: What Happens on the Day | Renew' }, // 16.5
  'what-is-intracytoplasmic-sperm-injection': { metaTitle: 'ICSI Explained: How It Works and When It Is Needed | Renew' }, // 16.6
  'egg-retrieval-process-a-complete-guide': { metaTitle: 'Egg Retrieval in IVF: What to Expect | Renew' }, // 16.7
}

export function getArticleSeoOverride(slug) {
  return ARTICLE_SEO_OVERRIDES[String(slug || '')] || null
}
