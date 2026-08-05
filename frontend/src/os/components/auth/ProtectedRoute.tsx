import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/auth'
import type { UserRole } from '@store/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, syncFromWebsite } = useAuthStore()
  const location = useLocation()

  // Resolve the effective auth state. The Zustand store initialises once at
  // module-load time from localStorage. If the user logged in AFTER app init
  // (e.g. via the website's AuthContext which only writes to localStorage),
  // the store will still say isAuthenticated=false. We sync once on demand
  // before deciding to redirect so that a valid localStorage session is never
  // incorrectly rejected.
  let authenticated = isAuthenticated
  let effectiveUser = user

  if (!authenticated) {
    const synced = syncFromWebsite()
    if (synced) {
      const fresh = useAuthStore.getState()
      authenticated = fresh.isAuthenticated
      effectiveUser = fresh.user
    }
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && effectiveUser && !allowedRoles.includes(effectiveUser.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
