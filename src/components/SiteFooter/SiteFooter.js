import { useState } from 'react'
import './SiteFooter.css'

const aboutShort = 'Renew Healthcare is dedicated to helping individuals and couples achieve their dream of starting a family through our advanced treatments, gynecology services, and women&rsquo;s aesthetic health services. Our'
const aboutFull = 'Renew Healthcare is dedicated to helping individuals and couples achieve their dream of starting a family through our advanced treatments, gynecology services, and women&rsquo;s aesthetic health services. Our team of experts is committed to providing compassionate care and personalized treatment plans to help you achieve your goals.'

const communityLinks = [
  ['Blogs', 'https://renewhealthcare.in/blogs/'],
  ['Doctors', 'https://renewhealthcare.in/doctors/'],
  ['Services', 'https://renewhealthcare.in/services/'],
  ['FAQs', 'https://renewhealthcare.in/faq/'],
  ['News', 'https://renewhealthcare.in/news/'],
  ['Success Stories', 'https://renewhealthcare.in/success-stories/'],
  ['Gallery', 'https://renewhealthcare.in/gallery/'],
  ['Fellowship', 'https://renewhealthcare.in/fellowship/'],
  ['Contact', 'https://renewhealthcare.in/contact/'],
]

const socialLinks = [
  ['https://www.facebook.com/renewhealthcare.in', 'fa-facebook-f', 'Facebook'],
  ['https://www.instagram.com/renewhealthcare/', 'fa-instagram', 'Instagram'],
  ['https://x.com/renew_care?mx=2', 'fa-twitter', 'X'],
  ['https://www.linkedin.com/company/renew-healthcare/', 'fa-linkedin-in', 'LinkedIn'],
  ['https://www.youtube.com/channel/UCE28jj3ng2d313UbiVYUxdQ', 'fa-youtube', 'YouTube'],
  ['https://in.pinterest.com/renewhealthcare/', 'fa-pinterest', 'Pinterest'],
  ['https://www.tumblr.com/renewhealthcare', 'fa-tumblr', 'Tumblr'],
]

const locations = [
  {
    name: 'Gariahat',
    address: '18C, Mandeville Gardens, Ballygunge, Kolkata, West Bengal 700019',
    phone: '+91 6292 269 060',
  },
  {
    name: 'Saltlake:',
    address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064',
    phone: '+91 8336 968 661',
  },
  {
    name: 'Jamshedpur:',
    address: 'Michael John Tower, 1st Floor, Southern Area 06, K-Road Bistupur 831001',
    phone: '+91 9153 994 100',
  },
]

export default function SiteFooter({ onCallback }) {
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
  }

  return (
    <footer id="contact">
      <div className="footer_sec custom-pad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-7">
              <div className="footer-left">
                <div className="footer-logo">
                  <a href="https://renewhealthcare.in">
                    <img
                      src="https://renewhealthcare.in/wp-content/uploads/2024/07/foter-logo.png"
                      alt="Renew Healthcare Kolkata"
                      title="foter-logo"
                    />
                  </a>
                </div>

                <div className="footer-mobile-content d-block d-lg-none">
                  <div className="about-content">
                    <div
                      className={expanded ? 'short-content d-none' : 'short-content'}
                      dangerouslySetInnerHTML={{ __html: `<p>${aboutShort}</p>` }}
                    />
                    <div
                      className={expanded ? 'full-content' : 'full-content d-none'}
                      dangerouslySetInnerHTML={{ __html: `<p>${aboutFull}</p>` }}
                    />
                    <button type="button" className="read-more" onClick={() => setExpanded(value => !value)}>
                      {expanded ? 'Read Less' : 'Read More'}
                    </button>
                  </div>
                </div>

                <div
                  className="footer-desktop-content d-none d-lg-block"
                  dangerouslySetInnerHTML={{ __html: `<p>${aboutFull}</p>` }}
                />

                <ul className="sosal-icon">
                  {socialLinks.map(([href, icon, label]) => (
                    <li key={href}>
                      <a href={href} target="_blank" rel="noreferrer" title="Follow Us" aria-label={`Follow Renew Healthcare on ${label}`}>
                        <i className={`fa-brands ${icon}`} aria-hidden="true"></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-2 col-md-5 col-sm-6">
              <div className="footer-manu">
                <h4>Community</h4>
                <ul id="menu-footer-menu" className="menu">
                  {communityLinks.map(([label, href]) => (
                    <li className="menu-item nav-item" key={href}>
                      <a href={href} className="nav-link">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="foot-location">
                <h4>Our Locations</h4>
                <ul className="foot-location-box">
                  {locations.map(location => (
                    <li key={location.name}>
                      <h5>{location.name}</h5>
                      <p><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {location.address}</p>
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`}>
                        <i className="fa-solid fa-phone-volume" aria-hidden="true"></i>{location.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="footer-form">
                <h4>Get A Call Back </h4>
                <div className="wpcf7 js" id="wpcf7-f558-o4" lang="en-US" dir="ltr" data-wpcf7-id="558">
                  <div className="screen-reader-response">
                    <p role="status" aria-live="polite" aria-atomic="true"></p>
                    <ul></ul>
                  </div>
                  <form action="/#wpcf7-f558-o4" method="post" className="wpcf7-form init" aria-label="Contact form" noValidate data-status="init" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <span className="wpcf7-form-control-wrap" data-name="Name">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Name" type="text" name="Name" />
                        </span>
                      </div>
                      <div className="col-lg-6">
                        <span className="wpcf7-form-control-wrap" data-name="Phone">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel" aria-required="true" aria-invalid="false" placeholder="Phone" type="tel" name="Phone" />
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="Email">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email" aria-required="true" aria-invalid="false" placeholder="Email" type="email" name="Email" />
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="your-number">
                          <select className="wpcf7-form-control wpcf7-select wpcf7-validates-as-required" aria-required="true" aria-invalid="false" name="your-number" defaultValue="">
                            <option value="">Book Your Appointment</option>
                            <option value="Online Consultation">Online Consultation</option>
                            <option value="Center Consultation">Center Consultation</option>
                          </select>
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="YourMessage">
                          <textarea cols="40" rows="10" maxLength="2000" className="wpcf7-form-control wpcf7-textarea" aria-invalid="false" placeholder="Your Message" name="YourMessage"></textarea>
                        </span>
                      </div>
                      <div className="col-lg-12">
                        {['utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'gclid'].map(name => (
                          <input className="wpcf7-form-control wpcf7-hidden" value="" type="hidden" name={name} key={name} readOnly />
                        ))}
                        <input className="wpcf7-form-control wpcf7-submit has-spinner custom-button" type="submit" value="Get a Consultation" />
                        <span className="wpcf7-spinner"></span>
                      </div>
                    </div>
                    <div className="wpcf7-response-output" aria-hidden="true"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>© 2026 <a href="https://renewhealthcare.in"> Renew Healthcare.</a> All Rights Reserved.</p>
            </div>
            <div className="col-md-6 footer-bottom-links">
              <ul className="d-flex gap-3 flex-end">
                <li><a href="https://renewhealthcare.in/privacy-policy/">Privacy Policy</a></li>
                <li><a href="https://renewhealthcare.in/patient-rights-responsibilities/">Patient Rights &amp; Responsibilities</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
