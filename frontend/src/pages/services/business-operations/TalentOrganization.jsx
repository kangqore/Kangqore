import React, { useEffect } from 'react';
import { Users, Search, Layers, Activity, Zap, Heart, GraduationCap, BrainCircuit, Target, Building2, Globe, ShieldCheck, Briefcase, Network } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import { 
  TalentPhilosophyBackground,
  TalentWhySection,
  TalentProofOutcomes,
  TalentReadinessMagnet,
  TalentDiamondCoESection,
  TalentDeliveryModel,
  TalentExecutionEcosystem,
  TalentFutureReadySection
} from './components/TalentOrgCustomSections';

gsap.registerPlugin(ScrollTrigger);

const TalentOrganization = () => {
  useEffect(() => {
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/([\d.]+)/);
        if (match) {
          const targetNum = parseFloat(match[1]);
          const prefix = text.substring(0, match.index);
          const suffix = text.substring(match.index + match[0].length);
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
                    el.textContent = `${prefix}${formattedVal}${suffix}`;
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

  const service = {
    name: 'Talent & Organization',
    titleLine1: 'Talent &',
    titleHighlight: 'Organization.',
    slug: 'talent-organization',
    shortDescription: 'Engineer a workforce that executes faster than your competition.',
    description: 'We treat talent as a measurable system. We strip out bloated hierarchies, deploy AI to automate foundational HR operations, and hardwire capability frameworks to specific business outcomes. We don’t run trust falls — we engineer workforce velocity.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=format&fit=crop&w=1260&q=80',
    videoBackground: '/videos/engineering-rd-bg.mp4',
    primaryButton: { text: 'Book a 30-Min Strategy Call', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    hideGenericMidPageCta: true,
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Business Operations', link: '/department/business-operations' },
      { label: 'Talent & Organization' }
    ],
    
    stats: [
      { value: '30-50%', label: 'Acceleration in Decision Speed', color: 'text-brand-blue' },
      { value: '40%↑', label: 'Retention Increase via Predictive Models', color: 'text-blue-400' },
      { value: 'DAY 1', label: 'AI Readiness for Your Workforce', color: 'text-cyan-400' },
      { value: '10x', label: 'Faster Execution on Capability Gaps', color: 'text-brand-blue' },
    ],

    ctaTitle: "Stop Managing Headcount. Start Engineering Performance.",
    ctaDescription: "Legacy talent models are the absolute bottleneck to enterprise scale. We hardwire AI literacy, zero-latency decision matrices, and iron-clad retention models into your operating structure.",
    ctaButtonText: "Get Your Workforce Transformation Blueprint",

    highFidelity: {
      narrative: {
        badge: "TALENT & ORGANIZATION :: WORKFORCE INTELLIGENCE",
        titleLine1: "Hardwiring",
        titleHighlight: "Execution",
        titleLine2: "at the Core.",
        description: "You cannot run a next-generation technology stack on a legacy organizational chart. The bottleneck isn't the software; it's the workforce’s inability to adopt, operate, and scale it.",
        bottleneckLabel: "The Organizational Bottleneck",
        bottleneckText: "Slow, layered decision matrices. Severe capability gaps in engineering and AI roles. Compliance-heavy HR preventing rapid talent deployment. The result isn't just friction—it's catastrophic loss of market share.",
        requirementLabel: "The Operational Mandate",
        requirementText: "We restructure teams, flatten decision authorities, and inject AI literacy at the systemic level. Your talent organization must shift from a cost center regulating compliance into a velocity engine driving enterprise ROI.",
        image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Workforce Readiness",
        statusValue: "AI-READY"
      },
      philosophy: {
        icon: <Users className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "",
        titleHighlight: "Systemic Accountability.",
        description: "We eradicate HR ambiguity. We deploy governed talent platforms that track real-time capability gaps, enforce leadership accountability, and compress time-to-productivity for new hires by 40%.",
        bgElement: <TalentPhilosophyBackground />,
        pills: ['AI-Powered Workforce', 'Skills Intelligence', 'Culture Engineering', 'Leadership Pipelines'],
        features: [
          { title: 'Talent Strategy & Workforce Planning', label: 'Talent Architecture', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Design a workforce aligned with future business models — not outdated assumptions. Identify critical roles, future skills, and workforce gaps before they impact growth.' },
          { title: 'AI-Powered Workforce Transformation', label: 'Intelligent HR', icon: <BrainCircuit className="w-5 h-5 text-gray-400" />, content: 'Integrate AI into hiring, talent management, and productivity systems. Move from manual HR operations to intelligent workforce ecosystems that scale with precision.' },
          { title: 'Leadership & Culture Transformation', label: 'Performance Culture', icon: <Target className="w-5 h-5 text-gray-400" />, content: 'Build leaders who drive accountability, innovation, and performance. Create a culture that doesn\'t resist change — but accelerates it.' },
          { title: 'HR & People Analytics', label: 'Decision Intelligence', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Turn workforce data into decision intelligence. Enable real-time insights for hiring, retention, performance, and planning — not annual reviews.' }
        ]
      },
      matrix: {
        engineId: 'ENGINE :: T&O_V5',
        title: 'Our Execution Framework.',
        subtext: 'A connected system for moving from reactive HR management to governed, scalable talent ecosystems that drive measurable business outcomes.',
        layers: [
          { title: 'Diagnose', id: 'TO_DIAG', icon: <Search />, desc: 'Deep analysis of your organization, workforce, culture, leadership pipeline readiness, and capability gaps.' },
          { title: 'Design', id: 'TO_DESIGN', icon: <Layers />, desc: 'Build future-ready structures, roles, strategies, target operating models, and capability frameworks.' },
          { title: 'Deploy', id: 'TO_DEPLOY', icon: <Zap />, desc: 'Execute transformation programs across teams — platforms, leadership programs, culture initiatives, analytics enablement.' },
          { title: 'Scale', id: 'TO_SCALE', icon: <Activity />, desc: 'Continuously optimize with data, AI, and feedback loops. Scale successful initiatives across the enterprise.' }
        ]
      },
      schematic: {
        titleLine1: 'Measurable',
        titleHighlight: 'Impact.',
        description: 'Your people should be your greatest driver of innovation. We deliver measurable organizational performance — not reports.',
        stats: [
          { label: 'Decision Speed', val: '30-50%↑' },
          { label: 'Retention', val: '40%↑' },
          { label: 'AI Readiness', val: 'DAY 1' }
        ]
      }
    },

    trustStrip: "Restructuring enterprise talent models to enforce operational velocity, deploy AI at scale, and reduce systemic friction across 50,000+ seat organizations.",
    
    whyKangqore: [
      { title: 'Execution-First Talent Models', description: 'We don\'t do theory. We instrument capability frameworks that directly tie workforce output to P&L performance, eliminating consultative fluff.', icon: Target },
      { title: 'Platform-Driven Readiness', description: 'We deploy AI to automate base-level HR operations and use predictive attrition models to secure your most critical engineering and leadership nodes.', icon: BrainCircuit },
      { title: 'Culture as a Governed System', description: 'Culture isn\'t an aspiration; it\'s an operating system constraint. We use hard data and organizational network analysis (ONA) to measure, govern, and enforce performance behaviors.', icon: Users }
    ],

    useCases: [
      { name: 'Banking & Financial Services', description: 'Regulatory-aware talent strategy, compliance culture, risk-conscious leadership development, and AI-powered workforce planning for regulated environments.', icon: Building2 },
      { name: 'Technology & SaaS', description: 'Engineering talent retention, skills-based organizations, GenAI upskilling at scale, and innovation-driving culture design for high-velocity teams.', icon: BrainCircuit },
      { name: 'Healthcare & Life Sciences', description: 'Clinical workforce planning, compassion-centered culture, specialized talent pipelines, and compliance-grade people analytics.', icon: Heart },
      { name: 'Manufacturing & Industrial', description: 'Frontline workforce transformation, safety culture engineering, multi-generational talent integration, and Industry 4.0 skills acceleration.', icon: Target },
      { name: 'Retail & E-commerce', description: 'High-volume talent acquisition, seasonal workforce optimization, customer-centric culture design, and omnichannel employee experience.', icon: Briefcase },
      { name: 'Professional Services', description: 'Knowledge worker retention, partnership-track leadership, client-centric organizational design, and AI-augmented service delivery models.', icon: Globe }
    ],

    preMatrixSection: <TalentWhySection />,
    customSections: null,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <TalentDiamondCoESection />
        <TalentProofOutcomes />
        <TalentReadinessMagnet />
        <TalentDeliveryModel />
        <TalentFutureReadySection />
      </div>
    ),
    
    postFAQSections: (
      <div className="flex flex-col w-full">
        <TalentExecutionEcosystem />
      </div>
    ),

    customFAQs: [
      {
        question: 'How does Kangqore differ from traditional HR consulting firms?',
        answer: 'Traditional HR consulting sells "advisory" — bloated slide decks on organizational theory and change management. We operate as execution partners. We treat talent infrastructures as engineering systems: tracking capability gaps, automating HR processes with AI, and instrumenting performance metrics that tie directly to business outcomes.'
      },
      {
        question: 'What does "culture as an operating system" actually mean?',
        answer: 'It means moving culture out of the hands of HR marketing and into data governance. We use Organizational Network Analysis (ONA) and sentiment analytics to quantitatively measure bottlenecks, silos, and friction points, then deploy systems to enforce operational velocity.'
      },
      {
        question: 'How do you integrate AI into workforce transformation?',
        answer: 'We deploy AI to crush HR overhead. This means integrating agentic AI to handle employee inquiries, GenAI for automated skill gap assessments, and predictive models to flag high-risk attrition in critical engineering pipelines before they impact delivery targets.'
      },
      {
        question: 'How do you approach leadership development differently?',
        answer: 'We abandon theoretical seminars for high-stakes capability simulation. We build leadership capacity by throwing managers into structured scenario models, utilizing real-time performance analytics to ensure leaders are production-capable, not just certified.'
      },
      {
        question: 'Can you help with workforce planning for rapid growth or restructuring?',
        answer: 'Yes. We use data-driven workforce planning models that align talent supply with business demand — including scenario modeling, capability gap analysis, AI-powered demand forecasting, succession planning, and organizational redesign for scale. Whether you\'re scaling from 50 to 500 or restructuring a 10,000-person org, our frameworks adapt.'
      },
      {
        question: 'How do you measure the success of talent transformation?',
        answer: 'Through quantifiable metrics: 30–50% faster decision-making cycles, engagement scores, attrition rate reduction, leadership pipeline readiness, capability gap closure rates, time-to-productivity improvements, internal mobility rates, and culture health indicators — all tracked through integrated analytics dashboards with real-time visibility.'
      }
    ]
  };

  const department = {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Transform your business with cutting-edge business operations solutions.',
    icon: <Users className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Talent Strategy & Workforce Planning',
      description: 'Design a workforce aligned with future business models — not outdated assumptions. We help you identify critical roles, future skills, and workforce gaps before they impact growth. Data-driven workforce analytics, scenario modeling, and capability gap identification across the enterprise.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Strategic workforce planning and analytics',
        'Capability gap identification and closure',
        'Talent supply chain design',
        'Scenario modeling and demand forecasting'
      ],
      micro: 'Optimizing capability deployment timelines.'
    },
    {
      title: 'AI-Powered Workforce Transformation',
      description: 'Integrate AI into hiring, talent management, and productivity systems. Move from manual HR operations to intelligent workforce ecosystems. GenAI-powered screening, predictive attrition modeling, and agentic AI for HR automation — deployed at enterprise scale.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-powered sourcing and intelligent screening',
        'Predictive attrition and retention models',
        'GenAI skill assessment and upskilling pathways',
        'Agentic AI for HR operations automation'
      ],
      micro: 'Deploying agentic AI across HR operations.'
    },
    {
      title: 'Leadership Pipeline Development',
      description: 'Build leadership bench strength with structured succession planning, high-potential identification, and development pathways. We create leaders at every level — from first-time managers to C-suite successors — with evidence-based coaching, not one-off seminars.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Succession planning and readiness assessment',
        'High-potential identification and acceleration',
        'Executive coaching and development',
        'Leadership competency frameworks'
      ],
      micro: 'Engineering production-ready leadership.'
    },
    {
      title: 'Learning Ecosystem Transformation',
      description: 'Replace fragmented, low-adoption training modules with unified, AI-powered learning ecosystems. We hardwire upskilling into daily workflows, mapping directly to imminent capability gaps and compressing time-to-value.',
      bgImage: '/images/capabilities/education.png',
      items: [
        'Learning platform strategy and implementation',
        'AI-powered content curation and personalization',
        'Skills-based learning pathway design',
        'Knowledge management and institutional memory'
      ],
      micro: 'Accelerating Time-to-Productivity (TTP).'
    },
    {
      title: 'Organizational Design & Architecture',
      description: 'Restructure teams, roles, and workflows for speed, clarity, and scalability. Eliminate inefficiencies and create systems that enable faster execution. Flatter, faster organizations that respond to market shifts without losing governance, accountability, or cultural integrity.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Target operating model design',
        'Agile organization structures',
        'Shared services and CoE models',
        'Decision authority and governance design'
      ],
      micro: 'Structure drives performance.'
    },
    {
      title: 'Culture Intelligence & Activation',
      description: 'Design and embed organizational culture as a measurable, governable system using sentiment analytics, behavioral frameworks, organizational network analysis, and evidence-based change methodology. Culture is designed, not accidental.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Culture assessment and measurement',
        'Sentiment analytics and pulse surveys',
        'Behavioral design and nudge architecture',
        'DEI strategy and integration'
      ],
      micro: 'Culture is the operating system of performance.'
    },
    {
      title: 'HR & People Analytics',
      description: 'Turn workforce data into decision intelligence. Enable real-time insights for hiring, retention, performance, and planning. We build analytics infrastructure that transforms HR from a cost center into an innovation engine — with dashboards, not decks.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'People analytics platform strategy',
        'Predictive workforce modeling',
        'Real-time engagement and retention analytics',
        'Organizational network analysis (ONA)'
      ],
      micro: 'Data-driven decisions, not gut feelings.'
    },
    {
      title: 'Change Management & Transformation Execution',
      description: 'Ensure transformation is adopted, sustained, and scaled across the organization. We don\'t just design change — we make it work. Structured adoption frameworks, stakeholder alignment, and continuous feedback loops that turn strategy into execution.',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Change readiness assessment and planning',
        'Stakeholder alignment and communication',
        'Adoption measurement and optimization',
        'Transformation governance and scaling'
      ],
      micro: 'Not consulting. Transformation.'
    }
  ];

  const technologies = [
    { category: 'HCM & Talent Platforms', items: ['Workday', 'SAP SuccessFactors', 'Oracle HCM', 'ADP', 'BambooHR', 'Darwinbox'] },
    { category: 'Learning & Development', items: ['Cornerstone', 'Degreed', 'Coursera for Business', 'LinkedIn Learning', 'EdCast', 'Docebo'] },
    { category: 'People Analytics', items: ['Visier', 'One Model', 'Crunchr', 'Orgvue', 'Power BI', 'Tableau'] },
    { category: 'Engagement & Culture', items: ['Glint', 'Culture Amp', 'Lattice', 'Peakon', '15Five', 'Medallia'] },
    { category: 'Workforce Planning', items: ['Anaplan', 'Planful', 'Workday Adaptive', 'eQ8', 'Faethm', 'SkyHive'] },
    { category: 'AI & Automation', items: ['Microsoft Copilot', 'OpenAI', 'Eightfold AI', 'Phenom', 'HiredScore', 'Pymetrics'] },
    { category: 'Collaboration & Productivity', items: ['Microsoft Viva', 'Slack', 'Notion', 'Miro', 'Confluence', 'Teams'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Eight concrete execution streams that take your organization from reactive HR management to a governed, scalable talent engine. These are not advisory recommendations — they are services we deliver and are accountable for.',
      capabilities,
      trustPillars: [
        { title: 'Science-backed talent interventions', tag: 'People Science', description: 'Every recommendation is grounded in behavioral science, organizational psychology, and workforce analytics — not generic best practices.' },
        { title: 'AI-native at every layer', tag: 'AI-Powered', description: 'From GenAI-powered screening to predictive attrition and agentic HR automation — technology amplifies every talent initiative.' },
        { title: 'Culture as measurable infrastructure', tag: 'Culture', description: 'We treat culture as a governed, measured system — not an abstract aspiration. Sentiment analytics, behavioral design, and ONA make culture tangible.' },
        { title: 'Leadership pipeline accountability', tag: 'Leadership', description: 'Systematic leadership development from first-time managers to C-suite succession — with structured pathways, not one-off seminars.' },
        { title: 'Data-driven workforce decisions', tag: 'Analytics', description: 'Real-time people analytics, predictive modeling, and decision intelligence that transforms HR from cost center to competitive advantage.' },
        { title: 'Transformation execution discipline', tag: 'Change', description: 'We don\'t just design change — we deploy, measure, and scale it across the enterprise with governed adoption frameworks.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return (
    <div className="talent-org-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default TalentOrganization;
