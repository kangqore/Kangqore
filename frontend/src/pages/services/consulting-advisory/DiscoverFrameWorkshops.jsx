import React, { useEffect, useRef } from 'react';
import { 
  Compass, Search, Layers, Activity, ShieldCheck, 
  Target, Rocket, TrendingUp, Cpu, Workflow, Cloud, 
  Briefcase, BarChart3, Lightbulb, Zap, LineChart,
  Users, CheckCircle2, MonitorSmartphone, Server,
  CalendarDays, Settings, Package, LayoutTemplate,
  BrainCircuit, ArrowRight, Radar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DiscoverFrameWorkshops = () => {
  // refs for custom GSAP sections
  const sliderRef = useRef(null);
  const deliverablesRef = useRef(null);
  const leftColRef = useRef(null);
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);

  useEffect(() => {
    // 1. Animated Stat Counters
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) {
          const targetNum = parseInt(match[1]);
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`);
                }
              });
            }
          });
        }
      });
    };

    // 2. Diamond Entrance Animation
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: diamondRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      gsap.to(diamondRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: diamondRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // 3. Differentiator items staggered entrance
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: differentiatorRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // 4. Deliverables Stepper Animation & SMOOTH PINNING
    if (deliverablesRef.current && leftColRef.current) {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Smooth Pinning for Left Side
        ScrollTrigger.create({
          trigger: deliverablesRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
          scrub: 1
        });

        // Staggered Nodes & Content
        gsap.fromTo(deliverablesRef.current.querySelectorAll('.stepper-node'), 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
              trigger: deliverablesRef.current,
              start: "top 60%",
              once: true
            }
          }
        );

        gsap.fromTo(deliverablesRef.current.querySelectorAll('.stepper-content'), 
          { x: 20, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
              trigger: deliverablesRef.current,
              start: "top 60%",
              once: true
            }
          }
        );
      });
    }

    const timer = setTimeout(animateCounters, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // CUSTOM COMPONENT: CAPABILITIES SLIDER
  // ============================================
  // Capabilities will now be handled by the ServicePageTemplate using the data below
  const capabilities = [
    {
      title: "Concept Analysis & Product Discovery",
      description: "Understand the product idea in the context of business goals, market opportunity, and long-term value creation.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Product vision and business-context discovery",
        "USP, opportunity, and gap identification",
        "Market-fit and feasibility thinking",
        "Strategic alignment with growth intent"
      ]
    },
    {
      title: "Requirement Analysis & Functional Framing",
      description: "Translate ideas into clearer product behavior, feature scope, and use-case expectations.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "Feature and workflow requirement analysis",
        "User stories, assumptions, and notifications framing",
        "Competitor and adjacent-solution review",
        "Functional scope definition"
      ]
    },
    {
      title: "Solution Framing & MVP Design",
      description: "Define what the product must do first—and what can wait.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Core feature prioritization",
        "MVP scope definition",
        "User-need and pain-point alignment",
        "Business workflow and product flow mapping"
      ]
    },
    {
      title: "Wireframing & UX Direction",
      description: "Bring early-stage ideas to life through a user-centered visual foundation.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "Sketches and low-fidelity concept framing",
        "Clickable wireframes and interaction preview",
        "UX flow validation and usability direction",
        "Design principles aligned to product intent"
      ]
    },
    {
      title: "Technical Architecture Planning",
      description: "Shape a practical technical direction that supports delivery, scalability, and future growth.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        "Recommended technology stack direction",
        "Frontend, backend, data, and cloud planning",
        "Third-party integrations and ecosystem mapping",
        "High-level architecture and data-flow design"
      ]
    },
    {
      title: "Techno-Commercial Planning",
      description: "Turn discovery into a practical execution and commercial plan.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        "Delivery scope alignment",
        "Resource and effort estimation",
        "Timeline and milestone planning",
        "Commercial framing and phased roadmap"
      ]
    }
  ];
;

  const deliverablesStepper = (
    <section className="py-24 bg-white dark:bg-black relative" ref={deliverablesRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* LEFT: Pinned Heading & Image */}
          <div className="lg:w-[45%] h-full" ref={leftColRef}>
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display leading-[1.1]">
                  Discovery Masterclass: <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic">6-Step Strategic Workshop.</span>
                </h2>
                <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full"></div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
                  alt="Workshop Analysis" 
                  className="relative z-10 rounded-[2rem] shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 aspect-[4/3] object-cover"
                />
                {/* Visual Accent */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
              </div>
            </div>
          </div>

          {/* RIGHT: Scrollable Stepper Content */}
          <div className="lg:w-[50%] relative py-12">
            {/* Vertical Line */}
            <div className="absolute left-1 top-2 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] z-0"></div>
            
            <div className="space-y-24">
              {[
                {
                  title: "STEP 01: Strategic Discovery & Vision Alignment",
                  points: [
                    "Distill core product concepts into a cohesive vision that aligns with long-term enterprise objectives and business trajectory.",
                    "Identify unique value drivers, potential friction points, and market white spaces to sharpen your competitive advantage.",
                    "Execute rigorous feasibility research—balancing technical, commercial, and operational viability—to ensure a definitive path to success."
                  ]
                },
                {
                  title: "STEP 02: Requirement Synthesis & Domain Analysis",
                  points: [
                    "Conduct a thorough landscape audit of competing ecosystems to pinpoint opportunities for disruptive innovation and functional superiority.",
                    "Decipher complex business logic into distinct, high-impact features that differentiate your digital product from the status quo.",
                    "Engineer a structured requirements backlog, translating user stories into technical specifications that define the functional perimeter.",
                    "Map intricate system dependencies and user interactions through high-fidelity diagrams, ensuring total transparency across the workflow."
                  ]
                },
                {
                  title: "STEP 03: Solution Framework & MVP Scoping",
                  points: [
                    "Isolate mission-critical features to architect an MVP that delivers immediate market value while supporting core business goals.",
                    "Deep-dive into the target persona's psychographics—addressing pain points and aspirations—to achieve seamless user-product resonance."
                  ]
                },
                {
                  title: "STEP 04: Visual Experience Architecture (UX/UI)",
                  points: [
                    "Architect high-fidelity wireframes that serve as a functional skeleton, allowing stakeholders to experience the product's narrative flow.",
                    "Establish a sophisticated design language and aesthetic tokens that mirror your brand's DNA while optimizing the digital experience.",
                    "Engineer intuitive navigation pathways and micro-interactions that elevate usability into a world-class user journey."
                  ]
                },
                {
                  title: "STEP 05: Technical Ecosystem & Scalability Blueprint",
                  points: [
                    "Appoint a future-ready technology stack—spanning frontend, robust backend, and cloud-native infrastructure—built for infinite scale.",
                    "Synthesize strategic third-party integrations, from secure payment gateways to AI-driven analytics, for a feature-rich implementation.",
                    "Design a multi-tier architectural block diagram, visualizing data orchestration and core component relationships."
                  ]
                },
                {
                  title: "STEP 06: Transformation Roadmap & Commercial Blueprint",
                  points: [
                    "Produce a comprehensive project dossier detailing scope, resource allocation, and investment estimates with total commercial clarity.",
                    "Present a phased engineering roadmap with clearly defined sprints and deliverables, ensuring end-to-end visibility for stakeholders.",
                    "Solidify the execution timeline with critical milestones, establishing a high-accountability framework for launch and scale."
                  ]
                }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-12 group">
                  {/* Node Marker - Blue Ring as per screenshot */}
                  <div className="stepper-node absolute left-0 top-1.5 w-3 h-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-2 border-brand-blue rounded-full z-10 transition-transform duration-300 group-hover:scale-125"></div>
                  
                  <div className="stepper-content">
                    <h4 className="text-[16px] lg:text-[20px] font-bold text-brand-blue mb-6 tracking-wide uppercase font-display">
                      {step.title}
                    </h4>
                    <div className="space-y-4">
                      {step.points.map((p, pIdx) => (
                        <p key={pIdx} className="text-gray-500 text-[16px] lg:text-[16px] leading-relaxed font-light">
                          {p}
                        </p>
                      ))}
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

  // ============================================
  // CUSTOM COMPONENT: DISCOVERY COE SECTION (3D Diamond)
  // ============================================
  const discoveryCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TWO-COLUMN LAYOUT: INTRO + DIAGRAM */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">Discovery & Frame CoE</strong> provides a high-fidelity operational blueprint, surrounding your product idea with four critical execution layers.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace "guess-work engineering" with "governed framing." By unifying market validation, user-centered design, technical architecture, and commercial planning, we ensure your product is built on a foundation of clarity rather than a mountain of assumptions.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG connectors */}
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs>
                    <linearGradient id="disc-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="300" cy="40" r="7" fill="url(#disc-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#disc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#disc-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#disc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#disc-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#disc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#disc-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#disc-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* 3D DIAMOND */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Market & Business<br/>Analysis</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">User & UX<br/>Framing</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Technical &<br/>Architecture</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Delivery &<br/>Roadmap</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LABELS */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>Growth modeling & opportunity gap •</li>
                    <li>Competitive benchmarking •</li>
                    <li>Business vision alignment •</li>
                    <li>ROI & feasibility scoring •</li>
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• User persona & psyche mapping</li>
                    <li>• Clickable wireframe preview</li>
                    <li>• Journey & flow design</li>
                    <li>• Usability hypothesis testing</li>
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>Stack & ecosystem recommendations •</li>
                    <li>High-level data flow design •</li>
                    <li>Third-party integration mapping •</li>
                    <li>Scalability & performance thinking •</li>
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• MVP scope definition</li>
                    <li>• Timeline & commercial framing</li>
                    <li>• Resource & effort estimation</li>
                    <li>• Build-ready backlog readiness</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Market & Business', items: ['Growth mapping', 'Benchmarking'], gradient: 'from-blue-600 to-blue-800' },
                { title: 'User & UX Framing', items: ['Persona mapping', 'Wireframing'], gradient: 'from-blue-400 to-blue-600' },
                { title: 'Technical Design', items: ['Architecture', 'Stack definition'], gradient: 'from-blue-900 to-slate-900' },
                { title: 'Delivery Roadmap', items: ['MVP planning', 'Estimation'], gradient: 'from-cyan-500 to-cyan-700' }
              ].map((q, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                  <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                  <div className="p-4"><ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">{q.items.map((i, k) => <li key={k}>• {i}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIFFERENTIATORS GRID */}
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              { num: 1, title: 'Execution-Led Advisory', text: 'We don\'t deliver "shelf-ware." Our discovery outputs are designed to be handed straight to an engineering team for a build-ready start.' },
              { num: 2, title: 'Technical Feasibility First', text: 'We validate assumptions against engineering reality during the workshop, ensuring the MVP concept is actually buildable within scope.' },
              { num: 3, title: 'User Psyche Focus', text: 'We go beyond "UI" to frame the psychological needs of your target persona, ensuring the product solves real user pain points.' },
              { num: 4, title: 'Scalable Architecture Blueprint', text: 'Even for lean MVPs, we define a technical path that allows room for enterprise-scale growth and future platform extensions.' },
              { num: 5, title: 'Unified Commercial Clarity', text: 'We replace vague quotes with structured, phased roadmaps that give stakeholders full visibility into delivery, effort, and ROI.' }
            ].map((d) => (
              <div key={d.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
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

  // ============================================
  // CUSTOM COMPONENT: EXECUTION ECOSYSTEM SECTION
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
              Related Execution <br /><span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
              Turn your workshop roadmap into code. Kangqore provides the end-to-end engineering muscle to bring your framed product to market.
            </p>
            <div className="space-y-4">
              {[
                { name: 'MVP Acceleration', link: '/services/digital-engineering/mvp-acceleration', icon: <Rocket className="w-5 h-5" />, desc: 'Rapid, high-fidelity engineering for net-new products.' },
                { name: 'Product Digital Engineering', link: '/services/product-engineering/product-digital-engineering', icon: <Cpu className="w-5 h-5" />, desc: 'Enterprise-grade platform development at scale.' },
                { name: 'Modernization Infrastructure', link: '/services/infrastructure-networks-operations/modernization-infrastructure', icon: <Server className="w-5 h-5" />, desc: 'Modernize legacy debt into a scalable digital core.' }
              ].map((e, idx) => (
                <Link key={idx} to={e.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 transition-all shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">{e.icon}</div>
                  <div>
                    <span className="font-bold text-lg block mb-1 group-hover:text-brand-blue transition-colors">{e.name}</span>
                    <p className="text-gray-500 text-sm">{e.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="relative aspect-square w-full max-w-[550px] mx-auto">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>
                
                {/* ID Badge */}
                <div className="absolute top-0 left-0 p-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                  <div className="flex justify-between gap-4"><span>blueprint_id:</span> <span className="text-brand-blue">#KG_FRM_B01</span></div>
                  <div className="flex justify-between gap-4"><span>logic_state:</span> <span className="text-emerald-500">READY_FOR_EXECUTION</span></div>
                </div>

                {/* Central Core (The Workshop Output / Blueprint) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                  <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                  <div className="relative">
                     <LayoutTemplate className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Orbiting Execution Modules */}
                {/* 1. MVP Acceleration (Top) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                      <Rocket className="w-12 h-12 text-brand-blue" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">MVP_Accelerate</span>
                  </div>
                </div>

                {/* 2. Digital Engineering (Bottom Left) */}
                <div className="absolute bottom-10 left-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                      <Cpu className="w-12 h-12 text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Digi_Eng</span>
                  </div>
                </div>

                {/* 3. Modernization (Bottom Right) */}
                <div className="absolute bottom-10 right-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative -translate-x-4 hover:translate-x-0 transition-transform duration-300">
                      <Radar className="w-12 h-12 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase -translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Modernize</span>
                  </div>
                </div>

                {/* Animated Data Flow SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <defs>
                    <linearGradient id="exec-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Paths from Core to Satellites */}
                  <path d="M250,250 L250,120" stroke="url(#exec-flow-grad)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  <path d="M250,250 L120,400" stroke="url(#exec-flow-grad)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  <path d="M250,250 L380,400" stroke="url(#exec-flow-grad)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                  
                  {/* Moving Dots */}
                  <circle r="3" fill="#0066FF"><animateMotion path="M250,250 L250,120" dur="2s" repeatCount="indefinite" /></circle>
                  <circle r="3" fill="#00D2FF"><animateMotion path="M250,250 L120,400" dur="2.5s" repeatCount="indefinite" /></circle>
                  <circle r="3" fill="#6366f1"><animateMotion path="M250,250 L380,400" dur="3s" repeatCount="indefinite" /></circle>
                </svg>
             </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // TEMPLATE DATA INJECTION
  // ============================================
  const department = {
    name: 'Consulting & Advisory',
    slug: 'consulting-advisory',
    description: 'Strategic clarity and technological depth for the modern enterprise.',
    icon: <Briefcase className="w-6 h-6" />
  };

  const pageData = {
    service: {
      name: 'Discover & Frame Workshops',
      titleLine1: 'Discover & Frame',
      titleHighlight: 'Workshops.',
      slug: 'discover-frame-workshops',
      videoBackground: '/videos/business-meeting-6774639.mp4', 
      shortDescription: "Turn raw product ideas into execution-ready roadmaps.",
      fullDescription: (
        <div className="space-y-4">
          <p className="font-light tracking-tight leading-snug opacity-80">
            Kangqore’s Discover & Frame Workshops help organizations define, validate, and structure product ideas before development begins. We align business goals, user needs, product priorities, technical direction, and execution planning—so teams move forward with clarity, speed, and confidence.
          </p>
        </div>
      ),
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
      
      stats: [
        { value: 'Clarify', label: 'Product vision & business intent', color: 'text-blue-500' },
        { value: 'Validate', label: 'Scope, feasibility & priorities', color: 'text-emerald-500' },
        { value: 'Design', label: 'MVP, workflows & user journeys', color: 'text-purple-500' },
        { value: 'Plan', label: 'Architecture, timeline & roadmap', color: 'text-brand-blue' }
      ],

      primaryButton: { text: "Talk To Our Experts", link: "/contact" },
      secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
      ctaTitle: 'Ready to turn your idea into a build-ready roadmap?',
      ctaDescription: "Schedule a Kangqore Discover & Frame Workshop to validate your concept, define the right MVP, align stakeholders, and move into execution with greater confidence.",
      ctaSecondaryButton: { text: "Explore Capabilities", link: "/contact" },

      trustStripText: 'Helping enterprises, startups, and innovation teams define product direction, reduce ambiguity, and move from idea to execution with greater confidence.',

      highFidelity: {
        narrative: {
          badge: 'WHY DISCOVER & FRAME',
          titleLine1: 'Without structured discovery, product ideas become',
          titleHighlight: 'expensive assumptions.',
          titleLine2: '',
          description: 'Too many software initiatives begin with enthusiasm but little alignment. Business goals remain broad, scope keeps shifting, user needs stay partially understood, and technical direction is defined too late. Kangqore’s Discover & Frame Workshops bring structure to early-stage uncertainty—so you can validate the opportunity, prioritize what matters, and build on a stronger foundation.',
          bottleneckLabel: 'The Overload',
          bottleneckText: '70% of product waste stems from poorly defined requirements or weak discovery alignment.*',
          requirementLabel: 'The Advantage',
          requirementText: '3x faster time-to-market for products that undergo disciplined discovery before full-scale build.*',
          image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
          statusLabel: 'Discovery State',
          statusValue: 'VALIDATING'
        },
        philosophy: {
          icon: <Compass className="w-7 h-7 text-brand-blue" />,
          title: 'Our Discover & Frame',
          titleHighlight: 'Delivery Model.',
          description: 'At Kangqore, discovery is not a loose brainstorming exercise. It is a structured advisory process designed to reduce uncertainty, sharpen priorities, and prepare teams for confident execution.',
          pills: ['Discover', 'Analyze', 'Frame', 'Visualize', 'Architect', 'Plan']
        },
        matrix: {
          engineId: 'Engine :: DISC_FRM_V1',
          title: '6-Phase Workshop Lifecycle',
          subtext: 'A structured blueprint to turn abstract ideas into an engineered reality.',
          layers: [
            { title: 'Discover', id: 'PH_01', icon: <Search />, desc: 'Understand the product vision, business goals, users, market context, and opportunity.' },
            { title: 'Analyze', id: 'PH_02', icon: <BarChart3 />, desc: 'Evaluate requirements, assumptions, differentiation opportunities, and feasibility.' },
            { title: 'Frame', id: 'PH_03', icon: <LayoutTemplate />, desc: 'Define workflows, MVP scope, solution direction, and user interaction logic.' },
            { title: 'Visualize', id: 'PH_04', icon: <MonitorSmartphone />, desc: 'Create sketches and wireframes to make the concept tangible and testable.' },
            { title: 'Architect', id: 'PH_05', icon: <Server />, desc: 'Recommend technical direction, integrations, and architecture-level design thinking.' },
            { title: 'Plan', id: 'PH_06', icon: <CalendarDays />, desc: 'Translate discovery into commercials, milestones, timelines, and a development roadmap.' }
          ]
        },
        schematic: {
          titleLine1: 'Engineering Excellence. ',
          titleHighlight: 'Absolute Accountability.'
        }
      },

      capabilitiesTitle: "Our Capabilities.",
      capabilitiesDescription: "Our structured advisory process is built to convert early-stage product uncertainty into strategic clarity. We unify business analysis, UX framing, and technical planning before capital is committed.",
      capabilities: capabilities,

      trustPillars: [
        {
          title: 'Strategic clarity before development begins',
          tag: 'Alignment',
          description: 'Bring business intent, product direction, user needs, and execution expectations into one aligned discovery process.'
        },
        {
          title: 'Better concept validation and lower delivery risk',
          tag: 'Validation',
          description: 'Test assumptions early through structured requirement analysis, market understanding, and feasibility framing.'
        },
        {
          title: 'Sharper MVP definition',
          tag: 'Focus',
          description: 'Identify the essential features needed for launch so your first version is focused, usable, and commercially meaningful.'
        },
        {
          title: 'Faster path to execution',
          tag: 'Velocity',
          description: 'Reduce ambiguity in planning by defining workflows, wireframes, architecture direction, and implementation scope upfront.'
        },
        {
          title: 'More confident stakeholder alignment',
          tag: 'Clarity',
          description: 'Give founders, business teams, product owners, and delivery teams a common blueprint for decisions and execution.'
        },
        {
          title: 'A roadmap you can actually build from',
          tag: 'Execution',
          description: 'Walk away with a structured development direction covering user journeys, feature scope, technical thinking, commercials, and milestones.'
        }
      ],

      whyKangqore: [
        {
          title: 'Strategy Before Build',
          description: 'We align product thinking with business goals, market opportunity, and user realities before delivery begins.',
          icon: BrainCircuit
        },
        {
          title: 'Built for Clarity',
          description: 'Our workshops reduce ambiguity across scope, priorities, workflows, and feasibility—making next steps easier to act on.',
          icon: Search
        },
        {
          title: 'Execution-Ready Output',
          description: 'We deliver structured outputs that are useful for design, delivery, stakeholder buy-in, budgeting, and roadmap planning.',
          icon: Rocket
        }
      ],

      industriesTitle: 'Where Discover & Frame Adds Most Value',
      industriesDescription: 'Discovery is crucial whether you are building a Net-New disruptive platform or modernizing a legacy core.',
      industries: [
        { name: 'Startup Product Validation', description: 'Validate new product ideas before committing to full-scale build investment.' },
        { name: 'Enterprise Innovation Initiatives', description: 'Bring structure to internal product, platform, or digital innovation concepts.' },
        { name: 'Legacy Reimagination', description: 'Reframe outdated systems into modern product opportunities with clearer execution direction.' },
        { name: 'New Venture & MVP Planning', description: 'Define the leanest launchable version of a product while preserving long-term scalability.' },
        { name: 'Platform Extensions & New Modules', description: 'Assess what should be added, how it should work, and where it fits within the larger product strategy.' },
        { name: 'Complex Stakeholder Alignment', description: 'Create one common view across founders, business teams, product owners, design, and engineering.' }
      ],

      technologiesTitle: "Tools & Technologies We Use Across Discovery.",
      technologiesDescription: "Our workshops remain business-led and technology-aware. We use modern product, UX, architecture, and planning frameworks to move from ambiguity to a structured roadmap.",
      technologies: [
        { category: 'Product & Discovery', items: ['Miro', 'FigJam', 'Notion', 'Jira Product Discovery'] },
        { category: 'UX & Wireframing', items: ['Figma', 'Whimsical', 'Adobe XD', 'Clickable Prototyping Tools'] },
        { category: 'Architecture & Planning', items: ['Draw.io', 'Lucidchart', 'Architecture Frameworks', 'Roadmapping Templates'] },
        { category: 'Delivery Readiness', items: ['Jira / Confluence', 'Azure DevOps', 'Sprint Planning Systems', 'Estimation Models'] }
      ],

      customFAQs: [
        {
          question: "What is a Discover & Frame Workshop?",
          answer: "It is a structured, collaborative discovery engagement that helps define product vision, user needs, requirements, MVP scope, UX direction, technical thinking, and execution planning before development starts."
        },
        {
          question: "Why should I invest in a discovery workshop before development?",
          answer: "Because it reduces ambiguity, improves prioritization, validates assumptions earlier, and helps avoid expensive rework later in the lifecycle."
        },
        {
          question: "What deliverables do we receive at the end of the workshop?",
          answer: "Typical outputs include personas, prioritized feature scope, MVP definition, wireframes, architecture direction, and a roadmap covering timelines and commercials."
        },
        {
          question: "Is this useful only for startups?",
          answer: "No. It is equally valuable for enterprises exploring innovation initiatives, platform extensions, modernization paths, or new digital products."
        },
        {
          question: "Can Kangqore take the product forward after the workshop?",
          answer: "Yes. The workshop can seamlessly flow into UX design, architecture, MVP engineering, platform development, modernization, or managed delivery."
        },
        {
          question: "How long does a Discover & Frame Workshop usually take?",
          answer: "The duration depends on product complexity, stakeholder availability, and scope depth, but the goal is always to arrive at clarity faster than a conventional start-to-build process."
        }
      ],
      postCapabilitiesSections: (
        <>
          {deliverablesStepper}
          {discoveryCoESection}
        </>
      ),
      preWhyKangqoreSections: (
        <>
        </>
      ),
      postFAQSections: (
        <>
          {executionEcosystemSection}
        </>
      )
    },
    department
  };

  return (
    <div className="discovery-workshop-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        /* Custom 3D Diamond & Connector Animations */
        @keyframes diamond-float-3d {
          0%, 100% { transform: rotate(45deg) rotateX(12deg) translateZ(0); }
          50% { transform: rotate(45deg) rotateX(12deg) translateZ(20px); }
        }
        @keyframes connector-draw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes dot-ping {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        .stat-counter-text {
          font-variant-numeric: tabular-nums;
        }

        /* Custom dark execution CTA override */

          background-color: #0f172a !important;
          background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%) !important;
        }

          color: #ffffff !important;
        }

          background-color: rgba(255,255,255,0.1) !important;
        }

          color: #38bdf8 !important;
        }
      `}} />
      <ServicePageTemplate 
        service={pageData.service} 
        department={pageData.department}
      />
    </div>
  );
};

export default DiscoverFrameWorkshops;

