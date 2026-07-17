import { useState } from 'react'
import { Check, Clock, AlertTriangle, Plus, X, ChevronDown, ChevronUp, User, Calendar } from 'lucide-react'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const RED    = '#ef4444'
const SLATE  = '#6b7280'
const TEAL   = '#0d9488'

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED'
const TASK_CFG: Record<TaskStatus, { color: string; label: string; Icon: React.ElementType }> = {
  PENDING:     { color: SLATE,  label: 'Pending',     Icon: Clock          },
  IN_PROGRESS: { color: BLUE,   label: 'In Progress', Icon: Clock          },
  DONE:        { color: GREEN,  label: 'Done',        Icon: Check          },
  BLOCKED:     { color: RED,    label: 'Blocked',     Icon: AlertTriangle  },
}

interface OnboardTask { id: string; title: string; category: string; status: TaskStatus; dueDay: number; owner: string }
interface OnboardEmployee {
  id: string; name: string; role: string; department: string;
  startDate: string; manager: string; buddy: string
  tasks: OnboardTask[]
}

const DEFAULT_TASKS: OnboardTask[] = [
  { id: 't1',  title: 'Send welcome email + kit',          category: 'Pre-Join',      status: 'DONE',        dueDay: -3, owner: 'HR'        },
  { id: 't2',  title: 'Laptop & equipment provisioned',    category: 'IT',            status: 'DONE',        dueDay: -1, owner: 'IT'        },
  { id: 't3',  title: 'Email + accounts set up',           category: 'IT',            status: 'DONE',        dueDay: 1,  owner: 'IT'        },
  { id: 't4',  title: 'Office tour & team introductions',  category: 'Day 1',         status: 'DONE',        dueDay: 1,  owner: 'Manager'   },
  { id: 't5',  title: 'Complete HR paperwork & compliance',category: 'HR',            status: 'IN_PROGRESS', dueDay: 3,  owner: 'HR'        },
  { id: 't6',  title: '30-min 1:1 with manager',          category: 'Day 1',         status: 'IN_PROGRESS', dueDay: 1,  owner: 'Manager'   },
  { id: 't7',  title: 'Assign buddy / onboarding partner', category: 'Culture',       status: 'DONE',        dueDay: 1,  owner: 'HR'        },
  { id: 't8',  title: 'Tools & software walkthrough',      category: 'IT',            status: 'PENDING',     dueDay: 5,  owner: 'IT'        },
  { id: 't9',  title: '90-day plan discussion with manager',category: 'Week 1',       status: 'PENDING',     dueDay: 5,  owner: 'Manager'   },
  { id: 't10', title: 'Meet cross-functional team leads',  category: 'Week 1',        status: 'PENDING',     dueDay: 7,  owner: 'Manager'   },
  { id: 't11', title: 'Complete security awareness training',category: 'Compliance',  status: 'PENDING',     dueDay: 7,  owner: 'HR'        },
  { id: 't12', title: 'Review company handbook + values',  category: 'Culture',       status: 'PENDING',     dueDay: 7,  owner: 'Employee'  },
  { id: 't13', title: 'Week 2 check-in with HR',          category: 'HR',            status: 'PENDING',     dueDay: 14, owner: 'HR'        },
  { id: 't14', title: '30-day performance conversation',   category: 'Development',   status: 'PENDING',     dueDay: 30, owner: 'Manager'   },
  { id: 't15', title: '90-day review & goal setting',     category: 'Development',   status: 'PENDING',     dueDay: 90, owner: 'Manager'   },
]

const SEED_EMPLOYEES: OnboardEmployee[] = [
  { id: 'e1', name: 'Deepak Menon',  role: 'DevOps Engineer',     department: 'Engineering', startDate: '2026-07-14', manager: 'Mahesh Kumar', buddy: 'Priya Sharma',   tasks: DEFAULT_TASKS.map(t => ({ ...t, id: `e1-${t.id}` })) },
  { id: 'e2', name: 'Sneha Pillai',  role: 'HR Business Partner', department: 'HR',          startDate: '2026-07-17', manager: 'Mahesh Kumar', buddy: 'Kavitha Iyer',  tasks: DEFAULT_TASKS.map(t => ({ ...t, id: `e2-${t.id}`, status: t.dueDay <= 1 ? 'DONE' as TaskStatus : 'PENDING' as TaskStatus })) },
]

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 5, background: 'var(--os-surface-3)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.4s' }} />
    </div>
  )
}

