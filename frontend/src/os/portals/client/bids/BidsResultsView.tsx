import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'
import { staggerContainer, staggerChild, fadeUp } from '@os/motion'
import type { BidsEngagement, PillarScore, EngineScore, TransformationRoadmap } from './intakeTypes'

// ── Colour helpers ────────────────────────────────────────────────────────────

const MATURITY_COLOR: Record<string, string> = {
  Foundational: '#e2445c',
  Developing:   '#fdab3d',
  Capable:      '#4ab6d4',
  Advanced:     '#2564ea',
  Leading:      '#00c875',
}

const ENGINE_ACCENT = ['#7c3aed', '#2564ea', '#fdab3d', '#e2445c', '#00c875', '#fdab3d']

function scoreColor(s: number): string {
  if (s >= 80) return '#00c875'
  if (s >= 65) return '#4ab6d4'
  if (s >= 45) return '#fdab3d'
  return '#e2445c'
}

function maturityFromScore(n: number): string {
  if (n >= 80) return 'Leading'
  if (n >= 65) return 'Advanced'
  if (n >= 45) return 'Capable'
  if (n >= 25) return 'Developing'
  return 'Foundational'
}

function TrendIcon({ score }: { score: number }) {
  if (score >= 65) return <TrendingUp  className="w-3.5 h-3.5" />
  if (score >= 45) return <Minus       className="w-3.5 h-3.5" />
  return               <TrendingDown className="w-3.5 h-3.5" />
}

// ── Pillar card ───────────────────────────────────────────────────────────────

