// RichEditor — a lightweight contentEditable HTML editor for blog bodies.
// Toolbar: headings, bold/italic, lists, quote, link, and image upload.
// Any picture can be inserted — it is converted to WebP under 100 KB on upload.
import { useEffect, useRef, useState } from 'react'
import { uploadImage } from '../lib/blogApi.js'

export default function RichEditor({ value, onChange }) {
  const ref = useRef(null)
  const fileRef = useRef(null)
  const savedRange = useRef(null)
  const [uploading, setUploading] = useState(false)

  // Load initial / external content without clobbering the caret while typing.
  useEffect(() => {
    const el = ref.current
    if (el && document.activeElement !== el && el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const emit = () => onChange(ref.current?.innerHTML || '')

  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0)
    }
  }

  const restoreSelection = () => {
    const el = ref.current
    el.focus()
    const sel = window.getSelection()
    sel.removeAllRanges()
    if (savedRange.current) {
      sel.addRange(savedRange.current)
    } else {
      // Caret to end if we never captured a position.
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      sel.addRange(range)
    }
  }

  const cmd = (command, arg) => {
    restoreSelection()
    document.execCommand(command, false, arg)
    saveSelection()
    emit()
  }

  const setBlock = (tag) => cmd('formatBlock', `<${tag}>`)

  const addLink = () => {
    const url = window.prompt('Link URL (include https://)')
    if (url) cmd('createLink', url)
  }

  const pickImage = () => {
    saveSelection()
    fileRef.current?.click()
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      restoreSelection()
      document.execCommand(
        'insertHTML',
        false,
        `<figure class="blogx-fig"><img src="${url}" alt="" loading="lazy" /></figure><p><br/></p>`,
      )
      emit()
    } catch (err) {
      alert('Image upload failed: ' + (err?.message || err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rt">
      <div className="rt-toolbar">
        <button type="button" onClick={() => setBlock('h1')} title="Main heading">H1</button>
        <button type="button" onClick={() => setBlock('h2')} title="Heading">H2</button>
        <button type="button" onClick={() => setBlock('h3')} title="Subheading">H3</button>
        <button type="button" onClick={() => setBlock('p')} title="Paragraph">P</button>
        <span className="rt-sep" />
        <button type="button" onClick={() => cmd('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => cmd('italic')} title="Italic"><i>I</i></button>
        <span className="rt-sep" />
        <button type="button" onClick={() => cmd('insertUnorderedList')} title="Bulleted list">• List</button>
        <button type="button" onClick={() => cmd('insertOrderedList')} title="Numbered list">1. List</button>
        <button type="button" onClick={() => setBlock('blockquote')} title="Quote">❝</button>
        <span className="rt-sep" />
        <button type="button" onClick={addLink} title="Insert link">🔗 Link</button>
        <button type="button" onClick={pickImage} disabled={uploading} title="Insert image">
          {uploading ? 'Uploading…' : '🖼 Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
      <div
        ref={ref}
        className="rt-area blogx-prose"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={() => { saveSelection(); emit() }}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder="Write the article here. Use the toolbar for headings, lists, links and images…"
      />
    </div>
  )
}
