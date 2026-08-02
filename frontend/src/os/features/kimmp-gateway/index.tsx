import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Radio, Wand2, Trophy } from 'lucide-react'
import { cn } from '@design-system/cn'
import { GatewayExplorerPage } from './pages/GatewayExplorerPage'
import { PromptRegistryStudioPage } from './pages/PromptRegistryStudioPage'
import { AipParityPage } from './pages/AipParityPage'

const TABS = [
  { path: 'explorer', label: 'Gateway',        icon: Radio },
  { path: 'prompts',  label: 'Prompt Registry', icon: Wand2 },
  { path: 'parity',   label: 'AIP Parity',      icon: Trophy },
]

export function KimmpGatewayModule() {
  return (
    <div>
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] mb-6">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={`/kangqore-view/admin/kimmp-gateway/${tab.path}`}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index          element={<Navigate to="explorer" replace />} />
        <Route path="explorer" element={<GatewayExplorerPage />}          />
        <Route path="prompts"  element={<PromptRegistryStudioPage />}     />
        <Route path="parity"   element={<AipParityPage />}                />
        <Route path="*"        element={<Navigate to="explorer" replace />} />
      </Routes>
    </div>
  )
}
