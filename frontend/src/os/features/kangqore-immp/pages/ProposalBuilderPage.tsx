import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FileText, Zap, ChevronDown, CheckCircle,
  TrendingUp, Calendar, DollarSign, ArrowRight, Copy, Check,
} from 'lucide-react'
import { adminApi, api, isDemo } from '@lib/api'

// ─── Design tokens ──────────────────────────────────────────────────────────────

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const GOLD   = '#d4a017'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CrmLead {
  id:             string
  company:        string
  stage:          string
  score:          number
  value:          number
  projectedValue: number
}

interface KpiTarget { kpi: string; baseline: string; target: string }
interface TimelinePhase { phase: string; duration: string; milestone: string }
interface Investment { engagement: string; roi: string; paybackPeriod: string }

interface Proposal {
  title:             string
  executiveSummary:  string
  challenges:        string[]
  solutionNarrative: string
  kpiTargets:        KpiTarget[]
  timeline:          TimelinePhase[]
  investment:        Investment
  nextSteps:         string[]
}

interface ProposalResult {
  proposal: Proposal
  lead: { companyName: string; projectedValue: string; stage: string; packId: string; packName: string }
}

// ─── Pack options ─────────────────────────────────────────────────────────────

const PACKS = [
  { id: 'ps-pack-v1',         name: 'Professional Services Pack™', color: BLUE,   emoji: '🏢' },
  { id: 'fintech-pack-v1',    name: 'FinTech Pack™',               color: TEAL,   emoji: '🏦' },
  { id: 'healthcare-pack-v1', name: 'Healthcare Pack™',            color: GREEN,  emoji: '🏥' },
]

const DEMO_LEADS: CrmLead[] = [
  { id: 'l13', company: 'Birla Digital Labs',  stage: 'negotiation', score: 95, value: 2500000,  projectedValue: 2500000 },
  { id: 'l14', company: 'HDFC Bank Digital',   stage: 'proposal',    score: 88, value: 18000000, projectedValue: 18000000 },
  { id: 'l15', company: 'Bajaj Finserv',       stage: 'qualified',   score: 76, value: 12000000, projectedValue: 12000000 },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--os-text-4)', marginBottom: 8 }}>
      {children}
    </div>
  )
}

