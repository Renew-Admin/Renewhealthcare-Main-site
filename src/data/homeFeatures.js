// homeFeatures.js — content for the News, Failed IVF/IUI CTA, Appointment and
// Testimonials sections on the home page. Images are served from the local
// /assets/renew folder (never the old WordPress domain); Instagram reel links
// stay as external URLs.

export const newsItems = [
  {
    title: 'IVF Myths And Facts: Expert Addresses Common Misconceptions',
    image: '/assets/renew/news/ivf-myths-fact.jpg',
    link: 'https://www.herzindagi.com/health/ivf-myths-and-facts-article-294948',
    source: 'Herzindagi',
  },
  {
    title: 'World IVF Day 2024: Expert Debunks Myths And Misconceptions Around IVF',
    image: '/assets/renew/news/world-ivf-day.webp',
    link: 'https://www.timesnownews.com/health/world-ivf-day-2024-expert-debunks-myths-and-misconceptions-around-ivf-article-111990500',
    source: 'Times Now',
  },
  {
    title: 'World IVF Day 2024: Expert Explains How Age Affects IVF Treatment',
    image: '/assets/renew/news/age-affects-ivf.jpg',
    link: 'https://www.onlymyhealth.com/world-ivf-day-how-does-age-affect-ivf-treatment-1721800929',
    source: 'OnlyMyHealth',
  },
  {
    title: 'Busting Some Common Myths Related to Infertility and Pregnancy',
    image: '/assets/renew/news/infertility-pregnancy-myths.jpg',
    link: 'https://www.news18.com/lifestyle/busting-some-common-myths-related-to-infertility-and-pregnancy-8977801.html',
    source: 'News18',
  },
]

export const failedIvfCta = {
  heading: 'Failed IVF/IUI? Not explained the reason for failure?',
  buttonText: 'Get a free consultation',
  backgroundImage: '/assets/renew/cta/failed-ivf-banner.jpg',
}

export const appointmentInfo = {
  leftHeadingMobile: 'Locate Us',
  mapImage: {
    url: '/assets/renew/map/top-fertility-clinic-kolkata.png',
    alt: 'top IVF doctors in Kolkata',
    title: 'top rated best IVF centre in Kolkata',
  },
  heading: 'Book An Appointment',
  submitText: 'Book An Appointment',
}

export const consultationOptions = [
  'Book Your Appointment',
  'Online Consultation',
  'Center Consultation',
]

export const testimonials = [
  {
    name: 'Virali & Shaket Agarwal',
    image: '/assets/renew/testimonials/virali-shaket.png',
    imageAlt: 'best fertility doctor in Kolkata',
    instagramLink: 'https://www.instagram.com/reel/C1B2u-lL5cx/',
    message:
      'We are truly thankful to Dr. Rajeev Agarwal and the Renew Healthcare team for their incredible support throughout our nine-month journey. It was a seamless and very positive experience, and we are deeply grateful.',
  },
  {
    name: 'Mehul & Shruti Agarwal',
    image: '/assets/renew/testimonials/mehul-shruti.png',
    imageAlt: 'top fertility clinic in Kolkata',
    instagramLink: 'https://www.instagram.com/reel/C0bcVpKreZv/',
    message:
      'After years of trying, I was finally able to conceive naturally with the guidance of Dr. Rajeev. We are incredibly grateful to Renew Healthcare, and here’s our baby!',
  },
  {
    name: 'Abhishikta & Sambuddha Ghosh',
    image: '/assets/renew/testimonials/abhishikta-sambuddha.png',
    imageAlt: 'top IVF centre in Kolkata',
    instagramLink: 'https://www.instagram.com/reel/CzvxlEAqy-7/?igsh=c3FqejBkNTA2Z2l4',
    message:
      'We are extremely happy with our babies and the entire process. With Dr. Agarwal, it has been a smooth and seamless journey. Renew Healthcare has truly been a blessing to us.',
  },
  {
    name: 'Ankit & Saloni Jhunjhunwala',
    image: '/assets/renew/testimonials/ankit-saloni.png',
    imageAlt: 'top 5 IVF centre in Kolkata',
    instagramLink: 'https://www.instagram.com/reel/C5s0RKWrK7R/',
    message:
      'A very special thank you to Mr. Rajeev Agarwal and the entire team of Renew Healthcare. They made our pregnancy for the nine months very smooth with proper guidance, care and consultancy. The team was working 24/7. It is a one stop solution for whatever pre and post pregnancy care you need. Thank you so much!',
  },
  {
    name: 'Vishal & Sakshi Kanodia',
    image: '/assets/renew/testimonials/vishal-sakshi.png',
    imageAlt: 'top 10 IVF doctors near me',
    instagramLink: 'https://www.instagram.com/reel/C7Bveq9rwRK/?igsh=aGw4anhzOWs3MzJs',
    message:
      'Dr. Rajeev Agarwal has helped us through a smooth pregnancy, and we were able to bring our baby into this world. We’d like to thank Dr. Rajeev Agarwal and the entire team of Renew Healthcare for helping us through all the challenges we faced.',
  },
]
