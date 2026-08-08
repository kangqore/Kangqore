import React from 'react';
import { Layers, Search, ShieldCheck, Zap, Target, Bot, Activity, BrainCircuit, CheckCircle2, Cpu, Rocket, MonitorSmartphone, Code2, Network, RadioTower, BarChart3, Globe2, Shield, TrendingUp, Award, Workflow } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const ProductDigitalEngineering = () => {
  // ============================================
  // SERVICE IDENTITY — MNC-GRADE POSITIONING
  // ============================================
  const service = {
    name: 'Product & Digital Engineering',
    titleLine1: 'Product &',
    titleHighlight: 'Digital Engineering.',
    slug: 'product-digital-engineering',
    shortDescription: 'Engineering excellence for next-generation products and platforms.',
    videoBackground: '/videos/network-4916894.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">At Kangqore, we combine deep engineering discipline with a high-velocity product culture.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          We help you build products, platforms, and digital experiences that customers adopt, trust, and love. Our Product & Digital Engineering services deliver enterprise-grade execution maturity to turn innovation into production-grade systems at scale.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    stats: [
      { value: '40% Faster', label: 'Platform Architecture', color: 'text-blue-500' },
      { value: 'Zero-Defect', label: 'Quality Engineering', color: 'text-brand-blue' },
      { value: '100% Scalable', label: 'Smart Devices', color: 'text-indigo-500' },
      { value: '10x Agility', label: 'MVP Innovation', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },

    // ============================================
    // HIGH-FIDELITY HERO — BOARDROOM-LEVEL NARRATIVE
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'DIGITAL ENGINEERING :: ENTERPRISE GRADE',
        titleLine1: 'Architect',
        titleHighlight: 'Digital Ecosystems.',
        titleLine2: 'At High Velocity.',
        description: 'The digital landscape is evolving faster than ever—creating endless opportunities to innovate and differentiate. But sustained advantage doesn’t come from ideas alone. It comes from engineering rigor, modern delivery, and the ability to turn innovation into production-grade systems at scale. Kangqore brings proven expertise to help enterprises and digital-native businesses create future-ready customer experiences, modernize platforms, and unlock new business value.',
        bottleneckLabel: 'The Market Reality',
        bottleneckText: 'Monolithic architectures, manual testing bottlenecks, disconnected devices, and slow innovation cycles stalling product momentum.',
        requirementLabel: 'The Enterprise Requirement',
        requirementText: 'A unified digital engineering core integrating cloud-native platforms, AI-driven quality assurance, connected IoT endpoints, and rapid MVP acceleration.',
        image: 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=1200',
        statusLabel: 'Engineering Velocity',
        statusValue: 'Maximized'
      },
      philosophy: {
        icon: <Cpu className="w-7 h-7 text-brand-blue" />,
        title: 'The Kangqore',
        titleHighlight: 'Digital Foundry™.',
        description: 'Our proprietary Digital Foundry™ organizes enterprise product engineering into five integrated pillars — delivering compounding business value from conceptualization to global scale.',
        pills: ['Platform Engineering', 'Quality Engineering', 'Device Engineering', 'Experience Design', 'MVP Acceleration']
      },
      matrix: {
        engineId: 'Engine :: KG_DIGI_V2',
        title: '4-Layer Engineering Architecture',
        subtext: 'Enterprise digital challenges deconstructed into scalable, governed, and automated delivery layers.',
        layers: [
          { title: 'Platform', id: 'KG_PLAT', icon: <Layers />, desc: 'Cloud-native architecture, microservices transition, and scalable digital ecosystems.' },
          { title: 'Quality', id: 'KG_QUAL', icon: <ShieldCheck />, desc: 'AI-driven test automation, DevSecOps integration, and continuous reliability.' },
          { title: 'Device', id: 'KG_DEV', icon: <Network />, desc: 'IoT integration, embedded software, and intelligent edge computing.' },
          { title: 'Experience', id: 'KG_EXP', icon: <BrainCircuit />, desc: 'Cognitive, human-centered design bridging technical feasibility with user adoption.' }
        ]
      },
      schematic: {
        titleLine1: 'Accelerate',
        titleHighlight: 'Innovation.',
        description: 'Our Digital Engineering ecosystem ensures every code commit delivers measurable ROI — reducing time-to-market while ensuring absolute reliability.',
        stats: [
          { label: 'Time-to-Market', val: 'ACCELERATED' },
          { label: 'Platform Scalability', val: 'INFINITE' },
          { label: 'Quality Assurance', val: 'AUTOMATED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform physical products with digital capabilities and connected experiences.'
  };

  // ============================================
  // CAPABILITIES — Happiest Minds Benchmark, MNC Execution
  // ============================================
  const capabilities = [
    {
      title: 'Next-Gen Platform Engineering',
      description: 'Build high-performing modern solutions bridging cloud-native architectures and AI-driven automation. We transform legacy monoliths into agile microservices, enabling true digital scale.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Cloud-native platform development',
        'Monolith to microservices migration',
        'Backend, API, and UI optimization',
        'Azure & AWS migration accelerators',
        'High-availability ecosystem design'
      ]
    },
    {
      title: 'AI-Driven Quality Engineering (QE)',
      description: 'Transform QA from a cost center to a business enabler. Our automation-first, risk-based QE approach leverages AI and ML to accelerate testing without compromising absolute reliability.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Intelligent test automation frameworks',
        'GenAI-powered test case generation',
        'Cloud & Packaged application testing',
        'Performance, security & compliance testing',
        'Quality Center of Excellence (QCoE) setup'
      ]
    },
    {
      title: 'Smart Device & IoT Engineering',
      description: 'Develop cutting-edge hardware solutions and modernize existing devices. We connect physical assets to the digital thread, enabling intelligent automation and real-time edge computing.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Embedded software & firmware development',
        'End-to-end device prototyping & design',
        'Digital twin & edge computing solutions',
        'Regulatory certification & compliance',
        'Hardware-to-cloud telemetry pipelines'
      ]
    },
    {
      title: 'Cognitive Experience Design',
      description: 'Grounded in Human-Centered Design, our 5DE approach unites people, businesses, and technologies. We craft digital experiences that drive user adoption, retention, and trust.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Empathy-driven UX/UI strategy',
        'Frictionless user journey mapping',
        'Interactive prototyping & validation',
        'Technical feasibility alignment',
        'Cross-platform experience consistency'
      ]
    },
    {
      title: 'MVP & Innovation Acceleration',
      description: 'Bring innovations to life before your competitors do. Our Digital Foundry offering is designed for startups and enterprise innovation labs needing rapid, scalable product conceptualization.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Rapid concept-to-prototype cycles',
        'Minimum Viable Product (MVP) engineering',
        'Product architecture consulting',
        'Lean innovation team augmentation',
        'Fast-fail learning iterations'
      ]
    }
  ];

  // ============================================
  // TECHNOLOGY STACK
  // ============================================
  const technologies = [
    { category: 'Next-Gen Platform Engineering', items: ['AWS / Azure', 'Docker / Kubernetes', 'Spring Boot', 'Node.js', 'Go'] },
    { category: 'AI-Driven Quality Engineering', items: ['Selenium / Cypress', 'Appium', 'JMeter', 'SonarQube', 'AI Test Gen (GenAI)'] },
    { category: 'Smart Device & IoT Engineering', items: ['C / C++', 'Python', 'MQTT / AMQP', 'FreeRTOS', 'Azure IoT Edge'] },
    { category: 'Cognitive Experience Design', items: ['Figma', 'Framer', 'React / Next.js', 'Three.js / WebGL', 'Tailwind CSS'] },
    { category: 'MVP & Innovation Acceleration', items: ['Vercel', 'Firebase / Supabase', 'GraphQL', 'Tailwind CSS', 'Vercel AI SDK'] }
  ];

  // ============================================
  // SOLUTIONS CAROUSEL
  // ============================================
  const solutions = [
    {
      title: "Next-Gen Platform Engineering",
      description: "Scalable, cloud-native architectures that transition your monolithic systems into high-performing, agile digital ecosystems.",
      icon: <Layers className="w-8 h-8" />
    },
    {
      title: "AI-Driven Quality Engineering",
      description: "Intelligent test frameworks powered by AI to ensure software reliability, accelerate delivery, and transform QA into a strategic asset.",
      icon: <ShieldCheck className="w-8 h-8" />
    },
    {
      title: "Smart Device Engineering",
      description: "From embedded systems to digital twins, we modernize hardware to interact seamlessly within your connected enterprise.",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Cognitive Experience Design",
      description: "Human-centered UI/UX that eliminates friction, builds empathy, and guarantees technical feasibility at scale.",
      icon: <BrainCircuit className="w-8 h-8" />
    },
    {
      title: "Innovation Acceleration",
      description: "Rapid MVP development and architecture consulting via our Digital Foundry, getting your best ideas to market faster.",
      icon: <Rocket className="w-8 h-8" />
    }
  ];

  // ============================================
  // DIGITAL ENGINEERING CENTER OF EXCELLENCE (Diamond)
  // ============================================
  const rdCoESection = (
    <section className="py-24 lg:py-32 overflow-hidden relative bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Strategic Intro */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight">
              The Digital Engineering <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Center of Excellence</span>
            </h2>
            <div className="relative pl-6 border-l-[3px] border-brand-blue" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's Digital Foundry™ provides a holistic, outcome-assured delivery structure: uniting <strong className="text-brand-blue">Platform Architecture</strong>, <strong className="text-brand-blue">Intelligent Quality</strong>, <strong className="text-brand-blue">Device Connectivity</strong>, and <strong className="text-brand-blue">Experience Design</strong>.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                By integrating these core disciplines, we eliminate execution silos. We don't just write code — we engineer unified digital enterprise systems that scale predictably and adapt continuously to market demands.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram (Adapted from DPA) */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* TRUE 3D DIAMOND */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Left -> Platform Engineering */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Platform</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Engineering</span>
                        </div>
                      </div>
                      {/* Top Right -> Quality Engineering */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Quality</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Engineering</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Experience Design */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Experience</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Design</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Device Connectivity */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Smart</span>
                          <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Devices</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BULLET LABELS */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right"><span>Cloud-native architecture</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>Monolith to microservices</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>API & UI modernization</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>AI-driven test automation</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Security & compliance testing</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>QCoE transformation</span></li>
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right"><span>Human-centric UI strategy</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>Frictionless UX mapping</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>Interactive prototyping</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Embedded software design</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>IoT edge connectivity</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Hardware telemetry pipelines</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Layout */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'Platform', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['Cloud-native architecture', 'Microservices migration', 'API modernization'] },
                { title: 'Quality', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['AI test automation', 'Security & compliance', 'QCoE setup'] },
                { title: 'Experience', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['Human-centric UX', 'Frictionless mapping', 'Prototyping'] },
                { title: 'Device', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Embedded software', 'IoT connectivity', 'Hardware telemetry'] }
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
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Engineering DNA',
                text: 'Building products and platforms is not just development—it’s a craft. Our teams operate with an engineering-first mindset and execution maturity, embracing distributed agile, DevOps, and CloudOps to deliver quality at speed and build sustainable momentum in competitive markets.'
              },
              {
                num: 2,
                title: 'Integrated Next-Gen Technologies',
                text: 'Real transformation requires more than isolated tools. We bring an integrated capability stack across AI & GenAI, Analytics, Hyperautomation, Cybersecurity, and modern cloud engineering—so you get a cohesive end-to-end value proposition, not a fragmented multi-vendor approach.'
              },
              {
                num: 3,
                title: 'Digital Transformation with CX at the Core',
                text: 'True digital transformation is customer-led. Our consultative approach and hands-on delivery across platform engineering, data & analytics, and experience engineering help you combine intelligent data with real human insight—improving agility and elevating organizational outcomes.'
              },
              {
                num: 4,
                title: 'MVP Translation & Acceleration',
                text: 'From concept to architecture consulting, we help startups and enterprise innovation teams find product-market fit faster through rapid prototyping and lean engineering.'
              }
            ].map((diff) => (
              <div key={diff.num} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
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
  // WHY KANGQORE
  // ============================================
  const whyKangqoreIntro = `Kangqore's Product & Digital Engineering practice isn't just about modernizing code — it's about accelerating market dominance. We bring enterprise-grade scale with startup-like velocity.`;

  const whyKangqore = [
    { 
      title: 'Pimcore', 
      description: 'Kangqore’s expertise in the Pimcore solutions empowers enterprises to drive innovation and accelerate growth in today’s dynamic digital landscape.' 
    },
    { 
      title: 'Managed Content as a Service', 
      description: 'Enabling real time, relevant digital asset delivery and discovery on the device, and channel of choice is imperative for creating differentiation in the digital business world. Intelligent solutions that can streamline, optimize, and manage digital experiences through content are the need of the hour.' 
    },
    { 
      title: 'Kangqore IoT Fabric', 
      description: 'With the exponential increase in the number of connected IoT devices, enterprises are prioritizing data monetization. Proprietary IoT platforms are now non-negotiable. Kangqore IoT Fabric provides a secure, enterprise-grade infrastructure to guarantee the smooth, scalable implementation of your connected device ecosystem.' 
    },
    { 
      title: 'Anomaly Detection', 
      description: 'The digital world has changed dramatically in the last few years. Global data production is expected to double every two years through 2026. While every business races to harness the power of this digital universe, the sheer velocity and variety of information easily overwhelms legacy systems. Our anomaly detection delivers precise insights through the noise.' 
    }
  ];

  const industries = [
    { name: 'Healthcare & Life Sciences' },
    { name: 'EdTech & Digital Learning' },
    { name: 'Industrial & Manufacturing' },
    { name: 'Banking & Financial Services' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Media & Entertainment' }
  ];

  const customFAQs = [
    {
      question: 'What is the Digital Foundry offering?',
      answer: 'The Digital Foundry is our specialized innovation engine designed to help startups, digital natives, and enterprise teams accelerate their concept-to-prototype cycle. We provide MVP engineering, architecture consulting, and rapid market validation.'
    },
    {
      question: 'How does your Quality Engineering differ from traditional testing?',
      answer: 'Traditional testing is reactive and manual. Our Quality Engineering (QE) is an automation-first, risk-based approach leveraging AI/ML and GenAI. We build intelligent test frameworks that integrate directly into continuous delivery pipelines, transforming QA into a strategic enabler.'
    },
    {
      question: 'Do you help with legacy system modernization?',
      answer: 'Yes. Our Platform Engineering practice specializes in transitioning monolithic, legacy architectures into modular, cloud-native microservices on AWS and Azure, ensuring high performance and unconstrained scalability.'
    },
    {
      question: 'What is involved in Device Engineering?',
      answer: 'Our Device Engineering practice covers the intersection of physical hardware and digital platforms. This includes embedded software design, FPGA/VLSI design, and the creation of intelligent IoT, digital twin, and edge computing networks.'
    }
  ];

  // ============================================
  // RELATED OFFERINGS — TECHNICAL SCHEMATIC SECTION
  // ============================================
  const customSections = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Synergistic Ecosystem
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Disciplines.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Digital product engineering is the vanguard of transformation. Amplify its impact by integrating our data, cloud, and core automation frameworks.
            </p>
            <div className="space-y-4">
              {[
                { name: 'DevOps & CloudOps', link: '/services/cloud/engineering', icon: <Workflow className="w-5 h-5" />, desc: 'Ensure continuous integration, collaboration, and unbreakable delivery pipelines.' },
                { name: 'Big Data Strategy', link: '/services/data-ai/data-engineering', icon: <Layers className="w-5 h-5" />, desc: 'Unlock meaningful insights and drive predictive product decision-making.' },
                { name: 'Embedded Design', link: '/services/product-engineering/embedded-design-systems', icon: <Cpu className="w-5 h-5" />, desc: 'Precision engineering for specialized embedded microcontrollers and IoT systems.' },
                { name: 'Agentic AI', link: '/services/data-ai/generative-ai', icon: <Bot className="w-5 h-5" />, desc: 'Power next-generation autonomous workflows within your products.' }
              ].map((offering, idx) => (
                <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
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

          {/* Technical Schematic Diagram */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#DIGI_CORE</span></div>
                <div className="flex justify-between gap-4"><span>MODE:</span> <span>SCALING</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">LIVE</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">SysLog</div>
                <div>PLATFORM_SYNC...</div>
                <div>LATENCY: &lt;1ms</div>
              </div>

              {/* Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Target className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Rocket className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">PROTOTYPE</span>
                </div>
              </div>
              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <BrainCircuit className="w-12 h-12 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">COGNITIVE</span>
                </div>
              </div>
              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative"><RadioTower className="w-16 h-16 text-emerald-400" /></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">TELEMETRY</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      solutions,
      trustPillars: [], // Using differentiators instead
      preWhyKangqoreSections: rdCoESection,
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industries We Empower',
      industries,
      customFAQs,
      postFAQSections: customSections
    },
    department
  };

  return (
    <ServicePageTemplate 
      service={pageData.service} 
      department={department} 
      primaryButton={pageData.service.primaryButton}
      secondaryButton={pageData.service.secondaryButton}
    />
  );
};

export default ProductDigitalEngineering;
