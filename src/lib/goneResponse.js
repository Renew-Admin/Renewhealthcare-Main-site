// 410 Gone for URLs of the retired WordPress site that must drop out of
// search indexes (carried over from the old Cloudflare Worker).
export function goneResponse() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'content-type': 'text/plain; charset=UTF-8',
      'x-robots-tag': 'noindex, nofollow',
      'cache-control': 'public, max-age=3600',
    },
  })
}
