// gmbStorage.js — GMB post images, stored in the `gmb-posts` bucket.
//
// Google Business Profile posts are always served as JPG, so everything that
// arrives here — a PNG, a WebP, an AVIF, or a link to one — is converted to
// JPEG and stored under a .jpg name. A pasted xyz.webp link is downloaded,
// converted, and re-hosted as xyz.jpg on our own bucket; simply renaming the
// link would leave it pointing at a file that does not exist.
import { supabase, isSupabaseConfigured } from './supabase.js'
import { convertImage, fetchImageAsFile, formatBytes } from './imageConvert.js'

export const GMB_BUCKET = 'gmb-posts'
export const GMB_IMAGE_MAX_BYTES = 5 * 1024 * 1024 // 5 MB — Google's own ceiling
export const GMB_IMAGE_TYPE = 'image/jpeg'

export { formatBytes }

export function getPublicUrlForGmb(path) {
  return supabase.storage.from(GMB_BUCKET).getPublicUrl(path).data.publicUrl
}

// `.jpg`, always — the extension is ours to choose, not the source file's.
function storagePathFor(sourceName, locationSlug) {
  const base = (sourceName || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)
  const folder = (locationSlug || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '')
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base || 'image'}.jpg`
  return `${folder}/${fileName}`
}

// Transparency is flattened onto white, since JPEG has no alpha channel.
async function toGmbJpeg(file) {
  return convertImage(file, {
    type: GMB_IMAGE_TYPE,
    maxWidth: 1600,
    maxBytes: GMB_IMAGE_MAX_BYTES,
    background: '#ffffff',
  })
}

async function storeAsJpeg(file, locationSlug) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const jpeg = await toGmbJpeg(file)
  const storagePath = storagePathFor(file.name, locationSlug)

  const { error } = await supabase.storage
    .from(GMB_BUCKET)
    .upload(storagePath, jpeg, { contentType: GMB_IMAGE_TYPE, upsert: false })

  if (error) throw error

  return { url: getPublicUrlForGmb(storagePath), path: storagePath, size: jpeg.size }
}

/**
 * Uploads a picked file to the gmb-posts bucket as JPEG, organised into
 * subfolders by location slug (e.g. gmb-posts/ballygunge/...).
 */
export async function uploadGmbImage(file, locationSlug) {
  if (!file) throw new Error('Please upload an image.')
  return storeAsJpeg(file, locationSlug)
}

/**
 * Takes an image link, downloads it, converts it to JPEG, and re-hosts it in
 * the gmb-posts bucket so the saved URL always ends in .jpg.
 */
export async function importGmbImageFromUrl(url, locationSlug) {
  const trimmed = (url || '').trim()
  if (!trimmed) throw new Error('Please paste an image link.')
  const file = await fetchImageAsFile(trimmed)
  return storeAsJpeg(file, locationSlug)
}

/**
 * Deletes GMB image file from gmb-posts bucket using public URL or storage path.
 */
export async function deleteGmbImage(imageUrl) {
  if (!imageUrl || !isSupabaseConfigured) return
  try {
    // Extract relative storage path inside bucket from full publicUrl
    // Public URL format: https://<project>.supabase.co/storage/v1/object/public/gmb-posts/<folder>/<filename>
    const match = imageUrl.match(/\/gmb-posts\/(.+)$/)
    const storagePath = match ? match[1] : imageUrl

    if (storagePath) {
      const { error } = await supabase.storage.from(GMB_BUCKET).remove([decodeURIComponent(storagePath)])
      if (error) {
        console.warn(`[GMB Storage] Could not delete image ${storagePath}:`, error.message)
      }
    }
  } catch (err) {
    console.warn('[GMB Storage] Delete image error:', err)
  }
}
