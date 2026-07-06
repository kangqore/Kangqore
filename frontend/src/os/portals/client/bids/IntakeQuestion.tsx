import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { IntakeQuestion as Q, MATURITY_LABELS, MATURITY_COLORS } from './intakeTypes'
import { fadeUp, spring } from '@os/motion'

interface Props {
  question: Q
  value:    any
  onChange: (v: any) => void
}

export function IntakeQuestion({ question, value, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [expandValue, setExpandValue] = useState<any>(null)

  const handleYesNo = (v: boolean) => {
    onChange(v)
    if (v) setExpanded(true)
    else { setExpanded(false); setExpandValue(null) }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      {/* Label */}
      <div className="mb-2">
        <p className="text-os-md font-semibold text-white leading-snug">
          {question.label}
          {question.required && <span className="text-[#e2445c] ml-1">*</span>}
          {question.sensitive && (
            <span className="inline-flex items-center gap-1 ml-2 text-[10px] font-bold text-[#fdab3d] bg-[#fdab3d18] border border-[#fdab3d30] px-2 py-0.5 rounded-full">
              <Lock className="w-2.5 h-2.5" /> CONFIDENTIAL
            </span>
          )}
        </p>
        {question.description && (
          <p className="mt-1 text-os-sm text-[#94a3b8]">{question.description}</p>
        )}
      </div>

      {/* Input */}
      {question.type === 'maturity_slider' && (
        <MaturitySlider value={value} onChange={onChange} />
      )}
      {question.type === 'multi_select' && (
        <MultiSelect options={question.options ?? []} value={value ?? []} onChange={onChange} />
      )}
      {question.type === 'single_select' && (
        <SingleSelect options={question.options ?? []} value={value} onChange={onChange} />
      )}
      {question.type === 'range_select' && (
        <SingleSelect options={question.options ?? []} value={value} onChange={onChange} />
      )}
      {question.type === 'open_text' && (
        <OpenText value={value ?? ''} onChange={onChange} maxLength={question.maxLength} />
      )}
      {question.type === 'priority_rank' && (
        <PriorityRank options={question.options ?? []} value={value ?? []} onChange={onChange} />
      )}
      {question.type === 'yes_no_expand' && (
        <div className="space-y-3">
          <YesNo value={typeof value === 'boolean' ? value : value === 'true' ? true : value === 'false' ? false : null} onChange={handleYesNo} />
          <AnimatePresence>
            {expanded && question.expandType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { ...spring.smooth } }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pl-4 border-l-2 border-[#2564ea40]">
                  <p className="text-os-sm text-[#94a3b8] mb-2">{question.expandLabel}</p>
                  {(question.expandType === 'multi_select') && (
                    <MultiSelect options={question.expandOptions ?? []} value={expandValue ?? []} onChange={v => { setExpandValue(v); onChange({ main: value, detail: v }) }} />
                  )}
                  {(question.expandType === 'single_select') && (
                    <SingleSelect options={question.expandOptions ?? []} value={expandValue} onChange={v => { setExpandValue(v); onChange({ main: value, detail: v }) }} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

// ─── Maturity Slider ──────────────────────────────────────────────────────────

function MaturitySlider({ value, onChange }: { value: any; onChange: (v: number) => void }) {
  const current = Number(value) || 0
  const labels = MATURITY_LABELS

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(n => {
          const label = labels[n - 1]
          const color = MATURITY_COLORS[label]
          const active = current === n
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              className="flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-xl border transition-all duration-200"
              style={{
                background:  active ? color + '18' : 'rgba(255,255,255,0.03)',
                borderColor: active ? color + '60' : 'rgba(255,255,255,0.06)',
                boxShadow:   active ? `0 0 12px ${color}30` : 'none',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200"
                style={{
                  background:  active ? color : 'rgba(255,255,255,0.06)',
                  color:       active ? '#fff' : '#64748b',
                }}
              >
                {n}
              </div>
              <p
                className="text-[9px] font-semibold uppercase tracking-wide text-center leading-tight"
                style={{ color: active ? color : '#64748b' }}
              >
                {label}
              </p>
            </button>
          )
        })}
      </div>
      {current > 0 && (
        <p className="text-os-sm text-[#94a3b8]">
          <span style={{ color: MATURITY_COLORS[labels[current - 1]] }} className="font-semibold">
            {labels[current - 1]}
          </span>
          {' — '}{['early stage, largely manual or absent', 'some capability, inconsistently applied', 'functional, moderately applied', 'well-established, proactively managed', 'best-in-class, competitive differentiator'][current - 1]}
        </p>
      )}
    </div>
  )
}

// ─── Multi Select ─────────────────────────────────────────────────────────────

function MultiSelect({ options, value, onChange }: { options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-os-sm font-medium transition-all duration-150"
            style={{
              background:  active ? '#2564ea18' : 'rgba(255,255,255,0.03)',
              borderColor: active ? '#2564ea60' : 'rgba(255,255,255,0.08)',
              color:       active ? '#4ab6d4' : '#94a3b8',
            }}
          >
            {active && <Check className="w-3 h-3" />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Single Select ────────────────────────────────────────────────────────────

function SingleSelect({ options, value, onChange }: { options: { value: string; label: string }[]; value: any; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150"
            style={{
              background:  active ? '#2564ea14' : 'rgba(255,255,255,0.02)',
              borderColor: active ? '#2564ea50' : 'rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-150 flex items-center justify-center"
              style={{
                borderColor: active ? '#2564ea' : '#334155',
                background:  active ? '#2564ea' : 'transparent',
              }}
            >
              {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className={`text-os-sm font-medium ${active ? 'text-white' : 'text-[#94a3b8]'}`}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Yes / No ─────────────────────────────────────────────────────────────────

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {[true, false].map(v => {
        const active = value === v
        const color  = v ? '#00c875' : '#e2445c'
        const label  = v ? 'Yes' : 'No'
        return (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className="flex-1 py-3 rounded-xl border font-semibold text-os-sm transition-all duration-150"
            style={{
              background:  active ? color + '18' : 'rgba(255,255,255,0.03)',
              borderColor: active ? color + '60' : 'rgba(255,255,255,0.08)',
              color:       active ? color : '#64748b',
              boxShadow:   active ? `0 0 12px ${color}25` : 'none',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Open Text ────────────────────────────────────────────────────────────────

function OpenText({ value, onChange, maxLength }: { value: string; onChange: (v: string) => void; maxLength?: number }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/3 text-white text-os-sm placeholder:text-[#475569] resize-none focus:outline-none focus:border-[#2564ea50] focus:bg-[#2564ea08] transition-all duration-200"
        placeholder="Type your answer here…"
      />
      {maxLength && (
        <p className="absolute bottom-3 right-3 text-[10px] text-[#475569]">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

// ─── Priority Rank ────────────────────────────────────────────────────────────

function PriorityRank({ options, value, onChange }: { options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  const rankOf = (v: string) => value.indexOf(v) + 1

  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v))
    } else if (value.length < 3) {
      onChange([...value, v])
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b]">
        Click to select your top 3 priorities in order
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const rank   = rankOf(opt.value)
          const active = rank > 0
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              disabled={!active && value.length >= 3}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-os-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:  active ? '#2564ea18' : 'rgba(255,255,255,0.03)',
                borderColor: active ? '#2564ea60' : 'rgba(255,255,255,0.08)',
                color:       active ? '#4ab6d4' : '#94a3b8',
              }}
            >
              {active && (
                <span className="w-5 h-5 rounded-full bg-[#2564ea] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  {rank}
                </span>
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
      {value.length > 0 && (
        <div className="mt-2 space-y-1">
          {value.map((v, i) => {
            const opt = options.find(o => o.value === v)
            return (
              <p key={v} className="text-os-sm text-[#94a3b8]">
                <span className="text-[#2564ea] font-semibold">#{i + 1}</span> {opt?.label}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}
