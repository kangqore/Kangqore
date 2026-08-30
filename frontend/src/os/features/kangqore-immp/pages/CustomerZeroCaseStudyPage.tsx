import { Link } from 'react-router-dom'
import {
  Award, TrendingUp, Zap, ShieldCheck, Brain, BarChart2,
  CheckCircle2, ArrowRight, Cpu, Target, Lightbulb, Users,
} from 'lucide-react'

const BASE = '/kangqore-view/admin/kangqore-immp'

// ── Design tokens ──────────────────────────────────────────────────────────────
const S1 = 'var(--os-surface-1)'
const S2 = 'var(--os-surface-2)'
const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const T3 = 'var(--os-text-3)'
const T4 = 'var(--os-text-4)'
const BDR = 'var(--os-border)'
const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const PURPLE = '#7c3aed'
const GOLD   = '#d4a017'
const TEAL   = '#0d9488'

// ── KPI strip card ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: S2, border: `1px solid ${color}25`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12, padding: '16px 20px',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 11, color: T3, marginTop: 5 }}>{sub}</div>
    </div>
  )
}

// ── Win card ──────────────────────────────────────────────────────────────────
function WinCard({
  icon: Icon, title, desc, color, link, linkLabel,
}: { icon: any; title: string; desc: string; color: string; link?: string; linkLabel?: string }) {
  return (
    <div style={{
      background: S1, border: `1px solid ${BDR}`,
      borderRadius: 12, padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: color + '18', border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T1, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 11, color: T3, lineHeight: 1.65 }}>{desc}</div>
      </div>
      {link && (
        <Link to={link} style={{
          fontSize: 10, fontWeight: 700, color, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto',
        }}>
          {linkLabel ?? 'View'} <ArrowRight size={10} />
        </Link>
      )}
    </div>
  )
}

