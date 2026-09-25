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

  let finalMessage = input.message?.trim() || '';
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

  // 1. Dispatch to Webhook (always work regardless of domain/environment)
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://hook.us2.make.com/kfd4wrx1hohk6cy8pv8j4oe93b496lb2';
  if (webhookUrl) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...row,
          customer_number: customerNumber || null,
          whatsapp_number: whatsappNumber || null,
          purpose: purpose || null,
          date: formDate || null,
          submitted_at: new Date().toISOString(),
        }),
      }).catch(err => console.warn('[createLead] Webhook delivery failed:', err));
    } catch (webhookErr) {
      console.warn('[createLead] Webhook call error:', webhookErr);
    }
  }

  // 2. Save to Supabase (if configured)
  await insertLeadRow(row)
}
