import React from 'react';
import { Route } from 'react-router-dom';
const ContactUs = React.lazy(() => import('../pages/ContactUs'));
const CareersPage = React.lazy(() => import('../pages/CareersPage'));
const NewsPage = React.lazy(() => import('../pages/NewsPage'));
const CommunitiesPage = React.lazy(() => import('../pages/CommunitiesPage'));
const InvestorsPage = React.lazy(() => import('../pages/InvestorsPage'));
const DepartmentPage = React.lazy(() => import('../pages/DepartmentPage'));
// Phase C scaffolded these as placeholders; Phase D upgrades them to real templates.
// DepartmentsIndexPage.jsx was upgraded in-place (no robots noindex; real layout).
// DepartmentPage real template is DepartmentPageReal.jsx (placeholder file retired).
const DepartmentsIndexPage = React.lazy(() => import('../pages/DepartmentsIndexPage'));
const DepartmentPage6 = React.lazy(() => import('../pages/DepartmentPageReal'));
const BookingPage = React.lazy(() => import('../pages/BookingPage'));

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
const OurCulture = React.lazy(() => import('../pages/OurCulture'));
const BIDSPage = React.lazy(() => import('../pages/BIDSPage'));

// Trust & Governance — Overshadow Roadmap P1 ("Publish the Proof")
const TrustGovernancePage = React.lazy(() => import('../pages/TrustGovernancePage'));
const GovernanceNativeWhitepaperPage = React.lazy(() => import('../pages/GovernanceNativeWhitepaperPage'));

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
  // Scheduling pages
  <Route key="booking" path="/book/:slug" element={<BookingPage />} />,

  // BIDS™ page
  <Route key="bids" path="/bids" element={<BIDSPage />} />,

  // Trust & Governance — Overshadow Roadmap P1 ("Publish the Proof")
  <Route key="trust" path="/trust" element={<TrustGovernancePage />} />,
  <Route key="trust-whitepaper" path="/trust/governance-native-vs-retrofitted" element={<GovernanceNativeWhitepaperPage />} />,

  // General pages
  <Route key="contact" path="/contact" element={<ContactUs />} />,
  <Route key="careers" path="/careers" element={<CareersPage />} />,
  <Route key="news" path="/news" element={<NewsPage />} />,
  <Route key="communities" path="/communities" element={<CommunitiesPage />} />,
  <Route key="investors" path="/investors" element={<InvestorsPage />} />,
  <Route key="department" path="/department/:departmentSlug" element={<DepartmentPage />} />,

  // Phase D — canonical 6-department routes with real templates (replaces Phase C placeholders).
  <Route key="departments-index" path="/departments" element={<DepartmentsIndexPage />} />,
  <Route key="department-detail" path="/departments/:slug" element={<DepartmentPage6 />} />,
  
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
  <Route key="culture" path="/culture" element={<OurCulture />} />,

  // Legal & Compliance pages
  <Route key="privacy" path="/privacy" element={<PrivacyPolicy />} />,
  <Route key="terms" path="/terms" element={<TermsAndConditions />} />,
  <Route key="cookies" path="/cookies" element={<CookiePolicy />} />,
  <Route key="accessibility" path="/accessibility" element={<AccessibilityStatement />} />,
  <Route key="sitemap" path="/sitemap" element={<Sitemap />} />
];

export default publicRoutes;
