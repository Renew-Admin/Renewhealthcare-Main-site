'use client'
// TodayDateInput — the hidden "date" field every lead form submits (dd-mm-yy).
//
// Pages are prerendered, so a date computed during render would be the build
// date, baked into the HTML. The value is filled in after mount instead, from
// the visitor's clock, exactly as the client-rendered forms used to do.
import { useEffect, useState } from 'react'

function todayDateStr() {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yy = String(today.getFullYear()).slice(-2)
  return `${dd}-${mm}-${yy}`
}

export default function TodayDateInput({ className }) {
  const [value, setValue] = useState('')
  useEffect(() => setValue(todayDateStr()), [])
  return <input className={className} type="hidden" name="date" value={value} readOnly />
}
