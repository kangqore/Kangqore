import React, { useEffect } from 'react';
import { Layers, Search, ShieldCheck, Zap, TrendingUp, Shield, BarChart3, Leaf, DollarSign, Settings, Briefcase, Building2, Heart, Factory, ShoppingCart, Flame } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  FinancePhilosophyBackground,
  FinanceRelatedExpertise,
  FinanceWhySection,
  FinanceValueDeliver,
  FinanceDiamondCoESection,
  FinanceDeliveryModel,
  FinanceExecutionEcosystem,
  FinanceFutureReadySection
} from './components/FinanceRiskCustomSections';

gsap.registerPlugin(ScrollTrigger);

const FinanceRiskManagement = () => {
  useEffect(() => {
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/([\d.]+)/);
        if (match) {
          const targetNum = parseFloat(match[1]);
          const suffix = text.replace(match[0], '');
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => {
                  const rawVal = counter.val;
                  const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
                  if (!isNaN(numVal)) {
                    const formattedVal = targetNum % 1 === 0 ? Math.round(numVal) : numVal.toFixed(1);
                    el.textContent = `${formattedVal}${suffix}`;
                  }
                }
              });
            }
          });
        }
      });
    };
    const timer = setTimeout(animateCounters, 500);
    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  // ============================================
  // SERVICE DATA
  // ============================================

  const service = {
    name: 'Finance & Risk Management',
    titleLine1: 'Finance & Risk',
    titleHighlight: 'Management.',
    slug: 'finance-risk-management',
    shortDescription: 'Turn Finance and Risk Into a Faster, Smarter Growth Engine.',
    description: 'Market volatility, regulatory pressure, fragmented data, and rising decision velocity are forcing finance and risk leaders to operate beyond traditional control functions. Kangqore helps enterprises modernize finance platforms, strengthen compliance, improve planning accuracy, operationalize ESG measurement, and scale finance operations with intelligent automation, integrated data, and AI-enabled decision support.',
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
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Business Operations', link: '/department/business-operations' },
      { label: 'Finance & Risk Management' }
    ],

    stats: [
      { value: '75%', label: 'Faster Report Delivery', color: 'text-cyan-400' },
      { value: '57%', label: 'Less Time Gathering Data', color: 'text-blue-400' },
      { value: '42%', label: 'Finance Automation Potential', color: 'text-emerald-400' },
      { value: '25%+', label: 'Forecast Accuracy Improvement', color: 'text-purple-400' },
    ],

    trustStrip: "Helping enterprises modernize finance platforms, strengthen risk governance, operationalize ESG measurement, improve planning accuracy, and scale finance operations with AI-enabled decision support and managed execution.",

    ctaTitle: "Ready to Modernize Finance and Risk?",
    ctaDescription: "Build a finance and risk operating model that is more resilient, more data-driven, and more valuable to the enterprise.",
    ctaButtonText: "Schedule a Strategy Session",

    highFidelity: {
      narrative: {
        badge: "FINANCE & RISK :: STRATEGIC MODERNIZATION",
        titleLine1: "Turn Finance",
        titleHighlight: "& Risk",
        titleLine2: "Into a Growth Engine",
        description: "Market volatility, regulatory pressure, fragmented data, and rising decision velocity are forcing finance and risk leaders to operate beyond traditional control functions. Kangqore helps enterprises modernize finance platforms, strengthen compliance, and scale operations with AI-enabled decision support.",
        bottleneckLabel: "The Complexity Trap",
        bottleneckText: "Legacy reporting, fragmented risk data, manual compliance processes, and disconnected planning systems create operational drag, blind spots, and decision latency across the finance and risk function.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified modernization model that connects platform transformation, intelligent automation, ESG readiness, performance management, and managed execution into one governed operating framework.",
        image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Finance Resilience",
        statusValue: "DECISION-READY"
      },
      philosophy: {
        icon: <TrendingUp className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Modernize with Control.",
        titleHighlight: "Scale with Intelligence.",
        description: "We replace fragmented finance and risk functions with integrated, decision-ready operating models designed for resilience and growth.",
        bgElement: <FinancePhilosophyBackground />,
        pills: ['Risk Governance', 'Finance Platform', 'ESG Readiness', 'Predictive Planning'],
        features: [
          { title: 'Risk Governance', label: 'Compliance & Controls', icon: <Shield className="w-5 h-5 text-gray-400" />, content: 'Modernize risk operations with AI-led detection, automated controls, and regulatory change management that keeps pace with evolving compliance landscapes.' },
          { title: 'Platform Redesign', label: 'Finance Architecture', icon: <Settings className="w-5 h-5 text-gray-400" />, content: 'Re-architect finance platforms from rigid, monolithic environments to modular, interoperable systems that support planning, analytics, compliance, and scalable growth.' },
          { title: 'ESG Intelligence', label: 'Sustainability Data', icon: <Leaf className="w-5 h-5 text-gray-400" />, content: 'Build auditable ESG data foundations with automated workflows, stronger controls, and decision integration across finance, risk, and operations.' },
          { title: 'Predictive Planning', label: 'Performance Management', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Connect planning, forecasting, and reporting into an AI-supported performance management system for faster, more accurate enterprise decisions.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: Finance_Risk_V5',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from fragmented finance and risk operations to governed, decision-ready operating models.',
        layers: [
          { title: 'Assess', id: 'FR_DISC', icon: <Search />, desc: 'Risk profile assessment, compliance gap analysis, finance platform evaluation, and ESG readiness audit.' },
          { title: 'Architect', id: 'FR_ARCH', icon: <Layers />, desc: 'Future-state finance vision, platform roadmap, operating model redesign, and governance framework design.' },
          { title: 'Execute', id: 'FR_EXE', icon: <Zap />, desc: 'Platform migration, automation deployment, reporting modernization, and managed services activation.' },
          { title: 'Evolve', id: 'FR_EVL', icon: <ShieldCheck />, desc: 'Continuous compliance monitoring, predictive analytics tuning, ESG disclosure readiness, and operational optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Govern Resilience.',
        titleHighlight: 'Accelerate Decisions.',
        description: 'Your finance and risk function should be a strategic asset, not an operational burden. We build the foundations for decision-ready, compliance-confident operations.',
        stats: [
          { label: 'Report Delivery', val: '75% Faster' },
          { label: 'Data Gathering', val: '57% Less' },
          { label: 'Forecast Accuracy', val: '25%+ Better' }
        ]
      }
    },

    trustPillars: [
      { title: 'AI-enabled risk detection and response', tag: 'Risk Intelligence', description: 'Use automation and AI to detect emerging risks faster, reduce manual control workload, and strengthen regulatory response.' },
      { title: 'Platform modernization with minimal disruption', tag: 'Transformation', description: 'Re-architect finance platforms without business interruption through phased migration, parallel operations, and governed rollout.' },
      { title: 'Auditable ESG data and reporting readiness', tag: 'Sustainability', description: 'Build ESG data foundations with stronger controls, automated workflows, and compliance-ready disclosure capabilities.' },
      { title: 'Connected planning and predictive forecasting', tag: 'Performance', description: 'Move from static planning to driver-based, AI-supported forecasting and scenario modeling across the enterprise.' },
      { title: 'Managed finance operations at scale', tag: 'Operations', description: 'Improve payables, receivables, close cycles, compliance, and working-capital performance with managed digital operations.' },
      { title: 'Governance that scales with complexity', tag: 'Control', description: 'Build governance frameworks that strengthen as your finance and risk landscape grows, ensuring control without operational drag.' }
    ],

    whyKangqore: [
      { title: 'Strategy-Led Execution', description: 'We connect finance and risk strategy directly to implementation — no gap between advisory and delivery.', icon: TrendingUp },
      { title: 'Platform + Process + Data Under One Model', description: 'We redesign finance platforms, business processes, and data architecture together — not as separate workstreams.', icon: Layers },
      { title: 'AI-Enabled, Control-Conscious', description: 'We bring AI and automation to finance and risk modernization while maintaining governance integrity and compliance confidence.', icon: ShieldCheck }
    ],

    industries: [
      { name: 'Banking & Financial Services', description: 'Regulatory compliance, risk operations, and finance transformation for banks, NBFCs, and financial institutions.', icon: Building2 },
      { name: 'Insurance', description: 'Claims risk management, actuarial modernization, regulatory reporting, and finance platform transformation.', icon: Shield },
      { name: 'Healthcare & Life Sciences', description: 'Compliance readiness, ESG reporting, finance operations, and risk management for pharmaceutical and healthcare enterprises.', icon: Heart },
      { name: 'Manufacturing', description: 'Product costing, supply chain risk, working capital optimization, and finance managed services for manufacturing operations.', icon: Factory },
      { name: 'Energy & Utilities', description: 'ESG measurement, sustainability reporting, regulatory compliance, and enterprise performance management.', icon: Flame },
      { name: 'Retail & Consumer', description: 'Revenue management, margin optimization, compliance modernization, and financial close acceleration.', icon: ShoppingCart }
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
    )
  };

  const department = {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Transform your business with cutting-edge business operations solutions.',
    icon: <Briefcase className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES (5 core items)
  // ============================================

  const capabilities = [
    {
      title: 'Finance & Risk Diagnostic',
      description: 'We begin every engagement with a structured diagnostic that maps current-state maturity across platform, process, data, controls, and talent — identifying high-impact transformation levers before any solution design begins.',
      bgImage: '/images/capabilities/finance.png',
      items: ['Maturity assessment across 5 finance dimensions', 'Control and compliance gap analysis', 'Technology landscape and integration audit', 'Prioritized transformation roadmap'],
      micro: 'Diagnose before you decide.'
    },
    {
      title: 'Operating Model Redesign',
      description: 'We redesign finance and risk operating models to eliminate functional silos, clarify accountability, and create structures that support faster decision-making, better data flow, and higher control confidence.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Target operating model definition', 'Role and accountability mapping', 'Shared services and CoE design', 'Change readiness and adoption planning'],
      micro: 'Structure drives performance.'
    },
    {
      title: 'Data Architecture & Intelligence',
      description: 'Finance transformation fails without data transformation. We build data architectures that unify fragmented sources, enable real-time visibility, support AI-driven analytics, and meet compliance and auditability requirements.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Unified finance data model design', 'Master data management strategy', 'Real-time reporting and analytics pipelines', 'AI/ML model deployment for risk and forecasting'],
      micro: 'Clean data powers clear decisions.'
    },
    {
      title: 'Intelligent Automation & AI',
      description: 'We identify and implement automation opportunities across finance and risk workflows — from reconciliation and close processes to risk detection and compliance reporting — using RPA, AI, and intelligent orchestration.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Process mining and automation opportunity mapping', 'RPA deployment for transactional workflows', 'AI-enabled anomaly detection and risk scoring', 'Intelligent document processing for compliance'],
      micro: 'Automate the repetitive, elevate the strategic.'
    },
    {
      title: 'Governance & Continuous Assurance',
      description: 'We build governance frameworks that ensure transformation gains are sustained — with embedded controls, continuous monitoring, KPI tracking, and escalation structures that keep finance and risk operating at peak performance.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: ['Control framework design and embedding', 'Continuous monitoring and assurance models', 'KPI dashboards and executive reporting', 'Post-go-live optimization and evolution support'],
      micro: 'Governance that strengthens over time.'
    }
  ];

  const technologies = [
    { category: 'ERP & Finance Platforms', items: ['SAP S/4HANA', 'Oracle Cloud ERP', 'Workday', 'NetSuite', 'Microsoft Dynamics 365'] },
    { category: 'EPM & Planning', items: ['Anaplan', 'Oracle EPM Cloud', 'SAP Analytics Cloud', 'Adaptive Planning', 'OneStream'] },
    { category: 'GRC & Risk', items: ['SAP GRC', 'ServiceNow GRC', 'RSA Archer', 'MetricStream', 'Diligent'] },
    { category: 'Automation & AI', items: ['UiPath', 'Blue Prism', 'Automation Anywhere', 'Python', 'TensorFlow', 'Azure AI'] },
    { category: 'Data & Analytics', items: ['Power BI', 'Tableau', 'Snowflake', 'Databricks', 'Azure Synapse'] },
    { category: 'ESG & Reporting', items: ['Workiva', 'Persefoni', 'Sphera', 'Enablon', 'SAP Sustainability Control Tower'] }
  ];

  const customFAQs = [
    {
      question: 'How does Kangqore approach finance platform transformation without disrupting business operations?',
      answer: 'We use a phased migration model with parallel operations, governed rollout, and continuous validation. The goal is to modernize the finance platform while maintaining full operational continuity — no big-bang cutovers or extended blackout periods.'
    },
    {
      question: 'Can you help with both risk compliance and finance operations under one engagement?',
      answer: 'Yes. Kangqore brings together risk modernization, compliance automation, finance platform transformation, and managed operations under a single governance model. This unified approach eliminates the gaps that occur when risk and finance initiatives are run as separate workstreams.'
    },
    {
      question: 'How do you help organizations prepare for evolving ESG disclosure requirements?',
      answer: 'We build ESG data foundations that are auditable, automated, and integrated with finance and risk functions. This includes defining the measurement strategy, creating data models, automating reporting workflows, and ensuring compliance readiness for evolving regulatory frameworks.'
    },
    {
      question: 'What does enterprise performance management look like with Kangqore?',
      answer: 'We help finance teams move from static planning and manual reporting to connected, AI-supported performance management. This includes integrated planning frameworks, driver-based forecasting, scenario modeling, and self-service reporting with gen-AI insights.'
    },
    {
      question: 'How do you measure the success of a finance and risk transformation?',
      answer: 'We measure success through operational metrics: report delivery speed, forecast accuracy improvement, compliance cost reduction, risk detection lead time, close cycle acceleration, and working-capital performance — all tied to specific business outcomes defined at the start of each engagement.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Every finance and risk transformation follows a structured path — from diagnostic and operating model design through data architecture, intelligent automation, and continuous governance. Here is how we work.',
      capabilities,
      trustPillars: service.trustPillars,
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs
    },
    department
  };

  return (
    <div className="finance-risk-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .finance-risk-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default FinanceRiskManagement;
