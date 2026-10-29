import { Link } from '../lib/router.js'

// Server component: the author box at the end of every article. Data comes
// from src/lib/articleAuthorship.js, so the page, the schema and the tests
// agree on who is named and which date is shown.
export default function ArticleAuthorBox({ author }) {
  if (!author) return null
  return (
    <aside className={`blogx-author-box is-${author.kind}`} aria-label={`${author.heading} ${author.name}`}>
      <div className="blogx-author-photo">
        <img src={author.photo} alt={author.name} loading="lazy" decoding="async" width="88" height="88" />
      </div>
      <div className="blogx-author-body">
        <span className="blogx-author-eyebrow">{author.heading}</span>
        <h3 className="blogx-author-name">
          <Link to={author.url}>{author.name}</Link>
        </h3>
        {author.qualifications ? <p className="blogx-author-line">{author.qualifications}</p> : null}
        {author.role ? <p className="blogx-author-line">{author.role}</p> : null}
        {author.registration ? <p className="blogx-author-line is-registration">{author.registration}</p> : null}
        {author.publisher ? (
          <p className="blogx-author-line is-publisher">
            Published by <Link to={author.publisher.url}>{author.publisher.name}</Link>
          </p>
        ) : null}
        {author.date ? (
          <p className="blogx-author-date">
            <span>{author.dateLabel}:</span> <time dateTime={author.dateIso}>{author.date}</time>
          </p>
        ) : null}
        <Link className="blogx-author-link" to={author.url}>
          {`About ${author.name} →`}
        </Link>
      </div>
    </aside>
  )
}
