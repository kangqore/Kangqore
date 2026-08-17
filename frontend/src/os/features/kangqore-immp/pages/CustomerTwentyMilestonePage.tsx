import { useQuery } from '@tanstack/react-query'
import { Trophy, Users, TrendingUp, Globe2, BarChart3, Star } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const PURP = '#7c3aed'
const BLUE = '#579bfc'

const FLEET: Array<{ num: number; label: string; industry: string; plan: string; ois: number; color: string }> = [
  { num: 0,  label: 'Customer Zero',      industry: 'Technology SaaS',           plan: 'ENTERPRISE', ois: 88.6,  color: '#7c3aed' },
  { num: 1,  label: 'Customer One',       industry: 'E-Commerce',                plan: 'PRO',        ois: 79.2,  color: '#3b82f6' },
  { num: 2,  label: 'Customer Two',       industry: 'Professional Services',     plan: 'STARTER',    ois: 68.4,  color: '#10b981' },
  { num: 3,  label: 'Customer Three',     industry: 'HealthTech',                plan: 'ENTERPRISE', ois: 81.1,  color: '#0d9488' },
  { num: 4,  label: 'Customer Four',      industry: 'Financial Services',        plan: 'PRO',        ois: 74.7,  color: '#f59e0b' },
  { num: 5,  label: 'Customer Five',      industry: 'Retail',                    plan: 'STARTER',    ois: 67.3,  color: '#ef4444' },
  { num: 6,  label: 'Customer Six',       industry: 'Healthcare',                plan: 'ENTERPRISE', ois: 82.5,  color: '#8b5cf6' },
  { num: 7,  label: 'Customer Seven',     industry: 'Manufacturing',             plan: 'PRO',        ois: 73.9,  color: '#d97706' },
  { num: 8,  label: 'Customer Eight',     industry: 'EdTech',                    plan: 'PRO',        ois: 76.1,  color: '#06b6d4' },
  { num: 9,  label: 'Customer Nine',      industry: 'Logistics & Supply Chain',  plan: 'ENTERPRISE', ois: 79.8,  color: '#84cc16' },
  { num: 10, label: 'Customer Ten 🏆',    industry: 'Government & Public Sector', plan: 'ENTERPRISE', ois: 83.2, color: '#7c3aed' },
  { num: 11, label: 'Customer Eleven',    industry: 'Legal Tech',                plan: 'ENTERPRISE', ois: 72.4,  color: '#0d9488' },
  { num: 12, label: 'Customer Twelve',    industry: 'PropTech',                  plan: 'PRO',        ois: 63.1,  color: '#f59e0b' },
  { num: 13, label: 'Customer Thirteen',  industry: 'AgriTech',                  plan: 'STARTER',    ois: 56.8,  color: '#10b981' },
  { num: 14, label: 'Customer Fourteen',  industry: 'Energy & Utilities',        plan: 'ENTERPRISE', ois: 71.2,  color: '#ef4444' },
  { num: 15, label: 'Customer Fifteen',   industry: 'Media & Entertainment',     plan: 'PRO',        ois: 65.9,  color: '#ec4899' },
  { num: 16, label: 'Customer Sixteen',   industry: 'CleanTech',                 plan: 'PRO',        ois: 61.4,  color: '#22c55e' },
  { num: 17, label: 'Customer Seventeen', industry: 'FinTech',                   plan: 'ENTERPRISE', ois: 76.8,  color: '#3b82f6' },
  { num: 18, label: 'Customer Eighteen',  industry: 'GovTech',                   plan: 'ENTERPRISE', ois: 70.3,  color: '#6366f1' },
  { num: 19, label: 'Customer Nineteen',  industry: 'Aerospace & Defence',       plan: 'ENTERPRISE', ois: 80.1,  color: '#64748b' },
  { num: 20, label: 'Customer Twenty 🎯', industry: 'Professional Services',     plan: 'PRO',        ois: 64.7,  color: '#7c3aed' },
]