function EmployeeCard({ emp, onTaskToggle }: { emp: OnboardEmployee; onTaskToggle: (empId: string, taskId: string) => void }) {
  const [expanded, setExpanded] = useState(true)
  const done = emp.tasks.filter(t => t.status === 'DONE').length
  const pct  = Math.round((done / emp.tasks.length) * 100)
  const col  = pct >= 80 ? GREEN : pct >= 50 ? AMBER : BLUE
  const daysSince = Math.floor((Date.now() - new Date(emp.startDate).getTime()) / 86400000)

  const categories = [...new Set(emp.tasks.map(t => t.category))]

  return (
    <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: BLUE + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: BLUE, flexShrink: 0 }}>
          {emp.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--os-text-1)', marginBottom: 2 }}>{emp.name}</div>
          <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>{emp.role} · {emp.department}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 10, color: SLATE, flexWrap: 'wrap' }}>
            <span><Calendar style={{ width: 9, height: 9, display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />Day {daysSince + 1} · {new Date(emp.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            <span><User style={{ width: 9, height: 9, display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />Manager: {emp.manager}</span>
            <span>Buddy: {emp.buddy}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Onboarding Progress</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
            </div>
            <ProgressBar pct={pct} color={col} />
            <div style={{ fontSize: 9, color: SLATE, marginTop: 3 }}>{done} of {emp.tasks.length} tasks complete</div>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: SLATE }}>
          {expanded ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--os-border)', padding: '14px 18px' }}>
          {categories.map(cat => {
            const tasks = emp.tasks.filter(t => t.category === cat)
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SLATE, marginBottom: 6 }}>{cat}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {tasks.map(t => {
                    const cfg = TASK_CFG[t.status]
                    return (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 7, background: 'var(--os-surface-3)', border: `1px solid ${cfg.color}18` }}>
                        <button
                          onClick={() => onTaskToggle(emp.id, t.id)}
                          style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${cfg.color}`, background: t.status === 'DONE' ? cfg.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                          {t.status === 'DONE' && <Check style={{ width: 9, height: 9, color: '#fff' }} />}
                        </button>
                        <span style={{ flex: 1, fontSize: 11, color: t.status === 'DONE' ? SLATE : 'var(--os-text-2)', textDecoration: t.status === 'DONE' ? 'line-through' : 'none' }}>
                          {t.title}
                        </span>
                        <span style={{ fontSize: 8, color: SLATE }}>Day {t.dueDay}</span>
                        <span style={{ fontSize: 8, fontWeight: 600, padding: '1px 5px', borderRadius: 4, background: cfg.color + '14', color: cfg.color }}>{t.owner}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function OnboardingTracker() {
  const [employees, setEmployees] = useState<OnboardEmployee[]>(SEED_EMPLOYEES)

  function toggleTask(empId: string, taskId: string) {
    setEmployees(es => es.map(e => {
      if (e.id !== empId) return e
      return {
        ...e,
        tasks: e.tasks.map(t => {
          if (t.id !== taskId) return t
          return { ...t, status: t.status === 'DONE' ? 'PENDING' : 'DONE' }
        }),
      }
    }))
  }

  const totalOnboarding = employees.length
  const avgProgress     = employees.length > 0
    ? Math.round(employees.reduce((s, e) => {
        const done = e.tasks.filter(t => t.status === 'DONE').length
        return s + (done / e.tasks.length) * 100
      }, 0) / employees.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Onboarding Tracker</h2>
          <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>New joiners · 90-day journey</p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Onboarding Now',    value: String(totalOnboarding), col: BLUE   },
          { label: 'Avg Progress',      value: `${avgProgress}%`,       col: avgProgress >= 70 ? GREEN : AMBER },
          { label: 'Tasks Completed',   value: String(employees.reduce((s, e) => s + e.tasks.filter(t => t.status === 'DONE').length, 0)), col: GREEN },
          { label: 'Pending Actions',   value: String(employees.reduce((s, e) => s + e.tasks.filter(t => t.status !== 'DONE').length, 0)), col: AMBER },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.col}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.col, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Employee cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {employees.map(emp => (
          <EmployeeCard key={emp.id} emp={emp} onTaskToggle={toggleTask} />
        ))}
      </div>

      {employees.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14 }}>
          <User style={{ width: 32, height: 32, color: SLATE, margin: '0 auto 10px' }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-2)', margin: 0 }}>No active onboarding</p>
          <p style={{ fontSize: 11, color: SLATE, marginTop: 4 }}>New joiners will appear here once added from the Hiring Pipeline.</p>
        </div>
      )}
    </div>
  )
}
