import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, Search, Network, Cloud, Lock, Server, Activity, Briefcase, ChevronDown, Palette, Rocket, BrainCircuit, CheckCircle2, Code2, Bot, Users, Headset, TrendingUp, ShoppingCart, Megaphone, Zap, RefreshCw, Eye, MousePointerClick } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 2.1. PHILOSOPHY BACKGROUND
export const SalesforcePhilosophyBackground = () => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      const ctx = gsap.context(() => {
        // Linear path animation
        gsap.fromTo('.phi-path', 
          { strokeDashoffset: 1000, opacity: 0 }, 
          { strokeDashoffset: 0, opacity: 0.1, duration: 3, stagger: 0.2, ease: 'power1.inOut' }
        );
        
        // Pushing points
        gsap.to('.phi-point', {
          opacity: 0.3,
          scale: 1.5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.5, from: 'random' }
        });
      }, containerRef);
      return () => ctx.revert();
    }, []);
  
    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <svg viewBox="0 0 1200 800" className="w-full h-full" fill="none">
          <path className="phi-path" d="M0,200 L400,200 L450,250 L800,250 L850,200 L1200,200" stroke="#2564ea" strokeWidth="0.5" strokeDasharray="1000" />
          <path className="phi-path" d="M0,600 L300,600 L350,550 L900,550 L950,600 L1200,600" stroke="#4ab6d4" strokeWidth="0.5" strokeDasharray="1000" />
          <circle className="phi-point" cx="400" cy="200" r="2" fill="#2564ea" />
          <circle className="phi-point" cx="800" cy="250" r="2" fill="#4ab6d4" />
        </svg>
      </div>
    );
};

