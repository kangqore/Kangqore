// ─── Kangqore Growth — Premium Service Content (Phase G2 PR 2) ───────────────
// Per-service premium presentation layer for Growth (8 T1 services). Each
// entry is an object that merges over the canonical base service from
// servicesData.js to produce the legacy-template-compatible shape.
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
//   - capabilitiesDescription (string)— description above capability grid
//   - preMatrixSection (JSX)          — JSX rendered before the matrix
//   - customSections (JSX|array)      — JSX/array rendered after philosophy
//   - postCapabilitiesSections (JSX)  — JSX rendered after capabilities
//   - postFAQSections (JSX|null)      — JSX rendered after FAQ
//   - customFAQs (array)              — FAQ overrides
//   - trustPillars (array)            — pillar cards rendered above capabilities
//   - trustStrip (string)             — narrative trust caption
//   - whyKangqore (array)             — "why us" cards
//   - useCases / industries (array)   — industries rendered on page
//   - technologies (array)            — technology grouping rendered on page
//   - ctaTitle / ctaDescription / ctaButtonText / ctaSecondaryButton
//                                       — page CTA overrides (rare field set)
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Search, Database, Users, Zap, Lock, Bot, Heart, Shield, Target, BarChart3,
  Rocket, Globe, Layers, Activity, BrainCircuit, TrendingUp, MessageCircle,
  Megaphone, Briefcase, DollarSign, Gauge, GraduationCap, Landmark,
  ShoppingCart, LineChart, MousePointerClick, PenTool, Filter, MonitorPlay,
  MousePointer2, Eye, Settings, MapPin, RefreshCw,
} from 'lucide-react';

import {
  CDPProblemsSection,
  WhyCDPStrategyMatters,
  CDPFrameworkSection,
  CDPDeliverablesSection,
  CDPImpactSection,
  CDPReadinessMagnet,
  CDPLogoTrustSection,
} from './CDPCustomSections';

import {
  AIProblemsSection,
  WhyAIReadinessMatters,
  AIRoadmapFramework,
  WhatAIDeliversSection,
  AIUseCasesSection,
  AIImpactSection,
  AIReadinessMagnet,
  AILogoTrustSection,
} from './MarketingAISections';

import {
  SocialChallengesSection,
  WhySocialMattersSection,
  FivePhaseMethodology,
  ExecutionPodSection,
  BusinessTypesSection,
  SocialReadinessMagnet,
} from './SocialMediaCustomSections';

import {
  PerformanceChallengesSection,
  FivePhaseGrowthMethod,
  GrowthPodSection,
  KPIReportingSection,
  BusinessNeedsSection,
  PerformanceReadinessMagnet,
  LogoTrustSection as PerfLogoTrustSection,
} from './PerformanceMarketingCustomSections';

import {
  SEOChallengesSection,
  WhySEOMattersSection,
  FourPhaseGrowthMethod,
  SEOGrowthPodSection,
  SEOSuccessSection,
  SEOReadinessMagnet,
  LogoTrustSection as SEOLogoTrustSection,
} from './SEOCustomSections';

import {
  FunnelChallengesSection,
  WhyFunnelsMatterSection,
  FourPhaseFunnelMethod,
  FunnelSuccessSection,
  FunnelReadinessMagnet,
  FunnelLogoTrustSection,
} from './FunnelCustomSections';

import {
  CROChallengesSection,
  WhyCROMattersSection,
  SixPhaseCROMethod,
  CROSuccessSection,
  CROReadinessMagnet,
  CROLogoTrustSection,
} from './CROCustomSections';

import {
  CampaignProblemsSection,
  WhyCampaignPlanningMatters,
  CampaignFrameworkSection,
  WhatKangqoreDeliversSection,
  BusinessImpactSection,
  CampaignReadinessMagnet,
  CampaignLogoTrustSection,
} from './CampaignPlanningCustomSections';

