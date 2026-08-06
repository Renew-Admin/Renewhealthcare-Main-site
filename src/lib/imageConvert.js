// imageConvert.js — the shared image pipeline behind every admin upload.
// Decodes whatever the editor picked, then re-encodes it to a target format,
// stepping width and quality down until the result fits a byte budget.
//
// The blog uses it to make WebP under 100 KB; GMB uses it to make JPG.

// Ladders walked when fitting an image to a budget. Pixels stay as large as the
// budget allows — width only drops once even the lowest quality overshoots.
const WIDTH_STEPS = [1600, 1400, 1200, 1000, 860, 720, 600]
const QUALITY_STEPS = [0.82, 0.72, 0.62, 0.52, 0.42, 0.34, 0.26]

const IMAGE_EXT = /\.(png|jpe?g|jfif|webp|gif|bmp|avif|heic|heif|tiff?|svg)$/i

const FORMAT_LABELS = { 'image/webp': 'WebP', 'image/jpeg': 'JPG', 'image/png': 'PNG' }

const label = (type) => FORMAT_LABELS[type] || type

export function isImageFile(file) {
  if (!file) return false
  if (file.type) return file.type.startsWith('image/')
  return IMAGE_EXT.test(file.name || '')
}

export function formatBytes(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

// Decode a file into something drawable. createImageBitmap is faster and honours
// EXIF orientation; <img> is the fallback for browsers that reject the options
// object or the source format.
export async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* fall through to the <img> path */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () =>
        reject(
          new Error(
            `This browser could not read "${file.name || 'the selected file'}". Please try a JPG, PNG or WebP.`,
          ),
        )
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

// Draw onto a canvas and encode. `background` flattens transparency, which JPEG
// needs — without it a transparent PNG encodes onto black.
export async function encodeImage(source, width, height, { type, quality, background } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  if (!blob) throw new Error(`Could not convert this image to ${label(type)} in this browser.`)
  // Browsers without an encoder for `type` silently hand back a PNG instead.
  if (blob.type !== type) {
    throw new Error(`This browser cannot save ${label(type)}. Please use Chrome, Edge, Firefox, or Safari 14+.`)
  }
  return blob
}

// Convert any image File/Blob to `type`.
// `maxBytes` turns on the size-fitting search; 0 keeps it to a single pass.
export async function convertImage(
  file,
  { type = 'image/webp', maxWidth = 1600, quality = 0.82, maxBytes = 0, background } = {},
) {
  if (!isImageFile(file)) {
    throw new Error('That file is not an image. Please choose a JPG, PNG, WebP, GIF, or AVIF file.')
  }

  const img = await decodeImage(file)
  try {
    const srcW = img.naturalWidth || img.width
    const srcH = img.naturalHeight || img.height
    if (!srcW || !srcH) throw new Error('Could not read the dimensions of this image.')

    const sizeAt = (targetWidth) => {
      const scale = Math.min(1, targetWidth / srcW)
      return [srcW * scale, srcH * scale]
    }

    if (!maxBytes) {
      const [w, h] = sizeAt(maxWidth)
      return await encodeImage(img, w, h, { type, quality, background })
    }

    // Already the target format, small enough, and no wider than we would
    // render it — keep the original bytes rather than re-encoding for nothing.
    if (file.type === type && file.size <= maxBytes && srcW <= maxWidth) return file

    const widths = WIDTH_STEPS.filter((w) => w <= maxWidth)
    if (!widths.length) widths.push(maxWidth)
    const qualities = QUALITY_STEPS.filter((q) => q <= quality)
    if (!qualities.length) qualities.push(quality)
    const floorQuality = qualities[qualities.length - 1]

    let smallest = null
    const track = (blob) => {
      if (!smallest || blob.size < smallest.size) smallest = blob
      return blob
    }

    for (const width of widths) {
      const [w, h] = sizeAt(width)
      // Probe the floor first: if the cheapest encode at this width still
      // overshoots, no quality here can fit and we drop to the next width.
      const floor = track(await encodeImage(img, w, h, { type, quality: floorQuality, background }))
      if (floor.size > maxBytes) continue
      // It fits at this width — walk back up for the best quality that holds.
      for (const q of qualities.slice(0, -1)) {
        const blob = track(await encodeImage(img, w, h, { type, quality: q, background }))
        if (blob.size <= maxBytes) return blob
      }
      return floor
    }

    throw new Error(
      `This image could not be compressed under ${formatBytes(maxBytes)} ` +
        `(smallest was ${formatBytes(smallest.size)}). Please crop it or choose a simpler picture.`,
    )
  } finally {
    img.close?.()
  }
}

// Download a remote image so it can be converted and re-hosted. Browsers block
// cross-origin reads unless the host opts in with CORS headers, so a failure
// here is the remote server's choice rather than a bug on our side.
export async function fetchImageAsFile(url) {
  let parsed
  try {
    parsed = new URL(String(url).trim())
  } catch {
    throw new Error('That does not look like a valid image link.')
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error('Image links must start with http:// or https://')
  }

  let res
  try {
    res = await fetch(parsed.href, { mode: 'cors' })
  } catch {
    throw new Error(
      'Could not download that image — the site hosting it blocks other sites from reading its files. ' +
        'Save the picture to your computer and upload the file instead.',
    )
  }
  if (!res.ok) throw new Error(`Could not download that image (HTTP ${res.status}).`)

  const blob = await res.blob()
  if (!blob.type.startsWith('image/')) throw new Error('That link does not point to an image.')

  const name = decodeURIComponent(parsed.pathname.split('/').pop() || '') || 'image'
  return new File([blob], name, { type: blob.type })
}
