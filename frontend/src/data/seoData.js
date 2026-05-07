// ─── Centralized SEO Metadata Registry ─────────────────────────────────────────
// Single source of truth for all page-level SEO metadata.
// Every description is 150–160 characters, keyword-rich, and unique.
// ────────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://kangqore.com';

// ─── Core Pages ────────────────────────────────────────────────────────────────
export const coreSEO = {
  home: {
    title: 'Enterprise AI, Cloud & Digital Transformation',
    description: 'Kangqore enables enterprises to achieve end-to-end digital transformation through modern engineering, AI-enabled innovation, and intelligence-first architecture.',
    keywords: 'enterprise AI, digital transformation, cloud engineering, AI consulting, IT services, software engineering, Kangqore',
    url: '/',
  },
  aboutUs: {
    title: 'About Us — Engineering Modern Business',
    description: 'Kangqore is a value-driven IT company delivering AI, cloud, cybersecurity, and digital transformation solutions across 15 departments and 61+ services.',
    keywords: 'about Kangqore, IT company, enterprise solutions, digital engineering, AI innovation',
    url: '/about-us',
  },
  services: {
    title: 'Our Services — 15 Departments · 61 Services',
    description: 'Explore Kangqore\'s full-spectrum digital capabilities: AI & Cognitive, Cloud Engineering, Cybersecurity, Digital Transformation, and 11 more departments.',
    keywords: 'IT services, AI services, cloud services, digital transformation services, enterprise technology',
    url: '/services',
  },
  contact: {
    title: 'Contact Us — Talk to Our Experts',
    description: 'Get in touch with Kangqore\'s experts for AI, cloud, cybersecurity, and digital transformation consulting. Start your enterprise transformation journey today.',
    keywords: 'contact Kangqore, enterprise consulting, IT consulting, get in touch, talk to experts',
    url: '/contact',
  },
  careers: {
    title: 'Careers — Build the Future With Us',
    description: 'Join Kangqore and work on cutting-edge AI, cloud, and digital transformation projects. Explore open positions and grow your career in enterprise technology.',
    keywords: 'Kangqore careers, IT jobs, AI careers, cloud engineering jobs, software engineer jobs',
    url: '/careers',
  },
  partners: {
    title: 'Partners & Alliances',
    description: 'Kangqore partners with leading technology providers including AWS, Google Cloud, Microsoft, Salesforce, and ServiceNow to deliver best-in-class solutions.',
    keywords: 'Kangqore partners, technology alliances, AWS partner, Google Cloud partner, enterprise partnerships',
    url: '/partners',
  },
  values: {
    title: 'Values & Culture — Intelligence-First Engineering',
    description: 'Discover Kangqore\'s values: innovation, integrity, excellence, and accountability. Our intelligence-first culture drives everything we build and deliver.',
    keywords: 'Kangqore values, company culture, IT culture, engineering values, intelligence-first',
    url: '/values',
  },
  leadership: {
    title: 'Leadership Team',
    description: 'Meet the leadership team driving Kangqore\'s vision for enterprise digital transformation. Experienced executives in AI, cloud, cybersecurity, and engineering.',
    keywords: 'Kangqore leadership, executive team, CTO, CEO, engineering leadership',
    url: '/leadership',
  },
  eqore: {
    title: 'Eqore — AI-Powered Enterprise Intelligence',
    description: 'Eqore is Kangqore\'s proprietary AI platform that powers intelligent automation, predictive analytics, and enterprise decision-making at scale.',
    keywords: 'Eqore AI platform, enterprise AI, intelligent automation, AI-powered decisions',
    url: '/eqore',
  },
  brandIdentity: {
    title: 'Brand Identity & Design System',
    description: 'Explore Kangqore\'s brand identity: our logo, color palette, typography, and design language that defines our intelligence-first engineering philosophy.',
    keywords: 'Kangqore brand, design system, brand identity, visual identity',
    url: '/brand-identity',
  },
  location: {
    title: 'Our Locations — Global Presence',
    description: 'Kangqore operates across multiple global locations, delivering enterprise technology solutions with timezone-aligned support and local expertise.',
    keywords: 'Kangqore locations, office locations, global presence, IT company locations',
    url: '/location',
  },
  communities: {
    title: 'Communities — Engineering Impact Together',
    description: 'Join Kangqore\'s developer communities, attend meetups, and collaborate on open-source projects. We believe in building together.',
    keywords: 'Kangqore communities, developer community, tech meetups, open source',
    url: '/communities',
  },
  testimonials: {
    title: 'Client Testimonials & Success Stories',
    description: 'Read what our clients say about working with Kangqore. Real testimonials from enterprises that transformed with our AI, cloud, and engineering solutions.',
    keywords: 'Kangqore testimonials, client reviews, success stories, enterprise transformation',
    url: '/testimonials',
  },
  investors: {
    title: 'Investor Relations',
    description: 'Kangqore investor relations: financial performance, growth strategy, and market positioning in the enterprise AI and digital transformation sector.',
    keywords: 'Kangqore investors, investor relations, company financials, growth strategy',
    url: '/investors',
  },
};

