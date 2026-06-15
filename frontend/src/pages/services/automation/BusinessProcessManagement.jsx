import React from 'react';
import { Activity, BarChart3, Bot, BrainCircuit, Building2, Cpu, Database, Factory, Heart, Layers, Search, Settings, Shield, ShoppingCart, Target, TrendingUp, Users, Workflow, Zap, DollarSign, RefreshCw, ShieldCheck, Network, FileText, Globe } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you ensure BPM automation is secure, compliant, and scalable?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our three-lines-of-defense model embeds risk ownership, compliance oversight, and independent assurance into every operating model. Dedicated compliance officers, enterprise-grade security controls, and scalable architecture ensure governance readiness at any scale — with full audit trails and policy enforcement mechanisms built in from day one." }
    },
    {
      "@type": "Question",
      "name": "How does GenAI change what's possible with business process management?",
      "acceptedAnswer": { "@type": "Answer", "text": "GenAI extends BPM beyond rules-based automation into judgment-intensive processes. It enables intelligent document processing, automated decision support, predictive process optimization, and natural-language workflow orchestration — so operations that previously required human expertise can be automated at scale while remaining auditable and controlled." }
    },
    {
      "@type": "Question",
      "name": "How quickly can we deploy BPM and see measurable outcomes?",
      "acceptedAnswer": { "@type": "Answer", "text": "Initial process assessment and modeling typically takes 2–4 weeks. A focused automation POC can be delivered in 4–6 weeks. Enterprise-wide BPM programs scale in phased sprints, with measurable outcomes — cycle time reduction, headcount reallocation, cost savings — visible from the first phase." }
    },
    {
      "@type": "Question",
      "name": "What ongoing support does Kangqore provide after BPM implementation?",
      "acceptedAnswer": { "@type": "Answer", "text": "We offer continuous process monitoring, KPI dashboards, optimization sprints, upskilling programs through our Transition Management Academy, and dedicated compliance oversight. Our model ensures sustained value — not just a successful launch that degrades without investment." }
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

const BusinessProcessManagement = () => {
  const service = {
    name: 'Business Process Management',
    titleLine1: 'Business Process',
    titleHighlight: 'Management',
    slug: 'business-process-management',
    shortDescription: 'Driving 360° operational excellence to build future-ready enterprises.',
    description: 'Kangqore redesigns, governs, and continuously optimizes enterprise business processes — combining BPM platforms, automation, GenAI, and analytics to deliver 360° operational excellence and measurable ROI.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Automation', link: '/department/automation' },
      { label: 'Business Process Management' }
    ],
    capabilitiesTitle: 'Our Capabilities.',

    stats: [
      { value: '40%', label: 'Cycle Time Reduction', color: 'text-cyan-400' },
      { value: '30%', label: 'Operational Cost Savings', color: 'text-brand-blue' },
      { value: '2–4 Wks', label: 'Assessment & Roadmap', color: 'text-cyan-400' },
      { value: '360°', label: 'Operational Excellence', color: 'text-brand-blue' }
    ],

    highFidelity: {
      narrative: {
        badge: 'OPERATIONAL EXCELLENCE :: 2026',
        titleLine1: 'Creating Real Impact',
        titleHighlight: 'through Intelligent',
        titleLine2: 'Business Experiences.',
        description: 'Dynamic markets demand dynamic operations. Kangqore helps organizations redesign, govern, and continuously improve business processes—combining BPM, automation, analytics, and AI to deliver scalable operating models and measurable outcomes. Our approach brings structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Fragmented workflows, rising operational costs, inconsistent service delivery, and siloed processes that block agility and scale.',
        requirementLabel: 'Our Approach',
        requirementText: 'Technology-led BPM with GenAI-enabled innovation, experience-driven design, flexible structures, and three lines of defense for compliance and quality.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
        statusLabel: 'Process Maturity',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <Workflow className="w-7 h-7 text-brand-blue" />,
        title: 'BPM',
        titleHighlight: 'Excellence-Driven.',
        description: 'We bring structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise with automation, AI, and domain expertise.',
        pills: ['Process Design', 'Hyper-Automation', 'Analytics & AI', 'Compliance & Quality']
      },
      matrix: {
        engineId: 'Engine :: BPM_Core_V3',
        title: 'BPM Delivery Model',
        subtext: 'A structured, domain-led approach to process transformation — from assessment to continuous optimization.',
        layers: [
          { title: 'Assess & Model', id: 'BPM_ASSESS', icon: <Search />, desc: '3-Level business process modeling with standardization, elimination of redundancies, and automation opportunity identification.' },
          { title: 'Design & Architect', id: 'BPM_DESIGN', icon: <Layers />, desc: 'Experience-led process design using CX labs, BPM programs, analytics, and operational insights for zero-friction workflows.' },
          { title: 'Implement & Automate', id: 'BPM_IMPL', icon: <Zap />, desc: 'Deploy RPA, cognitive automation, and AI-powered workflows across sales, finance, HR, supply chain, and customer operations.' },
          { title: 'Govern & Optimize', id: 'BPM_GOV', icon: <Shield />, desc: 'Three lines of defense, dedicated compliance officers, KPI dashboards, and continuous improvement cadence.' }
        ]
      },
      schematic: {
        titleLine1: 'Drive',
        titleHighlight: 'Agility.',
        description: 'Your operations should enable scale, not impede it. We build the foundations for 360° operational excellence.',
        stats: [
          { label: 'Quality', val: 'HARDENED' },
          { label: 'Compliance', val: 'EMBEDDED' },
          { label: 'Scale', val: 'ENTERPRISE' }
        ]
      }
    },

    customSections: (
      <>
        <AILogoTrustSection />

        <AIChallengesSection
          title="The Hidden Cost of"
          subtitle="Unoptimized Processes."
          challenges={[
            {
              problem: 'Process debt slowing enterprise agility — fragmented workflows that block speed and scale.',
              fix: '3-level process modeling and redesign that standardizes operations, eliminates redundancy, and unlocks automation at every layer.'
            },
            {
              problem: 'Compliance gaps in manual workflows creating audit exposure and regulatory risk.',
              fix: 'Embedded governance with three-lines-of-defense — risk ownership, compliance oversight, and independent assurance built into every process.'
            },
            {
              problem: 'No visibility into process performance — teams operating on instinct instead of data.',
              fix: 'Real-time BPM analytics and KPI dashboards that surface bottlenecks, measure outcomes, and drive continuous improvement.'
            }
          ]}
        />

        <AIArchitectureDiagram
          title="The BPM Delivery Framework."
          nodes={[
            {
              title: 'Consulting & Assessment',
              description: 'Uncover process gaps, maturity levels, and automation opportunities through structured discovery.',
              features: ['Process mining', 'Maturity assessment', 'CoE design'],
              icon: Search
            },
            {
              title: 'Process Design & Modeling',
              description: 'Map operations from strategy to task level using 3-level BPMN modeling and CX-led design principles.',
              features: ['3-level modeling', 'BPMN workflows', 'Optimization blueprints'],
              icon: Layers
            },
            {
              title: 'Technology Implementation',
              description: 'Configure and deploy leading BPM platforms integrated with RPA, AI, and enterprise data systems.',
              features: ['Appian / Pega / Camunda', 'Automation integration', 'Platform configuration'],
              icon: Zap
            },
            {
              title: 'Governance & Optimization',
              description: 'Sustain operational excellence through continuous monitoring, compliance controls, and improvement sprints.',
              features: ['KPI monitoring', 'Compliance controls', 'Continuous improvement'],
              icon: ShieldCheck
            }
          ]}
        />

        <UseCasesMagnificationList
          title="BPM Impact Across Industries."
          useCases={[
            {
              industry: 'Banking & Financial Services',
              description: 'Automate credit operations, regulatory reporting, and KYC onboarding — reducing cycle times, strengthening compliance, and enabling straight-through processing at scale.',
              tags: ['Credit Operations', 'Regulatory Reporting', 'KYC Onboarding', 'Straight-Through Processing']
            },
            {
              industry: 'Insurance Operations',
              description: 'Streamline claims processing, underwriting workflows, and compliance reporting — cutting operational cost while meeting regulatory requirements across policy lifecycles.',
              tags: ['Claims Processing', 'Underwriting', 'Policy Admin', 'Compliance Reporting']
            },
            {
              industry: 'Healthcare & Life Sciences',
              description: 'Optimize patient services, revenue cycle management, and prior authorization workflows — improving throughput, reducing denials, and enabling compliance-ready operations.',
              tags: ['Patient Services', 'Revenue Cycle', 'Prior Authorization', 'Clinical Compliance']
            },
            {
              industry: 'Retail & Consumer Packaged Goods',
              description: 'Modernize order management, supply chain operations, and vendor management — driving fulfilment accuracy, inventory efficiency, and supplier performance at enterprise scale.',
              tags: ['Order Management', 'Supply Chain', 'Vendor Management', 'Fulfilment Automation']
            }
          ]}
        />

        <AIAcceleratorRoadmap
          title="The BPM Transformation Roadmap."
          phases={[
            {
              num: '01',
              title: 'Process Discovery & Assessment',
              desc: 'Conduct stakeholder interviews, process mining, and maturity benchmarking to identify bottlenecks, automation opportunities, and the highest-impact improvement areas.',
              deliverables: ['Process maturity report', 'Automation opportunity map', 'Transformation business case']
            },
            {
              num: '02',
              title: 'Process Design & Optimization',
              desc: 'Apply 3-level BPMN modeling to redesign workflows — eliminating redundancies, embedding governance checkpoints, and defining the target-state operating model.',
              deliverables: ['3-level process models', 'Optimized workflow blueprints', 'Governance framework design']
            },
            {
              num: '03',
              title: 'Technology Implementation',
              desc: 'Configure and deploy the chosen BPM platform integrated with RPA, AI, and analytics — validated against compliance requirements and performance benchmarks before go-live.',
              deliverables: ['Platform configuration', 'Automation deployment', 'UAT and go-live sign-off']
            },
            {
              num: '04',
              title: 'Monitoring & Continuous Improvement',
              desc: 'Sustain and evolve the program through real-time KPI dashboards, optimization sprints, and structured upskilling — ensuring processes improve with the business, not lag behind it.',
              deliverables: ['KPI dashboards live', 'Optimization sprint cadence', 'Transition Management Academy']
            }
          ]}
        />

        <AIMetricsSection
          metrics={[
            {
              title: 'Cycle Time',
              desc: 'Average reduction in end-to-end process cycle time across finance, insurance, and operations engagements.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Cycle Time Reduction',
              icon: RefreshCw
            },
            {
              title: 'Operational Cost',
              desc: 'Cost savings delivered through process redesign and intelligent automation across enterprise BPM programs.',
              prefix: '',
              value: '30',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: DollarSign
            },
            {
              title: 'Process Accuracy',
              desc: 'Compliance and accuracy rate achieved across automated workflows with embedded three-lines-of-defense governance.',
              prefix: '',
              value: '99.5',
              suffix: '%',
              metricLabel: 'Compliance Rate',
              icon: ShieldCheck
            },
            {
              title: 'Deployment Speed',
              desc: 'Typical time from engagement kickoff to completed process assessment and modeling deliverables.',
              prefix: '',
              value: '2–4',
              suffix: ' Wk',
              metricLabel: 'Assessment Delivery',
              icon: Zap
            }
          ]}
        />

        <AITransformationMagnet />
      </>
    ),

    capabilities: [
      {
        title: 'Sales Operations',
        bgImage: '/images/capabilities/business-strategy.png',
        description: 'Streamline your sales lifecycle with process automation, pipeline governance, and data-driven insights that accelerate revenue growth.',
        items: [
          { heading: 'Lead-to-cash process automation', description: 'Automate the complete sales cycle from lead qualification through contract execution and cash collection — eliminating handoff delays and manual entry.' },
          { heading: 'Pipeline management & forecasting', description: 'Deploy real-time pipeline dashboards and AI-driven forecast models that give sales leadership accurate, up-to-date revenue visibility.' },
          { heading: 'Sales analytics & performance dashboards', description: 'Track rep performance, conversion rates, and deal velocity with automated reporting that surfaces where to coach, invest, and accelerate.' },
          { heading: 'CRM workflow optimization', description: 'Redesign CRM processes to eliminate redundant steps, automate follow-up actions, and ensure consistent data quality across the sales organization.' },
          { heading: 'Order management & fulfillment', description: 'Automate order processing workflows from placement through fulfillment with real-time status tracking and exception management.' }
        ]
      },
      {
        title: 'Customer Experience Management (CXM)',
        bgImage: '/images/capabilities/ux-design.png',
        description: 'Deliver consistent, personalized customer experiences across every touchpoint with intelligent process orchestration and real-time insights.',
        items: [
          { heading: '360-degree customer engagement', description: 'Unify customer data from CRM, support, billing, and digital channels into a single engagement profile that informs every interaction.' },
          { heading: 'Omnichannel service orchestration', description: 'Ensure customers receive consistent service quality whether contacting through web, mobile, phone, or chat — with seamless channel handoffs.' },
          { heading: 'Customer journey mapping & optimization', description: 'Map end-to-end customer journeys to identify friction points, redesign key touchpoints, and measure the impact of improvements.' },
          { heading: 'Voice of Customer (VoC) analytics', description: 'Capture and analyze customer feedback across channels using NLP and sentiment analysis to surface actionable experience insights.' },
          { heading: 'Service quality monitoring & SLA management', description: 'Track service delivery against defined SLAs in real time — with automated escalations when thresholds are breached.' }
        ]
      },
      {
        title: 'Hyper-Intelligent Automation',
        bgImage: '/images/capabilities/quality-testing.png',
        description: 'Combine RPA, AI, and cognitive technologies to automate complex, judgment-intensive processes at scale across the enterprise.',
        items: [
          { heading: 'Robotic Process Automation (RPA)', description: 'Deploy software bots for high-volume, rule-based tasks across IT and business operations — delivering speed, accuracy, and 24/7 throughput.' },
          { heading: 'Intelligent Document Processing (IDP)', description: 'Extract, classify, and validate data from invoices, contracts, and forms using AI-powered OCR and NLP — eliminating manual data entry at scale.' },
          { heading: 'AI-powered decision automation', description: 'Embed predictive models and decision rules into process workflows so the system automatically selects the optimal action based on context and risk.' },
          { heading: 'Cognitive workflow orchestration', description: 'Coordinate humans, bots, and AI systems within a single governed workflow that adapts dynamically to exceptions and changing conditions.' },
          { heading: 'GenAI-enabled process augmentation', description: 'Integrate generative AI into knowledge-intensive workflows — summarizing, drafting, and recommending — so employees focus on judgment, not effort.' }
        ]
      },
      {
        title: 'Finance & Accounting',
        bgImage: '/images/capabilities/finance.png',
        description: 'Transform financial operations with automated workflows, real-time reporting, and compliance-ready processes that reduce cost and risk.',
        items: [
          { heading: 'Procure-to-pay automation', description: 'Automate the complete purchase cycle from requisition through invoice processing and payment — with compliance checkpoints at every stage.' },
          { heading: 'Order-to-cash optimization', description: 'Accelerate revenue recognition by automating order processing, billing, and collections with real-time visibility into the cash conversion cycle.' },
          { heading: 'Record-to-report streamlining', description: 'Automate financial close processes, reconciliations, and management reporting — reducing close cycle time while improving accuracy and auditability.' },
          { heading: 'Treasury & cash management', description: 'Automate cash positioning, liquidity forecasting, and bank reconciliation to improve working capital visibility and reduce manual treasury risk.' },
          { heading: 'Regulatory reporting & compliance', description: 'Automate the generation, validation, and submission of regulatory reports to reduce compliance effort and eliminate manual reporting errors.' }
        ]
      },
      {
        title: 'Supply Chain Management',
        bgImage: '/images/capabilities/ai-cognitive.png',
        description: 'Build resilient, agile supply chains with end-to-end process visibility, predictive analytics, and automated procurement workflows.',
        items: [
          { heading: 'Procurement & vendor management', description: 'Automate vendor onboarding, sourcing workflows, and contract management — with performance tracking and compliance monitoring built in.' },
          { heading: 'Inventory optimization & demand planning', description: 'Use predictive models to optimize inventory levels, reduce carrying costs, and align stock with demand signals across locations.' },
          { heading: 'Logistics & fulfillment automation', description: 'Automate shipment orchestration, carrier selection, and delivery tracking to reduce logistics cost and improve on-time delivery rates.' },
          { heading: 'Supply chain risk management', description: 'Monitor supplier performance, geopolitical signals, and demand volatility in real time — with automated alerts and contingency workflows.' },
          { heading: 'Supplier performance analytics', description: 'Track and benchmark supplier quality, delivery reliability, and cost performance with dashboards that drive data-backed procurement decisions.' }
        ]
      },
      {
        title: 'Marketing Operations & Content',
        bgImage: '/images/capabilities/growth-marketing.png',
        description: 'Scale marketing execution with automated campaign workflows, content operations, and performance analytics for measurable ROI.',
        items: [
          { heading: 'Campaign management & automation', description: 'Automate campaign scheduling, audience targeting, and multi-channel execution — reducing time to launch and improving personalization at scale.' },
          { heading: 'Content lifecycle management', description: 'Manage content creation, review, approval, and distribution workflows in a single governed system that ensures brand compliance and speed.' },
          { heading: 'Marketing analytics & attribution', description: 'Track campaign performance across channels with multi-touch attribution models that connect marketing investment to pipeline and revenue.' },
          { heading: 'Brand compliance & governance', description: 'Automate brand review workflows and asset governance to ensure every piece of content meets standards before it reaches the market.' },
          { heading: 'Digital asset management', description: 'Centralize, organize, and distribute digital assets with automated metadata tagging and version control to eliminate duplicate content and lost files.' }
        ]
      },
      {
        title: 'Human Resource Services',
        bgImage: '/images/capabilities/business-strategy.png',
        description: 'Modernize HR operations with automated employee lifecycle management, compliance-ready processes, and workforce analytics.',
        items: [
          { heading: 'Employee onboarding & offboarding', description: 'Automate provisioning, documentation, training scheduling, and access management so new hires are productive from day one and exits are secure.' },
          { heading: 'Payroll & benefits administration', description: 'Streamline payroll processing, benefits enrollment, and compliance reporting with automated workflows that reduce errors and audit exposure.' },
          { heading: 'Talent acquisition & management', description: 'Automate candidate screening, interview scheduling, offer generation, and onboarding to accelerate hiring cycles and improve candidate experience.' },
          { heading: 'Workforce planning & analytics', description: 'Deploy dashboards and predictive models that help HR and business leaders plan headcount, identify retention risks, and optimize workforce investment.' },
          { heading: 'Learning & development programs', description: 'Automate training assignment, completion tracking, and skills gap analysis — aligning L&D investment with business capability requirements.' }
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
        title="Business Process Management Services — Enterprise BPM & AI Automation"
        description="Kangqore redesigns, governs, and continuously optimizes enterprise business processes — combining BPM platforms, RPA, AI, and analytics to deliver 360° operational excellence and measurable ROI."
        keywords="business process management, BPM services, enterprise BPM, process optimization, BPM consulting, Appian Pega ServiceNow, process automation, digital transformation, operational excellence, BPM implementation"
        url="https://kangqore.com/services/automation/business-process-management"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default BusinessProcessManagement;
