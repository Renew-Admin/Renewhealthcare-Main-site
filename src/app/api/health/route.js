// Liveness probe, carried over from the Cloudflare Worker.
export function GET() {
  return Response.json({ ok: true })
}
