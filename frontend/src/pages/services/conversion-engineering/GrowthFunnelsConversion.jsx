import React from 'react';
import { Filter, Search, Layers, Zap, Activity, Target, TrendingUp, Shield, BarChart3, Users, DollarSign, MousePointerClick, Gauge, Rocket, Briefcase, GraduationCap, Heart, Landmark, ShoppingCart, LineChart, BrainCircuit, PenTool, Database, MonitorPlay, MousePointer2, Eye, Bot, Settings, Globe } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  FunnelChallengesSection,
  WhyFunnelsMatterSection,
  FourPhaseFunnelMethod,
  FunnelSuccessSection,
  FunnelReadinessMagnet,
  FunnelLogoTrustSection
} from '../../../components/services/growth/FunnelCustomSections';

const GrowthFunnelsConversion = () => {
  const service = {
    name: 'Growth Funnels & Conversion Engineering',
    titleLine1: 'Growth Funnels &',
    titleHighlight: 'Conversion Engineering.',
    slug: 'growth-funnels-conversion-engineering',
    shortDescription: 'Engineering Growth Funnels That Do Not Leak Revenue.',
    description: 'Kangqore transforms attention into measurable commercial outcomes through precision Growth Funnel Architecture and Conversion Engineering. We redesign customer decision journeys using behavioral science, advanced experimentation, AI-led optimization, and full-funnel analytics.',
    image: '/images/growth-funnel-revenue-engineering.png',

    primaryButton: { text: 'Engineer Your Revenue Engine', link: '/contact' },
    secondaryButton: { text: 'Claim Your Custom Revenue Leakage Audit (Value: $2,500)', link: '/contact' },
    videoBackground: '/videos/business-meeting-6774639.mp4',
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Conversion Engineering', link: '/department/conversion-engineering' },
      { label: 'Growth Funnels & CRO' }
    ],

    stats: [
      { value: 'Full-Funnel', label: 'Revenue Architecture', color: 'text-brand-blue' },
      { value: 'AI-Augmented', label: 'Conversion Optimization', color: 'text-blue-400' },
      { value: 'Higher LTV', label: '& Lower CAC Focus', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
        bottleneckText: 'Most agencies optimize campaigns. They focus on clicks and impressions while revenue leaks through broken funnels, weak nurture, and friction-filled journeys.',
        requirementLabel: 'The Solution',
        requirementText: 'We engineer commercial systems. Every stage of the customer journey is designed, tested, and optimized to convert demand into measurable revenue.',
        image: '/images/growth-funnel-revenue-engineering.png',
        statusLabel: 'Funnel State',
        statusValue: 'SCALING'
      },
      philosophy: {
        icon: <Filter className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: 'Our Revenue',
        titleHighlight: 'Engineering Philosophy.',
        description: 'We treat marketing as an engineering discipline. We combine behavioral science, experimentation rigor, AI intelligence, and revenue-first execution to build growth engines that outperform generic marketing models.',
        pills: ['Behavioral Science', 'Experimentation', 'AI Optimization', 'Full-Funnel Analytics'],
        features: [
          { title: 'Funnel Diagnostics', label: 'Audit', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'We dissect the entire customer journey using analytics, session recordings, heatmaps, and behavioral data to identify hidden leakage points.' },
          { title: 'Hypothesis Engine', label: 'Science', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'We run structured A/B, multivariate, and sequential testing programs with commercial KPIs at the center of every decision.' },
          { title: 'CRO & UX Engineering', label: 'Conversion', icon: <MonitorPlay className="w-5 h-5 text-gray-400" />, content: 'We redesign landing pages, product flows, forms, and checkout systems to increase action rates.' },
          { title: 'AI Personalisation', label: 'Scale', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'Your funnel adapts dynamically based on audience segment, behavior, and context for real-time experience adaptation.' }
        ]
      },
      matrix: {
        engineId: 'REVENUE ENGINE™',
        title: 'Core Delivery Pillars.',
        subtext: 'The architectural framework for total conversion dominance and scalable revenue growth.',
        layers: [
          { title: 'Attract', id: 'FUNNEL_ATTRACT', icon: <Target />, desc: 'Acquiring the right audience through precision paid, organic, and signal-mapped channels.' },
          { title: 'Engage', id: 'FUNNEL_ENGAGE', icon: <Layers />, desc: 'Turning attention into trust through personalised journeys and high-converting experiences.' },
          { title: 'Convert', id: 'FUNNEL_CONVERT', icon: <Activity />, desc: 'Reducing friction and increasing action through CRO, testing, and checkout optimization.' },
          { title: 'Expand', id: 'FUNNEL_EXPAND', icon: <Rocket />, desc: 'Growing revenue after conversion through onboarding, upsell, and retention systems.' }
        ]
      },
      schematic: {
        titleLine1: 'Revenue-First',
        titleHighlight: 'Architecture.',
        description: 'True growth engineering removes every obstacle between your prospect and their desired outcome, leveraging behavioral science and AI to accelerate decision making at every stage.',
        stats: [
          { label: 'Conversion', val: 'MAXIMIZED' },
          { label: 'Friction', val: 'REMOVED' },
          { label: 'Revenue', val: 'SCALING' }
        ]
      }
    },

    trustStrip: "Helping growth-stage brands, enterprises, SaaS companies, ecommerce businesses, and challenger brands convert more of the demand they already generate.",

    whyKangqore: [
      { title: 'Revenue-First Execution', description: 'Every recommendation is measured against commercial impact—not vanity metrics.', icon: DollarSign },
      { title: 'Full-System Thinking', description: 'We optimize acquisition, conversion, retention, and expansion together as one connected system.', icon: Layers },
      { title: 'Scientific Rigor', description: 'Structured experimentation replaces guesswork. Every change is validated through data.', icon: Activity },
      { title: 'AI-Native Advantage', description: 'Modern automation and intelligence increase speed, precision, and personalisation at scale.', icon: BrainCircuit },
      { title: 'Transparent Visibility', description: 'Clear dashboards. Clear priorities. Clear outcomes. Full operational visibility at every stage.', icon: Eye },
      { title: 'Built for Ambitious Brands', description: 'Designed for businesses that want scalable growth—not incremental tweaks.', icon: Rocket }
    ],

    useCases: [
      { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
      { name: 'Ecommerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
      { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
      { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
      { name: 'Education', description: 'Increase student enrollment applications and optimize course discovery.', icon: GraduationCap },
      { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
      { name: 'Professional Services', description: 'Improve lead quality, optimize form submissions, and deploy automated nurturing.', icon: Briefcase },
      { name: 'Consumer Brands', description: 'Build brand-to-purchase funnels that maximize awareness-to-conversion rates.', icon: Globe },
      { name: 'B2B Enterprises', description: 'Engineer complex multi-touch funnels for consultative sales cycles.', icon: Users },
      { name: 'Local Growth Businesses', description: 'Drive local leads through optimized landing pages and map-based funnels.', icon: Target }
    ],

    customFAQs: [
      {
        question: 'What is Growth Funnel & Conversion Engineering?',
        answer: 'It is the structured design and optimization of the entire customer journey so more demand converts into measurable revenue. We combine behavioral science, experimentation, and AI to engineer every stage of the funnel.'
      },
      {
        question: 'How is this different from standard marketing services?',
        answer: 'Traditional marketing often focuses on traffic or awareness. We focus on revenue efficiency, conversion performance, and lifetime value—engineering the full commercial system, not just individual campaigns.'
      },
      {
        question: 'Can you work with existing campaigns and funnels?',
        answer: 'Yes. We can audit, optimize, rebuild, or scale your current systems. Our diagnostic process identifies the highest-leverage opportunities within your existing infrastructure.'
      },
      {
        question: 'How quickly can results improve?',
        answer: 'Some gains happen quickly through friction removal and quick wins. Larger improvements typically compound over 30–90 days depending on traffic volume and market conditions.'
      },
      {
        question: 'Do you support B2B and B2C models?',
        answer: 'Yes. We build systems for ecommerce, SaaS, lead generation, consultative sales, and service businesses across both B2B and B2C markets.'
      },
      {
        question: 'What metrics do you track?',
        answer: 'CAC, CVR, CPL, ROAS, lead quality, pipeline value, retention, LTV, and revenue by channel. Every metric ties directly to commercial outcomes.'
      }
    ],

    preMatrixSection: null,
    customSections: [
      <FunnelLogoTrustSection key="funnel-logo-trust" />,
      <FunnelChallengesSection key="funnel-challenges" />,
      <WhyFunnelsMatterSection key="why-funnels-matter" />
    ],
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <FourPhaseFunnelMethod />
        <FunnelSuccessSection />
        <FunnelReadinessMagnet />
      </div>
    ),
    postFAQSections: null
  };

  const department = {
    name: 'Conversion Engineering',
    slug: 'conversion-engineering',
    description: 'Specialized optimization to transform traffic into measurable business outcomes.',
    icon: <Filter className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Full-Funnel Diagnostics & Forensic Audit',
      description: 'We dissect the entire customer journey using analytics, session recordings, heatmaps, funnel tracking, and behavioral data to identify hidden leakage points.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Funnel leakage mapping', 'Journey-stage performance analysis', 'Attribution gap discovery', 'UX friction detection', 'Revenue opportunity prioritization'],
      micro: 'Find every leak.'
    },
    {
      title: 'Behavioral Science & Heuristic Analysis',
      description: 'We uncover why users hesitate, abandon, delay, or convert by combining psychology frameworks with real user insight.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['User motivation analysis', 'Trust & objection mapping', 'Decision-friction diagnostics', 'Persuasion architecture planning', 'Behavior-led hypothesis creation'],
      micro: 'Understand the why.'
    },
    {
      title: 'Hypothesis-Driven Experimentation Engine',
      description: 'We run structured A/B, multivariate, and sequential testing programs with commercial KPIs at the center of every decision.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Testing roadmap creation', 'Variant design & deployment', 'Statistical decision frameworks', 'AI-assisted idea prioritization', 'Continuous learning loops'],
      micro: 'Test with rigor.'
    },
    {
      title: 'CRO & UX Engineering',
      description: 'We redesign landing pages, product flows, forms, checkout systems, and onboarding experiences to increase action rates.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Landing page optimization', 'Checkout friction removal', 'Micro-copy improvement', 'Trust signal enhancement', 'Faster path-to-conversion design'],
      micro: 'Maximize action.'
    },
    {
      title: 'AI-Powered Personalisation at Scale',
      description: 'Your funnel adapts dynamically based on audience segment, behavior, and context for maximum relevance.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Dynamic content journeys', 'Segment-based experiences', 'Predictive recommendations', 'Intent-responsive messaging', 'Real-time experience adaptation'],
      micro: 'Personalise at scale.'
    },
    {
      title: 'Growth Funnel Architecture (AARRR + Growth Loops)',
      description: 'We engineer the full lifecycle from acquisition to advocacy using modern growth frameworks.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Acquisition system design', 'Activation flow optimization', 'Retention loops', 'Monetisation systems', 'Referral & virality frameworks'],
      micro: 'Engineer the lifecycle.'
    },
    {
      title: 'Post-Conversion & Lifetime Value Optimization',
      description: 'We continue optimization after purchase to maximize revenue and reduce churn.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Onboarding journeys', 'Expansion revenue systems', 'Reactivation campaigns', 'Loyalty mechanics', 'Retention performance modeling'],
      micro: 'Grow after conversion.'
    },
    {
      title: 'Enterprise-Grade Tech Integration & Dashboards',
      description: 'We integrate with your existing stack and create full operational visibility across the funnel.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['GA4 & analytics integration', 'CRM connectivity', 'Martech workflow integration', 'Executive dashboards', 'Real-time growth intelligence'],
      micro: 'Full visibility.'
    }
  ];

  const technologies = [
    { category: 'A/B Testing & CRO', items: ['VWO', 'Optimizely', 'Google Optimize', 'Convert', 'Omniconvert'] },
    { category: 'Behavioral Analytics', items: ['Hotjar', 'Crazy Egg', 'Microsoft Clarity', 'FullStory', 'Mouseflow'] },
    { category: 'Product Analytics', items: ['Mixpanel', 'Amplitude', 'Heap', 'PostHog'] },
    { category: 'Landing Page Builders', items: ['Unbounce', 'Instapage', 'Webflow', 'Framer', 'React / Next.js'] },
    { category: 'Marketing Automation', items: ['HubSpot', 'ActiveCampaign', 'Marketo', 'Klaviyo', 'Pardot'] },
    { category: 'Core Analytics', items: ['Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Segment'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'In 2026, traffic alone does not drive growth. Insight-led, conversion-focused systems do. Kangqore combines behavioral science, experimentation rigor, AI intelligence, and revenue-first execution.',
      capabilities,
      trustPillars: [
        { title: 'Revenue-First Execution', tag: 'Commercial Focus', description: 'Every recommendation is measured against commercial impact—not vanity metrics or isolated page improvements.' },
        { title: 'Full-System Thinking', tag: 'End-to-End', description: 'We optimize acquisition, conversion, retention, and expansion together as one connected revenue system.' },
        { title: 'Scientific Rigor', tag: 'Data Science', description: 'Structured experimentation replaces guesswork. We wait for statistical significance before declaring winners.' },
        { title: 'AI-Native Advantage', tag: 'Modern Intelligence', description: 'Modern automation and intelligence increase speed, precision, and personalisation across the entire funnel.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default GrowthFunnelsConversion;
