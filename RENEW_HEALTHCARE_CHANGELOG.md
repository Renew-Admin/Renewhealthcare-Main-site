# Renew Healthcare — Website Change Log

- Website: https://renewhealthcare.in/
- Last updated: 2026-10-26
- Work status: Partially completed. A6 is live. A4, B1, B2 and B4 are done locally (not yet deployed); the rest are open. The current status of every task is in **Update — 2026-10-26 (third pass: client-confirmed data)** at the end of this file.

The earlier sections below preserve what was true when they were written; the summary table directly below is from the first pass and is superseded by the third-pass table.

## Summary

| Task | Status | Reason |
|---|---|---|
| A6 Jamshedpur PIN in footer and other address copies | **Done and visible on the live site** | Verified on 2026-10-26; see the latest section below |
| A4 Salt Lake phone | Not done, excluded on purpose | Number not confirmed by the clinic |
| B1 Doctor registration numbers | Not done, blocked | No verified numbers supplied |
| B2 Branch directions | Not done, blocked | No verified landmarks, metro, road or parking details |
| B3 Branch photos (4–6 each) | Not done, blocked | Only 2 photos per branch in the repo; no approved photos supplied |
| B4 Google Maps per branch | Checked; Gariahat zoom blocked | Each branch already uses its own map; a closer Gariahat embed needs a new embed code |
| E1 Redirect to the new article | Not done, blocked | Destination article is not live (HTTP 404) |
| E2 Five November articles | Not done, blocked | No approved drafts, bylines, review dates, meta or FAQs supplied |
| E4 GA4 key events | Code checked; GA4 setting not changed | Marking key events is done in the GA4 web interface; no GA4 access used |
| E5 Completion report | This file | — |

## Changes completed in this coding session

### A6: Jamshedpur PIN code in the shared footer

- Task ID: A6
- Change: The Jamshedpur address in the shared footer now ends with the PIN: `1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001`. Nothing else in the address changed.
- Files:
  - `src/components/SiteFooter/SiteFooter.js`: added `831001` to the Jamshedpur `address` string.
  - `tests/brief-2026-10-24.test.mjs`: new test that fails if the footer's Jamshedpur address loses the PIN.
- Reason: The footer keeps its own copy of the three branch addresses, separate from `src/data/locations.js`, and it was the only one missing the PIN. The Jamshedpur page, its schema and `src/data/locations.js` already had `831001`, so I didn't touch them. I didn't switch the footer over to `src/data/locations.js` to remove the duplicate list: that would also change the footer's Salt Lake phone number, which is task A4 and excluded (see "Other findings").
- Validation:
  - `npm test`: 66 tests, 66 passed, 0 failed (includes the new footer test).
  - `npm run build:offline` (Next.js production build without network): finished successfully (exit 0).
  - Checked the generated HTML: `.next/server/app/why-renew.html` contains `Bistupur, Jamshedpur 831001` once (the footer), and `.next/server/app/locations/jamshedpur.html` contains it 3 times (footer, page and schema).
  - `npm run lint`: 791 errors both before and after this change, so the change added none. The 3 errors in `SiteFooter.js` (`react/prop-types`, unused `onCallback`) were already there and I left them alone.
  - Not done: I didn't check the footer visually on phone, tablet and desktop in a browser. The address is plain text in an `<li>`, so it wraps the same way the other two addresses do.
- Deployment/live verification: **Local only.** Not committed, not pushed, not deployed, and not checked on the live site. The live footer won't show the PIN until this is merged to `main` and deployed.

## Previously completed operational tasks (reported)

- Cloudflare cache purge: reported complete for Renew Healthcare and Dr. Rajeev Agarwal sites.
- Nightfall URL: previously checked as HTTP 410.
- IVF cost URL: previously checked to redirect to the final article URL, which returned HTTP 200.
- Jamshedpur location page: previously checked as HTTP 200; PIN and opening hours were present on the page/schema.
- DEPLOY_HOOK_URL and admin-save deployment hook: user reported configuration is working.

