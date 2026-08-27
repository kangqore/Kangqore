// ─── Kangqore Platforms — Premium Service Content (Phase G5 / G PR 2) ────────
// Per-service premium presentation layer for the Platforms department. Each
// entry is an object that merges over the canonical base service from
// servicesData.js to produce the legacy-template-compatible shape consumed
// by ServicePageTemplate via ServicePageReal.
//
// Per DoD #3: do NOT include base identity fields here (name, slug,
// departmentSlug, shortDescription). ServicePageReal re-asserts those after
// the spread and will silently drop any duplicates.
//
// Schema for each entry (all fields optional unless noted):
//   - titleLine1 (string)             — first line of hero title
//   - titleHighlight (string)         — gradient-highlighted line of hero title
//   - description (string)            — punchy hero description (overrides fullDescription)
//   - image (string)                  — hero/narrative image URL
//   - videoBackground (string)        — hero video URL
//   - primaryButton (object)          — { text, link }
//   - secondaryButton (object | null) — { text, link } or null to suppress
//   - stats (array)                   — [{ value, label, color }]
//   - hideGenericMidPageCta (bool)    — suppress template's generic CTA
//   - hideGenericFaq (bool)           — suppress template's generic FAQ
//   - highFidelity (object)           — { narrative, philosophy, matrix, schematic }
//   - capabilitiesTitle (string)      — title for the capabilities section
//   - capabilities (array)            — capability groups (legacy shape)
//   - customSections (JSX)            — JSX fragment containing dept-specific sections
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Network, Layers, Search, ShieldCheck, Activity, GitBranch, Database,
  ShoppingCart, Server, Cloud, Layout, Settings, Globe, Users, BrainCircuit,
  Target, Zap, Truck, BarChart3, Shield, Share2, Bot,
  CheckCircle2, Briefcase, TrendingUp, Boxes,
} from 'lucide-react';
import {
  EPIWhySection,
  EPIValueAccordion,
  EPISolutionsCarousel,
  EPIStrengthsBento,
  EPIPhilosophyBg,
  EPIIntegrationGraph,
} from './EPICustomSections';
import {
  PimWhySection,
  PimValueAccordion,
  PimProblemsGrid,
  PimHowWeHelp,
  PimArchitectureSchematic,
  PimUseCasesCarousel,
  PimBenefitsGrid,
} from './PimcoreCustomSections';
import {
  SalesforceWhySection,
  SalesforceValueDeliver,
  SalesforceDeliveryModel,
  SalesforcePhilosophyBackground,
  SalesforceDiamondCoESection,
  SalesforceExecutionEcosystem,
  SalesforceFutureReadySection,
} from './SalesforceCustomSections';
import {
  ServicenowPhilosophyBackground,
  ServicenowWhySection,
  ServicenowValueDeliver,
  ServicenowDiamondCoESection,
  ServicenowDeliveryModel,
  ServicenowExecutionEcosystem,
  ServicenowFutureReadySection,
} from './ServicenowCustomSections';
import {
  GCCPhilosophyBackground,
  GCCMarketContextStrip,
  GCCValueDeliverSection,
  GCCBuyerSegmentation,
  GCCMindsetTimeline,
  GCCCompetitiveDifferentiation,
  GCCFutureReady,
  GCCDiamondModel,
  KangqoreCommandCenterDashboard,
} from './GlobalCapabilityCentersCustomSections';
import {
  TalentPhilosophyBackground,
  TalentWhySection,
  TalentProofOutcomes,
  TalentReadinessMagnet,
  TalentDiamondCoESection,
  TalentDeliveryModel,
  TalentExecutionEcosystem,
  TalentFutureReadySection,
} from './TalentOrgCustomSections';
import {
  SupplyChainControlTower,
  SupplyChainReadinessMagnet,
} from './SupplyChainCustomSections';
import {
  USMExperienceImperative,
  USMAIStatsSection,
  USMWhatWeOfferAccordion,
  USMReadinessMagnet,
  USMControlTower,
  USMExecutionEcosystem,
} from './USMCustomSections';

// ─── enterprise-integration-platform (Platforms) ───────────────────────────────
const enterprisePlatformIntegration = {
  titleLine1: 'Enterprise Platform',
  titleHighlight: 'Integration.',
  description:
    'Kangqore helps enterprises integrate legacy platforms, cloud applications, partner ecosystems, APIs, and data flows into one more connected operating environment. We combine enterprise integration architecture, hybrid connectivity, API-led interoperability, process orchestration, modernization strategy, and intelligent automation to help organizations move faster with stronger control, cleaner data exchange, and better operational continuity.',
  image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Schedule An Integration Assessment', link: '/contact' },

  stats: [
    { value: '99.9%', label: 'Platform Uptime', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '10x', label: 'Faster Integration', color: 'text-blue-400' },
    { value: 'Zero', label: 'Data Silos', color: 'text-emerald-400' },
    { value: '24/7', label: 'Integration Governance', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'ENTERPRISE PLATFORM INTEGRATION :: ARCHITECTURAL DISCIPLINE',
      titleLine1: 'Connecting',
      titleHighlight: 'Enterprise',
      titleLine2: 'Platforms at Scale',
      description:
        'Modern enterprises demand more than point-to-point connectors. They require architectural clarity, hybrid connectivity, interoperability governance, lifecycle discipline, and the ability to evolve as integration complexity expands. At Kangqore, we engineer integration ecosystems as strategic enterprise platforms.',
      bottleneckLabel: 'The Integration Trap',
      bottleneckText:
        'Fragmented platforms, brittle interfaces, duplicated data, and aging integration patterns create hidden operational friction that silently erodes enterprise agility and decision-making speed.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified integration discipline that connects legacy systems, cloud platforms, partner ecosystems, and workflow engines into one governed, scalable, and observable operating environment.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Integration Maturity',
      statusValue: 'ENTERPRISE-GRADE',
    },
    philosophy: {
      icon: <Network className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Connect with Architecture.',
      titleHighlight: 'Scale with Governance.',
      description:
        'We replace fragmented platform sprawl with architected, governed integration ecosystems designed for operational continuity and enterprise-grade confidence.',
      bgElement: <EPIPhilosophyBg />,
      pills: ['Hybrid Connectivity', 'API Governance', 'Data Continuity', 'Observable Runtime'],
      features: [
        { title: 'Interoperability Design', label: 'Platform Connectivity', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Architect integration patterns that connect legacy, cloud, and partner platforms without creating rigid point-to-point dependencies.' },
        { title: 'API-Led Integration', label: 'Governed Data Exchange', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Build API-first integration layers with lifecycle governance, security controls, and standardization across the enterprise.' },
        { title: 'Hybrid Resilience', label: 'Multi-Environment Scale', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Support on-premises, cloud, and hybrid environments with integration architectures that maintain reliability and compliance.' },
        { title: 'Runtime Observability', label: 'Operational Visibility', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Instrument integration flows with real-time monitoring, alerting, and analytics for proactive issue detection and resolution.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: EPI_V3',
      title: 'Our Execution Matrix.',
      subtext: 'A connected system for moving from platform fragmentation to governed, scalable integration architectures.',
      layers: [
        { title: 'Assess', id: 'EPI_ASS', icon: <Search />, desc: 'Understand systems, dependencies, integration pain points, workflow fragmentation, and modernization constraints.' },
        { title: 'Design', id: 'EPI_DES', icon: <Layers />, desc: 'Define the right integration architecture, interoperability model, governance controls, and platform patterns.' },
        { title: 'Connect', id: 'EPI_CON', icon: <GitBranch />, desc: 'Engineer APIs, workflows, partner exchanges, orchestration, and runtime integration flows across the estate.' },
        { title: 'Optimize', id: 'EPI_OPT', icon: <Activity />, desc: 'Improve observability, performance, governance, resilience, and long-term integration maturity over time.' },
      ],
    },
    schematic: {
      titleLine1: 'Architected Connectivity.',
      titleHighlight: 'Sustainable Scale.',
      description:
        'Your integration ecosystem should be your most reliable operational backbone. We engineer it to stay that way—across every platform change and modernization milestone.',
      stats: [
        { label: 'Integration Speed', val: '10x FASTER' },
        { label: 'Data Continuity', val: '99.9%' },
        { label: 'Governance', val: 'ABSOLUTE' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Legacy & Enterprise Application Integration',
      description: 'Connect legacy and modern enterprise applications without disrupting business continuity. We create integration models that reduce disruption, preserve the value of current enterprise assets, and improve coordinated flow of information across heterogeneous environments.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Legacy-to-modern application interoperability',
        'Middleware, adapters, and connector-led integration',
        'Cross-platform data and workflow continuity',
        'Enterprise asset preservation through integration',
      ],
      micro: 'Preserve value while connecting forward.',
    },
    {
      title: 'EDI/B2B & Process Data Integration',
      description: 'Enable secure, standards-based exchange of business documents and partner data at scale. Kangqore helps reduce cycle time, improve supply-chain coordination, and strengthen partner interoperability with standards-conscious integration patterns.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Purchase orders, invoices, and shipping document exchange',
        'Partner-system interoperability and protocol alignment',
        'Reduced manual errors and faster transaction cycles',
        'Compliance-aware B2B integration models',
      ],
      micro: 'Automate partner exchange at enterprise scale.',
    },
    {
      title: 'API Management & Governance',
      description: 'Bring control, consistency, and lifecycle discipline to API-led enterprise integration. Kangqore helps organizations operationalize API estates through governance models that improve standardization, policy control, performance visibility, and lifecycle discipline.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'API security, scaling, and monitoring controls',
        'Lifecycle governance and policy enforcement',
        'Standardization and compliance alignment',
        'Developer enablement and portal strategy',
      ],
      micro: 'Govern APIs with enterprise-grade discipline.',
    },
    {
      title: 'On-Premises to Cloud Integration',
      description: 'Create reliable sync across private infrastructure and public cloud environments. We design integration strategies that bridge private data centers and cloud environments with stronger reliability, security, and scalability.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Hybrid connectivity architecture',
        'Secure data synchronization across environments',
        'Compliance-aware integration patterns',
        'Elasticity and continuity across mixed estates',
      ],
      micro: 'Bridge private and cloud with confidence.',
    },
    {
      title: 'Digital Process Orchestration',
      description: 'Integrate systems, people, and data chains to improve execution across complex workflows. Kangqore structures orchestration layers that connect applications, people, and data into cleaner operational flows.',
      bgImage: '/images/capabilities/automation-rpa.png',
      items: [
        'Workflow automation and orchestration design',
        'System-to-system and human-in-loop coordination',
        'Timely data movement for operational decisions',
        'Better agility across business processes',
      ],
      micro: 'Orchestrate workflows for faster execution.',
    },
    {
      title: 'Serverless & Microservices-Based Integration',
      description: 'Build modular integration ecosystems that are scalable, resilient, and easier to evolve. This improves agility, reduces operational overhead, and supports change-ready ecosystems without forcing everything into one rigid platform model.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Event-driven and microservices-based integration',
        'Serverless patterns for leaner operational overhead',
        'Faster release support through modular architecture',
        'Reusable services for changing business requirements',
      ],
      micro: 'Modular, resilient, and change-ready.',
    },
    {
      title: 'Integration Modernization',
      description: 'Rationalize and modernize legacy integration estates for better governance and scale. The goal is not just migration, but a cleaner and more governable integration foundation.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Migration toward modern integration platforms',
        'iPaaS-oriented modernization strategy',
        'Platform rationalization and complexity reduction',
        'Future-ready integration operating models',
      ],
      micro: 'Modernize the integration layer with intent.',
    },
    {
      title: 'Cloud-Native / Hybrid Integration',
      description: 'Use modern integration patterns across cloud and on-premises environments with stronger flexibility. Kangqore helps balance innovation speed with continuity across mixed infrastructure landscapes.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Container-aware and service-based integration design',
        'Hybrid interoperability across deployment models',
        'Cloud-native scalability and agility enablement',
        'Consistent connectivity across distributed estates',
      ],
      micro: 'Scale natively across hybrid environments.',
    },
    {
      title: 'GenAI / ML-Driven Integration',
      description: 'Introduce intelligence into integration workflows to reduce effort and improve adaptability. This creates a more intelligent integration layer as complexity grows.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-supported mapping and transformation',
        'Data cleansing and anomaly detection support',
        'Self-healing workflow patterns',
        'Smarter operational efficiency across integrations',
      ],
      micro: 'Infuse intelligence into every integration flow.',
    },
    {
      title: 'Next-Generation Integration Engineering',
      description: 'Accelerate delivery through AI-assisted, low-code, and no-code integration engineering patterns. Kangqore uses next-generation engineering patterns to help teams move faster without lowering architectural quality.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Faster engineering cycles through assisted frameworks',
        'Low-code / no-code workflow enablement',
        'Improved maintainability and user empowerment',
        'Reduced routine engineering effort',
      ],
      micro: 'Engineer faster without sacrificing quality.',
    },
  ],

  customSections: (
    <>
      <EPIWhySection />
      <EPIIntegrationGraph />
      <EPIValueAccordion />
      <EPISolutionsCarousel />
      <EPIStrengthsBento />
    </>
  ),

  trustPillars: [
    { title: 'Architecture-first interoperability design', tag: 'Architecture', description: 'Design integration patterns that connect heterogeneous systems without creating rigid, fragile point-to-point dependencies.' },
    { title: 'API governance and lifecycle discipline', tag: 'Governance', description: 'Bring standardization, policy control, and lifecycle management to growing API and integration estates.' },
    { title: 'Hybrid and cloud-ready integration', tag: 'Scalability', description: 'Support growth across on-premises, cloud, and mixed environments without increasing operational fragility.' },
    { title: 'Modernization without disruption', tag: 'Continuity', description: 'Preserve the value of existing enterprise assets while creating modern integration layers around them.' },
    { title: 'Secure data exchange and compliance', tag: 'Security', description: 'Protect every integration flow with hardened security, encryption, and compliance-aware patterns.' },
    { title: 'Observable, intelligent integration operations', tag: 'Intelligence', description: 'Instrument integration estates with monitoring, analytics, and AI-assisted operational efficiency.' },
  ],

  whyKangqoreIntro: 'Kangqore approaches enterprise integration as both an architecture discipline and a business enablement layer. We do not just connect systems—we help organizations reduce operational fragmentation, preserve existing platform value, modernize with intent, and build interoperability models that stay manageable as complexity increases.',
  whyKangqore: [
    { title: 'Continuity Without Stagnation', description: 'We help modernize the enterprise without forcing unnecessary disruption to systems that still carry business value.', icon: Layers },
    { title: 'Architecture-Led Interoperability', description: 'We design integration patterns that connect applications, APIs, data, and workflows with stronger structure and less long-term fragility.', icon: ShieldCheck },
    { title: 'Built for Scale and Governance', description: 'We balance flexibility with control so expanding integration estates remain observable, standardized, and secure.', icon: Server },
  ],

  industries: [
    { name: 'Healthcare', description: 'Interoperable patient-data exchange, HIE integration, and compliance-aware connectivity for healthcare systems.' },
    { name: 'Financial Services', description: 'Secure payment gateway integration, ACH/SWIFT connectivity, and regulatory-compliant data exchange.' },
    { name: 'Logistics', description: 'End-to-end TMS/WMS/ERP integration for real-time visibility and operational coordination.' },
    { name: 'E-commerce', description: 'Marketplace integration, multi-channel synchronization, and scalable order-to-fulfillment workflows.' },
  ],

  customFAQs: [
    { question: 'What is enterprise platform integration?', answer: 'It is the practice of connecting enterprise applications, data flows, APIs, partner systems, and workflows so they can operate as part of a more unified, interoperable business environment.' },
    { question: 'Why is integration important for digital transformation?', answer: 'Because transformation fails when systems remain disconnected. Integration enables continuity between legacy and modern platforms, improves data movement, and helps business processes operate with less friction.' },
    { question: 'Can you integrate legacy systems without replacing them?', answer: 'Yes. In many cases, the right approach is to preserve useful systems while creating modern integration layers around them so they can continue to add value.' },
    { question: 'What is the difference between API integration and enterprise integration?', answer: 'API integration is one important part of enterprise integration. Enterprise integration is broader and can include workflows, EDI/B2B exchange, orchestration, legacy connectivity, partner ecosystems, and hybrid platform interoperability.' },
    { question: 'Do you support hybrid and cloud integration models?', answer: 'Yes. Kangqore supports on-premises, cloud-native, and hybrid integration patterns depending on business constraints, security needs, and modernization goals.' },
    { question: 'Can AI be used inside integration workflows?', answer: 'Yes, selectively. AI and ML can improve mapping, cleansing, anomaly detection, workflow adaptation, and other intelligent process areas when there is a clear operational benefit.' },
    { question: 'How do you govern large integration estates?', answer: 'Through architecture standards, API lifecycle discipline, monitoring, policy enforcement, version control, and runtime observability across the integration ecosystem.' },
  ],
};

