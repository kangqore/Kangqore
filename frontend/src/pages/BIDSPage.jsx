import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Users, Landmark, Factory, Briefcase, Star,
  TrendingUp, Globe, Cpu, Cloud, BarChart3, Bot, Zap, Lock,
  Scale, Sparkles, RefreshCw, Activity,
  Database, Award, Layers, Shield
} from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import BIDSProductVisual from '../components/hero/BIDSProductVisual';
import VisualBackground from '../components/VisualBackground';

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
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.25)',
    items: ['AI & GenAI readiness score', 'Data maturity for AI', 'Automation potential index', 'AI governance maturity'],
  },
  {
    dept: 'Foundry',
    name: 'Foundry Intelligence Engine™',
    icon: Cloud,
    color: 'from-sky-400 to-blue-600',
    glow: 'rgba(56,189,248,0.25)',
    items: ['Infrastructure health score', 'Cloud readiness index', 'Engineering maturity assessment', 'Platform resilience posture'],
  },
  {
    dept: 'Reimagine',
    name: 'Reimagine Intelligence Engine™',
    icon: RefreshCw,
    color: 'from-violet-400 to-purple-600',
    glow: 'rgba(167,139,250,0.25)',
    items: ['Modernization priority index', 'Legacy debt exposure', 'Transformation readiness score', 'Change execution capability'],
  },
  {
    dept: 'Shield',
    name: 'Shield Intelligence Engine™',
    icon: Shield,
    color: 'from-rose-400 to-red-600',
    glow: 'rgba(244,63,94,0.3)',
    items: ['Security posture score', 'Risk & compliance gap', 'AI governance coverage', 'Operational trust readiness'],
  },
  {
    dept: 'Platforms',
    name: 'Platforms Intelligence Engine™',
    icon: Layers,
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,146,60,0.3)',
    items: ['Enterprise platform utilization', 'Integration complexity score', 'Operational process maturity', 'Platform consolidation opportunity'],
  },
  {
    dept: 'Growth',
    name: 'Growth Intelligence Engine™',
    icon: TrendingUp,
    color: 'from-emerald-400 to-green-600',
    glow: 'rgba(52,211,153,0.3)',
    items: ['Revenue engine score', 'Marketing performance gaps', 'Conversion bottleneck index', 'Digital visibility assessment'],
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
        description="The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. 16 diagnostic pillars. 5 intelligence engines. One complete diagnostic."
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
              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-8">
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
                    This is why Kangqore engineered BIDS™.
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

      {/* ─────────────────────── CONSTRAINT COST ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-red-400 uppercase mb-8">THE REAL COST</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
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
            BIDS™ quantifies these costs before they become business failures.
          </p>
        </div>
      </section>

      {/* ─────────────────────── DEFINITION ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Top — eyebrow + oversized headline */}
          <div className="mb-20 lg:mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHAT IS BIDS™</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white max-w-6xl">
              The complete enterprise<br />
              diagnostic{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">intelligence</span><br />
              framework.
            </h2>
          </div>

          {/* Bottom — 2-col */}
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            {/* Left — description + numbered list */}
            <div>
              <p className="text-white/50 text-xl leading-relaxed mb-16 font-medium">
                Kangqore BIDS™ evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem — examining the complete enterprise landscape, not isolated departments.
              </p>

              <div className="space-y-10">
                {[
                  { n: '01', text: 'Identifies hidden constraints across all vectors' },
                  { n: '02', text: 'Quantifies their measurable business impact' },
                  { n: '03', text: 'Prioritizes transformation and AI opportunities' },
                  { n: '04', text: 'Generates a strategic roadmap for intelligent growth' },
                ].map((item) => (
                  <div key={item.n} className="flex items-start gap-8">
                    <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0 w-6">{item.n}</span>
                    <p className="text-white text-xl font-semibold leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual + pull quote */}
            <div className="flex flex-col gap-16">
              <div className="flex justify-center lg:justify-end">
                <BIDSProductVisual isActive={defVisible} />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white leading-snug">
                "What is preventing this organization from achieving its full potential?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── CEO QUESTIONS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">EXECUTIVE CLARITY</p>
              <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-black leading-[1.0] tracking-[-0.04em] text-white mb-10">
                Questions every<br />executive should<br />be able to answer.
              </h2>
              <p className="text-white/40 text-lg font-medium leading-relaxed">
                If these answers are unclear, decisions are made on assumptions — not intelligence. That is where value is lost. BIDS™ exists for exactly this reason.
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

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PROCESS</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
              The BIDS™<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">Diagnostic Process.</span>
            </h2>
            <p className="text-white/40 text-lg font-medium mt-6">
              Four phases. Typically 4–6 weeks from first call to executive delivery.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-start">
            {[
              {
                step: '01', label: 'PHASE ONE', title: 'Discover',
                color: 'from-cyan-400 to-blue-500', icon: Target,
                points: ['Stakeholder interviews', 'Documentation review', 'Systems analysis', 'Scope alignment'],
              },
              {
                step: '02', label: 'PHASE TWO', title: 'Diagnose',
                color: 'from-brand-blue to-violet-600', icon: BarChart3,
                points: ['16 Intelligence Pillars activated', '6 Intelligence Engines running', 'Enterprise scoring completed', 'Constraints mapped'],
              },
              {
                step: '03', label: 'PHASE THREE', title: 'Prescribe',
                color: 'from-violet-400 to-purple-700', icon: Sparkles,
                points: ['Risk Register™ compiled', 'Opportunity Register™ built', 'Service Prescription Matrix™', 'Priority roadmap drafted'],
              },
              {
                step: '04', label: 'PHASE FOUR', title: 'Transform',
                color: 'from-emerald-400 to-green-600', icon: Award,
                points: ['30/60/90/180-Day Roadmap™', 'Executive Workshop™', 'Execution planning', 'Progress benchmarks set'],
              },
            ].map((s, i) => {
              const Icon = s.icon;
              const elevated = i === 1 || i === 3;
              return (
                <div key={s.step} className={`flex flex-col rounded-3xl overflow-hidden${elevated ? ' lg:-translate-y-8' : ''}`}>
                  <div className={`relative h-52 bg-gradient-to-br ${s.color} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    <span className="absolute text-[140px] font-black text-white/[0.07] leading-none select-none">{s.step}</span>
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#111111] border border-white/10 border-t-0 rounded-b-3xl p-7">
                    <p className={`text-[10px] font-black tracking-[0.3em] uppercase mb-3 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.label}</p>
                    <h3 className="text-2xl font-black text-white mb-5 tracking-tight">{s.title}</h3>
                    <ul className="space-y-3">
                      {s.points.map(pt => (
                        <li key={pt} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.color} mt-2 flex-shrink-0`} />
                          <span className="text-white/60 text-sm font-semibold leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PRESCRIPTION ENGINE ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PRESCRIPTION ENGINE™</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white max-w-5xl">
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
                step: '02', color: 'from-brand-blue to-violet-600',
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
                title: 'Mapped Kangqore Services',
                items: ['61 services across 6 departments', 'Matched to root causes', 'Sequenced for execution', 'Scoped for ROI'],
                note: 'The front door to all of Kangqore',
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
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${phase.color} mt-2 flex-shrink-0`} />
                      <span className="text-white/50 text-sm font-medium leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-white/20 text-xs font-bold tracking-wide">{phase.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xl sm:text-2xl font-black text-white/60 max-w-3xl leading-snug">
            This is where BIDS™ transforms from a report into a{' '}
            <span className="text-white">revenue engine</span> — mapping every constraint directly to a Kangqore service prescription.
          </p>
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

      {/* ─────────────────────── 5 ENGINES ─────────────────────── */}
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
                  className={`flex flex-col rounded-3xl overflow-hidden${elevated ? ' lg:-translate-y-8' : ''}`}
                >
                  {/* Top — gradient visual */}
                  <div className={`relative h-52 bg-gradient-to-br ${e.color} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    <span className="absolute text-[140px] font-black text-white/[0.07] leading-none select-none">{String(i + 1).padStart(2, '0')}</span>
                    <div className="relative w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  {/* Bottom — content */}
                  <div className="flex-1 bg-[#111111] border border-white/10 border-t-0 rounded-b-3xl p-7">
                    <p className={`text-[10px] font-black tracking-[0.25em] uppercase mb-3 bg-gradient-to-r ${e.color} bg-clip-text text-transparent`}>Kangqore {e.dept}</p>
                    <p className="text-white font-black text-lg leading-snug mb-5">{e.name}</p>
                    <ul className="space-y-3">
                      {e.items.map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${e.color} mt-2 flex-shrink-0`} />
                          <span className="text-sm text-white/60 font-semibold leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── BENCHMARK INTELLIGENCE ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">BENCHMARK INTELLIGENCE™</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
              Not just how you score.<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">How you compare.</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
            {/* Left — comparison tiers */}
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-10">COMPARE AGAINST</p>
              <div className="space-y-8">
                {[
                  { tier: 'Industry Average',      desc: 'Where you stand relative to the sector median across all 16 pillars' },
                  { tier: 'Industry Leaders',       desc: 'The gap between you and the top performers in your space' },
                  { tier: 'Regional Peers',         desc: 'Performance against organizations operating in your region' },
                  { tier: 'National Competitors',   desc: 'National market position mapped across business and technology dimensions' },
                  { tier: 'Global Best Performers', desc: 'How far ahead or behind the global frontier your organization sits' },
                ].map((t) => (
                  <div key={t.tier} className="flex items-start gap-6">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base mb-1">{t.tier}</p>
                      <p className="text-white/35 text-sm font-medium leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — outputs */}
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-10">INTELLIGENCE OUTPUTS</p>
              <div className="space-y-10">
                {[
                  { n: '01', label: 'Percentile Ranking™', desc: 'Your organization scored in the Nth percentile — precision positioning across every pillar, not vague commentary.' },
                  { n: '02', label: 'Competitive Position Index™', desc: 'A composite score mapping your relative competitive strength across business, technology, and operations.' },
                  { n: '03', label: 'Industry Gap Analysis™', desc: 'The specific pillars where you trail competitors — ranked by business impact and transformation priority.' },
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
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">AFTER BIDS™</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
              Organizations gain<br />
              <span className="text-white/25">clarity, velocity,</span><br />
              <span className="text-white/25">and advantage.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
            {[
              { n: '01', text: 'Clear visibility into every hidden constraint' },
              { n: '02', text: 'Prioritized transformation initiatives' },
              { n: '03', text: 'Reduced risk exposure across the enterprise' },
              { n: '04', text: 'Higher operational efficiency' },
              { n: '05', text: 'Stronger technology foundations' },
              { n: '06', text: 'Greater AI readiness' },
              { n: '07', text: 'Faster, smarter execution' },
              { n: '08', text: 'Measurable growth opportunities' },
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">SAMPLE OUTPUT</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-white mb-6">
                This is what you{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">receive.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Every engagement produces a Diagnostic Scorecard™ — a precise, pillar-by-pillar breakdown of your enterprise health, scored and benchmarked against industry peers.
              </p>
              <div className="space-y-4">
                {[
                  { color: 'bg-emerald-400', label: 'Strong (75–100)', desc: 'Operating at or above benchmark' },
                  { color: 'bg-cyan-400',    label: 'Good (60–74)',    desc: 'Performing well, targeted improvements available' },
                  { color: 'bg-amber-400',   label: 'Moderate (40–59)', desc: 'Meaningful gaps with quantifiable impact' },
                  { color: 'bg-red-500',     label: 'Critical (0–39)', desc: 'Active constraint limiting performance' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${b.color} flex-shrink-0 shadow-lg`} />
                    <span className="text-white font-bold text-sm w-36 flex-shrink-0">{b.label}</span>
                    <span className="text-white/40 text-sm">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — scorecard mockup */}
            <div className="relative">
              <div className="relative rounded-2xl border border-white/15 bg-black overflow-hidden shadow-2xl">

                {/* Card header */}
                <div className="px-6 pt-6 pb-5 border-b border-white/8">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-brand-gradient flex items-center justify-center">
                        <BarChart3 className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-[11px] font-black tracking-[0.2em] text-white/60 uppercase">BIDS™ Diagnostic Scorecard™</span>
                    </div>
                    <span className="text-[10px] text-white/30 font-semibold">CONFIDENTIAL</span>
                  </div>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-white font-black text-lg">Acme Corporation</p>
                      <p className="text-white/40 text-[11px] font-semibold tracking-wide">Enterprise Edition™ · June 2026</p>
                    </div>
                    {/* Overall score ring */}
                    <div className="text-right">
                      <p className="text-[11px] text-white/40 font-semibold uppercase tracking-widest mb-1">Enterprise Health Score</p>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-5xl font-black bg-brand-gradient bg-clip-text text-transparent">63</span>
                        <span className="text-white/30 text-xl font-bold">/100</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 justify-end">
                        <span className="text-[10px] text-white/30 font-semibold">Industry avg <span className="text-white/50">58</span></span>
                        <span className="text-[10px] text-white/30 font-semibold">Top quartile <span className="text-emerald-400">84</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pillar scores */}
                <div className="px-6 py-5 space-y-3">
                  {[
                    { name: 'Business Strategy',    score: 78, status: 'Strong',   color: 'bg-emerald-400', w: 'w-[78%]' },
                    { name: 'AI Readiness',          score: 41, status: 'Critical', color: 'bg-red-500',     w: 'w-[41%]' },
                    { name: 'Cybersecurity',         score: 58, status: 'Moderate', color: 'bg-amber-400',   w: 'w-[58%]' },
                    { name: 'Technology Maturity',   score: 74, status: 'Good',     color: 'bg-cyan-400',    w: 'w-[74%]' },
                    { name: 'Operational Efficiency',score: 35, status: 'Critical', color: 'bg-red-500',     w: 'w-[35%]' },
                    { name: 'Data Intelligence',     score: 66, status: 'Good',     color: 'bg-cyan-400',    w: 'w-[66%]' },
                    { name: 'Financial Health',      score: 81, status: 'Strong',   color: 'bg-emerald-400', w: 'w-[81%]' },
                    { name: 'Transformation',        score: 47, status: 'Moderate', color: 'bg-amber-400',   w: 'w-[47%]' },
                  ].map(p => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-[11px] text-white/50 font-semibold w-44 flex-shrink-0 truncate">{p.name}</span>
                      <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} ${p.w} rounded-full`} />
                      </div>
                      <span className="text-[11px] font-black text-white/80 w-6 text-right flex-shrink-0">{p.score}</span>
                      <span className={`text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                        p.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        p.status === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                        p.status === 'Strong'   ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>{p.status}</span>
                    </div>
                  ))}
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {[
                      { color: 'bg-red-500',     label: '2 Critical' },
                      { color: 'bg-amber-400',   label: '2 Moderate' },
                      { color: 'bg-cyan-400',    label: '2 Good' },
                      { color: 'bg-emerald-400', label: '2 Strong' },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${b.color}`} />
                        <span className="text-[10px] text-white/40 font-semibold">{b.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/20 font-bold tracking-widest uppercase">Sample · Not real data</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────── WHY WE BUILT BIDS™ ─────────────────────── */}
      <section className="py-32 relative" style={{ backgroundColor: '#000000' }}>
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
                BIDS™ was engineered to identify the constraints, risks, inefficiencies, and opportunities hidden beneath the surface of an organization — before major investments are made.
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

      {/* ─────────────────────── INDUSTRY EDITIONS ─────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div
          ref={editionsRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${editionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5 drop-shadow-md">TAILORED TO YOUR SECTOR</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white drop-shadow-xl">
              10 Industry{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Editions™</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {editions.map((e, i) => (
              <div
                key={e}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-white/70 font-bold tracking-wide hover:border-cyan-400/50 hover:text-white hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{ transitionDelay: editionsVisible ? `${i * 30}ms` : '0ms' }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── COMPETITIVE COMPARISON ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE DIFFERENCE</p>
            <h2 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white">
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
              <p className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase mb-10">BIDS™ APPROACH</p>
              <div className="space-y-10">
                {[
                  { n: '01', label: 'The diagnosis is the product', desc: 'No platform to push. No implementation to sell. BIDS™ is vendor-agnostic — the deliverable is the insight, not a proposal for more services.' },
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

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section className="relative py-40 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={ctaRef}
          className={`relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
            <Target className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-[-0.04em] text-white mb-8 drop-shadow-2xl">
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
