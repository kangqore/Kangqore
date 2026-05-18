// ─── Kangqore Shield — Premium Service Content (Phase G2, PR 2) ──────────────
// Per-service premium presentation layer for Shield's T1 services (excluding
// ai-governance, which is co-located in cognition/sections.jsx due to shared
// AICustomSections asset coupling — its canonical departmentSlug remains
// 'shield' in servicesData).
//
// Each entry is an object that merges over the canonical base service from
// servicesData.js to produce the legacy-template-compatible shape consumed by
// ServicePageTemplate via ServicePageReal's PREMIUM_REGISTRY lookup.
//
// Per DoD #1: do NOT include base identity fields here (name, slug,
// departmentSlug, shortDescription). ServicePageReal re-asserts those after
// the spread and will silently drop any duplicates.
//
// Per DoD #2: legacy titleLine1 + titleHighlight are retained because the
// hero visual treatment depends on them.
//
// Per DoD #3: legacy breadcrumb, department object, and the
// `return <ServicePageTemplate />` JSX are dropped — ServicePageReal owns
// breadcrumb construction (canonical 6-dept) and template rendering.
//
// Schema for each entry (all fields optional unless noted):
//   - titleLine1 (string)             — first line of hero title
//   - titleHighlight (string)         — gradient-highlighted line of hero title
//   - description (string)            — punchy hero description
//   - fullDescription (JSX)           — long-form hero/problem copy
//   - image (string)                  — hero/narrative image URL
//   - videoBackground (string)        — hero video URL
//   - primaryButton (object)          — { text, link }
//   - secondaryButton (object | null) — { text, link } or null to suppress
//   - stats (array)                   — [{ value, label, color }]
//   - hideGenericMidPageCta (bool)    — suppress template's generic CTA
//   - hideGenericFaq (bool)           — suppress template's generic FAQ
//   - highFidelity (object)           — { narrative, philosophy, matrix, schematic }
//   - capabilitiesTitle (string)      — title for the capabilities section
//   - capabilitiesDescription (string)
//   - capabilities (array)            — capability groups (legacy shape)
//   - technologies (array)            — [{ category, items: [] }]
//   - technologiesTitle (string)
//   - technologiesDescription (string)
//   - trustPillars (array)            — [{ title, tag, description }]
//   - trustStrip (string)
//   - whyKangqore (array)             — [{ title, description, icon? }]
//   - whyKangqoreIntro (string)
//   - industries (array)              — [{ name, description?, icon? }]
//   - industriesTitle (string)
//   - customFAQs (array)              — [{ question, answer }]
//   - ctaTitle (string)
//   - ctaDescription (string)
//   - ctaButtonText (string)
//   - preMatrixSection (JSX | null)
//   - customSections (JSX)
//   - postCapabilitiesSections (JSX)
//   - postIndustrySections (JSX)
//   - postFAQSections (JSX)
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Layers, Search, ShieldCheck, Zap, TrendingUp, Shield, BarChart3, Leaf,
  Settings, Building2, Heart, Factory, ShoppingCart, Flame,
  Activity, Code2, Database, MonitorSmartphone,
} from 'lucide-react';
import {
  FinancePhilosophyBackground,
  FinanceRelatedExpertise,
  FinanceWhySection,
  FinanceValueDeliver,
  FinanceDiamondCoESection,
  FinanceDeliveryModel,
  FinanceExecutionEcosystem,
  FinanceFutureReadySection,
} from './FinanceRiskCustomSections';
import { QECustomSectionsBlock1, QECustomSectionsBlock2 } from './QECustomSections';
import { SHIELD_IT_SECURITY_AND_OT_SECTIONS } from './it-security-and-ot-services';

