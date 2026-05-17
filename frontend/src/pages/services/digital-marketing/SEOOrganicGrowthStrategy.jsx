import React from 'react';
import { Search, Layers, Zap, Activity, Target, TrendingUp, Shield, BarChart3, Users, DollarSign, MousePointerClick, Gauge, Globe, Briefcase, GraduationCap, Heart, Landmark, ShoppingCart, LineChart, Cpu, Bot, Megaphone, BrainCircuit, PenTool } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  SEOChallengesSection,
  WhySEOMattersSection,
  FourPhaseGrowthMethod,
  SEOGrowthPodSection,
  SEOSuccessSection,
  SEOReadinessMagnet,
  LogoTrustSection
} from '../../../components/services/growth/SEOCustomSections';

const SEOOrganicGrowthStrategy = () => {
  const service = {
    name: 'SEO & Organic Growth Strategy',
    titleLine1: 'SEO Growth',
    titleHighlight: 'Strategy',
    slug: 'seo-organic-growth',
    shortDescription: 'Build a stronger, lower-cost acquisition engine with SEO strategies designed to improve rankings, capture high-intent traffic, increase authority, and generate measurable business growth over time.',
    description: 'Stop Renting Traffic. Start Owning Demand. We combine technical SEO, content strategy, on-page optimisation, analytics, and conversion thinking to turn search visibility into a scalable revenue channel.',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?auto=format&fit=crop&w=1260&q=80',

    primaryButton: { text: 'Book a Growth Strategy Call', link: '/contact' },
    secondaryButton: { text: 'Request Free SEO Audit', link: '#capabilities' },
    videoBackground: '/videos/business-meeting-6774639.mp4',
    hideGenericMidPageCta: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Marketing', link: '/department/digital-marketing' },
      { label: 'SEO & Organic Growth' }
    ],

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
        statusValue: 'OPTIMIZING'
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
          { title: 'Analytics & Reporting', label: 'Intelligence', icon: <BarChart3 className="w-5 h-5 text-gray-400" />, content: 'Granular tracking of rankings, traffic value, and conversion attribution.' }
        ]
      },
      matrix: {
        engineId: 'SEO ENGINE™',
        title: 'Core Delivery Pillars.',
        subtext: 'The architectural framework for total search dominance and organic compounding growth.',
        layers: [
          { title: 'Technical', id: 'SEO_TECH', icon: <Zap />, desc: 'Resolving crawl issues, indexation, speed bottlenecks, and structural flaws.' },
          { title: 'Content', id: 'SEO_CONT', icon: <PenTool />, desc: 'Building semantic clusters and cornerstone assets that answer user intent.' },
          { title: 'Authority', id: 'SEO_AUTH', icon: <Shield />, desc: 'Acquiring high-DR links, brand mentions, and digital PR placements.' },
          { title: 'Analytics', id: 'SEO_ANAL', icon: <BarChart3 />, desc: 'Connecting organic traffic directly to pipeline and business revenue.' }
        ]
      },
      schematic: {
        titleLine1: 'Structural',
        titleHighlight: 'Optimization.',
        description: 'True organic growth isn\'t about chasing algorithms; it\'s about answering user intent better than anyone else while ensuring your site architecture makes that content accessible to search engines.',
        stats: [
          { label: 'Visibility', val: 'MAXIMIZED' },
          { label: 'Intent', val: 'CAPTURED' },
          { label: 'Traffic', val: 'COMPOUNDING' }
        ]
      }
    },

    trustStrip: "Empowering enterprises to build defensible, compounding organic traffic moats across complex competitive landscapes.",

    whyKangqore: [
      { title: 'Revenue-Focused Strategy', description: 'We optimize for leads, pipeline, and growth — not just empty vanity metrics like impressions.', icon: DollarSign },
      { title: 'Custom Roadmaps', description: 'Every strategy is built around your unique business model, buyer journey, and market realities.', icon: Target },
      { title: 'Strong Technical Capability', description: 'We solve the structural problems and complex indexing issues that many agencies overlook.', icon: Zap }
    ],

    useCases: [
      { name: 'SaaS & Technology', description: 'Capture demand across problem-aware, solution-aware, and comparison searches.', icon: BrainCircuit },
      { name: 'Healthcare', description: 'Local visibility, treatment awareness, and high-trust patient acquisition.', icon: Heart },
      { name: 'Real Estate', description: 'Property searches, local maps visibility, and investor lead generation.', icon: Landmark },
      { name: 'E-commerce', description: 'Grow category, product, and high-intent search traffic for online stores.', icon: ShoppingCart },
      { name: 'Education', description: 'Program discovery, admissions traffic, and authoritative content scaling.', icon: GraduationCap },
      { name: 'Professional Services', description: 'Establish thought leadership, drive B2B inquiries, and dominate niche terms.', icon: Briefcase }
    ],

    customFAQs: [
      {
        question: 'How long does SEO take to show results?',
        answer: 'Some technical and on-page improvements can create early momentum quickly. Strong compounding growth usually builds over 3–6 months depending on competition and market conditions.'
      },
      {
        question: 'Do you guarantee rankings?',
        answer: 'No credible SEO partner guarantees rankings due to search engine algorithm independence. We guarantee disciplined execution, strategic clarity, and measurable progress.'
      },
      {
        question: 'Can SEO generate leads?',
        answer: 'Yes. When SEO targets commercial intent and provides strong landing experiences, it can become a powerful, highly-qualified lead generation channel.'
      },
      {
        question: 'Is SEO better than paid ads?',
        answer: 'They solve different problems. Paid drives immediate traffic; SEO builds long-term demand ownership. The strongest acquisition strategies often use both in tandem.'
      },
      {
        question: 'How do you interface with our existing development teams?',
        answer: 'We provide execution-ready tickets (Jira/Azure) detailing exactly what code needs to change, why, and how to verify it, acting as an extension of your product engineering cycle.'
      },
      {
        question: 'Do you work with growing businesses and enterprises?',
        answer: 'Yes. We work with ambitious startups, scaling companies, and established enterprise brands managing complex multi-national architectures.'
      }
    ],

    preMatrixSection: null,
    customSections: [
      <LogoTrustSection key="logo-trust" />,
      <SEOChallengesSection key="seo-challenges" />,
      <WhySEOMattersSection key="why-seo-matters" />,
      <SEOGrowthPodSection key="seo-pod" />
    ],
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <FourPhaseGrowthMethod />
        <SEOSuccessSection />
        <SEOReadinessMagnet />
      </div>
    ),
    postFAQSections: null
  };

  const department = {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Transforming clicks into customers through precise, data-driven digital experiences.',
    icon: <MousePointerClick className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'SEO Strategy & Analytics',
      description: 'We build data-led SEO roadmaps backed by search demand, competitor intelligence, performance analytics, and commercial priorities—so every action ties to measurable growth.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Search demand mapping', 'Competitor benchmarking', 'Performance roadmaps', 'Revenue attribution'],
      micro: 'Data-driven execution.'
    },
    {
      title: 'Keyword Research Services',
      description: 'Identify high-intent, high-opportunity keywords across the full buyer journey. We map opportunities that attract qualified traffic and convert into pipeline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Commercial intent mapping', 'Long-tail identification', 'Keyword gap analysis', 'Search volume tracking'],
      micro: 'Capture high-intent demand.'
    },
    {
      title: 'SEO Audit Services',
      description: 'Uncover technical blockers, content gaps, crawl inefficiencies, and structural issues that suppress rankings. We turn hidden problems into growth opportunities.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Technical site crawls', 'Indexation analysis', 'Penalty recovery', 'Architecture review'],
      micro: 'Uncover growth barriers.'
    },
    {
      title: 'On-Page SEO Services',
      description: 'Optimise pages for relevance, intent alignment, engagement, and conversion. From metadata to internal links, every element is engineered to perform.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Intent matching', 'Metadata optimization', 'Internal link structuring', 'UX/UI enhancements'],
      micro: 'Make every page count.'
    },
    {
      title: 'Off-Page SEO Services',
      description: 'Strengthen authority through high-quality backlinks, digital mentions, trust signals, and reputation-building strategies that improve rankings sustainably.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['High-DR link building', 'Digital PR placements', 'Brand mention acquisition', 'Trust signal scaling'],
      micro: 'Build domain authority.'
    },
    {
      title: 'SEO Content Services',
      description: 'Create search-led content ecosystems that educate buyers, capture demand, and build topical authority—far beyond publishing random blogs.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Topic cluster mapping', 'Pillar content creation', 'Editorial calendars', 'Content gap filling'],
      micro: 'Answer the user\'s needs.'
    },
    {
      title: 'Blogging / Digital PR Services',
      description: 'Expand reach with strategic storytelling, media placements, industry mentions, and thought leadership content that earns visibility and credibility.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Media syndication', 'Thought leadership', 'Press release distribution', 'Influencer outreach'],
      micro: 'Earn industry visibility.'
    },
    {
      title: 'Mobile SEO',
      description: 'Optimise mobile experience, speed, UX signals, and technical performance for the devices where most search journeys now begin.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: ['Mobile-first indexing', 'Core Web Vitals', 'Responsive design audits', 'Touch target optimization'],
      micro: 'Dominate mobile search.'
    },
    {
      title: 'Website Migration',
      description: 'Protect rankings, traffic, and authority during redesigns, domain moves, or platform changes with structured migration planning and zero-chaos execution.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: ['URL mapping strategy', '301 redirect implementation', 'Pre-launch testing', 'Post-migration monitoring'],
      micro: 'Zero-chaos transitions.'
    },
    {
      title: 'Local SEO',
      description: 'Win local search visibility through Google Business optimisation, location pages, reviews strategy, and map-pack dominance that drives real footfall and leads.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: ['Google Business optimization', 'Local citation syndication', 'Review management', 'Hyperlocal keywords'],
      micro: 'Dominate your geography.'
    }
  ];

  const technologies = [
    { category: 'Technical SEO', items: ['Screaming Frog', 'Sitebulb', 'Google Search Console', 'DeepCrawl', 'Lighthouse'] },
    { category: 'Keyword & Market Intel', items: ['Ahrefs', 'SEMrush', 'Moz', 'Google Keyword Planner', 'AnswerThePublic'] },
    { category: 'Content & On-Page', items: ['Surfer SEO', 'Clearscope', 'MarketMuse', 'Frase', 'Grammarly Business'] },
    { category: 'Local SEO', items: ['BrightLocal', 'Yext', 'Whitespark', 'Google Business Profile'] },
    { category: 'Analytics & Reporting', items: ['Google Analytics 4', 'Looker Studio', 'Supermetrics', 'BigQuery', 'Adobe Analytics'] },
    { category: 'CRO & UX', items: ['Hotjar', 'Crazy Egg', 'VWO', 'Microsoft Clarity', 'Optimizely'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Integrated SEO execution across strategy, technical foundations, content authority, migration protection, and local visibility—built to compound organic growth.',
      capabilities,
      trustPillars: [
        { title: 'Total Codebase Transparency', tag: 'Technical Focus', description: 'We embed with your dev teams to ensure SEO recommendations actually meet deployment standards.' },
        { title: 'Conversion-Led Strategy', tag: 'Intent Mapping', description: 'We optimize for revenue-driving transactional search intent, not just empty vanity traffic.' },
        { title: 'Algorithmic Resilience', tag: 'Future-Proof', description: 'Our white-hat strategies are built to withstand and benefit from continuous core algorithm updates.' },
        { title: 'Advanced Analytics', tag: 'Data Science', description: 'Deep quantitative analysis tying organic position lifts directly to pipeline creation and lead velocity.' }
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

export default SEOOrganicGrowthStrategy;
