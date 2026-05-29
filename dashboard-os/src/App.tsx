import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { OSLayout } from '@components/shell/OSLayout'
import { ProtectedRoute } from '@components/auth/ProtectedRoute'
import { LoginPage } from '@pages/auth/LoginPage'
import { SignupPage } from '@pages/auth/SignupPage'
import { PlaceholderPage } from '@pages/PlaceholderPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

const OS_MODULES = [
  'strategy', 'projects', 'resources', 'finance',
  'clients', 'partners', 'leads', 'investors',
  'careers', 'marketing', 'workflows', 'departments',
  'analytics', 'kimmp',
]

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected OS — requires authentication */}
          <Route
            path="/os"
            element={
              <ProtectedRoute>
                <OSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/os/strategy" replace />} />
            {OS_MODULES.map(mod => (
              <Route key={mod} path={mod} element={<PlaceholderPage />} />
            ))}
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
