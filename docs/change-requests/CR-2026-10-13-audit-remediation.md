# Change Request CR-2026-10-13 — Audit Remediation Merge Commits

Record of the production changes made to drrajeevagarwal.co.in and renewhealthcare.in on 13 October 2026 from the website audit of 12 October 2026. Companion documents: Website Audit (claude.ai/code/artifact/9c7186c0-f9df-443f-8457-a05f2a2b5d42), Remediation Tracker (claude.ai/code/artifact/c8aed8af-3ecf-4ea0-ad93-c500234dc510), Change Request record (claude.ai/code/artifact/008c9045-71f1-46db-bb6e-aca34ad04ed1).

## Change request summary

CR-2026-10-13 moved 35 verified fixes from the 12 October website audit into production on both sites through five pull requests merged between 11:36 and 12:10 IST on 13 October 2026; every merge was built and deployed automatically by Cloudflare Workers Builds and checked on the live site afterwards.

| Field | Value |
| --- | --- |
| Change request | CR-2026-10-13 — audit remediation, rounds 1 and 2 |
| Systems | drrajeevagarwal.co.in (repo Renew-Admin/drrajeevagarwal, Cloudflare Worker) and renewhealthcare.in (repo Renew-Admin/Renewhealthcare-Main-site, Next.js on Cloudflare via OpenNext) |
| Requested and approved by | Site owner, 13 Oct 2026 ("do everything and deploy all", then "merge the remaining branches now without it" for the browser sandbox); record approved 13 Oct 2026, 12:44 IST |
| Implemented by | TagEasy audit session (commits authored as TagEasy Audit, co-authored by Claude) |
| Reason | Audit findings: broken and redirected internal links, a placeholder doctors page with invented credentials, dead calls to action, duplicate H1s, 14 MB images, missing accessible names, stale repository content |
| Type | Standard change, code only; no database, DNS or infrastructure change |
| Deployment method | Merge to `main` → Cloudflare Workers Builds (`npm run build`, `npx wrangler deploy`) |
| Outcome | Successful. Post-deployment crawl: 0 internal broken links, 0 internal redirects, 0 empty anchors on both sites (from 1 / 167 / 8 on Rajeev and 22 / 0 / 0 plus 100 UTM-tagged links on Renew) |
| Incidents | None. Two production checks found content still served from the CMS with old links; fixed the same hour by Renew PRs #2 and #3 |
| Rollback used | None |
| Status | Approved. Items excluded from this change request are being handled by the owner separately and are not tracked here |

## Scope, exclusions and approvals

In scope: every audit item that could be fixed in code and had passed independent QA; the owner's decision to remove the placeholder doctors page (13 Oct, 10:12 IST) and to delete the stale cache folder (13 Oct, 11:21 and 11:31 IST).

Included — audit items RA-01, RA-03–08, RA-11–13 and RH-01–04, RH-06, RH-08–14, RH-16; round-2 items PERF-01, PERF-R1, PERF-R3, A11Y-R1–R5, SEO-R1, LINT-R1, LINT-R2, CI-R1, CI-R2; two same-day follow-ups to RH-02 and RH-10/11/12.

Excluded from this change request (handled separately by the owner) — RA-02 www DNS and Worker custom domain; RA-09 orphan page; RH-05 duplicate-article survivors and RH-07 press item (prepared on branch `audit-decisions-2026-10-12`, not merged); RH-15 success-stories indexing; PERF-R4 homepage Supabase column list; the Renew www→apex Cloudflare edge rule, which this deployment showed is required because the in-app redirect (RH-06) does not run for prerendered pages on OpenNext.

Approvals and gates. The owner waived the pre-merge browser sandbox. Gates applied before each merge: unit tests, production build, independent QA pass, and for Renew the full OpenNext build run locally in offline mode. Gates applied after each merge: Cloudflare build status, targeted curl checks of every changed behaviour on the live site, and a full crawl of both sites.

## Pull requests and merge commits

Five merges into `main`, each a merge commit that preserves the per-task commits. Times are IST (UTC+5:30); "built" is the Cloudflare Workers Builds completion from the GitHub check run.

