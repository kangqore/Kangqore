// ─── Kangqore Services — 62 Canonical Services ────────────────────────────────
// Single source of truth for all 62 services, keyed by slug.
// Every service belongs to EXACTLY ONE department via `departmentSlug` — no
// cross-tagging. The `relatedServiceSlugs` array provides cross-department
// discoverability without breaking canonical ownership.
//
// ARCHITECTURE: 6 Departments · 62 Services (canonical, single-layer)
// Verified count: cognition 12 · shield 5 · foundry 17 · reimagine 12 ·
// platforms 8 · growth 8 = 62.
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
        description: 'Agents ingest and understand multi-modal context from enterprise systems — structured data, documents, user signals, and real-time event streams.',
        features: ['RAG Integration', 'API Connectors', 'Multi-Modal Context', 'Real-time Telemetry'],
      },
      {
        title: 'REASON',
        stageName: 'REASON',
        icon: 'BrainCircuit',
        description: 'LLM-powered cognitive reasoning evaluates high-level goals, checks governance guardrails, and synthesizes contextual state.',
        features: ['Goal Evaluation', 'Contextual LLM Reasoning', 'State Management', 'Guardrail Verification'],
      },
      {
        title: 'PLAN',
        stageName: 'PLAN',
        icon: 'Layers',
        description: 'Decomposes complex objectives into dynamic, multi-step execution graphs and resilient strategy paths using LangGraph state machines.',
        features: ['Goal Decomposition', 'LangGraph Orchestration', 'Dependency Mapping', 'Fallback Routing'],
      },
      {
        title: 'ACT',
        stageName: 'ACT',
        icon: 'Zap',
        description: 'Autonomously executes tool calls, writes to enterprise ERP/CRM systems, triggers RPA bots, and coordinates agent swarms.',
        features: ['Function Calling', 'Workflow Automation', 'System Write Access', 'Multi-Agent Handoffs'],
      },
      {
        title: 'LEARN',
        stageName: 'LEARN',
        icon: 'Activity',
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
    bannerBrand: 'eQORE\u2122',
    shortDescription: 'Automating the applications that were never given an API',
    fullDescription: 'Build, govern and maintain software robots that drive enterprise applications through the interface, and keep working when that interface changes.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Bot engineering', 'Attended & unattended', 'Bot resilience', 'Orchestrator operations', 'Estate rationalization'],
    relatedServiceSlugs: ['intelligent-automation', 'digital-process-automation', 'business-process-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80',

    // ── Positioning ─────────────────────────────────────────────────────────
    // Last of the four automation services still on the Cognition parity
    // default: 2,134 bytes of data, six generic FAQs, a crawler seeing 6.5 per
    // cent of the page, and the shared agentic SVG above the fold.
    //
    // The other three have taken most of the ground. /services/bpm owns the
    // discipline -- reengineering, operating model, global process ownership,
    // BPM platforms, CoE. /services/dpa owns low-code applications, digital
    // forms and case management. /services/intelligent-automation owns the AI
    // layer and carries "RPA & Digital Workforce" as one area of seven.
    //
    // So this page is that one area taken to depth, and the wedge is a single
    // fact stated plainly: RPA is what you use when there is no API. Everything
    // difficult about it follows from that. A bot drives the interface, so it
    // breaks when the interface changes; it signs in as somebody, so it needs
    // an identity and a credential; it holds a licensed runtime, so idle
    // capacity is money. None of those problems exist for the other three
    // services, and none of them appears anywhere else on the site.
    //
    // Saying that honestly means saying the unhelpful half too: where an API
    // exists, integration beats a bot on every measure that matters. A page
    // that will not say so is selling licenses rather than engineering.
    heroTitle: 'Robotic Process Automation\nServices for the Enterprise',
    whatIsEyebrow: 'What robotic process automation is actually for',
    whatIsTitle: 'What RPA',
    whatIsHighlight: 'Actually Automates.',
    whatIsPara2: 'Robotic process automation drives enterprise applications the way a person does \u2014 through the interface, keystroke by keystroke. That is its entire reason to exist. Where a system exposes an API, integration is faster, cheaper and more durable, and we will tell you so. Where it does not, and will not, a bot is the only thing that reaches the work.',
    whatIsPara3: 'Which means every hard problem in RPA descends from one fact: your bot depends on a surface somebody else controls. A vendor ships an update and a selector stops matching. A field moves and a run fails silently at three in the morning. That is not bad engineering, it is the deal you accept in exchange for automating a system that was never opened up.',
    whatIsPara4: 'Kangqore engineers for that reality rather than around it. Resilient selectors where the application allows them, monitoring that tests the output rather than the exit code, credentials held in a vault under a bot identity your auditor can trace, and an estate small enough to maintain. Bots you can still run in year three, not a pilot that impressed everyone in month two.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Not cost reduction and bot accuracy. Those are the numbers every RPA
    // vendor publishes, they are unfalsifiable, and cycle time and bot uptime
    // already belong to /services/intelligent-automation.
    //
    // These four are what an automation lead is actually judged on once the
    // estate is past its first dozen bots: how much of the team is repairing
    // rather than building, how fast a new one reaches production, whether the
    // licensed runtime is doing any work, and whether the estate is still
    // growing after the useful automations were built.
    outcomesEyebrow: 'WHAT DECIDES WHETHER AN RPA ESTATE SURVIVES',
    outcomesHeading: 'RPA Program Metrics',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'Break-Fix Load',      desc: 'Reduction in developer time spent repairing bots after application changes, once resilience patterns and output-level monitoring are in place.', value: '60',  suffix: '%',    metricLabel: 'Less Break-Fix',        icon: 'Shield'    },
      { illustrative: true, title: 'Time to First Bot',   desc: 'From process selection to one bot running unattended in production, including the security review nobody schedules for.',                    value: '3\u20135', suffix: ' Wks', metricLabel: 'Selection to Production', icon: 'Zap'     },
      { illustrative: true, title: 'Runtime Utilization', desc: 'Share of licensed unattended runtime actually executing work after queue and schedule redesign, rather than sitting idle overnight.',        value: '75',  suffix: '%',    metricLabel: 'Licensed Runtime Used', icon: 'Activity'  },
      { illustrative: true, title: 'Estate Reduction',    desc: 'Bots retired or consolidated during rationalization without losing automated coverage \u2014 usually duplicates built by different teams.',      value: '35',  suffix: '%',    metricLabel: 'Bots Retired',          icon: 'Layers'    },
    ],

    heroBadge: 'Built. Governed. Maintained.',
    heroStripItems: [
      'Bot Engineering', 'Attended & Unattended', 'Selector Resilience', 'Orchestrator Operations',
      'Bot Identity & Credentials', 'Mainframe & Citrix', 'Estate Rationalization', 'Platform Migration',
    ],
    hidePartnershipModel: true,

    capabilities: [
      {
        n: '01',
        title: 'Surface & Interface Automation',
        desc: 'Driving applications through the user interface when no API exists, keystroke by keystroke, across desktop, web, mainframe, and virtualized environments.',
        items: ['Attended & unattended bot engineering', 'Mainframe & 3270 terminal automation', 'Citrix & virtual desktop automation', 'Web & desktop surface automation'],
        color: '#2564ea'
      },
      {
        n: '02',
        title: 'Selector & Element Resilience',
        desc: 'Engineering locators anchored to stable application structures rather than brittle screen coordinates, ensuring bots survive upstream updates.',
        items: ['Resilient selector architecture', 'Dynamic element handling', 'Pre-release bot testing', 'Interface drift detection'],
        color: '#4ab6d4'
      },
      {
        n: '03',
        title: 'Bot Identity & Credential Vaulting',
        desc: 'Securing bot credentials in enterprise PAM vaults under dedicated bot identities that satisfy strict enterprise audit requirements.',
        items: ['CyberArk & Vault integration', 'Bot identity management', 'Zero-plaintext credential handling', 'Audit-ready execution logging'],
        color: '#3b82f6'
      },
      {
        n: '04',
        title: 'Orchestrator Operations & Queue Management',
        desc: 'Managing unattended bot schedules, work queues, and runtime allocation to maximize licensed capacity utilization.',
        items: ['Work queue optimization', 'Runtime capacity management', 'Unattended schedule tuning', 'Multi-tenant orchestrator setup'],
        color: '#60a5fa'
      },
      {
        n: '05',
        title: 'Output-Level Observability & Alerting',
        desc: 'Monitoring bot output quality rather than just execution exit codes to detect silent failure modes before business impact.',
        items: ['Output verification checks', 'Exception routing & recovery', 'Real-time telemetry & alerts', 'Business impact dashboards'],
        color: '#06b6d4'
      },
      {
        n: '06',
        title: 'Estate Rationalization & Migration',
        desc: 'Auditing legacy bot portfolios to retire unneeded bots, consolidate duplicates, or migrate to modern orchestrators.',
        items: ['Bot estate audit & scoring', 'Duplicate bot consolidation', 'API migration pathing', 'UiPath / AA / Power Automate migration'],
        color: '#38bdf8'
      }
    ],

    // ── Toolchain ───────────────────────────────────────────────────────────
    // Framed by what each platform is genuinely better at, including where we
    // would argue against buying one at all. We hold no reseller margin on any
    // of these, which is the only reason that framing is available to us.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'The RPA platforms,',
      titleHighlight: 'and when not to use one.',
      subtitle: 'Platform choice is mostly settled by what the group already licenses and by how much of the target estate is legacy surface rather than modern web. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Cpu',
          title: 'Enterprise RPA platforms',
          managed: 'UiPath, Automation Anywhere',
          selfHosted: 'On-premise orchestrator where data cannot leave',
          desc: 'The default for an estate of any size: mature orchestration, credential handling and a component ecosystem. Heavy and licensed per runtime, which stops making sense below roughly a dozen bots.',
        },
        {
          icon: 'Shield',
          title: 'Regulated and legacy-heavy estates',
          managed: 'Blue Prism',
          selfHosted: 'Strong where audit posture drives the choice',
          desc: 'Unattended-first by design, with a control model that regulated operations teams tend to find easier to evidence. Weaker where the work is attended or desktop-side.',
        },
        {
          icon: 'Zap',
          title: 'Microsoft-estate automation',
          managed: 'Power Automate Desktop',
          selfHosted: 'Often already licensed and unused',
          desc: 'Frequently included in entitlements you already hold. Genuinely capable for departmental and attended work; governance is the constraint rather than the engine, which is why estates on it sprawl.',
        },
        {
          icon: 'Radar',
          title: 'Process intelligence',
          managed: 'Celonis, SAP Signavio, UiPath Process Mining',
          selfHosted: 'Before the backlog, not after it',
          desc: 'How you find out which processes are worth a bot, from event logs rather than from a workshop. Most estates skip this and automate whatever the loudest team asked for, which is why the backlog and the benefit case diverge.',
        },
        {
          icon: 'Network',
          title: 'Workflow and orchestration',
          managed: 'ServiceNow, Camunda, Appian, Pega',
          selfHosted: 'Where the bot is a step, not the process',
          desc: 'A bot should be invoked by a governed workflow rather than be the workflow. Where the process itself needs designing, that work sits on our business process management and digital process automation services.',
        },
        {
          icon: 'Lock',
          title: 'Credentials and bot identity',
          managed: 'CyberArk, HashiCorp Vault, platform-native vaults',
          selfHosted: 'Whatever your PAM team already runs',
          desc: 'Non-negotiable past the first bot. A password in a config file is the finding that ends an RPA program in a regulated group, and retrofitting a vault across a live estate is far worse than starting with one.',
        },
        {
          icon: 'Eye',
          title: 'Monitoring and alerting',
          managed: 'Platform dashboards plus your own observability stack',
          selfHosted: 'Output checks, not exit codes',
          desc: 'Platform monitoring reports whether the run finished. It cannot tell you the bot wrote the wrong value into the right field, so the checks that matter are written against the output.',
        },
        {
          icon: 'Network',
          title: 'The alternative to all of the above',
          managed: 'REST, SOAP, database, file transfer, iPaaS',
          selfHosted: 'Always evaluated before a bot is proposed',
          desc: 'If a usable API exists, integration wins on cost, speed and durability, and we will say so before quoting a build. RPA is the answer when that door is closed \u2014 not the first thing to try.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve RPA questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words. These are the ones an automation lead and a CIO actually open
    // with, and five of them are questions an RPA vendor would rather not be
    // asked: is RPA dead, why do our bots keep breaking, what does maintenance
    // really cost, should this be an integration, and what happens when the
    // savings were never real.
    customFAQs: [
      {
        q: 'Is RPA dead now that we have AI agents?',
        a: 'No, and the people saying so are usually selling the replacement.\n\nWhat has genuinely changed is the scope. Work that needed a bot because it involved reading a document or making a judgment call is now better served by document intelligence or a model. That is a real reduction in RPA\u2019s territory and we would not pretend otherwise.\n\nWhat has not changed is the underlying condition. A mainframe with no API is exactly as closed to an AI agent as it is to a bot \u2014 an agent that needs to use that system still has to drive the interface, and at that point it is doing RPA with a language model attached. The fragility does not disappear, it just gets a better narrator.\n\nSo the honest position: RPA\u2019s share of new automation is shrinking, the estates already built are not going anywhere, and the interesting work has moved from building more bots to running the ones you have properly.',
      },
      {
        q: 'Why do our bots keep breaking?',
        a: 'Because they depend on a surface somebody else controls, and that is the deal RPA makes rather than a defect in your build.\n\nThe usual causes, in order: an application update moved or renamed an element; the automation used a brittle locator such as a screen coordinate or a generated identifier; the environment drifted so the bot met a different screen resolution, browser version or session state; or a data case appeared that the original rules never covered.\n\nWhat reduces it is unglamorous. Locators anchored to something stable rather than to position. Tests that run against a new application build before the bot does. Awareness of your vendors\u2019 release calendars, which almost nobody tracks. And monitoring that checks what was written rather than whether the script reached its final line.\n\nWe measure break-fix load as a share of development capacity, because it is the number that tells you whether an estate is sustainable, and almost no business case includes it.',
      },
      {
        q: 'Should this be a bot, or should it be an integration?',
        a: 'An integration, if a usable API exists. We will say so before quoting a build, and it costs us the larger engagement.\n\nAn API-based integration is faster to run, cheaper to operate, and does not break when a screen layout changes. A bot is the right answer in one situation: the system has no usable interface and will not get one on any timeline that helps you. Mainframes, thick clients, vendor packages, third-party portals you do not control.\n\nThe gray area is the system that has an API in theory \u2014 documented but not exposed, or exposed but requiring a vendor change request with a nine-month queue. There, a bot is often the correct interim answer, with the explicit expectation that it is retired when the integration lands. We write that retirement into the design rather than leaving it to good intentions.',
      },
      {
        q: 'What does an RPA program actually cost to run, not to build?',
        a: 'Build is the smaller number and the one everybody plans for. Three things make up the rest.\n\nLicensing: unattended runtimes are charged whether or not they execute anything, so an estate with poor scheduling pays for idle capacity every month. We routinely find utilization well under half, which is a cost reduction available without touching a single bot.\n\nMaintenance: the developer time spent repairing automations after application changes. On an unmanaged estate this consumes the majority of a team\u2019s capacity within about two years, which is why the build backlog stops moving and nobody can quite explain why.\n\nOperations: monitoring, incident response, credential rotation, access recertification. Small per bot, and not small across forty.\n\nWe are pre-launch and do not publish rate cards. What we will commit to is that the assessment is scoped so you can stop after it and own the findings.',
      },
      {
        q: 'How many bots should we expect to end up with?',
        a: 'Fewer than you are being told, and that is the healthier answer.\n\nBot count is a vanity measure. It counts activity, not result, and it rewards building automations that should have been a configuration change. Estates optimized for bot count reliably contain duplicates built by two teams who never spoke, automations for processes since retired, and bots running monthly against systems that now expose APIs.\n\nThe measures worth holding a program to are hours removed per bot maintained, break-fix load as a share of capacity, and license utilization. On a mature estate, retiring a third of the bots without losing coverage is common and frees more delivery capacity than the next ten builds would consume.',
      },
      {
        q: 'What is the difference between attended and unattended automation?',
        a: 'Where the bot runs and who is beside it, and the two are different engineering problems rather than a setting.\n\nUnattended runs on a server against a queue, on a schedule, with no human present. It needs its own identity, credentials, exception handling and monitoring, because when it fails at three in the morning nobody is watching.\n\nAttended runs on a person\u2019s desktop and is triggered by them, typically to remove retyping across applications during a call. Technically simpler, socially harder \u2014 attended automation is abandoned far more often than it fails, because it was deployed without the people who were supposed to use it being involved in designing it.\n\nHybrid work starts attended, hands to an unattended queue, and returns for a decision. That is usually the right shape for anything customer-facing, and it needs the handback designed rather than improvised.',
      },
      {
        q: 'Can you automate our mainframe, or Citrix sessions?',
        a: 'Yes, and this is where RPA earns its keep rather than where it struggles.\n\nTerminal emulation is in many ways the most stable surface available: a green screen does not get a redesign. Field positions are fixed and behavior is predictable, so mainframe bots are often the longest-lived automations in an estate.\n\nCitrix and virtual desktops are the opposite. Where the session is published as an application the platform can usually see the elements. Where you get a video stream, the bot works from image recognition and coordinates, which is genuinely fragile \u2014 resolution changes, latency and a moved window all break it. We build it when there is no alternative and we tell you the maintenance profile before you commit rather than after.',
      },
      {
        q: 'How do you handle security and audit for bots?',
        a: 'By treating a bot as a named actor rather than as a script that borrows somebody\u2019s account.\n\nEach bot gets its own identity with least-privilege access scoped to the systems it actually touches. Credentials live in a vault your PAM team already runs, never in configuration. Every action is attributable to that identity in the audit trail, so a reviewer can answer who did this without the answer being a developer who left last year.\n\nSegregation of duties matters more than it first appears: a bot that can both raise and approve a payment is a control failure regardless of how carefully it was built. That gets designed at the start, because retrofitting identity across a live estate is materially harder than starting with it.',
      },
      {
        q: 'We inherited an estate nobody understands. Where do we start?',
        a: 'With an inventory, and it is usually the most valuable fortnight of the engagement.\n\nWhat exists, what each bot touches, who owns it, when it last ran successfully, what it costs in runtime, and whether the process it serves still exists. Estates past about thirty bots very rarely have this, and the gaps are where the risk sits \u2014 a bot running weekly against a system nobody knew was still in scope.\n\nThe inventory usually produces three piles: automations worth keeping and bringing to standard, duplicates and dead bots to retire, and a handful that should be replaced by integrations that now exist. Acting on the second and third piles typically frees more capacity than the first year of a new build program.',
      },
      {
        q: 'Who maintains the bots after you leave?',
        a: 'Your team, and we build on that assumption from the first sprint rather than negotiating it at handover.\n\nThat means bots built to a documented standard from a shared component library, source-controlled and peer-reviewed, with a runbook per automation covering the failure modes we actually hit during delivery rather than the ones we imagined. It means your developers pairing on the build instead of receiving a document at the end.\n\nIt also means being straight about the ongoing load: an estate needs a maintenance budget, and a program resourced for build only will stall in year two. If carrying it is not realistic, we run estates under a service level and price that separately. The line we hold is that your bots must remain operable by your own people \u2014 an estate only we can maintain is a commercial arrangement, not an engineering outcome.',
      },
      {
        q: 'The savings in our original business case never appeared. What went wrong?',
        a: 'Almost always one of three things, and none is a technology failure.\n\nThe baseline was never measured. Handling time was estimated from what people believed the process took, savings were asserted against that estimate, and nothing was measured afterwards because there was nothing credible to measure against.\n\nThe hours were removed but the cost was not. A bot saving twenty minutes across forty people does not remove a headcount, and if the business case was written as headcount it was wrong on the day it was signed. Capacity released is a real benefit; it is not the same benefit.\n\nOr the maintenance load ate it. Savings were booked once and the repair cost recurs, so by year two the team is fully occupied keeping the estate alive and the net is negative.\n\nWe baseline during qualification, before anything is built, and report against that baseline afterwards. It makes our numbers smaller and defensible.',
      },
      {
        q: 'How does RPA relate to your other automation services?',
        a: 'Four layers of the same problem, and mixing them up is what makes programs fail.\n\nThis service is the narrowest and most specific: driving applications through the interface where no API exists. Intelligent automation adds the AI layer on top \u2014 document understanding, classification, decisions that rules cannot express. Digital process automation is for work that has no application at all, where the answer is to build one rather than to automate around its absence. Business process management is the discipline above all three: how the process is designed, owned, standardized across markets and governed.\n\nThe order matters. Bots deployed onto a process nobody redesigned make an unmanaged process faster, which is why so many estates plateau and then quietly shrink. If you are not sure which of the four you need, the estate assessment answers it, and it is the cheapest way to find out.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // The first package is an assessment of an estate that already exists,
    // deliberately ahead of any build offer. Most inbound RPA conversations are
    // not "we want bots", they are "we have forty and they keep breaking", and
    // a page that only sells new builds is answering a question nobody asked.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways in,',
    engagementHeadingHighlight: 'including the way out.',
    engagementLede: 'Most groups arrive with an estate rather than an idea. The useful first engagement is usually an assessment of what is already running, not a proposal to build more.',
    servicePackages: [
      {
        name: 'Bot Estate Assessment',
        description: 'For estates that already exist and are getting harder to run. What you have, who owns it, what it costs in runtime and repair, and which of it should be retired rather than fixed.',
        deliverables: [
          'Full inventory with ownership and business criticality per bot',
          'Break-fix load measured against development capacity',
          'License utilization and runtime cost attributed per process',
          'Duplicate and overlap identification across teams',
          'Retire, rebuild, replace-with-integration recommendation per bot',
        ],
      },
      {
        name: 'Feasibility & Pilot',
        description: 'For a first automation, or a first one after a failed attempt. One process, qualified honestly, built to standard and put in production \u2014 with the answer possibly being that it should not be a bot.',
        deliverables: [
          'Process suitability assessment with an explicit go or no-go',
          'API and integration alternatives evaluated before any build',
          'One production bot, not a demo on a developer machine',
          'Measured before-and-after handling time against a baseline',
          'Costed proposal for what a wider program would actually take',
        ],
      },
      {
        name: 'Bot Development',
        description: 'Delivery at volume against your platform and your standards. Where no standards exist yet, establishing them is part of the first engagement rather than an afterthought.',
        deliverables: [
          'Automation design document per process before build',
          'Bots built to naming, logging and error-handling standards',
          'Shared component library so the fifth bot is faster than the first',
          'Regression test pack covering the interfaces each bot depends on',
          'Runbook per bot with the failure modes found during delivery',
        ],
      },
      {
        name: 'Platform Migration & Modernization',
        description: 'Moving an estate between RPA platforms, off a version out of support, or off bots entirely where an integration has since become available. Rarely a straight port.',
        deliverables: [
          'Migration assessment with per-bot complexity scoring',
          'Rebuild-versus-port decision per automation',
          'Bots replaced by integrations where an API now exists',
          'Parallel run with output comparison before cutover',
          'Decommissioning of the old estate with retained evidence',
        ],
      },
      {
        name: 'Managed Bot Operations',
        description: 'Running the estate under a service level, including the break-fix work when applications change. For teams who want the automation without carrying a maintenance team for it.',
        deliverables: [
          'Round-the-clock monitoring at the output, not just the run status',
          'Break-fix within agreed response times when interfaces change',
          'Robotic Operations Center with queue and schedule management',
          'Monthly reporting on utilization, failures and cost per process',
          'Continuous rationalization rather than unbounded estate growth',
        ],
      },
    ],

    // ── By function ─────────────────────────────────────────────────────────
    // This slot renders the industry grid elsewhere. DPA uses it for industries
    // at the application-gap layer, BPM for enterprise value streams. Here it
    // carries back-office functions, because that is how an RPA estate is
    // actually owned -- by a finance shared service or an insurance operations
    // team, never by a sector.
    //
    // Expanded from three named processes per function to seven or eight,
    // taken from the supplied use-case list. That is roughly sixty specific
    // process names -- accounts payable, first notice of loss, three-way match,
    // alert enrichment -- each a long-tail query in its own right, and none of
    // them published anywhere else on the site. Security Operations was added
    // from the same list; it is a genuine RPA use case and appeared on no
    // Kangqore page.
    //
    // The headlines stay as written: each names the system that has no usable
    // API, because that is the condition that makes a bot correct here rather
    // than a workaround. The supplied list gives the what; the headline gives
    // the why.
    industryHeading: 'Robotic Process Automation',
    industryHeadingHighlight: 'by function.',
    industryLede: 'Nine back-office functions, the processes most often automated in each, and the system that has no usable interface \u2014 which is the condition that makes a bot the correct answer rather than a workaround.',
    industryUseCases: [
      {
        industry: 'Finance & Accounting',
        headline: 'The ERP has an API. The bank portal, the tax authority site and the supplier who only sends PDFs do not.',
        items: [
          'Accounts payable and invoice processing',
          'Payment execution and confirmation',
          'Bank statement retrieval and reconciliation',
          'Purchase-order and goods-receipt matching',
          'Period-close checklist execution',
          'General ledger journal posting',
          'Credit and collections chasing',
          'Audit evidence and regulatory reporting packs',
        ],
      },
      {
        industry: 'Insurance Operations',
        headline: 'Policy administration systems bought in the nineties, still load-bearing, still terminal-based.',
        items: [
          'Policy data entry across legacy admin systems',
          'First-notice-of-loss intake from broker portals',
          'Claims status retrieval and updates',
          'Underwriting support and document collation',
          'Renewal and endorsement processing',
          'Premium reconciliation',
          'Regulatory return preparation',
        ],
      },
      {
        industry: 'Banking Operations',
        headline: 'Core banking that will not be replaced this decade, plus a dozen regulator portals with no machine interface.',
        items: [
          'Account opening and maintenance in core systems',
          'Payment and transaction processing',
          'KYC and periodic review data gathering',
          'Sanctions and watchlist screening steps',
          'Reconciliation across ledgers',
          'Regulator portal submissions',
          'Audit and evidence requests',
        ],
      },
      {
        industry: 'Human Resources',
        headline: 'A cloud HR platform that integrates, surrounded by payroll bureaux and benefits providers that do not.',
        items: [
          'Employee onboarding and offboarding',
          'HR data synchronization across systems',
          'Access provisioning and revocation',
          'Payroll input preparation and validation',
          'Benefits and third-party provider updates',
          'Candidate communication and scheduling',
          'Workforce administration and record maintenance',
        ],
      },
      {
        industry: 'Supply Chain & Procurement',
        headline: 'Supplier portals, each with its own login, none of them yours, all of them changing without notice.',
        items: [
          'Supplier portal order and status retrieval',
          'Purchase order creation and confirmation',
          'Goods receipt and three-way match',
          'Supplier onboarding and data maintenance',
          'Catalog and price file updates',
          'Shipment tracking and exception chasing',
          'Inventory data synchronization',
        ],
      },
      {
        industry: 'Customer Operations',
        headline: 'An advisor holding four applications open, retyping the same reference number into each one.',
        items: [
          'Attended desktop assistants for advisors',
          'Cross-system customer record lookup',
          'Case creation and status synchronization',
          'Customer data updates across applications',
          'Document verification steps',
          'Service request routing and enrichment',
          'Outbound communication triggers',
        ],
      },
      {
        industry: 'IT Operations',
        headline: 'Provisioning steps spread across tools that were each bought to solve one problem and integrated with none.',
        items: [
          'User provisioning and access requests',
          'Password reset and account unlock workflows',
          'Ticket triage, enrichment and routing',
          'Routine health checks and evidence capture',
          'Application monitoring follow-up actions',
          'Change and release administration',
          'License and asset reconciliation',
        ],
      },
      {
        industry: 'Security Operations',
        headline: 'Analysts moving the same indicator between four consoles, none of which was bought to talk to the others.',
        items: [
          'Alert enrichment across security consoles',
          'Security ticket creation and assignment',
          'Threat intelligence lookup and correlation',
          'Compliance evidence collection',
          'Identity and access review steps',
          'Vulnerability scan output processing',
          'Reporting pack assembly',
        ],
      },
      {
        industry: 'Healthcare Administration',
        headline: 'Clinical systems that will not be touched, and payer portals that change their layout without telling anyone.',
        items: [
          'Eligibility and prior-authorization portal checks',
          'Claims status retrieval across payers',
          'Patient registration and demographic entry',
          'Coding and billing support steps',
          'Referral processing and routing',
          'Provider data maintenance',
          'Administrative and compliance reporting',
        ],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Both columns are bots that worked on the day they were demonstrated. The
    // difference is entirely in what happens the first time somebody else's
    // application changes -- which is the only thing that actually separates an
    // RPA estate that survives from one that gets quietly switched off.
    comparisonTable: {
      eyebrow: 'DELIVERED VERSUS OPERATED',
      heading: 'RPA Implementation vs. RPA Estate Operations.',
      lede: 'Neither column describes bad engineering. They differ in what happens the first time somebody else ships a release you were not told about.',
      beforeLabel: 'BOTS AS DELIVERABLES',
      afterLabel: 'BOTS AS OPERATED SOFTWARE',
      afterBadge: 'KANGQORE',
      beforeShort: 'DELIVERED',
      afterShort: 'OPERATED',
      rows: [
        {
          dimension: 'When the vendor ships an update',
          before: 'A selector stops matching. The run fails, or worse completes against the wrong field, and somebody notices from the numbers a week later.',
          after: 'Resilient locators where the application permits them, a tracked vendor release calendar, and regression tests that run against the new build before the bot does.',
        },
        {
          dimension: 'How you know a run went wrong',
          before: 'The orchestrator reports success because the script reached the end. Nothing checked what was actually written.',
          after: 'Verification at the output: the record exists, the total reconciles, the file has the expected row count. A green run that wrote nothing raises an alert.',
        },
        {
          dimension: 'Who the bot signs in as',
          before: 'A developer\u2019s account, or a shared service account with a password in a config file and permissions nobody has reviewed since it was built.',
          after: 'A named bot identity with least-privilege access, credentials in a vault, and every action attributable to that identity in your audit trail.',
        },
        {
          dimension: 'What the licensed runtime costs',
          before: 'Unattended licenses bought per bot, most of them idle overnight and at weekends, with no attribution of runtime cost to the process it serves.',
          after: 'Queues and schedules packed so the runtime you pay for is executing, with cost per process reported and license count matched to real concurrency.',
        },
        {
          dimension: 'When the person who built it leaves',
          before: 'No design document, no naming convention, no reusable components. The bot runs until it does not, and then it is rebuilt from scratch.',
          after: 'Built to a documented standard from a shared component library, with a runbook covering the failure modes we actually hit during delivery.',
        },
        {
          dimension: 'What happens when an API finally ships',
          before: 'The bot stays, because retiring it is nobody\u2019s objective and it still technically works.',
          after: 'The bot is retired and replaced with the integration. We would rather remove our own work than bill you to maintain something the platform now does properly.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Five stages, chosen so the array length is exactly five -- the template
    // renders architectureNodes as a four-column grid otherwise, and five nodes
    // get their own column each. Deliberately ends at Maintain rather than at
    // Deploy: on this service the interesting half of the lifecycle starts
    // after go-live, which is the whole argument of the page.
    architectureEyebrow: 'THE BOT LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Qualify to Maintain.',
    architectureLede: 'Five stages, and the one that decides the outcome is the last. Most RPA programs are resourced through Deploy and then surprised by what Maintain costs.',
    architectureNodes: [
      {
        title: 'Qualify',
        icon: 'Search',
        description: 'Establish whether this should be a bot at all. High volume, stable rules, no usable API, and an exception rate that will not swamp the queue. Failing any of those, we say so before quoting a build.',
        features: [
          'Volume, variance and exception profiling',
          'API and integration alternatives checked first',
          'Application change frequency assessed',
          'Effort, payback and runtime cost modeled',
          'Explicit go or no-go recommendation',
        ],
      },
      {
        title: 'Design',
        icon: 'Layers',
        description: 'Decide how the bot behaves before writing it: which locator strategy, which exceptions are handled and which are handed back, and what it means for a run to have succeeded.',
        features: [
          'Automation design document per process',
          'Selector and locator strategy chosen',
          'Exception paths and handback defined',
          'Success criteria defined at the output',
          'Reusable components identified up front',
        ],
      },
      {
        title: 'Build',
        icon: 'Cpu',
        description: 'Engineering to a standard rather than to a demo. Naming conventions, shared components, source control and peer review \u2014 unremarkable practice, routinely absent from RPA estates.',
        features: [
          'Development to documented standards',
          'Shared component and template library',
          'Source control, versioning and peer review',
          'Credential vault integration from the start',
          'Regression test pack built alongside the bot',
        ],
      },
      {
        title: 'Deploy',
        icon: 'Rocket',
        description: 'Into your environments, under your security review, with the bot identity and permissions agreed rather than assumed. This is the stage that slips, and it slips on access rather than on code.',
        features: [
          'Environment promotion and release process',
          'Bot identity, permissions and vault setup',
          'Orchestrator queues, triggers and schedules',
          'Security review and access recertification',
          'Hypercare with the build team still attached',
        ],
      },
      {
        title: 'Maintain',
        icon: 'Activity',
        description: 'The stage the business case forgets. Applications change on somebody else\u2019s calendar, and the measure of an estate is how much of your team is repairing rather than building.',
        features: [
          'Output-level monitoring and silent-failure alerts',
          'Vendor release tracking and impact analysis',
          'Break-fix load measured and reported',
          'Runtime utilization and license rightsizing',
          'Retirement when an integration supersedes the bot',
        ],
      },
    ],

    capabilitiesLabel: 'ROBOTIC PROCESS AUTOMATION SERVICES',
    capabilitiesSectionTitle: 'Robotic Process Automation',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Pick the processes worth a bot, build them so somebody else can maintain them, reach the systems that have no other way in, keep them running through everyone else\u2019s release cycles, and retire the ones that stopped earning their runtime.',
    capabilityAreas: [
      {
        title: 'Automation Feasibility & Bot Design',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Deciding what deserves a bot before building one. Roughly half of what arrives on an RPA backlog should be an integration, a configuration change, or nothing at all, and finding that out early is the cheapest thing we do.',
        items: [
          'Process Suitability Assessment',
          'API-vs-Bot Decision Analysis',
          'Volume, Variance & Exception Profiling',
          'Rule Extraction & Documentation',
          'Automation Design Documents',
          'Reusable Component Identification',
          'Effort, Cost & Payback Modeling',
          'Backlog Prioritization & Sequencing',
          'Target Handling-Time Baselining',
          'Build-Buy-Integrate Recommendation',
        ],
      },
      {
        title: 'Surface Automation for Systems With No API',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The reason this service exists. Mainframes, thick clients, Citrix sessions, vendor packages that will never expose an endpoint \u2014 automated through the only door available, with the fragility that implies managed rather than denied.',
        items: [
          'Mainframe & Terminal Emulation',
          'Thick-Client & Legacy Desktop Automation',
          'Citrix & Virtual Desktop Automation',
          'Image, OCR & Coordinate-Based Automation',
          'Web & Browser Automation',
          'PDF & Document Surface Extraction',
          'Cross-Application Data Transfer',
          'Screen-Scraping Fallback Design',
          'Vendor Package Automation',
          'Air-Gapped & Restricted Environment Bots',
        ],
      },
      {
        title: 'Bot Resilience & Maintainability',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where RPA programs are actually won or lost. A bot fails silently, so the useful question is never whether the run finished \u2014 it is whether what the bot wrote is correct, and who found out first.',
        items: [
          'Resilient Selector Strategy',
          'Anchor & Relative-Locator Patterns',
          'Application Change Impact Analysis',
          'Output Verification, Not Exit-Code Checks',
          'Silent-Failure Detection',
          'Retry, Backoff & Idempotency Design',
          'Environment Drift Detection',
          'Regression Testing Against UI Changes',
          'Vendor Release Calendar Tracking',
          'Self-Healing Where the Platform Supports It',
          'Runbooks Per Bot',
          'Break-Fix Load Measurement',
        ],
      },
      {
        title: 'Attended, Unattended & Hybrid Automation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where the bot runs and who is sitting next to it. Attended automation is a different engineering problem from unattended \u2014 different failure modes, different security posture, different reasons it gets abandoned.',
        items: [
          'Unattended Bot Development',
          'Attended & Desktop Assistant Automation',
          'Hybrid Attended-Unattended Workflows',
          'Front-Office Agent Assist',
          'Trigger, Queue & Schedule Design',
          'Work Allocation & Load Balancing',
          'Human Handback & Exception Queues',
          'Long-Running & Multi-Session Bots',
          'End-User Adoption & Training',
          'Desktop Deployment & Update Management',
        ],
      },
      {
        title: 'Bot Identity, Credentials & Controls',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'A bot signs in as somebody. Whose account, holding which permissions, storing which password, and traceable how \u2014 questions that are trivial for one bot and a finding waiting to be written across forty.',
        items: [
          'Bot Identity & Service Account Design',
          'Credential Vault Integration',
          'Least-Privilege Access Modeling',
          'Segregation of Duties for Bots',
          'Privileged Access Management',
          'Per-Bot Audit Trail & Attribution',
          'Data Handling & Masking in Transit',
          'Regulated-Process Controls',
          'Bot Onboarding & Offboarding Procedure',
          'Access Recertification',
          'Security Review Preparation',
        ],
      },
      {
        title: 'Orchestrator Operations & Runtime Economics',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Running the estate day to day, and the part of RPA nobody costs properly: unattended runtime is licensed whether it executes anything or not, so idle capacity is a line item you are already paying.',
        items: [
          'Orchestrator & Control Room Setup',
          'Queue Architecture & Transaction Design',
          'Schedule Optimization & Runtime Packing',
          'Capacity Planning & Concurrency Modeling',
          'License Utilization Analysis',
          'Runtime Cost Attribution by Process',
          'Environment & Release Management',
          'Bot Performance Monitoring',
          'Incident Response & On-Call Runbooks',
          'Robotic Operations Center Setup',
          'SLA Definition & Reporting',
          'Managed Bot Operations',
        ],
      },
      {
        title: 'Estate Rationalization, Migration & Retirement',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Most mature estates carry bots nobody owns, duplicates built by two teams, and automations that should have been retired when the API shipped. Cleaning that up frees more capacity than the next ten builds.',
        items: [
          'Bot Estate Inventory & Ownership Mapping',
          'Duplicate & Overlap Identification',
          'Bot Debt Assessment',
          'Retire, Rebuild or Replace Decisions',
          'Replacing Bots With Integrations',
          'RPA Platform Migration',
          'Version Upgrade & Compatibility Testing',
          'Legacy Bot Refactoring to Standards',
          'Citizen-Developer Bot Consolidation',
          'License Rightsizing',
          'Decommissioning With Evidence',
        ],
      },
    ],

    midCta: 'The pilot ran beautifully. Year two is the one to plan for.',
    midCtaLabel: 'Review One Bot Estate',
    closingCta: {
      title: 'One estate,',
      highlight: 'honestly assessed.',
      body: 'Show us what you have running. In 30 minutes we will tell you which bots are worth keeping, which should have been an integration, and what the break-fix load is really costing you \u2014 before anyone proposes building more.',
      proofLabel: 'From first call to a costed estate assessment',
    },
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
    relatedServiceSlugs: ['software-development', 'devops-as-a-service', 'enterprise-integration-platform'],
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
    shortDescription: 'Security controls that are enforced, monitored and provable — not just documented',
    fullDescription: 'Design, implement and operate the identity, cloud, application, data and detection controls that make up an enterprise security program — and build the evidence that proves each one is actually enforced.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Zero Trust & identity architecture', 'Managed detection & response', 'Cloud & application security', 'Threat & exposure management', 'Incident response & resilience'],
    relatedServiceSlugs: ['operation-technology', 'internet-of-things', 'quality-engineering-assurance'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    // Real date, set when this page was rewritten. Emitted as dateModified in
    // the WebPage node by seo/serviceSchema.js.
    lastReviewed: '2026-08-23',

    // ── Positioning ─────────────────────────────────────────────────────────
    // Was the Shield-department parity default: 947 bytes, six generic FAQs,
    // a crawler seeing 6 per cent of the page, and metrics that included a
    // flat "100% Compliance Coverage" — an absolute claim no security program
    // can actually stand behind.
    //
    // The wedge is one honest fact: most enterprise security programs do not
    // fail for lack of tools. They fail because a control exists on a policy
    // document that nobody enforces day to day — an access review that never
    // happened, an alert routed to an inbox nobody reads, a firewall rule
    // opened in 2019 for a project that shipped and was never closed. That is
    // a governance and evidence problem, not a shopping list problem, and it
    // is exactly what "Shield™ Trust & Governance Framework" is supposed to
    // mean rather than just brand a hero band.
    //
    // Said honestly, that also means naming what tooling alone cannot fix,
    // and being specific about where Kangqore's own limits are: pre-launch,
    // no existing SOC headcount to point to, no invented client names.
    heroTitle: 'Cybersecurity & IT Security Services\nfor the Enterprise',
    heroBadge: 'Governed. Enforced. Evidenced.',
    heroStripItems: [
      'Zero Trust & Identity', 'Cloud & Application Security', 'Managed Detection & Response', 'Threat & Exposure Management',
      'Offensive Security', 'OT & Industrial Security', 'Incident Response', 'Compliance & Evidence Automation',
    ],
    hidePartnershipModel: true,

    whatIsEyebrow: 'What enterprise security actually has to prove',
    whatIsTitle: 'IT Security That Detects',
    whatIsTitleLine2: 'Threats Before They',
    whatIsHighlight: 'Become Breaches.',
    whatIsPara2: 'Most enterprise security programs do not fail for lack of tools. They fail because a control exists on a policy document and nobody enforces it day to day — an access review that never happened, an alert routed to an inbox nobody reads, a vulnerability scan nobody prioritized. Kangqore designs, implements and operates the identity, cloud, application, data and detection controls that make up a security program, and builds the evidence trail that proves each one is actually working.',
    whatIsPara3: 'Which means the hard problem in security work is rarely the control itself. Multi-factor authentication is not difficult to deploy. What is difficult is the service account nobody remembers creating, the access grant from three reorganizations ago, the firewall rule opened for a project that shipped in 2019 and was never closed. Security debt accumulates the same way technical debt does — quietly, through years of individually reasonable decisions — and an assessment that only checks whether a tool is installed will miss all of it.',
    whatIsPara4: 'Kangqore engineers for enforcement, not deployment. Controls mapped to a framework you can be audited against, access reviewed on a schedule rather than never, detections tuned against your own environment rather than shipped with defaults nobody adjusted, and an architecture chosen because it fits your estate rather than because it is the platform we resell. The team that builds it can explain it to your auditor, and your team can still run it in year two.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Not "99.8% threat detection" or a flat "100% compliance coverage" — the
    // parity default's numbers, and both unfalsifiable. These are the ones a
    // CISO is actually judged on: how much of what fires is worth a human's
    // attention, how fast containment happens once something is confirmed,
    // whether access is reviewed on a cadence or never, and whether the
    // exposure list is ranked by what an attacker could reach.
    outcomesEyebrow: 'WHAT A SECURITY PROGRAM SHOULD BE MEASURED ON',
    outcomesHeading: 'Security Metrics',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'Alert-to-Signal Ratio',    desc: 'Reduction in low-value alerts reaching an analyst after detection tuning and use-case redesign, so the queue reflects real risk rather than default vendor thresholds.', value: '65', suffix: '%',  metricLabel: 'Fewer Low-Value Alerts',       icon: 'Eye'        },
      { illustrative: true, title: 'Mean Time to Contain',     desc: 'Reduction in time from confirmed detection to containment once runbooks, automated response and a named on-call owner replace ad hoc triage.',                         value: '55', suffix: '%',  metricLabel: 'Faster Containment',            icon: 'Zap'        },
      { illustrative: true, title: 'Access Under Review',      desc: 'Share of privileged and application access reviewed on a recurring schedule rather than never, after an access governance program replaces standing grants nobody revisits.', value: '90', suffix: '%+', metricLabel: 'Access Actively Recertified',   icon: 'Lock'       },
      { illustrative: true, title: 'Critical Exposure',        desc: 'Reduction in internet-facing critical and high-severity findings once vulnerabilities are prioritized by exploitability and business impact rather than CVSS score alone.',  value: '50', suffix: '%',  metricLabel: 'Fewer Critical Exposures',      icon: 'ShieldCheck' },
    ],

    // ── Toolchain ───────────────────────────────────────────────────────────
    // Framed by what each platform is genuinely for, closing on the same
    // honest note RPA and QE close on: most estates already own more tooling
    // than they have ownership for, and a new license is not always the fix.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'The security stack,',
      titleHighlight: 'and where a tool is not the fix.',
      subtitle: 'Tool choice is mostly settled by what you already license and by how much of the estate is cloud-native versus legacy. These are the defaults, what overrides them, and where the gap is process rather than product.',
      items: [
        {
          icon: 'Eye',
          title: 'Security analytics & SIEM',
          managed: 'Microsoft Sentinel, Splunk',
          selfHosted: 'Elastic Security where data residency requires it',
          desc: 'The system of record for detection. Value comes entirely from the use cases and tuning built on top — an untuned SIEM is an expensive log archive that happens to page someone at 3am.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Endpoint detection & response',
          managed: 'CrowdStrike, Microsoft Defender, SentinelOne',
          selfHosted: 'Rarely self-hosted — the detection content is the product',
          desc: 'Near-mandatory on any estate past a few hundred endpoints. What actually separates vendors is response speed and false-positive rate, not the marketing page.',
        },
        {
          icon: 'Lock',
          title: 'Identity & access management',
          managed: 'Microsoft Entra ID, Okta, Ping Identity',
          selfHosted: 'On-premise AD where migration is not yet approved',
          desc: 'The control plane every other control depends on. Get identity wrong and the rest of the stack is defending the wrong perimeter.',
        },
        {
          icon: 'Lock',
          title: 'Privileged access management',
          managed: 'CyberArk, HashiCorp Vault, BeyondTrust',
          selfHosted: 'Vault where secrets must stay inside your infrastructure',
          desc: 'Non-negotiable past a handful of admin accounts. A shared root password in a spreadsheet is the finding that ends a security program’s credibility with the board.',
        },
        {
          icon: 'Radar',
          title: 'Cloud security posture',
          managed: 'Wiz, Prisma Cloud, Microsoft Defender for Cloud',
          selfHosted: 'Rarely — posture tools need the provider’s own API surface',
          desc: 'Finds the misconfigured storage bucket and the over-permissioned role before an attacker does. Coverage across every account matters more than depth on any one.',
        },
        {
          icon: 'Search',
          title: 'Vulnerability & exposure management',
          managed: 'Tenable, Qualys, Rapid7',
          selfHosted: 'On-premise scanners for segmented OT networks',
          desc: 'A scan report with four thousand findings is not a program. The work is prioritizing the handful that are actually exploitable and actually reachable.',
        },
        {
          icon: 'Network',
          title: 'Network & perimeter security',
          managed: 'Palo Alto Networks, Fortinet, Zscaler',
          selfHosted: 'On-premise firewalls where latency rules out SASE',
          desc: 'Increasingly the real perimeter is identity, not network — but segmentation and inspection still stop lateral movement once something gets past the first control.',
        },
        {
          icon: 'Cpu',
          title: 'Application security testing',
          managed: 'Checkmarx, Snyk, Burp Suite, Veracode',
          selfHosted: 'Open-source scanners in the pipeline where budget is tight',
          desc: 'Runs earliest and cheapest inside the pipeline, not as a report delivered after the release already shipped.',
        },
        {
          icon: 'Target',
          title: 'Compliance & evidence automation',
          managed: 'Vanta, Drata, ServiceNow GRC, OneTrust',
          selfHosted: 'Spreadsheets, if the estate is genuinely small enough',
          desc: 'Turns “we believe this control works” into continuous, exportable evidence — the difference between a good answer to an auditor and a defensible one.',
        },
        {
          icon: 'Network',
          title: 'The alternative to another tool',
          managed: 'A named control owner, a runbook, a review cadence',
          selfHosted: 'Always evaluated before a new platform is proposed',
          desc: 'Most security programs already have enough tools and not enough ownership of what they bought. We will say so before selling you another license.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve security questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers. These are the ones a
    // CISO, a security lead or a founder facing a cyber-insurance renewal
    // actually opens with — several of them questions a vendor selling more
    // licenses would rather not be asked.
    customFAQs: [
      {
        q: 'Do we actually need a SOC, or can we get by on the alerts our existing tools already send?',
        a: 'Depends entirely on whether anyone is triaging those alerts, and for most mid-size estates the honest answer is no.\n\nA modern EDR or SIEM will generate more alerts than any single analyst can review in a day, most low severity, several worth acting on immediately, with no obvious way to tell which is which without tuning. Without a team — internal or managed — whose job is to triage that queue every day, the alerts exist but the detection does not.\n\nThe useful question is not build-versus-buy on a SOC. It is whether what you are protecting justifies round-the-clock coverage, or whether business-hours monitoring with a documented after-hours escalation path is enough. We size that from your actual telemetry rather than a rule of thumb, because a SOC sized for the wrong workload is expensive either way — too small and it misses things, too large and it is triaging noise nobody needed watched.',
      },
      {
        q: 'Is Zero Trust a product we buy, or an architecture we build?',
        a: 'An architecture, and any vendor telling you otherwise is selling you one component of it.\n\nZero Trust is a principle: verify identity and device posture continuously, grant the minimum access required, and assume the network itself is not trustworthy. No single product delivers that. It requires identity infrastructure, device management, network segmentation, application-level access controls and a policy engine that ties them together — usually assembled from tools you already own plus a handful you do not.\n\nMost organizations already have half of a Zero Trust architecture and do not realize it. Conditional access in the identity provider, endpoint management not yet used for posture checks, segmentation started and never finished. The work is usually completing and connecting what exists rather than starting from nothing, and a maturity assessment against your current state tells you which half you already have before anyone proposes a purchase.',
      },
      {
        q: 'What is the real difference between hiring an MSSP and what Kangqore does?',
        a: 'An MSSP typically operates a shared SOC across many clients on a standard playbook and reports what happened. We design the architecture, implement the controls to fit your specific estate, and can operate detection and response — but the design work and the operations are not decoupled the way they often are under a pure managed-security contract.\n\nThe practical difference shows up when something does not fit the standard playbook: a legacy system the MSSP’s tooling was not built for, an OT network their standard onboarding does not cover, a compliance framework specific to your sector. We would rather architect around your actual environment than fit your environment into a template built for the median customer.\n\nWe are also not trying to make a managed contract the only viable outcome of the conversation. An assessment or an architecture engagement stands on its own, and managed operations is one option among several — not the default we steer every call toward.',
      },
      {
        q: 'We passed our last audit. Why would we need a security assessment now?',
        a: 'Because passing an audit and having a working security program are not the same claim, and the gap between them is usually where the next incident comes from.\n\nAn audit tests a defined scope against a defined framework, on a schedule, using evidence assembled for that purpose. It does not test whether access granted for a project that ended two years ago was ever revoked, whether a firewall rule opened for a vendor integration that failed was ever closed, or whether a detection rule that fired correctly during the audit demo still fires against a real attack technique six months later.\n\nA clean audit tells you the control existed and functioned on the day it was tested. A maturity assessment tells you whether it is still functioning today, whether it covers what actually changed since, and where the scope of the audit itself left a gap the auditor was never asked to check.',
      },
      {
        q: 'How do you secure AI systems that call tools and take action on their own, and is that even a real category yet?',
        a: 'It is real, and it is not the same threat model as securing a web application, even though most of the underlying controls are familiar.\n\nA model that calls tools, reads documents or takes action on a user’s behalf introduces a new class of failure: a prompt embedded in a document the model reads can attempt to redirect what it does next, a broad tool grant can be manipulated into misuse, and a model augmented on your data can leak more of it than intended. None of that is theoretical — it is the same category of problem as an injection attack, aimed at a system that reasons in natural language instead of SQL.\n\nWhat we actually do: scope what a model is authorized to touch the same way you would scope a service account, test for prompt injection and data exfiltration the way you would test an application for injection flaws, and log what it did and why so an incident is investigable rather than a black box. It is application security and identity governance applied to a newer kind of application, not a separate discipline invented to sound current.',
      },
      {
        q: 'What does an incident response retainer actually get us before an incident happens?',
        a: 'A response that starts in minutes instead of the hours it takes to find a firm, agree a statement of work, and get an engineer who has never seen your environment up to speed — which is the retainer’s entire value, realized before the incident, not during it.\n\nDuring onboarding we learn your environment: what the critical systems are, who can authorize containment actions, what your logging actually captures, and where the gaps are that would slow an investigation. That groundwork is what collapses response time when it matters, not a document that says we will show up.\n\nA retainer without that onboarding is a phone number. We treat the setup work as the deliverable, not the paperwork around it, and we will tell you plainly where your current logging or access model would make an investigation slower than it needs to be — before that becomes the reason an incident takes longer to contain.',
      },
      {
        q: 'Our OT and industrial systems cannot be patched the way our IT systems can. How do you actually secure them?',
        a: 'Mostly by not applying IT security practices to a network that was never designed for them, which is the mistake that causes the most damage.\n\nA programmable logic controller cannot run endpoint detection software. Rebooting a system on a production line is a safety and continuity decision, not a maintenance window. And a vulnerability scanner built for IT can crash fragile OT equipment outright — we do not run standard scans against a live plant floor without passive, OT-aware discovery first.\n\nThe controls that actually work: network segmentation between IT and OT so a compromise on one side cannot reach the other, passive monitoring that watches industrial protocols without touching the equipment, and a patch strategy built around scheduled maintenance windows rather than a 30-day SLA that assumes IT-style downtime is acceptable. Compensating controls usually matter more than patching on OT, because patching on OT is often genuinely not fast — and pretending otherwise is how a security program loses credibility with plant operations.',
      },
      {
        q: 'How long does a Zero Trust rollout actually take?',
        a: 'Longer than the vendor deck implies, and it depends far more on your identity estate’s current state than on which products you choose.\n\nAn organization with a single, well-governed identity provider and modern device management can stand up conditional access and meaningful segmentation in a matter of months. An organization with multiple identity systems from acquisitions, unmanaged legacy devices and flat networks with no segmentation history is closer to a multi-year program — and anyone quoting a fixed timeline before assessing that starting point is guessing.\n\nWhat we commit to is sequencing that reduces risk early rather than a big-bang rollout that shows nothing until year two: identity and MFA first, since that closes the most common attack path fastest, then segmentation, then application-level access controls. Each phase is independently valuable, so the program keeps reducing risk even if a later phase is deprioritized or takes longer than planned.',
      },
      {
        q: 'What happens when a penetration test finds something critical while the engagement is still running?',
        a: 'We stop and tell you immediately, in plain language, before the formal report is even drafted — not as a courtesy, but because sitting on a live critical finding until a scheduled readout is indefensible.\n\nCritical severity means an attacker with similar access could plausibly cause serious damage today: unauthenticated remote code execution, a path to domain admin, exposed customer data. We flag it out of band, describe exactly what we did and what we found, and stay engaged on remediation guidance rather than treating the finding as closed once it is logged.\n\nWe also test under agreed rules of engagement with a kill switch, precisely so a critical finding gets discovered under controlled conditions with us on the call — rather than discovered later by someone with worse intentions and no obligation to tell you.',
      },
      {
        q: 'Our cyber insurer is asking for controls we do not have. Where do we actually start?',
        a: 'With the specific questionnaire, because insurers have converged on a fairly narrow set of controls they now treat as non-negotiable, and most of the gap is closable faster than people expect.\n\nMulti-factor authentication on remote access and privileged accounts, endpoint detection and response rather than legacy antivirus, offline or immutable backups, and a documented incident response plan are asked for on nearly every renewal now, and a missing answer on any of them can mean a declined policy or a materially higher premium regardless of the rest of your posture.\n\nWe map your current state against the actual questionnaire language rather than a generic framework, close the gaps that affect underwriting first, and leave you with evidence you can hand to the broker directly. It is a narrower and faster engagement than a full program build-out, and usually the right place to start if a renewal deadline is the reason you are calling.',
      },
      {
        q: 'How do you avoid becoming just another security tool we have to manage?',
        a: 'By treating ownership transfer as part of the deliverable, not an afterthought negotiated at the end of the contract.\n\nEvery control we implement comes with documentation your team can act on without us: what the control does, why it is configured that way, and a runbook for the failure modes we actually expect. Detection content is built and explained, not handed over as an opaque rule set. Where we operate something on your behalf, the architecture is still yours — built so it can be handed back or brought in-house without a rebuild.\n\nWe are pre-launch and do not have a large existing client base to point to, which means we do not have the luxury of assuming you will renew simply because switching is expensive. The program has to stand on its own value, which is the incentive we would want regardless.',
      },
      {
        q: 'Who is actually accountable when a control fails — you, or us?',
        a: 'Whoever owns the control, and that ownership is assigned explicitly rather than left ambiguous — itself one of the more common gaps we find in an existing program.\n\nWhere we design and hand off a control, your team owns its operation and its failure, with a runbook and documentation that make that ownership realistic rather than nominal. Where we operate a control under a managed arrangement, we own its performance against an agreed service level, and that is written into the engagement rather than implied.\n\nWhat we will not do is design a program where accountability is unclear by default, because that ambiguity is exactly what turns a control failure into a longer, more expensive incident — not because the control itself was wrong, but because nobody was clearly responsible for noticing it had stopped working.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // The first package is an assessment of what already exists, deliberately
    // ahead of any managed-services pitch — most inbound security
    // conversations are "we have controls and no idea which ones actually
    // hold," not "we have nothing."
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways in,',
    engagementHeadingHighlight: 'starting with what you already have.',
    engagementLede: 'Most security conversations do not start from zero. The useful first engagement is usually an assessment of the controls already in place, not a pitch for a full program.',
    servicePackages: [
      {
        name: 'Security Maturity & Risk Assessment',
        description: 'For understanding where the program actually stands before committing to anything. What controls exist, what is enforced versus merely documented, and a prioritized gap list against a real framework.',
        deliverables: [
          'Maturity assessment against NIST CSF or CIS Controls',
          'Control-to-framework gap mapping with evidence review',
          'Asset, identity and third-party risk inventory',
          'Prioritized risk register with named owners',
          'Board-ready executive risk summary',
        ],
      },
      {
        name: 'Zero Trust & Identity Architecture',
        description: 'Building the control plane everything else depends on. Identity, access governance and segmentation designed for your actual estate, sequenced so risk drops early rather than only at the end.',
        deliverables: [
          'Identity and access architecture design',
          'MFA, PAM and conditional access rollout plan',
          'Network and application segmentation model',
          'Access recertification program design',
          'Phased rollout sequenced for early risk reduction',
        ],
      },
      {
        name: 'Cloud, Application & Data Security',
        description: 'Embedding controls into what you build and store, from pipeline to production. For teams shipping faster than their security review process can keep up.',
        deliverables: [
          'Cloud security posture assessment and remediation',
          'Secure SDLC and DevSecOps pipeline integration',
          'Application penetration testing',
          'Data classification and DLP implementation',
          'Encryption and secrets management rollout',
        ],
      },
      {
        name: 'Managed Detection & Security Operations',
        description: 'Running detection and response under a service level, including the tuning most estates never get to. For teams who want coverage without carrying a 24/7 SOC themselves.',
        deliverables: [
          'SIEM and detection use-case build or tuning',
          'Round-the-clock or business-hours monitoring',
          'Alert triage and incident escalation',
          'Threat hunting against your own telemetry',
          'Monthly reporting on coverage, findings and trend',
        ],
      },
      {
        name: 'Incident Response & Resilience',
        description: 'Preparing for the incident that has not happened yet, and responding to the one that has. Retainer-based readiness or active response, with the same team either way.',
        deliverables: [
          'Incident response plan and playbook development',
          'Tabletop and ransomware readiness exercises',
          'Digital forensics and active incident response',
          'Business continuity and disaster recovery planning',
          'Post-incident root cause and remediation report',
        ],
      },
    ],

    // ── Sectors ─────────────────────────────────────────────────────────────
    // Renders the industry grid. Eight sectors, the framework each is
    // actually held to, and the specific controls most often mapped to
    // satisfying it — each item a long-tail query in its own right and none
    // of them published anywhere else on the site.
    //
    // industryHeading/Highlight set explicitly (matching the Shield default
    // text exactly, so nothing changes visually) because the prerender
    // generator only reads svc.industryHeading directly — it does not know
    // about the department-level fallback the React page resolves through —
    // so leaving it unset means the crawler snapshot sees a generic "By
    // industry" heading a visitor never does.
    industryHeading: 'Controls mapped to',
    industryHeadingHighlight: 'your industry.',
    industryLede: 'Eight sectors, the framework a regulator, an auditor or an insurer in each will actually ask about, and the security work most often mapped to satisfying it.',
    industryUseCases: [
      {
        industry: 'Financial Services & Banking',
        headline: 'PCI DSS for the card data, SOX ITGC for the financial systems, and a regulator who wants evidence, not intentions.',
        items: [
          'PCI DSS scoping and control validation',
          'SOX ITGC control design and testing',
          'Real-time fraud and transaction monitoring',
          'Core banking and payment system security',
          'Third-party and fintech vendor risk assessment',
          'Regulatory reporting and examination readiness',
          'Wire and payment fraud controls',
          'Customer data protection and encryption',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'HIPAA covers the record. Ransomware does not care, and a hospital cannot simply take the network offline.',
        items: [
          'HIPAA Security Rule risk assessment',
          'Protected health information (PHI) discovery and DLP',
          'Ransomware readiness for clinical environments',
          'Medical device and connected equipment security',
          'Business associate and third-party risk management',
          'Identity and access for clinical systems',
          'Incident response tailored to patient-safety constraints',
          'Breach notification readiness',
        ],
      },
      {
        industry: 'Insurance',
        headline: 'Policy administration systems bought decades ago, broker portals you do not control, and claims data that is a target either way.',
        items: [
          'Policy and claims system access governance',
          'Broker and third-party portal security review',
          'Claims fraud detection support',
          'Regulatory compliance mapping across jurisdictions',
          'Customer PII protection and encryption',
          'Legacy policy administration system hardening',
          'Vendor and reinsurer risk assessment',
          'Incident response and regulatory notification readiness',
        ],
      },
      {
        industry: 'Retail & E-Commerce',
        headline: 'PCI DSS at the point of sale, card-not-present fraud online, and a traffic spike every November that looks a lot like an attack.',
        items: [
          'PCI DSS compliance for POS and e-commerce',
          'Card-not-present fraud detection',
          'DDoS protection for seasonal traffic',
          'Customer data protection and encryption',
          'Supply chain and vendor security',
          'Application security for checkout and payment flows',
          'Loyalty program and account takeover protection',
          'Third-party payment processor risk review',
        ],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'Intellectual property worth stealing, a plant floor that cannot be patched mid-shift, and an IT network increasingly bridged to an OT one.',
        items: [
          'IT/OT network segmentation',
          'Industrial control system (ICS) security assessment',
          'Intellectual property and trade secret protection',
          'Supply chain and third-party vendor risk',
          'Plant floor asset discovery and inventory',
          'Safety-constrained patch and vulnerability management',
          'Connected equipment and IoT device security',
          'OT-specific incident response planning',
        ],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'NERC CIP for the grid, SCADA systems that predate the internet, and downtime that is not an inconvenience but a public-safety event.',
        items: [
          'NERC CIP compliance and control mapping',
          'SCADA and industrial control system security',
          'Critical infrastructure asset inventory',
          'Air-gapped and segmented network architecture',
          'Legacy industrial protocol security',
          'Physical-cyber convergence risk assessment',
          'Incident response for critical infrastructure',
          'Third-party and contractor access governance',
        ],
      },
      {
        industry: 'Government & Public Sector',
        headline: 'FedRAMP or StateRAMP for the cloud, citizen data at scale, and threat actors with more patience and more budget than most.',
        items: [
          'FedRAMP and StateRAMP compliance readiness',
          'Citizen data protection and privacy controls',
          'Advanced and persistent threat detection',
          'Legacy system modernization security',
          'Identity and access for public-sector workforces',
          'Third-party and contractor risk management',
          'Incident response and public disclosure readiness',
          'Continuous monitoring for authorization to operate',
        ],
      },
      {
        industry: 'Technology & SaaS',
        headline: 'SOC 2 Type II because every enterprise customer will ask for it, and multi-tenant isolation because one tenant’s breach cannot become everyone’s.',
        items: [
          'SOC 2 Type II readiness and evidence automation',
          'Multi-tenant data isolation architecture',
          'API security and abuse prevention',
          'Secure SDLC and DevSecOps enablement',
          'Customer security questionnaire response',
          'Cloud infrastructure security posture',
          'Secrets and credential management',
          'Vulnerability disclosure and bug bounty program design',
        ],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Both columns own the same tools. The difference is whether a control is
    // enforced, owned and provable, or switched on and left running — which
    // is the only thing that actually separates a program that survives an
    // audit from one that survives a demo.
    comparisonTable: {
      eyebrow: 'DEPLOYED VERSUS GOVERNED',
      heading: 'Security Tooling vs. Governed Security Operations.',
      lede: 'Neither column is short on tools. They differ in whether a control is enforced, owned and provable, or just switched on and left running.',
      beforeLabel: 'CONTROLS DEPLOYED',
      afterLabel: 'CONTROLS GOVERNED',
      afterBadge: 'KANGQORE',
      beforeShort: 'DEPLOYED',
      afterShort: 'GOVERNED',
      rows: [
        {
          dimension: 'When an alert fires at 2am',
          before: 'It sits in a queue with several thousand others, ranked by default severity, until someone opens the console the next morning.',
          after: 'It is triaged against a runbook within an agreed window, by a named owner, with escalation defined before the alert ever fires.',
        },
        {
          dimension: 'What an auditor asks for',
          before: 'Screenshots and a spreadsheet assembled the week the audit is scheduled, reconstructed from memory of what the control was supposed to do.',
          after: 'Continuous evidence tied to the control itself, exportable on request, current because it was never allowed to go stale.',
        },
        {
          dimension: 'Who has access to what',
          before: 'Access accumulated by request over several years. Nobody has reviewed the list, and nobody is confident removing anything from it.',
          after: 'Access mapped to role and least privilege, recertified on a schedule, with owners who can explain why each grant still exists.',
        },
        {
          dimension: 'When a new SaaS application appears',
          before: 'Discovered during the next audit, or after an incident, whichever comes first — procured by a team that never involved security.',
          after: 'Discovered and risk-scored close to when it was provisioned, with a lightweight review that does not block the business.',
        },
        {
          dimension: 'What the vulnerability scan produces',
          before: 'A report with several thousand findings ranked by CVSS score, most of them unreachable, none of them prioritized by what actually matters.',
          after: 'A short list ranked by exploitability and business impact — what an attacker could actually reach and what it would actually cost.',
        },
        {
          dimension: 'What happens when the person who built it leaves',
          before: 'No architecture document, no runbook, no successor who understands why a rule exists. The control erodes quietly until something breaks.',
          after: 'Built to a documented standard with an owner and a runbook, so the control outlives the person who configured it.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Five stages, chosen so the array length is exactly five — the template
    // renders architectureNodes as a four-column grid otherwise. Ends at
    // Govern rather than Operate, because a control nobody can prove is
    // running is, for audit purposes, a control that does not exist.
    architectureEyebrow: 'THE SECURITY LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Assess to Govern.',
    architectureLede: 'Five stages, and most security programs are resourced through Implement and then surprised by what Govern costs. A control that is not owned, reviewed and evidenced decays back into risk within a year.',
    architectureNodes: [
      {
        title: 'Assess',
        icon: 'Search',
        description: 'Establish the real posture before proposing controls: what exists, what it protects, who owns it, and where the gap between documented and enforced actually sits.',
        features: [
          'Security maturity assessment against NIST CSF or CIS',
          'Asset and identity inventory',
          'Control-to-framework gap mapping',
          'Third-party and vendor risk review',
          'Prioritized risk register with named owners',
        ],
      },
      {
        title: 'Architect',
        icon: 'Layers',
        description: 'Design the target-state controls before buying anything — identity model, network segmentation, data classification and the framework the program will be evidenced against.',
        features: [
          'Zero Trust and identity architecture',
          'Network and cloud segmentation model',
          'Data classification and protection design',
          'Control framework selection',
          'Tooling rationalized against existing licenses',
        ],
      },
      {
        title: 'Implement',
        icon: 'Cpu',
        description: 'Deploy and configure to the design, not to vendor defaults. This is the stage most programs get right, and the one most audits still fail on the configuration rather than the purchase.',
        features: [
          'Identity, MFA and PAM rollout',
          'Detection content and SIEM use-case build',
          'Application and data control deployment',
          'Segmentation and firewall policy build-out',
          'Baseline hardening against CIS benchmarks',
        ],
      },
      {
        title: 'Operate',
        icon: 'Activity',
        description: 'The stage the business case forgets. Detection, response and access review have to run every day, whether or not anything is happening — and most incidents happen on the day nobody was watching.',
        features: [
          '24/7 or business-hours monitoring and triage',
          'Incident response and containment',
          'Access recertification on a schedule',
          'Detection tuning against real telemetry',
          'Patch and vulnerability remediation tracking',
        ],
      },
      {
        title: 'Govern',
        icon: 'ShieldCheck',
        description: 'Evidence that the program works, for the board and for the auditor. A control nobody can prove is running is, for audit purposes, a control that does not exist.',
        features: [
          'Continuous control evidence and audit readiness',
          'Executive and board risk reporting',
          'Framework mapping to ISO 27001, SOC 2 and NIST CSF',
          'Policy and control ownership tracking',
          'Program maturity re-baselined annually',
        ],
      },
    ],

    capabilitiesLabel: 'IT SECURITY & CYBERSECURITY SERVICES',
    capabilitiesSectionTitle: 'Cybersecurity & IT Security',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Design the architecture, enforce the controls, detect what gets past them, and prove to an auditor that all three are actually happening — across identity, cloud, applications, data, operational technology and the frameworks a regulator or a customer will ask you to evidence.',
    capabilityAreas: [
      {
        title: 'Cyber Risk, Strategy & Security Architecture',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where a security program should start and rarely does: a real inventory of what exists, an honest maturity baseline, and an architecture chosen for your estate rather than for a vendor’s reference deployment.',
        items: [
          'Cybersecurity Strategy & Roadmap',
          'Security Maturity Assessment (NIST CSF, CIS Controls)',
          'Enterprise Security Architecture Design',
          'Virtual CISO Advisory',
          'Cyber Risk Register & Quantification',
          'Security Operating Model Design',
          'Board & Executive Risk Reporting',
          'Third-Party & Vendor Risk Assessment',
          'Security Investment Prioritization',
          'M&A Security Due Diligence',
        ],
      },
      {
        title: 'Identity, Access & Zero Trust Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The control plane every other control depends on. Most breaches trace back to an identity problem — standing access, a shared credential, a service account nobody remembers creating — not a zero-day.',
        items: [
          'Identity & Access Management (IAM)',
          'Privileged Access Management (PAM)',
          'Multi-Factor & Adaptive Authentication',
          'Identity Governance & Access Recertification',
          'Zero Trust Architecture Design',
          'Microsegmentation',
          'Machine & Workload Identity',
          'Single Sign-On & Federation',
          'Conditional & Risk-Based Access Policies',
          'Non-Human & Service Account Governance',
        ],
      },
      {
        title: 'Cloud, Network & Infrastructure Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Securing the estate as it actually exists — hybrid, multi-cloud, and rarely as clean as the architecture diagram. Configuration drift, not novel attack techniques, is what usually opens the door.',
        items: [
          'Cloud Security Posture Management',
          'Cloud Workload Protection',
          'Multi-Cloud & Hybrid Security Architecture',
          'Network Segmentation & Firewall Architecture',
          'Secure Remote Access & SASE',
          'Container & Kubernetes Security',
          'Infrastructure-as-Code Security Scanning',
          'Endpoint Security & Hardening',
          'DDoS & Perimeter Protection',
          'Cloud Configuration & Drift Monitoring',
        ],
      },
      {
        title: 'Application & Data Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Security built into what you ship and what you store, rather than bolted on after release. A finding caught in production costs materially more than the same finding caught in the pipeline.',
        items: [
          'Secure SDLC & DevSecOps Enablement',
          'Application Penetration Testing',
          'API Security Testing',
          'Static & Dynamic Code Analysis (SAST/DAST)',
          'Software Composition Analysis',
          'Data Discovery & Classification',
          'Data Loss Prevention (DLP)',
          'Encryption & Key Management',
          'Secrets Management',
          'Database & Data Platform Security',
        ],
      },
      {
        title: 'Security Operations, Detection & Managed Response',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turning telemetry into action. A SIEM ingesting every log source is not a SOC — detection has to be tuned, triaged and owned, or the signal drowns in the noise within a month.',
        items: [
          'SOC Design & Operation',
          'SIEM Engineering & Use-Case Tuning',
          'Managed Detection & Response (MDR)',
          'Endpoint Detection & Response (EDR/XDR)',
          'SOAR & Response Automation',
          'Threat Hunting',
          'Detection Engineering (MITRE ATT&CK)',
          'Alert Triage & Investigation',
          'Continuous Security Monitoring',
          'Security Incident Escalation & On-Call',
        ],
      },
      {
        title: 'Threat Intelligence, Exposure & Offensive Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Understanding where the estate is actually exposed, and testing it the way an adversary would rather than the way a checklist would.',
        items: [
          'Cyber Threat Intelligence',
          'External Attack Surface Management',
          'Continuous Threat Exposure Management',
          'Risk-Based Vulnerability Prioritization',
          'Penetration Testing (Network, Web, Mobile)',
          'Red Team & Adversary Simulation',
          'Purple Team Exercises',
          'Breach & Attack Simulation',
          'Attack Path & Blast-Radius Analysis',
          'Dark Web & Brand Exposure Monitoring',
        ],
      },
      {
        title: 'OT, IoT & Industrial Security',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'A different discipline from IT security, and one most security programs quietly skip. A programmable logic controller cannot run an agent, cannot be patched on a Tuesday, and cannot go down for a reboot.',
        items: [
          'OT/ICS Security Assessment',
          'IT/OT Network Segmentation',
          'Industrial Asset Discovery & Inventory',
          'SCADA & PLC Protocol Monitoring',
          'IoT & Connected Device Security',
          'OT-Aware Vulnerability Management',
          'Air-Gapped & Restricted Environment Controls',
          'OT Incident Response Planning',
          'Safety-Constrained Patch Management',
          'Legacy Industrial Protocol Inspection',
        ],
      },
      {
        title: 'Incident Response, Resilience & Compliance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What happens when a control fails anyway, and what proves to a regulator, an auditor or a cyber insurer that the program is real rather than a policy binder nobody has opened.',
        items: [
          'Incident Response Planning & Retainers',
          'Digital Forensics & Malware Analysis',
          'Ransomware Readiness & Tabletop Exercises',
          'Business Continuity & Disaster Recovery',
          'Crisis Communication Planning',
          'ISO 27001, SOC 2 & NIST CSF Readiness',
          'PCI DSS, HIPAA & GDPR Compliance Mapping',
          'Continuous Control Evidence Automation',
          'Post-Incident Root Cause & Remediation',
          'Cyber Insurance Readiness Assessment',
        ],
      },
    ],

    // ── Practice boundary ───────────────────────────────────────────────────
    // The default band lists Shield-department siblings with a generic
    // one-line lede, which renders thin. Stating the boundary explicitly —
    // same pattern quality-engineering-assurance uses — says where security
    // ends and the next Shield service picks up, rather than leaving it
    // implied by a service-card grid.
    practiceLabel: 'TRUST, RISK & ASSURANCE',
    practiceHeading: 'Where IT security stops,',
    practiceHeadingHighlight: 'and another Shield service starts.',
    practiceLede: 'Security is the control layer, not the whole of governance. We own identity, cloud, application, data, detection and incident response — and the evidence that each control is actually enforced. Financial and operational risk, SOX controls and audit process sit on finance & risk management. The test suite, environments and release gates that decide whether a change is safe to ship sit on quality engineering. Each page goes into its own subject at the depth this one gives security.',

    conciergeHeading: 'Ask about your own environment',
    conciergeIntro: 'Bring a real control — the one you suspect would not survive an audit, or the alert queue nobody actually reads. eQORE will tell you what it would check first and what it would need from you.',
    conciergeChips: [
      'How many of our firewall rules are actually still needed?',
      'What would a real access recertification catch that our current process misses?',
      'Can you tell if an alert is worth waking someone up for?',
      'How do we prove a control is enforced, not just documented?',
      'Book a control review',
    ],

    midCta: 'Passing the audit and being secure are not the same claim.',
    midCtaLabel: 'Review One Control Gap',
    closingCta: {
      title: 'One control review.',
      highlight: 'One posture you can evidence.',
      body: 'Bring your last audit finding, or the control you already suspect would not survive one. In 30 minutes we will tell you what is a genuine gap, what is a documentation problem, and which of the two a regulator, an insurer or an attacker will actually find first.',
      proofLabel: 'From first call to a costed security assessment',
    },
  },

  'finance-risk-management': {
    slug: 'finance-risk-management',
    name: 'Finance & Risk Management',
    departmentSlug: 'shield',
    bannerBrand: 'Shield\u2122 Trust & Governance Framework',
    shortDescription: 'Transforming the finance function and quantifying the exposure it carries',
    fullDescription: 'Finance strategy, ERP and planning transformation, quantitative financial risk across credit, market, liquidity and treasury, and the controls that make both defensible.',
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Finance operating model', 'ERP & EPM transformation', 'Credit & market risk', 'Treasury & liquidity', 'Controls & regulatory reporting'],
    relatedServiceSlugs: ['ai-governance', 'business-process-management', 'analytics'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',

    // ── Positioning ─────────────────────────────────────────────────────────
    // The worst page measured on this site. 697 bytes of data, a crawler seeing
    // 2.2 per cent of it, and -- because the service sits in the Shield
    // department -- the parity default rendered the *cybersecurity* taxonomy
    // under a Finance name. Zero-Trust Security Architecture, SOC Operations,
    // OT and SCADA Security, and a four-layer stack ending in "Incident Mesh".
    // Measured on the live page: 103 security terms, zero finance terms. Not
    // one instance of credit risk, treasury, close, IFRS or forecast.
    //
    // The service is genuinely two practices that competitors sell together and
    // that most firms transform separately: the CFO agenda (operating model,
    // ERP, planning, close, controllership) and the CRO agenda (credit, market,
    // liquidity, treasury, regulatory capital). KPMG's page leads with credit,
    // market, actuarial, capital adequacy and financial instruments; EY's leads
    // with treasury and actuarial. Both are risk-first and neither carries the
    // finance-transformation half.
    //
    // The wedge is the join. Finance and Risk run on the same ledger, the same
    // exposures and the same close, and are almost always transformed by
    // different teams under different sponsors -- which is why a forecast and a
    // risk report can describe the same quarter and disagree. This page sells
    // one transformation across both, and says so in the comparison.
    //
    // Department left as shield. Finance & Risk sitting in Security & Trust is
    // a taxonomy question worth raising, not one to change silently inside a
    // content PR.
    heroTitle: 'Finance & Risk Management\nServices for the Enterprise',
    whatIsEyebrow: 'What finance and risk transformation covers',
    whatIsTitle: 'Finance That Predicts,',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'and Risk That Is Quantified.',
    whatIsPara2: 'Finance is no longer judged on reporting what happened. A CFO organization is expected to anticipate what comes next, allocate capital against it, and put a number on the exposure the enterprise is carrying \u2014 while a Chief Risk Officer is asked the same questions from the other direction, about the same balance sheet.',
    whatIsPara3: 'Those two agendas run on one ledger, one set of exposures and one close, and they are almost always transformed by different teams under different sponsors. That is why your forecast and your risk report can describe the same quarter and disagree, and why the reconciliation between them is done by hand in the week before a board meeting.',
    whatIsPara4: 'Kangqore transforms both as one program. Finance strategy and operating model, ERP and planning platforms, intelligent close and controllership, quantitative risk across credit, market, liquidity, interest rate, FX, commodity and counterparty exposure, treasury and capital, and the control framework that makes all of it defensible to an auditor. Sense, predict, decide, execute, control \u2014 measured, not asserted.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Chosen because a CFO and a CRO are each held to two of them, and because
    // all four are countable rather than rhetorical. Close days and forecast
    // accuracy are the CFO's; exposure refresh and control evidence are the
    // CRO's. Deliberately not "cost reduction", which every competitor claims
    // and none of them defines.
    outcomesEyebrow: 'WHAT THE CFO AND THE CRO ARE EACH MEASURED ON',
    outcomesHeading: 'Finance & Risk Metrics',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'Close Cycle',        desc: 'Reduction in working days from period end to signed-off consolidated numbers, after close orchestration and automated reconciliation.',        value: '45',  suffix: '%',    metricLabel: 'Faster Close',            icon: 'Zap'        },
      { illustrative: true, title: 'Forecast Accuracy',  desc: 'Improvement in variance between forecast and actual at the driver level, once planning moves from annual budget to rolling and driver-based.', value: '30',  suffix: '%',    metricLabel: 'Tighter Forecast',        icon: 'TrendingUp' },
      { illustrative: true, title: 'Exposure Refresh',   desc: 'From a monthly or quarterly exposure pack to a position refreshed daily, across credit, market, liquidity and counterparty risk.',              value: 'Daily', suffix: '',   metricLabel: 'Exposure Position',       icon: 'Radar'      },
      { illustrative: true, title: 'Control Evidence',   desc: 'Share of key financial controls evidenced automatically from the system of record rather than assembled by hand ahead of an audit.',            value: '85',  suffix: '%',    metricLabel: 'Controls Evidenced',      icon: 'ShieldCheck'},
    ],

    heroBadge: 'Predicted. Quantified. Controlled.',
    heroStripItems: [
      'Finance Operating Model', 'ERP & EPM Transformation', 'Planning & Forecasting', 'Intelligent Close',
      'Credit & Market Risk', 'Treasury & Liquidity', 'Controls & Regulatory Reporting', 'Finance Data & AI',
    ],
    hidePartnershipModel: true,

    // ── Capability areas ────────────────────────────────────────────────────
    // Eight areas, consolidated from the fifteen supplied. The template renders
    // a capability carousel; fifteen entries turn a catalog into a list
    // nobody finishes, and several of the fifteen were the same buyer with a
    // different label -- controllership and intelligent finance operations both
    // describe the close, financial crime and enterprise risk are one control
    // conversation, managed services and transformation assurance are how the
    // work is bought rather than what it is.
    //
    // Nothing was dropped. Managed services and transformation assurance became
    // engagement models, ESG folded into area 07 where its reporting obligation
    // actually sits, and actuarial and capital folded into area 05 beside the
    // other quantitative disciplines.
    //
    // Area 05 is deliberately the deepest at nineteen items. It is the page's
    // namesake, it is where KPMG and EY both lead, and a bank comparing pages
    // will look for probability of default, expected credit loss, value at
    // risk, expected shortfall and wrong-way risk by name.
    // ── Toolchain ───────────────────────────────────────────────────────────
    // The platform question a CFO arrives with. Framed by what each ecosystem
    // is genuinely better at, including where we would argue against a
    // purchase. We hold no reseller margin on any of these, which is the only
    // reason that framing is honestly available.
    toolsStack: {
      eyebrow: 'THE ENTERPRISE ECOSYSTEM',
      title: 'The platforms,',
      titleHighlight: 'and what each is actually for.',
      subtitle: 'Platform choice is mostly settled by the ERP you already run and by whether the hard problem is planning, risk or the close. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Database',
          title: 'ERP and the financial core',
          managed: 'SAP S/4HANA, Oracle Cloud ERP, Workday, Dynamics 365',
          selfHosted: 'NetSuite where the entity count is low',
          desc: 'The system of record, and the decision that outlives every other one on this page. Chart of accounts and master data matter more than the vendor: migrate them as found and you inherit the reporting limits you were trying to escape.',
        },
        {
          icon: 'TrendingUp',
          title: 'Planning and performance management',
          managed: 'Anaplan, OneStream, Oracle EPM, SAP Analytics Cloud',
          selfHosted: 'Adaptive Planning on Workday estates',
          desc: 'Where driver-based planning and consolidation live. The constraint is almost never the tool \u2014 it is whether the business ever agreed what the drivers are, which is design work no platform performs for you.',
        },
        {
          icon: 'Radar',
          title: 'Financial risk and quantitative modeling',
          managed: 'Vendor risk engines, market data platforms',
          selfHosted: 'Python, R and open quantitative libraries',
          desc: 'Credit, market and liquidity modeling. Vendor engines carry regulatory templates and validation evidence; a built stack gives control over methodology. Regulated institutions usually need both, and the split is a deliberate decision rather than a drift.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Governance, risk and controls',
          managed: 'ServiceNow GRC, SAP GRC, Archer, MetricStream, Diligent',
          selfHosted: 'ServiceNow where IT already runs on it',
          desc: 'Control libraries, testing workflow and continuous monitoring. Existing entitlements decide this more often than any evaluation does, and a GRC tool nobody feeds is worse than a spreadsheet somebody maintains.',
        },
        {
          icon: 'Globe',
          title: 'Treasury and cash management',
          managed: 'Treasury management systems, bank connectivity platforms',
          selfHosted: 'ERP-native treasury on single-instance estates',
          desc: 'Cash visibility, forecasting and hedge management. Bank connectivity is the work; the system is the easy part, and connectivity is what slips a treasury program rather than configuration.',
        },
        {
          icon: 'Layers',
          title: 'Finance and risk data',
          managed: 'Snowflake, Databricks, Microsoft Fabric, Azure Synapse',
          selfHosted: 'Whatever your data platform team already runs',
          desc: 'The layer that decides whether the forecast and the risk pack can be reconciled at all. Building this once for both functions is the single highest-leverage decision in a finance and risk program.',
        },
        {
          icon: 'Zap',
          title: 'Automation and AI in the flow',
          managed: 'UiPath, Automation Anywhere, Power Automate, GenAI services',
          selfHosted: 'Engineered on our automation services',
          desc: 'Invoice capture, reconciliation, close orchestration, variance commentary and regulatory drafting. AI belongs inside a controlled process with lineage; over a spreadsheet estate it produces fast answers nobody can evidence.',
        },
        {
          icon: 'Eye',
          title: 'ESG and sustainability reporting',
          managed: 'Workiva, Sphera, Enablon, Persefoni, SAP Sustainability',
          selfHosted: 'Inside the finance close where it is assured',
          desc: 'Increasingly a controllership problem rather than a communications one. Once sustainability disclosures are assured, they need the same lineage, controls and close discipline as the financial statements.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve finance and risk questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran six promotional answers averaging under fifty
    // words -- and they were the *security* defaults, since this service sits
    // in the Shield department. These are the questions a CFO, a group
    // financial controller and a CRO actually open with, and five are ones a
    // Big Four competitor would rather not be asked.
    customFAQs: [
      {
        q: 'What does Kangqore Finance & Risk Management actually cover?',
        a: 'Two agendas that share one ledger, delivered as one program.\n\nThe CFO side: finance strategy and operating model, ERP and planning platform transformation, financial planning and enterprise performance management, procure-to-pay through record-to-report, the close and controllership.\n\nThe CRO side: quantitative financial risk across credit, market, liquidity, interest rate, foreign exchange, commodity and counterparty exposure, plus treasury and capital, actuarial and capital adequacy where the sector requires it.\n\nAnd the layer that makes both defensible: internal controls, regulatory reporting, financial crime analytics, and the shared finance and risk data model underneath. Most firms sell these as separate practices with separate sponsors. That separation is precisely what produces a forecast and a risk report that describe the same quarter and disagree.',
      },
      {
        q: 'We are a bank. Do you actually do quantitative credit and market risk?',
        a: 'Yes, and it is worth being specific rather than gesturing at the category.\n\nCredit: probability of default, loss given default and exposure at default modeling, expected credit loss under IFRS 9, portfolio and concentration analytics, early warning systems, risk-based pricing and credit stress testing.\n\nMarket: value at risk, expected shortfall, sensitivity analysis, stress and scenario testing, risk aggregation and regulatory market risk reporting.\n\nAlongside those: liquidity risk and contingency funding, interest rate risk and asset-liability management, counterparty exposure including wrong-way risk and collateral analytics, capital adequacy, and risk data aggregation aligned to BCBS 239.\n\nModel validation is part of the work rather than an afterthought. A model a regulator cannot follow is a finding regardless of how well it performs.',
      },
      {
        q: 'Our close takes eleven days. How much of that is actually removable?',
        a: 'Usually more than the finance team expects, and rarely from where the program proposes to remove it.\n\nMost close programs shorten the consolidation run, which was almost never the bottleneck. The days sit in reconciliation, intercompany, chasing accruals from the business, and waiting for one subsidiary. We measure the close task by task before proposing anything, because the estimate finance holds and what the timestamps show are usually different by several days.\n\nWhat reliably comes out: automated reconciliation with tolerance rules, intercompany matching and elimination, close orchestration so tasks release when their dependency completes rather than when someone emails, and anomaly detection on journals so review is targeted instead of exhaustive.\n\nA fast close on unreliable numbers is worse than a slow one, so the sequence matters: fix the reconciliation, then compress the calendar.',
      },
      {
        q: 'Can you modernize our SAP or Oracle finance environment?',
        a: 'Yes, across strategy, architecture, migration, process transformation and post-go-live optimization \u2014 S/4HANA, Oracle Cloud ERP, Dynamics 365, Workday and NetSuite.\n\nThe part worth arguing about before you start is the chart of accounts and master data. A migration that lifts them as found delivers a modern platform reporting on an old structure, and you inherit exactly the limits you were trying to escape. Redesigning them is unpopular, slower, and the difference between a technical upgrade and a finance transformation.\n\nWe are platform-agnostic in the literal sense: we hold no reseller margin on any of these, so a recommendation to stay where you are and fix the data costs us nothing.',
      },
      {
        q: 'Why should Finance and Risk be transformed together rather than separately?',
        a: 'Because they run on the same ledger and the same exposures, and separating them creates the reconciliation problem you then pay somebody to solve.\n\nWhen finance builds a forecast from one extract and risk builds an exposure pack from another, both are defensible and they disagree. Somebody reconciles them by hand in the week before the board meets, every quarter, forever. That work is invisible in both business cases because it belongs to neither program.\n\nBuilding one finance and risk data model with declared lineage removes it. It is also the harder sell internally, because it requires two sponsors to agree on a design neither fully controls \u2014 which is why it is usually deferred until a regulator asks a question that takes three weeks to answer.\n\nIf your organization genuinely cannot align the two sponsors, we would rather do one properly than both badly, and we will say so.',
      },
      {
        q: 'How is AI used here, realistically?',
        a: 'For the work between the steps, inside a process that already has lineage and controls.\n\nWhat genuinely works today: extracting and coding invoices, matching reconciliations and explaining the breaks, detecting anomalous journals, drafting variance commentary a controller then edits, summarizing regulatory text against your obligation register, and answering questions about financial data in natural language.\n\nWhat it does not do is substitute for the data model, the control framework or the audit trail. AI over a spreadsheet estate produces fast answers nobody can evidence, which in a regulated financial process is worse than the slow version.\n\nOne specific caution: models used in credit or market risk are subject to model risk management. A generative component in a regulatory calculation needs the same validation, documentation and version control as any other model, and most organizations have not yet extended their framework to cover it.',
      },
      {
        q: 'What does an engagement cost, and how is it priced?',
        a: 'We are pre-launch and do not publish rate cards, so treat this as shape rather than a quote.\n\nThe assessment is a fixed-price engagement measured in weeks and deliberately scoped so you can stop after it, own the output, and take the build elsewhere or nowhere. Operating model and architecture is priced against the assessment. Platform implementation is priced against the architecture, which is why we prefer not to quote a build before the design exists \u2014 the estimate would be a guess and both sides would discover that in month four.\n\nSoftware licensing is a separate line and goes to the vendor. Where you already hold entitlements that cover the work, we will say so. Managed operations is a monthly service level with the volumes and response times written down.',
      },
      {
        q: 'How do you handle regulatory reporting and audit evidence?',
        a: 'By making the evidence a by-product of the process rather than a project that happens before an audit.\n\nRegulatory submissions get a traced path from the reported figure back to the source transaction, with the model version, the transformation logic and the approver attached. Reconciliation between regulatory and financial reporting is automated rather than performed by a team in the week before submission.\n\nControls are evidenced continuously from the system of record. Segregation of duties is enforced by the platform rather than by policy. Control testing samples from live data, so effectiveness is a live measure rather than an annual opinion formed about events months old.\n\nThe practical test is whether you can answer how a number was derived without convening the people who built the model. Most organizations discover the answer during an actual investigation.',
      },
      {
        q: 'We have tried a finance transformation before and it did not deliver. Why would this?',
        a: 'Usually one of three reasons, and it is worth establishing which before spending again.\n\nNo baseline: benefits were asserted rather than measured, so when the next budget round came there was nothing to defend. Close days, forecast variance and control coverage have to be captured before the work starts, because they cannot be reconstructed afterwards.\n\nThe data was deferred: platforms were implemented on the existing data model because fixing it was out of scope, and the reporting limits survived the transformation intact.\n\nOr the operating model never changed: new systems, same organization, same accountability gaps, same manual reconciliation. Technology cannot resolve a question about who owns a number.\n\nNone of the three is a technology failure, which is why our first engagement measures rather than builds.',
      },
      {
        q: 'Can you run finance operations for us afterwards?',
        a: 'Yes, and it is priced and governed separately from the transformation so the two are not entangled.\n\nManaged operations can cover procure-to-pay, order-to-cash and record-to-report processing, close support and reconciliation, regulatory reporting operations, treasury operations, and continuous controls monitoring with exception escalation.\n\nThe reporting is the part worth insisting on: close days, forecast variance, exception volumes and control coverage, monthly, against the baseline captured at assessment. A managed service that reports only on volumes processed tells you nothing about whether the function is improving.\n\nWhat we will not do is build a capability only we can operate. Documentation, runbooks and your people trained during delivery are conditions of the engagement, not extras.',
      },
      {
        q: 'Where does ESG and climate risk fit in Finance?',
        a: 'Increasingly in controllership, which is a change most organizations have not yet absorbed.\n\nWhile sustainability disclosure was voluntary it sat in communications or strategy. Once it is assured, it needs what financial statements need: a defined data model, lineage from disclosure back to source, controls over the calculation, and a close process with a sign-off. Auditors are already asking those questions.\n\nClimate risk is a second and separate problem \u2014 scenario analysis over physical and transition exposure, feeding capital planning and, for financial institutions, regulatory stress testing. That is quantitative risk work rather than reporting work, and it belongs beside credit and market risk rather than beside the annual report.\n\nWe treat both as finance and risk problems, which is why they sit inside the controls capability on this page rather than in a separate sustainability practice.',
      },
      {
        q: 'How do you measure whether the transformation worked?',
        a: 'Against four numbers captured before anything is built, and reported afterwards whether or not they flatter us.\n\nClose days from period end to signed-off consolidated numbers. Forecast variance at driver level against actuals. Exposure refresh frequency across credit, market, liquidity and counterparty risk. And the share of key controls evidenced automatically rather than assembled by hand.\n\nEach is countable, each has an owner, and each is meaningless without a before \u2014 which is why the assessment captures them while the process is still manual. Benefits stated in a business case and never measured again are the normal outcome of a finance transformation, and the reason the next one is harder to fund.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // Managed services and transformation assurance were supplied as capability
    // areas fourteen and fifteen. They are not capabilities, they are how the
    // work is bought, and a CFO scanning a procurement schedule looks for them
    // here. Same content, correct section.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five engagement models,',
    engagementHeadingHighlight: 'one accountable baseline.',
    engagementLede: 'Almost nobody starts with a finance transformation program. They start with a close that takes too long, a forecast nobody trusts, or a regulator asking a question that took three weeks to answer.',
    servicePackages: [
      {
        name: 'Finance & Risk Assessment',
        description: 'Fact-finding before commitment. What your close actually costs in days and hands, how accurate the forecast has been, what the exposure is, and which controls are evidenced rather than asserted.',
        deliverables: [
          'Close cycle measured task by task, not estimated',
          'Forecast accuracy history analyzed at driver level',
          'Exposure and control coverage baseline across risk types',
          'Finance and risk data lineage and quality gap analysis',
          'Sequenced roadmap with a business case per wave',
        ],
      },
      {
        name: 'Operating Model & Architecture',
        description: 'The design work that decides your next decade. Target operating model, platform architecture, and the shared finance and risk data model most programs defer until it is expensive to retrofit.',
        deliverables: [
          'Target operating model with roles, ownership and RACI',
          'ERP, EPM, treasury and risk platform architecture',
          'Unified finance and risk data model and chart of accounts',
          'Control framework designed into the process, not audited onto it',
          'Platform selection with a scored, vendor-neutral recommendation',
        ],
      },
      {
        name: 'Platform & Risk Model Build',
        description: 'Implementation across ERP, planning, treasury and risk platforms, including the quantitative model development and validation that a regulator will later examine.',
        deliverables: [
          'ERP and EPM implementation, migration or consolidation',
          'Risk model development, documentation and independent validation',
          'Treasury and liquidity platform implementation',
          'Data pipelines with lineage and automated quality controls',
          'Parallel run with output reconciliation before cutover',
        ],
      },
      {
        name: 'Transformation Assurance',
        description: 'Independent assurance over a program somebody else is delivering. Commissioned by boards and audit committees when a finance transformation is large enough that finding out late is unacceptable.',
        deliverables: [
          'Program health assessment against scope, schedule and value',
          'Architecture, data and controls assurance reviews',
          'Cutover and go-live readiness assessment',
          'Benefits realization tracking against the original case',
          'Board and audit committee reporting',
        ],
      },
      {
        name: 'Managed Finance & Risk Operations',
        description: 'Running the transformed capability under a service level: transactional operations, close support, regulatory reporting and continuous controls monitoring.',
        deliverables: [
          'Procure-to-pay, order-to-cash and record-to-report operations',
          'Financial close support and reconciliation operations',
          'Regulatory reporting and compliance operations',
          'Continuous controls monitoring with exception escalation',
          'Monthly reporting on close days, accuracy and control coverage',
        ],
      },
    ],

    // ── Industry ────────────────────────────────────────────────────────────
    // Ten sectors from the supplied list. Each headline names the structural
    // reason finance and risk are hard to join in that sector specifically --
    // regulatory capital in banking, reserving in insurance, commodity
    // exposure in energy - rather than restating the capability list with a
    // sector word in front of it, which is what makes most industry grids
    // worthless.
    industryHeading: 'Finance & Risk Management',
    industryHeadingHighlight: 'by industry.',
    industryLede: 'Ten sectors, and the structural reason finance and risk resist being joined in yours \u2014 the constraint that decides what a transformation there actually has to solve.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Regulatory capital is calculated from the same positions the P&L is built on, by a different team, on a different cycle.',
        items: ['Credit risk modeling, ECL and IFRS 9', 'Capital adequacy and Basel reporting', 'Risk data aggregation under BCBS 239'],
      },
      {
        industry: 'Insurance',
        headline: 'Reserving is an actuarial judgment that lands in the financial statements, so the model and the ledger have to agree.',
        items: ['Actuarial modeling and data modernization', 'Solvency, capital and reserving analytics', 'Regulatory and financial reporting convergence'],
      },
      {
        industry: 'Wealth & Asset Management',
        headline: 'Client portfolio risk and firm financial performance are separate reporting worlds that regulators increasingly want reconciled.',
        items: ['Portfolio risk and investment analytics', 'Fee, margin and profitability management', 'Regulatory reporting and fund liquidity risk'],
      },
      {
        industry: 'Private Equity & Portfolio Companies',
        headline: 'Consolidating portfolio companies that share no chart of accounts, on a reporting deadline set by the fund.',
        items: ['Multi-entity consolidation and reporting', 'Portfolio finance standardization', 'Value creation and performance intelligence'],
      },
      {
        industry: 'Manufacturing',
        headline: 'Cost sits in operational systems and margin sits in the ledger, and the two are reconciled once a month at best.',
        items: ['Product and customer profitability', 'Working capital and inventory finance', 'Supply chain counterparty exposure'],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'Commodity exposure moves daily while capital allocation and regulatory reporting move quarterly.',
        items: ['Commodity price risk and hedge analytics', 'Capital allocation and asset finance', 'ESG, climate risk and regulatory reporting'],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Margin is decided at promotion level and reported at entity level, with the connection lost somewhere in between.',
        items: ['Margin, promotion and revenue intelligence', 'Working capital and payment operations', 'Payment fraud and revenue leakage detection'],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Revenue recognition depends on contracts and reimbursement rules that finance does not own and cannot see.',
        items: ['Revenue recognition and contract accounting', 'Regulatory compliance and audit readiness', 'Working capital and receivables analytics'],
      },
      {
        industry: 'Technology & Telecommunications',
        headline: 'Recurring revenue makes the forecast a model rather than a projection, and the model lives outside the ledger.',
        items: ['Subscription revenue recognition and planning', 'Driver-based forecasting for recurring revenue', 'Treasury, FX and multi-entity consolidation'],
      },
      {
        industry: 'Government & Public Sector',
        headline: 'Budgetary control and statutory accounting answer to different rulebooks over the same transactions.',
        items: ['Budgetary control and public financial management', 'Statutory and regulatory reporting', 'Controls, assurance and audit readiness'],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // The page's thesis in six rows: finance and risk are transformed by
    // different teams under different sponsors against the same ledger, and
    // every symptom below descends from that. Both columns describe competent
    // work -- the difference is whether the two functions share a data model.
    comparisonTable: {
      eyebrow: 'TWO FUNCTIONS, ONE LEDGER',
      heading: 'Finance and Risk Transformed Separately, or Together.',
      lede: 'Both columns describe capable teams delivering what they were asked to deliver. They differ on whether the CFO and the CRO can be shown the same number.',
      beforeLabel: 'TWO PROGRAMS, TWO SPONSORS',
      afterLabel: 'ONE TRANSFORMATION',
      afterBadge: 'KANGQORE',
      beforeShort: 'SEPARATE',
      afterShort: 'JOINED',
      rows: [
        {
          dimension: 'When the forecast and the risk pack disagree',
          before: 'Both are defensible, both were built from a different extract of the same ledger, and the reconciliation is done by hand in the week before the board meets.',
          after: 'One finance and risk data model with declared lineage, so a variance is a real difference in view rather than a difference in extract date.',
        },
        {
          dimension: 'How often exposure is known',
          before: 'A pack assembled monthly or quarterly. Between packs, the honest answer to what the exposure is now is an estimate.',
          after: 'Positions refreshed daily across credit, market, liquidity and counterparty risk, with the same numbers feeding the forecast.',
        },
        {
          dimension: 'Where the close days actually go',
          before: 'Programs shorten the consolidation run, which was never the bottleneck. The days are lost to reconciliation, intercompany and chasing.',
          after: 'Measured task by task first, then automated where the time actually sits \u2014 usually reconciliation and intercompany, rarely consolidation.',
        },
        {
          dimension: 'When a regulator asks how a number was derived',
          before: 'Reconstructed from spreadsheets and the memory of whoever built the model, assuming they still work here.',
          after: 'Traced through lineage from the submitted figure to the source transaction, with the model version and approver attached.',
        },
        {
          dimension: 'How controls are evidenced',
          before: 'Screenshots and sign-off sheets assembled in the fortnight before the audit, testing a sample of what happened months ago.',
          after: 'Evidenced continuously from the system of record, so control effectiveness is a live measure rather than an annual opinion.',
        },
        {
          dimension: 'What happens after go-live',
          before: 'The program closes, the benefits case is filed, and nobody measures whether the forecast actually got more accurate.',
          after: 'Close days, forecast variance, exposure refresh and control coverage baselined before the work and reported against afterwards.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Five stages because the template renders architectureNodes as a
    // four-column grid unless the array is exactly five. The supplied
    // eight-layer architecture and seven-step intelligence loop both compress
    // here; the loop's language survives in the definition section, where it
    // reads as an argument rather than as a diagram.
    architectureEyebrow: 'THE TRANSFORMATION LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Assess to Operate.',
    architectureLede: 'Five stages, run as a continuous capability rather than a program with a closing date. Most engagements start at Assess and stop being sequential once the first value stream is live.',
    architectureNodes: [
      {
        title: 'Assess',
        icon: 'Search',
        description: 'Establish what is true before designing anything: how long your close really takes task by task, how accurate the forecast has been, what the exposure is, and which controls are evidenced rather than asserted.',
        features: [
          'Finance maturity and benchmark assessment',
          'Close cycle measured task by task',
          'Forecast accuracy history at driver level',
          'Exposure and control coverage baseline',
          'Data quality and lineage gap analysis',
        ],
      },
      {
        title: 'Architect',
        icon: 'Layers',
        description: 'Your target operating model, platform architecture and the one thing most programs defer until it is expensive: a shared finance and risk data model with an agreed chart of accounts.',
        features: [
          'Target operating model and accountability',
          'ERP, EPM and risk platform architecture',
          'Unified finance and risk data model',
          'Chart of accounts and master data design',
          'Control framework designed into the flow',
        ],
      },
      {
        title: 'Modernize',
        icon: 'Cpu',
        description: 'Build it. Your ERP and planning platforms, risk models, treasury systems and the integration between them \u2014 sequenced by value stream rather than by module, so something reaches production early.',
        features: [
          'ERP and EPM implementation or migration',
          'Risk model development and validation',
          'Treasury and liquidity platform build',
          'Data pipelines, lineage and quality controls',
          'Parallel run before any cutover',
        ],
      },
      {
        title: 'Automate',
        icon: 'Zap',
        description: 'Take the hands out of your transactional layer and your close, and put continuous monitoring on the controls. This is where the close days and the audit preparation actually come down.',
        features: [
          'Transactional and close automation',
          'Reconciliation and anomaly detection',
          'Continuous controls monitoring',
          'Regulatory reporting automation',
          'AI-assisted analysis and commentary',
        ],
      },
      {
        title: 'Operate',
        icon: 'Activity',
        description: 'Run it, measure it against the baseline taken at Assess, and keep improving. Your finance processes drift back toward manual the moment nobody is reporting on them.',
        features: [
          'Managed finance and risk operations',
          'Close, forecast and exposure reporting',
          'Model monitoring and revalidation',
          'Benefits realization against baseline',
          'Continuous improvement backlog',
        ],
      },
    ],

    capabilitiesLabel: 'FINANCE & RISK MANAGEMENT SERVICES',
    capabilitiesSectionTitle: 'Finance & Risk Management',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Design the finance function, modernize the core it runs on, make planning continuous, close faster with fewer hands, quantify the exposure the balance sheet carries, and evidence the controls over all of it.',
    capabilityAreas: [
      {
        title: 'Finance Strategy & Operating Model',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where your finance work should sit, who is accountable for it, and what the function is for. Decided before any platform, because the platform encodes the answer for the next decade.',
        items: [
          'Finance Function & Transformation Strategy',
          'Target Operating Model Design',
          'Finance Organization & Role Design',
          'Global Business Services & Shared Services',
          'Onshore, Offshore & Nearshore Split',
          'Finance Maturity Assessment & Benchmarking',
          'Process Harmonization Across Entities',
          'Finance Center of Excellence Design',
          'Finance Cost & Service Model Optimization',
          'Finance Workforce & Capability Planning',
          'Transformation Portfolio Governance',
          'Benefits Realization Framework',
        ],
      },
      {
        title: 'Digital Finance Core & ERP Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The system of record and everything downstream that inherits its assumptions. Your chart of accounts and master data decide what you can report on later, which is why they are settled first rather than migrated as found.',
        items: [
          'ERP Strategy & Finance Architecture',
          'SAP S/4HANA Finance Transformation',
          'Oracle Cloud ERP Transformation',
          'Microsoft Dynamics 365 Finance',
          'Workday & NetSuite Finance',
          'ERP Migration & Multi-Instance Consolidation',
          'Chart of Accounts Redesign',
          'Finance Master Data Management',
          'Sub-Ledger & Integration Architecture',
          'Finance API & Event Integration',
          'Legacy Finance Application Modernization',
          'Application Rationalization',
          'Cutover, Hypercare & Post-Go-Live Optimization',
        ],
      },
      {
        title: 'Planning, Forecasting & Performance Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Moving your annual budget, which is wrong by March to a rolling, driver-based model that answers what-if in an afternoon. The constraint is rarely the tool; it is whether anyone agreed the drivers.',
        items: [
          'FP&A Transformation',
          'Driver-Based Planning Models',
          'Rolling Forecasts & Continuous Planning',
          'Scenario & Sensitivity Modeling',
          'Financial Consolidation',
          'Profitability & Cost Management',
          'Revenue & Margin Planning',
          'Workforce & Capacity Planning',
          'Capital Expenditure Planning',
          'Management Reporting & Board Packs',
          'Predictive & AI-Assisted Forecasting',
          'Enterprise Performance Analytics',
        ],
      },
      {
        title: 'Intelligent Finance Operations & Controllership',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Your transactional engine and the close that depends on it. Most close programs shorten the wrong end \u2014 the days are lost to reconciliation and intercompany, not to the final consolidation run.',
        items: [
          'Procure-to-Pay & Invoice Automation',
          'Intelligent Invoice Capture & Matching',
          'Order-to-Cash, Collections & Cash Application',
          'Credit, Dispute & Deduction Management',
          'Record-to-Report Transformation',
          'Account Reconciliation Automation',
          'Intercompany Accounting & Elimination',
          'Close Orchestration & Task Management',
          'Anomaly Detection in Journals',
          'Automated Variance Analysis & Commentary',
          'Continuous Accounting',
          'Technical Accounting & Audit Readiness',
          'Close Performance Analytics',
        ],
      },
      {
        title: 'Financial Risk Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The quantitative core, and the reason this page exists. Your credit, market, liquidity, rate, currency, commodity and counterparty exposure, measured continuously rather than assembled into a pack once a quarter.',
        items: [
          'Credit Risk Strategy & Rating Frameworks',
          'Probability of Default Modeling',
          'Loss Given Default & Exposure at Default',
          'Expected Credit Loss & IFRS 9',
          'Credit Portfolio & Concentration Analytics',
          'Early Warning Systems & Risk-Based Pricing',
          'Value at Risk & Expected Shortfall',
          'Market Risk Sensitivity & Greeks',
          'Stress Testing & Scenario Analysis',
          'Liquidity Risk & Cash-Flow Modeling',
          'Contingency Funding & Intraday Liquidity',
          'Interest Rate Risk & Asset-Liability Management',
          'Foreign Exchange Exposure & Hedge Analytics',
          'Commodity Price Risk Modeling',
          'Counterparty Exposure & Wrong-Way Risk',
          'Collateral & Credit Limit Frameworks',
          'Actuarial Modeling & Capital Adequacy',
          'Solvency & Risk-Adjusted Performance',
          'Risk Data Aggregation & BCBS 239 Alignment',
        ],
      },
      {
        title: 'Treasury, Liquidity & Capital Management',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Cash you can see, funding you can rely on, and capital deployed against a return you can defend to your board. Usually the fastest measurable win in a finance program, because the visibility gap is larger than anyone expects.',
        items: [
          'Treasury Transformation & Operating Model',
          'Global Cash Visibility & Bank Connectivity',
          'Cash-Flow Forecasting',
          'Liquidity Management & Pooling',
          'Working Capital Optimization',
          'Receivables & Payables Optimization',
          'Funding Strategy & Debt Analytics',
          'Investment & Yield Analytics',
          'Hedging Program Design & Effectiveness',
          'Capital Allocation Frameworks',
          'Treasury Management System Implementation',
          'Treasury Analytics & Reporting',
        ],
      },
      {
        title: 'Controls, Regulatory Reporting & Financial Crime',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What makes your numbers defensible: the control framework, the regulatory submission, and the detection layer that finds what the controls did not stop. One conversation, not three.',
        items: [
          'Enterprise & Operational Risk Frameworks',
          'Risk Appetite, Taxonomy & Key Risk Indicators',
          'Internal Controls Modernization & Rationalization',
          'SOX & Financial Control Testing',
          'Continuous Controls Monitoring',
          'Segregation of Duties Design & Monitoring',
          'Regulatory Reporting Transformation',
          'Regulatory Data Architecture & Reconciliation',
          'Capital Adequacy & Basel Reporting',
          'Regulatory Change Management',
          'Fraud Analytics & Transaction Monitoring',
          'Duplicate Payment & Revenue Leakage Detection',
          'AML, KYC & Trade Surveillance Analytics',
          'Investigation Case Management',
          'ESG, Climate Risk & Sustainability Reporting',
          'Audit Readiness & Remediation',
        ],
      },
      {
        title: 'Finance & Risk Data, Analytics and AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The layer that decides whether any of the above can be believed. Your forecast and your risk report disagree because they were built on different extracts of the same ledger, and no amount of AI fixes that.',
        items: [
          'Finance & Risk Data Strategy',
          'Unified Finance and Risk Data Model',
          'Data Architecture & Engineering',
          'Master & Reference Data Management',
          'Data Quality, Lineage & Governance',
          'Risk Data Aggregation & Reporting',
          'Real-Time Finance Analytics',
          'Predictive Forecasting Models',
          'Scenario & Simulation Intelligence',
          'Generative AI for Financial Analysis',
          'AI-Assisted Regulatory Interpretation',
          'Natural-Language Financial Intelligence',
          'Model Risk Management & Validation',
        ],
      },
    ],

    midCta: 'The forecast and the risk report describe the same quarter. They disagree.',
    midCtaLabel: 'Review One Close Cycle',
    closingCta: {
      title: 'One close cycle,',
      highlight: 'measured end to end.',
      body: 'Bring your last period close and your latest exposure pack. In 30 minutes we will show you where the two disagree, which of the days between period end and sign-off are avoidable, and what a single finance and risk data model would be worth \u2014 before any platform decision.',
      proofLabel: 'From first call to a costed finance and risk baseline',
    },
  },

  'quality-engineering-assurance': {
    slug: 'quality-engineering-assurance',
    name: 'Quality Engineering & Assurance',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Engineering the test suite as a product, so a green build means something',
    // The four non-breaking spaces bind "change is safe to ship" so the phrase
    // can never be split across the hero's two lines. Without them the break
    // landed mid-phrase at 1280, 1512 and 1920 ("...whether a change is safe /
    // to ship — ..."), which reads as a stumble in the one sentence every
    // visitor actually reads. With them, line two opens on "change".
    //
    // The tail was also shortened: at 168 characters this wrapped to three
    // lines at 1024. Measured two lines at 1024, 1280, 1512 and 1920.
    fullDescription: 'Design, build and operate the tests, environments and release gates that decide whether a change\u00A0is\u00A0safe\u00A0to\u00A0ship — and keep the signal trustworthy.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Test strategy', 'Automation engineering', 'Flake reduction', 'Performance engineering', 'Test data & environments', 'Release gates'],
    relatedServiceSlugs: ['devops-as-a-service', 'api-microservices-engineering', 'it-security-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    // Real date, set when this page was written. Emitted as dateModified in the
    // WebPage node by seo/serviceSchema.js. Only pages carrying this key get a
    // date, so no service publishes a freshness claim nobody made.
    lastReviewed: '2026-08-23',

    // ── Positioning ──────────────────────────────────────────────────
    // 718 bytes on the Shield parity default, which put "Reactive Security vs.
    // Governed Zero-Trust Security" and a SIEM/IAM toolchain on a page about
    // testing software. 27/40.
    //
    // The whole category says the same four things: shift-left, continuous
    // testing, AI-generated tests, measurable outcomes. HCLTech, Capgemini,
    // Cognizant and Infosys are interchangeable on it. Nothing in that pitch is
    // wrong, and none of it is an argument.
    //
    // The wedge is the half nobody sells: a test suite is software too, and in
    // most enterprises it is the largest codebase with no owner. It accumulates
    // flake, its runtime creeps until engineers stop running it locally, and at
    // some point a team crosses a line it cannot see -- the build goes red and
    // the first reaction is to press retry. After that every additional test is
    // money spent on a signal nobody reads, and generating more of them with a
    // model just gets there faster.
    //
    // So the page is organized around trust in the signal rather than around
    // coverage. Capability area 02 exists nowhere else in the market at this
    // depth, area 07 is the frontier problem (systems that do not answer the
    // same way twice), and the outcomes are flake rate, time to verdict, suite
    // maintenance load and change failure rate -- not defect escape rate and
    // automation coverage, which every competitor publishes and which cannot be
    // falsified without the client's baseline.
    //
    // Scope discipline matters more here than on any other page, because
    // testing touches everything and the draft that arrived claimed twenty
    // capability areas including cloud IaC, data warehouse testing, model
    // fairness, penetration testing and business continuity. Those belong to
    // devops-as-a-service, big-data, ai-governance, it-security-services and
    // managed-infrastructure-services respectively. What survived is what a
    // quality engineering team is actually accountable for, and the boundary is
    // stated out loud in the practice cluster, the toolchain and FAQ 12.
    heroTitle: 'Quality Engineering for a Build\nYou Can Actually Believe',
    heroBadge: 'Engineered. Measured. Owned.',
    heroStripItems: [
      'Test Strategy', 'Automation Engineering', 'Flake Reduction', 'Contract Testing',
      'Performance Engineering', 'Test Data & Environments', 'AI Evaluation Harnesses', 'Release Gates',
    ],
    hidePartnershipModel: true,

    whatIsEyebrow: 'What quality engineering is actually for',
    whatIsTitle: 'A Green Build Is a Claim.',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'It Is Not Evidence.',
    whatIsPara2: 'Quality engineering is the work of turning the question the business keeps asking — is this change safe to ship — into an answer somebody is willing to sign. Testing gathers the evidence. The engineering is everything around it: deciding what is worth testing and what deliberately is not, building a suite fast enough to be part of the work rather than a queue in front of it, and keeping the result trustworthy for longer than one quarter.',
    whatIsPara3: 'The part almost nobody resources is that the suite is software too, and in most enterprises it is the largest codebase without an owner. It accumulates. A test fails for a reason unrelated to the change, so it gets retried, then muted, then forgotten. Runtime creeps from four minutes to forty, so engineers batch their changes and stop running it locally. Then a team crosses a line it cannot see: the build goes red and the first reaction is to press retry rather than to read the failure.',
    whatIsPara4: 'After that point, every extra test you write is money spent on a signal nobody reads — and generating them with a model only gets you there faster. So Kangqore engineers the suite as a product with an owner, a budget and a service level. Flake measured and driven down before coverage is widened. Runtime treated as a delivery constraint. Test data that is legal to hold and realistic enough to be worth running against. Environments that exist when somebody needs one. And a release gate that blocks on evidence a release manager can read, not on a percentage nobody can defend.',

    // ── Outcomes ────────────────────────────────────────────────────
    // Not defect escape rate and automation coverage. Both are on every
    // competitor page, both move for reasons unrelated to the work, and neither
    // is checkable without the client's own baseline.
    //
    // These four are what a head of engineering is judged on once a suite is
    // past its first thousand tests: whether a red build means anything, how
    // long a verdict takes, how much of the week goes to repairing tests rather
    // than writing product, and whether deploys are getting safer. The fourth
    // is a published DORA metric, so it is comparable outside this page.
    outcomesEyebrow: 'WHAT DECIDES WHETHER A TEST SUITE SURVIVES',
    outcomesHeading: 'Four numbers that decide',
    outcomesHeadingHighlight: 'whether anyone reads the build.',
    businessMetrics: [
      { illustrative: true, title: 'Signal Trust',          desc: 'Share of red builds caused by a real defect rather than a flaky test, after the worst offenders are root-caused, rewritten or deleted rather than muted.',            value: '95', suffix: '%',   metricLabel: 'Failures That Are Real',      icon: 'ShieldCheck' },
      { illustrative: true, title: 'Time to Verdict',       desc: 'Wall-clock from a push to a result an engineer can act on, after parallelization, change-impact selection and removing tests that were never load-bearing.',        value: '15', suffix: ' Min', metricLabel: 'Commit to a Usable Answer',   icon: 'Zap' },
      { illustrative: true, title: 'Suite Maintenance Load', desc: 'Reduction in engineering time spent repairing the suite rather than building product, once tests are owned, layered correctly and stop asserting on non-contracts.', value: '50', suffix: '%',   metricLabel: 'Less Time Repairing Tests',   icon: 'Activity' },
      { illustrative: true, title: 'Change Failure Rate',   desc: 'Reduction in deployments that cause a production incident or need a rollback, measured against your own baseline rather than an industry benchmark.',                value: '40', suffix: '%',   metricLabel: 'Fewer Deploys That Bite Back', icon: 'TrendingUp' },
    ],

    // ── Engagement outcomes ────────────────────────────────────────
    // Overridden rather than left on the parity default, which invents a client
    // called "Global Enterprise Organization" and asserts "100% operational
    // reliability". On a quality assurance page, an unfalsifiable reliability
    // claim about a client that does not exist is the most damaging sentence
    // that could be published. These say what they are in the descriptor.
    outcomeCard: {
      illustrative: true,
      metric: '14h → 26m',
      metricLabel: 'regression wall-clock',
      industry: 'Modeled scenario — commerce platform, ~40 engineers',
      problem: 'An overnight regression suite of 4,000 browser tests that nobody could run before merging, with roughly one run in three failing for reasons unrelated to the change.',
      outcome: 'Assertions pushed down to API and contract level, the browser suite cut to the journeys that genuinely need a browser, the remainder sharded and change-selected. The figures are modeled from typical suite profiles, not measured on a named client.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '31% → 4%',
      metricLabel: 'of failures that were flaky',
      industry: 'Modeled scenario — regulated financial services release train',
      problem: 'A quarantine folder with 180 tests in it, no expiry dates, and a release board that had stopped treating a red build as a reason to hold.',
      outcome: 'Flake root-caused by class — shared state, timing, test-order dependence — with an expiry date on every quarantined test. Modeled figures, offered to show the shape of the work rather than to represent a specific engagement.',
    },

    // ── Capability areas ───────────────────────────────────────────
    // All twenty, in the order they were specified, laid out 8 + 8 + 4 across
    // one continuous bento. The emphasized slots fall where the argument wants
    // them: 01 opens tall, 08 (AI & Model Assurance) takes the full width at
    // the end of the first movement, 09 opens the second tall, 16 (Test
    // Environment Engineering) takes the full width, and 20 closes wide.
    //
    // Four areas border another Kangqore service, and each says so in its own
    // description rather than being dropped: 06 hands the platform itself to
    // DevOps and managed infrastructure, 07 hands the data platform to data
    // engineering, 08 hands production drift to MLOps and the regulatory file
    // to AI governance, and 11 hands penetration testing and the security
    // program to IT security. Stating the seam is more useful to a buyer than
    // either claiming it or silently omitting it.
    capabilitiesLabel: 'QUALITY ENGINEERING & ASSURANCE SERVICES',
    capabilitiesSectionTitle: 'Quality Engineering & Assurance',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Twenty areas spanning strategy through managed operation — applications, APIs, data, AI, cloud, packaged platforms and connected products — including the four seams where another Kangqore practice takes over, named on the card rather than left implied.',
    capabilityAreas: [
      {
        title: 'Quality Engineering Strategy & Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where the testing budget goes, who owns it, and what it is allowed to block. Most QE transformations fail on the operating model rather than the tooling — a Center of Excellence with no authority over the release gate is a reporting function with a better name.',
        items: [
          'Enterprise Quality Engineering Strategy',
          'QE Maturity Assessment',
          'Quality Operating Model Design',
          'Testing Center of Excellence Transformation',
          'Federated Versus Centralized QE Models',
          'Quality Governance & Decision Rights',
          'Automation Strategy & Investment Case',
          'Toolchain Rationalization',
          'Quality Metrics That Can Be Falsified',
          'Test Estate Cost Modeling',
          'Skills Assessment & Capability Building',
          'Engineering Process Optimization',
          'QE Transformation Roadmap',
          'Benefit Baselining Before Any Build',
        ],
      },
      {
        title: 'Continuous Testing & DevOps Quality Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Feedback while the change is still in an engineer’s head. The constraint is rarely coverage — it is suite runtime.',
        items: [
          'Shift-Left Test Integration',
          'Pre-Merge and Post-Merge Test Split',
          'Continuous Integration Test Orchestration',
          'Continuous Regression Engineering',
          'Automated Release Gate Design',
          'Change-Impact Test Selection',
          'Pipeline Runtime Budgeting',
          'Static Analysis & Code Quality Gates',
          'Build Health and Red-Build Response',
          'Deployment and Post-Release Verification',
          'Environment-Aware Test Routing',
          'Progressive Delivery Verification',
          'Shift-Right and Production Testing',
          'DORA Metric Instrumentation',
        ],
      },
      {
        title: 'Intelligent Test Automation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'AI where it lowers the cost of owning a test, not just writing one. Four hundred generated tests for a module that needed nine is maintenance, not coverage.',
        items: [
          'AI-Assisted Test Generation',
          'Specification-to-Test Derivation',
          'Risk-Based Test Selection',
          'Prioritization by Failure Probability',
          'Regression Suite Optimization',
          'Duplicate and Redundant Test Detection',
          'Automated Defect Triage & Clustering',
          'Failure Root-Cause Analysis',
          'Flaky Test Detection & Classification',
          'Self-Healing Locator Strategies',
          'Visual and Layout Validation',
          'Automation Maintenance Reduction',
          'Coverage Gap Inference',
          'Review Standards for Generated Tests',
        ],
      },
      {
        title: 'Functional & End-to-End Quality Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Proving the business process works, not that each component returned a 200 — and pushing the rest down a layer.',
        items: [
          'Functional Test Design',
          'Business Process Validation',
          'End-to-End Journey Automation',
          'System Integration Testing',
          'Critical Path Identification',
          'Rules Engine and Calculation Testing',
          'Workflow and State Machine Coverage',
          'User Acceptance Test Support',
          'Exploratory and Charter-Based Testing',
          'Regression Suite Architecture',
          'Cross-Application Scenario Testing',
          'Negative and Boundary Case Design',
          'Formal Test Design Techniques',
          'Suite Pruning and Layer Rebalancing',
        ],
      },
      {
        title: 'API, Microservices & Distributed Systems Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Contract testing is what lets two teams deploy independently without a shared suite neither of them owns.',
        items: [
          'REST and GraphQL API Testing',
          'Consumer-Driven Contract Testing',
          'OpenAPI and Schema Conformance',
          'Backward Compatibility Verification',
          'Microservice Integration Testing',
          'Event-Driven and Message Queue Testing',
          'Idempotency and Retry Behavior',
          'Distributed Tracing Inside Tests',
          'Service Virtualization for Dependencies',
          'Timeout, Circuit Breaker and Fallback Paths',
          'Payload and Serialization Validation',
          'API Versioning and Deprecation Checks',
          'Rate Limit and Throttling Behavior',
          'API Security Validation in the Pipeline',
        ],
      },
      {
        title: 'Cloud & Infrastructure Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Testing the configuration and deployment topology an application depends on, because the outage is at least as likely to come from a security group as from a null pointer. We validate infrastructure as part of the release evidence; building and running the platform itself is our DevOps and managed infrastructure work.',
        items: [
          'Infrastructure-as-Code Validation',
          'Terraform and Pulumi Plan Testing',
          'Kubernetes Manifest and Policy Testing',
          'Container Image Verification',
          'Configuration Drift Detection',
          'Multi-Cloud and Hybrid Assurance',
          'Serverless Function Testing',
          'Autoscaling Behavior Verification',
          'Network and Connectivity Validation',
          'Secrets and Configuration Handling',
          'Cost Guardrail Testing',
          'Deployment Topology Verification',
          'Blue-Green and Canary Infrastructure Checks',
          'Cloud Migration Assurance',
        ],
      },
      {
        title: 'Data Quality & Data Reliability Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'A silent data defect costs more than a crash, because nobody finds it for a quarter. Platform build sits with data engineering.',
        items: [
          'ETL and ELT Pipeline Testing',
          'Source-to-Target Reconciliation',
          'Schema Evolution and Data Contracts',
          'Referential Integrity Verification',
          'Row Count and Checksum Validation',
          'Data Freshness and Latency Checks',
          'Streaming and Event Data Validation',
          'Null, Duplicate and Outlier Detection',
          'Slowly Changing Dimension Testing',
          'Transformation Logic Verification',
          'BI and Report Output Validation',
          'Data Migration Reconciliation',
          'Data Quality Rule Engineering',
          'Pipeline Failure and Replay Testing',
        ],
      },
      {
        title: 'AI & Model Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'AI features break the assumption every test framework is built on: that one input gives one output. Assertions become thresholds, a pass becomes a distribution, and a regression is a shift you can only detect if you were already measuring — which is why the evaluation set built from your real traffic is the asset and the harness is a commodity. Pre-release evaluation is this service. Production drift monitoring belongs to our MLOps practice, and the fairness, explainability and regulatory file an assessor reads belongs to AI governance.',
        items: [
          'Evaluation Sets Built From Real Traffic',
          'Golden Dataset Curation & Versioning',
          'Threshold and Tolerance Design',
          'Retrieval Quality Evaluation for RAG',
          'Grounding and Citation Verification',
          'Hallucination and Fabrication Testing',
          'Prompt and Model Version Regression',
          'Calibrated LLM-as-Judge Harnesses',
          'AI Agent and Tool-Use Testing',
          'Adversarial and Prompt Injection Suites',
          'Model Accuracy and Performance Validation',
          'Latency and Token Cost Regression',
          'Human Review Sampling Design',
          'Evaluation Results as a Release Gate',
        ],
      },
      {
        title: 'Performance Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Performance is a design property, and a load test at the end of a program mostly tells you what you can no longer afford to change. The tool is the easy part — a test against a scaled-down environment with uniform synthetic traffic produces a number that is precise and wrong, so the work is the workload model, the data volume and the think time.',
        items: [
          'Performance Requirements & SLO Definition',
          'Workload Modeling From Real Traffic',
          'Load and Volume Testing',
          'Soak and Endurance Testing',
          'Spike and Burst Testing',
          'Stress and Breakpoint Analysis',
          'Scalability and Concurrency Modeling',
          'Latency Profiling and Percentile Analysis',
          'Bottleneck Isolation',
          'Database and Query Performance',
          'API Throughput Validation',
          'Front-End Performance and Core Web Vitals',
          'Capacity Planning Evidence',
          'Performance Regression Inside CI',
        ],
      },
      {
        title: 'Reliability & Resilience Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Not whether a dependency fails, but what your system does in the ninety seconds after it does.',
        items: [
          'Failure Mode and Effects Analysis',
          'Fault Injection Experiments',
          'Chaos Engineering Game Days',
          'Dependency Failure Simulation',
          'Graceful Degradation Verification',
          'Failover and Recovery Validation',
          'High Availability Testing',
          'Recovery Time and Recovery Point Verification',
          'Blast Radius Analysis',
          'Retry, Backoff and Idempotency Testing',
          'Data Consistency Under Partition',
          'Rollback and Roll-Forward Rehearsal',
          'SLO and Error Budget Validation',
          'Incident Response Rehearsal',
        ],
      },
      {
        title: 'Security Testing & Digital Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Fast, deterministic checks inside the build, gated on new findings rather than the backlog. Penetration testing is a separate service.',
        items: [
          'Static Application Security Testing',
          'Dynamic Application Security Testing',
          'Software Composition Analysis',
          'Container and Image Scanning',
          'Secrets Detection in Code and Config',
          'Infrastructure Security Policy Checks',
          'Authentication and Session Testing',
          'Authorization and Privilege Escalation Checks',
          'Input Validation and Injection Testing',
          'API Security Verification',
          'Security Regression Suites',
          'Privacy and Data Handling Validation',
          'Secure Configuration Baselines',
          'Vulnerability Triage and Gate Policy',
        ],
      },
      {
        title: 'UX, Accessibility & Experience Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Scanners find a minority of WCAG failures. The rest needs a keyboard, a screen reader and someone who knows.',
        items: [
          'WCAG 2.2 AA Conformance Testing',
          'Automated Accessibility Scanning in CI',
          'Manual Keyboard and Focus-Order Testing',
          'Screen Reader Testing on NVDA, JAWS and VoiceOver',
          'EN 301 549 and Section 508 Evidence',
          'Cognitive Load and Plain Language Review',
          'Accessibility Statement Substantiation',
          'Cross-Browser Compatibility Matrix',
          'Responsive and Viewport Coverage',
          'Visual and Layout Regression',
          'Core Web Vitals Lab and Field Validation',
          'Localization and Internationalization Testing',
          'Usability and Journey Validation',
          'Assistive Technology Regression Suites',
        ],
      },
      {
        title: 'Mobile, Omnichannel & Connected Product Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The device matrix is larger than any suite can cover, so coverage becomes a sampling decision. You cannot patch a shipped device weekly.',
        items: [
          'Native iOS and Android Automation',
          'Hybrid and Cross-Platform App Testing',
          'Real Device and Device Farm Execution',
          'Device and OS Coverage Strategy',
          'Network Condition and Offline Testing',
          'Battery, Memory and Resource Profiling',
          'App Store Release Verification',
          'Omnichannel Journey Continuity',
          'Wearable and Companion App Testing',
          'IoT Device and Telemetry Validation',
          'Firmware and Over-the-Air Update Testing',
          'Hardware-in-the-Loop Harnesses',
          'Edge and Intermittent Connectivity Behavior',
          'Backward Compatibility Across Shipped Versions',
        ],
      },
      {
        title: 'ERP & Enterprise Platform Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Testing systems you did not write, cannot change, and do not control the release calendar for. A vendor upgrade lands whether or not your regression pack is ready, which is why the investment that pays is a business-process pack that survives the upgrade rather than scripts pinned to a screen layout somebody in Walldorf is about to move.',
        items: [
          'SAP S/4HANA Business Process Automation',
          'Oracle Cloud and E-Business Suite Regression',
          'Salesforce Release and Sandbox Testing',
          'Microsoft Dynamics 365 Validation',
          'ServiceNow Release Verification',
          'Vendor Upgrade Impact Assessment',
          'Cross-Module Process Testing',
          'Configuration and Customization Validation',
          'Role, Permission and Segregation-of-Duties Testing',
          'Interface and Middleware Regression',
          'Master Data Validation',
          'Localization and Statutory Variant Testing',
          'ERP Migration and Cutover Assurance',
          'Packaged Application Test Data Handling',
        ],
      },
      {
        title: 'Test Data Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'You cannot copy production, and synthetic data only holds the cases somebody thought of. You need both, plus the refresh nobody budgets for.',
        items: [
          'Synthetic Test Data Generation',
          'Production Data Masking & Anonymization',
          'Referentially Intact Subsetting',
          'Edge-Case and Boundary Data Design',
          'Data Refresh and Reset Automation',
          'Self-Service Test Data Provisioning',
          'PII Discovery and Classification',
          'Reversibility and Re-Identification Review',
          'Regulatory Controls on Test Data',
          'Dataset Versioning and Snapshotting',
          'High-Volume Data Generation for Load',
          'Cross-System Data Consistency',
          'Test Data Ownership and Lifecycle',
          'Data Handling Evidence for Audit',
        ],
      },
      {
        title: 'Test Environment Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Testing does not scale when environments are shared, manually provisioned and booked a fortnight in advance. The hours engineers spend waiting for a slot rarely appear in any quality budget and are frequently larger than the entire tooling spend — which is why ephemeral environments and virtualized dependencies are a quality investment rather than a platform luxury.',
        items: [
          'Ephemeral Environment Provisioning',
          'Environment-as-Code Definitions',
          'Containerized Dependencies for Tests',
          'Service Virtualization and Stubbing',
          'Third-Party Sandbox Management',
          'Environment Parity and Drift Detection',
          'Configuration Management Across Environments',
          'Environment Health Monitoring',
          'Booking, Scheduling and Contention Removal',
          'Environment Reset and Teardown Automation',
          'Dependency Availability Mapping',
          'Cost Attribution for Test Environments',
          'On-Demand Preview Environments',
          'Environment Readiness Gates',
        ],
      },
      {
        title: 'Quality Observability & Release Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Bringing engineering, test and production signals into one view, so the question changes from did the tests pass to can we confidently release. A dashboard nobody acts on is reporting — the measure of this work is whether a release decision has ever actually changed because of it.',
        items: [
          'Quality Signal Aggregation',
          'Release Readiness Scoring',
          'Release Risk Modeling',
          'Defect Analytics and Pattern Detection',
          'Escaped Defect Analysis',
          'Test Effectiveness Measurement',
          'Flake and Suite Health Telemetry',
          'Production Quality Monitoring',
          'Change Failure Rate Tracking',
          'Quality Trend Analysis',
          'Executive Quality Reporting',
          'Engineering KPI Instrumentation',
          'Release Evidence Pack Generation',
          'Post-Incident Test Gap Attribution',
        ],
      },
      {
        title: 'Business & Regulatory Assurance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'In a regulated group the evidence is the deliverable. A by-product of running, not a scramble before an audit.',
        items: [
          'Business Process Assurance',
          'Regulatory Control Validation',
          'Compliance Test Design',
          'Audit Evidence Generation',
          'Financial Calculation and Reporting Verification',
          'Segregation-of-Duties Verification',
          'Traceability From Requirement to Test',
          'Validation Documentation for Regulated Systems',
          'User Acceptance Test Governance',
          'Operational Risk Scenario Testing',
          'Customer Outcome Verification',
          'Records Retention and Integrity Checks',
          'Change Control Evidence',
          'Business Continuity Scenario Validation',
        ],
      },
      {
        title: 'Quality Engineering for Modernization & Migration',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Everything moves at once, so there is no stable reference. The answer is parity: run both and compare the outputs.',
        items: [
          'Legacy Application Assessment',
          'Existing Test Asset Discovery',
          'Functional Parity Test Design',
          'Parallel Run and Output Comparison',
          'Data Migration Reconciliation',
          'Monolith-to-Microservices Validation',
          'API Modernization Contract Testing',
          'Performance Benchmarking Against Legacy',
          'Cutover Rehearsal and Dry Runs',
          'Rollback and Contingency Testing',
          'Phased Migration Wave Validation',
          'Post-Migration Stabilization',
          'Decommissioning Evidence',
          'Knowledge Capture From Legacy Behavior',
        ],
      },
      {
        title: 'Managed Quality Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Running the suite, the environments and the release evidence under a service level, for teams who want the assurance without carrying a permanent specialist function. The line we hold is that everything stays operable by your own people — an estate only we can run is a commercial arrangement, not an engineering outcome.',
        items: [
          'Managed QE Service Delivery',
          'Testing-as-a-Service Models',
          'Managed Automation Operations',
          'Managed Regression Cycles',
          'Release Certification Service',
          'Dedicated and Blended QE Pods',
          'Test Environment Management',
          'Test Data Operations',
          'Round-the-Clock Suite and Pipeline Monitoring',
          'Break-Fix Within Agreed Response Times',
          'Quality Governance and Reporting',
          'SLA Definition and Measurement',
          'Continuous Suite Rationalization',
          'Transition and Exit Planning',
        ],
      },
    ],

    // ── Enterprise assurance architecture ──────────────────────────
    // Rendered from this data as stacked bands rather than as an SVG, so every
    // node name is real selectable text the crawler receives and a screen
    // reader announces in order — and so it reflows on a phone instead of
    // becoming a horizontal scroll. Read downward as a decomposition: the
    // outcome at the top is supported by the layer beneath it, all the way to
    // the systems a release can actually break.
    enterpriseArchitecture: {
      eyebrow: 'THE ENTERPRISE ASSURANCE ARCHITECTURE',
      title: 'Quality is not a stage.',
      titleHighlight: 'It is a layered system.',
      lede: 'Testing activities produce signals. Signals only become useful once something turns them into a release decision, and a decision only matters if it is attached to an outcome somebody is accountable for. Six layers, each one supported by the layer beneath it.',
      layers: [
        {
          label: 'Enterprise Outcome',
          role: 'What the business is actually protecting',
          nodes: ['Change Failure Rate', 'Time to Market', 'Customer Impact', 'Regulatory Exposure', 'Cost of Quality', 'Revenue-Affecting Incidents'],
        },
        {
          label: 'Release Decision Intelligence',
          role: 'The decision the entire system exists to support',
          nodes: ['Release Risk', 'Readiness Scoring', 'Blocking Criteria', 'Named Approver', 'Override Record', 'Business Risk Assessment'],
        },
        {
          label: 'Quality Intelligence',
          role: 'Signals turned into something a person can act on',
          nodes: ['Test Intelligence', 'Suite Health & Flake Rate', 'Coverage by Risk', 'Defect Analytics', 'Escaped Defect Attribution', 'Production Signals'],
        },
        {
          label: 'Continuous Assurance',
          role: 'Five assurance domains running against every change',
          nodes: ['Application & Integration', 'Data & AI', 'Experience & Accessibility', 'Performance & Resilience', 'Security & Compliance'],
        },
        {
          label: 'Engineering & Automation',
          role: 'The machinery that produces the evidence',
          nodes: ['CI/CD Pipelines', 'Test Automation', 'Test Data', 'Environments & Virtualization', 'Security Scanning', 'Evaluation Harnesses'],
        },
        {
          label: 'Systems Under Test',
          role: 'Everything a release is capable of breaking',
          nodes: ['Applications', 'APIs & Services', 'Data Pipelines', 'AI Models', 'Cloud Infrastructure', 'Packaged Platforms', 'Connected Devices'],
        },
      ],
      principle: 'Quality is engineered at the source, validated continuously across the lifecycle, observed in production, and converted into a release decision somebody is willing to put their name against.',
    },

    // ── Delivery methodology ───────────────────────────────────────
    // Renders in the journey section, which draws a numbered spine and is
    // length-agnostic, and feeds the HowTo node in seo/serviceSchema.js — the
    // shape an answer engine quotes when asked how an engagement runs. Eight
    // phases, ending on Optimize rather than on Assure: a quality system that
    // does not get cheaper to run every quarter is being maintained, not
    // improved.
    //
    // The journey band is suppressed by default on any service that defines
    // servicePackages, because the generic four-phase default duplicated them.
    // This one does not: the methodology is how delivery runs, the packages
    // are how it is bought.
    showJourney: true,
    journeyEyebrow: 'THE DELIVERY METHODOLOGY',
    journeyHeading: 'Eight phases,',
    journeyHeadingHighlight: 'and the last one is the point.',
    journeyLede: 'Assessment through continuous optimization. Programs are routinely funded to Assure and then stop, which is why the same class of defect keeps reaching customers — Observe and Optimize are the two phases that compound, and the two that get cut when a date moves.',
    journeyStats: [['Phases', '08'], ['Typical', '6\u201316 wks'], ['Exit', 'Your team runs it']],
    customJourney: [
      { phase: 'ASSESS',     color: '#94A3B8', icon: 'Search',      title: 'Understand the Current Estate',     desc: 'Applications, architecture, existing suites, automation, pipelines, data, environments and the organization around them. The output most clients have never had: what the test estate costs and what share of its red is real.' },
      { phase: 'ARCHITECT',  color: '#7B94D8', icon: 'Layers',      title: 'Design the Target Quality Model',   desc: 'Test architecture, automation architecture, pipeline integration, data and environment strategy, AI evaluation approach and the governance that decides who can override a gate.', kangqore: true },
      { phase: 'PRIORITIZE', color: '#60A5FA', icon: 'Target',      title: 'Spend the Budget Where Risk Is',    desc: 'Not every system deserves the same assurance. Systems are classified on business criticality, change frequency, technical complexity, customer impact and regulatory exposure, and each gets a proportionate strategy rather than one standard applied everywhere.', kangqore: true },
      { phase: 'ENGINEER',   color: '#3B82F6', icon: 'Cpu',         title: 'Build Quality Into Delivery',       desc: 'Frameworks, pipeline gates, API and contract validation, data validation, performance harnesses, security scanning, environments, evaluation sets and observability — built into engineering rather than bolted onto the end of it.', kangqore: true },
      { phase: 'AUTOMATE',   color: '#2564EA', icon: 'Zap',         title: 'Replace Repetition With Leverage',  desc: 'Progressively across unit, API, contract, integration, UI, end-to-end, performance, security and AI evaluation. The objective is never maximum automation — it is maximum engineering leverage per hour of maintenance.', kangqore: true },
      { phase: 'ASSURE',     color: '#2AA8D8', icon: 'ShieldCheck', title: 'Run Continuous Assurance',          desc: 'Validation runs across development, integration, pre-production, deployment and production, and the release decision is supported by evidence rather than by intuition and a green check mark.', kangqore: true },
      { phase: 'OBSERVE',    color: '#22B8B0', icon: 'Eye',         title: 'Compare Against Production',        desc: 'What escaped, why it escaped, which systems are most exposed, which tests should have caught it and where automation should expand next. Almost no program funds this stage, which is why the same class of defect keeps reaching customers.', kangqore: true },
      { phase: 'OPTIMIZE',   color: '#10B981', icon: 'TrendingUp',  title: 'Improve the System Itself',         desc: 'Suites, environments, gates, metrics and evaluation sets tuned with real telemetry. A quality system that is not getting cheaper to run each quarter is being maintained rather than improved.', kangqore: true },
    ],

    // ── Accelerators ───────────────────────────────────────────────
    // Deliberately named as methods and reusable assets rather than as
    // products, and with no trademark symbols: Kangqore licenses no software,
    // and eight registered marks on one page would be a representation to a
    // buyer that the page cannot support. The footnote says so plainly, because
    // a prospect who discovers the gap themselves discounts everything else on
    // the page along with it.
    accelerators: {
      eyebrow: 'HOW WE ARRIVE FASTER',
      title: 'Eight things we bring',
      titleHighlight: 'on day one.',
      lede: 'Methods, reference implementations and reusable assets carried from one engagement to the next — so the first sprint starts from a position rather than from a blank repository.',
      items: [
        {
          name: 'Quality Intelligence Fabric',
          desc: 'The aggregation layer that pulls build, test, defect, environment, security and production signals into one model, so release risk is computed rather than argued.',
          functions: ['Signal aggregation across tools', 'Release risk analysis', 'Defect and failure clustering', 'Executive quality reporting'],
        },
        {
          name: 'Test Intelligence Engine',
          desc: 'Decides what to run on this change rather than running everything on every change. The difference between a suite used before merge and a suite read the next morning.',
          functions: ['Change-impact test selection', 'Prioritization by failure probability', 'Regression suite optimization', 'Redundant test detection'],
        },
        {
          name: 'Autonomous Assurance Framework',
          desc: 'Our reference automation architecture — fixtures, data builders, page objects, retry semantics and reporting — so the fifth test is faster to write than the first and the fiftieth is still maintainable.',
          functions: ['Framework and fixture reference build', 'Resilient locator patterns', 'Deterministic setup and teardown', 'Environment-aware execution'],
        },
        {
          name: 'AI Assurance Framework',
          desc: 'The evaluation scaffolding for features whose output changes between runs: how the set is built, how thresholds are set, and how a scored regression becomes a gate.',
          functions: ['Evaluation set construction', 'Retrieval and grounding scoring', 'Calibrated judge harnesses', 'Adversarial and injection suites'],
        },
        {
          name: 'Release Confidence Index',
          desc: 'A composite of code risk, coverage by risk, open defects, security findings, performance, reliability and business criticality — weighted against your baseline, not a published benchmark.',
          functions: ['Weighted composite scoring', 'Per-domain readiness breakdown', 'Blocking criteria mapping', 'Trend against your own baseline'],
        },
        {
          name: 'Quality Graph',
          desc: 'A relationship model linking applications, services, APIs, data, infrastructure, tests, defects, releases, incidents and business processes — so the blast radius of a change is a query rather than a meeting.',
          functions: ['Change impact traversal', 'Test-to-business-process traceability', 'Incident to missing-test attribution', 'Coverage gap discovery'],
        },
        {
          name: 'Test Environment Fabric',
          desc: 'Environment definitions, virtualized dependencies and reset automation, aimed squarely at the hours engineers currently spend waiting for a slot somebody else booked.',
          functions: ['On-demand ephemeral environments', 'Dependency virtualization catalog', 'Parity and drift checks', 'Reset, reseed and teardown'],
        },
        {
          name: 'Quality Migration Accelerator',
          desc: 'For modernization programs, where the reference system is moving at the same time as the code. Discovery of what the legacy actually does, then parity proved by running both.',
          functions: ['Legacy behavior discovery', 'Business process mapping', 'Parallel run and output comparison', 'Cutover and rollback rehearsal'],
        },
      ],
      footnote: 'These are Kangqore methods and reusable engineering assets, not licensed products. Nothing here requires you to buy software from us, and everything built on top of them stays in your repositories, operable by your own engineers.',
    },

    // ── Command center ─────────────────────────────────────────────
    // Every figure is a worked example, and the component carries the
    // disclaimer itself rather than trusting a caption to survive a future
    // edit. A dashboard is the most quotable object on a page and the easiest
    // to mistake for measurement, so the numbers are shaped to be plausible and
    // labeled to be unmistakable.
    commandCenter: {
      eyebrow: 'WHAT THE REPORTING LOOKS LIKE',
      title: 'One console.',
      titleHighlight: 'One question it answers.',
      lede: 'Not a wall of test results. A single view built to answer whether this release should go tonight — with the domains that make up the answer, the signals moving underneath it, and the risks somebody has to accept by name if it ships anyway.',
      headline: {
        label: 'Release Confidence',
        value: '92',
        outOf: '100',
        note: 'Composite of code risk, coverage by risk, open defects, security findings, performance, reliability and business criticality — weighted against your baseline.',
      },
      domains: [
        { label: 'Application & Integration', value: 95 },
        { label: 'Data & AI', value: 97 },
        { label: 'Security & Compliance', value: 91 },
        { label: 'Performance & Reliability', value: 94 },
      ],
      signals: [
        { illustrative: true, label: 'Critical defects open', value: '2', good: false },
        { illustrative: true, label: 'Failures that were real', value: '96.9%' },
        { illustrative: true, label: 'Commit to verdict', value: '13 min' },
        { illustrative: true, label: 'Defect escape rate', value: 'down 34%' },
        { illustrative: true, label: 'Regression wall-clock', value: 'down 61%' },
        { illustrative: true, label: 'Suite maintenance load', value: 'down 48%' },
        { illustrative: true, label: 'Coverage on critical paths', value: 'up 47%' },
        { illustrative: true, label: 'Release frequency', value: 'up 28%' },
        { illustrative: true, label: 'Quarantined tests past expiry', value: '4', good: false },
      ],
      risksLabel: 'Accepted if this release ships tonight',
      risks: [
        { item: 'Payment provider sandbox unavailable since 14:20 — integration path unverified', level: 'HIGH' },
        { item: 'Mobile authentication journey covered on iOS only; Android device farm queue exceeded window', level: 'MEDIUM' },
        { item: 'Reconciliation pipeline latency 2.4x baseline under peak workload model', level: 'MEDIUM' },
        { item: 'Two accessibility findings on the account settings flow, neither on a statutory path', level: 'LOW' },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────
    // Five nodes, because the template lays architectureNodes out four to a row
    // otherwise and five each get their own column. A loop rather than a
    // waterfall, and it deliberately ends on Learn: closing the gap between
    // what escaped and which test should have caught it is the stage every
    // program funds last and the only one that compounds.
    architectureEyebrow: 'THE QUALITY LOOP',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Scope to Learn.',
    architectureLede: 'Five stages, and the one that decides the outcome is the last. Most programs are resourced through Run and never close the loop between what reached production and which test should have caught it.',
    architectureNodes: [
      {
        title: 'Scope',
        icon: 'Search',
        description: 'Establish what a failure would actually cost, path by path, and set the testing budget against that rather than against a coverage target. The output includes what will deliberately not be covered, written down where a reviewer can see it.',
        features: [
          'Critical path and blast-radius mapping',
          'Failure cost weighted by business impact',
          'Test layer chosen per risk, not per habit',
          'Runtime and maintenance budget agreed',
          'Deliberate non-coverage recorded',
        ],
      },
      {
        title: 'Engineer',
        icon: 'Layers',
        description: 'Build the suite the way you would build a product: an owner, standards, code review, and assertions written against contracts rather than against whatever the implementation happened to do that week.',
        features: [
          'Framework and fixture architecture',
          'Assertions on contracts, not internals',
          'Deterministic setup and teardown',
          'Test data and environment dependencies designed in',
          'Test code reviewed like production code',
        ],
      },
      {
        title: 'Run',
        icon: 'Zap',
        description: 'Execute at a speed the pipeline can absorb. A suite an engineer will not wait for is a suite that stops being run before merge, which turns every safety property it had into a nightly report nobody opens.',
        features: [
          'Parallelization and sharding',
          'Change-impact selection per commit',
          'Flake detected and classified in the run',
          'Full suite scheduled, fast suite on every push',
          'Runtime tracked as a budget with a ceiling',
        ],
      },
      {
        title: 'Decide',
        icon: 'ShieldCheck',
        description: 'The gate. A short, agreed list of failures worth stopping a release for, a named approver for the exceptions, and a record of every override — because an override nobody counts becomes the process within two quarters.',
        features: [
          'Blocking criteria agreed in advance',
          'Named approver and logged overrides',
          'Evidence pack a release manager can read',
          'Risk accepted explicitly, not by silence',
          'Progressive rollout where the gate cannot be certain',
        ],
      },
      {
        title: 'Learn',
        icon: 'Activity',
        description: 'What escaped, why it escaped, and which test should have caught it. This is the stage that compounds, and the stage that is cut first when a date moves.',
        features: [
          'Escaped defect analysis by root cause',
          'Missing-test gaps fed back into scope',
          'Flake rate and time-to-verdict trended',
          'Tests that never fail reviewed for deletion',
          'Change failure rate reported to delivery',
        ],
      },
    ],

    // ── The argument ──────────────────────────────────────────────
    // Both columns describe teams that test, and both suites are green on the
    // day you look. The difference is entirely in whether anybody changes their
    // behavior when one of them turns red.
    comparisonTable: {
      eyebrow: 'WHERE TEST SUITES QUIETLY STOP WORKING',
      heading: 'Both suites are green.',
      lede: 'Neither column describes a team that does not test. They differ in whether anybody still changes their behavior when the build turns red.',
      beforeLabel: 'TESTS AS A DELIVERABLE',
      afterLabel: 'THE SUITE AS A PRODUCT',
      afterBadge: 'KANGQORE',
      beforeShort: 'DELIVERED',
      afterShort: 'OWNED',
      rows: [
        {
          dimension: 'When the build goes red',
          before: 'Someone presses retry. It passes second time, the change merges, and nothing anywhere records that it happened.',
          after: 'Every failure is classified as real or flaky inside the run. Flake rate is a tracked number with an owner and a target, so a retry becomes data rather than a reflex.',
        },
        {
          dimension: 'What the coverage number measures',
          before: 'A line-coverage percentage on a dashboard, reached by tests that execute the code without asserting anything meaningful about it.',
          after: 'Coverage argued path by path against risk, with mutation testing used to check whether the tests would notice a defect at all. What is left uncovered is written down.',
        },
        {
          dimension: 'How long from commit to a verdict',
          before: 'A suite that grew to forty minutes one test at a time, so engineers batch their changes and stop running it before merging.',
          after: 'Runtime treated as a delivery constraint with a ceiling: parallelized, sharded, change-selected, and pruned of tests that were never load-bearing.',
        },
        {
          dimension: 'Who owns the test code',
          before: 'A separate team, or nobody. It is outside code review, it has no standards, and it is the first thing dropped when a date moves.',
          after: 'Owned by the team that owns the service, reviewed like production code, with a maintenance budget defended in planning rather than borrowed from it.',
        },
        {
          dimension: 'What the release gate blocks on',
          before: 'Everything, so it gets overridden most weeks, and within two quarters the override is the process.',
          after: 'A short list of failures worth stopping a release for, agreed in advance, with a named approver for exceptions and every override recorded.',
          link: { href: '/services/devops-as-a-service', label: 'Pipeline engineering' },
        },
        {
          dimension: 'A test that has been failing for three weeks',
          before: 'Muted, with a ticket nobody will pick up. The coverage number does not move, so nothing signals what was lost.',
          after: 'Quarantined with an expiry date. Fixed, rewritten or deleted before that date, and the gap it leaves stays visible on the risk register until then.',
        },
        {
          dimension: 'A feature whose output changes every run',
          before: 'Checked by hand before release, then not at all, because no equality assertion could be written for it.',
          after: 'An evaluation set built from real traffic, thresholds in place of equality, and a scored regression run on every prompt, model or retrieval change.',
          link: { href: '/services/mlops', label: 'Model operations' },
        },
      ],
    },

    // ── Toolchain ─────────────────────────────────────────────────
    // Framed by what each tool is genuinely better at, including two rows a
    // testing vendor has no incentive to write: what automated accessibility
    // scanning cannot see, and the classes of defect that are cheaper to make
    // impossible than to test for. We hold no reseller margin on any of these.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'The testing tools,',
      titleHighlight: 'and the tests not worth writing.',
      subtitle: 'Tool choice is mostly settled by the language your team already writes and by what your pipeline can finish in the time it has. These are the defaults, what overrides them, and where a test is the wrong control entirely.',
      items: [
        {
          icon: 'Globe',
          title: 'Browser and end-to-end',
          managed: 'Playwright, Cypress',
          selfHosted: 'Selenium where the grid and the page objects already exist',
          desc: 'Playwright is the current default: faster, less flaky by construction, and one API across browsers. Selenium stays where an established grid and a decade of page objects make replacement more expensive than maintenance. Neither choice fixes an inverted pyramid.',
        },
        {
          icon: 'Network',
          title: 'API and contract',
          managed: 'REST Assured, Postman and Newman, Schemathesis',
          selfHosted: 'Pact for consumer-driven contracts',
          desc: 'The layer most estates under-invest in and the cheapest place to catch an integration break. Contract tests are what let two teams deploy independently without a shared end-to-end suite that neither of them owns.',
          link: { href: '/services/api-microservices-engineering', label: 'API and microservices engineering' },
        },
        {
          icon: 'Cpu',
          title: 'Unit and property-based',
          managed: 'JUnit, pytest, Jest, Vitest, xUnit',
          selfHosted: 'Hypothesis, fast-check, jqwik',
          desc: 'Property-based testing earns its place where the input space is larger than anyone can enumerate — parsers, pricing rules, date arithmetic, currency rounding. It finds the case nobody thought to write, which is generally the case that reaches production.',
        },
        {
          icon: 'Activity',
          title: 'Performance and load',
          managed: 'k6, Gatling, JMeter, Locust',
          selfHosted: 'An environment shaped like production, or do not run it',
          desc: 'The tool is the easy part. A load test against a scaled-down environment with uniform synthetic traffic produces a number that is precise and wrong. The work is the workload model, the data volume and the think time.',
        },
        {
          icon: 'Database',
          title: 'Test data',
          managed: 'Delphix, Tonic, Gretel, platform-native masking',
          selfHosted: 'Domain-specific generators you own',
          desc: 'Masked production data is realistic and brings a legal argument with it. Synthetic data brings none, but has to be engineered to reproduce the shapes that break things: the null, the duplicate, the emoji in a name field, the record created in 1997.',
        },
        {
          icon: 'Layers',
          title: 'Environments and virtualization',
          managed: 'Testcontainers, WireMock, Mountebank, ephemeral preview environments',
          selfHosted: 'Whatever your platform team already runs',
          desc: 'Service virtualization is how you test against the payment provider that charges per call and the partner system available two mornings a week. The alternative is a suite whose green depends on somebody else’s uptime.',
          link: { href: '/services/devops-as-a-service', label: 'Pipeline and environment engineering' },
        },
        {
          icon: 'Eye',
          title: 'Accessibility',
          managed: 'axe-core, Pa11y, Lighthouse CI',
          selfHosted: 'NVDA, JAWS, VoiceOver and a keyboard',
          desc: 'Automated scanning reliably catches a minority of WCAG failures and cannot judge whether a label is meaningful or a focus order makes sense. Anyone selling full conformance from a scanner is selling the report rather than the conformance.',
        },
        {
          icon: 'BrainCircuit',
          title: 'Evaluation for AI features',
          managed: 'Ragas, DeepEval, Promptfoo, Braintrust, LangSmith',
          selfHosted: 'Your own evaluation set, which is the part that matters',
          desc: 'The harness is a commodity. The evaluation set built from your real traffic is not, and it is the only thing that makes a model regression visible before a customer finds it. Production monitoring and model governance are separate services.',
          link: { href: '/services/mlops', label: 'MLOps and model monitoring' },
        },
        {
          icon: 'Shield',
          title: 'Security checks inside the build',
          managed: 'Semgrep, Snyk, Trivy, OWASP ZAP, Dependency-Track',
          selfHosted: 'Gate on new findings, never on the backlog',
          desc: 'These belong in the pipeline because they are fast and deterministic, and gating on the existing backlog rather than on newly introduced findings is how teams learn to skip the stage. Penetration testing and the security program are a different discipline.',
          link: { href: '/services/it-security-services', label: 'Security testing and assurance' },
        },
        {
          icon: 'Zap',
          title: 'The tests not worth writing',
          managed: 'Type systems, schema validation, feature flags, canary releases',
          selfHosted: 'A change you can undo in ninety seconds',
          desc: 'Some defects are cheaper to make impossible than to test for, and some are cheaper to detect in production and roll back. A test is one control among several. Treating it as the only one is how a suite reaches forty minutes and stops being run.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve questions about testing,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ──────────────────────────────────────────────────────
    // The parity default ran six promotional answers under fifty words each,
    // and the competitor set runs the same seven questions everywhere: what
    // makes you different, do you support legacy, do you use AI, can you reduce
    // cost. None of them is a question a head of engineering opens with.
    //
    // These are. Six of them are questions a testing vendor would rather not be
    // asked: what to cut from a suite, whether coverage targets are worth
    // having, whether QA teams should exist, what the gate should block on,
    // what the work costs to run rather than to build, and who owns the tests
    // afterwards. Sources are attached where a claim would otherwise rest on
    // our own assertion.
    customFAQs: [
      {
        q: 'Our regression takes fourteen hours. What do we cut?',
        sources: [
          { label: 'The Practical Test Pyramid (Ham Vocke, martinfowler.com)', url: 'https://martinfowler.com/articles/practical-test-pyramid.html' },
        ],
        a: 'Start by finding out what it is actually testing, because in most fourteen-hour suites the answer is the same six things over and over at the most expensive layer available.\n\nThe first pass is mechanical and usually recovers more than half the wall-clock: run in parallel, shard across machines, and stop rebuilding the world between tests. None of that removes a single assertion, so nobody has to argue about risk to get it.\n\nThe second pass is the real work. Most long suites are inverted — hundreds of browser tests standing in for checks that belong at API or unit level, each one paying the cost of a browser to verify a calculation. Pushing those down keeps the assertion and drops the cost by an order of magnitude. A browser test should exist for a journey that genuinely needs a browser, and there are fewer of those than any suite suggests.\n\nThe third pass is deletion, and it needs a decision-maker in the room. Tests that have never failed in two years, tests asserting on things that were never contracts, tests duplicating a case already covered three layers down. We propose the list, you approve it, and what stays uncovered goes on the record rather than disappearing quietly.',
      },
      {
        q: 'What do we actually do about flaky tests?',
        sources: [
          { label: 'Flaky Tests at Google and How We Mitigate Them (Google Testing Blog)', url: 'https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html' },
          { label: 'An Empirical Analysis of Flaky Tests (Luo et al., FSE 2014)', url: 'https://mir.cs.illinois.edu/marinov/publications/LuoETAL14FlakyTestsAnalysis.pdf' },
        ],
        a: 'Measure the rate first, because the argument about what to do is unwinnable while nobody knows the number.\n\nFlake is not one problem, it is four with different fixes. Shared state, where one test leaves behind a row or a cache entry the next one trips over. Timing, where the test waits a fixed number of milliseconds for something that usually takes less. Order dependence, where the suite only passes in the sequence it happened to run in last time. And genuine concurrency, where the code under test really does have a race and the test is right to be unhappy. That last category is the reason blanket auto-retry is dangerous: it hides real defects inside noise the team has been trained to ignore.\n\nSo: classify every failure in the run, not afterwards. Quarantine the worst offenders so they stop poisoning the signal — but with an expiry date attached, because a quarantine folder without expiry dates is just deletion with extra steps. Fix by class rather than one test at a time, since the same shared-state bug is usually behind thirty of them.\n\nThe target that matters is not zero. It is a rate low enough that a red build changes what somebody does next.',
      },
      {
        q: 'Should we be chasing eighty per cent code coverage?',
        sources: [
          { label: 'Code Coverage Best Practices (Google Testing Blog)', url: 'https://testing.googleblog.com/2020/08/code-coverage-best-practices.html' },
        ],
        a: 'As a diagnostic, coverage is useful. As a target, it reliably produces tests that execute code without checking anything about it, and we would rather tell you that before you set it.\n\nCoverage measures which lines ran while the tests ran. It cannot tell you whether anything was asserted, whether the assertion was meaningful, or whether the untested twenty per cent happens to be your payment path. A codebase at eighty per cent with no assertions in the critical path is in worse shape than one at fifty per cent that covers the paths a failure would actually hurt.\n\nWhat we use instead: coverage read as a map rather than a score, so a low-coverage area triggers a conversation about risk rather than an instruction to write tests. Mutation testing on the parts that matter, which deliberately introduces defects and reports whether any test noticed — the only automated measure that grades the assertions rather than the execution. And an explicit, written record of what is deliberately not covered.\n\nWhere a coverage floor is a regulatory or contractual requirement, we will help you meet it and be honest that meeting it is a compliance activity rather than a quality one.',
      },
      {
        q: 'Is AI going to write our tests now?',
        a: 'It writes some of them well, and it makes the underlying problem worse if the suite has no owner.\n\nWhere it genuinely helps: generating the boring half of a test once a human has decided what the case should be, filling out boundary and edge cases around a specification, converting a manual script into an automated one, suggesting selectors, and explaining why an unfamiliar test is failing. That is real time saved, and we use it.\n\nWhere it does not help: deciding what is worth testing. A model will happily produce four hundred plausible tests for a module that needed nine, and every one of them is now something your team has to maintain, run and eventually debug at two in the morning. Generated tests also tend to assert on current behavior rather than on intended behavior, which quietly converts a defect into a specification the next person is afraid to change.\n\nThe honest framing is that AI reduces the cost of writing a test, and the cost of writing was never the constraint. The constraint is the cost of owning it. A tool that lowers the first while ignoring the second gets a team to an unmaintainable suite faster than they could have managed by hand.',
      },
      {
        q: 'How do you test a feature whose output is different every time?',
        sources: [
          { label: 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., arXiv)', url: 'https://arxiv.org/abs/2306.05685' },
          { label: 'Holistic Evaluation of Language Models (Liang et al., arXiv)', url: 'https://arxiv.org/abs/2211.09110' },
        ],
        a: 'By giving up on equality and moving to distributions, which is a bigger change to how a team works than it first sounds.\n\nThe unit of work is an evaluation set: a few hundred real inputs taken from your own traffic, each with an agreed judgment of what a good response looks like. Built from real traffic, not invented examples — invented examples test the cases you already thought of, which are the cases that already work. Then you score against it: is the answer grounded in the retrieved source, does it contain the facts it should, does it avoid the ones it must not, is it in the right format, did it cost and take what it should.\n\nA release gate on that is a threshold and a delta, not a pass. Scores move between runs even with no change, so what you actually gate on is a drop beyond normal variance on a set held stable across versions.\n\nA model can be used as a judge, and it is often the only affordable option at volume, but it has known biases — toward longer answers, toward its own style — so it needs calibrating against human judgments on a sample rather than trusting outright. Model monitoring in production and the governance record an assessor reads are separate services; this is the pre-release evidence.',
      },
      {
        q: 'Our QA team is being disbanded and the developers are taking over testing. Is that right?',
        a: 'Half right, and the half that is usually wrong is the half that costs the most.\n\nMoving test ownership to the teams that own the services is correct. Tests written by the people who wrote the code are faster to write, faster to fix, and get maintained because their authors feel the pain when they break. A separate team writing tests against somebody else’s code produces a suite nobody trusts and everybody works around.\n\nWhat gets lost is the part that was never about writing tests. Somebody has to hold the risk picture across teams, own the test data and environment estate, run performance and accessibility work that no single squad has the depth or the cadence for, and be the person who says the release should not go tonight. Dissolve the function without rehousing those, and the symptoms show up about six months later as a rising escape rate that nobody can attribute.\n\nSo: distribute the test writing, keep a small central capability for the estate, the specialist disciplines and the release decision. Where a group has already dissolved the function, that is often what the first engagement quietly rebuilds.',
      },
      {
        q: 'What should the release gate actually block on?',
        sources: [
          { label: 'DORA — DevOps Research and Assessment metrics', url: 'https://dora.dev/guides/dora-metrics-four-keys/' },
        ],
        a: 'Less than you think, and it should be written down before the first argument rather than during it.\n\nA gate that blocks on everything gets overridden weekly, and once overriding is routine the gate has stopped functioning while still costing everyone time. The list worth stopping a release for is short: a failure on a critical business path, a new high-severity security finding introduced by this change, a performance regression past an agreed threshold, an accessibility regression on a legally required flow, and a failed data migration check. Everything else is reported, not blocking.\n\nThree things make it hold. Agreement in advance, when nobody is under pressure. A named person who can approve an exception, so overriding is a decision with an owner rather than a shrug. And a count of overrides reviewed monthly — a gate overridden four times in a month is telling you something about itself, not about the teams.\n\nWhat the gate should never block on is a flaky test, which is why the flake work comes before the gate work. Gating on a signal the team already distrusts teaches them to route around it.',
      },
      {
        q: 'We are not allowed to use production data. How do we test anything realistic?',
        sources: [
          { label: 'GDPR Article 5 — principles relating to processing of personal data', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679#d1e1807-1-1' },
        ],
        a: 'Two routes, and most estates need both because they fail in different places.\n\nMasking takes a production copy and replaces the identifying fields while preserving structure, distribution and referential integrity across systems. It gives you real shapes — the account with nine hundred transactions, the name with an apostrophe in it, the address that breaks the form. It requires the masking to be genuine rather than cosmetic, because a reversible transformation is still personal data in the eyes of a regulator, and it requires the copy itself to be governed.\n\nSynthetic generation builds records that never described a person. It carries no privacy exposure and can be committed to a repository, but it only contains the cases somebody designed into it — which means it tests what you expected and rarely what you did not.\n\nThe practical answer is a masked, subsetted, referentially intact dataset for integration and end-to-end work, plus synthetic data for the deliberate edge cases nobody wants to go hunting for in production: the null, the duplicate, the leap-second, the record created before your current schema existed. Then the part everybody forgets — refresh and reset automation, because a test dataset that drifts for six months is not less risky than production data, it is just less useful.',
      },
      {
        q: 'How do we test against systems we do not control?',
        sources: [
          { label: 'Pact — consumer-driven contract testing', url: 'https://docs.pact.io/' },
        ],
        a: 'By deciding, per dependency, whether you are testing your handling of it or testing it — they need opposite approaches and conflating them is why these suites are unreliable.\n\nMost of the time you are testing your own handling: what your code does with a timeout, a malformed payload, a 500, a rate limit, a schema change. That should never touch the real system. Virtualize it, and now you can produce the failure modes the sandbox will not give you on demand, which are the ones that take production down.\n\nWhere the dependency has a contract, contract testing is the higher-value answer. Both sides verify against a shared expectation, and you find out that a provider changed a field when they change it rather than when your end-to-end suite goes red for reasons nobody can localize.\n\nA thin layer of real integration tests still earns its place, run on a schedule rather than on every commit and treated as monitoring: they tell you the sandbox drifted, credentials expired, or the partner shipped something. What they must not do is sit in the merge path, because then your ability to deploy depends on somebody else’s uptime.',
      },
      {
        q: 'What does this cost to run, not to build?',
        a: 'Build is the number that gets budgeted and the smaller one. Three things make up the rest, and only the first is usually visible.\n\nExecution: compute for the suite, which on a large parallelized estate is a real monthly line, plus licensing for device farms, load generators and commercial tooling. Straightforward, and the one everyone can see.\n\nMaintenance: the engineering time spent repairing tests after legitimate product changes. On an unowned suite this grows until it consumes the majority of the capacity that was supposed to go into new coverage, which is why the automation backlog stops moving and nobody can quite say when it stopped.\n\nEnvironments and data: provisioning, refresh, masking, contention, and the hours engineers spend waiting for a slot. Rarely attributed to quality engineering and frequently larger than the tooling budget.\n\nWe are pre-launch and do not publish rate cards, so the honest commitment is about shape rather than price: the assessment is scoped so you can stop after it and keep the findings, and the numbers we report afterwards are measured against the baseline we took before starting rather than against an industry benchmark.',
      },
      {
        q: 'Who owns the tests after you leave?',
        a: 'Your teams, and we build on that assumption from the first sprint rather than negotiating it at handover.\n\nIn practice that means tests written in the language your engineers already work in, not a framework that requires us. It means the suite living in your repositories under your review process from day one. It means fixtures, helpers and data builders documented well enough that somebody who was not there can add the twentieth test as easily as we added the fifth. And it means your engineers pairing on the build rather than receiving a repository and a slide deck at the end.\n\nIt also means being straight about the load. A suite has an ongoing cost, and a program resourced for build with nothing for maintenance stalls in its second year with total predictability. If carrying that is not realistic for your team, we will run it under a service level and price it separately — but that is a commercial arrangement, not an engineering outcome. The line we hold is that the suite must remain operable by your own people. A test estate only we can maintain is a dependency we sold you.',
      },
      {
        q: 'Where does quality engineering stop and your other services start?',
        sources: [
          { label: 'NIST SP 800-218, Secure Software Development Framework', url: 'https://csrc.nist.gov/pubs/sp/800/218/final' },
        ],
        a: 'Testing touches almost everything, which is exactly why the boundary needs stating rather than blurring.\n\nWe own the suite, the test data and environment estate, performance and resilience evidence, accessibility conformance testing, and the release gate. That is the work on this page and it goes as deep as we can take it.\n\nWe do not own the pipeline platform itself, the infrastructure it deploys to, or the environments as a permanent capability — that is pipeline and platform engineering. We do not own the security program: the scanners belong in the build and we put them there, but threat modeling, penetration testing, identity and the response function are a separate discipline. We do not own production model monitoring, drift or retraining, and we do not own model governance — risk tiering, bias and fairness assessment, explainability and the file an assessor reads. We do not own data platform quality, and we do not own process redesign.\n\nThe division that matters in practice: this service decides whether a change is safe to ship and produces the evidence for that decision. What happens to the system afterwards, and who is accountable for it, belongs to the services linked throughout this page.',
      },
    ],

    // ── How we engage ─────────────────────────────────────────────
    // The first package measures a suite that already exists, deliberately
    // ahead of any build offer. Almost no inbound quality conversation is "we
    // have no tests" -- it is "we have thirty thousand and the build is red
    // again", and a page that only sells new automation is answering a question
    // nobody asked.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways in,',
    engagementHeadingHighlight: 'starting with the suite you have.',
    engagementLede: 'Most groups arrive with a suite rather than a blank page. The useful first engagement is usually a measurement of what the existing tests are telling you, not a proposal to write more of them.',
    servicePackages: [
      {
        name: 'Test Estate Assessment',
        description: 'For suites that already exist and are getting harder to trust. What you have, what it is really testing, how much of your red is noise, and what the whole thing costs to keep running.',
        deliverables: [
          'Flake rate measured across recent build history, by test and by class',
          'Suite runtime profiled and the critical path to a verdict identified',
          'Coverage read against business risk rather than as a percentage',
          'Maintenance load estimated as a share of engineering capacity',
          'Keep, rewrite, push-down or delete recommendation per test group',
        ],
      },
      {
        name: 'Suite Remediation & Flake Reduction',
        description: 'For teams who have stopped believing their own build. Fixing the signal before adding to it, because coverage added to a distrusted suite buys nothing.',
        deliverables: [
          'Flake root-caused by class, not test by test',
          'Test isolation, shared state and ordering defects repaired',
          'Quarantine policy with expiry dates and a route back',
          'Suite parallelized, sharded and change-selected',
          'Flake rate and time to verdict reported weekly against baseline',
        ],
      },
      {
        name: 'Automation Engineering',
        description: 'Building the suite, in your language and your repositories. Where standards do not exist yet, establishing them is part of the first engagement rather than something promised later.',
        deliverables: [
          'Test strategy with layers assigned by risk',
          'Framework, fixtures and data builders your team can extend',
          'Contract tests where services deploy independently',
          'Pipeline integration with a pre-merge and post-merge split',
          'Pairing with your engineers, not a handover deck',
        ],
      },
      {
        name: 'Performance & Resilience Engagement',
        description: 'For a launch, a peak event, a migration or a system that has started degrading and nobody can say why. Bounded, evidence-producing, and scoped to a decision.',
        deliverables: [
          'Workload model built from real traffic, not assumed uniform load',
          'Load, soak and breakpoint results against agreed SLOs',
          'Bottlenecks traced to component, query or configuration',
          'Fault injection on the dependencies most likely to fail',
          'Capacity evidence a technology leader can take to a board',
        ],
      },
      {
        name: 'Managed Quality Engineering',
        description: 'Running the suite, the environments and the release evidence under a service level. For teams who want the assurance without carrying a permanent specialist function for it.',
        deliverables: [
          'Suite operated and maintained against agreed availability',
          'Test data and environment estate managed, refreshed and governed',
          'Release readiness evidence produced each cycle',
          'Escaped defect analysis fed back into scope',
          'Monthly reporting on flake, runtime, coverage-by-risk and change failure rate',
        ],
      },
    ],

    // ── By industry ───────────────────────────────────────────────
    // Each headline names the constraint that actually decides the test
    // strategy in that sector, in the same way the RPA grid names the system
    // with no API. The constraint is almost never the framework -- it is the
    // data you cannot copy, the window you cannot move, or the evidence
    // somebody will later ask you to produce.
    industryHeading: 'Quality engineering by',
    industryHeadingHighlight: 'what makes testing hard.',
    industryLede: 'Eight sectors, the constraint that decides the test strategy in each, and the checks that carry the most weight. The framework is rarely the hard part.',
    industryUseCases: [
      {
        industry: 'Banking & Capital Markets',
        headline: 'Every release needs an evidence trail, and the test environment is not allowed to hold real customer data.',
        items: [
          'Payment and settlement path regression',
          'Masked, referentially intact test data across ledgers',
          'Interest, fee and rounding calculation verification',
          'Regulatory reporting output reconciliation',
          'Batch and end-of-day window performance',
          'Release evidence packs for audit',
          'Third-party and market data feed virtualization',
        ],
      },
      {
        industry: 'Insurance',
        headline: 'The policy administration system is a package on the vendor’s upgrade calendar, and a migration can only be proved by running both.',
        items: [
          'Packaged policy admin regression across upgrades',
          'Quote, rate and premium calculation verification',
          'Claims workflow and state machine coverage',
          'Parallel run with old-versus-new output comparison',
          'Document generation and template validation',
          'Broker and portal integration contract tests',
          'Renewal and endorsement cycle testing',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Patient data cannot leave production, and validation evidence is an audited artifact rather than an internal report.',
        items: [
          'Synthetic patient cohorts for clinical workflows',
          'HL7 and FHIR interface conformance testing',
          'Clinical decision path and safety-critical coverage',
          'Access control and role permission verification',
          'Validation evidence aligned to computerized system expectations',
          'Interoperability testing across care systems',
          'Accessibility conformance for patient-facing services',
        ],
      },
      {
        industry: 'Retail & Commerce',
        headline: 'The test that matters happens once a year, at four times normal traffic, on a date nobody can move.',
        items: [
          'Peak event load rehearsal at realistic traffic mix',
          'Checkout and payment path resilience',
          'Inventory and pricing consistency under concurrency',
          'Search, recommendation and personalization regression',
          'Promotion and discount rule verification',
          'Mobile and cross-device journey coverage',
          'Third-party tag and integration failure handling',
        ],
      },
      {
        industry: 'Telecom & Media',
        headline: 'The device, network and version matrix is larger than any suite can cover, so coverage becomes a sampling decision.',
        items: [
          'Device and OS coverage strategy by installed base',
          'Network condition and degradation testing',
          'Streaming quality and playback regression',
          'Provisioning and activation flow coverage',
          'Billing and rating verification',
          'Set-top, mobile and web parity testing',
          'Concurrency and peak-hour load validation',
        ],
      },
      {
        industry: 'Public Sector',
        headline: 'Accessibility conformance is statutory, and an assessor will read the evidence rather than the intent.',
        items: [
          'WCAG 2.2 AA conformance evidence',
          'Assistive technology testing with real screen readers',
          'Keyboard-only journey verification',
          'Plain-language and comprehension validation',
          'Legacy interface and mainframe regression',
          'High-demand service load rehearsal',
          'Accessibility statement substantiation',
        ],
      },
      {
        industry: 'Manufacturing & Connected Products',
        headline: 'Software ships to hardware you cannot patch weekly, so an escaped defect can become a field recall.',
        items: [
          'Hardware-in-the-loop test harnesses',
          'Firmware and over-the-air update validation',
          'Device-to-cloud interface contract testing',
          'Long-duration soak and memory leak detection',
          'Edge and intermittent connectivity behavior',
          'Backward compatibility across shipped versions',
          'Safety-critical path verification',
        ],
      },
      {
        industry: 'SaaS & Technology Platforms',
        headline: 'Multiple deploys a day on shared multi-tenant infrastructure, where one tenant’s data must never surface in another’s test.',
        items: [
          'Tenant isolation verification',
          'Backward-compatible API contract testing',
          'Zero-downtime migration and rollback validation',
          'Feature flag combination coverage',
          'Canary and progressive rollout verification',
          'Usage metering and billing accuracy checks',
          'Onboarding and trial path regression',
        ],
      },
    ],

    // ── Practice cluster ──────────────────────────────────────────
    // The default heading names the internal department ("The complete Shield
    // practice") and the default lede is one sentence, which left the band at
    // 33 words over 368px -- under the density floor. Overridden to state the
    // service boundary instead, which is the most useful thing a link index on
    // this particular page could say.
    practiceLabel: 'TRUST, RISK & ASSURANCE',
    practiceHeading: 'Where quality engineering stops,',
    practiceHeadingHighlight: 'and another service starts.',
    practiceLede: 'Testing touches almost everything, which is why the boundary is worth stating. We own the suite, the environments, the performance evidence and the release gate. The pipeline platform, the security program behind the scanners, production model monitoring and the governance file an assessor reads are separate services — and each of the pages below goes into its own subject at the depth this one gives testing.',

    conciergeHeading: 'Ask about your own suite',
    conciergeIntro: 'Bring a real number — how long your regression takes, how often the build is red, how many tests are muted. eQORE will tell you what it would look at first and what it would need from you.',
    conciergeChips: [
      'What share of our failed builds are actually flaky?',
      'How do we cut a fourteen-hour regression without losing coverage?',
      'How would you test a feature that calls an LLM?',
      'Can you run our regression suite under a service level?',
      'Book a test estate review',
    ],

    midCta: 'The suite is green. The question is whether anybody believes it.',
    midCtaLabel: 'Review One Test Suite',
    closingCta: {
      title: 'One suite,',
      highlight: 'honestly measured.',
      body: 'Show us two weeks of build history and the suite that produced it. In 30 minutes we will tell you how much of your red is real, how much of your team’s week the suite is taking, and which handful of tests is doing most of the damage — before anyone proposes writing more.',
      proofLabel: 'From first call to a measured test estate assessment',
    },
  },

  'operation-technology': {
    slug: 'operation-technology',
    name: 'Operation Technology (OT)',
    departmentSlug: 'shield',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    shortDescription: 'Industrial systems that are visible, connected and kept running — not just inventoried',
    fullDescription: 'Discover, architect, connect and operate the systems that reach every part of your enterprise, without asking your production line to accept the downtime an IT-style rollout assumes is free.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['OT asset visibility & discovery', 'ICS & SCADA engineering', 'IT/OT convergence & edge', 'Industrial data & observability', 'Predictive maintenance & industrial AI'],
    relatedServiceSlugs: ['it-security-services', 'internet-of-things', 'embedded-design-systems'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
    // Real date, set when this page was rewritten. Emitted as dateModified in
    // the WebPage node by seo/serviceSchema.js.
    lastReviewed: '2026-08-23',

    // ── Positioning ─────────────────────────────────────────────────────────
    // Was the Shield-department parity default: 361 bytes, no custom FAQs, and
    // a crawler seeing 2 per cent of the page — the thinnest of the four Shield
    // pages rewritten together.
    //
    // The wedge, same shape as the it-security-services rewrite but on the
    // engineering side rather than the control side: most OT programs do not
    // fail for lack of connectivity. They fail for lack of visibility — a
    // control system nobody has fully inventoried, a vendor remote-access
    // connection nobody remembers opening, a historian nobody trusts enough to
    // build a report from.
    //
    // The explicit boundary this page draws: OT and industrial security
    // controls — segmentation, monitoring, vulnerability management, OT
    // incident response — sit on it-security-services, which already has a
    // full "OT, IoT & Industrial Security" capability area and an OT-specific
    // FAQ. This page owns the industrial engineering those controls get
    // applied to: asset visibility, control-system architecture, IT/OT
    // connectivity, service management and predictive operations. Stated
    // explicitly in practiceLede below, and again inline in capability area 7,
    // so the two pages read as sequenced scope rather than overlapping ones.
    heroTitle: 'Operational Technology (OT)\nEngineered for the Enterprise',
    heroBadge: 'Visible. Connected. Resilient.',
    heroStripItems: [
      'OT Asset Visibility', 'ICS & SCADA Engineering', 'IT/OT Convergence & Edge', 'Industrial Data & Observability',
      'Predictive Maintenance', 'OT Service Management', 'Industrial AI', 'Safety-Constrained Change',
    ],
    hidePartnershipModel: true,

    whatIsEyebrow: 'What an OT program actually has to prove',
    // Fold lands right after para2 instead of after para3 — see the opt-in
    // branch this sets in UniversalServicePage.jsx (whatIsCollapseAfterPara2).
    whatIsCollapseAfterPara2: true,
    whatIsTitle: 'Operational Technology That',
    whatIsTitleLine2: 'Stays Visible and',
    whatIsHighlight: 'Runs Safely.',
    whatIsPara2: 'Most industrial estates do not have a connectivity problem. They have a visibility problem — a control system nobody has fully inventoried, a vendor remote-access connection nobody remembers opening, a historian nobody trusts enough to build a report from. Kangqore discovers, architects, connects and operates the systems that sit between your physical plant and your enterprise — control systems, industrial networks, edge platforms and operational data — without asking your production line to accept the downtime an IT-style rollout assumes is free.',
    whatIsPara3: 'Which means the hard problem in your OT work is rarely the technology itself. A PLC is not difficult to configure. What is difficult is the engineering workstation with three unofficial local accounts, the SCADA historian tag nobody has mapped to the process it describes, the vendor connection opened for a commissioning project that finished two years ago and was never closed. OT debt accumulates the same way security debt does — quietly, through individually reasonable decisions made under production pressure — and an assessment of your estate that only counts devices will miss all of it.',
    whatIsPara4: 'Kangqore engineers for operational context, not just connectivity. Your assets discovered and mapped to the process they support, connectivity built through a governed edge architecture rather than a flat network nobody controls, maintenance triggered by condition rather than a calendar, and a change process that respects a maintenance window instead of assuming a reboot is always available. The team that builds it can explain it to your plant manager, and your operations team can still run it after we leave.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // Not "100% operational reliability" or "maximum operational yield" — the
    // parity default's instinct on other pages, and both unfalsifiable. These
    // are the ones a plant manager or a COO is actually judged on: how much of
    // the estate is actually mapped, how much unplanned downtime a condition-
    // based program removes, how fast an anomaly gets noticed, and how much
    // maintenance is planned rather than reactive.
    outcomesEyebrow: 'WHAT AN OT PROGRAM SHOULD BE MEASURED ON',
    outcomesHeading: 'Operational Metrics',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'OT Asset Visibility',        desc: 'Increase in OT assets discovered, classified and mapped to the process they support, after continuous discovery replaces a spreadsheet last updated at commissioning.', value: '70', suffix: '%+', metricLabel: 'More of the Estate Mapped',        icon: 'Search'   },
      { illustrative: true, title: 'Unplanned Downtime',         desc: 'Reduction in unplanned downtime once condition-based maintenance and anomaly detection replace calendar-based servicing and run-to-failure.',                            value: '35', suffix: '%',  metricLabel: 'Less Unplanned Downtime',           icon: 'Activity' },
      { illustrative: true, title: 'Mean Time to Detect',        desc: 'Reduction in time to detect an operational or process anomaly once passive OT monitoring and telemetry correlation replace manual walk-rounds and operator instinct.',        value: '50', suffix: '%',  metricLabel: 'Faster Anomaly Detection',          icon: 'Radar'    },
      { illustrative: true, title: 'Preventive Maintenance Share', desc: 'Share of maintenance that is planned and condition-triggered rather than reactive, after equipment health scoring replaces fixed maintenance intervals.',                    value: '60', suffix: '%+', metricLabel: 'Maintenance Planned, Not Reactive', icon: 'Settings' },
    ],

    // ── Narrative outcomes ──────────────────────────────────────────────────
    // Without these the page falls through to UniversalServicePage's generic
    // outcomeCard/outcomeCard2 default (UniversalServicePage.jsx:700-715) — a
    // fabricated "Global Enterprise Organization" client descriptor asserting
    // "100% operational reliability" and "maximum operational yield". Both are
    // exactly the kind of unfalsifiable absolute claim the rest of this page
    // deliberately avoids, so real, illustrative-flagged narratives replace it
    // here rather than leaving the fallback to leak through.
    outcomeCard: {
      illustrative: true,
      metric: '40%',
      metricLabel: 'Reduction in unplanned downtime after asset visibility and condition-based maintenance',
      industry: 'Manufacturing & Industrial Automation',
      problem: 'A multi-plant manufacturer had no reliable inventory of what was actually running on the floor — the last full survey was three years old, and maintenance was almost entirely reactive: equipment ran until it failed, then got fixed. Nobody could say with confidence which failures were actually preventable.',
      outcome: 'Kangqore ran passive OT asset discovery across all three plants, mapped criticality against the production process each asset supported, and instrumented the handful of failure points that accounted for most of the downtime cost. Maintenance now runs against a condition-triggered backlog ranked by actual risk, not a fixed calendar — and the plants that adopted it first are the ones the downtime figure above is measured against.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '5 months',
      metricLabel: 'From asset discovery to a governed IT/OT connectivity architecture',
      industry: 'Energy & Utilities',
      problem: 'A utility’s SCADA network had accumulated vendor remote-access connections over more than a decade, with no current inventory of which were still needed and no segmentation between the control network and the corporate one — the kind of gap that shows up in an audit finding, not a daily incident, until it does.',
      outcome: 'Kangqore inventoried every remote connection across the estate, closed the ones nobody could justify keeping, and built a governed industrial DMZ with edge gateways terminating each vendor path. The security team now has an actual segmentation boundary to apply controls to, instead of a flat network with a firewall rule sitting somewhere between the plant and the corporate side.',
    },

    // ── Toolchain ───────────────────────────────────────────────────────────
    // Framed by what each platform is genuinely for, closing on the same
    // honest note IT security and quality engineering close on: most estates
    // already own more monitoring and historian licenses than they have
    // ownership assigned to.
    toolsStack: {
      eyebrow: 'THE OT TECHNOLOGY STACK',
      title: 'The industrial stack,',
      titleHighlight: 'and where the plant floor sets the limits.',
      subtitle: 'Tool choice is mostly settled by what is already installed on your floor and by how much of your estate is legacy versus modern. These are the defaults, what overrides them, and where the gap is ownership rather than another platform.',
      items: [
        {
          icon: 'Cpu',
          title: 'Industrial control systems',
          managed: 'Rockwell Automation, Siemens, Schneider Electric',
          selfHosted: 'Honeywell, ABB, GE Vernova and Emerson, where already installed',
          desc: 'Vendor choice is usually inherited, not chosen — the plant already runs what it runs. The work is engineering around it, not replacing it on a modernization timeline nobody asked for.',
        },
        {
          icon: 'Network',
          title: 'Industrial connectivity & protocols',
          managed: 'OPC UA, MQTT Sparkplug B',
          selfHosted: 'Modbus, DNP3 and Profinet for legacy plant-floor devices',
          desc: 'The plant floor still speaks protocols from decades before OPC UA existed. Integration works with what a device actually supports, not what an architecture diagram assumes.',
        },
        {
          icon: 'Radar',
          title: 'OT asset visibility & passive monitoring',
          managed: 'Claroty, Nozomi Networks, Dragos',
          selfHosted: 'Tenable.ot and on-prem sensors for air-gapped and segmented networks',
          desc: 'Passive by design. An active IT-style scan can crash fragile plant-floor equipment outright, so discovery reads protocol traffic rather than sending it.',
        },
        {
          icon: 'Layers',
          title: 'Industrial edge & gateways',
          managed: 'HMS Ewon, Moxa, Advantech edge gateways',
          selfHosted: 'On-prem edge compute where latency or an air gap rules out the cloud',
          desc: 'Where translation between an industrial protocol and an enterprise one actually happens, and where a control loop stays local no matter what the upstream connection is doing.',
        },
        {
          icon: 'Database',
          title: 'Historians & operational data',
          managed: 'AVEVA (OSIsoft) PI System, GE Proficy Historian',
          selfHosted: 'Honeywell Uniformance, on-prem where the plant cannot depend on a cloud link',
          desc: 'The system of record for what actually happened on the floor. Most plants already own one and use a fraction of what it captures.',
        },
        {
          icon: 'Globe',
          title: 'Industrial IoT & sensor platforms',
          managed: 'AWS IoT SiteWise, Azure IoT Operations',
          selfHosted: 'On-prem MQTT brokers for latency-sensitive lines',
          desc: 'Where retrofit sensors and connected equipment publish telemetry that never had a path to the enterprise before.',
        },
        {
          icon: 'BrainCircuit',
          title: 'Digital twin & simulation',
          managed: 'AVEVA, Siemens Xcelerator',
          selfHosted: 'Rarely — the value is almost entirely in the cloud-side model',
          desc: 'Worth building once the underlying data is trustworthy, and a wasted quarter before it is. Sequenced after the data foundation, not before it.',
        },
        {
          icon: 'TrendingUp',
          title: 'Predictive maintenance & industrial AI',
          managed: 'AWS, Azure and GCP ML platforms tuned to equipment telemetry',
          selfHosted: 'Edge inference where round-trip latency rules out the cloud',
          desc: 'Only as good as the sensor coverage feeding it. No data in is the honest reason more predictive-maintenance programs fail than any modeling choice.',
        },
        {
          icon: 'Network',
          title: 'The alternative to another platform',
          managed: 'A named asset owner, a discovery baseline, a maintenance calendar someone actually follows',
          selfHosted: 'Always evaluated before a new platform is proposed',
          desc: 'Most industrial estates already own more monitoring and historian licenses than they have ownership assigned to. We will say so before selling you another one.',
        },
      ],
    },

    faqEyebrow: 'ASKED BEFORE THE FIRST SITE VISIT',
    faqHeading: 'Ten OT questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // The parity default ran no custom FAQs at all. These are the ones a plant
    // manager, an OT engineering lead or a CISO scoping the OT half of a
    // security program actually opens with — including the boundary question
    // between this page and it-security-services, answered directly rather
    // than left for a sales call.
    customFAQs: [
      {
        q: 'Our OT network cannot be actively scanned or patched the way IT can. How do you actually build an asset inventory?',
        a: 'By reading, not probing. Passive discovery listens to protocol traffic off a network tap or SPAN port — OPC UA, Modbus, Profinet, whatever the segment actually speaks — and builds the inventory from what devices say to each other, without sending a single packet an active IT-style scanner would send. A vulnerability scanner built for IT can crash fragile OT equipment outright, and we do not run one against your live plant floor.\n\n'
          + 'That passive layer gets cross-referenced against what should exist: engineering drawings, P&IDs, vendor commissioning records and the historian tag list, because those four sources rarely agree with each other on a plant that has been running for fifteen years. The gap between them is usually where the real risk sits — a device on the network that is not on any drawing, or a drawing that describes equipment replaced two turnarounds ago.\n\n'
          + 'The last step is still a person walking the floor once. Passive discovery finds what is talking on the network; it does not find the isolated engineering laptop in a cabinet that only gets plugged in during a shutdown, and pretending otherwise produces an inventory that looks complete and is not.',
      },
      {
        q: 'What is the actual difference between OT and IT, beyond "OT controls machines"?',
        a: 'Determinism and consequence. An IT system responding a few hundred milliseconds slower is a performance complaint. A control loop responding a few hundred milliseconds late can be a safety event, which is why OT systems are engineered for predictable, real-time behavior first and everything else second.\n\n'
          + 'That changes what "maintenance" means. An IT patch ships on a monthly cadence and reboots a server nobody notices. An OT patch has to wait for a scheduled maintenance window, pass vendor certification because an uncertified change can void a warranty or a safety case, and sometimes simply cannot be applied to a controller that will run unmodified for its entire twenty-year service life.\n\n'
          + 'NIST’s own guidance to industrial control system security treats this as the starting assumption, not a footnote: availability and safety outrank confidentiality on the priority list that governs every other decision. A security or IT team that brings IT-first instincts to an OT environment — patch fast, reboot to fix, scan to discover — is usually the team that causes the incident it was trying to prevent.',
        sources: [{ url: 'https://csrc.nist.gov/pubs/sp/800/82/r3/final', label: 'NIST SP 800-82 Rev. 3 — Guide to OT Security' }],
      },
      {
        q: 'We already have a cybersecurity program. Why do we need a separate OT engagement?',
        a: 'Because IT security services cover the OT security controls — segmentation, monitoring, vulnerability management, incident response — and those controls need something to be applied to: an accurate asset inventory, a control-system architecture that can actually accept segmentation without breaking a process in your estate, and a connectivity design a security tool can sit on. That engineering work is what this page owns.\n\n'
          + 'Run the two out of order and the usual result is a security team proposing a segmentation change the plant cannot accept on the timeline offered, because nobody engineered the architecture to make the change safe. Run them together and the sequence is: discover and architect first, then apply the security controls to what is now a known, governed environment.\n\n'
          + 'In practice it is typically the same team, sequenced across two connected engagements rather than two competing quotes — the industrial engineering here, the controls, monitoring and evidence layered on top of it through Kangqore IT security services.',
      },
      {
        q: 'How do you connect a fifteen-year-old PLC to a modern analytics platform without touching the control loop?',
        a: 'One-way, and outward only. An edge gateway reads your PLC over its native protocol, republishes the same data as OPC UA or MQTT to whatever platform is on the other side, and the control loop itself never sees a packet from that connection. Your PLC keeps doing exactly what it was doing before anyone connected anything to it.\n\n'
          + 'The gateway is also where the boundary actually lives, not a firewall rule three network hops away. It terminates the industrial protocol on one side and the IT protocol on the other, so a fault, a flood or a misconfiguration on the analytics side has no path back into the deterministic control layer — the architecture enforces the separation rather than relying on a policy that says not to cross it.\n\n'
          + 'What this does not do is turn the PLC into something it is not. You get read access to what it already exposes — tags, status, counters — not remote configuration, not a write path, and not a shortcut past the change-control process that governs the controller itself.',
      },
      {
        q: 'Can predictive maintenance actually work on equipment with almost no sensors?',
        a: 'Not the way the vendor deck implies, and being honest about that upfront saves a wasted quarter. Predictive maintenance is a data problem before it is a modeling problem — no data in, no prediction out — and your equipment instrumented only with a run/stop signal gives a model almost nothing to learn a failure pattern from.\n\n'
          + 'What usually works is a minimum viable retrofit rather than a full instrumentation overhaul: a vibration sensor and a current clamp on a motor, a temperature probe on a bearing, added to the handful of assets where unplanned failure actually costs the most. That gets a model something to work with in months, on the equipment where the business case is real, instead of years across an entire fleet.\n\n'
          + 'Where instrumentation genuinely is not there and cannot be justified, the honest recommendation is condition-based maintenance built on manual inspection data and a defined threshold, not a machine-learning model dressed up to look predictive. A model trained on ten data points is not predictive maintenance; it is a coin flip with a dashboard.',
      },
      {
        q: 'What happens to the plant if the connection to enterprise IT or the cloud goes down?',
        a: 'Nothing, if the architecture was designed for it — and that is the design requirement, not an assumption. Time-critical control logic and safety interlocks run entirely on local edge compute and never depend on a round trip to the enterprise network or the cloud to make a decision.\n\n'
          + 'What does depend on that connection is everything downstream of control: the dashboard, the analytics platform, the enterprise report. When the link drops, telemetry buffers locally at the edge and your plant keeps running exactly as it was; when the link returns, the buffered data syncs rather than being lost, so a connectivity outage becomes a reporting gap, not a production incident.\n\n'
          + 'This is also why we do not recommend routing a safety function or a real-time control decision through a cloud platform, regardless of how reliable the vendor’s uptime claim is. Local resilience is not a fallback mode here; it is the primary design, with connectivity as the thing that can fail without your plant failing alongside it.',
      },
      {
        q: 'How long does an IT/OT convergence project actually take?',
        a: 'Longer than the vendor slide implies, and it depends far more on your current network’s starting state than on which platform you choose. A single plant with a network that is already partially segmented and one primary control vendor can have a governed DMZ and edge connectivity live in a few months.\n\n'
          + 'A multi-site estate with a flat network, several control vendors from different acquisitions, and no prior segmentation history is a materially longer program — often into a second year once every site is covered — and a fixed timeline quoted before an asset and network assessment is a guess dressed up as a plan.\n\n'
          + 'What we sequence for is risk reduction that shows up early rather than a big-bang cutover: the industrial DMZ and zones-and-conduits architecture first, since that is what makes everything after it safer to build; edge and historian integration second; analytics and predictive use cases third. Each phase stands on its own value even if a later one slips.',
      },
      {
        q: 'Who is actually accountable when a change to the control environment causes downtime?',
        a: 'Whoever owns the change, and that ownership is named before the change happens rather than argued about after — the same discipline a mature IT change-control process has, applied to your environment where the cost of getting it wrong is measured in a shift, not a rollback deploy.\n\n'
          + 'We design the change-management process — a defined window, a tested rollback path, a sign-off that includes the plant operations owner, not just an engineering lead — but production-affecting authority stays with your operations team. We do not push a change to a live control environment on our own judgment call.\n\n'
          + 'What we will not do is leave that ownership implied, because an unowned change process is exactly how a well-intentioned modernization effort turns into the incident that makes the next stage of the program harder to fund.',
      },
      {
        q: 'Can Kangqore support ongoing OT operations, or is this a one-time assessment?',
        a: 'Ongoing, where the engagement calls for it. Depending on scope, that includes OT service management, maintenance-window governance, vendor and OEM coordination, lifecycle tracking as equipment ages toward end of support, and continuous refinement of predictive models as more operating data accumulates.\n\n'
          + 'We are pre-launch and do not have an existing OT operations desk with years of a specific plant’s history to point to, which is worth saying plainly rather than implying otherwise. What we do bring is the architecture and the handover discipline: documentation your engineering team can act on without us, and a design built so it can be run in-house, handed to a managed partner, or kept with us — without a rebuild in any of those three cases.\n\n'
          + 'Most engagements start narrower than "ongoing operations" anyway — an assessment or a single convergence project — and the operating relationship, if there is one, gets scoped once both sides know what the estate actually needs.',
      },
      {
        q: 'Does getting started on OT asset visibility require a plant shutdown?',
        a: 'No — passive discovery is designed specifically to avoid needing one, and asking for a shutdown just to start an assessment is usually the wrong pitch. Reading protocol traffic off a tap or SPAN port happens with your plant running exactly as it always does; nothing about it requires downtime, and a vendor who suggests otherwise is proposing an active scan far sooner than an OT environment should tolerate one.\n\n'
          + 'Where a shutdown genuinely helps is later, and only for specific, narrow work — physically installing a tap on a segment that has none, or walking a section of floor that is safer to inspect without live equipment nearby. Even then it is scheduled inside a maintenance window your operations team already has planned, not a special outage requested for the assessment.\n\n'
          + 'The honest sequencing is discovery first, with your plant running, followed by a short list of items that do need a maintenance window — and that list is usually much shorter than people expect going in.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // The first package is a discovery pass across what already exists,
    // deliberately ahead of any transformation-program pitch — most inbound OT
    // conversations are "we are not sure what we actually have," not "we have
    // nothing."
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways in,',
    engagementHeadingHighlight: 'starting with what already exists.',
    engagementLede: 'Most OT conversations do not start from zero either. The useful first engagement is usually a discovery pass across what is already running, not a pitch for a full transformation program.',
    servicePackages: [
      {
        name: 'OT Asset Visibility & Maturity Assessment',
        description: 'For understanding what is actually running before committing to anything. Passive discovery, criticality classification, and an architecture baseline against a real framework.',
        deliverables: [
          'OT asset discovery and inventory',
          'Asset criticality and classification model',
          'OT topology and dependency mapping',
          'Architecture baseline against IEC 62443 zones',
          'Prioritized OT risk and modernization register',
        ],
      },
      {
        name: 'Industrial Control & Engineering Architecture',
        description: 'Designing the control and data layer everything else depends on. SCADA, PLC, HMI and DCS environments assessed and architected for your actual estate, not a vendor reference deployment.',
        deliverables: [
          'SCADA, DCS and PLC environment assessment',
          'Control-system architecture design',
          'Historian and operational data architecture',
          'Legacy OT modernization roadmap',
          'Production-safe change planning framework',
        ],
      },
      {
        name: 'IT/OT Convergence & Edge Connectivity',
        description: 'Building the governed connectivity between the plant floor and the enterprise. Sequenced so the environment stays safe to operate throughout, not just at the end.',
        deliverables: [
          'IT/OT convergence and industrial DMZ architecture',
          'Edge gateway and protocol integration (OPC UA, MQTT)',
          'Plant-to-enterprise and OT-to-cloud connectivity design',
          'Secure remote access architecture',
          'Distributed-site connectivity model',
        ],
      },
      {
        name: 'OT Service Management & Governance',
        description: 'Bringing engineering, operations, IT and OEMs together around one operating model, so a change is evaluated in its operational context instead of discovered after the fact.',
        deliverables: [
          'OT operating-model and service catalog design',
          'Change, incident and request management processes',
          'Vendor and OEM coordination workflows',
          'Asset lifecycle and configuration management',
          'OT governance dashboards and reporting',
        ],
      },
      {
        name: 'Industrial Data, Observability & Predictive Operations',
        description: 'Turning the telemetry the previous stages generate into predictive intelligence. For teams ready to move past reactive maintenance and manual walk-rounds.',
        deliverables: [
          'Industrial data architecture and OT-to-IT integration',
          'Real-time telemetry and observability pipelines',
          'Condition-based and predictive maintenance enablement',
          'Anomaly detection and equipment health scoring',
          'Industrial AI and digital-twin foundations',
        ],
      },
    ],

    // ── Sectors ─────────────────────────────────────────────────────────────
    // Renders the industry grid. Six sectors where OT is not a side
    // conversation to IT — it is the plant, the grid, the well, the line and
    // the network of sites that keep them running — and the industrial
    // engineering work each one actually needs, deliberately distinct from
    // the eight compliance-framework-led sectors on it-security-services.
    //
    // industryHeading/Highlight set explicitly because the prerender generator
    // only reads svc.industryHeading directly — it does not know about the
    // department-level fallback the React page resolves through — so leaving
    // it unset means the crawler snapshot sees a generic "By industry" heading
    // a visitor never does.
    industryHeading: 'Engineered for',
    industryHeadingHighlight: 'your operating environment.',
    industryLede: 'Six sectors where OT is not a side conversation to IT — it is the plant, the grid, the well, the line and the network of sites that keep them running, and the industrial engineering work each one actually needs.',
    industryUseCases: [
      {
        industry: 'Manufacturing & Industrial Automation',
        headline: 'A production line that cannot be patched mid-shift, and increasingly connected to an IT network that assumes it can be.',
        items: [
          'Discrete and process manufacturing OT asset visibility',
          'PLC, HMI and DCS environment support',
          'Production-line IT/OT segmentation architecture',
          'Predictive maintenance for critical production assets',
          'Manufacturing execution system (MES) data integration',
          'Legacy control system modernization planning',
          'Multi-site plant connectivity architecture',
          'Production continuity risk assessment',
        ],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'SCADA systems older than the engineers running them, distributed assets across a grid, and downtime that is a public event, not an inconvenience.',
        items: [
          'SCADA and distributed asset visibility',
          'Substation and field-device connectivity architecture',
          'Grid monitoring and telemetry integration',
          'Legacy industrial protocol support',
          'Remote and unmanned-site connectivity',
          'Historian and operational data architecture for the grid',
          'Predictive maintenance for critical grid assets',
          'OT service management across distributed operations',
        ],
      },
      {
        industry: 'Oil, Gas & Chemicals',
        headline: 'Process-control environments where a wrong change is a safety incident, and remote operations across sites nobody can visit weekly.',
        items: [
          'Process-control system architecture and support',
          'Remote and unmanned facility connectivity',
          'Process historian and telemetry integration',
          'Asset criticality and integrity monitoring data',
          'Turnaround and maintenance-window planning',
          'Safety-constrained change management for process control',
          'Legacy DCS modernization planning',
          'Multi-site OT governance and reporting',
        ],
      },
      {
        industry: 'Mining & Metals',
        headline: 'Heavy equipment, distributed sites with limited connectivity, and a maintenance cost structure where unplanned downtime is the largest line item.',
        items: [
          'Distributed and remote-site OT asset visibility',
          'Heavy-equipment condition monitoring integration',
          'Site connectivity architecture for limited-bandwidth environments',
          'Predictive maintenance for fleet and fixed equipment',
          'Edge computing for offline and intermittently connected sites',
          'Historian integration across distributed operations',
          'OT lifecycle management for aging fleet assets',
          'Production and equipment-health dashboards',
        ],
      },
      {
        industry: 'Water & Wastewater',
        headline: 'SCADA-controlled treatment processes, public-health consequences if control fails, and often the smallest OT budget of any critical-infrastructure sector.',
        items: [
          'Treatment-process SCADA and PLC support',
          'Remote pump station and field-site connectivity',
          'OT asset visibility for distributed public infrastructure',
          'Historian integration for regulatory and compliance reporting',
          'Legacy control system modernization planning',
          'Predictive maintenance for critical treatment equipment',
          'Safety-constrained change management for public infrastructure',
          'OT governance for resource-constrained operations teams',
        ],
      },
      {
        industry: 'Transportation & Critical Infrastructure',
        headline: 'Operational systems distributed across facilities and moving assets, where telemetry has to travel further than a plant network was ever designed for.',
        items: [
          'Facility and asset OT visibility across distributed sites',
          'Operational telemetry and control-system integration',
          'Edge connectivity for moving and remote assets',
          'Legacy control environment modernization planning',
          'Predictive maintenance for critical operational assets',
          'Multi-site OT service management',
          'Resilient connectivity for safety-relevant systems',
          'Historian and operational data architecture',
        ],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Both columns own connectivity. The difference is whether an asset, a
    // connection or a change is owned, mapped and provable, or just running
    // and left alone — the same governed-versus-deployed argument
    // it-security-services makes, applied to the engineering layer instead of
    // the control layer.
    comparisonTable: {
      eyebrow: 'CONNECTED VERSUS GOVERNED',
      heading: 'OT Connected vs. Governed OT Operations.',
      lede: 'Neither column is short on connectivity. They differ in whether an asset, a connection or a change in your estate is owned, mapped and provable — or just running and left alone.',
      beforeLabel: 'OT CONNECTED',
      afterLabel: 'OT GOVERNED',
      afterBadge: 'KANGQORE',
      beforeShort: 'CONNECTED',
      afterShort: 'GOVERNED',
      rows: [
        {
          dimension: 'What’s actually on the plant floor',
          before: 'A spreadsheet last updated during commissioning, and nobody confident it still matches what is running.',
          after: 'A continuously discovered OT asset inventory, mapped to the process each device actually supports.',
        },
        {
          dimension: 'When a PLC or HMI nears end of life',
          before: 'Nobody notices until it fails mid-shift, and the vendor stopped supporting it three years ago.',
          after: 'Lifecycle tracked against vendor support windows, with replacement planned around a maintenance window, not a failure.',
        },
        {
          dimension: 'How IT and OT actually connect',
          before: 'An unmanaged connection opened for a vendor’s remote support years ago, and never closed.',
          after: 'Governed connectivity through a defined edge and DMZ architecture, with a security control able to sit on top of it.',
          link: { href: '/services/it-security-services', label: 'OT segmentation and security controls' },
        },
        {
          dimension: 'What triggers a maintenance visit',
          before: 'A calendar date, or a breakdown, whichever comes first.',
          after: 'Condition and anomaly signals from the equipment itself, escalated before failure — not after it.',
        },
        {
          dimension: 'Who owns a change to the control environment',
          before: 'Whoever has admin access to the engineering workstation that day.',
          after: 'A named owner, a documented change window, and a rollback path tested before go-live.',
        },
        {
          dimension: 'Where operational data actually ends up',
          before: 'Trapped in the historian, or on a clipboard on the plant floor.',
          after: 'Connected to enterprise systems and analytics — and the plant keeps running if that link goes down.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────────────
    // Five stages, matching the array length it-security-services uses for
    // the same layout reason. Ends at Optimize rather than Secure, because
    // security ownership sits on it-security-services — the fifth stage here
    // is what the other page's rewrite does not cover: turning the operational
    // data the first four stages generate into predictive intelligence.
    architectureEyebrow: 'THE OT TRANSFORMATION LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Assess to Optimize.',
    architectureLede: 'Five stages, and most OT programs stall between Architect and Connect — the point where a proposed change meets a plant floor that cannot accept it on the timeline offered. A connection that is not owned, monitored and reversible decays back into risk within a year, the same as an unowned security control.',
    architectureNodes: [
      {
        title: 'Assess',
        icon: 'Search',
        description: 'Establish the real estate before proposing anything: what exists, what it controls, who owns it, and where the gap between what the P&ID says and what is actually running sits.',
        features: [
          'OT asset discovery and inventory',
          'Asset classification and criticality assessment',
          'OT topology and dependency mapping',
          'Configuration and lifecycle visibility',
          'OT maturity and transformation assessment',
        ],
      },
      {
        title: 'Architect',
        icon: 'Layers',
        description: 'Design the target-state control and connectivity architecture before integrating anything — zones and conduits, edge gateway placement, and the historian and data model the rest of the program depends on.',
        features: [
          'Target OT architecture and zones-and-conduits design',
          'SCADA, DCS and PLC environment architecture',
          'Historian and operational data architecture',
          'Edge and gateway architecture',
          'Engineering workstation governance model',
        ],
      },
      {
        title: 'Connect',
        icon: 'Network',
        description: 'Integrate industrial systems, edge environments and enterprise platforms through governed connectivity — designed so local operations keep running if the upstream link does not.',
        features: [
          'IT/OT convergence and industrial DMZ architecture',
          'OPC UA and MQTT-based industrial connectivity',
          'Plant-to-enterprise and OT-to-cloud integration',
          'Secure remote access architecture',
          'Distributed-site connectivity design',
        ],
      },
      {
        title: 'Operate',
        icon: 'Activity',
        description: 'Run the service-management model that keeps engineering, operations, IT and OEMs working from the same change and incident process, instead of five teams discovering a change after the fact.',
        features: [
          'OT change, incident and request management',
          'Maintenance-window and configuration governance',
          'Vendor and OEM coordination workflows',
          'Asset lifecycle management',
          'OT governance dashboards and reporting',
        ],
      },
      {
        title: 'Optimize',
        icon: 'TrendingUp',
        description: 'Turn the operational data the previous four stages now generate into predictive intelligence — the stage most programs never reach, because it depends on everything before it actually working.',
        features: [
          'Real-time telemetry and industrial observability',
          'Condition-based and predictive maintenance',
          'Anomaly detection and equipment health scoring',
          'Industrial AI and digital-twin foundations',
          'Continuous improvement against a measured baseline',
        ],
      },
    ],

    capabilitiesLabel: 'OPERATIONAL TECHNOLOGY & INDUSTRIAL ENGINEERING',
    capabilitiesSectionTitle: 'Operational Technology',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Discover your estate, architect your control and connectivity layer, integrate IT and OT without losing control of either, and turn your operational data into intelligence — across asset visibility, industrial engineering, edge connectivity, service management and predictive operations.',
    capabilityAreas: [
      {
        title: 'OT Asset Visibility, Discovery & Digital Foundation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Effective OT transformation begins with an accurate understanding of the industrial estate — not a spreadsheet last updated during commissioning.',
        items: [
          'OT Asset Discovery & Inventory',
          'Asset Classification & Criticality Assessment',
          'OT Topology & Dependency Mapping',
          'Plant, Line, Cell & Equipment Relationship Mapping',
          'Configuration & Lifecycle Visibility',
          'OT Architecture Baseline',
          'Asset Ownership & Accountability Models',
          'OT Maturity & Transformation Assessments',
          'Operational Technology Data Foundations',
        ],
      },
      {
        title: 'Industrial Control Systems & OT Engineering',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The technology layers that directly interact with physical processes — supported without pretending OT can be managed like conventional IT.',
        items: [
          'SCADA Environment Assessment & Support',
          'PLC & HMI Ecosystem Support',
          'DCS Environment Assessment',
          'Industrial Server & Workstation Architecture',
          'Control-System Configuration Review',
          'OT Infrastructure Lifecycle Support',
          'Historian & Operational Data Architecture',
          'Industrial System Integration',
          'Legacy OT Modernization Planning',
          'Production-Safe Technology Change Planning',
        ],
      },
      {
        title: 'IT/OT Convergence, Industrial Connectivity & Edge',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Controlled connectivity between the plant floor and the enterprise — connected without becoming uncontrolled.',
        items: [
          'IT/OT Convergence Architecture',
          'Industrial Network Architecture',
          'Edge Computing Enablement',
          'Industrial Gateway Architecture',
          'Plant-to-Enterprise Connectivity',
          'OT-to-Cloud Connectivity',
          'Protocol-Aware Integration (OPC UA, MQTT)',
          'Industrial IoT Enablement',
          'Remote Operational Visibility',
          'Secure Data Exchange Architecture',
        ],
      },
      {
        title: 'OT Service Management, Governance & Lifecycle',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Operational discipline across engineering, operations, IT, cybersecurity, OEMs and integrators — so a change is evaluated in its operational context instead of five teams discovering it after the fact.',
        items: [
          'OT Operating-Model Design',
          'OT Service Catalog Development',
          'OT Change Management',
          'OT Incident & Request Management',
          'Asset Lifecycle Management',
          'Maintenance-Window Governance',
          'Configuration Management',
          'Vendor & OEM Coordination',
          'OT Governance Dashboards & Reporting',
        ],
      },
      {
        title: 'Industrial Data, Observability & Operational Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Turning machine data into operational context — what it means, what it affects and what action should follow, not just another chart.',
        items: [
          'Industrial Data Architecture',
          'OT-to-IT Data Integration',
          'Historian Integration',
          'Real-Time Telemetry Pipelines',
          'Industrial Observability',
          'Asset Health Monitoring',
          'Event & Alert Correlation',
          'Production KPI Visibility',
          'Operational Data Quality',
          'Enterprise Analytics Integration',
        ],
      },
      {
        title: 'Predictive Operations, Maintenance & Industrial AI',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Moving from reactive operations to intelligence-driven operations — using operational context to anticipate what happens next, with a human still in the loop.',
        items: [
          'Predictive Maintenance Enablement',
          'Condition-Based Maintenance',
          'Equipment Health Scoring',
          'Failure Prediction Frameworks',
          'Anomaly Detection',
          'Process-Performance Analytics',
          'Predictive Quality Analytics',
          'Industrial Digital-Twin Foundations',
          'AI-Assisted Operational Decision Support',
          'Human-in-the-Loop Industrial AI Workflows',
        ],
      },
      {
        title: 'OT Continuity, Safety & Change Governance',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What keeps a plant running through a modernization program rather than gambling with it. Deliberately narrower than a security capability: the segmentation, monitoring and vulnerability management that protect the estate sit on Kangqore IT security services, built on the visibility and architecture this page establishes.',
        items: [
          'Safety-Constrained Change Planning',
          'Maintenance-Window Governance',
          'Recovery & Rollback Procedure Design',
          'Vendor & OEM Patch Coordination',
          'Production Continuity Risk Assessment',
          'OT Business Continuity Planning',
          'Engineering Workstation Governance',
          'Legacy Dependency & Constraint Mapping',
        ],
      },
    ],

    // ── Practice boundary ───────────────────────────────────────────────────
    // The default band lists Shield-department siblings with a generic
    // one-line lede, which renders thin. Stating the boundary explicitly —
    // same pattern it-security-services and quality-engineering-assurance
    // use — says where OT engineering ends and OT security picks up, rather
    // than leaving it implied by a service-card grid.
    practiceLabel: 'TRUST, RISK & ASSURANCE',
    practiceHeading: 'Where OT engineering stops,',
    practiceHeadingHighlight: 'and OT security starts.',
    practiceLede: 'This page owns the industrial engineering: what exists on your plant floor, how your control systems and edge platforms are architected, how your IT and OT connect, and how your operational data becomes predictive intelligence. OT and industrial security controls — segmentation, monitoring, vulnerability management, OT incident response — sit on IT security services, built on the asset visibility and architecture this page establishes. Financial and operational risk sits on finance & risk management. Each page goes into its own subject at the depth this one gives OT.',

    conciergeHeading: 'Ask about your own plant floor',
    conciergeIntro: 'Bring a real asset — the PLC nobody has documented, the historian tag nobody trusts, the vendor connection nobody remembers opening. eQORE will tell you what it would check first and what it would need from you.',
    conciergeChips: [
      'How much of our OT estate is actually unaccounted for?',
      'Can we connect a 15-year-old PLC to our analytics platform safely?',
      'What would a real IT/OT convergence architecture look like for us?',
      'How do we know if a maintenance alert is worth a shutdown?',
      'Book an OT asset review',
    ],

    midCta: 'A connected plant and a governed one are not the same claim.',
    midCtaLabel: 'Review One OT Environment',
    closingCta: {
      title: 'One asset review.',
      highlight: 'One estate you can actually see.',
      body: 'Bring the control system you suspect nobody has fully mapped, or the connection you are not sure is still needed. In 30 minutes we will tell you what is a genuine gap, what is a documentation problem, and which of the two would cost you a shift if it failed tomorrow.',
      proofLabel: 'From first call to a costed OT assessment',
    },
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // KANGQORE PLATFORMS — 8 services
  // ═════════════════════════════════════════════════════════════════════════════

  'enterprise-integration-platform': {
    slug: 'enterprise-integration-platform',
    name: 'Enterprise Integration Platform',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS\u2122',
    shortDescription: 'Architecting and engineering the integration fabric across applications, APIs, data, events and partners',
    fullDescription: 'Integration strategy and architecture, API, event and messaging engineering, B2B and partner connectivity, hybrid cloud integration, modernization and governed operations.',
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Integration architecture', 'API, event & messaging', 'B2B & EDI', 'Hybrid & iPaaS', 'Governance & operations'],
    relatedServiceSlugs: ['api-microservices-engineering', 'application-modernization', 'digital-process-automation'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',

    // ── Positioning ─────────────────────────────────────────────────────────
    // 689 bytes of data and a crawler seeing 2.3 per cent of the page. The
    // parity default rendered generic platform copy with none of the vocabulary
    // this category is searched on -- no iPaaS, no EDI, no event streaming, no
    // API gateway.
    //
    // The competitive field splits three ways and none of the three occupies
    // the middle. Oracle owns the definitional queries with a 3,339-word page
    // structured entirely as questions -- what is EiPaaS, how does it work, why
    // it matters -- which is an answer-engine play rather than a services page.
    // Cognizant leads with agentic integration at 820 words, positioning ahead
    // of substance. Persistent sells strategy, implementation and managed
    // services without an architecture argument.
    //
    // The gap is the architecture case, stated plainly: integration is a
    // discipline rather than an inventory of connectors, and the thing that
    // decides whether an estate survives a decade is what was decided before
    // anything was connected. That is also the honest position for a firm with
    // no proprietary iPaaS to sell -- vendor neutrality is only credible when
    // you hold no license margin, which we do not.
    //
    // Boundary with /services/api-microservices-engineering, which is still on
    // the parity default and will eventually own the API-as-product and
    // microservices-architecture story. This page owns APIs, events and
    // messaging *as integration mechanisms* -- how systems reach each other.
    // That page will own how an API is designed, versioned and productized.
    // Area 03 is written to that boundary so the two do not collide later.
    heroTitle: 'Enterprise Integration Platform\nServices for Intelligence Operations',
    whatIsEyebrow: 'What an enterprise integration platform capability covers',
    whatIsTitle: 'Integration Is an',
    whatIsTitleLine2: 'Architecture,',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'Not a Connector Inventory.',
    whatIsPara2: 'No enterprise runs on one platform. Yours runs across ERP, CRM, HCM, supply chain, finance and CX, a data estate, applications nobody wants to touch, a SaaS portfolio that grew by department, partner networks, several clouds and now AI systems that expect to reach all of it.',
    whatIsPara3: 'Connectivity on its own stopped being the difficulty a long time ago. Every point-to-point interface you add is a dependency somebody has to remember, and estates reach a threshold where changing one system quietly breaks three others \u2014 at which point the integration layer is no longer enabling change, it is the reason change is slow. What is being asked of it now is harder again: not only to move data between functions, but to run a process across CX, CRM, ERP, HCM, supply chain and finance as one flow rather than six handoffs, and to let AI reach those same platforms under the same controls as everything else.',
    whatIsPara4: 'Kangqore designs, engineers, modernizes and operates that layer as an architected capability: applications, APIs, data, events, processes, partners and AI, across on-premises, private cloud, public cloud and hybrid, with security, identity, policy, observability and lifecycle governance designed in rather than added afterwards. Intelligence belongs inside that architecture rather than in place of it \u2014 a model reaching your systems through governed interfaces inherits every control the estate already enforces, and one reaching them any other way inherits none of them. Discover, architect, engineer, modernize, govern, operate.',

    // ── Outcomes ────────────────────────────────────────────────────────────
    // The previous metrics were 99.9%, 10x, "Zero Data Silos" and "Absolute
    // Governance" -- three unfalsifiable absolutes and a multiplier with no
    // denominator. At enterprise-consulting positioning those reduce
    // credibility rather than build it, which was the user's own read and is
    // correct.
    //
    // Replaced with four dimensions from an integration value framework, each
    // countable and each with an owner: how fast a new integration ships, how
    // much of it was reused, how much of the legacy estate went away, and how
    // long a partner takes to go live.
    outcomesEyebrow: 'HOW AN INTEGRATION ESTATE IS ACTUALLY JUDGED',
    outcomesHeading: 'Integration Metrics',
    outcomesHeadingHighlight: 'Worth Baselining.',
    businessMetrics: [
      { illustrative: true, title: 'Integration Velocity',   desc: 'Time to design, build and deploy a new integration once a reusable API and connector layer exists, against the same work built point to point.', value: '3\u20135', suffix: ' Days', metricLabel: 'Design to Deploy',        icon: 'Zap'      },
      { illustrative: true, title: 'Reuse Rate',             desc: 'Share of new integrations assembled from existing APIs, events and connectors rather than built from scratch, after the shared layer is established.', value: '60',  suffix: '%',    metricLabel: 'Built From Reuse',     icon: 'Layers'   },
      { illustrative: true, title: 'Interface Rationalization', desc: 'Point-to-point interfaces retired or consolidated during modernization without losing a business flow \u2014 usually duplicates built by different teams.', value: '40',  suffix: '%',    metricLabel: 'Interfaces Retired',   icon: 'Network'  },
      { illustrative: true, title: 'Partner Onboarding',     desc: 'From signed agreement to a trading partner exchanging live transactions, once onboarding is templated rather than engineered each time.',              value: '5\u201310', suffix: ' Days', metricLabel: 'Contract to Live',    icon: 'Globe'    },
    ],

    heroBadge: 'Architected. Engineered. Governed.',
    heroStripItems: [
      'Integration Architecture', 'API & Event Integration', 'Enterprise Messaging', 'Data & Process Orchestration',
      'B2B, EDI & Partner', 'Hybrid Cloud & iPaaS', 'Integration Modernization', 'Agentic Integration',
    ],
    hidePartnershipModel: true,

    // ── Capability areas ────────────────────────────────────────────────────
    // Nine, as specified, and the sequence is the argument: strategy ->
    // architecture -> engineering -> modernization -> operations ->
    // intelligence. A reader who scans only the nine titles should be able to
    // reconstruct how an integration program actually runs.
    //
    // Area 03 is deliberately scoped to APIs, events and messaging *as
    // integration mechanisms*. /services/api-microservices-engineering will own
    // API-as-product and microservices architecture; this owns how systems
    // reach each other. Writing that boundary now prevents the collision the
    // four automation pages had to be untangled from later.
    //
    // Area 09 is last on purpose. Cognizant leads their page with agentic
    // integration; putting it ninth says the same capability exists and that it
    // sits on top of an architecture rather than instead of one.
    // ── Toolchain ───────────────────────────────────────────────────────────
    // Technology-neutral by construction. We hold no reseller margin on any of
    // these, which is the only reason a recommendation to use what you already
    // license is credible coming from us rather than from a vendor.
    toolsStack: {
      eyebrow: 'THE INTEGRATION ECOSYSTEM',
      title: 'The platforms,',
      titleHighlight: 'and what each is actually for.',
      subtitle: 'Platform choice is mostly settled by what the group already licenses and by whether the hard problem is transformation, throughput or partner exchange. These are the defaults and what overrides them.',
      items: [
        {
          icon: 'Network',
          title: 'Integration platforms and iPaaS',
          managed: 'MuleSoft, Boomi, Informatica, Workato, SnapLogic',
          selfHosted: 'Azure Logic Apps on Microsoft estates',
          desc: 'The default for an estate of any size: connectors, transformation and lifecycle in one place. Licensed per connection or per flow, which stops making sense below roughly twenty interfaces \u2014 and above a few hundred, unless reuse is enforced.',
        },
        {
          icon: 'Globe',
          title: 'API management',
          managed: 'Kong, Apigee, Azure API Management, AWS API Gateway',
          selfHosted: 'Kong or NGINX where the runtime must stay yours',
          desc: 'Policy, security, throttling and analytics at the edge of the estate. The gateway is the easy decision; the governance model behind it \u2014 who may publish, who owns a contract, how a version retires \u2014 is the one that matters.',
        },
        {
          icon: 'Zap',
          title: 'Event streaming and messaging',
          managed: 'Apache Kafka, Confluent, cloud-native event services',
          selfHosted: 'RabbitMQ, ActiveMQ, IBM MQ where ordering is critical',
          desc: 'Streaming and queueing are not interchangeable. Kafka is a durable log you replay; a message broker is a delivery guarantee you acknowledge. Choosing the wrong one is the single most common cause of an estate that cannot be reasoned about.',
        },
        {
          icon: 'Layers',
          title: 'B2B and EDI',
          managed: 'Vendor B2B gateways and managed EDI networks',
          selfHosted: 'AS2 and SFTP endpoints inside your perimeter',
          desc: 'X12, EDIFACT and the transport underneath. The engineering is unremarkable; partner onboarding at volume is the actual product, and the difference between an eight-week and a five-day onboarding is templating rather than tooling.',
        },
        {
          icon: 'Cpu',
          title: 'Runtime and deployment',
          managed: 'Kubernetes, containers, serverless functions',
          selfHosted: 'Whatever your platform team already operates',
          desc: 'Where integration workloads actually run. Integration is stateful more often than teams expect, so serverless suits event handlers and fits long-running orchestration badly.',
        },
        {
          icon: 'Eye',
          title: 'Observability',
          managed: 'Prometheus, Grafana, OpenSearch, vendor API analytics',
          selfHosted: 'Distributed tracing across every hop',
          desc: 'Platform dashboards tell you a flow ran. They cannot tell you a transaction entered at one end and never arrived at the other, which is the question operations actually needs answered \u2014 and it requires tracing, not monitoring.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve integration questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────────────────
    // Oracle owns the definitional queries in this category with a 3,339-word
    // page built entirely from questions -- what is EiPaaS, how does it work,
    // why it matters. Competing with that on volume is pointless; competing on
    // usefulness is not. These answer the same definitional queries and then
    // say the thing a platform vendor cannot: when not to buy the platform.
    customFAQs: [
      {
        q: 'What is enterprise platform integration?',
        a: 'The architecture and engineering discipline of connecting applications, APIs, data, events, workflows and external partner systems so an enterprise operates as one coordinated estate rather than a set of technology islands.\n\nIt spans more than connectors. Application and legacy integration, API and event architecture, enterprise messaging, B2B and EDI, data transformation, process orchestration across systems, hybrid and multi-cloud connectivity, and the governance covering identity, policy, lifecycle and observability over all of it.\n\nThe distinction that matters commercially: buying an integration platform is a procurement decision, and having an integration architecture is an engineering one. Organizations that do the first without the second end up with the same point-to-point sprawl, built on a more expensive substrate.',
      },
      {
        q: 'Is API integration the same as enterprise integration?',
        a: 'No, and conflating them is the most common architectural mistake in this category.\n\nAPIs are one mechanism. They are synchronous, request-response, and excellent when a caller needs an answer now. They are a poor fit when the producer should not know or care who consumes the data, when the consumer may be offline, when ordering matters, or when a message must survive a restart.\n\nThose cases need events, streams or queues. Enterprise integration also covers B2B and EDI for partners who will never call your API, file and batch interfaces that still move most of the world\u2019s enterprise data, and orchestration for processes crossing several systems.\n\nAn estate built entirely on synchronous APIs becomes a distributed system where every caller is coupled to every callee\u2019s uptime. That is usually discovered during an incident rather than during design.',
      },
      {
        q: 'What is iPaaS, and do we need one?',
        a: 'Integration Platform as a Service: a hosted environment for building, running and governing integrations, with prebuilt connectors, transformation tooling and lifecycle management.\n\nIt earns its cost when you have a meaningful number of interfaces, several teams building them, and a genuine need for shared governance. Below roughly twenty integrations the licensing rarely pays back against building on your existing runtime and API gateway.\n\nThe failure mode at the other end is worth naming too. Above a few hundred flows, an iPaaS without enforced reuse becomes point-to-point sprawl on a more expensive substrate \u2014 the same problem, now with a subscription. The platform does not create reuse; the governance model does.\n\nWe hold no reseller margin on any integration platform, so a recommendation to stay on what you have costs us nothing.',
      },
      {
        q: 'Can you integrate our legacy systems, including mainframe?',
        a: 'Yes, and this is usually where an integration layer earns its keep rather than where it struggles.\n\nLegacy platforms are frequently more stable integration targets than modern SaaS, because they change rarely and their interfaces have been fixed for years. The work is in the transport and the semantics: adapters, message formats, character encodings, batch windows and the business logic embedded in the system that nobody documented.\n\nThe usual pattern is an API facade over the legacy capability, so consumers depend on a contract you control rather than on the system itself. That decouples modernization from replacement: the mainframe can be retired later, or never, without the consumers being rewritten.\n\nWhat we would not do is drive a legacy screen with a bot when a real interface can be built. That belongs on our robotic process automation service and is a last resort.',
      },
      {
        q: 'Our estate has hundreds of interfaces and nobody knows what they do. Where do we start?',
        a: 'With discovery, and it is usually the most valuable fortnight of the engagement.\n\nWhat exists, what it connects, who owns it, when it last ran, what business process depends on it, and whether that process still exists. Estates past about a hundred interfaces almost never have this, and the gaps are where the risk sits \u2014 an interface running nightly against a system nobody knew was still in scope.\n\nThe inventory typically produces three piles: interfaces worth keeping and bringing to standard, duplicates and dead flows to retire, and a set that should become one reusable API or event consumed by several teams.\n\nActing on the second and third piles usually frees more delivery capacity than the first year of new build would consume, and it is the only reliable way to make the estate smaller rather than larger.',
      },
      {
        q: 'How do you decide between an API, an event and a file?',
        a: 'By what the consumer needs and what the failure mode should be, not by what is fashionable.\n\nAn API when the caller needs an answer to proceed and can tolerate the dependency on the provider being up. An event when the producer should not know who consumes it, when several consumers want the same fact, or when the consumer may be offline and must catch up. A queue when a message must be processed exactly once and ordering matters. A file when the volume is large, the window is scheduled, and the partner has been sending files for fifteen years.\n\nFile and batch are not legacy failings. They remain the correct answer for high-volume periodic exchange, and replacing a working nightly file with a real-time stream because real-time sounds modern is one of the more expensive mistakes in this category.',
      },
      {
        q: 'Do you support hybrid and multi-cloud environments?',
        a: 'Yes, and we design for hybrid as a permanent condition rather than a transition state.\n\nMost enterprises have workloads that will not move \u2014 for latency, data residency, licensing, regulatory or plain economic reasons \u2014 and an architecture that assumes everything eventually lands in one cloud will be wrong for its entire life.\n\nThe practical work is secure connectivity between environments, identity and token exchange across trust boundaries, data residency handling where regulation dictates where a payload may travel, and a deployment model where the same integration can run in more than one place without being rewritten.\n\nMulti-cloud integration is genuinely harder than the marketing suggests, mainly because identity and networking differ more between providers than compute does.',
      },
      {
        q: 'How long does partner onboarding take, and why is it always slow?',
        a: 'It is slow because most organizations treat each partner as an engineering project rather than as a repeatable operation.\n\nTypical is six to eight weeks. Templated properly it is five to ten days: standard document maps per transaction type, a partner profile capturing their variations, a validation harness that tests their sample files before anyone writes code, and an onboarding runbook operations can execute without engineering.\n\nThe variation is real \u2014 partners deviate from X12 and EDIFACT constantly \u2014 but the deviations repeat. Once you have onboarded thirty partners, the thirty-first is almost never novel, and if it still takes six weeks the problem is process rather than protocol.',
      },
      {
        q: 'How does integration support AI agents?',
        a: 'By giving them the same governed interfaces every other client uses, and nothing more.\n\nAn agent that reaches enterprise systems through permissioned APIs and events inherits the existing controls: authentication, scoped authorization, rate limits, audit logging and tracing. Every action it takes is attributable and replayable, and the security model does not need a separate conversation.\n\nAn agent that reaches them by driving a screen because nobody built the interface produces fast actions nobody can evidence \u2014 which in a regulated process is worse than the slow version, and is a finding waiting to be written.\n\nSo the sequencing matters more than the model choice. Expose the capability properly, permission it, then let agents consume it. Enterprises that run it in the other order arrive at an audit with an access model nobody can explain.',
      },
      {
        q: 'What does an integration engagement cost?',
        a: 'We are pre-launch and do not publish rate cards, so treat this as shape rather than a quote.\n\nThe estate assessment is fixed-price and measured in weeks, scoped so you can stop after it and own the output. Architecture and roadmap is priced against the assessment. Engineering is priced against the architecture, which is why we prefer not to quote a build before the design exists \u2014 the estimate would be a guess and both sides would discover that in month three.\n\nPlatform licensing is a separate line and goes to the vendor. Where existing entitlements cover the work we will say so, and that is more often than vendors volunteer \u2014 unused API management and integration capability inside Microsoft, Oracle and ServiceNow estates is extremely common.',
      },
      {
        q: 'How is this different from your API and microservices service?',
        a: 'Different question, deliberately kept apart so neither page pretends to be both.\n\nThis service is about how systems reach each other: the estate, the fabric, the orchestration between platforms, partner connectivity and the governance over all of it. The unit of work is an interface between two things you already run.\n\nAPI and microservices engineering is about how an individual API or service is designed, versioned, documented and productized \u2014 the contract, the developer experience, the decomposition of an application into services. The unit of work is the service itself.\n\nIn practice they meet: integration architecture decides which capabilities should become APIs, and API engineering decides what those APIs look like. If you are not sure which you need, the estate assessment answers it and is the cheapest way to find out.',
      },
      {
        q: 'How do you measure whether the integration program worked?',
        a: 'Against four numbers captured before anything is built, and reported afterwards whether or not they flatter us.\n\nIntegration velocity: how long a new integration takes from design to production. Reuse rate: what share of new work is assembled from existing APIs, events and connectors rather than built fresh. Interface rationalization: how many point-to-point interfaces were retired without losing a business flow. Partner onboarding: days from agreement to live transactions.\n\nEach is countable and each has an owner. What we will not put on this page is a reliability percentage or a speed multiple, because neither is falsifiable without naming the estate it came from \u2014 and at this level of buyer, an unfalsifiable number reduces credibility rather than building it.',
      },
    ],

    // ── How we engage ───────────────────────────────────────────────────────
    // The first package is an assessment of an estate that already exists,
    // ahead of any build offer. Almost nobody arrives saying "we want
    // integrations" -- they arrive saying a change took six months, or a
    // partner took eight weeks to onboard, or nobody can say what breaks.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five engagement models,',
    engagementHeadingHighlight: 'one architecture underneath.',
    engagementLede: 'Most groups arrive with an estate rather than a project. The useful first engagement is usually a map of what is already connected, not a proposal to connect more.',
    servicePackages: [
      {
        name: 'Integration Estate Assessment',
        description: 'What is connected to what, who owns it, what it costs, and which of it should be retired rather than migrated. Frequently ends recommending less integration than you came for, because a meaningful share of most estates is duplicate flows built by teams who could not find the existing one.',
        deliverables: [
          'Full interface inventory with ownership and criticality',
          'Dependency and blast-radius map across applications',
          'Point-to-point duplication and reuse-opportunity analysis',
          'Platform and iPaaS evaluation with a scored recommendation',
          'Retain, reuse, refactor, replatform, replace or retire call per interface',
        ],
      },
      {
        name: 'Integration Architecture & Roadmap',
        description: 'The design work your estate inherits for a decade: target architecture, canonical models, interface standards, and the sequencing that decides what gets built first. The sequencing matters more than it sounds \u2014 the first three interfaces establish the patterns everything after them copies, whether or not anyone intended that.',
        deliverables: [
          'Target-state integration architecture and reference patterns',
          'Canonical data model and interface contract standards',
          'Integration operating model with named ownership',
          'Governance framework covering security, lifecycle and observability',
          'Sequenced roadmap with a business case per wave',
        ],
      },
      {
        name: 'Integration Engineering',
        description: 'Delivery against your platform and your standards \u2014 APIs, events, messaging, transformations, orchestration and partner connections. Where standards do not exist yet, establishing them is part of the first engagement rather than an afterthought, because a reusable layer built without them is just point-to-point with better tooling.',
        deliverables: [
          'API, event and messaging implementation to documented standards',
          'Data transformation, mapping and synchronization',
          'Process orchestration with designed exception and replay paths',
          'Reusable connector and component library',
          'Test harness and contract tests per interface',
        ],
      },
      {
        name: 'Modernization & Migration',
        description: 'Moving off an ESB out of support, consolidating platforms after an acquisition, or retiring point-to-point sprawl. Rarely a straight port, and usually smaller than the estate suggests once dead flows and duplicates are removed from the migration scope rather than carried into it.',
        deliverables: [
          'Migration assessment with per-interface complexity scoring',
          'Rebuild-versus-port decision per integration',
          'Interfaces replaced by reusable APIs and events',
          'Parallel run with transaction-level output comparison',
          'Decommissioning of the old estate with retained evidence',
        ],
      },
      {
        name: 'Managed Integration Operations',
        description: 'Running the estate under a service level: monitoring, incident response, partner onboarding and the change queue. For teams who want the fabric without carrying a platform team for it, or who need cover while they build one. Your interfaces must remain operable by your own people either way.',
        deliverables: [
          'Round-the-clock flow monitoring with transaction tracing',
          'Incident response and replay within agreed response times',
          'Trading partner onboarding as a managed service',
          'Change requests through a governed release cycle',
          'Monthly reporting on volumes, failures, reuse and cost per flow',
        ],
      },
    ],

    // ── Industry ────────────────────────────────────────────────────────────
    // Six sectors. Each headline names the specific interoperability constraint
    // in that sector -- clinical standards in healthcare, settlement windows in
    // banking, carrier networks in logistics -- rather than restating the
    // capability list with a sector word attached.
    industryHeading: 'Enterprise Integration Platform',
    industryHeadingHighlight: 'by industry.',
    industryLede: 'Six sectors, and the interoperability constraint that decides what an integration architecture there actually has to solve.',
    industryUseCases: [
      {
        industry: 'Financial Services',
        headline: 'Payment and settlement windows are fixed by the network, not by your release calendar, so an integration failure has a deadline attached and a regulator on the other side of it. Nothing else on this list has that property.',
        items: [
          'Core banking and ledger integration',
          'Payment rails, clearing and settlement flows',
          'Card, wallet and merchant acquiring interfaces',
          'Regulatory reporting and risk data aggregation',
          'Open banking and PSD2 API compliance',
          'KYC, screening and onboarding system integration',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Interoperability is a published standard rather than a design choice, and the clinical systems will not be modified to suit you. HL7 and FHIR conformance is the entry ticket; the real work is the local variation every provider has layered on top of them.',
        items: [
          'HL7 v2 and FHIR clinical interoperability',
          'EHR and patient administration integration',
          'Laboratory, pathology and imaging interfaces',
          'Pharmacy, e-prescribing and formulary flows',
          'Payer eligibility, claims and remittance exchange',
          'Consent, identity and records-access controls',
        ],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'Plant systems run on their own clock and their own protocols, and the network between them is not always there. Integration has to buffer, tolerate disconnection and never assume the shop floor will wait for a cloud service to answer.',
        items: [
          'ERP to MES and shop-floor integration',
          'OT-to-IT data flows across the plant boundary',
          'IoT telemetry ingestion and edge buffering',
          'Historian, SCADA and asset system interfaces',
          'Supplier onboarding and purchase order exchange',
          'Quality, traceability and batch record flows',
        ],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Order, inventory and fulfillment must agree in near real time across channels that were each bought separately.',
        items: [
          'Commerce platform and order management integration',
          'Real-time inventory and availability synchronization',
          'Payment, refund and settlement flows',
          'Fulfillment, shipping and returns orchestration',
          'Marketplace and third-party seller connectivity',
          'Product, pricing and promotion data distribution',
        ],
      },
      {
        industry: 'Logistics & Supply Chain',
        headline: 'Most of the estate belongs to carriers and customs authorities who follow their own formats and change them without notice. You have no influence over either, so resilience and rapid partner re-onboarding matter more than elegance.',
        items: [
          'TMS, WMS and ERP integration',
          'Carrier rate, booking and tender exchange',
          'Customs, port and border authority filings',
          'Track-and-trace event streaming',
          'Proof of delivery and exception handling',
          'Freight invoice and settlement reconciliation',
        ],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'Asset and field systems were engineered for decades of service life, long before anything expected them to expose an interface.',
        items: [
          'Asset management and work order integration',
          'Field operations and mobile workforce flows',
          'Metering and head-end system interfaces',
          'SCADA and historian data integration',
          'Outage, network and GIS system exchange',
          'Market participant and regulatory submissions',
        ],
      },
    ],

    // ── The argument ────────────────────────────────────────────────────────
    // Not "before us / after us". Both columns describe interfaces built by
    // competent engineers to a real requirement. They differ on whether anyone
    // designed the estate, which is a governance and architecture question
    // rather than a technology one -- and it is the whole thesis of the page.
    comparisonTable: {
      eyebrow: 'HOW INTEGRATION ESTATES GO WRONG',
      heading: 'Connecting Systems, or Architecting an Estate.',
      lede: 'Both columns describe interfaces built competently against a real requirement. They differ on what happens the fifth time somebody needs the same data.',
      beforeLabel: 'INTEGRATION AS INTERFACES',
      afterLabel: 'INTEGRATION AS ARCHITECTURE',
      afterBadge: 'KANGQORE',
      beforeShort: 'INTERFACES',
      afterShort: 'ARCHITECTURE',
      rows: [
        {
          dimension: 'The fifth time somebody needs the same data',
          before: 'A fifth interface, because finding and trusting the existing four costs more than writing a new one. The estate grows faster than the business does.',
          after: 'A published API or event somebody already owns, with a contract and a consumer list, so the fifth team consumes rather than builds.',
        },
        {
          dimension: 'When one system changes',
          before: 'Nobody can say with confidence what else breaks. The change is deferred, or it ships and something unrelated fails in production a week later.',
          after: 'Dependency mapping and versioned contracts make the blast radius knowable before the change, and consumers are notified rather than surprised.',
        },
        {
          dimension: 'Who owns an interface',
          before: 'The person who built it, until they move team. After that it runs unowned until it fails, and then it is nobody\u2019s to fix.',
          after: 'Every interface has a named owner, a lifecycle stage and a retirement date, recorded where an operations team can see it.',
        },
        {
          dimension: 'When a transaction goes missing',
          before: 'Each team checks its own logs and concludes the problem is upstream. Resolution takes days and usually ends in a manual re-entry.',
          after: 'Distributed tracing follows the transaction across every hop, so the failing step is identified in minutes and replayed rather than retyped.',
        },
        {
          dimension: 'Onboarding a new trading partner',
          before: 'An engineering project each time, quoted in weeks, because every partner is treated as a new problem.',
          after: 'A templated onboarding with partner profiles, standard document maps and a validation harness \u2014 measured in days, run by operations.',
        },
        {
          dimension: 'What happens when AI wants access',
          before: 'Agents are pointed at whatever interface exists, or at the screen when none does, outside the controls the rest of the estate is held to.',
          after: 'Agents consume the same governed APIs and events as any other client, with scoped permissions and a traceable record of what they did.',
        },
      ],
    },

    // ── Architecture ────────────────────────────────────────────────────────
    // Five layers because the template renders architectureNodes as a
    // four-column grid unless the array is exactly five. The supplied six-layer
    // model compresses cleanly: Enterprise Outcomes is what the other five
    // produce rather than a layer, so it belongs in the outcomes section, where
    // it is measured rather than asserted.
    //
    // Governance is drawn as the last layer rather than a sidebar because that
    // is the argument -- it spans the others and is designed in, not added.
    architectureEyebrow: 'THE INTEGRATION ARCHITECTURE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Systems to Governance.',
    architectureLede: 'Five layers. The first is what you already run, the last is what makes the middle three safe to depend on, and every enterprise that skipped the last one is now paying for it.',
    architectureNodes: [
      {
        title: 'Enterprise Systems',
        icon: 'Database',
        description: 'What you already run and mostly are not replacing: ERP, CRM, HCM, supply chain, finance, the data estate, the SaaS portfolio that grew by department, and the applications nobody wants to touch. This layer is a given rather than a design choice, and an architecture that assumes it will be rationalized first will never ship.',
        features: [
          'ERP, CRM, HCM and supply chain platforms',
          'Finance and treasury systems',
          'Legacy and mainframe applications',
          'SaaS portfolio and departmental tools',
          'Data platforms and operational stores',
        ],
      },
      {
        title: 'Integration Fabric',
        icon: 'Network',
        description: 'How those systems reach each other. Synchronous APIs, asynchronous events and guaranteed messaging solve different problems, and most brittle estates are brittle because one mechanism was used for all three. Getting this layer right is what turns a dependency for every pair of systems into a contract each system publishes once.',
        features: [
          'APIs and gateway policy enforcement',
          'Event streaming and topic design',
          'Enterprise messaging and queues',
          'Connectors, adapters and iPaaS',
          'B2B, EDI and partner transport',
        ],
      },
      {
        title: 'Orchestration',
        icon: 'Settings',
        description: 'Where a business process that crosses six systems is made to complete correctly \u2014 including deciding what happens when step four fails after step three already committed. Distributed work does not roll back the way a single database does, so compensation, replay and idempotency are design decisions rather than error handling.',
        features: [
          'Process and workflow orchestration',
          'Business rules and decision logic',
          'Multi-system transaction coordination',
          'Compensation and replay on failure',
          'Human-in-the-loop steps and approvals',
        ],
      },
      {
        title: 'Intelligence',
        icon: 'BrainCircuit',
        description: 'Anomaly detection, predictive operations, assisted mapping, and agents consuming the estate through the same governed interfaces as any other client rather than around them. This layer is genuinely useful and genuinely optional \u2014 it improves an architecture that exists and cannot substitute for one that does not.',
        features: [
          'Anomaly detection across flows',
          'Predictive and self-healing operations',
          'AI-assisted mapping and documentation',
          'Agent access through permissioned APIs',
          'Decision traceability and replay',
        ],
      },
      {
        title: 'Governance',
        icon: 'ShieldCheck',
        description: 'Identity, policy, lifecycle, observability and compliance across every layer above. Designed in from the first interface, because retrofitting it across a live estate is materially harder than starting with it, and because the questions it answers \u2014 who owns this, what breaks if it changes, where did that transaction go \u2014 are asked during incidents rather than during design.',
        features: [
          'Identity, access and token management',
          'Policy enforcement and rate limiting',
          'Interface lifecycle and ownership',
          'Distributed tracing and audit evidence',
          'SLA reporting and cost attribution',
        ],
      },
    ],

    capabilitiesLabel: 'ENTERPRISE INTEGRATION PLATFORM SERVICES',
    capabilitiesSectionTitle: 'Enterprise Integration Platform',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Assess the estate, decide the architecture, consolidate what accumulated, engineer the connections, govern them as one capability, and run them afterwards if you would rather not.',
    capabilityAreas: [
      {
        title: 'Gen AI-Powered Platform Consulting',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'AI pointed at the integration estate rather than sold as an outcome. Reading a decade of undocumented interfaces is exactly the work a model is good at, and exactly the work nobody has budget to do by hand.',
        items: [
          'AI-Assisted Integration Landscape Discovery',
          'Automated Interface Inventory & Classification',
          'Dependency Extraction From Code and Config',
          'Opportunity Scoring by Volume, Risk and Reuse',
          'Intelligent Schema & Field Mapping',
          'Transformation Logic Generation',
          'Integration Documentation Generation',
          'Duplicate and Near-Duplicate Flow Detection',
          'Cost-Benefit Modeling per Candidate',
          'Migration Impact Analysis',
          'Model Output Validation & Human Review',
          'Sequenced Recommendation, Not a Backlog Dump',
        ],
      },
      {
        title: 'Enterprise Integration Strategy',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Deciding what to connect and how, before anything is connected. The architecture you set here is what a decade of interfaces inherits, and it is the only stage where changing your mind is still free.',
        items: [
          'Enterprise Integration Strategy & Vision',
          'Current-State Integration Assessment',
          'Target-State Integration Architecture',
          'Integration Reference Patterns',
          'iPaaS & API Platform Evaluation',
          'Integration Maturity Assessment',
          'Application Dependency Mapping',
          'Canonical Data & Interface Contract Models',
          'Architecture Standards & Design Principles',
          'Business Case & Investment Prioritization',
          'Integration Roadmap & Wave Sequencing',
          'Integration Operating Model & Ownership',
        ],
      },
      {
        title: 'Integration Optimization & Consolidation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Most estates carry a decade of interfaces, scripts and adapters nobody owns. Deciding what to retain, reuse, refactor, replatform, replace or retire frees more of your delivery capacity than the next twenty builds would consume.',
        items: [
          'Integration Estate Discovery & Inventory',
          'Dependency & Blast-Radius Mapping',
          'Point-to-Point Rationalization',
          'Duplicate Flow Consolidation',
          'Interface Ownership Assignment',
          'Middleware & ESB Modernization',
          'iPaaS Migration & Platform Consolidation',
          'API Enablement of Legacy Interfaces',
          'Event-Driven Re-Architecture',
          'Technical Debt Reduction Planning',
          'Parallel Run & Cutover Validation',
          'Decommissioning With Retained Evidence',
        ],
      },
      {
        title: 'Industry-Based Integration Solutions',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where the standard is published by somebody else and conformance is the entry ticket. The engineering is rarely the hard part; the local variation every organization has layered on top of the standard is.',
        items: [
          'HL7 v2 & FHIR Clinical Interoperability',
          'ISO 20022 & SWIFT Payment Messaging',
          'X12 & EDIFACT Trading Standards',
          'OPC-UA & Industrial Protocol Bridging',
          'GS1, EPCIS & Supply Chain Standards',
          'Open Banking & PSD2 API Conformance',
          'Regulatory Reporting Interface Design',
          'Sector Reference Data & Code Set Handling',
          'Conformance Testing & Certification Support',
          'Local Variation & Profile Management',
          'Standards Version Migration',
          'Interoperability Assurance & Validation',
        ],
      },
      {
        title: 'Next Gen Center of Excellence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The capability that outlives the program. Most integration investment fails here rather than in delivery: the first dozen interfaces succeed, and nothing exists to carry the next hundred to the same standard.',
        items: [
          'Integration CoE Design, Charter & Operating Model',
          'Intake, Prioritization & Demand Management',
          'Reusable Asset & Component Library',
          'Interface Standards, Templates & Patterns',
          'API Product Ownership Model',
          'Low-Code & Citizen Integrator Governance',
          'AI Usage Standards Inside the Estate',
          'Architecture Review & Design Authority',
          'Practitioner Training & Certification',
          'Reuse Measurement & Incentives',
          'CoE Maturity Assessment & Advancement',
          'Federated Delivery Across Business Units',
        ],
      },
      {
        title: 'Implementation & Engineering Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The build itself, across every mechanism the estate needs. APIs, events and messaging solve different problems, and most brittle estates are brittle because one mechanism was used for all three.',
        items: [
          'API-Led Connectivity & Gateway Implementation',
          'Event-Driven Architecture & Stream Design',
          'Message-Oriented Middleware & Queueing',
          'Guaranteed Delivery, Ordering & Idempotency',
          'Schema Registry & Contract Management',
          'Data Transformation, Mapping & Validation',
          'Change Data Capture & Synchronization',
          'Business Process Orchestration',
          'Saga & Compensation Pattern Implementation',
          'ERP, CRM, HCM and Supply Chain Integration',
          'Legacy, Mainframe & Packaged Software Adapters',
          'Hybrid, Multi-Cloud & On-Premises Connectivity',
          'Contract Testing & Release Automation',
          'Proof of Concept & Reference Implementation',
        ],
      },
      {
        title: 'Operations & Customer Value Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Once your business processes depend on it, the integration layer is production infrastructure. Platform dashboards report that a flow ran; only tracing tells you a payload entered at one end and never arrived at the other.',
        items: [
          'Runtime Monitoring & Proactive Alerting',
          'Distributed Transaction Tracing',
          'Failure Detection, Replay & Recovery',
          'Incident Response & On-Call Runbooks',
          'Performance & Throughput Engineering',
          'Capacity Planning & Scaling',
          'Identity, Access & Token Management',
          'Policy Enforcement, Encryption & Rate Limiting',
          'Interface Lifecycle & Version Retirement',
          'Audit Logging & Compliance Evidence',
          'SLA Definition & Service Reporting',
          'Integration FinOps & Cost Attribution',
        ],
      },
      {
        title: 'Agent Integration Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Agents reaching your enterprise systems through permissioned APIs and events inherit every control the estate already enforces. Agents driving screens because nobody built the interface inherit none of them, and that is what an auditor will ask about.',
        items: [
          'Agent Access Through Governed APIs',
          'Tool & Action Permissioning',
          'Scoped Credentials & Agent Identity',
          'Goal-Driven Workflow Orchestration',
          'Multi-Agent Coordination Across Systems',
          'CRM, ERP, HCM, SCM and CX Agent Interfaces',
          'Autonomy Levels & Escalation Thresholds',
          'Human Approval & Handback Points',
          'Decision Traceability & Replay',
          'Anomaly Detection on Agent Behavior',
          'Simulation Before Live Execution',
          'Kill Switches & Rollback Paths',
        ],
      },
      {
        title: 'B2B Platform as a Service',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Partner connectivity run as a managed service on your platform rather than a hosted product of ours, because we do not operate one and will not imply otherwise. Onboarding is the deliverable: the thirty-first partner should never cost what the first one did.',
        items: [
          'B2B & EDI Architecture on Your Platform',
          'Trading Partner Onboarding as a Managed Service',
          'Partner Profile & Agreement Management',
          'Standard Document Map Libraries',
          'Sample-File Validation Harness',
          'AS2, SFTP & Secure Transport Operations',
          'Document Transformation & Enrichment',
          'Transaction Validation & Acknowledgment',
          'Non-Repudiation & Audit Trail',
          'Partner Transaction Monitoring & Alerting',
          'Exception Handling & Partner Communication',
          'Onboarding Runbooks Your Operations Team Can Run',
        ],
      },
    ],

    midCta: 'Every interface you add is a dependency somebody has to remember.',
    midCtaLabel: 'Map One Integration Estate',
    closingCta: {
      title: 'One estate,',
      highlight: 'mapped and costed.',
      body: 'Show us what is connected to what. In 30 minutes we will tell you where the point-to-point sprawl is, which interfaces nobody owns, what a reusable layer would remove, and whether the platform you are being sold is larger than the problem \u2014 before anything is built.',
      proofLabel: 'From first call to a mapped integration estate',
    },
  },

  'pimcore': {
    slug: 'pimcore',
    name: 'Pimcore',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Pimcore PIM/DAM implementation and customization',
    fullDescription: 'Implement Pimcore for product information management and digital asset management.',
    keyFeatures: ['PIM implementation', 'DAM setup', 'Data modeling', 'Integration', 'Custom development'],
    relatedServiceSlugs: ['enterprise-integration-platform', 'supply-chain'],
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
    relatedServiceSlugs: ['enterprise-integration-platform', 'cdp-strategy', 'servicenow'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  },

  'servicenow': {
    slug: 'servicenow',
    name: 'ServiceNow',
    departmentSlug: 'platforms',
    bannerBrand: 'ALIS™',
    shortDescription: 'Building on ServiceNow so the platform still upgrades cleanly in year five',
    fullDescription: 'Advisory, implementation and managed operations across the Now Platform — built close to baseline, so your instance still upgrades in year five.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['ITSM', 'ITOM & CMDB', 'ITAM', 'SecOps & IRM', 'HRSD & CSM', 'App Engine', 'Upgrade health'],
    relatedServiceSlugs: ['enterprise-integration-platform', 'business-process-management', 'it-security-services'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    lastReviewed: '2026-08-24',

    // ── Positioning ──────────────────────────────────────────────────
    // 584 bytes on the Platforms parity default: five keyFeatures, one sentence
    // of description, and a crawler seeing 2 per cent of the page. 25/40.
    //
    // Every large SI leads their ServiceNow page with the same three things --
    // partner tier, awards, and a satisfaction score. Tech Mahindra's opens
    // with Elite Partner, a Global Partner Award, CSAT 4.9/5 and an ISG Leader
    // placement, then names five pieces of industry IP. Accenture, Infosys and
    // Wipro run the same shape. That page is a credentials page, and it works
    // because those credentials are real.
    //
    // Kangqore has none of them. No partner tier, no awards, no named clients.
    // Competing on that axis is not available, and implying it would be the
    // fastest way to lose a buyer who checks the ServiceNow partner finder in
    // about forty seconds. So this page competes on the argument instead, and
    // FAQ 01 answers the partner-tier question directly rather than hoping it
    // does not come up.
    //
    // The wedge is the cost nobody quotes. ServiceNow ships two family releases
    // a year. Every customization outside the platform model is a thing that
    // has to be retested, and often reworked, on that cadence -- so a build
    // decision made in month three is a bill that arrives twice a year for as
    // long as the instance lives. Partners paid by the implementation hour have
    // no reason to say this, and the second-order effect is the one that
    // actually hurts: instances fall behind, drop out of the support window,
    // and need a remediation project to get current again.
    //
    // Underneath that sits the CMDB, which everything else depends on -- ITOM,
    // SecOps, impact analysis, asset management -- and which almost nobody
    // owns. Outcomes are therefore upgrade lag, baseline ratio, CMDB health and
    // license utilization. Not MTTR and ticket deflection, which every partner
    // quotes and which move for reasons unrelated to the platform.
    heroTitle: 'ServiceNow Implementation That\nSurvives the Next Upgrade',
    heroBadge: 'Close to Baseline. Current. Owned.',
    heroStripItems: [
      'ITSM', 'ITOM & Discovery', 'CMDB & CSDM', 'IT Asset Management',
      'SecOps & IRM', 'HR & Workplace', 'App Engine', 'Upgrade Health',
    ],
    hidePartnershipModel: true,

    whatIsEyebrow: 'What a ServiceNow program actually costs',
    whatIsTitle: 'Every Customization Is a Bill',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'You Pay Twice a Year.',
    whatIsPara2: 'ServiceNow ships two family releases a year. That cadence is the single most important fact about building on it, and it is the one most implementation plans treat as somebody else’s problem. Anything you build inside the platform model comes along for the ride. Anything built outside it — a rewritten workflow engine, a form doing something the form was not meant to do, a scoped app quietly reimplementing a baseline table — has to be retested and often reworked, every six months, for as long as the instance lives.',
    whatIsPara3: 'That is why so many instances are three or four families behind. Each upgrade looked expensive, each one got deferred, and eventually the instance dropped out of the support window and the catch-up became a project of its own. By then the original build team has moved on, nobody can say why a given customization exists, and the safest-looking option is to leave it alone — which is how a platform bought for agility becomes the thing nobody dares touch.',
    whatIsPara4: 'Kangqore builds close to baseline and says no to the rest, in writing, with the reason recorded. Where a customization genuinely earns itself we build it inside the platform model so it upgrades, and we log what it costs to carry. Underneath all of it we treat the CMDB as the dependency it actually is — ITOM, security operations, impact analysis and asset management are all only as good as it is — with a named owner and a discovery cadence rather than a spreadsheet somebody refreshes before an audit.',

    // ── Outcomes ────────────────────────────────────────────────────
    // Not MTTR, ticket deflection or CSAT. Every partner page quotes those,
    // they move with staffing and demand as much as with the platform, and none
    // of them tells you whether the instance is healthy.
    //
    // These four do. Each is visible in the instance itself, each can be read
    // before the engagement starts, and each degrades quietly if the build was
    // wrong.
    outcomesEyebrow: 'WHAT DECIDES WHETHER AN INSTANCE STAYS HEALTHY',
    outcomesHeading: 'Four numbers your platform owner',
    outcomesHeadingHighlight: 'is actually judged on.',
    businessMetrics: [
      { illustrative: true, title: 'Upgrade Lag',         desc: 'Family releases behind current, held inside the supported window so upgrades stay routine maintenance rather than becoming their own remediation project.',                value: '0–1', suffix: ' Behind', metricLabel: 'Family Releases Behind', icon: 'TrendingUp' },
      { illustrative: true, title: 'Baseline Ratio',      desc: 'Share of processes running on baseline configuration rather than custom code, which is the number that predicts what every future upgrade will cost you.',              value: '85', suffix: '%',       metricLabel: 'Running Out of the Box',  icon: 'ShieldCheck' },
      { illustrative: true, title: 'CMDB Health',         desc: 'Business-critical services with a discovered, owned and current configuration record — the dependency that ITOM, SecOps and impact analysis all quietly rest on.',      value: '95', suffix: '%',       metricLabel: 'Critical Services Mapped', icon: 'Database' },
      { illustrative: true, title: 'License Utilization', desc: 'Fulfiller seats and activated SKUs actually in use. Unused entitlement is the cheapest money on the table and the last thing an hourly implementation partner looks for.', value: '30', suffix: '%',      metricLabel: 'Unused Entitlement Found', icon: 'Target' },
    ],

    // ── Engagement outcomes ────────────────────────────────────────
    // Overridden rather than left on the parity default, which invents a client
    // called "Global Enterprise Organization" and asserts "100% operational
    // reliability". Both scenarios say what they are in the descriptor and
    // again in the body.
    outcomeCard: {
      illustrative: true,
      metric: '4 → 0',
      metricLabel: 'family releases behind',
      industry: 'Modeled scenario — financial services, ~9,000 fulfillers',
      problem: 'An instance two years out of the support window, with 140 customizations nobody could justify and an upgrade everyone had learned to defer.',
      outcome: 'Customizations triaged into keep, rebuild-inside-the-model and retire, then two upgrades run back to back. Figures are modeled from typical remediation profiles, not measured on a named client.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '1,400 seats',
      metricLabel: 'of unused entitlement found',
      industry: 'Modeled scenario — manufacturing group, multi-region instance',
      problem: 'Fulfiller licenses provisioned during a rollout that finished eighteen months earlier, plus two SKUs activated for a pilot that never went live.',
      outcome: 'Entitlement reconciled against actual usage before renewal rather than after it. Modeled figures, shown to convey the shape of the work rather than a specific engagement.',
    },

    // ── Capability areas ───────────────────────────────────────────
    // Eight, and the boundary matters more here than on almost any other page
    // because ServiceNow touches every practice Kangqore already sells. Five
    // rich pages already reference it, so each seam is stated on the card
    // rather than claimed twice:
    //   - process design and value-stream work -> business-process-management
    //   - case-management applications -> digital-process-automation
    //   - the security program behind SecOps and IRM -> it-security-services
    //   - integration architecture beyond IntegrationHub -> enterprise-integration-platform
    //   - the HR operating model behind HRSD -> talent-organization
    //   - release testing strategy and ATF suites -> quality-engineering-assurance
    //   - model governance behind Now Assist -> ai-governance
    // What is left is the platform itself, which is what this page is for.
    //
    // Bento slots: 01 opens tall, 06 takes width, and 08 closes full width
    // because platform health is the argument the whole page is built on.
    capabilitiesLabel: 'SERVICENOW PLATFORM SERVICES',
    capabilitiesSectionTitle: 'ServiceNow',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Eight areas across the Now Platform — advisory through managed operations, roughly a hundred named services, and the seven seams where another Kangqore practice takes the work on.',
    capabilityAreas: [
      {
        title: 'ServiceNow Advisory & Platform Strategy',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'What to put on the platform, what to keep off it, and which SKUs you are paying for without using. Licensing shapes every architecture decision that follows, and an implementation partner billing by the hour has no reason to raise it — so we do it first, before anything is designed.',
        items: [
          'Platform Strategy and Target Architecture',
          'License and Entitlement Review',
          'SKU Rationalization Before Renewal',
          'Fulfiller Seat Modeling',
          'Instance Strategy and Domain Separation',
          'Build-Versus-Baseline Decision Framework',
          'Platform Roadmap and Release Planning',
          'Consulting & Roadmap',
          'Consulting and Roadmap Definition',
          'Strategic Portfolio Management (SPM)',
          'Demand and Idea Management',
          'Design Thinking for Service Experience',
          'Business Case and Benefit Baselining',
          'Vendor and Partner Landscape Review',
          'Governance and Demand Intake Design',
          'Platform Operating Model',
          'Total Cost of Ownership Modeling',
          'Readiness Assessment Before a Module Purchase',
        ],
      },
      {
        title: 'ITSM & Service Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Incident, request, change and problem, configured close to baseline. The process design behind them belongs to business process management.',
        items: [
          'IT Services & Operations Management',
          'Incident and Major Incident Management',
          'Request Management and Service Catalog',
          'Change Enablement and CAB Automation',
          'Problem Management',
          'Knowledge Management',
          'Service Portal and Employee Center',
          'Virtual Agent and Deflection Design',
          'Service Level Management',
          'Walk-Up and Onsite Support',
          'Predictive Intelligence for Routing',
          'Reporting, Dashboards and Performance Analytics',
          'ITIL and ISO 20000 Alignment',
          'Baseline-First Configuration Standards',
        ],
      },
      {
        title: 'ITOM, Discovery & the CMDB',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The dependency everything else rests on. A CMDB without an owner and a discovery cadence is a record of what was true once.',
        items: [
          'CMDB Design Against CSDM',
          'Discovery Design and Credential Strategy',
          'Service Mapping for Critical Services',
          'CMDB Health Dashboards and Remediation',
          'Data Ownership and Stewardship Model',
          'Duplicate and Orphan CI Cleanup',
          'Cloud and Container Discovery',
          'Event Management and Alert Correlation',
          'AIOps and Anomaly Detection',
          'Orchestration and Runbook Automation',
          'Certification and Reconciliation Rules',
          'Third-Party Data Source Integration',
          'CMDB Refresh Cadence Written Into Operations',
        ],
      },
      {
        title: 'IT Asset Management & Software Spend',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Hardware and software asset management against a CMDB you can trust, so renewal starts from evidence rather than a vendor spreadsheet.',
        items: [
          'Software Asset Management',
          'Hardware Asset Management',
          'License Position and Entitlement Reconciliation',
          'SaaS License Management',
          'Publisher Pack Configuration',
          'Contract and Renewal Management',
          'Audit Defense Preparation',
          'Asset Lifecycle and Disposal',
          'Procurement and Request Integration',
          'Consumption and Chargeback Reporting',
          'Cloud Cost Visibility',
          'Shadow IT Discovery',
          'Reclaim and Redeployment Workflows',
        ],
      },
      {
        title: 'Security Operations & Integrated Risk',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'SecOps and IRM configured on the platform. The security program itself — threat modeling, testing, the response function — is a separate service.',
        items: [
          'Security Management',
          'Security Incident Response Configuration',
          'Vulnerability Response and Prioritization',
          'SIEM and Scanner Integration',
          'Configuration Compliance',
          'Governance, Risk and Compliance',
          'Policy and Compliance Management',
          'Risk Register and Assessment Workflows',
          'Control Testing and Evidence Capture',
          'Third-Party Risk Management',
          'Audit Management',
          'Business Continuity Management',
          'Regulatory Change Tracking',
          'Risk Reporting for Boards and Committees',
          'Segregation of Duties in Platform Roles',
        ],
      },
      {
        title: 'Enterprise Service Management & Workflows',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'ServiceNow organizes work into four workflow families — IT, employee, customer and platform. This area is the three beyond IT. The HR operating model behind HRSD, and the service design behind customer workflows, sit with our talent and organization and business process practices.',
        items: [
          'Enterprise Service Management Beyond IT',
          'Employee, Customer and Platform Workflows',
          'Shared Services Portal Consolidation',
          'HR Service Delivery and Case Management',
          'Onboarding and Transitions',
          'Employee Center and Journey Design',
          'Onboarding and Offboarding Orchestration',
          'HR Knowledge and Document Management',
          'Workplace Service Delivery',
          'Workplace Reservation and Space Management',
          'Customer Service Management',
          'Field Service Management',
          'Order Management and Fulfillment Workflows',
          'Legal and Finance Service Delivery',
          'Employee Data Privacy Configuration',
          'Multi-Language and Multi-Region Rollout',
          'Adoption Measurement, Not Portal Traffic',
        ],
      },
      {
        title: 'App Engine, Integrations & Custom Build',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Custom applications built inside the platform model, so they survive upgrades rather than blocking them.',
        items: [
          'Scoped Application Design and Build',
          'Custom Applications on App Engine',
          'App Engine Studio and Low-Code Governance',
          'Custom Table and Data Model Design',
          'Integration Management',
          'IntegrationHub Spokes and Flow Designer',
          'REST API',
          'REST, SOAP and MID Server Integration',
          'Third-Party Application Integration',
          'Data Synchronization Across Systems',
          'Import Set and Transform Map Design',
          'Update Set and Application Repository Strategy',
          'Automated Test Framework Suites',
          'Code Review and Development Standards',
          'Technical Debt Register for Customizations',
          'App Store',
          'ServiceNow Store Evaluation Before Building',
          'Citizen Development Guardrails',
          'Decommissioning Apps Nobody Uses',
        ],
      },
      {
        title: 'Platform Health, Upgrades & Managed Operations',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'The half of the ServiceNow lifecycle that decides the other half. Two family releases a year is not a maintenance detail — it is the cadence every build decision is measured against, and instances that defer it fall out of the support window and need a remediation project to get back. We run upgrades as routine work, keep a register of what each customization costs to carry, and operate the platform under a service level where you would rather not carry it yourself. The rule we hold everywhere applies here too: the instance has to stay operable by your own team.',
        items: [
          'Instance Health Assessment',
          'Upgrade Planning and Impact Analysis',
          'Skipped-Customization Triage',
          'Regression Testing and ATF Coverage',
          'Family Release Adoption on Cadence',
          'Patch and Hotfix Management',
          'Performance and Table Growth Management',
          'Instance Cloning and Sub-Production Strategy',
          'Technical Debt Reduction Programs',
          'Platform Team Enablement and Handover',
          'Center of Excellence & Innovation',
          'Center of Excellence Enablement',
          'Reusable Templates and Starter Kits',
          'Agile and SAFe Delivery Pods',
          'Delivery-as-a-Service',
          'Shared and Dedicated Delivery Models',
          'KPI and Outcome-Based Delivery',
          'Use-Case Repository and Reusable Assets',
          'Managed Platform Operations to Service Levels',
          'Release Governance and Change Control',
          'Exit Planning and Knowledge Transfer',
        ],
      },
    ],


    // ── Data boundary ─────────────────────────────────────────────
    // Page-scoped, and every statement here is a representation to an
    // enterprise buyer, so nothing is inherited by default. Sub-production
    // cloning is the item that belongs on a ServiceNow page specifically and
    // appears on almost no partner page: a clone copies production data into an
    // instance with a wider access list, and that is a disclosure most
    // organizations have never assessed.
    dataBoundary: {
      eyebrow: 'WHERE YOUR DATA ACTUALLY SITS',
      title: 'Four questions about your instance',
      titleHighlight: 'worth answering before an audit does.',
      lede: 'ServiceNow holds incident detail, employee cases, asset registers and, increasingly, HR records. Where that data lives, who can reach it, and what happens when somebody clones production are governance questions the implementation plan rarely covers.',
      blocks: [
        {
          label: 'Sub-production cloning',
          body: 'A clone copies production into an instance with a wider access list — developers, contractors and sometimes a partner. Unless clone data preservers and masking rules are configured deliberately, that is a disclosure of live incident, HR and asset data into a weaker control environment. It is the most common finding we raise and the cheapest to fix.',
        },
        {
          label: 'Instance topology and residency',
          body: 'Which datacenter pair your instances sit in, whether that satisfies the residency commitments you have made to customers and regulators, and what your contractual position is on data location. Worth confirming rather than assuming, particularly where HR or health-adjacent data has been added to the platform since the original agreement.',
        },
        {
          label: 'Who can read what',
          body: 'Admin rights handed out during a project and never withdrawn are the norm rather than the exception. Access control lists, domain separation where genuinely required, and a periodic recertification of elevated roles — because the platform accumulates administrators the way it accumulates scoped applications.',
        },
        {
          label: 'What leaves the platform',
          body: 'Integrations, exports, reporting extracts and any AI feature that sends content to a model endpoint. Each is a path out, each needs to be inventoried, and the ones nobody documented are usually reporting extracts built by a well-meaning analyst three years ago.',
        },
      ],
    },

    // ── Lifecycle ───────────────────────────────────────────────────
    // Five stages, one column each. Deliberately ends on Sustain rather than
    // Go-Live: on this platform the interesting half of the lifecycle starts
    // after the first release, which is the whole argument of the page.
    architectureEyebrow: 'THE PLATFORM LIFECYCLE',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Assess to Sustain.',
    architectureLede: 'Five stages, and the one that decides the outcome is the last. Most ServiceNow programs are funded through go-live and then surprised, twice a year, for the next decade.',
    architectureNodes: [
      {
        title: 'Assess',
        icon: 'Search',
        description: 'Read the instance before proposing anything. How far behind the current family it is, what has been customized and why, whether the CMDB can be trusted, and which entitlements are being paid for and not used.',
        features: [
          'Upgrade lag and support-window position',
          'Customization inventory with justification',
          'CMDB completeness and staleness',
          'License and SKU utilization',
          'Baseline set for every metric the work is judged on',
        ],
      },
      {
        title: 'Design',
        icon: 'Layers',
        description: 'Decide what runs on baseline, what genuinely earns a customization, and what should not be on the platform at all. Every exception is written down with the reason and the carrying cost.',
        features: [
          'Baseline-first configuration standard',
          'Documented exception register',
          'CMDB and CSDM data model',
          'Integration and instance topology',
          'Store evaluation before any custom build',
        ],
      },
      {
        title: 'Build',
        icon: 'Cpu',
        description: 'Engineered inside the platform model so it upgrades — scoped applications, update-set discipline, peer review, and ATF coverage written alongside the configuration rather than after it.',
        features: [
          'Scoped applications, not global hacks',
          'Update set and repository strategy',
          'Development standards and peer review',
          'Automated Test Framework suites',
          'Technical debt logged as it is created',
        ],
      },
      {
        title: 'Adopt',
        icon: 'Rocket',
        description: 'A portal nobody uses is a failed rollout with good uptime. Adoption is designed and measured, not announced — including the deflection targets that decide whether the license count was justified.',
        features: [
          'Catalog and portal experience design',
          'Fulfiller and end-user enablement',
          'Deflection and self-service measurement',
          'Hypercare with the build team attached',
          'Adoption measured, not assumed',
        ],
      },
      {
        title: 'Sustain',
        icon: 'Activity',
        description: 'Two family releases a year, taken on cadence. The stage that keeps the instance supportable, and the first one cut when a budget tightens — which is exactly how instances end up four families behind.',
        features: [
          'Upgrades run as routine, not as projects',
          'Customization carrying cost reviewed',
          'CMDB discovery cadence maintained',
          'Entitlement reconciled before renewal',
          'Platform team able to run it without us',
        ],
      },
    ],

    // ── The argument ──────────────────────────────────────────────
    // Both instances went live on time and both were signed off. The
    // difference shows up on the first upgrade, which is the only horizon on
    // which a platform build can honestly be judged.
    comparisonTable: {
      eyebrow: 'WHERE SERVICENOW INSTANCES QUIETLY DECAY',
      heading: 'Both went live on time.',
      lede: 'Neither column describes a failed implementation. They differ on the first upgrade, and then again on every one after it.',
      beforeLabel: 'BUILT TO GO LIVE',
      afterLabel: 'BUILT TO STAY CURRENT',
      afterBadge: 'KANGQORE',
      beforeShort: 'DELIVERED',
      afterShort: 'SUSTAINED',
      rows: [
        {
          dimension: 'When the next family release lands',
          before: 'The upgrade is scoped as a project, costed, and deferred. Two years later the instance is out of the support window and getting current is its own program.',
          after: 'Upgrades are routine maintenance because the build stayed close to baseline, and the exception register says exactly what needs retesting.',
        },
        {
          dimension: 'Why a customization exists',
          before: 'Nobody knows. The person who built it has left, the requirement was never written down, and it is safer to leave it than to ask.',
          after: 'Every exception carries a recorded reason, an owner and a carrying cost, reviewed each release so the register shrinks rather than grows.',
        },
        {
          dimension: 'What the CMDB is worth',
          before: 'Populated during the implementation, never refreshed, and quietly wrong — so ITOM, SecOps and impact analysis are all built on it and all unreliable.',
          after: 'Modeled against CSDM, populated by discovery on a cadence, with a named data owner and a health dashboard somebody is accountable for.',
        },
        {
          dimension: 'How the license bill is set',
          before: 'Fulfiller seats provisioned during rollout and never reconciled, plus SKUs activated for pilots that never launched.',
          after: 'Entitlement reconciled against real usage before renewal, with seat and SKU decisions made on evidence rather than on the account team’s forecast.',
        },
        {
          dimension: 'Where a new requirement goes',
          before: 'Straight into a custom build, because the platform makes it easy and nobody is asking whether the Store already has it.',
          after: 'Baseline first, Store second, custom third — and sometimes the honest answer is that it does not belong on ServiceNow at all.',
          link: { href: '/services/business-process-management', label: 'Process design' },
        },
        {
          dimension: 'Who can change what',
          before: 'Admin rights handed out during the project and never withdrawn, so production changes arrive from four teams with no shared standard.',
          after: 'Role-based platform governance, an intake process for demand, and update-set discipline that makes a change reviewable before it ships.',
        },
        {
          dimension: 'What happens when you leave',
          before: 'The partner holds the knowledge, the documentation is a handover deck, and the next change needs a statement of work.',
          after: 'Standards, exception register and runbooks in your repositories, and your platform team able to take the next release without us.',
        },
      ],
    },

    // ── Toolchain ─────────────────────────────────────────────────
    // Framed by what each product family is genuinely for and when it is not
    // worth its SKU, including the row no ServiceNow partner writes: the things
    // that should not be built on the platform at all. We hold no reseller
    // margin on any of this, which is the only reason that row is available.
    toolsStack: {
      eyebrow: 'THE PLATFORM',
      title: 'The ServiceNow product families,',
      titleHighlight: 'and what does not belong here.',
      subtitle: 'Module choice is mostly settled by what the enterprise agreement already covers and by whether the CMDB can support it. These are the defaults, what overrides them, and where the platform is the wrong home entirely.',
      items: [
        {
          icon: 'Settings',
          title: 'IT Service Management',
          managed: 'ITSM, ITSM Pro, Virtual Agent, Predictive Intelligence',
          selfHosted: 'Baseline first; Pro when the deflection case is real',
          desc: 'The foundation most instances start from and the easiest to over-configure. Pro tiers pay for themselves where volume is high enough for deflection and routing to matter, and not otherwise — which is a calculation worth doing before the renewal, not after.',
        },
        {
          icon: 'Database',
          title: 'IT Operations Management',
          managed: 'Discovery, Service Mapping, Event Management, AIOps',
          selfHosted: 'Only as good as the credentials and the CMDB model',
          desc: 'ITOM is where ServiceNow stops being a ticket system. It is also the module most often bought before the CMDB can support it, which produces expensive dashboards over unreliable data. Model first, license second.',
        },
        {
          icon: 'Target',
          title: 'IT Asset Management',
          managed: 'SAM Pro, HAM Pro, publisher packs',
          selfHosted: 'Pays for itself fastest of any module, when the data is real',
          desc: 'The one module with a defensible payback on its own, because software entitlement reconciliation usually finds more than it costs. It depends entirely on asset data quality, which depends on discovery, which depends on the CMDB.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Security Operations & Risk',
          managed: 'SecOps, Vulnerability Response, IRM, Third-Party Risk',
          selfHosted: 'Where the security team will actually work in it',
          desc: 'Strong when the security function adopts it as their working surface and hollow when it becomes a reporting layer they update after the fact. The platform work is ours; the security program behind it is a separate discipline.',
          link: { href: '/services/it-security-services', label: 'Security operations' },
        },
        {
          icon: 'Users',
          title: 'Employee and customer workflows',
          managed: 'HRSD, Workplace Service Delivery, CSM, FSM',
          selfHosted: 'Where the process is already owned by someone',
          desc: 'Extending the platform past IT is where most of the license growth happens. It works when a function owns the process and fails when IT builds it on their behalf — the HR operating model question sits with our talent and organization practice.',
          link: { href: '/services/talent-organization', label: 'HR operating model' },
        },
        {
          icon: 'Layers',
          title: 'App Engine and integration',
          managed: 'App Engine Studio, Flow Designer, IntegrationHub',
          selfHosted: 'Scoped apps, update sets, and a debt register',
          desc: 'Genuinely productive for departmental applications close to service data. The failure mode is volume: easy building produces two hundred scoped apps in three years, and governance has to exist before that rather than after.',
          link: { href: '/services/enterprise-integration-platform', label: 'Integration architecture' },
        },
        {
          icon: 'BrainCircuit',
          title: 'AI on the platform',
          managed: 'Now Assist, AI Search, Predictive Intelligence',
          selfHosted: 'Priced as a premium tier; evaluate on your own data',
          desc: 'Summarization and search work well against knowledge that is already good and add little against knowledge that is not. Treat vendor benchmarks as a starting hypothesis and evaluate on your own corpus before committing to the tier.',
          link: { href: '/services/ai-governance', label: 'AI governance' },
        },
        {
          icon: 'Zap',
          title: 'What does not belong here',
          managed: 'Systems of record, high-volume transactions, customer-facing commerce',
          selfHosted: 'A platform is not free because you already own it',
          desc: 'ServiceNow is a workflow platform, not a database of record or a transaction engine. Building those on it produces table growth, performance work and a license conversation you did not plan for — and "we already have it" is the most expensive architecture argument in the enterprise.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve ServiceNow questions,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ─────────────────────────────────────────────────────
    // Question one is the partner-tier question, answered directly. Every
    // competitor page answers it implicitly by leading with a badge; a buyer
    // who checks the ServiceNow partner finder will know our position in under
    // a minute, so the only sensible move is to state it, say what the tier
    // does and does not buy, and name the cases where they should choose an
    // Elite partner instead. A page that dodges it loses the deal twice.
    customFAQs: [
      {
        q: 'Are you a ServiceNow Elite partner?',
        sources: [
          { label: 'ServiceNow Partner Program', url: 'https://www.servicenow.com/partners.html' },
        ],
        a: 'No, and you can verify that in the ServiceNow partner finder in under a minute, so there is no version of this answer worth dressing up.\n\nWhat the tier genuinely buys: access to certain programs and co-sell motions, a volume of certifications, and a signal that the firm has delivered enough scale to be measured. On the largest transformations — multi-region, multi-module, thousands of fulfillers, where you want the vendor in the room and escalation paths that already exist — that is a real advantage and we would tell you to take it.\n\nWhat it does not buy: any guarantee that the build will still upgrade cleanly in year three. Tier is measured on delivered volume, and volume is exactly the incentive that produces over-customized instances. Some of the worst estates we have read were built by very senior partners.\n\nWhere we are the better call: reading an instance somebody else built, getting an estate back inside the support window, license and SKU work where an hourly partner has no incentive to find savings, and mid-sized builds where you want the standard held rather than the scope grown.',
      },
      {
        q: 'Why is our instance three releases behind?',
        sources: [
          { label: 'ServiceNow product lifecycle and support policy', url: 'https://www.servicenow.com/support/product-lifecycle.html' },
        ],
        a: 'Because each individual upgrade looked more expensive than deferring it, and that arithmetic was correct every single time until it was catastrophic.\n\nThe mechanism is always the same. Customizations outside the platform model have to be retested and often reworked each family release. The first deferral is rational. The second is easier. By the fourth, the regression surface is large enough that nobody can scope the work confidently, the people who built it have gone, and the instance has left the supported window — which means new problems get a support answer of "upgrade first".\n\nGetting current is then a project rather than maintenance, and it is worth being honest that it will cost more than any single upgrade would have. The way out is usually two upgrades run back to back after a triage pass, not one heroic jump.\n\nWhat prevents the recurrence is not discipline in the abstract. It is a written exception register with a carrying cost against each entry, reviewed every release, so deferral becomes a visible decision rather than a default.',
      },
      {
        q: 'Should we customize the platform or change the process?',
        a: 'Change the process, in most cases, and we will make that argument before quoting a build — which costs us the larger engagement and is the right advice anyway.\n\nThe test we apply has three parts. Does the difference create genuine commercial or regulatory advantage, or is it just how this organization happens to work. Would a new joiner from another company find the baseline behavior reasonable. And what does carrying it cost, twice a year, for the next decade.\n\nMost requirements that arrive as "the platform must do X" fail the first two. They are habits inherited from a tool that was replaced, and the honest recommendation is to adopt the baseline and retrain rather than to rebuild the baseline in someone else’s image.\n\nWhere a customization does earn itself — and some genuinely do — we build it inside the platform model so it upgrades, put it in the exception register with its reason, and review it each release. The register existing at all is what stops the count climbing.',
      },
      {
        q: 'Our CMDB is wrong. Where do we start?',
        a: 'With scope, not with cleanup. Trying to make the whole CMDB accurate is how these programs die.\n\nStart from the business services that matter — the ones where an outage is a board conversation — and get those right end to end: discovered, mapped, owned, and correct. That is usually a few dozen services rather than several thousand configuration items, and it makes ITOM, SecOps and impact analysis useful for the cases that matter while the rest is still messy.\n\nThe structural fixes come with it. A data model aligned to CSDM so classes and relationships mean the same thing to everyone. Discovery with credentials that actually reach the estate, which is normally the real blocker and normally a security conversation rather than a technical one. Reconciliation rules so authoritative sources win. And a named data owner per class, because a CMDB without an owner returns to its previous state within a year no matter how good the cleanup was.\n\nThen a health dashboard somebody is accountable for, reviewed on a cadence. Not a one-off remediation.',
      },
      {
        q: 'We are being sold another SKU. Do we actually need it?',
        sources: [
          { label: 'ServiceNow Store', url: 'https://store.servicenow.com/' },
        ],
        a: 'Sometimes. The question we would ask first is what you already own and are not using, because that answer changes the conversation more often than not.\n\nThree checks before any new tier. What is already activated in your instance and dormant — pilots that never launched are extremely common. Whether the Store already has an application, often free or low-cost, that covers the requirement. And whether the module depends on data quality you do not yet have, which is the usual reason an ITOM or SAM purchase disappoints: the license arrives, the CMDB cannot support it, and the value lands two years late if at all.\n\nWhere the case is genuinely strong we will say so — asset management in particular tends to pay for itself, because entitlement reconciliation usually finds more than the SKU costs.\n\nWe hold no reseller margin on ServiceNow. That is the only reason we can give you this answer without a conflict, and it is worth asking any partner the same question.',
      },
      {
        q: 'Should we build this application on ServiceNow or somewhere else?',
        a: 'On ServiceNow when the work is a workflow over service data with a human in the loop. Somewhere else more often than the platform’s ease of building suggests.\n\nIt fits when the application is request-and-fulfil shaped, when it needs the CMDB, users, or approvals that already live there, and when the volume is human-scale. Departmental applications close to service management are exactly what App Engine is for, and building them elsewhere usually means rebuilding identity, approvals and reporting for no reason.\n\nIt does not fit when the application is a system of record, when transaction volume is machine-scale, or when it is customer-facing commerce. Those produce table growth, performance engineering and a license discussion nobody budgeted for. "We already have the platform" is the most expensive architecture argument in the enterprise, because the license is not the cost — the carrying cost is.\n\nThe governance point matters more than any single decision. Easy building produces two hundred scoped apps in three years, most unused, all upgradeable. Guardrails have to exist before that, not after.',
      },
      {
        q: 'What does Now Assist actually do today?',
        sources: [
          { label: 'EU AI Act (Regulation 2024/1689)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
        ],
        a: 'Summarization, search and drafting, well, against content that is already good — and very little against content that is not.\n\nWhere it earns the tier: summarizing long incident and case threads for handover, surfacing knowledge that exists but nobody can find, drafting resolution notes and knowledge articles from work already done. Real time saved on genuine friction.\n\nWhere it disappoints: as a substitute for knowledge management. If your articles are stale, contradictory or absent, generative retrieval over them produces confident, fluent, wrong answers faster than a human would have found nothing. The remedy is unglamorous knowledge work first.\n\nTwo things to hold in mind. Treat vendor benchmarks as a hypothesis and evaluate on your own corpus before committing — the delta between a good and a poor knowledge base is larger than the delta between vendors. And where these features touch employment or affect individuals, the EU AI Act and your own governance obligations apply to workflows too, not only to models you build yourself.',
      },
      {
        q: 'How long does an ITSM implementation take?',
        sources: [
          { label: 'ITIL 4 service management framework', url: 'https://www.axelos.com/certifications/itil-service-management' },
        ],
        a: 'Twelve to twenty weeks for core ITSM in one region on baseline, and the variance has almost nothing to do with the platform.\n\nWhat actually sets the timeline: how many source systems have to integrate and how long access to them takes, whether your security review is a week or a quarter, whether process decisions have an owner who can make them, and how much data migration you insist on rather than archiving.\n\nWhat makes it longer, reliably: deciding to customize during build rather than during design, and discovering in week ten that nobody can approve a change to the incident model because the process is owned by a committee.\n\nSubsequent modules and regions are faster — often six to ten weeks — provided the first one held the baseline standard. If it did not, the second is as slow as the first, because every decision is relitigated.\n\nWe would rather quote a range with the assumptions written down than a date with them buried.',
      },
      {
        q: 'What does the platform cost to run, not to implement?',
        a: 'Implementation is the number that gets budgeted and the smaller one. Three things follow it and only the first appears on an invoice.\n\nSubscription: fulfiller seats and activated SKUs, which grow quietly as the platform spreads beyond IT and rarely shrink without somebody deliberately reconciling them. This is the largest ongoing line and the one most amenable to being reduced.\n\nUpgrades: two family releases a year. On a baseline-heavy instance this is routine maintenance. On a heavily customized one it is a recurring project, and that difference is decided by build choices made years earlier.\n\nPlatform operations: a platform owner, a CMDB data owner, release governance and the demand intake process. Small as headcount, and the absence of it is why instances drift.\n\nWe are pre-launch and do not publish rate cards. What we will commit to is shape: the instance assessment is scoped so you can stop after it and keep the findings, including the license position.',
      },
      {
        q: 'Can you take over an instance another partner built?',
        a: 'Yes, and it is the engagement we are best suited to. It is also the one where we will say the least comfortable things early.\n\nThe first fortnight is reading rather than building: what has been customized and whether anyone can justify it, how far behind the support window you are, what the CMDB is actually worth, which entitlements are dormant, and where admin rights ended up. That produces a picture most platform owners have never been shown in one place.\n\nWhat we will not do is quietly rebuild the previous partner’s work to bill the rebuild. Plenty of what we find is fine, and saying so is part of the job. What usually needs attention is narrower than it looks: a handful of customizations doing real damage at upgrade time, a CMDB that was never owned, and a license position nobody reconciled.\n\nWe will also flag where the incumbent is doing good work and the right answer is to keep them.',
      },
      {
        q: 'Who owns the platform after you leave?',
        a: 'Your team, and we build on that assumption from the first sprint rather than negotiating it at handover.\n\nIn practice: configuration standards and the exception register in your repositories, not in our methodology deck. Update sets and application repositories under your change control from day one. A runbook per integration and per custom application covering the failure modes we actually hit, not the ones we imagined. Your platform team pairing on the build rather than receiving a document at the end. And the next family upgrade planned with them, so the first one they run alone is not the first one they have seen.\n\nWe will run managed platform operations under a service level where carrying it is genuinely not realistic, and we price that separately and plainly. The line we hold is the one we hold everywhere: the instance must remain operable by your own people. A platform only we can maintain is a commercial arrangement, not an engineering outcome.',
      },
      {
        q: 'Where does this stop and your other services start?',
        sources: [
          { label: 'ISO/IEC 20000-1 service management standard', url: 'https://www.iso.org/standard/70636.html' },
        ],
        a: 'ServiceNow touches nearly every practice we sell, which is why the boundary is worth stating rather than blurring.\n\nWe own the platform: strategy and licensing, ITSM, ITOM and the CMDB, asset management, the SecOps and IRM configuration, HR and customer workflow builds, App Engine, and upgrades and managed operations. That is this page.\n\nWe do not own the process design behind the workflows — reengineering a value stream, standardizing it across markets and governing it belongs to business process management, and case-management applications to digital process automation. We do not own the security program behind SecOps: threat modeling, testing and the response function are a separate discipline. We do not own integration architecture beyond IntegrationHub. We do not own the HR operating model behind HRSD. We do not own test strategy, though we build ATF suites here. And we do not own model governance behind Now Assist.\n\nThe division that matters: this service decides how the platform is built and kept healthy. What the workflows should be, and who is accountable for them, belongs to the services linked throughout this page.',
      },
    ],

    // ── How we engage ─────────────────────────────────────────────
    // The first package reads an instance that already exists, deliberately
    // ahead of any build offer. Most inbound ServiceNow conversations are not
    // "we want to implement", they are "we are three releases behind and the
    // renewal is in four months" -- and a page that only sells implementation
    // is answering a question nobody asked.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Six ways in,',
    engagementHeadingHighlight: 'starting with the instance you have.',
    engagementLede: 'Most groups arrive with a live instance and a problem, not with a blank slate. The useful first engagement is usually a reading of what is already there, including the license position.',
    servicePackages: [
      {
        name: 'Instance Health Assessment',
        description: 'For a platform that has drifted. What has been customized and why, how far behind the support window you are, whether the CMDB can be trusted, and what you are paying for and not using.',
        deliverables: [
          'Upgrade lag and position against the supported window',
          'Customization inventory with justification and carrying cost',
          'CMDB completeness, staleness and ownership gaps',
          'License and SKU utilization against actual usage',
          'Remediation sequence with a keep, rebuild or retire call per item',
        ],
      },
      {
        name: 'Advisory & Licensing Review',
        description: 'For leadership facing a renewal or a module decision, and wanting an opinion from someone who holds no reseller margin on the answer.',
        deliverables: [
          'Entitlement position reconciled against real consumption',
          'SKU-by-SKU recommendation ahead of renewal',
          'Fulfiller seat model with growth assumptions stated',
          'Store-versus-build assessment for open requirements',
          'Platform roadmap sequenced against the release calendar',
        ],
      },
      {
        name: 'Implementation & Module Rollout',
        description: 'Delivery against your instance and your standards. Where no configuration standard exists yet, writing one is part of the first engagement rather than an afterthought.',
        deliverables: [
          'Baseline-first configuration with a documented exception register',
          'CMDB and CSDM data model where the module depends on it',
          'Scoped applications and update-set discipline',
          'ATF regression coverage built alongside the configuration',
          'Runbooks and enablement for your platform team',
        ],
      },
      {
        name: 'Upgrade & Remediation Program',
        description: 'For instances that have fallen out of the support window. Triage first, then two upgrades run back to back — rarely one heroic jump.',
        deliverables: [
          'Customization triage into keep, rebuild inside the model, or retire',
          'Regression scope defined from the exception register',
          'Sub-production strategy and clone plan',
          'Two family releases adopted, with the second run by your team',
          'Cadence and governance so the lag does not return',
        ],
      },
      {
        name: 'Center of Excellence Enablement',
        description: 'For enterprises standing up their own platform capability rather than outsourcing it. Standards, templates and starter kits so your team builds the way we would, and stops needing us.',
        deliverables: [
          'Configuration and development standards your team owns',
          'Reusable templates, starter kits and a use-case repository',
          'Demand intake, release governance and role model',
          'Platform team roles, skills and onboarding path',
          'Shared or dedicated delivery model, with the handover point named',
        ],
      },
      {
        name: 'Managed Platform Operations',
        description: 'Running the platform under a service level — releases, health, demand intake and governance — for teams who want the capability without carrying a permanent platform function.',
        deliverables: [
          'Family releases adopted on cadence, not deferred',
          'Instance health and performance monitored and reported',
          'CMDB discovery and reconciliation maintained',
          'Demand intake, release governance and change control operated',
          'Monthly reporting on lag, baseline ratio, CMDB health and entitlement',
        ],
      },
    ],

    // ── By industry ───────────────────────────────────────────────
    // Each headline names the reason ServiceNow gets bought in that sector,
    // which is rarely ITSM by the time the second module lands. Deliberately
    // not modeled on any competitor's named industry IP.
    industryHeading: 'ServiceNow work,',
    industryHeadingHighlight: 'shaped by why you bought it.',
    industryLede: 'Eight sectors and the workflow that actually justified the platform in each. It is almost never the one in the original business case.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Every change to a production system has to be evidenced, so change enablement is a control rather than a convenience.',
        items: [
          'Change enablement with audit-grade evidence',
          'Regulatory change tracking and attestation',
          'Third-party and vendor risk workflows',
          'Access recertification and segregation of duties',
          'Incident reporting against regulatory clocks',
          'Control testing and evidence capture',
          'Operational resilience service mapping',
        ],
      },
      {
        industry: 'Telecommunications',
        headline: 'The service catalog is the product catalog, and network operations generate more events than any team can triage by hand.',
        items: [
          'Event correlation and noise reduction',
          'Network and service impact mapping',
          'Order and provisioning workflow orchestration',
          'Field service dispatch and scheduling',
          'B2B customer service workflows',
          'Asset lifecycle across network estate',
          'Outage communication automation',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical systems cannot be interrupted, so change control and service mapping carry patient-safety weight rather than convenience weight.',
        items: [
          'Clinical application change control',
          'Service mapping for patient-critical systems',
          'Medical device asset tracking',
          'Validated system documentation workflows',
          'Access management for clinical roles',
          'Vendor and supplier risk workflows',
          'Incident handling with safety escalation paths',
        ],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'Plant downtime is measured in money per minute, and the asset estate spans IT and operational technology.',
        items: [
          'IT and OT asset visibility',
          'Plant and site service management',
          'Maintenance request and work order workflows',
          'Supplier and contractor onboarding',
          'Multi-site rollout with local variation control',
          'Shift-aware routing and escalation',
          'Spare parts and hardware asset lifecycle',
        ],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Store estate support is high-volume and seasonal, and the peak the platform must survive is a single trading weekend.',
        items: [
          'Store and franchise service desk',
          'High-volume request catalog design',
          'Seasonal capacity and staffing workflows',
          'Point-of-sale asset lifecycle',
          'Peak-event readiness and freeze management',
          'Supplier onboarding workflows',
          'Self-service deflection for store staff',
        ],
      },
      {
        industry: 'Public Sector',
        headline: 'Procurement rules constrain what can be bought and when, so entitlement and baseline discipline are budget instruments.',
        items: [
          'Entitlement management under fixed budgets',
          'Citizen and employee service portals',
          'Accessibility conformance for public-facing portals',
          'Records retention and disclosure workflows',
          'Cross-department shared service models',
          'Procurement and approval workflows',
          'Audit and public scrutiny evidence',
        ],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'Field work, regulated assets and long-lived infrastructure make asset data the center of gravity rather than the ticket.',
        items: [
          'Field service management and dispatch',
          'Regulated asset register and compliance',
          'Outage and incident coordination',
          'Contractor access and safety workflows',
          'Long-horizon asset lifecycle tracking',
          'Environmental and compliance reporting workflows',
          'OT and IT service boundary mapping',
        ],
      },
      {
        industry: 'Technology & Professional Services',
        headline: 'The platform gets extended beyond IT quickly, which is where license growth and governance debt arrive together.',
        items: [
          'Employee service and onboarding at scale',
          'Customer service management for product support',
          'Professional services delivery workflows',
          'Scoped application governance',
          'Multi-instance and domain separation strategy',
          'Developer enablement and standards',
          'Entitlement control as headcount moves',
        ],
      },
    ],

    // ── Practice cluster ──────────────────────────────────────────
    // The default heading names the internal department ("The complete
    // Platforms practice") and the default lede is one sentence, which leaves
    // the band under the density floor. Overridden to state the service
    // boundary, which on this page is unusually load-bearing: ServiceNow is
    // referenced by five other Kangqore services.
    practiceLabel: 'ENTERPRISE PLATFORMS',
    practiceHeading: 'Where the platform stops,',
    practiceHeadingHighlight: 'and the practice starts.',
    practiceLede: 'ServiceNow reaches into almost everything, which is why the boundary is stated rather than assumed. We own the platform — strategy and licensing, ITSM, ITOM and the CMDB, asset management, the SecOps configuration, workflow builds, App Engine, upgrades and operations. Process design, the security program, integration architecture, the HR operating model, test strategy and model governance are each their own service, and the pages below go into those subjects at the depth this one gives the platform.',

    conciergeHeading: 'Ask about your own instance',
    conciergeIntro: 'Bring a real number — how many families behind you are, how many customizations you cannot justify, how many fulfiller seats you pay for. eQORE will tell you what it would read first and what it would need from you.',
    conciergeChips: [
      'How far behind the support window are we?',
      'How do we know which customizations to keep?',
      'Are we paying for ServiceNow SKUs we do not use?',
      'Can you take over an instance another partner built?',
      'Book an instance health assessment',
    ],

    midCta: 'The instance went live. The upgrade is the part nobody budgeted.',
    midCtaLabel: 'Book an Instance Health Assessment',
    closingCta: {
      title: 'One instance,',
      highlight: 'honestly read.',
      body: 'Tell us which family release you are on and roughly how many customizations you carry. In 30 minutes we will tell you how far outside the support window that puts you, which of those customizations will hurt at upgrade time, and where your license position is probably leaking — before anyone proposes building anything.',
      proofLabel: 'From first call to a read of your instance',
    },
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
    shortDescription: 'Redesigning how an enterprise decides, staffs and builds capability',
    fullDescription: 'Design the operating model, decision rights, skills system and people function an enterprise needs to execute — and prove it moved.',
    // Without this the hero description inherits the template default
    // max-w-[520px] and wraps to three lines. Two is the standard.
    fullDescriptionMaxWidth: 'max-w-[760px] xl:max-w-[880px]',
    keyFeatures: ['Workforce strategy', 'Operating model design', 'Decision rights', 'Skills architecture', 'People intelligence', 'HR transformation'],
    relatedServiceSlugs: ['global-capability-centers', 'business-process-management', 'unified-services-management'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    lastReviewed: '2026-08-23',

    // ── Positioning ──────────────────────────────────────────────────
    // 631 bytes on the Platforms parity default, which is the worst fit on the
    // fleet: the department copy told a talent audience that "the license is
    // bought, the value is in what you configure" and offered a MuleSoft and
    // SAP toolchain. 26/40.
    //
    // The category is unusually uniform. Accenture, Deloitte, McKinsey and IBM
    // all lead with the same sentence — AI plus human potential, reinvent the
    // workforce, skills-based organization, data-driven people decisions — and
    // Accenture's live page organizes it into six capabilities almost
    // identical to the six here. Saying it louder is not a position.
    //
    // The wedge is the part the category will not print: a reorganization is
    // not the intervention. Structures get redrawn, titles change, and
    // eighteen months later the same escalations reach the same three people,
    // because nobody moved a decision right. So this page is organized around
    // decisions rather than around charts, and the outcomes are four things a
    // board can check a year after the announcement -- time to decision,
    // internal fill on critical roles, regretted attrition where it hurts, and
    // layers between a customer and the person who can say yes. None of those
    // is engagement score, which every competitor quotes and which moves for
    // reasons no program controls.
    //
    // Scope note: Accenture files Global Capability Centers under Talent &
    // Organization. Kangqore has GCC as its own service in this same practice
    // cluster, so area 02 routes it rather than claiming it. Shared services
    // and Center of Excellence design belong to business process management
    // for the same reason.
    heroTitle: 'Talent and Organization Design\nThat Moves Decisions, Not Boxes',
    heroBadge: 'Diagnose. Design. Deploy. Scale.',
    heroStripItems: [
      'Workforce Planning', 'Operating Model Design', 'Decision Rights', 'Leadership & Culture',
      'Skills Architecture', 'People Intelligence', 'HR Transformation', 'Talent Acquisition',
    ],
    hidePartnershipModel: true,

    whatIsEyebrow: 'What talent and organization consulting is actually for',
    whatIsTitle: 'Most Reorganizations Move Boxes.',
    whatIsHighlightNewLine: true,
    whatIsHighlight: 'The Ones That Work Move Decisions.',
    whatIsPara2: 'Talent and organization consulting is the work of changing how an enterprise decides, staffs and builds capability. The chart is an output. The intervention is everything underneath it — who holds a decision, what a manager is genuinely accountable for, which capabilities the business is actually short of, and how fast a critical role gets filled when the person in it resigns.',
    whatIsPara3: 'The failure mode is well documented and close to universal. A structure is redrawn, titles change, the announcement lands well, and eighteen months later the same escalations arrive on the same three desks — because the boxes moved and the authority did not. Meanwhile the skills taxonomy built during the program has gone stale, since it was scoped as a deliverable rather than as a dataset with an owner and a refresh cadence.',
    whatIsPara4: 'Kangqore works it the other way round. We measure how long a defined class of decision actually takes today and where it stalls, then design the structure that follows from the answer rather than the one that looks tidy on a slide. Skills work is scoped as an operating commitment, not a mapping exercise. And every design is tested against numbers a board can check a year later, which is a harder promise than an engagement score and a more useful one.',

    // ── Outcomes ────────────────────────────────────────────────────
    // Deliberately not engagement, eNPS or total attrition. All three are on
    // every competitor page, all three move for reasons no program controls,
    // and none of them can be attributed to a redesign a year afterwards.
    //
    // These four can. Each is measurable before the work starts, each has a
    // named denominator, and each fails visibly if the redesign was cosmetic.
    outcomesEyebrow: 'WHAT DECIDES WHETHER A REDESIGN SURVIVED',
    outcomesHeading: 'Four numbers a board can check',
    outcomesHeadingHighlight: 'a year after the announcement.',
    businessMetrics: [
      { illustrative: true, title: 'Time to Decision',        desc: 'Reduction in elapsed days from a defined decision being raised to it being made, once decision rights sit with named roles instead of standing committees.',        value: '45', suffix: '%',      metricLabel: 'Faster on Defined Decisions', icon: 'Zap' },
      { illustrative: true, title: 'Critical-Role Fill',      desc: 'Share of business-critical roles filled internally, once succession is mapped against a maintained skills inventory rather than against manager recall.',            value: '60', suffix: '%',      metricLabel: 'Filled From Inside',          icon: 'Target' },
      { illustrative: true, title: 'Regretted Attrition',     desc: 'Reduction in regretted departures from the roles the business itself named critical. Not total attrition, which moves with the labor market rather than with design.', value: '30', suffix: '%',      metricLabel: 'Lower Where It Hurts',        icon: 'Shield' },
      { illustrative: true, title: 'Layers to the Work',      desc: 'Management layers removed between a customer-facing signal and the person authorized to act on it, after span, accountability and delegation are redesigned together.', value: '2', suffix: ' Fewer', metricLabel: 'Between Customer and Yes',    icon: 'Layers' },
    ],

    // ── Engagement outcomes ────────────────────────────────────────
    // Overridden rather than left on the parity default, which invents a
    // client called "Global Enterprise Organization" and asserts "100%
    // operational reliability". Both scenarios below say what they are in the
    // descriptor and repeat it in the body.
    outcomeCard: {
      illustrative: true,
      metric: '31 → 9 days',
      metricLabel: 'to a pricing decision',
      industry: 'Modeled scenario — industrial group, 4 business units',
      problem: 'Pricing exceptions routed through three committees that met fortnightly, so a customer question took a month and the answer was usually yes anyway.',
      outcome: 'The decision was delegated to named commercial roles with a defined threshold, escalation reserved for genuine exceptions, and the committee retired. Figures are modeled from typical delegation patterns, not measured on a named client.',
    },
    outcomeCard2: {
      illustrative: true,
      metric: '22% → 61%',
      metricLabel: 'critical roles filled internally',
      industry: 'Modeled scenario — regulated services firm, ~6,000 staff',
      problem: 'A skills framework built two years earlier that nobody owned, so succession planning ran on the memory of whoever was in the room.',
      outcome: 'Skills inventory rebuilt against real project and certification data, with a named owner and a quarterly refresh written into the HR operating model. Modeled figures, shown to convey the shape of the work rather than a specific engagement.',
    },

    // ── Capability areas ───────────────────────────────────────────
    // Six, matching the brief and matching how the category is organized, so a
    // buyer comparing pages side by side can map them one to one. The depth is
    // where the difference sits: roughly eighty named capabilities, and two
    // seams stated on the cards rather than quietly claimed.
    //
    // Area 02 routes Global Capability Centers and Global Business Services to
    // /services/global-capability-centers, and shared services and Center of
    // Excellence design to /services/business-process-management. Accenture
    // files GCC inside this practice; Kangqore has it as its own service in
    // this same cluster, and claiming it twice would be the kind of overlap a
    // procurement team notices.
    //
    // Bento slots: 01 opens tall, 04 takes width because skills is the area
    // the AI economy actually moved, and 06 closes wide because it is where
    // strategy turns into an operational commitment.
    capabilitiesLabel: 'TALENT & ORGANIZATION SERVICES',
    capabilitiesSectionTitle: 'Talent & Organization',
    capabilitiesSectionHighlight: 'Capabilities.',
    capabilitiesLede: 'Six capabilities spanning workforce strategy through HR operations — roughly eighty named services, and the two seams where another Kangqore practice takes the work on.',
    capabilityAreas: [
      {
        title: 'Talent Strategy & Strategic Workforce Planning',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Translating a business strategy into the roles, capabilities and headcount it actually requires — and being specific about which roles are critical, because a plan that treats every role as critical has not prioritized anything. Most workforce plans are headcount budgets with a narrative attached; the useful version starts from where value is created and works backward to the twenty roles that carry your strategy.',
        items: [
          'Strategic Workforce Planning',
          'Workforce Demand and Supply Modeling',
          'Critical-Role Identification',
          'Capability Gap Analysis',
          'Build, Buy, Borrow and Redeploy Decisions',
          'Workforce Scenario Planning',
          'Succession and Talent Pipeline Strategy',
          'Location and Sourcing Strategy',
          'Workforce Cost and Productivity Modeling',
          'Skills-Based Workforce Architecture',
          'Contingent and Blended Workforce Design',
          'Future-of-Work Strategy',
          'Workforce Risk and Concentration Analysis',
        ],
      },
      {
        title: 'Organization & Operating Model Design',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Structure, decision rights and accountability as one design. Change one alone and your reorganization is cosmetic.',
        items: [
          'Target Operating Model Design',
          'Organization Structure and Architecture',
          'Decision Rights and Delegation Frameworks',
          'Accountability and Role Charters',
          'Governance and Forum Design',
          'Span of Control and Layer Analysis',
          'Product and Platform Operating Models',
          'Agile and Cross-Functional Team Design',
          'Interface and Handoff Design',
          'Organizational Restructuring',
          'Post-Merger Organization Integration',
          'Operating Model Cost Modeling',
          'Design Testing Against Real Decisions',
        ],
      },
      {
        title: 'Leadership, Culture & Change',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Leaders who can carry a decision they did not make, and change measured by what your managers do differently on a Tuesday.',
        items: [
          'Leadership Strategy and Development',
          'Executive and Emerging-Leader Programs',
          'Leadership Pipeline and Succession',
          'High-Potential Identification and Calibration',
          'Culture Assessment and Transformation',
          'Organizational Health Diagnostics',
          'Organizational Network Analysis',
          'Change Readiness and Impact Assessment',
          'Adoption Measurement, Not Attendance',
          'Transformation Communications',
          'Manager Enablement and Capability',
          'Employee Experience and Listening',
          'Performance and Reward Design',
        ],
      },
      {
        title: 'Skills, Learning & Workforce Transformation',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'A skills inventory is a dataset, not a deliverable — it decays from the day it is signed off unless somebody owns it and something refreshes it. So we build the taxonomy against evidence your business already generates (projects staffed, certifications held, work delivered) rather than against self-assessment surveys, and we write the refresh cadence and the owner into the operating model before the program closes. Learning is then pointed at the gaps the inventory exposes, in the flow of work, instead of at a catalog nobody opens.',
        items: [
          'Enterprise Skills Strategy',
          'Skills Taxonomy and Architecture',
          'Evidence-Based Skills Inventory',
          'Skills Data Ownership and Refresh Cadence',
          'Role Redesign Around Human and Machine Work',
          'Reskilling and Redeployment Programs',
          'AI and Data Literacy Programs',
          'Capability Academies',
          'Personalized Learning Pathways',
          'Learning Ecosystem and Technology Strategy',
          'Internal Talent Marketplace Design',
          'Knowledge Capture and Transfer',
          'Capability Measurement and Assurance',
        ],
      },
      {
        title: 'AI-Powered HR Transformation & People Intelligence',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Your workforce data turned into decisions leaders take, and employment AI governed as regulated activity.',
        items: [
          'HR Strategy and Operating Model',
          'HR Technology Strategy and Selection',
          'HCM Implementation and Integration',
          'People Analytics and Reporting',
          'Skills and Talent Intelligence',
          'Predictive Attrition and Retention Modeling',
          'Workforce Productivity Analytics',
          'HR Data Architecture and Quality',
          'Generative AI for HR Service Delivery',
          'Agentic Workflows for HR Operations',
          'Bias Auditing for Employment Decision Tools',
          'AI Governance for the Employment Lifecycle',
          'Employee Data Privacy and Consent Design',
        ],
      },
      {
        title: 'Talent Acquisition, Deployment & HR Managed Services',
        image: '/images/capabilities/agentic-governed-autonomy.png',
        desc: 'Where strategy becomes an operational commitment. Hiring, onboarding, deployment and the HR service line run to defined service levels, with the flexibility to scale as demand moves — and with the same rule we hold everywhere else: the capability has to remain operable by your own team. An HR function only we can run is a dependency we sold you, not an outcome we delivered.',
        items: [
          'Talent Acquisition Strategy and Operating Model',
          'Strategic Sourcing and Talent Pooling',
          'Recruitment Process Design and Operations',
          'Executive and Specialist Hiring',
          'Talent Market Intelligence',
          'Candidate Experience Design',
          'Onboarding and Time-to-Productivity',
          'Internal Mobility and Deployment',
          'HR Operations Transformation',
          'HR Managed Services to Service Levels',
          'HR Process Optimization and Automation',
          'Workforce Reporting and Compliance Enablement',
          'Transition, Knowledge Transfer and Exit Planning',
        ],
      },
    ],

    // ── The chain ─────────────────────────────────────────────────
    // The brief's "from talent management to workforce intelligence" model,
    // rendered as stacked bands from data rather than as an image, so every
    // node name is real text a crawler receives and it reflows on a phone.
    // Read downward as a dependency chain: each layer is only as good as the
    // one beneath it, which is the argument for doing them together.
    enterpriseArchitecture: {
      eyebrow: 'FROM TALENT MANAGEMENT TO WORKFORCE INTELLIGENCE',
      title: 'Eight layers,',
      titleHighlight: 'and most programs touch two.',
      lede: 'Talent work fails at the seams rather than inside the disciplines. A skills program with no link to your operating model produces a catalog; an operating model with no link to decision rights produces a chart. These are the layers, and the value is in connecting them.',
      layers: [
        { label: 'Business Strategy',        role: 'Where value is created next',                nodes: ['Growth Priorities', 'Market Moves', 'Cost Position', 'Regulatory Exposure'] },
        { label: 'Work & Operating Model',   role: 'How the work is actually organized',         nodes: ['Value Streams', 'Process Ownership', 'Human and Machine Split', 'Service Levels'] },
        { label: 'Organization Design',      role: 'Who is accountable, and who decides',        nodes: ['Structure', 'Decision Rights', 'Spans and Layers', 'Governance Forums'] },
        { label: 'Roles & Skills',           role: 'What the work requires of people',           nodes: ['Role Architecture', 'Skills Taxonomy', 'Critical Roles', 'Capability Gaps'] },
        { label: 'Talent & Leadership',      role: 'Who is in the seats, and who is next',       nodes: ['Succession', 'Pipeline', 'Mobility', 'Leadership Capability', 'Culture'] },
        { label: 'AI & Technology',          role: 'The systems the people function runs on',    nodes: ['HCM Platform', 'Skills Intelligence', 'Learning Ecosystem', 'HR Service Delivery'] },
        { label: 'Workforce Intelligence',   role: 'Signals turned into something decidable',    nodes: ['People Analytics', 'Predictive Models', 'Talent Risk', 'Productivity Signals'] },
        { label: 'Business Performance',     role: 'What the whole chain is answerable for',     nodes: ['Time to Decision', 'Critical-Role Fill', 'Regretted Attrition', 'Cost to Serve'] },
      ],
      principle: 'Talent decisions are only as good as the layer beneath them. A skills taxonomy built without an operating model describes a company that does not exist.',
    },

    // ── Lifecycle ───────────────────────────────────────────────────
    // The brief's Diagnose, Design, Deploy, Scale. Kept at four because it is
    // the client's own model and it is a genuine loop -- Scale returns to
    // Diagnose rather than ending the engagement.
    architectureEyebrow: 'THE WORKFORCE INTELLIGENCE MODEL',
    architectureTitle: 'How It Works.',
    architectureTitleHighlight: 'Diagnose to Scale.',
    architectureLede: 'Four stages, and the loop closes rather than ending. Most engagements are funded through Deploy and stop there, which is precisely when the design starts drifting back toward the shape it had before.',
    architectureNodes: [
      {
        title: 'Diagnose',
        icon: 'Search',
        description: 'Build a fact base instead of a hypothesis. How long a defined decision actually takes, where escalations land, which roles are genuinely critical, what the skills data really says once you stop trusting self-assessment.',
        features: [
          'Decision latency measured on real cases',
          'Escalation and bottleneck mapping',
          'Critical-role and single-point-of-failure analysis',
          'Skills evidence gathered from work, not surveys',
          'Organizational network and collaboration analysis',
          'Baseline set for every metric the work will be judged on',
        ],
      },
      {
        title: 'Design',
        icon: 'Layers',
        description: 'Structure, decision rights, role charters, skills architecture and the people technology that supports them — designed as one object, because changing any of them alone produces a reorganization your people will route around.',
        features: [
          'Target operating model and structure',
          'Decision rights assigned to named roles',
          'Role charters with real accountability',
          'Skills taxonomy with an owner and a cadence',
          'Leadership and succession model',
          'HR technology and data architecture',
        ],
      },
      {
        title: 'Deploy',
        icon: 'Rocket',
        description: 'Into your live organization, with people in post and work in flight. The stage that slips, and it slips on manager capability rather than on design quality — a delegation nobody feels safe using has not been delegated.',
        features: [
          'Phased transition and role matching',
          'Manager enablement on the new authority',
          'Consultation and works council process',
          'Communications tied to what changes on Tuesday',
          'Technology and data migration',
          'Adoption measured, not assumed',
        ],
      },
      {
        title: 'Scale',
        icon: 'TrendingUp',
        description: 'Measure against the baseline taken in Diagnose, find where your design is drifting back, and fix it. This is the stage that compounds and the first one cut when a budget tightens.',
        features: [
          'Metrics reported against the original baseline',
          'Decision-rights drift detected and corrected',
          'Skills inventory refreshed on its cadence',
          'Capability gaps fed back into workforce planning',
          'Structure reviewed as the strategy moves',
          'Handover to your own team, with the model documented',
        ],
      },
    ],

    // ── The argument ──────────────────────────────────────────────
    // Both columns ran a real program with a real budget and a real
    // announcement. The difference is entirely in what is true eighteen months
    // later, which is the only horizon on which this work can be judged.
    comparisonTable: {
      eyebrow: 'WHERE ORGANIZATION PROGRAMS QUIETLY REVERT',
      heading: 'Both announcements landed well.',
      lede: 'Neither column describes a badly run program. They differ in what is still true eighteen months after your town hall.',
      beforeLabel: 'A REORGANIZATION',
      afterLabel: 'A REDESIGN',
      afterBadge: 'KANGQORE',
      beforeShort: 'ANNOUNCED',
      afterShort: 'OPERATING',
      rows: [
        {
          dimension: 'What actually changed',
          before: 'Reporting lines, titles and a new chart. Authority stayed exactly where it was, so the same escalations reach the same three desks.',
          after: 'Decision rights moved to named roles with defined thresholds, and the forums that used to hold them were retired rather than renamed.',
        },
        {
          dimension: 'How success was defined',
          before: 'Engagement score, announcement sentiment and a completed org chart. All three peak in month three and tell you nothing in month eighteen.',
          after: 'Time to decision, internal fill on critical roles, regretted attrition where it hurts, and layers between a customer and a yes — baselined before the work started.',
        },
        {
          dimension: 'What happened to the skills framework',
          before: 'Built during the program, signed off, and stale within eighteen months because it belonged to the program rather than to anybody afterwards.',
          after: 'Built from evidence the business already generates, with a named owner and a refresh cadence written into the HR operating model before close.',
        },
        {
          dimension: 'Where the AI work sits',
          before: 'A generative assistant bolted onto HR service delivery, and screening models nobody has audited running against live candidates.',
          after: 'AI in the employment lifecycle treated as regulated activity — bias auditing, documented logic and human review on decisions that affect someone’s job.',
          link: { href: '/services/ai-governance', label: 'AI governance' },
        },
        {
          dimension: 'What managers were given',
          before: 'A deck, a town hall and a new title. The delegation exists on paper and nobody feels safe being the first to use it.',
          after: 'Explicit thresholds, worked examples, and an escalation path that is genuinely narrower — so using the authority is the low-risk choice.',
        },
        {
          dimension: 'Who owns it afterwards',
          before: 'The program closes, the consultants leave, and the model degrades quietly because maintaining it was nobody’s objective.',
          after: 'Named internal owners for the structure, the skills data and the decision framework, with the review cadence in the operating model rather than in a plan.',
        },
        {
          dimension: 'Where the operating work goes',
          before: 'Shared services, capability centers and process ownership all folded into one talent program that cannot resource any of them properly.',
          after: 'Routed to the practices that own them — capability centers and business process management — so each is scoped, staffed and measured on its own terms.',
          link: { href: '/services/global-capability-centers', label: 'Global Capability Centers' },
        },
      ],
    },

    // ── Toolchain ─────────────────────────────────────────────────
    // Framed by what each platform is genuinely good at, including the row no
    // HR technology vendor will write: the interventions that are not a
    // platform at all. We hold no reseller margin on any of these.
    toolsStack: {
      eyebrow: 'THE TOOLCHAIN',
      title: 'The people platforms,',
      titleHighlight: 'and what no platform fixes.',
      subtitle: 'Platform choice is mostly settled by what you already own and by which module holds your payroll and core HR data. These are the defaults, what overrides them, and where a tool is the wrong answer entirely.',
      items: [
        {
          icon: 'Database',
          title: 'Core HCM',
          managed: 'Workday, SAP SuccessFactors, Oracle Fusion HCM, Dayforce',
          selfHosted: 'Whichever already holds payroll and the org hierarchy',
          desc: 'The system of record for people, positions and pay. Replacing it is a multi-year program in its own right, so the useful first question is almost never which one to buy — it is which parts of the one you own are unconfigured or unused.',
        },
        {
          icon: 'Radar',
          title: 'Skills and talent intelligence',
          managed: 'Eightfold, Gloat, Beamery, Workday Skills Cloud',
          selfHosted: 'Only once you can feed it real evidence',
          desc: 'These infer skills from work history and market data, which is genuinely better than self-assessment. They also inherit whatever your source data is worth, so buying one before the evidence exists produces confident nonsense at scale.',
        },
        {
          icon: 'TrendingUp',
          title: 'People analytics',
          managed: 'Visier, One Model, ChartHop, Tableau on HCM data',
          selfHosted: 'Your own warehouse where HR is already modeled',
          desc: 'Worth it once more than one system holds workforce data and someone is asking questions a standard report cannot answer. Below that threshold it is a dashboard nobody opens, and the money is better spent fixing the data underneath.',
        },
        {
          icon: 'Network',
          title: 'Organizational network analysis',
          managed: 'Microsoft Viva Insights, Worklytics, TrustSphere',
          selfHosted: 'With works council agreement, or not at all',
          desc: 'Collaboration data shows where work actually flows versus where the chart says it should. It is also the most privacy-sensitive tool on this list, and deploying it without consultation is how a program loses its license to operate.',
        },
        {
          icon: 'BrainCircuit',
          title: 'Learning and capability',
          managed: 'Degreed, Cornerstone, LinkedIn Learning, Docebo',
          selfHosted: 'Pointed at the gaps, not at a catalog',
          desc: 'Content is a commodity and completion rates measure almost nothing. What makes a learning ecosystem work is that it targets gaps the skills inventory actually exposes and delivers them close to the work that needs them.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Employment AI, governed',
          managed: 'Screening, matching and internal mobility models',
          selfHosted: 'Bias audit, documented logic, human review',
          desc: 'Hiring and promotion tools sit in the high-risk tier of the EU AI Act, face annual bias-audit duties under New York Local Law 144, and engage GDPR rights on automated decisions. Model governance itself is a separate Kangqore service.',
          link: { href: '/services/ai-governance', label: 'AI governance' },
        },
        {
          icon: 'Zap',
          title: 'What no platform fixes',
          managed: 'Decision rights, role charters, manager capability',
          selfHosted: 'A calendar with fewer forums on it',
          desc: 'No system decides who may approve an exception, and no module makes a manager confident enough to use an authority they were granted. These are the interventions that move the numbers, and none of them appears on a license schedule.',
        },
      ],
    },

    faqEyebrow: 'ASKED ON THE FIRST CALL',
    faqHeading: 'Twelve questions about org design,',
    faqHeadingHighlight: 'answered without hedging.',

    // ── FAQ ──────────────────────────────────────────────────────
    // The parity default ran six promotional answers under fifty words. The
    // competitor set runs the same handful everywhere: what is talent
    // transformation, how do you use AI, can you support change management.
    // None is a question a CHRO or a COO opens with.
    //
    // These are. Seven of them are questions a consultancy would rather not be
    // asked: do reorgs work, are we just cutting headcount, is engagement
    // worth measuring, will the skills taxonomy survive, is the AI legal, what
    // does it cost to run, and who owns it after we leave.
    customFAQs: [
      {
        q: 'Do reorganizations actually work?',
        sources: [
          { label: 'Getting Reorgs Right (Harvard Business Review)', url: 'https://hbr.org/2016/11/getting-reorgs-right' },
        ],
        a: 'About as often as they are done properly, which is not often — and the published research is unkind on this point.\n\nThe pattern behind the failures is consistent. A structure is redesigned without touching decision rights, so authority stays exactly where it was and the new chart describes a company that does not behave differently. Or the design is sound and the deployment stops at the announcement, so managers are handed authority they have never seen anyone use and quietly keep escalating.\n\nWhat separates the ones that hold: the design changes who can decide what, without asking; the change is measured on adoption rather than attendance; and somebody internal owns the model afterwards with a review in the calendar.\n\nSo the honest answer is that we will not run a structural program for you unless the decision-rights work goes with it. A reorganization without it is expensive theater, and eighteen months later everyone can tell.',
      },
      {
        q: 'Is this a headcount reduction exercise with a nicer name?',
        a: 'Sometimes that is genuinely what a client needs, and when it is, we would rather say so plainly than dress it as capability building.\n\nThe two are different pieces of work with different methods. A cost program starts from a target and works backward through spans, layers and duplication. A capability program starts from where value is created and works forward to the roles that carry it, and it frequently concludes that you are under-invested somewhere while over-invested somewhere else.\n\nThey get conflated because a capability program usually surfaces cost, and because announcing the second is easier than announcing the first. That conflation is corrosive: people work out very quickly which one they are in, and a workforce that believes it was misled about a restructuring will not engage with the next one.\n\nWe will run either. What we will not do is run a cost program described internally as a transformation, because the credibility cost lands on you and lasts longer than the saving.',
      },
      {
        q: 'Our engagement score is high and nothing is moving. Why?',
        a: 'Because engagement measures how people feel about working somewhere, and almost nothing about whether the organization can decide, staff and execute.\n\nThe two come apart in a specific and common way: a stable, well-liked, slow organization scores well. People are treated decently, tenure is long, managers are pleasant — and a pricing exception still takes a month because it crosses three committees nobody wants to be the one to bypass. Engagement is measuring the culture, which is fine, and the survey is telling the truth.\n\nWhat it cannot see is structural. How long a defined decision takes end to end. How many people can say yes without asking. How often a critical role is filled from outside because nobody was ready inside. Those are countable and they are what actually constrain execution.\n\nWe would keep the engagement survey — it catches things nothing else does — and stop treating it as a performance measure for the operating model.',
      },
      {
        q: 'How do we decide what stays with people and what goes to AI?',
        sources: [
          { label: 'The Future of Jobs Report (World Economic Forum)', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/' },
        ],
        a: 'By decomposing roles into tasks first, because almost no job is automated and almost every job changes.\n\nThe test we apply per task is three questions. Is the input structured enough for a machine to be reliable on it. What does a wrong answer cost, and can it be reversed. And does anyone need to be accountable for the judgment in a way a model cannot carry — a regulator, a customer, a court.\n\nHigh-volume, structured, low-cost-of-error, reversible tasks are where automation pays. Judgment under ambiguity, relationship work, and anything where a person must own the outcome stay human, sometimes with a model doing the preparation.\n\nThe part most redesigns skip is the residue. Automating the routine sixty per cent of a role leaves a job that is harder, denser and more exception-heavy than the one it replaced, and if nothing is done about workload, banding or support, you have quietly made the role worse while reporting a productivity gain.',
      },
      {
        q: 'Will our skills taxonomy still be useful in two years?',
        a: 'Only if somebody owns it and something refreshes it. Otherwise it will be a well-designed artifact describing the company you were.\n\nThe decay is structural rather than careless. People acquire skills continuously, roles change, the taxonomy was built during a program with a budget and an end date, and once the program closes nobody has maintaining it in their objectives. Eighteen months later leaders stop trusting it, which is worse than not having it — the effort was spent and the decisions are still being made from memory.\n\nTwo things prevent it. Build the inventory from evidence the business already generates — projects staffed, certifications held, systems used, work delivered — rather than from a self-assessment survey nobody wants to repeat. And write the owner, the refresh cadence and the data sources into the HR operating model before the program closes, so maintenance is a job rather than an intention.\n\nWe scope skills work as an operating commitment. If a client wants only the mapping, we will say up front what its half-life is.',
      },
      {
        q: 'Is using AI in hiring and promotion actually legal?',
        sources: [
          { label: 'EU AI Act (Regulation 2024/1689) — employment is a high-risk category', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { label: 'NYC Local Law 144 — automated employment decision tools', url: 'https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page' },
        ],
        a: 'Legal in most places, conditional almost everywhere, and increasingly something you have to be able to evidence rather than assert.\n\nThree regimes matter in practice. The EU AI Act places employment and worker-management systems in its high-risk tier, which brings obligations on risk management, data governance, logging, transparency and human oversight. New York City Local Law 144 requires an independent annual bias audit of automated employment decision tools, published, with notice to candidates. And GDPR gives individuals rights around decisions made solely by automated means, including meaningful information about the logic involved.\n\nThe practical consequence is not that you cannot use these tools. It is that you need to know which vendor models are in your stack — including the ones embedded in your ATS that nobody procured deliberately — what they score on, who audited them, and where a human genuinely intervenes rather than rubber-stamping.\n\nWe cover that scoping here. The model governance framework behind it is our AI governance service.',
      },
      {
        q: 'How long before any of this shows up in the numbers?',
        a: 'Different metrics move on genuinely different clocks, and a program that promises them all in two quarters is telling you what you want to hear.\n\nDecision latency moves fastest. Delegation thresholds and retiring a forum can change elapsed time within a quarter, because the constraint was procedural and you removed it.\n\nInternal fill rate takes three to four quarters. It depends on a skills inventory that has to be built, then trusted, then actually used when a vacancy appears — and the first few vacancies are the test.\n\nRegretted attrition is a lagging measure and needs a year of data on both sides to say anything honest, because quarterly movement in it is mostly noise.\n\nCulture and leadership behavior are the slowest. Two to three years before the change is self-sustaining rather than sponsor-dependent, and it reverses quickly if the sponsor leaves in year one.\n\nWe baseline all four before starting, so the conversation in month nine is about evidence rather than impressions.',
      },
      {
        q: 'We have Workday. Why would we need any of this?',
        a: 'Because a core HCM answers where people sit and what they are paid. It does not answer whether the structure works.\n\nWhat the platform genuinely gives you: a system of record, a hierarchy, workflow, and reporting on things that are already fields. That is real and it is a precondition for most of the work below.\n\nWhat it does not give you: whether the reporting line is the right one, who is permitted to decide without asking, which twenty roles carry your strategy, whether a skills field populated by self-assessment means anything, or why a decision takes thirty days. None of those is a configuration problem.\n\nThe most common finding on an HCM-mature client is the opposite of a buying recommendation — the platform is capable and half-configured, position management was never switched on, the skills module is empty, and three shadow spreadsheets are doing the real work. Fixing that is cheaper than any new license and it is usually where we start.',
      },
      {
        q: 'What does this cost to run, not to build?',
        a: 'The design work is a project with an end. Three things after it are ongoing, and only the first is usually budgeted.\n\nSkills data maintenance: someone owning the taxonomy, the refresh cycle and the integrations that feed it. Modest as a role, and the single most common reason the whole investment stops paying.\n\nManager capability: the delegation only holds if new managers are onboarded into it. Every intake dilutes it, and organizations that treat enablement as a launch event watch authority creep back upward within two years.\n\nThe measurement itself: keeping the four baseline metrics instrumented and reported. Small, and it is what makes the annual conversation evidence-based rather than anecdotal.\n\nWe are pre-launch and do not publish rate cards. The commitment we will make is about shape: the diagnostic is scoped so you can stop after it and keep the findings, and every number we report afterwards is measured against the baseline we took before starting.',
      },
      {
        q: 'Can you work with our works councils and employee representatives?',
        a: 'Yes, and in most European jurisdictions the sequencing is a legal requirement rather than a courtesy, so it shapes the plan from day one.\n\nWhat that means practically: consultation happens before decisions are final rather than after, which changes what can be in a deck and when. Information rights attach to specific documents at specific stages. Timelines are set by statute, differ by country, and cannot be compressed by wanting them to be. And anything touching monitoring or collaboration analytics is a separate and more sensitive conversation than structural change.\n\nThe mistake we see most often is a global program designed on a US timeline and then discovered to be undeliverable in Germany, France or the Netherlands at the point of announcement — which costs months and a great deal of trust.\n\nWe plan the consultation path alongside the design, and where the answer is that a design is not deliverable in a market on that timeline, we would rather say it in week three than in month seven.',
      },
      {
        q: 'Who owns this after you leave?',
        a: 'Your team, and we scope it that way from the first workshop rather than negotiating it at handover.\n\nIn practice: named internal owners for the structure, the decision framework and the skills data, each with the review cadence written into the operating model rather than into a closure plan. The model documented well enough that someone who was not in the room can apply it to next year’s question. Your HR and business leaders in the design work rather than receiving its output. And the measurement instrumented in your systems, so the year-one review does not require us to come back and run it.\n\nWe will run HR operations under a service level where carrying it is genuinely not realistic, and we price that separately and honestly. The line we hold is the same one we hold everywhere: the capability has to remain operable by your own people. An organization only we can maintain is a commercial arrangement, not an outcome.',
      },
      {
        q: 'Where does this stop and your other services start?',
        a: 'Talent work touches everything, which is exactly why the boundary is worth stating rather than blurring.\n\nWe own workforce strategy, organization and operating model design, decision rights, leadership and culture, skills architecture, people intelligence, HR transformation, and talent acquisition and HR operations. That is this page, and it goes as deep as we can take it.\n\nWe do not own capability centers — building, locating and running a Global Capability Center is its own Kangqore service, and Accenture folding it into talent is a taxonomy choice we deliberately did not copy. We do not own shared services or Center of Excellence design, which sit with business process management alongside process ownership and standardization. We do not own the model governance framework behind employment AI, which is AI governance. And we do not own the HCM implementation as a platform program, which sits with enterprise platform integration.\n\nThe division that matters: this service decides how the enterprise is organized and staffed to execute. Running the resulting operations belongs to the services linked throughout this page.',
      },
    ],

    // ── How we engage ─────────────────────────────────────────────
    // The first package is a diagnostic priced to be stoppable, deliberately
    // ahead of any design offer. Most inbound conversations are "we
    // reorganized last year and it did not take", not "we need a new chart",
    // and a page that only sells design work is answering a question nobody
    // asked.
    engagementEyebrow: 'HOW WE ENGAGE',
    engagementHeading: 'Five ways in,',
    engagementHeadingHighlight: 'starting with the one you can stop after.',
    engagementLede: 'Most groups arrive having already reorganized at least once. The useful first engagement is usually a measurement of why that did not hold, not a proposal to do it again.',
    servicePackages: [
      {
        name: 'Organization Diagnostic',
        description: 'For enterprises that have already restructured and did not get the change they paid for. What is actually slowing your execution, measured rather than surveyed.',
        deliverables: [
          'Decision latency measured on real cases across defined decision classes',
          'Escalation and bottleneck map against the current structure',
          'Span, layer and duplication analysis',
          'Critical roles and single points of failure identified',
          'Baseline set for every metric the work would be judged on',
        ],
      },
      {
        name: 'Workforce Strategy & Planning',
        description: 'For leadership teams who need to know which capabilities the strategy requires and where the gaps are, before you commit to a hiring or reskilling budget.',
        deliverables: [
          'Business strategy translated into role and capability demand',
          'Critical-role definition with succession risk rated',
          'Skills supply and gap analysis against real evidence',
          'Build, buy, borrow and redeploy recommendation per gap',
          'Workforce cost and scenario model leadership can run themselves',
        ],
      },
      {
        name: 'Operating Model & Organization Design',
        description: 'Structure, decision rights and accountability designed as one object, with your consultation path planned alongside rather than discovered at announcement.',
        deliverables: [
          'Target operating model and structure options, costed',
          'Decision rights assigned to named roles with thresholds',
          'Role charters and accountability definitions',
          'Governance and forum design, including what gets retired',
          'Consultation and works council sequencing by jurisdiction',
        ],
      },
      {
        name: 'Skills & Capability Program',
        description: 'A skills system built from evidence your business already generates, scoped as an operating commitment with an owner and a cadence rather than as a mapping deliverable.',
        deliverables: [
          'Skills taxonomy and role architecture',
          'Inventory built from project, certification and system evidence',
          'Named data owner and refresh cadence in the operating model',
          'Reskilling and redeployment pathways for the priority gaps',
          'Learning ecosystem pointed at gaps rather than at a catalog',
        ],
      },
      {
        name: 'HR Transformation & Managed Services',
        description: 'Modernizing the people function and, where carrying it is not realistic, running defined HR operations to service levels — with your team retaining the ability to take it back.',
        deliverables: [
          'HR operating model and service delivery design',
          'HCM configuration assessment before any license conversation',
          'People analytics and reporting layer',
          'Employment AI inventory with bias-audit and oversight posture',
          'Defined HR operations to service levels, with exit planning written in',
        ],
      },
    ],

    // ── By industry ───────────────────────────────────────────────
    // Each headline names the constraint that actually decides talent strategy
    // in that sector. The constraint is rarely the HR platform -- it is a
    // regulator, a labor market, a union agreement or a demographic curve.
    industryHeading: 'Talent and organization work,',
    industryHeadingHighlight: 'shaped by the real constraint.',
    industryLede: 'Eight sectors and the constraint that decides your answer in each. The platform is almost never the hard part.',
    industryUseCases: [
      {
        industry: 'Banking & Financial Services',
        headline: 'Regulators hold named individuals accountable, so decision rights are a compliance artifact rather than a design preference.',
        items: [
          'Senior manager accountability mapping',
          'Control function independence in the structure',
          'Decision rights evidenced for supervisory review',
          'Risk and compliance capability planning',
          'Remuneration governance alignment',
          'Succession for regulator-approved roles',
          'Conduct and culture measurement',
        ],
      },
      {
        industry: 'Healthcare & Life Sciences',
        headline: 'Clinical staffing is governed by ratios and licensure, so workforce planning is a safety question before it is an economic one.',
        items: [
          'Clinical and non-clinical workforce modeling',
          'Licensure, credentialing and scope-of-practice constraints',
          'Rostering and safe-staffing analysis',
          'Retention strategy for scarce clinical roles',
          'Career pathways for allied health',
          'Research and regulatory capability planning',
          'Burnout and workload measurement',
        ],
      },
      {
        industry: 'Manufacturing & Industrial',
        headline: 'A retiring generation holds process knowledge that was never written down, and the plant runs on it.',
        items: [
          'Institutional knowledge capture before retirement',
          'Skilled trades pipeline and apprenticeship design',
          'Shift and site operating model design',
          'Union and works council consultation planning',
          'Multi-site standardization versus local autonomy',
          'Frontline supervisor capability',
          'Automation impact on role design',
        ],
      },
      {
        industry: 'Retail & Consumer',
        headline: 'Frontline turnover is structural, so the design question is how fast someone becomes productive rather than how long they stay.',
        items: [
          'Time-to-productivity redesign for frontline roles',
          'Store and district operating model',
          'Seasonal and flexible workforce planning',
          'Frontline manager span and capability',
          'Internal progression from frontline to management',
          'Scheduling fairness and predictability',
          'High-volume hiring operations',
        ],
      },
      {
        industry: 'Technology & Software',
        headline: 'Engineering capacity is the constraint on strategy, and the org chart is usually three reorganizations behind the architecture.',
        items: [
          'Product and platform team topology',
          'Engineering capability and level framework',
          'Team boundaries aligned to system boundaries',
          'Technical career track design',
          'Build-versus-partner capability decisions',
          'Retention for scarce engineering skills',
          'Span and layer design for fast-growing teams',
        ],
      },
      {
        industry: 'Public Sector',
        headline: 'Structure, grading and pay are constrained by statute, so the room to maneuver is in decision rights and capability rather than in design.',
        items: [
          'Delegation within statutory constraints',
          'Grading and job evaluation alignment',
          'Capability frameworks for public service roles',
          'Cross-department shared capability',
          'Digital and data skills programs',
          'Accountability mapping for public scrutiny',
          'Workforce planning under fixed budget envelopes',
        ],
      },
      {
        industry: 'Energy & Utilities',
        headline: 'The energy transition needs capabilities the sector has never hired for, competing against every other sector for the same people.',
        items: [
          'Transition capability gap analysis',
          'Redeployment from declining to growing assets',
          'Safety-critical role and competence assurance',
          'Field workforce operating model',
          'Long-horizon workforce scenario modeling',
          'Technical apprenticeship and pipeline design',
          'Contractor and partner workforce governance',
        ],
      },
      {
        industry: 'Professional & Business Services',
        headline: 'The workforce is the product, so utilization, progression and partner economics are the operating model rather than inputs to it.',
        items: [
          'Pyramid and utilization modeling',
          'Progression and up-or-out design',
          'Practice and account operating models',
          'Capability-based staffing and resourcing',
          'Lateral hiring and integration',
          'Knowledge reuse and codification',
          'Partner and leadership succession',
        ],
      },
    ],

    // ── Practice cluster ──────────────────────────────────────────
    // The default heading names the internal department ("The complete
    // Platforms practice") and the default lede is one sentence, which left the
    // band at 36 words over 417px -- under the density floor. Overridden to
    // state the service boundary, which is the most useful thing this
    // particular link index can say on this page.
    practiceLabel: 'WORKFORCE INNOVATION',
    practiceHeading: 'Where talent and organization stops,',
    practiceHeadingHighlight: 'and another practice starts.',
    practiceLede: 'Talent work touches almost every part of an enterprise, which is why the boundary is worth stating. We own workforce strategy, organization design, decision rights, skills, leadership and the people function. Capability centers, shared services and process ownership, employment-AI model governance and the HCM platform program are each their own service — and the pages below go into those subjects at the depth this one gives organization design.',

    conciergeHeading: 'Ask about your own organization',
    conciergeIntro: 'Bring a real symptom — how long a decision takes, how many layers sit between a customer and a yes, how many critical roles have no successor. eQORE will tell you what it would measure first and what it would need from you.',
    conciergeChips: [
      'Why did our reorganization not change anything?',
      'How do we find out how long a decision actually takes?',
      'Is our skills framework worth maintaining?',
      'Is our AI screening tool legally defensible?',
      'Book an organization diagnostic',
    ],

    midCta: 'The chart changed. Check whether anything else did.',
    midCtaLabel: 'Book an Organization Diagnostic',
    closingCta: {
      title: 'One decision,',
      highlight: 'honestly timed.',
      body: 'Pick a decision your organization makes often and name the day it was last raised. In 30 minutes we will trace where it went, who could have decided it sooner, and what the structure would have to change for that to be true — before anyone proposes a new chart.',
      proofLabel: 'From first call to a measured organization diagnostic',
    },
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
