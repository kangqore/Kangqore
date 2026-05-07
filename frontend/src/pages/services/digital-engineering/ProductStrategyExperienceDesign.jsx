import React, { useEffect, useRef } from 'react';
import { 
  Rocket, Zap, Target, Layers, Search, BarChart3, 
  LayoutTemplate, MonitorSmartphone, Server, CalendarDays,
  CheckCircle2, Cpu, Radar, ArrowRight, ChevronRight,
  TrendingUp, Activity, Users, ShieldCheck, Workflow,
  Lightbulb, LineChart, Shield, Gauge, Palette,
  Compass, BrainCircuit, Package, Settings, Cloud,
  Briefcase, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProductStrategyExperienceDesign = () => {
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef = useRef(null);

  useEffect(() => {
    // 1. Diamond Entrance Animation
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true }
        }
      );
      gsap.to(diamondRef.current, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    // 2. Differentiator items staggered entrance
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        {
          opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true }
        }
      );
    }

    // 5. Journey Timeline — Creative Animated Path
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 0.8,
        }
      });

      // Draw the SVG path progressively
      const pathEl = journeyRef.current.querySelector('.journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }

      // Glow path follows main path
      const glowEl = journeyRef.current.querySelector('.journey-curve-glow');
      if (glowEl) {
        const gl = glowEl.getTotalLength();
        gsap.set(glowEl, { strokeDasharray: gl, strokeDashoffset: gl });
        tl.to(glowEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }

      // Reveal each node with scale (removed expensive filter:blur animation)
      const nodes = journeyRef.current.querySelectorAll('.journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' },
          i * 0.2
        );
      });

      // Stagger card content entrance (non-scrubbed, fires once)
      const cards = journeyRef.current.querySelectorAll('.journey-card');
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true }
        }
      );
    }

    // 4. Stat counter animation
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) {
          const targetNum = parseInt(match[1]);
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => { el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`); }
              });
            }
          });
        }
      });
    };

    const timer = setTimeout(animateCounters, 500);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // CAPABILITIES DATA (with bgImages like Discover page)
  // ============================================
  const capabilities = [
    {
      title: "Product Strategy",
      description: "Start with strategy to validate product-market fit, accelerate transformation, and ensure long-term success. We’ll partner to uncover growth opportunities, align products with business goals, and create tailored, user-validated plans.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Uncover expansion opportunities and growth levers",
        "Align product-engineering pods with business North Stars",
        "Create tailored, user-validated execution roadmaps",
        "Strategic prioritization of 'Must-Win' product features"
      ],
      micro: "Aligning product vision with enterprise growth levers."
    },
    {
      title: "Product and UX/UI Design",
      description: "User wireframes, user flows, sitemaps, component libraries, and more to design the product experience. This includes crafting the structure, look, and functionality, while considering the medium, brand, accessibility, and best practices.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "High-fidelity user journeys and sitemap orchestration",
        "Unified interaction systems for multi-platform cohesion",
        "Inclusive, accessibility-first design architectures",
        "Performance-optimized UI components for rapid adoption"
      ],
      micro: "Designing experiences that naturally convert."
    },
    {
      title: "Design Systems",
      description: "Create a single source of truth to help your team and partners deliver seamless, consistent digital experiences at every touchpoint. Your design system could contain patterns, components, guidelines, and other core UX and brand elements.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "Scalable pattern libraries and tokenized UI governance",
        "Reusable component architectures for engineering velocity",
        "Brand-aligned style guides and global experience standards",
        "Cross-functional documentation for design-build continuity"
      ],
      micro: "Scaling foundations for global digital consistency."
    },
    {
      title: "Innovation and Rapid Prototyping",
      description: "Refine concepts, reduce risks, and bring market-ready products to users faster. Together, we’ll build a realistic, limited-functionality representation of your proposed experience for testing, iteration, socialization, and spec creation.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        "Realistic, limited-functionality models for early testing",
        "Stakeholder socialization and specular concept creation",
        "High-velocity iteration loops to reduce build uncertainty",
        "Technical de-risking through functional proof-of-concepts"
      ],
      micro: "Testing market-readiness before heavy build investment."
    },
    {
      title: "User and Market Research",
      description: "Gather data, then turn it into insights and actionable plans. Using quantitative, qualitative, and algorithmic techniques, we help you deeply understand your market and audience to drive product-market fit, growth, and user satisfaction.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Algorithmic audience profiling and market trend synthesis",
        "In-depth usability testing and behavioral signal analysis",
        "Competitive benchmarking and category-defining research",
        "Clear, data-backed recommendations for product evolution"
      ],
      micro: "Evidence-led decisions for category dominance."
    },
    {
      title: "Product Launch and Adoption",
      description: "Just because you build it doesn't mean users will come. Prepare for a smooth launch and drive adoption by partnering with Kangqore on change management and strategic launch plans that consider your users, culture, constraints, and more.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Strategic product launch and adoption roadmaps",
        "Experience continuity planning across phased rollout",
        "Human-centric change management and user-enablement",
        "Adoption monitoring and post-launch experience tuning"
      ],
      micro: "Ensuring real-world success at the moment of launch."
    },
    {
      title: "Modern Product Digital Maturity Assessment",
      description: "Lower costs, drive innovation, and build thriving teams with our Modern Product Digital Maturity Assessment. We’ll help spot opportunities and enhance execution across product, design, and tech through team assessments and upskilling.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Deep-dive assessment of product, design, and tech stacks",
        "Capability gap identification and talent uplift roadmaps",
        "Team-level assessment for innovation-readiness",
        "Roadmaps to reduce operational drag and improve velocity"
      ],
      micro: "Unlocking enterprise velocity through maturity review."
    },
    {
      title: "Strategic Design-to-Build Alignment",
      description: "Architect the handoff between design vision and engineering execution to ensure what is designed is what is shipped. We close the gap between strategy and code to ensure no loss in intent during technical implementation.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "Collaborative design-engineering pods for continuity",
        "Strategy-led technical feasibility assessments",
        "Seamless asset handoff and implementation governance",
        "Execution confidence through strategy-to-code alignment"
      ],
      micro: "Bridging the gap between vision and shipped code."
    }
  ];

  // ============================================
  // SUGGESTION 1: preMatrixSection
  // ============================================
  const preMatrixSection = (
    <>
      <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
        {/* Ambient glow orbs removed */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left side: Happy Team Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gray-100 dark:bg-[#0a0a0c]/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden aspect-square">
                <img 
                  src="/images/happy_team.png" 
                  alt="Happy Startup Team" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right side: Quote Content */}
            <div className="flex items-start gap-6 lg:gap-10">
              {/* Accent vertical line */}
              <div className="hidden md:flex flex-col items-center gap-3 pt-2">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-gray-200"></div>
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
                <div className="w-px h-32 bg-gradient-to-b from-gray-200 to-transparent"></div>
              </div>

              <div className="flex-1">
                {/* Large decorative quote mark */}
                <div className="text-7xl md:text-9xl font-serif text-gray-900 dark:text-white/[0.05] leading-none select-none mb-2">"</div>

                <p className="text-2xl md:text-4xl lg:text-[2.75rem] font-light text-gray-800 dark:text-gray-50 leading-[1.3] font-display -mt-12 md:-mt-16 pl-2 lg:pl-0">
                  Helping global brands across industries orchestrate exceptional UX and architect design systems that drive{' '}
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">limitless growth.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="py-32 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
                A fragmented user experience directly erodes <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">brand equity.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                A flawless UI/UX is not just visual polish. It is a strategic revenue multiplier. Kangqore helps global organizations unify their digital presence and create experiences that naturally convert.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-brand-blue shadow-lg">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-3 text-transparent bg-clip-text bg-brand-gradient">THE FOUNDATION</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">
                      "An Enterprise Design Architecture prevents scaling debt and ensures that new feature development takes days, not months."
                    </p>
                  </div>
                </div>
              </div>
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-emerald-500 shadow-lg">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">THE STRATEGY</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">
                      "When algorithmic user intelligence is merged with high-fidelity design, customer adoption accelerates exponentially."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );

  // ============================================
  // SUGGESTION 7: Creative Animated Journey Timeline
  // ============================================
  const journeyPhases = [
    { phase: 'DISCOVER', icon: <Search className="w-7 h-7" />, title: 'Understand Ambition', desc: 'Understand business goals, customer needs, market context, and product ambition.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
    { phase: 'FRAME', icon: <Target className="w-7 h-7" />, title: 'Define Opportunity', desc: 'Define the opportunity, priorities, journeys, solution direction, and experience principles.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
    { phase: 'DESIGN', icon: <Palette className="w-7 h-7" />, title: 'Create Systems', desc: 'Create prototypes, UX/UI systems, design language, and reusable patterns for execution.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
    { phase: 'ACTIVATE', icon: <Rocket className="w-7 h-7" />, title: 'Launch & Evolve', desc: 'Prepare for launch, adoption, design-to-engineering continuity, and next-phase evolution.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true }
  ];

  const journeyTimeline = (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      {/* Ambient background elements removed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          {/* LEFT SIDE — Animated SVG Graphic + Vertical Phase Cards */}
          <div className="w-full lg:w-[55%] relative">
            {/* Vertical SVG Curve (desktop only) */}
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
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background track */}
                <path
                  d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000"
                  stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none"
                />

                {/* Glow path */}
                <path
                  className="journey-curve-glow"
                  d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000"
                  stroke="url(#journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none"
                  filter="url(#journey-glow-v)" opacity="0.3"
                />

                {/* Main animated path */}
                <path
                  className="journey-curve-path"
                  d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000"
                  stroke="url(#journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none"
                />

                {/* Animated nodes at 4 positions (matched to 4 phases) */}
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#journey-grad-v)" strokeWidth="0.8" opacity="0.2">
                      <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#journey-grad-v)" opacity="0.7">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                    </circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">
                      {String(i + 1).padStart(2, '0')}
                    </text>
                  </g>
                ))}

                {/* Floating particles */}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-${i}`} className="journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values={`0;1000`} dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>

            {/* Vertical Phase Cards */}
            <div className="space-y-6 lg:pl-[55px]">
              {journeyPhases.map((item, idx) => (
                <div key={idx} className="journey-card group" style={{ perspective: '800px' }}>
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`}></div>

                    {/* Icon */}
                    <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.glow} group-hover:scale-110 transition-all duration-500`}>
                      {item.icon}
                      <div className={`absolute inset-0 rounded-2xl border-2 ${item.ring} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[9px] font-bold tracking-[0.3em] text-gray-300 uppercase">{item.phase}</div>
                        {item.kangqore && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                            <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse"></div>
                            <span className="text-[7px] font-bold tracking-[0.15em] text-brand-blue uppercase">Kangqore</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors duration-300">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile vertical line */}
            <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px">
              <div className="w-full h-full bg-gradient-to-b from-slate-600 via-brand-blue to-purple-500 opacity-20 rounded-full"></div>
            </div>
          </div>

          {/* RIGHT SIDE — Heading, Description & Summary */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                  <Rocket className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Design-to-Build Journey</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                  From Ambition to <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Market Ready.</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                  A connected system for moving from customer understanding to product clarity to design systems and launch-ready direction.
                </p>
              </div>

              {/* Animated Orbital Graphic */}
              <div className="hidden lg:block relative w-full" style={{ height: '280px' }}>
                <svg className="w-full h-full" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet" fill="none">
                  <defs>
                    <linearGradient id="journey-grad-h" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="orb-glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background glow */}
                  <circle cx="250" cy="140" r="130" fill="url(#center-glow)" />

                  {/* Concentric orbit rings */}
                  <circle cx="250" cy="140" r="40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="30s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="140" r="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3">
                    <animateTransform attributeName="transform" type="rotate" values="360 250 140;0 250 140" dur="45s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="140" r="110" stroke="url(#journey-grad-h)" strokeWidth="0.8" strokeDasharray="8 8" opacity="0.15">
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="60s" repeatCount="indefinite" />
                  </circle>

                  {/* Revolving orbit group — rotates around center */}
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="40s" repeatCount="indefinite" />

                    {/* Connection lines + Phase dots (all revolve together) */}
                    {[
                      { angle: -90, label: 'DISCOVER', color: '#64748b', r: 110 },
                      { angle: 0, label: 'FRAME', color: '#3b82f6', r: 110 },
                      { angle: 90, label: 'DESIGN', color: '#2564ea', r: 110 },
                      { angle: 180, label: 'ACTIVATE', color: '#10b981', r: 110 }
                    ].map((item, i) => {
                      const rad = (item.angle * Math.PI) / 180;
                      const x = 250 + item.r * Math.cos(rad);
                      const y = 140 + item.r * Math.sin(rad);
                      const labelX = 250 + (item.r + 22) * Math.cos(rad);
                      const labelY = 140 + (item.r + 22) * Math.sin(rad);
                      return (
                        <g key={`orb-${i}`}>
                          {/* Connector line */}
                          <line x1="250" y1="140" x2={x} y2={y} stroke={item.color} strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2">
                            <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                          </line>
                          {/* Pulse ring */}
                          <circle cx={x} cy={y} r="10" fill="none" stroke={item.color} strokeWidth="0.5" opacity="0.3">
                            <animate attributeName="r" values="10;16;10" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                          </circle>
                          {/* Main dot */}
                          <circle cx={x} cy={y} r="8" fill="white" stroke={item.color} strokeWidth="1.5" />
                          <circle cx={x} cy={y} r="3" fill={item.color} opacity="0.8">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                          </circle>
                          {/* Counter-rotating label (stays upright) */}
                          <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fill={item.color} fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1" opacity="0.6">
                            <animateTransform attributeName="transform" type="rotate" values={`0 ${labelX} ${labelY};-360 ${labelX} ${labelY}`} dur="40s" repeatCount="indefinite" />
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Central hub (stationary, rendered on top) */}
                  <circle cx="250" cy="140" r="22" fill="white" stroke="url(#journey-grad-h)" strokeWidth="2" filter="url(#orb-glow)" />
                  <circle cx="250" cy="140" r="12" fill="url(#journey-grad-h)" opacity="0.15">
                    <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="250" y="141" textAnchor="middle" dominantBaseline="central" fill="#1e40af" fontSize="9" fontWeight="800" fontFamily="monospace" letterSpacing="2">MVP</text>

                  {/* Floating micro-particles on orbit */}
                  {[0, 1, 2, 3].map(i => (
                    <circle key={`mp-${i}`} r="1.5" fill="#3b82f6" opacity="0.4">
                      <animateMotion dur={`${8 + i * 3}s`} repeatCount="indefinite" begin={`${i * 2}s`}>
                        <mpath href="#orbit-path" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;0.5;0.5;0" dur={`${8 + i * 3}s`} repeatCount="indefinite" begin={`${i * 2}s`} />
                    </circle>
                  ))}
                  <circle id="orbit-path" cx="250" cy="140" r="75" fill="none" stroke="none" />
                </svg>
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">04</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Timeline</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4-12<span className="text-sm text-gray-400 ml-1">wks</span></div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Confidence</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">100%</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );

  // ============================================
  // 3D DIAMOND COE SECTION (matching Discover page)
  // ============================================
  const mvpCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">Enterprise Design CoE</strong> provides a high-velocity strategic blueprint, surrounding your product idea with four critical layers of UX validation.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace "build-and-hope" with "validate-and-architect." By unifying lean discovery, high-fidelity mockups, strategic research, and scalable design architectures, we ensure your product UX is built on a foundation of absolute confidence.
              </p>
            </div>
          </div>
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
                        <div className="-rotate-45 text-center text-white font-bold text-[15px]">Lean<br/>Discovery</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[15px]">Strategic<br/>Roadmap</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[15px]">Flawless<br/>UI/UX</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[15px]">Architected<br/>Scalability</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>Ethnographic research •</li>
                    <li>Competitive teardowns •</li>
                    <li>Behavior tracking •</li>
                    <li>User intent mapping •</li>
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• MVP feature slicing</li>
                    <li>• Workflow logic trees</li>
                    <li>• ROI metric definitions</li>
                    <li>• Go-to-market orchestration</li>
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>Transcendental interfaces •</li>
                    <li>Zero-friction interactions •</li>
                    <li>Micro-animation logic •</li>
                    <li>Deep brand embedding •</li>
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• React/Figma single truth</li>
                    <li>• Centralized token governance</li>
                    <li>• Multi-platform logic paths</li>
                    <li>• Agile developer handoff</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Lean Discovery', items: ['UX Research', 'Behavioral mapping'], gradient: 'from-blue-600 to-blue-800' },
                { title: 'Strategic Roadmap', items: ['Feature slicing', 'ROI metrics'], gradient: 'from-blue-400 to-blue-600' },
                { title: 'Flawless UI/UX', margin: '', items: ['Pixel perfection', 'Interactive models'], gradient: 'from-blue-900 to-slate-900' },
                { title: 'Architected Scalability', items: ['Token governance', 'Zero-friction handoff'], gradient: 'from-cyan-500 to-cyan-700' }
              ].map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                  <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                  <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIFFERENTIATORS GRID */}
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { num: 1, title: 'Connect Strategy with Build', text: 'We bridge the gap between design vision and technical execution so decisions stay coherent.' },
              { num: 2, title: 'Validate Earlier', text: 'We use rapid framing and high-fidelity prototyping to reduce uncertainty before heavy investment.' },
              { num: 3, title: 'Scale with Systems', text: 'We build reusable design foundations that improve product consistency, speed, and governance.' },
              { num: 4, title: 'Improve Adoption', text: 'We plan for the human realities that shape how users actually adopt and use digital products.' },
              { num: 5, title: 'Maturity Assessments', text: 'We help identify where teams can improve their product, design, and technology execution.' }
            ].map((d) => (
              <div key={d.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:bg-brand-blue transition-colors">{d.num}</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{d.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // EXECUTION ECOSYSTEM SECTION (matching Discover page)
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative z-[10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related Engineering <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
              Extend your design strategy into a full-scale product. Kangqore provides the end-to-end engineering muscle to build what you've architected.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Digital Process Automation', link: '/services/digital-process-automation', icon: <Compass className="w-5 h-5" />, desc: 'Automate complex operational workflows via scaled platforms.' },
                { name: 'Product Digital Engineering', link: '/services/digital-engineering/product-digital-engineering', icon: <Cpu className="w-5 h-5" />, desc: 'Enterprise-grade platform development at scale.' },
                { name: 'MVP Acceleration', link: '/services/digital-engineering/mvp-acceleration', icon: <Server className="w-5 h-5" />, desc: 'Rapid velocity engineering and scale-ready launch models.' }              ].map((e, idx) => (
                <Link key={idx} to={e.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 transition-all shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">{e.icon}</div>
                  <div>
                    <span className="font-bold text-lg block mb-1 group-hover:text-brand-blue transition-colors">{e.name}</span>
                    <p className="text-gray-500 text-sm">{e.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>
              <div className="absolute top-0 left-0 p-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>blueprint_id:</span> <span className="text-brand-blue">#KG_UX_S01</span></div>
                <div className="flex justify-between gap-4"><span>logic_state:</span> <span className="text-emerald-500">VALIDATED</span></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative"><Rocket className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300"><Compass className="w-12 h-12 text-brand-blue" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Discover_Frame</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300"><Cpu className="w-12 h-12 text-cyan-400" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Digi_Eng</span>
                </div>
              </div>
              <div className="absolute bottom-10 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative -translate-x-4 hover:translate-x-0 transition-transform duration-300"><Radar className="w-12 h-12 text-white" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase -translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Modernize</span>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="exec-flow-grad-mvp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,120" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L120,400" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L380,400" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <circle r="3" fill="#0066FF"><animateMotion path="M250,250 L250,120" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="3" fill="#00D2FF"><animateMotion path="M250,250 L120,400" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="3" fill="#6366f1"><animateMotion path="M250,250 L380,400" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // TEMPLATE DATA INJECTION
  // ============================================
  const department = {
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    description: 'Transforming product ideas into high-performance digital reality.',
    icon: <Briefcase className="w-6 h-6" />
  };

  const pageData = {
    service: {
      name: 'Product Strategy & Design',
      titleLine1: 'Product Strategy &',
      titleHighlight: 'Design.',
      slug: 'product-strategy-experience-design',
      videoBackground: '/videos/engineering-rd-bg.mp4',
      shortDescription: "Design what matters. Build what wins.",
      fullDescription: (
        <div className="space-y-4">
          <p className="font-light tracking-tight leading-snug opacity-80">
            Kangqore helps organizations define better products, design stronger user experiences, and turn ideas into execution-ready outcomes.
          </p>
        </div>
      ),
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',

      stats: [
        { value: 'Define', label: 'Stronger product direction & value clarity', color: 'text-cyan-400' },
        { value: 'Design', label: 'Smarter user journeys & digital experiences', color: 'text-blue-400' },
        { value: 'Accelerate', label: 'Concept-to-launch speed', color: 'text-emerald-400' },
        { value: 'Scale', label: 'System adoption & maturity', color: 'text-purple-400' }
      ],

      primaryButton: { text: "Talk To Our Experts", link: "/contact" },
      secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
      ctaTitle: 'Ready to define a sharper product and a stronger experience?',
      ctaDescription: "Let’s shape the right product strategy, design the right experience, and create the execution-ready foundation needed to move faster with confidence.",
      ctaSecondaryButton: { text: "Explore Capabilities", link: "#capabilities" },

      trustStripText: 'Helping enterprises, digital product teams, and growth-stage businesses shape better products, stronger experiences, and clearer paths from idea to launch.',

      highFidelity: {
        narrative: {
          badge: 'UX_STRAT :: 2026',
          titleLine1: 'Product Strategy &',
          titleHighlight: 'Design.',
          titleLine2: '',
          description: 'Kangqore combines strategic product thinking with execution realism. We help organizations move from customer understanding to product clarity to design systems and launch-ready direction — without breaking continuity between strategy, design, and build.',
          bottleneckLabel: 'The Challenge',
          bottleneckText: 'A product can be engineered well and still fail if the strategy and experience are weak.',
          requirementLabel: 'The Solution',
          requirementText: 'Kangqore helps businesses connect business intent, user needs, and execution realities — so product teams make better choices earlier and build with greater confidence.',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
          statusLabel: 'Engagement Tier',
          statusValue: 'STRATEGIC'
        },
        philosophy: {
          icon: <Palette className="w-7 h-7 text-gray-900 dark:text-white" />,
          title: 'Design What Matters.',
          titleHighlight: 'Build What Wins.',
          description: 'We unify business intent, user needs, and execution realities so you can build with greater confidence.',
          pills: ['Strategy', 'Research', 'Design', 'Prototypes'],
          features: [
            {
              title: 'Strategy',
              label: 'Product Strategy',
              icon: <Target className="w-5 h-5 text-gray-400" />,
              content: 'Define where the product should go, why it matters, and how it should create value through strategic prioritization.'
            },
            {
              title: 'Design',
              label: 'Product & UX/UI Design',
              icon: <Palette className="w-5 h-5 text-gray-400" />,
              content: 'Shape experiences that are intuitive, usable, and accessible, aligned perfectly with your brand and business goals.'
            },
            {
              title: 'Prototyping',
              label: 'Innovation & Rapid Prototyping',
              icon: <Zap className="w-5 h-5 text-gray-400" />,
              content: 'Bring ideas to life quickly so teams can test, refine, and align on direction before committing to full build.'
            },
            {
              title: 'Systems',
              label: 'Design Systems',
              icon: <Layers className="w-5 h-5 text-gray-400" />,
              content: 'Create a scalable experience foundation that improves consistency, speed, and governance across all touchpoints.'
            }
          ]
        },
        matrix: {
          engineId: 'Engine :: Strat_V1',
          title: 'Our Execution Matrix.',
          subtext: 'A connected system for moving from customer understanding to product clarity to launch-ready direction.',
          layers: []
        },
        schematic: {
          titleLine1: 'Strategic Vision. ',
          titleHighlight: 'Flawless Experience.',
          description: 'Your product strategy should connect user needs with execution realities.'
        }
      },

      capabilitiesTitle: "Our Capabilities.",
      capabilitiesDescription: "Kangqore's design enablement capabilities are structured to help enterprises build cohesive, flawless, and scalable digital experiences from the ground up.",
      capabilities: capabilities,

      trustPillars: [
        { title: 'Data-driven over opinion-led', tag: 'Intelligence', description: 'Transform qualitative and quantitative insights into hardened product strategy frameworks.' },
        { title: 'Flawless across every touchpoint', tag: 'Consistency', description: 'Ensure the user experience remains intuitively perfect across web, mobile, and emerging interfaces.' },
        { title: 'Built to scale effortlessly', tag: 'Architecture', description: 'Leverage robust design systems that allow component reuse and rapid UI evolution.' },
        { title: 'Validation before heavy engineering', tag: 'Prototyping', description: 'Test interactive, high-fidelity prototypes to confirm market resonance before writing code.' },
        { title: 'Aligned with business outcomes', tag: 'Strategy', description: 'Design decisions are tightly coupled with the core metrics that drive your business forward.' },
        { title: 'Accelerated time-to-value', tag: 'Velocity', description: 'Streamline the gap between concept and launch with optimized design-to-development workflows.' }
      ],

      whyKangqore: [
        { title: 'Integrated Strategic Design and Development', description: 'We connect product thinking, experience design, and delivery planning so decisions stay coherent from concept to execution.', icon: Layers },
        { title: 'Concierge Thinking, Scalable Delivery', description: 'You get high-touch collaboration with a model designed to support enterprise speed, consistency, and growth.', icon: Users },
        { title: 'Organizational Enablement', description: 'We work with your team, not around it — helping improve product thinking, design maturity, and internal capability through collaboration.', icon: TrendingUp }
      ],

      industriesTitle: 'Where Experience Strategy Adds Most Value',
      industriesDescription: 'Product Strategy & Design is relevant across new products, experience redesigns, and large-scale portfolios.',
      industries: [
        { name: 'New Digital Products', description: 'Define the right opportunity, validate direction, and shape a usable, differentiated first experience.' },
        { name: 'Product Modernization', description: 'Reimagine outdated product journeys, interface systems, and design logic for modern expectations.' },
        { name: 'Growth-Stage Product Scaling', description: 'Build reusable design foundations and sharper roadmap decisions as product complexity grows.' },
        { name: 'Enterprise Experience Transformation', description: 'Improve customer and internal digital experiences through stronger strategy, design governance, and adoption thinking.' },
        { name: 'Innovation Programs', description: 'Use rapid prototyping and research to test new ideas before full commitment.' },
        { name: 'Platform & Multi-Touchpoint Ecosystems', description: 'Create consistency across products, channels, and customer interaction layers.' }
      ],

      technologiesTitle: "Tools & Technologies for Strategic\u00A0Design.",
      technologiesDescription: "We leverage industry-leading design, prototyping, and research tools to execute high-fidelity product strategy and seamless engineering handoffs.",
      technologies: [
        { category: 'Strategy & Research', items: ['Qualitative & Quantitative Tools', 'Insight Synthesis', 'Market Analysis', 'Opportunity Mapping'] },
        { category: 'Design & Prototyping', items: ['Figma', 'Sketch', 'Rapid Prototyping', 'Concept Modeling'] },
        { category: 'Systems & Governance', items: ['Design Systems', 'Component Libraries', 'Standards', 'UI Governance'] },
        { category: 'Launch & Maturity', items: ['Launch Planning', 'Adoption Tracking', 'Product Maturity Assessment', 'Execution Review'] }
      ],

      customFAQs: [
        { question: "How are product strategy and experience design connected?", answer: "Product strategy defines what should be built, why it matters, and how it should create value. Experience design turns that direction into journeys, interactions, and product behavior users can actually understand and adopt." },
        { question: "What does Kangqore include in this service?", answer: "It can include product strategy, UX/UI design, design systems, rapid prototyping, launch readiness, product maturity assessments, and user and market research." },
        { question: "Do you only work on early-stage products?", answer: "No. This service is relevant across new products, growth-stage products, experience redesigns, modernization initiatives, and large-scale enterprise product portfolios." },
        { question: "Can you support both strategy and downstream execution?", answer: "Yes. The source page’s strongest idea is the connection between design and build; Kangqore keeps that same continuity and extends it into execution-ready delivery planning." },
        { question: "What is the role of research in this engagement?", answer: "Research helps validate assumptions, reveal customer needs, understand the market, and improve product decisions with stronger evidence." },
        { question: "What is a product digital maturity assessment?", answer: "It is a structured way to evaluate how well your teams execute across product, design, and technology — and where capability or process improvements can unlock better outcomes." },
        { question: "How does this help launch and adoption?", answer: "Because designing a product is not enough. Products need launch planning, user understanding, and adoption thinking to succeed in real-world environments." }
      ],

      preMatrixSection: preMatrixSection,

      postCapabilitiesSections: (
        <>
          {mvpCoESection}
          {journeyTimeline}
        </>
      ),
      postFAQSections: (
        <>
          {executionEcosystemSection}
        </>
      )
    },
    department
  };

  return (
    <div className="product-strategy-page-override">
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
        .stat-counter-text {
          font-variant-numeric: tabular-nums;
        }
        /* Ensure all major sections layer above the GSAP-pinned stepper */
        .product-strategy-page-override > div > section {
          position: relative;
          z-index: 5;
          background-color: inherit;
        }

          background-color: #0f172a !important;
          background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%) !important;
          position: relative;
          z-index: 10;
        }

          color: #ffffff !important;
        }

          background-color: rgba(255,255,255,0.1) !important;
        }

          color: #38bdf8 !important;
        }
      `}} />
      <ServicePageTemplate 
        service={pageData.service} 
        department={pageData.department}
      />
    </div>
  );
};

export default ProductStrategyExperienceDesign;
