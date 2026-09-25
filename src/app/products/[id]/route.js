// /products/<number> — retired WordPress product URLs: 410 Gone. Anything
// else under /products is simply not a page.
import { goneResponse } from '../../../lib/goneResponse.js'

export async function GET(_request, { params }) {
  const { id } = await params
  if (/^[0-9]+$/.test(id)) return goneResponse()
  return new Response('Not Found', { status: 404, headers: { 'x-robots-tag': 'noindex' } })
}

export const HEAD = GET