| # | Repository | Pull request | Merge commit | Merged | Built | Commits | Files | Lines | Contents |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | drrajeevagarwal | #2 `chore/remove-wp-optimiser-cache` | `b1dc2934` | 11:36 | 11:37 | 1 | 18,696 | −1,388,074 | RA-13: stale WordPress optimiser cache removed |
| 2 | drrajeevagarwal | #3 `release/audit-2026-10-13` | `27c00ace` | 11:57 | 12:00 | 16 (15 fixes + 1 base merge) | 23 | +406 / −286 | Rounds 1 and 2: links, redirects, placeholder page, chatbot deferral, accessibility, lint, CI |
| 3 | Renewhealthcare-Main-site | #1 `release/audit-2026-10-13` | `308f9838` | 12:01 | 12:06 | 17 | 90 | +387 / −52 (plus 58 binary images) | Rounds 1 and 2: links, redirects, images, accessibility, lint, CI |
| 4 | Renewhealthcare-Main-site | #2 `fix/unlink-unresolvable-cms-links` | `1a9b165e` | 12:08 | 12:12 | 1 | 2 | +29 / −4 | RH-02 follow-up: dead link unlinked at render time |
| 5 | Renewhealthcare-Main-site | #3 `fix/external-citation-rewrites` | `f720546f` | 12:10 | 12:22 | 1 | 2 | +32 / −2 | RH-10/11/12 follow-up: moved citations rewritten at render time |

Base commits before the change: drrajeevagarwal `85462e62` (8 Sep 2026), Renewhealthcare-Main-site `76e682e` (10 Oct 2026). `main` after the change: `27c00ace` and `f720546f`.

## Commit log — drrajeevagarwal