// ─── pimcore (Platforms) ───────────────────────────────────────────────────────
const pimcore = {
  titleLine1: 'Pimcore',
  titleHighlight: 'Services.',
  description:
    'Kangqore helps enterprises use Pimcore to centralize fragmented product information, master data, digital assets, commerce workflows, and digital experiences into one more connected operating model. We combine platform strategy, implementation, integration, AI-enabled enrichment, workflow automation, and managed support to help organizations reduce silos, improve data quality, accelerate launches, and deliver more consistent customer experiences.',
  image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Schedule A Pimcore Assessment', link: '/contact' },

  stats: [
    { value: 'Unify', label: 'Product, master, and digital asset data', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Enrich', label: 'Data quality, workflows, and AI-assisted content', color: 'text-blue-400' },
    { value: 'Accelerate', label: 'Commerce, catalog, and launch operations', color: 'text-emerald-400' },
    { value: 'Personalize', label: 'Omnichannel experiences at scale', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'PIMCORE :: PLATFORM STRATEGY',
      titleLine1: 'Centralizing',
      titleHighlight: 'Enterprise',
      titleLine2: 'Data & Experience',
      description:
        'Modern enterprises need more than scattered tools. They need a unifying platform for product data, master records, digital assets, commerce content, and customer experiences. Kangqore helps organizations use Pimcore to build that unified foundation with discipline and scale in mind.',
      bottleneckLabel: 'The Data Chaos',
      bottleneckText:
        'Fragmented product data, disconnected master records, scattered digital assets, and siloed commerce systems create hidden operational drag, slower launches, weaker governance, and inconsistent customer experiences.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified Pimcore foundation that connects product information, master data, digital assets, commerce operations, and experience delivery into one governed, scalable platform model.',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Platform Maturity',
      statusValue: 'UNIFIED',
    },
    philosophy: {
      icon: <Database className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Unify with Structure.',
      titleHighlight: 'Scale with Governance.',
      description:
        'We replace fragmented data sprawl with a governed, connected platform model designed for enterprise-scale data, commerce, and experience operations.',
      pills: ['Data Governance', 'Platform Strategy', 'AI-Enrichment', 'Omnichannel Ready'],
      features: [
        { title: 'Data Unification', label: 'Connected Operating Layer', icon: <Database className="w-5 h-5 text-gray-400" />, content: 'Bring product information, master data, and digital assets into one governed foundation that serves the entire enterprise.' },
        { title: 'Workflow Discipline', label: 'Automated Enrichment', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Structure approval flows, data enrichment, publishing, and localization into repeatable, automated processes.' },
        { title: 'Commerce Continuity', label: 'Connected Experiences', icon: <ShoppingCart className="w-5 h-5 text-gray-400" />, content: 'Connect rich product data, media, pricing, and personalized content into more effective digital commerce journeys.' },
        { title: 'Platform Governance', label: 'Enterprise Control', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Support auditability, access control, stewardship, and master-record discipline across the platform.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: PIMCORE_V4',
      title: 'Our Execution Matrix.',
      subtext: 'A connected system for moving from data fragmentation to governed, scalable Pimcore operations.',
      layers: [
        { title: 'Assess', id: 'PIM_ASSESS', icon: <Search />, desc: 'Platform assessment, use-case discovery, and architecture alignment.' },
        { title: 'Design', id: 'PIM_DESIGN', icon: <Layers />, desc: 'Data modeling, workflow planning, governance design, and roadmap definition.' },
        { title: 'Implement', id: 'PIM_IMPL', icon: <Server />, desc: 'PIM, MDM, DAM, commerce, and DXP implementation with integration engineering.' },
        { title: 'Evolve', id: 'PIM_EVOLVE', icon: <Activity />, desc: 'Managed services, optimization, enhancement, and continuous platform evolution.' },
      ],
    },
    schematic: {
      titleLine1: 'Governed Data.',
      titleHighlight: 'Scalable Platform.',
      description: 'Your Pimcore investment should generate compounding business returns. We engineer the platform model that makes it measurable and sustained.',
      stats: [
        { label: 'Data Quality', val: 'GOVERNED' },
        { label: 'Time-to-Market', val: 'ACCELERATED' },
        { label: 'Platform Scale', val: 'EXTENSIBLE' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities Across Pimcore Products.',
  capabilities: [
    {
      title: 'Product Information Management + GenAI',
      description: 'Kangqore helps enterprises combine Pimcore PIM with Generative AI to improve the speed and quality of product content operations. This can support enrichment, description generation, onboarding acceleration, data validation, and better consistency across large catalogs and multi-market environments.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-assisted product content generation',
        'Product data accuracy and completeness improvement',
        'Automated mapping, validation, and onboarding support',
        'Localized and more consistent product experiences',
      ],
      micro: 'Use AI to enrich product data faster.',
    },
    {
      title: 'Product Information Management (PIM)',
      description: 'We help organizations turn fragmented product information into a governed, channel-ready product operating model. Kangqore uses Pimcore PIM to improve catalog quality, accelerate launch cycles, streamline approvals, and support richer product storytelling across digital touchpoints.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Product-data modeling and enrichment',
        'Workflow and approval automation',
        'ERP, CRM, supplier, and channel integration',
        'Localization and omnichannel publishing support',
      ],
      micro: 'Centralize and govern product information.',
    },
    {
      title: 'Master Data Management (MDM)',
      description: 'Kangqore helps enterprises use Pimcore MDM to reduce duplication, improve governance, and unify fragmented master data across domains. The outcome is a stronger source of truth for business operations, analytics, compliance, and decision-making.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Golden-record management',
        'Multi-domain master data support',
        'Governance and stewardship workflows',
        'Better integration with enterprise systems',
      ],
      micro: 'Create trusted, unified master records.',
    },
    {
      title: 'Digital Asset Management (DAM)',
      description: 'We help brands use Pimcore DAM to manage media assets more intelligently across teams, channels, and campaigns. Kangqore structures DAM around discoverability, reuse, governance, workflow, and scalable content operations so experiences stay consistent without slowing teams down.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Metadata and tagging frameworks',
        'Asset portals and self-service access',
        'Editorial workflow and lifecycle control',
        'Media transformation and multi-format delivery',
      ],
      micro: 'Centralize, govern, and reuse digital assets.',
    },
    {
      title: 'eCommerce',
      description: "Kangqore uses Pimcore's commerce framework to help businesses connect catalog depth, pricing complexity, content, and customer experience into stronger digital commerce journeys. This is especially valuable when product complexity, regional variation, or B2B workflows outgrow simpler commerce stacks.",
      bgImage: '/images/capabilities/ecommerce.png',
      items: [
        'B2B and B2C commerce architecture',
        'PIM-first commerce foundations',
        'Content commerce and storefront enablement',
        'Omnichannel shopping and product experience support',
      ],
      micro: 'Build data-rich, scalable commerce experiences.',
    },
    {
      title: 'Digital Experience Platform (DXP / CMS)',
      description: 'We help organizations use Pimcore DXP to manage and deliver more adaptive digital experiences across websites, portals, campaigns, and customer interactions. Kangqore focuses on making experience delivery more flexible, scalable, and responsive to changing customer expectations.',
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        'Headless or hybrid content delivery models',
        'AI-driven personalization strategy',
        'Contextual engagement across touchpoints',
        'Experience orchestration with scale in mind',
      ],
      micro: 'Compose contextual digital experiences.',
    },
  ],

  customSections: (
    <>
      <PimWhySection />
      <PimValueAccordion />
      <PimProblemsGrid />
      <PimHowWeHelp />
      <PimArchitectureSchematic />
      <PimUseCasesCarousel />
      <PimBenefitsGrid />
    </>
  ),

  trustPillars: [
    { title: 'Unified product and master data layer', tag: 'Data', description: 'Centralize fragmented information into one governed, channel-ready source of truth.' },
    { title: 'AI-assisted enrichment and automation', tag: 'Intelligence', description: 'Use AI to improve product content, mapping, validation, and operational efficiency.' },
    { title: 'End-to-end commerce enablement', tag: 'Commerce', description: 'Connect PIM-first data foundations into scalable B2B and B2C commerce experiences.' },
    { title: 'Governed digital asset operations', tag: 'Assets', description: 'Manage media centrally with workflows, metadata, and brand-consistent delivery.' },
    { title: 'Omnichannel experience delivery', tag: 'Experience', description: 'Compose and deliver contextual digital experiences across channels with personalization.' },
    { title: 'Platform-led scalability', tag: 'Scale', description: 'Architect for multi-market, multilingual, and multi-channel growth from day one.' },
  ],

  whyKangqore: [
    { title: 'Platform-Led Thinking', description: 'We shape Pimcore around business workflows, data governance, and experience delivery—not around isolated feature configuration.', icon: BrainCircuit },
    { title: 'Built Across the Full Value Chain', description: 'From product data and master data to assets, commerce, and digital experience, we connect the full operating picture.', icon: Network },
    { title: 'Execution with Evolution in Mind', description: 'We design for adoption, scale, integration, and managed growth so the platform remains valuable after launch.', icon: Activity },
  ],

  industries: [
    { name: 'Manufacturing', description: 'Product data governance, multi-channel catalog management, and B2B commerce enablement.' },
    { name: 'Retail & Consumer Goods', description: 'Omnichannel product experiences, DAM centralization, and personalized shopping journeys.' },
    { name: 'Distribution & Wholesale', description: 'Unified product data, dealer portals, and eStore platform enablement.' },
    { name: 'Healthcare & Life Sciences', description: 'Regulated content management, master data governance, and compliant digital experiences.' },
  ],

  customFAQs: [
    { question: 'What is Pimcore and why do enterprises use it?', answer: 'Pimcore is used to centralize and manage product information, digital assets, master data, commerce content, and digital experiences in one connected platform environment.' },
    { question: 'What Pimcore services does Kangqore provide?', answer: 'Kangqore provides strategy, implementation, integration, AI-assisted enrichment, workflow design, and managed services across the Pimcore ecosystem.' },
    { question: 'Can Pimcore support both B2B and B2C use cases?', answer: 'Yes. It is well suited to product-rich, catalog-heavy, content-connected digital commerce and experience use cases across both B2B and B2C environments.' },
    { question: 'Can Pimcore integrate with ERP, CRM, eCommerce, and marketplace systems?', answer: 'Yes. A strong Pimcore engagement should include secure, scalable integration patterns across the broader enterprise stack.' },
    { question: 'Is Pimcore suitable for global catalogs and multi-market operations?', answer: 'Yes, especially when multilingual product data, localization, workflow governance, and cross-channel publishing are important.' },
    { question: 'How does AI fit into the Pimcore model?', answer: 'AI can help with product-content generation, enrichment, mapping, validation, personalization, and operational efficiency when used in the right business context.' },
    { question: 'What is the difference between PIM and MDM inside the Pimcore ecosystem?', answer: 'PIM focuses on product information and channel-ready enrichment, while MDM focuses more broadly on trusted core records across multiple enterprise domains.' },
    { question: 'How do you ensure Pimcore stays valuable after go-live?', answer: 'Through governance, integration discipline, workflow optimization, performance support, managed services, and a roadmap for continuous platform evolution.' },
  ],
};

// ─── salesforce (Platforms) ────────────────────────────────────────────────────
const salesforce = {
  titleLine1: 'Salesforce',
  titleHighlight: 'Services.',
  description:
    'Kangqore helps enterprises turn Salesforce into a true growth and relationship platform. We combine strategy, implementation, integration, migration, customization, Lightning modernization, and cloud-specific execution across Sales, Service, Community, Commerce, and Marketing Cloud to create more connected customer experiences, faster operations, stronger team productivity, and measurable business outcomes.',
  image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Schedule A Salesforce Assessment', link: '/contact' },
  secondaryButton: { text: 'Talk To Our Experts', link: '#capabilities' },

  stats: [
    { value: 'Connect', label: 'Customers, teams, channels, and systems', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Sell', label: 'Pipeline, forecasting, and opportunity velocity', color: 'text-blue-400' },
    { value: 'Serve', label: 'Faster support, better case handling, higher loyalty', color: 'text-emerald-400' },
    { value: 'Personalize', label: 'Journeys, campaigns, and commerce experiences', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'SALESFORCE :: CONNECTED OPERATIONS',
      titleLine1: 'Connect every',
      titleHighlight: 'Customer',
      titleLine2: 'Touchpoint',
      description:
        'Customer growth slows when sales, service, engagement, and commerce operate in disconnected silos. Kangqore connects your Salesforce ecosystem to orchestrate value across the entire lifecycle.',
      bottleneckLabel: 'The Challenge',
      bottleneckText:
        'Disconnected systems, fragmented customer views, manual processes, and weak workflow continuity reduce sales momentum, service quality, and marketing effectiveness.',
      requirementLabel: 'The Advantage',
      requirementText:
        'A well-architected Salesforce ecosystem improves customer visibility, process orchestration, speed-to-response, cross-functional collaboration, and experience consistency.',
      image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Platform Synergy',
      statusValue: '100% CONNECTED',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Connect with Clarity.',
      titleHighlight: 'Scale with Purpose.',
      description:
        'We replace fragmented CRM silos with a unified, connected Salesforce ecosystem designed for long-term growth and operational excellence.',
      bgElement: <SalesforcePhilosophyBackground />,
      pills: ['Strategy-First', 'Connected Clouds', 'Modernized UX', 'Governed Data'],
      features: [
        { title: 'Connected Strategy', label: 'Outcome-Driven Planning', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Design Salesforce around revenue, service, and engagement outcomes—not just isolated cloud module activation.' },
        { title: 'Experience Design', label: 'Low-Friction Productivity', icon: <Layout className="w-5 h-5 text-gray-400" />, content: 'Modernize how your teams interact with the platform through Lightning-led UX, custom LWC, and mobile-optimized flows.' },
        { title: 'Integration Rigor', label: 'Ecosystem Connectivity', icon: <Network className="w-5 h-5 text-gray-400" />, content: 'Connect Salesforce to ERP, legacy systems, and external apps so information flows reliably across the whole enterprise.' },
        { title: 'Governed Evolution', label: 'Scalable Platform Maturity', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Treat Salesforce as a living asset that matures through continuous improvement, performance oversight, and roadmap discipline.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: SF_V2',
      title: 'Our Salesforce Matrix.',
      subtext: 'A structured model for moving from cloud silos to a connected, scalable ecosystem.',
      layers: [
        { title: 'Assess', id: 'SF_ASS', icon: <Search />, desc: 'Assess customer journeys, cloud-fit, and process gaps to define the right Salesforce transformation roadmap.' },
        { title: 'Architect', id: 'SF_ARC', icon: <Layers />, desc: 'Design the solution model, data flows, and experience architecture for a connected, adopted platform.' },
        { title: 'Implement', id: 'SF_IMP', icon: <Server />, desc: 'Configure, integrate, and launch with precision across Sales, Service, Marketing, and Commerce cloud.' },
        { title: 'Optimize', id: 'SF_OPT', icon: <Activity />, desc: 'Sustain momentum through continuous refinement, analytics improvement, and roadmap execution.' },
      ],
    },
    schematic: {
      titleLine1: 'Connected Value.',
      titleHighlight: 'Sustainable Growth.',
      description: 'Your Salesforce environment is a growth engine. We engineer it to scale with your business—across every cloud module and customer milestone.',
      stats: [
        { label: 'Adoption Rate', val: '+45%' },
        { label: 'Sales Velocity', val: '+30%' },
        { label: 'Service Speed', val: '+50%' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Salesforce Strategy & Advisory',
      description: 'This capability is focused on making better decisions before implementation begins. Kangqore works with stakeholders to understand customer journeys, process gaps, operating friction, and transformation priorities, then translates that into a practical Salesforce roadmap. Instead of jumping straight into tools or cloud modules, we define what should be implemented, in what sequence, and why it matters to business outcomes.',
      bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
      items: ['Business process and CRM assessment', 'Cloud-fit and capability mapping', 'Operating model and roadmap design', 'Prioritization for speed and value'],
      micro: 'Shape the right Salesforce roadmap before complexity, cost, and customization begin to compound. We help organizations align business goals, customer operations, and platform decisions early so Salesforce is designed with clarity, not guesswork.',
    },
    {
      title: 'Salesforce Implementations',
      description: 'This capability covers end-to-end Salesforce implementation across key business functions. Kangqore configures the platform in a way that respects standard Salesforce strengths while tailoring the setup to real business workflows, user needs, and operational priorities. The goal is not only to go live, but to ensure the platform is actually usable, scalable, and ready to support team adoption from day one.',
      bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
      items: ['OOB configuration and solution setup', 'Business-specific implementation planning', 'Cloud rollout across functional teams', 'Adoption-ready deployment execution'],
      micro: 'Launch Salesforce clouds with the right mix of standard configuration and business-fit customization. We help enterprises move from platform intent to real operational use with cleaner setup, stronger adoption, and faster delivery confidence.',
    },
    {
      title: 'Salesforce Integrations',
      description: 'Salesforce becomes far more valuable when it is connected to the systems around it. Kangqore helps enterprises integrate Salesforce with ERP platforms, legacy systems, customer-facing apps, middleware layers, partner systems, and external tools so information flows more reliably across the business. This improves visibility, reduces duplication, and supports more connected experiences across sales, service, and engagement functions.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      items: ['API-led and middleware integration', 'OOB connectors and AppExchange connectivity', 'Legacy and third-party system integration', 'Multi-channel process continuity'],
      micro: 'Connect Salesforce cleanly into enterprise platforms, channels, and data flows. We design integration models that reduce siloed operations, improve data continuity, and help Salesforce work as part of the wider digital ecosystem.',
    },
    {
      title: 'Salesforce Data Migration',
      description: 'Migration is not just about moving records from one place to another. It requires careful analysis of source structures, target models, data quality issues, duplication risks, and business-critical dependencies. Kangqore approaches Salesforce migration as a structured transformation exercise—helping ensure the new environment starts with cleaner, more reliable, and more usable data that supports both users and downstream processes.',
      bgImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80',
      items: ['Org-to-org and legacy-to-cloud migration', 'Data model difference analysis', 'Deduplication and integrity assurance', 'Fast, reliable migration execution'],
      micro: 'Move data with stronger integrity, consistency, and transformation discipline. We help organizations migrate from older environments into Salesforce without compromising trust, usability, or operational continuity.',
    },
    {
      title: 'Classic-to-Lightning Modernization',
      description: 'This capability is designed for organizations still operating on older Salesforce experiences or carrying legacy user friction. Kangqore helps assess readiness for Lightning modernization, define the migration approach, and improve how teams interact with the platform across desktop, console, and mobile environments. The outcome is a more modern interface, better usability, and a stronger foundation for future enhancements using Lightning and LWC.',
      bgImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
      items: ['Lightning migration assessment', 'Roadmap and modernization planning', 'LWC-oriented experience upgrade', 'UI, mobile, and console optimization'],
      micro: 'Modernize Salesforce UX and productivity through a more scalable Lightning-led architecture. We help organizations move beyond legacy UI limitations and unlock a faster, more flexible, and more modern user experience.',
    },
    {
      title: 'Salesforce Analytics & Reporting',
      description: 'A Salesforce environment only creates real value when decision-makers can see what is happening inside it. Kangqore designs dashboards, reporting structures, KPI views, and business insight layers that make data more usable for managers, teams, and leadership. This helps organizations monitor pipeline health, service efficiency, productivity, and customer trends with greater clarity and speed.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      items: ['Real-time dashboards and reporting', 'Productivity and performance insights', 'Pipeline and service trend visibility', 'Better decision support for business teams'],
      micro: 'Turn Salesforce data into actionable visibility across sales, service, and customer operations. We help enterprises move beyond passive reporting and create insight layers that support better decisions, faster responses, and stronger performance management.',
    },
    {
      title: 'Salesforce Customization & Experience Design',
      description: 'Not every business can rely on a standard platform setup. Kangqore customizes Salesforce to better reflect your operating model, process requirements, approval structures, and user expectations. We also focus on experience design—ensuring workflows, screens, and interactions support productivity rather than create friction. The result is a Salesforce environment that feels purpose-built instead of over-generic.',
      bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      items: ['Business-fit process customization', 'Experience design for users and teams', 'Low-friction workflow enablement', 'Scalable feature and UI tailoring'],
      micro: 'Extend Salesforce to fit your workflows, user experiences, and business differentiation. We shape the platform around how your teams actually work so it feels more intuitive, more relevant, and more effective in daily use.',
    },
    {
      title: 'Managed Salesforce Evolution',
      description: 'Salesforce transformation does not stop at implementation. Business needs evolve, user behavior changes, reporting expectations expand, and new opportunities emerge over time. Kangqore supports the platform post-launch through continuous improvement, roadmap execution, issue resolution, performance optimization, and feature refinement—so Salesforce keeps generating value instead of becoming stagnant.',
      bgImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
      items: ['Continuous platform improvement', 'Managed performance and issue support', 'Feature evolution and roadmap execution', 'Long-term adoption and value realization'],
      micro: 'Keep the platform improving after go-live through structured optimization and support. We help enterprises sustain momentum through ongoing enhancement, performance oversight, and continuous platform maturity.',
    },
  ],

  customSections: (
    <>
      <SalesforceWhySection />
      <SalesforceDiamondCoESection />
      <SalesforceValueDeliver />
      <SalesforceDeliveryModel />
      <SalesforceFutureReadySection />
      <SalesforceExecutionEcosystem />
    </>
  ),

  trustPillars: [
    { title: 'Business-Led CRM Thinking', tag: 'Strategy', description: 'We design Salesforce around revenue, service, engagement, and operating outcomes—not isolated feature activation.' },
    { title: 'Connected Execution Across Clouds', tag: 'Ecosystem', description: 'We connect Sales, Service, Community, Commerce, and Marketing Cloud into a more coherent enterprise model.' },
    { title: 'Modernization with Control', tag: 'Architecture', description: 'From Lightning modernization to integration and migration, we reduce disruption while improving long-term value.' },
  ],

  whyKangqore: [
    { title: 'Business-Led CRM Thinking', description: 'We design Salesforce around revenue, service, engagement, and operating outcomes—not isolated feature activation.', icon: Zap },
    { title: 'Connected Execution Across Clouds', description: 'We connect Sales, Service, Community, Commerce, and Marketing Cloud into a more coherent enterprise model.', icon: Cloud },
    { title: 'Modernization with Control', description: 'From Lightning modernization to integration and migration, we reduce disruption while improving long-term platform value.', icon: CheckCircle2 },
  ],

  industries: [
    { name: 'Financial Services', description: 'Unified customer views and strict security across banking and insurance operations.' },
    { name: 'Retail & Commerce', description: 'Omnichannel personalization bridging Commerce Cloud and Marketing Cloud.' },
    { name: 'Manufacturing', description: 'Streamlined B2B sales pipelines and responsive dealer/partner communities.' },
    { name: 'Healthcare', description: 'Connected patient journeys prioritizing compliance and fast service response.' },
  ],

  customFAQs: [
    { question: 'What Salesforce services does Kangqore provide?', answer: 'Kangqore provides Salesforce advisory, implementation, integration, migration, Lightning modernization, analytics, customization, and cloud-specific transformation support.' },
    { question: 'Which Salesforce clouds do you work across?', answer: 'Sales Cloud, Service Cloud, Community Cloud, Commerce Cloud, and Marketing Cloud.' },
    { question: 'Do you support Salesforce integration with enterprise systems?', answer: 'Yes. Integration is a core part of our offering, including APIs, middleware, OOB connectors, AppExchange, and legacy or third-party systems.' },
    { question: 'Can you help migrate existing Salesforce or legacy environments?', answer: 'Yes. We cover org-to-org and legacy-to-Salesforce migration with integrity, consistency, and deduplication in focus.' },
    { question: 'Do you support Lightning and LWC modernization?', answer: 'Yes. We explicitly support Lightning and LWC capabilities and Classic-to-Lightning modernization to improve UX and performance.' },
    { question: 'How does Salesforce improve service operations?', answer: 'The Service Cloud focuses on unified visibility, dashboards, support metrics, faster responses, self-service communities, and stronger customer loyalty.' },
    { question: 'How does Salesforce improve sales execution?', answer: 'The Sales Cloud focuses on customer visibility, opportunity tracking, reporting, analytics, and faster deal movement.' },
    { question: 'How does Salesforce support commerce and marketing?', answer: 'The Commerce Cloud focuses on omnichannel commerce and shared commerce operations, while the Marketing Cloud focuses on personalized customer journeys, lifecycle engagement, and cross-channel activation.' },
  ],
};

// ─── servicenow (Platforms) ────────────────────────────────────────────────────
const servicenow = {
  titleLine1: 'ServiceNow',
  titleHighlight: 'Transformation.',
  description:
    'Kangqore helps enterprises turn ServiceNow into a connected operating layer for IT, employee, customer, and platform workflows. We combine advisory, implementation, integration, automation, security, service operations, and managed evolution to help organizations reduce process friction, improve service visibility, and modernize enterprise operations without creating platform sprawl.',
  image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Schedule A ServiceNow Assessment', link: '/contact' },
  secondaryButton: { text: 'Talk To Our Experts', link: '#capabilities' },

  stats: [
    { value: 'Standardize', label: 'Service operations, controls, and delivery models', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Automate', label: 'Enterprise workflows with less manual effort', color: 'text-blue-400' },
    { value: 'Integrate', label: 'Systems, data, and platform experiences cleanly', color: 'text-emerald-400' },
    { value: 'Scale', label: 'ServiceNow value across business functions', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'SERVICENOW :: WORKFLOW ORCHESTRATION',
      titleLine1: 'Orchestrating',
      titleHighlight: 'Connected',
      titleLine2: 'Enterprise Workflows',
      description:
        'Enterprise service platforms demand more than ticket routing. They require workflow standardization, platform governance, integration maturity, and the ability to evolve as organizational complexity grows. At Kangqore, we engineer ServiceNow as a connected enterprise operating layer.',
      bottleneckLabel: 'The Challenge',
      bottleneckText:
        'Siloed processes, manual workflows, inconsistent governance, and weak tool adoption prevent organizations from realizing the full value of their ServiceNow investment. Without structured platform discipline, service environments become liabilities instead of assets.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified transformation discipline that connects workflow design, service standardization, security operations, and integration management into one cohesive, scalable enterprise platform.',
      image: 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Workflow Maturity',
      statusValue: '100% GOVERNED',
    },
    philosophy: {
      icon: <Settings className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Standardize with Clarity.',
      titleHighlight: 'Scale with Purpose.',
      description:
        'We replace fragmented service silos with architected, governed workflow platforms designed for absolute operational confidence.',
      bgElement: <ServicenowPhilosophyBackground />,
      pills: ['Workflow Discipline', 'Service Standardization', 'Security-First', 'Platform Evolution'],
      features: [
        { title: 'Workflow Discipline', label: 'Operational Standardization', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Structure ServiceNow around real operating models, governance needs, and workflow maturity to create a disciplined service environment.' },
        { title: 'Platform Connectedness', label: 'Enterprise Integration', icon: <Network className="w-5 h-5 text-gray-400" />, content: 'Integrate ServiceNow into broader enterprise systems, APIs, and data layers instead of allowing new operational silos.' },
        { title: 'Security Operations', label: 'Governance & Compliance', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Build workflow-driven handling of security incidents, GRC processes, and compliance evidence for stronger enterprise resilience.' },
        { title: 'Managed Evolution', label: 'Long-Term Value', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Support long-term platform maturity through continuous optimization, adoption management, and roadmap execution.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: SNOW_V2',
      title: 'Our Execution Matrix.',
      subtext: 'A connected system for moving from fragmented service tools to a governed, scalable enterprise workflow platform.',
      layers: [
        { title: 'Assess', id: 'SN_ASS', icon: <Search />, desc: 'Evaluate workflows, service maturity, pain points, governance gaps, and platform opportunity areas.' },
        { title: 'Design', id: 'SN_DES', icon: <Layers />, desc: 'Define roadmap, module priorities, workflow architecture, integration needs, and delivery approach.' },
        { title: 'Implement', id: 'SN_IMP', icon: <Server />, desc: 'Configure, extend, integrate, automate, and launch ServiceNow capabilities across the enterprise.' },
        { title: 'Operate', id: 'SN_OPR', icon: <Activity />, desc: 'Support adoption, optimize workflows, manage improvements, and expand platform value over time.' },
      ],
    },
    schematic: {
      titleLine1: 'Governed Workflows.',
      titleHighlight: 'Sustained Value.',
      description: 'Your ServiceNow environment should be your most reliable enterprise operating layer. We engineer it to scale with your business—across every workflow domain and service milestone.',
      stats: [
        { label: 'Manual Effort', val: '-60%' },
        { label: 'Service Visibility', val: '+45%' },
        { label: 'Platform ROI', val: '+50%' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'IT Service & Operations Management',
      description: 'Modernize core IT service delivery with better control, visibility, and operational consistency. This capability focuses on making IT services more structured, measurable, and responsive—building a stronger service operating backbone so incidents, requests, infrastructure events, and asset visibility are handled through a more unified model.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { heading: 'IT Service Management (ITSM)', description: 'Standardize incident, request, problem, and change workflows so service delivery becomes more reliable and easier to govern.' },
        { heading: 'IT Operations Management (ITOM)', description: 'Improve infrastructure and operations visibility through smarter monitoring, event handling, and operational response models.' },
        { heading: 'IT Asset Management (ITAM)', description: 'Create better lifecycle visibility into hardware, software, and enterprise technology assets to improve cost control and planning.' },
        { heading: 'Operational Standardization', description: 'Align service processes to stronger operating discipline and reduce fragmentation across teams and tools.' },
        { heading: 'Better Service Visibility', description: 'Give leadership and operations teams a clearer view of service health, asset state, and operational bottlenecks.' },
      ],
      micro: 'Structured IT services that scale with enterprise complexity.',
    },
    {
      title: 'Security Management',
      description: 'Strengthen enterprise resilience through ServiceNow-led security operations and governance workflows. This capability uses ServiceNow not just for IT tickets, but as a structured control layer for security-related process management—creating more disciplined workflows for incident response, governance tracking, compliance evidence, and operational accountability.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        { heading: 'Security Operations', description: 'Build workflow-driven handling of security issues, incidents, escalations, and remediation actions.' },
        { heading: 'Governance, Risk & Compliance (GRC)', description: 'Support policy enforcement, audit readiness, exception management, and control tracking through structured workflows.' },
        { heading: 'Compliance-Led Visibility', description: 'Improve traceability across security actions, approvals, and governance activities.' },
        { heading: 'Risk Reduction Through Process Discipline', description: 'Reduce gaps created by manual handoffs, inconsistent controls, or weak operational ownership.' },
        { heading: 'Security in Enterprise Workflows', description: 'Bring security and compliance closer to day-to-day operational execution instead of treating them as isolated review layers.' },
      ],
      micro: 'Security woven into the operational fabric.',
    },
    {
      title: 'Enterprise Service Management',
      description: 'Extend ServiceNow beyond IT to support customer, employee, and business workflow modernization. This capability is broader than classic ITSM—positioning ServiceNow as an enterprise workflow transformation platform where it supports not only IT teams, but also employee experiences, service operations, customer-facing processes, and internal business services.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        { heading: 'Customer Service Management', description: 'Improve service coordination and responsiveness across customer-facing support journeys.' },
        { heading: 'Onboarding and Transitions', description: 'Digitize employee, vendor, or internal transition workflows so processes move faster with fewer delays and handoff issues.' },
        { heading: 'Custom Applications', description: 'Build tailored workflow apps for business-specific service needs that standard modules do not fully cover.' },
        { heading: 'Cross-Functional Workflow Enablement', description: 'Connect departments through shared service models instead of isolated manual processes.' },
        { heading: 'Enterprise-Wide Service Consistency', description: 'Create a more unified experience across service requests, approvals, fulfillment, and support delivery.' },
      ],
      micro: 'ServiceNow as an enterprise-wide workflow layer.',
    },
    {
      title: 'Integration Management',
      description: 'Connect ServiceNow with enterprise systems, APIs, and platform extensions to reduce silos and increase workflow continuity. This is the platform-connectivity layer: the part that ensures ServiceNow does not sit alone, but works as part of a larger enterprise ecosystem through integrations, API exposure, app-led extension, and cleaner interoperability.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        { heading: 'App Engine Enablement', description: 'Extend platform value by building business-fit workflow applications on top of ServiceNow.' },
        { heading: 'REST API Integration', description: 'Connect ServiceNow cleanly with enterprise applications, data sources, and workflow services.' },
        { heading: 'App Store / Ecosystem Leverage', description: 'Accelerate capability adoption through reusable apps, accelerators, and packaged extensions.' },
        { heading: 'Third-Party System Connectivity', description: 'Reduce silos by integrating ServiceNow with surrounding business and IT platforms.' },
        { heading: 'Workflow Continuity Across Systems', description: 'Ensure data, events, and process actions move more smoothly across the enterprise environment.' },
      ],
      micro: 'ServiceNow connected to the full enterprise stack.',
    },
  ],

  customSections: (
    <>
      <ServicenowWhySection />
      <ServicenowDiamondCoESection />
      <ServicenowValueDeliver />
      <ServicenowDeliveryModel />
      <ServicenowFutureReadySection />
      <ServicenowExecutionEcosystem />
    </>
  ),

  trustPillars: [
    { title: 'Workflow discipline before platform expansion', tag: 'Governance', description: 'Structure ServiceNow around real operating models, governance needs, and workflow maturity.' },
    { title: 'Enterprise integration over new silos', tag: 'Architecture', description: 'Connect ServiceNow into broader enterprise systems instead of creating isolated platform islands.' },
    { title: 'Automation with governance and visibility', tag: 'Operations', description: 'Use workflow automation to reduce manual friction while preserving governance, security, and compliance.' },
  ],

  whyKangqore: [
    { title: 'Workflow Discipline', description: 'We structure ServiceNow around real operating models, governance needs, and workflow maturity—not just module activation.', icon: Layers },
    { title: 'Platform Connectedness', description: 'We integrate ServiceNow into broader enterprise systems instead of allowing new operational silos to form.', icon: Network },
    { title: 'Automation with Control', description: 'We use workflow automation to reduce manual friction while preserving governance, security, and compliance visibility.', icon: ShieldCheck },
  ],

  industries: [
    { name: 'Financial Services', description: 'Governed service workflows meeting regulatory, compliance, and operational resilience requirements.' },
    { name: 'Healthcare', description: 'Standardized IT and enterprise service operations supporting clinical efficiency and compliance.' },
    { name: 'Manufacturing', description: 'Connected IT and OT service workflows improving asset visibility and operational continuity.' },
    { name: 'Technology', description: 'Scalable ITSM and platform workflows supporting rapid growth and engineering velocity.' },
  ],

  customFAQs: [
    { question: 'What does ServiceNow transformation usually include?', answer: 'It typically includes a mix of advisory, implementation, integration, automation, platform configuration, and managed support depending on the maturity of the environment and the workflows being modernized.' },
    { question: 'Which workflow areas can ServiceNow support?', answer: 'IT, customer, employee, and platform workflows, with specific capability references to ITSM, ITOM, ITAM, security operations, GRC, customer service management, onboarding, custom apps, and integration management.' },
    { question: 'Why is integration important in a ServiceNow program?', answer: 'Because value drops quickly when workflows stay disconnected. Third-party integration, data synchronization, App Engine, REST APIs, and workflow automation are central to platform effectiveness.' },
    { question: 'How does ServiceNow help reduce inefficiency?', answer: 'By standardizing processes, reducing manual effort, increasing visibility, and improving workflow alignment across service functions.' },
    { question: 'Can ServiceNow support security and compliance use cases?', answer: 'Yes. Security Operations plus Governance, Risk and Compliance is an explicit part of the ServiceNow capability set we implement.' },
    { question: 'What engagement models are possible?', answer: 'We offer fixed one-time services, fixed monthly services, staff augmentation, and core-flex style models—each tailored to the maturity and velocity of your ServiceNow program.' },
    { question: 'What outcomes should enterprises expect?', answer: 'Better service standardization, lower manual effort, improved visibility, cost optimization, and stronger value realization from platform investments.' },
  ],
};

// ─── global-capability-centers (Platforms) ─────────────────────────────────────
const globalCapabilityCenters = {
  titleLine1: 'Global',
  titleHighlight: 'Capability Centers',
  description:
    'Most first-time GCC builders spend 12-18 months before writing a single line of production code. Kangqore launches your India engineering center in 60 days — entity registered, workspace provisioned, engineers onboarded, shipping code by Day 90. You own everything. We operate everything underneath.',
  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1260&q=80',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Book a 30-Min GCC Strategy Call', link: '/contact?type=gcc-strategy' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: '60', label: 'Days to First Sprint', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '500+', label: 'Pre-Vetted Engineers', color: 'text-blue-400' },
    { value: '21', label: 'Days Avg. Time-to-Hire', color: 'text-emerald-400' },
    { value: '100%', label: 'Your Team. Your IP.', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'GCC :: STRATEGIC OPERATING EXTENSION',
      titleLine1: 'Strategic',
      titleHighlight: 'Engineering Centers',
      titleLine2: '',
      description:
        "1,900+ GCCs operate in India today, generating $66B in annual revenue across 2 million professionals. By 2030, this ecosystem will cross $110B and 2,400+ centers. The question isn't whether to build a GCC — it's whether yours will become a strategic weapon or another cost line.",
      bottleneckLabel: 'The 12-Month Trap',
      bottleneckText:
        "Most first-time GCC builders spend 12-18 months navigating entity registration, STPI/SEZ compliance, lease execution, local labor law (EPFO, ESI, Professional Tax), IT provisioning, and hiring — before a single line of production code is written. By the time the center is 'operational,' the business case has eroded.",
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'We compress this to 60 days. Entity formation through our registered company secretary, compliant workspace provisioning, AWS/Azure landing zones tunneled to your HQ, and a first unit of 8-12 engineers onboarded with domain immersion — shipping code by Day 90.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      statusLabel: 'Launch Velocity',
      statusValue: '60-DAY PLAYBOOK',
    },
    philosophy: {
      icon: <Globe className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'You Own the Team.',
      titleHighlight: 'We Own the Friction.',
      description:
        "From Day 1, your GCC team reports to you, executes your roadmap, and builds your IP. We handle every operational surface that isn't engineering: entity compliance, facility management, HR operations, payroll, and infrastructure.",
      bgElement: <GCCPhilosophyBackground />,
      pills: ['Flexible Engagement', 'IP Ownership', 'Full Team Control', 'Outcome-Based Delivery'],
      features: [
        { title: '60-Day Launch Playbook', label: 'Entity → Compliance → Infrastructure → Team', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'PAN, TAN, GST, EPFO, ESI, Professional Tax registration. STPI/SEZ compliance filing. Lease execution. IT backbone provisioning. Developer workstation deployment. First unit onboarding — all within 60 days of commercial sign-off.' },
        { title: 'Flexible Commercial Models', label: 'Outcome-Based', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Engagement models structured around your scale requirements — from dedicated team retainers to outcome-based pricing. Commercial terms designed for flexibility, not vendor lock-in. Scale up or down based on business needs.' },
        { title: 'Full-Stack Talent Engine', label: 'Pre-Built Pipelines', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'AI-led screening across Bengaluru, Hyderabad, Pune, and NCR talent pools. 500+ pre-vetted engineers across platform, cloud, AI/ML, cybersecurity, and product engineering. Average time-to-fill: 21 days for niche roles.' },
        { title: 'HQ-Grade Operating Discipline', label: 'Not an Outpost', icon: <Activity className="w-5 h-5 text-gray-400" />, content: '30/60/90 onboarding: domain immersion sprints, codebase walkthroughs, shadow rotations with your HQ leads, first independent delivery by Day 90. Agile rituals calibrated to your existing sprint cadence.' },
      ],
    },
    matrix: {
      engineId: 'THE EXECUTION FRAMEWORK',
      title: 'Kangqore Command Center.',
      subtext: 'Your India execution platform. From commercial sign-off to first production sprint in four connected phases.',
      layers: [
        { title: 'Entity & Compliance', id: 'GCC_ENT', icon: <Search />, desc: 'Company secretary engagement, PAN/TAN/GST registration, STPI/SEZ filing, state labor department registrations, bank account activation.' },
        { title: 'Infrastructure & IT', id: 'GCC_INF', icon: <Layers />, desc: 'Workspace lease + fit-out, AWS/Azure landing zone provisioning, VPN tunnels to HQ, ISMS-aligned endpoint management, production-grade developer environments.' },
        { title: 'Talent & Onboarding', id: 'GCC_TAL', icon: <Server />, desc: 'AI-led sourcing, technical screening, offer management, 30/60/90 domain immersion, codebase walkthroughs, shadow rotations with HQ leads.' },
        { title: 'Operate & Scale', id: 'GCC_OPS', icon: <Activity />, desc: 'Sprint cadence alignment, governance rituals, KPI dashboards, quarterly business reviews, elastic scaling from unit (8) to squad (25) to division (100+).' },
      ],
    },
    schematic: {
      titleLine1: 'We Build It.',
      titleHighlight: 'You Own It.',
      description:
        'The entity, the team, the codebase, the IP — yours from Day 1. Not after a 3-year BOT transition. Not after a transfer fee negotiation. Yours. Kangqore runs the operating layer underneath so your engineering leadership runs the roadmap above.',
      stats: [
        { label: 'Entity Ownership', val: 'DAY 1' },
        { label: 'IP & Codebase', val: '100% YOURS' },
        { label: 'Transfer Fees', val: 'NONE' },
        { label: 'Lock-in Period', val: 'ZERO' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities',
  capabilities: [
    {
      title: '60-Day GCC Launch Execution',
      description: 'From commercial sign-off to first engineering sprint in 60 days. Entity registration, STPI/SEZ compliance, lease execution, IT backbone provisioning, and first unit onboarding — structured as a single execution playbook, not a 12-month advisory engagement.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Entity setup & Transfer Pricing structures (Cost Plus markup) engineered upfront',
        'Pre-approved SEZ co-working incubators for immediate Day 1 engineering operations',
        'AWS/Azure landing zones with VPN tunnels to your HQ',
        'ISMS-aligned endpoint management + production-grade developer environments',
      ],
      micro: '60 days. Not 12 months.',
    },
    {
      title: 'AI/ML & GenAI Engineering Units',
      description: 'Pre-structured units of 8-12 AI/ML specialists — ML engineers, data scientists, LLMOps engineers, and NLP researchers — sourced from pre-built pipelines across Bengaluru and Hyderabad. Deployed into your sprint cadence with production deliverables from Week 6.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'GenAI Center of Excellence: LLM fine-tuning, RAG pipelines, agentic AI workflows',
        'MLOps infrastructure: MLflow, Kubeflow, model registry, A/B experimentation',
        'AI-led screening with technical depth interviews + culture alignment',
        'Average 21-day time-to-fill for ML roles that take 60+ days conventionally',
      ],
      micro: 'Your AI/ML R&D center — operational in 6 weeks.',
    },
    {
      title: 'Cloud-Native & DevOps CoE Units',
      description: 'Plug-and-go Centers of Excellence for cloud-native engineering, platform modernization, and DevOps automation. Pre-configured unit structures built to accelerate cloud adoption and deliver infrastructure-as-code maturity from Day 1.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'AWS / Azure / GCP architecture, migration, and FinOps optimization units',
        'Kubernetes orchestration, Terraform IaC, GitOps CI/CD automation',
        'SRE & platform engineering teams with production on-call readiness',
        'Cloud cost governance: FinOps dashboards, reserved instance management, right-sizing',
      ],
      micro: 'Cloud engineering at scale — not cloud consulting.',
    },
    {
      title: 'Cybersecurity & GRC Units',
      description: 'Dedicated security engineering and governance units that integrate into your GCC from launch. SOC operations, vulnerability management, compliance automation, and security architecture — staffed by certified professionals, not generalists.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'SOC-as-a-Service: 24/7 threat monitoring, SIEM management, incident response',
        'Compliance automation: SOC 2 Type II, ISO 27001, HIPAA, PCI-DSS preparation',
        'AppSec engineering: SAST/DAST pipeline integration, secure code review',
        'GRC framework: risk assessment, vendor security reviews, audit preparation',
      ],
      micro: 'Security built-in from Day 1 — not bolted on at Year 2.',
    },
    {
      title: 'Talent-as-a-Service Engine',
      description: 'Access niche-skilled engineering teams on demand through outcome-tied unit models. Whether you need product engineers, platform specialists, or data engineers — our pre-built talent pipelines deliver vetted candidates in 21 days, not 90.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        '500+ pre-vetted engineers across 12 technology domains',
        'AI-led sourcing from Bengaluru, Hyderabad, Pune, and NCR pipelines',
        'KPI-based engagement: velocity, quality, sprint completion, defect density',
        'Notice period management: we handle buyouts, negotiations, and onboarding logistics',
      ],
      micro: 'Hire the team you need in 21 days.',
    },
    {
      title: 'Data Engineering & Analytics CoE',
      description: 'Dedicated data engineering units that build and operate your data infrastructure — from lakehouse architecture and ETL pipelines to real-time analytics dashboards and business intelligence. Staffed by data engineers, analytics engineers, and BI specialists.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Lakehouse architecture: Databricks, Snowflake, BigQuery, Apache Spark',
        'ETL/ELT pipeline engineering: dbt, Airflow, Fivetran, Kafka Streams',
        'BI & analytics: Looker, Tableau, Power BI, custom dashboarding',
        'Data governance: catalog management, lineage tracking, PII classification',
      ],
      micro: 'Turn raw data into engineering-grade pipelines.',
    },
    {
      title: 'GCC Governance & Operating Cadence',
      description: 'Your GCC should run like HQ, not like an offshore annex. We embed governance structures, agile rituals, and operating discipline calibrated to your existing sprint cadence — so teams deliver with accountability, not ambiguity.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Sprint cadence alignment with HQ: same JIRA boards, same standups, same retros',
        '30/60/90 onboarding: domain immersion → codebase mastery → independent delivery',
        'KPI dashboards: velocity, cycle time, defect density, sprint completion rate',
        'Quarterly business reviews with full operating cost and performance transparency',
      ],
      micro: 'HQ discipline. Not offshore theater.',
    },
    {
      title: 'Post-Launch Growth & Lifecycle Management',
      description: "The GCC journey doesn't end at launch. We provide continuous operational support — talent development, regulatory monitoring, facility expansion, capability diversification, and structured exit planning — so your center matures without disruption.",
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'Unit (8-12) → Squad (20-30) → Division (50-100+) elastic growth framework',
        'Regulatory continuity: EPFO/ESI filings, Professional Tax, Gratuity Act monitoring',
        'Capability diversification: add AI/ML, cloud, security, or data units incrementally',
        'Defined exit path: structured handover when you internalize operations',
      ],
      micro: 'Scale without restarting from zero.',
    },
  ],

  customSections: (
    <>
      <GCCMarketContextStrip />
      <GCCDiamondModel />
      <KangqoreCommandCenterDashboard />
      <GCCValueDeliverSection />
      <GCCBuyerSegmentation />
      <GCCMindsetTimeline />
      <GCCCompetitiveDifferentiation />
      <GCCFutureReady />
    </>
  ),

  trustPillars: [
    { title: 'Your hiring velocity for niche AI/ML roles increases 3x', tag: 'Talent Speed', description: 'Pre-built pipelines across Bengaluru, Hyderabad, and Pune — not assembled on demand when you sign. 21-day average time-to-fill for platform engineers and ML specialists.' },
    { title: 'Your compliance risk drops to near-zero from Day 1', tag: 'Regulatory Safety', description: 'Entity formation, EPFO, ESI, Professional Tax, STPI/SEZ — all filed before your first engineer writes a line of code. Ongoing regulatory monitoring handled as part of the operating engagement.' },
    { title: 'Your engineering team ships production code by Day 90', tag: 'Speed-to-Value', description: '30/60/90 immersion model: domain context → codebase mastery → independent delivery. No 6-month ramp-up period.' },
    { title: 'Your operational cost stays 40-60% below self-setup', tag: 'Economics', description: 'Kangqore\'s operating model eliminates the overhead of building internal compliance, HR, and facilities teams from scratch — delivering cost advantages of 40-60% compared to self-managed GCC setup.' },
    { title: 'Your center runs like HQ, not an offshore outpost', tag: 'Cultural Parity', description: 'Same sprint cadence, same standup rituals, same JIRA boards. Shadow rotations with your HQ leads. Customer-empathy-led onboarding so the team understands WHY they build, not just WHAT.' },
    { title: 'You exit our model whenever you choose', tag: 'Zero Lock-in', description: 'No 3-year BOT contracts. No transfer fees. The team is yours, the IP is yours, the center is yours. When you are ready to internalize operations, we hand over and step back.' },
  ],

  whyKangqoreIntro: 'Unlike traditional GCC consultants who charge advisory fees to tell you what you already know, and unlike managed service providers who lock you into 3-year BOT contracts — Kangqore operates on a fundamentally different model.',
  whyKangqore: [
    { title: 'We\'ve navigated India compliance so you don\'t have to', description: 'PAN, TAN, GST, EPFO, ESI, Professional Tax, STPI/SEZ, and critical Transfer Pricing frameworks (Cost-Plus markups) engineered upfront. Your GCC launches compliant and tax-optimized, not scrambling.', icon: Globe },
    { title: 'Elite engineers, not a bloated SI pyramid', description: 'We target the top 1% of India\'s engineering talent pool. You don\'t need 10,000 average developers; you need 50 elite platform engineers. 500+ pre-vetted experts across LLM, cloud, and cybersecurity. Average 21-day time-to-fill.', icon: Search },
    { title: 'We operate your GCC infrastructure — you focus on engineering', description: 'Facility management, IT provisioning, vendor management, payroll processing, compliance monitoring, and HR operations — all handled by Kangqore. Your engineering leadership focuses on product, not procurement.', icon: Layers },
    { title: 'Our commercial model has no traps', description: 'Flexible engagement models without multi-year lock-in. No BOT transfer fees. Scaling tied to your actual business needs. The center, team, and IP are yours — we provide the operating infrastructure underneath.', icon: Briefcase },
    { title: 'We do not compete with your engineering leadership', description: 'Your GCC team reports to your VP of Engineering, executes your roadmap, and attends your standups. We are the operating layer underneath — not a managed services provider inserting ourselves between you and your team.', icon: Activity },
    { title: 'We have a defined exit path — by design', description: 'When your center reaches operational maturity and you want to internalize HR, compliance, and facility management, we execute a structured handover. No extended transition fees. No artificial dependency. We succeed when you no longer need us.', icon: TrendingUp },
  ],

  industriesTitle: 'Industries We Build GCCs For',
  industries: [
    { name: 'Financial Services & FinTech', description: 'Building the plumbing for modern finance. We deploy GCCs handling LLM fine-tuning for algorithmic trading, ISO 20022 payments modernization, and real-time fraud detection pipelines under strict RBI and SOC 2 Type II compliance.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA BAA executed pre-launch. We build units driving clinical genomic data pipelines, FHIR API interoperability layers, and FDA 21 CFR Part 11 validation workflows directly inside your sprint cycle.' },
    { name: 'SaaS & Product Companies', description: 'We don\'t do IT support. We build product engineering units integrated directly into your CI/CD pipeline (GitHub Actions/GitLab) building multi-tenant microservices, WebAssembly modules, and real-time pub/sub systems.' },
    { name: 'Technology & ISVs', description: 'Your genuine extension in India. Platform engineering squads building Kubernetes operators, custom Terraform providers, and agentic AI workflows tightly coupled with your San Francisco or London HQ.' },
    { name: 'Retail & E-commerce', description: 'Omnichannel engineering units building composable MACH architectures (Microservices, API-first, Cloud-native, Headless) performing elastic scaling to handle peak global transaction volumes with sub-50ms latency.' },
    { name: 'Manufacturing & Industrial', description: 'Bridging OT-IT convergence. Our units build IoT SCADA telemetry hubs, predictive maintenance digital twins, and edge computing layers with strict ISA/IEC 62443 security compliance.' },
  ],

  customFAQs: [
    { question: 'What exactly is GCC-as-a-Service, and how is Kangqore\'s model different?', answer: 'GCC-as-a-Service is our operating model where we handle entity formation (PAN, TAN, GST, STPI/SEZ), facility provisioning, compliance management (EPFO, ESI, Professional Tax), talent acquisition, IT infrastructure, and HR operations — while you retain 100% strategic control and IP ownership of your team. The center is yours from Day 1. Unlike traditional BOT models, there is no 3-year lock-in and no transfer fee — because there is nothing to "transfer." It was always yours.' },
    { question: 'How fast can a GCC go from sign-off to first production sprint?', answer: '60 days from commercial sign-off to first engineering sprint. The breakdown: Days 1-15 for entity registration and compliance filing, Days 10-30 for workspace lease execution and IT infrastructure provisioning (AWS/Azure landing zones, VPN tunnels, endpoint management), Days 15-45 for talent sourcing and technical screening, Days 30-60 for onboarding, domain immersion, and codebase walkthroughs. Your team ships independently by Day 90.' },
    { question: 'Which Indian cities does Kangqore operate GCCs in?', answer: 'Primary hubs: Bengaluru (deepest AI/ML and product engineering talent), Hyderabad (strong enterprise and cloud engineering pools, competitive costs), and Pune (emerging SaaS and DevOps concentration). We also support NCR (Delhi/Gurgaon/Noida) for enterprise-heavy functions. For Tier-2 expansion beyond 100 headcount, we advise on Jaipur, Indore, Coimbatore, and Visakhapatnam based on your specific role requirements and cost targets.' },
    { question: 'What does the commercial engagement model look like?', answer: 'Kangqore offers flexible engagement models tailored to your GCC stage and scale — from dedicated team retainers to outcome-based delivery pricing. Operating costs cover compliant workspace, IT infrastructure, HR operations (payroll, benefits, statutory compliance), facility management, and administrative services. We structure commercial terms to avoid multi-year lock-in so you retain the ability to scale or internalize operations based on your evolving business needs.' },
    { question: 'How does Kangqore handle India labor law and regulatory compliance?', answer: 'We manage full statutory compliance: Employees\' Provident Fund (EPFO), Employees\' State Insurance (ESI), Professional Tax (state-specific), Shops & Establishment Act registration, Payment of Gratuity Act, Maternity Benefit Act, and applicable state labor welfare fund contributions. For STPI/SEZ-registered entities, we handle annual compliance filings, foreign inward remittance documentation, and softex form submissions. All compliance is monitored continuously — not just at launch.' },
    { question: 'Can I scale the team up or down after launch?', answer: 'Yes. Our operating model scales elastically. Add engineers with 30-day ramp lead time (sourced through our pre-built pipeline). Scale down with appropriate notice — we handle the employment law implications, notice periods, and knowledge transfer. Typical growth trajectory: start with a unit of 8-12, grow to a squad of 20-30 within 6 months, and scale to 50-100+ within 12-18 months based on your product roadmap velocity.' },
  ],
};

// ─── talent-organization (Platforms) ───────────────────────────────────────────
const talentOrganization = {
  titleLine1: 'Talent &',
  titleHighlight: 'Organization.',
  description:
    "We treat talent as a measurable system. We strip out bloated hierarchies, deploy AI to automate foundational HR operations, and hardwire capability frameworks to specific business outcomes. We don't run trust falls — we engineer workforce velocity.",
  image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=format&fit=crop&w=1260&q=80',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Book a 30-Min Strategy Call', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,

  stats: [
    { value: '30-50%', label: 'Acceleration in Decision Speed', color: 'text-brand-blue' },
    { value: '40%↑', label: 'Retention Increase via Predictive Models', color: 'text-blue-400' },
    { value: 'DAY 1', label: 'AI Readiness for Your Workforce', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '10x', label: 'Faster Execution on Capability Gaps', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'TALENT & ORGANIZATION :: WORKFORCE INTELLIGENCE',
      titleLine1: 'Hardwiring',
      titleHighlight: 'Execution',
      titleLine2: 'at the Core.',
      description:
        "You cannot run a next-generation technology stack on a legacy organizational chart. The bottleneck isn't the software; it's the workforce's inability to adopt, operate, and scale it.",
      bottleneckLabel: 'The Organizational Bottleneck',
      bottleneckText:
        "Slow, layered decision matrices. Severe capability gaps in engineering and AI roles. Compliance-heavy HR preventing rapid talent deployment. The result isn't just friction—it's catastrophic loss of market share.",
      requirementLabel: 'The Operational Mandate',
      requirementText:
        'We restructure teams, flatten decision authorities, and inject AI literacy at the systemic level. Your talent organization must shift from a cost center regulating compliance into a velocity engine driving enterprise ROI.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Workforce Readiness',
      statusValue: 'AI-READY',
    },
    philosophy: {
      icon: <Users className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: '',
      titleHighlight: 'Systemic Accountability.',
      description:
        'We eradicate HR ambiguity. We deploy governed talent platforms that track real-time capability gaps, enforce leadership accountability, and compress time-to-productivity for new hires by 40%.',
      bgElement: <TalentPhilosophyBackground />,
      pills: ['AI-Powered Workforce', 'Skills Intelligence', 'Culture Engineering', 'Leadership Pipelines'],
      features: [
        { title: 'Talent Strategy & Workforce Planning', label: 'Talent Architecture', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Design a workforce aligned with future business models — not outdated assumptions. Identify critical roles, future skills, and workforce gaps before they impact growth.' },
        { title: 'AI-Powered Workforce Transformation', label: 'Intelligent HR', icon: <BrainCircuit className="w-5 h-5 text-gray-400" />, content: 'Integrate AI into hiring, talent management, and productivity systems. Move from manual HR operations to intelligent workforce ecosystems that scale with precision.' },
        { title: 'Leadership & Culture Transformation', label: 'Performance Culture', icon: <Target className="w-5 h-5 text-gray-400" />, content: "Build leaders who drive accountability, innovation, and performance. Create a culture that doesn't resist change — but accelerates it." },
        { title: 'HR & People Analytics', label: 'Decision Intelligence', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Turn workforce data into decision intelligence. Enable real-time insights for hiring, retention, performance, and planning — not annual reviews.' },
      ],
    },
    matrix: {
      engineId: 'ENGINE :: T&O_V5',
      title: 'Our Execution Framework.',
      subtext: 'A connected system for moving from reactive HR management to governed, scalable talent ecosystems that drive measurable business outcomes.',
      layers: [
        { title: 'Diagnose', id: 'TO_DIAG', icon: <Search />, desc: 'Deep analysis of your organization, workforce, culture, leadership pipeline readiness, and capability gaps.' },
        { title: 'Design', id: 'TO_DESIGN', icon: <Layers />, desc: 'Build future-ready structures, roles, strategies, target operating models, and capability frameworks.' },
        { title: 'Deploy', id: 'TO_DEPLOY', icon: <Zap />, desc: 'Execute transformation programs across teams — platforms, leadership programs, culture initiatives, analytics enablement.' },
        { title: 'Scale', id: 'TO_SCALE', icon: <Activity />, desc: 'Continuously optimize with data, AI, and feedback loops. Scale successful initiatives across the enterprise.' },
      ],
    },
    schematic: {
      titleLine1: 'Measurable',
      titleHighlight: 'Impact.',
      description: 'Your people should be your greatest driver of innovation. We deliver measurable organizational performance — not reports.',
      stats: [
        { label: 'Decision Speed', val: '30-50%↑' },
        { label: 'Retention', val: '40%↑' },
        { label: 'AI Readiness', val: 'DAY 1' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Talent Strategy & Workforce Planning',
      description: 'Design a workforce aligned with future business models — not outdated assumptions. We help you identify critical roles, future skills, and workforce gaps before they impact growth. Data-driven workforce analytics, scenario modeling, and capability gap identification across the enterprise.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Strategic workforce planning and analytics',
        'Capability gap identification and closure',
        'Talent supply chain design',
        'Scenario modeling and demand forecasting',
      ],
      micro: 'Optimizing capability deployment timelines.',
    },
    {
      title: 'AI-Powered Workforce Transformation',
      description: 'Integrate AI into hiring, talent management, and productivity systems. Move from manual HR operations to intelligent workforce ecosystems. GenAI-powered screening, predictive attrition modeling, and agentic AI for HR automation — deployed at enterprise scale.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-powered sourcing and intelligent screening',
        'Predictive attrition and retention models',
        'GenAI skill assessment and upskilling pathways',
        'Agentic AI for HR operations automation',
      ],
      micro: 'Deploying agentic AI across HR operations.',
    },
    {
      title: 'Leadership Pipeline Development',
      description: 'Build leadership bench strength with structured succession planning, high-potential identification, and development pathways. We create leaders at every level — from first-time managers to C-suite successors — with evidence-based coaching, not one-off seminars.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Succession planning and readiness assessment',
        'High-potential identification and acceleration',
        'Executive coaching and development',
        'Leadership competency frameworks',
      ],
      micro: 'Engineering production-ready leadership.',
    },
    {
      title: 'Learning Ecosystem Transformation',
      description: 'Replace fragmented, low-adoption training modules with unified, AI-powered learning ecosystems. We hardwire upskilling into daily workflows, mapping directly to imminent capability gaps and compressing time-to-value.',
      bgImage: '/images/capabilities/education.png',
      items: [
        'Learning platform strategy and implementation',
        'AI-powered content curation and personalization',
        'Skills-based learning pathway design',
        'Knowledge management and institutional memory',
      ],
      micro: 'Accelerating Time-to-Productivity (TTP).',
    },
    {
      title: 'Organizational Design & Architecture',
      description: 'Restructure teams, roles, and workflows for speed, clarity, and scalability. Eliminate inefficiencies and create systems that enable faster execution. Flatter, faster organizations that respond to market shifts without losing governance, accountability, or cultural integrity.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Target operating model design',
        'Agile organization structures',
        'Shared services and CoE models',
        'Decision authority and governance design',
      ],
      micro: 'Structure drives performance.',
    },
    {
      title: 'Culture Intelligence & Activation',
      description: 'Design and embed organizational culture as a measurable, governable system using sentiment analytics, behavioral frameworks, organizational network analysis, and evidence-based change methodology. Culture is designed, not accidental.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Culture assessment and measurement',
        'Sentiment analytics and pulse surveys',
        'Behavioral design and nudge architecture',
        'DEI strategy and integration',
      ],
      micro: 'Culture is the operating system of performance.',
    },
    {
      title: 'HR & People Analytics',
      description: 'Turn workforce data into decision intelligence. Enable real-time insights for hiring, retention, performance, and planning. We build analytics infrastructure that transforms HR from a cost center into an innovation engine — with dashboards, not decks.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'People analytics platform strategy',
        'Predictive workforce modeling',
        'Real-time engagement and retention analytics',
        'Organizational network analysis (ONA)',
      ],
      micro: 'Data-driven decisions, not gut feelings.',
    },
    {
      title: 'Change Management & Transformation Execution',
      description: "Ensure transformation is adopted, sustained, and scaled across the organization. We don't just design change — we make it work. Structured adoption frameworks, stakeholder alignment, and continuous feedback loops that turn strategy into execution.",
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Change readiness assessment and planning',
        'Stakeholder alignment and communication',
        'Adoption measurement and optimization',
        'Transformation governance and scaling',
      ],
      micro: 'Not consulting. Transformation.',
    },
  ],

  customSections: (
    <>
      <TalentWhySection />
      <TalentDiamondCoESection />
      <TalentProofOutcomes />
      <TalentReadinessMagnet />
      <TalentDeliveryModel />
      <TalentFutureReadySection />
      <TalentExecutionEcosystem />
    </>
  ),

  trustPillars: [
    { title: 'Science-backed talent interventions', tag: 'People Science', description: 'Every recommendation is grounded in behavioral science, organizational psychology, and workforce analytics — not generic best practices.' },
    { title: 'AI-native at every layer', tag: 'AI-Powered', description: 'From GenAI-powered screening to predictive attrition and agentic HR automation — technology amplifies every talent initiative.' },
    { title: 'Culture as measurable infrastructure', tag: 'Culture', description: 'We treat culture as a governed, measured system — not an abstract aspiration. Sentiment analytics, behavioral design, and ONA make culture tangible.' },
    { title: 'Leadership pipeline accountability', tag: 'Leadership', description: 'Systematic leadership development from first-time managers to C-suite succession — with structured pathways, not one-off seminars.' },
    { title: 'Data-driven workforce decisions', tag: 'Analytics', description: 'Real-time people analytics, predictive modeling, and decision intelligence that transforms HR from cost center to competitive advantage.' },
    { title: 'Transformation execution discipline', tag: 'Change', description: 'We don\'t just design change — we deploy, measure, and scale it across the enterprise with governed adoption frameworks.' },
  ],

  whyKangqore: [
    { title: 'Execution-First Talent Models', description: 'We don\'t do theory. We instrument capability frameworks that directly tie workforce output to P&L performance, eliminating consultative fluff.', icon: Target },
    { title: 'Platform-Driven Readiness', description: 'We deploy AI to automate base-level HR operations and use predictive attrition models to secure your most critical engineering and leadership nodes.', icon: BrainCircuit },
    { title: 'Culture as a Governed System', description: 'Culture isn\'t an aspiration; it\'s an operating system constraint. We use hard data and organizational network analysis (ONA) to measure, govern, and enforce performance behaviors.', icon: Users },
  ],

  industries: [
    { name: 'Banking & Financial Services', description: 'Regulatory-aware talent strategy, compliance culture, risk-conscious leadership development, and AI-powered workforce planning for regulated environments.' },
    { name: 'Technology & SaaS', description: 'Engineering talent retention, skills-based organizations, GenAI upskilling at scale, and innovation-driving culture design for high-velocity teams.' },
    { name: 'Healthcare & Life Sciences', description: 'Clinical workforce planning, compassion-centered culture, specialized talent pipelines, and compliance-grade people analytics.' },
    { name: 'Manufacturing & Industrial', description: 'Frontline workforce transformation, safety culture engineering, multi-generational talent integration, and Industry 4.0 skills acceleration.' },
    { name: 'Retail & E-commerce', description: 'High-volume talent acquisition, seasonal workforce optimization, customer-centric culture design, and omnichannel employee experience.' },
    { name: 'Professional Services', description: 'Knowledge worker retention, partnership-track leadership, client-centric organizational design, and AI-augmented service delivery models.' },
  ],

  customFAQs: [
    { question: 'How does Kangqore differ from traditional HR consulting firms?', answer: 'Traditional HR consulting sells "advisory" — bloated slide decks on organizational theory and change management. We operate as execution partners. We treat talent infrastructures as engineering systems: tracking capability gaps, automating HR processes with AI, and instrumenting performance metrics that tie directly to business outcomes.' },
    { question: 'What does "culture as an operating system" actually mean?', answer: 'It means moving culture out of the hands of HR marketing and into data governance. We use Organizational Network Analysis (ONA) and sentiment analytics to quantitatively measure bottlenecks, silos, and friction points, then deploy systems to enforce operational velocity.' },
    { question: 'How do you integrate AI into workforce transformation?', answer: 'We deploy AI to crush HR overhead. This means integrating agentic AI to handle employee inquiries, GenAI for automated skill gap assessments, and predictive models to flag high-risk attrition in critical engineering pipelines before they impact delivery targets.' },
    { question: 'How do you approach leadership development differently?', answer: 'We abandon theoretical seminars for high-stakes capability simulation. We build leadership capacity by throwing managers into structured scenario models, utilizing real-time performance analytics to ensure leaders are production-capable, not just certified.' },
    { question: 'Can you help with workforce planning for rapid growth or restructuring?', answer: 'Yes. We use data-driven workforce planning models that align talent supply with business demand — including scenario modeling, capability gap analysis, AI-powered demand forecasting, succession planning, and organizational redesign for scale. Whether you\'re scaling from 50 to 500 or restructuring a 10,000-person org, our frameworks adapt.' },
    { question: 'How do you measure the success of talent transformation?', answer: 'Through quantifiable metrics: 30–50% faster decision-making cycles, engagement scores, attrition rate reduction, leadership pipeline readiness, capability gap closure rates, time-to-productivity improvements, internal mobility rates, and culture health indicators — all tracked through integrated analytics dashboards with real-time visibility.' },
  ],
};

// ─── supply-chain (Platforms) ──────────────────────────────────────────────────
const supplyChain = {
  titleLine1: 'Supply',
  titleHighlight: 'Chain.',
  description:
    "We don't treat supply chain as a back-office function. We treat it as an enterprise performance system. We redesign supply chain operations so planning is sharper, execution is faster, visibility is real-time, and resilience is hardwired into your global architecture.",
  image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?auto=format&fit=crop&w=1260&q=80',

  primaryButton: { text: 'Get Your Supply Chain Blueprint', link: '/contact' },
  secondaryButton: { text: 'Schedule a Strategy Call', link: '#capabilities' },

  hideGenericMidPageCta: true,

  stats: [
    { value: '7', label: 'Core Supply Chain Pillars Engineered', color: 'text-brand-blue' },
    { value: 'E2E', label: 'End-to-End Network Visibility', color: 'text-blue-400' },
    { value: '20+', label: 'Enterprise Platforms Integrated', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'DAY 1', label: 'ESG Compliance Built In', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'SUPPLY CHAIN OPERATIONS :: V5',
      titleLine1: 'Supply',
      titleHighlight: 'Chain.',
      titleLine2: 'Transformation.',
      description:
        'Global supply chains are the lifeblood of the modern economy. We help you transform linear logistics into an elastic, observable, and AI-driven supply network that adapts to severe disruption and maximizes throughput.',
      bottleneckLabel: 'The Disconnected Chain',
      bottleneckText:
        "Your ERP says you have inventory, but the warehouse floor says you don't. Data latency between tier-2 suppliers and demand planners forces your teams to rely on static spreadsheets, resulting in blind spots, stockouts, and millions bled in expedited freight premiums. The core problem isn't \"volatility\"—it's a fragmented, reactive technology stack.",
      requirementLabel: 'Enterprise Performance Base',
      requirementText:
        "We don't just map process flows in a slide deck. We architect and deploy the necessary telemetry, integration layers, and automation across systems like SAP, Kinaxis, and project44. We turn fragmented supply chains into predictable, zero-latency execution engines.",
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Network Readiness',
      statusValue: 'OPTIMIZED',
    },
    philosophy: {
      icon: <Truck className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: '',
      titleHighlight: 'Outcomes, Not Theories.',
      description:
        'We bring together consulting, operational redesign, analytics, AI-led automation, and digital accelerators to solve acute logistical bottlenecks while hardening your infrastructure against future disruption.',
      pills: ['Real-Time Visibility', 'Cognitive Forecasting', 'Elastic Logistics', 'Embedded ESG'],
      features: [
        { title: 'Demand Planning', label: 'Cognitive', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Reduce forecast volatility and respond instantly to demand shifts with highly tuned analytical modeling.' },
        { title: 'Source-to-Pay', label: 'Procurement', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Drive upstream category intelligence and optimize downstream procure-to-pay execution parameters.' },
        { title: 'Fulfillment Engine', label: 'Orchestration', icon: <Zap className="w-5 h-5 text-gray-400" />, content: 'Streamline order orchestration using lean process design and smart automation that eliminates friction.' },
        { title: 'Cyber-Physical Security', label: 'Zero-Trust', icon: <Shield className="w-5 h-5 text-gray-400" />, content: 'Harden your supply network against third-party data breaches and physical disruption using Zero-Trust logistics.' },
      ],
    },
    matrix: {
      engineId: 'ZERO-LATENCY SUPPLY ENGINE™',
      title: 'The Execution Matrix.',
      subtext: 'A deliberate, engineering-first approach to overhauling legacy supply chains.',
      layers: [
        { title: 'Evaluate', id: 'SCM_MAP', icon: <Search />, desc: 'End-to-end value chain mapping and severe bottleneck diagnosis.' },
        { title: 'Architect', id: 'SCM_CORE', icon: <Layers />, desc: 'Designing resilient sourcing, planning, and predictive logistic blueprints.' },
        { title: 'Deploy', id: 'SCM_OPS', icon: <Zap />, desc: 'Executing digital platforms, AI-led intelligence, and operational workflow discipline.' },
        { title: 'Scale', id: 'SCM_SCALE', icon: <Activity />, desc: 'Continuous telemetry tuning and scaling autonomous supply frameworks.' },
      ],
    },
    schematic: {
      titleLine1: 'Maximize',
      titleHighlight: 'Throughput.',
      description: 'We build the foundations for exponential operational agility and resilience under pressure.',
      stats: [
        { label: 'Cash Conversion', val: 'ACCELERATED' },
        { label: 'Inventory Exposure', val: 'MINIMIZED' },
        { label: 'Fulfillment Speed', val: 'MAXIMIZED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Demand & Supply Planning',
      description: 'Eradicate manual spreadsheet forecasting. We deploy cognitive logic and scenario modeling that connects downstream demand signals directly to upstream supplier capacity, stopping the bullwhip effect before it starts.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Demand forecasting modernization',
        'Supply planning and scenario modeling',
        'Inventory optimization and policy tuning',
        'S&OP / IBP process alignment',
      ],
      micro: "Respond to demand, don't react.",
    },
    {
      title: 'Source-to-Pay (S2P) Architecture',
      description: 'Stop overpaying suppliers because your category data lives in 14 different spreadsheets. We consolidate sourcing intelligence, automate contract compliance, and wire Coupa or Ariba directly into your ERP so procurement decisions are data-driven, not gut-driven.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Strategic sourcing transformation',
        'Category and supplier intelligence',
        'Contracting process optimization',
        'Procure-to-pay workflow redesign',
      ],
      micro: 'Kill procurement leakage at the source.',
    },
    {
      title: 'Engineering & Asset Telemetry',
      description: 'Your maintenance team is replacing parts on a calendar schedule while IoT sensors sit unconnected. We wire Azure Digital Twins and AWS IoT SiteWise into your asset fleet so predictive maintenance replaces reactive firefighting and unplanned downtime drops to near-zero.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Asset monitoring architecture',
        'IoT-enabled maintenance visibility',
        'Preventive and predictive maintenance workflows',
        'Uptime control tower support',
      ],
      micro: "Predict failures. Don't schedule them.",
    },
    {
      title: 'Fulfillment & Order Orchestration',
      description: 'Eliminate order friction and protect margins. We automate touchless orchestration to cut order-to-cash lifecycle lag and permanently reduce reliance on emergency freight.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Order orchestration redesign',
        'Fulfillment workflow automation',
        'Touchless and exception-based processing',
        'Service-level throughput optimization',
      ],
      micro: 'Revenue protection, absolute visibility.',
    },
    {
      title: 'Aftermarket Service Strategy',
      description: "Your field technicians are waiting 72 hours for spare parts because service inventory planning still runs on last quarter's forecast. We redesign aftermarket operations so parts are pre-positioned, resolution times collapse, and your CSAT scores stop bleeding.",
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Aftermarket process optimization',
        'Service inventory and parts planning',
        'Query resolution workflow redesign',
        'Real-time service planning automation',
      ],
      micro: 'Pre-position parts. Collapse resolution times.',
    },
    {
      title: 'Risk & Cyber-Physical Security',
      description: 'A single compromised vendor API took down a Fortune 100 supply network for 11 days last year. We deploy Zero-Trust logistics frameworks and real-time early-warning telemetry that flag vendor compromise, route anomalies, and operational variance before they cascade into production shutdowns.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Cyber-Physical supply chain hardening',
        'Zero-Trust third-party vendor integration',
        'Predictive variance and risk telemetry',
        'Decision-support control towers',
      ],
      micro: 'One breach cascades. Zero-Trust stops it.',
    },
    {
      title: 'Embedded SCM Sustainability (ESG)',
      description: 'Your board is asking for Scope 3 emissions data and your supply chain team is guessing. We encode ESG compliance directly into procurement gates, logistics routing, and supplier onboarding workflows so sustainability is an operational reality, not a quarterly slide deck.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'ESG operating model integration',
        'Sustainable supply chain assessments',
        'Process-level transparency improvement',
        'Platform-aligned ESG telemetry enablement',
      ],
      micro: 'Scope 3 accountability. Built into the process.',
    },
  ],

  customSections: (
    <>
      <SupplyChainControlTower />
      <SupplyChainReadinessMagnet />
    </>
  ),

  trustPillarsVideo: '/videos/engineering-rd-bg.mp4',
  trustPillars: [
    { title: 'Faster planning cycles', tag: 'Planning', description: 'Tightly coupled demand modeling leading to immediate, high-fidelity forecasting confidence.' },
    { title: 'Lower inventory exposure', tag: 'Inventory', description: 'Preventative algorithms that dynamically reduce stockouts while eliminating bloat.' },
    { title: 'Better fulfillment responsiveness', tag: 'Transactions', description: 'Streamlined orchestration that sharply reduces order-to-cash lifecycle lag.' },
    { title: 'Absolute network visibility', tag: 'Telemetry', description: 'Track assets, suppliers, and operational risk across the global grid in real-time.' },
    { title: 'ESG accountability', tag: 'Sustainability', description: 'Supply chain sustainability encoded directly into process compliance gates.' },
  ],

  whyKangqore: [
    { title: 'Execution, Not Theory', description: 'You don\'t need a vendor to simply map process flows. You need a partner that makes your supply chain more predictable, visible, and resilient.', icon: Target },
    { title: 'AI-Led Analytics', description: 'We embed algorithmic intelligence into risk monitoring, forecasting precision, and operational decision support.', icon: BrainCircuit },
    { title: 'True Network Observability', description: 'Attain absolute operational visibility across assets, suppliers, and fulfillment using integrated IoT and telemetry architecture.', icon: Activity },
  ],

  industries: [
    { name: 'Manufacturing & Industrial', description: 'Industry 4.0 telemetry mapping, production forecasting, and hardware-integrated planning.' },
    { name: 'Retail & Consumer Goods', description: 'Omnichannel fulfillment orchestration, precise inventory placing, and demand volatility smoothing.' },
    { name: 'Healthcare & Life Sciences', description: 'Cold-chain traceability, strict regulatory compliance, and rapid vital-asset distribution.' },
    { name: 'Transportation & Logistics', description: 'Elastic routing networks, fuel and asset optimization, and real-time fleet telemetry.' },
  ],

  customFAQs: [
    { question: 'What supply chain services does Kangqore provide?', answer: 'Kangqore provides end-to-end supply chain management services across demand and supply planning, source-to-pay transformation, engineering support and asset monitoring, order management and fulfillment, aftermarket services, supply chain risk and analytics, and ESG-led supply chain operations.' },
    { question: 'How do you support end-to-end visibility?', answer: 'We improve end-to-end visibility through connected data models, operational dashboards, control-tower thinking, IoT-enabled monitoring, and predictive analytics layers that help teams identify issues earlier and respond with less manual effort.' },
    { question: 'Can you help optimize supply chain cost and speed?', answer: 'Absolutely. We focus on removing friction across planning, sourcing, fulfillment, and service workflows so enterprises can radically reduce operational cost, accelerate transaction execution, and improve overall market responsiveness.' },
    { question: 'How do you enable resilience in global supply chains?', answer: 'We build resilience through better planning algorithms, stronger analytics, AI-led risk visibility, lean process redesign, and tight technology integration that helps clients anticipate disruption and maintain continuity.' },
    { question: 'How does AI improve supply chain management?', answer: 'AI improves forecasting accuracy, powers supplier risk sensing, drives workflow automation, and provides unmatched decision support. We integrate GenAI, Machine Learning, and advanced analytics to execute these advantages at scale.' },
    { question: 'Do you support ESG and sustainability in supply chain operations?', answer: 'Yes. We help organizations integrate ESG requirements deeply into supply chain processes through assessment, advisory, reporting architecture, and operating model redesign—ensuring sustainability is built into how the chain runs.' },
    { question: 'How long does a typical supply chain transformation take?', answer: 'It depends on scope, but our engagements follow a clear cadence: diagnostic and value-chain mapping in 2 to 3 weeks, solution architecture and pilot design in 4 to 6 weeks, and full-scale deployment within 90 to 120 days. We measure ROI from the first quarter of deployment, not from an arbitrary project end date. Most clients see measurable operational improvement within 90 days of engagement kickoff.' },
    { question: 'How do you integrate with our existing ERP and legacy systems?', answer: 'We do not rip and replace. Our approach is integration-first. We work with your existing SAP, Oracle, Microsoft Dynamics, or Infor backbone and layer in the necessary telemetry, automation, and analytics connectors. We have deep experience wiring platforms like Kinaxis, Blue Yonder, project44, and Coupa into legacy environments without disrupting active operations. Your teams keep working while we upgrade the plumbing underneath.' },
  ],
};

// ─── unified-services-management (Platforms) ───────────────────────────────────
const unifiedServicesManagement = {
  titleLine1: 'Unified Service',
  titleHighlight: 'Management.',
  description:
    'Most enterprises operate across disconnected tools, siloed teams, and inconsistent workflows. That creates delays, poor visibility, rising support costs, and weak employee experiences. Kangqore connects IT, HR, Finance, Facilities, Customer Operations, and enterprise workflows into a single AI-powered operating model.',
  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1260&q=80',

  primaryButton: { text: 'Get Your USM Blueprint', link: '/contact' },
  secondaryButton: { text: 'Schedule a Strategy Call', link: '#capabilities' },

  hideGenericMidPageCta: true,

  stats: [
    { value: '40%+', label: 'Faster Resolution Time', color: 'text-brand-blue' },
    { value: '360°', label: 'Cross-Function Visibility', color: 'text-blue-400' },
    { value: '24/7', label: 'AI-Powered Service Support', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Day 1', label: 'Governance Ready Operations', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'UNIFIED SERVICE MANAGEMENT :: ENTERPRISE OPS',
      titleLine1: 'Connected',
      titleHighlight: 'Operations.',
      titleLine2: 'Scaled Precision.',
      description:
        'Modern enterprises need a connected operating model where workflows move seamlessly across departments, data flows in real time, and every employee or customer interaction feels effortless.',
      bottleneckLabel: 'The Siloed Reality',
      bottleneckText:
        'Your IT desk runs on ServiceNow, HR uses email, and Finance manages requests in spreadsheets. This fragmented architecture creates massive friction, invisible costs, and forces employees to act as their own systems integrators just to get work done.',
      requirementLabel: 'The Unified Standard',
      requirementText:
        'Service excellence cannot happen in silos. We deploy an integration-first operating model—combining platform engineering, AI copilots, and cross-department workflows to standardize service delivery and automate repetitive work at scale.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Service Architecture',
      statusValue: 'UNIFIED',
    },
    philosophy: {
      icon: <Layers className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Integration-First.',
      titleHighlight: 'Execution-Always.',
      description:
        'We combine advisory, platform engineering, automation, AI copilots, analytics, and managed services to redesign how enterprise functions operate together. From internal support to shared services, we build ecosystems built for scale.',
      pills: ['Connected Experience', 'AI Copilots', 'Cross-Function Workflows', 'Governance-Ready'],
      features: [
        { title: 'Service Strategy', label: 'Architecture', icon: <Share2 className="w-5 h-5 text-gray-400" />, content: 'Design a unified operating model that aligns IT, HR, and business functions under a single governance framework.' },
        { title: 'Platform Engineering', label: 'Integration', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Implement and customize platforms like ServiceNow to act as the central nervous system for all enterprise workflows.' },
        { title: 'AI Automation', label: 'Zero-Touch', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'Deploy virtual agents and predictive routing to automate repetitive requests and accelerate mean-time-to-resolution.' },
        { title: 'Analytics & Insights', label: 'Observability', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Gain 360-degree visibility into service performance, SLA compliance, and process bottlenecks across all departments.' },
      ],
    },
    matrix: {
      engineId: 'UNIFIED SERVICE ENGINE™',
      title: 'The Enablement Matrix.',
      subtext: 'A structured methodology for transforming fragmented departments into a governed, high-velocity service fabric.',
      layers: [
        { title: 'Assess', id: 'USM_MAP', icon: <Search />, desc: 'Service inventory mapping, maturity assessment, and bottleneck identification.' },
        { title: 'Design', id: 'USM_CORE', icon: <Layers />, desc: 'Architecting unified service blueprints, shared portals, and governance rules.' },
        { title: 'Deploy', id: 'USM_OPS', icon: <Zap />, desc: 'Executing automated service desks, AI copilots, and cross-department workflows.' },
        { title: 'Optimize', id: 'USM_TEL', icon: <Activity />, desc: 'Real-time service telemetry, proactive SLA monitoring, and continuous improvement.' },
      ],
    },
    schematic: {
      titleLine1: 'Synthesize',
      titleHighlight: 'Efficiency.',
      description: 'Your services should be your greatest driver of trust. We ensure they remain transparent, scalable, and optimized for excellence.',
      stats: [
        { label: 'Integrity', val: 'ABSOLUTE' },
        { label: 'Speed', val: 'MAXIMIZED' },
        { label: 'Scale', val: 'GLOBAL' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Global Service Desk Operations',
      description: 'Stop treating internal support as a cost center. We run 24/7, multi-region service desks that act as the intelligent first line of defense, deploying predictive routing to solve issues before they escalate.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        '24/7 Multi-Region Support',
        'L1/L2/L3 escalation frameworks',
        'SLA Governance & Reporting',
        'Continuous Service Optimization',
      ],
      micro: 'Predictable support, global scale.',
    },
    {
      title: 'Service Operating Model Design',
      description: 'You cannot run unified services on an outdated org chart. We completely redesign your service operating model, stripping out bottlenecks and aligning IT, HR, and Finance under a single, governed delivery framework.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Workflow & Process Assessment',
        'Target Operating Model (TOM) design',
        'Governance & Compliance Advisory',
        'Experience Improvement Roadmaps',
      ],
      micro: 'Structure drives resolution speed.',
    },
    {
      title: 'Enterprise Platform Implementation',
      description: 'Your workflows are only as good as the platform running them. We architect, implement, and harden enterprise platforms like ServiceNow to act as the central nervous system for all operational requests.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'ServiceNow / ITSM Modernization',
        'Platform Rationalization Strategy',
        'Custom workflow application builds',
        'Platform security and access governance',
      ],
      micro: 'Deploy the central nervous system.',
    },
    {
      title: 'Cross-Department Workflow Integration',
      description: "An employee onboarding shouldn't require 14 separate tickets. We integrate IT provisioning, HR setup, and Facilities access into single, seamless workflows that cross departmental boundaries automatically.",
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'HR, Finance & Facilities Portals',
        'Cross-system API integration',
        'Onboarding/Offboarding automation',
        'Enterprise-wide catalog design',
      ],
      micro: 'One request. Complete execution.',
    },
    {
      title: 'Virtual Agents & AI Assistants',
      description: 'Deflect Tier 1 tickets instantly. We embed natural language AI assistants into your enterprise portals and collaboration tools (like Slack/Teams) so employees get immediate answers without human intervention.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'GenAI for Support Operations',
        'Omnichannel virtual agent deployment',
        'Intelligent Knowledge Management',
        'Natural language intent recognition',
      ],
      micro: 'Zero-touch resolution.',
    },
    {
      title: 'Auto-Resolution & Predictive Routing',
      description: 'Stop manually triaging tickets. We deploy machine learning algorithms that instantly categorize, prioritize, and route requests to the exact right resolver group—or execute an auto-resolution script instantly.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Predictive Routing & Prioritization',
        'Auto-Resolution Workflows',
        'AIOps incident correlation',
        'Automated fulfillment scripts',
      ],
      micro: 'Machine-speed triage.',
    },
    {
      title: 'Service Analytics & Insights',
      description: 'Move from reactive reporting to predictive observability. We build real-time executive dashboards that expose SLA breaches, workflow bottlenecks, and user sentiment before they impact enterprise productivity.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-time SLA tracking',
        'Process mining and bottleneck detection',
        'User sentiment and CSAT analytics',
        'Predictive volume forecasting',
      ],
      micro: 'Data-driven service governance.',
    },
    {
      title: 'Shared Services Transformation',
      description: 'Transform isolated back-office functions into high-performing Global Capability Centers. We help enterprises centralize and standardize their disparate service teams into optimized shared service hubs.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Shared services feasibility analysis',
        'Hub-and-spoke model design',
        'Service catalog standardization',
        'Outcome-Based Transformation Programs',
      ],
      micro: 'Scale through centralization.',
    },
  ],

  customSections: (
    <>
      <USMExperienceImperative />
      <USMControlTower />
      <USMWhatWeOfferAccordion />
      <USMAIStatsSection />
      <USMReadinessMagnet />
      <USMExecutionEcosystem />
    </>
  ),

  trustPillars: [
    { title: 'Absolute visibility', tag: 'Observability', description: '360-degree transparency across every enterprise workflow, instantly exposing bottlenecks and SLA risks.' },
    { title: 'Zero-touch resolution', tag: 'Automation', description: 'AI-driven deflection and automated fulfillment scripts that drastically reduce human intervention.' },
    { title: 'Cross-functional speed', tag: 'Integration', description: 'Seamlessly connected IT, HR, and Finance systems that eliminate departmental silos.' },
    { title: 'Frictionless experience', tag: 'UX', description: 'Consumer-grade service portals that make internal enterprise support feel effortless.' },
    { title: 'Predictive governance', tag: 'AI-Powered', description: 'Machine learning algorithms that predict service outages and capacity constraints before they happen.' },
  ],

  whyKangqore: [
    { title: 'Execution, Not Theory', description: 'We don’t just draw operating models on whiteboards. We engineer the underlying platforms, build the automated workflows, and run the managed services to guarantee the outcome.', icon: Target },
    { title: 'Platform Agnostic Expertise', description: 'Whether you run on ServiceNow, BMC, Atlassian, or Salesforce, we have the deep technical architecture capability to integrate your fragmented systems into one fabric.', icon: Boxes },
    { title: 'AI-Native Approach', description: 'We embed decision intelligence and GenAI directly into your service workflows, enabling predictive routing, auto-resolution, and zero-touch ticket deflection.', icon: BrainCircuit },
  ],

  industries: [
    { name: 'Banking & Financial Services', description: 'Secure, compliant service portals for trading desks, branch support, and cross-border operations.' },
    { name: 'Healthcare & Life Sciences', description: 'Unified clinical support desks, facility management workflows, and rapid onboarding for medical staff.' },
    { name: 'Technology & SaaS', description: 'High-velocity developer support, automated provisioning, and seamless IT-to-Engineering issue escalation.' },
    { name: 'Manufacturing & Industrial', description: 'Connected shop-floor support, supply chain vendor portals, and integrated IoT maintenance alerts.' },
  ],

  customFAQs: [
    { question: 'What is Unified Service Management?', answer: 'A model that extends service management beyond IT into HR, Finance, Facilities, Customer Ops, and other business functions through one connected platform.' },
    { question: 'Why does USM matter?', answer: 'It removes silos, improves service consistency, reduces operational costs, and creates better employee and customer experiences.' },
    { question: 'Which departments can be unified?', answer: 'IT, HR, Finance, Procurement, Facilities, Legal, Customer Support, Shared Services, and more.' },
    { question: 'How does AI improve service management?', answer: 'AI automates repetitive tasks, predicts issues, improves routing, powers virtual agents, and delivers faster resolutions.' },
    { question: 'Can Kangqore modernize legacy service models?', answer: 'Yes. We redesign outdated ticketing and fragmented workflows into scalable digital operating models.' },
    { question: 'Do you support ServiceNow and other platforms?', answer: 'Yes. We support ServiceNow, Microsoft ecosystems, BMC, Salesforce, Atlassian, AWS, Google Cloud, IBM, and custom workflow environments.' },
    { question: 'How do you measure success?', answer: 'Through SLA improvements, resolution speed, automation rate, satisfaction scores, productivity gains, and cost reduction.' },
    { question: 'Is this suitable for global enterprises?', answer: 'Yes. Our frameworks are built for multi-region, multi-language, high-scale enterprise environments.' },
    { question: 'How long does a typical USM transformation take?', answer: 'It depends on scope, but our engagements follow a clear cadence: service inventory mapping and maturity assessment in 2 to 3 weeks, platform architecture and pilot design in 4 to 6 weeks, and phased deployment within 90 to 120 days. Most organizations see measurable SLA improvement and ticket deflection gains within the first quarter of deployment.' },
  ],
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 8 Platforms services wired in Phase G (PR 2):
//   - 4 Enterprise Applications-origin services (EPI, Pimcore, Salesforce, ServiceNow)
//   - 4 Business Operations-origin services (GCC, Talent & Organization,
//     Supply Chain, Unified Service Management)
// All consolidated under the canonical Platforms department in 6-dept architecture.
export const PLATFORMS_SECTIONS = {
  'enterprise-integration-platform': enterprisePlatformIntegration,
  'pimcore': pimcore,
  'salesforce': salesforce,
  'servicenow': servicenow,
  'global-capability-centers': globalCapabilityCenters,
  'talent-organization': talentOrganization,
  'supply-chain': supplyChain,
  'unified-services-management': unifiedServicesManagement,
};
