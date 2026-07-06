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
    toolsStack: {
      title: 'Agentic AI Tools & Technology',
      subtitle: 'The production-grade toolchain behind every Kangqore agentic AI deployment.',
      items: [
        {
          icon: 'Network',
          title: 'Orchestration & Frameworks',
          desc: 'Proprietary blueprints aligned with industry-standard agent frameworks',
        },
        {
          icon: 'Cpu',
          title: 'Models',
          desc: 'Leading LLMs with RAG, fine-tuning, and enterprise controls',
        },
        {
          icon: 'Layers',
          title: 'Integration',
          desc: 'APIs, microservices, and enterprise connectors',
        },
        {
          icon: 'Shield',
          title: 'Monitoring',
          desc: 'Real-time governance, audit, and optimization tools',
        },
      ],
    },
  },

  'agentic-ai-led-application-modernization': {
    slug: 'agentic-ai-led-application-modernization',
    name: 'Agentic AI-led Application Modernization',
    heroTitle: 'Agentic AI-led Application\nModernization at Machine Speed',
    heroMaxWidth: 'max-w-[82%]',
    heroTitleSize: 'text-[1.5rem] sm:text-[1.88rem] lg:text-[2.6rem] xl:text-[3.4rem]',
    heroBadge: 'Modernise Faster. Risk Less.',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    bannerBrandDesc: 'Our enterprise agentic modernization platform',
    shortDescription: 'Legacy systems accumulate technical debt, block cloud-native adoption, and make enterprise AI integration structurally impossible. Kangqore\'s agentic AI-led modernization model eliminates that constraint — deploying autonomous agents that assess, refactor, and re-platform legacy applications at machine speed, with enterprise-grade governance at every step.',
    fullDescription: 'Deploy agentic AI modernization at enterprise scale — intelligent agents that assess, refactor, and re-platform legacy applications with cloud-native precision and human-in-the-loop governance built in.',
    keyFeatures: ['Legacy Codebase Assessment', 'AI-driven Migration Blueprint', 'Microservices Decomposition', 'Cloud-native Re-platforming', 'Automated Test Generation'],
    relatedServiceSlugs: ['agentic-ai', 'genai-business-services', 'ai-governance'],
    featured: true,
    image: '/images/capabilities/software-engineering.png',
    hideBadgeStrip: true,

    whatIsTitle: 'Own the',
    whatIsHighlight: 'Agentic Modernization Era.',
    whatIsPara2: 'Intelligent agents scan full codebases, extract business logic, and validate cloud-native deployments autonomously — human-in-the-loop governance at every critical milestone. The outcome: measurable technical debt reduction, faster time-to-modern, and a continuous modernization capability that scales across the entire application portfolio.',

    businessMetrics: [
      { title: 'Faster Time to Market',             desc: 'Agentic AI compresses modernization delivery cycles — getting applications to production faster than any traditional approach can match.',                             value: 'Faster Time to Market',             suffix: '',  metricLabel: '',  icon: 'Zap'        },
      { title: 'Reduced Technical Debt',            desc: 'AI assessment agents identify, score, and eliminate accumulated debt systematically — reducing long-term maintenance burden across the modernised estate.',           value: 'Reduced Technical Debt',            suffix: '',  metricLabel: '',  icon: 'TrendingUp' },
      { title: 'Improved Quality',                  desc: 'AI-generated test suites validate every migration milestone at near-complete coverage — quality that manual testing cannot replicate at enterprise scale.',           value: 'Improved Quality',                  suffix: '',  metricLabel: '',  icon: 'Target'     },
      { title: 'Cost Efficiency & Controlled Risk', desc: 'Lower total modernization cost versus traditional SME-intensive approaches — with built-in AI governance keeping cost, quality, and risk measurable at every step.', value: 'Cost Efficiency & Controlled Risk',  suffix: '',  metricLabel: '',  icon: 'Shield'     },
    ],

    whyShift: {
      label: 'Why Agentic Modernization',
      title: 'Why Shift to Agentic Modernization',
      items: [
        'Agentic AI converts resource-intensive modernization programs into autonomous, goal-driven transformation — removing dependency on scarce SME bandwidth.',
        'Traditional approaches are tool-heavy, manually intensive, and impossible to scale without proportional cost increase.',
        'Intelligent agents map legacy systems, extract business logic, and execute end-to-end modernization workflows — with governance at every step.',
        'Unlike one-off programs, agentic modernization learns, adapts, and compounds — turning transformation into a continuous organizational capability.',
      ],
    },

    modernizationFramework: {
      label: 'Our Approach',
      title: 'Kangqore Application Modernization Framework',
      steps: [
        'Establish governance, security controls, and transformation readiness — before a single line of legacy code is touched.',
        'Deploy agentic automation and intelligence to accelerate assessment, refactoring, and decision velocity at every stage.',
        'Modernize end-to-end — application, data, infrastructure, and integration — to unlock revenue, operational efficiency, and compound ROI.',
      ],
    },

    capabilitiesLabel: 'MODERNIZATION CAPABILITIES',
    capabilitiesSectionTitle: 'Agentic AI Modernization',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesTheme: 'dark-bento-7',
    capabilityAreas: [
      {
        title: 'Application Modernization',
        image: '/images/capabilities/app_mod_thick.svg',
        desc: 'Re-architect legacy applications into modular, API-driven, cloud-native systems — scalable, maintainable, and AI-ready from the ground up.',
        items: [
          'Legacy Re-architecture: Decompose monolithic applications into modular, independently deployable microservices.',
          'API-driven Modernization: Replace legacy integration points with versioned RESTful and GraphQL APIs with full contract documentation.',
          'Cloud-native Migration: Replatform applications to containerised, Kubernetes-native architectures on AWS, Azure, or GCP.',
          'UI/UX Modernization: Rebuild legacy interfaces into responsive, accessible, and user-centric front-end experiences.',
        ],
      },
      {
        title: 'Cloud Modernization',
        image: '/images/capabilities/cloud_mod_thick.svg',
        desc: 'Migrate fast and migrate with confidence — enabling cloud-native, hybrid, and multi-cloud environments with lean, scalable, cost-optimised performance.',
        items: [
          'Cloud Strategy & Migration: Assess, plan, and execute lift-and-shift or re-platform migrations across AWS, Azure, and GCP.',
          'Hybrid & Multi-cloud Architecture: Design resilient multi-cloud environments with consistent governance and cost control.',
          'Cloud Cost Optimisation: Rightsizing, reserved capacity planning, and FinOps disciplines to eliminate cloud waste.',
          'Cloud-native Enablement: Containerisation, Kubernetes orchestration, and serverless adoption for lean, scalable operations.',
        ],
      },
      {
        title: 'Data Modernization',
        image: '/images/capabilities/data_mod_thick.svg',
        desc: 'Transform disparate, siloed data into a unified, real-time asset — modernising data platforms for better governance and AI-powered insights.',
        items: [
          'Data Platform Modernization: Migrate from legacy warehouses to modern lakehouse architectures on cloud-native platforms.',
          'Real-time Data Pipelines: Build streaming pipelines that deliver sub-second data freshness for operational analytics workloads.',
          'Data Governance & Quality: Implement cataloguing, lineage tracking, and quality frameworks across unified data estates.',
          'AI-ready Data Infrastructure: Structure and expose data to power analytics, ML models, and generative AI workloads.',
        ],
      },
      {
        title: 'Quality Engineering & DevOps',
        image: '/images/capabilities/quality_mod_thick.svg',
        desc: 'Accelerate delivery with built-in quality and automation — continuous testing, AI-driven validation, and optimised pipelines for faster, smarter releases.',
        items: [
          'Test Automation Modernization: Replace manual testing with AI-assisted frameworks across unit, integration, and regression.',
          'CI/CD Pipeline Acceleration: Design modern delivery pipelines with automated gates, quality checks, and zero-downtime rollback.',
          'Shift-left Quality Engineering: Embed validation at every stage of the development lifecycle — not just at release.',
          'AI-driven Test Generation: Deploy intelligent agents that generate, execute, and triage test cases without manual intervention.',
        ],
      },
      {
        title: 'Security Modernization',
        image: '/images/capabilities/security_mod_thick.svg',
        desc: 'Security baked into every layer of the modernised estate — from identity controls and zero-trust architecture through continuous compliance oversight.',
        items: [
          'Security-by-Design: Embed controls, identity management, and threat modelling at every architecture and deployment layer.',
          'Zero Trust Architecture: Implement identity-first access, microsegmentation, and continuous verification across the estate.',
          'Compliance Modernization: Map and validate controls against ISO 27001, SOC 2, GDPR, HIPAA, and sector requirements.',
          'Vulnerability Assessment & Remediation: Automated scanning, penetration testing, and remediation across modernised systems.',
        ],
      },
      {
        title: 'Integration & API Modernization',
        image: '/images/capabilities/integration_mod_thick.svg',
        desc: 'Ensure information flows everywhere — enabling flexible, API-led, event-driven integration layers for real-time, agile business processes at enterprise scale.',
        items: [
          'API-led Integration Architecture: Replace point-to-point integrations with reusable, versioned API layers across enterprise systems.',
          'Event-driven Architecture: Implement Kafka, event mesh, and pub-sub patterns for real-time, decoupled business processes.',
          'Legacy Middleware Modernisation: Retire legacy ESBs in favour of lightweight, cloud-native integration platforms.',
          'iPaaS Modernisation: Migrate integration workloads to modern iPaaS platforms with monitoring, governance, and observability.',
        ],
      },
      {
        title: 'Infrastructure Modernization',
        image: '/images/capabilities/infrastructure_mod_thick.svg',
        desc: 'Ensure core infrastructure is scalable, observable, and resilient — improving performance and modernising recovery capabilities for enterprise-grade reliability.',
        items: [
          'Infrastructure as Code: Provision repeatable, governed infrastructure with Terraform, Pulumi, or CloudFormation.',
          'Observability & Monitoring: Deploy unified observability stacks covering metrics, logs, traces, and alerting at full depth.',
          'Resilience & Disaster Recovery: Modernise recovery architectures with automated failover, RTO/RPO validation, and chaos engineering.',
          'Performance Engineering: Eliminate bottlenecks through load testing, capacity planning, and continuous optimisation.',
        ],
      },
    ],

    comparisonTable: {
      colA: 'Traditional Modernization',
      colB: 'Agentic AI-led Modernization',
      rows: [
        { dimension: 'Assessment',  before: 'Months of manual code review and dependency mapping.',                       after: 'AI agents deliver complete codebase analysis and dependency maps in days — not months.' },
        { dimension: 'Planning',    before: 'Static migration playbook built on incomplete discovery.',                   after: 'Dynamic, AI-generated blueprint continuously updated as agents map more of the estate.' },
        { dimension: 'Execution',   before: 'Human-driven, error-prone migration with frequent rollbacks.',               after: 'Autonomous execution with exception escalation and governed human-in-the-loop checkpoints.' },
        { dimension: 'Testing',     before: 'Manual test coverage — slow, incomplete, and high-risk at scale.',           after: 'AI-generated test suites achieve 99% regression coverage before every go-live gate.' },
        { dimension: 'Outcomes',    before: 'High risk, frequent delays, budget overruns, and missed milestones.',        after: 'Governed delivery with measurable milestones and immutable audit-ready documentation.' },
      ],
    },

    architectureNodes: [
      {
        title: 'Assessment Agent',
        icon: 'Search',
        description: 'Scans, maps, and scores the legacy codebase — quantifying technical debt, identifying migration candidates, and generating the modernization blueprint.',
        features: ['Legacy Code Scanning', 'Dependency Mapping', 'Tech Debt Scoring'],
      },
      {
        title: 'Migration Planning Engine',
        icon: 'Target',
        description: 'Generates a dynamic, prioritised migration roadmap — decomposing monoliths into bounded contexts and sequencing execution by risk and business value.',
        features: ['Bounded Context Discovery', 'Migration Sequencing', 'Risk Prioritisation'],
      },
      {
        title: 'Execution Agent',
        icon: 'Zap',
        description: 'Autonomously executes code transformation, re-platforming, and API modernization — with exception handling and human-in-the-loop escalation at critical gates.',
        features: ['Code Transformation', 'Cloud Re-platforming', 'API Generation'],
      },
      {
        title: 'Validation & Governance Agent',
        icon: 'Shield',
        description: 'Generates test suites, validates performance against baselines, and enforces governance checkpoints — producing immutable audit trails for every migration step.',
        features: ['Test Suite Generation', 'Performance Validation', 'Audit Trails'],
      },
    ],

    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Core banking modernised. Compliance maintained.',
        agents: ['Legacy core banking assessment and migration blueprint agent', 'API layer generation and end-to-end testing agent', 'Regulatory compliance validation and audit agent'],
      },
      {
        industry: 'Healthcare',
        headline: 'Clinical systems modernised without patient data risk.',
        agents: ['EHR/EMR dependency analysis and migration sequencing agent', 'HIPAA compliance validation and immutable audit agent', 'Integration testing and regression coverage agent'],
      },
      {
        industry: 'Manufacturing',
        headline: 'ERP modernised and cloud-native without production disruption.',
        agents: ['ERP dependency mapping and microservices decomposition agent', 'Cloud-native containerisation and deployment agent', 'Performance baseline validation and load testing agent'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Monolith decomposed into scalable microservices.',
        agents: ['E-commerce monolith bounded context discovery agent', 'Microservices scaffold generation and API contract agent', 'Load testing, performance optimisation, and go-live agent'],
      },
      {
        industry: 'Insurance',
        headline: 'Policy administration re-platformed at scale.',
        agents: ['Policy system assessment and technical debt scoring agent', 'Re-platforming execution and API modernisation agent', 'Regression test suite generation and validation agent'],
      },
      {
        industry: 'Telecommunications',
        headline: 'BSS/OSS modernised without service disruption.',
        agents: ['BSS/OSS dependency mapping and migration risk assessment agent', 'Cloud-native re-platforming execution and integration agent', 'End-to-end validation and compliance reporting agent'],
      },
    ],

    servicePackages: [
      { name: 'Assessment & Blueprint', description: 'AI-powered legacy codebase analysis, dependency mapping, tech debt scoring, and prioritised modernisation roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Pilot Modernization',    description: 'Targeted modernisation of one application, module, or service — from assessment through cloud-native deployment.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Program Build',          description: 'End-to-end re-platforming with microservices decomposition, API generation, and full governance architecture across the application portfolio.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Governed Migration',     description: 'Monitored migration rollout with HITL checkpoints, AI-generated test suites, audit trails, and compliance validation at every milestone.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Scale & Optimise',       description: 'Continuous modernisation sprints, performance optimisation, and AI capability integration across the modernised estate — so the work compounds.', duration: 'Ongoing', tier: 'Enterprise' },
    ],

    outcomeCard: {
      metric: '60%',
      metricLabel: 'Reduction in modernization timeline',
      problem: 'A financial services firm faced a 3-year manual migration program for their legacy core banking system — requiring 40+ engineers, fragile manual testing, and continuous rollback risk that blocked two prior attempts.',
      outcome: 'Kangqore deployed AI assessment agents to map dependencies in days, generated the microservices decomposition blueprint autonomously, and executed re-platforming sprints with 99% automated test coverage — cutting the modernization timeline by 60%.',
    },
    outcomeCard2: {
      metric: '3×',
      metricLabel: 'Faster assessment than manual code review',
      problem: 'An insurance group needed a complete technical debt assessment of a 15-year-old policy administration system across 2.3M lines of code — a task that would take a manual team 6+ months and still produce an incomplete picture.',
      outcome: 'AI assessment agents scanned the full codebase in 11 days, producing a dependency map, tech debt scorecard, and prioritised migration roadmap — enabling the board to commit to modernisation with evidence rather than estimates.',
    },

    customFAQs: [
      { q: 'What is Agentic AI-led Application Modernization?', a: 'We don\'t migrate code — we deploy AI operators that understand legacy systems. Kangqore delivers autonomous agentic AI systems that assess entire codebases in days, generate dynamic migration blueprints, execute re-platforming to cloud-native architectures, and validate outcomes at 99% test coverage — compressing multi-year transformation programs into governed, measurable sprints.' },
      { q: 'How does AI reduce the risk of application modernization?', a: 'Risk in traditional modernization comes from incomplete discovery, manual execution errors, and inadequate testing. Agentic AI eliminates all three. Assessment agents map every dependency before a single line is moved. Execution agents include exception escalation and human-in-the-loop gates so no critical step happens unsupervised. And test generation agents produce comprehensive regression packs that no manual QA team could match in speed or coverage.' },
      { q: 'Which legacy systems can Agentic AI modernize?', a: 'Any legacy codebase that can be read. Kangqore\'s assessment agents work across COBOL, Java EE, .NET Framework, Oracle Forms, mainframe systems, on-premise ERPs, and custom enterprise platforms. If the code exists, the agents can assess it, plan the migration, and execute the transformation.' },
      { q: 'How fast can modernization happen with AI agents?', a: 'Assessment in days. Blueprint in a week. First migrated module in under two months. Our AI-led approach compresses the discovery and planning phases that traditionally take 6–12 months into 2–3 weeks — so you\'re executing transformation by the time a traditional team has finished scoping it.' },
      { q: 'Do you modernize to cloud-native architectures?', a: 'Yes. Kangqore\'s execution agents re-platform to containerised, Kubernetes-native architectures on AWS, Azure, or GCP — building microservices, generating API layers, and producing deployment-ready infrastructure-as-code alongside every migrated service.' },
      { q: 'Can you modernize without disrupting live business operations?', a: 'Zero-disruption migration is the design constraint, not the aspiration. We execute in parallel tracks — legacy systems stay live while agents build, test, and validate the modern equivalent. Go-live only happens after human-in-the-loop sign-off at every milestone and automated regression packs confirm functional equivalence with the legacy system.' },
      { q: 'What does the governance model look like during migration?', a: 'Every agent action is logged to an immutable audit trail. Human-in-the-loop checkpoints gate each migration milestone. Compliance validation runs continuously against GDPR, HIPAA, SOX, or sector standards relevant to your estate. You have full visibility at all times — what moved, when, by which agent, validated by whom.' },
      { q: 'How do you handle large codebases with millions of lines of code?', a: 'Scale is the point. AI assessment agents scan millions of lines in days because they operate in parallel, not sequentially. Dependency analysis, tech debt scoring, and migration sequencing happen simultaneously across the full codebase — giving you a complete modernisation picture faster than a human team could review the first module.' },
    ],

    customJourney: [
      { phase: 'ASSESS',     icon: 'Search',     title: 'Legacy Assessment',    desc: 'AI agents scan the full codebase, map dependencies, score technical debt, and identify migration candidates — producing a complete modernisation intelligence report in days.' },
      { phase: 'BLUEPRINT',  icon: 'Target',     title: 'Migration Blueprint',  desc: 'Generate a dynamic, prioritised migration roadmap — decomposing monoliths into bounded contexts, sequencing by risk and business value, and defining governance architecture.', kangqore: true },
      { phase: 'EXECUTE',    icon: 'Zap',        title: 'Execute & Migrate',    desc: 'Autonomous agents execute code transformation, microservices decomposition, API generation, and cloud-native re-platforming — with exception escalation and HITL checkpoints.', kangqore: true },
      { phase: 'VALIDATE',   icon: 'Shield',     title: 'Test & Validate',      desc: 'AI-generated test suites achieve 99% regression coverage. Human sign-off gates every milestone. Compliance validation confirms the migrated estate meets all regulatory requirements.', kangqore: true },
      { phase: 'SCALE',      icon: 'TrendingUp', title: 'Optimise & Extend',    desc: 'Continuous modernisation sprints across the remaining estate. Performance optimisation, tech debt elimination, and AI capability integration into the modernised architecture.', kangqore: true },
    ],

    heroStripItems: [
      'Legacy Assessment',
      'Codebase Analysis',
      'Microservices Decomposition',
      'Cloud-native Migration',
      'API Modernization',
      'Automated Test Generation',
      'Technical Debt Elimination',
      'Re-platforming Execution',
    ],

    featureMicros: [
      'AI agents assess faster than any manual team.',
      'Zero-disruption migration with governed checkpoints.',
      '99% automated test coverage before go-live.',
      'Full audit trail from assessment to deployment.',
    ],

    trustSignals: [
      'AI-governed modernisation with human-in-the-loop checkpoints and immutable audit trails',
      'Enterprise-grade compliance validation against GDPR, HIPAA, SOX, and sector standards',
      'Proven delivery framework — from blueprint to production in weeks, not years',
      'Open architecture: AWS, Azure, GCP, and on-premise hybrid targets all supported',
    ],

    conciergeChips: [
      'How fast can you assess our legacy codebase?',
      'How do AI agents handle monolith-to-microservices decomposition?',
      'What does the governance model look like during migration?',
      'Can you modernize without disrupting live operations?',
      'Book an Application Modernization assessment',
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
    whatIsTitle: 'AI & Cognitive Computing',
    whatIsTitleLine2: 'Solutions That',
    whatIsHighlight: 'Think, Learn & Act.',
    whatIsPara2: 'Kangqore implements cognitive systems across NLP, knowledge reasoning, and adaptive learning — enabling enterprises to automate judgment-intensive decisions and surface insights from unstructured information at scale.',
    businessMetrics: [
      { title: 'Comprehension Accuracy', desc: 'Improvement in unstructured data comprehension using cognitive NLP and enterprise reasoning engines.', value: '87', suffix: '%', metricLabel: 'Comprehension Accuracy', icon: 'BrainCircuit' },
      { title: 'Insights Speed',          desc: 'Faster time to insight from enterprise knowledge bases using cognitive search and semantic retrieval.',  value: '4',  suffix: 'x',   metricLabel: 'Faster Insights',        icon: 'Zap'         },
      { title: 'Decision Automation',     desc: 'Complex decisions automated through cognitive reasoning frameworks without manual human review.',          value: '65', suffix: '%', metricLabel: 'Decisions Automated',    icon: 'Target'      },
      { title: 'Live Deployments',        desc: 'Enterprise cognitive systems deployed across financial services, healthcare, and manufacturing sectors.',   value: '30', suffix: '+', metricLabel: 'Deployments',            icon: 'Layers'      },
    ],
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
    whatIsTitle: 'Data Science & AI',
    whatIsTitleLine2: 'That Turns Data Into',
    whatIsHighlight: 'Predictable Revenue.',
    whatIsPara2: 'Kangqore combines rigorous statistical analysis with production-grade machine learning to build, validate, and deploy models that move metrics — from customer churn prediction to demand forecasting and risk scoring.',
    businessMetrics: [
      { title: 'Model Accuracy Gain',  desc: 'Average improvement over baseline heuristics after deploying Kangqore data science models.',                         value: '38', suffix: '%',    metricLabel: 'Accuracy Improvement', icon: 'Target'    },
      { title: 'Model Delivery Speed', desc: 'Time from data exploration to production-ready model using accelerated feature engineering pipelines.',                value: '6',  suffix: ' Wks', metricLabel: 'Model Delivery',       icon: 'Zap'       },
      { title: 'Revenue Uplift',       desc: 'Average revenue uplift from predictive models in pricing, churn reduction, and customer LTV applications.',            value: '22', suffix: '%',    metricLabel: 'Revenue Uplift',       icon: 'TrendingUp'},
      { title: 'Models Built',         desc: 'Custom AI/ML models built and deployed across retail, financial services, and healthcare industries.',                  value: '80', suffix: '+',    metricLabel: 'Models Deployed',      icon: 'Layers'    },
    ],
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
    whatIsTitle: 'Generative AI That',
    whatIsTitleLine2: 'Transforms How Business',
    whatIsHighlight: 'Gets Done.',
    whatIsPara2: 'Kangqore implements LLMs, retrieval-augmented generation, and domain-specific fine-tuning so enterprises generate content, code, and decisions at 10× the speed of traditional workflows — without losing accuracy or governance control.',
    businessMetrics: [
      { title: 'Output Speed',      desc: 'Reduction in content and code generation time using enterprise LLMs versus traditional production workflows.', value: '70', suffix: '%', metricLabel: 'Faster Output',       icon: 'Zap'         },
      { title: 'Cost Per Asset',    desc: 'Average cost reduction per generated document, code artifact, or report vs. manual production.',               value: '60', suffix: '%', metricLabel: 'Cost Reduction',      icon: 'Target'      },
      { title: 'Model Accuracy',    desc: 'Fine-tuned enterprise model response accuracy on domain-specific knowledge and task benchmarks.',               value: '92', suffix: '%', metricLabel: 'Model Accuracy',      icon: 'BrainCircuit'},
      { title: 'Use Cases Live',    desc: 'Enterprise generative AI applications deployed and running across clients spanning 8+ industries.',             value: '40', suffix: '+', metricLabel: 'Use Cases Deployed',  icon: 'Layers'      },
    ],
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
    whatIsTitle: 'MLOps That Gets Models',
    whatIsTitleLine2: 'Into Production —',
    whatIsHighlight: 'And Keeps Them There.',
    whatIsPara2: 'Kangqore implements ML pipeline automation, model monitoring, and continuous retraining infrastructure — so models move from notebook to production in weeks, not months, and stay accurate long after launch.',
    businessMetrics: [
      { title: 'Deployment Frequency', desc: 'Increase in model deployment frequency after MLOps pipeline implementation and CI/CD automation.', value: '5',  suffix: 'x',    metricLabel: 'Faster Deployment',    icon: 'Zap'       },
      { title: 'Model Accuracy Gain',  desc: 'Performance improvement through automated retraining, monitoring, and continuous feedback loops.',  value: '34', suffix: '%',    metricLabel: 'Accuracy Improvement', icon: 'TrendingUp'},
      { title: 'Production Incidents', desc: 'Reduction in model drift and production failures through proactive monitoring and automated alerts.', value: '80', suffix: '%',    metricLabel: 'Fewer Incidents',      icon: 'Target'    },
      { title: 'Time to Production',   desc: 'End-to-end time from validated model to production deployment using automated MLOps pipelines.',      value: '2',  suffix: ' Wks', metricLabel: 'Deployment Speed',     icon: 'Layers'    },
    ],
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
    whatIsTitle: 'Analytics That Drives',
    whatIsTitleLine2: 'Decisions, Not Just',
    whatIsHighlight: 'Dashboards.',
    whatIsPara2: 'Kangqore builds analytics ecosystems where every stakeholder has the right data at the right time — from executive KPI dashboards to operational reports and governed self-service insight layers across the enterprise.',
    businessMetrics: [
      { title: 'Reporting Speed',  desc: 'Reduction in reporting cycle time after self-service BI and automated dashboard deployment.',                        value: '75',  suffix: '%', metricLabel: 'Faster Reporting',        icon: 'Zap'       },
      { title: 'User Empowerment', desc: 'Business users independently exploring data without engineering support after self-service analytics rollout.',    value: '5',   suffix: 'x', metricLabel: 'More Self-Service Users', icon: 'TrendingUp'},
      { title: 'KPI Visibility',   desc: 'Real-time KPI dashboards deployed across business units with a governed, single source of truth data layer.',     value: '100', suffix: '%', metricLabel: 'KPI Coverage',            icon: 'Target'    },
      { title: 'Decision Quality', desc: 'Improvement in decision quality scores after analytics platform deployment, measured via decision audit outcomes.', value: '41',  suffix: '%', metricLabel: 'Better Decisions',        icon: 'BarChart3' },
    ],
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
    whatIsTitle: 'Big Data Infrastructure',
    whatIsTitleLine2: 'Built to Process What',
    whatIsHighlight: 'Others Cannot.',
    whatIsPara2: 'Kangqore architects scalable data lakehouses, streaming pipelines, and distributed processing platforms on AWS, Azure, and GCP — enabling enterprises to store, query, and act on petabyte-scale data with sub-second freshness.',
    businessMetrics: [
      { title: 'Query Performance',    desc: 'Average improvement in analytical query response time after data warehouse modernization and lake house migration.', value: '10',  suffix: 'x',    metricLabel: 'Faster Queries',   icon: 'Zap'     },
      { title: 'Storage Cost',         desc: 'Reduction in data storage costs through lake house consolidation and tiered storage optimization.',               value: '55',  suffix: '%',    metricLabel: 'Storage Savings',  icon: 'Target'  },
      { title: 'Data Freshness',       desc: 'Real-time streaming pipelines delivering sub-second data freshness for operational analytics workloads.',         value: '<1',  suffix: ' Sec', metricLabel: 'Data Latency',     icon: 'Activity'},
      { title: 'Data Under Management',desc: 'Total data volume managed across client lake house architectures on AWS, Azure, and GCP.',                        value: '5',   suffix: 'PB+',  metricLabel: 'Petabyte Scale',   icon: 'Layers'  },
    ],
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
    whatIsTitle: 'Digital Process Automation',
    whatIsTitleLine2: 'That Removes Work, Not',
    whatIsHighlight: 'Just Speeds It Up.',
    whatIsPara2: 'Kangqore digitizes and automates end-to-end business processes — from consulting and discovery through low-code deployment and cognitive augmentation — so each workflow step contributes measurable value with zero wasted motion.',
    businessMetrics: [
      { title: 'Cycle Time',      desc: 'Average reduction in process cycle time across digitized workflows after DPA implementation.',                     value: '60',  suffix: '%',    metricLabel: 'Cycle Time Reduction',  icon: 'Zap'      },
      { title: 'Manual Touches',  desc: 'Fewer manual interventions per transaction after end-to-end workflow automation deployment.',                       value: '80',  suffix: '%',    metricLabel: 'Fewer Manual Steps',    icon: 'Target'   },
      { title: 'Audit Coverage',  desc: 'Process transactions captured with full digital audit trail for compliance and regulatory reporting.',              value: '100', suffix: '%',    metricLabel: 'Audit Trail Coverage',  icon: 'Shield'   },
      { title: 'Pilot Speed',     desc: 'Typical time from process discovery and consulting engagement to first production pilot deployment.',               value: '4–6', suffix: ' Wks', metricLabel: 'Pilot to Production',   icon: 'TrendingUp'},
    ],
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
    whatIsTitle: 'RPA That Deploys Bots',
    whatIsTitleLine2: 'That Operate Without',
    whatIsHighlight: 'Supervision.',
    whatIsPara2: 'Kangqore builds enterprise RPA programs from process assessment through Centre of Excellence establishment — deploying screen automation and cognitive bots that execute high-volume, rules-based workflows at 99.8% accuracy.',
    businessMetrics: [
      { title: 'Operational Cost', desc: 'Average cost reduction achieved across IT and business process automation programs delivered by Kangqore.', value: '40',   suffix: '%',    metricLabel: 'Cost Reduction',   icon: 'Target'    },
      { title: 'Bot Accuracy',     desc: 'Execution accuracy across finance, HR, and insurance workflows — virtually eliminating manual processing errors.',  value: '99.8', suffix: '%',    metricLabel: 'Bot Accuracy',     icon: 'Shield'    },
      { title: 'POC Delivery',     desc: 'Time from engagement kickoff to a working automation POC — output before you commit to full-scale deployment.',     value: '5–7',  suffix: ' Day', metricLabel: 'POC Speed',        icon: 'Zap'       },
      { title: 'Scalability',      desc: 'Enterprise scale multiplier — bots replicated across functions without proportional cost increase.',                value: '10',   suffix: 'x',    metricLabel: 'Bot Scalability',  icon: 'TrendingUp'},
    ],
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
    whatIsTitle: 'Business Process Management',
    whatIsTitleLine2: 'Designed to Scale Across',
    whatIsHighlight: 'Every Function.',
    whatIsPara2: 'Kangqore designs, implements, and manages end-to-end BPM programs covering sales operations, finance, supply chain, HR, and customer experience — delivering measurable cycle time reduction and operational savings at enterprise scale.',
    businessMetrics: [
      { title: 'Cycle Time',       desc: 'Average reduction in process cycle time after BPM implementation across back-office and operations functions.',   value: '40',  suffix: '%',    metricLabel: 'Cycle Time Reduction', icon: 'Zap'      },
      { title: 'Opex Savings',     desc: 'Cost reduction from process optimization, efficiency gains, and automation across managed BPM programs.',         value: '30',  suffix: '%',    metricLabel: 'Cost Savings',         icon: 'Target'   },
      { title: 'Assessment Speed', desc: 'Time from engagement kickoff to completed process assessment and optimization roadmap delivered.',                value: '2–4', suffix: ' Wks', metricLabel: 'Time to Roadmap',      icon: 'TrendingUp'},
      { title: 'Function Coverage',desc: 'Operational coverage across sales, finance, supply chain, HR, marketing, and customer experience management.',   value: '360', suffix: '°',    metricLabel: 'Business Coverage',    icon: 'Layers'   },
    ],
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
    whatIsTitle: 'Intelligent Automation',
    whatIsTitleLine2: 'That Thinks Before',
    whatIsHighlight: 'It Executes.',
    whatIsPara2: 'Kangqore combines AI decision engines with process automation to handle complexity that pure RPA cannot — automating judgment-intensive workflows, document processing, and multi-system orchestration with human-in-the-loop oversight.',
    businessMetrics: [
      { title: 'Process Cycle Time',  desc: 'Average reduction in end-to-end process cycle time following intelligent automation deployment.',                    value: '60',  suffix: '%',    metricLabel: 'Cycle Time Reduction', icon: 'Zap'      },
      { title: 'Deployment Speed',    desc: 'Typical time from automation pilot kickoff to enterprise-grade production deployment.',                               value: '4–6', suffix: ' Wks', metricLabel: 'Pilot to Production',  icon: 'TrendingUp'},
      { title: 'Bot Uptime SLA',      desc: 'Sustained automation workflow uptime across deployed intelligent automation programs under managed model.',            value: '99.5',suffix: '%',    metricLabel: 'Bot Uptime',           icon: 'Shield'   },
      { title: 'Decision Velocity',   desc: 'Faster decision cycles enabled by AI-augmented automation removing manual bottlenecks from approval chains.',         value: '3',   suffix: 'x',    metricLabel: 'Faster Decisions',     icon: 'Target'   },
    ],
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
    whatIsTitle: 'IT Security That Detects',
    whatIsTitleLine2: 'Threats Before They',
    whatIsHighlight: 'Become Breaches.',
    whatIsPara2: 'Kangqore delivers end-to-end IT security from initial assessment and threat detection through incident response and ongoing compliance management — building a security posture that is proactive, measurable, and audit-ready.',
    businessMetrics: [
      { title: 'Threat Detection',  desc: 'Improvement in threat detection rate through integrated SOC operations and AI-assisted monitoring systems.', value: '94',  suffix: '%', metricLabel: 'Detection Rate',      icon: 'Shield'   },
      { title: 'Incident Response', desc: 'Reduction in mean time to respond to security incidents after SOC implementation and playbook automation.',  value: '67',  suffix: '%', metricLabel: 'Faster Response',     icon: 'Zap'      },
      { title: 'Control Coverage',  desc: 'Security controls mapped and validated against ISO 27001, NIST CSF, SOC 2, and sector compliance frameworks.', value: '100', suffix: '%', metricLabel: 'Compliance Coverage', icon: 'Target'   },
      { title: 'Repeat Incidents',  desc: 'Reduction in recurring incidents after root cause remediation and proactive security hardening programs.',   value: '58',  suffix: '%', metricLabel: 'Incident Reduction',  icon: 'Activity' },
    ],
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
    whatIsTitle: 'AI Governance That Turns',
    whatIsTitleLine2: 'Ethics Into',
    whatIsHighlight: 'Operational Practice.',
    whatIsPara2: 'Kangqore builds comprehensive AI governance frameworks covering bias detection, model explainability, compliance monitoring, and risk assessment — aligned to EU AI Act, NIST AI RMF, ISO/IEC 42001, and sector-specific regulatory requirements.',
    businessMetrics: [
      { title: 'Audit Coverage',       desc: 'Percentage of AI model deployments covered by governance frameworks with immutable audit trails.',                      value: '100', suffix: '%', metricLabel: 'Full Audit Coverage',  icon: 'Shield'   },
      { title: 'Bias Reduction',       desc: 'Reduction in detected model bias across protected attributes after governance framework implementation.',              value: '73',  suffix: '%', metricLabel: 'Bias Reduction',       icon: 'Target'   },
      { title: 'Risk Resolution',      desc: 'AI risk findings resolved per governance sprint cycle across enterprise AI portfolios under Kangqore management.',     value: '90',  suffix: '%', metricLabel: 'Risk Resolution Rate', icon: 'Zap'      },
      { title: 'Frameworks Covered',   desc: 'Governance frameworks mapped to EU AI Act, NIST AI RMF, ISO/IEC 42001, and sector-specific compliance standards.',    value: '6',   suffix: '+', metricLabel: 'Standards Aligned',    icon: 'Layers'   },
    ],
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
