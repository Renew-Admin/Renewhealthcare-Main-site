# Analytics, consent and lead forwarding

Owner: website developer. Last reviewed: 16 Oct 2026.

## GA4

| Item | Value |
|---|---|
| Property | 324128078 "Renew Healthcare Site" |
| Stream / Measurement ID | 3850870068 / `G-VL7SJC7ENL` |
| Implementation | Direct gtag.js (no GTM). `src/app/layout.js` + `src/lib/analytics.js` |
| Page views | Only `src/hooks/usePageTracking.js`. `send_page_view:false`; the stream's history-based page views are off. |
| Enhanced measurement | Scrolls, outbound clicks, site search, **form interactions (form_start / form_submit)**, video, file downloads |
| Redaction | Email on; query keys mcp_token, token, access_token, email, phone, mobile, name, customer_number, whatsapp_number, otp, __site_version |

### Event dictionary

| Event | Fires when | Params | Key event |
|---|---|---|---|
| `page_view` | Each genuine route change, after the new `<title>` is written | page_location (campaign params only), page_title, page_category | No |
| `form_start` / `form_submit` | GA4 enhanced measurement (form interactions) | GA4 defaults | No |
| `form_error` | A lead form fails validation (browser check or ours) or the save fails | form_type, error_field (field name only), error_type (`validation` / `submit_failed`) | No |
| `generate_lead` | `createLead()` resolved, i.e. Supabase accepted the row | form_type, page_category | **Yes** |
| `phone_click` | Click/Enter on a `tel:` link | cta_location, page_category | Yes (contact intent) |
| `whatsapp_click` | Click/Enter on a WhatsApp link | cta_location, page_category | Yes (contact intent) |
| `email_click` | Click/Enter on a `mailto:` link | cta_location, page_category | No |
| `appointment_cta_click` | "Request Call Back", "Enquire About Appointments", `#book-appointment` links | cta_location, cta_type, page_category | No |

`form_type` values: `callback-modal`, `appointment`, `footer`, `blog-enquiry`, `contact-page` (set with `data-form-type` on each `<form>`).
`cta_location`: `header`, `footer`, `floating`, `callback_modal`, `body`, or any `data-cta-location` attribute.
`page_category`: generic section only (`service_page`, `blog`, …). Paths that reveal a condition are never sent as a category.

**Never sent:** names, phone numbers, emails, purpose of visit, messages, dates, Supabase IDs, tokens, or any query parameter except utm_*, gclid, gbraid, wbraid, dclid.

### Guards
- Only `renewhealthcare.in` / `www.renewhealthcare.in` send data. Every other host (localhost, *.workers.dev, previews) sets `ga-disable-G-VL7SJC7ENL`.
- `/admin` never sends data.
- `RENEW_OFFLINE=1` builds do not load gtag at all.

## Consent (Consent Mode v2)
- Defaults before gtag loads: everything **denied**; `ads_data_redaction` on.
- Banner (`src/components/ConsentBanner.js`): Accept all / Customise / Reject non-essential. Choice is stored in `localStorage.rh_consent` (v1) and re-applied on every page.
- `ad_personalization` is **always denied**: no remarketing or personalised audiences from fertility browsing.
- Meta Pixel loads only after ad-measurement consent.
- Footer "Cookie settings" reopens the banner (withdrawal).
- Legal review of the privacy notice under the DPDP Act 2023 is still required.

## Lead forwarding (`/api/lead`)
Browser → `/api/lead` (this Worker) → Make.com. The webhook URL is the Worker secret `MAKE_WEBHOOK_URL`; it is never in client JS.

Checks: Origin must be renewhealthcare.in, JSON only, ≤ 8 KB, schema validation, honeypot (`website`), per-isolate rate limit (20 / 10 min / IP), duplicate guard (same phone + form within 2 min). Form contents are never logged.

Supabase insert is unchanged (browser, anon key, insert-only RLS) and remains the source of truth for `generate_lead`.

**Set before deploying:** `npx wrangler secret put MAKE_WEBHOOK_URL` (or Cloudflare dashboard → Workers → renewhealthcare → Settings → Variables and secrets). Without it `/api/lead` returns 503 and leads reach Supabase only.

**Recommended:** Cloudflare WAF rate-limiting rule on `/api/lead` (e.g. 10 requests / minute / IP → block 10 min), then rotate the Make.com webhook (create a new hook in the scenario, update the secret, delete the old hook).

## Rollback
Revert the merge commit and redeploy. GA4 and lead delivery return to the previous behaviour. The old webhook URL keeps working until it is rotated in Make.com.
