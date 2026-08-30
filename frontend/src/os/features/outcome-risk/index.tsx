import { Routes, Route, Navigate } from 'react-router-dom'
import { OutcomeRiskPage } from './pages/OutcomeRiskPage'

export function OutcomeRiskModule() {
  return (
    <Routes>
      <Route index element={<OutcomeRiskPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
