import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, Eye, BarChart3, DollarSign, MousePointerClick, Gauge, PenTool, Video, Search, Sparkles, Building2, ShoppingCart, Briefcase, Globe, GraduationCap, Heart, Landmark, Rocket, Users, LineChart, Plus } from 'lucide-react';
import { gsap } from 'gsap';
import SecondaryButton from '../../ui/SecondaryButton';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper component for word-by-word reveal without GSAP's premium SplitText
const SplitTextReveal = ({ text, className, wordClassName }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className={`inline-block pm-split-word opacity-0 translate-y-[50%] ${wordClassName || ''}`}>
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PERFORMANCE CHALLENGES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const PerformanceChallengesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.pm-challenge');
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const challenges = [
    { problem: '"We\'re spending money, but not seeing sales."', fix: 'Traffic without conversion architecture burns budget. We optimize the full journey — from ad click to checkout or lead close.' },
    { problem: '"Our agency sends reports, not results."', fix: 'We report what matters: CAC, CPL, ROAS, pipeline value, conversion rate, LTV, and scale opportunities.' },
    { problem: '"Leads are coming, but quality is poor."', fix: 'We refine targeting, messaging, audience intent signals, forms, funnels, and qualification layers.' },
    { problem: '"Campaigns started strong, then declined."', fix: 'We continuously refresh creatives, expand audiences, test offers, and prevent ad fatigue.' },
    { problem: '"We rely on one platform."', fix: 'We build diversified acquisition engines across Google, Meta, LinkedIn, YouTube, marketplaces, and remarketing channels.' },
    { problem: '"No one knows where conversions came from."', fix: 'We implement proper tracking, attribution models, pixels, server-side events, and analytics visibility.' }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 text-left max-w-4xl">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            Why Most Performance Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Fails.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c, idx) => (
            <div key={idx} className="pm-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col">
              
              {/* Subtle hover background tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.01] to-cyan-400/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Problem State (Fades back on hover) */}
              <div className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-300 bg-gray-300 group-hover:bg-transparent group-hover:border-gray-200 mt-2.5 transition-all duration-500 flex-shrink-0"></div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-snug italic group-hover:text-gray-400 transition-colors duration-500">
                    {c.problem}
                  </p>
                </div>
              </div>

              {/* Expanding Solution Divider */}
              <div className="relative z-10 w-8 h-[2px] bg-gray-100 dark:bg-[#0a0a0c] group-hover:bg-gradient-to-r group-hover:from-brand-blue group-hover:to-cyan-400 mb-6 group-hover:w-full transition-all duration-700 ease-out"></div>

              {/* Fix/Solution State (Pulls forward on hover) */}
              <div className="relative z-10 flex-1 transform translate-y-3 opacity-70 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                 <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-transparent group-hover:border-brand-blue group-hover:bg-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-shrink-0 scale-50 group-hover:scale-100 origin-center"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-sm group-hover:text-gray-900 dark:text-white transition-colors duration-500">
                    {c.fix}
                  </p>
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
// ═══════════════════════════════════════════════════════════════════════════════
// 3. 5-PHASE GROWTH METHOD
// ═══════════════════════════════════════════════════════════════════════════════
export const FivePhaseGrowthMethod = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'Audit & Opportunity Mapping', desc: 'We analyze current accounts, spend leakage, tracking gaps, audience quality, funnel friction, and competitor benchmarks.' },
    { num: '02', title: 'Strategy & Funnel Design', desc: 'We define channel mix, offers, landing pages, campaign structure, KPIs, and measurement architecture.' },
    { num: '03', title: 'Launch & Data Collection', desc: 'Campaigns go live with structured testing across creatives, audiences, keywords, placements, and conversion paths.' },
    { num: '04', title: 'Optimize & Scale', desc: 'We improve ROAS through bid refinement, audience expansion, creative iteration, CRO, and budget reallocation.' },
    { num: '05', title: 'Attribution & Reporting', desc: 'We connect spend to pipeline value, deploying dashboards that show exactly where revenue is generated.' }
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

        const phaseCards = rightRef.current.querySelectorAll('.pm-phase-card');
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
        <div className="lg:w-1/3">
          <div ref={leftRef} className="lg:h-[60vh] flex flex-col justify-center">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              Our Performance Marketing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Framework.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              A structured 5-phase methodology that transforms paid marketing from a campaign activity into a predictable revenue function.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="pm-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              
              {/* Bottom Sweep Progress Bar */}
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
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed group-hover:text-gray-900 dark:text-white transition-colors duration-500">
                    {phase.desc}
                  </p>
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
// 4. GROWTH POD — Team Structure
// ═══════════════════════════════════════════════════════════════════════════════
export const GrowthPodSection = () => {
  const scrollRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const team = [
    { tag: 'STRATEGY', role: 'Growth Strategist', focus: 'Owns acquisition roadmap, channel mix, and scaling priorities.', icon: Target, details: ['Channel mix strategy & budget allocation', 'Audience research & intent mapping', 'Competitive benchmarking', 'Growth roadmap & OKR alignment'], tools: ['Google Ads', 'Meta Business Suite', 'SEMrush'] },
    { tag: 'EXECUTION', role: 'Paid Media Specialist', focus: 'Manages campaigns, bids, budgets, audiences, and daily optimization.', icon: MousePointerClick, details: ['Campaign structure & launch', 'Bid strategy & budget pacing', 'Audience segmentation & testing', 'Keyword & placement management'], tools: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'] },
    { tag: 'CREATIVE', role: 'Copywriter', focus: 'Creates high-converting headlines, hooks, offers, CTAs, and ad messaging.', icon: PenTool, details: ['Ad copy A/B testing', 'Landing page messaging', 'Offer & hook development', 'Email & nurture sequences'], tools: ['Jasper', 'Google Docs', 'Unbounce'] },
    { tag: 'VISUALS', role: 'Designer / Video Editor', focus: 'Builds static ads, motion creatives, UGC formats, landing visuals, and test variants.', icon: Video, details: ['Static & carousel ad design', 'Motion graphics & Reels', 'UGC-style creative production', 'Landing page visual design'], tools: ['Figma', 'Adobe Suite', 'CapCut'] },
    { tag: 'OPTIMIZATION', role: 'CRO Specialist', focus: 'Improves landing pages, forms, UX flow, and conversion rate performance.', icon: Gauge, details: ['Landing page A/B testing', 'Form & checkout optimization', 'Heatmap & session analysis', 'UX friction removal'], tools: ['VWO', 'Hotjar', 'Unbounce'] },
    { tag: 'INTELLIGENCE', role: 'Analytics Lead', focus: 'Tracks attribution, dashboards, cohort performance, and business outcomes.', icon: BarChart3, details: ['Multi-touch attribution', 'Executive dashboard creation', 'Cohort & LTV analysis', 'Revenue pipeline tracking'], tools: ['GA4', 'Looker Studio', 'Segment'] }
  ];

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_50%)] pointer-events-none animate-[spin_30s_linear_infinite] origin-[45%_55%] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-10 font-display tracking-tight leading-[0.95]">
              The Growth Pod Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Every Campaign.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Not a solo media buyer. A full-stack performance team deployed to turn your media spend into a predictable revenue engine.
            </p>
          </div>
          <div className="flex gap-3 pb-2 relative z-[60]">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all text-white group">
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all text-white group">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 pl-[max(1rem,calc((100vw-80rem)/2+1rem))]">
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-16 scroll-smooth pr-[max(1rem,calc((100vw-80rem)/2+1rem))]">
          {team.map((member, idx) => {
            const isExpanded = expandedCard === idx;
            return (
              <div 
                key={idx} 
                className="pm-pod-card min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100vw-3*2rem)/3.5)] snap-start bg-[#1D1D1F] rounded-[3rem] p-10 h-[520px] flex flex-col relative group overflow-hidden border border-white/5 transition-all duration-500 cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                {/* Default View */}
                <div className={`flex flex-col h-full transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
                  <div className="mb-4">
                    <span className="text-[12px] font-bold text-gray-500 tracking-[0.05em]">{member.tag}</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">{member.role}</h3>
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-cyan-400/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <member.icon className="w-24 h-24 text-white/5 group-hover:text-brand-blue group-hover:scale-110 transition-all duration-700 relative z-10" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-[16px] text-gray-400 font-light leading-relaxed max-w-[90%] group-hover:text-gray-200 transition-colors duration-500">{member.focus}</p>
                  </div>
                </div>

                {/* Expanded Detail View */}
                <div className={`flex flex-col h-full transition-all duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0 p-10'}`}>
                  <div className="mb-3">
                    <span className="text-[12px] font-bold text-brand-blue tracking-[0.05em]">{member.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6 leading-tight tracking-tight">{member.role}</h3>
                  <div className="space-y-2.5 mb-6 flex-1">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Core Responsibilities</p>
                    {member.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0"></div>
                        <span className="text-[14px] text-gray-300 font-light">{d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Primary Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {member.tools.map((t, i) => (
                        <span key={i} className="text-[12px] px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/5 text-gray-400 border border-white/10 font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plus/Close Toggle Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : idx); }}
                  className={`absolute bottom-8 right-8 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg z-20 ${isExpanded ? 'bg-brand-blue rotate-45 scale-110' : 'bg-white dark:bg-gray-900 dark:border-gray-800 hover:scale-110'}`}
                >
                  <Plus className={`w-6 h-6 ${isExpanded ? 'text-white' : 'text-black'}`} />
                </button>

                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. KPI & REPORTING LAYER
// ═══════════════════════════════════════════════════════════════════════════════
export const KPIReportingSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.pm-kpi-card');
      gsap.fromTo(items,
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // CountUp animation
      const numberElements = sectionRef.current.querySelectorAll('.pm-countup');
      numberElements.forEach((el) => {
        const targetValue = parseFloat(el.getAttribute('data-target'));
        gsap.fromTo(el, 
          { innerHTML: 0 }, 
          {
            innerHTML: targetValue,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 0.1 },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true
            }
          }
        );
      });
    }
  }, []);

  const kpis = [
    { category: 'Acquisition', metrics: ['CPC (Cost Per Click)', 'CPM (Cost Per Mille)', 'CTR (Click-Through Rate)', 'CPA (Cost Per Acquisition)', 'CPL (Cost Per Lead)', 'CAC (Customer Acquisition Cost)'], icon: MousePointerClick, color: 'from-[#2564ea] to-[#4ab6d4]', benchmarkPrefix: 'Avg. 25–', benchmarkNum: 40, benchmarkSuffix: '% CAC reduction in first 90 days', source: 'Google Ads Benchmark Report, 2025' },
    { category: 'Funnel', metrics: ['Landing Page CVR', 'Form Completion Rate', 'Add-to-Cart Velocity', 'Checkout Success Rate'], icon: Layers, color: 'from-[#2564ea] to-[#4ab6d4]', benchmarkPrefix: 'Target 3–', benchmarkNum: 5, benchmarkSuffix: '% landing page CVR across industries', source: 'Unbounce Conversion Benchmark, 2025' },
    { category: 'Revenue', metrics: ['ROAS (Ad Spend Return)', 'MER (Marketing Efficiency)', 'Revenue / Contribution', 'Sales Pipeline Value', 'Customer LTV (Lifetime)'], icon: DollarSign, color: 'from-[#2564ea] to-[#4ab6d4]', benchmarkPrefix: 'Median 3–', benchmarkNum: 5, benchmarkSuffix: 'x ROAS across paid channels', source: 'Meta Performance Insights, 2024' },
    { category: 'Growth', metrics: ['Scale Readiness Index', 'Audience Saturation Rate', 'Repeat Purchase Velocity', 'Retention Cohort Trends'], icon: TrendingUp, color: 'from-[#2564ea] to-[#4ab6d4]', benchmarkPrefix: 'Avg. 18–', benchmarkNum: 30, benchmarkSuffix: '% repeat purchase rate for optimized brands', source: 'Forrester Commerce Research, 2025' }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      {/* Background Ambient Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,100,234,0.02),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-20 text-left max-w-4xl">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">Measure.</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl">
            Every campaign is measured against acquisition, funnel, revenue, and growth metrics. No vanity dashboards — only business outcomes.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="pm-kpi-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] p-10 transition-all duration-500 group flex flex-col h-full relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-3">
              
              {/* Internal Glow Effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-brand-blue/10 to-cyan-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Icon & Status */}
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <kpi.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 group-hover:bg-brand-blue/5 transition-colors">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-brand-blue`}></span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 tracking-wider group-hover:text-brand-blue transition-colors uppercase">Live</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight flex items-center justify-between">
                {kpi.category}
                <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </h3>

              {/* Metrics List with Hover Interaction */}
              <div className="space-y-3 flex-grow">
                {kpi.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                    <div className="relative flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/item:bg-brand-blue transition-colors duration-300`}></div>
                      <div className="absolute w-4 h-[1px] bg-brand-blue scale-x-0 group-hover/item:scale-x-100 origin-left transition-transform duration-300 -left-1 opacity-0 group-hover/item:opacity-30"></div>
                    </div>
                    <span className="text-[14px] text-gray-500 font-medium tracking-tight group-hover/item:text-gray-900 dark:text-white group-hover/item:translate-x-1 transition-all duration-300">{m}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 relative">
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                <p className="text-sm font-light text-gray-500 mb-2">Primary Benchmark</p>
                <div className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {kpi.benchmarkPrefix}<span className="pm-countup text-brand-blue tabular-nums" data-target={kpi.benchmarkNum}>0</span>{kpi.benchmarkSuffix}
                </div>
                <p className="text-[11px] text-gray-400 mt-4 font-medium tracking-wide flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  {kpi.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// 6. BUSINESS NEEDS STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const BusinessNeedsSection = () => {
  const sectionRef = useRef(null);
  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.pm-biz');
      gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
    }
  }, []);
  const needs = [
    { name: 'Lead Generation', desc: 'Qualified leads for B2B, real estate, education, healthcare, services, and enterprise sales teams.', icon: Users, result: '40% lower CPL', resultNote: 'vs. industry benchmarks' },
    { name: 'Ecommerce Growth', desc: 'Sales acceleration for DTC brands, catalog scaling, product launches, seasonal pushes, and repeat purchase flows.', icon: ShoppingCart, result: '3.5x avg. ROAS', resultNote: 'across catalog campaigns' },
    { name: 'App Installs', desc: 'User acquisition campaigns for mobile apps with retention-aware optimization and post-install event tracking.', icon: Rocket, result: '2x install velocity', resultNote: 'with quality retention' },
    { name: 'Brand Demand Generation', desc: 'Awareness campaigns that create future pipeline, lower acquisition costs, and build category authority over time.', icon: Sparkles, result: '25% CAC reduction', resultNote: 'over 6-month cycles' },
    { name: 'Local Business Growth', desc: 'Calls, walk-ins, WhatsApp leads, map visibility, and hyperlocal conversions for multi-location businesses.', icon: Globe, result: '5x local leads', resultNote: 'vs. organic-only baseline' }
  ];
  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-blue/[0.03] to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-5/12 lg:sticky lg:top-32">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">Performance by <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Business Need.</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">We align media spend to your specific business goals — not generic campaign templates. Every model is tuned for your economics.</p>
            <div className="hidden lg:flex items-center gap-3 text-sm text-gray-400">
              <div className="w-8 h-[1px] bg-gradient-to-r from-brand-blue to-cyan-400"></div>
              <span className="font-medium tracking-wide">Hover each card for performance benchmarks</span>
            </div>
          </div>
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {needs.map((need, idx) => (
              <div key={idx} className={`pm-biz bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] ${idx === needs.length - 1 ? 'sm:col-span-2' : ''}`}>
                <div className="absolute left-0 bottom-0 h-1 w-0 bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-300">
                    <need.icon className="w-7 h-7 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{need.name}</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{need.desc}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{need.result}</p>
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">{need.resultNote}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-blue/5 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-4 h-4 text-brand-blue" />
                  </div>
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
// 8. LOGO TRUST STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const LogoTrustSection = () => {
  const sectionRef = useRef(null);
  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.pm-logo');
      gsap.fromTo(logos, { opacity: 0, y: 10 }, { opacity: 0.4, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', once: true } });
    }
  }, []);
  const logos = [
    { name: 'Google Ads', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg' },
    { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'LinkedIn', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg' },
    { name: 'Amazon Ads', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
    { name: 'TikTok', url: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg' }
  ];
  return (
    <div ref={sectionRef} className="py-16 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-24 mb-16 border-b border-gray-100 pb-12">
          <div className="text-center"><p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">$50M+</p><p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Managed Spend</p></div>
          <div className="text-center"><p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">4.2x</p><p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Average ROAS</p></div>
          <div className="text-center"><p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">12+</p><p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Growth Industries</p></div>
        </div>
        <p className="text-center text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">Institutional Ad Platform Partnerships</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 lg:gap-x-20">
          {logos.map((logo, idx) => (<div key={idx} className="pm-logo grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer"><img src={logo.url} alt={logo.name} className="h-6 lg:h-8 w-auto object-contain" /></div>))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. READINESS MAGNET CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const PerformanceReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20"><LineChart className="w-8 h-8 text-white" /></div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Ready to Turn Media Spend into Measurable Revenue?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">Let's uncover spend inefficiencies, capture real demand, and architect a <strong className="text-white">scalable performance system that drives qualified growth, stronger ROI, and measurable business outcomes</strong>.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">Book a Performance Strategy Call<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
              <SecondaryButton 
                text="Request Free Audit" 
                link="/contact" 
                theme="glass"
              />
            </div>
            <p className="mt-8 text-sm text-white/60 font-light">Average agencies optimize campaigns. Kangqore engineers revenue systems.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
