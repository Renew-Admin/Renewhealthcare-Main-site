import { motion } from 'framer-motion'
import DoctorCard from '../components/DoctorCard.jsx'
import { useDoctors } from '../hooks/useContent.js'
import './ContentPages.css'
import './ServicesPages.css'

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

export default function DoctorsPage() {
  const { doctors, categories } = useDoctors()
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare doctors" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Doctors</span>
          <h1>Doctors</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Our Experts</span>
            <h2>Meet Our Team Of Infertility Specialists</h2>
            <p>Renew Healthcare brings together fertility specialists, genetic experts, embryologists, counsellors, nursing, operations, and support teams across departments.</p>
          </div>

          <div className="people-category-stack">
            {categories.map(category => {
              const categoryDoctors = doctors.filter(doctor => doctor.category === category)
              return (
                <motion.section className="people-category" key={category} {...reveal}>
                  <div className="service-category-head">
                    <h3>{category}</h3>
                    <span>{categoryDoctors.length} Members</span>
                  </div>
                  <div className="people-grid">
                    {categoryDoctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
                  </div>
                </motion.section>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
