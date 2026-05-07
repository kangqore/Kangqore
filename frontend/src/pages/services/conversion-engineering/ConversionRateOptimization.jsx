import React from 'react';
import { Filter, Search, Layers, Zap, Activity, Target, TrendingUp, Shield, BarChart3, Users, DollarSign, MousePointerClick, Gauge, Rocket, Briefcase, GraduationCap, Heart, Landmark, ShoppingCart, LineChart, BrainCircuit, PenTool, Database, MonitorPlay, MousePointer2, Eye, Bot, Settings, Globe } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  CROChallengesSection,
  WhyCROMattersSection,
  SixPhaseCROMethod,
  CROSuccessSection,
  CROReadinessMagnet,
  CROLogoTrustSection
} from './components/CROCustomSections';

const ConversionRateOptimization = () => {
  const service = {
    name: 'Conversion Rate Optimization',
    titleLine1: 'Conversion Rate',
    titleHighlight: 'Optimization.',
    slug: 'conversion-rate-optimization',
    shortDescription: 'Turn Existing Traffic Into Measurable Revenue.',
    description: 'Kangqore transforms underperforming websites, landing pages, and funnels into high-converting revenue systems using behavioral science, UX engineering, and data-driven experimentation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',

    primaryButton: { text: 'Engineer My Revenue Engine', link: '/contact' },
    secondaryButton: { text: 'Deploy Free Conversion Audit', link: '/contact' },
    videoBackground: '/videos/business-meeting-6774639.mp4',
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Conversion Engineering', link: '/department/conversion-engineering' },
      { label: 'Conversion Rate Optimization' }
    ],

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
        statusValue: 'OPTIMIZING'
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
          { title: 'Personalization', label: 'Scale', icon: <Bot className="w-5 h-5 text-gray-400" />, content: 'We deliver the right message to the right user through behavioral segmentation and dynamic content.' }
        ]
      },
      matrix: {
        engineId: 'CONVERSION SYSTEM™',
        title: 'Core CRO Pillars.',
        subtext: 'The architectural framework for total conversion dominance and frictionless revenue flow.',
        layers: [
          { title: 'Analyze', id: 'CRO_ANALYZE', icon: <Search />, desc: 'Understanding user behavior through heatmaps, session recordings, and drop-off diagnostics.' },
          { title: 'Hypothesize', id: 'CRO_HYPOTHESIZE', icon: <BrainCircuit />, desc: 'Formulating data-backed ideas based on behavioral science and conversion heuristics.' },
          { title: 'Engineer', id: 'CRO_ENGINEER', icon: <Settings />, desc: 'Redesigning landing pages, forms, and checkouts to eliminate friction and cognitive load.' },
          { title: 'Test', id: 'CRO_TEST', icon: <Activity />, desc: 'Validating every change with rigorous A/B and multivariate testing for statistical certainty.' }
        ]
      },
      schematic: {
        titleLine1: 'Frictionless',
        titleHighlight: 'Experience.',
        description: 'True growth engineering removes every obstacle between your prospect and their desired outcome, leveraging behavioral science to accelerate decision making at every stage.',
        stats: [
          { label: 'Conversion', val: 'MAXIMIZED' },
          { label: 'Friction', val: 'REMOVED' },
          { label: 'Revenue', val: 'SCALED' }
        ]
      }
    },

    trustStrip: "Helping ambitious brands scale profitability by turning more of their existing traffic into measurable revenue.",

    whyKangqore: [
      { title: 'Revenue-First Thinking', description: 'Every decision and hypothesis is strictly tied to ROI and commercial impact.', icon: DollarSign },
      { title: 'Deep Behavioral Insight', description: 'We don’t just track clicks; we understand the psychology of why users convert.', icon: BrainCircuit },
      { title: 'Full-Funnel Ownership', description: 'We optimize the entire customer journey, not just isolated landing pages.', icon: Layers },
      { title: 'Faster Experimentation', description: 'Our agile testing frameworks mean more tests, faster learnings, and quicker wins.', icon: Zap },
      { title: 'Enterprise Execution', description: 'Built for scale, performance, and precision engineering across complex stacks.', icon: Rocket },
      { title: 'Scientific Rigor', description: 'We rely on statistical significance, eliminating costly guesswork.', icon: Activity }
    ],

    useCases: [
      { name: 'SaaS & Technology', description: 'Optimize trial signups, onboarding flows, and trial-to-paid conversion rates.', icon: BrainCircuit },
      { name: 'E-commerce & D2C', description: 'Reduce cart abandonment, increase AOV, and engineer post-purchase upsells.', icon: ShoppingCart },
      { name: 'Real Estate', description: 'Streamline property inquiry funnels and investor lead generation journeys.', icon: Landmark },
      { name: 'Healthcare', description: 'Simplify appointment bookings and patient acquisition while maintaining trust.', icon: Heart },
      { name: 'Education', description: 'Increase student enrollment applications and optimise course discovery.', icon: GraduationCap },
      { name: 'Finance & Insurance', description: 'Simplify complex application processes and build high-trust conversion pathways.', icon: DollarSign },
      { name: 'Professional Services', description: 'Improve lead quality, optimise form submissions, and deploy automated nurturing.', icon: Briefcase }
    ],

    customFAQs: [
      {
        question: 'What is Conversion Rate Optimization (CRO)?',
        answer: 'CRO is the systematic process of increasing the percentage of website visitors who take a desired action—be that filling out a form, becoming customers, or otherwise. We use behavioral science and A/B testing to achieve this.'
      },
      {
        question: 'How is Kangqore different from standard CRO agencies?',
        answer: 'Most agencies focus on button colors or minor tweaks. We engineer full commercial systems. We combine behavioral psychology, advanced data telemetry, and rigorous experimentation to drive measurable revenue, not just vanity metrics.'
      },
      {
        question: 'How long does it take to see results from CRO?',
        answer: 'While we often find "quick wins" by removing obvious friction points within the first 30 days, a structured testing program compounds its value over 3–6 months as we validate larger hypotheses and scale winning variations.'
      },
      {
        question: 'How much traffic do I need to conduct A/B testing?',
        answer: 'To reach statistical significance promptly, we typically look for at least 10,000 unique visitors per month on the specific pages being tested. However, lower-traffic sites can still benefit immensely from heuristic and behavioral UX improvements.'
      },
      {
        question: 'Do you design and code the variations?',
        answer: 'Yes. We are full-stack execution partners. Our team includes specialized CRO designers, front-end engineers, and QA specialists who handle the entire process from hypothesis to deployed variation.'
      }
    ],

    preMatrixSection: null,
    customSections: [
      <CROLogoTrustSection key="cro-logo-trust" />,
      <CROChallengesSection key="cro-challenges" />,
      <WhyCROMattersSection key="why-cro-matters" />
    ],
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <SixPhaseCROMethod />
        <CROSuccessSection />
        <CROReadinessMagnet />
      </div>
    ),
    postFAQSections: null
  };

  const department = {
    name: 'Conversion Engineering',
    slug: 'conversion-engineering',
    description: 'Specialized optimization to transform traffic into measurable business outcomes.',
    icon: <TrendingUp className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Full Funnel CRO Strategy',
      description: 'Align acquisition, landing pages, and conversion paths into one seamless, high-converting system.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Cross-channel alignment', 'End-to-end journey mapping', 'Attribution gap discovery', 'Revenue pipeline modeling', 'Consistent messaging architecture'],
      micro: 'Unify the journey.'
    },
    {
      title: 'Landing Page Optimization',
      description: 'Design dedicated pages that guide, persuade, and convert high-intent traffic with maximum efficiency.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['Dynamic message matching', 'Persuasion architecture', 'Trust signal enhancement', 'Cognitive load reduction', 'Mobile-first conversion design'],
      micro: 'Convert the click.'
    },
    {
      title: 'Checkout & Form Optimization',
      description: 'Reduce friction and cognitive barriers to increase completion rates at the most critical stage of the funnel.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['Field reduction & flow logic', 'Inline validation & error handling', 'Trust and security badging', 'Multi-step form psychology', 'Cart abandonment recovery'],
      micro: 'Remove friction.'
    },
    {
      title: 'E-commerce CRO',
      description: 'Improve product discovery, streamline cart flow, and engineer pathways for repeat purchases.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Product page (PDP) enhancements', 'Search & filtering optimization', 'Cross-sell / upsell mechanics', 'Post-purchase loyalty loops', 'Average Order Value (AOV) growth'],
      micro: 'Scale retail revenue.'
    },
    {
      title: 'SaaS Conversion Optimization',
      description: 'Drive more qualified demos, free trials, product activation, and premium tier upgrades.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['Trial-to-paid conversion', 'Frictionless onboarding flows', 'Feature adoption triggers', 'Pricing page psychology', 'Churn reduction systems'],
      micro: 'Accelerate adoption.'
    },
    {
      title: 'CRO for Lead Generation',
      description: 'Increase the volume of highly qualified sales leads—not just cheap, low-intent form fills.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Lead qualification matrices', 'Interactive calculators & quizzes', 'B2B consultative funnels', 'Gated asset optimization', 'Lead scoring integration'],
      micro: 'Generate quality.'
    },
    {
      title: 'Heatmaps & Analytics Integration',
      description: 'See exactly where performance breaks with advanced behavioral tracking and session deep-dives.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Scroll & click heatmapping', 'Rage-click diagnostics', 'Session recording analysis', 'GA4 funnel tracking', 'Event taxonomy architecture'],
      micro: 'Visualize behavior.'
    },
    {
      title: 'AI-Powered Optimization',
      description: 'Use predictive insights and machine learning to automate testing and dynamically personalize experiences.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: ['Predictive audience segmentation', 'Dynamic content serving', 'Automated multivariate testing', 'Intent-based personalization', 'Real-time offer adaptation'],
      micro: 'Optimize with AI.'
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
      capabilitiesTitle: 'Built for Scalable Conversion Growth.',
      capabilitiesDescription: 'In 2026, relying on guesswork is expensive. Our CRO systems merge deep psychological research, rigorous quantitative analytics, and continuous multivariate testing to systematically convert friction into revenue flow.',
      capabilities,
      trustPillars: [
        { title: 'Revenue-First Execution', tag: 'Commercial Focus', description: 'Every recommendation is measured against commercial impact—not vanity metrics or isolated page improvements.' },
        { title: 'Full-System Thinking', tag: 'End-to-End', description: 'We optimise acquisition, conversion, retention, and expansion together as one connected revenue system.' },
        { title: 'Scientific Rigor', tag: 'Data Science', description: 'Structured experimentation replaces guesswork. We wait for statistical significance before declaring winners.' },
        { title: 'AI-Native Advantage', tag: 'Modern Intelligence', description: 'Modern automation and intelligence increase speed, precision, and personalisation across the entire funnel.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      ctaTitle: 'Stop Leaving Revenue on the Table.',
      ctaDescription: 'Turn passive traffic into high-yield commercial outcomes. Our engineers are ready to audit your funnel for friction, cognitive load, and revenue leakage.',
      ctaButtonText: 'Start My Conversion Engineering',
      ctaSecondaryButton: { text: 'Claim Performance Blueprint', link: '/contact' }
    },
    department
  };

  return (
    <div className="cro-page-override">
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default ConversionRateOptimization;
