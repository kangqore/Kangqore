// ─── Kangqore Foundry — Premium Service Content (Phase G2 · PR 2) ─────────────
// Per-service premium presentation layer for Foundry. Each entry is an object
// that merges over the canonical base service from servicesData.js to produce
// the legacy-template-compatible shape consumed by ServicePageTemplate via
// ServicePageReal's PREMIUM_REGISTRY lookup.
//
// Per DoD #3: do NOT include base identity fields here (name, slug,
// departmentSlug, shortDescription). ServicePageReal re-asserts those after
// the spread and will silently drop any duplicates.
//
// Schema for each entry (all fields optional unless noted):
//   - titleLine1 (string)             — first line of hero title
//   - titleHighlight (string)         — gradient-highlighted line of hero title
//   - description (string | JSX)      — punchy hero description (overrides fullDescription)
//   - image (string)                  — hero/narrative image URL
//   - videoBackground (string)        — hero video URL
//   - primaryButton (object)          — { text, link }
//   - secondaryButton (object | null) — { text, link } or null to suppress
//   - stats (array)                   — [{ value, label, color }]
//   - hideGenericMidPageCta (bool)    — suppress template's generic CTA
//   - hideGenericFaq (bool)           — suppress template's generic FAQ
//   - highFidelity (object)           — { narrative, philosophy, matrix, schematic }
//   - capabilitiesTitle (string)      — title for the capabilities section
//   - capabilities (array)            — capability groups (legacy shape)
//   - customSections (JSX)            — JSX fragment containing dept-specific sections
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Network, Wifi, Cloud, Search, Layers, ShieldCheck, Activity, Server,
  TrendingUp, RefreshCw, Settings, Zap, Brain,
} from 'lucide-react';
import {
  APIPhilosophyBackground,
  APIPreMatrixSection,
  APIArchitectureShowcase,
  APIDiamondCoESection,
  ValueWeDeliverSection,
  DeliveryModelTimelline,
  APIFutureReadySection,
  APIExecutionEcosystem,
} from './APICustomSections';
import {
  IoTPhilosophyBackground,
  IoTWhySection,
  IoTValueDeliver,
  IoTDiamondCoESection,
  IoTDeliveryModel,
  IoTExecutionEcosystem,
  IoTFutureReadySection,
} from './IoTCustomSections';
// Phase D2 — 8 legacy Foundry service lifts (not-yet-wired services).
import { FOUNDRY_LEGACY_SECTIONS } from './foundry-services';

// ─── api-microservices-engineering (Foundry · T1) ─────────────────────────────
const apiMicroservicesEngineering = {
  titleLine1: 'API & Microservices',
  titleHighlight: 'Engineering.',
  description:
    'Kangqore helps organizations design and engineer modern API and microservices architectures that are resilient, governable, and ready for scale. We combine gateway strategy, service decomposition, discovery, security, observability, orchestration patterns, and runtime governance to help enterprises modernize delivery without creating architectural chaos.',
  image:
    'https://images.pexels.com/photos/8068255/pexels-photo-8068255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/business-meeting-6774639.mp4',

  primaryButton: { text: 'Schedule An Architecture Review', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '99.9%', label: 'Uptime Reliability', color: 'text-cyan-400' },
    { value: '65%', label: 'Faster Integration', color: 'text-blue-400' },
    { value: 'Zero', label: 'Security Breach', color: 'text-emerald-400' },
    { value: '24/7', label: 'Runtime Governance', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'API & MICROSERVICES :: ARCHITECTURAL DISCIPLINE',
      titleLine1: 'Architecting',
      titleHighlight: 'Resilient',
      titleLine2: 'Service Platforms',
      description:
        'Modern service environments demand more than just endpoints. They require boundary clarity, gateway foresight, delivery rigor, identity-first security, and the ability to adapt as service sprawl expands. At Kangqore, we engineer service ecosystems as resilient digital platforms.',
      bottleneckLabel: 'The Complexity Trap',
      bottleneckText:
        'Fragmented service sprawl and unmanaged API traffic create hidden security gaps, operational instability, and architectural chaos. Without governed control, distributed systems become liabilities rather than assets.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified engineering discipline that connects boundary analysis, gateway governance, service interaction modeling, and identity-first security into one cohesive, scalable ecosystem.',
      image:
        'https://images.pexels.com/photos/7793688/pexels-photo-7793688.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'Service Resilience',
      statusValue: '100% GOVERNED',
    },
    philosophy: {
      icon: <Network className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Integrate with Clarity.',
      titleHighlight: 'Scale with Rigor.',
      description:
        'We replace fragmented service sprawl with architected, governed service platforms designed for absolute engineering confidence.',
      bgElement: <APIPhilosophyBackground />,
      pills: ['Gateway Control', 'Domain Boundaries', 'Security-First', 'Observable Runtime'],
      features: [
        { title: 'Gateway Discipline', label: 'Centralized Traffic Control', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Design the gateway layer as a true control plane for routing, security, and policy enforcement across all service entry points.' },
        { title: 'Boundary Clarity', label: 'Domain-Driven Design', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Define service boundaries using domain context to reduce coupling and ensure services can evolve independently without cascading failures.' },
        { title: 'Security Rigor', label: 'Identity-First Security', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Embed zero-trust principles at every interaction point, using mTLS and identity-based governance to secure east-west traffic.' },
        { title: 'Runtime Control', label: 'Proactive Observability', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Integrate real-time monitoring and tracing into the service fabric to ensure total visibility and rapid fault isolation.' },
      ],
    },
    matrix: {
      engineId: 'Engine :: API_V2',
      title: 'Our Execution Matrix.',
      subtext:
        'A connected system for moving from service fragmentation to governed, scalable architectures.',
      layers: [
        { title: 'Define', id: 'API_DEF', icon: <Search />, desc: 'Context-driven boundary analysis and requirement deconstruction for service-ready foundations.' },
        { title: 'Architect', id: 'API_ARC', icon: <Layers />, desc: 'Foundation-first gateway, interaction, and security policy planning for resilient systems.' },
        { title: 'Engineer', id: 'API_ENG', icon: <Server />, desc: 'Rigor-led service implementation with automated pipelines and policy-as-code execution.' },
        { title: 'Operate', id: 'API_OPR', icon: <Activity />, desc: 'Trust-based observability, lifecycle control, and runtime governance for long-term stability.' },
      ],
    },
    schematic: {
      titleLine1: 'Architected Control.',
      titleHighlight: 'Sustainable Scale.',
      description:
        'Your API ecosystem should be your most resilient asset. We engineer it to stay that way—across every service release and integration milestone.',
      stats: [
        { label: 'Integration Speed', val: '+65%' },
        { label: 'Runtime Latency', val: '-45ms' },
        { label: 'Security Validation', val: '99.9%' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'API Gateway Strategy & Engineering',
      description:
        'Design the gateway layer as a true control plane for modern service ecosystems. We help organizations create cleaner API entry points that centralize routing, security, traffic control, and policy enforcement—without slowing down delivery teams or overloading backend services.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Single-entry API architecture design',
        'Routing, throttling, and policy enforcement',
        'Consumer-facing API exposure strategy',
        'Runtime gateway engineering and optimization',
      ],
      micro: 'Control and scale, without the chaos.',
    },
    {
      title: 'Microservices Architecture Design',
      description:
        'Break down systems into service models that are modular, composable, and aligned to business capabilities. Kangqore helps define service boundaries, interaction models, and domain-driven structures so distributed systems stay maintainable as scale, teams, and complexity increase.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Service decomposition and domain alignment',
        'Bounded-context-driven architecture planning',
        'Service interaction and dependency design',
        'Distributed system architecture blueprints',
      ],
      micro: 'Decompose monoliths securely and logically.',
    },
    {
      title: 'Identity, Security & Access Control',
      description:
        'Secure distributed services with architecture-led identity and access patterns. We design security into the platform from the start—helping organizations protect APIs, control service access, secure machine-to-machine communication, and enforce policy consistently across the environment.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'OAuth2 / token-based security models',
        'Authentication and authorization design',
        'Secure service-to-service communication',
        'Threat protection and security policy enforcement',
      ],
      micro: 'Security integrated directly into the fabric.',
    },
    {
      title: 'Service Registry & Discovery Enablement',
      description:
        'Make dynamic service environments easier to scale, route, and operate. Kangqore helps design discovery patterns and registry strategies that allow services to find each other reliably across changing runtime conditions, scaling events, and multi-instance environments.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Service registration strategy',
        'Discovery pattern design',
        'Registry availability and resilience planning',
        'Server-side discovery enablement',
      ],
      micro: 'Seamlessly locate and route in dynamic environments.',
    },
    {
      title: 'API Transformation & Protocol Mediation',
      description:
        'Support heterogeneous clients and evolving backend landscapes without increasing service sprawl. We help organizations manage differences in payloads, protocols, schemas, and client expectations through cleaner transformation logic that reduces coupling and improves interoperability.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Payload and schema transformation',
        'Header and protocol mediation',
        'Client-specific API design patterns',
        'Reusable transformation adapter strategy',
      ],
      micro: 'Connect diverse systems with ease.',
    },
    {
      title: 'Orchestration & Service Composition',
      description:
        'Compose distributed business flows without pushing the wrong logic into the gateway. Kangqore helps define where orchestration should live, how services should collaborate, and how complex workflows can be composed in ways that preserve clarity, resilience, and architectural discipline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Service orchestration architecture',
        'Composition-layer design',
        'Gateway vs orchestration boundary definition',
        'Distributed workflow enablement',
      ],
      micro: 'Business flows that actually scale.',
    },
    {
      title: 'Observability & Runtime Monitoring',
      description:
        'Create visibility across health, traffic, performance, and policy execution. We help organizations monitor API and service behavior in real time so engineering and operations teams can detect issues sooner, improve reliability, and make better runtime decisions.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Gateway health monitoring',
        'Traffic and API usage monitoring',
        'Performance and exception analytics',
        'Alerting and operational visibility',
      ],
      micro: 'See every call, trace every error.',
    },
    {
      title: 'Load Balancing, Scaling & Availability',
      description:
        'Engineer service platforms that can absorb traffic growth without losing stability. Kangqore designs scale and availability patterns that improve resilience under load, support failover readiness, and help service ecosystems grow without fragile runtime behavior.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Horizontal and vertical scale planning',
        'Load-balanced gateway design',
        'High-availability and failover patterns',
        'Zero-downtime configuration and rollout support',
      ],
      micro: 'Grow confidently without system fragility.',
    },
    {
      title: 'API Governance & Lifecycle Control',
      description:
        'Bring consistency, policy discipline, and lifecycle control to growing API estates. Kangqore helps organizations establish the standards, guardrails, and governance mechanisms needed to keep APIs secure, reusable, versioned, and manageable as services, teams, and consumers expand.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Runtime governance frameworks',
        'Throttling, rate limiting, and policy control',
        'API versioning and schema governance',
        'Design-time standards and review structures',
      ],
      micro: 'Consistency as your platform grows.',
    },
  ],

  customSections: (
    <div className="flex flex-col w-full">
      <APIPreMatrixSection />
      <APIArchitectureShowcase />
      <APIDiamondCoESection />
      <ValueWeDeliverSection />
      <DeliveryModelTimelline />
      <APIFutureReadySection />
      <APIExecutionEcosystem />
    </div>
  ),

  trustPillars: [
    { title: 'Gateway foresight before scaling', tag: 'Governance', description: 'Design entry points that centralize control without creating delivery bottlenecks.' },
    { title: 'Domain-aligned service boundaries', tag: 'Architecture', description: 'Ensure services are scoped for independence, maintainability, and long-term evolution.' },
    { title: 'Identity-first security protocols', tag: 'Security', description: 'Protect every service interaction with hardened authentication and zero-trust rigor.' },
    { title: 'Automated policy enforcement', tag: 'Compliance', description: 'Bake governance into the delivery pipeline to ensure consistency across the service sprawl.' },
    { title: 'Full-cycle service accountability', tag: 'Reliability', description: 'From boundary discovery to runtime observability, end-to-end ownership of service health.' },
    { title: 'Modernization-ready foundations', tag: 'Future-Ready', description: 'Architect for the next generation of digital products with scalable, decoupled platforms.' },
  ],

  technologies: [
    { category: 'Gateways & Management', items: ['Kong', 'Apigee', 'AWS API Gateway', 'Azure API Management', 'Tyk', 'MuleSoft Anypoint'] },
    { category: 'Service Mesh & Connectivity', items: ['Istio', 'Linkerd', 'Consul', 'Kuma', 'Traefik Mesh'] },
    { category: 'Runtimes & Frameworks', items: ['Spring Boot', 'Node.js', 'Go', 'Quarkus', 'Micronaut', '.NET Core'] },
    { category: 'Infrastructure & Orchestration', items: ['Kubernetes', 'Docker', 'Amazon ECS', 'Nomad', 'Terraform'] },
    { category: 'Observability & Control', items: ['Prometheus', 'Grafana', 'Jaeger', 'OpenTelemetry', 'Kiali', 'Dynatrace'] },
    { category: 'Security & Identity', items: ['OAuth2', 'JWT', 'Keycloak', 'Auth0', 'Okta', 'Vault'] },
    { category: 'Communication Patterns', items: ['gRPC', 'GraphQL', 'Kafka', 'RabbitMQ', 'WebSockets', 'REST'] },
  ],

  whyKangqore: [
    { title: 'Architecture-First Execution', description: "We don't just build endpoints; we design distributed systems that prioritize resilience and maintainability." },
    { title: 'Governed Engineering Rigor', description: 'We embed governance and security into the core engineering fabric, ensuring your ecosystem scales with absolute control.' },
    { title: 'Future-Ready Ecosystems', description: 'We help you prepare for service sprawl by building foundations that can adapt to changing technology and business demands.' },
  ],

  industries: [
    { name: 'Financial Services', description: 'Secure, high-performance API ecosystems meeting open banking and regulatory rigor.' },
    { name: 'Healthcare', description: 'Interoperable service architectures for patient data exchange and clinical workflow automation.' },
    { name: 'E-commerce', description: 'Scalable microservices for inventory, checkout, and personalized customer journeys.' },
    { name: 'Logistics', description: 'Real-time service layers for fleet tracking, route optimization, and supply chain visibility.' },
  ],

  customFAQs: [
    { question: 'What is the difference between an API Gateway and a Service Mesh?', answer: 'An API Gateway manages "north-south" traffic (external clients securely accessing internal services). A Service Mesh manages "east-west" traffic (how your internal microservices communicate, authenticate, and route data amongst themselves).' },
    { question: 'Do we need microservices, or is a modular monolith enough?', answer: 'It depends on your scale. If you face organizational bottlenecks, varied scaling requirements for specific features, or technology lock-in, microservices offer advantages. For many, a well-engineered modular monolith is the right first step before full decomposition.' },
    { question: 'How do you secure communication between microservices?', answer: 'We implement zero-trust principles within the internal network. This typically involves a service mesh that automatically issues and validates certificates for Mutual TLS (mTLS) combined with identity-based routing.' },
    { question: 'What happens when a service fails in a distributed environment?', answer: 'We engineer for failure using patterns like circuit breakers, retries, timeouts, and fallback mechanisms. The architecture must ensure that the failure of a single inventory service does not cascade and bring down the entire checkout flow.' },
    { question: 'How long does a microservices transformation take?', answer: 'We avoid "big bang" rewrites. We typically deploy a gateway facade in weeks to strangle the monolith, and sequentially migrate services over 6-12 months based on business priority and risk.' },
  ],

  ctaTitle: 'Scale Without Entropy.',
  ctaDescription: 'Transform fragmented service sprawl into a governed, resilient platform designed for absolute engineering confidence.',
  ctaButtonText: 'Consult a Lead Architect',
};

