import React from 'react';
import { Search, Layers, Zap, TrendingUp, Activity, ShieldCheck, Network, Brain, DollarSign } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which processes should we automate first to get the fastest ROI?",
      "acceptedAnswer": { "@type": "Answer", "text": "We start with a structured discovery phase that maps your processes against automation readiness, business impact, and complexity. High-volume, rule-based processes with clear inputs/outputs are ideal early candidates. Our ROI model helps prioritize the automation pipeline by expected value — ensuring your first automation delivers a measurable return that builds internal confidence for scaling." }
    },
    {
      "@type": "Question",
      "name": "How do you ensure intelligent automation is secure, compliant, and audit-ready?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every automation is built with governance from day one — role-based access controls, encrypted data handling, full audit trails, and compliance checkpoints. Our three-lines-of-defense model embeds risk ownership, oversight, and assurance into the operating model so automated workflows meet the same regulatory standards as manual processes." }
    },
    {
      "@type": "Question",
      "name": "Can intelligent automation integrate with our ERP, CRM, and legacy systems?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our API-led integration and iPaaS capabilities connect modern and legacy systems — SAP, Oracle, Salesforce, Workday, and custom applications — into unified automated workflows without requiring full system replacement. We assess your integration landscape as part of every engagement." }
    },
    {
      "@type": "Question",
      "name": "How long does a pilot take, and what does enterprise-scale automation actually look like?",
      "acceptedAnswer": { "@type": "Answer", "text": "A focused pilot typically takes 4–6 weeks from discovery to production. At enterprise scale, automation expands across functions, geographies, and use cases — supported by an Automation Center of Excellence, governance model, monitoring dashboards, and a continuous optimization cadence. We ensure scale is sustained, not just launched." }
    }
  ]
};

import {
  AIChallengesSection,
  AILogoTrustSection,
  AIArchitectureDiagram,
  UseCasesMagnificationList,
  AIAcceleratorRoadmap,
  AIMetricsSection,
  AITransformationMagnet
} from '../../../components/services/cognition/AICustomSections';

