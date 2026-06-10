import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './HomeSections.css'

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
}

const whyItems = [
  ['why-ch-ic1.png', 'More than two decades of experience', 'Highly experienced IVF fertility specialists in Kolkata for diagnosis and treatments for varied fertility issues.'],
  ['why-ch-ic2.png', 'Cost', 'Best possible treatment for every section of society, with subsidised support through Renewing Hope Foundation.'],
  ['why-ch-ic3.png', 'Own eggs and sperm', 'Encouragement of using own eggs and sperm, even in complex fertility conditions.'],
  ['why-ch-ic5.png', 'Referral centre for genetics', 'Solving complex genetic problems through the IVF process with advanced counselling.'],
  ['why-ch-ic6.png', 'Focus on natural conception', 'Woman care from adolescence to menopause with emphasis on natural conception whenever possible.'],
  ['why-ch-ic7.png', 'Transparency', 'Clear clinical practices, costing, success rates, stimulation updates, egg retrieval, and embryo development details.'],
]

const services = [
  ['Conception', 'IVF, IUI, ICSI, fertility preservation, and advanced embryology support.', '/services'],
  ["Women's Health", 'Gynaecology, pregnancy care, endoscopy, and aesthetic gynaecology services.', '/services'],
  ['Genetic Health', 'Preconception, prenatal, paediatric, cardiac, cancer, and neurology genetic counselling.', '/services'],
  ['Wellness & Nutrition', 'Weight management plus pregnancy and postpartum nutrition clinics.', '/services'],
]

const doctors = [
  ['Dr. Rajeev Agarwal', 'Medical Director | Fertility Specialist | IVF Doctor', 'https://renewhealthcare.in/wp-content/uploads/2024/07/Dr-rajeev-agarwal.png'],
  ['Dr. Dorothy P Ghosh', 'Associate Consultant, Jamshedpur', 'https://renewhealthcare.in/wp-content/uploads/2024/07/Dr-Dorothy-Ghosh-1.jpg'],
  ['Dr. Ruby Yadav', 'Associate Consultant', 'https://renewhealthcare.in/wp-content/uploads/2024/07/Dr-Ruby-Yadav-1.jpg'],
  ['Dr. Neha Yadav', 'Associate Consultant', 'https://renewhealthcare.in/wp-content/uploads/2024/07/Dr-Neha-Yadav-1.jpg'],
]

const mediaLogos = ['TOI.png', 'Zee-News.png', 'ABP-live.png', 'Daily-Hunt.png', 'Doctube.png', 'Hindusthan-Times.png', 'India-TV.png', 'Mid-Day.png', 'News-18.png', 'News-Nine.png']

const journeyCards = [
  ['I am having problems conceiving', 'https://renewhealthcare.in/wp-content/uploads/2024/12/best-ivf-treatment-centre-in-kolkata.png'],
  ['I want to Start my family building journey', 'https://renewhealthcare.in/wp-content/uploads/2024/12/best-ivf-centre-in-kolkata.png'],
  ['I am looking for a donor (Egg/Sperm)', 'https://renewhealthcare.in/wp-content/uploads/2024/12/low-cost-ivf-hospital-in-kolkata.png'],
  ['I want to freeze my gametes (Egg/Sperm/Embryo)', 'https://renewhealthcare.in/wp-content/uploads/2024/12/top-ivf-centre-in-kolkata.png'],
  ['Preconception Counselling', 'https://renewhealthcare.in/wp-content/uploads/2024/12/top-5-ivf-centre-in-kolkata.png'],
]

const clinics = [
  ['Renew IVF Saltlake', 'Saltlake, Kolkata', 'https://renewhealthcare.in/wp-content/uploads/2025/03/renew-ivf-saltlake.jpg', '/locations/saltlake'],
  ['Renew IVF Jamshedpur', 'Bistupur, Jamshedpur', 'https://renewhealthcare.in/wp-content/uploads/2025/03/renew-ivf-jamshedpur.jpg', '/locations/jamshedpur'],
]

const blogs = [
  ['What is IVF and Test Tube Baby?', 'Understand IVF, test tube baby treatment, and how fertility specialists guide the process.', 'https://renewhealthcare.in/wp-content/uploads/2026/05/what-is-ivf-and-test-tube-baby.webp'],
  ['Guide to a Healthy Pregnancy', 'Practical care guidance for a safe, informed, and supported pregnancy journey.', 'https://renewhealthcare.in/wp-content/uploads/2026/05/Guide-to-a-Healthy-Pregnancy.webp'],
  ['Foods to Increase Sperm Count', 'Nutrition choices that can support sperm count and improve sperm quality.', 'https://renewhealthcare.in/wp-content/uploads/2026/04/foods-to-increase-sperm-count-and-improve-quality.webp'],
  ['Safe Days To Have Sex To Avoid Pregnancy', 'A clear guide to fertility windows, ovulation timing, and safer planning.', 'https://renewhealthcare.in/wp-content/uploads/2026/04/safe-days-to-have-sex-avoid-pregnancy.webp'],
]

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="home-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

