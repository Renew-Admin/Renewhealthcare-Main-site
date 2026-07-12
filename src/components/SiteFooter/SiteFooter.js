import { Link } from 'react-router-dom'
import { useLeadSubmit } from '../../hooks/useLeadSubmit.js'
import './SiteFooter.css'

const aboutFull = 'Renew Healthcare is dedicated to helping individuals and couples achieve their dream of starting a family through our advanced treatments, gynecology services, and women&rsquo;s aesthetic health services. Our team of experts is committed to providing compassionate care and personalized treatment plans to help you achieve your goals.'

const communityLinks = [
  ['Blogs', '/blogs'],
  ['Doctors', '/doctors'],
  ['Services', '/services'],
  ['FAQs', '/#faq'],
  ['Success Stories', '/success-stories'],
  ['Packages', '/packages'],
  ['Fellowship', '/course/12-months-fellowship-in-reproductive-medicine'],
  ['Why Renew', '/why-renew'],
  ['Contact', '/contact'],
]

const socialLinks = [
  ['https://www.facebook.com/renewhealthcare.in', 'facebook', 'Facebook'],
  ['https://www.instagram.com/renewhealthcare/', 'instagram', 'Instagram'],
  ['https://x.com/renew_care?mx=2', 'x', 'X'],
  ['https://www.linkedin.com/company/renew-healthcare/', 'linkedin', 'LinkedIn'],
  ['https://www.youtube.com/channel/UCE28jj3ng2d313UbiVYUxdQ', 'youtube', 'YouTube'],
  ['https://in.pinterest.com/renewhealthcare/', 'pinterest', 'Pinterest'],
  ['https://www.tumblr.com/renewhealthcare', 'tumblr', 'Tumblr'],
]

const locations = [
  {
    name: 'Gariahat',
    address: '18C, Mandeville Gardens, Ballygunge, Kolkata, West Bengal 700019',
    phone: '+91 6292 269 060',
  },
  {
    name: 'Salt Lake',
    address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064',
    phone: '+91 8336 968 661',
  },
  {
    name: 'Jamshedpur',
    address: 'Michael John Tower, 1st Floor, Southern Area 06, K-Road Bistupur 831001',
    phone: '+91 9153 994 100',
  },
]

function SocialIcon({ name }) {
  const common = { width: 17, height: 17, viewBox: '0 0 24 24', 'aria-hidden': 'true' }
  const icons = {
    facebook: <svg {...common} fill="currentColor"><path d="M14.2 8.1V6.6c0-.7.2-1.1 1.2-1.1h1.7V2.2c-.8-.1-1.7-.2-2.5-.2-2.7 0-4.5 1.6-4.5 4.6v1.5H7.1v3.7h3v9.9h4.1v-9.9h3l.5-3.7h-3.5z" /></svg>,
    instagram: <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.7" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>,
    x: <svg {...common} fill="currentColor"><path d="M14.4 10.2 22.8 0h-2l-7.3 8.8L7.7 0H1l8.8 13.1L1 23.8h2l7.7-9.4 6.2 9.4h6.7l-9.2-13.6zm-2.7 3.3-.9-1.3L3.7 1.6h3l5.7 8.5.9 1.3 7.4 10.9h-3l-6-8.8z" /></svg>,
    linkedin: <svg {...common} fill="currentColor"><path d="M4.9 7.5H1.2V23h3.7V7.5zM3 5.4A2.2 2.2 0 1 0 3 .9a2.2 2.2 0 0 0 0 4.5zM23 14.1c0-4.2-2.2-6.1-5.2-6.1-2.4 0-3.5 1.3-4.1 2.2V8.3H10V23h3.7v-7.3c0-1.9.4-3.8 2.8-3.8 2.3 0 2.4 2.2 2.4 3.9V23h3.7v-8.9H23z" /></svg>,
    youtube: <svg {...common} fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>,
    pinterest: <svg {...common} fill="currentColor"><path d="M12 0C5.4 0 1 4.7 1 10.2c0 3.6 2 5.7 3.2 5.7.5 0 .8-1.4.8-1.8 0-.5-1.2-1.5-1.2-3.5 0-4.1 3.1-7 7.2-7 3.5 0 6.1 2 6.1 5.7 0 2.8-1.1 8-4.8 8-1.3 0-2.5-1-2.1-2.4.4-1.7 1.3-3.5 1.3-5.3 0-3.4-4.8-2.8-4.8 1.3 0 1 .1 1.7.5 2.2-.7 3-2 7.5-2 10.6 0 .2 0 .3.1.4h.1c2.4-3.2 2.3-3.8 3.4-7.9.6 1.2 2.1 1.8 3.3 1.8 5.1 0 7.4-5 7.4-9.5C19.5 3.4 15.1 0 12 0z" /></svg>,
    tumblr: <svg {...common} fill="currentColor"><path d="M14.1 24c-4 0-6.9-2.1-6.9-6.8v-7.7H4.8V6.2c3.5-1.3 4.4-4.3 4.6-6.2h3.4v5.7h4.1v3.8h-4.1v6.7c0 2 .9 2.7 2.4 2.7.7 0 1.4-.2 1.9-.4v4.2c-.8.7-1.8 1.3-3 1.3z" /></svg>,
  }

  return icons[name] || null
}

