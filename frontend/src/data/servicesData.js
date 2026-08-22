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

// ─── Policy & Ethics Layer — the 4-layer stack ───────────────────────────────
// Exported rather than inlined because this is a platform pattern, not a
// property of one service: Intelligent Automation, Agentic AI, AI Governance,
// Decision Intelligence and Kangqore View all answer the same four questions.
// Defining it once means the answer cannot drift between pages.
//
//   Policy -> Ethics -> Governance -> Human Accountability
//   what must be followed -> what should be considered right ->
//   what must be controlled -> who remains accountable
//
// Set `architectureNodes: POLICY_ETHICS_STACK` on any service that needs it.
export const POLICY_ETHICS_STACK = [
  {
    title: 'Policy & Regulatory Controls',
    icon: 'ShieldCheck',
    description: 'The policies, regulations, standards and internal rules an automated system has to comply with before it is allowed to act at all.',
    features: [
      'Regulatory compliance mapping',
      'Data and retention policies',
      'Security policies',
      'Industry-specific controls',
      'Operating policies and standards',
    ],
  },
  {
    title: 'Responsible AI & Ethics',
    icon: 'Eye',
    description: 'What the system should not do even where policy permits it. Keeps automated decisions fair, explainable and answerable to the values you actually hold.',
    features: [
      'Bias measurement and management',
      'Explainability of decisions',
      'Ethical use boundaries',
      'Responsible AI principles',
      'Transparency to the affected party',
    ],
  },
  {
    title: 'Risk, Governance & Assurance',
    icon: 'Radar',
    description: 'Continuous evaluation rather than a launch checklist. Tests whether the controls above are present, working, and still working six months later.',
    features: [
      'Risk assessment and tiering',
      'Model and workflow governance',
      'Auditability and control testing',
      'Approval and exception management',
      'Assurance and evidence trails',
    ],
  },
  {
    title: 'Human Oversight & Accountability',
    icon: 'Target',
    description: 'Where human judgment is required, and who answers for the outcome. The layer most programs leave implicit until somebody asks who approved a decision.',
    features: [
      'Human-in-the-loop checkpoints',
      'Approval and escalation workflows',
      'Intervention and override rights',
      'Named accountability per decision',
      'Decision traceability',
    ],
  },
];