function PillarCard({ p, index }: { p: PillarScore; index: number }) {
  const [open, setOpen] = useState(false)
  const color = scoreColor(p.score)
  const mc    = MATURITY_COLOR[p.maturity] ?? '#4ab6d4'

  return (
    <motion.div
      variants={staggerChild}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.07)`,
        borderLeft: `3px solid ${color}`,
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Pillar {p.pillarId}
            </p>
            <p className="text-xs font-semibold mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {p.pillarName}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xl font-black tabular-nums" style={{ color }}>{p.score}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>
              {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${p.score}%` }}
            transition={{ duration: 0.8, delay: index * 0.04, ease: 'easeOut' }}
          />
        </div>

        {/* Maturity + trend row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: mc + '22', color: mc }}>
            {p.maturity}
          </span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: mc }}>
            <TrendIcon score={p.score} />
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div
          className="px-4 pb-4 pt-2 space-y-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.finding}</p>
          {p.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Recommended Actions
              </p>
              {p.recommendations.map((r, i) => (
                <div key={i} className="flex gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span
                    className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: color + '22', color }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Executive report renderer ─────────────────────────────────────────────────

function ExecReport({ notes }: { notes: string }) {
  const sections = notes.split(/\n(?=\d+\.\s|##\s)/).filter(Boolean)

  if (sections.length <= 1) {
    return (
      <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'inherit' }}>
        {notes}
      </pre>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section, i) => {
        const lines = section.trim().split('\n')
        const heading = lines[0]
        const body    = lines.slice(1).join('\n').trim()
        return (
          <div key={i}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4ab6d4' }}>
              {heading.replace(/^\d+\.\s+|^##\s+/, '')}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{body}</p>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  engagement: BidsEngagement
}

export function BidsResultsView({ engagement }: Props) {
  const pillarScores: PillarScore[] = Array.isArray(engagement.pillarScores) ? engagement.pillarScores : []
  const engineScores: EngineScore[] = Array.isArray(engagement.engineScores) ? engagement.engineScores : []

  const overallScore = pillarScores.length > 0
    ? Math.round(pillarScores.reduce((s, p) => s + p.score, 0) / pillarScores.length)
    : null

  const overallColor   = overallScore !== null ? scoreColor(overallScore) : '#4ab6d4'
  const overallMaturity = overallScore !== null ? maturityFromScore(overallScore) : 'Developing'
  const maturityColor   = MATURITY_COLOR[overallMaturity] ?? '#4ab6d4'

  const sortedPillars = [...pillarScores].sort((a, b) => a.score - b.score)

  const publishedAt = engagement.publishedToClientAt
    ? new Date(engagement.publishedToClientAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* ── Hero: overall score ─────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(37,100,234,0.15) 0%, rgba(74,182,212,0.08) 100%)`,
            border: '1px solid rgba(74,182,212,0.15)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top left, ${overallColor}12 0%, transparent 60%)` }}
          />

          <div className="relative flex items-center gap-8 flex-wrap">
            {/* Score circle */}
            <div
              className="w-28 h-28 rounded-3xl flex flex-col items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${overallColor}22 0%, ${overallColor}08 100%)`,
                border: `2px solid ${overallColor}40`,
                boxShadow: `0 0 32px ${overallColor}20`,
              }}
            >
              <span className="text-4xl font-black tabular-nums" style={{ color: overallColor }}>
                {overallScore ?? '—'}
              </span>
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>/100</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: '#2564ea18', color: '#4ab6d4', border: '1px solid #4ab6d420' }}
                >
                  BIDS™ Diagnostic Scorecard™
                </span>
                {publishedAt && (
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Published {publishedAt}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">{engagement.clientName}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {engagement.industry} Edition
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: maturityColor + '22', color: maturityColor }}
                >
                  {overallMaturity} Maturity
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {pillarScores.filter(p => p.score >= 65).length} of 16 pillars performing well
                </span>
              </div>

              {/* Overall bar */}
              <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', maxWidth: 360 }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${overallColor}, ${overallColor}88)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore ?? 0}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 6 Engine scores ─────────────────────────────────────────────────── */}
      {engineScores.length > 0 && (
        <motion.div variants={fadeUp}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Intelligence Engine Scores™
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {engineScores.map((eng, i) => {
              const accent = ENGINE_ACCENT[i] ?? '#4ab6d4'
              const short  = eng.engineName.replace(' Intelligence Engine™', '').replace('™', '')
              const ec     = scoreColor(eng.score)
              return (
                <div
                  key={eng.engineId}
                  className="rounded-2xl p-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderTop: `2px solid ${accent}`,
                  }}
                >
                  <p className="text-[10px] font-semibold leading-snug" style={{ color: accent }}>{short}</p>
                  <p className="text-2xl font-black mt-1.5 tabular-nums" style={{ color: ec }}>{eng.score}</p>
                  <div className="mt-1.5 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ec }}
                      initial={{ width: 0 }}
                      animate={{ width: `${eng.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {maturityFromScore(eng.score)}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ── 16-Pillar Scorecard ──────────────────────────────────────────────── */}
      {pillarScores.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            16-Pillar Diagnostic Scorecard™ — tap any pillar to see findings
          </p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5"
          >
            {sortedPillars.map((p, i) => (
              <PillarCard key={p.pillarId} p={p} index={i} />
            ))}
          </motion.div>

          {/* Maturity legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(MATURITY_COLOR).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Executive Intelligence Report™ ──────────────────────────────────── */}
      {engagement.notes && (
        <motion.div variants={fadeUp}>
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#4ab6d4' }}>
                  Executive Intelligence Report™
                </p>
                <p className="text-base font-black text-white">
                  {engagement.clientName} — BIDS™ Diagnostic
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Generated by WAANDA · Reviewed by Kangqore Consultant
                </p>
              </div>
              {engagement.consultantApprovedAt && (
                <div
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background: '#00c87518', border: '1px solid #00c87530', color: '#00c875' }}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Consultant Approved
                </div>
              )}
            </div>
            <ExecReport notes={engagement.notes} />
          </div>
        </motion.div>
      )}

      {/* ── Deliverables ─────────────────────────────────────────────────────── */}
      {engagement.deliverables?.length > 0 && (
        <motion.div variants={fadeUp}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Engagement Deliverables
          </p>
          <div
            className="rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-2"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {engagement.deliverables.map(d => (
              <div key={d.n} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: d.status === 'COMPLETE' ? '#00c87522' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${d.status === 'COMPLETE' ? '#00c87540' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {d.status === 'COMPLETE'
                    ? <CheckCircle2 className="w-3 h-3" style={{ color: '#00c875' }} />
                    : <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                  }
                </div>
                <span
                  className="text-xs"
                  style={{ color: d.status === 'COMPLETE' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}
                >
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Transformation Roadmap (shown when activated) ───────────────────── */}
      {engagement.roadmapActivatedAt && engagement.roadmap?.phases && (
        <motion.div variants={fadeUp}>
          <RoadmapView roadmap={engagement.roadmap} activatedAt={engagement.roadmapActivatedAt} />
        </motion.div>
      )}

      {/* ── Footer note ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-center italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
          This report was generated by WAANDA — Kangqore's enterprise intelligence system — and reviewed by a certified Kangqore consultant.
          All scores reflect the state at time of assessment.
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Roadmap view (client-facing) ──────────────────────────────────────────────

const HORIZON_COLOR: Record<string, string> = {
  '30-day':  '#e2445c',
  '60-day':  '#fdab3d',
  '90-day':  '#4ab6d4',
  '180-day': '#00c875',
}

function RoadmapView({ roadmap, activatedAt }: { roadmap: TransformationRoadmap; activatedAt: string }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Zap className="w-4 h-4" style={{ color: '#4ab6d4' }} />
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4ab6d4' }}>
            Transformation Roadmap™
          </p>
        </div>
        <p className="text-base font-black text-white">Your BIDS™ Transformation Plan</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Activated {new Date(activatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ·
          {' '}{roadmap.phases.length} phases · {roadmap.phases.reduce((n, ph) => n + ph.projects.length, 0)} projects
        </p>
      </div>

      {/* Phase cards */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roadmap.phases.map(phase => {
            const hc = HORIZON_COLOR[phase.horizon] ?? '#4ab6d4'
            return (
              <div
                key={phase.horizon}
                className="rounded-xl p-4"
                style={{
                  background:  hc + '08',
                  border:      `1px solid ${hc}20`,
                  borderTop:   `2px solid ${hc}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: hc }}>
                    {phase.horizon}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: hc + '18', color: hc }}>
                    {phase.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-1 text-white">{phase.label}</p>
                <p className="text-[11px] leading-snug mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{phase.focus}</p>
                <div className="space-y-1.5">
                  {phase.projects.map((proj, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: hc }} />
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{proj.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Service prescriptions */}
        {roadmap.servicePrescriptions.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Recommended Kangqore Programmes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roadmap.servicePrescriptions.slice(0, 6).map((sp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{sp.recommendedService}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {sp.pillarName} · target {sp.targetScore}/100
                    </p>
                  </div>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color: scoreColor(sp.currentScore) }}>
                    +{sp.targetScore - sp.currentScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
