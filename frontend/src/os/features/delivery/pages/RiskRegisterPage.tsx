import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Search, Plus, ArrowUpCircle,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { StatCard } from '@design-system/components/StatCard'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { Divider } from '@design-system/components/Divider'
import { StaggerTableBody, StaggerRow } from '@components/animations/Stagger'
import { api, isDemo } from '@lib/api'
import { useDeliveryStore } from '../store'
import type { Risk, RiskStatus, RiskSeverity, RiskProbability, RiskImpact } from '../types'

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: RiskStatus; label: string; variant: 'danger' | 'warning' | 'info' | 'success' | 'neutral' }[] = [
  { value: 'OPEN',      label: 'Open',      variant: 'danger'  },
  { value: 'ESCALATED', label: 'Escalated', variant: 'warning' },
  { value: 'MITIGATED', label: 'Mitigated', variant: 'info'    },
  { value: 'ACCEPTED',  label: 'Accepted',  variant: 'neutral' },
  { value: 'CANCELLED', label: 'Cancelled', variant: 'neutral' },
]

const SEV_VARIANT: Record<RiskSeverity, 'danger' | 'warning' | 'info' | 'neutral'> = {
  CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'neutral',
}

const LEVEL_SCORE: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 }
const LEVEL_LABEL: Record<string, string> = { '1': 'Low', '2': 'Medium', '3': 'High', '4': 'Very High' }

function riskScore(r: Risk) {
  const p = LEVEL_SCORE[r.probability ?? 'LOW'] ?? 1
  const i = LEVEL_SCORE[r.impact ?? 'LOW'] ?? 1
  return p * i
}

function riskScoreVariant(score: number): 'danger' | 'warning' | 'info' | 'neutral' {
  if (score >= 12) return 'danger'
  if (score >= 6)  return 'warning'
  if (score >= 3)  return 'info'
  return 'neutral'
}

const TREND_ICON: Record<string, React.ReactNode> = {
  INCREASING: <TrendingUp   className="w-3.5 h-3.5 text-red-500"   />,
  STABLE:     <Minus         className="w-3.5 h-3.5 text-slate-500" />,
  DECREASING: <TrendingDown  className="w-3.5 h-3.5 text-green-500" />,
}

const STATUS_FILTERS: (RiskStatus | 'ALL' | 'ESCALATED')[] = ['ALL', 'OPEN', 'ESCALATED', 'MITIGATED', 'ACCEPTED']

// ─── risk detail drawer ───────────────────────────────────────────────────────

