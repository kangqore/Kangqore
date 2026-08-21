import React from 'react';
import { Target, Search, Megaphone, Shield, DollarSign, Activity, Users, MapPin, Eye, Phone, RefreshCw, Briefcase, Zap, Rocket, Layers, BarChart3, Database } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  CampaignProblemsSection,
  WhyCampaignPlanningMatters,
  CampaignFrameworkSection,
  WhatKangqoreDeliversSection,
  BusinessImpactSection,
  CampaignReadinessMagnet,
  CampaignLogoTrustSection
} from '../../../components/services/growth/CampaignPlanningCustomSections';

const CampaignPlanning = () => {
  const service = {
    name: 'Campaign Planning',
    titleLine1: 'Growth Campaign',
    titleHighlight: 'Architecture.',
    slug: 'campaign-planning',
    shortDescription: 'Plan Campaigns That Convert Before You Spend.',
    description: 'We design campaign systems that connect objective, audience, message, funnel, channel, budget, creative direction, analytics, and optimization into one execution-ready growth architecture.',
    image: '/images/campaign-growth-architecture.png',
    videoBackground: '/videos/business-meeting-6774639.mp4',

    primaryButton: { text: 'Build My Campaign Blueprint', link: '/contact' },
    secondaryButton: { text: 'Request Campaign Audit', link: '/contact' },
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Conversion Engineering', link: '/department/conversion-engineering' },
      { label: 'Campaign Planning' }
    ],

    stats: [
      { value: 'Outcome-Led', label: 'Strategy', color: 'text-brand-blue' },
      { value: 'Full-Funnel', label: 'Planning', color: 'text-blue-400' },
      { value: 'Media + Budget', label: 'Logic', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
        statusValue: 'ENGINEERED'
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
          { title: 'Budget Logic', label: 'Allocation', icon: <DollarSign className="w-5 h-5 text-gray-400" />, content: 'We build structured media plans with testing budgets, retargeting logic, and stop-loss rules.' }
        ]
      },
      matrix: {
        engineId: 'CAMPAIGN ARCHITECTURE™',
        title: 'Strategic Pillars.',
        subtext: 'The architectural framework that builds certainty, performance, and scalability into your campaigns.',
        layers: [
          { title: 'Map Objectives', id: 'CAMP_OBJ', icon: <Target />, desc: 'Defining the primary KPI, conversion event, and success benchmark.' },
          { title: 'Define Message', id: 'CAMP_MSG', icon: <Megaphone />, desc: 'Sharpening the message so it feels clear, relevant, and action-driven.' },
          { title: 'Architect Funnel', id: 'CAMP_FUNNEL', icon: <Layers />, desc: 'Designing the full journey from ad to landing page to follow-up CRM.' },
          { title: 'Plan Media', id: 'CAMP_MEDIA', icon: <BarChart3 />, desc: 'Selecting channels based strictly on business goals and buyer intent.' }
        ]
      },
      schematic: {
        titleLine1: 'Predictable',
        titleHighlight: 'Performance.',
        description: 'We do not assume what works. We build a scientific campaign system where decisions are based on performance data and validated testing logic.',
        stats: [
          { label: 'Strategy', val: 'ALIGNED' },
          { label: 'Spend', val: 'OPTIMIZED' },
          { label: 'ROI', val: 'PROVEN' }
        ]
      }
    },

    trustStrip: "Transforming ad-hoc marketing campaigns into structured, full-funnel growth architectures for measurable ROI.",

    whyKangqore: [
      { title: 'Outcome-First Thinking', description: 'We plan around revenue, leads, sales, bookings, adoption, or retention — not vanity metrics.', icon: Target },
      { title: 'Full-Funnel Ownership', description: 'We connect audience, message, media, landing pages, automation, tracking, and optimization.', icon: Layers },
      { title: 'Strategic Clarity', description: 'Every campaign has a reason, structure, budget logic, and measurable target.', icon: Eye },
      { title: 'Creative with Purpose', description: 'Creative is mapped to funnel stage, buyer psychology, and conversion intent.', icon: Zap },
      { title: 'Data-Ready Execution', description: 'Tracking, attribution, and reporting are built before the campaign launches.', icon: Database },
      { title: 'Enterprise Discipline', description: 'Structured documentation, governance, timelines, dashboards, and accountability.', icon: Shield }
    ],

    useCases: [
      { name: 'Product Launch Campaigns', description: 'Create awareness, demand, and early adoption for new products or services.', icon: Rocket },
      { name: 'Lead Generation Campaigns', description: 'Build structured funnels for qualified inquiries, demos, consultations, and sales conversations.', icon: Users },
      { name: 'App Install Campaigns', description: 'Drive installs, first actions, bookings, subscriptions, and retention.', icon: Activity },
      { name: 'City Expansion Campaigns', description: 'Launch localized market-entry campaigns with regional audience, language, and platform strategy.', icon: MapPin },
      { name: 'Brand Awareness Campaigns', description: 'Create visibility, trust, recall, and authority across the right audiences.', icon: Megaphone },
      { name: 'Retargeting Campaigns', description: 'Re-engage website visitors, abandoned users, warm leads, cart users, and dormant prospects.', icon: RefreshCw },
      { name: 'Revenue Recovery Campaigns', description: 'Fix low-converting campaigns through better funnel, offer, creative, and follow-up planning.', icon: DollarSign }
    ],

    customFAQs: [
      {
        question: 'What is Campaign Planning at Kangqore?',
        answer: 'Campaign Planning at Kangqore means building the strategic blueprint behind a successful marketing campaign — audience, message, funnel, channel, budget, creative, tracking, and optimization — before execution begins.'
      },
      {
        question: 'Is this only for paid ads?',
        answer: 'No. We plan full-funnel campaigns across paid media, organic content, influencers, email, WhatsApp, landing pages, retargeting, and CRM journeys.'
      },
      {
        question: 'Can Kangqore execute the campaign after planning?',
        answer: 'Yes. We can plan, build, launch, optimize, and scale the campaign end to end.'
      },
      {
        question: 'What makes this different from normal campaign planning?',
        answer: 'Most agencies plan creatives and platforms. Kangqore plans the complete growth system behind the campaign, connecting business goals to full-funnel execution.'
      },
      {
        question: 'Do you help with campaign budget planning?',
        answer: 'Yes. We define total budget, channel-wise allocation, testing budget, retargeting budget, daily spend logic, scaling rules, and stop-loss rules.'
      },
      {
        question: 'How do you measure campaign success?',
        answer: 'We define success through KPIs such as leads, CAC, CPL, ROAS, conversion rate, app installs, bookings, retention, revenue, and lead-to-sale ratio.'
      }
    ],

    preMatrixSection: null,
    customSections: [
      <CampaignLogoTrustSection key="camp-logo-trust" />,
      <CampaignProblemsSection key="camp-problems" />,
      <WhyCampaignPlanningMatters key="why-camp-matters" />
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
      { name: 'Startups & New Product Launches' }
    ]
  };

  const department = {
    name: 'Conversion Engineering',
    slug: 'conversion-engineering',
    description: 'Specialized optimization to transform traffic into measurable business outcomes.',
    icon: <Activity className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Campaign Objective Mapping',
      description: 'We begin by defining the real business outcome behind the campaign.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Business goal & Campaign objective', 'Primary KPI & Secondary KPI', 'Conversion event definition', 'Success benchmark setting'],
      micro: 'Start with the outcome.'
    },
    {
      title: 'Market & Audience Research',
      description: 'We identify who the campaign is truly built for and what will move them to act.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Target audience profiling', 'Buyer pain points & triggers', 'Purchase objections analysis', 'Platform & language behavior', 'Competitor positioning gaps'],
      micro: 'Understand the buyer.'
    },
    {
      title: 'Campaign Positioning & Message',
      description: 'We sharpen the campaign message so it feels clear, relevant, trustworthy, and action-driven.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Campaign theme & core message', 'Hook lines & tagline', 'Emotional & functional angle', 'Trust building & differentiation', 'CTA direction strategy'],
      micro: 'Sharpen the message.'
    },
    {
      title: 'Funnel Architecture',
      description: 'We design the complete conversion journey from first touch to repeat purchase.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Landing page structure logic', 'Lead magnet & offer alignment', 'Form & CTA strategy', 'WhatsApp & Email nurturing', 'Retargeting ad flows'],
      micro: 'Connect the journey.'
    },
    {
      title: 'Channel Strategy',
      description: 'We define where the campaign should run, where it should not run, and why.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['Intent-based channel mapping', 'B2B & D2C platform logic', 'Budget & geography weighting', 'Conversion probability scoring'],
      micro: 'Select right platforms.'
    },
    {
      title: 'Creative & Content Blueprint',
      description: 'We plan the creative system before production starts, serving every funnel stage.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Static ad & reel concepts', 'Video scripts & landing page copy', 'Influencer briefing', 'Email & WhatsApp sequences', 'Headline & CTA variations'],
      micro: 'Direct the creative.'
    },
    {
      title: 'Budget & Media Planning',
      description: 'We bring financial logic into campaign planning to ensure every rupee has a role.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Total budget & platform split', 'Testing & retargeting budget', 'Expected CPL / CAC / CPI', 'Scaling logic & stop-loss rules'],
      micro: 'Allocate with logic.'
    },
    {
      title: 'Campaign Calendar & Execution',
      description: 'We convert campaign strategy into a practical, phased execution roadmap.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Phase 1: Strategy & Research', 'Phase 2: Creative & Funnel Build', 'Phase 3: Launch Protocol', 'Phase 4 & 5: Optimize & Scale'],
      micro: 'Map the timeline.'
    },
    {
      title: 'Analytics, Tracking & Attribution',
      description: 'We make measurement part of campaign planning from day one.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Google Analytics & Meta Pixel', 'GTM & Conversion tracking', 'UTM structure & CRM source', 'Lead quality & Dashboard reporting'],
      micro: 'Measure everything.'
    },
    {
      title: 'Testing & Optimization Plan',
      description: 'We plan what will be tested before the campaign goes live for scientific scaling.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Audience & Hook testing', 'Landing Page & Offer testing', 'Copy length & CTA variations', 'Lead form vs Landing page', 'Data-backed iteration logic'],
      micro: 'Test and validate.'
    }
  ];

  const technologies = [
    { category: 'Media Platforms', items: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'YouTube Ads', 'TikTok Ads'] },
    { category: 'Tracking & Analytics', items: ['Google Analytics 4', 'Google Tag Manager', 'Meta Pixel', 'Looker Studio', 'Segment'] },
    { category: 'Funnel & Landing Pages', items: ['Unbounce', 'Instapage', 'Webflow', 'WordPress', 'React / Next.js'] },
    { category: 'CRM & Automation', items: ['HubSpot', 'ActiveCampaign', 'Salesforce', 'Klaviyo', 'WhatsApp API'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'At Kangqore, campaign planning is not a creative checklist. It is a complete growth architecture system that defines the business objective, audience, message, funnel, media plan, budget logic, execution roadmap, tracking framework, and optimization model before a single campaign goes live.',
      capabilities,
      trustPillars: [
        { title: 'Outcome-Led Strategy', tag: 'Business First', description: 'Campaigns mapped to real business goals, converting clicks to cash.' },
        { title: 'Full-Funnel Planning', tag: 'End-to-End', description: 'From first impression to conversion and retention, a frictionless journey.' },
        { title: 'Media + Budget Logic', tag: 'Financial Rigor', description: 'Every rupee assigned with a purpose, scaling rules, and stop-loss logic.' },
        { title: 'Tracking-Ready Execution', tag: 'Measurability', description: 'Measurement, attribution, and reporting built before launch.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      ctaTitle: 'Build Your Growth Architecture.',
      ctaDescription: 'Stop launching campaigns blind. Before you spend on media or creative, let us build the exact blueprint that defines how to turn attention into measurable revenue.',
      ctaButtonText: 'Start My Campaign Blueprint',
      ctaSecondaryButton: { text: 'Claim Campaign Audit', link: '/contact' }
    },
    department
  };

  return (
    <div className="campaign-page-override">
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default CampaignPlanning;
