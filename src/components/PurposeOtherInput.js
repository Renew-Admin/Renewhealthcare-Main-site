// PurposeOtherInput — the free-text field a lead form shows when the visitor
// picks "Others" as their purpose. Letters/numbers only is enforced by
// validateLeadForm (see hooks/useLeadSubmit.js).
export const OTHER_PURPOSE = 'Others'

export default function PurposeOtherInput({ className, placeholder = 'Please specify your purpose' }) {
  return (
    <input
      className={className}
      type="text"
      name="purpose_other"
      placeholder={placeholder}
      maxLength={100}
      required
      autoFocus
    />
  )
}
