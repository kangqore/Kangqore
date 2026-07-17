import { useState, useMemo } from 'react'
import { Plus, Search, X, Check, ChevronDown, ChevronUp, Briefcase, User, Calendar, Star, Mail, Phone } from 'lucide-react'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const RED    = '#ef4444'
const SLATE  = '#6b7280'
const GOLD   = '#fbbf24'

const STAGES = ['SOURCING', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const
type Stage = typeof STAGES[number]

const STAGE_CFG: Record<Stage, { color: string; label: string }> = {
  SOURCING:  { color: SLATE,  label: 'Sourcing'  },
  SCREENING: { color: BLUE,   label: 'Screening' },
  INTERVIEW: { color: AMBER,  label: 'Interview' },
  OFFER:     { color: PURPLE, label: 'Offer'     },
  HIRED:     { color: GREEN,  label: 'Hired'     },
  REJECTED:  { color: RED,    label: 'Rejected'  },
}

const DEPARTMENTS = ['Engineering', 'Design', 'Finance', 'Sales', 'Delivery', 'HR', 'Marketing', 'Leadership']

interface Candidate {
  id: string
  name: string
  role: string
  department: string
  stage: Stage
  source: string
  appliedAt: string
  score: number
  email: string
  phone?: string
  notes?: string
  interviewDate?: string
  salary?: string
}

const SEED: Candidate[] = [
  { id: 'c1', name: 'Priya Sharma',     role: 'Senior Full-Stack Engineer',    department: 'Engineering', stage: 'INTERVIEW', source: 'LinkedIn',    appliedAt: '2026-07-01', score: 88, email: 'priya.sharma@gmail.com',  interviewDate: '2026-07-20', salary: '₹22L' },
  { id: 'c2', name: 'Arun Krishnan',    role: 'Product Manager',               department: 'Delivery',    stage: 'OFFER',     source: 'Referral',    appliedAt: '2026-06-28', score: 92, email: 'arun.k@outlook.com',       salary: '₹18L' },
  { id: 'c3', name: 'Meera Nair',       role: 'UI/UX Designer',                department: 'Design',      stage: 'SCREENING', source: 'Dribbble',    appliedAt: '2026-07-05', score: 79, email: 'meera.nair@gmail.com' },
  { id: 'c4', name: 'Rohit Verma',      role: 'Sales Executive',               department: 'Sales',       stage: 'SOURCING',  source: 'LinkedIn',    appliedAt: '2026-07-10', score: 65, email: 'rohit.v@yahoo.com' },
  { id: 'c5', name: 'Kavitha Iyer',     role: 'Finance Analyst',               department: 'Finance',     stage: 'INTERVIEW', source: 'Referral',    appliedAt: '2026-06-25', score: 85, email: 'kavitha.iyer@gmail.com', interviewDate: '2026-07-18' },
  { id: 'c6', name: 'Deepak Menon',     role: 'DevOps Engineer',               department: 'Engineering', stage: 'HIRED',     source: 'AngelList',   appliedAt: '2026-06-10', score: 94, email: 'deepak.m@gmail.com', salary: '₹24L' },
  { id: 'c7', name: 'Sneha Pillai',     role: 'HR Business Partner',           department: 'HR',          stage: 'OFFER',     source: 'Naukri',      appliedAt: '2026-06-30', score: 87, email: 'sneha.p@outlook.com', salary: '₹14L' },
  { id: 'c8', name: 'Vikram Nambiar',   role: 'Technical Delivery Manager',    department: 'Delivery',    stage: 'SCREENING', source: 'LinkedIn',    appliedAt: '2026-07-08', score: 72, email: 'vikram.n@gmail.com' },
]

function ScoreBadge({ score }: { score: number }) {
  const col = score >= 85 ? GREEN : score >= 70 ? AMBER : RED
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5,
      background: col + '14', color: col, border: `1px solid ${col}28`,
      fontVariantNumeric: 'tabular-nums',
    }}>{score}</span>
  )
}

