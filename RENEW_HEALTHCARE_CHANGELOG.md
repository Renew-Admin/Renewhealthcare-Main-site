# Renew Healthcare — Website Change Log

- Website: https://renewhealthcare.in/
- Last updated: 2026-10-26
- Work status: Partially completed. A6 is live; the other tasks remain open as described below.

The first-pass and second-pass sections below preserve what was true when the work was local. The latest deployment and live-site status is in **Live verification — 2026-10-26** at the end of this file.

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
