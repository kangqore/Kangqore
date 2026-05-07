import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, Briefcase, ChevronDown, Palette, Rocket, BrainCircuit, CheckCircle2, Code2, Bot, Users, Headset, TrendingUp, Zap, Settings, Workflow, Shield, Eye, Cog, Link2, Share2, Binary, Cpu, Radio, Wifi, Signal, MonitorSmartphone, BarChart3, Factory, Heart, Building2, Globe2, Lightbulb, Gauge, CircuitBoard } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PHILOSOPHY BACKGROUND — Animated Sensor / Network Mesh
// ═══════════════════════════════════════════════════════════════════════════════
export const IoTPhilosophyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.iot-phi-path',
        { strokeDashoffset: 1000, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.15, duration: 4, stagger: 0.3, ease: 'power1.inOut' }
      );
      gsap.to('.iot-phi-node', {
        opacity: 0.4,
        scale: 1.4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.6, from: 'random' }
      });
      // Pulse effects for sensor nodes
      gsap.to('.iot-phi-sensor', {
        opacity: 0.6,
        scale: 1.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: 'edges' }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        {/* Network topology lines — hub-and-spoke IoT pattern */}
        <path className="iot-phi-path" d="M200,200 L400,150 L600,200 L800,150 L1000,200" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="iot-phi-path" d="M100,400 L300,350 L500,400 L700,350 L900,400 L1100,350" stroke="#4ab6d4" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="iot-phi-path" d="M150,600 L350,550 L550,600 L750,550 L950,600" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />

        {/* Radial spokes from sensor hubs */}
        <path className="iot-phi-path" d="M400,150 L400,350 L500,400" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="1000" />
        <path className="iot-phi-path" d="M800,150 L800,350 L700,350" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="1000" />
        <path className="iot-phi-path" d="M550,600 L550,400 L500,400" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="1000" />

        {/* Hub nodes */}
        {[200, 400, 600, 800, 1000].map(x => (
          <circle key={`n1-${x}`} className="iot-phi-node" cx={x} cy="200" r="3" fill="#2564ea" />
        ))}
        {[300, 500, 700, 900, 1100].map(x => (
          <circle key={`n2-${x}`} className="iot-phi-node" cx={x} cy="350" r="2.5" fill="#4ab6d4" />
        ))}

        {/* Sensor nodes — smaller, pulsing */}
        {[150, 350, 550, 750, 950].map(x => (
          <circle key={`s-${x}`} className="iot-phi-sensor" cx={x} cy="600" r="1.5" fill="#2564ea" />
        ))}
        {[250, 450, 650, 850].map(x => (
          <circle key={`s2-${x}`} className="iot-phi-sensor" cx={x} cy="500" r="1.5" fill="#4ab6d4" />
        ))}
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY IoT SECTION — Editorial Quote + Opportunity/Challenge
// ═══════════════════════════════════════════════════════════════════════════════
export const IoTWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.iot-why-item');
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
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1260&q=80" alt="IoT Connected Devices" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
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
                  Connected devices create data. <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">Engineered IoT systems create business value.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why IoT Section */}
      <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden" ref={sectionRef}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="iot-why-item">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                <Lightbulb className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">The Opportunity</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                From Connectivity{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">to Intelligence.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                From industries and enterprises to connected living environments, IoT has already moved beyond experimentation. But connectivity alone is not the outcome. Real value comes from selecting the right sensors, platform, architecture, analytics, and integration model — then operationalizing the system with control and scale.
              </p>
            </div>
            <div className="space-y-8 iot-why-item">
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Potential</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Connect and scale faster, act on real-time data, transform business processes, and improve decisions with intelligence across every connected environment.
                </p>
              </div>
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Challenge</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Without the right architecture, platform choice, integration strategy, and lifecycle management, IoT programs stay fragmented and fail to deliver sustained value.
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
export const IoTValueDeliver = () => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const values = [
    { title: 'Faster connection between assets and operations', desc: 'Create connected environments where devices, assets, and workflows operate as one coordinated system rather than isolated data sources.' },
    { title: 'Better decisions from live connected data', desc: 'Use telemetry, analytics, and intelligent processing to turn raw IoT signals into actionable business insight.' },
    { title: 'Stronger process transformation through connected systems', desc: 'Apply IoT to improve process flows, operational responsiveness, and automation across industrial and enterprise environments.' },
    { title: 'More scalable platform and application foundations', desc: 'Build reliable IoT platforms, applications, and device ecosystems that are secure, adaptable, and ready for enterprise growth.' },
    { title: 'Lower friction across enterprise architecture', desc: 'Integrate IoT cleanly with ERP, CRM, gateways, and other enterprise systems so connected systems create actual operational value.' },
    { title: 'Operational confidence after go-live', desc: 'Support the full lifecycle through testing, monitoring, onboarding, managed support, and ongoing platform evolution.' }
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
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">IoT Engineering.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps enterprises move IoT from isolated experiments to production-ready connected ecosystems that deliver measurable business outcomes.
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
export const IoTDiamondCoESection = () => {
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
        @keyframes iot-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes iot-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes iot-dot-ping {
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
                Our <strong className="text-brand-blue">IoT CoE</strong> defines the right platform, architecture, and integration decisions before implementation complexity compounds.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                By unifying device engineering, platform strategy, analytics, and enterprise integration, we ensure your connected ecosystems are production-ready and business-aligned.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="iot-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#iot-blue-grad)" style={{ animation: 'iot-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#iot-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'iot-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#iot-blue-grad)" style={{ animation: 'iot-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#iot-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'iot-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#iot-blue-grad)" style={{ animation: 'iot-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#iot-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'iot-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#iot-blue-grad)" style={{ animation: 'iot-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#iot-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'iot-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'iot-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-teal-500 to-emerald-700" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Connected<br/>Foundations</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-indigo-400 to-indigo-600" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Scalable<br/>Platforms</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-slate-700 to-slate-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Usable<br/>Intelligence</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-sky-400 to-teal-600" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Enterprise<br/>Integration</div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Device Strategy •</li><li>Sensor Selection •</li><li>Connection Models •</li><li>Protocol Standards •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Multi-Tenant Architecture</li><li>• Cloud IoT Platforms</li><li>• Edge Processing</li><li>• OTA Updates</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Telemetry Analytics •</li><li>Predictive Insights •</li><li>Business Intelligence •</li><li>Visualization •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• ERP Integration</li><li>• CRM Connectivity</li><li>• Gateway Partners</li><li>• Lifecycle Sync</li></ul></div>
              </div>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Connected Foundations', items: ['Device Strategy', 'Connection Models'], gradient: 'from-teal-500 to-emerald-700' },
                { title: 'Scalable Platforms', items: ['Multi-Tenant Architecture', 'Cloud IoT Platforms'], gradient: 'from-indigo-400 to-indigo-600' },
                { title: 'Usable Intelligence', items: ['Telemetry Analytics', 'Predictive Insights'], gradient: 'from-slate-700 to-slate-900' },
                { title: 'Enterprise Integration', items: ['ERP Integration', 'CRM Connectivity'], gradient: 'from-sky-400 to-teal-600' }
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
              { num: 1, title: 'Platform-Aware Architecture', text: 'We define the right IoT platform, cloud model, and device ecosystem before implementation complexity compounds.' },
              { num: 2, title: 'Full-Stack Device-to-Cloud Delivery', text: 'From hardware enablement and firmware to cloud platforms and applications — we engineer the complete connected stack.' },
              { num: 3, title: 'Analytics-Native Engineering', text: 'Telemetry, advanced analytics, and actionable dashboards are designed into the platform from day one.' },
              { num: 4, title: 'Enterprise Integration by Default', text: 'We design for coexistence with ERP, CRM, gateways, and broader enterprise data architectures.' },
              { num: 5, title: 'Industry-Ready IoT Solutions', text: 'Our focus remains on applied business value across manufacturing, healthcare, logistics, and connected enterprises.' },
              { num: 6, title: 'Lifecycle Operations Discipline', text: 'Post-deployment onboarding, monitoring, managed support, and continuous evolution are built into every engagement.' }
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
// 5. DELIVERY MODEL — 3-Phase IoT Adoption Timeline (PoC → Productization → Operationalization)
// ═══════════════════════════════════════════════════════════════════════════════
export const IoTDeliveryModel = () => {
  const journeyRef = useRef(null);

  useEffect(() => {
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
      });
      const pathEl = journeyRef.current.querySelector('.iot-journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.iot-journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.25);
      });
      const cards = journeyRef.current.querySelectorAll('.iot-journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  const phases = [
    {
      phase: 'VALIDATE', icon: <Search className="w-7 h-7" />, title: 'Proof of Concept',
      desc: 'Validate connected use cases quickly through device connectivity, cloud-based prototyping, and early business-value demonstration.',
      coverage: ['Connect already deployed devices', 'Prototype quickly on cloud IoT foundations', 'Demonstrate probable business impact'],
      gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400'
    },
    {
      phase: 'BUILD', icon: <Layers className="w-7 h-7" />, title: 'Productization',
      desc: 'Turn validated ideas into scalable connected products by building devices, selecting the right IoT platform, integrating enterprise data, and creating usable applications.',
      coverage: ['Build next-generation connected devices', 'Select the right platform and partner ecosystem', 'Combine IoT data with enterprise systems', 'Deploy edge intelligence for on-device processing', 'Create business applications around connected workflows'],
      gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', kangqore: true
    },
    {
      phase: 'OPERATE', icon: <Activity className="w-7 h-7" />, title: 'Operationalization',
      desc: 'Move from solution launch into operational reality through user onboarding, device onboarding, operations-center readiness, and continuous monitoring.',
      coverage: ['Onboard groups, users, and devices', 'Establish operating and monitoring functions', 'Manage edge-to-cloud data pipelines continuously', 'Manage devices and business workflows continuously'],
      gradient: 'from-cyan-400 to-cyan-600', ring: 'border-cyan-400', kangqore: true
    }
  ];

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .iot-journey-curve-glow { filter: blur(3px); animation: iot-glow-pulse 3s ease-in-out infinite; }
          @keyframes iot-glow-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[55%] relative">
            <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 800" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="iot-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                  <filter id="iot-journey-glow-v"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <path d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 520, 8 560, 15 600 S 22 720, 15 800" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="iot-journey-curve-glow" d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 520, 8 560, 15 600 S 22 720, 15 800" stroke="url(#iot-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#iot-journey-glow-v)" opacity="0.3" />
                <path className="iot-journey-curve-path" d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 520, 8 560, 15 600 S 22 720, 15 800" stroke="url(#iot-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[133, 400, 667].map((cy, i) => (
                  <g key={i} className="iot-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#iot-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#iot-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#iot-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-iot-${i}`} className="iot-journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;800" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="iot-journey-card group">
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
                          {item.kangqore && <div className="px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-[7px] font-bold tracking-[0.15em] text-brand-blue uppercase shrink-0">Kangqore</div>}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors duration-300">{item.title}</h4>
                        <p className="text-gray-500 leading-relaxed font-light mb-4">{item.desc}</p>
                        <div className="space-y-2 pl-4 border-l-2 border-brand-blue/10">
                          {item.coverage.map((c, ci) => (
                            <div key={ci} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Adoption Model</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                Enabling IoT <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Adoption.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                At Kangqore, IoT adoption is structured as a phased engineering model — designed to validate quickly, productize reliably, and operationalize at scale.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div><div className="text-2xl font-bold text-gray-900 dark:text-white">03</div></div>
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
// 6. EXECUTION ECOSYSTEM — Orbit Tech Stack
// ═══════════════════════════════════════════════════════════════════════════════
export const IoTExecutionEcosystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.iot-orbit-ring-1', { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.iot-orbit-ring-2', { rotation: -360, duration: 55, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.iot-orbit-ring-3', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.iot-orbit-node-1', { rotation: -360, duration: 40, ease: 'none', repeat: -1 });
      gsap.to('.iot-orbit-node-2', { rotation: 360, duration: 55, ease: 'none', repeat: -1 });
      gsap.to('.iot-orbit-node-3', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });
      gsap.fromTo('.iot-eco-enter', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-24 pb-32 lg:pt-36 lg:pb-48 bg-[#fefffc] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes iot-orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .iot-orbit-path { animation: iot-orbit-glow-pulse 4s ease-in-out infinite; }
      `}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="iot-eco-enter">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <CircuitBoard className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Tech Ecosystem</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              The IoT<br />Ecosystem{' '}
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Stack.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Success in IoT depends on more than connected devices. It requires platforms, analytics, edge processing, and enterprise integration working together as a unified ecosystem.
            </p>
          </div>
          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            {/* Central Hub */}
            <div className="iot-eco-enter absolute w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-brand-blue via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl z-20">
              <div className="relative">
                <Wifi className="w-14 h-14 lg:w-16 lg:h-16 text-white drop-shadow" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Orbit 1 (Inner) - Platforms */}
            <div className="iot-eco-enter iot-orbit-ring-1 absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-full iot-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.1)' }}>
              <div className="iot-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[9px] shadow-lg text-center leading-tight" style={{ top: '0%', left: '50%' }}>Azure<br/>IoT</div>
              <div className="iot-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[9px] shadow-lg text-center leading-tight" style={{ top: '100%', left: '50%' }}>AWS<br/>IoT</div>
            </div>

            {/* Orbit 2 (Middle) - Core Technologies */}
            <div className="iot-eco-enter iot-orbit-ring-2 absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full iot-orbit-path" style={{ border: '1px dashed rgba(37, 100, 234, 0.2)' }}>
              <div className="iot-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-blue text-white font-bold text-[10px] shadow-xl text-center leading-tight hover:scale-110 transition-transform" style={{ top: '14.65%', left: '85.35%' }}>Thing<br/>Worx</div>
              <div className="iot-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 h-10 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white font-black text-xs shadow-lg whitespace-nowrap hover:scale-110 transition-transform" style={{ top: '85.35%', left: '14.65%' }}>MongoDB</div>
            </div>

            {/* Orbit 3 (Outer) - Edge / Analytics / Protocols */}
            <div className="iot-eco-enter iot-orbit-ring-3 absolute w-[440px] h-[440px] lg:w-[520px] lg:h-[520px] rounded-full iot-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.08)' }}>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform text-center leading-tight" style={{ top: '3%', left: '65%' }}>Edge<br/>AI</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 lg:px-5 h-10 lg:h-12 rounded-2xl bg-slate-800 text-white font-bold text-xs shadow-lg min-w-max hover:scale-110 transition-transform" style={{ top: '97%', left: '65%' }}>WindRiver</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue font-bold text-[10px] shadow-sm hover:scale-110 transition-transform" style={{ top: '50%', left: '0%' }}>Intel</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-3 h-9 lg:h-10 rounded-xl bg-emerald-600 text-white font-bold text-[9px] shadow-lg hover:scale-110 transition-transform" style={{ top: '15%', left: '25%' }}>MQTT</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-3 h-9 lg:h-10 rounded-xl bg-orange-500 text-white font-bold text-[9px] shadow-lg hover:scale-110 transition-transform" style={{ top: '85%', left: '25%' }}>Kafka</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 text-white font-bold text-[8px] shadow-lg hover:scale-110 transition-transform text-center leading-tight" style={{ top: '50%', left: '100%' }}>Influx<br/>DB</div>
              <div className="iot-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-3 h-9 lg:h-10 rounded-xl bg-amber-500 text-white font-bold text-[9px] shadow-lg hover:scale-110 transition-transform" style={{ top: '3%', left: '35%' }}>Grafana</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FUTURE-READY SECTION — What Strong IoT Platforms Get Right
// ═══════════════════════════════════════════════════════════════════════════════
export const IoTFutureReadySection = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const requirements = [
    { title: 'Connected Foundations', desc: 'Strong IoT systems begin with the right connection model across assets, devices, services, and operational touchpoints.' },
    { title: 'Scalable Platforms', desc: 'IoT platforms must stay secure, multi-tenant, reliable, and adaptable as usage grows and device fleets expand.' },
    { title: 'Usable Intelligence', desc: 'Raw telemetry matters only when it becomes insight that improves decisions, workflows, and measurable outcomes.' },
    { title: 'Enterprise Integration', desc: 'Connected systems must work with ERP, CRM, gateways, and broader enterprise architecture to create real value.' },
    { title: 'Operationalization Discipline', desc: 'IoT success depends on onboarding, monitoring, managed support, and lifecycle management — not just deployment.' },
    { title: 'Continuous Engineering', desc: 'Cloud modernization, IIoT enablement, edge processing, analytics, automation, and UX all shape long-term connected-system success.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <Rocket className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Platform Requirements</span>
            </div>
            <h2 className="text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              What Strong Platforms{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Get Right.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
              We help enterprises navigate implementation complexity across six critical areas to ensure IoT platforms succeed in production.
            </p>
          </div>
          <div className="space-y-4">
            {requirements.map((req, i) => (
              <div key={i} className={`rounded-[2rem] transition-all duration-500 overflow-hidden ${openIdx === i ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl shadow-brand-blue/5' : 'bg-white dark:bg-gray-900 dark:border-gray-800/50 hover:bg-white dark:bg-gray-900 dark:border-gray-800'}`}>
                <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between p-8 text-left">
                  <span className={`text-xl font-bold transition-colors ${openIdx === i ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{req.title}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openIdx === i ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                </button>
                {openIdx === i && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-lg">{req.desc}</p>
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




