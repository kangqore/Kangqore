import React from 'react';
import { Activity, Bot, BrainCircuit, Cpu, Layers, Search, Settings, Shield, Target, Workflow, Zap, BarChart3, FileText, Users, Factory, Building2, Heart, ShoppingCart, Database, TrendingUp, DollarSign, RefreshCw, Network, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you select and prioritize which processes to automate with RPA?",
      "acceptedAnswer": { "@type": "Answer", "text": "We assess and prioritize automation opportunities against three criteria: current automation rates, transactional volume, and ease of implementation. We then help build a business case for the highest-value candidates and verify it during a first RPA pilot — securing management buy-in with evidence, not estimates." }
    },
    {
      "@type": "Question",
      "name": "What happens when RPA bots encounter exceptions or system changes?",
      "acceptedAnswer": { "@type": "Answer", "text": "Exception handling is engineered into every bot workflow from the start — not patched in after deployment. We implement structured exception queues, human-in-the-loop escalation paths, and automated alerting so exceptions are triaged and resolved without disrupting the broader workflow. When underlying systems change, our CoE model ensures bots are updated proactively, not reactively." }
    },
    {
      "@type": "Question",
      "name": "How does the Proof of Concept process work before we commit to full RPA deployment?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our structured POC runs in three phases: POC Selection (1–2 days) to assess complexity and estimate business value; Process Reengineering (2 days) to interview stakeholders and evaluate current process efficiency; and Development & Testing (5–7 days) to install the platform and deliver a working automation. You see real output before committing to scale." }
    },
    {
      "@type": "Question",
      "name": "Can RPA integrate with AI and cognitive technologies as our needs evolve?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Kangqore's RPA services are architected to integrate with AI, machine learning, and cognitive automation systems from the start. Beyond screen automation, we build cognitive robots capable of document understanding, intelligent decision-making, and adaptive learning — protecting your investment as requirements grow more complex." }
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