const IntelligentAutomation = () => {
  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge intelligent automation solutions.'
  };

  const capabilities = [
    {
      title: 'Digital Integration',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Build a connected enterprise with API-led integration, iPaaS modernization, and secure EDI/B2B enablement—designed to scale reliably across teams and ecosystems.',
      items: [
        { heading: 'API-led connectivity & microservices orchestration', description: 'Design modular API layers that decouple systems and enable scalable, reusable service-to-service communication across the enterprise.' },
        { heading: 'iPaaS platform modernization & migration', description: 'Migrate integration workloads to cloud-native iPaaS platforms for faster deployment cycles and reduced middleware cost.' },
        { heading: 'EDI/B2B integration & partner onboarding', description: 'Streamline partner data exchange with standardized EDI protocols and automated onboarding workflows that reduce manual coordination.' },
        { heading: 'Real-time data synchronization across systems', description: 'Keep ERP, CRM, and operational systems in sync with event-driven data flows that eliminate reconciliation lag.' },
        { heading: 'Legacy system connectivity & modernization', description: 'Bridge legacy applications into modern workflows through API wrappers and integration adapters without full replacement.' },
        { heading: 'Event-driven architecture & streaming pipelines', description: 'Build reactive systems that process and respond to business events in real time, improving operational responsiveness.' },
        { heading: 'Secure gateway & protocol management', description: 'Enforce authentication, rate limiting, and protocol governance across all integration touchpoints with centralized API gateway controls.' }
      ]
    },
    {
      title: 'Business Process Management (BPM)',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Modernize process orchestration with BPM-led operating models, process mining, real-time decisioning, and governance—improving customer experience, agility, and operational control.',
      items: [
        { heading: 'Process & task mining (data-driven discovery)', description: 'Analyze system logs and event data to automatically map how processes actually run — surfacing bottlenecks invisible to manual observation.' },
        { heading: 'End-to-end process mapping & optimization', description: 'Model, redesign, and standardize business processes from intake to outcome, eliminating redundancy and reducing cycle time.' },
        { heading: 'BPM platform implementation & customization', description: 'Deploy and configure leading BPM platforms (Appian, Pega, Camunda, ServiceNow) to match your specific operating model.' },
        { heading: 'Real-time decisioning & dynamic routing', description: 'Embed decision rules and AI-driven routing into workflows so exceptions are handled automatically without human escalation.' },
        { heading: 'Compliance & governance framework setup', description: 'Build audit trails, approval workflows, and policy enforcement into every process to meet regulatory requirements by design.' },
        { heading: 'Process analytics & continuous improvement', description: 'Track KPIs across live workflows to identify degradation early and drive data-backed optimization sprints.' },
        { heading: 'Customer journey orchestration', description: 'Design and automate cross-channel customer journeys that are consistent, measurable, and continuously optimized.' }
      ]
    },
    {
      title: 'Next-Gen RPA & Document Processing',
      bgImage: '/images/capabilities/automation-rpa.png',
      description: 'Deploy enterprise-grade automation with a structured RPA CoE and Intelligent Document Processing—covering discovery to scale, with measurable productivity gains across operations.',
      items: [
        { heading: 'Automation discovery & opportunity assessment', description: 'Systematically identify, score, and prioritize automation candidates by ROI potential, complexity, and process volume.' },
        { heading: 'Attended & unattended bot development', description: 'Build bots that operate autonomously in the background or assist employees in real time — depending on the process and decision requirements.' },
        { heading: 'Intelligent Document Processing (IDP)', description: 'Extract, classify, and validate data from invoices, contracts, and forms using AI-powered OCR and NLP — replacing manual data entry.' },
        { heading: 'Invoice, contract & KYC automation', description: 'Automate high-volume document workflows in finance and compliance — reducing processing time and error rates to near zero.' },
        { heading: 'RPA Center of Excellence (CoE) setup', description: 'Establish the governance model, standards, and operating structure needed to sustain and scale automation across the enterprise.' },
        { heading: 'Bot monitoring, analytics & optimization', description: 'Track bot performance, exception rates, and business impact in real time — with automated alerts and continuous improvement loops.' },
        { heading: 'Enterprise-wide scale & governance', description: 'Expand automation across functions with consistent security controls, change management, and ROI measurement frameworks.' }
      ]
    },
    {
      title: 'AI & Cognitive Services',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Embed intelligence into operations with GenAI, NLP, computer vision, and decision engines—enabling workflows that learn, adapt, and self-improve with every cycle.',
      items: [
        { heading: 'GenAI for operations (assist + automate)', description: 'Deploy generative AI to draft communications, summarize documents, generate reports, and augment human decision-making in operational workflows.' },
        { heading: 'NLP & conversational AI deployment', description: 'Build natural language interfaces for internal workflows, customer interactions, and knowledge retrieval — reducing manual lookup and routing effort.' },
        { heading: 'Computer vision & image processing', description: 'Automate visual inspection, document capture, and quality control tasks using AI models trained on your specific operational context.' },
        { heading: 'Decision intelligence & recommendation engines', description: 'Embed predictive models that surface the next best action at each workflow stage — turning operational data into real-time decision support.' },
        { heading: 'Predictive analytics & anomaly detection', description: 'Identify patterns in operational data that signal emerging issues — enabling proactive intervention before they affect outcomes.' },
        { heading: 'AI model governance & responsible AI', description: 'Establish explainability, bias detection, and audit controls for every AI component embedded in production workflows.' },
        { heading: 'LLM integration & prompt engineering', description: 'Connect large language models to enterprise systems with structured prompt frameworks, context management, and output validation guardrails.' }
      ]
    }
  ];

  const pageData = {
    service: {
      name: 'Intelligent Automation',
      titleLine1: 'Intelligent',
      titleHighlight: 'Automation',
      slug: 'intelligent-automation',
      shortDescription: 'AI-led automation that turns operations into a real-time, self-improving system.',
      description: 'Kangqore helps enterprises automate end-to-end workflows by combining RPA, API-led integration, process orchestration, and GenAI — so decisions are faster, operations are cleaner, and outcomes are measurable.',
      videoBackground: '/videos/working-machine-4751312.mp4',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
      secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
      hideGenericMidPageCta: true,
      hideGenericFaq: false,
      breadcrumb: [
        { label: 'Home', link: '/' },
        { label: 'Services', link: '/services' },
        { label: 'Automation', link: '/department/automation' },
        { label: 'Intelligent Automation' }
      ],
      capabilitiesTitle: 'Our Capabilities.',
      stats: [
        { value: '60%', label: 'Cycle Time Reduction', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
        { value: '4–6 Wks', label: 'Pilot to Production', color: 'text-brand-blue' },
        { value: '99.5%', label: 'Bot Uptime SLA', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
        { value: '3x', label: 'Faster Decision Cycles', color: 'text-brand-blue' }
      ],
      highFidelity: {
        narrative: {
          badge: 'INTELLIGENT AUTOMATION :: 2026',
          titleLine1: 'Real-time Insights.',
          titleHighlight: 'Automated',
          titleLine2: 'Execution.',
          description: 'Break data silos and manual dependencies by connecting applications, workflows, and teams. We enable intelligent automation across business and IT operations—integrating data, orchestrating processes, and embedding AI where decisions happen.',
          bottleneckLabel: 'The Challenge',
          bottleneckText: 'Disconnected systems, manual handoffs, decision bottlenecks, and lack of real-time visibility into operations.',
          requirementLabel: 'Our Approach',
          requirementText: 'Connected systems and unified workflows. Faster decision-making with AI-assisted automation. Governance-first execution: secure, compliant, auditable.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
          statusLabel: 'Automation Maturity',
          statusValue: 'Intelligent'
        },
        philosophy: {
          icon: <Zap className="w-7 h-7 text-brand-blue" />,
          title: 'Our',
          titleHighlight: 'Automation Framework.',
          description: 'At Kangqore, Intelligent Automation is structured across four integrated pillars—connecting data, embedding intelligence, scaling execution, and enabling teams.',
          pills: ['Connect', 'Decide', 'Execute', 'Enable']
        },
        matrix: {
          engineId: 'Engine :: IA_Flow_V2',
          title: 'How We Deliver',
          subtext: 'A structured, outcomes-driven delivery model—from process assessment to enterprise-wide automation at scale.',
          layers: [
            { title: 'Discover', id: 'IA_DISC', icon: <Search />, desc: 'Process assessment + automation pipeline + ROI model. Identify the highest-impact workflows and build a clear automation roadmap.' },
            { title: 'Design', id: 'IA_DES', icon: <Layers />, desc: 'Target workflows + system integrations + controls. Architect the automation solution with security, compliance, and scalability built in.' },
            { title: 'Deploy', id: 'IA_DEP', icon: <Zap />, desc: 'Build bots and workflows + testing + rollout. Execute the automation blueprint with structured QA, UAT, and change management.' },
            { title: 'Scale', id: 'IA_SCALE', icon: <TrendingUp />, desc: 'CoE governance + monitoring + continuous optimization. Expand automation across functions with KPI dashboards and improvement cadence.' }
          ]
        },
        schematic: {
          titleLine1: 'Synthesize',
          titleHighlight: 'Operations.',
          description: 'Design ecosystems where humans and digital workers collaborate seamlessly—tied to KPIs, ROI, and measurable business outcomes.',
          stats: [
            { label: 'Decisions', val: 'AI-DRIVEN' },
            { label: 'Workflows', val: 'ORCHESTRATED' },
            { label: 'Outcomes', val: 'MEASURABLE' }
          ]
        }
      },
      capabilities,
      capabilitiesDescription: 'Kangqore helps enterprises integrate systems, orchestrate processes, and embed AI-driven intelligence across operations. From API-led integration and BPM to RPA, IDP, and cognitive services—we unlock efficiency, speed, and measurable business outcomes.',
      customSections: (
        <>
          <AILogoTrustSection />

          <AIChallengesSection
            title="The Cost of"
            subtitle="Manual Operations."
            challenges={[
              {
                problem: 'Fragmented automation with no enterprise ROI.',
                fix: 'A governed Intelligent Automation CoE unifies RPA, AI, and integration into one compounding program — with measurable ROI at every stage.'
              },
              {
                problem: 'Humans handling exception-heavy, high-volume processes.',
                fix: 'AI exception handling and attended bots redirect human judgment to where it actually matters — eliminating bottlenecks at the source.'
              },
              {
                problem: 'Siloed bots disconnected from real decisions.',
                fix: 'End-to-end process orchestration connects bots, AI models, and enterprise systems into a single, decision-aware execution engine.'
              }
            ]}
          />

          <AIArchitectureDiagram
            title="The IA Delivery Architecture."
            nodes={[
              {
                title: 'Assessment',
                description: 'Data-driven discovery to identify and prioritize your highest-ROI automation candidates.',
                features: ['Process Mining', 'Automation Pipeline', 'ROI Modeling'],
                icon: Search
              },
              {
                title: 'Orchestration',
                description: 'Design the workflow architecture with full system integration and governance controls.',
                features: ['API-Led Connectivity', 'Workflow Design', 'Compliance Controls'],
                icon: Network
              },
              {
                title: 'Automation',
                description: 'Build and deploy bots, IDP, and AI-assisted workflows that run without manual intervention.',
                features: ['RPA & IDP Deployment', 'GenAI Integration', 'UAT & Rollout'],
                icon: Zap
              },
              {
                title: 'Governance',
                description: 'Sustain and scale automation with a CoE, monitoring dashboards, and continuous optimization.',
                features: ['Automation CoE', 'KPI Dashboards', 'Bot Health Monitoring'],
                icon: ShieldCheck
              }
            ]}
          />

          <UseCasesMagnificationList
            title="Intelligent Automation in Action."
            useCases={[
              {
                industry: 'IA for Banking & Financial Services',
                description: 'Automated invoice processing and AP automation that cuts cycle time by 60% and eliminates manual reconciliation across distributed finance operations.',
                tags: ['Invoice Processing', 'AP Automation', 'Reconciliation', 'Audit Trail']
              },
              {
                industry: 'IA for Healthcare & Life Sciences',
                description: 'Prior authorization workflows automated end-to-end — reducing approval lag from days to hours with full compliance traceability and exception escalation.',
                tags: ['Prior Authorization', 'Claims Workflow', 'Compliance', 'EHR Integration']
              },
              {
                industry: 'IA for Manufacturing & Supply Chain',
                description: 'AI-driven quality inspection and defect detection on the production line — combining computer vision with RPA to trigger real-time corrective actions.',
                tags: ['Quality Inspection', 'Defect Detection', 'Computer Vision', 'Supply Chain']
              },
              {
                industry: 'IA for Insurance',
                description: 'End-to-end claims processing automation that ingests documents, validates against policy rules, and routes exceptions to adjusters — zero manual first pass.',
                tags: ['Claims Processing', 'IDP', 'Policy Validation', 'Exception Routing']
              }
            ]}
          />

          <AIAcceleratorRoadmap
            title="The Path to Intelligent Operations."
            phases={[
              {
                num: '01',
                title: 'Discovery & Assessment',
                desc: 'We deploy process mining and operational data analysis to identify your highest-value automation candidates and build a business-case-backed roadmap.',
                deliverables: ['Process Heatmap', 'Automation Pipeline', 'ROI Model']
              },
              {
                num: '02',
                title: 'Pilot Automation',
                desc: 'Prove value fast. A focused 4–6 week pilot selects a high-impact process, builds the automation, and delivers measurable results before full commitment.',
                deliverables: ['Bot Build & UAT', 'Integration Testing', 'Go-Live Deployment']
              },
              {
                num: '03',
                title: 'Scale & Integrate',
                desc: 'Expand automation across functions, geographies, and use cases — connecting bots, AI models, and enterprise systems into one unified execution layer.',
                deliverables: ['Enterprise Rollout', 'System Integration', 'AI Embedding']
              },
              {
                num: '04',
                title: 'CoE & Governance',
                desc: 'Establish the Automation Center of Excellence with operating models, KPI frameworks, compliance protocols, and continuous optimization cadence.',
                deliverables: ['CoE Operating Model', 'Governance Framework', 'Optimization Sprints']
              }
            ]}
          />

          <AIMetricsSection
            metrics={[
              {
                title: 'Process Cycle Time',
                desc: 'Average reduction in end-to-end process cycle time across finance, HR, and operations workflows after IA deployment.',
                prefix: '',
                value: '60',
                suffix: '%',
                metricLabel: 'Cycle Time Reduction',
                icon: TrendingUp
              },
              {
                title: 'Manual Effort',
                desc: 'Reduction in manual task handling achieved through RPA, IDP, and AI-assisted exception management in the first automation wave.',
                prefix: '',
                value: '40',
                suffix: '%',
                metricLabel: 'Manual Effort Eliminated',
                icon: Activity
              },
              {
                title: 'Bot Uptime',
                desc: 'Guaranteed bot uptime SLA across production automation environments with active monitoring, alerting, and rapid incident response.',
                prefix: '',
                value: '99.5',
                suffix: '%',
                metricLabel: 'Uptime SLA',
                icon: ShieldCheck
              },
              {
                title: 'Decision Speed',
                desc: 'Faster decision cycles achieved by embedding AI-driven routing and exception intelligence directly into automated workflows.',
                prefix: '',
                value: '3',
                suffix: 'x',
                metricLabel: 'Faster Decisions',
                icon: Zap
              }
            ]}
          />

          <AITransformationMagnet />
        </>
      )
    },
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="Intelligent Automation Services — AI-Led Workflow & Process Automation"
        description="Kangqore combines RPA, AI, and process orchestration to automate end-to-end enterprise workflows — delivering measurable cycle time reductions, compliance controls, and a governed Automation CoE."
        keywords="intelligent automation services, AI-led automation, RPA and AI, workflow automation, process orchestration, automation CoE, enterprise automation consulting, hyperautomation, digital workforce, automation ROI"
        url="https://kangqore.com/services/automation/intelligent-automation"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default IntelligentAutomation;