These are historical reports. I didn't re-check them this session, except one: `https://renewhealthcare.in/locations/jamshedpur` returned HTTP 200 on 2026-10-26 (`curl`).

## Blocked / waiting for input

### A4 Salt Lake phone number: excluded on purpose
Not touched anywhere. Waiting for the clinic to confirm the correct Salt Lake number (see the inconsistency under "Other findings").

### B1 Doctor registration numbers: waiting for verified numbers
- What's already in place: `src/lib/doctorRegistrations.js` holds the numbers. They show on the doctor page and go into the Physician schema `identifier` through `src/lib/nextSeo.js` `physicianSchema()`. So far only Dr. Rajeev Agarwal (WBMC52540) is listed.
- Needed for each doctor: the medical council name and registration number exactly as printed on the council certificate:
  - Dr. Dorothy P. Ghosh (`dr-dorothy-p-ghosh`, Jamshedpur, so possibly the Jharkhand council; the clinic must confirm)
  - Dr. Neha Yadav
  - Dr. Sonam Agarwal
  - Dr. Arnab Kundu
- Once the numbers arrive: add one line per doctor to `DOCTOR_REGISTRATIONS`. No other code changes are needed.

### B2 Branch directions: waiting for verified details
- The repo has no landmark, metro, main-road or parking information for any branch, and the location pages have no directions text today (only a "Get directions" Google Maps link).
- Needed for each branch (Salt Lake, Gariahat/Ballygunge, Jamshedpur), from the clinic:
  1. The nearest well-known landmark.
  2. The nearest metro station and/or main road (Kolkata branches) and the main road (Jamshedpur).
  3. Parking: available or not, and where.
- I published nothing in the meantime, not even placeholder text.

### B3 Branch photos (4–6 each): waiting for approved photos
- Photos in the repo now (`gallery` in `src/data/locations.js`):
  - Salt Lake: 2 (`2025/03/renew-ivf-saltlake.jpg`, `2025/03/ivf-saltlake.jpg`)
  - Jamshedpur: 2 (`2025/03/renew-ivf-jamshedpur.jpg`, `2025/03/renew-healthcare-jamshedpur.jpg`)
  - Gariahat: 2 (`2026/07/renew-healthcare-mandeville-gardens.webp` and `2024/12/Inner-Page-Banner-2.jpg`). The second file looks like a general page banner; please confirm it really shows the Gariahat branch.
- Needed: 2–4 more clinic-approved photos per branch, for example the entrance or signboard, reception, waiting area and consultation room. No patients, patient records or screens showing patient data. Please say for each photo what it shows, so the alt text can be accurate.

### B4 Google Maps: Gariahat closer zoom waiting for a new embed code
- Checked: all three location pages already use their own branch's map. The Google place ID in each embed matches that branch's own Google Maps link (`cid`):
  - Salt Lake `0x3629f2d77c8e0af1` = cid 3902917559414819569 ✔
  - Jamshedpur `0x67728bfba5628131` = cid 7454174246179340593 ✔
  - Gariahat `0x62e182948ab063d` = cid 445319978748151357 ✔
- Problem: the Gariahat embed is zoomed far out. It shows about 58 km of map (`1d57830…`), is centred at 22.4897, 88.3029 (south-west of Ballygunge, not on the building) and is in satellite mode (`5e1`). Just zooming in on those coordinates would centre the map on the wrong spot, and making up new coordinates isn't allowed. So I left the map unchanged.
- Needed: someone with access to the Gariahat Google Business Profile opens the branch in Google Maps, zooms in on the Mandeville Gardens building, chooses Share → Embed a map, and sends the `<iframe src="…">` URL. Swapping it into `mapEmbed` for `gariahat` in `src/data/locations.js` is then a one-line change.

