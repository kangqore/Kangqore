import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Users, Landmark, Factory, Briefcase, Star,
  TrendingUp, Globe, Cpu, Cloud, BarChart3, Bot, Zap, Lock,
  Scale, Sparkles, RefreshCw, Activity,
  Database, Award, Layers, Shield, ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import BIDSProductVisual from '../components/hero/BIDSProductVisual';
import VisualBackground from '../components/VisualBackground';
import ConciergeSection from '../components/concierge/ConciergeSection';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const pillars = [
  { n: '01', icon: Target,      name: 'Business Strategy Intelligence™',       score: 'Strategy Maturity Score™ · Growth Readiness Index™' },
  { n: '02', icon: Users,       name: 'Leadership Intelligence™',              score: 'Leadership Effectiveness Score™' },
  { n: '03', icon: Landmark,    name: 'Financial Intelligence™',               score: 'Financial Health Score™' },
  { n: '04', icon: Factory,     name: 'Operational Intelligence™',             score: 'Operational Efficiency Score™' },
  { n: '05', icon: Briefcase,   name: 'Workforce Intelligence™',               score: 'Workforce Readiness Score™' },
  { n: '06', icon: Star,        name: 'Customer Intelligence™',                score: 'Customer Experience Score™' },
  { n: '07', icon: TrendingUp,  name: 'Sales Intelligence™',                   score: 'Revenue Engine Score™' },
  { n: '08', icon: Globe,       name: 'Growth Intelligence™',                  score: 'Digital Growth Score™' },
  { n: '09', icon: Cpu,         name: 'Technology Intelligence™',              score: 'Technology Maturity Score™' },
  { n: '10', icon: Cloud,       name: 'Cloud & Infrastructure Intelligence™',  score: 'Infrastructure Readiness Score™' },
  { n: '11', icon: Database,    name: 'Data Intelligence™',                    score: 'Data Maturity Score™' },
  { n: '12', icon: Bot,         name: 'AI Intelligence™',                      score: 'AI Readiness Score™' },
  { n: '13', icon: Zap,         name: 'Automation Intelligence™',              score: 'Automation Maturity Score™' },
  { n: '14', icon: Lock,        name: 'Cybersecurity Intelligence™',           score: 'Cyber Resilience Score™' },
  { n: '15', icon: Scale,       name: 'Governance & Risk Intelligence™',       score: 'Governance Maturity Score™' },
  { n: '16', icon: Sparkles,    name: 'Transformation Intelligence™',          score: 'Transformation Readiness Score™' },
];

const engines = [
  {
    dept: 'Cognition',
    name: 'Cognition Intelligence Engine™',
    icon: Bot,
    color: 'from-cyan-400 via-sky-400 to-blue-500',
    desc: 'Diagnoses AI readiness, GenAI adoption potential, data maturity for intelligence workloads, and automation opportunity across the enterprise.',
  },
  {
    dept: 'Foundry',
    name: 'Foundry Intelligence Engine™',
    icon: Cloud,
    color: 'from-blue-400 via-indigo-400 to-blue-600',
    desc: 'Evaluates infrastructure health, cloud migration readiness, engineering platform maturity, and technology resilience against operational demands.',
  },
  {
    dept: 'Reimagine',
    name: 'Reimagine Intelligence Engine™',
    icon: RefreshCw,
    color: 'from-violet-400 via-purple-400 to-fuchsia-500',
    desc: 'Identifies modernization priorities, legacy system exposure, digital transformation readiness, and change execution capability.',
  },
  {
    dept: 'Shield',
    name: 'Shield Intelligence Engine™',
    icon: Shield,
    color: 'from-rose-400 via-pink-400 to-red-500',
    desc: 'Assesses cybersecurity posture, compliance gap exposure, AI governance coverage, and operational trust maturity across business systems.',
  },
  {
    dept: 'Platforms',
    name: 'Platforms Intelligence Engine™',
    icon: Layers,
    color: 'from-amber-400 via-orange-400 to-orange-500',
    desc: 'Diagnoses enterprise platform utilization, integration complexity, process maturity, and consolidation opportunities across technology stacks.',
  },
  {
    dept: 'Growth',
    name: 'Growth Intelligence Engine™',
    icon: TrendingUp,
    color: 'from-emerald-400 via-teal-400 to-green-500',
    desc: 'Maps revenue engine performance, marketing execution gaps, conversion bottlenecks, and digital visibility against growth potential.',
  },
];

const deliverables = [
  { icon: BarChart3,   name: 'Diagnostic Scorecard™',          desc: 'Enterprise-wide scoring across all sixteen intelligence pillars.' },
  { icon: Award,       name: 'Executive Intelligence Report™',  desc: 'Comprehensive executive-level findings and recommendations.' },
  { icon: Layers,      name: 'Transformation Blueprint™',       desc: 'Prioritized transformation strategy and execution roadmap.' },
  { icon: Shield,      name: 'Risk Register™',                  desc: 'Identified organizational, technology, operational, and cybersecurity risks.' },
  { icon: Sparkles,    name: 'Opportunity Register™',           desc: 'High-value growth, efficiency, AI, automation, and modernization opportunities.' },
  { icon: Target,      name: 'Service Prescription Matrix™',    desc: 'Recommended Kangqore capabilities aligned to identified needs.' },
  { icon: RefreshCw,   name: '30/60/90/180-Day Roadmap™',       desc: 'A phased transformation execution plan.' },
  { icon: Users,       name: 'Executive Board Presentation™',   desc: 'Boardroom-ready strategic findings presentation.' },
  { icon: Activity,    name: 'Executive Workshop™',             desc: 'Leadership alignment and transformation planning session.' },
  { icon: TrendingUp,  name: 'ROI Projection Report™',          desc: 'Estimated value creation, efficiency gains, risk reduction, and growth potential.' },
];

