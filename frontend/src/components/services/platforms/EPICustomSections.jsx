import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, 
  ChevronDown, Rocket, BrainCircuit, CheckCircle2, Code2, Zap, ArrowRight, 
  Globe, Shield, Cpu, BarChart3, Package, Settings,
  HeartPulse, CreditCard, Truck, ShoppingBag
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// §3 — WHY ENTERPRISE PLATFORM INTEGRATION (Pre-Matrix Section)
// ═══════════════════════════════════════════════════════════════════════════════
export const EPIWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
      tl.fromTo('.epi-why-heading', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
      tl.fromTo('.epi-why-body', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
      tl.fromTo('.epi-why-callout', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.2, ease: 'power2.out' }, 0.5);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-blue/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Headline + Body */}
          <div>
            <div className="epi-why-heading" style={{ opacity: 0 }}>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                Disconnected platforms slow the business{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">long before they visibly break it.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10" />
            </div>
            <p className="epi-why-body text-lg text-gray-500 font-light leading-relaxed" style={{ opacity: 0 }}>
              Most enterprise friction does not begin with one failed system. It builds quietly across disconnected applications, brittle interfaces, duplicated data, fragmented workflows, and aging integration patterns that no longer support business speed. Kangqore helps organizations turn integration into a strategic capability—connecting legacy and modern platforms in ways that improve operational efficiency, enable cleaner data movement, reduce manual dependency, and create a stronger foundation for transformation.
            </p>
          </div>

          {/* Right: Insight Callouts */}
          <div className="space-y-6 lg:pt-8">
            <div className="epi-why-callout p-8 bg-brand-blue/[0.03] rounded-3xl relative overflow-hidden" style={{ opacity: 0 }}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gradient rounded-r" />
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.25em] text-brand-blue uppercase">The Friction</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                  Fragmented systems create data silos, workflow delays, duplicated effort, and weaker visibility across the enterprise.
                </p>
              </div>
            </div>
            
            <div className="epi-why-callout p-8 bg-brand-blue/[0.03] rounded-3xl relative overflow-hidden" style={{ opacity: 0 }}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-gradient rounded-r" />
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.25em] text-brand-blue uppercase">The Advantage</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                  Well-architected integration creates continuity between legacy and modern platforms while improving scalability, governance, and execution speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §4 — VALUE WE DELIVER (Accordion)
// ═══════════════════════════════════════════════════════════════════════════════
export const EPIValueAccordion = () => {
  const [openAccordion, setOpenAccordion] = React.useState(0);
  const values = [
    { title: 'Stronger interoperability across the enterprise', desc: 'Connect legacy systems, cloud platforms, APIs, data layers, and partner environments through a cleaner integration architecture.' },
    { title: 'Better continuity between old and new systems', desc: 'Modernize without forcing abrupt replacement by creating integration models that preserve current value while enabling future change.' },
    { title: 'Faster, more reliable data and process movement', desc: 'Reduce delays, manual touchpoints, and fragmented workflows by improving how systems exchange information.' },
    { title: 'More scalable hybrid and cloud-ready integration', desc: 'Support growth with architectures that work across on-premises, cloud, and mixed environments without increasing fragility.' },
    { title: 'Better governance across APIs and integrations', desc: 'Improve lifecycle control, standardization, monitoring, and compliance across expanding integration estates.' },
    { title: 'Smarter orchestration and automation', desc: 'Integrate systems, people, and data flows in ways that improve execution speed, operational efficiency, and service responsiveness.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Value We Deliver with{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Enterprise Integration.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8" />
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps organizations transform fragmented platform landscapes into connected, scalable, and governable enterprise ecosystems.
            </p>
          </div>
          <div className="space-y-3">
            {values.map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 ">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} 
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-colors ${openAccordion === idx ? 'bg-brand-blue' : 'bg-slate-900'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                {openAccordion === idx && (
                  <div className="px-6 pb-6 pl-20 animate-in fade-in slide-in-from-top-2 duration-300">
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
};

// ═══════════════════════════════════════════════════════════════════════════════
// §6 — SOLUTION USE CASES (Carousel)
// ═══════════════════════════════════════════════════════════════════════════════
export const EPISolutionsCarousel = () => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.epi-sol-card', 
        { opacity: 0, y: 40, scale: 0.96 },
        { 
          opacity: 1, y: 0, scale: 1, duration: 0.6, 
          stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const solutions = [
    {
      icon: HeartPulse,
      title: 'Health Information Exchange (HIE)',
      desc: 'Securely connect providers, systems, and patient-data flows across fragmented healthcare environments.',
      features: ['Interoperable patient-data exchange', 'AI-assisted normalization', 'Scalable cloud-enabled access', 'Integrity and auditability support'],
      gradient: 'from-[#2564ea] to-[#4ab6d4]'
    },
    {
      icon: CreditCard,
      title: 'FinTech & Payment Gateway',
      desc: 'Connect regulated fintech platforms to payment ecosystems with stronger reliability and compliance.',
      features: ['ACH / SWIFT connectivity', 'API-enabled payment integrations', 'Real-time transaction processing', 'Fraud detection and wallet integration'],
      gradient: 'from-[#2564ea] to-[#4ab6d4]'
    },
    {
      icon: Truck,
      title: 'Logistics & TMS Integration',
      desc: 'Create end-to-end visibility across transportation, warehouse, ERP, and partner operations.',
      features: ['TMS / WMS / ERP interoperability', 'Shipment and compliance workflows', 'Real-time operational visibility', 'Better delivery coordination'],
      gradient: 'from-[#2564ea] to-[#4ab6d4]'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace Integration',
      desc: 'Connect e-commerce operations to global marketplaces with better synchronization and scale.',
      features: ['Product catalog and pricing sync', 'Inventory and order-flow integration', 'ERP-to-marketplace interoperability', 'Multi-channel expansion support'],
      gradient: 'from-[#2564ea] to-[#4ab6d4]'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-4xl">
            
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Where Our Integration Solutions{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Create Real Business Value.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8" />
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
              Kangqore turns technical integration architecture into measurable commercial relevance across industries.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 dark:bg-[#050505] hover:transition-all duration-300 group"
            >
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue rotate-180 transition-transform" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-50 dark:bg-[#050505] hover:transition-all duration-300 group"
            >
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-12 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div 
                key={idx} 
                className="epi-sol-card group relative rounded-[32px] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-8 lg:p-10 hover:shadow-xl hover:transition-all duration-500 overflow-hidden flex-none w-[320px] sm:w-[380px] lg:w-[450px] snap-start" 
                style={{ opacity: 0 }}
              >
                {/* Hover gradient accent */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${sol.gradient} opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity duration-700 -translate-y-10 translate-x-10`} />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className={`w-14 h-14 bg-gradient-to-br ${sol.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{sol.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed mb-8 text-sm lg:text-base flex-grow">{sol.desc}</p>
                  
                  <div className="space-y-3 pt-6 border-t ">
                    {sol.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${sol.gradient} flex-shrink-0`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-light leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §9 — RELATED STRENGTHS (Platform Advantage - Bento Box)
// ═══════════════════════════════════════════════════════════════════════════════
export const EPIStrengthsBento = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.epi-str-heading', 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
      );
      
      // Bento Cells Stagger Reveal
      gsap.fromTo('.epi-bento-card',
        { opacity: 0, y: 60, scale: 0.95 },
        { 
          opacity: 1, y: 0, scale: 1, duration: 0.8, 
          stagger: 0.15, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '.epi-bento-grid', start: 'top 80%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      {/* Subtle background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="epi-str-heading text-left mb-16 lg:mb-24" style={{ opacity: 0 }}>
          
          <h2 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            What Strengthens Our{' '}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic font-extrabold">Integration Delivery.</span>
          </h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl">
            Kangqore brings discipline to integration engineering—combining scalable architecture, reusable assets, and strategic oversight.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="epi-bento-grid grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[280px]">
          
          {/* Card 1: CoE (Large Span) */}
          <div className="epi-bento-card lg:col-span-8 md:col-span-4 col-span-1 rounded-[32px] bg-white dark:bg-gray-900 dark:border-gray-800 p-10 relative overflow-hidden group hover:shadow-xl hover:transition-all duration-500" style={{ opacity: 0 }}>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0,100 C100,200 300,0 400,100" stroke="url(#coE_grad)" strokeWidth="2" fill="none" className="stroke-dasharray-800 animate-[dash_10s_linear_infinite]"/>
                <path d="M0,150 C150,50 250,250 400,150" stroke="url(#coE_grad_2)" strokeWidth="1" fill="none" className="stroke-dasharray-800 animate-[dash_15s_linear_infinite_reverse]"/>
                <defs>
                  <linearGradient id="coE_grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2564ea"/><stop offset="100%" stopColor="#4ab6d4"/></linearGradient>
                  <linearGradient id="coE_grad_2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4ab6d4"/><stop offset="100%" stopColor="#2564ea"/></linearGradient>
                </defs>
                <style>{`
                  .stroke-dasharray-800 { stroke-dasharray: 800; }
                  @keyframes dash { to { stroke-dashoffset: -1600; } }
                `}</style>
              </svg>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight font-display">Integration Center of Excellence</h3>
              <p className="text-gray-500 font-light leading-relaxed max-w-lg text-lg">
                Reusable frameworks, operating standards, and proven delivery discipline for scalable integration execution. We establish the blueprints that accelerate your time-to-market.
              </p>
            </div>
          </div>

          {/* Card 2: Strategy (Tall Span) */}
          <div className="epi-bento-card lg:col-span-4 md:col-span-2 col-span-1 row-span-2 rounded-[32px] bg-gradient-to-b from-gray-50 to-white p-10 relative overflow-hidden group hover:shadow-xl hover:transition-all duration-500" style={{ opacity: 0 }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] group-hover:bg-brand-blue/10 transition-colors duration-700" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <BrainCircuit className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">Strategic Consulting</h3>
              <p className="text-gray-500 font-light leading-relaxed mb-8 text-lg">
                Migration, security, governance, and lifecycle thinking aligned to business priorities and transformation goals.
              </p>
              <div className="flex-grow flex flex-col justify-end">
                <div className="space-y-4">
                  {['Architecture Assessment', 'API Governance Strategy', 'Legacy Modernization'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border-b pb-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Partnerships (Square) */}
          <div className="epi-bento-card lg:col-span-4 md:col-span-2 col-span-1 rounded-[32px] bg-white dark:bg-gray-900 dark:border-gray-800 p-10 group hover:shadow-xl hover:transition-all duration-500 flex flex-col justify-center" style={{ opacity: 0 }}>
            <div className="w-12 h-12 bg-brand-blue/5 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-brand-blue" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Tech Partnerships</h3>
            <p className="text-gray-500 font-light text-sm leading-relaxed">
              Strong alignment with top-tier integration, iPaaS, and API-management ecosystems for fit-for-purpose implementation.
            </p>
          </div>

          {/* Card 4: Analytics (Square) */}
          <div className="epi-bento-card lg:col-span-4 md:col-span-2 col-span-1 rounded-[32px] bg-brand-blue/5 p-10 relative overflow-hidden group hover:bg-brand-blue/10 hover:shadow-xl transition-all duration-500 flex flex-col justify-between" style={{ opacity: 0 }}>
            <div className="absolute right-0 bottom-0 opacity-5 scale-150 translate-x-1/4 translate-y-1/4">
              <BarChart3 className="w-64 h-64 text-brand-blue" />
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-brand-blue/10">
              <Activity className="w-6 h-6 text-brand-blue" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Advanced Analytics</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Better process monitoring, dashboarding, and decision support across your entire integration landscape.
              </p>
            </div>
          </div>

          {/* Card 5: Accelerators (Wide Span) */}
          <div className="epi-bento-card lg:col-span-8 md:col-span-4 col-span-1 rounded-[32px] bg-gradient-to-br from-gray-50 to-white p-10 relative overflow-hidden group hover:shadow-xl hover:transition-all duration-500" style={{ opacity: 0 }}>
            <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-end pr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <div className="grid grid-cols-5 gap-2 rotate-12">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`h-1.5 w-12 rounded-full bg-gradient-to-r from-brand-blue to-cyan-400 ${i % 3 === 0 ? 'opacity-20' : i % 2 === 0 ? 'opacity-40' : 'opacity-100'}`} />
                ))}
              </div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center max-w-lg">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Pre-Built Accelerators</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Pre-built connectors, templates, and frameworks for common integration patterns, significantly reducing development time and costs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Philosophy Hub Background — ANIMATED SVG Integration Mesh
// ═══════════════════════════════════════════════════════════════════════════════
export const EPIPhilosophyBg = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.epi-phil-path', 
        { strokeDashoffset: 1000, opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.2, duration: 3, stagger: 0.2, ease: 'power1.inOut' }
      );
      gsap.to('.epi-phil-node', {
        opacity: 0.4, scale: 1.5, duration: 2,
        repeat: -1, yoyo: true,
        stagger: { each: 0.5, from: 'random' }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2564ea" />
            <stop offset="100%" stopColor="#4ab6d4" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ab6d4" />
            <stop offset="100%" stopColor="#2564ea" />
          </linearGradient>
        </defs>

        {/* Paths */}
        <path className="epi-phil-path" d="M0 200 Q300 0 720 200 T1440 200" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M0 400 Q300 600 720 400 T1440 400" stroke="url(#grad2)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M0 600 Q300 800 720 600 T1440 600" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M200 0 Q0 300 200 720 T200 1440" stroke="url(#grad2)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M400 0 Q600 300 400 720 T400 1440" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M600 0 Q800 300 600 720 T600 1440" stroke="url(#grad2)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M800 0 Q1000 300 800 720 T800 1440" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M1000 0 Q1200 300 1000 720 T1000 1440" stroke="url(#grad2)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />
        <path className="epi-phil-path" d="M1200 0 Q1400 300 1200 720 T1200 1440" stroke="url(#grad1)" strokeWidth="1" fill="none" opacity="0" strokeDasharray="1000" />

        {/* Nodes */}
        <g>
          {[...Array(20)].map((_, i) => (
            <circle key={i} className="epi-phil-node" cx={Math.random() * 1440} cy={Math.random() * 800} r="3" fill="url(#grad1)" opacity="0" />
          ))}
        </g>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Business-Ready Integration Graph — Animated SVG (Central Hub + 8 Systems)
// ═══════════════════════════════════════════════════════════════════════════════
export const EPIIntegrationGraph = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });

      tl.fromTo('.epi-gr-heading', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
      tl.fromTo('.epi-gr-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
      tl.fromTo('.epi-gr-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' }, 0.5);
      tl.fromTo('.epi-gr-hub', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', transformOrigin: 'center center' }, 0.3);
      tl.fromTo('.epi-gr-node', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', transformOrigin: 'center center' }, 0.6);
      tl.fromTo('.epi-gr-link', { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: 'power1.out' }, 0.7);
      tl.fromTo('.epi-gr-label', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, 1.0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const nodes = [
    { x: 280, y: 80,  label: 'Legacy Apps',      sub: 'ERP · CRM' },
    { x: 480, y: 80,  label: 'Cloud Platforms',   sub: 'AWS · Azure' },
    { x: 130, y: 220, label: 'API Gateway',       sub: 'Routing · Policy' },
    { x: 560, y: 220, label: 'Partner EDI',       sub: 'B2B Exchange' },
    { x: 130, y: 380, label: 'iPaaS Layer',       sub: 'MuleSoft · Boomi' },
    { x: 560, y: 380, label: 'Data Pipeline',     sub: 'Kafka · Events' },
    { x: 280, y: 480, label: 'Orchestration',     sub: 'Workflows' },
    { x: 480, y: 480, label: 'Observability',     sub: 'Monitoring' },
  ];

  const hubX = 370, hubY = 280;

  const stats = [
    { val: '99.9%', label: 'Uptime SLA' },
    { val: '10x', label: 'Faster Integration' },
    { val: '100%', label: 'Governance' },
  ];

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            <div className="epi-gr-heading" style={{ opacity: 0 }}>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
                Connected Enterprise <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">built for governed scale.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10" />
            </div>
            <p className="epi-gr-desc text-xl text-gray-500 font-light leading-relaxed mb-12" style={{ opacity: 0 }}>
              Enterprise integration creates business continuity only when the surrounding architecture is designed with intent. Without clear connectivity strategy, data governance, and orchestration controls, distributed platforms become liabilities.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="epi-gr-stat text-center p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/70 rounded-2xl " style={{ opacity: 0 }}>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-brand-gradient font-mono mb-1">{s.val}</div>
                  <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Node Graph */}
          <div className="relative aspect-square w-full max-w-[600px] mx-auto hidden lg:block">
            <svg viewBox="0 0 700 560" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="epi-gr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" />
                  <stop offset="100%" stopColor="#4ab6d4" />
                </linearGradient>
                <radialGradient id="epi-gr-dark" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <filter id="epi-gr-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.1" />
                </filter>
              </defs>

              {/* Background grid */}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(i => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="700" y2={i * 40} stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
              ))}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="560" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
              ))}

              {/* Connection lines */}
              {nodes.map((n, i) => (
                <path
                  key={`link-${i}`}
                  className="epi-gr-link"
                  d={`M${hubX},${hubY} L${n.x},${n.y}`}
                  stroke="url(#epi-gr-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                  opacity="0.5"
                />
              ))}

              {/* Data flow particles */}
              {nodes.map((n, i) => (
                <circle key={`particle-${i}`} r="3" fill="url(#epi-gr-grad)" opacity="0.7">
                  <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" path={`M${hubX},${hubY} L${n.x},${n.y}`} />
                </circle>
              ))}

              {/* Central hub */}
              <g className="epi-gr-hub" style={{ opacity: 0 }} filter="url(#epi-gr-shadow)">
                <circle cx={hubX} cy={hubY} r="45" fill="url(#epi-gr-dark)" />
                <circle cx={hubX} cy={hubY} r="45" stroke="url(#epi-gr-grad)" strokeWidth="2" fill="none" />
                <circle cx={hubX} cy={hubY} r="38" stroke="url(#epi-gr-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                <text x={hubX} y={hubY - 6} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">Integration</text>
                <text x={hubX} y={hubY + 10} textAnchor="middle" fill="#4ab6d4" fontSize="9" fontFamily="system-ui">Hub</text>
              </g>

              {/* Service nodes */}
              {nodes.map((n, i) => (
                <g key={`node-${i}`} className="epi-gr-node" style={{ opacity: 0 }}>
                  <rect x={n.x - 52} y={n.y - 22} width="104" height="44" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#epi-gr-shadow)" />
                  <rect x={n.x - 52} y={n.y - 22} width="104" height="44" rx="12" stroke="url(#epi-gr-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                  <text className="epi-gr-label" x={n.x} y={n.y - 4} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold" fontFamily="system-ui" style={{ opacity: 0 }}>{n.label}</text>
                  <text className="epi-gr-label" x={n.x} y={n.y + 10} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="system-ui" style={{ opacity: 0 }}>{n.sub}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
