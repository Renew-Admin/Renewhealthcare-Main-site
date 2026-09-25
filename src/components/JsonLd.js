// JsonLd — renders structured data into the server HTML. `<` is escaped so a
// value containing "</script>" cannot break out of the tag.
export default function JsonLd({ data }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean)
  return items.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
    />
  ))
}
