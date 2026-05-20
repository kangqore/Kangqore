// ─── Foundry — 8 legacy service lifts (Phase D2, KQ-SER-FOUNDRY-D2) ────────────
// Lifted from the legacy 15-dept tree into the canonical 6-dept Foundry registry:
//   - embedded-design-systems        (was product-engineering/EmbeddedDesignSystems.jsx)
//   - engineering-rd-services        (was product-engineering/EngineeringRDServices.jsx)
//   - product-digital-engineering    (was product-engineering/ProductDigitalEngineering.jsx)
//   - devops-as-a-service            (was product-engineering/DevopsAsAService.jsx)
//   - managed-infrastructure-services(was infrastructure-networks-operations/ManagedInfrastructureServices.jsx)
//   - engineering-foundry            (was product-engineering/EngineeringFoundry.jsx)
//   - modernization-infrastructure   (was infrastructure-networks-operations/ModernizationInfrastructure.jsx)
//   - software-development           (was digital-engineering/SoftwareDevelopment.jsx)
//
// Locked rules applied:
//   - Content lifted verbatim from legacy; no fabrication, no paraphrasing.
//   - Legacy-only fields (name, slug, department, shortDescription, breadcrumb,
//     pageData/ServicePageTemplate wrapper) dropped. hideGenericMidPageCta +
//     hideGenericFaq added to every entry.
//   - Hardcoded legacy URLs in inline <Link to=...> rewritten to canonical
//     /services/<slug>. Non-obvious rewrites carry an inline // NOTE: comment.
//   - Stateful sections extracted as wrapper components above the entries:
//       ModernizationInfraValueAccordion  — real useState (openAccordion)
//       SoftwareDevelopmentAnimatedSections — GSAP + ScrollTrigger + 2 useState
//   - GSAP / ScrollTrigger cleanup is SCOPED via gsap.context() + ctx.revert()
//     (NOT the legacy software-development's global
//     ScrollTrigger.getAll().forEach(t => t.kill())) — so triggers from one
//     page don't tear down animations on other pages.
//   - engineering-foundry's legacy useState import was never used (hover effects
//     use plain onMouseEnter handlers) — treated as plain, NO wrapper.
//
// URL rewrites summary (non-obvious):
//   automation/intelligent-automation -> intelligent-automation
//   cloud/cloud-transformation -> cloud-computing
//   data-ai/data-engineering -> big-data
//   cybersecurity, cybersecurity/managed-security-services,
//     cybersecurity/cloud-security -> it-security-services
//   engineering/quality-engineering,
//     product-engineering/quality-engineering-assurance -> quality-engineering-assurance
//   engineering/devops -> devops-as-a-service
//   data-ai/cognitive-services -> ai-cognitive-computing
//   cloud/engineering, /services/cloud-engineering, /services/cloud -> cloud-computing
//   data-ai/generative-ai -> genai-business-services
//   infrastructure-networks-operations/cloud-data-center-advisory-transformation
//     -> modernization-infrastructure
//   infrastructure-networks-operations/digital-workspace
//     -> managed-infrastructure-services
//   product-engineering/saas-product-development,
//     product-engineering/enterprise-application-development -> software-development
//   digital-experiences/ux-ui -> product-strategy-experience-design
//   automation/digital-process-automation -> digital-process-automation
//   /services/consulting -> technology-consulting
//   product-engineering/embedded-design-systems -> embedded-design-systems
//   digital-engineering/{mvp-acceleration,api-microservices-engineering,
//     product-strategy-experience-design} -> dept-segment dropped
//   a legacy link: '#' placeholder is preserved as '#'.
// ────────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity, ArrowRight, BarChart3, Bot, BrainCircuit, CheckCircle2, Cloud, Code,
  Code2, Cpu, Database, Globe, Globe2, Layers, MonitorSmartphone, Network,
  Palette, RefreshCw, Rocket, Search, Server, ShieldCheck, Smartphone, Target,
  Terminal, TrendingUp, Workflow,
} from 'lucide-react';

// gsap.registerPlugin is idempotent — safe to call at module load
gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPER COMPONENTS
//
// Each one owns its own state/refs/useEffect and is referenced from a service
// entry's customSections / postCapabilitiesSections etc. The GSAP wrapper uses
// gsap.context() so cleanup is scoped to its sectionRef — it NEVER kills
// ScrollTriggers belonging to other pages.
// ═══════════════════════════════════════════════════════════════════════════════

// (1) Modernization Infrastructure — useState wrapper (5-item "Value We Deliver"
//     accordion). Legacy used a local AccordionItem component + openAccordion
//     useState inside the page body; lifted here verbatim.
const ModernizationInfraValueAccordion = () => {
  // Accordion Component for Values
  const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-blue-100 transition-colors mb-4 shadow-sm group">
        <button
          className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
          onClick={onClick}
        >
          <span className={`font-bold text-lg ${isOpen ? 'text-brand-blue' : 'text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors'}`}>{title}</span>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-brand-blue border-brand-blue text-white rotate-180' : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-gray-500 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-brand-blue'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 mt-2">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <section className="py-24 bg-white dark:bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              The Kangqore Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
              Value We Deliver with <br/><span className="text-transparent bg-clip-text bg-brand-gradient italic">Infrastructure Modernization.</span>
            </h2>
            <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Modernization isn't just "moving to cloud." It's upgrading architecture, automation, controls, and operations so your infrastructure becomes a competitive advantage—not a bottleneck.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-3xl -z-10 border border-gray-100 hidden lg:block"></div>
            <AccordionItem title="Zero-downtime massive migrations" isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? -1 : 0)}>Modernize with minimal disruption using structured risk assessments, parallel environments, and rollback-ready cutover frameworks.</AccordionItem>
            <AccordionItem title="35%+ Lower TCO through automation" isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? -1 : 1)}>Consolidate legacy sprawl, mandate GitOps orchestration, and deploy FinOps to aggressively reduce enterprise run-rates.</AccordionItem>
            <AccordionItem title="99.99% Guaranteed uptime engineering" isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? -1 : 2)}>Eradicate single points of failure with multi-region redundancies, automated failovers, and elite SRE observability practices.</AccordionItem>
            <AccordionItem title="Compliance-ready target architectures" isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? -1 : 3)}>Embed identity-first access controls, continuous policy enforcement, and audit-ready governance into every layer of code.</AccordionItem>
            <AccordionItem title="Future-proof platform scalability" isOpen={openAccordion === 4} onClick={() => setOpenAccordion(openAccordion === 4 ? -1 : 4)}>Transition from reactive hardware scaling to immutable, elastic, horizontally-scaled cloud primitives built for hyperscale.</AccordionItem>
          </div>
        </div>
      </div>
    </section>
  );
};

