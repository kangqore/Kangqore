import React from 'react';
import { Activity, Layers, Search, TrendingUp, Zap, Target, Shield, Heart, Briefcase, Globe, BrainCircuit, Box, Anchor, Building2, Truck, Server, BarChart3, Cloud, FileText, Database } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { SupplyChainControlTower, SupplyChainReadinessMagnet } from './components/SupplyChainCustomSections';

const SupplyChain = () => {
  const service = {
    name: 'Supply Chain Operations',
    titleLine1: 'Supply',
    titleHighlight: 'Chain.',
    slug: 'supply-chain',
    shortDescription: 'Engineer resilient, autonomous supply networks that adapt instantly to disruption.',
    description: 'We don’t treat supply chain as a back-office function. We treat it as an enterprise performance system. We redesign supply chain operations so planning is sharper, execution is faster, visibility is real-time, and resilience is hardwired into your global architecture.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?auto=format&fit=crop&w=1260&q=80',
    
    primaryButton: { text: "Get Your Supply Chain Blueprint", link: "/contact" },
    secondaryButton: { text: "Schedule a Strategy Call", link: "#capabilities" },
    hideGenericMidPageCta: true,
    
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Business Operations', link: '/department/business-operations' },
      { label: 'Supply Chain Operations' }
    ],

    stats: [
      { value: '7', label: 'Core Supply Chain Pillars Engineered', color: 'text-brand-blue' },
      { value: 'E2E', label: 'End-to-End Network Visibility', color: 'text-blue-400' },
      { value: '20+', label: 'Enterprise Platforms Integrated', color: 'text-cyan-400' },
      { value: 'DAY 1', label: 'ESG Compliance Built In', color: 'text-brand-blue' },
    ],

    ctaTitle: 'Start Your Supply Chain Transformation Now',
    ctaDescription: 'Build a supply chain that is more resilient, more intelligent, and more accountable under real-world pressure. From sourcing control to ESG-led automation, we deploy the systems that accelerate execution.',
    ctaButtonText: 'Engage an Execution Architect',

    highFidelity: {
      narrative: {
        badge: 'SUPPLY CHAIN OPERATIONS :: V5',
        titleLine1: 'Supply',
        titleHighlight: 'Chain.',
        titleLine2: 'Transformation.',
        description: 'Global supply chains are the lifeblood of the modern economy. We help you transform linear logistics into an elastic, observable, and AI-driven supply network that adapts to severe disruption and maximizes throughput.',
        bottleneckLabel: 'The Disconnected Chain',
        bottleneckText: 'Your ERP says you have inventory, but the warehouse floor says you don\'t. Data latency between tier-2 suppliers and demand planners forces your teams to rely on static spreadsheets, resulting in blind spots, stockouts, and millions bled in expedited freight premiums. The core problem isn\'t "volatility"—it\'s a fragmented, reactive technology stack.',
        requirementLabel: 'Enterprise Performance Base',
        requirementText: 'We don\'t just map process flows in a slide deck. We architect and deploy the necessary telemetry, integration layers, and automation across systems like SAP, Kinaxis, and project44. We turn fragmented supply chains into predictable, zero-latency execution engines.',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1260&q=80',
        statusLabel: 'Network Readiness',
        statusValue: 'OPTIMIZED'
      },
      philosophy: {
        icon: <Truck className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: '',
        titleHighlight: 'Outcomes, Not Theories.',
        description: 'We bring together consulting, operational redesign, analytics, AI-led automation, and digital accelerators to solve acute logistical bottlenecks while hardening your infrastructure against future disruption.',
        pills: ['Real-Time Visibility', 'Cognitive Forecasting', 'Elastic Logistics', 'Embedded ESG'],
        features: [
          { title: 'Demand Planning', label: 'Cognitive', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Reduce forecast volatility and respond instantly to demand shifts with highly tuned analytical modeling.' },
          { title: 'Source-to-Pay', label: 'Procurement', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Drive upstream category intelligence and optimize downstream procure-to-pay execution parameters.' },
          { title: 'Fulfillment Engine', label: 'Orchestration', icon: <Zap className="w-5 h-5 text-gray-400" />, content: 'Streamline order orchestration using lean process design and smart automation that eliminates friction.' },
          { title: 'Cyber-Physical Security', label: 'Zero-Trust', icon: <Shield className="w-5 h-5 text-gray-400" />, content: 'Harden your supply network against third-party data breaches and physical disruption using Zero-Trust logistics.' }
        ]
      },
      matrix: {
        engineId: 'ZERO-LATENCY SUPPLY ENGINE™',
        title: 'The Execution Matrix.',
        subtext: 'A deliberate, engineering-first approach to overhauling legacy supply chains.',
        layers: [
          { title: 'Evaluate', id: 'SCM_MAP', icon: <Search />, desc: 'End-to-end value chain mapping and severe bottleneck diagnosis.' },
          { title: 'Architect', id: 'SCM_CORE', icon: <Layers />, desc: 'Designing resilient sourcing, planning, and predictive logistic blueprints.' },
          { title: 'Deploy', id: 'SCM_OPS', icon: <Zap />, desc: 'Executing digital platforms, AI-led intelligence, and operational workflow discipline.' },
          { title: 'Scale', id: 'SCM_SCALE', icon: <Activity />, desc: 'Continuous telemetry tuning and scaling autonomous supply frameworks.' }
        ]
      },
      schematic: {
        titleLine1: 'Maximize',
        titleHighlight: 'Throughput.',
        description: 'We build the foundations for exponential operational agility and resilience under pressure.',
        stats: [
          { label: 'Cash Conversion', val: 'ACCELERATED' },
          { label: 'Inventory Exposure', val: 'MINIMIZED' },
          { label: 'Fulfillment Speed', val: 'MAXIMIZED' }
        ]
      }
    },

    trustStrip: "Helping enterprises optimize supply chain operations across planning, procurement, execution, analytics, and ESG—transforming logistics into a competitive advantage.",
    
    whyKangqore: [
      { title: 'Execution, Not Theory', description: 'You don\'t need a vendor to simply map process flows. You need a partner that makes your supply chain more predictable, visible, and resilient.', icon: Target },
      { title: 'AI-Led Analytics', description: 'We embed algorithmic intelligence into risk monitoring, forecasting precision, and operational decision support.', icon: BrainCircuit },
      { title: 'True Network Observability', description: 'Attain absolute operational visibility across assets, suppliers, and fulfillment using integrated IoT and telemetry architecture.', icon: Activity }
    ],

    useCases: [
      { name: 'Manufacturing & Industrial', description: 'Industry 4.0 telemetry mapping, production forecasting, and hardware-integrated planning.', icon: Building2 },
      { name: 'Retail & Consumer Goods', description: 'Omnichannel fulfillment orchestration, precise inventory placing, and demand volatility smoothing.', icon: Briefcase },
      { name: 'Healthcare & Life Sciences', description: 'Cold-chain traceability, strict regulatory compliance, and rapid vital-asset distribution.', icon: Heart },
      { name: 'Transportation & Logistics', description: 'Elastic routing networks, fuel and asset optimization, and real-time fleet telemetry.', icon: Truck }
    ],

    customFAQs: [
      {
        question: 'What supply chain services does Kangqore provide?',
        answer: 'Kangqore provides end-to-end supply chain management services across demand and supply planning, source-to-pay transformation, engineering support and asset monitoring, order management and fulfillment, aftermarket services, supply chain risk and analytics, and ESG-led supply chain operations.'
      },
      {
        question: 'How do you support end-to-end visibility?',
        answer: 'We improve end-to-end visibility through connected data models, operational dashboards, control-tower thinking, IoT-enabled monitoring, and predictive analytics layers that help teams identify issues earlier and respond with less manual effort.'
      },
      {
        question: 'Can you help optimize supply chain cost and speed?',
        answer: 'Absolutely. We focus on removing friction across planning, sourcing, fulfillment, and service workflows so enterprises can radically reduce operational cost, accelerate transaction execution, and improve overall market responsiveness.'
      },
      {
        question: 'How do you enable resilience in global supply chains?',
        answer: 'We build resilience through better planning algorithms, stronger analytics, AI-led risk visibility, lean process redesign, and tight technology integration that helps clients anticipate disruption and maintain continuity.'
      },
      {
        question: 'How does AI improve supply chain management?',
        answer: 'AI improves forecasting accuracy, powers supplier risk sensing, drives workflow automation, and provides unmatched decision support. We integrate GenAI, Machine Learning, and advanced analytics to execute these advantages at scale.'
      },
      {
        question: 'Do you support ESG and sustainability in supply chain operations?',
        answer: 'Yes. We help organizations integrate ESG requirements deeply into supply chain processes through assessment, advisory, reporting architecture, and operating model redesign—ensuring sustainability is built into how the chain runs.'
      },
      {
        question: 'How long does a typical supply chain transformation take?',
        answer: 'It depends on scope, but our engagements follow a clear cadence: diagnostic and value-chain mapping in 2 to 3 weeks, solution architecture and pilot design in 4 to 6 weeks, and full-scale deployment within 90 to 120 days. We measure ROI from the first quarter of deployment, not from an arbitrary project end date. Most clients see measurable operational improvement within 90 days of engagement kickoff.'
      },
      {
        question: 'How do you integrate with our existing ERP and legacy systems?',
        answer: 'We do not rip and replace. Our approach is integration-first. We work with your existing SAP, Oracle, Microsoft Dynamics, or Infor backbone and layer in the necessary telemetry, automation, and analytics connectors. We have deep experience wiring platforms like Kinaxis, Blue Yonder, project44, and Coupa into legacy environments without disrupting active operations. Your teams keep working while we upgrade the plumbing underneath.'
      }
    ]
  };

  const department = {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Transform your business with cutting-edge business operations solutions.',
    icon: <Globe className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Demand & Supply Planning',
      description: 'Eradicate manual spreadsheet forecasting. We deploy cognitive logic and scenario modeling that connects downstream demand signals directly to upstream supplier capacity, stopping the bullwhip effect before it starts.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Demand forecasting modernization',
        'Supply planning and scenario modeling',
        'Inventory optimization and policy tuning',
        'S&OP / IBP process alignment'
      ],
      micro: 'Respond to demand, don\'t react.'
    },
    {
      title: 'Source-to-Pay (S2P) Architecture',
      description: 'Stop overpaying suppliers because your category data lives in 14 different spreadsheets. We consolidate sourcing intelligence, automate contract compliance, and wire Coupa or Ariba directly into your ERP so procurement decisions are data-driven, not gut-driven.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Strategic sourcing transformation',
        'Category and supplier intelligence',
        'Contracting process optimization',
        'Procure-to-pay workflow redesign'
      ],
      micro: 'Kill procurement leakage at the source.'
    },
    {
      title: 'Engineering & Asset Telemetry',
      description: 'Your maintenance team is replacing parts on a calendar schedule while IoT sensors sit unconnected. We wire Azure Digital Twins and AWS IoT SiteWise into your asset fleet so predictive maintenance replaces reactive firefighting and unplanned downtime drops to near-zero.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Asset monitoring architecture',
        'IoT-enabled maintenance visibility',
        'Preventive and predictive maintenance workflows',
        'Uptime control tower support'
      ],
      micro: 'Predict failures. Don\'t schedule them.'
    },
    {
      title: 'Fulfillment & Order Orchestration',
      description: 'Eliminate order friction and protect margins. We automate touchless orchestration to cut order-to-cash lifecycle lag and permanently reduce reliance on emergency freight.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Order orchestration redesign',
        'Fulfillment workflow automation',
        'Touchless and exception-based processing',
        'Service-level throughput optimization'
      ],
      micro: 'Revenue protection, absolute visibility.'
    },
    {
      title: 'Aftermarket Service Strategy',
      description: 'Your field technicians are waiting 72 hours for spare parts because service inventory planning still runs on last quarter\'s forecast. We redesign aftermarket operations so parts are pre-positioned, resolution times collapse, and your CSAT scores stop bleeding.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Aftermarket process optimization',
        'Service inventory and parts planning',
        'Query resolution workflow redesign',
        'Real-time service planning automation'
      ],
      micro: 'Pre-position parts. Collapse resolution times.'
    },
    {
      title: 'Risk & Cyber-Physical Security',
      description: 'A single compromised vendor API took down a Fortune 100 supply network for 11 days last year. We deploy Zero-Trust logistics frameworks and real-time early-warning telemetry that flag vendor compromise, route anomalies, and operational variance before they cascade into production shutdowns.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Cyber-Physical supply chain hardening',
        'Zero-Trust third-party vendor integration',
        'Predictive variance and risk telemetry',
        'Decision-support control towers'
      ],
      micro: 'One breach cascades. Zero-Trust stops it.'
    },
    {
      title: 'Embedded SCM Sustainability (ESG)',
      description: 'Your board is asking for Scope 3 emissions data and your supply chain team is guessing. We encode ESG compliance directly into procurement gates, logistics routing, and supplier onboarding workflows so sustainability is an operational reality, not a quarterly slide deck.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'ESG operating model integration',
        'Sustainable supply chain assessments',
        'Process-level transparency improvement',
        'Platform-aligned ESG telemetry enablement'
      ],
      micro: 'Scope 3 accountability. Built into the process.'
    }
  ];

  const technologies = [
    { category: 'Core ERP & Operations', items: ['SAP S/4HANA', 'Oracle SCM Cloud', 'Microsoft Dynamics 365', 'Infor M3'] },
    { category: 'Planning & Forecasting', items: ['Blue Yonder', 'Kinaxis RapidResponse', 'Anaplan', 'O9 Solutions'] },
    { category: 'Network Visibility', items: ['Project44', 'FourKites', 'Shippeo', 'E2open'] },
    { category: 'Procurement & Sourcing', items: ['Coupa', 'Ariba', 'Ivalua', 'Jaggaer'] },
    { category: 'Analytics & Twins', items: ['Palantir Foundry', 'AWS IoT SiteWise', 'Azure Digital Twins', 'Snowflake'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Powered by the Kangqore Zero-Latency Supply Engine™, these seven core pillars bridge planning, cyber-physical security, and fulfillment. We don\'t sell advisory—we deploy proprietary, autonomous execution frameworks.',
      capabilities,
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      customFAQs: service.customFAQs,
      customSections: [<SupplyChainControlTower key="sc-tower" />],
      postCapabilitiesSections: [<SupplyChainReadinessMagnet key="sc-magnet" />],
      trustPillarsVideo: '/videos/engineering-rd-bg.mp4',
      trustPillars: [
        { title: 'Faster planning cycles', tag: 'Planning', description: 'Tightly coupled demand modeling leading to immediate, high-fidelity forecasting confidence.' },
        { title: 'Lower inventory exposure', tag: 'Inventory', description: 'Preventative algorithms that dynamically reduce stockouts while eliminating bloat.' },
        { title: 'Better fulfillment responsiveness', tag: 'Transactions', description: 'Streamlined orchestration that sharply reduces order-to-cash lifecycle lag.' },
        { title: 'Absolute network visibility', tag: 'Telemetry', description: 'Track assets, suppliers, and operational risk across the global grid in real-time.' },
        { title: 'ESG accountability', tag: 'Sustainability', description: 'Supply chain sustainability encoded directly into process compliance gates.' }
      ]
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default SupplyChain;
