import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Users, Landmark, Factory, Briefcase, Star,
  TrendingUp, Globe, Cpu, Cloud, BarChart3, Bot, Zap, Lock,
  Scale, Sparkles, ShieldCheck, RefreshCw, CheckCircle, Activity,
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
    name: 'Business Health Engine™',
    icon: Activity,
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.3)',
    items: ['Organizational health', 'Enterprise maturity', 'Performance effectiveness'],
  },
  {
    name: 'Risk Intelligence Engine™',
    icon: Shield,
    color: 'from-rose-400 to-red-600',
    glow: 'rgba(244,63,94,0.3)',
    items: ['Business risk exposure', 'Technology risk exposure', 'Cybersecurity risk exposure', 'Operational risk exposure'],
  },
  {
    name: 'Opportunity Intelligence Engine™',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,146,60,0.3)',
    items: ['Revenue opportunities', 'Automation opportunities', 'AI opportunities', 'Efficiency opportunities'],
  },
  {
    name: 'Growth Intelligence Engine™',
    icon: TrendingUp,
    color: 'from-emerald-400 to-green-600',
    glow: 'rgba(52,211,153,0.3)',
    items: ['Growth constraints', 'Visibility limitations', 'Conversion bottlenecks'],
  },
  {
    name: 'Transformation Intelligence Engine™',
    icon: Layers,
    color: 'from-violet-400 to-purple-600',
    glow: 'rgba(167,139,250,0.3)',
    items: ['Modernization priorities', 'Transformation readiness', 'Strategic execution pathways'],
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
    <div className="bg-[#06090f] text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white">
      <SEO
        title="Kangqore BIDS™ — Business Diagnostic Intelligence System™"
        description="The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. 16 diagnostic pillars. 5 intelligence engines. One complete diagnostic."
        keywords="Kangqore BIDS, Business Diagnostic Intelligence System, enterprise diagnostic, transformation blueprint, AI readiness, cybersecurity assessment"
        url="/bids"
      />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden pb-32">
        <VisualBackground />
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        {/* Content */}
        <div
          ref={heroRef}
          className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                Proprietary Intelligence
              </p>
            </div>
            
            <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white mb-6 drop-shadow-2xl">
              Kangqore{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">BIDS™</span>
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-50 font-semibold tracking-wide mb-4 flex items-center gap-3">
              Business Diagnostic Intelligence System™
            </p>
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mb-12 font-medium">
              The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. Reveal hidden constraints before they become critical failures.
            </p>
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

        {/* Stats strip - glassmorphic */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '16', label: 'Intelligence Pillars' },
              { value: '5',  label: 'Intelligence Engines' },
              { value: '10', label: 'Deliverables' },
              { value: '10', label: 'Industry Editions' },
            ].map(s => (
              <div key={s.label} className="text-center group cursor-default">
                <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-lg">{s.value}</p>
                <p className="text-[11px] text-cyan-400/80 font-bold tracking-widest uppercase mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-32 relative overflow-hidden bg-[#03050a] border-y border-white/5">
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
              Every pillar generates a proprietary intelligence score. Together, they form a complete, irrefutable picture of your enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.n}
                  className="group relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-7 hover:bg-white/[0.08] hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(34,211,238,0.15)] transition-all duration-500 overflow-hidden cursor-default"
                  style={{ transitionDelay: pillarsVisible ? `${i * 40}ms` : '0ms' }}
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:to-brand-blue/5 transition-all duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-sm font-black tracking-widest text-cyan-400 drop-shadow-md">{p.n}</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-500">
                        <Icon className="w-5 h-5 text-white/50 group-hover:text-cyan-300 transition-colors duration-500" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-white font-bold text-base sm:text-lg leading-snug mb-3 drop-shadow-md">{p.name}</p>
                    <p className="text-xs text-white/50 leading-relaxed font-semibold tracking-wide uppercase">{p.score}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── 5 ENGINES ─────────────────────── */}
      <section className="py-32 relative bg-[#03050a] border-y border-white/5 overflow-hidden">
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
              5 Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Engines™</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
              Every engagement is powered by five integrated intelligence engines that synthesize pillar findings into actionable business intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

      {/* ─────────────────────── PHILOSOPHY ─────────────────────── */}
      <section className="py-32 bg-[#03050a] border-y border-white/5 relative">
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
      <section className="relative py-40 overflow-hidden bg-[#03050a] border-t border-white/5">
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
