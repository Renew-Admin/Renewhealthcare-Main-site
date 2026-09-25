// /comment.php — retired WordPress URL: 410 Gone.
import { goneResponse } from '../../lib/goneResponse.js'

export function GET() {
  return goneResponse()
}

export const HEAD = GET
export const POST = GET