// ─── cdp-strategy (Growth) ─────────────────────────────────────────────────────
const cdpStrategy = {
  titleLine1: 'Customer Data',
  titleHighlight: 'Strategy.',
  description: 'We help businesses design customer data strategies that connect fragmented data across websites, apps, CRM, campaigns, sales, service, and analytics into one usable intelligence layer — built for personalization, automation, AI-readiness, and measurable growth.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Build My Customer Data Strategy', link: '/contact' },
  secondaryButton: { text: 'Request Data Readiness Audit', link: '/contact' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'Unified', label: 'Profiles', color: 'text-brand-blue' },
    { value: 'AI-Ready', label: 'Intelligence', color: 'text-blue-400' },
    { value: 'First-Party', label: 'Data Focus', color: 'text-cyan-400' },
    { value: 'GDPR-Ready', label: 'Governance', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'CDP :: CUSTOMER INTELLIGENCE',
      titleLine1: 'Turn Scattered Data Into',
      titleHighlight: 'Growth Intelligence.',
      titleLine2: '',
      description: 'Most brands collect customer data. Very few know how to activate it. Kangqore helps businesses design customer data strategies that connect identities, behaviors, and preferences across every touchpoint into one usable intelligence layer.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Disconnected signals, duplicate records, and siloed databases burn spend and break the customer journey.',
      requirementLabel: 'The Requirement',
      requirementText: 'A unified identity resolution logic and governed data foundation built for personalization and AI.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      statusLabel: 'Intelligence State',
      statusValue: 'ENGINEERED',
    },
    philosophy: {
      icon: <Database className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our Data Strategy',
      titleHighlight: 'Philosophy.',
      description: 'At Kangqore, customer data strategy is not a technology project. It is a complete growth system designed to turn fragmented customer signals into decisions, experiences, journeys, and revenue opportunities.',
      pills: ['Identity Resolution', 'First-Party Activation', 'AI-Ready Data', 'Privacy by Design'],
      features: [
        { title: 'Unified View', label: 'Alignment', icon: <Users className="w-5 h-5 text-gray-400" />, content: 'One reliable profile across websites, apps, CRM, and campaigns.' },
        { title: 'Actionable IQ', label: 'Activation', icon: <Zap className="w-5 h-5 text-gray-400" />, content: 'Segments and behaviors that flow directly into personalization engines.' },
        { title: 'Clean Ingestion', label: 'Quality', icon: <Database className="w-5 h-5 text-gray-400" />, content: 'Fixing duplicates and inconsistent fields for confident decision-making.' },
        { title: 'Trust Layer', label: 'Governance', icon: <Lock className="w-5 h-5 text-gray-400" />, content: 'Consent and data protection built into the architecture from day one.' },
      ],
    },
    matrix: {
      engineId: 'CUSTOMER INTELLIGENCE™',
      title: 'Strategic Pillars.',
      subtext: 'The architectural framework that builds certainty, performance, and scalability into your customer data ecosystem.',
      layers: [
        { title: 'Audit Readiness', id: 'CDS_AUDIT', icon: <Search />, desc: 'Mapping the state of collection, quality, and AI-readiness.' },
        { title: 'Connect Data', id: 'CDS_CONN', icon: <Database />, desc: 'Integrating CRM, CDP, and ad platforms into a unified sync.' },
        { title: 'Govern Trust', id: 'CDS_GOV', icon: <Lock />, desc: 'Establishing consent capture and privacy guardrails.' },
        { title: 'Activate Growth', id: 'CDS_ACT', icon: <Zap />, desc: 'Driving personalization and AI-led decisions across the journey.' },
      ],
    },
    schematic: {
      titleLine1: 'Predictable',
      titleHighlight: 'Personalization.',
      description: 'We do not assume who the customer is. We build a scientific data system where decisions are based on persistent behavior and validated identity logic.',
      stats: [
        { label: 'Identity', val: 'UNIFIED' },
        { label: 'Data IQ', val: 'CLEAN' },
        { label: 'AI Readiness', val: 'VALIDATED' },
      ],
    },
  },

  trustStrip: 'Turning fragmented customer data into a structured operating system for growth and AI readiness.',

  whyKangqore: [
    { title: 'Customer-First Data Strategy', description: 'We define customer data around real experience, personalization, and retention use cases.', icon: Heart },
    { title: 'First-Party Data Ownership', description: 'Reducing dependence on third-party signals to build stronger owned data foundations.', icon: Database },
    { title: 'Unified Customer Intelligence', description: 'Connecting data across systems so teams can see customers clearly and act faster.', icon: Users },
    { title: 'Personalization-Ready', description: 'Segments, journeys, and campaigns are built for real-world execution.', icon: Zap },
    { title: 'AI-Ready Foundation', description: 'Structuring data so AI can support prediction and personalization safely.', icon: Bot },
    { title: 'Governance Built In', description: 'Consent, privacy, and compliance are part of the strategy from day one.', icon: Shield },
  ],

  customFAQs: [
    { question: 'What is Customer Data Strategy?', answer: 'Customer Data Strategy is the blueprint for collecting, connecting, governing, analyzing, and activating customer data to improve personalization, marketing, sales, service, retention, and growth.' },
    { question: 'Is this the same as CDP implementation?', answer: 'No. CDP implementation is a technology project. Customer Data Strategy defines the business use cases, data model, governance, segmentation, activation plan, and platform roadmap before or alongside CDP implementation.' },
    { question: 'Why does customer data matter for personalization?', answer: 'Personalization depends on knowing who the customer is, what they prefer, how they behave, and what journey stage they are in. Without connected data, personalization stays generic.' },
    { question: 'Can Kangqore help us choose a CDP or CRM?', answer: 'Yes. We help define requirements, compare platform options, map integrations, and design the operating model for CRM, CDP, or data warehouse systems.' },
    { question: 'How does this support AI?', answer: 'AI needs reliable, secure, and organized data. Kangqore prepares customer data so AI systems can support prediction, personalization, and decision intelligence.' },
  ],

  customSections: [
    <CDPLogoTrustSection key="cdp-logo-trust" />,
    <CDPProblemsSection key="cdp-problems" />,
    <WhyCDPStrategyMatters key="why-cdp-matters" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <CDPFrameworkSection />
      <CDPDeliverablesSection />
      <CDPImpactSection />
      <CDPReadinessMagnet />
    </div>
  ),

  industries: [
    { name: 'E-commerce & Retail' },
    { name: 'SaaS & Technology' },
    { name: 'Finance & Banking' },
    { name: 'Healthcare & Wellness' },
    { name: 'Hospitality & Travel' },
    { name: 'Education' },
    { name: 'Automotive' },
    { name: 'Real Estate' },
    { name: 'Professional Services' },
    { name: 'B2B Enterprise' },
    { name: 'D2C Brands' },
    { name: 'Media & Entertainment' },
  ],

  technologies: [
    { category: 'Customer Data Platforms', items: ['Segment', 'Lytics', 'mParticle', 'Salesforce Data Cloud', 'BlueConic'] },
    { category: 'CRM & Marketing Automation', items: ['HubSpot', 'Salesforce', 'Klaviyo', 'ActiveCampaign', 'Braze'] },
    { category: 'Analytics & Warehousing', items: ['Snowflake', 'BigQuery', 'Amplitude', 'Mixpanel', 'GA4'] },
    { category: 'Personalization', items: ['Dynamic Yield', 'Optimizely', 'Insider', 'Netcore'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'At Kangqore, customer data strategy is not just about tools. It is a complete growth architecture that defines what data to collect, how to unify it, and how to activate it for personalization and AI.',
  capabilities: [
    {
      title: 'Customer Data Audit',
      description: 'We assess the state of your customer data ecosystem across sources, platforms, and AI-readiness.',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      items: ['Data collection audit', 'Platform source map', 'Quality & hygiene review', 'Consent & privacy audit'],
      micro: 'Assess the state.',
    },
    {
      title: 'Collection Strategy',
      description: 'We define what customer data should be collected and why, focusing on business purpose over volume.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      items: ['Profile & contact data', 'Behavioral & events', 'Preference capture', 'Campaign engagement'],
      micro: 'Collect with purpose.',
    },
    {
      title: 'Unified Profile Design',
      description: 'We design the structure for creating a single customer view across identities and engagement.',
      bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      items: ['Identity resolution logic', 'Source mapping rules', 'Data enrichment strategy', 'Customer 360 blueprint'],
      micro: 'Unify the view.',
    },
    {
      title: 'Platform Architecture',
      description: 'We help you decide where data should live and how systems like CRM and CDP should sync.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      items: ['CRM vs CDP roles', 'Data warehouse strategy', 'Integration roadmap', 'Access & security model'],
      micro: 'Build the stack.',
    },
    {
      title: 'Segmentation Strategy',
      description: 'We convert raw data into actionable audience groups based on behavior, value, and intent.',
      bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80',
      items: ['Behavioral segments', 'Lifecycle stage logic', 'High-value modeling', 'Churn risk signals'],
      micro: 'Define the audience.',
    },
    {
      title: 'Personalization Roadmap',
      description: 'We define how data creates relevant experiences across web, app, email, and ad channels.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      items: ['Real-time offers', 'Recommended content', 'Triggered journeys', 'Website personalization'],
      micro: 'Activate the experience.',
    },
    {
      title: 'Consent & Trust Framework',
      description: 'We design the governance layer that keeps data compliant and trust high with every customer.',
      bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80',
      items: ['Consent capture flows', 'Preference centers', 'Opt-out management', 'Transparency rules'],
      micro: 'Build for trust.',
    },
    {
      title: 'Analytics & Intelligence',
      description: 'We transform data into decision intelligence—from CLV to attribution and growth signals.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      items: ['Customer lifetime value', 'Revenue attribution', 'Churn prediction', 'Channel performance'],
      micro: 'Drive intelligence.',
    },
    {
      title: 'AI-Ready Foundation',
      description: 'We prepare data cataloging and quality rules so AI can support prediction and personalization.',
      bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      items: ['Data quality rules', 'Structured cataloging', 'Model input readiness', 'AI governance'],
      micro: 'Prepare for AI.',
    },
    {
      title: 'Operating Model',
      description: 'We turn strategy into execution with ownership, workflows, and 30/60/90-day blueprints.',
      bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      items: ['Team ownership', 'System workflows', 'Execution timeline', 'KPI framework'],
      micro: 'Plan for execution.',
    },
  ],
  trustPillars: [
    { title: 'Unified Profiles', tag: 'Identity', description: 'One reliable profile across every interaction, behavior, and transaction.' },
    { title: 'Clean Intelligence', tag: 'Quality', description: 'Fixing duplicate records and inconsistent fields for confident decisions.' },
    { title: 'Actionable Segments', tag: 'Activation', description: 'Audience definitions that flow directly into campaigns and automation.' },
    { title: 'AI Governance', tag: 'Future-Proof', description: 'Preparing data so AI can support insight and personalization safely.' },
  ],
  ctaTitle: 'Build Your Customer Intelligence.',
  ctaDescription: 'Stop letting customer data sit siloed and unused. Let us build the strategy that connects your data to real growth, personalization, and AI readiness.',
  ctaButtonText: 'Start My Data Strategy',
  ctaSecondaryButton: { text: 'Claim Data Readiness Audit', link: '/contact' },
};

// ─── marketing-ai-readiness (Growth) ──────────────────────────────────────────
const marketingAiReadiness = {
  titleLine1: 'Marketing AI',
  titleHighlight: 'Readiness.',
  description: 'Kangqore helps marketing teams assess, design, and operationalize AI readiness across customer data, content workflows, personalization, campaign execution, analytics, automation, governance, and growth operations.',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1260&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Assess My Marketing AI Readiness', link: '/contact' },
  secondaryButton: { text: 'Request AI Growth Audit', link: '/contact' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'AI-Ready', label: 'Customer Data', color: 'text-brand-blue' },
    { value: 'GenAI', label: 'Content Workflows', color: 'text-blue-400' },
    { value: 'Scale', label: 'Personalization', color: 'text-cyan-400' },
    { value: 'Governed', label: 'Responsible AI', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'AI READINESS :: MARKETING OPERATIONS',
      titleLine1: 'Make Your Marketing Team Ready for the',
      titleHighlight: 'AI Era.',
      titleLine2: '',
      description: 'Most brands are experimenting with AI. Very few are ready to scale it safely, intelligently, and profitably. We help marketing teams assess, design, and operationalize AI readiness across customer data, content workflows, personalization, campaign execution, analytics, automation, governance, and growth operations.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Fragmented data, unclear workflows, weak content governance, disconnected martech, and teams without AI operating discipline.',
      requirementLabel: 'The Requirement',
      requirementText: 'A structured AI-ready foundation that lets AI improve speed, quality, personalization, and revenue without losing brand control.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
      statusLabel: 'AI Readiness',
      statusValue: 'ASSESSING',
    },
    philosophy: {
      icon: <Bot className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our AI Readiness',
      titleHighlight: 'Philosophy.',
      description: 'We don\'t add AI as a feature. We build the foundation that lets AI improve speed, quality, personalization, and revenue performance without losing brand control.',
      pills: ['Strategy Before Tools', 'Data Before Automation', 'Governance Before Scale', 'Human + AI Ops'],
      features: [
        { title: 'Strategy Before Tools', label: 'Foundation', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'We define the business use cases before recommending AI platforms or workflows.' },
        { title: 'Data Before Automation', label: 'Quality', icon: <Database className="w-5 h-5 text-gray-400" />, content: 'We make sure customer data is usable, governed, and activation-ready before automating anything.' },
        { title: 'Governance Before Scale', label: 'Trust', icon: <Shield className="w-5 h-5 text-gray-400" />, content: 'Brand safety, privacy, security, and approval flows are built from day one.' },
        { title: 'Human + AI Model', label: 'Operations', icon: <Users className="w-5 h-5 text-gray-400" />, content: 'We design workflows where AI accelerates execution while humans guide strategy, judgment, and creativity.' },
      ],
    },
    matrix: {
      engineId: 'AI READINESS FRAMEWORK™',
      title: 'Readiness Pillars.',
      subtext: 'The architectural framework for moving marketing from AI experimentation to AI-powered operating maturity.',
      layers: [
        { title: 'Diagnose', id: 'AIR_DIAG', icon: <Search />, desc: 'Assess current marketing workflows, data maturity, tools, AI usage, governance, and performance gaps.' },
        { title: 'Prioritize', id: 'AIR_PRIO', icon: <Target />, desc: 'Rank AI use cases by business value, feasibility, risk, and implementation speed.' },
        { title: 'Prepare', id: 'AIR_PREP', icon: <Database />, desc: 'Define the data, workflow, content, martech, governance, and team readiness requirements.' },
        { title: 'Pilot', id: 'AIR_PILOT', icon: <Rocket />, desc: 'Launch controlled AI pilots across content, campaigns, analytics, personalization, or automation.' },
        { title: 'Govern', id: 'AIR_GOV', icon: <Shield />, desc: 'Establish responsible AI guardrails, review flows, privacy controls, and brand standards.' },
        { title: 'Scale', id: 'AIR_SCALE', icon: <Zap />, desc: 'Operationalize the best-performing AI use cases into repeatable marketing workflows.' },
      ],
    },
    schematic: {
      titleLine1: 'Predictable',
      titleHighlight: 'Growth.',
      description: 'We do not assume AI is ready. We build the marketing foundation — data, workflows, governance, people — so AI can create measurable, scalable, and responsible performance.',
      stats: [
        { label: 'Data', val: 'AI-READY' },
        { label: 'Workflows', val: 'STRUCTURED' },
        { label: 'Governance', val: 'RESPONSIBLE' },
      ],
    },
  },

  trustStrip: 'Helping marketing teams move from random AI experimentation to structured AI-enabled performance.',

  whyKangqore: [
    { title: 'Strategy Before Tools', description: 'We define the business use cases before recommending AI platforms or workflows.', icon: Search },
    { title: 'Data Before Automation', description: 'We make sure customer data is usable, governed, and activation-ready.', icon: Database },
    { title: 'Personalization Before Noise', description: 'AI is used to create more relevant experiences, not just more content.', icon: Target },
    { title: 'Governance Before Scale', description: 'Brand safety, privacy, security, and approval flows are built from day one.', icon: Shield },
    { title: 'Human + AI Operating Model', description: 'We design workflows where AI accelerates execution while humans guide strategy, judgment, and creativity.', icon: Users },
    { title: 'Measurable Growth Impact', description: 'Every AI use case is tied to performance, productivity, customer experience, or revenue outcomes.', icon: BarChart3 },
  ],

  customFAQs: [
    { question: 'What is Marketing AI Readiness?', answer: 'Marketing AI Readiness is the process of preparing your marketing team, customer data, workflows, tools, governance, and operating model to use AI safely and effectively.' },
    { question: 'Is this the same as using ChatGPT for marketing?', answer: 'No. Using AI tools is only one small part. Marketing AI Readiness defines the strategy, data foundation, workflows, governance, use cases, and measurement system needed to scale AI across marketing operations.' },
    { question: 'Why does customer data matter for AI marketing?', answer: 'AI needs reliable customer data to personalize, predict, segment, and recommend effectively. Poor data creates poor AI outputs — regardless of the model quality.' },
    { question: 'Can Kangqore help us choose AI marketing tools?', answer: 'Yes. We assess your use cases, existing martech stack, data readiness, and governance needs before recommending the right tools, platforms, and integrations.' },
    { question: 'What marketing areas can AI improve?', answer: 'AI can support campaign planning, content creation, personalization, segmentation, lead scoring, analytics, reporting, funnel optimization, and customer engagement — when the foundation is ready.' },
    { question: 'How do you reduce AI risk?', answer: 'We design responsible AI guardrails covering privacy, consent, brand safety, legal review, data access, human oversight, and output verification before scaling any AI capability.' },
    { question: 'Can AI replace our marketing team?', answer: 'No. The best model is human + AI. AI accelerates repetitive and analytical tasks, while humans guide strategy, creativity, judgment, and brand direction.' },
    { question: 'What are the first deliverables?', answer: 'The first deliverables usually include a readiness audit, AI use-case map, data readiness assessment, workflow blueprint, governance framework, and 30/60/90-day roadmap.' },
  ],

  customSections: [
    <AILogoTrustSection key="ai-logo-trust" />,
    <AIProblemsSection key="ai-problems" />,
    <WhyAIReadinessMatters key="why-ai-matters" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <AIRoadmapFramework />
      <WhatAIDeliversSection />
      <AIUseCasesSection />
      <AIImpactSection />
      <AIReadinessMagnet />
    </div>
  ),

  industries: [
    { name: 'SaaS & Technology' },
    { name: 'E-commerce & D2C' },
    { name: 'Beauty & Wellness' },
    { name: 'Healthcare' },
    { name: 'Education' },
    { name: 'Real Estate' },
    { name: 'Finance & Insurance' },
    { name: 'Travel & Hospitality' },
    { name: 'Media & Entertainment' },
    { name: 'Professional Services' },
    { name: 'B2B Enterprises' },
    { name: 'Consumer Brands' },
  ],

  technologies: [
    { category: 'Generative AI & LLMs', items: ['OpenAI / GPT-4o', 'Anthropic / Claude', 'Google Gemini', 'Midjourney', 'Stable Diffusion'] },
    { category: 'CDP & CRM', items: ['Segment', 'Salesforce Data Cloud', 'HubSpot', 'Braze', 'Klaviyo'] },
    { category: 'Marketing Automation', items: ['ActiveCampaign', 'Marketo', 'Customer.io', 'Intercom', 'MoEngage'] },
    { category: 'Analytics & Personalization', items: ['GA4', 'Amplitude', 'Mixpanel', 'Dynamic Yield', 'Optimizely'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'Kangqore\'s Marketing AI Readiness service helps brands prepare their marketing function for practical, scalable, and governed AI adoption. We assess your data, workflows, tools, content operations, customer journeys, analytics, and governance — then build a roadmap for AI-powered marketing execution.',
  capabilities: [
    {
      title: 'Marketing AI Readiness Assessment',
      description: 'We evaluate whether your marketing organization is ready to adopt AI across strategy, data, workflows, content, automation, analytics, and governance.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      items: ['Current AI usage audit', 'Customer data readiness', 'Martech & CRM maturity', 'Content workflow readiness', 'Campaign automation maturity', 'Personalization capability', 'Analytics quality', 'Governance gaps', 'Team skills assessment'],
      micro: 'Score your readiness.',
    },
    {
      title: 'AI Use-Case Discovery & Prioritization',
      description: 'We identify where AI should be applied first — based on business value, feasibility, risk, and speed of execution.',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted content creation', 'Campaign ideation & planning', 'Audience segmentation', 'Lead scoring', 'Customer journey personalization', 'Email & WhatsApp automation', 'Creative testing', 'Performance analytics'],
      micro: 'Prioritize what matters.',
    },
    {
      title: 'AI-Ready Customer Data Strategy',
      description: 'We prepare customer data for AI-powered marketing, personalization, analytics, and automation.',
      bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      items: ['Data source mapping', 'First-party data strategy', 'Unified customer profiles', 'Identity resolution logic', 'Segmentation model', 'Consent & privacy fields', 'AI-ready data quality rules'],
      micro: 'Fix the foundation.',
    },
    {
      title: 'GenAI Content Workflow Readiness',
      description: 'We redesign content operations so GenAI improves speed without weakening quality, brand consistency, or compliance.',
      bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted content workflow', 'Prompt & brief standards', 'Brand voice guardrails', 'Human review checkpoints', 'Legal compliance flow', 'Quality scoring framework', 'Content reuse model'],
      micro: 'Scale content safely.',
    },
    {
      title: 'AI-Powered Personalization Strategy',
      description: 'We help brands move from generic campaigns to customer-relevant experiences across channels.',
      bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
      items: ['Personalization use cases', 'Audience segment logic', 'Dynamic content rules', 'Product recommendations', 'Website personalization', 'Email & WhatsApp personalization', 'Next-best-action workflows'],
      micro: 'Personalize at scale.',
    },
    {
      title: 'Martech, CRM & AI Tooling Assessment',
      description: 'We assess whether your current technology stack can support AI-enabled marketing operations.',
      bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      items: ['CRM setup review', 'Marketing automation platform', 'CDP / data warehouse readiness', 'Analytics tools', 'Ad platform data flow', 'AI tools audit', 'Integration gaps', 'Security & access controls'],
      micro: 'Audit the stack.',
    },
    {
      title: 'AI Campaign & Creative Intelligence',
      description: 'We help teams use AI to improve campaign planning, creative testing, messaging, and optimization.',
      bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted campaign briefs', 'Audience-message matching', 'Hook & headline generation', 'Creative variant development', 'Ad copy testing systems', 'Performance pattern analysis'],
      micro: 'Accelerate campaigns.',
    },
    {
      title: 'AI Analytics & Decision Intelligence',
      description: 'We turn marketing data into AI-assisted insights that help teams act faster.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      items: ['Marketing performance dashboards', 'AI-assisted insight summaries', 'Funnel leakage detection', 'Campaign anomaly alerts', 'Lead quality scoring', 'Budget allocation recommendations'],
      micro: 'Decide, don\'t guess.',
    },
    {
      title: 'Responsible AI Governance for Marketing',
      description: 'We define the controls needed to use AI safely across marketing operations.',
      bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      items: ['AI usage policy', 'Data privacy & consent rules', 'Brand safety guardrails', 'Human review checkpoints', 'IP & copyright controls', 'Model output verification', 'Escalation structure'],
      micro: 'Govern with trust.',
    },
    {
      title: 'Marketing AI Roadmap & Operating Model',
      description: 'We turn AI readiness into execution with ownership, workflows, and 30/60/90-day blueprints.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      items: ['AI readiness scorecard', 'Use-case prioritization matrix', 'Data readiness roadmap', 'Content workflow plan', 'Governance framework', 'Team ownership model', '30/60/90-day implementation', 'KPI measurement framework'],
      micro: 'Plan for execution.',
    },
  ],
  trustPillars: [
    { title: 'AI-Ready Customer Data', tag: 'Foundation', description: 'Clean, connected, governed customer data for intelligence and activation.' },
    { title: 'GenAI Content Workflows', tag: 'Speed', description: 'Faster content production with brand, legal, and quality guardrails.' },
    { title: 'Personalization at Scale', tag: 'Relevance', description: 'Relevant experiences powered by data, segmentation, and AI.' },
    { title: 'Responsible AI Governance', tag: 'Trust', description: 'Clear controls for privacy, security, brand consistency, and human oversight.' },
  ],
  ctaTitle: 'Build the Foundation First.',
  ctaDescription: 'AI can accelerate growth only when your data, workflows, tools, people, and governance are ready. Kangqore helps you build the marketing AI foundation needed to personalize better, execute faster, automate smarter, and scale responsibly.',
  ctaButtonText: 'Assess My Marketing AI Readiness',
  ctaSecondaryButton: { text: 'Request AI Growth Audit', link: '/contact' },
};

// ─── social-media-management (Growth) ─────────────────────────────────────────
const socialMediaManagement = {
  titleLine1: 'Social Media',
  titleHighlight: 'Management.',
  description: 'Turn social media into a measurable growth channel. Kangqore deploys full-stack execution pods that handle strategy, design, copy, paid ads, and analytics under one unified operating model.',
  image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1260&q=80',

  primaryButton: { text: 'Get Your Social Media Growth Blueprint', link: '/contact' },
  secondaryButton: { text: 'Schedule a Strategy Call', link: '#capabilities' },
  hideGenericMidPageCta: true,

  stats: [
    { value: '30+', label: 'Industries Covered', color: 'text-brand-blue' },
    { value: '24/7', label: 'Community Readiness', color: 'text-blue-400' },
    { value: '5-Phase', label: 'Growth Method', color: 'text-cyan-400' },
    { value: '100%', label: 'KPI-Led Execution', color: 'text-brand-blue' },
  ],

  ctaTitle: 'Build a Social Media Engine That Actually Ships',
  ctaDescription: 'Start with a strategy call. We\'ll audit your current presence, identify growth gaps, and map a 90-day execution roadmap.',
  ctaButtonText: 'Book a Social Media Strategy Call',

  highFidelity: {
    narrative: {
      badge: 'SOCIAL MEDIA MANAGEMENT :: REVENUE ENGINE',
      titleLine1: 'Attention Into',
      titleHighlight: 'Revenue.',
      titleLine2: 'At Scale.',
      description: 'Social media is no longer a posting channel. It is a revenue surface. Your customers research, compare, trust, complain, discover, and buy through social platforms. The brands that win are the most consistent, useful, visible, and measurable.',
      bottleneckLabel: 'The Reality',
      bottleneckText: 'Your team posts consistently but engagement is flat. There\'s no connection between content output and pipeline growth. Every platform looks different, the brand voice shifts by channel, and no one can answer "what\'s the ROI of social?"',
      requirementLabel: 'The Kangqore Standard',
      requirementText: 'We deploy a full-stack execution pod — strategist, copywriter, designer, community manager, paid specialist, and analyst — operating under one governed model. Every post, campaign, and community interaction is tied to measurable KPIs.',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Social Engine',
      statusValue: 'DEPLOYED',
    },
    philosophy: {
      icon: <Megaphone className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Platform-Native.',
      titleHighlight: 'Revenue-Linked.',
      description: 'We don\'t copy-paste posts across channels. Every platform gets native content designed for its algorithm, audience behavior, and conversion path. Likes are useful only when they support reach, trust, pipeline, sales, or brand authority.',
      pills: ['Multi-Platform Native', 'KPI-Led Content', 'Community-First', 'Paid + Organic Synergy'],
      features: [
        { title: 'Content Strategy & Pillars', label: 'Strategy', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Define content pillars, platform priorities, campaign themes, publishing rhythm, creative direction, and measurable KPIs for every channel.' },
        { title: 'Community & Engagement', label: 'Growth', icon: <MessageCircle className="w-5 h-5 text-gray-400" />, content: 'Initiate engagement loops, activate community conversations, manage DMs, comments, and build authentic relationships at scale.' },
        { title: 'Paid Social Execution', label: 'Amplification', icon: <Megaphone className="w-5 h-5 text-gray-400" />, content: 'Run Meta, LinkedIn, YouTube, and X campaigns with A/B testing, audience targeting, retargeting, and budget optimization.' },
        { title: 'Analytics & Attribution', label: 'Intelligence', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Track reach, engagement, CTR, CPL, conversions, content performance, and revenue attribution with weekly and monthly reports.' },
      ],
    },
    matrix: {
      engineId: 'SOCIAL GROWTH ENGINE™',
      title: 'The Growth Matrix.',
      subtext: 'A structured 5-phase methodology that transforms social media from a cosmetic activity into a measurable growth channel.',
      layers: [
        { title: 'Audit', id: 'SMM_AUDIT', icon: <Search />, desc: 'Profile audit, competitor analysis, audience mapping, content gap identification, and platform readiness scoring.' },
        { title: 'Strategize', id: 'SMM_STRAT', icon: <Layers />, desc: 'Content pillars, platform priorities, campaign themes, creative direction, and KPI framework definition.' },
        { title: 'Execute', id: 'SMM_EXEC', icon: <Zap />, desc: 'Content production, scheduling, community activation, paid campaign launch, and engagement management.' },
        { title: 'Optimize', id: 'SMM_OPT', icon: <Activity />, desc: 'Performance tracking, format testing, strategy refinement, ROI improvement, and repeatable engine building.' },
      ],
    },
    schematic: {
      titleLine1: 'Measurable',
      titleHighlight: 'Growth.',
      description: 'Your social media should be your most measurable growth channel. We make every post, campaign, and community interaction accountable to business outcomes.',
      stats: [
        { label: 'Reach', val: 'SCALED' },
        { label: 'Pipeline', val: 'CONNECTED' },
        { label: 'ROI', val: 'TRACKED' },
      ],
    },
  },

  trustStrip: 'Trusted by startups, B2B companies, and enterprise brands across 30+ industries to transform social media from a content calendar into a governed revenue channel.',

  whyKangqore: [
    { title: 'Data-Driven Strategy', description: 'No guesswork. Every content and campaign decision is tied to audience analysis, competitor benchmarking, platform data, and performance metrics.', icon: BarChart3 },
    { title: 'Full Team, Not One Freelancer', description: 'You get strategy, design, copy, community management, paid ads, and analytics under one operating model — not a single overworked generalist.', icon: Users },
    { title: 'Conversion-Focused Content', description: 'Likes are useful only when they support reach, trust, pipeline, sales, hiring, or brand authority. We engineer content for business outcomes, not vanity metrics.', icon: TrendingUp },
  ],

  useCases: [
    { name: 'Financial Services', description: 'Compliance-aware content, trust-building education, investor communication, and lead-generation campaigns.', icon: Shield },
    { name: 'SaaS & Software', description: 'Product demos, founder-led posts, customer proof, launch campaigns, feature education, and LinkedIn authority building.', icon: BrainCircuit },
    { name: 'Healthcare & Wellness', description: 'Patient education, wellness tips, doctor-led trust content, awareness campaigns, and compliant storytelling.', icon: Activity },
    { name: 'E-commerce & DTC', description: 'UGC campaigns, influencer seeding, product launches, shoppable content, seasonal campaigns, and conversion-focused creatives.', icon: Globe },
    { name: 'Real Estate', description: 'Property reels, local market updates, neighborhood content, agent branding, virtual tours, and lead nurturing.', icon: Briefcase },
    { name: 'Crypto & Web3', description: 'Community management, Discord/Telegram growth, launch hype, FUD response, influencer partnerships, and education-first content.', icon: Zap },
  ],

  customFAQs: [
    { question: 'How long does it take to see results?', answer: 'You can usually see early engagement improvement within 30 days. Stronger pipeline, follower quality, and conversion signals typically build over 60–90 days.' },
    { question: 'Do you run paid social media ads?', answer: 'Yes. We manage paid campaigns across Meta, LinkedIn, YouTube, X, and other relevant platforms with A/B testing, audience targeting, retargeting, and budget optimization.' },
    { question: 'Which platforms should my business be on?', answer: 'We decide based on your audience, product, geography, industry, sales cycle, and available content formats. Not every brand needs every platform.' },
    { question: 'Do you create all the content?', answer: 'Yes. We handle strategy, copy, design, video editing, scheduling, and reporting. Your team can simply approve through our structured workflow.' },
    { question: 'Can you manage multiple accounts or brands?', answer: 'Yes. We manage multi-brand, multi-region, and multi-platform social ecosystems with governance, approval flows, and unified reporting.' },
    { question: 'How do you measure success?', answer: 'We track reach, engagement, follower quality, CTR, leads, CPL, conversions, community growth, and revenue attribution where available. Weekly and monthly reports show what worked, what failed, and what needs to change.' },
    { question: 'Can we approve content before it goes live?', answer: 'Yes. We run weekly, bi-weekly, or campaign-based approval workflows through structured content calendars with full visibility.' },
    { question: 'What if our current social media is not performing?', answer: 'We begin with an audit, identify weak points, rebuild content strategy, optimize profiles, and launch a performance recovery plan within the first 30 days.' },
  ],

  preMatrixSection: (
    <div className="flex flex-col w-full">
      <SocialChallengesSection />
      <WhySocialMattersSection />
    </div>
  ),
  customSections: [<ExecutionPodSection key="smm-pod" />],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <FivePhaseMethodology />
      <BusinessTypesSection />
      <SocialReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  // Per legacy: industries = useCases (remapped in pageData)
  industries: [
    { name: 'Financial Services', description: 'Compliance-aware content, trust-building education, investor communication, and lead-generation campaigns.', icon: Shield },
    { name: 'SaaS & Software', description: 'Product demos, founder-led posts, customer proof, launch campaigns, feature education, and LinkedIn authority building.', icon: BrainCircuit },
    { name: 'Healthcare & Wellness', description: 'Patient education, wellness tips, doctor-led trust content, awareness campaigns, and compliant storytelling.', icon: Activity },
    { name: 'E-commerce & DTC', description: 'UGC campaigns, influencer seeding, product launches, shoppable content, seasonal campaigns, and conversion-focused creatives.', icon: Globe },
    { name: 'Real Estate', description: 'Property reels, local market updates, neighborhood content, agent branding, virtual tours, and lead nurturing.', icon: Briefcase },
    { name: 'Crypto & Web3', description: 'Community management, Discord/Telegram growth, launch hype, FUD response, influencer partnerships, and education-first content.', icon: Zap },
  ],

  technologies: [
    { category: 'Scheduling & Publishing', items: ['Hootsuite', 'Sprout Social', 'Buffer', 'Later', 'Publer'] },
    { category: 'Analytics & Reporting', items: ['Google Analytics', 'Sprout Analytics', 'Iconosquare', 'Brandwatch', 'Socialbakers'] },
    { category: 'Content & Design', items: ['Canva Pro', 'Adobe Creative Suite', 'CapCut', 'Figma', 'Lottie'] },
    { category: 'Paid Social', items: ['Meta Ads Manager', 'LinkedIn Campaign Manager', 'Google Ads', 'TikTok Ads', 'X Ads'] },
    { category: 'Community & Listening', items: ['Mention', 'Brand24', 'Talkwalker', 'Sprinklr', 'Khoros'] },
    { category: 'AI & Automation', items: ['ChatGPT', 'Jasper', 'Copy.ai', 'Lately.ai', 'Predis.ai'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'Platform-specific social media marketing services. We don\'t copy-paste posts across channels — every platform gets native content designed for its algorithm and audience behavior.',
  capabilities: [
    {
      title: 'LinkedIn Marketing',
      description: 'B2B authority, founder branding, thought leadership, lead nurturing, executive content, carousel strategy, profile optimization, and industry-specific targeting that turns connections into pipeline.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Executive thought leadership', 'Carousel & document strategy', 'Profile optimization', 'B2B lead nurturing campaigns'],
      micro: 'Where B2B pipeline begins.',
    },
    {
      title: 'Instagram Marketing',
      description: 'Reels, stories, feed design, influencer collaborations, branded content, community growth, caption writing, and paid boosts engineered for algorithm reach and audience conversion.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Reels & Stories strategy', 'Influencer collaboration', 'Community growth systems', 'Paid boost optimization'],
      micro: 'Visual storytelling at scale.',
    },
    {
      title: 'Facebook & Meta Campaigns',
      description: 'Community building, retargeting, lead generation, local campaigns, full-funnel paid ads, event promotion, and audience targeting across the Meta ecosystem.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Full-funnel paid ads', 'Retargeting & lookalikes', 'Community group management', 'Local campaign activation'],
      micro: 'Full-funnel Meta execution.',
    },
    {
      title: 'YouTube Strategy',
      description: 'Video scripting, channel strategy, Shorts, long-form content planning, SEO optimization, retention hooks, and educational content that builds authority and drives subscriber growth.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Channel strategy & branding', 'Shorts & long-form planning', 'YouTube SEO optimization', 'Retention hook engineering'],
      micro: 'Long-form authority engine.',
    },
    {
      title: 'X / Twitter Marketing',
      description: 'Founder POVs, real-time commentary, threads, trend surfing, community engagement, influencer amplification, and hashtag strategy for brands that need to own the conversation.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Thread & POV strategy', 'Real-time trend surfing', 'Community engagement loops', 'Influencer amplification'],
      micro: 'Own the conversation.',
    },
    {
      title: 'Pinterest & Visual Discovery',
      description: 'SEO-led pinning, visual discovery, branded boards, product traffic, seasonal campaigns, and DTC inspiration funnels that drive long-tail organic traffic.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['SEO-led pin strategy', 'Branded board design', 'Seasonal campaign planning', 'DTC traffic funnels'],
      micro: 'Visual search, long-tail reach.',
    },
  ],
  trustPillars: [
    { title: 'Platform-native content', tag: 'Native', description: 'Every platform gets content designed for its algorithm, audience behavior, and conversion mechanics.' },
    { title: 'Full-stack execution team', tag: 'Team', description: 'Strategist, copywriter, designer, community manager, paid specialist, and analyst — not a freelancer.' },
    { title: 'KPI-led content creation', tag: 'Data', description: 'Every piece of content is tied to measurable outcomes — reach, engagement, pipeline, or revenue.' },
    { title: 'Compliance-aware execution', tag: 'Governance', description: 'Approval flows, brand guardrails, and content governance for regulated and sensitive industries.' },
    { title: 'Transparent performance reporting', tag: 'Reporting', description: 'Weekly and monthly reports showing what worked, what failed, and what changes next.' },
  ],
};

// ─── performance-marketing (Growth) ───────────────────────────────────────────
// BUG FIX: legacy used an expired Vimeo URL for videoBackground; replaced with
// the standard local mp4 used across other premium services.
const performanceMarketing = {
  titleLine1: 'Performance',
  titleHighlight: 'Marketing',
  description: 'Kangqore builds high-converting growth engines that scale predictably. From audit to execution, our performance team focuses on the only metric that matters: your bottom-line growth.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1260&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Request Revenue Audit', link: '/contact' },
  secondaryButton: { text: 'Growth Framework', link: '#capabilities' },
  hideGenericMidPageCta: true,

  stats: [
    { value: '3x ROAS', label: 'Revenue-Led Campaign Architecture', color: 'text-brand-blue' },
    { value: 'Multi-Channel', label: 'Google, Meta, LinkedIn, YouTube', color: 'text-blue-400' },
    { value: 'Full-Funnel', label: 'Click-to-Customer Optimization', color: 'text-cyan-400' },
    { value: 'Real-Time', label: 'Dashboards, Attribution & Scaling', color: 'text-brand-blue' },
  ],

  ctaTitle: 'Stop Wasting Budget on Clicks. Start Building Revenue Engines.',
  ctaDescription: 'Let’s uncover spend inefficiencies, capture real demand, and architect a scalable performance system that drives qualified growth, stronger ROI, and measurable business outcomes.',
  ctaButtonText: 'Book a Performance Strategy Call',

  highFidelity: {
    narrative: {
      badge: 'PERFORMANCE MARKETING :: REVENUE ENGINE',
      titleLine1: 'Convert Spend',
      titleHighlight: 'Into Revenue.',
      titleLine2: 'At Scale.',
      description: 'Performance marketing isn\'t about clicks, impressions, or dashboard screenshots. It\'s about building predictable, scalable paid acquisition systems that connect media spend directly to revenue.',
      bottleneckLabel: 'The Reality',
      bottleneckText: 'You\'re spending on Google and Meta, but CAC keeps climbing, lead quality is inconsistent, campaigns fatigue within weeks, and no one can tell you which channel actually drives revenue. Your agency sends PDF reports, not pipeline growth.',
      requirementLabel: 'The Kangqore Standard',
      requirementText: 'We deploy a full-stack growth pod — strategist, media buyer, copywriter, designer, CRO specialist, and analytics lead — to engineer your paid acquisition as a revenue function, not a campaign activity.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Growth Engine',
      statusValue: 'DEPLOYED',
    },
    philosophy: {
      icon: <LineChart className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Revenue-First.',
      titleHighlight: 'Full-Funnel.',
      description: 'We don\'t optimize for vanity metrics. Every campaign is measured against CAC, ROAS, pipeline value, and customer lifetime value. We own the full journey — from ad click to customer conversion.',
      pills: ['ROAS-Focused', 'Multi-Channel', 'Conversion Science', 'Attribution-Led'],
      features: [
        { title: 'Channel Strategy & Media Mix', label: 'Strategy', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Define the optimal channel mix across Google, Meta, LinkedIn, YouTube, and marketplaces based on buyer intent, CAC targets, and sales cycle.' },
        { title: 'Creative & CRO Testing', label: 'Optimization', icon: <Gauge className="w-5 h-5 text-gray-400" />, content: 'Test headlines, hooks, offers, landing pages, forms, and conversion paths with structured frameworks that compound performance.' },
        { title: 'Attribution & Tracking', label: 'Intelligence', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Implement proper tracking, attribution models, pixels, server-side events, and analytics dashboards that show true conversion sources.' },
        { title: 'Scale & Expansion', label: 'Growth', icon: <TrendingUp className="w-5 h-5 text-gray-400" />, content: 'Double down on winning channels, expand into new geographies, test new audiences, and build lifecycle remarketing engines.' },
      ],
    },
    matrix: {
      engineId: 'GROWTH ENGINE™',
      title: 'The Growth Matrix.',
      subtext: 'A structured 5-phase methodology that transforms paid marketing from a campaign activity into a predictable revenue function.',
      layers: [
        { title: 'Audit', id: 'PM_AUDIT', icon: <Search />, desc: 'Account analysis, spend leakage identification, tracking gaps, audience quality assessment, and competitor benchmarking.' },
        { title: 'Architect', id: 'PM_ARCH', icon: <Layers />, desc: 'Channel mix, funnel design, landing pages, campaign structure, KPIs, and measurement architecture.' },
        { title: 'Execute', id: 'PM_EXEC', icon: <Zap />, desc: 'Structured campaign launch with testing across creatives, audiences, keywords, placements, and conversion paths.' },
        { title: 'Optimize', id: 'PM_OPT', icon: <Activity />, desc: 'Bid refinement, audience expansion, creative iteration, CRO improvement, and budget reallocation for maximum ROAS.' },
      ],
    },
    schematic: {
      titleLine1: 'Profitable',
      titleHighlight: 'Growth.',
      description: 'Your media spend should generate compounding returns. We engineer the acquisition systems, attribution frameworks, and optimization loops that make growth predictable.',
      stats: [
        { label: 'ROAS', val: 'MAXIMIZED' },
        { label: 'Pipeline', val: 'CONNECTED' },
        { label: 'Scale', val: 'PREDICTABLE' },
      ],
    },
  },

  trustStrip: 'Trusted by SaaS, ecommerce, healthcare, education, and real estate brands to turn paid media spend into predictable revenue through full-funnel performance systems.',

  whyKangqore: [
    { title: 'Revenue-First Thinking', description: 'We optimize for profitable growth, not inflated vanity metrics. Every campaign is measured against CAC, ROAS, pipeline value, and customer LTV.', icon: DollarSign },
    { title: 'Full-Funnel Ownership', description: 'Ads, landing pages, tracking, remarketing, reporting, and scale — managed together under one growth pod. No finger-pointing between vendors.', icon: Layers },
    { title: 'Multi-Platform Mastery', description: 'Google, Meta, LinkedIn, YouTube, marketplaces, and remarketing channels. We don\'t default to one platform — we go where your buyers are.', icon: Globe },
  ],

  useCases: [
    { name: 'SaaS & Technology', description: 'Demo bookings, trials, product signups, pipeline growth, and MQL generation through intent-led acquisition.', icon: BrainCircuit },
    { name: 'Real Estate', description: 'Property leads, site visits, investor campaigns, local targeting, and CRM-integrated funnels.', icon: Landmark },
    { name: 'Healthcare', description: 'Clinic leads, treatment awareness, elective procedures, and compliant patient acquisition campaigns.', icon: Heart },
    { name: 'Education', description: 'Admissions campaigns, webinar registrations, counseling leads, and course enrollment funnels.', icon: GraduationCap },
    { name: 'Ecommerce & DTC', description: 'Catalog ads, upsells, retargeting, influencer amplification, and checkout optimization.', icon: ShoppingCart },
    { name: 'Finance & Insurance', description: 'Trust-led acquisition, compliant messaging, lead quality controls, and funnel nurturing.', icon: Shield },
  ],

  customFAQs: [
    { question: 'How soon can we see results?', answer: 'Some campaigns show traction within days. Stable learning and scalable performance usually develop within 30–90 days depending on budget, market, and funnel quality.' },
    { question: 'What budget do we need?', answer: 'It depends on your industry, geography, goals, and competition. We recommend budgets based on realistic acquisition economics — not arbitrary minimums.' },
    { question: 'Do you only run ads?', answer: 'No. We improve the entire performance system: ads, creatives, landing pages, tracking, attribution, and conversion flow. Ads without conversion architecture waste budget.' },
    { question: 'Which platforms should we advertise on?', answer: 'We recommend channels based on buyer intent, audience behavior, CAC targets, and sales cycle — not platform preference.' },
    { question: 'Can you work with existing ad accounts?', answer: 'Yes. We can audit, rebuild, optimize, or scale existing accounts without losing historical data or learning.' },
    { question: 'Do you support ecommerce brands?', answer: 'Yes. We manage ecommerce acquisition, catalog growth, remarketing, seasonal scaling, and revenue optimization across platforms.' },
    { question: 'How do you report performance?', answer: 'Through live dashboards, weekly insights, and monthly strategic reviews — all tied to business KPIs like CAC, ROAS, pipeline value, and revenue.' },
    { question: 'What if current campaigns are failing?', answer: 'We diagnose root causes, fix structural issues (tracking, targeting, creative, landing pages), relaunch tests, and rebuild toward profitable growth.' },
  ],

  preMatrixSection: null,
  customSections: [
    <PerfLogoTrustSection key="pm-logo-trust" />,
    <PerformanceChallengesSection key="pm-challenges" />,
    <GrowthPodSection key="pm-pod" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <FivePhaseGrowthMethod />
      <KPIReportingSection />
      <BusinessNeedsSection />
      <PerformanceReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  industries: [
    { name: 'SaaS & Technology', description: 'Demo bookings, trials, product signups, pipeline growth, and MQL generation through intent-led acquisition.', icon: BrainCircuit },
    { name: 'Real Estate', description: 'Property leads, site visits, investor campaigns, local targeting, and CRM-integrated funnels.', icon: Landmark },
    { name: 'Healthcare', description: 'Clinic leads, treatment awareness, elective procedures, and compliant patient acquisition campaigns.', icon: Heart },
    { name: 'Education', description: 'Admissions campaigns, webinar registrations, counseling leads, and course enrollment funnels.', icon: GraduationCap },
    { name: 'Ecommerce & DTC', description: 'Catalog ads, upsells, retargeting, influencer amplification, and checkout optimization.', icon: ShoppingCart },
    { name: 'Finance & Insurance', description: 'Trust-led acquisition, compliant messaging, lead quality controls, and funnel nurturing.', icon: Shield },
  ],

  technologies: [
    { category: 'Ad Platforms', items: ['Google Ads', 'Meta Ads Manager', 'LinkedIn Campaign Manager', 'YouTube Ads', 'TikTok Ads'] },
    { category: 'Analytics & Attribution', items: ['Google Analytics 4', 'Google Tag Manager', 'Meta Pixel', 'LinkedIn Insight Tag', 'Segment'] },
    { category: 'CRO & Landing Pages', items: ['Unbounce', 'Instapage', 'VWO', 'Hotjar', 'Google Optimize'] },
    { category: 'Reporting & BI', items: ['Looker Studio', 'Supermetrics', 'Triple Whale', 'Northbeam', 'Databox'] },
    { category: 'Creative & Testing', items: ['Canva Pro', 'Adobe Creative Suite', 'Figma', 'CapCut', 'Motion'] },
    { category: 'Automation & CRM', items: ['HubSpot', 'Salesforce', 'Zapier', 'Make', 'ActiveCampaign'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'Paid growth services across every major channel. We don\'t default to one platform — we go where your buyers are and build acquisition systems that scale.',
  capabilities: [
    {
      title: 'Google Ads',
      description: 'Search, Shopping, Display, YouTube, demand capture, remarketing, and high-intent lead generation. We build Google campaigns that convert search intent into pipeline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Search & Shopping campaigns', 'Display & YouTube pre-roll', 'Remarketing & RLSA', 'High-intent lead generation'],
      micro: 'Capture demand at the moment of intent.',
    },
    {
      title: 'Meta Ads',
      description: 'Facebook & Instagram acquisition, ecommerce sales, lead forms, retargeting, creative testing, and audience expansion across the Meta ecosystem.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Acquisition & lead forms', 'Ecommerce catalog ads', 'Creative A/B testing', 'Audience expansion & lookalikes'],
      micro: 'Full-funnel Meta execution.',
    },
    {
      title: 'LinkedIn Ads',
      description: 'B2B lead generation, account-based targeting, webinar funnels, executive audience campaigns, and pipeline acceleration for enterprise sales teams.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Account-based targeting', 'Executive audience campaigns', 'Webinar & event funnels', 'Pipeline acceleration'],
      micro: 'B2B pipeline at scale.',
    },
    {
      title: 'YouTube Ads',
      description: 'Awareness-to-conversion video funnels, product explainers, retargeting viewers, branded demand generation, and Shorts campaigns.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Video funnel strategy', 'Product explainer campaigns', 'Viewer retargeting', 'Shorts & demand generation'],
      micro: 'Video that converts.',
    },
    {
      title: 'Marketplace Ads',
      description: 'Amazon, Flipkart, and platform-native sponsored campaigns for product visibility, sales velocity, and category domination.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Amazon Sponsored Products', 'Flipkart Brand Ads', 'Catalog optimization', 'Sales velocity scaling'],
      micro: 'Win the marketplace shelf.',
    },
    {
      title: 'Remarketing Systems',
      description: 'Re-engage abandoned visitors, cart users, video viewers, and dormant leads with precision messaging, dynamic creatives, and cross-platform retargeting.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Cart abandonment recovery', 'Dynamic creative retargeting', 'Cross-platform sequences', 'Dormant lead reactivation'],
      micro: 'No qualified visitor left behind.',
    },
  ],
  trustPillars: [
    { title: 'Revenue-first optimization', tag: 'Revenue', description: 'Every campaign is measured against CAC, ROAS, pipeline value, and customer lifetime value — not clicks or impressions.' },
    { title: 'Full-funnel ownership', tag: 'Ownership', description: 'Ads, landing pages, tracking, remarketing, reporting, and scale — managed together under one growth pod.' },
    { title: 'Multi-platform mastery', tag: 'Channels', description: 'Google, Meta, LinkedIn, YouTube, marketplaces, and remarketing — we go where your buyers are.' },
    { title: 'Conversion science', tag: 'Testing', description: 'Structured testing frameworks across copy, creatives, offers, pages, and audiences that compound performance.' },
    { title: 'Enterprise-grade reporting', tag: 'Reporting', description: 'Live dashboards, weekly insights, and monthly strategic reviews tied to business KPIs.' },
  ],
};

// ─── seo-organic-growth-strategy (Growth) ─────────────────────────────────────
// SLUG NORMALIZATION: legacy data slug was `seo-organic-growth`; canonical
// registry key is `seo-organic-growth-strategy` per Phase G2 PR 2 spec.
const seoOrganicGrowthStrategy = {
  titleLine1: 'SEO Growth',
  titleHighlight: 'Strategy',
  description: 'Stop Renting Traffic. Start Owning Demand. We combine technical SEO, content strategy, on-page optimisation, analytics, and conversion thinking to turn search visibility into a scalable revenue channel.',
  image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?auto=format&fit=crop&w=1260&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Book a Growth Strategy Call', link: '/contact' },
  secondaryButton: { text: 'Request Free SEO Audit', link: '#capabilities' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'Technical', label: '+ Content SEO', color: 'text-brand-blue' },
    { value: 'Revenue', label: 'Focused Strategy', color: 'text-blue-400' },
    { value: 'Transparent', label: 'Reporting & Analytics', color: 'text-cyan-400' },
    { value: 'Long-Term', label: 'Growth Equity', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'ORGANIC GROWTH :: SEARCH VISIBILITY',
      titleLine1: 'Paid traffic is a rental.',
      titleHighlight: 'Organic traffic is an asset.',
      titleLine2: '',
      description: 'Relying solely on performance marketing creates a dangerous dependency on ad spend. Organic growth requires upfront engineering, but yields compounding returns indefinitely. A robust SEO strategy isn’t a marketing tactic; it’s the foundational architecture of digital discovery and sustained market authority.',
      bottleneckLabel: 'The Overload',
      bottleneckText: '68% of online experiences begin with a search engine, yet most enterprise sites fail core technical web vitals and content intent matching.',
      requirementLabel: 'The Advantage',
      requirementText: 'Organic search drives 53% of all site traffic and delivers higher closing rates than outbound leads when mapped to conversion pipelines.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
      statusLabel: 'SEO State',
      statusValue: 'OPTIMIZING',
    },
    philosophy: {
      icon: <Search className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our Execution',
      titleHighlight: 'Philosophy.',
      description: 'We treat SEO as an engineering discipline. We don’t guess. We audit deeply, structure aggressively, and create content that establishes undeniable topical authority.',
      pills: ['Technical Audit', 'Content Architecture', 'Link Velocity', 'Core Web Vitals'],
      features: [
        { title: 'Technical SEO Engineering', label: 'Architecture', icon: <Zap className="w-5 h-5 text-gray-400" />, content: 'Site speed, crawlability, schema markup, JS rendering, and advanced architecture.' },
        { title: 'Content Authority', label: 'Relevance', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'High-fidelity keyword mapping, semantic clustering, and cornerstone content.' },
        { title: 'Off-Page Footprint', label: 'Trust', icon: <Globe className="w-5 h-5 text-gray-400" />, content: 'High-authority backlink development and digital PR syndication.' },
        { title: 'Analytics & Reporting', label: 'Intelligence', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Granular tracking of rankings, traffic value, and conversion attribution.' },
      ],
    },
    matrix: {
      engineId: 'SEO ENGINE™',
      title: 'Core Delivery Pillars.',
      subtext: 'The architectural framework for total search dominance and organic compounding growth.',
      layers: [
        { title: 'Technical', id: 'SEO_TECH', icon: <Zap />, desc: 'Resolving crawl issues, indexation, speed bottlenecks, and structural flaws.' },
        { title: 'Content', id: 'SEO_CONT', icon: <PenTool />, desc: 'Building semantic clusters and cornerstone assets that answer user intent.' },
        { title: 'Authority', id: 'SEO_AUTH', icon: <Shield />, desc: 'Acquiring high-DR links, brand mentions, and digital PR placements.' },
        { title: 'Analytics', id: 'SEO_ANAL', icon: <BarChart3 />, desc: 'Connecting organic traffic directly to pipeline and business revenue.' },
      ],
    },
    schematic: {
      titleLine1: 'Structural',
      titleHighlight: 'Optimization.',
      description: 'True organic growth isn\'t about chasing algorithms; it\'s about answering user intent better than anyone else while ensuring your site architecture makes that content accessible to search engines.',
      stats: [
        { label: 'Visibility', val: 'MAXIMIZED' },
        { label: 'Intent', val: 'CAPTURED' },
        { label: 'Traffic', val: 'COMPOUNDING' },
      ],
    },
  },

  trustStrip: 'Empowering enterprises to build defensible, compounding organic traffic moats across complex competitive landscapes.',

  whyKangqore: [
    { title: 'Revenue-Focused Strategy', description: 'We optimize for leads, pipeline, and growth — not just empty vanity metrics like impressions.', icon: DollarSign },
    { title: 'Custom Roadmaps', description: 'Every strategy is built around your unique business model, buyer journey, and market realities.', icon: Target },
    { title: 'Strong Technical Capability', description: 'We solve the structural problems and complex indexing issues that many agencies overlook.', icon: Zap },
  ],

  useCases: [
    { name: 'SaaS & Technology', description: 'Capture demand across problem-aware, solution-aware, and comparison searches.', icon: BrainCircuit },
    { name: 'Healthcare', description: 'Local visibility, treatment awareness, and high-trust patient acquisition.', icon: Heart },
    { name: 'Real Estate', description: 'Property searches, local maps visibility, and investor lead generation.', icon: Landmark },
    { name: 'E-commerce', description: 'Grow category, product, and high-intent search traffic for online stores.', icon: ShoppingCart },
    { name: 'Education', description: 'Program discovery, admissions traffic, and authoritative content scaling.', icon: GraduationCap },
    { name: 'Professional Services', description: 'Establish thought leadership, drive B2B inquiries, and dominate niche terms.', icon: Briefcase },
  ],

  customFAQs: [
    { question: 'How long does SEO take to show results?', answer: 'Some technical and on-page improvements can create early momentum quickly. Strong compounding growth usually builds over 3–6 months depending on competition and market conditions.' },
    { question: 'Do you guarantee rankings?', answer: 'No credible SEO partner guarantees rankings due to search engine algorithm independence. We guarantee disciplined execution, strategic clarity, and measurable progress.' },
    { question: 'Can SEO generate leads?', answer: 'Yes. When SEO targets commercial intent and provides strong landing experiences, it can become a powerful, highly-qualified lead generation channel.' },
    { question: 'Is SEO better than paid ads?', answer: 'They solve different problems. Paid drives immediate traffic; SEO builds long-term demand ownership. The strongest acquisition strategies often use both in tandem.' },
    { question: 'How do you interface with our existing development teams?', answer: 'We provide execution-ready tickets (Jira/Azure) detailing exactly what code needs to change, why, and how to verify it, acting as an extension of your product engineering cycle.' },
    { question: 'Do you work with growing businesses and enterprises?', answer: 'Yes. We work with ambitious startups, scaling companies, and established enterprise brands managing complex multi-national architectures.' },
  ],

  preMatrixSection: null,
  customSections: [
    <SEOLogoTrustSection key="logo-trust" />,
    <SEOChallengesSection key="seo-challenges" />,
    <WhySEOMattersSection key="why-seo-matters" />,
    <SEOGrowthPodSection key="seo-pod" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <FourPhaseGrowthMethod />
      <SEOSuccessSection />
      <SEOReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  industries: [
    { name: 'SaaS & Technology', description: 'Capture demand across problem-aware, solution-aware, and comparison searches.', icon: BrainCircuit },
    { name: 'Healthcare', description: 'Local visibility, treatment awareness, and high-trust patient acquisition.', icon: Heart },
    { name: 'Real Estate', description: 'Property searches, local maps visibility, and investor lead generation.', icon: Landmark },
    { name: 'E-commerce', description: 'Grow category, product, and high-intent search traffic for online stores.', icon: ShoppingCart },
    { name: 'Education', description: 'Program discovery, admissions traffic, and authoritative content scaling.', icon: GraduationCap },
    { name: 'Professional Services', description: 'Establish thought leadership, drive B2B inquiries, and dominate niche terms.', icon: Briefcase },
  ],

  technologies: [
    { category: 'Technical SEO', items: ['Screaming Frog', 'Sitebulb', 'Google Search Console', 'DeepCrawl', 'Lighthouse'] },
    { category: 'Keyword & Market Intel', items: ['Ahrefs', 'SEMrush', 'Moz', 'Google Keyword Planner', 'AnswerThePublic'] },
    { category: 'Content & On-Page', items: ['Surfer SEO', 'Clearscope', 'MarketMuse', 'Frase', 'Grammarly Business'] },
    { category: 'Local SEO', items: ['BrightLocal', 'Yext', 'Whitespark', 'Google Business Profile'] },
    { category: 'Analytics & Reporting', items: ['Google Analytics 4', 'Looker Studio', 'Supermetrics', 'BigQuery', 'Adobe Analytics'] },
    { category: 'CRO & UX', items: ['Hotjar', 'Crazy Egg', 'VWO', 'Microsoft Clarity', 'Optimizely'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'Integrated SEO execution across strategy, technical foundations, content authority, migration protection, and local visibility—built to compound organic growth.',
  capabilities: [
    {
      title: 'SEO Strategy & Analytics',
      description: 'We build data-led SEO roadmaps backed by search demand, competitor intelligence, performance analytics, and commercial priorities—so every action ties to measurable growth.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Search demand mapping', 'Competitor benchmarking', 'Performance roadmaps', 'Revenue attribution'],
      micro: 'Data-driven execution.',
    },
    {
      title: 'Keyword Research Services',
      description: 'Identify high-intent, high-opportunity keywords across the full buyer journey. We map opportunities that attract qualified traffic and convert into pipeline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Commercial intent mapping', 'Long-tail identification', 'Keyword gap analysis', 'Search volume tracking'],
      micro: 'Capture high-intent demand.',
    },
    {
      title: 'SEO Audit Services',
      description: 'Uncover technical blockers, content gaps, crawl inefficiencies, and structural issues that suppress rankings. We turn hidden problems into growth opportunities.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Technical site crawls', 'Indexation analysis', 'Penalty recovery', 'Architecture review'],
      micro: 'Uncover growth barriers.',
    },
    {
      title: 'On-Page SEO Services',
      description: 'Optimise pages for relevance, intent alignment, engagement, and conversion. From metadata to internal links, every element is engineered to perform.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Intent matching', 'Metadata optimization', 'Internal link structuring', 'UX/UI enhancements'],
      micro: 'Make every page count.',
    },
    {
      title: 'Off-Page SEO Services',
      description: 'Strengthen authority through high-quality backlinks, digital mentions, trust signals, and reputation-building strategies that improve rankings sustainably.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['High-DR link building', 'Digital PR placements', 'Brand mention acquisition', 'Trust signal scaling'],
      micro: 'Build domain authority.',
    },
    {
      title: 'SEO Content Services',
      description: 'Create search-led content ecosystems that educate buyers, capture demand, and build topical authority—far beyond publishing random blogs.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Topic cluster mapping', 'Pillar content creation', 'Editorial calendars', 'Content gap filling'],
      micro: 'Answer the user\'s needs.',
    },
    {
      title: 'Blogging / Digital PR Services',
      description: 'Expand reach with strategic storytelling, media placements, industry mentions, and thought leadership content that earns visibility and credibility.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Media syndication', 'Thought leadership', 'Press release distribution', 'Influencer outreach'],
      micro: 'Earn industry visibility.',
    },
    {
      title: 'Mobile SEO',
      description: 'Optimise mobile experience, speed, UX signals, and technical performance for the devices where most search journeys now begin.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Mobile-first indexing', 'Core Web Vitals', 'Responsive design audits', 'Touch target optimization'],
      micro: 'Dominate mobile search.',
    },
    {
      title: 'Website Migration',
      description: 'Protect rankings, traffic, and authority during redesigns, domain moves, or platform changes with structured migration planning and zero-chaos execution.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['URL mapping strategy', '301 redirect implementation', 'Pre-launch testing', 'Post-migration monitoring'],
      micro: 'Zero-chaos transitions.',
    },
    {
      title: 'Local SEO',
      description: 'Win local search visibility through Google Business optimisation, location pages, reviews strategy, and map-pack dominance that drives real footfall and leads.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Google Business optimization', 'Local citation syndication', 'Review management', 'Hyperlocal keywords'],
      micro: 'Dominate your geography.',
    },
  ],
  trustPillars: [
    { title: 'Total Codebase Transparency', tag: 'Technical Focus', description: 'We embed with your dev teams to ensure SEO recommendations actually meet deployment standards.' },
    { title: 'Conversion-Led Strategy', tag: 'Intent Mapping', description: 'We optimize for revenue-driving transactional search intent, not just empty vanity traffic.' },
    { title: 'Algorithmic Resilience', tag: 'Future-Proof', description: 'Our white-hat strategies are built to withstand and benefit from continuous core algorithm updates.' },
    { title: 'Advanced Analytics', tag: 'Data Science', description: 'Deep quantitative analysis tying organic position lifts directly to pipeline creation and lead velocity.' },
  ],
};

