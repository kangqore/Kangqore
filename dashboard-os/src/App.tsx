import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { OSLayout }        from '@components/shell/OSLayout'
import { ProtectedRoute }  from '@components/auth/ProtectedRoute'
import { LoginPage }       from '@pages/auth/LoginPage'
import { SignupPage }      from '@pages/auth/SignupPage'
import { StrategyModule }  from '@features/strategy'
import { ProjectsModule }  from '@features/projects'
import { ResourcesModule } from '@features/resources'
import { FinanceModule }   from '@features/finance'
import { ClientsModule }   from '@features/clients'
import { PartnersModule }  from '@features/partners'
import { LeadsModule }     from '@features/leads'
import { InvestorsModule } from '@features/investors'
import { DepartmentsModule } from '@features/departments'
import { WorkflowsModule }   from '@features/workflows'
import { MarketingModule }   from '@features/marketing'
import { CareersModule }     from '@features/careers'
import { AnalyticsModule }   from '@features/analytics'
import { KIMMMModule }       from '@features/kimmp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected OS */}
          <Route
            path="/os"
            element={
              <ProtectedRoute>
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

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
