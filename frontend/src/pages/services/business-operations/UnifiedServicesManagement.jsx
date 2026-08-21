import React from 'react';
import { Activity, Layers, Search, Zap, Target, BrainCircuit, Workflow, Shield, CheckCircle2, Bot, Boxes, Share2 } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  USMExperienceImperative,
  USMAIStatsSection,
  USMWhatWeOfferAccordion,
  USMReadinessMagnet,
  USMControlTower,
  USMExecutionEcosystem
} from '../../../components/services/platforms/USMCustomSections';

const UnifiedServicesManagement = () => {
  const service = {
    name: 'Unified Service Management',
    titleLine1: 'Unified Service',
    titleHighlight: 'Management.',
    slug: 'unified-services-management',
    shortDescription: 'We unify fragmented operations into one intelligent service ecosystem.',
    description: 'Most enterprises operate across disconnected tools, siloed teams, and inconsistent workflows. That creates delays, poor visibility, rising support costs, and weak employee experiences. Kangqore connects IT, HR, Finance, Facilities, Customer Operations, and enterprise workflows into a single AI-powered operating model.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1260&q=80',
    
    primaryButton: { text: "Get Your USM Blueprint", link: "/contact" },
    secondaryButton: { text: "Schedule a Strategy Call", link: "#capabilities" },
    hideGenericMidPageCta: true,
    
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Business Operations', link: '/department/business-operations' },
      { label: 'Unified Service Management' }
    ],

    stats: [
      { value: '40%+', label: 'Faster Resolution Time', color: 'text-brand-blue' },
      { value: '360°', label: 'Cross-Function Visibility', color: 'text-blue-400' },
      { value: '24/7', label: 'AI-Powered Service Support', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Day 1', label: 'Governance Ready Operations', color: 'text-brand-blue' },
    ],

    ctaTitle: 'Build a Connected Enterprise Service Model',
    ctaDescription: 'Disconnected support functions slow growth. Kangqore helps you unify service operations, automate workflows, and create experiences people trust.',
    ctaButtonText: 'Talk to a Consultant',

    highFidelity: {
      narrative: {
        badge: 'UNIFIED SERVICE MANAGEMENT :: ENTERPRISE OPS',
        titleLine1: 'Connected',
        titleHighlight: 'Operations.',
        titleLine2: 'Scaled Precision.',
        description: 'Modern enterprises need a connected operating model where workflows move seamlessly across departments, data flows in real time, and every employee or customer interaction feels effortless.',
        bottleneckLabel: 'The Siloed Reality',
        bottleneckText: 'Your IT desk runs on ServiceNow, HR uses email, and Finance manages requests in spreadsheets. This fragmented architecture creates massive friction, invisible costs, and forces employees to act as their own systems integrators just to get work done.',
        requirementLabel: 'The Unified Standard',
        requirementText: 'Service excellence cannot happen in silos. We deploy an integration-first operating model—combining platform engineering, AI copilots, and cross-department workflows to standardize service delivery and automate repetitive work at scale.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1260&q=80',
        statusLabel: 'Service Architecture',
        statusValue: 'UNIFIED'
      },
      philosophy: {
        icon: <Layers className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: 'Integration-First.',
        titleHighlight: 'Execution-Always.',
        description: 'We combine advisory, platform engineering, automation, AI copilots, analytics, and managed services to redesign how enterprise functions operate together. From internal support to shared services, we build ecosystems built for scale.',
        pills: ['Connected Experience', 'AI Copilots', 'Cross-Function Workflows', 'Governance-Ready'],
        features: [
          { title: 'Service Strategy', label: 'Architecture', icon: <Share2 className="w-5 h-5 text-gray-400" />, content: 'Design a unified operating model that aligns IT, HR, and business functions under a single governance framework.' },
          { title: 'Platform Engineering', label: 'Integration', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Implement and customize platforms like ServiceNow to act as the central nervous system for all enterprise workflows.' },
          { title: 'AI Automation', label: 'Zero-Touch', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'Deploy virtual agents and predictive routing to automate repetitive requests and accelerate mean-time-to-resolution.' },
          { title: 'Analytics & Insights', label: 'Observability', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Gain 360-degree visibility into service performance, SLA compliance, and process bottlenecks across all departments.' }
        ]
      },
      matrix: {
        engineId: 'UNIFIED SERVICE ENGINE™',
        title: 'The Enablement Matrix.',
        subtext: 'A structured methodology for transforming fragmented departments into a governed, high-velocity service fabric.',
        layers: [
          { title: 'Assess', id: 'USM_MAP', icon: <Search />, desc: 'Service inventory mapping, maturity assessment, and bottleneck identification.' },
          { title: 'Design', id: 'USM_CORE', icon: <Layers />, desc: 'Architecting unified service blueprints, shared portals, and governance rules.' },
          { title: 'Deploy', id: 'USM_OPS', icon: <Zap />, desc: 'Executing automated service desks, AI copilots, and cross-department workflows.' },
          { title: 'Optimize', id: 'USM_TEL', icon: <Activity />, desc: 'Real-time service telemetry, proactive SLA monitoring, and continuous improvement.' }
        ]
      },
      schematic: {
        titleLine1: 'Synthesize',
        titleHighlight: 'Efficiency.',
        description: 'Your services should be your greatest driver of trust. We ensure they remain transparent, scalable, and optimized for excellence.',
        stats: [
          { label: 'Integrity', val: 'ABSOLUTE' },
          { label: 'Speed', val: 'MAXIMIZED' },
          { label: 'Scale', val: 'GLOBAL' }
        ]
      }
    },

    trustStrip: "Trusted by enterprises across banking, healthcare, manufacturing, and technology to unify service operations, automate workflows, and scale shared services across 50,000+ seat organizations.",
    
    whyKangqore: [
      { title: 'Execution, Not Theory', description: 'We don’t just draw operating models on whiteboards. We engineer the underlying platforms, build the automated workflows, and run the managed services to guarantee the outcome.', icon: Target },
      { title: 'Platform Agnostic Expertise', description: 'Whether you run on ServiceNow, BMC, Atlassian, or Salesforce, we have the deep technical architecture capability to integrate your fragmented systems into one fabric.', icon: Boxes },
      { title: 'AI-Native Approach', description: 'We embed decision intelligence and GenAI directly into your service workflows, enabling predictive routing, auto-resolution, and zero-touch ticket deflection.', icon: BrainCircuit }
    ],

    useCases: [
      { name: 'Banking & Financial Services', description: 'Secure, compliant service portals for trading desks, branch support, and cross-border operations.', icon: Shield },
      { name: 'Healthcare & Life Sciences', description: 'Unified clinical support desks, facility management workflows, and rapid onboarding for medical staff.', icon: Activity },
      { name: 'Technology & SaaS', description: 'High-velocity developer support, automated provisioning, and seamless IT-to-Engineering issue escalation.', icon: Zap },
      { name: 'Manufacturing & Industrial', description: 'Connected shop-floor support, supply chain vendor portals, and integrated IoT maintenance alerts.', icon: Workflow }
    ],

    customFAQs: [
      {
        question: 'What is Unified Service Management?',
        answer: 'A model that extends service management beyond IT into HR, Finance, Facilities, Customer Ops, and other business functions through one connected platform.'
      },
      {
        question: 'Why does USM matter?',
        answer: 'It removes silos, improves service consistency, reduces operational costs, and creates better employee and customer experiences.'
      },
      {
        question: 'Which departments can be unified?',
        answer: 'IT, HR, Finance, Procurement, Facilities, Legal, Customer Support, Shared Services, and more.'
      },
      {
        question: 'How does AI improve service management?',
        answer: 'AI automates repetitive tasks, predicts issues, improves routing, powers virtual agents, and delivers faster resolutions.'
      },
      {
        question: 'Can Kangqore modernize legacy service models?',
        answer: 'Yes. We redesign outdated ticketing and fragmented workflows into scalable digital operating models.'
      },
      {
        question: 'Do you support ServiceNow and other platforms?',
        answer: 'Yes. We support ServiceNow, Microsoft ecosystems, BMC, Salesforce, Atlassian, AWS, Google Cloud, IBM, and custom workflow environments.'
      },
      {
        question: 'How do you measure success?',
        answer: 'Through SLA improvements, resolution speed, automation rate, satisfaction scores, productivity gains, and cost reduction.'
      },
      {
        question: 'Is this suitable for global enterprises?',
        answer: 'Yes. Our frameworks are built for multi-region, multi-language, high-scale enterprise environments.'
      },
      {
        question: 'How long does a typical USM transformation take?',
        answer: 'It depends on scope, but our engagements follow a clear cadence: service inventory mapping and maturity assessment in 2 to 3 weeks, platform architecture and pilot design in 4 to 6 weeks, and phased deployment within 90 to 120 days. Most organizations see measurable SLA improvement and ticket deflection gains within the first quarter of deployment.'
      }
    ],

    preMatrixSection: <USMExperienceImperative />,
    customSections: [<USMControlTower key="usm-tower" />],
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <USMWhatWeOfferAccordion />
        <USMAIStatsSection />
        <USMReadinessMagnet />
      </div>
    ),
    postFAQSections: (
      <div className="flex flex-col w-full">
        <USMExecutionEcosystem />
      </div>
    )
  };

  const department = {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Transform your business with cutting-edge business operations solutions.',
    icon: <Share2 className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Global Service Desk Operations',
      description: 'Stop treating internal support as a cost center. We run 24/7, multi-region service desks that act as the intelligent first line of defense, deploying predictive routing to solve issues before they escalate.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        '24/7 Multi-Region Support',
        'L1/L2/L3 escalation frameworks',
        'SLA Governance & Reporting',
        'Continuous Service Optimization'
      ],
      micro: 'Predictable support, global scale.'
    },
    {
      title: 'Service Operating Model Design',
      description: 'You cannot run unified services on an outdated org chart. We completely redesign your service operating model, stripping out bottlenecks and aligning IT, HR, and Finance under a single, governed delivery framework.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Workflow & Process Assessment',
        'Target Operating Model (TOM) design',
        'Governance & Compliance Advisory',
        'Experience Improvement Roadmaps'
      ],
      micro: 'Structure drives resolution speed.'
    },
    {
      title: 'Enterprise Platform Implementation',
      description: 'Your workflows are only as good as the platform running them. We architect, implement, and harden enterprise platforms like ServiceNow to act as the central nervous system for all operational requests.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'ServiceNow / ITSM Modernization',
        'Platform Rationalization Strategy',
        'Custom workflow application builds',
        'Platform security and access governance'
      ],
      micro: 'Deploy the central nervous system.'
    },
    {
      title: 'Cross-Department Workflow Integration',
      description: 'An employee onboarding shouldn\'t require 14 separate tickets. We integrate IT provisioning, HR setup, and Facilities access into single, seamless workflows that cross departmental boundaries automatically.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'HR, Finance & Facilities Portals',
        'Cross-system API integration',
        'Onboarding/Offboarding automation',
        'Enterprise-wide catalog design'
      ],
      micro: 'One request. Complete execution.'
    },
    {
      title: 'Virtual Agents & AI Assistants',
      description: 'Deflect Tier 1 tickets instantly. We embed natural language AI assistants into your enterprise portals and collaboration tools (like Slack/Teams) so employees get immediate answers without human intervention.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'GenAI for Support Operations',
        'Omnichannel virtual agent deployment',
        'Intelligent Knowledge Management',
        'Natural language intent recognition'
      ],
      micro: 'Zero-touch resolution.'
    },
    {
      title: 'Auto-Resolution & Predictive Routing',
      description: 'Stop manually triaging tickets. We deploy machine learning algorithms that instantly categorize, prioritize, and route requests to the exact right resolver group—or execute an auto-resolution script instantly.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Predictive Routing & Prioritization',
        'Auto-Resolution Workflows',
        'AIOps incident correlation',
        'Automated fulfillment scripts'
      ],
      micro: 'Machine-speed triage.'
    },
    {
      title: 'Service Analytics & Insights',
      description: 'Move from reactive reporting to predictive observability. We build real-time executive dashboards that expose SLA breaches, workflow bottlenecks, and user sentiment before they impact enterprise productivity.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-time SLA tracking',
        'Process mining and bottleneck detection',
        'User sentiment and CSAT analytics',
        'Predictive volume forecasting'
      ],
      micro: 'Data-driven service governance.'
    },
    {
      title: 'Shared Services Transformation',
      description: 'Transform isolated back-office functions into high-performing Global Capability Centers. We help enterprises centralize and standardize their disparate service teams into optimized shared service hubs.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Shared services feasibility analysis',
        'Hub-and-spoke model design',
        'Service catalog standardization',
        'Outcome-Based Transformation Programs'
      ],
      micro: 'Scale through centralization.'
    }
  ];

  const technologies = [
    { category: 'ITSM & Enterprise Platforms', items: ['ServiceNow', 'BMC Helix', 'Jira Service Management', 'Freshservice', 'Salesforce'] },
    { category: 'Cloud Ecosystems', items: ['Microsoft Azure', 'AWS', 'Google Cloud', 'IBM Cloud'] },
    { category: 'AI & Automation', items: ['Microsoft Copilot', 'IBM Watson', 'Automation Anywhere', 'UiPath', 'Moveworks'] },
    { category: 'Collaboration & Workflow', items: ['Microsoft 365', 'Slack', 'Microsoft Teams', 'Atlassian Confluence'] },
    { category: 'Observability & Analytics', items: ['Power BI', 'Tableau', 'Splunk', 'Datadog', 'Celonis'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Eight execution streams that transform fragmented departments into a unified, high-velocity service fabric. We don\'t just advise—we architect the platforms and automate the workflows.',
      capabilities,
      trustPillars: [
        { title: 'Absolute visibility', tag: 'Observability', description: '360-degree transparency across every enterprise workflow, instantly exposing bottlenecks and SLA risks.' },
        { title: 'Zero-touch resolution', tag: 'Automation', description: 'AI-driven deflection and automated fulfillment scripts that drastically reduce human intervention.' },
        { title: 'Cross-functional speed', tag: 'Integration', description: 'Seamlessly connected IT, HR, and Finance systems that eliminate departmental silos.' },
        { title: 'Frictionless experience', tag: 'UX', description: 'Consumer-grade service portals that make internal enterprise support feel effortless.' },
        { title: 'Predictive governance', tag: 'AI-Powered', description: 'Machine learning algorithms that predict service outages and capacity constraints before they happen.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default UnifiedServicesManagement;
