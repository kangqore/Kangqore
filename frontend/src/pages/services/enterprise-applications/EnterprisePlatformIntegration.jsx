import React, { useEffect } from 'react';
import { Network, Layers, Search, ShieldCheck, Activity, Server, Zap, GitBranch, Globe, Cloud, Lock, Database, Settings, Cpu, Code2, Workflow } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  EPIWhySection,
  EPIValueAccordion,
  EPISolutionsCarousel,
  EPIStrengthsBento,
  EPIPhilosophyBg,
  EPIIntegrationGraph
} from '../../../components/services/platforms/EPICustomSections';

gsap.registerPlugin(ScrollTrigger);

const EnterprisePlatformIntegration = () => {
  useEffect(() => {
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/([\d.]+)/);
        if (match) {
          const targetNum = parseFloat(match[1]);
          const suffix = text.replace(match[0], '');
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
    name: 'Enterprise Platform Integration',
    titleLine1: 'Enterprise Platform',
    titleHighlight: 'Integration.',
    slug: 'enterprise-platform-integration',
    shortDescription: 'Connect systems, data, and workflows without creating complexity.',
    description: 'Kangqore helps enterprises integrate legacy platforms, cloud applications, partner ecosystems, APIs, and data flows into one more connected operating environment. We combine enterprise integration architecture, hybrid connectivity, API-led interoperability, process orchestration, modernization strategy, and intelligent automation to help organizations move faster with stronger control, cleaner data exchange, and better operational continuity.',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises integrate legacy platforms, cloud applications, partner ecosystems, APIs, and data flows into one more connected operating environment. We combine enterprise integration architecture, hybrid connectivity, API-led interoperability, process orchestration, modernization strategy, and intelligent automation to help organizations move faster with stronger control, cleaner data exchange, and better operational continuity.
        </p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Schedule An Integration Assessment', link: '/contact' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Enterprise Applications', link: '/department/enterprise-applications' },
      { label: 'Enterprise Platform Integration' }
    ],

    stats: [
      { value: '99.9%', label: 'Platform Uptime', color: 'text-cyan-400' },
      { value: '10x', label: 'Faster Integration', color: 'text-blue-400' },
      { value: 'Zero', label: 'Data Silos', color: 'text-emerald-400' },
      { value: '24/7', label: 'Integration Governance', color: 'text-purple-400' },
    ],

    ctaTitle: "Ready to unify enterprise systems without increasing integration chaos?",
    ctaDescription: "Let's build an enterprise platform integration model that connects legacy and modern systems, improves interoperability, and creates a more scalable, governable foundation for transformation.",
    ctaButtonText: "Schedule An Integration Assessment",

    // ============================================
    // HIGH FIDELITY CONTENT
    // ============================================
    highFidelity: {
      narrative: {
        badge: "ENTERPRISE PLATFORM INTEGRATION :: ARCHITECTURAL DISCIPLINE",
        titleLine1: "Connecting",
        titleHighlight: "Enterprise",
        titleLine2: "Platforms at Scale",
        description: "Modern enterprises demand more than point-to-point connectors. They require architectural clarity, hybrid connectivity, interoperability governance, lifecycle discipline, and the ability to evolve as integration complexity expands. At Kangqore, we engineer integration ecosystems as strategic enterprise platforms.",
        bottleneckLabel: "The Integration Trap",
        bottleneckText: "Fragmented platforms, brittle interfaces, duplicated data, and aging integration patterns create hidden operational friction that silently erodes enterprise agility and decision-making speed.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified integration discipline that connects legacy systems, cloud platforms, partner ecosystems, and workflow engines into one governed, scalable, and observable operating environment.",
        image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Integration Maturity",
        statusValue: "ENTERPRISE-GRADE"
      },
      philosophy: {
        icon: <Network className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Connect with Architecture.",
        titleHighlight: "Scale with Governance.",
        description: "We replace fragmented platform sprawl with architected, governed integration ecosystems designed for operational continuity and enterprise-grade confidence.",
        bgElement: <EPIPhilosophyBg />,
        pills: ['Hybrid Connectivity', 'API Governance', 'Data Continuity', 'Observable Runtime'],
        features: [
          { title: 'Interoperability Design', label: 'Platform Connectivity', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Architect integration patterns that connect legacy, cloud, and partner platforms without creating rigid point-to-point dependencies.' },
          { title: 'API-Led Integration', label: 'Governed Data Exchange', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Build API-first integration layers with lifecycle governance, security controls, and standardization across the enterprise.' },
          { title: 'Hybrid Resilience', label: 'Multi-Environment Scale', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Support on-premises, cloud, and hybrid environments with integration architectures that maintain reliability and compliance.' },
          { title: 'Runtime Observability', label: 'Operational Visibility', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Instrument integration flows with real-time monitoring, alerting, and analytics for proactive issue detection and resolution.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: EPI_V3',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from platform fragmentation to governed, scalable integration architectures.',
        layers: [
          { title: 'Assess', id: 'EPI_ASS', icon: <Search />, desc: 'Understand systems, dependencies, integration pain points, workflow fragmentation, and modernization constraints.' },
          { title: 'Design', id: 'EPI_DES', icon: <Layers />, desc: 'Define the right integration architecture, interoperability model, governance controls, and platform patterns.' },
          { title: 'Connect', id: 'EPI_CON', icon: <GitBranch />, desc: 'Engineer APIs, workflows, partner exchanges, orchestration, and runtime integration flows across the estate.' },
          { title: 'Optimize', id: 'EPI_OPT', icon: <Activity />, desc: 'Improve observability, performance, governance, resilience, and long-term integration maturity over time.' }
        ]
      },
      schematic: {
        titleLine1: 'Architected Connectivity.',
        titleHighlight: 'Sustainable Scale.',
        description: 'Your integration ecosystem should be your most reliable operational backbone. We engineer it to stay that way—across every platform change and modernization milestone.',
        stats: [
          { label: 'Integration Speed', val: '10x FASTER' },
          { label: 'Data Continuity', val: '99.9%' },
          { label: 'Governance', val: 'ABSOLUTE' }
        ]
      }
    },

    trustPillars: [
      { title: 'Architecture-first interoperability design', tag: 'Architecture', description: 'Design integration patterns that connect heterogeneous systems without creating rigid, fragile point-to-point dependencies.' },
      { title: 'API governance and lifecycle discipline', tag: 'Governance', description: 'Bring standardization, policy control, and lifecycle management to growing API and integration estates.' },
      { title: 'Hybrid and cloud-ready integration', tag: 'Scalability', description: 'Support growth across on-premises, cloud, and mixed environments without increasing operational fragility.' },
      { title: 'Modernization without disruption', tag: 'Continuity', description: 'Preserve the value of existing enterprise assets while creating modern integration layers around them.' },
      { title: 'Secure data exchange and compliance', tag: 'Security', description: 'Protect every integration flow with hardened security, encryption, and compliance-aware patterns.' },
      { title: 'Observable, intelligent integration operations', tag: 'Intelligence', description: 'Instrument integration estates with monitoring, analytics, and AI-assisted operational efficiency.' }
    ],

    whyKangqoreIntro: 'Kangqore approaches enterprise integration as both an architecture discipline and a business enablement layer. We do not just connect systems—we help organizations reduce operational fragmentation, preserve existing platform value, modernize with intent, and build interoperability models that stay manageable as complexity increases.',
    whyKangqore: [
      { title: 'Continuity Without Stagnation', description: 'We help modernize the enterprise without forcing unnecessary disruption to systems that still carry business value.', icon: Layers },
      { title: 'Architecture-Led Interoperability', description: 'We design integration patterns that connect applications, APIs, data, and workflows with stronger structure and less long-term fragility.', icon: ShieldCheck },
      { title: 'Built for Scale and Governance', description: 'We balance flexibility with control so expanding integration estates remain observable, standardized, and secure.', icon: Server }
    ],

    industries: [
      { name: 'Healthcare', description: 'Interoperable patient-data exchange, HIE integration, and compliance-aware connectivity for healthcare systems.' },
      { name: 'Financial Services', description: 'Secure payment gateway integration, ACH/SWIFT connectivity, and regulatory-compliant data exchange.' },
      { name: 'Logistics', description: 'End-to-end TMS/WMS/ERP integration for real-time visibility and operational coordination.' },
      { name: 'E-commerce', description: 'Marketplace integration, multi-channel synchronization, and scalable order-to-fulfillment workflows.' }
    ],

    // UI Structure Slots
    trustPillarsSection: null,
    preMatrixSection: <EPIWhySection />,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <EPIIntegrationGraph />
        <EPIValueAccordion />
        <EPISolutionsCarousel />
        <EPIStrengthsBento />
      </div>
    ),
  };

  const department = {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Transform your business with cutting-edge enterprise platform solutions.',
    icon: <Network className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES (10 core items)
  // ============================================

  const capabilities = [
    {
      title: 'Legacy & Enterprise Application Integration',
      description: 'Connect legacy and modern enterprise applications without disrupting business continuity. We create integration models that reduce disruption, preserve the value of current enterprise assets, and improve coordinated flow of information across heterogeneous environments.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Legacy-to-modern application interoperability',
        'Middleware, adapters, and connector-led integration',
        'Cross-platform data and workflow continuity',
        'Enterprise asset preservation through integration'
      ],
      micro: 'Preserve value while connecting forward.'
    },
    {
      title: 'EDI/B2B & Process Data Integration',
      description: 'Enable secure, standards-based exchange of business documents and partner data at scale. Kangqore helps reduce cycle time, improve supply-chain coordination, and strengthen partner interoperability with standards-conscious integration patterns.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Purchase orders, invoices, and shipping document exchange',
        'Partner-system interoperability and protocol alignment',
        'Reduced manual errors and faster transaction cycles',
        'Compliance-aware B2B integration models'
      ],
      micro: 'Automate partner exchange at enterprise scale.'
    },
    {
      title: 'API Management & Governance',
      description: 'Bring control, consistency, and lifecycle discipline to API-led enterprise integration. Kangqore helps organizations operationalize API estates through governance models that improve standardization, policy control, performance visibility, and lifecycle discipline.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'API security, scaling, and monitoring controls',
        'Lifecycle governance and policy enforcement',
        'Standardization and compliance alignment',
        'Developer enablement and portal strategy'
      ],
      micro: 'Govern APIs with enterprise-grade discipline.'
    },
    {
      title: 'On-Premises to Cloud Integration',
      description: 'Create reliable sync across private infrastructure and public cloud environments. We design integration strategies that bridge private data centers and cloud environments with stronger reliability, security, and scalability.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Hybrid connectivity architecture',
        'Secure data synchronization across environments',
        'Compliance-aware integration patterns',
        'Elasticity and continuity across mixed estates'
      ],
      micro: 'Bridge private and cloud with confidence.'
    },
    {
      title: 'Digital Process Orchestration',
      description: 'Integrate systems, people, and data chains to improve execution across complex workflows. Kangqore structures orchestration layers that connect applications, people, and data into cleaner operational flows.',
      bgImage: '/images/capabilities/automation-rpa.png',
      items: [
        'Workflow automation and orchestration design',
        'System-to-system and human-in-loop coordination',
        'Timely data movement for operational decisions',
        'Better agility across business processes'
      ],
      micro: 'Orchestrate workflows for faster execution.'
    },
    {
      title: 'Serverless & Microservices-Based Integration',
      description: 'Build modular integration ecosystems that are scalable, resilient, and easier to evolve. This improves agility, reduces operational overhead, and supports change-ready ecosystems without forcing everything into one rigid platform model.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Event-driven and microservices-based integration',
        'Serverless patterns for leaner operational overhead',
        'Faster release support through modular architecture',
        'Reusable services for changing business requirements'
      ],
      micro: 'Modular, resilient, and change-ready.'
    },
    {
      title: 'Integration Modernization',
      description: 'Rationalize and modernize legacy integration estates for better governance and scale. The goal is not just migration, but a cleaner and more governable integration foundation.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Migration toward modern integration platforms',
        'iPaaS-oriented modernization strategy',
        'Platform rationalization and complexity reduction',
        'Future-ready integration operating models'
      ],
      micro: 'Modernize the integration layer with intent.'
    },
    {
      title: 'Cloud-Native / Hybrid Integration',
      description: 'Use modern integration patterns across cloud and on-premises environments with stronger flexibility. Kangqore helps balance innovation speed with continuity across mixed infrastructure landscapes.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Container-aware and service-based integration design',
        'Hybrid interoperability across deployment models',
        'Cloud-native scalability and agility enablement',
        'Consistent connectivity across distributed estates'
      ],
      micro: 'Scale natively across hybrid environments.'
    },
    {
      title: 'GenAI / ML-Driven Integration',
      description: 'Introduce intelligence into integration workflows to reduce effort and improve adaptability. This creates a more intelligent integration layer as complexity grows.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-supported mapping and transformation',
        'Data cleansing and anomaly detection support',
        'Self-healing workflow patterns',
        'Smarter operational efficiency across integrations'
      ],
      micro: 'Infuse intelligence into every integration flow.'
    },
    {
      title: 'Next-Generation Integration Engineering',
      description: 'Accelerate delivery through AI-assisted, low-code, and no-code integration engineering patterns. Kangqore uses next-generation engineering patterns to help teams move faster without lowering architectural quality.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Faster engineering cycles through assisted frameworks',
        'Low-code / no-code workflow enablement',
        'Improved maintainability and user empowerment',
        'Reduced routine engineering effort'
      ],
      micro: 'Engineer faster without sacrificing quality.'
    }
  ];

  const technologies = [
    { category: 'Integration Platforms / iPaaS', items: ['MuleSoft', 'Boomi', 'Azure Logic Apps', 'Informatica', 'Workato', 'SnapLogic'] },
    { category: 'API Management & Connectivity', items: ['Kong', 'Apigee', 'WSO2', 'Azure API Management', 'AWS API Gateway', 'NGINX'] },
    { category: 'Messaging / Eventing / Data Movement', items: ['Kafka', 'RabbitMQ', 'ActiveMQ', 'IBM MQ', 'Event-driven tooling', 'Streaming architectures'] },
    { category: 'B2B / EDI', items: ['X12 / EDIFACT', 'AS2 / SFTP', 'Trading partner frameworks', 'Healthcare EDI workflows'] },
    { category: 'Cloud / Hybrid Runtime', items: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Container runtimes', 'Hybrid networking'] },
    { category: 'Observability / Governance', items: ['Prometheus', 'Grafana', 'ELK / OpenSearch', 'API analytics', 'Policy enforcement', 'Runtime monitoring'] }
  ];

  const customFAQs = [
    {
      question: 'What is enterprise platform integration?',
      answer: 'It is the practice of connecting enterprise applications, data flows, APIs, partner systems, and workflows so they can operate as part of a more unified, interoperable business environment.'
    },
    {
      question: 'Why is integration important for digital transformation?',
      answer: 'Because transformation fails when systems remain disconnected. Integration enables continuity between legacy and modern platforms, improves data movement, and helps business processes operate with less friction.'
    },
    {
      question: 'Can you integrate legacy systems without replacing them?',
      answer: 'Yes. In many cases, the right approach is to preserve useful systems while creating modern integration layers around them so they can continue to add value.'
    },
    {
      question: 'What is the difference between API integration and enterprise integration?',
      answer: 'API integration is one important part of enterprise integration. Enterprise integration is broader and can include workflows, EDI/B2B exchange, orchestration, legacy connectivity, partner ecosystems, and hybrid platform interoperability.'
    },
    {
      question: 'Do you support hybrid and cloud integration models?',
      answer: 'Yes. Kangqore supports on-premises, cloud-native, and hybrid integration patterns depending on business constraints, security needs, and modernization goals.'
    },
    {
      question: 'Can AI be used inside integration workflows?',
      answer: 'Yes, selectively. AI and ML can improve mapping, cleansing, anomaly detection, workflow adaptation, and other intelligent process areas when there is a clear operational benefit.'
    },
    {
      question: 'How do you govern large integration estates?',
      answer: 'Through architecture standards, API lifecycle discipline, monitoring, policy enforcement, version control, and runtime observability across the integration ecosystem.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Tools & Technologies We Use Across Enterprise Integration.',
      technologiesDescription: 'We align platform and tooling choices to your environment maturity, integration complexity, governance needs, and modernization strategy—so the ecosystem stays sustainable rather than over-engineered.',
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Kangqore\'s enterprise platform integration capabilities are designed to help organizations connect applications, APIs, data, and workflows in ways that remain scalable, governable, and future-ready as business complexity grows. We combine architecture thinking, interoperability engineering, modernization strategy, process integration, and platform governance to create integration ecosystems that support both continuity and transformation.',
      capabilities,
      trustPillars: service.trustPillars,
      whyKangqore: service.whyKangqore,
      whyKangqoreIntro: service.whyKangqoreIntro,
      industries: service.industries,
      customSections: service.customSections,
      preMatrixSection: service.preMatrixSection,
      postCapabilitiesSections: service.postCapabilitiesSections,
      customFAQs
    },
    department
  };

  return (
    <div className="epi-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .epi-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default EnterprisePlatformIntegration;
