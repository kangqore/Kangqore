import React, { useEffect } from 'react';
import { Network, Layers, Search, ShieldCheck, Activity, Server, Briefcase } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import { 
  TrustStrip, 
  WhyAPISection, 
  ValueWeDeliverSection, 
  DeliveryModelTimelline,
  APIDiamondCoESection,
  APIFutureReadySection,
  APIExecutionEcosystem,
  APIPreMatrixSection,
  APIArchitectureShowcase,
  APIPhilosophyBackground
} from '../../../components/services/foundry/APICustomSections';

gsap.registerPlugin(ScrollTrigger);

const APIMicroservicesEngineering = () => {
  useEffect(() => {
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/([\d.]+)/);
        if (match) {
          const targetNum = parseFloat(match[1]);
          const suffix = text.replace(match[0], '');
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => { 
                  const rawVal = counter.val;
                  const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
                  if (!isNaN(numVal)) {
                    const formattedVal = targetNum % 1 === 0 ? Math.round(numVal) : numVal.toFixed(1);
                    el.textContent = `${formattedVal}${suffix}`;
                  }
                }
              });
            }
          });
        }
      });
    };
    const timer = setTimeout(animateCounters, 500);
    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);
  // ============================================
  // SERVICE DATA
  // ============================================
  
  const service = {
    name: 'API & Microservices Engineering',
    titleLine1: 'API & Microservices',
    titleHighlight: 'Engineering.',
    slug: 'api-microservices-engineering',
    shortDescription: 'Build secure, scalable service ecosystems that move faster.',
    description: 'Kangqore helps organizations design and engineer modern API and microservices architectures that are resilient, governable, and ready for scale. We combine gateway strategy, service decomposition, discovery, security, observability, orchestration patterns, and runtime governance to help enterprises modernize delivery without creating architectural chaos',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps organizations design and engineer modern API and microservices architectures that are resilient, governable, and ready for scale. We combine gateway strategy, service decomposition, discovery, security, observability, orchestration patterns, and runtime governance to help enterprises modernize delivery without creating architectural chaos.
        </p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/8068255/pexels-photo-8068255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/business-meeting-6774639.mp4', 
    primaryButton: { text: 'Schedule An Architecture Review', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Digital Engineering', link: '/department/digital-engineering' },
      { label: 'API & Microservices' }
    ],
    
    stats: [
      { value: '99.9%', label: 'Uptime Reliability', color: 'text-cyan-400' },
      { value: '65%', label: 'Faster Integration', color: 'text-blue-400' },
      { value: 'Zero', label: 'Security Breach', color: 'text-emerald-400' },
      { value: '24/7', label: 'Runtime Governance', color: 'text-purple-400' },
    ],

    ctaTitle: "Scale Without Entropy.",
    ctaDescription: "Transform fragmented service sprawl into a governed, resilient platform designed for absolute engineering confidence.",
    ctaButtonText: "Consult a Lead Architect",

    // High Fidelity Content (Matches Software Development Benchmark)
    highFidelity: {
      narrative: {
        badge: "API & MICROSERVICES :: ARCHITECTURAL DISCIPLINE",
        titleLine1: "Architecting",
        titleHighlight: "Resilient",
        titleLine2: "Service Platforms",
        description: "Modern service environments demand more than just endpoints. They require boundary clarity, gateway foresight, delivery rigor, identity-first security, and the ability to adapt as service sprawl expands. At Kangqore, we engineer service ecosystems as resilient digital platforms.",
        bottleneckLabel: "The Complexity Trap",
        bottleneckText: "Fragmented service sprawl and unmanaged API traffic create hidden security gaps, operational instability, and architectural chaos. Without governed control, distributed systems become liabilities rather than assets.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified engineering discipline that connects boundary analysis, gateway governance, service interaction modeling, and identity-first security into one cohesive, scalable ecosystem.",
        image: "https://images.pexels.com/photos/7793688/pexels-photo-7793688.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Service Resilience",
        statusValue: "100% GOVERNED"
      },
      philosophy: {
        icon: <Network className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Integrate with Clarity.",
        titleHighlight: "Scale with Rigor.",
        description: "We replace fragmented service sprawl with architected, governed service platforms designed for absolute engineering confidence.",
        bgElement: <APIPhilosophyBackground />,
        pills: ['Gateway Control', 'Domain Boundaries', 'Security-First', 'Observable Runtime'],
        features: [
          { title: 'Gateway Discipline', label: 'Centralized Traffic Control', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Design the gateway layer as a true control plane for routing, security, and policy enforcement across all service entry points.' },
          { title: 'Boundary Clarity', label: 'Domain-Driven Design', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Define service boundaries using domain context to reduce coupling and ensure services can evolve independently without cascading failures.' },
          { title: 'Security Rigor', label: 'Identity-First Security', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Embed zero-trust principles at every interaction point, using mTLS and identity-based governance to secure east-west traffic.' },
          { title: 'Runtime Control', label: 'Proactive Observability', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Integrate real-time monitoring and tracing into the service fabric to ensure total visibility and rapid fault isolation.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: API_V2',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from service fragmentation to governed, scalable architectures.',
        layers: [
          { title: 'Define', id: 'API_DEF', icon: <Search />, desc: 'Context-driven boundary analysis and requirement deconstruction for service-ready foundations.' },
          { title: 'Architect', id: 'API_ARC', icon: <Layers />, desc: 'Foundation-first gateway, interaction, and security policy planning for resilient systems.' },
          { title: 'Engineer', id: 'API_ENG', icon: <Server />, desc: 'Rigor-led service implementation with automated pipelines and policy-as-code execution.' },
          { title: 'Operate', id: 'API_OPR', icon: <Activity />, desc: 'Trust-based observability, lifecycle control, and runtime governance for long-term stability.' }
        ]
      },
      schematic: {
        titleLine1: 'Architected Control.',
        titleHighlight: 'Sustainable Scale.',
        description: 'Your API ecosystem should be your most resilient asset. We engineer it to stay that way—across every service release and integration milestone.',
        stats: [
          { label: 'Integration Speed', val: '+65%' },
          { label: 'Runtime Latency', val: '-45ms' },
          { label: 'Security Validation', val: '99.9%' }
        ]
      }
    },

    trustPillars: [
      { title: 'Gateway foresight before scaling', tag: 'Governance', description: 'Design entry points that centralize control without creating delivery bottlenecks.' },
      { title: 'Domain-aligned service boundaries', tag: 'Architecture', description: 'Ensure services are scoped for independence, maintainability, and long-term evolution.' },
      { title: 'Identity-first security protocols', tag: 'Security', description: 'Protect every service interaction with hardened authentication and zero-trust rigor.' },
      { title: 'Automated policy enforcement', tag: 'Compliance', description: 'Bake governance into the delivery pipeline to ensure consistency across the service sprawl.' },
      { title: 'Full-cycle service accountability', tag: 'Reliability', description: 'From boundary discovery to runtime observability, end-to-end ownership of service health.' },
      { title: 'Modernization-ready foundations', tag: 'Future-Ready', description: 'Architect for the next generation of digital products with scalable, decoupled platforms.' }
    ],
    whyKangqore: [
      { title: 'Architecture-First Execution', description: 'We don\'t just build endpoints; we design distributed systems that prioritize resilience and maintainability.', icon: Layers },
      { title: 'Governed Engineering Rigor', description: 'We embed governance and security into the core engineering fabric, ensuring your ecosystem scales with absolute control.', icon: ShieldCheck },
      { title: 'Future-Ready Ecosystems', description: 'We help you prepare for service sprawl by building foundations that can adapt to changing technology and business demands.', icon: Server }
    ],
    industries: [
      { name: 'Financial Services', description: 'Secure, high-performance API ecosystems meeting open banking and regulatory rigor.' },
      { name: 'Healthcare', description: 'Interoperable service architectures for patient data exchange and clinical workflow automation.' },
      { name: 'E-commerce', description: 'Scalable microservices for inventory, checkout, and personalized customer journeys.' },
      { name: 'Logistics', description: 'Real-time service layers for fleet tracking, route optimization, and supply chain visibility.' }
    ],

    // UI Structure Slots
    preMatrixSection: <APIPreMatrixSection />,
    customSections: null,
       postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <APIArchitectureShowcase />
        <APIDiamondCoESection />
        <ValueWeDeliverSection />
        <DeliveryModelTimelline />
        <APIFutureReadySection />
      </div>
    ),
    
    postFAQSections: (
      <div className="flex flex-col w-full">
        <APIExecutionEcosystem />
      </div>
    )
  };

  const department = {
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    description: 'Build innovative products and platforms with modern engineering practices.',
    icon: <Briefcase className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES (9 core items)
  // ============================================

  const capabilities = [
    {
      title: 'API Gateway Strategy & Engineering',
      description: 'Design the gateway layer as a true control plane for modern service ecosystems. We help organizations create cleaner API entry points that centralize routing, security, traffic control, and policy enforcement—without slowing down delivery teams or overloading backend services.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Single-entry API architecture design',
        'Routing, throttling, and policy enforcement',
        'Consumer-facing API exposure strategy',
        'Runtime gateway engineering and optimization'
      ],
      micro: 'Control and scale, without the chaos.'
    },
    {
      title: 'Microservices Architecture Design',
      description: 'Break down systems into service models that are modular, composable, and aligned to business capabilities. Kangqore helps define service boundaries, interaction models, and domain-driven structures so distributed systems stay maintainable as scale, teams, and complexity increase.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Service decomposition and domain alignment',
        'Bounded-context-driven architecture planning',
        'Service interaction and dependency design',
        'Distributed system architecture blueprints'
      ],
      micro: 'Decompose monoliths securely and logically.'
    },
    {
      title: 'Identity, Security & Access Control',
      description: 'Secure distributed services with architecture-led identity and access patterns. We design security into the platform from the start—helping organizations protect APIs, control service access, secure machine-to-machine communication, and enforce policy consistently across the environment.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'OAuth2 / token-based security models',
        'Authentication and authorization design',
        'Secure service-to-service communication',
        'Threat protection and security policy enforcement'
      ],
      micro: 'Security integrated directly into the fabric.'
    },
    {
      title: 'Service Registry & Discovery Enablement',
      description: 'Make dynamic service environments easier to scale, route, and operate. Kangqore helps design discovery patterns and registry strategies that allow services to find each other reliably across changing runtime conditions, scaling events, and multi-instance environments.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Service registration strategy',
        'Discovery pattern design',
        'Registry availability and resilience planning',
        'Server-side discovery enablement'
      ],
      micro: 'Seamlessly locate and route in dynamic environments.'
    },
    {
      title: 'API Transformation & Protocol Mediation',
      description: 'Support heterogeneous clients and evolving backend landscapes without increasing service sprawl. We help organizations manage differences in payloads, protocols, schemas, and client expectations through cleaner transformation logic that reduces coupling and improves interoperability.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Payload and schema transformation',
        'Header and protocol mediation',
        'Client-specific API design patterns',
        'Reusable transformation adapter strategy'
      ],
      micro: 'Connect diverse systems with ease.'
    },
    {
      title: 'Orchestration & Service Composition',
      description: 'Compose distributed business flows without pushing the wrong logic into the gateway. Kangqore helps define where orchestration should live, how services should collaborate, and how complex workflows can be composed in ways that preserve clarity, resilience, and architectural discipline.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Service orchestration architecture',
        'Composition-layer design',
        'Gateway vs orchestration boundary definition',
        'Distributed workflow enablement'
      ],
      micro: 'Business flows that actually scale.'
    },
    {
      title: 'Observability & Runtime Monitoring',
      description: 'Create visibility across health, traffic, performance, and policy execution. We help organizations monitor API and service behavior in real time so engineering and operations teams can detect issues sooner, improve reliability, and make better runtime decisions.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Gateway health monitoring',
        'Traffic and API usage monitoring',
        'Performance and exception analytics',
        'Alerting and operational visibility'
      ],
      micro: 'See every call, trace every error.'
    },
    {
      title: 'Load Balancing, Scaling & Availability',
      description: 'Engineer service platforms that can absorb traffic growth without losing stability. Kangqore designs scale and availability patterns that improve resilience under load, support failover readiness, and help service ecosystems grow without fragile runtime behavior.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Horizontal and vertical scale planning',
        'Load-balanced gateway design',
        'High-availability and failover patterns',
        'Zero-downtime configuration and rollout support'
      ],
      micro: 'Grow confidently without system fragility.'
    },
    {
      title: 'API Governance & Lifecycle Control',
      description: 'Bring consistency, policy discipline, and lifecycle control to growing API estates. Kangqore helps organizations establish the standards, guardrails, and governance mechanisms needed to keep APIs secure, reusable, versioned, and manageable as services, teams, and consumers expand.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Runtime governance frameworks',
        'Throttling, rate limiting, and policy control',
        'API versioning and schema governance',
        'Design-time standards and review structures'
      ],
      micro: 'Consistency as your platform grows.'
    }
  ];

  const technologies = [
    { category: 'Gateways & Management', items: ['Kong', 'Apigee', 'AWS API Gateway', 'Azure API Management', 'Tyk', 'MuleSoft Anypoint'] },
    { category: 'Service Mesh & Connectivity', items: ['Istio', 'Linkerd', 'Consul', 'Kuma', 'Traefik Mesh'] },
    { category: 'Runtimes & Frameworks', items: ['Spring Boot', 'Node.js', 'Go', 'Quarkus', 'Micronaut', '.NET Core'] },
    { category: 'Infrastructure & Orchestration', items: ['Kubernetes', 'Docker', 'Amazon ECS', 'Nomad', 'Terraform'] },
    { category: 'Observability & Control', items: ['Prometheus', 'Grafana', 'Jaeger', 'OpenTelemetry', 'Kiali', 'Dynatrace'] },
    { category: 'Security & Identity', items: ['OAuth2', 'JWT', 'Keycloak', 'Auth0', 'Okta', 'Vault'] },
    { category: 'Communication Patterns', items: ['gRPC', 'GraphQL', 'Kafka', 'RabbitMQ', 'WebSockets', 'REST'] }
  ];

  const customFAQs = [
    {
      question: 'What is the difference between an API Gateway and a Service Mesh?',
      answer: 'An API Gateway manages "north-south" traffic (external clients securely accessing internal services). A Service Mesh manages "east-west" traffic (how your internal microservices communicate, authenticate, and route data amongst themselves).'
    },
    {
      question: 'Do we need microservices, or is a modular monolith enough?',
      answer: 'It depends on your scale. If you face organizational bottlenecks, varied scaling requirements for specific features, or technology lock-in, microservices offer advantages. For many, a well-engineered modular monolith is the right first step before full decomposition.'
    },
    {
      question: 'How do you secure communication between microservices?',
      answer: 'We implement zero-trust principles within the internal network. This typically involves a service mesh that automatically issues and validates certificates for Mutual TLS (mTLS) combined with identity-based routing.'
    },
    {
      question: 'What happens when a service fails in a distributed environment?',
      answer: 'We engineer for failure using patterns like circuit breakers, retries, timeouts, and fallback mechanisms. The architecture must ensure that the failure of a single inventory service does not cascade and bring down the entire checkout flow.'
    },
    {
      question: 'How long does a microservices transformation take?',
      answer: 'We avoid "big bang" rewrites. We typically deploy a gateway facade in weeks to strangle the monolith, and sequentially migrate services over 6-12 months based on business priority and risk.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Kangqore’s API and microservices engineering capabilities are designed to help organizations build service-based systems that remain secure, observable, scalable, and operationally coherent as they grow.',
      capabilities,
      trustPillars: service.trustPillars,
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs
    },
    department
  };

  return (
    <div className="api-microservices-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .api-microservices-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default APIMicroservicesEngineering;
