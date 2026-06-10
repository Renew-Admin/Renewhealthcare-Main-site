import './CallbackModal.css'

export default function CallbackModal({ open, onClose }) {
  if (!open) return null

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

        <form className="callback-form">
          <input type="text" placeholder="Name" />
          <input type="tel" placeholder="Phone Number" />
          <input type="email" placeholder="Email" />
          <select defaultValue="">
            <option value="" disabled>Consultation Type</option>
            <option>Book Your Appointment</option>
            <option>Online Consultation</option>
            <option>Center Consultation</option>
          </select>
          <textarea placeholder="Your Message" />
          <button type="button" className="callback-submit">Submit Request</button>
        </form>
      </div>
    </div>
  )
}
