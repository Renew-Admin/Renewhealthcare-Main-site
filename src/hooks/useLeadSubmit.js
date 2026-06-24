// useLeadSubmit — shared logic so every lead form on the site behaves the same.
// Returns a submit() that saves to Supabase plus a status for showing feedback.
import { useState } from 'react'
import { createLead } from '../lib/blogApi.js'

export function useLeadSubmit() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  // Returns true on success, false on failure (so the form can reset itself).
  async function submit(payload) {
    if (status === 'sending') return false
    setStatus('sending')
    setError('')
    try {
      await createLead(payload)
      setStatus('sent')
      return true
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please call us instead.')
      setStatus('error')
      return false
    }
  }

  return { status, error, submit }
}