const RoboticProcessAutomation = () => {
  const service = {
    name: 'Robotic Process Automation',
    titleLine1: 'Robotic Process',
    titleHighlight: 'Automation',
    slug: 'robotic-process-automation',
    shortDescription: 'Integrate RPA with AI, ML, and knowledge-based systems to drive enterprise-wide transformation.',
    description: 'Deploy software bots that automate high-volume, rules-based IT and business processes — integrating with AI and cognitive systems to reduce cost, improve accuracy, and scale your digital workforce enterprise-wide.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Automation', link: '/department/automation' },
      { label: 'Robotic Process Automation' }
    ],
    capabilitiesTitle: 'Our Capabilities.',

    stats: [
      { value: '40%', label: 'Cost Reduction', color: 'text-cyan-400' },
      { value: '99.8%', label: 'Process Accuracy', color: 'text-brand-blue' },
      { value: '5–7 Days', label: 'POC Delivery', color: 'text-cyan-400' },
      { value: '10x', label: 'Bot Scalability', color: 'text-brand-blue' }
    ],

    highFidelity: {
      narrative: {
        badge: 'ENTERPRISE AUTOMATION :: 2026',
        titleLine1: 'Drive',
        titleHighlight: 'Transformation.',
        titleLine2: 'Reduce Cost.',
        description: 'With the shared services and business process outsourcing industry maturing, clients are demanding increased operational efficiency and higher transactional volumes. These conflicting requirements of increased efficiency and reduced costs are together fostering the shift towards robotic process automation.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Manual processes, legacy system silos, rising operational costs, and increasing transactional volumes demanding price cuts while maintaining quality.',
        requirementLabel: 'Our Solution',
        requirementText: 'Select the most appropriate RPA operating & governance model, assess and prioritize automation opportunities, build business cases, and implement scalable automation solutions.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
        statusLabel: 'Automation Maturity',
        statusValue: 'Enterprise'
      },
      philosophy: {
        icon: <Cpu className="w-7 h-7 text-brand-blue" />,
        title: 'RPA',
        titleHighlight: 'End-to-End.',
        description: 'Our highly skilled RPA experts work alongside your business and IT teams to continuously identify processes ripe for automation, select suitable RPA technology, develop automation workflows, and help sustain your robot workforce.',
        pills: ['RPA Assessment', 'Process Discovery', 'Bot Development', 'Managed Services']
      },
      matrix: {
        engineId: 'Engine :: RPA_Core_V4',
        title: 'RPA Delivery Model',
        subtext: 'A structured approach empowering organizations to select the right operating model, prioritize automation opportunities, build business cases, and implement scalable solutions.',
        layers: [
          { title: 'Assess & Prioritize', id: 'RPA_ASSESS', icon: <Search />, desc: 'Assess and prioritize automation opportunities according to current automation rates, transactional volume, and ease of implementation.' },
          { title: 'Build Business Case', id: 'RPA_BIZ', icon: <BarChart3 />, desc: 'Build business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders.' },
          { title: 'Implement & Develop', id: 'RPA_IMPL', icon: <Settings />, desc: 'Implement and develop services to create simple screen automation as well as cognitive robots for complex processes.' },
          { title: 'Sustain & Scale', id: 'RPA_SCALE', icon: <Zap />, desc: 'Help sustain robot workforce with continuous process identification, monitoring, optimization, and enterprise-wide scaling.' }
        ]
      },
      schematic: {
        titleLine1: 'Maximize',
        titleHighlight: 'Efficiency.',
        description: 'Create a digital workforce that is reliable, secure, and scalable — whether you are starting your RPA journey or expanding intelligent automation.',
        stats: [
          { label: 'Reliability', val: 'PROVEN' },
          { label: 'Security', val: 'HARDENED' },
          { label: 'Scale', val: 'ENTERPRISE' }
        ]
      }
    },

    customSections: (
      <>
        <AILogoTrustSection />

        <AIChallengesSection
          title="The Problem with"
          subtitle="Fragile Bots."
          challenges={[
            {
              problem: 'Brittle screen automation that breaks on every system change.',
              fix: 'Cognitive bots with adaptive exception handling that self-recover and escalate intelligently.'
            },
            {
              problem: 'Bots operating in isolation with no enterprise oversight or governance.',
              fix: 'Unified automation platform with CoE oversight, performance dashboards, and change management.'
            },
            {
              problem: 'No visibility into ROI — bots deployed and forgotten.',
              fix: 'Real-time bot performance dashboards tied to business KPIs and continuous optimization cadence.'
            }
          ]}
        />

        <AIArchitectureDiagram
          title="The RPA Delivery Architecture."
          nodes={[
            {
              title: 'Process Discovery',
              description: 'Identify and prioritize automation opportunities by volume, complexity, and business value.',
              features: ['Process mining & mapping', 'Opportunity assessment', 'ROI modeling'],
              icon: Search
            },
            {
              title: 'Bot Development',
              description: 'Build screen automation and cognitive bots with robust exception handling and testing.',
              features: ['Screen automation', 'Cognitive bots', 'Exception handling'],
              icon: Bot
            },
            {
              title: 'Integration Layer',
              description: 'Connect bots to enterprise systems via APIs, ERP/CRM bridges, and legacy connectors.',
              features: ['API connectors', 'ERP/CRM bridge', 'Legacy system access'],
              icon: Network
            },
            {
              title: 'CoE & Governance',
              description: 'Sustain and scale the digital workforce with monitoring, compliance, and continuous optimization.',
              features: ['Performance monitoring', 'Compliance controls', 'Continuous optimization'],
              icon: ShieldCheck
            }
          ]}
        />

        <UseCasesMagnificationList
          title="RPA Across Business Functions."
          useCases={[
            {
              industry: 'Finance & Accounting Automation',
              description: 'Automate invoice processing, account reconciliation, payment runs, and financial reporting — reducing close cycles and eliminating manual errors across the finance function.',
              tags: ['Invoice Processing', 'Reconciliation', 'Payment Automation', 'Financial Reporting']
            },
            {
              industry: 'IT Operations Automation',
              description: 'Deploy bots for incident management, L1/L2 support ticket resolution, user provisioning, and security control testing — freeing IT teams for higher-value work.',
              tags: ['Incident Management', 'L1/L2 Support', 'User Provisioning', 'Security Automation']
            },
            {
              industry: 'Human Resources Automation',
              description: 'Streamline employee onboarding, offboarding, payroll processing, and benefits administration — ensuring consistent, compliant HR operations at scale.',
              tags: ['Employee Onboarding', 'Offboarding', 'Payroll Processing', 'Benefits Admin']
            },
            {
              industry: 'Insurance Process Automation',
              description: 'Accelerate claims processing, automate underwriting checks, and streamline policy administration — improving cycle times and compliance across insurance operations.',
              tags: ['Claims Processing', 'Underwriting Checks', 'Policy Admin', 'Compliance Reporting']
            }
          ]}
        />

        <AIAcceleratorRoadmap
          title="From POC to Enterprise Scale."
          phases={[
            {
              num: '01',
              title: 'Process Discovery & Selection',
              desc: 'Assess automation candidates by complexity, volume, and ROI potential. Build a prioritized automation backlog with management-ready business cases.',
              deliverables: ['POC assessment', 'Complexity scoring', 'Business case report']
            },
            {
              num: '02',
              title: 'Bot Development & Testing',
              desc: 'Develop screen automation and cognitive bots with full exception mapping. Validate against production conditions through structured UAT cycles.',
              deliverables: ['Bot development', 'UAT completion', 'Exception mapping']
            },
            {
              num: '03',
              title: 'CoE Establishment',
              desc: 'Stand up the RPA Center of Excellence with governance policies, bot performance monitoring, and guardrails for citizen developer participation.',
              deliverables: ['Governance model', 'Monitoring dashboards', 'Citizen dev guardrails']
            },
            {
              num: '04',
              title: 'Scale & Optimize',
              desc: 'Expand automation across business functions with continuous improvement sprints, capacity planning, and AI integration to extend bot intelligence.',
              deliverables: ['Cross-function rollout', 'Continuous improvement', 'AI integration roadmap']
            }
          ]}
        />

        <AIMetricsSection
          metrics={[
            {
              title: 'Operational Cost',
              desc: 'Average cost reduction achieved across IT and business process automation programs delivered by Kangqore.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Cost Reduction',
              icon: DollarSign
            },
            {
              title: 'Process Accuracy',
              desc: 'Bot execution accuracy across finance, HR, and insurance automation — virtually eliminating manual errors.',
              prefix: '',
              value: '99.8',
              suffix: '%',
              metricLabel: 'Accuracy',
              icon: ShieldCheck
            },
            {
              title: 'Deployment Speed',
              desc: 'Typical time from kickoff to a working POC — so you see real automation output before committing to scale.',
              prefix: '',
              value: '5–7',
              suffix: ' Day',
              metricLabel: 'POC Delivery',
              icon: Zap
            },
            {
              title: 'Capacity',
              desc: 'Enterprise scalability factor — bots replicated and deployed across functions without proportional cost increase.',
              prefix: '',
              value: '10',
              suffix: 'x',
              metricLabel: 'Bot Scalability',
              icon: TrendingUp
            }
          ]}
        />

        <AITransformationMagnet />
      </>
    ),

    capabilities: [
      {
        title: 'IT Process Automation',
        bgImage: '/images/capabilities/quality-testing.png',
        description: 'Improve accuracy and consistency of IT processes while saving time and cost.',
        items: [
          { heading: 'IT Operations Management', description: 'Automate repetitive and routine IT tasks to reduce downtime and improve incident management process.' },
          { heading: 'IT Services Management', description: 'Automate L1 and L2 support services that handled repetitive, manual processes.' },
          { heading: 'Security Operations Center', description: 'Automatically detect security threats across enterprise systems, send alerts, eliminate potential risks, and test security systems periodically to ensure they actually work and stay up to date.' },
          { heading: 'Repetitive Control Activities', description: 'Automate repetitive control activities and ensure controls are consistent across systems for easier audits and lesser findings.' }
        ]
      },
      {
        title: 'Business Process Automation',
        bgImage: '/images/capabilities/quality-testing.png',
        description: 'Scale your business to grow and enhance customer service without deploying any additional resources.',
        items: [
          { heading: 'Human Resource', description: 'Automate employee onboarding and offboarding, candidate notifications for interviews and feedback, data consolidation across disparate systems, and role-based access management.' },
          { heading: 'Finance & Accounting', description: 'Automate source-to-pay payment processing, fund accounting and management, credit operations, and financial reconciliation workflows at scale.' },
          { heading: 'Insurance Operations', description: 'Streamline claims processing, corporate reporting, transaction processing, underwriting system workflows, and insurance product management with zero manual intervention.' },
          { heading: 'Customer Experience Management', description: 'Enable 360-degree customer engagement and automate customer data management with AI-driven insight discovery across all service channels.' }
        ]
      },
      {
        title: 'Proof of Concept',
        bgImage: '/images/capabilities/business-strategy.png',
        description: 'Explore new sources of value creation and prove the ROI of RPA implementation with a structured POC project.',
        items: [
          { heading: 'POC Selection (1–2 days)', description: 'Assess process complexity and estimate business value impact with Business SMEs and RPA experts — building the case before a single line of code is written.' },
          { heading: 'Process Reengineering (2 days)', description: 'Interview stakeholders and evaluate current process efficiency to identify automation readiness, exception paths, and redesign opportunities.' },
          { heading: 'Development & Testing (5–7 days)', description: 'Install the RPA platform, develop the automation solution, and validate against production conditions — delivering working output before full commitment.' },
          { heading: 'Go/No-Go Decision', description: 'Present POC results with ROI evidence and performance data to secure management buy-in with confidence, not estimates.' }
        ]
      }
    ]
  };

  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge intelligent automation solutions.'
  };

  const pageData = {
    service,
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="Robotic Process Automation Services — Enterprise RPA & Cognitive Bots"
        description="Kangqore deploys intelligent RPA bots to automate high-volume IT and business processes — integrating with AI, ML, and cognitive systems to reduce operational cost and build a scalable digital workforce."
        keywords="robotic process automation, RPA services, enterprise RPA, RPA consulting, software bots, cognitive RPA, RPA CoE, AI-powered automation, digital workforce, UiPath Automation Anywhere"
        url="https://kangqore.com/services/automation/robotic-process-automation"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default RoboticProcessAutomation;
