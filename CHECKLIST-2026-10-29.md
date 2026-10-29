# Renew Healthcare checklist

**6/6 done in the code** · 29 Oct 2026 · local only (not committed or deployed; merging to `main` deploys)

Checks: 81/81 tests pass · offline build OK · all changed pages load at http://localhost:3000

---

### [x] 1. Add medical council registration numbers to all doctor pages

Done for every doctor whose number we have:

| Doctor | Registration |
|---|---|
| Dr. Rajeev Agarwal | WBMC 52540 |
| Dr. Dorothy P. Ghosh | WBMC 56403 |
| Dr. Arnab Kundu | WBMC 67050 |
| Dr. Neha Yadav | WBMC 85882 |
| Dr. Sonam Agarwal | Left blank at the clinic's request (26 Oct) |

- **Where:** `src/lib/doctorRegistrations.js`. Each number appears on the doctor's page and in the page's search-engine data.
- **Waiting on the clinic office:** Dr. Roohi Khanna, Dr. Santanu Ray, Dr. Aditya Verma, Dr. Omkar De Hazra, Dr. Sayan Ghosh, Dr. Nitin Gupta, Dr. Amitrasudan Roychowdhury, Dr. Prem Kamani, Dr. Jayshree Nandy, and Dr. Goutam Das (homeopathy council).
- **Why those aren't on the site:** a wrong number on a medical page is worse than none, so none were made up. Each one is a one-line addition when it arrives.

### [x] 2. Correct Dr. Rajeev Agarwal's qualifications and experience

- His page now shows **MBBS, MD (Obstetrics & Gynaecology)** and **25+ years**. It used to show 27 years and no qualifications.
- The "27+ years" counters also became 25+ on the home, About, Why Renew and Success Stories pages and on the ad banner.
- **Where:** `src/data/doctors.js`. These values are set in code, so a value in the admin panel can't bring back the old figure.

### [x] 3. Add author boxes below every article

Every article ends with a doctor's photo, name, qualifications, registration number and a link to their `/doctor/` page. The doctor shown depends on the article:

| Article | Box shows | Live articles |
|---|---|---|
| Written by Dr. Agarwal | Written by Dr. Rajeev Agarwal | 1 |
| Names Dr. Arnab Kundu | Medically reviewed by Dr. Arnab Kundu | 34 |
| Names Dr. Neha Yadav | Medically reviewed by Dr. Neha Yadav | 33 |
| Names neither | Medically reviewed by Dr. Rajeev Agarwal | 107 |

- **Where:** `src/lib/articleAuthorship.js`.
- **Pending:** Dr. Neha Yadav's qualifications aren't on record, so her box has no qualifications line until the clinic sends them.

### [x] 4. Add more photos to each branch location page

| Branch | Photos |
|---|---|
| Salt Lake | 6 |
| Jamshedpur | 4 |
| Gariahat | 3 |

- **New photos:** 8, converted to WebP and stored in `public/images/renew/uploads/2026/10/`. Each has its own description.
- **Display:** thumbnails are bigger, and clicking a photo opens it full-size, with arrows to move between photos and Esc to close.
- **Removed:** the generic `Inner-Page-Banner-2.jpg` from Gariahat, because nothing shows it was taken at that branch.
- **Before going live:** confirm the clinic is allowed to publish the Gariahat reception photo (`renew-healthcare-mandeville-gardens-reception.webp`), because it shows patients' faces.

### [x] 5. Add directions to each branch location page

Each branch page has a "How To Reach Us" section:

| Branch | Landmark | Main road | Metro / transport | Parking |
|---|---|---|---|---|
| Salt Lake | ~600 m from City Centre 1 mall | Near 1st Avenue; EM Bypass ~1 km | City Centre metro ~550 m; Bengal Chemical metro ~800 m | Paid car park at City Centre 1 mall; call the clinic about parking |
| Gariahat | Next to South Point School, ~300 m from Ballygunge Phari | Off Gariahat Road (~450 m) | Ballygunge Junction railway station ~600 m; Kalighat metro ~2.2 km | Residential lane; call the clinic about parking |
| Jamshedpur | ~500 m from Bistupur market | K Road, Bistupur | Tatanagar Junction railway station ~3.5 km (no metro) | Bistupur public parking, L Road, ~200 m |

- **How these were worked out:** from each branch's Google Maps pin, measured to nearby places on OpenStreetMap. Distances are straight-line.
- **Where to change a line:** `src/data/locations.js`. The clinic should read the table once and correct anything.

### [x] 6. Redirect the unexplained infertility article

- `/blogs/unexplained-infertility-next-steps` will redirect to `https://drrajeevagarwal.co.in/unexplained-infertility-all-reports-normal-not-pregnant/`.
- **How it switches on:** every deploy checks whether that page loads, and adds the redirect only if it does. The redirect starts working with the first deploy after the article is published.
- **Today:** that page returns "page not found" (404), so the redirect is off.
- **If the article is published at a different address:** change `to` in `src/lib/externalRedirects.js`.

---

### Also done

- **Google Search Console:** the verification file is added at `public/google5f81505f78425849.html`. After deploying, click **Verify** in Search Console, and keep the file afterwards.

### Needs attention (not changed)

These 9 live articles still show notes meant for the writers, such as "[Verify … before publishing]". They need editing in the admin panel:

- English:
  - `icsi-when-needed-cost-and-plain-ivf`
  - `chemical-pregnancy-early-loss-explained`
  - `caesarean-scar-defect-niche`
  - `embryo-transfer-day-what-happens`
  - `missed-miscarriage-when-the-scan-says-what-the-body-hasnt`
- Bengali:
  - `adenomyosis-bachchha-na-hoar-karon`
  - `barbar-garvopat-kon-porikkha`
  - `couple-fertility-workup-kon-test-kokhon-kora`
  - `mashiker-byatha-kokhon-sadharon`

### Next steps

1. Review on http://localhost:3000, then commit and merge to `main`.
2. Click **Verify** in Google Search Console.
3. Clinic:
   - the 10 registration numbers
   - Dr. Neha Yadav's qualifications
   - a quick check of the directions
   - permission for the Gariahat reception photo
4. Content team:
   - remove the writers' notes from the 9 articles
   - publish the new unexplained-infertility article
