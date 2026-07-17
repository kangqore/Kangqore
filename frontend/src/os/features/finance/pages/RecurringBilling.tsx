import { useState } from 'react'
import { Plus, X, Check, Calendar, RefreshCw, Pause, Play, AlertCircle } from 'lucide-react'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const RED    = '#ef4444'
const SLATE  = '#6b7280'
const TEAL   = '#0d9488'

type Cadence = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'
type BillingStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED'

const CADENCE_CFG: Record<Cadence, { label: string; intervalDays: number }> = {
  WEEKLY:    { label: 'Weekly',    intervalDays: 7   },
  MONTHLY:   { label: 'Monthly',  intervalDays: 30  },
  QUARTERLY: { label: 'Quarterly', intervalDays: 90 },
  ANNUALLY:  { label: 'Annually', intervalDays: 365 },
}

interface RecurringSchedule {
  id:           string
  clientName:   string
  description:  string
  amount:       number
  currency:     string
  cadence:      Cadence
  nextBillingAt: string
  status:       BillingStatus
  autoInvoice:  boolean
  createdAt:    string
  totalBilled:  number
  invoicesGenerated: number
}

const SEED: RecurringSchedule[] = [
  { id: 'rs1', clientName: 'Tata Consultancy Services', description: 'Monthly retainer — WAANDA Enterprise License', amount: 250000, currency: 'INR', cadence: 'MONTHLY', nextBillingAt: '2026-08-01', status: 'ACTIVE', autoInvoice: true, createdAt: '2026-01-01', totalBilled: 1750000, invoicesGenerated: 7 },
  { id: 'rs2', clientName: 'Infosys Limited',           description: 'Quarterly BIDS™ assessment + reporting',       amount: 175000, currency: 'INR', cadence: 'QUARTERLY', nextBillingAt: '2026-10-01', status: 'ACTIVE', autoInvoice: false, createdAt: '2026-04-01', totalBilled: 350000, invoicesGenerated: 2 },
  { id: 'rs3', clientName: 'Wipro Technologies',        description: 'Annual Kangqore OS platform subscription',     amount: 600000, currency: 'INR', cadence: 'ANNUALLY', nextBillingAt: '2027-01-15', status: 'ACTIVE', autoInvoice: true, createdAt: '2026-01-15', totalBilled: 600000, invoicesGenerated: 1 },
  { id: 'rs4', clientName: 'Mahindra Group',            description: 'Monthly PS delivery engagement',               amount: 180000, currency: 'INR', cadence: 'MONTHLY', nextBillingAt: '2026-08-05', status: 'PAUSED', autoInvoice: true, createdAt: '2026-03-01', totalBilled: 900000, invoicesGenerated: 5 },
]

