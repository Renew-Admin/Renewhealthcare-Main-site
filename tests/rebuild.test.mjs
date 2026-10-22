import test from 'node:test'
import assert from 'node:assert/strict'
import { createBuildLimiter, isSignedInAdmin, triggerDeployHook } from '../src/lib/siteRebuild.js'

const supabase = { url: 'https://example.supabase.co/', key: 'anon' }

test('isSignedInAdmin accepts a session Supabase recognises', async () => {
  let called = ''
  const fetchImpl = async (url, init) => {
    called = `${url} ${init.headers.authorization}`
    return new Response(JSON.stringify({ id: 'user-1' }), { status: 200 })
  }
  assert.equal(await isSignedInAdmin('tok', supabase, fetchImpl), true)
  assert.equal(called, 'https://example.supabase.co/auth/v1/user Bearer tok')
})

test('isSignedInAdmin rejects missing, invalid or unreachable sessions', async () => {
  const never = async () => { throw new Error('should not be called') }
  assert.equal(await isSignedInAdmin('', supabase, never), false)
  assert.equal(await isSignedInAdmin('tok', { url: '', key: '' }, never), false)
  assert.equal(await isSignedInAdmin('tok', supabase, async () => new Response('{}', { status: 401 })), false)
  assert.equal(await isSignedInAdmin('tok', supabase, async () => new Response('{}', { status: 200 })), false)
  assert.equal(await isSignedInAdmin('tok', supabase, async () => { throw new Error('down') }), false)
})

test('triggerDeployHook POSTs to the hook and reports the result', async () => {
  let method = ''
  assert.equal(await triggerDeployHook('https://hook.example/x', async (_u, init) => { method = init.method; return new Response('', { status: 200 }) }), true)
  assert.equal(method, 'POST')
  assert.equal(await triggerDeployHook('https://hook.example/x', async () => new Response('', { status: 500 })), false)
  assert.equal(await triggerDeployHook('', async () => new Response('')), false)
})

test('createBuildLimiter caps builds per window', () => {
  let t = 0
  const allow = createBuildLimiter({ limit: 2, windowMs: 1000, now: () => t })
  assert.equal(allow(), true)
  assert.equal(allow(), true)
  assert.equal(allow(), false)
  t = 1001
  assert.equal(allow(), true)
})

test('the deploy hook URL is only read on the server', async () => {
  const { readFile } = await import('node:fs/promises')
  const client = await readFile(new URL('../src/admin/publishSite.js', import.meta.url), 'utf8')
  assert.equal(client.includes('DEPLOY_HOOK_URL'), false)
})
