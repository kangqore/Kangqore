import React from 'react';
import { Layers, Search, ShieldCheck, Zap, Target, Bot, Activity, BrainCircuit, CheckCircle2, Cpu, Rocket, MonitorSmartphone, Code2, Network, RadioTower, BarChart3, Globe2, Shield, TrendingUp, Award, Workflow, Database, RefreshCw, ServerCog, Wifi, Users, Smartphone, FileSpreadsheet, Scale, HardDrive, Infinity } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';
import { QECustomSectionsBlock1, QECustomSectionsBlock2 } from './components/QECustomSections';

const QualityEngineeringAssurance = () => {
  // ============================================
  // SERVICE IDENTITY — MNC-GRADE POSITIONING
  // ============================================
  const service = {
    name: 'Quality Engineering & Assurance',
    titleLine1: 'Quality',
    titleHighlight: 'Engineering & Assurance.',
    slug: 'quality-engineering-assurance',
    shortDescription: 'We modernize fragmented testing pipelines so engineering teams can release faster, eliminate manual regression drag, and maintain absolute control over security and scale.',
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
    stats: [
      { value: 'Zero-Defect', label: 'Continuous Delivery', color: 'text-blue-500' },
      { value: 'Automated', label: 'Test Coverage', color: 'text-brand-blue' },
      { value: 'Governed', label: 'Enterprise Security', color: 'text-indigo-500' },
      { value: 'Accelerated', label: 'Release Cadence', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Review Your Quality Engineering Gaps", link: "/contact" },
    secondaryButton: { text: "View Capabilities", link: "#capabilities" },

    // ============================================
    // HIGH-FIDELITY HERO — BOARDROOM-LEVEL NARRATIVE
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'QUALITY ENGINEERING :: ACCOUNTABLE DELIVERY',
        titleLine1: 'Engineer Reliability.',
        titleHighlight: 'Stop the Bleeding.',
        titleLine2: '',
        description: 'Siloed, reactive QA can no longer secure the modern enterprise perimeter. Sustained velocity requires anticipating failure before code commit using self-healing pipelines, predictive defect analytics, and exhaustive infrastructure automation. We ensure rapid innovation amplifies—rather than compromises—absolute operational stability.',
        bottleneckLabel: 'The Operational Pressure',
        bottleneckText: 'Manual regression testing takes weeks. CI/CD pipelines fracture under load. Production rollbacks erode user trust and bleed revenue.',
        requirementLabel: 'The Execution Standard',
        requirementText: 'A shift-left, TCoE-governed Quality Engineering skeleton that aggressively validates everything from deep API contracts to omnichannel UX instantly.',
        image: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=1200',
        statusLabel: 'System Reliability',
        statusValue: 'Accountable'
      },
      philosophy: {
        icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
        title: 'The Kangqore',
        titleHighlight: 'Assurance Skeleton™.',
        description: 'We do not just find bugs; we architect the skeleton that prevents them. Our Assurance Skeleton™ orchestrates 14 specialized validation protocols covering underlying data resilience to edge telemetry, providing unyielding coverage without the bloat.',
        pills: ['DevOps CI/CD Integration', 'Algorithmic Test Automation', 'SRE & Chaos Engineering', 'Outcome-Based TaaS']
      },
      matrix: {
        engineId: 'Engine :: KG_QUAL_V4',
        title: '4-Tier Observability Architecture',
        subtext: 'We map our specialized capabilities into four comprehensive automated validation controls.',
        layers: [
          { title: 'Core Boundaries', id: 'QA_APP', icon: <Code2 />, desc: 'End-to-end CI/CD gating, decoupling Microservices contracts, and verifying deep ERP package logic.' },
          { title: 'Data Resilience', id: 'QA_DATA', icon: <Database />, desc: 'High-volume ETL sanitization audits, multi-cloud disaster recovery simulation, and PII test data masking.' },
          { title: 'Experience Fidelity', id: 'QA_EXP', icon: <MonitorSmartphone />, desc: 'Flawless omnichannel state synchronization, frictionless UX journey tracking, and WCAG A11y compliance.' },
          { title: 'Performance Gravity', id: 'QA_PERF', icon: <Activity />, desc: 'Algorithmic test self-healing, Site Reliability Engineering (SRE) load profiling, and managed TaaS execution.' }
        ]
      },
      schematic: {
        titleLine1: 'Automate',
        titleHighlight: 'Confidence.',
        description: 'We de-risk every deployment. By removing manual testing blockers, we reduce the total cost of quality while accelerating your release cycles.',
        stats: [
          { label: 'Defect Leakage', val: 'MINIMIZED' },
          { label: 'Test Coverage', val: 'MAXIMIZED' },
          { label: 'Automation', val: 'SCALED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform physical products with digital capabilities and connected experiences.'
  };

  const capabilities = [
    {
      title: 'Agile & DevOps Testing',
      description: 'We tear down the friction between development and release. By burying automated testing natively inside your CI/CD pipelines, we force code validation instantly on commit—preventing defects from infecting production and giving you true DevOps velocity.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Automated code-commit gating',
        'Shift-left pipeline instrumentation',
        'Continuous validation integration',
        'Zero-touch deployment testing',
        'Regression automation decoupling'
      ]
    },
    {
      title: 'Algorithmic Test Automation',
      description: 'We feed your historical deployment data into predictive models to identify regression risks before code ships. Automated suites self-heal broken locators natively, eliminating the massive manual maintenance drag associated with legacy scripts.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Algorithmic script self-healing',
        'Predictive regression routing',
        'Defect clustering analytics',
        'Synthetic test data provisioning',
        'Cognitive execution prioritization'
      ]
    },
    {
      title: 'API & Microservices Architecture Testing',
      description: 'We lock down the isolated communication pathways of decoupled systems. By enforcing hard contract compliance and strict payload assertions, we ensure that integrating new microservices never breaks the broader enterprise platform.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'GraphQL & REST contract validation',
        'Microservice isolation stubbing',
        'Automated payload assertions',
        'Decoupled system orchestrations',
        'API endpoint security gating'
      ]
    },
    {
      title: 'Cloud Infrastructure Validation',
      description: 'We validate the actual infrastructure code—not just the app. We verify Terraform provisioning, cloud migration resilience, and massive multi-tenant boundaries across AWS, Azure, and GCP so system scaling never causes data leaks or latency.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Infrastructure-as-Code (IaC) linting',
        'Multi-cloud resilience proofs',
        'Disaster recovery sequence simulation',
        'Serverless function timing',
        'Cloud migration integrity audits'
      ]
    },
    {
      title: 'Connected Device (IoT) Auditing',
      description: 'We map and stress-test the entire physical-to-digital boundary. By covering hardware sensor telemetry, firmware update resilience, and edge protocol compliance, we ensure connected products never fail in the field under load.',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Hardware-to-cloud telemetry latency',
        'Over-The-Air (OTA) firmware resilience',
        'Sensor network vulnerability scans',
        'MQTT/CoAP protocol compliance',
        'Edge component failover testing'
      ]
    },
    {
      title: 'UX Fidelity & Accessibility Assurance',
      description: 'We audit the human-system boundary. By strictly parsing WCAG (A11y) accessibility laws, tracking frictionless journey completion rates, and measuring render fidelities across fragmented browsers, we guarantee users actually convert.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'WCAG accessibility strict auditing',
        'Frictionless user journey assertions',
        'Cross-browser render fidelity checking',
        'A/B sequence logic validation',
        'Hyper-personalization engine testing'
      ]
    },
    {
      title: 'Data Reliability Engineering',
      description: 'We bulletproof executive decision-making data. By enforcing high-volume ETL pipeline sanitization constraints and automating data lake integrity checks, we guarantee the dashboards your leaders rely on are mathematically flawless.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'High-volume ETL sanitization automation',
        'Data warehouse schema validation',
        'BI dashboard render assertions',
        'Real-time streaming (Kafka) checks',
        'Data lake corruption audits'
      ]
    },
    {
      title: 'UI Robotic Automation (RPA)',
      description: 'We eradicate the multi-week manual UI testing grind. By constructing highly maintainable, data-driven automation frameworks executing in headless browser swarms, we compress week-long regression cycles into thirty minutes.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Headless browser swarm execution',
        'UI robotic automation refactoring',
        'Custom automation framework modeling',
        'Data-driven script decoupling',
        'Continuous automation telemetry'
      ]
    },
    {
      title: 'Omnichannel & Mobility Validation',
      description: 'We eliminate the risk of the fragmented device market. By hooking your release cycles directly into massive real-device clouds, we sync and validate omnichannel state paths (e.g. mobile to web to wearable) dynamically.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Real-device cloud integration',
        'Native & hybrid layout automation',
        'Omnichannel state path syncing',
        'Network throttling thresholds',
        'Wearable OS compliance testing'
      ]
    },
    {
      title: 'ERP Migration & Workflow Assurance',
      description: 'We de-risk massive monolithic core upgrades. By validating specific SAP, Oracle, and Dynamics workflows—while enforcing deeply complex Role-Based Access Controls (RBAC)—we prevent enterprise software migrations from paralyzing daily operations.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Automated SAP/Oracle workflow verification',
        'ERP cross-module data integration',
        'Role-Based Access Control strict enforcement',
        'Custom ERP configuration mapping',
        'Zero-downtime patch validation'
      ]
    },
    {
      title: 'Quality Transformation Consulting',
      description: 'We do not just execute test scripts; we rip out broken testing cultures. We establish Testing Centers of Excellence (TCoE) that mandate strict engineering protocols, aligning QA output directly to business revenue SLAs.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Testing Center of Excellence (TCoE) setup',
        'Agile maturity and bottleneck assessment',
        'Automation toolchain consolidation',
        'Quality metric & SLA linking',
        'Legacy testing footprint re-engineering'
      ]
    },
    {
      title: 'Site Reliability Engineering (SRE)',
      description: 'We aggressively break your systems on purpose. By unleashing extreme load profiling, latency injections, and strict blast-radius chaos engineering, we map the exact breaking limits so you can tune your infrastructure before Black Friday.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Service Level Objective (SLO) auditing',
        'Blast-radius chaos engineering',
        'Extreme load & bottleneck tuning',
        'Latency spike and tolerance injection',
        'Redundant failover verification'
      ]
    },
    {
      title: 'Test Data Management & Masking',
      description: 'We remove the critical bottleneck blocking testing speed: dirty data. We architect pipelines that automatically provision synthetic databases and stringently mask PII, ensuring GDPR/HIPAA compliance never delays regression execution.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Synthetic data generative pipelines',
        'PII data masking algorithms',
        'Database subsetting and cloning',
        'Automated edge-case provisioning',
        'GDPR/HIPAA test footprint sanitization'
      ]
    },
    {
      title: 'Managed Validation Services (TaaS)',
      description: 'We absorb the execution risk entirely. In our Testing-as-a-Service model, Kangqore manages the infrastructure, provides the elite engineer pools elastically, and answers directly for the final release certification outcomes.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Outcome-based execution SLA models',
        'On-demand testing engineering scale',
        'Zero-capex testing infrastructure',
        'Pay-per-use automation resources',
        'Managed release certification gating'
      ]
    }
  ];

  // ============================================
  // WHY KANGQORE
  // ============================================
  const whyKangqoreIntro = `Kangqore should read like a company that knows what it costs to delay, what it takes to deliver, and what it means to own the outcome. We completely reject low-cost, reactive testing models.`;

  const whyKangqore = [
    { 
      title: 'We Eliminate Operational Drag', 
      description: 'We don’t just write test scripts; we rip out broken testing cultures. We establish Testing Centers of Excellence (TCoE) that mandate strict engineering protocols so your developers spend time building, not debugging.' 
    },
    { 
      title: 'Algorithmic Self-Healing', 
      description: 'The era of manually repairing broken locators every UI update is over. We integrate robust AI frameworks that identify regression risks dynamically and repair their own execution paths without human intervention.' 
    },
    { 
      title: 'Elite Delivery Accountability', 
      description: 'We partner best where execution quality, modernization depth, and zero-defect deployments matter. We absorb the execution risk in our SLA-driven models, taking direct ownership over final release certification outcomes.' 
    },
    { 
      title: 'Unified SRE Depth', 
      description: 'We test limits before you hit them. From extreme chaos engineering mapping the blast radius of a failure, to deep microservice state assertions, we don’t let your customers find your system bottlenecks.' 
    }
  ];

  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Telecommunications & Media' },
    { name: 'Automotive & Manufacturing' },
    { name: 'Technology & SaaS' }
  ];

  const customFAQs = [
    {
      question: 'How is Quality Engineering different from traditional QA?',
      answer: 'Traditional QA is a reactive, manual phase that occurs after code is written. Quality Engineering (QE) is proactive. It leverages automation, CI/CD integration, and AI to continuously evaluate software quality throughout the entire development lifecycle, preventing defects rather than just finding them.'
    },
    {
      question: 'What is your approach to automated testing?',
      answer: 'We deploy a Risk-Based Automation strategy. Instead of attempting 100% automation (which is inefficient to maintain), we target the critical business paths and high-risk integrations. We utilize leading frameworks (Selenium, Appium, Cypress) integrated directly into your DevOps pipelines.'
    },
    {
      question: 'Can you handle testing for complex legacy migrations?',
      answer: 'Yes. Our ERP Package Testing and Platform Engineering practices specialize in de-risking massive monolithic-to-microservices migrations. We ensure data integrity, API contract compliance, and zero downtime during the transition.'
    },
    {
      question: 'Do you offer fully managed testing services?',
      answer: 'Yes, through our Testing as a Service (TaaS) model. We take complete ownership of your testing function, providing an SLA-driven, outcome-based service that scales dynamically based on your release velocity.'
    }
  ];

  // ============================================
  // CUSTOM SECTIONS — BLOCKCHAIN BENCHMARK LAYOUT
  // ============================================

  const pageData = {
    service: {
      ...service,
      technologiesTitle: 'Tools & Technologies We Excel In',
      technologiesDescription: "A platform-agnostic automation stack integrating the world's leading Quality Engineering tools.",
      technologies: [
        { category: 'Test Automation', items: ['Selenium', 'Cypress', 'Playwright', 'Appium', 'Katalon'] },
        { category: 'CI/CD & DevOps', items: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'CircleCI'] },
        { category: 'Performance Engineering', items: ['JMeter', 'Gatling', 'LoadRunner', 'k6', 'NeoLoad'] },
        { category: 'AI & Cognitive QA', items: ['Tricentis Tosca', 'Mabl', 'Testim', 'Applitools', 'AccelQ'] },
        { category: 'Cloud & Infrastructure', items: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Kubernetes'] }
      ],
      capabilities,
      solutions: [],
      trustPillars: [
        { title: 'Shift-left pipeline confidence before release', tag: 'Automation', description: 'Embed validation gates directly into CI/CD triggers so defects surface before production, not after.' },
        { title: 'Self-healing algorithmic resilience', tag: 'Intelligence', description: 'Eliminate manual script maintenance with AI frameworks that identify regression risks and repair execution paths autonomously.' },
        { title: 'Outcome-based delivery accountability', tag: 'Governance', description: 'SLA-driven TaaS models that measure success by release certification outcomes, not script execution counts.' }
      ],
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industries We Ensure Quality For',
      industries,
      customFAQs,
      customSections: <QECustomSectionsBlock1 />,
      postFAQSections: <QECustomSectionsBlock2 />
    },
    department
  };

  return (
    <ServicePageTemplate 
      service={pageData.service} 
      department={department} 
      primaryButton={pageData.service.primaryButton}
      secondaryButton={pageData.service.secondaryButton}
    />
  );
};

export default QualityEngineeringAssurance;