const fmt = (n: number) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toLocaleString('en-IN')}`

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

function ScheduleRow({ s, onToggle }: { s: RecurringSchedule; onToggle: (id: string) => void }) {
  const isPaused = s.status === 'PAUSED'
  const days = daysUntil(s.nextBillingAt)
  const urgency = days <= 7 ? RED : days <= 14 ? AMBER : GREEN
  const statusColor = s.status === 'ACTIVE' ? GREEN : s.status === 'PAUSED' ? AMBER : RED

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 100px 100px 110px 80px 100px 80px',
      alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 56,
      opacity: isPaused ? 0.7 : 1,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{s.clientName}</div>
        <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>{s.description}</div>
        {s.autoInvoice && (
          <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: PURPLE + '12', color: PURPLE, marginTop: 4, display: 'inline-block' }}>
            AUTO-INVOICE
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(s.amount)}</div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: BLUE + '12', color: BLUE }}>
          {CADENCE_CFG[s.cadence].label}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: urgency }}>
          {days > 0 ? `${days}d` : 'Due today'}
        </div>
        <div style={{ fontSize: 9, color: SLATE }}>
          {new Date(s.nextBillingAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{fmt(s.totalBilled)}</div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: statusColor + '12', color: statusColor }}>
          {s.status}
        </span>
      </div>
      <div style={{ paddingRight: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => onToggle(s.id)} style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700,
          padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
          background: isPaused ? GREEN + '12' : AMBER + '12',
          color: isPaused ? GREEN : AMBER,
          border: `1px solid ${isPaused ? GREEN + '28' : AMBER + '28'}`,
        }}>
          {isPaused ? <><Play style={{ width: 9, height: 9 }} /> Resume</> : <><Pause style={{ width: 9, height: 9 }} /> Pause</>}
        </button>
      </div>
    </div>
  )
}

function AddScheduleModal({ onAdd, onClose }: { onAdd: (s: RecurringSchedule) => void; onClose: () => void }) {
  const [form, setForm] = useState({ clientName: '', description: '', amount: '', cadence: 'MONTHLY' as Cadence, nextBillingAt: '', autoInvoice: true })

  function submit() {
    if (!form.clientName || !form.amount || !form.nextBillingAt) return
    onAdd({
      id: `rs-${Date.now()}`, ...form,
      amount: parseFloat(form.amount), currency: 'INR', status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      totalBilled: 0, invoicesGenerated: 0,
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--os-card)', border: `1px solid ${BLUE}44`, borderRadius: 14, padding: 22, width: 400, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>New Recurring Schedule</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: SLATE }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'clientName', placeholder: 'Client Name *', type: 'text' },
            { key: 'description', placeholder: 'Description *', type: 'text' },
            { key: 'amount', placeholder: 'Amount (₹) *', type: 'number' },
            { key: 'nextBillingAt', placeholder: 'First Billing Date *', type: 'date' },
          ].map(({ key, placeholder, type }) => (
            <input key={key} type={type} placeholder={placeholder}
              value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}
            />
          ))}
          <select value={form.cadence} onChange={e => setForm(f => ({ ...f, cadence: e.target.value as Cadence }))}
            style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {(['WEEKLY','MONTHLY','QUARTERLY','ANNUALLY'] as Cadence[]).map(c => <option key={c} value={c}>{CADENCE_CFG[c].label}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--os-text-2)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.autoInvoice} onChange={e => setForm(f => ({ ...f, autoInvoice: e.target.checked }))} />
            Auto-generate invoice on billing date
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={submit} style={{ flex: 1, background: BLUE, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Check style={{ width: 12, height: 12 }} /> Create Schedule
          </button>
          <button onClick={onClose} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '8px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export function RecurringBilling() {
  const [schedules, setSchedules] = useState<RecurringSchedule[]>(SEED)
  const [showAdd, setShowAdd] = useState(false)

  function toggleSchedule(id: string) {
    setSchedules(ss => ss.map(s => s.id !== id ? s : { ...s, status: s.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' }))
  }

  const totalMRR = schedules
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => {
      const monthly = s.amount / (CADENCE_CFG[s.cadence].intervalDays / 30)
      return sum + monthly
    }, 0)

  const upcoming7d = schedules.filter(s => s.status === 'ACTIVE' && daysUntil(s.nextBillingAt) <= 7)
  const autoInvoiceCount = schedules.filter(s => s.status === 'ACTIVE' && s.autoInvoice).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {showAdd && <AddScheduleModal onAdd={s => setSchedules(ss => [...ss, s])} onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Recurring Billing</h2>
          <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>Automated billing schedules · auto-invoice on cycle</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 13, height: 13 }} /> New Schedule
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Monthly Recurring Revenue', value: fmt(totalMRR), col: GREEN  },
          { label: 'Active Schedules',           value: String(schedules.filter(s => s.status === 'ACTIVE').length), col: BLUE   },
          { label: 'Due in 7 Days',              value: String(upcoming7d.length), col: upcoming7d.length > 0 ? AMBER : SLATE },
          { label: 'Auto-Invoice Active',         value: String(autoInvoiceCount), col: PURPLE },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.col}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.col, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming alert */}
      {upcoming7d.length > 0 && (
        <div style={{ background: AMBER + '0c', border: `1px solid ${AMBER}25`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle style={{ width: 14, height: 14, color: AMBER, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: AMBER, fontWeight: 700 }}>
            {upcoming7d.length} billing{upcoming7d.length > 1 ? 's' : ''} due within 7 days — {upcoming7d.filter(s => s.autoInvoice).length} will auto-invoice
          </span>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 110px 80px 100px 80px', background: 'var(--os-surface-0)', padding: '10px 0', borderBottom: '1px solid var(--os-border)' }}>
          {['Client / Description', 'Amount', 'Cadence', 'Next Billing', 'Total Billed', 'Status', ''].map((h, i) => (
            <div key={i} style={{ padding: '0 14px 0 0', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-3)', paddingLeft: i === 0 ? 16 : 0 }}>{h}</div>
          ))}
        </div>
        {schedules.map(s => <ScheduleRow key={s.id} s={s} onToggle={toggleSchedule} />)}
        {schedules.length === 0 && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <RefreshCw style={{ width: 28, height: 28, color: SLATE, margin: '0 auto 10px', display: 'block' }} />
            <p style={{ fontSize: 12, color: SLATE }}>No recurring schedules yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
