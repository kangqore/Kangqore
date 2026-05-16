// ─── Kangqore Cognition — Premium Service Content (Phase G2) ─────────────────
// Per-service premium presentation layer for Cognition (and one Shield service
// whose AI assets are technically coupled to AICustomSections — see ai-governance
// note below). Each entry is an object that merges over the canonical base
// service from servicesData.js to produce the legacy-template-compatible shape.
//
// Per DoD #3: do NOT include base identity fields here (name, slug,
// departmentSlug, shortDescription). ServicePageReal re-asserts those after
// the spread and will silently drop any duplicates.
//
// Per locked constraint #1: AI Governance is canonically owned by Shield —
// its `departmentSlug` in servicesData stays 'shield'. We co-locate its
// premium content here because its assets share AICustomSections. The
// breadcrumb / canonical metadata will correctly show Shield because
// ServicePageReal looks up `departmentsData[svc.departmentSlug]`.
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
  Brain, BrainCircuit, Zap, ShieldCheck, Shield, Search, Network, Target,
  DollarSign, TrendingUp, Layers, Activity, Database, BarChart3, Cloud,
  Cpu, Sparkles, RefreshCw, Lock, AlertTriangle,
} from 'lucide-react';
import {
  AIChallengesSection,
  AILogoTrustSection,
  AIArchitectureDiagram,
  UseCasesMagnificationList,
  AIAcceleratorRoadmap,
  AIMetricsSection,
  AITransformationMagnet,
} from './AICustomSections';