// (2) Software Development — GSAP wrapper with scoped gsap.context() cleanup.
//
// Holds 3 refs (diamond, differentiator, journey) + 2 useState accordions
// (openAccordion for "Value We Deliver", openFutureAccordion for "Future-Ready
// Expertise"). All gsap.to / gsap.fromTo / ScrollTrigger.create live inside a
// gsap.context() scoped to sectionRef; cleanup is ctx.revert() — NEVER the
// legacy's global ScrollTrigger.getAll().forEach(t => t.kill()). The counter
// animation queries sectionRef.querySelectorAll (legacy used document.).
// This wrapper holds the postCapabilitiesSections bundle (diamond CoE +
// value-deliver + journey + future-ready).
const SoftwareDevelopmentAnimatedSections = () => {
  const sectionRef = useRef(null);
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [openFutureAccordion, setOpenFutureAccordion] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (diamondRef.current) {
        gsap.fromTo(diamondRef.current,
          { opacity: 0, scale: 0.8, y: 60 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true }
          }
        );
        gsap.to(diamondRef.current, {
          y: -30, ease: 'none',
          scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }
      if (differentiatorRef.current) {
        const items = differentiatorRef.current.querySelectorAll('.diff-item');
        gsap.fromTo(items,
          { opacity: 0, y: 30, x: -20 },
          { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true }
          }
        );
      }
      if (journeyRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
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
        gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true }
        });
      }
      // Counter animation — scoped within sectionRef (legacy used document.)
      const animateCounters = () => {
        const statElements = sectionRef.current
          ? sectionRef.current.querySelectorAll('.stat-counter-text')
          : [];
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
      gsap.delayedCall(0.5, animateCounters);
    }, sectionRef);

    return () => ctx.revert(); // SCOPED cleanup — never global kill
  }, []);

  // ── VALUE WE DELIVER — Accordion data ──
  const valueItems = [
    { title: 'Strategic clarity before engineering begins', desc: 'Align business goals, user needs, scope, and solution direction before development effort expands.' },
    { title: 'Full-cycle software execution', desc: 'Move from planning and design to engineering, testing, deployment, and optimization through one structured delivery model.' },
    { title: 'Faster delivery with stronger engineering discipline', desc: 'Accelerate build velocity without sacrificing maintainability, quality, or architecture integrity.' },
    { title: 'Future-ready technical foundations', desc: 'Design software that can evolve through integrations, scaling, new modules, and changing business priorities.' },
    { title: 'Cross-functional product and engineering alignment', desc: 'Bring product thinking, UX, architecture, development, testing, and DevOps into one cohesive execution path.' },
    { title: 'Reduced long-term software risk', desc: 'Improve reliability, release confidence, and sustainability through better testing, monitoring, modernization, and support readiness.' }
  ];

  // ── JOURNEY TIMELINE — 4-Phase Lifecycle data ──
  const journeyPhases = [
    { phase: 'DEFINE', icon: <Search className="w-7 h-7" />, title: 'Understand & Clarify', desc: 'Understand business goals, requirements, workflows, user needs, and technical constraints.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
    { phase: 'DESIGN', icon: <Palette className="w-7 h-7" />, title: 'Shape & Architect', desc: 'Shape architecture, experiences, integrations, and delivery planning before engineering accelerates.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
    { phase: 'BUILD', icon: <Code2 className="w-7 h-7" />, title: 'Develop & Validate', desc: 'Develop, test, integrate, and release through structured engineering and quality workflows.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
    { phase: 'EVOLVE', icon: <RefreshCw className="w-7 h-7" />, title: 'Optimize & Extend', desc: 'Support, optimize, modernize, and extend the product through continuous improvement.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true }
  ];

  // ── FUTURE-READY EXPERTISE — Accordion data ──
  const futureExpertiseItems = [
    { title: 'DevOps', desc: 'We use DevOps practices to automate, streamline, and strengthen software delivery. This improves release speed, engineering coordination, quality consistency, and operational confidence across environments.' },
    { title: 'Artificial Intelligence', desc: 'Our AI-enabled software capabilities help organizations embed intelligence into products, workflows, and decision-making through machine learning, natural language interfaces, computer vision, and automation-led engineering.' },
    { title: 'Blockchain', desc: 'We help design blockchain-enabled applications and decentralized solution models where trust, traceability, smart contracts, and distributed workflows create real business value.' },
    { title: 'Internet of Things (IoT)', desc: 'We build IoT-enabled software systems that connect devices, applications, and real-time data flows to support smarter monitoring, automation, and operational visibility.' }
  ];

  return (
    <div ref={sectionRef} className="software-development-page-override">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes connector-draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .stat-counter-text { font-variant-numeric: tabular-nums; }
      ` }} />

      {/* 3D DIAMOND CoE SECTION */}
      <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
            <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
              <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
                <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                  Our <strong className="text-brand-blue">Software Engineering CoE</strong> provides a high-velocity strategic blueprint, surrounding your software initiative with four critical layers of engineering validation.
                </p>
                <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We replace "code-and-hope" with "architect-and-validate." By unifying discovery, architecture, development, and continuous evolution, we ensure your software is built on a foundation of absolute engineering confidence.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
              <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
                <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                  <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                    <defs><linearGradient id="sd-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                    <circle cx="300" cy="40" r="7" fill="url(#sd-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                    <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#sd-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                    <circle cx="40" cy="300" r="7" fill="url(#sd-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                    <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#sd-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                    <circle cx="300" cy="560" r="7" fill="url(#sd-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                    <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#sd-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                    <circle cx="560" cy="300" r="7" fill="url(#sd-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                    <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#sd-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                  </svg>
                  <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                    <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite' }}>
                      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Strategic<br/>Discovery</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Architecture<br/>Design</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Engineering<br/>Excellence</div></div>
                        <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Continuous<br/>Evolution</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Requirement clarity •</li><li>Workflow discovery •</li><li>Scope prioritization •</li><li>MVP definition •</li></ul></div>
                  <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Cloud-native patterns</li><li>• Microservices design</li><li>• API-first planning</li><li>• Scalability modeling</li></ul></div>
                  <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>CI/CD automation •</li><li>Quality-first pipelines •</li><li>Test-driven delivery •</li><li>DevOps integration •</li></ul></div>
                  <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Modernization readiness</li><li>• Performance optimization</li><li>• Support automation</li><li>• Tech debt reduction</li></ul></div>
                </div>
              </div>
              {/* Mobile CoE Cards */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {[
                  { title: 'Strategic Discovery', items: ['Requirement clarity', 'MVP definition'], gradient: 'from-blue-600 to-blue-800' },
                  { title: 'Architecture Design', items: ['Cloud-native patterns', 'API-first planning'], gradient: 'from-blue-400 to-blue-600' },
                  { title: 'Engineering Excellence', items: ['CI/CD automation', 'Test-driven delivery'], gradient: 'from-blue-900 to-slate-900' },
                  { title: 'Continuous Evolution', items: ['Performance optimization', 'Tech debt reduction'], gradient: 'from-cyan-500 to-cyan-700' }
                ].map((q, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                    <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* DIFFERENTIATOR GRID */}
          <div ref={differentiatorRef} className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {[
                { num: 1, title: 'Clarity Before Complexity', text: 'We bring structured discovery and solution framing to reduce ambiguity before engineering investment scales.' },
                { num: 2, title: 'Architecture with Longevity', text: 'We design systems for long-term maintainability, not just initial launch — reducing rework and technical debt.' },
                { num: 3, title: 'Quality as a Discipline', text: 'Testing, security, and reliability are embedded into every phase — not bolted on at the end.' },
                { num: 4, title: 'DevOps-Led Delivery', text: 'We automate infrastructure, pipelines, and release workflows so teams ship faster with confidence.' },
                { num: 5, title: 'Full-Cycle Accountability', text: 'From discovery through post-launch support, we own the engineering lifecycle end to end.' }
              ].map((d) => (
                <div key={d.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
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

      {/* VALUE WE DELIVER — Accordion */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                <TrendingUp className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Value Delivered</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                Value We Deliver with{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Software Development.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            </div>
            <div className="space-y-3">
              {valueItems.map((item, idx) => (
                <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <button onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} className="w-full flex items-center justify-between p-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-colors ${openAccordion === idx ? 'bg-brand-blue' : 'bg-slate-900'}`}>{String(idx + 1).padStart(2, '0')}</div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  {openAccordion === idx && (
                    <div className="px-6 pb-6 pl-20">
                      <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE — 4-Phase Lifecycle */}
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
                    <linearGradient id="sd-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="sd-journey-glow-v"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sd-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#sd-journey-glow-v)" opacity="0.3" />
                  <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sd-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[125, 375, 625, 875].map((cy, i) => (
                    <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#sd-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                      <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#sd-journey-grad-v)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#sd-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                      <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                    </g>
                  ))}
                  {[0, 1, 2].map(i => (
                    <circle key={`pv-${i}`} className="journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                      <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                      <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    </circle>
                  ))}
                </svg>
              </div>
              <div className="space-y-6 lg:pl-[55px]">
                {journeyPhases.map((item, idx) => (
                  <div key={idx} className="journey-card group" style={{ perspective: '800px' }}>
                    <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 lg:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
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
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Delivery Model</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                    Our Software Development{' '}<br />
                    <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Delivery Model.</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                  <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                    At Kangqore, software development is structured as a disciplined engineering model — built to define clearly, execute reliably, and evolve continuously.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div><div className="text-2xl font-bold text-gray-900 dark:text-white">04</div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Timeline</div><div className="text-2xl font-bold text-gray-900 dark:text-white">8-24<span className="text-sm text-gray-400 ml-1">wks</span></div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Confidence</div><div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">100%</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE-READY EXPERTISE — Accordion */}
      <section className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                <BrainCircuit className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Future-Ready</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                Future-Ready{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                Kangqore helps clients build beyond current requirements by combining core software engineering with emerging capability areas that shape the next generation of digital products and platforms.
              </p>
            </div>
            <div className="space-y-3">
              {futureExpertiseItems.map((item, idx) => (
                <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <button onClick={() => setOpenFutureAccordion(openFutureAccordion === idx ? -1 : idx)} className="w-full flex items-center justify-between p-6 text-left">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFutureAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  {openFutureAccordion === idx && (
                    <div className="px-6 pb-6"><p className="text-gray-500 font-light leading-relaxed">{item.desc}</p></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE ENTRIES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. embedded-design-systems ───────────────────────────────────────────────

// Product lifecycle flow — preMatrixSection in legacy
const embeddedDesignSystemsPreMatrixSection = (
  <div className="py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes lcFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(0.5deg); }
          66% { transform: translateY(-3px) rotate(-0.5deg); }
        }
        @keyframes lcGlow {
          0%, 100% { box-shadow: 0 8px 25px rgba(0,133,255,0.25), 0 0 0 0 rgba(0,133,255,0); }
          50% { box-shadow: 0 18px 50px rgba(0,133,255,0.45), 0 0 80px rgba(0,210,255,0.1); }
        }
        @keyframes lcArrowFlow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lcCheckBounce {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(5deg); }
          80% { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes lcFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lcShimmer {
          0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
        }
        @keyframes lcPulseRing {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes lcDotTrail {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .lc-phase { animation: lcFadeIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .lc-phase:nth-child(1) { animation-delay: 0s; }
        .lc-phase:nth-child(2) { animation-delay: 0.12s; }
        .lc-phase:nth-child(3) { animation-delay: 0.24s; }
        .lc-phase:nth-child(4) { animation-delay: 0.36s; }
        .lc-phase:nth-child(5) { animation-delay: 0.48s; }
        .lc-phase:nth-child(6) { animation-delay: 0.60s; }
        .lc-card {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
          padding: 1.5rem;
          margin: -1.5rem;
          border-radius: 2rem;
          height: calc(100% + 3rem);
        }
        .lc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 2rem;
          background: linear-gradient(135deg, rgba(0,133,255,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .lc-card:hover::before { opacity: 1; }
        .lc-card:hover {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 40px 100px -20px rgba(0,133,255,0.18), 0 0 0 1px rgba(0,133,255,0.08);
          z-index: 10;
          transform: translateY(-10px) scale(1.01);
        }
        .lc-tile {
          position: relative;
          overflow: hidden;
          animation: lcFloat 4.5s ease-in-out infinite, lcGlow 4s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lc-shimmer {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: lcShimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .lc-pulse-ring {
          position: absolute;
          inset: -8px;
          border-radius: 1.5rem;
          border: 2px solid rgba(0,133,255,0.3);
          animation: lcPulseRing 2.5s ease-out infinite;
          pointer-events: none;
        }
        .lc-card:hover .lc-tile {
          animation: none;
          transform: scale(1.12) translateY(-6px);
          box-shadow: 0 24px 50px rgba(0,133,255,0.35), 0 0 0 8px rgba(0,133,255,0.08);
        }
        .lc-check {
          animation: lcCheckBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .lc-phase:nth-child(1) .lc-check { animation-delay: 0.4s; }
        .lc-phase:nth-child(2) .lc-check { animation-delay: 0.52s; }
        .lc-phase:nth-child(3) .lc-check { animation-delay: 0.64s; }
        .lc-phase:nth-child(4) .lc-check { animation-delay: 0.76s; }
        .lc-phase:nth-child(5) .lc-check { animation-delay: 0.88s; }
        .lc-phase:nth-child(6) .lc-check { animation-delay: 1.0s; }
        .lc-arrow-line {
          background: linear-gradient(90deg, transparent 0%, rgba(0,133,255,0.15) 15%, rgba(0,210,255,0.5) 50%, rgba(0,133,255,0.15) 85%, transparent 100%);
          background-size: 200% 100%;
          animation: lcArrowFlow 1.8s linear infinite;
        }
        .lc-dot { animation: lcDotTrail 1.8s ease-in-out infinite; }
        .lc-dot:nth-child(1) { animation-delay: 0s; }
        .lc-dot:nth-child(2) { animation-delay: 0.3s; }
        .lc-dot:nth-child(3) { animation-delay: 0.6s; }
      `}</style>

      {/* Desktop: Grid Flow with Animated Cards */}
      <div className="hidden lg:grid grid-cols-6 gap-6 relative px-6 mt-10">
        {[
          {
            phase: 'Concept',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="24" cy="18" r="8" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M20 28h8v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" stroke="white" strokeWidth="1.5"/>
                <line x1="24" y1="10" x2="24" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="30" y1="12" x2="33" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18" y1="12" x2="15" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            items: ['Technical feasibility', 'Budgeting / cost', 'Project plan', 'Architectural design']
          },
          {
            phase: 'Analysis',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
                <line x1="27" y1="27" x2="36" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 20h8M20 16v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            items: ['Requirements engineering', 'Risk assessment', 'Technology evaluation', 'BoM cost feasibility']
          },
          {
            phase: 'Design',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="8" y="8" width="32" height="24" rx="3" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M14 18l6 4-6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="24" y1="26" x2="34" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="8" y1="36" x2="40" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="24" cy="40" r="2" stroke="white" strokeWidth="1.5"/>
              </svg>
            ),
            items: ['Schematics, PCB layout design', 'FPGA design', 'Firmware', 'BSP, Protocol stacks', 'Application software', 'User interface', 'Enclosure design']
          },
          {
            phase: 'Prototype & Test',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="10" y="6" width="28" height="36" rx="3" stroke="white" strokeWidth="1.5" fill="none"/>
                <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="26" x2="24" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M28 24l3 3 5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            items: ['Component procurement', 'PCB fabrication & assembly', 'Board bring-up & functional tests', 'System integration', 'Design verification', 'Design verification tests, system tests']
          },
          {
            phase: 'Certify',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <path d="M24 4l6 12h12l-10 8 4 14-12-8-12 8 4-14L6 16h12z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <path d="M20 22l3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            items: ['Pre-compliance tests for EMI/EMC, Safety', 'Regulatory certification - FCC, CE, UL, etc', 'Environmental tests']
          },
          {
            phase: 'Product',
            svg: (
              <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="16" y="30" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M24 6v20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M18 14l6-8 6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="20" y1="36" x2="28" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
            items: ['Production Handover', 'Manufacturing tests & diagnostics', 'Post delivery support, Product sustenance']
          }
        ].map((step, idx, lifecyclePhases) => (
          <div key={idx} className="lc-phase flex flex-col relative group">
            <div className="lc-card flex flex-col items-center">

              {/* Visual Header */}
              <div className="relative mb-8 flex justify-center w-full">
                <div className="relative z-10">
                  {/* Pulse ring behind the tile */}
                  <div className="lc-pulse-ring" style={{ animationDelay: `${idx * 0.4}s` }}></div>
                  <div
                    className="lc-tile w-[100px] h-[100px] rounded-2xl bg-gradient-to-br from-[#0085FF] via-[#00A3FF] to-[#00D2FF] flex items-center justify-center cursor-pointer"
                    style={{ animationDelay: `${idx * 0.7}s` }}
                  >
                    {/* Shimmer beam */}
                    <div className="lc-shimmer" style={{ animationDelay: `${idx * 0.6}s` }}></div>
                    {step.svg}
                  </div>
                  {/* Checkmark badge */}
                  <div className="lc-check absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 shadow-md border-2 border-blue-100 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-6" stroke="url(#checkGradEds)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="checkGradEds" x1="3" y1="7" x2="11" y2="4">
                          <stop stopColor="#0085FF"/>
                          <stop offset="1" stopColor="#00D2FF"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Arrow connector with animated dots */}
                {idx < lifecyclePhases.length - 1 && (
                  <div className="absolute top-[50%] left-[calc(50%+52px)] w-[calc(100%-104px+1.5rem)] -translate-y-1/2 flex items-center gap-1" style={{ zIndex: 0 }}>
                    <div className="lc-arrow-line h-[2px] flex-1 rounded-full"></div>
                    {/* Animated dot trail overlay */}
                    <div className="absolute inset-0 flex items-center justify-around px-2">
                      <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                      <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                      <div className="lc-dot w-1 h-1 rounded-full bg-blue-400/60"></div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-blue-500 shrink-0 relative z-10 drop-shadow-sm transition-all duration-500 group-hover:translate-x-1 group-hover:scale-125">
                      <path d="M2 2L12 7L2 12" fill="none" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="arrowGrad" x1="2" y1="7" x2="12" y2="7">
                          <stop stopColor="#0085FF"/>
                          <stop offset="1" stopColor="#00D2FF"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="text-center w-full mb-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white italic font-display tracking-tight leading-tight group-hover:text-brand-blue transition-colors duration-300">{step.phase}</h4>
              </div>
              <div className="w-full flex-1 flex flex-col">
                <ul className="space-y-3">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[12px] xl:text-[13px] text-gray-500 leading-snug text-left group-hover:text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      <span className="mt-[0.4rem] w-1.5 h-1.5 bg-brand-blue/40 rounded-full shrink-0 group-hover:bg-brand-blue group-hover:scale-125 transition-all duration-300"></span>
                      <span className="opacity-90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Mobile: 2-col grid with compact cards */}
      <div className="lg:hidden grid grid-cols-2 gap-6">
        {[
          { phase: 'Concept', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><circle cx="24" cy="18" r="8" stroke="white" strokeWidth="1.5" fill="none"/><path d="M20 28h8v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" stroke="white" strokeWidth="1.5"/><line x1="24" y1="10" x2="24" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="30" y1="12" x2="33" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="12" x2="15" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>), items: ['Technical feasibility', 'Budgeting / cost', 'Project plan', 'Architectural design'] },
          { phase: 'Analysis', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none"/><line x1="27" y1="27" x2="36" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M16 20h8M20 16v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>), items: ['Requirements engineering', 'Risk assessment', 'Technology evaluation', 'BoM cost feasibility'] },
          { phase: 'Design', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><rect x="8" y="8" width="32" height="24" rx="3" stroke="white" strokeWidth="1.5" fill="none"/><path d="M14 18l6 4-6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="24" y1="26" x2="34" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="36" x2="40" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="24" cy="40" r="2" stroke="white" strokeWidth="1.5"/></svg>), items: ['Schematics, PCB layout design', 'FPGA design', 'Firmware', 'BSP, Protocol stacks', 'Application software', 'User interface', 'Enclosure design'] },
          { phase: 'Prototype & Test', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><rect x="10" y="6" width="28" height="36" rx="3" stroke="white" strokeWidth="1.5" fill="none"/><line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="26" x2="24" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M28 24l3 3 5-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>), items: ['Component procurement', 'PCB fabrication & assembly', 'Board bring-up & functional tests', 'System integration', 'Design verification', 'Design verification tests, system tests'] },
          { phase: 'Certify', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><path d="M24 4l6 12h12l-10 8 4 14-12-8-12 8 4-14L6 16h12z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/><path d="M20 22l3 3 6-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>), items: ['Pre-compliance tests for EMI/EMC, Safety', 'Regulatory certification - FCC, CE, UL, etc', 'Environmental tests'] },
          { phase: 'Product', svg: (<svg viewBox="0 0 48 48" fill="none" className="w-10 h-10"><rect x="16" y="30" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M24 6v20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 14l6-8 6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="20" y1="36" x2="28" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>), items: ['Production Handover', 'Manufacturing tests & diagnostics', 'Post delivery support, Product sustenance'] }
        ].map((step, idx) => (
          <div key={idx} className="lc-phase flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0085FF] via-[#00A3FF] to-[#00D2FF] flex items-center justify-center shadow-lg">
                {step.svg}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-sm flex items-center justify-center border border-blue-100">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="#0085FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white italic mb-2">{step.phase}</h4>
            <ul className="space-y-1 text-left w-full">
              {step.items.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="mt-1 w-1 h-1 bg-brand-blue/30 rounded-full shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom context */}
      <div className="mt-20">
        <div className="flex items-start gap-6 max-w-4xl border-l-2 border-brand-blue/30 pl-6 py-2">
          <p className="text-lg text-gray-500 font-light leading-relaxed tracking-wide">
            Through skilled personnel, latest tools, sophisticated labs, and trusted ecosystem partners, we cater to cutting-edge technology and legacy platforms — <span className="text-gray-900 dark:text-white font-medium">from small form factor designs to multi-board system architectures.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// EDS metrics strip — preWhyKangqoreSections in legacy
const embeddedDesignSystemsMetricsStrip = (
  <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
        {[
          { label: '6–8 Weeks', sub: 'Concept to prototype' },
          { label: '95%', sub: 'First-pass design success' },
          { label: 'PCIe Gen 5', sub: 'High-speed design capability' },
          { label: '100%', sub: 'Verification coverage target' },
          { label: 'Multi-Domain', sub: '6+ industry verticals' },
          { label: 'CE/FCC/UL', sub: 'Regulatory certification' }
        ].map((metric, idx) => (
          <div key={idx} className="text-center group">
            <div className="text-lg lg:text-xl font-bold text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
              {metric.label}
            </div>
            <div className="text-xs text-white/50 font-medium tracking-wide uppercase">
              {metric.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// EDS related offerings — postFAQSections in legacy
const embeddedDesignSystemsRelatedOfferings = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="lg:w-2/3 mb-16">
        <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
          Related <br />
          <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
        </h2>
        <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
          Complementary services that extend your embedded engineering investment across the digital enterprise.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {[
          {
            name: 'Intelligent Automation',
            link: '/services/intelligent-automation', // NOTE: legacy "automation/intelligent-automation" -> intelligent-automation
            icon: <Bot className="w-5 h-5" />,
            desc: 'Automate industrial workflows and IT/OT processes with RPA, AI, and process orchestration for operational efficiency.'
          },
          {
            name: 'Cloud Transformation',
            link: '/services/cloud-computing', // NOTE: legacy "cloud/cloud-transformation" -> cloud-computing
            icon: <Globe className="w-5 h-5" />,
            desc: 'Migrate device data and IoT workloads to cloud-native architectures for scalable analytics and remote device management.'
          },
          {
            name: 'Data Engineering & Analytics',
            link: '/services/big-data', // NOTE: legacy "data-ai/data-engineering" -> big-data
            icon: <Database className="w-5 h-5" />,
            desc: 'Build the data pipelines that transform raw sensor and device telemetry into actionable operational intelligence.'
          },
          {
            name: 'Cybersecurity & Compliance',
            link: '/services/it-security-services', // NOTE: legacy "cybersecurity" -> it-security-services
            icon: <ShieldCheck className="w-5 h-5" />,
            desc: 'Secure embedded devices, OT networks, and IoT ecosystems with industrial-grade security frameworks and compliance.'
          },
          {
            name: 'Quality Engineering & Testing',
            link: '/services/quality-engineering-assurance', // NOTE: legacy "engineering/quality-engineering" -> quality-engineering-assurance
            icon: <Target className="w-5 h-5" />,
            desc: 'Validate embedded systems with hardware-in-the-loop testing, compliance verification, and automated test frameworks.'
          },
          {
            name: 'DevOps & CI/CD',
            link: '/services/devops-as-a-service', // NOTE: legacy "engineering/devops" -> devops-as-a-service
            icon: <Workflow className="w-5 h-5" />,
            desc: 'Implement embedded CI/CD pipelines for firmware builds, automated testing, and over-the-air deployment at scale.'
          }
        ].map((offering, idx) => (
          <Link
            key={idx}
            to={offering.link}
            className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
          >
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
              {offering.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const embeddedDesignSystems = {
  titleLine1: 'Embedded Design',
  titleHighlight: 'Systems',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">From concept to production—complete embedded product engineering spanning hardware, firmware, FPGA, mechanical design, and IT/OT convergence.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Kangqore helps enterprises transform ideas into production-ready embedded products. From system architecture and high-speed board design to firmware development, FPGA/ASIC engineering, mechanical enclosures, and regulatory certifications—we deliver end-to-end under one roof, cutting across networking, industrial automation, IoT, medical devices, and more.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Fast', label: 'Concept to prototype', color: 'text-blue-500' },
    { value: '95%', label: 'First-pass design success', color: 'text-brand-blue' },
    { value: '100%', label: 'Verification coverage target', color: 'text-indigo-500' },
    { value: 'CE/FCC/UL', label: 'Regulatory certified', color: 'text-purple-500' }
  ],

  highFidelity: {
    narrative: {
      badge: 'EMBEDDED ENGINEERING :: 2026',
      titleLine1: 'Idea to Product.',
      titleHighlight: 'Production',
      titleLine2: 'Ready.',
      description: 'Embedded product design requires specialized talent, expensive tools, and modern equipment—along with industrial design, mechanical engineering, thermal analysis, and regulatory certifications. Getting all these capabilities under one roof is rare. Kangqore brings the full stack together: system architecture, hardware design, software, mechanical design, prototyping, validation, certifications, and pilot production.',
      bottleneckLabel: 'The Challenge',
      bottleneckText: 'Fragmented vendor chains, revision cycles, disconnected hardware-software workflows, shrinking time-to-market, and the cost of maintaining tools, personnel, and infrastructure in-house.',
      requirementLabel: 'Our Approach',
      requirementText: 'One team, full-stack ownership. First-time-right design methodology. From small form factor designs to multi-board system designs—delivered with proven practices that ensure superior product quality and high fault coverage.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&q=80',
      statusLabel: 'Engineering Maturity',
      statusValue: 'Production-Grade'
    },
    philosophy: {
      icon: <Cpu className="w-7 h-7 text-brand-blue" />,
      title: 'Our',
      titleHighlight: 'Engineering Framework.',
      description: 'At Kangqore, embedded engineering spans every phase of the product lifecycle—from architecture and design through prototyping, validation, certification, and production handover.',
      pills: ['Architect', 'Design', 'Validate', 'Produce']
    },
    matrix: {
      engineId: 'Engine :: EDS_Flow_V3',
      title: 'How We Deliver',
      subtext: 'A structured, production-grade delivery model covering every phase from feasibility analysis to pilot production and manufacturing support.',
      layers: [
        { title: 'Architect', id: 'EDS_ARCH', icon: <Search />, desc: 'System architecture + feasibility analysis + BoM cost modeling. Define the product blueprint with technical and commercial viability established upfront.' },
        { title: 'Design', id: 'EDS_DES', icon: <Layers />, desc: 'Schematic capture + PCB layout + firmware architecture + FPGA RTL + mechanical enclosure. Hardware-software co-design with simulation and signal integrity analysis.' },
        { title: 'Validate', id: 'EDS_VAL', icon: <Cpu />, desc: 'Board bring-up + EVT/DVT + pre-compliance EMI/EMC + FMEA/MTBF analysis. Validate the design with working prototypes before committing to production tooling.' },
        { title: 'Produce', id: 'EDS_PROD', icon: <TrendingUp />, desc: 'Regulatory certifications (CE, FCC, BIS, UL, RoHS) + DFM optimization + pilot production + manufacturing handover. Transition from lab to factory at scale.' }
      ]
    },
    schematic: {
      titleLine1: 'Engineer',
      titleHighlight: 'Excellence.',
      description: 'Build products where hardware, firmware, and mechanical design work as one—connected, certified, and designed for the demands of volume production.',
      stats: [
        { label: 'Design', val: 'FIRST-TIME-RIGHT' },
        { label: 'Coverage', val: 'CHIP-TO-CLOUD' },
        { label: 'Output', val: 'PRODUCTION-READY' }
      ]
    }
  },

  preMatrixSection: embeddedDesignSystemsPreMatrixSection,

  technologies: [
    { category: 'Processors & SoCs', items: ['ARM Cortex-M/A/R', 'x86 (Intel/AMD)', 'PowerPC', 'ESP32', 'STM32', 'NXP i.MX', 'NVIDIA Jetson'] },
    { category: 'FPGA Vendors', items: ['Xilinx/AMD', 'Intel (Altera)', 'Lattice', 'Actel/Microchip', 'Cadence', 'Synopsys'] },
    { category: 'RTOS & Embedded OS', items: ['Embedded Linux', 'FreeRTOS', 'VxWorks', 'QNX', 'Zephyr', 'ThreadX', 'Android'] },
    { category: 'EDA & CAD Tools', items: ['Altium Designer', 'OrCAD/Allegro', 'KiCad', 'MATLAB/Simulink', 'SolidWorks', 'AutoCAD'] },
    { category: 'Protocols & Interfaces', items: ['PCIe Gen 3/4/5', '100G Ethernet', 'USB 3.x', 'HDMI 2.0', 'SPI/I2C/CAN', 'MQTT/OPC-UA'] },
    { category: 'IoT & Connectivity', items: ['Wi-Fi', 'BLE', 'Zigbee', 'LoRa', 'LTE/5G', 'Modbus', 'AWS IoT', 'Azure IoT Hub'] }
  ],
  technologiesTitle: 'Tools & Technologies',
  technologiesDescription: 'Industry-standard tools across processors, FPGA, RTOS, EDA, high-speed interfaces, and IoT connectivity platforms.',

  capabilities: [
    {
      title: 'Product Design',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'From miniature wearable devices to complex multi-board system designs—a one-stop-shop for any electronic product design. First-time-right practices ensure superior product quality, extended availability, and high fault coverage.',
      items: [
        'Single board computers: PC/104, 3.5" SBC, Industrial PC',
        'System on Modules & carrier boards: COM Express, SMARC, Qseven',
        'Wearable devices & IoT gateways',
        'Healthcare devices & medical electronics',
        'Servers, storage solutions & data acquisition I/O boards',
        'Protocol analyzer boards & analytical instruments',
        'Networking devices: modems, routers, switches, DSLAM',
        'Industrial control systems & automation hardware',
        'Multi-board system design',
        'Power electronics: AC-DC/DC-DC, inverters, UPS, solar conversion'
      ]
    },
    {
      title: 'Board Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'From architecture to manufacturing—complete hardware board design for single board, multi-board, mixed signal, FPGA-based, power-optimized, small form factor, and high-density board designs.',
      items: [
        'Feasibility analysis: technical & BoM cost feasibility',
        'Schematics & PCB layout development',
        'High-speed interfaces: PCIe Gen 5, 100G Ethernet, HDMI 2.0, SAS-3',
        'Wireless/RF interfaces: Wi-Fi, Bluetooth, Zigbee, LoRa, 3G, LTE',
        'Analog & mixed signal board design',
        'Multi-layer high-speed PCB (Rogers/Megtron 6, rigid-flex)',
        'Pre & post layout signal integrity, thermal & PI simulation',
        'Reliability analysis: FMEA, MTBF prediction',
        'Prototyping: PCB fabrication & assembly',
        'Board bring-up, EVT & DVT testing',
        'Sustenance: cost reduction, obsolescence management',
        'EMI/EMC & certifications: BIS, WPC, CE, FCC, RoHS, UL, ESD',
        'Production handover, pilot production & manufacturing support'
      ]
    },
    {
      title: 'Firmware Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Software for all kinds of electronic devices—from small-footprint, power-optimized firmware to safety-critical real-time applications across Embedded Linux, VxWorks, QNX, FreeRTOS, Android, and more.',
      items: [
        'Bootloader development & BIOS customization',
        'Device driver development & diagnostics',
        'Board Support Packages (BSP) across processor architectures',
        'OS porting & OS migration (PPC, ARM, x86)',
        'Protocol stack porting & integration',
        'Application software development, porting & integration',
        'Embedded cybersecurity & secure boot',
        'IoT edge/gateway software',
        'Feature enhancement & maintenance',
        'UX/UI design for embedded interfaces',
        'Mobile application development',
        'Production test automation & test software'
      ]
    },
    {
      title: 'FPGA Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Expertise in FPGA-based designs from low-density CPLDs to multi-million gate FPGAs/SoCs. End-to-end capability with devices from Xilinx, Intel, Lattice, and Actel for quick development cycles.',
      items: [
        'RTL & testbench design: VHDL / Verilog / SystemVerilog',
        'High-speed protocols: PCIe Gen 1–5, NVMe 1.3, Gen Z, CXL, 10GbE',
        'External interfaces: SPI, I2C, LPC, PCI, CAN, GPMC, ADC, DAC',
        'On-chip interfaces: APB, AHB, AXI3, AXI4, Avalon',
        'Memory interfaces: NAND, NOR, DDR3, DDR4, HMC, HBM',
        'Soft processor IPs: NIOS II, MicroBlaze',
        'Functional & timing simulation',
        'Platform migration & resource optimization (logic, I/O, speed)',
        'IP core development & glue logic design',
        '3rd party IP core integration',
        'ASIC prototyping in FPGA'
      ]
    },
    {
      title: 'FPGA/ASIC Verification & Validation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Expert verification engineers delivering projects across networking, storage, military, aerospace, industrial, test & measurement, and consumer electronics—achieving 100% code and functional coverage.',
      items: [
        'Testbench architecture & test plan creation',
        'Bus functional models, protocol drivers, sequencers & monitors',
        'Test case development & execution',
        'System / SoC / IP / subsystem / block-level verification',
        'Design & development: VHDL / Verilog / SystemVerilog / UVM / OVM',
        'Assertion-based verification',
        'Code coverage & functional coverage closure to 100%',
        'Perl / Shell / Python / Makefile script development'
      ]
    },
    {
      title: 'Mechanical Design Services',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'The right enclosure and mechanicals for your product—considering aesthetics, cost, cooling requirements, durability, ruggedness, and safety aspects. From rackmount to rugged NEMA enclosures.',
      items: [
        'Industrial design & conceptual drawings',
        'Rapid prototyping & 3D printing',
        'Sheet metal & plastic enclosure engineering',
        'Rackmount chassis & DIN rail system design',
        'Desktop, handheld & box-type enclosures',
        'NEMA & rugged enclosure design',
        'Thermal design & cooling solutions',
        'Drawing format conversion',
        'Packaging, carton & label design for production'
      ]
    },
    {
      title: 'Embedded System & Application Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Complete software services for embedded products—from architectural design, coding, and testing to maintenance. BSP, device drivers, test software, communication protocols, and embedded UI across all processor families.',
      items: [
        'BSP: PPC, ARM, x86 across Linux, VxWorks, Android, FreeRTOS',
        'Device drivers for peripherals & diagnostics',
        'Test & diagnostic software development',
        'Wired & wireless communication protocols',
        'Industrial protocol implementation',
        'Embedded UI design & development',
        'Application software porting & integration'
      ]
    },
    {
      title: 'System Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'High-performance system software for networking, telecom, and infrastructure products—dataplane software, control protocols, virtual appliances, and middleware development.',
      items: [
        'Dataplane software development',
        'Control protocol stacks for switching & routing',
        'Management agents & middleware',
        'Embedded application software',
        'Virtual appliance software & VNF development',
        'NFV infrastructure engineering',
        'MANO (Management & Orchestration) engineering'
      ]
    },
    {
      title: 'Application Software',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Enterprise-grade application software for embedded and network products—SDN controllers, network management systems, web portals, mobile applications, and UX/UI design.',
      items: [
        'SDN controller & SDN application development',
        'NFV infrastructure & MANO engineering',
        'Element management / network management systems',
        'Web applications & enterprise portals',
        'Mobile application development (iOS & Android)',
        'UX/UI design & user experience engineering'
      ]
    }
  ],
  capabilitiesDescription: 'Kangqore delivers end-to-end embedded product engineering—from product design and high-speed board engineering to firmware, system software, FPGA/ASIC verification, and mechanical enclosure design. Every phase of the product lifecycle under one roof.',

  industryTitle: 'Industries We Engineer For.',

  trustPillars: [
    {
      title: 'First-Time-Right Design',
      tag: 'Quality',
      description: 'Our proven design practices ensure superior product quality, extended availability, and high fault coverage. Simulation, signal integrity analysis, and thermal modeling happen before you commit to silicon or tooling—minimizing revision cycles.'
    },
    {
      title: 'One Roof, Full Stack',
      tag: 'End-to-End',
      description: 'System architecture, hardware design, firmware, FPGA, mechanical enclosures, prototyping, regulatory certifications, and pilot production—all delivered by one integrated team. No fragmented vendor chains.'
    },
    {
      title: 'Regulatory-Ready Engineering',
      tag: 'Certified',
      description: 'We design for compliance from day one—CE, FCC, BIS, WPC, RoHS, UL, ESD, and environmental testing. Certification is part of the engineering plan, with direct liaison to accredited test houses.'
    },
    {
      title: 'Cross-Domain Expertise',
      tag: 'Versatile',
      description: 'Deep experience across networking, storage, telecom, industrial automation, IoT, medical devices, wearables, consumer electronics, and power systems—from small form factor designs to complex multi-board systems.'
    }
  ],
  trustPillarsRightTitle: 'Our Engineering Philosophy',
  trustPillarsRightDescription: 'Kangqore engineers embedded products with a first-time-right methodology—designing for quality, compliance, manufacturability, and scale from the very first schematic.',
  trustPillarsRightButton: 'Request Assessment',

  preWhyKangqoreSections: embeddedDesignSystemsMetricsStrip,

  whyKangqoreIntro: `Kangqore transforms ideas into complete, production-ready embedded products—combining hardware, firmware, FPGA, and mechanical engineering under one roof with proven first-time-right methodologies.`,
  whyKangqore: [
    {
      title: 'Concept-to-Production Under One Roof',
      description: 'System architecture, hardware board design, firmware, FPGA, mechanical enclosures, prototyping, regulatory certifications, pilot production—all from a single, integrated engineering partner.'
    },
    {
      title: 'Multi-Domain Product Experience',
      description: 'Proven track record across networking equipment, storage solutions, industrial controllers, IoT gateways, medical devices, wearables, power electronics, and telecom infrastructure.'
    },
    {
      title: 'High-Speed & High-Complexity Design',
      description: 'Expertise in PCIe Gen 5, 100G Ethernet, DDR4/5, NVMe, and multi-million gate FPGA/SoC designs. We handle the hardest signal integrity and timing challenges.'
    },
    {
      title: 'Accelerated Time-to-Market',
      description: 'First-time-right methodology minimizes design revisions. From concept to working prototype in 6–8 weeks, with structured EVT/DVT phases and direct manufacturing liaison.'
    },
    {
      title: 'Manufacturing-Ready Deliverables',
      description: 'Every engagement produces production-ready outputs: Gerber files, BoM, firmware images, test jigs, mechanical drawings, certification documentation, and manufacturing support packages.'
    }
  ],

  industries: [
    { name: 'Networking & Telecom' },
    { name: 'Industrial Automation' },
    { name: 'Healthcare & Medical Devices' },
    { name: 'IoT & Connected Devices' },
    { name: 'Consumer Electronics' },
    { name: 'Energy & Power Systems' }
  ],

  customFAQs: [
    {
      question: 'What types of embedded products do you design?',
      answer: 'We design a wide range of embedded products including single board computers, system-on-modules, IoT gateways, industrial control systems, networking equipment (routers, switches, modems), medical devices, wearable electronics, data acquisition boards, protocol analyzers, power electronics (AC-DC/DC-DC supplies, inverters, UPS, solar converters), and multi-board system designs.'
    },
    {
      question: 'Do you handle both hardware and software design?',
      answer: 'Yes. We provide complete hardware-software co-design under one roof. This includes schematic capture, PCB layout, signal integrity analysis, firmware development across all major RTOS platforms (Linux, VxWorks, FreeRTOS, QNX, Zephyr), FPGA/ASIC design and verification, mechanical enclosure engineering, and IoT/edge software—all integrated into a single delivery program.'
    },
    {
      question: 'What FPGA/ASIC capabilities do you offer?',
      answer: 'Our FPGA engineering covers RTL design (VHDL/Verilog/SystemVerilog), high-speed protocol implementation (PCIe Gen 1–5, NVMe, CXL, 100G Ethernet), IP core development, ASIC prototyping in FPGA, and full verification with UVM/OVM testbenches achieving 100% code and functional coverage. We work with Xilinx/AMD, Intel (Altera), Lattice, and Actel devices.'
    },
    {
      question: 'How do you handle regulatory certifications?',
      answer: 'Regulatory compliance is built into our engineering process from the architecture phase. We design for EMI/EMC pre-compliance, conduct FMEA and MTBF analysis, prepare certification documentation, and coordinate with accredited test houses for CE, FCC, BIS, WPC, UL, RoHS, ESD, and environmental testing. This avoids costly redesigns late in the cycle.'
    },
    {
      question: 'What is your engagement model for embedded projects?',
      answer: 'We offer three models: (1) Project-based delivery for defined-scope product design engagements, (2) Dedicated engineering pods for ongoing product development and sustenance, and (3) Design audit & consulting for architecture reviews, BoM cost optimization, and technology migration roadmaps. Most new engagements start with a feasibility study and prototyping phase.'
    },
    {
      question: 'Do you support legacy product modernization and sustenance?',
      answer: 'Yes. We help enterprises modernize legacy embedded platforms—including obsolescence management, cost reduction programs, feature enhancements, technology migration (e.g., monolithic to microservices, legacy RTOS to embedded Linux), and ongoing sustenance services for products already in production.'
    }
  ],

  postFAQSections: embeddedDesignSystemsRelatedOfferings,
};

// ─── 2. engineering-rd-services ───────────────────────────────────────────────

// R&D Center of Excellence — preWhyKangqoreSections in legacy
const engineeringRDServicesCoESection = (
  <section className="py-24 lg:py-32 overflow-hidden relative bg-[#FEFFFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* ==================== TWO-COLUMN LAYOUT ==================== */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">

        {/* LEFT: Strategic Intro */}
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight">
            The R&D Solutions <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Center of Excellence</span>
          </h2>
          <div className="relative pl-6 border-l-[3px] border-brand-blue" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
            <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
              Kangqore's R&D CoE is built on the <strong className="text-brand-blue">R&D Framework™</strong> — six proprietary solution accelerators forming a unified product intelligence architecture: <strong className="text-brand-blue">UX Analytics</strong>, <strong className="text-brand-blue">MIDAS</strong>, <strong className="text-brand-blue">AAPRISE</strong>, <strong className="text-brand-blue">Agile Delivery</strong>, <strong className="text-brand-blue">WSAPI</strong>, and <strong className="text-brand-blue">DEP</strong>.
            </p>
            <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              This unified architecture delivers end-to-end product intelligence — from real-time user analytics and connected M2M data fabrics to mobile app intelligence, agile engineering, web service abstraction, and developer community enablement. Enterprise-grade, governed, and outcome-assured.
            </p>
          </div>
        </div>

        {/* RIGHT: Diamond Diagram */}
        <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          {/* Desktop Diamond Layout */}
          <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
            <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">

              <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="erd-coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                </defs>
                <circle cx="300" cy="40" r="7" fill="url(#erd-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#erd-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                <circle cx="40" cy="300" r="7" fill="url(#erd-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#erd-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                <circle cx="300" cy="560" r="7" fill="url(#erd-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#erd-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                <circle cx="560" cy="300" r="7" fill="url(#erd-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#erd-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
              </svg>

              {/* ===== TRUE 3D DIAMOND ===== */}
              <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                  transform: 'rotate(45deg) rotateX(12deg)',
                  transformStyle: 'preserve-3d',
                  animation: 'diamond-float-3d 6s ease-in-out infinite',
                  filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                }}>
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Top Left -> UX Analytics */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>UX</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Analytics</span>
                      </div>
                    </div>
                    {/* Top Right -> MIDAS */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>MIDAS</span>
                      </div>
                    </div>
                    {/* Bottom Left -> AAPRISE */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>AAPRISE</span>
                      </div>
                    </div>
                    {/* Bottom Right -> Agile Delivery */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Agile</span>
                        <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== BULLET LABELS ===== */}
              <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>User behavior tracking & heatmaps</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Session replay & funnel analytics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>A/B testing & conversion optimization</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>M2M data ingestion & telemetry</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Predictive analytics & anomaly detection</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Edge-to-cloud integration pipelines</span></li>
                </ul>
              </div>
              <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>Mobile app performance tracking</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>User retention & churn analytics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Crash reporting & diagnostics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Sprint-based iterative delivery</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>CI/CD pipeline automation</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Velocity tracking & burndown analytics</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { title: 'UX Analytics', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['User behavior heatmaps', 'Session replay & funnels', 'Conversion optimization'] },
              { title: 'MIDAS', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['M2M data ingestion', 'Predictive analytics', 'Edge-to-cloud pipelines'] },
              { title: 'AAPRISE', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['App performance tracking', 'Retention & churn analytics', 'Crash diagnostics'] },
              { title: 'Agile Delivery', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Sprint-based delivery', 'CI/CD automation', 'Velocity analytics'] }
            ].map((quadrant, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {quadrant.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== KEY DIFFERENTIATORS — MNC-GRADE ==================== */}
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            {
              num: 1,
              title: 'Proprietary IP — R&D Framework™',
              text: 'Six battle-tested, IP-protected solution accelerators — UX Analytics, MIDAS, AAPRISE, Agile Delivery, WSAPI, and DEP — each reducing deployment time by 40–60% vs. custom-build alternatives.'
            },
            {
              num: 2,
              title: 'AI-First Product Engineering',
              text: 'Every accelerator embeds AI at its core — from predictive anomaly detection in MIDAS and pattern recognition in UX Analytics to intelligent crash triage in AAPRISE. AI-first engineering, not AI-bolted.'
            },
            {
              num: 3,
              title: 'Digital Thread — Unified Data Fabric',
              text: 'MIDAS and WSAPI create a seamless digital thread connecting product telemetry across embedded sensors, mobile apps, cloud dashboards, and partner APIs — one data fabric powering every decision.'
            },
            {
              num: 4,
              title: 'Developer Ecosystem Enablement',
              text: 'DEP and WSAPI power thriving developer ecosystems — API sandboxes, SDK distribution, and partner gateways that organically scale product adoption and create new revenue channels.'
            },
            {
              num: 5,
              title: 'Governed Innovation — CEO-Level Visibility',
              text: 'Every platform is tied to live KPIs, adoption dashboards, compliance checkpoints, and revenue impact metrics. Zero unmonitored R&D investment — full boardroom transparency.'
            }
          ].map((diff) => (
            <div key={diff.num} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
              <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                {diff.num}
              </div>
              <div>
                <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ERD related offerings schematic — postFAQSections in legacy
const engineeringRDServicesRelatedOfferings = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            R&D Ecosystem
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Extend your R&D capacity by integrating our solution accelerators with Kangqore's broader AI, data, and cloud portfolio.
          </p>
          <div className="space-y-4">
            {[
              { name: 'AI & Cognitive Computing', link: '/services/ai-cognitive-computing', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Embed intelligence into every product workflow.' }, // NOTE: legacy "data-ai/cognitive-services" -> ai-cognitive-computing
              { name: 'Data Engineering', link: '/services/big-data', icon: <Layers className="w-5 h-5" />, desc: 'Architect the data pipelines powering your analytics.' }, // NOTE: legacy "data-ai/data-engineering" -> big-data
              { name: 'Cloud Engineering', link: '/services/cloud-computing', icon: <Target className="w-5 h-5" />, desc: 'Build resilient cloud-native product backends.' }, // NOTE: legacy "cloud/engineering" -> cloud-computing
              { name: 'GenAI & Agentic AI', link: '/services/genai-business-services', icon: <Bot className="w-5 h-5" />, desc: 'Deploy autonomous agents for complex decisioning.' } // NOTE: legacy "data-ai/generative-ai" -> genai-business-services
            ].map((offering, idx) => (
              <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Technical Schematic */}
        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
              <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_RD_FW</span></div>
              <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ENTERPRISE</span></div>
              <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">INNOVATING</span></div>
            </div>

            <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
              <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">R&D Framework™</div>
              <div>ACCELERATING_R&D...</div>
              <div>ADOPTION: +92%</div>
            </div>

            {/* Central Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                 <Cpu className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                <Network className="w-7 h-7" />
              </div>
            </div>

            {/* Satellite Clusters */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                  <MonitorSmartphone className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">AAPRISE</span>
              </div>
            </div>
            <div className="absolute bottom-20 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <Globe2 className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">API</div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">WSAPI</span>
              </div>
            </div>
            <div className="absolute bottom-20 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative"><Code2 className="w-16 h-16 text-emerald-400" /></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">DEP</span>
              </div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="erd-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
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

const engineeringRDServices = {
  titleLine1: 'Engineering',
  titleHighlight: 'R&D Services.',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">From product vision to market dominance — at enterprise velocity.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Kangqore's Engineering R&D Services enable enterprises to build intelligent, data-driven products powered by six proprietary solution accelerators. We engineer across the full product lifecycle — from UX intelligence and connected data platforms to agile delivery frameworks and developer ecosystem enablement — delivering measurable business outcomes at every stage.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Analyze', label: 'User behavior', color: 'text-blue-500' },
    { value: 'Connect', label: 'M2M data fabrics', color: 'text-brand-blue' },
    { value: 'Accelerate', label: 'Agile delivery', color: 'text-indigo-500' },
    { value: 'Enable', label: 'Developer ecosystems', color: 'text-purple-500' }
  ],

  highFidelity: {
    narrative: {
      badge: 'ENGINEERING R&D :: ENTERPRISE GRADE',
      titleLine1: 'Engineering',
      titleHighlight: 'Product Intelligence.',
      titleLine2: 'At Enterprise Scale.',
      description: 'In the age of AI-first engineering, product innovation demands more than code — it demands intelligence systems. UX Analytics captures behavior. MIDAS connects devices. AAPRISE tracks mobile performance. Our Agile Accelerator compresses delivery cycles. WSAPI abstracts web services. DEP scales developer adoption. Six proprietary platforms. One unified R&D architecture.',
      bottleneckLabel: 'The Market Reality',
      bottleneckText: 'Siloed analytics, disconnected device data, slow release pipelines, and fragmented developer ecosystems — limiting product velocity and market share.',
      requirementLabel: 'The Enterprise Requirement',
      requirementText: 'A unified, AI-integrated R&D capability combining real-time product intelligence, connected data fabrics, agile engineering, and open developer ecosystems — governed by measurable KPIs.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      statusLabel: 'Innovation Index',
      statusValue: 'Maximized'
    },
    philosophy: {
      icon: <Cpu className="w-7 h-7 text-brand-blue" />,
      title: 'The Kangqore',
      titleHighlight: 'R&D Framework™.',
      description: 'Our proprietary R&D Framework™ organizes enterprise product engineering into six integrated solution accelerators — each battle-tested, IP-protected, and designed to deliver compounding business value.',
      pills: ['UX Analytics', 'MIDAS', 'AAPRISE', 'Agile Delivery', 'WSAPI', 'DEP']
    },
    matrix: {
      engineId: 'Engine :: KG_R&D_V3',
      title: '6-Platform R&D Architecture',
      subtext: 'Enterprise product challenges deconstructed into six proprietary, governed, and outcome-assured solution accelerators.',
      layers: [
        { title: 'UX Analytics', id: 'KG_UXA', icon: <BarChart3 />, desc: 'Real-time user behavior intelligence — heatmaps, session replay, funnel analysis, and conversion optimization.' },
        { title: 'MIDAS', id: 'KG_MID', icon: <Network />, desc: 'M2M connected data fabric — real-time telemetry, predictive analytics, fleet management, and edge-to-cloud pipelines.' },
        { title: 'AAPRISE', id: 'KG_APR', icon: <MonitorSmartphone />, desc: 'Mobile app intelligence platform — performance tracking, retention analytics, crash diagnostics, and cross-platform metrics.' },
        { title: 'Agile Delivery', id: 'KG_AGI', icon: <Rocket />, desc: 'High-velocity engineering cadences — sprint delivery, CI/CD automation, velocity tracking, and stakeholder feedback loops.' }
      ]
    },
    schematic: {
      titleLine1: 'Deliver',
      titleHighlight: 'Product Intelligence.',
      description: 'Our R&D ecosystem ensures every engineering investment delivers measurable ROI — from user insights and connected data to agile velocity and developer adoption metrics.',
      stats: [
        { label: 'User Insights', val: 'REAL-TIME' },
        { label: 'Time-to-Value', val: 'ACCELERATED' },
        { label: 'Developer Adoption', val: 'MAXIMIZED' }
      ]
    }
  },

  technologies: [
    { category: 'Analytics & User Intelligence', items: ['Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Google Analytics 4'] },
    { category: 'Connected Data & IoT Platforms', items: ['AWS IoT Core', 'Azure IoT Hub', 'Apache Kafka', 'InfluxDB', 'MQTT / CoAP'] },
    { category: 'Mobile Engineering', items: ['React Native', 'Flutter', 'Swift / SwiftUI', 'Kotlin / Jetpack', 'Firebase'] },
    { category: 'Agile & DevOps Toolchain', items: ['Jira / Confluence', 'Jenkins / GitHub Actions', 'Docker / Kubernetes', 'ArgoCD', 'SonarQube'] },
    { category: 'API Economy & Developer Tools', items: ['Swagger / OpenAPI', 'GraphQL / Apollo', 'Postman / Newman', 'Kong / Apigee', 'ReadMe.io'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Cloudflare Workers'] }
  ],
  technologiesTitle: 'R&D Solution Stack',
  technologiesDescription: "The analytics, data, mobile, DevOps, API, and cloud technologies powering our R&D Framework™.",

  capabilities: [
    {
      title: 'UX Analytics Solutions',
      description: 'User Behavior Analytics and Refinement services offer actionable insights into user behavior to improve usability and engagement. Powered by real-time session intelligence and AI-driven pattern recognition.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'User behavior tracking & heatmaps',
        'Session replay & funnel analytics',
        'Usability refinement workflows',
        'Real-time engagement scoring',
        'A/B testing & conversion optimization'
      ]
    },
    {
      title: 'MIDAS — Connected Data Fabric',
      description: 'M2M Integrated Data and Analytics Solution (MIDAS) is a platform that delivers secure, connected experiences with real-time data and insights. Enterprise IoT intelligence at scale.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-time M2M data ingestion',
        'Secure connected device management',
        'Predictive analytics & anomaly detection',
        'Fleet & asset telemetry dashboards',
        'Edge-to-cloud integration pipelines'
      ]
    },
    {
      title: 'AAPRISE — App Intelligence',
      description: 'APPRise is our mobile analytics platform that provides an intelligent way to raise your application above the competition by tracking performance, engagement, and user retention.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Mobile app performance tracking',
        'User retention & churn analytics',
        'Crash reporting & diagnostics',
        'In-app behavior intelligence',
        'Cross-platform metric unification'
      ]
    },
    {
      title: 'Agile Delivery Accelerator',
      description: 'Our Agile Delivery Accelerator helps enterprises improve customer experience with faster time to value through iterative delivery. Sprint-based engineering embedded into your product teams.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Sprint-based iterative delivery',
        'Continuous integration & deployment',
        'Cross-functional team enablement',
        'Velocity tracking & burndown analytics',
        'Stakeholder feedback loops'
      ]
    },
    {
      title: 'Web Services API Platform (WSAPI)',
      description: 'Web Services API Platform (WSAPI) enables organizations to extend their existing web-based systems as a well-designed set of services for supporting mobile applications and developers, creating new business channels.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Automated data extraction pipelines',
        'API-first web service abstraction',
        'Mobile backend service enablement',
        'Partner integration gateways',
        'Scalable scraping infrastructure'
      ]
    },
    {
      title: 'Developer Engagement Platform (DEP)',
      description: 'The Developer Engagement Platform enables faster user adoption while fostering collaboration and innovation within the developer community. Enterprise-grade API economy at scale.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'API documentation & sandbox portals',
        'Developer onboarding workflows',
        'Community collaboration tools',
        'SDK & library distribution',
        'Usage analytics & adoption tracking'
      ]
    }
  ],

  solutions: [
    {
      title: "UX Analytics Solutions",
      description: "Actionable user behavior insights that continuously improve product usability, navigation patterns, and engagement — driving product decisions with real data, not guesswork.",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: "MIDAS — Connected Data Fabric",
      description: "M2M Integrated Data and Analytics delivering secure, connected experiences with real-time telemetry, device management, and predictive intelligence across your entire product fleet.",
      icon: <Network className="w-8 h-8" />
    },
    {
      title: "AAPRISE — App Intelligence",
      description: "Our mobile analytics platform intelligently raises your application above the competition by tracking performance, retention, crash diagnostics, and in-app behavior at scale.",
      icon: <MonitorSmartphone className="w-8 h-8" />
    },
    {
      title: "Agile Delivery Accelerator",
      description: "High-velocity engineering cadences embedded directly into your product teams. Sprint-based delivery with CI/CD, burndown analytics, and stakeholder feedback loops built-in.",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      title: "Web Services API Platform (WSAPI)",
      description: "Extend web-based systems into well-designed service sets supporting mobile applications, partner integrations, and new business channels through automated data extraction.",
      icon: <Globe2 className="w-8 h-8" />
    },
    {
      title: "Developer Engagement Platform (DEP)",
      description: "A centralized platform enabling faster developer adoption through API portals, sandbox environments, SDK distribution, and community collaboration at enterprise scale.",
      icon: <Code2 className="w-8 h-8" />
    }
  ],

  trustPillars: [],

  preWhyKangqoreSections: engineeringRDServicesCoESection,

  whyKangqoreIntro: `Kangqore's Engineering R&D isn't about building features — it's about building product intelligence. Our R&D Framework™ ensures every investment in engineering delivers measurable, compounding business outcomes — at the standard expected by Fortune 500 enterprises.`,
  whyKangqore: [
    {
      title: 'Real-Time Product Intelligence',
      description: 'UX Analytics and AAPRISE deliver continuous product insights — heatmaps, session replays, mobile crash diagnostics — ensuring every product iteration is data-backed. Typical impact: 25–40% improvement in user engagement metrics.'
    },
    {
      title: 'Connected Data Fabric at Scale',
      description: 'MIDAS provides a secure M2M data fabric with edge-to-cloud pipelines, predictive analytics, and fleet telemetry — powering products that sense, respond, and adapt in real-time across millions of connected endpoints.'
    },
    {
      title: 'Agile Velocity — Embedded, Not Bolted',
      description: 'Our Agile Delivery Accelerator embeds sprint-based engineering, CI/CD automation, and velocity tracking directly into your teams. Typical impact: 40%+ reduction in time-to-value vs. traditional delivery models.'
    },
    {
      title: 'API Economy & Developer Ecosystem',
      description: 'DEP and WSAPI enable enterprises to build thriving developer communities with API sandboxes, SDK distribution, and partner integration gateways — scaling adoption organically and creating new revenue channels.'
    },
    {
      title: 'Governed Innovation — Boardroom Transparency',
      description: 'Every platform — from UX Analytics to MIDAS — is tied to live KPIs, adoption dashboards, and revenue impact metrics. Zero unmonitored R&D investment. Full CEO-level governance and compliance assurance.'
    }
  ],

  industriesTitle: 'Industries We Serve',
  industries: [
    { name: 'SaaS & Product Companies' },
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail, CPG & E-Commerce' },
    { name: 'Manufacturing & Industrial IoT' },
    { name: 'Telecommunications & Media' }
  ],

  customFAQs: [
    {
      question: 'What makes Kangqore\'s Engineering R&D different from competitors like TCS, Infosys, or Accenture?',
      answer: 'Our R&D Framework™ features six proprietary, IP-protected solution accelerators — UX Analytics, MIDAS, AAPRISE, Agile Delivery, WSAPI, and DEP. Unlike generic service delivery, each accelerator is a proven product that reduces deployment time by 40–60% while embedding AI-first intelligence and governed KPI tracking.'
    },
    {
      question: 'How does the MIDAS platform differ from standard IoT solutions?',
      answer: 'MIDAS is a full M2M Connected Data Fabric — not just an IoT gateway. It provides real-time data ingestion, predictive analytics, anomaly detection, fleet telemetry dashboards, and edge-to-cloud integration pipelines in a single governed platform. It creates a digital thread connecting every device endpoint to enterprise decision systems.'
    },
    {
      question: 'Can the Agile Delivery Accelerator integrate with our existing engineering teams?',
      answer: 'Absolutely. The Agile Delivery Accelerator is designed to embed into your existing product teams — not replace them. It provides sprint frameworks, CI/CD automation, velocity tracking, burndown analytics, and stakeholder feedback loops that enhance your team\'s capacity and speed.'
    },
    {
      question: 'What industries do you serve for Engineering R&D?',
      answer: 'We serve enterprises across SaaS, Banking & Financial Services, Healthcare, Retail & E-Commerce, Manufacturing & Industrial IoT, and Telecommunications. Our six solution accelerators are industry-agnostic in design but tailored in deployment.'
    },
    {
      question: 'How do you ensure ROI visibility on R&D investments?',
      answer: 'Every platform in our R&D Framework™ is tied to live KPIs, adoption dashboards, compliance checkpoints, and revenue impact metrics. We provide CEO-level governance with full boardroom transparency — zero unmonitored R&D spend.'
    }
  ],

  postFAQSections: engineeringRDServicesRelatedOfferings,
};

// ─── 3. product-digital-engineering ───────────────────────────────────────────

// Digital Engineering CoE — preWhyKangqoreSections in legacy
const productDigitalEngineeringCoESection = (
  <section className="py-24 lg:py-32 overflow-hidden relative bg-[#FEFFFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* ==================== TWO-COLUMN LAYOUT ==================== */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">

        {/* LEFT: Strategic Intro */}
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight">
            The Digital Engineering <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Center of Excellence</span>
          </h2>
          <div className="relative pl-6 border-l-[3px] border-brand-blue" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
            <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
              Kangqore's Digital Foundry™ provides a holistic, outcome-assured delivery structure: uniting <strong className="text-brand-blue">Platform Architecture</strong>, <strong className="text-brand-blue">Intelligent Quality</strong>, <strong className="text-brand-blue">Device Connectivity</strong>, and <strong className="text-brand-blue">Experience Design</strong>.
            </p>
            <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              By integrating these core disciplines, we eliminate execution silos. We don't just write code — we engineer unified digital enterprise systems that scale predictably and adapt continuously to market demands.
            </p>
          </div>
        </div>

        {/* RIGHT: Diamond Diagram (Adapted from DPA) */}
        <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
            <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">

              <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="pde-coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                </defs>
                <circle cx="300" cy="40" r="7" fill="url(#pde-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#pde-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                <circle cx="40" cy="300" r="7" fill="url(#pde-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#pde-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                <circle cx="300" cy="560" r="7" fill="url(#pde-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#pde-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                <circle cx="560" cy="300" r="7" fill="url(#pde-coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#pde-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
              </svg>

              {/* TRUE 3D DIAMOND */}
              <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                  transform: 'rotate(45deg) rotateX(12deg)',
                  transformStyle: 'preserve-3d',
                  animation: 'diamond-float-3d 6s ease-in-out infinite',
                  filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                }}>
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Top Left -> Platform Engineering */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Platform</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Engineering</span>
                      </div>
                    </div>
                    {/* Top Right -> Quality Engineering */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Quality</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Engineering</span>
                      </div>
                    </div>
                    {/* Bottom Left -> Experience Design */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Experience</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Design</span>
                      </div>
                    </div>
                    {/* Bottom Right -> Device Connectivity */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Smart</span>
                        <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Devices</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BULLET LABELS */}
              <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>Cloud-native architecture</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Monolith to microservices</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>API & UI modernization</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>AI-driven test automation</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Security & compliance testing</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>QCoE transformation</span></li>
                </ul>
              </div>
              <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>Human-centric UI strategy</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Frictionless UX mapping</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Interactive prototyping</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Embedded software design</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>IoT edge connectivity</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Hardware telemetry pipelines</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { title: 'Platform', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['Cloud-native architecture', 'Microservices migration', 'API modernization'] },
              { title: 'Quality', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['AI test automation', 'Security & compliance', 'QCoE setup'] },
              { title: 'Experience', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['Human-centric UX', 'Frictionless mapping', 'Prototyping'] },
              { title: 'Device', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Embedded software', 'IoT connectivity', 'Hardware telemetry'] }
            ].map((quadrant, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {quadrant.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== KEY DIFFERENTIATORS ==================== */}
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            {
              num: 1,
              title: 'Engineering DNA',
              text: 'Building products and platforms is not just development—it’s a craft. Our teams operate with an engineering-first mindset and execution maturity, embracing distributed agile, DevOps, and CloudOps to deliver quality at speed and build sustainable momentum in competitive markets.'
            },
            {
              num: 2,
              title: 'Integrated Next-Gen Technologies',
              text: 'Real transformation requires more than isolated tools. We bring an integrated capability stack across AI & GenAI, Analytics, Hyperautomation, Cybersecurity, and modern cloud engineering—so you get a cohesive end-to-end value proposition, not a fragmented multi-vendor approach.'
            },
            {
              num: 3,
              title: 'Digital Transformation with CX at the Core',
              text: 'True digital transformation is customer-led. Our consultative approach and hands-on delivery across platform engineering, data & analytics, and experience engineering help you combine intelligent data with real human insight—improving agility and elevating organizational outcomes.'
            },
            {
              num: 4,
              title: 'MVP Translation & Acceleration',
              text: 'From concept to architecture consulting, we help startups and enterprise innovation teams find product-market fit faster through rapid prototyping and lean engineering.'
            }
          ].map((diff) => (
            <div key={diff.num} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
              <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                {diff.num}
              </div>
              <div>
                <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Related Disciplines schematic (postFAQSections)
const productDigitalEngineeringRelatedSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Synergistic Ecosystem
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Disciplines.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Digital product engineering is the vanguard of transformation. Amplify its impact by integrating our data, cloud, and core automation frameworks.
          </p>
          <div className="space-y-4">
            {[
              { name: 'DevOps & CloudOps', link: '/services/cloud-computing', icon: <Workflow className="w-5 h-5" />, desc: 'Ensure continuous integration, collaboration, and unbreakable delivery pipelines.' },
              { name: 'Big Data Strategy', link: '/services/big-data', icon: <Layers className="w-5 h-5" />, desc: 'Unlock meaningful insights and drive predictive product decision-making.' },
              { name: 'Embedded Design', link: '/services/embedded-design-systems', icon: <Cpu className="w-5 h-5" />, desc: 'Precision engineering for specialized embedded microcontrollers and IoT systems.' },
              { name: 'Agentic AI', link: '/services/genai-business-services', icon: <Bot className="w-5 h-5" />, desc: 'Power next-generation autonomous workflows within your products.' },
            ].map((offering, idx) => (
              <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
              <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#DIGI_CORE</span></div>
              <div className="flex justify-between gap-4"><span>MODE:</span> <span>SCALING</span></div>
              <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">LIVE</span></div>
            </div>
            <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
              <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">SysLog</div>
              <div>PLATFORM_SYNC...</div>
              <div>LATENCY: &lt;1ms</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                <Target className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                  <Rocket className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">PROTOTYPE</span>
              </div>
            </div>
            <div className="absolute bottom-20 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <BrainCircuit className="w-12 h-12 text-white" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">COGNITIVE</span>
              </div>
            </div>
            <div className="absolute bottom-20 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative"><RadioTower className="w-16 h-16 text-emerald-400" /></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">TELEMETRY</span>
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="pde-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#pde-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#pde-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#pde-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
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

// ─── 3. product-digital-engineering ───────────────────────────────────────────
const productDigitalEngineering = {
  titleLine1: 'Product &',
  titleHighlight: 'Digital Engineering.',
  videoBackground: '/videos/network-4916894.mp4',
  description: 'Engineering excellence for next-generation products and platforms.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">At Kangqore, we combine deep engineering discipline with a high-velocity product culture.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        We help you build products, platforms, and digital experiences that customers adopt, trust, and love. Our Product & Digital Engineering services deliver enterprise-grade execution maturity to turn innovation into production-grade systems at scale.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '40% Faster', label: 'Platform Architecture', color: 'text-blue-500' },
    { value: 'Zero-Defect', label: 'Quality Engineering', color: 'text-brand-blue' },
    { value: '100% Scalable', label: 'Smart Devices', color: 'text-indigo-500' },
    { value: '10x Agility', label: 'MVP Innovation', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'DIGITAL ENGINEERING :: ENTERPRISE GRADE',
      titleLine1: 'Architect',
      titleHighlight: 'Digital Ecosystems.',
      titleLine2: 'At High Velocity.',
      description: 'The digital landscape is evolving faster than ever—creating endless opportunities to innovate and differentiate. But sustained advantage doesn’t come from ideas alone. It comes from engineering rigor, modern delivery, and the ability to turn innovation into production-grade systems at scale. Kangqore brings proven expertise to help enterprises and digital-native businesses create future-ready customer experiences, modernize platforms, and unlock new business value.',
      bottleneckLabel: 'The Market Reality',
      bottleneckText: 'Monolithic architectures, manual testing bottlenecks, disconnected devices, and slow innovation cycles stalling product momentum.',
      requirementLabel: 'The Enterprise Requirement',
      requirementText: 'A unified digital engineering core integrating cloud-native platforms, AI-driven quality assurance, connected IoT endpoints, and rapid MVP acceleration.',
      image: 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=1200',
      statusLabel: 'Engineering Velocity',
      statusValue: 'Maximized',
    },
    philosophy: {
      icon: <Cpu className="w-7 h-7 text-brand-blue" />,
      title: 'The Kangqore',
      titleHighlight: 'Digital Foundry™.',
      description: 'Our proprietary Digital Foundry™ organizes enterprise product engineering into five integrated pillars — delivering compounding business value from conceptualization to global scale.',
      pills: ['Platform Engineering', 'Quality Engineering', 'Device Engineering', 'Experience Design', 'MVP Acceleration'],
    },
    matrix: {
      engineId: 'Engine :: KG_DIGI_V2',
      title: '4-Layer Engineering Architecture',
      subtext: 'Enterprise digital challenges deconstructed into scalable, governed, and automated delivery layers.',
      layers: [
        { title: 'Platform', id: 'KG_PLAT', icon: <Layers />, desc: 'Cloud-native architecture, microservices transition, and scalable digital ecosystems.' },
        { title: 'Quality', id: 'KG_QUAL', icon: <ShieldCheck />, desc: 'AI-driven test automation, DevSecOps integration, and continuous reliability.' },
        { title: 'Device', id: 'KG_DEV', icon: <Network />, desc: 'IoT integration, embedded software, and intelligent edge computing.' },
        { title: 'Experience', id: 'KG_EXP', icon: <BrainCircuit />, desc: 'Cognitive, human-centered design bridging technical feasibility with user adoption.' },
      ],
    },
    schematic: {
      titleLine1: 'Accelerate',
      titleHighlight: 'Innovation.',
      description: 'Our Digital Engineering ecosystem ensures every code commit delivers measurable ROI — reducing time-to-market while ensuring absolute reliability.',
      stats: [
        { label: 'Time-to-Market', val: 'ACCELERATED' },
        { label: 'Platform Scalability', val: 'INFINITE' },
        { label: 'Quality Assurance', val: 'AUTOMATED' },
      ],
    },
  },

  capabilities: [
    {
      title: 'Next-Gen Platform Engineering',
      description: 'Build high-performing modern solutions bridging cloud-native architectures and AI-driven automation. We transform legacy monoliths into agile microservices, enabling true digital scale.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Cloud-native platform development', 'Monolith to microservices migration', 'Backend, API, and UI optimization', 'Azure & AWS migration accelerators', 'High-availability ecosystem design'],
    },
    {
      title: 'AI-Driven Quality Engineering (QE)',
      description: 'Transform QA from a cost center to a business enabler. Our automation-first, risk-based QE approach leverages AI and ML to accelerate testing without compromising absolute reliability.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Intelligent test automation frameworks', 'GenAI-powered test case generation', 'Cloud & Packaged application testing', 'Performance, security & compliance testing', 'Quality Center of Excellence (QCoE) setup'],
    },
    {
      title: 'Smart Device & IoT Engineering',
      description: 'Develop cutting-edge hardware solutions and modernize existing devices. We connect physical assets to the digital thread, enabling intelligent automation and real-time edge computing.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Embedded software & firmware development', 'End-to-end device prototyping & design', 'Digital twin & edge computing solutions', 'Regulatory certification & compliance', 'Hardware-to-cloud telemetry pipelines'],
    },
    {
      title: 'Cognitive Experience Design',
      description: 'Grounded in Human-Centered Design, our 5DE approach unites people, businesses, and technologies. We craft digital experiences that drive user adoption, retention, and trust.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Empathy-driven UX/UI strategy', 'Frictionless user journey mapping', 'Interactive prototyping & validation', 'Technical feasibility alignment', 'Cross-platform experience consistency'],
    },
    {
      title: 'MVP & Innovation Acceleration',
      description: 'Bring innovations to life before your competitors do. Our Digital Foundry offering is designed for startups and enterprise innovation labs needing rapid, scalable product conceptualization.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Rapid concept-to-prototype cycles', 'Minimum Viable Product (MVP) engineering', 'Product architecture consulting', 'Lean innovation team augmentation', 'Fast-fail learning iterations'],
    },
  ],

  technologies: [
    { category: 'Next-Gen Platform Engineering', items: ['AWS / Azure', 'Docker / Kubernetes', 'Spring Boot', 'Node.js', 'Go'] },
    { category: 'AI-Driven Quality Engineering', items: ['Selenium / Cypress', 'Appium', 'JMeter', 'SonarQube', 'AI Test Gen (GenAI)'] },
    { category: 'Smart Device & IoT Engineering', items: ['C / C++', 'Python', 'MQTT / AMQP', 'FreeRTOS', 'Azure IoT Edge'] },
    { category: 'Cognitive Experience Design', items: ['Figma', 'Framer', 'React / Next.js', 'Three.js / WebGL', 'Tailwind CSS'] },
    { category: 'MVP & Innovation Acceleration', items: ['Vercel', 'Firebase / Supabase', 'GraphQL', 'Tailwind CSS', 'Vercel AI SDK'] },
  ],

  solutions: [
    { title: 'Next-Gen Platform Engineering', description: 'Scalable, cloud-native architectures that transition your monolithic systems into high-performing, agile digital ecosystems.', icon: <Layers className="w-8 h-8" /> },
    { title: 'AI-Driven Quality Engineering', description: 'Intelligent test frameworks powered by AI to ensure software reliability, accelerate delivery, and transform QA into a strategic asset.', icon: <ShieldCheck className="w-8 h-8" /> },
    { title: 'Smart Device Engineering', description: 'From embedded systems to digital twins, we modernize hardware to interact seamlessly within your connected enterprise.', icon: <Cpu className="w-8 h-8" /> },
    { title: 'Cognitive Experience Design', description: 'Human-centered UI/UX that eliminates friction, builds empathy, and guarantees technical feasibility at scale.', icon: <BrainCircuit className="w-8 h-8" /> },
    { title: 'Innovation Acceleration', description: 'Rapid MVP development and architecture consulting via our Digital Foundry, getting your best ideas to market faster.', icon: <Rocket className="w-8 h-8" /> },
  ],

  preWhyKangqoreSections: productDigitalEngineeringCoESection,

  whyKangqoreIntro: "Kangqore's Product & Digital Engineering practice isn't just about modernizing code — it's about accelerating market dominance. We bring enterprise-grade scale with startup-like velocity.",
  whyKangqore: [
    { title: 'Pimcore', description: 'Kangqore’s expertise in the Pimcore solutions empowers enterprises to drive innovation and accelerate growth in today’s dynamic digital landscape.' },
    { title: 'Managed Content as a Service', description: 'Enabling real time, relevant digital asset delivery and discovery on the device, and channel of choice is imperative for creating differentiation in the digital business world. Intelligent solutions that can streamline, optimize, and manage digital experiences through content are the need of the hour.' },
    { title: 'Kangqore IoT Fabric', description: 'With the exponential increase in the number of connected IoT devices, enterprises are prioritizing data monetization. Proprietary IoT platforms are now non-negotiable. Kangqore IoT Fabric provides a secure, enterprise-grade infrastructure to guarantee the smooth, scalable implementation of your connected device ecosystem.' },
    { title: 'Anomaly Detection', description: 'The digital world has changed dramatically in the last few years. Global data production is expected to double every two years through 2026. While every business races to harness the power of this digital universe, the sheer velocity and variety of information easily overwhelms legacy systems. Our anomaly detection delivers precise insights through the noise.' },
  ],

  industryTitle: 'Industries We Empower',
  industries: [
    { name: 'Healthcare & Life Sciences' },
    { name: 'EdTech & Digital Learning' },
    { name: 'Industrial & Manufacturing' },
    { name: 'Banking & Financial Services' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Media & Entertainment' },
  ],

  customFAQs: [
    { question: 'What is the Digital Foundry offering?', answer: 'The Digital Foundry is our specialized innovation engine designed to help startups, digital natives, and enterprise teams accelerate their concept-to-prototype cycle. We provide MVP engineering, architecture consulting, and rapid market validation.' },
    { question: 'How does your Quality Engineering differ from traditional testing?', answer: 'Traditional testing is reactive and manual. Our Quality Engineering (QE) is an automation-first, risk-based approach leveraging AI/ML and GenAI. We build intelligent test frameworks that integrate directly into continuous delivery pipelines, transforming QA into a strategic enabler.' },
    { question: 'Do you help with legacy system modernization?', answer: 'Yes. Our Platform Engineering practice specializes in transitioning monolithic, legacy architectures into modular, cloud-native microservices on AWS and Azure, ensuring high performance and unconstrained scalability.' },
    { question: 'What is involved in Device Engineering?', answer: 'Our Device Engineering practice covers the intersection of physical hardware and digital platforms. This includes embedded software design, FPGA/VLSI design, and the creation of intelligent IoT, digital twin, and edge computing networks.' },
  ],

  postFAQSections: productDigitalEngineeringRelatedSection,
};

// ─── 4. devops-as-a-service ────────────────────────────────────────────────────
const devopsAsAServiceRelatedSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Operations Ecosystem
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related Engineering <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Solutions.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Elevate your DevOps maturity by integrating resilient infrastructure with our broader product engineering and cloud mastery portfolio.
          </p>
          <div className="space-y-4">
            {[
              // NOTE: legacy "/services/cloud-engineering" dept-index -> canonical service cloud-computing
              { name: 'Cloud & Infrastructure Services', link: '/services/cloud-computing', icon: <Layers className="w-5 h-5" />, desc: 'Build the foundational infrastructure hosting your pipelines.' },
              { name: 'Digital Process Automation', link: '/services/digital-process-automation', icon: <Workflow className="w-5 h-5" />, desc: 'Scale automation outside the engineering department.' },
              { name: 'Quality Engineering', link: '/services/quality-engineering-assurance', icon: <ShieldCheck className="w-5 h-5" />, desc: 'Automate test paradigms directly into your deployment cycle.' },
              // NOTE: legacy "saas-product-development" not canonical -> software-development
              { name: 'SaaS Product Development', link: '/services/software-development', icon: <Target className="w-5 h-5" />, desc: 'Architect multi-tenant products built to leverage DevOps efficiency.' },
            ].map((offering, idx) => (
              <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-6">
            <Link to="/services" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
              Explore Services
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <div className="hidden sm:block text-sm text-gray-400 font-mono italic">// ARCHITECTING_RESILIENCE...</div>
          </div>
        </div>
        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                <Activity className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="devo-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
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

const devopsAsAService = {
  titleLine1: 'Absolute',
  titleHighlight: 'Resilience.',
  videoBackground: '/videos/network-loop.mp4',
  description: 'Accelerate deployment cycles. Engineer self-healing environments. Scale with unyielding certainty across any cloud architecture.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Kangqore dominates operations engineering, eliminating delivery friction to guarantee absolute platform stability.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        We recognize that today's deployment operations demand more than just automation. We architect governed, immutable, and natively scalable infrastructures that radically accelerate your delivery velocity while definitively neutralizing operational risk.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Optimize', label: 'Delivery Pipelines', color: 'text-blue-500' },
    { value: 'Eradicate', label: 'Deployment Friction', color: 'text-brand-blue' },
    { value: 'Secure', label: 'Maximum Resilience', color: 'text-indigo-500' },
    { value: 'Govern', label: 'Cloud Infrastructure', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Enterprise Excellence :: 2026',
      titleLine1: 'Enterprise',
      titleHighlight: 'DevOps as a Service.',
      titleLine2: 'At Scale.',
      description: 'We architect absolute deployment supremacy. Moving beyond incremental pipeline optimization, Kangqore embeds immutable governance, cognitive automation, and measurable business velocity into your enterprise DNA. We engineer the operational foundation required to dominate your market.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Manual friction, brittle legacy architectures, and systemic delivery bottlenecks paralyzing enterprise scaling velocity.',
      requirementLabel: 'The Requirement',
      requirementText: 'Zero-trust, completely autonomous, and natively scalable operations ecosystems engineered for unyielding resilience.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      statusLabel: 'Deployment Velocity',
      statusValue: 'Maximized',
    },
    philosophy: {
      icon: <Zap className="w-7 h-7 text-brand-blue" />,
      title: 'DevOps',
      titleHighlight: 'Outcome-First Design.',
      description: "We mandate that every infrastructure transformation delivers exponential enterprise value. We don't just build pipelines; we forge autonomous, self-healing operational capabilities engineered for high-confidence, zero-downtime execution.",
      pills: ['Zero-Trust Security', 'Immutable Infrastructure', 'Continuous Delivery', 'Advanced Observability'],
    },
    matrix: {
      engineId: 'Engine :: DEVOPS-A_V3',
      title: 'Enablement Matrix',
      subtext: 'The ultimate DevOps lifecycle, deconstructed into autonomous, heavily governed, enterprise-grade execution layers.',
      layers: [
        { title: 'Assess', id: 'DEVO_ASSESS', icon: <Search />, desc: 'Discovery, architecture assessment, and strategic DevOps roadmap alignment.' },
        { title: 'Design', id: 'DEVO_DESIGN', icon: <Layers />, desc: 'Zero-trust infrastructure design and intelligent solution planning.' },
        { title: 'Deliver', id: 'DEVO_DEL', icon: <Activity />, desc: 'Structured implementation of GitOps workflows and CI/CD pipelines.' },
        { title: 'Govern', id: 'DEVO_GOV', icon: <ShieldCheck />, desc: 'State visualization, continuous monitoring, and infrastructure cost optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Guarantee',
      titleHighlight: 'Stability.',
      description: 'Your technical infrastructure must drive market dominance. We engineer the delivery frameworks that transform deployment metrics from unpredictable variables into guaranteed, absolute outcomes.',
      stats: [
        { label: 'Reliability', val: 'UNCOMPROMISING' },
        { label: 'Speed', val: 'ACCELERATED' },
        { label: 'Security', val: 'EMBEDDED' },
      ],
    },
  },

  capabilities: [
    { title: 'DevOps Advisory', description: 'Architect an enterprise-grade DevOps transformation roadmap. Our elite advisory team consists of highly-skilled experts who deliver irrefutable proposals to improve and elevate your operational maturity.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/cloud-infrastructure.png', items: ['Architecture gap analysis', 'DevOps maturity assessment', 'Transformation roadmap development', 'Toolchain standardization', 'Value stream mapping'] },
    { title: 'Immutable Infrastructure & GitOps', description: 'Deploy zero-trust, tamper-proof environments. Kangqore builds environments that support immutable container images that cannot be tampered with, guaranteeing absolute consistency and security.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/cloud-infrastructure.png', items: ['Infrastructure as Code (IaC) implementation', 'Container orchestration (Kubernetes)', 'GitOps workflow design', 'Security & compliance automation', 'Multi-cloud environment provisioning'] },
    { title: 'CI/CD Pipeline Development', description: 'Accelerate your delivery lifecycle. Kangqore engineers pipelines that include the latest tools to support continuous integration and continuous delivery for hyper-velocity releases.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/software-engineering.png', items: ['Automated testing integration', 'Zero-downtime deployment pipelines', 'Artifact management & security scanning', 'Build performance optimization', 'DevSecOps integration'] },
    { title: 'Deployment Strategies', description: 'Eliminate manual friction and deployment risk. Kangqore supports advanced Canary and Blue-Green deployment strategies through robust automation, ensuring seamless rollouts.', image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/business-strategy.png', items: ['Canary release automation', 'Blue-Green deployment architectures', 'A/B testing infrastructure', 'Automated rollback mechanisms', 'Traffic routing rules & service mesh'] },
    { title: 'System State Visualization & Dashboards', description: 'Achieve total operational clarity. Kangqore uses best of breed toolsets such as Grafana/Kibana to develop enhanced visualizations, reports, and real-time dashboards.', image: 'https://images.unsplash.com/photo-1543286386-713bdd548b11?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/data-analytics.png', items: ['Centralized log management', 'Distributed tracing (OpenTelemetry)', 'Custom KPI dashboards (Grafana)', 'Predictive alerting systems', 'Cloud cost optimization analytics'] },
  ],

  technologiesTitle: 'CI/CD & Infrastructure Architectures We Excel In',
  technologiesDescription: "A platform-agnostic automation stack integrating the world's leading deployment, orchestration, and observational frameworks.",
  technologies: [
    { category: 'CI/CD & Version Control', items: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD', 'Bitbucket Pipelines'] },
    { category: 'Infrastructure & Provisioning', items: ['Terraform', 'Pulumi', 'AWS CloudFormation', 'Ansible', 'Packer'] },
    { category: 'Containerization & Orchestration', items: ['Kubernetes', 'Docker', 'Amazon EKS', 'Google GKE', 'Azure AKS'] },
    { category: 'Observability & Monitoring', items: ['Datadog', 'Prometheus', 'Grafana', 'ELK Stack / Kibana', 'New Relic'] },
    { category: 'Security & Compliance', items: ['HashiCorp Vault', 'SonarQube', 'Snyk', 'Aqua Security', 'Trivy'] },
  ],

  trustPillars: [
    { title: 'DevOps Assessment', tag: 'Strategic Advisory', description: 'Request a comprehensive landscape analysis and receive: an architecture baseline, your top deployment constraints, an actionable implementation roadmap to achieve GitOps maturity. Learn More →' },
    { title: 'Immutable Architectures', tag: 'Infrastructure', description: 'Stop treating servers as pets. We deploy Infrastructure as Code (IaC) to guarantee environments that are consistent, reproducible, and impervious to manual drift configuration errors. Learn More →' },
    { title: 'Zero-Downtime Delivery', tag: 'Automation', description: 'Traditional pipelines halt features. Advanced CI/CD orchestrates flow. We embed automated testing and security checks into continuous delivery ecosystems utilizing Canary and Blue-Green strategies. Learn More →' },
    { title: 'Operational Omniscience', tag: 'Observability', description: 'Visibility must transcend basic metrics. We architect centralized telemetry, enabling predictive alerting and deep system state visualization across distributed microservices. Learn More →' },
  ],
  trustPillarsRightTitle: 'Immutable Enterprise Optimization',
  trustPillarsRightDescription: 'Kangqore provides end-to-end DevOps optimization that helps organizations accelerate deployment cycles, eliminate manual bottlenecks, and operate at unprecedented scale. By combining intelligent pipelines and deep platform engineering insights, we engineer ecosystems that are secure, cognitive, and natively scalable.',
  trustPillarsRightButton: 'Request Infrastructure Assessment',
  trustPillarsVideo: '/videos/network-loop.mp4',

  whyKangqoreIntro: 'Kangqore secures stability and deployment velocity simultaneously. We obliterate the friction between development and operations by architecting immutable infrastructure tied to automated delivery systems.',
  whyKangqore: [
    { title: 'Uncompromising Stability', description: 'We radically reduce platform outages and degraded experiences by engineering self-healing infrastructure topologies.' },
    { title: 'Real-Time Mitigation', description: 'Detect incidents instantaneously as they happen and execute automated mitigation strategies to minimize customer impact.' },
    { title: 'Predictive Defense Mechanisms', description: 'Analyze telemetry to predict when issues or bottlenecks are likely to take place, then deploy prophylactic safeguards against catastrophic failure.' },
    { title: 'Accelerated Scaling', description: 'Achieve total DevOps scalability with modular architectures that adapt instantly to variable market demands without structural refactoring.' },
    { title: 'Value-First Governance', description: 'Every pipeline and environment configuration is tied to live KPIs, ROI dashboards, and compliance checkpoints — securing operational excellence.' },
  ],

  industryTitle: 'Industry-Specific Pipeline Optimization',
  industries: [
    { name: 'Banking & Financial Services' },
    { name: 'SaaS Platforms & Independent Software Vendors' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'E-commerce & Retail' },
    { name: 'Technology, Media & Telecom' },
  ],

  customFAQs: [
    { question: 'How does Kangqore achieve DevOps stability for our clients?', answer: 'We ensure DevOps stability in the following ways:\n• Reduce platform outages and degraded experiences.\n• Detect incidents when they happen and develop mitigation strategies in real-time to minimize customer impact.\n• Predict when issues/problems are likely to take place and then develop defense mechanisms against a catastrophic failure.' },
    { question: 'How does Kangqore improve DevOps resilience for our clients?', answer: 'We build highly-available, multi-region architectures leveraging Kubernetes and immutable infrastructure patterns. By decoupling stateful components and utilizing traffic routing policies with service meshes, our environments automatically redirect load around degraded nodes—guaranteeing uninterrupted user experiences.' },
    { question: 'How does Kangqore achieve DevOps scalability for our clients?', answer: 'We utilize cloud-native horizontal pod auto-scaling and elasticity parameters governed by metrics like CPU, memory, and custom queues. Accompanied by Infrastructure as Code (IaC), this allows enterprises to seamlessly scale resources vertically and horizontally instantaneously to meet demand volatility.' },
  ],

  postFAQSections: devopsAsAServiceRelatedSection,
};

// ─── 5. managed-infrastructure-services ────────────────────────────────────────
const managedInfrastructureServicesRelatedSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Operations Ecosystem
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Take a holistic approach to your operations. Speed up digital transformation across a variety of journeys by exploring our integrated enterprise capabilities.
          </p>
          <div className="space-y-4">
            {[
              // NOTE: legacy "cybersecurity/managed-security-services" not canonical -> it-security-services
              { name: 'Managed Security Services', link: '/services/it-security-services', icon: <ShieldCheck className="w-5 h-5" />, desc: 'Deploy absolute cyber resilience alongside your managed infrastructure.' },
              { name: 'Software Defined Infrastructure', link: '#', icon: <Server className="w-5 h-5" />, desc: 'Modernize environments with infrastructure driven strictly by code.' },
              // NOTE: legacy "cloud-data-center-advisory-transformation" not canonical -> modernization-infrastructure
              { name: 'Cloud & Data Center Advisory', link: '/services/modernization-infrastructure', icon: <Database className="w-5 h-5" />, desc: 'Expert strategic consulting to modernize and migrate your core assets.' },
              // NOTE: legacy "digital-workspace" not canonical -> managed-infrastructure-services
              { name: 'Workspace Transformation', link: '/services/managed-infrastructure-services', icon: <Monitor className="w-5 h-5" />, desc: 'Re-engineer productivity with secure, agile digital environments.' },
            ].map((offering, idx) => (
              <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-6">
            <Link to="/services" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
              Explore Services
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <div className="hidden sm:block text-sm text-gray-400 font-mono italic">// ARCHITECTING_RESILIENCE...</div>
          </div>
        </div>
        <div className="lg:w-5/12 relative flex justify-center items-center">
          <div className="relative aspect-square w-full max-w-[450px] mx-auto flex justify-center items-center">
            <div className="absolute w-[350px] h-[350px] flex items-center justify-center z-0">
              <div className="absolute w-full h-[2px] border-t-2 border-dashed border-blue-200/50 rotate-45"></div>
              <div className="absolute w-[2px] h-full border-l-2 border-dashed border-blue-200/50 rotate-45"></div>
              <div className="absolute inset-0 rotate-45 pointer-events-none">
                <div className="absolute top-[0] left-1/2 -translate-x-1/2 -translate-y-[3px] w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <div className="absolute bottom-[0] left-1/2 -translate-x-1/2 translate-y-[3px] w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <div className="absolute left-[0] top-1/2 -translate-x-[3px] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <div className="absolute right-[0] top-1/2 translate-x-[3px] -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="relative w-[280px] h-[280px] bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[48px] shadow-[0_20px_80px_rgba(37,100,234,0.07)] border border-gray-100 flex items-center justify-center z-20 overflow-hidden group hover:shadow-[0_20px_80px_rgba(37,100,234,0.12)] transition-all duration-500">
              <div className="absolute inset-5 border border-blue-200/50 rounded-[36px] border-dashed z-10 pointer-events-none group-hover:border-brand-blue/30 transition-colors duration-500"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-gradient-to-br from-blue-50/80 to-blue-100/10 rotate-45 rounded-[40px] overflow-hidden z-0">
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'linear-gradient(rgba(37,100,234,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(37,100,234,0.15) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              </div>
              <div className="relative z-30 transform group-hover:scale-105 transition-transform duration-500">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue drop-shadow-sm">
                  <rect x="9.5" y="4" width="5" height="5" rx="1" fill="white" />
                  <rect x="3.5" y="15" width="5" height="5" rx="1" fill="white" />
                  <rect x="15.5" y="15" width="5" height="5" rx="1" fill="white" />
                  <path d="M12 9v4" />
                  <path d="M6 15v-1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const managedInfrastructureServices = {
  titleLine1: 'Absolute',
  titleHighlight: 'Control.',
  videoBackground: '/videos/network-loop.mp4',
  description: 'Unify Cloud & DC, Workspaces, and Enterprise Networks under one absolute command.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Kangqore orchestrates your entire hybrid ecosystem from Cloud & DC infrastructure to End-user Workspaces.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        We engineer robust, intelligent managed infrastructure solutions across five core pillars: Cloud & DC, Database Platforms, Digital Workspaces, Enterprise Networks, and Cross-functional NOC/SOC operations. We eradicate friction, radically optimize costs, and enforce absolute security across your global footprint.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Eradicate', label: 'Management Burden', color: 'text-blue-500' },
    { value: 'Optimize', label: 'Infrastructure Costs', color: 'text-brand-blue' },
    { value: 'Enhance', label: 'Security Posture', color: 'text-indigo-500' },
    { value: 'Gain', label: 'Real-Time Visibility', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Enterprise Excellence :: 2026',
      titleLine1: 'Omni-Functional',
      titleHighlight: 'Managed Infrastructure.',
      titleLine2: 'At Scale.',
      description: 'We deliver comprehensive Managed Infrastructure solutions encompassing critical database administration, next-gen enterprise networking, and 24/7 cross-functional service desk operations. Kangqore transcends basic support by embedding cognitive automation across your entire IT stack.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Disjointed management across Cloud Ops, legacy networks, and disparate digital workspaces paralyzing your enterprise velocity.',
      requirementLabel: 'The Requirement',
      requirementText: 'A unified, governed managed services capability providing absolute operational transparency across all infrastructure pillars.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Infrastructure Operations',
      statusValue: 'Autonomous',
    },
    philosophy: {
      icon: <Zap className="w-7 h-7 text-brand-blue" />,
      title: 'Infrastructure',
      titleHighlight: 'Outcome-First Design.',
      description: 'Our philosophy dictates that every domain—whether it is securing enterprise networks, managing VDI workspaces, or tuning high-availability databases—must deliver compounding enterprise value driven by rigorous ITSM processes.',
      pills: ['Cross-functional NOC', 'ITIL Governed', 'Cloud & DC Optimized', 'Workspace SecOps'],
    },
    matrix: {
      engineId: 'Engine :: MIS_ORCHECTRATOR_V3',
      title: 'Enablement Matrix',
      subtext: 'The definitive managed infrastructure lifecycle spanning Cloud, Databases, Workspaces, and Networks.',
      layers: [
        { title: 'Assess', id: 'MANA_ASSESS', icon: <Search />, desc: 'Deep infrastructure discovery spanning cloud, DC, and enterprise networks.' },
        { title: 'Design', id: 'MANA_DESIGN', icon: <Layers />, desc: 'Seamless transition design for complex VDI workspaces and database platforms.' },
        { title: 'Govern', id: 'MANA_GOV', icon: <ShieldCheck />, desc: 'Strict ITIL process governance, vendor management, and IP address control.' },
        { title: 'Optimize', id: 'MANA_OPT', icon: <Activity />, desc: 'Continuous performance tuning across cross-functional service desk operations.' },
      ],
    },
    schematic: {
      titleLine1: 'Guarantee',
      titleHighlight: 'Resilience.',
      description: 'Your IT infrastructure investment must drive market advantage. We implement cognitive management frameworks that transform volatile operational metrics into guaranteed, optimized outcomes.',
      stats: [
        { label: 'Uptime', val: 'UNCOMPROMISING' },
        { label: 'Efficiency', val: 'MAXIMIZED' },
        { label: 'Compliance', val: 'ABSOLUTE' },
      ],
    },
  },

  capabilities: [
    { title: 'Cloud & DC Infrastructure', description: 'Commanding hybrid cloud and physical deployments. Kangqore ensures your servers, storage, and distributed virtual networks execute with absolute precision and maximum efficiency.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/cloud-infrastructure.png', items: ['Cloud Managed Services (CloudOps, DevOps & FinOps)', 'Data Center Management (Physical, Virtual, Storage & Backup)', 'DC & Cloud Networking Support'] },
    { title: 'Databases & Application Platforms', description: 'Guaranteeing data superiority. We provide uncompromising administration and engineering services for elite database architectures and complex middleware to secure unbreakable application platforms.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/data-analytics.png', items: ['Database & Middleware Administration', 'Database Engineering Services', 'Application Platform Maintenance and Support'] },
    { title: 'Digital Workspaces', description: 'Frictionless enterprise productivity. Kangqore engineers and manages secure end-user environments, seamless directory services, and advanced implementations to enable absolute workforce mobility.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/business-strategy.png', items: ['End-User Device Management', 'Enterprise Directory Services', 'Messaging and Collaboration', 'Enterprise Mobility Management', 'Virtual Desktop Infrastructure (VDI) and DaaS'] },
    { title: 'Enterprise Networks', description: 'Architecting unyielding perimeters. We provide granular management of your LAN, WAN, and Wireless ecosystems alongside sophisticated zero-trust network security devices and IP address management.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/cloud-infrastructure.png', items: ['LAN, WAN & Wireless Network Management', 'Network Security Device Management', 'DNS, DHCP, IP Address Management', 'IP Telephony, Audio and Video System Support'] },
    { title: 'Cross-functional Services', description: 'Total operational omniscience. Benefit from our 24/7 Enterprise NOC, intelligent global service desk, and rigorous ITSM process management driven by powerful reporting and predictive analytics.', image: 'https://images.unsplash.com/photo-1543286386-713bdd548b11?auto=format&fit=crop&q=80', bgImage: '/images/capabilities/growth-marketing.png', items: ['Global Service Desk Operations', 'Enterprise Monitoring & NOC Services', 'IT Asset Management', 'Strategic Vendor Management', 'Rigorous ITSM Process Management', 'Operational Reporting and Analytics'] },
  ],

  technologiesTitle: 'Core Infrastructure Management Architectures',
  technologiesDescription: "A platform-agnostic automation and orchestration stack integrating the world's leading deployment and observational frameworks.",
  technologies: [
    { category: 'Cloud Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud Platform (GCP)'] },
    { category: 'Infrastructure Management', items: ['VMware vSphere', 'Nutanix', 'Cisco Intersight', 'Ansible'] },
    { category: 'Networking & Security', items: ['Cisco Meraki', 'Palo Alto Networks', 'Fortinet', 'F5 Networks'] },
    { category: 'ITSM & Monitoring', items: ['ServiceNow', 'Datadog', 'Splunk', 'SolarWinds'] },
    { category: 'Digital Workspace', items: ['Microsoft 365', 'Citrix Workspace', 'VMware Horizon', 'Microsoft Intune'] },
  ],

  trustPillars: [
    { title: 'Kangqore Cognitive Platform', tag: 'AI-First', description: 'Our intelligent platform utilizes machine learning for real-time insights and automation, enabling a radically proactive approach to IT infrastructure management. Predict failures before they occur.' },
    { title: 'Zero-Drift IT Governance', tag: 'Methodology', description: 'We orchestrate unyielding adherence to established ITIL best practices to guarantee consistent, high-quality service delivery across incident, problem, change, and configuration management.' },
    { title: 'Kangqore Omni-Sight Telemetry', tag: 'Observability', description: "Benefit from Kangqore's proprietary one-stop solution for simplified, predictive IT operations across highly complex multi-cloud and hybrid environments." },
    { title: 'Hyper-Scale Execution Tiers', tag: 'Scalability', description: 'From Standard 24/7 support to Advanced bespoke SLA plans, we architect highly flexible, rigorous service tiers tailored to dominate specific operational and market demands.' },
  ],
  trustPillarsRightTitle: 'Immutable Enterprise Optimization',
  trustPillarsRightDescription: 'Kangqore provides end-to-end IT infrastructure management that helps organizations eradicate friction, eliminate manual bottlenecks, and operate at unprecedented scale. By combining cognitive platforms with deep engineering expertise, we assure ecosystems that are resilient, scalable, and secure.',
  trustPillarsRightButton: 'Request IT Landscape Analysis',
  trustPillarsVideo: '/videos/network-loop.mp4',

  whyKangqoreIntro: 'Kangqore Technologies Limited is an AI-led, customer-first digital engineering and Mindful IT fortress. Guided by two core philosophies, high-impact solutions for customers and uncompromising resilience, Kangqore combines a verticalized approach from chip to cloud with expertise in AI, automation, and disruptive technologies to build secure, scalable, and enterprise-ready infrastructures.',
  whyKangqore: [
    { title: 'Absolute Enterprise Scale', description: 'Managing operations for billion-dollar corporations worldwide with unyielding precision and massive Annualized Revenues backing our stability.' },
    { title: 'Global SOC/NOC Footprint', description: 'Continuous 24/7/365 surveillance, predictive operations, and rapid incident resolution across our elite global delivery centers.' },
    { title: 'Elite Strategic Partnerships', description: 'Deep, certified integrations with Microsoft, AWS, Google Cloud, and defining technology leaders to ensure unparalleled infrastructure access.' },
    { title: 'Cognitive IT Optimization', description: 'Leveraging AI-first predictive monitoring to automatically identify cost anomalies, security vulnerabilities, and deployment redundancies.' },
    { title: 'Industry-Focused Solutions', description: 'Proprietary platforms deployed across specialized verticals ensuring your infrastructure complies with the strict architectural demands of your market.' },
  ],

  industryTitle: 'Industry-Specific Infrastructure Operations',
  industries: [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology, Media & Telecom' },
    { name: 'Manufacturing & Industry 4.0' },
  ],

  customFAQs: [
    { question: 'How does Kangqore optimize infrastructure management over maintaining an internal team?', answer: 'Kangqore eradicates the limitations of internal teams by providing 24/7/365 access to elite, certified engineers backed by our cognitive ELLIPSE platform and WATCH360 monitoring. We assume full accountability for uptime, patching, and incident resolution—allowing your internal talent to focus entirely on specialized, revenue-generating initiatives rather than reactive firefighting.' },
    { question: "How smooth is the transition to Kangqore's Managed Infrastructure Services?", answer: 'Flawless. Whether deploying a new greenfield environment or taking over a well-established legacy system, our proven Enterprise Service Transition methodology ensures a seamless handover. We execute rigorous knowledge transfers, architecture documentation, and parallel testing to guarantee absolute zero disruption to your active enterprise operations.' },
    { question: 'Can Kangqore handle massive, multi-regional hybrid cloud architectures?', answer: 'Absolutely. We architect and govern some of the most complex hybrid and multi-cloud environments globally. Our deep strategic partnerships with AWS, Azure, and Google Cloud, combined with advanced CloudOps and FinOps practices, mean we excel at ensuring consistency, security, and cost-efficiency across highly dispersed geographic nodes.' },
  ],

  postFAQSections: managedInfrastructureServicesRelatedSection,
};
