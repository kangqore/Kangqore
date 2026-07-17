import { useState } from 'react'
import { Megaphone, Plus, X, TrendingUp, Users, DollarSign, Target, ChevronDown, ChevronUp } from 'lucide-react'
import { useMarketingStore } from '../store'
import type { Campaign, CampaignChannel, CampaignStatus } from '../types'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const RED    = '#ef4444'
const TEAL   = '#0d9488'
const SLATE  = '#6b7280'

const STATUS_CFG: Record<CampaignStatus, { label: string; color: string }> = {
  active:     { label: 'Active',     color: GREEN  },
  scheduled:  { label: 'Scheduled',  color: BLUE   },
  draft:      { label: 'Draft',      color: SLATE  },
  paused:     { label: 'Paused',     color: AMBER  },
  completed:  { label: 'Completed',  color: PURPLE },
}

const CHANNEL_CFG: Record<CampaignChannel, { label: string; emoji: string; color: string }> = {
  linkedin:     { label: 'LinkedIn',    emoji: 'in', color: '#0077b5' },
  email:        { label: 'Email',       emoji: '✉',  color: TEAL      },
  'paid-search':{ label: 'Paid Search', emoji: 'G',  color: '#ea4335' },
  content:      { label: 'Content',     emoji: '📝', color: PURPLE    },
  event:        { label: 'Event',       emoji: '🎤', color: AMBER     },
  partner:      { label: 'Partner',     emoji: '🤝', color: GREEN     },
  outbound:     { label: 'Outbound',    emoji: '📞', color: SLATE     },
}

const STATUSES: CampaignStatus[] = ['active', 'scheduled', 'draft', 'paused', 'completed']

