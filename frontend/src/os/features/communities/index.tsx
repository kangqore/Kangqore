import { Routes, Route, Navigate } from 'react-router-dom'
import { CommunitiesProPage } from './pages/CommunitiesProPage'

export function CommunitiesModule() {
  return (
    <Routes>
      <Route index element={<CommunitiesProPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  )
}
