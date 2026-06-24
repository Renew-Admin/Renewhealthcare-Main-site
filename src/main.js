import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.js'
import Home from './pages/Home/Home.js'
import PageStub from './pages/PageStub/PageStub.js'
import ServicePage from './pages/ServicePage.jsx'
import ServicesIndex from './pages/ServicesIndex.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DoctorsPage from './pages/DoctorsPage.jsx'
import DoctorDetailPage from './pages/DoctorDetailPage.jsx'
import IvfSuccessPage from './pages/IvfSuccessPage.jsx'
import LocationPage from './pages/LocationPage.jsx'
import LocationsPage from './pages/LocationsPage.jsx'
import SuccessStoriesPage from './pages/SuccessStoriesPage.jsx'
import WhyRenewPage from './pages/WhyRenewPage.jsx'
import BlogListPage from './pages/BlogListPage.jsx'
import BlogPostPage from './pages/BlogPostPage.jsx'
import FinalContentPage, { CoursePage, FinalContentByKey } from './pages/FinalContentPage.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './index.css'

const routes = [
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="/services" element={<ServicesIndex />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctor/:slug" element={<DoctorDetailPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:slug" element={<LocationPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/ivf-success-factors-and-rates" element={<IvfSuccessPage />} />
          <Route path="/why-renew" element={<WhyRenewPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
          <Route path="/packages" element={<FinalContentByKey pageKey="packages" />} />
          <Route path="/contact" element={<FinalContentByKey pageKey="contact" />} />
          <Route path="/male-infertility" element={<FinalContentByKey pageKey="male-infertility" />} />
          <Route path="/female-infertility" element={<FinalContentByKey pageKey="female-infertility" />} />
          <Route path="/injection-instruction" element={<FinalContentByKey pageKey="injection-instruction" />} />
          <Route path="/mental-health" element={<FinalContentByKey pageKey="mental-health" />} />
          <Route path="/international-patients" element={<FinalContentByKey pageKey="international-patients" />} />
          <Route path="/bangladesh" element={<FinalContentByKey pageKey="bangladesh" />} />
          <Route path="/genetic" element={<FinalContentByKey pageKey="genetic" />} />
          <Route path="/course/12-months-fellowship-in-reproductive-medicine" element={<CoursePage pageKey="12-months-fellowship-in-reproductive-medicine" />} />
          <Route path="/course/3-months-course-on-reproductive-medicine" element={<CoursePage pageKey="3-months-course-on-reproductive-medicine" />} />
          <Route path="/:pageKey" element={<FinalContentPage />} />
          {routes.map(([path, title]) => (
            <Route key={path} path={path} element={<PageStub title={title} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
