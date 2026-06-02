/**
 * PageTransition — wraps the main Outlet and fades+lifts on module-level
 * route changes (e.g. /os/leads → /os/strategy), but NOT on sub-route
 * changes within a module (e.g. /os/leads → /os/leads/123).
 *
 * Uses the first three path segments as the animation key so switching
 * /os/consultations → /os/strategy triggers the animation, but navigating
 * within consultations does not.
 */
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const { pathname } = useLocation()

  // Key on first three segments: /os/consultations or /portal/client
  const moduleKey = '/' + pathname.split('/').filter(Boolean).slice(0, 2).join('/')

  return (
    <motion.div
      key={moduleKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
