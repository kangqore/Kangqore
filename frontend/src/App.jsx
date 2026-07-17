// Frontend restart trigger: 2026-05-03T16:06:00
import React, { useState, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import CookieConsent from './components/CookieConsent';
import { Toaster } from './components/ui/toaster';
import GlobalAuthPrompt from './components/GlobalAuthPrompt';
import EROOT from './components/eROOT';


// Import modular routes
import { authRoutes, publicRoutes, industryRoutes, contentRoutes, serviceRoutes } from './routes';
import { legacyRedirectRoutes } from './routes/legacyRedirectRoutes';
// Import page components
import HomePage from './pages/HomePage';
import Services from './pages/Services';
import DynamicKangqorePage from './pages/DynamicKangqorePage';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import BookingCancelPage from './pages/BookingCancelPage';
import BookingReschedulePage from './pages/BookingReschedulePage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingPage from './pages/BookingPage';
const BidsRequestPage = React.lazy(() => import('./pages/BidsRequestPage'));
import './App.css';

const BIDSTataSteel = React.lazy(() => import('./pages/BIDSTataSteel'));
const HeroDemo = React.lazy(() => import('./pages/HeroDemo'));
const EQoreAIConsole = React.lazy(() => import('./pages/EQoreAIConsole'));

/**
 * Scroll to top on route change unless there is a hash anchor.
 * Uses multiple scroll passes to survive AnimatePresence mode="wait"
 * which delays new-page mount until the exit animation finishes (~300ms).
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    // Prevent the browser from restoring the previous scroll position
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Immediate scroll
    window.scrollTo(0, 0);

    // Re-scroll after the next paint (covers synchronous DOM updates)
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    // Re-scroll after exit animation (~300ms) and after enter starts
    const t1 = setTimeout(() => window.scrollTo(0, 0), 100);
    const t2 = setTimeout(() => window.scrollTo(0, 0), 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, hash]);

  return null;
};

/**
 * Layout Component with Header and Footer
 */
function MainLayout({ children, showFullMenu, setShowFullMenu, handleMenuClick }) {
  const location = useLocation();
  
  return (
    <>
      <Header onMenuClick={handleMenuClick} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <FloatingButtons showFullMenu={showFullMenu} setShowFullMenu={setShowFullMenu} />
      <CookieConsent />
    </>
  );
}

import useVisitorTracking from './hooks/useVisitorTracking';
import useVisitorIdentity from './hooks/useVisitorIdentity';
import useFootprintTracker from './hooks/useFootprintTracker';
import { usePresenceHeartbeat } from './hooks/usePresenceHeartbeat';
import { useProactiveEQORE } from './hooks/useProactiveEQORE';
import GlobalScrollAnimations from './components/GlobalScrollAnimations';
import WebVitalsReporter from './kangqore-vis/components/WebVitalsReporter';
import { kangqoreVisAdminRoutes } from './kangqore-vis';

// OS (dashboard) — lazy loaded per module
import { ProtectedRoute as OSProtectedRoute } from './os/components/auth/ProtectedRoute';
const OSBootstrap        = React.lazy(() => import('./os/OSBootstrap').then(m => ({ default: m.OSBootstrap })));
const OSLayout           = React.lazy(() => import('./os/components/shell/OSLayout').then(m => ({ default: m.OSLayout })));
const UnauthorizedPage   = React.lazy(() => import('./os/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
const StrategyModule     = React.lazy(() => import('./os/features/strategy').then(m => ({ default: m.StrategyModule })));
const ProjectsModule     = React.lazy(() => import('./os/features/projects').then(m => ({ default: m.ProjectsModule })));
const ResourcesModule    = React.lazy(() => import('./os/features/resources').then(m => ({ default: m.ResourcesModule })));
const FinanceModule      = React.lazy(() => import('./os/features/finance').then(m => ({ default: m.FinanceModule })));
const ConsultationsModule = React.lazy(() => import('./os/features/consultations').then(m => ({ default: m.ConsultationsModule })));
const DeliveryModule     = React.lazy(() => import('./os/features/delivery').then(m => ({ default: m.DeliveryModule })));
const GovernanceModule   = React.lazy(() => import('./os/features/governance').then(m => ({ default: m.GovernanceModule })));
const CommsModule        = React.lazy(() => import('./os/features/comms').then(m => ({ default: m.CommsModule })));
const VisitorsModule     = React.lazy(() => import('./os/features/visitors').then(m => ({ default: m.VisitorsModule })));
const ClientsModule      = React.lazy(() => import('./os/features/clients').then(m => ({ default: m.ClientsModule })));
const PartnersModule     = React.lazy(() => import('./os/features/partners').then(m => ({ default: m.PartnersModule })));
const LeadsModule        = React.lazy(() => import('./os/features/leads').then(m => ({ default: m.LeadsModule })));
const HRModule           = React.lazy(() => import('./os/features/hr').then(m => ({ default: m.HRModule })));
const InvestorsModule    = React.lazy(() => import('./os/features/investors').then(m => ({ default: m.InvestorsModule })));
const DepartmentsModule  = React.lazy(() => import('./os/features/departments').then(m => ({ default: m.DepartmentsModule })));
const WorkflowsModule    = React.lazy(() => import('./os/features/workflows').then(m => ({ default: m.WorkflowsModule })));
const MarketingModule    = React.lazy(() => import('./os/features/marketing').then(m => ({ default: m.MarketingModule })));
const CareersModule      = React.lazy(() => import('./os/features/careers').then(m => ({ default: m.CareersModule })));
const AnalyticsModule    = React.lazy(() => import('./os/features/analytics').then(m => ({ default: m.AnalyticsModule })));
const KIMMMModule        = React.lazy(() => import('./os/features/kangqore-immp').then(m => ({ default: m.KIMMMModule })));
const WaandaModule       = React.lazy(() => import('./os/features/waanda').then(m => ({ default: m.WaandaModule })));
const DashboardHome      = React.lazy(() => import('./os/features/overview').then(m => ({ default: m.DashboardHome })));
const AgentLogsModule    = React.lazy(() => import('./os/features/agent-logs').then(m => ({ default: m.AgentLogsModule })));
const SystemsModule      = React.lazy(() => import('./os/features/systems').then(m => ({ default: m.SystemsModule })));
const SettingsModule     = React.lazy(() => import('./os/features/settings').then(m => ({ default: m.SettingsModule })));
const SchedulingModule   = React.lazy(() => import('./os/features/scheduling').then(m => ({ default: m.SchedulingModule })));
const AegisModule        = React.lazy(() => import('./os/features/aegis').then(m => ({ default: m.AegisModule })));
const OntologyModule     = React.lazy(() => import('./os/features/ontology').then(m => ({ default: m.OntologyModule })));
const NeuralNetworkModule = React.lazy(() => import('./os/features/neural-network').then(m => ({ default: m.NeuralNetworkModule })));
const UrgiStudioModule    = React.lazy(() => import('./os/features/urgi-studio/RelationshipStudio'));
const BidsModule         = React.lazy(() => import('./os/features/bids').then(m => ({ default: m.BidsModule })));
const OpsCentreModule    = React.lazy(() => import('./os/features/ops-centre').then(m => ({ default: m.OpsCentreModule })));
const ClientPortal       = React.lazy(() => import('./os/portals/client').then(m => ({ default: m.ClientPortal })));
const PartnerPortal      = React.lazy(() => import('./os/portals/partner').then(m => ({ default: m.PartnerPortal })));
const InvestorPortal     = React.lazy(() => import('./os/portals/investor').then(m => ({ default: m.InvestorPortal })));
const CareersPortal      = React.lazy(() => import('./os/portals/careers').then(m => ({ default: m.CareersPortal })));
const JournalistPortal   = React.lazy(() => import('./os/portals/journalist').then(m => ({ default: m.JournalistPortal })));
const AnalystPortal      = React.lazy(() => import('./os/portals/analyst').then(m => ({ default: m.AnalystPortal })));
const TeamPortal         = React.lazy(() => import('./os/portals/team').then(m => ({ default: m.TeamPortal })));
const ExecutivePortal    = React.lazy(() => import('./os/portals/executive').then(m => ({ default: m.ExecutivePortal })));
const RelayPage          = React.lazy(() => import('./os/features/relay/pages/RelayPage').then(m => ({ default: m.default })));

/**
 * Loading Fallback
 */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      
      {/* Center Wrapper to guarantee rings and logo share the exact same center */}
      <div className="relative flex items-center justify-center w-28 h-28 mb-12 -mt-12 z-10">
        
        {/* Background Graphic Elements (Rings & Shapes) perfectly centered behind logo */}
        <div className="absolute flex items-center justify-center pointer-events-none">
          {/* Concentric rings */}
          <div className="absolute w-[180px] h-[180px] rounded-full border border-gray-200/80" />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-gray-200/60" />
          <div className="absolute w-[380px] h-[380px] rounded-full border border-gray-200/40" />
          <div className="absolute w-[480px] h-[480px] rounded-full border border-gray-100/50" />
          
          {/* Animated expanding ring for life */}
          <div className="absolute w-[180px] h-[180px] rounded-full border border-brand-blue/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

          {/* Floating Diamond (Rounded Square) relative to center */}
          <div className="absolute -top-[140px] -left-[160px] w-28 h-28 border-[1.5px] border-gray-200 rounded-[2rem] transform rotate-45 opacity-60 animate-[pulse_4s_ease-in-out_infinite]" />
          
          {/* Floating Triangle relative to center */}
          <div className="absolute -bottom-[160px] -right-[140px] w-0 h-0 
            border-l-[25px] border-l-transparent
            border-t-[45px] border-t-gray-200
            border-r-[25px] border-r-transparent
            opacity-50 animate-[pulse_5s_ease-in-out_infinite]" 
            style={{ transform: 'rotate(-15deg)' }} />
        </div>

        {/* Center Logo Avatar */}
        <div className="relative z-10 w-28 h-28 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(37,100,234,0.2)] border-[4px] border-white">
          <img
            src="/favicon.jpg"
            alt="Kangqore"
            className="w-full h-full object-cover transform scale-[1.15]"
          />
        </div>
      </div>

      {/* Brand text */}
      <div className="flex flex-col items-center gap-2 relative z-10">
        <p className="text-gray-900 dark:text-white font-extrabold text-2xl tracking-tight font-display">Kangqore</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

    </div>
  </div>
);

/**
 * Main App Content with Routing
 */
function AppContent() {
  useVisitorTracking();
  useVisitorIdentity();
  useFootprintTracker();
  usePresenceHeartbeat();
  useProactiveEQORE();
  const [showFullMenu, setShowFullMenu] = useState(false);
  
  const handleMenuClick = () => {
    setShowFullMenu(true);
  };

  return (
    <div className="App min-h-screen text-foreground parallax-container" style={{ backgroundColor: 'var(--page-bg)' }}>
      <GlobalScrollAnimations />
      <WebVitalsReporter />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Legacy URL redirects (76 entries) — MUST come first.
              In production, Express middleware intercepts these before the JS
              loads. This client-side fallback handles dev mode (CRA dev server)
              and any URL the server misses. */}
          {legacyRedirectRoutes}

          {/* Auth & Dashboard Routes (no Header/Footer) */}
          {authRoutes}
          <Route path="/eqore-ai" element={<EQoreAIConsole />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* OS — internal dashboard (ADMIN only) */}
          <Route
            path="/kangqore-view/admin"
            element={
              <OSProtectedRoute allowedRoles={['ADMIN']}>
                <OSLayout />
              </OSProtectedRoute>
            }
          >
            <Route index                   element={<Navigate to="home" replace />} />
            <Route path="home"             element={<DashboardHome />}       />
            <Route path="keos/*"           element={<OSBootstrap />}         />
            <Route path="WAANDA/*"         element={<WaandaModule />}        />
            <Route path="strategy/*"       element={<StrategyModule />}      />
            <Route path="projects/*"       element={<ProjectsModule />}      />
            <Route path="pmo/*"            element={<Navigate to="/kangqore-view/admin/projects" replace />} />
            <Route path="resources/*"      element={<ResourcesModule />}     />
            <Route path="finance/*"        element={<FinanceModule />}       />
            <Route path="consultations/*"  element={<ConsultationsModule />} />
            <Route path="delivery/*"       element={<DeliveryModule />}      />
            <Route path="governance/*"     element={<GovernanceModule />}    />
            <Route path="comms/*"          element={<CommsModule />}         />
            <Route path="visitors/*"       element={<VisitorsModule />}      />
            <Route path="clients/*"        element={<ClientsModule />}       />
            <Route path="partners/*"       element={<PartnersModule />}      />
            <Route path="leads/*"          element={<LeadsModule />}         />
            <Route path="hr/*"             element={<HRModule />}            />
            <Route path="investors/*"      element={<InvestorsModule />}     />
            <Route path="departments/*"    element={<DepartmentsModule />}   />
            <Route path="workflows/*"      element={<WorkflowsModule />}     />
            <Route path="marketing/*"      element={<MarketingModule />}     />
            <Route path="careers/*"        element={<CareersModule />}       />
            <Route path="analytics/*"      element={<AnalyticsModule />}     />
            <Route path="kangqore-immp/*"  element={<KIMMMModule />}         />
            <Route path="agent-logs"       element={<AgentLogsModule />}     />
            <Route path="systems/*"        element={<SystemsModule />}       />
            <Route path="scheduling/*"     element={<SchedulingModule />}    />
            <Route path="bids/*"           element={<BidsModule />}             />
            <Route path="ops-centre/*"     element={<OpsCentreModule />}        />
            <Route path="aegis/*"          element={<AegisModule />}            />
            <Route path="ontology/*"       element={<OntologyModule />}         />
            <Route path="neural-network/*" element={<NeuralNetworkModule />}    />
            <Route path="kangqore-urgi/*"    element={<UrgiStudioModule />}       />
            <Route path="settings/*"       element={<SettingsModule />}      />
            <Route path="relay/*"          element={<RelayPage />}           />
          </Route>

          {/* External portals */}
          <Route
            path="/kangqore-view/client/*"
            element={
              <OSProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                <ClientPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/partner/*"
            element={
              <OSProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
                <PartnerPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/investor/*"
            element={
              <OSProtectedRoute allowedRoles={['INVESTOR', 'ADMIN']}>
                <InvestorPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/careers/*"
            element={
              <OSProtectedRoute allowedRoles={['JOB_SEEKER', 'ADMIN']}>
                <CareersPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/journalist/*"
            element={
              <OSProtectedRoute allowedRoles={['JOURNALIST', 'ADMIN']}>
                <JournalistPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/analyst/*"
            element={
              <OSProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}>
                <AnalystPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/team/*"
            element={
              <OSProtectedRoute allowedRoles={['TEAM', 'ADMIN']}>
                <TeamPortal />
              </OSProtectedRoute>
            }
          />
          <Route
            path="/kangqore-view/executive/*"
            element={
              <OSProtectedRoute allowedRoles={['EXECUTIVE', 'ADMIN']}>
                <ExecutivePortal />
              </OSProtectedRoute>
            }
          />

          {/* BIDS™ self-serve request funnel — public, no header/footer */}
          <Route path="/bids-request" element={<BidsRequestPage />} />

          {/* Standalone document pages — no Header/Footer (optimised for print/PDF) */}
          <Route path="/bids/tata-steel" element={<BIDSTataSteel />} />
          <Route path="/demo/hero" element={<HeroDemo />} />

          {/* Public booking management — no header/footer, token-based */}
          <Route path="/schedule/:slug" element={<BookingPage />} />
          <Route path="/booking/:id" element={<BookingConfirmationPage />} />
          <Route path="/booking/cancel/:token" element={<BookingCancelPage />} />
          <Route path="/booking/reschedule/:token" element={<BookingReschedulePage />} />
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />

          {/* Services page - defined at top level to avoid nested routes issues */}
          <Route path="/services" element={
            <MainLayout 
              showFullMenu={showFullMenu} 
              setShowFullMenu={setShowFullMenu}
              handleMenuClick={handleMenuClick}
            >
              <Services />
            </MainLayout>
          } />

          {/* Main Routes with Header/Footer Layout */}
          <Route path="/*" element={
            <MainLayout 
              showFullMenu={showFullMenu} 
              setShowFullMenu={setShowFullMenu}
              handleMenuClick={handleMenuClick}
            >
              <Routes>
                {/* Homepage */}
                <Route path="/" element={<HomePage />} />
                
                {/* Public routes (About, Contact, etc.) */}
                {publicRoutes}
                
                {/* Industry routes */}
                {industryRoutes}
                
                {/* Content routes (Insights, Blogs, Case Studies, etc.) */}
                {contentRoutes}
                
                {/* Service routes (77 individual services) */}
                {serviceRoutes}

                {/* Admin routes retired 2026-06-18: handled by top-level legacyRedirectRoutes → OS */}

                {/* Kangqore Vis Admin Routes */}
                {kangqoreVisAdminRoutes}

                {/* Catch-all: resolve a KIMMP generated page, else NotFound. */}
                <Route path="*" element={<DynamicKangqorePage />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </Suspense>
      <Toaster />
      <InstallPrompt />
      <OfflineIndicator />
    </div>
  );
}

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './context/ThemeContext';
import { PodcastProvider } from './context/PodcastContext';
import PodcastMiniPlayer from './components/PodcastMiniPlayer';

/**
 * Root App Component
 * Wraps everything with Router and Auth Provider
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <GlobalAuthPrompt />
            <EROOT />
            <PodcastProvider>
              <AppContent />
              <PodcastMiniPlayer />
            </PodcastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
