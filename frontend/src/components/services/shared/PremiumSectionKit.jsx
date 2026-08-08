// ─── Premium Section Kit — shared, parametrized (Phase F · KQ-SER-FOUNDRY-F) ──
// One reusable animated section set, driven entirely by a `data` prop. Used to
// lift the 6 Level-2 services (the cloud cluster + analytics) to flagship-tier
// without duplicating ~600-line bespoke files per service.
//
// Renders the four flagship sections L3 peers carry:
//   1. 3D Diamond CoE  2. Value We Deliver  3. Journey / Delivery Model
//   4. Future-Ready Expertise
//
// GSAP is isolated in a gsap.context() scoped to sectionRef; cleanup is
// ctx.revert() — never a global ScrollTrigger kill. Identical look, tokens,
// and motion to the lifted L3 sections (brand-blue #2564ea / brand-cyan
// #4ab6d4 / brand-gradient).
//
// data shape:
//   {
//     coe:    { label, intro, body, quadrants:[{lines:[],gradient,items:[]}]×4,
//               differentiators:[{num,title,text}] },
//     value:  { title, titleHighlight, items:[{title,desc}] },
//     journey:{ title, titleHighlight, intro, phases:[{phase,icon,title,desc,
//               gradient,ring,glow,kangqore}], stats:[{label,value}]×3 },
//     future: { intro, items:[{title,desc}] },
//   }
// ──────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Rocket, BrainCircuit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Chevron = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-brand-blue' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
);

const PremiumAnimatedSections = ({ data }) => {
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
            scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true } }
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
            scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true } }
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
          scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
      }
    }, sectionRef);

    return () => ctx.revert(); // SCOPED cleanup — never global kill
  }, []);

  if (!data) return null;
  const { coe, value, journey, future } = data;
  const quadGradients = ['from-blue-600 to-blue-800', 'from-blue-400 to-blue-600', 'from-blue-900 to-slate-900', 'from-cyan-500 to-cyan-700'];

  return (
    <div ref={sectionRef} className="kq-premium-kit">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kq-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes kq-connector-draw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        @keyframes kq-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      ` }} />

      {/* 3D DIAMOND CoE SECTION */}
      <section className="py-16 lg:py-24 overflow-hidden relative bg-white dark:bg-black z-[10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
            <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
              <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
                <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                  Our <strong className="text-brand-blue">{coe.label}</strong> {coe.intro}
                </p>
                <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{coe.body}</p>
              </div>
            </div>
            <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
              <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
                <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                  <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                    <defs><linearGradient id="kq-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                    <circle cx="300" cy="40" r="7" fill="url(#kq-blue-grad)" style={{ animation: 'kq-dot-ping 3s ease-in-out infinite' }} />
                    <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#kq-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'kq-connector-draw 2s ease-out forwards' }} />
                    <circle cx="40" cy="300" r="7" fill="url(#kq-blue-grad)" style={{ animation: 'kq-dot-ping 3s ease-in-out infinite 0.5s' }} />
                    <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#kq-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'kq-connector-draw 2s ease-out 0.3s forwards' }} />
                    <circle cx="300" cy="560" r="7" fill="url(#kq-blue-grad)" style={{ animation: 'kq-dot-ping 3s ease-in-out infinite 1s' }} />
                    <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#kq-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'kq-connector-draw 2s ease-out 0.6s forwards' }} />
                    <circle cx="560" cy="300" r="7" fill="url(#kq-blue-grad)" style={{ animation: 'kq-dot-ping 3s ease-in-out infinite 1.5s' }} />
                    <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#kq-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'kq-connector-draw 2s ease-out 0.9s forwards' }} />
                  </svg>
                  <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                    <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'kq-diamond-float-3d 6s ease-in-out infinite' }}>
                      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                        {coe.quadrants.map((q, i) => (
                          <div key={i} className={`relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br ${quadGradients[i]}`} style={{ transform: `translateZ(${[6, 4, 2, 3][i]}px)` }}>
                            <div className="-rotate-45 text-center text-white font-bold text-[16px]">{q.lines[0]}<br />{q.lines[1]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">{coe.quadrants[0].items.map((it, k) => <li key={k}>{it} •</li>)}</ul></div>
                  <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">{coe.quadrants[1].items.map((it, k) => <li key={k}>• {it}</li>)}</ul></div>
                  <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">{coe.quadrants[2].items.map((it, k) => <li key={k}>{it} •</li>)}</ul></div>
                  <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">{coe.quadrants[3].items.map((it, k) => <li key={k}>• {it}</li>)}</ul></div>
                </div>
              </div>
              {/* Mobile CoE Cards */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {coe.quadrants.map((q, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className={`bg-gradient-to-r ${quadGradients[idx]} p-4 text-white font-bold text-sm`}>{q.lines.join(' ')}</div>
                    <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* DIFFERENTIATOR GRID */}
          <div ref={differentiatorRef} className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {coe.differentiators.map((d) => (
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
                {value.title}{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{value.titleHighlight}</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            </div>
            <div className="space-y-3">
              {value.items.map((item, idx) => (
                <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <button onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} className="w-full flex items-center justify-between p-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-colors ${openAccordion === idx ? 'bg-brand-blue' : 'bg-slate-900'}`}>{String(idx + 1).padStart(2, '0')}</div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    </div>
                    <Chevron open={openAccordion === idx} />
                  </button>
                  {openAccordion === idx && (
                    <div className="px-6 pb-6 pl-20"><p className="text-gray-500 font-light leading-relaxed">{item.desc}</p></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY TIMELINE — 4-Phase Delivery Model */}
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
                    <linearGradient id="kq-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="kq-journey-glow-v"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#kq-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#kq-journey-glow-v)" opacity="0.3" />
                  <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#kq-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[125, 375, 625, 875].map((cy, i) => (
                    <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#kq-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                      <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#kq-journey-grad-v)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#kq-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
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
                {journey.phases.map((item, idx) => (
                  <div key={idx} className="journey-card group" style={{ perspective: '800px' }}>
                    <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 lg:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`}></div>
                      <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.glow} group-hover:scale-110 transition-all duration-500`}>
                        {item.icon}
                        <div className={`absolute inset-0 rounded-2xl border-2 ${item.ring} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`}></div>
                      </div>
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-gray-300 uppercase">{item.phase}</div>
                          {item.kangqore && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                              <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse"></div>
                              <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase">Kangqore</span>
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
                    {journey.title}{' '}<br />
                    <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{journey.titleHighlight}</span>
                  </h2>
                  <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                  <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">{journey.intro}</p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                  {journey.stats.map((s, i) => (
                    <div key={i}>
                      <div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">{s.label}</div>
                      <div className={`text-2xl font-bold ${i === 2 ? 'text-transparent bg-clip-text bg-brand-gradient' : 'text-gray-900 dark:text-white'}`}>{s.value}</div>
                    </div>
                  ))}
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
              <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">{future.intro}</p>
            </div>
            <div className="space-y-3">
              {future.items.map((item, idx) => (
                <div key={idx} className="group rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <button onClick={() => setOpenFutureAccordion(openFutureAccordion === idx ? -1 : idx)} className="w-full flex items-center justify-between p-6 text-left">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    <Chevron open={openFutureAccordion === idx} />
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

export default PremiumAnimatedSections;
