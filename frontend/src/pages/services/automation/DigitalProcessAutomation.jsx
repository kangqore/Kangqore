import React from 'react';
import { Layers, Search, ShieldCheck, Workflow, Zap, Target, BrainCircuit, Activity, TrendingUp, Network } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What if our systems are too fragmented to automate end-to-end workflows?",
      "acceptedAnswer": { "@type": "Answer", "text": "Fragmentation is the starting point of every DPA engagement, not a blocker. We map your current process landscape, identify the highest-friction integration points, and design automation that works across your existing systems — whether they're cloud-native, on-premise ERP, or legacy applications — without requiring a full platform replacement." }
    },
    {
      "@type": "Question",
      "name": "How do we prevent automation from creating new compliance gaps as it scales?",
      "acceptedAnswer": { "@type": "Answer", "text": "Unmanaged automation creates audit gaps as fast as it closes them. Kangqore embeds a Center of Excellence governance model into every DPA engagement — establishing approval workflows, audit logging, exception handling protocols, and compliance checkpoints at scale. Automation operates within defined boundaries, with full traceability at every step." }
    },
    {
      "@type": "Question",
      "name": "How quickly will we see measurable ROI from Digital Process Automation?",
      "acceptedAnswer": { "@type": "Answer", "text": "Measurable outcomes typically appear within the first delivery phase. Our clients see 20–60% cycle time reduction and 30–80% fewer manual touches from the first automated workflows. We define specific business KPIs before implementation begins — not generic efficiency claims — so the impact is auditable and unambiguous." }
    },
    {
      "@type": "Question",
      "name": "What happens when an automated process encounters an exception it wasn't designed for?",
      "acceptedAnswer": { "@type": "Answer", "text": "Exception handling is engineered before any automation goes live. Every workflow includes structured exception queues, human-in-the-loop escalation for edge cases, and automated alerting for anomalies. Processes don't silently fail — they escalate to the right person with context, so exceptions are resolved and patterns are analyzed to prevent recurrence." }
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

const DigitalProcessAutomation = () => {
  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge intelligent automation solutions.'
  };

  const capabilities = [
    {
      title: 'Automation Consulting',
      description: 'Establish the strategy, governance, and roadmap required to scale automation across the enterprise. We begin with clarity, delivering a prioritized automation blueprint aligned to business value.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        { heading: 'Automation readiness assessment', description: 'Evaluate your current process landscape, technology stack, and organizational maturity to identify where automation will deliver the fastest ROI.' },
        { heading: 'Process discovery & mining', description: 'Use event log analysis and process mining tools to map how work actually flows — surfacing hidden bottlenecks and automation opportunities at scale.' },
        { heading: 'Automation strategy & roadmap', description: 'Define a prioritized multi-year automation roadmap with clear business cases, sequencing logic, and measurable success criteria for each initiative.' },
        { heading: 'Center of Excellence (CoE) setup', description: 'Establish the governance structure, operating model, standards, and talent framework needed to sustain automation as an enterprise capability.' },
        { heading: 'Governance & ROI modeling', description: 'Build financial models and governance controls that track automation value, enforce compliance, and align stakeholders on outcomes from day one.' }
      ]
    },
    {
      title: 'Process Automation',
      description: 'Eliminate repetitive work. Orchestrate workflows intelligently to achieve reduced manual workload, faster cycle times, and improved accuracy.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        { heading: 'Robotic Process Automation (RPA)', description: 'Deploy software bots that mimic human actions on digital systems to automate high-volume, rule-based tasks with precision and speed.' },
        { heading: 'Workflow automation & orchestration', description: 'Design and deploy end-to-end workflow engines that route tasks, trigger actions, and manage approvals without manual intervention.' },
        { heading: 'End-to-end business process automation', description: 'Automate entire business processes — from initiation to resolution — connecting people, systems, and decisions into a single governed flow.' },
        { heading: 'IT process automation', description: 'Automate IT operations including incident management, provisioning, patch cycles, and compliance checks to reduce toil and improve SLA performance.' },
        { heading: 'Monitoring & performance optimization', description: 'Track automation health in real time with dashboards that surface exception rates, cycle times, and ROI against defined baselines.' }
      ]
    },
    {
      title: 'Digital Automation',
      description: 'Modernize applications and digitize core systems using low-code platforms for faster development, improved productivity, and scalable digital systems.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        { heading: 'Low-code / no-code application development', description: 'Build business applications 5–10x faster using low-code platforms — enabling citizen developers while maintaining IT governance and security.' },
        { heading: 'Legacy modernization', description: 'Wrap, extend, or replace legacy systems with modern digital interfaces and APIs — eliminating technical debt without disrupting live operations.' },
        { heading: 'ERP & mission-critical system extension', description: 'Extend SAP, Oracle, and other enterprise platforms with custom digital workflows and automation without unsupported customizations.' },
        { heading: 'Customer touchpoint digitization', description: 'Digitize customer-facing processes — onboarding, service requests, approvals — into seamless, mobile-ready digital experiences.' },
        { heading: 'Omnichannel workflow enablement', description: 'Unify automation across web, mobile, email, and chat channels so customers and employees experience consistent, frictionless service.' }
      ]
    },
    {
      title: 'Cognitive Automation',
      description: 'Embed intelligence into automation systems integrating AI and GenAI to enable intelligent decision-making workflows that adapt, learn, and scale.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Conversational AI & bots', description: 'Deploy NLP-powered virtual agents that handle employee and customer inquiries, route requests, and resolve issues without human escalation.' },
        { heading: 'Intelligent Document Processing (IDP)', description: 'Extract structured data from unstructured documents — invoices, contracts, forms — using AI-powered OCR, NLP, and validation engines.' },
        { heading: 'AI-powered decision automation', description: 'Embed predictive models into workflow decision points so the right action is taken automatically based on context, history, and risk signals.' },
        { heading: 'Risk assessment automation', description: 'Automate risk scoring, compliance checks, and exception flagging within business workflows — reducing manual review overhead and audit exposure.' },
        { heading: 'GenAI-enabled process augmentation', description: 'Augment human-intensive process steps with generative AI — summarizing, drafting, and recommending — so knowledge workers focus on judgment, not tasks.' }
      ]
    }
  ];

  const pageData = {
    service: {
      name: 'Digital Process Automation',
      titleLine1: 'Digital Process',
      titleHighlight: 'Automation',
      slug: 'digital-process-automation',
      shortDescription: 'Automate intelligently. Orchestrate seamlessly. Scale sustainably.',
      description: 'Digital Process Automation at Kangqore enables organizations to eliminate manual friction, streamline operations, and build intelligent workflows that combine humans, bots, and AI systems into a unified execution engine.',
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
        { label: 'Digital Process Automation' }
      ],
      capabilitiesTitle: 'Our Capabilities.',
      stats: [
        { value: '60%', label: 'Cycle Time Reduction', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
        { value: '80%', label: 'Fewer Manual Touches', color: 'text-brand-blue' },
        { value: '100%', label: 'Audit Trail Coverage', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
        { value: '4–6 Wks', label: 'Pilot Deployment', color: 'text-brand-blue' }
      ],
      highFidelity: {
        narrative: {
          badge: 'AUTOMATION STRATEGY :: 2026',
          titleLine1: 'Orchestrate',
          titleHighlight: 'Workflows.',
          titleLine2: 'at High Velocity.',
          description: 'Digital Process Automation is no longer optional — it is foundational to operational excellence. We combine process automation, cognitive automation, and digital automation platforms to deliver measurable business outcomes. Typical outcomes include 20–60% cycle time reduction, 30–80% fewer manual touches, and audit-ready workflows with full traceability.',
          bottleneckLabel: 'The Impediment',
          bottleneckText: 'Siloed systems + email approvals + spreadsheet operations creating audit gaps and operational drag.',
          requirementLabel: 'The Requirement',
          requirementText: 'Unified workflow + bots + AI, governed via a Center of Excellence for enterprise-wide hyperautomation.',
          image: 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=1200',
          statusLabel: 'Automation Velocity',
          statusValue: 'Maximized'
        },
        philosophy: {
          icon: <Workflow className="w-7 h-7 text-brand-blue" />,
          title: 'Our',
          titleHighlight: 'Automation Framework.',
          description: 'At Kangqore, DPA is structured across four integrated layers to ensure scalability, adaptability, and continuous operational intelligence.',
          pills: ['Consulting', 'Process Automation', 'Digital Automation', 'Cognitive Automation']
        },
        matrix: {
          engineId: 'Engine :: DPA_Flow_V1',
          title: '4-Layer Automation Architecture',
          subtext: 'We deconstruct the complexity of enterprise operations into manageable, automated execution layers.',
          layers: [
            { title: 'Consulting', id: 'DPA_C', icon: <Search />, desc: 'Discover + prioritize ROI use cases via readiness assessments, process mining, and CoE governance.' },
            { title: 'Process', id: 'DPA_P', icon: <Layers />, desc: 'Orchestrate workflows + RPA at scale with end-to-end business process automation and monitoring.' },
            { title: 'Digital', id: 'DPA_D', icon: <Zap />, desc: 'Low-code apps + modernization to bridge gaps — extending ERP, digitizing touchpoints, enabling omnichannel.' },
            { title: 'Cognitive', id: 'DPA_AI', icon: <BrainCircuit />, desc: 'IDP + conversational AI + decision automation powered by GenAI for intelligent, self-improving workflows.' }
          ]
        },
        schematic: {
          titleLine1: 'Synthesize',
          titleHighlight: 'Operations.',
          description: 'Design ecosystems where humans and digital workers collaborate seamlessly, tied to KPIs, ROI, and measurable business outcomes.',
          stats: [
            { label: 'Efficiency', val: 'OPTIMIZED' },
            { label: 'Throughput', val: 'MAXIMIZED' },
            { label: 'Costs', val: 'REDUCED' }
          ]
        }
      },
      capabilities,
      capabilitiesDescription: 'Kangqore helps organizations eliminate manual friction, orchestrate intelligent workflows, and scale automation sustainably across functions. From automation consulting and process mining to cognitive workflows and low-code modernization — we deliver end-to-end DPA that transforms how work flows.',
      customSections: (
        <>
          <AILogoTrustSection />

          <AIChallengesSection
            title="The Drag of"
            subtitle="Siloed Workflows."
            challenges={[
              {
                problem: 'Manual approval chains that stall throughput and create audit gaps.',
                fix: 'Automated workflow orchestration eliminates email-based approvals, enforces SLAs, and creates a full audit trail on every decision.'
              },
              {
                problem: 'Disconnected systems preventing end-to-end process visibility.',
                fix: 'API-led integration and low-code connectors unify ERP, CRM, legacy, and cloud systems into one governed execution layer.'
              },
              {
                problem: 'Compliance gaps widening as automation scales without governance.',
                fix: 'An embedded CoE governance model enforces boundaries, logging, and exception protocols at every layer — so scale never outpaces control.'
              }
            ]}
          />

          <AIArchitectureDiagram
            title="The 4-Layer DPA Architecture."
            nodes={[
              {
                title: 'Consulting',
                description: 'Process mining, readiness assessment, and CoE design to ensure every automation investment is prioritized by business value.',
                features: ['Process Mining', 'ROI Prioritization', 'CoE Governance Setup'],
                icon: Search
              },
              {
                title: 'Process',
                description: 'End-to-end workflow automation and RPA deployment across core business functions with full monitoring and performance analytics.',
                features: ['RPA Deployment', 'Workflow Orchestration', 'Performance Monitoring'],
                icon: Layers
              },
              {
                title: 'Digital',
                description: 'Low-code application development and legacy modernization that bridges system gaps and extends the life of existing platforms.',
                features: ['Low-Code Apps', 'ERP Extension', 'Omnichannel Enablement'],
                icon: Zap
              },
              {
                title: 'Cognitive',
                description: 'IDP, conversational AI, and GenAI-powered decision automation that creates self-improving workflows with every cycle.',
                features: ['Intelligent Document Processing', 'Conversational AI', 'GenAI Decision Engines'],
                icon: BrainCircuit
              }
            ]}
          />

          <UseCasesMagnificationList
            title="DPA Delivering Value."
            useCases={[
              {
                industry: 'DPA for Banking & Financial Services',
                description: 'Accounts payable and receivable automation that eliminates manual invoice processing, reduces cycle time by 60%, and delivers full reconciliation traceability.',
                tags: ['AP/AR Automation', 'Invoice Processing', 'Reconciliation', 'Audit Trail']
              },
              {
                industry: 'DPA for Healthcare',
                description: 'Patient onboarding workflows automated end-to-end — from intake form processing and insurance verification to scheduling and EHR record creation.',
                tags: ['Patient Onboarding', 'Insurance Verification', 'EHR Integration', 'Compliance']
              },
              {
                industry: 'DPA for Telecom',
                description: 'Order fulfillment orchestration that connects CRM, provisioning, and billing systems — eliminating manual handoffs and reducing order-to-activate time by 70%.',
                tags: ['Order Fulfillment', 'Provisioning Automation', 'Billing Integration', 'SLA Management']
              },
              {
                industry: 'DPA for Retail & Consumer Goods',
                description: 'Returns processing automation that ingests return requests, validates policy eligibility, triggers refunds, and updates inventory — zero manual intervention.',
                tags: ['Returns Processing', 'Refund Automation', 'Inventory Updates', 'Customer Experience']
              }
            ]}
          />

          <AIAcceleratorRoadmap
            title="From Assessment to Hyperautomation."
            phases={[
              {
                num: '01',
                title: 'Discovery & Process Mining',
                desc: 'We deploy process mining tools to map your actual enterprise workflows, surface hidden inefficiencies, and build a prioritized automation business case.',
                deliverables: ['Process Heatmap', 'Top 10 Automation Candidates', 'ROI Model']
              },
              {
                num: '02',
                title: 'CoE Establishment',
                desc: 'We design and stand up your Automation Center of Excellence — including operating model, governance framework, roles, and citizen developer enablement.',
                deliverables: ['CoE Operating Model', 'Governance Framework', 'Citizen Dev Program']
              },
              {
                num: '03',
                title: 'Process Automation',
                desc: 'We build and deploy the prioritized automation waves — RPA, workflow orchestration, and low-code applications — with structured UAT and change management.',
                deliverables: ['Bot Deployment', 'Workflow Build', 'Go-Live & UAT']
              },
              {
                num: '04',
                title: 'Cognitive Extension',
                desc: 'We embed GenAI, IDP, and decision intelligence into existing automations — creating self-improving workflows that adapt to new data and edge cases.',
                deliverables: ['IDP Integration', 'GenAI Embedding', 'Continuous Optimization Sprints']
              }
            ]}
          />

          <AIMetricsSection
            metrics={[
              {
                title: 'Cycle Time',
                desc: 'Average reduction in end-to-end process cycle time across finance, operations, and customer-facing workflows in the first DPA wave.',
                prefix: '',
                value: '60',
                suffix: '%',
                metricLabel: 'Cycle Time Reduction',
                icon: TrendingUp
              },
              {
                title: 'Manual Touches',
                desc: 'Reduction in manual interventions per process after full DPA deployment — combining RPA, IDP, and intelligent exception routing.',
                prefix: '',
                value: '80',
                suffix: '%',
                metricLabel: 'Fewer Manual Touches',
                icon: Activity
              },
              {
                title: 'Compliance Coverage',
                desc: 'Every automated workflow ships with a full audit trail, exception log, and policy enforcement layer — ensuring 100% traceability at scale.',
                prefix: '',
                value: '100',
                suffix: '%',
                metricLabel: 'Audit Trail Coverage',
                icon: ShieldCheck
              },
              {
                title: 'Deployment Speed',
                desc: 'Time from kickoff to first automated process in production — using pre-built accelerators, reusable templates, and structured delivery methodology.',
                prefix: '',
                value: '4',
                suffix: '-6 Wks',
                metricLabel: 'Pilot to Production',
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
        title="Digital Process Automation — Enterprise Workflow Orchestration"
        description="Kangqore's Digital Process Automation services eliminate operational friction by combining process automation, cognitive automation, and digital platforms — delivering 20–60% cycle time reductions and audit-ready workflows."
        keywords="digital process automation, DPA services, enterprise workflow automation, process orchestration, low-code automation, cognitive automation, business process digitization, automation consulting, DPA platform, workflow management"
        url="https://kangqore.com/services/automation/digital-process-automation"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default DigitalProcessAutomation;
