import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Users, Landmark, Factory, Briefcase, Star,
  TrendingUp, Globe, Cpu, Cloud, BarChart3, Bot, Zap, Lock,
  Scale, Sparkles, RefreshCw, CheckCircle, Activity,
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(244,63,94,0.05)_0%,transparent_50%)] pointer-events-none" />
        <div
          ref={problemRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${problemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-red-400 uppercase mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-red-400/50" />
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

            {/* Right — symptoms glass pills */}
            <div className="lg:pt-10">
              <p className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-8">FAMILIAR SYMPTOMS</p>
              <div className="flex flex-wrap gap-4">
                {symptoms.map((s, i) => (
                  <div 
                    key={s} 
                    className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-red-400/30 hover:-translate-y-1 transition-all duration-300"
                    style={{ transitionDelay: problemVisible ? `${i * 50}ms` : '0ms' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] flex-shrink-0 animate-pulse" />
                    <span className="text-white/80 text-sm font-semibold tracking-wide">{s}</span>
                  </div>
                ))}
              </div>
              <p className="mt-10 text-sm text-white/40 font-medium leading-relaxed bg-black/50 p-6 rounded-2xl border border-white/5">
                These symptoms are rarely the root problem. The underlying causes exist across interconnected systems, functions, teams, and decision-making structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── DEFINITION ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[150px]" />
        </div>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <p className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 uppercase">WHAT IS BIDS™</p>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.1] tracking-[-0.03em] text-white mb-8 drop-shadow-xl">
                The complete enterprise diagnostic <span className="bg-brand-gradient bg-clip-text text-transparent">intelligence framework.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-10 text-lg sm:text-xl font-medium">
                Kangqore BIDS™ evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem. Unlike traditional assessments that focus on isolated departments, BIDS™ examines the complete enterprise landscape.
              </p>
              <div className="space-y-4">
                {[
                  'Identifies hidden constraints across all vectors',
                  'Quantifies their measurable business impact',
                  'Prioritizes transformation and AI opportunities',
                  'Generates a strategic roadmap for intelligent growth',
                ].map((item, i) => (
                  <div 
                    key={item} 
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
                    style={{ transitionDelay: defVisible ? `${i * 100}ms` : '0ms' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-white/90 text-sm sm:text-base font-bold tracking-wide">{item}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-transparent border-l-4 border-cyan-400 backdrop-blur-md">
                <p className="text-white font-black text-xl italic tracking-wide drop-shadow-md">
                  "What is preventing this organization from achieving its full potential?"
                </p>
              </blockquote>
            </div>

            {/* Right — BIDSProductVisual */}
            <div className="flex justify-center lg:justify-end">
              <BIDSProductVisual isActive={defVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">THE PROCESS</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-white mb-4">
              How{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">BIDS™ Works</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg font-medium">
              Three stages. Typically 4–6 weeks from first call to executive delivery.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line — desktop only */}
            <div className="hidden lg:block absolute top-[52px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-px bg-gradient-to-r from-cyan-500/30 via-brand-blue/50 to-violet-500/30" />

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
              {[
                {
                  step: '01',
                  label: 'REQUEST',
                  title: 'Discovery Briefing',
                  duration: '~30 minutes',
                  color: 'from-cyan-400 to-blue-500',
                  glow: 'rgba(34,211,238,0.25)',
                  points: [
                    'Scope your industry and edition',
                    'Identify key stakeholders',
                    'Align on strategic objectives',
                    'Confirm engagement timeline',
                  ],
                },
                {
                  step: '02',
                  label: 'DIAGNOSE',
                  title: '16-Pillar Assessment',
                  duration: '2–4 weeks',
                  color: 'from-brand-blue to-violet-500',
                  glow: 'rgba(37,100,234,0.25)',
                  points: [
                    'Deep-dive across all 16 pillars',
                    'Stakeholder interviews + data review',
                    'Five intelligence engines activated',
                    'Constraints mapped and scored',
                  ],
                },
                {
                  step: '03',
                  label: 'BLUEPRINT',
                  title: 'Executive Delivery',
                  duration: '1–2 weeks',
                  color: 'from-violet-400 to-purple-600',
                  glow: 'rgba(167,139,250,0.25)',
                  points: [
                    'Diagnostic Scorecard™ presented',
                    'Transformation Blueprint™ delivered',
                    '30/60/90/180-Day Roadmap™',
                    'Executive Workshop™ facilitated',
                  ],
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="relative rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-8 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 group"
                  style={{ boxShadow: `0 20px 60px ${s.glow}` }}
                >
                  {/* Step number badge */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-8 shadow-2xl ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-white font-black text-lg">{s.step}</span>
                  </div>

                  <p className={`text-[10px] font-black tracking-[0.3em] uppercase bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-2`}>{s.label}</p>
                  <h3 className="text-white font-black text-2xl mb-1 tracking-tight">{s.title}</h3>
                  <p className="text-white/40 text-sm font-bold tracking-widest uppercase mb-8">{s.duration}</p>

                  <ul className="space-y-3">
                    {s.points.map(pt => (
                      <li key={pt} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${s.color} mt-2 flex-shrink-0`} />
                        <span className="text-white/60 text-sm font-semibold leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── 16 PILLARS ─────────────────────── */}
      <section id="pillars" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]" />
        </div>
        <div
          ref={pillarsRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5 drop-shadow-md">THE FRAMEWORK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white mb-6 drop-shadow-2xl">
              16 Diagnostic Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(37,100,234,0.3)]">Pillars™</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
              Every pillar generates a proprietary intelligence score benchmarked against industry peers. Together, they form a complete, irrefutable picture of where you stand — and where to move first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-white/10 rounded-2xl overflow-hidden">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.n}
                  className="group flex items-center gap-6 px-8 py-5 border-b border-r-0 sm:odd:border-r border-white/10 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0 hover:bg-white/[0.04] transition-colors duration-300"
                  style={{ transitionDelay: pillarsVisible ? `${i * 30}ms` : '0ms' }}
                >
                  <span className="text-xs font-black tracking-widest text-cyan-400/60 w-7 flex-shrink-0">{p.n}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-cyan-300 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-snug">{p.name}</p>
                    <p className="text-[11px] text-white/35 font-semibold tracking-wide mt-0.5 truncate">{p.score}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── 5 ENGINES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Dynamic mesh background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
             
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engines.map((e, i) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.name}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-white/20 hover:-translate-y-2 hover:bg-white/10 transition-all duration-500 overflow-hidden"
                  style={{ 
                    transitionDelay: enginesVisible ? `${i * 100}ms` : '0ms',
                    boxShadow: enginesVisible ? `0 10px 40px ${e.glow}` : 'none'
                  }}
                >
                  {/* Accent top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${e.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Glow orb behind icon */}
                  <div className={`absolute top-10 left-10 w-16 h-16 bg-gradient-to-br ${e.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center mb-8 shadow-2xl ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2} />
                  </div>
                  <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-3 bg-gradient-to-r ${e.color} bg-clip-text text-transparent`}>Kangqore {e.dept}</p>
                  <p className="text-white font-black text-lg sm:text-xl leading-snug mb-6 drop-shadow-sm">{e.name}</p>
                  <ul className="space-y-4">
                    {e.items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${e.color} mt-2 flex-shrink-0 shadow-lg`} />
                        <span className="text-sm text-white/70 font-semibold leading-relaxed tracking-wide">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── DELIVERABLES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-blue/5 rounded-full blur-[200px]" />
        </div>
        <div
          ref={delivRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${delivVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-20">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5 drop-shadow-md">WHAT YOU RECEIVE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-[-0.03em] text-white mb-6 drop-shadow-2xl">
              Every Engagement{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Delivers</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
              Ten proprietary deliverables. Each designed to give leadership teams the intelligence and tools to act decisively.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-7 group hover:bg-white/10 hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] transition-all duration-500"
                  style={{ transitionDelay: delivVisible ? `${i * 40}ms` : '0ms' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500">
                    <Icon className="w-6 h-6 text-white/50 group-hover:text-cyan-300 transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <p className="text-white font-bold text-base leading-snug mb-3 drop-shadow-md">{d.name}</p>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── SAMPLE SCORECARD ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-blue/8 rounded-full blur-[180px]" />
        </div>
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
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-3xl blur-2xl" />
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

      {/* ─────────────────────── PHILOSOPHY ─────────────────────── */}
      <section className="py-32 relative" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-12 drop-shadow-md">THE KANGQORE DIFFERENCE</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { before: 'Most consulting firms begin with', after: 'solutions.', kq: 'Kangqore begins with diagnosis.' },
              { before: 'Most providers ask:', after: '"What would you like to purchase?"', kq: 'Kangqore asks: "What is limiting the performance of this organization?"' },
              { before: 'Before transformation comes', after: 'understanding.', kq: 'Before investment comes intelligence. Before execution comes diagnosis.' },
            ].map((block, i) => (
              <div key={i} className="group rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                <p className="text-white/50 text-base font-medium leading-relaxed mb-6">
                  {block.before} <span className="text-white font-bold">{block.after}</span>
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 font-black text-xl lg:text-2xl leading-relaxed tracking-tight group-hover:from-cyan-100 group-hover:to-brand-blue transition-all duration-500">
                  {block.kq}
                </p>
              </div>
            ))}
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

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section className="relative py-40 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated glowing mesh / radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        </div>
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
