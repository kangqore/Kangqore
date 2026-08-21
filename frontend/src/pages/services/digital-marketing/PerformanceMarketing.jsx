import React from 'react';
import { Zap, Search, Layers, Activity, Target, BrainCircuit, Eye, TrendingUp, Shield, BarChart3, Users, DollarSign, MousePointerClick, Gauge, Globe, Briefcase, GraduationCap, Heart, Landmark, ShoppingCart, LineChart } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  PerformanceChallengesSection,
  FivePhaseGrowthMethod,
  GrowthPodSection,
  KPIReportingSection,
  BusinessNeedsSection,
  PerformanceReadinessMagnet,
  LogoTrustSection
} from '../../../components/services/growth/PerformanceMarketingCustomSections';

const PerformanceMarketing = () => {
  const service = {
    name: 'Performance Marketing',
    titleLine1: 'Performance',
    titleHighlight: 'Marketing',
    slug: 'performance-marketing',
    shortDescription: 'We don\'t just buy media. We engineer scalable acquisition systems that align media spend to your specific business outcomes, driving qualified growth and measurable ROI.',
    description: 'Kangqore builds high-converting growth engines that scale predictably. From audit to execution, our performance team focuses on the only metric that matters: your bottom-line growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1260&q=80',

    primaryButton: { text: 'Request Revenue Audit', link: '/contact' },
    secondaryButton: { text: 'Growth Framework', link: '#capabilities' },
    videoBackground: 'https://player.vimeo.com/external/494191410.sd.mp4?s=5dfdcde1366110f274751f11a4369e900c3b0185&profile_id=164&oauth2_token_id=57447761',
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Marketing', link: '/department/digital-marketing' },
      { label: 'Performance Marketing' }
    ],

    stats: [
      { value: '3x ROAS', label: 'Revenue-Led Campaign Architecture', color: 'text-brand-blue' },
      { value: 'Multi-Channel', label: 'Google, Meta, LinkedIn, YouTube', color: 'text-blue-400' },
      { value: 'Full-Funnel', label: 'Click-to-Customer Optimization', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
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
        statusValue: 'DEPLOYED'
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
          { title: 'Scale & Expansion', label: 'Growth', icon: <TrendingUp className="w-5 h-5 text-gray-400" />, content: 'Double down on winning channels, expand into new geographies, test new audiences, and build lifecycle remarketing engines.' }
        ]
      },
      matrix: {
        engineId: 'GROWTH ENGINE™',
        title: 'The Growth Matrix.',
        subtext: 'A structured 5-phase methodology that transforms paid marketing from a campaign activity into a predictable revenue function.',
        layers: [
          { title: 'Audit', id: 'PM_AUDIT', icon: <Search />, desc: 'Account analysis, spend leakage identification, tracking gaps, audience quality assessment, and competitor benchmarking.' },
          { title: 'Architect', id: 'PM_ARCH', icon: <Layers />, desc: 'Channel mix, funnel design, landing pages, campaign structure, KPIs, and measurement architecture.' },
          { title: 'Execute', id: 'PM_EXEC', icon: <Zap />, desc: 'Structured campaign launch with testing across creatives, audiences, keywords, placements, and conversion paths.' },
          { title: 'Optimize', id: 'PM_OPT', icon: <Activity />, desc: 'Bid refinement, audience expansion, creative iteration, CRO improvement, and budget reallocation for maximum ROAS.' }
        ]
      },
      schematic: {
        titleLine1: 'Profitable',
        titleHighlight: 'Growth.',
        description: 'Your media spend should generate compounding returns. We engineer the acquisition systems, attribution frameworks, and optimization loops that make growth predictable.',
        stats: [
          { label: 'ROAS', val: 'MAXIMIZED' },
          { label: 'Pipeline', val: 'CONNECTED' },
          { label: 'Scale', val: 'PREDICTABLE' }
        ]
      }
    },

    trustStrip: "Trusted by SaaS, ecommerce, healthcare, education, and real estate brands to turn paid media spend into predictable revenue through full-funnel performance systems.",

    whyKangqore: [
      { title: 'Revenue-First Thinking', description: 'We optimize for profitable growth, not inflated vanity metrics. Every campaign is measured against CAC, ROAS, pipeline value, and customer LTV.', icon: DollarSign },
      { title: 'Full-Funnel Ownership', description: 'Ads, landing pages, tracking, remarketing, reporting, and scale — managed together under one growth pod. No finger-pointing between vendors.', icon: Layers },
      { title: 'Multi-Platform Mastery', description: 'Google, Meta, LinkedIn, YouTube, marketplaces, and remarketing channels. We don\'t default to one platform — we go where your buyers are.', icon: Globe }
    ],

    useCases: [
      { name: 'SaaS & Technology', description: 'Demo bookings, trials, product signups, pipeline growth, and MQL generation through intent-led acquisition.', icon: BrainCircuit },
      { name: 'Real Estate', description: 'Property leads, site visits, investor campaigns, local targeting, and CRM-integrated funnels.', icon: Landmark },
      { name: 'Healthcare', description: 'Clinic leads, treatment awareness, elective procedures, and compliant patient acquisition campaigns.', icon: Heart },
      { name: 'Education', description: 'Admissions campaigns, webinar registrations, counseling leads, and course enrollment funnels.', icon: GraduationCap },
      { name: 'Ecommerce & DTC', description: 'Catalog ads, upsells, retargeting, influencer amplification, and checkout optimization.', icon: ShoppingCart },
      { name: 'Finance & Insurance', description: 'Trust-led acquisition, compliant messaging, lead quality controls, and funnel nurturing.', icon: Shield }
    ],

    customFAQs: [
      {
        question: 'How soon can we see results?',
        answer: 'Some campaigns show traction within days. Stable learning and scalable performance usually develop within 30–90 days depending on budget, market, and funnel quality.'
      },
      {
        question: 'What budget do we need?',
        answer: 'It depends on your industry, geography, goals, and competition. We recommend budgets based on realistic acquisition economics — not arbitrary minimums.'
      },
      {
        question: 'Do you only run ads?',
        answer: 'No. We improve the entire performance system: ads, creatives, landing pages, tracking, attribution, and conversion flow. Ads without conversion architecture waste budget.'
      },
      {
        question: 'Which platforms should we advertise on?',
        answer: 'We recommend channels based on buyer intent, audience behavior, CAC targets, and sales cycle — not platform preference.'
      },
      {
        question: 'Can you work with existing ad accounts?',
        answer: 'Yes. We can audit, rebuild, optimize, or scale existing accounts without losing historical data or learning.'
      },
      {
        question: 'Do you support ecommerce brands?',
        answer: 'Yes. We manage ecommerce acquisition, catalog growth, remarketing, seasonal scaling, and revenue optimization across platforms.'
      },
      {
        question: 'How do you report performance?',
        answer: 'Through live dashboards, weekly insights, and monthly strategic reviews — all tied to business KPIs like CAC, ROAS, pipeline value, and revenue.'
      },
      {
        question: 'What if current campaigns are failing?',
        answer: 'We diagnose root causes, fix structural issues (tracking, targeting, creative, landing pages), relaunch tests, and rebuild toward profitable growth.'
      }
    ],

    preMatrixSection: null,
    customSections: [
      <LogoTrustSection key="pm-logo-trust" />,
      <PerformanceChallengesSection key="pm-challenges" />,
      <GrowthPodSection key="pm-pod" />
    ],
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <FivePhaseGrowthMethod />
        <KPIReportingSection />
        <BusinessNeedsSection />
        <PerformanceReadinessMagnet />
      </div>
    ),
    postFAQSections: null
  };

  const department = {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Transform your brand with data-driven digital marketing strategies.',
    icon: <LineChart className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Google Ads',
      description: 'Search, Shopping, Display, YouTube, demand capture, remarketing, and high-intent lead generation. We build Google campaigns that convert search intent into pipeline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Search & Shopping campaigns', 'Display & YouTube pre-roll', 'Remarketing & RLSA', 'High-intent lead generation'],
      micro: 'Capture demand at the moment of intent.'
    },
    {
      title: 'Meta Ads',
      description: 'Facebook & Instagram acquisition, ecommerce sales, lead forms, retargeting, creative testing, and audience expansion across the Meta ecosystem.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Acquisition & lead forms', 'Ecommerce catalog ads', 'Creative A/B testing', 'Audience expansion & lookalikes'],
      micro: 'Full-funnel Meta execution.'
    },
    {
      title: 'LinkedIn Ads',
      description: 'B2B lead generation, account-based targeting, webinar funnels, executive audience campaigns, and pipeline acceleration for enterprise sales teams.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Account-based targeting', 'Executive audience campaigns', 'Webinar & event funnels', 'Pipeline acceleration'],
      micro: 'B2B pipeline at scale.'
    },
    {
      title: 'YouTube Ads',
      description: 'Awareness-to-conversion video funnels, product explainers, retargeting viewers, branded demand generation, and Shorts campaigns.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Video funnel strategy', 'Product explainer campaigns', 'Viewer retargeting', 'Shorts & demand generation'],
      micro: 'Video that converts.'
    },
    {
      title: 'Marketplace Ads',
      description: 'Amazon, Flipkart, and platform-native sponsored campaigns for product visibility, sales velocity, and category domination.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Amazon Sponsored Products', 'Flipkart Brand Ads', 'Catalog optimization', 'Sales velocity scaling'],
      micro: 'Win the marketplace shelf.'
    },
    {
      title: 'Remarketing Systems',
      description: 'Re-engage abandoned visitors, cart users, video viewers, and dormant leads with precision messaging, dynamic creatives, and cross-platform retargeting.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Cart abandonment recovery', 'Dynamic creative retargeting', 'Cross-platform sequences', 'Dormant lead reactivation'],
      micro: 'No qualified visitor left behind.'
    }
  ];

  const technologies = [
    { category: 'Ad Platforms', items: ['Google Ads', 'Meta Ads Manager', 'LinkedIn Campaign Manager', 'YouTube Ads', 'TikTok Ads'] },
    { category: 'Analytics & Attribution', items: ['Google Analytics 4', 'Google Tag Manager', 'Meta Pixel', 'LinkedIn Insight Tag', 'Segment'] },
    { category: 'CRO & Landing Pages', items: ['Unbounce', 'Instapage', 'VWO', 'Hotjar', 'Google Optimize'] },
    { category: 'Reporting & BI', items: ['Looker Studio', 'Supermetrics', 'Triple Whale', 'Northbeam', 'Databox'] },
    { category: 'Creative & Testing', items: ['Canva Pro', 'Adobe Creative Suite', 'Figma', 'CapCut', 'Motion'] },
    { category: 'Automation & CRM', items: ['HubSpot', 'Salesforce', 'Zapier', 'Make', 'ActiveCampaign'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Paid growth services across every major channel. We don\'t default to one platform — we go where your buyers are and build acquisition systems that scale.',
      capabilities,
      trustPillars: [
        { title: 'Revenue-first optimization', tag: 'Revenue', description: 'Every campaign is measured against CAC, ROAS, pipeline value, and customer lifetime value — not clicks or impressions.' },
        { title: 'Full-funnel ownership', tag: 'Ownership', description: 'Ads, landing pages, tracking, remarketing, reporting, and scale — managed together under one growth pod.' },
        { title: 'Multi-platform mastery', tag: 'Channels', description: 'Google, Meta, LinkedIn, YouTube, marketplaces, and remarketing — we go where your buyers are.' },
        { title: 'Conversion science', tag: 'Testing', description: 'Structured testing frameworks across copy, creatives, offers, pages, and audiences that compound performance.' },
        { title: 'Enterprise-grade reporting', tag: 'Reporting', description: 'Live dashboards, weekly insights, and monthly strategic reviews tied to business KPIs.' }
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

export default PerformanceMarketing;
