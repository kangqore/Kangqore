import { Headset } from 'lucide-react'
import { SharedServiceCentre } from '../../shared/SharedServiceCentre'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['product']

export function ProductServiceCentre() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Headset className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Service Centre</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Submit and track Product requests — feature proposals, research sign-offs, roadmap input — powered by KIMMP.</p>
        </div>
      </div>
      <SharedServiceCentre config={cfg} />
    </div>
  )
}
