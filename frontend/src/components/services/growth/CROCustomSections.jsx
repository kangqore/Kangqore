import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, BarChart3, DollarSign, MousePointerClick, Gauge, Search, Users, Activity, Filter, Rocket, Database, Settings, CheckCircle2, Bot, PenTool } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CRO CHALLENGES SECTION (Interactive Before/After)
// ═══════════════════════════════════════════════════════════════════════════════
export const CROChallengesSection = () => {
  const sectionRef = useRef(null);
  const [activeState, setActiveState] = useState('before');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveState(prev => prev === 'before' ? 'after' : 'before');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.cro-challenge');
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const challenges = [
    { 
      before: { title: 'High Traffic, Low Conversions', desc: 'You attract users — but fail to convert them due to hidden friction and poor journey architecture.' },
      after: { title: 'Engineered Conversion Architecture', desc: 'We identify exact drop-off points and build targeted pathways that reliably convert demand into revenue.' }
    },
    { 
      before: { title: 'Weak UX & Messaging', desc: 'Users don’t understand the value, lack trust, or fail to take action because of confusing design.' },
      after: { title: 'Clear Value & Persuasion', desc: 'We redesign experiences with cognitive fluency, persuasive micro-copy, and frictionless UX.' }
    },
    { 
      before: { title: 'Funnel Drop-Offs', desc: 'Users consistently abandon the process before completing actions, like forms or checkouts.' },
      after: { title: 'Journey Flow Optimization', desc: 'We eliminate blockers, reduce cognitive load, and streamline the direct path to conversion.' }
    },
    { 
      before: { title: 'No Testing System', desc: 'Decisions are based on assumptions, guesswork, or generic "best practices" rather than real data.' },
      after: { title: 'Continuous A/B Testing', desc: 'We validate every single change with statistical significance using real user interaction data.' }
    },
    { 
      before: { title: 'Rising Marketing Costs', desc: 'Ad spend continuously increases, but overall performance and return on ad spend (ROAS) stagnates.' },
      after: { title: 'Profitability & Scaling', desc: 'We maximize ROI on existing traffic, dramatically lowering your Customer Acquisition Cost (CAC).' }
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-left max-w-2xl">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
              Where Most Websites <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Fail.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">Traffic without conversion is lost revenue. Stop guessing and start engineering.</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded-[2rem] inline-flex relative border border-gray-100 shadow-inner shrink-0">
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out ${activeState === 'after' ? 'translate-x-full' : 'translate-x-0'}`}
            ></div>
            <button 
              onClick={() => { setActiveState('before'); setIsAutoPlaying(false); }}
              className={`relative z-10 px-8 py-4 rounded-full text-sm font-bold transition-colors duration-300 w-48 lg:w-56 flex items-center justify-center gap-2 ${activeState === 'before' ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${activeState === 'before' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
              Before: The Problem
            </button>
            <button 
              onClick={() => { setActiveState('after'); setIsAutoPlaying(false); }}
              className={`relative z-10 px-8 py-4 rounded-full text-sm font-bold transition-colors duration-300 w-48 lg:w-56 flex items-center justify-center gap-2 ${activeState === 'after' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${activeState === 'after' ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
              After: Engineered
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative justify-center">
          {challenges.map((c, idx) => {
            const data = activeState === 'before' ? c.before : c.after;
            const isAfter = activeState === 'after';
            
            return (
              <div 
                key={idx} 
                className={`cro-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col ${isAfter ? 'shadow-[0_10px_40px_rgba(37,100,234,0.08)] -translate-y-1' : 'shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)]'} ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-brand-blue/[0.03] to-cyan-400/[0.03] transition-opacity duration-700 pointer-events-none ${isAfter ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-blue to-cyan-400 transition-all duration-1000 ease-out ${isAfter ? 'w-full' : 'w-0'}`}></div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isAfter ? 'bg-brand-blue/10 text-brand-blue' : 'bg-red-50 dark:bg-red-900/20 text-red-400'}`}>
                      {isAfter ? <CheckCircle2 className="w-5 h-5" fill="currentColor" /> : <Filter className="w-5 h-5 rotate-180" fill="currentColor" />}
                    </div>
                    <div className="pt-1.5">
                      <h3 className={`text-xl font-bold leading-tight transition-colors duration-500 ${isAfter ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                        {data.title}
                      </h3>
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <div className={`transition-all duration-500 ease-in-out ${activeState === 'before' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                      <p className="text-gray-500 font-light leading-relaxed">{c.before.desc}</p>
                    </div>
                    <div className={`transition-all duration-500 ease-in-out ${activeState === 'after' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute inset-0 pointer-events-none'}`}>
                      <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{c.after.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY CRO MATTERS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyCROMattersSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.cro-pillar');
      gsap.fromTo(items,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Traffic Without Conversion Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Lost Revenue.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              You’re already paying for traffic. If it doesn’t convert — you’re leaking money at scale. We plug the leaks to deliver measurable business outcomes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Conversion', icon: Target, desc: 'Higher overall conversion rates.' },
              { title: 'Lower CAC', icon: DollarSign, desc: 'Lower Customer Acquisition Cost.' },
              { title: 'Better ROI', icon: Activity, desc: 'Maximum return on existing ad spend.' },
              { title: 'Rapid Growth', icon: TrendingUp, desc: 'Faster scalable revenue growth.' }
            ].map((item, idx) => (
              <div key={idx} className="cro-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. 6-PHASE CRO METHOD
// ═══════════════════════════════════════════════════════════════════════════════
export const SixPhaseCROMethod = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'User Behavior Analysis', desc: 'We analyze how users interact — not how you think they behave.', includes: ['Heatmaps & session recordings', 'Click tracking & scroll behavior', 'User journey mapping'] },
    { num: '02', title: 'Conversion Funnel Analysis', desc: 'We identify where users drop — and exactly why they leave.', includes: ['Funnel stage breakdown', 'Drop-off diagnostics', 'Conversion blockers'] },
    { num: '03', title: 'UX & Landing Page Engineering', desc: 'We redesign digital experiences to drive definitive action.', includes: ['Clear value proposition', 'Trust signals & micro-copy', 'Frictionless UI/UX'] },
    { num: '04', title: 'A/B & Multivariate Testing', desc: 'We validate everything with real data, replacing guesswork with science.', includes: ['Experiment design', 'Statistical testing', 'Continuous iteration'] },
    { num: '05', title: 'Personalization & Targeting', desc: 'We deliver the right message to the right user at the exact right moment.', includes: ['Behavioral segmentation', 'Dynamic content', 'Context-aware journeys'] },
    { num: '06', title: 'Conversion Optimization System', desc: 'We build a repeatable growth engine that scales as you grow.', includes: ['Continuous CRO pipeline', 'Testing roadmap', 'Performance tracking'] }
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (containerRef.current && leftRef.current && rightRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          pin: leftRef.current,
          pinSpacing: false,
        });

        const phaseCards = rightRef.current.querySelectorAll('.cro-phase-card');
        phaseCards.forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0.3, scale: 0.95, y: 50 },
            { 
              opacity: 1, 
              scale: 1, 
              y: 0,
              scrollTrigger: {
                trigger: card,
                start: "top 65%",
                end: "bottom 35%",
                toggleActions: "play reverse play reverse",
                scrub: 0.5
              }
            }
          );
        });
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="pt-24 pb-48 lg:pb-[30vh] bg-white dark:bg-black relative">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 relative">
        <div className="w-full lg:w-1/3 hidden lg:block relative">
          <div ref={leftRef} className="sticky top-[20vh] lg:h-[60vh] flex flex-col justify-center">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              We Engineer Conversion <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Not Just Pages.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Our 6-phase approach systematically removes friction, validates hypotheses with data, and builds a predictable growth engine.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="cro-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              
              <div className="absolute left-0 bottom-0 h-1.5 w-0 bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>

              <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                <span className="text-6xl lg:text-8xl font-black text-brand-blue/20 font-mono leading-none tracking-tighter group-hover:scale-110 group-hover:-translate-y-2 group-hover:text-brand-blue/30 transition-all duration-500 origin-top-left">
                  {phase.num}
                </span>
                
                <div className="flex-1 pt-2 group-hover:translate-x-3 transition-transform duration-500 ease-out">
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{phase.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex-shrink-0">
                      <ArrowRight className="w-5 h-5 text-brand-blue" />
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed group-hover:text-gray-900 dark:text-white transition-colors duration-500 mb-6">
                    {phase.desc}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Focus Areas:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-light">
                          <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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
// 4. CRO SUCCESS SECTION (Compact Dark Accordion)
// ═══════════════════════════════════════════════════════════════════════════════
export const CROSuccessSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const kpis = [
    { title: 'Higher Conversion Rates', desc: 'Turn more existing visitors into paying customers.', icon: Target },
    { title: 'Better ROI', desc: 'Maximize financial returns from your existing traffic.', icon: TrendingUp },
    { title: 'Reduced CAC', desc: 'Lower acquisition costs through extreme efficiency.', icon: DollarSign },
    { title: 'Improved UX', desc: 'Better user experiences lead directly to higher engagement.', icon: MousePointerClick },
    { title: 'Data-Driven Decisions', desc: 'No guesswork. Only validated actions and statistically sound results.', icon: Activity }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % kpis.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, kpis.length]);

  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 max-w-4xl">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            What High-Performance CRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Delivers.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            CRO isn't about changing button colors. It's about engineering measurable, scalable business impact across the entire funnel.
          </p>
        </div>
        
        <div 
          className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px] w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {kpis.map((kpi, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-[24px] overflow-hidden transition-all duration-700 ease-in-out cursor-pointer flex shrink-0
                  ${isActive ? 'flex-[2] bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex-col lg:flex-row min-w-0 border-transparent z-10' : 'w-full lg:w-[70px] bg-[#111111] hover:bg-[#1a1a1a] shadow-md flex-col justify-center items-center py-2 min-h-[50px] lg:min-h-0 border border-gray-800 z-0'}
                `}
              >
                {/* INACTIVE STATE */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                   {/* Mobile View */}
                   <div className="lg:hidden flex items-center justify-between w-full px-5">
                     <span className="text-white font-bold text-base">{kpi.title}</span>
                     <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                   </div>
                   {/* Desktop View */}
                   <div className="hidden lg:flex flex-col items-center h-full py-6 w-full">
                     <div className="hidden lg:block lg:whitespace-nowrap lg:-rotate-180 flex-1 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-white font-bold text-base tracking-wide hover:tracking-widest transition-all duration-300">
                          {kpi.title}
                        </span>
                     </div>
                   </div>
                </div>

                {/* ACTIVE STATE */}
                <div className={`w-full h-full flex flex-col lg:flex-row transition-opacity duration-700 delay-200 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                  <div className="w-full lg:w-[40%] h-48 lg:h-full flex items-center justify-center relative p-6 bg-gradient-to-br from-[#111111] to-[#0A0A0A]">
                    <div className="absolute top-6 right-6 text-gray-800 dark:text-gray-50 font-mono font-bold text-lg z-20">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="w-full max-w-[160px] aspect-square flex items-center justify-center relative group z-10">
                       <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <div className="w-full h-full rounded-full bg-[#0A0A0A] border-2 border-gray-800 shadow-xl flex items-center justify-center overflow-hidden relative z-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-cyan-400/10 flex items-center justify-center">
                             <kpi.icon className="w-12 h-12 text-brand-blue opacity-90" />
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-[60%] h-full flex flex-col justify-center p-6 lg:p-8 xl:p-10">
                    <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 tracking-tight font-display leading-tight">
                      {kpi.title}
                    </h3>
                    <p className="text-gray-400 text-base font-light leading-relaxed mb-8 max-w-md">
                      {kpi.desc}
                    </p>
                    <div className="mt-auto pt-2">
                      <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition-all hover:scale-105 shadow-[0_0_15px_rgba(37,100,234,0.3)] group w-fit">
                        Get in Touch
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CRO READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const CROReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">You Don’t Need More Traffic. You Need Better Conversion.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Let’s identify exactly where your revenue is leaking — and fix it. Turn your website into a <strong className="text-white">high-performing growth engine.</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Get Free CRO Audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white font-semibold rounded-full hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm transition-all duration-300 border border-white/20">
                Book Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. CRO LOGO TRUST STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const CROLogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.cro-logo');
      gsap.fromTo(logos,
        { opacity: 0, y: 10 },
        { 
          opacity: 0.4, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true }
        }
      );
    }
  }, []);

  return (
    <div ref={sectionRef} className="py-16 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-24 mb-16 border-b border-gray-100 pb-12">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">100%</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Data-Driven Testing</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">ROI</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Revenue-First Focus</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">10M+</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">User Sessions Analyzed</p>
          </div>
        </div>

        <p className="text-center text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">Conversion Intelligence Partnerships</p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale">
          <div className="cro-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/VWO_logo.png" alt="VWO" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cro-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Optimizely_logo.svg" alt="Optimizely" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cro-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Hotjar_logo.svg" alt="Hotjar" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cro-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Unbounce_Logo.svg" alt="Unbounce" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cro-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Mixpanel_logo.svg" alt="Mixpanel" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};
