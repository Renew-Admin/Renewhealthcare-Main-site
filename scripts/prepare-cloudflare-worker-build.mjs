import { rmSync } from 'node:fs'
import { join } from 'node:path'

const buildDir = join(process.cwd(), 'build')

for (const relativePath of ['_redirects']) {
  rmSync(join(buildDir, relativePath), { force: true, recursive: true })
}

console.log('[cloudflare] prepared Worker build output')
