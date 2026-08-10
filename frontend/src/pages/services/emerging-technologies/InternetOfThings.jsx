import React from 'react';
import { Wifi, Search, Layers, Activity, ShieldCheck, Radio, Signal, Cpu, MonitorSmartphone, BarChart3, Settings, Server, Cloud, Cog, Factory, Heart, Building2, Binary } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import {
  IoTPhilosophyBackground,
  IoTWhySection,
  IoTValueDeliver,
  IoTDiamondCoESection,
  IoTDeliveryModel,
  IoTExecutionEcosystem,
  IoTFutureReadySection
} from '../../../components/services/foundry/IoTCustomSections';

const InternetOfThings = () => {
  // ============================================
  // SERVICE — Core Data (matches Blockchain pattern exactly)
  // ============================================
  const service = {
    name: 'Internet Of Things (IoT)',
    titleLine1: 'Internet Of Things',
    titleHighlight: '(IoT)',
    slug: 'internet-of-things',
    shortDescription: 'Build connected systems that sense, respond, and scale with intelligence.',
    fullDescription: 'Kangqore helps enterprises design, engineer, integrate, and operationalize IoT ecosystems that turn connected assets, devices, and environments into measurable business outcomes.',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
    videoBackground: '/videos/engineering-rd-bg.mp4',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Schedule An IoT Strategy Review', link: '/contact?type=iot-strategy' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Emerging Technologies', link: '/department/emerging-technologies' },
      { label: 'Internet of Things' }
    ],
    stats: [
      { value: 'Connect', label: 'Assets, devices, and services intelligently', color: 'text-cyan-400' },
      { value: 'Analyze', label: 'Turn live telemetry into business insight', color: 'text-blue-400' },
      { value: 'Transform', label: 'Improve workflows through connected operations', color: 'text-brand-blue' },
      { value: 'Scale', label: 'Move from pilot to enterprise-grade execution', color: 'text-purple-400' }
    ],

    // High-Fidelity narrative block
    highFidelity: {
      narrative: {
        badge: 'STRATEGY & ARCHITECTURE',
        titleLine1: 'Beyond',
        titleHighlight: 'Connectivity.',
        titleLine2: '',
        description: 'While others stop at getting devices to talk, we focus on what they say. Our IoT engineering unifies protocol rigor with business logic to transform raw sensor telemetry into high-integrity operational intelligence.',
        bottleneckLabel: 'The Data Trap',
        bottleneckText: 'Fragmented IoT pilots that collect data without a defined path to business action or enterprise-scale governance.',
        requirementLabel: 'The Kangqore Way',
        requirementText: 'A unified engineering discipline that connects device-side firmware, platform logic, and enterprise applications into one cohesive ecosystem.',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
        statusLabel: 'System Integrity',
        statusValue: '100% OPERATIONAL'
      },
      philosophy: {
        icon: <Wifi className="w-7 h-7 text-brand-blue" />,
        title: 'IoT Engineering.',
        titleHighlight: 'Intelligence at the Edge.',
        description: 'Total IoT success demands more than just a cloud connection. We engineer intelligence directly into the edge, ensuring your connected ecosystem is resilient, low-latency, and autonomous.',
        pills: ['Edge-First', 'Governed', 'Scalable', 'Action-Oriented'],
        CustomBackground: IoTPhilosophyBackground
      },
      matrix: {
        engineId: 'Engine :: IOT_V3',
        title: 'Enablement Matrix',
        subtext: 'Our IoT lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
        layers: [
          { title: 'Assess', id: 'IOT_ASSESS', icon: <Search />, desc: 'Discovery, opportunity analysis, and strategic alignment.' },
          { title: 'Design', id: 'IOT_DESIGN', icon: <Layers />, desc: 'Architecture design, platform selection, and solution planning.' },
          { title: 'Deliver', id: 'IOT_DEL', icon: <Activity />, desc: 'Structured implementation, integration, and deployment.' },
          { title: 'Govern', id: 'IOT_GOV', icon: <ShieldCheck />, desc: 'Monitoring, lifecycle management, and continuous optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Connected',
        titleHighlight: 'Intelligence.',
        description: 'Every sensor, every signal, every data point — engineered into a connected ecosystem that drives real operational outcomes across your enterprise.',
        stats: [
          { label: 'Endpoint Scale', val: 'MILLIONS' },
          { label: 'Data-to-Insight', val: '< 200ms' },
          { label: 'Availability', val: '99.99%' }
        ]
      }
    },

    // Focus Areas (rendered by template if supported)
    useCases: [
      { name: 'Smart Industries', icon: Factory, description: 'For manufacturing, energy, and utilities environments, IoT helps reimagine operations, improve process visibility, and unlock more resilient, efficient industrial systems.' },
      { name: 'Smart Living', icon: Heart, description: 'For wearables, healthcare, and security environments, IoT helps create safer, healthier, and more responsive connected experiences.' },
      { name: 'Smart Enterprises', icon: Building2, description: 'For buildings, offices, retail, and connected enterprise environments, IoT helps link people, machines, and information to improve security, efficiency, and operational intelligence.' }
    ],

    // Why Kangqore differentiators (engagement model — distinct from Diamond CoE's technical differentiators)
    whyKangqore: [
      { title: "Dedicated IoT Engineering Pods", description: "Cross-functional squads with embedded device, platform, analytics, and integration specialists assigned to your program from day one." },
      { title: "Agile Connected Delivery", description: "Sprint-based delivery with IoT-specific ceremonies — device readiness reviews, platform health checks, and telemetry validation gates." },
      { title: "Global Delivery with Local Context", description: "Delivery centers across time zones, paired with domain consultants who understand your industry's connected-system requirements." },
      { title: "Partnership Ecosystem", description: "Certified partnerships with Azure IoT, AWS IoT, PTC ThingWorx, and Intel — ensuring platform decisions are backed by vendor-level expertise." },
      { title: "Security-by-Design Discipline", description: "Device identity, OTA security, encrypted telemetry, and zero-trust architecture principles are embedded into every engagement." },
      { title: "Outcome-Based Engagement Models", description: "Flexible pricing — from fixed-scope PoCs to managed IoT operations — aligned with your business outcomes, not just effort." }
    ],

    // Custom Sections (GSAP — all in one JSX block)
    customSections: (
      <div className="flex flex-col w-full">
        <IoTWhySection />
        <IoTValueDeliver />
        <IoTDiamondCoESection />
        <IoTDeliveryModel />
        <IoTExecutionEcosystem />
        <IoTFutureReadySection />
      </div>
    ),

    // Final CTA Customization (matches Blockchain pattern)
    ctaTitle: "Ready to build a connected platform that scales from pilot to production?",
    ctaDescription: "Connect your assets, engineering insights, and business outcomes with Kangqore.",
    ctaButtonText: "Talk to Our IoT Architects",
    ctaSecondaryButton: { 
      text: "Schedule a Strategy Review", 
      link: "/contact?type=iot-strategy" 
    },

    // Custom FAQs
    customFAQs: [
      {
        question: 'What business value does IoT create for enterprises?',
        answer: 'IoT creates business value by connecting assets and scaling operations efficiently, acting on real-time data, transforming business processes, improving decisions with augmented intelligence, and managing end-to-end connected processes.'
      },
      {
        question: 'Where is IoT most commonly applied?',
        answer: 'IoT is most commonly applied across smart industries (manufacturing, energy, utilities), smart living (wearables, healthcare, security), and smart enterprises (connected buildings, offices, retail environments).'
      },
      {
        question: 'How do enterprises move from IoT pilots to production?',
        answer: 'By progressing through a structured three-phase model: Proof of Concept (validate connected use cases), Productization (build scalable connected products), and Operationalization (establish monitoring, onboarding, and managed operations).'
      },
      {
        question: 'Why is enterprise integration important in IoT?',
        answer: 'Because IoT value is only realized when connected systems work alongside ERP, CRM, gateways, and broader enterprise workflows — creating actual operational value instead of isolated data streams.'
      },
      {
        question: 'What capabilities matter most in a full IoT partner?',
        answer: 'A complete IoT partner should provide strategy and consulting, intelligent platform engineering, connected device enablement, vertical applications, system integration, testing, managed support, IIoT enablement, and DevOps automation.'
      },
      {
        question: 'What IoT platforms and technologies does Kangqore work with?',
        answer: 'We work across Microsoft Azure IoT, AWS IoT, PTC ThingWorx, MongoDB, WindRiver, Intel, along with microservices, web APIs, edge processing, analytics, device virtualization, and OTA update frameworks.'
      }
    ]
  };

  const department = {
    name: 'Emerging Technologies',
    slug: 'emerging-technologies',
    description: 'Transform your business with cutting-edge emerging technologies solutions.',
    icon: <Binary className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES — Flat cards with bgImage (Blockchain format)
  // ============================================
  const capabilities = [
    {
      title: 'IoT Strategy & Solution Development',
      description: 'Define the right connected use case, architecture direction, and solution blueprint before implementation complexity compounds.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Requirement elicitation and opportunity analysis',
        'Business process modeling and technology consulting',
        'Problem statement definition and solution blueprinting',
        'Product and service enhancement strategy'
      ],
      micro: 'Strategic clarity before connected complexity.'
    },
    {
      title: 'Intelligent IoT Platforms',
      description: 'Build secure, scalable, device-aware IoT platforms that support connectivity, analytics, and enterprise operations at scale.',
      bgImage: '/images/capabilities/iot-connected.png',
      items: [
        'Open platform architecture with end-to-end connectivity',
        'Multi-tenant, resource-efficient architecture',
        'Big data and business intelligence support',
        'Vendor-agnostic device virtualization and OTA readiness'
      ],
      micro: 'Scalable platforms for connected intelligence.'
    },
    {
      title: 'Connected Device Engineering',
      description: 'Enable device-side innovation through hardware, firmware, prototyping, and IoT framework engineering.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Hardware and firmware product design',
        'PCB flow and fabrication support',
        'Device framework enablement',
        'Form-factor customization, prototyping, and certification'
      ],
      micro: 'From sensors to production-ready devices.'
    },
    {
      title: 'Vertical IoT Applications',
      description: 'Create business applications that convert connected environments into usable workflows and user-facing experiences.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'End-device applications with protocol flexibility',
        'Native and mobile application development',
        'Data import/export-ready workflow support',
        'Re-engineering and customer-driven optimization'
      ],
      micro: 'Turning connected data into usable experiences.'
    },
    {
      title: 'End-to-End System Integration',
      description: 'Connect IoT environments with the enterprise systems that actually run the business.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'CRM and web-content integration',
        'ERP system integration',
        'SMS and email gateway integration',
        'Multi-asset lifecycle-stage integration'
      ],
      micro: 'Bridge between connected systems and enterprise workflows.'
    },
    {
      title: 'IoT Testing & Quality Assurance',
      description: 'Improve reliability across devices, platforms, and applications through dedicated IoT test coverage.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Device lab testing',
        'Device field testing',
        'Platform testing',
        'Mobile and automated application testing'
      ],
      micro: 'Confidence across every connected layer.'
    },
    {
      title: 'Managed Services & Operational Support',
      description: 'Keep connected environments stable, supported, and manageable after deployment.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Application management',
        'Cloud hosting support',
        'L1 / L2 / L3 support',
        'Incident management and command-center operations'
      ],
      micro: 'Ongoing stability for production IoT systems.'
    },
    {
      title: 'Platform Engineering & IIoT Enablement',
      description: 'Modernize and scale connected platforms through cloud migration, edge processing, analytics, and IIoT-oriented engineering.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Cloud migration using microservices and web APIs',
        'IIoT enablement using Azure IoT, AWS IoT, and ThingWorx',
        'Edge processing frameworks',
        'Analytics and visualization across web and mobile'
      ],
      micro: 'Industrial-grade connected platform evolution.'
    },
    {
      title: 'DevOps, Automation & Solution Engineering',
      description: 'Support long-term maintainability through automation, CI/CD, industrial test frameworks, and UX-led solution workflows.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Device and API test automation frameworks',
        'Continuous integration and deployment foundations',
        'Azure and AWS DevOps support',
        'UX-led secure workflow and application design'
      ],
      micro: 'Sustainable engineering for connected systems.'
    }
  ];

  // ============================================
  // TECHNOLOGIES — Categorized (Blockchain format)
  // ============================================
  const technologies = [
    { category: 'Platforms & Ecosystem', items: ['Microsoft Azure IoT', 'AWS IoT', 'PTC ThingWorx', 'MongoDB', 'WindRiver', 'Intel'] },
    { category: 'Industry Standards', items: ['TSDSI', 'Industrial Internet Consortium', 'OPC Foundation', 'MQTT Protocol'] },
    { category: 'Engineering Themes', items: ['Microservices', 'Web APIs', 'Edge Processing', 'Business Intelligence', 'Device Virtualization', 'OTA Updates'] },
    { category: 'Advanced Analytics', items: ['Asset Analytics & Condition Monitoring', 'Predictive Maintenance', 'Conversational Interfaces', 'Video Intelligence', 'OCR & Image Classification', 'NLP & Text Mining'] }
  ];

  // ============================================
  // ASSEMBLE PAGE DATA (Blockchain-identical pattern)
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: "Kangqore's IoT capabilities are designed to help enterprises build connected systems that remain scalable, analyzable, operationally stable, and business-relevant as they evolve. We combine strategy, platform engineering, device enablement, applications, integration, testing, and managed support to create IoT ecosystems that are not just connected — but usable, reliable, and outcomes-driven.",
      capabilities,
      trustPillars: [
        { title: 'Platform-first connected architecture', tag: 'Architecture', description: 'Design IoT ecosystems that prioritize platform scalability, device intelligence, and operational control.' },
        { title: 'Enterprise-grade integration by default', tag: 'Integration', description: 'Ensure IoT systems connect cleanly with ERP, CRM, gateways, and broader enterprise data flows.' },
        { title: 'Lifecycle operations discipline', tag: 'Operations', description: 'Support IoT success through onboarding, monitoring, managed support, and continuous platform evolution.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      customSections: service.customSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return (
    <div className="iot-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .iot-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default InternetOfThings;
