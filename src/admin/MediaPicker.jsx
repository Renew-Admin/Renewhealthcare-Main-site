// MediaPicker — an image field used across the admin. Upload an image and store
// it in the `media` bucket. Blog uploads are restricted to WebP files under 200 KB.
import { useRef, useState } from 'react'
import { uploadToBucket } from '../lib/storage.js'
import { useToast } from './ui.jsx'

export default function MediaPicker({ value, onChange, kind = 'general' }) {
  const fileRef = useRef(null)
  const toast = useToast()
  const [uploading, setUploading] = useState(false)

  const upload = async (file) => {
    if (!file) return
    try {
      setUploading(true)
      const { url } = await uploadToBucket(file, kind)
      onChange(url)
      toast('Image uploaded')
    } catch (err) {
      toast(err?.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mp">
      <div className="mp-preview">
        {value ? <img src={value} alt="preview" /> : <span className="mp-empty">No image</span>}
      </div>
      <div className="mp-actions">
        <button type="button" className="admin-btn ghost sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
        </button>
        {value && <button type="button" className="admin-btn ghost sm" onClick={() => onChange('')}>Remove</button>}
        <input
          ref={fileRef}
          type="file"
          accept={kind === 'blog' ? 'image/webp,.webp' : 'image/*'}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            upload(f)
          }}
        />
      </div>
    </div>
  )
}
