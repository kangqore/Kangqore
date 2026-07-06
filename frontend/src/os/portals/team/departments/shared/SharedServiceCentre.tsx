import { useState, useRef } from 'react'
import { Search, Brain, ChevronRight, X, CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

interface CatalogueCard {
  dept:      string
  label:     string
  formCount: number
  color:     string
  icon:      string
}

interface RequestForm {
  id:      string
  label:   string
  deptId:  string
}

interface MyRequest {
  id:        string
  category:  string
  title:     string
  status:    'Submitted' | 'Triaged' | 'In Progress' | 'Resolved'
  opened:    string
  etaHours:  number
}

interface Props {
  config: DeptConfig
}

const CATALOGUE: CatalogueCard[] = [
  { dept: 'it',           label: 'IT',          formCount: 8,  color: '#2564ea', icon: '🖥' },
  { dept: 'hr',           label: 'HR',          formCount: 6,  color: '#8B5CF6', icon: '👥' },
  { dept: 'finance',      label: 'Finance',     formCount: 5,  color: '#10B981', icon: '💰' },
  { dept: 'security',     label: 'Security',    formCount: 4,  color: '#EF4444', icon: '🔒' },
  { dept: 'legal',        label: 'Legal',       formCount: 5,  color: '#F59E0B', icon: '⚖️' },
  { dept: 'support',      label: 'Support',     formCount: 7,  color: '#06B6D4', icon: '🎧' },
  { dept: 'facilities',   label: 'Facilities',  formCount: 4,  color: '#F97316', icon: '🏢' },
  { dept: 'supply-chain', label: 'Supply',      formCount: 3,  color: '#6366F1', icon: '📦' },
]

const FORMS: RequestForm[] = [
  { id: 'f01', label: 'Request IT Access',    deptId: 'it' },
  { id: 'f02', label: 'Report a Bug',         deptId: 'it' },
  { id: 'f03', label: 'Submit Expense',        deptId: 'finance' },
  { id: 'f04', label: 'Request Leave',         deptId: 'hr' },
  { id: 'f05', label: 'Book a Room',           deptId: 'facilities' },
  { id: 'f06', label: 'Raise Contract Query',  deptId: 'legal' },
]

const QUICK_ACTIONS = ['Request IT access', 'Submit expense', 'Request leave', 'Book room']

const STATUS_STEPS: MyRequest['status'][] = ['Submitted', 'Triaged', 'In Progress', 'Resolved']

const STATUS_COLORS: Record<string, string> = {
  Submitted:   '#6366F1',
  Triaged:     '#F59E0B',
  'In Progress':'#2564ea',
  Resolved:    '#10B981',
}

let REQ_COUNTER = 4

const SEED_REQUESTS: MyRequest[] = [
  { id: 'SC-001', category: 'IT',       title: 'VPN access for remote week',    status: 'In Progress', opened: '2h ago',  etaHours: 4  },
  { id: 'SC-002', category: 'HR',       title: 'Leave request — week of Jul 7', status: 'Triaged',     opened: '1d ago',  etaHours: 24 },
  { id: 'SC-003', category: 'Finance',  title: 'Expense: client dinner £120',   status: 'Resolved',    opened: '3d ago',  etaHours: 0  },
]

export function SharedServiceCentre({ config }: Props) {
  const accent = config.accentColor

  const [query,          setQuery]          = useState('')
  const [deflection,     setDeflection]     = useState<string | null>(null)
  const [selectedDept,   setSelectedDept]   = useState<string | null>(null)
  const [modal,          setModal]          = useState(false)
  const [step,           setStep]           = useState(0)
  const [form,           setForm]           = useState({ category: '', type: '', title: '', desc: '', priority: 'Medium' })
  const [kimmCheck,      setKimmCheck]      = useState(false)
  const [submitted,      setSubmitted]      = useState<string | null>(null)
  const [requests,       setRequests]       = useState<MyRequest[]>(SEED_REQUESTS)
  const [expandedReq,    setExpandedReq]    = useState<string | null>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearch(q: string) {
    setQuery(q)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      if (q.trim().length > 2) {
        setDeflection('Active incident IT-0051 may already be resolving this. Continue submitting or wait?')
      } else {
        setDeflection(null)
      }
    }, 300)
  }

  function openForm(deptId: string) {
    setForm(f => ({ ...f, category: CATALOGUE.find(c => c.dept === deptId)?.label ?? deptId }))
    setStep(0); setKimmCheck(false); setSubmitted(null)
    setModal(true)
  }

  function submitRequest() {
    REQ_COUNTER++
    const id = `SC-00${REQ_COUNTER}`
    setRequests(prev => [{
      id,
      category: form.category,
      title:    form.title || form.type || 'New request',
      status:   'Submitted',
      opened:   'just now',
      etaHours: 8,
    }, ...prev])
    setSubmitted(id)
    setStep(4)
  }

  const accent2 = config.accentColor

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Hero search */}
      <div className="relative">
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl focus-within:border-white/20 transition-colors">
          <Search className="w-5 h-5 text-[var(--os-text-2)] flex-shrink-0" />
          <input
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search services, request types, or describe your need…"
            className="flex-1 bg-transparent text-base text-white placeholder:text-[var(--os-text-2)] outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); setDeflection(null) }} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* KIMMP deflection */}
        {deflection && (
          <div className="mt-2 p-4 rounded-xl border flex items-start gap-3 animate-fade-in"
            style={{ background: `${accent}08`, borderColor: `${accent}30` }}>
            <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: accent }}>KIMMP Intelligence</p>
              <p className="text-sm text-[var(--os-text-1)]">{deflection}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setDeflection(null); setQuery('') }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--os-text-2)] bg-slate-800/60 border border-white/10 hover:text-[var(--os-text-1)]">
                Wait
              </button>
              <button onClick={() => setDeflection(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: accent }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Quick action chips */}
        {!deflection && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {QUICK_ACTIONS.map(qa => (
              <button
                key={qa}
                onClick={() => { setQuery(qa); openForm('it') }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/60 border border-white/10 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
              >
                {qa}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Service catalogue */}
      <div>
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Service Catalogue</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATALOGUE.map(card => (
            <button
              key={card.dept}
              onClick={() => { setSelectedDept(selectedDept === card.dept ? null : card.dept) }}
              className="p-4 rounded-2xl border text-left transition-all"
              style={selectedDept === card.dept
                ? { borderColor: `${card.color}60`, background: `${card.color}10` }
                : { borderColor: 'var(--os-border)', background: 'rgba(15,23,42,0.4)' }}
            >
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-sm font-bold text-white">{card.label}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{card.formCount} forms</p>
            </button>
          ))}
        </div>

        {/* Expanded forms */}
        {selectedDept && (
          <div className="mt-3 p-4 rounded-2xl border border-white/10 bg-slate-900/30 space-y-2">
            {FORMS.filter(f => f.deptId === selectedDept).map(f => (
              <button
                key={f.id}
                onClick={() => openForm(selectedDept)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.06] text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-sm text-[var(--os-text-1)]">{f.label}</span>
                <ChevronRight className="w-4 h-4 text-[var(--os-text-2)]" />
              </button>
            ))}
            <button
              onClick={() => openForm(selectedDept)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/[0.06] text-left hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-sm text-[var(--os-text-2)] italic">+ Other / General enquiry</span>
              <ChevronRight className="w-4 h-4 text-[var(--os-text-2)]" />
            </button>
          </div>
        )}
      </div>

      {/* My Requests */}
      <div>
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">My Requests</p>
        <div className="space-y-2">
          {requests.map(req => {
            const stepIdx = STATUS_STEPS.indexOf(req.status)
            const isOpen  = expandedReq === req.id
            return (
              <div key={req.id} className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-white/[0.02]"
                  onClick={() => setExpandedReq(isOpen ? null : req.id)}
                >
                  <span className="text-xs font-mono text-[var(--os-text-2)] flex-shrink-0">{req.id}</span>
                  <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">{req.category}</span>
                  <span className="flex-1 text-sm text-[var(--os-text-1)] truncate">{req.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${STATUS_COLORS[req.status]}22`, color: STATUS_COLORS[req.status] }}>
                    {req.status}
                  </span>
                  <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">{req.opened}</span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 border-t border-white/10 pt-3">
                    {/* 4-step status tracker */}
                    <div className="flex items-center gap-0 overflow-x-auto mb-3">
                      {STATUS_STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center w-24">
                            <div
                              className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                              style={{
                                borderColor: i <= stepIdx ? STATUS_COLORS[s] : 'var(--os-text-2)',
                                background: `${i <= stepIdx ? STATUS_COLORS[s] : 'var(--os-text-2)'}18`,
                              }}
                            >
                              {i < stepIdx  && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {i === stepIdx && <Clock className="w-3.5 h-3.5" style={{ color: STATUS_COLORS[s] }} />}
                              {i > stepIdx  && <Circle className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
                            </div>
                            <p className="text-xs text-[var(--os-text-2)] mt-1 text-center leading-tight">{s}</p>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className="w-8 flex items-center">
                              <div className="flex-1 h-0.5" style={{ background: i < stepIdx ? '#10B981' : '#1E293B' }} />
                              <ArrowRight className="w-3 h-3 text-[var(--os-text-2)] flex-shrink-0" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {req.etaHours > 0 && (
                      <p className="text-xs text-[var(--os-text-2)]">KIMMP estimated resolution: ~{req.etaHours}h</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Submit form modal */}
      {modal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] max-w-[95vw] rounded-2xl bg-[#0D1628] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-white">New Request</p>
                <p className="text-xs text-[var(--os-text-2)]">{form.category}</p>
              </div>
              <button onClick={() => setModal(false)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1 mb-5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all"
                  style={{ background: i <= step ? accent : '#1E293B' }} />
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-[var(--os-text-2)]">1. Request type</p>
                {FORMS.filter(f => f.deptId === selectedDept ?? 'it').concat([{ id: 'other', label: 'Other', deptId: '' }]).map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setForm(fm => ({ ...fm, type: f.label })); setStep(1) }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 text-left hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm text-[var(--os-text-1)]">{f.label}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--os-text-2)]" />
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-[var(--os-text-2)]">2. Details</p>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Short title…"
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[var(--os-text-2)] outline-none"
                />
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Description (optional)…"
                  rows={3}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[var(--os-text-2)] outline-none resize-none"
                />
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all border"
                      style={form.priority === p
                        ? { background: accent, borderColor: accent, color: '#fff' }
                        : { borderColor: 'var(--os-border)', color: 'var(--os-text-2)' }}>
                      {p}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} disabled={!form.title.trim()}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30"
                  style={{ background: accent }}>
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-[var(--os-text-2)]">3. KIMMP pre-submit check</p>
                <div className="p-4 rounded-xl border" style={{ background: `${accent}08`, borderColor: `${accent}25` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                    <p className="text-xs font-semibold" style={{ color: accent }}>KIMMP Intelligence</p>
                  </div>
                  <p className="text-sm text-[var(--os-text-1)]">3 similar requests were resolved via KB-042 (avg 1.2h). Link article to speed up triage?</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setKimmCheck(true)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: accent }}>
                      Yes, link KB-042
                    </button>
                    <button onClick={() => setKimmCheck(false)}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-[var(--os-text-2)] bg-slate-800/60 border border-white/10">
                      Skip
                    </button>
                  </div>
                </div>
                <button onClick={() => { setStep(3); setTimeout(submitRequest, 600) }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#10B981' }}>
                  Submit Request
                </button>
              </div>
            )}

            {step >= 3 && submitted && (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-base font-bold text-white mb-1">Request submitted</p>
                <p className="text-sm text-[var(--os-text-2)] mb-2">Ticket ID: <span className="font-mono text-white">{submitted}</span></p>
                <p className="text-xs text-[var(--os-text-2)]">KIMMP estimated resolution: ~8h</p>
                <button onClick={() => setModal(false)} className="mt-5 px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: accent }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
