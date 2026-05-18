// ─── Reimagine — 7 legacy service lifts (Phase C, KQ-SER-REIMAGINE-001) ────────
// Lifted from the legacy 15-dept tree per RESET DIRECTION 2026-05-18:
//   - application-modernization              (legacy digital-transformation-modernization/ApplicationModernization.jsx)
//   - digital-transformation                 (legacy digital-transformation-modernization/DigitalTransformation.jsx)
//   - legacy-modernization                   (legacy digital-transformation-modernization/LegacyModernization.jsx)
//   - technology-modernization               (legacy digital-transformation-modernization/TechnologyModernization.jsx)
//   - digital-business-transformation        (legacy digital-transformation-modernization/DigitalBusinessTransformation.jsx)
//   - mvp-acceleration                       (legacy digital-engineering/MVPAcceleration.jsx — GSAP/ScrollTrigger)
//   - product-strategy-experience-design     (legacy digital-engineering/ProductStrategyExperienceDesign.jsx — GSAP/ScrollTrigger)
//
// Locked rules applied:
//   - Content lifted verbatim; no fabrication
//   - Hardcoded legacy URLs rewritten to canonical /services/<slug>
//   - Stateful sections extracted as wrapper components below
//   - GSAP / ScrollTrigger animations isolated in wrappers using gsap.context()
//     scoped to a sectionRef, cleaned up via ctx.revert() — NOT the legacy global
//     ScrollTrigger.getAll().forEach(t => t.kill()) (which would tear down
//     animations on other pages during navigation)
//   - Canonical departmentSlug='reimagine' preserved via servicesData
// ────────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Brain, BrainCircuit, Building2,
  CheckCircle2, ChevronRight, Clock, Cloud, Code, Cpu, Database, Eye, Factory,
  Film, Fingerprint, Globe, Heart, Home, Layers, Layout, LayoutTemplate,
  Lightbulb, Lock, MessageSquare, MonitorSmartphone, Network, Plane,
  RefreshCw, Rocket, Search, Settings, Shield, ShieldCheck, ShoppingCart,
  Smartphone, Target, Terminal, TrendingUp, Users, Workflow, Zap,
} from 'lucide-react';

// gsap.registerPlugin is idempotent — safe at module load
gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPER COMPONENTS
//
// Each one owns its own state/refs/useEffect and is referenced from a service
// entry's customSections / preWhyKangqoreSections / postFAQSections etc.
// GSAP wrappers use gsap.context() so cleanup is scoped to the wrapper's
// sectionRef — they NEVER kill ScrollTriggers belonging to other pages.
// ═══════════════════════════════════════════════════════════════════════════════

