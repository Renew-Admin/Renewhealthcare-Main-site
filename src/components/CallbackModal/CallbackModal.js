import { useLeadSubmit } from '../../hooks/useLeadSubmit.js'
import './CallbackModal.css'

const getTodayDateStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
};

export default function CallbackModal({ open, onClose }) {
  const { status, error, submit } = useLeadSubmit()
  if (!open) return null

  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      customer_number: data.get('customer_number'),
      whatsapp_number: data.get('whatsapp_number'),
      email: data.get('email'),
      purpose: data.get('purpose'),
      message: data.get('message'),
      date: data.get('date'),
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
          <input type="tel" name="customer_number" placeholder="Customer Number" required />
          <input type="tel" name="whatsapp_number" placeholder="WhatsApp Number" required />
          <input type="email" name="email" placeholder="Email" />
          <select name="purpose" defaultValue="" required>
            <option value="" disabled>Purpose</option>
            <option value="Surrogacy">Surrogacy</option>
            <option value="Egg Freezing">Egg Freezing</option>
            <option value="Genetic">Genetic</option>
            <option value="IUI">IUI</option>
            <option value="IVF">IVF</option>
            <option value="New Fertility">New Fertility</option>
            <option value="New Gynae">New Gynae</option>
            <option value="New Pregnancy">New Pregnancy</option>
            <option value="Others">Others</option>
            <option value="Pre-Conception">Pre-Conception</option>
            <option value="Sperm Donation">Sperm Donation</option>
          </select>
          <input type="hidden" name="date" value={getTodayDateStr()} />
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