// ─── Content & Insight Pages ───────────────────────────────────────────────────
export const contentSEO = {
  blogs: {
    title: 'Engineering Blog — Insights & Thought Leadership',
    description: 'Deep-dive articles on AI, cloud engineering, cybersecurity, digital transformation, and enterprise architecture from Kangqore\'s engineering team.',
    keywords: 'tech blog, AI blog, cloud engineering articles, digital transformation insights, engineering thought leadership',
    url: '/blogs',
  },
  caseStudies: {
    title: 'Case Studies — Real Results, Real Impact',
    description: 'Explore how Kangqore has delivered measurable business outcomes through AI, cloud, and digital transformation projects across industries.',
    keywords: 'case studies, client success, enterprise transformation results, AI case study, cloud case study',
    url: '/case-studies',
  },
  whitePapers: {
    title: 'White Papers & Research Reports',
    description: 'Download Kangqore\'s white papers on enterprise AI strategy, cloud architecture, cybersecurity frameworks, and digital transformation methodologies.',
    keywords: 'white papers, research reports, AI white paper, cloud architecture guide, enterprise strategy',
    url: '/white-paper',
  },
  events: {
    title: 'Events & Webinars',
    description: 'Attend Kangqore\'s upcoming events, webinars, and conferences on enterprise AI, cloud engineering, and digital transformation best practices.',
    keywords: 'tech events, AI webinars, cloud conferences, digital transformation events',
    url: '/events',
  },
  brochures: {
    title: 'Brochures & Collateral',
    description: 'Download Kangqore service brochures covering AI & Cognitive, Cloud Engineering, Cybersecurity, Digital Transformation, and more.',
    keywords: 'service brochures, Kangqore brochures, IT services collateral',
    url: '/brochures',
  },
  insights: {
    title: 'Insights — Articles, Research & Analysis',
    description: 'Kangqore Insights: expert articles, research reports, and strategic analysis on AI, cloud, cybersecurity, and enterprise digital transformation.',
    keywords: 'tech insights, AI insights, digital transformation analysis, enterprise technology research',
    url: '/insights',
  },
  news: {
    title: 'News & Press Releases',
    description: 'Latest news, press releases, and announcements from Kangqore. Stay updated on our partnerships, product launches, and industry recognition.',
    keywords: 'Kangqore news, press releases, company announcements, tech news',
    url: '/news',
  },
};