export function CustomerTwentyMilestonePage() {
  const avgOIS       = Math.round(FLEET.reduce((s, c) => s + c.ois, 0) / FLEET.length * 10) / 10
  const enterprises  = FLEET.filter(c => c.plan === 'ENTERPRISE').length
  const pros         = FLEET.filter(c => c.plan === 'PRO').length
  const starters     = FLEET.filter(c => c.plan === 'STARTER').length
  const topPerformer = [...FLEET].sort((a, b) => b.ois - a.ois)[0]
  const industries   = new Set(FLEET.map(c => c.industry)).size

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Customer Twenty Milestone" />

      {/* Hero */}
      <div className="rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PURP}18, ${GRN}10)`, border: `2px solid ${PURP}40` }}>
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: T1 }}>
          Customer Twenty Reached
        </h1>
        <p className="text-base" style={{ color: T2 }}>
          Commercial chapter complete. 21 customers (C0–C20) across 20 industries, 3 plan tiers, and 4 deployment regions.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Trophy className="w-5 h-5" style={{ color: AMB }} />
          <span className="text-sm font-bold" style={{ color: AMB }}>Chapter 8 — Commercial milestone achieved</span>
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: 'Total Customers', v: '21 (C0–C20)', color: PURP, icon: Users },
          { l: 'Fleet Avg OIS', v: avgOIS, color: GRN, icon: TrendingUp },
          { l: 'Industries Covered', v: industries, color: BLUE, icon: Globe2 },
          { l: 'Enterprise Plans', v: enterprises, color: AMB, icon: Star },
        ].map(s => (
          <div key={s.l} className="rounded-2xl p-5 flex items-center gap-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${s.color}18` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: T2 }}>{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan distribution */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <p className="text-sm font-semibold" style={{ color: T1 }}>Plan Distribution</p>
        <div className="flex h-8 rounded-2xl overflow-hidden gap-0.5">
          <div style={{ flex: enterprises, background: PURP, opacity: 0.85 }} title={`Enterprise: ${enterprises}`} />
          <div style={{ flex: pros,        background: BLUE,  opacity: 0.85 }} title={`Pro: ${pros}`} />
          <div style={{ flex: starters,    background: GRN,   opacity: 0.85 }} title={`Starter: ${starters}`} />
        </div>
        <div className="flex gap-6">
          {[{ l: 'Enterprise', v: enterprises, c: PURP }, { l: 'Pro', v: pros, c: BLUE }, { l: 'Starter', v: starters, c: GRN }].map(x => (
            <div key={x.l} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} />
              <span className="text-xs font-semibold" style={{ color: T2 }}>{x.l}: {x.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OIS Heatmap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: T1 }}>Fleet OIS — All 21 Customers</p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold" style={{ color: GRN }}>Top: {topPerformer.label} ({topPerformer.ois})</span>
            <span className="text-xs font-semibold" style={{ color: BLUE }}>Fleet avg: {avgOIS}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {FLEET.map(c => {
            const oisColor = c.ois >= 80 ? GRN : c.ois >= 65 ? BLUE : AMB
            return (
              <div key={c.num} className="flex items-center gap-3 px-3 py-2 rounded-2xl"
                style={{ background: CARD, border: `1px solid ${BDR}` }}>
                <span className="text-xs font-black w-6 text-center font-variant-numeric" style={{ color: T2 }}>C{c.num}</span>
                <p className="text-xs font-medium w-36 truncate" style={{ color: T1 }}>{c.label}</p>
                <p className="text-[10px] flex-1 truncate" style={{ color: T2 }}>{c.industry}</p>
                <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: `${BDR}80` }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(c.ois / 100) * 100}%`, background: oisColor }} />
                </div>
                <span className="text-xs font-black w-10 text-right font-variant-numeric" style={{ color: oisColor }}>{c.ois}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full w-16 text-center"
                  style={{ background: `${c.color}18`, color: c.color }}>{c.plan}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* What's next */}
      <div className="rounded-2xl p-6 space-y-3" style={{ background: `${PURP}0a`, border: `1px solid ${PURP}25` }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PURP }}>What Comes Next</p>
        <p className="text-base font-black" style={{ color: T1 }}>Chapter 9 — Market Expansion & Ecosystem Scale</p>
        <p className="text-sm leading-relaxed" style={{ color: T2 }}>
          Platform v1.0 declared. The Chapter 9 roadmap covers vertical SaaS licensing (pre-configured industry editions), OEM white-label deployments through the partner network, international GTM across UK/EU/India (regions already live), and WAANDAx Gen4 foundation model training as corpus reaches threshold.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {['Vertical SaaS Licensing', 'OEM / White-label', 'International GTM', 'Gen4 Training'].map(chip => (
            <span key={chip} className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ background: `${PURP}18`, color: PURP, border: `1px solid ${PURP}25` }}>{chip}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
