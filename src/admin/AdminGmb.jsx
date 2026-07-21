// AdminGmb.jsx — Google Business Profile (GMB) post manager extension
import { useState, useRef } from 'react'
import EntityManager from './EntityManager.jsx'
import { gmbPostsApi, GMB_LOCATIONS, GMB_TIME_SCHEDULES } from '../lib/gmb.js'
import { uploadGmbImage, validateGmbImageFile } from '../lib/gmbStorage.js'

function GmbImagePicker({ value, onChange, locationSlug }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleUpload = async (file) => {
    if (!file) return
    setErrorMsg('')
    try {
      validateGmbImageFile(file)
    } catch (err) {
      setErrorMsg(err.message)
      return
    }

    try {
      setUploading(true)
      const { url } = await uploadGmbImage(file, locationSlug)
      onChange(url)
    } catch (err) {
      setErrorMsg(err?.message || 'Please upload an image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mp">
      <div className="mp-preview">
        {value ? <img src={value} alt="GMB Post Preview" /> : <span className="mp-empty">No image selected</span>}
      </div>
      <div className="mp-actions">
        <button
          type="button"
          className="admin-btn ghost sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : value ? 'Replace Image' : 'Upload Image'}
        </button>
        {value && (
          <button type="button" className="admin-btn ghost sm" onClick={() => onChange('')}>
            Remove Image
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            handleUpload(f)
          }}
        />
      </div>
      {errorMsg && <div className="admin-error" style={{ marginTop: '8px', fontSize: '13px' }}>{errorMsg}</div>}
    </div>
  )
}

function CaptionField({ value, onChange, help }) {
  const charCount = (value || '').length
  const isOverLimit = charCount > 250

  return (
    <div className="admin-field full">
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Caption</span>
        <span style={{ fontSize: '12px', color: isOverLimit ? '#d83a52' : '#687587', fontWeight: 700 }}>
          {charCount} / 250 characters
        </span>
      </label>
      <textarea
        rows={4}
        value={value || ''}
        placeholder="Write the Google Business Profile post content..."
        onChange={(e) => onChange(e.target.value)}
        style={{ borderColor: isOverLimit ? '#d83a52' : undefined }}
      />
      {help && <small className="admin-field-help">{help}</small>}
    </div>
  )
}

export default function AdminGmb() {
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <EntityManager
      title="Google Business Profile"
      subtitle="Manage and publish automated Google Business Profile posts for clinics."
      addLabel="+ Add GMB Post"
      api={gmbPostsApi}
      columns={[
        { key: 'ImageURL', label: 'Image', type: 'image' },
        { key: 'Title', label: 'Title', grow: true },
        { key: 'Location', label: 'Clinic Location' },
        { key: 'PostDate', label: 'Publish Date' },
        { key: 'Status', label: 'Status' },
      ]}
      fields={[
        {
          key: 'PostDate',
          label: 'Post Date',
          type: 'date',
          required: true,
          help: 'When should this post be published?',
        },
        {
          key: 'TimeSchedule',
          label: 'Time Schedule',
          type: 'select',
          required: true,
          options: GMB_TIME_SCHEDULES.map((t) => t.label),
          help: 'Select the scheduled publishing time in Asia/Kolkata timezone.',
        },
        {
          key: 'Title',
          label: 'Title',
          required: true,
          help: 'Internal title for easy identification. This is not displayed on Google Business Profile.',
        },
        {
          key: 'Caption',
          label: 'Caption',
          required: true,
          help: 'Write the Google Business Profile post content.',
          isEmpty: (val) => !val || String(val).trim().length === 0 || String(val).length > 250,
          customRender: ({ value, onChange, help }) => (
            <CaptionField value={value} onChange={onChange} help={help} />
          ),
        },
        {
          key: 'Location',
          label: 'Location',
          type: 'select',
          required: true,
          options: GMB_LOCATIONS.map((l) => ({
            value: l.label,
            label: l.label,
            disabled: l.disabled,
          })),
          help: 'Choose which clinic should receive this Google Business Profile post.',
        },
        {
          key: 'ImageURL',
          label: 'Image',
          type: 'custom',
          required: true,
          help: 'Upload the image that will appear in the Google Business Profile post.',
          customRender: ({ value, onChange, form }) => {
            const locObj = GMB_LOCATIONS.find((l) => l.label === form?.Location)
            const slug = locObj ? locObj.slug : 'general'
            return <GmbImagePicker value={value} onChange={onChange} locationSlug={slug} />
          },
        },
        {
          key: 'CTAUrl',
          label: 'CTA URL',
          required: false,
          placeholder: 'https://renewhealthcare.in/book-appointment',
          help: 'Website page users should visit after clicking the button.',
          isEmpty: (val) => {
            if (!val || String(val).trim().length === 0) return false // optional, so empty is allowed
            return !String(val).startsWith('https://')
          },
        },
      ]}
      defaults={{
        PostDate: todayStr,
        TimeSchedule: '10:00 AM (Asia/Kolkata)',
        Location: 'Ballygunge',
        Status: 'Scheduled',
      }}
      customValidation={(form) => {
        if (!form.Title || !String(form.Title).trim()) {
          return 'Title is required.'
        }
        if (!form.Caption || !String(form.Caption).trim()) {
          return 'Caption is required.'
        }
        if (String(form.Caption).length > 250) {
          return 'Caption exceeds the allowed limit.'
        }
        if (!form.ImageURL || !String(form.ImageURL).trim()) {
          return 'Please upload an image.'
        }
        if (!form.Location || !GMB_LOCATIONS.some((l) => l.label === form.Location)) {
          return 'Please choose a clinic.'
        }
        if (form.CTAUrl && String(form.CTAUrl).trim().length > 0 && !String(form.CTAUrl).startsWith('https://')) {
          return 'Website URL is invalid.'
        }
        return null
      }}
      successMessage="GMB post saved successfully."
      topNote={
        <div className="admin-card" style={{ background: '#f8fafc', borderLeft: '4px solid #0767a5', padding: '16px 20px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#075a91' }}>📌 GMB Post Scheduling Guide & Best Practices</h4>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            <strong>1. Chronological Schedule Order:</strong> Please schedule posts day-by-day in sequence (e.g. <strong>Today</strong> &rarr; <strong>Tomorrow</strong> &rarr; <strong>5 Days Later</strong>).
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            <strong>2. Webhook Format:</strong> Posts are delivered to the webhook with <code>PostDate</code> in <code>YYYY-MM-DD</code> format and <code>TimeSchedule</code> converted to 24-hour time (<code>10:00</code> or <code>18:00</code>).
          </p>
        </div>
      }
    />
  )
}
