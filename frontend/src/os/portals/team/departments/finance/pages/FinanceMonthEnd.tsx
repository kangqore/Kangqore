import { Lock } from 'lucide-react'

const ACCENT = '#10B981'

interface CloseTask {
  id: number
  name: string
  owner: string
  dueDate: string
  done: boolean
}

const TASKS: CloseTask[] = [
  { id:  1, name: 'AR Reconciliation',      owner: 'Sarah Chen',   dueDate: '24 Jun 2026', done: true  },
  { id:  2, name: 'AP Reconciliation',      owner: 'James Okafor', dueDate: '24 Jun 2026', done: true  },
  { id:  3, name: 'Bank Reconciliation',    owner: 'Priya Nair',   dueDate: '24 Jun 2026', done: true  },
  { id:  4, name: 'Payroll Posting',        owner: 'Tom Walsh',    dueDate: '24 Jun 2026', done: true  },
  { id:  5, name: 'Accruals',               owner: 'Aisha Malik',  dueDate: '25 Jun 2026', done: false },
  { id:  6, name: 'Prepayments',            owner: 'Daniel Park',  dueDate: '25 Jun 2026', done: false },
  { id:  7, name: 'Fixed Assets',           owner: 'Lucy Brennan', dueDate: '25 Jun 2026', done: false },
  { id:  8, name: 'Intercompany Postings',  owner: 'Raj Patel',    dueDate: '25 Jun 2026', done: false },
  { id:  9, name: 'Management Accounts',    owner: 'Sarah Chen',   dueDate: '26 Jun 2026', done: false },
  { id: 10, name: 'Board Pack Preparation', owner: 'James Okafor', dueDate: '26 Jun 2026', done: false },
  { id: 11, name: 'CFO Sign-off',           owner: 'CFO',          dueDate: '27 Jun 2026', done: false },
  { id: 12, name: 'Audit File Upload',      owner: 'Priya Nair',   dueDate: '27 Jun 2026', done: false },
]

export function FinanceMonthEnd() {
  const done    = TASKS.filter(t => t.done).length
  const total   = TASKS.length
  const pct     = Math.round((done / total) * 100)
  const cfoBlog = TASKS.filter(t => !t.done && t.owner === 'CFO').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Lock size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Month-End Close</h1>
          <p className="text-sm text-[var(--os-text-2)]">June 2026 close checklist — tracking tasks to CFO sign-off</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Complete',      value: `${done}/${total}`,     sub: `${pct}% done`           },
          { label: 'Days to Deadline',    value: '4',                    sub: 'Close deadline: 27 Jun' },
          { label: 'Open CFO Approvals',  value: String(cfoBlog + 2),   sub: 'pending sign-off'       },
          { label: 'Tasks Remaining',     value: String(total - done),   sub: 'to complete'            },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-white">Overall Close Progress</p>
          <p className="text-sm font-bold" style={{ color: ACCENT }}>{pct}%</p>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: ACCENT }}
          />
        </div>
        <p className="text-xs text-[var(--os-text-2)] mt-2">{done} of {total} tasks complete</p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {TASKS.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
          >
            {/* Checkbox indicator */}
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{
                borderColor: task.done ? ACCENT : 'var(--os-text-2)',
                background:  task.done ? ACCENT : 'transparent',
              }}
            >
              {task.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold ${task.done ? 'line-through text-[var(--os-text-2)]' : 'text-white'}`}
              >
                {task.name}
              </p>
            </div>

            <div className="text-right w-32 shrink-0">
              <p className="text-xs text-[var(--os-text-2)]">Owner</p>
              <p className="text-xs text-[var(--os-text-1)]">{task.owner}</p>
            </div>

            <div className="text-right w-32 shrink-0">
              <p className="text-xs text-[var(--os-text-2)]">Due</p>
              <p className="text-xs text-[var(--os-text-1)]">{task.dueDate}</p>
            </div>

            <div className="w-24 text-right shrink-0">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={
                  task.done
                    ? { background: '#10B98122', color: '#10B981' }
                    : { background: '#60A5FA22', color: '#60A5FA' }
                }
              >
                {task.done ? 'Done' : 'Open'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
