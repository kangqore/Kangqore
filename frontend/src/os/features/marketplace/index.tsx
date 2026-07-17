import { Routes, Route, Navigate } from 'react-router-dom'
import { MarketplacePage } from './pages/MarketplacePage'

export function MarketplaceModule() {
  return (
    <div className="admin-bento-theme max-w-[1400px] mx-auto p-6 space-y-6 min-h-screen">
      <Routes>
        <Route index element={<MarketplacePage />} />
        <Route path="*" element={<Navigate to="/kangqore-view/admin/marketplace" replace />} />
      </Routes>
    </div>
  )
}
