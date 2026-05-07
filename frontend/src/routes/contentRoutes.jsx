import React from 'react';
import { Route } from 'react-router-dom';
// Insights pages
import Blogs from '../pages/Blogs';
import CaseStudiesPage from '../pages/CaseStudiesPage';
import Brochures from '../pages/Brochures';
import Events from '../pages/Events';
import WhitePaper from '../pages/WhitePaper';
import Insights from '../pages/Insights';
// Blog detail pages
import BlogDetails from '../pages/BlogDetails';
import FutureAiEnterprise from '../pages/blogs/FutureAiEnterprise';
import CloudMigrationBestPractices from '../pages/blogs/CloudMigrationBestPractices';
import CybersecurityTrends2025 from '../pages/blogs/CybersecurityTrends2025';
import DigitalTransformationRoi from '../pages/blogs/DigitalTransformationRoi';
import MicroservicesArchitectureGuide from '../pages/blogs/MicroservicesArchitectureGuide';
import DataAnalyticsDecisionMaking from '../pages/blogs/DataAnalyticsDecisionMaking';

// Case Study detail pages
// import GlobalBankTransformation from '../pages/case-studies/GlobalBankTransformation';
// ... dynamic routing used instead
// White Paper detail pages
import StateEnterpriseAi2025 from '../pages/white-papers/StateEnterpriseAi2025';
import CloudSecurityFramework from '../pages/white-papers/CloudSecurityFramework';
import DigitalTransformationRoadmap from '../pages/white-papers/DigitalTransformationRoadmap';
import FutureWorkReport from '../pages/white-papers/FutureWorkReport';
import DataAnalyticsMaturityModel from '../pages/white-papers/DataAnalyticsMaturityModel';
import MicroservicesBestPractices from '../pages/white-papers/MicroservicesBestPractices';
// Event detail pages
import AiSummit2025 from '../pages/events/AiSummit2025';
import CloudTransformationWorkshop from '../pages/events/CloudTransformationWorkshop';
import DigitalLeadersForum from '../pages/events/DigitalLeadersForum';
import CybersecurityMasterclass from '../pages/events/CybersecurityMasterclass';
import TechInnovationSummit2024 from '../pages/events/TechInnovationSummit2024';
import EnterpriseAiConference from '../pages/events/EnterpriseAiConference';
import CloudStrategyWorkshop from '../pages/events/CloudStrategyWorkshop';

export const contentRoutes = [
  // Main listing pages
  <Route key="insights" path="/insights" element={<Insights />} />,
  <Route key="blogs" path="/blogs" element={<Blogs />} />,
  <Route key="case-studies" path="/case-studies" element={<CaseStudiesPage />} />,
  <Route key="white-papers" path="/white-papers" element={<WhitePaper />} />,
  <Route key="events" path="/events" element={<Events />} />,
  <Route key="brochures" path="/brochures" element={<Brochures />} />,
  
  // Dynamic Content Routes
  <Route key="blog-dynamic" path="/blogs/:slug" element={<BlogDetails />} />,
  <Route key="case-study-dynamic" path="/case-studies/:slug" element={<BlogDetails />} />,
  <Route key="white-paper-dynamic" path="/white-papers/:slug" element={<BlogDetails />} />,
  <Route key="event-dynamic" path="/events/:slug" element={<BlogDetails />} />
];

export default contentRoutes;
