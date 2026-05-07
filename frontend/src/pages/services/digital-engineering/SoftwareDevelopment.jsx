import React, { useEffect, useRef, useState } from 'react';
import {
  Rocket, Zap, Target, Layers, Search, BarChart3,
  LayoutTemplate, MonitorSmartphone, Server, CalendarDays,
  CheckCircle2, Cpu, Radar, ArrowRight, ChevronRight, ChevronDown,
  TrendingUp, Activity, Users, ShieldCheck, Workflow,
  Lightbulb, LineChart, Shield, Gauge, Palette,
  Compass, BrainCircuit, Package, Settings, Cloud,
  Briefcase, RefreshCw, Code2, Database, Smartphone,
  Wrench, Globe, Network, Bot, Lock, TestTube, Blocks
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SoftwareDevelopment = () => {
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef = useRef(null);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [openFutureAccordion, setOpenFutureAccordion] = useState(0);

  useEffect(() => {
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
    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  // ============================================
  // CAPABILITIES — 12 Premium Cards
  // ============================================
  const capabilities = [
    {
      title: "Product Discovery & Solution Framing",
      description: "Define the right product before development effort compounds. Kangqore helps organizations shape stronger software direction before engineering begins by bringing together business goals, user needs, workflow understanding, and technical thinking.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: ["Idea validation and requirement clarity", "User, workflow, and market-context discovery", "MVP and roadmap definition", "Solution framing and scope prioritization"],
      micro: "Clear direction before the first line of code."
    },
    {
      title: "UI/UX Design Services",
      description: "Create digital experiences that are intuitive, usable, and aligned to product intent. We design software experiences that are not only visually refined, but also practical, user-centered, and conversion-aware.",
      bgImage: '/images/capabilities/ux-design.png',
      items: ["UX strategy and journey mapping", "Wireframes and interface design", "Interaction logic and design systems", "Usability-focused product experience design"],
      micro: "Interfaces that convert and retain."
    },
    {
      title: "Custom Software Development",
      description: "Build tailored software aligned to your business logic, operations, and growth model. Kangqore develops custom software solutions that reflect how your business actually works.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: ["Custom web and enterprise applications", "Platform and product engineering", "Business workflow enablement", "Scalable, maintainable software delivery"],
      micro: "Software shaped by your business, not generic templates."
    },
    {
      title: "Mobile Application Development",
      description: "Launch mobile experiences that are performance-ready and user-centered across devices. We create mobile applications that combine smooth UX, reliable performance, and modern engineering standards.",
      bgImage: '/images/capabilities/data-analytics.png',
      items: ["iOS and Android application development", "Cross-platform mobile engineering", "Mobile UX and interface delivery", "Testing, release, and optimization support"],
      micro: "Mobile-first, performance-always."
    },
    {
      title: "Cloud Application Development",
      description: "Develop cloud-native applications with better scalability, resilience, and flexibility. Kangqore builds cloud-ready applications that support modern deployment and easier scaling.",
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ["Cloud-ready architecture planning", "Modern application deployment patterns", "Reliability and performance optimization", "Integration with cloud ecosystems"],
      micro: "Born in the cloud, built for scale."
    },
    {
      title: "DevOps & Delivery Enablement",
      description: "Accelerate release cycles and improve delivery confidence through modern engineering operations. We help teams release faster, reduce deployment friction, and improve engineering consistency.",
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ["CI/CD pipeline enablement", "Infrastructure automation", "Environment orchestration", "Faster, safer release workflows"],
      micro: "Ship with speed and confidence."
    },
    {
      title: "Software Testing & Quality Engineering",
      description: "Strengthen software quality through disciplined testing and release assurance. Kangqore helps teams improve confidence in every release through structured quality engineering practices.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: ["Functional and regression testing", "Performance and reliability validation", "Security-aware testing support", "QA strategy and release confidence"],
      micro: "Quality is a discipline, not a checkpoint."
    },
    {
      title: "Application Support & Maintenance",
      description: "Keep software healthy, current, and operational after launch. Kangqore provides structured support and maintenance services that help teams sustain application stability and resolve issues faster.",
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ["Issue resolution and enhancement support", "Patching and maintenance cycles", "Performance and uptime support", "Long-term application sustainability"],
      micro: "Software value extends far beyond release day."
    },
    {
      title: "Legacy System Modernization",
      description: "Transform aging applications into more agile, scalable, and future-fit software assets. Kangqore brings together assessment, refactoring, migration, and architecture renewal.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: ["Legacy assessment and modernization planning", "Architecture and platform renewal", "Migration and refactoring strategies", "Continuity-led transformation execution"],
      micro: "Evolve without disruption."
    },
    {
      title: "SaaS Application Development",
      description: "Create scalable SaaS platforms with stronger multi-tenant, operational, and growth readiness. Kangqore designs and engineers SaaS products built for recurring delivery and platform flexibility.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: ["SaaS product design and engineering", "Subscription and platform architecture", "Scalable cloud-based deployment", "Extensible product foundations"],
      micro: "Platforms that grow with your customer base."
    },
    {
      title: "System Integration Services",
      description: "Improve operational efficiency by connecting applications, platforms, and data flows. Kangqore helps organizations integrate platforms, services, and data environments for smoother operations.",
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ["Integration architecture planning", "API and service connectivity", "Workflow and system interoperability", "Enterprise data movement enablement"],
      micro: "Connected systems. Streamlined operations."
    },
    {
      title: "Technology Consulting & Engineering Advisory",
      description: "Make sharper technology decisions with architecture, tooling, and delivery guidance. Kangqore provides technology consulting that helps organizations make better software decisions before committing effort.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: ["Solution architecture advisory", "Engineering and platform direction", "Delivery-model recommendations", "Modernization and technical planning"],
      micro: "Better decisions before bigger commitments."
    }
  ];

  // ============================================
  // VALUE WE DELIVER — Accordion
  // ============================================
  const valueItems = [
    { title: 'Strategic clarity before engineering begins', desc: 'Align business goals, user needs, scope, and solution direction before development effort expands.' },
    { title: 'Full-cycle software execution', desc: 'Move from planning and design to engineering, testing, deployment, and optimization through one structured delivery model.' },
    { title: 'Faster delivery with stronger engineering discipline', desc: 'Accelerate build velocity without sacrificing maintainability, quality, or architecture integrity.' },
    { title: 'Future-ready technical foundations', desc: 'Design software that can evolve through integrations, scaling, new modules, and changing business priorities.' },
    { title: 'Cross-functional product and engineering alignment', desc: 'Bring product thinking, UX, architecture, development, testing, and DevOps into one cohesive execution path.' },
    { title: 'Reduced long-term software risk', desc: 'Improve reliability, release confidence, and sustainability through better testing, monitoring, modernization, and support readiness.' }
  ];

  const valueDeliverSection = (
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
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`} />
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
  );

  // ============================================
  // PRE-MATRIX SECTION — Editorial Quote + Insights
  // ============================================
  const preMatrixSection = (
    <>
      <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative group">
              <div className="relative rounded-[3rem] overflow-hidden aspect-square">
                <img src="https://images.pexels.com/photos/8068255/pexels-photo-8068255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Engineering Team" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
            </div>
            <div className="flex items-start gap-6 lg:gap-10">
              <div className="hidden md:flex flex-col items-center gap-3 pt-2">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-gray-200"></div>
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
                <div className="w-px h-32 bg-gradient-to-b from-gray-200 to-transparent"></div>
              </div>
              <div className="flex-1">
                <div className="text-7xl md:text-9xl font-serif text-gray-900 dark:text-white/[0.05] leading-none select-none mb-2">"</div>
                <p className="text-2xl md:text-4xl lg:text-[2.75rem] font-light text-gray-800 dark:text-gray-50 leading-[1.3] font-display -mt-12 md:-mt-16 pl-2 lg:pl-0">
                  Good software is not just built. It is defined, engineered, tested, integrated, and evolved with{' '}
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">discipline.</span>
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
                Software that works at launch{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">and scales for years.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                Modern software development demands more than coding capacity. It requires product clarity, architecture foresight, delivery rigor, quality engineering, integration readiness, and the ability to adapt as business needs evolve.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-brand-blue shadow-lg"><Layers className="w-8 h-8" /></div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-3 text-transparent bg-clip-text bg-brand-gradient">THE CHALLENGE</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">"Many software initiatives lose momentum because scope is unclear, systems do not integrate well, delivery slows, and future scale was not planned early enough."</p>
                  </div>
                </div>
              </div>
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-emerald-500 shadow-lg"><BrainCircuit className="w-8 h-8" /></div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">THE ADVANTAGE</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">"When software development is approached as a full-cycle engineering discipline, teams move faster, reduce rework, improve quality, and create stronger long-term value."</p>
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
  // JOURNEY TIMELINE — 4-Phase Lifecycle
  // ============================================
  const journeyPhases = [
    { phase: 'DEFINE', icon: <Search className="w-7 h-7" />, title: 'Understand & Clarify', desc: 'Understand business goals, requirements, workflows, user needs, and technical constraints.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
    { phase: 'DESIGN', icon: <Palette className="w-7 h-7" />, title: 'Shape & Architect', desc: 'Shape architecture, experiences, integrations, and delivery planning before engineering accelerates.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
    { phase: 'BUILD', icon: <Code2 className="w-7 h-7" />, title: 'Develop & Validate', desc: 'Develop, test, integrate, and release through structured engineering and quality workflows.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
    { phase: 'EVOLVE', icon: <RefreshCw className="w-7 h-7" />, title: 'Optimize & Extend', desc: 'Support, optimize, modernize, and extend the product through continuous improvement.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true }
  ];

  const journeyTimeline = (
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
  );

  // ============================================
  // 3D DIAMOND CoE SECTION
  // ============================================
  const diamondCoESection = (
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
  );

  // ============================================
  // FUTURE-READY EXPERTISE — Accordion
  // ============================================
  const futureExpertiseItems = [
    { title: 'DevOps', desc: 'We use DevOps practices to automate, streamline, and strengthen software delivery. This improves release speed, engineering coordination, quality consistency, and operational confidence across environments.' },
    { title: 'Artificial Intelligence', desc: 'Our AI-enabled software capabilities help organizations embed intelligence into products, workflows, and decision-making through machine learning, natural language interfaces, computer vision, and automation-led engineering.' },
    { title: 'Blockchain', desc: 'We help design blockchain-enabled applications and decentralized solution models where trust, traceability, smart contracts, and distributed workflows create real business value.' },
    { title: 'Internet of Things (IoT)', desc: 'We build IoT-enabled software systems that connect devices, applications, and real-time data flows to support smarter monitoring, automation, and operational visibility.' }
  ];

  const futureReadySection = (
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
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFutureAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`} />
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
  );

  // ============================================
  // EXECUTION ECOSYSTEM — Related Services
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative z-[10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related Engineering{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
              Extend your software development initiative into a full-scale digital ecosystem. Kangqore provides the end-to-end engineering muscle to build, modernize, and scale.
            </p>
            <div className="space-y-4">
              {[
                { name: 'MVP Acceleration', link: '/services/digital-engineering/mvp-acceleration', icon: <Rocket className="w-5 h-5" />, desc: 'Rapid-velocity product engineering and scale-ready launch models.' },
                { name: 'API & Microservices Engineering', link: '/services/digital-engineering/api-microservices-engineering', icon: <Network className="w-5 h-5" />, desc: 'Modern API-first and microservices architectures for scalable systems.' },
                { name: 'Product Strategy & Experience Design', link: '/services/digital-engineering/product-strategy-experience-design', icon: <Layers className="w-5 h-5" />, desc: 'Strategic product planning, UX research, and design systems for digital products.' }
              ].map((e, idx) => (
                <Link key={idx} to={e.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl transition-all shadow-sm">
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
              <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
              <div className="absolute top-0 left-0 p-3 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>build_id:</span> <span className="text-brand-blue">#KG_SD_V2</span></div>
                <div className="flex justify-between gap-4"><span>pipeline:</span> <span className="text-emerald-500">DEPLOYED</span></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative"><Code2 className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10"><CheckCircle2 className="w-5 h-5" /></div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center relative z-10 hover:-translate-y-2 transition-all duration-300"><Rocket className="w-12 h-12 text-brand-blue" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">MVP_Accel</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300"><Network className="w-12 h-12 text-cyan-400" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">API_Eng</span>
                </div>
              </div>
              <div className="absolute bottom-10 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative -translate-x-4 hover:translate-x-0 transition-transform duration-300"><Layers className="w-12 h-12 text-white" /></div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase -translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Strategy</span>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs><linearGradient id="exec-flow-grad-sd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" /><stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" /></linearGradient></defs>
                <path d="M250,250 L250,120" stroke="url(#exec-flow-grad-sd)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L120,400" stroke="url(#exec-flow-grad-sd)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L380,400" stroke="url(#exec-flow-grad-sd)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
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
    description: 'Build innovative products and platforms with modern engineering practices.',
    icon: <Briefcase className="w-6 h-6" />
  };

  const pageData = {
    service: {
      name: 'Software Development',
      titleLine1: 'Software',
      titleHighlight: 'Development.',
      slug: 'software-development',
      videoBackground: 'https://videos.pexels.com/video-files/7989448/7989448-hd_1920_1080_25fps.mp4',
      shortDescription: "Build scalable software with sharper engineering, stronger product thinking, and faster execution.",
      fullDescription: (
        <div className="space-y-4">
          <p className="font-light tracking-tight leading-snug opacity-80">
            Kangqore delivers end-to-end software development services that help organizations design, build, modernize, integrate, and scale digital products with confidence. We combine product understanding, engineering depth, modern architecture, domain insight, and future-ready technologies to create software that is reliable, adaptable, and built for measurable business value.
          </p>
        </div>
      ),
      image: 'https://images.pexels.com/photos/3184583/pexels-photo-3184583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      stats: [
        { value: 'Validate', label: 'Ideas, requirements & technical direction', color: 'text-cyan-400' },
        { value: 'Build', label: 'Reliable digital products & platforms', color: 'text-blue-400' },
        { value: 'Accelerate', label: 'Delivery speed, quality & release confidence', color: 'text-emerald-400' },
        { value: 'Scale', label: 'Systems, teams & software foundations', color: 'text-purple-400' }
      ],
      primaryButton: { text: "Talk To Our Experts", link: "/contact" },
      secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
      ctaTitle: 'Ready to build software that is sharper, faster, and built to scale?',
      ctaDescription: "Let's define the right product direction, engineer the right solution, and deliver software that creates lasting business value across launch, growth, and long-term evolution.",
      ctaSecondaryButton: { text: "Schedule A Software Strategy Session", link: "/contact" },
      trustStripText: 'Trusted by ambitious startups, growth-stage businesses, and enterprises building modern digital products, platforms, and software ecosystems.',
      highFidelity: {
        narrative: {
          badge: 'SOFTWARE ENGINEERING :: ENTERPRISE GRADE',
          titleLine1: 'Software',
          titleHighlight: 'Development.',
          titleLine2: '',
          description: 'Most software initiatives lose momentum not because the code is bad — but because clarity was missing, architecture was short-sighted, quality was treated as an afterthought, and delivery lacked engineering discipline. Kangqore exists to fix that.',
          bottleneckLabel: 'The Silent Killer',
          bottleneckText: 'Unclear scope compounds into rework. Short-sighted architecture becomes technical debt. Bolted-on testing creates fragile releases. The result: products that ship late and break early.',
          requirementLabel: 'The Kangqore Way',
          requirementText: 'A unified engineering discipline that connects discovery, architecture, development, quality, DevOps, and evolution into one cohesive, accountable delivery model.',
          image: 'https://images.pexels.com/photos/3184583/pexels-photo-3184583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          statusLabel: 'Engineering Velocity',
          statusValue: 'MAXIMIZED'
        },
        philosophy: {
          icon: <Code2 className="w-7 h-7 text-gray-900 dark:text-white" />,
          title: 'Build What Matters.',
          titleHighlight: 'Ship What Wins.',
          description: 'We don\'t just write code. We engineer systems that are defined with clarity, built with discipline, tested with rigor, and evolved with intention.',
          pills: ['Discovery', 'Architecture', 'Engineering', 'Evolution'],
          features: [
            { title: 'Discovery', label: 'Product Discovery & Framing', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Define the right product before development effort compounds through structured discovery and validation.' },
            { title: 'Architecture', label: 'Cloud-Native Architecture', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Design scalable, maintainable systems with modern patterns — microservices, API-first, event-driven.' },
            { title: 'Engineering', label: 'Full-Stack Engineering', icon: <Code2 className="w-5 h-5 text-gray-400" />, content: 'Build with quality-first discipline across frontend, backend, mobile, and cloud environments.' },
            { title: 'Evolution', label: 'Continuous Improvement', icon: <RefreshCw className="w-5 h-5 text-gray-400" />, content: 'Support, optimize, modernize, and extend the product through structured post-launch engineering.' }
          ]
        },
        matrix: {
          engineId: 'Engine :: SD_V2',
          title: 'Our Execution Matrix.',
          subtext: 'A connected system for moving from requirements to reliable, scalable software at velocity.',
          layers: [
            { title: 'Define', id: 'SD_DEF', icon: <Search />, desc: 'Deconstructing business requirements, user needs, and technical constraints into actionable engineering blueprints.' },
            { title: 'Architect', id: 'SD_ARC', icon: <Layers />, desc: 'Designing scalable cloud-native architectures, microservices patterns, and API-first integration strategies.' },
            { title: 'Develop', id: 'SD_DEV', icon: <Zap />, desc: 'High-velocity engineering with CI/CD automation, quality-first pipelines, and test-driven delivery workflows.' },
            { title: 'Evolve', id: 'SD_EVO', icon: <Activity />, desc: 'Continuous optimization, modernization readiness, performance tuning, and long-term platform sustainability.' }
          ]
        },
        schematic: {
          titleLine1: 'Engineering Rigor.',
          titleHighlight: 'Business Value.',
          description: 'Your software should be your greatest competitive asset. We engineer it to stay that way — across every release, every integration, and every scale milestone.',
          stats: [
            { label: 'Quality', val: 'ABSOLUTE' },
            { label: 'Speed', val: 'VELOCITY' },
            { label: 'Security', val: 'HARDENED' }
          ]
        }
      },
      capabilitiesTitle: "Our Capabilities.",
      capabilitiesDescription: "Kangqore's software development capabilities are designed to help organizations move from idea to deployment with stronger clarity, better engineering outcomes, and greater readiness for scale.",
      capabilities: capabilities,
      trustPillars: [
        { title: 'Product clarity before engineering begins', tag: 'Discovery', description: 'Define the right product direction before development effort compounds.' },
        { title: 'Architecture designed for longevity', tag: 'Architecture', description: 'Build software foundations that can scale, integrate, and adapt without early regret.' },
        { title: 'Quality embedded at every phase', tag: 'Quality', description: 'Testing, security, and reliability are engineering disciplines — not last-stage checkpoints.' },
        { title: 'DevOps-accelerated delivery', tag: 'Velocity', description: 'CI/CD pipelines, infrastructure automation, and release workflows that ship with confidence.' },
        { title: 'Full-cycle accountability', tag: 'Lifecycle', description: 'From discovery through post-launch support, one cohesive model for the entire software journey.' },
        { title: 'Cross-functional alignment', tag: 'Alignment', description: 'Product thinking, UX, architecture, dev, testing, and DevOps unified into one execution path.' }
      ],
      whyKangqore: [
        { title: 'Business-Aligned Engineering', description: 'We connect software decisions to business goals, not just technical implementation.', icon: Target },
        { title: 'Full-Cycle Execution', description: 'From discovery and design to development, testing, deployment, and optimization — we cover the lifecycle end to end.', icon: Workflow },
        { title: 'Future-Ready Foundations', description: 'We help you build software that can scale, integrate, modernize, and adapt without early architectural regret.', icon: TrendingUp }
      ],
      industriesTitle: 'Software Development Services Across Industries, Technologies & Business Priorities',
      industriesDescription: 'Software decisions sit at the intersection of industry context, technology choices, and leadership goals. Kangqore helps organizations navigate all three.',
      industries: [
        { name: 'Healthcare', description: 'Software aligned to compliance, patient workflows, and clinical data requirements.' },
        { name: 'Software & Technology', description: 'Platforms, SaaS products, and developer tools built for scale and extensibility.' },
        { name: 'FinTech & Banking', description: 'Secure, reliable financial software meeting regulatory and performance demands.' },
        { name: 'Real Estate', description: 'Property management, marketplace, and transaction platforms built for growth.' },
        { name: 'Travel & Logistics', description: 'Booking, fleet management, and operational software optimized for real-time processing.' },
        { name: 'Media & Entertainment', description: 'Content platforms, streaming solutions, and engagement-driven digital products.' }
      ],
      technologiesTitle: "Tools & Technologies We Use Across Software\u00A0Development.",
      technologiesDescription: "Kangqore aligns technology choices to product goals, architectural needs, performance demands, and long-term maintainability.",
      technologies: [
        { category: 'Frontend Technologies', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5', 'CSS'] },
        { category: 'Backend Technologies', items: ['.NET', 'Java', 'Node.js', 'Python', 'PHP', 'Go'] },
        { category: 'Databases / Data Storage', items: ['MySQL', 'SQL Server', 'MongoDB', 'Amazon S3', 'Amazon RDS', 'Cassandra'] },
        { category: 'Mobile', items: ['iOS', 'Android', 'React Native', 'Flutter', 'Xamarin', 'Cordova', 'PWA'] },
        { category: 'DevOps', items: ['Jenkins', 'Terraform', 'Ansible', 'Kubernetes', 'Docker', 'Chef', 'Puppet'] },
        { category: 'Cloud Technologies', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
        { category: 'Platforms', items: ['Salesforce', 'Adobe Commerce', 'Power BI', 'Oracle'] }
      ],
      customFAQs: [
        { question: "What does Kangqore Software Development include?", answer: "It includes discovery, UX/UI, custom engineering, mobile and cloud development, testing, DevOps, integrations, modernization, SaaS development, and post-launch support." },
        { question: "Do you work with both startups and enterprises?", answer: "Yes. We support early-stage product teams, scaling businesses, and enterprise organizations depending on their software goals and delivery complexity." },
        { question: "Can you modernize existing systems instead of building from scratch?", answer: "Yes. We work across both net-new software development and modernization of legacy applications, platforms, and workflows." },
        { question: "Do you provide software testing and post-launch support?", answer: "Yes. Quality engineering, release validation, maintenance, and continuous support are part of a full-cycle software delivery model." },
        { question: "How do you choose the right tech stack?", answer: "We choose based on product goals, scalability needs, integration complexity, security requirements, team realities, and long-term maintainability." },
        { question: "Can Kangqore also support cloud, DevOps, and integration needs?", answer: "Yes. Those capabilities are tightly integrated into our software development delivery model." }
      ],
      preMatrixSection: preMatrixSection,
      postCapabilitiesSections: (
        <>
          {diamondCoESection}
          {valueDeliverSection}
          {journeyTimeline}
          {futureReadySection}
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
    <div className="software-development-page-override">
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
        .software-development-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={pageData.department}
      />
    </div>
  );
};

export default SoftwareDevelopment;