function CandidateCard({ c, onStageChange }: { c: Candidate; onStageChange: (id: string, stage: Stage) => void }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STAGE_CFG[c.stage]

  return (
    <div style={{
      background: 'var(--os-card)', border: '1px solid var(--os-border)',
      borderLeft: `3px solid ${cfg.color}`, borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: cfg.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: cfg.color,
        }}>
          {c.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>{c.name}</span>
            <ScoreBadge score={c.score} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 2 }}>{c.role} · {c.department}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8,
              background: cfg.color + '12', color: cfg.color,
            }}>{cfg.label}</span>
            <span style={{ fontSize: 9, color: SLATE }}>{c.source}</span>
            {c.salary && (
              <span style={{ fontSize: 9, fontWeight: 700, color: GOLD }}>{c.salary}</span>
            )}
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: SLATE, padding: 2 }}>
          {expanded ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--os-border)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: SLATE }}>
              <Mail style={{ width: 10, height: 10 }} /> {c.email}
            </div>
            {c.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: SLATE }}>
                <Phone style={{ width: 10, height: 10 }} /> {c.phone}
              </div>
            )}
            {c.interviewDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: AMBER }}>
                <Calendar style={{ width: 10, height: 10 }} /> Interview: {new Date(c.interviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {(['SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as Stage[])
              .filter(s => s !== c.stage)
              .map(s => (
                <button key={s} onClick={() => onStageChange(c.id, s)} style={{
                  fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                  background: STAGE_CFG[s].color + '12', color: STAGE_CFG[s].color,
                  border: `1px solid ${STAGE_CFG[s].color}28`,
                }}>
                  → {STAGE_CFG[s].label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AddCandidateModal({ onAdd, onClose }: { onAdd: (c: Candidate) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', role: '', department: DEPARTMENTS[0], email: '', source: 'LinkedIn', salary: '' })

  function submit() {
    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) return
    onAdd({
      id: `c-${Date.now()}`,
      name: form.name, role: form.role, department: form.department,
      email: form.email, source: form.source, salary: form.salary,
      stage: 'SOURCING', appliedAt: new Date().toISOString().split('T')[0], score: 70,
    })
    onClose()
  }

  const inp = (placeholder: string, key: keyof typeof form, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key]}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      style={{
        width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
        borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)',
        outline: 'none', boxSizing: 'border-box',
      }}
    />
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: 'var(--os-card)', border: `1px solid ${BLUE}44`, borderRadius: 14, padding: 22, width: 380, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>Add Candidate</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: 14, height: 14, color: SLATE }} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inp('Full Name *', 'name')}
          {inp('Role / Position *', 'role')}
          {inp('Email *', 'email', 'email')}
          {inp('Expected Salary (e.g. ₹18L)', 'salary')}
          <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {['LinkedIn', 'Referral', 'Naukri', 'AngelList', 'Dribbble', 'Direct'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={submit} style={{ flex: 1, background: BLUE, color: '#fff', border: 'none', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Check style={{ width: 12, height: 12 }} /> Add Candidate
          </button>
          <button onClick={onClose} style={{ background: 'var(--os-surface-3)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '8px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--os-text-2)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export function HiringPipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>(SEED)
  const [search, setSearch]         = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [showAdd, setShowAdd]       = useState(false)

  const filtered = useMemo(() =>
    candidates.filter(c =>
      (filterDept === 'All' || c.department === filterDept) &&
      (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))
    ), [candidates, search, filterDept])

  const byStage = (s: Stage) => filtered.filter(c => c.stage === s)

  function moveStage(id: string, stage: Stage) {
    setCandidates(cs => cs.map(c => c.id === id ? { ...c, stage } : c))
  }

  const kpis = [
    { label: 'Total Candidates', value: String(candidates.length),                          col: BLUE   },
    { label: 'Active Pipeline',  value: String(candidates.filter(c => !['HIRED','REJECTED'].includes(c.stage)).length), col: PURPLE },
    { label: 'Hired This Month', value: String(candidates.filter(c => c.stage === 'HIRED').length),     col: GREEN  },
    { label: 'Open Offers',      value: String(candidates.filter(c => c.stage === 'OFFER').length),     col: AMBER  },
    { label: 'Avg Score',        value: (candidates.reduce((s, c) => s + c.score, 0) / candidates.length).toFixed(0), col: TEAL },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {showAdd && <AddCandidateModal onAdd={c => setCandidates(cs => [...cs, c])} onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Hiring Pipeline</h2>
          <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>Candidate tracking · sourcing to offer</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: BLUE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 13, height: 13 }} /> Add Candidate
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.col}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.col, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: SLATE }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates…"
            style={{ width: '100%', background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '7px 10px 7px 28px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        {['All', ...DEPARTMENTS].map(d => (
          <button key={d} onClick={() => setFilterDept(d)} style={{
            padding: '5px 11px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer',
            background: filterDept === d ? BLUE + '18' : 'var(--os-surface-3)',
            color: filterDept === d ? BLUE : 'var(--os-text-3)',
            border: `1px solid ${filterDept === d ? BLUE + '35' : 'var(--os-border)'}`,
          }}>{d}</button>
        ))}
      </div>

      {/* Pipeline columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {(['SOURCING', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'] as Stage[]).map(stage => {
          const cfg = STAGE_CFG[stage]
          const items = byStage(stage)
          return (
            <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: cfg.color + '0c', borderRadius: 8, border: `1px solid ${cfg.color}20` }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, flex: 1 }}>{cfg.label}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 6, background: cfg.color + '20', color: cfg.color }}>{items.length}</span>
              </div>
              {items.map(c => <CandidateCard key={c.id} c={c} onStageChange={moveStage} />)}
              {items.length === 0 && (
                <div style={{ background: 'var(--os-surface-3)', border: `1px dashed ${cfg.color}25`, borderRadius: 8, padding: '18px 0', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, color: cfg.color + '60', fontWeight: 600, textTransform: 'uppercase' }}>Empty</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Rejected (separate) */}
      {byStage('REJECTED').length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Not Progressed</span>
            <div style={{ flex: 1, height: 1, background: RED + '25' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {byStage('REJECTED').map(c => <CandidateCard key={c.id} c={c} onStageChange={moveStage} />)}
          </div>
        </div>
      )}
    </div>
  )
}
