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
        title: 'Autonomous Goal Execution',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turn high-level business objectives into structured, self-adjusting execution plans that recover automatically when conditions change.',
        items: [
          'Goal Decomposition Engine: Transform high-level business objectives into structured execution plans with intelligent task sequencing, dependency mapping, and milestone tracking.',
          'Adaptive Execution: Continuously adjust workflows using real-time business context, system feedback, and changing operational conditions to maximize successful outcomes.',
          'Enterprise Toolchain Automation: Securely interact with enterprise applications, APIs, databases, SaaS platforms, RPA bots, and internal services without manual intervention.',
          'Self-Healing Execution: Detect failures, recover automatically, retry intelligently, and optimize future execution paths through continuous learning.',
        ],
      },
      {
        title: 'Enterprise Agent Orchestration',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Deploy specialized agent teams across every department and route work intelligently, with built-in consensus and centralized oversight.',
        items: [
          'Specialized Agent Teams: Deploy domain-specific AI agents across Finance, HR, Sales, Marketing, Operations, Customer Support, Legal, IT, and Engineering to collaborate on complex business processes.',
          'Dynamic Task Routing: Automatically assign work to the most capable agent based on expertise, workload, priority, and real-time operational context.',
          'Consensus-Based Decision Making: Enable multiple agents to validate information, resolve conflicts, and reach reliable decisions before executing critical business actions.',
          'Orchestration Control Center: Monitor every agent, workflow, execution status, dependencies, resource utilization, and operational performance through a centralized dashboard.',
        ],
      },
      {
        title: 'Enterprise Memory & Knowledge',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Give every agent persistent, shared organizational memory — grounded in your enterprise systems and continuously improving over time.',
        items: [
          'Persistent Enterprise Memory: Maintain long-term context across conversations, workflows, projects, customers, and organizational knowledge for consistent decision-making.',
          'Knowledge Graph Integration: Connect enterprise documents, CRMs, ERPs, databases, emails, and knowledge repositories into a unified intelligence layer.',
          'Cross-Agent Shared Intelligence: Allow multiple agents to securely share verified organizational knowledge while respecting permissions and governance policies.',
          'Continuous Organizational Learning: Improve future outcomes by learning from approved decisions, completed workflows, and historical enterprise data without retraining foundation models.',
        ],
      },
      {
        title: 'Enterprise Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Ground every recommendation in live business context and verified data — with transparent, explainable reasoning behind every decision.',
        items: [
          'Context-Aware Decision Intelligence: Understand business objectives, operational constraints, historical context, and live enterprise signals before making recommendations or taking action.',
          'Predictive Decision Support: Identify emerging risks, operational bottlenecks, customer opportunities, and strategic recommendations before they impact the business.',
          'Evidence-Based Reasoning: Generate transparent recommendations backed by verified enterprise data, trusted knowledge sources, and explainable reasoning.',
          'Explainable AI Decisions: Provide clear visibility into how conclusions were reached, increasing confidence, accountability, and stakeholder trust.',
        ],
      },
      {
        title: 'Enterprise Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Keep humans in control of every critical action with configurable approval gates, immutable audit trails, and policy-aware execution.',
        items: [
          'Human Approval Gates: Ensure critical financial, legal, compliance, and security actions require configurable human authorization before execution.',
          'Enterprise Decision Traceability: Maintain immutable records of every prompt, decision, reasoning step, tool invocation, workflow, and execution outcome.',
          'Policy-Aware Execution: Automatically enforce enterprise policies, regulatory requirements, governance standards, and organizational guardrails.',
          'Zero-Trust Agent Permissions: Grant every agent only the minimum access required using role-based permissions and zero-trust security principles.',
        ],
      },
      {
        title: 'Enterprise Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Protect every integration, credential, and inter-agent exchange with encryption, access controls, and continuous threat monitoring.',
        items: [
          'Secure Tool Access: Protect integrations with authenticated, encrypted, and policy-controlled access to enterprise systems and external services.',
          'Encrypted Agent Communication: Secure all inter-agent communication and data exchange using enterprise-grade encryption and trusted communication channels.',
          'Secrets & Credential Management: Safely manage API keys, credentials, tokens, and sensitive configuration using secure vaults and access controls.',
          'Continuous Threat Detection: Monitor agent activities in real time to identify anomalies, policy violations, suspicious behavior, and potential security threats.',
        ],
      },
      {
        title: 'Enterprise Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Automate complex business processes end-to-end, triggered by real events and continuously tuned for efficiency and cost.',
        items: [
          'Intelligent Workflow Automation: Automate repetitive and complex business processes while maintaining visibility, governance, and operational control.',
          'Event-Driven Execution: Trigger autonomous workflows instantly from business events, customer interactions, system alerts, or operational changes.',
          'SLA & Performance Monitoring: Track execution performance, service-level objectives, agent health, latency, and operational efficiency across the enterprise.',
          'Continuous Process Optimization: Analyze execution patterns and workflow performance to improve efficiency, reduce costs, and accelerate business outcomes.',
        ],
      },
      {
        title: 'Enterprise Integrations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Connect agents directly into the business applications, productivity tools, and data platforms your enterprise already runs on.',
        items: [
          'Business Applications: Integrate seamlessly with CRM, ERP, HRMS, ITSM, Finance, and industry-specific enterprise platforms.',
          'Productivity & Collaboration: Connect with Microsoft 365, Google Workspace, Slack, Microsoft Teams, email platforms, calendars, and document management systems.',
          'Enterprise Data Platforms: Access structured and unstructured data from databases, data warehouses, cloud storage, data lakes, and knowledge repositories.',
          'APIs & Custom Systems: Extend capabilities through secure REST APIs, GraphQL, webhooks, event streams, SDKs, and custom enterprise integrations.',
        ],
      },
    ],
    whatIsEyebrow: 'What Agentic AI services does Kangqore offer?',
    whatIsTitle: 'Agentic AI Services That',
    whatIsTitleLine2: 'Redefine',
    whatIsHighlight: 'Automation.',
    shortDescription: 'Unlike traditional automation or generative AI, agentic AI systems reason over goals, plan multi-step strategies, and execute them autonomously — adapting in real time to new information. Kangqore builds enterprise agentic AI that governs itself and drives measurable outcomes.',
    whatIsPara2: 'Through our agentic AI development services, we partner with enterprises to transform how work happens across CRM, ERP, and supply chain systems. Our agents operate independently using multi-agent orchestration and RAG-powered reasoning — accelerating execution and improving operational efficiency at scale.',
    bannerBrandDesc: 'Our AI, data & automation practice',
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
        headline: 'Supply chains that self-optimize.',
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
      { name: 'Strategy & Audit', description: 'Map your highest-value automation opportunities. Baseline current state, identify agent candidates, and define a prioritized roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Agent Pod', description: 'Rapid delivery of one targeted production agent — scoped, built, tested, and live. The fastest way to prove agentic ROI.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Platform Build', description: 'Design and engineer a scalable multi-agent platform integrated into your ERP, CRM, and data systems with full governance architecture.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Governed Deployment', description: 'Monitored production rollout with HITL dashboards, immutable audit trails, explainability layers, and compliance validation at every step.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Scale & Optimize', description: 'Continuous performance tuning, drift detection, and capability expansion across agent networks — so your AI compounds, not stagnates.', duration: 'Ongoing', tier: 'Enterprise' },
    ],
    outcomeCard: { illustrative: true,
      metric: '60%',
      metricLabel: 'Reduction in fraud investigation time',
      problem: 'Fraud investigation required 4–6 human analysts coordinating across 3 disconnected systems per case — creating bottlenecks, inconsistency, and unacceptable cycle times at enterprise volume.',
      outcome: 'A multi-agent agentic AI system autonomously cross-referenced transaction data, flagged anomalies, and produced investigation reports — eliminating manual coordination and reducing cycle time by 60%.',
    },
    customFAQs: [
      { q: 'What exactly falls under Kangqore\'s Agentic AI services?', a: 'We don\'t build AI demos. We build AI operators. Kangqore delivers autonomous agent development, multi-agent orchestration, RAG-powered enterprise reasoning, and governed LLM deployments using LangGraph — covering the full lifecycle from agent architecture design to production-scale optimization.' },
      { q: 'Isn\'t this just generative AI with extra steps?', a: 'Generative AI answers. Agentic AI acts. Traditional AI classifies or predicts from a fixed prompt. Agentic AI sets goals, decomposes them into multi-step plans, selects and uses tools, executes tasks autonomously, and self-corrects when outcomes deviate — without waiting for a human to issue the next instruction.' },
      { q: 'What stops an agent from doing something we didn\'t authorize?', a: 'Every agent we deploy has a governor, not just a goal. Our governance-first architecture embeds human-in-the-loop (HITL) controls, immutable audit trails, role-based access restrictions, and policy enforcement layers before a single autonomous action runs in production. Risk is validated at every phase — not discovered after go-live.' },
      { q: 'Which of our workflows are actually good candidates for an agent?', a: 'If a human currently coordinates across three or more systems to complete a task, an agent can own it. High-impact use cases include autonomous fraud investigation, supply chain renegotiation, clinical prior authorization, Level 2/3 support resolution, DevOps incident triage, and intelligent procurement — wherever complexity has made automation impossible until now.' },
      { q: 'Realistically, how long until an agent is live?', a: 'Eight weeks to a production agent — not a prototype, a live operator. A focused pilot targeting one high-value workflow typically deploys in 8–12 weeks using Kangqore\'s accelerated blueprints. Enterprise-grade multi-agent systems with full RAG integration and governance layers are production-ready within 16–24 weeks, depending on data readiness.' },
      { q: 'How do we know if the agent is actually working?', a: 'We define the ROI metric before we write a line of code. Engagements are baselined during Discovery so success is measurable from day one. Typical targets include faster vendor onboarding, fewer clicks to surface enterprise knowledge, measurable CSAT improvement in support operations, and reduced incident wait time — with the specific figure agreed against your baseline rather than quoted from ours.' },
      { q: 'Does Kangqore\'s agentic AI work for our industry specifically?', a: 'Any industry where complexity has been the enemy of automation. Kangqore delivers agentic AI across banking and financial services, healthcare and life sciences, supply chain and logistics, enterprise software engineering, and customer operations — with delivery blueprints built for the compliance and governance demands of each sector.' },
      { q: 'Will we need other vendors alongside Kangqore, or is this one engagement?', a: 'From "what should the agent do?" to "the agent is running in production" — that\'s our scope. Kangqore covers strategy and use-case identification, agent architecture design, RAG and LLM integration, multi-agent orchestration, governed deployment, and continuous post-launch optimization. One partner, full lifecycle, no handoff gaps.' },
      { q: 'What tech stack does Kangqore use for agentic AI?', a: 'Orchestration runs on LangGraph for stateful multi-agent workflows, with LangChain for tool-calling and chain composition. Memory persistence uses a hybrid approach — short-term context in working memory, long-term state in vector stores (Pinecone, Weaviate, or pgvector depending on enterprise constraints). RAG pipelines are built on enterprise embedding models with retrieval re-ranking to minimize hallucination on domain-specific data. Failure recovery is handled at the agent level via retry logic and self-correction prompts, and at the workflow level via checkpoint-based state restoration — so a failed node replays from its last valid state, not from zero. LLM selection (GPT-4o, Claude, Gemini, or fine-tuned open-source) is use-case and compliance driven. Observability and drift monitoring run through LangSmith or enterprise-compatible equivalents.' },
      { q: 'What happens when an agent makes a wrong decision?', a: 'We design for failure before writing a line of code. Agents operate within bounded permissions — they cannot act outside their assigned scope. When a step fails, checkpoint-based state restoration replays it from its last valid state, not from zero. Critical decisions trigger automatic human-in-the-loop escalation. Every action is logged to an immutable audit trail — explainable, auditable, and reversible.' },
    ],
    useAbstractHero: true,
    architectureNodes: [
      {
        title: 'PERCEIVE',
        stageName: 'PERCEIVE',
        icon: 'Search',
        bgImage: '/images/architecture/agentic-perceive.png',
        description: 'Agents ingest and understand multi-modal context from enterprise systems — structured data, documents, user signals, and real-time event streams.',
        features: ['RAG Integration', 'API Connectors', 'Multi-Modal Context', 'Real-time Telemetry'],
      },
      {
        title: 'REASON',
        stageName: 'REASON',
        icon: 'BrainCircuit',
        bgImage: '/images/architecture/agentic-reason.png',
        description: 'LLM-powered cognitive reasoning evaluates high-level goals, checks governance guardrails, and synthesizes contextual state.',
        features: ['Goal Evaluation', 'Contextual LLM Reasoning', 'State Management', 'Guardrail Verification'],
      },
      {
        title: 'PLAN',
        stageName: 'PLAN',
        icon: 'Layers',
        bgImage: '/images/architecture/agentic-plan.png',
        description: 'Decomposes complex objectives into dynamic, multi-step execution graphs and resilient strategy paths using LangGraph state machines.',
        features: ['Goal Decomposition', 'LangGraph Orchestration', 'Dependency Mapping', 'Fallback Routing'],
      },
      {
        title: 'ACT',
        stageName: 'ACT',
        icon: 'Zap',
        bgImage: '/images/architecture/agentic-act.png',
        description: 'Autonomously executes tool calls, writes to enterprise ERP/CRM systems, triggers RPA bots, and coordinates agent swarms.',
        features: ['Function Calling', 'Workflow Automation', 'System Write Access', 'Multi-Agent Handoffs'],
      },
      {
        title: 'LEARN',
        stageName: 'LEARN',
        icon: 'Activity',
        bgImage: '/images/architecture/agentic-learn.png',
        description: 'Evaluates execution outcomes, self-corrects from failures, updates persistent organizational memory, and continuously optimizes future runs.',
        features: ['Self-Correction Loops', 'Persistent Enterprise Memory', 'Outcome Evaluation', 'Drift Detection'],
      },
    ],
    featureMicros: [
      'Owns the full workflow — no handoffs, no gaps.',
      'Specialists in formation beat a single generalist.',
      'Governance is load-bearing, not bolted on.',
      'Your data. Re-ranked retrieval. No hallucinations.',
    ],
    outcomeCard2: { illustrative: true,
      metric: '67%',
      metricLabel: 'Reduction in prior authorization cycle time',
      problem: 'Clinical prior authorizations required nurses to coordinate across payer portals, EHR systems, and clinical guidelines — averaging 3.2 days per case at enterprise volume, with high rejection rates from incomplete submissions.',
      outcome: 'An agentic AI system cross-referenced clinical data, payer criteria, and prior case precedents to generate authorization submissions and track approvals autonomously — cutting cycle time by 67% and freeing clinical staff for patient-facing work.',
    },
    customJourney: [
      { phase: 'MAP',        icon: 'Search',     title: 'Map the Workflow',    desc: 'Map high-value workflows where autonomous decision-making delivers measurable ROI. Define agent personas, data sources, and success metrics.' },
      { phase: 'ARCHITECT',  icon: 'Target',     title: 'Architect the System', desc: 'Design multi-agent orchestration layers, tool-use scaffolding, safety guardrails, AI model selection, and enterprise system integrations.', kangqore: true },
      { phase: 'BUILD',      icon: 'Cpu',        title: 'Build & Integrate',   desc: 'Develop agents with LangGraph orchestration, RAG pipelines, and LLM agent frameworks — with memory systems and self-correction logic built in.', kangqore: true },
      { phase: 'LAUNCH',     icon: 'Shield',     title: 'Governed Launch',     desc: 'Implement monitored deployments with HITL dashboards, immutable audit trails, explainability layers, and compliance checks.', kangqore: true },
      { phase: 'SCALE',      icon: 'TrendingUp', title: 'Scale & Optimize',    desc: 'Integrate across ERP, CRM, and ITSM ecosystems. Enable continuous self-optimization, drift detection, and multi-agent coordination at enterprise scale.', kangqore: true },
    ],
    heroStripItems: [
      'Autonomous Goal Execution',
      'Enterprise Agent Orchestration',
      'Enterprise Memory & Knowledge',
      'Enterprise Intelligence',
      'Enterprise Governance',
      'Enterprise Security',
      'Enterprise Operations',
      'Enterprise Integrations',
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
          desc: 'Stateful multi-agent workflows on LangGraph, with LangChain handling tool-calling and chain composition.',
        },
        {
          icon: 'Cpu',
          title: 'Models',
          desc: 'GPT-4o, Claude, Gemini, or fine-tuned open-source — selected per use case and compliance requirement, not locked to one vendor.',
        },
        {
          icon: 'Layers',
          title: 'Integration',
          desc: 'Enterprise APIs, microservices, and hybrid memory across vector stores — Pinecone, Weaviate, or pgvector depending on constraints.',
        },
        {
          icon: 'Shield',
          title: 'Monitoring',
          desc: 'LangSmith-based observability and drift detection, backed by immutable audit trails and checkpoint-based recovery.',
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
    heroBadge: 'Modernize Faster. Risk Less.',
    departmentSlug: 'cognition',
    bannerBrandDesc: 'Our AI, data & automation practice',
    shortDescription: 'Legacy systems accumulate technical debt, block cloud-native adoption, and make enterprise AI integration structurally impossible. Kangqore\'s agentic AI-led modernization model eliminates that constraint — deploying autonomous agents that assess, refactor, and re-platform legacy applications at machine speed, with enterprise-grade governance at every step.',
    fullDescription: 'Deploy agentic AI modernization at enterprise scale — intelligent agents that assess, refactor, and re-platform legacy applications with cloud-native precision and human-in-the-loop governance built in.',
    fullDescriptionMaxWidth: 'max-w-[860px]',
    keyFeatures: ['Legacy Codebase Assessment', 'AI-driven Migration Blueprint', 'Microservices Decomposition', 'Cloud-native Re-platforming', 'Automated Test Generation'],
    relatedServiceSlugs: ['agentic-ai', 'genai-business-services', 'ai-governance'],
    featured: true,
    image: '/images/capabilities/software-engineering.png',
    hideBadgeStrip: true,
    hidePartnershipModel: true,

    whatIsEyebrow: 'What Agentic AI-led Application Modernization services does Kangqore offer?',
    whatIsTitle: 'Own the',
    whatIsHighlight: 'Agentic Modernization Era.',
    whatIsPara2: 'Intelligent agents scan full codebases, extract business logic, and validate cloud-native deployments autonomously — human-in-the-loop governance at every critical milestone. The outcome: measurable technical debt reduction, faster time-to-modern, and a continuous modernization capability that scales across the entire application portfolio.',

    // Framed around what the agents measurably produce, not generic program
    // outcomes — each label names an artifact a buyer can ask to see.
    businessMetrics: [
      { title: 'Assessment Velocity',        desc: 'Dependency graphs, bounded-context maps and tech-debt scorecards for a multi-million-line estate arrive in days, because scanning is parallelized across agents rather than queued behind SME availability.', value: 'Assessment Velocity',        suffix: '',  metricLabel: '',  icon: 'Zap'        },
      { title: 'Technical Debt Retired',     desc: 'Every module is scored on coupling, duplication and test coverage before work starts, so debt reduction is tracked as a burn-down against a baseline instead of asserted at the end.',                       value: 'Technical Debt Retired',     suffix: '',  metricLabel: '',  icon: 'TrendingUp' },
      { title: 'Regression Coverage',        desc: 'Agents generate characterization tests against legacy behavior before refactoring, so the migrated system is proven equivalent rather than assumed correct at cutover.',                                    value: 'Regression Coverage',        suffix: '',  metricLabel: '',  icon: 'Target'     },
      { title: 'Governed Cost Envelope',     desc: 'Scope, spend and risk stay inside a declared envelope because every autonomous action is bounded by policy and every deviation escalates to a named human owner.',                                           value: 'Governed Cost Envelope',     suffix: '',  metricLabel: '',  icon: 'Shield'     },
    ],

    // Argues why the agent model is structurally different, rather than
    // restating why manual modernization is slow — that framing is generic to
    // the category and says nothing specific about how Kangqore delivers.

    // Mirrors the five phases in customJourney below. The previous three-step
    // version described a different, more generic framework than the one the
    // page actually documents further down.

    capabilitiesLabel: 'MODERNIZATION CAPABILITIES',
    capabilitiesSectionTitle: 'Agentic AI Modernization',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesTheme: 'dark-bento-7',
    capabilityAreas: [
      {
        title: 'Application Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Agents read the monolith, recover the business rules buried in it, and carve it into independently deployable services along the seams the code actually has — not the ones an architecture diagram claims.',
        items: [
          'Legacy Re-architecture: Decompose monolithic applications into modular, independently deployable microservices.',
          'API-driven Modernization: Replace legacy integration points with versioned RESTful and GraphQL APIs with full contract documentation.',
          'Cloud-native Migration: Replatform applications to containerised, Kubernetes-native architectures on AWS, Azure, or GCP.',
          'UI/UX Modernization: Rebuild legacy interfaces into responsive, accessible, and user-centric front-end experiences.',
        ],
      },
      {
        title: 'Integration & API Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Point-to-point coupling is inventoried and replaced with versioned contracts and event streams, so services can be released independently instead of in lockstep with everything they touch.',
        items: [
          'API-led Integration Architecture: Replace point-to-point integrations with reusable, versioned API layers across enterprise systems.',
          'Event-driven Architecture: Implement Kafka, event mesh, and pub-sub patterns for real-time, decoupled business processes.',
          'Legacy Middleware Modernization: Retire legacy ESBs in favor of lightweight, cloud-native integration platforms.',
          'iPaaS Modernization: Migrate integration workloads to modern iPaaS platforms with monitoring, governance, and observability.',
        ],
      },
      {
        title: 'Data Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Schema lineage is traced across every consuming system before anything moves, so warehouses become lakehouses without silently breaking the reports and models downstream of them.',
        items: [
          'Data Platform Modernization: Migrate from legacy warehouses to modern lakehouse architectures on cloud-native platforms.',
          'Real-time Data Pipelines: Build streaming pipelines that deliver sub-second data freshness for operational analytics workloads.',
          'Data Governance & Quality: Implement cataloguing, lineage tracking, and quality frameworks across unified data estates.',
          'AI-ready Data Infrastructure: Structure and expose data to power analytics, ML models, and generative AI workloads.',
        ],
      },
      {
        title: 'Cloud Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Workload profiling determines which applications are lifted, which are re-platformed and which are rewritten, then agents generate the target topology and a rollback-safe cutover plan for each one.',
        items: [
          'Cloud Strategy & Migration: Assess, plan, and execute lift-and-shift or re-platform migrations across AWS, Azure, and GCP.',
          'Hybrid & Multi-cloud Architecture: Design resilient multi-cloud environments with consistent governance and cost control.',
          'Cloud Cost Optimization: Rightsizing, reserved capacity planning, and FinOps disciplines to eliminate cloud waste.',
          'Cloud-native Enablement: Containerisation, Kubernetes orchestration, and serverless adoption for lean, scalable operations.',
        ],
      },
      {
        title: 'Infrastructure Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Environments become reproducible code with observability and recovery designed in, so failure modes are exercised deliberately rather than discovered during an incident.',
        items: [
          'Infrastructure as Code: Provision repeatable, governed infrastructure with Terraform, Pulumi, or CloudFormation.',
          'Observability & Monitoring: Deploy unified observability stacks covering metrics, logs, traces, and alerting at full depth.',
          'Resilience & Disaster Recovery: Modernize recovery architectures with automated failover, RTO/RPO validation, and chaos engineering.',
          'Performance Engineering: Eliminate bottlenecks through load testing, capacity planning, and continuous optimization.',
        ],
      },
      {
        title: 'Quality Engineering & DevOps',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Characterization tests are generated against legacy behavior first, giving the pipeline a provable definition of "unchanged" to enforce on every subsequent refactor and release.',
        items: [
          'Test Automation Modernization: Replace manual testing with AI-assisted frameworks across unit, integration, and regression.',
          'CI/CD Pipeline Acceleration: Design modern delivery pipelines with automated gates, quality checks, and zero-downtime rollback.',
          'Shift-left Quality Engineering: Embed validation at every stage of the development lifecycle — not just at release.',
          'AI-driven Test Generation: Deploy intelligent agents that generate, execute, and triage test cases without manual intervention.',
        ],
      },
      {
        title: 'Security Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Identity, secrets and trust boundaries are re-derived for the decomposed architecture, because a monolith\u2019s implicit internal trust becomes an explicit attack surface the moment it is split.',
        items: [
          'Security-by-Design: Embed controls, identity management, and threat modeling at every architecture and deployment layer.',
          'Zero Trust Architecture: Implement identity-first access, microsegmentation, and continuous verification across the estate.',
          'Compliance Modernization: Map and validate controls against ISO 27001, SOC 2, GDPR, HIPAA, and sector requirements.',
          'Vulnerability Assessment & Remediation: Automated scanning, penetration testing, and remediation across modernized systems.',
        ],
      },
    ],

    comparisonTable: {
      colA: 'Traditional Modernization',
      colB: 'Agentic AI-led Modernization',
      rows: [
        { dimension: 'Discovery',      before: 'Engineers read subsystems one at a time, and the business rules stay in the heads of whoever has been there longest.',   after: 'Static analysis covers the whole estate at once — producing a dependency graph, and recovering the embedded business rules as a written artifact that outlives staff turnover.' },
        { dimension: 'Planning',       before: 'A static migration playbook, drafted from partial discovery and defended as reality diverges from it.',                    after: 'A blueprint that is regenerated as each subsystem is understood, alongside architecture maps and runbooks derived from the source rather than drawn once and left to drift.' },
        { dimension: 'Transformation', before: 'Refactoring and language migration written by hand, module by module, at whatever pace headcount allows.',                 after: 'Agents execute the transformation and cross-language conversion against the recovered specification, leaving engineers reviewing diffs rather than authoring them.' },
        { dimension: 'Validation',     before: 'Test coverage is written after the fact — slow, partial, and highest-risk exactly where the code is oldest.',              after: 'Characterization tests are generated against legacy behavior before anything changes, so each cutover is proven equivalent rather than assumed correct.' },
        { dimension: 'Governance',     before: 'Progress is reported in status decks; when something breaks, the reasoning behind the change is gone.',                    after: 'Every autonomous action runs inside declared policy limits and lands in an immutable audit trail, with named human sign-off at each gate.' },
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
        description: 'Generates a dynamic, prioritized migration roadmap — decomposing monoliths into bounded contexts and sequencing execution by risk and business value.',
        features: ['Bounded Context Discovery', 'Migration Sequencing', 'Risk Prioritization'],
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
        headline: 'Core banking modernized. Compliance maintained.',
        agents: ['Legacy core banking assessment and migration blueprint agent', 'API layer generation and end-to-end testing agent', 'Regulatory compliance validation and audit agent'],
      },
      {
        industry: 'Healthcare',
        headline: 'Clinical systems modernized without patient data risk.',
        agents: ['EHR/EMR dependency analysis and migration sequencing agent', 'HIPAA compliance validation and immutable audit agent', 'Integration testing and regression coverage agent'],
      },
      {
        industry: 'Manufacturing',
        headline: 'ERP modernized and cloud-native without production disruption.',
        agents: ['ERP dependency mapping and microservices decomposition agent', 'Cloud-native containerisation and deployment agent', 'Performance baseline validation and load testing agent'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Monolith decomposed into scalable microservices.',
        agents: ['E-commerce monolith bounded context discovery agent', 'Microservices scaffold generation and API contract agent', 'Load testing, performance optimization, and go-live agent'],
      },
      {
        industry: 'Insurance',
        headline: 'Policy administration re-platformed at scale.',
        agents: ['Policy system assessment and technical debt scoring agent', 'Re-platforming execution and API modernization agent', 'Regression test suite generation and validation agent'],
      },
      {
        industry: 'Telecommunications',
        headline: 'BSS/OSS modernized without service disruption.',
        agents: ['BSS/OSS dependency mapping and migration risk assessment agent', 'Cloud-native re-platforming execution and integration agent', 'End-to-end validation and compliance reporting agent'],
      },
    ],

    servicePackages: [
      { name: 'Assessment & Blueprint', description: 'AI-powered legacy codebase analysis, dependency mapping, tech debt scoring, and prioritized modernization roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Pilot Modernization',    description: 'Targeted modernization of one application, module, or service — from assessment through cloud-native deployment.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Program Build',          description: 'End-to-end re-platforming with microservices decomposition, API generation, and full governance architecture across the application portfolio.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Governed Migration',     description: 'Monitored migration rollout with HITL checkpoints, AI-generated test suites, audit trails, and compliance validation at every milestone.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Scale & Optimize',       description: 'Continuous modernization sprints, performance optimization, and AI capability integration across the modernized estate — so the work compounds.', duration: 'Ongoing', tier: 'Enterprise' },
    ],

    outcomeCard: {
      illustrative: true,
      metric: '60%',
      metricLabel: 'Reduction in modernization timeline',
      problem: 'A financial services firm faced a 3-year manual migration program for their legacy core banking system — requiring 40+ engineers, fragile manual testing, and continuous rollback risk that blocked two prior attempts.',
      outcome: 'Kangqore deployed AI assessment agents to map dependencies in days, generated the microservices decomposition blueprint autonomously, and executed re-platforming sprints with 99% automated test coverage — cutting the modernization timeline by 60%.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '3×',
      metricLabel: 'Faster assessment than manual code review',
      problem: 'An insurance group needed a complete technical debt assessment of a 15-year-old policy administration system across 2.3M lines of code — a task that would take a manual team 6+ months and still produce an incomplete picture.',
      outcome: 'AI assessment agents scanned the full codebase in 11 days, producing a dependency map, tech debt scorecard, and prioritized migration roadmap — enabling the board to commit to modernization with evidence rather than estimates.',
    },

    customFAQs: [
      { q: 'What is Agentic AI-led Application Modernization?', a: 'We don\'t migrate code — we deploy AI operators that understand legacy systems. Kangqore delivers autonomous agentic AI systems that assess entire codebases in days, generate dynamic migration blueprints, execute re-platforming to cloud-native architectures, and prove behavioral equivalence against the legacy system before cutover — compressing multi-year transformation programs into governed, measurable sprints.' },
      { q: 'How does AI reduce the risk of application modernization?', a: 'Risk in traditional modernization comes from incomplete discovery, manual execution errors, and inadequate testing. Agentic AI eliminates all three. Assessment agents map every dependency before a single line is moved. Execution agents include exception escalation and human-in-the-loop gates so no critical step happens unsupervised. And test generation agents produce comprehensive regression packs that no manual QA team could match in speed or coverage.' },
      { q: 'Which legacy systems can Agentic AI modernize?', a: 'Any legacy codebase that can be read. Kangqore\'s assessment agents work across COBOL, Java EE, .NET Framework, Oracle Forms, mainframe systems, on-premise ERPs, and custom enterprise platforms. If the code exists, the agents can assess it, plan the migration, and execute the transformation.' },
      { q: 'How fast can modernization happen with AI agents?', a: 'There are two speeds here and it matters which is which. The compute-bound work — codebase comprehension, dependency mapping, rule recovery, test generation — runs in parallel and completes in days, because it scales with hardware rather than headcount. The change-bound work does not: cutover is governed by your release windows, your change-advisory board and your regulator. So Assessment & Blueprint is 2–3 weeks end to end, a Pilot Modernization is 8 weeks, and a Program Build is 16–24. Every duration we publish is calendar time including your approval gates, not agent runtime — so if a vendor quotes an end-to-end program in days, ask which of the two numbers they are giving you.' },
      { q: 'Do you modernize to cloud-native architectures?', a: 'Yes. Kangqore\'s execution agents re-platform to containerised, Kubernetes-native architectures on AWS, Azure, or GCP — building microservices, generating API layers, and producing deployment-ready infrastructure-as-code alongside every migrated service.' },
      { q: 'Can you modernize without disrupting live business operations?', a: 'Zero-disruption migration is the design constraint, not the aspiration. We execute in parallel tracks — legacy systems stay live while agents build, test, and validate the modern equivalent. Go-live only happens after human-in-the-loop sign-off at every milestone and automated regression packs confirm functional equivalence with the legacy system.' },
      { q: 'What does the governance model look like during migration?', a: 'Every agent action is logged to an immutable audit trail. Human-in-the-loop checkpoints gate each migration milestone. Compliance validation runs continuously against GDPR, HIPAA, SOX, or sector standards relevant to your estate. You have full visibility at all times — what moved, when, by which agent, validated by whom.' },
      { q: 'How do you handle large codebases with millions of lines of code?', a: 'Scale is the point. AI assessment agents scan millions of lines in days because they operate in parallel, not sequentially. Dependency analysis, tech debt scoring, and migration sequencing happen simultaneously across the full codebase — giving you a complete modernization picture faster than a human team could review the first module.' },
    ],

    customJourney: [
      { phase: 'ASSESS',     icon: 'Search',     title: 'Legacy Assessment',    desc: 'AI agents scan the full codebase, map dependencies, score technical debt, and identify migration candidates — producing a complete modernization intelligence report in days.' },
      { phase: 'BLUEPRINT',  icon: 'Target',     title: 'Migration Blueprint',  desc: 'Generate a dynamic, prioritized migration roadmap — decomposing monoliths into bounded contexts, sequencing by risk and business value, and defining governance architecture.', kangqore: true },
      { phase: 'EXECUTE',    icon: 'Zap',        title: 'Execute & Migrate',    desc: 'Autonomous agents execute code transformation, microservices decomposition, API generation, and cloud-native re-platforming — with exception escalation and HITL checkpoints.', kangqore: true },
      { phase: 'VALIDATE',   icon: 'Shield',     title: 'Test & Validate',      desc: 'AI-generated characterization suites pin legacy behavior before refactoring begins. Human sign-off gates every milestone. Compliance validation confirms the migrated estate meets all regulatory requirements.', kangqore: true },
      { phase: 'SCALE',      icon: 'TrendingUp', title: 'Optimize & Extend',    desc: 'Continuous modernization sprints across the remaining estate. Performance optimization, tech debt elimination, and AI capability integration into the modernized architecture.', kangqore: true },
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
      'Generated suites held to a 99% coverage floor before equivalence testing begins.',
      'Full audit trail from assessment to deployment.',
    ],

    trustSignals: [
      'AI-governed modernization with human-in-the-loop checkpoints and immutable audit trails',
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
    // Every statement below is a representation to an enterprise buyer and was
    // confirmed with the business before publication. Do not copy this key to
    // another service without re-confirming the facts for that service.
    dataBoundary: {
      eyebrow: 'WHERE YOUR CODE RUNS',
      title: 'Your code runs inside a boundary',
      titleHighlight: 'you define.',
      lede: 'Before a repository is connected, four things are settled: where the agents run, which models they use, what they are allowed to touch, and what is left behind when the engagement ends.',
      blocks: [
        {
          label: 'Deployment — three models, your choice',
          body: 'Agents run inside your own cloud account, on-premise behind your firewall including air-gapped estates, or on Kangqore-managed infrastructure. The model is chosen and agreed before any repository is connected.',
        },
        {
          label: 'Models — self-hosted, open-weight',
          body: 'The models are open-weight and run on infrastructure inside the deployment boundary. No third-party model API receives your source code, so there is no external vendor tenancy holding it and no outbound inference call to audit.',
        },
        {
          label: 'Access — read-only',
          body: 'Agents are granted read access. They do not write to your repositories. Every proposed change arrives as a reviewable change set carrying its tests, diff and rationale, and a named person on your side accepts it.',
        },
        {
          label: 'Residency — set at contract',
          body: 'For customer-hosted and on-premise deployments your data sits wherever you place it. For Kangqore-managed engagements the region is a contractual parameter agreed before work begins, not a default assigned for you.',
        },
        {
          label: 'Retention — scoped to the engagement',
          body: 'Prompts, agent outputs and generated artifacts persist for the duration of the engagement and are deleted on completion. What survives is what we hand to you: the dependency graph, the test corpus, the audit ledger.',
        },
        {
          label: 'Certification',
          body: 'Kangqore holds ISO 27001 and SOC 2 certification. Client-specific regulatory controls — HIPAA, GDPR and sector regimes — are mapped during engagement setup rather than retrofitted before an audit.',
        },
      ],
    },
    // The durations in this section read as a contradiction of the "Machine
    // Speed" hero unless the page says what they measure. They are calendar
    // time, not agent runtime — stating that turns the table into evidence.
    engagementLede: 'There are five entry points, from a two-week advisory audit to an ongoing managed program. Most clients begin with a scoped pilot to prove the model on one workflow before committing to the wider estate. Durations below are calendar time including your approval gates — not agent runtime.',
    downloadAsset: '/assets/downloads/kangqore-agentic-modernization-playbook.pdf',
    downloadAssetTitle: 'Download the Playbook',
    // Without this override the section falls through to the department-level
    // `cognition` default, which advertises "cognitive computing, machine
    // learning, and AI governance" — wrong practice for this page.
    toolsStack: {
      eyebrow: 'THE METHOD',
      title: 'How an agentic modernization',
      titleHighlight: 'actually runs.',
      subtitle: 'Five rules govern how an engagement executes against your estate. Each one is a method and the outcome it produces — what the agents do, and what you are left holding afterwards.',
      image: '/images/capabilities/agentic_modernization_3d_pipeline.png',
      imageAlt: 'Agentic modernization pipeline: a tangled legacy estate is scanned by a runtime of six agents — scan, map, plan, refactor, verify and gate — and emerges as discrete, API-connected cloud-native services.',
      items: [
        {
          icon: 'Database',
          title: 'Behavior is pinned before anything moves',
          desc: 'Agents build the dependency graph, take runtime traces from live production paths, and generate a characterization suite that passes green against the legacy system exactly as it stands. The outcome is a regression gate that did not previously exist: every later change is measured against recorded behavior rather than institutional memory, so "did we break something" resolves to a test result instead of an argument.',
        },
        {
          icon: 'Brain',
          title: 'Target state compiles to a work graph',
          desc: 'You specify the destination — bounded contexts, service boundaries, target runtime — and a planner compiles it into a dependency-ordered work graph, then executes across that graph concurrently. The outcome is that sequencing derives from coupling actually present in the code rather than from an estimate, and independent branches run at once instead of queueing behind a single engineer.',
        },
        {
          icon: 'Search',
          title: 'Rules recovered, then seams cut',
          desc: 'Scanners emit a call graph and a debt score, then stop. Agents continue past that line — reconstructing business rules out of nested conditionals and stored procedures, then deriving service boundaries from observed coupling: call frequency, shared-data access, co-change history. The outcome is decomposition that follows how the system behaves rather than the package structure, which usually encodes team history instead of domain logic.',
        },
        {
          icon: 'Eye',
          title: 'Strangler-fig rollout behind a facade',
          desc: 'New services run alongside the legacy path with traffic shifted a slice at a time behind a routing facade, both implementations exercised against identical requests and their responses compared. The outcome is that divergence surfaces while the old path is still serving, which makes reversing a step a routing change rather than an incident.',
        },
        {
          icon: 'Shield',
          title: 'Gated, reversible, and cumulative',
          desc: 'Agent output arrives as a reviewable change set carrying its tests, diff and rationale; architecture, data-model and go-live decisions require a named human approval, and each increment is versioned independently. The outcome is twofold: any single step rolls back without unwinding the rest, and the artifacts left behind — graph, rule set, test corpus, gating policies — carry into the next application, so effort per service falls as estate coverage rises.',
        },
      ],
    },
  },

  'ai-cognitive-computing': {
    slug: 'ai-cognitive-computing',
    name: 'AI & Cognitive Computing',
    heroTitle: 'AI & Cognitive Computing\nServices for the Thinking Enterprise',
    heroMaxWidth: 'max-w-[82%]',
    heroTitleSize: 'text-[1.5rem] sm:text-[1.88rem] lg:text-[2.6rem] xl:text-[3.4rem]',
    heroBadge: 'Systems That Understand, Reason & Act',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Leverage cognitive technologies to mimic human thought processes',
    fullDescription: 'Implement cognitive computing solutions that understand, reason, and learn from data to enhance business operations.',
    keyFeatures: ['Natural language understanding', 'Pattern recognition', 'Machine reasoning', 'Knowledge management', 'Cognitive insights'],
    relatedServiceSlugs: ['agentic-ai', 'data-science-ai', 'genai-business-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    hideBadgeStrip: true,
    capabilitiesLabel: 'COGNITIVE COMPUTING SERVICES',
    capabilitiesSectionTitle: 'Cognitive Computing Service',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilityAreas: [
      {
        title: 'Machine Learning Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design, develop, and operationalise enterprise machine learning systems that transform data into predictive intelligence, automated decision-making, and continuously improving business outcomes.',
        items: [
          'Predictive Intelligence: Forecast customer behavior, market trends, operational demand, and business outcomes using historical and real-time enterprise data.',
          'Statistical Learning: Develop mathematically robust models that uncover hidden patterns, quantify uncertainty, and support evidence-based decision making.',
          'Deep Learning Systems: Leverage advanced neural network architectures to solve complex recognition, forecasting, optimization, and generative AI challenges.',
          'Feature Engineering: Transform and optimize enterprise data to maximize model accuracy, reliability, and business performance.',
          'Model Optimization: Continuously improve model accuracy, efficiency, scalability, and inference performance across production environments.',
          'Model Monitoring: Monitor model drift, bias, accuracy, explainability, and operational health throughout the AI lifecycle.',
        ],
      },
      {
        title: 'Computer Vision & Visual Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Enable enterprise systems to understand, interpret, and derive actionable intelligence from images, video streams, visual documents, and spatial environments.',
        items: [
          'Image Intelligence: Extract structured insights from photographs, satellite imagery, scanned documents, and industrial visual assets.',
          'Video Analytics: Analyze live and recorded video streams to detect events, monitor activities, and automate operational workflows.',
          'Object Recognition: Identify, classify, and monitor physical objects across diverse visual environments using AI-powered detection models.',
          'Facial Analytics: Perform face detection, verification, identification, and behavioral analysis while supporting enterprise security and compliance.',
          'Document Intelligence: Convert unstructured visual documents into searchable, structured, and actionable enterprise information.',
          'Scene Intelligence: Understand complete visual environments by interpreting objects, activities, relationships, and contextual information.',
          'Visual Search: Enable intelligent image-based search and content discovery across enterprise media repositories.',
        ],
      },
      {
        title: 'Natural Language Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Empower enterprise applications to understand, interpret, generate, and reason over human language across conversations, documents, and organizational knowledge.',
        items: [
          'Conversational AI: Develop intelligent virtual assistants and enterprise chatbots capable of natural, context-aware interactions.',
          'Language Understanding: Interpret user intent, sentiment, entities, relationships, and contextual meaning across communication channels.',
          'Speech Intelligence: Enable speech recognition, transcription, speaker identification, and voice analytics for enterprise applications.',
          'Document Intelligence: Automatically classify, summarize, process, and extract knowledge from enterprise documents at scale.',
          'Information Extraction: Identify entities, business facts, relationships, and critical information from unstructured textual content.',
          'Semantic Search & Retrieval: Deliver AI-powered enterprise search that surfaces contextually relevant knowledge across distributed information sources.',
          'Language Generation: Generate accurate reports, summaries, business communications, and contextual responses using advanced language models.',
        ],
      },
      {
        title: 'Generative AI Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design, build, and deploy enterprise-grade generative AI solutions that accelerate innovation, automate knowledge work, and transform digital experiences.',
        items: [
          'Enterprise LLM Solutions: Build customized large language model applications aligned with enterprise knowledge and business processes.',
          'Retrieval-Augmented Generation (RAG): Combine enterprise knowledge with foundation models to deliver accurate, secure, and context-aware AI responses.',
          'AI Copilots: Develop intelligent copilots that assist employees with research, analysis, decision-making, and workflow automation.',
          'AI Agent Development: Engineer autonomous AI agents capable of reasoning, planning, tool utilization, and multi-step execution.',
          'Multimodal AI: Develop AI systems capable of understanding and generating text, images, audio, video, and structured data.',
          'AI Content Generation: Automate the creation of reports, proposals, marketing content, technical documentation, software code, and business communications.',
          'Prompt Engineering: Design, evaluate, and optimize AI interactions for accuracy, consistency, reliability, and business effectiveness.',
          'LLMOps: Manage the deployment, evaluation, monitoring, optimization, governance, and lifecycle of enterprise language models.',
        ],
      },
      {
        title: 'Decision Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Transform enterprise data into explainable recommendations that improve strategic, operational, and real-time business decisions.',
        items: [
          'Predictive Decision Support: Provide AI-driven recommendations based on predictive analytics and enterprise intelligence.',
          'Prescriptive Analytics: Recommend optimal actions by evaluating business objectives, constraints, and available alternatives.',
          'Scenario Simulation: Model multiple business scenarios to evaluate potential outcomes before critical decisions are made.',
          'Optimization Engines: Continuously optimize pricing, logistics, scheduling, inventory, resource allocation, and operational performance.',
          'Risk Intelligence: Identify, quantify, and monitor operational, financial, regulatory, and strategic risks.',
          'Decision Automation: Automate repeatable business decisions while maintaining governance and human oversight.',
        ],
      },
      {
        title: 'Knowledge Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Transform enterprise knowledge into a connected, searchable, and AI-accessible intelligence layer that enhances organizational decision-making.',
        items: [
          'Enterprise Knowledge Graphs: Connect business entities, relationships, and organizational knowledge into intelligent graph-based systems.',
          'Semantic Intelligence: Understand business meaning, relationships, and context beyond traditional keyword-based systems.',
          'Ontology Engineering: Design enterprise ontologies that establish consistent business definitions and AI reasoning capabilities.',
          'Knowledge Discovery: Identify hidden relationships, trends, and opportunities across enterprise information ecosystems.',
          'Enterprise Search: Provide unified semantic search across structured and unstructured enterprise knowledge sources.',
          'Contextual Intelligence: Deliver relevant knowledge based on user context, organizational relationships, and business objectives.',
        ],
      },
      {
        title: 'Autonomous & Agentic Systems',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Develop intelligent autonomous systems capable of reasoning, planning, collaborating, and executing complex enterprise workflows with minimal human intervention.',
        items: [
          'Autonomous Agents: Deploy AI agents capable of independently planning, executing, and adapting complex business tasks.',
          'Multi-Agent Systems: Coordinate specialized AI agents that collaborate to solve enterprise-scale business challenges.',
          'Agent Orchestration: Manage communication, coordination, and task distribution across multiple autonomous agents.',
          'Cognitive Workflow Automation: Automate end-to-end enterprise workflows requiring reasoning, planning, and contextual decision-making.',
          'Human-AI Collaboration: Enable intelligent cooperation between employees and AI agents through governed decision workflows.',
          'Agent Governance: Monitor, secure, audit, and control autonomous agent behavior across enterprise environments.',
        ],
      },
      {
        title: 'AI Engineering & MLOps',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Operationalise enterprise AI by building scalable infrastructure, deployment pipelines, monitoring frameworks, and production-ready AI platforms.',
        items: [
          'MLOps: Automate the development, deployment, monitoring, and maintenance of machine learning models.',
          'AI Infrastructure: Design scalable compute, storage, networking, and GPU architectures supporting enterprise AI workloads.',
          'AI Deployment Pipelines: Streamline continuous integration and continuous deployment for AI models and intelligent applications.',
          'Model Lifecycle Management: Manage versioning, validation, approvals, deployment, rollback, and retirement of AI models.',
          'Performance Optimization: Improve latency, throughput, scalability, resource utilization, and infrastructure efficiency.',
          'AI Observability: Monitor model performance, operational health, usage patterns, costs, and production reliability.',
        ],
      },
      {
        title: 'AI Governance & Responsible AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Establish enterprise governance frameworks that ensure AI systems remain secure, transparent, compliant, explainable, and trustworthy throughout their lifecycle.',
        items: [
          'Responsible AI: Implement ethical AI principles that promote fairness, accountability, transparency, and responsible innovation.',
          'Explainable AI: Provide transparent reasoning, confidence scoring, and interpretable AI decision-making.',
          'AI Governance: Define enterprise policies, governance frameworks, approval workflows, and operational controls for AI systems.',
          'AI Risk Management: Identify, assess, monitor, and mitigate operational, regulatory, and reputational AI risks.',
          'Compliance Management: Ensure AI systems align with organizational policies and applicable regulatory requirements.',
          'AI Security: Protect AI models, datasets, infrastructure, APIs, and inference pipelines from threats and misuse.',
        ],
      },
      {
        title: 'Extended Reality (XR) Solutions',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Create immersive digital experiences that improve engineering, workforce training, product visualization, operational planning, and customer engagement.',
        items: [
          'Augmented Reality Solutions: Overlay contextual digital information onto physical environments to improve operational efficiency and user experiences.',
          'Virtual Reality Experiences: Develop immersive virtual environments for collaboration, simulation, training, and customer engagement.',
          'Mixed Reality Applications: Combine physical and digital environments to enable intelligent real-time interaction with enterprise systems.',
          'Digital Twin Visualization: Create interactive virtual representations of physical assets, facilities, and business operations for monitoring and optimization.',
          'Spatial Computing: Enable intelligent interaction between users, digital content, and physical environments using spatial awareness technologies.',
          'Immersive Product Experiences: Allow customers and stakeholders to visualize, configure, and experience products before manufacturing or purchase.',
          'Industrial Simulation: Model engineering, manufacturing, logistics, and operational environments to optimize performance while reducing cost and risk.',
        ],
      },
    ],
    whatIsEyebrow: 'What AI & Cognitive Computing services does Kangqore offer?',
    whatIsTitle: 'AI & Cognitive Computing',
    whatIsTitleLine2: 'Solutions That',
    whatIsHighlight: 'Think, Learn & Act.',
    whatIsPara2: 'Kangqore implements cognitive systems across NLP, knowledge reasoning, and adaptive learning — enabling enterprises to automate judgment-intensive decisions and surface insights from unstructured information at scale.',
    bannerBrandDesc: 'Our enterprise AI & cognitive computing product & platform',
    downloadAsset: '/assets/downloads/kangqore-cognitive-computing-playbook.pdf',
    comparisonTable: {
      colA: 'Traditional Automation',
      colB: 'Cognitive Computing & AI',
      rows: [
        { dimension: 'Autonomy',    before: 'Rule-dependent, semi-autonomous — requires human instruction at every branch.', after: 'Fully autonomous reasoning — perceives context, evaluates goals, and acts without prompting.' },
        { dimension: 'Workflow',    before: 'Linear and predefined — breaks on edge cases outside the script.', after: 'Multi-step, non-linear, self-correcting — adapts when conditions change.' },
        { dimension: 'Learning',    before: 'Static logic — must be manually reprogrammed to handle new scenarios.', after: 'Continuous learning — learns from execution loops and improves with every cycle.' },
        { dimension: 'Integration', before: 'Siloed connectors — isolated databases, manual reports, and fragmented analytics.', after: 'Multi-system orchestration — unifies knowledge across ERP, CRM, and enterprise APIs.' },
        { dimension: 'Outcomes',    before: 'Reactive task reduction — reduces effort on known tasks.', after: 'Goal-driven business outcomes — transforms enterprise data into autonomous execution.' },
      ],
    },
    architectureNodes: [
      {
        title: 'Perception Layer',
        icon: 'Search',
        description: 'Systems ingest and interpret multi-modal enterprise context — structured data, documents, vision, and real-time event streams.',
        features: ['RAG Integration', 'API Connectors', 'Real-time Event Streams'],
      },
      {
        title: 'Cognitive Engine',
        icon: 'BrainCircuit',
        description: 'LLM & neural reasoning for goal decomposition, multi-step planning, semantic search, and self-correction when outcomes deviate.',
        features: ['Multi-step Planning', 'Memory Management', 'Self-Correction', 'Cognitive Reasoning'],
      },
      {
        title: 'Action & Execution',
        icon: 'Zap',
        description: 'Cognitive agents autonomously execute tasks across CRM, ERP, and internal systems — writing to systems and triggering workflows.',
        features: ['Function Calling', 'Workflow Automation', 'System Write Access'],
      },
      {
        title: 'Governance Core',
        icon: 'Shield',
        description: 'Strict oversight, explainability, ethical boundaries, and policy enforcement baked in at the architecture level.',
        features: ['Immutable Audit Logs', 'RBAC Controls', 'Human-in-the-Loop'],
      },
    ],
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Compliance, fraud, and risk handled with cognitive precision.',
        agents: ['Compliance monitoring agent', 'Fraud investigation agent', 'Credit decisioning agent'],
      },
      {
        industry: 'Healthcare',
        headline: 'Clinical workflows that move at the speed of care.',
        agents: ['Patient triage agent', 'Prior authorization agent', 'Clinical data extraction agent'],
      },
      {
        industry: 'Manufacturing',
        headline: 'Supply chains and industrial operations that self-optimize.',
        agents: ['Supply chain rerouting agent', 'Predictive maintenance agent', 'Vendor onboarding agent'],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Personalisation and demand intelligence at scale.',
        agents: ['Conversational shopping agent', 'Personalized campaign agent', 'Demand forecasting agent'],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Incidents resolved before the ticket is raised.',
        agents: ['Incident triage agent', 'Self-service IT support agent', 'DevOps remediation agent'],
      },
      {
        industry: 'EdTech',
        headline: 'Learning experiences that adapt to every student.',
        agents: ['Personalized learning agent', 'Automated grading agent', 'Administrative compliance agent'],
      },
    ],
    servicePackages: [
      { name: 'Strategy & Audit', description: 'Map your highest-value cognitive automation opportunities. Baseline current state, identify targets, and define a prioritized roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Cognitive Pod', description: 'Rapid delivery of one targeted production cognitive system — scoped, built, tested, and live. The fastest way to prove cognitive ROI.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Platform Build', description: 'Design and engineer a scalable cognitive platform integrated into your ERP, CRM, and data systems with full governance architecture.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Governed Deployment', description: 'Monitored production rollout with HITL dashboards, immutable audit trails, explainability layers, and compliance validation at every step.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Scale & Optimize', description: 'Continuous performance tuning, drift detection, and capability expansion across cognitive networks — so your AI compounds, not stagnates.', duration: 'Ongoing', tier: 'Enterprise' },
    ],
    outcomeCard: { illustrative: true,
      metric: '87%',
      metricLabel: 'Improvement in unstructured data comprehension',
      industry: 'Global Financial Services',
      problem: 'Risk and compliance teams spent 12,000+ hours annually manually reading unstructured regulatory filings, cross-border contracts, and compliance disclosures — creating severe decision latency and missed operational risk flags.',
      outcome: 'Kangqore implemented an enterprise cognitive reasoning engine using multi-modal NLP, semantic search, and knowledge graph extraction — enabling automated compliance analysis with 87% comprehension accuracy and 4x faster insights.',
    },
    outcomeCard2: { illustrative: true,
      metric: '65%',
      metricLabel: 'Complex decision automation rate',
      industry: 'Healthcare & Clinical Research',
      problem: 'Clinical research data extraction and patient eligibility screening required doctors to manually review dense EHR notes and protocol documents across multiple hospital silos.',
      outcome: 'A cognitive decision intelligence platform parsed unstructured clinical records in real-time, matching eligible patients to trial protocols autonomously — accelerating clinical trial candidate identification by 65%.',
    },
    businessMetrics: [
      { title: 'Data Comprehension',  desc: 'Improvement in unstructured data comprehension using multi-modal NLP and cognitive reasoning engines.',                              value: '87', suffix: '%',    metricLabel: 'Comprehension Accuracy', icon: 'BrainCircuit' },
      { title: 'Decision Automation', desc: 'Complex business decisions automated through cognitive decision intelligence and prescriptive analytics platforms.',                     value: '65', suffix: '%',    metricLabel: 'Decisions Automated',    icon: 'Target'       },
      { title: 'Knowledge Discovery',  desc: 'Faster insight discovery from enterprise knowledge graphs, semantic search, and contextual intelligence layers.',                       value: '4',  suffix: 'x',    metricLabel: 'Faster Insights',        icon: 'Zap'          },
      { title: 'Models in Production', desc: 'Enterprise AI and cognitive computing models deployed and operationalised across client organizations.',                                  value: '120',suffix: '+',    metricLabel: 'Models Deployed',        icon: 'Layers'       },
    ],
    customFAQs: [
      { q: 'What exactly is cognitive computing, and how is it different from AI?', a: 'AI is the broad discipline. Cognitive computing is the architectural philosophy — systems that mimic human reasoning processes: understanding context, learning from experience, interpreting ambiguity, and making judgment calls. Kangqore builds cognitive systems that don\'t just classify or predict — they reason over enterprise knowledge, learn from operational feedback, and execute decisions that previously required human judgment.' },
      { q: 'Which cognitive capabilities does Kangqore actually deliver?', a: 'We deliver across ten capability domains: Machine Learning Engineering, Computer Vision & Visual Intelligence, Natural Language Intelligence, Generative AI Services, Decision Intelligence, Knowledge Intelligence, Autonomous & Agentic Systems, AI Engineering & MLOps, AI Governance & Responsible AI, and Extended Reality Solutions. Each domain ships production-grade systems — not demos.' },
      { q: 'How does Kangqore handle NLP and language understanding?', a: 'Our Natural Language Intelligence practice covers conversational AI, intent and sentiment analysis, speech recognition, document intelligence, entity extraction, semantic search, and language generation. Every NLP solution is grounded in your enterprise data — not generic pre-training — so responses reflect your policies, terminology, and knowledge base accurately.' },
      { q: 'Can you build computer vision systems for our industry?', a: 'Yes. We deploy computer vision across manufacturing (defect detection, quality control), healthcare (medical imaging, pathology analysis), retail (visual search, shelf monitoring), financial services (document processing, fraud detection), and logistics (inventory monitoring, warehouse automation). Every system is validated against your domain-specific accuracy requirements before production deployment.' },
      { q: 'What does the generative AI offering include?', a: 'Enterprise LLM solutions, retrieval-augmented generation (RAG), AI copilots for employee productivity, autonomous agent development, multimodal AI, AI content generation, prompt engineering, and LLMOps for model lifecycle governance. We build GenAI that is grounded in your data, governed by your policies, and measurable against your business objectives.' },
      { q: 'How do you ensure AI governance and responsible AI?', a: 'Governance is load-bearing, not cosmetic. Every cognitive system ships with explainable AI layers, fairness testing, bias detection, compliance alignment (GDPR, EU AI Act, sector mandates), immutable audit trails, and human-in-the-loop approval gates. Kangqore\'s governance framework covers model risk management, data privacy, security controls, and organizational accountability.' },
      { q: 'What about decision intelligence — can AI actually make business decisions?', a: 'Not unsupervised — but it can recommend, simulate, and automate them with governance. Our decision intelligence systems provide predictive decision support, prescriptive analytics, scenario simulation, optimization engines, risk intelligence, and decision automation — all with configurable human oversight levels depending on decision criticality.' },
      { q: 'How does knowledge intelligence differ from enterprise search?', a: 'Enterprise search finds documents. Knowledge intelligence understands relationships. Kangqore builds enterprise knowledge graphs that connect entities, facts, and context across your organization — then layers semantic intelligence, ontology engineering, knowledge discovery, and contextual retrieval on top. The result: AI that doesn\'t just find information but understands what it means in your business context.' },
      { q: 'What does a typical engagement look like?', a: 'Week 1–3: Strategy & Audit — map highest-value cognitive automation targets. Week 4–11: Cognitive Pod — deliver one production-ready cognitive system. Week 12–24: Platform Build — scale to enterprise-wide cognitive infrastructure. Ongoing: Governed Deployment + Scale & Optimize — production monitoring, drift detection, and continuous capability expansion.' },
      { q: 'What industries has Kangqore delivered cognitive computing for?', a: 'Banking & financial services (compliance, fraud, credit decisioning), healthcare (clinical triage, research extraction, patient eligibility), manufacturing (predictive maintenance, supply chain optimization, quality control), retail & consumer (personalisation, demand forecasting, conversational commerce), IT & infrastructure (incident resolution, DevOps remediation), and education (adaptive learning, automated assessment). Each engagement starts from industry-specific cognitive blueprints, not generic templates.' },
    ],
    customJourney: [
      { phase: 'DISCOVER',   icon: 'Search',     title: 'Cognitive Discovery',     desc: 'Map enterprise knowledge flows, identify high-value cognitive automation targets, and baseline current decision-making quality across business processes.' },
      { phase: 'ARCHITECT',  icon: 'Target',     title: 'System Architecture',     desc: 'Design cognitive system architecture — NLP pipelines, knowledge graphs, decision engines, vision models, and integration layers — with governance embedded from day one.', kangqore: true },
      { phase: 'BUILD',      icon: 'Cpu',        title: 'Build & Train',           desc: 'Develop, train, and validate cognitive models against enterprise data — achieving production-grade accuracy, explainability, and performance benchmarks.', kangqore: true },
      { phase: 'DEPLOY',     icon: 'Shield',     title: 'Governed Deployment',     desc: 'Deploy with human-in-the-loop oversight, real-time monitoring dashboards, drift detection alerts, and immutable audit trails for every cognitive decision.', kangqore: true },
      { phase: 'SCALE',      icon: 'TrendingUp', title: 'Scale & Compound',        desc: 'Expand cognitive capabilities across departments, connect knowledge graphs enterprise-wide, and continuously optimize model accuracy and operational efficiency.', kangqore: true },
    ],
    featureMicros: [
      'Systems that reason — not just classify.',
      'Knowledge graphs that connect, not just index.',
      'Governance baked in at the architecture level.',
      'Enterprise data, enterprise accuracy, enterprise trust.',
    ],
    heroStripItems: [
      'Machine Learning Engineering',
      'Computer Vision & Visual Intelligence',
      'Natural Language Intelligence',
      'Generative AI Services',
      'Decision Intelligence',
      'Knowledge Intelligence',
      'Autonomous & Agentic Systems',
      'AI Engineering & MLOps',
      'AI Governance & Responsible AI',
      'Extended Reality Solutions',
    ],
    trustSignals: [
      'Production cognitive systems deployed across banking, healthcare, manufacturing & retail',
      'Enterprise AI governance with explainability, bias detection & compliance controls',
      'Multi-modal intelligence — NLP, vision, speech, knowledge graphs & decision engines',
      'Proven delivery: 120+ models in production with measurable business outcomes',
    ],
    conciergeChips: [
      'Which cognitive computing capability fits our business challenge?',
      'How fast can you deploy a production NLP or vision system?',
      'What governance controls come built in?',
      'Can you build cognitive systems for our specific industry?',
      'Book a Cognitive Computing strategy session',
    ],
    toolsStack: {
      title: 'Cognitive Computing Technology Stack',
      subtitle: 'The enterprise-grade toolchain powering every Kangqore cognitive computing deployment.',
      items: [
        {
          icon: 'Brain',
          title: 'Models & Frameworks',
          desc: 'PyTorch, TensorFlow, Hugging Face Transformers, scikit-learn, spaCy, and custom neural architectures — selected per domain and compliance requirement.',
        },
        {
          icon: 'Cpu',
          title: 'Foundation Models',
          desc: 'GPT-4o, Claude, Gemini, Llama, Mistral, and fine-tuned domain-specific models — vendor-agnostic selection based on use case, accuracy, and governance.',
        },
        {
          icon: 'Layers',
          title: 'Data & Knowledge',
          desc: 'Neo4j knowledge graphs, Pinecone & Weaviate vector stores, Apache Kafka streaming, and enterprise data lake architectures for real-time cognitive ingestion.',
        },
        {
          icon: 'Shield',
          title: 'Governance & Ops',
          desc: 'MLflow model registry, LangSmith observability, SHAP explainability, Weights & Biases experiment tracking, and immutable audit trail infrastructure.',
        },
      ],
    },
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
    image: '/images/capabilities/agentic-governed-autonomy.png',
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
    hideBadgeStrip: true,
    capabilitiesLabel: 'DATA SCIENCE & AI SERVICES',
    capabilitiesSectionTitle: 'Our',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilityAreas: [
      {
        title: 'Data Engineering & Modern Data Platforms',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design scalable, secure, and modern data ecosystems that enable trusted analytics, artificial intelligence, and enterprise decision-making.',
        items: [
          'Real-Time & Batch Data Engineering: Build high-performance data pipelines that process streaming and batch workloads to support operational intelligence and analytics at scale.',
          'Data Lakehouse & Warehouse Architecture: Design modern lakehouse and warehouse platforms that unify structured, semi-structured, and unstructured enterprise data.',
          'Event Streaming & Data Integration: Implement event-driven architectures that enable continuous data ingestion, real-time processing, and enterprise-wide data integration.',
          'Data Quality Engineering: Establish automated data validation, profiling, cleansing, monitoring, and quality controls to ensure trusted enterprise data.',
          'Data Governance & Lineage: Implement enterprise governance frameworks that provide data cataloguing, lineage tracking, metadata management, and policy enforcement.',
          'Enterprise Data Architecture: Develop scalable, cloud-native data architectures that support analytics, AI workloads, and long-term digital transformation initiatives.',
        ],
      },
      {
        title: 'Machine Learning & Predictive Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Develop intelligent machine learning solutions that enable prediction, optimization, automation, and data-driven business decision-making.',
        items: [
          'Predictive Modeling & Forecasting: Develop advanced forecasting models for demand planning, financial forecasting, operational optimization, and strategic decision support.',
          'Classification & Anomaly Detection: Build intelligent classification and anomaly detection systems that identify fraud, operational risks, quality issues, and unusual behavior.',
          'Recommendation Intelligence: Create AI-powered recommendation systems that deliver personalised customer experiences and improve engagement, retention, and revenue.',
          'Statistical & Quantitative Modeling: Apply advanced statistical methods, experimentation, and causal analysis to generate reliable business insights.',
          'Feature Engineering & Model Development: Design high-quality data features and optimize machine learning models for improved predictive performance and scalability.',
          'Decision Intelligence: Combine machine learning, analytics, and business rules to support intelligent, explainable, and data-driven decision-making.',
        ],
      },
      {
        title: 'Generative AI & Intelligent Systems',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design enterprise-grade Generative AI solutions that enhance productivity, automate knowledge work, and enable intelligent business operations.',
        items: [
          'Enterprise Copilots & AI Assistants: Develop secure AI assistants that augment employees with contextual knowledge, automation, and intelligent decision support.',
          'Retrieval-Augmented Generation (RAG): Build enterprise RAG architectures that combine foundation models with trusted organizational knowledge for accurate and grounded AI responses.',
          'Enterprise Knowledge Intelligence: Develop intelligent search, semantic retrieval, and knowledge management platforms that unlock enterprise information.',
          'Domain-Specific Generative AI: Create industry-specific Generative AI applications tailored to unique business processes, regulations, and operational requirements.',
          'Multi-Agent AI Systems: Develop collaborative AI agent ecosystems capable of coordinating complex workflows, autonomous task execution, and enterprise orchestration.',
          'AI Workflow Automation: Integrate Generative AI into enterprise workflows to automate repetitive processes, improve productivity, and accelerate business operations.',
        ],
      },
      {
        title: 'MLOps & AI Lifecycle Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Establish enterprise engineering practices that enable reliable, scalable, and governed deployment, operation, and continuous improvement of AI systems.',
        items: [
          'AI Deployment Pipelines: Implement automated CI/CD pipelines that streamline the development, testing, deployment, and delivery of AI solutions.',
          'Model Lifecycle Management: Manage AI models across development, validation, deployment, monitoring, retraining, and retirement using governed lifecycle processes.',
          'Model Versioning & Registry: Maintain centralized model repositories with complete version history, documentation, metadata, and reproducibility.',
          'AI Performance Monitoring: Continuously monitor production models for accuracy, latency, throughput, reliability, and operational performance.',
          'Drift Detection & Continuous Learning: Automatically detect data and concept drift while enabling continuous retraining and model optimization.',
          'AI Observability: Provide end-to-end visibility into model behavior, inference quality, resource utilization, operational health, and production AI systems.',
        ],
      },
      {
        title: 'AI Governance & Responsible AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Ensure enterprise AI systems operate responsibly, securely, transparently, and in compliance with organizational policies and regulatory requirements.',
        items: [
          'Responsible AI Frameworks: Establish governance principles and organizational frameworks that guide the responsible design, deployment, and operation of AI systems.',
          'Fairness & Bias Management: Identify, measure, and mitigate bias across datasets, models, and AI-driven decision processes to promote equitable outcomes.',
          'Explainable AI: Implement interpretable AI techniques that provide transparent reasoning, confidence scores, and understandable decision explanations.',
          'AI Risk & Compliance: Manage AI-related operational, regulatory, ethical, and business risks while ensuring compliance with enterprise governance standards.',
          'Audit & Governance Controls: Maintain comprehensive audit trails, governance policies, approval workflows, and operational controls for enterprise AI systems.',
          'Privacy & Data Protection: Protect sensitive enterprise information through privacy-preserving AI practices, data governance, encryption, and regulatory compliance.',
        ],
      },
    ],
  },

  'genai-business-services': {
    slug: 'genai-business-services',
    name: 'GenAI Business Services',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    // Renders as the first paragraph of the "what is" block and carries
    // data-speakable, so it is the passage a voice assistant reads aloud for
    // this service. It was "Implement generative AI solutions for business
    // transformation" — seven words describing the category, in the one slot
    // optimized for voice. Not the meta description; seoData supplies that.
    shortDescription: 'Kangqore builds generative AI systems that retrieve from your own documents before they answer, and show the passage they used.',
    // Renders as the hero paragraph and feeds Service.description in the JSON-LD,
    // so it has to stand alone as a definition. It also sits roughly one screen
    // above shortDescription, which is the data-speakable sentence — so the two
    // divide the work rather than echo: this one names the four layers the page
    // is built on (retrieval, guardrails, evaluation, serving), shortDescription
    // makes the grounding claim. The previous copy promised image generation and
    // content creation, neither of which this page delivers.
    fullDescription: 'Enterprise generative AI engineered for production with grounded retrieval, strict guardrails and scalable unit economics.',
    fullDescriptionMaxWidth: 'max-w-[700px]',
    keyFeatures: ['LLM implementation', 'Custom model fine-tuning', 'Content generation', 'Code generation', 'Enterprise AI assistants'],
    relatedServiceSlugs: ['agentic-ai', 'ai-governance', 'mlops'],
    featured: true,
    capabilitiesTheme: 'dark-bento-14',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    // The eyebrow above is a question — "What does Kangqore build with
    // generative AI?" — and the previous heading answered it with a slogan
    // ("Generative AI That Transforms How Business Gets Done."). This answers
    // it, and states the thesis the rest of the page argues: grounding.
    whatIsTitle: 'Generative AI that answers',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'from your evidence.',
    // The previous version claimed content, code and decisions "at 10x the
    // speed of traditional workflows" — a multiplier with nothing behind it,
    // in the paragraph a reader trusts most. The nouns were the good part and
    // they are kept.
    // Enumerates the same six layers the toolchain section details, in the same
    // order, so the summary and the detail agree. Guardrails was the one link
    // missing: the diagram beside this paragraph shows a GUARDRAILS stage and
    // the paragraph did not mention it, which under-sold the page against its
    // own artwork.
    whatIsPara2: 'Retrieval-augmented generation over your corpus, prompt and context engineering held under version control, guardrails on both sides of the model, model routing that keeps cost proportionate to the question, and evaluation that runs on every change. Fine-tuning where form matters, after retrieval rather than instead of it.',

    // Two paragraphs added to carry the section's two remaining arguments:
    // what survives a vendor change, and what the system does when it does not
    // know. Both are elaborated later on the page (the ownership FAQ and the
    // comparison table), so these are deliberately written in different
    // sentences rather than lifted forward.
    whatIsPara3: 'Model vendors are rented and replaced. What persists is the corpus, the retrieval configuration, the versioned prompts and the evaluation set that proves any of it works. Those are the durable assets, and they carry from the first workflow to the twentieth.',
    whatIsPara4: 'When retrieval returns nothing relevant, the system says so. A refusal is an output, not a fault. An institution comes to rely on a system that admits the limits of what it holds, and stops relying on one that is fluent about everything.',
    // Four unsourced performance claims stood here: faster output, cost per
    // asset, model accuracy, and a count of deployments across industries. The
    // last two are the dangerous ones — an accuracy figure is unanswerable
    // without naming the benchmark it was measured on, and a deployment count
    // is a track-record assertion with no proof anywhere on the site. Both are
    // the kind of number a procurement team asks you to evidence.
    //
    // These four are traceable to content elsewhere on this page: the first two
    // are the durations in "Five ways to start", the third is the six layers in
    // the toolchain section, and the fourth is a property of what we build
    // rather than a measurement of how well it performed.
    businessMetrics: [
      { title: 'Use-Case Triage',   desc: 'From your candidate list to a scored shortlist. Which use cases have the evidence to be grounded, and which do not.',                          value: '2',  suffix: ' wks', metricLabel: 'To a Scored Shortlist', icon: 'Search'      },
      { title: 'First Workflow',    desc: 'One workflow taken to production on your corpus, with retrieval, guardrails, an evaluation set and cost telemetry in place.',                   value: '8',  suffix: ' wks', metricLabel: 'To Production',        icon: 'Rocket'      },
      // Named "Toolchain Layers", not "Layers Standardized": the architecture
      // section on the same page is headed "The 4-Layer Stack", and two
      // different counts under one word read as an error even though both are
      // right. These six are the toolsStack rows; those four are the
      // architectureNodes.
      { title: 'Toolchain Layers',  desc: 'Models, retrieval, orchestration, guardrails, evaluation and tuning. Each carries a managed and a self-hosted option, chosen per constraint.', value: '6',  suffix: '',     metricLabel: 'Toolchain Layers',     icon: 'Layers'      },
      { title: 'Cited Answers',     desc: 'Answers are returned with the passage they were drawn from, and the system declines rather than guessing when retrieval finds nothing relevant.', value: '100', suffix: '%',   metricLabel: 'Carry Their Source',   icon: 'BrainCircuit'},
    ],
    // ── Section eyebrow ────────────────────────────────────────────────────
    // The template default is `What ${name} services does Kangqore offer?`, and
    // this service's name already ends in "Services" — the page shipped reading
    // "WHAT GENAI BUSINESS SERVICES SERVICES DOES KANGQORE OFFER?".
    whatIsEyebrow: 'What does Kangqore build with generative AI?',

    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'Every layer.',
      titleHighlight: 'Deployed on your terms.',
      subtitle: 'Model vendors change every few months and the stack around them does not. These are the six layers we standardize once and reuse across every team that follows. Both options at each layer are viable in production — which one you get depends on where your data is allowed to go, the volume it runs at, and who you want operating it at three in the morning.',
      items: [
        {
          icon: 'Cpu',
          title: 'Foundation models',
          managed: 'GPT-4o · Claude · Gemini · Amazon Bedrock',
          selfHosted: 'Llama · Mistral · Qwen on your own GPUs',
          desc: 'Managed models are the fastest path to production. Self-hosted models are required when data privacy, latency, or specific domain tuning is paramount.',
        },
        {
          icon: 'Database',
          title: 'Retrieval & vector search',
          managed: 'Azure AI Search · Vertex AI Search · Pinecone',
          selfHosted: 'pgvector · Qdrant · Weaviate · OpenSearch',
          desc: 'Vector databases store the embeddings used for retrieval. Managed options scale effortlessly, while self-hosted options integrate deeply with existing data infrastructure.',
        },
        {
          icon: 'Network',
          title: 'Orchestration & context',
          managed: 'Azure AI Foundry · Vertex AI Agent Builder',
          selfHosted: 'LangGraph · LlamaIndex · Semantic Kernel',
          desc: 'The orchestration layer connects the user prompt to the retrieval engine and the foundation model. Open source frameworks give you absolute control over the execution graph.',
        },
        {
          icon: 'Shield',
          title: 'Guardrails & safety',
          managed: 'Azure Content Safety · Bedrock Guardrails',
          selfHosted: 'Llama Guard · NeMo Guardrails · custom classifiers',
          desc: 'Guardrails intercept malicious prompts before they reach the model, and filter harmful outputs before they reach the user. Mandatory for any enterprise deployment.',
        },
        {
          icon: 'Activity',
          title: 'Evaluation & observability',
          managed: 'Azure AI Evaluation · Vertex AI Evaluation',
          selfHosted: 'Ragas · DeepEval · LangSmith · Langfuse · Phoenix',
          desc: 'Evaluation frameworks run tests on every change to prove the system works. Observability platforms trace every call to diagnose latency and track costs.',
        },
        {
          icon: 'Settings',
          title: 'Fine-tuning & serving',
          managed: 'Bedrock customization · Vertex AI tuning · OpenAI fine-tuning',
          selfHosted: 'LoRA & QLoRA · vLLM · Text Generation Inference',
          desc: 'Fine-tuning adapts a model to your specific domain or format. Self-hosted serving engines like vLLM maximize throughput and minimize latency for high-volume inference.',
        },
      ]
    },

    // ── Hero ───────────────────────────────────────────────────────────────
    // Replaces the Cognition department defaults: the badge read "Reasoning.
    // Learning. Autonomous." and the strip ended "…Knowledge Graphs, Autonomous
    // Agents, AI Governance" — agentic-AI language above the fold on a page
    // about generative systems.
    heroBadge: 'Generative AI Built to Ground',
    heroStripItems: [
      'Retrieval-Augmented Generation', 'Prompt & Context Engineering', 'Model Routing', 'Guardrails',
      'Evaluation Suites', 'Fine-Tuning', 'Token Cost Control', 'Output Governance',
    ],

    // ── Comparison ─────────────────────────────────────────────────────────
    // Without these the section inherits the agentic-AI framing: a lede about
    // "who decides the next step" and columns headed TRADITIONAL AI vs AGENTIC
    // AI, under a heading about generative AI.
    comparisonTable: {
      // Chosen deliberately as a vendor-framed heading. Two things to know if
      // this section is edited later:
      //
      // 1. The rows below never name Kangqore — they compare DEMO-GRADE GENAI
      //    against GOVERNED ENTERPRISE GENAI across five category dimensions.
      //    The heading asks a vendor question the body answers at category
      //    level. Aligning them means changing afterLabel and the lede too,
      //    not just this string.
      // 2. The earlier heading carried "correctly, every time", an absolute
      //    contradicted by the hallucination FAQ and by row four of this table.
      //    Whatever replaces this heading must not reintroduce it.
      heading: 'Why Kangqore for GenAI?',
      // Rewritten to answer the heading. It previously opened on the industry's
      // demo-to-production gap, which followed from "A demo answers…" but not
      // from a question about Kangqore. It now names what we do differently and
      // then hands off to the five dimensions, so heading, lede and rows argue
      // the same thing.
      lede: 'Most generative AI reaches a convincing demo in two weeks, and stalls on everything that makes an answer trustworthy. We build for the five things that decide whether a system survives production: where the facts came from, who is allowed to see them, how you know it is still right next month, what it refuses to say, and what it costs per thousand users rather than per demo.',
      dimensionLabel: 'DIMENSION',
      beforeLabel: 'DEMO-GRADE GENAI',
      afterLabel: 'WITH KANGQORE',
      afterBadge: 'GROUNDED',
      beforeShort: 'Demo-grade',
      afterShort: 'With Kangqore',
      rows: [
        { dimension: 'Grounding', before: 'The model answers from whatever it learned in pre-training. It is fluent about your business and occasionally wrong about it, and nothing distinguishes the two on screen.', after: 'Every answer is retrieved from your own corpus before it is generated, with the source passages returned alongside it, so a reader can check the claim, and an auditor can see what the model was looking at.' },
        { dimension: 'Permissions', before: 'One index for everyone. A retrieval system that has read the whole intranet will happily quote the salary review to whoever asks.', after: 'Retrieval runs under the asking user\'s permissions, so the index cannot return a passage they could not already open. Access control lives in the retrieval layer, not in the prompt.', link: { href: '/services/it-security-services', label: 'AI security and access control' } },
        { dimension: 'Evaluation', before: 'Quality is whatever the person demoing it thought looked good. There is no holdout set, because there is no single correct answer to hold out against.', after: 'Graded rubrics over a fixed question set, adversarial suites for the failure modes that matter, and human review on the sample that decides promotion. A prompt change that lowers the score does not ship.', link: { href: '/services/mlops', label: 'Evaluation and MLOps' } },
        { dimension: 'Guardrails', before: 'The system will attempt any question asked of it, including the ones it should decline, and there is no record of what it was asked.', after: 'Refusal is designed, not hoped for: input classification, output filters, and an escalation path for anything outside remit. The prompt, the retrieved context and the response are retained for audit.', link: { href: '/services/ai-governance', label: 'AI governance and audit' } },
        { dimension: 'Unit economics', before: 'Cost is a surprise at the end of the first full month, because inference is metered per token and nobody measured the tokens.', after: 'Token budgets per workflow, caching on the repeated questions that dominate real traffic, and routing that sends the easy majority to a smaller model. Cost per resolved query is a number you can quote.' },
      ],
    },

    // ── Architecture ───────────────────────────────────────────────────────
    // The Cognition default renders an AI Governance stack — policy layers,
    // consent management, kill-switches. Those are real, but they are not how a
    // generative system is built, and none of it mentions retrieval, prompts,
    // evaluation or tokens on a page about generative AI.
    architectureNodes: [
      { title: 'Knowledge & Retrieval', icon: 'Database', description: 'Your documents chunked, embedded and indexed, with retrieval that runs under the asking user\'s permissions so an answer can never quote a source they could not open.', features: ['Chunking & Embedding', 'Hybrid Search', 'Permission-Aware Retrieval', 'Source Attribution'] },
      { title: 'Orchestration & Context', icon: 'Network', description: 'Prompt templates and context assembly held as versioned artifacts, with routing that sends each request to the model that can answer it most cheaply.', features: ['Prompt Versioning', 'Context Assembly', 'Model Routing', 'Tool & Function Calling'] },
      { title: 'Guardrails & Evaluation', icon: 'Shield', description: 'PII redaction and moderation on the way in, hallucination and jailbreak checks on the way out, and quality measured on graded rubrics — because there is no single correct answer to test against.', features: ['PII Redaction & Moderation', 'Jailbreak & Injection Filters', 'Graded Rubrics', 'Human Review Gates'] },
      { title: 'Serving & Unit Economics', icon: 'Activity', description: 'Caching on the repeated questions that dominate real traffic, token budgets per workflow, and latency measured where the user waits rather than at the API.', features: ['Semantic Caching', 'Token Budgets', 'Latency SLOs', 'Per-Query Cost Telemetry'] },
    ],

    // ── Industries ─────────────────────────────────────────────────────────
    // The inherited default listed eighteen "Agents" — Clinical Validation
    // Agent, Pricing Fairness Agent, Consumer Privacy Agent — and interpolated
    // the service name into prose, producing "Clinical GenAI business services
    // validation". These name the work instead.
    industryHeading: 'Generative systems,',
    industryHeadingHighlight: 'grounded in your sector’s evidence.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Answers a compliance officer can trace to a document',
        items: [
          'Retrieval over policy, product and regulatory documents, with the source passage returned beside every answer',
          'Adverse-action and complaint drafting where the underlying evidence is cited rather than paraphrased',
          'Prompt, context and response retained per interaction, so a decision can be reconstructed months later',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical drafting that never leaves the evidence behind',
        items: [
          'PHI redacted before retrieval and never written to prompt logs',
          'Summaries grounded in the record they came from, with the passage shown for clinician review',
          'Refusal on anything that would constitute diagnosis or dosing without a human in the loop',
        ],
      },
      {
        industry: 'Manufacturing & Industry',
        headline: 'Thirty years of maintenance knowledge, searchable in a sentence',
        items: [
          'Retrieval across manuals, service bulletins and engineer field notes, including scanned documents',
          'Procedure drafting that cites the revision it was generated from, so a superseded manual is visible',
          'Deployment inside the plant network where equipment documentation cannot leave the site',
        ],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Catalog content at range scale, on brand and on claim',
        items: [
          'Product copy generated from attribute data rather than invented, with a brand rubric scored before publish',
          'Regulated claims checked against an approved-claims list rather than left to the model',
          'Localization that keeps the claim set intact across markets with different rules',
        ],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Incident context assembled while the incident is still open',
        items: [
          'Retrieval across runbooks, past incidents and change history to summarize what is likely happening',
          'Draft remediation steps cited to the runbook that authorizes them, never freehand',
          'Per-team token budgets and routing, so one noisy service cannot consume the inference spend',
        ],
      },
      {
        industry: 'EdTech & Higher Ed',
        headline: 'Assessment and feedback with the reasoning shown',
        items: [
          'Feedback generated against a published rubric, with the criterion cited for each comment',
          'Student data minimized before retrieval, with lineage evidence for audit',
          'Human review required on anything affecting progression or a grade',
        ],
      },
    ],

    // ── Engagement outcomes ────────────────────────────────────────────────
    // The Cognition fallback produced "99.9% Efficiency gain" and "100%
    // operational reliability" — neither is a coherent quantity — over prose
    // interpolated from the service name. These stay illustrative, but the
    // metric is the arithmetic of the story rather than a number chosen first.
    outcomeCard: {
      illustrative: true,
      metric: '4×',
      metricLabel: 'More questions resolved without a human',
      industry: 'Banking & Financial Services',
      problem: 'A support desk answered policy questions by hand because the first assistant they built was confidently wrong often enough that agents stopped trusting it. Deflection stalled at roughly one question in ten, and every wrong answer cost more to unpick than answering it manually would have.',
      outcome: 'Answers are now retrieved from the policy corpus before they are generated, with the source passage shown beside each one, and the system declines rather than guesses when retrieval returns nothing relevant. Deflection moved from one question in ten to four, because agents could see what the answer was based on.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '62%',
      metricLabel: 'Lower cost per resolved query',
      industry: 'Retail & Consumer Goods',
      problem: 'Every request went to the largest available model, including the repeated ones. The first full month of production inference cost several times the pilot estimate, and nobody could say which workflow was responsible.',
      outcome: 'Semantic caching absorbed the repeated questions that made up most of real traffic, and routing sent the easy majority to a smaller model with the large one held for what needed it. Cost per resolved query fell 62% with no measured change in answer quality.',
    },

    // ── Engagement model ───────────────────────────────────────────────────
    // Replaces the generic five tiers, whose descriptions were built from
    // `${name.toLowerCase()}` and rendered "Comprehensive GenAI business
    // services assessment".
    servicePackages: [
      { name: 'Use-Case Triage', description: 'Score candidate use cases on evidence availability, tolerance for a wrong answer, and volume. Ends with the two worth building and the reasons the rest are not.', duration: '2 weeks', tier: 'Advisory' },
      { name: 'Grounded Pilot', description: 'One workflow taken to production on your corpus: retrieval, guardrails, an evaluation set, and cost telemetry — so the second use case is configuration rather than a project.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'GenAI Platform Build', description: 'Shared retrieval, prompt and context versioning, model routing, evaluation harness and observability as infrastructure as code, with per-team token budgets.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Managed GenAI Operations', description: 'We run it: evaluation on every prompt and index change, guardrail tuning against real traffic, model migration as vendors deprecate, and cost management.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Fine-Tuning & Model Ownership', description: 'Where retrieval is not enough: dataset curation, fine-tuning or adapter training, and evaluation against the base model to prove the delta is real.', duration: 'Ongoing', tier: 'Enterprise' },
    ],

    // See the note on /services/mlops. This page tells its engagement story with
    // evidence in "Five ways to start" and the FAQ, so the six generic
    // consultancy claims below it subtract rather than add.
    hidePartnershipModel: true,

    // Two mid-page conversion points. There were 9,294px between the hero CTA
    // and the next one, spanning the capability grid, the comparison table, the
    // architecture and the industries — the whole persuasive middle of the page
    // with no way to act on it.
    inlineCtaAfterCapabilities: 'Not sure which of these your use case actually needs? Most engagements start by finding out which two are worth building.',
    inlineCtaAfterComparison: 'Most teams arrive here with a demo that impressed everyone and a system nobody trusts.',

    // ── Toolchain ──────────────────────────────────────────────────────────
    // The inherited default was closer to right here than anywhere else — it is
    // a RAG stack, and this is the RAG page — but it was titled "GenAI Business
    // Services Technology Stack" over a subtitle about "cognitive computing,
    // machine learning, and AI governance", and the names sat inside `desc`,
    // which only appears on hover.
    toolsStack: {
      // Two-beat declarative, in the register enterprise platform vendors use:
      // a claim about control rather than a description of process. "Vendor
      // selection" named the activity, which is consulting language; this names
      // what the reader gets from it. Both beats are literal — six layers, each
      // with a managed and a self-hosted option chosen against their own
      // constraints — so it is a summary of the rows, not a slogan over them.
      eyebrow: 'THE TOOLCHAIN',
      title: 'Every layer.',
      titleHighlight: 'Deployed on your terms.',
      // Named one deciding axis (data residency) where there are three, and did
      // not say the layers are standardized once and reused — which is what
      // "at enterprise scale" actually means here, as against one team's pilot.
      subtitle: 'Model vendors change every few months and the stack around them does not. These are the six layers we standardize once and reuse across every team that follows. Both options at each layer are viable in production — which one you get depends on where your data is allowed to go, the volume it runs at, and who you want operating it at three in the morning.',
      items: [
        {
          icon: 'Brain',
          title: 'Foundation models',
          managed: 'GPT-4o · Claude · Gemini · Amazon Bedrock',
          selfHosted: 'Llama · Mistral · Qwen on your own GPUs',
          desc: 'Routing between them matters more than picking one. Self-hosted open weights are the answer when data residency forbids a third-party API, and the cost case only works above sustained volume — below that, managed inference is cheaper than the GPUs sitting idle.',
        },
        {
          icon: 'Database',
          title: 'Retrieval & vector search',
          managed: 'Azure AI Search · Vertex AI Search · Pinecone',
          selfHosted: 'pgvector · Qdrant · Weaviate · OpenSearch',
          desc: 'pgvector is usually the right first answer: it puts the embeddings next to the data that generated them, in a database you already operate. A dedicated vector database earns its place once semantic search volume, hybrid ranking or re-ranking becomes the constraint — or once several teams index into the same store and need isolation between them.',
        },
        {
          icon: 'Network',
          title: 'Orchestration & context',
          managed: 'Azure AI Foundry · Vertex AI Agent Builder',
          selfHosted: 'LangGraph · LlamaIndex · Semantic Kernel',
          desc: 'The framework is the least durable choice on this page, so we keep prompts, context assembly and routing as versioned artifacts that outlive it. A system that cannot be rebuilt on a different framework is a dependency. Managed orchestration is the faster start and ties you to one cloud\'s agent runtime; you move to self-hosted when several teams need the same prompt and routing layer on their own release cycle.',
        },
        {
          icon: 'Shield',
          title: 'Guardrails & safety',
          managed: 'Azure Content Safety · Bedrock Guardrails',
          selfHosted: 'Llama Guard · NeMo Guardrails · custom classifiers',
          desc: 'Applied on both sides — PII detection and moderation before retrieval, hallucination and jailbreak filtering before display — because the failure that matters is not an offensive answer but a confident one drawn from a document the asker should never have seen. Red-teaming the deployment is part of acceptance, not a later exercise. Managed classifiers cover the common categories from day one; you self-host once the policy is specific to your sector and has to be versioned and audited alongside the prompts it governs.',
        },
        {
          icon: 'Eye',
          title: 'Evaluation & observability',
          managed: 'Azure AI Evaluation · Vertex AI Evaluation',
          selfHosted: 'Ragas · DeepEval · LangSmith · Langfuse · Phoenix',
          desc: 'Graded rubrics over a fixed question set, run on every prompt and index change rather than before launch only. Traces retained per request, because a bad answer is not reproducible without the context that produced it. Managed evaluation is enough while one team owns one system; a self-hosted harness earns its place once the evaluation set becomes an asset you version, share between teams and keep when we leave.',
        },
        {
          icon: 'Cpu',
          title: 'Fine-tuning & serving',
          managed: 'Bedrock customization · Vertex AI tuning · OpenAI fine-tuning',
          selfHosted: 'LoRA & QLoRA · vLLM · Text Generation Inference',
          desc: 'Reached for after retrieval, not instead of it. Fine-tuning teaches form — tone, structure, a house style — and rarely fixes a factual gap; a model that does not know something still does not know it after training on how to phrase answers.',
        },
      ],
      image: '/images/capabilities/agentic-ai-tools-dark-illustration.png',
      imageAlt: 'The GenAI toolchain in six layers, each with its managed cloud option and its self-hosted open-source equivalent',
    },

    // ── Calls to action ────────────────────────────────────────────────────
    midCta: 'Your next answer comes with its source.',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One grounded system in production.',
      body: 'Bring the use case you have already tried and could not make trustworthy. In 30 minutes we will tell you whether retrieval fixes it, what the evidence has to look like, and what it will cost per query at your volume.',
      proofLabel: 'From first call to first grounded workflow',
    },

    // ── FAQ ────────────────────────────────────────────────────────────────
    // The six inherited questions were vendor-shaped ("what makes your approach
    // unique") and byte-identical to every other service still on the default.
    // These are the queries buyers and answer engines actually type:
    // definitional, disambiguating, and decision-shaped. Answers lead with the
    // answer so the first sentence stands alone as a quote, and carry paragraph
    // breaks (see faqParagraphs in data/serviceFaqs.js).
    customFAQs: [
      {
        q: 'What is generative AI for business?',
        a: 'Generative AI produces new text, code, images or structured output from a prompt, rather than classifying or predicting from a fixed set of options. In an enterprise the useful version is narrower than the consumer one: a system that answers from your documents, drafts in your formats, and declines when it does not know.\n\n'
          + 'The distinction that matters commercially is grounding. A model answering from pre-training alone is fluent about your business and occasionally wrong about it, and nothing on screen separates the two. A grounded system retrieves from your own corpus first and shows the passage it used.\n\n'
          + 'That is why most enterprise value sits in retrieval, evaluation and guardrails rather than in the model. The model is the part you rent and will replace within a year; the rest is the part you own.',
      },
      {
        q: 'What is the difference between RAG and fine-tuning?',
        a: 'Retrieval-augmented generation gives the model the right facts at the moment it answers. Fine-tuning changes how the model behaves. They solve different problems and are routinely confused for each other.\n\n'
          + 'Use retrieval when the answer depends on information that changes, is specific to your organization, or has to be citable. Updating a document updates the answer, with no retraining, and the source can be shown next to the response.\n\n'
          + 'Use fine-tuning when the problem is form rather than fact: a house tone, a rigid output structure, a domain vocabulary the base model handles awkwardly. It rarely fixes a knowledge gap — a model that does not know something still does not know it after being trained on how to phrase answers.\n\n'
          + 'In practice, almost every enterprise system starts with retrieval, and a minority add fine-tuning afterwards for the last increment of consistency.',
      },
      {
        q: 'How do you stop the model hallucinating?',
        a: 'Hallucination is a language model stating something false with the same fluency it states something true. You cannot stop a model generating a plausible sentence — you can stop that sentence reaching a user unmarked, and that is a system design problem rather than a model problem.\n\n'
          + 'Three controls do most of the work. Ground the answer in retrieved passages so the model is summarizing rather than recalling. Return the source alongside the answer, so a reader can check it in one click and the cost of a wrong answer drops sharply. And make refusal a designed path: when retrieval returns nothing relevant, the correct output is that we do not have that, not a fluent guess.\n\n'
          + 'What remains is measured rather than assumed. A fixed question set is scored on every prompt and index change, and the failure modes that matter to your domain get an adversarial suite of their own — including jailbreak attempts, prompt injection through retrieved documents, and the red-team cases your risk function asks about.',
      },
      {
        q: 'Does our data get used to train someone else\'s model?',
        a: 'Not on the enterprise tiers of the major providers, and it is worth being precise about why. Azure OpenAI, Amazon Bedrock, Google Vertex AI and Anthropic\'s and OpenAI\'s business agreements all contractually exclude customer inputs and outputs from training by default.\n\n'
          + 'The real exposure is elsewhere: retention windows for abuse monitoring, which region the inference runs in, and what your own prompt logs capture. A system that writes full prompts to a log has copied the sensitive part of every request into a second place.\n\n'
          + 'Where the answer has to be nothing leaves our estate, we deploy open-weight models on your own infrastructure. That is a real cost decision rather than a preference — self-hosting is cheaper only above sustained volume, and below it you are paying for idle GPUs.',
        // Every URL verified to resolve before being published. An answer that
        // asserts what a third party does with your data is worth little
        // without the document that says so.
        sources: [
          { label: 'Azure OpenAI data, privacy and security', url: 'https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy' },
          { label: 'Amazon Bedrock data protection', url: 'https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html' },
          { label: 'Google Vertex AI data governance', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance' },
          { label: 'Anthropic commercial terms', url: 'https://www.anthropic.com/legal/commercial-terms' },
          { label: 'OpenAI platform data usage', url: 'https://platform.openai.com/docs/guides/your-data' },
        ],
      },
      {
        q: 'How do you evaluate a system with no single correct answer?',
        a: 'By replacing accuracy with graded rubrics over a fixed question set. Each question has criteria — is it grounded in a retrieved passage, does it cite the source, does it refuse when it should, is the tone right — scored by a model and sampled by a human.\n\n'
          + 'The set is built from real questions rather than invented ones, which is why the first two weeks of a pilot is worth more than the demo that preceded it: it produces the questions the system will actually face.\n\n'
          + 'The point is regression, not a launch score. Prompts, retrieval indexes and model versions all change, and each change is capable of quietly degrading a case that used to work. The evaluation runs on every one of them, and a change that lowers the score does not ship.',
      },
      {
        q: 'Which use cases are actually worth building?',
        a: 'The ones where the evidence already exists in writing, and a wrong answer is recoverable.\n\n'
          + 'Evidence first: if the knowledge lives in documents, tickets, transcripts or code, retrieval has something to ground on. If it lives only in a colleague\'s head, no amount of prompting will produce it, and the project is a knowledge-capture exercise wearing an AI badge.\n\n'
          + 'Consequence second: drafting, summarizing, searching and triaging are good early candidates because a human sees the output before it matters. Anything that acts without review — payments, clinical decisions, irreversible changes — needs the governance built first and is rarely where to start.\n\n'
          + 'Volume decides the order. A workflow that runs a hundred times a day repays the platform work; one that runs weekly does not, however visible it is.',
      },
      {
        q: 'What does a generative AI system cost to run?',
        a: 'Inference is metered per token, so cost scales with usage in a way most enterprise software does not, and the first full month in production is where teams get surprised.\n\n'
          + 'Three levers move it. Caching absorbs the repeated questions that dominate real traffic — support and internal-knowledge workloads are far more repetitive than they look. Routing sends the easy majority to a smaller model and reserves the large one for what needs it. And context discipline matters, because retrieving twenty passages when four would do multiplies the token count on every single call.\n\n'
          + 'We instrument cost per resolved query from the pilot onward rather than at the first invoice, and set token budgets per workflow so one team cannot consume the estate\'s inference spend.',
      },
      {
        q: 'Who owns the system after the engagement ends?',
        a: 'You do. Every engagement ships infrastructure as code, the evaluation set and its harness, the prompt and retrieval configuration under version control, and runbooks for the failure modes we actually hit in your environment.\n\n'
          + 'The evaluation set is the part that matters most and is most often missing. Without it, the next person to change a prompt is guessing, and the system degrades silently from that point.\n\n'
          + 'Managed Operations is available where you would rather we ran it — but that is a choice you make after you can already run it yourself, not a condition of the thing working.',
      },
    ],

    // ── Capability areas ──────────────────────────────────────────────────
    // Rewritten 2026-08-12. The previous version was written in a different
    // register from the rest of the page — roughly fourteen times the
    // boilerplate density measured elsewhere on it, and the word "you" did not
    // appear once in 2,671 words. At nearly two fifths of the page's copy that
    // was the largest quality gap on the site.
    //
    // Sub-capability NAMES are unchanged — they are the searchable taxonomy
    // and they feed 87 Service objects in the OfferCatalog JSON-LD. Only the
    // prose after each colon is new. The card front splits on ':' and shows
    // the name alone, so that format is load-bearing.
    capabilityAreas: [
      {
        title: 'GenAI Strategy & Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Decide what to build before you build it — which use cases have evidence to ground on, what a wrong answer costs in each, and which ones will never earn their inference spend.',
        items: [
          'GenAI Transformation Strategy: Sequence the work by evidence and volume rather than by visibility. A workflow that runs a hundred times a day repays the platform work; the one the board asked about may not.',
          'AI Maturity Assessment: Find out where your documents actually live, who is allowed to read them, and what condition they are in — retrieval inherits every problem your content estate already has.',
          'Operating Model Design: Settle who owns prompts, who approves a model change, and who gets paged when an answer is wrong. Pilots stall on those three questions more often than on technology.',
          'Enterprise AI Policy: Write down what staff may paste into which tool, naming the tools. A policy easier to follow than to ignore is the only kind that changes behavior.',
          'Portfolio Governance: Track cost per resolved query for each workflow, so renewal is a conversation about which use cases earn their spend rather than about whether AI is working.',
          'Adoption & Change Management: Train people on what the system will refuse as well as what it will answer. Trust survives a refusal; it rarely survives a confident error.',
        ],
      },
      {
        title: 'Agentic AI & Autonomous Systems',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Systems that take actions rather than only answer — each action scoped to what the asking user could already do, and logged with the context that produced it.',
        items: [
          'Intelligent Digital Workers: Agents that complete multi-step work inside your applications, with every action recorded against the request that triggered it.',
          'Multi-Agent Systems: Several narrow agents with a checking step between them, used where one broad agent would guess. Coordination is worth its complexity only when the subtasks genuinely differ.',
          'Enterprise AI Copilots: Assistants embedded where the work already happens, drawing on retrieval rather than memory, so an answer can be traced to the document behind it.',
          'Autonomous Workflow Automation: Automation that interprets the goal rather than following a fixed script, and escalates instead of improvising when it meets a case it was not built for.',
          'Agent Orchestration: One place that decides which agent runs, under which policy, on which budget — because agents free to call each other are impossible to cost or audit afterwards.',
          'Tool-Using AI Systems: Function calling into your APIs and databases under the caller\'s own permissions, with writes held behind approval wherever the action cannot be undone.',
        ],
      },
      {
        title: 'Enterprise Knowledge & RAG',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Retrieval over your own documents, running under the asking user\'s permissions, so an answer can never quote a passage they could not open themselves.',
        items: [
          'Enterprise Knowledge Assistants: Answers drawn from your policies, procedures and manuals, returned with the passage they came from so a reader can check the claim in one click.',
          'Secure RAG Architectures: The index carries each document\'s access control, not just its text. A retrieval layer that has read the whole intranet will otherwise quote the salary review to whoever asks.',
          'Semantic Retrieval: Hybrid search — meaning and keyword together — because pure vector search misses exact part numbers and pure keyword search misses the same question phrased differently.',
          'Contextual Knowledge Bots: Interfaces that hold the thread of a conversation and re-retrieve as it moves, rather than answering each turn as though it were the first.',
          'Knowledge Grounding: The model summarizes what was retrieved instead of recalling what it was trained on, and declines when retrieval comes back with nothing relevant.',
          'Enterprise Search Intelligence: Search that answers the question rather than returning ten links, while still showing which documents it read to get there.',
        ],
      },
      {
        title: 'AI Information & Document Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turn the documents you already hold — including the scanned ones nobody has indexed — into something a system can retrieve, cite and act on.',
        items: [
          'AI-Powered Document Intelligence: Read contracts, reports and correspondence at volume, extracting what matters and flagging what needs a human rather than guessing at it.',
          'Intelligent Information Extraction: Pull entities, dates, amounts and obligations into structured fields, keeping the page and line alongside so any value can be checked against its source.',
          'Document Classification: Route incoming documents by type and sensitivity before anything else happens, because a misfiled document is the one that later leaks through retrieval.',
          'Content Understanding: Handle the structure real documents have — tables, appendices, revision marks — where naive chunking splits a clause away from the condition that qualifies it.',
          'Document Summarization: Summaries that carry their citations, so a reader can jump from a sentence back to the paragraph it compressed rather than taking it on trust.',
          'Knowledge Extraction: Convert what is stranded in PDFs and scans into an indexed corpus. That is usually the difference between a use case that can be grounded and one that cannot.',
        ],
      },
      {
        title: 'AI Insights & Decision Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Natural-language access to your own numbers, where every answer names the query it ran and the table it ran against.',
        items: [
          'Conversational BI: Ask in English, get the figure and the SQL behind it. The query is the citation — without it the number cannot be verified by the person relying on it.',
          'Executive AI Reporting: Draft the commentary that usually costs an analyst a day, grounded in the same warehouse the dashboard reads, with exceptions surfaced rather than smoothed.',
          'Predictive Analytics with GenAI: Keep the forecast in the statistical model where it belongs and use generation to explain what moved, so the explanation cannot quietly become the prediction.',
          'AI-Driven Strategic Dashboards: Anomalies described in words beside the chart, with a link through to the rows that caused them.',
          'Decision Intelligence: Combine retrieved policy with live data so a recommendation arrives with the rule it followed, which is what makes it reviewable rather than merely persuasive.',
          'Natural-Language Analytics: Metric definitions held in one place, so "active customer" means the same thing whoever asks and however they phrase the question.',
        ],
      },
      {
        title: 'Content & Communication AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Generation at volume where the facts come from your product data and the claims come from an approved list — not from the model.',
        items: [
          'Automated Content Generation: Copy written from attribute data rather than invented, scored against a brand rubric before it publishes.',
          'Hyper-Personalized Content: Variation by segment while the underlying claim set stays fixed, so personalization changes the framing and never the facts.',
          'Enterprise Translation & Localization: Translation that holds your terminology and respects what each market allows, rather than carrying a claim that is legal in one country into one where it is not.',
          'AI Knowledge Publishing: Keep internal documentation current by drafting the update when the source system changes, with a person approving before it goes live.',
          'Content Transformation: Reshape what you already have into the formats each channel needs, which is cheaper and considerably safer than generating the same substance twice.',
          'Intelligent Communications: Draft customer correspondence with the account facts retrieved rather than recalled, and hold anything consequential for review.',
        ],
      },
      {
        title: 'Product & Experience AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Generative features inside your own product, built so latency, refusal behavior and cost per user are design decisions rather than things you discover in month one.',
        items: [
          'GenAI Feature Engineering: Ship each feature with its evaluation set, so the next person to change the prompt can tell whether they improved it or broke it.',
          'AI Copilots for SaaS: In-product assistance grounded in that customer\'s own tenant, where isolation is enforced by retrieval rather than promised by the prompt.',
          'AI-Enabled UX: Interfaces that show what the system used and make refusal legible, because a product that never says no teaches its users to stop checking.',
          'Conversational Interfaces: Natural language over your existing workflows, with the deterministic path kept available for users who already know exactly what they want.',
          'Intelligent Product Experiences: Personalization that degrades to a sensible default when signals are thin, instead of confidently getting it wrong for every new user.',
          'Industry-Specific AI Accelerators: Retrieval patterns, guardrail sets and evaluation suites already shaped to a sector, so the second deployment is configuration rather than a project.',
        ],
      },
      {
        title: 'GenAI Application Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The application around the model: prompts and context under version control, routing by cost, and integrations that fail visibly rather than silently.',
        items: [
          'GenAI Application Development: Applications built so the model can be swapped without a rewrite, because the one you launch on will be deprecated inside a year.',
          'Model & API Integration: One interface across vendors, with timeouts, retries and fallbacks defined up front — an inference API is a dependency that will be slow or down at some point.',
          'Prompt Engineering: Prompts held as versioned artifacts with an evaluation attached, so a change that lowers the score does not reach production.',
          'Context Engineering: Decide what goes into the window and what stays out. Retrieving twenty passages where four would do multiplies the token bill on every call and buries the useful one.',
          'AI Workflow Engineering: Reasoning wired to business rules and approval gates, so the system stops where a human is required rather than where it happens to lose confidence.',
          'Enterprise System Integration: Connections into CRM, ERP and ITSM under service accounts scoped to the task, so an integration cannot read more than its workflow needs.',
        ],
      },
      {
        title: 'AI Data & Knowledge Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The substrate retrieval runs on: chunking that respects how documents are actually written, embeddings kept current as content changes, and an index that knows who may read what.',
        items: [
          'Data & Pipeline Engineering: Pipelines that re-embed on change rather than on a schedule, because an index lagging its source produces confidently outdated answers.',
          'AI Data Preparation: Deduplication and cleanup before indexing. Three near-identical versions of a policy in the corpus is how a system ends up citing the superseded one.',
          'Knowledge Engineering: Structure the relationships your documents assume but never state, so retrieval can follow them instead of matching text alone.',
          'Vector Data Architecture: pgvector is usually the right first answer — embeddings next to the data that produced them, in a database you already operate. A dedicated store earns its place at scale.',
          'Data Grounding: Connect to the source of record rather than to a copy of it, so an answer reflects what is true now instead of what was true at the last export.',
          'Retrieval Infrastructure: Hybrid search with re-ranking, tuned against your own questions, because the defaults were tuned against somebody else\'s.',
        ],
      },
      {
        title: 'GenAI Quality, Evaluation & Reliability',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Quality measured rather than assumed — graded rubrics over a fixed question set, run on every prompt, index and model change instead of once before launch.',
        items: [
          'Quality Assurance & Testing: Test the system, not the model. Most production failures come from retrieval returning the wrong passage, not from the model writing a bad sentence.',
          'Model & System Evaluation: Rubrics that score grounding, citation, refusal and tone separately, because a single aggregate number hides which of them regressed.',
          'Benchmarking: Public benchmarks tell you what a model can do in general. Your own question set tells you what it does on your documents, which is the only figure that decides anything.',
          'Risk & Anomaly Detection: Watch the slow failures — refusal rates climbing, citations thinning, latency creeping — that no single request would ever reveal.',
          'Continuous Evaluation: Run the set on every change, on a schedule, and against a sample of live traffic. Systems degrade quietly when the corpus moves underneath them.',
          'Resilience & Reliability: Decide what the product does when the model is unavailable, because an inference provider will have an outage during your business hours.',
        ],
      },
      {
        title: 'Responsible AI & Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The record that lets someone reconstruct a decision months later: what was asked, what was retrieved, what came back, and who approved it.',
        items: [
          'Responsible AI Frameworks: Written standards tied to controls that actually run, rather than principles nobody can point at anywhere in the system.',
          'AI Governance: Named owners for each system, an approval path for model and prompt changes, and a register of what is live — the three things an auditor asks for first.',
          'Fairness & Transparency: Test outputs across the groups your process affects. Generation inherits the skew in the documents it retrieves, and nothing on screen reveals it.',
          'Explainable AI: For a retrieval system the explanation is the retrieved passage, which tells a reviewer far more than a confidence score does.',
          'Human-in-the-Loop Controls: Review placed where a wrong answer is expensive and removed where it is not, so approval stays meaningful rather than becoming a habit of clicking through.',
          'Accountability & Oversight: Prompt, context, response and approver retained per interaction, so a decision can be reconstructed rather than remembered.',
        ],
      },
      {
        title: 'AI Security, Trust & Compliance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The failure that matters is not an offensive answer but a confident one drawn from a document the asker should never have been able to see.',
        items: [
          'AI Security Architecture: Treat the model as untrusted input to everything downstream of it, because its output is shaped by documents and by whoever was able to write them.',
          'Threat & Prompt-Injection Defense: Retrieved documents are an attack surface. Instructions hidden inside a page the model reads are the injection route most teams forget to test.',
          'Identity & Access Management: Retrieval runs as the asking user, never as a service account with a view of everything, so access control lives in the index rather than in the prompt.',
          'Data Privacy & Protection: PII detected and redacted before retrieval, and prompt logs treated as sensitive — a system that logs full prompts has copied the sensitive part of every request somewhere else.',
          'Regulatory Compliance: Map controls to the regimes you are actually under, including data residency, which decides whether a managed API is available to you at all.',
          'Audit & Policy Enforcement: Policy enforced in the request path rather than documented beside it, so the evidence is produced as a by-product of running.',
        ],
      },
      {
        title: 'AI Lifecycle, MLOps & LLMOps',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Everything that keeps a working system working: versioned prompts and indexes, promotion gated on evaluation, and migration planned before a vendor deprecates the model you shipped on.',
        items: [
          'AI Lifecycle Management: A path from development into production and back out again, so systems are retired deliberately instead of left running unowned.',
          'Model & Prompt Versioning: Prompt, retrieval configuration, index version and model version pinned together — any one of them moving alone can change every answer.',
          'Deployment & Release Governance: Promotion gated on the evaluation set, with a rollback that restores the previous prompt and index together rather than only the code.',
          'MLOps / LLMOps: The same discipline as machine learning, plus what LLMs add: token cost, context limits, and a vendor deprecation schedule you do not control.',
          'Model & System Monitoring: Watch groundedness and refusal rate alongside latency and errors, because a system can be fast, healthy and wrong at the same time.',
          'AI Asset Registry: An inventory of every model, prompt, index and dataset in production with an owner against each, so nothing is discovered for the first time during an incident.',
          'Continuous Improvement: Feed the questions that failed back into the evaluation set, so each incident makes the next regression easier to catch.',
        ],
      },
      {
        title: 'AI Observability & Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Running it day to day — traces you can replay, budgets per workflow, and cost per resolved query as a number you can quote rather than reconstruct after the invoice.',
        items: [
          'Full-Stack AI Observability: Traces that keep the retrieved context with the response, because a bad answer cannot be diagnosed without knowing what the model was looking at.',
          'Operational Monitoring: Latency measured where the user waits, not at the API boundary — retrieval, re-ranking and guardrails all sit between the two.',
          'AI Cost & Token Optimization: Caching absorbs the repeated questions that dominate real traffic, and routing sends the easy majority to a smaller model.',
          'Incident Management: A defined path for a wrong answer, not only for an outage. The fix is usually a prompt or index change, which is why both have to be revertible.',
          'Capacity Management: Rate limits and quotas are the real constraint on a managed API; self-hosted serving trades that for GPUs you then have to keep busy.',
          'Performance Analytics: Track which workflows earn their inference spend, so the renewal conversation is about named use cases rather than about AI in general.',
          'SLA & Operational Reporting: Report the numbers that decide renewal — deflection, cost per resolved query, and the share of answers that carried a source.',
        ],
      }
    ],
  },

  'mlops': {
    slug: 'mlops',
    name: 'MLOps',
    // Hero shape mirrors /services/agentic-ai: a five-word badge, a seven-word
    // title with a hard line break, and the same size ramp and widths — so the
    // two flagship pages read as one system rather than two designs.
    //
    // The badge replaces the Cognition department default, "Reasoning.
    // Learning. Autonomous.", which is agentic-AI language and was the last
    // agentic string above the fold on this page.
    //
    // The title deliberately avoids "in production": the section heading below
    // already owns that phrase ("MLOps that keeps models right in production").
    // This one claims the scope instead, and the gradient lands on "Lifecycle",
    // which is the entity term buyers search on.
    heroBadge: 'Machine Learning Built to Operate',
    heroTitle: 'MLOps Services That\nRun the Full Model Lifecycle',
    heroTitleSize: 'text-[1.6rem] sm:text-[1.92rem] lg:text-[2.688rem] xl:text-[3.6rem]',
    heroMaxWidth: 'max-w-[78%]',
    // The Cognition default ends "…Knowledge Graphs, Autonomous Agents, AI
    // Governance" — three chips promising agents in the hero strip of an MLOps
    // page, and the last agentic strings left above the fold.
    heroStripItems: [
      'Pipeline Automation', 'Model Registry & Lineage', 'Feature Stores', 'Gated Promotion',
      'Canary & Shadow Release', 'Drift Detection', 'Automated Retraining', 'Model Governance',
    ],
    showBeams: true,
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    // Renders as the first paragraph of the "what is" section and carries
    // data-speakable, so it is the passage a voice assistant reads. Not the meta
    // description — seoData supplies that.
    shortDescription: 'Kangqore builds and runs the machine learning lifecycle as production infrastructure that is owned by your engineers instead of rented from us.',
    // Renders as the hero paragraph AND becomes Service.description in the
    // JSON-LD graph. The previous value was written for the graph alone and ran
    // to 35 words — six lines in the hero where agentic-ai sets two. This is 24,
    // matching agentic-ai's 25, and still carries the entities that matter:
    // pipelines, registry, lineage, promotion, drift, retraining. The terms it
    // drops (canary and shadow release, managed versus self-hosted) are covered
    // in the toolchain section and the FAQ, which the graph also indexes.
    fullDescription: 'Production-grade MLOps engineering — versioned pipelines, a model registry with full lineage, promotion gated on evaluation, and drift-triggered retraining, so models keep performing long after release.',
    fullDescriptionMaxWidth: 'max-w-[980px]',
    keyFeatures: ['Model versioning', 'Automated pipelines', 'Continuous training', 'Model monitoring', 'Feature stores'],
    relatedServiceSlugs: ['data-science-ai', 'devops-as-a-service', 'ai-governance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    // 60 characters over three lines, in Title Case, and the payoff clause
    // ("Keeps Them There") named a place rather than a property — read quickly
    // it suggests retention, not accuracy. 44 characters over two lines, in the
    // sentence case every other heading on this page uses. "Right" is the
    // differentiated claim: deploying is not the hard part, and the FAQ below
    // makes the same argument at length.
    whatIsTitle: 'MLOps that keeps models',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'right in production.',
    // Deliberately not an argument about why MLOps is hard — the comparison
    // section below already makes that case at length, and repeating it here
    // would weaken both. This states scope and the operating principle, which
    // is what the eyebrow above actually asks.
    whatIsPara2: 'The scope covers the entire path: data and features, training, registry, promotion, serving, monitoring, and retraining. We build it once as one cohesive system, rather than assembling it repeatedly for every model.',
    whatIsPara3: 'We work within your existing platform and deliver the final product as infrastructure as code. Managed operations are available afterward, but they are not required to keep your system running.',
    businessMetrics: [
      { title: 'Deployment Speed', desc: 'Increase in model deployment frequency after MLOps pipeline implementation and CI/CD automation.', value: '90',  suffix: '%',    metricLabel: 'Faster Deployments',    icon: 'Zap'       },
      { title: 'Infrastructure Cost',  desc: 'Reduction in operational and infrastructure costs through optimized compute and automated workflows.',  value: '50', suffix: '%',    metricLabel: 'Cost Savings', icon: 'TrendingUp'},
      { title: 'Production Incidents', desc: 'Reduction in model drift and production failures through proactive monitoring and automated alerts.', value: '95', suffix: '%',    metricLabel: 'Incident Reduction',      icon: 'Target'    },
      { title: 'Engineering Velocity',   desc: 'End-to-end acceleration of machine learning development and production release cycles.',      value: '3',  suffix: '×', metricLabel: 'Velocity Boost',     icon: 'Layers'    },
    ],
    capabilityAreas: [
      {
        title: 'AI Strategy & MLOps Advisory',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Establish enterprise AI operating models, implementation roadmaps, and organizational readiness that accelerate successful AI adoption and long-term business value.',
        items: [
          'AI & MLOps Readiness Assessment: Evaluate organizational maturity, engineering capabilities, operational readiness, and platform foundations for enterprise-scale AI adoption.',
          'AI Use Case Discovery: Identify, prioritize, and validate high-value AI initiatives aligned with strategic business objectives and measurable outcomes.',
          'Data Readiness Assessment: Assess data quality, accessibility, governance, and architectural readiness required for successful machine learning initiatives.',
          'MLOps Strategy & Roadmap: Develop enterprise MLOps operating models, implementation roadmaps, governance structures, and technology strategies.',
          'AI Platform Advisory: Recommend cloud, hybrid, infrastructure, tooling, and platform architectures that support scalable enterprise AI operations.',
          'AI Transformation Enablement: Drive organizational adoption through governance frameworks, stakeholder alignment, operating models, and capability development.',
        ],
      },
      {
        title: 'AI Engineering & Lifecycle Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Accelerate AI development through governed engineering practices that enable reliable, repeatable, and production-ready machine learning delivery.',
        items: [
          'Experiment Management: Capture datasets, parameters, metrics, artifacts, and experiments to ensure reproducibility, collaboration, and continuous innovation.',
          'Model Development & Validation: Design, train, evaluate, validate, and optimize machine learning models for enterprise-grade production environments.',
          'Model Registry & Lifecycle Management: Maintain centralized repositories for managing model versions, approvals, documentation, metadata, and deployment status.',
          'Continuous Integration & Delivery: Automate testing, validation, packaging, and deployment of machine learning models through enterprise CI/CD pipelines.',
          'Progressive Model Deployment: Deploy AI models safely using canary, blue-green, shadow, and phased rollout strategies that reduce operational risk.',
          'AI Lifecycle Automation: Automate promotion, deployment, monitoring, retraining, rollback, and retirement across the complete AI lifecycle.',
        ],
      },
      {
        title: 'Data & Feature Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Build trusted, governed, and scalable data foundations that power enterprise AI, machine learning, and intelligent automation.',
        items: [
          'Data Pipeline Engineering: Develop automated ingestion, transformation, orchestration, and processing pipelines that support enterprise AI workloads.',
          'Feature Store Management: Establish centralized feature repositories that improve feature reuse, governance, consistency, and real-time serving.',
          'Dataset Versioning & Lineage: Maintain complete dataset history, lineage, reproducibility, and traceability throughout model development and operations.',
          'Data Validation & Quality Engineering: Implement automated validation, profiling, cleansing, monitoring, and quality controls for trusted enterprise data.',
          'Metadata & Lineage Management: Capture metadata, dependencies, and lineage across datasets, pipelines, models, and AI assets.',
          'Enterprise Data Orchestration: Coordinate distributed data workflows across cloud, hybrid, and enterprise environments with operational reliability.',
        ],
      },
      {
        title: 'Production AI Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Operate enterprise AI systems with continuous monitoring, intelligent optimization, and resilient production infrastructure.',
        items: [
          'AI Observability: Gain end-to-end visibility into model behavior, inference quality, latency, resource utilization, and operational health.',
          'Performance Monitoring: Monitor prediction quality, throughput, availability, latency, and service-level objectives across production environments.',
          'Drift Detection & Continuous Learning: Detect data drift, concept drift, prediction anomalies, and model degradation while triggering governed retraining workflows.',
          'AI Performance Optimization: Continuously improve model accuracy, inference efficiency, infrastructure utilization, and operational cost.',
          'Production Reliability Engineering: Maintain resilient, fault-tolerant, and highly available AI systems through proactive operational management.',
          'Operational Intelligence & Reporting: Provide dashboards, SLA reporting, operational analytics, executive insights, and AI health metrics.',
        ],
      },
      {
        title: 'AI Platform Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design secure, cloud-native AI platforms that standardize enterprise AI development, deployment, orchestration, and operations.',
        items: [
          'AI Platform Architecture: Design scalable AI platforms that standardize enterprise machine learning engineering and operational practices.',
          'Containerisation & Orchestration: Deploy AI workloads using containers, Kubernetes, and enterprise orchestration frameworks.',
          'Hybrid & Multi-Cloud AI: Operate AI workloads consistently across public cloud, private cloud, hybrid, and on-premises environments.',
          'Infrastructure Automation: Automate provisioning, configuration, scaling, and lifecycle management using Infrastructure as Code.',
          'GPU & Accelerator Engineering: Optimize GPU, TPU, and specialized AI accelerator infrastructure for efficient training and inference workloads.',
          'Scalability & Resilience Engineering: Deliver highly available, fault-tolerant, and elastic AI platforms that support enterprise-scale operations.',
        ],
      },
      {
        title: 'AI Governance & Operational Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Ensure enterprise AI systems remain secure, explainable, compliant, and fully governed throughout their operational lifecycle.',
        items: [
          'Model Governance: Govern AI models across development, validation, deployment, monitoring, maintenance, and retirement.',
          'Responsible AI Controls: Embed explainability, fairness, transparency, accountability, and human oversight into operational AI systems.',
          'Audit & Traceability: Maintain comprehensive audit trails, deployment history, lineage, approvals, and governance evidence.',
          'Compliance & Policy Management: Align AI operations with regulatory requirements, enterprise governance policies, and industry standards.',
          'Security & Access Governance: Protect AI platforms through identity management, role-based access controls, encryption, and zero-trust security.',
          'AI Risk Management: Continuously identify, assess, and mitigate operational, cybersecurity, regulatory, and business risks across AI environments.',
        ],
      },
      {
        title: 'AI Performance, Cost & FinOps',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Maximize the business value of enterprise AI through continuous optimization of performance, infrastructure utilization, operational efficiency, and technology investment.',
        items: [
          'AI Cost Optimization: Optimize compute resources, inference workloads, storage, and token consumption to improve cost efficiency.',
          'AI Resource Management: Monitor and optimize GPU, CPU, memory, and accelerator utilization across enterprise AI workloads.',
          'Workload Optimization: Balance training and inference workloads to maximize throughput, reliability, and operational efficiency.',
          'Capacity Planning: Forecast infrastructure demand and plan scalable AI environments that support future business growth.',
          'AI FinOps & Cost Governance: Establish governance frameworks for budgeting, cost allocation, chargeback models, and AI investment optimization.',
          'Business Value Measurement: Measure AI adoption, operational impact, ROI, and business outcomes through enterprise performance metrics and executive reporting.',
        ],
      },
    ],

    // The Partnership Model block is six claims every consultancy asserts, in
    // text identical on all 61 pages that render it — it is a hardcoded
    // constant, not data. On a thin page it is the only engagement story
    // present and does real work. This page already tells that story with
    // evidence: "Five ways to start" carries durations and tiers, and the FAQ
    // answers who owns the platform afterwards with runbooks and a documented
    // promotion path. Keeping both leaves the weaker version to undercut the
    // stronger one, at 1,162px of desktop height for 93 words.
    hidePartnershipModel: true,

    // ── Engagement outcomes ────────────────────────────────────────────────
    // The Cognition fallback produced "99.9% Efficiency gain in MLOps workflows"
    // and "100% operational reliability" — neither of which is a coherent
    // quantity — over prose that fit any service in the practice.
    //
    // These remain illustrative, because they are not a named client. But an
    // illustrative scenario still has to describe a mechanism and a change a
    // reader can picture, and the metric has to be the arithmetic of the story
    // rather than a number chosen first: two models a quarter becoming twelve
    // is where the 6x comes from.
    outcomeCard: {
      illustrative: true,
      metric: '6×',
      metricLabel: 'More models promoted to production per quarter',
      industry: 'Banking & Financial Services',
      problem: 'A risk-modeling team could put two models a quarter into production. Each release meant hand-assembling the training data, re-running validation in a notebook, and writing the evidence pack for model risk review by hand — roughly six weeks of work that had to be repeated in full for every retrain.',
      outcome: 'One pipeline now produces the model, its lineage record and the validation evidence in the same run, and promotion is gated on a holdout threshold rather than a review meeting. The same team ships twelve models a quarter, and a retrain costs days instead of restarting the six weeks.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '70%',
      metricLabel: 'Fewer production incidents traced to model decay',
      industry: 'Manufacturing & Industry',
      problem: 'Demand forecasts degraded quietly between quarterly reviews. The first signal was usually a planner complaining about stock — weeks after the input distribution had already shifted — and nobody could say whether the model had drifted or the market had moved.',
      outcome: 'Input, prediction and performance drift are now tracked as three separate signals, with thresholds wired to a retraining trigger rather than to an alert nobody owns. Decay surfaces while it is still a distribution change rather than a stockout, and incidents attributed to stale models fell by 70% across two quarters.',
    },

    // ── Toolchain ──────────────────────────────────────────────────────────
    // The inherited Cognition default listed GPT-4o, Claude, Gemini, Pinecone,
    // Weaviate and LangSmith under the heading "MLOps Technology Stack". That is
    // a RAG stack: of sixteen tools named, two were MLOps.
    //
    // The tool names sit in `managed` and `selfHosted`, which render without
    // interaction. They were previously inside `desc`, which only appears on
    // hover — so the section showed six labels and nothing else, and the
    // subtitle referred to an "open-source column" that did not exist in a
    // single-column accordion. `desc` now carries the judgment rather than the
    // list: when to reach for each, and when not to.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'Five stages,',
      titleHighlight: 'two implementations.',
      subtitle: 'The stages are the same wherever your models run. What changes is who operates them — a managed cloud service, or open source on your own cluster. We work in whichever you have already committed to.',
      items: [
        {
          icon: 'Layers',
          title: 'Pipelines & orchestration',
          managed: 'SageMaker Pipelines · Vertex AI Pipelines · Azure ML Pipelines',
          selfHosted: 'Kubeflow Pipelines · Apache Airflow',
          desc: 'Managed pipelines are the shorter path when your training jobs already run on the platform. Airflow earns its place when the same scheduler has to coordinate ML work alongside the rest of your data engineering, rather than beside it.',
        },
        {
          icon: 'Database',
          title: 'Registry, tracking & lineage',
          managed: 'SageMaker Model Registry · Vertex AI Model Registry',
          selfHosted: 'MLflow · DVC for datasets',
          desc: 'This is the stage that makes an audit answerable: which data, which commit, which parameters produced the version now serving traffic. MLflow is the portable option when models will move between clouds; the managed registries keep promotion history beside the artifacts they approved.',
        },
        {
          icon: 'Network',
          title: 'Feature engineering & serving',
          managed: 'SageMaker Feature Store · Vertex AI Feature Store',
          selfHosted: 'Feast',
          desc: 'Introduced when feature reuse across models, or training-serving skew, is the actual constraint — not by default. A feature store is a system to operate, and a single team with features derived inside one pipeline does not yet have the problem it solves.',
        },
        {
          icon: 'Cpu',
          title: 'Model serving',
          managed: 'SageMaker endpoints · Vertex AI endpoints',
          selfHosted: 'KServe · BentoML · Triton Inference Server',
          desc: 'Canary and shadow deployment on all of them, so a new version is measured against the one it replaces before it takes traffic. Triton is the choice where GPU throughput rather than orchestration is the binding constraint.',
        },
        {
          icon: 'Eye',
          title: 'Monitoring & drift detection',
          managed: 'SageMaker Model Monitor',
          selfHosted: 'Evidently · WhyLabs · Prometheus and Grafana',
          desc: 'Wired alongside the service metrics rather than into a separate dashboard, because a team that has to open two tools to answer "is the model fine" will check one of them. Input, prediction and performance drift are tracked as three signals, not one.',
        },
        {
          icon: 'Shield',
          title: 'Infrastructure & governance',
          managed: 'Cloud-native IAM · KMS · audit logs',
          selfHosted: 'Terraform · SHAP · immutable approval logs',
          desc: 'Terraform describes the platform itself, so the environment is reproducible rather than hand-built and undocumented. SHAP where a model decision has to be defensible to someone outside the team, and approval records that cannot be edited after the fact in regulated estates.',
        },
      ],
      image: '/images/capabilities/mlops-toolchain.svg',
      imageAlt: 'Five MLOps stages — data, train, registry, serve, monitor — shown with the managed cloud service and the self-hosted open-source equivalent for each, and a drift-triggered retraining loop',
    },

    // ── Comparison frame ───────────────────────────────────────────────────
    // Without these the section inherits the agentic-AI framing: a lede about
    // "who decides the next step" and columns headed TRADITIONAL AI vs AGENTIC
    // AI, under a heading about MLOps.
    comparisonTable: {
      heading: 'Notebook to production, and the gap in between.',
      lede: 'Most teams can train a model. The difficulty is everything after: proving which data and code produced the version now serving traffic, noticing when it stops being right, and retraining without a person remembering to. An ad hoc path does each of those once, by hand. A platform does them every time, for every model.',
      dimensionLabel: 'STAGE',
      beforeLabel: 'AD HOC ML DELIVERY',
      afterLabel: 'GOVERNED MLOPS PLATFORM',
      afterBadge: 'REPRODUCIBLE',
      beforeShort: 'Ad hoc',
      afterShort: 'Platform',
      rows: [
        { dimension: 'Reproducibility', before: 'A model is a file on a laptop or in object storage. The notebook that produced it has moved on, and nobody can rebuild the exact version currently serving traffic.', after: 'Every model in a registry with the dataset version, code commit, parameters, and metrics that produced it — so any deployed version can be rebuilt or explained months later.' },
        { dimension: 'Promotion', before: 'A person decides the model looks good enough and copies it to production. The threshold lives in their head, and it moves with the deadline.', after: 'Promotion gates are statistical thresholds against a holdout set, evaluated automatically. A model that scores below the gate does not progress, and the record of why is kept.' },
        { dimension: 'Features', before: 'Features are engineered once for training and reimplemented in application code for inference. The two drift apart, and the model degrades for reasons no dashboard attributes correctly.', after: 'One definition serves both paths, with point-in-time correctness for training labels — so training-serving skew is designed out rather than debugged after it costs accuracy.' },
        { dimension: 'Monitoring', before: 'Monitoring watches latency and error rates. A model that returns a confident wrong answer in ten milliseconds passes every check.', after: 'Input, prediction, and performance drift are tracked separately, because they fail at different times. Thresholds trigger retraining, rollback, or a review with a named owner.' },
        { dimension: 'Retraining', before: 'Retraining happens when someone notices a complaint. The gap between decay and detection is measured in quarters.', after: 'Retraining runs on a schedule or a drift trigger, through the same gates as the original release — so the fix cannot bypass the checks the first version had to pass.' },
      ],
    },

    // ── Architecture ───────────────────────────────────────────────────────
    // The Cognition default renders an AI Governance stack — policy layers,
    // consent management, kill-switches. Those are real, but they are not how
    // an MLOps platform is structured, and none of it mentions training, a
    // registry, or retraining on a page whose own badge strip lists exactly
    // those.
    architectureNodes: [
      { 
        title: 'Data & Feature Layer', 
        icon: 'Database', 
        description: 'Training data assembled with point-in-time correctness, and features defined once for both training and inference so the two paths cannot diverge.', 
        features: ['Dataset Versioning', 'Feature Definitions', 'Point-in-Time Joins', 'Data Quality Checks'],
        bgImage: '/images/services/mlops_data_layer.png',
        bgColor: 'bg-[#ffffff]',
        textColor: 'text-black',
        descColor: 'text-black/80',
        blendMode: 'multiply',
        objectFit: 'contain'
      },
      { 
        title: 'Training & Experimentation', 
        icon: 'Cpu', 
        description: 'Repeatable training runs with parameters, metrics, and artifacts captured automatically — so a result can be reproduced rather than remembered.', 
        features: ['Experiment Tracking', 'Hyperparameter Tuning', 'Distributed Training', 'Artifact Management'],
        bgImage: '/images/services/mlops_training.png',
        bgColor: 'bg-[#0f151c]',
        textColor: 'text-white',
        descColor: 'text-white/80',
        blendMode: 'screen',
        objectFit: 'cover'
      },
      { 
        title: 'Registry & Promotion', 
        icon: 'Shield', 
        description: 'Every candidate model registered with its lineage, then promoted through evaluation gates that compare it against the version currently serving.', 
        features: ['Model Versioning', 'Model Lineage', 'Evaluation Gates', 'Security Scanning'],
        bgImage: '/images/insights/pulse-of-change.png',
        bgColor: 'bg-[#0b062b]',
        textColor: 'text-white',
        descColor: 'text-white/80',
        blendMode: 'screen',
        objectFit: 'cover'
      },
      { 
        title: 'Serving & Monitoring', 
        icon: 'Activity', 
        description: 'Canary and shadow deployment into production, with drift tracked on inputs, predictions, and outcomes — and a retraining trigger wired to the thresholds.', 
        features: ['Multi-Model Serving', 'Shadow Deployments', 'Drift Detection', 'Feedback Loops'],
        bgImage: '/images/insights/leadership-principles.png',
        bgColor: 'bg-[#ececec]',
        textColor: 'text-black',
        descColor: 'text-black/80',
        blendMode: 'multiply',
        objectFit: 'contain'
      },
    ],

    // One line per keyFeature, in the same order. Without these the cards
    // render the label alone — the shared fallback used to supply four fixed
    // strings that described none of them.
    featureMicros: [
      'Every model in the registry carries the dataset version, code commit and metrics that produced it, so a deployed version can be rebuilt months later.',
      'One path from training run to serving endpoint, with the same evaluation gates on the first release and every retrain after it.',
      'Retraining runs on a schedule or a drift trigger rather than on someone noticing a complaint two quarters late.',
      'Input, prediction and performance drift tracked separately, because they fail at different times and only one of them is authoritative.',
    ],

    industryHeading: 'Models in production,',
    industryHeadingHighlight: 'under your sector\u2019s rules.',

    // ── Industries ─────────────────────────────────────────────────────────
    // The inherited default listed eighteen "Agents" — Clinical Validation
    // Agent, Pricing Fairness Agent, Student Privacy Agent. MLOps does not ship
    // agents; it ships models, pipelines, and registries. The `items` key is the
    // neutral one; `agents` remains supported for the services where it is
    // accurate.
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Model risk management that survives an examination',
        items: [
          'Model inventory and lineage evidence aligned to SR 11-7 and the PRA model risk expectations',
          'Challenger models run in shadow against the champion, with the comparison recorded',
          'SHAP attributions retained per decision, so an adverse-action explanation can be reconstructed',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical validation and the evidence trail behind it',
        items: [
          'Locked model versions with the validation dataset and performance record attached',
          'Subgroup performance tracked separately, so degradation in one cohort is not hidden by the average',
          'PHI kept out of training telemetry, with lineage proving which data a model saw',
        ],
      },
      {
        industry: 'Manufacturing & Industry',
        headline: 'Predictive maintenance that keeps working after commissioning',
        items: [
          'Sensor drift separated from genuine equipment change before a retraining run is triggered',
          'Edge model rollout with staged deployment and rollback across sites',
          'Per-line retraining, because one line stopping does not mean the fleet model is wrong',
        ],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Demand and pricing models retrained against a moving market',
        items: [
          'Seasonal drift detection tuned so an expected peak is not scored as a failure',
            'Feature reuse across demand, pricing, and personalization models from one definition',
          'Fairness checks on pricing and eligibility outputs before promotion, not after complaint',
        ],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Multi-tenant model serving with cost visible per team',
        items: [
          'Namespace and RBAC isolation between tenants on shared training and serving infrastructure',
          'GPU utilization and inference cost attributed to the team and model that incurred it',
          'Autoscaling tuned for inference traffic, which spikes differently from web traffic',
        ],
      },
      {
        industry: 'EdTech & Higher Ed',
        headline: 'Assessment and recommendation models with fairness on the record',
        items: [
          'Cohort-level performance monitoring so a model does not degrade for one intake unnoticed',
          'Student data minimized in training sets with lineage evidence for audit',
          'Human review required for any model output affecting progression or assessment',
        ],
      },
    ],

    // ── Calls to action ────────────────────────────────────────────────────
    midCta: 'Your next model ships on rails.',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One model in production.',
      body: 'Talk through the model you most need in production in 30 minutes — we will scope the right entry point and show you what its path to production looks like in your environment.',
      proofLabel: 'From first call to first model in production',
    },

    // Answers carry paragraph breaks as a blank line (see faqParagraphs in
    // data/serviceFaqs.js). Each of these runs to four or five distinct points;
    // set as one block, the last two were buried. The sentences are unchanged —
    // only the packaging is.
    customFAQs: [
      {
        q: 'What is MLOps?',
        a: 'MLOps is the engineering discipline that keeps machine learning models working in production. It extends software delivery practice to the two things software does not have: a trained model whose behavior depends on data it saw during training, and live data whose distribution moves after release.\n\n'
          + 'In practice that means versioning models and the datasets behind them, automating the path from training run to serving endpoint, monitoring predictions rather than only uptime, and retraining on a schedule or a trigger.\n\n'
          + 'The test of an MLOps practice is not whether a model deploys. It is whether the model still performs six months later, and whether anyone can prove which data and code produced the version currently serving traffic.',
      },
      {
        q: 'How is MLOps different from DevOps?',
        a: 'DevOps ships code. MLOps ships code, data, and a trained artifact whose quality degrades on its own. Three differences drive everything else.\n\n'
          + 'The release unit is a triple — model weights, the feature pipeline, and the serving code. All three have to be versioned together, or a rollback restores the wrong combination.\n\n'
          + 'Testing cannot be binary. A model does not pass or fail, it scores, so promotion gates are statistical thresholds against a holdout set rather than a green build.\n\n'
          + 'And a deployed model decays without any change to the code, because the world it was trained on moves. Monitoring has to watch input distributions and prediction quality, not just latency and error rates.\n\n'
          + 'A DevOps pipeline that treats a model as a binary blob will deploy it reliably and never notice it has stopped being right.',
      },
      {
        q: 'What is the difference between MLOps and GenAIOps?',
        a: 'GenAIOps is the operational practice for systems built on foundation models. It inherits most of MLOps while changing what you control.\n\n'
          + 'In classic MLOps you own the training run, so quality is managed by retraining. With a foundation model you usually do not own the weights, so the levers move to prompts, retrieval, context assembly, guardrails, and model routing — and versioning has to cover prompt templates and retrieval indexes as first-class artifacts.\n\n'
          + 'Evaluation changes too. There is often no single correct output, so scoring shifts to graded rubrics, adversarial suites, and human review rather than accuracy against labels. Cost and latency become quality attributes, because inference is metered per token.\n\n'
          + 'The registry, lineage, staged promotion, and drift monitoring carry over unchanged. That is why teams with a working MLOps foundation reach production GenAI faster than teams starting from nothing.',
      },
      {
        q: 'When do we actually need a feature store?',
        a: 'A feature store earns its cost when the same feature is computed in more than one place, and the two places disagree.\n\n'
          + 'The specific failure it prevents is training-serving skew: a feature engineered in a batch job for training and reimplemented in application code for inference will diverge, and the model degrades for reasons no monitoring dashboard attributes correctly.\n\n'
          + 'You need one when features are reused across several models or teams, when point-in-time correctness matters for training labels, or when low-latency serving requires precomputed values. You do not need one for a handful of models owned by a single team with features derived inside one pipeline — there, a feature store adds a system to operate for a problem you do not yet have.\n\n'
          + 'The honest sequencing is a model registry and lineage first, a feature store when reuse or skew becomes the actual constraint.',
      },
      {
        q: 'How do you detect and handle model drift?',
        a: 'Drift is detected on three separate signals, because they fail at different times.\n\n'
          + 'Input drift compares the live feature distribution against the training baseline and fires first, often before any quality change is measurable. Prediction drift watches the distribution of the model output, which catches problems when ground truth is delayed. Performance drift compares predictions against labels once they arrive, which is authoritative but always late.\n\n'
          + 'Kangqore instruments all three and ties them to defined responses rather than alerts alone. A threshold breach can trigger a retraining run, route traffic to the previous model version, or open a review with the accountable owner, depending on what the model does and what a wrong answer costs.',
      },
      {
        q: 'How long does it take to get a model into production?',
        a: 'For a model that is already trained and validated, the constraint is rarely the deployment. It is the absence of a repeatable path.\n\n'
          + 'A first production deployment through a Pilot Pod typically runs eight weeks, and most of that is building the pipeline, registry, approval gates, and monitoring the model will travel through — not the deployment itself. Once that path exists, subsequent models move in days because they reuse it.\n\n'
          + 'The realistic answer for a team with no MLOps foundation is that the first model is a platform project and the second is a deployment.',
      },
      {
        q: 'What does the Kangqore MLOps stack actually use?',
        a: 'We build on the tooling your platform already commits to, rather than importing a fixed stack.\n\n'
          + 'On AWS that is typically SageMaker Pipelines with a model registry and SageMaker Model Monitor; on Azure, Azure ML with managed endpoints; on GCP, Vertex AI Pipelines and Model Registry.\n\n'
          + 'Where teams run their own, we use MLflow for tracking and registry, Kubeflow or Airflow for orchestration, Feast for feature serving, and KServe or BentoML for model serving on Kubernetes, with Terraform describing the infrastructure and Evidently or WhyLabs for drift monitoring.\n\n'
          + 'The choice is deliberate. An MLOps platform your engineers cannot operate after handover is a dependency, not a capability.',
      },
      {
        q: 'Who owns the platform after the engagement ends?',
        a: 'You do. Every engagement ships infrastructure as code, runbooks for the failure modes we have actually seen in your environment, and a documented promotion path your engineers execute themselves before we leave.\n\n'
          + 'Knowledge transfer is scheduled work with named participants, not a document handed over at the end.\n\n'
          + 'Managed Operations is available where you would rather we run it, but that is a choice you make after you can already run it yourself — not a condition of the platform working.',
      },
    ],

    // Replaces the generic five tiers, whose descriptions were built from
    // `${name.toLowerCase()}` and rendered "Comprehensive mlops assessment".
    servicePackages: [
      { name: 'MLOps Maturity Assessment', description: 'Audit your current path from training run to production: versioning, promotion gates, monitoring coverage, and retraining triggers. Ends with a prioritized platform roadmap.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'First Model to Production', description: 'Build the pipeline, model registry, approval gates, and drift monitoring around one real model — so the second model is a deployment rather than a project.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'ML Platform Build', description: 'Enterprise pipeline, registry, lineage, and serving infrastructure as code, with a feature store where reuse or training-serving skew justifies one.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Managed ML Operations', description: 'We run the platform: drift monitoring, retraining execution, incident response on model quality, and cost tuning across training and inference.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'GenAI Operations Extension', description: 'Extend the same registry, lineage, and evaluation discipline to foundation-model systems — prompt and retrieval versioning, graded evaluation suites, and model routing.', duration: 'Ongoing', tier: 'Enterprise' },
    ],
  },

  'ai-governance': {
    slug: 'ai-governance',
    name: 'AI Governance',
    heroTitle: 'AI Governance Services That\nScale Trust Across the Enterprise',
    heroMaxWidth: 'max-w-[80%]',
    heroTitleSize: 'text-[1.5rem] sm:text-[1.88rem] lg:text-[2.6rem] xl:text-[3.5rem]',
    heroBadge: 'Governed AI. Compliant AI. Trusted AI.',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™',
    shortDescription: 'Building Trust, Control, and Accountability into Enterprise AI Systems',
    fullDescription: 'Kangqore enables organizations to adopt, scale, and operationalize AI responsibly by embedding governance, transparency, and control across the entire AI lifecycle.',
    keyFeatures: ['Quality assurance', 'Ethical AI principles', 'Model governance', 'Compliance & risk management', 'Explainable AI'],
    relatedServiceSlugs: ['agentic-ai', 'mlops', 'data-science-ai'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    hideBadgeStrip: true,

    // ── Overrides for template defaults written for /services/agentic-ai ──
    // Without these four, an AI governance page rendered "Agents built for your
    // industry." as its industry H2, "One agent in production." as its closing
    // H2, and "Your next workflow runs itself." as its mid-page CTA. Fifty-four
    // agentic and autonomy words on a page about oversight and conformity, and
    // the two most prominent of them were headings.
    industryHeading: 'Governance shaped by',
    industryHeadingHighlight: 'your regulator.',
    midCta: 'Know which models are running, and who signed them off.',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One estate you can evidence.',
      body: 'Bring the AI you already have in production. In 30 minutes we will tell you which systems are in scope under the EU AI Act, what evidence you are missing, and what it takes to close the gap.',
    },

    // Same call as /services/genai-business-services and /services/mlops. This
    // page argues its engagement model with evidence in "Five ways to start"
    // and ten FAQs; the six generic consultancy claims below them measured 93
    // words in 1,162px and subtract rather than add.
    hidePartnershipModel: true,

    capabilitiesLabel: 'AI GOVERNANCE SERVICES',
    capabilitiesSectionTitle: 'AI Governance Framework',
    capabilitiesSectionHighlight: 'Capabilities.',
    // ── Capability areas ──────────────────────────────────────────────────
    // Rewritten 2026-08-13. The previous version carried roughly twenty times
    // the boilerplate density measured in the comparison table on the same
    // page, and four times the FAQ's, while the word "you" appeared zero times
    // in 1,239 words. At about a third of the page's copy that was its largest
    // quality gap, and the same defect /services/genai-business-services
    // carried before PR #333.
    //
    // Sub-capability NAMES are unchanged: they are the searchable taxonomy and
    // they feed the OfferCatalog JSON-LD. Only the prose after each colon is
    // new. The card front splits on ':' so that format is load-bearing.
    capabilityAreas: [
      {
        title: 'Managing AI & GenAI Solution Quality',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Quality measured on a schedule rather than assumed from the launch score, because a model degrades quietly while the dashboard keeps reporting green.',
        items: [
          'Data Quality Engineering: Validation and cleansing before anything is trained on or indexed. Three near-identical versions of a policy in the corpus is how a system ends up citing the superseded one.',
          'Model Validation & Quality Assurance: Test the system, not the model. Most production failures come from the data the model was handed rather than from the weights.',
          'AI Risk Detection: Catch hallucination, bias and unexpected behavior in staging, where a wrong answer costs a rerun instead of a complaint.',
          'Performance Monitoring & Drift Management: Watch the slow failures — accuracy sliding a point a month, one segment quietly diverging — that no single prediction would ever reveal.',
          'AI Evaluation & Benchmarking: Your own question set decides promotion. Public benchmarks tell you what a model can do in general, not what it does on your data.',
          'Reliability & Resilience Engineering: Decide what the system does when a model is unavailable or a score is missing, because both will happen during business hours.',
        ],
      },
      {
        title: 'Establishing Ethical AI Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Principles are cheap. What an assessor asks for is the control that enforces one, and the record showing it ran.',
        items: [
          'Responsible AI Frameworks: Written standards tied to controls that actually execute, rather than principles nobody can point at anywhere in the system.',
          'Fairness & Transparency: Test outcomes across the groups your process affects. A model inherits the skew in its training data, and nothing on screen reveals it.',
          'Explainable AI: SHAP values and feature attributions returned with the decision, so a reviewer sees what drove it rather than a confidence score.',
          'Accountability & Oversight: A named owner per system, an approval path for changes, and a register of what is live. Those three are what an auditor asks for first.',
          'Human Oversight: Review placed where a wrong decision is expensive and removed where it is not, so approval stays meaningful instead of becoming a habit of clicking through.',
          'Responsible GenAI & Agentic AI: Controls sized to what the system can actually do. A model that drafts text and one that can move money need different gates, and treating them alike fails in both directions.',
        ],
      },
      {
        title: 'Model Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Everything that keeps a model accountable after release: what changed, who approved it, and what you can roll back to.',
        items: [
          'Model Lifecycle Management: A path from development into production and back out again, so models are retired deliberately instead of left running unowned.',
          'Model Version Control: Weights, features, training data and configuration pinned together. Any one of them moving alone can change every decision the system makes.',
          'Deployment Governance: Promotion gated on a check that can fail. A gate that has never blocked a release is documentation, not a control.',
          'Performance Validation: Re-validate against the current population rather than the training sample, because that is where drift shows first.',
          'Change & Release Management: A rollback that restores the model and its feature pipeline together, not just the artifact.',
          'Model Registry & Documentation: A model card per system carrying intended use, known limits, owner and approval, so the answer to what this does is not a person who might leave.',
        ],
      },
      {
        title: 'Compliance & AI Risk Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Map controls to the regimes you are actually under, then produce the evidence as a by-product of running rather than as a project before each audit.',
        items: [
          'Regulatory Compliance: Risk tiering against the EU AI Act, controls mapped to the NIST AI RMF, and the sector rules that apply to you rather than all of them at once.',
          'Data Privacy & Protection: PII detected and redacted before training or retrieval, with retention limits enforced automatically instead of documented and hoped for.',
          'Audit & Policy Enforcement: Policy enforced in the request path and logged there, so the audit trail is generated by the system rather than assembled afterwards.',
          'AI Risk Management: Risk assessed per system and per use, because the same model is low risk in one workflow and high risk in the next.',
          'Security & Access Governance: Least privilege across models, data and tools, with access reviewed on a schedule rather than only at onboarding.',
          'Compliance Monitoring & Reporting: Continuous evidence rather than an annual scramble. The gap between assessments is where posture actually drifts.',
        ],
      },
      {
        title: 'AI Security & Trust',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Treat the model as untrusted input to everything downstream of it, because its output is shaped by data and by whoever was able to write that data.',
        items: [
          'AI Security Architecture: Defense in depth around the model, on the assumption that the model itself will eventually be made to say something it should not.',
          'Prompt & LLM Security: Injection through retrieved documents is the route most teams forget to test. Instructions hidden in a page the model reads are indistinguishable from your own.',
          'Identity & Access Management: Retrieval and tool calls run as the asking user, never as a service account with a view of everything.',
          'AI Threat Detection: Watch for the patterns that precede abuse — probing, unusual token volumes, repeated refusals — rather than waiting for the incident that confirms it.',
          'Secrets & Credential Management: Keys and tokens kept out of prompts and out of logs. A system that logs full prompts has copied its credentials somewhere else.',
          'Secure AI Infrastructure: Network isolation, encryption and hardened deployment pipelines, sized to where your data is allowed to go.',
        ],
      },
      {
        title: 'AI Observability & Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Running it day to day: traces you can replay, budgets per team, and a cost per decision you can quote rather than reconstruct after the invoice.',
        items: [
          'AI Observability: Traces that keep the input and the retrieved context alongside the output, because a bad decision cannot be diagnosed without knowing what the model saw.',
          'Operational Monitoring: Latency measured where the user waits, not at the model boundary — retrieval, policy checks and guardrails all sit between the two.',
          'Cost & Resource Optimization: Spend tracked per workflow, so the renewal conversation is about named use cases rather than one aggregate line.',
          'Incident & Failure Management: A defined path for a wrong decision, not only for an outage. The fix is usually a configuration change, which is why it has to be revertible.',
          'Capacity & Scalability Management: Rate limits and quotas are the real constraint on a managed API; self-hosted serving trades that for hardware you then have to keep busy.',
          'Operational Analytics & Reporting: Report the numbers that decide renewal, and name the exceptions rather than smoothing them into an average.',
        ],
      },
      {
        title: 'AI Governance Strategy & Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Decide who owns what before you buy anything. Programs stall on ownership and decision rights far more often than on tooling.',
        items: [
          'AI Governance Strategy: Sequence by risk and volume rather than by visibility. The system the board asked about is rarely the one that needs governing first.',
          'AI Governance Operating Model: Settle who approves a model change, who signs off a risk tier, and who is paged when a decision is wrong. Those three questions stall more programs than technology does.',
          'AI Governance Maturity Assessment: Find out where your models actually live and who is allowed to change them. Governance inherits every problem your platform estate already has.',
          'AI Policy & Standards Management: Write down what staff may build and with which data, naming the tools. A policy easier to follow than to ignore is the only kind that changes behavior.',
          'AI Portfolio Governance: Track which systems earn their risk. Some are worth the control burden and some should be switched off, and that decision needs a number attached to it.',
          'AI Adoption & Change Management: Train people on what the controls will block as well as what they enable. Governance that only ever says no gets routed around.',
        ],
      },
    ],
    whatIsEyebrow: 'What AI Governance services does Kangqore offer?',
    whatIsTitle: 'AI Governance',
    whatIsTitleLine2: 'That Builds Trust &',
    whatIsHighlight: 'Mitigates Risk.',
    whatIsPara2: 'Kangqore implements continuous model monitoring, bias detection, explainability layers, and EU AI Act compliance frameworks — ensuring your enterprise AI models and autonomous agents scale safely with absolute control.',
    bannerBrandDesc: 'Our enterprise AI governance & compliance framework',
    downloadAsset: '/assets/downloads/kangqore-ai-governance-playbook.pdf',
    downloadAssetTitle: 'Download the Playbook',
    comparisonTable: {
      colA: 'Ungoverned AI',
      colB: 'Governed & Compliant AI',
      heading: 'Ungoverned AI vs. Governed & Compliant AI',
      // Every label below used to fall through to the template default, which is
      // written for /services/agentic-ai. The result was a heading reading
      // "Ungoverned AI vs. Governed & Compliant AI" above columns headed
      // TRADITIONAL AI / RULES-BASED AUTOMATION and AGENTIC AI, with a lede
      // arguing that an agentic system "chooses the action itself". Governance
      // was the subject of the heading and of every row, and of nothing in
      // between.
      lede: 'Most AI reaches production without anyone able to say which models are running, who signed them off, or what happens when one is wrong. Governance is the difference between an estate you can evidence to a regulator and one you discover during an incident.',
      beforeLabel: 'UNGOVERNED AI',
      afterLabel: 'GOVERNED & COMPLIANT AI',
      afterBadge: 'AUDITABLE',
      beforeShort: 'Ungoverned',
      afterShort: 'Governed',
      // Dimensions were Autonomy / Workflow / Learning / Integration / Outcomes,
      // the agentic skeleton this table was cloned from. The row content was
      // already governance-specific; only the axis names were wrong. These five
      // are the axes an assessor actually works through.
      rows: [
        { dimension: 'Oversight',    before: 'Unmonitored model outputs, with real risk of hallucination, bias and unauthorized actions.', after: 'Pre-action approval gates, behavior limits and kill-switches, with a human in the loop where the decision warrants one.', link: { href: '/services/it-security-services', label: 'AI security architecture' } },
        { dimension: 'Auditability', before: 'Ad-hoc scripts and unverified logic that break on edge cases and leave no audit trail.', after: 'Immutable, continuous audit logging and automated policy enforcement, so evidence is a by-product of running rather than a project.', link: { href: '/services/quality-engineering-assurance', label: 'Testing and assurance' } },
        { dimension: 'Drift & bias', before: 'Silent model and data drift, where unmonitored decay degrades decision quality over months.', after: 'Scheduled drift and fairness testing with automated alerts that trigger human review before impact reaches a customer.' },
        { dimension: 'Model inventory', before: 'Fragmented shadow AI, with unmapped models creating security and legal exposure nobody owns.', after: 'A central model registry carrying risk classification, named owners, RBAC and model cards for every system in production.', link: { href: '/services/mlops', label: 'Model registry and lifecycle' } },
        { dimension: 'Regulatory exposure', before: 'Compliance, reputational and legal risk, with no way to demonstrate conformity when asked.', after: 'Risk tiering mapped to the EU AI Act, controls mapped to the NIST AI RMF, and the documentation an assessor asks for held ready.' },
      ],
    },
    architectureNodes: [
      {
        title: 'Policy & Ethics Layer',
        icon: 'ShieldCheck',
        description: 'Define enterprise AI principles, ethical guardrails, and automated risk classification across all models.',
        features: ['Risk Tiering', 'Ethical Guardrails', 'Usage Policies', 'EU AI Act Alignment'],
      },
      {
        title: 'Model & Agent Control',
        icon: 'BrainCircuit',
        description: 'Centralized model registries, automated release gates, behavioral boundaries, and lifecycle documentation.',
        features: ['Model Registries', 'Release Gates', 'Behavior Limits', 'Version Control'],
      },
      {
        title: 'Data & Privacy Core',
        icon: 'Lock',
        description: 'Strict oversight over training data, prompt engineering, data masking, and context store lineage.',
        features: ['Data Masking', 'Consent Management', 'Lineage Tracking', 'PII Protection'],
      },
      {
        title: 'Execution Oversight',
        icon: 'Activity',
        description: 'Real-time human-in-the-loop checkpoints, anomaly detection alerts, and emergency kill-switches.',
        features: ['HITL Workflows', 'Immutable Audit Logs', 'Anomaly Alerts', 'Emergency Kill-Switches'],
      },
    ],
    industryUseCases: [
      // Was a list of eighteen entries each named "X agent" — a model risk
      // auditor agent, a HIPAA privacy agent, a pricing fairness agent. That is
      // the agentic product catalog this section was cloned from, and it sat
      // directly under a heading about regulators. A governance engagement does
      // not sell agents; it produces evidence. These are the artifacts each
      // sector's assessor actually asks to see. The neutral `items` key
      // replaces `agents`, which the template still reads for the four services
      // where the section is genuinely agent-specific.
      {
        industry: 'Banking & Financial Services',
        headline: 'Model risk documentation an examiner will accept',
        items: [
          'Model risk documentation written to FCA and PRA model risk management expectations, held per model version',
          'Adverse-action reasons traceable to the features that produced them, not reconstructed after a complaint',
          'Validation evidence, challenger results and sign-off retained against every credit model in production',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical validation that survives an inspection',
        items: [
          'Validation packs carrying an intended-use statement, performance by subgroup, and the limits of the claim',
          'PHI minimized before training, with lineage evidence showing what the model was ever exposed to',
          'Consent and purpose limitation enforced at record level rather than asserted in a policy document',
        ],
      },
      {
        industry: 'Manufacturing & Industry',
        headline: 'Safety cases for models that move physical things',
        items: [
          'A written safety case wherever a model influences process control, with the failure modes enumerated',
          'Model performance evidenced per line and per shift, because an aggregate number hides the line that drifted',
          'Change control tying a model version to the batch records produced while it was live',
        ],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Pricing and personalization you can defend',
        items: [
          'Disparate-impact testing on pricing and offer models before release, repeated on every retrain',
          'Fairness metrics tracked across protected characteristics, with thresholds that block promotion',
          'Consumer data purpose limits enforced in the feature store, so a dataset cannot silently change use',
        ],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Shadow AI you can actually see',
        items: [
          'Copilot and assistant usage policy enforced at the gateway rather than published as guidance',
          'Tenant isolation evidenced in retrieval and in logs, not assumed from the deployment topology',
          'A live inventory of models, prompts and AI-touching APIs, each with a named owner and a risk tier',
        ],
      },
      {
        industry: 'EdTech & Higher Ed',
        headline: 'Fairness evidence before anything affects a grade',
        items: [
          'Student data minimized before any model sees it, with retention limits enforced automatically',
          'Grading and recommendation models tested for fairness across cohorts on a published schedule',
          'Human review required on any output affecting progression, assessment or funding',
        ],
      },
    ],
    // The inherited lede opened "Most clients begin with a scoped pilot to prove
    // the model on one workflow" — the genai framing, where the unknown is
    // whether a model can be grounded. A governance buyer's unknown is which
    // systems are in scope and what evidence is missing, so the lede now says
    // that instead.
    engagementLede: 'Five entry points, from a three-week audit to continuous assurance. Most programs start by finding out which systems are in scope and what evidence is missing, because building controls before you know your risk tiers is the most common way governance work stalls.',
    servicePackages: [
      {
        name: 'Strategy & Audit',
        description: 'Inventory every AI system in production, classify each against EU AI Act risk tiers, and identify where evidence is missing rather than where controls are absent.',
        duration: '2–3 weeks',
        tier: 'Advisory',
        deliverables: ['Model and system inventory with named owners', 'Risk tier classification per system', 'Gap analysis against the EU AI Act and NIST AI RMF'],
      },
      {
        name: 'Guardrail Pod',
        description: 'One high-risk production model taken to an auditable state: registry entry, explainability layer, bias monitoring and an approval path that holds.',
        duration: '8 weeks',
        tier: 'Pilot',
        deliverables: ['Model registry entry with lineage and version pinning', 'SHAP explainability wired into the serving path', 'Bias and drift monitors with alert thresholds you set'],
      },
      {
        name: 'Platform Governance',
        description: 'The controls as infrastructure: a shared registry, compliance gates in CI/CD, data masking pipelines and policy enforced in the request path rather than in a document.',
        duration: '16–24 weeks',
        tier: 'Platform',
        deliverables: ['Registry and policy engine as infrastructure as code', 'Release gates that block promotion on a failed check', 'Masking and lineage pipelines across training and prompt data'],
      },
      {
        name: 'Managed Compliance',
        description: 'We run it: drift and fairness testing on schedule, human-in-the-loop queues staffed, audit logs maintained, and the evidence pack kept current between assessments.',
        duration: 'Ongoing',
        tier: 'Managed',
        deliverables: ['Monthly drift, bias and incident report', 'Maintained audit log and evidence pack', 'Change log tying every model version to its approval'],
      },
      {
        name: 'Continuous Assurance',
        description: 'Periodic re-assessment as the regulation moves and your estate grows, with control coverage re-tested rather than assumed to have held.',
        duration: 'Ongoing',
        tier: 'Enterprise',
        deliverables: ['Re-assessment against the current text of each regime', 'Control coverage re-tested per system', 'Board-level risk summary with the exceptions named'],
      },
    ],
    outcomeCard: { illustrative: true,
      metric: '100%',
      metricLabel: 'EU AI Act audit readiness achieved',
      industry: 'Global Financial Institution',
      problem: 'Uncoordinated AI deployment across 40+ trading and risk departments created severe compliance vulnerability under emerging EU AI Act guidelines and model risk management mandates.',
      outcome: 'Kangqore deployed a centralized model governance platform with automated risk tiering, model lineage tracking, and SHAP explainability — achieving 100% audit readiness across all production models with zero deployment slowdown.',
    },
    outcomeCard2: { illustrative: true,
      metric: '95%',
      metricLabel: 'Critical model incident risk reduction',
      industry: 'Healthcare & Clinical Research Network',
      problem: 'Diagnostic AI models and patient triage algorithms lacked real-time drift detection and human oversight gates, risking diagnostic error propagation across hospital systems.',
      outcome: 'Kangqore embedded human-in-the-loop approval workflows, real-time data drift alerts, and automated bias checks — reducing critical model incidents by 95% across 12 clinical nodes.',
    },
    outcomeCard3: { illustrative: true,
      metric: '0%',
      metricLabel: 'Unauthorized autonomous agent actions',
      industry: 'Enterprise Cloud & Defense Technology',
      problem: 'Shadow AI usage and unmonitored copilot agents exposed sensitive enterprise intellectual property and confidential customer PII to external LLM endpoints.',
      outcome: 'Kangqore implemented Zero-Trust AI security, automated prompt sanitization, and cryptographic audit ledgers — guaranteeing zero unauthorized agent actions and 100% IP isolation.',
    },
    businessMetrics: [
      { title: 'Audit Readiness',       desc: 'EU AI Act and regulatory audit readiness achieved across all production AI models through centralized governance and risk tiering.',            value: '100', suffix: '%',    metricLabel: 'Audit Readiness',         icon: 'ShieldCheck'  },
      { title: 'Incident Reduction',    desc: 'Reduction in critical model incidents through real-time drift detection, bias monitoring, and human-in-the-loop approval workflows.',       value: '95',  suffix: '%',    metricLabel: 'Incident Risk Reduced',   icon: 'Activity'     },
      { title: 'Compliance Coverage',   desc: 'Enterprise AI models covered by automated governance controls, explainability layers, and compliance validation frameworks.',                value: '100', suffix: '%',    metricLabel: 'Model Coverage',          icon: 'Target'       },
      { title: 'Security Breaches',     desc: 'Unauthorized AI actions and data leakage events prevented through Zero-Trust architecture and cryptographic audit controls.',                value: '0',   suffix: '',     metricLabel: 'Security Breaches',       icon: 'Lock'         },
    ],
    customFAQs: [
      { q: 'What does AI governance actually mean in practice?', a: 'In practice it means every model, agent and AI application in your estate has four things: a named owner, a risk tier, a documented approval, and a trail showing what it did. If any one of those is missing for a system, that system is ungoverned regardless of what the policy says.\n\n'
          + 'The distinction that matters is where the controls live. A policy document describes what should happen. Governance infrastructure makes it happen in the request path: a model that has not been approved cannot be promoted, a decision that needed human review does not proceed without it, and the evidence is written as the system runs rather than assembled before an audit.\n\n'
          + 'The test is simple. Ask who owns your highest-impact model and when it was last validated. If that takes more than a few minutes to answer, what you have is documentation rather than governance.' },
      { q: 'Why does our organization need AI governance now?', a: 'Three things converged. The EU AI Act became binding law with obligations attached to risk tier rather than to intent, so a system you did not think of as high-risk can be. Shadow AI spread faster than any inventory, in assistants and scripts built by teams who were not asking permission. And generative systems began making decisions that reach a customer directly rather than producing analysis a human reviews first.\n\n'
          + 'The cost asymmetry is what makes timing matter. Governing a system while it is being built adds weeks. Retrofitting governance onto twenty systems already in production, with no inventory and no lineage, is measured in quarters, and it is usually triggered by an external deadline rather than chosen.\n\n'
          + 'The answer is not to govern everything at once. Establish which systems are actually in scope, then start where a wrong decision reaches a customer.' },
      { q: 'How is Kangqore\'s AI governance different from buying a GRC tool?', a: 'A GRC platform records that a control exists. What we build makes the control run. Those are different jobs, and most estates need both. The failure mode is buying the first and assuming it did the second.\n\n'
          + 'Concretely: a registry that refuses to promote an unapproved model, CI gates that fail a deployment whose evaluation regressed, explainability wired into the serving path rather than produced in a notebook afterwards, and an audit trail the system writes as it runs.\n\n'
          + 'A GRC platform earns its license when governance has to be reported to a board or an external assessor in a format they already accept. That requirement is real. It is a documentation problem rather than an enforcement one, and neither substitutes for the other.' },
      { q: 'Which AI regulations apply to us, and which do we start with?', a: 'The two that decide most enterprise programs are the EU AI Act and the NIST AI Risk Management Framework. The Act is binding law and classifies each system by risk tier, with prohibited practices, high-risk obligations, transparency duties and conformity assessment attached to the tier. The NIST framework is voluntary and organizes controls under Govern, Map, Measure and Manage, which is why it is the practical scaffold even where the Act does not apply.\n\n'
          + 'Around those sit ISO/IEC 42001 for an auditable AI management system, GDPR Article 22 for automated decisions affecting individuals, and the sector rules: FCA and PRA model risk management in financial services, FDA AI/ML guidance in healthcare, HIPAA for clinical data, SOX for model auditability. In the United States the Colorado AI Act and the FTC position on unfair or deceptive AI practices are the ones changing fastest.\n\n'
          + 'We start from your risk tier rather than the framework. A system that is limited-risk under the Act does not need the documentation a high-risk one does, and building it anyway is the most common way governance programs stall.',
        sources: [
          { label: 'EU AI Act (Regulation 2024/1689)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { label: 'European Commission AI regulatory framework', url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai' },
          { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
          { label: 'NIST AI RMF 1.0 (full text)', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf' },
        ] },
      { q: 'How do you handle model risk management (MRM)?', a: 'Every model in the registry carries a risk tier, set from business impact, data sensitivity, regulatory exposure and how much autonomy the system has. The tier drives the controls, not the model type and not the team that built it.\n\n'
          + 'Critical and high tiers require approval before promotion, validation against the current population rather than the training sample, and periodic re-assessment with the evidence retained. Lower tiers get monitoring and a named owner, and that is deliberate, because controls cost something to run.\n\n'
          + 'The common failure is tiering everything high. It looks prudent, it doubles the review burden, and within two quarters approval becomes a formality because nobody has time to read what they are signing. Tiering is a resource decision as much as a risk one.' },
      { q: 'Can you govern generative AI and autonomous agents specifically?', a: 'Yes, and it is where the gap between policy and enforcement shows most. A classifier produces a score you can threshold. A generative system produces open-ended output and an agent can take actions, so the controls sit around it rather than inside it.\n\n'
          + 'On the way in, prompt sanitization and injection defense, because instructions hidden inside a retrieved document are indistinguishable from your own. On the way out, hallucination and policy checks before anything is displayed. Around the whole thing, permissions that run as the asking user rather than a service account, limits on which actions are reachable at all, kill-switches, and a prompt-to-response trail per interaction.\n\n'
          + 'The part most often missed is the action surface. Teams govern what the model says and leave what it can do, which API it may call and whether that call is reversible, to whatever the integration happened to allow.' },
      { q: 'What does explainable AI look like in production?', a: 'In production it is an explanation attached to the decision, retained with it, and reproducible months later. An explanation you can only regenerate by rerunning a notebook is not available at the moment somebody challenges the outcome.\n\n'
          + 'For tabular models that means SHAP feature attributions and a confidence score, plus a counterfactual stating what would have had to differ for another result, because that is the form a complaint actually takes. For retrieval-based systems the explanation is the passage the answer was drawn from, which tells a reviewer more than any score.\n\n'
          + 'Explanations have an audience, and the mistake is building only one. A data scientist debugging a model, a case handler answering a customer, and an assessor reconstructing a decision need different artifacts drawn from the same underlying record.' },
      { q: 'How do you detect and prevent model drift and bias?', a: 'Monitoring tracks prediction distributions, input feature drift, data quality and outcome rates across the groups your process affects. Thresholds are set with you rather than defaulted, because what counts as a material shift differs between a fraud model and a demand forecast.\n\n'
          + 'When a threshold is crossed the alert routes to a person with the authority to act, not to a dashboard nobody owns. Fairness testing runs on every retrain and the result is retained, so the question of whether a model was fair at the time it made a particular decision has an answer.\n\n'
          + 'The genuinely hard part is that bias has to be defined before it can be measured, and the common definitions are mathematically incompatible: outside trivial cases you cannot equalize error rates across groups and achieve predictive parity at the same time. Choosing which definition applies is a business and legal decision, and it belongs on the record rather than in a library default.' },
      { q: 'What does a typical AI governance engagement look like?', a: 'It starts with an audit, because you cannot govern an estate nobody has inventoried. Two to three weeks produces a list of every AI system in production, a risk tier for each, and the gap between what exists and what the applicable regime expects to see.\n\n'
          + 'From there it is usually one high-risk system taken to an auditable state over about eight weeks: registry entry, explainability in the serving path, drift and fairness monitors, and an approval path that can actually block a release. The same pattern then runs as platform work across the rest of the estate, typically over four to six months.\n\n'
          + 'What we do not do is write the policy first. A policy drafted before the inventory describes an estate you do not have, and it is the most reliable way to spend a quarter and change nothing.' },
      { q: 'How do you handle data privacy within AI governance?', a: 'PII is detected and redacted before data reaches training or retrieval, lineage records where every dataset came from and what it may be used for, and retention limits are enforced rather than documented and hoped for.\n\n'
          + 'The exposure teams underestimate is their own logging. A system that writes full prompts and responses to a log has copied the sensitive part of every request into a second place, usually under weaker access controls than the source it came from and with a longer retention period than anyone deliberately chose.\n\n'
          + 'Data residency is the constraint that decides architecture rather than configuration. Where data may not leave a jurisdiction, that rules out some managed inference entirely, and it is far better established in week one than discovered during a security review in week ten.' },
    ],
    customJourney: [
      { phase: 'ASSESS',     icon: 'Search',     title: 'Governance Assessment',   desc: 'Inventory all AI assets, classify risk tiers (EU AI Act), map compliance gaps, and establish governance baseline across the enterprise AI landscape.' },
      { phase: 'FRAMEWORK',  icon: 'Target',     title: 'Framework Design',        desc: 'Design enterprise AI governance framework — model registries, approval workflows, explainability standards, compliance gates, and organizational accountability structures.', kangqore: true },
      { phase: 'IMPLEMENT',  icon: 'Cpu',        title: 'Guardrail Implementation', desc: 'Deploy centralized model registries, SHAP explainability layers, bias monitoring, automated CI/CD compliance gates, and data masking pipelines across production AI.', kangqore: true },
      { phase: 'ENFORCE',    icon: 'Shield',     title: 'Compliance Enforcement',  desc: 'Activate human-in-the-loop approval workflows, real-time drift detection alerts, immutable audit trails, and continuous regulatory compliance validation.', kangqore: true },
      { phase: 'MATURE',     icon: 'TrendingUp', title: 'Continuous Assurance',     desc: 'Enterprise-wide risk assurance, periodic regulatory re-assessments, governance maturity advancement, and continuous model governance tuning across the AI estate.', kangqore: true },
    ],
    featureMicros: [
      'Governance is load-bearing — not a policy PDF.',
      'Every model registered, risk-tiered, and audit-ready.',
      'Explainability ships with every production deployment.',
      'Zero unauthorized agent actions. Zero data leakage.',
    ],
    heroStripItems: [
      'AI Solution Quality Management',
      'Ethical AI Governance',
      'Model Governance & Lifecycle',
      'Compliance & AI Risk Management',
      'AI Security & Trust',
      'AI Observability & Operations',
      'AI Governance Strategy',
    ],
    trustSignals: [
      'EU AI Act, GDPR, HIPAA, SOX & NIST AI RMF compliance frameworks implemented',
      'Zero-Trust AI security with cryptographic audit ledgers and kill-switches',
      'SHAP explainability, bias detection & drift monitoring on every production model',
      'Audit-readiness evidence generated continuously, without slowing deployment',
    ],
    conciergeChips: [
      'How do we get EU AI Act audit-ready?',
      'What does AI governance infrastructure actually look like?',
      'How do you govern generative AI and autonomous agents?',
      'Can you implement model risk management for our industry?',
      'Book an AI Governance strategy session',
    ],
    toolsStack: {
      // Was four rows, twelve tool names and 83 words in 781px, with no
      // indication of when you would pick any of them. The equivalent section on
      // /services/genai-business-services carries six layers, 37 named products
      // and a decision rule per row; this one is now built to the same standard.
      // Governance splits on buy-versus-build rather than managed-versus-self-
      // hosted, because a GRC platform and an open-source stack are the two real
      // options and the choice turns on whether your controls have to be evidenced
      // to somebody else.
      eyebrow: 'THE TOOLCHAIN',
      title: 'Every control.',
      titleHighlight: 'Evidenced, not asserted.',
      subtitle: 'Governance tooling is bought or built, and the answer differs per layer. What decides it is who has to be convinced: an internal risk committee will accept your own dashboards, an external assessor generally wants an audited platform trail. These are the five layers we standardize and the threshold at each one.',
      items: [
        {
          icon: 'Database',
          title: 'Model registry & inventory',
          managed: 'Azure ML registry · Vertex AI Model Registry · Databricks Unity Catalog',
          selfHosted: 'MLflow · DVC · custom Postgres registry',
          link: { href: '/services/mlops', label: 'How we run the model lifecycle' },
          desc: 'MLflow is usually the right first answer: it already holds your lineage and it costs nothing to make authoritative. A managed registry earns its place when the inventory has to span teams that do not share a platform, or when the audit trail itself must be immutable to the people maintaining it.',
        },
        {
          icon: 'Eye',
          title: 'Explainability & fairness',
          managed: 'Azure Responsible AI dashboard · Vertex Explainable AI · Fiddler',
          selfHosted: 'SHAP · LIME · Alibi · Fairlearn · Aequitas',
          link: { href: '/services/data-science-ai', label: 'Model development and validation' },
          desc: 'SHAP for tabular and Fairlearn for group metrics cover most of what an assessor asks to see. Buy instead when explanations must be produced on demand for a regulator rather than in a notebook, which is the point at which reproducibility matters more than the method.',
        },
        {
          icon: 'Shield',
          title: 'Privacy & data controls',
          managed: 'Microsoft Purview · BigQuery DLP · Immuta',
          selfHosted: 'Presidio · OpenDP · Opacus · custom masking pipelines',
          link: { href: '/services/it-security-services', label: 'Data protection and access control' },
          desc: 'Presidio handles PII detection and redaction well enough that most estates start there. A managed catalog earns its cost once purpose limitation has to be enforced across systems you do not own, because that is a policy problem before it is a detection problem.',
        },
        {
          icon: 'Network',
          title: 'Monitoring & drift',
          managed: 'Arize · WhyLabs · Azure Monitor for ML',
          selfHosted: 'Evidently · NannyML · Prometheus & Grafana',
          link: { href: '/services/managed-services', label: 'Who watches it in production' },
          desc: 'Evidently is enough while one team watches a handful of models. You move to a managed platform when drift has to be reviewed by people who did not build the model, since that is when a shared alert history stops being optional.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Policy & audit trail',
          managed: 'ServiceNow AI governance · IBM watsonx.governance · Credo AI · OneTrust',
          selfHosted: 'Open Policy Agent · custom approval workflows · append-only ledgers',
          link: { href: '/services/finance-risk-management', label: 'Enterprise risk and controls' },
          desc: 'Open Policy Agent puts enforcement in the request path, which is the only place policy is real. A GRC platform earns its license when governance has to be reported to a board or an assessor in a format they already accept, and that is a documentation requirement rather than a technical one.',
        },
      ],
    },
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
    whatIsPara2: 'Kangqore builds enterprise RPA programs from process assessment through Center of Excellence establishment — deploying screen automation and cognitive bots that execute high-volume, rules-based workflows with accuracy targets agreed per process.',
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
    shortDescription: 'Audit and optimize creative operations with GenAI to cut production cost and cycle time.',
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