const fmtK = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n.toLocaleString('en-IN')}`

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: color + '14', color, border: `1px solid ${color}28` }}>
      {label}
    </span>
  )
}

function CampaignCard({ c }: { c: Campaign }) {
  const [expanded, setExpanded] = useState(false)
  const sc = STATUS_CFG[c.status]
  const cc = CHANNEL_CFG[c.channel]
  const budgetPct = c.budget > 0 ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0
  const roiX = c.spent > 0 ? (c.revenue / c.spent).toFixed(1) : '—'

  return (
    <div style={{ background: 'var(--os-card)', border: `1px solid var(--os-border)`, borderLeft: `3px solid ${sc.color}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: cc.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: cc.color, flexShrink: 0 }}>
            {cc.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)', lineHeight: 1.3 }}>{c.name}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <PillBadge label={sc.label} color={sc.color} />
              <PillBadge label={cc.label} color={cc.color} />
              <span style={{ fontSize: 9, color: SLATE }}>{c.owner}</span>
            </div>
          </div>
        </div>

        {/* Budget bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: SLATE }}>Budget</span>
            <span style={{ fontSize: 10, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>
              {fmtK(c.spent)} / {fmtK(c.budget)} ({budgetPct}%)
            </span>
          </div>
          <div style={{ height: 5, background: 'var(--os-border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${budgetPct}%`, height: '100%', background: budgetPct > 90 ? RED : budgetPct > 70 ? AMBER : GREEN, borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { label: 'Leads', value: c.leads,         color: BLUE   },
            { label: 'MQLs',  value: c.mqls,           color: TEAL   },
            { label: 'SQLs',  value: c.sqls,           color: PURPLE },
            { label: 'ROI',   value: roiX + '×',       color: c.revenue > c.spent * 10 ? GREEN : AMBER },
          ].map(k => (
            <div key={k.label} style={{ background: k.color + '0a', borderRadius: 7, padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        {c.revenue > 0 && (
          <div style={{ marginTop: 10, background: GREEN + '0a', border: `1px solid ${GREEN}18`, borderRadius: 7, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: SLATE }}>Pipeline attributed</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: GREEN }}>{fmtK(c.revenue)}</span>
          </div>
        )}

        {/* Expand */}
        <button onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 700, color: SLATE }}>
          {expanded ? <><ChevronUp style={{ width: 10, height: 10 }} /> Less</> : <><ChevronDown style={{ width: 10, height: 10 }} /> Details</>}
        </button>

        {expanded && (
          <div style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--os-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)', lineHeight: 1.6, marginBottom: 8 }}>{c.description}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><span style={{ fontSize: 9, color: SLATE }}>Start:</span> <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{new Date(c.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span></div>
              {c.endDate && <div><span style={{ fontSize: 9, color: SLATE }}>End:</span> <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{new Date(c.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span></div>}
              <div><span style={{ fontSize: 9, color: SLATE }}>Impressions:</span> <span style={{ fontSize: 10, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{c.impressions.toLocaleString()}</span></div>
              <div><span style={{ fontSize: 9, color: SLATE }}>Clicks:</span> <span style={{ fontSize: 10, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{c.clicks.toLocaleString()}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {c.tags.map(t => <span key={t} style={{ fontSize: 8, padding: '1px 5px', borderRadius: 4, background: 'var(--os-surface-3)', color: SLATE }}>{t}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AddCampaignModal({ onAdd, onClose }: { onAdd: (c: Campaign) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', channel: 'content' as CampaignChannel, budget: '', description: '', owner: '', startDate: '' })
  function submit() {
    if (!form.name || !form.budget || !form.startDate) return
    onAdd({
      id: `c-${Date.now()}`,
      name: form.name, channel: form.channel, status: 'draft',
      startDate: form.startDate, budget: parseFloat(form.budget), spent: 0,
      impressions: 0, clicks: 0, leads: 0, mqls: 0, sqls: 0, revenue: 0,
      owner: form.owner || 'Marketing', description: form.description, tags: [],
    })
    onClose()
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--os-card)', border: `1px solid ${BLUE}44`, borderRadius: 14, padding: 22, width: 400, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>New Campaign</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: SLATE }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { key: 'name', placeholder: 'Campaign name *', type: 'text' },
            { key: 'budget', placeholder: 'Budget (₹) *', type: 'number' },
            { key: 'startDate', placeholder: 'Start date *', type: 'date' },
            { key: 'owner', placeholder: 'Owner', type: 'text' },
            { key: 'description', placeholder: 'Description', type: 'text' },
          ] as const).map(({ key, placeholder, type }) => (
            <input key={key} type={type} placeholder={placeholder}
              value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}
            />
          ))}
          <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value as CampaignChannel }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {(Object.keys(CHANNEL_CFG) as CampaignChannel[]).map(ch => <option key={ch} value={ch}>{CHANNEL_CFG[ch].label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={submit} style={{ flex: 1, background: BLUE, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Create Campaign
          </button>
          <button onClick={onClose} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '8px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export function CampaignsPage() {
  const { campaigns, hydrate, content, metrics } = useMarketingStore()
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  function addCampaign(c: Campaign) {
    hydrate({ campaigns: [...campaigns, c], content, metrics })
  }

  const filtered = filterStatus === 'all' ? campaigns : campaigns.filter(c => c.status === filterStatus)
  const totalSpend    = campaigns.reduce((s, c) => s + c.spent, 0)
  const totalMQLs     = campaigns.reduce((s, c) => s + c.mqls, 0)
  const totalPipeline = campaigns.reduce((s, c) => s + c.revenue, 0)
  const activeCnt     = campaigns.filter(c => c.status === 'active').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {showAdd && <AddCampaignModal onAdd={addCampaign} onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Campaigns</h2>
          <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>{campaigns.length} total · {activeCnt} active</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 13, height: 13 }} /> New Campaign
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Spend',       value: fmtK(totalSpend),    icon: DollarSign, col: RED    },
          { label: 'MQLs Generated',    value: String(totalMQLs),   icon: Users,      col: TEAL   },
          { label: 'Pipeline Value',    value: fmtK(totalPipeline), icon: TrendingUp, col: GREEN  },
          { label: 'Active Campaigns',  value: String(activeCnt),   icon: Megaphone,  col: BLUE   },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.col}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <k.icon style={{ width: 18, height: 18, color: k.col, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: SLATE }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: k.col, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {(['all', ...STATUSES] as const).map(s => {
          const active = filterStatus === s
          const col = s === 'all' ? BLUE : STATUS_CFG[s].color
          return (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              fontSize: 10, fontWeight: 700, padding: '4px 11px', borderRadius: 20,
              background: active ? col + '18' : 'var(--os-surface-3)',
              color: active ? col : SLATE,
              border: `1px solid ${active ? col + '40' : 'var(--os-border)'}`,
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {s === 'all' ? `All (${campaigns.length})` : `${STATUS_CFG[s].label} (${campaigns.filter(c => c.status === s).length})`}
            </button>
          )
        })}
      </div>

      {/* Campaign grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {filtered.map(c => <CampaignCard key={c.id} c={c} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: SLATE }}>
          <Megaphone style={{ width: 28, height: 28, margin: '0 auto 10px', display: 'block' }} />
          <p style={{ fontSize: 12 }}>No {filterStatus !== 'all' ? filterStatus : ''} campaigns</p>
        </div>
      )}
    </div>
  )
}