function ProposalView({ result }: { result: ProposalResult }) {
  const [copied, setCopied] = useState(false)
  const p = result.proposal

  function copyMarkdown() {
    const md = `# ${p.title}
**Company:** ${result.lead.companyName} · **Pack:** ${result.lead.packName} · **Value:** ${result.lead.projectedValue}

## Executive Summary
${p.executiveSummary}

## Key Challenges
${p.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Our Solution
${p.solutionNarrative}

## KPI Targets (90-day)
${p.kpiTargets.map(k => `- **${k.kpi}**: ${k.baseline} → ${k.target}`).join('\n')}

## Implementation Timeline
${p.timeline.map(t => `- **${t.phase}** (${t.duration}): ${t.milestone}`).join('\n')}

## Investment
${p.investment.engagement}
ROI: ${p.investment.roi}
Payback: ${p.investment.paybackPeriod}

## Next Steps
${p.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`
    navigator.clipboard.writeText(md).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Proposal header */}
      <div style={{
        background: `linear-gradient(135deg, ${PURPLE}12, ${BLUE}08)`,
        border: `1px solid ${PURPLE}25`, borderRadius: 14, padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              WAANDA Enterprise Proposal · {result.lead.packName}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.2 }}>
              {p.title}
            </h2>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{result.lead.companyName}</span>
              <span style={{ fontSize: 11, color: 'var(--os-text-4)' }}>·</span>
              <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>{result.lead.projectedValue}</span>
              <span style={{ fontSize: 11, color: 'var(--os-text-4)' }}>·</span>
              <span style={{ fontSize: 11, color: AMBER, fontWeight: 600, textTransform: 'capitalize' }}>{result.lead.stage}</span>
            </div>
          </div>
          <button
            onClick={copyMarkdown}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer', flexShrink: 0,
              background: copied ? GREEN + '15' : 'var(--os-surface-3)',
              border: `1px solid ${copied ? GREEN + '30' : 'var(--os-border)'}`,
              color: copied ? GREEN : 'var(--os-text-3)',
              fontSize: 10, fontWeight: 700,
            }}
          >
            {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
            {copied ? 'Copied' : 'Copy MD'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.65 }}>
          {p.executiveSummary}
        </p>
      </div>

      {/* Challenges + Solution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          background: 'var(--os-card)', border: '1px solid var(--os-border)',
          borderRadius: 12, padding: '16px 18px',
        }}>
          <SectionLabel>Key Challenges</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {p.challenges?.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: AMBER, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: 'var(--os-card)', border: `1px solid ${BLUE}20`,
          borderRadius: 12, padding: '16px 18px',
        }}>
          <SectionLabel>Our Solution</SectionLabel>
          <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.65 }}>
            {p.solutionNarrative}
          </p>
        </div>
      </div>

      {/* KPI Targets */}
      <div style={{
        background: 'var(--os-card)', border: '1px solid var(--os-border)',
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <TrendingUp style={{ width: 13, height: 13, color: GREEN }} />
          <SectionLabel>KPI Targets — 90-Day Commitments</SectionLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {p.kpiTargets?.map((k, i) => (
            <div key={i} style={{
              background: GREEN + '08', border: `1px solid ${GREEN}20`,
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)', marginBottom: 6 }}>{k.kpi}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{k.baseline}</span>
                <ArrowRight style={{ width: 10, height: 10, color: GREEN }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>{k.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'var(--os-card)', border: '1px solid var(--os-border)',
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Calendar style={{ width: 13, height: 13, color: BLUE }} />
          <SectionLabel>Implementation Timeline</SectionLabel>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {p.timeline?.map((t, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 14px',
              borderRight: i < (p.timeline?.length ?? 0) - 1 ? '1px solid var(--os-border)' : 'none',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 9, fontWeight: 800, color: BLUE, textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4,
              }}>Phase {i + 1} · {t.duration}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 4 }}>{t.phase}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)', lineHeight: 1.4 }}>{t.milestone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment + Next Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{
          background: 'var(--os-card)', border: `1px solid ${GOLD}20`,
          borderRadius: 12, padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <DollarSign style={{ width: 13, height: 13, color: GOLD }} />
            <SectionLabel>Investment</SectionLabel>
          </div>
          <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: '0 0 8px', lineHeight: 1.5 }}>
            {p.investment?.engagement}
          </p>
          <div style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>{p.investment?.roi}</div>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 4 }}>Payback: {p.investment?.paybackPeriod}</div>
        </div>
        <div style={{
          background: 'var(--os-card)', border: '1px solid var(--os-border)',
          borderRadius: 12, padding: '16px 18px',
        }}>
          <SectionLabel>Next Steps</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {p.nextSteps?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <CheckCircle style={{ width: 12, height: 12, color: GREEN, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProposalBuilderPage() {
  const [selectedLead, setSelectedLead] = useState<string>('')
  const [selectedPack, setSelectedPack] = useState<string>('')
  const [customNote,   setCustomNote]   = useState('')
  const [generating,   setGenerating]   = useState(false)
  const [result,       setResult]       = useState<ProposalResult | null>(null)
  const [genErr,       setGenErr]       = useState('')
  const [showLeadDrop, setShowLeadDrop] = useState(false)

  const { data: leadsRaw = [] } = useQuery<CrmLead[]>({
    queryKey: ['proposal-leads'],
    queryFn:  () => adminApi('/admin/eqore/leads'),
    enabled:  !isDemo(),
    staleTime: 120_000,
  })

  const leads = isDemo() || leadsRaw.length === 0 ? DEMO_LEADS : leadsRaw
  const activeLead  = leads.find(l => l.id === selectedLead)
  const activePack  = PACKS.find(p => p.id === selectedPack)
  const canGenerate = selectedLead && selectedPack && !generating

  async function generate() {
    if (!canGenerate) return
    setGenerating(true); setResult(null); setGenErr('')
    try {
      const res = await api.post('/admin/kangqore-immp/proposals/generate', {
        leadId: selectedLead, packId: selectedPack,
        customNote: customNote.trim() || undefined,
      })
      setResult(res.data)
    } catch (e: any) {
      setGenErr(e?.response?.data?.error || e?.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const STAGE_COLOR: Record<string, string> = {
    negotiation: TEAL, proposal: BLUE, qualified: PURPLE, won: GREEN, contacted: AMBER, new: '#6b7280',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <FileText style={{ width: 20, height: 20, color: PURPLE }} />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Proposal Builder</h2>
          <span style={{
            fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 10,
            background: PURPLE + '15', color: PURPLE, border: `1px solid ${PURPLE}30`, marginLeft: 4,
          }}>WAANDA</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: 0 }}>
          Select a CRM prospect + industry pack → WAANDA generates a tailored enterprise proposal
        </p>
      </div>

      {/* Builder form */}
      <div style={{
        background: 'var(--os-card)', border: '1px solid var(--os-border)',
        borderRadius: 14, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Lead selector */}
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            Select Prospect
          </label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLeadDrop(d => !d)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
                color: activeLead ? 'var(--os-text-1)' : 'var(--os-text-4)',
                fontSize: 12, fontWeight: activeLead ? 700 : 400,
              }}
            >
              <span>
                {activeLead ? (
                  <>
                    {activeLead.company}
                    <span style={{ fontSize: 10, color: STAGE_COLOR[activeLead.stage] ?? '#6b7280', fontWeight: 600, marginLeft: 10 }}>
                      {activeLead.stage}
                    </span>
                    <span style={{ fontSize: 10, color: GOLD, fontWeight: 600, marginLeft: 8 }}>
                      WAANDA {activeLead.score}
                    </span>
                  </>
                ) : 'Choose a prospect…'}
              </span>
              <ChevronDown style={{ width: 14, height: 14, color: 'var(--os-text-4)' }} />
            </button>
            {showLeadDrop && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                background: 'var(--os-card)', border: '1px solid var(--os-border)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                marginTop: 4, overflow: 'hidden',
              }}>
                {leads.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { setSelectedLead(l.id); setShowLeadDrop(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: '1px solid var(--os-border)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{l.company}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: STAGE_COLOR[l.stage] ?? '#6b7280', textTransform: 'capitalize' }}>{l.stage}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: GOLD }}>Score {l.score}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pack selector */}
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            Select Industry Pack
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {PACKS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPack(p.id === selectedPack ? '' : p.id)}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: selectedPack === p.id ? p.color + '14' : 'var(--os-surface-0)',
                  border: `1.5px solid ${selectedPack === p.id ? p.color + '50' : 'var(--os-border)'}`,
                  display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: selectedPack === p.id ? p.color : 'var(--os-text-3)', textAlign: 'center', lineHeight: 1.3 }}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional note */}
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
            Context note (optional)
          </label>
          <textarea
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            rows={2}
            placeholder="e.g. Focus on regulatory compliance, CFO is the economic buyer, 6-month decision timeline…"
            style={{
              width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
              borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'var(--os-text-2)',
              outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5,
            }}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 10, cursor: canGenerate ? 'pointer' : 'not-allowed',
            background: canGenerate ? PURPLE : 'var(--os-surface-0)',
            border: 'none', color: canGenerate ? '#fff' : 'var(--os-text-4)',
            fontSize: 13, fontWeight: 700, opacity: generating ? 0.75 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {generating
            ? <><span style={{ fontSize: 14 }}>⟳</span> WAANDA is generating…</>
            : <><Zap style={{ width: 14, height: 14 }} /> Generate Proposal</>
          }
        </button>

        {genErr && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: '#ef444412', border: '1px solid #ef444425' }}>
            <p style={{ fontSize: 11, color: '#ef4444', margin: 0 }}>{genErr}</p>
          </div>
        )}
      </div>

      {/* Result */}
      {result && <ProposalView result={result} />}
    </div>
  )
}
