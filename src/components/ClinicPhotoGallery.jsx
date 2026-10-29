'use client'
import { useCallback, useEffect, useState } from 'react'

// Branch photo gallery with a full-size viewer: click a photo to open it,
// then use the arrows (or ← / →) to move between photos and Esc to close.
// The thumbnails are plain <img> tags in the server HTML, so crawlers and
// visitors without JavaScript still see every photo.
export default function ClinicPhotoGallery({ photos = [] }) {
  const [open, setOpen] = useState(-1)
  const close = useCallback(() => setOpen(-1), [])
  const step = useCallback((by) => setOpen((index) => (index + by + photos.length) % photos.length), [photos.length])

  useEffect(() => {
    if (open < 0) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  const current = photos[open]
  return (
    <>
      <div className="location-photo-grid">
        {photos.map((photo, index) => (
          <button type="button" className="location-photo" key={photo.src} onClick={() => setOpen(index)} aria-label={`View larger: ${photo.alt}`}>
            <img
              src={photo.src}
              alt={photo.alt}
              style={photo.position ? { objectPosition: photo.position } : undefined}
              loading="lazy"
              decoding="async"
            />
            <span className="location-photo-zoom" aria-hidden="true">⤢</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="photo-viewer" role="dialog" aria-modal="true" aria-label={current.alt} onClick={close}>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>{current.alt} <span>{open + 1} / {photos.length}</span></figcaption>
          </figure>
          <button type="button" className="photo-viewer-close" onClick={close} aria-label="Close photo">×</button>
          {photos.length > 1 && (
            <>
              <button type="button" className="photo-viewer-nav is-prev" onClick={(event) => { event.stopPropagation(); step(-1) }} aria-label="Previous photo">‹</button>
              <button type="button" className="photo-viewer-nav is-next" onClick={(event) => { event.stopPropagation(); step(1) }} aria-label="Next photo">›</button>
            </>
          )}
        </div>
      )}
    </>
  )
}