// ─── Department Pages ──────────────────────────────────────────────────────────
export const departmentSEO = {
  'ai-cognitive': {
    title: 'AI & Cognitive Computing Services',
    description: 'Enterprise AI solutions: Agentic AI, GenAI, MLOps, AI Governance, Data Science, and Cognitive Computing. Build intelligent systems that scale.',
    keywords: 'AI services, cognitive computing, agentic AI, GenAI, MLOps, AI governance, data science',
  },
  'analytics-insights': {
    title: 'Analytics & Insights Services',
    description: 'Transform data into actionable intelligence with Kangqore\'s analytics services: Big Data, business intelligence, and advanced analytics platforms.',
    keywords: 'analytics services, big data, business intelligence, data analytics, insights platform',
  },
  'cloud-engineering': {
    title: 'Cloud Engineering Services — AWS, Azure, GCP',
    description: 'End-to-end cloud solutions: AWS, Microsoft Azure, Google Cloud, managed cloud, and cloud-native engineering for enterprise modernization.',
    keywords: 'cloud engineering, AWS services, Azure services, Google Cloud, cloud migration, managed cloud',
  },
  'cybersecurity': {
    title: 'Cybersecurity Services & Solutions',
    description: 'Enterprise cybersecurity: threat detection, security operations, compliance, identity management, and zero-trust architecture from Kangqore.',
    keywords: 'cybersecurity services, IT security, threat detection, zero trust, security operations',
  },
  'data-engineering': {
    title: 'Data Engineering Services',
    description: 'Build modern data platforms: data pipelines, lakehouse architecture, data governance, and real-time streaming for enterprise intelligence.',
    keywords: 'data engineering, data pipelines, data lakehouse, data governance, ETL services',
  },
  'digital-transformation-modernization': {
    title: 'Digital Transformation & Modernization',
    description: 'Accelerate digital transformation: application modernization, legacy migration, technology modernization, and digital business transformation at scale.',
    keywords: 'digital transformation, application modernization, legacy migration, technology modernization',
  },
  'automation': {
    title: 'Intelligent Automation Services',
    description: 'Enterprise automation: RPA, digital process automation, intelligent automation, and business process management to drive operational excellence.',
    keywords: 'RPA, intelligent automation, process automation, BPM, digital automation',
  },
  'product-engineering': {
    title: 'Product Engineering & R&D Services',
    description: 'Full-cycle product engineering: embedded systems, engineering R&D, quality assurance, DevOps, and product digital engineering for modern enterprises.',
    keywords: 'product engineering, R&D services, DevOps, quality engineering, embedded systems',
  },
  'infrastructure-networks-operations': {
    title: 'Infrastructure & Operations Services',
    description: 'Managed infrastructure, network operations, IT support, and operational technology services for enterprise-grade reliability and performance.',
    keywords: 'managed infrastructure, IT operations, network services, support maintenance, managed services',
  },
  'consulting-advisory': {
    title: 'Technology Consulting & Advisory',
    description: 'Strategic technology consulting: digital strategy, IT advisory, discover & frame workshops, and enterprise architecture consulting from Kangqore.',
    keywords: 'technology consulting, IT advisory, digital strategy, enterprise architecture consulting',
  },
  'digital-engineering': {
    title: 'Digital Engineering & Software Development',
    description: 'Custom software development, MVP acceleration, API & microservices engineering, and product strategy from Kangqore\'s digital engineering practice.',
    keywords: 'software development, digital engineering, MVP development, API engineering, microservices',
  },
  'enterprise-applications': {
    title: 'Enterprise Application Services',
    description: 'Enterprise platform integration, Salesforce, ServiceNow, Pimcore, and custom enterprise application development for scalable business operations.',
    keywords: 'enterprise applications, Salesforce, ServiceNow, Pimcore, platform integration',
  },
  'emerging-technologies': {
    title: 'Emerging Technologies — Blockchain & IoT',
    description: 'Explore emerging technologies: blockchain development, IoT solutions, and next-generation technology consulting for forward-thinking enterprises.',
    keywords: 'blockchain, IoT, emerging technologies, blockchain development, Internet of Things',
  },
  'business-operations': {
    title: 'Business Operations & Advisory',
    description: 'Enterprise business operations: finance & risk management, supply chain, GCC setup, talent management, and unified services from Kangqore.',
    keywords: 'business operations, finance risk management, supply chain, GCC, talent management',
  },
  'digital-marketing': {
    title: 'Digital Marketing & Growth Services',
    description: 'Data-driven digital marketing: SEO, performance marketing, social media management, CDP strategy, and marketing AI readiness for enterprises.',
    keywords: 'digital marketing, SEO services, performance marketing, social media, CDP strategy, marketing AI',
  },
  'conversion-engineering': {
    title: 'Conversion Engineering & Growth Optimization',
    description: 'Maximize conversions: CRO, growth funnel engineering, campaign planning, and data-driven conversion optimization for enterprise digital assets.',
    keywords: 'conversion rate optimization, CRO, growth funnels, campaign planning, conversion engineering',
  },
};

