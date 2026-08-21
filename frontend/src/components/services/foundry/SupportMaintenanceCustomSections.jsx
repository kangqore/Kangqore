import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bug, Server, AlertTriangle, RefreshCw, Settings, Cloud, Network, Cpu, ArrowRight, Wrench, Layers, CheckCircle2, Activity, Radar } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SupportCoESection = () => {
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
        @keyframes sm-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes sm-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sm-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      ` }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
          
          {/* Left: Description */}
          <div className="lg:w-[40%] xl:w-[35%] relative z-20">
            <div className="border-l-4 border-brand-blue/30 pl-8">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-tight">
                Kangqore's Support Operations Center of Excellence (CoE) surrounds your systems with four vital execution layers — {' '}
                <span className="text-transparent bg-clip-text bg-brand-gradient font-bold">App Support</span>,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 font-bold">Infra & Platform</span>,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500 font-bold">Monitoring & Incident</span>,{' '}
                and <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 font-bold">Patch & Change</span>.
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                We replace fragmented support with a unified operating model. From bug triage to patch governance, from proactive alerting to security hygiene, our architecture ensures consistent availability, predictable maintenance, and uncompromising service quality.
              </p>
            </div>
          </div>

          {/* Right: 3D Diamond */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG connector lines */}
                <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 600 600" fill="none">
                  <circle cx="300" cy="40" r="7" fill="url(#sm-coe-blue-grad)" style={{ animation: 'sm-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#sm-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'sm-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#sm-coe-blue-grad)" style={{ animation: 'sm-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#sm-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'sm-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#sm-coe-blue-grad)" style={{ animation: 'sm-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#sm-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'sm-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#sm-coe-blue-grad)" style={{ animation: 'sm-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#sm-coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'sm-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* 3D Diamond */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{
                  perspective: '900px',
                  perspectiveOrigin: '50% 40%'
                }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'sm-diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Left -> App Support */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <Bug className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Application<br />Support
                          </span>
                        </div>
                      </div>
                      {/* Top Right -> Infra Support */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <Server className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Infrastructure<br />Support
                          </span>
                        </div>
                      </div>
                      {/* Bottom Left -> Monitoring & Incident */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <AlertTriangle className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Monitoring &<br />Incident
                          </span>
                        </div>
                      </div>
                      {/* Bottom Right -> Patch & Change */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
                        transform: 'translateZ(5px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <RefreshCw className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Patch &<br />Change
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contextual Labels */}
                {/* Top: App Support labels */}
                <div className="absolute top-[60px] left-[30px] text-right space-y-1 z-20">
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Bug Fixing & Issue Triage</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Corrective & Adaptive Maintenance</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Release Readiness & Deployment</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Application Health Monitoring</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                </div>
                {/* Right: Infra Support labels */}
                <div className="absolute top-[60px] right-[30px] text-left space-y-1 z-20">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Server & Storage Support</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">OS & Middleware Maintenance</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Backup & Recovery Validation</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Capacity & Uptime Support</span></div>
                </div>
                {/* Bottom Left: Monitoring labels */}
                <div className="absolute bottom-[60px] left-[30px] text-right space-y-1 z-20">
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Proactive Monitoring & Alerting</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Incident Triage & Escalation</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Root-Cause Analysis</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">SLA & Performance Reporting</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                </div>
                {/* Bottom Right: Patch & Change labels */}
                <div className="absolute bottom-[60px] right-[30px] text-left space-y-1 z-20">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-sky-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Patch Management Execution</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-sky-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Minor Upgrades & Dependencies</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-sky-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Change Validation & Rollback</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-sky-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Maintenance Window Coordination</span></div>
                </div>
              </div>
            </div>

            {/* Mobile Diamond fallback */}
            <div className="lg:hidden grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { name: 'Application Support', icon: <Bug className="w-5 h-5" />, color: 'from-blue-500 to-blue-700' },
                { name: 'Infrastructure Support', icon: <Server className="w-5 h-5" />, color: 'from-cyan-400 to-cyan-600' },
                { name: 'Monitoring & Incident', icon: <AlertTriangle className="w-5 h-5" />, color: 'from-indigo-400 to-indigo-600' },
                { name: 'Patch & Change', icon: <RefreshCw className="w-5 h-5" />, color: 'from-sky-400 to-sky-600' }
              ].map((q, i) => (
                <div key={i} className={`bg-gradient-to-br ${q.color} p-5 rounded-2xl text-white text-center`}>
                  <div className="mx-auto mb-2 opacity-80">{q.icon}</div>
                  <span className="font-bold text-xs tracking-wider">{q.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-28 relative z-10">
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Outcome-Driven SLAs',
                text: 'We align our support SLAs to business continuity, application availability, and mean-time-to-resolution metrics — going far beyond simple ticket closure rates to ensure IT support actively protects your operations.'
              },
              {
                num: 2,
                title: 'Zero-Disruption Change Execution',
                text: 'Our maintenance methodology minimizes risk through governed change windows, rollback-ready plans, validation protocols, and rigorous shadow-support stabilization — ensuring every patch and upgrade is production-safe.'
              },
              {
                num: 3,
                title: 'Proactive Monitoring & Root-Cause Analysis',
                text: 'By deploying advanced alerting, event-correlation, and log analytics, we transition your environment from reactive firefighting to proactive fault prevention — neutralizing anomalies before they become critical incidents.'
              },
              {
                num: 4,
                title: 'Continuous Improvement Engine',
                text: 'Our support teams systematically identify recurring issues, analyze patterns, and implement preventive remediation actions — structurally reducing incident volumes and improving reliability quarter over quarter.'
              },
              {
                num: 5,
                title: 'Unified Support Visibility',
                text: 'We replace siloed support channels with a single governed pane of glass — providing IT leaders with transparent access to ticket analytics, SLA compliance, escalation metrics, and improvement backlogs.'
              }
            ].map((diff) => (
              <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{diff.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <svg className="hidden">
        <defs>
          <linearGradient id="sm-coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2564ea" />
            <stop offset="100%" stopColor="#4ab6d4" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export const SupportEcosystemSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black/50 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sm-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sm-pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-spin-slow-sm {
          animation: sm-spin-slow 30s linear infinite;
        }
        .animate-pulse-subtle-sm {
          animation: sm-pulse-subtle 3s ease-in-out infinite;
        }
      ` }} />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Support <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Extend your support capabilities by integrating specialized managed services, infrastructure modernization, and operational transformation solutions.
            </p>

            <div className="space-y-4">
              {[
                { name: 'Managed Services', desc: 'End-to-end managed IT operations.', icon: <Settings className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/managed-services' },
                { name: 'Infrastructure Modernization', desc: 'Modernize legacy environments.', icon: <Cloud className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/modernization-infrastructure' },
                { name: 'Network & Connectivity', desc: 'Engineer resilient enterprise networks.', icon: <Network className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/managed-infrastructure-services' },
                { name: 'Operation Technology', desc: 'IT/OT convergence and industrial ops.', icon: <Cpu className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/operation-technology' }
              ].map((svc, i) => (
                <Link key={i} to={svc.link} className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-100 hover:border-brand-blue/20 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-[#050505] rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {svc.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{svc.name}</h4>
                    <p className="text-sm text-gray-400">{svc.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <Link to="/services/infrastructure-networks-operations" className="inline-flex items-center gap-2 mt-8 text-brand-blue font-bold text-sm hover:gap-3 transition-all">
              Explore All INO Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated Operations Schematic */}
          <div className="lg:w-1/2 relative hidden lg:flex items-center justify-center min-h-[500px]">
            {/* Central Hub */}
            <div className="relative">
              <div className="absolute -inset-16 border-2 border-dashed border-gray-200 rounded-full animate-spin-slow-sm"></div>
              <div className="w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                <Wrench className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Satellite Nodes */}
            <div className="absolute top-8 right-16 flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                <Layers className="w-8 h-8 text-brand-blue" />
              </div>
              <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">Platform</span>
            </div>
            <div className="absolute bottom-16 left-8 flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">SLA</span>
            </div>
            <div className="absolute bottom-16 right-8 flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-lg flex items-center justify-center relative">
                <Activity className="w-10 h-10 text-[#2564ea]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">Monitoring</span>
            </div>
            <div className="absolute top-16 left-12 flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                <Radar className="w-8 h-8 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">Telemetry</span>
            </div>

            {/* Floating metadata badges */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm rounded-lg shadow-md px-4 py-2 border border-gray-100">
              <div className="flex gap-6 font-mono text-[11px]">
                <div><span className="text-gray-400">ID:</span> <span className="text-brand-blue font-bold">#KG_SUPP_OPS</span></div>
                <div><span className="text-gray-400">SLA:</span> <span className="text-emerald-500 font-bold">99.95%</span></div>
                <div><span className="text-gray-400">STATUS:</span> <span className="text-emerald-500 font-bold">STABLE</span></div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl px-4 py-3 border border-slate-700/50 animate-pulse-subtle-sm">
              <div className="font-mono text-[11px] space-y-1">
                <div className="text-brand-blue font-bold tracking-widest">SUPPORT ENGINE</div>
                <div className="text-gray-400">REDUCING_ENTROPY...</div>
                <div className="text-gray-400">STATUS: <span className="text-emerald-400">FERRARI</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
