import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { blogs } from '../src/data/blogs.js'

const root = process.cwd()
const outputPath = join(root, 'backend/import_static_blogs.sql')
const chunkDir = join(root, 'backend/blog_import_chunks')
const MAX_CHUNK_BYTES = 82 * 1024

function literal(value) {
  if (value == null) return 'null'
  return `'${String(value).replace(/\u0000/g, '').replace(/'/g, "''")}'`
}

function textValue(value) {
  if (value == null) return 'null'
  const base64 = Buffer.from(String(value).replace(/\u0000/g, ''), 'utf8').toString('base64')
  return `convert_from(decode('${base64}', 'base64'), 'UTF8')`
}

function int(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const rows = blogs.map((blog) => {
  const htmlPath = join(root, 'public/blog-content', `${blog.slug}.html`)
  const content = readFileSync(htmlPath, 'utf8')
  const publishedAt = `${blog.iso || new Date().toISOString().slice(0, 10)} 00:00:00+00`

  return {
    slug: blog.slug,
    sql: [
      textValue(blog.slug),
      textValue(blog.title),
      textValue(blog.category || 'General'),
      textValue(blog.excerpt || ''),
      textValue(content),
      textValue(blog.image || ''),
      int(blog.readMins, 5),
      'true',
      'false',
      literal(publishedAt),
    ].join(', '),
  }
})

function chunkRows(items) {
  const chunks = []
  let current = []
  let currentBytes = 0

  for (const row of items) {
    const rowBytes = Buffer.byteLength(row.sql, 'utf8')
    if (current.length > 0 && currentBytes + rowBytes > MAX_CHUNK_BYTES) {
      chunks.push(current)
      current = []
      currentBytes = 0
    }
    current.push(row)
    currentBytes += rowBytes
  }

  if (current.length > 0) chunks.push(current)
  return chunks
}

function importSqlForChunk(chunk, index, total) {
  return `-- ============================================================================
-- Renew Healthcare - static blog import chunk ${index + 1} of ${total}.
--
-- Run backend/schema.sql first. Then run every file in this folder in filename
-- order through Supabase SQL Editor.
--
-- Safe to rerun: existing blogs with the same slug are left untouched.
-- ============================================================================

begin;

do $$
begin
  if to_regclass('public.blogs') is null then
    raise exception 'public.blogs does not exist. Run backend/schema.sql first, then rerun this import.';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'blogs'
      and c.relrowsecurity = true
  ) then
    raise exception 'public.blogs exists, but Row Level Security is not enabled. Run backend/schema.sql first.';
  end if;
end $$;

with incoming (
  slug,
  title,
  category,
  excerpt,
  content,
  cover_image,
  read_mins,
  published,
  is_featured,
  published_at
) as (
  values
  (${chunk.map((row) => row.sql).join('),\n  (')})
)
insert into public.blogs (
  slug,
  title,
  category,
  excerpt,
  content,
  cover_image,
  read_mins,
  published,
  is_featured,
  published_at
)
select
  slug,
  title,
  category,
  excerpt,
  content,
  cover_image,
  read_mins,
  published,
  is_featured,
  published_at::timestamptz
from incoming
on conflict (slug) do nothing;

commit;

-- Verification after running:
-- select count(*) from public.blogs;
-- select slug, title, published from public.blogs order by published_at desc limit 10;
`
}

const chunks = chunkRows(rows)

rmSync(chunkDir, { recursive: true, force: true })
mkdirSync(chunkDir, { recursive: true })

chunks.forEach((chunk, index) => {
  const filename = `import_static_blogs_${String(index + 1).padStart(2, '0')}_of_${String(chunks.length).padStart(2, '0')}.sql`
  writeFileSync(join(chunkDir, filename), importSqlForChunk(chunk, index, chunks.length))
})

const manifest = `-- ============================================================================
-- Renew Healthcare - static blog import generator notes.
--
-- The full blog import is split into smaller files because Supabase SQL Editor
-- rejects one large query when all article HTML is included.
--
-- This manifest is committed for documentation only. The generated chunk folder
-- is local-only and ignored by git.
--
-- Run in this order:
--   1. backend/schema.sql
--   2. node scripts/generate-blog-import-sql.mjs
--   3. Every generated file in backend/blog_import_chunks/ in filename order
--
-- Generated chunks: ${chunks.length}
-- Total blogs: ${blogs.length}
--
-- Verification after all chunks:
--   select count(*) from public.blogs;
--   select slug, title, published from public.blogs order by published_at desc limit 10;
-- ============================================================================
`

writeFileSync(outputPath, manifest)
console.log(`Wrote ${chunks.length} chunks to ${chunkDir} with ${blogs.length} blog rows.`)
