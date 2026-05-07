import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck, Server, Database, Monitor, Network, Headphones } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const ManagedInfrastructureServices = () => {
  const service = {
    name: 'Managed Infrastructure Services',
    titleLine1: 'Absolute',
    titleHighlight: 'Control.',
    slug: 'managed-infrastructure-services',
    shortDescription: 'Unify Cloud & DC, Workspaces, and Enterprise Networks under one absolute command.',
    videoBackground: '/videos/network-loop.mp4', 
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Kangqore orchestrates your entire hybrid ecosystem from Cloud & DC infrastructure to End-user Workspaces.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          We engineer robust, intelligent managed infrastructure solutions across five core pillars: Cloud & DC, Database Platforms, Digital Workspaces, Enterprise Networks, and Cross-functional NOC/SOC operations. We eradicate friction, radically optimize costs, and enforce absolute security across your global footprint.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    stats: [
      { value: 'Eradicate', label: 'Management Burden', color: 'text-blue-500' },
      { value: 'Optimize', label: 'Infrastructure Costs', color: 'text-brand-blue' },
      { value: 'Enhance', label: 'Security Posture', color: 'text-indigo-500' },
      { value: 'Gain', label: 'Real-Time Visibility', color: 'text-purple-500' }
    ],
    highFidelity: {
      narrative: {
        badge: 'Enterprise Excellence :: 2026',
        titleLine1: 'Omni-Functional',
        titleHighlight: 'Managed Infrastructure.',
        titleLine2: 'At Scale.',
        description: 'We deliver comprehensive Managed Infrastructure solutions encompassing critical database administration, next-gen enterprise networking, and 24/7 cross-functional service desk operations. Kangqore transcends basic support by embedding cognitive automation across your entire IT stack.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Disjointed management across Cloud Ops, legacy networks, and disparate digital workspaces paralyzing your enterprise velocity.',
        requirementLabel: 'The Requirement',
        requirementText: 'A unified, governed managed services capability providing absolute operational transparency across all infrastructure pillars.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Infrastructure Operations',
        statusValue: 'Autonomous'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'Infrastructure',
        titleHighlight: 'Outcome-First Design.',
        description: 'Our philosophy dictates that every domain—whether it is securing enterprise networks, managing VDI workspaces, or tuning high-availability databases—must deliver compounding enterprise value driven by rigorous ITSM processes.',
        pills: ['Cross-functional NOC', 'ITIL Governed', 'Cloud & DC Optimized', 'Workspace SecOps']
      },
      matrix: {
        engineId: 'Engine :: MIS_ORCHECTRATOR_V3',
        title: 'Enablement Matrix',
        subtext: 'The definitive managed infrastructure lifecycle spanning Cloud, Databases, Workspaces, and Networks.',
        layers: [
          { title: 'Assess', id: 'MANA_ASSESS', icon: <Search />, desc: 'Deep infrastructure discovery spanning cloud, DC, and enterprise networks.' },
          { title: 'Design', id: 'MANA_DESIGN', icon: <Layers />, desc: 'Seamless transition design for complex VDI workspaces and database platforms.' },
          { title: 'Govern', id: 'MANA_GOV', icon: <ShieldCheck />, desc: 'Strict ITIL process governance, vendor management, and IP address control.' },
          { title: 'Optimize', id: 'MANA_OPT', icon: <Activity />, desc: 'Continuous performance tuning across cross-functional service desk operations.' }
        ]
      },
      schematic: {
        titleLine1: 'Guarantee',
        titleHighlight: 'Resilience.',
        description: 'Your IT infrastructure investment must drive market advantage. We implement cognitive management frameworks that transform volatile operational metrics into guaranteed, optimized outcomes.',
        stats: [
          { label: 'Uptime', val: 'UNCOMPROMISING' },
          { label: 'Efficiency', val: 'MAXIMIZED' },
          { label: 'Compliance', val: 'ABSOLUTE' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    description: 'Transform your business with cutting-edge infrastructure, networks & operations solutions.'
  };

  const capabilities = [
    {
      title: 'Cloud & DC Infrastructure',
      description: 'Commanding hybrid cloud and physical deployments. Kangqore ensures your servers, storage, and distributed virtual networks execute with absolute precision and maximum efficiency.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Cloud Managed Services (CloudOps, DevOps & FinOps)',
        'Data Center Management (Physical, Virtual, Storage & Backup)',
        'DC & Cloud Networking Support'
      ]
    },
    {
      title: 'Databases & Application Platforms',
      description: 'Guaranteeing data superiority. We provide uncompromising administration and engineering services for elite database architectures and complex middleware to secure unbreakable application platforms.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Database & Middleware Administration',
        'Database Engineering Services',
        'Application Platform Maintenance and Support'
      ]
    },
    {
      title: 'Digital Workspaces',
      description: 'Frictionless enterprise productivity. Kangqore engineers and manages secure end-user environments, seamless directory services, and advanced implementations to enable absolute workforce mobility.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'End-User Device Management',
        'Enterprise Directory Services',
        'Messaging and Collaboration',
        'Enterprise Mobility Management',
        'Virtual Desktop Infrastructure (VDI) and DaaS'
      ]
    },
    {
      title: 'Enterprise Networks',
      description: 'Architecting unyielding perimeters. We provide granular management of your LAN, WAN, and Wireless ecosystems alongside sophisticated zero-trust network security devices and IP address management.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'LAN, WAN & Wireless Network Management',
        'Network Security Device Management',
        'DNS, DHCP, IP Address Management',
        'IP Telephony, Audio and Video System Support'
      ]
    },
    {
      title: 'Cross-functional Services',
      description: 'Total operational omniscience. Benefit from our 24/7 Enterprise NOC, intelligent global service desk, and rigorous ITSM process management driven by powerful reporting and predictive analytics.',
      image: 'https://images.unsplash.com/photo-1543286386-713bdd548b11?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'Global Service Desk Operations',
        'Enterprise Monitoring & NOC Services',
        'IT Asset Management',
        'Strategic Vendor Management',
        'Rigorous ITSM Process Management',
        'Operational Reporting and Analytics'
      ]
    }
  ];

  const technologies = [
    { category: 'Cloud Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud Platform (GCP)'] },
    { category: 'Infrastructure Management', items: ['VMware vSphere', 'Nutanix', 'Cisco Intersight', 'Ansible'] },
    { category: 'Networking & Security', items: ['Cisco Meraki', 'Palo Alto Networks', 'Fortinet', 'F5 Networks'] },
    { category: 'ITSM & Monitoring', items: ['ServiceNow', 'Datadog', 'Splunk', 'SolarWinds'] },
    { category: 'Digital Workspace', items: ['Microsoft 365', 'Citrix Workspace', 'VMware Horizon', 'Microsoft Intune'] }
  ];

  const trustPillars = [
    {
      title: 'Kangqore Cognitive Platform',
      tag: 'AI-First',
      description: 'Our intelligent platform utilizes machine learning for real-time insights and automation, enabling a radically proactive approach to IT infrastructure management. Predict failures before they occur.'
    },
    {
      title: 'Zero-Drift IT Governance',
      tag: 'Methodology',
      description: 'We orchestrate unyielding adherence to established ITIL best practices to guarantee consistent, high-quality service delivery across incident, problem, change, and configuration management.'
    },
    {
      title: 'Kangqore Omni-Sight Telemetry',
      tag: 'Observability',
      description: 'Benefit from Kangqore\'s proprietary one-stop solution for simplified, predictive IT operations across highly complex multi-cloud and hybrid environments.'
    },
    {
      title: 'Hyper-Scale Execution Tiers',
      tag: 'Scalability',
      description: 'From Standard 24/7 support to Advanced bespoke SLA plans, we architect highly flexible, rigorous service tiers tailored to dominate specific operational and market demands.'
    }
  ];

  const whyKangqoreIntro = `Kangqore Technologies Limited is an AI-led, customer-first digital engineering and Mindful IT fortress. Guided by two core philosophies, high-impact solutions for customers and uncompromising resilience, Kangqore combines a verticalized approach from chip to cloud with expertise in AI, automation, and disruptive technologies to build secure, scalable, and enterprise-ready infrastructures.`;

  const whyKangqore = [
    { 
      title: 'Absolute Enterprise Scale', 
      description: 'Managing operations for billion-dollar corporations worldwide with unyielding precision and massive Annualized Revenues backing our stability.' 
    },
    { 
      title: 'Global SOC/NOC Footprint', 
      description: 'Continuous 24/7/365 surveillance, predictive operations, and rapid incident resolution across our elite global delivery centers.' 
    },
    { 
      title: 'Elite Strategic Partnerships', 
      description: 'Deep, certified integrations with Microsoft, AWS, Google Cloud, and defining technology leaders to ensure unparalleled infrastructure access.' 
    },
    { 
      title: 'Cognitive IT Optimization', 
      description: 'Leveraging AI-first predictive monitoring to automatically identify cost anomalies, security vulnerabilities, and deployment redundancies.' 
    },
    { 
      title: 'Industry-Focused Solutions', 
      description: 'Proprietary platforms deployed across specialized verticals ensuring your infrastructure complies with the strict architectural demands of your market.' 
    }
  ];

  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology, Media & Telecom' },
    { name: 'Manufacturing & Industry 4.0' }
  ];

  const customFAQs = [
    {
      question: `How does Kangqore optimize infrastructure management over maintaining an internal team?`,
      answer: `Kangqore eradicates the limitations of internal teams by providing 24/7/365 access to elite, certified engineers backed by our cognitive ELLIPSE platform and WATCH360 monitoring. We assume full accountability for uptime, patching, and incident resolution—allowing your internal talent to focus entirely on specialized, revenue-generating initiatives rather than reactive firefighting.`
    },
    {
      question: `How smooth is the transition to Kangqore's Managed Infrastructure Services?`,
      answer: `Flawless. Whether deploying a new greenfield environment or taking over a well-established legacy system, our proven Enterprise Service Transition methodology ensures a seamless handover. We execute rigorous knowledge transfers, architecture documentation, and parallel testing to guarantee absolute zero disruption to your active enterprise operations.`
    },
    {
      question: `Can Kangqore handle massive, multi-regional hybrid cloud architectures?`,
      answer: `Absolutely. We architect and govern some of the most complex hybrid and multi-cloud environments globally. Our deep strategic partnerships with AWS, Azure, and Google Cloud, combined with advanced CloudOps and FinOps practices, mean we excel at ensuring consistency, security, and cost-efficiency across highly dispersed geographic nodes.`
    }
  ];

  const customSections = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Operations Ecosystem
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Infrastructure <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Take a holistic approach to your operations. Speed up digital transformation across a variety of journeys by exploring our integrated enterprise capabilities.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Managed Security Services', 
                  link: '/services/cybersecurity/managed-security-services',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  desc: 'Deploy absolute cyber resilience alongside your managed infrastructure.'
                },
                { 
                  name: 'Software Defined Infrastructure', 
                  link: '#', // Add route when available
                  icon: <Server className="w-5 h-5" />,
                  desc: 'Modernize environments with infrastructure driven strictly by code.'
                },
                { 
                  name: 'Cloud & Data Center Advisory', 
                  link: '/services/infrastructure-networks-operations/cloud-data-center-advisory-transformation',
                  icon: <Database className="w-5 h-5" />,
                  desc: 'Expert strategic consulting to modernize and migrate your core assets.'
                },
                { 
                  name: 'Workspace Transformation', 
                  link: '/services/infrastructure-networks-operations/digital-workspace',
                  icon: <Monitor className="w-5 h-5" />,
                  desc: 'Re-engineer productivity with secure, agile digital environments.'
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
            <div className="mt-12 flex items-center gap-6">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
              >
                Explore Services 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // ARCHITECTING_RESILIENCE...
              </div>
            </div>
          </div>

          <div className="lg:w-5/12 relative flex justify-center items-center">
            <div className="relative aspect-square w-full max-w-[450px] mx-auto flex justify-center items-center">
              
              {/* Outer diagonal dashed lines (The X behind the card) */}
              <div className="absolute w-[350px] h-[350px] flex items-center justify-center z-0">
                  <div className="absolute w-full h-[2px] border-t-2 border-dashed border-blue-200/50 rotate-45"></div>
                  <div className="absolute w-[2px] h-full border-l-2 border-dashed border-blue-200/50 rotate-45"></div>
                  
                  {/* Dots placed exactly at the ends of the rotated lines */}
                  <div className="absolute inset-0 rotate-45 pointer-events-none">
                     <div className="absolute top-[0] left-1/2 -translate-x-1/2 -translate-y-[3px] w-1.5 h-1.5 rounded-full bg-blue-400"></div> {/* Top-Right */}
                     <div className="absolute bottom-[0] left-1/2 -translate-x-1/2 translate-y-[3px] w-1.5 h-1.5 rounded-full bg-blue-400"></div> {/* Bottom-Left */}
                     <div className="absolute left-[0] top-1/2 -translate-x-[3px] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400"></div> {/* Top-Left */}
                     <div className="absolute right-[0] top-1/2 translate-x-[3px] -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div> {/* Bottom-Right */}
                  </div>
              </div>

              {/* Main White Card (Rounded Squircle) */}
              <div className="relative w-[280px] h-[280px] bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[48px] shadow-[0_20px_80px_rgba(37,100,234,0.07)] border border-gray-100 flex items-center justify-center z-20 overflow-hidden group hover:shadow-[0_20px_80px_rgba(37,100,234,0.12)] transition-all duration-500">
                
                {/* Inner dashed ring */}
                <div className="absolute inset-5 border border-blue-200/50 rounded-[36px] border-dashed z-10 pointer-events-none group-hover:border-brand-blue/30 transition-colors duration-500"></div>

                {/* Light Blue Diamond with Grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-gradient-to-br from-blue-50/80 to-blue-100/10 rotate-45 rounded-[40px] overflow-hidden z-0">
                  <div className="absolute inset-0 opacity-40 mix-blend-multiply"
                       style={{
                         backgroundImage: 'linear-gradient(rgba(37,100,234,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(37,100,234,0.15) 1px, transparent 1px)',
                         backgroundSize: '16px 16px'
                       }}
                  ></div>
                </div>

                {/* Hierarchical Network Icon */}
                <div className="relative z-30 transform group-hover:scale-105 transition-transform duration-500">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue drop-shadow-sm">
                    <rect x="9.5" y="4" width="5" height="5" rx="1" fill="white" />
                    <rect x="3.5" y="15" width="5" height="5" rx="1" fill="white" />
                    <rect x="15.5" y="15" width="5" height="5" rx="1" fill="white" />
                    <path d="M12 9v4" />
                    <path d="M6 15v-1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                  </svg>
                </div>
              </div>
              
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
      technologiesTitle: 'Core Infrastructure Management Architectures',
      technologiesDescription: "A platform-agnostic automation and orchestration stack integrating the world's leading deployment and observational frameworks.",
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Immutable Enterprise Optimization',
      trustPillarsRightDescription: 'Kangqore provides end-to-end IT infrastructure management that helps organizations eradicate friction, eliminate manual bottlenecks, and operate at unprecedented scale. By combining cognitive platforms with deep engineering expertise, we assure ecosystems that are resilient, scalable, and secure.',
      trustPillarsRightButton: 'Request IT Landscape Analysis',
      trustPillarsVideo: '/videos/network-loop.mp4',
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industry-Specific Infrastructure Operations',
      industries,
      customFAQs,
      postFAQSections: customSections
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ManagedInfrastructureServices;