export const servicesData = {

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE COGNITION — 11 services
  // ═════════════════════════════════════════════════════════════════════════════

  'agentic-ai': {
    slug: 'agentic-ai',
    name: 'Agentic AI Services',
    industryHeading: 'Agents built for',
    industryHeadingHighlight: 'your industry.',
    midCta: 'Your next workflow runs itself.',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One agent in production.',
      body: 'Talk through your highest-value workflow in 30 minutes — we will scope the right entry point and show you what a production agent looks like for your context.',
    },
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
      { illustrative: true, title: 'Vendor Onboarding',       desc: 'Faster enterprise vendor qualification using an autonomous AI agent for supply chain workflows.',                                          value: '42', suffix: '%', metricLabel: 'Faster Cycle Time',   icon: 'Zap'        },
      { illustrative: true, title: 'Information Access',       desc: 'Reduction in clicks to find answers — RAG-powered AI agents surface knowledge in one query.',                                           value: '78', suffix: '%', metricLabel: 'Fewer Clicks',         icon: 'Search'     },
      { illustrative: true, title: 'Customer Satisfaction',    desc: 'CSAT improvement from autonomous AI agents for customer support powered by sentiment analysis.',                                         value: '31', suffix: '%', metricLabel: 'CSAT Increase',         icon: 'TrendingUp' },
      { illustrative: true, title: 'Call Wait Time',           desc: 'Reduction in wait time by centralizing incident resolution data into a governed agentic AI platform.',                                  value: '17', suffix: '%', metricLabel: 'Wait Time Reduced',     icon: 'Target'     },
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
        headline: 'Personalization at enterprise scale.',
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
    industryHeading: 'Agents built for',
    industryHeadingHighlight: 'your industry.',
    midCta: 'Your next workflow runs itself.',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One agent in production.',
      body: 'Talk through your highest-value workflow in 30 minutes — we will scope the right entry point and show you what a production agent looks like for your context.',
    },
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
    // data-speakable: the one sentence a voice assistant reads out of ~6,000
    // words, and it was "Leverage cognitive technologies to mimic human thought
    // processes" — a claim about resembling people rather than about doing
    // anything.
    shortDescription: 'Kangqore builds systems that read the material your people read: contracts, images, recordings and sensor streams, returned as something you can act on.',
    // Hero paragraph and Service.description in the JSON-LD. The previous
    // version ran four lines in a 520px column; the brief was two. Two-beat
    // declarative: the first clause is what the machine does, the second is what
    // the person does, and the point is that they are working from the same
    // material rather than the machine handing down a verdict.
    //
    // Structure borrowed from a competitor line about systems that "make
    // decisions with their human counterparts" — the idea, deliberately not the
    // words. This page measures zero shared phrasing against that source at six
    // words and above, and that is worth keeping.
    fullDescription: 'Machines that read every contract, image and recording you hold. People who decide with all of it in front of them.',
    keyFeatures: ['Natural language understanding', 'Pattern recognition', 'Machine reasoning', 'Knowledge management', 'Cognitive insights'],
    relatedServiceSlugs: ['agentic-ai', 'data-science-ai', 'genai-business-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    hideBadgeStrip: true,

    // ── Overrides for template defaults written for /services/agentic-ai ──
    // Without these the page rendered "Agents built for your industry." as its
    // industry h2, "One agent in production." as its closing h2, and "Your next
    // workflow runs itself." as the mid-page CTA — three headings advertising a
    // different service on a page about perception and reasoning.
    industryHeading: 'Cognitive systems trained on',
    industryHeadingHighlight: 'your sector\'s evidence.',
    midCta: 'The answer is already in your documents. Nobody has time to read them.',
    midCtaLabel: 'Show us a document',
    closingCta: {
      title: 'One conversation.',
      highlight: 'One system that understands.',
      body: 'Bring the data nobody can read at volume — the contracts, the images, the call recordings, the sensor streams. In 30 minutes we will tell you what a machine can reliably extract from it, what it cannot, and what that is worth.',
      primaryLabel: 'Bring us your hardest document',
      secondaryLabel: 'See the four stages',
    },

    // Department names are internal taxonomy. "The complete Cognition practice"
    // put an org-chart word in an h2 that a buyer has no reason to know.
    practiceLabel: 'RELATED SERVICES',
    practiceHeading: 'The rest of the',
    practiceHeadingHighlight: 'AI practice.',
    practiceLede: 'Perception and reasoning are one layer of the stack. Generation, autonomy, operations and governance are separate services with their own pages, because a buyer asking about OCR and a buyer asking about model registries are not the same buyer. Most programs use two or three together.',

    // Same call as genai-business-services, mlops and ai-governance. This page
    // argues its engagement model with evidence in "Five ways to start" and ten
    // FAQs; the six generic consultancy claims below them measured 93 words in
    // 1,162px — the lowest density on the page.
    hidePartnershipModel: true,
    capabilitiesLabel: 'COGNITIVE COMPUTING SERVICES',
    capabilitiesSectionTitle: 'Cognitive Computing Service',
    capabilitiesSectionHighlight: 'Capabilities.',
    // ── Capability areas ──────────────────────────────────────────────────
    // Ten areas became eight, 2026-08-13. The four dropped — Generative AI
    // Services, Autonomous & Agentic Systems, AI Engineering & MLOps, and AI
    // Governance & Responsible AI — each duplicated a sibling service that has
    // its own page, so this page was competing with genai-business-services,
    // agentic-ai, mlops and ai-governance for the same queries. What replaces
    // them (Multimodal, Anomaly/Event/Edge, Audio & Speech) is territory no
    // other service covers.
    //
    // Author's copy is UK English; converted to US throughout because
    // audit:copy-consistency enforces a single spelling standard across the
    // public surface. The card front splits each item on ':' and shows the name
    // alone, so that format is load-bearing.
    // ── Capability areas ──────────────────────────────────────────────────
    // Taxonomy unchanged from PR #350 — eight areas, 51 sub-capabilities, and
    // the four that duplicated sibling services stay dropped. What changed here
    // is register. The supplied copy carried roughly eight times the boilerplate
    // density of the FAQ on the same page across 1,076 words, and the word
    // "you" appeared zero times against twenty there. Sub-capability NAMES are
    // untouched:
    // they are the searchable taxonomy and they feed 51 Offer objects in the
    // OfferCatalog JSON-LD. Only the prose after each colon is new, and the card
    // front splits on that colon, so the format is load-bearing.
    capabilityAreas: [
      {
        title: 'Machine Learning Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Models that survive contact with production, where the data drifts, the population moves and last quarter\'s accuracy stops being true.',
        items: [
          'Predictive Intelligence: Forecast the thing you will act on rather than the thing that is easiest to predict. A model that calls churn accurately but too late to intervene has answered the wrong question.',
          'Statistical Learning: Quantify how confident the answer is, not just what it is. Where the evidence is thin, the honest output is a wide interval rather than a precise-looking number.',
          'Deep Learning Systems: Reached for when the input is genuinely high-dimensional. Most enterprise problems are still tabular, where a gradient-boosted model wins on cost, latency and your ability to explain it.',
          'Feature Engineering: Usually where the accuracy actually comes from. A well-constructed feature built from your domain knowledge beats a larger model on the same data more often than vendors admit.',
          'Model Optimization: Tuned against what you pay and what your users wait for, not only against a validation score. A model two points better and four times slower is worse.',
          'Model Monitoring: Watch accuracy per segment rather than in aggregate. An overall number holds steady while the segment you care about quietly degrades underneath it.',
        ],
      },
      {
        title: 'Decision Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turning a prediction into a decision somebody is willing to sign, which needs the recommendation, the reason and the confidence in the same place.',
        items: [
          'Prescriptive Analytics: Recommend the action rather than report the forecast. The gap between the two is where most analytics investment stalls.',
          'Decision Optimization: Balance the objective against the constraints you actually have — budget, capacity, regulation — because an optimum that ignores them is a slide rather than a plan.',
          'Scenario Intelligence: Model the alternatives before committing, so the argument is about assumptions you can see rather than instincts you cannot.',
          'Next-Best-Action: Choose per case using context and predicted outcome, with a defined fallback when the signals are too thin to justify a choice.',
          'Intelligent Recommendations: Ranked with the reason attached, because a recommendation nobody can interrogate is one nobody follows twice.',
          'Decision Support Systems: Delivered where the work already happens rather than in a separate dashboard. A decision aid in another tab is a decision aid nobody opens.',
        ],
      },
      {
        title: 'Computer Vision & Visual Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Reading what your cameras, scanners and archives already capture. The constraint is rarely the model — it is lighting, placement, class imbalance and whether anybody kept the rejects.',
        items: [
          'Image Intelligence: Extract structure from photographs, scans, satellite and medical imagery, keeping the region that produced each value so any output can be checked against the pixels.',
          'Video Analytics: Detect events across live and recorded streams, tuned so the alert rate is one a person can actually work through.',
          'Object Recognition: Detect and track objects across conditions your site really has, not the clean set a benchmark was built on.',
          'Facial Analytics: Detection, verification and identity matching where it is lawful and proportionate, with the privacy assessment done before the model rather than after the pilot.',
          'Optical Character Recognition (OCR): Turn printed, handwritten and scanned material into searchable text. Buy this for clean documents; build only where the forms are yours and non-standard.',
          'Scene Intelligence: Read the whole frame — spatial relationships, activity, context — for cases where the isolated object tells you nothing useful.',
          'Visual Search: Find by image or by meaning across catalogs and media libraries, so the question does not have to be phrased as keywords.',
        ],
      },
      {
        title: 'Natural Language & Knowledge Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Making your documents, conversations and institutional knowledge answerable. Whether a general model suffices depends on how much of your vocabulary the internet has already seen.',
        items: [
          'Conversational AI: Assistants that hold the thread and re-retrieve as it moves, rather than treating each turn as though it were the first.',
          'Language Understanding: Intent, sentiment and entities where the terms are yours. Generic classification is a commodity; your product codes and shorthand are not.',
          'Document Intelligence: Classify, extract and summarize at volume, handling the tables, appendices and revision marks that real documents have and demos do not.',
          'Information Extraction: Pull entities, dates, amounts and obligations into fields, keeping the page and line so any value can be traced to its source.',
          'Speech Intelligence: Transcribe and analyze recorded and live speech, with domain vocabulary trained in where accuracy on your terms is what matters.',
          'Enterprise Search & Retrieval: Hybrid search across your repositories, because pure vector search misses exact part numbers and pure keyword search misses the same question phrased differently.',
          'Knowledge Intelligence: Structure the relationships your documents assume but never state, so retrieval can follow them rather than matching text alone.',
        ],
      },
      {
        title: 'Multimodal Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Reasoning across formats at once, for the cases where no single source settles the question and a person would naturally look at several.',
        items: [
          'Multimodal Understanding: Combine text, image, audio and structured data into one view, which is how most real cases arrive rather than as a single clean input.',
          'Vision-Language Intelligence: Ask questions of images and documents in plain language, so the interface is the question rather than a schema.',
          'Multimodal Search: Query with whichever form the user has to hand — a phrase, a photograph, a recording — instead of forcing everything through text.',
          'Cross-Modal Retrieval: Connect the transcript to the recording and the diagram to the specification, so related material surfaces together rather than separately.',
          'Multimodal Reasoning: Weigh sources that disagree and say which was relied on, because silent reconciliation is how a wrong answer becomes invisible.',
          'Multimodal AI Applications: Build the interaction around what the user actually has, rather than around what is easiest to index.',
        ],
      },
      {
        title: 'Anomaly, Event & Edge Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Catching the thing that matters while it is still happening, including where the intelligence has to run on the device because the network cannot be relied on.',
        items: [
          'Anomaly Detection: Flag deviations without burying the team. Threshold placement is the real work, because an alert nobody trusts is worse than none.',
          'Event Detection: Identify meaningful conditions across sensors, audio, video and logs, and distinguish the event from the noise that resembles it.',
          'Behavioral Intelligence: Track how patterns shift over time rather than testing against a fixed baseline that stopped being representative months ago.',
          'Risk Signal Detection: Surface early indicators across systems that do not otherwise talk to each other, which is usually where the signal was hiding.',
          'Edge AI: Run inference where the data is made, for latency, resilience or because the data is not permitted to leave the site.',
          'Edge Inference: Fit optimized models onto cameras, sensors and gateways, trading accuracy against the hardware you actually have rather than the hardware you would like.',
          'Real-Time Perception: Interpret the environment fast enough to act on it, where a correct answer that arrives late is the same as no answer.',
        ],
      },
      {
        title: 'Audio & Speech Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Everything your organization records and never listens to again — calls, meetings, and the sounds your equipment makes before it fails.',
        items: [
          'Speech Recognition: Accurate transcription including your terminology, which is where general models degrade quietly and nobody notices until it matters.',
          'Voice Analytics: Read intent, sentiment and escalation across conversations at volume, rather than sampling the handful anyone had time to review.',
          'Audio Classification: Identify sounds and acoustic events, from equipment signatures to environmental conditions, in recorded and live audio.',
          'Speaker Intelligence: Distinguish and attribute speakers where consent and purpose allow it, with the boundary agreed before the build rather than during review.',
          'Acoustic Event Detection: Catch the bearing whine, the alarm, the pressure change — the sounds an experienced operator recognizes and a rota cannot always cover.',
        ],
      },
      {
        title: 'Extended Reality & Spatial Computing',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Putting information where the work happens, on a factory floor or a site visit, for cases where a screen in another room is the wrong place for it.',
        items: [
          'Augmented Reality Solutions: Overlay the instruction onto the equipment, so a technician reads the step without putting the tool down.',
          'Virtual Reality Experiences: Train for what is dangerous, expensive or rare to rehearse in the real environment.',
          'Mixed Reality Applications: Let people, systems and physical assets interact in one space when the task genuinely spans all three.',
          'Digital Twin Visualization: Represent the asset or facility interactively, driven by live data rather than a model that diverged from reality after commissioning.',
          'Spatial Computing: Make interaction aware of where things are, which is the difference between a heads-up display and a useful one.',
          'Immersive Product Demonstrations: Let a customer explore what does not exist yet, or what is too large to bring to them.',
          'Industrial Simulation: Model the line or the network to test a change before committing capital to it.',
        ],
      },
    ],
    whatIsEyebrow: 'What AI & Cognitive Computing services does Kangqore offer?',
    // "Solutions That Think, Learn & Act." is a sentence any AI vendor can run.
    // The heading now states what the systems take as input, which is the thing
    // that separates this service from the rest of the practice.
    whatIsTitle: 'Systems that read',
    whatIsTitleLine2: 'what your people read,',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'at volume.',
    // Enumerates the same four stages the architecture section and the hero
    // diagram show, in the same order, so all three agree.
    whatIsPara2: 'Perception turns documents, images, speech and sensor streams into something a model can work on. Representation holds meaning rather than strings, so a claim in one place can be connected to the record supporting it in another. Reasoning returns an answer with a calibrated confidence. Evidence keeps what produced it.',

    whatIsPara3: 'What decides whether any of this is worth building is legibility, not ambition. If the knowledge exists in writing, in imagery or on tape, a machine has something to work from. If it lives only in somebody\'s judgment, no model recovers it, and the project is a knowledge-capture exercise wearing an AI badge.',

    whatIsPara4: 'So the threshold matters more than the accuracy score. A system that answers ninety cases and hands you the ten it is unsure about is more useful than one that answers all hundred with the same untroubled confidence, because only the first tells you where to look.',
    bannerBrandDesc: 'Our enterprise AI & cognitive computing product & platform',
    downloadAsset: '/assets/downloads/kangqore-cognitive-computing-playbook.pdf',
    comparisonTable: {
      // Every label here used to fall through to the template default, which is
      // written for /services/agentic-ai. The result was a heading reading "The
      // shift from automation to autonomy" above columns headed TRADITIONAL AI
      // and AGENTIC AI, with dimensions Autonomy / Workflow / Learning /
      // Integration / Outcomes — an agent-execution argument on a page about
      // perception and reasoning. Rows are rewritten to the axis that actually
      // separates a cognitive system from a conventional one: what it can take
      // as input, and what it does when the input is ambiguous.
      heading: 'Conventional systems read fields. Cognitive systems read evidence.',
      lede: 'Most enterprise software works on data somebody already structured. The information that decides things rarely arrives that way — it arrives as a contract, a photograph, a recording, a sensor trace. A cognitive system is one that can take that as input, form a view under uncertainty, and tell you how confident it is.',
      beforeLabel: 'CONVENTIONAL SYSTEMS',
      afterLabel: 'COGNITIVE SYSTEMS',
      afterBadge: 'GROUNDED',
      beforeShort: 'Conventional',
      afterShort: 'Cognitive',
      rows: [
        { dimension: 'Input', before: 'Structured fields only. Anything that arrives as a document, an image or a recording is queued for a person to read first.', after: 'Text, images, video, speech, documents and sensor streams read directly, including the scanned and handwritten material nobody has indexed.', link: { href: '/services/big-data', label: 'Data foundations' } },
        { dimension: 'Reasoning', before: 'Fixed rules written in advance. A case the author did not foresee falls through to an exception queue.', after: 'Inference over learned patterns, so a case that resembles a thousand previous ones is handled without anyone having written the rule for it.' },
        { dimension: 'Uncertainty', before: 'A binary answer regardless of evidence. Nothing distinguishes a confident match from a marginal one.', after: 'A calibrated confidence score with every output, and a defined threshold below which the case routes to a person rather than a guess.' },
        { dimension: 'Adaptation', before: 'Static until someone reprograms it. Drift shows up as a rising exception rate that nobody attributes to the model.', after: 'Retrained on a schedule against a held-out set, with drift and accuracy tracked per segment rather than as one aggregate number.', link: { href: '/services/mlops', label: 'Model lifecycle' } },
        { dimension: 'Explainability', before: 'The output is the whole answer. Asked why, the system has nothing further to offer.', after: 'Feature attributions for structured inputs and the source passage or region for unstructured ones, retained with the decision and reproducible later.', link: { href: '/services/ai-governance', label: 'Governance and audit' } },
      ],
    },
    // Descriptions argued agent execution — "cognitive agents autonomously
    // execute tasks", "goal decomposition" — which is /services/agentic-ai's
    // subject, not this one. Rewritten to the perception-to-decision path this
    // page actually sells, and keyCapabilities were empty on all four nodes so
    // the cards rendered a heading and a paragraph with nothing underneath.
    // The template default read "Every deployment runs on a governed, modular
    // architecture built for enterprise scale" — true of any page here.
    architectureEyebrow: 'HOW THE PIPELINE FITS TOGETHER',
    architectureTitle: 'Four stages.',
    architectureTitleHighlight: 'Each one measurable on its own.',
    architectureLede: 'Each stage has its own quality signal — perception accuracy, representation recall, reasoning calibration, evidence completeness. Measured separately, so a wrong answer tells you exactly which stage produced it.',
    architectureNodes: [
      {
        title: 'Perception',
        icon: 'Eye',
        description: 'Every modality your organization produces — documents, images, video, speech, sensor streams, scanned and handwritten material — converted into the structured form a model can reason over. Failure here is silent: the model works from an incomplete version of reality without knowing it.',
        features: ['OCR & Document Parsing', 'Image & Video Pipelines', 'Speech Transcription & Diarization', 'Sensor & Stream Ingest'],
      },
      {
        title: 'Representation',
        icon: 'Network',
        description: 'Meaning extracted, not strings stored. Embeddings, typed entities and relationships built so the same concept in two documents maps to the same node — and a claim in one can be connected to the record that supports or contradicts it in another.',
        features: ['Embeddings & Vector Index', 'Entity Extraction', 'Knowledge Graph', 'Cross-Document Linking'],
      },
      {
        title: 'Reasoning',
        icon: 'Brain',
        description: 'Inference over what was perceived and represented, with a calibrated confidence attached to every answer. A defined threshold routes cases below it to a human review queue. The system never answers with more certainty than the evidence warrants.',
        features: ['Classification & Ranking', 'Confidence Calibration', 'Uncertainty-Gated Review Queue', 'Human Review Thresholds'],
      },
      {
        title: 'Evidence',
        icon: 'ShieldCheck',
        description: 'Every output carries its provenance: the source passage, the image region, the feature attributions. Retained with the decision so it can be reconstructed and audited months later — from the record, not from memory.',
        features: ['Source Attribution', 'Feature Attributions', 'Decision Logs', 'Drift & Accuracy Tracking'],
      },
    ],
    industryUseCases: [
      // Was eighteen entries each named "X agent" — a compliance monitoring
      // agent, a patient triage agent, a demand forecasting agent. That is the
      // agentic product catalog this section was cloned from. A cognitive
      // computing engagement does not sell agents; it makes unreadable material
      // machine-readable. These are the inputs each sector actually has and what
      // a system can take from them. The neutral `items` key replaces `agents`,
      // which the template still reads for the services where it is accurate.
      {
        industry: 'Banking & Financial Services',
        headline: 'The evidence is in the documents, not the fields',
        items: [
          'Regulatory filings, cross-border contracts and disclosure packs read at volume, with the clause and page retained against every extracted obligation',
          'Transaction narratives and case notes classified for financial-crime review, with a confidence threshold below which a human sees it first',
          'Credit and adverse-action decisions returned with feature attributions, because a regulator will ask which inputs drove the outcome',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical information that arrives as prose and pixels',
        items: [
          'Discharge summaries, referral letters and pathology reports structured into coded fields, with the source line kept for clinician review',
          'Imaging triage that ranks studies by likely urgency rather than reading them, so a radiologist decides and the model orders the queue',
          'PHI detected and redacted before any model sees it, with lineage evidence showing what was ever exposed',
        ],
      },
      {
        industry: 'Manufacturing & Industry',
        headline: 'Thirty years of maintenance knowledge, plus what the line can see',
        items: [
          'Visual inspection on the line, with defect classes trained from your own reject bins rather than a generic dataset',
          'Manuals, service bulletins and engineer field notes made searchable, including scanned and handwritten material',
          'Acoustic and vibration signatures classified at the edge, so a bearing is flagged before it fails rather than after',
        ],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Catalog, shelf and conversation as one signal',
        items: [
          'Product imagery and attribute data reconciled so a catalog entry and the photograph agree with each other',
          'Shelf and planogram compliance read from store photography rather than audited by hand',
          'Contact-center recordings transcribed and classified to surface the reasons behind demand shifts, not just the shifts',
        ],
      },
      {
        industry: 'IT & Infrastructure',
        headline: 'Incidents described in prose, resolved from history',
        items: [
          'Ticket text and log excerpts classified against past incidents to surface the closest prior resolution',
          'Runbooks, change history and postmortems made semantically searchable during an incident rather than after it',
          'Anomaly detection across telemetry with thresholds set per service, because one alerting standard across an estate produces noise',
        ],
      },
      {
        industry: 'EdTech & Higher Ed',
        headline: 'Assessment and content at cohort scale',
        items: [
          'Free-text answers scored against a published rubric, with the criterion cited for each comment and human review on anything affecting progression',
          'Lecture and seminar audio transcribed, indexed and made searchable across a term of material',
          'Student data minimized before any model sees it, with retention limits enforced automatically',
        ],
      },
    ],
    // The inherited lede opened "Most clients begin with a scoped pilot to prove
    // the model on one workflow" — the genai framing, where the unknown is
    // whether something can be grounded. Here the unknown is whether the data is
    // legible enough to work on at all, which is what the audit establishes.
    engagementLede: 'Five entry points, from a three-week audit to continuous optimization. Most programs start by finding out whether the material is legible enough to model, because that is the question that decides everything after it and it is cheaper to answer in a fortnight than in a pilot.',
    servicePackages: [
      {
        name: 'Strategy & Audit',
        description: 'Establish what your unstructured material actually contains, how consistent it is, and which use cases the data can carry. Ends with the two worth building and why the rest are not.',
        duration: '2–3 weeks',
        tier: 'Advisory',
        deliverables: ['Data legibility assessment per source', 'Scored use-case shortlist with feasibility notes', 'Target accuracy and the cost of a wrong answer, per case'],
      },
      {
        name: 'Cognitive Pod',
        description: 'One use case taken to production on your own material: labeled set, trained model, confidence thresholds, human review path and the evidence trail behind each output.',
        duration: '8 weeks',
        tier: 'Pilot',
        deliverables: ['Labeled and versioned evaluation set', 'Model in the serving path with calibrated thresholds', 'Human review queue with a measured escalation rate'],
      },
      {
        name: 'Platform Build',
        description: 'The shared substrate: ingestion for every modality, an embedding and retrieval layer, model registry and the evaluation harness, all as infrastructure as code.',
        duration: '16–24 weeks',
        tier: 'Platform',
        deliverables: ['Multimodal ingestion and preprocessing pipelines', 'Vector and knowledge layer as infrastructure as code', 'Registry, evaluation harness and CI gates'],
      },
      {
        name: 'Governed Deployment',
        description: 'Production rollout with the controls attached: drift and accuracy monitored per segment, human-in-the-loop dashboards, and an audit trail written as the system runs.',
        duration: 'Ongoing',
        tier: 'Managed',
        deliverables: ['Per-segment accuracy and drift reporting', 'Human review dashboards and staffing model', 'Immutable decision log with source attribution'],
      },
      {
        name: 'Scale & Optimize',
        description: 'Extend to further modalities and use cases, retrain against fresh material, and retire the thresholds that no longer reflect how the system is used.',
        duration: 'Ongoing',
        tier: 'Enterprise',
        deliverables: ['Scheduled retraining against refreshed sets', 'Threshold and cost-per-decision review', 'Capability expansion plan with a measured baseline'],
      },
    ],
    // Narratives read as capability lists rather than as what happened. Both
    // stay flagged illustrative — the figures are modeled, not client results,
    // and the template renders that disclaimer beneath each card.
    outcomeCard: {
      illustrative: true,
      metric: '87%',
      metricLabel: 'Of filings read without a human first',
      industry: 'Global Financial Services',
      problem: 'Risk and compliance read regulatory filings, cross-border contracts and disclosure packs by hand, because nothing else could. The queue ran weeks behind publication, and the obligations that mattered were found late rather than missed outright — which is worse in a different way, because late looks like coverage right up until an assessor checks the dates.',
      outcome: 'Documents are parsed on arrival, obligations extracted with the clause and page retained against each one, and anything below the confidence threshold routed to the team that used to read everything. They review the marginal cases rather than the whole queue. If you are wondering what happens to the ones the model gets wrong: they surface as low-confidence, which is the point of measuring it.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '65%',
      metricLabel: 'Fewer records screened by hand',
      industry: 'Healthcare & Clinical Research',
      problem: 'Trial eligibility screening meant clinicians reading dense EHR notes and protocol documents across systems that did not talk to each other. Screening capacity, not patient availability, was the constraint on recruitment.',
      outcome: 'Records are parsed against protocol criteria and returned as a ranked shortlist, each match carrying the passage that produced it. A clinician still decides eligibility — that line does not move. What changed is that they read the twenty candidates worth reading rather than the six hundred that were not, and can see in one click why each one surfaced.',
    },
    businessMetrics: [
      { illustrative: true, title: 'Data Comprehension',  desc: 'Improvement in unstructured data comprehension using multi-modal NLP and cognitive reasoning engines.',                              value: '87', suffix: '%',    metricLabel: 'Comprehension Accuracy', icon: 'BrainCircuit' },
      { illustrative: true, title: 'Decision Automation', desc: 'Complex business decisions automated through cognitive decision intelligence and prescriptive analytics platforms.',                     value: '65', suffix: '%',    metricLabel: 'Decisions Automated',    icon: 'Target'       },
      { illustrative: true, title: 'Knowledge Discovery',  desc: 'Faster insight discovery from enterprise knowledge graphs, semantic search, and contextual intelligence layers.',                       value: '4',  suffix: 'x',    metricLabel: 'Faster Insights',        icon: 'Zap'          },
      { illustrative: true, title: 'Models in Production', desc: 'Enterprise AI and cognitive computing models deployed and operationalized across client organizations.',                                  value: '120',suffix: '+',    metricLabel: 'Models Deployed',        icon: 'Layers'       },
    ],
    // Ten answers averaged 54 words and one paragraph each: a definition
    // followed by a capability list. Rewritten to the three-beat shape used on
    // genai-business-services and ai-governance — the direct answer first so the
    // opening sentence stands alone as a quote, then the mechanism, then the
    // caveat or the thing teams get wrong. Two answers claimed services that are
    // no longer capability areas on this page and now state the boundary
    // instead.
    customFAQs: [
      {
        q: 'What exactly is cognitive computing, and how is it different from AI?',
        a: 'AI is the field. Cognitive computing is a design stance within it: systems built to work on the kinds of input people work on, which is mostly not rows in a table. Language, images, speech, documents, sensor traces.\n\n'
          + 'The practical difference shows at the edge of what the system knows. A conventional application either matches a rule or raises an exception. A cognitive one forms a view, attaches a confidence to it, and routes the marginal cases to a person because a threshold said so rather than because somebody wrote an exception path for that case.\n\n'
          + 'The term is older than the current wave and gets used loosely, so it is worth being concrete. On this page it means perception, representation, reasoning and evidence, and every capability listed above sits in one of those four.',
      },
      {
        q: 'Which cognitive capabilities does Kangqore actually deliver?',
        a: 'Eight domains: Machine Learning Engineering, Decision Intelligence, Computer Vision & Visual Intelligence, Natural Language & Knowledge Intelligence, Multimodal Intelligence, Anomaly & Edge Intelligence, Audio & Speech Intelligence, and Extended Reality & Spatial Computing.\n\n'
          + 'Generative AI, agentic systems, MLOps and AI governance are deliberately not on that list. Each is a service in its own right with its own page, and folding them in here would mean two Kangqore pages competing to answer one question. What sits here is the perception and reasoning layer: turning language, images, audio, sensor streams and enterprise data into something a system can act on.\n\n'
          + 'Most engagements use two or three of the eight rather than all of them. The audit exists to establish which, because the common failure is buying a platform that covers everything and using a fifth of it.',
      },
      {
        q: 'How does Kangqore handle NLP and language understanding?',
        sources: [
          { label: 'Whisper: Robust Speech Recognition (OpenAI, arXiv)', url: 'https://arxiv.org/abs/2212.04356' },
        ],
        a: 'By establishing first whether your language is generic or specific, because that decides everything after it. Intent classification, sentiment and standard entity extraction are commodities now, and a managed API will beat anything we would train for you.\n\n'
          + 'What earns a custom model is vocabulary the internet has not seen: your product codes, your clause library, your abbreviations, the shorthand your service desk types at three in the morning. That is where a general model degrades quietly, and where a few thousand labeled examples from your own material buys more accuracy than a larger model would.\n\n'
          + 'The deliverable is the same either way: an evaluation set built from real traffic rather than invented examples, a confidence threshold you set, and a review path for what falls below it.',
      },
      {
        q: 'Can you build computer vision systems for our industry?',
        a: 'Usually, and the question that decides it is how many examples of the thing you care about you can actually produce. Generic object detection is solved and cheap. A defect class specific to your line is not, and it needs images of that defect.\n\n'
          + 'A few hundred labeled examples per class is often enough to start on a narrow task. A few dozen is not, whatever a vendor demo suggests. Where the examples do not exist yet, the first phase is building the capture path rather than the model, and that is worth saying out loud before anyone budgets for the model.\n\n'
          + 'We have deployed vision in manufacturing inspection, clinical imaging triage, shelf compliance and document processing. The constraint is rarely the architecture. It is lighting, camera placement, class imbalance, and whether anybody kept the rejects.',
      },
      {
        q: 'Does this service cover generative AI?',
        a: 'Not directly. Generative AI is a separate service: retrieval over your own documents, prompt and context engineering, guardrails, evaluation and fine-tuning are covered on our GenAI Business Services page in far more depth than a paragraph here could manage.\n\n'
          + 'The two do meet, though, and usually in the same engagement. A generative system is only as good as what it retrieves, and what it retrieves generally has to be perceived first: scanned contracts turned into text, recordings turned into transcripts, diagrams turned into descriptions. That extraction work is this page.\n\n'
          + 'So a document-heavy generative project often starts here and moves there. We scope it as one piece of work even though the two services are staffed and priced separately.',
      },
      {
        q: 'How does this relate to AI governance?',
        sources: [
          { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
          { label: 'Model Cards for Model Reporting (Mitchell et al., arXiv)', url: 'https://arxiv.org/abs/1810.03993' },
        ],
        a: 'Governance is its own service, and the depth sits on our AI Governance page: risk tiering against the EU AI Act, model registries, explainability, drift and fairness testing, and the evidence an assessor asks to see.\n\n'
          + 'What this service owes governance is the raw material for it. A cognitive system that cannot say which passage, or which region of an image, drove its output cannot be governed afterwards however good the policy is. So attribution is built into the serving path here rather than bolted on once somebody asks.\n\n'
          + 'The division in practice: this service decides what the system can perceive and how confident it is entitled to be. The governance service decides who signed it off, which tier it sits in, and how you prove any of that later.',
      },
      {
        q: 'Can AI actually make business decisions, or only recommend them?',
        sources: [
          { label: 'A Unified Approach to Interpreting Model Predictions — SHAP (Lundberg & Lee, arXiv)', url: 'https://arxiv.org/abs/1705.07874' },
        ],
        a: 'It can make some of them and should be prevented from making others. The line is drawn by what a wrong answer costs and whether it can be undone.\n\n'
          + 'Where the cost is low and the volume is high, automating the decision is straightforward and the argument is economic. Where a wrong answer reaches a customer, a patient or a regulator, the system recommends and a person decides, with the recommendation carrying its confidence and its evidence so that review is quick rather than ceremonial.\n\n'
          + 'The failure we see most is a threshold set once and never revisited. Volumes shift, the population drifts, and a review queue calibrated in month one is either waving everything through or drowning the team by month nine.',
      },
      {
        q: 'How does knowledge intelligence differ from enterprise search?',
        a: 'Search returns documents. Knowledge intelligence returns the relationship between them: that this supplier is the parent of that one, that this clause supersedes that clause, that these three tickets describe a single incident.\n\n'
          + 'The mechanism is a graph of entities and relationships extracted from your own material and kept current as it changes, sitting alongside the vector index rather than replacing it. Semantic search finds what is similar; the graph answers what is connected. Most real questions need both.\n\n'
          + 'Worth being honest about the cost: a graph is considerably more expensive to build and maintain than an index, and it earns that only where the relationships carry the value. If your questions are answered by finding the right document, stop at search.',
      },
      {
        q: 'What does a typical engagement look like?',
        a: 'It starts with an audit, because the first question is whether the material is legible enough to model at all. Two to three weeks establishes what your unstructured sources actually contain, how consistent they are, and which use cases the data can carry.\n\n'
          + 'From there it is usually one use case taken to production over about eight weeks: a labeled evaluation set, a model in the serving path, calibrated thresholds, and a human review queue with a measured escalation rate. Platform work follows across the estate, typically over four to six months.\n\n'
          + 'What we do not do is start with the model. Training on material nobody has assessed is the most reliable way to spend a quarter and learn something the audit would have told you in a fortnight.',
      },
      {
        q: 'Which industries has Kangqore delivered cognitive computing for?',
        a: 'Banking and financial services, healthcare and life sciences, manufacturing, retail and consumer goods, IT and infrastructure, and education. The sector matters less than the shape of the material, which is why the industry section above is organized around inputs rather than logos.\n\n'
          + 'Document-heavy sectors share a problem set: non-standard formats, scanned and handwritten material, and obligations buried in prose. Sensor-heavy sectors share a different one: class imbalance, deployment at the edge, and the fact that the interesting event is rare by definition.\n\n'
          + 'The engagements that go badly are usually the ones where a pattern was assumed to transfer. A defect model trained on one production line rarely survives the move to another line, let alone another company.',
      },
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
      'Decision Intelligence',
      'Computer Vision & Visual Intelligence',
      'Natural Language & Knowledge Intelligence',
      'Multimodal Intelligence',
      'Anomaly, Event & Edge Intelligence',
      'Audio & Speech Intelligence',
      'Extended Reality & Spatial Computing',
    ],
    trustSignals: [
      'Production cognitive systems deployed across banking, healthcare, manufacturing & retail',
      'Enterprise AI governance with explainability, bias detection & compliance controls',
      'Multi-modal intelligence — NLP, vision, speech, knowledge graphs & decision engines',
      'Proven delivery: 120+ models in production with measurable business outcomes',
    ],
    // ── eQORE concierge ────────────────────────────────────────────────────
    // The section carries the worst text density on the page: about a thousand
    // pixels of the second-most-read screen position for roughly a hundred and
    // ten words, a third of what its neighbours hold. The prompts were already
    // service-specific but generic in register -- "What governance controls come
    // built in?" is a question about no service in particular, and it is the
    // exact boilerplate the rest of this page spent four passes removing.
    //
    // These four are the questions this service actually gets asked, and each
    // restates an argument the page makes elsewhere: legibility decides
    // feasibility, labeled volume decides cost, the confidence threshold decides
    // what a person still sees, and the eight-area taxonomy is how work is
    // scoped. They are also the only part of this block a crawler can read.
    conciergeChips: [
      'Can you read handwritten forms and scanned documents, or only clean text?',
      'How many labeled examples do we need before a model is worth training?',
      'What happens to the cases the model is not confident about?',
      'Which of the eight capability areas fits the data we actually have?',
      'Book a data legibility review',
    ],
    conciergeHeading: 'From the documents nobody can read at volume to a solution direction',
    conciergeIntro: 'Describe the material you need read — the contracts, the scans, the recordings, the sensor traces — and eQORE will point you at the capability area that applies, what a machine can reliably extract from it, and where a person still has to decide.',
    // Was four rows, roughly a dozen tool names and 98 words in 781px, with no
    // indication of when you would choose any of them. Built to the same
    // standard as the equivalent section on /services/ai-governance: five
    // layers, named options either side, and the threshold stated per row.
    // Cognitive work splits on build-versus-buy per modality, because a
    // commodity API is genuinely better than a custom model for some of them
    // and hopeless for others.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'Every modality.',
      titleHighlight: 'Built or bought, deliberately.',
      subtitle: 'For each layer there is a managed API that works out of the box and an open-source path you train yourself. What decides it is whether your material looks like the internet. Generic speech, generic OCR and generic object detection are commodities and you should buy them. A defect class specific to your line, a document format specific to your sector, a vocabulary specific to your business — those are where a trained model earns its cost.',
      items: [
        {
          icon: 'Eye',
          title: 'Vision & document',
          managed: 'Azure AI Document Intelligence · Google Document AI · Amazon Textract',
          selfHosted: 'PaddleOCR · Tesseract · YOLO · Detectron2 · Segment Anything',
          desc: 'Buy for clean printed documents and common object classes; the managed services are years ahead of anything you would train for that. Build when the defect class is yours, the forms are non-standard, or the material cannot leave your network.',
          link: { href: '/services/big-data', label: 'Data pipelines behind it' },
        },
        {
          icon: 'MessageSquare',
          title: 'Language & speech',
          managed: 'Azure AI Speech · Google Speech-to-Text · Deepgram · AssemblyAI',
          selfHosted: 'Whisper · spaCy · Hugging Face Transformers · sentence-transformers',
          desc: 'Whisper is usually the right first answer for transcription and costs nothing to try. Managed speech earns its price on real-time streaming, diarization at scale, and languages where the open models are thin. Domain vocabulary is the usual reason to fine-tune.',
        },
        {
          icon: 'Database',
          title: 'Representation & retrieval',
          managed: 'Azure AI Search · Vertex AI Search · Pinecone',
          selfHosted: 'pgvector · Qdrant · Weaviate · Neo4j · OpenSearch',
          desc: 'pgvector is usually where to start: embeddings sit next to the data that produced them, in a database you already operate. A dedicated store earns its place once hybrid ranking, re-ranking or cross-team isolation becomes the constraint.',
        },
        {
          icon: 'Cpu',
          title: 'Modeling & training',
          managed: 'Vertex AI Training · Azure ML · Bedrock customization',
          selfHosted: 'PyTorch · scikit-learn · LightGBM · LoRA & QLoRA',
          desc: 'Most cognitive problems are still tabular or narrow classification, where a gradient-boosted model beats a neural one on cost and latency and is far easier to explain. Reach for deep learning when the input is genuinely high-dimensional.',
          link: { href: '/services/data-science-ai', label: 'Model development' },
        },
        {
          icon: 'Gauge',
          title: 'Evaluation & serving',
          managed: 'Vertex AI Prediction · SageMaker endpoints · Azure ML endpoints',
          selfHosted: 'MLflow · Evidently · SHAP · Ray Serve · Triton',
          desc: 'The evaluation set is the asset, not the model. Managed endpoints are the faster start; you move to self-hosted when inference volume makes the per-call price the dominant cost, or when latency has to be measured where the user waits.',
          link: { href: '/services/mlops', label: 'Running it in production' },
        },
      ],
    },
  },

  'data-science-ai': {
    slug: 'data-science-ai',
    name: 'Data Science & AI',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    heroTitle: 'Data Science & AI\nfor Decisions You Can Defend',
    // The Cognition defaults put "Reasoning. Learning. Autonomous." under the
    // h1 and "Autonomous Agents" in the hero strip -- the last agentic strings
    // above the fold on a page about predictive modeling.
    heroBadge: 'Predictive. Validated. Accountable.',
    heroStripItems: [
      'Predictive Modeling', 'Feature Engineering', 'Forecasting', 'Anomaly Detection',
      'Causal Inference', 'Model Validation', 'Drift Monitoring', 'Explainable Predictions',
    ],
    shortDescription: 'Kangqore builds predictive models that reach production and stay accurate there: forecasting, risk scoring, churn and pricing, monitored per segment.',
    fullDescription: 'Models that survive contact with next quarter, wired into the decision they exist to make, with the confidence attached so a person knows when to overrule them.',
    keyFeatures: ['Predictive modeling', 'Statistical analysis', 'Feature engineering', 'Model deployment', 'Data visualization'],
    relatedServiceSlugs: ['mlops', 'analytics', 'big-data', 'ai-governance', 'genai-business-services', 'ai-cognitive-computing'],
    featured: false,
    image: '/images/capabilities/agentic-governed-autonomy.png',
    whatIsTitle: 'A notebook result',
    whatIsTitleLine2: 'and a production model',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'are different objects.',
    whatIsPara2: 'Most data science work fails somewhere between a validated result and a decision anybody makes differently. The model is fine. What is missing is the path from a prediction to an action, the monitoring that says whether it is still right, and a named person who is accountable when it is not.',

    whatIsPara3: 'So the question we ask first is not what could be predicted, but which decision would change if the prediction existed. A churn model that is accurate but arrives after the renewal date has answered the wrong question precisely. If no decision moves, the work is analysis, and analysis is cheaper done once than productionized.',

    whatIsPara4: 'Accuracy is also the wrong headline number on its own. Watch it per segment rather than in aggregate: an overall score holds steady for months while the segment you actually care about degrades underneath it, and nobody notices until a person who trusted the output is asked to explain a decision.',
    businessMetrics: [
      { illustrative: true, title: 'Model Accuracy Gain',  desc: 'Average improvement over baseline heuristics after deploying Kangqore data science models.',                         value: '38', suffix: '%',    metricLabel: 'Accuracy Improvement', icon: 'Target'    },
      { illustrative: true, title: 'Model Delivery Speed', desc: 'Time from data exploration to production-ready model using accelerated feature engineering pipelines.',                value: '6',  suffix: ' Wks', metricLabel: 'Model Delivery',       icon: 'Zap'       },
      { illustrative: true, title: 'Revenue Uplift',       desc: 'Average revenue uplift from predictive models in pricing, churn reduction, and customer LTV applications.',            value: '22', suffix: '%',    metricLabel: 'Revenue Uplift',       icon: 'TrendingUp'},
      { illustrative: true, title: 'Models Built',         desc: 'Custom AI/ML models built and deployed across retail, financial services, and healthcare industries.',                  value: '80', suffix: '+',    metricLabel: 'Models Deployed',      icon: 'Layers'    },
    ],
    hidePartnershipModel: true,

    // ── Engagement outcomes ─────────────────────────────────────────────────
    // These were rendering from the parity layer's synthesized defaults, which
    // is why the outcomes block reached the prerender snapshot as nothing at
    // all: the generator reads raw service data and there was none here. Real
    // narratives fix the crawler gap and the content in one move.
    outcomeCard: {
      illustrative: true,
      metric: '3x',
      metricLabel: 'More candidates reviewed per underwriter, per day',
      industry: 'Specialty Insurance',
      problem: 'Underwriters triaged submissions by hand in the order they arrived, which meant the order was effectively random. The good risks and the ones that should have been declined outright got the same first fifteen minutes, and capacity ran out before the queue did. Nobody could say which submissions had been missed, only that some had.',
      outcome: 'Submissions are now scored on arrival and ranked, with the three factors that drove each score shown next to it. Underwriters still decide -- that line does not move -- but they start at the top of a list rather than the front of a queue. The cases the model is unsure about are flagged rather than ranked, which is the point of measuring confidence at all.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '11 days',
      metricLabel: 'Earlier warning on equipment failure',
      industry: 'Industrial Manufacturing',
      problem: 'Failure prediction had been attempted twice and abandoned twice. Both attempts trained on sensor history that recorded failures but not the interventions around them, so the model learned to predict maintenance visits rather than faults. It scored well and was useless, which is the worst combination because it takes months to notice.',
      outcome: 'The third attempt started by fixing the labels rather than the model. Once maintenance records were joined to sensor traces, a deliberately simple model beat both previous attempts. Accuracy is now tracked per asset class, because the fleet average stayed flat for a quarter while one line degraded underneath it.',
    },


    // ── Section headings that were still template defaults ──────────────────
    // The outcomes block had an eyebrow and no h2, so it was the one section
    // missing from the heading outline entirely.
    outcomesEyebrow: 'WHAT THESE ENGAGEMENTS CHANGED',
    outcomesHeading: 'The measure is not accuracy.',
    outcomesHeadingHighlight: 'It is what happened next.',

    // "Five ways to start. One partner throughout." is true of every service
    // here. This page argues that you should not buy the machinery before you
    // know the model is any good, so the heading says that.
    engagementEyebrow: 'WHERE PROGRAMS ACTUALLY START',
    engagementHeading: 'Start with one decision.',
    engagementHeadingHighlight: 'Add models when the first one earns it.',
    engagementLede: 'Almost nobody should begin with a model portfolio. The useful first question is whether a single prediction would change a single decision, and that is answerable in weeks rather than quarters.',

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Eight questions,',
    faqHeadingHighlight: 'answered without hedging.',


    // ── Toolchain ────────────────────────────────────────────────────────────
    // The parity default described a stack "powering cognitive computing,
    // machine learning, and AI governance" -- three services, one of which is
    // this one.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'What we reach for,',
      titleHighlight: 'and when we do not.',
      subtitle: 'Tool choice is mostly determined by the shape of your data and how the result has to be explained. These are the defaults and the cases that override them.',
      items: [
        {
          icon: 'Boxes',
          title: 'Gradient-boosted trees',
          managed: 'XGBoost, LightGBM, CatBoost',
          selfHosted: 'Default for tabular data',
          desc: 'Where most business problems actually live. Wins on cost, latency and explainability against a neural network on the same table, and it is the baseline anything else has to beat.',
        },
        {
          icon: 'Brain',
          title: 'Deep learning',
          managed: 'PyTorch, TensorFlow',
          selfHosted: 'High-dimensional input only',
          desc: 'Reached for when the input is genuinely images, audio, text or long sequences. Applied to a spreadsheet it costs more, explains less and rarely wins.',
        },
        {
          icon: 'GitBranch',
          title: 'Experiment tracking',
          managed: 'MLflow, Weights & Biases',
          selfHosted: 'From the first model, not the tenth',
          desc: 'Added late, nobody can reconstruct which run produced the model now in production. Added early, it costs an afternoon.',
          link: { label: 'MLOps', to: '/services/mlops' },
        },
        {
          icon: 'ScanLine',
          title: 'Explainability',
          managed: 'SHAP, partial dependence',
          selfHosted: 'Decided before the model',
          desc: 'If a regulator or a customer will ask why, that constraint selects the model. Retrofitting an explanation onto an opaque one is where projects stall.',
          link: { label: 'AI Governance', to: '/services/ai-governance' },
        },
        {
          icon: 'Activity',
          title: 'Drift and quality monitoring',
          managed: 'Evidently, Great Expectations',
          selfHosted: 'Per segment, not in aggregate',
          desc: 'Catches the input distribution moving before the accuracy does. An aggregate score is the last place a problem shows up.',
          link: { label: 'MLOps', to: '/services/mlops' },
        },
        {
          icon: 'Workflow',
          title: 'Orchestration',
          managed: 'Airflow, Dagster, Prefect',
          selfHosted: 'When retraining is scheduled',
          desc: 'Worth it once retraining is real. Before that it is infrastructure for a pipeline that runs by hand twice a month.',
        },
      ],
    },

    // ── CTAs ─────────────────────────────────────────────────────────────────
    midCta: 'You already have the data. The decision still takes a week.',
    midCtaLabel: 'Bring us the decision',

    closingCta: {
      title: 'One decision.',
      highlight: 'One model that changes it.',
      body: 'Bring the decision that takes too long, and whatever data you already hold about it. In 30 minutes we will tell you what can be predicted well enough to act on, what cannot, and whether the bottleneck is the data or the process around it.',
      primaryLabel: 'Bring us a decision',
      secondaryLabel: 'See the four stages',
      proofLabel: 'From first call to first model that changes a decision',
    },

    // ── eQORE ────────────────────────────────────────────────────────────────
    conciergeChips: [
      'How much history do we need before a model is worth building?',
      'Do we need a data warehouse in place before you can start?',
      'How would we know the model is still right in six months?',
      'Can you explain a prediction to a regulator?',
      'Book a decision review',
    ],
    conciergeHeading: 'From the decision that takes too long to a solution direction',
    conciergeIntro: 'Describe the decision you want to make faster and the data you already hold about it, and eQORE will tell you which modeling approach applies, what it would take to get there, and where the honest answer is that a model will not help.',

    // ── FAQ ──────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the questions asked in a first call.
    customFAQs: [
      {
        q: 'How much data do we need before a model is worth building?',
        a: 'It depends far more on how often the thing you are predicting happens than on how many rows you hold. Ten million transactions containing forty instances of the fraud pattern you care about is a small dataset for that problem, and a hundred thousand rows with a well-balanced outcome is often plenty.\n\nThe practical floor for most classification work is a few hundred examples of the rarer class, and enough history to cover at least one full cycle of whatever seasonality your business has. Predicting retail demand from nine months of data means the model has never seen a Christmas.\n\nIf you are below that, the useful move is usually not a model. It is instrumenting the process so the data exists in a year, which is a cheaper project and a prerequisite either way.',
        sources: [
          { label: 'scikit-learn: cross-validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html' },
        ],
      },
      {
        q: 'Do we need a data warehouse in place before you can start?',
        a: 'No, and waiting for one is a common way to lose a year. A first model can be built against extracts, and the work of building it tells you which tables actually matter, which is better warehouse requirements than a workshop produces.\n\nWhat you do need is the ability to get the same data again on a schedule. A model trained on a one-off export that nobody can reproduce is a demonstration, not a system, and the gap between those two is where most of the cost sits.\n\nWhere a warehouse genuinely blocks us is when the same entity is identified differently in each source and there is no agreed key. That is a data problem no model solves, and it surfaces in week one rather than month six.',
        sources: [
          { label: 'Hidden Technical Debt in Machine Learning Systems (NeurIPS)', url: 'https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html' },
        ],
      },
      {
        q: 'How would we know the model is still right in six months?',
        a: 'Because it is monitored per segment, and because somebody owns the alert. Both halves matter: monitoring nobody reads is the same as no monitoring, and an aggregate accuracy number is the last place a problem becomes visible.\n\nWhat we watch is the input distribution as well as the output. Input drift arrives first and is the earlier warning, since a model whose incoming data has shifted is already wrong before the accuracy metric catches up.\n\nRetraining is then triggered by measured degradation rather than by the calendar. Quarterly retraining is a habit, not a control; it retrains models that were fine and leaves the one that broke in week two running.',
        sources: [
          { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
        ],
      },
      {
        q: 'Can you explain a prediction to a regulator?',
        a: 'Yes, provided the requirement is stated before the model is chosen rather than after. Explainability is a design constraint: it rules some model families in and others out, and retrofitting an account of an opaque model is where these projects usually stall.\n\nIn practice that means feature contributions shipped alongside the prediction, so the person acting on it can see what drove it, and adverse action reasons produced in the same call where the decision affects an individual.\n\nUnder the EU AI Act, credit scoring and several other uses are classified high-risk, which brings documentation, logging and human oversight obligations that are much cheaper to build in than to add later.',
        sources: [
          { label: 'EU AI Act', url: 'https://artificialintelligenceact.eu/the-act/' },
          { label: 'Kangqore AI Governance', url: '/services/ai-governance' },
        ],
      },
      {
        q: 'What is the difference between this service and your MLOps service?',
        a: 'This service decides what to model, builds it and proves whether it works. MLOps is the machinery that keeps models running once there are several of them: registries, pipelines, reproducible retraining, rollback.\n\nA first model does not need that machinery, and buying it early is a common way to spend six months on infrastructure before answering whether the model is any good. The signal that you need it is usually the third or fourth model, or the first one somebody outside the team depends on.\n\nMost engagements start here and move there. Deciding you need both on day one is a decision to defer the only question that matters, which is whether the prediction changes anything.',
        sources: [
          { label: 'Kangqore MLOps', url: '/services/mlops' },
        ],
      },
      {
        q: 'Do you use classical models or deep learning?',
        a: 'Whichever wins on your data, and on tabular data that is usually a gradient-boosted tree. XGBoost, LightGBM and CatBoost remain hard to beat on structured business data, and they are cheaper to serve and far easier to explain.\n\nDeep learning earns its place when the input is genuinely high-dimensional: images, audio, free text, long sequences. Applied to a spreadsheet it costs more, explains less and rarely improves on the boosted tree.\n\nWe set a baseline first, usually something deliberately simple, and require anything more complex to beat it by enough to justify the operational cost. A model two points better and four times slower is not better.',
        sources: [],
      },
      {
        q: 'What happens when accuracy drops after deployment?',
        a: 'First we establish which of three things happened, because the fixes are unrelated. The input data changed, the world changed, or the pipeline broke. Pipeline breakage is the most common and the least interesting, and it looks exactly like model decay from the outside.\n\nIf the world genuinely moved, retraining on recent data is usually the answer, and the confidence threshold may need moving with it so more cases route to a person while the new pattern is still thin.\n\nThe case that needs care is a model still accurate in aggregate but degraded for one segment. That is the failure mode monitoring is built to catch, and the one an overall score hides for longest.',
        sources: [
          { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
        ],
      },
      {
        q: 'Can you work with our existing data science team, or do you replace them?',
        a: 'Work with them, and in most engagements they already know what should be built. What is usually missing is not talent but the path from a validated notebook to something running, which is engineering rather than statistics and tends to sit between two job descriptions.\n\nThe split that works is that your team owns the domain judgment -- which decisions matter, what a wrong answer costs, which features mean something -- and we own the production path and the monitoring. Where an internal team has no modeling capacity yet, we build the first one end to end and hand it over with the code.\n\nThe arrangement that does not work is us building in isolation and presenting a result. Models built that way are accurate and unused, because nobody internally can defend them when somebody asks why.',
        sources: [],
      },
      {
        q: 'What does this cost, and what drives the number?',
        a: 'The five packages above are the honest answer to shape and duration. What moves the number inside them is almost never the modeling; it is the state of the data and how many systems have to be touched to get a prediction in front of a person.\n\nA feasibility model against data already in one warehouse is the cheap end. The expensive end is the same model where the entity you are predicting about is identified differently in four systems with no agreed key, because that is integration work wearing a data science label and it is better to know that in week one.\n\nWe scope the decision review first for exactly this reason. Two weeks of looking at your data is a cheaper way to find out that a project is a six-month integration than six months is.',
        sources: [],
      },
      {
        q: 'Who owns the model after handover?',
        a: 'You do, including the training code, the feature definitions, the evaluation results and the runbook. We do not hold a model behind an interface you cannot inspect, and nothing here requires our involvement to retrain.\n\nHandover means a repository somebody other than the author can run, tests that fail when the data shape changes, and a written account of what the model does badly. That last document is the one teams skip and the one that matters when a prediction is questioned.\n\nWhere we stay involved it is because you asked for monitoring or a retraining cadence to be run, not because the artifacts are ours.',
        sources: [],
      },
    ],

    // ── Engagement packages ──────────────────────────────────────────────────
    servicePackages: [
      {
        name: 'Decision Review',
        description: 'Two weeks. Which decisions in your business would move if a prediction existed, and which would not.',
        duration: '2 weeks',
        tier: 'Entry',
        deliverables: ['Decision inventory ranked by value of being right', 'Data legibility assessment per candidate', 'An honest list of what a model cannot help with', 'Recommended first build'],
      },
      {
        name: 'Feasibility Model',
        description: 'Four to six weeks. One model, built properly, evaluated honestly, with the answer allowed to be no.',
        duration: '4-6 weeks',
        tier: 'Proof',
        deliverables: ['Baseline and candidate models', 'Per-segment accuracy and confidence thresholds', 'Cost of false positives and negatives in your terms', 'Go or no-go with the reasoning'],
      },
      {
        name: 'Production Build',
        description: 'Eight to twelve weeks. The model behind an endpoint, wired into the decision, with monitoring somebody owns.',
        duration: '8-12 weeks',
        tier: 'Build',
        deliverables: ['Deployed model and serving path', 'Per-segment drift monitoring and alerting', 'Explainability output shipped with each prediction', 'Runbook and handover'],
      },
      {
        name: 'Model Portfolio',
        description: 'Ongoing. Several models in production, retrained on measured degradation rather than on a calendar.',
        duration: 'Ongoing',
        tier: 'Scale',
        deliverables: ['Registry and reproducible retraining', 'Per-model accuracy and drift reporting', 'Retraining triggered by degradation', 'Quarterly portfolio review'],
      },
      {
        name: 'Model Audit',
        description: 'Three weeks. An independent read on models you already run, including the ones nobody has validated since launch.',
        duration: '3 weeks',
        tier: 'Assurance',
        deliverables: ['Re-validation on current data', 'Leakage and drift findings', 'Explainability and documentation gaps', 'Remediation plan by severity'],
      },
    ],


    // The template default compares RULES-BASED AUTOMATION with AGENTIC AI and
    // explains that "an agentic system evaluates the current state against a
    // goal" -- an argument for a different service, rendered under a heading
    // about data science.
    comparisonTable: {
      eyebrow: 'WHERE THESE PROGRAMS STALL',
      heading: 'The gap is not modeling. It is everything after it.',
      lede: 'Both columns describe competent statistical work. They differ in whether anything downstream of the model was built.',
      beforeLabel: 'ANALYSIS THAT STOPS AT THE DECK',
      afterLabel: 'MODELS THAT RUN THE DECISION',
      afterBadge: 'KANGQORE',
      beforeShort: 'DECK',
      afterShort: 'PRODUCTION',
      rows: [
        {
          dimension: 'What is delivered',
          before: 'A slide carrying an accuracy score, and a recommendation nobody owns.',
          after: 'A model behind an endpoint, the decision it feeds, and the person accountable for that decision named.',
        },
        {
          dimension: 'Whether it survives new data',
          before: 'Validated once against whatever sample was available, then trusted indefinitely.',
          after: 'Monitored per segment, because an aggregate score stays flat while one population quietly drifts.',
          link: { label: 'Analytics', to: '/services/analytics' },
        },
        {
          dimension: 'Who can explain a result',
          before: 'The analyst who built it, if they still work here.',
          after: 'Feature contributions ship with the prediction, so the person acting on it can see what drove it.',
          link: { label: 'AI Governance', to: '/services/ai-governance' },
        },
        {
          dimension: 'Cost of being wrong',
          before: 'Discovered when somebody finally questions the number, which is usually late.',
          after: 'Bounded up front: a confidence threshold decides which cases the model answers and which go to a person.',
        },
        {
          dimension: 'What handover looks like',
          before: 'A notebook, a CSV, and a conversation you have to remember.',
          after: 'A repository, a pipeline, tests, and a runbook that someone other than the author can follow.',
          link: { label: 'MLOps', to: '/services/mlops' },
        },
      ],
    },
    hideBadgeStrip: true,
    architectureEyebrow: 'HOW A MODEL REACHES A DECISION',
    architectureTitle: 'Four stages.',
    architectureTitleHighlight: 'The last two are where projects die.',
    architectureLede: 'Feature work and model selection are the visible part and the smaller part. Validation and the monitoring that follows deployment are what decide whether the thing is still correct in six months.',
    architectureNodes: [
      {
        title: 'Data & Features',
        description: 'Where most of the accuracy actually comes from. A feature built out of your domain knowledge beats a larger model on the same data more often than vendors admit.',
        features: [
          'Source profiling and quality checks before any modeling starts',
          'Feature construction from domain knowledge, not only from columns',
          'Leakage checks, because a model that saw the future in training will look excellent and fail live',
          'A feature definition both the model and the analyst can read',
        ],
      },
      {
        title: 'Modeling',
        description: 'Chosen against cost, latency and your ability to explain the result, not only against a validation score.',
        features: [
          'Gradient-boosted trees first on tabular data, which is most enterprise data',
          'Deep learning where the input is genuinely high-dimensional',
          'A baseline you have to beat, so improvement is measurable',
          'Explainability decided before the model, not retrofitted after it',
        ],
      },
      {
        title: 'Validation',
        description: 'Where the honest answer is often that the model is not good enough yet, which is cheaper to learn here than in production.',
        features: [
          'Cross-validation on splits that respect time, so the past does not leak into the future',
          'Per-segment accuracy, not a single aggregate number',
          'A confidence threshold set deliberately, deciding what routes to a person',
          'Cost of a false positive and a false negative stated in your terms, not in F1',
        ],
      },
      {
        title: 'Deployment & Monitoring',
        description: 'The stage that turns a result into a decision, and the one most often scoped out of the original project.',
        features: [
          'The prediction delivered where the decision is made, not into a separate dashboard',
          'Drift watched per segment, with an alert somebody owns',
          'Retraining triggered by measured degradation rather than by calendar',
          'A runbook for the day the model is wrong and someone has to answer for it',
        ],
      },
    ],

    // The parity default named six industries but described them through
    // "Risk Auditor Agent" and "Regulatory Compliance Agent" -- agentic naming
    // on a data science page. `items` rather than `agents` keeps the neutral key.
    industryHeading: 'Models built for',
    industryHeadingHighlight: 'the decision your sector makes.',
    industryLede: 'The modeling technique travels between industries. What does not travel is the cost of being wrong, and that is what sets the threshold.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Credit risk, fraud and early-warning models where the regulator will ask how a decision was reached.',
        items: ['Probability-of-default and IFRS 9 staging models', 'Fraud scoring tuned so the review queue is workable', 'Adverse action reasons produced with the score'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Readmission risk, trial recruitment and demand models where a clinician stays in the loop by design.',
        items: ['Readmission and deterioration risk scoring', 'Protocol-matched patient shortlists with the supporting record', 'Capacity and demand forecasting by site'],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'Yield, demand and failure prediction against sensor histories that were never collected for modeling.',
        items: ['Demand forecasting at SKU and plant level', 'Yield and scrap-rate drivers ranked by contribution', 'Failure prediction where the labels are sparse'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Pricing, churn and assortment models measured on margin rather than on click-through.',
        items: ['Price elasticity by product and channel', 'Churn scoring early enough to act before renewal', 'Lifetime value used for spend allocation'],
      },
      {
        industry: 'Insurance',
        headline: 'Pricing, reserving and claims triage where the model has to be explainable to an actuary and an auditor.',
        items: ['Technical pricing and rating factor analysis', 'Reserving support with uncertainty stated', 'Claims triage routing the marginal cases to a person'],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'Load forecasting and asset failure prediction where a wrong call has a physical cost.',
        items: ['Short and medium-term load forecasting', 'Asset failure prediction on unbalanced data', 'Network loss and anomaly detection'],
      },
    ],

    capabilitiesLabel: 'DATA SCIENCE & AI SERVICES',
    capabilitiesSectionTitle: 'Our',
    capabilitiesSectionHighlight: 'Capabilities.',
    // ── Capability areas ────────────────────────────────────────────────────
    // Taxonomy and sub-capability NAMES are unchanged: they are the searchable
    // register and they feed 30 Offer objects in the OfferCatalog JSON-LD. Only
    // the prose is new. The supplied copy measured 2.55 per cent boilerplate
    // with almost no second person, against 0.3 in the FAQ on the same page.
    //
    // Three of these five areas overlap sibling services outright -- generative
    // AI, MLOps and AI governance each have their own page. Rather than delete
    // taxonomy unilaterally, each now states the data-science slice it covers
    // and links to the service that owns the rest, which also stops the two
    // pages competing for the same query.
    capabilityAreas: [
      {
        title: 'Data Engineering & Modern Data Platforms',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The part of a modeling project that takes the time. Most of what looks like a modeling problem turns out to be a join nobody could make reliably.',
        items: [
          'Real-Time & Batch Data Engineering: Pipelines that deliver the same fields tomorrow that they delivered today. A model trained on an extract nobody can reproduce is a demonstration, not a system.',
          'Data Lakehouse & Warehouse Architecture: Storage shaped around the questions you actually ask. Designing it around every question you might one day ask is how these programs stall for a year.',
          'Event Streaming & Data Integration: Continuous ingestion where a prediction has to arrive while the decision is still open. Batch is cheaper and correct more often than people expect.',
          'Data Quality Engineering: Automated validation and profiling, because a silent schema change upstream looks exactly like model decay from the outside and is far more common.',
          'Data Lineage & Cataloging: Knowing which source produced a value, which is the first question asked when somebody disputes a prediction and the hardest to answer after the fact.',
          'Data Architecture: Structure that survives the second and third use case. The first model rarely justifies it; the fourth always does.',
        ],
      },
      {
        title: 'Machine Learning & Predictive Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The core of this service. Models chosen against what you pay, what your users wait for, and whether you can explain the answer.',
        items: [
          'Predictive Modeling & Forecasting: Forecast the thing you will act on rather than the thing easiest to predict. A churn model that lands after the renewal date has answered the wrong question precisely.',
          'Classification & Anomaly Detection: Detection tuned so the review queue is one a person can work through. Threshold placement is the real work, because an alert nobody trusts is worse than none.',
          'Recommendation Intelligence: Ranked with the reason attached. A recommendation nobody can interrogate is one nobody follows twice.',
          'Statistical & Quantitative Modeling: Quantify how confident the answer is, not only what it is. Where evidence is thin, the honest output is a wide interval rather than a precise-looking number.',
          'Feature Engineering & Model Development: Usually where the accuracy actually comes from. A feature built from your domain knowledge beats a larger model on the same data more often than vendors admit.',
          'Decision Intelligence: The step from a prediction to an action somebody signs. Most analytics investment stops one short of it.',
        ],
      },
      {
        title: 'Generative AI & Intelligent Systems',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where a language model is the right tool for a data problem. Retrieval and grounding as a whole practice live on the generative AI page; this is the overlap.',
        items: [
          'Enterprise Copilots & AI Assistants: Assistants over your own numbers, answering from the warehouse rather than from training data.',
          'Retrieval-Augmented Generation (RAG): Grounding an answer in documents you control. Built in depth on the generative AI service; used here when the question spans text and tables at once.',
          'Knowledge Intelligence: Structuring relationships your data assumes but never states, so retrieval can follow them rather than matching strings.',
          'Domain-Specific Generative AI: Tuned on your vocabulary, for the cases where a general model degrades quietly on your product codes and shorthand.',
          'Experiment Design & Causal Inference: Establish whether a change caused an outcome or merely accompanied it, using controlled experiments where they are possible and quasi-experimental methods where they are not.',
          'AI Workflow Automation: Putting a model output where the work already happens. A prediction in a separate dashboard is a prediction nobody opens.',
        ],
      },
      {
        title: 'MLOps & AI Lifecycle Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What a first model needs, which is much less than a portfolio needs. The full platform is a separate service, and buying it on day one defers the only question that matters.',
        items: [
          'AI Deployment Pipelines: A path from a repository to a served model that somebody other than the author can run.',
          'Model Lifecycle Management: Knowing which version answered which request, which becomes urgent the first time a prediction is disputed.',
          'Model Versioning & Registry: Reproducing the model now in production. Added late, nobody can; added early, it costs an afternoon.',
          'AI Performance Monitoring: Accuracy watched per segment. An aggregate number holds steady while the segment you care about degrades underneath it.',
          'Drift Detection & Continuous Learning: Retraining triggered by measured degradation rather than by calendar. Quarterly retraining is a habit, not a control.',
          'Observability: Latency, cost and failure surfaced next to accuracy, since a model too slow to use is as broken as one that is wrong.',
        ],
      },
      {
        title: 'AI Governance & Responsible AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The obligations that attach to a model once it decides something about a person. Regulation, audit and control design are their own service; this is what a modeling engagement owes them.',
        items: [
          'Responsible AI Practices: Decided before the model is chosen, because the requirement rules some model families out and retrofitting an explanation is where projects stall.',
          'Fairness & Bias Management: Measured per protected group rather than assumed from an aggregate score, and stated in terms somebody can act on.',
          'Explainable AI: Feature contributions shipped with the prediction, so the person acting on it can see what drove it and say so.',
          'AI Risk & Compliance: Under the EU AI Act, credit scoring and several other uses are classified high-risk, which brings logging and oversight duties cheaper to build in than to add.',
          'Audit Controls: A record of what the model saw and returned, produced as a by-product rather than reconstructed under pressure.',
          'Privacy & Data Protection: What the model is allowed to learn from, agreed before training rather than during a review.',
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
      { illustrative: true, title: 'Use-Case Triage',   desc: 'From your candidate list to a scored shortlist. Which use cases have the evidence to be grounded, and which do not.',                          value: '2',  suffix: ' wks', metricLabel: 'To a Scored Shortlist', icon: 'Search'      },
      { illustrative: true, title: 'First Workflow',    desc: 'One workflow taken to production on your corpus, with retrieval, guardrails, an evaluation set and cost telemetry in place.',                   value: '8',  suffix: ' wks', metricLabel: 'To Production',        icon: 'Rocket'      },
      // Named "Toolchain Layers", not "Layers Standardized": the architecture
      // section on the same page is headed "The 4-Layer Stack", and two
      // different counts under one word read as an error even though both are
      // right. These six are the toolsStack rows; those four are the
      // architectureNodes.
      { illustrative: true, title: 'Toolchain Layers',  desc: 'Models, retrieval, orchestration, guardrails, evaluation and tuning. Each carries a managed and a self-hosted option, chosen per constraint.', value: '6',  suffix: '',     metricLabel: 'Toolchain Layers',     icon: 'Layers'      },
      { illustrative: true, title: 'Cited Answers',     desc: 'Answers are returned with the passage they were drawn from, and the system declines rather than guessing when retrieval finds nothing relevant.', value: '100', suffix: '%',   metricLabel: 'Carry Their Source',   icon: 'BrainCircuit'},
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
    architectureEyebrow: 'HOW A RETRIEVAL SYSTEM IS BUILT',
    architectureTitle: 'Four layers.',
    architectureTitleHighlight: 'Each one you can inspect.',
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
      { illustrative: true, title: 'Deployment Speed', desc: 'Increase in model deployment frequency after MLOps pipeline implementation and CI/CD automation.', value: '90',  suffix: '%',    metricLabel: 'Faster Deployments',    icon: 'Zap'       },
      { illustrative: true, title: 'Infrastructure Cost',  desc: 'Reduction in operational and infrastructure costs through optimized compute and automated workflows.',  value: '50', suffix: '%',    metricLabel: 'Cost Savings', icon: 'TrendingUp'},
      { illustrative: true, title: 'Production Incidents', desc: 'Reduction in model drift and production failures through proactive monitoring and automated alerts.', value: '95', suffix: '%',    metricLabel: 'Incident Reduction',      icon: 'Target'    },
      { illustrative: true, title: 'Engineering Velocity',   desc: 'End-to-end acceleration of machine learning development and production release cycles.',      value: '3',  suffix: '×', metricLabel: 'Velocity Boost',     icon: 'Layers'    },
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
    architectureEyebrow: 'HOW A MODEL REACHES PRODUCTION',
    architectureTitle: 'The path from notebook',
    architectureTitleHighlight: 'to something on call.',
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
    // This is the data-speakable sentence — the one a voice assistant reads
    // out of 5,000 words — and it was a tagline any competitor could print.
    shortDescription: 'Kangqore helps you adopt AI and GenAI without inheriting the operational, compliance and reputational risk that usually arrives with it.',
    fullDescription: 'Kangqore enables organizations to adopt, scale, and operationalize AI responsibly by embedding governance, transparency, and control across the entire AI lifecycle.',
    fullDescriptionMaxWidth: 'max-w-[700px]',
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
    // Was "AI Governance That Builds Trust & Mitigates Risk." — a sentence
    // every governance vendor can run verbatim. Modeled on the equivalent
    // section of /services/genai-business-services, whose heading states what
    // the system does ("Generative AI that answers from your evidence") rather
    // than what it is for. The through-line of this whole page is evidence:
    // the comparison table's winning column, the toolchain heading, and the
    // engagement deliverables all argue it. The heading now says so.
    whatIsTitle: 'Kangqore manages the risks',
    whatIsTitleLine2: 'of adopting and using AI and',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'GenAI.',
    whatIsPara2: 'We start from which regulatory requirements and industry standards actually apply to you, then build the controls that satisfy them: risk tiering against the EU AI Act, a model registry carrying owners and lineage, explainability wired into the serving path rather than produced afterwards, drift and fairness testing on a schedule, and policy enforced in the request path rather than published beside it.',

    toolsStack: {
      title: 'eQORE™ Enterprise AI Governance Matrix',
      subtitle: 'NIST & EU AI Act Compliant Framework',
      items: [
        {
          icon: 'Shield',
          title: 'Risk Tiering',
          desc: 'ISO / EU AI Act tiering. We start by categorizing models by risk, applying controls relative to their impact and exposure.',
        },
        {
          icon: 'Search',
          title: 'Explainability',
          desc: 'SHAP & Lineage mapping. Every output can be traced back to its inputs and the reasoning path that generated it.',
        },
        {
          icon: 'CheckCircle',
          title: 'Policy Gate',
          desc: 'Pre-action check. Operational policies enforce limits on data access and tool usage before an action executes.',
        },
        {
          illustrative: true,
          icon: 'BarChart2',
          title: 'Audit Ready',
          desc: '100% Covered. Immutable logs generated continuously, turning compliance into an operational byproduct rather than a retrospective project.',
        },
      ],
    },
    // The Read More break lands here, after a complete thought. The four
    // exposures are split across para3 and para4 so the collapsed state ends
    // on a full sentence rather than mid-clause.
    whatIsPara3: 'Governance only pays for itself when it is aligned to what the business is actually trying to do, and there are four exposures worth naming separately. Operational, when a model degrades and nobody notices.',

    // The honest limit. Governance pages rarely admit that controls have a cost.
    whatIsPara4: 'Compliance, when a system is in scope and you cannot show it. Reputational, when a decision cannot be explained to the person it affected. And commercial, when controls slow every release equally regardless of the risk attached to it.',
    whatIsPara5: 'So controls are sized to the tier, and the evidence is written as the system runs rather than assembled before an assessment. A low-risk system gets an owner and monitoring; a high-risk one gets the documentation pack. Governance that treats everything as critical is routed around within two quarters, and what survives is the set of approvals people still read.',
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
    architectureEyebrow: 'HOW GOVERNANCE IS ENFORCED',
    architectureTitle: 'Controls that run,',
    architectureTitleHighlight: 'not controls that are written down.',
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
      { illustrative: true, title: 'Audit Readiness',       desc: 'EU AI Act and regulatory audit readiness achieved across all production AI models through centralized governance and risk tiering.',            value: '100', suffix: '%',    metricLabel: 'Audit Readiness',         icon: 'ShieldCheck'  },
      { illustrative: true, title: 'Incident Reduction',    desc: 'Reduction in critical model incidents through real-time drift detection, bias monitoring, and human-in-the-loop approval workflows.',       value: '95',  suffix: '%',    metricLabel: 'Incident Risk Reduced',   icon: 'Activity'     },
      { illustrative: true, title: 'Compliance Coverage',   desc: 'Enterprise AI models covered by automated governance controls, explainability layers, and compliance validation frameworks.',                value: '100', suffix: '%',    metricLabel: 'Model Coverage',          icon: 'Target'       },
      { illustrative: true, title: 'Security Breaches',     desc: 'Unauthorized AI actions and data leakage events prevented through Zero-Trust architecture and cryptographic audit controls.',                value: '0',   suffix: '',     metricLabel: 'Security Breaches',       icon: 'Lock'         },
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
    shortDescription: 'Kangqore builds the analytics ladder on one agreed set of definitions, so the number survives being questioned and the decision it supports actually changes.',
    fullDescription: 'Kangqore transforms fragmented enterprise data into trusted intelligence, predictive foresight, and actionable decisions that drive measurable business outcomes.',
    keyFeatures: ['Business intelligence', 'Dashboard development', 'KPI tracking', 'Self-service analytics', 'Data storytelling'],
    relatedServiceSlugs: ['big-data', 'data-science-ai'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    // "Drives decisions" is what every analytics vendor says. "Measured in"
    // states what success is and is falsifiable, which is the argument the
    // comparison section and the closing CTA both make. Seven words to six.
    whatIsTitle: 'Analytics that turns your',
    whatIsTitleLine2: 'data into decisions',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'you can defend.',
    whatIsPara2: 'Kangqore builds analytics ecosystems where every stakeholder has the right data at the right time — from executive KPI dashboards to operational reports and governed self-service insight layers across the enterprise.',
    businessMetrics: [
      { illustrative: true, title: 'Reporting Speed',  desc: 'Reduction in reporting cycle time after self-service BI and automated dashboard deployment.',                        value: '75',  suffix: '%', metricLabel: 'Faster Reporting',        icon: 'Zap'       },
      { illustrative: true, title: 'User Empowerment', desc: 'Business users independently exploring data without engineering support after self-service analytics rollout.',    value: '5',   suffix: 'x', metricLabel: 'More Self-Service Users', icon: 'TrendingUp'},
      { illustrative: true, title: 'KPI Visibility',   desc: 'Real-time KPI dashboards deployed across business units with a governed, single source of truth data layer.',     value: '100', suffix: '%', metricLabel: 'KPI Coverage',            icon: 'Target'    },
      { illustrative: true, title: 'Decision Quality', desc: 'Improvement in decision quality scores after analytics platform deployment, measured via decision audit outcomes.', value: '41',  suffix: '%', metricLabel: 'Better Decisions',        icon: 'BarChart3' },
    ],
    hidePartnershipModel: true,

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Ten questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the questions analytics buyers open with, including the
    // ones that suggest the answer is not more analytics.
    customFAQs: [
      {
        q: 'Why do our four teams have four different revenue numbers?',
        a: 'Because the definition lives in four places. Finance excludes intercompany, sales counts bookings, the product team counts recognized revenue and the board pack uses whichever was available on the Friday. Every one of them is internally correct, which is why the meeting never resolves it.\n\nThis is not a data quality problem and no amount of dashboard work fixes it. The fix is a semantic layer: one definition, expressed once in code, that every report and every tool reads from. Your argument moves from the meeting to a pull request, where it belongs.\n\nThe hard part is not technical. It is getting your four function heads to agree which definition is the company definition, and that is a conversation we can facilitate but cannot have on your behalf.',
        sources: [],
      },
      {
        q: 'Do we actually need a semantic layer, or is that just tooling fashion?',
        a: 'You need one the moment more than one of your tools reads the same metric. Below that it is overhead. Above it, the absence is what produces the four-numbers problem, and the cost of retrofitting rises with every report already built on the old logic.\n\nWhat it is, concretely: metric definitions in version control, tested, with lineage, so a change is reviewed rather than discovered. dbt is the common implementation; LookML and Cube solve the same problem differently.\n\nWhere it is genuinely premature: a single team, one BI tool, under about twenty metrics. There the definition fits in somebody\'s head and formalizing it early costs more than it returns.',
        sources: [],
      },
      {
        q: 'How much of this needs to be real-time?',
        a: 'Far less than most roadmaps assume. The test is whether one of your decisions changes if the number arrives an hour later. For fraud, network operations, inventory during a promotion and live pricing, it does. For almost all management reporting, it does not.\n\nStreaming carries a real cost: more infrastructure, harder correctness, and a class of failure that batch does not have. Buying it for reporting your team reads at nine the next morning is the most common overspend in this category.\n\nWe usually recommend batch for the estate and streaming for the specific two or three decisions where latency has a measurable cost.',
        sources: [],
      },
      {
        q: 'Our BI tool is fine. Is the tool the problem?',
        a: 'Usually not. Power BI, Tableau and Looker are all capable of a good analytics estate, and swapping between them rarely changes the outcome. Tool migrations are popular because they are visible and fundable, and they leave your actual problem untouched.\n\nThe things that decide whether analytics works sit underneath: whether metric definitions are shared, whether the data arrives on a schedule people trust, whether anyone can trace a number back to source, and whether a decision changes at the end.\n\nIf you are mid-migration and it is already committed, we will work in whichever tool you land on. We would rather spend the budget on the semantic layer.',
        sources: [],
      },
      {
        q: 'What is the difference between this and your Big Data service?',
        a: 'Analytics is the insight ladder: understand, anticipate, decide, respond. Big Data is the platform underneath it — ingestion, storage, distributed processing, the engineering that makes large or fast data tractable in the first place.\n\nYou almost certainly need less of the second than you think. A large share of estates running a lakehouse would be faster and cheaper on a well-indexed warehouse, and the platform work gets bought because it is concrete while the definitional work is not.\n\nThe honest sequence is usually analytics first. Building a platform before knowing which decisions matter produces an expensive foundation under an empty building.',
        sources: [
          { label: 'Kangqore Big Data', url: '/services/big-data' },
        ],
      },
      {
        q: 'How do you stop us building another dashboard nobody opens?',
        a: 'By starting from the decision rather than the data. The first question is which of your recurring decisions would change if a number existed, who makes it, and on what cadence. If nobody can name the decision, the dashboard has no owner and will not be opened twice.\n\nEvery surface we build gets a named owner and a stated decision it supports. Anything that fails that test does not get built, which is a shorter backlog and an unpopular conversation early rather than a wasted quarter later.\n\nWe also recommend retiring surfaces on a schedule. Your estate accumulates dashboards the way a codebase accumulates dead code, and nobody is ever incentivized to delete one.',
        sources: [],
      },
      {
        q: 'Can business users self-serve without it turning into chaos?',
        a: 'Yes, but only on top of governed definitions. Self-service over raw tables is how the four-numbers problem is manufactured at scale — everybody can now build a report, and every report is subtly different.\n\nThe workable model is a curated layer: certified metrics and datasets that anyone can slice freely, with the definitions locked. Your users get genuine freedom over dimensions and filters, and none to redefine revenue.\n\nThe governance that makes this safe is unglamorous — certification, ownership, deprecation — and it is the part that gets cut when timelines tighten. It is also the part that decides whether self-service helps.',
        sources: [],
      },
      {
        q: 'How long before we see anything useful?',
        a: 'Weeks before one of your decisions changes, not quarters. The advisory pass is two weeks and identifies which decisions are worth instrumenting; a first governed metric with a working surface behind it is typically four to six.\n\nWhat takes longer is the semantic layer across a real estate, because it is as much organizational agreement as engineering. Expect that to run in parallel over months rather than blocking the first delivery.\n\nIf a proposal promises a full enterprise analytics platform in a quarter, the platform is being confused with the agreement, and the agreement is the slow part.',
        sources: [],
      },
      {
        q: 'Who owns a metric definition after you leave?',
        a: 'You do, and it should be a named person per metric rather than a team. Definitions your whole team owns will drift, because nobody has standing to refuse a change.\n\nEverything ships in your repository: the transformation code, the tests, the lineage and the documentation of what each metric deliberately excludes. That exclusion list is the part your team will skip and the part that matters when somebody asks why two of your numbers differ.\n\nWhere we stay involved it is because you asked us to run the pipeline, not because the definitions are ours.',
        sources: [],
      },
      {
        q: 'What happens when somebody disputes a number?',
        a: 'You trace it rather than defend it. Lineage from the surface back to source means the question is answerable in minutes: this figure came from these rows, transformed by this logic, which excludes these cases by design.\n\nWithout lineage the dispute becomes a reconciliation exercise that costs more than the original analysis and usually ends with the more senior person\'s number winning. That outcome is how analytics loses credibility inside your organization.\n\nSo lineage is not a governance nicety. It is what makes an analytical output survive contact with a disagreement.',
        sources: [],
      },
    ],



    heroTitle: 'Enterprise Analytics\nServices for Better Decisions',
    fullDescriptionMaxWidth: 'max-w-[700px] xl:max-w-[780px]',
    heroBadge: 'Understand. Anticipate. Decide.',
    heroStripItems: [
      'KPI & Performance Analytics', 'Forecasting', 'Decision Intelligence', 'Streaming Analytics',
      'Semantic Modeling', 'Self-Service BI', 'Data Lineage', 'Embedded Analytics',
    ],

    // ── What this actually is ───────────────────────────────────────────────
    whatIsPara2: 'The ladder is well understood: descriptive tells you what happened, diagnostic why, predictive what is likely, prescriptive what to do about it. What separates programs is not which rung you reach but whether anything downstream of the number actually changes.',

    whatIsPara3: 'Most analytics estates fail in the same place, and yours will tell you which one within a week. The modeling is fine and the dashboards are competent, but four teams hold four definitions of revenue, the alert arrives after the shift it was about, and a new question takes two weeks and a ticket. None of that is an analytics problem in the technical sense, which is exactly why more dashboards never fix it.',

    whatIsPara4: 'So the work runs in both directions. Upward through the ladder toward prediction and decision support, and downward into the semantic layer, the lineage and the governance that make an answer defensible when somebody disputes it. Analytics that cannot be checked gets overruled by whoever is most senior in the room.',

    // ── Comparison ──────────────────────────────────────────────────────────
    // The parity default compares TRADITIONAL AI with AGENTIC AI, which is an
    // argument for a different service entirely.
    comparisonTable: {
      eyebrow: 'WHERE ANALYTICS PROGRAMS STALL',
      heading: 'Enterprise Reference Architecture\nmodels for Analytics',
      lede: 'Both columns describe competent analytical work. They differ in whether a decision changes at the end of it.',
      beforeLabel: 'REPORTING',
      afterLabel: 'DECISION INTELLIGENCE',
      afterBadge: 'KANGQORE',
      beforeShort: 'REPORTING',
      afterShort: 'DECISIONS',
      rows: [
        {
          dimension: 'What gets delivered',
          before: 'A dashboard, and a training session nobody attends twice.',
          after: 'A decision that changes, with the metric definition agreed and somebody owning it.',
        },
        {
          dimension: 'Where the number comes from',
          before: 'Four teams hold four definitions of revenue, reconciled live in the meeting.',
          after: 'One semantic layer. The definition lives in code and every surface reads the same one.',
        },
        {
          dimension: 'When it arrives',
          before: 'Overnight batch, so the alert lands after the shift it was about.',
          after: 'Matched to the decision cycle — streaming where that matters, batch where it does not.',
        },
        {
          dimension: 'Who can answer a new question',
          before: 'The analytics team, in two weeks, through a ticket queue.',
          after: 'The person who has the question, in the tool they already have open.',
        },
        {
          dimension: 'When somebody disputes the number',
          before: 'A reconciliation exercise that takes longer than the original analysis.',
          after: 'Lineage back to source, so the answer is checkable rather than defended.',
          link: { label: 'Big Data', to: '/services/big-data' },
        },
      ],
    },

    // ── Architecture: the enterprise analytics lifecycle ────────────────────
    // The parity default rendered "Policy & Ethics Layer" and "Control &
    // Orchestration Engine" -- the governance stack, on an analytics page.
    // These five stages are the lifecycle: the seven capability areas above
    // describe what we do, these describe the order it happens in.
    architectureEyebrow: 'THE ENTERPRISE ANALYTICS LIFECYCLE',
    architectureTitle: 'Data becomes a decision',
    architectureTitleHighlight: 'in five stages, not one.',
    architectureLede: 'Insight, prediction, decision, action, outcome — then the outcome feeds back and the model learns. The loop is the point; a dashboard is one frame of it.',
    architectureNodes: [
      {
        title: 'Understand',
        icon: 'Search',
        description: 'Descriptive and diagnostic. What happened, and the drivers behind it — the stage most estates never get past.',
        features: [
          'KPI and metric frameworks agreed across functions',
          'Trend, variance and exception analysis',
          'Root-cause and driver analysis',
          'One definition per metric, not one per team',
        ],
      },
      {
        title: 'Anticipate',
        icon: 'TrendingUp',
        description: 'Predictive and forecasting. What is likely to happen, delivered early enough that somebody can still act on it.',
        features: [
          'Time-series and demand forecasting',
          'Churn, risk and propensity models',
          'Scenario and what-if analysis',
          'Early-warning thresholds owned by a named team',
        ],
      },
      {
        title: 'Decide',
        icon: 'Target',
        description: 'Prescriptive and decision intelligence. Which action, given the budget, capacity and regulation you actually have.',
        features: [
          'Optimization against real constraints',
          'Scenario simulation before committing',
          'Recommendations with the reason attached',
          'Decisions wired into the operating workflow',
        ],
      },
      {
        title: 'Respond',
        icon: 'Zap',
        description: 'Real-time and cognitive. Events read as they arrive, including the unstructured material a batch report never touches.',
        features: [
          'Event-stream processing and live monitoring',
          'Anomaly detection with a workable alert rate',
          'Text, speech, image and graph analytics',
          'Triggers that reach the system that can act',
        ],
      },
      {
        title: 'Govern & scale',
        icon: 'ShieldCheck',
        description: 'The foundation underneath all four. Lineage, quality and controls, without which every number above is arguable.',
        features: [
          'Semantic modeling and analytics data products',
          'Lineage from surface back to source',
          'Data quality and observability',
          'Access, privacy and audit controls',
        ],
      },
    ],

    // ── Industry ────────────────────────────────────────────────────────────
    industryHeading: 'Analytics built for',
    industryHeadingHighlight: 'the decisions your sector makes.',
    industryLede: 'The ladder is the same everywhere. What differs is which decision is worth instrumenting first, and how fast the answer has to arrive to still be useful.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Numbers that an auditor, a regulator and a trading desk all have to accept as the same number.',
        items: ['Risk and exposure reporting', 'Customer profitability analysis', 'Regulatory and management reporting'],
      },
      {
        industry: 'Insurance',
        headline: 'Loss ratios, reserving and pricing where the analysis has to be explainable to an actuary.',
        items: ['Loss ratio and combined ratio analytics', 'Claims cost driver analysis', 'Pricing and portfolio steering'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Operational visibility across sites where the data was collected for care, not for analysis.',
        items: ['Capacity and flow analytics', 'Clinical outcome and quality reporting', 'Cost-per-case analysis'],
      },
      {
        industry: 'Manufacturing & Supply Chain',
        headline: 'Demand, yield and inventory decisions taken weekly against data that moves hourly.',
        items: ['Demand forecasting by SKU and site', 'OEE and yield analytics', 'Inventory and service-level optimization'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Margin rather than traffic — the metric most retail dashboards are furthest from.',
        items: ['Category and margin analytics', 'Price elasticity and promotion effect', 'Customer lifetime value'],
      },
      {
        industry: 'Media & Telecommunications',
        headline: 'Churn and network economics where the useful answer is per-cohort, not per-quarter.',
        items: ['Churn and retention analytics', 'Network and capacity analytics', 'Subscriber cohort performance'],
      },
    ],

    // ── Toolchain ───────────────────────────────────────────────────────────
    // The parity default described a stack "powering cognitive computing,
    // machine learning, and AI governance" and listed PyTorch, TensorFlow and
    // Hugging Face -- an ML research stack on a business intelligence page,
    // naming not one BI or semantic-layer tool.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'What we build on,',
      titleHighlight: 'and when we would not.',
      subtitle: 'Most of this is decided by the warehouse you already run and how many people need to self-serve. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Eye',
          title: 'BI and visualization',
          managed: 'Power BI, Tableau, Looker',
          selfHosted: 'Metabase, Superset',
          desc: 'Power BI where the estate is Microsoft and the licensing is already paid. Looker where the semantic layer matters more than the chart library.',
        },
        {
          icon: 'Layers',
          title: 'Semantic and transformation layer',
          managed: 'dbt, LookML, Cube',
          selfHosted: 'The single highest-value component',
          desc: 'Where one definition of revenue actually lives. Skip it and you get four dashboards disagreeing, which is the problem people mistake for a tooling problem.',
        },
        {
          icon: 'Database',
          title: 'Warehouse and lakehouse',
          managed: 'Snowflake, BigQuery, Databricks',
          selfHosted: 'Postgres where the volume is honest',
          desc: 'Sized to the query pattern rather than the pitch deck. A large share of estates running a lakehouse would be faster and cheaper on a well-indexed database.',
          link: { label: 'Big Data', to: '/services/big-data' },
        },
        {
          icon: 'Zap',
          title: 'Streaming and events',
          managed: 'Kafka, Flink, Materialize',
          selfHosted: 'Only where the decision cannot wait',
          desc: 'Real-time is expensive and most reporting does not need it. Reached for when the alert is worthless an hour later, not because the roadmap says real-time.',
        },
        {
          icon: 'Network',
          title: 'Orchestration',
          managed: 'Airflow, Dagster, Prefect',
          selfHosted: 'Once pipelines have dependencies',
          desc: 'The point at which "a scheduled job" becomes a dependency graph somebody has to reason about. Before that it is infrastructure for two cron entries.',
        },
        {
          icon: 'Radar',
          title: 'Quality and observability',
          managed: 'Great Expectations, Monte Carlo, Soda',
          selfHosted: 'Tests on the data, not just the code',
          desc: 'Catches the silent upstream schema change, which is the most common cause of a number being wrong and the slowest to notice without it.',
        },
      ],
    },

    // ── CTAs ────────────────────────────────────────────────────────────────
    midCta: 'You have more dashboards than decisions.',
    midCtaLabel: 'Show us your reporting stack',

    closingCta: {
      title: 'One metric.',
      highlight: 'One decision that changes because of it.',
      body: 'Bring the number your leadership argues about, or the report that gets built every month and read by nobody. In 30 minutes we will tell you whether the problem is the data, the definition, or the decision nobody owns.',
      primaryLabel: 'Bring us a metric',
      secondaryLabel: 'See the five stages',
      proofLabel: 'From first call to one number everybody agrees on',
    },

    // ── Capability areas ────────────────────────────────────────────────────
    // This service had no capabilityAreas, so the whole section rendered the
    // Cognition parity default -- the AI Governance taxonomy. The page was
    // headed "Establishing Ethical Governance & Control" and "Compliance & Risk
    // Management", and its toolchain named PyTorch and TensorFlow on a business
    // intelligence page.
    //
    // Replaced with the analytics maturity ladder supplied by the business.
    // It does two jobs: it is the taxonomy every analytics buyer recognizes,
    // and it draws the line against /services/big-data -- analytics owns the
    // insight ladder, big data owns the platform underneath it. Those two pages
    // measured 81.6 per cent identical before this.
    //
    // Sub-capability names are verbatim: they are the searchable register and
    // they feed the OfferCatalog JSON-LD.
    capabilitiesLabel: 'ANALYTICS SERVICES',
    capabilitiesSectionTitle: 'Our',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'The ladder runs understand, anticipate, decide, respond — with the engineering and governance foundation that makes any of it repeatable underneath.',
    capabilityAreas: [
      {
        title: 'Descriptive & Diagnostic Analytics',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What happened, and why it happened. Historical and operational data turned into trusted views of performance, then the drivers, deviations and root causes behind them.',
        items: [
          'KPI and performance analytics',
          'Exploratory data analysis',
          'Historical and trend analysis',
          'Event and activity analysis',
          'Data mining',
          'Multidimensional analysis',
          'Operational reporting',
          'Executive reporting',
          'Business performance monitoring',
          'Root-cause analysis',
          'Variance analysis',
          'Correlation analysis',
          'Cluster analysis',
          'Customer and operational segmentation',
          'Driver analysis',
          'Anomaly investigation',
          'Performance attribution',
          'Exception analysis',
        ],
      },
      {
        title: 'Predictive Analytics & Forecasting',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What is likely to happen, early enough to do something about it. Statistical modeling and machine learning that quantify risk and opportunity, and refine as conditions move.',
        items: [
          'Predictive modeling',
          'Time-series forecasting',
          'Demand forecasting',
          'Revenue forecasting',
          'Customer churn prediction',
          'Risk prediction',
          'Fraud prediction',
          'Predictive maintenance',
          'Propensity modeling',
          'Probability and scoring models',
          'Scenario forecasting',
          'What-if analysis',
          'Early-warning systems',
        ],
      },
      {
        title: 'Prescriptive Analytics & Decision Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What action to take, given the constraints you actually have. Optimization and simulation wired into the workflow where the decision gets made, rather than left as a read-only layer.',
        items: [
          'Decision optimization',
          'Scenario simulation',
          'What-if modeling',
          'Recommendation engines',
          'Optimization models',
          'Resource allocation',
          'Pricing optimization',
          'Supply-chain optimization',
          'Workforce optimization',
          'Complex event processing',
          'Constraint-based decisioning',
          'Decision rules and policies',
          'Decision strategy modeling',
        ],
      },
      {
        title: 'Cognitive & AI-Augmented Analytics',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Context, meaning and relationships conventional analytics cannot reach. AI, semantics and graph applied to unstructured material as readily as to tables.',
        items: [
          'Machine learning analytics',
          'Natural language processing',
          'Text analytics',
          'Document analytics',
          'Speech analytics',
          'Image analytics',
          'Video analytics',
          'Graph analytics',
          'Knowledge graph analytics',
          'Semantic analytics',
          'Ontology-driven analytics',
          'Pattern recognition',
          'Sentiment analysis',
          'Entity and relationship analysis',
          'AI-generated insights',
          'Natural-language analytics',
        ],
      },
      {
        title: 'Real-Time & Streaming Analytics',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Intelligence while the event is still unfolding. For the decisions that cannot wait for an overnight batch, and the alerts that are worthless an hour late.',
        items: [
          'Real-time data analytics',
          'Event-stream processing',
          'Streaming analytics',
          'Real-time KPI monitoring',
          'Real-time anomaly detection',
          'Event correlation',
          'Operational alerts',
          'Threshold monitoring',
          'Live dashboards',
          'Real-time risk intelligence',
          'Real-time decision triggers',
          'IoT and sensor analytics',
          'Edge analytics',
        ],
      },
      {
        title: 'Business Intelligence & Enterprise Performance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'One consistent view of performance, from the board pack down to the operational dashboard. A common intelligence layer rather than four teams arriving with four numbers.',
        items: [
          'Executive dashboards',
          'KPI command centers',
          'Operational dashboards',
          'Financial analytics',
          'Sales analytics',
          'Marketing analytics',
          'Customer analytics',
          'Workforce analytics',
          'Supply-chain analytics',
          'Self-service analytics',
          'Interactive visualization',
          'Embedded analytics',
          'Drill-down intelligence',
          'Performance scorecards',
          'Management reporting',
        ],
      },
      {
        title: 'Analytics Engineering, Governance & Intelligence Platforms',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The foundation that makes everything above repeatable. Pipelines, semantic models and lineage, plus the controls that keep an analytical output defensible when somebody disputes it.',
        items: [
          'Data ingestion',
          'ETL and ELT',
          'Data transformation and integration',
          'Data lakehouse architectures',
          'Semantic modeling',
          'Analytics data products',
          'Analytical data pipelines',
          'Metadata management',
          'Data quality engineering',
          'Data lineage',
          'Analytics platform engineering',
          'Cloud analytics architectures',
          'Data observability',
          'Access and privacy controls',
          'Auditability',
          'Model governance',
          'Policy enforcement',
          'Analytical lifecycle management',
        ],
      },
    ],
  },

  'big-data': {
    slug: 'big-data',
    name: 'Big Data',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE™',
    shortDescription: 'Kangqore engineers the data platform underneath your analytics: ingestion, lakehouse storage, distributed processing and streaming, built to stay correct under change.',
    fullDescription: 'Kangqore helps enterprises turn scattered data estates into one platform: ingestion, storage, processing and streaming, engineered to stay correct as sources change and predictable as they grow.',
    keyFeatures: ['Data lakes', 'Distributed processing', 'Real-time streaming', 'Data warehousing', 'ETL pipelines'],
    relatedServiceSlugs: ['analytics', 'data-science-ai'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    whatIsTitle: 'Volume was never',
    whatIsTitleLine2: 'the hard part.',
    whatIsHighlight: 'Change is.',
    whatIsPara2: 'Kangqore architects scalable data lakehouses, streaming pipelines, and distributed processing platforms on AWS, Azure, and GCP — enabling enterprises to store, query, and act on petabyte-scale data with sub-second freshness.',
    businessMetrics: [
      { illustrative: true, title: 'Query Performance',    desc: 'Average improvement in analytical query response time after data warehouse modernization and lake house migration.', value: '10',  suffix: 'x',    metricLabel: 'Faster Queries',   icon: 'Zap'     },
      { illustrative: true, title: 'Storage Cost',         desc: 'Reduction in data storage costs through lake house consolidation and tiered storage optimization.',               value: '55',  suffix: '%',    metricLabel: 'Storage Savings',  icon: 'Target'  },
      { illustrative: true, title: 'Data Freshness',       desc: 'Real-time streaming pipelines delivering sub-second data freshness for operational analytics workloads.',         value: '<1',  suffix: ' Sec', metricLabel: 'Data Latency',     icon: 'Activity'},
      { illustrative: true, title: 'Data Under Management',desc: 'Total data volume managed across client lake house architectures on AWS, Azure, and GCP.',                        value: '5',   suffix: 'PB+',  metricLabel: 'Petabyte Scale',   icon: 'Layers'  },
    ],
    hidePartnershipModel: true,

    // ── How we engage ───────────────────────────────────────────────────────
    // This service had no servicePackages, so the section rendered the generic
    // parity default -- five entry points written for no service in particular.
    //
    // Structured around what buyers actually procure rather than how the
    // platform is engineered. A procurement lead scans for "consulting",
    // "migration", "implementation" and "support"; the capability taxonomy
    // above is organized by layer, so those words appear nowhere. Both views
    // are now present, which is the point.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways to start.',
    engagementHeadingHighlight: 'One partner throughout.',
    engagementLede: 'Advise, integrate, build, implement, operate. Most estates need two of these rather than all five, and the assessment exists to work out which two.',
    servicePackages: [
      {
        name: 'Advisory & Architecture',
        description: 'Before anything gets built. What you have, what it costs, what it should be, and whether the platform you are being sold is bigger than the data going through it. Frequently ends in a smaller recommendation than expected.',
        deliverables: [
          'Current-state assessment of platform and pipelines',
          'Target architecture and technology selection',
          'Business case with cost per workload modeled',
          'Sequenced roadmap, with what to retire rather than migrate',
        ],
      },
      {
        name: 'Integration & Migration',
        description: 'Getting data out of where it is and into where it should be. Usually a Hadoop estate, an appliance out of support, or a warehouse whose bill has outgrown its usefulness.',
        deliverables: [
          'Source extraction, mapping and validation',
          'Legacy platform and workload migration',
          'Parallel run with automated output comparison',
          'Cutover plan and rollback path',
        ],
      },
      {
        name: 'Platform Build',
        description: 'The engineering itself. Data models, pipelines and the serving layer, built so somebody other than the author can run them.',
        deliverables: [
          'Data models and schema design for query patterns',
          'Custom ETL and ELT pipeline development',
          'Distributed processing applications on Spark and SQL engines',
          'Data APIs and products exposing processed data to applications',
        ],
      },
      {
        name: 'Implementation & Cutover',
        description: 'Standing the platform up in your environment, on-premise or cloud, and proving it holds before anything depends on it.',
        deliverables: [
          'Platform installation and configuration, on-premise or cloud',
          'Monitoring, alerting and operational dashboards',
          'Performance, security and cost tuning',
          'Handover with runbooks and documented failure modes',
        ],
      },
      {
        name: 'Managed Operations',
        description: 'Running it after go-live, under an agreed service level. For teams who want the platform without hiring the platform team, or who need cover while they build one.',
        deliverables: [
          'Pipeline and infrastructure monitored against agreed service levels',
          'Diagnosis of slow queries, stalled jobs and silent data failures',
          'Cover for the engineers who own it, including while they are on leave',
          'Quarterly review of what the platform costs and why',
        ],
      },
    ],

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. Several of these argue against buying, which is the point: this
    // category sells platforms to organizations that mostly need less platform.
    customFAQs: [
      {
        q: 'Do we actually have big data?',
        a: 'Probably not, and that is the most useful thing we can tell you early. The threshold that matters is not a volume number, it is whether a single machine can still answer your questions in acceptable time. Modern hardware and DuckDB will handle a few hundred gigabytes comfortably.\n\nIf you are running a Spark cluster, there is a real chance you would be faster and dramatically cheaper on a well-indexed database, because distributed processing was bought as an architecture decision rather than measured as a need.\n\nWhere it is genuinely warranted: sustained multi-terabyte tables, ingestion rates a single writer cannot keep up with, or query patterns that must scan far more than fits in memory. We would rather establish that in two weeks than sell you a platform you do not need.',
        sources: [],
      },
      {
        q: 'What is the difference between this and your Analytics service?',
        a: 'Analytics is the insight ladder — descriptive, diagnostic, predictive, prescriptive. Big data is the platform underneath it: ingestion, storage, distributed processing, streaming, and the operations that keep those running.\n\nThe practical distinction is which of the two is making you unhappy. If the numbers disagree between teams or a dashboard changes nothing, that is analytics. If pipelines break, queries are slow or the cloud bill is unexplainable, that is here.\n\nBuying the platform first is the common sequencing error. It produces an expensive foundation under a building nobody has designed, and the decisions that would have shaped it get made after the concrete sets.',
        sources: [
          { label: 'Kangqore Analytics', url: '/services/analytics' },
        ],
      },
      {
        q: 'Should we build a lakehouse or a warehouse?',
        a: 'For most of the estates we see, the honest answer is a warehouse, and the lakehouse conversation is happening a layer above where the actual problem sits. Warehouses handle structured analytical workloads extremely well and require far less engineering to keep correct.\n\nA lakehouse earns its complexity when you have genuinely unstructured or semi-structured data at volume, need multiple engines reading the same tables, or want to avoid vendor lock-in on storage. Those are real reasons, and they apply to fewer estates than the marketing suggests — possibly including yours.\n\nWhat matters more than the label is the table format. Iceberg, Delta or Hudi determines schema evolution, time travel and atomic writes, and changing it later means rewriting data rather than swapping a tool.',
        sources: [],
      },
      {
        q: 'Why is our cloud data bill growing faster than our data?',
        a: 'Almost always file layout and partitioning. A query that scans a thousand small files costs many times one that scans a few well-sized ones, and the difference does not show up until volume grows. Partitioning chosen for how data arrives rather than how it is queried produces exactly this.\n\nThe second common cause is that nobody in your organization owns the bill. Where cost is not attributed per team or per workload, there is no feedback loop, and the cheapest query is the one nobody was ever told was expensive.\n\nBoth are fixable without a migration. We usually find meaningful reduction in your compaction, your partition strategy, and killing scheduled jobs whose output nobody reads any more.',
        sources: [],
      },
      {
        q: 'How much of this needs to be real-time?',
        a: 'Less than the architecture diagram suggests. The test is whether a decision changes if the data arrives an hour later. For fraud, network operations, live pricing and inventory during a peak, it does. For most reporting and most machine learning features, it does not.\n\nStreaming is a correctness problem before it is a throughput one, and you inherit all of it. Exactly-once semantics, late and out-of-order events, replay after a bad deploy — each is solvable and each is engineering you do not need if batch would have done.\n\nWe usually recommend batch across the estate and streaming for the two or three flows where latency has a measurable cost.',
        sources: [],
      },
      {
        q: 'Our pipelines say green but the data is wrong. Why?',
        a: 'Because the orchestrator is telling you the job ran, which is a different claim from the data being correct. A pipeline that reads a changed source and writes nulls into a column completes successfully by every measure the scheduler has.\n\nThe fix is testing your data rather than your job: freshness, row volume against expectation, null rates, referential checks, and contracts agreed with whoever owns the upstream system. Failures then stop the pipeline instead of propagating quietly.\n\nThis is the single highest-return work in most estates, and the least likely to be funded, because it prevents incidents rather than resolving visible ones.',
        sources: [],
      },
      {
        q: 'Can you migrate us off Hadoop without stopping everything?',
        a: 'Yes, and it should be a parallel run rather than a cutover. Both platforms produce the same outputs for a period, results are compared automatically, and workloads move once they match. Slower than a big-bang migration and considerably less likely to end badly.\n\nThe part that takes longest is rarely the data. It is the accumulated logic in jobs nobody at your company has read in years, some of which encodes business rules that exist nowhere else. Discovery on that is most of the estimate.\n\nWe would also expect to retire rather than migrate a meaningful share of it. Your estate almost certainly carries jobs whose output no longer feeds anything, and migrating those is paying twice for something worth nothing.',
        sources: [],
      },
      {
        q: 'Will this still hold if our data volume grows ten times?',
        a: 'Compute will. Horizontal scaling is genuinely solved, and adding nodes is the easy part. What does not scale on its own is the layout underneath — partition strategy, file sizes and queries somebody wrote while the table was small.\n\nThe things that break first are predictable. Partitions chosen for how data arrives rather than how it is queried. Small files accumulating until a scan costs more than the query is worth. Joins that were fine when one side fit in memory. None of these throw an error; they get slower and more expensive while the dashboard still says green.\n\nSo the honest answer is that the platform holds if it was laid out for the volume you are heading toward, and gets expensive if it was laid out for the volume you had. We design against your two-year number rather than your current one, because layout is the hardest thing to change after data is written into it.',
        sources: [],
      },
      {
        q: 'What does this cost, and what drives the number?',
        a: 'The five engagement paths above are the shape. What moves the number inside them is rarely the engineering. It is how many source systems have to be touched, and whether anyone left can tell you what the data in them means.\n\nThe cheap end is a platform built on sources that are documented and owned. The expensive end is the same build where one customer is identified six different ways across six systems and the person who knew why left in 2019. That is archaeology rather than engineering, and it is far better to discover it in week one of an assessment than in month four of a build.\n\nThe part more often underestimated is what the platform costs to run afterwards. We model cost per workload during the assessment, so that number exists before you commit rather than arriving with the first invoice.',
        sources: [],
      },
      {
        q: 'Who owns the platform after you leave?',
        a: 'Your team, and the handover should be designed from the start rather than assembled at the end. Everything ships in your repositories: infrastructure as code, pipeline definitions, tests, runbooks and the documented failure modes.\n\nWhat matters more than documentation is whether your engineers built alongside us. A platform handed to you cold gets frozen — your team will not change what it does not understand, and within a year it is legacy again.\n\nWhere we stay involved it is because you asked us to run operations under an agreed service level, not because the artifacts are ours.',
        sources: [],
      },
      {
        q: 'Do we need a data mesh?',
        a: 'Probably not yet. Data mesh solves an organizational bottleneck — a central platform team that cannot keep up with demand from many domains. If you do not have that bottleneck, adopting it distributes your complexity without removing any of it.\n\nThe prerequisites are real and frequently skipped: a genuine self-service platform, working data contracts, and domain teams with the engineering capacity to own products. Without those it becomes each of your teams building its own pipelines, which is where you probably started.\n\nThe useful part to borrow early is treating datasets as products with named owners and stated guarantees. That works at any size and requires no reorganization.',
        sources: [],
      },
      {
        q: 'How long before this is useful?',
        a: 'A first production pipeline in four to six weeks, and a two-week assessment before it that establishes whether the platform you have is the problem. That assessment frequently changes what we end up building for you.\n\nA full migration runs in months, and should be sequenced so value lands throughout rather than at the end. Programs that deliver nothing until cutover are the ones your board cancels at month seven with nothing to show.\n\nIf a proposal promises a complete enterprise data platform in a quarter, what is being estimated is the infrastructure. The pipelines, the contracts and the organizational agreement are the slow parts, and they are also the parts that determine whether anyone uses it.',
        sources: [],
      },
    ],



    heroTitle: 'Big Data Platforms Engineered\nfor Performance and Trust',
    heroBadge: 'Ingest. Store. Process. Serve.',
    heroStripItems: [
      'Lakehouse Architecture', 'Change Data Capture', 'Spark & Distributed Compute', 'Event Streaming',
      'Table Formats', 'Pipeline Orchestration', 'Data Observability', 'Cost per Terabyte',
    ],
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',

    // ── What this actually is ───────────────────────────────────────────────
    whatIsPara2: 'Big data stopped being about volume some time ago. Storage is cheap and the engines are commodity; what is hard is a platform that stays correct when one of your sources changes shape, stays fast when a table doubles, and stays predictable on cost when three of your teams start querying it at once.',

    whatIsPara3: 'The failure mode is rarely dramatic. A pipeline succeeds while writing the wrong thing, an upstream schema changes silently, a partition strategy that was fine at two terabytes becomes the reason a query costs forty pounds to run. None of that surfaces as an outage. It surfaces as a number somebody downstream of you stops trusting.',

    whatIsPara4: 'So the work is partitioning and file layout before engine choice, contracts and tests before dashboards, and cost attributed to the team of yours that caused it. That is unglamorous next to a lakehouse migration deck, and it is what decides whether the platform is still worth running in year three.',

    // ── Comparison ──────────────────────────────────────────────────────────
    // The parity default compares TRADITIONAL AI with AGENTIC AI, which is an
    // argument for a different service entirely.
    comparisonTable: {
      eyebrow: 'WHERE DATA PLATFORMS GO WRONG',
      heading: 'The platform is easy to build\nand hard to keep.',
      lede: 'Both columns describe a working data platform. They differ in what happens on the day something upstream changes.',
      beforeLabel: 'A PLATFORM THAT RUNS',
      afterLabel: 'A PLATFORM YOU CAN RELY ON',
      afterBadge: 'KANGQORE',
      beforeShort: 'RUNS',
      afterShort: 'RELIABLE',
      rows: [
        {
          dimension: 'When a source changes shape',
          before: 'The job succeeds and writes the wrong thing. Somebody notices weeks later.',
          after: 'A contract test fails at ingest, the pipeline stops, and the team that owns the source is told.',
        },
        {
          dimension: 'When a table doubles',
          before: 'Queries get slower until someone adds a bigger cluster.',
          after: 'Partitioning and file layout designed for the access pattern, so cost per query stays flat.',
        },
        {
          dimension: 'What the platform costs',
          before: 'One cloud bill nobody can attribute, growing faster than usage.',
          after: 'Cost per workload and per team, visible before the invoice rather than after it.',
        },
        {
          dimension: 'How anyone knows it worked',
          before: 'The orchestrator says green. Whether the data is right is a separate question nobody asks.',
          after: 'Freshness, volume and quality checked as part of the run, with an alert somebody owns.',
          link: { label: 'Analytics', to: '/services/analytics' },
        },
        {
          dimension: 'Whether teams can self-serve',
          before: 'Every new dataset is a ticket to the platform team, who are the bottleneck by design.',
          after: 'Platform as a product: paved paths, standards and templates, so teams ship without asking.',
        },
      ],
    },

    // ── Architecture ────────────────────────────────────────────────────────
    // The parity default rendered "Policy & Ethics Layer" and "Control &
    // Orchestration Engine" -- the governance stack, on an infrastructure page.
    architectureEyebrow: 'HOW THE PLATFORM IS LAYERED',
    architectureTitle: 'Four layers,',
    architectureTitleHighlight: 'and the one that decides your bill.',
    architectureLede: 'Ingest, store, process, serve. Most cost and most pain concentrate in the second layer, which is also the one hardest to change once data is written into it.',
    architectureNodes: [
      {
        title: 'Ingest',
        icon: 'Database',
        description: 'Getting data in without breaking the source system, and getting the same data again tomorrow.',
        features: [
          'Batch, CDC and streaming paths',
          'Schema evolution handled at the boundary',
          'Replayable and idempotent loads',
          'Contracts with the upstream owner',
        ],
      },
      {
        title: 'Store',
        icon: 'Layers',
        description: 'Lake, warehouse or lakehouse — and the layout inside whichever you pick. This is the layer that quietly sets your cost, and the hardest one to change once data is written into it.',
        features: [
          'Data lake for raw, semi-structured and unstructured sources',
          'Warehouse where the data is modeled, governed and queried constantly',
          'Lakehouse where both need one copy and several engines',
          'Open table formats: Iceberg, Delta, Hudi',
          'Partitioning and file layout designed around the access pattern',
          'Tiering, retention and time travel',
        ],
      },
      {
        title: 'Process',
        icon: 'Cpu',
        description: 'Making jobs finish predictably. Most tuning goes into skew and shuffle rather than into the logic itself.',
        features: [
          'Spark batch and structured streaming',
          'Query engine selection and tuning',
          'Workload isolation between teams',
          'Cost per query measured, not estimated',
        ],
      },
      {
        title: 'Serve',
        icon: 'Network',
        description: 'Where the platform meets the people using it, and where self-service either works or becomes a ticket queue.',
        features: [
          'Serving layers for BI and applications',
          'Semantic and catalog integration',
          'Paved paths and templates for teams',
          'Freshness and quality visible to consumers',
        ],
      },
    ],

    // ── Industry ────────────────────────────────────────────────────────────
    industryHeading: 'Platforms built for',
    industryHeadingHighlight: 'the data your sector generates.',
    industryLede: 'Volume is rarely the interesting constraint. What differs by sector is retention obligations, how late data is allowed to arrive, and what it costs when a pipeline is wrong.',
    // ── Industry ────────────────────────────────────────────────────────────
    // Fourteen sectors, platform-layer rather than analytics-outcome. The
    // obvious framing — predictive patient care, fraud detection, churn
    // prediction — is what competitors put here, and all of it is analytics
    // work that belongs on /services/analytics. Using it would rebuild the
    // cannibalization between these two pages that was just removed.
    //
    // So each card answers a platform question instead: what the data looks
    // like, what has to be retained, how late it arrives, and what it costs to
    // hold. That is the thing this service is actually sold to solve.
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Retention measured in years, immutable audit trails, and transaction volume that peaks without warning.',
        items: ['Transaction and trade data at sustained volume', 'Retention, lineage and audit evidence', 'Regulatory reporting pipelines'],
      },
      {
        industry: 'Insurance',
        headline: 'Decades of policy and claims history that has to stay queryable long after the business stopped looking at it.',
        items: ['Historical policy and claims consolidation', 'Cold storage that stays cheap and reachable', 'Actuarial re-runs against archived data'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Residency and access control as design constraints rather than settings, across sites that never shared a schema.',
        items: ['Multi-site clinical data consolidation', 'De-identification and access control at ingest', 'Imaging and genomic data at volume'],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'Sensor volume where the useful signal is a fraction of what is collected, and the network is not always there.',
        items: ['Telemetry ingestion at plant scale', 'Time-series storage and downsampling', 'Edge-to-cloud pipelines with intermittent links'],
      },
      {
        industry: 'Automotive',
        headline: 'Connected-vehicle telemetry, where the fleet generates more data per day than the warehouse was sized for per quarter.',
        items: ['Connected-vehicle event ingestion', 'Edge filtering before anything is stored', 'Supply chain and production data integration'],
      },
      {
        industry: 'Transportation & Logistics',
        headline: 'Fleet and geospatial data arriving late, out of order, and from devices that were offline for six hours.',
        items: ['Geospatial and fleet telemetry pipelines', 'Late and out-of-order event handling', 'Cross-system consignment data integration'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Peak seasons that make average-case sizing the wrong answer, and clickstream volume that dwarfs the transaction data.',
        items: ['Clickstream and event stream ingestion', 'Peak-capacity design and cost control', 'Catalog, inventory and customer data unification'],
      },
      {
        industry: 'Media & Entertainment',
        headline: 'Viewing telemetry, content metadata and rights data that live in three systems and disagree about all of it.',
        items: ['Viewing and engagement telemetry at scale', 'Content, metadata and rights consolidation', 'Real-time delivery and quality monitoring'],
      },
      {
        industry: 'Telecom',
        headline: 'Network and usage data where cost per terabyte is not a line item, it is the business case.',
        items: ['Network telemetry and call record processing', 'Usage and billing data pipelines', 'Cost optimization at petabyte scale'],
      },
      {
        industry: 'Energy & Resources',
        headline: 'Grid, well and asset telemetry where the platform has to keep working when connectivity does not.',
        items: ['Sensor and SCADA data ingestion', 'Historian modernization and migration', 'Edge processing where bandwidth is limited'],
      },
      {
        industry: 'Agriculture',
        headline: 'Sensor, satellite and weather data combined across holdings, gathered where connectivity is intermittent by default.',
        items: ['Field sensor and satellite data ingestion', 'Weather and soil data integration', 'Edge collection with deferred upload'],
      },
      {
        industry: 'Tourism & Hospitality',
        headline: 'Booking and property data across systems that were acquired rather than designed, with sharp seasonal peaks.',
        items: ['Booking and reservation data consolidation', 'Seasonal capacity and cost planning', 'Guest data unification across properties'],
      },
      {
        industry: 'Education & Research',
        headline: 'Student and research data with long retention duties, term-cycle load spikes, and privacy rules that vary by jurisdiction.',
        items: ['Student record consolidation and retention', 'Research data platforms and archival', 'Term-cycle capacity management'],
      },
      {
        industry: 'Professional Services',
        headline: 'Project, time and client data spread across systems that must stay isolated from one another by contract.',
        items: ['Project and utilization data integration', 'Client data isolation and access control', 'Multi-entity consolidation and reporting'],
      },
    ],

    // ── Toolchain ───────────────────────────────────────────────────────────
    // The parity default described a stack "powering cognitive computing,
    // machine learning, and AI governance" and listed PyTorch, TensorFlow and
    // Hugging Face -- an ML research stack on an infrastructure page.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'What we build on,',
      titleHighlight: 'and when we would not.',
      subtitle: 'Most of this is decided by the cloud you are already in and how much data you genuinely have. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Layers',
          title: 'Table formats',
          managed: 'Apache Iceberg, Delta Lake, Hudi',
          selfHosted: 'The decision that outlives the engine',
          desc: 'Picks up schema evolution, time travel and atomic writes. Chosen before the query engine, because migrating between formats later is the expensive move.',
        },
        {
          icon: 'Cpu',
          title: 'Distributed processing',
          managed: 'Spark, Databricks, EMR',
          selfHosted: 'DuckDB or Postgres under a terabyte',
          desc: 'Spark earns its complexity past a few terabytes. Below that a single machine is usually faster and always cheaper, and a surprising number of estates are below that.',
        },
        {
          icon: 'Database',
          title: 'Warehouse and query engines',
          managed: 'Snowflake, BigQuery, Redshift',
          selfHosted: 'Trino or DuckDB over object storage',
          desc: 'Sized to the query pattern rather than the roadmap. Separating storage from compute matters more than which vendor supplies either.',
          link: { label: 'Analytics', to: '/services/analytics' },
        },
        {
          icon: 'Zap',
          title: 'Streaming',
          managed: 'Kafka, Kinesis, Pub/Sub, Flink',
          selfHosted: 'Only where latency has a cost',
          desc: 'Streaming is a correctness problem before it is a throughput problem. Reached for when the decision cannot wait, not because the architecture diagram has arrows on it.',
        },
        {
          icon: 'Network',
          title: 'Orchestration',
          managed: 'Airflow, Dagster, Prefect',
          selfHosted: 'Once pipelines have dependencies',
          desc: 'The point where scheduled jobs become a dependency graph somebody has to reason about, backfill and recover.',
        },
        {
          icon: 'Radar',
          title: 'Quality and observability',
          managed: 'Great Expectations, Monte Carlo, Soda',
          selfHosted: 'Contracts at the ingest boundary',
          desc: 'Data platforms fail silently. A green orchestrator says the job ran, not that what it wrote is correct, and those are different claims.',
        },
      ],
    },

    // ── CTAs ────────────────────────────────────────────────────────────────
    midCta: 'The job ran green. The data is still wrong.',
    midCtaLabel: 'Show us a pipeline',

    closingCta: {
      title: 'One pipeline.',
      highlight: 'One number you stop rechecking.',
      body: 'Bring the pipeline that breaks quietly, or the cloud bill nobody can attribute to a team. In 30 minutes we will tell you whether it is a layout problem, a contract problem, or a platform that is simply bigger than the data going through it.',
      primaryLabel: 'Bring us a pipeline',
      secondaryLabel: 'See the four layers',
      proofLabel: 'From first call to a platform cost you can predict',
    },

    // ── Capability areas ────────────────────────────────────────────────────
    // Restructured from layer-shaped to journey-shaped. The previous version
    // was organized by where work sits in the stack — ingest, store, process,
    // stream — which is how the platform is engineered but not how it is
    // bought. A procurement lead looks for strategy, migration, managed
    // services; none of those were headline categories.
    //
    // Assess -> integrate -> build -> govern -> operate -> migrate -> manage.
    // The architecture section below still shows ingest, store, process, serve,
    // so both views are present: this one is how you buy it, that one is how
    // it works.
    //
    // Streaming is no longer a top-level area. It is covered by Real-Time Data
    // Ingestion and Event-Driven Data Pipelines here, by the Streaming row in
    // the toolchain, and by the architecture. Worth knowing it was demoted
    // deliberately rather than dropped.
    capabilitiesLabel: 'BIG DATA SERVICES',
    capabilitiesSectionTitle: 'Our',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Strategy, ingest, store, process, stream, govern, observe, modernize, operate. Most estates need three of these; the assessment exists to find out which three.',
    capabilityAreas: [
      {
        title: 'Big Data Strategy & Advisory',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Assess your existing data landscape, define the target-state architecture, and establish a practical roadmap for scaling data platforms across the enterprise.',
        items: [
          'Current-State Data Platform Assessment',
          'Big Data Strategy & Roadmap',
          'Target Architecture Design',
          'Technology & Platform Selection',
          'Data Platform Business Case',
          'Cloud & Hybrid Data Strategy',
          'Data Governance Strategy',
          'Modernization Roadmap',
        ],
      },
      {
        title: 'Data Integration & Ingestion',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Connect data across applications, databases, cloud platforms, devices, files, APIs and operational systems through ingestion pipelines that deliver the same fields tomorrow that they delivered today.',
        items: [
          'Batch Data Ingestion',
          'Real-Time Data Ingestion',
          'Change Data Capture',
          'ETL / ELT Engineering',
          'API & Application Integration',
          'Database Integration',
          'Multi-Source Data Integration',
          'Data Bus & Integration Layer',
          'Enterprise Service Bus Modernization',
          'Schema Mapping & Validation',
          'Data Replication',
          'Event-Driven Data Pipelines',
          'Legacy Data Integration',
          'Data Quality at Ingestion',
        ],
      },
      {
        title: 'Big Data Platform Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Design and engineer platforms that hold under high-volume, high-velocity and high-variety workloads, across cloud, hybrid and distributed environments.',
        items: [
          'Lakehouse Engineering',
          'Data Warehouse Engineering',
          'Distributed Compute',
          'Spark Engineering',
          'Hadoop Modernization',
          'Data Processing Frameworks',
          'Data Models & Schemas',
          'Query Optimization',
          'Data APIs',
          'Analytical Platforms',
          'Cloud-Native Data Platforms',
          'High-Scale Data Architecture',
        ],
      },
      {
        title: 'Real-Time & Streaming Data',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The event backbone, for decisions that cannot wait for the overnight run. A correctness problem before it is a throughput problem, and worth the engineering for a narrow set of cases.',
        items: [
          'Event Streaming Platforms',
          'Stream Processing',
          'Real-Time Data Pipelines',
          'Change Data Capture Streaming',
          'Exactly-Once Delivery Guarantees',
          'Windowing & Watermarking',
          'Stream-Table Joins & Enrichment',
          'Backpressure & Replay Handling',
          'Event Schema Registry & Contracts',
          'Complex Event Processing',
          'IoT & Telemetry Streaming',
          'Real-Time Serving Layers',
        ],
      },
      {
        title: 'Data Governance, Quality & Trust',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The controls, standards and observability that decide whether a number survives being questioned. Its own discipline here rather than a clause inside platform management.',
        items: [
          'Data Governance Frameworks',
          'Data Quality Engineering',
          'Data Cataloging',
          'Metadata Management',
          'Data Lineage',
          'Access Control',
          'Data Classification',
          'Privacy & Protection',
          'Data Retention',
          'Data Lifecycle Management',
          'Data Contracts',
          'Data Quality Monitoring',
        ],
      },
      {
        title: 'DataOps & Platform Reliability',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Operating data platforms as production systems rather than as scheduled jobs. Data platforms fail silently, so the monitoring has to test the data and not only the run.',
        items: [
          'Data Pipeline Monitoring',
          'Data Platform Observability',
          'Data Quality Monitoring',
          'Pipeline Failure Detection',
          'Performance Monitoring',
          'Incident Management',
          'SLA & SLO Monitoring',
          'Capacity Management',
          'Workload Optimization',
          'Platform Health Monitoring',
          'Operational Dashboards',
          'Automated Remediation',
        ],
      },
      {
        title: 'Modernization, Migration & Managed Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Getting off what you are on now — a Hadoop estate, an appliance out of support, a warehouse whose bill has outgrown its usefulness — and running what replaces it, if you would rather not hire the team.',
        items: [
          'Hadoop Modernization',
          'Legacy Warehouse Migration',
          'Appliance-to-Cloud Migration',
          'On-Premise-to-Cloud Migration',
          'Cloud-to-Cloud Migration',
          'RDBMS Modernization',
          'Lakehouse & Data Lake Migration',
          'Workload Migration & Sequencing',
          'Migration Validation & Parallel Run',
          'Zero and Low-Downtime Migration',
          'Round-the-Clock Platform Monitoring',
          'Data Pipeline Operations',
          'Incident Response',
          'Capacity & Cost Optimization',
          'Platform Maintenance & Version Upgrades',
          'SLA Management',
        ],
      },
    ],
  },

  'digital-process-automation': {
    slug: 'digital-process-automation',
    name: 'Digital Process Automation (DPA)',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE\u2122',
    shortDescription: 'Digitize, orchestrate and govern end-to-end business processes',
    fullDescription: 'Close the gap between how a process should run and the application it never had, through low-code applications, case and workflow orchestration, and system extension.',
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Low-code applications', 'Case management', 'Journey orchestration', 'System extension', 'Process conformance'],
    relatedServiceSlugs: ['intelligent-automation', 'robotic-process-automation', 'business-process-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',

    // ── Positioning ─────────────────────────────────────────────────────────
    // This page previously rendered the Cognition parity default, which is the
    // AI Governance taxonomy with the service name substituted in: capability
    // headings read "Establishing Ethical Governance & Control", the stack read
    // "Policy & Ethics Layer / Data & Privacy Core", and the hero carried the
    // shared agentic diagram (AI COMMANDER / AUTONOMOUS COMMIT) above the fold.
    //
    // The wedge against the three sibling automation pages is deliberate and
    // load-bearing. /services/intelligent-automation owns the bots and the
    // intelligence: RPA, digital workforce, IDP, cognitive. /services/rpa owns
    // task-level automation. This page owns the layer neither of them covers --
    // the process has no application at all, so work moves through email,
    // attachments and a spreadsheet somebody maintains privately.
    //
    // Happiest Minds arrived at the same split independently: their DPA page is
    // built on "Digital Automation (LCAP)" and keeps RPA as a separate, linked
    // offering. Their stated differentiator is bridging *application* gaps
    // rather than process gaps. That is the correct read of the category.
    //
    // The supplied source taxonomy had seven areas, of which 36 of 79
    // sub-capabilities were already published on intelligent-automation
    // (Strategy & CoE 8/10, Process Intelligence & Mining 9/11). Those two are
    // not capability areas here: Strategy & CoE moved into servicePackages,
    // where procurement looks for it anyway, and mining is narrowed to
    // conformance -- the half intelligent-automation does not claim. Robotic &
    // Digital Workforce is a cross-link, not a section.
    heroTitle: 'Digital Process Automation\nfor Enterprise Workflows',
    // The eyebrow defaults to 'What <name> services does Kangqore offer?',
    // which contradicts the heading below it now that the heading asks about
    // challenges. whatIsHighlightNewLine forces the break, so the gradient
    // clause gets its own line without an empty whatIsTitleLine2 carrying it.
    whatIsEyebrow: 'What goes wrong, and what fixes it',
    whatIsTitle: 'Digital process automation',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'challenges and solutions.',
    whatIsPara2: 'Most enterprise processes that hurt were never given an application. They run across a core system, a CRM and a spreadsheet, held together by an inbox and by one person who knows what happens next. Automating the keystrokes inside that arrangement makes it faster without making it a system.',
    whatIsPara3: 'Kangqore closes the application gap instead. We digitize the process itself \u2014 the forms people fill in, the case record that holds state, the rules that decide, the queue that routes, the portal that shows a customer where their request has got to \u2014 then orchestrate people, systems, bots and AI through it as one governed flow.',
    whatIsPara4: 'The result is a process with a record per case, an owner, an audit trail and a measurable straight-through rate, built on low-code where that fits and on your existing ERP and core systems where those are not going anywhere. Bots and cognitive automation plug into it; they are not the foundation. That distinction is the whole discipline.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Deliberately not cycle time and bot uptime -- those are the
    // intelligent-automation metrics and repeating them here would say the two
    // services do the same thing. These four measure whether the process now
    // has somewhere to live: does a case finish without a person, how fast can
    // a working application reach users, how many times does work change hands,
    // and how often does it come back because the first touch was incomplete.
    outcomesEyebrow: 'WHAT MOVES WHEN THE PROCESS HAS A SYSTEM',
    outcomesHeading: 'Process Automation Outcomes',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'Straight-Through Rate', desc: 'Cases reaching completion end to end with no human step in the middle, once the journey is redesigned and orchestrated.', value: '70',  suffix: '%',    metricLabel: 'Cases Completed Untouched', icon: 'Zap'      },
      { illustrative: true, title: 'Application Delivery', desc: 'Typical time from an agreed process design to a working digital application in production with real users on it.',           value: '4\u20138', suffix: ' Wks', metricLabel: 'Design to Production',      icon: 'Rocket'   },
      { illustrative: true, title: 'Process Handoffs',     desc: 'Fewer times a single case changes hands between teams, systems and mailboxes once the journey is orchestrated as one flow.',  value: '65',  suffix: '%',    metricLabel: 'Fewer Handoffs',            icon: 'Network'  },
      { illustrative: true, title: 'Rework',               desc: 'Reduction in cases reopened because information was missing or wrong at the first point of capture.',                          value: '50',  suffix: '%',    metricLabel: 'Less Rework',               icon: 'Target'   },
    ],

    heroBadge: 'Digitized. Connected. Governed.',
    heroStripItems: [
      'Low-Code Applications', 'Digital Forms & Portals', 'Case Management', 'Decision & Rules Engines',
      'ERP & Legacy Extension', 'Journey Orchestration', 'Straight-Through Processing', 'Citizen Development',
    ],
    // The partnership model band renders 93 words across 1,190px on this
    // template -- the thinnest section on the page and identical on 60 others.
    hidePartnershipModel: true,

    // ── Calls to action ─────────────────────────────────────────────────────
    // closingCta is an object on this template, not a string. Passing a string
    // silently falls through to the agentic default -- "One agent in
    // production" -- which is wrong on a page whose whole argument is that you
    // build the process before you put an agent inside it.
    midCta: 'The process is fast now. It still has nowhere to live.',
    midCtaLabel: 'Map One Process',
    // ── Capability areas ────────────────────────────────────────────────────
    // Seven areas, reweighted around the layer this service actually owns.
    // Three of them (01, 02, 04) are the low-code and application-gap spine and
    // appear nowhere else on the site. 03 is the deep version of orchestration:
    // intelligent-automation carries five shallow workflow items, this carries
    // long-running case state, DMN, compensation and escalation. 05 is mining
    // narrowed to conformance and simulation -- the discovery half belongs to
    // intelligent-automation and is linked rather than repeated. 06 and 07 are
    // written as intelligence *inside* the digital process, with the depth
    // cross-linked rather than duplicated.
    // ── Toolchain ───────────────────────────────────────────────────────────
    // Deliberately not the intelligent-automation toolchain. That page leads
    // with RPA platforms; this one leads with low-code and case engines,
    // because that is the buying decision on a DPA engagement. Where the two
    // overlap -- mining, integration -- the framing differs: there it is "find
    // the automation candidate", here it is "prove the redesign held".
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'Low-Code and Workflow',
      titleHighlight: 'Platforms We Build On.',
      subtitle: 'Platform choice is mostly settled by what you already license and by how much of the process is a long-running case rather than a form. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Layers',
          title: 'Low-code application platforms',
          managed: 'Microsoft Power Platform, OutSystems, Mendix',
          selfHosted: 'Power Platform by default on Microsoft estates',
          desc: 'Where the process needs an application it never had. The licensing you already hold usually decides this before any technical evaluation does, and arguing with that is rarely worth the delay.',
        },
        {
          icon: 'Network',
          title: 'Workflow and case engines',
          managed: 'Appian, Pega, Camunda',
          selfHosted: 'Camunda where the process is the product',
          desc: 'Where work is a long-running case rather than a form submission. If cases stay open for weeks, branch and get reassigned, a form-first platform will fight you by month four.',
        },
        {
          icon: 'Settings',
          title: 'Decision and rules engines',
          managed: 'Camunda DMN, in-platform rules engines',
          selfHosted: 'Drools where rules outlive the application',
          desc: 'Rules belong outside the workflow when the business changes them and the process does not. Embedded rules are faster to build and become the reason every change needs a developer.',
        },
        {
          icon: 'Radar',
          title: 'Process and task mining',
          managed: 'Celonis, Signavio, Microsoft Process Mining',
          selfHosted: 'Before the redesign, and again after it',
          desc: 'Used here for conformance rather than discovery: proving the digitized process still runs the way it was designed. Most programs mine once, at the start, and never find out whether it held.',
        },
        {
          icon: 'Globe',
          title: 'Integration and APIs',
          managed: 'MuleSoft, Azure Integration Services, Kafka',
          selfHosted: 'Native connectors before middleware',
          desc: 'How the new front end reaches systems that are not being replaced. A platform connector that already exists beats an integration layer you have to operate, until it genuinely does not.',
        },
        {
          icon: 'Shield',
          title: 'Documents and signature',
          managed: 'DocuSign, Adobe Acrobat Sign',
          selfHosted: 'In-platform generation where volume is low',
          desc: 'Generation, signature and evidence retention. Usually the least interesting part of the architecture and the one that stops the process going live if it is left to the end.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve DPA Questions,',
    faqHeadingHighlight: 'Answered Without Hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the questions a process owner and a platform lead
    // actually open with, and three of them are ones a vendor would rather not
    // be asked -- what it costs, who owns it afterwards, and whether the low-
    // code estate becomes the next problem.
    customFAQs: [
      {
        q: 'What is the difference between DPA, BPM and RPA?',
        a: 'They answer different questions, and the confusion is expensive because it leads organizations to buy the wrong one.\n\nRPA automates the keystrokes a person performs inside existing applications. It is the right answer when the work is rule-based, the systems have no usable interface, and the process is otherwise fine. BPM is the discipline of modeling, governing and improving processes \u2014 largely a methodology question, and increasingly the name of the engine that runs long-lived workflows.\n\nDigital process automation is what you need when the process has no application at all. The work moves through email, attachments and a spreadsheet because nobody ever built the system it should run in. Automating keystrokes there makes an unmanaged process faster; it does not make it a managed one.\n\nIn practice most enterprises need all three, layered. We publish separate pages for intelligent automation and robotic process automation because they are genuinely separate purchases, not because the taxonomy looks tidier that way.',
      },
      {
        q: 'Do we need a low-code platform, or could this just be built normally?',
        a: 'Sometimes normally is right, and we will say so.\n\nLow-code earns its license cost when the process will keep changing, when business teams need to make some of those changes themselves, and when you need several applications rather than one. The value is in the release cadence and the shared component library, not in the drag-and-drop.\n\nIt is the wrong choice when the application has an unusual interface, needs performance characteristics the platform will not give you, or is a single build that will be touched once a year. Paying platform licensing forever for one static application is a bad trade, and it is a trade a lot of organizations make because the platform was already on the estate.\n\nThe honest test is how many changes you expect in the first two years. Few changes and one application: build it conventionally. Many changes across several processes: the platform pays for itself, mostly through the change queue you no longer have.',
      },
      {
        q: 'How do we stop low-code becoming the next shadow IT problem?',
        a: 'By deciding, before the first application, who is allowed to build what \u2014 and by giving them somewhere sanctioned to do it.\n\nThe estates that go wrong are the ones where licenses were distributed and governance was not. Two years later there are several hundred applications, no inventory, no owner for most of them, and a handful holding data they were never assessed to hold.\n\nWhat works is a tiered model. Personal productivity applications are unrestricted. Team applications require registration and a named owner. Anything touching customer data, a system of record or a regulated process goes through a review gate and is built from approved components in managed environments. Platform teams own the boundary; business teams own the applications inside it.\n\nNone of this is technically hard. It is unpopular to introduce afterwards, which is why it belongs in the first engagement rather than the third.',
      },
      {
        q: 'Can you automate a process without replacing our ERP?',
        a: 'Yes, and in most engagements that is the entire point.\n\nCore systems are not the problem. The problem is nearly always the space between them \u2014 the handoff where a case leaves one system, spends four days in a mailbox, and re-enters another. Nobody owns that space, so no system reports on it, and it does not appear in any process document.\n\nWe extend rather than replace: an application layer over the core system for the parts of the journey it does not cover, integration by API or event where those exist, and a case record that holds state across all of it. The ERP keeps doing what it does well, which is being the system of record.\n\nThis is also the cheaper answer by a wide margin. Core replacement is a multi-year program with its own risk profile. Closing the gap around it is usually measured in months.',
      },
      {
        q: 'How long before the first process is actually live?',
        a: 'For a single process of moderate complexity, four to eight weeks from an agreed design to real users on a production application. Discovery and redesign add two to four weeks in front of that.\n\nWhat moves the number is rarely the build. It is integration access to core systems, security review, and how many exception paths the process really has \u2014 which is almost always more than the process owner believes at the start, and is precisely what discovery exists to establish.\n\nWe would rather agree a narrower first release that goes live than a complete one that slips. A process handling the common path in production, with exceptions still routed to a queue, teaches you more in a fortnight than another month of design workshops will.',
      },
      {
        q: 'What actually happens to the exceptions?',
        a: 'This is the question that separates a working digital process from a demonstration, and it is worth being blunt about.\n\nIn a badly designed process the exceptions leave the automated path and re-enter as email. Everything measurable happens on the happy path, so the reporting looks excellent while the cycle time and the audit gap both sit in the exception flow that nobody instrumented.\n\nWe design exception paths at the same time as the main path, not after go-live. An exception stays inside the case: it keeps its record, its owner and its clock, it appears in the same reporting, and escalation is a designed transition rather than somebody remembering to chase it.\n\nThe number to hold us to is the share of cases completing without human touch, measured against the baseline taken before anything was built. A process that reaches a high straight-through rate by pushing the difficult cases into a mailbox has moved the work rather than removed it.',
      },
      {
        q: 'How do you handle steps that genuinely need a human decision?',
        a: 'You design them as first-class steps rather than as the place automation gave up.\n\nA human decision point needs four things: the context assembled so the person is not opening five systems to decide, a clear boundary on what they are deciding, a record of what they chose and why, and a timer so the case does not sit indefinitely waiting for someone on leave.\n\nWhere AI is involved we add a confidence threshold. Above it the system proceeds; below it the case routes to review with the model output shown as a suggestion rather than a decision. Thresholds get tuned against real outcomes rather than set once at launch.\n\nThe failure mode is a review queue that becomes a dumping ground. If most cases end up in it, the automation is not working and the answer is to fix the design, not to hire more reviewers.',
      },
      {
        q: 'Who owns the applications after you leave?',
        a: 'You do, and we build on that assumption from the first sprint rather than negotiating it at handover.\n\nThat means applications built from a documented component library rather than one-off patterns, environments and releases set up as your platform team would run them, decision logic held in rules that a business analyst can read, and runbooks covering the failure modes we actually hit during the build.\n\nIt also means training your people during delivery rather than in a week at the end. Citizen developers and process owners who watched the application being built support it considerably better than ones handed a document.\n\nIf you would rather not own it, our managed operations package exists and is priced separately. What we will not do is leave you in a position where continuing to pay us is the only way the process keeps running.',
      },
      {
        q: 'What does this cost, and how is it priced?',
        a: 'We are pre-launch and we do not publish rate cards, so treat anything below as shape rather than a quote.\n\nA discovery and redesign engagement on a single process is a fixed-price piece of work measured in weeks. An application build is priced against the design that discovery produced, which is the main reason we prefer not to quote a build before discovery has run \u2014 the estimate would be a guess and both sides would find out in month three.\n\nPlatform licensing is a separate line and goes to the vendor, not to us. We will tell you when you already hold entitlements that cover the work, which is more often than vendors volunteer.\n\nManaged operations is a monthly service level. The one commitment we will make on price is that discovery is scoped so you can stop after it, with a design you own, and take the build elsewhere or nowhere.',
      },
      {
        q: 'Our process is not documented anywhere. Where do we start?',
        a: 'That is the normal starting condition, and in some ways it is a better one than a thick process document that turns out to be aspirational.\n\nWe start from evidence rather than description: system logs, ticket and mailbox metadata, and observed task work. That produces how the process actually runs, including the variants nobody mentions in a workshop because they are considered obvious or slightly embarrassing.\n\nWorkshops still happen, but afterwards, to explain what the data showed. The conversation is far more productive when it starts from a map both sides can see rather than from competing recollections.\n\nTwo weeks of this is usually enough to size the opportunity, and it is a considerably cheaper way to discover that a process is not worth automating than finding out during the build.',
      },
      {
        q: 'How is a digitized process evidenced for auditors and regulators?',
        a: 'Per case, and it is one of the strongest arguments for doing this at all.\n\nA case record carries who did what and when, which rule version fired, what the system decided, every point a person overrode it and on what basis, and the documents attached at each step. Retention and access controls sit on the record rather than on whichever mailbox happens to hold the thread.\n\nCompare that with the alternative, which is reconstructing a case from mailboxes and memory on the assumption that the people involved still work here. Most organizations only discover how weak that is during an actual investigation.\n\nWhere AI or agents participate, the same standard applies: what was proposed, what confidence it carried, whether a human accepted it, and whether the decision can be replayed. An automated decision you cannot explain is a finding waiting to be written.',
      },
      {
        q: 'Where do AI agents realistically fit in this?',
        a: 'Inside a process that already has structure. Not as a way of avoiding building one.\n\nAgents are genuinely useful for the work between the steps: reading unstructured input, assembling context, drafting a response, deciding which of several defensible paths a case should take. That is real, and it removes work no rules engine was ever going to remove.\n\nWhat they do not do is substitute for the case record, the audit trail and the escalation path. An agent operating over a process that lives in a mailbox produces fast decisions nobody can evidence, which in a regulated process is worse than the slow version.\n\nSo the sequence matters: digitize, orchestrate, then introduce agents inside defined boundaries with permissioned actions, autonomy thresholds, traceable decisions and a rollback path. Our agentic capability area sets out what that governance actually consists of. Enterprises that run it in the other order tend to arrive back at this page about a year later.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // Automation Strategy & Center of Excellence is the first package rather
    // than the first capability area. Eight of its ten sub-capabilities are
    // already published on /services/intelligent-automation, and procurement
    // looks for strategy and CoE under "how do we buy this" in any case. Same
    // content, correct section, no duplication.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Where this usually starts,',
    engagementHeadingHighlight: 'and where it ends up.',
    engagementLede: 'Almost nobody starts with a program. They start with one process that has become impossible to defend, and the program follows if the first one works.',
    servicePackages: [
      {
        name: 'Automation Strategy & CoE',
        description: 'The operating model, not the software. Which of your processes are worth the money, who is allowed to build, what governance applies, and how this scales past the first three without producing an estate nobody owns.',
        deliverables: [
          'Automation maturity and readiness assessment',
          'Opportunity portfolio, prioritized on volume, exception rate and cost of error',
          'Business case and funding model per candidate process',
          'Center of Excellence design: roles, standards, intake and review gates',
          'Change and workforce enablement plan',
        ],
      },
      {
        name: 'Process Discovery & Redesign',
        description: 'Two to four weeks establishing how the process actually runs, then redesigning it before anyone digitizes anything. Frequently ends by recommending a smaller build than the one you asked us to price.',
        deliverables: [
          'Discovery from system logs and task observation, not workshops alone',
          'Conformance analysis against the documented process',
          'Target journey design with exception paths defined up front',
          'Application gap assessment: what needs building, what needs extending',
          'Baseline metrics and an agreed target straight-through rate',
        ],
      },
      {
        name: 'Digital Application Build',
        description: 'Closing the gap. Forms, portals, case interfaces and the applications the process needed and never got, built on your low-code platform where one exists and on a selected one where it does not.',
        deliverables: [
          'Platform selection, or build on the platform you already license',
          'Digital forms, portals and case-management interfaces',
          'Reusable component library and design standards',
          'Environment, release and lifecycle management setup',
          'Accessibility conformance and cross-device testing',
        ],
      },
      {
        name: 'Orchestration & Integration',
        description: 'Connecting the new front end to the systems you are keeping. Your ERP, CRM, core platforms, rules engines, document services, existing bots and AI services, joined into one flow with a single record of state.',
        deliverables: [
          'End-to-end workflow and case orchestration',
          'Integration to ERP, CRM and core systems by API or event',
          'Decision and rules implementation with versioned logic',
          'Routing, SLA, escalation and human review points',
          'Per-case audit trail and process observability',
        ],
      },
      {
        name: 'Managed Process Operations',
        description: 'Running it afterwards under an agreed service level, including the platform, the integrations and the change queue. For teams who want the process without standing up a product team behind it.',
        deliverables: [
          'Application and integration monitoring with proactive maintenance',
          'Change requests handled inside a governed release cycle',
          'Conformance and straight-through rate reporting against baseline',
          'Platform version upgrades and license optimization',
          'Support for your citizen developers and process owners',
        ],
      },
    ],

    // ── Industry ────────────────────────────────────────────────────────────
    // Twelve sectors from the source list, written at the application-gap layer
    // rather than the task layer. The obvious framing -- KYC automation, claims
    // triage, prior authorization -- is what /services/intelligent-automation
    // already publishes, and reusing it would rebuild the cannibalization
    // between the two pages that this whole rewrite exists to prevent.
    //
    // So every card answers one question instead: which high-volume process in
    // this sector is still running without a system of its own?
    industryHeading: 'Digital Process Automation',
    industryHeadingHighlight: 'by Industry.',
    industryLede: 'Every sector has one \u2014 high volume, business-critical, and running out of a shared mailbox because it was never quite worth a project. These are the ones we get called about.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Onboarding, credit and complaint processes spanning a core banking platform, a CRM and three spreadsheets nobody will admit to.',
        items: ['Client onboarding and periodic review journeys', 'Credit application and approval workflows', 'Complaint handling against regulatory clocks'],
      },
      {
        industry: 'Insurance',
        headline: 'Claims and underwriting cases that stay open for weeks and change hands four times before anyone decides anything.',
        items: ['Claims case management from notification to settlement', 'Underwriting referral and approval journeys', 'Broker and intermediary self-service portals'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Administrative work around care, where the clinical systems will not be replaced and should not be.',
        items: ['Referral and authorization case handling', 'Patient intake and consent digitization', 'Regulated document workflows with signature'],
      },
      {
        industry: 'Manufacturing',
        headline: 'Shop-floor and supplier processes still moving on paper forms, scanned attachments and email approvals.',
        items: ['Non-conformance and corrective action cases', 'Engineering change request and approval flows', 'Supplier onboarding and qualification portals'],
      },
      {
        industry: 'Automotive',
        headline: 'Warranty, recall and dealer processes crossing OEM systems and a dealer network that uses none of them.',
        items: ['Warranty claim submission and adjudication', 'Recall campaign tracking and dealer workflows', 'Dealer and supplier self-service portals'],
      },
      {
        industry: 'Retail & Consumer Goods',
        headline: 'Returns, disputes and supplier processes where the exception volume is not an edge case, it is the process.',
        items: ['Returns, claims and dispute case handling', 'Supplier onboarding and product data workflows', 'Store task management and compliance checks'],
      },
      {
        industry: 'Technology & Telecommunications',
        headline: 'Order-to-activate journeys crossing provisioning, billing and field systems that were each bought separately.',
        items: ['Order capture and service activation orchestration', 'Fault and service request case management', 'Partner and channel onboarding portals'],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'Connection, field and compliance processes with statutory timers attached to each of them.',
        items: ['New connection and metering journeys', 'Outage and incident case workflows', 'Permit, inspection and compliance evidence'],
      },
      {
        industry: 'Logistics & Supply Chain',
        headline: 'Exception handling across carriers, customs and customers, currently living in a shared mailbox with no state.',
        items: ['Shipment exception and claim workflows', 'Customs documentation and clearance processes', 'Carrier and vendor onboarding'],
      },
      {
        industry: 'Government & Public Sector',
        headline: 'Citizen services where a digital front end exists and the back office behind it does not.',
        items: ['Application, licensing and permit journeys', 'Casework against statutory response times', 'Accessible digital forms and status transparency'],
      },
      {
        industry: 'Travel & Hospitality',
        headline: 'Disruption and service recovery processes measured in minutes, currently coordinated by phone.',
        items: ['Disruption and rebooking case handling', 'Guest service request workflows', 'Supplier and property onboarding'],
      },
      {
        industry: 'Professional Services',
        headline: 'Engagement, risk and billing processes that partners run out of their own inboxes because no system was built for them.',
        items: ['Client and matter onboarding journeys', 'Conflict checks and risk approval workflows', 'Time, expense and billing exception handling'],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Not "before Kangqore vs after Kangqore". Both columns describe a process
    // that genuinely got faster; they differ on whether the work now has a
    // system to live in. That is the only honest way to run this comparison,
    // because automating around a gap is a legitimate choice when the gap is
    // small -- and this page should say so rather than pretend otherwise.
    comparisonTable: {
      eyebrow: 'WHERE PROCESS AUTOMATION GOES WRONG',
      heading: 'Automating the Task, or Digitizing the Process.',
      lede: 'Both columns describe a process that got measurably faster. Only one of them gave your work somewhere to live.',
      beforeLabel: 'AUTOMATING AROUND THE GAP',
      afterLabel: 'CLOSING THE APPLICATION GAP',
      afterBadge: 'KANGQORE',
      beforeShort: 'AROUND IT',
      afterShort: 'THROUGH IT',
      rows: [
        {
          dimension: 'Where the work actually lives',
          before: 'In a shared mailbox, a network drive and a spreadsheet one person maintains and nobody else fully understands.',
          after: 'In an application, with a record per case that has a state, an owner, a history and somewhere for the next person to pick it up.',
        },
        {
          dimension: 'When a field or a rule needs to change',
          before: 'A change request, a queue and a quarter. Teams route around the delay with another spreadsheet, and that spreadsheet becomes permanent.',
          after: 'A change in the platform, tested and released inside a governed release process, in days rather than in the next planning cycle.',
        },
        {
          dimension: 'What happens to the exceptions',
          before: 'They leave the automated path and re-enter as email. That is where the cycle time goes, and where the audit trail stops.',
          after: 'They stay inside the case with an SLA, an owner and an escalation path, because the exception was designed rather than discovered in production.',
        },
        {
          dimension: 'When an auditor asks how one case was handled',
          before: 'Reconstructed from mailboxes and memory, assuming the people involved still work here and the mailbox was never archived.',
          after: 'A per-case trail: who did what and when, which rule fired, what the system decided, and every point a person overrode it.',
        },
        {
          dimension: 'Who is allowed to build',
          before: 'Anyone with a license, which is how an organization ends up with four hundred small applications and an owner for none of them.',
          after: 'Business teams build inside guardrails \u2014 approved components, managed environments, a review gate \u2014 with a platform team owning the boundary rather than the backlog.',
        },
        {
          dimension: 'What the program is measured on',
          before: 'Number of processes automated and hours notionally saved, which counts activity rather than result.',
          after: 'Straight-through rate and time to resolution per case, against a baseline captured before anything was built.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Compressed from the seven-stage source lifecycle to five, because the
    // template renders architectureNodes as a four-column grid unless the array
    // is exactly five, and seven nodes leave three orphans on the last row.
    // Automate and Intelligently Execute both sit inside Orchestrate: they are
    // things you connect into the flow, not stages the program passes
    // through. Discover, Design, Digitize and Optimize survive unchanged.
    architectureEyebrow: 'THE AUTOMATION LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Discover to Optimize.',
    architectureLede: 'Five stages, run as a loop rather than as a project plan. Most engagements start at Discover and stop being sequential shortly after Digitize.',
    architectureNodes: [
      {
        title: 'Discover',
        icon: 'Radar',
        description: 'Establish how work moves through your organization today, from system logs rather than from the process document. The two rarely agree, and the gap between them is usually where your business case is.',
        features: [
          'Process and task discovery',
          'Conformance against the documented process',
          'Handoff, waiting and rework analysis',
          'Application gap identification',
          'Baseline metrics for later comparison',
        ],
      },
      {
        title: 'Design',
        icon: 'Layers',
        description: 'Redesign the journey before digitizing it. Digitizing a process nobody rethought gives you a faster version of the same bad path, which is the most common way this work disappoints.',
        features: [
          'Target journey and service design',
          'Decision and rule modeling',
          'Exception paths designed up front',
          'Role, ownership and approval design',
          'Target straight-through rate agreed',
        ],
      },
      {
        title: 'Digitize',
        icon: 'Zap',
        description: 'Close the application gap. Build the forms, portals and case interfaces your process needs \u2014 on a low-code platform where that fits, in pro-code where it does not.',
        features: [
          'Digital forms and capture interfaces',
          'Case and work-management applications',
          'Customer and partner portals',
          'Document generation and signature',
          'Accessibility and device coverage',
        ],
      },
      {
        title: 'Orchestrate',
        icon: 'Network',
        description: 'Connect your people, core systems, rules, bots and AI into one flow with a single record of state. This is the stage where the process stops being a relay between inboxes.',
        features: [
          'End-to-end workflow and case orchestration',
          'ERP, CRM and core system integration',
          'Rules, routing and escalation',
          'Bots and AI called as steps in the flow',
          'Human-in-the-loop review points',
        ],
      },
      {
        title: 'Optimize',
        icon: 'TrendingUp',
        description: 'Measure against the baseline taken at Discover, and keep measuring. Your digitized process drifts exactly as the manual one did \u2014 only faster, and far more quietly.',
        features: [
          'Conformance monitoring against the design',
          'Straight-through rate and SLA tracking',
          'Variant and deviation analysis',
          'Benefit realization against the baseline',
          'Next-process prioritization',
        ],
      },
    ],

    capabilitiesLabel: 'DIGITAL PROCESS AUTOMATION SERVICES',
    capabilitiesSectionTitle: 'Digital Process Automation',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Give your process an application, hold its state, connect it to the systems you are never going to replace, and prove it still runs the way you designed it six months later.',
    capabilityAreas: [
      {
        title: 'Process Digitization & Digital Experience',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The process as the people in it actually meet it \u2014 a form, a portal, an approval on a phone, a status page that stops them calling you to ask. Where this layer is missing, your process is an inbox.',
        items: [
          'Digital Forms & Data Capture',
          'Self-Service Portals',
          'Customer Onboarding Journeys',
          'Employee Experience Applications',
          'Omnichannel Process Entry',
          'Mobile & Field Process Interfaces',
          'Guided Task & Wizard Interfaces',
          'Document Generation & E-Signature',
          'Status Transparency & Notifications',
          'Straight-Through Processing Design',
          'Accessibility & Usability Standards',
          'Multilingual Process Interfaces',
        ],
      },
      {
        title: 'Low-Code Platforms & Citizen Development',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The platform those applications are built on, and the guardrails deciding who in your organization is allowed to build. Low-code estates fail as a governance problem far more often than as a technical one.',
        items: [
          'Low-Code & No-Code Platform Selection',
          'LCAP Implementation & Configuration',
          'Custom Business Application Development',
          'Reusable Component & Template Libraries',
          'Environment, Release & ALM Setup',
          'Citizen Development Enablement',
          'Fusion Team Operating Models',
          'Application Governance & Guardrails',
          'Shadow IT Discovery & Consolidation',
          'Licensing & Consumption Management',
          'Platform Security & Access Design',
          'Pro-Code Extension Patterns',
        ],
      },
      {
        title: 'Workflow, Case & Decision Orchestration',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Work that does not finish in one transaction \u2014 a claim, an application, an investigation, an onboarding. Cases wait, branch, escalate and get reassigned, and something in your estate has to hold state through all of it.',
        items: [
          'End-to-End Process Orchestration',
          'Adaptive & Dynamic Case Management',
          'Business Rules & Decision Engines',
          'DMN Decision Modeling',
          'Approval & Delegation Hierarchies',
          'SLA, Timer & Escalation Management',
          'Long-Running Process State',
          'Compensation & Rollback Handling',
          'Parallel & Conditional Branching',
          'Queue, Routing & Work Allocation',
          'Human-in-the-Loop Task Design',
          'Per-Case Audit Trail & Observability',
        ],
      },
      {
        title: 'Application Modernization & System Extension',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Closing the application gap rather than automating around it. The process is usually broken where two of your systems meet and nobody owns the join, which is exactly where a bot papers over the problem.',
        items: [
          'ERP Process Extension',
          'Mission-Critical System Extension',
          'Legacy Application Modernization',
          'Core System Wrappers & Facades',
          'API Enablement for Process Access',
          'Event-Driven System Integration',
          'Cross-System Data Synchronization',
          'Master Data Alignment for Processes',
          'Integration Platform Setup',
          'Application Rationalization',
          'Spreadsheet & Mailbox Process Migration',
          'Phased Replacement of Manual Interfaces',
        ],
      },
      {
        title: 'Process Intelligence & Conformance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Whether the digitized process runs the way it was designed. Discovery is the easy half and is covered on our intelligent automation service; conformance is the half that tells you the redesign did not hold.',
        items: [
          'Process Conformance Checking',
          'Variant Analysis',
          'Process Simulation & What-If Modeling',
          'Digital Twin of the Process',
          'Handoff & Waiting-Time Analysis',
          'Rework & Loop Detection',
          'Straight-Through Rate Measurement',
          'Deviation & Exception Analytics',
          'SLA Breach Root-Cause Analysis',
          'Process Baseline & Target Modeling',
          'Post-Deployment Benefit Tracking',
          'Benefit Realization Reporting',
        ],
      },
      {
        title: 'Intelligent Process Automation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Intelligence inside the digital process rather than beside it: reading what arrives unstructured, deciding what can be decided, and handing the rest to one of your people with the context already assembled.',
        items: [
          'Document Understanding in Workflow',
          'Unstructured Input Classification',
          'Data Extraction & Validation at Intake',
          'Conversational Process Entry',
          'AI-Assisted Form Completion',
          'Next-Best-Action Recommendations',
          'Intelligent Work Routing',
          'Anomaly & Risk Flagging in Process',
          'Generative Summarization for Case Workers',
          'Drafting & Correspondence Assistance',
          'Confidence Thresholds & Fallback Paths',
          'Human Review Queue Design',
        ],
      },
      {
        title: 'Agentic & Autonomous Process Execution',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Goal-driven execution inside a governed process rather than along a fixed path. The interesting engineering is not the agent; it is the boundary you allow it to act within, and the record it leaves behind.',
        items: [
          'Goal-Driven Process Execution',
          'Multi-Agent Process Coordination',
          'Dynamic Path Planning',
          'Agent Access to Process Systems',
          'Tool & Action Permissioning',
          'Autonomy Levels & Escalation Thresholds',
          'Agent-to-Human Handback',
          'Policy Enforcement at Execution Time',
          'Decision Traceability & Replay',
          'Simulation Before Live Execution',
          'Kill Switches & Rollback Paths',
          'Continuous Evaluation of Agent Behavior',
        ],
      },
    ],

    closingCta: {
      title: 'One process,',
      highlight: 'mapped end to end.',
      body: 'Bring the one that runs on a shared mailbox. In 30 minutes we will tell you where the work actually waits, whether it needs an application or just a tidier spreadsheet, and what closing the gap is worth \u2014 before anyone writes any code.',
      proofLabel: 'From first call to a costed process design',
    },
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
      { illustrative: true, title: 'Operational Cost', desc: 'Average cost reduction achieved across IT and business process automation programs delivered by Kangqore.', value: '40',   suffix: '%',    metricLabel: 'Cost Reduction',   icon: 'Target'    },
      { illustrative: true, title: 'Bot Accuracy',     desc: 'Execution accuracy across finance, HR, and insurance workflows — virtually eliminating manual processing errors.',  value: '99.8', suffix: '%',    metricLabel: 'Bot Accuracy',     icon: 'Shield'    },
      { illustrative: true, title: 'POC Delivery',     desc: 'Time from engagement kickoff to a working automation POC — output before you commit to full-scale deployment.',     value: '5–7',  suffix: ' Day', metricLabel: 'POC Speed',        icon: 'Zap'       },
      { illustrative: true, title: 'Scalability',      desc: 'Enterprise scale multiplier — bots replicated across functions without proportional cost increase.',                value: '10',   suffix: 'x',    metricLabel: 'Bot Scalability',  icon: 'TrendingUp'},
    ],
  },

  'business-process-management': {
    slug: 'business-process-management',
    name: 'Business Process Management',
    departmentSlug: 'cognition',
    bannerBrand: 'eQORE\u2122',
    shortDescription: 'Redesigning, standardizing and governing the processes an enterprise runs on',
    fullDescription: 'Reengineer end-to-end processes, standardize them across markets, implement the platforms that run them, and govern performance from a Center of Excellence.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard; big-data
    // and digital-process-automation both widen it to the same 760/880.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Process reengineering', 'Global process ownership', 'BPM platforms', 'Process governance', 'Center of Excellence'],
    relatedServiceSlugs: ['digital-process-automation', 'intelligent-automation', 'robotic-process-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',

    // ── Positioning ─────────────────────────────────────────────────────────
    // This page rendered the Cognition parity default -- the AI Governance
    // taxonomy with the service name substituted in, six generic FAQs, and a
    // crawler seeing 6.8 per cent of the page.
    //
    // Fourth of the four automation services, so the wedge matters more here
    // than anywhere. The supplied taxonomy measured 38 per cent overlap against
    // intelligent-automation and digital-process-automation, concentrated in
    // "Intelligent Automation & AI" (7 of 13 items) and "Process Advisory"
    // (6 of 12). Building it as given would have made this the fourth page
    // saying the same thing.
    //
    // The split now reads:
    //   BPM  -- the discipline. Reengineering, operating model, global process
    //           ownership, BPM platforms, governance, CoE, process performance.
    //   DPA  -- low-code applications, digital forms and portals, case
    //           management, closing the application gap.
    //   IA   -- bots and intelligence: RPA at scale, IDP, cognitive.
    //   RPA  -- task-level automation.
    //
    // Global process ownership and multi-country harmonization are the
    // MNC-specific territory nothing else on the site covers, and they are
    // where a group process officer at a multinational actually spends the
    // budget. HCLTech's page has four pillars -- advisory, modernization,
    // platform implementation, CoE -- and no equivalent.
    //
    // Value streams replace the usual industry grid. Procure-to-Pay,
    // Order-to-Cash, Record-to-Report and Hire-to-Retire are how process work
    // is scoped and funded inside a multinational; sector cards are not.
    heroTitle: 'Business Process Management\nfor the Global Enterprise',
    whatIsEyebrow: 'What business process management actually is',
    // The full service name alone measures 724px in an 896px box, so it is
    // the floor on how narrow this heading can be -- no line-2 wording
    // shortens the block. The abbreviation drops the widest line to 521px.
    // The entity is not lost: the eyebrow directly above carries the full
    // name, and BPM is itself a query term people type.
    whatIsTitle: 'BPM for Multi-Market',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'Enterprise Operations.',
    whatIsPara2: 'Business process management is the discipline of designing, standardizing, governing and continuously improving the cross-functional processes an enterprise runs on. It is an operating model question before it is a technology one \u2014 which is why buying a platform first so rarely resolves it.',
    whatIsPara3: 'The complexity is structural rather than accidental. A single order-to-cash cycle in your group can cross four functions, three ERP instances, two shared service centers and a dozen handoffs that exist because of an acquisition nobody has unwound. Every step has an owner who can demonstrate that their step is fast. The elapsed time your customer actually experiences belongs to nobody.',
    whatIsPara4: 'Kangqore closes that gap. We combine process engineering, operating model design, workflow and case platforms, automation and controls into one connected design, then put a named owner, a measured baseline and a per-case audit trail behind it \u2014 from discovery and reengineering through implementation on Appian, Pega, ServiceNow or Camunda, to a Center of Excellence that keeps improving your processes after we leave.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Not cycle time and bot uptime -- those belong to intelligent-automation,
    // and repeating them would say the two services do the same work. These
    // four are what a group process owner is actually held to: how much of the
    // estate runs one way, how long a cycle takes, how much is caught by
    // control rather than by audit, and how fast a change reaches every market.
    outcomesEyebrow: 'WHAT A GROUP PROCESS OWNER IS MEASURED ON',
    outcomesHeading: 'Four numbers that decide',
    outcomesHeadingHighlight: 'whether the program continues.',
    businessMetrics: [
      { illustrative: true, title: 'Process Standardization', desc: 'Share of a value stream running one standard global design after harmonization, against the number of local variants found at discovery.', value: '75',  suffix: '%',    metricLabel: 'Variants Retired',        icon: 'Layers'   },
      { illustrative: true, title: 'End-to-End Cycle',        desc: 'Reduction in elapsed time across a full value stream, measured door to door rather than step by step.',                                    value: '45',  suffix: '%',    metricLabel: 'Faster End to End',      icon: 'Zap'      },
      { illustrative: true, title: 'Control Effectiveness',   desc: 'Process controls evidenced automatically from the workflow rather than assembled by hand ahead of an audit.',                              value: '90',  suffix: '%',    metricLabel: 'Controls Evidenced',     icon: 'ShieldCheck'},
      { illustrative: true, title: 'Change Lead Time',        desc: 'Typical time to take an approved process change live across every market on a governed platform, rather than market by market.',            value: '2\u20134', suffix: ' Wks', metricLabel: 'Change to Every Market', icon: 'Globe'    },
    ],

    // ── Key terms ───────────────────────────────────────────────────────────
    // Experimental section, sitting between the definition and the eQORE
    // concierge. Delete this key and the section disappears.
    //
    // The rationale is entity coverage rather than reader education. This page
    // uses a dozen terms that carry real search volume and appear nowhere else
    // on the site -- procure-to-cash cycle names, conformance, variant
    // register, global process owner. Defining them in a real definition list
    // gives each one a term-and-definition pair an extractor can lift, which is
    // the shape answer engines want for "what is order-to-cash" style queries.
    //
    // Deliberately no overlap with the FAQ: the FAQ answers decisions, this
    // answers vocabulary.
    keyTerms: {
      eyebrow: 'THE VOCABULARY ON THIS PAGE',
      title: 'BPM terms,',
      titleHighlight: 'defined.',
      lede: 'Twelve terms this page uses as though everyone shares them. Several mean different things at different firms, so these are the definitions we work to.',
      terms: [
        {
          term: 'Value stream',
          definition: 'The full sequence of work that delivers one outcome, from trigger to completion, regardless of which functions or systems it passes through. The unit BPM is scoped and funded in \u2014 not a department, and not a single system.',
        },
        {
          term: 'Procure-to-Pay (P2P)',
          definition: 'Requisition through to supplier payment: sourcing, purchase order, goods receipt, invoice matching and settlement. Usually the first value stream a group standardizes, because the variance is expensive and rarely defensible.',
        },
        {
          term: 'Order-to-Cash (O2C)',
          definition: 'Customer order through to cash collected: order capture, fulfillment, invoicing, collections and dispute handling. The value stream most often cited in a board pack, and the one that crosses the most functions.',
        },
        {
          term: 'Record-to-Report (R2R)',
          definition: 'Transaction capture through to statutory and management reporting, including the period close. The value stream where local statutory variation is most often legitimate rather than habitual.',
        },
        {
          term: 'Hire-to-Retire (H2R)',
          definition: 'Recruitment through to exit: onboarding, workforce administration, payroll inputs, changes and offboarding. Touches employment law in every jurisdiction, which makes it the hardest to standardize globally.',
        },
        {
          term: 'Global process owner',
          definition: 'A named person accountable for one value stream end to end, across every market, with the authority to change how another function works. A role with a mandate rather than a title added to an existing job. Where this role does not exist, standardization does not hold.',
        },
        {
          term: 'Variant register',
          definition: 'The maintained list of every approved local deviation from the global standard, each carrying the regulation or contract requiring it, an owner and a review date. Undocumented deviation is the usual reason a global process program is judged a failure two years later.',
        },
        {
          term: 'Straight-through processing',
          definition: 'The share of cases that complete end to end with no human intervention. The honest measure of an automation program, and the one that exposes work merely moved into an exception queue rather than removed.',
        },
        {
          term: 'Conformance',
          definition: 'Whether the process as executed matches the process as designed, measured from event logs rather than asserted. Discovery tells you how work runs today; conformance tells you whether your redesign survived contact with a market.',
        },
        {
          term: 'BPMN and DMN',
          definition: 'Open standards for modeling processes and decisions respectively. Both are executable, not just diagrams \u2014 which matters because a model that cannot run drifts from the process it claims to describe within a quarter.',
        },
        {
          term: 'Target operating model',
          definition: 'How work will be organized after transformation: roles, ownership, decision rights, and the split between onshore, offshore and shared service delivery. Decided before any platform, because the platform encodes it.',
        },
        {
          term: 'Center of Excellence (CoE)',
          definition: 'The standing capability that carries process work after a program closes \u2014 intake, prioritization, standards, reusable assets and trained practitioners. Its absence is the most common reason a successful first wave produces no second one.',
        },
      ],
    },

    heroBadge: 'Reengineered. Standardized. Governed.',
    heroStripItems: [
      'Process Reengineering', 'Operating Model Design', 'Global Process Ownership', 'BPM Platforms',
      'Value Stream Transformation', 'Process Controls', 'Performance Management', 'Center of Excellence',
    ],
    hidePartnershipModel: true,

    // ── Capability areas ────────────────────────────────────────────────────
    // Seven areas, written as an enterprise capability catalog: each one is
    // something a group process officer can put on a procurement schedule.
    //
    // The supplied taxonomy had five, of which "Intelligent Automation & AI"
    // was 7 of 13 items already published on /services/intelligent-automation.
    // That area is now "Automation Inside the Managed Process" -- scoped to
    // what BPM owns, orchestration and straight-through design, with the bots,
    // IDP and cognitive depth cross-linked rather than restated. Advisory is
    // narrowed to the BPM-specific half: value-stream analysis, maturity,
    // platform evaluation, business case. Process mining is named once and
    // linked, not rebuilt.
    //
    // Areas 03 and 06 are the multinational-specific territory: global process
    // ownership, multi-country harmonization, statutory local variants, and
    // controls evidenced from the workflow. Neither appears anywhere else on
    // the site, and neither appears on HCLTech's BPM page.
    // ── Toolchain ───────────────────────────────────────────────────────────
    // The platform question is the one a BPM buyer arrives with, and HCLTech
    // answer it with two named accelerators (Advantage Pega, Advantage
    // Appian). We do not have accelerators, so the honest differentiator is
    // telling them what each platform is actually good at and when we would
    // argue against it.
    toolsStack: {
      eyebrow: 'THE PLATFORM LANDSCAPE',
      title: 'The platforms,',
      titleHighlight: 'and what each is actually for.',
      subtitle: 'Platform choice is mostly settled by what the group already licenses and by whether the work is a long-running case or a routed transaction. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Network',
          title: 'Enterprise case and BPM suites',
          managed: 'Pega, Appian',
          selfHosted: 'Appian where case management is the core',
          desc: 'Where work is a long-running case that branches, waits and gets reassigned across weeks. Heavy, expensive and correct for exactly that. Wrong for a routed form, where the licensing alone will end the business case.',
        },
        {
          icon: 'Settings',
          title: 'Enterprise service management',
          managed: 'ServiceNow',
          selfHosted: 'Strongest where IT already runs on it',
          desc: 'Where service management already exists and the ambition is to extend the same workflow discipline beyond IT into HR, finance and facilities. Existing entitlements usually decide this before any evaluation begins.',
        },
        {
          icon: 'Layers',
          title: 'Developer-first workflow engines',
          managed: 'Camunda',
          selfHosted: 'Camunda self-hosted where process is the product',
          desc: 'Where the process is the product and engineering owns it. BPMN and DMN as executable artifacts under version control. Requires an engineering team; it will not be maintained by a business analyst.',
        },
        {
          icon: 'Radar',
          title: 'Process and task mining',
          managed: 'Celonis, Signavio, UiPath Process Mining',
          selfHosted: 'Before the redesign, and again after it',
          desc: 'Used for conformance as much as discovery: proving the standard design survived contact with a market. Most programs mine once, at the start, and never learn whether the redesign held.',
        },
        {
          icon: 'Zap',
          title: 'Automation called from the process',
          managed: 'UiPath, Automation Anywhere, Power Automate',
          selfHosted: 'Engineered on our automation services',
          desc: 'Bots invoked as steps inside a governed process rather than as a parallel estate. The depth sits on our intelligent automation and RPA services; what belongs here is where they are called and who governs them.',
        },
        {
          icon: 'Globe',
          title: 'Integration and core systems',
          managed: 'MuleSoft, Azure Integration Services, Kafka',
          selfHosted: 'Native connectors before middleware',
          desc: 'How the process reaches SAP, Oracle, Workday and Salesforce. Integration access is the critical path on most BPM programs and almost never appears in the plan until it slips.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve BPM questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the questions a group process officer and a CIO open
    // with, and four of them are ones a systems integrator would rather not be
    // asked: what it costs, whether BPM is obsolete, whether the platform is
    // oversized, and whether standardization is even the right answer.
    customFAQs: [
      {
        q: 'What is the difference between BPM, DPA, RPA and intelligent automation?',
        a: 'They are four different purchases and confusing them is expensive.\n\nBusiness process management is the discipline: understanding how work is organized, redesigning it, standardizing it across markets, governing it and measuring it. It is mostly an operating model question and only partly a technology one.\n\nDigital process automation is what you need when a process has no application at all \u2014 the work moves through email and a spreadsheet because nobody ever built the system it should run in. Robotic process automation automates the keystrokes a person performs inside existing applications. Intelligent automation adds AI and document understanding on top of that.\n\nMost multinationals need all four, layered, and in that order. Automating a process nobody has redesigned makes an unmanaged process faster \u2014 which is why programs that start with bots so often arrive back at this page about eighteen months later.',
      },
      {
        q: 'Is BPM not an obsolete category by now?',
        a: 'The tooling generation from the 2000s is largely obsolete. The discipline is not, and the naming has moved on rather than the need.\n\nWhat has genuinely changed: heavyweight suites that took two years to implement have been displaced by lighter workflow engines and low-code platforms; process mining replaced the six-week interview-based discovery exercise; and AI now handles work that previously forced a person into the middle of the flow.\n\nWhat has not changed: a multinational still runs on cross-functional processes that no single function owns, still cannot evidence its controls without effort, and still discovers at audit that one market has been doing it differently for four years. That is the problem this service exists for, whatever the category is called next.',
      },
      {
        q: 'We have forty-three variants of one process across our markets. Where do we start?',
        a: 'By finding out which of the forty-three are statutory and which are habit. In our experience the split is rarely what the local teams state \u2014 in either direction.\n\nProcess mining across entities gives you the actual variant count rather than the reported one, and it is usually higher. Each variant then gets assessed against one question: which regulation, contract or genuine market condition requires this deviation? Variants with an answer go into a maintained register with a named owner and a review date. Variants without one are candidates for retirement.\n\nWhat does not work is a global design imposed without that assessment. It produces visible compliance and invisible workarounds, and you find out at the next audit. The register is the deliverable that matters more than the target design.',
      },
      {
        q: 'How long before the first value stream is live?',
        a: 'Discovery and target design on a single value stream is six to ten weeks. Platform implementation for the first market is a further twelve to twenty, depending on how many core systems it has to integrate with and how long your security review takes.\n\nSubsequent markets are much faster \u2014 typically four to eight weeks each \u2014 provided the variant assessment was done properly the first time. If it was not, market two takes as long as market one and the program quietly becomes a series of local projects.\n\nWhat moves these numbers is almost never the build. It is integration access to core systems, and the availability of the people who understand the current process well enough to say whether a design is workable.',
      },
      {
        q: 'Do we need a BPM platform, or can this run on what we already have?',
        a: 'Frequently you already have one and are not using it. ServiceNow estates often carry workflow entitlements well beyond IT; Microsoft estates carry Power Platform; SAP and Oracle both ship workflow capability that goes unused because nobody configured it.\n\nWe would rather build on entitlements you already hold than sell you a platform decision. Where a dedicated BPM suite genuinely earns its cost is long-running case work \u2014 cases that stay open for weeks, branch, get reassigned and carry a regulatory clock. For a routed approval, a suite is oversized and the licensing will end the business case within two years.\n\nWe are platform-agnostic in the literal sense: we hold no reseller margin on any of these, so a recommendation to use what you have costs us nothing.',
      },
      {
        q: 'How do you handle processes that must differ by country for legal reasons?',
        a: 'By treating the variant as a first-class part of the design rather than as a failure of standardization.\n\nThe global model defines the standard path. Each jurisdiction that needs to deviate gets a registered variant carrying four things: the specific regulation or statutory instrument requiring it, the process steps that differ, a named owner in that market, and a review date. The variant lives in the same platform, under the same controls, and appears in the same reporting.\n\nThis matters more than it sounds. Undocumented local deviation is the single most common reason a global process program is judged a failure two years later \u2014 not because the deviation was wrong, but because nobody could tell which deviations were legitimate.',
      },
      {
        q: 'What does a BPM engagement actually cost?',
        a: 'We are pre-launch and do not publish rate cards, so treat this as shape rather than a quote.\n\nAdvisory and assessment on one value stream is a fixed-price engagement measured in weeks. Reengineering and target operating model design is priced against the scope discovery produced. Platform implementation is priced against the design, which is why we prefer not to quote a build before design exists \u2014 the estimate would be a guess and both sides would discover that in month four.\n\nPlatform licensing is a separate line and goes to the vendor. Where a platform you have already paid for can carry the work, we will say so \u2014 unused workflow entitlements inside a ServiceNow or SAP estate are common and rarely surfaced by anyone with a license quota. The one commitment we make on price is that the assessment is scoped so you can stop after it, own the output, and take the build elsewhere or nowhere.',
      },
      {
        q: 'Who owns the process after you leave?',
        a: 'A named person inside your organization, and if that person does not exist the engagement has failed regardless of what was delivered.\n\nGlobal process ownership is a role with a mandate, not a title added to someone\u2019s existing job. The owner needs the authority to change how another function works, a measured baseline to argue from, and a governance forum that will hear the argument. We design that structure during the operating model work, not at handover.\n\nOn the technology side: platform configuration documented and version-controlled, decision logic held in rules a business analyst can read, runbooks covering the failure modes we actually hit, and your practitioners trained during delivery rather than in a week at the end. Our managed operations option exists and is priced separately \u2014 what we will not do is leave you where continuing to pay us is the only way the process keeps running.',
      },
      {
        q: 'How is this evidenced for auditors and regulators?',
        a: 'Per case, automatically, from the workflow itself.\n\nA governed process produces a per-case record that survives questioning: the sequence of steps taken, the version of the rule set in force at the time, the approvals granted and by whom under which delegation, and the supporting documents as they stood at that moment rather than as amended since. Segregation of duties is enforced by the platform rather than by policy. Control testing samples from live data rather than from a reconstruction.\n\nCompare that with assembling evidence by hand in the fortnight before an audit, from screenshots and people\u2019s recollection of what normally happens. Most groups only discover how weak that is during an actual investigation, and by then the finding is written.',
      },
      {
        q: 'Is standardization always the right answer?',
        a: 'No, and a consultancy that says otherwise is selling you something.\n\nStandardization pays where volume is high, the work is genuinely comparable across markets, and the cost of variance is real \u2014 finance and procurement almost always qualify. It pays much less where local market conditions genuinely differ, where volumes are low, or where the process is a competitive differentiator rather than a cost of doing business. Forcing a global standard onto a sales process that works differently in Japan because the market works differently in Japan destroys value.\n\nThe assessment should tell you which of your value streams are which. If it comes back recommending standardization everywhere, it was not an assessment.',
      },
      {
        q: 'How does AI change this, realistically?',
        a: 'It removes work that previously forced a person into the middle of the flow, and it does not remove the need for the process to be designed.\n\nThe genuine gains sit in the judgment-shaped work rules could never encode: interpreting a supplier\u2019s non-standard invoice, weighing whether a deviation is material, summarizing four systems into the paragraph an approver needs. That is where straight-through rates actually move.\n\nWhat AI does not replace is the case record, the control framework, the escalation path or the owner. Introduced into a process that has those, it works. Introduced into a process that lives across four mailboxes, it produces fast decisions nobody can evidence \u2014 which in a regulated value stream is worse than the slow version.',
      },
      {
        q: 'We tried BPM five years ago and it did not stick. Why would this be different?',
        a: 'Usually it did not stick for one of three reasons, and it is worth establishing which before starting again.\n\nNo owner: three processes were improved, the program closed, and no role existed to carry the next thirty. No baseline: benefits were asserted rather than measured, so when the next budget round came there was nothing to defend. Or the platform was oversized: a two-year suite implementation consumed the appetite before any process reached production.\n\nAll three are avoidable and none of them is a technology problem. That is why our first engagement is an assessment you can stop after, why baselines are captured while the process is still manual, and why we will recommend the platform you already license when it will do the job.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // Named the way a procurement schedule names them. HCLTech's four pillars
    // are advisory, modernization, platform implementation and CoE; a buyer
    // comparing the two pages should find the same four words here, plus the
    // two they do not offer -- global standardization and managed operations.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five engagement models,',
    engagementHeadingHighlight: 'one accountable owner.',
    engagementLede: 'Almost nobody starts with an enterprise program. They start with one value stream the board keeps asking about, and the program follows if the first one holds across two markets.',
    servicePackages: [
      {
        name: 'BPM Advisory & Assessment',
        description: 'Fact-finding before commitment. What your value stream actually costs, how many variants of it exist, where your elapsed time goes, and whether the platform under discussion is larger than your problem.',
        deliverables: [
          'Value stream map with measured cycle time and cost baseline',
          'Process mining output and variant register across markets',
          'Process maturity assessment against sector practice',
          'BPM platform evaluation with a scored recommendation',
          'Business case, investment model and sequenced transformation waves',
        ],
      },
      {
        name: 'Process Reengineering & Operating Model',
        description: 'The redesign itself. Target operating model, global standard design, the variant register that says which local deviations are statutory and which are habit, and the transition plan to get there.',
        deliverables: [
          'Target operating model with roles, ownership and RACI',
          'Global standard process design in BPMN, with DMN decision models',
          'Statutory variant register, each entry carrying its regulation and owner',
          'Exception paths and segregation of duties designed up front',
          'Transition, cutover and change management plan by market',
        ],
      },
      {
        name: 'BPM Platform Implementation',
        description: 'Building it on Appian, Pega, ServiceNow, Camunda or the platform you already license. Includes the integration work to the core systems that are not being replaced, which is usually the critical path.',
        deliverables: [
          'Platform architecture, environments and release management',
          'Workflow, case and business rules implementation',
          'ERP, CRM and core system integration by API or event',
          'Test strategy, UAT management and performance validation',
          'Production transition, hypercare and documented runbooks',
        ],
      },
      {
        name: 'Global Standardization Rollout',
        description: 'Taking a proven design to every market you operate in. This is the phase that decides whether a transformation program produced one process or a new set of local ones, and it is where most of them quietly fail.',
        deliverables: [
          'Regional rollout sequencing with entity-level readiness',
          'Local statutory variant assessment per jurisdiction',
          'Master data and cross-entity alignment',
          'Adoption and conformance measurement by market',
          'Post-merger process integration where entities were acquired',
        ],
      },
      {
        name: 'CoE & Managed BPM Operations',
        description: 'The capability that carries the next thirty processes, and the option to have us run it. For groups that want an operating capability rather than a sequence of consulting engagements you have to keep buying.',
        deliverables: [
          'Center of Excellence design, charter and operating model',
          'Intake, prioritization and process portfolio management',
          'Reusable asset library, standards and design patterns',
          'Practitioner training, certification and CoE maturity roadmap',
          'Managed process operations and platform support under SLA',
        ],
      },
    ],

    // ── Enterprise value streams ────────────────────────────────────────────
    // This slot renders the industry grid on every other service. Here it
    // carries value streams instead, which is a deliberate departure.
    //
    // A multinational does not fund "BPM for retail". It funds Order-to-Cash,
    // or Record-to-Report, or Hire-to-Retire, because that is how the work is
    // scoped, owned and reported. Procure-to-Pay is the unit of procurement on
    // this service in a way that a sector card never is, and none of these
    // terms appears anywhere else on the site.
    //
    // Each card states the structural reason that value stream resists
    // standardization in a group with many entities, which is the question a
    // group process officer is actually trying to answer.
    industryHeading: 'Business Process Management',
    industryHeadingHighlight: 'by value stream.',
    industryLede: 'Six enterprise value streams, and the structural reason each one resists standardization once your group runs more than one entity, ledger or jurisdiction.',
    industryUseCases: [
      {
        industry: 'Finance & Accounting',
        headline: 'Statutory reporting differs by jurisdiction, so a single global design has to carry legitimate local variants without becoming forty-three separate processes.',
        items: ['Procure-to-Pay and invoice exception handling', 'Record-to-Report and the financial close', 'Intercompany reconciliation and statutory reporting'],
      },
      {
        industry: 'Customer Operations',
        headline: 'The customer experiences elapsed time end to end, while every internal measure stops at a functional boundary where cases wait longest.',
        items: ['Customer onboarding and KYC journeys', 'Service request and complaint case management', 'Claims intake, assessment and settlement'],
      },
      {
        industry: 'Supply Chain & Procurement',
        headline: 'Source-to-Pay crosses more third parties than internal functions, and the process has to hold when a supplier follows none of your conventions.',
        items: ['Source-to-Pay and supplier onboarding', 'Purchase requisition and approval hierarchies', 'Order management and fulfillment exceptions'],
      },
      {
        industry: 'Human Resources',
        headline: 'Hire-to-Retire touches employment law in every country you operate in, which makes it the value stream where local variance is most often justified.',
        items: ['Hire-to-Retire and onboarding across entities', 'Workforce administration and payroll inputs', 'Employee case management and service delivery'],
      },
      {
        industry: 'Sales & Revenue Operations',
        headline: 'Lead-to-Cash spans CRM, CPQ, contracting and billing, each bought separately, each convinced it owns the customer record.',
        items: ['Lead-to-Cash and Quote-to-Order orchestration', 'Contract lifecycle and approval workflows', 'Revenue recognition and billing exceptions'],
      },
      {
        industry: 'IT & Enterprise Services',
        headline: 'Service management processes are already governed, which makes them the least painful place to prove a standard design holds across markets.',
        items: ['Incident, request and change management', 'Enterprise service management beyond IT', 'Cross-functional workflow orchestration'],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Not "before us versus after us". Both columns describe programs run by
    // competent people; they differ on whether anybody owns the end-to-end
    // outcome. That is the actual failure mode in a multinational, and it is a
    // governance failure rather than a technology one.
    comparisonTable: {
      eyebrow: 'WHERE ENTERPRISE BPM PROGRAMS STALL',
      heading: 'Every step is owned. The outcome is not.',
      lede: 'Both columns describe a process improvement program staffed by capable people. They differ on what you are left with twelve months after the consultants leave.',
      beforeLabel: 'BPM AS A PROJECT PORTFOLIO',
      afterLabel: 'BPM AS AN OPERATING CAPABILITY',
      afterBadge: 'KANGQORE',
      beforeShort: 'PROJECTS',
      afterShort: 'CAPABILITY',
      rows: [
        {
          dimension: 'Who owns the end-to-end outcome',
          before: 'Each function owns its step and can show that its step is fast. Nobody is accountable for the elapsed time a customer or a regulator actually experiences.',
          after: 'A named global process owner for the whole value stream, with the mandate to change how another function works and a measured baseline to argue from.',
        },
        {
          dimension: 'What happens across markets',
          before: 'One design, then local exceptions granted one at a time until forty-three variants exist and nobody can say which are statutory and which are habit.',
          after: 'A global standard with a documented variant register: each local deviation carries the regulation that requires it, an owner and a review date.',
        },
        {
          dimension: 'How improvement is measured',
          before: 'Benefits stated in a business case, signed off, and never measured again because no baseline was captured while the process was still manual.',
          after: 'Cycle time, cost per transaction, straight-through rate and control effectiveness, baselined at discovery and reported against continuously.',
        },
        {
          dimension: 'When a control is tested',
          before: 'Evidence assembled by hand in the fortnight before the audit, from screenshots, spreadsheets and people\u2019s recollection of what normally happens.',
          after: 'Controls evidenced automatically from the workflow, per case, with the rule version that fired and every point a person overrode it.',
        },
        {
          dimension: 'When the process needs to change',
          before: 'A change request per market, each with its own release cycle, so the same policy change lands over three quarters and never fully lands at all.',
          after: 'Changed once against the global design and released through one governed pipeline, with adoption measured by market rather than assumed.',
        },
        {
          dimension: 'What exists after go-live',
          before: 'A closed program, a slide deck, and three improved processes with no route for the next thirty.',
          after: 'A Center of Excellence with an intake process, a reusable asset library, trained practitioners and a funded portfolio.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Compressed from the seven-stage source lifecycle to five, because the
    // template renders architectureNodes as a four-column grid unless the array
    // is exactly five, and seven leaves three orphans on the last row. Analyze
    // folds into Discover, Orchestrate into Transform. Discover, Design,
    // Transform, Govern and Optimize survive as named stages.
    architectureEyebrow: 'THE BPM LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Discover to Optimize.',
    architectureLede: 'Five stages, run as a continuous capability rather than a program with an end date. Most engagements start at Discover and stop being sequential once the first value stream is live.',
    architectureNodes: [
      {
        title: 'Discover',
        icon: 'Radar',
        description: 'Establish how your enterprise actually operates, from your event logs rather than from your process manual. In a multinational the first useful output is usually the count of variants nobody knew existed.',
        features: [
          'Value stream mapping end to end',
          'Process mining across systems and markets',
          'Variant and complexity analysis',
          'Cost, effort and cycle-time baselining',
          'Control and compliance gap assessment',
        ],
      },
      {
        title: 'Design',
        icon: 'Layers',
        description: 'Redesign around the outcome rather than around your org chart, then decide what is global standard and what is a defensible local variant. That distinction is the whole program in a multinational.',
        features: [
          'Target operating model and role design',
          'Global standard process design',
          'Statutory variant register with owners',
          'Decision and rules modeling',
          'Target metrics agreed before build',
        ],
      },
      {
        title: 'Transform',
        icon: 'Zap',
        description: 'Build it on a platform that can be governed \u2014 Appian, Pega, ServiceNow, Camunda or whatever you already license \u2014 and integrate it to the core systems you are keeping.',
        features: [
          'BPM platform implementation',
          'Workflow, case and decision build',
          'ERP, CRM and core system integration',
          'Automation and straight-through paths',
          'Market-by-market rollout and cutover',
        ],
      },
      {
        title: 'Govern',
        icon: 'ShieldCheck',
        description: 'Put ownership, controls and evidence around it. A process you cannot evidence per case is a finding waiting to be written, however well it performs.',
        features: [
          'Global process owner accountability',
          'Control design, testing and evidence',
          'Segregation of duties and audit trail',
          'KPI framework and operational reporting',
          'Conformance monitoring against the design',
        ],
      },
      {
        title: 'Optimize',
        icon: 'TrendingUp',
        description: 'Run it as a capability. Your standardized process drifts back toward local variance the moment nobody is measuring, and it does so faster than the original divergence took.',
        features: [
          'Continuous improvement backlog and intake',
          'Benefit realization against the baseline',
          'Adoption and conformance by market',
          'Reusable asset library and standards',
          'CoE maturity advancement',
        ],
      },
    ],

    capabilitiesLabel: 'BUSINESS PROCESS MANAGEMENT SERVICES',
    capabilitiesSectionTitle: 'Business Process Management',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Understand how your enterprise actually runs, redesign it around the outcome rather than your org chart, standardize it across your markets, run it on a platform you can govern, and keep improving it after we leave.',
    capabilityAreas: [
      {
        title: 'Process Advisory & Process Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Establishing what is true before anything is redesigned. Your process document states an intent; your event log states what happened. Transformation budgets should be set against the second one.',
        items: [
          'BPM Strategy & Transformation Roadmap',
          'Value Stream Analysis',
          'End-to-End Process Discovery',
          'Process Mining & Conformance',
          'Current-State & Target-State Assessment',
          'Process Maturity Assessment',
          'BPMN & DMN Process Modeling',
          'Process Cost & Effort Baselining',
          'Variant & Complexity Analysis',
          'Benchmarking Against Sector Practice',
          'BPM Platform Evaluation & Selection',
          'Business Case & Investment Modeling',
          'Transformation Sequencing & Waves',
        ],
      },
      {
        title: 'Process Reengineering & Operating Model Design',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The core discipline. Redesigning how your work is organized rather than making the existing arrangement faster \u2014 which is the difference between transformation and automation of waste.',
        items: [
          'End-to-End Process Redesign',
          'Business Process Reengineering',
          'Target Operating Model Design',
          'Organizational & Role Design',
          'Shared Services & GBS Design',
          'Onshore, Offshore & Nearshore Split',
          'Handoff Elimination & Consolidation',
          'Zero-Touch & Low-Touch Process Design',
          'Straight-Through Processing Design',
          'Customer & Employee Journey Redesign',
          'Exception Path Design',
          'Segregation of Duties by Design',
          'Transition & Cutover Planning',
        ],
      },
      {
        title: 'Global Process Standardization & Ownership',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'One design, many markets, and a named person accountable for it. The hardest work in a multinational is not building the process, it is retiring the forty-three local variants of it without breaking a statutory obligation you did not know you had.',
        items: [
          'Global Process Model & Taxonomy',
          'Global Process Owner Operating Model',
          'Multi-Country Process Harmonization',
          'Local Statutory & Regulatory Variants',
          'Variant Rationalization & Retirement',
          'Enterprise Process Standards & Conventions',
          'Process Hierarchy & Decomposition',
          'Cross-Entity Data & Master Data Alignment',
          'Language & Locale Handling',
          'Regional Rollout Sequencing',
          'Post-Merger Process Integration',
          'Divestiture & Carve-Out Process Separation',
          'Adoption Measurement by Market',
        ],
      },
      {
        title: 'BPM Platform Implementation & Modernization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turning a target design into something that runs. Platform-agnostic by intent: the estate you already license usually decides this before any technical evaluation does, and arguing with that rarely earns back the delay.',
        items: [
          'BPM Platform Strategy & Architecture',
          'Platform Selection & Vendor Evaluation',
          'Enterprise BPM Implementation',
          'Workflow & Case Platform Build',
          'Business Rules & Decision Implementation',
          'Legacy BPM Modernization',
          'Platform Migration & Version Upgrade',
          'ERP, CRM & Core System Integration',
          'API, Event & Microservices Integration',
          'Cloud & Hybrid BPM Deployment',
          'Performance & Scalability Engineering',
          'Test Strategy & UAT Management',
          'Production Transition & Hypercare',
        ],
      },
      {
        title: 'Automation Inside the Managed Process',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Automation scoped to what your governed process needs: orchestration, decisions, and the straight-through path. The bots, document intelligence and cognitive depth are engineered on our intelligent automation and RPA services and called from here.',
        items: [
          'End-to-End Process Orchestration',
          'Automated Decisioning & Rules Execution',
          'Straight-Through Processing Enablement',
          'Automation Opportunity Assessment',
          'Bot & Digital Worker Invocation',
          'Document Intelligence in Workflow',
          'Intelligent Routing & Work Allocation',
          'Human-in-the-Loop Review Design',
          'Exception & Escalation Automation',
          'Automation Governance & Guardrails',
          'GenAI Assistance for Process Workers',
          'Automation Benefit Attribution',
        ],
      },
      {
        title: 'Process Performance, Governance & Controls',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What makes your process defensible to a regulator, an internal auditor and your board \u2014 measured continuously rather than assembled the fortnight before an audit.',
        items: [
          'Process KPI & Metric Framework',
          'End-to-End Cycle Time Measurement',
          'Operational Dashboards & Reporting',
          'SLA & OLA Management',
          'Process Control Design & Testing',
          'Automated Control Evidence Capture',
          'SOX & Financial Process Controls',
          'Segregation of Duties Monitoring',
          'Audit Trail & Traceability',
          'Regulatory & Compliance Alignment',
          'Operational Risk Assessment',
          'Process Quality Management',
          'Conformance Monitoring Against Design',
        ],
      },
      {
        title: 'Center of Excellence & Continuous Improvement',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The capability that outlives the program. Most BPM investment fails here rather than in delivery: your first three processes succeed, and nothing exists to carry the next thirty.',
        items: [
          'BPM Center of Excellence Design & Setup',
          'CoE Operating Model & Charter',
          'Process Ownership & RACI Models',
          'Intake, Prioritization & Demand Management',
          'Reusable Process Asset Library',
          'Standards, Templates & Design Patterns',
          'Lean & Six Sigma Integration',
          'Continuous Improvement Programs',
          'Practitioner Training & Certification',
          'Change Management & Adoption',
          'Process Portfolio Management',
          'CoE Maturity Assessment & Advancement',
          'Managed BPM Operations',
        ],
      },
    ],

    midCta: 'Every step has an owner. The end-to-end outcome does not.',
    midCtaLabel: 'Map One Value Stream',
    closingCta: {
      title: 'One value stream,',
      highlight: 'measured end to end.',
      body: 'Pick the one your board asks about. In 30 minutes we will tell you how many variants of it exist across your markets, where the elapsed time actually goes, and what one standard design would be worth \u2014 before any platform decision is made.',
      proofLabel: 'From first call to a costed target operating model',
    },
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
      { illustrative: true, title: 'Process Cycle Time',  desc: 'Average reduction in end-to-end process cycle time following intelligent automation deployment.',                    value: '60',  suffix: '%',    metricLabel: 'Cycle Time Reduction', icon: 'Zap'      },
      { illustrative: true, title: 'Deployment Speed',    desc: 'Typical time from automation pilot kickoff to enterprise-grade production deployment.',                               value: '4–6', suffix: ' Wks', metricLabel: 'Pilot to Production',  icon: 'TrendingUp'},
      { illustrative: true, title: 'Bot Uptime SLA',      desc: 'Sustained automation workflow uptime across deployed intelligent automation programs under managed model.',            value: '99.5',suffix: '%',    metricLabel: 'Bot Uptime',           icon: 'Shield'   },
      { illustrative: true, title: 'Decision Velocity',   desc: 'Faster decision cycles enabled by AI-augmented automation removing manual bottlenecks from approval chains.',         value: '3',   suffix: 'x',    metricLabel: 'Faster Decisions',     icon: 'Target'   },
    ],
    // The Cognition defaults put "Reasoning. Learning. Autonomous." under the h1
    // and "Autonomous Agents" in the hero strip -- the last agentic strings
    // above the fold on a page about automating processes.
    heroBadge: 'Discovered. Orchestrated. Operated.',
    heroStripItems: [
      'Process Mining', 'Workflow Orchestration', 'RPA & Digital Workers', 'Document Processing',
      'Exception Handling', 'Straight-Through Processing', 'Automation CoE', 'Managed Operations',
    ],
    hidePartnershipModel: true,

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Ten questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the questions automation buyers actually open with, and
    // several of them are ones a vendor would rather not answer.
    customFAQs: [
      {
        q: 'How do we know which processes are actually worth automating?',
        a: 'Volume, exception rate and the cost of handling a case wrong. A process run ten thousand times a month with a low exception rate is the obvious candidate; one run twice a week with constant judgment calls almost never is, however painful it feels to the team doing it.\n\nThe number that decides it is not headcount saved, it is straight-through rate — the share of cases that complete without a person touching them. A process that automates to sixty per cent straight-through and dumps the rest into a queue has moved the work rather than removed it.\n\nProcess mining answers this properly because it shows how the process actually runs rather than how the process document says it runs. That gap is where most failed automations live, and two weeks of mining is a cheaper way to find it than six months of building.',
        sources: [
          { label: 'Kangqore Business Process Management', url: '/services/business-process-management' },
        ],
      },
      {
        q: 'Our last RPA program stalled. Why would this one be different?',
        a: 'Most stall in the same place: bots got built, nothing coordinated them, and within a year the estate was a set of scripts with no owner. The build was never the hard part. What was missing was the orchestration layer and somebody accountable for the process rather than the robot.\n\nThe second common cause is starting with the tool. A platform gets bought, a Center of Excellence gets stood up around it, and the CoE becomes a request queue instead of a capability. The fifth automation then costs the same as the first, which is the clearest sign that nothing is being reused.\n\nWe would want to see what you already have before promising anything. Often the answer is that the existing estate is salvageable and needs orchestration and ownership rather than replacement.',
        sources: [],
      },
      {
        q: 'What happens when the underlying application changes?',
        a: 'Something breaks — that is the honest answer, and any vendor who says otherwise is selling. What differs is whether you find out from monitoring or from a customer complaint three weeks later.\n\nWe reduce the surface where possible: an API is used in preference to screen automation every time the target system allows it, because an API contract changes on a release note and a user interface changes whenever somebody moves a button. Where screen automation is unavoidable, selectors are built to be as resilient as the platform allows and the failure path is monitored explicitly.\n\nThen it is an ownership question. Every automation has a named owner and a runbook, so when a change lands there is a person whose job it is to fix it rather than a ticket nobody recognizes.',
        sources: [],
      },
      {
        q: 'Do you build on our platform licenses, or bring your own?',
        a: 'Yours, wherever you already have them. If you own UiPath or Automation Anywhere seats, or Power Automate is included in your Microsoft agreement, that usually decides the platform regardless of what we might otherwise prefer.\n\nWhere there is no incumbent, the choice is driven by your estate rather than by benchmarks. Microsoft-heavy organizations get a different recommendation from ones running mainframe green screens, and the presence of unstructured documents pulls the decision toward whichever intelligent document processing engine handles your formats best.\n\nUnder Automation-as-a-Service we hold the licensing and you consume the capability, which is the one case where the platform is genuinely ours rather than yours.',
        sources: [],
      },
      {
        q: 'How many processes do we need before this pays for itself?',
        a: 'Fewer than most business cases assume, but the first one rarely does it alone. The economics turn on reuse: the first automation carries the cost of standing up the pipeline, the standards and the monitoring, and everything after it should be materially cheaper.\n\nIf your fifth automation costs what your first one did, the program is not compounding and something is wrong with how components are being built rather than with the business case.\n\nThis is why the proof-of-value engagement is scoped as one process taken far enough to measure. It gives you a real number from your own estate rather than an industry average that was never about your processes.',
        sources: [],
      },
      {
        q: 'Who runs the bots after go-live?',
        a: 'Whoever you decide, and it should be decided before the build rather than after. The three workable models are your team with our support, a joint operation during a handover period, or fully managed by us under an agreed service level.\n\nWhat does not work is leaving it implicit. Automations that go live without a named operational owner are the ones that fail quietly, because nobody is watching the dashboard and nobody has been told they should be.\n\nIf you take it in-house we hand over the repository, the runbooks, the monitoring configuration and the documented failure modes. Nothing needs us present to keep running.',
        sources: [],
      },
      {
        q: 'How is this different from your BPM and RPA services?',
        a: 'RPA is the digital worker doing the clicking. BPM is the process design and the workflow layer. Intelligent Automation is the combination, with AI added where the work needs judgment or reads unstructured content.\n\nIn practice the boundary matters less than the sequence. Almost nobody should buy RPA first: without process work you automate a bad process faster, and without orchestration you get bots that cannot be sequenced.\n\nIf you are certain the requirement is narrow — one rule-based process, well documented, no unstructured input — the RPA service is a cheaper entry point and we will say so.',
        sources: [
          { label: 'Robotic Process Automation', url: '/services/robotic-process-automation' },
          { label: 'Business Process Management', url: '/services/business-process-management' },
        ],
      },
      {
        q: 'Can you automate processes that need human judgment?',
        a: 'Partly, and the useful framing is which part rather than whether. Most judgment-heavy processes are eighty per cent mechanical work wrapped around a decision that genuinely needs a person. Automating the mechanical part and routing the decision is usually worth more than attempting the whole thing.\n\nWhere a model supports the decision, a confidence threshold decides what it handles and what escalates. Set deliberately, that threshold is the control that keeps automation safe; left at a vendor default, it is the reason a system quietly makes decisions nobody sanctioned.\n\nFor decisions affecting individuals — credit, claims, eligibility — the oversight requirement is not optional. Under the EU AI Act several of these are classified high-risk, which brings documentation and human oversight duties that are cheaper to design in than to retrofit.',
        sources: [
          { label: 'EU AI Act', url: 'https://artificialintelligenceact.eu/the-act/' },
          { label: 'Kangqore AI Governance', url: '/services/ai-governance' },
        ],
      },
      {
        q: 'How do you handle documents that are not standard forms?',
        a: 'Intelligent document processing handles far more variation than templated extraction did, but it is not magic and the honest ceiling depends on your documents rather than on the engine.\n\nClean, structured documents are close to a solved problem and should be bought rather than built. Handwritten annotations, poor scans, documents where the meaning depends on a clause elsewhere, and formats that vary by supplier are where accuracy falls and where a validation step earns its place.\n\nWe would want to run a sample of your worst documents rather than your best ones before quoting anything. The best ones tell you nothing you did not already assume.',
        sources: [
          { label: 'Kangqore AI & Cognitive Computing', url: '/services/ai-cognitive-computing' },
        ],
      },
      {
        q: 'What happens to the people whose work gets automated?',
        a: 'That is your decision rather than ours, but it determines whether the program succeeds, so it is worth settling early. Automation programs that are positioned as headcount reduction meet exactly the resistance you would expect from the people whose process knowledge the build depends on.\n\nThe programs that land well move people onto the exception work and the judgment calls, which is the part of the job that was always the skilled part and was being crowded out by volume.\n\nPractically, the people who run a process today are the best source of truth about how it actually works, including the workarounds that never made it into the documentation. Involving them early is both the decent thing and the thing that makes the automation correct.',
        sources: [],
      },
    ],



    // ── Comparison ──────────────────────────────────────────────────────────
    // The parity default compared RULES-BASED AUTOMATION with AGENTIC AI and
    // explained that "an agentic system evaluates the current state against a
    // goal" — an argument for a different service. The real automation argument
    // is not rules versus agents; it is a pilot that worked versus an estate
    // that holds.
    comparisonTable: {
      eyebrow: 'WHERE AUTOMATION PROGRAMS STALL',
      heading: 'The pilot always works. The estate is the hard part.',
      lede: 'Both columns describe automation that was built competently. They differ in what happens in month seven.',
      beforeLabel: 'AUTOMATION AS PROJECTS',
      afterLabel: 'AUTOMATION AS A CAPABILITY',
      afterBadge: 'KANGQORE',
      beforeShort: 'PROJECTS',
      afterShort: 'CAPABILITY',
      rows: [
        {
          dimension: 'When the screen changes',
          before: 'The bot fails quietly, and somebody notices later because the numbers look wrong.',
          after: 'Resilient selectors where possible, monitoring where not, and a failure alerts the team that owns it the same day.',
        },
        {
          dimension: 'When the person who built it leaves',
          before: 'Nobody owns it. It runs until it does not, and then it gets rebuilt from scratch.',
          after: 'A registry entry with a named owner, version history and a runbook somebody else can follow.',
        },
        {
          dimension: 'What happens to exceptions',
          before: 'They queue until a person clears them by hand — which is the work you set out to automate.',
          after: 'Routed by type, with a human step only where judgment is genuinely needed, and the straight-through rate measured.',
          link: { label: 'AI Governance', to: '/services/ai-governance' },
        },
        {
          dimension: 'What the CoE actually does',
          before: 'Owns the licenses and approves requests, which makes it a queue rather than a capability.',
          after: 'Owns the pipeline, the standards and the reuse, so the fifth automation costs less than the first.',
        },
        {
          dimension: 'How success is measured',
          before: 'Bots deployed. A number that rises whether or not anything got better.',
          after: 'Straight-through-processing rate, exception volume and cycle time on the process itself.',
          link: { label: 'Process Mining', to: '/services/business-process-management' },
        },
      ],
    },

    // ── Industry ────────────────────────────────────────────────────────────
    // The parity default described six sectors through "Risk Auditor Agent" and
    // "HIPAA Privacy Shield Agent" — governance agents, on an automation page.
    // `items` is the neutral key; `agents` was the agentic one.
    industryHeading: 'Automation built for',
    industryHeadingHighlight: 'the processes your sector runs.',
    industryLede: 'The platform travels between industries. What does not travel is which process is worth automating first, and that is decided by volume, exception rate and what it costs when a case is handled wrong.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'High-volume, evidence-heavy processes where an auditor will ask how each case was handled.',
        items: ['KYC and client onboarding', 'Payment exception handling', 'Regulatory reporting preparation'],
      },
      {
        industry: 'Insurance',
        headline: 'Claims and policy work where the exception rate, not the happy path, decides the business case.',
        items: ['First notice of loss and claims triage', 'Policy administration changes', 'Document-heavy underwriting support'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Administrative load around clinical work, where a person stays in the loop by design.',
        items: ['Prior authorization processing', 'Clinical coding support', 'Patient registration and onboarding'],
      },
      {
        industry: 'Manufacturing & Supply Chain',
        headline: 'Processes spanning systems that were never built to talk to each other.',
        items: ['Order-to-cash processing', 'Supplier onboarding and master data', 'Three-way invoice matching'],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'Seasonal volume that makes headcount the wrong answer and automation the obvious one.',
        items: ['Returns and refunds processing', 'Price and promotion updates', 'Supplier invoice processing'],
      },
      {
        industry: 'Media & Telecommunications',
        headline: 'Provisioning and billing flows where a delay becomes a support call within hours.',
        items: ['Service provisioning and activation', 'Billing dispute resolution', 'Network ticket triage and routing'],
      },
    ],

    // ── Toolchain ───────────────────────────────────────────────────────────
    // The parity default described a stack "powering cognitive computing,
    // machine learning, and AI governance" and listed PyTorch, GPT-4o and
    // Claude. An automation page that names no automation platform tells an
    // automation buyer it does not do automation.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'What we build on,',
      titleHighlight: 'and when we would not.',
      subtitle: 'Platform choice is mostly decided by the estate you already have and how much of the process is unstructured. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Zap',
          title: 'RPA platforms',
          managed: 'UiPath, Automation Anywhere, Blue Prism',
          selfHosted: 'Power Automate on Microsoft estates',
          desc: 'Where the work is rule-based and spans applications with no usable API. If an API exists, integration beats a bot on every measure that matters.',
        },
        {
          icon: 'Radar',
          title: 'Process and task mining',
          managed: 'Celonis, Signavio, UiPath Process Mining',
          selfHosted: 'Before the first bot, not after',
          desc: 'Tells you how the process actually runs rather than how the process document says it runs. The gap between those two is where most failed automations live.',
          link: { label: 'Business Process Management', to: '/services/business-process-management' },
        },
        {
          icon: 'Network',
          title: 'Orchestration and BPM',
          managed: 'Camunda, Appian, Temporal',
          selfHosted: 'Once more than one bot is involved',
          desc: 'The layer that coordinates people, systems and digital workers. Skipping it is how an estate becomes scripts nobody can sequence.',
        },
        {
          icon: 'Eye',
          title: 'Intelligent document processing',
          managed: 'ABBYY, Azure AI Document Intelligence',
          selfHosted: 'Google Document AI, custom extraction',
          desc: 'Buy it for clean, standard documents. Build only where the forms are yours and non-standard, which is rarer than vendors suggest.',
          link: { label: 'AI & Cognitive Computing', to: '/services/ai-cognitive-computing' },
        },
        {
          icon: 'Layers',
          title: 'Integration',
          managed: 'MuleSoft, Boomi, Azure Integration',
          selfHosted: 'Kafka, REST and GraphQL services',
          desc: 'The unglamorous option that outlives every bot built to avoid it. Reached for first wherever the target system will let us.',
        },
        {
          icon: 'Activity',
          title: 'Monitoring and observability',
          managed: 'Platform consoles plus your own stack',
          selfHosted: 'Alerting somebody actually owns',
          desc: 'Bot dashboards report whether a bot ran. What matters is whether the process completed, which is a different question and rarely on the same screen.',
        },
      ],
    },

    // ── CTAs ────────────────────────────────────────────────────────────────
    midCta: 'The bot works. Then the screen changes.',
    midCtaLabel: 'Show us a broken process',

    closingCta: {
      title: 'One process.',
      highlight: 'One automation that survives production.',
      body: 'Bring the process that eats the most hours, or the automation that keeps breaking. In 30 minutes we will tell you whether it is a candidate, what would have to change before it is, and what it is worth once it works.',
      primaryLabel: 'Bring us a process',
      secondaryLabel: 'See the five ways to start',
      proofLabel: 'From first call to first process running in production',
    },

    // ── What this actually is ───────────────────────────────────────────────
    // The page carried a single hero paragraph. These three carry the delivery
    // argument the architecture section no longer holds: the stack there is
    // governance, so how the work is actually done has to live here.
    whatIsPara2: 'The delivery path runs discover, design, automate, orchestrate, add intelligence, operate, optimize. Most programs stall between the third step and the fourth — bots get built, nothing coordinates them, and the automation estate becomes a set of scripts nobody owns.',

    whatIsPara3: 'So the objective is not automating more tasks. It is an operation that can sense how work is actually performed, decide what should happen next, execute across systems that were never designed to talk, bring a person in when judgment is genuinely required, and keep improving after go-live.',

    whatIsPara4: 'That means strategy, process intelligence, orchestration, digital workers, AI and managed operations are one capability rather than six purchases. Bought separately they produce a pilot that worked. Bought together they produce something the business can run on.',

    // ── Architecture ────────────────────────────────────────────────────────
    // The parity default rendered four vague governance labels -- "Policy &
    // Ethics Layer", "Control & Orchestration Engine" -- with no decomposition
    // behind them. Replaced with the four-layer stack, which answers what must
    // be followed, what should be considered right, what must be controlled,
    // and who remains accountable.
    architectureEyebrow: 'POLICY & ETHICS LAYER',
    architectureTitle: 'What must be followed.',
    architectureTitleHighlight: 'And who remains accountable.',
    architectureLede: 'Policy to ethics to governance to human accountability. Four layers deciding what an automated system may do, what it should not do even when permitted, how that is verified, and who answers when it goes wrong.',
    architectureNodes: POLICY_ETHICS_STACK,

    // ── How we engage ───────────────────────────────────────────────────────
    // Reframed from generic entry points into the delivery pipeline, because
    // the architecture section now answers governance rather than execution.
    // Five paths, ordered by how far along the enterprise already is.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways to start.',
    engagementHeadingHighlight: 'One partner throughout.',
    engagementLede: 'Defining a strategy, modernizing one critical process, deploying intelligent workflows, or scaling across the enterprise — the entry point changes, the partner does not. Assess, strategize, prove, build, deploy, scale, operate, optimize. You do not need to know where to begin; start with the business problem.',
    servicePackages: [
      {
        name: 'Advisory & Strategy',
        description: 'Define the opportunity. A focused assessment of your processes, automation maturity, technology landscape and business priorities — where automation creates the most value, and a roadmap that survives contact with your estate. Best for enterprises working out where and how to begin.',
        deliverables: [
          'Process and automation maturity assessment',
          'Opportunity discovery and prioritization',
          'Technology landscape review',
          'Execution roadmap and operating model',
        ],
      },
      {
        name: 'Proof of Value',
        description: 'Prove the impact. One high-value opportunity taken far enough to establish technical feasibility, business impact and expected return before anything wider is committed. Best for organizations that want evidence before a transformation budget.',
        deliverables: [
          'One process automated end to end',
          'Technical feasibility findings',
          'Measured impact against a baseline',
          'Go or no-go, with the reasoning',
        ],
      },
      {
        name: 'Solution Implementation',
        description: 'Build and deploy. Process redesign, system integration, RPA, AI, orchestration and intelligent document processing taken to production rather than to a demo. Best for enterprises ready to move from strategy into execution.',
        deliverables: [
          'Process redesign and system integration',
          'RPA, orchestration and AI build',
          'Intelligent document processing',
          'Production deployment and handover',
        ],
      },
      {
        name: 'Automation CoE & Managed Operations',
        description: 'Scale with control. An Automation Center of Excellence, Robotic Operations Center, governance framework, operating model and monitoring — the machinery that turns projects into a program. Best for organizations past their first few automations.',
        deliverables: [
          'Automation Center of Excellence',
          'Robotic Operations Center and monitoring',
          'Governance framework and operating model',
          'Portfolio and bot lifecycle management',
        ],
      },
      {
        name: 'Automation-as-a-Service',
        description: 'Consume automation as a capability. A managed, consumption-based model where Kangqore runs the technology, operations, monitoring and continuous optimization instead of you building all of it internally. Best for enterprises wanting a lower-risk path to scale.',
        deliverables: [
          'Managed automation operations',
          'Platform and licensing managed for you',
          'Monitoring against agreed service levels',
          'Continuous optimization',
        ],
      },
    ],

    // ── Capability areas ────────────────────────────────────────────────────
    // This service previously had none, so the whole section came from the
    // Cognition parity default -- which is the AI Governance taxonomy. The page
    // was headed "Establishing Ethical Governance & Control" and "Compliance &
    // Risk Management" on a page about automating processes, and named no
    // automation platform anywhere.
    //
    // Taxonomy supplied by the business. Sub-capability names are kept verbatim:
    // they are the searchable register and they feed the OfferCatalog JSON-LD.
    capabilitiesLabel: 'INTELLIGENT AUTOMATION SERVICES',
    capabilitiesSectionTitle: 'Our',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Process intelligence, orchestration, digital workers, AI, document processing and automation operations — moving you from fragmented manual work to connected, continuously optimized execution.',
    capabilityAreas: [
      {
        title: 'Automation Strategy & Advisory',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Define the automation agenda. Where automation creates the most value, and a path from opportunity discovery to enterprise-scale execution aligned to operating model, workforce, risk and measurable outcomes.',
        items: [
          'Enterprise automation strategy',
          'Automation maturity assessment',
          'Automation opportunity discovery',
          'Opportunity prioritization',
          'Business case and ROI modeling',
          'Automation roadmap development',
          'Operating model design',
          'Governance and adoption strategy',
          'Change management and workforce enablement',
        ],
      },
      {
        title: 'Process Intelligence & Optimization',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Discover what should be automated. Process mining, task mining and workflow analytics identify the bottlenecks and dependencies worth automating — so processes get redesigned before they get automated.',
        items: [
          'Process discovery and mapping',
          'Process and task mining',
          'Workflow analysis',
          'Bottleneck identification',
          'Root-cause analysis',
          'Process redesign and optimization',
          'Process performance analytics',
          'Automation opportunity identification',
          'Continuous process improvement',
        ],
      },
      {
        title: 'Intelligent Process Orchestration',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Connect and coordinate execution. BPM, API-led integration, event-driven architecture and decision engines bring applications, data, people and digital workers into one end-to-end flow.',
        items: [
          'Business process orchestration',
          'Workflow automation',
          'API-led integration',
          'Event-driven workflows',
          'System-to-system integration',
          'Rules and decision engines',
          'Dynamic routing',
          'Exception handling',
          'Human-in-the-loop workflows',
          'Legacy system integration',
        ],
      },
      {
        title: 'RPA & Digital Workforce',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Deploy digital workers at scale. Beyond individual bots: attended and unattended automation, orchestration, exception handling, lifecycle management and performance monitoring as one workforce.',
        items: [
          'Attended automation',
          'Unattended automation',
          'RPA bot development',
          'Cross-application automation',
          'Desktop automation',
          'Digital worker orchestration',
          'Exception handling',
          'Bot lifecycle management',
          'Bot performance monitoring',
          'Enterprise-scale RPA governance',
        ],
      },
      {
        title: 'Intelligent Document & Content Automation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turn unstructured information into action. Documents, emails, forms, contracts, invoices and claims classified, extracted, validated and routed straight into the workflow that needs them.',
        items: [
          'Intelligent Document Processing (IDP)',
          'Document classification',
          'Data extraction and validation',
          'Invoice automation',
          'Contract processing',
          'KYC and onboarding automation',
          'Claims and case-document processing',
          'Email and correspondence automation',
          'Document understanding',
          'Human-in-the-loop validation',
        ],
      },
      {
        title: 'AI-Powered & Cognitive Automation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Embed intelligence into workflows. Rules-based automation follows a script; this reads context, interprets information and adapts. The path runs RPA to intelligent automation to AI-powered automation to autonomous execution.',
        items: [
          'Generative AI automation',
          'AI copilots',
          'NLP and conversational intelligence',
          'Computer vision',
          'Predictive intelligence',
          'Decision intelligence',
          'Recommendation engines',
          'Anomaly detection',
          'LLM integration',
          'AI-assisted workflow execution',
          'Autonomous task execution',
        ],
      },
      {
        title: 'Automation Operations, CoE & Managed Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Operate, govern and keep improving it. Scaling automation needs an operating model, monitoring and security, not more bots — the difference between a pilot that worked and a capability that lasts.',
        items: [
          'Automation Center of Excellence (CoE)',
          'Robotic Operations Center (ROC)',
          'Automation-as-a-Service (IAaaS)',
          'Managed automation operations',
          'Bot and workflow monitoring',
          'Automation observability',
          'Performance management',
          'Governance and access controls',
          'Security and compliance',
          'Automation portfolio management',
          'Citizen developer enablement',
          'Continuous optimization',
          'SLA-based managed services',
        ],
      },
    ],
  },

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
      { illustrative: true, title: 'Threat Detection',  desc: 'Improvement in threat detection rate through integrated SOC operations and AI-assisted monitoring systems.', value: '94',  suffix: '%', metricLabel: 'Detection Rate',      icon: 'Shield'   },
      { illustrative: true, title: 'Incident Response', desc: 'Reduction in mean time to respond to security incidents after SOC implementation and playbook automation.',  value: '67',  suffix: '%', metricLabel: 'Faster Response',     icon: 'Zap'      },
      { illustrative: true, title: 'Control Coverage',  desc: 'Security controls mapped and validated against ISO 27001, NIST CSF, SOC 2, and sector compliance frameworks.', value: '100', suffix: '%', metricLabel: 'Compliance Coverage', icon: 'Target'   },
      { illustrative: true, title: 'Repeat Incidents',  desc: 'Reduction in recurring incidents after root cause remediation and proactive security hardening programs.',   value: '58',  suffix: '%', metricLabel: 'Incident Reduction',  icon: 'Activity' },
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
