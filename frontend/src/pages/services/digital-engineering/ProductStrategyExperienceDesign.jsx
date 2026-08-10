import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Zap, Target, Layers, Search, BarChart3,
  LayoutTemplate, MonitorSmartphone, Server, CalendarDays,
  CheckCircle2, Cpu, Radar, ArrowRight, ChevronRight,
  TrendingUp, Activity, Users, ShieldCheck, Workflow,
  Lightbulb, LineChart, Shield, Gauge, Palette,
  Compass, BrainCircuit, Package, Settings, Cloud,
  Briefcase, RefreshCw, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import VisualBackground from '../../../components/VisualBackground';
import SEO from '../../../components/SEO';

gsap.registerPlugin(ScrollTrigger);

// ─── Typewriter badge ─────────────────────────────────────────────────────────
const TypewriterText = ({ text, start = true, delay = 30 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (start && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, start, text]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{text}</span>
      <span className="absolute left-0 top-0 whitespace-nowrap">{currentText}</span>
    </span>
  );
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const capabilities = [
  {
    n: '01', color: '#22D3EE',
    title: 'Product Strategy',
    desc: 'Start with strategy to validate product-market fit, accelerate transformation, and ensure long-term success. We partner to uncover growth opportunities, align products with business goals, and create tailored, user-validated plans.',
    items: ['Uncover expansion opportunities and growth levers', 'Align product-engineering pods with business North Stars', 'Create tailored, user-validated execution roadmaps', 'Strategic prioritization of "Must-Win" product features'],
  },
  {
    n: '02', color: '#60A5FA',
    title: 'Product and UX/UI Design',
    desc: 'User wireframes, user flows, sitemaps, component libraries, and more to design the product experience — crafting the structure, look, and functionality while considering the medium, brand, accessibility, and best practices.',
    items: ['High-fidelity user journeys and sitemap orchestration', 'Unified interaction systems for multi-platform cohesion', 'Inclusive, accessibility-first design architectures', 'Performance-optimized UI components for rapid adoption'],
  },
  {
    n: '03', color: '#A78BFA',
    title: 'Design Systems',
    desc: 'Create a single source of truth to help your team and partners deliver seamless, consistent digital experiences at every touchpoint — patterns, components, guidelines, and core UX and brand elements.',
    items: ['Scalable pattern libraries and tokenized UI governance', 'Reusable component architectures for engineering velocity', 'Brand-aligned style guides and global experience standards', 'Cross-functional documentation for design-build continuity'],
  },
  {
    n: '04', color: '#FB923C',
    title: 'Innovation and Rapid Prototyping',
    desc: 'Refine concepts, reduce risks, and bring market-ready products to users faster. We build realistic, limited-functionality representations of your proposed experience for testing, iteration, socialization, and spec creation.',
    items: ['Realistic, limited-functionality models for early testing', 'Stakeholder socialization and specular concept creation', 'High-velocity iteration loops to reduce build uncertainty', 'Technical de-risking through functional proof-of-concepts'],
  },
  {
    n: '05', color: '#34D399',
    title: 'User and Market Research',
    desc: 'Gather data, then turn it into insights and actionable plans. Using quantitative, qualitative, and algorithmic techniques, we help you understand your market and audience to drive product-market fit, growth, and user satisfaction.',
    items: ['Algorithmic audience profiling and market trend synthesis', 'In-depth usability testing and behavioral signal analysis', 'Competitive benchmarking and category-defining research', 'Clear, data-backed recommendations for product evolution'],
  },
  {
    n: '06', color: '#F472B6',
    title: 'Product Launch and Adoption',
    desc: "Just because you build it doesn't mean users will come. Prepare for a smooth launch and drive adoption by partnering with Kangqore on change management and strategic launch plans that consider your users, culture, and constraints.",
    items: ['Strategic product launch and adoption roadmaps', 'Experience continuity planning across phased rollout', 'Human-centric change management and user-enablement', 'Adoption monitoring and post-launch experience tuning'],
  },
  {
    n: '07', color: '#FDE047',
    title: 'Modern Product Digital Maturity Assessment',
    desc: 'Lower costs, drive innovation, and build thriving teams with our Modern Product Digital Maturity Assessment. We help spot opportunities and enhance execution across product, design, and tech through team assessments and upskilling.',
    items: ['Deep-dive assessment of product, design, and tech stacks', 'Capability gap identification and talent uplift roadmaps', 'Team-level assessment for innovation-readiness', 'Roadmaps to reduce operational drag and improve velocity'],
  },
  {
    n: '08', color: '#E8614A',
    title: 'Strategic Design-to-Build Alignment',
    desc: 'Architect the handoff between design vision and engineering execution to ensure what is designed is what is shipped. We close the gap between strategy and code to ensure no loss in intent during technical implementation.',
    items: ['Collaborative design-engineering pods for continuity', 'Strategy-led technical feasibility assessments', 'Seamless asset handoff and implementation governance', 'Execution confidence through strategy-to-code alignment'],
  },
];

const journeyPhases = [
  { n: '01', phase: 'DISCOVER', color: '#94A3B8', title: 'Understand Ambition', desc: 'Understand business goals, customer needs, market context, and product ambition.' },
  { n: '02', phase: 'FRAME', color: '#60A5FA', title: 'Define Opportunity', desc: 'Define the opportunity, priorities, journeys, solution direction, and experience principles.', kangqore: true },
  { n: '03', phase: 'DESIGN', color: '#2564EA', title: 'Create Systems', desc: 'Create prototypes, UX/UI systems, design language, and reusable patterns for execution.', kangqore: true },
  { n: '04', phase: 'ACTIVATE', color: '#10B981', title: 'Launch & Evolve', desc: 'Prepare for launch, adoption, design-to-engineering continuity, and next-phase evolution.', kangqore: true },
];

const trustPillars = [
  { tag: 'Intelligence', title: 'Data-driven over opinion-led', desc: 'Transform qualitative and quantitative insights into hardened product strategy frameworks.' },
  { tag: 'Consistency', title: 'Flawless across every touchpoint', desc: 'Ensure the user experience remains intuitively perfect across web, mobile, and emerging interfaces.' },
  { tag: 'Architecture', title: 'Built to scale effortlessly', desc: 'Leverage robust design systems that allow component reuse and rapid UI evolution.' },
  { tag: 'Prototyping', title: 'Validation before heavy engineering', desc: 'Test interactive, high-fidelity prototypes to confirm market resonance before writing code.' },
  { tag: 'Strategy', title: 'Aligned with business outcomes', desc: 'Design decisions are tightly coupled with the core metrics that drive your business forward.' },
  { tag: 'Velocity', title: 'Accelerated time-to-value', desc: 'Streamline the gap between concept and launch with optimized design-to-development workflows.' },
];

const whyKangqore = [
  { icon: Layers, title: 'Integrated Strategic Design and Development', desc: 'We connect product thinking, experience design, and delivery planning so decisions stay coherent from concept to execution.' },
  { icon: Users, title: 'Concierge Thinking, Scalable Delivery', desc: 'You get high-touch collaboration with a model designed to support enterprise speed, consistency, and growth.' },
  { icon: TrendingUp, title: 'Organizational Enablement', desc: 'We work with your team, not around it — helping improve product thinking, design maturity, and internal capability through collaboration.' },
];

const industries = [
  { name: 'New Digital Products', desc: 'Define the right opportunity, validate direction, and shape a usable, differentiated first experience.' },
  { name: 'Product Modernization', desc: 'Reimagine outdated product journeys, interface systems, and design logic for modern expectations.' },
  { name: 'Growth-Stage Product Scaling', desc: 'Build reusable design foundations and sharper roadmap decisions as product complexity grows.' },
  { name: 'Enterprise Experience Transformation', desc: 'Improve customer and internal digital experiences through stronger strategy, design governance, and adoption thinking.' },
  { name: 'Innovation Programs', desc: 'Use rapid prototyping and research to test new ideas before full commitment.' },
  { name: 'Platform & Multi-Touchpoint Ecosystems', desc: 'Create consistency across products, channels, and customer interaction layers.' },
];

const technologies = [
  { category: 'Strategy & Research', color: '#22D3EE', items: ['Qualitative & Quantitative Tools', 'Insight Synthesis', 'Market Analysis', 'Opportunity Mapping'] },
  { category: 'Design & Prototyping', color: '#A78BFA', items: ['Figma', 'Sketch', 'Rapid Prototyping', 'Concept Modeling'] },
  { category: 'Systems & Governance', color: '#60A5FA', items: ['Design Systems', 'Component Libraries', 'Standards', 'UI Governance'] },
  { category: 'Launch & Maturity', color: '#34D399', items: ['Launch Planning', 'Adoption Tracking', 'Product Maturity Assessment', 'Execution Review'] },
];

const faqs = [
  { q: 'How are product strategy and experience design connected?', a: 'Product strategy defines what should be built, why it matters, and how it should create value. Experience design turns that direction into journeys, interactions, and product behavior users can actually understand and adopt.' },
  { q: 'What does Kangqore include in this service?', a: 'It can include product strategy, UX/UI design, design systems, rapid prototyping, launch readiness, product maturity assessments, and user and market research.' },
  { q: 'Do you only work on early-stage products?', a: 'No. This service is relevant across new products, growth-stage products, experience redesigns, modernization initiatives, and large-scale enterprise product portfolios.' },
  { q: 'Can you support both strategy and downstream execution?', a: "Yes. Kangqore keeps continuity from design vision through execution-ready delivery planning — strategy, design, and build stay coherent without translation loss." },
  { q: 'What is the role of research in this engagement?', a: 'Research helps validate assumptions, reveal customer needs, understand the market, and improve product decisions with stronger evidence.' },
  { q: 'What is a product digital maturity assessment?', a: 'It is a structured way to evaluate how well your teams execute across product, design, and technology — and where capability or process improvements can unlock better outcomes.' },
  { q: 'How does this help launch and adoption?', a: 'Because designing a product is not enough. Products need launch planning, user understanding, and adoption thinking to succeed in real-world environments.' },
];

const differentiators = [
  { num: 1, title: 'Connect Strategy with Build', text: 'We bridge the gap between design vision and technical execution so decisions stay coherent.' },
  { num: 2, title: 'Validate Earlier', text: 'We use rapid framing and high-fidelity prototyping to reduce uncertainty before heavy investment.' },
  { num: 3, title: 'Scale with Systems', text: 'We build reusable design foundations that improve product consistency, speed, and governance.' },
  { num: 4, title: 'Improve Adoption', text: 'We plan for the human realities that shape how users actually adopt and use digital products.' },
  { num: 5, title: 'Maturity Assessments', text: 'We help identify where teams can improve their product, design, and technology execution.' },
];

const relatedServices = [
  { name: 'Digital Process Automation', link: '/services/digital-process-automation', icon: Compass, desc: 'Automate complex operational workflows via scaled platforms.' },
  { name: 'Product Digital Engineering', link: '/services/digital-engineering/product-digital-engineering', icon: Cpu, desc: 'Enterprise-grade platform development at scale.' },
  { name: 'MVP Acceleration', link: '/services/digital-engineering/mvp-acceleration', icon: Server, desc: 'Rapid velocity engineering and scale-ready launch models.' },
];

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function ProductStrategyExperienceDesign() {
  const [activeFeature, setActiveFeature]   = useState(0);
  const [openFaq, setOpenFaq]               = useState(null);
  const [activeCapability, setActiveCapability] = useState(0);

  // Scroll animation refs
  const [heroRef,     heroVisible]     = useScrollAnimation({ once: true, threshold: 0.1 });
  const [defRef,      defVisible]      = useScrollAnimation({ once: true, threshold: 0.1 });
  const [phaseRef,    phaseVisible]    = useScrollAnimation({ once: true, threshold: 0.05 });
  const [capRef,      capVisible]      = useScrollAnimation({ once: true, threshold: 0.05 });
  const [pillarsRef,  pillarsVisible]  = useScrollAnimation({ once: true, threshold: 0.05 });
  const [whyRef,      whyVisible]      = useScrollAnimation({ once: true, threshold: 0.1 });
  const [indRef,      indVisible]      = useScrollAnimation({ once: true, threshold: 0.1 });
  const [techRef,     techVisible]     = useScrollAnimation({ once: true, threshold: 0.1 });
  const [faqRef,      faqVisible]      = useScrollAnimation({ once: true, threshold: 0.1 });
  const [ctaRef,      ctaVisible]      = useScrollAnimation({ once: true, threshold: 0.2 });

  // GSAP refs
  const diamondRef       = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef       = useRef(null);

  useEffect(() => {
    // Diamond entrance
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true } }
      );
      gsap.to(diamondRef.current, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    // Differentiators stagger
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true } }
      );
    }

    // Journey timeline path animation
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
      });
      const pathEl = journeyRef.current.querySelector('.journey-curve-path');
      if (pathEl) {
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const glowEl = journeyRef.current.querySelector('.journey-curve-glow');
      if (glowEl) {
        const gl = glowEl.getTotalLength();
        gsap.set(glowEl, { strokeDasharray: gl, strokeDashoffset: gl });
        tl.to(glowEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } }
      );
    }

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>
      <SEO
        title="Product Strategy & Experience Design — Reimagine | Kangqore"
        description="Kangqore helps organizations define better products, design stronger user experiences, and turn ideas into execution-ready outcomes. Design what matters. Build what wins."
        keywords="product strategy, UX design, experience design, design systems, rapid prototyping, user research, product launch"
        url="/services/product-strategy-experience-design"
      />

      {/* ─────────────────── HERO ─────────────────── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-36 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          <VisualBackground forceDark={true} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          <div
            ref={heroRef}
            className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                  <TypewriterText text="Design what matters. Build what wins." start={heroVisible} />
                </p>
              </div>

              <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-8 drop-shadow-2xl">
                Product Strategy &{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">Design.</span>
              </h1>

              <p className="text-lg sm:text-xl text-cyan-50/80 font-semibold tracking-normal mb-6">
                Reimagine — Digital Experience Practice
              </p>

              <p className="text-base text-white/50 leading-[1.8] max-w-lg mb-14 font-medium">
                Kangqore helps organizations define better products, design stronger user experiences, and turn ideas into execution-ready outcomes.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">Talk To Our Experts</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <a
                  href="#capabilities"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore Capabilities
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Hero stats strip — mobile */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-4">
              {[
                { value: 'Define', label: 'Stronger product direction' },
                { value: 'Design', label: 'Smarter user journeys' },
                { value: 'Accelerate', label: 'Concept-to-launch speed' },
                { value: 'Scale', label: 'System adoption & maturity' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-black text-white drop-shadow-lg">{s.value}</p>
                  <p className="text-[11px] text-cyan-400/80 font-bold tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────── CHALLENGE BRIDGE ─────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={defRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-14">
            <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHAT IS PRODUCT STRATEGY & DESIGN</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl">
              The complete design{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">intelligence</span>{' '}
              framework.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-20">
            <div>
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-10 font-light max-w-xl">
                Kangqore combines strategic product thinking with execution realism. We help organizations move from customer understanding to product clarity to design systems and launch-ready direction — without breaking continuity between strategy, design, and build.
              </p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-14">
                A product can be engineered well and still fail if the strategy and experience are weak.{' '}
                <span className="text-white">Kangqore closes that gap.</span>
              </p>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/[0.08]">
                {[
                  { value: '8', label: 'Capability\nAreas' },
                  { value: '4', label: 'Engagement\nPhases' },
                  { value: '6', label: 'Industry\nContexts' },
                  { value: '4', label: 'Tool\nCategories' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</p>
                    <p className="text-white/50 text-[11px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — challenge/solution cards */}
            <div className="space-y-4">
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <p className="text-[11px] font-black tracking-[0.4em] text-amber-400/70 uppercase mb-4">THE CHALLENGE</p>
                <p className="text-white font-semibold text-lg leading-snug">
                  A product can be engineered well and still fail if the strategy and experience are weak.
                </p>
              </div>
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <p className="text-[11px] font-black tracking-[0.4em] text-cyan-400/70 uppercase mb-4">THE SOLUTION</p>
                <p className="text-white font-semibold text-lg leading-snug">
                  Kangqore helps businesses connect business intent, user needs, and execution realities — so product teams make better choices earlier and build with greater confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Brand footer bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#06090f] border border-white/[0.08] rounded-2xl mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">Product Strategy & Design</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <span className="text-white/50 text-sm font-medium">Reimagine — Digital Experience Practice</span>
            </div>
            <a
              href="#capabilities"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200 flex-shrink-0"
            >
              View All Capabilities
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Pull quote */}
          <div className="border-l-2 border-white/10 pl-8">
            <p className="text-xl sm:text-2xl font-black text-white/50 leading-snug max-w-4xl">
              "Design What Matters. Build What Wins."
            </p>
            <p className="text-lg font-black text-white mt-3">
              We unify business intent, user needs, and execution realities so you can build with greater confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────── BADGE STRIP ─────────────────── */}
      <div className="border-t border-b border-white/[0.05] py-10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[11px] font-black tracking-[0.45em] text-white/50 uppercase mb-7 text-center">DESIGN APPROACH PRINCIPLES</p>
          <div className="flex flex-nowrap items-center justify-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {['Strategy-Led Design', 'Research-Informed Decisions', 'Validated Prototyping', 'Scalable Design Systems', 'Accessibility-First Architecture', 'Design-to-Build Continuity', 'Adoption-Centered Launch Planning'].map((f, i, arr) => (
              <React.Fragment key={f}>
                <span className="flex-shrink-0 text-white/50 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap">{f}</span>
                {i < arr.length - 1 && <span className="flex-shrink-0 mx-4 text-white/10 text-xs select-none">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────── PHILOSOPHY / FEATURES ─────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-20">
            <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PHILOSOPHY</p>
            <div className="grid lg:grid-cols-2 gap-16 items-end">
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Design What Matters.<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Build What Wins.</span>
              </h2>
              <p className="text-white/50 text-base font-medium leading-relaxed lg:pb-2">
                We unify business intent, user needs, and execution realities so you can build with greater confidence. Strategy, design, and build stay coherent without translation loss.
              </p>
            </div>
          </div>

          {/* Feature accordion */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-2.5">
              {[
                { title: 'Strategy', label: 'Product Strategy', icon: Target, content: 'Define where the product should go, why it matters, and how it should create value through strategic prioritization.' },
                { title: 'Design', label: 'Product & UX/UI Design', icon: Palette, content: 'Shape experiences that are intuitive, usable, and accessible, aligned perfectly with your brand and business goals.' },
                { title: 'Prototyping', label: 'Innovation & Rapid Prototyping', icon: Zap, content: 'Bring ideas to life quickly so teams can test, refine, and align on direction before committing to full build.' },
                { title: 'Systems', label: 'Design Systems', icon: Layers, content: 'Create a scalable experience foundation that improves consistency, speed, and governance across all touchpoints.' },
              ].map((f, i) => {
                const isOpen = activeFeature === i;
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    onClick={() => setActiveFeature(isOpen ? -1 : i)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${isOpen ? 'border-white/[0.14] bg-[#06090f]' : 'border-white/[0.07] bg-[#06090f]'}`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-4">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isOpen ? 'text-cyan-400' : 'text-white/50'}`} />
                        <p className={`font-black text-base leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55'}`}>{f.title}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && (
                      <div className="pl-8 pt-1">
                        <p className="text-[11px] font-black tracking-[0.3em] text-cyan-400/70 uppercase mb-2">{f.label}</p>
                        <p className="text-white/55 text-sm font-medium leading-relaxed">{f.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right — sticky active feature detail */}
            <div className="lg:sticky lg:top-8">
              <div className="p-8 rounded-2xl border border-white/[0.07] bg-[#06090f]">
                <p className="text-[11px] font-black tracking-[0.4em] text-white/50 uppercase mb-6">DESIGN INTELLIGENCE PROFILE</p>
                <p className="text-[11px] font-black tracking-widest uppercase mb-2 text-cyan-400">
                  {['Product Strategy', 'Product & UX/UI Design', 'Innovation & Rapid Prototyping', 'Design Systems'][activeFeature] || 'Select a Feature'}
                </p>
                <p className="text-white font-black text-2xl leading-tight mb-5">
                  {['Strategy', 'Design', 'Prototyping', 'Systems'][activeFeature] || '—'}
                </p>
                <p className="text-white/50 text-sm font-medium leading-relaxed mb-6">
                  {[
                    'Define where the product should go, why it matters, and how it should create value through strategic prioritization.',
                    'Shape experiences that are intuitive, usable, and accessible, aligned perfectly with your brand and business goals.',
                    'Bring ideas to life quickly so teams can test, refine, and align on direction before committing to full build.',
                    'Create a scalable experience foundation that improves consistency, speed, and governance across all touchpoints.',
                  ][activeFeature] || 'Select a feature to explore its role in the product design framework.'}
                </p>
                <div className="p-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04]">
                  <p className="text-sm font-semibold leading-snug text-cyan-400">
                    {['Aligning product vision with enterprise growth levers.', 'Designing experiences that naturally convert.', 'Testing market-readiness before heavy build investment.', 'Scaling foundations for global digital consistency.'][activeFeature] || 'Strategy, Design, Prototyping, and Systems — four layers of the same vision.'}
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200">
                    Talk To Our Experts
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── MID-FUNNEL BRIDGE ─────────────────── */}
      <div className="py-14 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 rounded-2xl border border-white/[0.07] bg-[#06090f]">
            <div>
              <p className="text-[11px] font-black tracking-[0.4em] text-cyan-400/70 uppercase mb-3">READY TO EXPLORE A DESIGN ENGAGEMENT?</p>
              <p className="text-white font-black text-xl leading-snug mb-2">Start with a 30-minute discovery call.</p>
              <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xl">
                Walk through the Kangqore Product Strategy & Design approach with a senior specialist. No commitment — a clear picture of how the engagement works and whether it fits your current priorities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-cyan-400/30 text-cyan-400 font-black text-sm tracking-wide hover:bg-cyan-400/10 transition-colors duration-200"
              >
                Book a Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/[0.08] text-white/50 font-black text-sm tracking-wide hover:text-white/60 hover:border-white/[0.15] transition-all duration-200"
              >
                See Our Capabilities
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────── 4 ENGAGEMENT PHASES ─────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={phaseRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${phaseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE PROCESS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                From Ambition to<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Market Ready.</span>
              </h2>
            </div>
            <div className="lg:pb-3">
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-8">
                A connected system for moving from customer understanding to product clarity to design systems and launch-ready direction.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-white font-black text-sm tracking-wide">Request a Scoping Session</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 lg:gap-x-24">
            {journeyPhases.map((step) => (
              <div key={step.n} className="flex gap-6 py-8 border-t border-white/[0.06]">
                <span className="text-[11px] font-black tracking-widest mt-1 flex-shrink-0 w-6" style={{ color: step.color }}>{step.n}</span>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-white font-black text-base leading-tight">{step.phase}</p>
                    {step.kangqore && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                        <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase">Kangqore</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white font-semibold text-sm mb-2" style={{ color: step.color }}>{step.title}</p>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── BRAND EQUITY / INSIGHT QUOTE ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Large quote */}
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center mb-24">
            <div className="relative rounded-[3rem] overflow-hidden aspect-square bg-[#06090f] border border-white/[0.08]">
              <img
                src="/images/happy_team.png"
                alt="Happy Startup Team"
                className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700"
              />
            </div>
            <div>
              <div className="text-7xl font-serif text-white/[0.05] leading-none select-none mb-2">"</div>
              <p className="text-3xl md:text-4xl lg:text-[2.75rem] font-light text-white leading-[1.3] -mt-12">
                Helping global brands across industries orchestrate exceptional UX and architect design systems that drive{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent italic font-normal">limitless growth.</span>
              </p>
            </div>
          </div>

          {/* Brand equity insight */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">THE STRATEGIC IMPERATIVE</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                A fragmented user experience directly erodes{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">brand equity.</span>
              </h2>
              <p className="text-white/60 text-lg font-light leading-relaxed mb-8 max-w-xl">
                A flawless UI/UX is not just visual polish. It is a strategic revenue multiplier. Kangqore helps global organizations unify their digital presence and create experiences that naturally convert.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <p className="text-[11px] font-black tracking-[0.4em] text-brand-blue uppercase mb-3">THE FOUNDATION</p>
                <p className="text-white/60 text-base font-light leading-relaxed italic">
                  "An Enterprise Design Architecture prevents scaling debt and ensures that new feature development takes days, not months."
                </p>
              </div>
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <p className="text-[11px] font-black tracking-[0.4em] text-emerald-400 uppercase mb-3">THE STRATEGY</p>
                <p className="text-white/60 text-base font-light leading-relaxed italic">
                  "When algorithmic user intelligence is merged with high-fidelity design, customer adoption accelerates exponentially."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 8 CAPABILITIES ─────────────────── */}
      <section id="capabilities" className="py-32 relative" style={{ backgroundColor: '#000000' }}>
        <div
          ref={capRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">THE FRAMEWORK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              8 Design Capability{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Areas</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 lg:gap-24 lg:h-[700px]">
            {/* Left — scrollable list */}
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {capabilities.map((c, i) => {
                const active = activeCapability === i;
                return (
                  <div key={c.n} className="border-b border-white/[0.06]">
                    <div
                      onMouseEnter={() => setActiveCapability(i)}
                      onClick={() => setActiveCapability(active ? -1 : i)}
                      className="group flex items-center justify-between gap-5 py-5 cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <span className={`w-2.5 h-2.5 flex-shrink-0 transition-colors duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent'}`} />
                        <span className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/50 group-hover:text-white/55'}`}>
                          {c.title}
                        </span>
                      </div>
                      <ChevronRight className={`lg:hidden w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${active ? 'rotate-90' : ''}`} />
                    </div>
                    {/* Mobile tap-to-expand */}
                    {active && (
                      <div className="lg:hidden pb-6 pl-7 pr-2">
                        <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-3">CAPABILITY {c.n}</p>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">{c.desc}</p>
                        <ul className="space-y-1.5">
                          {c.items.map(item => (
                            <li key={item} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.color }} />
                              <span className="text-white/50 text-xs font-medium leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right — floats in place */}
            <div className="hidden lg:flex items-start pt-5">
              <div className="w-full sticky top-8">
                <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-6">
                  CAPABILITY {capabilities[activeCapability >= 0 ? activeCapability : 0].n}
                </p>
                <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                  {capabilities[activeCapability >= 0 ? activeCapability : 0].title}
                </h3>
                <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">
                  {capabilities[activeCapability >= 0 ? activeCapability : 0].desc}
                </p>
                <ul className="space-y-3">
                  {capabilities[activeCapability >= 0 ? activeCapability : 0].items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: capabilities[activeCapability >= 0 ? activeCapability : 0].color }} />
                      <span className="text-white/55 text-sm font-medium leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── ENTERPRISE DESIGN COE ─────────────────── */}
      <section className="py-24 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
            <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">ENTERPRISE DESIGN COE</p>
              <p className="text-white/60 text-lg leading-relaxed font-light mb-5">
                Our <strong className="text-white">Enterprise Design CoE</strong> provides a high-velocity strategic blueprint, surrounding your product idea with four critical layers of UX validation.
              </p>
              <p className="text-white/50 text-base leading-relaxed font-light">
                We replace "build-and-hope" with "validate-and-architect." By unifying lean discovery, high-fidelity mockups, strategic research, and scalable design architectures, we ensure your product UX is built on a foundation of absolute confidence.
              </p>
            </div>

            {/* Diamond visual */}
            <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
              <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
                <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                  <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                    <defs>
                      <linearGradient id="mvp-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2564ea" />
                        <stop offset="100%" stopColor="#4ab6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="300" cy="40" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                    <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                    <circle cx="40" cy="300" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                    <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                    <circle cx="300" cy="560" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                    <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                    <circle cx="560" cy="300" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                    <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                  </svg>
                  <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                    <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite' }}>
                      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}>
                          <div className="-rotate-45 text-center text-white font-bold text-[16px]">Lean<br />Discovery</div>
                        </div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}>
                          <div className="-rotate-45 text-center text-white font-bold text-[16px]">Strategic<br />Roadmap</div>
                        </div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}>
                          <div className="-rotate-45 text-center text-white font-bold text-[16px]">Flawless<br />UI/UX</div>
                        </div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}>
                          <div className="-rotate-45 text-center text-white font-bold text-[16px]">Architected<br />Scalability</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-right">
                      <li>Ethnographic research •</li>
                      <li>Competitive teardowns •</li>
                      <li>Behavior tracking •</li>
                      <li>User intent mapping •</li>
                    </ul>
                  </div>
                  <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-left">
                      <li>• MVP feature slicing</li>
                      <li>• Workflow logic trees</li>
                      <li>• ROI metric definitions</li>
                      <li>• Go-to-market orchestration</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-right">
                      <li>Transcendental interfaces •</li>
                      <li>Zero-friction interactions •</li>
                      <li>Micro-animation logic •</li>
                      <li>Deep brand embedding •</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-left">
                      <li>• React/Figma single truth</li>
                      <li>• Centralized token governance</li>
                      <li>• Multi-platform logic paths</li>
                      <li>• Agile developer handoff</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mobile CoE cards */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {[
                  { title: 'Lean Discovery', items: ['UX Research', 'Behavioral mapping'], gradient: 'from-blue-600 to-blue-800' },
                  { title: 'Strategic Roadmap', items: ['Feature slicing', 'ROI metrics'], gradient: 'from-blue-400 to-blue-600' },
                  { title: 'Flawless UI/UX', items: ['Pixel perfection', 'Interactive models'], gradient: 'from-blue-900 to-slate-900' },
                  { title: 'Architected Scalability', items: ['Token governance', 'Zero-friction handoff'], gradient: 'from-cyan-500 to-cyan-700' },
                ].map((q, idx) => (
                  <div key={idx} className="bg-[#06090f] border border-white/[0.08] rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                    <div className="p-4"><ul className="space-y-1 text-xs text-white/50">{q.items.map((item, k) => <li key={k}>• {item}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Differentiators */}
          <div ref={differentiatorRef} className="max-w-5xl mx-auto">
            <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHY THIS APPROACH</p>
            <div className="space-y-3">
              {differentiators.map((d) => (
                <div key={d.num} className="diff-item group flex items-start gap-5 p-6 bg-[#06090f] rounded-2xl border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl" />
                  <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:bg-brand-blue/20 group-hover:border-brand-blue/40 transition-colors">{d.num}</div>
                  <div>
                    <h4 className="font-black text-lg text-white mb-1 group-hover:text-cyan-400 transition-colors">{d.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── JOURNEY TIMELINE ─────────────────── */}
      <section className="py-32 overflow-hidden relative border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

            {/* LEFT — Animated SVG + vertical phase cards */}
            <div className="w-full lg:w-[55%] relative">
              <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px]" style={{ zIndex: 1 }}>
                <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="journey-glow-v">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
                  <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#journey-glow-v)" opacity="0.4" />
                  <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[125, 375, 625, 875].map((cy, i) => (
                    <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#journey-grad-v)" strokeWidth="0.8" opacity="0.2">
                        <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx="15" cy={cy} r="7" fill="#06090f" stroke="url(#journey-grad-v)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#journey-grad-v)" opacity="0.7">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                      </circle>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="space-y-6 lg:pl-[55px]">
                {journeyPhases.map((item, idx) => {
                  const gradients = ['from-slate-600 to-slate-800', 'from-blue-500 to-blue-700', 'from-brand-blue to-indigo-600', 'from-emerald-500 to-emerald-700'];
                  const icons = [Search, Target, Palette, Rocket];
                  const Icon = icons[idx];
                  return (
                    <div key={idx} className="journey-card group">
                      <div className="relative bg-[#06090f] border border-white/[0.08] rounded-3xl p-6 lg:p-8 hover:border-white/[0.18] transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradients[idx]} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`} />
                        <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${gradients[idx]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/20 uppercase">{item.phase}</div>
                            {item.kangqore && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                                <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse" />
                                <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase">Kangqore</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300">{item.title}</h4>
                          <p className="text-sm text-white/50 font-light leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — heading + orbital graphic + stats */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                    <Rocket className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Design-to-Build Journey</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                    From Ambition to <br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent">Market Ready.</span>
                  </h2>
                  <p className="text-white/50 text-lg font-light leading-relaxed max-w-lg">
                    A connected system for moving from customer understanding to product clarity to design systems and launch-ready direction.
                  </p>
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                  <div>
                    <div className="font-mono text-[11px] text-white/20 tracking-widest uppercase font-bold mb-2">Phases</div>
                    <div className="text-2xl font-black text-white">04</div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-white/20 tracking-widest uppercase font-bold mb-2">Timeline</div>
                    <div className="text-2xl font-black text-white">4-12<span className="text-sm text-white/50 ml-1">wks</span></div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-white/20 tracking-widest uppercase font-bold mb-2">Confidence</div>
                    <div className="text-2xl font-black bg-brand-gradient bg-clip-text text-transparent">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── TRUST PILLARS ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={pillarsRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">HOW WE WORK</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              6 Design{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Intelligence Pillars</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPillars.map((p, i) => {
              const colors = ['#22D3EE', '#60A5FA', '#A78BFA', '#FB923C', '#34D399', '#F472B6'];
              const color = colors[i];
              return (
                <div key={p.tag} className="p-6 border border-white/[0.07] bg-[#06090f] rounded-xl flex flex-col gap-4">
                  <div>
                    <span className="text-[11px] font-black tracking-widest" style={{ color: color + '60' }}>0{i + 1}</span>
                    <div className="w-5 h-0.5 rounded-full mt-2" style={{ backgroundColor: color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black tracking-[0.3em] uppercase mb-2" style={{ color }}>{p.tag}</p>
                    <p className="text-white/80 text-base font-black leading-snug">{p.title}</p>
                  </div>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────── WHY KANGQORE ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={whyRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-5">WHY KANGQORE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              Built for organizations<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">preparing for significant change.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whyKangqore.map((item, i) => {
              const Icon = item.icon;
              const colors = ['#22D3EE', '#60A5FA', '#34D399'];
              return (
                <div key={item.title} className="group p-8 border border-white/[0.07] bg-[#06090f] rounded-2xl hover:border-white/[0.18] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl border mb-6 flex items-center justify-center" style={{ borderColor: colors[i] + '30', backgroundColor: colors[i] + '0a' }}>
                    <Icon className="w-5 h-5" style={{ color: colors[i] }} />
                  </div>
                  <h3 className="text-white font-black text-lg leading-snug mb-4">{item.title}</h3>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Who this is for */}
          <div className="mt-20 grid lg:grid-cols-2 gap-20 items-start pt-16 border-t border-white/[0.05]">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHERE EXPERIENCE STRATEGY ADDS MOST VALUE</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                Relevant across new products,<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">redesigns, and large portfolios.</span>
              </h3>
              <p className="text-white/50 text-base font-medium leading-relaxed">Typical engagements include:</p>
            </div>
            <div>
              <div className="space-y-0">
                {industries.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-start gap-4 py-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-white font-semibold text-base leading-snug">{item.name}</p>
                        <p className="text-white/50 text-sm font-light mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    {i < industries.length - 1 && <div className="w-px h-2 ml-[2.75px] bg-white/[0.04]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={faqRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">FREQUENTLY ASKED QUESTIONS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Common questions<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">answered.</span>
              </h2>
            </div>
            <div className="lg:pb-3">
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-8">
                Still have questions? Our specialists are available for a no-obligation discovery call.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-white font-black text-sm tracking-wide">Book a Discovery Call</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-t border-white/[0.06]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-8 py-7 text-left group"
                  >
                    <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-white/20 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-7 pr-12 pl-0">
                      <p className="text-white/50 text-base font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>
        </div>
      </section>

      {/* ─────────────────── RELATED ENGINEERING EXPERTISE ─────────────────── */}
      <section className="py-24 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">EXTEND YOUR STRATEGY</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                Related Engineering{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Expertise.</span>
              </h2>
              <p className="text-white/50 text-base font-medium leading-relaxed max-w-xl">
                Extend your design strategy into a full-scale product. Kangqore provides the end-to-end engineering muscle to build what you've architected.
              </p>
            </div>
            <div className="space-y-4">
              {relatedServices.map((e) => {
                const Icon = e.icon;
                return (
                  <Link key={e.name} to={e.link} className="group flex items-start gap-5 p-6 bg-[#06090f] border border-white/[0.07] rounded-2xl hover:border-white/[0.18] transition-all">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400/10 transition-all flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-black text-lg text-white block mb-1 group-hover:text-cyan-400 transition-colors">{e.name}</span>
                      <p className="text-white/50 text-sm">{e.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0 ml-auto" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={ctaRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="p-10 lg:p-16 rounded-3xl border border-white/[0.08] bg-[#06090f] relative overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-brand-blue/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">READY TO GET STARTED?</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 max-w-3xl mx-auto">
                Ready to define a sharper product and a{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">stronger experience?</span>
              </h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                Let's shape the right product strategy, design the right experience, and create the execution-ready foundation needed to move faster with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300"
                >
                  Talk To Our Experts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore Capabilities
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .stat-counter-text { font-variant-numeric: tabular-nums; }
      `}} />
    </div>
  );
}
