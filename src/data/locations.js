// Opening hours for all three branches, as confirmed by the owner on
// 24 Oct 2026 (same hours every branch, Monday to Saturday). The schema form
// is used by locationClinicSchema(); the text is shown on each branch page.
// Bank-holiday handling is still to be confirmed, so it is not stated here.
export const OPENING_HOURS = 'Monday to Saturday, 9:00 AM – 6:30 PM'
// Owner's confirmation, 24 Oct 2026: the same closure rule at every branch.
export const OPENING_HOURS_NOTE = 'Closed on Sundays and bank holidays.'
export const OPENING_HOURS_SPECIFICATION = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:30',
  },
  // schema.org convention for a closed day: opens and closes at 00:00.
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' },
]

export const locations = [
  {
    slug: 'saltlake',
    // Google Business Profile brief (18 Oct 2026), Part 4: the one name and
    // address used on every listing. The CID comes from this branch's own
    // Google Maps embed below (the place id after "!1s0x…:").
    gbpName: 'Renew Healthcare',
    gbpAddress: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata 700064',
    postalAddress: { streetAddress: 'CB 69, CB Block, Sector 1, Bidhannagar', addressLocality: 'Kolkata', addressRegion: 'West Bengal', postalCode: '700064' },
    seoTitle: 'IVF and Fertility Centre in Salt Lake, Kolkata | Renew Healthcare',
    mapsUrl: 'https://maps.google.com/?cid=3902917559414819569',
    name: 'Saltlake',
    address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata 700064',
    // Client's confirmation (task A4, 26 Oct 2026): the Salt Lake number is
    // +91 6292312076, the same as the footer and the contact page. It replaces
    // 062922 69060 (the Gariahat line), which was set here on 24 Oct.
    phone: '+91 6292312076',
    hours: OPENING_HOURS,
    hoursNote: OPENING_HOURS_NOTE,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1841.890894700904!2d88.40033064837824!3d22.58726325812174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275e065555555%3A0x3629f2d77c8e0af1!2sRenew%20Healthcare!5e0!3m2!1sen!2sin!4v1721464477531!5m2!1sen!2sin',
    services: ['Conception', 'Women’s Health', 'Endoscopy', 'Genetic Health', 'Wellness & Nutrition'],
    doctors: ['Dr. Rajeev Agarwal', 'Dr. Neha Yadav'],
    image: '/images/renew/uploads/2025/03/renew-ivf-saltlake.jpg',
    // Clinic photos (checklist item 4, photos supplied 29 Oct 2026). `position`
    // keeps the signboard in frame when a tall photo is cropped to 4:3.
    gallery: [
      { src: '/images/renew/uploads/2026/10/renew-healthcare-salt-lake-building-entrance.webp', alt: 'Renew Healthcare signboard over the entrance of the clinic building at CB 69, Salt Lake', position: 'center 72%' },
      { src: '/images/renew/uploads/2026/10/renew-healthcare-salt-lake-reception-waiting-area.webp', alt: 'Reception desk and waiting area at Renew Healthcare, Salt Lake' },
      { src: '/images/renew/uploads/2026/10/renew-healthcare-salt-lake-brand-wall.webp', alt: 'Renew Woman Care, Fertility, USG and Genetics wall at Renew Healthcare, Salt Lake' },
      { src: '/images/renew/uploads/2025/03/ivf-saltlake.jpg', alt: 'Consultation room at Renew Healthcare, Salt Lake' },
      { src: '/images/renew/uploads/2026/10/renew-healthcare-salt-lake-building-front.webp', alt: 'Front of the Renew Healthcare building, CB Block, Sector 1, Salt Lake', position: 'center 70%' },
      { src: '/images/renew/uploads/2025/03/renew-ivf-saltlake.jpg', alt: 'Renew Healthcare clinic building, Salt Lake, seen from the street' },
    ],
    // "How to reach us" (checklist item 5, 29 Oct 2026). Distances are straight-
    // line, measured from the branch's Google Maps pin to OpenStreetMap places;
    // the clinic can correct any line here. Empty fields are not shown.
    directions: {
      landmark: 'CB Block, Sector 1, about 600 m from City Centre 1 mall (DC Block).',
      road: 'Close to 1st Avenue, Sector 1. The EM Bypass is about 1 km away.',
      transit: 'City Centre metro station (Green Line) is about 550 m away and Bengal Chemical metro station about 800 m. Bidhannagar Road railway station is about 1.3 km away.',
      parking: 'Please call the clinic about parking before you come by car. The nearest large car park is the paid one at City Centre 1 mall, about 600 m away.',
    },
    intro: 'Renew Healthcare Saltlake offers fertility, gynaecology, genetic health, endoscopy, wellness, and nutrition support from a modern clinic in Bidhannagar.',
  },
  {
    slug: 'jamshedpur',
    gbpName: 'Renew Healthcare',
    // PIN 831001 (Bistupur) is from the earlier address on this page and the
    // schema below; shown in the address since 24 Oct 2026. The brief asks for
    // it to be checked against the signboard or a utility bill.
    gbpAddress: '1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001',
    postalAddress: { streetAddress: '1st Floor, Michael John Tower, 6 K Road, Bistupur', addressLocality: 'Jamshedpur', addressRegion: 'Jharkhand', postalCode: '831001' },
    seoTitle: 'IVF and Fertility Centre in Bistupur, Jamshedpur | Renew Healthcare',
    mapsUrl: 'https://maps.google.com/?cid=7454174246179340593',
    name: 'Jamshedpur',
    address: '1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001',
    phone: '+91 62922 69061',
    hours: OPENING_HOURS,
    hoursNote: OPENING_HOURS_NOTE,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.1898182412465!2d86.17949957587665!3d22.79542932476553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e3f61c108ad7%3A0x67728bfba5628131!2sRenew%20Healthcare!5e0!3m2!1sen!2sin!4v1721464534308!5m2!1sen!2sin',
    services: ['Preconception Counselling', 'Infertility Workup', 'IUI', 'IVF', 'ICSI', 'Surrogacy', 'Embryo Freezing', 'Oocyte Freezing', 'Semen Bank', 'Andrology Clinic', 'Genetic Counseling'],
    doctors: ['Dr. Dorothy P Ghosh'],
    image: '/images/renew/uploads/2025/03/renew-ivf-jamshedpur.jpg',
    // Clinic photos (checklist item 4, photos supplied 29 Oct 2026).
    gallery: [
      { src: '/images/renew/uploads/2025/03/renew-ivf-jamshedpur.jpg', alt: 'Renew Fertility entrance at Michael John Tower, Bistupur, Jamshedpur', position: 'center 35%' },
      { src: '/images/renew/uploads/2026/10/renew-fertility-jamshedpur-reception.webp', alt: 'Reception desk and services board at Renew Fertility, Jamshedpur' },
      { src: '/images/renew/uploads/2026/10/renew-fertility-jamshedpur-waiting-area.webp', alt: 'Waiting area at Renew Fertility, Jamshedpur' },
      { src: '/images/renew/uploads/2025/03/renew-healthcare-jamshedpur.jpg', alt: 'Consultation room at Renew Fertility, Jamshedpur' },
    ],
    // "How to reach us" (checklist item 5, 29 Oct 2026). Distances are straight-
    // line, measured from the branch's Google Maps pin to OpenStreetMap places;
    // the clinic can correct any line here. Empty fields are not shown.
    directions: {
      landmark: 'In Bistupur, about 500 m from Bistupur market and close to the Bistupur petrol pump on K Road.',
      road: 'On K Road, Bistupur. Kharkai Link Road is about 200 m away.',
      transit: 'Tatanagar Junction railway station is about 3.5 km away. Jamshedpur has no metro; auto-rickshaws and taxis run to Bistupur.',
      parking: 'Bistupur public parking area on L Road, about 200 m from the clinic.',
    },
    intro: 'Renew Health Care Jamshedpur, “Renew Fertility” is for couples who are still deprived of the joy of having a child. Here you can consult our infertility specialist Dr. Dorothy Ghosh.',
  },
  {
    slug: 'gariahat',
    gbpName: 'Renew Healthcare',
    gbpAddress: 'Ground Floor, 18 C, Mandeville Gardens, Ballygunge, Kolkata 700019',
    // Brief task 31: the Google profile uses this address, so it is the first
    // line of the page.
    firstLine: '18 C, Mandeville Gardens, Ballygunge',
    postalAddress: { streetAddress: 'Ground Floor, 18 C, Mandeville Gardens, Ballygunge', addressLocality: 'Kolkata', addressRegion: 'West Bengal', postalCode: '700019' },
    seoTitle: 'IVF and Fertility Centre in Ballygunge, Kolkata | Renew Healthcare',
    mapsUrl: 'https://maps.google.com/?cid=445319978748151357',
    name: 'Renew Ballygunge',
    address: 'Ground Floor, 18 C, Mandeville Gardens, Ballygunge, Kolkata 700019',
    phone: '+91 62922 69060',
    hours: OPENING_HOURS,
    hoursNote: OPENING_HOURS_NOTE,
    // Task B4 (26 Oct 2026): the client's embed for this place
    // (0x3a0277589dea95db:0x62e182948ab063d = cid 445319978748151357) showed
    // about 59 km of map. Same embed, zoomed to street level (1d) and centred
    // on the coordinates Google returns for the place in that embed, which it
    // resolves to "Ground Floor, Renew Healthcare, 18 C, Mandeville Gardens,
    // Ekdalia, Ballygunge, Kolkata 700019".
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1841.8!2d88.3669942!3d22.5224052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277589dea95db%3A0x62e182948ab063d!2sRenew%20Healthcare!5e0!3m2!1sen!2sin!4v1793010930767!5m2!1sen!2sin',
    services: ['Conception', 'Women’s Health', 'Pregnancy Care', 'Gynaecology', 'Genetic Health'],
    doctors: ['Dr. Rajeev Agarwal', 'Dr. Arnab Kundu', 'Dr. Sonam Agarwal'],
    image: '/images/renew/uploads/2026/07/renew-healthcare-mandeville-gardens.webp',
    // Clinic photos (checklist item 4, photos supplied 29 Oct 2026). The
    // generic Inner-Page-Banner-2.jpg was dropped: its branch could not be
    // identified (it is also a banner on service pages).
    gallery: [
      { src: '/images/renew/uploads/2026/10/renew-healthcare-mandeville-gardens-entrance.webp', alt: 'Renew Healthcare entrance at 18C Mandeville Gardens, Ballygunge', position: 'center 55%' },
      { src: '/images/renew/uploads/2026/10/renew-healthcare-mandeville-gardens-reception.webp', alt: 'Reception and waiting area at Renew Healthcare, Mandeville Gardens' },
      { src: '/images/renew/uploads/2026/07/renew-healthcare-mandeville-gardens.webp', alt: 'Corridor to the consultation rooms, injection room and IVF laboratory at Renew Healthcare, Mandeville Gardens' },
    ],
    // "How to reach us" (checklist item 5, 29 Oct 2026). Distances are straight-
    // line, measured from the branch's Google Maps pin to OpenStreetMap places;
    // the clinic can correct any line here. Empty fields are not shown.
    directions: {
      landmark: 'Next to South Point School (16 Mandeville Gardens), about 300 m from Ballygunge Phari.',
      road: 'Off Gariahat Road, about 450 m away. Gariahat Market and Rashbehari Avenue are about 350 m away.',
      transit: 'Ballygunge Junction railway station is about 600 m away. The nearest metro station is Kalighat (Blue Line), about 2.2 km away.',
      parking: 'Mandeville Gardens is a residential lane, so please call the clinic about parking before you come by car.',
    },
    intro: 'Renew Ballygunge supports fertility, gynaecology, pregnancy care, and women’s health services from Mandeville Gardens, Ballygunge.',
  },
]