// ─── agentic-ai (Cognition) ────────────────────────────────────────────────────
const agenticAI = {
  titleLine1: 'Agentic',
  titleHighlight: 'AI.',
  description:
    'Deploy intelligent AI agents that reason, plan, and act — autonomously and responsibly — across your business.',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Autonomous', label: 'Goal Execution', color: 'text-brand-blue' },
    { value: 'Zero', label: 'Human Overhead', color: 'text-cyan-400' },
    { value: '100%', label: 'Governance Audit', color: 'text-brand-blue' },
    { value: 'Real-time', label: 'Adaptive Reasoning', color: 'text-cyan-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Autonomous Intelligence :: 2026',
      titleLine1: 'Engineer',
      titleHighlight: 'Autonomy.',
      titleLine2: 'Operate at Scale.',
      description:
        'Traditional automation breaks at scale. We engineer agentic AI systems that reason, plan, and execute complex multi-step workflows autonomously — with governance and human oversight built in from day one.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Rule-based automation that breaks at complexity and scale.',
      requirementLabel: 'The Requirement',
      requirementText: 'Adaptive, governed, goal-oriented digital operators.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      statusLabel: 'Agent Health',
      statusValue: 'Operational',
    },
    philosophy: {
      icon: <Brain className="w-7 h-7 text-brand-blue" />,
      title: 'Agentic',
      titleHighlight: 'Intelligence-First Design.',
      description:
        'We believe AI should not just assist work — it should operate work. Our "Intelligence-First" approach ensures every agent is designed for long-term autonomy, enterprise integration, and measurable outcome delivery.',
      pills: ['Multi-Agent Orchestration', 'HITL Governed', 'RAG Powered', 'LLMOps Ready'],
    },
    matrix: {
      engineId: 'Engine :: AgentFlow_V5',
      title: 'Enablement Matrix',
      subtext:
        'Our comprehensive agentic AI lifecycle deconstructed into modular, high-impact, and governed intelligence layers.',
      layers: [
        { title: 'Design', id: 'AGT_ARCH', icon: <Search />, desc: 'Agent architecture and goal-decomposition mapping.' },
        { title: 'Orchestrate', id: 'AGT_ORCH', icon: <Network />, desc: 'Multi-agent workflow and tool-use orchestration.' },
        { title: 'Deploy', id: 'AGT_RUN', icon: <Zap />, desc: 'Production deployment with HITL oversight and monitoring.' },
        { title: 'Govern', id: 'AGT_RULE', icon: <ShieldCheck />, desc: 'Audit trails, policy enforcement, and drift detection.' },
      ],
    },
    schematic: {
      titleLine1: 'Scale',
      titleHighlight: 'Intelligence.',
      description:
        'Your enterprise should run on intelligence, not instructions. We build the foundations for exponential autonomous operations.',
      stats: [
        { label: 'Autonomy', val: 'ABSOLUTE' },
        { label: 'Overhead', val: 'MINIMIZED' },
        { label: 'Scale', val: 'ELASTIC' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Autonomous Goal Execution',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Multi-step Planning', description: 'Agents dynamically break down high-level goals into actionable tasks.' },
        { heading: 'Self-Correction', description: 'Built-in logic for agents to detect failures and automatically adjust their strategy.' },
        { heading: 'Tool Utilization', description: 'Agents access enterprise APIs, databases, and third-party systems independently.' },
        { heading: 'Dynamic Reasoning', description: 'Real-time contextual understanding adapting to complex workflow variables.' },
      ],
    },
    {
      title: 'Multi-Agent Orchestration',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        { heading: 'Agent Collaboration', description: 'Deploy swarms of specialized agents that collaborate to solve enterprise challenges.' },
        { heading: 'Task Handoffs', description: 'Seamless transitions between specialized agents for continuous workflow execution.' },
        { heading: 'Conflict Resolution', description: 'Automated consensus mechanisms for agents working on shared datasets.' },
        { heading: 'Orchestrator Dashboards', description: 'Centralized platforms to monitor agent performance, status, and system health.' },
      ],
    },
    {
      title: 'Governed Autonomy',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        { heading: 'Human-in-the-Loop', description: 'Strategic escalation pathways ensuring humans remain in control of high-stakes actions.' },
        { heading: 'Audit Trails', description: 'Immutable logs detailing every decision, tool call, and reasoning step taken by an agent.' },
        { heading: 'Policy Enforcement', description: 'Strict guardrails preventing agents from violating ethical or enterprise guidelines.' },
        { heading: 'Role-Based Access', description: 'Limiting agent permissions based on zero-trust security architectures.' },
      ],
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Limits of"
        subtitle="Traditional Automation."
        challenges={[
          { problem: 'Rules break at scale.', fix: 'Agentic systems reason through edge cases dynamically without human intervention.' },
          { problem: 'Isolated task execution.', fix: 'Multi-agent orchestration allows agents to collaborate and hand off complex workflows.' },
          { problem: 'Lack of enterprise control.', fix: 'Our architectures embed policy enforcement, audit trails, and HITL overrides by design.' },
        ]}
      />
      <AIArchitectureDiagram
        title="Governed Agentic Architecture."
        nodes={[
          { title: 'Perception Layer', description: 'Agents ingest and understand multi-modal context from enterprise systems.', features: ['RAG Integration', 'API Connectors', 'Real-time Event Streams'], icon: Search },
          { title: 'Cognitive Engine', description: 'LLM-powered reasoning for planning, tool selection, and goal decomposition.', features: ['Multi-step Planning', 'Memory Management', 'Self-Correction'], icon: Brain },
          { title: 'Action & Execution', description: 'Agents autonomously execute tasks across CRM, ERP, and internal tools.', features: ['Function Calling', 'Workflow Automation', 'System Write Access'], icon: Zap },
          { title: 'Governance Core', description: 'Strict oversight, ethical boundaries, and policy enforcement.', features: ['Audit Logs', 'RBAC', 'Human-in-the-Loop'], icon: ShieldCheck },
        ]}
      />
      <UseCasesMagnificationList
        title="Where Agents Create Alpha."
        useCases={[
          { industry: 'Financial Services', description: 'Autonomous agents for complex fraud investigation, dynamic risk modeling, and hyper-personalized wealth advisory.', tags: ['Risk Modeling', 'Fraud Detection', 'Wealth Advisory'] },
          { industry: 'Supply Chain & Logistics', description: 'Multi-agent systems that negotiate with suppliers, re-route shipments dynamically, and optimize inventory without manual intervention.', tags: ['Inventory Ops', 'Supplier Negotiation', 'Route Optimization'] },
          { industry: 'Software Engineering', description: 'DevOps agents that autonomously triage bugs, write tests, and deploy fixes to production with human oversight.', tags: ['Automated QA', 'Bug Triage', 'DevOps Ops'] },
          { industry: 'Customer Operations', description: 'Level 2/3 support agents that resolve complex, multi-step customer issues by querying databases and updating systems.', tags: ['L3 Support', 'Issue Resolution', 'Account Management'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="From Pilot to Production."
        phases={[
          { num: '01', title: 'Agent Architecture Design', desc: 'We map your workflows, identify agentic opportunities, and design the multi-agent system architecture.', deliverables: ['Workflow Decomposition', 'Agent Personas', 'System Blueprint', 'ROI Modeling'] },
          { num: '02', title: 'Foundation & Integration', desc: 'Building the RAG pipelines, tool integrations, and secure environments needed for agents to operate.', deliverables: ['Vector DB Setup', 'API Tool Creation', 'Security Sandboxing', 'Data Pipelines'] },
          { num: '03', title: 'Cognitive Orchestration', desc: 'Developing the LLM logic, memory systems, and multi-agent coordination frameworks.', deliverables: ['Prompt Engineering', 'LangGraph Setup', 'Memory Systems', 'Evaluation Framework'] },
          { num: '04', title: 'Governed Deployment', desc: 'Rolling out the agents with human-in-the-loop oversight, audit trails, and continuous monitoring.', deliverables: ['HITL Dashboards', 'Production Deployment', 'Drift Monitoring', 'Policy Enforcement'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Operational Velocity', desc: 'Faster execution of complex, multi-step workflows.', prefix: '', value: '40', suffix: '%', metricLabel: 'Increase in Speed', icon: Zap },
          { title: 'Error Reduction', desc: 'Decrease in human error for repetitive tasks.', prefix: '', value: '99', suffix: '%', metricLabel: 'Accuracy Rate', icon: Target },
          { title: 'Cost Efficiency', desc: 'Reduction in operational overhead and manual labor.', prefix: '', value: '60', suffix: '%', metricLabel: 'Cost Savings', icon: DollarSign },
          { title: 'Scalability', desc: 'Ability to handle workload spikes without adding headcount.', prefix: '', value: '10', suffix: 'x', metricLabel: 'Capacity Increase', icon: TrendingUp },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── ai-cognitive-computing (Cognition) ────────────────────────────────────────
const aiCognitiveComputing = {
  titleLine1: 'Cognitive',
  titleHighlight: 'Computing.',
  description:
    'Deploy AI systems that can perceive, understand, learn, and reason — transforming raw data into actionable intelligence across your organization.',
  image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  highFidelity: {
    narrative: {
      badge: 'Enterprise Excellence :: 2026',
      titleLine1: 'Enterprise',
      titleHighlight: 'AI & Cognitive Computing.',
      titleLine2: 'At Scale.',
      description:
        'We design and deliver AI & Cognitive Computing solutions that move beyond incremental improvement — embedding capability, governance, and measurable business value into every engagement.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Fragmented delivery and misaligned strategy limiting enterprise impact.',
      requirementLabel: 'The Requirement',
      requirementText: 'Governed, integrated, and outcome-assured AI & Cognitive Computing delivery.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Delivery',
      statusValue: 'Optimized',
    },
    philosophy: {
      icon: <Zap className="w-7 h-7 text-brand-blue" />,
      title: 'AI & Cognitive Computing',
      titleHighlight: 'Outcome-First Design.',
      description:
        'We believe every AI & Cognitive Computing engagement should deliver compounding enterprise value — not just deliverables, but lasting organizational capability.',
      pills: ['Outcome-Led', 'Governed', 'Scalable', 'ROI-Focused'],
    },
    matrix: {
      engineId: 'Engine :: AI-COGNI_V3',
      title: 'Enablement Matrix',
      subtext: 'Our AI & Cognitive Computing lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
      layers: [
        { title: 'Assess', id: 'AI-C_ASSESS', icon: <Search />, desc: 'Discovery, assessment, and strategic alignment.' },
        { title: 'Design', id: 'AI-C_DESIGN', icon: <Layers />, desc: 'Architecture design and solution planning.' },
        { title: 'Deliver', id: 'AI-C_DEL', icon: <Activity />, desc: 'Structured implementation and delivery.' },
        { title: 'Govern', id: 'AI-C_GOV', icon: <ShieldCheck />, desc: 'Governance, monitoring, and continuous optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Deliver',
      titleHighlight: 'Value.',
      description: 'Your AI & Cognitive Computing investment should generate compounding business returns. We engineer the delivery frameworks that make it measurable and sustained.',
      stats: [
        { label: 'Quality', val: 'ABSOLUTE' },
        { label: 'Speed', val: 'ACCELERATED' },
        { label: 'ROI', val: 'MEASURABLE' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Machine Learning',
      bgImage: '/images/capabilities/education.png',
      description: 'Machine Learning enables systems to identify patterns, learn from data, and improve outcomes without explicit programming. Our ML capabilities drive faster decision-making, intelligent automation, predictive and prescriptive insights, and scalable learning systems.',
      items: [
        { heading: 'Deep Learning', description: 'Advanced neural networks for complex pattern recognition and predictive modeling.' },
        { heading: 'Predictive Analytics', description: 'Forecast trends, behaviors, and outcomes using historical and real-time data.' },
        { heading: 'Statistical Modeling', description: 'Build robust statistical models for data analysis and decision support.' },
        { heading: 'Data Mining', description: 'Extract valuable insights and patterns from large datasets.' },
        { heading: 'Supervised & Unsupervised Learning', description: 'Implement classification, regression, clustering, and dimensionality reduction techniques.' },
      ],
    },
    {
      title: 'Image Processing & Video Analytics',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Extract meaningful intelligence from visual data while reducing manual effort and improving operational efficiency.',
      items: [
        { heading: 'Face Detection', description: 'Accurately detect and identify faces in images and video streams.' },
        { heading: 'Object Identification', description: 'Recognize and classify objects within visual content for automated analysis.' },
        { heading: 'OCR (Optical Character Recognition)', description: 'Convert printed and handwritten text from images into machine-readable data.' },
        { heading: 'Scene Understanding', description: 'Analyze and interpret visual scenes for context-aware decision-making.' },
        { heading: 'Person Tracking', description: 'Track individuals across video frames for security and analytics applications.' },
        { heading: 'Image & Video Tagging', description: 'Automatically tag and categorize visual content for organization and search.' },
      ],
    },
    {
      title: 'Natural Language Understanding (NLU)',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Enable machines to understand, interpret, and respond to human language with context and accuracy.',
      items: [
        { heading: 'Conversational Interfaces & Chatbots', description: 'Build intelligent conversational agents for customer service and support.' },
        { heading: 'Speech & Voice Recognition', description: 'Convert spoken language into text and enable voice-based interactions.' },
        { heading: 'Text Mining', description: 'Extract insights and patterns from unstructured text data.' },
        { heading: 'Information Extraction', description: 'Automatically identify and extract relevant information from documents.' },
        { heading: 'Question Answering Systems', description: 'Build systems that understand questions and provide accurate answers.' },
        { heading: 'Intelligent Search & Retrieval', description: 'Implement semantic search capabilities for improved information discovery.' },
      ],
    },
    {
      title: 'Augmented & Virtual Reality',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Deliver immersive, interactive experiences that enhance engagement, visualization, and learning.',
      items: [
        { heading: 'AR/VR Product Visualization', description: 'Enable customers to visualize products in real-world environments before purchase.' },
        { heading: 'Data Visualization in VR', description: 'Explore complex data in immersive 3D environments for better insights.' },
        { heading: 'Retail & Fashion Experiences', description: 'Virtual try-ons and immersive shopping experiences.' },
        { heading: 'Automotive Simulations', description: 'Design, test, and experience vehicles in virtual environments.' },
        { heading: 'Smart Navigation & Augmented Maps', description: 'Overlay navigation and contextual information on real-world views.' },
      ],
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Limits of"
        subtitle="Basic Analytics."
        challenges={[
          { problem: 'Data without context.', fix: 'Cognitive systems understand unstructured data, extracting meaning from text, audio, and vision.' },
          { problem: 'Reactive decision making.', fix: 'Predictive and prescriptive models anticipate outcomes and recommend optimal actions.' },
          { problem: 'Black-box algorithms.', fix: 'We engineer explainable AI so human operators trust the logic behind every decision.' },
        ]}
      />
      <AIArchitectureDiagram
        title="Cognitive System Architecture."
        nodes={[
          { title: 'Ingestion', description: 'Process structured and unstructured data at scale from any enterprise source.', features: ['Computer Vision', 'Audio Processing', 'NLP / Text Mining'], icon: Layers },
          { title: 'Understanding', description: 'Extract semantic meaning, sentiment, and relationships from raw inputs.', features: ['Entity Recognition', 'Contextual Analysis', 'Knowledge Graphs'], icon: Search },
          { title: 'Reasoning', description: 'Evaluate multiple scenarios and optimize for the best possible outcome.', features: ['Predictive Modeling', 'Optimization Algorithms', 'Reinforcement Learning'], icon: Brain },
          { title: 'Interaction', description: 'Deliver insights through natural interfaces that humans can easily understand.', features: ['Conversational UI', 'Explainability Dashboards', 'API Integration'], icon: Activity },
        ]}
      />
      <UseCasesMagnificationList
        title="Cognitive Intelligence in Action."
        useCases={[
          { industry: 'Healthcare & Life Sciences', description: 'Clinical decision support systems that analyze patient history, lab results, and medical literature to recommend personalized treatment pathways.', tags: ['Decision Support', 'Medical Imaging', 'Patient Care'] },
          { industry: 'Manufacturing & Industry', description: 'Computer vision systems that detect microscopic defects on assembly lines in real-time, reducing waste and ensuring absolute quality control.', tags: ['Quality Control', 'Defect Detection', 'Predictive Maintenance'] },
          { industry: 'Retail & Consumer Goods', description: 'Demand forecasting models that ingest weather patterns, social sentiment, and historical sales to optimize inventory distribution.', tags: ['Demand Forecasting', 'Pricing Optimization', 'Sentiment Analysis'] },
          { industry: 'Media & Entertainment', description: 'Audio and video intelligence that automatically categorizes content, generates highlights, and personalizes viewer recommendations.', tags: ['Content Tagging', 'Video Analytics', 'Personalization'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="The Path to Intelligence."
        phases={[
          { num: '01', title: 'Data & Feasibility Assessment', desc: 'We evaluate your data readiness, identify high-value cognitive use cases, and validate technical feasibility.', deliverables: ['Data Readiness Score', 'Use Case Prioritization', 'Technical Feasibility Report'] },
          { num: '02', title: 'Model Engineering', desc: 'Developing, training, and fine-tuning custom models (vision, NLP, predictive) tailored to your specific domain.', deliverables: ['Custom Model Development', 'Feature Engineering', 'Algorithm Selection'] },
          { num: '03', title: 'System Integration', desc: 'Embedding cognitive capabilities directly into your existing enterprise applications and workflows.', deliverables: ['API Development', 'Workflow Integration', 'User Interface Design'] },
          { num: '04', title: 'Optimization & MLOps', desc: 'Deploying robust monitoring to track model drift, ensure accuracy, and continuously improve performance.', deliverables: ['Performance Dashboards', 'Drift Monitoring', 'Automated Retraining Pipelines'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Decision Speed', desc: 'Faster analysis of complex data sets.', prefix: '', value: '80', suffix: '%', metricLabel: 'Reduction in Time', icon: Zap },
          { title: 'Insight Accuracy', desc: 'Improvement in prediction and classification.', prefix: '', value: '35', suffix: '%', metricLabel: 'Accuracy Gain', icon: Target },
          { title: 'Operational Cost', desc: 'Reduction in manual data processing.', prefix: '', value: '50', suffix: '%', metricLabel: 'Cost Savings', icon: DollarSign },
          { title: 'System Adaptability', desc: 'Continuous learning from new data inputs.', prefix: '', value: '24', suffix: '/7', metricLabel: 'Continuous Improvement', icon: TrendingUp },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── data-science-ai (Cognition) ──────────────────────────────────────────────
const dataScienceAI = {
  titleLine1: 'Data Science',
  titleHighlight: '& AI.',
  description:
    'Data Science without operational alignment is an experiment. We design and deploy enterprise AI systems — from advanced analytics and machine learning to generative AI and agentic intelligence — engineered for scale, governance, and measurable impact.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  videoBackground: '/videos/software-development-bg.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '15+', label: 'AI Deployments', color: 'text-brand-blue' },
    { value: '97%', label: 'Model Reliability', color: 'text-cyan-400' },
    { value: 'Multi-Cloud', label: 'Infrastructure', color: 'text-brand-blue' },
    { value: 'Enterprise', label: 'Governance', color: 'text-cyan-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Decision Intelligence :: 2026',
      titleLine1: 'Transform',
      titleHighlight: 'Data.',
      titleLine2: 'Power Decisions.',
      description:
        'Data Science without operational alignment is an experiment. We design and deploy enterprise AI systems — from advanced analytics and machine learning to generative AI and agentic intelligence — engineered for scale, governance, and measurable impact.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Fragmented models, ungovernanced ML, and isolated analytics.',
      requirementLabel: 'The Requirement',
      requirementText: 'Governed, MLOps-ready, and AI-native enterprise intelligence.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Intelligence Health',
      statusValue: 'Optimized',
    },
    philosophy: {
      icon: <Brain className="w-7 h-7 text-brand-blue" />,
      title: 'Data',
      titleHighlight: 'Intelligence-First Engineering.',
      description:
        'We believe data should power decisions, not just inform them. Our "Intelligence-First" approach combines AI-native engineering, enterprise data architecture, and responsible AI governance into a single disciplined framework.',
      pills: ['MLOps Ready', 'Responsible AI', 'Gov Embedded', 'LLM Powered'],
    },
    matrix: {
      engineId: 'Engine :: DS_Vision_V6',
      title: 'Enablement Matrix',
      subtext: 'Our comprehensive Data Science & AI lifecycle deconstructed into modular, governed, enterprise-grade intelligence layers.',
      layers: [
        { title: 'Ingest', id: 'DS_ENG', icon: <Database />, desc: 'Modern data platforms, ingestion pipelines, and lakehouse architecture.' },
        { title: 'Model', id: 'DS_ML', icon: <TrendingUp />, desc: 'Machine learning, predictive modeling, and GenAI system design.' },
        { title: 'Operate', id: 'DS_OPS', icon: <Activity />, desc: 'CI/CD for ML, model versioning, drift detection, and retraining.' },
        { title: 'Govern', id: 'DS_GOV', icon: <ShieldCheck />, desc: 'Responsible AI, bias detection, audit trails, and compliance controls.' },
      ],
    },
    schematic: {
      titleLine1: 'Unlock',
      titleHighlight: 'ROI.',
      description: 'Your data should be your greatest driver of competitive intelligence. We build the foundations for exponential AI-led decision-making.',
      stats: [
        { label: 'Accuracy', val: 'ABSOLUTE' },
        { label: 'Latency', val: 'ZERO' },
        { label: 'Scale', val: 'EXPONENTIAL' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Data Engineering & Modern Platforms',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        { heading: 'Real-time & batch pipelines', description: 'Design and deploy scalable data pipelines for both real-time streaming and batch processing workloads.' },
        { heading: 'Data lakehouse & warehouse design', description: 'Build modern lakehouse architectures that unify structured and unstructured data for analytics and ML.' },
        { heading: 'Streaming architectures', description: 'Implement event-driven streaming systems for real-time data processing and instant insights.' },
        { heading: 'Data quality & governance frameworks', description: 'Establish data quality monitoring, lineage tracking, and governance policies across the enterprise.' },
      ],
    },
    {
      title: 'Machine Learning & Predictive Systems',
      bgImage: '/images/capabilities/education.png',
      items: [
        { heading: 'Forecasting & optimization models', description: 'Build predictive models for demand forecasting, resource optimization, and strategic planning.' },
        { heading: 'Classification & anomaly detection', description: 'Develop classifiers and anomaly detectors for fraud prevention, quality control, and risk assessment.' },
        { heading: 'Recommender systems', description: 'Create personalized recommendation engines that drive engagement and conversion.' },
        { heading: 'Advanced statistical modeling', description: 'Apply rigorous statistical methods for hypothesis testing, causal inference, and experimental design.' },
      ],
    },
    {
      title: 'Generative AI & Intelligent Assistants',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'RAG systems & enterprise copilots', description: 'Build retrieval-augmented generation systems that ground AI responses in your enterprise knowledge.' },
        { heading: 'Knowledge retrieval engines', description: 'Deploy intelligent search and retrieval systems that surface relevant information instantly.' },
        { heading: 'Domain-specific GenAI applications', description: 'Create customized generative AI applications tailored to your industry and use cases.' },
        { heading: 'Multi-agent workflows', description: 'Orchestrate multiple AI agents to handle complex, multi-step business processes autonomously.' },
      ],
    },
    {
      title: 'MLOps & Model Lifecycle Management',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'CI/CD for ML', description: 'Implement continuous integration and deployment pipelines specifically designed for machine learning workflows.' },
        { heading: 'Model versioning & rollback', description: 'Manage model versions with full lineage tracking and instant rollback capabilities.' },
        { heading: 'Performance monitoring', description: 'Track model performance metrics in production with automated alerting and reporting.' },
        { heading: 'Drift detection & retraining', description: 'Detect data and concept drift automatically and trigger retraining pipelines to maintain accuracy.' },
      ],
    },
    {
      title: 'AI Governance & Responsible AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Ethical AI policies', description: 'Establish organizational policies and frameworks for ethical AI development and deployment.' },
        { heading: 'Bias detection & mitigation', description: 'Identify and mitigate bias in training data and model predictions to ensure fair outcomes.' },
        { heading: 'Explainability frameworks', description: 'Implement model interpretability tools that make AI decisions transparent and understandable.' },
        { heading: 'Audit trails & compliance controls', description: 'Maintain comprehensive audit logs and compliance controls for regulatory adherence.' },
      ],
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Limitations of"
        subtitle="Siloed Data Science."
        challenges={[
          { problem: 'Models stuck in notebooks.', fix: 'We engineer end-to-end MLOps pipelines that take models from experiment to production reliably.' },
          { problem: 'Stale data, poor decisions.', fix: 'Real-time streaming architectures and lakehouses ensure your models operate on the freshest data.' },
          { problem: 'Unmeasurable ROI.', fix: 'We tie every data science initiative to specific business metrics, proving value before scaling.' },
        ]}
      />
      <AIArchitectureDiagram
        title="The Intelligence Pipeline."
        nodes={[
          { title: 'Data Engineering', description: 'Real-time pipelines, lakehouses, and robust ingestion frameworks.', features: ['Streaming Architecture', 'Data Quality Rules', 'Unified Profiles'], icon: Database },
          { title: 'Advanced Analytics', description: 'Extracting historical patterns and diagnosing performance drivers.', features: ['Statistical Modeling', 'Anomaly Detection', 'Causal Inference'], icon: BarChart3 },
          { title: 'Machine Learning', description: 'Training predictive models to forecast outcomes and optimize decisions.', features: ['Supervised Learning', 'Feature Engineering', 'Optimization Algorithms'], icon: TrendingUp },
          { title: 'MLOps & CI/CD', description: 'Continuous integration, deployment, and monitoring for ML models.', features: ['Model Versioning', 'Drift Detection', 'Automated Retraining'], icon: Cloud },
        ]}
      />
      <UseCasesMagnificationList
        title="Data Science Across Verticals."
        useCases={[
          { industry: 'Retail & Consumer Goods', description: 'Demand forecasting models that ingest weather patterns, social sentiment, and historical sales to optimize inventory distribution.', tags: ['Demand Forecasting', 'Pricing Optimization', 'Churn Prediction'] },
          { industry: 'Banking & Financial Services', description: 'Algorithmic trading models, dynamic credit scoring, and real-time fraud detection systems powered by massive transaction datasets.', tags: ['Fraud Detection', 'Credit Scoring', 'Algorithmic Trading'] },
          { industry: 'Manufacturing', description: 'Predictive maintenance models that analyze sensor telemetry to forecast equipment failure before it disrupts the supply chain.', tags: ['Predictive Maintenance', 'Yield Optimization', 'Supply Chain Analytics'] },
          { industry: 'Healthcare', description: 'Clinical outcome prediction, drug discovery analytics, and patient risk stratification to improve care delivery.', tags: ['Risk Stratification', 'Clinical Analytics', 'Drug Discovery'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="Data Science Delivery Framework."
        phases={[
          { num: '01', title: 'Data Readiness & Feasibility', desc: 'We audit your data infrastructure, assess quality, and define the predictive use cases with the highest ROI.', deliverables: ['Data Quality Audit', 'Use Case Prioritization', 'Architecture Blueprint'] },
          { num: '02', title: 'Model Development & Training', desc: 'Feature engineering, algorithm selection, and model training using historical datasets.', deliverables: ['Feature Store Setup', 'Trained Models', 'Performance Baseline'] },
          { num: '03', title: 'MLOps Pipeline Engineering', desc: 'Building the infrastructure to deploy, scale, and monitor the models in a production environment.', deliverables: ['CI/CD Pipelines', 'Model Registry', 'Deployment APIs'] },
          { num: '04', title: 'Continuous Optimization', desc: 'Monitoring model drift, evaluating business impact, and triggering automated retraining.', deliverables: ['Drift Dashboards', 'Retraining Triggers', 'Value Realization Reports'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Deployment Speed', desc: 'Faster time-to-market for predictive models.', prefix: '', value: '60', suffix: '%', metricLabel: 'Reduction in Time', icon: Zap },
          { title: 'Prediction Accuracy', desc: 'Improvement in forecasting precision.', prefix: '', value: '45', suffix: '%', metricLabel: 'Accuracy Increase', icon: Target },
          { title: 'Infrastructure Efficiency', desc: 'Reduction in cloud compute costs for ML training.', prefix: '', value: '30', suffix: '%', metricLabel: 'Cost Savings', icon: Cloud },
          { title: 'Model Availability', desc: 'Uptime for mission-critical ML APIs.', prefix: '', value: '99.9', suffix: '%', metricLabel: 'Reliability', icon: ShieldCheck },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── genai-business-services (Cognition) ──────────────────────────────────────
const genaiBusinessServices = {
  titleLine1: 'GenAI',
  titleHighlight: 'Services.',
  description:
    'We design and deploy production-grade Generative AI solutions that move beyond pilots — embedding intelligence into workflows, products, and decision systems across the enterprise.',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  videoBackground: '/videos/software-development-bg.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '50%', label: 'Faster Automation', color: 'text-cyan-400' },
    { value: '30-60%', label: 'Cost Optimization', color: 'text-brand-blue' },
    { value: 'Real-time', label: 'Data Access', color: 'text-cyan-400' },
    { value: 'Built-In', label: 'Governance', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Generative AI :: 2026',
      titleLine1: 'Deploy',
      titleHighlight: 'GenAI.',
      titleLine2: 'Drive Enterprise Value.',
      description:
        'Most enterprises struggle to move from AI experimentation to scalable value. We design and deploy production-grade Generative AI solutions — embedding intelligence into workflows, products, and decision systems with governance and control built in from day one.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Fragmented pilots, ungoverned LLMs, and unscaled POCs.',
      requirementLabel: 'The Requirement',
      requirementText: 'Governed, production-ready, and measurable GenAI deployments.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      statusLabel: 'GenAI Health',
      statusValue: 'Production',
    },
    philosophy: {
      icon: <Sparkles className="w-7 h-7 text-brand-blue" />,
      title: 'GenAI',
      titleHighlight: 'Governance-First Deployment.',
      description:
        'We believe GenAI is a business capability, not an IT experiment. Our "Governance-First" approach combines AI-native architecture, enterprise integration, LLMOps, and compliance controls from day one.',
      pills: ['LLMOps Monitored', 'RAG Secured', 'GDPR Ready', 'Agentic Scale'],
    },
    matrix: {
      engineId: 'Engine :: GenAI_Aria_V5',
      title: 'Enablement Matrix',
      subtext: 'Our comprehensive GenAI business services lifecycle deconstructed into modular, governed production layers.',
      layers: [
        { title: 'Assess', id: 'GAI_PLAN', icon: <Search />, desc: 'AI readiness evaluation and high-value use case identification.' },
        { title: 'Pilot', id: 'GAI_POC', icon: <Zap />, desc: 'Production-grade pilot deployment with governance checkpoints.' },
        { title: 'Build', id: 'GAI_BUILD', icon: <Network />, desc: 'Governed AI copilots and agentic workflows with security guardrails.' },
        { title: 'Scale', id: 'GAI_SCALE', icon: <ShieldCheck />, desc: 'Enterprise-wide expansion with LLMOps monitoring and optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Generate',
      titleHighlight: 'ROI.',
      description: 'Your enterprise AI should pay for itself — with precision, velocity, and accountability. We build the foundations for measurable AI-led transformation.',
      stats: [
        { label: 'Automation', val: 'MAXIMUM' },
        { label: 'Governance', val: 'ABSOLUTE' },
        { label: 'ROI', val: 'MEASURABLE' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Agentic AI Systems',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Intelligent digital workers', description: 'Deploy autonomous AI agents that handle complex business processes end-to-end.' },
        { heading: 'Multi-agent workflow automation', description: 'Orchestrate multiple AI agents to collaborate on enterprise-scale tasks.' },
        { heading: 'Enterprise copilots', description: 'Build AI copilots that augment employee productivity across departments.' },
        { heading: 'Autonomous orchestration layers', description: 'Create self-managing AI systems that adapt and optimize in real-time.' },
      ],
    },
    {
      title: 'Information AI',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        { heading: 'Contextual knowledge bots', description: 'AI-powered bots that understand context and deliver precise enterprise knowledge.' },
        { heading: 'Secure RAG implementations', description: 'Retrieval-augmented generation systems with enterprise-grade security controls.' },
        { heading: 'AI-powered document intelligence', description: 'Extract, analyze, and summarize information from complex document repositories.' },
        { heading: 'Compliance-aware summarization', description: 'Generate accurate summaries while respecting regulatory and compliance boundaries.' },
      ],
    },
    {
      title: 'Insights AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Conversational BI', description: 'Natural language interfaces for business intelligence — ask questions, get answers.' },
        { heading: 'Executive AI reporting', description: 'Automated executive summaries and strategic dashboards powered by AI.' },
        { heading: 'Predictive analytics with GenAI overlay', description: 'Combine predictive models with generative AI for richer, contextual insights.' },
        { heading: 'AI-driven strategic dashboards', description: 'Dynamic dashboards that surface trends, anomalies, and recommendations automatically.' },
      ],
    },
    {
      title: 'Content AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Automated content generation workflows', description: 'End-to-end content creation pipelines for marketing, documentation, and communications.' },
        { heading: 'Hyper-personalized marketing content', description: 'Generate tailored content at scale across channels, segments, and personas.' },
        { heading: 'Enterprise-grade translation & localization', description: 'AI-powered multilingual content with cultural context and brand consistency.' },
        { heading: 'AI knowledge publishing', description: 'Automate knowledge base creation, updates, and distribution across the enterprise.' },
      ],
    },
    {
      title: 'Product AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'GenAI feature embedding in digital products', description: 'Integrate generative AI capabilities directly into your software products.' },
        { heading: 'AI copilots for SaaS platforms', description: 'Build intelligent assistants that enhance your SaaS user experience.' },
        { heading: 'AI-enabled UX experiences', description: 'Create adaptive, personalized user experiences powered by generative AI.' },
        { heading: 'Industry-specific AI accelerators', description: 'Pre-built GenAI modules tailored to specific industry verticals and use cases.' },
      ],
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Risk of"
        subtitle="Pilot Purgatory."
        challenges={[
          { problem: 'Hallucinations and inaccurate data.', fix: 'We engineer secure RAG architectures that ground generative models strictly in your enterprise data.' },
          { problem: 'Uncontrolled token costs.', fix: 'We implement LLMOps gateways to monitor usage, cache responses, and route to optimal models.' },
          { problem: 'Data privacy violations.', fix: 'Our deployments include PII masking, RBAC, and secure enterprise environments.' },
        ]}
      />
      <AIArchitectureDiagram
        title="The GenAI Enterprise Stack."
        nodes={[
          { title: 'Application Layer', description: 'Copilots, chat interfaces, and embedded AI features.', features: ['Custom UIs', 'Agentic Workflows', 'API Integrations'], icon: Layers },
          { title: 'Cognitive Engine', description: 'The logic tier orchestrating prompts, memory, and tool usage.', features: ['Prompt Engineering', 'LangGraph / CrewAI', 'Context Management'], icon: Brain },
          { title: 'Data & Knowledge', description: 'Vector databases and search engines grounding the AI in truth.', features: ['Vector Databases', 'Semantic Search', 'Data Pipelines'], icon: Search },
          { title: 'LLMOps & Governance', description: 'Monitoring, routing, and securing all LLM interactions.', features: ['Cost Tracking', 'PII Masking', 'Model Routing'], icon: ShieldCheck },
        ]}
      />
      <UseCasesMagnificationList
        title="GenAI Value Creation."
        useCases={[
          { industry: 'Customer Operations', description: 'Intelligent digital workers that resolve multi-step customer inquiries autonomously while escalating edge cases smoothly.', tags: ['L2 Support', 'Autonomous Resolution', 'Sentiment Analysis'] },
          { industry: 'Software Engineering', description: 'DevOps copilots that assist in code generation, bug triage, legacy refactoring, and automated test writing.', tags: ['Code Generation', 'Automated QA', 'Refactoring'] },
          { industry: 'Knowledge Management', description: 'Enterprise search assistants that instantly synthesize answers from thousands of scattered internal documents.', tags: ['Semantic Search', 'Document Q&A', 'Knowledge Synthesis'] },
          { industry: 'Marketing & Content', description: 'Automated content pipelines that generate hyper-personalized copy at scale while maintaining brand voice.', tags: ['Content Generation', 'Personalization', 'SEO Optimization'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="The Path to Production."
        phases={[
          { num: '01', title: 'Use Case & Security Audit', desc: 'We map high-value workflows, assess your data security posture, and define the technical architecture.', deliverables: ['Use Case Matrix', 'Security Audit', 'Architecture Blueprint'] },
          { num: '02', title: 'RAG & Data Foundation', desc: 'Building the data pipelines, vector databases, and semantic search capabilities needed to ground the AI.', deliverables: ['Vector DB Setup', 'Data Chunking Strategy', 'Search APIs'] },
          { num: '03', title: 'Application Development', desc: 'Engineering the copilots, prompt logic, and integration into your existing systems.', deliverables: ['Copilot UI', 'Prompt Engineering', 'System Integration'] },
          { num: '04', title: 'LLMOps & Go-Live', desc: 'Deploying monitoring tools to track token usage, response quality, and user engagement.', deliverables: ['Usage Dashboards', 'Production Deployment', 'User Training'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Productivity Gains', desc: 'Increase in output for automated knowledge workflows.', prefix: '', value: '40', suffix: '%', metricLabel: 'Efficiency Boost', icon: Zap },
          { title: 'Time to Value', desc: 'Speed from use-case identification to production pilot.', prefix: '', value: '8', suffix: 'Wks', metricLabel: 'Deployment Speed', icon: Activity },
          { title: 'Response Accuracy', desc: 'Accuracy rate for RAG-powered query responses.', prefix: '', value: '95', suffix: '%', metricLabel: 'Accuracy', icon: ShieldCheck },
          { title: 'Operating Cost', desc: 'Reduction in manual processing and support costs.', prefix: '', value: '30', suffix: '%', metricLabel: 'Cost Savings', icon: DollarSign },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── mlops (Cognition) ────────────────────────────────────────────────────────
const mlops = {
  titleLine1: 'Enterprise',
  titleHighlight: 'MLOps.',
  description:
    'Bridge the gap between experimental AI and industrial-scale production. We implement the governance, automation, and infrastructure needed to turn complex models into reliable business assets.',
  image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '60%', label: 'Faster Deployments', color: 'text-cyan-400' },
    { value: '40%', label: 'Reduced Drift', color: 'text-brand-blue' },
    { value: 'Auto', label: 'Retraining', color: 'text-cyan-400' },
    { value: 'Tier 1', label: 'Governance', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Operational Intelligence :: 2026',
      titleLine1: 'Standardize',
      titleHighlight: 'Intelligence.',
      titleLine2: 'Scale Production.',
      description:
        'Most AI initiatives fail at deployment. We engineer industrial-grade MLOps pipelines that bridge the gap between experimental data science and mission-critical software engineering — ensuring your models are reliable, scalable, and governed.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Models stuck in notebooks, manual deployments, and silent performance drift.',
      requirementLabel: 'The Requirement',
      requirementText: 'Automated CI/CD for machine learning, continuous monitoring, and scalable infrastructure.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
      statusLabel: 'Pipeline Status',
      statusValue: 'Automated',
    },
    philosophy: {
      icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
      title: 'MLOps',
      titleHighlight: 'Engineering Discipline.',
      description:
        'We believe machine learning requires software engineering rigor. Our MLOps frameworks apply CI/CD principles, robust monitoring, and automated retraining to ensure models degrade gracefully and improve continuously.',
      pills: ['Zero-Touch CI/CD', 'Drift Monitored', 'Auto-Retraining', 'Policy-as-Code'],
    },
    matrix: {
      engineId: 'Engine :: MLOps_Core_V4',
      title: 'Operations Matrix',
      subtext: 'Our comprehensive MLOps lifecycle deconstructed into automated, scalable production layers.',
      layers: [
        { title: 'Data', id: 'ML_DAT', icon: <Database />, desc: 'Feature stores, data versioning, and validation pipelines.' },
        { title: 'Train', id: 'ML_TRN', icon: <BrainCircuit />, desc: 'Experiment tracking, distributed training, and model registries.' },
        { title: 'Serve', id: 'ML_SRV', icon: <Cloud />, desc: 'High-performance inference, canary deployments, and auto-scaling.' },
        { title: 'Monitor', id: 'ML_MON', icon: <Activity />, desc: 'Data drift detection, performance telemetry, and auto-retraining.' },
      ],
    },
    schematic: {
      titleLine1: 'Automate',
      titleHighlight: 'Excellence.',
      description: 'Your models are only as good as the infrastructure that runs them. We build the pipelines that make intelligence operational.',
      stats: [
        { label: 'Uptime', val: '99.99%' },
        { label: 'Deployment', val: 'AUTOMATED' },
        { label: 'Drift', val: 'CONTROLLED' },
      ],
    },
  },

  capabilitiesTitle: 'Our MLOps Capabilities',
  capabilities: [
    {
      title: 'Data & Feature Engineering',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        { heading: 'Automated ingestion pipelines', description: 'Streamline raw data flow into production-ready analytical datasets.' },
        { heading: 'Feature store architecture', description: 'Centralized repository for discovering, documenting, and serving ML features.' },
        { heading: 'Dataset versioning', description: 'Track data lineage and reproduce experiments with absolute precision.' },
        { heading: 'Data validation & lineage', description: 'Ensure data quality and integrity throughout the entire pipeline.' },
      ],
    },
    {
      title: 'Model Development & Deployment',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Experiment tracking', description: 'Automatically log parameters, metrics, and artifacts for every run.' },
        { heading: 'Canary deployments', description: 'Safely roll out models to a subset of users before full production release.' },
        { heading: 'Model registry', description: 'Central hub for managing model lifecycle from staging to production.' },
        { heading: 'CI/CD integration', description: 'Automated pipelines for testing and deploying ML models at scale.' },
        { heading: 'Containerized deployments', description: 'Ensure consistent runtime environments across development and production.' },
      ],
    },
    {
      title: 'Monitoring, Governance & Optimization',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        { heading: 'Drift detection', description: 'Identify when production data deviates from training sets in real-time.' },
        { heading: 'Performance monitoring', description: 'Track latency, throughput, and system health for deployed models.' },
        { heading: 'Auto-retraining triggers', description: 'Establish closed-loop systems that improve models based on live data.' },
        { heading: 'Audit logs', description: 'Maintain full traceability of every model version and deployment decision.' },
        { heading: 'Compliance guardrails', description: 'Enforce regulatory and ethical standards with policy-as-code gates.' },
      ],
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Friction of"
        subtitle="Manual ML."
        challenges={[
          { problem: 'Silent model degradation.', fix: 'Automated drift detection alerts you instantly when production data diverges from training data.' },
          { problem: 'Weeks to deploy a model.', fix: 'Zero-touch CI/CD pipelines reduce deployment times from months to minutes.' },
          { problem: 'Irreproducible results.', fix: 'Comprehensive experiment tracking and data versioning guarantee absolute reproducibility.' },
        ]}
      />
      <AIArchitectureDiagram
        title="The MLOps Architecture."
        nodes={[
          { title: 'Feature Engineering', description: 'Centralized feature stores ensuring consistency between training and serving.', features: ['Feature Stores', 'Data Versioning', 'Validation Gates'], icon: Database },
          { title: 'Model Training', description: 'Automated hyperparameter tuning and comprehensive experiment tracking.', features: ['Experiment Tracking', 'Distributed Compute', 'Model Registry'], icon: BrainCircuit },
          { title: 'Deployment & Serving', description: 'High-performance inference endpoints with canary and shadow deployments.', features: ['Triton / Seldon', 'A/B Testing', 'Auto-scaling'], icon: Cloud },
          { title: 'Monitoring & Feedback', description: 'Real-time telemetry tracking model health, data drift, and bias metrics.', features: ['Drift Detection', 'Auto-Retraining', 'Alerting'], icon: Activity },
        ]}
      />
      <UseCasesMagnificationList
        title="MLOps in Production."
        useCases={[
          { industry: 'Banking & FinTech', description: 'Maintaining sub-100ms model latency while processing millions of transactions with strict regulatory drift monitoring.', tags: ['Fraud Detection', 'High-Frequency', 'Regulatory Audit'] },
          { industry: 'Retail & E-commerce', description: 'Managing thousands of micro-models for individual store locations with automated retraining based on sales velocity.', tags: ['Micro-models', 'Hyper-personalization', 'Auto-Retraining'] },
          { industry: 'Healthcare', description: 'Secure HIPAA-compliant MLOps pipelines with end-to-end data lineage and rigorous human-in-the-loop validation.', tags: ['Data Lineage', 'HIPAA Compliant', 'HITL Validation'] },
          { industry: 'Manufacturing', description: 'Deploying lightweight predictive maintenance models to edge devices across global factory floors with centralized monitoring.', tags: ['Edge Deployment', 'IoT Analytics', 'Centralized Ops'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="The MLOps Maturity Journey."
        phases={[
          { num: '01', title: 'Assessment & Architecture', desc: 'We evaluate your current ML workflows, identify bottlenecks, and design a scalable cloud-native MLOps architecture.', deliverables: ['Workflow Audit', 'Toolchain Selection', 'Architecture Blueprint'] },
          { num: '02', title: 'Pipeline Engineering', desc: 'Building the CI/CD pipelines, feature stores, and model registries required for automated deployments.', deliverables: ['CI/CD Setup', 'Feature Store', 'Model Registry'] },
          { num: '03', title: 'Monitoring & Observability', desc: 'Deploying the telemetry systems to track data drift, model degradation, and operational metrics in real-time.', deliverables: ['Drift Dashboards', 'Alerting Rules', 'Performance Metrics'] },
          { num: '04', title: 'Closed-Loop Automation', desc: 'Implementing automated retraining triggers and shadow deployments to ensure models improve continuously.', deliverables: ['Auto-Retraining Pipelines', 'A/B Testing Framework', 'Shadow Deployments'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Deployment Speed', desc: 'Reduction in time to move models from dev to prod.', prefix: '', value: '90', suffix: '%', metricLabel: 'Faster Deployments', icon: Zap },
          { title: 'Operational Cost', desc: 'Decrease in manual infrastructure management overhead.', prefix: '', value: '50', suffix: '%', metricLabel: 'Cost Savings', icon: TrendingUp },
          { title: 'Model Reliability', desc: 'Reduction in silent model failures due to data drift.', prefix: '', value: '95', suffix: '%', metricLabel: 'Incident Reduction', icon: ShieldCheck },
          { title: 'Experiment Velocity', desc: 'Increase in the number of ML experiments conducted monthly.', prefix: '', value: '3', suffix: 'x', metricLabel: 'Velocity Boost', icon: Activity },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── ai-governance (Shield-canonical; AI asset-coupled) ───────────────────────
// IMPORTANT: ai-governance is canonically owned by Shield. Its `departmentSlug`
// in servicesData remains 'shield'. The premium content lives in this Cognition
// module because the underlying AICustomSections are shared with the 5 Cognition
// AI services — that is a *technical* coupling, not a taxonomic one. The
// breadcrumb, hero accent, sitemap, and JSON-LD all correctly reflect Shield
// because ServicePageReal looks up `departmentsData[svc.departmentSlug]` and
// passes that canonical dept (Shield) to ServicePageTemplate.
const aiGovernance = {
  titleLine1: 'AI',
  titleHighlight: 'Governance.',
  description:
    'Kangqore enables organizations to adopt, scale, and operationalize AI responsibly by embedding governance, transparency, and control across the entire AI lifecycle.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  videoBackground: '/videos/working-machine-4751312.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '100%', label: 'Governance Coverage', color: 'text-brand-blue' },
    { value: '10+', label: 'Governed AI Models', color: 'text-cyan-400' },
    { value: '10+', label: 'Compliance Frameworks', color: 'text-brand-blue' },
    { value: '24/7', label: 'Policy Enforcement', color: 'text-cyan-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Enterprise Trust :: 2026',
      titleLine1: 'Govern',
      titleHighlight: 'Intelligence.',
      titleLine2: 'Scale Safely.',
      description:
        'As AI systems evolve from static models to autonomous agents, organizations must move beyond ad-hoc controls to governance-by-design. We engineer frameworks that operate continuously alongside intelligent systems — ensuring transparency, accountability, and control without slowing innovation.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Unmanaged AI adoption creating compliance, security, and reputational risks.',
      requirementLabel: 'The Requirement',
      requirementText: 'Embedded, continuous, and automated AI governance frameworks.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Risk Status',
      statusValue: 'Mitigated',
    },
    philosophy: {
      icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
      title: 'Governance',
      titleHighlight: 'by Design.',
      description:
        'If AI can think, act, and remember — it must also be governed. Our philosophy unifies AI-native engineering, enterprise risk management, and systems governance to ensure intelligent systems remain safe, explainable, and aligned with business intent.',
      pills: ['Auditable', 'Explainable', 'Secure', 'Compliant'],
    },
    matrix: {
      engineId: 'Engine :: AI-GOV_V2',
      title: 'Control Matrix',
      subtext: 'Our AI Governance lifecycle deconstructed into modular, enterprise-grade control layers.',
      layers: [
        { title: 'Policy', id: 'GOV_POL', icon: <Search />, desc: 'Ethical guidelines and decision policies.' },
        { title: 'Models', id: 'GOV_MOD', icon: <Layers />, desc: 'Lifecycle governance and behavioral constraints.' },
        { title: 'Data', id: 'GOV_DAT', icon: <Activity />, desc: 'Control over training data, privacy, and consent.' },
        { title: 'Oversight', id: 'GOV_EYE', icon: <ShieldCheck />, desc: 'Human-in-the-loop and escalation controls.' },
      ],
    },
    schematic: {
      titleLine1: 'Secure',
      titleHighlight: 'Trust.',
      description: 'Your AI investments require operational trust. We build the safeguards that make intelligence reliable and compliant.',
      stats: [
        { label: 'Control', val: 'ABSOLUTE' },
        { label: 'Risk', val: 'MITIGATED' },
        { label: 'Trust', val: 'VERIFIED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Managing AI & GenAI Solution Quality',
      bgImage: '/images/capabilities/ai-cognitive.png',
      subtitle: 'Reliable, accurate, and bias-aware intelligence',
      items: [
        { heading: 'Data validation, cleansing, and enrichment pipelines', description: 'Ensure high-quality data inputs for consistent AI performance.' },
        { heading: 'Model testing and quality assurance frameworks', description: 'Rigorous testing protocols to validate AI model accuracy and reliability.' },
        { heading: 'Bias, hallucination, and anomaly detection mechanisms', description: 'Proactive identification and mitigation of AI system risks.' },
        { heading: 'Continuous performance monitoring and drift detection', description: 'Real-time tracking to maintain optimal AI system performance.' },
      ],
      outcome: 'Ensures consistent, high-quality AI outputs across production systems.',
    },
    {
      title: 'Establishing Ethical AI Guidelines',
      bgImage: '/images/capabilities/ai-cognitive.png',
      subtitle: 'Fair, transparent, and accountable decision-making',
      items: [
        { heading: 'Ethical AI principles and governance policy frameworks', description: 'Foundational guidelines for responsible AI development and deployment.' },
        { heading: 'Fairness, accountability, and transparency standards', description: 'Ensure AI systems align with ethical and societal values.' },
        { heading: 'Responsible AI practices for GenAI and agentic systems', description: 'Specialized governance for advanced autonomous AI systems.' },
        { heading: 'Model accountability and explainability controls', description: 'Enable understanding and trust in AI decision-making processes.' },
      ],
      outcome: 'Builds trust by aligning AI behavior with human and enterprise values.',
    },
    {
      title: 'Enabling Model Governance',
      bgImage: '/images/capabilities/ai-cognitive.png',
      subtitle: 'End-to-end control across the AI lifecycle',
      items: [
        { heading: 'Model versioning, documentation, and lineage tracking', description: 'Complete visibility into model history and dependencies.' },
        { heading: 'Approval workflows and controlled model deployments', description: 'Gated processes ensuring only validated models go to production.' },
        { heading: 'Continuous monitoring and performance validation', description: 'Ongoing assessment to maintain model quality and relevance.' },
        { heading: 'Governed updates, rollback, and retirement processes', description: 'Safe model lifecycle management with fallback capabilities.' },
      ],
      outcome: 'Prevents unmanaged model changes and operational risk.',
    },
    {
      title: 'Navigating Compliance & Risk Management',
      bgImage: '/images/capabilities/cybersecurity.png',
      subtitle: 'Regulation-ready, enterprise-safe AI systems',
      items: [
        { heading: 'Compliance with global regulations and industry standards', description: 'Alignment with GDPR, AI Act, and sector-specific requirements.' },
        { heading: 'Data anonymization, encryption, and consent management', description: 'Protect sensitive information across AI workflows.' },
        { heading: 'Audit trails, logging, and policy enforcement mechanisms', description: 'Complete traceability for regulatory and internal audits.' },
        { heading: 'AI risk assessment and mitigation frameworks', description: 'Proactive identification and management of AI-related risks.' },
      ],
      outcome: 'Reduces legal, operational, and reputational exposure.',
    },
  ],

  customSections: (
    <>
      <AILogoTrustSection />
      <AIChallengesSection
        title="The Risks of"
        subtitle="Ungoverned AI."
        challenges={[
          { problem: 'Black-box decision making.', fix: 'We implement Explainable AI (XAI) frameworks so every AI outcome can be traced and understood.' },
          { problem: 'Regulatory non-compliance.', fix: 'Our frameworks ensure alignment with the EU AI Act, GDPR, and industry-specific regulations.' },
          { problem: 'Unintended bias and drift.', fix: 'Automated monitoring systems detect data drift and bias, triggering human review before impact.' },
        ]}
      />
      <AIArchitectureDiagram
        title="The Governance Architecture."
        nodes={[
          { title: 'Policy & Ethics', description: 'Enterprise AI principles, ethical guidelines, and risk classifications.', features: ['Risk Tiering', 'Ethical Guardrails', 'Usage Policies'], icon: Shield },
          { title: 'Model & Agent Control', description: 'Lifecycle governance for AI and agentic systems, including approvals and versioning.', features: ['Model Registries', 'Release Gates', 'Behavior Limits'], icon: Brain },
          { title: 'Data & Privacy', description: 'Control over training data, prompts, and context stores ensuring privacy and consent.', features: ['Data Masking', 'Consent Management', 'Lineage Tracking'], icon: Lock },
          { title: 'Execution Oversight', description: 'Human-in-the-loop checkpoints, override controls, and kill-switches.', features: ['HITL Workflows', 'Audit Logging', 'Anomaly Alerts'], icon: AlertTriangle },
        ]}
      />
      <UseCasesMagnificationList
        title="Governance Across Industries."
        useCases={[
          { industry: 'Financial Services', description: 'Model risk management (MRM), AI-driven credit and fraud governance, regulatory reporting, and explainable decision systems.', tags: ['Model Risk', 'Explainability', 'Regulatory Audit'] },
          { industry: 'Healthcare & Life Sciences', description: 'Clinical AI governance and validation, patient data privacy, explainability for diagnostic systems, and compliance with healthcare regulations.', tags: ['HIPAA / Privacy', 'Clinical Validation', 'Data Consent'] },
          { industry: 'Retail & Consumer Goods', description: 'Governance for personalization engines, bias controls in pricing, secure customer data usage, and demand forecasting oversight.', tags: ['Fair Pricing', 'Bias Control', 'Consumer Privacy'] },
          { industry: 'Technology & SaaS', description: 'AI governance for platforms and copilots, policy enforcement for customer-facing AI, and secure multi-tenant AI systems.', tags: ['Copilot Oversight', 'Multi-tenant Security', 'Policy Enforcement'] },
        ]}
      />
      <AIAcceleratorRoadmap
        title="Implementing Governance."
        phases={[
          { num: '01', title: 'Risk & Maturity Assessment', desc: 'We evaluate your current AI landscape, assess regulatory exposure, and define a target governance operating model.', deliverables: ['Risk Assessment Matrix', 'Maturity Scorecard', 'Governance Roadmap'] },
          { num: '02', title: 'Policy & Framework Design', desc: 'Establishing the ethical guidelines, data privacy rules, and model lifecycle policies tailored to your enterprise.', deliverables: ['AI Usage Policies', 'Ethical Guidelines', 'Data Privacy Frameworks'] },
          { num: '03', title: 'Technical Implementation', desc: 'Deploying the tools for model registries, bias detection, explainability dashboards, and audit logging.', deliverables: ['Model Registry Setup', 'XAI Dashboards', 'Automated Audit Trails'] },
          { num: '04', title: 'Continuous Monitoring', desc: 'Operationalizing governance with human-in-the-loop workflows, drift detection, and automated compliance reporting.', deliverables: ['HITL Workflows', 'Drift Alerts', 'Compliance Reports'] },
        ]}
      />
      <AIMetricsSection
        metrics={[
          { title: 'Compliance Coverage', desc: 'AI systems operating within regulatory bounds.', prefix: '', value: '100', suffix: '%', metricLabel: 'Audit Readiness', icon: ShieldCheck },
          { title: 'Risk Mitigation', desc: 'Reduction in critical AI system failures.', prefix: '', value: '95', suffix: '%', metricLabel: 'Fewer Incidents', icon: AlertTriangle },
          { title: 'Time to Market', desc: 'Faster deployment of compliant AI models.', prefix: '', value: '40', suffix: '%', metricLabel: 'Speed Increase', icon: Activity },
          { title: 'Decision Traceability', desc: 'Ability to explain AI-driven outcomes.', prefix: '', value: '100', suffix: '%', metricLabel: 'Explainability', icon: Search },
        ]}
      />
      <AITransformationMagnet />
    </>
  ),
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 6 services wired in G2:
//   - 5 Cognition AI services (departmentSlug: 'cognition')
//   - 1 Shield service co-located here due to shared AI asset coupling
//     (ai-governance — departmentSlug: 'shield')
// Future phases (G4 Growth, G5 Platforms, G6 Foundry) add their own modules.
export const COGNITION_SECTIONS = {
  'agentic-ai': agenticAI,
  'ai-cognitive-computing': aiCognitiveComputing,
  'data-science-ai': dataScienceAI,
  'genai-business-services': genaiBusinessServices,
  'mlops': mlops,
  'ai-governance': aiGovernance,
};