// ─── internet-of-things (Foundry · T1) ────────────────────────────────────────
const internetOfThings = {
  titleLine1: 'Internet Of Things',
  titleHighlight: '(IoT)',
  description:
    'Kangqore helps enterprises design, engineer, integrate, and operationalize IoT ecosystems that turn connected assets, devices, and environments into measurable business outcomes.',
  image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: {
    text: 'Schedule An IoT Strategy Review',
    link: '/contact?type=iot-strategy',
  },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Connect', label: 'Assets, devices, and services intelligently', color: 'text-cyan-400' },
    { value: 'Analyze', label: 'Turn live telemetry into business insight', color: 'text-blue-400' },
    { value: 'Transform', label: 'Improve workflows through connected operations', color: 'text-brand-blue' },
    { value: 'Scale', label: 'Move from pilot to enterprise-grade execution', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'STRATEGY & ARCHITECTURE',
      titleLine1: 'Beyond',
      titleHighlight: 'Connectivity.',
      titleLine2: '',
      description:
        'While others stop at getting devices to talk, we focus on what they say. Our IoT engineering unifies protocol rigor with business logic to transform raw sensor telemetry into high-integrity operational intelligence.',
      bottleneckLabel: 'The Data Trap',
      bottleneckText:
        'Fragmented IoT pilots that collect data without a defined path to business action or enterprise-scale governance.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified engineering discipline that connects device-side firmware, platform logic, and enterprise applications into one cohesive ecosystem.',
      image:
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
      statusLabel: 'System Integrity',
      statusValue: '100% OPERATIONAL',
    },
    philosophy: {
      icon: <Wifi className="w-7 h-7 text-brand-blue" />,
      title: 'IoT Engineering.',
      titleHighlight: 'Intelligence at the Edge.',
      description:
        'Total IoT success demands more than just a cloud connection. We engineer intelligence directly into the edge, ensuring your connected ecosystem is resilient, low-latency, and autonomous.',
      pills: ['Edge-First', 'Governed', 'Scalable', 'Action-Oriented'],
      CustomBackground: IoTPhilosophyBackground,
    },
    matrix: {
      engineId: 'Engine :: IOT_V3',
      title: 'Enablement Matrix',
      subtext:
        'Our IoT lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
      layers: [
        { title: 'Assess', id: 'IOT_ASSESS', icon: <Search />, desc: 'Discovery, opportunity analysis, and strategic alignment.' },
        { title: 'Design', id: 'IOT_DESIGN', icon: <Layers />, desc: 'Architecture design, platform selection, and solution planning.' },
        { title: 'Deliver', id: 'IOT_DEL', icon: <Activity />, desc: 'Structured implementation, integration, and deployment.' },
        { title: 'Govern', id: 'IOT_GOV', icon: <ShieldCheck />, desc: 'Monitoring, lifecycle management, and continuous optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Connected',
      titleHighlight: 'Intelligence.',
      description:
        'Every sensor, every signal, every data point — engineered into a connected ecosystem that drives real operational outcomes across your enterprise.',
      stats: [
        { label: 'Endpoint Scale', val: 'MILLIONS' },
        { label: 'Data-to-Insight', val: '< 200ms' },
        { label: 'Availability', val: '99.99%' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'IoT Strategy & Solution Development',
      description:
        'Define the right connected use case, architecture direction, and solution blueprint before implementation complexity compounds.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Requirement elicitation and opportunity analysis',
        'Business process modelling and technology consulting',
        'Problem statement definition and solution blueprinting',
        'Product and service enhancement strategy',
      ],
      micro: 'Strategic clarity before connected complexity.',
    },
    {
      title: 'Intelligent IoT Platforms',
      description:
        'Build secure, scalable, device-aware IoT platforms that support connectivity, analytics, and enterprise operations at scale.',
      bgImage: '/images/capabilities/iot-connected.png',
      items: [
        'Open platform architecture with end-to-end connectivity',
        'Multi-tenant, resource-efficient architecture',
        'Big data and business intelligence support',
        'Vendor-agnostic device virtualization and OTA readiness',
      ],
      micro: 'Scalable platforms for connected intelligence.',
    },
    {
      title: 'Connected Device Engineering',
      description:
        'Enable device-side innovation through hardware, firmware, prototyping, and IoT framework engineering.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Hardware and firmware product design',
        'PCB flow and fabrication support',
        'Device framework enablement',
        'Form-factor customization, prototyping, and certification',
      ],
      micro: 'From sensors to production-ready devices.',
    },
    {
      title: 'Vertical IoT Applications',
      description:
        'Create business applications that convert connected environments into usable workflows and user-facing experiences.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'End-device applications with protocol flexibility',
        'Native and mobile application development',
        'Data import/export-ready workflow support',
        'Re-engineering and customer-driven optimization',
      ],
      micro: 'Turning connected data into usable experiences.',
    },
    {
      title: 'End-to-End System Integration',
      description:
        'Connect IoT environments with the enterprise systems that actually run the business.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'CRM and web-content integration',
        'ERP system integration',
        'SMS and email gateway integration',
        'Multi-asset lifecycle-stage integration',
      ],
      micro: 'Bridge between connected systems and enterprise workflows.',
    },
    {
      title: 'IoT Testing & Quality Assurance',
      description:
        'Improve reliability across devices, platforms, and applications through dedicated IoT test coverage.',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Device lab testing',
        'Device field testing',
        'Platform testing',
        'Mobile and automated application testing',
      ],
      micro: 'Confidence across every connected layer.',
    },
    {
      title: 'Managed Services & Operational Support',
      description:
        'Keep connected environments stable, supported, and manageable after deployment.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Application management',
        'Cloud hosting support',
        'L1 / L2 / L3 support',
        'Incident management and command-center operations',
      ],
      micro: 'Ongoing stability for production IoT systems.',
    },
    {
      title: 'Platform Engineering & IIoT Enablement',
      description:
        'Modernize and scale connected platforms through cloud migration, edge processing, analytics, and IIoT-oriented engineering.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Cloud migration using microservices and web APIs',
        'IIoT enablement using Azure IoT, AWS IoT, and ThingWorx',
        'Edge processing frameworks',
        'Analytics and visualization across web and mobile',
      ],
      micro: 'Industrial-grade connected platform evolution.',
    },
    {
      title: 'DevOps, Automation & Solution Engineering',
      description:
        'Support long-term maintainability through automation, CI/CD, industrial test frameworks, and UX-led solution workflows.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Device and API test automation frameworks',
        'Continuous integration and deployment foundations',
        'Azure and AWS DevOps support',
        'UX-led secure workflow and application design',
      ],
      micro: 'Sustainable engineering for connected systems.',
    },
  ],

  customSections: (
    <div className="flex flex-col w-full">
      <IoTWhySection />
      <IoTValueDeliver />
      <IoTDiamondCoESection />
      <IoTDeliveryModel />
      <IoTExecutionEcosystem />
      <IoTFutureReadySection />
    </div>
  ),

  trustPillars: [
    { title: 'Platform-first connected architecture', tag: 'Architecture', description: 'Design IoT ecosystems that prioritize platform scalability, device intelligence, and operational control.' },
    { title: 'Enterprise-grade integration by default', tag: 'Integration', description: 'Ensure IoT systems connect cleanly with ERP, CRM, gateways, and broader enterprise data flows.' },
    { title: 'Lifecycle operations discipline', tag: 'Operations', description: 'Support IoT success through onboarding, monitoring, managed support, and continuous platform evolution.' },
  ],

  technologies: [
    { category: 'Platforms & Ecosystem', items: ['Microsoft Azure IoT', 'AWS IoT', 'PTC ThingWorx', 'MongoDB', 'WindRiver', 'Intel'] },
    { category: 'Industry Standards', items: ['TSDSI', 'Industrial Internet Consortium', 'OPC Foundation', 'MQTT Protocol'] },
    { category: 'Engineering Themes', items: ['Microservices', 'Web APIs', 'Edge Processing', 'Business Intelligence', 'Device Virtualization', 'OTA Updates'] },
    { category: 'Advanced Analytics', items: ['Asset Analytics & Condition Monitoring', 'Predictive Maintenance', 'Conversational Interfaces', 'Video Intelligence', 'OCR & Image Classification', 'NLP & Text Mining'] },
  ],

  whyKangqore: [
    { title: 'Dedicated IoT Engineering Pods', description: 'Cross-functional squads with embedded device, platform, analytics, and integration specialists assigned to your program from day one.' },
    { title: 'Agile Connected Delivery', description: 'Sprint-based delivery with IoT-specific ceremonies — device readiness reviews, platform health checks, and telemetry validation gates.' },
    { title: 'Global Delivery with Local Context', description: "Delivery centers across time zones, paired with domain consultants who understand your industry's connected-system requirements." },
    { title: 'Partnership Ecosystem', description: 'Certified partnerships with Azure IoT, AWS IoT, PTC ThingWorx, and Intel — ensuring platform decisions are backed by vendor-level expertise.' },
    { title: 'Security-by-Design Discipline', description: 'Device identity, OTA security, encrypted telemetry, and zero-trust architecture principles are embedded into every engagement.' },
    { title: 'Outcome-Based Engagement Models', description: 'Flexible pricing — from fixed-scope PoCs to managed IoT operations — aligned with your business outcomes, not just effort.' },
  ],

  industries: [
    { name: 'Smart Industries', description: 'For manufacturing, energy, and utilities environments, IoT helps reimagine operations, improve process visibility, and unlock more resilient, efficient industrial systems.' },
    { name: 'Smart Living', description: 'For wearables, healthcare, and security environments, IoT helps create safer, healthier, and more responsive connected experiences.' },
    { name: 'Smart Enterprises', description: 'For buildings, offices, retail, and connected enterprise environments, IoT helps link people, machines, and information to improve security, efficiency, and operational intelligence.' },
  ],

  customFAQs: [
    { question: 'What business value does IoT create for enterprises?', answer: 'IoT creates business value by connecting assets and scaling operations efficiently, acting on real-time data, transforming business processes, improving decisions with augmented intelligence, and managing end-to-end connected processes.' },
    { question: 'Where is IoT most commonly applied?', answer: 'IoT is most commonly applied across smart industries (manufacturing, energy, utilities), smart living (wearables, healthcare, security), and smart enterprises (connected buildings, offices, retail environments).' },
    { question: 'How do enterprises move from IoT pilots to production?', answer: 'By progressing through a structured three-phase model: Proof of Concept (validate connected use cases), Productization (build scalable connected products), and Operationalization (establish monitoring, onboarding, and managed operations).' },
    { question: 'Why is enterprise integration important in IoT?', answer: 'Because IoT value is only realized when connected systems work alongside ERP, CRM, gateways, and broader enterprise workflows — creating actual operational value instead of isolated data streams.' },
    { question: 'What capabilities matter most in a full IoT partner?', answer: 'A complete IoT partner should provide strategy and consulting, intelligent platform engineering, connected device enablement, vertical applications, system integration, testing, managed support, IIoT enablement, and DevOps automation.' },
    { question: 'What IoT platforms and technologies does Kangqore work with?', answer: 'We work across Microsoft Azure IoT, AWS IoT, PTC ThingWorx, MongoDB, WindRiver, Intel, along with microservices, web APIs, edge processing, analytics, device virtualization, and OTA update frameworks.' },
  ],

  ctaTitle: 'Ready to build a connected platform that scales from pilot to production?',
  ctaDescription: 'Connect your assets, engineering insights, and business outcomes with Kangqore.',
  ctaButtonText: 'Talk to Our IoT Architects',
};

