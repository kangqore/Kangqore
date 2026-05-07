import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, Leaf, Settings, ChevronDown, Target, Layers, Zap, CheckCircle2, LineChart, DollarSign, Scale, Building2, BrainCircuit, FileCheck, Search, Network, Activity, Sparkles, Rocket, Globe, Heart, Eye } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);




// ═══════════════════════════════════════════════════════════════════════════════
// Finance Philosophy Background — Animated circuitry
// ═══════════════════════════════════════════════════════════════════════════════
export const FinancePhilosophyBackground = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fr-path', { strokeDashoffset: 1000, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.2, duration: 3, stagger: 0.2, ease: 'power1.inOut' });
      gsap.to('.fr-point', { opacity: 0.4, scale: 1.5, duration: 2, repeat: -1, yoyo: true, stagger: { each: 0.5, from: 'random' } });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        <defs><linearGradient id="fr-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" /><stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.8" /></linearGradient></defs>
        <g stroke="url(#fr-grad)" strokeWidth="0.5" strokeDasharray="1000">
          <path className="fr-path" d="M0,100 L200,100 L250,150 L600,150 L650,100 L1200,100" />
          <path className="fr-path" d="M0,400 L300,400 L350,350 L800,350 L850,400 L1200,400" />
          <path className="fr-path" d="M200,0 L200,200 L150,250 L150,600 L200,650 L200,800" />
          <path className="fr-path" d="M1000,0 L1000,300 L1050,350 L1050,700 L1000,750 L1000,800" />
        </g>
        <g fill="url(#fr-grad)">
          <circle className="fr-point" cx="200" cy="100" r="2" opacity="0.1" />
          <circle className="fr-point" cx="600" cy="150" r="2" opacity="0.1" />
          <circle className="fr-point" cx="300" cy="400" r="2" opacity="0.1" />
          <circle className="fr-point" cx="800" cy="350" r="2" opacity="0.1" />
        </g>
      </svg>
    </div>
  );
};
// Related Engineering Expertise
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceRelatedExpertise = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.expertise-link');
      gsap.fromTo(items, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true } });
    }
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 overflow-hidden relative border-t border-gray-100" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl font-light">
              Extend your finance and risk transformation into a comprehensive enterprise modernization initiative with Kangqore's connected capabilities.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Digital Process Automation', link: '/services/automation/digital-process-automation', icon: <Zap className="w-5 h-5" />, desc: 'Automate finance workflows, approvals, and compliance processes at scale.' },
                { name: 'Data Science & AI', link: '/services/ai-cognitive/data-science-ai', icon: <BrainCircuit className="w-5 h-5" />, desc: 'AI-powered risk analytics, forecasting models, and decision intelligence.' },
                { name: 'Enterprise Applications', link: '/department/enterprise-applications', icon: <Building2 className="w-5 h-5" />, desc: 'ERP modernization, SAP/Oracle transformation, and platform integration.' }
              ].map((item, idx) => (
                <Link key={idx} to={item.link} className="expertise-link group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-brand-blue/10">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:rotate-12">{item.icon}</div>
                  <div>
                    <span className="font-bold text-lg block mb-1 group-hover:text-brand-blue transition-colors">{item.name}</span>
                    <p className="text-gray-500 text-sm font-light">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative hidden lg:block">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <TrendingUp className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              {[
                { Icon: Shield, label: 'RISK_CTRL', pos: 'top-0 left-1/2 -translate-x-1/2', bg: 'bg-slate-900', color: 'text-cyan-400' },
                { Icon: BarChart3, label: 'EPM_SVC', pos: 'bottom-10 left-0', bg: 'bg-brand-gradient', color: 'text-white' },
                { Icon: Leaf, label: 'ESG_DATA', pos: 'bottom-10 right-0', bg: 'bg-emerald-600', color: 'text-white' }
              ].map((node, idx) => (
                <div key={idx} className={`absolute ${node.pos} text-center group`}>
                  <div className={`w-20 h-20 ${node.bg} rounded-3xl shadow-2xl flex items-center justify-center mb-2 hover:-translate-y-2 transition-all`}>
                    <node.Icon className={`w-10 h-10 ${node.color}`} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">{node.label}</span>
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
// BLOCKCHAIN-EQUIVALENT: Editorial Quote + Why Section
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.fr-why-item');
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }
  }, []);

  return (
    <>
      {/* Editorial Quote Block */}
      <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative group">
              <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
                <img src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=format&fit=crop&w=1260&q=80" alt="Finance & Risk" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-gradient rounded-full opacity-10 animate-pulse"></div>
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
                  Finance and risk are no longer back-office functions. They are the <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">strategic intelligence layer</span> of the modern enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why F&R Section */}
      <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden" ref={sectionRef}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="fr-why-item">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                <Search className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">The Opportunity</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                Moving Beyond{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Control & Reporting.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                Finance and risk functions are no longer measured only by compliance accuracy and reporting speed. They are now expected to shape enterprise decisions, absorb volatility faster, improve resilience, and unlock measurable business value across every domain.
              </p>
            </div>
            <div className="space-y-8 fr-why-item">
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Foundation</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Enterprise resilience starts with finance and risk operating models that are data-driven, AI-enabled, and architecturally integrated — not siloed reporting functions reacting to last quarter's numbers.
                </p>
              </div>
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Challenge</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Legacy reporting, fragmented risk data, manual compliance processes, and disconnected planning systems create operational drag, blind spots, and decision latency across the entire finance and risk function.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN-EQUIVALENT: Value Accordion
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceValueDeliver = () => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const values = [
    { title: 'Faster reporting and decision cycles', desc: 'Reduce time spent gathering data, accelerate report delivery, and give finance leaders more time for analysis, insight, and strategic action — not data wrangling.' },
    { title: 'Lower risk operations cost', desc: 'Use automation, exception-based workflows, AI-led risk detection, and stronger control design to reduce operational cost while improving resilience and compliance confidence.' },
    { title: 'Better forecasting and planning accuracy', desc: 'Move from static planning to predictive, driver-based, AI-supported forecasting and scenario modeling that connects planning to execution across the enterprise.' },
    { title: 'Stronger ESG readiness and auditability', desc: 'Build dependable sustainability data foundations with automated workflows, stronger controls, and more decision-useful disclosure capabilities.' },
    { title: 'More agile finance operations', desc: 'Improve payables, receivables, close cycles, compliance, and working-capital performance with managed digital operations that scale without proportional headcount growth.' },
    { title: 'Governance that scales with complexity', desc: 'Build governance frameworks that strengthen as your finance and risk landscape grows — ensuring control without creating operational drag or bureaucratic bottlenecks.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <Activity className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Value Delivered</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Value We Deliver in{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Finance & Risk.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps enterprises transform finance and risk from operational burden into a strategic growth engine that delivers measurable business outcomes.
            </p>
          </div>
          <div className="space-y-3">
            {values.map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
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
// BLOCKCHAIN-EQUIVALENT: Diamond CoE + Differentiators
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceDiamondCoESection = () => {
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  
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
  }, []);

  return (
    <section className="py-24 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
       <style dangerouslySetInnerHTML={{__html: `
        @keyframes fr-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes fr-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fr-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">Finance & Risk CoE</strong> unifies platform modernization, risk governance, AI-enabled automation, and ESG readiness into one integrated practice.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We ensure every finance transformation is architecturally sound, compliance-confident, and measurably valuable to the enterprise.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="fr-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#fr-blue-grad)" style={{ animation: 'fr-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#fr-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'fr-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#fr-blue-grad)" style={{ animation: 'fr-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#fr-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'fr-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#fr-blue-grad)" style={{ animation: 'fr-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#fr-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'fr-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#fr-blue-grad)" style={{ animation: 'fr-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#fr-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'fr-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'fr-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#1e40af] to-[#2564ea]" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Risk<br/>Governance</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#2564ea] to-[#3b82f6]" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Platform<br/>Modernization</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9]" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">ESG<br/>Intelligence</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#0ea5e9] to-[#4ab6d4]" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Predictive<br/>Planning</div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Regulatory Monitoring •</li><li>Control Automation •</li><li>AML / KYC / Fraud •</li><li>Risk Scoring AI •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• ERP Transformation</li><li>• Data Architecture</li><li>• Process Redesign</li><li>• Cloud Migration</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Sustainability Data •</li><li>Disclosure Readiness •</li><li>Carbon Accounting •</li><li>Audit Controls •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Driver Forecasting</li><li>• Scenario Modeling</li><li>• Connected Planning</li><li>• Gen-AI Insights</li></ul></div>
              </div>
            </div>
            {/* Mobile Cards — Premium */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                { title: 'Risk Governance', items: ['Regulatory Monitoring', 'Control Automation', 'AML / KYC / Fraud', 'Risk Scoring AI'], gradient: 'from-[#1e40af] to-[#2564ea]', icon: '🛡️' },
                { title: 'Platform Modernization', items: ['ERP Transformation', 'Data Architecture', 'Process Redesign', 'Cloud Migration'], gradient: 'from-[#2564ea] to-[#3b82f6]', icon: '⚙️' },
                { title: 'ESG Intelligence', items: ['Sustainability Data', 'Disclosure Readiness', 'Carbon Accounting', 'Audit Controls'], gradient: 'from-[#3b82f6] to-[#0ea5e9]', icon: '🌱' },
                { title: 'Predictive Planning', items: ['Driver Forecasting', 'Scenario Modeling', 'Connected Planning', 'Gen-AI Insights'], gradient: 'from-[#0ea5e9] to-[#4ab6d4]', icon: '📊' }
              ].map((q, idx) => (
                <div key={idx} className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${q.gradient}`}></div>
                  <div className="p-5 pl-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{q.icon}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-brand-blue transition-colors">{q.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {q.items.map((item, k) => (
                        <li key={k} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${q.gradient} flex-shrink-0`}></div>
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
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { num: 1, title: 'Strategy-Led Execution', text: 'We connect finance and risk strategy directly to implementation — no gap between advisory and delivery.' },
              { num: 2, title: 'Platform + Process + Data Under One Model', text: 'We redesign finance platforms, business processes, and data architecture together — not as separate workstreams.' },
              { num: 3, title: 'AI-Enabled, Control-Conscious', text: 'We bring AI and automation to finance modernization while maintaining governance integrity and compliance confidence.' },
              { num: 4, title: 'ESG-Native Finance Design', text: 'Sustainability measurement is built into finance architecture from the start — not bolted on as a reporting afterthought.' },
              { num: 5, title: 'Managed Operations at Scale', text: 'We combine operating discipline, automation, AI, and flexible delivery structures to improve finance execution at scale.' },
              { num: 6, title: 'Long-Term Evolution Beyond Go-Live', text: 'Our engagement model extends beyond implementation to continuous optimization, compliance monitoring, and capability scaling.' }
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
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN-EQUIVALENT: Delivery Model — 4-Phase Timeline
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceDeliveryModel = () => {
  const journeyRef = useRef(null);
  
  useEffect(() => {
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
      });
      const pathEl = journeyRef.current.querySelector('.fr-journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.fr-journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.fr-journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  const phases = [
    { phase: 'ASSESS', icon: <Search className="w-7 h-7" />, title: 'Diagnose & Map', desc: 'Map current-state maturity across platform, process, data, controls, and talent to identify high-impact transformation levers.', gradient: 'from-slate-600 to-slate-800' },
    { phase: 'ARCHITECT', icon: <Layers className="w-7 h-7" />, title: 'Design the Model', desc: 'Build the future-state vision: finance platform roadmap, operating model redesign, governance framework, and change strategy.', gradient: 'from-blue-500 to-blue-700', kangqore: true },
    { phase: 'EXECUTE', icon: <Zap className="w-7 h-7" />, title: 'Transform & Deploy', desc: 'Platform migration, automation deployment, reporting modernization, ESG integration, and managed services activation.', gradient: 'from-brand-blue to-indigo-600', kangqore: true },
    { phase: 'EVOLVE', icon: <Activity className="w-7 h-7" />, title: 'Optimize & Scale', desc: 'Continuous compliance monitoring, predictive analytics tuning, ESG disclosure readiness, and operational optimization at scale.', gradient: 'from-cyan-400 to-cyan-600', kangqore: true }
  ];

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .fr-journey-curve-glow { filter: blur(3px); }
          @keyframes fr-glow-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .fr-journey-curve-glow { animation: fr-glow-pulse 3s ease-in-out infinite; }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[55%] relative">
             <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                 <defs>
                  <linearGradient id="fr-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="33%" stopColor="#3b82f6" />
                    <stop offset="66%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                  <filter id="fr-journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="fr-journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#fr-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#fr-journey-glow-v)" opacity="0.3" />
                <path className="fr-journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#fr-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="fr-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#fr-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#fr-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#fr-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-fr-${i}`} cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="fr-journey-card group">
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
                        {item.kangqore && <div className="px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-[7px] font-bold tracking-[0.15em] text-brand-blue uppercase shrink-0">Kangqore</div>}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
             <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                  <Network className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Delivery Model</span>
                </div>
               <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                 Our F&R <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Delivery Model.</span>
               </h2>
               <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                 At Kangqore, finance and risk transformation follows a structured, evidence-based model — designed to minimize disruption and maximize sustained operational improvement.
               </p>
               <div className="grid grid-cols-3 gap-6 pt-8">
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div><div className="text-2xl font-bold text-gray-900 dark:text-white">04</div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Cycle</div><div className="text-2xl font-bold text-gray-900 dark:text-white">Agile</div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Control</div><div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">MAX</div></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN-EQUIVALENT: Execution Ecosystem — Orbit Tech Stack
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceExecutionEcosystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.fr-orbit-ring-1', { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.fr-orbit-ring-2', { rotation: -360, duration: 55, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.fr-orbit-ring-3', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.fr-orbit-node-1', { rotation: -360, duration: 40, ease: 'none', repeat: -1 });
      gsap.to('.fr-orbit-node-2', { rotation: 360, duration: 55, ease: 'none', repeat: -1 });
      gsap.to('.fr-orbit-node-3', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });
      gsap.fromTo('.fr-eco-enter', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-24 pb-32 lg:pt-36 lg:pb-48 bg-[#fefffc] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fr-orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .fr-orbit-path { animation: fr-orbit-glow-pulse 4s ease-in-out infinite; }
      `}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="fr-eco-enter">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <TrendingUp className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Tech Ecosystem</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              The Finance<br />Ecosystem{' '}
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Stack.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Effective finance transformation requires ERP platforms, GRC systems, planning tools, analytics engines, and automation frameworks working together as a unified ecosystem.
            </p>
          </div>
          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            {/* Central Hub */}
            <div className="fr-eco-enter absolute w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-brand-blue via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl z-20">
              <div className="relative">
                <TrendingUp className="w-14 h-14 lg:w-16 lg:h-16 text-white drop-shadow" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Orbit 1 */}
            <div className="fr-eco-enter fr-orbit-ring-1 absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-full fr-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.1)' }}>
                <div className="fr-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[10px] shadow-lg" style={{ top: '0%', left: '50%' }}>ERP</div>
                <div className="fr-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[10px] shadow-lg" style={{ top: '100%', left: '50%' }}>GRC</div>
            </div>

            {/* Orbit 2 */}
            <div className="fr-eco-enter fr-orbit-ring-2 absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full fr-orbit-path" style={{ border: '1px dashed rgba(37, 100, 234, 0.2)' }}>
                <div className="fr-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-blue text-white font-bold text-xs shadow-xl text-center leading-tight hover:scale-110 transition-transform" style={{ top: '14.65%', left: '85.35%' }}>EPM<br/>Planning</div>
                <div className="fr-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 h-10 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white font-black text-xs shadow-lg whitespace-nowrap hover:scale-110 transition-transform" style={{ top: '85.35%', left: '14.65%' }}>RPA / AI</div>
            </div>

            {/* Orbit 3 */}
            <div className="fr-eco-enter fr-orbit-ring-3 absolute w-[440px] h-[440px] lg:w-[520px] lg:h-[520px] rounded-full fr-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.08)' }}>
                <div className="fr-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform text-center leading-tight" style={{ top: '6.7%', left: '75%' }}>ESG Data</div>
                <div className="fr-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 lg:px-5 h-10 lg:h-12 rounded-2xl bg-slate-800 text-white font-bold text-xs shadow-lg min-w-max hover:scale-110 transition-transform" style={{ top: '93.3%', left: '75%' }}>Analytics</div>
                <div className="fr-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue font-bold text-[10px] shadow-sm hover:scale-110 transition-transform" style={{ top: '50%', left: '0%' }}>Treasury</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN-EQUIVALENT: Future-Ready — Platform Requirements (Redesigned from Accordion to Grid)
// ═══════════════════════════════════════════════════════════════════════════════
export const FinanceFutureReadySection = () => {
    const requirements = [
        { icon: Network, title: 'Unified Data Architecture', desc: 'Finance transformation fails without data transformation. A single, governed data model must connect planning, reporting, risk, compliance, and operational data across the enterprise.' },
        { icon: BrainCircuit, title: 'Platform Interoperability', desc: 'Modern finance operates across ERP, EPM, GRC, analytics, and automation platforms. These must work as an integrated ecosystem — not isolated point solutions.' },
        { icon: Shield, title: 'Continuous Intelligence', desc: 'Manual compliance checks and periodic audits can\'t keep pace with evolving regulatory landscapes. Real-time, AI-enabled compliance monitoring is now table stakes.' },
        { icon: LineChart, title: 'Decision-Ready Forecasting', desc: 'Static planning cycles delay decisions. Connected, driver-based forecasting with AI-powered scenario modeling is required to make finance predictive rather than reactive.' }
    ];

    return (
        <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16 lg:mb-24">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                    <Rocket className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Platform Requirements</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
                    What Modern Finance{' '}<br className="hidden lg:block"/>
                    <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Requires.</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mx-auto mb-8"></div>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                    We help enterprises navigate finance complexity across four critical architecture requirements for lasting operational excellence.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {requirements.map((req, i) => {
                        const IconComp = req.icon;
                        return (
                            <div key={i} className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-[2rem] p-10 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-[2rem]"></div>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-lg transition-transform duration-500">
                                        <IconComp className="w-6 h-6 text-brand-blue" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-blue transition-colors">
                                        {req.title}
                                    </h3>
                                    <p className="text-gray-500 font-light leading-relaxed text-lg">
                                        {req.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
