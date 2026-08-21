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
import { Link } from 'react-router-dom';
import {
  Brain, BrainCircuit, Zap, ShieldCheck, Shield, Search, Network, Target,
  DollarSign, TrendingUp, Layers, Activity, Database, BarChart3, Cloud,
  Cpu, Sparkles, RefreshCw, Lock, AlertTriangle,
  LineChart, ArrowRight, ChevronRight,
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
import { COGNITION_AUTOMATION_SECTIONS } from './automation-services';
import PremiumAnimatedSections from '../shared/PremiumSectionKit';
import { analyticsPremiumData } from '../shared/l2PremiumData';

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
    { value: 'Zero', label: 'Human Overhead', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '100%', label: 'Governance Audit', color: 'text-brand-blue' },
    { value: 'Real-time', label: 'Adaptive Reasoning', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
    { value: '97%', label: 'Model Reliability', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Multi-Cloud', label: 'Infrastructure', color: 'text-brand-blue' },
    { value: 'Enterprise', label: 'Governance', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
      title: 'Data Engineering & Modern Data Platforms',
      desc: 'Design scalable, secure, and modern data ecosystems that enable trusted analytics, artificial intelligence, and enterprise decision-making.',
      bgImage: '/images/capabilities/agentic-governed-autonomy.png',
      items: [
        { heading: 'Real-Time & Batch Data Engineering', description: 'Build high-performance data pipelines that process streaming and batch workloads to support operational intelligence and analytics at scale.' },
        { heading: 'Data Lakehouse & Warehouse Architecture', description: 'Design modern lakehouse and warehouse platforms that unify structured, semi-structured, and unstructured enterprise data.' },
        { heading: 'Event Streaming & Data Integration', description: 'Implement event-driven architectures that enable continuous data ingestion, real-time processing, and enterprise-wide data integration.' },
        { heading: 'Data Quality Engineering', description: 'Establish automated data validation, profiling, cleansing, monitoring, and quality controls to ensure trusted enterprise data.' },
        { heading: 'Data Governance & Lineage', description: 'Implement enterprise governance frameworks that provide data cataloguing, lineage tracking, metadata management, and policy enforcement.' },
        { heading: 'Enterprise Data Architecture', description: 'Develop scalable, cloud-native data architectures that support analytics, AI workloads, and long-term digital transformation initiatives.' },
      ],
    },
    {
      title: 'Machine Learning & Predictive Intelligence',
      desc: 'Develop intelligent machine learning solutions that enable prediction, optimization, automation, and data-driven business decision-making.',
      bgImage: '/images/capabilities/agentic-governed-autonomy.png',
      items: [
        { heading: 'Predictive Modeling & Forecasting', description: 'Develop advanced forecasting models for demand planning, financial forecasting, operational optimization, and strategic decision support.' },
        { heading: 'Classification & Anomaly Detection', description: 'Build intelligent classification and anomaly detection systems that identify fraud, operational risks, quality issues, and unusual behavior.' },
        { heading: 'Recommendation Intelligence', description: 'Create AI-powered recommendation systems that deliver personalised customer experiences and improve engagement, retention, and revenue.' },
        { heading: 'Statistical & Quantitative Modeling', description: 'Apply advanced statistical methods, experimentation, and causal analysis to generate reliable business insights.' },
        { heading: 'Feature Engineering & Model Development', description: 'Design high-quality data features and optimize machine learning models for improved predictive performance and scalability.' },
        { heading: 'Decision Intelligence', description: 'Combine machine learning, analytics, and business rules to support intelligent, explainable, and data-driven decision-making.' },
      ],
    },
    {
      title: 'Generative AI & Intelligent Systems',
      desc: 'Design enterprise-grade Generative AI solutions that enhance productivity, automate knowledge work, and enable intelligent business operations.',
      bgImage: '/images/capabilities/agentic-governed-autonomy.png',
      items: [
        { heading: 'Enterprise Copilots & AI Assistants', description: 'Develop secure AI assistants that augment employees with contextual knowledge, automation, and intelligent decision support.' },
        { heading: 'Retrieval-Augmented Generation (RAG)', description: 'Build enterprise RAG architectures that combine foundation models with trusted organizational knowledge for accurate and grounded AI responses.' },
        { heading: 'Enterprise Knowledge Intelligence', description: 'Develop intelligent search, semantic retrieval, and knowledge management platforms that unlock enterprise information.' },
        { heading: 'Domain-Specific Generative AI', description: 'Create industry-specific Generative AI applications tailored to unique business processes, regulations, and operational requirements.' },
        { heading: 'Multi-Agent AI Systems', description: 'Develop collaborative AI agent ecosystems capable of coordinating complex workflows, autonomous task execution, and enterprise orchestration.' },
        { heading: 'AI Workflow Automation', description: 'Integrate Generative AI into enterprise workflows to automate repetitive processes, improve productivity, and accelerate business operations.' },
      ],
    },
    {
      title: 'MLOps & AI Lifecycle Engineering',
      desc: 'Establish enterprise engineering practices that enable reliable, scalable, and governed deployment, operation, and continuous improvement of AI systems.',
      bgImage: '/images/capabilities/agentic-governed-autonomy.png',
      items: [
        { heading: 'AI Deployment Pipelines', description: 'Implement automated CI/CD pipelines that streamline the development, testing, deployment, and delivery of AI solutions.' },
        { heading: 'Model Lifecycle Management', description: 'Manage AI models across development, validation, deployment, monitoring, retraining, and retirement using governed lifecycle processes.' },
        { heading: 'Model Versioning & Registry', description: 'Maintain centralized model repositories with complete version history, documentation, metadata, and reproducibility.' },
        { heading: 'AI Performance Monitoring', description: 'Continuously monitor production models for accuracy, latency, throughput, reliability, and operational performance.' },
        { heading: 'Drift Detection & Continuous Learning', description: 'Automatically detect data and concept drift while enabling continuous retraining and model optimization.' },
        { heading: 'AI Observability', description: 'Provide end-to-end visibility into model behavior, inference quality, resource utilization, operational health, and production AI systems.' },
      ],
    },
    {
      title: 'AI Governance & Responsible AI',
      desc: 'Ensure enterprise AI systems operate responsibly, securely, transparently, and in compliance with organizational policies and regulatory requirements.',
      bgImage: '/images/capabilities/agentic-governed-autonomy.png',
      items: [
        { heading: 'Responsible AI Frameworks', description: 'Establish governance principles and organizational frameworks that guide the responsible design, deployment, and operation of AI systems.' },
        { heading: 'Fairness & Bias Management', description: 'Identify, measure, and mitigate bias across datasets, models, and AI-driven decision processes to promote equitable outcomes.' },
        { heading: 'Explainable AI', description: 'Implement interpretable AI techniques that provide transparent reasoning, confidence scores, and understandable decision explanations.' },
        { heading: 'AI Risk & Compliance', description: 'Manage AI-related operational, regulatory, ethical, and business risks while ensuring compliance with enterprise governance standards.' },
        { heading: 'Audit & Governance Controls', description: 'Maintain comprehensive audit trails, governance policies, approval workflows, and operational controls for enterprise AI systems.' },
        { heading: 'Privacy & Data Protection', description: 'Protect sensitive enterprise information through privacy-preserving AI practices, data governance, encryption, and regulatory compliance.' },
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
    { value: '50%', label: 'Faster Automation', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '30-60%', label: 'Cost Optimization', color: 'text-brand-blue' },
    { value: 'Real-time', label: 'Data Access', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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

  capabilities: [
    {
      title: 'AI Strategy & MLOps Advisory',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Establish enterprise AI operating models, implementation roadmaps, and organizational readiness that accelerate successful AI adoption and long-term business value.',
      items: [
        'AI & MLOps Readiness Assessment: Evaluate organizational maturity, engineering capabilities, operational readiness, and platform foundations for enterprise-scale AI adoption.',
        'AI Use Case Discovery: Identify, prioritize, and validate high-value AI initiatives aligned with strategic business objectives and measurable outcomes.',
        'Data Readiness Assessment: Assess data quality, accessibility, governance, and architectural readiness required for successful machine learning initiatives.',
        'MLOps Strategy & Roadmap: Develop enterprise MLOps operating models, implementation roadmaps, governance structures, and technology strategies.',
        'AI Platform Advisory: Recommend cloud, hybrid, infrastructure, tooling, and platform architectures that support scalable enterprise AI operations.',
        'AI Transformation Enablement: Drive organizational adoption through governance frameworks, stakeholder alignment, operating models, and capability development.',
      ],
    },
    {
      title: 'AI Engineering & Lifecycle Management',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Accelerate AI development through governed engineering practices that enable reliable, repeatable, and production-ready machine learning delivery.',
      items: [
        'Experiment Management: Capture datasets, parameters, metrics, artifacts, and experiments to ensure reproducibility, collaboration, and continuous innovation.',
        'Model Development & Validation: Design, train, evaluate, validate, and optimize machine learning models for enterprise-grade production environments.',
        'Model Registry & Lifecycle Management: Maintain centralized repositories for managing model versions, approvals, documentation, metadata, and deployment status.',
        'Continuous Integration & Delivery: Automate testing, validation, packaging, and deployment of machine learning models through enterprise CI/CD pipelines.',
        'Progressive Model Deployment: Deploy AI models safely using canary, blue-green, shadow, and phased rollout strategies that reduce operational risk.',
        'AI Lifecycle Automation: Automate promotion, deployment, monitoring, retraining, rollback, and retirement across the complete AI lifecycle.',
      ],
    },
    {
      title: 'Data & Feature Engineering',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Build trusted, governed, and scalable data foundations that power enterprise AI, machine learning, and intelligent automation.',
      items: [
        'Data Pipeline Engineering: Develop automated ingestion, transformation, orchestration, and processing pipelines that support enterprise AI workloads.',
        'Feature Store Management: Establish centralized feature repositories that improve feature reuse, governance, consistency, and real-time serving.',
        'Dataset Versioning & Lineage: Maintain complete dataset history, lineage, reproducibility, and traceability throughout model development and operations.',
        'Data Validation & Quality Engineering: Implement automated validation, profiling, cleansing, monitoring, and quality controls for trusted enterprise data.',
        'Metadata & Lineage Management: Capture metadata, dependencies, and lineage across datasets, pipelines, models, and AI assets.',
        'Enterprise Data Orchestration: Coordinate distributed data workflows across cloud, hybrid, and enterprise environments with operational reliability.',
      ],
    },
    {
      title: 'Production AI Operations',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Operate enterprise AI systems with continuous monitoring, intelligent optimization, and resilient production infrastructure.',
      items: [
        'AI Observability: Gain end-to-end visibility into model behavior, inference quality, latency, resource utilization, and operational health.',
        'Performance Monitoring: Monitor prediction quality, throughput, availability, latency, and service-level objectives across production environments.',
        'Drift Detection & Continuous Learning: Detect data drift, concept drift, prediction anomalies, and model degradation while triggering governed retraining workflows.',
        'AI Performance Optimization: Continuously improve model accuracy, inference efficiency, infrastructure utilization, and operational cost.',
        'Production Reliability Engineering: Maintain resilient, fault-tolerant, and highly available AI systems through proactive operational management.',
        'Operational Intelligence & Reporting: Provide dashboards, SLA reporting, operational analytics, executive insights, and AI health metrics.',
      ],
    },
    {
      title: 'AI Platform Engineering',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Design secure, cloud-native AI platforms that standardize enterprise AI development, deployment, orchestration, and operations.',
      items: [
        'AI Platform Architecture: Design scalable AI platforms that standardize enterprise machine learning engineering and operational practices.',
        'Containerisation & Orchestration: Deploy AI workloads using containers, Kubernetes, and enterprise orchestration frameworks.',
        'Hybrid & Multi-Cloud AI: Operate AI workloads consistently across public cloud, private cloud, hybrid, and on-premises environments.',
        'Infrastructure Automation: Automate provisioning, configuration, scaling, and lifecycle management using Infrastructure as Code.',
        'GPU & Accelerator Engineering: Optimize GPU, TPU, and specialized AI accelerator infrastructure for efficient training and inference workloads.',
        'Scalability & Resilience Engineering: Deliver highly available, fault-tolerant, and elastic AI platforms that support enterprise-scale operations.',
      ],
    },
    {
      title: 'AI Governance & Operational Assurance',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Ensure enterprise AI systems remain secure, explainable, compliant, and fully governed throughout their operational lifecycle.',
      items: [
        'Model Governance: Govern AI models across development, validation, deployment, monitoring, maintenance, and retirement.',
        'Responsible AI Controls: Embed explainability, fairness, transparency, accountability, and human oversight into operational AI systems.',
        'Audit & Traceability: Maintain comprehensive audit trails, deployment history, lineage, approvals, and governance evidence.',
        'Compliance & Policy Management: Align AI operations with regulatory requirements, enterprise governance policies, and industry standards.',
        'Security & Access Governance: Protect AI platforms through identity management, role-based access controls, encryption, and zero-trust security.',
        'AI Risk Management: Continuously identify, assess, and mitigate operational, cybersecurity, regulatory, and business risks across AI environments.',
      ],
    },
    {
      title: 'AI Performance, Cost & FinOps',
      image: '/images/capabilities/agentic-governed-autonomy.png',
      desc: 'Maximize the business value of enterprise AI through continuous optimization of performance, infrastructure utilization, operational efficiency, and technology investment.',
      items: [
        'AI Cost Optimization: Optimize compute resources, inference workloads, storage, and token consumption to improve cost efficiency.',
        'AI Resource Management: Monitor and optimize GPU, CPU, memory, and accelerator utilization across enterprise AI workloads.',
        'Workload Optimization: Balance training and inference workloads to maximize throughput, reliability, and operational efficiency.',
        'Capacity Planning: Forecast infrastructure demand and plan scalable AI environments that support future business growth.',
        'AI FinOps & Cost Governance: Establish governance frameworks for budgeting, cost allocation, chargeback models, and AI investment optimization.',
        'Business Value Measurement: Measure AI adoption, operational impact, ROI, and business outcomes through enterprise performance metrics and executive reporting.',
      ],
    },
  ],

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '60%', label: 'Faster Deployments', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '40%', label: 'Reduced Drift', color: 'text-brand-blue' },
    { value: 'Auto', label: 'Retraining', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
    { value: '10+', label: 'Governed AI Models', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '10+', label: 'Compliance Frameworks', color: 'text-brand-blue' },
    { value: '24/7', label: 'Policy Enforcement', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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

// ─── analytics (Cognition, T3 — added in PR 2) ─────────────────────────────────
const analytics = {
  postCapabilitiesSections: <PremiumAnimatedSections data={analyticsPremiumData} />,
  description:
    'Transform raw data into actionable intelligence through modern analytics architectures, predictive modeling, and AI-powered insights — engineered for scale, governance, and business impact.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Engineering Decision Systems for the Modern Enterprise</h2>
      <p>Transform raw data into actionable intelligence through modern analytics architectures, predictive modeling, and AI-powered insights — engineered for scale, governance, and business impact.</p>
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
        <p className="font-bold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-1">We don&rsquo;t just build dashboards.</p>
        <p className="font-medium text-white italic">We build decision systems.</p>
      </div>
    </div>
  ),

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: '5X', label: 'Faster Insights', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: '10X', label: 'Model Performance', color: 'text-blue-400' },
    { value: '30%', label: 'Cost Savings', color: 'text-emerald-400' },
    { value: 'Governed', label: 'Decision Systems', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Strategic Intelligence :: 2026',
      titleLine1: 'Analytics',
      titleHighlight: 'Precision',
      titleLine2: 'for Decisions.',
      description:
        'Data without context is noise. We engineer decision systems that bridge the gap between fragmented raw data and executive-ready intelligence.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Incoherent data lakes & siloed analytics reports.',
      requirementLabel: 'The Requirement',
      requirementText: 'Observable, governed, and AI-native decision pipelines.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Decision Velocity',
      statusValue: 'Optimized',
    },
    philosophy: {
      icon: <LineChart className="w-7 h-7 text-brand-blue" />,
      title: 'Analytics',
      titleHighlight: 'Logic-First Intelligence.',
      description:
        'We move beyond standard reporting into cognitive intelligence — architecting systems that prioritize relevance, provenance, and actionable outcomes.',
      pills: ['Predictive ROI', 'Hardened Governance', 'MLOps Ready', 'Zero Insight Debt'],
    },
    matrix: {
      engineId: 'Engine :: Insights_V4',
      title: 'Enablement Matrix',
      subtext: 'Our end-to-end analytics engineering deconstructed into modular, governed intelligence layers.',
      layers: [
        { title: 'Ingestion', id: 'AN_AQ', icon: <Database />, desc: 'Multi-modal data capture and multi-source integration.' },
        { title: 'Unification', id: 'AN_UNI', icon: <Layers />, desc: 'Semantic modeling and distributed data lakehouse unification.' },
        { title: 'Intelligence', id: 'AN_IQ', icon: <BrainCircuit />, desc: 'Predictive modeling and cognitive intelligence modules.' },
        { title: 'Delivery', id: 'AN_DLV', icon: <Activity />, desc: 'Executive KPI command centers and real-time triggers.' },
      ],
    },
    schematic: {
      titleLine1: 'Transform',
      titleHighlight: 'Information.',
      description:
        'Your data should stay as a strategic asset, not a technical burden. We build the foundations for undisputed competitive advantage.',
      stats: [
        { label: 'Accuracy', val: 'ABSOLUTE' },
        { label: 'Latency', val: 'ZERO' },
        { label: 'Velocity', val: 'EXPONENTIAL' },
      ],
    },
  },

  technologies: [
    { category: 'Data Platforms & Lakehouse', items: ['Snowflake', 'Databricks', 'BigQuery', 'Redshift', 'Azure Synapse'] },
    { category: 'ETL / ELT & Orchestration', items: ['Airflow', 'dbt', 'Fivetran', 'Azure Data Factory', 'Talend'] },
    { category: 'Real-Time & Streaming', items: ['Kafka', 'Kinesis', 'Spark Streaming', 'Flink', 'Pub/Sub'] },
    { category: 'BI & Visualization', items: ['Power BI', 'Tableau', 'Looker', 'Superset', 'Metabase'] },
    { category: 'ML & Predictive Analytics', items: ['Scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'Prophet'] },
    { category: 'Governance & Observability', items: ['Great Expectations', 'Collibra', 'Monte Carlo', 'Purview', 'OpenLineage'] },
  ],

  capabilities: [
    {
      title: 'Descriptive & Diagnostic',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { heading: 'Descriptive Analytics', description: 'Understand what happened. Exploratory data analysis, KPI tracking, and executive reporting to provide visibility.' },
        { heading: 'Diagnostic Analytics', description: 'Understand why it happened. Root cause analysis, variance tracking, and segmentation to enable corrective actions.' },
      ],
    },
    {
      title: 'Predictive & Prescriptive',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { heading: 'Predictive Analytics', description: 'Understand what is likely to happen. Time-series forecasting and ML models for proactive business strategy.' },
        { heading: 'Prescriptive Solutions', description: 'Understand what action to take. Optimization modeling and decision engines to move from insight to execution.' },
      ],
    },
    {
      title: 'Cognitive Intelligence',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { heading: 'Cognitive Analytics', description: 'AI-augmented systems using NLP, Graph analytics, and pattern detection to embed AI into analytics workflows.' },
      ],
    },
  ],

  customFAQs: [
    { question: 'What is Analytics?', answer: 'Analytics is the process of transforming data into insights through statistical analysis, modeling, and visualization to support better decision-making.' },
    { question: 'What are the types of analytics?', answer: 'We specialize in Descriptive (what happened), Diagnostic (why it happened), Predictive (likelihood), Prescriptive (actions to take), and Cognitive (AI-augmented intelligence).' },
    { question: 'What is Cognitive Analytics?', answer: 'AI-augmented analytics using NLP, ML, graph systems, and semantic intelligence to extract deeper contextual meaning from data.' },
    { question: 'How does Kangqore ensure data quality?', answer: 'Through data validation pipelines, governance frameworks, lineage tracking, and continuous monitoring systems.' },
    { question: 'Do you support real-time analytics?', answer: 'Yes. We design streaming architectures using event-driven pipelines (Kafka/Kinesis) and real-time dashboards.' },
  ],

  trustPillars: [
    { title: 'Executive KPI Command Center', tag: 'Decision Velocity', description: 'Real-time C-level dashboards and business health metrics with drill-down intelligence for strategic oversight.' },
    { title: 'Customer 360 & Segmentation', tag: 'Growth Intelligence', description: 'Unified customer profiles and cohort analysis paired with CLV and churn prediction for personalized marketing.' },
    { title: 'Demand Forecasting', tag: 'Predictive Analytics', description: 'Time-series modeling and inventory optimization using scenario simulations for resilient supply chains.' },
    { title: 'Operational Efficiency Analytics', tag: 'Operational Excellence', description: 'SLA tracking and bottleneck identification to eliminate cost leakage and improve process throughput.' },
    { title: 'Fraud & Risk Analytics', tag: 'Risk Intelligence', description: 'Anomaly detection and risk scoring engines providing real-time alerts for enterprise security.' },
    { title: 'Marketing Attribution & ROI', tag: 'Revenue Analytics', description: 'Multi-touch attribution and campaign performance tracking to optimize CAC and maximize ROAS.' },
    { title: 'Real-Time Streaming Analytics', tag: 'Real-Time Systems', description: 'Event streaming dashboards and live triggers for high-frequency operational intelligence.' },
    { title: 'Cognitive Analytics Modules', tag: 'AI-Augmented Analytics', description: 'Document intelligence and sentiment analysis using knowledge graphs for deeper contextual insights.' },
  ],

  trustPillarsRightTitle: 'Analytics Systems Built for Speed, Accuracy & Governance',
  trustPillarsRightDescription:
    'Kangqore builds modern analytics ecosystems that turn fragmented data into trusted insights. From data ingestion to BI to predictive modeling, we architect scalable pipelines, semantic layers, and governance controls — so leaders get faster decisions without compromising accuracy, privacy, or compliance.',
  trustPillarsRightButton: 'Get an Analytics Assessment',

  whyKangqoreIntro:
    'Kangqore is an AI-driven digital engineering company building the next generation of intelligent, autonomous, and scalable enterprise systems. We move analytics from reporting → prediction → intelligent automation.',
  whyKangqore: [
    { title: 'Engineering-first design', description: 'Analytics architected for technical precision and performance.' },
    { title: 'Governance by default', description: 'Security, compliance, and lineage are embedded at the core.' },
    { title: 'AI-ready architecture', description: 'Built to seamlessly integrate with ML models and cognitive agents.' },
    { title: 'Industry-aligned frameworks', description: 'Tailored solutions that speak the language of your specific sector.' },
    { title: 'Business-outcome focus', description: 'We measure success by the impact on your bottom line.' },
    { title: 'Scalable & secure', description: 'Enterprise-grade implementations designed to grow with your data.' },
  ],

  industryIntro: 'We design industry-specific analytics solutions that address real-world business challenges:',
  industries: [
    { name: 'BFSI', description: 'Risk scoring, fraud analytics, credit modeling.' },
    { name: 'Retail & E-commerce', description: 'Demand forecasting, customer segmentation, pricing optimization.' },
    { name: 'Manufacturing', description: 'Predictive maintenance, OEE monitoring, quality analytics.' },
    { name: 'Healthcare', description: 'Clinical analytics, patient risk modeling, outcome forecasting.' },
    { name: 'Public Sector', description: 'Data modernization, citizen service intelligence, performance monitoring.' },
  ],

  ctaTitle: 'Build a Scalable Analytics Foundation',
  ctaSubtitle: 'Turn your data into a strategic advantage.',
  ctaButtonText: 'Request a Consultation',
};

// ─── big-data (Cognition, T3 — added in PR 2) ──────────────────────────────────
const bigData = {
  description:
    'Design, modernize, and operationalize enterprise-grade data ecosystems that enable real-time intelligence, advanced analytics, and AI-driven growth.',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Build Scalable Data Foundations That Power Intelligent Enterprises</h2>
      <p>Design, modernize, and operationalize enterprise-grade data ecosystems that enable real-time intelligence, advanced analytics, and AI-driven growth.</p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  imageClassName: 'aspect-[4/5]',
  fullWidthCustomOverview: true,

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: 'PB+', label: 'Data Managed', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    { value: 'Real-time', label: 'Processing', color: 'text-blue-400' },
    { value: 'Zero', label: 'Migration Errors', color: 'text-emerald-400' },
    { value: '99.9%', label: 'Uptime', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Market Disruption :: 2026',
      titleLine1: 'The Data',
      titleHighlight: 'Explosion',
      titleLine2: 'is Real.',
      description:
        'Modern enterprises are generating unimaginable volumes of data. Most are not just unready — they are operationally paralyzed by the sheer scale of fragmented information.',
      bottleneckLabel: 'The Bottleneck',
      bottleneckText: 'Incoherent cloud platforms & fragmented legacy systems.',
      requirementLabel: 'The Consequence',
      requirementText: 'Reactive scaling & skyrocketing architectural debt.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      statusLabel: 'Latency Check',
      statusValue: '4ms_Target',
    },
    philosophy: {
      icon: <Database className="w-7 h-7 text-brand-blue" />,
      title: 'Big Data',
      titleHighlight: 'Logic-First.',
      description:
        'We architect ecosystems that prioritize relevance and governance over simple collection — turning reactive datasets into proactive strategic assets.',
      pills: ['Enterprise ROI', 'Hardened Security', 'Reactive Autonomy', 'Zero Data Debt'],
    },
    matrix: {
      engineId: 'Engine :: Kang_V4',
      title: 'Enablement Matrix',
      subtext: 'Comprehensive deconstruction of the enterprise data lifecycle into modular, governed intelligence layers.',
      layers: [
        { title: 'Acquisition', id: 'AQ_STRAT', icon: <RefreshCw />, desc: 'Intelligent multi-modal data capture pipelines.' },
        { title: 'Unification', id: 'UN_CORE', icon: <Layers />, desc: 'Semantic deconstruction of distributed silos.' },
        { title: 'Processing', id: 'PR_ENGINE', icon: <Cpu />, desc: 'AI-native streaming and transformation modules.' },
        { title: 'Assurance', id: 'AS_HARD', icon: <ShieldCheck />, desc: 'End-to-end provenance and governance fabric.' },
      ],
    },
    schematic: {
      titleLine1: 'Accelerate',
      titleHighlight: 'Everything.',
      description:
        'Your data should not overwhelm your systems. It should be the fuel for undisputed competitive advantage.',
      stats: [
        { label: 'Latency', val: 'ZERO' },
        { label: 'ROI', val: 'EXPONENTIAL' },
        { label: 'Security', val: 'ABSOLUTE' },
      ],
    },
  },

  technologies: [
    { category: 'Data Processing', items: ['Apache Hadoop', 'Apache Spark', 'Kafka', 'Flink', 'Presto', 'Hive'] },
    { category: 'Databases', items: ['MongoDB', 'PostgreSQL', 'Snowflake', 'BigQuery', 'Cassandra', 'Redis'] },
    { category: 'Cloud Platforms', items: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'IBM Cloud'] },
    { category: 'Orchestration & Governance', items: ['Airflow', 'dbt', 'Data Catalog Tools', 'Data Governance Frameworks', 'Purview'] },
  ],

  capabilities: [
    {
      title: 'EDW Optimization',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Equip your Enterprise Data Warehouse to tackle the growing demands of big data. Build a central data repository that unifies heterogeneous sources, maintains data quality, and gives you access to the information you need – when you need it.',
      items: ['Modernization of legacy warehouses', 'ELT / Offload Architecture', 'Data Archiving Solutions', 'Datastore, Governance & Security Management', 'Self Service BI / Discovery Enablement'],
    },
    {
      title: 'Lakehouse Architecture',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Define, design, and develop the capabilities of dealing with data of any size, shape, and speed. Empower your developers, data scientists and analysts with the right tools to leverage quintillions of bytes of data.',
      items: ['Strategy & Roadmap Development', 'Prototyping & Tool Evaluation', 'Data Integration, Access & Services', 'Scalable Storage & Processing Architecture', 'Construction & Go-Live Enablement'],
    },
    {
      title: 'Stream & Real-Time',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Redefine real-time processing. Garner insights from data streams generating from disparate sources as and when the event occurs.',
      items: ['Real-time Data Ingestion', 'Scalable Data Processing & Storage', 'Event-driven Architecture & Flow', 'Dashboards, Alerting & Monitoring Systems'],
    },
    {
      title: 'Migration & Integration',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Platform consolidation and large-scale data absorption across multi-source environments. We ensure seamless transitions and data integrity during complex enterprise transformation initiatives.',
      items: ['Large-scale data absorption & ingestion', 'Platform consolidation & unification', 'Multi-source integration frameworks', 'Structured & unstructured data handling'],
    },
    {
      title: 'Hadoop-Based Platforms',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Leverage the power of distributed processing for cost-effective enterprise storage and high-concurrency analysis. We modernize Hadoop ecosystems for active archiving and scalable compute.',
      items: ['Hadoop as Enterprise Data Warehouse', 'Hadoop as Active Archive Solution', 'Large-scale concurrent processing', 'Cost-effective long-term storage & retrieval'],
    },
    {
      title: 'RDBMS to NoSQL (R2M)',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Automated conversion of legacy relational data into modern document-based schemas for high performance. Reduce manual migration errors and optimize for cloud-native speed.',
      items: ['Automated schema conversion & mapping', 'Replication & integrity validation', 'Performance optimization for NoSQL', 'Reduced manual migration overhead'],
    },
    {
      title: 'Managed Data Services',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Reliable 24/7 managed support for data platforms, ensuring continuous uptime, performance tuning, and ongoing governance for your intelligence ecosystem.',
      items: ['Platform monitoring & health checks', 'Continuous performance optimization', 'Ongoing governance & compliance', 'Managed analytics operations'],
    },
  ],

  trustPillars: [
    { title: 'Data Migration & Integration Services', tag: 'Absorption', description: 'Unified pipelines to absorb massive datasets from silos into a cohesive, governed data ecosystem.' },
    { title: 'Managed Big Data Services', tag: 'Operations', description: 'Reliable 24/7 managed support for data platforms, ensuring continuous uptime and performance tuning.' },
    { title: 'Data Analysis Platform', tag: 'Intelligence', description: 'Self-service analytics hubs that allow business users to discover insights without technical overhead.' },
    { title: 'Hadoop Data Warehouse', tag: 'Scalability', description: 'High-concurrency data warehousing solutions built on distributed processing frameworks for enterprise scale.' },
    { title: 'Hadoop Active Archive', tag: 'Cost Optimization', description: 'Move cold data to cost-effective storage while keeping it queryable and accessible for historical analysis.' },
    { title: 'RDBMS to NoSQL Migration', tag: 'Modernization', description: 'Automated conversion of legacy relational data into modern document-based schemas for high performance.' },
  ],

  trustPillarsRightTitle: 'End-to-End Data Transformation Solutions',
  trustPillarsRightDescription:
    'We design scalable, secure, and agile data ecosystems that accelerate innovation, improve operational efficiency, and enable smooth customer experiences tailored to your digital transformation journey.',
  trustPillarsRightButton: 'Request a Consultation',

  whyKangqoreIntro:
    'We don&rsquo;t just implement tools. We build future-ready data platforms that solve architectural complexity and drive measurable growth.',
  whyKangqore: [
    { title: 'AI-native architecture', description: 'Data platforms built with embedded intelligence for next-gen AI applications.' },
    { title: 'Enterprise-grade governance', description: 'End-to-end security and compliance integrated directly into the pipeline.' },
    { title: 'Scalable cloud-first infrastructure', description: 'Native multi-cloud and hybrid architectures that grow with your enterprise.' },
    { title: 'Performance-optimized engineering', description: 'Eliminating bottlenecks to ensure lightning-fast processing at extreme scale.' },
    { title: 'Strategic technology partnerships', description: 'Leveraging top-tier relationships with Snowflake, Databricks, and Cloud giants.' },
    { title: 'Outcomes-focused delivery', description: 'Engineering defined by business impact, not just storage volume.' },
  ],

  // Inline JSX section — broken legacy URLs rewritten to canonical /services/<slug> per locked decision
  postIndustrySections: (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Portfolio Ecosystem
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Related Analytics <span className="text-transparent bg-clip-text bg-brand-gradient">Offerings</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Accelerate your data journey by combining Big Data engineering with our broader portfolio of intelligence services.
            </p>
            <div className="space-y-4">
              {[
                { name: 'Agentic AI', link: '/services/agentic-ai', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Autonomous systems and agentic intelligence.' },
                { name: 'Analytics', link: '/services/analytics', icon: <BarChart3 className="w-5 h-5" />, desc: 'Modern EDW and descriptive analytics.' },
                { name: 'Data Science & AI', link: '/services/data-science-ai', icon: <LineChart className="w-5 h-5" />, desc: 'Predictive modeling and statistical analysis.' },
              ].map((offering, idx) => (
                <Link key={idx} to={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Link to="/services" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl">
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed"></div>
                <div className="relative">
                  <Database className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),

  ctaTitle: 'Turn Data Chaos Into Competitive Advantage',
  ctaDescription: 'Let&rsquo;s design your next-generation data platform.',
  ctaButtonText: 'Schedule a Strategy Call',
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 12 services wired:
//   - 5 Cognition AI services + 2 Cognition T3 (analytics, big-data)
//   - 1 Shield service co-located here due to shared AI asset coupling
//     (ai-governance — departmentSlug: 'shield')
//   - 4 Cognition Automation services lifted from legacy 15-dept "automation"
//     folder (Phase G — RESET DIRECTION 2026-05-18). Defined in
//     ./automation-services.jsx and spread in below.
export const COGNITION_SECTIONS = {
  'agentic-ai': agenticAI,
  'ai-cognitive-computing': aiCognitiveComputing,
  'data-science-ai': dataScienceAI,
  'genai-business-services': genaiBusinessServices,
  'mlops': mlops,
  'ai-governance': aiGovernance,
  'analytics': analytics,
  'big-data': bigData,
  ...COGNITION_AUTOMATION_SECTIONS,
};