function RiskDrawer({
  risk,
  onPatch,
  onEscalate,
  onClose,
}: {
  risk: Risk
  onPatch: (id: string, data: Partial<Risk>) => void
  onEscalate: (id: string) => void
  onClose: () => void
}) {
  const [description,    setDescription]    = useState(risk.description ?? '')
  const [mitigation,     setMitigation]     = useState(risk.mitigationPlan ?? '')
  const [contingency,    setContingency]    = useState(risk.contingencyPlan ?? '')

  function save() {
    onPatch(risk.id, { description, mitigationPlan: mitigation, contingencyPlan: contingency })
    onClose()
  }

  const score   = riskScore(risk)
  const scoreV  = riskScoreVariant(score)

  return (
    <EditDrawer
      open
      onClose={onClose}
      title={risk.title}
      description={risk.project?.title}
      width="lg"
      footer={
        <>
          {risk.status === 'OPEN' && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowUpCircle className="w-3.5 h-3.5" />}
              onClick={() => { onEscalate(risk.id); onClose() }}
            >
              Escalate
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={save}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Status + Score */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Status</p>
            <InlineSelect
              value={risk.status}
              options={STATUS_OPTIONS}
              onChange={status => onPatch(risk.id, { status })}
              size="md"
              dot
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Severity</p>
            <Badge variant={SEV_VARIANT[risk.severity]} size="md">{risk.severity}</Badge>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Risk score</p>
            <Badge variant={scoreV} size="md">
              {score}/16 · {LEVEL_LABEL[String(Math.min(4, Math.ceil(score / 4)))] ?? 'High'}
            </Badge>
          </div>
          {risk.trend && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Trend</p>
              <div className="flex items-center gap-1.5">
                {TREND_ICON[risk.trend]}
                <span className="text-xs text-slate-500 capitalize">{risk.trend.toLowerCase()}</span>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* P × I */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Probability</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{risk.probability?.toLowerCase() ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Impact</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{risk.impact?.toLowerCase() ?? '—'}</p>
          </div>
          {risk.owner && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Owner</p>
              <p className="text-sm font-medium text-slate-300">{risk.owner}</p>
            </div>
          )}
          {risk.riskOwner && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Risk domain</p>
              <p className="text-sm font-medium text-slate-300 capitalize">{risk.riskOwner?.toLowerCase().replace(/_/g, ' ')}</p>
            </div>
          )}
        </div>

        <Divider />

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the risk…"
          />
        </div>

        {/* Mitigation */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Mitigation plan</label>
          <Textarea
            value={mitigation}
            onChange={e => setMitigation(e.target.value)}
            rows={3}
            placeholder="How will we reduce the likelihood or impact?"
          />
        </div>

        {/* Contingency */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Contingency plan</label>
          <Textarea
            value={contingency}
            onChange={e => setContingency(e.target.value)}
            rows={2}
            placeholder="If the risk materialises, what do we do?"
          />
        </div>

        {/* Client acceptance */}
        {risk.clientAcceptedBy && (
          <>
            <Divider />
            <div className="p-3 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-l-4 border-l-[#00c875] border-y border-r border-white/10 border-t-white/20 rounded-xl">
              <p className="text-xs text-slate-750 font-semibold">
                Accepted by {risk.clientAcceptedBy}
                {risk.clientAcceptedAt && ` on ${new Date(risk.clientAcceptedAt).toLocaleDateString('en-GB')}`}
              </p>
              {risk.clientResponse && (
                <p className="text-xs text-slate-500 mt-1">{risk.clientResponse}</p>
              )}
            </div>
          </>
        )}
      </div>
    </EditDrawer>
  )
}

// ─── add risk drawer ──────────────────────────────────────────────────────────

const EMPTY: Partial<Risk> = {
  title: '', severity: 'MEDIUM', status: 'OPEN',
  probability: 'MEDIUM', impact: 'MEDIUM', trend: 'STABLE',
}

function AddRiskDrawer({ onAdd, onClose }: { onAdd: (r: Partial<Risk>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...EMPTY })
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  function submit() {
    if (!form.title?.trim()) return
    onAdd(form)
    onClose()
  }

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Log new risk"
      width="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={submit}>Log risk</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Risk title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Describe the risk in one line" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Severity</label>
            <select value={form.severity} onChange={e => set('severity', e.target.value)}
              className="w-full border border-white/10 border-t-white/20 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              {(['LOW','MEDIUM','HIGH','CRITICAL'] as RiskSeverity[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Probability</label>
            <select value={form.probability} onChange={e => set('probability', e.target.value)}
              className="w-full border border-white/10 border-t-white/20 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              {(['LOW','MEDIUM','HIGH','CRITICAL'] as RiskProbability[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Impact</label>
            <select value={form.impact} onChange={e => set('impact', e.target.value)}
              className="w-full border border-white/10 border-t-white/20 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              {(['LOW','MEDIUM','HIGH','CRITICAL'] as RiskImpact[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Trend</label>
            <select value={form.trend} onChange={e => set('trend', e.target.value)}
              className="w-full border border-white/10 border-t-white/20 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              <option value="STABLE">Stable</option>
              <option value="INCREASING">Increasing</option>
              <option value="DECREASING">Decreasing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Owner</label>
          <Input value={form.owner ?? ''} onChange={e => set('owner', e.target.value)} placeholder="Who owns this risk?" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
          <Textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={3} placeholder="Full risk description" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mitigation plan</label>
          <Textarea value={form.mitigationPlan ?? ''} onChange={e => set('mitigationPlan', e.target.value)} rows={2} placeholder="How will we mitigate this?" />
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── 4×4 matrix ──────────────────────────────────────────────────────────────

function ImpactMatrix({ risks }: { risks: Risk[] }) {
  const LEVELS: Array<RiskProbability> = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  const IMPACTS: Array<RiskImpact>     = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const countAt = (prob: string, imp: string) =>
    risks.filter(r => r.probability === prob && r.impact === imp && r.status !== 'CANCELLED').length

  const cellColor = (p: string, i: string) => {
    const s = LEVEL_SCORE[p] * LEVEL_SCORE[i]
    if (s >= 12) return 'bg-[#e2445c] text-white border-transparent shadow-[0_2px_8px_rgba(226,68,92,0.25)]'
    if (s >= 6)  return 'bg-[#fdab3d] text-white border-transparent shadow-[0_2px_8px_rgba(253,171,61,0.25)]'
    if (s >= 3)  return 'bg-[#0073ea] text-white border-transparent shadow-[0_2px_8px_rgba(0,115,234,0.25)]'
    return 'bg-[#00c875] text-white border-transparent shadow-[0_2px_8px_rgba(0,200,117,0.25)]'
  }

  return (
    <Card>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Probability × Impact matrix</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left text-slate-500 pr-2 pb-2 font-medium w-20">Probability ↓</th>
              {IMPACTS.map(i => (
                <th key={i} className="pb-2 text-center font-semibold text-slate-500 capitalize px-2">{i.toLowerCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEVELS.map(prob => (
              <tr key={prob}>
                <td className="py-1.5 pr-2 font-semibold text-slate-500 capitalize">{prob.toLowerCase()}</td>
                {IMPACTS.map(imp => {
                  const count = countAt(prob, imp)
                  return (
                    <td key={imp} className="py-1.5 px-2">
                      <div className={`rounded-lg border h-10 flex items-center justify-center font-bold transition-all ${cellColor(prob, imp)}`}>
                        {count > 0 ? count : <span className="opacity-30">·</span>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-4 mt-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#e2445c] shadow-[0_2px_6px_rgba(226,68,92,0.25)] inline-block" /> Critical (≥12)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#fdab3d] shadow-[0_2px_6px_rgba(253,171,61,0.25)] inline-block" /> High (6–11)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#0073ea] shadow-[0_2px_6px_rgba(0,115,234,0.25)] inline-block" /> Medium (3–5)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#00c875] shadow-[0_2px_6px_rgba(0,200,117,0.25)] inline-block" /> Low (1–2)</span>
        </div>
      </div>
    </Card>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export function RiskRegisterPage() {
  const { risks, updateRisk, addRisk } = useDeliveryStore()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<RiskStatus | 'ALL'>('ALL')
  const [search,       setSearch]       = useState('')
  const [openId,       setOpenId]       = useState<string | null>(null)
  const [showAddForm,  setShowAddForm]  = useState(false)

  const openRisk = risks.find(r => r.id === openId)

  const { mutate: patchRisk } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Risk> }) => {
      if (!isDemo()) await api.patch(`/risks/${id}`, data)
    },
    onSuccess: (_, { id, data }) => {
      updateRisk(id, data)
      queryClient.invalidateQueries({ queryKey: ['risks'] })
    },
  })

  const { mutate: escalateRisk } = useMutation({
    mutationFn: async (id: string) => {
      if (!isDemo()) await api.post(`/risks/${id}/escalate`, {})
    },
    onSuccess: (_, id) => {
      updateRisk(id, { status: 'ESCALATED' })
      queryClient.invalidateQueries({ queryKey: ['risks'] })
    },
  })

  const { mutate: createRisk } = useMutation({
    mutationFn: (data: Partial<Risk>) =>
      (isDemo() ? Promise.resolve({ data: { id: `r${Date.now()}` } }) : api.post('/risks', data)) as Promise<{ data: { id: string } }>,
    onSuccess: (res, data) => {
      const id = (res as any)?.data?.id ?? `r${Date.now()}`
      addRisk({ ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Risk)
      queryClient.invalidateQueries({ queryKey: ['risks'] })
    },
  })

  function onPatch(id: string, data: Partial<Risk>) {
    updateRisk(id, data)
    patchRisk({ id, data })
  }

  const visible = risks.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q
      || r.title.toLowerCase().includes(q)
      || (r.owner ?? '').toLowerCase().includes(q)
      || (r.project?.title ?? '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const byStatus = (s: RiskStatus) => risks.filter(r => r.status === s).length
  const escalated = byStatus('ESCALATED')

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Risks" />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Risk Register</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {risks.length} risks · {byStatus('OPEN')} open
            {escalated > 0 && <span className="ml-2 text-red-600 font-medium">{escalated} escalated</span>}
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddForm(true)}>
          Log risk
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total"     value={risks.length}         icon={<Shield       className="w-5 h-5" />} iconColor="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300"     />
        <StatCard label="Open"      value={byStatus('OPEN')}     icon={<AlertTriangle className="w-5 h-5" />} iconColor={byStatus('OPEN') > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'}      />
        <StatCard label="Escalated" value={escalated}            icon={<ArrowUpCircle className="w-5 h-5" />} iconColor={escalated > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'} />
        <StatCard label="Mitigated" value={byStatus('MITIGATED')}icon={<Shield       className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"        />
        <StatCard label="Accepted"  value={byStatus('ACCEPTED')} icon={<Shield       className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"      />
      </div>

      {/* Matrix */}
      <ImpactMatrix risks={risks} />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search risks…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as RiskStatus | 'ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-os-blue text-white'
                  : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 text-slate-300 hover:border-blue-300'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">{visible.length} risks</span>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 border-t-white/20 bg-slate-900">
              {['Risk', 'Project', 'P×I Score', 'Severity', 'Trend', 'Owner', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <StaggerTableBody className="divide-y divide-[#2E2854]">
            {visible.map(r => {
              const score = riskScore(r)
              const scoreV = riskScoreVariant(score)
              return (
                <StaggerRow
                  key={r.id}
                  className="hover:bg-slate-900 transition-colors cursor-pointer group"
                  onClick={() => setOpenId(r.id)}
                >
                  <td className="px-4 py-3.5 max-w-[240px]">
                    <p className="font-medium text-white text-xs leading-snug line-clamp-2">{r.title}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {r.project?.title ?? '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={scoreV} size="sm">{score}/16</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={SEV_VARIANT[r.severity]} size="sm">{r.severity}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {TREND_ICON[r.trend ?? 'STABLE']}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{r.owner ?? '—'}</td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <InlineSelect
                      value={r.status}
                      options={STATUS_OPTIONS}
                      onChange={status => onPatch(r.id, { status })}
                      dot
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    {r.status === 'OPEN' && (
                      <button
                        onClick={e => { e.stopPropagation(); escalateRisk(r.id) }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-amber-600 font-semibold hover:text-amber-700"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" /> Escalate
                      </button>
                    )}
                  </td>
                </StaggerRow>
              )
            })}
          </StaggerTableBody>
        </table>
        {visible.length === 0 && (
          <div className="py-14 text-center text-sm text-slate-500">No risks match your filters.</div>
        )}
      </Card>

      {/* Detail drawer */}
      {openRisk && (
        <RiskDrawer
          risk={openRisk}
          onPatch={onPatch}
          onEscalate={id => { escalateRisk(id); updateRisk(id, { status: 'ESCALATED' }) }}
          onClose={() => setOpenId(null)}
        />
      )}

      {/* Add risk drawer */}
      {showAddForm && (
        <AddRiskDrawer
          onAdd={data => createRisk(data)}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
