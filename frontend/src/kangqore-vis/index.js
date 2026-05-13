import React from 'react';
import { Route } from 'react-router-dom';

const Overview = React.lazy(() => import('./pages/admin/Overview'));
const Blueprints = React.lazy(() => import('./pages/admin/Blueprints'));
const HubSpoke = React.lazy(() => import('./pages/admin/HubSpoke'));
const Schemas = React.lazy(() => import('./pages/admin/Schemas'));
const Entities = React.lazy(() => import('./pages/admin/Entities'));
const FaqBank = React.lazy(() => import('./pages/admin/FaqBank'));
const Concierge = React.lazy(() => import('./pages/admin/Concierge'));
const Governance = React.lazy(() => import('./pages/admin/Governance'));
const Performance = React.lazy(() => import('./pages/admin/Performance'));
const Authority = React.lazy(() => import('./pages/admin/Authority'));
const Backlinks = React.lazy(() => import('./pages/admin/Backlinks'));
const Sources = React.lazy(() => import('./pages/admin/Sources'));

export const kangqoreVisAdminRoutes = [
  <Route key="kvis-overview" path="/admin/kangqore-vis/overview" element={<Overview />} />,
  <Route key="kvis-blueprints" path="/admin/kangqore-vis/blueprints" element={<Blueprints />} />,
  <Route key="kvis-hub-spoke" path="/admin/kangqore-vis/hub-spoke" element={<HubSpoke />} />,
  <Route key="kvis-schemas" path="/admin/kangqore-vis/schemas" element={<Schemas />} />,
  <Route key="kvis-entities" path="/admin/kangqore-vis/entities" element={<Entities />} />,
  <Route key="kvis-faqs" path="/admin/kangqore-vis/faqs" element={<FaqBank />} />,
  <Route key="kvis-concierge" path="/admin/kangqore-vis/concierge" element={<Concierge />} />,
  <Route key="kvis-governance" path="/admin/kangqore-vis/governance" element={<Governance />} />,
  <Route key="kvis-performance" path="/admin/kangqore-vis/performance" element={<Performance />} />,
  <Route key="kvis-authority" path="/admin/kangqore-vis/authority" element={<Authority />} />,
  <Route key="kvis-backlinks" path="/admin/kangqore-vis/backlinks" element={<Backlinks />} />,
  <Route key="kvis-sources" path="/admin/kangqore-vis/sources" element={<Sources />} />,
];

export { default as KangqoreVisSEO } from './components/KangqoreVisSEO';
export { default as SchemaInjector } from './components/SchemaInjector';
export { default as BreadcrumbTrail } from './components/BreadcrumbTrail';
export { default as InternalLinkBlock } from './components/InternalLinkBlock';
export { default as FaqBlock } from './components/FaqBlock';
export { default as CtaButton } from './components/CtaButton';
export { default as WebVitalsReporter } from './components/WebVitalsReporter';
export { default as EntityBadge } from './components/EntityBadge';
export { useKangqoreVisPage } from './hooks/useKangqoreVisPage';
export { useWebVitals } from './hooks/useWebVitals';
export { useEntity } from './hooks/useEntity';