export default function HomeSections() {
  return (
    <>
      <section className="home-band why-renew-section" id="why-renew">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Why Renew Healthcare"
            title="Advanced fertility care with transparent guidance."
            text="Our IVF Centre in Kolkata offers advanced and reliable solutions for couples looking to start their parenthood journey, with strict protocols, global expertise, and compassionate support."
          />

          <motion.div className="video-why-card" {...reveal}>
            <div className="video-why-copy">
              <h3>Why Renew Healthcare</h3>
              <p>Our IVF Centre in Kolkata offers advanced and reliable solutions for couples looking to start their parenthood journey. Our IVF laboratories follow strict international protocols for handling eggs and sperm, ensuring the safest and most optimal conditions.</p>
              <p>We provide a wide range of infertility treatments under one roof, making the process seamless and convenient. Backed by experienced embryologists, gynaecologists, and specialists with global expertise, we focus on delivering high-quality care with a personalized approach.</p>
            </div>
            <a className="video-why-media" href="https://www.youtube.com/watch?v=lepLNR46L-c" target="_blank" rel="noreferrer" aria-label="Watch Renew Healthcare video">
              <img src="https://renewhealthcare.in/wp-content/uploads/2025/01/Collage-Banner2.png" alt="Renew Healthcare patient success collage" />
              <span aria-hidden="true">▶</span>
            </a>
          </motion.div>

          <motion.div className="why-grid" {...reveal}>
            {whyItems.map(([icon, title, text]) => (
              <article className="home-card why-card" key={title}>
                <div className="why-icon">
                  <img src={`https://renewhealthcare.in/wp-content/uploads/2024/07/${icon}`} alt="" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="home-band journey-section" id="parenthood-journey">
        <div className="home-band-inner">
          <SectionHeading eyebrow="Parenthood Journey" title="Where are you in your journey to parenthood?" />
          <div className="journey-grid">
            {journeyCards.map(([title, image]) => (
              <button type="button" className="home-card journey-stage-card" key={title}>
                <img src={image} alt={title} />
                <span>{title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band services-section" id="services">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Treatments"
            title="Treatments Provided By Renew Healthcare"
            text="End-to-end support through advanced fertility treatments, varied gynaecology services, and women’s aesthetic health services."
          />
          <div className="service-showcase">
            {services.map(([title, text, to], index) => (
              <motion.article className="home-card service-card" key={title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.04 }}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={to}>Explore Services <span aria-hidden="true">→</span></Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band doctors-section" id="doctors">
        <div className="home-band-inner">
          <SectionHeading eyebrow="Doctors" title="Meet Our Team Of Infertility Specialists" />
          <div className="doctor-grid">
            {doctors.map(([name, role, image]) => (
              <article className="home-card doctor-card" key={name}>
                <div className="doctor-image">
                  <img src={image} alt={name} />
                </div>
                <div className="doctor-info">
                  <h3>{name}</h3>
                  <p>{role}</p>
                  <Link to="/doctors">Know About {name.replace('Dr. ', 'Dr. ')} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
          <div className="home-center-action">
            <Link to="/doctors" className="home-pill-link">View All</Link>
          </div>
        </div>
      </section>

      <section className="home-band media-section" id="media">
        <div className="home-band-inner">
          <SectionHeading eyebrow="Publications" title="Renew In The News" />
          <div className="media-carousel" aria-label="Media logos">
            <div className="media-track">
              {[...mediaLogos, ...mediaLogos].map((logo, index) => (
                <div className="media-logo" key={`${logo}-${index}`}>
                  <img src={`https://renewhealthcare.in/wp-content/uploads/2024/08/${logo}`} alt={logo.replace('.png', '').replace(/-/g, ' ')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-band clinics-section" id="clinics">
        <div className="home-band-inner">
          <SectionHeading eyebrow="Our Clinics" title="Locate Renew Healthcare near you" />
          <div className="clinic-grid">
            {clinics.map(([name, place, image, to]) => (
              <Link className="home-card clinic-card" to={to} key={name}>
                <img src={image} alt={name} />
                <div>
                  <span>{place}</span>
                  <h3>{name}</h3>
                  <p>Get directions <span aria-hidden="true">→</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band blogs-section" id="blogs">
        <div className="home-band-inner">
          <SectionHeading eyebrow="Latest Blogs" title="Fertility and pregnancy care insights" />
          <div className="blog-grid">
            {blogs.map(([title, text, image]) => (
              <article className="home-card blog-card" key={title}>
                <img src={image} alt={title} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <Link to="/blogs">Read More <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
