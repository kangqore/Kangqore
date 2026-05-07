import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Cloud, Layers, Zap, Search, Activity, ShieldCheck, 
  Database, Network, Settings, ArrowRight,
  BrainCircuit, Target, Workflow, CheckCircle2, Award, Users,
  Cpu, Radar, Eye, TrendingUp, BarChart3, Gauge, Wrench, RefreshCw,
  AlertTriangle, Lock, Radio, Factory, Cog, Signal, HardDrive,
  MonitorSmartphone, FileCheck, Shield, Laptop2, Cable
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OperationTechnology = () => {
  // Refs must be declared before any JSX that uses them
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);

  // ============================================
  // A. HERO SECTION
  // ============================================
  const service = {
    name: 'Operation Technology',
    titleLine1: 'Operation',
    titleHighlight: 'Technology.',
    slug: 'operation-technology',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    shortDescription: "Bridging industrial operations with intelligent IT convergence.",
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises connect, secure, and modernize operational technology environments — from SCADA and PLC ecosystems to industrial connectivity, edge enablement, and predictive maintenance. We bring IT-grade governance and visibility to OT environments without compromising safety, uptime, or operational continuity.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200&q=80',
    stats: [
      { value: 'Connect', label: 'Industrial systems & IT platforms', color: 'text-blue-500' },
      { value: 'Secure', label: 'OT environments & access control', color: 'text-brand-blue' },
      { value: 'Monitor', label: 'Assets, alerts & operational health', color: 'text-indigo-500' },
      { value: 'Optimize', label: 'Uptime & predictive maintenance', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    ctaTitle: 'Ready to modernize your industrial operations without risking uptime?',
    ctaDescription: "Let\u2019s build an OT strategy that connects your plant floor to your enterprise platform — with governed security, real-time visibility, and predictive intelligence.",
    ctaSecondaryButton: { text: "Explore Capabilities", link: "/contact" },

    // ============================================
    // B. PROBLEM / MARKET TENSION
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'INDUSTRIAL OPERATIONS :: 2026',
        titleLine1: 'Legacy OT environments',
        titleHighlight: "weren't built",
        titleLine2: 'for digital convergence.',
        description: 'Industrial control systems were designed for isolation and stability — not connectivity, analytics, or cybersecurity. As enterprises push for IT/OT convergence, smart manufacturing, and predictive operations, the gap between legacy OT infrastructure and modern business expectations creates risk, blind spots, and lost operational value.',
        bottleneckLabel: 'The Exposure',
        bottleneckText: '70% of industrial organizations report critical visibility gaps across their OT environments and connected assets.*',
        requirementLabel: 'The Drift',
        requirementText: '62% of OT cybersecurity incidents originate from inadequate network segmentation and access control.*',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
        statusLabel: 'OT Posture',
        statusValue: 'At Risk'
      },

      // C. Delivery Model Intro
      philosophy: {
        icon: <Factory className="w-7 h-7 text-brand-blue" />,
        title: 'Our OT Transformation',
        titleHighlight: 'Delivery Model.',
        description: 'At Kangqore, OT modernization is executed through a phased, safety-first delivery model — designed to improve visibility, connectivity, and security across industrial environments without disrupting production.',
        pills: ['Assess & Discover', 'Design & Architect', 'Implement & Integrate', 'Govern & Optimize']
      },

      // D. Lifecycle Phases
      matrix: {
        engineId: 'Engine :: OT-CONV_V3',
        title: 'OT Convergence Lifecycle',
        subtext: 'Our OT modernization lifecycle deconstructed into phased, safety-conscious, enterprise-grade execution layers.',
        layers: [
          { title: 'Discover', id: 'OT_DISC', icon: <Search />, desc: 'Map OT assets, dependencies, risks, network topology, and modernization readiness.' },
          { title: 'Architect', id: 'OT_ARCH', icon: <Layers />, desc: 'Design segmented networks, secure zones, edge connectivity, and integration pathways.' },
          { title: 'Integrate', id: 'OT_INTG', icon: <Cable />, desc: 'Deploy connectivity, monitoring, analytics, and IT/OT bridge infrastructure.' },
          { title: 'Govern', id: 'OT_GOV', icon: <ShieldCheck />, desc: 'Sustain cybersecurity, compliance, predictive maintenance, and continuous improvement.' }
        ]
      },

      // E. Big Typography Block
      schematic: {
        titleLine1: 'Industrial Intelligence',
        titleHighlight: 'From Edge to Enterprise.',
        description: 'From sensor to boardroom — unifying operational data, industrial security, and predictive analytics into a governed, resilient operating model.',
        stats: [
          { label: 'Visibility', val: 'REAL-TIME' },
          { label: 'Security', val: 'HARDENED' },
          { label: 'Uptime', val: 'MAXIMIZED' }
        ]
      }
    },

    // ============================================
    // F. TRUST STRIP
    // ============================================
    trustStripText: 'Modernizing OT environments with governed connectivity, industrial cybersecurity, and predictive operational intelligence.',

    // ============================================
    // G. TRUST PILLARS (Value We Deliver)
    // ============================================
    trustPillars: [
      {
        title: 'OT Environment Visibility & Assessment',
        tag: 'Discovery',
        description: 'Gain a clear picture of your industrial systems, asset dependencies, risks, and modernization priorities — building the foundation for safe transformation.'
      },
      {
        title: 'Industrial Network Segmentation & Resilience',
        tag: 'Architecture',
        description: 'Strengthen plant-floor network boundaries with secure zone design, segmentation strategies, and reliability improvements that reduce exposure.'
      },
      {
        title: 'OT Cybersecurity & Access Governance',
        tag: 'Security',
        description: 'Protect industrial control systems through risk-aware access control, threat monitoring, policy enforcement, and cyber hygiene practices.'
      },
      {
        title: 'Edge Connectivity & Real-Time Monitoring',
        tag: 'Operations',
        description: 'Connect operational assets for integrated monitoring, alert management, and data flow from machines to enterprise analytics platforms.'
      },
      {
        title: 'Predictive Maintenance & Operational Analytics',
        tag: 'Intelligence',
        description: 'Turn OT data into actionable insight — enabling predictive maintenance strategies, failure trend analysis, and smarter operational decision-making.'
      }
    ],
    trustPillarsRightTitle: 'Governed OT Modernization: Built for Safety, Visibility & Industrial Intelligence',
    trustPillarsRightDescription: 'Kangqore structures OT transformation around safety-first principles, zero-disruption deployment, and enterprise-grade governance. We bring IT rigor to industrial environments — improving connectivity, cybersecurity, and operational intelligence without compromising production stability.',
    trustPillarsRightButton: 'Request a Consultation',

    // ============================================
    // H. FAQ CONFIG
    // ============================================
    faqTitle: 'Frequently Asked Questions',
    faqSubline: 'Common questions about our OT modernization approach, industrial cybersecurity, IT/OT convergence, and predictive operations.',

    // ============================================
    // TECHNOLOGIES CONFIG
    // ============================================
    technologiesTitle: 'Tools & Technologies We Use Across OT Operations',
    technologiesDescription: 'We work across industrial control, SCADA, edge, monitoring, and cybersecurity ecosystems — aligning tools to your OT environment complexity and governance needs.',
  };

  // ============================================
  // CAPABILITIES — 8 OT-Specific Cards
  // ============================================
  const capabilities = [
    {
      title: 'OT Environment Assessment',
      description: 'Evaluate industrial systems, dependencies, risks, and modernization priorities. Kangqore helps organizations understand their OT landscape through structured discovery, dependency mapping, resilience analysis, and modernization readiness evaluation.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Current-state OT discovery',
        'Asset dependency and risk mapping',
        'Uptime and resilience assessment',
        'Modernization and control recommendations'
      ]
    },
    {
      title: 'SCADA / PLC / HMI Support',
      description: 'Support and optimize core industrial control environments. We help sustain and improve industrial control layers by supporting SCADA environments, PLC and HMI ecosystems, and the operational coordination needed to keep systems dependable.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'SCADA environment support',
        'PLC and HMI ecosystem coordination',
        'Configuration review and operational tuning',
        'Support continuity for control systems'
      ]
    },
    {
      title: 'Industrial Connectivity & Edge Enablement',
      description: 'Connect operational assets for real-time monitoring and integrated operations. Kangqore enables industrial connectivity that improves visibility, control, and responsiveness across plant, field, and edge environments.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Edge gateway enablement',
        'Plant-to-platform connectivity',
        'Protocol-aware integration support',
        'Remote visibility and asset data flow'
      ]
    },
    {
      title: 'OT Network Segmentation & Reliability',
      description: 'Improve plant-floor network resilience and control. We strengthen industrial environments through better segmentation, secure architectural boundaries, and reliability-focused network design.',
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Industrial segmentation strategy',
        'Secure zone and conduit design',
        'Connectivity reliability improvements',
        'Network visibility across OT environments'
      ]
    },
    {
      title: 'OT Cybersecurity & Access Control',
      description: 'Protect industrial systems against disruption and unsafe exposure. Kangqore helps enterprises improve OT cyber readiness through access control, monitoring alignment, and risk-aware security practices.',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'OT risk posture assessment',
        'Access control and identity governance',
        'Threat monitoring alignment',
        'Policy enforcement and cyber hygiene'
      ]
    },
    {
      title: 'Monitoring, Alerts & Asset Visibility',
      description: 'Enable proactive issue detection across industrial operations. We support OT visibility through asset health monitoring, alerting frameworks, event correlation, and operational reporting.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Asset health and uptime visibility',
        'Alerting and monitoring frameworks',
        'Event correlation and operational reporting',
        'Early issue detection support'
      ]
    },
    {
      title: 'Industrial Data Integration & Analytics',
      description: 'Turn OT data into operational and business insight. Kangqore helps bridge OT and IT data flows so industrial environments can support reporting, analytics, and smarter decision-making.',
      image: 'https://images.unsplash.com/photo-1504384308090-c89e12bf9a42?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'OT-to-IT data integration',
        'Historian and reporting alignment',
        'Industrial analytics enablement',
        'KPI visibility across operational assets'
      ]
    },
    {
      title: 'Predictive Maintenance Enablement',
      description: 'Reduce breakdown risk and improve equipment lifecycle performance. We help organizations use operational data to support predictive maintenance strategies and identify failure trends earlier.',
      image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Condition-based monitoring support',
        'Predictive maintenance data frameworks',
        'Failure trend analysis enablement',
        'Maintenance planning insights'
      ]
    }
  ];

  // ============================================
  // TECHNOLOGIES — Categorized
  // ============================================
  const technologies = [
    {
      category: 'SCADA / ICS / Control',
      items: ['Siemens WinCC', 'Schneider ClearSCADA', 'Rockwell FactoryTalk', 'Honeywell Experion']
    },
    {
      category: 'Edge & Industrial IoT',
      items: ['Azure IoT Edge', 'AWS IoT Greengrass', 'MQTT / OPC-UA', 'Kepware']
    },
    {
      category: 'Monitoring / Observability',
      items: ['Splunk OT', 'Grafana', 'Prometheus', 'OSIsoft PI']
    },
    {
      category: 'OT Cybersecurity',
      items: ['Claroty', 'Nozomi Networks', 'Fortinet OT', 'Dragos']
    }
  ];

  // ============================================
  // CUSTOM FAQs — 6 OT-Specific
  // ============================================
  const customFAQs = [
    {
      question: 'What OT environments does Kangqore support?',
      answer: 'We support a wide range of industrial environments including SCADA systems, PLC and HMI ecosystems, DCS platforms, industrial IoT deployments, edge computing environments, and connected manufacturing operations. Our teams have experience across manufacturing, energy, utilities, transportation, and critical infrastructure sectors.'
    },
    {
      question: 'How do you approach IT/OT convergence without disrupting production?',
      answer: 'We follow a safety-first, phased delivery model. Every integration begins with thorough OT environment assessment, dependency mapping, and risk analysis. We implement changes through governed maintenance windows, use non-intrusive monitoring solutions, and maintain rollback-ready plans. Production stability is always the top priority.'
    },
    {
      question: 'What is your approach to OT cybersecurity?',
      answer: 'Our OT cybersecurity approach includes risk posture assessment, network segmentation design (Purdue Model alignment), access control and identity governance, threat monitoring alignment, vulnerability management, and policy enforcement. We follow IEC 62443 and NIST CSF frameworks adapted for industrial environments.'
    },
    {
      question: 'Can you help with predictive maintenance enablement?',
      answer: 'Yes. We help organizations leverage condition-based monitoring data, vibration analysis, temperature tracking, and operational telemetry to build predictive maintenance strategies. This includes data framework design, failure trend analysis, maintenance planning optimization, and integration with enterprise asset management systems.'
    },
    {
      question: 'How do you handle OT data integration with IT systems?',
      answer: 'We bridge OT and IT data flows through protocol-aware integration (OPC-UA, MQTT, Modbus), historian alignment, edge-to-cloud data pipelines, and analytics enablement. This allows industrial data to flow securely into enterprise reporting, BI dashboards, and operational analytics platforms.'
    },
    {
      question: 'Do you provide ongoing OT managed services?',
      answer: 'Yes. Beyond implementation, we offer ongoing OT monitoring, incident support, patch coordination, security hygiene maintenance, and continuous improvement services. Our managed OT services include regular health checks, vulnerability assessments, and governance reviews to sustain security and performance.'
    }
  ];

  // ============================================
  // WHY KANGQORE — 6 Cards
  // ============================================
  const whyKangqore = [
    { title: 'Industrial-First Approach', description: 'We understand that OT environments have unique constraints — safety, uptime, legacy protocols. Our solutions respect these realities while driving modernization.' },
    { title: 'IT/OT Convergence Expertise', description: 'Bridging the gap between enterprise IT governance and industrial operations with secure, governed integration pathways.' },
    { title: 'Safety-First Deployment', description: 'Every change follows non-disruptive implementation protocols with rollback readiness, production-safe testing, and governed maintenance windows.' },
    { title: 'End-to-End OT Coverage', description: 'From SCADA support to predictive maintenance — one partner for assessment, cybersecurity, connectivity, monitoring, and analytics.' },
    { title: 'Cybersecurity at the Core', description: 'IEC 62443 and NIST CSF-aligned security practices built into every OT engagement, not bolted on as an afterthought.' },
    { title: 'Measurable Outcomes', description: 'We track uptime improvements, incident reduction, mean-time-to-detection, and predictive maintenance ROI with transparent governance.' }
  ];

  const whyKangqoreIntro = 'Kangqore brings enterprise IT discipline to industrial OT environments — connecting, securing, and optimizing operational technology with the same governance rigor applied to cloud, network, and application infrastructure.';

  // ============================================
  // INDUSTRIES — 6 with Unique Descriptions
  // ============================================
  const industries = [
    { name: 'Manufacturing', description: 'Smart factory enablement with connected OT, predictive maintenance, and industrial analytics.' },
    { name: 'Energy & Utilities', description: 'Secure grid operations with real-time SCADA monitoring and cyber-hardened infrastructure.' },
    { name: 'Transportation & Logistics', description: 'Connected fleet and facility operations with edge-enabled asset tracking.' },
    { name: 'Oil & Gas', description: 'Remote asset monitoring, pipeline telemetry, and safety-critical OT cybersecurity.' },
    { name: 'Healthcare & Life Sciences', description: 'Medical device connectivity and regulated environment OT compliance.' },
    { name: 'Mining & Resources', description: 'Autonomous operations support with predictive equipment maintenance and site monitoring.' }
  ];

  // ============================================
  // 3D DIAMOND — OT Operations CoE
  // ============================================
  const otCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
          
          {/* Left: Description */}
          <div className="lg:w-[40%] xl:w-[35%] relative z-20">
            <div className="border-l-4 border-brand-blue/30 pl-8">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight leading-tight">
                Kangqore's OT Operations Center of Excellence (CoE) surrounds industrial environments with four vital execution layers — {' '}
                <span className="text-transparent bg-clip-text bg-brand-gradient">Assessment & SCADA</span>,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">Connectivity & Edge</span>,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500">Security & Segmentation</span>,{' '}
                and <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Analytics & Prediction</span>.
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                We replace fragmented OT management with a unified operating model. From SCADA support to predictive maintenance, from network segmentation to industrial analytics, our architecture ensures safe connectivity, hardened security, and operational intelligence across every industrial layer.
              </p>
            </div>
          </div>

          {/* Right: 3D Diamond */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG connector lines */}
                <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 600 600" fill="none">
                  <defs>
                    <linearGradient id="ot-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="300" cy="40" r="7" fill="url(#ot-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#ot-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#ot-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#ot-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#ot-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#ot-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#ot-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#ot-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* 3D Diamond */}
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
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Left -> Assessment & SCADA */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <Search className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Assessment<br />& SCADA
                          </span>
                        </div>
                      </div>
                      {/* Top Right -> Connectivity & Edge */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <Signal className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Connectivity<br />& Edge
                          </span>
                        </div>
                      </div>
                      {/* Bottom Left -> Security & Segmentation */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <Shield className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Security &<br />Segmentation
                          </span>
                        </div>
                      </div>
                      {/* Bottom Right -> Analytics & Prediction */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                        transform: 'translateZ(5px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="relative text-center" style={{ transform: 'rotate(-45deg)' }}>
                          <BarChart3 className="w-5 h-5 text-white/80 mx-auto mb-1" />
                          <span className="text-white font-bold text-[11px] tracking-wider leading-tight">
                            Analytics &<br />Prediction
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contextual Labels */}
                {/* Top Left: Assessment & SCADA */}
                <div className="absolute top-[60px] left-[30px] text-right space-y-1 z-20">
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">OT Discovery & Mapping</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">SCADA Environment Support</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">PLC & HMI Coordination</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Modernization Readiness</span><span className="w-2 h-2 bg-brand-blue rounded-full"></span></div>
                </div>
                {/* Top Right: Connectivity & Edge */}
                <div className="absolute top-[60px] right-[30px] text-left space-y-1 z-20">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Edge Gateway Enablement</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Plant-to-Platform Connectivity</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Protocol Integration (OPC-UA)</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Remote Asset Data Flow</span></div>
                </div>
                {/* Bottom Left: Security & Segmentation */}
                <div className="absolute bottom-[60px] left-[30px] text-right space-y-1 z-20">
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Industrial Segmentation</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Secure Zone & Conduit Design</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">OT Access Control</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                  <div className="flex items-center justify-end gap-2"><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Threat Monitoring Alignment</span><span className="w-2 h-2 bg-indigo-500 rounded-full"></span></div>
                </div>
                {/* Bottom Right: Analytics & Prediction */}
                <div className="absolute bottom-[60px] right-[30px] text-left space-y-1 z-20">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">OT-to-IT Data Integration</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Industrial Analytics Platform</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Predictive Maintenance Data</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span><span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium">Failure Trend Analysis</span></div>
                </div>
              </div>
            </div>

            {/* Mobile Diamond fallback */}
            <div className="lg:hidden grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { name: 'Assessment & SCADA', icon: <Search className="w-5 h-5" />, color: 'from-blue-500 to-blue-700' },
                { name: 'Connectivity & Edge', icon: <Signal className="w-5 h-5" />, color: 'from-cyan-400 to-cyan-600' },
                { name: 'Security & Segmentation', icon: <Shield className="w-5 h-5" />, color: 'from-indigo-400 to-indigo-600' },
                { name: 'Analytics & Prediction', icon: <BarChart3 className="w-5 h-5" />, color: 'from-amber-400 to-amber-600' }
              ].map((q, i) => (
                <div key={i} className={`bg-gradient-to-br ${q.color} p-5 rounded-2xl text-white text-center`}>
                  <div className="mx-auto mb-2 opacity-80">{q.icon}</div>
                  <span className="font-bold text-xs tracking-wider">{q.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Differentiators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-28 relative z-10">
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Safety-First IT/OT Convergence',
                text: 'We bridge IT governance and OT operations with a phased, risk-aware approach — ensuring every integration respects production constraints, safety protocols, and legacy system dependencies.'
              },
              {
                num: 2,
                title: 'IEC 62443-Aligned Cybersecurity',
                text: 'Our OT security practices follow international industrial cybersecurity standards — from network segmentation and access governance to threat monitoring and vulnerability management.'
              },
              {
                num: 3,
                title: 'Edge-to-Enterprise Data Pipeline',
                text: 'We connect sensor data, SCADA historians, and edge devices to enterprise analytics platforms using protocol-aware integration — turning raw OT data into actionable operational intelligence.'
              },
              {
                num: 4,
                title: 'Predictive Maintenance Intelligence',
                text: 'Our approach goes beyond basic condition monitoring — we build predictive data frameworks that identify failure patterns, optimize maintenance windows, and extend equipment lifecycle performance.'
              },
              {
                num: 5,
                title: 'Unified Industrial Visibility',
                text: 'We replace fragmented OT monitoring silos with a governed visibility layer — giving operations and IT leaders transparent access to asset health, alerts, incident trends, and security posture across all industrial environments.'
              }
            ].map((diff) => (
              <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{diff.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // EXECUTION ECOSYSTEM — Related INO Expertise
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black/50 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Industrial <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Extend your OT modernization by integrating managed services, infrastructure support, and network operations into a unified industrial operating model.
            </p>

            <div className="space-y-4">
              {[
                { name: 'Managed Services', desc: 'End-to-end managed IT operations.', icon: <Settings className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/managed-services' },
                { name: 'Support & Maintenance', desc: 'Structured support & system upkeep.', icon: <Wrench className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/support-maintenance' },
                { name: 'Infrastructure Modernization', desc: 'Modernize legacy IT environments.', icon: <Cloud className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/modernization-infrastructure' },
                { name: 'Network & Connectivity', desc: 'Enterprise network engineering.', icon: <Network className="w-5 h-5 text-gray-400" />, link: '/services/infrastructure-networks-operations/managed-infrastructure-services' }
              ].map((svc, i) => (
                <Link key={i} to={svc.link} className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-100 hover:border-brand-blue/20 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-[#050505] rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {svc.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{svc.name}</h4>
                    <p className="text-sm text-gray-400">{svc.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <Link to="/services/infrastructure-networks-operations" className="inline-flex items-center gap-2 mt-8 text-brand-blue font-bold text-sm hover:gap-3 transition-all">
              Explore All INO Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated OT Operations Schematic */}
          <div className="lg:w-1/2 relative hidden lg:flex items-center justify-center min-h-[500px]">
            <div className="relative">
              <div className="absolute -inset-16 border-2 border-dashed border-gray-200 rounded-full" style={{ animation: 'spin 30s linear infinite' }}></div>
              <div className="w-28 h-28 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                <Factory className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Satellite Nodes */}
            <div className="absolute top-8 right-16 flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                <Radio className="w-8 h-8 text-brand-blue" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">SCADA</span>
            </div>
            <div className="absolute bottom-16 left-8 flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">Security</span>
            </div>
            <div className="absolute bottom-16 right-8 flex flex-col items-center gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-lg flex items-center justify-center relative">
                <Activity className="w-10 h-10 text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">Telemetry</span>
            </div>
            <div className="absolute top-16 left-12 flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                <Cog className="w-8 h-8 text-amber-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase">PLC/HMI</span>
            </div>

            {/* Floating metadata badges */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm rounded-lg shadow-md px-4 py-2 border border-gray-100">
              <div className="flex gap-6 font-mono text-[10px]">
                <div><span className="text-gray-400">ID:</span> <span className="text-brand-blue font-bold">#KG_OT_OPS</span></div>
                <div><span className="text-gray-400">SLA:</span> <span className="text-emerald-500 font-bold">99.99%</span></div>
                <div><span className="text-gray-400">STATUS:</span> <span className="text-emerald-500 font-bold">HARDENED</span></div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl px-4 py-3 border border-slate-700/50">
              <div className="font-mono text-[10px] space-y-1">
                <div className="text-amber-400 font-bold tracking-widest">OT ENGINE</div>
                <div className="text-gray-400">MONITORING_ASSETS...</div>
                <div className="text-gray-400">STATUS: <span className="text-emerald-400">FERRARI</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // DEPARTMENT
  // ============================================
  const department = {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    description: 'Transform your business with cutting-edge infrastructure, networks & operations solutions.'
  };

  // ============================================
  // GSAP ANIMATION HOOKS
  // ============================================
  useEffect(() => {
    // Animated Stat Counters
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

    // Diamond Entrance
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: diamondRef.current, start: 'top 80%', once: true }
        }
      );
      gsap.to(diamondRef.current, {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: diamondRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    // Differentiator staggered entrance
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        {
          opacity: 1, y: 0, x: 0,
          duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true }
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
  // COMBINE & RENDER
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      customFAQs,
      whyKangqore,
      whyKangqoreIntro,
      industries,
      trustPillarsVideo: '/videos/working-machine-4751312.mp4',
      preWhyKangqoreSections: otCoESection,
      postFAQSections: executionEcosystemSection
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default OperationTechnology;
