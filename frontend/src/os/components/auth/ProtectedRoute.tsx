import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@store/auth'
import type { UserRole } from '@store/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, syncFromWebsite } = useAuthStore()
  const location = useLocation()

  // The Zustand store initialises once at module-load time from localStorage.
  // If the user logged in via the website's AuthContext after app init (i.e.
  // the AuthContext wrote to localStorage AFTER the store was first created),
  // the store still shows isAuthenticated=false. We sync from localStorage
  // inside a useEffect — never during render — to stay compatible with
  // React 18 Strict Mode and Zustand v5 (set() during render is disallowed).
  const [checked, setChecked] = useState(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      syncFromWebsite()
    }
    setChecked(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-sync the flag whenever the store updates
  useEffect(() => {
    if (isAuthenticated) setChecked(true)
  }, [isAuthenticated])

  // While the one-time sync hasn't run yet and the user appears unauthenticated,
  // render nothing to avoid a flash-redirect to /login on valid sessions.
  if (!checked && !isAuthenticated) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
