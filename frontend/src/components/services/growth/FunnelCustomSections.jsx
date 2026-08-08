import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, BarChart3, DollarSign, MousePointerClick, Gauge, Search, Users, Activity, Filter, Rocket, Database, Settings, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. FUNNEL CHALLENGES SECTION (Interactive Before/After)
// ═══════════════════════════════════════════════════════════════════════════════
export const FunnelChallengesSection = () => {
  const sectionRef = useRef(null);
  const [activeState, setActiveState] = useState('before'); // 'before' | 'after'
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
      const cards = sectionRef.current.querySelectorAll('.funnel-challenge');
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
      before: { title: '"High Traffic, Low Revenue"', desc: 'Significant ad spend is wasted on visitors who bounce or abandon the journey due to friction and poor architecture.' },
      after: { title: 'Conversion Architecture', desc: 'We identify exactly where visitors abandon your journey, plug the leaks, and turn traffic into measurable revenue.' }
    },
    { 
      before: { title: '"Generic Landing Pages"', desc: 'Sending all traffic to a one-size-fits-all page ignores user intent and severely kills conversion rates.' },
      after: { title: 'Segment-Matched Pathways', desc: 'We build dynamic, intent-matched landing experiences that speak directly to the user\'s specific need and search context.' }
    },
    { 
      before: { title: '"Poor Lead Quality"', desc: 'Sales teams waste time chasing unqualified prospects generated from poorly designed, low-friction form flows.' },
      after: { title: 'High-Intent Qualification', desc: 'We optimize for high-intent commercial actions, adding strategic friction to filter, qualify, and route premium leads.' }
    },
    { 
      before: { title: '"Follow-Up Friction"', desc: 'Leads go cold because post-conversion nurturing, onboarding, and activation sequences are weak or non-existent.' },
      after: { title: 'Automated Retention Loops', desc: 'We engineer automated nurture sequences and product expansion loops to keep leads warm, activate users, and increase LTV.' }
    },
    { 
      before: { title: '"Rising Acquisition Costs"', desc: 'As ad platforms get more expensive, average funnels break and campaign profitability plummets to zero.' },
      after: { title: 'Profitable Scalability', desc: 'We increase baseline conversion rates so you can afford to acquire customers at scale, even as CPCs inevitably rise.' }
    },
    { 
      before: { title: '"No Funnel Visibility"', desc: 'Marketing operates blindly, unable to see what happens after the click or which channels actually drive closed revenue.' },
      after: { title: 'Full-System Telemetry', desc: 'We implement advanced tracking from first impression to closed revenue, providing total visibility and attribution.' }
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-left max-w-2xl">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[0.95]">
              Why Most Funnels <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Underperform.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">Traffic alone doesn't scale companies. Engineered conversion systems do.</p>
          </div>

          {/* Premium Interactive Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 rounded-[2rem] inline-flex relative border border-gray-100 shadow-inner shrink-0">
            <div 
              className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out ${activeState === 'after' ? 'translate-x-full' : 'translate-x-0'}`}
            ></div>
            <button 
              onClick={() => { setActiveState('before'); setIsAutoPlaying(false); }}
              className={`relative z-10 px-8 py-4 rounded-full text-sm font-bold transition-colors duration-300 w-48 lg:w-56 flex items-center justify-center gap-2 ${activeState === 'before' ? 'text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${activeState === 'before' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
              Before: Revenue Leaks
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {challenges.map((c, idx) => {
            const data = activeState === 'before' ? c.before : c.after;
            const isAfter = activeState === 'after';
            
            return (
              <div 
                key={idx} 
                className={`funnel-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden flex flex-col ${isAfter ? 'shadow-[0_10px_40px_rgba(37,100,234,0.08)] -translate-y-1' : 'shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.05)]'}`}
              >
                {/* Subtle Background Tint for 'After' State */}
                <div className={`absolute inset-0 bg-gradient-to-br from-brand-blue/[0.03] to-cyan-400/[0.03] transition-opacity duration-700 pointer-events-none ${isAfter ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Animated progress bar at bottom for 'After' state */}
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
                    {/* Crossfade container for text */}
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
// 2. WHY FUNNELS MATTER SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const WhyFunnelsMatterSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.funnel-pillar');
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
              Traffic Alone Does Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Create Growth.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Many businesses invest heavily in media, SEO, content, and brand awareness—yet revenue stalls because the customer journey underperforms. True scale happens when every stage of the journey is designed to perform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Lower CAC', icon: DollarSign, desc: 'Lower customer acquisition cost.' },
              { title: 'Conversion', icon: Target, desc: 'Higher lead-to-sale conversion.' },
              { title: 'Velocity', icon: Rocket, desc: 'Faster sales cycles.' },
              { title: 'Efficiency', icon: BarChart3, desc: 'Better ROAS and revenue efficiency.' },
              { title: 'Retention', icon: Shield, desc: 'Stronger retention and lifetime value.' },
              { title: 'Growth', icon: TrendingUp, desc: 'Predictable, repeatable growth.' }
            ].map((item, idx) => (
              <div key={idx} className="funnel-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
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
// 3. 4-PHASE FUNNEL METHOD
// ═══════════════════════════════════════════════════════════════════════════════
export const FourPhaseFunnelMethod = () => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const phases = [
    { num: '01', title: 'Attract', desc: 'Acquire the right audience—not just more traffic. We build precision acquisition systems that target high-intent demand.', includes: ['Paid acquisition strategy', 'SEO & organic demand capture', 'Audience signal mapping', 'Creative testing systems', 'High-intent channel planning'] },
    { num: '02', title: 'Engage', desc: 'Turn attention into trust and buying intent. We create personalised experiences that move prospects toward commitment.', includes: ['High-converting landing pages', 'Personalised journeys', 'Lead magnets & interactive tools', 'Retargeting sequences', 'Webinar / event funnels'] },
    { num: '03', title: 'Convert', desc: 'Reduce friction and increase action. We optimize every decision point to maximize conversion rates and revenue per visitor.', includes: ['CRO & A/B testing', 'Checkout optimization', 'Offer and pricing psychology', 'Form-flow improvement', 'Sales enablement assets'] },
    { num: '04', title: 'Retain & Expand', desc: 'Grow revenue after the first conversion. We engineer post-purchase systems that increase lifetime value and reduce churn.', includes: ['Onboarding systems', 'Upsell / cross-sell flows', 'Reactivation campaigns', 'Referral loops', 'Loyalty automation'] }
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

        const phaseCards = rightRef.current.querySelectorAll('.funnel-phase-card');
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
              Our Full-Funnel Revenue <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Architecture.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              A disciplined framework designed to improve every customer decision moment—from first click to repeat purchase.
            </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:w-2/3 flex flex-col gap-8 lg:gap-32 py-10 lg:py-[15vh]">
          {phases.map((phase, idx) => (
            <div key={idx} className="funnel-phase-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 lg:p-14 shadow-[0_20px_40px_rgb(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              
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
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Core Execution:</p>
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
// 4. FUNNEL SUCCESS SECTION (Compact Dark Accordion)
// ═══════════════════════════════════════════════════════════════════════════════
export const FunnelSuccessSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const kpis = [
    { title: 'Better Conversion Rates', desc: 'More visitors become leads and customers through precision-engineered journeys.', icon: Target },
    { title: 'Lower CAC', desc: 'Stronger funnel efficiency reduces wasted spend and improves unit economics.', icon: DollarSign },
    { title: 'Higher ROAS', desc: 'Acquisition channels perform more profitably when conversion rates improve.', icon: TrendingUp },
    { title: 'Faster Sales Velocity', desc: 'Leads move through the funnel with less resistance and shorter decision cycles.', icon: Zap },
    { title: 'Stronger Retention', desc: 'Customers stay longer and purchase more often through post-conversion systems.', icon: Shield },
    { title: 'Predictable Growth', desc: 'A scalable engine with measurable momentum and repeatable commercial outcomes.', icon: Activity }
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
            What High-Performing Funnels <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Deliver.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            True growth engineering isn't about isolated tweaks. It's about building a seamless commercial system that maximizes the return on every visitor.
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
// 5. FUNNEL READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const FunnelReadinessMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
              <Filter className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Your Traffic Deserves Better Than Average Conversion Rates.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Let's identify where prospects drop off, where growth slows down, and how to build a <strong className="text-white">funnel system that scales profitably</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Engineer Your Revenue Engine
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white font-semibold rounded-full hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm transition-all duration-300 border border-white/20">
                Claim Your Custom Revenue Leakage Audit (Value: $2,500)
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/60 font-light">Average funnels waste opportunity. Kangqore builds growth systems that capture it.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. FUNNEL LOGO TRUST STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const FunnelLogoTrustSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const logos = sectionRef.current.querySelectorAll('.funnel-logo');
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
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">2.5x</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Average Conversion Lift</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">10M+</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">User Sessions Analyzed</p>
          </div>
        </div>

        <p className="text-center text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">Conversion Intelligence Partnerships</p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale">
          <div className="funnel-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/VWO_logo.png" alt="VWO" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="funnel-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Optimizely_logo.svg" alt="Optimizely" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="funnel-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Hotjar_logo.svg" alt="Hotjar" className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="funnel-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Unbounce_Logo.svg" alt="Unbounce" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
          <div className="funnel-logo flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Mixpanel_logo.svg" alt="Mixpanel" className="h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};
