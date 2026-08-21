import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ArrowRight, Zap, Target, Layers, BrainCircuit, Bot, ChevronDown, CheckCircle2, ChevronRight, Workflow, Link2, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. USM EXPERIENCE IMPERATIVE
// ═══════════════════════════════════════════════════════════════════════════════
export const USMExperienceImperative = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.usm-exp-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-6">
            <Target className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Total Experience</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight">
            The Unified Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Imperative.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Exceptional service is created when every internal and external experience works together. We help enterprises build connected experiences across functions, systems, and touchpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Employee Experience', icon: Users, desc: 'Simplify onboarding, requests, approvals, and support journeys so employees get what they need faster and work with less friction.' },
            { title: 'User Experience', icon: Zap, desc: 'Design intuitive self-service portals, mobile workflows, and intelligent service journeys that increase adoption and satisfaction.' },
            { title: 'Customer Experience', icon: Target, desc: 'Connect front-office and back-office workflows to resolve issues faster, personalize support, and improve loyalty.' },
            { title: 'Business Experience', icon: Activity, desc: 'Create agile operating models that improve productivity, reduce waste, and open new service-led revenue opportunities.' }
          ].map((card, idx) => (
            <div key={idx} className="usm-exp-card bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-300">
                <card.icon className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. USM AI STATS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const USMAIStatsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const bars = sectionRef.current.querySelectorAll('.usm-stat-bar');
      gsap.fromTo(bars,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out', transformOrigin: 'left center',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }
  }, []);

  const stats = [
    { val: '56%', label: 'Leaders prioritize service visibility and operational control', width: '56%', source: 'Gartner IT Key Metrics, 2025' },
    { val: '43%', label: 'Leaders invest in new digital service models', width: '43%', source: 'Forrester Digital Operations Survey, 2024' },
    { val: '39%', label: 'Leaders focus on employee productivity through automation', width: '39%', source: 'IDC Future of Work Research, 2025' },
    { val: '24%', label: 'Leaders accelerate self-service and citizen development', width: '24%', source: 'Gartner Self-Service Technology Trends, 2025' }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-[1.1]">
              Delivering Smarter Service Operations with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">AI.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-10">
              Leading enterprises are shifting from reactive service models to predictive, autonomous operations. Kangqore embeds AI, automation, and decision intelligence into service management so teams can move faster with less effort.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-brand-blue transition-all duration-300 transform hover:scale-105 group">
              Book an AI Service Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm pr-4">{stat.label}</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{stat.val}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                  <div className="usm-stat-bar h-full bg-gradient-to-r from-brand-blue to-cyan-400 rounded-full" style={{ width: stat.width }}></div>
                </div>
                <span className="text-xs text-gray-400 mt-1 block italic">{stat.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. USM WHAT WE OFFER ACCORDION
// ═══════════════════════════════════════════════════════════════════════════════
export const USMWhatWeOfferAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const offers = [
    {
      title: 'Managed Services',
      items: ['Global Service Desk Operations', '24/7 Multi-Region Support Models', 'AI-Powered Incident Management', 'Request Fulfillment Automation', 'SLA Governance & Reporting', 'Continuous Service Optimization']
    },
    {
      title: 'Consulting Services',
      items: ['Service Operating Model Design', 'Workflow & Process Assessment', 'Platform Rationalization Strategy', 'Governance & Compliance Advisory', 'Shared Services Transformation', 'Experience Improvement Roadmaps']
    },
    {
      title: 'Project & Transformation Services',
      items: ['Enterprise Platform Implementation', 'ServiceNow / ITSM Modernization', 'Cross-Department Workflow Integration', 'HR, Finance & Facilities Service Portals', 'Automation Program Delivery', 'Outcome-Based Transformation Programs']
    },
    {
      title: 'AI & Automation Services',
      items: ['Virtual Agents & AI Assistants', 'Predictive Routing & Prioritization', 'Intelligent Knowledge Management', 'Auto-Resolution Workflows', 'GenAI for Support Operations', 'Service Analytics & Insights']
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight">What We Offer.</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            We deliver end-to-end Unified Service Management capabilities—from strategy to implementation to continuous optimization.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {offers.map((offer, idx) => (
            <div key={idx} className="border-b border-gray-100 last:border-0">
              <button 
                onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
              >
                <span className={`text-xl font-bold transition-colors ${activeIndex === idx ? 'text-brand-blue' : 'text-gray-900 dark:text-white group-hover:text-brand-blue'}`}>
                  {offer.title}
                </span>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeIndex === idx ? 'bg-brand-blue text-white rotate-180' : 'bg-gray-50 dark:bg-[#050505] text-gray-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'}`}>
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
                style={{ 
                  maxHeight: activeIndex === idx ? '500px' : '0px',
                  opacity: activeIndex === idx ? 1 : 0
                }}
              >
                <div className="pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {offer.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2564ea] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                  ))}
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
// 4. USM READINESS MAGNET
// ═══════════════════════════════════════════════════════════════════════════════
export const USMReadinessMagnet = () => {
  return (
    <section className="py-24 bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          <div 
            className="absolute -inset-20 z-0" 
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
          
          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
               <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Is Your Service Model Holding You Back?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Don't guess. Deploy the <strong className="text-white">Unified Operations Diagnostic</strong> to instantly identify siloed workflows, process bottlenecks, and trapped working capital.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Execute Service Stress Test
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. USM CONTROL TOWER
// ═══════════════════════════════════════════════════════════════════════════════
export const USMControlTower = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.sc-packet', 
        { strokeDashoffset: 1000 }, 
        { strokeDashoffset: 0, duration: 4, ease: 'linear', repeat: -1 }
      );
      gsap.to('.sc-node', {
        scale: 1.25,
        opacity: 1,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.2, from: 'random' }
      });
      gsap.fromTo('.sc-panel',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 1000 600" className="w-full h-full max-w-[1200px]" fill="none">
           <path d="M100,300 L300,150 L500,250 L800,100 L950,300 L700,500 L400,450 Z" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
           <path d="M300,150 L400,450 M500,250 L700,500" stroke="#3b82f6" strokeWidth="0.5" />
           
           <path className="sc-packet" d="M100,300 L300,150 L500,250 L800,100" stroke="#4ab6d4" strokeWidth="3" strokeDasharray="20 980" />
           <path className="sc-packet" d="M950,300 L700,500 L400,450 L100,300" stroke="#2564ea" strokeWidth="3" strokeDasharray="30 970" style={{ animationDelay: '2s' }} />
           
           {[[100,300], [300,150], [500,250], [800,100], [950,300], [700,500], [400,450]].map((pos, i) => (
             <circle key={i} className="sc-node" cx={pos[0]} cy={pos[1]} r="6" fill="#4ab6d4" filter="drop-shadow(0 0 8px #2564ea)" />
           ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 sc-panel">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display tracking-tight">
            See the Network. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Control the Execution.</span>
          </h2>
          <p className="text-lg text-gray-400 font-light max-w-3xl mx-auto">
            Powering Total Experience with Unified Service Management. Watch how AI, workflow automation, and unified platforms transform fragmented operations into connected service ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Global IT & HR Unification', metric: '100%', label: 'Visibility', icon: Link2, color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
             { title: 'Cross-Department Automation', metric: '0.0ms', label: 'Latency', icon: Workflow, color: 'text-brand-blue' },
             { title: 'Enterprise Self-Service', metric: 'Real-Time', label: 'Resolution', icon: Bot, color: 'text-blue-400' }
           ].map((item, idx) => (
             <div key={idx} className="sc-panel bg-white dark:bg-gray-900 dark:border-gray-800/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-colors duration-300">
                <div className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 flex items-center justify-center mb-6 border border-white/10 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-mono font-bold text-white mb-1">{item.metric}</div>
                <div className={`text-xs font-bold tracking-widest uppercase mb-4 ${item.color}`}>{item.label}</div>
                <h3 className="text-xl font-bold text-gray-200">{item.title}</h3>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. USM EXECUTION ECOSYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
export const USMExecutionEcosystem = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to('.usm-orbit-slow', { rotation: 360, duration: 60, repeat: -1, ease: 'linear' });
      gsap.to('.usm-orbit-fast', { rotation: -360, duration: 40, repeat: -1, ease: 'linear' });
      gsap.fromTo('.usm-eco-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const domains = [
    { name: 'Talent & Organization', link: '/services/business-operations/talent-organization', icon: Users, desc: 'Workforce engineering and AI readiness' },
    { name: 'Supply Chain Operations', link: '/services/business-operations/supply-chain', icon: Zap, desc: 'Zero-latency supply network execution' },
    { name: 'Finance & Risk', link: '/services/business-operations/finance-risk', icon: Target, desc: 'Predictive financial governance' },
    { name: 'Global Capability Centers', link: '/services/business-operations/gcc', icon: Activity, desc: 'Scaling captive enterprise intelligence' }
  ];

  return (
    <section className="py-24 bg-white dark:bg-black dark:border-gray-800 relative overflow-hidden border-t border-gray-100" ref={containerRef}>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-5">
        <div className="absolute inset-0 rounded-full border border-gray-900 usm-orbit-slow"></div>
        <div className="absolute inset-10 rounded-full border border-brand-blue usm-orbit-fast"></div>
        <div className="absolute inset-24 rounded-full border border-cyan-400 usm-orbit-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight">The Execution <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Ecosystem.</span></h2>
            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
              Unified Service Management is the connective tissue. Explore how we deploy systemic accountability across every critical enterprise function.
            </p>
            <Link to="/services" className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all duration-300">
              View All Operations
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {domains.map((domain, idx) => (
              <Link key={idx} to={domain.link} className="usm-eco-card group block p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-brand-blue/30 hover:shadow-[0_8px_30px_rgb(37,100,234,0.08)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-center border border-gray-100 group-hover:border-brand-blue/20 group-hover:scale-110 transition-all duration-300">
                    <domain.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{domain.name}</h3>
                </div>
                <p className="text-sm text-gray-500 font-light">{domain.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
