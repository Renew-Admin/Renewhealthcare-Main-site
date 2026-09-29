import { useState } from 'react'
import { useLeadSubmit, validateLeadForm } from '../../hooks/useLeadSubmit.js'
import './CallbackModal.css'
import TodayDateInput from '../TodayDateInput.js'
import PurposeOtherInput, { OTHER_PURPOSE } from '../PurposeOtherInput.js'


export default function CallbackModal({ open, onClose }) {
  const { status, error, submit } = useLeadSubmit()
  const [purpose, setPurpose] = useState('')
  if (!open) return null

  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    if (!validateLeadForm(form)) return
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      customer_number: data.get('customer_number'),
      whatsapp_number: data.get('whatsapp_number'),
      email: data.get('email'),
      purpose: data.get('purpose'),
      purpose_other: data.get('purpose_other'),
      message: data.get('message'),
      date: data.get('date'),
      source: 'callback-modal',
    })
    if (ok) {
      form.reset()
      setPurpose('')
    }
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
          <input type="tel" name="customer_number" placeholder="Your Phone Number" inputMode="numeric" maxLength={10} required />
          <input type="tel" name="whatsapp_number" placeholder="WhatsApp Number" inputMode="numeric" maxLength={10} required />
          <input type="email" name="email" placeholder="Email" />
          <select name="purpose" defaultValue="" required onChange={e => setPurpose(e.target.value)}>
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
          {purpose === OTHER_PURPOSE && <PurposeOtherInput />}
          <TodayDateInput />
          <textarea name="message" placeholder="Your Message (max 300 characters)" maxLength={300} />
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

