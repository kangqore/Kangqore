// ─── Kangqore Services — 61 Canonical Services ────────────────────────────────
// Single source of truth for all 61 services, keyed by slug.
// Every service belongs to EXACTLY ONE department via `departmentSlug` — no
// cross-tagging. The `relatedServiceSlugs` array provides cross-department
// discoverability without breaking canonical ownership.
//
// ARCHITECTURE: 6 Departments · 61 Services (canonical, single-layer)
// Supersedes the nested legacy 15-department structure in departmentData.js.
// See: /Users/maheshkumar/.claude/plans/act-as-the-lead-curious-starlight.md
//      Sections 17, 18, 19 for the architecture decisions and rationale.
//
// Service names, shortDescription, fullDescription, and keyFeatures are
// preserved verbatim from the legacy departmentData.js to ensure no
// content regression during migration.
// ────────────────────────────────────────────────────────────────────────────────

export const servicesData = {

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE COGNITION — 11 services
  // ═════════════════════════════════════════════════════════════════════════════

  'agentic-ai': {
    slug: 'agentic-ai',
    name: 'Agentic AI Services',
    heroTitle: 'Agentic AI Services That\nExecute Your Enterprise Workflows',
    heroMaxWidth: 'max-w-[78%]',
    heroTitleSize: 'text-[1.6rem] sm:text-[1.92rem] lg:text-[2.688rem] xl:text-[3.6rem]',
    heroBadge: 'AI Agents Built to Execute',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Unlike traditional automation or generative AI, agentic AI systems reason over goals, plan multi-step strategies, and execute them autonomously — adapting in real time to new information.',
    fullDescription: 'Deploy production-grade enterprise agentic AI solutions — autonomous agents that reason, plan, and execute complex workflows with governance, audit trails, and human-in-the-loop oversight built in.',
    fullDescriptionMaxWidth: 'max-w-[980px]',
    keyFeatures: ['Autonomous AI Agent Development', 'Multi-Agent Orchestration', 'Human-in-the-Loop Governance', 'RAG-Powered Enterprise Reasoning', 'LLM Agent Framework & LangGraph'],
    relatedServiceSlugs: ['genai-business-services', 'mlops', 'ai-governance'],
    featured: true,
    image: '/images/capabilities/agentic-ai.png',
    businessMetrics: [
      { title: 'Vendor Onboarding',       desc: 'Faster enterprise vendor qualification using an autonomous AI agent for supply chain workflows.',                                          value: '42', suffix: '%', metricLabel: 'Faster Cycle Time',   icon: 'Zap'        },
      { title: 'Information Access',       desc: 'Reduction in clicks to find answers — RAG-powered AI agents surface knowledge in one query.',                                           value: '78', suffix: '%', metricLabel: 'Fewer Clicks',         icon: 'Search'     },
      { title: 'Customer Satisfaction',    desc: 'CSAT improvement from autonomous AI agents for customer support powered by sentiment analysis.',                                         value: '31', suffix: '%', metricLabel: 'CSAT Increase',         icon: 'TrendingUp' },
      { title: 'Call Wait Time',           desc: 'Reduction in wait time by centralizing incident resolution data into a governed agentic AI platform.',                                  value: '17', suffix: '%', metricLabel: 'Wait Time Reduced',     icon: 'Target'     },
    ],
    hideBadgeStrip: true,
    capabilitiesLabel: 'AGENTIC AI SERVICES',
    capabilitiesSectionTitle: 'Agentic AI Service',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilityAreas: [
      {
        title: 'Front-End Agents',
        image: '/images/capabilities/agentic-goal-execution.png',
        desc: 'Transform enterprise interfaces with intelligent, conversational agents that automate domain-specific workflows.',
        items: [
          'AI Assistants: Transform chatbots into sophisticated conversational agents using Agentic AI solutions.',
          'Domain-Specific Copilots: Intelligent assistants embedded into domain-specific workflows such as procurement, legal, and HR for targeted automation.',
          'Intelligent Search & Recommendation: Personalize content creation, summarization, and recommendations through intelligent technologies.',
          'Content Generation and Summarization: Automate the creation, adaptation, and condensation of enterprise documents and media.',
        ],
      },
      {
        title: 'Platform Transformation',
        image: '/images/capabilities/agentic-multi-agent.png',
        desc: 'Build flexible, adaptive platforms that support autonomous agent operations at scale.',
        items: [
          'Adaptive Platforms: Transition from rigid legacy systems to scalable platforms that support an enterprise agentic AI platform.',
          'Autonomous Workflow Integration: Modernize systems with microservices for seamless access to ERP, CRM, and legacy tools.',
          'API & Microservices Modernization: Break monolithic applications into modular services to accelerate deployment of AI agent solutions.',
          'Governance and Compliance Agents: Deploy agents for real-time policy enforcement, monitoring, and ethical AI compliance.',
        ],
      },
      {
        title: 'Predictive Insights & Operations Optimization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Leverage AI to anticipate failures, automate support, and continuously optimize enterprise operations.',
        items: [
          'Predictive Insights: Anticipate user behavior, system failures, and market shifts to optimize performance and operational spending.',
          'AI-Powered Support: Enable autonomous incident detection, triage, and resolution.',
          'Sales Agents: Automate lead nurturing, proposal creation, and personalized sales communication.',
          'Infrastructure Optimization: Use AI-driven resource management, anomaly detection, and performance tuning.',
        ],
      },
    ],
    whatIsEyebrow: 'What Agentic AI services does Kangqore offer?',
    whatIsTitle: 'Agentic AI Services That',
    whatIsTitleLine2: 'Redefine',
    whatIsHighlight: 'Automation.',
    shortDescription: 'Unlike traditional automation or generative AI, agentic AI systems reason over goals, plan multi-step strategies, and execute them autonomously — adapting in real time to new information. Kangqore builds enterprise agentic AI that governs itself and drives measurable outcomes.',
    whatIsPara2: 'Through our agentic AI development services, we partner with enterprises to transform how work happens across CRM, ERP, and supply chain systems. Our agents operate independently using multi-agent orchestration and RAG-powered reasoning — accelerating execution and improving operational efficiency at scale.',
    bannerBrandDesc: 'Our enterprise agentic AI product & platform',
    downloadAsset: '/assets/downloads/kangqore-agentic-ai-playbook.pdf',
    comparisonTable: {
      colA: 'Traditional Automation',
      colB: 'Agentic AI',
      rows: [
        { dimension: 'Autonomy',    before: 'Rule-dependent, semi-autonomous — requires human instruction at every branch.', after: 'Fully autonomous — perceives context, reasons over goals, and acts without prompting.' },
        { dimension: 'Workflow',    before: 'Linear and predefined — breaks on edge cases outside the script.', after: 'Multi-step, non-linear, adaptive — self-corrects when conditions change.' },
        { dimension: 'Learning',    before: 'Static logic — must be manually reprogrammed to handle new scenarios.', after: 'Continuous — learns from feedback loops and improves with every execution cycle.' },
        { dimension: 'Integration', before: 'Siloed or manually stitched — one system, one connector, one team.', after: 'Seamless across ERP, CRM, APIs, and legacy systems — agents coordinate across all of them.' },
        { dimension: 'Outcomes',    before: 'Reactive and incremental — reduces effort on known tasks.', after: 'Goal-driven and measurable — delivers business outcomes at enterprise scale.' },
      ],
    },
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Compliance and fraud, handled autonomously.',
        agents: ['Automated compliance monitoring and reporting agent', 'Fraud investigation and anomaly response agent', 'Credit decisioning and risk assessment agent'],
      },
      {
        industry: 'Healthcare',
        headline: 'Clinical workflows that move at the speed of care.',
        agents: ['Patient triage and intake automation agent', 'Prior authorization and claims processing agent', 'Clinical research data extraction agent'],
      },
      {
        industry: 'Manufacturing',
        headline: 'Supply chains that self-optimise.',
        agents: ['Supply chain disruption detection and rerouting agent', 'Predictive maintenance orchestration agent', 'Vendor onboarding and qualification agent'],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Personalisation at enterprise scale.',
        agents: ['Conversational shopping and product discovery agent', 'Personalised campaign and promotion agent', 'Inventory replenishment and demand forecasting agent'],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Incidents resolved before the ticket is raised.',
        agents: ['Incident triage and autonomous resolution agent', 'Self-service IT support and knowledge agent', 'DevOps pipeline monitoring and remediation agent'],
      },
      {
        industry: 'EdTech',
        headline: 'Learning experiences that adapt to every student.',
        agents: ['Personalised learning path and tutoring agent', 'Automated assessment generation and grading agent', 'Administrative workflow and compliance agent'],
      },
    ],
    servicePackages: [
      { name: 'Strategy & Audit', description: 'Map your highest-value automation opportunities. Baseline current state, identify agent candidates, and define a prioritised roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Agent Pod', description: 'Rapid delivery of one targeted production agent — scoped, built, tested, and live. The fastest way to prove agentic ROI.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Platform Build', description: 'Design and engineer a scalable multi-agent platform integrated into your ERP, CRM, and data systems with full governance architecture.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Governed Deployment', description: 'Monitored production rollout with HITL dashboards, immutable audit trails, explainability layers, and compliance validation at every step.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Scale & Optimise', description: 'Continuous performance tuning, drift detection, and capability expansion across agent networks — so your AI compounds, not stagnates.', duration: 'Ongoing', tier: 'Enterprise' },
    ],
    outcomeCard: {
      metric: '60%',
      metricLabel: 'Reduction in fraud investigation time',
      problem: 'Fraud investigation required 4–6 human analysts coordinating across 3 disconnected systems per case — creating bottlenecks, inconsistency, and unacceptable cycle times at enterprise volume.',
      outcome: 'A multi-agent agentic AI system autonomously cross-referenced transaction data, flagged anomalies, and produced investigation reports — eliminating manual coordination and reducing cycle time by 60%.',
    },
    customFAQs: [
      { q: 'What Agentic AI services does Kangqore offer?', a: 'We don\'t build AI demos. We build AI operators. Kangqore delivers autonomous agent development, multi-agent orchestration, RAG-powered enterprise reasoning, and governed LLM deployments using LangGraph — all under our Cognition™ platform, which covers the full lifecycle from agent architecture design to production-scale optimization.' },
      { q: 'How is Agentic AI different from traditional AI or Generative AI?', a: 'Generative AI answers. Agentic AI acts. Traditional AI classifies or predicts from a fixed prompt. Agentic AI sets goals, decomposes them into multi-step plans, selects and uses tools, executes tasks autonomously, and self-corrects when outcomes deviate — without waiting for a human to issue the next instruction.' },
      { q: 'How does Kangqore help enterprises adopt Agentic AI safely?', a: 'Every agent we deploy has a governor, not just a goal. Our governance-first architecture embeds human-in-the-loop (HITL) controls, immutable audit trails, role-based access restrictions, and policy enforcement layers before a single autonomous action runs in production. Risk is validated at every phase — not discovered after go-live.' },
      { q: 'What business use cases can Agentic AI enable?', a: 'If a human currently coordinates across three or more systems to complete a task, an agent can own it. High-impact use cases include autonomous fraud investigation, supply chain renegotiation, clinical prior authorization, Level 2/3 support resolution, DevOps incident triage, and intelligent procurement — wherever complexity has made automation impossible until now.' },
      { q: 'How fast can we deploy Agentic AI?', a: 'Eight weeks to a production agent — not a prototype, a live operator. A focused pilot targeting one high-value workflow typically deploys in 8–12 weeks using Kangqore\'s accelerated blueprints. Enterprise-grade multi-agent systems with full RAG integration and governance layers are production-ready within 16–24 weeks, depending on data readiness.' },
      { q: 'Does Agentic AI deliver measurable ROI?', a: 'We define the ROI metric before we write a line of code. Engagements are baselined during Discovery so success is measurable from day one. Outcomes we\'ve targeted include 42% faster vendor onboarding, 78% fewer clicks to surface enterprise knowledge, 31% CSAT improvement in support operations, and 17% reduction in incident wait time.' },
      { q: 'What industries do you serve with Agentic AI?', a: 'Any industry where complexity has been the enemy of automation. Kangqore delivers agentic AI across banking and financial services, healthcare and life sciences, supply chain and logistics, enterprise software engineering, and customer operations — with Cognition™ blueprints built for the compliance and governance demands of each sector.' },
      { q: 'Do you provide end-to-end Agentic AI services?', a: 'From "what should the agent do?" to "the agent is running in production" — that\'s our scope. Kangqore covers strategy and use-case identification, agent architecture design, RAG and LLM integration, multi-agent orchestration, governed deployment, and continuous post-launch optimization. One partner, full lifecycle, no handoff gaps.' },
      { q: 'What tech stack does Kangqore use for agentic AI?', a: 'Orchestration runs on LangGraph for stateful multi-agent workflows, with LangChain for tool-calling and chain composition. Memory persistence uses a hybrid approach — short-term context in working memory, long-term state in vector stores (Pinecone, Weaviate, or pgvector depending on enterprise constraints). RAG pipelines are built on enterprise embedding models with retrieval re-ranking to minimize hallucination on domain-specific data. Failure recovery is handled at the agent level via retry logic and self-correction prompts, and at the workflow level via checkpoint-based state restoration — so a failed node replays from its last valid state, not from zero. LLM selection (GPT-4o, Claude, Gemini, or fine-tuned open-source) is use-case and compliance driven. Observability and drift monitoring run through LangSmith or enterprise-compatible equivalents.' },
      { q: 'What happens when an agent makes a wrong decision?', a: 'We design for failure before writing a line of code. Agents operate within bounded permissions — they cannot act outside their assigned scope. When a step fails, checkpoint-based state restoration replays it from its last valid state, not from zero. Critical decisions trigger automatic human-in-the-loop escalation. Every action is logged to an immutable audit trail — explainable, auditable, and reversible.' },
    ],
    architectureNodes: [
      {
        title: 'Perception Layer',
        icon: 'Search',
        description: 'Agents ingest and understand multi-modal context from enterprise systems — structured data, documents, and real-time event streams.',
        features: ['RAG Integration', 'API Connectors', 'Real-time Event Streams'],
      },
      {
        title: 'Cognitive Engine',
        icon: 'BrainCircuit',
        description: 'LLM-powered reasoning for goal decomposition, multi-step planning, tool selection, and self-correction when outcomes deviate.',
        features: ['Multi-step Planning', 'Memory Management', 'Self-Correction', 'LangGraph Orchestration'],
      },
      {
        title: 'Action & Execution',
        icon: 'Zap',
        description: 'Agents autonomously execute tasks across CRM, ERP, and internal tools — writing to systems, triggering workflows, and coordinating with other agents.',
        features: ['Function Calling', 'Workflow Automation', 'System Write Access'],
      },
      {
        title: 'Governance Core',
        icon: 'Shield',
        description: 'Strict oversight, ethical boundaries, and policy enforcement baked in at the architecture level — not added as an afterthought.',
        features: ['Immutable Audit Logs', 'RBAC Controls', 'Human-in-the-Loop'],
      },
    ],
    featureMicros: [
      'Owns the full workflow — no handoffs, no gaps.',
      'Specialists in formation beat a single generalist.',
      'Governance is load-bearing, not bolted on.',
      'Your data. Re-ranked retrieval. No hallucinations.',
    ],
    outcomeCard2: {
      metric: '67%',
      metricLabel: 'Reduction in prior authorization cycle time',
      problem: 'Clinical prior authorizations required nurses to coordinate across payer portals, EHR systems, and clinical guidelines — averaging 3.2 days per case at enterprise volume, with high rejection rates from incomplete submissions.',
      outcome: 'An agentic AI system cross-referenced clinical data, payer criteria, and prior case precedents to generate authorization submissions and track approvals autonomously — cutting cycle time by 67% and freeing clinical staff for patient-facing work.',
    },
    customJourney: [
      { phase: 'DISCOVERY',  icon: 'Search',     title: 'Discovery',        desc: 'Map high-value workflows where autonomous decision-making delivers measurable ROI. Define agent personas, data sources, and success metrics.' },
      { phase: 'BLUEPRINT',  icon: 'Target',     title: 'Define Blueprint', desc: 'Design multi-agent orchestration layers, tool-use scaffolding, safety guardrails, AI model selection, and enterprise system integrations.', kangqore: true },
      { phase: 'BUILD',      icon: 'Cpu',        title: 'Build & Train',    desc: 'Develop agents with LangGraph orchestration, RAG pipelines, and LLM agent frameworks — with memory systems and self-correction logic built in.', kangqore: true },
      { phase: 'ROLLOUT',    icon: 'Shield',     title: 'Secure Rollout',   desc: 'Implement monitored deployments with HITL dashboards, immutable audit trails, explainability layers, and compliance checks.', kangqore: true },
      { phase: 'SCALE',      icon: 'TrendingUp', title: 'Scale',            desc: 'Integrate across ERP, CRM, and ITSM ecosystems. Enable continuous self-optimization, drift detection, and multi-agent coordination at enterprise scale.', kangqore: true },
    ],
    heroStripItems: [
      'AI Assistants',
      'Domain-Specific Copilots',
      'Intelligent Search & Recommendation',
      'Content Generation and Summarization',
      'Predictive Insights',
      'AI-Powered Support',
      'Sales Agents',
      'Infrastructure Optimization',
    ],
    trustSignals: [
      'Responsible AI frameworks with human-in-the-loop (HITL) guardrails',
      'Enterprise AI data privacy, security & compliance controls',
      'Ethical AI governance agents for regulated industries',
      'Proven agentic AI delivery via accelerated blueprints & measurable client ROI',
    ],
    conciergeChips: [
      'What makes your agents production-ready — not just prototypes?',
      'How fast can we deploy our first agent?',
      'How is agentic AI different from RPA and traditional automation?',
      'How do you handle enterprise compliance and audit requirements?',
      'Book an Agentic AI strategy session',
    ],
  },

  'ai-cognitive-computing': {
    slug: 'ai-cognitive-computing',
    name: 'AI & Cognitive Computing',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Leverage cognitive technologies to mimic human thought processes',
    fullDescription: 'Implement cognitive computing solutions that understand, reason, and learn from data to enhance business operations.',
    keyFeatures: ['Natural language understanding', 'Pattern recognition', 'Machine reasoning', 'Knowledge management', 'Cognitive insights'],
    relatedServiceSlugs: ['agentic-ai', 'data-science-ai', 'genai-business-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
  },

  'data-science-ai': {
    slug: 'data-science-ai',
    name: 'Data Science & AI',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Extract insights and build predictive models from your data',
    fullDescription: 'Combine data science expertise with AI capabilities to uncover insights, build models, and drive data-driven decisions.',
    keyFeatures: ['Predictive modeling', 'Statistical analysis', 'Feature engineering', 'Model deployment', 'Data visualization'],
    relatedServiceSlugs: ['mlops', 'analytics', 'big-data'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
  },

  'genai-business-services': {
    slug: 'genai-business-services',
    name: 'GenAI Business Services',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Implement generative AI solutions for business transformation',
    fullDescription: 'Leverage generative AI technologies including LLMs, image generation, and content creation for business applications.',
    keyFeatures: ['LLM implementation', 'Custom model fine-tuning', 'Content generation', 'Code generation', 'Enterprise AI assistants'],
    relatedServiceSlugs: ['agentic-ai', 'ai-governance', 'mlops'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  },

  'mlops': {
    slug: 'mlops',
    name: 'MLOps',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Streamline ML model development, deployment, and operations',
    fullDescription: 'Implement MLOps practices for efficient machine learning lifecycle management from development to production.',
    keyFeatures: ['Model versioning', 'Automated pipelines', 'Continuous training', 'Model monitoring', 'Feature stores'],
    relatedServiceSlugs: ['data-science-ai', 'devops-as-a-service', 'ai-governance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'analytics': {
    slug: 'analytics',
    name: 'Analytics',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Comprehensive analytics solutions for business intelligence',
    fullDescription: 'Implement end-to-end analytics solutions including dashboards, reports, and advanced analytics capabilities.',
    keyFeatures: ['Business intelligence', 'Dashboard development', 'KPI tracking', 'Self-service analytics', 'Data storytelling'],
    relatedServiceSlugs: ['big-data', 'data-science-ai'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },

  'big-data': {
    slug: 'big-data',
    name: 'Big Data',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Handle massive datasets with scalable big data infrastructure',
    fullDescription: 'Build and manage big data platforms that process, store, and analyze large volumes of data efficiently.',
    keyFeatures: ['Data lakes', 'Distributed processing', 'Real-time streaming', 'Data warehousing', 'ETL pipelines'],
    relatedServiceSlugs: ['analytics', 'data-science-ai'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'digital-process-automation': {
    slug: 'digital-process-automation',
    name: 'Digital Process Automation (DPA)',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Automate and optimize digital business processes',
    fullDescription: 'Implement comprehensive digital process automation to streamline workflows and improve efficiency.',
    keyFeatures: ['Process discovery', 'Workflow automation', 'Integration', 'Monitoring', 'Optimization'],
    relatedServiceSlugs: ['robotic-process-automation', 'business-process-management', 'intelligent-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
  },

  'robotic-process-automation': {
    slug: 'robotic-process-automation',
    name: 'Robotic Process Automation (RPA)',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Deploy software robots for repetitive tasks',
    fullDescription: 'Implement RPA solutions to automate rule-based, repetitive business processes.',
    keyFeatures: ['Process assessment', 'Bot development', 'Attended/unattended automation', 'Bot monitoring', 'CoE setup'],
    relatedServiceSlugs: ['digital-process-automation', 'intelligent-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80',
  },

  'business-process-management': {
    slug: 'business-process-management',
    name: 'Business Process Management',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Design, execute, and optimize business processes',
    fullDescription: 'Implement BPM solutions to model, automate, and improve business processes.',
    keyFeatures: ['Process modeling', 'Workflow automation', 'Process orchestration', 'Business rules', 'Process analytics'],
    relatedServiceSlugs: ['digital-process-automation', 'intelligent-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },

  'intelligent-automation': {
    slug: 'intelligent-automation',
    name: 'Intelligent Automation',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'AI-powered automation for complex processes',
    fullDescription: 'Combine AI with automation for intelligent decision-making and complex process handling.',
    keyFeatures: ['AI decision automation', 'NLP integration', 'Document intelligence', 'Cognitive automation', 'Process orchestration'],
    relatedServiceSlugs: ['agentic-ai', 'robotic-process-automation', 'digital-process-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE FOUNDRY — 17 services
  // ═════════════════════════════════════════════════════════════════════════════

  'managed-cloud-services': {
    slug: 'managed-cloud-services',
    name: 'Managed Cloud Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'End-to-end cloud management and optimization',
    fullDescription: 'Comprehensive managed services for your cloud infrastructure including monitoring, optimization, and support.',
    keyFeatures: ['24/7 monitoring', 'Cost optimization', 'Security management', 'Performance tuning', 'Compliance support'],
    relatedServiceSlugs: ['cloud-computing', 'managed-infrastructure-services', 'devops-as-a-service'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  },

  'aws': {
    slug: 'aws',
    name: 'AWS',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Amazon Web Services implementation and management',
    fullDescription: 'Expert AWS services from architecture design to migration and ongoing management.',
    keyFeatures: ['AWS architecture', 'Migration services', 'Cost optimization', 'Security best practices', 'DevOps on AWS'],
    relatedServiceSlugs: ['cloud-computing', 'devops-as-a-service', 'managed-cloud-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
  },

  'microsoft-services': {
    slug: 'microsoft-services',
    name: 'Microsoft Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Microsoft Azure and M365 solutions',
    fullDescription: 'Complete Microsoft cloud solutions including Azure infrastructure, Microsoft 365, and Power Platform.',
    keyFeatures: ['Azure implementation', 'Microsoft 365', 'Power Platform', 'Dynamics 365', 'Security & compliance'],
    relatedServiceSlugs: ['cloud-computing', 'managed-cloud-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },

  'google-cloud-services': {
    slug: 'google-cloud-services',
    name: 'Google Cloud Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Google Cloud Platform expertise and implementation',
    fullDescription: 'Leverage Google Cloud for data analytics, machine learning, and enterprise applications.',
    keyFeatures: ['GCP architecture', 'BigQuery analytics', 'AI/ML on GCP', 'Kubernetes (GKE)', 'Data solutions'],
    relatedServiceSlugs: ['cloud-computing', 'data-science-ai', 'big-data'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
  },

  'cloud-computing': {
    slug: 'cloud-computing',
    name: 'Cloud Computing',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Multi-cloud and hybrid cloud strategies',
    fullDescription: 'Design and implement cloud computing strategies that align with your business goals.',
    keyFeatures: ['Cloud strategy', 'Multi-cloud management', 'Hybrid solutions', 'Cloud native development', 'FinOps'],
    relatedServiceSlugs: ['aws', 'microsoft-services', 'google-cloud-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
  },

  'embedded-design-systems': {
    slug: 'embedded-design-systems',
    name: 'Embedded Design Systems & IT/OT',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Design embedded systems and IT/OT convergence solutions',
    fullDescription: 'Develop embedded systems and bridge the gap between IT and operational technology.',
    keyFeatures: ['Embedded design', 'Firmware development', 'IT/OT integration', 'IoT connectivity', 'Edge computing'],
    relatedServiceSlugs: ['internet-of-things', 'operation-technology', 'product-digital-engineering'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
  },

  'engineering-foundry': {
    slug: 'engineering-foundry',
    name: 'Engineering Foundry',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Innovation hub for engineering excellence',
    fullDescription: 'Access our engineering foundry for rapid prototyping, experimentation, and innovation.',
    keyFeatures: ['Rapid prototyping', 'Innovation sprints', 'Technical POCs', 'Experimentation', 'Technology scouting'],
    relatedServiceSlugs: ['engineering-rd-services', 'mvp-acceleration', 'software-development'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },

  'engineering-rd-services': {
    slug: 'engineering-rd-services',
    name: 'Engineering R&D Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Research and development for product innovation',
    fullDescription: 'Partner with our R&D team to research, develop, and innovate new product capabilities.',
    keyFeatures: ['Technology research', 'Innovation labs', 'IP development', 'Patent support', 'Academic partnerships'],
    relatedServiceSlugs: ['engineering-foundry', 'product-digital-engineering'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80',
  },

  'product-digital-engineering': {
    slug: 'product-digital-engineering',
    name: 'Product Digital Engineering Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Digital engineering for connected products',
    fullDescription: 'Transform physical products with digital capabilities and connected experiences.',
    keyFeatures: ['Product digitization', 'Connected products', 'Digital twins', 'Smart features', 'Data integration'],
    relatedServiceSlugs: ['embedded-design-systems', 'internet-of-things', 'software-development'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  },

  'devops-as-a-service': {
    slug: 'devops-as-a-service',
    name: 'DevOps as a Service (DaaS)',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Managed DevOps for accelerated delivery',
    fullDescription: 'Implement DevOps practices as a service for faster, more reliable software delivery.',
    keyFeatures: ['CI/CD pipelines', 'Infrastructure as code', 'Container orchestration', 'Monitoring', 'SRE practices'],
    relatedServiceSlugs: ['software-development', 'api-microservices-engineering', 'quality-engineering-assurance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
  },

  'managed-infrastructure-services': {
    slug: 'managed-infrastructure-services',
    name: 'Managed Infrastructure Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'End-to-end infrastructure management',
    fullDescription: 'Comprehensive managed services for your entire IT infrastructure.',
    keyFeatures: ['24/7 monitoring', 'Incident management', 'Capacity planning', 'Performance optimization', 'Automation'],
    relatedServiceSlugs: ['managed-cloud-services', 'managed-services', 'support-maintenance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'modernization-infrastructure': {
    slug: 'modernization-infrastructure',
    name: 'Modernization Infrastructure',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Modernize legacy infrastructure',
    fullDescription: 'Transform legacy infrastructure to modern, cloud-ready architecture.',
    keyFeatures: ['Assessment', 'Modernization roadmap', 'Cloud migration', 'Hybrid infrastructure', 'IaC'],
    relatedServiceSlugs: ['legacy-modernization', 'cloud-computing', 'managed-infrastructure-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1560732488-6b0df240254a?w=800&q=80',
  },

  'managed-services': {
    slug: 'managed-services',
    name: 'Managed Services',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Comprehensive IT managed services',
    fullDescription: 'Full suite of managed IT services to optimize operations and reduce costs.',
    keyFeatures: ['Service desk', 'Application management', 'Infrastructure management', 'Security services', 'Cloud management'],
    relatedServiceSlugs: ['managed-infrastructure-services', 'managed-cloud-services', 'support-maintenance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'support-maintenance': {
    slug: 'support-maintenance',
    name: 'Support And Maintenance',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Ongoing support and maintenance services',
    fullDescription: 'Reliable support and maintenance to keep your systems running smoothly.',
    keyFeatures: ['Helpdesk support', 'Application support', 'System maintenance', 'Patch management', 'SLA management'],
    relatedServiceSlugs: ['managed-services', 'managed-infrastructure-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },

  'software-development': {
    slug: 'software-development',
    name: 'Software Development',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Custom software development services',
    fullDescription: 'Build custom software solutions tailored to your business needs.',
    keyFeatures: ['Full-stack development', 'Agile methodology', 'Code quality', 'CI/CD', 'Documentation'],
    relatedServiceSlugs: ['api-microservices-engineering', 'devops-as-a-service', 'engineering-foundry'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  },

  'api-microservices-engineering': {
    slug: 'api-microservices-engineering',
    name: 'API & Microservices Engineering',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Design and build modern API-first architectures',
    fullDescription: 'Implement API-first and microservices architectures for scalable applications.',
    keyFeatures: ['API design', 'Microservices architecture', 'API gateway', 'Service mesh', 'API management'],
    relatedServiceSlugs: ['software-development', 'devops-as-a-service', 'enterprise-platform-integration'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'internet-of-things': {
    slug: 'internet-of-things',
    name: 'Internet Of Things (IoT)',
    departmentSlug: 'foundry',
    bannerBrand: 'Engineering Foundry™',
    shortDescription: 'Connected device solutions and IoT platforms',
    fullDescription: 'Build comprehensive IoT solutions from device connectivity to analytics.',
    keyFeatures: ['IoT architecture', 'Device connectivity', 'IoT analytics', 'Platform integration', 'Security'],
    relatedServiceSlugs: ['embedded-design-systems', 'operation-technology', 'product-digital-engineering'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE REIMAGINE — 12 services
  // ═════════════════════════════════════════════════════════════════════════════

  'application-modernization': {
    slug: 'application-modernization',
    name: 'Application Modernization',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Modernize legacy applications for cloud-native performance',
    fullDescription: 'Transform legacy applications to modern architectures including microservices, containers, and cloud-native.',
    keyFeatures: ['Legacy assessment', 'Re-platforming', 'Re-architecting', 'Containerization', 'API enablement'],
    relatedServiceSlugs: ['legacy-modernization', 'cloud-computing', 'api-microservices-engineering'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  },

  'digital-transformation': {
    slug: 'digital-transformation',
    name: 'Digital Transformation',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'End-to-end digital transformation strategy and execution',
    fullDescription: 'Comprehensive digital transformation from strategy through execution, enabling new business capabilities.',
    keyFeatures: ['Digital strategy', 'Operating model design', 'Technology enablement', 'Change management', 'Value realization'],
    relatedServiceSlugs: ['strategy-consulting', 'technology-transformation', 'digital-business-transformation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },

  'legacy-modernization': {
    slug: 'legacy-modernization',
    name: 'Legacy Modernization',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Transform aging systems into modern platforms',
    fullDescription: 'Modernize legacy systems to reduce technical debt, improve performance, and enable innovation.',
    keyFeatures: ['Assessment', 'Migration planning', 'Data migration', 'Testing', 'Cutover management'],
    relatedServiceSlugs: ['application-modernization', 'modernization-infrastructure', 'technology-modernization'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'technology-modernization': {
    slug: 'technology-modernization',
    name: 'Technology Modernization',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Update technology stack for improved performance',
    fullDescription: 'Modernize your technology stack to leverage latest capabilities and improve business outcomes.',
    keyFeatures: ['Technology assessment', 'Roadmap development', 'Implementation', 'Integration', 'Optimization'],
    relatedServiceSlugs: ['legacy-modernization', 'technology-transformation', 'application-modernization'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
  },

  'technology-transformation': {
    slug: 'technology-transformation',
    name: 'Technology Transformation',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Fundamental technology change for business value',
    fullDescription: 'Drive fundamental technology changes that deliver significant business value and competitive advantage.',
    keyFeatures: ['Vision & strategy', 'Architecture design', 'Transformation execution', 'Change enablement', 'Value measurement'],
    relatedServiceSlugs: ['digital-transformation', 'strategy-consulting', 'technology-modernization'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
  },

  'digital-business-transformation': {
    slug: 'digital-business-transformation',
    name: 'Digital Business Transformation',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Transform business models through digital innovation',
    fullDescription: 'Reimagine business models and operations through digital technologies and innovation.',
    keyFeatures: ['Business model innovation', 'Digital products', 'Customer experience', 'Operational excellence', 'Data monetization'],
    relatedServiceSlugs: ['digital-transformation', 'strategy-consulting', 'product-strategy-experience-design'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },

  'technology-consulting': {
    slug: 'technology-consulting',
    name: 'Technology Consulting',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Expert technology guidance and advisory',
    fullDescription: 'Get expert advice on technology strategy, architecture, and implementation.',
    keyFeatures: ['Technology strategy', 'Architecture advisory', 'Vendor selection', 'Technology roadmaps', 'IT governance'],
    relatedServiceSlugs: ['strategy-consulting', 'discover-frame-workshops', 'technology-transformation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
  },

  'strategy-consulting': {
    slug: 'strategy-consulting',
    name: 'Strategy Consulting',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Develop winning business and technology strategies',
    fullDescription: 'Work with our strategists to define and execute strategies that drive growth.',
    keyFeatures: ['Business strategy', 'Digital strategy', 'Market analysis', 'Competitive positioning', 'Growth strategy'],
    relatedServiceSlugs: ['technology-consulting', 'discover-frame-workshops', 'digital-business-transformation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },

  'discover-frame-workshops': {
    slug: 'discover-frame-workshops',
    name: 'Discover & Frame Workshops',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Collaborative workshops for problem-solving and innovation',
    fullDescription: 'Engage in structured workshops to discover opportunities and frame solutions.',
    keyFeatures: ['Design thinking', 'Problem framing', 'Ideation sessions', 'Solution design', 'Roadmap development'],
    relatedServiceSlugs: ['strategy-consulting', 'technology-consulting', 'mvp-acceleration'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  },

  'mvp-acceleration': {
    slug: 'mvp-acceleration',
    name: 'MVP Acceleration',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Rapidly build and validate minimum viable products',
    fullDescription: 'Accelerate your path to market with rapid MVP development and validation.',
    keyFeatures: ['Rapid prototyping', 'Agile sprints', 'User validation', 'Iterative development', 'Launch support'],
    relatedServiceSlugs: ['product-strategy-experience-design', 'software-development', 'engineering-foundry'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },

  'product-strategy-experience-design': {
    slug: 'product-strategy-experience-design',
    name: 'Product Strategy & Experience Design',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Strategic product planning and UX design',
    fullDescription: 'Define product strategy and create exceptional user experiences.',
    keyFeatures: ['Product vision', 'User research', 'UX/UI design', 'Design systems', 'Usability testing'],
    relatedServiceSlugs: ['mvp-acceleration', 'digital-business-transformation', 'discover-frame-workshops'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },

  'blockchain': {
    slug: 'blockchain',
    name: 'Blockchain',
    departmentSlug: 'reimagine',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    shortDescription: 'Decentralized solutions with blockchain technology',
    fullDescription: 'Implement blockchain solutions for transparency, security, and efficiency.',
    keyFeatures: ['Blockchain strategy', 'Smart contracts', 'Private networks', 'DeFi solutions', 'Supply chain'],
    relatedServiceSlugs: ['supply-chain', 'finance-risk-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE SHIELD — 5 services
  // ═════════════════════════════════════════════════════════════════════════════

  'it-security-services': {
    slug: 'it-security-services',
    name: 'IT Security Services',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Comprehensive IT security assessment and implementation',
    fullDescription: 'End-to-end IT security services including assessment, implementation, monitoring, and incident response.',
    keyFeatures: ['Security assessment', 'Threat detection', 'Incident response', 'Security operations', 'Compliance management'],
    relatedServiceSlugs: ['ai-governance', 'operation-technology', 'finance-risk-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  },

  'finance-risk-management': {
    slug: 'finance-risk-management',
    name: 'Finance & Risk Management',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Finance transformation and risk management solutions',
    fullDescription: 'Transform finance operations and implement comprehensive risk management.',
    keyFeatures: ['Finance transformation', 'Risk assessment', 'Compliance', 'Financial planning', 'Audit support'],
    relatedServiceSlugs: ['it-security-services', 'ai-governance', 'quality-engineering-assurance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },

  'ai-governance': {
    slug: 'ai-governance',
    name: 'AI Governance',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Establish frameworks for responsible and ethical AI deployment',
    fullDescription: 'Create comprehensive AI governance frameworks ensuring ethical, transparent, and compliant AI implementations.',
    keyFeatures: ['Ethical AI guidelines', 'Bias detection and mitigation', 'Model explainability', 'Compliance monitoring', 'Risk assessment'],
    relatedServiceSlugs: ['agentic-ai', 'genai-business-services', 'mlops'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80',
  },

  'quality-engineering-assurance': {
    slug: 'quality-engineering-assurance',
    name: 'Quality Engineering & Assurance',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Comprehensive quality engineering services',
    fullDescription: 'Ensure product quality through comprehensive testing and quality assurance practices.',
    keyFeatures: ['Test strategy', 'Test automation', 'Performance testing', 'Security testing', 'Quality metrics'],
    relatedServiceSlugs: ['devops-as-a-service', 'software-development', 'it-security-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  },

  'operation-technology': {
    slug: 'operation-technology',
    name: 'Operation Technology (OT)',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Operational technology management and security',
    fullDescription: 'Manage and secure operational technology environments for industrial operations.',
    keyFeatures: ['OT assessment', 'OT security', 'IT/OT convergence', 'SCADA systems', 'Industrial IoT'],
    relatedServiceSlugs: ['internet-of-things', 'embedded-design-systems', 'it-security-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE PLATFORMS — 8 services
  // ═════════════════════════════════════════════════════════════════════════════

  'enterprise-platform-integration': {
    slug: 'enterprise-platform-integration',
    name: 'Enterprise Platform Integration',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Integrate enterprise platforms and applications',
    fullDescription: 'Connect your enterprise applications for seamless data flow and process automation.',
    keyFeatures: ['Integration strategy', 'API development', 'ESB implementation', 'Data integration', 'iPaaS solutions'],
    relatedServiceSlugs: ['api-microservices-engineering', 'salesforce', 'servicenow'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'pimcore': {
    slug: 'pimcore',
    name: 'Pimcore',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Pimcore PIM/DAM implementation and customization',
    fullDescription: 'Implement Pimcore for product information management and digital asset management.',
    keyFeatures: ['PIM implementation', 'DAM setup', 'Data modeling', 'Integration', 'Custom development'],
    relatedServiceSlugs: ['enterprise-platform-integration', 'supply-chain'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },

  'salesforce': {
    slug: 'salesforce',
    name: 'Salesforce',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Salesforce implementation and customization',
    fullDescription: 'Transform customer relationships with Salesforce solutions.',
    keyFeatures: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Custom development', 'Integration'],
    relatedServiceSlugs: ['enterprise-platform-integration', 'cdp-strategy', 'servicenow'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  },

  'servicenow': {
    slug: 'servicenow',
    name: 'ServiceNow',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'ServiceNow implementation and optimization',
    fullDescription: 'Implement ServiceNow for IT service management and beyond.',
    keyFeatures: ['ITSM', 'ITOM', 'HR Service Delivery', 'Custom apps', 'Integration'],
    relatedServiceSlugs: ['enterprise-platform-integration', 'salesforce', 'unified-services-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
  },

  'global-capability-centers': {
    slug: 'global-capability-centers',
    name: 'Global Capability Centers (GCC)',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Establish and optimize global capability centers',
    fullDescription: 'Build and scale global capability centers for operational excellence.',
    keyFeatures: ['GCC setup', 'Operating model', 'Talent management', 'Process excellence', 'Technology enablement'],
    relatedServiceSlugs: ['talent-organization', 'unified-services-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },

  'talent-organization': {
    slug: 'talent-organization',
    name: 'Talent & Organization',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Talent management and organizational effectiveness',
    fullDescription: 'Transform talent management and organizational capabilities.',
    keyFeatures: ['Talent strategy', 'Org design', 'Change management', 'Learning & development', 'HR technology'],
    relatedServiceSlugs: ['global-capability-centers', 'unified-services-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },

  'supply-chain': {
    slug: 'supply-chain',
    name: 'Supply Chain',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Supply chain optimization and transformation',
    fullDescription: 'Optimize and transform supply chain operations for efficiency and resilience.',
    keyFeatures: ['Supply chain strategy', 'Planning & forecasting', 'Logistics optimization', 'Visibility', 'Sustainability'],
    relatedServiceSlugs: ['pimcore', 'blockchain', 'analytics'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
  },

  'unified-services-management': {
    slug: 'unified-services-management',
    name: 'Unified Services Management (USM)',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Unified approach to service management',
    fullDescription: 'Implement unified service management for consistent service delivery.',
    keyFeatures: ['Service strategy', 'Process design', 'Tool implementation', 'Governance', 'Continuous improvement'],
    relatedServiceSlugs: ['servicenow', 'global-capability-centers', 'managed-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&q=80',
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE GROWTH — 8 services
  // ═════════════════════════════════════════════════════════════════════════════

  'cdp-strategy': {
    slug: 'cdp-strategy',
    name: 'Customer Data Strategy',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Build a "single source of truth" for customer data to combat the death of cookies.',
    fullDescription: 'Architect a robust first-party data ecosystem that connects every touchpoint, ensuring data sovereignty and highly personalized customer experiences.',
    keyFeatures: ['First-party data strategy', 'Unified customer profiles', 'Real-time segmentation', 'Data privacy & compliance', 'Cross-channel activation'],
    relatedServiceSlugs: ['marketing-ai-readiness', 'performance-marketing', 'salesforce'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },

  'marketing-ai-readiness': {
    slug: 'marketing-ai-readiness',
    name: 'Marketing AI Readiness',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Audit and optimize creative operations with GenAI to save 40%+ in costs.',
    fullDescription: 'Deploy cutting-edge Generative AI across your marketing workflows to accelerate creative production, personalize content at scale, and drastically reduce operational overhead.',
    keyFeatures: ['Creative ops audit', 'GenAI implementation roadmap', 'Content personalization at scale', 'Workflow automation', 'AI-driven asset generation'],
    relatedServiceSlugs: ['cdp-strategy', 'genai-business-services', 'performance-marketing'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },

  'social-media-management': {
    slug: 'social-media-management',
    name: 'Social Media Management',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Comprehensive social media strategy and management',
    fullDescription: 'Build and manage your social media presence across all platforms.',
    keyFeatures: ['Strategy development', 'Content creation', 'Community management', 'Analytics'],
    relatedServiceSlugs: ['performance-marketing', 'campaign-planning'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  },

  'performance-marketing': {
    slug: 'performance-marketing',
    name: 'Performance Marketing',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Data-driven marketing for measurable results',
    fullDescription: 'Drive measurable results with performance-based digital marketing.',
    keyFeatures: ['PPC advertising', 'Social ads', 'Retargeting', 'Conversion optimization', 'Attribution'],
    relatedServiceSlugs: ['conversion-rate-optimization', 'growth-funnels-conversion-engineering', 'campaign-planning'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },

  'seo-organic-growth-strategy': {
    slug: 'seo-organic-growth-strategy',
    name: 'SEO & Organic Growth Strategy',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Dominate search visibility with technical SEO architecture.',
    fullDescription: 'Answer user intent better than anyone else while ensuring your site architecture makes that content accessible.',
    keyFeatures: ['Technical SEO', 'Content clustering', 'Off-page footprint', 'Core Web Vitals'],
    relatedServiceSlugs: ['performance-marketing', 'conversion-rate-optimization'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
  },

  'growth-funnels-conversion-engineering': {
    slug: 'growth-funnels-conversion-engineering',
    name: 'Growth Funnels & Conversion Engineering',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Engineer growth through optimized funnels',
    fullDescription: 'Design and optimize growth funnels for maximum conversion and revenue.',
    keyFeatures: ['Funnel design', 'A/B testing', 'Conversion optimization', 'Growth hacking', 'Analytics'],
    relatedServiceSlugs: ['conversion-rate-optimization', 'performance-marketing', 'campaign-planning'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },

  'conversion-rate-optimization': {
    slug: 'conversion-rate-optimization',
    name: 'Conversion Rate Optimization (CRO)',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Engineer maximum yield from your existing traffic.',
    fullDescription: 'Merge deep psychological user research with rigorous quantitative A/B testing to identify friction.',
    keyFeatures: ['A/B Testing', 'Behavior Analytics', 'Heuristic Analysis', 'Friction Audits'],
    relatedServiceSlugs: ['growth-funnels-conversion-engineering', 'performance-marketing', 'seo-organic-growth-strategy'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },

  'campaign-planning': {
    slug: 'campaign-planning',
    name: 'Campaign Planning',
    departmentSlug: 'growth',
    bannerBrand: 'KVIS™',
    shortDescription: 'Strategic marketing campaign planning and execution',
    fullDescription: 'Plan and execute marketing campaigns that deliver results.',
    keyFeatures: ['Campaign strategy', 'Channel planning', 'Creative development', 'Execution', 'Optimization'],
    relatedServiceSlugs: ['performance-marketing', 'social-media-management', 'growth-funnels-conversion-engineering'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },

};

// Ordered list of all service slugs (61 total).
export const servicesList = Object.keys(servicesData);

// Inverse index: services grouped by department slug. Derived from servicesData
// so it cannot drift from the source of truth.
export const servicesByDepartment = {
  cognition:  servicesList.filter((s) => servicesData[s].departmentSlug === 'cognition'),
  foundry:    servicesList.filter((s) => servicesData[s].departmentSlug === 'foundry'),
  reimagine:  servicesList.filter((s) => servicesData[s].departmentSlug === 'reimagine'),
  shield:     servicesList.filter((s) => servicesData[s].departmentSlug === 'shield'),
  platforms:  servicesList.filter((s) => servicesData[s].departmentSlug === 'platforms'),
  growth:     servicesList.filter((s) => servicesData[s].departmentSlug === 'growth'),
};

// Lookup helper. Throws on invalid slug so callers fail loudly.
export const getService = (slug) => {
  const service = servicesData[slug];
  if (!service) {
    throw new Error(
      `Unknown service slug: "${slug}". Total ${servicesList.length} services registered.`
    );
  }
  return service;
};

// Return featured services (one per department, by convention).
export const getFeaturedServices = () =>
  servicesList.filter((s) => servicesData[s].featured).map((s) => servicesData[s]);

export default servicesData;
