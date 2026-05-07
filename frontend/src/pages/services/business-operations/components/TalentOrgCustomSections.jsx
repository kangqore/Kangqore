import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Layers, Activity, ChevronDown, Target, Zap, BrainCircuit, TrendingUp, Shield, Heart, Lightbulb, GraduationCap, Network, Briefcase, Settings, BarChart3, Eye, Sparkles, Building2, Globe, Bot, CheckCircle2, Rocket, Code2, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PHILOSOPHY BACKGROUND — Animated Neural / Org Network Pattern
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentPhilosophyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.to-phi-path', 
        { strokeDashoffset: 1000, opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.15, duration: 4, stagger: 0.3, ease: 'power1.inOut' }
      );
      gsap.to('.to-phi-node', {
        opacity: 0.4,
        scale: 1.4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.6, from: 'random' }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
      <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
        {/* Neural org network */}
        <path className="to-phi-path" d="M100,200 Q300,100 500,200 T900,200" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="to-phi-path" d="M200,400 Q400,300 600,400 T1000,400" stroke="#4ab6d4" strokeWidth="0.5" strokeDasharray="1000" />
        <path className="to-phi-path" d="M150,600 Q350,500 550,600 T950,600" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />
        
        {/* Vertical connections */}
        <path className="to-phi-path" d="M500,200 L500,400 L600,400" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="1000" />
        <path className="to-phi-path" d="M600,400 L600,600 L700,600" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="1000" />
        
        {/* People nodes */}
        {[100, 300, 500, 700, 900].map(x => (
          <circle key={`n1-${x}`} className="to-phi-node" cx={x} cy="200" r="3" fill="#2564ea" />
        ))}
        {[200, 400, 600, 800, 1000].map(x => (
          <circle key={`n2-${x}`} className="to-phi-node" cx={x} cy="400" r="3" fill="#4ab6d4" />
        ))}
        {[150, 350, 550, 750, 950].map(x => (
          <circle key={`n3-${x}`} className="to-phi-node" cx={x} cy="600" r="3" fill="#2564ea" />
        ))}
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY T&O SECTION — Editorial Quote + Problem Framing + Business-Ready SVG
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.to-why-item');
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
              <div className="relative rounded-[3rem] overflow-hidden aspect-square border-4 border-gray-50 shadow-2xl">
                 <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=format&fit=crop&w=1260&q=80" alt="Talent & Organization" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
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
                  Your organization isn't broken. It's outdated. The question is whether your talent architecture can <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">evolve faster than the market.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Why T&O Section */}
      <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden" ref={sectionRef}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,100,234,0.03)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="to-why-item">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                <Search className="w-4 h-4 text-brand-blue" />
                <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">The Opportunity</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                From HR Function to{' '}<br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Strategic Intelligence.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                "How do I reduce attrition in my engineering org by Q3?" Organizations that treat talent as a cost center will lose to those that treat it as an innovation engine. We replace reactive HR firefighting with structural talent engineering.
              </p>
            </div>
            <div className="space-y-8 to-why-item">
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-gray-100">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Foundation</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We don't do theory. We instrument capability frameworks that directly tie workforce output to P&L performance, eliminating consultative fluff and replacing it with hard data.
                </p>
              </div>
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-gray-100">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #4ab6d4 100%)' }}></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-brand-blue uppercase">The Challenge</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Slow, layered decision matrices. Severe capability gaps in engineering and AI roles. Compliance-heavy HR preventing rapid talent deployment. The result isn't just friction—it's catastrophic loss of market share.
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
// 3. PROOF & OUTCOMES — Replaces old Value Deliver
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentProofOutcomes = () => {
  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
          <Activity className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Proven Results</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-12 font-display tracking-tight leading-[0.95]">
          Measurable Organization{' '}<br />
          <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Performance.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { metric: '34% ↓', label: 'Attrition Reduced', client: 'Global FinTech Leader', desc: 'Resolved critical digital engineering talent flight through targeted skills intelligence and dynamic career pathing within 6 months.' },
            { metric: '2.5x', label: 'Speed to Competency', client: 'Tier-1 Retailer', desc: 'Accelerated frontline onboarding and upskilling using GenAI-driven learning pathways, impacting 120,000+ employees.' },
            { metric: '40% ↑', label: 'Decision Velocity', client: 'SaaS Unicorn', desc: 'Restructured reporting lines and embedded agile operating models to cut bureaucratic layers and accelerate market response.' }
          ].map((out, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-brand-gradient mb-2">{out.metric}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-6">{out.label}</div>
              <div className="text-sm font-bold tracking-widest text-brand-blue uppercase mb-3">{out.client}</div>
              <p className="text-gray-500 leading-relaxed font-light">{out.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3.5 READINESS MAGNET — Mid-Page CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentReadinessMagnet = () => {
  return (
    <section className="py-24 bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          {/* Background Image with parallax */}
          <div 
            className="absolute -inset-20 z-0" 
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/3182768/pexels-photo-3182768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
          
          {/* Content */}
          <div className="relative z-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Is Your Organization AI-Ready?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Don't guess. Download the <strong className="text-white">Kangqore AI Workforce Maturity Scorecard</strong> to assess your capabilities across leadership, skilling, and culture.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Get Your Free Assessment Toolkit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DIAMOND CoE — Why Kangqore (3D Diamond + Differentiators)
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentDiamondCoESection = () => {
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
        @keyframes to-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes to-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes to-dot-ping {
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
                Our <strong className="text-brand-blue">Talent & Organization CoE</strong> combines behavioral science, organizational design, AI-powered analytics, and technology-enabled learning into one integrated practice that delivers measurable impact.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace reactive HR with "architect-and-govern." By unifying workforce strategy, leadership pipelines, culture intelligence, and AI-native talent operations, we ensure your organization is built on absolute engineering confidence.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="to-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#to-blue-grad)" style={{ animation: 'to-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#to-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'to-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#to-blue-grad)" style={{ animation: 'to-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#to-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'to-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#to-blue-grad)" style={{ animation: 'to-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#to-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'to-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#to-blue-grad)" style={{ animation: 'to-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#to-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'to-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'to-diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#1e40af] to-[#2564ea]" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Talent<br/>Strategy</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#2564ea] to-[#3b82f6]" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">AI &<br/>Analytics</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9]" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Org<br/>Design</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-[#0ea5e9] to-[#4ab6d4]" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[15px]">Culture<br/>Intelligence</div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Workforce Analytics •</li><li>Succession Planning •</li><li>Skill Gap Mapping •</li><li>Demand Forecasting •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Predictive Attrition</li><li>• GenAI Upskilling</li><li>• People Analytics</li><li>• Agentic HR Automation</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Agile Structures •</li><li>Decision Authority •</li><li>Shared Services •</li><li>CoE Models •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Sentiment Analytics</li><li>• Behavioral Design</li><li>• Change Readiness</li><li>• DEI Integration</li></ul></div>
              </div>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Talent Strategy', items: ['Workforce Analytics', 'Succession Planning'], gradient: 'from-[#1e40af] to-[#2564ea]' },
                { title: 'AI & Analytics', items: ['Predictive Attrition', 'GenAI Upskilling'], gradient: 'from-[#2564ea] to-[#3b82f6]' },
                { title: 'Org Design', items: ['Agile Structures', 'Decision Authority'], gradient: 'from-[#3b82f6] to-[#0ea5e9]' },
                { title: 'Culture Intelligence', items: ['Sentiment Analytics', 'DEI Integration'], gradient: 'from-[#0ea5e9] to-[#4ab6d4]' }
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
              { num: 1, title: 'People-Science Foundation', text: 'We ground every engagement in behavioral science, organizational psychology, and workforce analytics — not generic HR best practices. Every recommendation is evidence-based.' },
              { num: 2, title: 'AI-Native Talent Systems', text: 'Modern talent management requires AI-powered platforms — from GenAI screening to predictive attrition and agentic HR automation deployed at enterprise scale.' },
              { num: 3, title: 'Leadership at Every Level', text: 'We build leadership capacity systemically — from first-time managers to C-suite succession — with structured development, real-time feedback loops, and evidence-based coaching.' },
              { num: 4, title: 'Culture as Operating System', text: 'We treat culture as a measurable, designable system — using sentiment data, behavioral nudges, organizational network analysis, and evidence-based change methodology.' },
              { num: 5, title: 'Agile Organization Design', text: 'We restructure hierarchies and decision-making authority to create organizations that are flatter, faster, and more responsive — delivering 30–50% faster decision-making cycles.' },
              { num: 6, title: 'Global Delivery Discipline', text: 'From workforce planning in Mumbai to leadership programs in New York — we deliver with consistency, cultural sensitivity, and measurable impact across geographies.' }
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
// 5. DELIVERY MODEL — 4-Phase Timeline (Diagnose → Design → Deploy → Scale)
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentDeliveryModel = () => {
  const journeyRef = useRef(null);
  
  useEffect(() => {
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
      });
      const pathEl = journeyRef.current.querySelector('.to-journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }
      const nodes = journeyRef.current.querySelectorAll('.to-journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
      });
      const cards = journeyRef.current.querySelectorAll('.to-journey-card');
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
    }
  }, []);

  const phases = [
    { phase: 'DIAGNOSE', icon: <Search className="w-7 h-7" />, title: 'Assess & Map', desc: 'Deep analysis of your organization, workforce, culture, leadership pipeline readiness, skills gaps, and change capacity.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400' },
    { phase: 'DESIGN', icon: <Layers className="w-7 h-7" />, title: 'Architect the Model', desc: 'Build future-ready structures, roles, strategies, target operating models, capability frameworks, and learning architecture.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400' },
    { phase: 'DEPLOY', icon: <Zap className="w-7 h-7" />, title: 'Execute & Enable', desc: 'Execute transformation programs across teams — platforms, leadership programs, culture initiatives, AI enablement, and analytics.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue' },
    { phase: 'SCALE', icon: <Activity className="w-7 h-7" />, title: 'Optimize & Grow', desc: 'Continuously optimize with data, AI, and feedback loops. Scale successful initiatives across the enterprise with measurable impact.', gradient: 'from-cyan-400 to-cyan-600', ring: 'border-cyan-400' }
  ];

  return (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <style dangerouslySetInnerHTML={{__html: `
          .to-journey-curve-glow { filter: blur(3px); }
          @keyframes to-glow-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .to-journey-curve-glow { animation: to-glow-pulse 3s ease-in-out infinite; }
        `}} />
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="w-full lg:w-[55%] relative">
             <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                 <defs>
                  <linearGradient id="to-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="33%" stopColor="#3b82f6" />
                    <stop offset="66%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                  <filter id="to-journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <path className="to-journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#to-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#to-journey-glow-v)" opacity="0.3" />
                <path className="to-journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#to-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                {[125, 375, 625, 875].map((cy, i) => (
                  <g key={i} className="to-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#to-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#to-journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#to-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                  </g>
                ))}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-to-${i}`} className="to-journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>
            <div className="space-y-6 lg:pl-[55px]">
              {phases.map((item, idx) => (
                <div key={idx} className="to-journey-card group">
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
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
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Execution Framework</span>
                </div>
               <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                 Our T&O <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Execution Framework.</span>
               </h2>
               <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
                 At Kangqore, talent transformation is structured as a phased, evidence-based model — designed to build lasting organizational capability, not one-time interventions.
               </p>
               <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div><div className="text-2xl font-bold text-gray-900 dark:text-white">04</div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Cycle</div><div className="text-2xl font-bold text-gray-900 dark:text-white">Agile</div></div>
                  <div><div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold mb-2">Impact</div><div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">MAX</div></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. EXECUTION ECOSYSTEM — Related Expertise + Orbit Visual
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentExecutionEcosystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.to-orbit-ring-1', { rotation: 360, duration: 40, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.to-orbit-ring-2', { rotation: -360, duration: 55, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.to-orbit-ring-3', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      gsap.to('.to-orbit-node-1', { rotation: -360, duration: 40, ease: 'none', repeat: -1 });
      gsap.to('.to-orbit-node-2', { rotation: 360, duration: 55, ease: 'none', repeat: -1 });
      gsap.to('.to-orbit-node-3', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });
      gsap.fromTo('.to-eco-enter', { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 overflow-hidden relative border-t border-gray-100" ref={containerRef}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes to-orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .to-orbit-path { animation: to-orbit-glow-pulse 4s ease-in-out infinite; }
      `}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl font-light">
              Extend your Talent & Organization initiative into a full-scale transformation ecosystem. Kangqore provides the end-to-end engineering muscle to build, modernize, and scale.
            </p>
            <div className="space-y-4">
               {[
                 { name: 'Global Capability Centers', link: '/services/business-operations/global-capability-centers', icon: <Building2 className="w-5 h-5" />, desc: 'End-to-end GCC setup, operations, and talent ecosystem integration.' },
                 { name: 'Learning & Development', link: '/services/business-operations/learning-development', icon: <GraduationCap className="w-5 h-5" />, desc: 'AI-powered learning platforms, skills intelligence, and adaptive ecosystems.' },
                 { name: 'Finance & Risk Management', link: '/services/business-operations/finance-risk-management', icon: <Shield className="w-5 h-5" />, desc: 'Workforce financial planning, compliance frameworks, and risk-aware talent strategy.' }
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
          <div className="lg:w-1/2 flex items-center justify-center pointer-events-none">
             <div className="relative aspect-square w-full max-w-[550px] flex items-center justify-center">
                 {/* Diagnostic Overlay */}
                 <div className="absolute top-4 left-4 p-3 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                    <div className="flex justify-between gap-4"><span>build_id:</span> <span className="text-brand-blue">#KG_ECO_SYS</span></div>
                    <div className="flex justify-between gap-4"><span>pipeline:</span> <span className="text-emerald-500">OPTIMIZED</span></div>
                  </div>

                 {/* Center Node: T&O Core */}
                 <div className="to-eco-enter absolute z-20 w-40 h-40 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex items-center justify-center border border-gray-100 group">
                    <div className="absolute inset-2 bg-brand-gradient rounded-[2rem] opacity-5"></div>
                    <div className="relative"><Users className="w-16 h-16 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" /></div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-xl border border-white/10"><CheckCircle2 className="w-5 h-5" /></div>
                    <span className="absolute -bottom-8 font-mono text-[10px] font-bold tracking-[0.2em] text-gray-400">T&O_CORE</span>
                 </div>

                 {/* Ring 1 (Inner) */}
                 <div className="absolute w-[260px] h-[260px] border-[1.5px] border-dashed border-brand-blue/20 rounded-full to-orbit-ring-1 to-eco-enter">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="to-orbit-node-1 flex flex-col items-center">
                            <div className="w-14 h-14 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 mb-2">
                               <Building2 className="w-6 h-6 text-brand-blue"/>
                            </div>
                            <span className="font-mono text-[9px] font-bold tracking-widest text-gray-500 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm px-2 rounded-full py-0.5 shadow-sm">GCC_OPS</span>
                        </div>
                    </div>
                 </div>

                 {/* Ring 2 (Middle) */}
                 <div className="absolute w-[380px] h-[380px] border-[1.5px] border-dashed border-emerald-400/30 rounded-full to-orbit-ring-2 to-eco-enter">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <div className="to-orbit-node-2 flex flex-col items-center">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-white/10 mb-2">
                               <GraduationCap className="w-6 h-6 text-emerald-400"/>
                            </div>
                            <span className="font-mono text-[9px] font-bold tracking-widest text-gray-500 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm px-2 rounded-full py-0.5 shadow-sm">L&D_SYS</span>
                        </div>
                    </div>
                 </div>

                 {/* Ring 3 (Outer) */}
                 <div className="absolute w-[500px] h-[500px] border-[1.5px] border-dashed border-cyan-400/30 rounded-full to-orbit-ring-3 to-eco-enter">
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                        <div className="to-orbit-node-3 flex flex-col items-center">
                            <div className="w-14 h-14 bg-brand-gradient rounded-2xl shadow-xl flex items-center justify-center border border-white/10 mb-2">
                               <Shield className="w-6 h-6 text-white"/>
                            </div>
                            <span className="font-mono text-[9px] font-bold tracking-widest text-gray-500 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm px-2 rounded-full py-0.5 shadow-sm">FIN_RISK</span>
                        </div>
                    </div>
                 </div>

             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FUTURE-READY — GenAI & Agentic AI Focus
// ═══════════════════════════════════════════════════════════════════════════════
export const TalentFutureReadySection = () => {
    const [openIdx, setOpenIdx] = useState(0);
    const requirements = [
        { title: 'GenAI-Powered Skills Intelligence', desc: 'Real-time visibility into workforce capabilities, skill gaps, and learning trajectories — powered by GenAI. Not annual performance reviews, not static competency matrices. Dynamic, AI-driven skills intelligence that adapts as your business evolves.' },
        { title: 'Agentic AI for HR Operations', desc: 'Agentic AI is reshaping work across industries. Autonomous HR agents for screening, scheduling, onboarding, performance analysis, and employee support — deployed at enterprise scale to free your HR team for strategic work.' },
        { title: 'Human + AI Co-Intelligence', desc: 'Humans and AI must learn and adapt together through continuous co-learning. We build the frameworks for human-AI collaboration that unlock hidden value, boost creativity, and transform work design — not just automate tasks.' },
        { title: 'Adaptive Learning Architecture', desc: 'One-size-fits-all training programs fail. Only 5% of organizations train at scale. We build AI-powered learning ecosystems with personalized development paths, content curation, and integration with daily workflows — training that adapts to the learner.' }
    ];

    return (
        <section className="py-24 lg:py-32 bg-white dark:bg-black dark:border-gray-800 relative overflow-hidden border-t border-gray-100">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-brand-blue" />
                            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Future-Ready</span>
                        </div>
                        <h2 className="text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                            Built for the{' '}<br />
                            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">AI Era.</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
                            94% of workers are ready to learn GenAI skills — but only 5% of organizations provide training at scale. We close that gap with future-ready expertise across four critical domains.
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

// Keeping WhyAPISection export for backwards compat
export const WhyAPISection = TalentWhySection;
