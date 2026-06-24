import { useLeadSubmit } from '../../hooks/useLeadSubmit.js'
import './CallbackModal.css'

export default function CallbackModal({ open, onClose }) {
  const { status, error, submit } = useLeadSubmit()
  if (!open) return null

  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email'),
      service: data.get('service'),
      message: data.get('message'),
      source: 'callback-modal',
    })
    if (ok) form.reset()
  }

  return (
    <div className="callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-title">
      <div className="callback-modal-panel">
        <div className="callback-modal-head">
          <div>
            <span className="callback-eyebrow">Request Call Back</span>
            <h2 id="callback-title">Talk to Renew Healthcare</h2>
          </div>
          <button type="button" className="callback-close" onClick={onClose} aria-label="Close request call back form">
            ×
          </button>
        </div>

        <form className="callback-form" onSubmit={onSubmit}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="tel" name="phone" placeholder="Phone Number" required />
          <input type="email" name="email" placeholder="Email" />
          <select name="service" defaultValue="">
            <option value="" disabled>Consultation Type</option>
            <option>Book Your Appointment</option>
            <option>Online Consultation</option>
            <option>Center Consultation</option>
          </select>
          <textarea name="message" placeholder="Your Message" />
          <button type="submit" className="callback-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Submit Request'}
          </button>
          {status === 'sent' && <p className="lead-form-msg ok">Thank you! Our team will call you back shortly.</p>}
          {status === 'error' && <p className="lead-form-msg err">{error}</p>}
        </form>
      </div>
    </div>
  )
}
