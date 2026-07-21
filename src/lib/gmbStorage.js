// gmbStorage.js — handles dedicated GMB image uploads to Supabase Storage in gmb-posts bucket.
import { supabase, isSupabaseConfigured } from './supabase.js'

export const GMB_BUCKET = 'gmb-posts'
export const GMB_IMAGE_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export function validateGmbImageFile(file) {
  if (!file) {
    throw new Error('Please upload an image.')
  }

  const name = (file.name || '').toLowerCase()
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type)

  if (!hasValidExt && !hasValidMime) {
    throw new Error('Allowed image formats are PNG, JPG, JPEG, WEBP.')
  }

  if (file.size > GMB_IMAGE_MAX_BYTES) {
    throw new Error('Image size must not exceed 5 MB.')
  }
}

export function getPublicUrlForGmb(path) {
  return supabase.storage.from(GMB_BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Uploads GMB image directly to Supabase storage without format conversion,
 * organized into subfolders by location slug (e.g. gmb-posts/ballygunge/...).
 */
export async function uploadGmbImage(file, locationSlug) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  validateGmbImageFile(file)

  const name = (file.name || 'image').toLowerCase()
  const extMatch = name.match(/\.(png|jpg|jpeg|webp)$/)
  const ext = extMatch ? extMatch[0] : '.jpg'

  const baseName = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)

  const folder = (locationSlug || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '')
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${baseName || 'image'}${ext}`
  const storagePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(GMB_BUCKET)
    .upload(storagePath, file, { contentType: file.type || 'image/jpeg', upsert: false })

  if (error) throw error

  const publicUrl = getPublicUrlForGmb(storagePath)

  // Ensure publicUrl ends with accepted extension (.png, .jpg, .jpeg, .webp)
  return { url: publicUrl, path: storagePath }
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
