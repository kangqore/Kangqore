import React from 'react';
import { Layers, Search, ShieldCheck, Zap, Target, Bot, Activity, BrainCircuit, CheckCircle2, Cpu, Rocket, MonitorSmartphone, Code2, Network, RadioTower, Microchip, BarChart3, Globe2, Shield, TrendingUp, Award } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const EngineeringRDServices = () => {
  // ============================================
  // SERVICE IDENTITY — MNC-GRADE POSITIONING
  // ============================================
  const service = {
    name: 'Engineering R&D Services',
    titleLine1: 'Engineering',
    titleHighlight: 'R&D Services.',
    slug: 'engineering-rd-services',
    shortDescription: 'Intelligent products. Connected ecosystems. Measurable outcomes.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">From product vision to market dominance — at enterprise velocity.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore's Engineering R&D Services enable enterprises to build intelligent, data-driven products powered by six proprietary solution accelerators. We engineer across the full product lifecycle — from UX intelligence and connected data platforms to agile delivery frameworks and developer ecosystem enablement — delivering measurable business outcomes at every stage.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    stats: [
      { value: 'Analyze', label: 'User behavior', color: 'text-blue-500' },
      { value: 'Connect', label: 'M2M data fabrics', color: 'text-brand-blue' },
      { value: 'Accelerate', label: 'Agile delivery', color: 'text-indigo-500' },
      { value: 'Enable', label: 'Developer ecosystems', color: 'text-purple-500' }
    ],

    // ============================================
    // HIGH-FIDELITY HERO — BOARDROOM-LEVEL NARRATIVE
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'ENGINEERING R&D :: ENTERPRISE GRADE',
        titleLine1: 'Engineering',
        titleHighlight: 'Product Intelligence.',
        titleLine2: 'At Enterprise Scale.',
        description: 'In the age of AI-first engineering, product innovation demands more than code — it demands intelligence systems. UX Analytics captures behavior. MIDAS connects devices. AAPRISE tracks mobile performance. Our Agile Accelerator compresses delivery cycles. WSAPI abstracts web services. DEP scales developer adoption. Six proprietary platforms. One unified R&D architecture.',
        bottleneckLabel: 'The Market Reality',
        bottleneckText: 'Siloed analytics, disconnected device data, slow release pipelines, and fragmented developer ecosystems — limiting product velocity and market share.',
        requirementLabel: 'The Enterprise Requirement',
        requirementText: 'A unified, AI-integrated R&D capability combining real-time product intelligence, connected data fabrics, agile engineering, and open developer ecosystems — governed by measurable KPIs.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Innovation Index',
        statusValue: 'Maximized'
      },
      philosophy: {
        icon: <Cpu className="w-7 h-7 text-brand-blue" />,
        title: 'The Kangqore',
        titleHighlight: 'R&D Framework™.',
        description: 'Our proprietary R&D Framework™ organizes enterprise product engineering into six integrated solution accelerators — each battle-tested, IP-protected, and designed to deliver compounding business value.',
        pills: ['UX Analytics', 'MIDAS', 'AAPRISE', 'Agile Delivery', 'WSAPI', 'DEP']
      },
      matrix: {
        engineId: 'Engine :: KG_R&D_V3',
        title: '6-Platform R&D Architecture',
        subtext: 'Enterprise product challenges deconstructed into six proprietary, governed, and outcome-assured solution accelerators.',
        layers: [
          { title: 'UX Analytics', id: 'KG_UXA', icon: <BarChart3 />, desc: 'Real-time user behavior intelligence — heatmaps, session replay, funnel analysis, and conversion optimization.' },
          { title: 'MIDAS', id: 'KG_MID', icon: <Network />, desc: 'M2M connected data fabric — real-time telemetry, predictive analytics, fleet management, and edge-to-cloud pipelines.' },
          { title: 'AAPRISE', id: 'KG_APR', icon: <MonitorSmartphone />, desc: 'Mobile app intelligence platform — performance tracking, retention analytics, crash diagnostics, and cross-platform metrics.' },
          { title: 'Agile Delivery', id: 'KG_AGI', icon: <Rocket />, desc: 'High-velocity engineering cadences — sprint delivery, CI/CD automation, velocity tracking, and stakeholder feedback loops.' }
        ]
      },
      schematic: {
        titleLine1: 'Deliver',
        titleHighlight: 'Product Intelligence.',
        description: 'Our R&D ecosystem ensures every engineering investment delivers measurable ROI — from user insights and connected data to agile velocity and developer adoption metrics.',
        stats: [
          { label: 'User Insights', val: 'REAL-TIME' },
          { label: 'Time-to-Value', val: 'ACCELERATED' },
          { label: 'Developer Adoption', val: 'MAXIMIZED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform ideas into intelligent, market-defining digital products at enterprise scale.'
  };

  // ============================================
  // CAPABILITIES — 6 PROPRIETARY SOLUTION ACCELERATORS
  // Structured like Accenture/TCS service cards
  // ============================================
  const capabilities = [
    {
      title: 'UX Analytics Solutions',
      description: 'User Behavior Analytics and Refinement services offer actionable insights into user behavior to improve usability and engagement. Powered by real-time session intelligence and AI-driven pattern recognition.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'User behavior tracking & heatmaps',
        'Session replay & funnel analytics',
        'Usability refinement workflows',
        'Real-time engagement scoring',
        'A/B testing & conversion optimization'
      ]
    },
    {
      title: 'MIDAS — Connected Data Fabric',
      description: 'M2M Integrated Data and Analytics Solution (MIDAS) is a platform that delivers secure, connected experiences with real-time data and insights. Enterprise IoT intelligence at scale.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-time M2M data ingestion',
        'Secure connected device management',
        'Predictive analytics & anomaly detection',
        'Fleet & asset telemetry dashboards',
        'Edge-to-cloud integration pipelines'
      ]
    },
    {
      title: 'AAPRISE — App Intelligence',
      description: 'APPRise is our mobile analytics platform that provides an intelligent way to raise your application above the competition by tracking performance, engagement, and user retention.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Mobile app performance tracking',
        'User retention & churn analytics',
        'Crash reporting & diagnostics',
        'In-app behavior intelligence',
        'Cross-platform metric unification'
      ]
    },
    {
      title: 'Agile Delivery Accelerator',
      description: 'Our Agile Delivery Accelerator helps enterprises improve customer experience with faster time to value through iterative delivery. Sprint-based engineering embedded into your product teams.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Sprint-based iterative delivery',
        'Continuous integration & deployment',
        'Cross-functional team enablement',
        'Velocity tracking & burndown analytics',
        'Stakeholder feedback loops'
      ]
    },
    {
      title: 'Web Services API Platform (WSAPI)',
      description: 'Web Services API Platform (WSAPI) enables organizations to extend their existing web-based systems as a well-designed set of services for supporting mobile applications and developers, creating new business channels.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Automated data extraction pipelines',
        'API-first web service abstraction',
        'Mobile backend service enablement',
        'Partner integration gateways',
        'Scalable scraping infrastructure'
      ]
    },
    {
      title: 'Developer Engagement Platform (DEP)',
      description: 'The Developer Engagement Platform enables faster user adoption while fostering collaboration and innovation within the developer community. Enterprise-grade API economy at scale.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'API documentation & sandbox portals',
        'Developer onboarding workflows',
        'Community collaboration tools',
        'SDK & library distribution',
        'Usage analytics & adoption tracking'
      ]
    }
  ];

  // ============================================
  // TECHNOLOGY STACK — MNC-GRADE CATEGORIZATION
  // Inspired by Accenture/TCS/Infosys tech matrices
  // ============================================
  const technologies = [
    { category: 'Analytics & User Intelligence', items: ['Mixpanel', 'Amplitude', 'Hotjar', 'FullStory', 'Google Analytics 4'] },
    { category: 'Connected Data & IoT Platforms', items: ['AWS IoT Core', 'Azure IoT Hub', 'Apache Kafka', 'InfluxDB', 'MQTT / CoAP'] },
    { category: 'Mobile Engineering', items: ['React Native', 'Flutter', 'Swift / SwiftUI', 'Kotlin / Jetpack', 'Firebase'] },
    { category: 'Agile & DevOps Toolchain', items: ['Jira / Confluence', 'Jenkins / GitHub Actions', 'Docker / Kubernetes', 'ArgoCD', 'SonarQube'] },
    { category: 'API Economy & Developer Tools', items: ['Swagger / OpenAPI', 'GraphQL / Apollo', 'Postman / Newman', 'Kong / Apigee', 'ReadMe.io'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Cloudflare Workers'] }
  ];

  // ============================================
  // TRUST PILLARS — STRATEGIC DIFFERENTIATORS
  // Inspired by TCS COIN™, Accenture Digital Thread
  // ============================================
  const trustPillars = [];

  // ============================================
  // SOLUTIONS CAROUSEL — 6 ACCELERATORS ALIGNED
  // ============================================
  const solutions = [
    {
      title: "UX Analytics Solutions",
      description: "Actionable user behavior insights that continuously improve product usability, navigation patterns, and engagement — driving product decisions with real data, not guesswork.",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: "MIDAS — Connected Data Fabric",
      description: "M2M Integrated Data and Analytics delivering secure, connected experiences with real-time telemetry, device management, and predictive intelligence across your entire product fleet.",
      icon: <Network className="w-8 h-8" />
    },
    {
      title: "AAPRISE — App Intelligence",
      description: "Our mobile analytics platform intelligently raises your application above the competition by tracking performance, retention, crash diagnostics, and in-app behavior at scale.",
      icon: <MonitorSmartphone className="w-8 h-8" />
    },
    {
      title: "Agile Delivery Accelerator",
      description: "High-velocity engineering cadences embedded directly into your product teams. Sprint-based delivery with CI/CD, burndown analytics, and stakeholder feedback loops built-in.",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      title: "Web Services API Platform (WSAPI)",
      description: "Extend web-based systems into well-designed service sets supporting mobile applications, partner integrations, and new business channels through automated data extraction.",
      icon: <Globe2 className="w-8 h-8" />
    },
    {
      title: "Developer Engagement Platform (DEP)",
      description: "A centralized platform enabling faster developer adoption through API portals, sandbox environments, SDK distribution, and community collaboration at enterprise scale.",
      icon: <Code2 className="w-8 h-8" />
    }
  ];

  // ============================================
  // R&D CENTER OF EXCELLENCE SECTION
  // Diamond CoE + Key Differentiators
  // ============================================
  const rdCoESection = (
    <section className="py-24 lg:py-32 overflow-hidden relative bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Strategic Intro */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 font-display tracking-tight">
              The R&D Solutions <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Center of Excellence</span>
            </h2>
            <div className="relative pl-6 border-l-[3px] border-brand-blue" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's R&D CoE is built on the <strong className="text-brand-blue">R&D Framework™</strong> — six proprietary solution accelerators forming a unified product intelligence architecture: <strong className="text-brand-blue">UX Analytics</strong>, <strong className="text-brand-blue">MIDAS</strong>, <strong className="text-brand-blue">AAPRISE</strong>, <strong className="text-brand-blue">Agile Delivery</strong>, <strong className="text-brand-blue">WSAPI</strong>, and <strong className="text-brand-blue">DEP</strong>.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                This unified architecture delivers end-to-end product intelligence — from real-time user analytics and connected M2M data fabrics to mobile app intelligence, agile engineering, web service abstraction, and developer community enablement. Enterprise-grade, governed, and outcome-assured.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            {/* Desktop Diamond Layout */}
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

                {/* ===== TRUE 3D DIAMOND ===== */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Left -> UX Analytics */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>UX</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Analytics</span>
                        </div>
                      </div>
                      {/* Top Right -> MIDAS */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>MIDAS</span>
                        </div>
                      </div>
                      {/* Bottom Left -> AAPRISE */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>AAPRISE</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Agile Delivery */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Agile</span>
                          <span className="text-white font-extrabold text-[14px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== BULLET LABELS ===== */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right"><span>User behavior tracking & heatmaps</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>Session replay & funnel analytics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>A/B testing & conversion optimization</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>M2M data ingestion & telemetry</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Predictive analytics & anomaly detection</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Edge-to-cloud integration pipelines</span></li>
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right"><span>Mobile app performance tracking</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>User retention & churn analytics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                    <li className="flex items-center justify-end gap-3 text-right"><span>Crash reporting & diagnostics</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Sprint-based iterative delivery</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>CI/CD pipeline automation</span></li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Velocity tracking & burndown analytics</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Layout */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'UX Analytics', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['User behavior heatmaps', 'Session replay & funnels', 'Conversion optimization'] },
                { title: 'MIDAS', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['M2M data ingestion', 'Predictive analytics', 'Edge-to-cloud pipelines'] },
                { title: 'AAPRISE', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['App performance tracking', 'Retention & churn analytics', 'Crash diagnostics'] },
                { title: 'Agile Delivery', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Sprint-based delivery', 'CI/CD automation', 'Velocity analytics'] }
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

        {/* ==================== KEY DIFFERENTIATORS — MNC-GRADE ==================== */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Proprietary IP — R&D Framework™',
                text: 'Six battle-tested, IP-protected solution accelerators — UX Analytics, MIDAS, AAPRISE, Agile Delivery, WSAPI, and DEP — each reducing deployment time by 40–60% vs. custom-build alternatives.'
              },
              {
                num: 2,
                title: 'AI-First Product Engineering',
                text: 'Every accelerator embeds AI at its core — from predictive anomaly detection in MIDAS and pattern recognition in UX Analytics to intelligent crash triage in AAPRISE. AI-first engineering, not AI-bolted.'
              },
              {
                num: 3,
                title: 'Digital Thread — Unified Data Fabric',
                text: 'MIDAS and WSAPI create a seamless digital thread connecting product telemetry across embedded sensors, mobile apps, cloud dashboards, and partner APIs — one data fabric powering every decision.'
              },
              {
                num: 4,
                title: 'Developer Ecosystem Enablement',
                text: 'DEP and WSAPI power thriving developer ecosystems — API sandboxes, SDK distribution, and partner gateways that organically scale product adoption and create new revenue channels.'
              },
              {
                num: 5,
                title: 'Governed Innovation — CEO-Level Visibility',
                text: 'Every platform is tied to live KPIs, adoption dashboards, compliance checkpoints, and revenue impact metrics. Zero unmonitored R&D investment — full boardroom transparency.'
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
  // WHY KANGQORE — MNC COMPETITIVE POSITIONING
  // ============================================
  const whyKangqoreIntro = `Kangqore's Engineering R&D isn't about building features — it's about building product intelligence. Our R&D Framework™ ensures every investment in engineering delivers measurable, compounding business outcomes — at the standard expected by Fortune 500 enterprises.`;

  const whyKangqore = [
    { 
      title: 'Real-Time Product Intelligence', 
      description: 'UX Analytics and AAPRISE deliver continuous product insights — heatmaps, session replays, mobile crash diagnostics — ensuring every product iteration is data-backed. Typical impact: 25–40% improvement in user engagement metrics.' 
    },
    { 
      title: 'Connected Data Fabric at Scale', 
      description: 'MIDAS provides a secure M2M data fabric with edge-to-cloud pipelines, predictive analytics, and fleet telemetry — powering products that sense, respond, and adapt in real-time across millions of connected endpoints.' 
    },
    { 
      title: 'Agile Velocity — Embedded, Not Bolted', 
      description: 'Our Agile Delivery Accelerator embeds sprint-based engineering, CI/CD automation, and velocity tracking directly into your teams. Typical impact: 40%+ reduction in time-to-value vs. traditional delivery models.' 
    },
    { 
      title: 'API Economy & Developer Ecosystem', 
      description: 'DEP and WSAPI enable enterprises to build thriving developer communities with API sandboxes, SDK distribution, and partner integration gateways — scaling adoption organically and creating new revenue channels.' 
    },
    { 
      title: 'Governed Innovation — Boardroom Transparency', 
      description: 'Every platform — from UX Analytics to MIDAS — is tied to live KPIs, adoption dashboards, and revenue impact metrics. Zero unmonitored R&D investment. Full CEO-level governance and compliance assurance.' 
    }
  ];

  // ============================================
  // INDUSTRIES — MNC VERTICAL COVERAGE
  // ============================================
  const industries = [
    { name: 'SaaS & Product Companies' },
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail, CPG & E-Commerce' },
    { name: 'Manufacturing & Industrial IoT' },
    { name: 'Telecommunications & Media' }
  ];

  // ============================================
  // CUSTOM FAQS — ENTERPRISE-GRADE
  // ============================================
  const customFAQs = [
    {
      question: 'What makes Kangqore\'s Engineering R&D different from competitors like TCS, Infosys, or Accenture?',
      answer: 'Our R&D Framework™ features six proprietary, IP-protected solution accelerators — UX Analytics, MIDAS, AAPRISE, Agile Delivery, WSAPI, and DEP. Unlike generic service delivery, each accelerator is a proven product that reduces deployment time by 40–60% while embedding AI-first intelligence and governed KPI tracking.'
    },
    {
      question: 'How does the MIDAS platform differ from standard IoT solutions?',
      answer: 'MIDAS is a full M2M Connected Data Fabric — not just an IoT gateway. It provides real-time data ingestion, predictive analytics, anomaly detection, fleet telemetry dashboards, and edge-to-cloud integration pipelines in a single governed platform. It creates a digital thread connecting every device endpoint to enterprise decision systems.'
    },
    {
      question: 'Can the Agile Delivery Accelerator integrate with our existing engineering teams?',
      answer: 'Absolutely. The Agile Delivery Accelerator is designed to embed into your existing product teams — not replace them. It provides sprint frameworks, CI/CD automation, velocity tracking, burndown analytics, and stakeholder feedback loops that enhance your team\'s capacity and speed.'
    },
    {
      question: 'What industries do you serve for Engineering R&D?',
      answer: 'We serve enterprises across SaaS, Banking & Financial Services, Healthcare, Retail & E-Commerce, Manufacturing & Industrial IoT, and Telecommunications. Our six solution accelerators are industry-agnostic in design but tailored in deployment.'
    },
    {
      question: 'How do you ensure ROI visibility on R&D investments?',
      answer: 'Every platform in our R&D Framework™ is tied to live KPIs, adoption dashboards, compliance checkpoints, and revenue impact metrics. We provide CEO-level governance with full boardroom transparency — zero unmonitored R&D spend.'
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
              R&D Ecosystem
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Extend your R&D capacity by integrating our solution accelerators with Kangqore's broader AI, data, and cloud portfolio.
            </p>
            <div className="space-y-4">
              {[
                { name: 'AI & Cognitive Computing', link: '/services/data-ai/cognitive-services', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Embed intelligence into every product workflow.' },
                { name: 'Data Engineering', link: '/services/data-ai/data-engineering', icon: <Layers className="w-5 h-5" />, desc: 'Architect the data pipelines powering your analytics.' },
                { name: 'Cloud Engineering', link: '/services/cloud/engineering', icon: <Target className="w-5 h-5" />, desc: 'Build resilient cloud-native product backends.' },
                { name: 'GenAI & Agentic AI', link: '/services/data-ai/generative-ai', icon: <Bot className="w-5 h-5" />, desc: 'Deploy autonomous agents for complex decisioning.' }
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

          {/* Technical Schematic */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_RD_FW</span></div>
                <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ENTERPRISE</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">INNOVATING</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">R&D Framework™</div>
                <div>ACCELERATING_R&D...</div>
                <div>ADOPTION: +92%</div>
              </div>

              {/* Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Cpu className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Network className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <MonitorSmartphone className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">AAPRISE</span>
                </div>
              </div>
              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <Globe2 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">API</div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">WSAPI</span>
                </div>
              </div>
              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative"><Code2 className="w-16 h-16 text-emerald-400" /></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">DEP</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="erd-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#erd-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <g><circle r="4" fill="#2564ea" /><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></g>
                <g><circle r="4" fill="#22d3ee" /><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></g>
                <g><circle r="4" fill="#10b981" /><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // PAGE DATA ASSEMBLY — ENTERPRISE CONFIGURATION
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'R&D Solution Stack',
      technologiesDescription: "The analytics, data, mobile, DevOps, API, and cloud technologies powering our R&D Framework™.",
      capabilities,
      solutions,
      trustPillars,
      preWhyKangqoreSections: rdCoESection,
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industries We Serve',
      industries,
      customFAQs,
      postFAQSections: customSections
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default EngineeringRDServices;
