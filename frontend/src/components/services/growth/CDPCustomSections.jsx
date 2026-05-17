import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, Users, Zap, Search, Activity, CheckCircle2, Share2, Layers, BarChart3, Lock, MessageCircle, TrendingUp, Clock, Target, Database as DatabaseIcon, Globe, Briefcase, Filter, Rocket, Settings, Check, LayoutTemplate, FileText } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Realistic3DIcon from '../../ui/Realistic3DIcon';
import SecondaryButton from '../../ui/SecondaryButton';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CDP PROBLEMS SECTION (Interactive Before/After)
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPProblemsSection = () => {
  const sectionRef = useRef(null);
  const [activeState, setActiveState] = useState('before');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveState(prev => prev === 'before' ? 'after' : 'before');
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.cdp-challenge');
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
      before: { title: 'Fragmented Customer Records', desc: 'Data lives across CRM, ads, web, app, email—but no one has one reliable view.' },
      after: { title: 'Unified Identity Resolution', desc: 'Every touchpoint connected into one persistent golden customer record.' }
    },
    { 
      before: { title: 'Weak Personalization', desc: 'Brands send generic offers because they cannot identify real intent or behavior.' },
      after: { title: 'Activation Intelligence', desc: 'Relevant experiences delivered in real-time based on actual buyer signals.' }
    },
    { 
      before: { title: 'Poor Data Quality', desc: 'Duplicate records and inconsistent fields break automation and weaken decisions.' },
      after: { title: 'Clean Growth Foundation', desc: 'Standardized, high-quality data systems that teams can trust and scale.' }
    },
    { 
      before: { title: 'Disconnected Activation', desc: 'Segments exist in reports but do not flow into campaigns, journeys, or offers.' },
      after: { title: 'Seamless Data Pipelines', desc: 'Audience segments that activate instantly across every marketing channel.' }
    },
    { 
      before: { title: 'No AI-Ready Foundation', desc: 'AI fails when customer data is not trustworthy, secure, accessible, or organized.' },
      after: { title: 'AI-Ready Architecture', desc: 'Structured customer intelligence prepared for predictive and generative AI.' }
    },
    { 
      before: { title: 'Compliance & Consent Gaps', desc: 'Without proper governance, personalization becomes a major privacy risk.' },
      after: { title: 'Privacy-Aware Trust', desc: 'Consent and data protection built into the architecture from day one.' }
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-left max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Challenge</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
              Why Customer Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Fails to Create Growth.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">Disconnected signals and scattered records burn spend before performance begins.</p>
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
              Before: Scattered Data
            </button>
            <button 
              onClick={() => { setActiveState('after'); setIsAutoPlaying(false); }}
              className={`relative z-10 px-8 py-4 rounded-full text-sm font-bold transition-colors duration-300 w-48 lg:w-56 flex items-center justify-center gap-2 ${activeState === 'after' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${activeState === 'after' ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
              After: Unified Intelligence
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
                className={`cdp-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col ${isAfter ? 'shadow-[0_10px_40px_rgba(37,100,234,0.08)] -translate-y-1' : 'shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)]'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-brand-blue/[0.03] to-cyan-400/[0.03] transition-opacity duration-700 pointer-events-none ${isAfter ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-blue to-cyan-400 transition-all duration-1000 ease-out ${isAfter ? 'w-full' : 'w-0'}`}></div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-5">
                    <Realistic3DIcon 
                      icon={isAfter ? CheckCircle2 : Filter} 
                      className="w-10 h-10" 
                      iconSize="w-5 h-5" 
                      theme={isAfter ? "cyan" : "dark"} 
                    />
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
// 2. WHY CUSTOMER DATA STRATEGY MATTERS (Philosophy)
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyCDPStrategyMatters = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.cdp-pillar');
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
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Philosophy</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Data Without Strategy is <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Operational Noise.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Most brands collect customer data, but very few know how to activate it. Kangqore turns fragmented signals into a structured operating system for growth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Unified View', icon: Users, desc: 'One reliable profile across every touchpoint.' },
              { title: 'Clean IQ', icon: Database, desc: 'Standardized data teams can actually use.' },
              { title: 'Privacy First', icon: Shield, desc: 'Consent built into the architecture layer.' },
              { title: 'AI Ready', icon: Activity, desc: 'Data prepared for predictive intelligence.' }
            ].map((item, idx) => (
              <div key={idx} className="cdp-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="mb-4">
                  <Realistic3DIcon 
                    icon={item.icon} 
                    className="w-12 h-12" 
                    iconSize="w-6 h-6" 
                    theme="brand" 
                  />
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
// 3. CDP FRAMEWORK (6 Phases)
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPFrameworkSection = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'Diagnose', desc: 'Audit data sources, platforms, tracking, consent gaps, and AI-readiness markers.', includes: ['Data audit report', 'Source inventory', 'Readiness map'] },
    { num: '02', title: 'Design', desc: 'Define the unified customer data model, platform architecture, and activation use cases.', includes: ['Profile blueprint', 'Architecture design', 'Use-case roadmap'] },
    { num: '03', title: 'Connect', desc: 'Map integrations across website, app, CRM, CDP, email, WhatsApp, and ad platforms.', includes: ['Platform integration', 'API mapping', 'Real-time sync'] },
    { num: '04', title: 'Govern', desc: 'Establish consent, privacy, access, data-quality, and management standards.', includes: ['Consent framework', 'Privacy guardrails', 'Quality rules'] },
    { num: '05', title: 'Activate', desc: 'Launch segments, journeys, automated personalization, and campaign activation workflows.', includes: ['Segment build', 'Journey activation', 'Automated offers'] },
    { num: '06', title: 'Optimize', desc: 'Continuously improve data quality, audience performance, and AI intelligence outputs.', includes: ['Quality monitoring', 'Performance audit', 'AI refinement'] }
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

        const phaseCards = rightRef.current.querySelectorAll('.cdp-phase-card');
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

    return () => mm.revert();
  }, []);

  return (
    <section className="pt-24 pb-48 lg:pb-[30vh] bg-white dark:bg-black relative">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 relative">
        <div className="w-full lg:w-1/3 hidden lg:block relative">
          <div ref={leftRef} className="sticky top-[20vh] lg:h-[60vh] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Framework</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              From Scattered Signals to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Activated IQ.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              We do not just organize data. We diagnose, design, connect, govern, activate, and optimize.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="cdp-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
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
// 4. CDP DELIVERABLES SECTION (Node-based System Output)
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPDeliverablesSection = () => {
  const sectionRef = useRef(null);
  
  const deliverables = [
    { id: 'CDS-01', name: 'Customer Data Audit Report', category: 'DIAGNOSE' },
    { id: 'CDS-02', name: 'Data Source Inventory', category: 'RESEARCH' },
    { id: 'CDS-03', name: 'Customer Profile Blueprint', category: 'ARCHITECTURE' },
    { id: 'CDS-04', name: 'Identity Resolution Logic', category: 'UNIFICATION' },
    { id: 'CDS-05', name: 'CDP / CRM Strategy Document', category: 'PLATFORM' },
    { id: 'CDS-06', name: 'Data Collection Framework', category: 'INGESTION' },
    { id: 'CDS-07', name: 'Segmentation & Audience Model', category: 'ACTIVATION' },
    { id: 'CDS-08', name: 'Consent & Privacy Framework', category: 'GOVERNANCE' },
    { id: 'CDS-09', name: 'Personalization Use-Case Roadmap', category: 'EXPERIENCE' },
    { id: 'CDS-10', name: 'Marketing Activation Plan', category: 'EXECUTION' },
    { id: 'CDS-11', name: 'Analytics Dashboard Plan', category: 'INTELLIGENCE' },
    { id: 'CDS-12', name: 'AI-Readiness Assessment', category: 'FUTURE' }
  ];

  useEffect(() => {
    if (sectionRef.current) {
      const nodes = sectionRef.current.querySelectorAll('.deliverable-node');
      gsap.fromTo(nodes,
        { opacity: 0, scale: 0.9, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.08, 
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white dark:bg-black dark:border-gray-800 relative overflow-hidden border-t border-gray-50">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2564ea 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1.5px] w-16 bg-brand-blue"></div>
            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">System Output</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            Strategy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Deliverables.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl leading-relaxed">
            We don't deliver ideas; we deliver documented intelligence systems. Every component is engineered for clarity, accountability, and activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {deliverables.map((item, idx) => (
            <div key={idx} className="deliverable-node group relative">
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] group-hover:bg-brand-blue/30 transition-colors duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-brand-blue transition-colors duration-500"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono font-bold text-brand-blue/40 group-hover:text-brand-blue transition-colors duration-300">{item.id}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 dark:text-gray-400 transition-colors duration-300">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">{item.name}</h3>
                <div className="h-0.5 w-0 bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="mt-4 flex items-center gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">Ready for Activation</span>
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
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
// 5. BUSINESS IMPACT (Interactive Accordion)
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPImpactSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const impacts = [
    { title: 'Better Personalization', desc: 'Relevant offers, content, and recommendations based on real behavior.', icon: Target },
    { title: 'Stronger Retention', desc: 'Identify churn risk and repeat purchase triggers earlier.', icon: RefreshCw },
    { title: 'Smarter Campaigns', desc: 'Precise audience segments based on intent and value.', icon: Rocket },
    { title: 'Improved CX', desc: 'Consistent conversation with customers across every touchpoint.', icon: Heart },
    { title: 'AI-Ready Growth', desc: 'Governed data foundation for predictive and generative AI.', icon: Bot }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % impacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, impacts.length]);

  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1.5px] w-16 bg-brand-blue"></div>
            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Impact</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            What Strategy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Delivers.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Clean, connected, governed data becomes the foundation for every marketing, sales, and service decision.
          </p>
        </div>
        
        <div 
          className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[400px] w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {impacts.map((impact, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative rounded-[24px] overflow-hidden transition-all duration-700 ease-in-out cursor-pointer flex shrink-0
                  ${isActive ? 'flex-[2] bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex-col lg:flex-row min-w-0 border-transparent z-10' : 'w-full lg:w-[70px] bg-[#111111] hover:bg-[#1a1a1a] shadow-md flex-col justify-center items-center py-2 min-h-[50px] lg:min-h-0 border border-gray-800 z-0'}
                `}
              >
                <div className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                   <div className="lg:hidden flex items-center justify-between w-full px-5">
                     <span className="text-white font-bold text-base">{impact.title}</span>
                     <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                   </div>
                   <div className="hidden lg:flex flex-col items-center h-full py-6 w-full">
                     <div className="hidden lg:block lg:whitespace-nowrap lg:-rotate-180 flex-1 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-white font-bold text-base tracking-wide hover:tracking-widest transition-all duration-300">{impact.title}</span>
                     </div>
                   </div>
                </div>
                <div className={`w-full h-full flex flex-col lg:flex-row transition-opacity duration-700 delay-200 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
                  <div className="w-full lg:w-[40%] h-48 lg:h-full flex items-center justify-center relative p-6 bg-gradient-to-br from-[#111111] to-[#0A0A0A]">
                    <div className="absolute top-6 right-6 text-gray-800 dark:text-gray-50 font-mono font-bold text-lg z-20">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="w-full max-w-[160px] aspect-square flex items-center justify-center relative group z-10">
                       <Realistic3DIcon icon={impact.icon} className="w-24 h-24" iconSize="w-10 h-10" theme="brand" />
                    </div>
                  </div>
                  <div className="w-full lg:w-[60%] h-full flex flex-col justify-center p-6 lg:p-8 xl:p-10">
                    <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 tracking-tight font-display leading-tight">{impact.title}</h3>
                    <p className="text-gray-400 text-base font-light leading-relaxed mb-8 max-w-md">{impact.desc}</p>
                    <div className="mt-auto pt-2">
                      <SecondaryButton 
                        text="Get in Touch" 
                        link="/contact" 
                        theme="glass"
                      />
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
// 6. CDP LOGO TRUST SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPLogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.cdp-logo');
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
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Sovereignty</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Unified</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer View</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">AI-Ready</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Engines</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Customer Data Partnerships</span>
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale">
          <div className="cdp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Salesforce.com_logo.svg" alt="Salesforce" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cdp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/HubSpot_Logo.svg" alt="HubSpot" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cdp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://www.segment.com/favicon.ico" alt="Segment" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cdp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Cloud" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="cdp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CDP READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const CDPReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">System Start</span>
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display leading-[1.1]">Stop Letting Customer Data Sit Unused.<br/>Connect the Signals.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Your customers are already leaving signals across every touchpoint. Kangqore helps you connect those signals into one intelligence system — built for personalization, automation, AI, and growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Build My Customer Data Strategy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <SecondaryButton 
                text="Request Data Readiness Audit" 
                link="/contact" 
                theme="glass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function RefreshCw(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
}

function Heart(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
}

function Bot(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}
