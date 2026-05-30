// Frontend restart trigger: 2026-05-03T16:06:00
import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import CookieConsent from './components/CookieConsent';
import { Toaster } from './components/ui/toaster';


// Import modular routes
import { authRoutes, publicRoutes, industryRoutes, contentRoutes, serviceRoutes } from './routes';
import { legacyRedirectRoutes } from './routes/legacyRedirectRoutes';
// Import page components
import HomePage from './pages/HomePage';
import Services from './pages/Services';
import DynamicKangqorePage from './pages/DynamicKangqorePage';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import EqoreLeadsPage from './pages/admin/EqoreLeadsPage';
import EqoreSalesPage from './pages/admin/EqoreSalesPage';
import AlisPage from './pages/admin/AlisPage';
import KimmpPagesPage from './pages/admin/KimmpPagesPage';
import EQoreAIConsole from './pages/EQoreAIConsole';
import BookingCancelPage from './pages/BookingCancelPage';
import BookingReschedulePage from './pages/BookingReschedulePage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingPage from './pages/BookingPage';
import './App.css';

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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
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
import GlobalScrollAnimations from './components/GlobalScrollAnimations';
import WebVitalsReporter from './kangqore-vis/components/WebVitalsReporter';

/**
 * Loading Fallback
 */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black relative overflow-hidden">
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
  const [showFullMenu, setShowFullMenu] = useState(false);
  
  const handleMenuClick = () => {
    setShowFullMenu(true);
  };

  return (
    <div className="App min-h-screen bg-background text-foreground parallax-container">
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

                {/* Admin eQORE Routes */}
                <Route path="/admin/eqore-leads" element={<EqoreLeadsPage />} />
                <Route path="/admin/eqore-sales" element={<EqoreSalesPage />} />
                <Route path="/admin/alis" element={<AlisPage />} />
                <Route path="/admin/kimmp-pages" element={<KimmpPagesPage />} />

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
        <ThemeProvider>
          <AuthProvider>
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
