import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, Eye, BarChart3, DollarSign, MousePointerClick, Gauge, PenTool, Video, Search, Sparkles, Building2, ShoppingCart, Briefcase, Globe, GraduationCap, Heart, Landmark, Rocket, Users, LineChart, Plus, CheckCircle2, MessageCircle, Megaphone, Activity, Bot } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SecondaryButton from '../../../../components/ui/SecondaryButton';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SEO CHALLENGES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const SEOChallengesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.seo-challenge');
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const challenges = [
    { problem: '"Rankings Without Revenue"', fix: 'Traffic increases, but pipeline and sales remain flat. We align keywords with commercial intent.' },
    { problem: '"Weak Technical Foundations"', fix: 'Slow speed, crawl issues, and indexing errors limit growth. We fix the underlying architecture.' },
    { problem: '"Content Without Strategy"', fix: 'Blogs are published, but they don\'t target intent or build authority. We create semantic clusters.' },
    { problem: '"No Conversion Thinking"', fix: 'Visitors arrive, but pages fail to convert attention into action. We engineer for the full funnel.' },
    { problem: '"Vanity Reporting"', fix: 'Reports focus on impressions and rankings, not business impact. We measure pipeline and revenue.' },
    { problem: '"Slow Agency Execution"', fix: 'Opportunities are identified but never implemented fast enough. We operate with engineering speed.' }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 text-left max-w-4xl">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            Why Most SEO Campaigns <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Underperform.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c, idx) => (
            <div key={idx} className="seo-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col">
              
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.01] to-cyan-400/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full border-[1.5px] border-gray-300 bg-gray-300 group-hover:bg-transparent group-hover:border-gray-200 mt-2.5 transition-all duration-500 flex-shrink-0"></div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-snug italic group-hover:text-gray-400 transition-colors duration-500">
                    {c.problem}
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-8 h-[2px] bg-gray-100 dark:bg-[#0a0a0c] group-hover:bg-gradient-to-r group-hover:from-brand-blue group-hover:to-cyan-400 mb-6 group-hover:w-full transition-all duration-700 ease-out"></div>

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
// 2. WHY SEO MATTERS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const WhySEOMattersSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.seo-pillar');
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
              Growth Should Compound, Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Reset Every Month.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Paid campaigns can create momentum, but once spend stops, traffic often disappears. Organic growth builds durable visibility, trust, and recurring demand that continues to deliver value over time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Visibility', icon: Target, desc: 'Higher rankings for commercial keywords.' },
              { title: 'Consistency', icon: Activity, desc: 'Consistent, compounding inbound traffic.' },
              { title: 'Efficiency', icon: DollarSign, desc: 'Lower acquisition cost over time.' },
              { title: 'Credibility', icon: Shield, desc: 'Stronger brand credibility and trust.' },
              { title: 'Quality', icon: Users, desc: 'Better lead quality and intent matching.' },
              { title: 'Equity', icon: TrendingUp, desc: 'Long-term growth equity for your brand.' }
            ].map((item, idx) => (
              <div key={idx} className="seo-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
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
// 3. 4-PHASE GROWTH METHOD
// ═══════════════════════════════════════════════════════════════════════════════
export const FourPhaseGrowthMethod = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'Audit & Opportunity Discovery', desc: 'We assess your website, competitors, search demand, content gaps, and technical barriers to identify the highest-value growth opportunities.', includes: ['Technical SEO audit', 'Competitor analysis', 'Keyword opportunity mapping', 'Content gap analysis', 'UX & conversion review'] },
    { num: '02', title: 'Strategy & Architecture', desc: 'We create a custom roadmap aligned with your business goals, buyer journey, and market realities.', includes: ['Keyword strategy', 'Page prioritization', 'Content cluster planning', 'Information architecture', 'Internal linking model'] },
    { num: '03', title: 'Execution & Optimization', desc: 'We implement improvements across technical SEO, content, on-page signals, and conversion performance.', includes: ['Metadata optimization', 'Landing page improvements', 'Schema markup', 'Technical fixes', 'Content deployment'] },
    { num: '04', title: 'Scale & Compound Growth', desc: 'Once momentum starts, we expand keyword ownership, improve conversion efficiency, and strengthen authority.', includes: ['Expansion campaigns', 'Authority building', 'Performance iteration', 'Content scaling', 'Conversion refinement'] }
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

        const phaseCards = rightRef.current.querySelectorAll('.seo-phase-card');
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
          <div className="sticky top-[20vh] lg:h-[60vh] flex flex-col justify-center">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
              Our SEO Growth <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Framework.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              A disciplined system built to improve visibility, authority, and commercial performance.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="seo-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              
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
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Includes:</p>
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
// 4. GROWTH POD — Team Structure
// ═══════════════════════════════════════════════════════════════════════════════
export const SEOGrowthPodSection = () => {
  const scrollRef = useRef(null);

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
    { tag: 'STRATEGY', role: 'SEO Strategist', focus: 'Owns the organic roadmap, keyword strategy, and growth priorities.', icon: Target },
    { tag: 'ENGINEERING', role: 'Technical SEO', focus: 'Resolves crawl issues, site architecture, speed, and schema markup.', icon: Zap },
    { tag: 'CONTENT', role: 'Content Architect', focus: 'Designs semantic clusters, cornerstone content, and editorial direction.', icon: PenTool },
    { tag: 'AUTHORITY', role: 'Link Building Lead', focus: 'Acquires high-DR backlinks, digital PR placements, and brand mentions.', icon: Globe },
    { tag: 'OPTIMIZATION', role: 'CRO Specialist', focus: 'Improves landing pages, user experience, and search-to-lead conversion rates.', icon: Gauge },
    { tag: 'INTELLIGENCE', role: 'Analytics Lead', focus: 'Tracks rankings, traffic value, attribution, and pipeline impact.', icon: BarChart3 }
  ];

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_50%)] pointer-events-none animate-[spin_30s_linear_infinite] origin-[45%_55%] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-3xl">
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-10 font-display tracking-tight leading-[0.95]">
              The SEO Pod Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Your Growth.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Not a siloed consultant. A full-stack organic growth team deployed to turn your website into a compounding asset.
            </p>
          </div>

          <div className="flex gap-3 pb-2 relative z-[60]">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all text-white group"
            >
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all text-white group"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 pl-[max(1rem,calc((100vw-80rem)/2+1rem))]">
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-16 scroll-smooth pr-[max(1rem,calc((100vw-80rem)/2+1rem))]"
        >
          {team.map((member, idx) => (
            <div 
              key={idx} 
              className="seo-pod-card min-w-[85vw] md:min-w-[45vw] lg:min-w-[calc((100vw-3*2rem)/3.5)] snap-start bg-[#1D1D1F] rounded-[3rem] p-10 h-[520px] flex flex-col relative group overflow-hidden border border-white/5 transition-all duration-500 cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="mb-4">
                <span className="text-[12px] font-bold text-gray-500 tracking-[0.05em]">{member.tag}</span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">{member.role}</h3>
              
              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-cyan-400/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <member.icon className="w-24 h-24 text-white/5 group-hover:text-brand-blue group-hover:scale-110 transition-all duration-700 relative z-10" />
              </div>

              <div className="mt-auto">
                <p className="text-[15px] text-gray-400 font-light leading-relaxed max-w-[90%] group-hover:text-gray-200 transition-colors duration-500">
                  {member.focus}
                </p>
              </div>

              <div className="absolute bottom-8 right-8 w-11 h-11 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Plus className="w-6 h-6 text-black" />
              </div>

              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. KPI & SUCCESS OUTCOMES
// ═══════════════════════════════════════════════════════════════════════════════
export const SEOSuccessSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const kpis = [
    { title: 'Better Rankings', desc: 'Improved visibility for priority commercial keywords.', icon: Target, color: 'from-[#2564ea] to-[#4ab6d4]' },
    { title: 'Higher Quality Traffic', desc: 'Visitors with stronger intent and better conversion potential.', icon: Users, color: 'from-[#2564ea] to-[#4ab6d4]' },
    { title: 'Lower CAC Over Time', desc: 'Reduced dependence on paid acquisition channels.', icon: DollarSign, color: 'from-[#2564ea] to-[#4ab6d4]' },
    { title: 'Stronger Brand Authority', desc: 'Greater trust from users and search engines.', icon: Shield, color: 'from-[#2564ea] to-[#4ab6d4]' },
    { title: 'More Qualified Leads', desc: 'Search becomes a consistent source of opportunities.', icon: Filter, color: 'from-[#2564ea] to-[#4ab6d4]' },
    { title: 'Sustainable Growth', desc: 'A channel that compounds month after month.', icon: TrendingUp, color: 'from-[#2564ea] to-[#4ab6d4]' }
  ];
  
  // Custom Filter icon since it's not imported directly in the list
  function Filter(props) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  }

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
            What Strong SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic">Should Deliver.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            True organic growth isn't about chasing vanity metrics. It's about engineering a scalable, high-intent acquisition channel that compounds in value month over month.
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
// 6. READINESS MAGNET CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const SEOReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Build Your Organic Moat.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Let’s identify where demand exists, where you are underperforming, and how to turn search into a <strong className="text-white">reliable long-term growth engine</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Book Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <SecondaryButton 
                text="Get SEO Growth Audit" 
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
// 7. LOGO TRUST STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const LogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.seo-logo');
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

  const logos = [
    { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Bing', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_logo_%282020%29.svg' },
    { name: 'Ahrefs', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Ahrefs_Logo.svg' },
    { name: 'SEMrush', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Semrush_logo.svg' },
    { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' }
  ];

  return (
    <div ref={sectionRef} className="py-16 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-24 mb-16 border-b border-gray-100 pb-12">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">50M+</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organic Visits Generated</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Top 3</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rankings for Core Terms</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">12+</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Industries</p>
          </div>
        </div>

        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">Search Intelligence Partnerships</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 lg:gap-x-20">
          {logos.map((logo, idx) => (
            <div key={idx} className="seo-logo grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer">
              <img src={logo.url} alt={logo.name} className="h-6 lg:h-8 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