// ─── growth-funnels-conversion-engineering (Growth) ───────────────────────────
const growthFunnelsConversionEngineering = {
  titleLine1: 'Growth Funnels &',
  titleHighlight: 'Conversion Engineering.',
  description: 'Kangqore transforms attention into measurable commercial outcomes through precision Growth Funnel Architecture and Conversion Engineering. We redesign customer decision journeys using behavioral science, advanced experimentation, AI-led optimisation, and full-funnel analytics.',
  image: '/images/growth-funnel-revenue-engineering.png',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Engineer Your Revenue Engine', link: '/contact' },
  secondaryButton: { text: 'Claim Your Custom Revenue Leakage Audit (Value: $2,500)', link: '/contact' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'Full-Funnel', label: 'Revenue Architecture', color: 'text-brand-blue' },
    { value: 'AI-Augmented', label: 'Conversion Optimisation', color: 'text-blue-400' },
    { value: 'Higher LTV', label: '& Lower CAC Focus', color: 'text-cyan-400' },
    { value: 'Scalable', label: 'Profitability', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'GROWTH FUNNELS :: CRO :: REVENUE ENGINEERING',
      titleLine1: 'Engineering Growth Funnels That',
      titleHighlight: 'Do Not Leak Revenue.',
      titleLine2: '',
      description: 'In today\'s market, traffic is only the starting point. Kangqore transforms attention into measurable commercial outcomes through precision Growth Funnel Architecture and Conversion Engineering—helping ambitious brands increase conversion, improve efficiency, and scale revenue with confidence.',
      bottleneckLabel: 'The Problem',
      bottleneckText: 'Most agencies optimise campaigns. They focus on clicks and impressions while revenue leaks through broken funnels, weak nurture, and friction-filled journeys.',
      requirementLabel: 'The Solution',
      requirementText: 'We engineer commercial systems. Every stage of the customer journey is designed, tested, and optimised to convert demand into measurable revenue.',
      image: '/images/growth-funnel-revenue-engineering.png',
      statusLabel: 'Funnel State',
      statusValue: 'SCALING',
    },
    philosophy: {
      icon: <Filter className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our Revenue',
      titleHighlight: 'Engineering Philosophy.',
      description: 'We treat marketing as an engineering discipline. We combine behavioral science, experimentation rigor, AI intelligence, and revenue-first execution to build growth engines that outperform generic marketing models.',
      pills: ['Behavioral Science', 'Experimentation', 'AI Optimisation', 'Full-Funnel Analytics'],
      features: [
        { title: 'Funnel Diagnostics', label: 'Audit', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'We dissect the entire customer journey using analytics, session recordings, heatmaps, and behavioral data to identify hidden leakage points.' },
        { title: 'Hypothesis Engine', label: 'Science', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'We run structured A/B, multivariate, and sequential testing programs with commercial KPIs at the centre of every decision.' },
        { title: 'CRO & UX Engineering', label: 'Conversion', icon: <MonitorPlay className="w-5 h-5 text-gray-400" />, content: 'We redesign landing pages, product flows, forms, and checkout systems to increase action rates.' },
        { title: 'AI Personalisation', label: 'Scale', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'Your funnel adapts dynamically based on audience segment, behavior, and context for real-time experience adaptation.' },
      ],
    },
    matrix: {
      engineId: 'REVENUE ENGINE™',
      title: 'Core Delivery Pillars.',
      subtext: 'The architectural framework for total conversion dominance and scalable revenue growth.',
      layers: [
        { title: 'Attract', id: 'FUNNEL_ATTRACT', icon: <Target />, desc: 'Acquiring the right audience through precision paid, organic, and signal-mapped channels.' },
        { title: 'Engage', id: 'FUNNEL_ENGAGE', icon: <Layers />, desc: 'Turning attention into trust through personalised journeys and high-converting experiences.' },
        { title: 'Convert', id: 'FUNNEL_CONVERT', icon: <Activity />, desc: 'Reducing friction and increasing action through CRO, testing, and checkout optimisation.' },
        { title: 'Expand', id: 'FUNNEL_EXPAND', icon: <Rocket />, desc: 'Growing revenue after conversion through onboarding, upsell, and retention systems.' },
      ],
    },
    schematic: {
      titleLine1: 'Revenue-First',
      titleHighlight: 'Architecture.',
      description: 'True growth engineering removes every obstacle between your prospect and their desired outcome, leveraging behavioral science and AI to accelerate decision making at every stage.',
      stats: [
        { label: 'Conversion', val: 'MAXIMIZED' },
        { label: 'Friction', val: 'REMOVED' },
        { label: 'Revenue', val: 'SCALING' },
      ],
    },
  },

  trustStrip: 'Helping growth-stage brands, enterprises, SaaS companies, ecommerce businesses, and challenger brands convert more of the demand they already generate.',

  whyKangqore: [
    { title: 'Revenue-First Execution', description: 'Every recommendation is measured against commercial impact—not vanity metrics.', icon: DollarSign },
    { title: 'Full-System Thinking', description: 'We optimise acquisition, conversion, retention, and expansion together as one connected system.', icon: Layers },
    { title: 'Scientific Rigor', description: 'Structured experimentation replaces guesswork. Every change is validated through data.', icon: Activity },
    { title: 'AI-Native Advantage', description: 'Modern automation and intelligence increase speed, precision, and personalisation at scale.', icon: BrainCircuit },
    { title: 'Transparent Visibility', description: 'Clear dashboards. Clear priorities. Clear outcomes. Full operational visibility at every stage.', icon: Eye },
    { title: 'Built for Ambitious Brands', description: 'Designed for businesses that want scalable growth—not incremental tweaks.', icon: Rocket },
  ],

  useCases: [
    { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
    { name: 'Ecommerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
    { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
    { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
    { name: 'Education', description: 'Increase student enrollment applications and optimise course discovery.', icon: GraduationCap },
    { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
    { name: 'Professional Services', description: 'Improve lead quality, optimise form submissions, and deploy automated nurturing.', icon: Briefcase },
    { name: 'Consumer Brands', description: 'Build brand-to-purchase funnels that maximise awareness-to-conversion rates.', icon: Globe },
    { name: 'B2B Enterprises', description: 'Engineer complex multi-touch funnels for consultative sales cycles.', icon: Users },
    { name: 'Local Growth Businesses', description: 'Drive local leads through optimised landing pages and map-based funnels.', icon: Target },
  ],

  customFAQs: [
    { question: 'What is Growth Funnel & Conversion Engineering?', answer: 'It is the structured design and optimisation of the entire customer journey so more demand converts into measurable revenue. We combine behavioral science, experimentation, and AI to engineer every stage of the funnel.' },
    { question: 'How is this different from standard marketing services?', answer: 'Traditional marketing often focuses on traffic or awareness. We focus on revenue efficiency, conversion performance, and lifetime value—engineering the full commercial system, not just individual campaigns.' },
    { question: 'Can you work with existing campaigns and funnels?', answer: 'Yes. We can audit, optimise, rebuild, or scale your current systems. Our diagnostic process identifies the highest-leverage opportunities within your existing infrastructure.' },
    { question: 'How quickly can results improve?', answer: 'Some gains happen quickly through friction removal and quick wins. Larger improvements typically compound over 30–90 days depending on traffic volume and market conditions.' },
    { question: 'Do you support B2B and B2C models?', answer: 'Yes. We build systems for ecommerce, SaaS, lead generation, consultative sales, and service businesses across both B2B and B2C markets.' },
    { question: 'What metrics do you track?', answer: 'CAC, CVR, CPL, ROAS, lead quality, pipeline value, retention, LTV, and revenue by channel. Every metric ties directly to commercial outcomes.' },
  ],

  preMatrixSection: null,
  customSections: [
    <FunnelLogoTrustSection key="funnel-logo-trust" />,
    <FunnelChallengesSection key="funnel-challenges" />,
    <WhyFunnelsMatterSection key="why-funnels-matter" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <FourPhaseFunnelMethod />
      <FunnelSuccessSection />
      <FunnelReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  industries: [
    { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
    { name: 'Ecommerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
    { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
    { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
    { name: 'Education', description: 'Increase student enrollment applications and optimise course discovery.', icon: GraduationCap },
    { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
    { name: 'Professional Services', description: 'Improve lead quality, optimise form submissions, and deploy automated nurturing.', icon: Briefcase },
    { name: 'Consumer Brands', description: 'Build brand-to-purchase funnels that maximise awareness-to-conversion rates.', icon: Globe },
    { name: 'B2B Enterprises', description: 'Engineer complex multi-touch funnels for consultative sales cycles.', icon: Users },
    { name: 'Local Growth Businesses', description: 'Drive local leads through optimised landing pages and map-based funnels.', icon: Target },
  ],

  technologies: [
    { category: 'A/B Testing & CRO', items: ['VWO', 'Optimizely', 'Google Optimize', 'Convert', 'Omniconvert'] },
    { category: 'Behavioral Analytics', items: ['Hotjar', 'Crazy Egg', 'Microsoft Clarity', 'FullStory', 'Mouseflow'] },
    { category: 'Product Analytics', items: ['Mixpanel', 'Amplitude', 'Heap', 'PostHog'] },
    { category: 'Landing Page Builders', items: ['Unbounce', 'Instapage', 'Webflow', 'Framer', 'React / Next.js'] },
    { category: 'Marketing Automation', items: ['HubSpot', 'ActiveCampaign', 'Marketo', 'Klaviyo', 'Pardot'] },
    { category: 'Core Analytics', items: ['Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Segment'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'In 2026, traffic alone does not drive growth. Insight-led, conversion-focused systems do. Kangqore combines behavioral science, experimentation rigor, AI intelligence, and revenue-first execution.',
  capabilities: [
    {
      title: 'Full-Funnel Diagnostics & Forensic Audit',
      description: 'We dissect the entire customer journey using analytics, session recordings, heatmaps, funnel tracking, and behavioral data to identify hidden leakage points.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Funnel leakage mapping', 'Journey-stage performance analysis', 'Attribution gap discovery', 'UX friction detection', 'Revenue opportunity prioritisation'],
      micro: 'Find every leak.',
    },
    {
      title: 'Behavioral Science & Heuristic Analysis',
      description: 'We uncover why users hesitate, abandon, delay, or convert by combining psychology frameworks with real user insight.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['User motivation analysis', 'Trust & objection mapping', 'Decision-friction diagnostics', 'Persuasion architecture planning', 'Behavior-led hypothesis creation'],
      micro: 'Understand the why.',
    },
    {
      title: 'Hypothesis-Driven Experimentation Engine',
      description: 'We run structured A/B, multivariate, and sequential testing programs with commercial KPIs at the centre of every decision.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Testing roadmap creation', 'Variant design & deployment', 'Statistical decision frameworks', 'AI-assisted idea prioritisation', 'Continuous learning loops'],
      micro: 'Test with rigor.',
    },
    {
      title: 'CRO & UX Engineering',
      description: 'We redesign landing pages, product flows, forms, checkout systems, and onboarding experiences to increase action rates.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Landing page optimisation', 'Checkout friction removal', 'Micro-copy improvement', 'Trust signal enhancement', 'Faster path-to-conversion design'],
      micro: 'Maximise action.',
    },
    {
      title: 'AI-Powered Personalisation at Scale',
      description: 'Your funnel adapts dynamically based on audience segment, behavior, and context for maximum relevance.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Dynamic content journeys', 'Segment-based experiences', 'Predictive recommendations', 'Intent-responsive messaging', 'Real-time experience adaptation'],
      micro: 'Personalise at scale.',
    },
    {
      title: 'Growth Funnel Architecture (AARRR + Growth Loops)',
      description: 'We engineer the full lifecycle from acquisition to advocacy using modern growth frameworks.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Acquisition system design', 'Activation flow optimisation', 'Retention loops', 'Monetisation systems', 'Referral & virality frameworks'],
      micro: 'Engineer the lifecycle.',
    },
    {
      title: 'Post-Conversion & Lifetime Value Optimisation',
      description: 'We continue optimisation after purchase to maximise revenue and reduce churn.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Onboarding journeys', 'Expansion revenue systems', 'Reactivation campaigns', 'Loyalty mechanics', 'Retention performance modelling'],
      micro: 'Grow after conversion.',
    },
    {
      title: 'Enterprise-Grade Tech Integration & Dashboards',
      description: 'We integrate with your existing stack and create full operational visibility across the funnel.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['GA4 & analytics integration', 'CRM connectivity', 'Martech workflow integration', 'Executive dashboards', 'Real-time growth intelligence'],
      micro: 'Full visibility.',
    },
  ],
  trustPillars: [
    { title: 'Revenue-First Execution', tag: 'Commercial Focus', description: 'Every recommendation is measured against commercial impact—not vanity metrics or isolated page improvements.' },
    { title: 'Full-System Thinking', tag: 'End-to-End', description: 'We optimise acquisition, conversion, retention, and expansion together as one connected revenue system.' },
    { title: 'Scientific Rigor', tag: 'Data Science', description: 'Structured experimentation replaces guesswork. We wait for statistical significance before declaring winners.' },
    { title: 'AI-Native Advantage', tag: 'Modern Intelligence', description: 'Modern automation and intelligence increase speed, precision, and personalisation across the entire funnel.' },
  ],
};

// ─── conversion-rate-optimization (Growth) ────────────────────────────────────
const conversionRateOptimization = {
  titleLine1: 'Conversion Rate',
  titleHighlight: 'Optimization.',
  description: 'Kangqore transforms underperforming websites, landing pages, and funnels into high-converting revenue systems using behavioral science, UX engineering, and data-driven experimentation.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Engineer My Revenue Engine', link: '/contact' },
  secondaryButton: { text: 'Deploy Free Conversion Audit', link: '/contact' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'Data-Driven', label: 'CRO Strategy', color: 'text-brand-blue' },
    { value: 'UX + Psychology', label: 'Engineering', color: 'text-blue-400' },
    { value: 'A/B & Multivariate', label: 'Testing', color: 'text-cyan-400' },
    { value: 'Built for', label: 'Revenue Growth', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'CRO :: REVENUE PERFORMANCE',
      titleLine1: 'Turn Existing Traffic Into',
      titleHighlight: 'Measurable Revenue.',
      titleLine2: '',
      description: 'Most businesses don’t need more traffic. They need better conversion. We don’t guess. We test, validate, and scale what drives real business outcomes.',
      bottleneckLabel: 'The Problem',
      bottleneckText: 'You attract users — but fail to convert them due to hidden friction and poor journey architecture.',
      requirementLabel: 'The Solution',
      requirementText: 'Engineered conversion systems that identify drop-offs and build targeted pathways to convert demand into revenue.',
      image: '/images/cro_revenue_optimization.png',
      statusLabel: 'CRO State',
      statusValue: 'OPTIMIZING',
    },
    philosophy: {
      icon: <Activity className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our Conversion',
      titleHighlight: 'Philosophy.',
      description: 'We treat conversion optimization as an engineering discipline. We combine behavioral science, experimentation rigor, and revenue-first execution to build growth engines that outperform generic design models.',
      pills: ['Behavioral Science', 'Experimentation', 'Data-Driven UX', 'Continuous Iteration'],
      features: [
        { title: 'User Behavior', label: 'Analysis', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'We analyze how users actually interact — not how you think they behave — using heatmaps and session recordings.' },
        { title: 'A/B Testing', label: 'Validation', icon: <TrendingUp className="w-5 h-5 text-gray-400" />, content: 'We run structured experiments, validating every change with statistical significance to replace guesswork.' },
        { title: 'UX Engineering', label: 'Conversion', icon: <MousePointer2 className="w-5 h-5 text-gray-400" />, content: 'We redesign experiences for action with clear value propositions, trust signals, and frictionless UI/UX.' },
        { title: 'Personalization', label: 'Scale', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'We deliver the right message to the right user through behavioral segmentation and dynamic content.' },
      ],
    },
    matrix: {
      engineId: 'CONVERSION SYSTEM™',
      title: 'Core CRO Pillars.',
      subtext: 'The architectural framework for total conversion dominance and frictionless revenue flow.',
      layers: [
        { title: 'Analyze', id: 'CRO_ANALYZE', icon: <Search />, desc: 'Understanding user behavior through heatmaps, session recordings, and drop-off diagnostics.' },
        { title: 'Hypothesize', id: 'CRO_HYPOTHESIZE', icon: <BrainCircuit />, desc: 'Formulating data-backed ideas based on behavioral science and conversion heuristics.' },
        { title: 'Engineer', id: 'CRO_ENGINEER', icon: <Settings />, desc: 'Redesigning landing pages, forms, and checkouts to eliminate friction and cognitive load.' },
        { title: 'Test', id: 'CRO_TEST', icon: <Activity />, desc: 'Validating every change with rigorous A/B and multivariate testing for statistical certainty.' },
      ],
    },
    schematic: {
      titleLine1: 'Frictionless',
      titleHighlight: 'Experience.',
      description: 'True growth engineering removes every obstacle between your prospect and their desired outcome, leveraging behavioral science to accelerate decision making at every stage.',
      stats: [
        { label: 'Conversion', val: 'MAXIMIZED' },
        { label: 'Friction', val: 'REMOVED' },
        { label: 'Revenue', val: 'SCALED' },
      ],
    },
  },

  trustStrip: 'Helping ambitious brands scale profitability by turning more of their existing traffic into measurable revenue.',

  whyKangqore: [
    { title: 'Revenue-First Thinking', description: 'Every decision and hypothesis is strictly tied to ROI and commercial impact.', icon: DollarSign },
    { title: 'Deep Behavioral Insight', description: 'We don’t just track clicks; we understand the psychology of why users convert.', icon: BrainCircuit },
    { title: 'Full-Funnel Ownership', description: 'We optimize the entire customer journey, not just isolated landing pages.', icon: Layers },
    { title: 'Faster Experimentation', description: 'Our agile testing frameworks mean more tests, faster learnings, and quicker wins.', icon: Zap },
    { title: 'Enterprise Execution', description: 'Built for scale, performance, and precision engineering across complex stacks.', icon: Rocket },
    { title: 'Scientific Rigor', description: 'We rely on statistical significance, eliminating costly guesswork.', icon: Activity },
  ],

  useCases: [
    { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
    { name: 'E-commerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
    { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
    { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
    { name: 'Education', description: 'Increase student enrollment applications and optimise course discovery.', icon: GraduationCap },
    { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
    { name: 'Professional Services', description: 'Improve lead quality, optimise form submissions, and deploy automated nurturing.', icon: Briefcase },
  ],

  customFAQs: [
    { question: 'What is Conversion Rate Optimization (CRO)?', answer: 'CRO is the systematic process of increasing the percentage of website visitors who take a desired action—be that filling out a form, becoming customers, or otherwise. We use behavioral science and A/B testing to achieve this.' },
    { question: 'How is Kangqore different from standard CRO agencies?', answer: 'Most agencies focus on button colors or minor tweaks. We engineer full commercial systems. We combine behavioral psychology, advanced data telemetry, and rigorous experimentation to drive measurable revenue, not just vanity metrics.' },
    { question: 'How long does it take to see results from CRO?', answer: 'While we often find "quick wins" by removing obvious friction points within the first 30 days, a structured testing program compounds its value over 3–6 months as we validate larger hypotheses and scale winning variations.' },
    { question: 'How much traffic do I need to conduct A/B testing?', answer: 'To reach statistical significance promptly, we typically look for at least 10,000 unique visitors per month on the specific pages being tested. However, lower-traffic sites can still benefit immensely from heuristic and behavioral UX improvements.' },
    { question: 'Do you design and code the variations?', answer: 'Yes. We are full-stack execution partners. Our team includes specialized CRO designers, front-end engineers, and QA specialists who handle the entire process from hypothesis to deployed variation.' },
  ],

  preMatrixSection: null,
  customSections: [
    <CROLogoTrustSection key="cro-logo-trust" />,
    <CROChallengesSection key="cro-challenges" />,
    <WhyCROMattersSection key="why-cro-matters" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <SixPhaseCROMethod />
      <CROSuccessSection />
      <CROReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  industries: [
    { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
    { name: 'E-commerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
    { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
    { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
    { name: 'Education', description: 'Increase student enrollment applications and optimise course discovery.', icon: GraduationCap },
    { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
    { name: 'Professional Services', description: 'Improve lead quality, optimise form submissions, and deploy automated nurturing.', icon: Briefcase },
  ],

  technologies: [
    { category: 'A/B Testing & CRO', items: ['VWO', 'Optimizely', 'Google Optimize', 'Convert', 'Omniconvert'] },
    { category: 'Behavioral Analytics', items: ['Hotjar', 'Crazy Egg', 'Microsoft Clarity', 'FullStory', 'Mouseflow'] },
    { category: 'Product Analytics', items: ['Mixpanel', 'Amplitude', 'Heap', 'PostHog'] },
    { category: 'Landing Page Builders', items: ['Unbounce', 'Instapage', 'Webflow', 'Framer', 'React / Next.js'] },
    { category: 'Marketing Automation', items: ['HubSpot', 'ActiveCampaign', 'Marketo', 'Klaviyo', 'Pardot'] },
    { category: 'Core Analytics', items: ['Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Segment'] },
  ],

  capabilitiesTitle: 'Built for Scalable Conversion Growth.',
  capabilitiesDescription: 'In 2026, relying on guesswork is expensive. Our CRO systems merge deep psychological research, rigorous quantitative analytics, and continuous multivariate testing to systematically convert friction into revenue flow.',
  capabilities: [
    {
      title: 'Full Funnel CRO Strategy',
      description: 'Align acquisition, landing pages, and conversion paths into one seamless, high-converting system.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Cross-channel alignment', 'End-to-end journey mapping', 'Attribution gap discovery', 'Revenue pipeline modeling', 'Consistent messaging architecture'],
      micro: 'Unify the journey.',
    },
    {
      title: 'Landing Page Optimization',
      description: 'Design dedicated pages that guide, persuade, and convert high-intent traffic with maximum efficiency.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Dynamic message matching', 'Persuasion architecture', 'Trust signal enhancement', 'Cognitive load reduction', 'Mobile-first conversion design'],
      micro: 'Convert the click.',
    },
    {
      title: 'Checkout & Form Optimization',
      description: 'Reduce friction and cognitive barriers to increase completion rates at the most critical stage of the funnel.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Field reduction & flow logic', 'Inline validation & error handling', 'Trust and security badging', 'Multi-step form psychology', 'Cart abandonment recovery'],
      micro: 'Remove friction.',
    },
    {
      title: 'E-commerce CRO',
      description: 'Improve product discovery, streamline cart flow, and engineer pathways for repeat purchases.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Product page (PDP) enhancements', 'Search & filtering optimization', 'Cross-sell / upsell mechanics', 'Post-purchase loyalty loops', 'Average Order Value (AOV) growth'],
      micro: 'Scale retail revenue.',
    },
    {
      title: 'SaaS Conversion Optimization',
      description: 'Drive more qualified demos, free trials, product activation, and premium tier upgrades.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['Trial-to-paid conversion', 'Frictionless onboarding flows', 'Feature adoption triggers', 'Pricing page psychology', 'Churn reduction systems'],
      micro: 'Accelerate adoption.',
    },
    {
      title: 'CRO for Lead Generation',
      description: 'Increase the volume of highly qualified sales leads—not just cheap, low-intent form fills.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Lead qualification matrices', 'Interactive calculators & quizzes', 'B2B consultative funnels', 'Gated asset optimization', 'Lead scoring integration'],
      micro: 'Generate quality.',
    },
    {
      title: 'Heatmaps & Analytics Integration',
      description: 'See exactly where performance breaks with advanced behavioral tracking and session deep-dives.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Scroll & click heatmapping', 'Rage-click diagnostics', 'Session recording analysis', 'GA4 funnel tracking', 'Event taxonomy architecture'],
      micro: 'Visualize behavior.',
    },
    {
      title: 'AI-Powered Optimization',
      description: 'Use predictive insights and machine learning to automate testing and dynamically personalize experiences.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Predictive audience segmentation', 'Dynamic content serving', 'Automated multivariate testing', 'Intent-based personalization', 'Real-time offer adaptation'],
      micro: 'Optimize with AI.',
    },
  ],
  trustPillars: [
    { title: 'Revenue-First Execution', tag: 'Commercial Focus', description: 'Every recommendation is measured against commercial impact—not vanity metrics or isolated page improvements.' },
    { title: 'Full-System Thinking', tag: 'End-to-End', description: 'We optimise acquisition, conversion, retention, and expansion together as one connected revenue system.' },
    { title: 'Scientific Rigor', tag: 'Data Science', description: 'Structured experimentation replaces guesswork. We wait for statistical significance before declaring winners.' },
    { title: 'AI-Native Advantage', tag: 'Modern Intelligence', description: 'Modern automation and intelligence increase speed, precision, and personalisation across the entire funnel.' },
  ],
  ctaTitle: 'Stop Leaving Revenue on the Table.',
  ctaDescription: 'Turn passive traffic into high-yield commercial outcomes. Our engineers are ready to audit your funnel for friction, cognitive load, and revenue leakage.',
  ctaButtonText: 'Start My Conversion Engineering',
  ctaSecondaryButton: { text: 'Claim Performance Blueprint', link: '/contact' },
};

// ─── campaign-planning (Growth) ───────────────────────────────────────────────
// Per spec: legacy `name: 'Campaign Planning'` differs from the hero treatment
// `titleLine1: 'Growth Campaign' + titleHighlight: 'Architecture.'` — we
// preserve the legacy hero treatment per locked decision #2.
const campaignPlanning = {
  titleLine1: 'Growth Campaign',
  titleHighlight: 'Architecture.',
  description: 'We design campaign systems that connect objective, audience, message, funnel, channel, budget, creative direction, analytics, and optimization into one execution-ready growth architecture.',
  image: '/images/campaign-growth-architecture.png',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Build My Campaign Blueprint', link: '/contact' },
  secondaryButton: { text: 'Request Campaign Audit', link: '/contact' },
  hideGenericMidPageCta: true,

  stats: [
    { value: 'Outcome-Led', label: 'Strategy', color: 'text-brand-blue' },
    { value: 'Full-Funnel', label: 'Planning', color: 'text-blue-400' },
    { value: 'Media + Budget', label: 'Logic', color: 'text-cyan-400' },
    { value: 'Tracking-Ready', label: 'Execution', color: 'text-brand-blue' },
  ],

  highFidelity: {
    narrative: {
      badge: 'CAMPAIGN :: GROWTH ARCHITECTURE',
      titleLine1: 'Plan Campaigns That Convert',
      titleHighlight: 'Before You Spend.',
      titleLine2: '',
      description: 'Most brands start campaigns with creatives. Kangqore starts with the business outcome. We don’t plan campaigns to look good. We plan campaigns to perform, scale, and prove ROI.',
      bottleneckLabel: 'The Problem',
      bottleneckText: 'Campaigns fail because they start with ads instead of measurable goals. Weak targeting, poor messaging, and broken funnels burn spend.',
      requirementLabel: 'The Solution',
      requirementText: 'A complete growth architecture that defines audience, message, funnel, media plan, and budget logic before execution.',
      image: '/images/campaign-growth-architecture.png',
      statusLabel: 'Architecture State',
      statusValue: 'ENGINEERED',
    },
    philosophy: {
      icon: <Target className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Our Campaign',
      titleHighlight: 'Philosophy.',
      description: 'At Kangqore, campaign planning is not a creative checklist. It is a complete growth architecture system designed to maximize commercial impact, ensuring every rupee has a role before the campaign starts.',
      pills: ['Outcome-First Thinking', 'Full-Funnel Ownership', 'Data-Ready Execution', 'Strategic Clarity'],
      features: [
        { title: 'Objective Mapping', label: 'Alignment', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Every campaign is mapped to a measurable commercial objective, from lead gen to brand trust.' },
        { title: 'Precision Audience', label: 'Targeting', icon: <Users className="w-5 h-5 text-gray-400" />, content: 'We target real buyer intent, pain points, and triggers, not just generic demographics.' },
        { title: 'Funnel Blueprint', label: 'Architecture', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'We design the complete conversion journey from first touch to repeat purchase.' },
        { title: 'Budget Logic', label: 'Allocation', icon: <DollarSign className="w-5 h-5 text-gray-400" />, content: 'We build structured media plans with testing budgets, retargeting logic, and stop-loss rules.' },
      ],
    },
    matrix: {
      engineId: 'CAMPAIGN ARCHITECTURE™',
      title: 'Strategic Pillars.',
      subtext: 'The architectural framework that builds certainty, performance, and scalability into your campaigns.',
      layers: [
        { title: 'Map Objectives', id: 'CAMP_OBJ', icon: <Target />, desc: 'Defining the primary KPI, conversion event, and success benchmark.' },
        { title: 'Define Message', id: 'CAMP_MSG', icon: <Megaphone />, desc: 'Sharpening the message so it feels clear, relevant, and action-driven.' },
        { title: 'Architect Funnel', id: 'CAMP_FUNNEL', icon: <Layers />, desc: 'Designing the full journey from ad to landing page to follow-up CRM.' },
        { title: 'Plan Media', id: 'CAMP_MEDIA', icon: <BarChart3 />, desc: 'Selecting channels based strictly on business goals and buyer intent.' },
      ],
    },
    schematic: {
      titleLine1: 'Predictable',
      titleHighlight: 'Performance.',
      description: 'We do not assume what works. We build a scientific campaign system where decisions are based on performance data and validated testing logic.',
      stats: [
        { label: 'Strategy', val: 'ALIGNED' },
        { label: 'Spend', val: 'OPTIMIZED' },
        { label: 'ROI', val: 'PROVEN' },
      ],
    },
  },

  trustStrip: 'Transforming ad-hoc marketing campaigns into structured, full-funnel growth architectures for measurable ROI.',

  whyKangqore: [
    { title: 'Outcome-First Thinking', description: 'We plan around revenue, leads, sales, bookings, adoption, or retention — not vanity metrics.', icon: Target },
    { title: 'Full-Funnel Ownership', description: 'We connect audience, message, media, landing pages, automation, tracking, and optimization.', icon: Layers },
    { title: 'Strategic Clarity', description: 'Every campaign has a reason, structure, budget logic, and measurable target.', icon: Eye },
    { title: 'Creative with Purpose', description: 'Creative is mapped to funnel stage, buyer psychology, and conversion intent.', icon: Zap },
    { title: 'Data-Ready Execution', description: 'Tracking, attribution, and reporting are built before the campaign launches.', icon: Database },
    { title: 'Enterprise Discipline', description: 'Structured documentation, governance, timelines, dashboards, and accountability.', icon: Shield },
  ],

  useCases: [
    { name: 'Product Launch Campaigns', description: 'Create awareness, demand, and early adoption for new products or services.', icon: Rocket },
    { name: 'Lead Generation Campaigns', description: 'Build structured funnels for qualified inquiries, demos, consultations, and sales conversations.', icon: Users },
    { name: 'App Install Campaigns', description: 'Drive installs, first actions, bookings, subscriptions, and retention.', icon: Activity },
    { name: 'City Expansion Campaigns', description: 'Launch localized market-entry campaigns with regional audience, language, and platform strategy.', icon: MapPin },
    { name: 'Brand Awareness Campaigns', description: 'Create visibility, trust, recall, and authority across the right audiences.', icon: Megaphone },
    { name: 'Retargeting Campaigns', description: 'Re-engage website visitors, abandoned users, warm leads, cart users, and dormant prospects.', icon: RefreshCw },
    { name: 'Revenue Recovery Campaigns', description: 'Fix low-converting campaigns through better funnel, offer, creative, and follow-up planning.', icon: DollarSign },
  ],

  customFAQs: [
    { question: 'What is Campaign Planning at Kangqore?', answer: 'Campaign Planning at Kangqore means building the strategic blueprint behind a successful marketing campaign — audience, message, funnel, channel, budget, creative, tracking, and optimization — before execution begins.' },
    { question: 'Is this only for paid ads?', answer: 'No. We plan full-funnel campaigns across paid media, organic content, influencers, email, WhatsApp, landing pages, retargeting, and CRM journeys.' },
    { question: 'Can Kangqore execute the campaign after planning?', answer: 'Yes. We can plan, build, launch, optimize, and scale the campaign end to end.' },
    { question: 'What makes this different from normal campaign planning?', answer: 'Most agencies plan creatives and platforms. Kangqore plans the complete growth system behind the campaign, connecting business goals to full-funnel execution.' },
    { question: 'Do you help with campaign budget planning?', answer: 'Yes. We define total budget, channel-wise allocation, testing budget, retargeting budget, daily spend logic, scaling rules, and stop-loss rules.' },
    { question: 'How do you measure campaign success?', answer: 'We define success through KPIs such as leads, CAC, CPL, ROAS, conversion rate, app installs, bookings, retention, revenue, and lead-to-sale ratio.' },
  ],

  preMatrixSection: null,
  customSections: [
    <CampaignLogoTrustSection key="camp-logo-trust" />,
    <CampaignProblemsSection key="camp-problems" />,
    <WhyCampaignPlanningMatters key="why-camp-matters" />,
  ],
  postCapabilitiesSections: (
    <div className="flex flex-col w-full">
      <CampaignFrameworkSection />
      <WhatKangqoreDeliversSection />
      <BusinessImpactSection />
      <CampaignReadinessMagnet />
    </div>
  ),
  postFAQSections: null,

  industries: [
    { name: 'SaaS & Technology' },
    { name: 'E-commerce & D2C' },
    { name: 'Beauty & Wellness' },
    { name: 'Healthcare' },
    { name: 'Education' },
    { name: 'Real Estate' },
    { name: 'Finance & Insurance' },
    { name: 'Local Services' },
    { name: 'Professional Services' },
    { name: 'B2B Enterprises' },
    { name: 'Consumer Brands' },
    { name: 'Startups & New Product Launches' },
  ],

  technologies: [
    { category: 'Media Platforms', items: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'YouTube Ads', 'TikTok Ads'] },
    { category: 'Tracking & Analytics', items: ['Google Analytics 4', 'Google Tag Manager', 'Meta Pixel', 'Looker Studio', 'Segment'] },
    { category: 'Funnel & Landing Pages', items: ['Unbounce', 'Instapage', 'Webflow', 'WordPress', 'React / Next.js'] },
    { category: 'CRM & Automation', items: ['HubSpot', 'ActiveCampaign', 'Salesforce', 'Klaviyo', 'WhatsApp API'] },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'At Kangqore, campaign planning is not a creative checklist. It is a complete growth architecture system that defines the business objective, audience, message, funnel, media plan, budget logic, execution roadmap, tracking framework, and optimization model before a single campaign goes live.',
  capabilities: [
    {
      title: 'Campaign Objective Mapping',
      description: 'We begin by defining the real business outcome behind the campaign.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Business goal & Campaign objective', 'Primary KPI & Secondary KPI', 'Conversion event definition', 'Success benchmark setting'],
      micro: 'Start with the outcome.',
    },
    {
      title: 'Market & Audience Research',
      description: 'We identify who the campaign is truly built for and what will move them to act.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Target audience profiling', 'Buyer pain points & triggers', 'Purchase objections analysis', 'Platform & language behavior', 'Competitor positioning gaps'],
      micro: 'Understand the buyer.',
    },
    {
      title: 'Campaign Positioning & Message',
      description: 'We sharpen the campaign message so it feels clear, relevant, trustworthy, and action-driven.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Campaign theme & core message', 'Hook lines & tagline', 'Emotional & functional angle', 'Trust building & differentiation', 'CTA direction strategy'],
      micro: 'Sharpen the message.',
    },
    {
      title: 'Funnel Architecture',
      description: 'We design the complete conversion journey from first touch to repeat purchase.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Landing page structure logic', 'Lead magnet & offer alignment', 'Form & CTA strategy', 'WhatsApp & Email nurturing', 'Retargeting ad flows'],
      micro: 'Connect the journey.',
    },
    {
      title: 'Channel Strategy',
      description: 'We define where the campaign should run, where it should not run, and why.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['Intent-based channel mapping', 'B2B & D2C platform logic', 'Budget & geography weighting', 'Conversion probability scoring'],
      micro: 'Select right platforms.',
    },
    {
      title: 'Creative & Content Blueprint',
      description: 'We plan the creative system before production starts, serving every funnel stage.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Static ad & reel concepts', 'Video scripts & landing page copy', 'Influencer briefing', 'Email & WhatsApp sequences', 'Headline & CTA variations'],
      micro: 'Direct the creative.',
    },
    {
      title: 'Budget & Media Planning',
      description: 'We bring financial logic into campaign planning to ensure every rupee has a role.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Total budget & platform split', 'Testing & retargeting budget', 'Expected CPL / CAC / CPI', 'Scaling logic & stop-loss rules'],
      micro: 'Allocate with logic.',
    },
    {
      title: 'Campaign Calendar & Execution',
      description: 'We convert campaign strategy into a practical, phased execution roadmap.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Phase 1: Strategy & Research', 'Phase 2: Creative & Funnel Build', 'Phase 3: Launch Protocol', 'Phase 4 & 5: Optimize & Scale'],
      micro: 'Map the timeline.',
    },
    {
      title: 'Analytics, Tracking & Attribution',
      description: 'We make measurement part of campaign planning from day one.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Google Analytics & Meta Pixel', 'GTM & Conversion tracking', 'UTM structure & CRM source', 'Lead quality & Dashboard reporting'],
      micro: 'Measure everything.',
    },
    {
      title: 'Testing & Optimization Plan',
      description: 'We plan what will be tested before the campaign goes live for scientific scaling.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Audience & Hook testing', 'Landing Page & Offer testing', 'Copy length & CTA variations', 'Lead form vs Landing page', 'Data-backed iteration logic'],
      micro: 'Test and validate.',
    },
  ],
  trustPillars: [
    { title: 'Outcome-Led Strategy', tag: 'Business First', description: 'Campaigns mapped to real business goals, converting clicks to cash.' },
    { title: 'Full-Funnel Planning', tag: 'End-to-End', description: 'From first impression to conversion and retention, a frictionless journey.' },
    { title: 'Media + Budget Logic', tag: 'Financial Rigor', description: 'Every rupee assigned with a purpose, scaling rules, and stop-loss logic.' },
    { title: 'Tracking-Ready Execution', tag: 'Measurability', description: 'Measurement, attribution, and reporting built before launch.' },
  ],
  ctaTitle: 'Build Your Growth Architecture.',
  ctaDescription: 'Stop launching campaigns blind. Before you spend on media or creative, let us build the exact blueprint that defines how to turn attention into measurable revenue.',
  ctaButtonText: 'Start My Campaign Blueprint',
  ctaSecondaryButton: { text: 'Claim Campaign Audit', link: '/contact' },
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 8 Growth T1 services wired in Phase G2 PR 2.
// Note: `seo-organic-growth-strategy` is the canonical slug (legacy data file
// used `seo-organic-growth`). The data layer should normalize when wiring the
// PREMIUM_REGISTRY in ServicePageReal.
export const GROWTH_SECTIONS = {
  'cdp-strategy': cdpStrategy,
  'marketing-ai-readiness': marketingAiReadiness,
  'social-media-management': socialMediaManagement,
  'performance-marketing': performanceMarketing,
  'seo-organic-growth-strategy': seoOrganicGrowthStrategy,
  'growth-funnels-conversion-engineering': growthFunnelsConversionEngineering,
  'conversion-rate-optimization': conversionRateOptimization,
  'campaign-planning': campaignPlanning,
};
