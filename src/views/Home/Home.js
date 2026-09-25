'use client'
import Hero from '../../components/Hero/Hero.js'
import AboutRenew from '../../components/AboutRenew/AboutRenew.js'
import HomeSections from '../../components/HomeSections/HomeSections.js'
import HomeFeatures from '../../components/HomeFeatures/HomeFeatures.js'
import HomeFaq from '../../components/HomeFaq/HomeFaq.js'
import { useSiteContext } from '../../components/SiteShell.js'

// Metadata and JSON-LD for the homepage live in src/app/(site)/page.js.
export default function Home({ faqRows, initialBlogs }) {
  const { onCallback } = useSiteContext()

  return (
    <main>
      <Hero />
      <AboutRenew onCallback={onCallback} />
      <HomeSections initialBlogs={initialBlogs} />
      <HomeFeatures />
      <HomeFaq faqRows={faqRows} />
    </main>
  )
}