// 2. WHY SALESFORCE TRANSFORMATION
export const SalesforceWhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sf-why-text', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      gsap.fromTo('.sf-why-card', 
        { opacity: 0, scale: 0.95, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-4">
              <Zap className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Why Transform</span>
            </div>
            <h2 className="sf-why-text text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white font-display tracking-tight leading-[1]">
              Customer growth slows when sales, service, engagement, and commerce operate in <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">disconnected silos.</span>
            </h2>
            <div className="sf-why-text w-24 h-1.5 bg-brand-blue/20 rounded-full"></div>
            <p className="sf-why-text text-xl text-gray-500 font-light leading-relaxed">
              Salesforce creates the most value when it is not treated as just another CRM deployment. It becomes powerful when customer data, workflows, channels, service interactions, campaign journeys, and commerce touchpoints are connected with intent. Kangqore helps enterprises use Salesforce to improve responsiveness, simplify operations, increase visibility, reduce friction across teams, and build stronger customer relationships across the full lifecycle.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 gap-6">
            <div className="sf-why-card relative bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[2.5rem] p-8 lg:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-bl-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><Search className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide uppercase tracking-[0.1em]">The Challenge</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-lg">
                Disconnected systems, fragmented customer views, manual processes, and weak workflow continuity reduce sales momentum, service quality, and marketing effectiveness.
              </p>
            </div>

            <div className="sf-why-card relative bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl rounded-[2.5rem] p-8 lg:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue rounded-bl-full opacity-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-cyan-400 flex items-center justify-center text-white"><CheckCircle2 className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide uppercase tracking-[0.1em]">The Advantage</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light text-lg">
                A well-architected Salesforce ecosystem improves customer visibility, process orchestration, speed-to-response, cross-functional collaboration, and experience consistency across every touchpoint.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// 3. VALUE WE DELIVER (Accordions)
export const SalesforceValueDeliver = () => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const values = [
    { title: 'One connected customer operating model', desc: 'Bring sales, service, engagement, commerce, and campaign workflows into a more unified and actionable ecosystem.' },
    { title: 'Better productivity across teams', desc: 'Improve visibility, reduce manual effort, and give business users faster access to the information and actions they need.' },
    { title: 'Stronger customer experiences across touchpoints', desc: 'Create more consistent journeys across communities, support channels, sales interactions, marketing programs, and digital commerce.' },
    { title: 'Faster modernization without platform chaos', desc: 'Support implementation, integration, migration, and Lightning-led modernization without losing operational continuity.' },
    { title: 'Sharper decision-making through analytics and reporting', desc: 'Improve dashboards, reporting visibility, pipeline understanding, service insights, and campaign intelligence.' },
    { title: 'Scalable transformation beyond initial rollout', desc: 'Design Salesforce to evolve with the business through governance, integration discipline, customization, and managed optimization.' }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
              <TrendingUp className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Value Delivered</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
              Value We Deliver with{' '}<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Salesforce Services.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
              We help enterprises turn Salesforce into a true growth and relationship platform, shifting from isolated feature activation to connected business outcomes.
            </p>
          </div>
          <div className="space-y-4">
            {values.map((item, idx) => (
              <div key={idx} className="group rounded-[1.5rem] bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} 
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-all duration-300 ${openAccordion === idx ? 'bg-gradient-to-br from-brand-blue to-cyan-400 scale-110 shadow-md' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h4 className={`text-lg font-bold transition-colors ${openAccordion === idx ? 'text-brand-blue' : 'text-gray-900 dark:text-white group-hover:text-brand-blue'}`}>
                      {item.title}
                    </h4>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                {openAccordion === idx && (
                  <div className="px-6 pb-6 pl-[84px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
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

// 4. OUR SALESFORCE CLOUD SOLUTIONS (5 items)
export const SalesforceCloudSolutions = () => {
  const clouds = [
    { title: 'Community Cloud', icon: <Users/>, summary: 'Create customer, partner, and employee communities that deepen engagement and improve collaboration.', items: ['Community strategy and experience design', 'Partner / reseller / internal engagement models', 'Branded community implementation', 'Self-service and productivity enablement'] },
    { title: 'Service Cloud', icon: <Headset/>, summary: 'Equip service teams with the visibility, workflows, and insight needed to resolve faster and serve better.', items: ['Service analytics and dashboards', 'Service consultation and solution design', 'Service implementation and workflow enablement', 'Customization and integration across support systems'] },
    { title: 'Sales Cloud', icon: <TrendingUp/>, summary: 'Improve sales productivity, opportunity management, forecasting, and customer visibility across the pipeline.', items: ['Sales analytics and reporting', 'CRM consultation and roadmap design', 'Sales implementation and process enablement', 'Customization and system integration'] },
    { title: 'Commerce Cloud', icon: <ShoppingCart/>, summary: 'Build more connected commerce experiences across channels, store operations, fulfillment, and customer journeys.', items: ['Visual commerce experience design', 'Omni-channel commerce enablement', 'Site optimization and conversion support', 'System integration across commerce ecosystems'] },
    { title: 'Marketing Cloud', icon: <Megaphone/>, summary: 'Orchestrate personalized, data-driven customer journeys across channels with better timing and consistency.', items: ['Journey planning and strategy', 'Campaign and automation implementation', 'Asset and landing-page enablement', 'Performance, intelligence, and lifecycle orchestration'] }
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#FEFFFC' }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 lg:mb-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-6 text-brand-blue overflow-hidden">
            <Cloud className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">Solution Ecosystems</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight mb-6">
            Our Salesforce <span className="text-brand-blue italic font-extrabold">Cloud Solutions.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-6 mx-auto lg:mx-0"></div>
          <p className="text-lg text-gray-500 font-light max-w-3xl leading-relaxed mx-auto lg:mx-0">
            The Kangqore Salesforce transformation model organizes outcomes across five core cloud lanes, ensuring a more executive, outcome-led voice for every deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
          {clouds.map((cloud, i) => (
            <div key={i} className="group flex flex-col bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                 {React.cloneElement(cloud.icon, { className: "w-6 h-6" })}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-display group-hover:text-brand-blue transition-colors">
                {cloud.title}
              </h3>
              <p className="text-gray-500 text-sm font-light mb-8 leading-relaxed line-clamp-3">
                {cloud.summary}
              </p>
              
              <div className="mt-auto pt-6">
                <Link to="/contact" className="flex items-center justify-between text-xs font-bold text-brand-blue/60 group-hover:text-brand-blue transition-colors tracking-widest">
                  <span>KNOW MORE</span>
                  <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. CLOUD-SPECIFIC EXECUTION LANES
export const SalesforceExecutionLanes = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white font-display tracking-tight mb-6">
                        What Great Salesforce Execution Usually Requires
                    </h2>
                    <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { title: 'Governance Facade', desc: 'Centralize cross-cloud policies, identity, and security to prevent platform sprawl.', items: ['Platform sharing models', 'Security policy enforcement', 'Multi-org coordination'] },
            { title: 'User Experience Continuity', desc: 'Modernize interfaces to reduce friction and improve team productivity across clouds.', items: ['Lightning modernization', 'LWC development', 'Mobile-first workflows'] },
            { title: 'Observed Performance', desc: 'Monitor system health, usage trends, and business KPI surfaces in real time.', items: ['Real-time dashboards', 'Platform metrics', 'Process bottleneck detection'] }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-gray-500 font-light mb-8 flex-grow">{item.desc}</p>
              <ul className="space-y-3 pt-6">
                {item.items.map((it, k) => (
                  <li key={k} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
            </div>
        </section>
    );
};

// 7. SALESFORCE CENTER OF EXCELLENCE (Diamond)
export const SalesforceDiamondCoESection = () => {
  const diamondRef = useRef(null);
  
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
  }, []);

  return (
    <section className="py-24 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
       <style dangerouslySetInnerHTML={{__html: `
        @keyframes orbit-glow-pulse {
          0%, 100% { opacity: 0.4; border-color: rgba(37, 100, 234, 0.1); }
          50% { opacity: 1; border-color: rgba(37, 100, 234, 0.3); }
        }
        .orbit-path {
          animation: orbit-glow-pulse 4s ease-in-out infinite;
        }
        @keyframes api-diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes sf-connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sf-dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}} />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8 self-start">
              <Server className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">The Blueprint</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Salesforce<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Center of<br/> Excellence.</span>
            </h2>
            <div className="relative pl-6">
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                We unify your Salesforce initiative with four critical layers of engineering validation to ensure absolute platform confidence and scale.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs><linearGradient id="sf-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2564ea" /><stop offset="100%" stopColor="#4ab6d4" /></linearGradient></defs>
                  <circle cx="300" cy="40" r="7" fill="url(#sf-blue-grad)" style={{ animation: 'sf-dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#sf-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sf-connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#sf-blue-grad)" style={{ animation: 'sf-dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#sf-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sf-connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#sf-blue-grad)" style={{ animation: 'sf-dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#sf-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sf-connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#sf-blue-grad)" style={{ animation: 'sf-dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#sf-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'sf-connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'sf-diamond-float 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-cyan-500" style={{ transform: 'translateZ(6px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Strategy<br/>Blueprint</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-700" style={{ transform: 'translateZ(4px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Cloud<br/>Design</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-800 to-indigo-900" style={{ transform: 'translateZ(2px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Security<br/>Rigor</div></div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-600 to-blue-600" style={{ transform: 'translateZ(3px)' }}><div className="-rotate-45 text-center text-white font-bold text-[16px]">Operational<br/>Control</div></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Business Alignment •</li><li>ROI Modeling •</li><li>Platform Strategy •</li><li>Change Management •</li></ul></div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Architecture Review</li><li>• Object Modeling</li><li>• Lightning UI Specs</li><li>• Integration Flows</li></ul></div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right"><li>Shield Encryption •</li><li>Data Masking •</li><li>Audit Trails •</li><li>Access Controls •</li></ul></div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20"><ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left"><li>• Release Management</li><li>• Sandbox Strategy</li><li>• License Optimization</li><li>• Performance Tuning</li></ul></div>
              </div>
            </div>
            
            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Strategy Blueprint', items: ['Business Alignment', 'ROI Modeling'], gradient: 'from-blue-600 to-cyan-500' },
                { title: 'Cloud Design', items: ['Architecture Review', 'Object Modeling'], gradient: 'from-blue-500 to-blue-700' },
                { title: 'Security Rigor', items: ['Shield Encryption', 'Data Masking'], gradient: 'from-blue-800 to-indigo-900' },
                { title: 'Operational Control', items: ['Release Management', 'Sandbox Strategy'], gradient: 'from-cyan-600 to-blue-600' }
              ].map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden">
                  <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                  <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// 7. DELIVERY MODEL (Animated 4-phase timeline)
export const SalesforceDeliveryModel = () => {
    const journeyRef = useRef(null);
  
    useEffect(() => {
      if (journeyRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 }
        });
        const pathEl = journeyRef.current.querySelector('.journey-curve-path');
        if (pathEl) {
          const pathLength = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
          tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
        }
        const nodes = journeyRef.current.querySelectorAll('.journey-node');
        nodes.forEach((node, i) => {
          tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
        });
        const cards = journeyRef.current.querySelectorAll('.journey-card');
        gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } });
      }
    }, []);
  
    const phases = [
      { phase: 'Phase 01', icon: <Search className="w-7 h-7" />, title: 'Assess', desc: 'Understand customer journeys, process bottlenecks, cloud-fit, integration landscape, and transformation priorities.', gradient: 'from-slate-600 to-slate-800' },
      { phase: 'Phase 02', icon: <Layers className="w-7 h-7" />, title: 'Architect', desc: 'Define solution model, data flows, customization strategy, integration path, migration approach, and experience direction.', gradient: 'from-blue-500 to-blue-700', kangqore: true },
      { phase: 'Phase 03', icon: <Activity className="w-7 h-7" />, title: 'Implement', desc: 'Configure, customize, integrate, migrate, and launch the platform with adoption and business outcomes in mind.', gradient: 'from-brand-blue to-indigo-600', kangqore: true },
      { phase: 'Phase 04', icon: <TrendingUp className="w-7 h-7" />, title: 'Optimize', desc: 'Improve analytics, refine workflows, expand cloud usage, and evolve the platform as business needs mature.', gradient: 'from-cyan-500 to-cyan-700', kangqore: true }
    ];
  
    return (
      <section className="py-24 lg:py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
          <style dangerouslySetInnerHTML={{__html: `
            .journey-curve-glow { filter: blur(3px); }
            @keyframes glow-pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.6; }
            }
            .journey-curve-glow { animation: glow-pulse 3s ease-in-out infinite; }
          `}} />
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
            <div className="w-full lg:w-[45%] lg:sticky lg:top-32 order-2 lg:order-1">
               <div className="mb-8">
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                    <Network className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Delivery Model</span>
                  </div>
                 <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight leading-[0.95]">
                   Our Salesforce{' '}<br/>
                   <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Delivery Model.</span>
                 </h2>
                 <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
                 <p className="text-lg text-gray-500 font-light leading-relaxed">
                   At Kangqore, Salesforce transformation is structured as a disciplined customer-platform model—designed to connect workflows, improve visibility, reduce operational drag, and create scalable value across sales, service, commerce, and engagement.
                 </p>
               </div>
            </div>
            <div className="w-full lg:w-[55%] relative order-1 lg:order-2">
               <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px] z-[1]">
                <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                   <defs>
                    <linearGradient id="sf-journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="33%" stopColor="#3b82f6" />
                      <stop offset="66%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                    <filter id="sf-journey-glow-v">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                  <path className="journey-curve-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sf-journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#sf-journey-grad-v)" opacity="0.4" />
                  <path className="journey-curve-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#sf-journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {[125, 375, 625, 875].map((cy, i) => (
                    <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                      <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#sf-journey-grad-v)" strokeWidth="0.8" opacity="0.2"><animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
                      <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#sf-journey-grad-v)" strokeWidth="1.5" />
                      <circle cx="15" cy={cy} r="3" fill="url(#sf-journey-grad-v)" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} /></circle>
                      <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">{String(i + 1).padStart(2, '0')}</text>
                    </g>
                  ))}
                  {[0, 1, 2].map(i => (
                    <circle key={`pv-sf-${i}`} className="journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                      <animate attributeName="cy" values="0;1000" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                      <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    </circle>
                  ))}
                </svg>
              </div>
              <div className="space-y-6 lg:pl-[55px]">
                {phases.map((item, idx) => (
                  <div key={idx} className="journey-card group">
                    <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] p-6 lg:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-mono text-[11px] tracking-[0.2em] text-gray-400 font-bold uppercase">{item.phase}</div>
                          {item.kangqore && <div className="px-2.5 py-1 bg-brand-blue/10 rounded-full text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase shrink-0">Kangqore Execute</div>}
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors duration-300 font-display">{item.title}</h4>
                        <p className="text-gray-500 leading-relaxed font-light text-lg">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
     // 9. SALESFORCE EXECUTION ECOSYSTEM (Tech Stack)
export const SalesforceExecutionEcosystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Continuous rotation for orbits
        gsap.to('.orbit-ring-1', { rotation: 360, duration: 25, repeat: -1, ease: 'none' });
        gsap.to('.orbit-ring-2', { rotation: -360, duration: 40, repeat: -1, ease: 'none' });
        gsap.to('.orbit-ring-3', { rotation: 360, duration: 55, repeat: -1, ease: 'none' });
        
        // Counter-rotate the nodes so they stay upright
        gsap.to('.orbit-node-1', { rotation: -360, duration: 25, repeat: -1, ease: 'none' });
        gsap.to('.orbit-node-2', { rotation: 360, duration: 40, repeat: -1, ease: 'none' });
        gsap.to('.orbit-node-3', { rotation: -360, duration: 55, repeat: -1, ease: 'none' });

        // Entrance animation
        gsap.fromTo('.eco-enter', 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.2, stagger: 0.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true }}
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section className="pt-24 pb-32 lg:pt-36 lg:pb-48 bg-[#fefffc] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,100,234,0.03)_0%,transparent_60%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="lg:w-[45%] lg:pr-10 relative z-20">
            <h2 className="eco-enter text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              The Salesforce<br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Ecosystem Tech.</span>
            </h2>
            <div className="eco-enter w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10 shadow-sm"></div>
            <p className="eco-enter text-xl text-gray-600 dark:text-gray-400 mb-10 font-light leading-relaxed">
              Modern Salesforce isn't a standalone CRM. It's a connected environment of data, integration, code, and collaboration tools. We engineer across the entire stack to create seamless enterprise solutions.
            </p>
          </div>
          
          <div className="lg:w-[55%] relative flex justify-center items-center h-[500px] lg:h-[650px] w-full">
             <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                {/* Center Core */}
                <div className="eco-enter absolute z-30 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-brand-gradient flex items-center justify-center shadow-[0_20px_40px_rgba(37,100,234,0.3)]">
                    <Cloud className="w-12 h-12 lg:w-14 lg:h-14 text-white drop-shadow-md" />
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>

                {/* Orbit 1 (Inner) */}
                <div className="eco-enter orbit-ring-1 absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-full orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.1)' }}>
                    <div className="orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[11px] shadow-lg" style={{ top: '0%', left: '50%' }}>LWC</div>
                    <div className="orbit-node-1 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-[11px] shadow-lg" style={{ top: '100%', left: '50%' }}>Flow</div>
                </div>

                {/* Orbit 2 (Middle) */}
                <div className="eco-enter orbit-ring-2 absolute w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-full orbit-path" style={{ border: '1px dashed rgba(37, 100, 234, 0.2)' }}>
                    <div className="orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-brand-blue text-white font-bold text-xs shadow-xl text-center leading-tight hover:scale-110 transition-transform" style={{ top: '14.65%', left: '85.35%' }}>Mule<br/>Soft</div>
                    <div className="orbit-node-2 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 h-10 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white font-black text-xs shadow-lg whitespace-nowrap hover:scale-110 transition-transform" style={{ top: '85.35%', left: '14.65%' }}>Data Cloud</div>
                </div>

                {/* Orbit 3 (Outer) */}
                <div className="eco-enter orbit-ring-3 absolute w-[440px] h-[440px] lg:w-[520px] lg:h-[520px] rounded-full orbit-path" style={{ border: '1px solid rgba(37, 100, 234, 0.08)' }}>
                    <div className="orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform" style={{ top: '6.7%', left: '75%' }}>Slack</div>
                    <div className="orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 lg:px-5 h-10 lg:h-12 rounded-2xl bg-slate-800 text-white font-bold text-xs shadow-lg min-w-max hover:scale-110 transition-transform" style={{ top: '93.3%', left: '75%' }}>Tableau</div>
                    <div className="orbit-node-3 absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px] shadow-sm hover:scale-110 transition-transform" style={{ top: '50%', left: '0%' }}>Apex</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 10. SALESFORCE FUTURE-READY SECTION
export const SalesforceFutureReadySection = () => {
    const [openIdx, setOpenIdx] = React.useState(0);
    const items = [
        { title: 'Generative AI & Einstein', desc: 'Integrating Einstein GPT and generative capabilities directly into sales and service workflows for autonomous productivity.' },
        { title: 'Platform Events & Real-time Kafka', desc: 'Building event-driven architectures that react to customer behavior across every channel in milliseconds.' },
        { title: 'Data Cloud (Genie)', desc: 'Unifying fragmented data sources into a single, real-time customer graph that powers personalization at scale.' },
        { title: 'Agentic Service Workflows', desc: 'Deploying autonomous agents that handle complex customer service resolutions without manual intervention.' }
    ];

    return (
        <section className="py-24 lg:py-32 bg-[#fefffc] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 rounded-full mb-8">
                            <Rocket className="w-4 h-4 text-brand-blue" />
                            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Future-Ready</span>
                        </div>
                        <h2 className="text-5xl lg:text-[5.5rem] font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                            Future-Ready<br />
                            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Capabilities.</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-md">
                            We help organizations stay ahead of Salesforce innovation by integrating the latest AI, data, and event-driven standards into the core platform model.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {items.map((item, i) => (
                            <div key={i} className={`rounded-[2rem] transition-all duration-500 overflow-hidden ${openIdx === i ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl shadow-brand-blue/5' : 'bg-white dark:bg-gray-900 dark:border-gray-800/50 hover:bg-white dark:bg-gray-900 dark:border-gray-800'}`}>
                                <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between p-8 text-left">
                                    <span className={`text-xl font-bold transition-colors ${openIdx === i ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{item.title}</span>
                                    <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openIdx === i ? 'rotate-180 text-brand-blue' : 'text-gray-400'}`} />
                                </button>
                                {openIdx === i && (
                                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-lg">{item.desc}</p>
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
