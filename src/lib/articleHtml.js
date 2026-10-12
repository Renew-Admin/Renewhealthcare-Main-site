// articleHtml — pure helpers applied to article body HTML before it is
// rendered (ticket RH-08).
//
// BlogPostPage prints its own <h1>{title}</h1> above the body, so any <h1>
// left in the body by the WordPress export or the admin editor gives the page
// two top-level headings. They are demoted to <h2> at render time; the stored
// HTML is left as the author wrote it.

// `<h1` followed by whitespace or `>` only — never <h10>, <h1x> or similar.
const H1_OPEN = /<h1(?=[\s>])([^>]*)>/gi
const H1_CLOSE = /<\/h1\s*>/gi

/** Turn every <h1 …>…</h1> in a block of HTML into <h2 …>…</h2>, attributes intact. */
export function demoteBodyHeadings(html) {
  return String(html || '').replace(H1_OPEN, '<h2$1>').replace(H1_CLOSE, '</h2>')
}