// ─── managed-cloud-services (Foundry · T3) ────────────────────────────────────
const managedCloudServices = {
  description:
    'Modern cloud environments are powerful — but without operational discipline, cost control, and security governance, they become fragile and expensive. Kangqore delivers engineered cloud operations built on SRE, FinOps, and SecOps principles.',
  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',

  primaryButton: { text: 'Request a Cloud Assessment', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '24/7', label: 'Operational Monitoring', color: 'text-cyan-400' },
    { value: 'SRE', label: 'Grade Reliability', color: 'text-blue-400' },
    { value: 'FinOps', label: 'Cost Governance', color: 'text-emerald-400' },
    { value: 'Zero', label: 'Trust Security', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Cloud Operations :: 2026',
      titleLine1: 'Run. Optimize.',
      titleHighlight: 'Secure & Scale.',
      titleLine2: 'Always On.',
      description:
        'Without structured cloud operations, costs spiral unpredictably, security posture weakens, downtime risk increases, and engineering velocity slows. Kangqore delivers 24/7 reliability, measurable cost governance, continuous compliance, and proactive optimization.',
      bottleneckLabel: 'The Impediment',
      bottleneckText:
        'Uncontrolled cloud sprawl leads to spiraling costs, security gaps, and operational fragility.',
      requirementLabel: 'The Requirement',
      requirementText:
        'SRE, FinOps, and SecOps principles working in unison for resilient, optimized cloud operations.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
      statusLabel: 'Operations',
      statusValue: 'Always-On',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-brand-blue" />,
      title: 'Operational Excellence.',
      titleHighlight: 'Six Measurable Outcomes.',
      description:
        'Our Managed Cloud Services are structured around six outcomes: Enhanced Business Scalability, Improved Security & Compliance, Full Visibility & Observability, High Availability & Reliability, Cost-Efficient Engagement Models, and Dynamic & Robust Infrastructure.',
      pills: ['SRE-Driven', 'FinOps-Governed', 'SecOps-Embedded', 'Always-On'],
    },
    matrix: {
      engineId: 'Engine :: CloudOps_V4',
      title: 'Cloud Operations Matrix',
      subtext:
        'Four operational pillars — Adopt, Run, Optimize, Secure — that govern every managed cloud engagement.',
      layers: [
        { title: 'Adopt', id: 'COP_ADOPT', icon: <Search />, desc: 'Cloud readiness, landing zone setup, governance baselines, and secure multi-cloud design.' },
        { title: 'Run', id: 'COP_RUN', icon: <Activity />, desc: '24/7 monitoring, SLA/SLO management, backup & DR, and infrastructure automation.' },
        { title: 'Optimize', id: 'COP_OPT', icon: <TrendingUp />, desc: 'FinOps cost optimization, performance tuning, rightsizing, and usage analytics.' },
        { title: 'Secure', id: 'COP_SEC', icon: <ShieldCheck />, desc: 'Security hardening, IAM governance, compliance audits, and vulnerability management.' },
      ],
    },
    schematic: {
      titleLine1: 'Cloud as a',
      titleHighlight: 'Performance Engine.',
      description:
        'When SRE discipline, FinOps governance, and SecOps rigor operate as an integrated system — cloud becomes a strategic competitive advantage, not an infrastructure liability.',
      stats: [
        { label: 'Reliability', val: 'SLO-DRIVEN' },
        { label: 'Cost Control', val: 'FINOPS' },
        { label: 'Security', val: 'ZERO-TRUST' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Cloud Consulting',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        "Cloud transformation without architectural clarity leads to cost overruns and instability. Kangqore's Cloud Consulting establishes a structured foundation before execution begins.",
      items: [
        { heading: 'Cloud Maturity & Readiness Assessment', description: 'Evaluate your current cloud posture, identify gaps, and define a roadmap aligned to business goals.' },
        { heading: 'Target-State Architecture Blueprint', description: 'Design the landing zone, governance framework, and multi-cloud or hybrid architecture strategy.' },
        { heading: 'Cost Modeling & ROI Forecasting', description: 'Build financial models that justify cloud investments with clear ROI projections and cost controls.' },
        { heading: 'Migration Prioritization Roadmap', description: 'Sequence workload migrations by business priority, risk, and technical readiness.' },
      ],
    },
    {
      title: 'Cloud Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        "Migration is not just \"moving servers.\" It's business continuity engineering. Kangqore executes structured migration programs that preserve data integrity and user experience.",
      items: [
        { heading: 'Application & Dependency Mapping', description: 'Comprehensive discovery of application dependencies before any migration begins.' },
        { heading: 'Database Migration Strategies', description: 'Rehost, replatform, or refactor strategies aligned to application criticality and target architecture.' },
        { heading: 'Cutover Planning & Rollback', description: 'Cutover planning with rollback mechanisms and downtime minimization strategies.' },
        { heading: 'Post-Migration Validation', description: 'Security hardening during transition and comprehensive post-migration performance testing.' },
      ],
    },
    {
      title: 'Cloud Optimization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Many organizations overspend 20–40% due to poor resource planning. Kangqore introduces structured FinOps discipline to convert cloud spend into strategic investment.',
      items: [
        { heading: 'Resource Rightsizing & Auto-Scaling', description: 'Eliminate over-provisioning with rightsizing analysis and auto-scaling tuning.' },
        { heading: 'Cost Anomaly Detection', description: 'Proactive detection of cost anomalies before they escalate into budget overruns.' },
        { heading: 'Reserved Instance Strategy', description: 'Reserved instance and savings plan strategies that reduce committed spend by 30–60%.' },
        { heading: 'Cloud Spend Transparency Dashboards', description: 'Real-time dashboards that give engineering and finance teams full visibility into cloud expenditure.' },
      ],
    },
    {
      title: 'Cloud Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Legacy applications slow innovation. We modernize them into resilient, cloud-native systems architected for the next decade.',
      items: [
        { heading: 'Monolith-to-Microservices Transformation', description: 'Decompose monolithic applications into independently deployable, scalable microservices.' },
        { heading: 'Containerization (Docker & Kubernetes)', description: 'Containerize workloads and orchestrate them via Kubernetes for portability and resilience.' },
        { heading: 'Serverless & Event-Driven Architecture', description: 'Adopt serverless and event-driven patterns for elastic, cost-efficient compute.' },
        { heading: 'Database Modernization', description: 'Migrate to managed DB services and NoSQL solutions to reduce operational overhead.' },
      ],
    },
    {
      title: 'Cloud Monitoring & Support',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        "Cloud environments require continuous visibility and proactive intervention. We don't wait for outages — we predict and prevent them.",
      items: [
        { heading: 'Centralized Observability Dashboards', description: 'Unified dashboards covering cost, performance, latency, usage, and anomaly signals.' },
        { heading: 'Application Performance Monitoring (APM)', description: 'End-to-end APM covering service-level indicators and user experience metrics.' },
        { heading: 'Log Aggregation & Anomaly Detection', description: 'Automated log aggregation with ML-assisted anomaly detection and escalation workflows.' },
        { heading: 'SLA / SLO Management', description: 'Define and enforce SLOs with automated incident response and root cause analysis workflows.' },
      ],
    },
    {
      title: 'Cloud Security & Compliance',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Security cannot be an afterthought. Kangqore integrates SecOps directly into cloud operations — from design to runtime.',
      items: [
        { heading: 'Zero-Trust Architecture', description: 'Implement zero-trust network models with identity verification at every access layer.' },
        { heading: 'IAM & RBAC Governance', description: 'Identity & access management governance with role-based access control and least-privilege enforcement.' },
        { heading: 'Continuous Vulnerability Scanning', description: 'Automated vulnerability scanning, security posture monitoring, and patch management workflows.' },
        { heading: 'Regulatory Compliance Alignment', description: 'Compliance alignment for ISO, SOC 2, GDPR, HIPAA, and audit readiness reporting.' },
      ],
    },
    {
      title: 'DevOps on Cloud',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Cloud performance accelerates when DevOps discipline is embedded. Automation-first engineering reduces deployment risk and increases release velocity.',
      items: [
        { heading: 'CI/CD Pipeline Design & Automation', description: 'Design and implement CI/CD pipelines that automate testing, building, and deployment workflows.' },
        { heading: 'Infrastructure-as-Code (IaC)', description: 'Terraform and CloudFormation implementations for consistent, version-controlled infrastructure.' },
        { heading: 'DevSecOps Integration', description: 'Embed security scanning, compliance checks, and policy enforcement into every pipeline stage.' },
        { heading: 'Release Governance & Rollback', description: 'Release governance frameworks with automated rollback strategies for zero-impact deployments.' },
      ],
    },
    {
      title: 'Backup & Disaster Recovery',
      bgImage: '/images/capabilities/business-strategy.png',
      description:
        "Downtime is not a technical issue — it's a revenue risk. Kangqore builds resilient recovery frameworks that ensure systems recover quickly, predictably, and without data loss.",
      items: [
        { heading: 'Automated Backup Policies', description: 'Automated, policy-driven backup schedules with geo-redundant replication and archival strategies.' },
        { heading: 'Disaster Recovery Architecture', description: 'DR architecture design with RPO/RTO definition aligned to business continuity requirements.' },
        { heading: 'Failover Automation', description: 'Automated failover systems that activate without manual intervention during incident scenarios.' },
        { heading: 'Recovery Drills & Simulation Testing', description: 'Regular recovery drills and simulation testing to validate DR readiness before incidents occur.' },
      ],
    },
  ],

  technologies: [
    { category: 'Cloud Platforms', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Multi-cloud & Hybrid Architectures'] },
    { category: 'Monitoring & Observability', items: ['Datadog', 'New Relic', 'Prometheus', 'Grafana', 'CloudWatch', 'Azure Monitor', 'Google Cloud Operations'] },
    { category: 'DevOps & Automation', items: ['Terraform', 'Ansible', 'CloudFormation', 'GitHub Actions', 'Azure DevOps', 'Jenkins', 'ArgoCD'] },
    { category: 'Containers & Orchestration', items: ['Docker', 'Kubernetes (EKS, AKS, GKE)', 'Helm', 'Istio Service Mesh', 'Serverless Frameworks'] },
    { category: 'Security & Compliance', items: ['AWS GuardDuty', 'Azure Sentinel', 'Prisma Cloud', 'HashiCorp Vault', 'CrowdStrike', 'Qualys', 'SIEM Stacks'] },
    { category: 'FinOps & Cost Management', items: ['AWS Cost Explorer', 'Azure Cost Management', 'CloudHealth', 'Apptio Cloudability', 'Spot.io'] },
  ],

  whyKangqoreIntro: 'Kangqore treats cloud operations as an engineering discipline — not a support contract. We bring SRE rigor, FinOps discipline, and SecOps integration together into a unified managed services model that delivers measurable outcomes: reliability, cost control, security, and operational velocity.',
  whyKangqore: [
    { title: 'SRE-Grade Reliability Engineering', description: 'SLO-driven operations with incident response discipline and uptime accountability.' },
    { title: 'FinOps Cost Governance', description: 'Structured financial operations that convert cloud spend from a variable liability into a controlled investment.' },
    { title: 'SecOps Embedded by Design', description: 'Zero-trust security, IAM governance, and compliance alignment built into cloud operations from day one.' },
    { title: 'Full-Stack Observability', description: 'End-to-end monitoring of cost, performance, latency, usage, and anomalies — not just uptime metrics.' },
    { title: 'Automation-First Operations', description: 'Infrastructure automation, IaC, and DevOps pipelines reduce toil and accelerate response times.' },
  ],

  industryIntro: 'Managed cloud operations underpin mission-critical systems across every industry. Our SRE, FinOps, and SecOps capabilities are adapted to the specific compliance, performance, and cost requirements of each sector.',
  industries: [
    { name: 'Banking & Financial Services', description: 'Compliance-aware cloud operations, security hardening, and zero-downtime reliability for regulated environments.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA-aligned cloud management, clinical data governance, and secure infrastructure operations.' },
    { name: 'Retail & eCommerce', description: 'Auto-scaling for peak traffic, cost optimization, and always-on platform reliability.' },
    { name: 'Manufacturing', description: 'IoT data pipeline management, operational technology integration, and disaster recovery planning.' },
    { name: 'Technology & SaaS', description: 'Multi-cloud architecture management, DevOps automation, and FinOps optimization for SaaS platforms.' },
    { name: 'Energy & Utilities', description: 'Secure infrastructure management, compliance automation, and high-availability operations.' },
  ],

  customFAQs: [
    { question: 'What is the difference between Managed Cloud Services and standard cloud support?', answer: 'Managed Cloud Services goes beyond reactive support — it includes proactive monitoring, FinOps cost governance, security hardening, SRE-driven reliability engineering, and continuous optimization as an ongoing operational discipline.' },
    { question: 'Do you support multi-cloud environments?', answer: 'Yes. We manage workloads across AWS, Azure, and GCP — including hybrid and multi-cloud architectures. Our governance frameworks are designed to provide unified visibility and control regardless of provider.' },
    { question: 'How quickly can you reduce our cloud costs?', answer: 'Most organizations see 15–35% cost reduction within the first 60–90 days through rightsizing, idle resource elimination, and reserved instance optimization. Long-term FinOps governance sustains and compounds these savings.' },
    { question: 'How do you handle security and compliance?', answer: 'Security is embedded by design — not added after deployment. We implement zero-trust architecture, continuous vulnerability scanning, IAM governance, and regulatory compliance alignment (ISO, SOC 2, GDPR, HIPAA) from day one.' },
    { question: 'What SLAs do you commit to for monitoring and incident response?', answer: 'We define and manage to SLOs (Service Level Objectives) agreed with your team, covering uptime, incident response times, and mean time to recovery (MTTR). All commitments are documented and tracked via observability dashboards.' },
  ],
};

// ─── aws (Foundry · T3) ───────────────────────────────────────────────────────
const aws = {
  description: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Accelerate cloud-native transformation with secure, scalable, and performance-optimized AWS architectures.
      </h2>
      <p>
        Kangqore helps enterprises design, migrate, modernize, and optimize workloads on AWS — combining deep cloud engineering expertise with governance-first execution.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80',

  primaryButton: { text: 'Request a Consultation', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: '99.99%', label: 'Availability', color: 'text-cyan-400' },
    { value: 'Zero', label: 'Migration Downtime', color: 'text-blue-400' },
    { value: '40%+', label: 'Cost Reduction', color: 'text-emerald-400' },
    { value: '10x', label: 'Deployment Speed', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Cloud Transformation :: 2026',
      titleLine1: 'Cloud',
      titleHighlight: 'Resilience',
      titleLine2: 'at Scale.',
      description:
        'Most organizations move to AWS for agility, yet struggle with architecture complexity, uncontrolled spend, and security misconfigurations.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Fragmented modernization & skyrocketing cloud waste.',
      requirementLabel: 'The Requirement',
      requirementText: 'Observable, secure, and performance-optimized systems.',
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      statusLabel: 'Cloud Health',
      statusValue: 'AWS_Optimized',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-brand-blue" />,
      title: 'AWS',
      titleHighlight: 'Well-Architected by Default.',
      description:
        'We engineer cloud-native ecosystems that are resilient, observable, secure, and optimized for scale — moving beyond basic adoption into high-velocity execution.',
      pills: ['Enterprise ROI', 'Hardened Security', 'DevOps Velocity', 'Zero Cloud Debt'],
    },
    matrix: {
      engineId: 'Engine :: AWS_WellArchi',
      title: 'Enablement Matrix',
      subtext:
        'End-to-end AWS cloud engineering deconstructed into modular, scalable, and governed delivery layers.',
      layers: [
        { title: 'Adoption', id: 'AWS_STRAT', icon: <Layers />, desc: 'AWS roadmaps aligned with business outcomes.' },
        { title: 'Modernization', id: 'AWS_CORE', icon: <RefreshCw />, desc: 'Transform legacy workloads into cloud-native architectures.' },
        { title: 'DevOps', id: 'AWS_AUTOM', icon: <Settings />, desc: 'Automated CI/CD pipelines and Infrastructure as Code.' },
        { title: 'Governance', id: 'AWS_SEC', icon: <ShieldCheck />, desc: 'Hardened security frameworks and FinOps optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Accelerate',
      titleHighlight: 'Innovation.',
      description:
        'Your AWS environment should not be a technical burden. It should be the foundation for undisputed digital advantage.',
      stats: [
        { label: 'Security', val: 'HARDENED' },
        { label: 'Cost', val: 'OPTIMIZED' },
        { label: 'Agility', val: 'MAXIMIZED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Cloud Strategy & Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Accelerate your cloud journey with data-driven readiness assessments, TCO analysis, and tailored migration roadmaps. We ensure secure, structured cloud adoption without disruption. Kangqore Strategy offering helps you with:',
      items: [
        'AWS readiness assessment',
        'Migration roadmap & TCO analysis',
        'Lift-and-shift & re-platforming',
        'Application re-architecture',
        'Multi-account landing zone setup',
        'Hybrid & multi-cloud integration',
      ],
    },
    {
      title: 'Cloud-Native Engineering',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Build resilient, automated, and scalable cloud-native systems using containerization, serverless architectures, and Infrastructure as Code. Kangqore Cloud-Native offering helps you with:',
      items: [
        'Containerization (EKS, ECS)',
        'Serverless architectures (Lambda, API Gateway)',
        'Infrastructure as Code (Terraform / CloudFormation)',
        'CI/CD pipeline automation',
        'GitOps & DevSecOps integration',
        'Observability & monitoring frameworks',
      ],
    },
    {
      title: 'Optimization & Governance',
      bgImage: '/images/capabilities/business-strategy.png',
      description:
        'Enhance your AWS environment with performance, control, and measurable ROI through Well-Architected reviews and FinOps strategies. Kangqore Optimization offering helps you with:',
      items: [
        'AWS Well-Architected Framework review',
        'Cost optimization & FinOps strategy',
        'IAM & access control hardening',
        'Compliance-ready cloud architecture',
        'Disaster recovery & high availability',
        'Continuous performance tuning',
      ],
    },
    {
      title: 'AWS Data & AI Enablement',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description:
        'Transform AWS into an AI-ready digital backbone with data lakes, real-time streaming, and MLOps pipelines. Kangqore Data/AI offering helps you with:',
      items: [
        'Data lakes & analytics on AWS',
        'Real-time streaming (Kinesis)',
        'AI/ML deployment (SageMaker)',
        'MLOps pipelines',
        'Personalization & intelligent services',
        'Generative AI (Bedrock) integration',
      ],
    },
  ],

  technologies: [
    { category: 'Core AWS Services', items: ['EC2', 'S3', 'RDS', 'Aurora', 'DynamoDB', 'Lambda', 'ECS', 'EKS', 'API Gateway', 'CloudFront', 'VPC', 'Route53'] },
    { category: 'Security & Governance', items: ['IAM', 'AWS Organizations', 'Control Tower', 'GuardDuty', 'Security Hub', 'WAF', 'Shield'] },
    { category: 'DevOps & Automation', items: ['CloudFormation', 'Terraform', 'CodePipeline', 'CodeBuild', 'GitHub Actions', 'Jenkins'] },
    { category: 'Data & Analytics', items: ['Redshift', 'Glue', 'EMR', 'Kinesis', 'Athena', 'QuickSight'] },
    { category: 'AI/ML on AWS', items: ['SageMaker', 'Bedrock', 'Personalize', 'Rekognition', 'Comprehend'] },
  ],

  whyKangqore: [
    { title: 'Architecture Frameworks', description: 'Enterprise-grade AWS Well-Architected deployments tailored for high-scale environments.' },
    { title: 'Security-First Approach', description: 'Hardened IAM, access controls, and compliance-ready architectures built into every layer.' },
    { title: 'Multi-Industry Delivery', description: 'Proven experience delivering complex AWS solutions for BFSI, Retail, and Healthcare.' },
    { title: 'DevOps-Integrated Cloud', description: 'Native CI/CD and IaC execution patterns for high-velocity software delivery.' },
    { title: 'AI & Data-Driven Strategy', description: 'Forward-looking cloud roadmaps designed for long-term AI and data innovation.' },
  ],

  industries: [
    { name: 'BFSI (Banking & Insurance)' },
    { name: 'Retail & eCommerce' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'SaaS & Technology Startups' },
    { name: 'Manufacturing' },
    { name: 'Media & Technology' },
  ],

  ctaTitle: 'Build Your AWS Cloud with Confidence',
  ctaDescription: 'Whether you’re migrating, modernizing, or optimizing — Kangqore helps you design AWS environments that drive performance.',
  ctaButtonText: 'Schedule an AWS Strategy Session',
};

// ─── microsoft-services (Foundry · T3) ────────────────────────────────────────
const microsoftServices = {
  description: (
    <div>
      <p className="mb-4">
        Microsoft technologies are powerful. But real enterprise value comes from architectural discipline, integration clarity, and operational control.
      </p>
      <p>
        Kangqore helps organizations move beyond tool adoption toward structured, scalable Microsoft implementations that drive measurable outcomes.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',

  primaryButton: { text: 'Request a Consultation', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Unified', label: 'Identity & Access', color: 'text-cyan-400' },
    { value: 'Zero', label: 'Trust Gaps', color: 'text-blue-400' },
    { value: '100%', label: 'Ecosystem Synergy', color: 'text-emerald-400' },
    { value: 'Resilient', label: 'Azure Core', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Enterprise Ecosystem :: 2026',
      titleLine1: 'Build. Modernize.',
      titleHighlight: 'Secure & Scale.',
      titleLine2: 'On Microsoft.',
      description:
        'Real enterprise value on the Microsoft stack comes from architectural discipline, integration clarity, and operational control — not just tool adoption.',
      bottleneckLabel: 'The Impediment',
      bottleneckText:
        'Ecosystems grow faster than architecture discipline — creating fragmentation, inconsistency, and security gaps.',
      requirementLabel: 'The Requirement',
      requirementText:
        'Governed, integrated Microsoft environments engineered for sustainable transformation.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
      statusLabel: 'Ecosystem Health',
      statusValue: 'Hardened',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-brand-blue" />,
      title: 'Engineering-First',
      titleHighlight: 'Microsoft Delivery.',
      description:
        'We approach Microsoft services as structured engineering programs — not tool deployments. Every implementation is evaluated for scalability, operational resilience, cost control, and lifecycle sustainability.',
      pills: ['Architecture-Led', 'Governance-First', 'Security-by-Default', 'Outcome-Driven'],
    },
    matrix: {
      engineId: 'Engine :: Azure_Aria_V3',
      title: 'Enablement Matrix',
      subtext:
        'Our Microsoft lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
      layers: [
        { title: 'Assess', id: 'MST_MAP', icon: <Search />, desc: 'Ecosystem audit, workload readiness, and architecture review.' },
        { title: 'Architect', id: 'MST_CORE', icon: <Layers />, desc: 'Designing resilient Azure, M365, and Dynamics 365 blueprints.' },
        { title: 'Execute', id: 'MST_GO', icon: <Zap />, desc: 'Deploying governed automation, cloud, and platform workloads.' },
        { title: 'Govern', id: 'MST_RULE', icon: <ShieldCheck />, desc: 'Security posture, monitoring frameworks, and lifecycle controls.' },
      ],
    },
    schematic: {
      titleLine1: 'Integrated Systems.',
      titleHighlight: 'Not Fragmented Toolsets.',
      description:
        'When AI enablement, cloud engineering, automation, and advanced analytics operate cohesively — your Microsoft ecosystem becomes a competitive advantage.',
      stats: [
        { label: 'Governance', val: 'EMBEDDED' },
        { label: 'Security', val: 'HARDENED' },
        { label: 'Scale', val: 'CONTROLLED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'App Modernization',
      bgImage: '/images/capabilities/software-engineering.png',
      description:
        "Modernizing legacy systems is not about rewriting everything — it's about making smart architectural decisions.",
      items: [
        { heading: 'Portfolio Rationalization', description: 'Assess application portfolios for modernization readiness.' },
        { heading: 'Migration Pathways', description: 'Identify refactor, re-platform, or re-architect pathways.' },
        { heading: 'Performance Optimization', description: 'Improve performance, maintainability, and cost-efficiency.' },
        { heading: 'Cloud-Native Alignment', description: 'Align applications with cloud-native best practices and reduce technical debt.' },
      ],
    },
    {
      title: 'Modern Workplace',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Digital collaboration requires structure, governance, and security.',
      items: [
        { heading: 'Secure Collaboration Architecture', description: 'Design governance-aware collaboration environments that scale with distributed teams.' },
        { heading: 'Identity & Access Governance', description: 'Align identity and access controls with enterprise security requirements.' },
        { heading: 'Productivity Standardization', description: 'Standardize productivity environments across user groups and devices.' },
        { heading: 'Adoption Enablement', description: 'Structured adoption frameworks for distributed teams ensuring compliance.' },
      ],
    },
    {
      title: 'Microsoft Dynamics 365',
      bgImage: '/images/capabilities/growth-marketing.png',
      description: 'ERP and CRM systems must support operational velocity — not slow it down.',
      items: [
        { heading: 'CRM/ERP Integration Strategy', description: 'Business workflow analysis and system alignment for operational clarity.' },
        { heading: 'Custom Workflow Design', description: 'Customization and integration planning aligned to enterprise processes.' },
        { heading: 'Reporting Layer Optimization', description: 'Reporting and data visibility enablement across operational functions.' },
        { heading: 'Scalable Architecture', description: 'Scalable architecture planning for long-term operational growth.' },
      ],
    },
    {
      title: 'Connected Products',
      bgImage: '/images/capabilities/iot-connected.png',
      description: 'Connected ecosystems require structured engineering.',
      items: [
        { heading: 'Integration Framework Design', description: 'Design integration frameworks for device/platform connectivity.' },
        { heading: 'Scalable Data Flows', description: 'Enable scalable data flows between products and enterprise systems.' },
        { heading: 'IoT-Ready Architecture', description: 'IoT-ready integration architecture with event-driven patterns.' },
        { heading: 'Operational Alignment', description: 'Align connected product strategies with operational enterprise systems.' },
      ],
    },
    {
      title: 'Analytics & AI',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Data without structure becomes noise.',
      items: [
        { heading: 'Enterprise Analytics Architecture', description: 'Design data platforms aligned to business KPIs and decision workflows.' },
        { heading: 'Insight Pipeline Planning', description: 'Build insight pipelines from raw data to actionable business intelligence.' },
        { heading: 'Governance-Aware AI Enablement', description: 'AI readiness assessment with governance and compliance guardrails.' },
        { heading: 'Data-to-Decision Frameworks', description: 'Structured frameworks that convert data into measurable enterprise decisions.' },
      ],
    },
    {
      title: 'Azure & Azure Sentinel',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Security is foundational — not optional.',
      items: [
        { heading: 'Cloud Security Posture Alignment', description: 'Secure cloud architecture design reviewed against industry benchmarks.' },
        { heading: 'Monitoring & Threat Detection', description: 'Monitoring framework implementation and alert architecture design.' },
        { heading: 'Incident Visibility Frameworks', description: 'Incident workflow mapping and security visibility gap analysis.' },
        { heading: 'Risk Mitigation Modeling', description: 'Structured risk mitigation modeling embedded into architecture design.' },
      ],
    },
    {
      title: 'Power Platform',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Low-code must still follow engineering discipline.',
      items: [
        { heading: 'App Governance Frameworks', description: 'Citizen development guardrails that prevent shadow IT from proliferating.' },
        { heading: 'Workflow Automation Patterns', description: 'Structured automation patterns aligned to enterprise process governance.' },
        { heading: 'Innovation Acceleration', description: 'Internal innovation acceleration with platform oversight controls.' },
        { heading: 'Process Digitization Strategy', description: 'Process digitization strategy that empowers business teams responsibly.' },
      ],
    },
  ],

  whyKangqoreIntro: 'Kangqore approaches Microsoft services as structured engineering programs — designed for scalability, governance, and sustainable transformation. Our focus is on integration clarity and architectural stability, not just tool deployment.',
  whyKangqore: [
    { title: 'Engineering-First Delivery', description: 'We approach Microsoft services as structured engineering programs — not tool deployments.' },
    { title: 'Security-by-Default Architecture', description: 'Governance, monitoring, and compliance awareness are embedded into design — not added later.' },
    { title: 'Platform Readiness Mindset', description: 'Every implementation is evaluated for scalability, operational resilience, cost control, and lifecycle sustainability.' },
    { title: 'Integration Clarity', description: 'We design cohesive ecosystems where Azure, M365, Dynamics, and Power Platform operate as unified systems.' },
    { title: 'Governance-Aware Automation', description: 'Low-code and automation implementations include citizen development guardrails and enterprise oversight controls.' },
  ],

  industryIntro: 'Microsoft ecosystems power mission-critical operations across industries. But digital transformation requires integration clarity, secure infrastructure, governance-aware automation, and business-aligned analytics. We ensure Microsoft investments align with measurable enterprise value — not just technical upgrades.',
  industries: [
    { name: 'Industrial & Manufacturing', description: 'Connected products, predictive systems, and operational data intelligence.' },
    { name: 'Healthcare', description: 'Secure collaboration, compliance frameworks, and clinical data governance.' },
    { name: 'EduTech', description: 'Modern workplace enablement, identity governance, and productivity platforms.' },
    { name: 'Retail', description: 'CRM/ERP integration, analytics pipelines, and customer data platforms.' },
    { name: 'BFSI', description: 'Security posture, Sentinel readiness, and governance-first cloud architecture.' },
    { name: 'Energy', description: 'IoT integration, operational data flows, and infrastructure modernization.' },
  ],

  customFAQs: [
    { question: 'What makes Microsoft Services different from a standard Azure deployment?', answer: 'We approach Microsoft services as structured engineering programs — not tool deployments. Every engagement includes architecture design, governance frameworks, and lifecycle planning to ensure long-term resilience.' },
    { question: 'How does Kangqore handle Microsoft ecosystem fragmentation?', answer: 'We design integration architectures that unify identity, data, security, and applications across the Microsoft ecosystem — ensuring applications do not fragment as environments scale.' },
    { question: 'Do you support Dynamics 365 customization?', answer: 'Yes. We handle CRM and ERP integration strategy, custom workflow design, reporting optimizations, and scalable architecture planning to support long-term operational growth.' },
    { question: 'How is security embedded into your Microsoft implementations?', answer: 'Security-by-default architecture is a core principle. Governance, monitoring, and compliance awareness are embedded into design — not added as afterthoughts post-deployment.' },
    { question: 'What Microsoft accelerator programs do you offer?', answer: 'We offer structured assessments including Azure Migration Assessment (8 weeks), Sentinel Readiness Assessment, Modern Workspace Enablement, Advanced Analytics Platform Briefing, and Azure DC Migration Blueprint.' },
  ],
};

// ─── google-cloud-services (Foundry · T3) ─────────────────────────────────────
const googleCloudServices = {
  description: (
    <div>
      <p className="mb-4">
        Enterprises today are not just migrating to the cloud — they are re-architecting their future around data, AI, and global scalability. Google Cloud offers one of the most advanced AI and data platforms in the world, but unlocking its full value requires architectural precision and operational maturity.
      </p>
      <p>
        Kangqore partners with organizations to design, migrate, modernize, and optimize workloads on Google Cloud — enabling intelligent, secure, and high-performance digital ecosystems.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',

  primaryButton: { text: 'Talk to Our Cloud Engineering Team', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'PB', label: 'Data Processed', color: 'text-cyan-400' },
    { value: 'Zero', label: 'Data Leakage', color: 'text-blue-400' },
    { value: '100%', label: 'AI/ML Synergy', color: 'text-emerald-400' },
    { value: 'Native', label: 'BigQuery Power', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'AI-Native Cloud :: 2026',
      titleLine1: 'The Modernization',
      titleHighlight: 'Mandate.',
      titleLine2: 'Structured Execution.',
      description:
        "Legacy infrastructure, fragmented data pipelines, rising cloud costs, and AI experimentation without production readiness are slowing enterprise velocity. Google Cloud provides a powerful AI-first ecosystem — but unlocking its full value requires structured execution. That's where Kangqore operates.",
      bottleneckLabel: 'The Impediment',
      bottleneckText:
        'Disconnected data environments, underutilized AI capabilities, and governance gaps in multi-cloud environments.',
      requirementLabel: 'The Mandate',
      requirementText:
        "Architectural precision + operational maturity to unlock Google Cloud's full AI and data platform value.",
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80',
      statusLabel: 'Platform',
      statusValue: 'AI-Native',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-brand-blue" />,
      title: 'Kangqore + Google Cloud.',
      titleHighlight: 'Engineering Intelligence.',
      description:
        'We combine deep cloud architecture expertise, an AI-first engineering mindset, enterprise modernization frameworks, and DevOps & SRE maturity to operate as Cloud Architects, AI Integrators, Platform Modernizers, and Operational Strategists.',
      pills: ['Cloud Architects', 'AI Integrators', 'Platform Modernizers', 'Operational Strategists'],
    },
    matrix: {
      engineId: 'Engine :: GCP_Intelligence_V3',
      title: 'Strategic Focus Matrix',
      subtext:
        'Four structured focus areas that govern every Google Cloud engagement.',
      layers: [
        { title: 'Infrastructure', id: 'GCP_INFRA', icon: <Layers />, desc: 'Rebuild legacy infrastructure into resilient, cloud-native platforms designed for elasticity and reliability.' },
        { title: 'Workplace', id: 'GCP_WORK', icon: <Activity />, desc: 'Empower collaboration and productivity through secure cloud-based ecosystems.' },
        { title: 'App Modernization', id: 'GCP_APP', icon: <Zap />, desc: 'Refactor monoliths into scalable microservices and containerized architectures for faster innovation cycles.' },
        { title: 'Data & AI', id: 'GCP_DATA', icon: <Brain />, desc: 'Create unified data platforms that power analytics, AI models, and predictive decision systems.' },
      ],
    },
    schematic: {
      titleLine1: 'Engineer Your',
      titleHighlight: 'Intelligent Cloud Future.',
      description:
        'From strategic consulting to AI-native cloud ecosystems, Kangqore enables enterprises to build secure, scalable, and autonomous digital platforms that scale with ambition.',
      stats: [
        { label: 'Deployment', val: 'AI-NATIVE' },
        { label: 'Analytics', val: 'ACCELERATED' },
        { label: 'Governance', val: 'EMBEDDED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Infrastructure Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Rebuild legacy infrastructure into resilient, cloud-native platforms designed for elasticity, reliability, and global scale.',
      items: [
        { heading: 'Cloud Readiness Assessment', description: 'Evaluate legacy infrastructure and identify modernization pathways aligned to business goals.' },
        { heading: 'Landing Zone Architecture', description: 'Design secure, governance-ready GCP landing zones with policy baselines and network controls.' },
        { heading: 'Containerization & Kubernetes (GKE)', description: 'Containerize workloads and orchestrate via Google Kubernetes Engine for portability and resilience.' },
        { heading: 'Cloud-Native Platform Design', description: 'Architect event-driven, serverless, and microservices platforms for elastic, cost-efficient operations.' },
      ],
    },
    {
      title: 'Digital Workplace Enablement',
      bgImage: '/images/capabilities/business-strategy.png',
      description:
        'Empower collaboration and productivity through secure, cloud-based ecosystems that support distributed enterprise teams.',
      items: [
        { heading: 'Google Workspace Integration', description: 'Deploy and govern Google Workspace environments with identity, access, and compliance controls.' },
        { heading: 'Secure Collaboration Architecture', description: 'Design collaboration frameworks that balance productivity with data security and governance.' },
        { heading: 'Identity & Access Management', description: 'IAM governance aligned to zero-trust principles and enterprise access requirements.' },
        { heading: 'Adoption & Productivity Frameworks', description: 'Structured adoption programs that drive measurable productivity outcomes for distributed teams.' },
      ],
    },
    {
      title: 'Application Modernization',
      bgImage: '/images/capabilities/software-engineering.png',
      description:
        'Refactor monoliths into scalable microservices and containerized architectures for faster innovation cycles.',
      items: [
        { heading: 'Monolith Decomposition', description: 'Strategically decompose legacy monoliths into independently deployable microservices.' },
        { heading: 'API-First Architecture', description: 'Design API-first systems using Apigee and Cloud Endpoints for integration clarity.' },
        { heading: 'Serverless Adoption', description: 'Adopt Cloud Run and Cloud Functions for elastic, cost-efficient compute without infrastructure management.' },
        { heading: 'Technical Debt Reduction', description: 'Systematic technical debt reduction roadmaps that improve maintainability and deployment velocity.' },
      ],
    },
    {
      title: 'Enterprise Data Transformation',
      bgImage: '/images/capabilities/data-analytics.png',
      description:
        'Create unified data platforms that power analytics, AI models, and predictive decision systems across the enterprise.',
      items: [
        { heading: 'BigQuery Data Warehouse', description: 'Design and implement enterprise-grade BigQuery data warehouses for high-performance analytics at scale.' },
        { heading: 'Data Pipeline Engineering (Dataflow)', description: 'Build scalable streaming and batch data pipelines using Cloud Dataflow and Pub/Sub.' },
        { heading: 'Data Lakehouse Architecture', description: 'Design unified data lakehouse architectures on Cloud Storage with governed access layers.' },
        { heading: 'Looker & Analytics Enablement', description: 'Deploy Looker for governed, KPI-driven business intelligence and executive reporting.' },
      ],
    },
    {
      title: 'AI & Machine Learning (Vertex AI)',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description:
        "Production-ready AI deployment on Google Cloud's Vertex AI platform — from model development to enterprise-scale inference.",
      items: [
        { heading: 'Vertex AI Platform Setup', description: 'Configure Vertex AI environments for model training, evaluation, and production deployment.' },
        { heading: 'AI Readiness Assessment', description: 'Evaluate data maturity, infrastructure readiness, and governance frameworks for AI adoption.' },
        { heading: 'ML Pipeline Engineering', description: 'Build automated ML pipelines for training, validation, deployment, and model monitoring.' },
        { heading: 'Generative AI Integration', description: "Integrate Google's generative AI capabilities (Gemini) into enterprise workflows and applications." },
      ],
    },
    {
      title: 'Cloud Security & Compliance',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Security and compliance embedded by design across every Google Cloud deployment.',
      items: [
        { heading: 'Security Command Center', description: 'Configure Google Security Command Center for unified threat detection and compliance monitoring.' },
        { heading: 'Zero-Trust Network Architecture', description: 'Implement BeyondCorp and VPC Service Controls for zero-trust access across GCP workloads.' },
        { heading: 'Regulatory Compliance Alignment', description: 'Align GCP environments with ISO 27001, SOC 2, GDPR, and industry-specific mandates.' },
        { heading: 'Audit Readiness & Reporting', description: 'Continuous compliance monitoring with audit-ready reporting and evidence collection.' },
      ],
    },
    {
      title: 'DevOps & MLOps on GCP',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description:
        'Automation-first engineering discipline embedded across cloud and AI delivery pipelines on Google Cloud.',
      items: [
        { heading: 'Cloud Build & CI/CD Pipelines', description: 'Design and automate CI/CD pipelines using Cloud Build, Artifact Registry, and Cloud Deploy.' },
        { heading: 'Infrastructure-as-Code (Terraform)', description: 'Version-controlled GCP infrastructure managed via Terraform for consistency and repeatability.' },
        { heading: 'MLOps Pipeline Automation', description: 'Automated ML lifecycle management from experiment tracking to production monitoring and retraining.' },
        { heading: 'SRE & Observability', description: 'SLO-driven reliability engineering with Cloud Monitoring, Logging, and Trace for full observability.' },
      ],
    },
  ],

  technologies: [
    { category: 'Compute & Containers', items: ['Google Kubernetes Engine (GKE)', 'Cloud Run', 'Cloud Functions', 'Compute Engine', 'App Engine', 'Anthos'] },
    { category: 'Data & Analytics', items: ['BigQuery', 'Cloud Dataflow', 'Cloud Pub/Sub', 'Cloud Dataproc', 'Cloud Composer', 'Looker', 'Data Catalog'] },
    { category: 'AI & Machine Learning', items: ['Vertex AI', 'Gemini API', 'AutoML', 'AI Platform Pipelines', 'TensorFlow on GCP', 'Document AI', 'Dialogflow CX'] },
    { category: 'Storage & Databases', items: ['Cloud Storage', 'Cloud Spanner', 'Cloud SQL', 'Firestore', 'Bigtable', 'Memorystore', 'AlloyDB'] },
    { category: 'Security & Identity', items: ['Google Security Command Center', 'Cloud IAM', 'BeyondCorp Enterprise', 'VPC Service Controls', 'Cloud Armor', 'Chronicle SIEM'] },
    { category: 'DevOps & Networking', items: ['Cloud Build', 'Artifact Registry', 'Cloud Deploy', 'Terraform on GCP', 'Cloud CDN', 'Cloud Load Balancing', 'Cloud DNS'] },
  ],

  whyKangqoreIntro: "Kangqore combines deep cloud architecture expertise, an AI-first engineering mindset, enterprise modernization frameworks, and DevOps & SRE maturity. We don't just deploy Google Cloud — we engineer cloud systems that evolve with your ambition.",
  whyKangqore: [
    { title: 'Cloud Architecture Depth', description: 'Deep GCP architectural expertise across compute, networking, data, AI, and security layers.' },
    { title: 'AI-First Engineering Mindset', description: 'Every cloud engagement is evaluated for AI and analytics enablement — not just infrastructure deployment.' },
    { title: 'Enterprise Modernization Frameworks', description: 'Structured frameworks for legacy modernization that reduce risk and accelerate transformation timelines.' },
    { title: 'DevOps & SRE Maturity', description: 'Automation-first delivery with SLO-driven reliability engineered directly into cloud operations.' },
    { title: 'Governance-Driven Execution', description: 'Security, compliance, and cost governance embedded from design through operations — never retrofitted.' },
  ],

  industryIntro: "Google Cloud's AI-first ecosystem powers transformation across every industry. Kangqore tailors GCP architecture and delivery to the specific data, compliance, and intelligence requirements of each sector.",
  industries: [
    { name: 'Banking & Financial Services', description: 'BigQuery-powered risk analytics, compliance-aligned infrastructure, and AI-driven fraud detection.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA-aligned GCP environments, clinical data platforms, and AI-assisted diagnostic systems.' },
    { name: 'Retail & eCommerce', description: 'Personalization AI, demand forecasting, and scalable data pipelines for customer intelligence.' },
    { name: 'Manufacturing', description: 'IoT data ingestion, predictive maintenance AI, and operational analytics on Cloud Dataflow.' },
    { name: 'Media & Technology', description: 'Content intelligence, real-time streaming analytics, and AI-powered recommendation systems.' },
    { name: 'Energy & Utilities', description: 'Smart grid data platforms, environmental analytics, and sustainability reporting on GCP.' },
  ],

  customFAQs: [
    { question: 'Why choose Google Cloud over other cloud providers?', answer: 'Google Cloud offers the most advanced AI and data platform in the enterprise market — with BigQuery, Vertex AI, and Gemini providing unmatched intelligence capabilities. For organizations prioritizing data analytics, AI production deployment, and global network performance, GCP provides structural advantages.' },
    { question: 'How does Kangqore approach Google Cloud migrations?', answer: 'We follow a structured program: cloud readiness assessment, dependency mapping, migration sequencing, cutover planning, and post-migration validation. Every migration is designed for zero data loss, minimal downtime, and security hardening throughout the transition.' },
    { question: 'Can you help us deploy production AI on GCP?', answer: 'Yes. We specialize in Vertex AI platform setup, ML pipeline automation, and Gemini API integration. Our AI readiness assessments evaluate data maturity, infrastructure requirements, and governance frameworks before any production deployment begins.' },
    { question: 'Do you manage multi-cloud environments that include GCP?', answer: 'Yes. We design and manage multi-cloud architectures that integrate GCP with AWS and Azure. Our governance frameworks provide unified visibility and control across providers.' },
    { question: 'What business outcomes can we expect from a GCP engagement?', answer: 'Typical outcomes include reduced infrastructure overhead, accelerated analytics performance, faster software deployment cycles, improved cloud cost visibility, production-ready AI deployment, and enhanced compliance and governance posture.' },
  ],
};

// ─── cloud-computing (Foundry · T3) ───────────────────────────────────────────
const cloudComputing = {
  description: (
    <div>
      <p className="mb-4">
        At Kangqore, cloud computing is more than infrastructure provisioning. It is about elastic scalability, performance engineering, intelligent cost governance, secure-by-design architecture, and automation-driven operations.
      </p>
      <p>
        From strategy to architecture, migration to modernization — we transform cloud from infrastructure into competitive advantage. Cloud is your operating backbone. We make it resilient.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',

  primaryButton: { text: 'Talk to Our Cloud Architects', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'HA', label: 'High Availability', color: 'text-cyan-400' },
    { value: 'Zero', label: 'Trust Security', color: 'text-blue-400' },
    { value: '30–60%', label: 'Cost Optimization', color: 'text-emerald-400' },
    { value: 'AI-Ready', label: 'Architecture', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'Cloud Engineering :: 2026',
      titleLine1: 'Cloud Is Not Hosting.',
      titleHighlight: "It's Architecture.",
      titleLine2: 'We Engineer the Difference.',
      description:
        'We build cloud systems that are high availability by default, zero-trust secure, DevOps-integrated, AI-ready, and enterprise governed. Most providers migrate infrastructure. Kangqore engineers digital platforms built to scale with your ambition.',
      bottleneckLabel: 'The Reality',
      bottleneckText:
        'Unstructured cloud adoption leads to fragmentation, cost overruns, security exposure, and slowed engineering velocity.',
      requirementLabel: 'The Standard',
      requirementText:
        'Cloud ecosystems engineered for performance, governance, resilience, and global scale — from day one.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
      statusLabel: 'Architecture',
      statusValue: 'Resilient',
    },
    philosophy: {
      icon: <Cloud className="w-7 h-7 text-brand-blue" />,
      title: 'Engineers at Heart.',
      titleHighlight: 'Architects by Discipline.',
      description:
        "Kangqore differentiates through a cloud-first architecture mindset, DevOps-native approach, governance-focused execution, security integrated from day one, performance-led optimization, and enterprise accountability. We don't just deploy cloud. We engineer cloud ecosystems.",
      pills: ['Cloud-First', 'DevOps-Native', 'Governance-Focused', 'Performance-Led'],
    },
    matrix: {
      engineId: 'Engine :: CloudCore_V5',
      title: 'How We Engineer Cloud Differently',
      subtext:
        'Five structured phases — Assess, Architect, Build, Optimize, Scale — that govern every cloud engineering engagement.',
      layers: [
        { title: 'Assess', id: 'CC_ASSESS', icon: <Search />, desc: 'Audit architecture, workloads, and operational maturity.' },
        { title: 'Architect', id: 'CC_ARC', icon: <Layers />, desc: 'Design a resilient, secure, performance-optimized blueprint.' },
        { title: 'Build', id: 'CC_BUILD', icon: <Server />, desc: 'Deploy with Infrastructure-as-Code and automation-first principles.' },
        { title: 'Optimize & Scale', id: 'CC_OPT', icon: <TrendingUp />, desc: 'Continuously monitor, improve, evolve, and enable long-term growth without architectural rework.' },
      ],
    },
    schematic: {
      titleLine1: 'Build Cloud Infrastructure',
      titleHighlight: 'That Thinks Ahead.',
      description:
        'Future-ready architecture. Resilient systems. Engineered scale. Cloud Computing with Kangqore delivers 30–60% infrastructure cost optimization, improved deployment velocity, higher system uptime, and stronger security posture.',
      stats: [
        { label: 'Cost Reduction', val: '30–60%' },
        { label: 'Uptime', val: 'SLO-DRIVEN' },
        { label: 'Incidents', val: 'REDUCED' },
      ],
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilities: [
    {
      title: 'Cloud Strategy & Roadmap',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Define a structured cloud vision aligned to business outcomes. Outcome: Clear direction. No blind migration.',
      items: [
        { heading: 'Cloud Maturity Assessment', description: 'Evaluate your current cloud posture and readiness across infrastructure, governance, and operations.' },
        { heading: 'Phased Transformation Roadmap', description: 'Design a sequenced, risk-managed transformation roadmap aligned to business cycles and priorities.' },
        { heading: 'Architecture Transition Planning', description: 'Define the technical migration path from current-state to target-state architecture.' },
        { heading: 'Governance Blueprint', description: 'Establish clear governance frameworks and policy baselines before execution begins.' },
        { heading: 'Risk Modeling', description: 'Comprehensive risk modeling and mitigation planning for the cloud transformation journey.' },
      ],
    },
    {
      title: 'Cloud Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Secure, controlled movement from legacy to cloud. Outcome: Smooth transition with operational continuity.',
      items: [
        { heading: 'Application & Workload Assessment', description: 'Comprehensive discovery of applications, workloads, and system dependencies prior to migration.' },
        { heading: 'Dependency Mapping', description: 'Detailed mapping of interconnection between systems to ensure migration sequence integrity.' },
        { heading: 'Data Migration Strategy', description: 'Structured data replication, synchronization, and integrity validation across all migrated environments.' },
        { heading: 'Zero-Downtime Cutover Planning', description: 'Phased cutover strategies with rollback safeguards that preserve user experience during transition.' },
        { heading: 'Phased Transformation', description: 'Strategic migration in controlled waves to minimize business impact and maximize continuity.' },
      ],
    },
    {
      title: 'Cloud Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Re-engineer legacy systems into cloud-native architectures. Outcome: Faster systems. Scalable architecture.',
      items: [
        { heading: 'Monolith-to-Microservices Transformation', description: 'Decompose legacy monoliths into independently deployable, scalable microservices.' },
        { heading: 'Containerization', description: 'Containerize workloads for portability and operational resilience.' },
        { heading: 'API-First Redesign', description: 'Redesign systems around API-first principles for decoupled, integration-ready architectures.' },
        { heading: 'Serverless Adoption', description: 'Adopt serverless patterns for elastic, cost-efficient execution.' },
        { heading: 'Performance Refactoring', description: 'Architectural refactoring to improve performance, throughput, and scalability.' },
      ],
    },
    {
      title: 'Cloud Application Development',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Build applications designed specifically for cloud elasticity. Outcome: Applications that auto-scale and self-recover.',
      items: [
        { heading: 'Cloud-Native Engineering', description: 'Purpose-built applications leveraging managed services, auto-scaling, and cloud-native runtimes.' },
        { heading: 'Distributed System Architecture', description: 'Design distributed systems with fault tolerance, consistency, and global availability.' },
        { heading: 'Event-Driven Services', description: 'Real-time event streaming architectures for reactive, data-driven application behavior.' },
        { heading: 'Resilient Backend Systems', description: 'Backend architectures designed for self-healing and instant recovery from failures.' },
      ],
    },
    {
      title: 'Cloud-Based Application Monitoring',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Full visibility into system health. Outcome: Proactive issue resolution, reduced downtime.',
      items: [
        { heading: 'Real-Time Observability', description: 'Unified observability dashboards covering performance, latency, throughput, and error rates.' },
        { heading: 'Metrics & Log Aggregation', description: 'Centralized log aggregation with pattern recognition and search capabilities.' },
        { heading: 'Alert Automation', description: 'Automated alerting workflows that trigger remediation before users are impacted.' },
        { heading: 'Incident Diagnostics', description: 'Deep diagnostics and root cause analysis tools for rapid troubleshooting.' },
        { heading: 'Reliability Engineering', description: 'SRE disciplines that focus on continuous reliability and uptime improvements.' },
      ],
    },
    {
      title: 'Cloud Cost Optimization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Cloud cost is architectural — we optimize both. Outcome: Controlled spend. Predictable budgets.',
      items: [
        { heading: 'Resource Right-Sizing', description: 'Eliminate over-provisioning through systematic rightsizing analysis across all compute.' },
        { heading: 'Usage Analytics', description: 'Detailed analysis of usage patterns to identify optimization opportunities.' },
        { heading: 'Idle Workload Elimination', description: 'Identify and decommission orphaned, idle, and underutilized cloud resources automatically.' },
        { heading: 'Budget Governance Models', description: 'FinOps governance frameworks with real-time spend dashboards and alerting.' },
        { heading: 'Performance-to-Cost Balance', description: 'Balancing architecture performance with financial efficiency to maximize value.' },
      ],
    },
    {
      title: 'Disaster Recovery Services',
      bgImage: '/images/capabilities/business-strategy.png',
      description:
        'Business continuity engineered into infrastructure. Outcome: Operational resilience under disruption.',
      items: [
        { heading: 'Backup Automation', description: 'Policy-driven automated backup schedules with geo-redundant replication.' },
        { heading: 'Geo-Redundancy', description: 'Multi-region data replication and redundancy for maximum resilience.' },
        { heading: 'Failover Architecture', description: 'Automated failover systems that activate without manual intervention during disasters.' },
        { heading: 'Recovery Time Optimization', description: 'Strategies to minimize recovery time (RTO) and data loss (RPO).' },
        { heading: 'Simulation Testing', description: 'Regular recovery drills and simulation testing to validate DR readiness.' },
      ],
    },
    {
      title: 'Managed Cloud Services',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'End-to-end lifecycle management of cloud environments. Outcome: Reduced operational overhead.',
      items: [
        { heading: 'Infrastructure Management', description: '24/7 infrastructure management covering compute, storage, and networking.' },
        { heading: 'Performance Monitoring', description: 'Continuous performance tracking and reporting for entire cloud environments.' },
        { heading: 'Patch & Update Control', description: 'Automated patch management and version control for cloud resources.' },
        { heading: 'Continuous Optimization', description: 'Ongoing rightsizing and architecture review to compound cloud efficiency.' },
        { heading: '24/7 Support', description: 'Dedicated support coverage for operational stability and incident resolution.' },
      ],
    },
    {
      title: 'Support & Maintenance',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description:
        'Sustained performance and availability. Outcome: Stable and evolving cloud environment.',
      items: [
        { heading: 'System Health Audits', description: 'Periodic audits of infrastructure health and configuration drift.' },
        { heading: 'Performance Troubleshooting', description: 'Diagnostics and resolution of performance bottlenecks and system issues.' },
        { heading: 'Infrastructure Tuning', description: 'Ongoing tuning of cloud resources to match evolving workload demands.' },
        { heading: 'Ongoing Optimization', description: 'Continuous updates to the environment to leverage new cloud capabilities.' },
        { heading: 'Security Patching', description: 'Structured security patching cycles to maintain a secure cloud surface.' },
      ],
    },
    {
      title: 'Cloud Infrastructure Management',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Centralized orchestration of cloud resources. Outcome: Reliable, scalable infrastructure backbone.',
      items: [
        { heading: 'Compute & Storage Provisioning', description: 'Automated provisioning of compute, storage, and database resources.' },
        { heading: 'Network Configuration', description: 'Governed network architecture including VPC design and connectivity.' },
        { heading: 'Scalability Planning', description: 'Capacity planning for traffic growth without manual intervention.' },
        { heading: 'Security Updates', description: 'Automated rollout of security updates across the infrastructure.' },
        { heading: 'Monitoring Automation', description: 'Infrastructure monitoring with self-healing and automated remediation.' },
      ],
    },
    {
      title: 'Cloud Analytics',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description:
        'Turn cloud data into strategic insight. Outcome: Data-driven decisions at scale.',
      items: [
        { heading: 'Real-Time Analytics Pipelines', description: 'Build streaming analytics pipelines that deliver insights at velocity.' },
        { heading: 'Data Lake Architecture', description: 'Design governed, scalable data lake architectures for unified storage.' },
        { heading: 'Business Intelligence Dashboards', description: 'Deploy BI dashboards for real-time decision intelligence.' },
        { heading: 'Predictive Modeling Frameworks', description: 'Predictive analytics frameworks aligned to enterprise business goals.' },
        { heading: 'Performance Analytics', description: 'Detailed analytics on system and process performance.' },
      ],
    },
  ],

  technologies: [
    { category: 'Cloud Platforms', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Multi-Cloud & Hybrid Architectures'] },
    { category: 'Containers & Orchestration', items: ['Docker', 'Kubernetes (EKS / AKS / GKE)', 'Helm', 'Istio Service Mesh', 'Serverless Frameworks'] },
    { category: 'Infrastructure as Code', items: ['Terraform', 'AWS CloudFormation', 'Azure Bicep', 'Ansible', 'Pulumi'] },
    { category: 'Monitoring & Observability', items: ['Datadog', 'Prometheus', 'Grafana', 'New Relic', 'CloudWatch', 'Azure Monitor'] },
    { category: 'Security & Compliance', items: ['Zero-Trust Architecture', 'IAM Governance', 'SIEM Stacks', 'Vault (HashiCorp)', 'Prisma Cloud', 'CrowdStrike'] },
    { category: 'Networking & Delivery', items: ['Cloud CDN', 'Load Balancers', 'API Gateways', 'VPC Design', 'DNS Management', 'Private Connectivity'] },
  ],

  whyKangqoreIntro: 'Cloud Computing is no longer optional — it is the backbone of modern enterprises. Kangqore builds cloud ecosystems that are engineered for performance, designed for resilience, optimized for cost, and ready for global scale.',
  whyKangqore: [
    { title: 'Cloud-First Architecture Mindset', description: 'Every engagement starts with architecture — not tool selection. We design cloud systems that scale structurally.' },
    { title: 'DevOps-Native Approach', description: 'Infrastructure-as-Code, CI/CD automation, and SRE discipline embedded into every cloud delivery.' },
    { title: 'Governance-Focused Execution', description: 'Policy-driven cloud governance that provides cost visibility, access control, and compliance assurance.' },
    { title: 'Security Integrated from Day One', description: 'Zero-trust, encrypted, monitored, and compliance-aligned — security is never retrofitted after deployment.' },
    { title: 'Performance-Led Optimization', description: 'Continuous monitoring and optimization ensure cloud performance compounds — not degrades — over time.' },
    { title: 'Enterprise Accountability', description: 'SLO commitments, observability dashboards, and structured reporting keep cloud operations transparent and accountable.' },
  ],

  industryIntro: "Cloud computing underpins every sector's digital operations. Kangqore tailors cloud architecture and delivery to the specific performance, compliance, and scalability requirements of each industry.",
  industries: [
    { name: 'Healthcare', description: 'Secure patient systems, compliance-ready infrastructure, and telehealth scalability without compromising data governance.' },
    { name: 'Banking & Finance', description: 'Low-latency systems, encrypted environments, and risk-managed cloud governance for regulated financial operations.' },
    { name: 'Retail & eCommerce', description: 'Elastic scaling for peak traffic events, intelligent load balancing, and real-time inventory data pipelines.' },
    { name: 'SaaS & Technology', description: 'Cloud-native product architecture purpose-built for rapid growth, multi-tenancy, and developer velocity.' },
    { name: 'Manufacturing', description: 'IoT data integration, predictive operations platforms, and resilient infrastructure for industry environments.' },
    { name: 'Energy & Utilities', description: 'Secure cloud environments for grid data, operational analytics, and sustainability reporting platforms.' },
  ],

  customFAQs: [
    { question: 'Is cloud migration risky?', answer: 'Not with phased execution, rollback strategies, and environment simulation. We map all dependencies before migration begins and execute in controlled phases that preserve data integrity and user experience.' },
    { question: 'How do you control cloud cost?', answer: 'Cloud cost is architecture-driven, not just a billing problem. We implement architecture-level optimization — rightsizing, reserved capacity strategies, idle resource elimination — combined with automated FinOps governance and real-time spend dashboards.' },
    { question: 'Can we modernize gradually without a full cutover?', answer: 'Yes. We implement phased modernization aligned with business cycles. Applications can be migrated incrementally — starting with rehosting for speed, then refactoring for long-term structural improvement.' },
    { question: 'How secure is your cloud architecture?', answer: 'Security is engineered within — not layered on top. Every architecture includes zero-trust segmentation, IAM governance, encryption at rest and in transit, continuous threat monitoring, and automated compliance enforcement.' },
    { question: 'Who is cloud computing best suited for at Kangqore?', answer: 'Enterprises modernizing legacy infrastructure, high-growth startups scaling rapidly, SaaS platforms needing elastic performance, product companies moving to microservices, and organizations pursuing a cloud-first digital strategy.' },
  ],
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 7 services wired in G2 PR 2 (all canonically Foundry):
//   - 2 T1 services with custom GSAP section blocks (api-microservices-engineering, internet-of-things)
//   - 5 T3 services with full bespoke highFidelity content but no inline custom JSX blocks
export const FOUNDRY_SECTIONS = {
  'api-microservices-engineering': apiMicroservicesEngineering,
  'internet-of-things': internetOfThings,
  'managed-cloud-services': managedCloudServices,
  'aws': aws,
  'microsoft-services': microsoftServices,
  'google-cloud-services': googleCloudServices,
  'cloud-computing': cloudComputing,
  // Phase D2 — 8 legacy Foundry service lifts from foundry-services.jsx
  ...FOUNDRY_LEGACY_SECTIONS,
};
