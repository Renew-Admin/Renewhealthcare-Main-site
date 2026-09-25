// Homepage FAQs shown when the admin panel has no FAQs of its own.
// Shared by the FAQ section (visible answers) and the homepage FAQPage schema.
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

export const STATIC_HOME_FAQS = FAQS.map(([question, answer]) => ({ question, answer }))

/** The FAQ list the homepage shows: admin FAQs replace the defaults once they exist. */
export function resolveHomeFaqs(rows = []) {
  const remote = (rows || []).filter((f) => f && f.question).map((f) => ({ question: f.question, answer: f.answer }))
  return remote.length ? remote : STATIC_HOME_FAQS
}