function InlineIcon({ type }) {
  if (type === 'phone') {
    return <svg className="footer-inline-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
  }

  return <svg className="footer-inline-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
}

const getTodayDateStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
};

export default function SiteFooter({ onCallback }) {
  const { status, error, submit } = useLeadSubmit()

  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('Name'),
      customer_number: data.get('customer_number'),
      whatsapp_number: data.get('whatsapp_number'),
      email: data.get('Email'),
      purpose: data.get('purpose'),
      message: data.get('YourMessage'),
      date: data.get('date'),
      source: 'footer',
    })
    if (ok) form.reset()
  }

  return (
    <footer id="contact">
      <div className="footer_sec custom-pad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-7">
              <div className="footer-left">
                <div className="footer-logo">
                  <Link to="/">
                    <img
                      src="/images/renew/uploads/2024/07/foter-logo.png"
                      alt="Renew Healthcare Kolkata"
                      title="foter-logo"
                    />
                  </Link>
                </div>

                <div className="footer-mobile-content d-block d-lg-none">
                  <div className="about-content">
                    <div
                      className="full-content"
                      dangerouslySetInnerHTML={{ __html: `<p>${aboutFull}</p>` }}
                    />
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
                        <SocialIcon name={icon} />
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
                  {communityLinks.map(([label, to]) => (
                    <li className="menu-item nav-item" key={to}>
                      <Link to={to} className="nav-link">{label}</Link>
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
                      <p><InlineIcon type="location" /> {location.address}</p>
                      <a href={`tel:${location.phone.replace(/\s/g, '')}`}>
                        <InlineIcon type="phone" />{location.phone}
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
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="Name">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false" placeholder="Name" type="text" name="Name" required />
                        </span>
                      </div>
                      <div className="col-lg-6">
                        <span className="wpcf7-form-control-wrap" data-name="customer_number">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel" aria-required="true" aria-invalid="false" placeholder="Customer Number" type="tel" name="customer_number" required />
                        </span>
                      </div>
                      <div className="col-lg-6">
                        <span className="wpcf7-form-control-wrap" data-name="whatsapp_number">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel" aria-required="true" aria-invalid="false" placeholder="WhatsApp Number" type="tel" name="whatsapp_number" required />
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="Email">
                          <input size="40" maxLength="400" className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email" aria-required="true" aria-invalid="false" placeholder="Email" type="email" name="Email" />
                        </span>
                      </div>
                      <div className="col-lg-12">
                        <span className="wpcf7-form-control-wrap" data-name="purpose">
                          <select className="wpcf7-form-control wpcf7-select wpcf7-validates-as-required" aria-required="true" aria-invalid="false" name="purpose" defaultValue="" required>
                            <option value="" disabled>Purpose</option>
                            <option value="Surrogacy">Surrogacy</option>
                            <option value="Egg Freezing">Egg Freezing</option>
                            <option value="Genetic">Genetic</option>
                            <option value="IUI">IUI</option>
                            <option value="IVF">IVF</option>
                            <option value="New Fertility">New Fertility</option>
                            <option value="New Gynae">New Gynae</option>
                            <option value="New Pregnancy">New Pregnancy</option>
                            <option value="Others">Others</option>
                            <option value="Pre-Conception">Pre-Conception</option>
                            <option value="Sperm Donation">Sperm Donation</option>
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
                        <input className="wpcf7-form-control wpcf7-hidden" value={getTodayDateStr()} type="hidden" name="date" readOnly />
                        <input className="wpcf7-form-control wpcf7-submit has-spinner custom-button" type="submit" value={status === 'sending' ? 'Sending…' : 'Get a Consultation'} disabled={status === 'sending'} />
                        <span className="wpcf7-spinner"></span>
                        {status === 'sent' && <p className="lead-form-msg ok">Thank you! We&rsquo;ll call you back shortly.</p>}
                        {status === 'error' && <p className="lead-form-msg err">{error}</p>}
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
              <p>© 2026 <Link to="/"> Renew Healthcare.</Link> All Rights Reserved.</p>
            </div>
            <div className="col-md-6 footer-bottom-links">
              <ul className="d-flex gap-3 flex-end">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/patient-rights-responsibilities">Patient Rights &amp; Responsibilities</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
