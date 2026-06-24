import EntityManager from './EntityManager.jsx'
import { doctorsApi } from '../lib/content.js'
import { invalidateDoctors } from '../hooks/useContent.js'

const DEPARTMENTS = [
  'Our Experts', 'Genetics', 'Visiting Consultant', 'Embryology', 'Andrology',
  'Dept Of Ultrasonography', 'Nurses', 'Receptionist', 'Admin Department',
]

export default function AdminDoctors() {
  return (
    <EntityManager
      title="Doctors"
      subtitle="Team profiles for the Doctors page. Admin entries appear before the built-in list."
      addLabel="+ Add doctor"
      api={doctorsApi}
      onMutate={invalidateDoctors}
      columns={[
        { key: 'photo', type: 'image' },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Designation', grow: true },
        { key: 'category', label: 'Department' },
        { key: 'active', label: 'Status', type: 'toggle' },
      ]}
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'role', label: 'Designation', placeholder: 'Fertility Specialist | IVF Doctor' },
        { key: 'qualification', label: 'Qualifications', placeholder: 'MBBS, MD, DNB' },
        { key: 'category', label: 'Department', type: 'select', options: DEPARTMENTS },
        { key: 'photo', label: 'Photo', type: 'image', kind: 'doctor' },
        { key: 'bio', label: 'Short bio', type: 'textarea' },
        { key: 'display_order', label: 'Display order', type: 'number' },
        { key: 'active', label: 'Show on website', type: 'toggle' },
      ]}
      defaults={{ active: true, display_order: 0, category: 'Our Experts' }}
    />
  )
}
