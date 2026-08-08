import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, Briefcase, ChevronDown, Palette, Rocket, BrainCircuit, CheckCircle2, Code2, Bot } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GatewayLoadBalancerDiagram, GatewayFacadeDiagram, SecurityFlowDiagram, ArchitectureLayersDiagram } from '../../../pages/services/digital-engineering/components/APIArchitectureDiagrams';

gsap.registerPlugin(ScrollTrigger);

export const TrustStrip = () => (
  <div className="bg-brand-blue py-6">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-white text-lg md:text-xl font-medium tracking-wide">
        Helping enterprises engineer API and microservices platforms with stronger security, service discoverability, observability, and scale-ready control.
      </p>
    </div>
  </div>
);

// Removed WhyAPISection as it is now merged into APIPreMatrixSection for editorial flow parity.


export const ValueWeDeliverSection = () => {
  const [openAccordion, setOpenAccordion] = React.useState(0);
  const values = [
    { title: 'Stronger architectural control in distributed environments', desc: 'Create a cleaner service ecosystem with the right gateway, routing, policy, and runtime patterns.' },
    { title: 'Security designed into service communication', desc: 'Protect APIs and backend services through centralized authentication, authorization, secure communication, and threat protection.' },
    { title: 'Better discoverability and runtime resilience', desc: 'Enable service registration, discovery, and routing strategies that support scaling without fragile service coupling.' },
    { title: 'Cleaner client-to-service interaction models', desc: 'Use gateway-led transformation and client-aware API exposure to reduce complexity across channels and consumers.' },
    { title: 'Operational visibility across the service layer', desc: 'Improve health monitoring, traffic analysis, alerting, and policy control through stronger observability design.' },
    { title: 'Scale and availability without architectural drift', desc: 'Support load balancing, failover, runtime governance, and high-availability patterns for growth-ready service platforms.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
              <Activity className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Value Delivered</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Value We Deliver with{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">API & Microservices.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps organizations transform fragmented service landscapes into secure, scalable, and manageable digital platforms.
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
// Philosophy Hub Background — Subtle Animated Circuitry / Mesh
// ═══════════════════════════════════════════════════════════════════════════════
export const APIPhilosophyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate circuit lines drawing and pulsing
      gsap.fromTo('.philosophy-path', 
        { strokeDashoffset: 1000, opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.2, duration: 3, stagger: 0.2, ease: 'power1.inOut' }
      );
      
      // Infinite subtle pulse for points
      gsap.to('.philosophy-point', {
        opacity: 0.4,
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
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Dynamic Circuit Lines */}
        <g stroke="url(#circuit-grad)" strokeWidth="0.5" strokeDasharray="1000">
          <path className="philosophy-path" d="M0,100 L200,100 L250,150 L600,150 L650,100 L1200,100" />
          <path className="philosophy-path" d="M0,400 L300,400 L350,350 L800,350 L850,400 L1200,400" />
          <path className="philosophy-path" d="M200,0 L200,200 L150,250 L150,600 L200,650 L200,800" />
          <path className="philosophy-path" d="M1000,0 L1000,300 L1050,350 L1050,700 L1000,750 L1000,800" />
          <path className="philosophy-path" d="M400,800 L400,600 L450,550 L900,550 L950,600 L950,800" />
        </g>

        {/* Junction Points */}
        <g fill="url(#circuit-grad)">
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
// Business-Ready Section — Premium SVG + GSAP animated microservices graphic
// ═══════════════════════════════════════════════════════════════════════════════
export const BusinessReadySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });

      // Left content
      tl.fromTo('.br-heading', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
      tl.fromTo('.br-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
      tl.fromTo('.br-stat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' }, 0.5);

      // SVG elements
      tl.fromTo('.br-hub', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', transformOrigin: 'center center' }, 0.3);
      tl.fromTo('.br-node', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', transformOrigin: 'center center' }, 0.6);
      tl.fromTo('.br-link', { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: 'power1.out' }, 0.7);
      tl.fromTo('.br-label', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, 1.0);

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Service nodes positioned around a central hub
  const nodes = [
    { x: 280, y: 80,  label: 'API Gateway',        sub: 'Routing & Policy' },
    { x: 480, y: 80,  label: 'Auth Service',        sub: 'OAuth · JWT' },
    { x: 130, y: 220, label: 'Service Registry',    sub: 'Discovery' },
    { x: 560, y: 220, label: 'Load Balancer',       sub: 'Scale-Out' },
    { x: 130, y: 380, label: 'Config Server',       sub: 'Central Config' },
    { x: 560, y: 380, label: 'Message Broker',      sub: 'Async Events' },
    { x: 280, y: 480, label: 'Monitoring',          sub: 'Observability' },
    { x: 480, y: 480, label: 'Circuit Breaker',     sub: 'Fault Tolerance' },
  ];

  const hubX = 370, hubY = 280;

  const stats = [
    { val: '99.9%', label: 'Uptime SLA' },
    { val: '<45ms', label: 'Avg Latency' },
    { val: '100%',  label: 'Governance' },
  ];

  return (
    <section ref={sectionRef} className="py-28 lg:py-36 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            <div className="br-heading" style={{ opacity: 0 }}>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
                Business-Ready Service Ecosystems{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">built for governed scale.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            </div>
            <p className="br-desc text-xl text-gray-500 font-light leading-relaxed mb-12" style={{ opacity: 0 }}>
              Microservices can increase speed, modularity, and release flexibility — but only when the surrounding architecture is designed with intent. Without clear gateway strategy, service discovery, security controls, and governance, distributed systems become liabilities.
            </p>

            {/* Stat counters */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="br-stat text-center p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/70 rounded-2xl border border-gray-100" style={{ opacity: 0 }}>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-brand-gradient font-mono mb-1">{s.val}</div>
                  <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated SVG Microservices Graph */}
          <div className="relative">
            <svg viewBox="0 0 700 560" className="w-full h-auto" fill="none" style={{ minWidth: 350 }}>
              <defs>
                <linearGradient id="br-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" />
                  <stop offset="100%" stopColor="#4ab6d4" />
                </linearGradient>
                <linearGradient id="br-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <filter id="br-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="br-shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#2564ea" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Subtle background grid - increased opacity per CEO feedback */}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(i => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="700" y2={i * 40} stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
              ))}
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="560" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.6" />
              ))}

              {/* Connection lines from hub to nodes */}
              {nodes.map((n, i) => (
                <path
                  key={i}
                  className="br-link"
                  d={`M ${hubX} ${hubY} L ${n.x} ${n.y}`}
                  stroke="url(#br-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                  opacity="0.5"
                  filter="url(#br-glow)"
                />
              ))}

              {/* Central Hub */}
              <g className="br-hub" opacity="0">
                {/* Outer pulsing ring */}
                <circle cx={hubX} cy={hubY} r="65" stroke="url(#br-grad)" strokeWidth="1" fill="none" opacity="0.3">
                  <animate attributeName="r" values="65;75;65" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.08;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Second pulsing ring */}
                <circle cx={hubX} cy={hubY} r="55" stroke="url(#br-grad)" strokeWidth="0.5" fill="none" opacity="0.2">
                  <animate attributeName="r" values="55;63;55" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                  <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                {/* Main hub circle */}
                <circle cx={hubX} cy={hubY} r="48" fill="url(#br-grad)" filter="url(#br-shadow)" />
                {/* Hub icon — hexagonal pattern */}
                <path d={`M ${hubX} ${hubY - 18} L ${hubX + 16} ${hubY - 9} L ${hubX + 16} ${hubY + 9} L ${hubX} ${hubY + 18} L ${hubX - 16} ${hubY + 9} L ${hubX - 16} ${hubY - 9} Z`} stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.9" />
                <circle cx={hubX} cy={hubY} r="4" fill="#fff" opacity="0.9" />
                <text x={hubX} y={hubY + 38} fill="#0f172a" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">CORE PLATFORM</text>
              </g>

              {/* Service Nodes */}
              {nodes.map((n, i) => (
                <g key={i} className="br-node" opacity="0">
                  {/* Node background */}
                  <rect x={n.x - 60} y={n.y - 24} width="120" height="48" rx="12" fill="#0f172a" filter="url(#br-shadow)" />
                  {/* Gradient left accent */}
                  <rect x={n.x - 60} y={n.y - 24} width="4" height="48" rx="2" fill="url(#br-grad)" />
                  {/* Label - increased font size per CEO feedback */}
                  <text className="br-label" x={n.x + 4} y={n.y - 4} fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif" opacity="0">{n.label}</text>
                  <text className="br-label" x={n.x + 4} y={n.y + 14} fill="#4ab6d4" fontSize="11" fontWeight="500" textAnchor="middle" fontFamily="Inter, sans-serif" opacity="0">{n.sub}</text>
                  {/* Connection dot */}
                  <circle cx={n.x > hubX ? n.x - 60 : n.x + 60} cy={n.y} r="4" fill="url(#br-grad)" opacity="0.7">
                    <animate attributeName="r" values="3;5;3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ))}

              {/* Animated data flow particles */}
              {nodes.map((n, i) => (
                <circle key={`p${i}`} r="3" fill="#4ab6d4" opacity="0">
                  <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                    <mpath xlinkHref={`#br-path-${i}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                </circle>
              ))}

              {/* Motion paths for particles (hidden) */}
              {nodes.map((n, i) => (
                <path key={`mp${i}`} id={`br-path-${i}`} d={`M ${hubX} ${hubY} L ${n.x} ${n.y}`} fill="none" stroke="none" />
              ))}

              {/* Orbiting particle around hub */}
              <circle r="5" fill="url(#br-grad)" opacity="0.6">
                <animateMotion dur="8s" repeatCount="indefinite">
                  <mpath xlinkHref="#br-orbit" />
                </animateMotion>
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="8s" repeatCount="indefinite" />
              </circle>
              <path id="br-orbit" d={`M ${hubX + 70} ${hubY} A 70 70 0 1 1 ${hubX + 69.9} ${hubY}`} fill="none" stroke="none" />

            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export const APIPreMatrixSection = () => {
  return (
    <>
      <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative group">
              <div className="relative rounded-[3rem] overflow-hidden aspect-square border-4 border-gray-50 shadow-2xl">
                <img src="https://images.pexels.com/photos/6016344/pexels-photo-6016344.jpeg?auto=format&fit=crop&w=1260&q=80" alt="Service Engineering" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
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
                  Distributed systems are not just about connectivity. They are about <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">governed coordination</span> at the edge of complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BusinessReadySection />

    </>
  );
};

export const ArchitecturePrinciples = () => {
  return (
    <section className="py-24 bg-white dark:bg-black relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight mb-6">
            What Great API & Microservices Platforms Get Right
          </h2>
          <div className="w-24 h-1 bg-brand-blue/20 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            {[
              { title: 'Single Entry, Clear Control', text: 'Use the gateway to centralize access, runtime policy, and traffic handling without overloading it with business logic.', num: '01' },
              { title: 'Security by Design', text: 'Treat authentication, authorization, encrypted communication, and threat protection as foundational architecture concerns.', num: '02' },
              { title: 'Discovery Without Fragility', text: 'Engineer service registration and discovery patterns that support dynamic scaling and operational trust.', num: '03' }
            ].map((d) => (
              <div key={d.num} className="diff-item group flex items-start gap-6 p-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:bg-brand-blue transition-colors">{d.num}</div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">{d.title}</h4>
                  <p className="text-gray-500 leading-relaxed">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-8 rounded-[3rem] border border-gray-100">
             <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center tracking-wide uppercase">Security & Auth Flow</h4>
             <SecurityFlowDiagram />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <div className="flex flex-col justify-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-8 rounded-[3rem] border border-gray-100 order-2 lg:order-1">
             <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center tracking-wide uppercase">Gateway Load Balancing & Scale</h4>
             <GatewayLoadBalancerDiagram />
           </div>
           <div className="space-y-6 order-1 lg:order-2">
            {[
              { title: 'Transformation Without Chaos', text: 'Handle protocol and payload differences cleanly so clients and services can evolve without unnecessary coupling.', num: '04' },
              { title: 'Visibility Across the Edge', text: 'Monitor health, traffic, policy breaches, and performance signals where service interactions actually happen.', num: '05' },
              { title: 'Governance That Scales', text: 'As APIs grow, standards, versioning, throttling, and lifecycle control become platform necessities—not optional cleanup work.', num: '06' }
            ].map((d) => (
              <div key={d.num} className="diff-item group flex items-start gap-6 p-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:bg-brand-blue transition-colors">{d.num}</div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">{d.title}</h4>
                  <p className="text-gray-500 leading-relaxed">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const DeliveryModelTimelline = () => {
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
    { phase: 'DEFINE', icon: <Search className="w-7 h-7" />, title: 'Assess & Scope', desc: 'Assess business domains, service boundaries, integration needs, and platform constraints.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400' },
    { phase: 'ARCHITECT', icon: <Layers className="w-7 h-7" />, title: 'Design Foundations', desc: 'Design gateway strategy, security model, discovery patterns, transformation approach, and observability foundations.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', kangqore: true },
    { phase: 'ENGINEER', icon: <Server className="w-7 h-7" />, title: 'Build & Deploy', desc: 'Implement services, APIs, policies, deployment flows, and operational controls.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', kangqore: true },
    { phase: 'OPERATE', icon: <Activity className="w-7 h-7" />, title: 'Evolve & Scale', desc: 'Improve scale, governance, resilience, and service maturity through runtime learning and platform refinement.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', kangqore: true }
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
          <div className="w-full lg:w-[55%] relative">
             <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                 <defs>
                  <linearGradient id="api-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="33%" stopColor="#3b82f6" />
                    <stop offset="66%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="api-journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#api-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#api-journey-glow-v)" opacity="0.3" />
                <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#api-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#api-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#api-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#api-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-api-${i}`} className="journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
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
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
             <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                  <Network className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Delivery Model</span>
                </div>
               <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                 Our API & <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Delivery Model.</span>
               </h2>
               <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                 At Kangqore, API and microservices engineering is structured as a disciplined architecture and platform model—designed to reduce distributed complexity, strengthen runtime control, and support resilient scale.
               </p>
               <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
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

export const APIDiamondCoESection = () => {
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
    <section className="py-24 lg:py-28 overflow-hidden relative bg-white dark:bg-black dark:border-gray-800 z-[10] border-t border-gray-100">
       <style dangerouslySetInnerHTML={{__html: `
        @keyframes api-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes api-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes api-dot-ping {
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
                Our <strong className="text-brand-blue">API Engineering CoE</strong> provides a high-velocity strategic blueprint, surrounding your service initiative with four critical layers of engineering validation.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace "endpoint-sprawl" with "architect-and-govern." By unifying gateway strategy, boundary design, distributed security, and lifecycle governance, we ensure your service platform is built on absolute engineering confidence.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="api-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#api-blue-grad)" style={{ animation: 'api-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#api-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'api-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#api-blue-grad)" style={{ animation: 'api-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#api-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'api-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#api-blue-grad)" style={{ animation: 'api-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#api-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'api-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#api-blue-grad)" style={{ animation: 'api-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#api-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'api-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'api-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Gateway<br/>Strategy</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Boundary<br/>Design</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Distributed<br/>Security</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Runtime<br/>Governance</div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Policy Enforcement •</li><li>Threat Protection •</li><li>Throttling Strategy •</li><li>Caching Models •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Domain Modeling</li><li>• Service Isolation</li><li>• Data Sovereignty</li><li>• Async Event Patterns</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Zero Trust Mesh •</li><li>mTLS Encryption •</li><li>JWT Validation •</li><li>Identity Federation •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Schema Registry</li><li>• Version Control</li><li>• Health Visibility</li><li>• Distributed Tracing</li></ul></div>
              </div>
            </div>
            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Gateway Strategy', items: ['Policy Enforcement', 'Threat Protection'], gradient: 'from-blue-600 to-blue-800' },
                { title: 'Boundary Design', items: ['Domain Modeling', 'Service Isolation'], gradient: 'from-blue-400 to-blue-600' },
                { title: 'Distributed Security', items: ['Zero Trust Mesh', 'mTLS Encryption'], gradient: 'from-blue-900 to-slate-900' },
                { title: 'Runtime Governance', items: ['Health Visibility', 'Version Control'], gradient: 'from-cyan-500 to-cyan-700' }
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
              { num: 1, title: 'Architected Entry Points', text: 'We design the gateway as a critical control point, consolidating routing, identity, and traffic management.' },
              { num: 2, title: 'Loosely Coupled Service Models', text: 'We help organizations define service boundaries that preserve domain independence and agility.' },
              { num: 3, title: 'Hardened Communication', text: 'Identity-first security ensures that every internal and external interaction is authenticated and encrypted.' },
              { num: 4, title: 'Operational Observability', text: 'Unified telemetry and tracing ensure that distributed failures are detected and resolved with precision.' },
              { num: 5, title: 'Lifecycle Accountability', text: 'From boundary definition through runtime governance, we own the service lifecycle end to end.' }
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

export const APIFutureReadySection = () => {
  const [openAccordion, setOpenAccordion] = React.useState(0);
  const items = [
    { title: 'Serverless & Functions', desc: 'Implementing event-driven, serverless architectures that reduce infrastructure overhead and scale instantly based on API demand.' },
    { title: 'Edge Computing & Gateways', desc: 'Moving gateway logic and data processing closer to the user to reduce latency, improve response times, and handle scale with better locality.' },
    { title: 'AI-Native API Gateways', desc: 'Integrating machine learning into the gateway layer for autonomous threat detection, intelligent routing, and predictive scaling.' },
    { title: 'Decentralized Identity', desc: 'Adopting next-generation identity standards to secure services without relying on centralized bottlenecks, improving privacy and interoperability.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-black dark:border-gray-800 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
              <Cloud className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Future-Ready</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Future-Ready{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              Kangqore helps organizations stay ahead of distributed complexity by integrating emerging protocols, security standards, and compute models into the core service architecture.
            </p>
          </div>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                <button onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} className="w-full flex items-center justify-between p-6 text-left">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                {openAccordion === idx && (
                  <div className="px-6 pb-6 animate-in fade-in duration-300"><p className="text-gray-500 font-light leading-relaxed">{item.desc}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const APIExecutionEcosystem = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('.expertise-link');
      gsap.fromTo(items,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 overflow-hidden relative border-t border-gray-100" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related Engineering{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl font-light">
              Extend your API & Microservices initiative into a full-scale digital ecosystem. Kangqore provides the end-to-end engineering muscle to build, modernize, and scale.
            </p>
            <div className="space-y-4">
               {[
                 { name: 'Software Development', link: '/services/digital-engineering/software-development', icon: <Briefcase className="w-5 h-5" />, desc: 'Custom engineering, platform builds, and full-cycle software execution.' },
                 { name: 'MVP Acceleration', link: '/services/digital-engineering/mvp-acceleration', icon: <Rocket className="w-5 h-5" />, desc: 'Rapid-velocity product builds and scale-ready launch models.' },
                 { name: 'Product Strategy & Experience Design', link: '/services/digital-engineering/product-strategy-experience-design', icon: <Layers className="w-5 h-5" />, desc: 'Strategic product planning, UX research, and premium design systems.' }
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
          <div className="lg:w-1/2 relative">
             <div className="relative aspect-square w-full max-w-[550px] mx-auto">
                <div className="absolute top-0 left-0 p-3 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                   <div className="flex justify-between gap-4"><span>build_id:</span> <span className="text-brand-blue">#KG_API_V2</span></div>
                   <div className="flex justify-between gap-4"><span>pipeline:</span> <span className="text-emerald-500">OPTIMIZED</span></div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-20 group">
                    <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                    <div className="relative"><Network className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" /></div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10"><CheckCircle2 className="w-5 h-5" /></div>
                 </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center group">
                    <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center mb-2 hover:-translate-y-2 transition-all"><Rocket className="w-12 h-12 text-brand-blue"/></div>
                    <span className="text-[11px] font-mono font-bold text-gray-400">MVP_ACCEL</span>
                 </div>
                 <div className="absolute bottom-10 left-0 text-center group">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center mb-2 translate-x-4 hover:translate-x-0 transition-all"><Code2 className="w-12 h-12 text-cyan-400"/></div>
                    <span className="text-[11px] font-mono font-bold text-gray-400 translate-x-4 block">SW_DEV</span>
                 </div>
                 <div className="absolute bottom-10 right-0 text-center group">
                    <div className="w-24 h-24 bg-brand-gradient rounded-3xl shadow-2xl flex items-center justify-center mb-2 -translate-x-4 hover:-translate-x-0 transition-all"><Bot className="w-12 h-12 text-white"/></div>
                    <span className="text-[11px] font-mono font-bold text-gray-400 -translate-x-4 block">AGENTIC_AI</span>
                 </div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <defs>
                    <linearGradient id="exec-flow-grad-api" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path d="M250,250 L250,100" stroke="url(#exec-flow-grad-api)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  <path d="M250,250 L100,380" stroke="url(#exec-flow-grad-api)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  <path d="M250,250 L400,380" stroke="url(#exec-flow-grad-api)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  
                  <circle r="3" fill="#0066FF">
                    <animateMotion path="M250,250 L250,100" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#00D2FF">
                    <animateMotion path="M250,250 L100,380" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#6366f1">
                    <animateMotion path="M250,250 L400,380" dur="3s" repeatCount="indefinite" />
                  </circle>
                </svg>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Architecture Diagrams Showcase — standalone full-width rows, no cards
// ═══════════════════════════════════════════════════════════════════════════════
export const APIArchitectureShowcase = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.arch-row'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
        }
      );
    }
  }, []);

  const diagrams = [
    {
      title: 'API Gateway Facade',
      desc: 'Clients access microservices through a unified gateway that centralizes routing, security, transformation, and monitoring in a single governed entry point.',
      Component: GatewayFacadeDiagram,
    },
    {
      title: 'Microservices Architecture',
      desc: 'Delivery channels connect to a platform layer comprising the API Gateway, Security, Monitoring, Service Router, and Service Registry — orchestrating traffic across independent microservice clusters.',
      Component: ArchitectureLayersDiagram,
    },
    {
      title: 'Gateway Load Balancing & Scale',
      desc: 'A load balancer distributes client traffic across multiple API Gateway instances deployed on physical and virtual machines, ensuring high availability and horizontal scale.',
      Component: GatewayLoadBalancerDiagram,
    },
    {
      title: 'Security & Authorization Flow',
      desc: 'OAuth 2.0 and JWT-based authorization flow between the public internet and private subnet, with token exchange, TLS termination, and per-service access control.',
      Component: SecurityFlowDiagram,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16">

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
            How It All{' '}<br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Comes Together.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
            Explore the engineering blueprints that power our API and microservices platforms — from gateway design to security flows, load balancing to cluster orchestration.
          </p>
        </div>

        <div className="space-y-20">
          {diagrams.map((d, idx) => (
            <div key={idx} className="arch-row" style={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{d.title}</h3>
                  <p className="text-sm text-gray-500 font-light mt-1 max-w-xl">{d.desc}</p>
                </div>
              </div>
              <d.Component />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
