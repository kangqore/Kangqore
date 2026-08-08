import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, Briefcase, ChevronDown, Rocket, Building2, TrendingUp, Zap, Globe, Globe2, Users, CheckCircle2, ArrowRight, BarChart3, Shield, Target, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET CONTEXT STRIP — Premium data dashboard with glassmorphic cards
// Shows real market data to establish credibility immediately
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCMarketContextStrip = () => {
  const stripRef = useRef(null);

  useEffect(() => {
    if (!stripRef.current) return;
    const ctx = gsap.context(() => {
      // Counter animation
      const counters = stripRef.current.querySelectorAll('.gcc-market-counter');
      counters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        if (target && !isNaN(parseFloat(target))) {
          gsap.fromTo(counter, { innerHTML: 0 }, {
            innerHTML: target,
            duration: 1.5,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onComplete: () => { counter.innerHTML = target; },
            scrollTrigger: { trigger: counter, start: 'top 90%', once: true }
          });
        }
      });
      // Card stagger entrance
      gsap.fromTo('.gcc-stat-card', { opacity: 0, y: 30, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: stripRef.current, start: 'top 80%', once: true }
      });
      // Gradient line animation
      gsap.fromTo('.gcc-gradient-line', { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: 'power2.inOut',
        scrollTrigger: { trigger: stripRef.current, start: 'top 85%', once: true }
      });
    }, stripRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '1900', suffix: '+', label: 'Active GCCs in India', sub: 'Projected 2,400+ by 2030', icon: <Building2 className="w-5 h-5" />, accent: 'from-blue-400 to-indigo-500' },
    { value: '66', suffix: 'B', label: 'Annual Revenue (USD)', sub: 'Growing to $110B by 2030', icon: <TrendingUp className="w-5 h-5" />, accent: 'from-cyan-400 to-blue-500' },
    { value: '2', suffix: 'M+', label: 'Professionals Employed', sub: 'Across 6 major city hubs', icon: <Users className="w-5 h-5" />, accent: 'from-emerald-400 to-cyan-500' },
    { value: '50', suffix: '%+', label: 'Global GCC Share', sub: 'India hosts half of all GCCs', icon: <Globe className="w-5 h-5" />, accent: 'from-purple-400 to-blue-500' }
  ];

  return (
    <section ref={stripRef} className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: '#0a0f1a' }}>
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(37,100,234,0.12)_0%,transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(74,182,212,0.08)_0%,transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(37,100,234,0.06)_0%,transparent_50%)]"></div>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800/[0.04] border border-white/[0.08] rounded-full mb-8 backdrop-blur-sm">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-cyan-400 uppercase">India GCC Ecosystem — 2026</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-display tracking-tight leading-[1.1]">
            The World's Largest{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">GCC Ecosystem.</span>
          </h2>
          {/* Animated gradient line */}
          <div className="gcc-gradient-line mx-auto w-32 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 mb-8 origin-left"></div>
          <p className="text-white/50 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            India hosts more Global Capability Centers than any other country. Here's the landscape you're entering.
          </p>
        </div>

        {/* Stats Grid — Glassmorphic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="gcc-stat-card group relative">
              {/* Hover glow */}
              <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500`}></div>
              
              <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-7 lg:p-8 hover:bg-white dark:bg-gray-900 dark:border-gray-800/[0.07] hover:border-white/[0.15] transition-all duration-400 h-full">
                {/* Icon badge */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.accent} bg-opacity-20 flex items-center justify-center text-white/90 mb-5`} style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`, border: '1px solid rgba(255,255,255,0.08)' }}>
                  {stat.icon}
                </div>
                
                {/* Counter */}
                <div className="text-4xl lg:text-5xl font-bold text-white font-display tracking-tight mb-3 flex items-baseline gap-1">
                  <span className="gcc-market-counter tabular-nums" data-target={stat.value}>{stat.value}</span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.accent} text-3xl lg:text-4xl`}>{stat.suffix}</span>
                </div>
                
                {/* Labels */}
                <div className="text-white/80 font-medium text-sm mb-2 tracking-wide">{stat.label}</div>
                <div className="text-white/35 text-xs font-light leading-relaxed">{stat.sub}</div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Source citation — adds trust */}
        <div className="mt-10 text-center">
          <p className="text-white/25 text-[11px] font-light tracking-wide">
            Source: NASSCOM, Deloitte GCC Report 2025, EY India Attractiveness Survey
          </p>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// PHILOSOPHY BACKGROUND — Animated circuit lines (kept from original)
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCPhilosophyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.philosophy-path', 
        { strokeDashoffset: 1000, opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.2, duration: 3, stagger: 0.2, ease: 'power1.inOut' }
      );
      gsap.to('.philosophy-point', {
        opacity: 0.4, scale: 1.5, duration: 2,
        repeat: -1, yoyo: true, stagger: { each: 0.5, from: 'random' }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="circuit-grad-gcc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <g stroke="url(#circuit-grad-gcc)" strokeWidth="0.5" strokeDasharray="1000">
          <path className="philosophy-path" d="M0,100 L200,100 L250,150 L600,150 L650,100 L1200,100" />
          <path className="philosophy-path" d="M0,400 L300,400 L350,350 L800,350 L850,400 L1200,400" />
          <path className="philosophy-path" d="M200,0 L200,200 L150,250 L150,600 L200,650 L200,800" />
          <path className="philosophy-path" d="M1000,0 L1000,300 L1050,350 L1050,700 L1000,750 L1000,800" />
          <path className="philosophy-path" d="M400,800 L400,600 L450,550 L900,550 L950,600 L950,800" />
        </g>
        <g fill="url(#circuit-grad-gcc)">
          <circle className="philosophy-point" cx="200" cy="100" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="600" cy="150" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="300" cy="400" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="800" cy="350" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="150" cy="600" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="1050" cy="350" r="2" opacity="0.1" />
          <circle className="philosophy-point" cx="450" cy="550" r="2" opacity="0.1" />
        </g>
      </svg>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════



// ═══════════════════════════════════════════════════════════════════════════════
// VALUE DELIVERY SECTION — Rewritten with buyer-outcome language
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCValueDeliverSection = () => {
  const [openAccordion, setOpenAccordion] = React.useState(0);
  const values = [
    { title: 'Ship code in 60 days, not 12 months', desc: 'Traditional GCC setup takes 12-18 months before production work begins. Our 60-day launch playbook compresses entity formation, infrastructure, and first-unit onboarding into a single executable timeline — so your engineering investment starts generating returns immediately.' },
    { title: 'Hire niche AI/ML talent 3x faster', desc: 'Our pre-built pipelines across Bengaluru, Hyderabad, and Pune mean your GCC doesn\'t wait for talent — it selects from pre-vetted candidates. 21-day average fill time for roles that take 60+ days through conventional hiring channels.' },
    { title: 'Eliminate 100% of India compliance ambiguity', desc: 'EPFO, ESI, Professional Tax, STPI/SEZ, Shops & Establishment Act, Gratuity Act, Maternity Benefit Act — all filed and monitored continuously. Your legal and finance teams don\'t become India labor law experts. We are.' },
    { title: 'Cut operational setup cost by 40-60%', desc: 'Kangqore\'s operating model eliminates the overhead of building internal compliance, HR, and facilities teams from scratch. Your CFO sees a predictable operating cost line instead of unpredictable setup capital — with 40-60% savings compared to fully self-managed GCC formation.' },
    { title: 'Scale from 8 to 100+ without restarting ops', desc: 'Unit (8-12) → Squad (20-30) → Division (50-100+). Each growth stage uses the same operational framework, the same compliance infrastructure, the same HR system. No re-setup. No re-negotiation. Just capacity.' },
    { title: 'Exit our model cleanly — by design', desc: 'When your center reaches operational maturity, we execute a structured handover: HR operations, compliance management, facility contracts, vendor relationships. No transfer fees. No artificial lock-in. We designed the exit path before the launch path.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
              <Activity className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">What You Get</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Outcomes, Not{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Promises.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Every GCC provider talks about "speed" and "talent." Here's what those words actually mean when Kangqore is executing.
            </p>
          </div>
          <div className="space-y-3">
            {values.map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
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
// BUYER SEGMENTATION — Clean separation (replaces old mixed segmentation)
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCBuyerSegmentation = () => {
  return (
    <section className="py-24 bg-white dark:bg-black relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
            <Users className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Who This Is For</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight mb-6">
            Engineered for Your <span className="text-transparent bg-clip-text bg-brand-gradient italic">Stage.</span>
          </h2>
          <div className="w-24 h-1 bg-brand-blue/20 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
             Three distinct buyer profiles — each with a different operating model configuration, timeline, and success metric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              tag: 'Stage 1', 
              title: 'First-Time GCC Builders', 
              who: 'Series C-D startups and mid-market enterprises making their first India center move.',
              painPoint: 'You need engineering talent at scale but have zero India operating experience — no entity, no compliance knowledge, no facility.',
              kangqoreModel: '60-day full-stack launch. We handle everything non-engineering. You own the team from Day 1.',
              metric: 'Time to first production sprint: 60 days',
              icon: <Rocket className="w-6 h-6" /> 
            },
            { 
              tag: 'Stage 2', 
              title: 'Scaling Existing GCCs', 
              who: 'Enterprises with 50-200 person centers needing to 2-3x headcount or add new capability units.',
              painPoint: 'Your current center works but can\'t scale fast enough. Hiring takes 90+ days. Adding AI/ML capability requires new talent pipelines you don\'t have.',
              kangqoreModel: 'Elastic unit augmentation. We source, screen, and onboard 8-12 person units into your existing operating model within 30 days.',
              metric: 'Unit deployment velocity: 30 days',
              icon: <TrendingUp className="w-6 h-6" /> 
            },
            { 
              tag: 'Stage 3', 
              title: 'Innovation-Under-Pressure', 
              who: 'Organizations under board-level pressure to show AI/digital ROI through a dedicated innovation center.',
              painPoint: 'Your board wants a GenAI Center of Excellence. Yesterday. You need specialized talent (ML engineers, data scientists, LLMOps) that takes 6 months to hire conventionally.',
              kangqoreModel: 'Pre-built AI/ML units with domain specialization. Deployed into your sprint cadence with production deliverables from Week 6.',
              metric: 'First AI model in production: 90 days',
              icon: <Zap className="w-6 h-6" /> 
            }
          ].map((item, idx) => (
             <div key={idx} className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
               <div className="absolute top-0 right-8 w-24 h-1 bg-gradient-to-r from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-slate-800 mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                 {item.icon}
               </div>
               <div className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">{item.tag}</div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-blue transition-colors">{item.title}</h3>
               
               <div className="space-y-4 flex-1">
                 <div>
                   <div className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Who</div>
                   <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">{item.who}</p>
                 </div>
                 <div>
                   <div className="text-xs font-bold tracking-wider text-red-400 uppercase mb-1">Pain Point</div>
                   <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">{item.painPoint}</p>
                 </div>
                 <div>
                   <div className="text-xs font-bold tracking-wider text-brand-blue uppercase mb-1">Kangqore Model</div>
                   <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">{item.kangqoreModel}</p>
                 </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-gray-100">
                 <div className="flex items-center gap-2">
                   <Target className="w-4 h-4 text-brand-blue flex-shrink-0" />
                   <span className="text-sm font-bold text-brand-blue">{item.metric}</span>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// DELIVERY GEOGRAPHY — Onsite / Nearshore / Offshore breakdown
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCDeliveryGeography = () => null; // Reserved for future use


// ═══════════════════════════════════════════════════════════════════════════════
// COMPETITIVE DIFFERENTIATION — Why not TCS/ANSR/Deloitte
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCCompetitiveDifferentiation = () => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.gcc-diff-row', { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
            <Shield className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Honest Comparison</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
            Why Not the{' '}<br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Usual Suspects?</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
            We respect our competitors. But our model is structurally different — and that matters when you're choosing who handles your India operations.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-4 bg-slate-900 text-white">
            <div className="p-5 font-bold text-sm">Dimension</div>
            <div className="p-5 font-bold text-sm border-l border-white/10">Large SI / Managed Services</div>
            <div className="p-5 font-bold text-sm border-l border-white/10">GCC Platform Providers</div>
            <div className="p-5 font-bold text-sm border-l border-brand-blue/30 bg-brand-blue/20">Kangqore</div>
          </div>
          
          {/* Rows */}
          {[
            { dim: 'Commercial Model', si: 'Advisory fees + multi-year BOT contracts', platform: 'Subscription + management fees', kangqore: 'Flexible engagement: team retainers or outcome-based. No lock-in. No transfer fees.' },
            { dim: 'Team Ownership', si: 'Their employees on your project', platform: 'Your team, their entity (initially)', kangqore: 'Your team, your entity, your IP — from Day 1' },
            { dim: 'Launch Speed', si: '6-12 months (advisory → setup → operate)', platform: '60-90 days', kangqore: '60 days — concept to first sprint' },
            { dim: 'Exit Path', si: 'Complex transfer negotiations', platform: 'BOT transition (12-18 months)', kangqore: 'Structured handover. No fees. No artificial dependency.' },
            { dim: 'What They Optimize For', si: 'Long-term managed service revenue', platform: 'Platform stickiness + headcount growth', kangqore: 'Your operational independence. We exit by design.' },
            { dim: 'India Compliance Depth', si: 'Through local subsidiaries', platform: 'Core compliance included', kangqore: 'Full statutory: EPFO, ESI, PT, STPI/SEZ, Gratuity, Maternity — monitored continuously' }
          ].map((row, i) => (
            <div key={i} className={`gcc-diff-row grid grid-cols-4 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900 dark:border-gray-800' : 'bg-gray-50'} border-t border-gray-100`}>
              <div className="p-5 font-bold text-sm text-gray-900 dark:text-white">{row.dim}</div>
              <div className="p-5 text-sm text-gray-500 font-light border-l border-gray-100">{row.si}</div>
              <div className="p-5 text-sm text-gray-500 font-light border-l border-gray-100">{row.platform}</div>
              <div className="p-5 text-sm text-gray-900 dark:text-white font-medium border-l border-brand-blue/10 bg-brand-blue/[0.02]">{row.kangqore}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-slate-900 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue rounded-full filter blur-[80px] opacity-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3 font-display">The Bottom Line</h3>
              <p className="text-white/70 font-light leading-relaxed">
                Unlike traditional GCC consultants, we don't charge advisory fees to tell you what you already know. Unlike large-scale managed service providers, we don't lock you into contracts that slowly transfer what was always your team. <strong className="text-white font-medium">From Day 1, you own the center, the team, and the IP. We own the operational friction.</strong> We provide flexible engagement models — and get out of the way when you're ready to run independently.
              </p>
            </div>
            <Link to="/contact?type=gcc-strategy" className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-slate-900 dark:text-white font-bold rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 group">
              Compare Our Model <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// MINDSET TIMELINE — GCC Operating Mindset (refined with specifics)
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCMindsetTimeline = () => {
  const journeyRef = useRef(null);
  
  useEffect(() => {
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
      const nodes = journeyRef.current.querySelectorAll('.journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  const phases = [
    { phase: 'DAY 1-15', icon: <Search className="w-7 h-7" />, title: 'Entity & Compliance Formation', desc: 'Company secretary engagement, PAN/TAN/GST registration, STPI/SEZ filing, state labor registrations (EPFO, ESI, Professional Tax), bank account activation.', gradient: 'from-slate-600 to-slate-800' },
    { phase: 'DAY 10-30', icon: <Layers className="w-7 h-7" />, title: 'Infrastructure & IT Provisioning', desc: 'Deployment in pre-approved SEZ co-working incubators for immediate Day 1 operations while permanent fit-out completes. AWS/Azure landing zones, VPN tunnels to HQ, ISMS-aligned endpoint management.', gradient: 'from-blue-500 to-blue-700', kangqore: true },
    { phase: 'DAY 15-45', icon: <Users className="w-7 h-7" />, title: 'Talent Sourcing & Technical Screening', desc: 'AI-led sourcing from pre-built pipelines, technical depth interviews, culture-fit assessment, offer management, notice period negotiation.', gradient: 'from-brand-blue to-indigo-600', kangqore: true },
    { phase: 'DAY 30-60', icon: <Server className="w-7 h-7" />, title: 'Onboarding & Domain Immersion', desc: '30/60/90 structured onboarding: domain context sprints, codebase walkthroughs, shadow rotations with HQ leads, sprint cadence alignment.', gradient: 'from-emerald-500 to-emerald-700', kangqore: true },
    { phase: 'DAY 60-90', icon: <Activity className="w-7 h-7" />, title: 'First Independent Delivery', desc: 'First production sprint. KPI dashboards active. Governance rituals operational. Weekly sync with HQ engineering leadership. Your center is live.', gradient: 'from-purple-500 to-purple-700', kangqore: true }
  ];

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .journey-curve-glow { filter: blur(3px); }
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .journey-curve-glow { animation: glow-pulse 3s ease-in-out infinite; }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 order-2 lg:order-1">
             <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                  <Network className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">The 60-Day Playbook</span>
                </div>
               <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                 From Sign-Off to{' '}<br />
                 <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">First Sprint.</span>
               </h2>
               <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                 Five overlapping execution streams compress what typically takes 12-18 months into 60 days. Each phase runs in parallel — not sequentially.
               </p>

               <div className="p-8 bg-slate-900 rounded-3xl mt-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue rounded-full filter blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <h4 className="flex items-center gap-3 text-white font-bold text-xl mb-4">
                    <Globe2 className="w-6 h-6 text-brand-blue" /> The Ownership Guarantee
                  </h4>
                  <p className="text-gray-400 leading-relaxed font-light text-sm">
                    From Day 1, your GCC is <strong className="text-white font-medium">your legal entity, your team, your IP</strong>. We are the operations layer underneath — handling compliance, facilities, and HR. You are the engineering leadership. There is no "transfer" because there is nothing to transfer. It was always yours.
                  </p>
               </div>
             </div>
          </div>
          
          <div className="w-full lg:w-[55%] relative order-1 lg:order-2">
             <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1100" preserveAspectRatio="none" fill="none">
                 <defs>
                  <linearGradient id="api-journey-grad-gcc" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="25%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#2564ea" />
                    <stop offset="75%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <filter id="api-journey-glow-gcc">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000 S 8 1050, 15 1100" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000 S 8 1050, 15 1100" stroke="url(#api-journey-grad-gcc)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#api-journey-glow-gcc)" opacity="0.3" />
                <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000 S 8 1050, 15 1100" stroke="url(#api-journey-grad-gcc)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[100, 320, 540, 760, 980].map((cy, i) => (
                  <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#api-journey-grad-gcc)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#api-journey-grad-gcc)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#api-journey-grad-gcc)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                  </g>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="journey-card group">
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
                        {item.kangqore && <div className="px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase shrink-0">Kangqore</div>}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// FUTURE READY — What Great GCC Models Require (rewritten with specifics)
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCFutureReady = () => {
  return (
    <section className="py-24 bg-[#fefffc] relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight mb-6">
            What Separates a GCC from a <span className="text-transparent bg-clip-text bg-brand-gradient italic">Cost Center.</span>
          </h2>
          <div className="w-24 h-1 bg-brand-blue/20 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'HQ-Grade Onboarding, Not Orientation Theater', text: 'If your GCC engineers don\'t understand WHY they build, they will never deliver at the quality of engineers who do. 30/60/90 domain immersion with shadow rotations is non-negotiable.' },
            { title: 'Compliance as Infrastructure, Not an Afterthought', text: 'EPFO, ESI, Professional Tax, Gratuity Act — these aren\'t checkboxes. A single statutory breach can freeze your operations. Compliance must be continuous, automated, and monitored.' },
            { title: 'Engineering Leadership Must Stay at HQ', text: 'The moment you delegate engineering leadership to the GCC "site lead," you\'ve created an outpost, not an extension. Your VP of Engineering owns the roadmap. The GCC executes it.' },
            { title: 'Operational Economics, Not Capital Gambles', text: 'Entity formation, facility buildout, and HR department creation are sunk costs that kill GCC ROI in Year 1. Flexible operating models that eliminate these overheads make the business case immediate — not a 3-year payback.' },
            { title: 'Exit Path Designed Before Launch Path', text: 'If your GCC partner doesn\'t have a defined exit path before Day 1, they\'re optimizing for their revenue, not your independence. Ask for the exit playbook — not just the launch playbook.' },
            { title: 'Sprint Cadence Parity, Not Timezone Theater', text: 'Your GCC should attend the same standups, use the same JIRA boards, and follow the same sprint cadence as HQ. If there\'s a separate "offshore board," you\'ve already lost cultural parity.' }
          ].map((d, i) => (
            <div key={i} className="diff-item group flex flex-col gap-4 p-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-slate-800 font-bold border border-gray-100 flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{d.title}</h4>
                <p className="text-gray-500 font-light leading-relaxed text-sm">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEW: KANGQORE COMMAND CENTER MOCKUP
// ═══════════════════════════════════════════════════════════════════════════════
export const KangqoreCommandCenterDashboard = () => {
  const dashboardRef = useRef(null);
  
  useEffect(() => {
    if (!dashboardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.mock-card', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: dashboardRef.current, start: 'top 70%', once: true }}
      );
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={dashboardRef} className="py-24 bg-[#0a0f1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,100,234,0.1)_0%,transparent_60%)]"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-6">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">Named Platform</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white font-display tracking-tight mb-6">
            Kangqore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Command Center.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Total operational visibility from Day 1. Monitor recruitment velocity, infrastructure deployment, compliance status, and sprint completion from a single unified interface.
          </p>
        </div>

        {/* Dashboard Mockup UI */}
        <div className="mx-auto bg-[#0d1321] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-w-5xl mock-card">
          {/* Dashboard Header */}
          <div className="bg-[#151e32] px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-4 text-white/60 text-sm font-medium tracking-wide">Command Center v2.4</span>
            </div>
            <div className="flex items-center gap-4 hidden sm:flex">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">SYSTEM HEALTH: OPTIMAL</span>
              <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30"><Target className="w-4 h-4 text-brand-blue" /></div>
            </div>
          </div>
          {/* Dashboard Content */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              {/* Active Deployment Chart */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/[0.02] border border-white/5 rounded-xl p-5">
                <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Pipeline Velocity</h3>
                <div className="h-40 flex items-end gap-2">
                   {[40, 65, 45, 80, 55, 90, 70, 100, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-brand-blue/20 rounded-t-sm relative group transition-all duration-300 hover:bg-cyan-500/60" style={{ height: `${h}%` }}>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400"></div>
                      </div>
                   ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                 {/* Live KPIs */}
                 <div className="bg-white dark:bg-gray-900 dark:border-gray-800/[0.02] border border-white/5 rounded-xl p-5">
                    <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Time-to-Hire</div>
                    <div className="text-3xl font-bold text-white font-display mb-1">18 <span className="text-xl text-white/50 font-sans">Days</span></div>
                    <div className="text-emerald-400 flex items-center gap-1 text-sm font-medium"><TrendingUp className="w-4 h-4" /> 14% vs benchmark</div>
                 </div>
                 <div className="bg-white dark:bg-gray-900 dark:border-gray-800/[0.02] border border-white/5 rounded-xl p-5">
                    <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Open Reqs</div>
                    <div className="text-3xl font-bold text-white font-display mb-1">24</div>
                    <div className="text-white/50 text-sm font-medium">12 in final interview</div>
                 </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Compliance & Operations status */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/[0.02] border border-white/5 rounded-xl p-5 h-full flex flex-col">
                 <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2"><Shield className="w-4 h-4" /> Playbook Status</h3>
                 <div className="space-y-4 flex-1">
                    {[
                      { l: 'Entity Registration', s: 'Completed', c: 'text-emerald-400' },
                      { l: 'Compliance Setup', s: 'Completed', c: 'text-emerald-400' },
                      { l: 'Workspace IT Prep', s: 'In Progress', c: 'text-cyan-400' },
                      { l: 'Talent Sourcing', s: 'Active', c: 'text-blue-400' },
                      { l: 'First Sprint', s: 'Pending', c: 'text-white/30' }
                    ].map((st, i) => (
                      <div key={i} className="flex justify-between items-center bg-white dark:bg-gray-900 dark:border-gray-800/[0.03] p-3 rounded-lg border border-white/5">
                        <span className="text-white/80 text-sm">{st.l}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${st.c}`}>{st.s}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEW: GCC DIAMOND MODEL — The 4 Domains of Operation
// ═══════════════════════════════════════════════════════════════════════════════
export const GCCDiamondModel = () => {
  const diamondRef = useRef(null);

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
  }, []);

  // Using only the Kangqore brand-blue to cyan gradient spectrum
  const domains = [
    { title: 'Entity &\nCompliance', lines: ['Company Formation •', 'Transfer Pricing (Cost+) •', 'Tax Registration •', 'Labor Law •'], align: 'right', pos: 'top right' },
    { title: 'Infrastructure\n& IT', lines: ['• Incubator Workspaces', '• AWS/Azure Zones', '• VPN Tunnels', '• Endpoint Security'], align: 'left', pos: 'top left' },
    { title: 'Talent &\nHR Ops', lines: ['AI-Led Sourcing •', 'Payroll Mgmt •', 'Benefits Admin •', 'Employer Branding •'], align: 'right', pos: 'bottom right' },
    { title: 'Engineering\nExecution', lines: ['• Sprint Cadence', '• 30/60/90 Immersion', '• HQ Alignment', '• KPI Dashboards'], align: 'left', pos: 'bottom left' }
  ];

  return (
    <section className="py-24 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gcc-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes gcc-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes gcc-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12">
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">GCC Execution Engine</strong> defines the right entity, infrastructure, and compliance boundaries before launch complexity leads to fragility.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                By unifying legal compliance, IT provisioning, talent acquisition, and agile execution, we ensure your Global Capability Center is production-ready and fully aligned with your HQ from Day 1.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                {/* Background Connectors */}
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="gcc-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  
                  {/* Top connector */}
                  <circle cx="300" cy="40" r="7" fill="url(#gcc-blue-grad)" style={{ animation: 'gcc-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#gcc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'gcc-connector-draw 2s ease-out forwards' }} />
                  
                  {/* Left connector */}
                  <circle cx="40" cy="300" r="7" fill="url(#gcc-blue-grad)" style={{ animation: 'gcc-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#gcc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'gcc-connector-draw 2s ease-out 0.3s forwards' }} />
                  
                  {/* Bottom connector */}
                  <circle cx="300" cy="560" r="7" fill="url(#gcc-blue-grad)" style={{ animation: 'gcc-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#gcc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'gcc-connector-draw 2s ease-out 0.6s forwards' }} />
                  
                  {/* Right connector */}
                  <circle cx="560" cy="300" r="7" fill="url(#gcc-blue-grad)" style={{ animation: 'gcc-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#gcc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'gcc-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* 3D Diamond */}
                <div className="relative z-10 w-[320px] h-[320px]" style={{ perspective: '1000px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[24px] p-[3px] shadow-2xl bg-gradient-to-br from-brand-blue/30 to-cyan-400/30" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'gcc-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[4px] rounded-[20px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Using variations of the brand blue gradient */}
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-700" style={{ transform: 'translateZ(10px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px] whitespace-pre-line">{domains[0].title}</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#2564ea] to-[#4ab6d4]" style={{ transform: 'translateZ(6px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px] whitespace-pre-line">{domains[1].title}</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#4ab6d4] to-blue-500" style={{ transform: 'translateZ(4px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px] whitespace-pre-line">{domains[2].title}</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-800 to-blue-900" style={{ transform: 'translateZ(8px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px] whitespace-pre-line">{domains[3].title}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Labels */}
                <div className="absolute top-[50px] right-1/2 mr-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-[16px] text-gray-700 dark:text-gray-300 text-right font-medium">
                    {domains[0].lines.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
                <div className="absolute top-[130px] left-1/2 ml-[190px] w-[320px] z-20">
                  <ul className="space-y-1 text-[16px] text-gray-700 dark:text-gray-300 text-left font-medium">
                    {domains[1].lines.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
                <div className="absolute bottom-[110px] right-1/2 mr-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-[16px] text-gray-700 dark:text-gray-300 text-right font-medium">
                    {domains[2].lines.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
                <div className="absolute bottom-[40px] left-1/2 ml-[190px] w-[320px] z-20">
                  <ul className="space-y-1 text-[16px] text-gray-700 dark:text-gray-300 text-left font-medium">
                    {domains[3].lines.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </div>
             </div>
          </div>

          {/* Mobile Display */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {domains.map((d, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-brand-gradient p-5 text-white font-bold text-lg whitespace-pre-line">{d.title}</div>
                <div className="p-5">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {d.lines.map((l, k) => <li key={k}>{l.replace('•', '').trim()}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

