import React from 'react';
import { Zap, Search, Layers, Activity, Target, BrainCircuit, Eye, TrendingUp, Shield, MessageCircle, BarChart3, Users, Megaphone, PenTool, Share2, Video, Globe, Briefcase } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  SocialChallengesSection,
  WhySocialMattersSection,
  FivePhaseMethodology,
  ExecutionPodSection,
  BusinessTypesSection,
  SocialReadinessMagnet
} from './components/SocialMediaCustomSections';

const SocialMediaManagement = () => {
  const service = {
    name: 'Social Media Management',
    titleLine1: 'Social Media',
    titleHighlight: 'Management.',
    slug: 'social-media-management',
    shortDescription: 'We don\'t post for visibility alone. We engineer platform-specific content, campaigns, communities, and paid social systems that move audiences from awareness to conversion.',
    description: 'Turn social media into a measurable growth channel. Kangqore deploys full-stack execution pods that handle strategy, design, copy, paid ads, and analytics under one unified operating model.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1260&q=80',

    primaryButton: { text: 'Get Your Social Media Growth Blueprint', link: '/contact' },
    secondaryButton: { text: 'Schedule a Strategy Call', link: '#capabilities' },
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Marketing', link: '/department/digital-marketing' },
      { label: 'Social Media Management' }
    ],

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
        statusValue: 'DEPLOYED'
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
          { title: 'Analytics & Attribution', label: 'Intelligence', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Track reach, engagement, CTR, CPL, conversions, content performance, and revenue attribution with weekly and monthly reports.' }
        ]
      },
      matrix: {
        engineId: 'SOCIAL GROWTH ENGINE™',
        title: 'The Growth Matrix.',
        subtext: 'A structured 5-phase methodology that transforms social media from a cosmetic activity into a measurable growth channel.',
        layers: [
          { title: 'Audit', id: 'SMM_AUDIT', icon: <Search />, desc: 'Profile audit, competitor analysis, audience mapping, content gap identification, and platform readiness scoring.' },
          { title: 'Strategize', id: 'SMM_STRAT', icon: <Layers />, desc: 'Content pillars, platform priorities, campaign themes, creative direction, and KPI framework definition.' },
          { title: 'Execute', id: 'SMM_EXEC', icon: <Zap />, desc: 'Content production, scheduling, community activation, paid campaign launch, and engagement management.' },
          { title: 'Optimize', id: 'SMM_OPT', icon: <Activity />, desc: 'Performance tracking, format testing, strategy refinement, ROI improvement, and repeatable engine building.' }
        ]
      },
      schematic: {
        titleLine1: 'Measurable',
        titleHighlight: 'Growth.',
        description: 'Your social media should be your most measurable growth channel. We make every post, campaign, and community interaction accountable to business outcomes.',
        stats: [
          { label: 'Reach', val: 'SCALED' },
          { label: 'Pipeline', val: 'CONNECTED' },
          { label: 'ROI', val: 'TRACKED' }
        ]
      }
    },

    trustStrip: "Trusted by startups, B2B companies, and enterprise brands across 30+ industries to transform social media from a content calendar into a governed revenue channel.",

    whyKangqore: [
      { title: 'Data-Driven Strategy', description: 'No guesswork. Every content and campaign decision is tied to audience analysis, competitor benchmarking, platform data, and performance metrics.', icon: BarChart3 },
      { title: 'Full Team, Not One Freelancer', description: 'You get strategy, design, copy, community management, paid ads, and analytics under one operating model — not a single overworked generalist.', icon: Users },
      { title: 'Conversion-Focused Content', description: 'Likes are useful only when they support reach, trust, pipeline, sales, hiring, or brand authority. We engineer content for business outcomes, not vanity metrics.', icon: TrendingUp }
    ],

    useCases: [
      { name: 'Financial Services', description: 'Compliance-aware content, trust-building education, investor communication, and lead-generation campaigns.', icon: Shield },
      { name: 'SaaS & Software', description: 'Product demos, founder-led posts, customer proof, launch campaigns, feature education, and LinkedIn authority building.', icon: BrainCircuit },
      { name: 'Healthcare & Wellness', description: 'Patient education, wellness tips, doctor-led trust content, awareness campaigns, and compliant storytelling.', icon: Activity },
      { name: 'E-commerce & DTC', description: 'UGC campaigns, influencer seeding, product launches, shoppable content, seasonal campaigns, and conversion-focused creatives.', icon: Globe },
      { name: 'Real Estate', description: 'Property reels, local market updates, neighborhood content, agent branding, virtual tours, and lead nurturing.', icon: Briefcase },
      { name: 'Crypto & Web3', description: 'Community management, Discord/Telegram growth, launch hype, FUD response, influencer partnerships, and education-first content.', icon: Zap }
    ],

    customFAQs: [
      {
        question: 'How long does it take to see results?',
        answer: 'You can usually see early engagement improvement within 30 days. Stronger pipeline, follower quality, and conversion signals typically build over 60–90 days.'
      },
      {
        question: 'Do you run paid social media ads?',
        answer: 'Yes. We manage paid campaigns across Meta, LinkedIn, YouTube, X, and other relevant platforms with A/B testing, audience targeting, retargeting, and budget optimization.'
      },
      {
        question: 'Which platforms should my business be on?',
        answer: 'We decide based on your audience, product, geography, industry, sales cycle, and available content formats. Not every brand needs every platform.'
      },
      {
        question: 'Do you create all the content?',
        answer: 'Yes. We handle strategy, copy, design, video editing, scheduling, and reporting. Your team can simply approve through our structured workflow.'
      },
      {
        question: 'Can you manage multiple accounts or brands?',
        answer: 'Yes. We manage multi-brand, multi-region, and multi-platform social ecosystems with governance, approval flows, and unified reporting.'
      },
      {
        question: 'How do you measure success?',
        answer: 'We track reach, engagement, follower quality, CTR, leads, CPL, conversions, community growth, and revenue attribution where available. Weekly and monthly reports show what worked, what failed, and what needs to change.'
      },
      {
        question: 'Can we approve content before it goes live?',
        answer: 'Yes. We run weekly, bi-weekly, or campaign-based approval workflows through structured content calendars with full visibility.'
      },
      {
        question: 'What if our current social media is not performing?',
        answer: 'We begin with an audit, identify weak points, rebuild content strategy, optimize profiles, and launch a performance recovery plan within the first 30 days.'
      }
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
    postFAQSections: null
  };

  const department = {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Transform your brand with data-driven digital marketing strategies.',
    icon: <Megaphone className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'LinkedIn Marketing',
      description: 'B2B authority, founder branding, thought leadership, lead nurturing, executive content, carousel strategy, profile optimization, and industry-specific targeting that turns connections into pipeline.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Executive thought leadership', 'Carousel & document strategy', 'Profile optimization', 'B2B lead nurturing campaigns'],
      micro: 'Where B2B pipeline begins.'
    },
    {
      title: 'Instagram Marketing',
      description: 'Reels, stories, feed design, influencer collaborations, branded content, community growth, caption writing, and paid boosts engineered for algorithm reach and audience conversion.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Reels & Stories strategy', 'Influencer collaboration', 'Community growth systems', 'Paid boost optimization'],
      micro: 'Visual storytelling at scale.'
    },
    {
      title: 'Facebook & Meta Campaigns',
      description: 'Community building, retargeting, lead generation, local campaigns, full-funnel paid ads, event promotion, and audience targeting across the Meta ecosystem.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Full-funnel paid ads', 'Retargeting & lookalikes', 'Community group management', 'Local campaign activation'],
      micro: 'Full-funnel Meta execution.'
    },
    {
      title: 'YouTube Strategy',
      description: 'Video scripting, channel strategy, Shorts, long-form content planning, SEO optimization, retention hooks, and educational content that builds authority and drives subscriber growth.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Channel strategy & branding', 'Shorts & long-form planning', 'YouTube SEO optimization', 'Retention hook engineering'],
      micro: 'Long-form authority engine.'
    },
    {
      title: 'X / Twitter Marketing',
      description: 'Founder POVs, real-time commentary, threads, trend surfing, community engagement, influencer amplification, and hashtag strategy for brands that need to own the conversation.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Thread & POV strategy', 'Real-time trend surfing', 'Community engagement loops', 'Influencer amplification'],
      micro: 'Own the conversation.'
    },
    {
      title: 'Pinterest & Visual Discovery',
      description: 'SEO-led pinning, visual discovery, branded boards, product traffic, seasonal campaigns, and DTC inspiration funnels that drive long-tail organic traffic.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['SEO-led pin strategy', 'Branded board design', 'Seasonal campaign planning', 'DTC traffic funnels'],
      micro: 'Visual search, long-tail reach.'
    }
  ];

  const technologies = [
    { category: 'Scheduling & Publishing', items: ['Hootsuite', 'Sprout Social', 'Buffer', 'Later', 'Publer'] },
    { category: 'Analytics & Reporting', items: ['Google Analytics', 'Sprout Analytics', 'Iconosquare', 'Brandwatch', 'Socialbakers'] },
    { category: 'Content & Design', items: ['Canva Pro', 'Adobe Creative Suite', 'CapCut', 'Figma', 'Lottie'] },
    { category: 'Paid Social', items: ['Meta Ads Manager', 'LinkedIn Campaign Manager', 'Google Ads', 'TikTok Ads', 'X Ads'] },
    { category: 'Community & Listening', items: ['Mention', 'Brand24', 'Talkwalker', 'Sprinklr', 'Khoros'] },
    { category: 'AI & Automation', items: ['ChatGPT', 'Jasper', 'Copy.ai', 'Lately.ai', 'Predis.ai'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Platform-specific social media marketing services. We don\'t copy-paste posts across channels — every platform gets native content designed for its algorithm and audience behavior.',
      capabilities,
      trustPillars: [
        { title: 'Platform-native content', tag: 'Native', description: 'Every platform gets content designed for its algorithm, audience behavior, and conversion mechanics.' },
        { title: 'Full-stack execution team', tag: 'Team', description: 'Strategist, copywriter, designer, community manager, paid specialist, and analyst — not a freelancer.' },
        { title: 'KPI-led content creation', tag: 'Data', description: 'Every piece of content is tied to measurable outcomes — reach, engagement, pipeline, or revenue.' },
        { title: 'Compliance-aware execution', tag: 'Governance', description: 'Approval flows, brand guardrails, and content governance for regulated and sensitive industries.' },
        { title: 'Transparent performance reporting', tag: 'Reporting', description: 'Weekly and monthly reports showing what worked, what failed, and what changes next.' }
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

export default SocialMediaManagement;
