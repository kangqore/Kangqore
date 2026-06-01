import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { OSLayout }       from '@components/shell/OSLayout'
import { ProtectedRoute } from '@components/auth/ProtectedRoute'
import { Spinner }        from '@design-system/components/Spinner'

// Public pages — loaded eagerly (small, always needed)
import { LoginPage }        from '@pages/auth/LoginPage'
import { SignupPage }       from '@pages/auth/SignupPage'
import { UnauthorizedPage } from '@pages/UnauthorizedPage'

// OS modules — lazy loaded per route (each becomes its own chunk)
const StrategyModule    = lazy(() => import('@features/strategy').then(m => ({ default: m.StrategyModule })))
const ProjectsModule    = lazy(() => import('@features/projects').then(m => ({ default: m.ProjectsModule })))
const ResourcesModule   = lazy(() => import('@features/resources').then(m => ({ default: m.ResourcesModule })))
const FinanceModule     = lazy(() => import('@features/finance').then(m => ({ default: m.FinanceModule })))
const ClientsModule     = lazy(() => import('@features/clients').then(m => ({ default: m.ClientsModule })))
const PartnersModule    = lazy(() => import('@features/partners').then(m => ({ default: m.PartnersModule })))
const LeadsModule       = lazy(() => import('@features/leads').then(m => ({ default: m.LeadsModule })))
const InvestorsModule   = lazy(() => import('@features/investors').then(m => ({ default: m.InvestorsModule })))
const DepartmentsModule = lazy(() => import('@features/departments').then(m => ({ default: m.DepartmentsModule })))
const WorkflowsModule   = lazy(() => import('@features/workflows').then(m => ({ default: m.WorkflowsModule })))
const MarketingModule   = lazy(() => import('@features/marketing').then(m => ({ default: m.MarketingModule })))
const CareersModule     = lazy(() => import('@features/careers').then(m => ({ default: m.CareersModule })))
const AnalyticsModule   = lazy(() => import('@features/analytics').then(m => ({ default: m.AnalyticsModule })))
const KIMMMModule       = lazy(() => import('@features/kimmp').then(m => ({ default: m.KIMMMModule })))

// Portals — lazy loaded (never needed by OS users)
const ClientPortal   = lazy(() => import('@portals/client').then(m => ({ default: m.ClientPortal })))
const PartnerPortal  = lazy(() => import('@portals/partner').then(m => ({ default: m.PartnerPortal })))
const InvestorPortal = lazy(() => import('@portals/investor').then(m => ({ default: m.InvestorPortal })))
const CareersPortal  = lazy(() => import('@portals/careers').then(m => ({ default: m.CareersPortal })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/login"  element={<LoginPage />}  />
            <Route path="/signup" element={<SignupPage />} />

            {/* Internal OS — ADMIN only */}
            <Route
              path="/os"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <OSLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/os/strategy" replace />} />

              {/* Phase 1 — Core Operations */}
              <Route path="strategy/*"    element={<StrategyModule />}    />
              <Route path="projects/*"    element={<ProjectsModule />}    />
              <Route path="resources/*"   element={<ResourcesModule />}   />
              <Route path="finance/*"     element={<FinanceModule />}     />

              {/* Phase 2 — CRM */}
              <Route path="clients/*"     element={<ClientsModule />}     />
              <Route path="partners/*"    element={<PartnersModule />}    />
              <Route path="leads/*"       element={<LeadsModule />}       />
              <Route path="investors/*"   element={<InvestorsModule />}   />

              {/* Phase 3 — Operations */}
              <Route path="departments/*" element={<DepartmentsModule />} />
              <Route path="workflows/*"   element={<WorkflowsModule />}   />
              <Route path="marketing/*"   element={<MarketingModule />}   />
              <Route path="careers/*"     element={<CareersModule />}     />

              {/* Phase 4 — Intelligence */}
              <Route path="analytics/*"   element={<AnalyticsModule />}   />
              <Route path="kimmp/*"       element={<KIMMMModule />}       />
            </Route>

            {/* Phase 5 — External Portals */}
            <Route
              path="/portal/client/*"
              element={
                <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                  <ClientPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/partner/*"
              element={
                <ProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
                  <PartnerPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/investor/*"
              element={
                <ProtectedRoute allowedRoles={['INVESTOR', 'ADMIN']}>
                  <InvestorPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/careers/*"
              element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER', 'ADMIN']}>
                  <CareersPortal />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/"  element={<Navigate to="/login" replace />} />
            <Route path="*"  element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