16 commits reached `main` (in merge order; the base-merge commit `e345eb5c` inside PR #3 carries no change of its own). Each commit message ends with `Co-Authored-By: Claude Fable 5.1` and the session link.

| Commit | ID | Change | Files | Verification |
| --- | --- | --- | --- | --- |
| `e6c44a2d` | RA-13 | Remove `public/assets/al_opt_content` (WordPress optimiser cache) | 18,696 files deleted | Not referenced by src, scripts, server or built output; live paths already 404; build and tests pass |
| `38ef0360` | RA-03 | "here" link in the urinary-incontinence article → `/stress-urinary-incontinence-treatment-options-effective-solutions/` | src/data/blogs_data.js | Target 200; old path grep 0 |
| `43305727` | RA-04 | `href="/book-an-appointment"` on the Request Appointment CTA (4 policy pages; same CTA in 40 unrendered page entries) | src/data/pages_data.js (27 lines) | Diff re-derived programmatically: attribute-level only; prerendered privacy-policy.html contains the href |
| `199ef4e9` | RA-05 | Four empty WordPress button anchors → `<span>` | src/data/blogs_data.js | 0 href-less anchors left |
| `83b12eeb` | RA-06 | `trailingSlashRedirect()` in the Worker: non-article `/x/` → 301; 242 internal hrefs rewritten to the slash-less form | src/worker.js, blogs_data.js, pages_data.js, live_blog_updates.js, src/pages/Home.jsx | Unit tests; article slashes untouched (251/25/60 kept); prerendered output has 0 slash hrefs |
| `9604d3eb` | RA-11 | `wwwRedirect()`: www host → apex 301 with path and query | src/worker.js (+19) | Unit tests incl. `//evil.com/` and foreign hosts resolve to SITE_ORIGIN only |
| `a1bb567f` | RA-08, RA-12 | qrisk.org and ACC calculator links on final URLs | src/pages/menopause/TestsAndDiagnostics.jsx | Both 200, no redirect |
| `596e0ad2` | Tests | node:test suite for the Worker's pure helpers; `npm test` script | tests/worker.test.mjs, package.json | 8/8 |
| `54a60fc9` | RA-01 | Placeholder doctors page and 4 profiles removed; `/doctors*` → 410; sitemap regenerated (110 URLs) | 13 files: App.jsx, Doctors.jsx and DoctorProfile.jsx deleted, gen-seo-assets.mjs, inject-seo-tags.mjs, prerender.mjs, seoMeta.js/.cjs, main.jsx, CareTeam.jsx, worker.js, sitemap.xml | Build 110 routes, 0 doctors files; 410 tests; live: all 5 URLs 410 |
| `fa3e15fc` | LINT-R1 | ESLint ignores build output and copied WordPress assets | eslint.config.js | `npm run lint` 4 min / 157,840 problems → 7 s / 32 pre-existing |
| `303fcca2` | RA-07 | README "URL conventions" section | README.md (+9) | — |
| `925ae435` | A11Y-R1 | Carousel dot buttons: 24×24 hit area, dot drawn on `::after` | src/index.css | Lighthouse target-size pass (was 20 failing); active state verified in browser |
| `03e4992d` | A11Y-R2 | `role=tab`, `aria-selected`, `aria-controls` and a `tabpanel` on the services tabs | src/pages/Home.jsx | aria-required-children pass; accessibility score 100 |
| `c2d1f2c5` | SEO-R1 | "Read More" → "Read more about Dr Rajeev Agarwal" | src/pages/Home.jsx | link-text pass |
| `cea25f48` | PERF-R1 | Chatbot iframe mounted after load + idle or first interaction; box reserved; closed state clipped | src/App.jsx, src/index.css | CLS 0.189 → 0.019; iframe inserted 10–40 ms after load (Playwright); zero layout-shift entries over 8 s |
| `ce581d9a` | CI-R1 | GitHub Actions: `npm ci`, `npm test`, `npm run build` on pull requests and pushes to main | .github/workflows/checks.yml | Green on `main` after merge |

## Commit log — Renewhealthcare-Main-site

19 commits reached `main`: 17 through PR #1 and one each through the two follow-up PRs. Every link change is made in `src/lib/internalLinks.js`, the resolver that production applies to all article HTML, so it covers both the static copies and the Supabase-served posts.

| Commit | ID | Change | Files | Verification |
| --- | --- | --- | --- | --- |
| `157f5fd` | RH-01 | Header "Fertility Without Borders" → `https://drrajeevagarwal.co.in/` | GlobalHeader.js | Live homepage: 0 references to the www host |
| `8a5cda6` | RH-02 | Eight mistyped or retired paths added to `LEGACY_PATH_ALIASES`; one unresolvable anchor unlinked in the static copy | internalLinks.js, pregnancy-after-35…html, tests, package.json | All targets 200; `fix-internal-links.mjs --check` exit 0 |
| `8174ba4` | RH-03 | `/blogs/tag/*` anchors → `<span>` at render time | internalLinks.js, tests | Live what-is-era: 0 tag links |
| `f721568` | RH-04, RH-13 | `utm_*` stripped from internal hrefs; `utm_source=chatgpt.com` from every href | internalLinks.js, tests | Live CMS article: 0 chatgpt tags |
| `88a7b38` | RH-08 | Body `<h1>` → `<h2>` before render (`demoteBodyHeadings`) | articleHtml.js (new), serverData.js, tests | Live CMS article with 3 body h1s renders 1 h1 |
| `a22f821` | RH-14 | `/blogs/tag/:tag*` → `/blogs` 301 | next.config.mjs | Live: 301 |
| `d502830` | RH-06 | Host-conditioned redirect www → apex | next.config.mjs | Works under `next start`; inert on OpenNext for prerendered pages (live www still 200) — edge rule required |
| `50dbee3` | RH-09 | "Our Locations" in the footer Community list | SiteFooter.js | Live homepage links /locations |
| `f7352f0` | RH-10, 11, 12 | Three external citations on final URLs in the static copies | 3 static articles | Targets 200 |
| `b46496d` | RH-02/03/04 | Static articles rewritten with the repo's own `fix-internal-links.mjs` (32 links) | 13 static articles | href-only diffs; `--check` exit 0 |
| `b681d6a` | PERF-01 | `Dr-Sonam.jpg` 14,438 KiB → 261 KiB at the same 1470×1575 pixels | 1 image | PSNR 39.6 dB; live 267,322 bytes |
| `73df949` | PERF-R3 | 57 referenced JPEGs over 400 KiB re-encoded at the same size (77.9 MB → 9.35 MB) | 57 images | Dimensions identical, PSNR 37–48 dB on every file, every path referenced |
| `3cdee59` | A11Y-R3 | `aria-label="Purpose of enquiry"` on the purpose selects | CallbackModal.js, SiteFooter.js, BlogListPage.jsx, FinalContentPage.jsx | select-name pass; live homepage carries the label |
| `4344817` | A11Y-R4 | Hero journey-card title h3 → h2 | Hero.js | Live homepage: `h2.journey-title` |
| `0a8d2a8` | A11Y-R5 | Service-page renderer wraps "- " runs in one `<ul>` | ServicePage.jsx | 0 orphan `<li>` across 42 service pages |
| `32db5b5` | LINT-R2 | ESLint 9 flat config so `npm run lint` runs | eslint.config.mjs | 307 pre-existing problems, none new |
| `a251916` | CI-R2 | GitHub Actions: `npm ci`, `npm test`, link check, offline build | .github/workflows/checks.yml | Green on `main` after merge |
| `d526772` | RH-02 follow-up | Paths with no destination (`/how-can-you-access-ipgc`) unlinked at render time | internalLinks.js, tests | Live article: dead link gone; tests 25/25 |
| `82c7435` | RH-10/11/12 follow-up | `EXTERNAL_URL_REWRITES`: Mayo OHSS, Cleveland Clinic (https), CNN, Advanced Fertility | internalLinks.js, tests | Live articles carry the current URLs; tests 26/26 |

## Verification

Every merge was gated before and checked after; the full 127-row command log is the QA sheet of the remediation workbook.

Before merge (per repository)

| Gate | drrajeevagarwal | Renewhealthcare-Main-site |
| --- | --- | --- |
| Unit tests | `npm test` 8/8 | `npm test` 24/24 (26/26 after the follow-ups) |
| Production build | `npm run build`: 110/110 routes prerendered, 0 doctors files, 0 slash hrefs, policy CTA present, chatbot deferred | `RENEW_OFFLINE=1 npm run build:next` and the full OpenNext build `RENEW_OFFLINE=1 npm run build`: Worker saved, static cache populated, 0 errors |
| Independent QA | All implemented items re-verified by a separate agent on 12 and 13 Oct; diffs re-derived programmatically for the data files; no secrets, no open redirects, no regressions | Same, plus Python checks of all 58 re-encoded images (dimensions, size, PSNR, references) |
| Lint | eslint on every changed file: 0 new problems | eslint config restored; counts identical on base and branch |
| Browser sandbox | Waived by the owner | Waived by the owner |

After deployment

| Check | Result |
| --- | --- |
| Cloudflare Workers Builds | Success on all five merges (check runs on `b1dc2934`, `27c00ace`, `308f9838`, `1a9b165e`, `f720546f`) |
| Rajeev live behaviour | `/doctors` and 4 profiles 410; sitemap 110 URLs without them; `/all-services/?x=1` → 301 `/all-services?x=1`; `/what-is-testosterone/` 200; policy CTA linked; homepage ships the chatbot container without an iframe, tab roles and the new link text; build stamp `1791872980890` |
| Renew live behaviour | Header links the apex; `/services/` and `/blogs/tag/ivf` 301; existing duplicate redirect intact; footer links `/locations`; purpose select labelled; hero h2; CMS article renders one h1 and no chatgpt tag; `Dr-Sonam.jpg` 267 KB, `Dr-Neha-Yadav-1.jpg` 164 KB; after PRs #2 and #3 the dead ipgc link is gone and the four moved citations are current |
| Full crawl, drrajeevagarwal.co.in | 121 pages: 0 internal 4xx, 0 internal redirects, 0 empty anchors, 0 redirect chains; 4 external flags, all bot-blocks verified working in a browser |
| Full crawl, renewhealthcare.in | 330 pages: 0 internal 4xx, 0 internal redirects, 0 insecure links, 0 redirect chains; 20 external flags = 14 bot-blocks verified working, 5 unconfirmable from this network, 1 genuinely dead (OnlyMyHealth press item, decision RH-07) |
| Not verified | `www.renewhealthcare.in` still 200 (RH-06 inert on OpenNext); `www.drrajeevagarwal.co.in` unchanged (DNS not moved); Search Console removal not submitted |

## Rollback procedure

No rollback was needed. If one becomes necessary, each merge can be reversed on its own in either of two ways; the Worker rollback is fastest (under a minute, no build), the git revert is the durable one.

| Merge | Worker rollback | Git revert (then Workers Builds redeploys) | Notes |
| --- | --- | --- | --- |
| drrajeevagarwal #2 `b1dc2934` | Not needed — live output unchanged | `git revert -m 1 b1dc2934` restores the 18,696 files | Only the repository changed |
| drrajeevagarwal #3 `27c00ace` | `npx wrangler rollback` to the version live before 12:00 IST | `git revert -m 1 27c00ace` | Reverting re-publishes the placeholder doctors page; prefer reverting individual task commits (e.g. `git revert cea25f48` for the chatbot change) |
| Renewhealthcare-Main-site #1 `308f9838` | `npx wrangler rollback` to the version live before 12:06 IST | `git revert -m 1 308f9838` | The 58 re-encoded images are restored by the revert as well |
| Renewhealthcare-Main-site #2 `1a9b165e` | as above | `git revert -m 1 1a9b165e` | Dead ipgc link would return |
| Renewhealthcare-Main-site #3 `f720546f` | as above | `git revert -m 1 f720546f` | Old citation URLs would return |

Rollback owner: the developer with Cloudflare and GitHub access. Verification after a rollback: re-run the live crawl and the targeted curl checks listed under Verification.

Two observations for the next change: production serves any article that also exists in Supabase from there, so content fixes belong in the render-time resolver (`src/lib/internalLinks.js`) rather than the static files; and `/blog/<slug>` on drrajeevagarwal.co.in 301s to the slash-less URL rather than the slash form the Worker code intends (pre-existing, one hop to a 200 page, harmless).
