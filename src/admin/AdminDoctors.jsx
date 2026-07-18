import EntityManager from './EntityManager.jsx'
import { doctorsApi } from '../lib/content.js'
import { invalidateDoctors } from '../hooks/useContent.js'

const DEPARTMENTS = [
  'Our Experts', 'Genetics', 'Visiting Consultant', 'Embryology', 'Andrology',
  'Dept Of Ultrasonography', 'Nurses', 'Receptionist', 'Admin Department',
]

function parseJsonArray(value) {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function normalizeStringList(value) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || String(value || '').split('\n')
  return source.map((item) => String(item || '').trim()).filter(Boolean)
}

function listToText(value, fallback = []) {
  const list = normalizeStringList(value)
  return (list.length ? list : fallback).join('\n')
}

function textToList(value) {
  return String(value || '').split('\n').map((item) => item.trim()).filter(Boolean)
}

function firstLine(value) {
  return textToList(value)[0] || ''
}

function normalizePairList(value, keys) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || []
  return source
    .map((item) => Object.fromEntries(keys.map((key) => [key, String(item?.[key] || '').trim()])))
    .filter((item) => keys.some((key) => item[key]))
}

export default function AdminDoctors() {
  return (
    <EntityManager
      title="Doctors"
      subtitle="Team profiles for the Doctors page. Use normal text fields here; lists are converted automatically when saved."
      addLabel="+ Add doctor"
      api={doctorsApi}
      onMutate={invalidateDoctors}
      modalWide
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
        {
          key: 'qualification',
          label: 'Card qualification',
          placeholder: 'MBBS, MD, DNB',
          help: 'Short line shown on doctor cards. If left blank, the first detailed qualification below is used.',
          toStorage: (value, form) => String(value || '').trim() || firstLine(form.qualifications),
        },
        { key: 'category', label: 'Department', type: 'select', options: DEPARTMENTS },
        { key: 'photo', label: 'Photo', type: 'image', kind: 'doctor' },
        { key: 'bio', label: 'Short bio', type: 'textarea', help: 'Use normal paragraphs. Press Enter for a new paragraph.' },
        { key: 'experience_years', label: 'Experience', placeholder: '20+ Years', help: 'Example: 20+ Years' },
        { key: 'milestone_stat', label: 'Highlight / milestone', placeholder: '800+ successful IVF births', help: 'Example: 800+ successful IVF births' },
        {
          key: 'qualifications',
          label: 'Detailed qualifications',
          type: 'list',
          rows: 4,
          placeholder: 'M.B.B.S. - National Medical College (1996)\nM.D. / D.N.B. (OBG) - National Medical College (2000)',
          help: 'Write one qualification per line. No brackets or JSON needed.',
          fromStorage: (value, row) => listToText(value, row.qualification ? [row.qualification] : []),
          toStorage: textToList,
        },
        {
          key: 'specializations',
          label: 'Specializations',
          type: 'list',
          rows: 5,
          placeholder: 'Advanced IVF and IUI Protocols\nICSI / IMSI\nRecurrent IVF Failures',
          help: 'Write one specialization per line.',
          fromStorage: (value) => listToText(value),
          toStorage: textToList,
        },
        {
          key: 'languages',
          label: 'Languages',
          type: 'list',
          rows: 3,
          placeholder: 'English\nHindi\nBengali',
          help: 'Write one language per line.',
          fromStorage: (value) => listToText(value),
          toStorage: textToList,
        },
        {
          key: 'past_attachments',
          label: 'Past attachments',
          type: 'pairList',
          help: 'Add hospital, clinic, or organization history. Leave unused rows blank or remove them.',
          addLabel: '+ Add attachment',
          fromStorage: (value) => normalizePairList(value, ['institution', 'description']),
          toStorage: (value) => normalizePairList(value, ['institution', 'description']),
          fields: [
            { key: 'institution', label: 'Institution', placeholder: 'Care IVF' },
            { key: 'description', label: 'Details', type: 'textarea', placeholder: 'Senior Consultant in Infertility Management...' },
          ],
        },
        { key: 'clinic_address', label: 'Clinic address', type: 'textarea', help: 'Full address shown on the public doctor profile.' },
        {
          key: 'service_areas',
          label: 'Service areas',
          type: 'list',
          rows: 4,
          placeholder: 'Bistupur\nSakchi\nAdityapur\nKadma',
          help: 'Write one location or micro-market per line.',
          fromStorage: (value) => listToText(value),
          toStorage: textToList,
        },
        {
          key: 'faqs',
          label: 'Doctor profile FAQs',
          type: 'pairList',
          help: 'Add patient-friendly questions and answers for the public doctor profile.',
          addLabel: '+ Add FAQ',
          fromStorage: (value) => normalizePairList(value, ['question', 'answer']),
          toStorage: (value) => normalizePairList(value, ['question', 'answer']),
          fields: [
            { key: 'question', label: 'Question', placeholder: 'What is the doctor known for?' },
            { key: 'answer', label: 'Answer', type: 'textarea', placeholder: 'Write a clear patient-friendly answer.' },
          ],
        },
        { key: 'display_order', label: 'Display order', type: 'number' },
        { key: 'active', label: 'Show on website', type: 'toggle' },
      ]}
      defaults={{ active: true, display_order: 0, category: 'Our Experts' }}
    />
  )
}