// ─── finance-risk-management (Shield) ─────────────────────────────────────────
const financeRiskManagement = {
  titleLine1: 'Finance & Risk',
  titleHighlight: 'Management.',
  description:
    'Market volatility, regulatory pressure, fragmented data, and rising decision velocity are forcing finance and risk leaders to operate beyond traditional control functions. Kangqore helps enterprises modernize finance platforms, strengthen compliance, improve planning accuracy, operationalize ESG measurement, and scale finance operations with intelligent automation, integrated data, and AI-enabled decision support.',
  fullDescription: (
    <div className="space-y-4">
      <p className="font-light tracking-tight leading-snug opacity-80">
        We help CFOs and Chief Risk Officers dismantle the operational drag caused by legacy platforms, siloed data, and manual compliance processes — replacing them with integrated, AI-enabled operating models.
      </p>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Our engagements span ERP and finance platform transformation (SAP S/4HANA, Oracle Cloud), GRC modernization (ServiceNow, RSA Archer), ESG data architecture, enterprise performance management (Anaplan, OneStream), and managed finance operations — delivered under a single governance model with measurable business outcomes.
      </p>
    </div>
  ),
  image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Talk to Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Our Services', link: '#capabilities' },

  stats: [
    { value: '75%', label: 'Faster Report Delivery', color: 'text-cyan-400' },
    { value: '57%', label: 'Less Time Gathering Data', color: 'text-blue-400' },
    { value: '42%', label: 'Finance Automation Potential', color: 'text-emerald-400' },
    { value: '25%+', label: 'Forecast Accuracy Improvement', color: 'text-purple-400' },
  ],

  trustStrip:
    'Helping enterprises modernize finance platforms, strengthen risk governance, operationalize ESG measurement, improve planning accuracy, and scale finance operations with AI-enabled decision support and managed execution.',

  ctaTitle: 'Ready to Modernize Finance and Risk?',
  ctaDescription:
    'Build a finance and risk operating model that is more resilient, more data-driven, and more valuable to the enterprise.',
  ctaButtonText: 'Schedule a Strategy Session',

  highFidelity: {
    narrative: {
      badge: 'FINANCE & RISK :: STRATEGIC MODERNIZATION',
      titleLine1: 'Turn Finance',
      titleHighlight: '& Risk',
      titleLine2: 'Into a Growth Engine',
      description:
        'Market volatility, regulatory pressure, fragmented data, and rising decision velocity are forcing finance and risk leaders to operate beyond traditional control functions. Kangqore helps enterprises modernize finance platforms, strengthen compliance, and scale operations with AI-enabled decision support.',
      bottleneckLabel: 'The Complexity Trap',
      bottleneckText:
        'Legacy reporting, fragmented risk data, manual compliance processes, and disconnected planning systems create operational drag, blind spots, and decision latency across the finance and risk function.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified modernization model that connects platform transformation, intelligent automation, ESG readiness, performance management, and managed execution into one governed operating framework.',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Finance Resilience',
      statusValue: 'DECISION-READY',
    },
    philosophy: {
      icon: <TrendingUp className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Modernize with Control.',
      titleHighlight: 'Scale with Intelligence.',
      description:
        'We replace fragmented finance and risk functions with integrated, decision-ready operating models designed for resilience and growth.',
      bgElement: <FinancePhilosophyBackground />,
      pills: ['Risk Governance', 'Finance Platform', 'ESG Readiness', 'Predictive Planning'],
      features: [
        { title: 'Risk Governance', label: 'Compliance & Controls', icon: <Shield className="w-5 h-5 text-gray-400" />, content: 'Modernize risk operations with AI-led detection, automated controls, and regulatory change management that keeps pace with evolving compliance landscapes.' },
        { title: 'Platform Redesign', label: 'Finance Architecture', icon: <Settings className="w-5 h-5 text-gray-400" />, content: 'Re-architect finance platforms from rigid, monolithic environments to modular, interoperable systems that support planning, analytics, compliance, and scalable growth.' },
        { title: 'ESG Intelligence', label: 'Sustainability Data', icon: <Leaf className="w-5 h-5 text-gray-400" />, content: 'Build auditable ESG data foundations with automated workflows, stronger controls, and decision integration across finance, risk, and operations.' },
        { title: 'Predictive Planning', label: 'Performance Management', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Connect planning, forecasting, and reporting into an AI-supported performance management system for faster, more accurate enterprise decisions.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: Finance_Risk_V5',
      title: 'Our Execution Matrix.',
      subtext:
        'A connected system for moving from fragmented finance and risk operations to governed, decision-ready operating models.',
      layers: [
        { title: 'Assess', id: 'FR_DISC', icon: <Search />, desc: 'Risk profile assessment, compliance gap analysis, finance platform evaluation, and ESG readiness audit.' },
        { title: 'Architect', id: 'FR_ARCH', icon: <Layers />, desc: 'Future-state finance vision, platform roadmap, operating model redesign, and governance framework design.' },
        { title: 'Execute', id: 'FR_EXE', icon: <Zap />, desc: 'Platform migration, automation deployment, reporting modernization, and managed services activation.' },
        { title: 'Evolve', id: 'FR_EVL', icon: <ShieldCheck />, desc: 'Continuous compliance monitoring, predictive analytics tuning, ESG disclosure readiness, and operational optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Govern Resilience.',
      titleHighlight: 'Accelerate Decisions.',
      description:
        'Your finance and risk function should be a strategic asset, not an operational burden. We build the foundations for decision-ready, compliance-confident operations.',
      stats: [
        { label: 'Report Delivery', val: '75% Faster' },
        { label: 'Data Gathering', val: '57% Less' },
        { label: 'Forecast Accuracy', val: '25%+ Better' },
      ],
    },
  },

  trustPillars: [
    { title: 'AI-enabled risk detection and response', tag: 'Risk Intelligence', description: 'Use automation and AI to detect emerging risks faster, reduce manual control workload, and strengthen regulatory response.' },
    { title: 'Platform modernization with minimal disruption', tag: 'Transformation', description: 'Re-architect finance platforms without business interruption through phased migration, parallel operations, and governed rollout.' },
    { title: 'Auditable ESG data and reporting readiness', tag: 'Sustainability', description: 'Build ESG data foundations with stronger controls, automated workflows, and compliance-ready disclosure capabilities.' },
    { title: 'Connected planning and predictive forecasting', tag: 'Performance', description: 'Move from static planning to driver-based, AI-supported forecasting and scenario modeling across the enterprise.' },
    { title: 'Managed finance operations at scale', tag: 'Operations', description: 'Improve payables, receivables, close cycles, compliance, and working-capital performance with managed digital operations.' },
    { title: 'Governance that scales with complexity', tag: 'Control', description: 'Build governance frameworks that strengthen as your finance and risk landscape grows, ensuring control without operational drag.' },
  ],

  whyKangqore: [
    { title: 'Strategy-Led Execution', description: 'We connect finance and risk strategy directly to implementation — no gap between advisory and delivery.', icon: TrendingUp },
    { title: 'Platform + Process + Data Under One Model', description: 'We redesign finance platforms, business processes, and data architecture together — not as separate workstreams.', icon: Layers },
    { title: 'AI-Enabled, Control-Conscious', description: 'We bring AI and automation to finance and risk modernization while maintaining governance integrity and compliance confidence.', icon: ShieldCheck },
  ],

  industries: [
    { name: 'Banking & Financial Services', description: 'Regulatory compliance, risk operations, and finance transformation for banks, NBFCs, and financial institutions.', icon: Building2 },
    { name: 'Insurance', description: 'Claims risk management, actuarial modernization, regulatory reporting, and finance platform transformation.', icon: Shield },
    { name: 'Healthcare & Life Sciences', description: 'Compliance readiness, ESG reporting, finance operations, and risk management for pharmaceutical and healthcare enterprises.', icon: Heart },
    { name: 'Manufacturing', description: 'Product costing, supply chain risk, working capital optimization, and finance managed services for manufacturing operations.', icon: Factory },
    { name: 'Energy & Utilities', description: 'ESG measurement, sustainability reporting, regulatory compliance, and enterprise performance management.', icon: Flame },
    { name: 'Retail & Consumer', description: 'Revenue management, margin optimization, compliance modernization, and financial close acceleration.', icon: ShoppingCart },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription:
    'Every finance and risk transformation follows a structured path — from diagnostic and operating model design through data architecture, intelligent automation, and continuous governance. Here is how we work.',
  capabilities: [
    {
      title: 'Finance & Risk Diagnostic',
      description:
        'We begin every engagement with a structured diagnostic that maps current-state maturity across platform, process, data, controls, and talent — identifying high-impact transformation levers before any solution design begins.',
      bgImage: '/images/capabilities/finance.png',
      items: [
        'Maturity assessment across 5 finance dimensions',
        'Control and compliance gap analysis',
        'Technology landscape and integration audit',
        'Prioritized transformation roadmap',
      ],
      micro: 'Diagnose before you decide.',
    },
    {
      title: 'Operating Model Redesign',
      description:
        'We redesign finance and risk operating models to eliminate functional silos, clarify accountability, and create structures that support faster decision-making, better data flow, and higher control confidence.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Target operating model definition',
        'Role and accountability mapping',
        'Shared services and CoE design',
        'Change readiness and adoption planning',
      ],
      micro: 'Structure drives performance.',
    },
    {
      title: 'Data Architecture & Intelligence',
      description:
        'Finance transformation fails without data transformation. We build data architectures that unify fragmented sources, enable real-time visibility, support AI-driven analytics, and meet compliance and auditability requirements.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Unified finance data model design',
        'Master data management strategy',
        'Real-time reporting and analytics pipelines',
        'AI/ML model deployment for risk and forecasting',
      ],
      micro: 'Clean data powers clear decisions.',
    },
    {
      title: 'Intelligent Automation & AI',
      description:
        'We identify and implement automation opportunities across finance and risk workflows — from reconciliation and close processes to risk detection and compliance reporting — using RPA, AI, and intelligent orchestration.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Process mining and automation opportunity mapping',
        'RPA deployment for transactional workflows',
        'AI-enabled anomaly detection and risk scoring',
        'Intelligent document processing for compliance',
      ],
      micro: 'Automate the repetitive, elevate the strategic.',
    },
    {
      title: 'Governance & Continuous Assurance',
      description:
        'We build governance frameworks that ensure transformation gains are sustained — with embedded controls, continuous monitoring, KPI tracking, and escalation structures that keep finance and risk operating at peak performance.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Control framework design and embedding',
        'Continuous monitoring and assurance models',
        'KPI dashboards and executive reporting',
        'Post-go-live optimization and evolution support',
      ],
      micro: 'Governance that strengthens over time.',
    },
  ],

  technologies: [
    { category: 'ERP & Finance Platforms', items: ['SAP S/4HANA', 'Oracle Cloud ERP', 'Workday', 'NetSuite', 'Microsoft Dynamics 365'] },
    { category: 'EPM & Planning', items: ['Anaplan', 'Oracle EPM Cloud', 'SAP Analytics Cloud', 'Adaptive Planning', 'OneStream'] },
    { category: 'GRC & Risk', items: ['SAP GRC', 'ServiceNow GRC', 'RSA Archer', 'MetricStream', 'Diligent'] },
    { category: 'Automation & AI', items: ['UiPath', 'Blue Prism', 'Automation Anywhere', 'Python', 'TensorFlow', 'Azure AI'] },
    { category: 'Data & Analytics', items: ['Power BI', 'Tableau', 'Snowflake', 'Databricks', 'Azure Synapse'] },
    { category: 'ESG & Reporting', items: ['Workiva', 'Persefoni', 'Sphera', 'Enablon', 'SAP Sustainability Control Tower'] },
  ],

  customFAQs: [
    {
      question: 'How does Kangqore approach finance platform transformation without disrupting business operations?',
      answer: 'We use a phased migration model with parallel operations, governed rollout, and continuous validation. The goal is to modernize the finance platform while maintaining full operational continuity — no big-bang cutovers or extended blackout periods.',
    },
    {
      question: 'Can you help with both risk compliance and finance operations under one engagement?',
      answer: 'Yes. Kangqore brings together risk modernization, compliance automation, finance platform transformation, and managed operations under a single governance model. This unified approach eliminates the gaps that occur when risk and finance initiatives are run as separate workstreams.',
    },
    {
      question: 'How do you help organizations prepare for evolving ESG disclosure requirements?',
      answer: 'We build ESG data foundations that are auditable, automated, and integrated with finance and risk functions. This includes defining the measurement strategy, creating data models, automating reporting workflows, and ensuring compliance readiness for evolving regulatory frameworks.',
    },
    {
      question: 'What does enterprise performance management look like with Kangqore?',
      answer: 'We help finance teams move from static planning and manual reporting to connected, AI-supported performance management. This includes integrated planning frameworks, driver-based forecasting, scenario modeling, and self-service reporting with gen-AI insights.',
    },
    {
      question: 'How do you measure the success of a finance and risk transformation?',
      answer: 'We measure success through operational metrics: report delivery speed, forecast accuracy improvement, compliance cost reduction, risk detection lead time, close cycle acceleration, and working-capital performance — all tied to specific business outcomes defined at the start of each engagement.',
    },
  ],

  preMatrixSection: null,
  customSections: (
    <div className="flex flex-col w-full">
      <FinanceWhySection />
      <FinanceValueDeliver />
      <FinanceDiamondCoESection />
    </div>
  ),
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <FinanceDeliveryModel />
    </div>
  ),
  postIndustrySections: (
    <div className="flex flex-col w-full">
      <FinanceExecutionEcosystem />
      <FinanceFutureReadySection />
    </div>
  ),
  postFAQSections: (
    <div className="flex flex-col w-full">
      <FinanceRelatedExpertise />
    </div>
  ),
};

