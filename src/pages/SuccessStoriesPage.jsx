import { Link } from 'react-router-dom'
import './ContentPages.css'
import './ServicesPages.css'

const stories = [
  {
    name: 'Devina Goenka',
    image: 'https://renewhealthcare.in/wp-content/uploads/2024/08/IMG-20220307-WA0010-1.webp',
    text: 'I delivered a baby boy last month under the care and supervision of Dr. Rajeev Agarwal and Renew health care. Thanks to Dr. Rajeev and his team at Renew health care, my journey right from conception and pregnancy to delivery and postpartum has been so smooth.',
  },
  {
    name: 'Priyanka Somani',
    image: 'https://renewhealthcare.in/wp-content/uploads/2024/08/IMG-20220307-WA0026-e1646641589453.webp',
    text: 'It was really a great experience having delivered my baby under Dr. Rajeev Agarwal and his team of experts. The Doctor listens and answers all the queries very patiently and he was always available for support and guidance.',
  },
  {
    name: 'Priyanka Agarwal',
    image: 'https://renewhealthcare.in/wp-content/uploads/2024/08/3220315.jpg.webp',
    text: 'I delivered a baby boy last month after facing a host of complications during the second and third trimesters. My belief is that I could achieve a full-term pregnancy only due to Dr. Rajeev Agarwal’s excellence in the field of gynecology.',
  },
]

export default function SuccessStoriesPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Success stories" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Success Stories</span>
          <h1>Success Stories</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="split-feature">
            <div className="service-heading-block is-left">
              <span>Patient Stories</span>
              <h2>Patient Stories</h2>
              <p>We are delighted to help our patients fulfill their dreams of growing their babies and be a part of their journey towards improved health and happier lives. Some of our patients have been kind enough to share their experiences with Renew Healthcare.</p>
            </div>
            <div className="feature-image-card">
              <img src="https://renewhealthcare.in/wp-content/uploads/2025/01/Collage-Banner2.png" alt="Renew Healthcare success stories" />
            </div>
          </div>

          <div className="story-grid">
            {stories.map(story => (
              <article className="story-card" key={story.name}>
                <img src={story.image} alt={story.name} />
                <div>
                  <h3>{story.name}</h3>
                  <p>{story.text}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="content-panel reviews-panel">
            <img src="https://renewhealthcare.in/wp-content/plugins/widget-google-reviews/assets/img/guest.png" alt="Guest reviewer" />
            <div>
              <h3>Google Reviews</h3>
              <p>Patient reviews and success stories reflect the care, support, and guidance families have received from Renew Healthcare.</p>
            </div>
          </section>

          <section className="service-cta-band">
            <div>
              <span>Your story matters</span>
              <h2>Start your parenthood journey</h2>
              <p>Speak with Renew Healthcare for personal guidance and care.</p>
            </div>
            <div className="service-cta-actions">
              <Link to="/contact">Book Your Appointment</Link>
              <a href="tel:06292269060">Call 062922 69060</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
