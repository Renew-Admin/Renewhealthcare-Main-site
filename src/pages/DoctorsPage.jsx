import DoctorCard from '../components/DoctorCard.jsx'
import { doctorCategories, doctors } from '../data/doctors.js'
import './ContentPages.css'
import './ServicesPages.css'

export default function DoctorsPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare doctors" />
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
            {doctorCategories.map(category => {
              const categoryDoctors = doctors.filter(doctor => doctor.category === category)
              return (
                <section className="people-category" key={category}>
                  <div className="service-category-head">
                    <h3>{category}</h3>
                    <span>{categoryDoctors.length} Members</span>
                  </div>
                  <div className="people-grid">
                    {categoryDoctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