// ── Phase step ────────────────────────────────────────────────────────────────
function PhaseStep({ num, label, detail, done }: { num: string; label: string; detail: string; done: boolean }) {
  const col = done ? GREEN : BLUE
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
        background: col + '18', border: `2px solid ${col}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: col,
      }}>
        {done ? '✓' : num}
      </div>
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: done ? T2 : T1, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 11, color: T3, lineHeight: 1.6 }}>{detail}</div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CustomerZeroCaseStudyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, #0c1320 0%, #0e0e2a 50%, #0a1a10 100%)`,
        border: `1px solid ${GREEN}20`,
        borderRadius: 16, padding: '32px 36px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: `${GREEN}08`, filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: `${GOLD}18`, border: `1px solid ${GOLD}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Award size={18} style={{ color: GOLD }} />
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase',
                color: GOLD, background: `${GOLD}12`, border: `1px solid ${GOLD}25`,
                padding: '3px 10px', borderRadius: 20,
              }}>
                Customer Zero™ Case Study
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f0f0ff', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Kangqore runs its business<br />on Kangqore OS
            </h1>
            <p style={{ fontSize: 13, color: '#9898c0', margin: 0, lineHeight: 1.7, maxWidth: 520 }}>
              We built an enterprise operating system. Then we deployed it on ourselves — 14 modules, 80 governance agents, live OIS tracking — before pitching it to a single customer.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {[
              { label: 'OIS™ Day 0',  value: '78.9', col: BLUE   },
              { label: 'OIS™ Now',    value: '88.6', col: GREEN  },
              { label: 'COIG™ Gain', value: '+9.7', col: GOLD  },
              { label: 'Days Live',   value: '1',    col: TEAL   },
            ].map(m => (
              <div key={m.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
                padding: '8px 16px', background: 'rgba(255,255,255,0.04)',
                borderRadius: 8, border: `1px solid rgba(255,255,255,0.06)`,
              }}>
                <span style={{ fontSize: 10, color: '#7878a4', fontWeight: 500 }}>{m.label}</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI strip ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard label="OIS™ Baseline (Day 0)"   value="78.9"   sub="Locked 2026-07-16, pre-go-live"             color={BLUE}   />
        <KpiCard label="OIS™ At Go-Live"         value="88.6"   sub="+9.7 pts above baseline · Grade A"          color={GREEN}  />
        <KpiCard label="COIG™ Gain"              value="+9.7"   sub="Operational intelligence gain, Day 30"       color={GOLD}   />
        <KpiCard label="Target Exceeded"         value="Day 1"  sub="Day 90 target of 85.0 exceeded at launch"   color={TEAL}   />
      </div>

      {/* ── 2-col: Challenge + Deployment ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* The Challenge */}
        <div style={{ background: S1, border: `1px solid ${BDR}`, borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: PURPLE }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: PURPLE }}>The Challenge</span>
          </div>

          <p style={{ fontSize: 13, fontWeight: 700, color: T1, margin: '0 0 12px', lineHeight: 1.45 }}>
            "Build it, sell it" is not a strategy.
          </p>
          <p style={{ fontSize: 12, color: T3, margin: '0 0 12px', lineHeight: 1.7 }}>
            Kangqore had built a 14-module enterprise operating system with a full AI layer (KIMMP), governance framework (AEGIS), and revenue engine. The problem: we had never run it internally at scale.
          </p>
          <p style={{ fontSize: 12, color: T3, margin: 0, lineHeight: 1.7 }}>
            No enterprise buyer trusts a platform the vendor doesn't eat. We needed a Customer Zero proof before we could credibly walk into HDFC or Birla and pitch OIS transformation.
          </p>
        </div>

        {/* The Deployment */}
        <div style={{ background: S1, border: `1px solid ${BDR}`, borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: BLUE }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: BLUE }}>The Deployment</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PhaseStep num="1" label="Blueprint™ Generated & Activated" detail="Kangqore OS v1.0 blueprint created from live DB. Status flipped to ACTIVE on 2026-07-17." done={true} />
            <PhaseStep num="2" label="OIS™ Day 0 Baseline Locked"         detail="78.9 OIS snapshot locked on 2026-07-16. 9 pillars measured across 14 modules." done={true} />
            <PhaseStep num="3" label="AEGIS Governance Deployed"           detail="80 agents across 10 engines. GovernanceOps fully live. Autonomy log recording." done={true} />
            <PhaseStep num="4" label="Revenue Intelligence Live"           detail="₹3.25Cr pipeline waterfall. HDFC/Bajaj/Birla tracked. Proposal Builder operational." done={true} />
          </div>
        </div>
      </div>

      {/* ── 5 wins ────────────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 2px' }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: T4 }}>5 Capabilities Proven</span>
          <div style={{ flex: 1, height: 1, background: BDR }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <WinCard
            icon={Brain} color={PURPLE} title="Decision Intelligence"
            desc="KIMMP strategic decisions linked to workflow canvas nodes. Run KIMMP button → live reasoning stored with evidence."
            link={`${BASE}/decisions`} linkLabel="Decisions"
          />
          <WinCard
            icon={BarChart2} color={GREEN} title="Revenue Intelligence"
            desc="Full COIG waterfall with ₹3.25Cr pipeline. Probability-weighted ARR. Live at-risk signals from OIS scores."
            link={`${BASE}/revenue-pipeline`} linkLabel="Revenue Intel"
          />
          <WinCard
            icon={ShieldCheck} color={TEAL} title="AEGIS Governance"
            desc="80 agents, 10 engines. Every action logged. Autonomy events tracked. Compliance-grade audit trail from Day 1."
            link={`${BASE}/ai-governance`} linkLabel="AEGIS"
          />
          <WinCard
            icon={Zap} color={BLUE} title="WAANDA Automation"
            desc="Workflow orchestration with multi-step execution, conditional triggers, and mission dispatch. Zero manual ops."
            link={`${BASE}/workflows`} linkLabel="Workflows"
          />
          <WinCard
            icon={Cpu} color={GOLD} title="Krisnam Gen2 Inference"
            desc="Local Llama 3.2-3B running on-device via MLX. Gen2 inference panel live in Training. Sub-30s responses."
            link={`${BASE}/training`} linkLabel="Training"
          />
        </div>
      </div>

      {/* ── Lessons + Quote ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Lessons learned */}
        <div style={{ background: S1, border: `1px solid ${BDR}`, borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Lightbulb size={12} style={{ color: GOLD }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD }}>What We Learned</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                title: 'OIS Day 0 was lower than expected',
                detail: '78.9 vs anticipated 82. The gap revealed gaps in Adoption pillar (5% weight) and Learning layer — both fixable but required honest instrumentation.',
              },
              {
                title: 'Proposal Builder needs real lead data',
                detail: 'Demo leads generated realistic proposals, but HDFC/Bajaj contextual nuance only emerges with real CRM records tied to real conversations.',
              },
              {
                title: 'Gen2 inference is offline-first',
                detail: 'Krisnam MLX server must be manually restarted after reboot. Acceptable for Customer Zero. Customer One needs auto-start or cloud fallback.',
              },
              {
                title: 'COIG overshot our 90-day target at launch',
                detail: 'Day 90 target was 85.0. We hit 88.6 at go-live. This means the engineering process itself delivered intelligence value, not just the runtime.',
              },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T2, marginBottom: 3 }}>{l.title}</div>
                  <div style={{ fontSize: 10, color: T3, lineHeight: 1.6 }}>{l.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proof + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quote */}
          <div style={{
            background: `linear-gradient(135deg, ${BLUE}10, ${PURPLE}08)`,
            border: `1px solid ${BLUE}22`,
            borderRadius: 14, padding: '24px',
            flex: 1,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: BLUE, marginBottom: 16 }}>
              From the Operator
            </div>
            <blockquote style={{
              fontSize: 15, fontWeight: 600, color: T1, lineHeight: 1.65,
              margin: 0, fontStyle: 'italic',
            }}>
              "We built it. We deployed it. We run our business on it. The first question any serious enterprise buyer asks is: do you use your own product? The answer is now yes — and the OIS score proves it."
            </blockquote>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff',
              }}>
                K
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T2 }}>Kangqore Leadership</div>
                <div style={{ fontSize: 9, color: T4 }}>Customer Zero · OIS Grade A</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: S2, border: `1px solid ${GREEN}25`,
            borderRadius: 14, padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={14} style={{ color: GREEN }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                Customer Zero is live. You could be Customer One.
              </span>
            </div>
            <p style={{ fontSize: 11, color: T3, margin: 0, lineHeight: 1.6 }}>
              Kangqore OS v1.0 — Blueprint™ ready. BIDS™ Professional Services Pack includes 16 intelligence pillars calibrated for consulting and professional services firms.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`${BASE}/revenue-pipeline`} style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
                padding: '8px 16px', borderRadius: 8,
                background: GREEN, color: '#fff', textDecoration: 'none',
              }}>
                <Target size={12} /> View Pipeline
              </Link>
              <Link to={`${BASE}/proposal-builder`} style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
                padding: '8px 16px', borderRadius: 8,
                background: `${BLUE}15`, color: BLUE,
                border: `1px solid ${BLUE}30`, textDecoration: 'none',
              }}>
                <TrendingUp size={12} /> Build Proposal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer meta ───────────────────────────────────────────────────── */}
      <div style={{
        background: S1, border: `1px solid ${BDR}`, borderRadius: 10,
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <ShieldCheck size={11} style={{ color: T4 }} />
        <span style={{ fontSize: 9, color: T4 }}>Verified by <strong style={{ color: T3 }}>WAANDA Enterprise Intelligence Engine</strong></span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 9, color: T4 }}>OIS Baseline locked: <strong style={{ color: T3 }}>2026-07-16</strong></span>
        <span style={{ fontSize: 9, color: T4 }}>Go-Live: <strong style={{ color: GREEN }}>2026-07-17</strong></span>
        <span style={{ fontSize: 9, color: T4 }}>Blueprint: <strong style={{ color: BLUE }}>ACTIVE</strong></span>
      </div>

    </div>
  )
}