const editions = [
  'Manufacturing Edition™', 'Education Edition™', 'Healthcare Edition™',
  'Financial Services Edition™', 'Retail & Commerce Edition™', 'SaaS & Technology Edition™',
  'Government Edition™', 'Startup Edition™', 'Enterprise Edition™', 'Non-Profit Edition™',
];

const pillarDetails = [
  { tagline: 'Align strategy to market reality.', desc: 'Evaluate strategic coherence, competitive positioning, and growth readiness across business units and leadership alignment.' },
  { tagline: 'Lead with intelligence.', desc: 'Measure executive effectiveness, decision velocity, and organizational alignment from the top down.' },
  { tagline: 'Understand your financial health.', desc: 'Diagnose financial performance, capital efficiency, and investment allocation gaps across the enterprise.' },
  { tagline: 'Remove operational drag.', desc: 'Surface inefficiencies, process bottlenecks, and execution gaps that silently constrain performance.' },
  { tagline: 'Build the workforce of the future.', desc: 'Assess talent readiness, skills gaps, and workforce capability against transformation demands.' },
  { tagline: 'Earn loyalty through intelligence.', desc: 'Measure customer experience maturity, satisfaction drivers, and retention risk across every touchpoint.' },
  { tagline: 'Unlock revenue performance.', desc: 'Diagnose pipeline health, conversion efficiency, and revenue engine constraints from top to bottom of funnel.' },
  { tagline: 'Accelerate digital growth.', desc: 'Identify digital channel performance gaps, growth constraints, and untapped revenue opportunities.' },
  { tagline: 'Future-proof your technology.', desc: 'Benchmark technology maturity, stack fragmentation, and technical debt against industry standards.' },
  { tagline: 'Scale with confidence.', desc: 'Assess cloud readiness, infrastructure resilience, and platform scalability for enterprise growth.' },
  { tagline: 'Turn data into a strategic asset.', desc: 'Evaluate data quality, governance maturity, and analytics capability across the enterprise.' },
  { tagline: 'Deploy AI that delivers.', desc: 'Measure AI readiness, GenAI maturity, and the organizational capacity to adopt and govern AI systems.' },
  { tagline: 'Automate intelligently.', desc: 'Identify automation opportunities, RPA/DPA readiness, and workflow orchestration gaps across the enterprise.' },
  { tagline: 'Build a resilient security posture.', desc: 'Quantify cyber exposure, vulnerability surface, and incident readiness across systems and teams.' },
  { tagline: 'Govern with confidence.', desc: 'Assess governance frameworks, risk management maturity, and regulatory compliance posture across the organization.' },
  { tagline: 'Execute transformation that sticks.', desc: 'Measure transformation readiness, change management capability, and strategic execution velocity.' },
];

