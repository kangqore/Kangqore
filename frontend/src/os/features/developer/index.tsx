import { Routes, Route, Navigate } from 'react-router-dom'
import { DeveloperPortalPage } from './pages/DeveloperPortalPage'

export function DeveloperModule() {
  return (
    <div className="admin-bento-theme max-w-[1400px] mx-auto p-6 space-y-6 min-h-screen">
      <Routes>
        <Route index element={<DeveloperPortalPage />} />
        <Route path="*" element={<Navigate to="/kangqore-view/admin/developer" replace />} />
      </Routes>
    </div>
  )
}
