import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, BarChart3, DollarSign, MousePointerClick, Gauge, Search, Users, Activity, Filter, Rocket, Database, Settings, CheckCircle2, Bot, PenTool, LayoutTemplate, Briefcase, RefreshCw, FileText } from 'lucide-react';
import Realistic3DIcon from '../../ui/Realistic3DIcon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CAMPAIGN PROBLEMS SECTION (Interactive Before/After)
// ═══════════════════════════════════════════════════════════════════════════════
export const CampaignProblemsSection = () => {
  const sectionRef = useRef(null);
  const [activeState, setActiveState] = useState('before');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveState(prev => prev === 'before' ? 'after' : 'before');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.camp-challenge');
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
      before: { title: 'No Clear Business Outcome', desc: 'Campaigns start with ads instead of measurable business goals.' },
      after: { title: 'Outcome-Led Strategy', desc: 'Campaigns mapped to real business goals, converting clicks to cash.' }
    },
    { 
      before: { title: 'Generic Audience Targeting', desc: 'Brands target demographics, not real buyer intent, pain points, and triggers.' },
      after: { title: 'Precision Targeting', desc: 'We align with real buyer intent, targeting specific problems and conversion triggers.' }
    },
    { 
      before: { title: 'Weak Messaging', desc: 'Campaigns explain the offer but fail to create belief, urgency, or trust.' },
      after: { title: 'Persuasive Copywriting', desc: 'Messages that compel action, driving immediate emotional and logical resonance.' }
    },
    { 
      before: { title: 'Broken Funnel Journey', desc: 'Ads, landing pages, forms, follow-ups, and retargeting are not connected.' },
      after: { title: 'Full-Funnel Orchestration', desc: 'A seamless, friction-free journey from the very first touchpoint to retention.' }
    },
    { 
      before: { title: 'Random Channel Selection', desc: 'Budgets are spread across platforms without clear logic or expected ROI.' },
      after: { title: 'Strategic Media Mix', desc: 'Channels selected based strictly on buyer intent and historical conversion data.' }
    },
    { 
      before: { title: 'Poor Tracking', desc: 'Teams cannot identify what worked, what failed, or where revenue came from.' },
      after: { title: 'Measurement Built-In', desc: 'Tracking and attribution are mapped before launch so every metric is visible.' }
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
              Why Most Campaigns <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Underperform.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">The wrong audience, weak messaging, and broken funnels burn spend before performance begins.</p>
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
              After: Kangqore
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
                className={`camp-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col ${isAfter ? 'shadow-[0_10px_40px_rgba(37,100,234,0.08)] -translate-y-1' : 'shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)]'}`}
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
// 2. WHY CAMPAIGN PLANNING MATTERS
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyCampaignPlanningMatters = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.camp-pillar');
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
              Campaigns Fail Before They <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Launch.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Most marketing campaigns fail because the strategy is weak before execution begins. Kangqore fixes this at the planning stage.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Clear Objective', icon: Target, desc: 'Defined primary and secondary KPIs.' },
              { title: 'Sharper Position', icon: Briefcase, desc: 'Messaging aligned to market gaps.' },
              { title: 'Budget Logic', icon: DollarSign, desc: 'Every rupee assigned with a purpose.' },
              { title: 'Faster Optimization', icon: Zap, desc: 'Tracking ready before launch.' }
            ].map((item, idx) => (
              <div key={idx} className="camp-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
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
// 3. CAMPAIGN FRAMEWORK (6 Phases)
// ═══════════════════════════════════════════════════════════════════════════════
export const CampaignFrameworkSection = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'Diagnose', desc: 'We understand the business objective, market challenge, audience, current funnel, and campaign opportunity.', includes: ['Business goal alignment', 'Audience profiling', 'Competitor review'] },
    { num: '02', title: 'Architect', desc: 'We design the campaign journey, positioning, channel mix, budget logic, creative system, and performance framework.', includes: ['Funnel design', 'Message framing', 'Media mix planning'] },
    { num: '03', title: 'Prepare', desc: 'We prepare assets, landing pages, tracking, CRM workflows, automation, and launch structure.', includes: ['Tracking setup', 'Creative blueprint', 'Landing page builds'] },
    { num: '04', title: 'Launch', desc: 'Campaigns go live with controlled spend, clean tracking, and structured monitoring.', includes: ['Controlled budget release', 'Quality assurance', 'Initial telemetry review'] },
    { num: '05', title: 'Optimize', desc: 'We test audiences, messages, creatives, offers, landing pages, and follow-up flows.', includes: ['A/B testing', 'Bid optimization', 'Friction removal'] },
    { num: '06', title: 'Scale', desc: 'We shift budget toward winners, reduce wasted spend, and build the next growth roadmap.', includes: ['Budget reallocation', 'Audience expansion', 'Post-campaign reporting'] }
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

        const phaseCards = rightRef.current.querySelectorAll('.camp-phase-card');
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
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">The Framework</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              From Goal to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Execution.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              We do not assume what works. We diagnose, architect, prepare, test, validate, and scale.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="camp-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              
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
// 4. WHAT KANGQORE DELIVERS
// ═══════════════════════════════════════════════════════════════════════════════
export const WhatKangqoreDeliversSection = () => {
  const sectionRef = useRef(null);
  
  const deliverables = [
    { id: 'CP-01', name: 'Campaign Strategy Document', category: 'STRATEGY' },
    { id: 'CP-02', name: 'Audience Persona Sheet', category: 'RESEARCH' },
    { id: 'CP-03', name: 'Competitor Campaign Analysis', category: 'BENCHMARK' },
    { id: 'CP-04', name: 'Campaign Messaging Framework', category: 'CREATIVE' },
    { id: 'CP-05', name: 'Channel Plan & Media Mix', category: 'DISTRIBUTION' },
    { id: 'CP-06', name: 'Full-Funnel Journey Map', category: 'ARCHITECTURE' },
    { id: 'CP-07', name: 'Creative Asset Inventory', category: 'ASSETS' },
    { id: 'CP-08', name: 'Budget Allocation Plan', category: 'FINANCE' },
    { id: 'CP-09', name: 'Phased Campaign Calendar', category: 'TIMELINE' },
    { id: 'CP-10', name: 'KPI Dashboard Blueprint', category: 'ANALYTICS' },
    { id: 'CP-11', name: 'Tracking & Attribution Plan', category: 'TELEMETRY' },
    { id: 'CP-12', name: 'Post-Launch Optimization Roadmap', category: 'GROWTH' }
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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white dark:bg-black dark:border-gray-800 relative overflow-hidden border-t border-gray-50">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2564ea 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1.5px] w-16 bg-brand-blue"></div>
            <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.3em]">System Output</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
            The Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Deliverables.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl leading-relaxed">
            We don't deliver ideas; we deliver documented growth systems. Every campaign component is engineered for clarity, accountability, and execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {deliverables.map((item, idx) => (
            <div key={idx} className="deliverable-node group relative">
              {/* Technical Marker */}
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] group-hover:bg-brand-blue/30 transition-colors duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-brand-blue transition-colors duration-500"></div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-mono font-bold text-brand-blue/40 group-hover:text-brand-blue transition-colors duration-300">
                    {item.id}
                  </span>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </h3>
                
                <div className="h-0.5 w-0 bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                
                <div className="mt-4 flex items-center gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">Ready for Execution</span>
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
export const BusinessImpactSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const impacts = [
    { title: 'Better Campaign ROI', desc: 'Spend is allocated with strategy, not guesswork.', icon: DollarSign },
    { title: 'Higher Conversion', desc: 'Every touchpoint is designed to move users forward.', icon: Target },
    { title: 'Lower Wasted Spend', desc: 'Weak channels and assumptions are reduced early.', icon: TrendingUp },
    { title: 'Faster Execution', desc: 'Teams know what to create and how to measure.', icon: Zap },
    { title: 'Stronger Positioning', desc: 'Campaigns communicate with clarity and trust.', icon: Shield }
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
            What Strong Campaign Planning <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Delivers.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Planning isn't just about spreadsheets and slides. It's about engineering measurable, scalable business impact before a single rupee is spent.
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
                {/* INACTIVE STATE */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                   {/* Mobile View */}
                   <div className="lg:hidden flex items-center justify-between w-full px-5">
                     <span className="text-white font-bold text-base">{impact.title}</span>
                     <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                   </div>
                   {/* Desktop View */}
                   <div className="hidden lg:flex flex-col items-center h-full py-6 w-full">
                     <div className="hidden lg:block lg:whitespace-nowrap lg:-rotate-180 flex-1 flex items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
                        <span className="text-white font-bold text-base tracking-wide hover:tracking-widest transition-all duration-300">
                          {impact.title}
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
                       <Realistic3DIcon 
                          icon={impact.icon} 
                          className="w-24 h-24" 
                          iconSize="w-10 h-10" 
                          theme="brand" 
                       />
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-[60%] h-full flex flex-col justify-center p-6 lg:p-8 xl:p-10">
                    <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 tracking-tight font-display leading-tight">
                      {impact.title}
                    </h3>
                    <p className="text-gray-400 text-base font-light leading-relaxed mb-8 max-w-md">
                      {impact.desc}
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
// 7. CAMPAIGN LOGO TRUST SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const CampaignLogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.camp-logo');
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
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Outcome-Led Strategies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Omni</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Channel Orchestration</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">$50M+</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ad Spend Architected</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">Campaign Tech Partnerships</span>
          <div className="h-[1.5px] w-16 bg-gray-100 dark:bg-[#0a0a0c]"></div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale">
          <div className="camp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Ads" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="camp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta Platforms" className="h-4 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="camp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg" alt="LinkedIn" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="camp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/HubSpot_Logo.svg" alt="HubSpot" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="camp-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Google_Analytics_4_logo.svg" alt="Google Analytics 4" className="h-7 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. CAMPAIGN READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const CampaignReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

          <div className="relative z-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">System Start</span>
              <div className="h-[1.5px] w-16 bg-white dark:bg-black/40"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Don’t Launch Campaigns Blind.<br/>Build the Blueprint First.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Before your brand spends on media, creatives, influencers, or content, let’s build the campaign architecture that defines what to say, who to target, where to run, how much to spend, what to test, and how to measure success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Build My Campaign Blueprint
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white font-semibold rounded-full hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm transition-all duration-300 border border-white/20">
                Request Free Campaign Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
