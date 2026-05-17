import React, { useEffect } from 'react';
import { Settings, Search, Layers, Activity, ShieldCheck, Server, Briefcase, Network, Lock, Zap, Cloud } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  ServicenowPhilosophyBackground,
  ServicenowWhySection,
  ServicenowValueDeliver,
  ServicenowDiamondCoESection,
  ServicenowDeliveryModel,
  ServicenowExecutionEcosystem,
  ServicenowFutureReadySection
} from '../../../components/services/platforms/ServicenowCustomSections';

gsap.registerPlugin(ScrollTrigger);

const Servicenow = () => {
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
    name: 'ServiceNow Services',
    titleLine1: 'ServiceNow',
    titleHighlight: 'Transformation.',
    slug: 'servicenow',
    shortDescription: 'Unify enterprise workflows, automate service operations, and scale platform value with confidence.',
    description: 'Kangqore helps enterprises turn ServiceNow into a connected operating layer for IT, employee, customer, and platform workflows. We combine advisory, implementation, integration, automation, security, service operations, and managed evolution to help organizations reduce process friction, improve service visibility, and modernize enterprise operations without creating platform sprawl.',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises turn ServiceNow into a connected operating layer for IT, employee, customer, and platform workflows. We combine advisory, implementation, integration, automation, security, service operations, and managed evolution to help organizations reduce process friction, improve service visibility, and modernize enterprise operations without creating platform sprawl.
        </p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/business-meeting-6774639.mp4', 
    primaryButton: { text: 'Schedule A ServiceNow Assessment', link: '/contact' },
    secondaryButton: { text: 'Talk To Our Experts', link: '#capabilities' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Enterprise Applications', link: '/department/enterprise-applications' },
      { label: 'ServiceNow Services' }
    ],
    
    stats: [
      { value: 'Standardize', label: 'Service operations, controls, and delivery models', color: 'text-cyan-400' },
      { value: 'Automate', label: 'Enterprise workflows with less manual effort', color: 'text-blue-400' },
      { value: 'Integrate', label: 'Systems, data, and platform experiences cleanly', color: 'text-emerald-400' },
      { value: 'Scale', label: 'ServiceNow value across business functions', color: 'text-purple-400' },
    ],

    ctaTitle: "Ready to turn ServiceNow into a stronger enterprise workflow engine?",
    ctaDescription: "Let's design a ServiceNow transformation model that improves service visibility, workflow automation, integration maturity, and long-term platform value—across IT, customer, employee, and enterprise operations.",
    ctaButtonText: "Schedule A ServiceNow Assessment",

    // High Fidelity Content (Matches API Benchmark)
    highFidelity: {
      narrative: {
        badge: "SERVICENOW :: WORKFLOW ORCHESTRATION",
        titleLine1: "Orchestrating",
        titleHighlight: "Connected",
        titleLine2: "Enterprise Workflows",
        description: "Enterprise service platforms demand more than ticket routing. They require workflow standardization, platform governance, integration maturity, and the ability to evolve as organizational complexity grows. At Kangqore, we engineer ServiceNow as a connected enterprise operating layer.",
        bottleneckLabel: "The Challenge",
        bottleneckText: "Siloed processes, manual workflows, inconsistent governance, and weak tool adoption prevent organizations from realizing the full value of their ServiceNow investment. Without structured platform discipline, service environments become liabilities instead of assets.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified transformation discipline that connects workflow design, service standardization, security operations, and integration management into one cohesive, scalable enterprise platform.",
        image: "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Workflow Maturity",
        statusValue: "100% GOVERNED"
      },
      philosophy: {
        icon: <Settings className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Standardize with Clarity.",
        titleHighlight: "Scale with Purpose.",
        description: "We replace fragmented service silos with architected, governed workflow platforms designed for absolute operational confidence.",
        bgElement: <ServicenowPhilosophyBackground />,
        pills: ['Workflow Discipline', 'Service Standardization', 'Security-First', 'Platform Evolution'],
        features: [
          { title: 'Workflow Discipline', label: 'Operational Standardization', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Structure ServiceNow around real operating models, governance needs, and workflow maturity to create a disciplined service environment.' },
          { title: 'Platform Connectedness', label: 'Enterprise Integration', icon: <Network className="w-5 h-5 text-gray-400" />, content: 'Integrate ServiceNow into broader enterprise systems, APIs, and data layers instead of allowing new operational silos.' },
          { title: 'Security Operations', label: 'Governance & Compliance', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Build workflow-driven handling of security incidents, GRC processes, and compliance evidence for stronger enterprise resilience.' },
          { title: 'Managed Evolution', label: 'Long-Term Value', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Support long-term platform maturity through continuous optimization, adoption management, and roadmap execution.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: SNOW_V2',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from fragmented service tools to a governed, scalable enterprise workflow platform.',
        layers: [
          { title: 'Assess', id: 'SN_ASS', icon: <Search />, desc: 'Evaluate workflows, service maturity, pain points, governance gaps, and platform opportunity areas.' },
          { title: 'Design', id: 'SN_DES', icon: <Layers />, desc: 'Define roadmap, module priorities, workflow architecture, integration needs, and delivery approach.' },
          { title: 'Implement', id: 'SN_IMP', icon: <Server />, desc: 'Configure, extend, integrate, automate, and launch ServiceNow capabilities across the enterprise.' },
          { title: 'Operate', id: 'SN_OPR', icon: <Activity />, desc: 'Support adoption, optimize workflows, manage improvements, and expand platform value over time.' }
        ]
      },
      schematic: {
        titleLine1: 'Governed Workflows.',
        titleHighlight: 'Sustained Value.',
        description: 'Your ServiceNow environment should be your most reliable enterprise operating layer. We engineer it to scale with your business—across every workflow domain and service milestone.',
        stats: [
          { label: 'Manual Effort', val: '-60%' },
          { label: 'Service Visibility', val: '+45%' },
          { label: 'Platform ROI', val: '+50%' }
        ]
      }
    },

    trustPillars: [
      { title: 'Workflow discipline before platform expansion', tag: 'Governance', description: 'Structure ServiceNow around real operating models, governance needs, and workflow maturity.' },
      { title: 'Enterprise integration over new silos', tag: 'Architecture', description: 'Connect ServiceNow into broader enterprise systems instead of creating isolated platform islands.' },
      { title: 'Automation with governance and visibility', tag: 'Operations', description: 'Use workflow automation to reduce manual friction while preserving governance, security, and compliance.' }
    ],
    whyKangqore: [
      { title: 'Workflow Discipline', description: 'We structure ServiceNow around real operating models, governance needs, and workflow maturity—not just module activation.', icon: Layers },
      { title: 'Platform Connectedness', description: 'We integrate ServiceNow into broader enterprise systems instead of allowing new operational silos to form.', icon: Network },
      { title: 'Automation with Control', description: 'We use workflow automation to reduce manual friction while preserving governance, security, and compliance visibility.', icon: ShieldCheck }
    ],
    industries: [
      { name: 'Financial Services', description: 'Governed service workflows meeting regulatory, compliance, and operational resilience requirements.' },
      { name: 'Healthcare', description: 'Standardized IT and enterprise service operations supporting clinical efficiency and compliance.' },
      { name: 'Manufacturing', description: 'Connected IT and OT service workflows improving asset visibility and operational continuity.' },
      { name: 'Technology', description: 'Scalable ITSM and platform workflows supporting rapid growth and engineering velocity.' }
    ],

    // Premium Capabilities configured for the ServicePageTemplate Carousel
    capabilitiesTitle: 'Our Capabilities.',
    capabilitiesDescription: 'Kangqore\'s ServiceNow capabilities are designed to help enterprises turn the platform into a connected operating layer across IT, security, enterprise workflows, and platform integration.',
    
    // UI Structure Slots
    preMatrixSection: <ServicenowWhySection />,
    customSections: null,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full sn-specific-overrides">
        <ServicenowDiamondCoESection />
        <ServicenowValueDeliver />
        <ServicenowDeliveryModel />
        <ServicenowFutureReadySection />
      </div>
    ),
    
    postFAQSections: (
      <div className="flex flex-col w-full">
        <ServicenowExecutionEcosystem />
      </div>
    )
  };

  const department = {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Modernize business operations through connected platforms.',
    icon: <Settings className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES — 4 Rich Cards
  // ============================================

  const capabilities = [
    {
      title: 'IT Service & Operations Management',
      description: 'Modernize core IT service delivery with better control, visibility, and operational consistency. This capability focuses on making IT services more structured, measurable, and responsive—building a stronger service operating backbone so incidents, requests, infrastructure events, and asset visibility are handled through a more unified model.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { heading: 'IT Service Management (ITSM)', description: 'Standardize incident, request, problem, and change workflows so service delivery becomes more reliable and easier to govern.' },
        { heading: 'IT Operations Management (ITOM)', description: 'Improve infrastructure and operations visibility through smarter monitoring, event handling, and operational response models.' },
        { heading: 'IT Asset Management (ITAM)', description: 'Create better lifecycle visibility into hardware, software, and enterprise technology assets to improve cost control and planning.' },
        { heading: 'Operational Standardization', description: 'Align service processes to stronger operating discipline and reduce fragmentation across teams and tools.' },
        { heading: 'Better Service Visibility', description: 'Give leadership and operations teams a clearer view of service health, asset state, and operational bottlenecks.' }
      ],
      micro: 'Structured IT services that scale with enterprise complexity.'
    },
    {
      title: 'Security Management',
      description: 'Strengthen enterprise resilience through ServiceNow-led security operations and governance workflows. This capability uses ServiceNow not just for IT tickets, but as a structured control layer for security-related process management—creating more disciplined workflows for incident response, governance tracking, compliance evidence, and operational accountability.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        { heading: 'Security Operations', description: 'Build workflow-driven handling of security issues, incidents, escalations, and remediation actions.' },
        { heading: 'Governance, Risk & Compliance (GRC)', description: 'Support policy enforcement, audit readiness, exception management, and control tracking through structured workflows.' },
        { heading: 'Compliance-Led Visibility', description: 'Improve traceability across security actions, approvals, and governance activities.' },
        { heading: 'Risk Reduction Through Process Discipline', description: 'Reduce gaps created by manual handoffs, inconsistent controls, or weak operational ownership.' },
        { heading: 'Security in Enterprise Workflows', description: 'Bring security and compliance closer to day-to-day operational execution instead of treating them as isolated review layers.' }
      ],
      micro: 'Security woven into the operational fabric.'
    },
    {
      title: 'Enterprise Service Management',
      description: 'Extend ServiceNow beyond IT to support customer, employee, and business workflow modernization. This capability is broader than classic ITSM—positioning ServiceNow as an enterprise workflow transformation platform where it supports not only IT teams, but also employee experiences, service operations, customer-facing processes, and internal business services.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        { heading: 'Customer Service Management', description: 'Improve service coordination and responsiveness across customer-facing support journeys.' },
        { heading: 'Onboarding and Transitions', description: 'Digitize employee, vendor, or internal transition workflows so processes move faster with fewer delays and handoff issues.' },
        { heading: 'Custom Applications', description: 'Build tailored workflow apps for business-specific service needs that standard modules do not fully cover.' },
        { heading: 'Cross-Functional Workflow Enablement', description: 'Connect departments through shared service models instead of isolated manual processes.' },
        { heading: 'Enterprise-Wide Service Consistency', description: 'Create a more unified experience across service requests, approvals, fulfillment, and support delivery.' }
      ],
      micro: 'ServiceNow as an enterprise-wide workflow layer.'
    },
    {
      title: 'Integration Management',
      description: 'Connect ServiceNow with enterprise systems, APIs, and platform extensions to reduce silos and increase workflow continuity. This is the platform-connectivity layer: the part that ensures ServiceNow does not sit alone, but works as part of a larger enterprise ecosystem through integrations, API exposure, app-led extension, and cleaner interoperability.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        { heading: 'App Engine Enablement', description: 'Extend platform value by building business-fit workflow applications on top of ServiceNow.' },
        { heading: 'REST API Integration', description: 'Connect ServiceNow cleanly with enterprise applications, data sources, and workflow services.' },
        { heading: 'App Store / Ecosystem Leverage', description: 'Accelerate capability adoption through reusable apps, accelerators, and packaged extensions.' },
        { heading: 'Third-Party System Connectivity', description: 'Reduce silos by integrating ServiceNow with surrounding business and IT platforms.' },
        { heading: 'Workflow Continuity Across Systems', description: 'Ensure data, events, and process actions move more smoothly across the enterprise environment.' }
      ],
      micro: 'ServiceNow connected to the full enterprise stack.'
    }
  ];

  // ============================================
  // TOOLS & TECHNOLOGIES
  // ============================================

  const technologies = [
    { category: 'Platform & Workflow Areas', items: ['ServiceNow ITSM', 'ServiceNow ITOM', 'ServiceNow ITAM', 'Customer Service Management', 'GRC', 'Security Operations', 'App Engine', 'Service Catalog', 'Employee Workflows'] },
    { category: 'Integration & Extension', items: ['REST APIs', 'Third-Party Enterprise Apps', 'Identity & Data Sync Layers', 'Custom App Extensions', 'AIOps-Compatible Integrations'] }
  ];

  // ============================================
  // CUSTOM FAQs
  // ============================================

  const customFAQs = [
    {
      question: 'What does ServiceNow transformation usually include?',
      answer: 'It typically includes a mix of advisory, implementation, integration, automation, platform configuration, and managed support depending on the maturity of the environment and the workflows being modernized.'
    },
    {
      question: 'Which workflow areas can ServiceNow support?',
      answer: 'IT, customer, employee, and platform workflows, with specific capability references to ITSM, ITOM, ITAM, security operations, GRC, customer service management, onboarding, custom apps, and integration management.'
    },
    {
      question: 'Why is integration important in a ServiceNow program?',
      answer: 'Because value drops quickly when workflows stay disconnected. Third-party integration, data synchronization, App Engine, REST APIs, and workflow automation are central to platform effectiveness.'
    },
    {
      question: 'How does ServiceNow help reduce inefficiency?',
      answer: 'By standardizing processes, reducing manual effort, increasing visibility, and improving workflow alignment across service functions.'
    },
    {
      question: 'Can ServiceNow support security and compliance use cases?',
      answer: 'Yes. Security Operations plus Governance, Risk and Compliance is an explicit part of the ServiceNow capability set we implement.'
    },
    {
      question: 'What engagement models are possible?',
      answer: 'We offer fixed one-time services, fixed monthly services, staff augmentation, and core-flex style models—each tailored to the maturity and velocity of your ServiceNow program.'
    },
    {
      question: 'What outcomes should enterprises expect?',
      answer: 'Better service standardization, lower manual effort, improved visibility, cost optimization, and stronger value realization from platform investments.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      customFAQs
    },
    department
  };

  return (
    <div className="servicenow-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .servicenow-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default Servicenow;
