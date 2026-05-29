import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { allNavItems } from '@lib/nav'

export function PlaceholderPage() {
  const location = useLocation()
  const module = allNavItems.find(item => location.pathname.startsWith(item.path))
  const Icon = module?.icon ?? Construction

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-sm w-full text-center p-10">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-8 h-8 text-purple-500" />
        </div>
        <Badge variant="warning" size="sm" dot className="mb-3">Coming in Phase 1</Badge>
        <h2 className="text-lg font-semibold text-slate-900">{module?.label ?? 'Module'}</h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          This module is being built. The OS shell and design system are live — module content arrives next.
        </p>
      </Card>
    </div>
  )
}