// (1) Application Modernization — useState wrapper (6-item accordion)
const ApplicationModernizationOutcomeAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const outcomes = [
    { title: 'Modernized Infrastructure', content: 'Our application modernization services transform your existing IT infrastructure into a modern, efficient system. We ensure that your IT solutions are resilient, capable of withstanding any disruptions and maintaining business continuity.' },
    { title: 'Reduced technical complexity', content: 'We simplify your technical environment by reducing the complexity of your applications. This makes them easier to manage, maintain and update, saving you both time and resources.' },
    { title: 'High agility and scalability', content: 'Our modernized applications are designed to be agile and scalable. This means they can quickly adapt to changing business needs, allowing you to scale up or down as required.' },
    { title: 'Reduction in TCO', content: 'By modernizing your applications, we can help reduce your total cost of ownership. This includes savings on maintenance, hardware, software and labor costs.' },
    { title: 'Greater security', content: 'We place a high priority on security. Our application modernization services include advanced security measures to protect your sensitive data and systems from threats.' },
    { title: 'Future-ready architecture', content: 'We build systems with future-proof architectural patterns, ensuring your applications remain compatible with emerging technologies and industry standards for years to come.' },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-4">
            {outcomes.map((item, idx) => (
              <div key={idx} className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border transition-all duration-300 shadow-sm ${activeIndex === idx ? 'border-brand-blue ring-1 ring-brand-blue/10' : 'border-gray-100'}`}>
                <button onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)} className="w-full px-8 py-6 text-left flex items-center justify-between group">
                  <span className={`text-xl font-bold transition-colors ${activeIndex === idx ? 'text-brand-blue' : 'text-gray-900 dark:text-white'}`}>{item.title}</span>
                  <div className={`p-1 rounded-lg transition-all ${activeIndex === idx ? 'bg-brand-blue text-white' : 'bg-gray-50 dark:bg-[#050505] text-gray-400 group-hover:text-brand-blue'}`}>
                    {activeIndex === idx ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    )}
                  </div>
                </button>
                {activeIndex === idx && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="relative group">
            <div className="relative z-10 group-hover:scale-105 transition-transform duration-500">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[4/5] bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200" alt="Modernization Strategy" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-10 left-10 p-8 bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-xl border border-white/20 rounded-3xl">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center text-xl font-bold">UX</div>
                    <div>
                      <div className="text-sm font-bold tracking-widest uppercase opacity-60">Modern Interface</div>
                      <div className="text-xl font-bold">System-Wide Clarity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// (2) MVP Acceleration — GSAP wrapper with scoped gsap.context() cleanup
//
// Holds 5 refs (process, leftCol, diamond, differentiator, journey) for
// 4 distinct animations: diamond entrance+parallax, differentiator stagger,
// process stepper pin (lg+), and journey timeline path-draw with scrub.
// Counter animation scoped to sectionRef. Cleanup via ctx.revert() —
// NEVER ScrollTrigger.getAll().kill().
const MVPAccelerationAnimatedSections = () => {
  const sectionRef = useRef(null);
  const processRef = useRef(null);
  const leftColRef = useRef(null);
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation — scoped within sectionRef
      const statElements = sectionRef.current
        ? sectionRef.current.querySelectorAll('.stat-counter-text')
        : [];
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) {
          const targetNum = parseInt(match[1], 10);
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => { el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`); },
              });
            },
          });
        }
      });

      // Diamond entrance + parallax scrub
      if (diamondRef.current) {
        gsap.fromTo(diamondRef.current,
          { opacity: 0, scale: 0.8, y: 60 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true },
          });
        gsap.to(diamondRef.current, {
          y: -30, ease: 'none',
          scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }

      // Differentiator staggered entrance
      if (differentiatorRef.current) {
        const items = differentiatorRef.current.querySelectorAll('.diff-item');
        gsap.fromTo(items,
          { opacity: 0, y: 30, x: -20 },
          { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true },
          });
      }

      // Process stepper pin (lg+ only via matchMedia)
      if (processRef.current && leftColRef.current) {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px)', () => {
          ScrollTrigger.create({
            trigger: processRef.current, start: 'top top', end: 'bottom bottom',
            pin: leftColRef.current, pinSpacing: false, scrub: 1,
          });
          gsap.fromTo(processRef.current.querySelectorAll('.stepper-node'),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, force3D: true,
              scrollTrigger: { trigger: processRef.current, start: 'top 60%', once: true },
            });
          gsap.fromTo(processRef.current.querySelectorAll('.stepper-content'),
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, force3D: true,
              scrollTrigger: { trigger: processRef.current, start: 'top 60%', once: true },
            });
        });
      }

      // Journey timeline — animated path draw + node reveals
      if (journeyRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
        });
        const pathEl = journeyRef.current.querySelector('.journey-curve-path');
        if (pathEl) {
          const pathLength = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
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
        gsap.fromTo(cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true },
          });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const processSteps = [
    { title: 'STEP 01: Discovery', points: ['Understanding the business vision, user problem, market context, and commercial intent behind the product idea.', 'Map the competitive landscape and identify unique opportunity levers.'] },
    { title: 'STEP 02: Idea Validation', points: ['Validating whether the concept solves a meaningful problem, has market relevance, and deserves focused MVP investment.', 'Test assumptions through structured feasibility and desirability analysis.'] },
    { title: 'STEP 03: MVP Scoping', points: ['Defining the leanest, highest-value first release by separating must-have capabilities from later-phase enhancements.', 'Align MVP scope with business goals and user priorities.'] },
    { title: 'STEP 04: Business Analysis', points: ['Translating product intent into structured requirements, workflows, use cases, and delivery-aligned clarity.', 'Engineer a structured requirements backlog for the functional perimeter.'] },
    { title: 'STEP 05: Product Design', points: ['Shaping intuitive user journeys, UX direction, and core interface logic so the MVP feels usable and credible.', 'Architect high-fidelity wireframes that serve as a functional skeleton.'] },
    { title: 'STEP 06: Agile Development', points: ['Building in fast, iterative cycles using a lean engineering model optimized for speed and controlled delivery.', 'Sprint-based execution with continuous integration and quality checks.'] },
    { title: 'STEP 07: Iterative Shipping', points: ['Releasing in measured increments, reducing launch friction while enabling early signals and quicker learning.', 'Deploy fast, learn faster, and course-correct in real time.'] },
    { title: 'STEP 08: User Feedback Integration', points: ['Capturing real user input and behavioral signals to improve product relevance and sharpen the next decisions.', 'Structured feedback loops that turn raw data into actionable insight.'] },
    { title: 'STEP 09: Pivoting Strategy', points: ['Refining scope or reshaping priorities without losing momentum when feedback reveals a better direction.', 'Data-informed pivots that protect investment while opening new opportunity.'] },
    { title: 'STEP 10: Continuous Delivery', points: ['Establishing a delivery rhythm that keeps the product evolving through structured, scale-ready releases.', 'From MVP to mature product through governed, incremental growth.'] },
  ];

  const whatYouGetCards = [
    { title: 'First-100 User Focus', desc: 'Build with adoption in mind and create the conditions for meaningful early traction.', icon: <Users /> },
    { title: 'Relevant Product Data', desc: 'Use real feedback and real signals to shape what evolves next.', icon: <BarChart3 /> },
    { title: 'Dedicated Project Team', desc: 'Work with a curated agile squad aligned to your product stage and ambition.', icon: <Shield /> },
    { title: 'Scalable Design System', desc: 'Create UI consistency and product coherence across devices and future releases.', icon: <LayoutTemplate /> },
    { title: 'Universal Codebase', desc: 'Reduce technical complexity and speed up multi-platform execution.', icon: <MonitorSmartphone /> },
    { title: 'Scalable Architecture', desc: 'Lay a future-ready technical foundation that can grow with product demand.', icon: <Layers /> },
  ];

  const journeyPhases = [
    { phase: 'IDEA', icon: <Lightbulb className="w-7 h-7" />, title: 'Concept Spark', desc: 'Raw idea, business hypothesis, or innovation opportunity.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
    { phase: 'VALIDATE', icon: <Search className="w-7 h-7" />, title: 'Discovery & Validation', desc: 'Market analysis, user research, and feasibility testing.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
    { phase: 'BUILD', icon: <Cpu className="w-7 h-7" />, title: 'MVP Engineering', desc: 'Agile sprints, lean scoping, and iterative shipping.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
    { phase: 'LAUNCH', icon: <Rocket className="w-7 h-7" />, title: 'Market Entry', desc: 'First 100 users, feedback loops, and product-market signals.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true },
    { phase: 'SCALE', icon: <TrendingUp className="w-7 h-7" />, title: 'Growth & Evolution', desc: 'Platform scaling, feature expansion, and enterprise readiness.', gradient: 'from-purple-500 to-purple-700', ring: 'border-purple-400', glow: 'shadow-purple-500/40' },
  ];

  return (
    <div ref={sectionRef} className="mvp-acceleration-page-override">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes diamond-float-3d { 0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); } 50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); } }
        @keyframes connector-draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        @keyframes dot-ping { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(3); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
        .stat-counter-text { font-variant-numeric: tabular-nums; }
      ` }} />

      {/* Process Stepper Section (pinned on lg+) */}
      <section className="py-24 bg-white dark:bg-black relative z-[1]" ref={processRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            <div className="lg:w-[45%] h-full bg-white dark:bg-black" ref={leftColRef} style={{ zIndex: 1 }}>
              <div className="space-y-12">
                <div>
                  <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
                    Accelerated Execution: <br />
                    <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">10-Step MVP Engine.</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" alt="MVP Process" className="relative z-10 rounded-[2rem] shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 aspect-[4/3] object-cover" />
                </div>
              </div>
            </div>
            <div className="lg:w-[50%] relative py-12">
              <div className="absolute left-1 top-2 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] z-0"></div>
              <div className="space-y-24">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="relative pl-12 group">
                    <div className="stepper-node absolute left-0 top-1.5 w-3 h-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-2 border-brand-blue rounded-full z-10 transition-transform duration-300 group-hover:scale-125"></div>
                    <div className="stepper-content">
                      <h4 className="text-[17px] lg:text-[18px] font-bold text-brand-blue mb-6 tracking-wide uppercase font-display">{step.title}</h4>
                      <div className="space-y-4">
                        {step.points.map((p, pIdx) => (
                          <p key={pIdx} className="text-gray-500 text-[15px] lg:text-[16px] leading-relaxed font-light">{p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MVP CoE Section — 3D Diamond + Differentiators */}
      <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
            <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
              <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
                <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                  Our <strong className="text-brand-blue">MVP Acceleration CoE</strong> provides a high-velocity execution blueprint, surrounding your product idea with four critical delivery layers.
                </p>
                <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We replace &ldquo;build-and-hope&rdquo; with &ldquo;validate-and-accelerate.&rdquo; By unifying lean discovery, rapid engineering, strategic validation, and scalable growth thinking, we ensure your MVP is built on a foundation of confidence rather than a collection of guesses.
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
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Lean<br/>Discovery</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Rapid<br/>Engineering</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Strategic<br/>Validation</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Scalable<br/>Growth</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                      <li>Vision & opportunity alignment •</li>
                      <li>Market-fit feasibility •</li>
                      <li>Idea validation & scoping •</li>
                      <li>Business model analysis •</li>
                    </ul>
                  </div>
                  <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                      <li>• Agile sprint execution</li>
                      <li>• Cross-platform codebase</li>
                      <li>• CI/CD pipeline setup</li>
                      <li>• Iterative shipping cycles</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                      <li>User feedback integration •</li>
                      <li>Product-market fit signals •</li>
                      <li>Pivot strategy readiness •</li>
                      <li>Data-driven decisions •</li>
                    </ul>
                  </div>
                  <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                      <li>• Scalable architecture design</li>
                      <li>• Design system consistency</li>
                      <li>• Performance optimization</li>
                      <li>• Growth-ready infrastructure</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {[
                  { title: 'Lean Discovery', items: ['Vision alignment', 'Market-fit'], gradient: 'from-blue-600 to-blue-800' },
                  { title: 'Rapid Engineering', items: ['Agile sprints', 'CI/CD'], gradient: 'from-blue-400 to-blue-600' },
                  { title: 'Strategic Validation', items: ['User feedback', 'Pivot readiness'], gradient: 'from-blue-900 to-slate-900' },
                  { title: 'Scalable Growth', items: ['Architecture', 'Performance'], gradient: 'from-cyan-500 to-cyan-700' },
                ].map((q, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                    <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={differentiatorRef} className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {[
                { num: 1, title: 'Validation-First Engineering', text: "We don't just build fast—we build what matters. Every feature is validated against real user signals before heavy investment." },
                { num: 2, title: 'Launch-Critical Focus', text: 'We separate must-have from nice-to-have rigorously, so your MVP ships with only what creates traction—nothing more, nothing less.' },
                { num: 3, title: 'Scalable From Day One', text: 'Even for lean MVPs, we define a technical path that allows room for enterprise-scale growth and future platform extensions.' },
                { num: 4, title: 'Investor-Ready Output', text: 'Our MVPs are built to demonstrate demand, direction, and execution quality—creating stronger credibility for funding conversations.' },
                { num: 5, title: 'Continuous Learning Engine', text: 'We embed feedback loops, usage analytics, and iteration frameworks directly into the delivery process—so the product improves with every cycle.' },
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

      {/* What You Get */}
      <section className="py-32 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-left mb-20">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              What You <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Get.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-500 font-light max-w-3xl">
              A comprehensive suite of solutions aligned with our MVP Acceleration delivery engine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whatYouGetCards.map((card, i) => (
              <div key={i} className="p-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gray-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{card.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
            <div className="w-full lg:w-[55%] relative">
              <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px]" style={{ zIndex: 1 }}>
                <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="mvp-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="mvp-journey-glow-v">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <path className="journey-curve-glow" d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000" stroke="url(#mvp-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#mvp-journey-glow-v)" opacity="0.3" />
                  <path className="journey-curve-path" d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000" stroke="url(#mvp-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[100, 300, 500, 700, 900].map((cy, i) => (
                    <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#mvp-journey-grad-v)" strokeWidth="0.8" opacity="0.2">
                        <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                      <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#mvp-journey-grad-v)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#mvp-journey-grad-v)" opacity="0.7">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="space-y-6 lg:pl-[55px]">
                {journeyPhases.map((item, idx) => (
                  <div key={idx} className="journey-card group" style={{ perspective: '800px' }}>
                    <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`}></div>
                      <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.glow} group-hover:scale-110 transition-all duration-500`}>
                        {item.icon}
                        <div className={`absolute inset-0 rounded-2xl border-2 ${item.ring} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`}></div>
                      </div>
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
              <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px">
                <div className="w-full h-full bg-gradient-to-b from-slate-600 via-brand-blue to-purple-500 opacity-20 rounded-full"></div>
              </div>
            </div>

            <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                    <Rocket className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Your MVP Journey</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                    From Idea to <br />
                    <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Market Leader.</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                  <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                    A clear, structured path that takes your concept through validation, launch, and growth — with Kangqore engineering every step.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                  <div>
                    <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">05</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Timeline</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">10-16<span className="text-sm text-gray-400 ml-1">wks</span></div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Kangqore</div>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">3/5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// (3) Product Strategy & Experience Design — GSAP wrapper with scoped gsap.context() cleanup
// (inserted by subsequent edit)

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE ENTRIES (7)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. application-modernization ─────────────────────────────────────────────

const applicationModernizationCustomSections = (
  <>
    {/* Overcoming Performance Hurdles */}
    <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-t border-gray-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-blue-100">Efficiency Maximization</div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
            Overcoming Performance <span className="text-transparent bg-clip-text bg-brand-gradient italic">Hurdles</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            We eliminate the friction points in legacy applications, transforming bottlenecks into engines of engineering velocity.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { title: 'High Cost of Ownership', icon: <Database className="w-8 h-8" />, description: "Our application modernization services help lower your applications' total cost of ownership through features like efficient resource management, process automation and modern, cost-effective technologies. This results in significant cost savings and better resource allocation.", pill: 'Efficiency', color: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-100' },
            { title: 'Technical Debt', icon: <Shield className="w-8 h-8" />, description: 'We aim to reduce technical debt with features such as legacy code analysis, code optimization and system upgrades. Our services replace or update outdated code and systems, significantly improving application performance and maintainability.', pill: 'Integrity', color: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-100' },
            { title: 'Slow Evolution', icon: <RefreshCw className="w-8 h-8" />, description: 'Our application modernization services enable faster evolution of your applications. Features like agile development practices, technology upgrades and flexible architecture help your applications keep up with changing business needs and technology trends, ensuring your competitiveness.', pill: 'Velocity', color: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-100' },
          ].map((hurdle, idx) => (
            <div key={idx} className={`relative p-10 bg-white dark:bg-gray-900 dark:border-gray-800 border ${hurdle.border} rounded-[2.5rem] group hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-500 shadow-sm`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${hurdle.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]`}></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-white transition-all duration-500 shadow-sm">
                  {hurdle.icon}
                </div>
                <div className="inline-flex px-3 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-gray-100 group-hover:text-brand-blue group-hover:border-blue-200 transition-all">
                  {hurdle.pill}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-brand-blue transition-colors">{hurdle.title}</h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 dark:text-gray-400 transition-colors">{hurdle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Strategic Synergies — Refactoring Pipeline Schematic */}
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">Related Capabilities</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Strategic Digital <span className="text-transparent bg-clip-text bg-brand-gradient">Synergies</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Modernization is the catalyst. Integrate these core capabilities to accelerate your global digital dominance.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Cloud Transformation', link: '/services/managed-cloud-services', icon: <Cloud className="w-5 h-5" />, desc: 'Accelerate cloud adoption with optimized migration and cloud-native design.' },
                // NOTE: legacy slug "mobility-solutions" not canonical; mapped to product-digital-engineering (closest semantic match)
                { name: 'Mobility Solutions', link: '/services/product-digital-engineering', icon: <Smartphone className="w-5 h-5" />, desc: 'Enable mobile-first ecosystems that improve engagement and productivity.' },
                { name: 'Software Development', link: '/services/software-development', icon: <Cpu className="w-5 h-5" />, desc: 'End-to-end custom software engineering with architecture-first discipline.' },
                // NOTE: legacy slug "enterprise-modernization-strategy" not canonical; mapped to legacy-modernization (closest semantic match)
                { name: 'Enterprise Strategy', link: '/services/legacy-modernization', icon: <Workflow className="w-5 h-5" />, desc: 'Comprehensive digital transformation frameworks for scalable growth.' },
              ].map((offering, idx) => (
                <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Link to="/services" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
                View Portfolio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">// SYSTEM_UPGRADE_ACTIVE...</div>
            </div>
          </div>
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>PIPELINE:</span> <span className="text-brand-blue">#MOD_7R</span></div>
                <div className="flex justify-between gap-4"><span>MODE:</span> <span>RE_ARCHITECT</span></div>
                <div className="flex justify-between gap-4"><span>LOAD:</span> <span className="text-emerald-500">STABLE</span></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                  <RefreshCw className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:rotate-180 transition-transform duration-1000" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-45 transition-transform">
                  <Database className="w-7 h-7" />
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:rotate-12 transition-transform duration-500">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Cloud className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Migration</span>
                </div>
              </div>
              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-500">
                    <Smartphone className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">UX</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Experience</span>
                </div>
              </div>
              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <Database className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data Fabric</span>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="am-mod-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#am-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#am-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#am-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const applicationModernization = {
  titleLine1: 'Application',
  titleHighlight: 'Modernization.',
  description: 'MODERNIZE. SCALE. SHIP.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Modernize Faster. Stay Resilient. Ship What&rsquo;s Next.</h2>
      <p>Legacy systems shouldn&rsquo;t slow growth. Kangqore modernizes applications with zero-disruption strategies, cloud-native engineering, and security-first architecture — improving performance, reducing TCO, and enabling rapid product evolution.</p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  imageClassName: 'aspect-[4/5]',
  fullWidthCustomOverview: true,
  primaryButton: { text: 'Request Modernization Assessment', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Zero', label: 'Disruption Risk', color: 'text-cyan-400' },
    { value: 'Accelerated', label: 'Release Velocity', color: 'text-blue-400' },
    { value: 'Reduced', label: 'Total Cost of Ownership', color: 'text-purple-400' },
    { value: 'Cloud-Native', label: 'Architecture Ready', color: 'text-orange-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'ENGINEERING VELOCITY :: 2026',
      titleLine1: 'Modernize Faster.',
      titleHighlight: 'Stay Resilient.',
      titleLine2: 'Ship What&rsquo;s Next.',
      description: 'Modernization isn&rsquo;t just "moving to cloud." It&rsquo;s removing the friction that blocks velocity. Kangqore helps teams transition from legacy complexity to modern capability through a structured modernization approach aligned to business outcomes, not just technology refresh.',
      bottleneckLabel: 'The Reality',
      bottleneckText: 'Monolith bottlenecks & fragile deployments.',
      requirementLabel: 'The Mandate',
      requirementText: 'Zero-disruption transformation at speed.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
      statusLabel: 'Engineering State',
      statusValue: 'CLOUD_NATIVE',
    },
    philosophy: {
      icon: <Zap className="w-7 h-7 text-brand-blue" />,
      title: 'Application',
      titleHighlight: 'Evolution.',
      description: 'We approach modernization as a continuous evolution, integrating cloud-native engineering and automated validation into a structured transformation pipeline.',
      pills: ['Zero Disruption', 'API-First', 'DevSecOps', 'Cloud-Native'],
    },
    matrix: {
      engineId: 'Engine :: Mod_Enablement_V1',
      title: 'Modernization Enablement Model',
      subtext: 'A structured methodology that moves your organization from legacy technical debt to optimized engineering velocity.',
      layers: [
        { title: 'Assess', id: 'MOD_ASSESS', icon: <Search />, desc: 'Discovery, assessment, and strategic alignment of legacy assets.' },
        { title: 'Architect', id: 'MOD_ARC', icon: <Layers />, desc: 'Design resilient blueprints including microservices and serverless models.' },
        { title: 'Transform', id: 'MOD_BUILD', icon: <Activity />, desc: 'Structured migration, re-engineering, and platform uplift.' },
        { title: 'Validate', id: 'MOD_VAL', icon: <ShieldCheck />, desc: 'Continuous testing, integrity checks, and user validation.' },
        { title: 'Operate', id: 'MOD_GO', icon: <Zap />, desc: 'Continuous optimization and scaled agile operations.' },
      ],
    },
    schematic: {
      titleLine1: 'Modern Markets.',
      titleHighlight: 'Demand Speed.',
      description: 'Your modernization investment should generate compounding business returns. We engineer the delivery frameworks that make it measurable and sustained.',
      stats: [
        { label: 'Quality', val: 'ABSOLUTE' },
        { label: 'Speed', val: 'ACCELERATED' },
        { label: 'Cost', val: 'REDUCED' },
      ],
    },
  },

  technologies: [
    { category: 'Frontend Stacks', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5/CSS3'] },
    { category: 'Backend Systems', items: ['.NET Cloud', 'Spring Boot (Java)', 'Node.js', 'Python/FastAPI', 'Golang', 'PHP/Laravel'] },
    { category: 'Mobile & PWA', items: ['iOS Swift', 'Android Kotlin', 'React Native', 'Flutter', 'PWA Lifecycle', 'Xamarin'] },
    { category: 'Cloud Infrastructure', items: ['AWS Modernization', 'Azure Replatforming', 'Google Cloud (GCP)', 'Serverless', 'Lambda'] },
    { category: 'Databases & Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Amazon RDS', 'CosmosDB', 'Cassandra'] },
    { category: 'DevOps & Tooling', items: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Jenkins', 'Ansible'] },
  ],

  capabilities: [
    { title: 'Legacy Application Assessment & Consulting', bgImage: '/images/capabilities/software-engineering.png', description: 'We start by deeply analyzing your legacy systems — evaluating code quality, architecture, dependencies, and integration touchpoints. Our experts help you uncover hidden risks, identify quick wins, and define a modernization roadmap aligned with your business objectives.', items: ['Comprehensive Code & Architecture Audit', 'Technical Debt & Risk Quantification', 'Modernization Roadmap & Strategy', 'ROI & Business Case Modeling'] },
    { title: 'Cloud Migration Services', bgImage: '/images/capabilities/cloud-infrastructure.png', description: 'Harness the power of the cloud with our comprehensive migration services. We facilitate a seamless and secure transition of your applications to the cloud, enhancing scalability, performance and efficiency while reducing operational costs.', items: ['Secure Application Cloud Transition', 'Infrastructure as Code (IaC) Implementation', 'Cloud-Native Performance Optimization', 'Operational Cost Reduction Strategies'] },
    { title: 'Application Reengineering', bgImage: '/images/capabilities/software-engineering.png', description: 'When legacy systems are too outdated to deliver modern capabilities, we help you rebuild them from the ground up using cloud-native technologies, modern frameworks, and modular, future-ready architecture.', items: ['Ground-up Cloud-Native Rebuilds', 'Modular & Scalable Architecture Design', 'Legacy Core System Stabilization', 'Future-ready Tech Stack Adoption'] },
    { title: 'Application Containerization', bgImage: '/images/capabilities/ai-cognitive.png', description: 'We leverage cutting-edge containerization technologies to boost the portability, scalability and manageability of your applications, promoting efficiency and flexibility across your IT infrastructure.', items: ['Docker & Kubernetes (K8s) Orchestration', 'Micro-segmentation & Scaling Strategy', 'CI/CD Pipeline Integration', 'Portable Infrastructure Frameworks'] },
    { title: 'Data Migration Services', bgImage: '/images/capabilities/data-analytics.png', description: 'We ensure a secure, seamless migration of your data during the modernization process, preserving its integrity and accessibility. Our data migration services prioritize data security, accuracy and minimal downtime.', items: ['High-Integrity Data Extraction & Load', 'Security-First Migration Protocols', 'Minimal Downtime Migration Execution', 'Data Validation & Integrity Checks'] },
    { title: 'Middleware & Database Modernization', bgImage: '/images/capabilities/data-analytics.png', description: 'We help you modernize outdated middleware platforms and legacy databases — migrating to scalable, cloud-compatible alternatives like PostgreSQL, MongoDB, or Amazon RDS for better performance and reduced maintenance.', items: ['Relational-to-NoSQL Transformation', 'Cloud-Native Database Re-platforming', 'Middleware Efficiency & Integration', 'Query Performance Tuning & Optimization'] },
    { title: 'Application Replatforming', bgImage: '/images/capabilities/software-engineering.png', description: 'Move legacy applications to a modern runtime environment — optimizing databases, updating middleware, or transitioning to managed cloud services while boosting performance and resilience.', items: ['Runtime Environment Modernization', 'Managed Cloud Service Transition', 'Resilience & Availability Uplift', 'Core Functionality Integrity Checks'] },
    { title: 'UI/UX Modernization', bgImage: '/images/capabilities/ux-design.png', description: 'Redesign legacy user interfaces using responsive frameworks (React, Angular, Vue) with a focus on accessibility, usability, and brand alignment through user journey mapping and A/B testing.', items: ['Responsive Web & Mobile Redesign', 'Accessibility (WCAG) Compliance', 'User Journey & Persona Mapping', 'High-Performance UI Engineering'] },
    { title: 'Application Refactoring & Re-Architecting', bgImage: '/images/capabilities/software-engineering.png', description: 'Deconstruct monolithic architectures into loosely coupled microservices, implement API-first strategies, and embed DevOps pipelines to enable faster deployments and independent scaling.', items: ['Monolith-to-Microservices Decomposition', 'API-First Strategy & Design', 'DevOps & Pipeline Automation', 'Independent Component Scaling'] },
  ],

  trustPillars: [
    { title: 'Proven Legacy Transformation', tag: 'Experience', description: 'From monolith stabilization to cloud-native redesign — we modernize mission-critical systems without breaking operations. Learn More →' },
    { title: 'Full-Spectrum Capabilities', tag: 'Versatility', description: 'Rehost, refactor, replatform, re-architect, rebuild — we pick the right path for your business constraints and timeline. Learn More →' },
    { title: 'Engineering-First Execution', tag: 'Rigorous', description: 'Architecture discipline + delivery rigor + automation-first mindset — ensuring measurable outcomes instead of slideware. Learn More →' },
    { title: 'Cloud + DevOps + Security', tag: 'Integrated', description: 'Modernization is incomplete without pipeline maturity and security posture. We bake in DevSecOps by default. Learn More →' },
  ],
  trustPillarsRightTitle: 'Engineering the Future of Applications',
  trustPillarsRightDescription: 'Modern markets reward speed, resilience, and experience. Kangqore helps enterprises transition from legacy technical debt to cohesive, modern application architectures that enable faster releases, reduced cost, and stronger security.',
  trustPillarsRightButton: 'Request Assessment',

  whyKangqoreIntro: 'Modernization is a journey of removing friction. Kangqore helps enterprises transition from fragmented legacy systems to cohesive, modern application architectures without breaking operations.',
  whyKangqore: [
    { title: 'Proven Transformation', description: 'From monolith stabilization to cloud-native redesign — we modernize mission-critical systems safely.' },
    { title: 'Full-Spectrum Paths', description: 'Rehost, refactor, replatform, re-architect, rebuild — we pick the right path for your constraints.' },
    { title: 'Engineering Rigor', description: 'Architecture discipline + delivery rigor + automation-first mindset — ensuring measurable ROI.' },
    { title: 'Security-First', description: 'Modernization is incomplete without pipeline maturity. We bake in DevSecOps by default.' },
    { title: 'Zero-Disruption Strategy', description: 'Blue/green, canary, and strangler patterns to modernize while staying live and operational.' },
    { title: 'Outcome-Led Roadmaps', description: 'Performance, scalability, and TCO benchmarks tracked through granular modernisation KPIs.' },
  ],

  industries: [
    { name: 'Healthcare & Life Sciences' }, { name: 'Banking & Financial Services' }, { name: 'Real Estate & Infrastructure' },
    { name: 'Travel & Transportation' }, { name: 'Retail & eCommerce' }, { name: 'Food & Beverage' },
    { name: 'Media & Entertainment' }, { name: 'Software & Technology' },
  ],

  customFAQs: [
    { question: 'How will application modernization impact my existing IT infrastructure?', answer: 'We modernize in phases to avoid disruption — integrating new components with your current setup, validating performance, and rolling out safely through controlled releases such as blue/green or canary deployments.' },
    { question: 'Will modernization cause data loss?', answer: 'No. We use rigorous migration validation, backup strategies, integrity checks, and rollback planning to protect business-critical data throughout the transformation lifecycle.' },
    { question: 'How do you ensure security during modernization?', answer: 'Security is embedded from day one — including DevSecOps pipelines, identity-first access controls, cloud posture management, and continuous vulnerability scanning.' },
    { question: 'How long does modernization take?', answer: 'Timelines depend on scope and complexity. We start with a 6R assessment and define a phased roadmap with clear milestones that deliver measurable business value early in the process.' },
  ],

  postIndustrySections: applicationModernizationCustomSections,
  postFAQSections: <ApplicationModernizationOutcomeAccordion />,

  ctaTitle: 'Modernize Without Slowing Down',
  ctaDescription: 'Kangqore helps you modernize applications with confidence. Let&rsquo;s design your high-velocity engineering future.',
  ctaButtonText: 'Book a Modernization Strategy Session',
};

// ─── 2. digital-transformation ────────────────────────────────────────────────

// Custom 3D animation styles injected with the section JSX
const digitalTransformationAnimationStyles = `
  @keyframes portal-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }
  @keyframes orbit-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes counter-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  @keyframes float-3d {
    0%, 100% { transform: translateZ(20px) translateY(0); }
    50% { transform: translateZ(50px) translateY(-10px); }
  }
  .perspective-2000 { perspective: 2000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .animate-portal { animation: portal-pulse 4s ease-in-out infinite; }
  .animate-orbit { animation: orbit-slow 20s linear infinite; }
  .animate-counter-rotate { animation: counter-rotate 20s linear infinite; }
  .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
`;

const digitalTransformationCustomSections = (
  <>
    {/* Strategic Mandate */}
    <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-t border-gray-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-blue-100">Strategic Mandate</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display">
              The Mandate Has <span className="text-transparent bg-clip-text bg-brand-gradient italic">Shifted</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Markets have moved from product-centric to platform-centric — and now to experience-centric. Legacy systems and siloed data prevent organizations from moving at digital speed.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {['Operate in real-time', 'Deliver hyper-personalized experiences', 'Scale without proportional cost', 'Leverage data as a strategic asset', 'Integrate AI across core operations'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-blue flex-shrink-0">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-3xl border border-gray-100 italic text-gray-600 dark:text-gray-400 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient"></div>
              &ldquo;Kangqore transforms complexity into capability, unlocking digital capital that goes beyond mere modernization.&rdquo;
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" alt="Enterprise Digital Transformation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold opacity-60 tracking-widest uppercase">Global Operations</div>
                    <div className="text-lg font-bold">Real-time Enterprise Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Kangqore Delivery Approach */}
    <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 overflow-hidden relative border-t border-gray-100">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
            The Kangqore <span className="text-transparent bg-clip-text bg-brand-gradient">Delivery Approach</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A structured, insight-led way to take initiatives from strategy to measurable outcomes.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { title: 'WHY — Outcomes First', icon: <Target className="w-8 h-8" />, items: ['Revenue growth', 'Margin improvement', 'Cost reduction', 'Risk reduction'], color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'WHAT — Value Streams', icon: <PieChart className="w-8 h-8" />, items: ['Customer experience', 'Operations', 'Data/AI', 'Platforms', 'Security'], color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'HOW — Engineering Execution', icon: <Workflow className="w-8 h-8" />, items: ['Product engineering', 'Cloud/DevOps', 'DevSecOps', 'QA automation', 'Observability'], color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((pillar, idx) => (
            <div key={idx} className="p-10 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-[2.5rem] group hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
              <div className={`w-16 h-16 ${pillar.bg} ${pillar.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">{pillar.title}</h3>
              <ul className="space-y-4">
                {pillar.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className={`w-1.5 h-1.5 rounded-full ${pillar.color.replace('text', 'bg')}`}></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gradient text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
            RESULT: Faster releases • Lower incidents • Better UX • Lower TCO
          </div>
        </div>
      </div>
    </section>

    {/* Visual Model: Transformation Pillars */}
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: digitalTransformationAnimationStyles }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Transformation Pillars</h2>
            <div className="space-y-6">
              {[
                { title: 'Innovation Acceleration', desc: 'AI-led business model innovation and data monetization strategies.', color: 'border-emerald-500', icon: '🟢', lightBg: 'bg-emerald-50' },
                { title: 'Informed Decision Systems', desc: 'Real-time analytics and predictive intelligence with embedded AI insights.', color: 'border-blue-500', icon: '🔵', lightBg: 'bg-blue-50' },
                { title: 'Cost & Efficiency Optimization', desc: 'Cloud enablement and automation-first operating models.', color: 'border-yellow-500', icon: '🟡', lightBg: 'bg-yellow-50' },
                { title: 'Workforce & Experience Enablement', desc: 'Digital sales enablement and connected, knowledge-driven operations.', color: 'border-purple-500', icon: '🟣', lightBg: 'bg-purple-50' },
              ].map((pillar, idx) => (
                <div key={idx} className={`p-6 ${pillar.lightBg} rounded-3xl border-l-4 ${pillar.color} hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{pillar.icon}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{pillar.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative flex items-center justify-center perspective-2000 group">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2564ea 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
            <div className="relative w-full aspect-square max-w-[450px] preserve-3d animate-float-3d">
              <div className="absolute inset-4 border border-blue-200/50 rounded-full"></div>
              <div className="absolute inset-16 border border-dashed border-blue-100/30 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 preserve-3d z-20">
                <div className="absolute inset-0 bg-brand-gradient rounded-full opacity-20 blur-2xl animate-portal"></div>
                <div className="absolute inset-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-xl border border-blue-50 flex flex-col items-center justify-center text-center p-8 preserve-3d overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
                  <div className="w-16 h-1 bg-brand-gradient rounded-full mb-4"></div>
                  <div className="text-brand-blue font-black text-xl leading-tight uppercase tracking-tighter max-w-[120px]">AI-Native Modernization</div>
                  <div className="mt-4 flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-200 rounded-full"></div>)}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 animate-orbit preserve-3d">
                {[
                  { angle: '0deg', bg: 'bg-emerald-500', icon: <TrendingUp className="text-white w-6 h-6" />, label: 'Growth' },
                  { angle: '90deg', bg: 'bg-blue-500', icon: <PieChart className="text-white w-6 h-6" />, label: 'Insights' },
                  { angle: '180deg', bg: 'bg-yellow-500', icon: <Cpu className="text-white w-6 h-6" />, label: 'compute' },
                  { angle: '270deg', bg: 'bg-purple-500', icon: <Users className="text-white w-6 h-6" />, label: 'Users' },
                ].map((sat, i) => (
                  <div key={i} className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 preserve-3d" style={{ transform: `rotate(${sat.angle}) translateX(180px) rotate(-${sat.angle})` }}>
                    <div className="animate-counter-rotate preserve-3d">
                      <div className={`w-16 h-16 ${sat.bg} rounded-2xl shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 relative z-30`}>
                        {sat.icon}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {sat.label}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/10 blur-xl translate-y-4 translate-z-[-20px] rounded-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 500">
                <circle cx="250" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" className="text-blue-500" />
                <line x1="250" y1="70" x2="250" y2="430" stroke="currentColor" strokeWidth="0.5" className="text-blue-200" />
                <line x1="70" y1="250" x2="430" y2="250" stroke="currentColor" strokeWidth="0.5" className="text-blue-200" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Strategic Digital Synergies */}
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">Enterprise Synergies</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Strategic Digital <span className="text-transparent bg-clip-text bg-brand-gradient">Synergies</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Transformation is the catalyst. Integrate these core capabilities to accelerate your global digital dominance.
            </p>
            <div className="space-y-4">
              {[
                { name: 'GenAI & Autonomous Systems', link: '/services/agentic-ai', icon: <Cpu className="w-5 h-5" />, desc: 'Enterprise-grade generative AI, agentic workflows, and AI governance frameworks.' },
                { name: 'Agentic AI Orchestration', link: '/services/agentic-ai', icon: <Network className="w-5 h-5" />, desc: 'Deploy AI agents across enterprise workflows to automate and scale operations.' },
                { name: 'Application Modernization', link: '/services/application-modernization', icon: <RefreshCw className="w-5 h-5" />, desc: 'Re-architect enterprise systems into modular, cloud-native architectures.' },
              ].map((offering, idx) => (
                <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative perspective-2000 group">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2564ea 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
            <div className="relative z-10 flex items-center justify-center p-8">
              <div className="relative w-[400px] aspect-square preserve-3d animate-float-3d">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 preserve-3d z-20">
                  <div className="absolute inset-0 bg-brand-gradient rounded-[2rem] opacity-20 blur-2xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] shadow-2xl border border-blue-50 flex flex-col items-center justify-center text-center p-6 preserve-3d">
                    <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-brand-blue font-black text-sm uppercase tracking-tighter">Strategic Catalyst</div>
                  </div>
                </div>
                <div className="absolute inset-0 animate-orbit preserve-3d">
                  {[
                    { icon: <Cpu className="w-5 h-5" />, label: 'GenAI & Autonomous', angle: '0deg', color: 'bg-blue-600' },
                    { icon: <Network className="w-5 h-5" />, label: 'Agentic AI', angle: '120deg', color: 'bg-emerald-600' },
                    { icon: <RefreshCw className="w-5 h-5" />, label: 'Modernization', angle: '240deg', color: 'bg-purple-600' },
                  ].map((node, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 preserve-3d" style={{ transform: `rotate(${node.angle}) translateX(150px) rotate(-${node.angle})` }}>
                      <div className="animate-counter-rotate preserve-3d">
                        <div className={`w-14 h-14 ${node.color} rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-125 transition-transform duration-500`}>
                          {node.icon}
                          <div className="absolute -bottom-8 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            {node.label}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/5 blur-lg translate-y-6 translate-z-[-20px] rounded-2xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 400">
                  <circle cx="200" cy="200" r="150" fill="none" stroke="#2564ea" strokeWidth="1" strokeDasharray="10 10" />
                  <line x1="200" y1="50" x2="200" y2="350" stroke="#2564ea" strokeWidth="0.5" />
                  <line x1="50" y1="200" x2="350" y2="200" stroke="#2564ea" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] grid grid-cols-2 gap-4">
              {[{ label: 'DELIVERY', value: 'AGILE' }, { label: 'STACK', value: 'NATIVE' }].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-brand-blue">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const digitalTransformation = {
  titleLine1: 'Digital',
  titleHighlight: 'Transformation.',
  description: 'STRATEGIZE. EXECUTE. SCALE.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Digital Transformation That Moves the Needle</h2>
      <p>Transformation is no longer optional. It is the operating model of modern enterprises. Kangqore partners with organizations to re-architect systems, processes, and experiences — driving measurable business impact through AI, cloud, automation, and platform modernization.</p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
  primaryButton: { text: 'Request Transformation Assessment', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  highFidelity: {
    narrative: {
      badge: 'ENTERPRISE VELOCITY :: 2026',
      titleLine1: 'Digital',
      titleHighlight: 'Transformation',
      titleLine2: 'That Moves the Needle.',
      description: 'Transformation is no longer optional. It is the operating model of modern enterprises. Kangqore partners with organizations to re-architect systems, processes, and experiences — driving measurable business impact through AI, cloud, automation, and platform modernization.',
      bottleneckLabel: 'The Constraint',
      bottleneckText: 'Legacy silos & fragmented delivery.',
      requirementLabel: 'The Mandate',
      requirementText: 'Outcome-driven digital capital at scale.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
      statusLabel: 'Operating Model',
      statusValue: 'AI_FIRST',
    },
    philosophy: {
      icon: <TrendingUp className="w-7 h-7 text-brand-blue" />,
      title: 'Strategic',
      titleHighlight: 'Resilience.',
      description: 'We go beyond modernization to unlock digital capital, transforming complexity into capability through an AI-native transformation framework.',
      pills: ['Platform-Centric', 'AI-Driven', 'Experience-Led', 'Scalable'],
    },
    matrix: {
      engineId: 'Engine :: KQ_Delivery_V1',
      title: 'The Kangqore Delivery Approach',
      subtext: 'A structured, insight-led way to take initiatives from strategy to measurable outcomes.',
      layers: [
        { title: 'WHY', id: 'KQ_OUTCOMES', icon: <Target />, desc: 'Outcomes First: Revenue growth, Margin improvement, Cost reduction, Risk reduction.' },
        { title: 'WHAT', id: 'KQ_VALUE', icon: <PieChart />, desc: 'Value Streams: Customer experience, Operations, Data/AI, Platforms, Security.' },
        { title: 'HOW', id: 'KQ_EXECUTION', icon: <Workflow />, desc: 'Engineering Execution: Product engineering, Cloud/DevOps, DevSecOps, QA automation, Observability.' },
        { title: 'RESULT', id: 'KQ_IMPACT', icon: <Zap />, desc: 'Measurable Impact: Faster releases, Lower incidents, Better UX, Lower TCO, Stronger security posture.' },
      ],
    },
    schematic: {
      titleLine1: 'From Legacy.',
      titleHighlight: 'To Leverage.',
      description: 'Digital transformation is the catalyst for global digital dominance. We engineer the delivery frameworks that make it measurable and sustained.',
      stats: [
        { label: 'Impact', val: 'EXPONENTIAL' },
        { label: 'Adaptation', val: 'REAL-TIME' },
        { label: 'Capital', val: 'UNLOCKED' },
      ],
    },
  },

  technologies: [
    { category: 'Strategic AI', items: ['GenAI Strategy', 'Agentic Workflows', 'AI Governance', 'Decision Intelligence', 'MLOps'] },
    { category: 'Transformation Enablers', items: ['Cloud-Native Architecture', 'Platform Engineering', 'API-First Design', 'DevSecOps', 'Microservices'] },
    { category: 'Data & Analytics', items: ['Enterprise Data Fabric', 'Real-time Analytics', 'Predictive Modeling', 'Data Governance', 'Lakehouse'] },
    { category: 'Automation & Integration', items: ['RPA', 'iPaaS', 'Low-Code / No-Code', 'Workflow Orchestration', 'Event-Driven Architecture'] },
    { category: 'Experience & Channels', items: ['Headless CMS', 'Progressive Web Apps', 'Mobile-First', 'Omnichannel Platforms', 'UX Design Systems'] },
    { category: 'Security & Compliance', items: ['Zero Trust Architecture', 'IAM / RBAC', 'SIEM / SOAR', 'GRC Automation', 'Cloud Security Posture'] },
  ],

  capabilities: [
    { title: 'Digital Insights', bgImage: '/images/capabilities/data-analytics.png', description: 'Digital insights driven business models are the truth of the customer-centric economy. However, identifying the possibilities hidden away in the tremendous amount of data is becoming increasingly difficult for organizations. As traditional analytical methods become obsolete, businesses need to reinvent the way they utilize data to glean actionable insights.', items: ['Leverage cutting-edge data analytics solutions', 'Derive near real-time actionable insights', 'Discover innovative solutions to business problems', 'Drive informed decision making'] },
    { title: 'Rapid Innovation', bgImage: '/images/capabilities/software-engineering.png', description: 'Developing for competitive differentiation requires more than just an innovative idea, it requires organizations to deliver fast and deliver smart. Competitive advantage lies in the ability to bring ideas to life at the speed of light, gather and incorporate feedback, and accelerate time to market to morph into the next-gen of delivery ecosystem.', items: ['Inspire ingenuity by hyper accelerating idea-to-prototype process.', 'Share vision and opportunities for digital transformation with all the stakeholders.', 'Garner quick feedback, adapt, build, test, and deploy solutions.', 'Identify the best-of-breed concepts and deliver them with speed.'] },
    { title: 'Digital Experience', bgImage: '/images/capabilities/ux-design.png', description: 'Market dynamics are shifting at unprecedented rates, forcing organizations to respond to change with equal urgency. Technology has become central to digital businesses blurring the digital and physical worlds and enabling dynamic and complex interaction of people, businesses, and intelligent "things".', items: ['Create digitally enhanced omnichannel experiences.', 'Amplify customer understanding using capabilities like IoT, analytics, and mobility.', 'Define path-to-purchase customer journey from awareness to decision.', 'Customize offerings using predictive analytics and recommendation engines.', 'Optimize and enhance interactions throughout the customer lifecycle.', 'Leverage Mindful Thinking approach to enhance efficiency and deliver Digital Capital faster.'] },
    { title: 'AI-Enabled Modernization', bgImage: '/images/capabilities/ai-cognitive.png', description: 'Our Digital Enabled Application Services aim to empower organizations across the entire application life cycle. From design to building and managing the applications, our experts work with our clients to facilitate application-centric transformation. We enable organizations to:', items: ['Redesign enterprise architecture to accelerate digital capital creation.', 'Transform enterprise content management strategy to deliver highly contextual experiences.', 'Enhance omnichannel capabilities by leveraging latest technologies.', 'Design purpose built applications to resolve unique business problems.', 'Manage high volume inventory to ensure accurate and up-to-date product information.', 'Embrace open source technologies to create new, reliable, robust, scalable, and economical applications faster.'] },
    { title: 'Legacy Transformation', bgImage: '/images/capabilities/digital-transformation.png', description: 'One of the biggest challenges for CIOs today is to ensure technology and business process evolution are in sync and systems, people, and processes are future ready. Modernization delivers competitive advantages of agile business processes based on new technologies and architecture. It also helps mitigate risks and reduces the cost of ownership. We empower organizations to:', items: ['Reengineer business processes and accelerate development cycle by enabling innovation.', 'Tap in to the resource base of modern skill sets.', 'Drive higher ROI by improving business and operational efficiency.', 'Overcome application design limitations and support new business requirements.', 'Build an easy to adopt, low cost, secure, and scalable solution.'] },
    { title: 'Enterprise Platforms', bgImage: '/images/capabilities/software-engineering.png', description: 'Digital Platforms empower organizations with information and interactions to hyper accelerate value creation. Our unique IPs leverage emerging technologies like augmented intelligence, robotic process automation, big data analytics, internet of things and augmented reality enabling companies to become customer centric, frugal & insight driven. We build innovation systems through a process of Mindful Thinking to help our clients:', items: ['Focus on consistent & intuitive experiences: Link every journey, no isolations.', 'Built to adapt and scale: Take &lsquo;one&rsquo; to &lsquo;millions&rsquo;.', 'Deliver with speed: Fast to market, key to winning the market.', 'Place users at the center of everything: And yet, treat every customer as &lsquo;one&rsquo;.'] },
  ],

  solutions: [
    { title: 'AI Contact Center Modernization', description: 'Transform customer support with agentic AI that automates complex resolutions and delivers hyper-personalized experiences.' },
    { title: 'Intelligent Customer Onboarding', description: 'Streamline onboarding processes with AI-driven validation, identity checks, and automated workflow orchestration.' },
    { title: 'Enterprise Data Platform (EDP)', description: 'A unified, AI-native data fabric that breaks silos and provides real-time insights across the entire organization.' },
    { title: 'AI-Powered Proximity & Retail Intelligence', description: 'Leverage computer vision and spatial AI to optimize retail operations and enhance in-store customer engagement.' },
    { title: 'Digital Content & Workflow Orchestration', description: 'Automate content lifecycles and enterprise workflows with intelligent agents that ensure consistency and speed.' },
  ],

  whyKangqoreIntro: 'Kangqore is an AI-first digital engineering firm built for modern enterprises. We do not deliver presentations; we deliver production-ready systems.',
  whyKangqore: [
    { title: 'Strategic Consulting Discipline', description: 'We combine the rigor of elite management consulting with the execution depth of a modern engineering firm.' },
    { title: 'AI-Native Architecture Expertise', description: 'We don&rsquo;t just bolt on AI — we build from an AI-first perspective, ensuring systems are ready for agentic autonomy.' },
    { title: 'Cloud-First Infrastructure', description: 'Scalable, secure, and resilient infrastructure tailored for global enterprise delivery.' },
    { title: 'Security-by-Design Governance', description: 'Identity-first security and compliance embedded into every stage of the transformation lifecycle.' },
    { title: 'Continuous Innovation', description: 'Accelerate idea-to-market cycles through structured experimentation and AI modeling.' },
    { title: 'Measured ROI & Outcomes', description: 'Sustainable digital capital tracked through granular KPIs and enterprise-grade reporting.' },
  ],

  industryTitle: 'Global Industry Impact',
  industryIntro: 'Kangqore delivers end-to-end digital transformation across sectors including BFSI, Healthcare, Retail, Manufacturing, and the Public Sector.',
  industries: [
    { name: 'Banking & Financial Services' }, { name: 'Healthcare & Life Sciences' }, { name: 'Retail & Consumer Goods' },
    { name: 'Manufacturing' }, { name: 'Technology' }, { name: 'Professional Services' },
    { name: 'Telecommunications' }, { name: 'Energy & Utilities' }, { name: 'Education' },
    { name: 'Government' }, { name: 'Transportation & Logistics' }, { name: 'Media & Entertainment' },
  ],

  customFAQs: [
    { question: 'What is Digital Transformation and how can it benefit my organization?', answer: 'Digital Transformation helps organizations end-to-end digital transformation strategy and execution. By implementing digital transformation, you can improve efficiency, reduce costs, and gain competitive advantage.' },
    { question: 'How long does a typical digital transformation project take?', answer: 'Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.' },
    { question: 'What industries do you serve for digital transformation?', answer: "We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements." },
    { question: 'How do you ensure successful delivery?', answer: 'We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.' },
    { question: 'What post-implementation support do you offer?', answer: 'We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.' },
  ],

  customSections: digitalTransformationCustomSections,

  ctaTitle: 'Ready to Transform at Enterprise Scale?',
  ctaDescription: 'Digital transformation requires clarity, discipline, and execution. Kangqore partners with you from strategy to scale — embedding AI, automation, and modern architecture into the core of your enterprise.',
  ctaButtonText: 'Schedule Executive Consultation',
};

// ─── 3. legacy-modernization ──────────────────────────────────────────────────

const legacyModernizationStrategiesSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Modernization Strategies
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
            Adopting Tailored <span className="text-transparent bg-clip-text bg-brand-gradient">Strategies</span> For Optimal Results
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Every legacy system is unique. We recommend the right modernization strategy based on your system architecture, business value, and growth objectives.
          </p>
          <div className="space-y-4">
            {[
              { name: 'Lift & Shift', icon: <Cloud className="w-5 h-5" />, desc: 'Move existing applications to the cloud without code changes. Quick to implement with immediate benefits like improved scalability, flexibility, and reduced hardware costs.' },
              { name: 'Augment & Refactor', icon: <Code className="w-5 h-5" />, desc: 'Make strategic code changes to improve performance and leverage new technologies. Integrating modern features, improving efficiency, and restructuring for scalability.' },
              { name: 'Rewrite', icon: <RefreshCw className="w-5 h-5" />, desc: 'Completely redevelop your application using modern technologies and best practices. Most time-intensive but provides the most significant improvements in performance, scalability, and security.' },
              { name: 'Retiring', icon: <Settings className="w-5 h-5" />, desc: 'Decommission legacy applications that are no longer needed or cost-effective to maintain. Reduces maintenance costs, streamlines IT infrastructure, and frees resources for higher-value areas.' },
            ].map((strategy, idx) => (
              <div key={idx} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {strategy.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{strategy.name}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{strategy.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-6">
            <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
              Discuss Your Strategy <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="hidden sm:block text-sm text-gray-400 font-mono italic">// MODERNIZING_LEGACY...</div>
          </div>
        </div>
        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
              <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_MOD_01</span></div>
              <div className="flex justify-between gap-4"><span>PHASE:</span> <span>MODERNIZE</span></div>
              <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">TRANSFORMING</span></div>
            </div>
            <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
              <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Migration Hub</div>
              <div>PROCESSING_MODULES...</div>
              <div>PROGRESS: 94%</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                <RefreshCw className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                  <Cloud className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Cloud</span>
              </div>
            </div>
            <div className="absolute bottom-20 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <Database className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">API</div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data</span>
              </div>
            </div>
            <div className="absolute bottom-20 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <Layers className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Microservices</span>
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="lm-mod-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#lm-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#lm-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#lm-mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
              <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
              <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const legacyModernization = {
  titleLine1: 'Legacy',
  titleHighlight: 'Modernization.',
  description: 'REVAMP. MODERNIZE. SCALE.',
  fullDescription: (
    <div className="space-y-4">
      <p>Revamp your legacy systems with future-ready modernization services. Our legacy application modernization services are designed to eliminate these challenges by transitioning your mission-critical systems to modern, cloud-native, and scalable architectures.</p>
      <p>We focus on enhancing performance, improving maintainability, and ensuring seamless integration with emerging technologies, so your software evolves with your business. Your first consultation is on us!</p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  imageClassName: 'aspect-[4/5]',
  fullWidthCustomOverview: true,
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '100+', label: 'Systems Modernized', color: 'text-cyan-400' },
    { value: 'Cloud-Native', label: 'Architecture', color: 'text-blue-400' },
    { value: 'Zero', label: 'Downtime Migration', color: 'text-purple-400' },
    { value: 'Scalable', label: 'Future-Ready', color: 'text-orange-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'MODERNIZATION EXCELLENCE :: 2026',
      titleLine1: 'Revamp Legacy.',
      titleHighlight: 'Build Modern.',
      titleLine2: 'Scale Future.',
      description: 'Revamp your legacy systems with future-ready modernization services. We transition your mission-critical systems to modern, cloud-native, and scalable architectures — enhancing performance, improving maintainability, and ensuring seamless integration with emerging technologies.',
      bottleneckLabel: 'The Challenge',
      bottleneckText: 'Aging systems, technical debt & integration bottlenecks.',
      requirementLabel: 'The Outcome',
      requirementText: 'Modern, scalable & cloud-native enterprise systems.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'System State',
      statusValue: 'MODERNIZED',
    },
    philosophy: {
      icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
      title: 'Modernization is',
      titleHighlight: 'Outcome-First.',
      description: 'We believe every modernization engagement should deliver compounding enterprise value — not just deliverables, but lasting organizational capability, reduced technical debt, and future-proof architecture.',
      pills: ['Cloud-Native', 'Zero Downtime', 'Scalable', 'Future-Ready'],
    },
    matrix: {
      engineId: 'Engine :: MOD_LIFECYCLE_V3',
      title: 'Modernization Lifecycle',
      subtext: 'A structured 7-phase methodology that moves your legacy systems from technical debt to modernized, scalable architecture.',
      layers: [
        { title: 'Discovery', id: 'MOD_DISC', icon: <Search />, desc: 'Comprehensive assessment of legacy landscape, architecture, codebase, dependencies, and integration points.' },
        { title: 'Strategy', id: 'MOD_STRAT', icon: <Layers />, desc: 'Define the right modernization path — rehost, refactor, rearchitect, or rewrite — based on risk and value.' },
        { title: 'Pilot', id: 'MOD_PILOT', icon: <Zap />, desc: 'Validate approach with a critical module before full-scale rollout to reduce risk and build confidence.' },
        { title: 'Migrate', id: 'MOD_MIG', icon: <Activity />, desc: 'Phased, modular migration and development — delivering value incrementally while keeping business running.' },
      ],
    },
    schematic: {
      titleLine1: 'Transform Legacy.',
      titleHighlight: 'Accelerate Growth.',
      description: 'Your modernization journey should fuel undisputed competitive advantage — eliminating technical debt while enabling innovation at scale.',
      stats: [
        { label: 'Performance', val: 'OPTIMIZED' },
        { label: 'Scalability', val: 'UNLIMITED' },
        { label: 'Tech Debt', val: 'ELIMINATED' },
      ],
    },
  },

  technologies: [
    { category: 'Frontend Technologies', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5', 'CSS'] },
    { category: 'Backend Technologies', items: ['.Net', 'Java', 'NodeJS', 'Python', 'PHP', 'GO'] },
    { category: 'Mobile', items: ['iOS', 'Android', 'Xamarin', 'Cordova', 'PWA', 'React Native', 'Flutter'] },
    { category: 'Cloud Technologies', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
    { category: 'Databases / Data Storages', items: ['MySQL', 'SQL Server', 'MongoDB', 'Amazon S3', 'Amazon RDS', 'Cassandra'] },
    { category: 'DevOps', items: ['Linux', 'Linode', 'Jenkins', 'Terraform', 'Digital Ocean', 'Ansible', 'Chef', 'Puppet', 'Kubernetes', 'Docker'] },
  ],

  capabilitiesTitle: 'Stay Ahead Of The Curve With Our Comprehensive Software Modernization Services',
  capabilities: [
    { title: 'Application Modernization Consulting', bgImage: '/images/capabilities/software-engineering.png', description: 'Looking for in-depth analysis and strategic guidance to assess your current application landscape? Our modernization experts identify areas for improvement, prioritize modernization efforts, and develop a tailored roadmap for your software modernization journey, all while ensuring your software aligns with your business objectives and remains competitive.', items: ['Current state assessment & gap analysis', 'Modernization roadmap development', 'Technology stack evaluation', 'Business alignment strategy'] },
    { title: 'Application Migration Services', bgImage: '/images/capabilities/software-engineering.png', description: 'We specialize in migrating your applications to modern platforms, such as cloud environments. Whether you are moving from on-premises systems or older cloud solutions, our migration services ensure a seamless transition with focus on scalability, flexibility, and cost-efficiency.', items: ['Cloud migration (AWS, Azure, GCP)', 'On-premises to cloud transition', 'Zero-downtime migration strategies', 'Post-migration optimization'] },
    { title: 'Software Re-Engineering', bgImage: '/images/capabilities/software-engineering.png', description: 'Our re-engineering services involve a comprehensive overhaul of your software to enhance its performance, functionality, and architecture. We refactor code, improve user interfaces, and revamp the underlying structure to bring your software up to date with the latest industry standards.', items: ['Code refactoring & optimization', 'Architecture modernization', 'Performance enhancement', 'Technical debt elimination'] },
    { title: 'Data Integration Services', bgImage: '/images/capabilities/data-analytics.png', description: 'Several organizations struggle with data silos due to legacy systems. We provide data integration solutions that bridge the gap between old and new data sources, facilitating data accessibility and giving you a detailed look into the analytics side.', items: ['Data silo elimination', 'ETL pipeline development', 'Real-time data synchronization', 'Analytics enablement'] },
    { title: 'UI/UX Modernization', bgImage: '/images/capabilities/ux-design.png', description: 'Enhance your software user interface and user experience to ensure it is visually appealing, user-friendly, and responsive across devices. Our modernization service focuses on aesthetics, usability, accessibility, and performance, giving your application a competitive edge in the digital space.', items: ['Responsive design implementation', 'Accessibility compliance (WCAG)', 'Modern UI frameworks adoption', 'User research & testing'] },
    { title: 'Data Modernization', bgImage: '/images/capabilities/data-analytics.png', description: 'We offer data modernization services to help you manage, transform, and utilize your critical business data efficiently. This includes migrating data to cloud platforms, optimizing data storage, and implementing advanced analytics for better decision-making.', items: ['Cloud data migration', 'Data storage optimization', 'Advanced analytics implementation', 'Data governance frameworks'] },
    { title: 'Digital Transformation Services', bgImage: '/images/capabilities/digital-transformation.png', description: 'Leveraging digital transformation services can help you to revamp business processes, enhance efficiency, agility, and resilience, all while optimizing ROI. With a deep understanding of your unique needs, we help you evolve your existing software and applications, seamlessly integrate them into your new digital ecosystem, or repurpose their components efficiently.', items: ['Business process re-engineering', 'Digital ecosystem integration', 'Legacy component repurposing', 'ROI-driven transformation'] },
    { title: 'Cloud-Native Development', bgImage: '/images/capabilities/cloud-infrastructure.png', description: 'Our experts build and optimize applications specifically for cloud environments, leveraging containerization and microservices to ensure scalability and resilience. This approach is ideal for businesses aiming to maximize cloud benefits.', items: ['Container orchestration (Kubernetes)', 'Microservices architecture', 'Serverless computing', 'Cloud-native CI/CD pipelines'] },
    { title: 'API Development And Integration', bgImage: '/images/capabilities/software-engineering.png', description: 'Enable seamless connectivity across your systems with robust API development and integration. We help you design and implement secure, scalable APIs that connect internal modules and integrate third-party services, enhancing interoperability, accelerating feature delivery, and supporting data-driven decision-making.', items: ['RESTful & GraphQL API design', 'Third-party service integration', 'API gateway implementation', 'API security & versioning'] },
    { title: 'Microservices Architecture Implementation', bgImage: '/images/capabilities/software-engineering.png', description: 'Modernize your software architecture by transitioning to microservices. We help you decompose monolithic applications into modular, independent services, improving scalability, enabling faster deployments, and simplifying maintenance while preparing your system for cloud-native environments.', items: ['Monolith decomposition', 'Service mesh implementation', 'Event-driven architecture', 'Independent deployment pipelines'] },
    { title: 'Security & Compliance', bgImage: '/images/capabilities/cybersecurity.png', description: 'Our services encompass enhancing the security of your software through code audits, penetration testing, and the implementation of robust security protocols. This ensures your applications remain resilient against evolving threats and vulnerabilities.', items: ['Security code audits', 'Penetration testing', 'Compliance alignment (SOC 2, GDPR)', 'Secure architecture design'] },
  ],

  trustPillars: [
    { title: 'Cloud Computing', tag: 'Infrastructure', description: 'Cloud computing provides a flexible, scalable, and cost-effective solution for legacy application modernization. By moving your legacy applications to the cloud, you can access vast computing resources on-demand, scale your operations with ease, and only pay for what you use. Plus, cloud platforms offer robust security measures, ensuring your data is protected.' },
    { title: 'Artificial Intelligence (AI)', tag: 'Intelligence', description: 'AI can breathe new life into your legacy software. From automating routine tasks to predicting user behavior, AI can significantly enhance your software capabilities. By integrating AI into your modernized software, you can improve efficiency, personalize user experiences, and gain valuable insights from your data.' },
    { title: 'Internet of Things (IoT)', tag: 'Connectivity', description: 'By seamlessly integrating IoT into your legacy systems, we unlock new levels of real-time data capture and analysis. This empowers your software with enhanced monitoring, control, and automation capabilities, ultimately leading to increased efficiency, informed decision-making, and a competitive edge in the digital landscape.' },
    { title: 'Blockchain', tag: 'Security', description: 'Blockchain modernization is particularly valuable in industries requiring robust authentication, transparency, and data privacy. Whether you are in finance, healthcare, supply chain, or any sector that demands tamper-proof records and transactions, blockchain modernization ensures that your legacy systems are not only up to date but also at the forefront of data security and accountability.' },
  ],
  trustPillarsRightTitle: 'Empowering Legacy System Modernization With Advanced Technologies',
  trustPillarsRightDescription: 'We have been an early adopter of emerging technologies and have built extensive experience in various programming languages, frameworks, libraries, and tools. We continuously experiment with new technologies through our in-house R&D labs and pass on the learnings to our clients for a competitive edge.',
  trustPillarsRightButton: 'Request Consultation',

  whyKangqoreIntro: 'Reshaping legacy systems into powerful digital assets. Our modernization services deliver measurable outcomes that transform your technology landscape from a liability into a competitive advantage.',
  whyKangqore: [
    { title: 'Higher app availability & scalability', description: 'We optimize applications for scalability and fault tolerance, ensuring they are available when you need them most. This results in increased app availability and the ability to handle varying workloads.' },
    { title: 'Ease of innovation', description: 'The modernization solutions we develop make it easier for your organization to embrace innovation. By removing the limitations of legacy systems, you can more readily adopt emerging technologies and stay ahead of the competition.' },
    { title: 'Increased speed of deployments', description: 'Modernized software are quicker to deploy and update. This agility ensures you can respond rapidly to market changes and customer demands, enabling faster time-to-market for new features and products.' },
    { title: 'State of the art security', description: 'Our legacy software modernization services include robust security enhancements to protect your applications and data, ensuring compliance with industry standards and safeguarding against cyber threats.' },
    { title: 'Faster adoption of emerging technologies', description: 'We help you stay updated by enabling the adoption of emerging technologies like Machine Learning, AI, and Big Data, ensuring your applications remain competitive and capable of leveraging data-driven insights.' },
    { title: 'Data-driven decision-making', description: 'We help to empower your organization with advanced analytics through our application modernization services. This facilitates data-driven decision-making, helping you gain insights and improve business processes.' },
  ],

  industryTitle: 'Legacy Application Modernization Services Tailored For Your Industry',
  industries: [
    { name: 'Healthcare', description: 'Legacy EHRs, outdated patient portals, and siloed clinical systems often limit innovation and interoperability. We help healthcare providers modernize their tech stack while ensuring HIPAA compliance, enhancing patient engagement, and enabling data-driven care through AI and cloud-native architectures.' },
    { name: 'Fintech', description: 'We re-engineer legacy banking, lending, or policy management systems to support real-time transactions, regulatory compliance such as PCI-DSS, IFRS, etc., and seamless customer experiences. Our modernization services focus on API enablement, microservices, and secure cloud infrastructure.' },
    { name: 'Retail & E-Commerce', description: 'We modernize legacy POS systems, inventory tools, and customer portals to create unified commerce platforms. Whether it is integrating with AI-powered recommendation engines, streamlining omnichannel operations, or enabling headless commerce, we help retailers stay competitive.' },
    { name: 'Manufacturing', description: 'Legacy ERP, MES, or SCADA systems often hinder efficiency and data visibility. We modernize these systems to support IoT integration, predictive maintenance, and real-time analytics while preserving critical data and workflows.' },
    { name: 'Real Estate', description: 'From outdated property listing platforms to legacy CRMs and lease management systems, we modernize these by introducing cloud scalability, mobile-first interfaces, and seamless integrations with payment gateways, virtual tours, and document verification.' },
    { name: 'Media & Entertainment', description: 'Legacy content management systems and monolithic distribution platforms cannot keep up with today is demand for high-quality, on-demand content. We help media companies modernize to support OTT streaming, personalized content delivery, DRM, and real-time analytics.' },
    { name: 'Travel & Transportation', description: 'For travel agencies, airlines, and transportation providers, legacy booking engines and inventory systems often limit real-time updates and personalization. We modernize these to support dynamic pricing, real-time availability, mobile bookings, and third-party API integrations.' },
  ],

  customFAQs: [
    { question: 'What is software modernization & why is it important?', answer: 'Software modernization is the process of updating, refactoring, or replacing outdated software applications to enhance their functionality, performance, security, and alignment with current technology trends. It is crucial to keep applications competitive, secure, and efficient in a rapidly evolving digital landscape. It also reduces maintenance costs and extends the lifespan of applications.' },
    { question: 'How do I decide if my software needs modernization?', answer: 'Look for signs such as: Performance issues (frequent crashes, slow response times), security vulnerabilities that put your data at risk, rising maintenance costs from constant bug fixes, user complaints about usability or outdated interfaces, scalability challenges with growing data volumes, and integration difficulties with newer systems or third-party services.' },
    { question: 'What do you need from my side to start the modernization process?', answer: 'To kickstart the modernization process, we will need several insights such as objectives, business requirements, budget, timeline and more, to ensure a successful modernization partnership. For deeper details, it would be great to connect with your technical personnel and developers who could provide assistance for a thorough overview. We also offer a free consultation session.' },
    { question: 'What is the cost of software modernization?', answer: 'In general, the cost of software modernization varies widely depending on factors such as the scope of the project, the complexity of the software, and the extent of changes required. It is essential to conduct a thorough assessment and define clear project goals to determine costs accurately.' },
    { question: 'How long does a modernization project typically take?', answer: 'Timelines vary based on the complexity, size, and chosen modernization strategy. A straightforward rehosting might take weeks, while re-architecting or rebuilding a large system can take several months. A discovery phase helps determine accurate timelines.' },
    { question: 'Is it better to modernize or replace my legacy system?', answer: 'It depends on your existing system architecture, code quality, and alignment with current business needs. If the core logic is still valid, modernization might be more cost-effective. However, if the system no longer meets your functional or performance requirements, a complete rebuild may be necessary.' },
  ],

  postIndustrySections: legacyModernizationStrategiesSection,

  ctaTitle: 'Ready To Modernize Your Legacy Systems?',
  ctaDescription: 'Transform aging applications into modern, scalable, cloud-native platforms. Your first consultation is on us.',
  ctaButtonText: 'Talk To Our Experts',
};

// ─── 4. technology-modernization ──────────────────────────────────────────────

const technologyModernizationCustomSections = (
  <>
    {/* Problem Positioning Section */}
    <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-y border-gray-100">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
              <AlertTriangle className="w-4 h-4" /> The Cost of Inaction
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display">
              Legacy Systems Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Quietly Taxing</span> Your Business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl font-light">
              Modernization isn&rsquo;t optional anymore. It&rsquo;s strategic survival. Aging stacks don&rsquo;t just stay stagnant — they accumulate risk and entropy every single day.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Escalating maintenance costs',
                'Security vulnerabilities',
                'Architectural rigidity',
                'Vendor lock-ins',
                'Innovation paralysis',
                'Critical talent shortage',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-brand-blue/20 hover:shadow-md transition-all">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
            <div className="relative p-8 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Global Legacy Debt</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">$1.52 Trillion USD</div>
                    </div>
                  </div>
                  <div className="text-brand-blue font-mono font-bold">+18% YoY</div>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-48 h-48 mb-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" className="text-gray-200" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#tm-blueGradient)" strokeWidth="12" strokeDasharray="188.5 251.3" strokeLinecap="round" className="drop-shadow-sm" />
                      <defs>
                        <linearGradient id="tm-blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#0066FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">75%</span>
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter mt-1">Maintenance</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-brand-blue"></div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Maintenance</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">75-80% Budget</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                      <div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Innovation</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">&lt; 25% Strategic</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                  <p className="text-sm text-brand-blue font-medium italic leading-relaxed">
                    &ldquo;70-80% of average IT budgets are spent solely on &lsquo;keeping the lights on,&rsquo; leaving less than 20% for strategic innovation.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Enterprise Metrics Section */}
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-gray-100 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-xl shadow-gray-100/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
          <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-12 mb-4 text-center">
              <div className="font-mono text-[10px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Projected Performance</div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[0.95] font-display">
                Measurable ROI. <span className="text-transparent bg-clip-text bg-brand-gradient italic">Guaranteed Impact.</span>
              </h2>
            </div>
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '40–60%', label: 'Release Velocity', sub: 'Faster cycle times' },
                { value: '25–45%', label: 'Cost Efficiency', sub: 'Infra optimization' },
                { value: '30–50%', label: 'Defect Reduction', sub: 'AI-assisted QA' },
                { value: '2–3x', label: 'Release Velocity', sub: 'Speed of delivery' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 group-hover:text-brand-blue transition-all tracking-tighter duration-500">
                    {stat.value}
                  </div>
                  <div className="font-bold text-brand-blue text-xs uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-[10px] text-gray-500 font-mono italic">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const technologyModernization = {
  titleLine1: 'Technology',
  titleHighlight: 'Modernization.',
  description: 'MODERNIZE FASTER. OPERATE LEANER. SCALE STRONGER.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Technology Modernization, Engineered for Competitive Advantage</h2>
      <p>Legacy systems don&rsquo;t just slow operations — they suffocate growth. Kangqore modernizes your technology stack with precision, intelligence, and controlled risk.</p>
      <p>We move beyond incremental improvement — embedding capability, governance, and measurable business value into every engagement.</p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80',
  imageClassName: 'aspect-[4/5]',
  fullWidthCustomOverview: true,
  primaryButton: { text: 'Schedule a Strategy Call', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '60%', label: 'Release Velocity', color: 'text-cyan-400' },
    { value: '45%', label: 'Cost Optimization', color: 'text-blue-400' },
    { value: '50%', label: 'Defect Reduction', color: 'text-emerald-400' },
    { value: '3x', label: 'Scaling Speed', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'AI-ACCELERATED :: 2026',
      titleLine1: 'AI-Accelerated',
      titleHighlight: 'Modernization.',
      titleLine2: 'With Execution Discipline.',
      description: 'Modernization isn&rsquo;t optional anymore. It&rsquo;s strategic survival. We combine AI-powered engineering with deep architecture thinking to transform your technical debt into a strategic asset.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Escalating maintenance, security gaps, and innovation paralysis.',
      requirementLabel: 'The Outcome',
      requirementText: 'Structured transformation with architecture-first execution.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
      statusLabel: 'Modernization Flow',
      statusValue: 'ACCELERATED',
    },
    philosophy: {
      icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
      title: 'Our Approach is',
      titleHighlight: 'Capability Modernization.',
      description: 'We don&rsquo;t just modernize systems. We modernize capability. We architect the future with a focus on governance, observability, and undisputed competitive advantage.',
      pills: ['Engineers-First', 'Architecture Before Execution', 'AI-Native Approach', 'Governance-Baked'],
    },
    matrix: {
      engineId: 'Framework :: MODERNIZATION_V3',
      title: 'Modernization Framework',
      subtext: 'Our proprietary methodology for deconstructing enterprise debt and rebuilding for exponential growth.',
      layers: [
        { title: 'Diagnose', id: 'KQ_DIAG', icon: <Search />, desc: 'Technical debt mapping, dependency analysis, and strategic cost modeling.' },
        { title: 'Architect', id: 'KQ_ARCH', icon: <Layers />, desc: 'Design a cloud-native, composable, and AI-augmented target architecture.' },
        { title: 'Execute', id: 'KQ_EXEC', icon: <Zap />, desc: 'Controlled migration waves in parallel environments with phased rollout.' },
        { title: 'Optimize', id: 'KQ_OPT', icon: <Activity />, desc: 'Continuous observability, performance tuning, and infrastructure cost rightsizing.' },
        { title: 'Govern', id: 'KQ_GOV', icon: <ShieldCheck />, desc: 'SRE integration, security reinforcement, and DevSecOps automation at scale.' },
      ],
    },
    schematic: {
      titleLine1: 'Modernize',
      titleHighlight: 'Without Chaos.',
      description: 'Your transformation journey should fuel undisputed competitive advantage. We engineer the frameworks that make it measurable and sustained.',
      stats: [
        { label: 'Defect Reduction', val: '50% LESS' },
        { label: 'Release Velocity', val: '3X FASTER' },
        { label: 'ROI', val: 'MEASURABLE' },
      ],
    },
  },

  capabilitiesTitle: 'Core Technology Modernization Capabilities',
  capabilities: [
    {
      title: 'Lift & Shift',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Migrate legacy technology to new environments like the cloud with few changes. Reduce operational and staffing costs with a minimally disruptive approach.',
      items: ['Cloud-native re-platforming', 'Legacy monolith decomposition', 'Database modernization', 'Serverless architecture adoption'],
    },
    {
      title: 'AI-Powered SDLC',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Reinvent software development with AI-driven precision and productivity, harnessing human-guided approaches to work smarter, get to market faster, and lower costs.',
      items: ['AI code generation & refactoring', 'Automated test orchestration', 'Security-first DevSecOps', 'Velocity tracking & optimization'],
    },
    {
      title: 'AI-Enabled Architecture',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Implement platform-centered transformation, legacy transformations, cloud migrations and greenfield solutions faster with AI-based tooling.',
      items: ['Microservices & mesh architecture', 'Kubernetes orchestration', 'Internal developer platforms', 'Observability & SRE stacks'],
    },
    {
      title: 'AI-Enabled Agile',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Pioneer innovation solutions that shape the future of software development by harnessing our expertise in AI practices and Agile.',
      items: ['Pioneering innovation solutions', 'Future-shaping software development', 'AI & Agile hybrid practices', 'Iterative delivery models'],
    },
  ],

  technologies: [
    { category: 'Cloud & Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Linode'] },
    { category: 'Frameworks & Languages', items: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'Go', '.Net Core'] },
    { category: 'DevOps & Tooling', items: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana'] },
    { category: 'AI & Data', items: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face', 'MongoDB', 'PostgreSQL', 'Redis'] },
  ],

  whyKangqoreIntro: 'Kangqore is an engineers-first organization. We prioritize architecture before execution, ensuring your modernization journey is stable, secure, and outcome-led.',
  whyKangqore: [
    { title: 'Engineers-First Culture', description: 'Deep technical thinking is in our DNA. We solve complex architectural problems, not just tickets.' },
    { title: 'Architecture-First', description: 'We never code without a robust, governed architectural foundation designed for your specific scale.' },
    { title: 'AI-Native Approach', description: 'We use AI to accelerate legacy assessment, code refactoring, and quality assurance workflows.' },
    { title: 'Governance Baked-In', description: 'Compliance, security, and observability are core requirements, not afterthoughts.' },
    { title: 'ROI Focus', description: 'Every modernization wave is measured against deployment velocity, cost, and quality metrics.' },
    { title: 'Controlled Risk', description: 'Our 5-phase modernization framework ensures phased migrations that maintain business continuity.' },
  ],

  industryTitle: 'Modernization Tailored for Your Industry Vertical',
  industryIntro: 'We bring deep domain knowledge to bridge the gap between legacy systems and modern industry requirements.',
  industries: [
    { name: 'Fintech & Banking', description: 'Modernizing legacy core banking and payments systems for real-time transactions and regulatory resilience.' },
    { name: 'Healthcare', description: 'Decoupling monolith EHRs and patient portals to enable interoperability, AI diagnosis, and HIPAA-compliant cloud scale.' },
    { name: 'Retail & Commerce', description: 'Modernizing inventory and POS systems for unified commerce and AI-personalized customer journeys.' },
    { name: 'Manufacturing', description: 'Integrating legacy SCADA/MES with modern IoT, analytics, and autonomous supply chain systems.' },
    { name: 'Real Estate', description: 'Modernizing outdated CRM and listing engines for mobile-first, high-velocity digital sales cycles.' },
    { name: 'Media & Entertainment', description: 'Transforming monolithic CMS and distribution stacks for OTT streaming and personalized delivery at scale.' },
  ],

  customFAQs: [
    { question: 'What is Kangqore&rsquo;s Modernization Framework?', answer: 'Kangqore follows a structured 5-phase modernization framework (Diagnose, Architect, Execute, Optimize, Govern) designed specifically for enterprise-scale technology modernization. It prioritizes controlled risk and architectural governance to ensure legacy systems are transformed into scalable assets without interrupting core business operations.' },
    { question: 'How do you mitigate risk during legacy migration?', answer: 'We follow an "Execute in Phases" strategy. This involves establishing parallel environments, conducting controlled migration waves, and performing rigorous pilot implementations for critical modules before full-scale rollout. This ensures that any issues are isolated and addressed without affecting the primary production environment.' },
    { question: 'Should I modernize or rebuild my legacy system?', answer: 'This depends on our initial "Diagnose & Deconstruct" phase. If the core business logic is sound but the delivery platform is outdated, refactoring or re-platforming is often better. If the architecture is fundamentally broken and restricts growth, a structured rewrite (re-architecting) using our proven modernization methodology is recommended.' },
    { question: 'How does AI accelerate the modernization process?', answer: 'We use AI-native tooling at three levels: 1) Automated technical debt mapping and dependency analysis, 2) Intelligent code refactoring and translation, and 3) AI-assisted test automation and security scanning. This typically improves project velocity by 40-60%.' },
    { question: 'How long does a typical modernization engagement take?', answer: 'A modular pilot typically takes 8-12 weeks. Complete enterprise modernization varies by scale, but our phased approach ensures you see measurable ROI and improved velocity within the first 90 days. We define clear milestones to maintain momentum.' },
    { question: 'How do you measure the success of modernization?', answer: 'Success is measured via core Enterprise Metrics: reduction in deployment cycle time (40-60%), infrastructure cost optimization (25-45%), defect reduction (30-50%), and overall release velocity improvement. We provide real-time dashboards to track these KPIs throughout the engagement.' },
  ],

  postIndustrySections: technologyModernizationCustomSections,

  ctaTitle: 'Modernize Without Chaos.',
  ctaDescription: 'Let&rsquo;s engineer your next technology chapter together. Accelerated delivery, architected for scale.',
  ctaButtonText: 'Schedule a Strategy Call',
};

// ─── 5. digital-business-transformation ───────────────────────────────────────

const digitalBusinessTransformationOrchestrationSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Orchestration Ecosystem
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
            Related Transformation <span className="text-transparent bg-clip-text bg-brand-gradient">Offerings</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Accelerate your digital evolution by integrating core transformation with our specialized modernization and growth services.
          </p>
          <div className="space-y-4">
            {[
              { name: 'Technology Modernization', link: '/services/technology-modernization', icon: <Rocket className="w-5 h-5" />, desc: 'Redesigning the tech stack for high-velocity delivery.' },
              { name: 'AI Strategy & Governance', link: '/services/ai-governance', icon: <Brain className="w-5 h-5" />, desc: 'Embedding intelligence at the core of enterprise systems.' },
              { name: 'Application Modernization', link: '/services/application-modernization', icon: <Layers className="w-5 h-5" />, desc: 'Refactoring legacy software into cloud-native assets.' },
              { name: 'Cloud Computing', link: '/services/cloud-computing', icon: <Globe className="w-5 h-5" />, desc: 'Infrastructure agility for distributed business models.' },
            ].map((offering, idx) => (
              <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-6">
            <Link to="/services" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
              Explore All Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                <Target className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                  <Brain className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Strategy</span>
              </div>
            </div>
            <div className="absolute bottom-20 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <Layers className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">CORE</div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Engineering</span>
              </div>
            </div>
            <div className="absolute bottom-20 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <Fingerprint className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data Fabric</span>
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="dbt-trans-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#dbt-trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#dbt-trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#dbt-trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const digitalBusinessTransformation = {
  titleLine1: 'Digital Business',
  titleHighlight: 'Transformation.',
  description: 'ARCHITECT. ORCHESTRATE. EVOLVE.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Enterprise Orchestration</h2>
      <p>Transformation is no longer an option; it is the substrate of enterprise survival. Fragmented legacy systems and siloed operations are the primary bottlenecks to market-led growth.</p>
      <p>Kangqore architects the digitally enabled enterprise by redesigning how your business creates value — integrating strategy, engineering, data intelligence, and governance into a unified digital flow.</p>
    </div>
  ),
  image: '/assets/images/services/digital-business-transformation-hero.png',
  imageClassName: 'aspect-[4/5]',
  fullWidthCustomOverview: true,
  primaryButton: { text: 'Start Your Transformation', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '74%', label: 'Value Realization', color: 'text-cyan-400' },
    { value: '100%', label: 'Digital Alignment', color: 'text-blue-400' },
    { value: 'Unified', label: 'Orchestration Flow', color: 'text-purple-400' },
    { value: 'ROI', label: 'Driven Strategy', color: 'text-orange-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'DIGITAL EVOLUTION :: 2026',
      titleLine1: 'Architect the.',
      titleHighlight: 'Digitally Enabled.',
      titleLine2: 'Enterprise.',
      description: "Transformation is not about adopting tools. It's about redesigning how your business creates value through scalable digital solutions and engineering excellence.",
      bottleneckLabel: 'The Friction',
      bottleneckText: 'Fragmented legacy silos & operational inertia.',
      requirementLabel: 'The Evolution',
      requirementText: 'Unified enterprise orchestration & market-led growth.',
      image: '/assets/images/services/digital-business-transformation-hero.png',
      statusLabel: 'Maturity State',
      statusValue: 'ORCHESTRATED',
    },
    philosophy: {
      icon: <Brain className="w-7 h-7 text-brand-blue" />,
      title: 'Business',
      titleHighlight: 'Intelligence.',
      description: 'We approach transformation as an architectural discipline, ensuring every technology investment is anchored to strategic ROI and operational agility.',
      pills: ['ROI-Driven', 'Cloud-Native', 'AI-First', 'Agile Flow'],
    },
    matrix: {
      engineId: 'Engine :: Transformed_Enterprise_V2',
      title: 'Transformation Velocity Model',
      subtext: 'A structured methodology that moves your organization from digital intent to absolute market-led excellence.',
      layers: [
        { title: 'Strategize', id: 'TRANS_STRAT', icon: <Target />, desc: 'Align business ambition with digital execution through maturity assessment & ROI modeling.' },
        { title: 'Architect', id: 'TRANS_ARC', icon: <Layers />, desc: 'Design target operating models and core architecture blueprints for scalable growth.' },
        { title: 'Engineer', id: 'TRANS_BUILD', icon: <Rocket />, desc: 'Deploy high-performing digital products and experience systems aligned to business goals.' },
        { title: 'Orchestrate', id: 'TRANS_FLOW', icon: <Zap />, desc: 'Integrate AI-powered software delivery and automated governance across the enterprise.' },
        { title: 'Evolve', id: 'TRANS_GO', icon: <Activity />, desc: 'Ensure transformation adoption through change enablement and continuous optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Measurable Impact.',
      titleHighlight: 'Value Orchestrated.',
      description: 'Your transformation should deliver undisputed business outcomes. It is the foundation for your next decade of competitive reliability.',
      stats: [
        { label: 'Value', val: 'INCREMENTAL' },
        { label: 'Maturity', val: 'MAXIMIZED' },
        { label: 'Velocity', val: 'ACCELERATED' },
      ],
    },
  },

  technologiesTitle: 'Tools & Technologies We Excel In',
  technologiesDescription: 'A comprehensive suite of enterprise-grade tools, platforms, and intelligent systems carefully selected to drive measurable business transformation and scalable growth.',
  technologies: [
    { category: 'Strategy & Research', items: ['Market Intelligence', 'ROI Modeling', 'Miro', 'Lucidchart', 'Google Analytics'] },
    { category: 'Product & UX Design', items: ['Figma', 'Storybook', 'Adobe Creative Cloud', 'Framer', 'UserTesting'] },
    { category: 'AI-Powered SDLC', items: ['GitHub Copilot', 'SonarQube', 'Jenkins', 'GitLab CI', 'Intelligent Test Automation'] },
    { category: 'Enterprise Platforms', items: ['Pimcore', 'Salesforce', 'ServiceNow', 'SAP S/4HANA', 'Microsoft Dynamics'] },
    { category: 'Cloud & Innovation', items: ['AWS / Azure / GCP', 'Kubernetes', 'Azure OpenAI', 'Agentic AI', 'MLOps'] },
  ],

  capabilities: [
    { title: 'Transformation Advisory', bgImage: '/images/capabilities/business-strategy.png', description: 'Identify and understand opportunity and impact areas for digital transformation. Define your transformation solution, roadmap, target outcomes, and metrics for tracking progress.', items: ['Digital maturity assessment & gap analysis', 'Target Operating Model (TOM) design', 'Value case & ROI modeling', 'KPI architecture & measurement design', 'Executive governance & steering frameworks'] },
    { title: 'Transformation Execution & Governance', bgImage: '/images/capabilities/digital-transformation.png', description: 'Define an organizational structure and ways of working to support your transformation journey. Execute your roadmap across people, processes, and technologies, measuring and tracking success.', items: ['Program governance frameworks (PMO design)', 'Milestone & dependency management', 'OKR-based performance tracking', 'Risk management & escalation models', 'Transformation dashboards & reporting'] },
    { title: 'User and Market Research', bgImage: '/images/capabilities/business-strategy.png', description: 'Gather data, then turn it into insights and actionable plans. We help you deeply understand your market and audience to drive product-market fit, growth, and user satisfaction.', items: ['Customer journey mapping', 'Product-market fit analysis', 'Quantitative & qualitative research', 'Competitive benchmarking', 'Growth & revenue opportunity modeling'] },
    { title: 'Product and UX/UI Design', bgImage: '/images/capabilities/ux-design.png', description: 'User wireframes, user flows, sitemaps, component libraries, and more to design the product experience – crafting the structure, look, and functionality while considering brand and accessibility.', items: ['Product architecture & platform strategy', 'UX/UI design systems & component libraries', 'Accessibility & usability optimization', 'Secure engineering standards', 'Mobile-first & responsive design'] },
    { title: 'AI-Powered SDLC', bgImage: '/images/capabilities/ai-cognitive.png', description: 'Reinvent software development with AI-driven precision and productivity, harnessing AI-driven, human-guided approaches to work smarter and get to market faster.', items: ['AI-assisted development workflows', 'Intelligent test automation', 'DevOps & Infrastructure-as-Code', 'Predictive defect & quality analytics', 'Engineering productivity optimization'] },
    { title: 'AI-Enabled Agile', bgImage: '/images/capabilities/ai-cognitive.png', description: 'Pioneer innovation solutions that shape the future of software development by harnessing our expertise in AI practices and Agile operating models.', items: ['Agile transformation frameworks', 'Squad-based operating models', 'AI-driven workflow automation', 'Continuous integration & experimentation', 'Digital capability enablement programs'] },
    { title: 'Product Launch and Adoption', bgImage: '/images/capabilities/business-strategy.png', description: 'Prepare for a smooth launch and drive adoption through change management and strategic launch plans that consider your users, culture, and constraints.', items: ['Change management frameworks', 'Enterprise rollout planning', 'Adoption KPI tracking', 'Stakeholder engagement models', 'Post-launch optimization cycles'] },
  ],

  trustPillars: [
    { title: 'Value Reinvention', tag: 'Strategy', description: 'At Kangqore, digital transformation is not a project. It is a structured, measurable reinvention of how your business creates value.' },
    { title: 'Engineered Excellence', tag: 'Engineering', description: 'Our scalable engineering teams deliver robust, flexible, enterprise-grade systems designed for long-term performance.' },
    { title: 'Intelligence-Led', tag: 'Data', description: 'We integrate data and AI across transformation initiatives to ensure decisions are measurable, optimized, and outcome-driven.' },
    { title: 'Agile Governance', tag: 'Governance', description: 'Ensuring every transformation milestone is aligned to commercial outcomes and risk-mitigated strategies.' },
  ],
  trustPillarsRightTitle: 'End-to-End Enterprise Transformation',
  trustPillarsRightDescription: 'Kangqore provides next-generation digital business transformation solutions that help organizations accelerate innovation, enhance operational efficiency, and experience smoother customer interactions. By combining advanced engineering technology and deep strategic advisory, we enable businesses to initiate Agile, Scalable, and Secure digital journeys according to their specific requirements.',
  trustPillarsRightButton: 'Request Consultation',

  whyKangqoreIntro: 'Kangqore accelerates transformation by bridging the gap between business ambition and engineering execution. We design digital systems that don&rsquo;t just solve problems, but create enduring competitive advantage.',
  whyKangqore: [
    { title: 'Value-First Advisory', description: 'Ensuring every digital initiative is anchored to measurable ROI and strategic intent.' },
    { title: 'Scalable Engineering', description: 'Building core digital platforms that support exponential business growth and operational flow.' },
    { title: 'Data-Driven Governance', description: 'Integrating intelligence and automated tracking across transformation programs for total visibility.' },
    { title: 'Omnichannel Excellence', description: 'Designing seamless user experiences across all digital touchpoints to maximize desirability.' },
    { title: 'Agile Operating Models', description: 'Modernizing organizational ways of working to support high-velocity digital innovation.' },
    { title: 'Change-Proof Adoption', description: 'Ensuring long-term success through structured rollout and enterprise change enablement.' },
  ],

  postIndustrySections: digitalBusinessTransformationOrchestrationSection,

  ctaTitle: 'Architect Your Digital Future',
  ctaDescription: 'Move from digital intent to measurable business impact. Let&rsquo;s design your high-velocity enterprise.',
  ctaButtonText: 'Book a Transformation Session',
};

// ─── 6. mvp-acceleration ──────────────────────────────────────────────────────
// (entry inserted by subsequent edit)

// ─── 7. product-strategy-experience-design ────────────────────────────────────
// (entry inserted by subsequent edit)

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const REIMAGINE_LEGACY_SECTIONS = {
  // (populated by subsequent edit)
};
