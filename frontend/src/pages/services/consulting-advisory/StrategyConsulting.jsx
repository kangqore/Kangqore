import React, { useEffect, useRef } from 'react';
import { 
  Compass, Search, Layers, Activity, ShieldCheck, 
  Target, Rocket, TrendingUp, Gauge, BrainCircuit, 
  Workflow, Network, Cloud, Briefcase, BarChart3,
  Lightbulb, Zap, LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StrategyConsulting = () => {
  // ============================================
  // 1. HERO SECTION
  // ============================================
  const service = {
    name: 'Strategy Consulting',
    titleLine1: 'Strategy Consulting',
    titleHighlight: 'Services.',
    slug: 'strategy-consulting',
    videoBackground: '/videos/business-meeting-6774639.mp4', // fallback video or hero bg
    shortDescription: "Turn disruption into deliberate advantage.",
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps leadership teams redefine growth, sharpen strategic priorities, and build future-ready operating models for a market that changes faster every quarter. We combine business strategy, technology intelligence, AI-era decisioning, and execution realism to help organizations move from uncertainty to measurable momentum.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    stats: [
      { value: 'Reinvent', label: 'Growth & business direction', color: 'text-blue-500' },
      { value: 'Align', label: 'Business, technology & AI priorities', color: 'text-brand-blue' },
      { value: 'Improve', label: 'Cost, productivity & capital focus', color: 'text-indigo-500' },
      { value: 'Build', label: 'Resilient operating models', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    ctaTitle: 'Ready to turn strategy into measurable competitive advantage?',
    ctaDescription: "Let’s define the right growth bets, operating priorities, and technology direction—so your organization can reinvent with confidence and execute with clarity.",
    ctaSecondaryButton: { text: "Explore Capabilities", link: "/contact" },

    // ============================================
    // 2. TRUST STRIP
    // ============================================
    trustStripText: 'Advising enterprises, growth-stage businesses, and transformation leaders on reinvention, profitable growth, strategic clarity, and execution-ready change.',

    // ============================================
    // 3. WHY STRATEGY NOW (High Fidelity)
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'STRATEGY ADVISORY',
        titleLine1: 'The old strategy cycle is',
        titleHighlight: 'too slow',
        titleLine2: 'for today\'s market reality.',
        description: 'Disruption is compounding across technology, customer behavior, regulation, operating costs, and competitive pressure. Static planning is no longer enough. Kangqore helps organizations move from one-time strategic planning to continuous reinvention—so leadership teams can make better bets, adapt faster, and create stronger long-term value.',
        bottleneckLabel: 'The Pressure',
        bottleneckText: 'Strategy now has to respond to faster disruption, shorter decision windows, and more interconnected risks.',
        requirementLabel: 'The Shift',
        requirementText: 'The companies pulling ahead are not just planning better—they are reinventing faster, with technology and AI actively shaping strategy.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        statusLabel: 'Strategy Status',
        statusValue: 'REINVENTING'
      },
      // 9. DELIVERY MODEL (Part 1 - Intro)
      philosophy: {
        icon: <Compass className="w-7 h-7 text-brand-blue" />,
        title: 'Our Strategy Consulting',
        titleHighlight: 'Delivery Model.',
        description: 'At Kangqore, strategy is structured as a disciplined advisory model—designed to sharpen choices, reduce uncertainty, and prepare leadership teams for confident execution.',
        pills: ['Understand', 'Reframe', 'Prioritize', 'Activate']
      },
      // 9. DELIVERY MODEL (Part 2 - Matrix)
      matrix: {
        engineId: 'Engine :: STRAT_ADV_V1',
        title: '4-Phase Strategy Lifecycle',
        subtext: 'We deconstruct the complexity of business transformation into measurable strategic phases.',
        layers: [
          { title: 'Understand', id: 'STRT_UNDR', icon: <Search />, desc: 'Assess business context, market pressure, digital maturity, growth constraints, and strategic risk.' },
          { title: 'Reframe', id: 'STRT_RFRM', icon: <Lightbulb />, desc: 'Challenge assumptions, identify strategic opportunities, and define the future-state direction.' },
          { title: 'Prioritize', id: 'STRT_PRIO', icon: <Target />, desc: 'Turn ambition into decisions—bets, investments, operating shifts, and capability priorities.' },
          { title: 'Activate', id: 'STRT_ACT', icon: <Rocket />, desc: 'Translate strategy into execution roadmaps, governance, KPI models, and transformation momentum.' }
        ]
      },
      // 4. STRATEGY NOW RESEARCH (The Proof Layer)
      schematic: {
        titleLine1: 'Compounding',
        titleHighlight: 'Reinvention.',
        description: 'Emerging technology and AI are rewriting the rules of competitive advantage. Organizations that embed continuous reinvention into their strategy consistently outperform their peers.',
        stats: [
          { label: 'Growth Prem.', val: '+10%' },
          { label: 'Outperformance', val: '2.5x' },
          { label: 'Disruption', val: '+200%' }
        ]
      }
    },

    // ============================================
    // 6. OUR CAPABILITIES
    // ============================================
    capabilitiesDescription: "Kangqore’s strategy consulting capabilities are designed for organizations navigating growth pressure, cost pressure, AI disruption, and operating-model change at the same time. We help leadership teams connect strategy with technology, translate ambition into action, and build business models that stay competitive as markets evolve.",
    
    // ============================================
    // 5. VALUE WE DELIVER (Trust Pillars)
    // ============================================
    trustPillars: [
      {
        title: 'Continuous reinvention, not static planning',
        tag: 'Agility',
        description: 'Help leadership teams shift from annual strategy cycles to dynamic, ongoing reinvention aligned to change.'
      },
      {
        title: 'Profitable growth with sharper strategic bets',
        tag: 'Growth',
        description: 'Identify where to grow, what to prioritize, and how to allocate investment with stronger confidence.'
      },
      {
        title: 'Technology- and AI-informed decision-making',
        tag: 'Intelligence',
        description: 'Use emerging technology, digital-core thinking, and AI-led insight to shape smarter strategic direction.'
      },
      {
        title: 'Cost and productivity reinvention',
        tag: 'Efficiency',
        description: 'Improve efficiency, create self-funded growth capacity, and redesign productivity for long-term competitiveness.'
      },
      {
        title: 'Resilience built into the strategy',
        tag: 'Resilience',
        description: 'Strengthen your business against volatility through scenario thinking, operating-model agility, and strategic flexibility.'
      },
      {
        title: 'Strategy translated into action',
        tag: 'Execution',
        description: 'Turn strategic ambition into portfolios, priorities, roadmaps, and measurable value realization.'
      }
    ],
    trustPillarsRightTitle: 'Value We Deliver with Strategy',
    trustPillarsRightDescription: 'We help organizations move from one-time strategic planning to continuous reinvention. By aligning business ambition with technology intelligence, AI, and operating realities, we ensure your strategy is built for profitable growth and execution.',
    trustPillarsRightButton: 'Request a Consultation',

    // ============================================
    // 8. WHY KANGQORE
    // ============================================
    whyKangqore: [
      { 
        icon: BrainCircuit, 
        title: 'Business-Led, Tech-Shaped', 
        description: 'We build strategies that connect business ambition with digital, AI, data, and platform realities.' 
      },
      { 
        icon: TrendingUp, 
        title: 'Outcome-Oriented', 
        description: 'We focus on profitable growth, productivity, resilience, and measurable enterprise value—not presentation-only strategy.' 
      },
      { 
        icon: Rocket, 
        title: 'Built for Execution', 
        description: 'We shape strategies that can actually be activated through roadmaps, governance, portfolios, and operating-model change.' 
      }
    ],

    // ============================================
    // 10. INDUSTRY FIT
    // ============================================
    industryTitle: 'Where Our Strategy Work Creates Value',
    industryIntro: 'Strategy performs best when it is grounded in industry realities. Kangqore works across high-impact sectors to design growth paths, navigate disruption, and build future-ready operating models.',

    // ============================================
    // 11. FAQ
    // ============================================
    faqTitle: 'Frequently Asked Questions',
    faqSubline: 'Common questions about our strategy consulting approach and execution model.',
  };

  const department = {
    name: 'Consulting & Advisory',
    slug: 'consulting-advisory',
    description: 'Transform your business with cutting-edge consulting & advisory services solutions.'
  };

  // ============================================
  // 6. OUR CAPABILITIES DATA
  // ============================================
  const capabilities = [
    {
      title: 'Corporate Strategy & Growth',
      description: 'Shape a clearer growth agenda in markets where customer expectations, competitive dynamics, and AI-driven shifts are changing faster than traditional planning cycles can handle.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'Growth strategy and opportunity mapping',
        'Revenue model and market expansion planning',
        'Competitive positioning and strategic bet selection',
        'Strategic investment prioritization'
      ]
    },
    {
      title: 'Technology Strategy & AI Advisory',
      description: 'Align business strategy with the technology and AI decisions that will define future competitiveness.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Technology strategy and transformation direction',
        'AI and agentic-AI strategy alignment',
        'Platform and digital-core roadmap design',
        'Enterprise capability prioritization'
      ]
    },
    {
      title: 'Cost & Productivity Reinvention',
      description: 'Move beyond cost-cutting into productivity redesign that frees capital, strengthens competitiveness, and funds future growth.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Cost and productivity diagnostics',
        'Operating leverage and efficiency strategy',
        'Investment reallocation and margin protection',
        'Workforce and process productivity strategy'
      ]
    },
    {
      title: 'Operating Model Strategy',
      description: 'Redesign how the business runs so strategy can scale through structure, accountability, decision rights, and execution rhythm.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Enterprise and function operating models',
        'Governance and accountability design',
        'Cross-functional execution alignment',
        'Shared services / product operating model direction'
      ]
    },
    {
      title: 'Platform & Ecosystem Strategy',
      description: 'Build a platform- and partner-aware strategy for the AI era, where value increasingly depends on ecosystems, interoperability, and scalable digital foundations.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Platform strategy for new growth',
        'Ecosystem and partnership strategy',
        'Capability integration planning',
        'Digital-core and foundation prioritization'
      ]
    },
    {
      title: 'Resilience & Scenario Strategy',
      description: 'Strengthen strategic readiness in an environment shaped by volatility, complexity, and continuous external shocks.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Scenario planning and risk-informed strategy',
        'Resilience and continuity strategy',
        'Volatility response playbooks',
        'Strategic flexibility and contingency design'
      ]
    },
    {
      title: 'New Business & Market Entry',
      description: 'Identify where the next wave of growth can come from and design the path to enter, test, and scale new spaces with discipline.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'New market assessment',
        'Business case and adjacency planning',
        'New venture / new business model design',
        'Strategic expansion roadmaps'
      ]
    },
    {
      title: 'Strategy Execution & Value Realization',
      description: 'Make sure strategy does not stop at boardroom language. Translate it into portfolios, programs, measurable outcomes, and leadership cadence.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Initiative prioritization and roadmap design',
        'Transformation portfolio governance',
        'KPI and value-tracking framework',
        'Strategic execution rhythm and reviews'
      ]
    }
  ];

  // ============================================
  // 11. FAQS
  // ============================================
  const customFAQs = [
    {
      question: "What does Kangqore Strategy Consulting include?",
      answer: 'It includes growth strategy, technology and AI strategy, operating-model design, cost and productivity reinvention, resilience planning, and strategy execution support.'
    },
    {
      question: 'How is this different from technology consulting?',
      answer: 'Technology consulting focuses more deeply on solution, architecture, and platform decisions. Strategy consulting sits higher up—linking business direction, competitive priorities, value pools, operating models, and transformation choices.'
    },
    {
      question: 'Can you help align AI initiatives to business strategy?',
      answer: 'Yes. One of the strongest use cases for strategy consulting today is helping leadership teams connect AI investment to growth, productivity, platform readiness, and business value.'
    },
    {
      question: 'Do you support cost, growth, and operating-model strategy together?',
      answer: 'Yes. Those themes are increasingly interconnected, and modern strategy work performs best when they are addressed together.'
    },
    {
      question: 'How do you translate strategy into execution?',
      answer: 'We turn strategic direction into priorities, roadmaps, governance models, KPI frameworks, and transformation portfolios.'
    },
    {
      question: 'Which organizations benefit most from strategy consulting?',
      answer: 'Enterprises facing reinvention pressure, scaling companies entering a new growth phase, and leadership teams navigating AI, cost, resilience, or operating-model change.'
    }
  ];

  const whyKangqoreIntro = 'Kangqore brings a more execution-shaped strategy model. We combine strategic thinking with technology depth, AI fluency, and implementation realism—so your strategy is not just intellectually strong, but operationally useful.';

  const industries = [
    { name: 'Banking & Financial Services', description: 'Growth, resilience, digital-core modernization, platform strategy, and AI-led competitive response.' },
    { name: 'Healthcare & Life Sciences', description: 'Operating-model transformation, digital innovation, patient-centric growth, and data-led strategic direction.' },
    { name: 'High Tech & Software', description: 'Platform strategy, ecosystem growth, AI opportunity design, and product/business model reinvention.' },
    { name: 'Consumer, Retail & Commerce', description: 'Customer-led growth, operating efficiency, profitability improvement, and digital-channel strategy.' },
    { name: 'Manufacturing & Industrial', description: 'Resilience, supply-chain-linked strategic shifts, digital operations, and productivity reinvention.' },
    { name: 'Public Sector & Institutions', description: 'Service redesign, operational modernization, resilience, and digital strategy for long-term public value.' }
  ];

  // ============================================
  // 12. TECHNOLOGY & AI ECOSYSTEM
  // ============================================
  const technologies = [
    { category: 'AI & Data Ecosystems', items: ['OpenAI / GPT-4', 'Anthropic Claude', 'Databricks', 'Snowflake', 'Microsoft Fabric', 'Google Vertex AI'] },
    { category: 'Enterprise Core', items: ['SAP S/4HANA', 'Salesforce Platform', 'Oracle Cloud ERP', 'Microsoft Dynamics 365', 'Workday'] },
    { category: 'Cloud & Infrastructure', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Hybrid Cloud Governance'] },
    { category: 'Value Orchestration', items: ['ServiceNow', 'Jira Align', 'Apptio', 'LeanIX (Enterprise Architecture)', 'Anaplan'] },
    { category: 'Business Intelligence', items: ['Microsoft Power BI', 'Tableau', 'Looker', 'Qlik Sense', 'Palantir Foundry'] },
    { category: 'Emerging Tech', items: ['Digital Twins', 'IoT Edge Platforms', 'Computer Vision', 'Agentic Workflow Engines'] }
  ];

  // Tool overrides 
  service.technologiesTitle = 'Technology Foundations Shaping Strategy';
  service.technologiesDescription = 'Strategic advice must be grounded in platform reality. We guide enterprise decision-making across the dominant technology, data, and AI ecosystems that drive competitive advantage.';

  // ============================================
  // GSAP ANIMATION HOOKS
  // ============================================
  const trendsRef = useRef(null);

  useEffect(() => {
    // Stat Counters
    const statElements = document.querySelectorAll('.stat-counter-text');
    statElements.forEach((el) => {
      const text = el.textContent || '';
      const match = text.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        const targetNum = parseFloat(match[1]);
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
                const isFloat = targetNum % 1 !== 0;
                const formattedNum = isFloat ? counter.val.toFixed(1) : Math.round(counter.val);
                el.textContent = originalText.replace(match[1], formattedNum);
              }
            });
          }
        });
      }
    });

    // Stagger trends cards
    if (trendsRef.current) {
      const lineElements = trendsRef.current.querySelectorAll('.str-line');
      const orbitNodes = trendsRef.current.querySelectorAll('.str-node-orbit');
      const coreNode = trendsRef.current.querySelector('.str-core');
      const textElements = trendsRef.current.querySelectorAll('.str-text');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trendsRef.current,
          start: 'top 75%',
          once: true
        }
      });

      // Animate lines drawing
      tl.fromTo(lineElements, 
        { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.2, duration: 1.5, ease: 'power3.inOut', stagger: 0.1 }
      )
      // Pulse nodes
      .fromTo([coreNode, ...orbitNodes],
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.1 },
        "-=1"
      )
      // Fade in text blocks next to nodes
      .fromTo(textElements,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
        "-=0.6"
      );

      // Continuous slow orbital rotation for the background ring
      gsap.to('.str-ring', {
        rotation: 360,
        transformOrigin: "center center",
        duration: 40,
        repeat: -1,
        ease: "linear"
      });

      // Global Orbital Revolution around the "Growth in AI" center (400, 300)
      gsap.to('.str-orbit-system', {
        rotation: 360,
        svgOrigin: '400 300',
        duration: 45,
        repeat: -1,
        ease: "linear"
      });

      // Subtle floating effect & Counter-Rotation for orbital nodes
      orbitNodes.forEach((node) => {
        const cx = node.getAttribute('data-cx');
        const cy = node.getAttribute('data-cy');

        // Counter-rotate the nodes so text doesn't turn upside down
        gsap.to(node, {
          rotation: -360,
          svgOrigin: `${cx} ${cy}`,
          duration: 45,
          repeat: -1,
          ease: "linear"
        });

        // Add hovering float animation on the inner elements to avoid conflicting with rotation
        gsap.to(node.querySelector('g'), {
          y: "random(-10, 10)",
          x: "random(-10, 10)",
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // Add hover interaction (Scale up and glow)
        node.addEventListener('mouseenter', () => {
          gsap.to(node.querySelector('g'), { scale: 1.15, transformOrigin: 'center', duration: 0.3, ease: 'back.out(2)' });
          gsap.to(node.querySelector('circle:nth-child(2)'), { fill: '#3b82f6', duration: 0.3 }); // Color shift
        });
        
        node.addEventListener('mouseleave', () => {
          gsap.to(node.querySelector('g'), { scale: 1, duration: 0.3, ease: 'power2.out' });
          gsap.to(node.querySelector('circle:nth-child(2)'), { clearProps: 'fill', duration: 0.3 }); // Reset color
        });
      });

      // Pulse the central core
      if (coreNode) {
        gsap.to(coreNode.querySelector('circle:first-child'), {
          scale: 1.2,
          opacity: 0.6,
          transformOrigin: 'center',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      // Add travelling data blips along the lines
      // We will create temporary SVG circles that follow the paths
      lineElements.forEach((line) => {
        const length = line.getTotalLength();
        
        // Define GSAP animation to make stroke-dashoffset travel
        gsap.fromTo(line, 
          { strokeDasharray: `5 ${length}`, strokeDashoffset: length * 2 },
          { 
            strokeDashoffset: 0, 
            duration: "random(3, 5)", 
            repeat: -1, 
            ease: "none",
            delay: "random(0, 2)"
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // 7. WHAT'S SHAPING STRATEGY NOW
  // ============================================
  const trends = [
    {
      title: 'Growth in the Age of AI',
      desc: 'AI is changing how markets move, how value gets created, and how organizations identify new growth opportunities.',
      icon: <BrainCircuit className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-300'
    },
    {
      title: 'Platform Strategy for Agentic AI',
      desc: 'AI value will increasingly depend on platform readiness, data foundations, orchestration, and business alignment.',
      icon: <Layers className="w-6 h-6" />,
      color: 'bg-cyan-50 text-cyan-600',
      border: 'hover:border-cyan-300'
    },
    {
      title: 'The Complexity Dividend',
      desc: 'Complexity can either drain margin or become a strategic advantage—depending on how leaders simplify, redesign, and use AI.',
      icon: <Network className="w-6 h-6" />,
      color: 'bg-indigo-50 text-indigo-600',
      border: 'hover:border-indigo-300'
    },
    {
      title: 'Resilience Beyond Readiness',
      desc: 'Resilience is no longer just a defensive posture; it is a competitive advantage when designed into strategy.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-300'
    },
    {
      title: 'Productivity as a Competitive Edge',
      desc: 'Productivity is not just about doing more with less—it is about redesigning work, focus, and operating leverage for growth.',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-300'
    }
  ];

  const strategyTrendsSection = (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={trendsRef}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Intro */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              What's Shaping <br/>
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Strategy Now.</span>
            </h2>
            <div className="w-16 h-1.5 bg-brand-blue rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
              The most resilient strategies go beyond operational planning to address the active disruptions pushing markets forward. Here is what leading organizations are navigating today.
            </p>
          </div>

          {/* Right Layout: Strategy Constellation Motion Graphic */}
          <div className="lg:w-2/3 flex items-center justify-center relative min-h-[500px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 800 600" className="w-full h-full max-w-3xl overflow-visible">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Rotating Rings */}
                <g className="str-ring transform origin-center">
                  <circle cx="400" cy="300" r="220" fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="4 8" />
                  <circle cx="400" cy="300" r="280" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                </g>

                {/* Central Kernel - STAYS IN CENTER */}
                <g className="str-node str-core">
                  <circle cx="400" cy="300" r="45" fill="#ffffff" filter="url(#glow)" className="shadow-2xl" />
                  <circle cx="400" cy="300" r="35" fill="#eff6ff" />
                  <circle cx="400" cy="300" r="20" fill="#2563eb" />
                  <text x="400" y="365" textAnchor="middle" className="text-sm font-bold fill-slate-800 tracking-widest uppercase">Growth in AI</text>
                  <text x="400" y="385" textAnchor="middle" className="text-[11px] font-bold fill-blue-600 tracking-wider">CORE PRIORITY</text>
                </g>

                {/* Orbital System (Lines + Nodes revolving around center) */}
                <g className="str-orbit-system">
                  {/* Connecting Lines (Animates in) */}
                  <g className="opacity-40">
                    <path className="str-line" d="M 400 300 L 220 180" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
                    <path className="str-line" d="M 400 300 L 600 150" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
                    <path className="str-line" d="M 400 300 L 650 380" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
                    <path className="str-line" d="M 400 300 L 250 450" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
                    <path className="str-line" d="M 220 180 L 600 150" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                    <path className="str-line" d="M 600 150 L 650 380" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  {/* Node 1: Top Left */}
                  <g className="str-node-orbit cursor-pointer group" data-cx="220" data-cy="180">
                    <g className="str-node">
                      <circle cx="220" cy="180" r="30" fill="#ffffff" filter="url(#glow)" />
                      <circle cx="220" cy="180" r="12" fill="#06b6d4" />
                      <g className="str-text transition-all duration-300 opacity-50 group-hover:opacity-100">
                        <rect x="30" y="160" width="150" height="40" rx="6" fill="#ffffff" filter="url(#glow)" />
                        <text x="45" y="185" className="text-xs font-bold fill-slate-900 tracking-tight">Platform Strategy</text>
                      </g>
                    </g>
                  </g>

                  {/* Node 2: Top Right */}
                  <g className="str-node-orbit cursor-pointer group" data-cx="600" data-cy="150">
                    <g className="str-node">
                      <circle cx="600" cy="150" r="25" fill="#ffffff" filter="url(#glow)" />
                      <circle cx="600" cy="150" r="10" fill="#6366f1" />
                      <g className="str-text transition-all duration-300 opacity-50 group-hover:opacity-100">
                        <rect x="640" y="130" width="160" height="40" rx="6" fill="#ffffff" filter="url(#glow)" />
                        <text x="655" y="155" className="text-xs font-bold fill-slate-900 tracking-tight">Complexity Dividend</text>
                      </g>
                    </g>
                  </g>

                  {/* Node 3: Bottom Right */}
                  <g className="str-node-orbit cursor-pointer group" data-cx="650" data-cy="380">
                    <g className="str-node">
                      <circle cx="650" cy="380" r="32" fill="#ffffff" filter="url(#glow)" />
                      <circle cx="650" cy="380" r="14" fill="#10b981" />
                      <g className="str-text transition-all duration-300 opacity-50 group-hover:opacity-100">
                        <rect x="680" y="360" width="130" height="40" rx="6" fill="#ffffff" filter="url(#glow)" />
                        <text x="695" y="385" className="text-xs font-bold fill-slate-900 tracking-tight">Resilience Beyond</text>
                      </g>
                    </g>
                  </g>

                  {/* Node 4: Bottom Left */}
                  <g className="str-node-orbit cursor-pointer group" data-cx="250" data-cy="450">
                    <g className="str-node">
                      <circle cx="250" cy="450" r="28" fill="#ffffff" filter="url(#glow)" />
                      <circle cx="250" cy="450" r="12" fill="#a855f7" />
                      <g className="str-text transition-all duration-300 opacity-50 group-hover:opacity-100">
                        <rect x="60" y="430" width="150" height="40" rx="6" fill="#ffffff" filter="url(#glow)" />
                        <text x="75" y="455" className="text-xs font-bold fill-slate-900 tracking-tight">Productivity Edge</text>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            
            {/* Overlay description showing detailed text without breaking SVG */}
            <div className="absolute -bottom-12 left-0 right-0 text-center bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-md border border-slate-200 p-4 rounded-full shadow-lg max-w-xl mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Hover over strategic nodes to explore shaping market forces.</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );

  // Combine data for the template
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      customFAQs,
      whyKangqore: service.whyKangqore,
      whyKangqoreIntro,
      industries,
      preWhyKangqoreSections: strategyTrendsSection
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

export default StrategyConsulting;
