import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, ShieldCheck, Search, Activity, ChevronDown, 
  Rocket, TrendingUp, Network, Binary, Server, Zap
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. EDITORIAL QUOTE SECTION — Full-width image + large pull-quote
// ═══════════════════════════════════════════════════════════════════════════════
export const EditorialQuoteSection = ({ 
  image = 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=format&fit=crop&w=1260&q=80',
  quote = 'Trust is easy to promise.',
  highlightText = 'Harder to engineer.',
  imageAlt = 'Service Visual'
}) => {
  return (
    <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative group">
            <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
              <img src={image} alt={imageAlt} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
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
                {quote} <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">{highlightText}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY THIS SERVICE SECTION — Opportunity + Challenge Cards
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyThisServiceSection = ({
  badgeText = 'The Opportunity',
  badgeIcon: BadgeIcon = Search,
  title = 'Moving Beyond',
  highlightWord = 'Experimentation.',
  intro = 'We approach this domain not as hype infrastructure, but as architecture, security, workflow, and product engineering combined into one delivery model.',
  foundation = { label: 'The Foundation', text: 'A system creates trusted records through decentralization, immutability, and algorithmic verification rather than depending entirely on a central authority.' },
  challenge = { label: 'The Challenge', text: 'Real implementation complexity appears in performance constraints, interoperability gaps, security exposure, and the need for a complete supporting ecosystem.' }
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.scs-why-item');
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="scs-why-item">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <BadgeIcon className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">{badgeText}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              {title}{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{highlightWord}</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed">{intro}</p>
          </div>
          <div className="space-y-8 scs-why-item">
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">{foundation.label}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{foundation.text}</p>
            </div>
            <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-blue" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">{challenge.label}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{challenge.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VALUE ACCORDION — Numbered expandable list with sticky sidebar
// ═══════════════════════════════════════════════════════════════════════════════
export const ValueAccordionSection = ({
  badgeText = 'Value Delivered',
  badgeIcon: BadgeIcon = Activity,
  title = 'Value We Deliver with',
  highlightWord = 'This Service.',
  intro = 'We help enterprises move from conceptual exploration into production-ready business platforms that are resilient and governable.',
  values = [
    { title: 'Trusted digital record foundations', desc: 'Build distributed, tamper-resistant systems of record that strengthen trust across transactions, workflows, and shared data environments.' },
    { title: 'Smarter platform decisions early', desc: 'Choose the right architecture, protocols, and platform components before complexity compounds across the build lifecycle.' },
    { title: 'Secure contract execution', desc: 'Reduce exposure across contracts, identities, APIs, nodes, and data flows through security-native design.' },
    { title: 'Better interoperability', desc: 'Connect platforms with enterprise systems, applications, and surrounding data layers without creating isolation.' },
    { title: 'Production-ready platforms', desc: 'Engineer reliable, scalable foundations across infrastructure, cloud, storage, monitoring, and operational assurance.' },
    { title: 'Real use cases, not pilots', desc: 'Turn technology into measurable value through applied solutions across industry verticals.' }
  ]
}) => {
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <BadgeIcon className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">{badgeText}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              {title}{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{highlightWord}</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">{intro}</p>
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
// 4. DIAMOND CoE SECTION — 3D Diamond + Numbered Differentiators
// ═══════════════════════════════════════════════════════════════════════════════
export const DiamondCoESection = ({
  coeParagraph1 = 'Our Center of Excellence defines the right protocol, infrastructure, and governance decisions before build complexity leads to fragility.',
  coeParagraph2 = 'By unifying trust architecture, security-native engineering, and full-stack application delivery, we ensure your platforms are production-ready.',
  coeHighlight = 'Center of Excellence',
  quadrants = [
    { title: 'Trust\nArchitecture', items: ['Protocol Strategy', 'Governance Design', 'Ecosystem Fit', 'Platform Choices'], gradient: 'from-blue-600 to-blue-800' },
    { title: 'Secure\nEngineering', items: ['Cryptographic Controls', 'Privacy Patterns', 'Identity Architecture', 'Contract Audits'], gradient: 'from-blue-400 to-blue-600' },
    { title: 'Platform\nDepth', items: ['Infrastructure Speed', 'Network Resilience', 'Observability Lab', 'Scalable Nodes'], gradient: 'from-blue-900 to-slate-900' },
    { title: 'Interoperable\nFocus', items: ['Legacy Connectivity', 'API Integration', 'Shared Data Layers', 'Cross-System Sync'], gradient: 'from-cyan-500 to-cyan-700' }
  ],
  differentiators = [
    { num: 1, title: 'Architecture-Led by Default', text: 'We define protocol, platform, and infrastructure decisions before build path risks compound.' },
    { num: 2, title: 'Security-Native Engineering', text: 'Identity, cryptography, and risk are core design concerns, not late-stage controls.' },
    { num: 3, title: 'Platform + Application Depth', text: 'From core infrastructure to applications and middleware, we engineer the full stack.' },
    { num: 4, title: 'Enterprise Interoperability', text: 'We design for coexistence with legacy systems, modern apps, APIs, and partner ecosystems.' },
    { num: 5, title: 'Industry-Ready Use Cases', text: 'Our focus remains on applied business value—not just technology novelty.' },
    { num: 6, title: 'Scalable Delivery Discipline', text: 'We apply structured design and observability so platforms can evolve with confidence.' }
  ]
}) => {
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
        @keyframes scs-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes scs-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes scs-dot-ping {
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
                Our <strong className="text-brand-blue">{coeHighlight}</strong> {coeParagraph1}
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{coeParagraph2}</p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="scs-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#scs-blue-grad)" style={{ animation: 'scs-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#scs-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'scs-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#scs-blue-grad)" style={{ animation: 'scs-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#scs-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'scs-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#scs-blue-grad)" style={{ animation: 'scs-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#scs-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'scs-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#scs-blue-grad)" style={{ animation: 'scs-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#scs-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'scs-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'scs-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {quadrants.map((q, idx) => (
                        <div key={idx} className={`relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br ${q.gradient}`} style={{ transform: `translateZ(${6 - idx * 1.5}px)` }}>
                          <div className="-rotate-45 text-center text-white font-bold text-[15px] whitespace-pre-line">{q.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Quadrant Labels */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {quadrants[0]?.items?.map((item, i) => <li key={i}>{item} •</li>)}
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    {quadrants[1]?.items?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {quadrants[2]?.items?.map((item, i) => <li key={i}>{item} •</li>)}
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    {quadrants[3]?.items?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {quadrants.map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden">
                  <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm whitespace-pre-line`}>{q.title}</div>
                  <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items?.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {differentiators.map((d) => (
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
// 5. DELIVERY MODEL — 4-Phase SVG Timeline with GSAP scroll-driven animation
// ═══════════════════════════════════════════════════════════════════════════════
export const DeliveryModelSection = ({
  badgeText = 'Delivery Model',
  badgeIcon: BadgeIcon = Network,
  title = 'Our',
  titleSuffix = '',
  highlightWord = 'Delivery Model.',
  intro = 'Delivery is structured as an architecture-first engineering model—designed to reduce experimentation risk and move towards production with scale.',
  phases = [
    { phase: 'DEFINE', icon: <Search className="w-7 h-7" />, title: 'Assess & Scope', desc: 'Assess business use cases, trust requirements, ecosystem constraints, and platform-fit priorities.', gradient: 'from-slate-600 to-slate-800' },
    { phase: 'ARCHITECT', icon: <Layers className="w-7 h-7" />, title: 'Design foundations', desc: 'Design platform stack, approach, security controls, and infrastructure.', gradient: 'from-blue-500 to-blue-700', kangqore: true },
    { phase: 'ENGINEER', icon: <Server className="w-7 h-7" />, title: 'Build & Deploy', desc: 'Build components, contracts, middleware, integrations, and monitoring layers.', gradient: 'from-brand-blue to-indigo-600', kangqore: true },
    { phase: 'OPERATE', icon: <Activity className="w-7 h-7" />, title: 'Evolve & Scale', desc: 'Strengthen performance, security, ecosystem maturity, and expansion through refinement.', gradient: 'from-cyan-400 to-cyan-600', kangqore: true }
  ],
  stats = [
    { label: 'Phases', value: '04' },
    { label: 'Cycle', value: 'Agile' },
    { label: 'Control', value: 'MAX' }
  ]
}) => {
  const journeyRef = useRef(null);

  useEffect(() => {
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
      });
      const pathEl = journeyRef.current.querySelector('.scs-journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.scs-journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.scs-journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .scs-journey-curve-glow { filter: blur(3px); }
          @keyframes scs-glow-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
          .scs-journey-curve-glow { animation: scs-glow-pulse 3s ease-in-out infinite; }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[55%] relative">
            <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="scs-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="33%" stopColor="#3b82f6" />
                    <stop offset="66%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                  <filter id="scs-journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="scs-journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#scs-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#scs-journey-glow-v)" opacity="0.3" />
                <path className="scs-journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#scs-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="scs-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#scs-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#scs-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#scs-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-scs-${i}`} className="scs-journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="scs-journey-card group">
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
                <BadgeIcon className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">{badgeText}</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                {title} {titleSuffix} <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{highlightWord}</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">{intro}</p>
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">{s.label}</div>
                    <div className={`text-2xl font-bold ${i === stats.length - 1 ? 'text-transparent bg-clip-text bg-brand-gradient' : 'text-gray-900 dark:text-white'}`}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. EXECUTION ECOSYSTEM — Orbiting Tech Stack Visualization
// ═══════════════════════════════════════════════════════════════════════════════
export const ExecutionEcosystemSection = ({
  badgeText = 'Tech Ecosystem',
  badgeIcon: BadgeIcon = Binary,
  title = 'The',
  titleSuffix = '',
  highlightWord = 'Ecosystem Stack.',
  intro = 'Success depends on more than a single layer. It requires scalable infrastructure, smart architecture, security design, and analytics working together as a unified stack.',
  centerIcon: CenterIcon = Binary,
  orbit1 = [{ label: 'CORE', pos: 'top' }, { label: 'INFRA', pos: 'bottom' }],
  orbit2 = [{ label: 'Smart\nContracts', pos: 'topRight' }, { label: 'Security', pos: 'bottomLeft' }],
  orbit3 = [{ label: 'Apps', pos: 'topRight' }, { label: 'REST API', pos: 'bottomRight' }, { label: 'Middleware', pos: 'left' }]
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.scs-orbit-ring-1', { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.scs-orbit-ring-2', { rotation: -360, duration: 55, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.scs-orbit-ring-3', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.scs-orbit-node-1', { rotation: -360, duration: 40, ease: 'none', repeat: -1 });
      gsap.to('.scs-orbit-node-2', { rotation: 360, duration: 55, ease: 'none', repeat: -1 });
      gsap.to('.scs-orbit-node-3', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });
      gsap.fromTo('.scs-eco-enter', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const getPos = (pos) => {
    const positions = {
      top: { top: '0%', left: '50%' },
      bottom: { top: '100%', left: '50%' },
      topRight: { top: '14.65%', left: '85.35%' },
      bottomLeft: { top: '85.35%', left: '14.65%' },
      bottomRight: { top: '93.3%', left: '75%' },
      left: { top: '50%', left: '0%' }
    };
    return positions[pos] || positions.top;
  };

  return (
    <section className="pt-24 pb-32 lg:pt-36 lg:pb-48 bg-[#fefffc] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scs-orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .scs-orbit-path { animation: scs-orbit-glow-pulse 4s ease-in-out infinite; }
      `}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="scs-eco-enter">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <BadgeIcon className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">{badgeText}</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              {title} {titleSuffix}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{highlightWord}</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">{intro}</p>
          </div>
          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
            {/* Central Hub */}
            <div className="scs-eco-enter absolute w-28 h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-brand-blue via-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl z-20">
              <div className="relative">
                <CenterIcon className="w-14 h-14 lg:w-16 lg:h-16 text-white drop-shadow" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Orbit 1 */}
            <div className="scs-eco-enter scs-orbit-ring-1 absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-full scs-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.1)' }}>
              {orbit1.map((n, i) => (
                <div key={i} className="scs-orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[10px] shadow-lg" style={getPos(n.pos)}>{n.label}</div>
              ))}
            </div>
            {/* Orbit 2 */}
            <div className="scs-eco-enter scs-orbit-ring-2 absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full scs-orbit-path" style={{ border: '1px dashed rgba(37, 100, 234, 0.2)' }}>
              {orbit2.map((n, i) => (
                <div key={i} className="scs-orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-blue text-white font-bold text-xs shadow-xl text-center leading-tight hover:scale-110 transition-transform whitespace-pre-line" style={getPos(n.pos)}>{n.label}</div>
              ))}
            </div>
            {/* Orbit 3 */}
            <div className="scs-eco-enter scs-orbit-ring-3 absolute w-[440px] h-[440px] lg:w-[520px] lg:h-[520px] rounded-full scs-orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.08)' }}>
              {orbit3.map((n, i) => {
                const styles = [
                  'w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
                  'px-4 lg:px-5 h-10 lg:h-12 rounded-2xl bg-slate-800 text-white min-w-max',
                  'w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-50 text-brand-blue'
                ];
                return (
                  <div key={i} className={`scs-orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-xs shadow-lg hover:scale-110 transition-transform text-center leading-tight ${styles[i % styles.length]}`} style={getPos(n.pos)}>{n.label}</div>
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
// 7. FUTURE-READY SECTION — Platform Requirements Accordion
// ═══════════════════════════════════════════════════════════════════════════════
export const FutureReadySection = ({
  badgeText = 'Platform Requirements',
  badgeIcon: BadgeIcon = Rocket,
  title = 'What Great Platforms',
  highlightWord = 'Require.',
  intro = 'We help enterprises navigate implementation complexity across critical areas to ensure long-term production success.',
  requirements = [
    { title: 'Distributed Core', desc: 'The core is only the foundation. Success depends on how it is engineered around real workflows and real scale.' },
    { title: 'Scalable Infrastructure', desc: 'Production-fit infrastructure is required to move beyond experimental deployment and support consistent performance.' },
    { title: 'Efficient Design', desc: 'Architecture and system behavior directly affect responsiveness, resilience, and cost economics.' },
    { title: 'Engineering Discipline', desc: 'Systems require engineering rigor, absolute security, and process alignment—not just scripted logic.' }
  ]
}) => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <BadgeIcon className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">{badgeText}</span>
            </div>
            <h2 className="text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              {title}{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{highlightWord}</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">{intro}</p>
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