const symptoms = [
  'Slower growth', 'Rising operational costs', 'Reduced productivity',
  'Customer friction', 'Technology complexity', 'Security concerns',
  'Inconsistent execution', 'Poor return on investment', 'Transformation initiatives that fail to deliver',
];

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function BIDSPage() {
  const [heroRef, heroVisible]         = useScrollAnimation({ once: true, threshold: 0.1 });
  const [problemRef, problemVisible]   = useScrollAnimation({ once: true, threshold: 0.1 });
  const [defRef, defVisible]           = useScrollAnimation({ once: true, threshold: 0.1 });
  const [pillarsRef, pillarsVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [enginesRef, enginesVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [delivRef, delivVisible]       = useScrollAnimation({ once: true, threshold: 0.05 });
  const [editionsRef, editionsVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const [ctaRef, ctaVisible]           = useScrollAnimation({ once: true, threshold: 0.2 });
  const [activePillar, setActivePillar] = useState(0);
  const [activeDeliverable, setActiveDeliverable] = useState(0);

  return (
    <div className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>
      <SEO
        title="Kangqore BIDS™ — Business Diagnostic Intelligence System™"
        description="The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. 16 diagnostic pillars. 6 intelligence engines. One complete diagnostic."
        keywords="Kangqore BIDS, Business Diagnostic Intelligence System, enterprise diagnostic, transformation blueprint, AI readiness, cybersecurity assessment"
        url="/bids"
      />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-20 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          <VisualBackground forceDark={true} />
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div
          ref={heroRef}
          className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Removed translate-y-10 as we are moving it downwards by reducing pb-32 to pb-20 on the parent section */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                Every organization has visible problems and invisible constraints.
              </p>
            </div>
            
            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-6 drop-shadow-2xl">
              Kangqore{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">BIDS™</span>
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-50 font-semibold tracking-wide mb-4 flex items-center gap-3">
              Kangqore Business Diagnostic Intelligence System™
            </p>
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mb-10 font-medium">
              The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. Reveal hidden constraints before they become critical failures.
            </p>

            {/* Outcome framing */}
            <div className="flex flex-col sm:flex-row gap-px rounded-2xl overflow-hidden border border-white/10 mb-12 bg-white/5 backdrop-blur-md max-w-2xl">
                {[
                  { stat: '8–14', label: 'Hidden constraints found per engagement on average' },
                  { stat: '3×',   label: 'Higher transformation success when diagnosis comes first' },
                  { stat: '100%', label: 'Of engagements surface at least one critical blind spot' },
                ].map((s, i) => (
                  <div key={i} className="flex-1 px-6 py-5 border-r last:border-r-0 border-white/10">
                    <p className="text-2xl font-black bg-brand-gradient bg-clip-text text-transparent mb-1">{s.stat}</p>
                    <p className="text-[11px] text-white/40 font-semibold leading-snug tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">Request a Diagnostic</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <a
                  href="#pillars"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore the 16 Pillars
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>

            </div>
          </div>

        {/* Mobile-only Stats Grid */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-4">
            {[
              { value: '16', label: 'Pillars' },
              { value: '6',  label: 'Engines' },
              { value: '10', label: 'Deliverables' },
              { value: '10', label: 'Editions' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white drop-shadow-lg">{s.value}</p>
                <p className="text-[10px] text-cyan-400/80 font-bold tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>



      {/* ─────────────────────── PROBLEM ─────────────────────── */}
      <section className="py-32 relative">
        <div
          ref={problemRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${problemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-400 uppercase mb-5">
                The Problem
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-8">
                Organizations rarely fail because they lack{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600 filter drop-shadow-[0_0_20px_rgba(225,29,72,0.3)]">ambition.</span>
              </h2>
              <div className="space-y-6 text-white/60 leading-relaxed text-lg sm:text-xl font-medium">
                <p>
                  They struggle because critical constraints remain <span className="font-bold text-white">hidden beneath the surface</span> of the business.
                </p>
                <p>
                  Operational inefficiencies accumulate unnoticed. Technology environments become fragmented. Growth engines underperform. Security risks increase. Decision-making slows.
                </p>
                <p>
                  Without a comprehensive diagnosis, organizations risk investing in solutions that address <em className="text-white/80">symptoms</em> rather than <em className="text-white/80">causes</em>.
                </p>
                <div className="p-6 mt-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <p className="font-black text-white text-xl tracking-wide">
                    This is why we engineered Kangqore BIDS™.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — symptoms plain list */}
            <div className="lg:pt-10">
              <p className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-8">FAMILIAR SYMPTOMS</p>
              <div className="space-y-5">
                {symptoms.map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-white/70 text-base font-semibold">{s}</span>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-sm text-white/40 font-medium leading-relaxed">
                These symptoms are rarely the root problem. The underlying causes exist across interconnected systems, functions, teams, and decision-making structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── WHY WE BUILT BIDS™ ─────────────────────── */}
      <section className="py-24 relative" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-14">WHY KANGQORE CREATED BIDS™</p>
            <div className="space-y-8 font-medium leading-relaxed">
              <p className="text-white/40 text-xl sm:text-2xl">Most consulting firms start with a service.</p>
              <p className="text-white/40 text-xl sm:text-2xl">Most technology firms start with a product.</p>
              <p className="text-white/40 text-xl sm:text-2xl">Most agencies start with a campaign.</p>
              <p className="text-white font-black text-4xl sm:text-5xl lg:text-[3.5rem] tracking-[-0.03em] leading-[1.1] py-4">
                Kangqore starts with diagnosis.
              </p>
              <p className="text-white/50 text-xl sm:text-2xl">
                Because organizations rarely fail because they lack solutions.
              </p>
              <p className="text-white text-xl sm:text-2xl font-semibold">
                They fail because they solve the wrong problems.
              </p>
              <p className="text-white/50 text-lg leading-relaxed max-w-3xl">
                Kangqore BIDS™ was engineered to identify the constraints, risks, inefficiencies, and opportunities hidden beneath the surface of an organization — before major investments are made.
              </p>
              <div className="pt-6 space-y-3">
                <p className="text-white/70 text-xl font-semibold">Only after diagnosis comes prescription.</p>
                <p className="text-white/70 text-xl font-semibold">Only after prescription comes transformation.</p>
              </div>
              <p className="text-cyan-400 font-black text-3xl sm:text-4xl tracking-tight pt-4">
                That is the philosophy behind Kangqore BIDS™.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── CONSTRAINT COST ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-red-400 uppercase mb-8">THE REAL COST</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white">
              Every hidden constraint<br />
              has a <span className="text-red-400">measurable cost.</span>
            </h2>
          </div>
          {/* Table */}
          <div className="mb-20">
            <div className="grid grid-cols-2 pb-5 mb-2">
              <p className="text-[10px] font-black tracking-[0.4em] text-white/25 uppercase">CONSTRAINT</p>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/25 uppercase">BUSINESS IMPACT</p>
            </div>
            {[
              { constraint: 'Poor Processes',           impact: 'Increased operational costs' },
              { constraint: 'Technology Debt',          impact: 'Slower innovation velocity' },
              { constraint: 'Weak Cybersecurity',       impact: 'Higher breach exposure' },
              { constraint: 'Low AI Readiness',         impact: 'Lost competitive advantage' },
              { constraint: 'Data Silos',               impact: 'Poor decision quality' },
              { constraint: 'Workforce Inefficiencies', impact: 'Reduced productivity' },
              { constraint: 'Fragmented Systems',       impact: 'Lower ROI on technology' },
              { constraint: 'Governance Gaps',          impact: 'Compliance and regulatory risk' },
            ].map((row) => (
              <div key={row.constraint} className="grid grid-cols-2 py-6 border-t border-white/[0.06]">
                <p className="text-white font-bold text-lg">{row.constraint}</p>
                <p className="text-white/45 font-medium text-lg">{row.impact}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl sm:text-3xl font-black text-cyan-400 max-w-3xl leading-snug">
            Kangqore BIDS™ quantifies these costs before they become business failures.
          </p>
        </div>
      </section>

      {/* ─────────────────────── DEFINITION ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Top — heading + visual */}
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-20">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHAT IS KANGQORE BIDS™</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-8">
                The complete enterprise<br />
                diagnostic{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">intelligence</span><br />
                framework.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-14 font-medium max-w-xl">
                Kangqore BIDS™ evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem — diagnosing the full enterprise before any transformation investment is made.
              </p>
              {/* Stats strip */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 pt-10 border-t border-white/[0.08]">
                {[
                  { value: '16', label: 'Diagnostic\nPillars' },
                  { value: '6',  label: 'Intelligence\nEngines' },
                  { value: '10', label: 'Executive\nDeliverables' },
                  { value: '10', label: 'Industry\nEditions' },
                  { value: '61', label: 'Specialized\nServices' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</p>
                    <p className="text-white/30 text-[10px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — product visual */}
            <div className="flex justify-center lg:justify-end">
              <BIDSProductVisual isActive={defVisible} />
            </div>
          </div>

          {/* Process strip — 2 rows */}
          <div className="mb-10 space-y-3">
            {[
              [
                { n: '01', label: 'Submit your request',                                color: '#FFAD8A' },
                { n: '02', label: '30-min scoping call for Root Causes Identifications', color: '#FB923C' },
                { n: '03', label: 'Evaluate',                                           color: '#86EFAC' },
                { n: '04', label: 'Score',                                              color: '#FDE047' },
              ],
              [
                { n: '05', label: 'Receive a tailored Diagnose proposal',               color: '#F472B6' },
                { n: '06', label: 'Engagement begins within 2 weeks',                   color: '#22D3EE' },
                { n: '07', label: 'Transform',                                          color: '#A78BFA' },
              ],
            ].map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-x-3">
                {row.map((step, i) => (
                  <React.Fragment key={step.n}>
                    <span className="text-[13px] font-medium tracking-wide whitespace-nowrap" style={{ color: step.color }}>
                      <span className="font-black mr-1.5" style={{ color: step.color + '80' }}>{step.n}</span>{step.label}
                    </span>
                    {i < row.length - 1 && <span className="text-white/15 text-[11px]">→</span>}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          {/* Brand footer bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#080808] border border-white/[0.08] rounded-2xl mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">Kangqore BIDS™</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <span className="text-white/35 text-sm font-medium">Kangqore Business Diagnostic Intelligence System</span>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200 flex-shrink-0"
            >
              Request a Diagnostic Assessment
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Pull quote */}
          <div className="border-l-2 border-white/10 pl-8">
            <p className="text-xl sm:text-2xl font-black text-white/40 leading-snug max-w-4xl">
              "What is preventing this organization from achieving its full potential?"
            </p>
            <p className="text-lg font-black text-white mt-3">
              Kangqore BIDS™ exists to answer this — precisely, quantifiably, and without conflict of interest.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────── eQORE AI CONCIERGE ─────────────────────── */}
      <ConciergeSection inverted suggestedPrompts={[
        'What is Kangqore BIDS™?',
        'What are the 16 diagnostic pillars?',
        'How does a BIDS™ engagement work?',
        'What deliverables do I receive?',
        'How long does an engagement take?',
        'What is the Prescription Engine™?',
        'Which industry edition fits us?',
        'How is BIDS™ different from consulting?',
        'What is Benchmark Intelligence™?',
        'What is the eQORE AI™ role in BIDS™?',
        'What does a BIDS™ scorecard look like?',
        'Request a Diagnostic Assessment',
      ]} />

      {/* ─────────────────────── CEO QUESTIONS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">EXECUTIVE CLARITY</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-10">
                Questions every<br />executive should<br />be able to answer.
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                If these answers are unclear, decisions are made on assumptions — not intelligence. That is where value is lost. Kangqore BIDS™ exists for exactly this reason.
              </p>
            </div>
            <div className="space-y-8 lg:pt-16">
              {[
                'What is limiting our growth?',
                'Where is our highest business risk?',
                'Which investments generate the greatest return?',
                'Are we ready for AI?',
                'Are we secure?',
                'Are we scalable?',
                'Are we transformation-ready?',
              ].map((q, i) => (
                <div key={q} className="flex items-start gap-6 border-b border-white/[0.06] pb-8">
                  <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-white text-xl font-semibold leading-snug">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── PRESCRIPTION ENGINE ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PRESCRIPTION ENGINE™</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white max-w-5xl">
              From score to<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">strategic action.</span>
            </h2>
          </div>
          {/* Flow — 4 columns with connector arrows */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 mb-16">
            {[
              {
                step: '01', color: 'from-cyan-400 to-blue-500',
                title: 'Diagnostic Score',
                items: ['Business Strategy: 42', 'Technology Maturity: 58', 'AI Readiness: 31', 'Security Posture: 67'],
                note: 'Scored across all 16 pillars',
              },
              {
                step: '02', color: 'from-brand-blue to-violet-600', dotColor: '#FFAD8A',
                title: 'Root Causes Identified',
                items: ['Leadership bottlenecks', 'Poor operational visibility', 'Technology fragmentation', 'Data architecture gaps'],
                note: 'Mapped to specific pillar findings',
              },
              {
                step: '03', color: 'from-violet-400 to-purple-700',
                title: 'Recommended Actions',
                items: ['Digital Transformation Strategy', 'Business Process Reengineering', 'Enterprise Dashboard OS', 'Data Intelligence Modernization'],
                note: 'Ranked by impact and urgency',
              },
              {
                step: '04', color: 'from-emerald-400 to-green-600',
                title: 'Prescribed Services',
                items: ['Digital Transformation', 'Strategy Consulting', 'Application Modernization', 'Enterprise Platform Integration'],
                note: 'Sample — drawn from 61 Kangqore services across 6 departments',
              },
            ].map((phase, i) => (
              <div key={phase.step} className="relative lg:px-6 first:lg:pl-0 last:lg:pr-0">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-5 right-0 translate-x-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-white/15" />
                  </div>
                )}
                <p className={`text-[10px] font-black tracking-[0.4em] uppercase mb-5 bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>{phase.step}</p>
                <h3 className="text-white font-black text-xl mb-5 leading-tight">{phase.title}</h3>
                <ul className="space-y-3 mb-4">
                  {phase.items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${phase.dotColor ? '' : `bg-gradient-to-r ${phase.color}`}`} style={phase.dotColor ? { backgroundColor: phase.dotColor } : undefined} />
                      <span className="text-white/50 text-sm font-medium leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-white/20 text-xs font-bold tracking-wide">{phase.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xl sm:text-2xl font-black text-white/60 max-w-3xl leading-snug">
            This is where Kangqore BIDS™ — synthesized by{' '}
            <span className="text-cyan-400">eQORE AI™</span> — transforms from a diagnostic report into a{' '}
            <span className="text-white">revenue engine</span>, mapping every identified constraint directly to a Kangqore service prescription.
          </p>
        </div>
      </section>

      {/* ─────────────────────── ENGAGEMENT OVERVIEW ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">

            {/* Left — timeline + commercial framing */}
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PROCESS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-10">
                Seven steps.<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Four to six weeks.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed mb-14">
                Every Kangqore BIDS™ engagement follows a structured seven-step process — from your first request through scoping, evaluation, scoring, proposal, engagement start, and transformation.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-white font-black text-sm tracking-wide">Request a Scoping Call</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Right — timeline breakdown + methodology tease */}
            <div className="space-y-0">
              {/* Timeline phases */}
              {[
                { week: 'Week 1–2',    phase: 'Discover',   desc: 'Stakeholder interviews, documentation review, systems analysis, scope alignment' },
                { week: 'Week 2–4',    phase: 'Diagnose',   desc: '16-pillar assessment, 6 intelligence engines, enterprise scoring, constraint mapping' },
                { week: 'Week 4–5',    phase: 'Prescribe',  desc: 'Risk Register™, Opportunity Register™, Service Prescription Matrix™, roadmap drafting' },
                { week: 'Week 5–6',    phase: 'Transform',  desc: 'Executive Delivery, Board Presentation™, Workshop™, 30/60/90/180-Day Roadmap™' },
              ].map((t, i) => (
                <div key={t.phase} className="flex gap-6 pb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    {i < 3 && <div className="w-px flex-1 bg-white/[0.08] mt-2" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase mb-1">{t.week}</p>
                    <p className="text-white font-black text-lg mb-1">{t.phase}</p>
                    <p className="text-white/35 text-sm font-medium leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}

              {/* Methodology tease */}
              <div className="mt-4 pt-8 border-t border-white/[0.06]">
                <p className="text-[9px] font-black tracking-[0.35em] text-white/20 uppercase mb-3">PROPRIETARY METHODOLOGY</p>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-4">
                  The Kangqore BIDS™ scoring methodology — including pillar weightings, data point inputs, and cross-engine synthesis logic — is proprietary. A methodology overview is available upon request for qualified engagements.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-cyan-400/70 hover:text-cyan-400 transition-colors duration-200 text-sm font-bold">
                  Request Methodology Overview <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── 16 PILLARS ─────────────────────── */}
      <section id="pillars" className="py-32 relative">
        <div
          ref={pillarsRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">THE FRAMEWORK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white">
              16 Diagnostic Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Pillars™</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 lg:gap-24 lg:h-[700px]">
            {/* Left — scrollable list within section */}
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {pillars.map((p, i) => {
                const active = activePillar === i;
                return (
                  <div
                    key={p.n}
                    onMouseEnter={() => setActivePillar(i)}
                    className="group flex items-center gap-5 py-5 border-b border-white/[0.06] cursor-default"
                  >
                    <span className={`w-2.5 h-2.5 flex-shrink-0 transition-colors duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent'}`} />
                    <span className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/25 group-hover:text-white/55'}`}>
                      {p.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right — floats in place within the section */}
            <div className="hidden lg:flex items-center">
              <div className="w-full">
                <p className="text-[10px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-6">PILLAR {pillars[activePillar].n}</p>
                <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                  {pillars[activePillar].name}
                </h3>
                <p className="text-white/70 text-lg font-semibold mb-4">{pillarDetails[activePillar].tagline}</p>
                <p className="text-white/40 text-base leading-relaxed mb-10">{pillarDetails[activePillar].desc}</p>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10">
                  {(() => { const Icon = pillars[activePillar].icon; return <Icon className="w-4 h-4 text-cyan-400" strokeWidth={1.5} />; })()}
                  <span className="text-white/50 text-sm font-semibold tracking-wide">{pillars[activePillar].score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── 6 ENGINES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={enginesRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${enginesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-5 drop-shadow-md">UNDER THE HOOD</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white mb-6 drop-shadow-2xl">
              6 Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Engines™</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
              Every engagement is powered by six integrated intelligence engines that synthesize pillar findings into actionable business intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {engines.map((e, i) => {
              const Icon = e.icon;
              const elevated = i === 1 || i === 4;
              return (
                <div
                  key={e.name}
                  className={`flex flex-col rounded-3xl overflow-hidden bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl${elevated ? ' lg:-translate-y-10' : ''}`}
                >
                  {/* Top — gradient visual */}
                  <div className={`relative h-[280px] bg-gradient-to-br ${e.color} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    <span className="absolute text-[200px] font-black text-white/[0.08] leading-none select-none tracking-tighter">{String(i + 1).padStart(2, '0')}</span>
                    <div className="relative flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-3xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  {/* Bottom — white content */}
                  <div className="flex-1 bg-white p-7 flex flex-col">
                    <p className="text-gray-900 font-black text-xl leading-snug mb-3">{e.name}</p>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1">{e.desc}</p>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-all duration-200"
                      >
                        Learn More <span className="text-base">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── DELIVERABLES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div
          ref={delivRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${delivVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">WHAT YOU RECEIVE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white">
              Every Engagement{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Delivers</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 lg:gap-24 lg:h-[500px]">
            {/* Left — scrollable list */}
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {deliverables.map((d, i) => {
                const active = activeDeliverable === i;
                return (
                  <div
                    key={d.name}
                    onMouseEnter={() => setActiveDeliverable(i)}
                    className="group flex items-center gap-5 py-5 border-b border-white/[0.06] cursor-default"
                  >
                    <span className={`w-2.5 h-2.5 flex-shrink-0 transition-colors duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent'}`} />
                    <span className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/25 group-hover:text-white/55'}`}>
                      {d.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right — floating detail */}
            <div className="hidden lg:flex items-center">
              <div className="w-full">
                {(() => { const Icon = deliverables[activeDeliverable].icon; return (
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    <Icon className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
                  </div>
                ); })()}
                <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                  {deliverables[activeDeliverable].name}
                </h3>
                <p className="text-white/50 text-lg leading-relaxed">
                  {deliverables[activeDeliverable].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── OUTCOMES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">AFTER KANGQORE BIDS™</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white">
              Organizations gain<br />
              <span className="text-white/25">clarity, velocity,</span><br />
              <span className="text-white/25">and advantage.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
            {[
              { n: '01', text: 'Organizations identify an average of 2–3 Critical-rated constraints not on their existing roadmap' },
              { n: '02', text: 'Every engagement produces a ranked, scored roadmap — not a list of recommendations' },
              { n: '03', text: 'The Risk Register™ surfaces an average of 4–6 quantified risk exposures per engagement' },
              { n: '04', text: 'Operational Intelligence™ findings alone typically reveal 15–25% addressable efficiency gaps' },
              { n: '05', text: 'Technology Maturity and Cloud scores identify consolidation opportunities in 90% of engagements' },
              { n: '06', text: 'AI Readiness is the most-cited Critical finding — and the fastest to address once diagnosed' },
              { n: '07', text: 'The 30/60/90/180-Day Roadmap™ gives the executive team a sequenced action plan from day one' },
              { n: '08', text: 'The Opportunity Register™ maps growth, automation, and AI wins with estimated business impact' },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-5">
                <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">{item.n}</span>
                <p className="text-white text-lg font-semibold leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── SAMPLE SCORECARD ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Section header */}
          <div className="grid lg:grid-cols-2 gap-16 items-end mb-16">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">SAMPLE OUTPUT</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white mb-6">
                This is what you{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">receive.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Every Kangqore BIDS™ engagement produces a full Diagnostic Scorecard™ — all 16 pillars scored, classified, and benchmarked. Delivered as part of 10 executive-grade deliverables.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { color: 'bg-emerald-400', range: '75–100', label: 'Strong',   desc: 'Operating at or above benchmark' },
                { color: 'bg-cyan-400',    range: '60–74',  label: 'Good',     desc: 'Performing well — targeted improvements available' },
                { color: 'bg-amber-400',   range: '40–59',  label: 'Moderate', desc: 'Meaningful gaps with quantifiable business impact' },
                { color: 'bg-red-500',     range: '0–39',   label: 'Critical', desc: 'Active constraint limiting organizational performance' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${b.color} flex-shrink-0`} />
                  <span className="text-white/60 font-bold text-sm w-20 flex-shrink-0">{b.label} <span className="text-white/25 font-normal">({b.range})</span></span>
                  <span className="text-white/30 text-sm">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scorecard — executive summary bar */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] overflow-hidden mb-4">
            <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Kangqore BIDS™ Diagnostic Scorecard™</p>
                  <p className="text-white font-black text-base mt-0.5">Acme Corporation <span className="text-white/30 font-semibold text-sm">· Enterprise Edition™ · June 2026</span></p>
                </div>
              </div>
              <div className="flex items-center gap-10 flex-shrink-0">
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-black tracking-[0.25em] uppercase mb-1">Industry Avg</p>
                  <p className="text-white/50 font-black text-2xl">58</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-black tracking-[0.25em] uppercase mb-1">Sector Leader</p>
                  <p className="text-emerald-400 font-black text-2xl">84</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-black tracking-[0.25em] uppercase mb-1">Health Score</p>
                  <div className="flex items-baseline gap-0.5 justify-center">
                    <span className="text-3xl font-black bg-brand-gradient bg-clip-text text-transparent">61</span>
                    <span className="text-white/25 text-base font-bold">/100</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/25 font-black tracking-[0.25em] uppercase mb-1">Classification</p>
                  <p className="text-amber-400 font-black text-sm tracking-widest uppercase">Moderate</p>
                </div>
                <span className="text-[9px] text-white/15 font-bold tracking-widest uppercase hidden lg:block">CONFIDENTIAL</span>
              </div>
            </div>

            {/* 16-pillar full breakdown */}
            <div className="px-8 py-7">
              <p className="text-[9px] font-black tracking-[0.35em] text-white/20 uppercase mb-6">16 DIAGNOSTIC INTELLIGENCE PILLARS™</p>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-3">
                {[
                  { name: 'Business Strategy',      score: 78, c: 'bg-emerald-400', s: 'Strong'   },
                  { name: 'Leadership',              score: 62, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'Financial Health',        score: 81, c: 'bg-emerald-400', s: 'Strong'   },
                  { name: 'Operational Efficiency',  score: 35, c: 'bg-red-500',     s: 'Critical' },
                  { name: 'Workforce',               score: 58, c: 'bg-amber-400',   s: 'Moderate' },
                  { name: 'Customer',                score: 71, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'Sales',                   score: 44, c: 'bg-amber-400',   s: 'Moderate' },
                  { name: 'Growth',                  score: 67, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'Technology Maturity',     score: 74, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'Cloud & Infrastructure',  score: 55, c: 'bg-amber-400',   s: 'Moderate' },
                  { name: 'Data Intelligence',       score: 66, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'AI Readiness',            score: 38, c: 'bg-red-500',     s: 'Critical' },
                  { name: 'Automation',              score: 59, c: 'bg-amber-400',   s: 'Moderate' },
                  { name: 'Cybersecurity',           score: 58, c: 'bg-amber-400',   s: 'Moderate' },
                  { name: 'Governance & Risk',       score: 72, c: 'bg-cyan-400',    s: 'Good'     },
                  { name: 'Transformation',          score: 47, c: 'bg-amber-400',   s: 'Moderate' },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-[11px] text-white/40 font-semibold w-40 flex-shrink-0 truncate">{p.name}</span>
                    <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full ${p.c} rounded-full`} style={{ width: `${p.score}%` }} />
                    </div>
                    <span className="text-[11px] font-black text-white/70 w-7 text-right flex-shrink-0">{p.score}</span>
                    <span className={`text-[8px] font-black tracking-wide uppercase w-14 flex-shrink-0 ${
                      p.s === 'Critical' ? 'text-red-400' :
                      p.s === 'Moderate' ? 'text-amber-400' :
                      p.s === 'Strong'   ? 'text-emerald-400' :
                      'text-cyan-400'
                    }`}>{p.s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer summary */}
            <div className="px-8 py-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {[
                  { color: 'bg-red-500',     label: '2 Critical' },
                  { color: 'bg-amber-400',   label: '6 Moderate' },
                  { color: 'bg-cyan-400',    label: '6 Good' },
                  { color: 'bg-emerald-400', label: '2 Strong' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${b.color}`} />
                    <span className="text-[10px] text-white/35 font-bold">{b.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-white/15 font-bold tracking-widest uppercase">Sample Output · Anonymized · Not Real Client Data · Kangqore BIDS™</p>
            </div>
          </div>

          {/* Immediate priorities strip */}
          <div className="rounded-2xl border border-white/10 bg-[#080808] overflow-hidden">
            <div className="px-8 py-5 border-b border-white/[0.06]">
              <p className="text-[9px] font-black tracking-[0.35em] text-white/20 uppercase">IMMEDIATE PRIORITIES — TOP 3 CRITICAL FINDINGS</p>
            </div>
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
              {[
                { rank: '01', pillar: 'Operational Efficiency', score: 35, status: 'Critical', impact: 'Elevated operating costs across fragmented processes', action: 'Business Process Reengineering' },
                { rank: '02', pillar: 'AI Readiness',            score: 38, status: 'Critical', impact: 'Significant competitive exposure as peers accelerate AI adoption', action: 'AI & Cognitive Computing Strategy' },
                { rank: '03', pillar: 'Sales Intelligence',      score: 44, status: 'Moderate', impact: 'Revenue pipeline underperforming against market potential', action: 'Growth Funnels & Conversion Engineering' },
              ].map(f => (
                <div key={f.rank} className="px-7 py-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[9px] font-black tracking-widest text-white/20">{f.rank}</span>
                    <span className={`text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full ${
                      f.status === 'Critical' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>{f.status}</span>
                  </div>
                  <p className="text-white font-black text-base mb-1">{f.pillar}</p>
                  <p className="text-white/25 font-black text-3xl mb-3">{f.score}<span className="text-sm font-normal">/100</span></p>
                  <p className="text-white/35 text-xs font-medium leading-relaxed mb-4">{f.impact}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <p className="text-cyan-400/70 text-xs font-bold">{f.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────── INDUSTRY EDITIONS ─────────────────────── */}
      <section className="py-28 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={editionsRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${editionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Header — 2-col split */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 mb-20">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-white/30" />
                <p className="text-[10px] font-black tracking-[0.45em] text-white/50 uppercase">INDUSTRY EDITIONS™</p>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white">
                Deep Domain Expertise<br />
                Across Major{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Industries</span>
                <span className="text-white"> .</span>
              </h2>
            </div>
            <div className="flex lg:items-end lg:pb-3">
              <p className="text-white/40 text-lg font-medium leading-relaxed max-w-lg">
                Kangqore BIDS™ calibrates its diagnostic pillars, scoring benchmarks, and prescription logic to the specific complexity of your industry — not a generic framework applied uniformly.
              </p>
            </div>
          </div>

          {/* Grid — 4 columns, border-top rows */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {editions.map((e, i) => (
              <div
                key={e}
                className="border-t border-white/[0.08] py-7 pr-6 group cursor-default"
                style={{ transitionDelay: editionsVisible ? `${i * 40}ms` : '0ms' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-[0.28em] text-white/45 uppercase group-hover:text-white transition-colors duration-300">
                    {e.replace(' Edition™', '')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
            {/* CTA cell */}
            <div className="border-t border-white/[0.08] py-7 pr-6">
              <Link to="/contact" className="flex items-center justify-between group">
                <span className="text-[10px] font-black tracking-[0.28em] text-cyan-400 uppercase leading-snug">
                  EXPLORE BIDS™<br />EDITIONS
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── COMPETITIVE COMPARISON ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE DIFFERENCE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white">
              Built to diagnose.<br />
              <span className="text-white/25">Not to sell.</span>
            </h2>
          </div>

          {/* Two-col */}
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">

            {/* Left — conventional approach (generic) */}
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-10">THE CONVENTIONAL APPROACH</p>
              <div className="space-y-10">
                {[
                  { label: 'Assessments that justify the next sale', desc: 'Most diagnostic engagements are pre-sales motions — designed to recommend the consulting firm\'s own platform or services.' },
                  { label: 'Platform-first, not problem-first', desc: 'The technology stack is already chosen before the diagnosis begins. The assessment exists to validate the sale, not the strategy.' },
                  { label: 'Siloed and technology-centric', desc: 'Evaluations that focus on cloud, AI, or security in isolation — without connecting technology health to business performance and growth.' },
                  { label: 'Qualitative outputs with no accountability', desc: 'Recommendations delivered as slide decks. No scores. No benchmarks. No way to measure progress or hold anyone accountable.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-white/20 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/30 font-bold text-base mb-1">{item.label}</p>
                      <p className="text-white/20 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — BIDS™ differentiators */}
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase mb-10">KANGQORE BIDS™ APPROACH</p>
              <div className="space-y-10">
                {[
                  { n: '01', label: 'The diagnosis is the product', desc: 'No platform to push. No implementation to sell. Kangqore BIDS™ is vendor-agnostic — the deliverable is the insight, not a proposal for more services.' },
                  { n: '02', label: 'Scored and indexed, not qualitative', desc: 'Every pillar produces a quantified score. You receive a Diagnostic Scorecard™ and 9 additional deliverables — measurable, benchmarked, accountable.' },
                  { n: '03', label: 'Full ecosystem scope', desc: 'Business, technology, operations, AI, security, and growth examined as one interconnected system across 16 diagnostic intelligence pillars.' },
                  { n: '04', label: 'Zero conflict of interest', desc: "We don't sell the cloud. We don't sell the platform. We sell the truth about your organization — then you decide what to do with it." },
                ].map((d) => (
                  <div key={d.n} className="flex items-start gap-8">
                    <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">{d.n}</span>
                    <div>
                      <p className="text-white font-bold text-lg mb-2">{d.label}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── SCALE STRIP ─────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[10px] font-black tracking-[0.45em] text-white/25 uppercase mb-12">BUILT ON KANGQORE'S FULL PRACTICE</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
            {[
              { value: '61',   label: 'Specialized Services' },
              { value: '6',    label: 'Practice Departments' },
              { value: '10',   label: 'Industry Editions' },
              { value: '16',   label: 'Diagnostic Pillars' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">{s.value}</p>
                <p className="text-white/35 text-sm font-semibold tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-white/25 text-sm font-medium max-w-xl leading-relaxed">
            Kangqore BIDS™ is backed by the full depth of the Kangqore practice — AI, cloud, engineering, security, modernization, and growth — all available for prescription the moment diagnosis is complete.
          </p>
        </div>
      </section>

      {/* ─────────────────────── WHAT'S COMING ─────────────────────── */}
      <section className="py-20 relative overflow-hidden border-t border-white/[0.04]" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 animate-pulse" />
                <p className="text-[9px] font-black tracking-[0.4em] text-white/25 uppercase">COMING Q4 2026</p>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <p className="text-white/40 text-sm font-bold">Benchmark Intelligence™</p>
            </div>
            <p className="text-white/25 text-sm font-medium max-w-lg leading-relaxed">
              Kangqore is building the first vendor-agnostic enterprise diagnostic benchmark dataset — percentile rankings, competitive position indices, and industry gap analysis across all 16 pillars. Organizations that complete a BIDS™ engagement today will be among the first to receive benchmark intelligence when it launches.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section className="relative py-40 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={ctaRef}
          className={`relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
            <Target className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-8 drop-shadow-2xl">
            Diagnose the Enterprise.<br />
            <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">Unlock the Potential.</span>
          </h2>
          <p className="text-white/60 text-lg sm:text-2xl font-medium leading-relaxed max-w-3xl mx-auto mb-16">
            Every organization has visible problems and invisible constraints. Kangqore BIDS™ identifies those constraints, quantifies their impact, and delivers a transformation blueprint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white text-gray-900 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <span className="relative z-10 font-black text-base tracking-wide">Request a Diagnostic</span>
              <div className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300 z-10">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 px-8 py-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-white hover:bg-white/10 text-base font-bold tracking-wide transition-all duration-300"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
