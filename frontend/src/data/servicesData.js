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
    showBeams: true,
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
      { title: 'Data & Feature Layer', icon: 'Database', description: 'Training data assembled with point-in-time correctness, and features defined once for both training and inference so the two paths cannot diverge.', features: ['Dataset Versioning', 'Feature Definitions', 'Point-in-Time Joins', 'Data Quality Checks'] },
      { title: 'Training & Experimentation', icon: 'Cpu', description: 'Repeatable training runs with parameters, metrics, and artifacts captured automatically — so a result can be reproduced rather than remembered.', features: ['Experiment Tracking', 'Hyperparameter Search', 'Distributed Training', 'Reproducible Runs'] },
      { title: 'Registry & Promotion', icon: 'Shield', description: 'Every candidate model registered with its lineage, then promoted through evaluation gates that compare it against the version currently serving.', features: ['Model Registry', 'Evaluation Gates', 'Approval Records', 'Staged Rollout'] },
      { title: 'Serving & Monitoring', icon: 'Activity', description: 'Canary and shadow deployment into production, with drift tracked on inputs, predictions, and outcomes — and a retraining trigger wired to the thresholds.', features: ['Canary & Shadow Deploys', 'Drift Detection', 'Automated Rollback', 'Retraining Triggers'] },
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
    capabilitiesLabel: 'AI GOVERNANCE SERVICES',
    capabilitiesSectionTitle: 'AI Governance Framework',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilityAreas: [
      {
        title: 'Managing AI & GenAI Solution Quality',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Ensure AI and Generative AI systems operate with consistent accuracy, reliability, safety, and enterprise-grade performance throughout their lifecycle.',
        items: [
          'Data Quality Engineering: Design robust data validation, cleansing, enrichment, and preprocessing pipelines that ensure trusted, high-quality inputs for AI systems.',
          'Model Validation & Quality Assurance: Establish comprehensive testing frameworks to evaluate model accuracy, robustness, reliability, and production readiness.',
          'AI Risk Detection: Identify and mitigate hallucinations, bias, anomalies, data quality issues, and unexpected model behavior before they impact business operations.',
          'Performance Monitoring & Drift Management: Continuously monitor model performance, detect data and concept drift, and maintain optimal AI effectiveness in production environments.',
          'AI Evaluation & Benchmarking: Measure AI models against predefined quality metrics, enterprise benchmarks, and business objectives to ensure consistent performance.',
          'Reliability & Resilience Engineering: Improve AI system stability, fault tolerance, recovery capabilities, and operational resilience across enterprise workloads.',
        ]
      },
      {
        title: 'Establishing Ethical AI Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Develop governance frameworks that ensure AI systems operate responsibly, transparently, fairly, and in alignment with organizational values and regulatory expectations.',
        items: [
          'Responsible AI Frameworks: Define enterprise-wide governance principles that guide the ethical design, deployment, and operation of AI systems.',
          'Fairness & Transparency: Implement controls that minimize bias, improve explainability, and promote equitable AI outcomes across business processes.',
          'Explainable AI: Enable stakeholders to understand AI reasoning, decision pathways, confidence levels, and supporting evidence for every recommendation.',
          'Accountability & Oversight: Establish governance structures that define ownership, responsibility, approvals, and decision accountability throughout the AI lifecycle.',
          'Human Oversight: Integrate human-in-the-loop governance mechanisms for reviewing, validating, and approving high-impact AI decisions.',
          'Responsible GenAI & Agentic AI: Apply specialized governance controls for autonomous AI agents, Generative AI applications, and multi-agent ecosystems.',
        ]
      },
      {
        title: 'Model Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Establish enterprise-wide governance for managing AI models across development, deployment, monitoring, and retirement.',
        items: [
          'Model Lifecycle Management: Govern AI models through structured development, validation, deployment, monitoring, maintenance, and retirement processes.',
          'Model Version Control: Maintain complete version history, documentation, lineage, and reproducibility across the AI development lifecycle.',
          'Deployment Governance: Implement controlled approval workflows, release management, and production deployment processes for enterprise AI systems.',
          'Performance Validation: Continuously validate model accuracy, reliability, robustness, and business effectiveness throughout production operations.',
          'Change & Release Management: Manage governed model updates, rollback strategies, retraining cycles, and controlled releases with minimal operational disruption.',
          'Model Registry & Documentation: Maintain a centralized repository containing model metadata, documentation, ownership, dependencies, approvals, and governance records.',
        ]
      },
      {
        title: 'Compliance & AI Risk Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Ensure AI systems comply with global regulations, industry standards, organizational policies, and enterprise risk management requirements.',
        items: [
          'Regulatory Compliance: Align AI solutions with international regulations, industry standards, and organizational governance requirements throughout the AI lifecycle.',
          'Data Privacy & Protection: Implement enterprise controls for data anonymisation, encryption, consent management, retention, and secure information handling.',
          'Audit & Policy Enforcement: Maintain comprehensive audit trails, policy enforcement mechanisms, operational logs, and governance evidence for regulatory compliance.',
          'AI Risk Management: Identify, assess, prioritize, and mitigate operational, ethical, regulatory, cybersecurity, and business risks associated with AI systems.',
          'Security & Access Governance: Protect AI assets through identity management, role-based access control, zero-trust security, and continuous access monitoring.',
          'Compliance Monitoring & Reporting: Continuously monitor compliance posture, generate governance reports, and demonstrate adherence to enterprise and regulatory obligations.',
        ]
      },
      {
        title: 'AI Security & Trust',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Protect AI systems, models, agents, and enterprise data against adversarial threats, unauthorised access, and emerging AI-specific security risks.',
        items: [
          'AI Security Architecture: Design secure AI infrastructures with defense-in-depth principles, zero-trust security, and resilient system architectures.',
          'Prompt & LLM Security: Protect Large Language Models against prompt injection, jailbreaks, data leakage, and adversarial manipulation.',
          'Identity & Access Management: Enforce role-based access, least-privilege controls, authentication, and authorisation across AI systems and agents.',
          'AI Threat Detection: Continuously detect malicious behavior, adversarial attacks, model abuse, and security anomalies across AI environments.',
          'Secrets & Credential Management: Secure API keys, tokens, credentials, encryption keys, and confidential enterprise assets used by AI systems.',
          'Secure AI Infrastructure: Implement encryption, network isolation, secure deployment pipelines, and infrastructure hardening for production AI workloads.',
        ]
      },
      {
        title: 'AI Observability & Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Provide continuous visibility into AI system health, performance, cost, reliability, and operational effectiveness across the enterprise.',
        items: [
          'AI Observability: Monitor AI behavior, inference quality, latency, token usage, and operational health across production environments.',
          'Operational Monitoring: Track service availability, response times, throughput, resource utilization, and overall AI system performance.',
          'Cost & Resource Optimization: Analyze AI infrastructure costs, token consumption, compute utilization, and resource efficiency to optimize operational spending.',
          'Incident & Failure Management: Detect, investigate, respond to, and recover from AI failures through structured incident management processes.',
          'Capacity & Scalability Management: Plan and optimize AI infrastructure capacity to support enterprise-scale workloads and future growth.',
          'Operational Analytics & Reporting: Deliver executive dashboards, operational insights, SLA reporting, and continuous improvement metrics for AI operations.',
        ]
      },
      {
        title: 'AI Governance Strategy & Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Help organizations establish enterprise-wide AI governance operating models, governance maturity, organizational readiness, and long-term AI transformation strategies.',
        items: [
          'AI Governance Strategy: Define enterprise AI governance vision, principles, operating models, and strategic roadmaps aligned with business objectives.',
          'AI Governance Operating Model: Design governance structures, roles, responsibilities, committees, decision authorities, and cross-functional governance processes.',
          'AI Governance Maturity Assessment: Evaluate governance capabilities, identify gaps, benchmark against industry best practices, and develop improvement roadmaps.',
          'AI Policy & Standards Management: Develop enterprise AI policies, governance standards, operating procedures, and control frameworks for consistent AI adoption.',
          'AI Portfolio Governance: Prioritize, oversee, and govern enterprise AI initiatives, investments, programs, and business value realisation.',
          'AI Adoption & Change Management: Drive organizational readiness through stakeholder engagement, governance awareness, training, communication, and change management programs.',
        ]
      }
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
      rows: [
        { dimension: 'Autonomy',    before: 'Unmonitored model outputs — high risk of hallucination, bias, and unauthorized agent actions.', after: 'Governed execution — pre-action approval gates, behavior limits, and kill-switches.' },
        { dimension: 'Workflow',    before: 'Ad-hoc scripts and unverified logic — breaks on edge cases without audit trails.', after: 'Continuous audit logging — automated policy enforcement and immutable compliance trails.' },
        { dimension: 'Learning',    before: 'Silent model & data drift — unmonitored decay degrades decision quality over time.', after: 'Real-time drift detection — automated alerts trigger human-in-the-loop review before impact.' },
        { dimension: 'Integration', before: 'Fragmented shadow AI deployments — unmapped models creating security and legal exposure.', after: 'Centralized model registry — enterprise-wide visibility, risk classification, and RBAC controls.' },
        { dimension: 'Outcomes',    before: 'Compliance, reputational & legal risks — vulnerable to EU AI Act and GDPR violations.', after: 'Audit-ready business outcomes — scale AI rapidly with verified explainability and trust.' },
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
      {
        industry: 'Banking & Financial Services',
        headline: 'Model risk management (MRM) and credit explainability.',
        agents: ['Model risk auditor agent', 'Regulatory compliance agent', 'Credit explainability agent'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical AI validation and patient data privacy.',
        agents: ['Clinical validation agent', 'HIPAA privacy agent', 'EHR consent agent'],
      },
      {
        industry: 'Manufacturing & Industry',
        headline: 'Industrial AI safety and automated QA compliance.',
        agents: ['Industrial safety auditor', 'QA compliance agent', 'Predictive maintenance auditor'],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Pricing fairness and consumer data privacy controls.',
        agents: ['Pricing fairness agent', 'Bias detection agent', 'Consumer privacy agent'],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Copilot policy enforcement and multi-tenant security.',
        agents: ['Copilot policy agent', 'Multi-tenant security agent', 'API governance agent'],
      },
      {
        industry: 'EdTech',
        headline: 'Student data privacy and AI grading fairness.',
        agents: ['Student privacy agent', 'AI grading fairness agent', 'Administrative audit agent'],
      },
    ],
    servicePackages: [
      { name: 'Strategy & Audit', description: 'Comprehensive AI landscape inventory, regulatory risk classification (EU AI Act), and governance gap analysis.', duration: '2–3 weeks', tier: 'Advisory' },
      { name: 'Guardrail Pod', description: 'Rapid deployment of model registries, SHAP explainability layers, and bias monitoring for one high-risk production AI model.', duration: '8 weeks', tier: 'Pilot' },
      { name: 'Platform Governance', description: 'Engineering enterprise-wide model registries, automated CI/CD compliance gates, and data masking pipelines.', duration: '16–24 weeks', tier: 'Platform' },
      { name: 'Managed Compliance', description: 'Ongoing production monitoring, model drift alerting, human-in-the-loop workflow management, and audit log maintenance.', duration: 'Ongoing', tier: 'Managed' },
      { name: 'Continuous Assurance', description: 'Enterprise-wide AI risk assurance, periodic regulatory re-assessments, and continuous model governance tuning.', duration: 'Ongoing', tier: 'Enterprise' },
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
      { q: 'What does AI governance actually mean in practice?', a: 'AI governance is the operating system for trustworthy AI. It means every model, agent, and AI application in your enterprise has a defined owner, documented lifecycle, version-controlled deployment, explainable outputs, bias monitoring, compliance validation, and immutable audit trails. Kangqore implements this as infrastructure — not a policy document that sits in a drawer.' },
      { q: 'Why does our organization need AI governance now?', a: 'Three forces are converging: the EU AI Act introduces mandatory compliance obligations with significant penalties for high-risk AI. Shadow AI usage is creating unmonitored model sprawl across departments. And generative AI and autonomous agents are making decisions that directly impact customers, revenue, and legal exposure. Governance is no longer optional — it\'s the difference between scaling AI and getting shut down by your regulator.' },
      { q: 'How is Kangqore\'s AI governance different from buying a GRC tool?', a: 'GRC tools manage policies. Kangqore implements governance infrastructure. We build centralized model registries with automated risk tiering, CI/CD compliance gates that block non-compliant deployments, SHAP explainability layers for every production model, real-time drift detection and bias monitoring, human-in-the-loop approval workflows, and immutable cryptographic audit ledgers. This is engineering, not checkbox compliance.' },
      { q: 'What regulations does your governance framework address?', a: 'EU AI Act (risk classification, transparency, conformity assessment), GDPR (data privacy, consent, right to explanation), HIPAA (clinical AI data protection), SOX (financial model auditability), NIST AI RMF (risk management framework), ISO 42001 (AI management system), and sector-specific mandates including FCA/PRA model risk management for financial services and FDA AI/ML guidance for healthcare.' },
      { q: 'How do you handle model risk management (MRM)?', a: 'Every model in your registry is assigned an automated risk tier (critical, high, medium, low) based on business impact, data sensitivity, regulatory exposure, and autonomy level. Critical and high-risk models require human-in-the-loop approval gates before deployment, continuous performance validation in production, and periodic re-assessment with documented evidence. This is the MRM standard that regulators expect — implemented as automated infrastructure.' },
      { q: 'Can you govern generative AI and autonomous agents specifically?', a: 'That\'s where governance matters most. Kangqore\'s framework includes prompt sanitization and injection defense, behavioral boundary enforcement for autonomous agents, agent-level RBAC with zero-trust permissions, output quality monitoring with hallucination detection, kill-switches for emergency agent termination, and complete prompt-to-response audit trails for every LLM interaction.' },
      { q: 'What does explainable AI look like in production?', a: 'Every production model ships with SHAP-based feature importance, confidence scoring on every prediction, counterfactual explanations ("what would need to change for a different outcome"), decision pathway visualization for complex multi-step reasoning, and human-readable audit reports that non-technical stakeholders and regulators can understand.' },
      { q: 'How do you detect and prevent model drift and bias?', a: 'Real-time production monitoring continuously tracks prediction distributions, feature drift, data quality degradation, and outcome fairness metrics across protected characteristics. When drift exceeds configurable thresholds, automated alerts trigger human-in-the-loop review — before degraded decisions reach customers or operations. Bias checks run on every model retraining cycle with documented fairness evidence.' },
      { q: 'What does a typical AI governance engagement look like?', a: 'Week 1–3: Strategy & Audit — inventory all AI assets, classify risk, identify governance gaps. Week 4–11: Guardrail Pod — deploy model registries, explainability layers, and bias monitoring for one high-risk model. Week 12–24: Platform Governance — enterprise-wide registry, automated compliance gates, and data masking pipelines. Ongoing: Managed Compliance + Continuous Assurance — production monitoring, periodic re-assessment, and governance tuning.' },
      { q: 'How do you handle data privacy within AI governance?', a: 'Enterprise data governance controls include automated PII detection and masking in training data, consent management and data lineage tracking, differential privacy for sensitive datasets, prompt sanitization to prevent data leakage through LLMs, and encrypted data-in-transit and data-at-rest across all AI infrastructure. Every data handling action is logged to immutable audit trails.' },
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
      title: 'AI Governance Technology Stack',
      subtitle: 'The compliance-grade toolchain powering every Kangqore AI governance deployment.',
      items: [
        {
          icon: 'Database',
          title: 'Governance & Registry',
          desc: 'MLflow model registry, custom governance dashboards, automated risk tiering engines, and enterprise-wide asset inventories.',
        },
        {
          icon: 'Eye',
          title: 'Explainability & Fairness',
          desc: 'SHAP, LIME, and counterfactual explainability layers. Fairness metrics across protected characteristics with automated bias alerting.',
        },
        {
          icon: 'Shield',
          title: 'Security & Privacy',
          desc: 'Zero-Trust AI architecture, prompt sanitization, PII detection, data masking, differential privacy, and encrypted audit ledgers.',
        },
        {
          icon: 'Network',
          title: 'Monitoring & Compliance',
          desc: 'Real-time drift detection, performance telemetry, compliance dashboards, HITL approval workflows, and immutable regulatory evidence.',
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