// ─── Industry Pages ────────────────────────────────────────────────────────────
export const industrySEO = {
  banking: {
    title: 'Banking & Financial Services Technology',
    description: 'Digital transformation for banking: core banking modernization, AI-powered fraud detection, digital payments, and regulatory compliance solutions.',
    keywords: 'banking technology, fintech, core banking, digital payments, financial services IT',
  },
  insurance: {
    title: 'Insurance Technology Solutions',
    description: 'Insurtech solutions: claims automation, underwriting AI, policy management, customer experience, and digital insurance platform engineering.',
    keywords: 'insurtech, insurance technology, claims automation, underwriting AI, insurance IT',
  },
  edtech: {
    title: 'Education Technology Solutions',
    description: 'EdTech platform engineering: LMS development, adaptive learning AI, virtual classrooms, and digital education transformation for institutions.',
    keywords: 'edtech, education technology, LMS, adaptive learning, virtual classroom, e-learning',
  },
  healthcare: {
    title: 'Healthcare Technology Solutions',
    description: 'Healthcare IT solutions: EHR integration, telemedicine platforms, clinical AI, patient engagement, and healthcare data analytics from Kangqore.',
    keywords: 'healthcare IT, healthtech, EHR, telemedicine, clinical AI, healthcare analytics',
  },
  'life-science': {
    title: 'Life Sciences Technology Solutions',
    description: 'Life sciences IT: clinical trial management, drug discovery AI, pharmacovigilance, regulatory compliance, and R&D platform engineering.',
    keywords: 'life sciences IT, pharma technology, clinical trials, drug discovery AI, pharmacovigilance',
  },
  'media-technology': {
    title: 'Media & Entertainment Technology',
    description: 'Media tech solutions: OTT platform engineering, content management, streaming infrastructure, and AI-powered media analytics from Kangqore.',
    keywords: 'media technology, OTT platform, streaming, content management, media analytics',
  },
  retail: {
    title: 'Retail Technology Solutions',
    description: 'Retail tech: e-commerce platforms, inventory management AI, omnichannel commerce, customer analytics, and supply chain optimization.',
    keywords: 'retail technology, e-commerce, omnichannel, retail analytics, inventory management',
  },
  'travel-hospitality': {
    title: 'Travel & Hospitality Technology',
    description: 'Travel tech solutions: booking platform engineering, revenue management AI, guest experience, and hospitality digital transformation.',
    keywords: 'travel technology, hospitality tech, booking platform, revenue management, guest experience',
  },
  'energy-utilities': {
    title: 'Energy & Utilities Technology',
    description: 'Energy sector IT: smart grid analytics, utility management platforms, renewable energy systems, and SCADA/IoT integration from Kangqore.',
    keywords: 'energy technology, utility IT, smart grid, renewable energy, SCADA, IoT energy',
  },
  manufacturing: {
    title: 'Manufacturing Technology Solutions',
    description: 'Industry 4.0 solutions: smart manufacturing, predictive maintenance AI, MES platforms, digital twin, and supply chain digitization.',
    keywords: 'manufacturing technology, Industry 4.0, smart manufacturing, predictive maintenance, digital twin',
  },
  'information-services': {
    title: 'Information Services Technology',
    description: 'Information services IT: content platforms, data aggregation, knowledge management, and AI-powered information retrieval systems.',
    keywords: 'information services, content platform, data aggregation, knowledge management',
  },
  'consumer-goods': {
    title: 'Consumer Goods Technology Solutions',
    description: 'CPG technology: D2C platform engineering, demand forecasting AI, trade promotion management, and consumer analytics from Kangqore.',
    keywords: 'consumer goods technology, CPG tech, D2C platform, demand forecasting, consumer analytics',
  },
};

// ─── Auth Pages (noindex) ──────────────────────────────────────────────────────
export const authSEO = {
  login: { title: 'Login', description: 'Sign in to your Kangqore account.', noindex: true },
  register: { title: 'Register', description: 'Create your Kangqore account.', noindex: true },
  forgotPassword: { title: 'Forgot Password', description: 'Reset your Kangqore password.', noindex: true },
  resetPassword: { title: 'Reset Password', description: 'Set a new password for your Kangqore account.', noindex: true },
};

// ─── Service Pages (Granular) ──────────────────────────────────────────────────
export const serviceSEO = {
  // AI & Cognitive
  'agentic-ai': {
    title: 'Agentic AI — Autonomous Intelligent Agents',
    description: 'Build autonomous AI agents that can reason, plan, and execute complex tasks. Enterprise-grade agentic AI systems for autonomous business operations.',
    keywords: 'agentic AI, autonomous agents, AI reasoning, AI planning, intelligent agents',
  },
  'genai-business-services': {
    title: 'Generative AI for Business — GenAI Services',
    description: 'Transform your business with Generative AI: LLMs, custom model fine-tuning, and AI-driven content generation for enterprise scale.',
    keywords: 'generative AI, GenAI services, LLM implementation, custom AI models',
  },
  'mlops': {
    title: 'MLOps Services — Scalable Machine Learning Operations',
    description: 'Streamline your machine learning lifecycle with MLOps: automated pipelines, model versioning, monitoring, and continuous training.',
    keywords: 'MLOps, machine learning operations, model deployment, ML pipelines',
  },
  // Cloud Engineering
  'aws': {
    title: 'AWS Cloud Services — Amazon Web Services Experts',
    description: 'Expert AWS consulting, architecture, migration, and managed services. Optimize your enterprise workload on Amazon Web Services.',
    keywords: 'AWS services, Amazon Web Services consulting, AWS migration, AWS architecture',
  },
  'google-cloud-services': {
    title: 'Google Cloud Platform (GCP) Services',
    description: 'Leverage Google Cloud for data analytics, machine learning, and scalable enterprise applications. Expert GCP implementation and management.',
    keywords: 'Google Cloud, GCP services, BigQuery, Google Cloud consulting',
  },
  // Conversion Engineering
  'conversion-rate-optimization': {
    title: 'CRO Services — Conversion Rate Optimization',
    description: 'Maximize your digital revenue with data-driven CRO: A/B testing, user psychology, friction audits, and growth engineering.',
    keywords: 'CRO services, conversion rate optimization, A/B testing, growth engineering',
  },
};

export default { coreSEO, contentSEO, departmentSEO, industrySEO, serviceSEO, authSEO };
