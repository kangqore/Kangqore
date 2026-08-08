import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, Briefcase, ChevronDown, Palette, Rocket, BrainCircuit, CheckCircle2, Code2, Bot, Users, Headset, TrendingUp, Zap, Settings, Workflow, Shield, Eye, Cog } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PHILOSOPHY BACKGROUND — Subtle Animated Circuitry / Mesh
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowPhilosophyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sn-phi-path', 
        { strokeDashoffset: 1000, opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.15, duration: 3, stagger: 0.2, ease: 'power1.inOut' }
      );
      gsap.to('.sn-phi-point', {
        opacity: 0.35,
        scale: 1.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.5, from: 'random' }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        <path className="sn-phi-path" d="M0,200 L400,200 L450,250 L800,250 L850,200 L1200,200" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="sn-phi-path" d="M0,600 L300,600 L350,550 L900,550 L950,600 L1200,600" stroke="#4ab6d4" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="sn-phi-path" d="M200,0 L200,300 L250,350 L250,500 L200,550 L200,800" stroke="#2564ea" strokeWidth="0.3" strokeDasharray="1000" />
        <path className="sn-phi-path" d="M1000,0 L1000,250 L950,300 L950,550 L1000,600 L1000,800" stroke="#4ab6d4" strokeWidth="0.3" strokeDasharray="1000" />
        <circle className="sn-phi-point" cx="400" cy="200" r="2" fill="#2564ea" />
        <circle className="sn-phi-point" cx="800" cy="250" r="2" fill="#4ab6d4" />
        <circle className="sn-phi-point" cx="250" cy="350" r="1.5" fill="#2564ea" />
        <circle className="sn-phi-point" cx="950" cy="300" r="1.5" fill="#4ab6d4" />
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY SERVICENOW TRANSFORMATION — Challenge/Opportunity Section
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.sn-why-item');
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
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
                <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=format&fit=crop&w=1260&q=80" alt="Enterprise Service Management" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
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
                  Service platforms are not just about ticket routing. They are about <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">governed workflow orchestration</span> across the enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Transformation Section */}
      <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden" ref={sectionRef}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="sn-why-item">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                <Search className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Why Transform</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                Service platforms underperform when workflows stay{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">fragmented.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                Many organizations invest in service platforms but still struggle to realize full value because processes remain siloed, workflows stay manual, governance is inconsistent, and tool adoption is not aligned to operational maturity. ServiceNow creates stronger outcomes when it is implemented as a connected enterprise workflow platform rather than treated as a ticketing layer.
              </p>
            </div>
            <div className="space-y-8 sn-why-item">
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Challenge</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Low value realization, siloed processes and data, ITIL alignment issues, weak workflow maturity, lack of structured automation, and security/compliance concerns are common blockers that prevent enterprises from maximizing their ServiceNow investment.
                </p>
              </div>
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Opportunity</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  ServiceNow-led transformation improves efficiency, enables intelligent remediation, supports standardized service delivery, and modernizes IT and enterprise service environments through advisory, implementation, integration, and managed services.
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
// 3. VALUE WE DELIVER — Numbered Accordion
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowValueDeliver = () => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const values = [
    { title: 'Better value realization from platform investment', desc: 'Turn ServiceNow from a tool deployment into an operational value engine across service workflows.' },
    { title: 'Reduced manual process overhead', desc: 'Use structured workflow automation to lower human dependency, improve response speed, and simplify service execution.' },
    { title: 'Stronger standardization and governance', desc: 'Align workflows to recognized service-management practices and bring more policy discipline into operations.' },
    { title: 'Better visibility across assets and operations', desc: 'Improve operational awareness through platform-led service data, asset transparency, and workflow insight.' },
    { title: 'Cleaner integration across enterprise ecosystems', desc: 'Connect ServiceNow with third-party apps, enterprise systems, and workflow layers to reduce silos.' },
    { title: 'Managed evolution after implementation', desc: 'Support long-term platform maturity through shared or dedicated service models, continuous optimization, and BAU support.' }
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
              Value We Deliver with{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">ServiceNow.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps enterprises transform fragmented service environments into standardized, automated, and measurable workflow platforms.
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
// 4. DIAMOND CoE — Why Kangqore (3D Diamond + Differentiators)
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowDiamondCoESection = () => {
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
        @keyframes sn-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes sn-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sn-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">ServiceNow CoE</strong> provides a high-velocity strategic blueprint, surrounding your workflow initiative with four critical layers of platform validation.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace "tool deployment" with "architect-and-govern." By unifying workflow strategy, service design, security operations, and integration management, we ensure your ServiceNow platform is built on absolute operational confidence.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="sn-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#sn-blue-grad)" style={{ animation: 'sn-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#sn-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sn-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#sn-blue-grad)" style={{ animation: 'sn-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#sn-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sn-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#sn-blue-grad)" style={{ animation: 'sn-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#sn-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sn-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#sn-blue-grad)" style={{ animation: 'sn-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#sn-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sn-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'sn-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Workflow<br/>Discipline</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Platform<br/>Connect</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Automation<br/>Control</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Managed<br/>Evolution</div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>ITSM Standardization •</li><li>ITOM Visibility •</li><li>ITAM Governance •</li><li>Process Discipline •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Enterprise Integration</li><li>• API Connectivity</li><li>• Data Synchronization</li><li>• Ecosystem Extension</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Workflow Automation •</li><li>Policy Enforcement •</li><li>Security Operations •</li><li>GRC Compliance •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Continuous Optimization</li><li>• BAU Support</li><li>• Adoption Management</li><li>• Roadmap Execution</li></ul></div>
              </div>
            </div>
            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Workflow Discipline', items: ['ITSM Standardization', 'Process Governance'], gradient: 'from-blue-600 to-blue-800' },
                { title: 'Platform Connect', items: ['Enterprise Integration', 'API Connectivity'], gradient: 'from-blue-400 to-blue-600' },
                { title: 'Automation Control', items: ['Workflow Automation', 'Security Operations'], gradient: 'from-blue-900 to-slate-900' },
                { title: 'Managed Evolution', items: ['Continuous Optimization', 'Adoption Management'], gradient: 'from-cyan-500 to-cyan-700' }
              ].map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden">
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
              { num: 1, title: 'Workflow Discipline', text: 'We structure ServiceNow around real operating models, governance needs, and workflow maturity.' },
              { num: 2, title: 'Platform Connectedness', text: 'We integrate ServiceNow into broader enterprise systems instead of allowing new operational silos.' },
              { num: 3, title: 'Automation with Control', text: 'We use workflow automation to reduce manual friction while preserving governance and visibility.' },
              { num: 4, title: 'Enterprise-Grade Extensibility', text: 'We help extend the platform through App Engine, APIs, and custom workflow design where needed.' },
              { num: 5, title: 'Flexible Delivery Models', text: 'We support advisory, implementation, integration, and managed evolution through fit-for-purpose engagement structures.' },
              { num: 6, title: 'Long-Term Value Realization', text: 'We optimize for sustained business impact, not just module deployment.' }
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
// 5. DELIVERY MODEL — 4-Phase Timeline with GSAP Path Animation
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowDeliveryModel = () => {
  const journeyRef = useRef(null);
  
  useEffect(() => {
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
      });
      const pathEl = journeyRef.current.querySelector('.sn-journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.sn-journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.sn-journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  const phases = [
    { phase: 'ASSESS', icon: <Search className="w-7 h-7" />, title: 'Assess & Scope', desc: 'Evaluate workflows, service maturity, pain points, governance gaps, and platform opportunity areas.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400' },
    { phase: 'DESIGN', icon: <Layers className="w-7 h-7" />, title: 'Design & Architect', desc: 'Define roadmap, module priorities, workflow architecture, integration needs, and delivery approach.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', kangqore: true },
    { phase: 'IMPLEMENT', icon: <Server className="w-7 h-7" />, title: 'Build & Launch', desc: 'Configure, extend, integrate, automate, and launch ServiceNow capabilities across the enterprise.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', kangqore: true },
    { phase: 'OPERATE', icon: <Activity className="w-7 h-7" />, title: 'Operate & Evolve', desc: 'Support adoption, optimize workflows, manage improvements, and expand platform value over time.', gradient: 'from-blue-600 to-cyan-600', ring: 'border-cyan-400', kangqore: true }
  ];

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .sn-journey-curve-glow { filter: blur(3px); }
          @keyframes sn-glow-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .sn-journey-curve-glow { animation: sn-glow-pulse 3s ease-in-out infinite; }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[55%] relative">
             <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                 <defs>
                  <linearGradient id="sn-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="33%" stopColor="#3b82f6" />
                    <stop offset="66%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="sn-journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="sn-journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sn-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#sn-journey-glow-v)" opacity="0.3" />
                <path className="sn-journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sn-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="sn-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#sn-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#sn-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#sn-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-sn-${i}`} className="sn-journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="sn-journey-card group">
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
                        {item.kangqore && <div className="px-2 py-0.5 bg-brand-blue/10 rounded-full text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase shrink-0">Kangqore</div>}
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
                 Our ServiceNow <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Delivery Model.</span>
               </h2>
               <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                 At Kangqore, ServiceNow transformation is structured as a disciplined workflow and platform model—designed to improve standardization, accelerate automation, and increase the value realized from service operations.
               </p>
               <div className="grid grid-cols-3 gap-6 pt-8">
                  <div><div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div><div className="text-2xl font-bold text-gray-900 dark:text-white">04</div></div>
                  <div><div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Cycle</div><div className="text-2xl font-bold text-gray-900 dark:text-white">Agile</div></div>
                  <div><div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Control</div><div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">MAX</div></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. EXECUTION ECOSYSTEM — Orbit Tech Ecosystem
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowExecutionEcosystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Orbit rotation
      gsap.to('.sn-orbit-ring-1', { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.sn-orbit-ring-2', { rotation: -360, duration: 55, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.sn-orbit-ring-3', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      // Counter-rotate nodes
      gsap.to('.sn-orbit-node-1', { rotation: -360, duration: 40, ease: 'none', repeat: -1 });
      gsap.to('.sn-orbit-node-2', { rotation: 360, duration: 55, ease: 'none', repeat: -1 });
      gsap.to('.sn-orbit-node-3', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });
      // Entry animations
      gsap.fromTo('.sn-eco-enter', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-24 pb-32 lg:pt-36 lg:pb-48 bg-[#fefffc] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sn-orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .sn-orbit-path {
          animation: sn-orbit-glow-pulse 4s ease-in-out infinite;
        }
      `}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="sn-eco-enter">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <Layers className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Platform Ecosystem</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              The ServiceNow<br />Ecosystem{' '}
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Tech.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Modern ServiceNow isn't just a ticketing system. It's a connected platform environment of IT workflows, security operations, enterprise services, and extensible integrations. We engineer across the entire stack to create seamless enterprise solutions.
            </p>
          </div>
          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            {/* Central Hub */}
            <div className="sn-eco-enter absolute w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-brand-blue via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl z-20">
              <div className="relative">
                <Settings className="w-14 h-14 lg:w-16 lg:h-16 text-white drop-shadow" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Orbit 1 (Inner) */}
            <div className="sn-eco-enter sn-orbit-ring-1 absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-full sn-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.1)' }}>
                <div className="sn-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[11px] shadow-lg" style={{ top: '0%', left: '50%' }}>ITSM</div>
                <div className="sn-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[11px] shadow-lg" style={{ top: '100%', left: '50%' }}>ITOM</div>
            </div>

            {/* Orbit 2 (Middle) */}
            <div className="sn-eco-enter sn-orbit-ring-2 absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full sn-orbit-path" style={{ border: '1px dashed rgba(37, 100, 234, 0.2)' }}>
                <div className="sn-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-blue text-white font-bold text-xs shadow-xl text-center leading-tight hover:scale-110 transition-transform" style={{ top: '14.65%', left: '85.35%' }}>Sec<br/>Ops</div>
                <div className="sn-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 h-10 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white font-black text-xs shadow-lg whitespace-nowrap hover:scale-110 transition-transform" style={{ top: '85.35%', left: '14.65%' }}>GRC</div>
            </div>

            {/* Orbit 3 (Outer) */}
            <div className="sn-eco-enter sn-orbit-ring-3 absolute w-[440px] h-[440px] lg:w-[520px] lg:h-[520px] rounded-full sn-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.08)' }}>
                <div className="sn-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform text-center leading-tight" style={{ top: '6.7%', left: '75%' }}>App<br/>Engine</div>
                <div className="sn-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 lg:px-5 h-10 lg:h-12 rounded-2xl bg-slate-800 text-white font-bold text-xs shadow-lg min-w-max hover:scale-110 transition-transform" style={{ top: '93.3%', left: '75%' }}>REST API</div>
                <div className="sn-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue font-bold text-[11px] shadow-sm hover:scale-110 transition-transform" style={{ top: '50%', left: '0%' }}>ITAM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FUTURE-READY / ENGAGEMENT MODELS — Accordion Section
// ═══════════════════════════════════════════════════════════════════════════════
export const ServicenowFutureReadySection = () => {
    const [openIdx, setOpenIdx] = useState(0);
    const items = [
        { title: 'Fixed One-Time Services', desc: 'Ideal for focused implementation, migration, or configuration projects with a clearly defined scope, timeline, and deliverable set.' },
        { title: 'Fixed Monthly Services', desc: 'Structured monthly engagement for ongoing optimization, feature evolution, and platform health management with predictable cost models.' },
        { title: 'Staff Augmentation', desc: 'Embed certified ServiceNow specialists directly into your enterprise teams to accelerate delivery velocity and fill capability gaps.' },
        { title: 'Core Flex', desc: 'A hybrid engagement model that combines a dedicated core team with the flexibility to scale resources up or down based on project demand and roadmap priorities.' }
    ];

    return (
        <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                            <Rocket className="w-4 h-4 text-brand-blue" />
                            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Engagement Models</span>
                        </div>
                        <h2 className="text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                            Flexible Engagement{' '}<br />
                            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Models.</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
                            We offer structured commercial delivery options designed to match the maturity, scale, and velocity of your ServiceNow transformation journey.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className={`rounded-[2rem] transition-all duration-500 overflow-hidden ${openIdx === i ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl shadow-brand-blue/5' : 'bg-white dark:bg-gray-900 dark:border-gray-800/50 hover:bg-white dark:bg-gray-900 dark:border-gray-800'}`}>
                                <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between p-8 text-left">
                                    <span className={`text-xl font-bold transition-colors ${openIdx === i ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{item.title}</span>
                                    <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openIdx === i ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                                </button>
                                {openIdx === i && (
                                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-lg">{item.desc}</p>
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
