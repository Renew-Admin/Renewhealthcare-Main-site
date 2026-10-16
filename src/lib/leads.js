// leads — every lead form on the website submits through createLead().
// Anyone can insert (RLS), but only a logged-in admin can read them.
// Uses the lightweight REST client so the public bundle stays free of the
// Supabase SDK.
import { insertLeadRow } from './publicApi.js'

// Submit one enquiry. `source` says which form it came from.
export async function createLead(input) {
  const customerNumber = input.customer_number || input.phone;
  const whatsappNumber = input.whatsapp_number;
  const purpose = input.purpose || input.service;
  const formDate = input.date;
  // Details typed when "Others" is picked; there is no column for it, so it
  // leads the message.
  const purposeDetails = purpose === 'Others' ? input.purpose_other?.trim() || '' : '';

  let finalMessage = input.message?.trim() || '';
  if (purposeDetails) {
    finalMessage = `Other purpose: ${purposeDetails}${finalMessage ? '\n\n' + finalMessage : ''}`;
  }
  if (whatsappNumber) {
    finalMessage = `${finalMessage ? finalMessage + '\n\n' : ''}WhatsApp Number: ${whatsappNumber}`;
  }
  if (formDate) {
    finalMessage = `${finalMessage ? finalMessage + '\n' : ''}Date: ${formDate}`;
  }

  const row = {
    name: input.name?.trim() || null,
    phone: customerNumber?.trim() || null,
    email: input.email?.trim() || null,
    service: purpose?.trim() || null,
    message: finalMessage || null,
    source: input.source || 'website',
    page_path: input.page_path || (typeof window !== 'undefined' ? window.location.pathname : null),
  }

  // Local offline builds (RENEW_OFFLINE=1) must never create real leads: the
  // form behaves as if it succeeded but nothing leaves the machine.
  if (process.env.RENEW_OFFLINE === '1') {
    console.info('[createLead] offline mode: lead not sent', row.source)
    return;
  }

  // 1. Forward to the CRM automation through our own server route. The
  // Make.com webhook URL lives only in the Worker secret MAKE_WEBHOOK_URL and is
  // never shipped to the browser (see src/app/api/lead/route.js).
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ...row,
        customer_number: customerNumber || null,
        whatsapp_number: whatsappNumber || null,
        purpose: purpose || null,
        purpose_details: purposeDetails || null,
        date: formDate || null,
        submitted_at: new Date().toISOString(),
      }),
    }).catch(() => console.warn('[createLead] CRM forward failed'))
  } catch {
    console.warn('[createLead] CRM forward error')
  }

  // 2. Save to Supabase (if configured)
  await insertLeadRow(row)
}
