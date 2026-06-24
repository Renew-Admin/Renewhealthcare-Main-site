// storage.js — all admin image uploads go through here, into one public
// `media` bucket, always stored as WebP. Powers the Media Library too.
import { supabase, isSupabaseConfigured } from './supabase.js'

export const MEDIA_BUCKET = 'media'
export const BLOG_IMAGE_MAX_BYTES = 200 * 1024

export function validateBlogImageFile(file) {
  if (!file) return
  const name = (file.name || '').toLowerCase()
  const isWebp = file.type === 'image/webp' || name.endsWith('.webp')

  if (!isWebp) {
    throw new Error('Blog images must be WebP format (.webp). Please convert the image before uploading.')
  }

  if (file.size > BLOG_IMAGE_MAX_BYTES) {
    throw new Error('Blog images must be under 200 KB. Please compress this WebP image and try again.')
  }
}

// Convert any image File/Blob to a WebP Blob using an offscreen canvas.
// Downsizes very large images so pages stay fast.
export async function fileToWebp(file, { maxWidth = 1600, quality = 0.82 } = {}) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const img = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
  const scale = Math.min(1, maxWidth / img.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  if (!blob) throw new Error('Could not convert image to WebP in this browser.')
  return blob
}

function publicUrl(name) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl
}

// Upload a file (converted to WebP) and return its public URL.
// `kind` is a filename prefix used to group items in the Media Library.
export async function uploadToBucket(file, kind = 'general') {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  if (kind === 'blog') validateBlogImageFile(file)
  const webp = kind === 'blog' ? file : await fileToWebp(file)
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
