// Context Widget — Generation III Runtime
// Workspace compass: shows current workspace, WAANDA operational status, last sync.

import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const WORKSPACE_LABELS: Record<string, string> = {
  'wksp.personal':      'Personal',
  'wksp.executive':     'Executive',
  'wksp.revenue':       'Revenue',
  'wksp.operations':    'Operations',
  'wksp.intelligence':  'Intelligence',
  'wksp.platform':      'Platform',
  'wksp.collaboration': 'Collaboration',
  'wksp.governance':    'Governance',
  'wksp.ecosystem':     'Ecosystem',
}

const PHASE_COLOR: Record<string, string> = {
  OPERATIONAL: 'var(--os-success)',
  DEGRADED:    'var(--os-warning)',
  OFFLINE:     'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const breadcrumbs: any[]  = Array.isArray(viewModel.breadcrumbs) ? viewModel.breadcrumbs : []
  const phase: string       = viewModel.waandaPhase   ?? 'OBSERVE'
  const bootStatus: string  = viewModel.bootStatus    ?? 'OPERATIONAL'
  const confidence: number  = viewModel.confidence    ?? 0.9
  const lastSynced: any     = viewModel.lastSynced    ?? null

  const workspaceId    = breadcrumbs[1]?.id ?? ''
  const workspaceLabel = WORKSPACE_LABELS[workspaceId] ?? breadcrumbs[1]?.label ?? 'KEOS'
  const statusColor    = PHASE_COLOR[bootStatus] ?? 'var(--os-success)'
  const confPct        = Math.round(confidence * 100)

  const syncLabel = lastSynced
    ? `Synced ${new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Breadcrumb path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>KEOS</span>
        <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>›</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>{workspaceLabel}</span>
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{
          flex: 1, padding: '5px 8px', borderRadius: 6,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: statusColor, fontWeight: 600 }}>{bootStatus}</span>
        </div>
        <div style={{
          flex: 1, padding: '5px 8px', borderRadius: 6,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Confidence</span>
          <span style={{
            fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            color: confPct >= 80 ? 'var(--os-success)' : confPct >= 50 ? 'var(--os-warning)' : 'var(--os-danger)',
          }}>{confPct}%</span>
        </div>
      </div>

      {/* WAANDA phase + sync */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 10px', borderRadius: 6,
        background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
            background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-blue)22' }}>
            {phase}
          </span>
          <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>WAANDA</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{syncLabel}</span>
      </div>
    </div>
  )
}

export const ContextWidget = withWidgetContext(Core)
