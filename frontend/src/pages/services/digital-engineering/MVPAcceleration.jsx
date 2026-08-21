import React, { useEffect, useRef, useState } from 'react';
import { 
  Rocket, Zap, Target, Layers, Search, BarChart3, 
  LayoutTemplate, MonitorSmartphone, Server, CalendarDays,
  CheckCircle2, Cpu, Radar, ArrowRight, ChevronRight,
  TrendingUp, Activity, Users, ShieldCheck, Workflow,
  Lightbulb, LineChart, Shield, Gauge,
  Compass, BrainCircuit, Package, Settings, Cloud,
  Briefcase, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ValueAccordion Component
const ValueAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className={`group overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${openIndex === idx ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl border-gray-100' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
          <button onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)} className="w-full flex items-center justify-between p-8 text-left">
            <span className={`text-xl font-bold transition-colors duration-300 ${openIndex === idx ? 'text-brand-blue' : 'text-gray-900 dark:text-white group-hover:text-brand-blue'}`}>{item.title}</span>
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${openIndex === idx ? 'bg-brand-blue border-brand-blue text-white rotate-90' : 'border-gray-200 text-gray-400'}`}>
              <span className="text-sm font-bold">{openIndex === idx ? '−' : '+'}</span>
            </div>
          </button>
          <div className={`transition-all duration-700 ease-in-out px-8 pb-8 ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-2xl">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const MVPAcceleration = () => {
  const processRef = useRef(null);
  const leftColRef = useRef(null);
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef = useRef(null);
  const whySectionRef = useRef(null);

  useEffect(() => {
    // 1. Diamond Entrance Animation
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true }
        }
      );
      gsap.to(diamondRef.current, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    // 2. Differentiator items staggered entrance
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        {
          opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true }
        }
      );
    }

    // 3. Smooth Pinning for MVP Process (10 Steps)
    if (processRef.current && leftColRef.current) {
      let mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: processRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
          scrub: 1
        });

        gsap.fromTo(processRef.current.querySelectorAll('.stepper-node'), 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, force3D: true,
            scrollTrigger: { trigger: processRef.current, start: "top 60%", once: true }
          }
        );

        gsap.fromTo(processRef.current.querySelectorAll('.stepper-content'), 
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, force3D: true,
            scrollTrigger: { trigger: processRef.current, start: "top 60%", once: true }
          }
        );
      });
    }

    // 5. Journey Timeline — Creative Animated Path
    if (journeyRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 0.8,
        }
      });

      // Draw the SVG path progressively
      const pathEl = journeyRef.current.querySelector('.journey-curve-path');
      if (pathEl) {
        const pathLength = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }

      // Glow path follows main path
      const glowEl = journeyRef.current.querySelector('.journey-curve-glow');
      if (glowEl) {
        const gl = glowEl.getTotalLength();
        gsap.set(glowEl, { strokeDasharray: gl, strokeDashoffset: gl });
        tl.to(glowEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
      }

      // Reveal each node with scale (removed expensive filter:blur animation)
      const nodes = journeyRef.current.querySelectorAll('.journey-node');
      nodes.forEach((node, i) => {
        tl.fromTo(node,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' },
          i * 0.2
        );
      });

      // Stagger card content entrance (non-scrubbed, fires once)
      const cards = journeyRef.current.querySelectorAll('.journey-card');
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true }
        }
      );
    }

    // 4. Stat counter animation
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
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => { el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`); }
              });
            }
          });
        }
      });
    };

    const timer = setTimeout(animateCounters, 500);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // CAPABILITIES DATA (with bgImages like Discover page)
  // ============================================
  const capabilities = [
    {
      title: "Smart Build to First Traction",
      description: "Shape and launch an MVP that helps you validate demand early and reach your first meaningful users faster.",
      bgImage: '/images/capabilities/iot-connected.png',
      items: [
        "Focus the build on launch-critical features",
        "Reduce waste through lean scoping",
        "Accelerate real-user validation",
        "Create a stronger path to first traction"
      ],
      micro: "Get the first 100 users to use your application."
    },
    {
      title: "Insight-Led Product Evolution",
      description: "Use relevant user and product signals to refine the MVP with better confidence after launch.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Capture actionable product feedback",
        "Improve roadmap decisions with real usage signals",
        "Reduce assumption-led iteration",
        "Guide product evolution with sharper insight"
      ],
      micro: "Harness user feedback to fuel product evolution."
    },
    {
      title: "Dedicated Cross-Functional Team",
      description: "Bring together the right mix of product, design, and engineering talent around the MVP from day one.",
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        "Agile product and engineering alignment",
        "Focused ownership across the build cycle",
        "Faster collaboration and delivery movement",
        "Better decision-making across disciplines"
      ],
      micro: "A hand-picked agile team best suited for your dream project."
    },
    {
      title: "Scalable Design System",
      description: "Create a product experience that stays consistent, reusable, and ready to grow across screens and platforms.",
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        "Cohesive UI patterns from the start",
        "Faster design-to-development handoff",
        "Reusable interface logic for scale",
        "Stronger product consistency across touchpoints"
      ],
      micro: "Product-perfect design system for cohesive branding."
    },
    {
      title: "Universal Codebase",
      description: "Reduce build and maintenance complexity through a more unified development approach.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        "Shared logic across platforms",
        "Faster release cycles",
        "Lower long-term development overhead",
        "Simpler evolution of the MVP foundation"
      ],
      micro: "Reduced complexity with a single codebase for all platforms."
    },
    {
      title: "Scalable Architecture",
      description: "Build the MVP on a technical foundation that can handle growth without forcing early rework.",
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        "Future-ready architecture decisions",
        "Better readiness for traffic and usage growth",
        "Cleaner extensibility for next-phase features",
        "Stronger long-term engineering efficiency"
      ],
      micro: "Future-proof architecture for a growing user base."
    }
  ];

  // ============================================
  // PROCESS STEPPER SECTION (10 Steps - pinned like Discover)
  // ============================================
  const processSteps = [
    { title: "STEP 01: Discovery", points: [
      "Understanding the business vision, user problem, market context, and commercial intent behind the product idea.",
      "Map the competitive landscape and identify unique opportunity levers."
    ]},
    { title: "STEP 02: Idea Validation", points: [
      "Validating whether the concept solves a meaningful problem, has market relevance, and deserves focused MVP investment.",
      "Test assumptions through structured feasibility and desirability analysis."
    ]},
    { title: "STEP 03: MVP Scoping", points: [
      "Defining the leanest, highest-value first release by separating must-have capabilities from later-phase enhancements.",
      "Align MVP scope with business goals and user priorities."
    ]},
    { title: "STEP 04: Business Analysis", points: [
      "Translating product intent into structured requirements, workflows, use cases, and delivery-aligned clarity.",
      "Engineer a structured requirements backlog for the functional perimeter."
    ]},
    { title: "STEP 05: Product Design", points: [
      "Shaping intuitive user journeys, UX direction, and core interface logic so the MVP feels usable and credible.",
      "Architect high-fidelity wireframes that serve as a functional skeleton."
    ]},
    { title: "STEP 06: Agile Development", points: [
      "Building in fast, iterative cycles using a lean engineering model optimized for speed and controlled delivery.",
      "Sprint-based execution with continuous integration and quality checks."
    ]},
    { title: "STEP 07: Iterative Shipping", points: [
      "Releasing in measured increments, reducing launch friction while enabling early signals and quicker learning.",
      "Deploy fast, learn faster, and course-correct in real time."
    ]},
    { title: "STEP 08: User Feedback Integration", points: [
      "Capturing real user input and behavioral signals to improve product relevance and sharpen the next decisions.",
      "Structured feedback loops that turn raw data into actionable insight."
    ]},
    { title: "STEP 09: Pivoting Strategy", points: [
      "Refining scope or reshaping priorities without losing momentum when feedback reveals a better direction.",
      "Data-informed pivots that protect investment while opening new opportunity."
    ]},
    { title: "STEP 10: Continuous Delivery", points: [
      "Establishing a delivery rhythm that keeps the product evolving through structured, scale-ready releases.",
      "From MVP to mature product through governed, incremental growth."
    ]}
  ];

  // ============================================
  // DATA: Value Accordion + What You Get
  // ============================================
  const valueItems = [
    { 
      title: "Validate before you overbuild", 
      content: "Test the business concept against real market demand and reduce early-stage investment risk.", 
      icon: <ShieldCheck className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop"
    },
    { 
      title: "Faster path from idea to launch", 
      content: "Move from concept to usable MVP through structured scoping, design, agile build, and iterative release.", 
      icon: <Rocket className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    { 
      title: "Sharper investor confidence", 
      content: "Create stronger credibility through a product that demonstrates demand, direction, and execution intent.", 
      icon: <TrendingUp className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop"
    },
    { 
      title: "Scalable thinking from day one", 
      content: "Build the MVP on an architecture and design foundation that supports future expansion.", 
      icon: <Server className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
    },
    { 
      title: "Learning built into delivery", 
      content: "Use user feedback, usage signals, and iteration loops to improve the product continuously.", 
      icon: <RefreshCw className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    },
    { 
      title: "Cost efficiency by design", 
      content: "Prioritize what matters first so teams launch smarter, not just cheaper. Eliminate waste.", 
      icon: <Target className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const whatYouGetCards = [
    { title: "First-100 User Focus", desc: "Build with adoption in mind and create the conditions for meaningful early traction.", icon: <Users /> },
    { title: "Relevant Product Data", desc: "Use real feedback and real signals to shape what evolves next.", icon: <BarChart3 /> },
    { title: "Dedicated Project Team", desc: "Work with a curated agile squad aligned to your product stage and ambition.", icon: <Shield /> },
    { title: "Scalable Design System", desc: "Create UI consistency and product coherence across devices and future releases.", icon: <LayoutTemplate /> },
    { title: "Universal Codebase", desc: "Reduce technical complexity and speed up multi-platform execution.", icon: <MonitorSmartphone /> },
    { title: "Scalable Architecture", desc: "Lay a future-ready technical foundation that can grow with product demand.", icon: <Server /> }
  ];

  // ============================================
  // SUGGESTION 1: preMatrixSection
  // ============================================
  const preMatrixSection = (
    <>
      <div className="relative py-28 md:py-36 px-4 overflow-hidden bg-white dark:bg-black">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left side: Happy Team Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gray-100 dark:bg-[#0a0a0c]/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden aspect-square">
                <img 
                  src="/images/happy_team.png" 
                  alt="Happy Startup Team" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right side: Quote Content */}
            <div className="flex items-start gap-6 lg:gap-10">
              {/* Accent vertical line */}
              <div className="hidden md:flex flex-col items-center gap-3 pt-2">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-gray-200"></div>
                <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
                <div className="w-px h-32 bg-gradient-to-b from-gray-200 to-transparent"></div>
              </div>

              <div className="flex-1">
                {/* Large decorative quote mark */}
                <div className="text-7xl md:text-9xl font-serif text-gray-900 dark:text-white/[0.05] leading-none select-none mb-2">"</div>

                <p className="text-2xl md:text-4xl lg:text-[2.75rem] font-light text-gray-800 dark:text-gray-50 leading-[1.3] font-display -mt-12 md:-mt-16 pl-2 lg:pl-0">
                  Helping startups and digital product teams validate ideas faster, launch sharper MVPs, and build the foundation for{' '}
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-normal">scalable growth.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="py-32 bg-white dark:bg-black relative overflow-hidden" ref={whySectionRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
                The fastest way to waste money is to build too much, <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">too early.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                A strong MVP is not just a smaller product. It is a smarter first step. Kangqore helps organizations validate product direction, attract early users, and improve investor confidence.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-brand-blue shadow-lg">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-3 text-transparent bg-clip-text bg-brand-gradient">THE VALIDATION</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">
                      "An MVP helps test whether the market actually wants what you are building before major investment is committed."
                    </p>
                  </div>
                </div>
              </div>
              <div className="insight-card p-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] border border-transparent hover:border-brand-blue/10 transition-all group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center text-emerald-500 shadow-lg">
                    <Gauge className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">THE LEVERAGE</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed italic">
                      "A well-scoped MVP improves funding readiness, speeds user learning, and lowers the cost of future scaling."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32" style={{ backgroundColor: '#fefffc' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">

                <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                  Value We <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Deliver.</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                <p className="text-lg text-gray-500 font-light leading-relaxed">
                  With MVP Acceleration, we prioritize what matters first so teams launch smarter, not just cheaper.
                </p>
              </div>
            </div>

            {/* Premium Card Grid */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {valueItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group relative h-[320px] rounded-3xl overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: '#fefffc', border: 'none', boxShadow: 'none' }}
                  >
                    {/* Background Image Layer */}
                    <img 
                      src={item.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 scale-100 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay (Dark Gradient) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
                    
                    <div className="relative z-10 h-full p-8 flex flex-col justify-start">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:text-white transition-all duration-500 shadow-none border-none" style={{ backgroundColor: 'transparent' }}>
                        {item.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-white transition-colors duration-500">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // ============================================
  // SUGGESTION 2: What You Get Section
  // ============================================
  const whatYouGetSection = (
    <section className="py-32 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-left mb-20">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            What You <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Get.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-500 font-light max-w-3xl">
            A comprehensive suite of solutions aligned with our MVP Acceleration delivery engine.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whatYouGetCards.map((card, i) => (
            <div key={i} className="p-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gray-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{card.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-light">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // SUGGESTION 7: Creative Animated Journey Timeline
  // ============================================
  const journeyPhases = [
    { phase: 'IDEA', icon: <Lightbulb className="w-7 h-7" />, title: 'Concept Spark', desc: 'Raw idea, business hypothesis, or innovation opportunity.', gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
    { phase: 'VALIDATE', icon: <Search className="w-7 h-7" />, title: 'Discovery & Validation', desc: 'Market analysis, user research, and feasibility testing.', gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
    { phase: 'BUILD', icon: <Cpu className="w-7 h-7" />, title: 'MVP Engineering', desc: 'Agile sprints, lean scoping, and iterative shipping.', gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
    { phase: 'LAUNCH', icon: <Rocket className="w-7 h-7" />, title: 'Market Entry', desc: 'First 100 users, feedback loops, and product-market signals.', gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true },
    { phase: 'SCALE', icon: <TrendingUp className="w-7 h-7" />, title: 'Growth & Evolution', desc: 'Platform scaling, feature expansion, and enterprise readiness.', gradient: 'from-purple-500 to-purple-700', ring: 'border-purple-400', glow: 'shadow-purple-500/40' }
  ];

  // Node positions on the curved SVG path (x-values of 5 evenly spaced nodes across 1000px viewBox)
  const nodePositions = [
    { cx: 100, cy: 180 },
    { cx: 300, cy: 120 },
    { cx: 500, cy: 180 },
    { cx: 700, cy: 120 },
    { cx: 900, cy: 180 }
  ];

  const journeyTimeline = (
    <section className="py-32 overflow-hidden relative" style={{ backgroundColor: '#fefffc' }}>
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          {/* LEFT SIDE — Animated SVG Graphic + Vertical Phase Cards */}
          <div className="w-full lg:w-[55%] relative">
            {/* Vertical SVG Curve (desktop only) */}
            <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px]" style={{ zIndex: 1 }}>
              <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="journey-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="25%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#2564ea" />
                    <stop offset="75%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <filter id="journey-glow-v">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background track */}
                <path
                  d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000"
                  stroke="#cbd5e1" strokeOpacity="0.3" strokeWidth="2" fill="none"
                />

                {/* Glow path */}
                <path
                  className="journey-curve-glow"
                  d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000"
                  stroke="url(#journey-grad-v)" strokeWidth="3" strokeLinecap="round" fill="none"
                  filter="url(#journey-glow-v)" opacity="0.3"
                />

                {/* Main animated path */}
                <path
                  className="journey-curve-path"
                  d="M 15 0 C 15 80, 22 120, 15 200 S 8 320, 15 400 C 22 480, 8 560, 15 600 S 22 720, 15 800 C 8 880, 15 950, 15 1000"
                  stroke="url(#journey-grad-v)" strokeWidth="1.5" strokeLinecap="round" fill="none"
                />

                {/* Animated nodes at 5 positions */}
                {[100, 300, 500, 700, 900].map((cy, i) => (
                  <g key={i} className="journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                    <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#journey-grad-v)" strokeWidth="0.8" opacity="0.2">
                      <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx="15" cy={cy} r="7" fill="white" stroke="url(#journey-grad-v)" strokeWidth="1.5" />
                    <circle cx="15" cy={cy} r="3" fill="url(#journey-grad-v)" opacity="0.7">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="15" y={cy + 1} textAnchor="middle" dominantBaseline="central" fill="gray" fontSize="5" fontWeight="800" fontFamily="monospace">
                      {String(i + 1).padStart(2, '0')}
                    </text>
                  </g>
                ))}

                {/* Floating particles */}
                {[0, 1, 2].map(i => (
                  <circle key={`pv-${i}`} className="journey-particle" cx="15" cy={i * 200} r="1.5" fill="#3b82f6" opacity="0">
                    <animate attributeName="cy" values={`0;1000`} dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                    <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
                  </circle>
                ))}
              </svg>
            </div>

            {/* Vertical Phase Cards */}
            <div className="space-y-6 lg:pl-[55px]">
              {journeyPhases.map((item, idx) => (
                <div key={idx} className="journey-card group" style={{ perspective: '800px' }}>
                  <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 flex items-start gap-6">
                    {/* Hover glow */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`}></div>

                    {/* Icon */}
                    <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.glow} group-hover:scale-110 transition-all duration-500`}>
                      {item.icon}
                      <div className={`absolute inset-0 rounded-2xl border-2 ${item.ring} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-gray-300 uppercase">{item.phase}</div>
                        {item.kangqore && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full">
                            <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse"></div>
                            <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue uppercase">Kangqore</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors duration-300">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile vertical line */}
            <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px">
              <div className="w-full h-full bg-gradient-to-b from-slate-600 via-brand-blue to-purple-500 opacity-20 rounded-full"></div>
            </div>
          </div>

          {/* RIGHT SIDE — Heading, Description & Summary */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue/5 border border-brand-blue/10 rounded-full mb-8">
                  <Rocket className="w-4 h-4 text-brand-blue" />
                  <span className="text-xs font-bold tracking-[0.3em] text-brand-blue uppercase">Your MVP Journey</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                  From Idea to <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Market Leader.</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                  A clear, structured path that takes your concept through validation, launch, and growth — with Kangqore engineering every step.
                </p>
              </div>

              {/* Animated Orbital Graphic */}
              <div className="hidden lg:block relative w-full" style={{ height: '280px' }}>
                <svg className="w-full h-full" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet" fill="none">
                  <defs>
                    <linearGradient id="journey-grad-h" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" />
                      <stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="orb-glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background glow */}
                  <circle cx="250" cy="140" r="130" fill="url(#center-glow)" />

                  {/* Concentric orbit rings */}
                  <circle cx="250" cy="140" r="40" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="30s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="140" r="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3">
                    <animateTransform attributeName="transform" type="rotate" values="360 250 140;0 250 140" dur="45s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="140" r="110" stroke="url(#journey-grad-h)" strokeWidth="0.8" strokeDasharray="8 8" opacity="0.15">
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="60s" repeatCount="indefinite" />
                  </circle>

                  {/* Revolving orbit group — rotates around center */}
                  <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 250 140;360 250 140" dur="40s" repeatCount="indefinite" />

                    {/* Connection lines + Phase dots (all revolve together) */}
                    {[
                      { angle: -90, label: 'IDEA', color: '#64748b', r: 110 },
                      { angle: -18, label: 'VALIDATE', color: '#3b82f6', r: 110 },
                      { angle: 54, label: 'BUILD', color: '#2564ea', r: 110 },
                      { angle: 126, label: 'LAUNCH', color: '#10b981', r: 110 },
                      { angle: 198, label: 'SCALE', color: '#a855f7', r: 110 }
                    ].map((item, i) => {
                      const rad = (item.angle * Math.PI) / 180;
                      const x = 250 + item.r * Math.cos(rad);
                      const y = 140 + item.r * Math.sin(rad);
                      const labelX = 250 + (item.r + 22) * Math.cos(rad);
                      const labelY = 140 + (item.r + 22) * Math.sin(rad);
                      return (
                        <g key={`orb-${i}`}>
                          {/* Connector line */}
                          <line x1="250" y1="140" x2={x} y2={y} stroke={item.color} strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2">
                            <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                          </line>
                          {/* Pulse ring */}
                          <circle cx={x} cy={y} r="10" fill="none" stroke={item.color} strokeWidth="0.5" opacity="0.3">
                            <animate attributeName="r" values="10;16;10" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                          </circle>
                          {/* Main dot */}
                          <circle cx={x} cy={y} r="8" fill="white" stroke={item.color} strokeWidth="1.5" />
                          <circle cx={x} cy={y} r="3" fill={item.color} opacity="0.8">
                            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                          </circle>
                          {/* Counter-rotating label (stays upright) */}
                          <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fill={item.color} fontSize="7" fontWeight="700" fontFamily="monospace" letterSpacing="1" opacity="0.6">
                            <animateTransform attributeName="transform" type="rotate" values={`0 ${labelX} ${labelY};-360 ${labelX} ${labelY}`} dur="40s" repeatCount="indefinite" />
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Central hub (stationary, rendered on top) */}
                  <circle cx="250" cy="140" r="22" fill="white" stroke="url(#journey-grad-h)" strokeWidth="2" filter="url(#orb-glow)" />
                  <circle cx="250" cy="140" r="12" fill="url(#journey-grad-h)" opacity="0.15">
                    <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="250" y="141" textAnchor="middle" dominantBaseline="central" fill="#1e40af" fontSize="9" fontWeight="800" fontFamily="monospace" letterSpacing="2">MVP</text>

                  {/* Floating micro-particles on orbit */}
                  {[0, 1, 2, 3].map(i => (
                    <circle key={`mp-${i}`} r="1.5" fill="#3b82f6" opacity="0.4">
                      <animateMotion dur={`${8 + i * 3}s`} repeatCount="indefinite" begin={`${i * 2}s`}>
                        <mpath href="#orbit-path" />
                      </animateMotion>
                      <animate attributeName="opacity" values="0;0.5;0.5;0" dur={`${8 + i * 3}s`} repeatCount="indefinite" begin={`${i * 2}s`} />
                    </circle>
                  ))}
                  <circle id="orbit-path" cx="250" cy="140" r="75" fill="none" stroke="none" />
                </svg>
              </div>

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Phases</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">05</div>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Timeline</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">10-16<span className="text-sm text-gray-400 ml-1">wks</span></div>
                </div>
                <div>
                  <div className="font-mono text-[11px] text-gray-300 tracking-widest uppercase font-bold mb-2">Kangqore</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-brand-gradient">3/5</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );

  const processSection = (
    <section className="py-24 bg-white dark:bg-black relative z-[1]" ref={processRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          <div className="lg:w-[45%] h-full bg-white dark:bg-black" ref={leftColRef} style={{ zIndex: 1 }}>
            <div className="space-y-12">
              <div>
                <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
                  Accelerated Execution: <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">10-Step MVP Engine.</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80" 
                  alt="MVP Process" 
                  className="relative z-10 rounded-[2rem] shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] relative py-12">
            <div className="absolute left-1 top-2 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] z-0"></div>
            <div className="space-y-24">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative pl-12 group">
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
  // 3D DIAMOND COE SECTION (matching Discover page)
  // ============================================
  const mvpCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black z-[10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our <strong className="text-brand-blue">MVP Acceleration CoE</strong> provides a high-velocity execution blueprint, surrounding your product idea with four critical delivery layers.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace "build-and-hope" with "validate-and-accelerate." By unifying lean discovery, rapid engineering, strategic validation, and scalable growth thinking, we ensure your MVP is built on a foundation of confidence rather than a collection of guesses.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                  <defs>
                    <linearGradient id="mvp-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="300" cy="40" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#mvp-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#mvp-blue-grad)" strokeWidth="3" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite' }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Lean<br/>Discovery</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Rapid<br/>Engineering</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Strategic<br/>Validation</div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}>
                        <div className="-rotate-45 text-center text-white font-bold text-[16px]">Scalable<br/>Growth</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>Vision & opportunity alignment •</li>
                    <li>Market-fit feasibility •</li>
                    <li>Idea validation & scoping •</li>
                    <li>Business model analysis •</li>
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• Agile sprint execution</li>
                    <li>• Cross-platform codebase</li>
                    <li>• CI/CD pipeline setup</li>
                    <li>• Iterative shipping cycles</li>
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-right">
                    <li>User feedback integration •</li>
                    <li>Product-market fit signals •</li>
                    <li>Pivot strategy readiness •</li>
                    <li>Data-driven decisions •</li>
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 text-left">
                    <li>• Scalable architecture design</li>
                    <li>• Design system consistency</li>
                    <li>• Performance optimization</li>
                    <li>• Growth-ready infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Mobile CoE Cards */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Lean Discovery', items: ['Vision alignment', 'Market-fit'], gradient: 'from-blue-600 to-blue-800' },
                { title: 'Rapid Engineering', items: ['Agile sprints', 'CI/CD'], gradient: 'from-blue-400 to-blue-600' },
                { title: 'Strategic Validation', items: ['User feedback', 'Pivot readiness'], gradient: 'from-blue-900 to-slate-900' },
                { title: 'Scalable Growth', items: ['Architecture', 'Performance'], gradient: 'from-cyan-500 to-cyan-700' }
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
              { num: 1, title: 'Validation-First Engineering', text: 'We don\'t just build fast—we build what matters. Every feature is validated against real user signals before heavy investment.' },
              { num: 2, title: 'Launch-Critical Focus', text: 'We separate must-have from nice-to-have rigorously, so your MVP ships with only what creates traction—nothing more, nothing less.' },
              { num: 3, title: 'Scalable From Day One', text: 'Even for lean MVPs, we define a technical path that allows room for enterprise-scale growth and future platform extensions.' },
              { num: 4, title: 'Investor-Ready Output', text: 'Our MVPs are built to demonstrate demand, direction, and execution quality—creating stronger credibility for funding conversations.' },
              { num: 5, title: 'Continuous Learning Engine', text: 'We embed feedback loops, usage analytics, and iteration frameworks directly into the delivery process—so the product improves with every cycle.' }
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
  // EXECUTION ECOSYSTEM SECTION (matching Discover page)
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative z-[10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight leading-[0.95] font-display">
              Related Execution <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
              Extend your MVP into a full-scale product. Kangqore provides the end-to-end engineering muscle to scale what you've validated.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Discover & Frame Workshops', link: '/services/consulting-advisory/discover-frame-workshops', icon: <Compass className="w-5 h-5" />, desc: 'Structured discovery before you build.' },
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>
              <div className="absolute top-0 left-0 p-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-md z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>blueprint_id:</span> <span className="text-brand-blue">#KG_MVP_A01</span></div>
                <div className="flex justify-between gap-4"><span>logic_state:</span> <span className="text-emerald-500">LAUNCH_READY</span></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative"><Rocket className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300"><Compass className="w-12 h-12 text-brand-blue" /></div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Discover_Frame</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300"><Cpu className="w-12 h-12 text-[#2564ea]" /></div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Digi_Eng</span>
                </div>
              </div>
              <div className="absolute bottom-10 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative -translate-x-4 hover:translate-x-0 transition-transform duration-300"><Radar className="w-12 h-12 text-white" /></div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-widest font-mono uppercase -translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Modernize</span>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="exec-flow-grad-mvp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,120" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L120,400" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M250,250 L380,400" stroke="url(#exec-flow-grad-mvp)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <g><circle r="3" fill="#0066FF" /><animateMotion path="M250,250 L250,120" dur="2s" repeatCount="indefinite" /></g>
                <g><circle r="3" fill="#00D2FF" /><animateMotion path="M250,250 L120,400" dur="2.5s" repeatCount="indefinite" /></g>
                <g><circle r="3" fill="#6366f1" /><animateMotion path="M250,250 L380,400" dur="3s" repeatCount="indefinite" /></g>
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
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    description: 'Transforming product ideas into high-performance digital reality.',
    icon: <Briefcase className="w-6 h-6" />
  };

  const pageData = {
    service: {
      name: 'MVP Acceleration',
      titleLine1: 'MVP',
      titleHighlight: 'Acceleration.',
      slug: 'mvp-acceleration',
      videoBackground: '/videos/engineering-rd-bg.mp4',
      shortDescription: "Turn product ideas into launch-ready momentum.",
      fullDescription: (
        <div className="space-y-4">
          <p className="font-light tracking-tight leading-snug opacity-80">
            Kangqore helps startups, innovation teams, and growth-stage businesses move from concept to market with faster, smarter MVP execution. We combine product discovery, validation, design, engineering, and launch-readiness to shape fundable, scalable MVPs that reduce waste, sharpen learning, and accelerate time to traction.
          </p>
        </div>
      ),
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',

      stats: [
        { value: 'Validate', label: 'Market fit & assumptions', color: 'text-blue-500' },
        { value: 'Accelerate', label: 'Idea-to-launch speed', color: 'text-emerald-500' },
        { value: 'Reduce', label: 'Early-stage waste', color: 'text-purple-500' },
        { value: 'Build', label: 'Scalable foundations', color: 'text-brand-blue' }
      ],

      primaryButton: { text: "Talk To Our Experts", link: "/contact" },
      secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
      ctaTitle: 'Ready to turn your idea into a fundable, launch-ready product?',
      ctaDescription: "Let's validate the opportunity, define the right MVP, and build a product foundation that gets you to market faster—with stronger confidence, sharper scope, and room to scale.",
      ctaSecondaryButton: { text: "Explore Capabilities", link: "#capabilities" },

      trustStripText: 'Helping startups, innovation teams, and growth-stage businesses validate ideas faster, launch sharper MVPs, and build the foundation for scalable growth.',

      highFidelity: {
        narrative: {
          badge: 'VELOCITY :: 2026',
          titleLine1: 'MVP Acceleration.',
          titleHighlight: 'Turn product ideas into launch-ready momentum.',
          titleLine2: '',
          description: 'Kangqore helps startups and innovation teams move from concept to market with faster, smarter MVP execution. We combine product discovery, validation, design, engineering, and launch-readiness to shape fundable, scalable MVPs.',
          bottleneckLabel: 'The Challenge',
          bottleneckText: 'The fastest way to waste money is to build too much, too early.',
          requirementLabel: 'The Solution',
          requirementText: 'A strong MVP is not just a smaller product. It is a smarter first step.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
          statusLabel: 'MVP Status',
          statusValue: 'ACCELERATING'
        },
        philosophy: {
          icon: <Rocket className="w-7 h-7 text-gray-900 dark:text-white" />,
          title: 'Our MVP',
          titleHighlight: 'Acceleration Model.',
          description: 'We unify product intelligence with high-velocity engineering to reach your first traction milestone faster.',
          pills: ['Validate', 'Accelerate', 'Reduce', 'Build'],
          features: [
            {
              title: 'Validate',
              label: 'Market Fit & Critical Assumptions',
              icon: <Search className="w-5 h-5 text-gray-400" />,
              content: 'Test the business concept against real market demand. We separate must-have capabilities from later-phase enhancements to reduce early-stage investment risk.'
            },
            {
              title: 'Accelerate',
              label: 'Idea-to-Launch Speed',
              icon: <Zap className="w-5 h-5 text-gray-400" />,
              content: 'Move from zero to one with structural speed. Our Blitz method combines rapid prototyping with agile execution to shave weeks off typical timelines.'
            },
            {
              title: 'Reduce',
              label: 'Early-Stage Waste & Debt',
              icon: <TrendingUp className="w-5 h-5 text-gray-400" />,
              content: 'Avoid building too much too early. We focus resources on the "Engine" of your value proposition, ensuring every line of code serves a validation purpose.'
            },
            {
              title: 'Build',
              label: 'Scalable Foundations',
              icon: <Compass className="w-5 h-5 text-gray-400" />,
              content: 'Architecture designed for growth. We lay the technical and design foundation that supports future expansion without forcing early rework.'
            }
          ]
        },
        matrix: {
          engineId: 'Engine :: MVP_Blitz_V4',
          title: 'Our MVP Acceleration Delivery Model.',
          subtext: 'At Kangqore, MVP acceleration is structured as a disciplined execution model—built to validate ideas quickly, reduce avoidable waste, and move products from concept to market with stronger confidence.',
          layers: [
            { title: 'Frame', id: 'MV_01', icon: <Search />, desc: 'Understand the opportunity, problem, user context, and business objective.' },
            { title: 'Scope', id: 'MV_02', icon: <Target />, desc: 'Define the MVP, prioritize features, align workflows, and structure the delivery path.' },
            { title: 'Build', id: 'MV_03', icon: <Cpu />, desc: 'Design, engineer, validate, and release through agile execution.' },
            { title: 'Evolve', id: 'MV_04', icon: <Activity />, desc: 'Learn from users, iterate with intent, and prepare the product for broader growth.' }
          ]
        },
        schematic: {
          titleLine1: 'Engineering Excellence. ',
          titleHighlight: 'Absolute Accountability.'
        }
      },

      capabilitiesTitle: "Our Capabilities.",
      capabilitiesDescription: "Kangqore's MVP acceleration capabilities are designed to help startups and innovation teams move from idea to launch with sharper execution, lower waste, and stronger readiness for scale.",
      capabilities: capabilities,

      trustPillars: [
        { title: 'Validate before you overbuild', tag: 'Validation', description: 'Test the business concept against real market demand and reduce early-stage investment risk.' },
        { title: 'Faster path from idea to launch', tag: 'Velocity', description: 'Move from concept to usable MVP through structured scoping, design, agile build, and iterative release.' },
        { title: 'Sharper investor confidence', tag: 'Credibility', description: 'Create stronger credibility through a product that demonstrates demand, direction, and execution intent.' },
        { title: 'Scalable thinking from day one', tag: 'Foundation', description: 'Build the MVP on architecture and design foundations that support future expansion.' },
        { title: 'Learning built into delivery', tag: 'Intelligence', description: 'Use user feedback, usage signals, and iteration loops to improve the product continuously.' },
        { title: 'Cost efficiency without cutting corners', tag: 'Efficiency', description: 'Prioritize what matters first so teams launch smarter, not just cheaper.' }
      ],

      whyKangqore: [
        { title: 'Strong Foundation', description: 'Scalable architecture and product thinking that support future expansion from the first release.', icon: Layers },
        { title: 'Smart Build', description: 'Reduced time and cost through focused scoping, reusable patterns, and efficient engineering choices.', icon: Zap },
        { title: 'AI-Ready Acceleration', description: 'Use modern AI capabilities where they create real advantage in speed, product intelligence, or workflow efficiency.', icon: Cpu },
        { title: 'Targeted User Testing', description: 'Go beyond basic functionality to ensure the MVP actually resonates with its intended audience.', icon: Radar },
        { title: 'Quick Shipping', description: 'Agile execution and standardized delivery practices that move your vision faster toward market.', icon: Rocket },
        { title: 'Industry Expertise', description: 'Context-aware product decisions shaped by real business, domain, and user challenges.', icon: Lightbulb }
      ],

      industriesTitle: 'Where MVP Acceleration Adds Most Value',
      industriesDescription: 'MVP acceleration is crucial whether you are building a net-new disruptive platform or validating a digital innovation concept.',
      industries: [
        { name: 'Startup Product Validation', description: 'Validate new product ideas before committing to full-scale build investment.' },
        { name: 'Enterprise Innovation Initiatives', description: 'Bring structure to internal product, platform, or digital innovation concepts.' },
        { name: 'New Venture & MVP Planning', description: 'Define the leanest launchable version of a product while preserving long-term scalability.' },
        { name: 'Growth-Stage Product Scaling', description: 'Scale a validated MVP into a broader product with deeper capability and wider reach.' },
        { name: 'Platform Extensions & New Modules', description: 'Assess what should be added, how it should work, and where it fits within the larger product strategy.' },
        { name: 'Cross-Platform Product Launch', description: 'Launch on multiple platforms simultaneously with a unified codebase and consistent UX.' }
      ],

      technologiesTitle: "Tools & Technologies We Use Across MVP Acceleration.",
      technologiesDescription: "Our MVP execution is technology-aware and business-led. We use modern engineering, design, and cloud-native stacks to move from concept to launch with speed and confidence.",
      technologies: [
        { category: 'Frontend', items: ['React', 'Next.js', 'React Native', 'Flutter'] },
        { category: 'Backend', items: ['Node.js', 'Python', 'Go', 'GraphQL'] },
        { category: 'Cloud & DevOps', items: ['AWS', 'GCP', 'Docker', 'CI/CD Pipelines'] },
        { category: 'Design & Product', items: ['Figma', 'Whimsical', 'Jira', 'Notion'] }
      ],

      customFAQs: [
        { question: "What does MVP Acceleration usually cost?", answer: "MVP cost depends on scope, complexity, feature depth, team composition, and speed expectations. The right way to estimate is by aligning business goals, MVP scope, and technical complexity before build begins." },
        { question: "Why choose Kangqore for MVP Acceleration?", answer: "Because early-stage products need more than coding speed. They need concept validation, cost discipline, execution clarity, and a build model that helps test the core idea with real users before overspending." },
        { question: "How does an MVP help the business?", answer: "An MVP helps you validate the concept before committing to full-scale product development. It gives you earlier user feedback, reveals issues sooner, reduces wasted investment, and supports better product decisions." },
        { question: "How do you ensure scalability and flexibility for future growth?", answer: "By choosing scalable technologies, using modular architecture, and designing the MVP so future features can be added without rewriting the whole product." },
        { question: "What technologies and frameworks do you use for MVP development?", answer: "The stack is chosen according to the product's needs. We leverage multiple modern options across frontend, backend, and AI/cloud ecosystems." },
        { question: "How do you ensure a smooth transition from MVP to a full product?", answer: "We design for scale-readiness from the start through adaptive UX systems, extensible architecture, documented decisions, and a cleaner path from validation-stage MVP to longer-term product evolution." },
        { question: "How long does MVP development usually take?", answer: "Timeline depends on complexity: around 10–12 weeks for simpler MVPs, about 3–4 months for average MVPs, and up to 6 months or more for complex MVPs." }
      ],

      preMatrixSection: preMatrixSection,

      postCapabilitiesSections: (
        <>
          {processSection}
          {mvpCoESection}
          {whatYouGetSection}
          {journeyTimeline}
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
    <div className="mvp-acceleration-page-override">
      <style dangerouslySetInnerHTML={{__html: `
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
        /* Ensure all major sections layer above the GSAP-pinned stepper */
        .mvp-acceleration-page-override > div > section {
          position: relative;
          z-index: 5;
          background-color: inherit;
        }

          background-color: #0f172a !important;
          background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%) !important;
          position: relative;
          z-index: 10;
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

export default MVPAcceleration;
