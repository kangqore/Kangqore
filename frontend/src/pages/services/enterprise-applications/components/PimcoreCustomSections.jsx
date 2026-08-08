import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AlertTriangle, TrendingUp, ChevronDown, ChevronLeft, ChevronRight,
  Database, Workflow, Globe, ShieldCheck, Layers, Zap,
  Search, Settings, Headphones, Link2, Package, BarChart3,
  Lock, Cpu, ArrowRight, Sparkles, FileText, Image as ImageIcon,
  ShoppingCart, Monitor, BrainCircuit, CheckCircle2, Server, Terminal, RadioReceiver, Network
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Core Brand Gradient for the exact spec requested
const brandGradientClasses = "bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]";
const brandTextGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]";

// ═══════════════════════════════════════════════════════════════════════════════
// §1 — WHY PIMCORE, WHY NOW (Friction vs Advantage Split)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-why-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-why-body', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-why-card', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.pim-why-cards', start: 'top 80%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#2564ea]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start text-left">
          <div className="lg:w-1/2">
            <div className="pim-why-heading" style={{ opacity: 0 }}>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                Fragmented enterprise data quietly slows growth{' '}
                <span className={`${brandTextGradient} italic font-extrabold`}>before it visibly breaks operations.</span>
              </h2>
              <div className={`w-24 h-1.5 ${brandGradientClasses} rounded-full mb-10 opacity-20`} />
            </div>
            <p className="pim-why-body text-xl text-gray-500 font-light leading-relaxed" style={{ opacity: 0 }}>
              Most organizations do not struggle because they lack digital channels. They struggle because product data, master records, digital assets, and customer experiences live across disconnected systems, manual workflows, and inconsistent governance models. Kangqore helps enterprises use Pimcore as a unifying layer—bringing structure to data, speed to operations, and consistency to the customer experience across channels, teams, and markets.
            </p>
          </div>

          <div className="pim-why-cards space-y-6 lg:pt-4 lg:w-1/2 w-full">
            <div className="pim-why-card p-10 rounded-3xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group" style={{ opacity: 0 }}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#2564ea]/5 rounded-full blur-[60px] group-hover:bg-[#4ab6d4]/10 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${brandGradientClasses} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-bold tracking-widest ${brandTextGradient} uppercase`}>The Friction</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Silos, duplicate data, manual enrichment, weak governance, fragmented assets, and disconnected commerce systems slow the business and increase operational drag.
                </p>
              </div>
            </div>

            <div className="pim-why-card p-10 rounded-3xl bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group" style={{ opacity: 0 }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ab6d4]/5 rounded-full blur-[60px] group-hover:bg-[#2564ea]/10 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${brandGradientClasses} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-bold tracking-widest ${brandTextGradient} uppercase`}>The Advantage</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  A well-architected Pimcore foundation improves data consistency, workflow automation, omnichannel readiness, and speed-to-market while supporting long-term scale.
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
// §2 — VALUE WE DELIVER (Numbered Accordion)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimValueAccordion = () => {
  const sectionRef = useRef(null);
  const [openIdx, setOpenIdx] = useState(0);

  const items = [
    { num: '01', title: 'One connected operating layer for enterprise data', body: 'Bring product information, master data, digital assets, and experience delivery into a cleaner, more governed foundation.' },
    { num: '02', title: 'Better data quality with less manual effort', body: 'Improve accuracy, completeness, enrichment, and consistency through structured workflows and AI-assisted processes where relevant.' },
    { num: '03', title: 'Faster launches across channels and markets', body: 'Reduce bottlenecks in catalog operations, approvals, localization, publishing, and product updates.' },
    { num: '04', title: 'Stronger commerce and customer experience continuity', body: 'Connect rich product data, media, pricing, and personalized content into more effective digital commerce and experience journeys.' },
    { num: '05', title: 'Better governance, stewardship, and control', body: 'Support auditability, approval flows, master-record discipline, and enterprise-wide consistency.' },
    { num: '06', title: 'Scalability without platform sprawl', body: 'Create a more extensible foundation that supports growth across channels, languages, regions, and business models.' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-val-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-val-item', { opacity: 0, x: 30 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.pim-val-list', start: 'top 80%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 text-left">
          <div className="pim-val-heading lg:sticky lg:top-32 lg:self-start" style={{ opacity: 0 }}>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
              Value We Deliver{' '}<br />
              <span className={`${brandTextGradient} italic font-extrabold`}>with Pimcore Services.</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Each engagement is shaped around measurable enterprise outcomes, not just feature deployment.
            </p>
          </div>

          <div className="pim-val-list space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className={`pim-val-item rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden ${openIdx === i ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_12px_40px_rgb(0,0,0,0.06)]' : 'bg-transparent hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]'}`}
                style={{ opacity: 0 }}
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <div className="flex items-center justify-between p-8 px-10">
                  <div className="flex items-center gap-6">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{item.title}</h3>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIdx === i ? 'rotate-180 text-[#2564ea]' : ''}`} />
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIdx === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-10 pb-8 text-gray-500 font-light leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §3 — BUSINESS PROBLEMS WE SOLVE (Diagnostic HUD - Light Mode #fefffc)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimProblemsGrid = () => {
  const sectionRef = useRef(null);

  const problems = [
    { icon: Database, id: 'DATA-SILO', title: 'Siloed Product and Master Data', desc: 'Critical information sits across ERP, CRM, commerce, and legacy systems, making it difficult to maintain one accurate operating view.', size: 'large' },
    { icon: Workflow, id: 'OP-LAG', title: 'Slow, Error-Prone Catalog Operations', desc: 'Manual enrichment, approval delays, and disconnected publishing flows create time-to-market drag and increase data errors.', size: 'small' },
    { icon: ImageIcon, id: 'DAM-FRAG', title: 'Fragmented Digital Asset Management', desc: 'Media assets are scattered across teams and tools, weakening reuse, brand consistency, and campaign efficiency.', size: 'small' },
    { icon: ShieldCheck, id: 'GOV-STR', title: 'Weak Governance and Duplicate Records', desc: 'Poor stewardship, incomplete approval flows, and inconsistent auditability reduce trust in enterprise data.', size: 'small' },
    { icon: Globe, id: 'GLB-RED', title: 'Limited Localization and Global Readiness', desc: 'Regional expansion becomes harder when the platform cannot support multilingual catalogs and localized workflows.', size: 'large' },
    { icon: Link2, id: 'EXP-GAP', title: 'Disconnected Commerce and Experience', desc: 'Product data, content, media, and customer interactions stay out of sync, creating weaker digital journeys.', size: 'small' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-hud-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-hud-card', { opacity: 0, scale: 0.95, y: 40 }, {
        opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.pim-hud-grid', start: 'top 80%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pim-hud-heading text-left mb-20" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm mb-6">
            <RadioReceiver className="w-4 h-4 text-[#2564ea] animate-pulse" />
            <span className={`text-xs font-mono font-medium tracking-widest ${brandTextGradient} uppercase`}>Strategic Friction HUD</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
            What Enterprise Pimcore Engagements<br />
            <span className={`${brandTextGradient} italic font-extrabold`}>Usually Need to Fix.</span>
          </h2>
        </div>

        <div className="pim-hud-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          {problems.map((p, i) => {
            const Icon = p.icon;
            const isLarge = p.size === 'large';
            return (
              <div 
                key={i} 
                className={`pim-hud-card group rounded-[3rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_24px_60px_rgb(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden flex flex-col ${isLarge ? 'md:col-span-2' : ''}`}
                style={{ opacity: 0 }}
              >
                {/* HUD Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                   <div className={`absolute top-0 left-0 w-[2px] h-full ${brandGradientClasses} animate-scan-x`} />
                </div>

                <div className="h-full p-10 lg:p-12 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-10">
                      <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm relative overflow-hidden`}>
                        <div className={`absolute inset-0 ${brandGradientClasses} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                        <Icon className="w-7 h-7 text-gray-400 group-hover:text-[#2564ea] transition-colors relative z-10" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-mono text-gray-300 uppercase tracking-widest">Diagnostic ID</span>
                        <span className="text-xs font-mono text-gray-900 dark:text-white font-bold tracking-tighter">{p.id}</span>
                      </div>
                    </div>
                    
                    <h3 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight group-hover:text-[#2564ea] transition-colors duration-300 ${isLarge ? 'max-w-md' : ''}`}>{p.title}</h3>
                  </div>
                  
                  <p className={`text-gray-500 font-light text-lg leading-relaxed ${isLarge ? 'max-w-2xl' : ''}`}>{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-x {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        .animate-scan-x { animation: scan-x 3s linear infinite; }
      `}} />
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §4 — HOW WE HELP (Timeline tracking - Light Mode #fefffc)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimHowWeHelp = () => {
  const sectionRef = useRef(null);

  const phases = [
    { num: '01', title: 'Pimcore Consulting', tagline: 'Strategize the platform before implementation complexity grows.', items: ['Platform and use-case assessment', 'Data governance and workflow planning', 'Architecture and roadmap definition', 'ROI and operating-model alignment'] },
    { num: '02', title: 'Pimcore Implementation', tagline: 'Deploy and configure the platform around real business requirements.', items: ['PIM / MDM / DAM / commerce / DXP implementation', 'Workflow automation and data onboarding', 'Localization and channel enablement', 'Platform configuration for scale and adoption'] },
    { num: '03', title: 'Pimcore Integration', tagline: 'Connect Pimcore into the broader enterprise landscape.', items: ['ERP, CRM, eCommerce, and marketplace integration', 'API and service connectivity', 'Supplier, partner, and channel data exchange', 'Unified platform interoperability across systems'] },
    { num: '04', title: 'Pimcore Managed Services', tagline: 'Keep the platform stable, optimized, and evolving after go-live.', items: ['Maintenance and monitoring support', 'Performance tuning and issue resolution', 'Enhancement backlog execution', 'Continuous optimization for business growth'] },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line drawing
      gsap.fromTo('.pim-timeline-line', 
        { scaleY: 0 }, 
        { scaleY: 1, transformOrigin: 'top center', ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', end: 'bottom 80%', scrub: 1 }
        }
      );

      // Cards sliding in
      gsap.utils.toArray('.pim-timeline-card').forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(card, 
          { opacity: 0, x: isLeft ? -50 : 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 75%', once: true }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left mb-24 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            How We{' '}
            <span className={`${brandTextGradient} italic font-extrabold`}>Engineer Reality.</span>
          </h2>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            Kangqore structures delivery as a business-and-platform model. We define the operating approach, engineer the platform, connect it into the enterprise, and evolve it after launch.
          </p>
        </div>

        <div className="relative max-w-5xl">
          {/* Central Line - using requested layout with no center styling, moved to left-ish */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] bg-gray-50 dark:bg-[#050505] rounded-full md:-translate-x-1/2" />
          <div className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] ${brandGradientClasses} rounded-full pim-timeline-line md:-translate-x-1/2`} />
          
          <div className="space-y-16">
            {phases.map((p, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Dot (Borderless) */}
                  <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full ${brandGradientClasses} -translate-x-1/2 z-20 shadow-sm`} />
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />
                  
                  {/* Card Location */}
                  <div className={`pim-timeline-card pl-20 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'} w-full text-left`}>
                    <div className="rounded-[2.5rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_12px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500">
                      <div className="p-10 lg:p-12 relative overflow-hidden group">
                        <div className="relative z-10">
                          <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-[#2564ea] transition-colors duration-300">{p.title}</h3>
                          <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed max-w-md">{p.tagline}</p>
                          <ul className="space-y-4">
                            {p.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3">
                                <Terminal className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-[#4ab6d4] transition-colors duration-300" />
                                <span className="text-gray-600 dark:text-gray-400 font-light text-sm lg:text-base leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §5 — USE CASES / INDUSTRY APPLICATIONS (Glassmorphism Neo-Carousel - Light Mode)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimUseCasesCarousel = () => {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  const useCases = [
    { title: 'Golden Record Management', desc: 'Create a trusted master record across products, customers, suppliers, and channels for operational visibility.' },
    { title: 'Centralized Master Data Platform', desc: 'Unify MDM, PIM, and DAM patterns into one connected platform model for data-heavy enterprises.' },
    { title: 'B2B eCommerce Enablement', desc: 'Connect product data, pricing, dealer workflows, and commerce experiences into a stronger B2B environment.' },
    { title: 'Unified Data for Distributors', desc: 'Consolidate fragmented catalog information into one governed, searchable, reusable source.' },
    { title: 'Digital eStore Platforms', desc: 'Bring together PIM, DAM, and CMS patterns to improve dealer or distributor experiences.' },
    { title: 'High-Volume Global Product Data', desc: 'Support large SKU counts, multilingual markets, and complex catalog structures with stronger control.' },
  ];

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-neo-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-neo-card', { opacity: 0, x: 100 }, {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.pim-neo-scroll', start: 'top 80%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-8">
          <div className="pim-neo-heading" style={{ opacity: 0 }}>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              Where Pimcore Creates{' '}<br />
              <span className={`${brandTextGradient} italic font-extrabold`}>Measurable Business Value.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => scroll(-1)} className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 group">
              <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-[#2564ea] group-hover:-translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scroll(1)} className="w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 group">
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#2564ea] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="pim-neo-scroll flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] relative z-10 pb-16 pt-4 text-left">
        {useCases.map((uc, i) => (
          <div key={i} className="pim-neo-card snap-center flex-shrink-0 w-[320px] sm:w-[400px] lg:w-[440px] rounded-[3rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_12px_40px_rgb(0,0,0,0.04)] p-12 group hover:shadow-[0_24px_50px_rgb(0,0,0,0.08)] transition-all duration-500 relative flex flex-col justify-between min-h-[460px]" style={{ opacity: 0 }}>
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-snug group-hover:text-[#2564ea] transition-colors duration-300">{uc.title}</h3>
            </div>
            
            <div className="relative z-10 mt-auto pt-8">
              <p className="text-gray-500 font-light text-lg leading-relaxed">{uc.desc}</p>
              <div className="mt-10 flex items-center gap-3 text-[#2564ea] font-semibold tracking-wide opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                Explore Use Case <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// §6 — BENEFITS WE DELIVER (Spatial Liquid Grid - Light Mode #fefffc)
// ═══════════════════════════════════════════════════════════════════════════════
export const PimBenefitsGrid = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const benefits = [
    { title: 'Centralized Data Management', desc: 'Create a cleaner, more controlled source of truth across products, assets, and master data.', bg: 'GOVERN' },
    { title: 'Flexibility and Scalability', desc: 'Support growth without forcing rigid process or platform constraints.', bg: 'SCALE' },
    { title: 'Data Security and Governance', desc: 'Improve stewardship, access control, and operational trust across enterprise data.', bg: 'TRUST' },
    { title: 'Easy Integration', desc: 'Enable smoother interoperability with ERP, CRM, commerce, marketing, and legacy systems.', bg: 'CONNECT' },
    { title: 'Personalization and Omnichannel', desc: 'Deliver better customer interactions through connected content and channel consistency.', bg: 'SPEED' },
    { title: 'Lower Cost of Ownership', desc: 'Reduce duplication, manual work, and fragmented system complexity over time.', bg: 'EFFICIENCY' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-liq-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-liq-card', { opacity: 0, y: 30, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.pim-liq-grid', start: 'top 80%', once: true }
      });
      
      // Move cards on mouse move for depth effect
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to('.pim-liq-card', {
          x: (i) => xPos * (i % 2 === 0 ? 1 : -1),
          y: (i) => yPos * (i % 3 === 0 ? 1 : -0.5),
          duration: 1,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-48 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        <div className="pim-liq-heading mb-32" style={{ opacity: 0 }}>
          <h2 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            Business Outcomes a Strong<br />
            <span className={`${brandTextGradient} italic font-extrabold`}>Pimcore Foundation Unlocks.</span>
          </h2>
        </div>

        <div className="pim-liq-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 pt-12">
          {benefits.map((b, i) => (
            <div 
              key={i} 
              className={`pim-liq-card group rounded-[4rem] bg-white dark:bg-gray-900 dark:border-gray-800 p-12 shadow-[0_8px_40px_rgb(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgb(0,0,0,0.12)] transition-all duration-700 relative overflow-hidden flex flex-col justify-between min-h-[400px] ${i % 2 !== 0 ? 'lg:translate-y-16' : ''}`} 
              style={{ opacity: 0 }}
            >
              {/* Massive Background Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-gray-50 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                {b.bg}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[2rem] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-sm relative overflow-hidden">
                   <div className={`absolute inset-0 ${brandGradientClasses} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <Sparkles className="w-8 h-8 text-[#2564ea] group-hover:text-[#4ab6d4] transition-colors duration-500" />
                </div>
                
                <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1] group-hover:text-[#2564ea] transition-colors duration-300">{b.title}</h3>
              </div>
              
              <div className="relative z-10">
                <p className="text-gray-500 font-light text-lg lg:text-xl leading-relaxed">{b.desc}</p>
                <div className="mt-8 h-1 w-12 bg-gray-100 dark:bg-[#0a0a0c] rounded-full group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// 7. PIMCORE ARCHITECTURE SCHEMATIC
// ═══════════════════════════════════════════════════════════════════════════════
export const PimArchitectureSchematic = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.fromTo('.pim-arch-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
      gsap.fromTo('.pim-arch-block', { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.pim-arch-container', start: 'top 80%', once: true }
      });

      // Data stream animations
      gsap.to('.data-stream-x', { backgroundPositionX: '200%', duration: 3, repeat: -1, ease: 'linear' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 lg:py-40 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pim-arch-heading text-left mb-24" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm mb-6">
            <Network className="w-4 h-4 text-[#2564ea]" />
            <span className={`text-xs font-mono font-medium tracking-widest ${brandTextGradient} uppercase`}>System Architecture</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
            How the Unification<br />
            <span className={`${brandTextGradient} italic font-extrabold`}>Layer Works.</span>
          </h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl">
            Pimcore sits at the highly governed center of your enterprise architecture, decoupling backend systems of record from frontend systems of engagement.
          </p>
        </div>

        <div className="pim-arch-container relative max-w-5xl mx-auto">
          {/* Main Diagram Layout */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4">
            
            {/* INGRESS (Left) */}
            <div className="pim-arch-block w-full lg:w-1/4 flex flex-col gap-6" style={{ opacity: 0 }}>
              <div className="text-center mb-2"><span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Ingress</span></div>
              {[
                { label: 'ERP Systems', icon: Database },
                { label: 'Supplier Portals', icon: FileText },
                { label: 'Legacy PIMs', icon: Server }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 flex items-center gap-4 relative overflow-hidden group">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#2564ea] transition-colors" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* FLOW LINES L to C (Desktop Only) */}
            <div className="hidden lg:flex w-16 h-32 relative items-center justify-center">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#2564ea] to-[#4ab6d4] data-stream-x" style={{ backgroundSize: '200% auto', opacity: 0.5 }}></div>
            </div>

            {/* PLATFORM (Center) */}
            <div className="pim-arch-block w-full lg:w-[40%] relative z-10" style={{ opacity: 0 }}>
              <div className="rounded-[4rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_12px_40px_rgb(0,0,0,0.06)] p-10 relative overflow-hidden">
                {/* Embedded Gradient Accent */}
                <div className={`absolute top-0 left-0 w-full h-2 ${brandGradientClasses}`} />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2564ea] rounded-full blur-[80px] opacity-10" />
                
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 text-[#2564ea]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Pimcore Foundation</h3>
                  <p className="text-sm text-gray-500 font-light mt-2">The Golden Record</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'PIM', desc: 'Product Info' },
                    { label: 'MDM', desc: 'Master Data' },
                    { label: 'DAM', desc: 'Digital Assets' },
                    { label: 'DXP', desc: 'Experience' }
                  ].map((module, i) => (
                    <div key={i} className="rounded-[1.5rem] bg-gray-50 p-4 text-center group hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-md transition-all">
                      <div className={`text-lg font-bold ${brandTextGradient}`}>{module.label}</div>
                      <div className="text-xs text-gray-500 font-medium">{module.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FLOW LINES C to R (Desktop Only) */}
            <div className="hidden lg:flex w-16 h-32 relative items-center justify-center">
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gradient-to-r from-[#2564ea] via-[#4ab6d4] to-transparent data-stream-x" style={{ backgroundSize: '200% auto', opacity: 0.5 }}></div>
            </div>

            {/* EGRESS (Right) */}
            <div className="pim-arch-block w-full lg:w-1/4 flex flex-col gap-6" style={{ opacity: 0 }}>
              <div className="text-center mb-2"><span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Egress</span></div>
              {[
                { label: 'B2B/B2C Commerce', icon: ShoppingCart },
                { label: 'Marketplaces (API)', icon: Network },
                { label: 'Digital Print / Catalogs', icon: FileText }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 flex items-center gap-4 relative overflow-hidden group">
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#4ab6d4] transition-colors" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. PIMCORE ROI CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
export const PimROICalculator = () => {
  const sectionRef = useRef(null);
  const [skuCount, setSkuCount] = useState(50000);

  // Simple exponential/linear logic for demonstration
  // The more SKUs, the larger the manual hours saved
  const manualHoursPerMonth = Math.round(skuCount * 0.005); // 50k SKUs = ~250 hrs / month manual
  const hoursSaved = Math.round(manualHoursPerMonth * 0.75); // 75% reduction
  const timeToMarketImprov = Math.min(10 + Math.round(skuCount / 2000), 85); // caps at 85%

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pim-roi-wrap', { opacity: 0, scale: 0.95, y: 40 }, {
        opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#fefffc' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        <div className="pim-roi-wrap w-full rounded-[4rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_12px_50px_rgb(0,0,0,0.05)] p-10 lg:p-16 relative overflow-hidden" style={{ opacity: 0 }}>
          {/* Subtle Top Gradient */}
          <div className={`absolute top-0 left-0 w-full h-3 ${brandGradientClasses}`} />
          
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Calculate Your Efficiency Gains</h2>
            <p className="text-gray-500 font-light text-lg">Centralizing product data removes extreme manual friction.</p>
          </div>

          <div className="mb-16">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Catalog Size (SKUs)</span>
              <span className={`text-4xl font-extrabold ${brandTextGradient} tracking-tighter`}>{skuCount.toLocaleString()}</span>
            </div>
            {/* Custom Range Slider using tailwind & standard inputs */}
            <div className="relative w-full h-4 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
               <div 
                 className={`absolute top-0 left-0 h-full ${brandGradientClasses} rounded-full`} 
                 style={{ width: `${(skuCount / 200000) * 100}%` }}
               />
               <input 
                 type="range" 
                 min="1000" 
                 max="200000" 
                 step="1000"
                 value={skuCount}
                 onChange={(e) => setSkuCount(Number(e.target.value))}
                 className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
               />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-400 font-semibold font-mono">
              <span>1K</span>
              <span>200K+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] bg-gray-50 dark:bg-[#050505] p-8 text-center flex flex-col items-center justify-center">
              <span className="text-[3.5rem] font-black text-gray-900 dark:text-white leading-none mb-2 tracking-tighter">{hoursSaved}<span className="text-2xl text-gray-400">h</span></span>
              <span className="text-sm text-gray-500 font-medium">Est. Manual Hours Saved / Month</span>
            </div>
            <div className="rounded-[2.5rem] bg-gray-50 dark:bg-[#050505] p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
              <div className={`absolute inset-0 ${brandGradientClasses} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
              <span className={`text-[3.5rem] font-black ${brandTextGradient} leading-none mb-2 tracking-tighter`}><span className="text-2xl text-[#2564ea] mr-1">+</span>{timeToMarketImprov}<span className="text-2xl text-[#4ab6d4] ml-1">%</span></span>
              <span className="text-sm text-gray-500 font-medium">Faster Time-to-Market</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
