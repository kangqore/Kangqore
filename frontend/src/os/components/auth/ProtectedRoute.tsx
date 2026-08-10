import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@store/auth'
import type { UserRole } from '@store/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, syncFromWebsite } = useAuthStore()
  const location = useLocation()

  // Sync the Zustand store from localStorage after mount — safe for React 18
  // Strict Mode and Zustand v5 because set() is called inside an effect, not
  // during the render phase. This handles the edge case where the website's
  // AuthContext wrote a session to localStorage AFTER the store was first
  // created (store initialises once at module-load time from localStorage).
  useEffect(() => {
    if (!isAuthenticated) syncFromWebsite()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determine the effective auth state synchronously so we never return null
  // (which would cause a blank-page flash). We read localStorage directly here
  // as a READ-only side-effect (no mutations) which is safe in concurrent mode.
  let authenticated = isAuthenticated
  let effectiveUser = user

  if (!authenticated) {
    try {
      const token = localStorage.getItem('token')
      const raw   = localStorage.getItem('user')
      if (token && raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.id && parsed?.role) {
          authenticated = true
          effectiveUser = parsed
        }
      }
    } catch { /* malformed localStorage — treat as unauthenticated */ }
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && effectiveUser && !allowedRoles.includes(effectiveUser.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
