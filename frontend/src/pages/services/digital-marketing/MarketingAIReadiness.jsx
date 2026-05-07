import React from 'react';
import { 
  Sparkles, Bot, Zap, Target, BarChart3, Clock, CheckCircle2, 
  Rocket, Search, MessageCircle, PenTool, Cpu, Settings, Shield,
  Activity, Users, Globe, Briefcase, Database, Layers, Lock, FileText
} from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  AIProblemsSection,
  WhyAIReadinessMatters,
  AIRoadmapFramework,
  WhatAIDeliversSection,
  AIUseCasesSection,
  AIImpactSection,
  AIReadinessMagnet,
  AILogoTrustSection
} from './components/MarketingAISections';

const MarketingAIReadiness = () => {
  const service = {
    name: 'Marketing AI Readiness.',
    titleLine1: 'Marketing AI',
    titleHighlight: 'Readiness.',
    slug: 'marketing-ai-readiness',
    shortDescription: 'Make Your Marketing Team Ready for the AI Era.',
    description: 'Kangqore helps marketing teams assess, design, and operationalize AI readiness across customer data, content workflows, personalization, campaign execution, analytics, automation, governance, and growth operations.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1260&q=80',
    videoBackground: '/videos/business-meeting-6774639.mp4',

    primaryButton: { text: 'Assess My Marketing AI Readiness', link: '/contact' },
    secondaryButton: { text: 'Request AI Growth Audit', link: '/contact' },
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Marketing', link: '/department/digital-marketing' },
      { label: 'Marketing AI Readiness' }
    ],

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
        statusValue: 'ASSESSING'
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
          { title: 'Human + AI Model', label: 'Operations', icon: <Users className="w-5 h-5 text-gray-400" />, content: 'We design workflows where AI accelerates execution while humans guide strategy, judgment, and creativity.' }
        ]
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
          { title: 'Scale', id: 'AIR_SCALE', icon: <Zap />, desc: 'Operationalize the best-performing AI use cases into repeatable marketing workflows.' }
        ]
      },
      schematic: {
        titleLine1: 'Predictable',
        titleHighlight: 'Growth.',
        description: 'We do not assume AI is ready. We build the marketing foundation — data, workflows, governance, people — so AI can create measurable, scalable, and responsible performance.',
        stats: [
          { label: 'Data', val: 'AI-READY' },
          { label: 'Workflows', val: 'STRUCTURED' },
          { label: 'Governance', val: 'RESPONSIBLE' }
        ]
      }
    },

    trustStrip: "Helping marketing teams move from random AI experimentation to structured AI-enabled performance.",

    whyKangqore: [
      { title: 'Strategy Before Tools', description: 'We define the business use cases before recommending AI platforms or workflows.', icon: Search },
      { title: 'Data Before Automation', description: 'We make sure customer data is usable, governed, and activation-ready.', icon: Database },
      { title: 'Personalization Before Noise', description: 'AI is used to create more relevant experiences, not just more content.', icon: Target },
      { title: 'Governance Before Scale', description: 'Brand safety, privacy, security, and approval flows are built from day one.', icon: Shield },
      { title: 'Human + AI Operating Model', description: 'We design workflows where AI accelerates execution while humans guide strategy, judgment, and creativity.', icon: Users },
      { title: 'Measurable Growth Impact', description: 'Every AI use case is tied to performance, productivity, customer experience, or revenue outcomes.', icon: BarChart3 }
    ],

    customFAQs: [
      { 
        question: 'What is Marketing AI Readiness?', 
        answer: 'Marketing AI Readiness is the process of preparing your marketing team, customer data, workflows, tools, governance, and operating model to use AI safely and effectively.' 
      },
      { 
        question: 'Is this the same as using ChatGPT for marketing?', 
        answer: 'No. Using AI tools is only one small part. Marketing AI Readiness defines the strategy, data foundation, workflows, governance, use cases, and measurement system needed to scale AI across marketing operations.' 
      },
      { 
        question: 'Why does customer data matter for AI marketing?', 
        answer: 'AI needs reliable customer data to personalize, predict, segment, and recommend effectively. Poor data creates poor AI outputs — regardless of the model quality.' 
      },
      { 
        question: 'Can Kangqore help us choose AI marketing tools?', 
        answer: 'Yes. We assess your use cases, existing martech stack, data readiness, and governance needs before recommending the right tools, platforms, and integrations.' 
      },
      { 
        question: 'What marketing areas can AI improve?', 
        answer: 'AI can support campaign planning, content creation, personalization, segmentation, lead scoring, analytics, reporting, funnel optimization, and customer engagement — when the foundation is ready.' 
      },
      { 
        question: 'How do you reduce AI risk?', 
        answer: 'We design responsible AI guardrails covering privacy, consent, brand safety, legal review, data access, human oversight, and output verification before scaling any AI capability.' 
      },
      { 
        question: 'Can AI replace our marketing team?', 
        answer: 'No. The best model is human + AI. AI accelerates repetitive and analytical tasks, while humans guide strategy, creativity, judgment, and brand direction.' 
      },
      { 
        question: 'What are the first deliverables?', 
        answer: 'The first deliverables usually include a readiness audit, AI use-case map, data readiness assessment, workflow blueprint, governance framework, and 30/60/90-day roadmap.' 
      }
    ],

    customSections: [
      <AILogoTrustSection key="ai-logo-trust" />,
      <AIProblemsSection key="ai-problems" />,
      <WhyAIReadinessMatters key="why-ai-matters" />
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
      { name: 'Consumer Brands' }
    ]
  };

  const department = {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Scalable marketing systems driven by data and AI.',
    icon: <Globe className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Marketing AI Readiness Assessment',
      description: 'We evaluate whether your marketing organization is ready to adopt AI across strategy, data, workflows, content, automation, analytics, and governance.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      items: ['Current AI usage audit', 'Customer data readiness', 'Martech & CRM maturity', 'Content workflow readiness', 'Campaign automation maturity', 'Personalization capability', 'Analytics quality', 'Governance gaps', 'Team skills assessment'],
      micro: 'Score your readiness.'
    },
    {
      title: 'AI Use-Case Discovery & Prioritization',
      description: 'We identify where AI should be applied first — based on business value, feasibility, risk, and speed of execution.',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted content creation', 'Campaign ideation & planning', 'Audience segmentation', 'Lead scoring', 'Customer journey personalization', 'Email & WhatsApp automation', 'Creative testing', 'Performance analytics'],
      micro: 'Prioritize what matters.'
    },
    {
      title: 'AI-Ready Customer Data Strategy',
      description: 'We prepare customer data for AI-powered marketing, personalization, analytics, and automation.',
      bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      items: ['Data source mapping', 'First-party data strategy', 'Unified customer profiles', 'Identity resolution logic', 'Segmentation model', 'Consent & privacy fields', 'AI-ready data quality rules'],
      micro: 'Fix the foundation.'
    },
    {
      title: 'GenAI Content Workflow Readiness',
      description: 'We redesign content operations so GenAI improves speed without weakening quality, brand consistency, or compliance.',
      bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted content workflow', 'Prompt & brief standards', 'Brand voice guardrails', 'Human review checkpoints', 'Legal compliance flow', 'Quality scoring framework', 'Content reuse model'],
      micro: 'Scale content safely.'
    },
    {
      title: 'AI-Powered Personalization Strategy',
      description: 'We help brands move from generic campaigns to customer-relevant experiences across channels.',
      bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
      items: ['Personalization use cases', 'Audience segment logic', 'Dynamic content rules', 'Product recommendations', 'Website personalization', 'Email & WhatsApp personalization', 'Next-best-action workflows'],
      micro: 'Personalize at scale.'
    },
    {
      title: 'Martech, CRM & AI Tooling Assessment',
      description: 'We assess whether your current technology stack can support AI-enabled marketing operations.',
      bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      items: ['CRM setup review', 'Marketing automation platform', 'CDP / data warehouse readiness', 'Analytics tools', 'Ad platform data flow', 'AI tools audit', 'Integration gaps', 'Security & access controls'],
      micro: 'Audit the stack.'
    },
    {
      title: 'AI Campaign & Creative Intelligence',
      description: 'We help teams use AI to improve campaign planning, creative testing, messaging, and optimization.',
      bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      items: ['AI-assisted campaign briefs', 'Audience-message matching', 'Hook & headline generation', 'Creative variant development', 'Ad copy testing systems', 'Performance pattern analysis'],
      micro: 'Accelerate campaigns.'
    },
    {
      title: 'AI Analytics & Decision Intelligence',
      description: 'We turn marketing data into AI-assisted insights that help teams act faster.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      items: ['Marketing performance dashboards', 'AI-assisted insight summaries', 'Funnel leakage detection', 'Campaign anomaly alerts', 'Lead quality scoring', 'Budget allocation recommendations'],
      micro: 'Decide, don\'t guess.'
    },
    {
      title: 'Responsible AI Governance for Marketing',
      description: 'We define the controls needed to use AI safely across marketing operations.',
      bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      items: ['AI usage policy', 'Data privacy & consent rules', 'Brand safety guardrails', 'Human review checkpoints', 'IP & copyright controls', 'Model output verification', 'Escalation structure'],
      micro: 'Govern with trust.'
    },
    {
      title: 'Marketing AI Roadmap & Operating Model',
      description: 'We turn AI readiness into execution with ownership, workflows, and 30/60/90-day blueprints.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      items: ['AI readiness scorecard', 'Use-case prioritization matrix', 'Data readiness roadmap', 'Content workflow plan', 'Governance framework', 'Team ownership model', '30/60/90-day implementation', 'KPI measurement framework'],
      micro: 'Plan for execution.'
    }
  ];

  const technologies = [
    { category: 'Generative AI & LLMs', items: ['OpenAI / GPT-4o', 'Anthropic / Claude', 'Google Gemini', 'Midjourney', 'Stable Diffusion'] },
    { category: 'CDP & CRM', items: ['Segment', 'Salesforce Data Cloud', 'HubSpot', 'Braze', 'Klaviyo'] },
    { category: 'Marketing Automation', items: ['ActiveCampaign', 'Marketo', 'Customer.io', 'Intercom', 'MoEngage'] },
    { category: 'Analytics & Personalization', items: ['GA4', 'Amplitude', 'Mixpanel', 'Dynamic Yield', 'Optimizely'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Kangqore\'s Marketing AI Readiness service helps brands prepare their marketing function for practical, scalable, and governed AI adoption. We assess your data, workflows, tools, content operations, customer journeys, analytics, and governance — then build a roadmap for AI-powered marketing execution.',
      capabilities,
      trustPillars: [
        { title: 'AI-Ready Customer Data', tag: 'Foundation', description: 'Clean, connected, governed customer data for intelligence and activation.' },
        { title: 'GenAI Content Workflows', tag: 'Speed', description: 'Faster content production with brand, legal, and quality guardrails.' },
        { title: 'Personalization at Scale', tag: 'Relevance', description: 'Relevant experiences powered by data, segmentation, and AI.' },
        { title: 'Responsible AI Governance', tag: 'Trust', description: 'Clear controls for privacy, security, brand consistency, and human oversight.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      ctaTitle: 'Build the Foundation First.',
      ctaDescription: 'AI can accelerate growth only when your data, workflows, tools, people, and governance are ready. Kangqore helps you build the marketing AI foundation needed to personalize better, execute faster, automate smarter, and scale responsibly.',
      ctaButtonText: 'Assess My Marketing AI Readiness',
      ctaSecondaryButton: { text: 'Request AI Growth Audit', link: '/contact' }
    },
    department
  };

  return (
    <div className="marketing-ai-page-override">
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default MarketingAIReadiness;
