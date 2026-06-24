import EntityManager from './EntityManager.jsx'
import { testimonialsApi } from '../lib/content.js'
import { invalidateTestimonials } from '../hooks/useContent.js'

export default function AdminTestimonials() {
  return (
    <EntityManager
      title="Testimonials"
      subtitle="Patient stories shown in the reviews section, before the imported Google reviews."
      addLabel="+ Add testimonial"
      api={testimonialsApi}
      onMutate={invalidateTestimonials}
      columns={[
        { key: 'photo', type: 'image' },
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'rating', label: 'Rating', type: 'rating' },
        { key: 'quote', label: 'Quote', grow: true, truncate: true },
        { key: 'active', label: 'Status', type: 'toggle' },
      ]}
      fields={[
        { key: 'name', label: 'Patient name', required: true },
        { key: 'location', label: 'Location / relation', placeholder: 'Kolkata' },
        { key: 'treatment', label: 'Treatment', placeholder: 'IVF' },
        { key: 'rating', label: 'Rating (1–5)', type: 'number' },
        { key: 'quote', label: 'Testimonial', type: 'textarea', required: true },
        { key: 'photo', label: 'Photo', type: 'image', kind: 'testimonial' },
        { key: 'display_order', label: 'Display order', type: 'number' },
        { key: 'active', label: 'Show on website', type: 'toggle' },
      ]}
      defaults={{ active: true, rating: 5, display_order: 0 }}
    />
  )
}
