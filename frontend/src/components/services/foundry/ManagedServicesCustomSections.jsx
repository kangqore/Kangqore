import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Network, ShieldCheck, Database, Server, Activity, Layers, CheckCircle2, Radar } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const OperationsCoESection = () => {
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Counter animation
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) {
          const targetNum = parseInt(match[1], 10);
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`);
                }
              });
            }
          });
        }
      });

      // 2. Diamond Entrance Animation (fade-in + scale-up)
      if (diamondRef.current) {
        gsap.fromTo(diamondRef.current,
          { opacity: 0, scale: 0.8, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: diamondRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );

        // 3. Diamond Parallax (subtle float on scroll)
        gsap.to(diamondRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: diamondRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }

      // 4. Differentiator items staggered entrance
      if (differentiatorRef.current) {
        const items = differentiatorRef.current.querySelectorAll('.diff-item');
        gsap.fromTo(items,
          { opacity: 0, y: 30, x: -20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: differentiatorRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mng-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes mng-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes mng-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      ` }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT: INTRO + DIAGRAM ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's Managed Operations Center of Excellence (CoE) surrounds your infrastructure with four vital execution layers — <strong className="text-brand-blue">Service Desk Ops</strong>, <strong className="text-brand-blue">Cloud & Platform Ops</strong>, <strong className="text-brand-blue">Security & Identity</strong>, and <strong className="text-brand-blue">Endpoint & Devices</strong>.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace fragmented support with a unified capability model. From intelligent ticket routing and FinOps governance to zero-trust enforcement and modern device management, our architecture ensures continuous availability, predictable scaling, and uncompromising operational control.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            {/* Desktop Diamond Layout */}
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG — connector lines (brand blue/cyan) */}
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="mng-coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  {/* Top */}
                  <circle cx="300" cy="40" r="7" fill="url(#mng-coe-blue-grad)" style={{ animation: 'mng-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#mng-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'mng-connector-draw 2s ease-out forwards' }} />
                  {/* Left */}
                  <circle cx="40" cy="300" r="7" fill="url(#mng-coe-blue-grad)" style={{ animation: 'mng-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#mng-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'mng-connector-draw 2s ease-out 0.3s forwards' }} />
                  {/* Bottom */}
                  <circle cx="300" cy="560" r="7" fill="url(#mng-coe-blue-grad)" style={{ animation: 'mng-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#mng-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'mng-connector-draw 2s ease-out 0.6s forwards' }} />
                  {/* Right */}
                  <circle cx="560" cy="300" r="7" fill="url(#mng-coe-blue-grad)" style={{ animation: 'mng-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#mng-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'mng-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* ===== TRUE 3D DIAMOND ===== */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{
                  perspective: '900px',
                  perspectiveOrigin: '50% 40%'
                }}>
                  {/* 3D tilted diamond */}
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'mng-diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{
                      transformStyle: 'preserve-3d'
                    }}>
                      {/* Top Left -> Service Desk */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Service Desk</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Operations</span>
                        </div>
                      </div>
                      {/* Top Right -> Cloud & Platform */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Cloud & Platform</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Operations</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Security & Identity */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)',
                        transform: 'translateZ(2px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Security &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Identity</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Endpoint & Devices */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Endpoint &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Devices</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== BULLET LABELS (simple text) ===== */}
                {/* Top-Left: Service Desk bullets */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>L1/L2 Incident Management</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Self-Service & AI Triage</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Service Catalog Workflows</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>VIP & Executive Support</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Top-Right: Cloud & Platform bullets */}
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Infrastructure Monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Cloud FinOps & Cost Control</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Capacity Planning & Auto-scaling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Release & Pipeline Governance</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Left: Security & Identity bullets */}
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Threat Telemetry & Alerting</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Privileged Access Controls</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Vulnerability Management</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Zero-Trust Policy Enforcement</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Right: Endpoint & Devices bullets */}
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>UEM & Device Lifecycle</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Zero-Touch Provisioning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>OS Patching & Compliance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Digital Experience Analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Layout */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { 
                  title: 'Service Desk Operations', 
                  gradient: 'from-[#2564ea] to-[#3b82f6]',
                  dotColor: 'bg-[#2564ea]',
                  items: ['L1/L2 Incident Management', 'Self-Service & AI Triage', 'Service Catalog Workflows', 'VIP & Executive Support']
                },
                { 
                  title: 'Cloud & Platform', 
                  gradient: 'from-[#3b82f6] to-[#60a5fa]',
                  dotColor: 'bg-[#3b82f6]',
                  items: ['Infrastructure Monitoring', 'Cloud FinOps & Cost Control', 'Capacity Planning & Auto-scaling', 'Release & Pipeline Governance']
                },
                { 
                  title: 'Security & Identity', 
                  gradient: 'from-[#1e40af] to-[#2564ea]',
                  dotColor: 'bg-[#1e40af]',
                  items: ['Threat Telemetry & Alerting', 'Privileged Access Controls', 'Vulnerability Management', 'Zero-Trust Policy Enforcement']
                },
                { 
                  title: 'Endpoint & Devices', 
                  gradient: 'from-[#4ab6d4] to-[#38bdf8]',
                  dotColor: 'bg-[#4ab6d4]',
                  items: ['UEM & Device Lifecycle', 'Zero-Touch Provisioning', 'OS Patching & Compliance', 'Digital Experience Analytics']
                }
              ].map((quadrant, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                  <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                    <div className="absolute inset-0 bg-black/5"></div>
                    <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-2.5">
                      {quadrant.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                          <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
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

        {/* ==================== KEY DIFFERENTIATORS ==================== */}
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Outcome-Driven Service Level Agreements',
                text: 'We align our SLAs to business continuity, application performance, and end-user productivity metrics—going far beyond simple uptime and ticket closure rates to ensure IT actively supports your enterprise objectives.'
              },
              {
                num: 2,
                title: 'Zero-Disruption Transition Framework',
                text: 'Our onboarding methodology minimizes risk and protects operational momentum through disciplined runbook generation, knowledge transfer protocols, and rigorous shadow-support stabilization phases.'
              },
              {
                num: 3,
                title: 'Predictive Monitoring & Observability',
                text: 'By deploying advanced telemetry and event-correlation platforms, we transition your environment from reactive firefighting to proactive fault resolution, neutralizing anomalies before they become critical incidents.'
              },
              {
                num: 4,
                title: 'FinOps & Continuous Optimization',
                text: 'Our cloud operations teams continuously audit utilization, right-size compute infrastructure, and identify licensing redundancies to structurally lower your total cost of ownership and eliminate ecosystem bloat.'
              },
              {
                num: 5,
                title: 'Unified Operational Visibility',
                text: 'We replace siloed operations with a single, governed pane of glass—providing CIOs and IT leaders with transparent access to cross-functional reporting, escalation metrics, and continuous improvement backlogs.'
              }
            ].map((diff) => (
              <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ExecutionEcosystemSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mng-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mng-pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-spin-slow {
          animation: mng-spin-slow 20s linear infinite;
        }
        .animate-pulse-subtle {
          animation: mng-pulse-subtle 3s ease-in-out infinite;
        }
      ` }} />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Operations <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Scale your managed services capabilities by integrating core operations with specialized architecture, continuity, and compliance solutions.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Cloud Infrastructure & Migrations', 
                  link: '/services/infrastructure-networks-operations/cloud-infrastructure-migrations',
                  icon: <Cloud className="w-5 h-5" />,
                  desc: 'Architect and deploy resilient cloud estates.'
                },
                { 
                  name: 'Network & Connectivity', 
                  link: '/services/infrastructure-networks-operations/network-connectivity-engineering',
                  icon: <Network className="w-5 h-5" />,
                  desc: 'Engineer secure, high-throughput enterprise networks.'
                },
                { 
                  name: 'Identity & Access Management', 
                  link: '/services/cybersecurity/identity-access-management',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  desc: 'Deploy absolute access control and zero-trust.'
                },
                { 
                  name: 'Disaster Recovery & BCP', 
                  link: '/services/infrastructure-networks-operations/disaster-recovery-bcp',
                  icon: <Database className="w-5 h-5" />,
                  desc: 'Ensure total data resilience and failover capability.'
                }
              ].map((offering, idx) => (
                <Link 
                  key={idx} 
                  to={offering.link}
                  className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
              >
                Explore Services 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // GOVERNING_ECOSYSTEM...
              </div>
            </div>
          </div>

          {/* Technical Schematic: Centralized Operations Hub */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_MNG_NOC</span></div>
                <div className="flex justify-between gap-4"><span>SLA:</span> <span className="text-emerald-500">99.999%</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">GOVERNED</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Operations Engine</div>
                <div>CORRELATING_EVENTS...</div>
                <div>UPTIME: STABLE</div>
              </div>

              {/* Central Core (NOC/SOC Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Server className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                   <Activity className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Infrastructure, Security, Analytics) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Layers className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Platform</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">SLA</div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Metrics</span>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <Radar className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Telemetry</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="mng-ops-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#mng-ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#mng-ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#mng-ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
