// Shared UI primitives for the Intelligence OS dashboard

import { type LucideIcon } from 'lucide-react'
import { cn } from '@design-system/cn'

type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

const SEVERITY_RING: Record<Severity, string> = {
  CRITICAL: 'border-l-red-500',
  HIGH:     'border-l-orange-500',
  MEDIUM:   'border-l-amber-500',
  LOW:      'border-l-[var(--os-border)]',
}

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: 'text-red-500   bg-red-500/10',
  HIGH:     'text-orange-500 bg-orange-500/10',
  MEDIUM:   'text-amber-500  bg-amber-500/10',
  LOW:      'text-[var(--os-text-3)] bg-[var(--os-bg-2)]',
}

export function SignalCard({ severity, children }: { severity: string; children: React.ReactNode }) {
  const s = severity as Severity
  return (
    <div className={cn(
      'border border-[var(--os-border)] border-l-2 rounded-2xl px-4 py-3',
      SEVERITY_RING[s] ?? SEVERITY_RING.LOW,
    )}>
      {children}
    </div>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const s = severity as Severity
  const cls = SEVERITY_LABEL[s] ?? SEVERITY_LABEL.LOW
  return <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${cls}`}>{severity}</span>
}

export function SectionHeader({ icon: Icon, label, count }: { icon: LucideIcon; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-[var(--os-text-2)]" />
      <h3 className="text-sm font-semibold text-[var(--os-text-1)]">{label}</h3>
      <span className="text-xs text-[var(--os-text-3)] bg-[var(--os-bg-2)] px-1.5 py-0.5 rounded-full">{count}</span>
    </div>
  )
}

export function ProbBar({ value, invert = false }: { value: number; invert?: boolean }) {
  // value: 0–1. invert=true means low value = bad (e.g. renewal likelihood).
  const pct = Math.round(value * 100)
  const danger = invert ? value < 0.5 : value > 0.5
  const color = invert
    ? value < 0.3 ? 'bg-red-500' : value < 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
    : value > 0.7 ? 'bg-red-500' : value > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="w-full h-1.5 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
