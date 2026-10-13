// Tests for src/lib/articleHtml.js (RH-08) — run with `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { demoteBodyHeadings } from '../src/lib/articleHtml.js'

test('RH-08 h1 with attributes becomes h2 with the same attributes', () => {
  const html = '<h1 class="wp-block-heading" id="intro">Why IVF fails</h1><p>Body</p>'
  assert.equal(demoteBodyHeadings(html), '<h2 class="wp-block-heading" id="intro">Why IVF fails</h2><p>Body</p>')
})

test('RH-08 every h1 in the body is demoted, uppercase tags included', () => {
  const html = '<h1>One</h1>\n<p>text</p>\n<H1 style="x">Two</H1 >\n<h2>Three</h2>'
  assert.equal(demoteBodyHeadings(html), '<h2>One</h2>\n<p>text</p>\n<h2 style="x">Two</h2>\n<h2>Three</h2>')
})

test('RH-08 html without h1 is returned unchanged', () => {
  const html = '<h2>Heading</h2><p>Some <strong>text</strong> and <a href="/blogs">a link</a>.</p><h3>Sub</h3>'
  assert.equal(demoteBodyHeadings(html), html)
})

test('RH-08 h10 and h1x are not touched', () => {
  const html = '<h10>ten</h10><h1x>x</h1x><h100 class="y">hundred</h100>'
  assert.equal(demoteBodyHeadings(html), html)
})

test('RH-08 empty and non-string input is tolerated', () => {
  assert.equal(demoteBodyHeadings(''), '')
  assert.equal(demoteBodyHeadings(null), '')
  assert.equal(demoteBodyHeadings(undefined), '')
})