### E1 Redirect `/infertility-diagnosis-for-couples/` → `/unexplained-infertility-all-reports-normal-not-pregnant/`: waiting for publication
- Live check on 2026-10-26 with `curl -L`: the destination returns **HTTP 404**, so the article isn't published. The source URL also returns 404 today.
- Neither path appears anywhere in the repo, so there's no existing redirect to conflict with.
- Not added, because adding it now would send visitors to a page that doesn't exist. Once the article is live and returns 200, add the pair the same way as the existing redirects (`src/lib/seoRoutes.js` / `src/lib/seoDuplicates.js`, read by `redirects()` in `next.config.mjs`), then check there's no redirect loop.
- Please confirm the final URL: should the destination be `/unexplained-infertility-all-reports-normal-not-pregnant/` at the site root (as in the brief) or under `/blogs/…` like the other articles?

### E2 Five November articles: waiting for approved content
- No drafts are in the repo. Older articles on the same topics already exist and are live:
  - HSG (2 Nov): `/blogs/hsg-test-procedure-benefits`
  - Egg quality (9 Nov): `/blogs/role-of-egg-quality-in-conception-and-how-to-improve-it`
  - Semen analysis (12 Nov): `/blogs/semen-analysis-and-infertility-treatment`
  - Endometrial thickness (23 Nov): `/blogs/what-is-endometrial-thickness`
  - Bulky uterus (26 Nov): `/blogs/bulky-uterus-symptoms-causes-treatment`
- Needed for each article: the approved text, the byline (author and medical reviewer), the "Last reviewed" date, the meta title and description, the URL slug, the FAQ questions and answers, and an instruction on whether the new article replaces the old URL (update in place or redirect).
- I published nothing and changed none of the old articles.

### E4 GA4 key events: GA4 setting still to be done
- In the code, all three events are built and fire on the live domain only:
  - `generate_lead`: `src/hooks/useLeadSubmit.js`, after a lead is saved.
  - `phone_click`: `src/components/ContactTracking.js`, on clicks of `tel:` links.
  - `whatsapp_click`: `src/components/ContactTracking.js`, on clicks of WhatsApp links.
  - All three are allow-listed in `src/lib/analytics.js` and documented in `docs/ANALYTICS.md`.
- I didn't add any code or extra tracking.
- I didn't open or change GA4. Whether they're already marked as key events is **not verified**.
- Next step (in the GA4 web interface): GA4 property 324128078 → Admin → Data display → Events. For each of the three events, once it appears in the list, turn on "Mark as key event". New events can take up to 24–48 hours to appear after they first fire.

## Other findings (not changed; need a decision)

- **Salt Lake phone mismatch (A4):** the footer shows `+91 6292312076`, while the Salt Lake page (`src/data/locations.js`) shows `+91 62922 69060`, which is the same number as Gariahat. The contact list in `src/views/FinalContentPage.jsx` also uses `+91 6292312076`. I left all of them unchanged until the clinic confirms the number.
- **Other Jamshedpur address copies without the PIN:** the clinic list in `src/views/FinalContentPage.jsx` and two "Locate Your Nearest IVF Center" sections in `src/data/finalPages.js` still show the address without `831001`. These are on content pages, not in the footer, so they're outside A6. Adding the PIN there is a small follow-up if the clinic wants it.
- **Map links on content pages:** `src/views/FinalContentPage.jsx` links to Google Maps searches (`maps?q=…`) rather than each branch's own map link (`mapsUrl` / `cid`). Not changed, because B4 covers only the location pages.

## Validation performed

| Check | Result |
|---|---|
| `npm test` | 66 tests, 66 passed, 0 failed |
| `npm run lint` | 791 errors before and after the change (all pre-existing); the change added none |
| `npx eslint src/components/SiteFooter/SiteFooter.js tests/brief-2026-10-24.test.mjs` | 3 errors, the same before and after (pre-existing prop-types / unused-variable errors) |
| `npm run build:offline` | Built successfully (exit 0). The build rewrites `src/lib/buildStamp.js` with today's date; I restored it so it isn't in the diff |
| Search of the built HTML for `Bistupur, Jamshedpur 831001` | Found in the footer of `/why-renew` and 3 times on `/locations/jamshedpur` |
| `curl -L https://renewhealthcare.in/unexplained-infertility-all-reports-normal-not-pregnant` | HTTP 404 |
| `curl -L https://renewhealthcare.in/infertility-diagnosis-for-couples` | HTTP 404 |
| `curl https://renewhealthcare.in/locations/jamshedpur` | HTTP 200 |
| Map place ID vs `cid` check (python hex→decimal) | All 3 branches match |

