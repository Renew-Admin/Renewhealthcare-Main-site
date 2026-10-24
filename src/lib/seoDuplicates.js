// seoDuplicates — the retirement list for duplicate URLs (ticket RH-02, and
// the website brief of 18 Oct 2026, task 11).
//
// Seven topics were published at two URLs each. Left alone they compete
// with each other for the same queries, so one URL in each pair is retired with
// a permanent redirect and dropped from the sitemap and the blog listing.
//
// -------------------------------------------------------------------------
// THE SURVIVING URL IN EACH PAIR IS AN SEO DECISION, NOT AN ENGINEERING ONE.
// The defaults below are placeholders pending sign-off. To flip a pair, swap
// the two sides of its entry — nothing else needs to change.
// -------------------------------------------------------------------------
import { normalizePath } from './seoUtils.js'

const PAIRS = [
  {
    // The PCOS -> PMOS renaming story. Default keeps the longer, more current
    // article: it names PMOS in the title and answers "has PCOS really been
    // renamed?" directly, which is the query this pair is competing for.
    retire: '/blogs/why-pcos-is-being-renamed',
    keep: '/blogs/pcos-renamed-pmos',
  },
  {
    // IVF success rates. Default keeps the established root-level landing page
    // (its own React page, the older URL of the two) and retires the blog copy.
    retire: '/blogs/ivf-success-factors-and-rates',
    keep: '/ivf-success-factors-and-rates',
  },
  // RH-05 (Technical Health Status Report, 13 Oct 2026): five pairs share a
  // title and body. Owner decision (18 Oct 2026): keep the NEWEST URL of each
  // pair and retire the older one. Swap a pair's sides to flip it.
  {
    // Kept: 29 Sep 2026. Retired: 5 Sep 2026.
    retire: '/blogs/antagonist-vs-long-protocol-calendar',
    keep: '/blogs/antagonist-vs-long-agonist-protocol-your-ivf-calendar-day-by-day',
  },
  {
    // Kept: 29 Sep 2026. Retired: 6 Sep 2026.
    retire: '/blogs/unused-embryos-india-10-year-rule',
    keep: '/blogs/what-happens-to-unused-embryos-in-india-the-10-year-rule-and-your-real-choices',
  },
  {
    // Kept: 28 Sep 2026. Retired: 28 Jul 2026.
    retire: '/blogs/endometriosis-and-fertility',
    keep: '/blogs/endometriosis-and-fertility-from-diagnosis-to-ivf',
  },
  {
    // Kept: 30 Sep 2026. Retired: 28 Jul 2026. Since 24 Oct 2026 the survivor
    // is itself retired by the website brief (task 11.27), so this goes
    // straight to that page's destination — one hop, no chain.
    retire: '/blogs/can-you-get-pregnant-with-amh-below-1',
    keep: '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says',
  },
  {
    // Kept: 13 Nov 2025. Retired: 25 Jul 2025.
    retire: '/blogs/the-power-of-genetics-in-ivf',
    keep: '/blogs/genetic-testing-in-ivf',
  },
  {
    // Lokesh's brief of 23 Oct 2026, task 2: the Bengali Placentrex page
    // contradicts the new English article. Redirect until a Bengali version of
    // the new article is written; then remove this entry.
    retire: '/blogs/placentrex-infertility-treatment-bengali',
    keep: '/blogs/placentrex-injection-uses-benefits-risks-dosage',
  },
  // Website brief for renewhealthcare.in (18 Oct 2026), Part 3, task 11:
  // each article below repeats a stronger article on the same question and
  // is redirected to it (301), unpublished and removed from the sitemap.
  // Applied 24 Oct 2026. 11.33 (the-power-of-genetics-in-ivf) is the RH-05
  // entry above. Numbers are the brief's row numbers.
  { retire: '/blogs/cost-of-ivf-treatment-in-kolkata', keep: '/blogs/ivf-cost-in-kolkata' }, // 11.1
  { retire: '/blogs/affordable-ivf-treatment-in-kolkata-breaking-down-the-expenses-and-finding-the-right-path', keep: '/blogs/ivf-cost-in-kolkata' }, // 11.2
  { retire: '/blogs/affordable-ivf-in-kolkata-how-to-plan-emotionally-financially', keep: '/blogs/ivf-cost-in-kolkata' }, // 11.3
  { retire: '/blogs/complete-guide-to-ivf-treatment', keep: '/blogs/the-five-stages-of-ivf-treatment' }, // 11.4
  { retire: '/blogs/ivf-journey-guide-step-by-step-success-tips', keep: '/blogs/the-five-stages-of-ivf-treatment' }, // 11.5
  { retire: '/blogs/navigating-the-ivf-process-in-kolkata', keep: '/blogs/the-five-stages-of-ivf-treatment' }, // 11.6
  { retire: '/blogs/unveiling-the-truth-is-the-ivf-procedure-painful', keep: '/blogs/is-ivf-painful' }, // 11.7
  { retire: '/blogs/can-you-conceive-naturally-after-a-failed-ivf-cycle', keep: '/blogs/after-failed-ivf-can-you-still-get-pregnant-naturally' }, // 11.8
  { retire: '/blogs/what-happens-during-the-embryo-transfer-cycle', keep: '/blogs/embryo-transfer-how-does-it-happen' }, // 11.9
  { retire: '/blogs/ivf-success-tips-before-embryo-transfer', keep: '/blogs/essential-dos-and-donts-after-embryo-transfer' }, // 11.10
  { retire: '/blogs/the-post-ivf-precautions-for-a-safe-pregnancy', keep: '/blogs/essential-dos-and-donts-after-embryo-transfer' }, // 11.11
  { retire: '/blogs/sperm-health-how-to-improve-motility-and-count-naturally', keep: '/blogs/foods-to-increase-sperm-count' }, // 11.12
  { retire: '/blogs/natural-way-to-improve-sperms', keep: '/blogs/foods-to-increase-sperm-count' }, // 11.13
  { retire: '/blogs/role-of-vitamins-in-sperm-improvement', keep: '/blogs/foods-to-increase-sperm-count' }, // 11.14
  { retire: '/blogs/can-diet-improve-male-fertility-a-look-at-fertility-superfoods', keep: '/blogs/foods-to-increase-sperm-count' }, // 11.15
  { retire: '/blogs/how-does-obesity-impact-on-male-fertility-sperm-count', keep: '/blogs/do-smoking-and-alcohol-affect-sperm-quality' }, // 11.16
  { retire: '/blogs/obesity-and-male-infertility', keep: '/blogs/do-smoking-and-alcohol-affect-sperm-quality' }, // 11.17
  { retire: '/blogs/impact-of-stress-on-male-fertility-and-how-to-manage-it', keep: '/blogs/do-smoking-and-alcohol-affect-sperm-quality' }, // 11.18
  { retire: '/blogs/how-lifestyle-changes-are-affecting-male-and-female-fertility', keep: '/blogs/do-smoking-and-alcohol-affect-sperm-quality' }, // 11.19
  { retire: '/blogs/how-do-diet-and-lifestyle-affect-male-and-female-fertility', keep: '/blogs/do-smoking-and-alcohol-affect-sperm-quality' }, // 11.20
  { retire: '/blogs/male-infertility-common-causes-and-solutions', keep: '/male-infertility' }, // 11.21
  { retire: '/blogs/understanding-male-infertility-tests-and-diagnosis', keep: '/male-infertility' }, // 11.22
  { retire: '/blogs/learn-about-azoospermia', keep: '/blogs/understanding-azoospermia-causes-and-treatments' }, // 11.23
  { retire: '/blogs/sperm-extraction-procedure-in-azoospermia', keep: '/services/tesa-pesa' }, // 11.24
  { retire: '/blogs/tesa-pesa-at-renew-healthcare-advanced-solutions-for-male-infertility', keep: '/services/tesa-pesa' }, // 11.25
  { retire: '/blogs/what-is-a-good-amh-level-to-get-pregnant', keep: '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says' }, // 11.26
  { retire: '/blogs/can-you-get-pregnant-with-amh-below-1-real-answers', keep: '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says' }, // 11.27
  { retire: '/blogs/what-is-a-poor-ovarian-reserve', keep: '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says' }, // 11.28
  { retire: '/blogs/polycystic-ovarian-syndrome-pcos', keep: '/blogs/pcos-and-fertility-treatment' }, // 11.29
  { retire: '/blogs/managing-pcos-the-most-challenging-symptoms-women-face', keep: '/blogs/pcos-and-fertility-treatment' }, // 11.30
  { retire: '/blogs/pcod-overview-and-treatment', keep: '/blogs/pcos-and-fertility-treatment' }, // 11.31
  { retire: '/blogs/pcos-and-infertility-how-infertility-centres-help-women-beat-the-odds', keep: '/blogs/pcos-and-fertility-treatment' }, // 11.32
  { retire: '/blogs/the-role-of-genetics-in-male-and-female-fertility', keep: '/blogs/genetic-testing-in-ivf' }, // 11.34
  { retire: '/blogs/how-to-improve-success-rates-with-iui', keep: '/blogs/iui-how-to-best-prepare-for-it' }, // 11.35
  { retire: '/blogs/myths-vs-facts-debunking-common-misconceptions-about-freezing-your-eggs', keep: '/blogs/best-age-to-freeze-your-eggs-when-should-you-consider-it' }, // 11.36
  { retire: '/blogs/top-5-reasons-why-renew-healthcare-is-the-best-ivf-centre-in-kolkata', keep: '/blogs/how-to-choose-the-right-ivf-clinic' }, // 11.37
  { retire: '/blogs/best-fertility-clinics-in-kolkata-top-5-things-you-can-expect', keep: '/blogs/how-to-choose-the-right-ivf-clinic' }, // 11.38
  { retire: '/blogs/what-to-expect-during-your-first-visit-to-the-best-ivf-clinic-in-kolkata', keep: '/blogs/how-to-choose-the-right-ivf-clinic' }, // 11.39
  { retire: '/blogs/prepare-your-body-for-pregnancy', keep: '/blogs/pre-baby-health-plan-3-months-before-pregnancy' }, // 11.40
  { retire: '/blogs/common-myths-about-preconception-counselling', keep: '/blogs/pre-baby-health-plan-3-months-before-pregnancy' }, // 11.41
]

/** Retired path -> surviving path. Consumed by the Worker's redirect step. */
export const DUPLICATE_REDIRECTS = new Map(
  PAIRS.map(pair => [normalizePath(pair.retire), normalizePath(pair.keep)]),
)

/**
 * Blog slugs that must not appear as live routes, sitemap entries or listing
 * cards. Only covers retired URLs under /blogs/ — a retired root-level page
 * would be handled by DUPLICATE_REDIRECTS alone.
 */
export const RETIRED_BLOG_SLUGS = new Set(
  [...DUPLICATE_REDIRECTS.keys()]
    .filter(path => path.startsWith('/blogs/'))
    .map(path => path.slice('/blogs/'.length)),
)

export function getDuplicateRedirect(path) {
  return DUPLICATE_REDIRECTS.get(normalizePath(path)) || null
}