// ─── quality-engineering-assurance (Shield) ───────────────────────────────────
const qualityEngineeringAssurance = {
  titleLine1: 'Quality',
  titleHighlight: 'Engineering & Assurance.',
  videoBackground: '/videos/network-4916894.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">At Kangqore, we transform quality assurance from a manual bottleneck into an accountable, strategic enabler.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        True delivery velocity requires zero-defect confidence at scale. Our Quality Engineering practice strips out manual, siloed testing routines. We embed shift-left methodologies, algorithmic test automation, and SRE chaos engineering directly into your CI/CD pipelines, ensuring your mission-critical systems execute flawlessly under real-world pressure.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',

  primaryButton: { text: 'Review Your Quality Engineering Gaps', link: '/contact' },
  secondaryButton: { text: 'View Capabilities', link: '#capabilities' },

  stats: [
    { value: 'Zero-Defect', label: 'Continuous Delivery', color: 'text-blue-500' },
    { value: 'Automated', label: 'Test Coverage', color: 'text-brand-blue' },
    { value: 'Governed', label: 'Enterprise Security', color: 'text-indigo-500' },
    { value: 'Accelerated', label: 'Release Cadence', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'QUALITY ENGINEERING :: ACCOUNTABLE DELIVERY',
      titleLine1: 'Engineer Reliability.',
      titleHighlight: 'Stop the Bleeding.',
      titleLine2: '',
      description:
        'Siloed, reactive QA can no longer secure the modern enterprise perimeter. Sustained velocity requires anticipating failure before code commit using self-healing pipelines, predictive defect analytics, and exhaustive infrastructure automation. We ensure rapid innovation amplifies—rather than compromises—absolute operational stability.',
      bottleneckLabel: 'The Operational Pressure',
      bottleneckText:
        'Manual regression testing takes weeks. CI/CD pipelines fracture under load. Production rollbacks erode user trust and bleed revenue.',
      requirementLabel: 'The Execution Standard',
      requirementText:
        'A shift-left, TCoE-governed Quality Engineering skeleton that aggressively validates everything from deep API contracts to omnichannel UX instantly.',
      image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=1200',
      statusLabel: 'System Reliability',
      statusValue: 'Accountable',
    },
    philosophy: {
      icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
      title: 'The Kangqore',
      titleHighlight: 'Assurance Skeleton™.',
      description:
        'We do not just find bugs; we architect the skeleton that prevents them. Our Assurance Skeleton™ orchestrates 14 specialized validation protocols covering underlying data resilience to edge telemetry, providing unyielding coverage without the bloat.',
      pills: ['DevOps CI/CD Integration', 'Algorithmic Test Automation', 'SRE & Chaos Engineering', 'Outcome-Based TaaS'],
    },
    matrix: {
      engineId: 'Engine :: KG_QUAL_V4',
      title: '4-Tier Observability Architecture',
      subtext: 'We map our specialized capabilities into four comprehensive automated validation controls.',
      layers: [
        { title: 'Core Boundaries', id: 'QA_APP', icon: <Code2 />, desc: 'End-to-end CI/CD gating, decoupling Microservices contracts, and verifying deep ERP package logic.' },
        { title: 'Data Resilience', id: 'QA_DATA', icon: <Database />, desc: 'High-volume ETL sanitization audits, multi-cloud disaster recovery simulation, and PII test data masking.' },
        { title: 'Experience Fidelity', id: 'QA_EXP', icon: <MonitorSmartphone />, desc: 'Flawless omnichannel state synchronization, frictionless UX journey tracking, and WCAG A11y compliance.' },
        { title: 'Performance Gravity', id: 'QA_PERF', icon: <Activity />, desc: 'Algorithmic test self-healing, Site Reliability Engineering (SRE) load profiling, and managed TaaS execution.' },
      ],
    },
    schematic: {
      titleLine1: 'Automate',
      titleHighlight: 'Confidence.',
      description:
        'We de-risk every deployment. By removing manual testing blockers, we reduce the total cost of quality while accelerating your release cycles.',
      stats: [
        { label: 'Defect Leakage', val: 'MINIMIZED' },
        { label: 'Test Coverage', val: 'MAXIMIZED' },
        { label: 'Automation', val: 'SCALED' },
      ],
    },
  },

  technologiesTitle: 'Tools & Technologies We Excel In',
  technologiesDescription:
    "A platform-agnostic automation stack integrating the world's leading Quality Engineering tools.",
  technologies: [
    { category: 'Test Automation', items: ['Selenium', 'Cypress', 'Playwright', 'Appium', 'Katalon'] },
    { category: 'CI/CD & DevOps', items: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'CircleCI'] },
    { category: 'Performance Engineering', items: ['JMeter', 'Gatling', 'LoadRunner', 'k6', 'NeoLoad'] },
    { category: 'AI & Cognitive QA', items: ['Tricentis Tosca', 'Mabl', 'Testim', 'Applitools', 'AccelQ'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Kubernetes'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Agile & DevOps Testing',
      description:
        'We tear down the friction between development and release. By burying automated testing natively inside your CI/CD pipelines, we force code validation instantly on commit—preventing defects from infecting production and giving you true DevOps velocity.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Automated code-commit gating',
        'Shift-left pipeline instrumentation',
        'Continuous validation integration',
        'Zero-touch deployment testing',
        'Regression automation decoupling',
      ],
    },
    {
      title: 'Algorithmic Test Automation',
      description:
        'We feed your historical deployment data into predictive models to identify regression risks before code ships. Automated suites self-heal broken locators natively, eliminating the massive manual maintenance drag associated with legacy scripts.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Algorithmic script self-healing',
        'Predictive regression routing',
        'Defect clustering analytics',
        'Synthetic test data provisioning',
        'Cognitive execution prioritization',
      ],
    },
    {
      title: 'API & Microservices Architecture Testing',
      description:
        'We lock down the isolated communication pathways of decoupled systems. By enforcing hard contract compliance and strict payload assertions, we ensure that integrating new microservices never breaks the broader enterprise platform.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'GraphQL & REST contract validation',
        'Microservice isolation stubbing',
        'Automated payload assertions',
        'Decoupled system orchestrations',
        'API endpoint security gating',
      ],
    },
    {
      title: 'Cloud Infrastructure Validation',
      description:
        'We validate the actual infrastructure code—not just the app. We verify Terraform provisioning, cloud migration resilience, and massive multi-tenant boundaries across AWS, Azure, and GCP so system scaling never causes data leaks or latency.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Infrastructure-as-Code (IaC) linting',
        'Multi-cloud resilience proofs',
        'Disaster recovery sequence simulation',
        'Serverless function timing',
        'Cloud migration integrity audits',
      ],
    },
    {
      title: 'Connected Device (IoT) Auditing',
      description:
        'We map and stress-test the entire physical-to-digital boundary. By covering hardware sensor telemetry, firmware update resilience, and edge protocol compliance, we ensure connected products never fail in the field under load.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Hardware-to-cloud telemetry latency',
        'Over-The-Air (OTA) firmware resilience',
        'Sensor network vulnerability scans',
        'MQTT/CoAP protocol compliance',
        'Edge component failover testing',
      ],
    },
    {
      title: 'UX Fidelity & Accessibility Assurance',
      description:
        'We audit the human-system boundary. By strictly parsing WCAG (A11y) accessibility laws, tracking frictionless journey completion rates, and measuring render fidelities across fragmented browsers, we guarantee users actually convert.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'WCAG accessibility strict auditing',
        'Frictionless user journey assertions',
        'Cross-browser render fidelity checking',
        'A/B sequence logic validation',
        'Hyper-personalization engine testing',
      ],
    },
    {
      title: 'Data Reliability Engineering',
      description:
        'We bulletproof executive decision-making data. By enforcing high-volume ETL pipeline sanitization constraints and automating data lake integrity checks, we guarantee the dashboards your leaders rely on are mathematically flawless.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'High-volume ETL sanitization automation',
        'Data warehouse schema validation',
        'BI dashboard render assertions',
        'Real-time streaming (Kafka) checks',
        'Data lake corruption audits',
      ],
    },
    {
      title: 'UI Robotic Automation (RPA)',
      description:
        'We eradicate the multi-week manual UI testing grind. By constructing highly maintainable, data-driven automation frameworks executing in headless browser swarms, we compress week-long regression cycles into thirty minutes.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Headless browser swarm execution',
        'UI robotic automation refactoring',
        'Custom automation framework modeling',
        'Data-driven script decoupling',
        'Continuous automation telemetry',
      ],
    },
    {
      title: 'Omnichannel & Mobility Validation',
      description:
        'We eliminate the risk of the fragmented device market. By hooking your release cycles directly into massive real-device clouds, we sync and validate omnichannel state paths (e.g. mobile to web to wearable) dynamically.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-device cloud integration',
        'Native & hybrid layout automation',
        'Omnichannel state path syncing',
        'Network throttling thresholds',
        'Wearable OS compliance testing',
      ],
    },
    {
      title: 'ERP Migration & Workflow Assurance',
      description:
        'We de-risk massive monolithic core upgrades. By validating specific SAP, Oracle, and Dynamics workflows—while enforcing deeply complex Role-Based Access Controls (RBAC)—we prevent enterprise software migrations from paralyzing daily operations.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Automated SAP/Oracle workflow verification',
        'ERP cross-module data integration',
        'Role-Based Access Control strict enforcement',
        'Custom ERP configuration mapping',
        'Zero-downtime patch validation',
      ],
    },
    {
      title: 'Quality Transformation Consulting',
      description:
        'We do not just execute test scripts; we rip out broken testing cultures. We establish Testing Centers of Excellence (TCoE) that mandate strict engineering protocols, aligning QA output directly to business revenue SLAs.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Testing Center of Excellence (TCoE) setup',
        'Agile maturity and bottleneck assessment',
        'Automation toolchain consolidation',
        'Quality metric & SLA linking',
        'Legacy testing footprint re-engineering',
      ],
    },
    {
      title: 'Site Reliability Engineering (SRE)',
      description:
        'We aggressively break your systems on purpose. By unleashing extreme load profiling, latency injections, and strict blast-radius chaos engineering, we map the exact breaking limits so you can tune your infrastructure before Black Friday.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Service Level Objective (SLO) auditing',
        'Blast-radius chaos engineering',
        'Extreme load & bottleneck tuning',
        'Latency spike and tolerance injection',
        'Redundant failover verification',
      ],
    },
    {
      title: 'Test Data Management & Masking',
      description:
        'We remove the critical bottleneck blocking testing speed: dirty data. We architect pipelines that automatically provision synthetic databases and stringently mask PII, ensuring GDPR/HIPAA compliance never delays regression execution.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Synthetic data generative pipelines',
        'PII data masking algorithms',
        'Database subsetting and cloning',
        'Automated edge-case provisioning',
        'GDPR/HIPAA test footprint sanitization',
      ],
    },
    {
      title: 'Managed Validation Services (TaaS)',
      description:
        'We absorb the execution risk entirely. In our Testing-as-a-Service model, Kangqore manages the infrastructure, provides the elite engineer pools elastically, and answers directly for the final release certification outcomes.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Outcome-based execution SLA models',
        'On-demand testing engineering scale',
        'Zero-capex testing infrastructure',
        'Pay-per-use automation resources',
        'Managed release certification gating',
      ],
    },
  ],

  trustPillars: [
    { title: 'Shift-left pipeline confidence before release', tag: 'Automation', description: 'Embed validation gates directly into CI/CD triggers so defects surface before production, not after.' },
    { title: 'Self-healing algorithmic resilience', tag: 'Intelligence', description: 'Eliminate manual script maintenance with AI frameworks that identify regression risks and repair execution paths autonomously.' },
    { title: 'Outcome-based delivery accountability', tag: 'Governance', description: 'SLA-driven TaaS models that measure success by release certification outcomes, not script execution counts.' },
  ],

  whyKangqoreIntro:
    'Kangqore should read like a company that knows what it costs to delay, what it takes to deliver, and what it means to own the outcome. We completely reject low-cost, reactive testing models.',
  whyKangqore: [
    {
      title: 'We Eliminate Operational Drag',
      description: 'We don’t just write test scripts; we rip out broken testing cultures. We establish Testing Centers of Excellence (TCoE) that mandate strict engineering protocols so your developers spend time building, not debugging.',
    },
    {
      title: 'Algorithmic Self-Healing',
      description: 'The era of manually repairing broken locators every UI update is over. We integrate robust AI frameworks that identify regression risks dynamically and repair their own execution paths without human intervention.',
    },
    {
      title: 'Elite Delivery Accountability',
      description: 'We partner best where execution quality, modernization depth, and zero-defect deployments matter. We absorb the execution risk in our SLA-driven models, taking direct ownership over final release certification outcomes.',
    },
    {
      title: 'Unified SRE Depth',
      description: 'We test limits before you hit them. From extreme chaos engineering mapping the blast radius of a failure, to deep microservice state assertions, we don’t let your customers find your system bottlenecks.',
    },
  ],

  industriesTitle: 'Industries We Ensure Quality For',
  industries: [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Telecommunications & Media' },
    { name: 'Automotive & Manufacturing' },
    { name: 'Technology & SaaS' },
  ],

  solutions: [],

  customFAQs: [
    {
      question: 'How is Quality Engineering different from traditional QA?',
      answer: 'Traditional QA is a reactive, manual phase that occurs after code is written. Quality Engineering (QE) is proactive. It leverages automation, CI/CD integration, and AI to continuously evaluate software quality throughout the entire development lifecycle, preventing defects rather than just finding them.',
    },
    {
      question: 'What is your approach to automated testing?',
      answer: 'We deploy a Risk-Based Automation strategy. Instead of attempting 100% automation (which is inefficient to maintain), we target the critical business paths and high-risk integrations. We utilize leading frameworks (Selenium, Appium, Cypress) integrated directly into your DevOps pipelines.',
    },
    {
      question: 'Can you handle testing for complex legacy migrations?',
      answer: 'Yes. Our ERP Package Testing and Platform Engineering practices specialize in de-risking massive monolithic-to-microservices migrations. We ensure data integrity, API contract compliance, and zero downtime during the transition.',
    },
    {
      question: 'Do you offer fully managed testing services?',
      answer: 'Yes, through our Testing as a Service (TaaS) model. We take complete ownership of your testing function, providing an SLA-driven, outcome-based service that scales dynamically based on your release velocity.',
    },
  ],

  customSections: <QECustomSectionsBlock1 />,
  postFAQSections: <QECustomSectionsBlock2 />,
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 4 Shield services wired here:
//   - finance-risk-management (T1, already wired)
//   - quality-engineering-assurance (T1, already wired)
//   - it-security-services (Phase B / KQ-SER-SHIELD-001, lifted from
//     legacy cybersecurity/ITSecurityServices.jsx)
//   - operation-technology (Phase B / KQ-SER-SHIELD-001, lifted from legacy
//     infrastructure-networks-operations/OperationTechnology.jsx, with GSAP
//     animations isolated in OTAnimatedCoESection wrapper using gsap.context()
//     scoped cleanup)
//
// AI Governance (also Shield-canonical) is co-located in cognition/sections.jsx
// due to shared AICustomSections asset coupling — see that file's header.
export const SHIELD_SECTIONS = {
  'finance-risk-management': financeRiskManagement,
  'quality-engineering-assurance': qualityEngineeringAssurance,
  ...SHIELD_IT_SECURITY_AND_OT_SECTIONS,
};
