// Standalone BIDS-style render for /services/product-strategy-experience-design
// Injected as heroSection into ServicePageTemplate — all other template sections
// are zeroed out so only this component renders. Uses gsap.context() scoped to
// sectionRef for safe cleanup during navigation.

import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Zap, Target, Layers, Search, Palette,
  Cpu, Radar, ArrowRight, ChevronRight,
  TrendingUp, Users, Compass, BrainCircuit,
  CheckCircle2, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import ConciergeSection from '../../concierge/ConciergeSection';
import PSEDRuler from './PSEDRuler';

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
  { n: '01', color: '#22D3EE', title: 'Product Strategy', desc: 'Start with strategy to validate product-market fit, accelerate transformation, and ensure long-term success. We partner to uncover growth opportunities, align products with business goals, and create tailored, user-validated plans.', items: ['Uncover expansion opportunities and growth levers', 'Align product-engineering pods with business North Stars', 'Create tailored, user-validated execution roadmaps', "Strategic prioritization of 'Must-Win' product features"] },
  { n: '02', color: '#60A5FA', title: 'Product and UX/UI Design', desc: 'User wireframes, user flows, sitemaps, component libraries, and more to design the product experience — crafting the structure, look, and functionality while considering the medium, brand, accessibility, and best practices.', items: ['High-fidelity user journeys and sitemap orchestration', 'Unified interaction systems for multi-platform cohesion', 'Inclusive, accessibility-first design architectures', 'Performance-optimized UI components for rapid adoption'] },
  { n: '03', color: '#A78BFA', title: 'Design Systems', desc: 'Create a single source of truth to help your team and partners deliver seamless, consistent digital experiences at every touchpoint — patterns, components, guidelines, and core UX and brand elements.', items: ['Scalable pattern libraries and tokenized UI governance', 'Reusable component architectures for engineering velocity', 'Brand-aligned style guides and global experience standards', 'Cross-functional documentation for design-build continuity'] },
  { n: '04', color: '#FB923C', title: 'Innovation and Rapid Prototyping', desc: 'Refine concepts, reduce risks, and bring market-ready products to users faster. We build realistic, limited-functionality representations of your proposed experience for testing, iteration, socialization, and spec creation.', items: ['Realistic, limited-functionality models for early testing', 'Stakeholder socialization and specular concept creation', 'High-velocity iteration loops to reduce build uncertainty', 'Technical de-risking through functional proof-of-concepts'] },
  { n: '05', color: '#34D399', title: 'User and Market Research', desc: 'Gather data, then turn it into insights and actionable plans. Using quantitative, qualitative, and algorithmic techniques, we help you understand your market and audience to drive product-market fit, growth, and user satisfaction.', items: ['Algorithmic audience profiling and market trend synthesis', 'In-depth usability testing and behavioral signal analysis', 'Competitive benchmarking and category-defining research', 'Clear, data-backed recommendations for product evolution'] },
  { n: '06', color: '#F472B6', title: 'Product Launch and Adoption', desc: "Just because you build it doesn't mean users will come. Prepare for a smooth launch and drive adoption by partnering with Kangqore on change management and strategic launch plans that consider your users, culture, and constraints.", items: ['Strategic product launch and adoption roadmaps', 'Experience continuity planning across phased rollout', 'Human-centric change management and user-enablement', 'Adoption monitoring and post-launch experience tuning'] },
  { n: '07', color: '#FDE047', title: 'Modern Product Digital Maturity Assessment', desc: 'Lower costs, drive innovation, and build thriving teams with our Modern Product Digital Maturity Assessment. We help spot opportunities and enhance execution across product, design, and tech through team assessments and upskilling.', items: ['Deep-dive assessment of product, design, and tech stacks', 'Capability gap identification and talent uplift roadmaps', 'Team-level assessment for innovation-readiness', 'Roadmaps to reduce operational drag and improve velocity'] },
  { n: '08', color: '#E8614A', title: 'Strategic Design-to-Build Alignment', desc: 'Architect the handoff between design vision and engineering execution to ensure what is designed is what is shipped. We close the gap between strategy and code to ensure no loss in intent during technical implementation.', items: ['Collaborative design-engineering pods for continuity', 'Strategy-led technical feasibility assessments', 'Seamless asset handoff and implementation governance', 'Execution confidence through strategy-to-code alignment'] },
];

