import React from 'react';
import { Route } from 'react-router-dom';
const ContactUs = React.lazy(() => import('../pages/ContactUs'));
const CareersPage = React.lazy(() => import('../pages/CareersPage'));
const NewsPage = React.lazy(() => import('../pages/NewsPage'));
const CommunitiesPage = React.lazy(() => import('../pages/CommunitiesPage'));
const InvestorsPage = React.lazy(() => import('../pages/InvestorsPage'));
const DepartmentPage = React.lazy(() => import('../pages/DepartmentPage'));

// Who We Are pages
const AboutUs = React.lazy(() => import('../pages/AboutUs'));
const Values = React.lazy(() => import('../pages/Values'));
const Leadership = React.lazy(() => import('../pages/Leadership'));
const Partners = React.lazy(() => import('../pages/Partners'));
const Testimonials = React.lazy(() => import('../pages/Testimonials'));
const Eqore = React.lazy(() => import('../pages/Eqore'));
const Location = React.lazy(() => import('../pages/Location'));
const Team = React.lazy(() => import('../pages/Team'));
const BrandIdentity = React.lazy(() => import('../pages/BrandIdentity'));

// Legal & Compliance pages
const PrivacyPolicy = React.lazy(() => import('../pages/legal/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('../pages/legal/TermsAndConditions'));
const CookiePolicy = React.lazy(() => import('../pages/legal/CookiePolicy'));
const AccessibilityStatement = React.lazy(() => import('../pages/legal/AccessibilityStatement'));
const Sitemap = React.lazy(() => import('../pages/legal/Sitemap'));

/**
 * Public Routes - General pages
 * These include Header/Footer
 * Note: /services route is defined directly in App.js
 */
export const publicRoutes = [
  // General pages
  <Route key="contact" path="/contact" element={<ContactUs />} />,
  <Route key="careers" path="/careers" element={<CareersPage />} />,
  <Route key="news" path="/news" element={<NewsPage />} />,
  <Route key="communities" path="/communities" element={<CommunitiesPage />} />,
  <Route key="investors" path="/investors" element={<InvestorsPage />} />,
  <Route key="department" path="/department/:departmentSlug" element={<DepartmentPage />} />,
  
  // Who We Are pages
  <Route key="about-us" path="/about-us" element={<AboutUs />} />,
  <Route key="values" path="/values" element={<Values />} />,
  <Route key="leadership" path="/leadership" element={<Leadership />} />,
  <Route key="partners" path="/partners" element={<Partners />} />,
  <Route key="testimonials" path="/testimonials" element={<Testimonials />} />,
  <Route key="eqore" path="/eqore" element={<Eqore />} />,
  <Route key="location" path="/location" element={<Location />} />,
  <Route key="team" path="/team" element={<Team />} />,
  <Route key="brand-identity" path="/brand-identity" element={<BrandIdentity />} />,

  // Legal & Compliance pages
  <Route key="privacy" path="/privacy" element={<PrivacyPolicy />} />,
  <Route key="terms" path="/terms" element={<TermsAndConditions />} />,
  <Route key="cookies" path="/cookies" element={<CookiePolicy />} />,
  <Route key="accessibility" path="/accessibility" element={<AccessibilityStatement />} />,
  <Route key="sitemap" path="/sitemap" element={<Sitemap />} />
];

export default publicRoutes;
