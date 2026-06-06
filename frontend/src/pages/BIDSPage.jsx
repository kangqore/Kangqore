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
    items: ['Organizational health', 'Enterprise maturity', 'Performance effectiveness'],
  },
  {
    name: 'Risk Intelligence Engine™',
    icon: Shield,
    color: 'from-rose-400 to-red-600',
    items: ['Business risk exposure', 'Technology risk exposure', 'Cybersecurity risk exposure', 'Operational risk exposure'],
  },
  {
    name: 'Opportunity Intelligence Engine™',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    items: ['Revenue opportunities', 'Automation opportunities', 'AI opportunities', 'Efficiency opportunities'],
  },
  {
    name: 'Growth Intelligence Engine™',
    icon: TrendingUp,
    color: 'from-emerald-400 to-green-600',
    items: ['Growth constraints', 'Visibility limitations', 'Conversion bottlenecks'],
  },
  {
    name: 'Transformation Intelligence Engine™',
    icon: Layers,
    color: 'from-violet-400 to-purple-600',
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
    <div className="bg-white dark:bg-black overflow-x-hidden">
      <SEO
        title="Kangqore BIDS™ — Business Diagnostic Intelligence System™"
        description="The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. 16 diagnostic pillars. 5 intelligence engines. One complete diagnostic."
        keywords="Kangqore BIDS, Business Diagnostic Intelligence System, enterprise diagnostic, transformation blueprint, AI readiness, cybersecurity assessment"
        url="/bids"
      />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0a1228]">
          <img src="/images/imgbg3.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div
          ref={heroRef}
          className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 pt-40 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">
              PROPRIETARY INTELLIGENCE
            </p>
            <h1 className="text-[3rem] sm:text-[4rem] lg:text-[5.5rem] font-black leading-[1.0] tracking-[-0.04em] text-white mb-6">
              Kangqore{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">BIDS™</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 font-semibold tracking-wide mb-3">
              Business Diagnostic Intelligence System™
            </p>
            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl mb-12">
              The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-gray-900 font-bold text-sm shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                Request a Diagnostic Assessment
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>
              <a
                href="#pillars"
                className="group inline-flex items-center gap-2 px-4 py-3.5 text-white/70 hover:text-white text-sm font-semibold tracking-wide transition-colors duration-200"
              >
                Explore the 16 Pillars
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '16', label: 'Intelligence Pillars' },
              { value: '5',  label: 'Intelligence Engines' },
              { value: '10', label: 'Deliverables' },
              { value: '10', label: 'Industry Editions' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black bg-brand-gradient bg-clip-text text-transparent">{s.value}</p>
                <p className="text-[11px] text-white/40 font-semibold tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PROBLEM ─────────────────────── */}
      <section className="py-28 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5">
        <div
          ref={problemRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${problemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-5">THE PROBLEM</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-black leading-[1.1] tracking-[-0.03em] text-gray-900 dark:text-white mb-8">
                Organizations rarely fail because they lack{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">ambition.</span>
              </h2>
              <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                <p>
                  They struggle because critical constraints remain <span className="font-semibold text-gray-900 dark:text-white">hidden beneath the surface</span> of the business.
                </p>
                <p>
                  Operational inefficiencies accumulate unnoticed. Technology environments become fragmented. Growth engines underperform. Security risks increase. Decision-making slows.
                </p>
                <p>
                  Without a comprehensive diagnosis, organizations risk investing in solutions that address <em>symptoms</em> rather than <em>causes</em>.
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  This is why Kangqore created BIDS™.
                </p>
              </div>
            </div>

            {/* Right — symptoms */}
            <div className="lg:pt-10">
              <p className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-6">FAMILIAR SYMPTOMS</p>
              <div className="space-y-3">
                {symptoms.map(s => (
                  <div key={s} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">{s}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm text-gray-400 font-medium">
                These symptoms are rarely the root problem. The underlying causes exist across interconnected systems, functions, teams, and decision-making structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── DEFINITION ─────────────────────── */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,100,234,0.12)_0%,transparent_70%)]" />
        </div>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">WHAT IS BIDS™</p>
              <h2 className="text-3xl sm:text-4xl font-black leading-[1.1] tracking-[-0.03em] text-white mb-8">
                The complete enterprise diagnostic intelligence framework
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8 text-base sm:text-lg">
                Kangqore BIDS™ evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem. Unlike traditional assessments that focus on isolated departments, BIDS™ examines the complete enterprise landscape.
              </p>
              <div className="space-y-4">
                {[
                  'Identifies hidden constraints',
                  'Quantifies their business impact',
                  'Prioritizes transformation opportunities',
                  'Generates a strategic roadmap for intelligent growth',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-10 pl-5 border-l-2 border-cyan-400">
                <p className="text-white font-bold text-lg italic">
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
      <section id="pillars" className="py-28 bg-[#06090f] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(74,182,212,0.07)_0%,transparent_60%)]" />
        </div>
        <div
          ref={pillarsRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">THE FRAMEWORK</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white mb-4">
              16 Diagnostic Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Pillars™</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
              Every pillar generates a proprietary intelligence score. Together, they form a complete picture of your enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.n}
                  className="bg-[#06090f] p-6 group hover:bg-white/[0.03] transition-colors duration-300"
                  style={{ transitionDelay: pillarsVisible ? `${i * 30}ms` : '0ms' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[11px] font-black tracking-widest bg-brand-gradient bg-clip-text text-transparent">{p.n}</span>
                    <Icon className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-white font-bold text-sm leading-snug mb-3">{p.name}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{p.score}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── 5 ENGINES ─────────────────────── */}
      <section className="py-28 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5">
        <div
          ref={enginesRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${enginesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-4">UNDER THE HOOD</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-gray-900 dark:text-white mb-4">
              5 Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Engines™</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
              Every engagement is powered by five integrated intelligence engines that synthesize pillar findings into actionable business intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {engines.map((e, i) => {
              const Icon = e.icon;
              return (
                <div
                  key={e.name}
                  className="group relative rounded-2xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/[0.02] p-6 hover:border-gray-200 dark:hover:border-white/15 transition-all duration-300 overflow-hidden"
                  style={{ transitionDelay: enginesVisible ? `${i * 80}ms` : '0ms' }}
                >
                  {/* Accent top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${e.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-900 dark:text-white font-bold text-sm leading-snug mb-4">{e.name}</p>
                  <ul className="space-y-2">
                    {e.items.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/30 mt-2 flex-shrink-0" />
                        <span className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{item}</span>
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
      <section className="py-28 bg-[#06090f] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,100,234,0.10)_0%,transparent_60%)]" />
        </div>
        <div
          ref={delivRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${delivVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">WHAT YOU RECEIVE</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-white mb-4">
              Every Engagement{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Delivers</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
              Ten proprietary deliverables. Each designed to give leadership teams the intelligence and tools to act decisively.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.name}
                  className="bg-[#06090f] p-7 group hover:bg-white/[0.03] transition-colors duration-300"
                  style={{ transitionDelay: delivVisible ? `${i * 40}ms` : '0ms' }}
                >
                  <div className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center mb-5 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-all duration-300">
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-white font-bold text-sm leading-snug mb-2">{d.name}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── PHILOSOPHY ─────────────────────── */}
      <section className="py-28 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-500 uppercase mb-8">THE KANGQORE DIFFERENCE</p>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { before: 'Most consulting firms begin with', after: 'solutions.', kq: 'Kangqore begins with diagnosis.' },
              { before: 'Most providers ask:', after: '"What would you like to purchase?"', kq: 'Kangqore asks: "What is limiting the performance of this organization?"' },
              { before: 'Before transformation comes', after: '', kq: 'understanding. Before investment comes intelligence. Before execution comes diagnosis.' },
            ].map((block, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 dark:border-white/8 p-8">
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{block.before} <span className="text-gray-700 dark:text-gray-300 font-semibold">{block.after}</span></p>
                <p className="text-gray-900 dark:text-white font-bold text-base leading-relaxed">{block.kq}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── INDUSTRY EDITIONS ─────────────────────── */}
      <section className="py-20 bg-[#06090f] border-t border-white/5">
        <div
          ref={editionsRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${editionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-4">TAILORED TO YOUR SECTOR</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] text-white">
              10 Industry{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Editions™</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {editions.map((e, i) => (
              <span
                key={e}
                className="px-5 py-2.5 rounded-full border border-white/10 text-sm text-white/60 font-semibold hover:border-cyan-400/40 hover:text-white hover:bg-cyan-400/5 transition-all duration-200 cursor-default"
                style={{ transitionDelay: editionsVisible ? `${i * 40}ms` : '0ms' }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section className="relative py-36 overflow-hidden bg-black">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/chess_bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_70%)]" />
        </div>
        <div
          ref={ctaRef}
          className={`relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-6">READY TO BEGIN</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-[-0.04em] text-white mb-6">
            Diagnose the Enterprise.{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Unlock the Potential.</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Every organization has visible problems and invisible constraints. Kangqore BIDS™ identifies those constraints, quantifies their impact, and delivers a transformation blueprint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-sm shadow-2xl hover:scale-[1.03] transition-all duration-300"
            >
              Request a Diagnostic Assessment
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-semibold tracking-wide transition-colors duration-200"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
