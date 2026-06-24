import { googleReviews, googleRating, googleReviewsUrl } from '../../data/reviews.js'
import { useTestimonials } from '../../hooks/useContent.js'
import './GoogleReviews.css'

function GoogleG({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function Stars({ n = 5 }) {
  return (
    <span className="greview-stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill={i < n ? '#FBBC05' : '#e2e8f0'} aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.4 6.7L12 17.8 6 20.6l1.4-6.7L2.3 9l6.8-.7L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export default function GoogleReviews() {
  const { testimonials } = useTestimonials()
  // Supabase testimonials replace the in-code reviews once they exist.
  const reviews = testimonials.length ? testimonials : googleReviews
  return (
    <section className="greviews" aria-label="Google reviews">
      <div className="greviews-head">
        <div className="greviews-summary">
          <GoogleG size={40} />
          <div className="greviews-summary-text">
            <div className="greviews-score">
              <strong>{googleRating}</strong>
              <Stars n={5} />
            </div>
            <span>Google Rating — verified patient reviews</span>
          </div>
        </div>
        <a className="greviews-cta" href={googleReviewsUrl} target="_blank" rel="noreferrer">
          Read all reviews on Google
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>

      <div className="greviews-wall">
        {reviews.map((review, i) => (
          <article className="greview-card" key={`${review.author}-${i}`}>
            <div className="greview-top">
              <div className="greview-avatar">
                <span>{(review.author || 'G').charAt(0).toUpperCase()}</span>
                {review.photo && <img src={review.photo} alt={review.author} loading="lazy" referrerPolicy="no-referrer" />}
              </div>
              <div className="greview-id">
                <strong>{review.author}</strong>
                <span>{review.date}</span>
              </div>
              <GoogleG size={18} />
            </div>
            <Stars n={review.rating} />
            <p>{review.text}</p>
          </article>
        ))}
      </div>

      <div className="greviews-foot">
        <a className="greviews-more" href={googleReviewsUrl} target="_blank" rel="noreferrer">
          View more reviews on Google
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
    </section>
  )
}
