import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Plus, Shield } from 'lucide-react'
import { InlineSelect } from '@components/InlineSelect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useClientsStore } from '../store'
import type { SLAStatus } from '../types'

const SLA_STATUS_OPTIONS = [
  { value: 'met',      label: 'Met',      variant: 'success' as const },
  { value: 'at-risk',  label: 'At Risk',  variant: 'warning' as const },
  { value: 'breached', label: 'Breached', variant: 'danger'  as const },
]
const SLA_TREND_OPTIONS = [
  { value: 'up',     label: 'Up',     variant: 'success' as const },
  { value: 'stable', label: 'Stable', variant: 'neutral' as const },
  { value: 'down',   label: 'Down',   variant: 'danger'  as const },
]

const inputStyle = { background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }
const inputClass = 'w-full rounded-2xl px-3 py-2 text-[13px] text-[var(--os-text-1)] placeholder-slate-600 outline-none focus:ring-1 focus:ring-blue-500/40'
const EMPTY_SLA = { clientId: '', metric: '', target: '', current: '', unit: '%', period: 'Monthly', status: 'met' as const, trend: 'stable' as const }

function AddSLAModal({ clients, onClose }: { clients: { id: string; name: string }[]; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState(EMPTY_SLA)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/crm/slas', { ...form, target: Number(form.target), current: Number(form.current) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin','crm','slas'] }); onClose() },
  })
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-bold text-slate-100">Add SLA Metric</h3>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] text-lg leading-none">×</button>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Client *</label>
          <select required value={form.clientId} onChange={set('clientId')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
            <option value="">Select client…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Metric *</label>
          <input value={form.metric} onChange={set('metric')} placeholder="e.g. Uptime, Response Time" className={inputClass} style={inputStyle} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Target</label>
            <input type="number" value={form.target} onChange={set('target')} placeholder="99" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Current</label>
            <input type="number" value={form.current} onChange={set('current')} placeholder="97" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Unit</label>
            <input value={form.unit} onChange={set('unit')} placeholder="%" className={inputClass} style={inputStyle} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Period</label>
            <select value={form.period} onChange={set('period')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              {['Monthly','Quarterly','Weekly','Annual'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Status</label>
            <select value={form.status} onChange={set('status')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="met">Met</option>
              <option value="at-risk">At Risk</option>
              <option value="breached">Breached</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Trend</label>
            <select value={form.trend} onChange={set('trend')} className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="stable">Stable</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="px-3 py-1.5 text-[13px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending || !form.clientId || !form.metric}
            className="px-4 py-1.5 rounded-2xl text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            {isPending ? 'Saving…' : 'Add Metric'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SLADashboard() {
  const { clients, slaMetrics, updateSLA } = useClientsStore()

  function patchSLA(id: string, patch: Parameters<typeof updateSLA>[1]) {
    updateSLA(id, patch)
    api.patch(`/admin/crm/slas/${id}`, patch)
  }
  const [showAdd, setShowAdd] = useState(false)

  const met      = slaMetrics.filter(s => s.status === 'met').length
  const atRisk   = slaMetrics.filter(s => s.status === 'at-risk').length
  const breached = slaMetrics.filter(s => s.status === 'breached').length
  const compliance = slaMetrics.length > 0 ? Math.round((met / slaMetrics.length) * 100) : 0

  // Bar chart data: per-client SLA compliance
  const chartData = clients.map(c => {
    const clientSLAs = slaMetrics.filter(s => s.clientId === c.id)
    const metCount   = clientSLAs.filter(s => s.status === 'met').length
    return {
      name: c.name.split(' ')[0],
      Met:     metCount,
      'At Risk':   clientSLAs.filter(s => s.status === 'at-risk').length,
      Breached: clientSLAs.filter(s => s.status === 'breached').length,
    }
  }).filter(d => d.Met + d['At Risk'] + d.Breached > 0)

  return (
    <div className="space-y-6">
      {showAdd && <AddSLAModal clients={clients} onClose={() => setShowAdd(false)} />}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>SLA Dashboard</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">{slaMetrics.length} metrics across {clients.length} clients</p>
        </div>
        <div className="flex items-center gap-3">
          {slaMetrics.length > 0 && (
            <>
              <span className="text-2xl font-bold tracking-tight text-[var(--os-text-1)]">{compliance}%</span>
              <span className="text-sm text-[var(--os-text-2)]">overall compliance</span>
            </>
          )}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-2xl text-white text-[13px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            <Plus className="w-3.5 h-3.5" /> Add SLA
          </button>
        </div>
      </div>

      {slaMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Shield className="w-10 h-10 text-slate-800" />
          <p className="text-sm font-semibold text-[var(--os-text-2)]">No SLA metrics yet</p>
          <p className="text-xs text-[var(--os-text-2)] max-w-xs">Add your first SLA metric to start tracking compliance across clients.</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 h-8 px-4 rounded-2xl text-white text-[13px] font-semibold mt-2"
            style={{ background: 'linear-gradient(135deg, #2564ea, #0ea5e9)' }}>
            <Plus className="w-3.5 h-3.5" /> Add first SLA metric
          </button>
        </div>
      )}
      {slaMetrics.length > 0 && <>
      {/* Status chips */}
      <div className="flex items-center gap-3">
        {[
          { label: `${met} Met`,       color: 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)] border-transparent'   },
          { label: `${atRisk} At Risk`, color: 'bg-[#fdab3d] text-white shadow-[0_2px_8px_rgba(253,171,61,0.25)] border-transparent'  },
          { label: `${breached} Breached`, color: breached > 0 ? 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)] border-transparent' : 'bg-slate-200 text-[var(--os-text-1)] border-transparent' },
        ].map(c => (
          <span key={c.label} className={`text-sm font-bold px-4 py-2 rounded-2xl border ${c.color}`}>{c.label}</span>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Status by Client</CardTitle>
          <div className="flex items-center gap-4 text-xs text-[var(--os-text-2)]">
            {[{c:'bg-green-500',l:'Met'},{c:'bg-amber-400',l:'At Risk'},{c:'bg-red-400',l:'Breached'}].map(i=>(
              <span key={i.l} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-sm ${i.c}`}/>{i.l}</span>
            ))}
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={18} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Met"     fill="#22c55e" radius={[4,4,0,0]} stackId="a" />
            <Bar dataKey="At Risk" fill="#f59e0b" radius={[0,0,0,0]} stackId="a" />
            <Bar dataKey="Breached" fill="#ef4444" radius={[4,4,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-client SLA tables */}
      {clients.filter(c => slaMetrics.some(s => s.clientId === c.id)).map(client => {
        const cSLAs = slaMetrics.filter(s => s.clientId === client.id)
        const cBreached = cSLAs.filter(s => s.status === 'breached').length
        const cAtRisk   = cSLAs.filter(s => s.status === 'at-risk').length

        return (
          <Card key={client.id} padding="none">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-2xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{client.logo}</span>
                </div>
                <CardTitle>{client.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {cBreached > 0 && <Badge variant="danger" dot size="sm">{cBreached} breached</Badge>}
                {cAtRisk   > 0 && <Badge variant="warning" dot size="sm">{cAtRisk} at risk</Badge>}
                {cBreached === 0 && cAtRisk === 0 && <Badge variant="success" dot size="sm">all met</Badge>}
              </div>
            </CardHeader>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
                  {['Metric','Period','Target','Current','Trend','Status'].map(h=>(
                    <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {cSLAs.map(sla => {
                  const pct = Math.min(100, Math.round((sla.current / sla.target) * 100))
                  return (
                    <tr key={sla.id} className="hover:bg-[var(--os-surface-0)] transition-colors">
                      <td className="px-5 py-3 font-medium text-[var(--os-text-1)]">{sla.metric}</td>
                      <td className="px-5 py-3 text-xs text-[var(--os-text-2)]">{sla.period}</td>
                      <td className="px-5 py-3 text-[var(--os-text-2)]">{sla.target}{sla.unit}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} size="sm" color={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'} className="w-20" />
                          <span className="font-semibold text-[var(--os-text-1)]">{sla.current}{sla.unit}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <InlineSelect
                          value={sla.trend}
                          options={SLA_TREND_OPTIONS}
                          onChange={v => patchSLA(sla.id, { trend: v as typeof sla.trend })}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <InlineSelect
                          value={sla.status}
                          options={SLA_STATUS_OPTIONS}
                          onChange={v => patchSLA(sla.id, { status: v as SLAStatus })}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )
      })}
      </>}
    </div>
  )
}
