import React from 'react';
import { Search, Database, Users, Layers, Target, Zap, Lock, BarChart3, Activity, Clock, Bot, Heart, Shield, Database as DatabaseIcon } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  CDPProblemsSection,
  WhyCDPStrategyMatters,
  CDPFrameworkSection,
  CDPDeliverablesSection,
  CDPImpactSection,
  CDPReadinessMagnet,
  CDPLogoTrustSection
} from './components/CDPCustomSections';

const CDPStrategy = () => {
  const service = {
    name: 'Customer Data Strategy.',
    titleLine1: 'Customer Data',
    titleHighlight: 'Strategy.',
    slug: 'cdp-strategy',
    shortDescription: 'Turn Fragmented Customer Data Into Growth Intelligence.',
    description: 'We help businesses design customer data strategies that connect fragmented data across websites, apps, CRM, campaigns, sales, service, and analytics into one usable intelligence layer — built for personalization, automation, AI-readiness, and measurable growth.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    videoBackground: '/videos/business-meeting-6774639.mp4',

    primaryButton: { text: 'Build My Customer Data Strategy', link: '/contact' },
    secondaryButton: { text: 'Request Data Readiness Audit', link: '/contact' },
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Marketing', link: '/department/digital-marketing' },
      { label: 'Customer Data Strategy' }
    ],

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
        statusValue: 'ENGINEERED'
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
          { title: 'Clean Ingestion', label: 'Quality', icon: <DatabaseIcon className="w-5 h-5 text-gray-400" />, content: 'Fixing duplicates and inconsistent fields for confident decision-making.' },
          { title: 'Trust Layer', label: 'Governance', icon: <Lock className="w-5 h-5 text-gray-400" />, content: 'Consent and data protection built into the architecture from day one.' }
        ]
      },
      matrix: {
        engineId: 'CUSTOMER INTELLIGENCE™',
        title: 'Strategic Pillars.',
        subtext: 'The architectural framework that builds certainty, performance, and scalability into your customer data ecosystem.',
        layers: [
          { title: 'Audit Readiness', id: 'CDS_AUDIT', icon: <Search />, desc: 'Mapping the state of collection, quality, and AI-readiness.' },
          { title: 'Connect Data', id: 'CDS_CONN', icon: <Database />, desc: 'Integrating CRM, CDP, and ad platforms into a unified sync.' },
          { title: 'Govern Trust', id: 'CDS_GOV', icon: <Lock />, desc: 'Establishing consent capture and privacy guardrails.' },
          { title: 'Activate Growth', id: 'CDS_ACT', icon: <Zap />, desc: 'Driving personalization and AI-led decisions across the journey.' }
        ]
      },
      schematic: {
        titleLine1: 'Predictable',
        titleHighlight: 'Personalization.',
        description: 'We do not assume who the customer is. We build a scientific data system where decisions are based on persistent behavior and validated identity logic.',
        stats: [
          { label: 'Identity', val: 'UNIFIED' },
          { label: 'Data IQ', val: 'CLEAN' },
          { label: 'AI Readiness', val: 'VALIDATED' }
        ]
      }
    },

    trustStrip: "Turning fragmented customer data into a structured operating system for growth and AI readiness.",

    whyKangqore: [
      { title: 'Customer-First Data Strategy', description: 'We define customer data around real experience, personalization, and retention use cases.', icon: Heart },
      { title: 'First-Party Data Ownership', description: 'Reducing dependence on third-party signals to build stronger owned data foundations.', icon: DatabaseIcon },
      { title: 'Unified Customer Intelligence', description: 'Connecting data across systems so teams can see customers clearly and act faster.', icon: Users },
      { title: 'Personalization-Ready', description: 'Segments, journeys, and campaigns are built for real-world execution.', icon: Zap },
      { title: 'AI-Ready Foundation', description: 'Structuring data so AI can support prediction and personalization safely.', icon: Bot },
      { title: 'Governance Built In', description: 'Consent, privacy, and compliance are part of the strategy from day one.', icon: Shield }
    ],

    customFAQs: [
      { 
        question: 'What is Customer Data Strategy?', 
        answer: 'Customer Data Strategy is the blueprint for collecting, connecting, governing, analyzing, and activating customer data to improve personalization, marketing, sales, service, retention, and growth.' 
      },
      { 
        question: 'Is this the same as CDP implementation?', 
        answer: 'No. CDP implementation is a technology project. Customer Data Strategy defines the business use cases, data model, governance, segmentation, activation plan, and platform roadmap before or alongside CDP implementation.' 
      },
      { 
        question: 'Why does customer data matter for personalization?', 
        answer: 'Personalization depends on knowing who the customer is, what they prefer, how they behave, and what journey stage they are in. Without connected data, personalization stays generic.' 
      },
      { 
        question: 'Can Kangqore help us choose a CDP or CRM?', 
        answer: 'Yes. We help define requirements, compare platform options, map integrations, and design the operating model for CRM, CDP, or data warehouse systems.' 
      },
      { 
        question: 'How does this support AI?', 
        answer: 'AI needs reliable, secure, and organized data. Kangqore prepares customer data so AI systems can support prediction, personalization, and decision intelligence.' 
      }
    ],

    customSections: [
      <CDPLogoTrustSection key="cdp-logo-trust" />,
      <CDPProblemsSection key="cdp-problems" />,
      <WhyCDPStrategyMatters key="why-cdp-matters" />
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
      { name: 'Media & Entertainment' }
    ]
  };

  const department = {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Data-driven strategies to reach, engage, and convert your ideal customers.',
    icon: <Target className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Customer Data Audit',
      description: 'We assess the state of your customer data ecosystem across sources, platforms, and AI-readiness.',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      items: ['Data collection audit', 'Platform source map', 'Quality & hygiene review', 'Consent & privacy audit'],
      micro: 'Assess the state.'
    },
    {
      title: 'Collection Strategy',
      description: 'We define what customer data should be collected and why, focusing on business purpose over volume.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      items: ['Profile & contact data', 'Behavioral & events', 'Preference capture', 'Campaign engagement'],
      micro: 'Collect with purpose.'
    },
    {
      title: 'Unified Profile Design',
      description: 'We design the structure for creating a single customer view across identities and engagement.',
      bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      items: ['Identity resolution logic', 'Source mapping rules', 'Data enrichment strategy', 'Customer 360 blueprint'],
      micro: 'Unify the view.'
    },
    {
      title: 'Platform Architecture',
      description: 'We help you decide where data should live and how systems like CRM and CDP should sync.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      items: ['CRM vs CDP roles', 'Data warehouse strategy', 'Integration roadmap', 'Access & security model'],
      micro: 'Build the stack.'
    },
    {
      title: 'Segmentation Strategy',
      description: 'We convert raw data into actionable audience groups based on behavior, value, and intent.',
      bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80',
      items: ['Behavioral segments', 'Lifecycle stage logic', 'High-value modeling', 'Churn risk signals'],
      micro: 'Define the audience.'
    },
    {
      title: 'Personalization Roadmap',
      description: 'We define how data creates relevant experiences across web, app, email, and ad channels.',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      items: ['Real-time offers', 'Recommended content', 'Triggered journeys', 'Website personalization'],
      micro: 'Activate the experience.'
    },
    {
      title: 'Consent & Trust Framework',
      description: 'We design the governance layer that keeps data compliant and trust high with every customer.',
      bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80',
      items: ['Consent capture flows', 'Preference centers', 'Opt-out management', 'Transparency rules'],
      micro: 'Build for trust.'
    },
    {
      title: 'Analytics & Intelligence',
      description: 'We transform data into decision intelligence—from CLV to attribution and growth signals.',
      bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      items: ['Customer lifetime value', 'Revenue attribution', 'Churn prediction', 'Channel performance'],
      micro: 'Drive intelligence.'
    },
    {
      title: 'AI-Ready Foundation',
      description: 'We prepare data cataloging and quality rules so AI can support prediction and personalization.',
      bgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      items: ['Data quality rules', 'Structured cataloging', 'Model input readiness', 'AI governance'],
      micro: 'Prepare for AI.'
    },
    {
      title: 'Operating Model',
      description: 'We turn strategy into execution with ownership, workflows, and 30/60/90-day blueprints.',
      bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      items: ['Team ownership', 'System workflows', 'Execution timeline', 'KPI framework'],
      micro: 'Plan for execution.'
    }
  ];

  const technologies = [
    { category: 'Customer Data Platforms', items: ['Segment', 'Lytics', 'mParticle', 'Salesforce Data Cloud', 'BlueConic'] },
    { category: 'CRM & Marketing Automation', items: ['HubSpot', 'Salesforce', 'Klaviyo', 'ActiveCampaign', 'Braze'] },
    { category: 'Analytics & Warehousing', items: ['Snowflake', 'BigQuery', 'Amplitude', 'Mixpanel', 'GA4'] },
    { category: 'Personalization', items: ['Dynamic Yield', 'Optimizely', 'Insider', 'Netcore'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'At Kangqore, customer data strategy is not just about tools. It is a complete growth architecture that defines what data to collect, how to unify it, and how to activate it for personalization and AI.',
      capabilities,
      trustPillars: [
        { title: 'Unified Profiles', tag: 'Identity', description: 'One reliable profile across every interaction, behavior, and transaction.' },
        { title: 'Clean Intelligence', tag: 'Quality', description: 'Fixing duplicate records and inconsistent fields for confident decisions.' },
        { title: 'Actionable Segments', tag: 'Activation', description: 'Audience definitions that flow directly into campaigns and automation.' },
        { title: 'AI Governance', tag: 'Future-Proof', description: 'Preparing data so AI can support insight and personalization safely.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      ctaTitle: 'Build Your Customer Intelligence.',
      ctaDescription: 'Stop letting customer data sit siloed and unused. Let us build the strategy that connects your data to real growth, personalization, and AI readiness.',
      ctaButtonText: 'Start My Data Strategy',
      ctaSecondaryButton: { text: 'Claim Data Readiness Audit', link: '/contact' }
    },
    department
  };

  return (
    <div className="cdp-page-override">
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default CDPStrategy;
