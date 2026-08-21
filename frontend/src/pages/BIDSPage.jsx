import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Target, Users, Landmark, Factory, Briefcase, Star,
  TrendingUp, Globe, Cpu, Cloud, BarChart3, Bot, Zap, Lock,
  Scale, Sparkles, RefreshCw, Activity,
  Database, Award, Layers, Shield, ChevronRight, Download, FileText, CheckCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import BIDSProductVisual from '../components/hero/BIDSProductVisual';
import VisualBackground from '../components/VisualBackground';
import ConciergeSection from '../components/concierge/ConciergeSection';
import ProblemTrilogy from '../components/bids/ProblemTrilogy';
import BIDSRuler from '../components/bids/BIDSRuler';


const TypewriterText = ({ text, start = true, delay = 30 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (start && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, start, text]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{text}</span>
      <span className="absolute left-0 top-0 whitespace-nowrap">
        {currentText}
      </span>
    </span>
  );
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const pillars = [
  { n: '01', icon: Target,      name: 'Business Strategy Intelligence',       score: 'Strategy Maturity Score · Growth Readiness Index' },
  { n: '02', icon: Users,       name: 'Leadership Intelligence',              score: 'Leadership Effectiveness Score' },
  { n: '03', icon: Landmark,    name: 'Financial Intelligence',               score: 'Financial Health Score' },
  { n: '04', icon: Factory,     name: 'Operational Intelligence',             score: 'Operational Efficiency Score' },
  { n: '05', icon: Briefcase,   name: 'Workforce Intelligence',               score: 'Workforce Readiness Score' },
  { n: '06', icon: Star,        name: 'Customer Intelligence',                score: 'Customer Experience Score' },
  { n: '07', icon: TrendingUp,  name: 'Sales Intelligence',                   score: 'Revenue Engine Score' },
  { n: '08', icon: Globe,       name: 'Growth Intelligence',                  score: 'Digital Growth Score' },
  { n: '09', icon: Cpu,         name: 'Technology Intelligence',              score: 'Technology Maturity Score' },
  { n: '10', icon: Cloud,       name: 'Cloud & Infrastructure Intelligence',  score: 'Infrastructure Readiness Score' },
  { n: '11', icon: Database,    name: 'Data Intelligence',                    score: 'Data Maturity Score' },
  { n: '12', icon: Bot,         name: 'AI Intelligence',                      score: 'AI Readiness Score' },
  { n: '13', icon: Zap,         name: 'Automation Intelligence',              score: 'Automation Maturity Score' },
  { n: '14', icon: Lock,        name: 'Cybersecurity Intelligence',           score: 'Cyber Resilience Score' },
  { n: '15', icon: Scale,       name: 'Governance & Risk Intelligence',       score: 'Governance Maturity Score' },
  { n: '16', icon: Sparkles,    name: 'Transformation Intelligence',          score: 'Transformation Readiness Score' },
];

const engines = [
  {
    dept: 'Cognition',
    name: 'Cognition Intelligence Engine',
    icon: Bot,
    color: 'from-cyan-400 via-sky-400 to-blue-500',
    hex: '#22D3EE',
    desc: 'Diagnoses AI readiness, GenAI adoption potential, data maturity for intelligence workloads, and automation opportunity across the enterprise.',
    image: '/assets/engines/engine1.png'
  },
  {
    dept: 'Foundry',
    name: 'Foundry Intelligence Engine',
    icon: Cloud,
    color: 'from-blue-400 via-indigo-400 to-blue-600',
    hex: '#60A5FA',
    desc: 'Evaluates infrastructure health, cloud migration readiness, engineering platform maturity, and technology resilience against operational demands.',
    image: '/assets/engines/engine2.png'
  },
  {
    dept: 'Reimagine',
    name: 'Reimagine Intelligence Engine',
    icon: RefreshCw,
    color: 'from-violet-400 via-purple-400 to-fuchsia-500',
    hex: '#A78BFA',
    desc: 'Identifies modernization priorities, legacy system exposure, digital transformation readiness, and change execution capability.',
    image: '/assets/engines/engine3.png'
  },
  {
    dept: 'Shield',
    name: 'Shield Intelligence Engine',
    icon: Shield,
    color: 'from-rose-400 via-pink-400 to-red-500',
    hex: '#FB7185',
    desc: 'Assesses cybersecurity posture, compliance gap exposure, AI governance coverage, and operational trust maturity across business systems.',
    image: '/assets/engines/engine4.png'
  },
  {
    dept: 'Platforms',
    name: 'Platforms Intelligence Engine',
    icon: Layers,
    color: 'from-amber-400 via-orange-400 to-orange-500',
    hex: '#FBBF24',
    desc: 'Diagnoses enterprise platform utilization, integration complexity, process maturity, and consolidation opportunities across technology stacks.',
    image: '/assets/engines/engine5.png'
  },
  {
    dept: 'Growth',
    name: 'Growth Intelligence Engine',
    icon: TrendingUp,
    color: 'from-emerald-400 via-teal-400 to-green-500',
    hex: '#34D399',
    desc: 'Maps revenue engine performance, marketing execution gaps, conversion bottlenecks, and digital visibility against growth potential.',
    image: '/assets/engines/engine6.png'
  },
];

const deliverables = [
  { icon: BarChart3,   name: 'Diagnostic Scorecard',          desc: 'Enterprise-wide scoring across all sixteen intelligence pillars.' },
  { icon: Award,       name: 'Executive Intelligence Report',  desc: 'Comprehensive executive-level findings and recommendations.' },
  { icon: Layers,      name: 'Transformation Blueprint',       desc: 'Prioritized transformation strategy and execution roadmap.' },
  { icon: Shield,      name: 'Risk Register',                  desc: 'Identified organizational, technology, operational, and cybersecurity risks.' },
  { icon: Sparkles,    name: 'Opportunity Register',           desc: 'High-value growth, efficiency, AI, automation, and modernization opportunities.' },
  { icon: Target,      name: 'Service Prescription Matrix',    desc: 'Recommended capability areas aligned to identified needs.' },
  { icon: RefreshCw,   name: '30/60/90/180-Day Roadmap',       desc: 'A phased transformation execution plan.' },
  { icon: Users,       name: 'Executive Board Presentation',   desc: 'Boardroom-ready strategic findings presentation.' },
  { icon: Activity,    name: 'Executive Workshop',             desc: 'Leadership alignment and transformation planning session.' },
  { icon: TrendingUp,  name: 'ROI Projection Report',          desc: 'Estimated value creation, efficiency gains, risk reduction, and growth potential.' },
];

const editions = [
  'Manufacturing Edition', 'Education Edition', 'Healthcare Edition',
  'Financial Services Edition', 'Retail & Commerce Edition', 'SaaS & Technology Edition',
  'Government Edition', 'Startup Edition', 'Enterprise Edition', 'Non-Profit Edition',
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

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function BIDSPage() {
  const [heroRef, heroVisible]         = useScrollAnimation({ once: true, threshold: 0.1 });
  const [defRef, defVisible]           = useScrollAnimation({ once: true, threshold: 0.1 });
  const [pillarsRef, pillarsVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [enginesRef, enginesVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [delivRef, delivVisible]       = useScrollAnimation({ once: true, threshold: 0.05 });
  const [editionsRef, editionsVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const [processRef, processVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [ctaRef, ctaVisible]           = useScrollAnimation({ once: true, threshold: 0.2 });
  const [activePillar, setActivePillar] = useState(0);
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [activeDeliverable, setActiveDeliverable] = useState(0);
  const [execAnswers, setExecAnswers] = useState({});
  const [assessmentEmail, setAssessmentEmail] = useState('');
  const [assessmentEmailSent, setAssessmentEmailSent] = useState(false);

  return (
    <div className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>
      <SEO
        title="Kangqore BIDS™ — Business Diagnostic Intelligence System™"
        description="The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth. 16 diagnostic pillars. 6 intelligence engines. One complete diagnostic."
        keywords="Kangqore BIDS, Business Diagnostic Intelligence System, enterprise diagnostic, transformation blueprint, AI readiness, cybersecurity assessment"
        url="/bids"
      />

      <BIDSRuler />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-36 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          {/* Full-bleed background image with layered dark gradient overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/imgbg3.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            {/* Bottom-up: heaviest at the text/CTA zone */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
            {/* Left-side: darkens the content column */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          </div>

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div
          ref={heroRef}
          className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Removed translate-y-10 as we are moving it downwards by reducing pb-32 to pb-20 on the parent section */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-bold tracking-[0.2em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase">
                <TypewriterText text="Every organization has visible problems and invisible constraints." start={heroVisible} />
              </p>
            </div>

            <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-8 drop-shadow-2xl">
              Kangqore{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">BIDS™</span>
            </h1>

            <p className="text-lg sm:text-xl text-cyan-50/80 font-semibold tracking-normal mb-6">
              Kangqore Business Diagnostic Intelligence System
            </p>

            <p className="text-base text-white/50 leading-[1.8] max-w-lg mb-14 font-medium">
              The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth — revealing hidden constraints before they become critical failures.
            </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  to="/bids-request"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">Request a Diagnostic Assessment</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <a
                  href="#pillars"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore our Diagnostic Intelligence
                  <ArrowRight className="w-4 h-4 text-[#2564ea] group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>

            </div>
          </div>

        {/* Scrolling Pillars Strip — same pattern as UniversalServicePage hero */}
        <div
          className="absolute bottom-6 left-0 right-0 z-20 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <div
            className="flex items-center gap-4 w-max"
            style={{ animation: 'bids-strip-scroll 55s linear infinite' }}
          >
            {[...pillars, ...pillars, ...pillars].map((p, i) => {
              const Icon = p.icon;
              const color = i % 2 === 0 ? '#2564ea' : '#22d3ee';
              return (
                <div key={i} className="flex items-center gap-4 bg-[#0a0a0c] border border-white/10 rounded-2xl p-1.5 pr-6 shadow-2xl flex-shrink-0 cursor-default hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-12 rounded-xl flex items-center justify-center bg-white/5 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${color}, transparent)` }} />
                    <Icon className="w-5 h-5 relative z-10" style={{ color }} />
                  </div>
                  <span className="text-[14px] font-semibold text-white/90 tracking-tight whitespace-nowrap">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </div>



      {/* ─────────────────────── PROBLEM TRILOGY (GSAP ScrollTrigger) ─────────────────────── */}
      <div id="problem"><ProblemTrilogy /></div>


      {/* ─────────────────────── DEFINITION ─────────────────────── */}
      <section id="definition" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Top — heading + visual */}
          <div className="mb-14">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">WHAT IS KANGQORE BIDS™</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl">
              The complete enterprise diagnostic{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">intelligence</span><br />
              framework.
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-20">
            <div>
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-10 font-light max-w-xl">
                The framework evaluates, benchmarks, scores, and analyzes an entire organization as an interconnected ecosystem — diagnosing the full enterprise before any transformation investment is made.
              </p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-14">
                The enterprises that diagnose before they invest don't just reduce risk.{' '}
                <span className="text-white">They outgrow everyone who didn't.</span>
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
            {/* Right — product visual (80% of column = 20% smaller) */}
            <div className="lg:-mt-[226px]">
              <div className="max-w-[80%] ml-auto">
                <BIDSProductVisual
                  isActive={defVisible}
                  className="aspect-[4/5]"
                />
              </div>
            </div>
          </div>

          {/* Process teaser */}
          <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-black tracking-[0.35em] text-white/25 uppercase">Engagement Process</span>
            <span className="text-white/10 text-sm">·</span>
            <span className="text-[13px] font-medium text-white/50">10 structured steps</span>
            <span className="text-white/10 text-sm">·</span>
            <span className="text-[13px] font-medium text-white/50">2–12 weeks depending on scope</span>
            <a href="#process" className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-black bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent tracking-widest uppercase transition-colors duration-200">
              View Full Process <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Brand footer bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#06090f] border border-white/[0.08] rounded-2xl mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">Kangqore BIDS™</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <span className="text-white/35 text-sm font-medium">Kangqore Business Diagnostic Intelligence System</span>
            </div>
            <a
              href="#process"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200 flex-shrink-0"
            >
              View the Engagement Process
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Pull quote */}
          <div className="border-l-2 border-white/10 pl-8">
            <p className="text-xl sm:text-2xl font-black text-white/50 leading-snug max-w-4xl">
              "What is preventing this organization from achieving its full potential?"
            </p>
            <p className="text-lg font-black text-white mt-3">
              The diagnostic framework exists to answer this — precisely, quantifiably, and without conflict of interest.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────── FRAMEWORK BADGE STRIP ─────────────────────── */}
      <div className="border-t border-b border-white/[0.05] py-10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[8px] font-black tracking-[0.45em] text-white/18 uppercase mb-7 text-center">BUILT UPON GLOBALLY RECOGNIZED STANDARDS</p>
          <div className="flex flex-nowrap items-center justify-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {[
              'NIST CSF 2.0', 'NIST AI RMF', 'ISO/IEC 27001', 'ISO/IEC 42001',
              'AWS Cloud Adoption Framework', 'CIS Critical Controls',
              'DORA Metrics', 'TOGAF', 'Enterprise Risk Management',
            ].map((f, i, arr) => (
              <React.Fragment key={f}>
                <span className="flex-shrink-0 text-white/25 text-[10px] font-bold tracking-[0.12em] whitespace-nowrap">
                  {f}
                </span>
                {i < arr.length - 1 && (
                  <span className="flex-shrink-0 mx-4 text-white/10 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────── eQORE AI CONCIERGE ─────────────────────── */}
      <div id="concierge"><ConciergeSection inverted suggestedPrompts={[
        'What is Kangqore BIDS™?',
        'What are the 16 diagnostic pillars?',
        'How does a Kangqore BIDS™ engagement work?',
        'What deliverables do I receive?',
        'How long does an engagement take?',
        'What is the Prescription Engine™?',
        'Which industry edition fits us?',
        'How is Kangqore BIDS™ different from consulting?',
        'What is Benchmark Intelligence?',
        'What is the eQORE AI™ role in Kangqore BIDS™?',
        'What does a Kangqore BIDS™ scorecard look like?',
        'Request a Diagnostic Assessment',
      ]} /></div>

      {/* ─────────────────────── MID-FUNNEL BRIDGE ─────────────────────── */}
      <div className="py-14 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 rounded-2xl border border-white/[0.07] bg-[#06090f]">
            <div>
              <p className="text-[9px] font-black tracking-[0.4em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-3">NOT READY FOR A FULL ASSESSMENT?</p>
              <p className="text-white font-black text-xl leading-snug mb-2">Start with a 20-minute discovery call.</p>
              <p className="text-white/35 text-sm font-medium leading-relaxed max-w-xl">
                Walk through the Kangqore BIDS™ framework with a senior specialist. No commitment, no pitch — a clear picture of how the diagnostic works and whether it fits your current priorities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cyan-400/30 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent font-black text-sm tracking-wide hover:bg-cyan-400/10 transition-colors duration-200"
              >
                Book a Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#deliverables"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/[0.08] text-white/35 font-black text-sm tracking-wide hover:text-white/60 hover:border-white/[0.15] transition-all duration-200"
              >
                See What's Delivered
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────── CEO QUESTIONS (INTERACTIVE) ─────────────────────── */}
      <section id="ceo-assessment" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">EXECUTIVE CLARITY CHECK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
              Questions every<br />executive should<br /><span className="bg-brand-gradient bg-clip-text text-transparent">be able to answer.</span>
            </h2>
            <p className="text-white/50 text-lg font-medium leading-relaxed">
              Rate your organization's current clarity on each question. The results indicate where diagnostic intelligence delivers the highest value.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
            {/* Left — interactive questions */}
            <div className="space-y-2.5">
              {[
                'What is limiting our growth?',
                'Where is our highest business risk?',
                'Which investments generate the greatest return?',
                'Are we ready for AI?',
                'Are we secure?',
                'Are we scalable?',
                'Are we transformation-ready?',
              ].map((q, i) => {
                const answer = execAnswers[i];
                return (
                  <div
                    key={q}
                    className={`p-5 rounded-2xl border transition-all duration-200 ${answer ? 'border-white/[0.14] bg-[#06090f]' : 'border-white/[0.07] bg-[#06090f]'}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-[9px] font-black tracking-widest text-white/20 mt-1 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <p className={`font-semibold text-base leading-snug transition-colors duration-200 ${answer ? 'text-white' : 'text-white/55'}`}>{q}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-8">
                      {[
                        { value: 'clear',   label: 'Clear',       color: '#34D399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.35)',  dimBg: 'rgba(52,211,153,0.04)',  dimBorder: 'rgba(52,211,153,0.18)',  dimColor: 'rgba(52,211,153,0.50)'  },
                        { value: 'partial', label: 'Partial',     color: '#22D3EE', bg: 'rgba(34,211,238,0.10)',  border: 'rgba(34,211,238,0.30)',  dimBg: 'rgba(34,211,238,0.04)',  dimBorder: 'rgba(34,211,238,0.16)',  dimColor: 'rgba(34,211,238,0.50)'  },
                        { value: 'unclear', label: 'Unclear',     color: '#FBBF24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.30)',  dimBg: 'rgba(251,191,36,0.04)',  dimBorder: 'rgba(251,191,36,0.16)',  dimColor: 'rgba(251,191,36,0.50)'  },
                        { value: 'unknown', label: "Don't Know",  color: '#FB7185', bg: 'rgba(251,113,133,0.10)', border: 'rgba(251,113,133,0.30)', dimBg: 'rgba(251,113,133,0.04)', dimBorder: 'rgba(251,113,133,0.16)', dimColor: 'rgba(251,113,133,0.50)' },
                      ].map(opt => {
                        const selected = answer === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setExecAnswers(prev => ({ ...prev, [i]: opt.value }))}
                            className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase transition-all duration-150 cursor-pointer border"
                            style={{
                              color:           selected ? opt.color      : opt.dimColor,
                              backgroundColor: selected ? opt.bg         : opt.dimBg,
                              borderColor:     selected ? opt.border     : opt.dimBorder,
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right — sticky readiness signal */}
            <div className="lg:sticky lg:top-8">
              {(() => {
                const answered     = Object.keys(execAnswers).length;
                const clearCount   = Object.values(execAnswers).filter(v => v === 'clear').length;

                const getProfile = () => {
                  if (answered === 0) return null;
                  if (clearCount >= 5) return {
                    label:   'Strong Baseline',
                    color:   '#34D399',
                    message: 'You have solid executive visibility. The diagnostic will validate your current picture and surface the blind spots your existing data doesn\'t reach.',
                    signal:  'The diagnostic sharpens — it does not rebuild — your strategic view.',
                  };
                  if (clearCount >= 3) return {
                    label:   'Partial Visibility',
                    color:   '#22D3EE',
                    message: 'You have clear answers in some areas but meaningful gaps elsewhere. This is the most common diagnostic profile — exactly where structured assessment delivers high value.',
                    signal:  'The diagnostic will surface specific constraints in your unclear areas.',
                  };
                  return {
                    label:   'High Diagnostic Value',
                    color:   '#FB923C',
                    message: 'Organizations with limited executive clarity derive the strongest impact from structured diagnosis. The gaps you cannot see are exactly what the framework surfaces.',
                    signal:  'This is precisely the scenario Kangqore BIDS™ was engineered for.',
                  };
                };

                const profile = getProfile();

                return (
                  <div className="p-7 rounded-2xl border border-white/[0.07] bg-[#06090f]">
                    <p className="text-[9px] font-black tracking-[0.4em] text-white/25 uppercase mb-6">DIAGNOSTIC READINESS PROFILE</p>

                    {/* Progress bar */}
                    <div className="mb-7">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-black text-white/30 tracking-wide">{answered}/7 answered</span>
                        {answered > 0 && <span className="text-xs font-black text-white/30 tracking-wide">{clearCount} clear</span>}
                      </div>
                      <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width:           `${(answered / 7) * 100}%`,
                            backgroundColor: profile ? profile.color : '#374151',
                          }}
                        />
                      </div>
                    </div>

                    {!profile ? (
                      <div>
                        <p className="text-white/20 text-sm font-medium leading-relaxed mb-8">
                          Rate each question to generate your diagnostic readiness profile.
                        </p>
                        <div className="space-y-2.5">
                          {[
                            { color: '#34D399', label: 'Clear — I can answer this precisely' },
                            { color: '#22D3EE', label: 'Partial — I have an answer but it lacks depth' },
                            { color: '#FBBF24', label: 'Unclear — I know this is a gap' },
                            { color: '#FB7185', label: "Don't Know — I don't have visibility" },
                          ].map(hint => (
                            <div key={hint.label} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: hint.color }} />
                              <span className="text-white/20 text-xs font-medium">{hint.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-5">
                          <p className="text-[9px] font-black tracking-widest uppercase mb-2" style={{ color: profile.color }}>Profile</p>
                          <p className="text-white font-black text-2xl leading-tight">{profile.label}</p>
                        </div>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">{profile.message}</p>
                        <div className="p-4 rounded-xl border mb-6" style={{ borderColor: profile.color + '30', backgroundColor: profile.color + '0a' }}>
                          <p className="text-sm font-semibold leading-snug" style={{ color: profile.color }}>{profile.signal}</p>
                        </div>
                        {answered >= 5 && (
                          assessmentEmailSent ? (
                            <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] text-center">
                              <p className="text-emerald-400 font-black text-sm">Profile sent to {assessmentEmail}</p>
                              <p className="text-white/30 text-xs mt-1.5">We'll follow up within 24 business hours.</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[9px] font-black tracking-[0.35em] text-white/30 uppercase mb-3">GET YOUR READINESS PROFILE</p>
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="email"
                                  value={assessmentEmail}
                                  onChange={e => setAssessmentEmail(e.target.value)}
                                  placeholder="your@email.com"
                                  className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                                />
                                <button
                                  onClick={() => assessmentEmail.includes('@') && setAssessmentEmailSent(true)}
                                  className="flex-shrink-0 px-4 py-2.5 rounded-full bg-white text-gray-900 font-black text-sm hover:bg-white/90 transition-colors duration-200"
                                >
                                  Send
                                </button>
                              </div>
                              <p className="text-white/20 text-xs text-center">
                                Or{' '}
                                <Link to="/contact" className="text-[#2564ea] hover:text-[#2564ea] transition-colors">
                                  book a scoping call
                                </Link>
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── PRESCRIPTION ENGINE ─────────────────────── */}
      <section id="prescription" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">THE PRESCRIPTION ENGINE™</p>
            <div className="grid lg:grid-cols-2 gap-16 items-end">
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                From score to<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">strategic action.</span>
              </h2>
              <p className="text-white/35 text-base font-medium leading-relaxed lg:pb-2">
                The Prescription Engine™ translates diagnostic findings into a prioritized action plan. Because Kangqore both diagnoses and delivers — across AI, engineering, cloud, security, and growth — the prescription maps directly to execution-ready capability. No translation loss. No second opinion needed.
              </p>
            </div>
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
                step: '02', color: 'from-brand-blue to-violet-600', dotColor: '#E8614A', numColor: '#E8614A',
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
                title: 'Service Prescription Matrix',
                items: ['Digital Transformation', 'Strategy Consulting', 'Application Modernization', 'Enterprise Platform Integration'],
                note: 'Mapped to Kangqore capability areas — execution-ready from day one',
              },
            ].map((phase, i) => (
              <div key={phase.step} className="relative lg:px-6 first:lg:pl-0 last:lg:pr-0">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-5 right-0 translate-x-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-white/15" />
                  </div>
                )}
                <p className={`text-[10px] font-black tracking-[0.4em] uppercase mb-5 ${phase.numColor ? '' : `bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}`} style={phase.numColor ? { color: phase.numColor } : undefined}>{phase.step}</p>
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
          {/* Independence statement */}
          <div className="mb-10 p-5 border border-white/[0.07] bg-white/[0.02] rounded-2xl flex items-start gap-4 max-w-3xl">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
            <p className="text-white/50 text-sm font-medium leading-relaxed">
              The diagnostic findings — scorecard, risk register, transformation blueprint, and all deliverables — are provided as a{' '}
              <span className="text-white font-semibold">complete intelligence product</span>. The Service Prescription Matrix maps every identified constraint to a Kangqore capability area, so the path from diagnosis to execution is immediate — no re-scoping, no second engagement, no translation loss.
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white/60 max-w-3xl leading-snug">
            This is where{' '}
            <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Kangqore BIDS™</span>{' '}
            translates scored findings into a prioritized action plan, mapping each identified constraint to the capability area best positioned to address it.
          </p>
        </div>
      </section>


      {/* ─────────────────────── WHO THIS IS FOR ─────────────────────── */}
      <section className="py-24 relative overflow-hidden border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">WHO THIS IS DESIGNED FOR</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                Built for organizations<br /><span className="bg-brand-gradient bg-clip-text text-transparent">preparing for significant change.</span>
              </h2>
              <p className="text-white/50 text-base font-medium leading-relaxed mb-10">Typical engagements include:</p>
              <div className="space-y-0">
                {[
                  'Growth-stage companies scaling beyond founder-led operations',
                  'Mid-market organizations modernizing systems, processes, and technology',
                  'Multi-location businesses seeking operational visibility and efficiency',
                  'Enterprises preparing for large transformation programs',
                  'Organizations evaluating AI, cloud, automation, cybersecurity, or modernization investments',
                ].map((item, i, arr) => (
                  <div key={item}>
                    <div className="flex items-start gap-4 py-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 mt-2 flex-shrink-0" />
                      <p className="text-white/60 text-base font-medium leading-snug">{item}</p>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-2 ml-[2.75px] bg-white/[0.04]" />}
                  </div>
                ))}
              </div>
              <p className="mt-8 text-white/25 text-sm font-medium leading-relaxed max-w-xl">
                Most valuable when leadership teams are making high-impact decisions and require objective intelligence before committing significant resources.
              </p>
            </div>
            <div className="lg:pt-14">
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <p className="text-[9px] font-black tracking-[0.4em] text-white/30 uppercase mb-6">ENGAGEMENT AVAILABILITY</p>
                <h3 className="text-white font-black text-xl mb-4 leading-tight">
                  Currently accepting Q3–Q4 2026 discovery and transformation engagements.
                </h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed mb-8">
                  Each engagement involves direct senior-specialist involvement throughout the assessment — from executive scoping through to findings delivery. We accept new diagnostic engagements on an ongoing basis and respond to all scoping requests within 24–48 business hours.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-colors duration-200"
                >
                  Start a Scoping Conversation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────── DIAGNOSTIC ENGAGEMENT PROCESS ─────────────────────── */}
      <section id="process" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={processRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">THE PROCESS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                The Diagnostic<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Engagement Process</span>
              </h2>
            </div>
            <div className="lg:pb-3">
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-8">
                A structured, ten-step process from initial request through executive delivery — designed to match the pace of how executive teams actually make decisions.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-white font-black text-sm tracking-wide">Request a Scoping Session</span>
                <ArrowRight className="w-4 h-4 text-[#2564ea] group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 lg:gap-x-24">
            {[
              {
                n: '01',
                name: 'Request Submitted',
                desc: 'Submit your diagnostic request along with key business, technology, operational, or transformation objectives.',
                color: '#22D3EE',
              },
              {
                n: '02',
                name: 'Initial Review',
                desc: 'The Kangqore team performs a preliminary review of your requirements and organizational context.',
                color: '#FB923C',
                sla: 'Response within 24–48 business hours.',
              },
              {
                n: '03',
                name: 'Executive Scoping Session',
                desc: 'A 30–60 minute executive discovery session focused on business objectives, strategic priorities, current challenges, growth constraints, and transformation goals.',
                color: '#60A5FA',
              },
              {
                n: '04',
                name: 'Root Cause Identification',
                desc: 'The initial diagnostic phase identifies potential areas of concern, hidden constraints, operational bottlenecks, technology gaps, risk exposure, and transformation opportunities.',
                color: '#F472B6',
              },
              {
                n: '05',
                name: 'Diagnostic Proposal & Scope Definition',
                desc: 'Receive a tailored engagement proposal outlining assessment scope, stakeholder involvement, diagnostic pillars, timeline, deliverables, and engagement structure.',
                color: '#FDE047',
              },
              {
                n: '06',
                name: 'Enterprise Evaluation',
                desc: 'The organization is evaluated across the diagnostic framework using leadership interviews, documentation reviews, technology assessments, operational analysis, data and AI evaluations, security and governance reviews, and growth assessments.',
                color: '#86EFAC',
              },
              {
                n: '07',
                name: 'Intelligence Scoring & Findings',
                desc: 'The assessment is processed through the Intelligence Engines to generate the Business Health Score, Constraint Analysis, Risk Register, Opportunity Register, Benchmark Insights, and Transformation Priorities.',
                color: '#A78BFA',
              },
              {
                n: '08',
                name: 'Executive Findings Presentation',
                desc: 'Leadership teams receive a detailed presentation of findings, root causes, risks, opportunities, and strategic recommendations.',
                color: '#E8614A',
              },
              {
                n: '09',
                name: 'Transformation Blueprint',
                desc: 'Receive a prioritized 30/60/90/180-day roadmap designed to improve performance, resilience, growth, operational efficiency, technology maturity, and AI readiness.',
                color: '#22D3EE',
              },
              {
                n: '10',
                name: 'Transformation Engagement',
                desc: "The diagnostic prescription maps directly to Kangqore's transformation ecosystem — spanning strategy, technology, AI, cybersecurity, modernization, cloud, automation, platform, and growth services. Execution begins where diagnosis ends.",
                color: '#60A5FA',
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 py-8 border-t border-white/[0.06]">
                <span className="text-[9px] font-black tracking-widest mt-1 flex-shrink-0 w-6" style={{ color: step.color }}>{step.n}</span>
                <div>
                  <p className="text-white font-black text-base mb-2 leading-tight">{step.name}</p>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">{step.desc}</p>
                  {step.sla && (
                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.04]">
                      <div className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent text-xs font-bold">{step.sla}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-10 border-t border-white/[0.06]">
            <p className="text-[9px] font-black tracking-[0.35em] text-white/20 uppercase mb-3">PROPRIETARY METHODOLOGY</p>
            <p className="text-white/50 text-sm font-medium leading-relaxed mb-4 max-w-2xl">
              The scoring methodology — including pillar weightings, data point inputs, and cross-engine synthesis logic — is proprietary. A methodology overview is available upon request for qualified engagements.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-[#2564ea] hover:text-[#2564ea] transition-colors duration-200 text-sm font-bold">
              Request Methodology Overview <ChevronRight className="w-4 h-4" />
            </Link>
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
            <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">THE FRAMEWORK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              16 Diagnostic Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Pillars</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 lg:gap-24 lg:h-[700px]">
            {/* Left — scrollable list within section */}
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {pillars.map((p, i) => {
                const active = activePillar === i;
                const expanded = expandedPillar === i;
                return (
                  <div key={p.n} className="border-b border-white/[0.06]">
                    <div
                      onMouseEnter={() => setActivePillar(i)}
                      onClick={() => setExpandedPillar(expanded ? null : i)}
                      className="group flex items-center justify-between gap-5 py-5 cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <span className={`w-2.5 h-2.5 flex-shrink-0 transition-colors duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent'}`} />
                        <span className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/25 group-hover:text-white/55'}`}>
                          {p.name}
                        </span>
                      </div>
                      <ChevronRight className={`lg:hidden w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
                    </div>
                    {/* Mobile tap-to-expand detail */}
                    {expanded && (
                      <div className="lg:hidden pb-6 pl-7 pr-2">
                        <p className="text-[9px] font-black tracking-[0.35em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-3">PILLAR {p.n}</p>
                        <p className="text-white/70 text-base font-semibold mb-2">{pillarDetails[i].tagline}</p>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">{pillarDetails[i].desc}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10">
                          <span className="text-white/50 text-xs font-semibold tracking-wide">{p.score}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right — floats in place within the section */}
            <div className="hidden lg:flex items-center">
              <div className="w-full">
                <p className="text-[10px] font-black tracking-[0.35em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-6">PILLAR {pillars[activePillar].n}</p>
                <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                  {pillars[activePillar].name}
                </h3>
                <p className="text-white/70 text-lg font-semibold mb-4">{pillarDetails[activePillar].tagline}</p>
                <p className="text-white/50 text-base leading-relaxed mb-10">{pillarDetails[activePillar].desc}</p>
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10">
                  {(() => { const Icon = pillars[activePillar].icon; return <Icon className="w-4 h-4 text-[#2564ea]" strokeWidth={1.5} />; })()}
                  <span className="text-white/50 text-sm font-semibold tracking-wide">{pillars[activePillar].score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── 6 ENGINES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-black">
        <div
          ref={enginesRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${enginesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-20">
            <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5 drop-shadow-md">UNDER THE HOOD</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 drop-shadow-2xl">
              6 Intelligence{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Engines</span>
            </h2>
            <p className="text-white/60 max-w-2xl text-lg sm:text-xl font-medium">
              Every engagement is powered by six integrated intelligence engines that synthesize pillar findings into actionable business intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {engines.map((e, i) => {
              const elevated = i === 1 || i === 4;
              return (
                <div
                  key={e.name}
                  className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${elevated ? 'lg:-translate-y-4' : ''}`}
                >
                  {/* Top Image Area */}
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg">
                    {e.image ? (
                      <img src={e.image} alt={e.dept} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${e.color} opacity-80 transition-opacity duration-500 group-hover:opacity-100`} />
                    )}
                  </div>
                  
                  {/* Bottom Dark Card Area */}
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f]">
                    <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">
                      {e.dept}
                    </h3>
                    
                    <p className="text-white/60 text-sm leading-relaxed">
                      <span className="text-white font-medium">{e.name.split(' ')[0]} :</span> {e.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── DIAGNOSTIC METHODOLOGY ─────────────────────── */}
      <section id="methodology" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="mb-20 max-w-4xl">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">THE DIAGNOSTIC METHODOLOGY</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
              How Kangqore BIDS™<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">conducts enterprise diagnosis.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed font-medium max-w-3xl">
              Not a questionnaire, survey, or checklist. Every engagement combines qualitative, quantitative, operational, and technical intelligence across sixteen diagnostic pillars — synthesizing globally recognized standards into a single evidence-based view.
            </p>
          </div>

          {/* Global Frameworks */}
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] text-white/30 uppercase mb-4">BUILT UPON ESTABLISHED GLOBAL FRAMEWORKS</p>
            <p className="text-white/50 text-base font-medium mb-14 max-w-2xl">
              Kangqore BIDS™ draws upon internationally recognized standards and methodologies to ensure consistency, credibility, and analytical rigor.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  label: 'Cybersecurity, Governance & Risk',
                  color: '#F472B6',
                  image: '/assets/frameworks/cyber.png',
                  items: ['NIST Cybersecurity Framework (CSF 2.0)', 'NIST AI Risk Management Framework (AI RMF)', 'ISO/IEC 27001 Information Security Management', 'CIS Critical Security Controls', 'Enterprise Risk Management Principles'],
                },
                {
                  label: 'Artificial Intelligence & Responsible Innovation',
                  color: '#A78BFA',
                  image: '/assets/frameworks/ai.png',
                  items: ['ISO/IEC 42001 AI Management Systems', 'Responsible AI & AI Governance Frameworks', 'AI Maturity and Adoption Models', 'Enterprise Automation Methodologies'],
                },
                {
                  label: 'Cloud, Technology & Architecture',
                  color: '#60A5FA',
                  image: '/assets/frameworks/cloud.png',
                  items: ['AWS Cloud Adoption Framework (CAF)', 'Cloud Well-Architected Principles', 'Enterprise Architecture Practices', 'Platform Engineering and Modernization Frameworks'],
                },
                {
                  label: 'Data, Analytics & Intelligence',
                  color: '#22D3EE',
                  image: '/assets/frameworks/data.png',
                  items: ['Data Governance Frameworks', 'Analytics and BI Maturity Models', 'Decision Intelligence Methodologies', 'Information Management Best Practices'],
                },
                {
                  label: 'Operations, Engineering & Performance',
                  color: '#86EFAC',
                  image: '/assets/frameworks/ops.png',
                  items: ['DevOps and Platform Engineering Practices', 'DORA Performance Metrics', 'Operational Excellence Frameworks', 'Process Optimization and Continuous Improvement Models'],
                },
                {
                  label: 'Strategy, Growth & Transformation',
                  color: '#FDE047',
                  image: '/assets/frameworks/strategy.png',
                  items: ['Digital Maturity Methodologies', 'Enterprise Transformation Models', 'Organizational Change Management Frameworks', 'Strategic Growth and Capability Development Practices'],
                },
              ].map((cat, i) => (
                <div key={cat.label} className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f] flex flex-col flex-1">
                    <div className="w-6 h-0.5 rounded-full mb-4" style={{ backgroundColor: cat.color }} />
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-5">{cat.label}</h3>
                    <ul className="space-y-3">
                      {cat.items.map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-white/60 text-sm font-medium leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8-Layer Architecture — detailed descriptions */}
          <div className="mb-24 border-t border-white/[0.06] pt-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-white/30 uppercase mb-4">MULTI-LAYER DIAGNOSTIC ARCHITECTURE</p>
            <p className="text-white/50 text-base font-medium mb-14 max-w-2xl">
              Kangqore BIDS™ evaluates organizations through eight interconnected intelligence layers, providing a holistic understanding of enterprise performance and readiness.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { n: '01', layer: 'Executive Intelligence',      color: '#22D3EE', desc: 'Evaluates strategic alignment, leadership effectiveness, governance maturity, decision-making structures, and organizational direction.' },
                { n: '02', layer: 'Operational Intelligence',    color: '#FB923C', desc: 'Assesses workflows, execution capability, operational resilience, process maturity, productivity, and scalability.' },
                { n: '03', layer: 'Technology Intelligence',     color: '#60A5FA', desc: 'Examines architecture, applications, infrastructure, integrations, modernization readiness, and technical debt.' },
                { n: '04', layer: 'Data & AI Intelligence',      color: '#86EFAC', desc: 'Measures data maturity, analytics capability, AI readiness, automation potential, and governance controls.' },
                { n: '05', layer: 'Security & Risk Intelligence',color: '#F472B6', desc: 'Evaluates cybersecurity posture, compliance readiness, resilience capability, risk exposure, and control effectiveness.' },
                { n: '06', layer: 'Growth Intelligence',         color: '#FDE047', desc: 'Assesses customer acquisition, customer experience, revenue operations, market visibility, retention, and growth efficiency.' },
                { n: '07', layer: 'Benchmark Intelligence',      color: '#A78BFA', desc: 'Compares organizational maturity, capability performance, and strategic readiness against industry and peer benchmarks.' },
                { n: '08', layer: 'Prescription Intelligence',   color: '#E8614A', desc: 'Transforms findings into prioritized recommendations, transformation initiatives, execution roadmaps, and service prescriptions.' },
              ].map(l => (
                <div key={l.n} className="p-5 border border-white/[0.07] bg-[#06090f] rounded-xl flex flex-col gap-4">
                  <div>
                    <span className="text-[9px] font-black tracking-widest" style={{ color: l.color + '60' }}>{l.n}</span>
                    <div className="w-5 h-0.5 rounded-full mt-2" style={{ backgroundColor: l.color }} />
                  </div>
                  <p className="text-white/80 text-sm font-black leading-snug">{l.layer}</p>
                  <p className="text-white/35 text-xs font-medium leading-relaxed">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Two columns: methodology inputs left, visual flow right */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">

            {/* Left — 6 methodology categories */}
            <div className="space-y-10">
              {[
                {
                  label: 'Leadership & Stakeholder Intelligence',
                  color: '#22D3EE',
                  points: ['Executive interviews', 'Leadership workshops', 'Strategic objective reviews', 'Organizational structure analysis'],
                },
                {
                  label: 'Business & Operational Intelligence',
                  color: '#FB923C',
                  points: ['Process mapping', 'Workflow analysis', 'SOP review', 'Operational maturity assessment'],
                },
                {
                  label: 'Technology Intelligence',
                  color: '#60A5FA',
                  points: ['Architecture review', 'Application portfolio assessment', 'Infrastructure evaluation', 'Integration analysis', 'Technical debt assessment'],
                },
                {
                  label: 'Data & AI Intelligence',
                  color: '#86EFAC',
                  points: ['Data maturity review', 'Analytics capability assessment', 'AI readiness evaluation', 'Automation opportunity analysis'],
                },
                {
                  label: 'Security & Governance Intelligence',
                  color: '#F472B6',
                  points: ['Security posture review', 'Governance assessment', 'Compliance readiness analysis', 'Risk evaluation'],
                },
                {
                  label: 'Growth & Commercial Intelligence',
                  color: '#FDE047',
                  points: ['Revenue operations review', 'Sales funnel analysis', 'Customer journey evaluation', 'Digital visibility assessment'],
                },
              ].map((cat) => (
                <div key={cat.label} className="flex gap-5">
                  <div className="w-0.5 flex-shrink-0 mt-1 rounded-full" style={{ backgroundColor: cat.color + '60', minHeight: '100%' }} />
                  <div>
                    <p className="text-sm font-black text-white mb-3 tracking-tight" style={{ color: cat.color }}>{cat.label}</p>
                    <ul className="space-y-1.5">
                      {cat.points.map(pt => (
                        <li key={pt} className="flex items-start gap-2.5">
                          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: cat.color + '80' }} />
                          <span className="text-white/50 text-sm font-medium leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — visual flow diagram */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm mx-auto">
                {/* Inputs label */}
                <p className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase text-center mb-6">ENTERPRISE DIAGNOSTIC INPUTS</p>

                {/* Input nodes */}
                {[
                  { label: 'Leadership Interviews', color: '#22D3EE' },
                  { label: 'Documentation Review', color: '#FB923C' },
                  { label: 'Technology Assessment', color: '#60A5FA' },
                  { label: 'Operational Analysis', color: '#86EFAC' },
                  { label: 'Data & AI Evaluation', color: '#FDE047' },
                  { label: 'Security Assessment', color: '#F472B6' },
                  { label: 'Growth Assessment', color: '#A78BFA' },
                ].map((node) => (
                  <div key={node.label} className="flex flex-col items-center">
                    <div className="w-full flex items-center gap-3 px-4 py-2.5 border border-white/[0.08] bg-white/[0.03] rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
                      <span className="text-white/60 text-sm font-semibold">{node.label}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                  </div>
                ))}

                {/* Engine */}
                <div className="w-full px-5 py-4 bg-brand-gradient rounded-xl text-center mb-0">
                  <p className="text-white font-black text-sm tracking-wide">Kangqore BIDS™ Intelligence Engine</p>
                </div>
                <div className="w-px h-4 bg-white/10 mx-auto" />

                {/* Outputs */}
                <p className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase text-center mb-4">OUTPUTS</p>
                <div className="space-y-2">
                  {[
                    'Business Health Score',
                    'Constraint Analysis',
                    'Benchmark Intelligence',
                    'Transformation Blueprint',
                  ].map(out => (
                    <div key={out} className="flex items-center gap-3 px-4 py-2.5 border border-cyan-500/20 bg-cyan-500/[0.04] rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent text-sm font-semibold">{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scope & System Access */}
          <div className="border-t border-white/[0.06] pt-20">
            <p className="text-[10px] font-black tracking-[0.45em] text-white/30 uppercase mb-6">SCOPE & SYSTEM ACCESS</p>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-tight">Does the diagnostic require access to your systems?</h3>
            <p className="text-white/50 text-lg leading-relaxed font-medium mb-10 max-w-3xl">
              Both. The framework operates across two engagement modes — and the depth of diagnostic output scales accordingly.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg">
                  <img src="/assets/scope/interview.png" alt="Interview Mode" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f]">
                  <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">
                    Interview & Document Mode
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    <span className="text-white font-medium">No system credentials required.</span> Diagnostic is conducted through executive interviews, leadership workshops, documentation review, and process mapping sessions.
                  </p>
                  <p className="text-white/30 text-xs font-bold tracking-wide uppercase mt-auto pt-4 border-t border-white/5">Minimum requirement</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg">
                  <img src="/assets/scope/integrated.png" alt="System Integrated Mode" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f]">
                  <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">
                    System-Integrated Mode
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    <span className="text-white font-medium">Optional read-only access</span> to platforms (SAP, Salesforce, Azure, Workday, and others) allows the diagnostic to incorporate live operational data — producing higher-precision scores.
                  </p>
                  <p className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent text-xs font-bold tracking-wide uppercase mt-auto pt-4 border-t border-white/5">Enhanced Mode</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────── DELIVERABLES ─────────────────────── */}
      <section id="deliverables" className="py-32 relative overflow-hidden">
        <div
          ref={delivRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${delivVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">WHAT YOU RECEIVE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
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
                    <Icon className="w-10 h-10 text-[#2564ea]" strokeWidth={1.5} />
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
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">AFTER KANGQORE BIDS™</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              Organizations gain<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">clarity, velocity,</span><br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">and advantage.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
            {[
              { n: '01', text: 'Critical constraints — operational, technological, and strategic — are identified, scored, and ranked by business impact' },
              { n: '02', text: 'Every engagement produces a ranked, scored roadmap — not a list of recommendations' },
              { n: '03', text: 'The Risk Register identifies and quantifies organizational, technology, cybersecurity, and operational risk exposures' },
              { n: '04', text: 'Operational Intelligence findings surface inefficiencies, bottlenecks, and process gaps with measurable business impact' },
              { n: '05', text: 'Technology Maturity and Cloud scores identify consolidation opportunities, cost exposure, and modernization priorities' },
              { n: '06', text: 'AI Readiness is consistently one of the highest-priority findings — and the fastest to address once diagnosed' },
              { n: '07', text: 'The 30/60/90/180-Day Roadmap gives the executive team a sequenced action plan from day one' },
              { n: '08', text: 'The Opportunity Register maps growth, automation, and AI wins with estimated business impact' },
            ].map((item) => (
              <div key={item.n} className="flex items-start gap-5">
                <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">{item.n}</span>
                <p className="text-white text-lg font-semibold leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── REPRESENTATIVE FINDINGS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20 max-w-4xl">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">REPRESENTATIVE DIAGNOSTIC FINDINGS</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
              What the diagnostic<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">typically surfaces.</span>
            </h2>
            <p className="text-white/50 text-lg font-medium leading-relaxed">
              The following examples are representative of diagnostic patterns across engagement types. They are illustrative, not attributable to specific organizations or engagements.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {[
              {
                industry: 'Manufacturing Organization',
                color: '#FB923C',
                findings: [
                  'Fragmented production reporting across three disconnected systems',
                  'Manual quality-control workflows introducing delays and inconsistency',
                  'Limited operational visibility at supervisory and management levels',
                ],
                outcome: 'Improved decision velocity and operational efficiency through workflow modernization and data integration.',
              },
              {
                industry: 'SaaS Organization',
                color: '#22D3EE',
                findings: [
                  'Rising infrastructure costs driven by unoptimized cloud resource allocation',
                  'Underutilized automation opportunities across customer onboarding workflows',
                  'Security governance gaps across third-party integrations and access controls',
                ],
                outcome: 'Improved scalability, cost optimization, and stronger operational resilience.',
              },
              {
                industry: 'Professional Services Firm',
                color: '#A78BFA',
                findings: [
                  'Revenue leakage across lead-to-client conversion workflows',
                  'Inconsistent CRM adoption reducing pipeline visibility and forecasting accuracy',
                  'Limited business intelligence infrastructure for performance tracking',
                ],
                outcome: 'Improved pipeline visibility, conversion efficiency, and forecasting accuracy.',
              },
            ].map(example => (
              <div key={example.industry} className="flex flex-col p-7 border border-white/[0.07] bg-[#06090f] rounded-2xl">
                <div className="mb-6">
                  <div className="w-6 h-0.5 rounded-full mb-5" style={{ backgroundColor: example.color }} />
                  <p className="font-black text-white text-lg mb-1">{example.industry}</p>
                  <p className="text-[9px] font-black tracking-[0.35em] uppercase mb-5" style={{ color: example.color + '80' }}>IDENTIFIED</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {example.findings.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: example.color + '70' }} />
                      <span className="text-white/50 text-sm font-medium leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/[0.06] pt-5">
                  <p className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase mb-2">POTENTIAL OUTCOME</p>
                  <p className="text-white/60 text-sm font-semibold leading-relaxed">{example.outcome}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs font-medium leading-relaxed">
            Illustrative examples only. Not attributable to specific organizations or engagements.
          </p>
        </div>
      </section>

      {/* ─────────────────────── SAMPLE SCORECARD ─────────────────────── */}
      <section id="scorecard" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Section header */}
          <div className="grid lg:grid-cols-2 gap-16 items-end mb-16">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">REPRESENTATIVE OUTPUT</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
                This is what you{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">receive.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                The following is a representative example of a Diagnostic Scorecard — showing how 16 pillars are scored, classified, and benchmarked against sector standards. Final deliverables are formatted to this standard.
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
                  <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase">Representative Diagnostic Scorecard</p>
                  <p className="text-white font-black text-base mt-0.5">Representative Organization <span className="text-white/30 font-semibold text-sm">· Enterprise Edition · Illustrative</span></p>
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
              <p className="text-[9px] font-black tracking-[0.35em] text-white/20 uppercase mb-6">16 DIAGNOSTIC INTELLIGENCE PILLARS</p>
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
                    <span className="text-[11px] text-white/50 font-semibold w-40 flex-shrink-0 truncate">{p.name}</span>
                    <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full ${p.c} rounded-full`} style={{ width: `${p.score}%` }} />
                    </div>
                    <span className="text-[11px] font-black text-white/70 w-7 text-right flex-shrink-0">{p.score}</span>
                    <span className={`text-[8px] font-black tracking-wide uppercase w-14 flex-shrink-0 ${
                      p.s === 'Critical' ? 'text-red-400' :
                      p.s === 'Moderate' ? 'text-amber-400' :
                      p.s === 'Strong'   ? 'text-emerald-400' :
                      'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent'
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
              <p className="text-[9px] text-white/15 font-bold tracking-widest uppercase">Representative Deliverable Preview · Illustrative Only · Not Client Data</p>
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
                    <p className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent text-xs font-bold">{f.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download CTA */}
          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-[#06090f] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-white font-black text-base mb-1">Sample Engagement Scorecard</p>
                <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                  A real-format scorecard from a completed BIDS™ engagement — anonymised, with findings, pillar scores, priorities, and the executive summary structure your leadership team will receive.
                </p>
              </div>
            </div>
            <a
              href="/assets/bids-sample-scorecard.pdf"
              download="BIDS-Sample-Engagement-Scorecard.pdf"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 flex-shrink-0"
            >
              <Download className="w-4 h-4 text-[#2564ea] group-hover:translate-y-0.5 transition-transform duration-300" strokeWidth={2} />
              <span className="text-white font-bold text-sm tracking-wide">Download Sample Scorecard</span>
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────── ENGAGEMENT TRUST ─────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#030303' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 items-start">

            {/* Left: heading */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">ENGAGEMENT INTEGRITY</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.2] tracking-tight text-white mb-4">
                How we access your organization.<br />
                <span className="text-white/30">And how we don't.</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                Enterprise buyers ask the right questions. We answer them upfront — before the engagement begins, not buried in an SOW on page 38.
              </p>
            </div>

            {/* Right: trust grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'No persistent system access',
                  body: 'Our diagnostic protocol is structured-interview and evidence-led. We do not require live API access, system credentials, or ongoing integration hooks to complete an engagement.',
                },
                {
                  title: 'NDA-first, always',
                  body: 'Mutual NDA is executed before any discovery session, document review, or data sharing. Confidentiality is a pre-condition of the engagement, not an afterthought.',
                },
                {
                  title: 'Data handling & retention',
                  body: 'All client data, supporting documentation, and findings artifacts are returned or securely deleted within 30 days of final deliverable sign-off. We retain no client data beyond the engagement scope.',
                },
                {
                  title: 'Proprietary diagnostic framework',
                  body: 'The BIDS™ methodology — how we structure assessments, synthesise findings, and score pillars — is Kangqore\'s proprietary intellectual property. The framework is not disclosed, licensed, or shared with third parties.',
                },
              ].map(item => (
                <div key={item.title} className="rounded-xl border border-white/[0.07] bg-[#06090f] p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="w-4 h-4 text-[#2564ea] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p className="text-white font-bold text-sm">{item.title}</p>
                  </div>
                  <p className="text-white/35 text-sm leading-relaxed pl-7">{item.body}</p>
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
                <p className="text-[10px] font-black tracking-[0.45em] text-white/50 uppercase">INDUSTRY EDITIONS</p>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Deep Domain Expertise<br />
                Across Major{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Industries</span>
                <span className="text-white"> .</span>
              </h2>
            </div>
            <div className="flex lg:items-end lg:pb-3">
              <p className="text-white/50 text-lg font-medium leading-relaxed max-w-lg">
                The framework calibrates diagnostic pillars, scoring benchmarks, and prescription logic to the specific complexity of your industry — not a generic template applied uniformly.
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
                  <span className="text-[10px] font-black tracking-[0.28em] text-white/50 uppercase group-hover:text-white transition-colors duration-300">
                    {e}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-[#2564ea] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
            {/* CTA cell */}
            <div className="border-t border-white/[0.08] py-7 pr-6">
              <Link to="/contact" className="flex items-center justify-between group">
                <span className="text-[10px] font-black tracking-[0.28em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase leading-snug">
                  EXPLORE KANGQORE BIDS™<br />EDITIONS
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2564ea] group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── COMPETITIVE COMPARISON ─────────────────────── */}
      <section id="competitive" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">THE DIFFERENCE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              No platform to push.<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">No outcome pre-engineered.</span>
            </h2>
          </div>

          {/* Two-col */}
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">

            {/* Left — conventional approach */}
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-10">HOW MOST DIAGNOSTICS ACTUALLY WORK</p>
              <div className="space-y-10">
                {[
                  {
                    label: 'The finding follows the product',
                    desc: 'Infosys Cobalt leads to cloud migration. Accenture MyWizard leads to automation contracts. TCS Ignio leads to TCS managed services. The platform is decided before the diagnosis begins — the assessment exists to validate the sale, not surface the truth.',
                  },
                  {
                    label: 'Loss leader, not a real product',
                    desc: 'Big 4 diagnostic engagements are priced low or given free because the real revenue is the $5M–$50M implementation that follows. The diagnostic has no commercial integrity of its own — it is a funnel, not a deliverable.',
                  },
                  {
                    label: 'Siloed by the firm\'s own capability',
                    desc: 'A cloud-native firm diagnoses your cloud maturity. A security firm finds security gaps. A CRM integrator finds CRM gaps. The scope of the diagnostic is bounded by what the firm can sell — not by what the business actually needs.',
                  },
                  {
                    label: 'Slide decks with no accountability',
                    desc: 'Qualitative recommendations. No pillar scores. No benchmarks. No ranked constraint list. No way to measure whether the advice was right or whether anything improved.',
                  },
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
              <p className="text-[10px] font-black tracking-[0.4em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-10">WHY KANGQORE BIDS™ IS STRUCTURALLY DIFFERENT</p>
              <div className="space-y-10">
                {[
                  {
                    n: '01',
                    label: 'Kangqore owns no platform to sell you',
                    desc: 'We are not resellers of AWS, Azure, Salesforce, SAP, or any third-party platform. There is no referral revenue influencing the findings. The diagnostic is designed to surface what is true — not what is profitable for us to recommend.',
                  },
                  {
                    n: '02',
                    label: 'The diagnostic is the product — not the funnel',
                    desc: 'BIDS™ is a priced, scoped, standalone intelligence engagement. The scorecard, risk register, transformation blueprint, and all 10 deliverables are the commercial output — not a pre-sales motion for a larger contract.',
                  },
                  {
                    n: '03',
                    label: 'Scored across every dimension, not just the one we sell',
                    desc: 'Business strategy, operations, AI readiness, cybersecurity, growth, and technology — all 16 pillars assessed with equal rigour. No pillar is skipped because it falls outside our service line.',
                  },
                  {
                    n: '04',
                    label: 'Diagnosis and execution without translation loss',
                    desc: 'Because Kangqore holds execution capability across every pillar — AI, engineering, cloud, security, operations, and growth — the moment diagnosis is complete, implementation can begin. The same team that found it can fix it. No re-scoping, no second firm, no gap between the finding and the fix.',
                  },
                ].map((d) => (
                  <div key={d.n} className="flex items-start gap-8">
                    <span className="text-xs font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">{d.n}</span>
                    <div>
                      <p className="text-white font-bold text-lg mb-2">{d.label}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── ENGAGEMENT MODELS ─────────────────────── */}
      <section id="engagement" className="py-32 relative overflow-hidden border-t border-white/10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">ENGAGEMENT MODELS</p>
            <div className="grid lg:grid-cols-2 gap-16 items-end">
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Choose the right<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">engagement scope.</span>
              </h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed">
                Each model is calibrated to organizational complexity, scope, and strategic objectives. Investment is determined by complexity, scope, geography, and stakeholder requirements.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                name: 'Executive Diagnostic',
                audience: 'Designed for growth-stage organizations and business units.',
                duration: '2–3 Weeks',
                color: '#22D3EE',
                points: ['Core pillar assessment', 'Executive scoping session', 'Diagnostic Scorecard', 'Transformation Blueprint', 'Priority findings presentation'],
              },
              {
                name: 'Enterprise Diagnostic',
                audience: 'Designed for mid-market and multi-department organizations.',
                duration: '4–6 Weeks',
                color: '#A78BFA',
                featured: true,
                points: ['Full 16-pillar assessment', 'All 6 intelligence engines', 'Complete 10 deliverables', 'System-integrated mode available', 'Executive Board Presentation', 'ROI Projection Report'],
              },
              {
                name: 'Strategic Transformation Diagnostic',
                audience: 'Designed for enterprise-scale organizations, regulated industries, and complex operating environments.',
                duration: '6–12 Weeks',
                color: '#FB923C',
                points: ['Extended multi-site assessment', 'Regulatory and compliance depth', 'Multi-stakeholder engagement', 'Full benchmark analysis', 'Executive workshop series', 'Full transformation roadmap'],
              },
            ].map(tier => (
              <div
                key={tier.name}
                className={`flex flex-col p-7 rounded-2xl border ${tier.featured ? 'border-white/20 bg-[#06090f]' : 'border-white/[0.07] bg-[#06090f]'}`}
              >
                <div className="mb-6">
                  <div className="w-6 h-0.5 rounded-full mb-5" style={{ backgroundColor: tier.color }} />
                  <p className="text-white font-black text-xl mb-3 leading-tight">{tier.name}</p>
                  <p className="text-white/50 text-sm font-medium leading-relaxed mb-5">{tier.audience}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: tier.color + '30' }}>
                    <span className="text-xs font-black tracking-wide" style={{ color: tier.color }}>Duration: {tier.duration}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {tier.points.map(pt => (
                    <li key={pt} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: tier.color + '60' }} />
                      <span className="text-white/50 text-sm font-medium leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold group"
                  style={{ color: tier.color + 'cc' }}
                >
                  Request a Scoping Call
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-sm font-medium max-w-2xl leading-relaxed">
            All engagements begin with a complimentary scoping session. Investment is confirmed following scope definition and stakeholder alignment.
          </p>
        </div>
      </section>

      {/* ─────────────────────── SCALE STRIP ─────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[10px] font-black tracking-[0.45em] text-white/25 uppercase mb-12">BUILT ON KANGQORE'S FULL PRACTICE</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-12">
            {[
              { value: '16',   label: 'Diagnostic Pillars' },
              { value: '6',    label: 'Intelligence Engines' },
              { value: '10',   label: 'Executive Deliverables' },
              { value: '10',   label: 'Industry Editions' },
              { value: '61',   label: 'Specialized Services' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">{s.value}</p>
                <p className="text-white/35 text-sm font-semibold tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-white/25 text-sm font-medium max-w-xl leading-relaxed">
            The diagnostic is backed by the full depth of the Kangqore practice — AI, cloud, engineering, security, modernization, and growth — all available for prescription the moment diagnosis is complete.
          </p>
        </div>
      </section>

      {/* ─────────────────────── DATA SECURITY ─────────────────────── */}
      <section className="py-32 relative overflow-hidden border-t border-white/10" style={{ backgroundColor: '#040404' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">DATA HANDLING & TRUST</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                What data does<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Kangqore BIDS™ collect?</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed font-medium mb-8">
                Every engagement operates under a signed Non-Disclosure Agreement before any information is exchanged. Data collected is scoped strictly to what is necessary for the diagnostic — no data is retained beyond the engagement without explicit written consent.
              </p>
              <div className="space-y-4">
                {[
                  { q: 'What is collected?', a: 'Organizational documents, process maps, architecture diagrams, interview transcripts, financial summaries, and system inventories — only what you share.' },
                  { q: 'How is it stored?', a: 'Engagement data is stored in encrypted, access-controlled environments. Client data is logically isolated and never commingled.' },
                  { q: 'Who has access?', a: 'Only the assigned Kangqore engagement team and the client. No third parties. No subcontractors without prior disclosure.' },
                  { q: 'Is it anonymized?', a: 'Benchmark data contributed to the Kangqore Intelligence Database is fully anonymized and aggregated before analysis.' },
                ].map(item => (
                  <div key={item.q} className="border-l-2 border-white/10 pl-5">
                    <p className="text-white/70 text-sm font-black mb-1">{item.q}</p>
                    <p className="text-white/35 text-sm font-medium leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-[0.45em] text-white/30 uppercase mb-6">SECURITY & COMPLIANCE ROADMAP</p>
              {[
                { label: 'NDA Executed',                status: 'Active',      statusColor: '#86EFAC', color: '#22D3EE', desc: 'Every engagement begins with a signed mutual Non-Disclosure Agreement before any information is exchanged.' },
                { label: 'Client Data Isolation',       status: 'Active',      statusColor: '#86EFAC', color: '#22D3EE', desc: 'Engagement data is logically isolated and access-controlled throughout the full assessment lifecycle.' },
                { label: 'Data Minimization Controls',  status: 'Active',      statusColor: '#86EFAC', color: '#60A5FA', desc: 'Only data necessary for the diagnostic scope is requested, processed, and retained.' },
                { label: 'Right to Deletion Policy',    status: 'Active',      statusColor: '#86EFAC', color: '#FDE047', desc: 'Client data is deleted upon engagement close or at any time upon written request.' },
                { label: 'GDPR-Aligned Data Handling',  status: 'Active',      statusColor: '#86EFAC', color: '#F472B6', desc: 'Data handling practices aligned to GDPR principles for EU-resident data subjects.' },
                { label: 'ISO 27001 Alignment',         status: 'In Progress', statusColor: '#FDE047', color: '#A78BFA', desc: 'Security management systems being aligned to ISO/IEC 27001 information security standard.' },
                { label: 'SOC 2 Type II Certification', status: 'Planned',     statusColor: '#FB923C', color: '#A78BFA', desc: 'Independent third-party audit for security, availability, and confidentiality controls.' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 border border-white/[0.07] bg-[#06090f] rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-0.5">
                      <p className="text-sm font-black" style={{ color: item.color }}>{item.label}</p>
                      <span className="text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: item.statusColor, backgroundColor: item.statusColor + '18' }}>{item.status}</span>
                    </div>
                    <p className="text-white/35 text-sm font-medium leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-white/20 text-xs font-medium leading-relaxed pt-2">
                A full Data Processing Agreement (DPA) is available upon request for enterprise engagements requiring formal compliance documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── CTA ─────────────────────── */}
      <section
        ref={ctaRef}
        className={`py-28 md:py-36 lg:py-44 relative overflow-hidden transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8 lg:max-w-[50%]">
              Most transformation programs fail because the enterprise was <span className="bg-brand-gradient bg-clip-text text-transparent">never fully diagnosed.</span>
            </h2>
            <Link
              to="/bids-request"
              className="group inline-flex items-center gap-3 text-xl md:text-2xl font-bold text-white hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors duration-300 self-start lg:self-auto pt-4 lg:pt-6"
            >
              Request a Diagnostic Assessment
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 transform transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
          <div className="max-w-4xl mb-16">
            <p className="text-white/50 text-lg lg:text-xl leading-relaxed">
              Kangqore BIDS™ is the diagnostic intelligence framework built to close that gap. It surfaces hidden constraints across operations, technology, security, and growth systems — quantifies their compounding cost — and delivers a prioritized transformation blueprint before a single investment is committed.
            </p>
          </div>
          {/* Compliance badges — trust footnote */}
          <div className="pt-10 border-t border-white/[0.06]">
            <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.2em] mb-6">Security & Compliance Posture</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
              {[
                { name: 'SOC 2 Aligned',   id: 'soc2' },
                { name: 'ISO 27001',        id: 'iso27001' },
                { name: 'GDPR Ready',       id: 'gdpr' },
                { name: 'DPDP Conscious',   id: 'dpdp' },
                { name: 'HIPAA Aware',      id: 'hipaa' },
                { name: 'PCI DSS Mindful',  id: 'pcidss' },
                { name: 'CMMI Practiced',   id: 'cmmi' },
              ].map(({ name, id }) => (
                <div key={name} className="flex items-center gap-2 opacity-30">
                  <img
                    src={`/assets/badges/${id}.svg?v=2`}
                    alt={name}
                    className="w-5 h-5 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing statement */}
          <div className="mt-28">
            <p className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black leading-[1.25] text-white/50 max-w-3xl">
              The enterprises that diagnose before they invest don't just reduce risk.{' '}
              <span className="text-white">They outgrow everyone who didn't.</span>
            </p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bids-strip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes bids-strip-scroll { 0%, 100% { transform: translateX(0); } }
        }
      ` }} />
    </div>
  );
}
