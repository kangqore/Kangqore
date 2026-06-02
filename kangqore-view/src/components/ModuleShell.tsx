import { Suspense, type ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Spinner } from '@design-system/components/Spinner'

function ModuleLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    </div>
  )
}

export function ModuleShell({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ModuleLoader />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