const journeyPhases = [
  { n: '01', phase: 'DISCOVER', color: '#94A3B8', title: 'Understand Ambition', desc: 'Understand business goals, customer needs, market context, and product ambition.', Icon: Search },
  { n: '02', phase: 'FRAME', color: '#60A5FA', title: 'Define Opportunity', desc: 'Define the opportunity, priorities, journeys, solution direction, and experience principles.', kangqore: true, Icon: Target },
  { n: '03', phase: 'DESIGN', color: '#2564EA', title: 'Create Systems', desc: 'Create prototypes, UX/UI systems, design language, and reusable patterns for execution.', kangqore: true, Icon: Palette },
  { n: '04', phase: 'ACTIVATE', color: '#10B981', title: 'Launch & Evolve', desc: 'Prepare for launch, adoption, design-to-engineering continuity, and next-phase evolution.', kangqore: true, Icon: Rocket },
];

const trustPillars = [
  { tag: 'Intelligence', color: '#22D3EE', image: '/images/psed/pillar-intelligence.svg', title: 'Data-driven over opinion-led', desc: 'Transform qualitative and quantitative insights into hardened product strategy frameworks.' },
  { tag: 'Consistency', color: '#60A5FA', image: '/images/psed/pillar-consistency.svg', title: 'Flawless across every touchpoint', desc: 'Ensure the user experience remains intuitively perfect across web, mobile, and emerging interfaces.' },
  { tag: 'Architecture', color: '#A78BFA', image: '/images/psed/pillar-architecture.svg', title: 'Built to scale effortlessly', desc: 'Leverage robust design systems that allow component reuse and rapid UI evolution.' },
  { tag: 'Prototyping', color: '#FB923C', image: '/images/psed/pillar-prototyping.svg', title: 'Validation before heavy engineering', desc: 'Test interactive, high-fidelity prototypes to confirm market resonance before writing code.' },
  { tag: 'Strategy', color: '#34D399', image: '/images/psed/pillar-strategy.svg', title: 'Aligned with business outcomes', desc: 'Design decisions are tightly coupled with the core metrics that drive your business forward.' },
  { tag: 'Velocity', color: '#F472B6', image: '/images/psed/pillar-velocity.svg', title: 'Accelerated time-to-value', desc: 'Streamline the gap between concept and launch with optimized design-to-development workflows.' },
];

