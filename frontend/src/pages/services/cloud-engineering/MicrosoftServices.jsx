import React from 'react';
import { Cloud, Layers, Search, ShieldCheck, Zap, Activity } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const MicrosoftServices = () => {

  const service = {
    name: 'Microsoft Services',
    slug: 'microsoft-services',
    shortDescription: 'Build, modernize, secure, and scale enterprise systems on the Microsoft ecosystem — engineered for performance, governance, and long-term resilience.',
    description: (
      <div>
        <p className="mb-4">
          Microsoft technologies are powerful. But real enterprise value comes from architectural discipline, integration clarity, and operational control.
        </p>
        <p>
          Kangqore helps organizations move beyond tool adoption toward structured, scalable Microsoft implementations that drive measurable outcomes.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    stats: [
      { value: 'Unified', label: 'Identity & Access', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Zero', label: 'Trust Gaps', color: 'text-blue-400' },
      { value: '100%', label: 'Ecosystem Synergy', color: 'text-emerald-400' },
      { value: 'Resilient', label: 'Azure Core', color: 'text-purple-400' },
    ],
    primaryButton: { text: 'Request a Consultation', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    highFidelity: {
      narrative: {
        badge: 'Enterprise Ecosystem :: 2026',
        titleLine1: 'Build. Modernize.',
        titleHighlight: 'Secure & Scale.',
        titleLine2: 'On Microsoft.',
        description: 'Real enterprise value on the Microsoft stack comes from architectural discipline, integration clarity, and operational control — not just tool adoption.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Ecosystems grow faster than architecture discipline — creating fragmentation, inconsistency, and security gaps.',
        requirementLabel: 'The Requirement',
        requirementText: 'Governed, integrated Microsoft environments engineered for sustainable transformation.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
        statusLabel: 'Ecosystem Health',
        statusValue: 'Hardened'
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-brand-blue" />,
        title: 'Engineering-First',
        titleHighlight: 'Microsoft Delivery.',
        description: 'We approach Microsoft services as structured engineering programs — not tool deployments. Every implementation is evaluated for scalability, operational resilience, cost control, and lifecycle sustainability.',
        pills: ['Architecture-Led', 'Governance-First', 'Security-by-Default', 'Outcome-Driven']
      },
      matrix: {
        engineId: 'Engine :: Azure_Aria_V3',
        title: 'Enablement Matrix',
        subtext: 'Our Microsoft lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
        layers: [
          { title: 'Assess', id: 'MST_MAP', icon: <Search />, desc: 'Ecosystem audit, workload readiness, and architecture review.' },
          { title: 'Architect', id: 'MST_CORE', icon: <Layers />, desc: 'Designing resilient Azure, M365, and Dynamics 365 blueprints.' },
          { title: 'Execute', id: 'MST_GO', icon: <Zap />, desc: 'Deploying governed automation, cloud, and platform workloads.' },
          { title: 'Govern', id: 'MST_RULE', icon: <ShieldCheck />, desc: 'Security posture, monitoring frameworks, and lifecycle controls.' }
        ]
      },
      schematic: {
        titleLine1: 'Integrated Systems.',
        titleHighlight: 'Not Fragmented Toolsets.',
        description: 'When AI enablement, cloud engineering, automation, and advanced analytics operate cohesively — your Microsoft ecosystem becomes a competitive advantage.',
        stats: [
          { label: 'Governance', val: 'EMBEDDED' },
          { label: 'Security', val: 'HARDENED' },
          { label: 'Scale', val: 'CONTROLLED' }
        ]
      }
    }
  };

  const department = {
    name: 'Cloud Engineering',
    slug: 'cloud-engineering',
    description: 'Building and scaling enterprise cloud infrastructure across Azure, AWS, and GCP.'
  };

  const capabilities = [
    {
      title: 'App Modernization',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Modernizing legacy systems is not about rewriting everything — it\'s about making smart architectural decisions.',
      items: [
        { heading: 'Portfolio Rationalization', description: 'Assess application portfolios for modernization readiness.' },
        { heading: 'Migration Pathways', description: 'Identify refactor, re-platform, or re-architect pathways.' },
        { heading: 'Performance Optimization', description: 'Improve performance, maintainability, and cost-efficiency.' },
        { heading: 'Cloud-Native Alignment', description: 'Align applications with cloud-native best practices and reduce technical debt.' }
      ]
    },
    {
      title: 'Modern Workplace',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Digital collaboration requires structure, governance, and security.',
      items: [
        { heading: 'Secure Collaboration Architecture', description: 'Design governance-aware collaboration environments that scale with distributed teams.' },
        { heading: 'Identity & Access Governance', description: 'Align identity and access controls with enterprise security requirements.' },
        { heading: 'Productivity Standardization', description: 'Standardize productivity environments across user groups and devices.' },
        { heading: 'Adoption Enablement', description: 'Structured adoption frameworks for distributed teams ensuring compliance.' }
      ]
    },
    {
      title: 'Microsoft Dynamics 365',
      bgImage: '/images/capabilities/growth-marketing.png',
      description: 'ERP and CRM systems must support operational velocity — not slow it down.',
      items: [
        { heading: 'CRM/ERP Integration Strategy', description: 'Business workflow analysis and system alignment for operational clarity.' },
        { heading: 'Custom Workflow Design', description: 'Customization and integration planning aligned to enterprise processes.' },
        { heading: 'Reporting Layer Optimization', description: 'Reporting and data visibility enablement across operational functions.' },
        { heading: 'Scalable Architecture', description: 'Scalable architecture planning for long-term operational growth.' }
      ]
    },
    {
      title: 'Connected Products',
      bgImage: '/images/capabilities/iot-connected.png',
      description: 'Connected ecosystems require structured engineering.',
      items: [
        { heading: 'Integration Framework Design', description: 'Design integration frameworks for device/platform connectivity.' },
        { heading: 'Scalable Data Flows', description: 'Enable scalable data flows between products and enterprise systems.' },
        { heading: 'IoT-Ready Architecture', description: 'IoT-ready integration architecture with event-driven patterns.' },
        { heading: 'Operational Alignment', description: 'Align connected product strategies with operational enterprise systems.' }
      ]
    },
    {
      title: 'Analytics & AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Data without structure becomes noise.',
      items: [
        { heading: 'Enterprise Analytics Architecture', description: 'Design data platforms aligned to business KPIs and decision workflows.' },
        { heading: 'Insight Pipeline Planning', description: 'Build insight pipelines from raw data to actionable business intelligence.' },
        { heading: 'Governance-Aware AI Enablement', description: 'AI readiness assessment with governance and compliance guardrails.' },
        { heading: 'Data-to-Decision Frameworks', description: 'Structured frameworks that convert data into measurable enterprise decisions.' }
      ]
    },
    {
      title: 'Azure & Azure Sentinel',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Security is foundational — not optional.',
      items: [
        { heading: 'Cloud Security Posture Alignment', description: 'Secure cloud architecture design reviewed against industry benchmarks.' },
        { heading: 'Monitoring & Threat Detection', description: 'Monitoring framework implementation and alert architecture design.' },
        { heading: 'Incident Visibility Frameworks', description: 'Incident workflow mapping and security visibility gap analysis.' },
        { heading: 'Risk Mitigation Modeling', description: 'Structured risk mitigation modeling embedded into architecture design.' }
      ]
    },
    {
      title: 'Power Platform',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Low-code must still follow engineering discipline.',
      items: [
        { heading: 'App Governance Frameworks', description: 'Citizen development guardrails that prevent shadow IT from proliferating.' },
        { heading: 'Workflow Automation Patterns', description: 'Structured automation patterns aligned to enterprise process governance.' },
        { heading: 'Innovation Acceleration', description: 'Internal innovation acceleration with platform oversight controls.' },
        { heading: 'Process Digitization Strategy', description: 'Process digitization strategy that empowers business teams responsibly.' }
      ]
    }
  ];

  const technologies = [
    { category: 'Azure Core Services', items: ['Azure Compute', 'Azure Networking', 'Azure Storage', 'Azure App Services', 'Azure Functions', 'Azure Kubernetes Service (AKS)', 'Azure DevOps'] },
    { category: 'Security & Identity', items: ['Azure Sentinel', 'Microsoft Entra (Identity)', 'Microsoft Defender', 'Azure Active Directory', 'Privileged Identity Management', 'Conditional Access Policies'] },
    { category: 'Productivity & Collaboration', items: ['Microsoft 365', 'Microsoft Teams', 'SharePoint Online', 'Exchange Online', 'OneDrive for Business', 'Viva Suite'] },
    { category: 'Business Applications', items: ['Dynamics 365 CRM', 'Dynamics 365 ERP', 'Power Apps', 'Power Automate', 'Power BI', 'Power Virtual Agents'] },
    { category: 'Data & Analytics', items: ['Azure Synapse Analytics', 'Azure Data Factory', 'Azure Data Lake', 'Microsoft Fabric', 'Azure Machine Learning', 'Azure Cognitive Services'] },
    { category: 'Infrastructure & DevOps', items: ['Azure DevOps', 'GitHub Enterprise', 'Azure Monitor', 'Azure Policy', 'Azure Blueprints', 'Infrastructure as Code (Bicep / Terraform)'] }
  ];

  const customFAQs = [
    {
      question: 'What makes Microsoft Services different from a standard Azure deployment?',
      answer: 'We approach Microsoft services as structured engineering programs — not tool deployments. Every engagement includes architecture design, governance frameworks, and lifecycle planning to ensure long-term resilience.'
    },
    {
      question: 'How does Kangqore handle Microsoft ecosystem fragmentation?',
      answer: 'We design integration architectures that unify identity, data, security, and applications across the Microsoft ecosystem — ensuring applications do not fragment as environments scale.'
    },
    {
      question: 'Do you support Dynamics 365 customization?',
      answer: 'Yes. We handle CRM and ERP integration strategy, custom workflow design, reporting optimizations, and scalable architecture planning to support long-term operational growth.'
    },
    {
      question: 'How is security embedded into your Microsoft implementations?',
      answer: 'Security-by-default architecture is a core principle. Governance, monitoring, and compliance awareness are embedded into design — not added as afterthoughts post-deployment.'
    },
    {
      question: 'What Microsoft accelerator programs do you offer?',
      answer: 'We offer structured assessments including Azure Migration Assessment (8 weeks), Sentinel Readiness Assessment, Modern Workspace Enablement, Advanced Analytics Platform Briefing, and Azure DC Migration Blueprint.'
    }
  ];

  const whyKangqoreIntro = `Kangqore approaches Microsoft services as structured engineering programs — designed for scalability, governance, and sustainable transformation. Our focus is on integration clarity and architectural stability, not just tool deployment.`;

  const whyKangqore = [
    { title: 'Engineering-First Delivery', description: 'We approach Microsoft services as structured engineering programs — not tool deployments.' },
    { title: 'Security-by-Default Architecture', description: 'Governance, monitoring, and compliance awareness are embedded into design — not added later.' },
    { title: 'Platform Readiness Mindset', description: 'Every implementation is evaluated for scalability, operational resilience, cost control, and lifecycle sustainability.' },
    { title: 'Integration Clarity', description: 'We design cohesive ecosystems where Azure, M365, Dynamics, and Power Platform operate as unified systems.' },
    { title: 'Governance-Aware Automation', description: 'Low-code and automation implementations include citizen development guardrails and enterprise oversight controls.' }
  ];

  const industryIntro = `Microsoft ecosystems power mission-critical operations across industries. But digital transformation requires integration clarity, secure infrastructure, governance-aware automation, and business-aligned analytics. We ensure Microsoft investments align with measurable enterprise value — not just technical upgrades.`;

  const industries = [
    { name: 'Industrial & Manufacturing', description: 'Connected products, predictive systems, and operational data intelligence.' },
    { name: 'Healthcare', description: 'Secure collaboration, compliance frameworks, and clinical data governance.' },
    { name: 'EduTech', description: 'Modern workplace enablement, identity governance, and productivity platforms.' },
    { name: 'Retail', description: 'CRM/ERP integration, analytics pipelines, and customer data platforms.' },
    { name: 'BFSI', description: 'Security posture, Sentinel readiness, and governance-first cloud architecture.' },
    { name: 'Energy', description: 'IoT integration, operational data flows, and infrastructure modernization.' }
  ];

  const additionalInfo = {
    overview: `Most enterprises struggle not because of lack of Microsoft tools — but because ecosystems grow faster than architecture discipline. Without structured governance, applications fragment, automation becomes inconsistent, security visibility weakens, and data silos multiply. Kangqore designs Microsoft environments with scalable integration architecture, governance-first implementation, controlled automation frameworks, and clear ownership and lifecycle processes.`,
    benefits: [
      'Scalable integration architecture across the Microsoft ecosystem',
      'Governance-first implementation at every layer',
      'Controlled automation frameworks that prevent shadow IT',
      'Clear ownership and lifecycle sustainability processes'
    ],
    useCases: [
      'Azure Migration Assessment (8 Weeks)',
      'Sentinel Readiness Assessment',
      'Modern Workspace Enablement Package',
      'Azure Cloud / DC Migration Blueprint',
      'Advanced Analytics Platform Briefing',
      'Enterprise Communication Platform Assessment'
    ]
  };

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      additionalInfo,
      customFAQs,
      whyKangqoreIntro,
      whyKangqore,
      industryIntro,
      industries
    },
    department
  };

  return (
    <ServicePageTemplate
      service={pageData.service}
      department={department}
      primaryButton={service.primaryButton}
      secondaryButton={service.secondaryButton}
    />
  );
};

export default MicrosoftServices;
