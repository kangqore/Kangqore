// ─── Centralized SEO Metadata Registry ─────────────────────────────────────────
// Single source of truth for all page-level SEO metadata.
// Every description is 150–160 characters, keyword-rich, and unique.
// ────────────────────────────────────────────────────────────────────────────────

import legacyRedirectsGenerated from './legacyRedirects.generated.json';

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
    title: 'Services — 6 Departments · 61 Services',
    description: 'Explore Kangqore\'s 61 services across 6 departments: AI & Automation, Cloud & Engineering, Modernization, Security & Trust, Enterprise Platforms, and Growth.',
    keywords: 'IT services, AI services, cloud services, digital transformation, enterprise technology, Kangqore departments',
    url: '/services',
  },
  departments: {
    title: 'Departments — 6 Departments · 61 Services',
    description: '6 Kangqore departments · 61 services. AI & Automation, Cloud & Engineering, Modernization, Security & Trust, Enterprise Platforms, and Growth.',
    keywords: 'Kangqore departments, AI department, cloud department, modernization department, security department, enterprise platforms, growth department',
    url: '/departments',
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

// ─── Department Pages (LEGACY — 15-department structure) ──────────────────────
// ⚠️  DEPRECATED. Retained only so legacy /department/<slug> URLs render until
// engineering wires the 301 redirects in `legacyRedirects` (see bottom of file).
// New canonical SEO lives in `departmentSEO` below.
// ────────────────────────────────────────────────────────────────────────────────
export const legacyDepartmentSEO = {
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

// ─── Department Pages (6 Canonical Departments) ────────────────────────────────
// New canonical structure. Each department page lives at /departments/<slug>.
// See departmentsData.js for the source-of-truth department metadata.
// ────────────────────────────────────────────────────────────────────────────────
export const departmentSEO = {
  cognition: {
    title: 'Kangqore Cognition Department — AI, Data & Automation',
    description: '11 AI, data, and automation services — agentic AI, GenAI, MLOps, analytics, and intelligent automation. Powered by eQORE™.',
    keywords: 'agentic AI services, GenAI consulting, MLOps, data science, RPA, intelligent automation, eQORE, Kangqore Cognition',
    url: '/departments/cognition',
  },
  foundry: {
    title: 'Kangqore Foundry Department — Cloud, Engineering & Infrastructure',
    description: '17 cloud, engineering, and infrastructure services — AWS, Azure, GCP, DevOps, embedded systems, IoT. Powered by Engineering Foundry™.',
    keywords: 'cloud engineering, AWS consulting, Azure services, GCP, DevOps, infrastructure, product engineering, Kangqore Foundry',
    url: '/departments/foundry',
  },
  reimagine: {
    title: 'Kangqore Reimagine Department — Modernization & Transformation',
    description: '12 modernization and transformation services — application modernization, legacy migration, digital transformation. The Kangqore Modernization Playbook™.',
    keywords: 'application modernization, legacy modernization, digital transformation, technology consulting, MVP acceleration, blockchain',
    url: '/departments/reimagine',
  },
  shield: {
    title: 'Kangqore Shield Department — Security, Risk & Trust',
    description: 'Cybersecurity, AI governance, finance & risk, quality engineering, and OT security — 5 services under Shield™ Trust & Governance Framework.',
    keywords: 'cybersecurity, AI governance, finance risk management, quality engineering, OT security, trust framework, Kangqore Shield',
    url: '/departments/shield',
  },
  platforms: {
    title: 'Kangqore Platforms Department — Enterprise Applications & Operations',
    description: '8 enterprise platform services — Salesforce, ServiceNow, Pimcore, GCC, Supply Chain, USM. Implemented in 12 weeks, run with SLA.',
    keywords: 'Salesforce implementation, ServiceNow, Pimcore, enterprise platform integration, GCC, supply chain, Kangqore Platforms',
    url: '/departments/platforms',
  },
  growth: {
    title: 'Kangqore Growth Department — Marketing, Visibility & Conversion',
    description: '8 growth services — CDP, Marketing AI, SEO, Performance Marketing, CRO. Pipeline you can attribute, not traffic you can boast about. KVIS™.',
    keywords: 'CDP strategy, marketing AI, SEO, performance marketing, CRO, growth funnels, conversion engineering, KVIS, Kangqore Growth',
    url: '/departments/growth',
  },
};

// ─── Service Pages (61 services — flat /services/<slug>) ───────────────────────
// Source-of-truth: servicesData.js. SEO titles follow the formula:
//   [Service Name] — [Department ShortName] | Kangqore
// Descriptions: 140–155 chars, outcome-led, banner-brand-anchored.
// ────────────────────────────────────────────────────────────────────────────────
export const serviceSEO = {

  // ─── Cognition (11) ──
  'agentic-ai': {
    title: 'Agentic AI Services — Autonomous AI Agents | Kangqore',
    description: 'Kangqore builds production-grade agentic AI systems that reason, plan, and execute complex enterprise workflows — with oversight, audit trails, and governance.',
    keywords: 'agentic AI services, autonomous AI agents, enterprise AI agent development, AI workflow automation, multi-agent orchestration, human-in-the-loop AI, LLM agents, governed AI agents, agentic AI consulting, LLM agent orchestration, RAG-powered agents',
    url: '/services/agentic-ai',
  },
  'agentic-ai-led-application-modernization': {
    title: 'Agentic AI-led Application Modernization | Kangqore',
    description: 'Modernize legacy apps at machine speed with agentic AI — automated refactoring, intelligent migration, and continuous governance without disrupting operations.',
    keywords: 'agentic AI modernization, application modernization, AI-led migration, legacy modernization, intelligent refactoring, AI-driven modernization, enterprise application modernization',
    url: '/services/agentic-ai-led-application-modernization',
  },
  'ai-cognitive-computing': {
    // Was 'AI & Cognitive Computing — Cognition | Kangqore', 47 chars with a
    // quarter of it spent on an internal department name nobody searches. Now
    // carries the three capability areas that actually get typed into a search
    // box, and uses the space Google renders.
    title: 'AI & Cognitive Computing — Vision, NLP & Speech | Kangqore',
    description: 'Enterprise cognitive computing: computer vision, document and language intelligence, speech, multimodal and edge AI — systems that read what your people read.',
    keywords: 'cognitive computing, computer vision, natural language processing, document intelligence, speech recognition, multimodal AI, edge AI, decision intelligence',
    url: '/services/ai-cognitive-computing',
  },
  'data-science-ai': {
    title: 'Data Science & AI — Predictive Modeling & ML | Kangqore',
    description: 'Data science with AI: predictive modeling, statistical analysis, feature engineering, and model deployment — turn data into business decisions.',
    keywords: 'data science, predictive modeling, AI modeling, feature engineering, model deployment, data visualization',
    url: '/services/data-science-ai',
  },
  'genai-business-services': {
    // "— Cognition" spent a quarter of the title on an internal taxonomy term
    // nobody searches. The replacement follows the pattern agentic-ai already
    // uses ("— Autonomous AI Agents |") and spends the same characters on three
    // terms that are real queries. "Generative AI" rather than "GenAI" because
    // the long form carries the search volume.
    title: 'Generative AI Services — RAG, Fine-Tuning & LLMs | Kangqore',
    // Leads with the differentiator the page actually argues — grounding — so
    // the SERP snippet says something the competing results do not.
    description: 'Enterprise generative AI: retrieval-augmented generation over your own documents, guardrails, evaluation and fine-tuning — answers that cite their source.',
    keywords: 'generative AI, GenAI services, LLM implementation, custom AI fine-tuning, enterprise AI assistants',
    url: '/services/genai-business-services',
  },
  'mlops': {
    title: 'MLOps — Cognition | Kangqore',
    description: 'Production-grade MLOps — model versioning, automated pipelines, continuous training, monitoring, and feature stores for the full ML lifecycle.',
    keywords: 'MLOps, machine learning operations, model deployment, ML pipelines, model monitoring, feature stores',
    url: '/services/mlops',
  },
  'analytics': {
    title: 'Analytics — Forecasting & Decision Intelligence | Kangqore',
    description: 'Analytics that changes a decision: one agreed definition, lineage back to source, and forecasting, prescriptive and decision intelligence on top of it.',
    keywords: 'business analytics, business intelligence, dashboards, KPI tracking, self-service analytics, data storytelling',
    url: '/services/analytics',
  },
  'big-data': {
    title: 'Big Data — Lakehouse, Streaming & Data Platforms | Kangqore',
    description: 'Big data platform engineering: ingestion, lakehouse storage, distributed processing and streaming, built to a cost per terabyte you can predict.',
    keywords: 'big data, data lakes, distributed processing, real-time streaming, data warehousing, ETL pipelines',
    url: '/services/big-data',
  },
  'digital-process-automation': {
    title: 'Digital Process Automation (DPA) — Cognition | Kangqore',
    description: 'Digital process automation — process discovery, workflow automation, integration, monitoring, and continuous optimization for operational efficiency.',
    keywords: 'digital process automation, DPA, workflow automation, process discovery, business process automation',
    url: '/services/digital-process-automation',
  },
  'robotic-process-automation': {
    title: 'Robotic Process Automation (RPA) — Cognition | Kangqore',
    description: 'Enterprise RPA — bot development, attended and unattended automation, bot monitoring, and CoE setup for rule-based business processes.',
    keywords: 'robotic process automation, RPA services, software bots, attended automation, unattended automation, RPA CoE',
    url: '/services/robotic-process-automation',
  },
  'business-process-management': {
    title: 'Business Process Management — Cognition | Kangqore',
    description: 'Enterprise BPM — process modeling, workflow automation, process orchestration, business rules, and analytics for end-to-end process excellence.',
    keywords: 'business process management, BPM, process modeling, workflow automation, process orchestration',
    url: '/services/business-process-management',
  },
  'intelligent-automation': {
    title: 'Intelligent Automation — RPA, IDP & Orchestration | Kangqore',
    description: 'AI-powered automation — AI decision automation, NLP integration, document intelligence, cognitive automation, and process orchestration combined.',
    keywords: 'intelligent automation, AI automation, cognitive automation, document intelligence, NLP automation',
    url: '/services/intelligent-automation',
  },

  // ─── Foundry (17) ──
  'managed-cloud-services': {
    title: 'Managed Cloud Services — Foundry | Kangqore',
    description: 'End-to-end managed cloud — 24/7 monitoring, cost optimization, security management, performance tuning, and compliance support across hyperscalers.',
    keywords: 'managed cloud services, cloud management, cloud monitoring, cloud cost optimization, cloud security',
    url: '/services/managed-cloud-services',
  },
  'aws': {
    title: 'AWS — Foundry | Kangqore',
    description: 'Expert AWS services — architecture, migration, cost optimization, security best practices, and DevOps on AWS for enterprise workloads.',
    keywords: 'AWS services, Amazon Web Services consulting, AWS architecture, AWS migration, AWS DevOps',
    url: '/services/aws',
  },
  'microsoft-services': {
    title: 'Microsoft Services — Foundry | Kangqore',
    description: 'Microsoft cloud services — Azure implementation, Microsoft 365, Power Platform, Dynamics 365, and Microsoft security & compliance.',
    keywords: 'Microsoft Azure, Azure consulting, Microsoft 365, Power Platform, Dynamics 365',
    url: '/services/microsoft-services',
  },
  'google-cloud-services': {
    title: 'Google Cloud Services — Foundry | Kangqore',
    description: 'Google Cloud Platform expertise — GCP architecture, BigQuery analytics, AI/ML on GCP, Kubernetes (GKE), and data solutions.',
    keywords: 'Google Cloud, GCP services, BigQuery, GKE, AI on GCP, GCP data solutions',
    url: '/services/google-cloud-services',
  },
  'cloud-computing': {
    title: 'Cloud Computing — Foundry | Kangqore',
    description: 'Multi-cloud and hybrid cloud strategy — cloud strategy, multi-cloud management, hybrid solutions, cloud native development, and FinOps.',
    keywords: 'cloud computing, multi-cloud strategy, hybrid cloud, cloud native development, FinOps',
    url: '/services/cloud-computing',
  },
  'embedded-design-systems': {
    title: 'Embedded Design Systems & IT/OT — Foundry | Kangqore',
    description: 'Embedded systems and IT/OT convergence — firmware development, IT/OT integration, IoT connectivity, and edge computing for industrial use.',
    keywords: 'embedded systems, IT/OT convergence, firmware development, IoT connectivity, edge computing',
    url: '/services/embedded-design-systems',
  },
  'engineering-foundry': {
    title: 'Engineering Foundry — Foundry | Kangqore',
    description: 'Engineering Foundry™ — rapid prototyping, innovation sprints, technical POCs, experimentation, and technology scouting with embedded engineering pods.',
    keywords: 'engineering foundry, embedded engineering pods, rapid prototyping, innovation sprints, technical POCs',
    url: '/services/engineering-foundry',
  },
  'engineering-rd-services': {
    title: 'Engineering R&D Services — Foundry | Kangqore',
    description: 'Engineering R&D — technology research, innovation labs, IP development, patent support, and academic partnerships for product innovation.',
    keywords: 'engineering R&D, technology research, innovation labs, IP development, patent support',
    url: '/services/engineering-rd-services',
  },
  'product-digital-engineering': {
    title: 'Product Digital Engineering — Foundry | Kangqore',
    description: 'Digital engineering for connected products — product digitization, connected products, digital twins, smart features, and data integration.',
    keywords: 'product digital engineering, connected products, digital twins, smart products, product digitization',
    url: '/services/product-digital-engineering',
  },
  'devops-as-a-service': {
    title: 'DevOps as a Service (DaaS) — Foundry | Kangqore',
    description: 'Managed DevOps — CI/CD pipelines, infrastructure as code, container orchestration, monitoring, and SRE practices for faster, reliable delivery.',
    keywords: 'DevOps as a service, DaaS, CI/CD pipelines, infrastructure as code, container orchestration, SRE',
    url: '/services/devops-as-a-service',
  },
  'managed-infrastructure-services': {
    title: 'Managed Infrastructure Services — Foundry | Kangqore',
    description: 'End-to-end managed infrastructure — 24/7 monitoring, incident management, capacity planning, performance optimization, and automation.',
    keywords: 'managed infrastructure, infrastructure monitoring, incident management, capacity planning, IT automation',
    url: '/services/managed-infrastructure-services',
  },
  'modernization-infrastructure': {
    title: 'Modernization Infrastructure — Foundry | Kangqore',
    description: 'Modernize legacy infrastructure — assessment, modernization roadmap, cloud migration, hybrid infrastructure, and infrastructure as code (IaC).',
    keywords: 'infrastructure modernization, cloud migration, hybrid infrastructure, infrastructure as code, IaC',
    url: '/services/modernization-infrastructure',
  },
  'managed-services': {
    title: 'Managed Services — Foundry | Kangqore',
    description: 'Full suite of managed IT services — service desk, application management, infrastructure management, security services, and cloud management.',
    keywords: 'managed IT services, service desk, application management, infrastructure management, cloud management',
    url: '/services/managed-services',
  },
  'support-maintenance': {
    title: 'Support & Maintenance — Foundry | Kangqore',
    description: 'Ongoing support and maintenance — helpdesk support, application support, system maintenance, patch management, and SLA management.',
    keywords: 'support maintenance, helpdesk support, application support, patch management, SLA management',
    url: '/services/support-maintenance',
  },
  'software-development': {
    title: 'Software Development — Foundry | Kangqore',
    description: 'Custom software development — full-stack development, agile methodology, code quality, CI/CD, and documentation tailored to your business needs.',
    keywords: 'software development, custom software, full-stack development, agile development, CI/CD',
    url: '/services/software-development',
  },
  'api-microservices-engineering': {
    title: 'API & Microservices Engineering — Foundry | Kangqore',
    description: 'API-first and microservices — API design, microservices architecture, API gateway, service mesh, and API management for scalable applications.',
    keywords: 'API engineering, microservices architecture, API gateway, service mesh, API management',
    url: '/services/api-microservices-engineering',
  },
  'internet-of-things': {
    title: 'Internet of Things (IoT) — Foundry | Kangqore',
    description: 'End-to-end IoT — IoT architecture, device connectivity, IoT analytics, platform integration, and security for connected device ecosystems.',
    keywords: 'Internet of Things, IoT services, IoT platform, IoT analytics, device connectivity, IoT security',
    url: '/services/internet-of-things',
  },

  // ─── Reimagine (12) ──
  'application-modernization': {
    title: 'Application Modernization — Reimagine | Kangqore',
    description: 'Modernize legacy applications — legacy assessment, re-platforming, re-architecting, containerization, and API enablement. The Modernization Playbook™.',
    keywords: 'application modernization, re-platforming, re-architecting, containerization, API enablement',
    url: '/services/application-modernization',
  },
  'digital-transformation': {
    title: 'Digital Transformation — Reimagine | Kangqore',
    description: 'End-to-end digital transformation — digital strategy, operating model design, technology enablement, change management, and value realization.',
    keywords: 'digital transformation, digital strategy, operating model design, change management, value realization',
    url: '/services/digital-transformation',
  },
  'legacy-modernization': {
    title: 'Legacy Modernization — Reimagine | Kangqore',
    description: 'Modernize aging systems — assessment, migration planning, data migration, testing, and cutover management. Risk-managed, fixed-bid waves.',
    keywords: 'legacy modernization, system migration, data migration, technical debt reduction, cutover management',
    url: '/services/legacy-modernization',
  },
  'technology-modernization': {
    title: 'Technology Modernization — Reimagine | Kangqore',
    description: 'Modernize your technology stack — technology assessment, roadmap development, implementation, integration, and optimization.',
    keywords: 'technology modernization, tech stack modernization, IT modernization, technology roadmap',
    url: '/services/technology-modernization',
  },
  'technology-transformation': {
    title: 'Technology Transformation — Reimagine | Kangqore',
    description: 'Fundamental technology change — vision and strategy, architecture design, transformation execution, change enablement, and value measurement.',
    keywords: 'technology transformation, IT transformation, architecture transformation, change enablement',
    url: '/services/technology-transformation',
  },
  'digital-business-transformation': {
    title: 'Digital Business Transformation — Reimagine | Kangqore',
    description: 'Reimagine business models — business model innovation, digital products, customer experience, operational excellence, and data monetization.',
    keywords: 'digital business transformation, business model innovation, digital products, customer experience, data monetization',
    url: '/services/digital-business-transformation',
  },
  'technology-consulting': {
    title: 'Technology Consulting — Reimagine | Kangqore',
    description: 'Expert technology consulting — technology strategy, architecture advisory, vendor selection, technology roadmaps, and IT governance.',
    keywords: 'technology consulting, IT advisory, architecture advisory, technology strategy, IT governance',
    url: '/services/technology-consulting',
  },
  'strategy-consulting': {
    title: 'Strategy Consulting — Reimagine | Kangqore',
    description: 'Business and technology strategy — business strategy, digital strategy, market analysis, competitive positioning, and growth strategy.',
    keywords: 'strategy consulting, business strategy, digital strategy, market analysis, growth strategy',
    url: '/services/strategy-consulting',
  },
  'discover-frame-workshops': {
    title: 'Discover & Frame Workshops — Reimagine | Kangqore',
    description: 'Structured workshops — design thinking, problem framing, ideation, solution design, and roadmap development. The diagnostic entry-point.',
    keywords: 'design thinking workshops, problem framing, ideation sessions, solution design, technology roadmaps',
    url: '/services/discover-frame-workshops',
  },
  'mvp-acceleration': {
    title: 'MVP Acceleration — Reimagine | Kangqore',
    description: 'Rapid MVP build and validation — rapid prototyping, agile sprints, user validation, iterative development, and launch support.',
    keywords: 'MVP development, MVP acceleration, rapid prototyping, agile sprints, product launch',
    url: '/services/mvp-acceleration',
  },
  'product-strategy-experience-design': {
    title: 'Product Strategy & Experience Design — Reimagine | Kangqore',
    description: 'Product strategy and UX/UI — product vision, user research, UX/UI design, design systems, and usability testing for exceptional product experiences.',
    keywords: 'product strategy, UX design, UI design, design systems, user research, usability testing',
    url: '/services/product-strategy-experience-design',
  },
  'blockchain': {
    title: 'Blockchain — Reimagine | Kangqore',
    description: 'Blockchain solutions — blockchain strategy, smart contracts, private networks, DeFi, and supply chain transparency. Built for enterprise rigor.',
    keywords: 'blockchain services, smart contracts, private blockchain, DeFi, supply chain blockchain',
    url: '/services/blockchain',
  },

  // ─── Shield (5) ──
  'it-security-services': {
    title: 'Cybersecurity & IT Security Services — Shield | Kangqore',
    description: 'Enterprise cybersecurity — Zero Trust architecture, cloud and application security, managed detection and response, and compliance evidence you can prove.',
    keywords: 'cybersecurity services, IT security, Zero Trust architecture, managed detection and response, cloud security, application security, incident response, compliance evidence',
    url: '/services/it-security-services',
  },
  'finance-risk-management': {
    title: 'Finance & Risk Management — Shield | Kangqore',
    description: 'Finance transformation and risk — risk assessment, compliance, financial planning, and audit support. Under Shield™ Trust & Governance Framework.',
    keywords: 'finance risk management, financial controls, risk assessment, compliance, audit support',
    url: '/services/finance-risk-management',
  },
  'ai-governance': {
    // Was 'AI Governance — Shield | Kangqore', 33 chars, a quarter of it spent
    // on the internal department name and 27 usable characters left empty. Now
    // carries the two regulations a buyer actually searches alongside the term.
    title: 'AI Governance — EU AI Act & NIST AI RMF | Kangqore',
    description: 'Enterprise AI governance: risk classification against the EU AI Act, NIST AI RMF controls, model registry, explainability, bias testing and audit trails.',
    keywords: 'AI governance, responsible AI, AI ethics, bias detection, model explainability, AI compliance',
    url: '/services/ai-governance',
  },
  'quality-engineering-assurance': {
    title: 'Quality Engineering & Assurance — Shield | Kangqore',
    description: 'Quality engineering — test strategy, test automation, performance testing, security testing, and quality metrics for production-grade releases.',
    keywords: 'quality engineering, test automation, performance testing, security testing, QA services',
    url: '/services/quality-engineering-assurance',
  },
  'operation-technology': {
    title: 'Operation Technology (OT) — Shield | Kangqore',
    description: 'OT security and management — OT assessment, OT security, IT/OT convergence, SCADA systems, and industrial IoT for critical environments.',
    keywords: 'operation technology, OT security, IT/OT convergence, SCADA, industrial IoT',
    url: '/services/operation-technology',
  },

  // ─── Platforms (8) ──
  'enterprise-platform-integration': {
    title: 'Enterprise Platform Integration — Platforms | Kangqore',
    description: 'Connect enterprise applications — integration strategy, API development, ESB implementation, data integration, and iPaaS solutions.',
    keywords: 'enterprise integration, API integration, ESB, iPaaS, data integration, platform integration',
    url: '/services/enterprise-platform-integration',
  },
  'pimcore': {
    title: 'Pimcore — Platforms | Kangqore',
    description: 'Pimcore PIM/DAM — PIM implementation, DAM setup, data modeling, integration, and custom development for product information and digital assets.',
    keywords: 'Pimcore, PIM, DAM, product information management, digital asset management',
    url: '/services/pimcore',
  },
  'salesforce': {
    title: 'Salesforce — Platforms | Kangqore',
    description: 'Salesforce implementation — Sales Cloud, Service Cloud, Marketing Cloud, custom development, and integration for customer-centric operations.',
    keywords: 'Salesforce implementation, Sales Cloud, Service Cloud, Marketing Cloud, Salesforce consulting',
    url: '/services/salesforce',
  },
  'servicenow': {
    title: 'ServiceNow — Platforms | Kangqore',
    description: 'ServiceNow implementation — ITSM, ITOM, HR Service Delivery, custom apps, and integration for unified enterprise service management.',
    keywords: 'ServiceNow implementation, ITSM, ITOM, HR Service Delivery, ServiceNow consulting',
    url: '/services/servicenow',
  },
  'global-capability-centers': {
    title: 'Global Capability Centers (GCC) — Platforms | Kangqore',
    description: 'Build and scale GCCs — GCC setup, operating model, talent management, process excellence, and technology enablement for global delivery.',
    keywords: 'global capability centers, GCC setup, GCC operating model, GCC talent management',
    url: '/services/global-capability-centers',
  },
  'talent-organization': {
    title: 'Talent & Organization — Platforms | Kangqore',
    description: 'Talent and org design — talent strategy, org design, change management, learning and development, and HR technology for workforce transformation.',
    keywords: 'talent management, org design, change management, learning development, HR technology',
    url: '/services/talent-organization',
  },
  'supply-chain': {
    title: 'Supply Chain — Platforms | Kangqore',
    description: 'Supply chain transformation — strategy, planning and forecasting, logistics optimization, visibility, and sustainability for resilient operations.',
    keywords: 'supply chain transformation, supply chain strategy, demand forecasting, logistics optimization',
    url: '/services/supply-chain',
  },
  'unified-services-management': {
    title: 'Unified Services Management (USM) — Platforms | Kangqore',
    description: 'Unified service management — service strategy, process design, tool implementation, governance, and continuous improvement for consistent delivery.',
    keywords: 'unified services management, USM, service strategy, IT service management, ITIL',
    url: '/services/unified-services-management',
  },

  // ─── Growth (8) ──
  'cdp-strategy': {
    title: 'Customer Data Strategy — Growth | Kangqore',
    description: 'First-party customer data strategy — unified profiles, real-time segmentation, privacy & compliance, and cross-channel activation. KVIS™.',
    keywords: 'customer data strategy, CDP strategy, first-party data, customer profiles, real-time segmentation',
    url: '/services/cdp-strategy',
  },
  'marketing-ai-readiness': {
    title: 'Marketing AI Readiness — Growth | Kangqore',
    description: 'GenAI for marketing — creative ops audit, GenAI roadmap, content personalization at scale, workflow automation, and AI-driven asset generation.',
    keywords: 'marketing AI, GenAI marketing, creative operations, content personalization, marketing workflow automation',
    url: '/services/marketing-ai-readiness',
  },
  'social-media-management': {
    title: 'Social Media Management — Growth | Kangqore',
    description: 'Social media strategy and management — strategy development, content creation, community management, and analytics across all platforms.',
    keywords: 'social media management, social strategy, content creation, community management, social analytics',
    url: '/services/social-media-management',
  },
  'performance-marketing': {
    title: 'Performance Marketing — Growth | Kangqore',
    description: 'Data-driven performance marketing — PPC, social ads, retargeting, conversion optimization, and attribution for measurable pipeline.',
    keywords: 'performance marketing, PPC, social ads, retargeting, conversion optimization, attribution modeling',
    url: '/services/performance-marketing',
  },
  'seo-organic-growth-strategy': {
    title: 'SEO & Organic Growth Strategy — Growth | Kangqore',
    description: 'Technical SEO and organic growth — technical SEO, content clustering, off-page footprint, and Core Web Vitals for sustained search visibility.',
    keywords: 'SEO, technical SEO, organic growth, content clustering, Core Web Vitals, search visibility',
    url: '/services/seo-organic-growth-strategy',
  },
  'growth-funnels-conversion-engineering': {
    title: 'Growth Funnels & Conversion Engineering — Growth | Kangqore',
    description: 'Engineered growth funnels — funnel design, A/B testing, conversion optimization, growth hacking, and funnel analytics for maximum revenue.',
    keywords: 'growth funnels, conversion engineering, A/B testing, funnel optimization, growth hacking',
    url: '/services/growth-funnels-conversion-engineering',
  },
  'conversion-rate-optimization': {
    title: 'Conversion Rate Optimization (CRO) — Growth | Kangqore',
    description: 'Maximum yield from existing traffic — A/B testing, behavior analytics, heuristic analysis, and friction audits. Pipeline you can attribute.',
    keywords: 'conversion rate optimization, CRO, A/B testing, behavior analytics, friction audits',
    url: '/services/conversion-rate-optimization',
  },
  'campaign-planning': {
    title: 'Campaign Planning — Growth | Kangqore',
    description: 'Strategic campaign planning — campaign strategy, channel planning, creative development, execution, and continuous optimization.',
    keywords: 'campaign planning, marketing campaigns, channel planning, creative development, campaign optimization',
    url: '/services/campaign-planning',
  },

};

// ─── Legacy Redirects (15 old departments + 61 old service paths) ──────────────
// Canonical source: `shared/legacyRedirects.json` at repo root.
// Mirror at `frontend/src/data/legacyRedirects.generated.json` is produced by
// `npm run redirects:generate` (root). To add/edit a redirect:
//   1. Edit `shared/legacyRedirects.json`
//   2. Run `npm run redirects:generate` from repo root
//   3. Commit BOTH `shared/legacyRedirects.json` AND the two `.generated.json` mirrors
// CI gate: `npm run redirects:check` fails fast on any drift.
// Backend reads from `backend/src/data/legacyRedirects.generated.json` (same source).
// See plan Section 20.6 for rationale and ModuleScopePlugin constraint.
// ────────────────────────────────────────────────────────────────────────────────
export const legacyRedirects = legacyRedirectsGenerated;

// Tally check: shared/legacyRedirects.json contains 15 + 61 = 76 entries.
// Asserted in CI via `npm run redirects:check`.

export default {
  coreSEO,
  contentSEO,
  departmentSEO,
  legacyDepartmentSEO,    // legacy — retained until 301 redirects are wired
  industrySEO,
  serviceSEO,
  authSEO,
  legacyRedirects,
};
