// siteStyles — every public stylesheet, in the exact cascade order of the old
// single Vite CSS bundle (verified against build/assets/index-*.css), with
// index.css last.
//
// The Vite site loaded all CSS on every page, and some pages silently relied
// on rules imported by other pages (e.g. /news uses .service-banner from
// ServicesPages.css without importing it). Loading the same global sheet in
// the same order keeps every page rendering exactly as before. Components
// still import their own CSS; those imports resolve to these same modules.
//
// Admin.css is not included: all of its rules are scoped to .admin-* classes
// and it only loads with the admin panel.
import '../components/GlobalHeader/GlobalHeader.css'
import '../components/AnnouncementBanner/AnnouncementBanner.css'
import '../components/CallbackModal/CallbackModal.css'
import '../components/SiteFooter/SiteFooter.css'
import '../components/FloatingActions/FloatingActions.css'
import '../App.css'
import '../components/Hero/Hero.css'
import '../components/AboutRenew/AboutRenew.css'
import '../components/HomeSections/HomeSections.css'
import '../components/HomeFeatures/HomeFeatures.css'
import '../components/HomeFaq/HomeFaq.css'
import '../views/ServicesPages.css'
import '../views/ContentPages.css'
import '../components/GoogleReviews/GoogleReviews.css'
import '../views/Blog.css'
import '../views/FinalPages.css'
import '../index.css'
