import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Zap, Bot, Target, BarChart3, Clock, CheckCircle2, 
  Rocket, Search, MessageCircle, PenTool, Users, Shield, Cpu, Settings, 
  Globe, Briefcase, Database, Activity, LayoutTemplate, FileText, Filter
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Realistic3DIcon from '../../ui/Realistic3DIcon';
import SecondaryButton from '../../ui/SecondaryButton';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AI PROBLEMS SECTION (Interactive Before/After)
// ═══════════════════════════════════════════════════════════════════════════════
export const AIProblemsSection = () => {
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
      const cards = sectionRef.current.querySelectorAll('.ai-challenge');
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
      before: { title: 'Fragmented Customer Data', desc: 'AI cannot personalize effectively when customer data is scattered across CRM, ads, website, app, email, and sales systems.' },
      after: { title: 'AI-Ready Customer Data', desc: 'Clean, connected, governed customer data for intelligence and activation.' }
    },
    { 
      before: { title: 'Random AI Tool Usage', desc: 'Teams use disconnected AI tools without a clear operating model, workflow, security standard, or objective.' },
      after: { title: 'Structured AI Operations', desc: 'A secure, enterprise-grade AI stack with strict brand, data, and operational safeguards.' }
    },
    { 
      before: { title: 'Weak Content Governance', desc: 'AI accelerates production, but brand consistency, accuracy, legal review, and quality are uncontrolled.' },
      after: { title: 'GenAI Content Workflows', desc: 'Faster content production with built-in brand, legal, and quality guardrails.' }
    },
    { 
      before: { title: 'Personalization Without Structure', desc: 'Brands want personalization at scale but lack segmentation, customer profiles, and activation logic.' },
      after: { title: 'Hyper-Personalization Engines', desc: 'Relevant experiences powered by unified data, segmentation, and AI decisioning.' }
    },
    { 
      before: { title: 'No AI Use-Case Prioritization', desc: 'Teams chase shiny AI ideas without ranking them by business impact, feasibility, risk, and effort.' },
      after: { title: 'Prioritized AI Execution', desc: 'A clear roadmap focusing only on use cases that deliver measurable ROI and speed.' }
    },
    { 
      before: { title: 'Compliance & Trust Risk', desc: 'AI adoption becomes risky when privacy, consent, data usage, and human oversight are ignored.' },
      after: { title: 'Responsible AI Governance', desc: 'Clear controls for privacy, security, brand consistency, and human oversight.' }
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-left max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">The Challenge</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
              Why Marketing AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Fails to Scale.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">AI can accelerate marketing, but only if the foundation is ready. Broken systems create noise, not growth.</p>
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
              Before: Random AI
            </button>
            <button 
              onClick={() => { setActiveState('after'); setIsAutoPlaying(false); }}
              className={`relative z-10 px-8 py-4 rounded-full text-sm font-bold transition-colors duration-300 w-48 lg:w-56 flex items-center justify-center gap-2 ${activeState === 'after' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${activeState === 'after' ? 'bg-brand-blue' : 'bg-gray-300'}`}></div>
              After: Structured AI
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
                className={`ai-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col ${isAfter ? 'shadow-[0_10px_40px_rgba(0,0,0,0.08)] -translate-y-1' : 'shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)]'}`}
              >
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
// 2. WHY AI READINESS MATTERS (Philosophy)
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyAIReadinessMatters = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.ai-pillar');
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
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">The Philosophy</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              AI Will Not Fix <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Broken Marketing.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              If customer data is fragmented, workflows are unclear, content governance is weak, and teams lack AI operating discipline, AI creates more noise instead of better growth. Kangqore helps businesses move from random AI experimentation to structured AI-enabled marketing performance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Faster Campaigns', icon: Zap, desc: 'Accelerate content, campaigns, and journeys.' },
              { title: 'AI-Ready Data', icon: Database, desc: 'Clean, connected, governed customer data.' },
              { title: 'Smarter Workflows', icon: Settings, desc: 'More efficient marketing operations.' },
              { title: 'Safer Governance', icon: Shield, desc: 'Scalable human-AI collaboration.' }
            ].map((item, idx) => (
              <div key={idx} className="ai-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
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
// 3. AI ROADMAP FRAMEWORK (4 Phases)
// ═══════════════════════════════════════════════════════════════════════════════
export const AIRoadmapFramework = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { 
      num: '01', 
      title: 'Diagnose', 
      desc: 'We assess current marketing workflows, data maturity, tools, AI usage, governance, and performance gaps.', 
      includes: ['Workflow assessment', 'Data maturity audit', 'Tool stack review', 'AI usage analysis', 'Performance gap mapping'] 
    },
    { 
      num: '02', 
      title: 'Prioritize', 
      desc: 'We rank AI use cases by business value, feasibility, risk, and implementation speed.', 
      includes: ['Business value scoring', 'Feasibility analysis', 'Risk assessment', 'Implementation speed', 'Use-case ranking'] 
    },
    { 
      num: '03', 
      title: 'Prepare', 
      desc: 'We define the data, workflow, content, martech, governance, and team readiness requirements.', 
      includes: ['Data strategy', 'Workflow blueprint', 'Martech integration', 'Governance design', 'Team readiness'] 
    },
    { 
      num: '04', 
      title: 'Pilot', 
      desc: 'We launch controlled AI pilots across content, campaigns, analytics, personalization, or automation.', 
      includes: ['Content pilot', 'Campaign testing', 'Analytics baseline', 'Personalization test', 'Automation setup'] 
    },
    { 
      num: '05', 
      title: 'Govern', 
      desc: 'We establish responsible AI guardrails, review flows, privacy controls, and brand standards.', 
      includes: ['AI guardrails', 'Review flows', 'Privacy controls', 'Brand standards', 'Compliance checks'] 
    },
    { 
      num: '06', 
      title: 'Scale', 
      desc: 'We operationalize the best-performing AI use cases into repeatable marketing workflows.', 
      includes: ['Workflow operationalization', 'Enterprise rollout', 'Continuous training', 'ROI tracking', 'Future-proofing'] 
    }
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

        const phaseCards = rightRef.current.querySelectorAll('.ai-phase-card');
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
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">The Framework</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              The AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Transformation.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              We do not just give you tools. We engineer a new way of working that maximizes human creativity through AI efficiency.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="ai-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
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
// 4. WHAT KANGQORE DELIVERS (Node-based System Output)
// ═══════════════════════════════════════════════════════════════════════════════
export const WhatAIDeliversSection = () => {
  const sectionRef = useRef(null);
  
  const deliverables = [
    { id: 'AI-01', name: 'Marketing AI Readiness Audit', category: 'DIAGNOSE' },
    { id: 'AI-02', name: 'AI Use-Case Opportunity Map', category: 'STRATEGY' },
    { id: 'AI-03', name: 'Customer Data Readiness Assessment', category: 'DATA' },
    { id: 'AI-04', name: 'Martech & CRM Integration Review', category: 'TECHNOLOGY' },
    { id: 'AI-05', name: 'GenAI Content Workflow Blueprint', category: 'CONTENT' },
    { id: 'AI-06', name: 'AI Personalization Roadmap', category: 'PERSONALIZATION' },
    { id: 'AI-07', name: 'Campaign AI Enablement Plan', category: 'CAMPAIGNS' },
    { id: 'AI-08', name: 'AI Analytics & Dashboard Plan', category: 'ANALYTICS' },
    { id: 'AI-09', name: 'Responsible AI Governance Framework', category: 'GOVERNANCE' },
    { id: 'AI-10', name: 'Team Operating Model', category: 'PEOPLE' },
    { id: 'AI-11', name: '30/60/90-Day AI Activation Roadmap', category: 'ROADMAP' }
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
            <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">System Output</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            AI Readiness <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Deliverables.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl leading-relaxed">
            We don't deliver experiments; we deliver engineered AI production systems. Every component is built for speed, safety, and scale.
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
                  <span className="text-[11px] font-mono font-bold text-brand-blue/40 group-hover:text-brand-blue transition-colors duration-300">{item.id}</span>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 dark:text-gray-400 transition-colors duration-300">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">{item.name}</h3>
                <div className="h-0.5 w-0 bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="mt-4 flex items-center gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">Ready for Implementation</span>
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
export const AIImpactSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const impacts = [
    { title: 'Faster Content', desc: 'Accelerate content production with GenAI workflows.', icon: Zap },
    { title: 'Smarter Campaigns', desc: 'Use AI to optimize media, targeting, and messaging.', icon: Rocket },
    { title: 'Better Personalization', desc: 'Deliver relevant experiences at scale using AI.', icon: Target },
    { title: 'Marketing Productivity', desc: 'Automate repetitive tasks to free your team.', icon: BarChart3 },
    { title: 'Decision Intelligence', desc: 'Turn complex data into actionable marketing insights.', icon: Search },
    { title: 'Safer AI Adoption', desc: 'Ensure brand safety, privacy, and compliance.', icon: Shield }
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
            <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">The Impact</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            What AI Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Delivers.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            AI isn't about replacing people. It's about engineering a production engine that removes every bottleneck between strategy and output.
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
                    <div className="w-full max-max-w-[160px] aspect-square flex items-center justify-center relative group z-10">
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
// 6. AI LOGO TRUST SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const AILogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.ai-logo');
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
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">AI-Ready</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Customer Data</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">GenAI</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Workflows</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Responsible</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">AI Governance</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">AI Tech Partnerships</span>
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale">
          <div className="ai-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="ai-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Anthropic_logo.svg" alt="Anthropic" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="ai-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Google Gemini" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="ai-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft Azure AI" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="ai-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS Bedrock" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. AI READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const AIReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="relative z-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">System Start</span>
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display leading-[1.1]">Don’t Add AI to Broken Marketing.<br/>Build the Foundation First.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              AI can accelerate growth only when your data, workflows, tools, people, and governance are ready. Let us help you assess your marketing operations and build the foundation for responsible AI scaling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Book My AI Readiness Audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <SecondaryButton 
                text="View AI Case Studies" 
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

// ═══════════════════════════════════════════════════════════════════════════════
// 8. AI USE CASES
// ═══════════════════════════════════════════════════════════════════════════════
export const AIUseCasesSection = () => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.use-case-item');
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }
  }, []);

  const useCases = [
    { title: 'Campaign Planning', icon: Briefcase, desc: 'Use AI to generate insights, structure briefs, and recommend media mixes.' },
    { title: 'Content Production', icon: PenTool, desc: 'Accelerate copywriting, design, and localization with controlled AI.' },
    { title: 'Hyper-Personalization', icon: Target, desc: 'Deliver 1:1 experiences using predictive models and dynamic content.' },
    { title: 'Predictive Lead Scoring', icon: Activity, desc: 'Identify high-intent accounts using machine learning on behavioral data.' },
    { title: 'Funnel Insights', icon: Search, desc: 'Automatically detect funnel leakage and campaign anomalies.' },
    { title: 'Conversational Marketing', icon: MessageCircle, desc: 'Deploy intelligent agents for contextual, real-time engagement.' },
    { title: 'Testing Intelligence', icon: LayoutTemplate, desc: 'Use AI to test variants and predict winning creative faster.' },
    { title: 'Agentic Experience', icon: Users, desc: 'Build AI agents that proactively solve customer problems.' }
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-white dark:bg-black relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2564ea 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">AI Activation</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter font-display leading-[0.95]">
              Marketing AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Use Cases.</span>
            </h2>
          </div>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-sm md:text-right pb-2">
            Built for modern Marketing, Sales, and CX teams.
          </p>
        </div>

        <div className="flex flex-col w-full relative group/list pb-10 pt-8">
          {useCases.map((uc, i) => (
            <div 
              key={i} 
              className="use-case-item group/item flex flex-col md:flex-row items-start md:items-center justify-between py-6 md:py-8 lg:py-10 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 hover:!blur-none group-hover/list:opacity-20 group-hover/list:blur-[2px]"
            >
              <div className="flex items-center gap-4 lg:gap-6 transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:scale-[1.02] group-hover/item:translate-x-4 origin-left">
                <div className="hidden md:flex w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 items-center justify-center opacity-0 -translate-x-8 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:bg-gradient-to-br group-hover/item:from-brand-blue/10 group-hover/item:to-cyan-400/10 shadow-inner">
                  <uc.icon className="w-6 h-6 lg:w-8 lg:h-8 text-brand-blue" />
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white transition-colors duration-500 group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-brand-blue group-hover/item:to-cyan-400 leading-none">
                  {uc.title}
                </h3>
              </div>
              <div className="hidden md:block mt-4 md:mt-0 w-full md:w-auto md:max-w-sm lg:max-w-md transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 translate-y-4 group-hover/item:opacity-100 group-hover/item:translate-y-0 text-right">
                <p className="text-base lg:text-lg text-gray-500 font-light leading-relaxed">
                  {uc.desc}
                </p>
              </div>
              <div className="block md:hidden mt-4 w-full text-left">
                <p className="text-base text-gray-500 font-light leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
