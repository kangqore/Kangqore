import React, { useState } from 'react';
import { 
  Server, Cloud, Layers, Zap, Search, Activity, ShieldCheck, 
  Database, Network, Settings, ServerCrash, LayoutDashboard, ArrowRight,
  BrainCircuit, Bot, Target, Workflow, CheckCircle2, Award, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const ModernizationInfrastructure = () => {
  // ============================================
  // HERO & METADATA
  // ============================================
  const service = {
    name: 'Modernization Infrastructure',
    titleLine1: 'Modernization',
    titleHighlight: 'Infrastructure.',
    slug: 'modernization-infrastructure',
    shortDescription: 'Modernize your infrastructure into a secure, scalable foundation for growth.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">When infrastructure can’t keep up, growth becomes expensive.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Legacy infrastructure slows innovation, increases operational risk, and raises ownership cost. Kangqore modernizes infrastructure, platforms, and operating models—so you can scale performance, strengthen security, and move faster with confidence.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    videoBackground: '/videos/working-machine-4751312.mp4',
    stats: [
      { value: '99.99%', label: 'Infrastructure availability SLA', color: 'text-blue-500' },
      { value: '35%+', label: 'Avg. TCO reduction in 120 days', color: 'text-brand-blue' },
      { value: 'Zero', label: 'Downtime production cutovers', color: 'text-indigo-500' },
      { value: '10x', label: 'Faster provisioning & scaling', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Schedule an Infrastructure Assessment", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    ctaTitle: 'Ready to modernize infrastructure with speed and control?',
    ctaDescription: 'Schedule an assessment to identify modernization priorities, cost-saving opportunities, risks, and a secure execution roadmap.',

    
    // Premium DPA Layout: Dark mode High-Fidelity section mapping the Delivery Model & Why Modernization
    highFidelity: {
      narrative: {
        badge: 'INFRASTRUCTURE STRATEGY :: 2026',
        titleLine1: 'Modernize',
        titleHighlight: 'Architecture.',
        titleLine2: 'At Scale.',
        description: 'Modernization isn’t just "moving to cloud." It’s upgrading architecture, automation, controls, and operations so your infrastructure becomes a competitive advantage—not a bottleneck.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Legacy infrastructure slows innovation, increases operational risk, and raises ownership cost.',
        requirementLabel: 'The Requirement',
        requirementText: 'Upgraded infrastructure, automated operations, and zero-trust controls for compounding scaling.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        statusLabel: 'Time to Value',
        statusValue: '3x Faster'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'Our',
        titleHighlight: 'Modernization Framework.',
        description: 'At Kangqore, Infrastructure Modernization is structured across four rigorous execution phases to ensure zero disruption and massive enterprise scaling.',
        pills: ['Assess', 'Architect', 'Modernize', 'Operate & Optimize']
      },
      matrix: {
        engineId: 'Engine :: INFRA_MOD_V1',
        title: '4-Phase Delivery Model',
        subtext: 'We deconstruct the complexity of enterprise legacy migration into measurable, risk-averse execution layers.',
        layers: [
          { title: 'Assess', id: 'INF_ASSESS', icon: <Search />, desc: 'Discovery, maturity scoring, dependency mapping, TCO baseline, risk register.' },
          { title: 'Architect', id: 'INF_ARCHI', icon: <Layers />, desc: 'Target-state blueprint, security controls, migration waves, DR plan.' },
          { title: 'Modernize', id: 'INF_MOD', icon: <Zap />, desc: 'Cloud modernization, automation, platform uplift, safe rollout, validation.' },
          { title: 'Operate', id: 'INF_OPS', icon: <ShieldCheck />, desc: 'Monitoring, incident readiness, continuous cost optimization, governance.' }
        ]
      },
      schematic: {
        titleLine1: 'Scale',
        titleHighlight: 'Performance.',
        description: 'Design ecosystems where platforms and operational teams collaborate seamlessly, tied to KPIs, ROI, and absolute reliability.',
        stats: [
          { label: 'Threat Surface', val: '-85% REDUCED' },
          { label: 'Release Velocity', val: '10x FASTER' },
          { label: 'Infrastructure TCO', val: '-35% LOWER' }
        ]
      }
    },
    
    // Custom "Why Kangqore" overriding the template defaults requested in the image
    whyKangqore: [
      { 
        icon: Award, 
        title: 'Elite Engineering Pedigree', 
        description: 'Decades of combined experience architecting hyperscale, zero-downtime infrastructure transformations for Fortune 500 enterprises.' 
      },
      { 
        icon: Target, 
        title: 'Bespoke Architectural Blueprints', 
        description: 'We reject one-size-fits-all commoditization. Every infrastructure modernization roadmap is engineered specifically for your unique risk profile and scaling demands.' 
      },
      { 
        icon: Users, 
        title: 'Dedicated SRE & Cloud Architects', 
        description: 'Direct, unfiltered access to elite, certified systems architects and Site Reliability Engineers—not junior generalists.' 
      }
    ]
  };

  const department = {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    description: 'Transform your business with cutting-edge infrastructure, networks & operations solutions.'
  };

  // ============================================
  // CORE CAPABILITIES CAROUSEL
  // ============================================
  const capabilities = [
    {
      title: 'Enterprise Application Modernization',
      description: 'Rearchitect legacy monoliths into agile, high-performance microservices to eliminate technical debt and accelerate enterprise agility.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Strategic IT/Business alignment',
        'Application portfolio rationalization',
        'Accelerated market expansion',
        'Continuous cost optimization'
      ]
    },
    {
      title: 'Cloud Architecture & Engineering',
      description: 'Engineer highly-resilient distributed cloud environments for absolute control, hyperscale performance, and uncompromising security.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'High-availability distributed architecture',
        'Hyperscale performance engineering',
        'Zero-trust cloud security governance',
        'FinOps-driven cost optimization'
      ]
    },
    {
      title: 'Digital Mobility Ecosystems',
      description: 'Orchestrate frictionless mobile ecosystems that process real-time intelligence and accelerate digital execution across all touchpoints.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Frictionless customer engagement',
        'Real-time mobile intelligence',
        'Advanced workplace productivity',
        'Edge-driven digital expansion'
      ]
    },
    {
      title: 'Continuous DevSecOps & Automation',
      description: 'Accelerate delivery pipelines and infrastructure consistency with rigorous security, automated workflows, and immutable environments.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Infrastructure-as-Code (IaC) pipelines',
        'Automated CI/CD orchestration',
        'Policy-as-code & integrated security',
        'Immutable state management'
      ]
    }
  ];

  // ============================================
  // TOOLS & TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'Cloud Platforms', items: ['AWS', 'Azure', 'GCP'] },
    { category: 'IaC / GitOps', items: ['Terraform', 'Ansible', 'Argo CD', 'Flux'] },
    { category: 'Containers', items: ['Docker', 'Kubernetes', 'Helm'] },
    { category: 'Observability', items: ['Prometheus', 'Grafana', 'ELK', 'OpenTelemetry'] },
    { category: 'ITSM/ITOM', items: ['ServiceNow', 'ManageEngine'] },
    { category: 'Security', items: ['IAM', 'PAM', 'Vaults', 'Policy-as-code'] }
  ];

  // ============================================
  // SOLUTIONS CAROUSEL (Mismatched engine replaced)
  // ============================================
  const solutions = [
    {
      title: 'Enterprise Platform Engineering',
      description: 'Our proprietary platform engineering capabilities empower enterprises to drive massive innovation and accelerate growth in today’s dynamic digital landscape by eliminating platform siloes.',
      link: '/services/consulting'
    },
    {
      title: 'Hyperscale Cloud Architecture',
      description: 'We execute global cloud transformations, reinventing the entire experience of information access, application design, and infrastructure management to drastically reduce operational costs.',
      link: '/services/cloud'
    },
    {
      title: 'Kangqore Intelligent Query (KIQ™)',
      description: 'With increasing interaction channels, legacy engagement paths fail modern expectations. KIQ leverages advanced AI to instantly resolve customer inquiries, preventing trust deficits and protecting brand reputation.',
      link: '/services/automation/digital-process-automation'
    },
    {
      title: 'Kangqore Seamless Onboarding (KSO™)',
      description: 'Despite data security concerns, digital native customers demand flexible, omni-channel, and hassle-free onboarding. KSO uses intelligent automation to replace manual, paper-intensive workflows with a secure, standardized digital acquisition engine.',
      link: '/services/automation/digital-process-automation'
    }
  ];

  // ============================================
  // FAQS
  // ============================================
  const customFAQs = [
    {
      question: 'What does “infrastructure modernization” include beyond cloud migration?',
      answer: `Modernization goes far beyond simply hosting VMs in the cloud. It involves refactoring architectures for cloud-native services (like Kubernetes or serverless), establishing Infrastructure-as-Code (IaC) pipelines, implementing zero-trust security controls, and upgrading your operational model to be highly automated and observable.`
    },
    {
      question: 'How do you minimize downtime and business disruption?',
      answer: `We rely on a risk-first approach. Every modernization roadmap includes detailed dependency mapping, rigorous testing of target-state environments, and phased cutovers. We architect for high availability and use parallel deployments to ensure safe, rollback-ready migrations with zero unplanned downtime.`
    },
    {
      question: 'How do you handle security, compliance, and audit requirements?',
      answer: `Security is embedded into the modernization process, not bolted on. We implement policy-as-code, automated governance checkpoints, and identity-first Zero Trust principles. Whether you need SOC2, ISO, HIPAA, or PCI compliance, the target architecture is designed to be audit-ready by default.`
    },
    {
      question: 'Can you modernize legacy + hybrid environments (not cloud-only)?',
      answer: `Absolutely. Many enterprises operate complex, hybrid ecosystems where mainframe or legacy on-prem workloads must securely communicate with modern cloud services. We modernize distributed networking, edge environments, and virtualized data centers specifically for these hybrid edge-cases.`
    },
    {
      question: 'Do you provide managed operations and SLAs after modernization?',
      answer: `Yes. Beyond implementation, we offer full lifecycle management. Our NOC/SOC and managed operations teams provide proactive 24/7 monitoring, cost optimization, incident resolution, and continuous architectural improvements governed by strict performance SLAs.`
    },
    {
      question: 'What does an assessment deliver, and how quickly?',
      answer: `Our Infrastructure Assessment typically takes 2-4 weeks. It yields a clear maturity score, a comprehensive dependency map, a Total Cost of Ownership (TCO) baseline, a risk register, and a prioritized, phased roadmap detailing exactly what to modernize first for maximum ROI.`
    }
  ];

  // ============================================
  // CUSTOM UI SECTIONS
  // ============================================

  // Accordion Component for Values
  const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-blue-100 transition-colors mb-4 shadow-sm group">
        <button 
          className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
          onClick={onClick}
        >
          <span className={`font-bold text-lg ${isOpen ? 'text-brand-blue' : 'text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors'}`}>{title}</span>
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-brand-blue border-brand-blue text-white rotate-180' : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-200 text-gray-500 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-brand-blue'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 mt-2">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const [openAccordion, setOpenAccordion] = useState(0);

  // PRE-WHY SECTIONS (DPA 3D Diamond & Key Diffs, adapted for Infrastructure)
  const infrastructureCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TWO-COLUMN LAYOUT: INTRO + DIAGRAM */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Our Infrastructure Modernization Framework is built on four interconnected layers — <strong className="text-brand-blue">Application Modernization</strong>, <strong className="text-brand-blue">Cloud Architecture</strong>, <strong className="text-brand-blue">Mobility</strong>, and <strong className="text-brand-blue">DevSecOps</strong> — forming a unified enterprise backbone.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                From structured cloud assessments to zero-trust networks and IaC deployments, we architect operations that become a competitive advantage, ending legacy friction permanently.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
            <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG connectors */}
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

                {/* 3D Container */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Left -> Enterprise Application Modernization */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Enterprise</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Applications</span>
                        </div>
                      </div>
                      {/* Top Right -> Cloud Architecture & Engineering */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Cloud</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Engineering</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Digital Mobility */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Digital</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Mobility</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Continuous DevSecOps */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">Continuous</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight shadow-sm">DevSecOps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BULLETS */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {['Strategic IT/Business alignment', 'Application portfolio rationalization', 'Accelerated market expansion', 'Continuous cost optimization'].map((item, i) => (
                      <li key={i} className="flex items-center justify-end gap-3 text-right"><span>{item}</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div></li>
                    ))}
                  </ul>
                </div>
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {['High-availability architecture', 'Hyperscale payload engineering', 'Zero-trust governance', 'FinOps ROI maximization'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {['Frictionless customer engagement', 'Real-time mobile intelligence', 'Advanced workplace productivity', 'Edge-driven digital expansion'].map((item, i) => (
                      <li key={i} className="flex items-center justify-end gap-3 text-right"><span>{item}</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div></li>
                    ))}
                  </ul>
                </div>
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {['Infrastructure-as-Code (IaC)', 'Automated CI/CD orchestration', 'Policy-as-code & security', 'Immutable state deployments'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Mobile / Tablet Layout */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {[
                { title: 'App Modernization', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: capabilities[0].items },
                { title: 'Cloud Engineering', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: capabilities[1].items },
                { title: 'Digital Mobility', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: capabilities[2].items },
                { title: 'DevSecOps', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: capabilities[3].items }
              ].map((quadrant, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md p-5 border-t-4" style={{borderTopColor: quadrant.dotColor.replace('bg-', '')}}>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">{quadrant.title}</h4>
                  <ul className="space-y-2">
                    {quadrant.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const customSections = (
    <section className="py-24 bg-white dark:bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              The Kangqore Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
              Value We Deliver with <br/><span className="text-transparent bg-clip-text bg-brand-gradient italic">Infrastructure Modernization.</span>
            </h2>
            <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Modernization isn't just "moving to cloud." It's upgrading architecture, automation, controls, and operations so your infrastructure becomes a competitive advantage—not a bottleneck.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-3xl -z-10 border border-gray-100 hidden lg:block"></div>
            <AccordionItem title="Zero-downtime massive migrations" isOpen={openAccordion === 0} onClick={() => setOpenAccordion(openAccordion === 0 ? -1 : 0)}>Modernize with minimal disruption using structured risk assessments, parallel environments, and rollback-ready cutover frameworks.</AccordionItem>
            <AccordionItem title="35%+ Lower TCO through automation" isOpen={openAccordion === 1} onClick={() => setOpenAccordion(openAccordion === 1 ? -1 : 1)}>Consolidate legacy sprawl, mandate GitOps orchestration, and deploy FinOps to aggressively reduce enterprise run-rates.</AccordionItem>
            <AccordionItem title="99.99% Guaranteed uptime engineering" isOpen={openAccordion === 2} onClick={() => setOpenAccordion(openAccordion === 2 ? -1 : 2)}>Eradicate single points of failure with multi-region redundancies, automated failovers, and elite SRE observability practices.</AccordionItem>
            <AccordionItem title="Compliance-ready target architectures" isOpen={openAccordion === 3} onClick={() => setOpenAccordion(openAccordion === 3 ? -1 : 3)}>Embed identity-first access controls, continuous policy enforcement, and audit-ready governance into every layer of code.</AccordionItem>
            <AccordionItem title="Future-proof platform scalability" isOpen={openAccordion === 4} onClick={() => setOpenAccordion(openAccordion === 4 ? -1 : 4)}>Transition from reactive hardware scaling to immutable, elastic, horizontally-scaled cloud primitives built for hyperscale.</AccordionItem>
          </div>
        </div>
      </div>
    </section>
  );

  const postCapabilitiesSections = (
    <>
      {/* Target Stage Execution Ecosystem / Radar Schematic replacing DPA's Execution Hub */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* Radar Schematic Visual */}
            <div className="lg:w-5/12 relative order-2 lg:order-1">
              <div className="relative aspect-square w-full max-w-[550px] mx-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
  
                <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                  <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_INFRA_EXEC</span></div>
                  <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ENTERPRISE</span></div>
                  <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">OPTIMIZED</span></div>
                </div>
  
                <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
                  <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Kubernetes Core</div>
                  <div>PROVISIONING_NODES...</div>
                  <div>SECURITY: +99.9%</div>
                </div>
  
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                  <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                  <div className="relative">
                     <Cloud className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                </div>
  
                {/* Satellite Clusters */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                      <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                      <Server className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Compute</span>
                  </div>
                </div>
  
                <div className="absolute bottom-20 left-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                      <Network className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">ZTA</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Network</span>
                  </div>
                </div>
  
                <div className="absolute bottom-20 right-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className="relative">
                        <Activity className="w-16 h-16 text-emerald-400" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Observability</span>
                  </div>
                </div>
  
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <defs>
                    <linearGradient id="infra-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path d="M250,250 L250,140" stroke="url(#infra-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <path d="M250,250 L140,380" stroke="url(#infra-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <path d="M250,250 L360,380" stroke="url(#infra-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <g><circle r="4" fill="#2564ea" /><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></g>
                  <g><circle r="4" fill="#22d3ee" /><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></g>
                  <g><circle r="4" fill="#10b981" /><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></g>
                </svg>
              </div>
            </div>

            {/* UPGRADED SCOPE GRID: Replaced thin bullets with heavy premium technical UI cards */}
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
                Infrastructure Scope
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
                Modernization Coverage <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic">Across Your Stack.</span>
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Serverless & Microservices', icon: <Layers /> },
                  { title: 'Cloud-Native Architecture', icon: <Cloud /> },
                  { title: 'Data Center Consolidation', icon: <Server /> },
                  { title: 'Kubernetes Orchestration', icon: <Activity /> },
                  { title: 'Zero-Trust Networks', icon: <ShieldCheck /> },
                  { title: 'Edge Computing Solutions', icon: <Network /> },
                  { title: 'Enterprise IaC Pipelines', icon: <Workflow /> },
                  { title: 'Mobile Ecosystem APIs', icon: <Bot /> },
                  { title: 'Disaster Recovery (BCP)', icon: <ServerCrash /> }
                ].map((scope, idx) => (
                  <div key={idx} className="group flex items-center gap-3 p-4 bg-gray-50/50 hover:bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100/50 hover:border-brand-blue/30 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 flex items-center justify-center text-brand-blue group-hover:scale-110 group-hover:bg-blue-50 transition-transform">
                      {React.cloneElement(scope.icon, { className: 'w-5 h-5' })}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-50 text-sm leading-tight group-hover:text-brand-blue transition-colors">{scope.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const pageData = {
    service: {
      ...service,
      capabilities,
      technologies,
      solutions,
      customFAQs,
      customSections,
      preWhyKangqoreSections: infrastructureCoESection,
      postCapabilitiesSections,
      technologiesTitle: 'Tools & Technologies We Implement',
      technologiesDescription: "A platform-agnostic automation stack integrating the world's leading infrastructure, orchestration, and continuous observability engines."
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ModernizationInfrastructure;
