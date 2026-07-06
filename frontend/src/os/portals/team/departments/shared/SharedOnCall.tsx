import { useState } from 'react'
import { Phone, AlertTriangle, X, ChevronRight } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface OnCallMember {
  id:       string
  name:     string
  initials: string
  color:    string
  phone:    string
}

export interface EscalationTier {
  level: 'L1' | 'L2' | 'L3' | 'Manager'
  name:  string
  sla:   string
}

export interface RotationWeek {
  weekLabel: string
  primary:   string
  backup:    string
}

interface Props {
  config:    DeptConfig
  current:   OnCallMember
  backup:    OnCallMember
  rotationEnd: string
  tiers:     EscalationTier[]
  rotation:  RotationWeek[]
}

const TIER_COLOR = { L1: '#2564ea', L2: '#F59E0B', L3: '#F97316', Manager: '#EF4444' }

export function SharedOnCall({ config, current, backup, rotationEnd, tiers, rotation }: Props) {
  const [overrideModal, setOverrideModal] = useState(false)
  const [overrideName,  setOverrideName]  = useState('')
  const [paged,         setPaged]          = useState(false)
  const accent = config.accentColor

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Current on-call banner */}
      <div className="p-6 rounded-2xl border overflow-hidden relative"
        style={{ background: `${accent}10`, borderColor: `${accent}40` }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{ background: `${current.color}30`, color: current.color }}>
              {current.initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accent }}>Currently On-Call</p>
              <p className="text-xl font-bold text-white">{current.name}</p>
              <p className="text-sm text-[var(--os-text-2)] mt-0.5">{current.phone} · Rotation ends {rotationEnd}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {paged ? (
              <div className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-sm font-semibold text-emerald-400">
                Page sent ✓
              </div>
            ) : (
              <button
                onClick={() => setPaged(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: accent }}
              >
                <Phone className="w-4 h-4" /> Page Now
              </button>
            )}
            <button
              onClick={() => setOverrideModal(true)}
              className="text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors text-center"
            >
              Set emergency override
            </button>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-slate-900/30">
        <div className="w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center flex-shrink-0"
          style={{ background: `${backup.color}25`, color: backup.color }}>
          {backup.initials}
        </div>
        <div>
          <p className="text-xs text-[var(--os-text-2)]">Backup On-Call</p>
          <p className="text-sm font-semibold text-white">{backup.name} · {backup.phone}</p>
        </div>
        <span className="ml-auto text-xs text-[var(--os-text-2)]">Auto-pages if L1 unresponsive for 15 min</span>
      </div>

      {/* Escalation chain */}
      <div>
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Escalation Chain</p>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {tiers.map((tier, i) => (
            <div key={tier.level} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center text-center w-32">
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 text-xs font-bold"
                  style={{ borderColor: TIER_COLOR[tier.level], background: `${TIER_COLOR[tier.level]}18`, color: TIER_COLOR[tier.level] }}>
                  {tier.level}
                </div>
                <p className="text-xs font-semibold text-white leading-tight">{tier.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">Auto in {tier.sla}</p>
              </div>
              {i < tiers.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[var(--os-text-2)] mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6-week rotation */}
      <div>
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Rotation Schedule</p>
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Week', 'Primary', 'Backup'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rotation.map((row, i) => (
                <tr key={row.weekLabel} className="border-b border-white/[0.05] last:border-0"
                  style={i === 0 ? { background: `${accent}08` } : undefined}>
                  <td className="px-5 py-3 text-sm text-[var(--os-text-1)]">
                    {row.weekLabel}
                    {i === 0 && <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-md" style={{ background: `${accent}30`, color: accent }}>Current</span>}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-white">{row.primary}</td>
                  <td className="px-5 py-3 text-sm text-[var(--os-text-2)]">{row.backup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override modal */}
      {overrideModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setOverrideModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 rounded-2xl bg-[#0D1628] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <p className="text-sm font-bold text-white">Emergency Override</p>
              </div>
              <button onClick={() => setOverrideModal(false)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[var(--os-text-2)] mb-4">Override the current on-call assignment for the remainder of this rotation window.</p>
            <input
              value={overrideName}
              onChange={e => setOverrideName(e.target.value)}
              placeholder="Override name or contact…"
              className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[var(--os-text-2)] outline-none mb-4"
            />
            <button
              onClick={() => setOverrideModal(false)}
              disabled={!overrideName.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-30 transition-all"
            >
              Set Override
            </button>
          </div>
        </>
      )}
    </div>
  )
}
