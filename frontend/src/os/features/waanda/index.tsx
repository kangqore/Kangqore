import { useLocation, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AdminOverview }  from '@features/overview'
import { ObservePage }    from './pages/ObservePage'
import { UnderstandPage } from './pages/UnderstandPage'
import { DecidePage }     from './pages/DecidePage'
import { ActPage }        from './pages/ActPage'
import { LearnPage }      from './pages/LearnPage'

const BASE = '/kangqore-view/admin/WAANDA'

export function WaandaModule() {
  const { pathname } = useLocation()
  const isHUD = pathname === BASE || pathname === `${BASE}/`

  // Root: full-immersive Arc HUD (OSLayout hides sidebar/topbar for this exact path)
  if (isHUD) return <AdminOverview />

  // Sub-routes: rendered inside the normal OS shell (sidebar nav handles navigation)
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="h-full"
      >
        <Routes>
          <Route path="observe"    element={<ObservePage />}    />
          <Route path="understand" element={<UnderstandPage />} />
          <Route path="decide"     element={<DecidePage />}     />
          <Route path="act"        element={<ActPage />}        />
          <Route path="learn"      element={<LearnPage />}      />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
