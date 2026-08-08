import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Search, Layers, Activity, ShieldCheck, 
  Cloud, Network, Database, ArrowRight,
  Award, Target, Users, Lightbulb, Globe, Shield,
  BrainCircuit, Bot, Workflow, CheckCircle2,
  Heart, Briefcase, Lock, Cpu, Radar, Eye, TrendingUp, BarChart3, Gauge,
  Building2, Factory, ShoppingCart, Compass, BookOpen, Rocket,
  Mic2, MapPin, CreditCard, GraduationCap, Landmark, Plane
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechnologyConsulting = () => {
  // ============================================
  // A. HERO SECTION
  // ============================================
  const service = {
    name: 'Technology Consulting',
    titleLine1: 'Technology Consulting',
    titleHighlight: 'Services.',
    slug: 'technology-consulting',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    shortDescription: "Shape the right technology decisions before execution gets expensive.",
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises, scale-ups, and digital-first businesses define sharper technology roadmaps, modernize decision-making, and adopt the right platforms with confidence. We bring strategic clarity, engineering depth, and execution realism to every transformation journey—so your technology landscape evolves with purpose, not guesswork.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    stats: [
      { value: 'Transition', label: 'To a stronger technology landscape', color: 'text-blue-500' },
      { value: 'Build', label: 'Future-ready digital capabilities', color: 'text-brand-blue' },
      { value: 'Accelerate', label: 'Time to value and adoption', color: 'text-indigo-500' },
      { value: 'Optimize', label: 'Cost, ROI, and long-term control', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    ctaTitle: 'Need clearer technology decisions before you commit major time and budget?',
    ctaDescription: "Let's define the right roadmap, evaluate the right-fit technologies, and turn your transformation priorities into a practical, scalable plan.",
    ctaSecondaryButton: { text: "Explore Capabilities", link: "/contact" },
    trustStripText: 'Helping organizations align technology strategy, modernization priorities, and execution roadmaps with real business outcomes.',

    // ============================================
    // B. PROBLEM / MARKET TENSION + C. DELIVERY MODEL + D. LIFECYCLE + E. STATEMENT
    // ============================================
    highFidelity: {
      // B. Problem Section — "Why Technology Consulting"
      narrative: {
        badge: 'TECHNOLOGY ADVISORY :: 2026',
        titleLine1: 'When technology decisions outgrow',
        titleHighlight: 'internal clarity,',
        titleLine2: 'transformation slows.',
        description: 'Modern businesses are expected to modernize continuously—across cloud, data, AI, security, platforms, and customer experience—while still controlling cost and operational risk. Kangqore helps leaders cut through complexity, evaluate the right technology paths, and make confident decisions that improve scalability, resilience, and business velocity.',
        bottleneckLabel: 'The Drift',
        bottleneckText: 'Disconnected decisions across platforms, vendors, and teams quietly increase cost, delay, and technical debt.',
        requirementLabel: 'The Opportunity',
        requirementText: 'The right consulting model turns technology from a reactive support function into a lever for growth, modernization, and competitive advantage.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        statusLabel: 'Advisory Status',
        statusValue: 'STRATEGIC'
      },
      // C. Delivery Model Intro Panel
      philosophy: {
        icon: <Compass className="w-7 h-7 text-brand-blue" />,
        title: 'Our Technology Consulting',
        titleHighlight: 'Delivery Model.',
        description: 'At Kangqore, technology consulting is structured as a disciplined advisory-to-execution model—designed to improve clarity, reduce risk, and create stronger transformation outcomes.',
        pills: ['Analyze', 'Strategize', 'Manage', 'Optimize']
      },
      // D. 4-Phase Operating Lifecycle
      matrix: {
        engineId: 'Engine :: TECH_ADV_V1',
        title: '4-Phase Advisory Lifecycle',
        subtext: 'We deconstruct the complexity of technology transformation into governed, measurable advisory layers.',
        layers: [
          { title: 'Analyze', id: 'ADV_ANALYSE', icon: <Search />, desc: 'Understand business goals, current systems, process realities, dependencies, and risk areas.' },
          { title: 'Strategize', id: 'ADV_STRAT', icon: <Layers />, desc: 'Create a roadmap for modernization, architecture decisions, transformation priorities, and platform alignment.' },
          { title: 'Manage', id: 'ADV_MANAGE', icon: <ShieldCheck />, desc: 'Support solution planning, implementation readiness, stakeholder coordination, and team enablement.' },
          { title: 'Optimize', id: 'ADV_OPT', icon: <Activity />, desc: 'Continuously evaluate outcomes, refine the technology path, and adapt strategy as priorities evolve.' }
        ]
      },
      // E. Big Statement / Positioning Block
      schematic: {
        titleLine1: 'Decisions that',
        titleHighlight: 'Actually Deliver.',
        description: 'Your technology consulting investment should generate compounding business returns. We engineer the advisory frameworks that make transformation measurable, sustainable, and outcome-driven.',
        stats: [
          { label: 'Clarity', val: 'STRATEGIC' },
          { label: 'Decisions', val: 'CONFIDENT' },
          { label: 'ROI', val: 'MEASURABLE' }
        ]
      }
    },

    // ============================================
    // F. CAPABILITIES INTRO
    // ============================================
    capabilitiesDescription: "Kangqore's technology consulting capabilities are designed to help organizations make smarter technology decisions across discovery, architecture, modernization, migration, and transformation. We combine business-context understanding, engineering practicality, and roadmap precision to help leaders move from fragmented technology choices to scalable execution models.",

    // ============================================
    // G. TRUST PILLARS (Blue Gradient Section) — "Value We Deliver"
    // ============================================
    trustPillars: [
      {
        title: 'Transition to a Better Technology Landscape',
        tag: 'Foundation',
        description: 'Assess current systems, architecture, and operating realities to identify better-fit technology paths with minimal business disruption.'
      },
      {
        title: 'Build Future-Ready Solutions',
        tag: 'Innovation',
        description: 'Shape scalable, modern technology foundations across AI, cloud, data, security, UX, and digital platforms.'
      },
      {
        title: 'Achieve Faster Time to Value',
        tag: 'Speed',
        description: 'Reduce wasted experimentation and move from evaluation to measurable execution with sharper prioritization and roadmap clarity.'
      },
      {
        title: 'Optimize Cost and ROI',
        tag: 'Efficiency',
        description: 'Align technology investments to business goals, reduce avoidable spend, and improve long-term return from platforms, teams, and vendors.'
      },
      {
        title: 'Improve Business Processes',
        tag: 'Transformation',
        description: 'Use technology as a lever to streamline workflows, strengthen analytics, improve decision-making, and support regulatory readiness.'
      },
      {
        title: 'Reduce Total Cost of Ownership',
        tag: 'Governance',
        description: 'Lower the total cost of ownership through modernization planning, vendor rationalization, governance, and sustainable operating choices.'
      }
    ],
    // G. Right-side panel content
    trustPillarsRightTitle: 'Value We Deliver with Technology Consulting',
    trustPillarsRightDescription: 'Kangqore combines strategic technology thinking with real engineering depth. We help organizations identify the right technology decisions, evaluate feasibility, reduce transformation risk, and prepare for scalable execution—turning advisory into measurable business value.',
    trustPillarsRightButton: 'Request a Consultation',

    // ============================================
    // H. WHY KANGQORE SECTION
    // ============================================
    whyKangqore: [
      { 
        icon: Award, 
        title: 'Business-Aligned Advisory', 
        description: 'We make sure technology strategy supports revenue, efficiency, customer experience, and long-term operating goals—not isolated technical upgrades.' 
      },
      { 
        icon: Target, 
        title: 'Future-Ready Decisioning', 
        description: 'We help organizations modernize confidently across cloud, AI, security, data, and platform engineering without relying on trend-driven guesswork.' 
      },
      { 
        icon: Rocket, 
        title: 'Execution-Shaped Expertise', 
        description: 'Our consulting approach is grounded in implementation reality, so the roadmap is practical, scalable, and easier to operationalize.' 
      },
      {
        icon: ShieldCheck,
        title: 'Risk-Aware Transformation',
        description: 'Every recommendation accounts for technical debt, migration risk, compliance constraints, and organizational readiness.'
      },
      {
        icon: TrendingUp,
        title: 'Measurable Outcomes',
        description: 'We track advisory impact against business KPIs—not vague improvement narratives—to keep transformation focused on value.'
      },
      {
        icon: Gauge,
        title: 'Domain-Deep Expertise',
        description: 'Our consultants bring proven depth across cloud strategy, platform engineering, architecture modernization, data, AI, and enterprise security.'
      }
    ],

    // ============================================
    // I. INDUSTRY-SPECIFIC SOLUTIONS
    // ============================================
    industryTitle: 'Industry-Specific Technology Advisory.',
    industryIntro: 'Technology strategy only works when it understands domain realities. Kangqore brings consulting depth across industries where architecture, compliance, scalability, customer experience, and modernization choices directly affect business performance.',

    // ============================================
    // J. FAQ SECTION
    // ============================================
    faqTitle: 'Frequently Asked Questions',
    faqSubline: 'Common questions about our technology consulting approach, delivery model, and business outcomes.',
  };

  const department = {
    name: 'Consulting & Advisory',
    slug: 'consulting-advisory',
    description: 'Transform your business with cutting-edge consulting & advisory services solutions.'
  };

  // ============================================
  // F. CAPABILITIES — 6 Cards (Carousel)
  // ============================================
  const capabilities = [
    {
      title: 'Product Discovery',
      description: 'Translate early ideas into structured, feasible digital opportunities.\n\nKangqore helps validate concepts, define user journeys, shape product scope, and identify the right-fit technology stack before investment moves into full-scale build.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Concept validation and requirement discovery',
        'User journey and experience framing',
        'Scope shaping and feasibility analysis',
        'Technology fitment and MVP planning'
      ]
    },
    {
      title: 'Solution Audit',
      description: 'Assess systems, processes, and architecture to uncover risk and opportunity.\n\nWe evaluate your current technology landscape to identify structural gaps, performance limitations, technical debt, security concerns, and modernization priorities.',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Architecture and solution review',
        'Risk, gap, and dependency analysis',
        'Performance and scalability evaluation',
        'Opportunity mapping and recommendation framework'
      ]
    },
    {
      title: 'Strategy Consulting',
      description: 'Build a technology roadmap that aligns with business direction.\n\nKangqore works with leadership teams to define practical roadmaps, investment priorities, platform direction, and execution sequencing that support business growth and transformation.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Technology roadmap creation',
        'Investment and platform prioritization',
        'Business-to-technology alignment',
        'Strategic decision support for scale and change'
      ]
    },
    {
      title: 'Modernization Consulting',
      description: 'Evolve legacy environments into more agile, integration-ready systems.\n\nWe help organizations rethink aging applications and architecture models so their technology estate becomes easier to scale, secure, integrate, and improve.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Legacy assessment and modernization planning',
        'Architecture evolution strategy',
        'Performance and maintainability improvement',
        'Integration readiness and future-state design'
      ]
    },
    {
      title: 'Migration Planning',
      description: 'Design lower-risk transitions across cloud, platforms, and architectures.\n\nKangqore helps plan migration journeys with business continuity, security, sequencing, and operational readiness at the core—so transition becomes controlled, not disruptive.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Migration readiness assessment',
        'Dependency mapping and wave planning',
        'Risk, security, and continuity alignment',
        'Transition roadmap and execution preparation'
      ]
    },
    {
      title: 'Digital Transformation',
      description: 'Turn technology change into business-level transformation.\n\nWe help enterprises adopt new technologies, redesign operating workflows, and create more agile digital models across experience, data, automation, and cloud-led initiatives.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Transformation vision and opportunity mapping',
        'Process and operating-model redesign',
        'Data, cloud, and automation alignment',
        'Change enablement and execution planning'
      ]
    }
  ];

  // ============================================
  // K. TOOLS & TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'Frontend Technologies', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5', 'CSS'] },
    { category: 'Backend Technologies', items: ['.NET', 'Java', 'Node.js', 'Python', 'PHP', 'Go'] },
    { category: 'Databases / Data Storage', items: ['MySQL', 'SQL Server', 'MongoDB', 'Amazon S3', 'Amazon RDS', 'Cassandra'] },
    { category: 'Cloud Technologies', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
    { category: 'Mobile', items: ['iOS', 'Android', 'Xamarin', 'Cordova', 'PWA', 'React Native', 'Flutter'] },
    { category: 'DevOps', items: ['Linux', 'Jenkins', 'Terraform', 'Ansible', 'Kubernetes', 'Docker', 'Azure DevOps / GitHub Actions'] }
  ];

  // K. Tools heading + description overrides
  service.technologiesTitle = 'Tools & Technologies We Excel In';
  service.technologiesDescription = 'We work across modern product, platform, cloud, data, and delivery ecosystems—aligning technologies to your business goals, architecture needs, and execution model.';

  // ============================================
  // J. FAQS
  // ============================================
  const customFAQs = [
    {
      question: "Why are technology consulting services important?",
      answer: 'They help organizations make better technology decisions, reduce risk, improve cost efficiency, and adopt change with greater confidence. Without structured advisory, businesses often invest in platforms or architectures that create long-term friction instead of value.'
    },
    {
      question: 'What are the benefits of technology consulting services?',
      answer: 'Typical benefits include access to domain expertise, cost efficiency through smarter investments, reduced transformation risk, independent and unbiased advice, and exposure to more modern technology options that match real business needs.'
    },
    {
      question: 'What do technology consulting services include?',
      answer: 'They typically cover software consulting, IT advisory, cloud strategy, AI and IoT guidance, modernization planning, migration readiness, architecture reviews, digital transformation support, and vendor-neutral technology evaluation.'
    },
    {
      question: 'What is the difference between IT consulting and technology consulting?',
      answer: 'IT consulting focuses more narrowly on information systems and operational technology management. Technology consulting is broader and includes transformation strategy, AI, cloud, modernization, platform engineering, architecture evolution, and emerging technology direction.'
    },
    {
      question: 'How does Kangqore approach technology consulting differently?',
      answer: 'We combine strategic thinking with engineering depth. Our advisory is grounded in implementation reality—we don\'t just recommend, we help evaluate feasibility, assess risk, and shape execution-ready roadmaps that organizations can actually operationalize.'
    },
    {
      question: 'What industries does Kangqore serve for technology consulting?',
      answer: 'We serve clients across Healthcare, Software & Technology, Fintech, Banking, Real Estate, Travel & Transportation, and other sectors where architecture, compliance, scalability, and modernization decisions directly affect business performance.'
    }
  ];

  // ============================================
  // H. WHY KANGQORE Intro Text
  // ============================================
  const whyKangqoreIntro = 'Kangqore combines strategic technology thinking with real engineering depth. We do not stop at recommendations—we help organizations identify the right technology decisions, evaluate feasibility, reduce transformation risk, and prepare for scalable execution.';

  // ============================================
  // I. INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Healthcare', description: 'Shape secure, interoperable digital ecosystems across patient platforms, EHR-connected systems, compliance-aware infrastructure, and data-led care experiences.' },
    { name: 'Software & Technology', description: 'Improve product velocity, system architecture, cloud strategy, platform scalability, and engineering effectiveness across modern software businesses.' },
    { name: 'Fintech', description: 'Design trusted, resilient, high-compliance technology stacks for digital finance, lending, payment ecosystems, and financial product innovation.' },
    { name: 'Banking', description: 'Support modernization across secure banking systems, digital channels, integrations, CRM, risk controls, and customer-facing platform experiences.' },
    { name: 'Real Estate', description: 'Enable smarter property operations, CRM flows, analytics, digital customer journeys, and integrated real estate platforms that scale with demand.' },
    { name: 'Travel & Transportation', description: 'Improve efficiency, system coordination, mobile-led experiences, integration readiness, and digital transformation across service-heavy transport ecosystems.' }
  ];

  // ============================================
  // GSAP ANIMATION HOOKS
  // ============================================
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

      // 3. Diamond Parallax
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

    // 4. Differentiator items staggered entrance
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

    const timer = setTimeout(animateCounters, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // L. ADVISORY CENTER OF EXCELLENCE SECTION (3D Diamond)
  // ============================================
  const advisoryCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT: INTRO + DIAGRAM ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's Advisory Center of Excellence (CoE) addresses four critical technology decision domains — <strong className="text-brand-blue">Discovery & Validation</strong>, <strong className="text-brand-blue">Architecture & Audit</strong>, <strong className="text-brand-blue">Strategy & Roadmap</strong>, and <strong className="text-brand-blue">Transformation & Migration</strong>.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace fragmented advisory with a unified consulting model. From concept validation and legacy assessment to cloud migration planning and digital transformation, our framework ensures strategic clarity, reduced risk, and measurable transformation outcomes.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            {/* Desktop Diamond Layout */}
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG — connector lines */}
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  {/* Top */}
                  <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  {/* Left */}
                  <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  {/* Bottom */}
                  <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  {/* Right */}
                  <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* ===== TRUE 3D DIAMOND ===== */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{
                  perspective: '900px',
                  perspectiveOrigin: '50% 40%'
                }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{
                      transformStyle: 'preserve-3d'
                    }}>
                      {/* Top Left -> Discovery & Validation */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Discovery &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Validation</span>
                        </div>
                      </div>
                      {/* Top Right -> Architecture & Audit */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Architecture &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Audit</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Strategy & Roadmap */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)',
                        transform: 'translateZ(2px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Strategy &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Roadmap</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Transformation & Migration */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Transformation</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>& Migration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== BULLET LABELS ===== */}
                {/* Top-Left: Discovery & Validation bullets */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Concept Validation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>User Journey Framing</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Feasibility Analysis</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>MVP & Stack Planning</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Top-Right: Architecture & Audit bullets */}
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Architecture Review</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Risk & Gap Analysis</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Scalability Evaluation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Opportunity Mapping</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Left: Strategy & Roadmap bullets */}
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Roadmap Creation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Investment Prioritization</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Business-Tech Alignment</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Decision Support</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Right: Transformation & Migration bullets */}
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Migration Planning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Wave & Dependency Mapping</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Digital Transformation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Change Enablement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

           {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { 
                title: 'Discovery & Validation', 
                gradient: 'from-[#2564ea] to-[#3b82f6]',
                dotColor: 'bg-[#2564ea]',
                items: ['Concept Validation', 'User Journey Framing', 'Feasibility Analysis', 'MVP & Stack Planning']
              },
              { 
                title: 'Architecture & Audit', 
                gradient: 'from-[#3b82f6] to-[#60a5fa]',
                dotColor: 'bg-[#3b82f6]',
                items: ['Architecture Review', 'Risk & Gap Analysis', 'Scalability Evaluation', 'Opportunity Mapping']
              },
              { 
                title: 'Strategy & Roadmap', 
                gradient: 'from-[#1e40af] to-[#2564ea]',
                dotColor: 'bg-[#1e40af]',
                items: ['Roadmap Creation', 'Investment Prioritization', 'Business-Tech Alignment', 'Decision Support']
              },
              { 
                title: 'Transformation & Migration', 
                gradient: 'from-[#4ab6d4] to-[#38bdf8]',
                dotColor: 'bg-[#4ab6d4]',
                items: ['Migration Planning', 'Wave & Dependency Mapping', 'Digital Transformation', 'Change Enablement']
              }
            ].map((quadrant, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {quadrant.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* ==================== KEY DIFFERENTIATORS ==================== */}
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Business-Aligned Advisory',
                text: 'We ensure technology strategy supports revenue, efficiency, customer experience, and long-term operating goals—connecting every recommendation to a measurable business outcome rather than isolated technical upgrades.'
              },
              {
                num: 2,
                title: 'Future-Ready Decisioning',
                text: 'We help organizations modernize confidently across cloud, AI, security, data, and platform engineering without relying on trend-driven guesswork—grounding every decision in feasibility and execution reality.'
              },
              {
                num: 3,
                title: 'Execution-Shaped Expertise',
                text: 'Our consulting approach is built on implementation depth, so the roadmap we deliver is practical, scalable, and operationally ready—not just a PowerPoint recommendation.'
              },
              {
                num: 4,
                title: 'Risk-Aware Transformation',
                text: 'Every recommendation accounts for technical debt, migration risk, compliance constraints, and organizational readiness—ensuring that transformation doesn\'t create new problems while solving old ones.'
              },
              {
                num: 5,
                title: 'Domain-Deep Technology Expertise',
                text: 'We bring proven depth across cloud strategy, platform engineering, architecture modernization, data, AI, and enterprise security—giving you access to specialized knowledge without the hiring overhead.'
              }
            ].map((diff) => (
              <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // M. EXECUTION ECOSYSTEM SECTION
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Advisory <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Extend your technology consulting engagement with specialized capabilities in strategy, architecture, digital transformation, and operational modernization.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Strategy Consulting', 
                  link: '/services/consulting-advisory/strategy-consulting',
                  icon: <Compass className="w-5 h-5" />,
                  desc: 'Define business strategy aligned to technology decisions.'
                },
                { 
                  name: 'Cloud Infrastructure & Migrations', 
                  link: '/services/infrastructure-networks-operations/cloud-infrastructure-migrations',
                  icon: <Cloud className="w-5 h-5" />,
                  desc: 'Architect and deploy resilient cloud estates.'
                },
                { 
                  name: 'Operation Technology', 
                  link: '/services/infrastructure-networks-operations/operation-technology',
                  icon: <Network className="w-5 h-5" />,
                  desc: 'Converge industrial and IT operations at scale.'
                },
                { 
                  name: 'Managed Services', 
                  link: '/services/infrastructure-networks-operations/managed-services',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  desc: 'Enterprise-grade managed IT operations.'
                }
              ].map((offering, idx) => (
                <Link 
                  key={idx} 
                  to={offering.link}
                  className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side — High-Fidelity Animated Schematic */}
          <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto lg:mr-0">
              {/* Outer Glows */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-blue/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              
              {/* Base Grid */}
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(45deg)' }}></div>

              {/* Orbital Rings representing the Consulting Lifecycle */}
              <div className="absolute inset-4 rounded-full border border-dashed border-gray-200 animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-16 rounded-full border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800/40 backdrop-blur-sm shadow-xl flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 border-t-brand-blue/60 border-l-brand-blue/60 animate-[spin_20s_linear_infinite]"></div>
              </div>

              {/* Central Core (The Advisory Kernel) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-900 rounded-full shadow-[0_20px_50px_rgba(37,100,234,0.3)] flex flex-col items-center justify-center relative z-20 group border-4 border-white">
                <div className="absolute inset-0 bg-brand-gradient opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* Core Pulse */}
                <div className="absolute inset-0 bg-brand-blue/20 rounded-full animate-ping-slow"></div>
                
                <BrainCircuit className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-2" />
                <span className="font-mono text-[11px] text-white tracking-[0.2em] uppercase font-bold">ADVISORY</span>
                <span className="font-mono text-[11px] text-cyan-400 tracking-[0.1em] mt-1">KERNEL_V2</span>
              </div>

              {/* Orbiting Satellite Nodes */}
              {/* Node 1: Discovery */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group z-30">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                    <Search className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute top-full mt-2">
                    <div className="font-mono text-[11px] text-cyan-400 tracking-widest mb-0.5">PHASE 01</div>
                    <div className="text-white text-xs font-bold">Discovery & Audit</div>
                  </div>
                </div>
              </div>

              {/* Node 2: Architecture */}
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 group z-30">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute right-full mr-4 top-1/2 -translate-y-1/2">
                    <div className="font-mono text-[11px] text-indigo-400 tracking-widest mb-0.5">PHASE 02</div>
                    <div className="text-white text-xs font-bold">Architecture Design</div>
                  </div>
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:translate-x-2 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                    <Layers className="w-7 h-7 text-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Node 3: Strategy */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group z-30">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute bottom-full mb-2">
                    <div className="font-mono text-[11px] text-purple-400 tracking-widest mb-0.5">PHASE 03</div>
                    <div className="text-white text-xs font-bold">Strategic Roadmap</div>
                  </div>
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border border-slate-700 hover:translate-y-2 hover:shadow-2xl hover:border-purple-400 transition-all duration-300">
                    <Target className="w-7 h-7 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Node 4: Transformation */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 group z-30">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2">
                    <div className="font-mono text-[11px] text-emerald-400 tracking-widest mb-0.5">PHASE 04</div>
                    <div className="text-white text-xs font-bold">Transformation</div>
                  </div>
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:-translate-x-2 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
                    <Rocket className="w-7 h-7 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Floating Status Badges */}
              <div className="absolute top-10 left-10 p-3 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/70 backdrop-blur-md z-30 font-mono text-[11px] text-gray-500 shadow-lg">
                <div className="flex justify-between gap-6 mb-1"><span>ADVISORY ID:</span> <span className="text-brand-blue font-bold">#KG_TECH_09</span></div>
                <div className="flex justify-between gap-6"><span>SYNC STATUS:</span> <span className="text-emerald-500 font-bold">REAL-TIME</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-3 border border-slate-700 rounded-xl bg-slate-900/90 backdrop-blur-md z-30 font-mono text-[11px] text-gray-400 shadow-xl">
                <div className="text-cyan-400 mb-1.5 font-bold tracking-widest uppercase text-[11px]">Advisory Engine</div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>MAPPING_DEPENDENCIES...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div>
                  <span>STATUS: <span className="text-emerald-400">FERRARI</span></span>
                </div>
              </div>

              {/* SVG Connecting Lines with flowing gradients */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="adv-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Lines connecting outer nodes to central core */}
                <path d="M250,250 L250,50" stroke="url(#adv-flow)" strokeWidth="2" strokeDasharray="4,6" fill="none" opacity="0.6" />
                <path d="M250,250 L450,250" stroke="url(#adv-flow)" strokeWidth="2" strokeDasharray="4,6" fill="none" opacity="0.6" />
                <path d="M250,250 L250,450" stroke="url(#adv-flow)" strokeWidth="2" strokeDasharray="4,6" fill="none" opacity="0.6" />
                <path d="M250,250 L50,250" stroke="url(#adv-flow)" strokeWidth="2" strokeDasharray="4,6" fill="none" opacity="0.6" />
                
                {/* Animated data packets */}
                <circle r="3" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion path="M250,50 L250,250" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion path="M450,250 L250,250" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion path="M250,450 L250,250" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#22d3ee" filter="url(#glow)">
                  <animateMotion path="M50,250 L250,250" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Combine all data for the template
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      customFAQs,
      whyKangqore: service.whyKangqore,
      whyKangqoreIntro,
      industries,
      preWhyKangqoreSections: advisoryCoESection,
      postFAQSections: executionEcosystemSection
    },
    department
  };

  return (
    <React.Fragment>
      <ServicePageTemplate 
        service={pageData.service} 
        department={department} 
        primaryButton={service.primaryButton}
        secondaryButton={service.secondaryButton}
      />
    </React.Fragment>
  );
};

export default TechnologyConsulting;
