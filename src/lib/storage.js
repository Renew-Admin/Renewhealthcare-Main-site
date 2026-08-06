// storage.js — all admin blog/media image uploads go through here, into one
// public `media` bucket, always stored as WebP. Powers the Media Library too.
//
// Blog uploads accept any image the editor picks (JPG, PNG, AVIF, GIF…) and
// compress it to WebP under BLOG_IMAGE_MAX_BYTES in the browser before it ever
// reaches the bucket. Nothing has to be converted by hand first.
//
// The conversion itself lives in ./imageConvert.js, shared with GMB uploads.
import { supabase, isSupabaseConfigured } from './supabase.js'
import { convertImage, formatBytes } from './imageConvert.js'

export const MEDIA_BUCKET = 'media'

// Ceiling every blog cover and in-body image is squeezed under.
export const BLOG_IMAGE_MAX_BYTES = 100 * 1024

export { formatBytes }

// Convert any image File/Blob to a WebP Blob.
// `maxBytes` turns on the size-fitting search; 0 keeps it to a single pass.
export async function fileToWebp(file, { maxWidth = 1600, quality = 0.82, maxBytes = 0 } = {}) {
  return convertImage(file, { type: 'image/webp', maxWidth, quality, maxBytes })
}

function publicUrl(name) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl
}

// Upload a file (converted to WebP) and return its public URL.
// `kind` is a filename prefix used to group items in the Media Library.
export async function uploadToBucket(file, kind = 'general') {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  if (!file) throw new Error('No file selected.')
  const webp = await fileToWebp(file, { maxBytes: kind === 'blog' ? BLOG_IMAGE_MAX_BYTES : 0 })
  const base = (file.name || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)
  const name = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base || 'image'}.webp`
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(name, webp, { contentType: 'image/webp', upsert: false })
  if (error) throw error
  return { url: publicUrl(name), name, size: webp.size }
}

// Convenience used by the blog editor (returns just the URL).
export async function uploadImage(file, kind = 'blog') {
  const { url } = await uploadToBucket(file, kind)
  return url
}
