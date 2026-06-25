import Hero from '../../components/Hero/Hero.js'
import AboutRenew from '../../components/AboutRenew/AboutRenew.js'
import HomeSections from '../../components/HomeSections/HomeSections.js'
import HomeFeatures from '../../components/HomeFeatures/HomeFeatures.js'
import HomeFaq from '../../components/HomeFaq/HomeFaq.js'
import Seo, { SITE } from '../../components/Seo.js'

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'Renew Healthcare',
  url: SITE,
  image: `${SITE}/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp`,
  telephone: '+91-6292269060',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kolkata',
    addressRegion: 'West Bengal',
    addressCountry: 'IN',
  },
  medicalSpecialty: ['ReproductiveMedicine', 'Gynecologic', 'Obstetric'],
  availableService: [
    'IVF clinic Kolkata',
    'Fertility Consultation',
    'Pregnancy Checkup',
    'Gynaecology Checkup',
    'Ultrasonography',
    'Pathology/Blood test',
    'Home Collection',
  ],
}

export default function Home() {
  return (
    <main>
      <Seo
        title="Best IVF & Fertility Centre in Kolkata"
        description="Renew Healthcare, led by Dr. Rajeev Agarwal, offers advanced IVF, IUI, gynaecology, pregnancy and genetic care in Kolkata with transparent costing and high success rates."
        path="/"
        jsonLd={homeJsonLd}
      />
      <Hero />
      <AboutRenew />
      <HomeSections />
      <HomeFeatures />
      <HomeFaq />
    </main>
  )
}