const whyKangqore = [
  { Icon: Layers, color: '#22D3EE', image: '/images/psed/why-integrated.svg', title: 'Integrated Strategic Design and Development', desc: 'We connect product thinking, experience design, and delivery planning so decisions stay coherent from concept to execution.' },
  { Icon: Users, color: '#60A5FA', image: '/images/psed/why-concierge.svg', title: 'Concierge Thinking, Scalable Delivery', desc: 'You get high-touch collaboration with a model designed to support enterprise speed, consistency, and growth.' },
  { Icon: TrendingUp, color: '#34D399', image: '/images/psed/why-enablement.svg', title: 'Organizational Enablement', desc: 'We work with your team, not around it — helping improve product thinking, design maturity, and internal capability through collaboration.' },
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
  { q: 'Can you support both strategy and downstream execution?', a: 'Yes. Kangqore keeps continuity from design vision through execution-ready delivery planning — strategy, design, and build stay coherent without translation loss.' },
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

const HERO_CAPS = [
  { label: 'Product Strategy',          color: '#22D3EE', icon: Target },
  { label: 'UX / UI Design',            color: '#60A5FA', icon: Palette },
  { label: 'Design Systems',            color: '#A78BFA', icon: Layers },
  { label: 'Rapid Prototyping',         color: '#FB923C', icon: Zap },
  { label: 'User & Market Research',    color: '#34D399', icon: Search },
  { label: 'Launch & Adoption',         color: '#F472B6', icon: Rocket },
  { label: 'Maturity Assessment',       color: '#FDE047', icon: Radar },
  { label: 'Design-to-Build Alignment', color: '#E8614A', icon: Cpu },
];
const HERO_STRIP = [...HERO_CAPS, ...HERO_CAPS, ...HERO_CAPS];

const relatedServices = [
  { name: 'Digital Process Automation', link: '/services/digital-process-automation', Icon: Compass, desc: 'Automate complex operational workflows via scaled platforms.' },
  { name: 'Product Digital Engineering', link: '/services/product-digital-engineering', Icon: Cpu, desc: 'Enterprise-grade platform development at scale.' },
  { name: 'MVP Acceleration', link: '/services/mvp-acceleration', Icon: Rocket, desc: 'Rapid velocity engineering and scale-ready launch models.' },
];

const phaseGradients = ['from-slate-600 to-slate-800', 'from-blue-500 to-blue-700', 'from-brand-blue to-indigo-600', 'from-emerald-500 to-emerald-700'];

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ProductStrategyBIDSPage() {
  const [activeFeature, setActiveFeature]     = useState(0);
  const [openFaq, setOpenFaq]                 = useState(null);
  const [activeCapability, setActiveCapability] = useState(0);

  const [defRef,     defVisible]     = useScrollAnimation({ once: true, threshold: 0.1 });
  const [phaseRef,   phaseVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [capRef,     capVisible]     = useScrollAnimation({ once: true, threshold: 0.05 });
  const [pillarsRef, pillarsVisible] = useScrollAnimation({ once: true, threshold: 0.05 });
  const [whyRef,     whyVisible]     = useScrollAnimation({ once: true, threshold: 0.1 });
  const [techRef,    techVisible]    = useScrollAnimation({ once: true, threshold: 0.1 });
  const [faqRef,     faqVisible]     = useScrollAnimation({ once: true, threshold: 0.1 });
  const [ctaRef,     ctaVisible]     = useScrollAnimation({ once: true, threshold: 0.2 });

  const sectionRef       = useRef(null);
  const diamondRef       = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef       = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (diamondRef.current) {
        gsap.fromTo(diamondRef.current,
          { opacity: 0, scale: 0.8, y: 60 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true } }
        );
        gsap.to(diamondRef.current, {
          y: -30, ease: 'none',
          scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
      if (differentiatorRef.current) {
        const items = differentiatorRef.current.querySelectorAll('.diff-item');
        gsap.fromTo(items,
          { opacity: 0, y: 30, x: -20 },
          { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true } }
        );
      }
      if (journeyRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
        });
        const pathEl = journeyRef.current.querySelector('.psed-journey-path');
        if (pathEl) {
          const len = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
        }
        const glowEl = journeyRef.current.querySelector('.psed-journey-glow');
        if (glowEl) {
          const gl = glowEl.getTotalLength();
          gsap.set(glowEl, { strokeDasharray: gl, strokeDashoffset: gl });
          tl.to(glowEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
        }
        const nodes = journeyRef.current.querySelectorAll('.psed-journey-node');
        nodes.forEach((node, i) => {
          tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
        });
        const cards = journeyRef.current.querySelectorAll('.psed-journey-card');
        gsap.fromTo(cards, { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featureLabels = ['Product Strategy', 'Product & UX/UI Design', 'Innovation & Rapid Prototyping', 'Design Systems'];
  const featureTitles = ['Strategy', 'Design', 'Prototyping', 'Systems'];
  const featureContents = [
    'Define where the product should go, why it matters, and how it should create value through strategic prioritization.',
    'Shape experiences that are intuitive, usable, and accessible, aligned perfectly with your brand and business goals.',
    'Bring ideas to life quickly so teams can test, refine, and align on direction before committing to full build.',
    'Create a scalable experience foundation that improves consistency, speed, and governance across all touchpoints.',
  ];
  const featureMicros = [
    'Aligning product vision with enterprise growth levers.',
    'Designing experiences that naturally convert.',
    'Testing market-readiness before heavy build investment.',
    'Scaling foundations for global digital consistency.',
  ];
  const featureIcons = [Target, Palette, Zap, Layers];

  const safeCapIdx = activeCapability >= 0 ? activeCapability : 0;

  return (
    <div ref={sectionRef} className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>

      <PSEDRuler />

      {/* ─────────────────── HERO ─────────────────── */}
      <div id="psed-hero" className="p-2 h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
        <div className="relative w-full h-full overflow-hidden rounded-xl text-white">

          {/* Full-bleed background image */}
          <img
            src="/images/happy_team.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Left-to-right gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10 pointer-events-none" />

          {/* Top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

          {/* Hero content */}
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
              <div className="max-w-[62%] mt-[1cm]">

                {/* Typewriter badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                  <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                    <TypewriterText text="Design what matters. Build what wins." start={true} />
                  </p>
                </div>

                {/* H1 */}
                <h1 className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] xl:text-[5.2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-white mb-5 drop-shadow-2xl">
                  Product Strategy &{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">Design.</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/50 leading-[1.8] max-w-[520px] mb-12 font-medium">
                  Kangqore helps organizations define better products, design stronger
                  user experiences, and turn ideas into execution-ready outcomes.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                  >
                    Talk To Our Experts
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <a
                    href="#psed-capabilities"
                    className="group inline-flex items-center gap-2 px-6 py-4 text-white/55 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                  >
                    Explore Capabilities
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Capability strip — Superside inspired floating pill cards */}
          <div 
            className="absolute bottom-6 left-0 right-0 z-20 overflow-hidden" 
            style={{ 
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', 
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' 
            }}
          >
            <div
              className="flex items-center gap-4 w-max"
              style={{ animation: 'psed-strip-scroll 40s linear infinite' }}
            >
              {HERO_STRIP.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-[#0a0a0c] border border-white/10 rounded-2xl p-1.5 pr-6 shadow-2xl flex-shrink-0 cursor-default hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="w-14 h-12 rounded-xl flex items-center justify-center bg-white/5 shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${cap.color}, transparent)` }} />
                      {Icon && <Icon className="w-5 h-5 relative z-10" style={{ color: cap.color }} />}
                    </div>
                    <span className="text-[14px] font-semibold text-white/90 tracking-tight whitespace-nowrap">
                      {cap.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────── DEFINITION / OVERVIEW ─────────────────── */}
      <section id="psed-what" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/[0.08]">
                {[['8', 'Capability\nAreas'], ['4', 'Engagement\nPhases'], ['6', 'Industry\nContexts'], ['4', 'Tool\nCategories']].map(([v, l]) => (
                  <div key={l}>
                    <p className="text-4xl font-black text-white tracking-tight mb-1">{v}</p>
                    <p className="text-white/60 text-[11px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                <div className="relative z-10">
                  <p className="text-[11px] font-black tracking-[0.4em] text-amber-400/70 group-hover:text-white/70 uppercase mb-4 transition-colors duration-500">THE CHALLENGE</p>
                  <p className="text-white font-semibold text-lg leading-snug">
                    A product can be engineered well and still fail if the strategy and experience are weak.
                  </p>
                </div>
              </div>
              <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                <div className="relative z-10">
                  <p className="text-[11px] font-black tracking-[0.4em] text-cyan-400/70 group-hover:text-white/70 uppercase mb-4 transition-colors duration-500">THE SOLUTION</p>
                  <p className="text-white font-semibold text-lg leading-snug">
                    Kangqore helps businesses connect business intent, user needs, and execution realities — so product teams make better choices earlier and build with greater confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#06090f] border border-white/[0.08] rounded-2xl mb-16 relative overflow-hidden hover:border-transparent transition-all duration-500">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">Product Strategy & Design</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <span className="text-white/50 group-hover:text-white text-sm font-medium transition-colors duration-500">Reimagine — Digital Experience Practice</span>
            </div>
            <a href="#psed-capabilities" className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200 flex-shrink-0">
              View All Capabilities
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="group border-l-2 border-white/10 pl-8 py-6 pr-8 rounded-r-2xl bg-[#06090f] relative overflow-hidden hover:border-transparent transition-all duration-500">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
            <div className="relative z-10">
              <p className="text-xl sm:text-2xl font-black text-white/50 group-hover:text-white leading-snug max-w-4xl transition-colors duration-500">
                "Design What Matters. Build What Wins."
              </p>
              <p className="text-lg font-black text-white mt-3">
                We unify business intent, user needs, and execution realities so you can build with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── BADGE STRIP ─────────────────── */}
      <div className="border-t border-b border-white/[0.05] py-10" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-[11px] font-black tracking-[0.45em] text-white/50 uppercase mb-7 text-center">DESIGN APPROACH PRINCIPLES</p>
          {/* Overflows on a phone, and Chrome does not make an overflow
              container focusable on its own — so the badges past the fold were
              unreachable by keyboard. `justify-start` matters too: centering puts
              the leading overflow outside the scrollable range entirely. */}
          <div
            className="flex flex-nowrap items-center justify-start sm:justify-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
            role="group"
            aria-label="Design approach principles"
            tabIndex={0}
          >
            {['Strategy-Led Design', 'Research-Informed Decisions', 'Validated Prototyping', 'Scalable Design Systems', 'Accessibility-First Architecture', 'Design-to-Build Continuity', 'Adoption-Centered Launch Planning'].map((f, i, arr) => (
              <React.Fragment key={f}>
                <span className="flex-shrink-0 text-white/60 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap">{f}</span>
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

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-2.5">
              {featureLabels.map((label, i) => {
                const isOpen = activeFeature === i;
                const FeatureIcon = featureIcons[i];
                return (
                  <div
                    key={label}
                    onClick={() => setActiveFeature(isOpen ? -1 : i)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${isOpen ? 'border-white/[0.14] bg-[#06090f]' : 'border-white/[0.07] bg-[#06090f]'}`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-4">
                        <FeatureIcon className={`w-4 h-4 flex-shrink-0 transition-colors ${isOpen ? 'text-cyan-400' : 'text-white/50'}`} />
                        <p className={`font-black text-base leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55'}`}>{featureTitles[i]}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && (
                      <div className="pl-8 pt-1">
                        <p className="text-[11px] font-black tracking-[0.3em] text-cyan-400/70 uppercase mb-2">{label}</p>
                        <p className="text-white/55 text-sm font-medium leading-relaxed">{featureContents[i]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="group p-8 rounded-2xl border border-white/[0.07] bg-[#06090f] relative overflow-hidden hover:border-transparent transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                <div className="relative z-10">
                  <p className="text-[11px] font-black tracking-[0.4em] text-white/60 group-hover:text-white/60 uppercase mb-6 transition-colors duration-500">DESIGN INTELLIGENCE PROFILE</p>
                  <p className="text-[11px] font-black tracking-widest uppercase mb-2 text-cyan-400 group-hover:text-white transition-colors duration-500">{featureLabels[activeFeature] || 'Select a Feature'}</p>
                  <p className="text-white font-black text-2xl leading-tight mb-5">{featureTitles[activeFeature] || '—'}</p>
                  <p className="text-white/50 group-hover:text-white text-sm font-medium leading-relaxed mb-6 transition-colors duration-500">{featureContents[activeFeature] || 'Select a feature to explore its role in the product design framework.'}</p>
                  <div className="p-4 rounded-xl border border-cyan-400/20 group-hover:border-white/25 bg-cyan-400/[0.04] group-hover:bg-white/10 transition-colors duration-500">
                    <p className="text-sm font-semibold leading-snug text-cyan-400 group-hover:text-white transition-colors duration-500">{featureMicros[activeFeature] || 'Strategy, Design, Prototyping, and Systems — four layers of the same vision.'}</p>
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
        </div>
      </section>

      {/* ─────────────────── MID-FUNNEL BRIDGE ─────────────────── */}
      <div className="py-14 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="group flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 rounded-2xl border border-white/[0.07] bg-[#06090f] relative overflow-hidden hover:border-transparent transition-all duration-500">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
            <div className="relative z-10">
              <p className="text-[11px] font-black tracking-[0.4em] text-cyan-400/70 group-hover:text-white/70 uppercase mb-3 transition-colors duration-500">READY TO EXPLORE A DESIGN ENGAGEMENT?</p>
              <p className="text-white font-black text-xl leading-snug mb-2">Start with a 30-minute discovery call.</p>
              <p className="text-white/50 group-hover:text-white text-sm font-medium leading-relaxed max-w-xl transition-colors duration-500">
                Walk through the Kangqore Product Strategy & Design approach with a senior specialist. No commitment — a clear picture of how the engagement works and whether it fits your current priorities.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-black text-sm tracking-wide hover:bg-white/10 transition-colors duration-200">
                Book a Discovery Call
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#psed-capabilities" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/70 font-black text-sm tracking-wide hover:text-white hover:border-white/40 transition-all duration-200">
                See Our Capabilities
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────── eQORE AI CONCIERGE ─────────────────── */}
      <div id="psed-concierge">
        <ConciergeSection inverted suggestedPrompts={[
          'What is Product Strategy & Experience Design?',
          'What capabilities does Kangqore offer for product strategy?',
          'How does the design engagement process work?',
          'What deliverables will I receive?',
          'How long does a product strategy engagement take?',
          'What is a design system and why does it matter?',
          'How does rapid prototyping reduce risk?',
          'Can Kangqore support both strategy and engineering?',
          'What is a Modern Product Digital Maturity Assessment?',
          'How does Kangqore approach UX/UI design?',
          'Which industries does this service apply to?',
          'Request a Product Strategy Discovery Call',
        ]} />
      </div>

      {/* ─────────────────── 4 ENGAGEMENT PHASES ─────────────────── */}
      <section id="psed-phases" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
              <Link to="/contact" className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group">
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
                  <p className="text-sm font-semibold mb-2" style={{ color: step.color }}>{step.title}</p>
                  <p className="text-white/50 text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── BRAND EQUITY / QUOTE ─────────────────── */}
      <section className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center mb-24">
            <div className="relative rounded-[3rem] overflow-hidden aspect-square bg-[#06090f] border border-white/[0.08]">
              <img src="/images/happy_team.png" alt="Happy Startup Team" className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity duration-700" />
            </div>
            <div>
              <div className="text-7xl font-serif text-white/[0.05] leading-none select-none mb-2">"</div>
              <p className="text-3xl md:text-4xl lg:text-[2.75rem] font-light text-white leading-[1.3] -mt-12">
                Helping global brands across industries orchestrate exceptional UX and architect design systems that drive{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent italic font-normal">limitless growth.</span>
              </p>
            </div>
          </div>

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
              <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                <div className="relative z-10">
                  {/* Not text-brand-blue: #2564ea on this #06090f card is 3.88:1,
                      below the 4.5:1 AA floor even at full opacity. #467bed is the
                      same hue lifted toward white until it clears 5:1. */}
                  <p className="text-[11px] font-black tracking-[0.4em] text-[#467bed] group-hover:text-white/70 uppercase mb-3 transition-colors duration-500">THE FOUNDATION</p>
                  <p className="text-white/60 group-hover:text-white text-base font-light leading-relaxed italic transition-colors duration-500">
                    "An Enterprise Design Architecture prevents scaling debt and ensures that new feature development takes days, not months."
                  </p>
                </div>
              </div>
              <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                <div className="relative z-10">
                  <p className="text-[11px] font-black tracking-[0.4em] text-emerald-400 group-hover:text-white/70 uppercase mb-3 transition-colors duration-500">THE STRATEGY</p>
                  <p className="text-white/60 group-hover:text-white text-base font-light leading-relaxed italic transition-colors duration-500">
                    "When algorithmic user intelligence is merged with high-fidelity design, customer adoption accelerates exponentially."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 8 CAPABILITIES ─────────────────── */}
      <section id="psed-capabilities" className="py-32 relative" style={{ backgroundColor: '#000000' }}>
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
                        <span className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/50 group-hover:text-white/55'}`}>{c.title}</span>
                      </div>
                      <ChevronRight className={`lg:hidden w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${active ? 'rotate-90' : ''}`} />
                    </div>
                    {active && (
                      <div className="lg:hidden pb-6 pl-7 pr-2">
                        <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-3">CAPABILITY {c.n}</p>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">{c.desc}</p>
                        <ul className="space-y-1.5">
                          {c.items.map(item => (
                            <li key={item} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.color }} />
                              <span className="text-white/50 text-xs font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:flex items-start pt-5">
              <div className="w-full sticky top-8">
                <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-6">CAPABILITY {capabilities[safeCapIdx].n}</p>
                <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">{capabilities[safeCapIdx].title}</h3>
                <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">{capabilities[safeCapIdx].desc}</p>
                <ul className="space-y-3">
                  {capabilities[safeCapIdx].items.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: capabilities[safeCapIdx].color }} />
                      <span className="text-white/55 text-sm font-medium leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── ENTERPRISE DESIGN COE + DIFFERENTIATORS ─────────────────── */}
      <section className="py-24 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
            <div className="w-full lg:w-[40%] xl:w-[35%]">
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">ENTERPRISE DESIGN COE</p>
              <p className="text-white/60 text-lg leading-relaxed font-light mb-5">
                Our <strong className="text-white">Enterprise Design CoE</strong> provides a high-velocity strategic blueprint, surrounding your product idea with four critical layers of UX validation.
              </p>
              <p className="text-white/50 text-base leading-relaxed font-light">
                We replace "build-and-hope" with "validate-and-architect." By unifying lean discovery, high-fidelity mockups, strategic research, and scalable design architectures, we ensure your product UX is built on a foundation of absolute confidence.
              </p>
            </div>

            <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
              <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
                <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                  <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                    <defs>
                      <linearGradient id="psed-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2564ea" />
                        <stop offset="100%" stopColor="#4ab6d4" />
                      </linearGradient>
                    </defs>
                    {[{ cx: 300, cy: 40, delay: '0s' }, { cx: 40, cy: 300, delay: '0.5s' }, { cx: 300, cy: 560, delay: '1s' }, { cx: 560, cy: 300, delay: '1.5s' }].map(({ cx, cy, delay }, idx) => {
                      const paths = ['M 300 40 L 300 85 L 195 190', 'M 40 300 L 85 300 L 190 405', 'M 300 560 L 300 515 L 405 410', 'M 560 300 L 515 300 L 410 195'];
                      return (
                        <g key={idx}>
                          <circle cx={cx} cy={cy} r="7" fill="url(#psed-blue-grad)" style={{ animation: `dot-ping 3s ease-in-out infinite ${delay}` }} />
                          <path d={paths[idx]} fill="none" stroke="url(#psed-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: `connector-draw 2s ease-out ${idx * 0.3}s forwards` }} />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                    <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite' }}>
                      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                        {[['from-blue-600 to-blue-800', 'Lean\nDiscovery', '6px'], ['from-blue-400 to-blue-600', 'Strategic\nRoadmap', '4px'], ['from-blue-900 to-slate-900', 'Flawless\nUI/UX', '2px'], ['from-cyan-500 to-cyan-700', 'Architected\nScalability', '3px']].map(([grad, label, z], idx) => (
                          <div key={idx} className={`relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br ${grad}`} style={{ transform: `translateZ(${z})` }}>
                            <div className="-rotate-45 text-center text-white font-bold text-[16px] whitespace-pre-line">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-right">
                      <li>Ethnographic research •</li><li>Competitive teardowns •</li><li>Behavior tracking •</li><li>User intent mapping •</li>
                    </ul>
                  </div>
                  <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-left">
                      <li>• MVP feature slicing</li><li>• Workflow logic trees</li><li>• ROI metric definitions</li><li>• Go-to-market orchestration</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-right">
                      <li>Transcendental interfaces •</li><li>Zero-friction interactions •</li><li>Micro-animation logic •</li><li>Deep brand embedding •</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-white/50 text-left">
                      <li>• React/Figma single truth</li><li>• Centralized token governance</li><li>• Multi-platform logic paths</li><li>• Agile developer handoff</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mobile CoE cards */}
              <div className="lg:hidden grid grid-cols-2 gap-4 w-full">
                {[['from-blue-600 to-blue-800', 'Lean Discovery'], ['from-blue-400 to-blue-600', 'Strategic Roadmap'], ['from-blue-900 to-slate-900', 'Flawless UI/UX'], ['from-cyan-500 to-cyan-700', 'Architected Scalability']].map(([grad, title], idx) => (
                  <div key={idx} className="bg-[#06090f] border border-white/[0.08] rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${grad} p-4 text-white font-bold text-sm`}>{title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Differentiators — editorial ledger */}
          <div ref={differentiatorRef}>
            <div className="flex items-center justify-between mb-12">
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase">WHY THIS APPROACH</p>
              <div className="hidden lg:grid grid-cols-[1fr_1fr] gap-10 text-[11px] font-black tracking-[0.3em] text-white/60 uppercase pr-1">
                <span>Reason</span>
                <span>Detail</span>
              </div>
            </div>
            <div>
              {differentiators.map((d) => {
                const DIFF_COLORS = ['#22D3EE', '#60A5FA', '#A78BFA', '#FB923C', '#34D399'];
                const DIFF_ICONS  = [Target, Zap, Layers, Search, Cpu];
                const dColor = DIFF_COLORS[(d.num - 1) % DIFF_COLORS.length];
                const DIcon  = DIFF_ICONS[(d.num - 1) % DIFF_ICONS.length];
                return (
                  <div key={d.num} className="diff-item group relative border-t border-white/[0.06] last:border-b last:border-white/[0.06]">
                    {/* Left grow bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px] origin-top transition-transform duration-500 scale-y-0 group-hover:scale-y-100"
                      style={{ backgroundColor: dColor }}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-[72px_1fr_1fr] items-start gap-x-10 gap-y-3 py-8 pl-5">
                      {/* Number + icon */}
                      <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1.5">
                        <span
                          className="text-[2.6rem] font-black leading-none tabular-nums transition-opacity duration-300 group-hover:opacity-100"
                          style={{ color: dColor, opacity: 0.55 }}
                        >
                          {String(d.num).padStart(2, '0')}
                        </span>
                        <DIcon
                          className="w-3.5 h-3.5 transition-opacity duration-300 group-hover:opacity-70"
                          style={{ color: dColor, opacity: 0.3 }}
                        />
                      </div>
                      {/* Title */}
                      <h4
                        className="font-black text-xl lg:text-2xl leading-snug tracking-tight"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        <span className="group-hover:text-white transition-colors duration-300">{d.title}</span>
                      </h4>
                      {/* Description */}
                      <p className="text-white/50 group-hover:text-white/58 text-sm leading-relaxed transition-colors duration-300 lg:pt-1">
                        {d.text}
                      </p>
                    </div>
                  </div>
                );
              })}
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
            <div className="w-full lg:w-[55%] relative">
              <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px]" style={{ zIndex: 1 }}>
                <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="psed-journey-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" /><stop offset="25%" stopColor="#3b82f6" /><stop offset="50%" stopColor="#2564ea" /><stop offset="75%" stopColor="#10b981" /><stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="psed-journey-glow">
                      <feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
                  <path className="psed-journey-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#psed-journey-grad)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#psed-journey-glow)" opacity="0.4" />
                  <path className="psed-journey-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#psed-journey-grad)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[125, 375, 625, 875].map((cy, i) => (
                    <g key={i} className="psed-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#psed-journey-grad)" strokeWidth="0.8" opacity="0.2">
                        <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx="15" cy={cy} r="7" fill="#06090f" stroke="url(#psed-journey-grad)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#psed-journey-grad)" opacity="0.7">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                      </circle>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="space-y-6 lg:pl-[55px]">
                {journeyPhases.map((item, idx) => {
                  const { Icon } = item;
                  return (
                    <div key={idx} className="psed-journey-card group">
                      <div className="relative bg-[#06090f] border border-white/[0.08] rounded-3xl p-6 lg:p-8 hover:border-transparent transition-all duration-500 hover:-translate-y-1 flex items-start gap-6 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                        <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${phaseGradients[idx]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/60 group-hover:text-white/50 uppercase transition-colors duration-500">{item.phase}</div>
                            {item.kangqore && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 group-hover:bg-white/15 border border-brand-blue/20 group-hover:border-white/30 rounded-full transition-colors duration-500">
                                <div className="w-1 h-1 bg-brand-blue group-hover:bg-white rounded-full animate-pulse transition-colors duration-500" />
                                <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue group-hover:text-white uppercase transition-colors duration-500">Kangqore</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-white/50 group-hover:text-white font-light leading-relaxed transition-colors duration-500">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                    <Rocket className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Design-to-Build Journey</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                    From Ambition to<br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent">Market Ready.</span>
                  </h2>
                  <p className="text-white/50 text-lg font-light leading-relaxed max-w-lg">
                    A connected system for moving from customer understanding to product clarity to design systems and launch-ready direction.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                  {[['Phases', '04'], ['Timeline', '4-12 wks'], ['Confidence', '100%']].map(([label, val], i) => (
                    <div key={label}>
                      <div className="font-mono text-[11px] text-white/60 tracking-widest uppercase font-bold mb-2">{label}</div>
                      <div className={`text-2xl font-black ${i === 2 ? 'bg-brand-gradient bg-clip-text text-transparent' : 'text-white'}`}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 6 TRUST PILLARS ─────────────────── */}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {trustPillars.map((p, i) => {
              const elevated = i === 1 || i === 4;
              return (
                <div key={p.tag}
                  className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${elevated ? 'lg:-translate-y-4' : ''}`}
                >
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg relative">
                    <img src={p.image} alt={p.tag} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${p.color}28 0%, transparent 60%, #06090f60 100%)` }} />
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <span className="text-[11px] font-black tracking-widest opacity-60" style={{ color: p.color }}>0{i + 1}</span>
                      <div>
                        <div className="w-8 h-0.5 rounded-full mb-3" style={{ backgroundColor: p.color }} />
                        <p className="text-[11px] font-black tracking-[0.3em] uppercase" style={{ color: p.color }}>{p.tag}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-transparent overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">{p.title}</h3>
                      <p className="text-white/60 group-hover:text-white text-sm leading-relaxed transition-colors duration-500">{p.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────── WHY KANGQORE + INDUSTRIES ─────────────────── */}
      <section id="psed-why" className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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

          <div className="grid md:grid-cols-3 gap-6 mb-20 lg:items-start">
            {whyKangqore.map((item) => {
              const { Icon } = item;
              return (
                <div key={item.title}
                  className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${item.color}28 0%, transparent 60%, #06090f60 100%)` }} />
                  </div>
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-transparent overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">{item.title}</h3>
                      <p className="text-white/60 group-hover:text-white text-sm leading-relaxed transition-colors duration-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start pt-16 border-t border-white/[0.05]">
            <div>
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">WHERE EXPERIENCE STRATEGY ADDS MOST VALUE</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                Relevant across new products,<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">redesigns, and large portfolios.</span>
              </h3>
              <p className="text-white/50 text-base font-medium leading-relaxed">Typical engagements include:</p>
            </div>
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
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section id="psed-faq" className="py-32 border-t border-white/[0.05] relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
              <Link to="/contact" className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-cyan-400/50 hover:bg-white/5 transition-all duration-300 group">
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
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-start justify-between gap-8 py-7 text-left group">
                    <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-white/20 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-7 pr-12">
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

      {/* ─────────────────── RELATED SERVICES ─────────────────── */}
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
                const { Icon } = e;
                return (
                  <Link key={e.name} to={e.link} className="group relative flex items-start gap-5 p-6 bg-[#06090f] border border-white/[0.07] rounded-2xl hover:border-transparent transition-all overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                    <div className="relative z-10 w-12 h-12 bg-white/5 group-hover:bg-white/15 rounded-2xl flex items-center justify-center text-white flex-shrink-0 transition-colors duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                      <span className="font-black text-lg text-white block mb-1">{e.name}</span>
                      <p className="text-white/50 group-hover:text-white text-sm transition-colors duration-500">{e.desc}</p>
                    </div>
                    <ArrowRight className="relative z-10 w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all mt-1 flex-shrink-0 ml-auto" />
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
          <div className="relative rounded-[32px] p-10 lg:p-16 overflow-hidden text-center shadow-2xl">
            {/* Background image */}
            <div
              className="absolute -inset-20 z-0"
              style={{
                backgroundImage: 'url("/images/happy_team.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Dark overlay — no mix-blend, no teal */}
            <div className="absolute inset-0 bg-black/70 z-10" />
            <div className="absolute inset-0 bg-[#2564ea]/40 z-10" />
            <div className="relative z-20">
              <p className="text-[11px] font-black tracking-[0.45em] text-cyan-400 uppercase mb-8">READY TO GET STARTED?</p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 max-w-3xl mx-auto">
                Ready to define a sharper product and a{' '}
                <span className="text-cyan-300">stronger experience?</span>
              </h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                Let's shape the right product strategy, design the right experience, and create the execution-ready foundation needed to move faster with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-xl">
                  Talk To Our Experts
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a href="#psed-capabilities" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-black text-sm tracking-wide hover:bg-white/10 transition-all duration-200">
                  Explore Capabilities
                  <ArrowRight className="w-4 h-4" />
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
        @keyframes psed-strip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes psed-strip-scroll { 0%, 100% { transform: translateX(0); } }
        }
      `}} />
    </div>
  );
}
