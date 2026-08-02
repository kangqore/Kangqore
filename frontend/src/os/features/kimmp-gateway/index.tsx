import { Routes, Route } from 'react-router-dom'
import { GatewayExplorerPage } from './pages/GatewayExplorerPage'

export function KimmpGatewayModule() {
  return (
    <Routes>
      <Route index element={<GatewayExplorerPage />} />
    </Routes>
  )
}
