import EntityManager from './EntityManager.jsx'
import { faqsApi } from '../lib/content.js'
import { invalidateFaqs } from '../hooks/useContent.js'

export default function AdminFaqs() {
  return (
    <EntityManager
      title="FAQs"
      subtitle="Questions shown in the FAQ section, before the built-in defaults."
      addLabel="+ Add FAQ"
      api={faqsApi}
      onMutate={invalidateFaqs}
      columns={[
        { key: 'question', label: 'Question', grow: true, truncate: true },
        { key: 'category', label: 'Category' },
        { key: 'active', label: 'Status', type: 'toggle' },
      ]}
      fields={[
        { key: 'question', label: 'Question', required: true },
        { key: 'answer', label: 'Answer', type: 'textarea', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['home', 'blog', 'general'] },
        { key: 'display_order', label: 'Display order', type: 'number' },
        { key: 'active', label: 'Show on website', type: 'toggle' },
      ]}
      defaults={{ active: true, category: 'home', display_order: 0 }}
    />
  )
}
