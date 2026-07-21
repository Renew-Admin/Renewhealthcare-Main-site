import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFaqs } from '../../hooks/useContent.js'
import './HomeFaq.css'

const FAQS = [
  ['What exactly is IVF?',
    'IVF (In Vitro Fertilisation) is a fertility treatment where eggs are collected from the ovaries and fertilised with sperm in a specialised laboratory. The resulting embryo is then transferred into the uterus. It is recommended for blocked tubes, low sperm count, ovulation problems, unexplained infertility, and several other conditions.'],
  ['Which is the best IVF Centre in Kolkata?',
    'Renew Healthcare is among the most trusted IVF centres in Kolkata, led by Dr. Rajeev Agarwal with more than 27 years of experience. We are known for transparent costing, published month-on-month success rates, and a self-cycle-first approach that prioritises your own eggs and sperm.'],
  ['What is the cost of IVF in Kolkata?',
    'IVF cost depends on the protocol, medication, injections, lab requirements, and your individual treatment plan. At Renew Healthcare we explain every aspect of cost during financial counselling on your first visit, so there are no hidden charges later.'],
  ['Is IVF successful and safe?',
    'IVF is a safe, well-established treatment with high success rates when carried out by an experienced team. Success depends on age, ovarian reserve, sperm quality, and uterine health. Our embryology lab follows strict international protocols to give every cycle the best possible conditions.'],
  ['How long does IVF take?',
    'A single IVF cycle typically takes around 4 to 6 weeks, from the start of ovarian stimulation to embryo transfer. The exact timeline varies based on your treatment plan, body’s response, and whether a fresh or frozen transfer is planned.'],
  ['Is infertility limited to female partners only?',
    'No. Infertility affects men and women almost equally. Male factors such as low sperm count, poor motility, or hormonal issues contribute to nearly 40–50% of cases, which is why both partners should be evaluated together.'],
  ['Is IVF painful?',
    'IVF involves minor discomfort rather than significant pain. Hormonal injections may cause mild soreness, and egg retrieval is done under short sedation, so it is not painful. Most patients resume normal activities quickly afterwards.'],
  ['Can I work during an IVF process?',
    'Yes, most patients continue their normal work routine during IVF. We may advise rest around egg retrieval and embryo transfer, but the rest of the cycle usually does not require time off work.'],
]

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

const STATIC_FAQS = FAQS.map(([question, answer]) => ({ question, answer }))

export default function HomeFaq() {
  const [active, setActive] = useState(-1)
  const { faqs: remoteFaqs } = useFaqs()
  // Supabase FAQs replace the in-code defaults once they exist.
  const items = remoteFaqs.length ? remoteFaqs : STATIC_FAQS

  return (
    <section className="home-faq" id="faq">
      <div className="home-faq-inner">
        <motion.div className="home-faq-intro" {...reveal}>
          <span className="home-faq-eyebrow">FAQs</span>
          <h2><span>Questions families</span><br /><span className="heading-blue">ask us most</span></h2>
          <p>Clear, honest answers about IVF, costs, and what to expect on your journey to parenthood. Still unsure? Our team is one message away.</p>
          <a className="home-faq-cta" href="tel:06292269060">
            Talk to a specialist <span aria-hidden="true">→</span>
          </a>
        </motion.div>

        <motion.div className="home-faq-list" {...reveal}>
          {items.map(({ question: q, answer: a }, i) => {
            const open = active === i
            return (
              <div className={`home-faq-item ${open ? 'is-open' : ''}`} key={`${q}-${i}`}>
                <button type="button" onClick={() => setActive(open ? -1 : i)} aria-expanded={open}>
                  <span>{q}</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div className="home-faq-answer" role="region">
                  <p>{a}</p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
