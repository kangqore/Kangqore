import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Cloud, Layers, Zap, Search, Activity, ShieldCheck, 
  Database, Network, Settings, ServerCrash, LayoutDashboard, ArrowRight,
  BrainCircuit, Bot, Target, Workflow, CheckCircle2, Award, Users,
  HeartPlus, Briefcase, Lock, MonitorSmartphone, KeySquare, Laptop2, Plus, Minus,
  Cpu, Radar, Eye, TrendingUp, BarChart3, Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ManagedServices = () => {
  // ============================================
  // A. HERO SECTION
  // ============================================
  const service = {
    name: 'Managed Services',
    titleLine1: 'Managed IT',
    titleHighlight: 'Services.',
    slug: 'managed-services',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    shortDescription: "Today\u2019s IT teams are expected to run always-on operations while driving transformation.",
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore Managed Services gives you a scalable, measurable operating layer — combining service desk excellence, endpoint and platform operations, cloud, security, DevOps, and governance-ready support to keep your business moving with confidence.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    stats: [
      { value: 'Reduce', label: 'Risk & operational complexity', color: 'text-blue-500' },
      { value: 'Accelerate', label: 'Outcomes & productivity', color: 'text-brand-blue' },
      { value: 'Predictable', label: 'Costs & service quality', color: 'text-indigo-500' },
      { value: 'Always-On', label: 'Support & resilience', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    ctaTitle: 'Ready to run IT operations with less chaos — and more control?',
    ctaDescription: 'Talk to Kangqore experts to assess your environment, define SLAs, and build a scalable managed services roadmap aligned to business outcomes.',

    // ============================================
    // B. PROBLEM / MARKET TENSION + C. DELIVERY MODEL + D. LIFECYCLE + E. STATEMENT
    // ============================================
    highFidelity: {
      // B. Problem Section
      narrative: {
        badge: 'MANAGED OPERATIONS :: 2026',
        titleLine1: 'The hybrid IT reality is',
        titleHighlight: 'stretching teams thin.',
        titleLine2: '',
        description: 'Hybrid operations have expanded support scope, security exposure, tooling complexity, and service expectations — pulling IT leaders away from modernization priorities and strategic execution.',
        bottleneckLabel: 'The Overload',
        bottleneckText: '81% of IT leaders feel overwhelmed by functional responsibilities.*',
        requirementLabel: 'The Conflict',
        requirementText: '76% struggle to balance innovation with operational excellence.*',
        image: '/images/hybrid-it-reality-7793698.jpg',
        statusLabel: 'Architecture',
        statusValue: 'Constrained'
      },
      // C. Delivery Model Intro Panel
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'Our Managed Services',
        titleHighlight: 'Delivery Model.',
        description: 'At Kangqore, Managed Services is structured across four rigorous execution phases to ensure zero disruption, strong governance, and measurable enterprise-scale continuity.',
        pills: ['Assess & Baseline', 'Transition & Stabilize', 'Operate & Govern', 'Optimize & Transform']
      },
      // D. 4-Phase Operating Lifecycle
      matrix: {
        engineId: 'Engine :: MNG_OPS_V1',
        title: '4-Phase Operating Lifecycle',
        subtext: 'We deconstruct the complexity of enterprise operations into measurable, risk-aware execution layers.',
        layers: [
          { title: 'Assess', id: 'MNG_ASSESS', icon: <Search />, desc: 'Inventory, maturity scoring, risk posture, SLA mapping, and support model design.' },
          { title: 'Transition', id: 'MNG_TRANS', icon: <Layers />, desc: 'Knowledge transfer, tooling integration, runbooks, pilot rollout, and stabilization planning.' },
          { title: 'Operate', id: 'MNG_OPS', icon: <ShieldCheck />, desc: 'ITIL-aligned operations, SLO/SLA governance, reporting, continuous monitoring, and service coordination.' },
          { title: 'Optimize', id: 'MNG_OPT', icon: <Activity />, desc: 'Automation, cost optimization, proactive incident reduction, service improvements, and operational maturity gains.' }
        ]
      },
      // E. Big Statement / Positioning Block
      schematic: {
        titleLine1: 'A Single',
        titleHighlight: 'Operating Model.',
        description: 'Run your IT, apps, cloud, DevOps, testing, security, and endpoint operations through one governed framework — built for continuity, measurable outcomes, and business resilience.',
        stats: [
          { label: 'Reliability', val: 'SLO-BACKED' },
          { label: 'Resolution', val: 'ACCELERATED' },
          { label: 'Efficiency', val: 'MEASURABLE' }
        ]
      }
    },

    // ============================================
    // F. CAPABILITIES INTRO
    // ============================================
    capabilitiesDescription: 'Kangqore delivers managed capabilities across applications, cloud, DevOps, quality, service operations, endpoint environments, and security — helping enterprises reduce support friction, strengthen governance, and continuously improve operational performance.\n\nOur managed services model is built to move beyond reactive support. We combine structured operations, intelligent automation, platform expertise, and measurable service governance to help organizations run stable, scalable, and always-on environments with confidence.',

    // ============================================
    // G. TRUST PILLARS (Blue Gradient Section) - Left rotating cards
    // ============================================
    trustPillars: [
      {
        title: 'Zero-Disruption Transition',
        tag: 'Execution',
        description: 'Our transition framework is designed to ensure seamless knowledge transfer, tooling alignment, runbook maturity, and operational continuity without disrupting business performance.'
      },
      {
        title: 'Outcome-Driven SLA Governance',
        tag: 'Governance',
        description: 'Our SLA models go well beyond uptime metrics. We define and govern service outcomes against continuity, performance, and business KPIs with full transparency and accountability.'
      },
      {
        title: 'Proactive Monitoring & Observability',
        tag: 'Operations',
        description: 'We deploy advanced telemetry, event correlation, and predictive analytics to detect and resolve anomalies before they impact your business operations or end-user experience.'
      },
      {
        title: 'Continuous Service Optimization',
        tag: 'Scale',
        description: 'We deploy FinOps, proactive automation, backlog reduction, and recurring improvement cadences to reduce incident volume and structurally lower your total cost of ownership.'
      }
    ],
    // G. Right-side panel content
    trustPillarsRightTitle: 'Governed Managed Operations: Built for Trust, Control & Continuity',
    trustPillarsRightDescription: 'Kangqore structures managed services around measurable SLAs, proactive monitoring, disciplined governance, and automation-led improvement. We combine expert-led execution with intelligent operational tooling to help organizations scale support without sacrificing visibility, stability, or control.',
    trustPillarsRightButton: 'Request a Consultation',

    // ============================================
    // H. WHY KANGQORE SECTION
    // ============================================
    whyKangqore: [
      { 
        icon: Award, 
        title: 'Enterprise Operational Pedigree', 
        description: 'Stabilizing and optimizing complex IT environments with disciplined execution and service maturity.' 
      },
      { 
        icon: Target, 
        title: 'Outcome-Driven SLAs', 
        description: 'We align service governance to continuity, performance, and business KPIs — not just ticket closure.' 
      },
      { 
        icon: Users, 
        title: 'Specialized Expertise On Demand', 
        description: 'Access certified cloud, service, automation, security, and platform experts without the hiring overhead.' 
      },
      {
        icon: ShieldCheck,
        title: 'Zero-Disruption Transition',
        description: 'Structured onboarding, knowledge transfer, and stabilization that protects continuity from day one.'
      },
      {
        icon: TrendingUp,
        title: 'Continuous Optimization Culture',
        description: 'We improve service quality over time through automation, backlog reduction, and recurring review cadences.'
      },
      {
        icon: Gauge,
        title: 'Governance That Scales',
        description: 'Escalation models, review frameworks, operational reporting, and service visibility built for enterprise control.'
      }
    ],

    // ============================================
    // I. INDUSTRY-SPECIFIC SOLUTIONS
    // ============================================
    industryTitle: 'Industry-Specific Solutions.',
    industryIntro: 'We bring deep domain context to deliver managed services that align to operational realities across regulated, customer-centric, and technology-intensive industries.',

    // ============================================
    // J. FAQ SECTION - faqTitle + faqSubline
    // ============================================
    faqTitle: 'Frequently Asked Questions',
    faqSubline: 'Common questions about our Managed Services model, governance, support structure, and delivery outcomes.',
  };

  const department = {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    description: 'Transform your business with cutting-edge infrastructure, networks & operations solutions.'
  };

  // ============================================
  // F. CAPABILITIES — 10 Cards (Carousel)
  // ============================================
  const capabilities = [
    {
      title: 'Managed Application Support',
      description: 'Keep business-critical applications stable, updated, and continuously improving.\n\nKangqore provides structured support for core business applications to ensure reliability, release readiness, and operational continuity. We combine support, maintenance, enhancements, and proactive monitoring to reduce backlog, improve responsiveness, and keep applications aligned with business needs.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: ['L2/L3 support, corrective maintenance, and issue resolution', 'Enhancement support and controlled release management', 'Backlog reduction and service improvement planning', 'Performance, reliability, and availability monitoring']
    },
    {
      title: 'Salesforce Managed Services',
      description: 'Maximize Salesforce ROI with certified expertise and always-on optimization.\n\nOur Salesforce managed services help organizations keep their CRM ecosystem agile, governed, and high-performing. From administration and enhancements to integrations and platform health, Kangqore ensures Salesforce continues to evolve with your business.',
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Admin, configuration, workflow, and enhancement delivery', 'Custom development and third-party integrations', 'Data quality, governance, and cleanup operations', 'Platform monitoring, support, and performance optimization']
    },
    {
      title: 'Managed Testing Services',
      description: 'Protect release quality while accelerating delivery confidence.\n\nKangqore delivers managed testing operations that embed quality into your release lifecycle. We support functional validation, regression readiness, performance assurance, and continuous quality reporting so your teams can ship with greater trust and fewer surprises.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: ['Functional, regression, and usability validation', 'Performance and security testing support', 'Test process optimization and release readiness checks', 'Continuous QA reporting, dashboards, and quality KPIs']
    },
    {
      title: 'Cloud Managed Services',
      description: 'Operate cloud with speed, control, cost visibility, and resilience.\n\nWe help enterprises run cloud environments with stronger governance, better observability, and disciplined operational support. Kangqore combines cloud operations, optimization, and compliance management to reduce complexity across modern infrastructure estates.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['Cloud monitoring, operations, and incident handling', 'Migration support and environment optimization', 'Cost governance, utilization tracking, and FinOps practices', 'Compliance posture management and operational controls']
    },
    {
      title: 'DevOps Managed Services',
      description: 'Make releases more predictable through automation and delivery discipline.\n\nKangqore supports DevOps environments through managed pipeline operations, automation frameworks, and continuous delivery governance. We help engineering teams accelerate changes while improving reliability, deployment consistency, and toolchain efficiency.',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: ['CI/CD pipeline implementation and managed operations', 'Build, test, and release automation support', 'Deployment reliability and change governance', 'Continuous improvement across the DevOps toolchain']
    },
    {
      title: 'Managed Security Services',
      description: 'Stay ahead of evolving threats with continuous monitoring and rapid response.\n\nOur managed security services strengthen enterprise defense through operational vigilance, guided remediation, and governance-driven improvement. Kangqore helps organizations reduce security risk while building a stronger, more resilient security posture over time.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Vulnerability management and threat detection support', 'Incident response coordination and playbook-driven action', 'Security posture reviews and control improvement', 'Ongoing advisory, reporting, and remediation guidance']
    },
    {
      title: 'Intelligent Service Desk',
      description: "Fast, responsive user support that doesn\u2019t consume your core IT bandwidth.\n\nKangqore\u2019s service desk model is designed to improve user experience while reducing operational burden on internal teams. We provide responsive support, request fulfilment, self-service enablement, and workflow standardization to create a more scalable support function.",
      image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['24/7 help desk and request fulfilment operations', 'Self-service enablement and knowledge base support', 'Service catalog workflows and ticket automation', 'Field support or on-site options where required']
    },
    {
      title: 'Modern Endpoint & Device Management',
      description: 'Keep devices compliant, patched, and productive at scale.\n\nWe help enterprises manage the full endpoint lifecycle with consistency, security, and operational control. From provisioning and compliance to patching and digital experience monitoring, Kangqore ensures endpoint ecosystems remain stable and user-ready.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/iot-connected.png',
      items: ['Full device lifecycle and endpoint administration', 'Asset management and compliance controls', 'Patch management, packaging, and software distribution', 'Experience monitoring and proactive remediation actions']
    },
    {
      title: 'Identity & Endpoint Security Management',
      description: 'Protect users, devices, and data with hardened controls and policy enforcement.\n\nKangqore helps organizations strengthen endpoint and identity security through policy-led governance, encryption controls, privileged access oversight, and audit-ready operational discipline. The result is stronger protection without sacrificing usability.',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: ['Endpoint security and encryption management', 'Secure wipe, remote tracking, and control enforcement', 'Privileged access and identity governance support', 'Policy-based controls and audit readiness measures']
    },
    {
      title: 'Provisioning & Deployment Operations',
      description: 'Standardized rollout, recovery, and workplace enablement for modern operations.\n\nWe streamline provisioning and deployment services to support modern workplace readiness at scale. Kangqore ensures devices, environments, and user setups are delivered consistently through standardized execution, lifecycle coordination, and operational support.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: ['Provisioning and configuration services', 'Deployment and redeployment coordination', 'Asset recovery and lifecycle support', 'Collaboration enablement and virtual desktop support']
    }
  ];

  // ============================================
  // K. TOOLS & TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'ITSM / Workflow', items: ['ServiceNow', 'Jira Service Management', 'Freshservice', 'ManageEngine'] },
    { category: 'Observability', items: ['Grafana', 'Prometheus', 'ELK', 'Datadog', 'New Relic', 'OpenTelemetry'] },
    { category: 'Endpoint / UEM', items: ['Microsoft Intune', 'Jamf', 'Workspace ONE'] },
    { category: 'Security', items: ['EDR/XDR Platforms', 'SIEM Integrations', 'IAM/PAM Tooling'] },
    { category: 'Cloud Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud Platform (GCP)'] },
    { category: 'DevOps Tooling', items: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'ArgoCD'] },
    { category: 'Automation', items: ['Power Automate', 'Ansible', 'Terraform'] }
  ];

  // K. Tools heading + description overrides
  service.technologiesTitle = 'Tools & Technologies We Excel In';
  service.technologiesDescription = 'An enterprise-grade managed services stack built for workflow control, observability, endpoint governance, and operational resilience.';

  // ============================================
  // J. FAQS
  // ============================================
  const customFAQs = [
    {
      question: "What\u2019s included in Managed IT Services beyond support tickets?",
      answer: 'We go far beyond reactive break-fix. Our Managed Services include proactive infrastructure monitoring, regular security patching, capacity planning, continuous cost optimization (FinOps), architectural reviews, and automated incident remediation. We function as a strategic extension of your IT capability.'
    },
    {
      question: 'How do you structure SLAs, escalation, and governance?',
      answer: 'Our Service Level Agreements (SLAs) are co-created with you, focusing on business outcomes rather than just technical uptime. We establish clear escalation matrices, dedicated account managers, and transparent governance cadences (weekly operational reviews, monthly executive reporting) to ensure absolute accountability.'
    },
    {
      question: 'Can you support hybrid environments and distributed teams?',
      answer: 'Absolutely. We manage complex, hybrid ecosystems encompassing on-premise data centers, multi-cloud architectures, edge devices, and global remote workforces. Our tooling and processes are designed to secure and optimize distributed infrastructure seamlessly.'
    },
    {
      question: 'How do you improve service quality over time, not just maintain it?',
      answer: 'We implement a Continuous Improvement (CI) cadence utilizing ITIL best practices and automation. By analyzing incident trends, we identify root causes and deploy automation (runbooks, self-healing scripts) to permanently eliminate recurring issues, structurally lowering your ticket volume over time.'
    },
    {
      question: 'Do you provide 24/7 support and proactive monitoring?',
      answer: 'Yes. Our Network Operations Center (NOC) and Security Operations Center (SOC) provide fully managed, SLA-backed 24/7/365 coverage. We leverage advanced telemetry and predictive analytics to detect and resolve anomalies before they impact your business operations.'
    },
    {
      question: 'How do pricing models work: fixed, consumption, or hybrid?',
      answer: 'We offer flexible commercial models aligned to your growth trajectory. This includes fixed-fee per-device/per-user models for predictable budgeting, consumption-based pricing for dynamic cloud resources, or hybrid models that blend base coverage with block-hour access for ad-hoc specialization.'
    }
  ];

  // ============================================
  // H. WHY KANGQORE Intro Text
  // ============================================
  const whyKangqoreIntro = 'Kangqore bridges the gap between hybrid IT complexity and governed, scalable operations. We deliver outcome-driven managed services that stabilize service environments, improve operational efficiency, and strengthen resilience across every layer of the enterprise.';

  // ============================================
  // I. INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Banking & Financial Services', description: 'Regulated infrastructure operations with audit-ready governance.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA-compliant IT operations ensuring clinical system availability.' },
    { name: 'Retail & Consumer Goods', description: 'Always-on platform support for omnichannel commerce at scale.' },
    { name: 'Manufacturing', description: 'Zero-downtime industrial IT with predictive monitoring & OT integration.' },
    { name: 'Technology', description: 'DevOps-ready managed operations for fast-moving engineering teams.' },
    { name: 'Professional Services', description: 'Scalable IT backbone enabling distributed workforce productivity.' }
  ];

  // ============================================
  // GSAP ANIMATION HOOKS
  // ============================================
  const diamondRef = useRef(null);
  const differentiatorRef = useRef(null);

  useEffect(() => {
    // 1. Animated Stat Counters (81% and 76%)
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/(\d+)%/);
        if (match) {
          const targetNum = parseInt(match[1]);
          const originalText = text;
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = originalText.replace(`${targetNum}%`, `${Math.round(counter.val)}%`);
                }
              });
            }
          });
        }
      });
    };

    // 2. Diamond Entrance Animation (fade-in + scale-up)
    if (diamondRef.current) {
      gsap.fromTo(diamondRef.current,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: diamondRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      // 3. Diamond Parallax (subtle float on scroll)
      gsap.to(diamondRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: diamondRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // 4. Differentiator items staggered entrance
    if (differentiatorRef.current) {
      const items = differentiatorRef.current.querySelectorAll('.diff-item');
      gsap.fromTo(items,
        { opacity: 0, y: 30, x: -20 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: differentiatorRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // Run counter animation after a brief delay to ensure template has rendered
    const timer = setTimeout(animateCounters, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ============================================
  // L. OPERATIONS CENTER OF EXCELLENCE SECTION (3D Diamond)
  // Adapted from DPA Page for Managed Services
  // ============================================
  const operationsCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT: INTRO + DIAGRAM ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's Managed Operations Center of Excellence (CoE) surrounds your infrastructure with four vital execution layers — <strong className="text-brand-blue">Service Desk Ops</strong>, <strong className="text-brand-blue">Cloud & Platform Ops</strong>, <strong className="text-brand-blue">Security & Identity</strong>, and <strong className="text-brand-blue">Endpoint & Devices</strong>.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                We replace fragmented support with a unified capability model. From intelligent ticket routing and FinOps governance to zero-trust enforcement and modern device management, our architecture ensures continuous availability, predictable scaling, and uncompromising operational control.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            {/* Desktop Diamond Layout */}
            <div ref={diamondRef} className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                {/* SVG — connector lines (brand blue/cyan) */}
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  {/* Top */}
                  <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  {/* Left */}
                  <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  {/* Bottom */}
                  <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  {/* Right */}
                  <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                {/* ===== TRUE 3D DIAMOND ===== */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{
                  perspective: '900px',
                  perspectiveOrigin: '50% 40%'
                }}>
                  {/* 3D tilted diamond */}
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{
                      transformStyle: 'preserve-3d'
                    }}>
                      {/* Top Left -> Service Desk */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Service Desk</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Operations</span>
                        </div>
                      </div>
                      {/* Top Right -> Cloud & Platform */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Cloud & Platform</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Operations</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Security & Identity */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)',
                        transform: 'translateZ(2px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Security &</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Identity</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Endpoint & Devices */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Endpoint &</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Devices</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== BULLET LABELS (simple text) ===== */}
                {/* Top-Left: Service Desk bullets */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>L1/L2 Incident Management</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Self-Service & AI Triage</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Service Catalog Workflows</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>VIP & Executive Support</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Top-Right: Cloud & Platform bullets */}
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Infrastructure Monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Cloud FinOps & Cost Control</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Capacity Planning & Auto-scaling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Release & Pipeline Governance</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Left: Security & Identity bullets */}
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Threat Telemetry & Alerting</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Privileged Access Controls</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Vulnerability Management</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Zero-Trust Policy Enforcement</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Right: Endpoint & Devices bullets */}
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>UEM & Device Lifecycle</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Zero-Touch Provisioning</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>OS Patching & Compliance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Digital Experience Analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

           {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { 
                title: 'Service Desk Operations', 
                gradient: 'from-[#2564ea] to-[#3b82f6]',
                dotColor: 'bg-[#2564ea]',
                items: ['L1/L2 Incident Management', 'Self-Service & AI Triage', 'Service Catalog Workflows', 'VIP & Executive Support']
              },
              { 
                title: 'Cloud & Platform', 
                gradient: 'from-[#3b82f6] to-[#60a5fa]',
                dotColor: 'bg-[#3b82f6]',
                items: ['Infrastructure Monitoring', 'Cloud FinOps & Cost Control', 'Capacity Planning & Auto-scaling', 'Release & Pipeline Governance']
              },
              { 
                title: 'Security & Identity', 
                gradient: 'from-[#1e40af] to-[#2564ea]',
                dotColor: 'bg-[#1e40af]',
                items: ['Threat Telemetry & Alerting', 'Privileged Access Controls', 'Vulnerability Management', 'Zero-Trust Policy Enforcement']
              },
              { 
                title: 'Endpoint & Devices', 
                gradient: 'from-[#4ab6d4] to-[#38bdf8]',
                dotColor: 'bg-[#4ab6d4]',
                items: ['UEM & Device Lifecycle', 'Zero-Touch Provisioning', 'OS Patching & Compliance', 'Digital Experience Analytics']
              }
            ].map((quadrant, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {quadrant.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* ==================== KEY DIFFERENTIATORS ==================== */}
        <div ref={differentiatorRef} className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Outcome-Driven Service Level Agreements',
                text: 'We align our SLAs to business continuity, application performance, and end-user productivity metrics—going far beyond simple uptime and ticket closure rates to ensure IT actively supports your enterprise objectives.'
              },
              {
                num: 2,
                title: 'Zero-Disruption Transition Framework',
                text: 'Our onboarding methodology minimizes risk and protects operational momentum through disciplined runbook generation, knowledge transfer protocols, and rigorous shadow-support stabilization phases.'
              },
              {
                num: 3,
                title: 'Predictive Monitoring & Observability',
                text: 'By deploying advanced telemetry and event-correlation platforms, we transition your environment from reactive firefighting to proactive fault resolution, neutralizing anomalies before they become critical incidents.'
              },
              {
                num: 4,
                title: 'FinOps & Continuous Optimization',
                text: 'Our cloud operations teams continuously audit utilization, right-size compute infrastructure, and identify licensing redundancies to structurally lower your total cost of ownership and eliminate ecosystem bloat.'
              },
              {
                num: 5,
                title: 'Unified Operational Visibility',
                text: 'We replace siloed operations with a single, governed pane of glass—providing CIOs and IT leaders with transparent access to cross-functional reporting, escalation metrics, and continuous improvement backlogs.'
              }
            ].map((diff) => (
              <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // M. EXECUTION ECOSYSTEM SECTION
  // Adapted from DPA Page for Managed Services
  // ============================================
  const executionEcosystemSection = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Operations <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Scale your managed services capabilities by integrating core operations with specialized architecture, continuity, and compliance solutions.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Cloud Infrastructure & Migrations', 
                  link: '/services/infrastructure-networks-operations/cloud-infrastructure-migrations',
                  icon: <Cloud className="w-5 h-5" />,
                  desc: 'Architect and deploy resilient cloud estates.'
                },
                { 
                  name: 'Network & Connectivity', 
                  link: '/services/infrastructure-networks-operations/network-connectivity-engineering',
                  icon: <Network className="w-5 h-5" />,
                  desc: 'Engineer secure, high-throughput enterprise networks.'
                },
                { 
                  name: 'Identity & Access Management', 
                  link: '/services/cybersecurity/identity-access-management',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  desc: 'Deploy absolute access control and zero-trust.'
                },
                { 
                  name: 'Disaster Recovery & BCP', 
                  link: '/services/infrastructure-networks-operations/disaster-recovery-bcp',
                  icon: <Database className="w-5 h-5" />,
                  desc: 'Ensure total data resilience and failover capability.'
                }
              ].map((offering, idx) => (
                <Link 
                  key={idx} 
                  to={offering.link}
                  className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    {offering.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
              >
                Explore Services 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // GOVERNING_ECOSYSTEM...
              </div>
            </div>
          </div>

          {/* Technical Schematic: Centralized Operations Hub */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_MNG_NOC</span></div>
                <div className="flex justify-between gap-4"><span>SLA:</span> <span className="text-emerald-500">99.999%</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">GOVERNED</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Operations Engine</div>
                <div>CORRELATING_EVENTS...</div>
                <div>UPTIME: STABLE</div>
              </div>

              {/* Central Core (NOC/SOC Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Server className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Infrastructure, Security, Analytics) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Layers className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Platform</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">SLA</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Metrics</span>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <Radar className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Telemetry</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="ops-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#ops-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Combine data for the template injection
  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Tools & Technologies We Excel In',
      technologiesDescription: 'An enterprise-grade managed services stack built for workflow control, observability, endpoint governance, and operational resilience.',
      capabilities,
      customFAQs,
      whyKangqore: service.whyKangqore,
      whyKangqoreIntro,
      industries,
      trustPillarsVideo: '/videos/working-machine-4751312.mp4',
      preWhyKangqoreSections: operationsCoESection,
      postFAQSections: executionEcosystemSection
    },
    department
  };

  return (
    <React.Fragment>
      <ServicePageTemplate 
        service={pageData.service} 
        department={department} 
        primaryButton={service.primaryButton}
        secondaryButton={service.secondaryButton}
      />
    </React.Fragment>
  );
};

export default ManagedServices;