Not run: the OpenNext/Cloudflare build (`npm run build`), browser checks on phone/tablet/desktop, screenshots, the directory sheet (not available), and any GA4 or Cloudflare checks.

## Deployment status

**Local only.** The A6 change is in the working tree: not committed, not pushed, not deployed, and not checked on https://renewhealthcare.in/. Merging to `main` triggers the production deploy, so please review before merging.

## Next actions

1. **Developer:** review and commit the A6 change, merge to `main`, then check the footer on the live site at phone and desktop widths.
2. **Clinic (Dr. Agarwal's team):** send the council registration numbers for Dr. Dorothy P. Ghosh, Dr. Neha Yadav, Dr. Sonam Agarwal and Dr. Arnab Kundu (B1).
3. **Clinic:** send the landmark, metro/main road and parking details for each branch (B2).
4. **Clinic:** send 2–4 more approved photos per branch, and confirm what `Inner-Page-Banner-2.jpg` shows (B3).
5. **Clinic / profile owner:** send the Google Maps embed URL for Gariahat, zoomed in on the building (B4).
6. **Content team:** publish the unexplained-infertility article and confirm its final URL; then the developer adds the E1 redirect.
7. **Content team:** send the approved drafts and metadata for the 5 November articles, and say whether each replaces the old URL (E2).
8. **GA4 admin:** mark `generate_lead`, `phone_click` and `whatsapp_click` as key events in GA4 property 324128078 (E4).
9. **Clinic:** confirm the Salt Lake phone number (A4), then the developer updates the footer, the Salt Lake page and `FinalContentPage.jsx` together.

---

## Update — 2026-10-26 (second pass: remaining Jamshedpur address copies)

Everything above is the first pass from earlier today and is kept unchanged. This section adds the follow-up work.

- Work status after this pass: Partially completed. The Jamshedpur PIN is now on every copy of the address; all other tasks are still blocked as described above.

### First-pass change re-checked (A6)

- `src/components/SiteFooter/SiteFooter.js` line 68 still reads `1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001`, with the PIN once (not duplicated). The Salt Lake and Gariahat entries and all phone numbers are unchanged.

### Changes completed in this pass

- Task ID: A6 follow-up (Jamshedpur PIN on the other address copies)
- Change: added `831001` to the three remaining copies of the Jamshedpur address that didn't have it. Only the Jamshedpur address text changed.
- Search used: `grep -rIn -i "michael john\|6 K Road\|K Road, Bistupur"` across the whole repo, excluding `node_modules`, build output and `.git`. These were the only copies without the PIN, and all three clearly refer to the Jamshedpur branch:
  1. The "Jamshedpur" entry in the clinic list in `src/views/FinalContentPage.jsx`. That list is shown on the content pages (for example `/contact`).
  2. The "Locate Your Nearest IVF Center" section of the `injection-instruction` page in `src/data/finalPages.js`.
  3. The "Locate Your Nearest IVF Center" section of the `mental-health` page in `src/data/finalPages.js`.
- Already had the PIN, so I didn't touch them: `src/data/locations.js` (`gbpAddress`, `address`, `postalAddress.postalCode`).
- Files:

| File | Change | Reason |
|---|---|---|
| `src/views/FinalContentPage.jsx` | Jamshedpur `address` now ends in `Jamshedpur 831001` (1 line) | The address lacked the PIN |
| `src/data/finalPages.js` | Both "Locate Your Nearest IVF Center" bodies now end in `Jamshedpur 831001` (2 lines) | Same |
| `tests/brief-2026-10-24.test.mjs` | 2 new tests (see below) | Regression protection |

- New tests (same Node built-in test runner and file as the existing brief tests; no new framework):
  - `every copy of the Jamshedpur address carries PIN 831001 (26 Oct 2026)`: fails if `Bistupur, Jamshedpur` appears without `831001` in the footer, `FinalContentPage.jsx` or `finalPages.js`, and checks both "Locate Your Nearest IVF Center" sections exactly.
  - `Salt Lake and Gariahat addresses and phones are unchanged by the Jamshedpur PIN fix`: pins the current Salt Lake and Gariahat address and phone pairs in the footer, `FinalContentPage.jsx` and `src/data/locations.js`. These are the **current** values, not confirmed ones. When the clinic confirms the Salt Lake number (A4), this test must be updated along with the code.
- Deployment/live verification: **local only** (see the status below).

### Validation performed in this pass

| Command / check | Result |
|---|---|
| `node --test tests/brief-2026-10-24.test.mjs` | 14 tests, 14 passed, 0 failed |
| `npm test` | 68 tests, 68 passed, 0 failed (66 before, plus the 2 new tests) |
| Proof the new test works: removed the PIN from `FinalContentPage.jsx`, re-ran the tests, then put the file back | Test 7 failed as expected (`not ok 7`); the file was restored and the PIN is present again |
| `npm run lint` | 791 errors, the same as the first-pass baseline; no new errors |
| Per-file lint, committed version vs now (`eslint --stdin` on `git show HEAD:<file>` vs the working file) | `SiteFooter.js` 3 → 3, `FinalContentPage.jsx` 25 → 25, `finalPages.js` 0 → 0, the test file 0 → 0. All pre-existing (mostly `react/prop-types`); none fixed or added |
| `npm run build:offline` | `✓ Compiled successfully`, exit 0. The build rewrites `src/lib/buildStamp.js` with today's date; I restored it so it isn't in the diff |
| Built HTML, `Bistupur, Jamshedpur 831001` count / copies without the PIN | `/injection-instruction` 4 / 0, `/mental-health` 4 / 0, `/contact` 2 / 0, `/why-renew` 1 / 0 |
| Local dev server (`npm run dev`, http://localhost:3000) | `/injection-instruction` and `/mental-health` each show the PIN 4 times |
| `git status` / `git diff --stat` | Changed: `SiteFooter.js`, `finalPages.js`, `FinalContentPage.jsx`, the test file, plus this changelog (new file). 48 lines added, 4 removed. No secrets, build output or formatting-only changes |

Not run: the OpenNext/Cloudflare build (`npm run build`), browser checks at phone, tablet and desktop widths, and screenshots.

### Remaining issues after this pass

- The "Other Jamshedpur address copies without the PIN" item under "Other findings" above is now **resolved**.
- Still open and unchanged in this pass:
  - A4: Salt Lake phone mismatch. The footer and `FinalContentPage.jsx` show `+91 6292312076`; `src/data/locations.js` shows `+91 62922 69060`. Waiting for the clinic.
  - Content-page map links in `FinalContentPage.jsx` are Google Maps searches, not each branch's own map link. Not changed; needs a decision.
  - B1, B2, B3, B4 (Gariahat zoom), E1, E2 and E4 are blocked exactly as described in "Blocked / waiting for input" above. No registration numbers, directions, photos, map embeds, redirects, articles or GA4/Cloudflare changes were made.

### Deployment status (this pass)

**Local only: not committed, not pushed, not deployed, and not checked on https://renewhealthcare.in/.** The local dev server at http://localhost:3000 shows the changes.

---

## Live verification — 2026-10-26

The earlier "local only" and "not deployed" statements above are historical. Commit `69e1382` was pushed to `origin/main`, and the live HTML now contains the Jamshedpur PIN changes from that commit. The site was checked directly at `https://renewhealthcare.in/` with `curl -L`, and the visible server-rendered text was inspected. This confirms the content is live; it does not establish which deployment job served it.

| Item | Current status | Live evidence / remaining work |
|---|---|---|
| A6 Jamshedpur PIN | **Done; live content verified** | The full address ends in `Bistupur, Jamshedpur 831001` in the shared footer on `/`, `/why-renew`, `/contact` and `/locations/jamshedpur`. `/contact` also shows it in the clinic list. `/injection-instruction` and `/mental-health` show it in their "Locate Your Nearest IVF Center" content. These pages returned HTTP 200. The short home-page location label and the Jamshedpur page title say only `Bistupur, Jamshedpur`; they are labels, not full addresses. |
| A4 Salt Lake phone | **Open; clinic confirmation needed** | The live `/contact` and `/locations/saltlake` pages still contain both `+91 6292312076` and `+91 62922 69060`. No phone number was changed in this release. |
| E1 article redirect | **Open; destination still unavailable** | `/unexplained-infertility-all-reports-normal-not-pregnant/` and `/infertility-diagnosis-for-couples/` both returned HTTP 404 after following redirects. Publish and confirm the destination before adding the redirect. |
| B1, B2, B3, B4, E2, E4 | **Open, as detailed above** | The pushed commit did not add registration numbers, directions, photos, a new Gariahat map embed, articles or GA4 configuration. Their required inputs and access are listed in the earlier sections. These items were not fully re-audited on the live site in this check. |

Verification limit: this was an HTTP and server-rendered text check, not a visual browser check at phone/tablet/desktop widths. No GA4, Google Business Profile or Cloudflare dashboard state was inspected.

---

## Update — 2026-10-26 (third pass: client-confirmed data)

Inputs used: the client's confirmations of 26 Oct 2026 (Salt Lake number, four registration numbers and an empty field for Dr. Sonam Agarwal, the three PIN codes, the Gariahat embed URL, "use the latest IVF-cost version", "only approved stories are provided"). Everything in this section was checked during this pass unless marked historical.

### Status

| Task | Status | Evidence / what is still needed |
|---|---|---|
| A4 Salt Lake phone | **Done locally** | `+91 6292312076` on the Salt Lake page, its call button (`tel:06292312076`) and its MedicalClinic schema; footer and contact list already had it. |
| B1 Registration numbers | **Done locally** | WBMC 52540 / 56403 / 67050 / 85882 on the four doctor pages and in their Physician schema; nothing shown for Dr. Sonam Agarwal. |
| B2 PIN codes | **Verified, regression-tested** | 700019 / 700064 / 831001 correct in every address copy and schema. Fixed the contact page's "Renew Healthcare Clinics" list, which still had the WordPress addresses. |
| B3 Branch photos | **Waiting for photos (Thursday)** | See below. |
| B4 Gariahat map | **Done locally; place and zoom verified** | See below. Not yet checked visually in a browser. |
| E1 Infertility redirect | **Blocked: destination 404** | See below. |
| E2 Five November articles | **Blocked: no approved content** | Unchanged from the first pass; no drafts in the repo. |
| E4 GA4 key events | **Done (client-confirmed)** | Code checked only; no change needed. |
| E5 Evidence report | **This section** | — |
| RH-05 IVF-cost article | **Already consistent; no change** | See below. |
| RH-15 Success stories | **Blocked: no approval record** | See below. |

### Changes

| File | Change |
|---|---|
| `src/data/locations.js` | Salt Lake `phone` → `+91 6292312076` (was `+91 62922 69060`, the Gariahat line). Gariahat `mapEmbed` → client's embed at street-level zoom. |
| `src/lib/doctorRegistrations.js` | Added Dr. Dorothy P. Ghosh, Dr. Arnab Kundu, Dr. Neha Yadav; Dr. Rajeev Agarwal's number written as supplied (`WBMC 52540`, was `WBMC52540`). No entry for Dr. Sonam Agarwal. |
| `src/lib/articleAuthorship.js` | "Medically reviewed by" line reads the number from the registration list, so it now shows `WBMC 52540` and cannot drift. |
| `src/data/finalPageLookup.js` | `/contact` clinic list built from `locations.js` (removed `EN-26, Sector V` and `46B, Rafi Ahmed Kidwai Road`); timings from the owner-confirmed `OPENING_HOURS` (was "9:00 AM - 6:00 PM"). |
| `src/views/FinalContentPage.jsx` | Contact card timings use `OPENING_HOURS` (was "9:00 AM - 6:00 PM"). |
| `tests/brief-2026-10-24.test.mjs` | Salt Lake phone and registration format updated to the confirmed values. |
| `tests/brief-2026-10-26.test.mjs` | New: A4, B1, B2, contact list and B4 regression tests. |

The hours change on `/contact` goes beyond A4/B2. The page contradicted the owner-confirmed hours (24 Oct) shown on every branch page, so it was corrected along with the addresses.

### B4 Gariahat map

- The client's embed points to place `0x3a0277589dea95db:0x62e182948ab063d` (= the branch's `cid` 445319978748151357). Fetching that embed, Google resolves it to "Ground Floor, Renew Healthcare, 18 C, Mandeville Gardens, Ekdalia, Ballygunge, Kolkata, West Bengal 700019" at 22.5224052, 88.3669942.
- As supplied, its viewport is about 59 km (`1d58981…`), centred well south-west of Ballygunge. That is too broad, so the embed is used with only the viewport changed: `1d1841.8` (same scale as the Salt Lake map) centred on those coordinates. Fetching the adjusted URL returns HTTP 200 and resolves to the same place and address. Roadmap mode as in the client's URL (`5e0`; the old embed was satellite).
- Not done: a visual check of the rendered map in a browser.

### B3 Branch photos: needed by Thursday

| Branch | In use now (`gallery`) | Assessment |
|---|---|---|
| Salt Lake | `2025/03/renew-ivf-saltlake.jpg` (building exterior with "RENEW Healthcare" sign), `2025/03/ivf-saltlake.jpg` (consultation) | Real clinic photos, but only 436×290 px |
| Jamshedpur | `2025/03/renew-ivf-jamshedpur.jpg` (entrance with "RENEW Fertility" sign), `2025/03/renew-healthcare-jamshedpur.jpg` (consultation) | Real; the second is only 202×270 px |
| Gariahat | `2026/07/renew-healthcare-mandeville-gardens.webp` (interior corridor), `2024/12/Inner-Page-Banner-2.jpg` (consultation) | The banner is a generic site banner also used on service pages; its branch is not identifiable. No exterior/signboard photo. |

Needed: for each branch, an exterior/signboard photo, reception or waiting area, and a consultation room, at least 1200 px wide, with no identifiable patients or patient data on screen, and a one-line description of each (used for alt text). Highest priority: a Gariahat exterior to replace `Inner-Page-Banner-2.jpg` in its gallery, and higher-resolution Salt Lake and Jamshedpur photos. No images were changed.

### E1 Infertility redirect

- Live checks this pass (`curl -L`): `/unexplained-infertility-all-reports-normal-not-pregnant`, its trailing-slash form and `/blogs/unexplained-infertility-all-reports-normal-not-pregnant` all return **404**. The source `/infertility-diagnosis-for-couples` (with and without slash, and under `/blogs/`) also returns 404.
- A live article on the same topic exists: `/blogs/unexplained-infertility-next-steps`, "Unexplained Infertility: When Every Test Is Normal, What Happens Next?" (HTTP 200, self-canonical, indexable, published 2026-10-14), plus a Bengali version `/blogs/unexplained-infertility-sob-test-normal-tahole-ki`.
- Not added: the recorded destination slug does not exist, and redirecting to a different slug is a content decision. Needed: confirmation that `/blogs/unexplained-infertility-next-steps` is the intended destination (then the redirect is one line in `src/lib/seoDuplicates.js`), or the URL where the intended article will be published.

### E4 GA4 key events

Client-confirmed as done. Code check only: `generate_lead` (`src/hooks/useLeadSubmit.js`), `phone_click` and `whatsapp_click` (`src/components/ContactTracking.js`), one measurement ID `G-VL7SJC7ENL` (`src/lib/analytics.js`). The live home page loads gtag once for that ID (the second match is the escaped copy in the Next.js payload). No GA4 access was used, so key-event configuration in GA4 itself was not checked here.

### RH-05 IVF-cost article

- Versions: `/blogs/cost-of-ivf-treatment-in-kolkata` (longer, ~630 words, dated 6 May 2023; content last changed 5 Aug 2026, link rewrite only) and `/blogs/ivf-cost-in-kolkata` (shorter, ~580 words, dated 29 Jan 2023; last updated 2026-07-21 per its schema, edited again 10 Oct 2026, commit `76e682e`).
- The latest version is `ivf-cost-in-kolkata`, which is also the destination in the client's brief (row 11.1). It is already the primary everywhere: live HTTP 200 and self-canonical; `/blogs/cost-of-ivf-treatment-in-kolkata` (with and without slash) 301s to it in one hop; only it is in the sitemap. No change made.
- Limit: no explicit approval record exists in the repo; "latest" is taken from the commit history and `dateModified`. If the CMS holds a newer unpublished draft, that was not visible from here.

### RH-15 Success stories

- `/success-stories` is a single page (no per-story URLs). It is deliberately suspended for NMC compliance review: `SHOW_PATIENT_TESTIMONIALS = false` in `src/views/SuccessStoriesPage.jsx`, `noindex, follow` in `src/lib/seoRoutes.js`, and left out of the sitemap. Confirmed live: HTTP 200, `noindex, follow`, not in `sitemap.xml`.
- The CMS `testimonials` table has only an `active` flag; there is no approval or indexing field. Nothing in the repo records which stories are approved.
- Not changed. Needed: the list of approved stories (names or CMS rows) and written confirmation that the compliance suspension can be lifted for them. Then: flip `SHOW_PATIENT_TESTIMONIALS`, remove the `noindex`, and the page joins the sitemap in the same deploy.

### Verification (this pass)

| Check | Result |
|---|---|
| `npm test` | 73 tests, 73 passed, 0 failed (68 before + 5 new) |
| New A4 test with the old Salt Lake number put back | Failed as expected; file restored, passes again |
| `npm run lint` | 791 errors, same as the pre-existing baseline; changed files add none |
| `npm run build:offline` | Exit 0. `src/lib/buildStamp.js` restored afterwards |
| Built `/locations/saltlake` | `tel:06292312076` ×7, schema `telephone` `+91 6292312076`; `62922 69060` appears once, in the footer's Gariahat entry |
| Built `/contact` | No `EN-26`, no `6:00 PM`; `Kolkata 700064` ×4, `6:30 PM` ×4 |
| Built doctor pages | "Reg. No." and schema `identifier` WBMC 52540 / 56403 / 67050 / 85882; Dr. Sonam Agarwal page has no registration text or identifier |
| Gariahat embed (client URL and adjusted URL) | Both HTTP 200, same place and address; adjusted viewport 1841.8 m |
| Live (`curl`, today) | `/`, `/contact`, `/locations/saltlake`, `/locations/gariahat`, `/locations/jamshedpur`, `/doctor/dr-rajeev-agarwal`, `/doctor/dr-sonam-agarwal`, `/blogs/ivf-cost-in-kolkata`, `/success-stories`, `/sitemap.xml`, `/robots.txt`: 200. `/blogs/cost-of-ivf-treatment-in-kolkata` (and `/`): 301 → 200, 1 hop. `/blogs/what-is-usg-full-form`: 410 |

Not run: the OpenNext build (`npm run build`; `workerd` missing locally, as before), browser or visual checks, screenshots, GA4, Google Business Profile or Cloudflare dashboards. No directory sheet was available, and no crawl totals were produced.

### Deployment status (this pass)

**Local only: not committed, not pushed, not deployed.** The live site still shows the old Salt Lake number on `/locations/saltlake`, the WordPress addresses on `/contact` and no registration numbers for the three new doctors until this is merged to `main`.
