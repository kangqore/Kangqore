import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Layers, Shield, TrendingUp, Eye, BarChart3, DollarSign, MousePointerClick, Gauge, PenTool, Video, Search, Sparkles, Building2, ShoppingCart, Briefcase, Globe, Rocket, Users, LineChart, Plus, Brain, Database, Cpu, Network, CheckCircle2, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ResponsiveImage from '../../media/ResponsiveImage';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AI CHALLENGES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const AIChallengesSection = ({ title, subtitle, challenges }) => {
  const sectionRef = useRef(null);

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

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 text-left max-w-4xl">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">{subtitle}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c, idx) => (
            <div key={idx} className="ai-challenge bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col border border-gray-50">
              
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
// 2. AI LOGO TRUST STRIP
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

  const logos = [
    { name: 'OpenAI', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
    { name: 'Anthropic', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg' },
    { name: 'Google Cloud', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg' },
    { name: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Microsoft Azure', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg' },
    { name: 'Hugging Face', url: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' }
  ];

  return (
    <div ref={sectionRef} className="py-16 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-24 mb-16 border-b border-gray-100 pb-12">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Scale</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enterprise Deployments</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Secure</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Governed Architecture</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">Impact</p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Measurable ROI</p>
          </div>
        </div>

        <p className="text-center text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] mb-10">Intelligence Partnerships & Ecosystem</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 lg:gap-x-20">
          {logos.map((logo, idx) => (
            <div key={idx} className="ai-logo grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer">
              <img src={logo.url} alt={logo.name} className="h-6 lg:h-8 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. AI ARCHITECTURE DIAGRAM (Node-based)
// ═══════════════════════════════════════════════════════════════════════════════
export const AIArchitectureDiagram = ({ title, nodes }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.ai-node');
      gsap.fromTo(elements, 
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            once: true
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1]">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            We build governed, production-ready AI architectures designed for scale, security, and measurable outcomes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-200 via-brand-blue/30 to-gray-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {nodes.map((node, idx) => (
              <div key={idx} className="ai-node bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative">
                <div className="absolute top-0 right-8 w-12 h-1 bg-gradient-to-r from-brand-blue to-cyan-400 rounded-b-md transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 text-brand-blue">
                  <node.icon className="w-7 h-7" />
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-black text-gray-300 font-mono tracking-wider">0{idx + 1}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{node.title}</h3>
                </div>
                
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
                  {node.description}
                </p>
                
                <ul className="space-y-2">
                  {node.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px] text-gray-600 dark:text-gray-400 font-medium">
                      <div className="w-1 h-1 rounded-full bg-brand-blue/50 group-hover:bg-brand-blue transition-colors"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. USE CASES MAGNIFICATION LIST (Apple-style)
// ═══════════════════════════════════════════════════════════════════════════════
export const UseCasesMagnificationList = ({ title, useCases }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
              We engineer intelligence tailored to your specific industry realities, ensuring AI solves actual business problems, not just technical ones.
            </p>
          </div>
          
          <div className="lg:w-2/3 w-full flex flex-col">
            {useCases.map((uc, idx) => {
              const isHovered = hoveredIdx === idx;
              const isOtherHovered = hoveredIdx !== null && hoveredIdx !== idx;
              
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`border-b border-gray-100 py-8 transition-all duration-500 cursor-pointer group flex items-center justify-between ${
                    isHovered ? 'opacity-100 px-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border-transparent -mx-6' : 
                    isOtherHovered ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-display font-bold transition-all duration-500 tracking-tight text-gray-900 dark:text-white ${
                      isHovered ? 'text-4xl lg:text-5xl mb-4 text-brand-blue' : 'text-2xl lg:text-4xl'
                    }`}>
                      {uc.industry}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 ${isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 dark:text-gray-400 font-light text-lg mb-4 max-w-2xl">
                        {uc.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {uc.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-600 dark:text-gray-400 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'bg-brand-blue text-white rotate-45 scale-110' : 'bg-gray-50 dark:bg-[#050505] text-gray-400'}`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ACCELERATOR ROADMAP (GSAP ScrollTrigger)
// ═══════════════════════════════════════════════════════════════════════════════
export const AIAcceleratorRoadmap = ({ title, phases }) => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

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
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Our proven execution framework to take enterprise AI from ideation to scalable production safely and efficiently.
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
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Key Deliverables:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.deliverables.map((item, i) => (
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
// 6. METRICS & IMPACT SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const AIMetricsSection = ({ metrics, hideHeading = false }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.ai-metric-card');
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

      const numberElements = sectionRef.current.querySelectorAll('.ai-countup');
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

  return (
    <section ref={sectionRef} className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,100,234,0.1),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {!hideHeading && (
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6 font-display tracking-tight leading-[0.95]">
              Measurable <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Impact.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed">
              Intelligence is only valuable when it scales efficiency, cuts costs, or accelerates revenue.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((kpi, idx) => (
            <div key={idx} className="ai-metric-card bg-[#111111] rounded-[2.5rem] p-10 transition-all duration-500 group flex flex-col h-full relative overflow-hidden border border-white/5 hover:border-brand-blue/30 hover:-translate-y-3">
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-brand-blue/20 to-cyan-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-blue/20 transition-all duration-500">
                  <kpi.icon className="w-7 h-7 text-cyan-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                {kpi.title}
              </h3>
              <p className="text-sm font-light text-gray-400 mb-8">{kpi.desc}</p>

              <div className="mt-auto pt-8 border-t border-white/10 relative">
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-brand-blue to-cyan-400 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {kpi.prefix}<span className="ai-countup text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 tabular-nums" data-target={kpi.value}>0</span>{kpi.suffix}
                </div>
                <p className="text-xs text-gray-500 mt-3 font-medium tracking-wide uppercase">
                  {kpi.metricLabel}
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
// 7. READINESS MAGNET CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const AITransformationMagnet = () => {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-brand-blue to-cyan-400">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/95 to-cyan-400/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
          
          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Ready to Scale Intelligence?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Let's uncover automation bottlenecks, identify AI opportunities, and architect a <strong className="text-white">secure, governed, and highly efficient AI foundation for your enterprise</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Book an AI Strategy Workshop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white font-semibold rounded-full hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm transition-all duration-300 border border-white/20">
                Request Readiness Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8. AI TOOLS & TECHNOLOGY SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const AIToolsSection = ({
  title = 'Agentic AI Tools & Technology',
  // Optional overrides so a custom title can carry the same eyebrow + gradient
  // treatment as the sections in UniversalServicePage. Without titleHighlight
  // the gradient only fires on the legacy ' & Technology' titles below.
  eyebrow,
  titleHighlight,
  subtitle,
  items = [],
  // Per-service illustration. Defaults to the shared generic asset so the
  // services that have not been given their own artwork are unaffected.
  image = '/images/capabilities/agentic-ai-tools-dark-illustration.png',
  imageAlt = 'Agentic AI Tools & Technology Illustration',
}) => {
  const iconMap = { Network, Brain, Layers, Shield, Eye, Database, Cpu, Search };
  // Nothing is open on load. A row is active only while it is hovered or
  // focused; leaving the list closes it again.
  const [openTool, setOpenTool] = useState(null);
  const isCustomModel = typeof image !== 'string';
  const customModelElement = isCustomModel && React.isValidElement(image)
    ? React.cloneElement(image, { activeStep: openTool })
    : image;
  return (
    <section className={`py-24 bg-black border-t border-white/[0.04] relative ${isCustomModel ? '' : 'overflow-hidden'}`}>
      {/* Expanded 3D Canvas Background Panel (Full-Section overlay exceeding bounds) */}
      {isCustomModel && (
        <div className="absolute inset-x-0 -top-32 -bottom-32 z-0 pointer-events-none lg:pointer-events-auto">
          {customModelElement}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* items-start (not center) so a longer list does not strand the
            illustration in dead space; the illustration sticks instead. */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20">
          {/* Left Column: Title and vertical list of layers */}
          <div className={`w-full ${isCustomModel ? 'lg:w-[48%]' : 'lg:w-1/2'} flex flex-col`}>
            {eyebrow && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                  {eyebrow}
                </span>
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-12 leading-tight font-display">
              {titleHighlight ? (
                <>
                  {title}{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">{titleHighlight}</span>
                </>
              ) : title.includes(' & Technology') ? (
                <>
                  {title.replace(' & Technology', '')} &{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">Technology.</span>
                </>
              ) : (
                title
              )}
            </h2>
            {subtitle && (
              <p className="text-white/50 text-base leading-relaxed -mt-8 mb-12 max-w-xl">
                {subtitle}
              </p>
            )}
            {/* Accordion: exactly one layer is open at a time, the first by
                default. Pointer users reveal on hover, but hover alone would
                lock out touch and keyboard — so focus and click open a row too,
                and each header is a real button with aria-expanded. */}
            {/* onMouseLeave sits on the list, not each row, so moving between
                rows does not flash closed on the way past. */}
            <div className="space-y-2" onMouseLeave={() => setOpenTool(null)}>
              {items.map((item, i) => {
                const Icon = iconMap[item.icon] || Network;
                const isOpen = openTool === i;
                const panelId = `tool-panel-${i}`;
                return (
                  <div
                    key={item.title}
                    className="group relative"
                    onMouseEnter={() => setOpenTool(i)}
                  >
                    {/* Spine: runs from the bottom of this marker to the top of
                        the next one. Drawn per row (rather than one absolute
                        line for the whole list) so it follows a row expanding
                        or collapsing. -bottom-2 bridges the space-y-2 gap. */}
                    {i < items.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-6 -translate-x-1/2 top-16 -bottom-2 w-px bg-gradient-to-b from-[#4ab6d4]/45 to-[#2564ea]/15"
                      />
                    )}
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onFocus={() => setOpenTool(i)}
                      onClick={() => setOpenTool(i)}
                      className="w-full flex items-start gap-5 text-left py-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span
                        className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white transition-all duration-300 ${
                          isOpen
                            ? 'scale-110 shadow-[0_0_20px_rgba(74,182,212,0.35)]'
                            : 'opacity-70'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-[3px] rounded-full border border-dashed border-white/40"
                        />
                        <Icon className="relative" style={{ width: '20px', height: '20px' }} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-lg sm:text-xl font-bold leading-snug tracking-tight transition-colors duration-300 ${
                            isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                          }`}
                        >
                          {item.title}
                        </span>
                        {/* grid 0fr -> 1fr animates to the content's natural
                            height without hard-coding a max-height per item. */}
                        <span
                          id={panelId}
                          className="grid transition-all duration-500 ease-out motion-reduce:transition-none"
                          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                        >
                          <span className="overflow-hidden">
                            <span
                              className={`block text-slate-400 text-sm leading-relaxed pt-1.5 font-light transition-opacity duration-300 motion-reduce:transition-none ${
                                isOpen ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              {item.desc}
                            </span>
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Isometric Illustration (Only for standard image pages) */}
          {!isCustomModel && (
            <div className="w-full lg:w-1/2 flex items-center justify-center lg:sticky lg:top-28 lg:pt-24">
              <div className="relative max-w-lg w-full">
                {/* Soft decorative background glow behind the illustration */}
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
                <ResponsiveImage
                  src={image}
                  alt={imageAlt}
                  className="w-full h-auto object-contain relative z-10 animate-float"
                  loading="lazy"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 9. AI FAQ SECTION — dark, "BEFORE YOU SIGN" treatment
// ═══════════════════════════════════════════════════════════════════════════════
export const AIFAQSection = ({ faqs = [] }) => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="py-32 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">BEFORE YOU SIGN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-white">
              The hard questions,<br />
              <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">answered (FAQ).</span>
            </h2>
          </div>
          <div className="lg:pb-3 flex flex-col items-start gap-6">
            <p className="text-lg sm:text-xl font-bold text-white leading-snug">
              Talk through your specific workflow in 30 minutes.
            </p>
            <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]">
              Schedule a Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
        <div className="space-y-0">
          {faqs.map((faq, i) => {
            const isOpen    = openFaq === i;
            const question  = faq.q || faq.question;
            const answer    = faq.a || faq.answer;
            return (
              <div key={i} className="border-t border-white/[0.06]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-7 text-left group"
                >
                  <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white'}`}>
                    {question}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-white/30 bg-white/10 rotate-45' : 'border-white/10 group-hover:border-white/30'}`}>
                    <Plus className="w-3.5 h-3.5 text-white/60" />
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-8">
                    <p className="text-white/70 text-base font-medium leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t border-white/[0.06]" />
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 10. AI INSIGHTS & PERSPECTIVES SECTION (5 Interactive Cards)
// ═══════════════════════════════════════════════════════════════════════════════
export const AIInsightsSection = () => {
  const cards = [
    {
      eyref: "stage-01",
      title: "PERCEIVE",
      description: "Agents ingest and understand multi-modal context from enterprise systems — structured data, documents, user signals, and real-time event streams.",
      features: ["RAG Integration", "API Connectors", "Multi-Modal Context", "Real-time Telemetry"],
      image: "/images/insights/execution-gap.png",
      bgColor: "bg-gradient-to-b from-[#d5d7dc] via-[#e2e4e8] to-[#ffffff]",
      textColor: "text-black",
      descColor: "text-black/80",
      blendMode: "multiply",
      objectFit: "cover"
    },
    {
      eyref: "stage-02",
      title: "REASON",
      description: "LLM-powered cognitive reasoning evaluates high-level goals, checks governance guardrails, and synthesizes contextual state.",
      features: ["Goal Evaluation", "Contextual LLM", "State Management", "Guardrail Verification"],
      image: "/images/insights/tokenomics.png",
      bgColor: "bg-[#ffffff]",
      textColor: "text-black",
      descColor: "text-black/80",
      blendMode: "multiply",
      objectFit: "contain"
    },
    {
      eyref: "stage-03",
      title: "PLAN",
      description: "Decomposes complex objectives into dynamic, multi-step execution graphs and resilient strategy paths using LangGraph state machines.",
      features: ["Goal Decomposition", "LangGraph Logic", "Dependency Mapping", "Fallback Routing"],
      image: "/images/insights/pulse-of-change.png",
      bgColor: "bg-[#0b062b]",
      textColor: "text-white",
      descColor: "text-white/80",
      blendMode: "screen",
      objectFit: "cover"
    },
    {
      eyref: "stage-04",
      title: "ACT",
      description: "Autonomously executes tool calls, writes to enterprise ERP/CRM systems, triggers RPA bots, and coordinates agent swarms.",
      features: ["Function Calling", "Workflow Automations", "Write Permissions", "Multi-Agent Handoffs"],
      image: "/images/insights/leadership-principles.png",
      bgColor: "bg-[#ececec]",
      textColor: "text-black",
      descColor: "text-black/80",
      blendMode: "multiply",
      objectFit: "contain"
    },
    {
      eyref: "stage-05",
      title: "LEARN",
      description: "Evaluates execution outcomes, self-corrects from failures, updates persistent organizational memory, and continuously optimizes future runs.",
      features: ["Self-Correction", "Persistent Memory", "Outcome Evaluation", "Drift Detection"],
      image: "/images/insights/production-audit.png",
      bgColor: "bg-[#0f151c]",
      textColor: "text-white",
      descColor: "text-white/80",
      blendMode: "screen",
      objectFit: "cover"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-black border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">ARCHITECTURE & EXECUTION LOOP</span>
          </div>
          <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
            How It Works.<br />
            <span className="bg-brand-gradient bg-clip-text text-transparent">The 5-Stage Autonomous Execution Loop.</span>
          </h2>
          <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-3xl">
            Every deployment runs on a governed, modular architecture built for enterprise scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className={`group relative rounded-2xl overflow-hidden h-[320px] flex flex-col justify-between pt-8 px-6 pb-6 transition-all duration-500 border border-white/5 ${card.bgColor} ${card.textColor}`}
            >
              {/* Card Title (Always visible at the top) */}
              <div className="relative z-10">
                <h3 className="font-extrabold text-2xl leading-snug tracking-tight">
                  {card.title}
                </h3>
              </div>

              {/* Graphic/Illustration positioned absolutely at the bottom with seamless blend */}
              <ResponsiveImage 
                src={card.image} 
                alt={card.title} 
                className={`absolute bottom-0 left-0 right-0 w-full h-[65%] object-${card.objectFit} object-bottom transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none z-10`}
                style={{ 
                  mixBlendMode: card.blendMode,
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%)',
                  maskImage: 'linear-gradient(to bottom, transparent, black 25%)'
                }}
                loading="lazy"
              />

              {/* Slide-up Details Panel (revealed on hover) */}
              <div 
                className={`absolute inset-0 pt-8 px-6 pb-6 transition-all duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0 flex flex-col justify-between ${card.bgColor} ${card.textColor} z-20`}
              >
                <div>
                  <h4 className="font-extrabold text-2xl leading-snug tracking-tight mb-3">
                    {card.title}
                  </h4>
                  <p className={`text-[11px] leading-relaxed font-semibold ${card.descColor}`}>
                    {card.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-current/10">
                    <span className="block text-[11px] font-bold tracking-widest uppercase mb-1.5 opacity-60">Key Capabilities</span>
                    <ul className="flex flex-col gap-y-1">
                      {card.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] font-bold leading-tight">
                          <span className="w-1 h-1 rounded-full bg-current opacity-70 flex-shrink-0" />
                          <span>{f}</span>
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
