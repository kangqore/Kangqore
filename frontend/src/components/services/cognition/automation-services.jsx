// ─── Cognition — Automation Services (lifted from legacy /pages/services/automation/) ─
// Per the RESET DIRECTION (2026-05-18): these 4 services had rich bespoke content in
// the legacy 15-dept "automation" folder. The G1 audit misclassified them as T4
// (skeleton) because they have no separate *CustomSections.jsx file — but their
// content is rich, just INLINE within the legacy page file.
//
// This file lifts that content verbatim into PREMIUM_REGISTRY-compatible entries
// under the new canonical 6-dept Cognition module. The 4 services:
//   - intelligent-automation
//   - digital-process-automation
//   - robotic-process-automation
//   - business-process-management
//
// Locked rules applied:
//   - No content fabrication; content lifted verbatim from legacy pages
//   - Hardcoded legacy URLs in inline JSX rewritten to canonical /services/<slug>
//   - Canonical 6-dept identity wins (departmentSlug stays 'cognition' via servicesData)
//   - Legacy titleLine1/titleHighlight wins for hero visual treatment
//   - Stateful sections (BPM accordion + tab selector) extracted as wrapper
//     components below so hooks work inside registry-object JSX expressions
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, BarChart3, Bot, BrainCircuit, Building2, CheckCircle2, Cpu,
  Database, Factory, Globe, Heart, Layers, LineChart, Lock, Search, Settings,
  Shield, ShieldCheck, ShoppingCart, Target, TrendingUp, Users, Workflow, Zap,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// STATEFUL WRAPPER COMPONENTS for BPM (extracted because hooks can't be used
// inside plain JSX expressions in a registry-object).
// ═══════════════════════════════════════════════════════════════════════════════

const BPMProcessRedesignSection = () => {
  const [openStep, setOpenStep] = React.useState(null);

  const processSteps = [
    {
      title: 'Process Discovery & Strategy: Uncovering What’s Working—and What’s Not',
      content: 'We begin with a thorough assessment of your current processes, systems, and teams. Through stakeholder interviews, process mining, and data analysis, we identify bottlenecks, redundancies, and high-impact automation opportunities — building a clear picture of where you are and where you need to go.'
    },
    {
      title: 'Process Mapping & Design: Turning Complexity into Clarity',
      content: 'Using 3-level process modeling, we map your operations from strategic overview to task-level detail. We design optimized workflows that eliminate waste, reduce handoffs, and embed automation and governance checkpoints — creating a clear blueprint for execution.'
    },
    {
      title: 'Process Engineering & System Architecture: Building the Backbone of Scalable Execution',
      content: 'We architect the technology layer that powers your redesigned processes — integrating BPM platforms, RPA, AI, and analytics into a cohesive system. Every component is designed for scalability, resilience, and seamless integration with your existing enterprise stack.'
    },
    {
      title: 'Process Validation & Governance Setup: Ensuring Quality, Compliance & Performance',
      content: 'Before go-live, we validate every process against quality benchmarks, compliance requirements, and performance KPIs. We establish governance frameworks including three lines of defense, audit trails, and role-based access controls for sustained operational trust.'
    },
    {
      title: 'Continuous Optimization & Transformation Support: Scaling for Growth, Efficiency & Innovation',
      content: 'Post-deployment, we provide ongoing monitoring, analytics-driven optimization, and change management support. Our teams continuously identify improvement opportunities, scale automation across new functions, and ensure your processes evolve with your business.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              How We Help Redesign Your Business Process for <span className="text-transparent bg-clip-text bg-brand-gradient italic">Peak Performance</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full"></div>
          </div>
          <div className="lg:w-1/2 flex items-end">
            <p className="text-lg text-gray-500 leading-relaxed">
              Whether you&rsquo;re starting from scratch or need to optimize what exists, we provide a blueprint for success. The result you get are two: <strong className="text-gray-900 dark:text-white">1) End to operational ambiguity</strong> and <strong className="text-gray-900 dark:text-white">2) Measurable efficiency.</strong>
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-2xl transition-all duration-300 overflow-hidden ${openStep === idx ? 'border-gray-300 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <button
                onClick={() => setOpenStep(openStep === idx ? null : idx)}
                className="w-full flex items-center gap-5 p-5 lg:p-6 text-left"
              >
                <span className="shrink-0 w-14 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center text-xs font-bold text-gray-500 tracking-wide">
                  Step {idx + 1}
                </span>
                <span className="flex-1 text-base lg:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-snug">
                  {step.title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-gray-400 shrink-0 transition-transform duration-300 ${openStep === idx ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className={`transition-all duration-300 ${openStep === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-5 lg:px-6 pb-6 pl-24">
                  <p className="text-gray-500 leading-relaxed">{step.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BPMPreferenceSection = () => {
  const [activePreference, setActivePreference] = React.useState(0);

  const preferences = [
    {
      label: 'From Scratch Process Development',
      icon: <Workflow className="w-5 h-5" />,
      scenario: 'From Scratch Process Development',
      steps: [
        'Conduct discovery workshops to understand business goals and operational gaps.',
        'Identify core functions needing structured workflows.',
        'Design and map end-to-end business processes.',
        'Build automation-ready process architecture.',
        'Implement governance, compliance, and quality checkpoints.',
        'Deploy and stabilize with change management support.'
      ]
    },
    {
      label: 'Update of Existing Business Process',
      icon: <Settings className="w-5 h-5" />,
      scenario: 'Update of Existing Business Process',
      steps: [
        'Review existing processes and documentation.',
        'Conduct gap analysis to identify inefficiencies and pain points.',
        'Redesign workflows for agility, scalability, and automation.',
        'Integrate RPA and AI to eliminate manual bottlenecks.',
        'Validate updated processes against compliance benchmarks.',
        'Roll out with training and continuous improvement cadence.'
      ]
    },
    {
      label: 'Audit of Existing Business Process',
      icon: <Search className="w-5 h-5" />,
      scenario: 'Audit of Existing Business Process',
      steps: [
        'Perform a full audit of current workflows, roles, and tools.',
        'Benchmark processes against industry standards.',
        'Identify risks, redundancies, and improvement opportunities.',
        'Deliver a prioritized recommendations report.',
        'Provide automation readiness scores for each process.',
        'Define a transformation roadmap with quick wins and long-term initiatives.'
      ]
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Choose Your Preference of <span className="text-transparent bg-clip-text bg-brand-gradient italic">BPM Service</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full"></div>
          </div>
          <div className="lg:w-1/2 flex items-end">
            <p className="text-lg text-gray-500 leading-relaxed">
              We help enterprise businesses at any stage of the process journey. If you have no defined processes, we build them from the ground up. If your processes exist but feel outdated, we will update and streamline them. And if you just want to improve, we audit what you have and show you exactly where to fix it.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
          {preferences.map((pref, idx) => (
            <button
              key={idx}
              onClick={() => setActivePreference(idx)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 border ${
                activePreference === idx
                  ? 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-900 text-gray-900 dark:text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className={`${activePreference === idx ? 'text-brand-blue' : 'text-gray-400'}`}>
                {pref.icon}
              </span>
              {pref.label}
            </button>
          ))}
        </div>
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/5">
              <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3 block">Scenario</span>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
                {preferences[activePreference].scenario}
              </h3>
            </div>
            <div className="lg:w-3/5">
              <span className="text-xs font-bold text-brand-blue tracking-[0.2em] uppercase mb-6 block">Our Step-by-Step Approach</span>
              <div className="space-y-5">
                {preferences[activePreference].steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-4">
                    <div className="shrink-0 w-7 h-7 bg-brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {sIdx + 1}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[16px]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE ENTRIES — placeholder; filled in by subsequent edits
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. intelligent-automation ────────────────────────────────────────────────
const intelligentAutomation = {
  titleLine1: 'Intelligent',
  titleHighlight: 'Automation',
  description: 'AI-led automation that turns operations into a real-time, self-improving system.',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">AI-led automation that turns operations into a real-time, self-improving system.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Kangqore helps enterprises automate end-to-end workflows by combining RPA, API-led integration, process orchestration, and GenAI—so decisions are faster, operations are cleaner, and outcomes are measurable.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Automate', label: 'End-to-end workflows', color: 'text-blue-500' },
    { value: 'Integrate', label: 'Systems & data', color: 'text-brand-blue' },
    { value: 'Embed', label: 'AI-driven decisions', color: 'text-indigo-500' },
    { value: 'Scale', label: 'With governance', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'INTELLIGENT AUTOMATION :: 2026',
      titleLine1: 'Real-time Insights.',
      titleHighlight: 'Automated',
      titleLine2: 'Execution.',
      description: 'Break data silos and manual dependencies by connecting applications, workflows, and teams. We enable intelligent automation across business and IT operations—integrating data, orchestrating processes, and embedding AI where decisions happen.',
      bottleneckLabel: 'The Challenge',
      bottleneckText: 'Disconnected systems, manual handoffs, decision bottlenecks, and lack of real-time visibility into operations.',
      requirementLabel: 'Our Approach',
      requirementText: 'Connected systems and unified workflows. Faster decision-making with AI-assisted automation. Governance-first execution: secure, compliant, auditable.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      statusLabel: 'Automation Maturity',
      statusValue: 'Intelligent',
    },
    philosophy: {
      icon: <Zap className="w-7 h-7 text-brand-blue" />,
      title: 'Our',
      titleHighlight: 'Automation Framework.',
      description: 'At Kangqore, Intelligent Automation is structured across four integrated pillars—connecting data, embedding intelligence, scaling execution, and enabling teams.',
      pills: ['Connect', 'Decide', 'Execute', 'Enable'],
    },
    matrix: {
      engineId: 'Engine :: IA_Flow_V2',
      title: 'How We Deliver',
      subtext: 'A structured, outcomes-driven delivery model—from process assessment to enterprise-wide automation at scale.',
      layers: [
        { title: 'Discover', id: 'IA_DISC', icon: <Search />, desc: 'Process assessment + automation pipeline + ROI model. Identify the highest-impact workflows and build a clear automation roadmap.' },
        { title: 'Design', id: 'IA_DES', icon: <Layers />, desc: 'Target workflows + system integrations + controls. Architect the automation solution with security, compliance, and scalability built in.' },
        { title: 'Deploy', id: 'IA_DEP', icon: <Zap />, desc: 'Build bots and workflows + testing + rollout. Execute the automation blueprint with structured QA, UAT, and change management.' },
        { title: 'Scale', id: 'IA_SCALE', icon: <TrendingUp />, desc: 'CoE governance + monitoring + continuous optimization. Expand automation across functions with KPI dashboards and improvement cadence.' },
      ],
    },
    schematic: {
      titleLine1: 'Synthesize',
      titleHighlight: 'Operations.',
      description: 'Design ecosystems where humans and digital workers collaborate seamlessly—tied to KPIs, ROI, and measurable business outcomes.',
      stats: [
        { label: 'Decisions', val: 'AI-DRIVEN' },
        { label: 'Workflows', val: 'ORCHESTRATED' },
        { label: 'Outcomes', val: 'MEASURABLE' },
      ],
    },
  },

  capabilitiesDescription: 'Kangqore helps enterprises integrate systems, orchestrate processes, and embed AI-driven intelligence across operations. From API-led integration and BPM to RPA, IDP, and cognitive services—we unlock efficiency, speed, and measurable business outcomes.',
  capabilities: [
    {
      title: 'Digital Integration',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Build a connected enterprise with API-led integration, iPaaS modernization, and secure EDI/B2B enablement—designed to scale reliably across teams and ecosystems.',
      items: [
        'API-led connectivity & microservices orchestration',
        'iPaaS platform modernization & migration',
        'EDI/B2B integration & partner onboarding',
        'Real-time data synchronization across systems',
        'Legacy system connectivity & modernization',
        'Event-driven architecture & streaming pipelines',
        'Secure gateway & protocol management',
      ],
    },
    {
      title: 'Business Process Management (BPM)',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Modernize process orchestration with BPM-led operating models, process mining, real-time decisioning, and governance—improving customer experience, agility, and operational control.',
      items: [
        'Process & task mining (data-driven discovery)',
        'End-to-end process mapping & optimization',
        'BPM platform implementation & customization',
        'Real-time decisioning & dynamic routing',
        'Compliance & governance framework setup',
        'Process analytics & continuous improvement',
        'Customer journey orchestration',
      ],
    },
    {
      title: 'Next-Gen RPA & Document Processing',
      bgImage: '/images/capabilities/automation-rpa.png',
      description: 'Deploy enterprise-grade automation with a structured RPA CoE and Intelligent Document Processing—covering discovery to scale, with measurable productivity gains across operations.',
      items: [
        'Automation discovery & opportunity assessment',
        'Attended & unattended bot development',
        'Intelligent Document Processing (IDP)',
        'Invoice, contract & KYC automation',
        'RPA Center of Excellence (CoE) setup',
        'Bot monitoring, analytics & optimization',
        'Enterprise-wide scale & governance',
      ],
    },
    {
      title: 'AI & Cognitive Services',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Embed intelligence into operations with GenAI, NLP, computer vision, and decision engines—enabling workflows that learn, adapt, and self-improve with every cycle.',
      items: [
        'GenAI for operations (assist + automate)',
        'NLP & conversational AI deployment',
        'Computer vision & image processing',
        'Decision intelligence & recommendation engines',
        'Predictive analytics & anomaly detection',
        'AI model governance & responsible AI',
        'LLM integration & prompt engineering',
      ],
    },
  ],

  trustPillars: [
    {
      title: 'Data-Driven Discovery',
      tag: 'Process Mining',
      description: 'We don’t rely on workshops and assumptions. Process mining, task mining, and operational data drive every automation decision—so you automate what actually matters, not what looks easy.',
    },
    {
      title: 'Human-in-the-Loop Design',
      tag: 'Collaborative',
      description: 'Automation doesn’t replace your teams—it amplifies them. We design attended bots, AI copilots, and exception-handling workflows that keep human judgment where it counts.',
    },
    {
      title: 'Change Management Built In',
      tag: 'Adopted',
      description: 'Technology deployed without adoption is shelfware. Every engagement includes stakeholder alignment, training programs, and citizen developer enablement—so automation sticks.',
    },
    {
      title: 'Continuous Optimization Engine',
      tag: 'Evolving',
      description: 'Post-deployment, we don’t walk away. KPI dashboards, bot health monitoring, and quarterly improvement sprints ensure your automation program compounds value over time.',
    },
  ],
  trustPillarsRightTitle: 'Our Automation Philosophy',
  trustPillarsRightDescription: 'Kangqore builds automation that is governed, measurable, and self-improving—connecting systems, embedding intelligence, and scaling execution across the enterprise.',
  trustPillarsRightButton: 'Request Assessment',

  technologiesTitle: 'Tools & Technologies',
  technologiesDescription: 'Platform-agnostic implementation. Works with your stack—across RPA, BPM, AI, iPaaS, and cloud infrastructure.',
  technologies: [
    { category: 'Automation & RPA', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion', 'NICE'] },
    { category: 'BPM & Orchestration', items: ['ServiceNow', 'Appian', 'Pega', 'Camunda', 'Nintex', 'Bizagi'] },
    { category: 'Process Mining', items: ['Celonis', 'Microsoft Process Advisor', 'UiPath Process Mining', 'Minit', 'Signavio'] },
    { category: 'AI & GenAI', items: ['OpenAI', 'Azure OpenAI', 'Google Vertex AI', 'AWS Bedrock', 'Azure AI'] },
    { category: 'IDP & Document AI', items: ['ABBYY', 'Kofax', 'Hyperscience', 'Google Document AI', 'Azure Form Recognizer'] },
    { category: 'Integration & iPaaS', items: ['MuleSoft', 'Dell Boomi', 'Workato', 'SnapLogic', 'Apache Kafka', 'Talend'] },
  ],

  whyKangqoreIntro: 'Kangqore delivers intelligent automation that connects systems, embeds AI, and scales with governance—turning fragmented operations into a unified, self-improving execution engine.',
  whyKangqore: [
    { title: 'Full-Stack Automation Delivery', description: 'Integration, BPM, RPA, IDP, and AI delivered as one unified program—not siloed tools. We own the full lifecycle from discovery to production and beyond.' },
    { title: 'Platform-Agnostic, Vendor-Neutral', description: 'UiPath, Automation Anywhere, ServiceNow, Appian, MuleSoft—we select the right tools for your environment and integrate them into one cohesive automation layer.' },
    { title: 'Weeks to Production, Not Months', description: 'Our structured pilot methodology proves ROI in 4–6 weeks. We validate fast, iterate quickly, and scale with confidence once value is demonstrated.' },
    { title: 'CoE-Ready from Day One', description: 'We don’t just build bots—we establish Automation Centers of Excellence with operating models, governance frameworks, and compliance protocols for sustained value.' },
    { title: 'AI-Native, Not AI-Bolted', description: 'GenAI, NLP, and decision engines are embedded into workflows at the design phase—not added later. This creates operations that learn and self-improve with every cycle.' },
  ],

  industryTitle: 'Industry Solutions Built for Scale.',
  industries: [
    { name: 'Banking & Financial Services' },
    { name: 'Insurance' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Supply Chain' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology & Telecom' },
  ],

  customFAQs: [
    {
      question: 'What is Intelligent Automation and how is it different from RPA?',
      answer: 'Intelligent Automation combines RPA with AI, machine learning, process orchestration, and API-led integration to automate end-to-end workflows—not just individual tasks. While RPA handles repetitive rule-based work, IA adds intelligence: document understanding, decision-making, predictive analytics, and self-improving processes.',
    },
    {
      question: 'Which processes should we automate first?',
      answer: 'We start with a structured discovery phase that maps your processes against automation readiness, business impact, and complexity. High-volume, rule-based processes with clear inputs/outputs are ideal early candidates. Our ROI model helps prioritize the automation pipeline by expected value.',
    },
    {
      question: 'How do you ensure security, compliance, and audit readiness?',
      answer: 'Every automation is built with governance from day one—role-based access controls, encrypted data handling, full audit trails, and compliance checkpoints. Our three-lines-of-defense model embeds risk ownership, oversight, and assurance into the operating model.',
    },
    {
      question: 'How long does a pilot take and what does "scale" mean?',
      answer: 'A focused pilot typically takes 4–6 weeks from discovery to production. "Scale" means expanding automation across functions, geographies, and use cases—supported by a CoE, governance model, monitoring dashboards, and continuous optimization cadence.',
    },
    {
      question: 'Can this integrate with our ERP/CRM and legacy tools?',
      answer: 'Yes. Our API-led integration and iPaaS capabilities connect modern and legacy systems—SAP, Oracle, Salesforce, Workday, and custom applications—into unified automated workflows without requiring full system replacement.',
    },
    {
      question: 'Do you set up an Automation CoE and governance model?',
      answer: 'Absolutely. We establish dedicated Automation Centers of Excellence with operating models, KPI frameworks, compliance protocols, citizen developer guardrails, and training programs—ensuring automation is sustained, scalable, and continuously optimized.',
    },
  ],

  preWhyKangqoreSections: (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {[
            { label: '60%', sub: 'Avg. cycle time reduction' },
            { label: '4–6 Weeks', sub: 'Pilot to production' },
            { label: '40%', sub: 'Manual effort eliminated' },
            { label: '99.5%', sub: 'Bot uptime SLA' },
            { label: '15+', sub: 'Industries served' },
            { label: '3x', sub: 'Faster decision cycles' },
          ].map((metric, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-lg lg:text-xl font-bold text-white tracking-tight mb-1 group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors">
                {metric.label}
              </div>
              <div className="text-xs text-white/50 font-medium tracking-wide uppercase">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),

  postFAQSections: (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:w-2/3 mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
            Kangqore offers a range of services designed to aid and accelerate your automation and digital transformation journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { name: 'Cloud Computing', link: '/services/cloud-computing', icon: <Globe className="w-5 h-5" />, desc: 'Migrate and modernize infrastructure to cloud-native architectures that support scalable automation workloads.' },
            { name: 'Big Data & Analytics', link: '/services/big-data', icon: <Database className="w-5 h-5" />, desc: 'Build the data pipelines and analytics layer that feeds AI-driven automation with clean, real-time data.' },
            { name: 'IT Security Services', link: '/services/it-security-services', icon: <Shield className="w-5 h-5" />, desc: 'Secure automated workflows with identity management, threat detection, and regulatory compliance frameworks.' },
            { name: 'GenAI Business Services', link: '/services/genai-business-services', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Embed generative AI and large language models into enterprise workflows for intelligent assist and automation.' },
            { name: 'Digital Business Transformation', link: '/services/digital-business-transformation', icon: <TrendingUp className="w-5 h-5" />, desc: 'Align automation initiatives with enterprise strategy, operating model redesign, and organizational change management.' },
            { name: 'Quality Engineering & Assurance', link: '/services/quality-engineering-assurance', icon: <Target className="w-5 h-5" />, desc: 'Validate automated workflows with structured QA, regression testing, and continuous testing frameworks.' },
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
      </div>
    </section>
  ),
};

// ─── 2. digital-process-automation ────────────────────────────────────────────

// (a) Technical Schematic + Related Automation Offerings (postFAQSections)
const dpaRelatedSchematic = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Execution Ecosystem
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related Automation <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Scale your automation journey by integrating process orchestration with our broader portfolio of data, AI, and cloud services.
          </p>
          <div className="space-y-4">
            {[
              { name: 'AI & Cognitive Computing', link: '/services/ai-cognitive-computing', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Infuse intelligence into every enterprise workflow.' },
              { name: 'Robotic Process Automation', link: '/services/robotic-process-automation', icon: <Bot className="w-5 h-5" />, desc: 'Eliminate manual friction at massive scale.' },
              { name: 'Big Data Engineering', link: '/services/big-data', icon: <Layers className="w-5 h-5" />, desc: 'Architect the data pipelines that power automation.' },
              { name: 'GenAI & Agentic AI', link: '/services/genai-business-services', icon: <Target className="w-5 h-5" />, desc: 'Deploy autonomous agents for complex decisioning.' },
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
              // ORCHESTRATING_ECOSYSTEM...
            </div>
          </div>
        </div>

        <div className="lg:w-5/12 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]"
                 style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
              <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_DPA_EXEC</span></div>
              <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ENTERPRISE</span></div>
              <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">ORCHESTRATED</span></div>
            </div>
            <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
              <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Workflow Engine</div>
              <div>SYNTHESIZING_TASKS...</div>
              <div>EFFICIENCY: +94%</div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <div className="relative">
                <Workflow className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                  <Layers className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                </div>
                <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Systems</span>
              </div>
            </div>
            <div className="absolute bottom-20 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">KPI</div>
                </div>
                <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Metrics</span>
              </div>
            </div>
            <div className="absolute bottom-20 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative">
                    <BrainCircuit className="w-16 h-16 text-emerald-400" />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Cognitive AI</span>
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="dpa-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,140" stroke="url(#dpa-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L140,380" stroke="url(#dpa-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L360,380" stroke="url(#dpa-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <g><circle r="4" fill="#2564ea" /><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></g>
              <g><circle r="4" fill="#22d3ee" /><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></g>
              <g><circle r="4" fill="#10b981" /><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// (b) Automation CoE Section (diamond diagram + key differentiators) — preWhyKangqoreSections
const dpaAutomationCoESection = (
  <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
          <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
            <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
              Kangqore&rsquo;s Digital Process Automation Center of Excellence (CoE) is built on four interconnected capability layers — <strong className="text-brand-blue">Automation Consulting</strong>, <strong className="text-brand-blue">Process Automation</strong>, <strong className="text-brand-blue">Digital Automation</strong>, and <strong className="text-brand-blue">Cognitive Automation</strong> — forming a unified automation architecture.
            </p>
            <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              From strategic advisory and process discovery to intelligent orchestration, low-code modernization, and AI-driven decision systems, we deliver end-to-end automation that transforms how work flows across the enterprise. Our model enhances efficiency, enables personalization, strengthens omnichannel engagement, and embeds data-driven intelligence into core operations.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
            <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
              <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                </defs>
                <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
              </svg>

              <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                <div className="w-full h-full rounded-[20px] p-[3px]" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', animation: 'diamond-float-3d 6s ease-in-out infinite', filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))' }}>
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Consulting</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                      <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Digital</span>
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Process</span>
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Automation</span>
                      </div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                      <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.10), transparent)' }}></div>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Cognitive</span>
                        <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>Automation advisory and process excellence</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Automation Strategy</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Process Mining</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Center of Excellence</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Modernize legacy applications</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Extend ERP /mission critical system life</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Scale customer touch points</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Digitization of processes</span></li>
                </ul>
              </div>
              <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center justify-end gap-3 text-right"><span>Robotic Process Automation</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Workflow Automation/Orchestration</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>End to end Business process Automation</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>Automation Monitoring</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                  <li className="flex items-center justify-end gap-3 text-right"><span>IT Automation</span><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div></li>
                </ul>
              </div>
              <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Conversational Bots</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Intelligent Process Automation</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Intelligent Document Processing</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Automated Risk Assessment</span></li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div><span>Infrastructure Automation</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { title: 'Automation Consulting', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['Automation advisory & process excellence', 'Automation Strategy', 'Process Mining', 'Center of Excellence'] },
              { title: 'Digital Automation', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['Modernize legacy applications', 'Extend ERP / mission critical system life', 'Scale customer touch points', 'Digitization of processes'] },
              { title: 'Process Automation', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['Robotic Process Automation', 'Workflow Automation/Orchestration', 'End to end Business process Automation', 'Automation Monitoring', 'IT Automation'] },
              { title: 'Cognitive Automation', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Conversational Bots', 'Intelligent Process Automation', 'Intelligent Document Processing', 'Automated Risk Assessment', 'Infrastructure Automation'] },
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

      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            { num: 1, title: 'Domain Expertise in Focus Verticals', text: 'Healthcare, Manufacturing, CPG/Retail, BFSI, etc. — provides a vital edge in process re-engineering and optimization consulting, which is an integral part of any successful enterprise automation initiative.' },
            { num: 2, title: 'Leverage of Digital Capital', text: 'Driven by standardization of tools and technology processes, enabling reusable methodologies, accelerators, and frameworks to assist our clients in achieving their objectives faster.' },
            { num: 3, title: 'Focus on Bridging Process & Application Gaps', text: 'Rather than just focusing on improving and bridging gaps in processes, we focus on identifying application gaps leveraging low-code/no-code platforms to improve the overall business process efficiency and posture to create an ecosystem of well-orchestrated human and digital workers.' },
            { num: 4, title: 'Cognitive Automation Focus', text: 'Improve automated capture of data, automated decision-making, and scale automation. Leverage of Gen AI as part of cognitive automation brings other extended capabilities such as Human-in-the-Loop, language understanding, image recognition, interpreting meaning in text and images, translation, and decision-making.' },
            { num: 5, title: 'People-Centric Value Delivery', text: "Our philosophy of 'Engineering the future with accountability' enables us to adopt a people-centric approach to bring value to our customers." },
          ].map((diff) => (
            <div key={diff.num} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
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

const digitalProcessAutomation = {
  titleLine1: 'Digital Process',
  titleHighlight: 'Automation',
  description: 'Automate intelligently. Orchestrate seamlessly. Scale sustainably.',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Reimagine how work flows across your enterprise.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Digital Process Automation at Kangqore enables organizations to eliminate manual friction, streamline operations, and build intelligent workflows that combine humans, bots, and AI systems into a unified execution engine.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Optimize', label: 'Business processes', color: 'text-blue-500' },
    { value: 'Reduce', label: 'Manual intervention', color: 'text-brand-blue' },
    { value: 'Increase', label: 'Operational efficiency', color: 'text-indigo-500' },
    { value: 'Improve', label: 'Compliance & governance', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'AUTOMATION STRATEGY :: 2026',
      titleLine1: 'Orchestrate',
      titleHighlight: 'Workflows.',
      titleLine2: 'at High Velocity.',
      description: 'Digital Process Automation is no longer optional — it is foundational to operational excellence. We combine process automation, cognitive automation, and digital automation platforms to deliver measurable business outcomes. Typical outcomes include 20–60% cycle time reduction, 30–80% fewer manual touches, and audit-ready workflows with full traceability.',
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Siloed systems + email approvals + spreadsheet operations creating audit gaps and operational drag.',
      requirementLabel: 'The Requirement',
      requirementText: 'Unified workflow + bots + AI, governed via a Center of Excellence for enterprise-wide hyperautomation.',
      image: 'https://images.pexels.com/photos/8438980/pexels-photo-8438980.jpeg?auto=compress&cs=tinysrgb&w=1200',
      statusLabel: 'Automation Velocity',
      statusValue: 'Maximized',
    },
    philosophy: {
      icon: <Workflow className="w-7 h-7 text-brand-blue" />,
      title: 'Our',
      titleHighlight: 'Automation Framework.',
      description: 'At Kangqore, DPA is structured across four integrated layers to ensure scalability, adaptability, and continuous operational intelligence.',
      pills: ['Consulting', 'Process Automation', 'Digital Automation', 'Cognitive Automation'],
    },
    matrix: {
      engineId: 'Engine :: DPA_Flow_V1',
      title: '4-Layer Automation Architecture',
      subtext: 'We deconstruct the complexity of enterprise operations into manageable, automated execution layers.',
      layers: [
        { title: 'Consulting', id: 'DPA_C', icon: <Search />, desc: 'Discover + prioritize ROI use cases via readiness assessments, process mining, and CoE governance.' },
        { title: 'Process', id: 'DPA_P', icon: <Layers />, desc: 'Orchestrate workflows + RPA at scale with end-to-end business process automation and monitoring.' },
        { title: 'Digital', id: 'DPA_D', icon: <Zap />, desc: 'Low-code apps + modernization to bridge gaps — extending ERP, digitizing touchpoints, enabling omnichannel.' },
        { title: 'Cognitive', id: 'DPA_AI', icon: <BrainCircuit />, desc: 'IDP + conversational AI + decision automation powered by GenAI for intelligent, self-improving workflows.' },
      ],
    },
    schematic: {
      titleLine1: 'Synthesize',
      titleHighlight: 'Operations.',
      description: 'Design ecosystems where humans and digital workers collaborate seamlessly, tied to KPIs, ROI, and measurable business outcomes.',
      stats: [
        { label: 'Efficiency', val: 'OPTIMIZED' },
        { label: 'Throughput', val: 'MAXIMIZED' },
        { label: 'Costs', val: 'REDUCED' },
      ],
    },
  },

  capabilities: [
    {
      title: 'Automation Consulting',
      description: 'Establish the strategy, governance, and roadmap required to scale automation across the enterprise. We begin with clarity, delivering a prioritized automation blueprint aligned to business value.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Automation readiness assessment',
        'Process discovery & mining',
        'Automation strategy & roadmap',
        'Center of Excellence (CoE) setup',
        'Governance & ROI modeling',
      ],
    },
    {
      title: 'Process Automation',
      description: 'Eliminate repetitive work. Orchestrate workflows intelligently to achieve reduced manual workload, faster cycle times, and improved accuracy.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Robotic Process Automation (RPA)',
        'Workflow automation & orchestration',
        'End-to-end business process automation',
        'IT process automation',
        'Monitoring & performance optimization',
      ],
    },
    {
      title: 'Digital Automation',
      description: 'Modernize applications and digitize core systems using low-code platforms for faster development, improved productivity, and scalable digital systems.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Low-code / no-code application development',
        'Legacy modernization',
        'ERP & mission-critical system extension',
        'Customer touchpoint digitization',
        'Omnichannel workflow enablement',
      ],
    },
    {
      title: 'Cognitive Automation',
      description: 'Embed intelligence into automation systems integrating AI and GenAI to enable intelligent decision-making workflows that adapt, learn, and scale.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Conversational AI & bots',
        'Intelligent Document Processing (IDP)',
        'AI-powered decision automation',
        'Risk assessment automation',
        'GenAI-enabled process augmentation',
      ],
    },
  ],

  trustPillars: [
    { title: 'Automation Center of Excellence', tag: 'Governance', description: 'Request an Automation Assessment and receive: a process heatmap, your top 10 automation candidates, an ROI model with implementation roadmap, and a governance + CoE setup plan. Learn More →' },
    { title: 'Process Mining & Discovery', tag: 'Intelligence', description: 'Stop guessing where the bottlenecks are. We deploy advanced process mining to map your actual enterprise workflows in real-time, uncovering hidden inefficiencies and automation candidates. Learn More →' },
    { title: 'Cognitive Workflows', tag: 'AI-Driven', description: 'Traditional automation handles tasks. Cognitive automation handles decisions. We embed AI + GenAI into workflows to process unstructured data, make predictions, and trigger intelligent actions. Learn More →' },
    { title: 'Enterprise Scalability', tag: 'Growth', description: 'Automation should not break when you grow. We architect resilient, cloud-native systems that scale dynamically across geographies, departments, and regulatory environments. Learn More →' },
  ],
  trustPillarsRightTitle: 'Intelligent Enterprise Optimization',
  trustPillarsRightDescription: 'Kangqore provides end-to-end digital process automation that helps organizations accelerate throughput, eliminate systemic bottlenecks, and operate at unprecedented scale. By combining intelligent workflow platforms and deep industry insights, we engineer ecosystems that are agile, cognitive, and natively scalable.',
  trustPillarsRightButton: 'Request Automation Assessment',
  trustPillarsVideo: '/videos/working-machine-4751312.mp4',

  technologiesTitle: 'Tools & Technologies We Excel In',
  technologiesDescription: "A platform-agnostic automation stack integrating the world's leading RPA, process mining, and cognitive AI engines.",
  technologies: [
    { category: 'Process Consulting & Discovery', items: ['Celonis', 'UiPath Process Mining', 'Signavio', 'Minit', 'ARIS'] },
    { category: 'Robotic Process Automation', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion'] },
    { category: 'Digital Automation & Orchestration', items: ['Appian', 'Pega', 'ServiceNow', 'Camunda', 'Salesforce Flow'] },
    { category: 'Low-Code / No-Code (LCNC)', items: ['OutSystems', 'Mendix', 'Power Apps', 'Bubble', 'Betty Blocks'] },
    { category: 'Cognitive & AI Automation', items: ['OpenAI / ChatGPT', 'ABBYY Vantage', 'Google Document AI', 'Amazon Textract', 'Kore.ai'] },
  ],

  whyKangqoreIntro: 'Kangqore secures ROI and operational excellence simultaneously. We bridge the gap between legacy friction and digital velocity by integrating intelligent automation into the core of your operational architecture.',
  whyKangqore: [
    { title: 'Industry-Embedded Expertise', description: 'Deep domain fluency in BFSI, healthcare, manufacturing, and retail — we don’t just automate, we re-engineer processes with sector-specific precision.' },
    { title: 'Reusable Automation Accelerators', description: 'Pre-built bots, workflow templates, and integration connectors that cut deployment time by 40–60% and reduce total cost of automation.' },
    { title: 'Human + Digital Orchestration', description: 'Unified execution ecosystems where human judgment handles exceptions and digital workers handle volume — orchestrated through a single pane of glass.' },
    { title: 'AI-Integrated Automation', description: 'GenAI-powered document processing, predictive decision engines, and conversational bots embedded directly into production workflows.' },
    { title: 'Value-First Governance', description: 'Every bot, workflow, and AI model is tied to live KPIs, ROI dashboards, and compliance checkpoints — zero unmonitored automation.' },
  ],

  industriesTitle: 'Industry-Specific Process Automation Services',
  industries: [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Supply Chain' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology & Telecom' },
  ],

  preWhyKangqoreSections: dpaAutomationCoESection,
  postFAQSections: dpaRelatedSchematic,
};

// ─── 3. robotic-process-automation ────────────────────────────────────────────

const rpaCoESection = (
  <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black" id="rpa-coe">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Center of Excellence
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
            RPA CoE <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">in a Box.</span>
          </h2>
          <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
            Our highly skilled RPA experts work alongside your business and IT teams to continuously identify processes ripe for automation, select RPA technology suitable for your processes, develop automation workflows, and help sustain your robot workforce.
          </p>
          <div className="space-y-4 mb-10">
            {[
              { icon: <Search className="w-5 h-5" />, title: 'Process Discovery', desc: 'Identify and prioritize automation opportunities based on volume, complexity, and ROI' },
              { icon: <Settings className="w-5 h-5" />, title: 'RPA Technology Selection', desc: 'Select the right RPA platform and tools for your specific process requirements' },
              { icon: <Workflow className="w-5 h-5" />, title: 'Automation Workflows', desc: 'Develop screen automation and cognitive robots for simple and complex processes' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Sustain & Optimize', desc: 'Continuous monitoring, optimization, and scaling of your digital workforce' },
            ].map((item, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
                <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl flex items-center justify-center text-brand-blue shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-base">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
          >
            Build an RPA CoE with Kangqore
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="relative aspect-square w-full max-w-[500px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
              <Bot className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-blue-50 hover:-translate-y-2 transition-all">
                <Cpu className="w-10 h-10 text-blue-600" />
              </div>
              <span className="block text-center text-[11px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">IT Ops</span>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center hover:translate-y-2 transition-all">
                <BarChart3 className="w-10 h-10 text-emerald-400" />
              </div>
              <span className="block text-center text-[11px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">BPA</span>
            </div>
            <div className="absolute top-1/2 left-4 -translate-y-1/2">
              <div className="w-20 h-20 bg-brand-gradient rounded-2xl shadow-xl flex items-center justify-center hover:-translate-x-2 transition-all">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <span className="block text-center text-[11px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">Security</span>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <div className="w-20 h-20 bg-cyan-500 rounded-2xl shadow-xl flex items-center justify-center hover:translate-x-2 transition-all">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <span className="block text-center text-[11px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">POC</span>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
              <defs>
                <linearGradient id="rpa-coe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2564ea" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M250,250 L250,80" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L250,420" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L80,250" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <path d="M250,250 L420,250" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              <g><circle r="3" fill="#2564ea" /><animateMotion path="M250,250 L250,80" dur="2s" repeatCount="indefinite" /></g>
              <g><circle r="3" fill="#22d3ee" /><animateMotion path="M250,250 L80,250" dur="2.5s" repeatCount="indefinite" /></g>
              <g><circle r="3" fill="#10b981" /><animateMotion path="M250,250 L250,420" dur="3s" repeatCount="indefinite" /></g>
              <g><circle r="3" fill="#8b5cf6" /><animateMotion path="M250,250 L420,250" dur="2.2s" repeatCount="indefinite" /></g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const rpaUseCasesSection = (
  <section className="py-20 lg:py-28 bg-[#F5F5F7] relative overflow-hidden" id="rpa-use-cases">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
          Proven Applications
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
          Top RPA <span className="text-transparent bg-clip-text bg-brand-gradient italic">Use Cases.</span>
        </h2>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
          Automation across IT operations and business processes — from HR and finance to insurance and customer experience.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { function: 'IT Operations', icon: <Cpu className="w-6 h-6" />, cases: [
            { process: 'IT Operations Management', systems: 'Monitoring, ITSM tools', outcome: 'Reduced downtime, faster incident resolution' },
            { process: 'IT Services Management', systems: 'ServiceNow, Jira, ITSM', outcome: 'Automated L1/L2 support tasks' },
            { process: 'Security Operations', systems: 'SIEM, endpoint tools', outcome: 'Automated threat detection & response' },
            { process: 'Control Activities', systems: 'Compliance systems', outcome: 'Consistent controls, easier audits' },
          ] },
          { function: 'HR & People', icon: <Users className="w-6 h-6" />, cases: [
            { process: 'Employee onboarding/offboarding', systems: 'HRIS, AD, IT systems', outcome: 'Seamless day-1 readiness' },
            { process: 'Candidate notifications', systems: 'ATS, Email platforms', outcome: 'Timely interview/selection updates' },
            { process: 'Data consolidation', systems: 'Multiple HR systems', outcome: 'Upstream-to-downstream sync' },
            { process: 'Access management', systems: 'IAM, AD, ITSM', outcome: 'Role-based provisioning' },
          ] },
          { function: 'Finance & Insurance', icon: <Building2 className="w-6 h-6" />, cases: [
            { process: 'Payment processing', systems: 'ERP, Bank portals', outcome: 'Source-to-pay automation' },
            { process: 'Fund accounting', systems: 'GL, ERP systems', outcome: 'Automated fund management' },
            { process: 'Claims processing', systems: 'Claims platforms', outcome: 'Faster claims resolution' },
            { process: 'Underwriting systems', systems: 'Policy admin systems', outcome: 'Automated risk assessment' },
          ] },
          { function: 'Customer Experience', icon: <Heart className="w-6 h-6" />, cases: [
            { process: '360° customer engagement', systems: 'CRM, multi-channel', outcome: 'Unified customer view' },
            { process: 'Data management & insights', systems: 'Data platforms, CRM', outcome: 'Actionable customer insights' },
            { process: 'Corporate reporting', systems: 'BI tools, ERP', outcome: 'Automated report generation' },
          ] },
        ].map((group, gIdx) => (
          <div key={gIdx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-500 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-white">
                {group.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">{group.function}</h3>
            </div>
            <div className="space-y-4">
              {group.cases.map((useCase, cIdx) => (
                <div key={cIdx} className="border-l-2 border-blue-100 pl-4 py-1">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{useCase.process}</div>
                  <div className="text-xs text-gray-400 font-mono">{useCase.systems}</div>
                  <div className="text-xs text-brand-blue font-medium">{useCase.outcome}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const rpaRelatedOfferings = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="lg:w-2/3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
          Related Offerings
        </div>
        <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
          Related <br />
          <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
        </h2>
        <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
          Kangqore offers a range of offerings designed to aid and speed up digital transformation across a variety of journeys.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {[
          { name: 'Digital Process Automation', link: '/services/digital-process-automation', icon: <Workflow className="w-5 h-5" />, desc: 'Digital Automation has become a key imperative for organizations to optimize their business processes.' },
          { name: 'AI & Cognitive Computing', link: '/services/ai-cognitive-computing', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Couple augmented intelligence with cognitive computing to enable smarter decision-making.' },
          { name: 'Big Data Engineering', link: '/services/big-data', icon: <Database className="w-5 h-5" />, desc: 'Build the data pipelines and engineering capabilities that power your automation programs.' },
          { name: 'GenAI', link: '/services/genai-business-services', icon: <Target className="w-5 h-5" />, desc: 'Drive innovation at scale with responsible and secure Generative AI capabilities.' },
          { name: 'Agentic AI', link: '/services/agentic-ai', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Empower enterprises with intelligent agents that act, decide, and collaborate autonomously.' },
          { name: 'Data Science & AI', link: '/services/data-science-ai', icon: <LineChart className="w-5 h-5" />, desc: 'Find innovative ways to unlock insights and drive data-driven decision making.' },
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
    </div>
  </section>
);

const roboticProcessAutomation = {
  titleLine1: 'Robotic Process',
  titleHighlight: 'Automation',
  description: 'Integrate RPA with AI, ML, and knowledge-based systems to drive enterprise-wide transformation.',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Robotic Process Automation as a Service</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Kangqore&rsquo;s RPA as a Service helps you automate high-volume, repetitive tasks across IT and business operations—combining bots with AI to reduce cost, improve accuracy, and scale faster.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Automate', label: 'IT & Business processes', color: 'text-blue-500' },
    { value: 'Reduce', label: 'Operational cost', color: 'text-brand-blue' },
    { value: 'Increase', label: 'Efficiency', color: 'text-indigo-500' },
    { value: 'Improve', label: 'Compliance', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'ENTERPRISE AUTOMATION :: 2026',
      titleLine1: 'Drive',
      titleHighlight: 'Transformation.',
      titleLine2: 'Reduce Cost.',
      description: 'With the shared services and business process outsourcing industry maturing, clients are demanding increased operational efficiency and higher transactional volumes. These conflicting requirements of increased efficiency and reduced costs are together fostering the shift towards robotic process automation.',
      bottleneckLabel: 'The Challenge',
      bottleneckText: 'Manual processes, legacy system silos, rising operational costs, and increasing transactional volumes demanding price cuts while maintaining quality.',
      requirementLabel: 'Our Solution',
      requirementText: 'Select the most appropriate RPA operating & governance model, assess and prioritize automation opportunities, build business cases, and implement scalable automation solutions.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
      statusLabel: 'Automation Maturity',
      statusValue: 'Enterprise',
    },
    philosophy: {
      icon: <Cpu className="w-7 h-7 text-brand-blue" />,
      title: 'RPA',
      titleHighlight: 'End-to-End.',
      description: 'Our highly skilled RPA experts work alongside your business and IT teams to continuously identify processes ripe for automation, select suitable RPA technology, develop automation workflows, and help sustain your robot workforce.',
      pills: ['RPA Assessment', 'Process Discovery', 'Bot Development', 'Managed Services'],
    },
    matrix: {
      engineId: 'Engine :: RPA_Core_V4',
      title: 'RPA Delivery Model',
      subtext: 'A structured approach empowering organizations to select the right operating model, prioritize automation opportunities, build business cases, and implement scalable solutions.',
      layers: [
        { title: 'Assess & Prioritize', id: 'RPA_ASSESS', icon: <Search />, desc: 'Assess and prioritize automation opportunities according to current automation rates, transactional volume, and ease of implementation.' },
        { title: 'Build Business Case', id: 'RPA_BIZ', icon: <BarChart3 />, desc: 'Build business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders.' },
        { title: 'Implement & Develop', id: 'RPA_IMPL', icon: <Settings />, desc: 'Implement and develop services to create simple screen automation as well as cognitive robots for complex processes.' },
        { title: 'Sustain & Scale', id: 'RPA_SCALE', icon: <Zap />, desc: 'Help sustain robot workforce with continuous process identification, monitoring, optimization, and enterprise-wide scaling.' },
      ],
    },
    schematic: {
      titleLine1: 'Maximize',
      titleHighlight: 'Efficiency.',
      description: 'Create a digital workforce that is reliable, secure, and scalable — whether you are starting your RPA journey or expanding intelligent automation.',
      stats: [
        { label: 'Reliability', val: 'PROVEN' },
        { label: 'Security', val: 'HARDENED' },
        { label: 'Scale', val: 'ENTERPRISE' },
      ],
    },
  },

  capabilities: [
    {
      title: 'IT Process Automation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Improve accuracy and consistency of IT processes while saving time and cost.',
      items: [
        { heading: 'IT Operations Management', description: 'Automate repetitive and routine IT tasks to reduce downtime and improve incident management process.' },
        { heading: 'IT Services Management', description: 'Automate L1 and L2 support services that handled repetitive, manual processes.' },
        { heading: 'Security Operations Center', description: 'Automatically detect security threats across enterprise systems, send alerts, eliminate potential risks, and test security systems periodically to ensure they actually work and stay up to date.' },
        { heading: 'Repetitive Control Activities', description: 'Automate repetitive control activities and ensure controls are consistent across systems for easier audits and lesser findings.' },
      ],
    },
    {
      title: 'Business Process Automation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Scale your business to grow and enhance customer service without deploying any additional resources.',
      items: [
        'Human Resource',
        'New employee on boarding and off-boarding process',
        'Process candidate notifications pertaining to interviews, selections and feedback',
        'Streamline data across disparate systems for consolidating information from upstream to downstream systems',
        'Relationship management',
        'Employee account management',
        'Role based access management',
        'Finance and Accounting',
        'Payment Processing — source to pay process',
        'Fund accounting and management',
        'Credit operations',
        'Insurance',
        'Claims processing',
        'Corporate reporting',
        'Transaction processing',
        'Underwriting systems',
        'Insurance product management',
        'Customer Experience Management',
        '360-degree customer engagement',
        'Customer data management and insight discovery',
      ],
    },
    {
      title: 'Proof of Concept',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Explore new sources of value creation and prove the ROI of RPA implementation with a POC project.',
      tableData: {
        columns: ['Phase', 'POC Selection', 'Process Reengineering', 'Development and Testing'],
        rows: [
          { label: 'Activities', values: ['Determine complexity\nEstimate business value impact', 'Interview stakeholders\nEvaluate process efficiency', 'Install RPA platform\nDevelop automation solution'] },
          { label: 'Effort', values: ['1–2 days', '2 days', '5–7 days'] },
          { label: 'Stakeholders Involved', values: ['Business SME, RPA expert', 'Business SME, RPA expert', 'RPA COE'] },
        ],
      },
    },
  ],

  trustPillars: [
    { title: 'RPA Operating Model', tag: 'Governance', description: 'Select the most appropriate RPA operating & governance model, change management plan, and deployment strategy tailored to your organization\'s needs.' },
    { title: 'Process Assessment', tag: 'Discovery', description: 'Assess and prioritize automation opportunities and channel efforts according to current automation rates, transactional volume, and ease of implementation.' },
    { title: 'Business Case Validation', tag: 'ROI', description: 'Build business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders across the organization.' },
    { title: 'Implementation & Cognitive Bots', tag: 'Development', description: 'Implement and develop services to create simple screen automation as well as cognitive robots that integrate AI, ML, and knowledge-based systems for complex processes.' },
  ],
  trustPillarsRightTitle: 'Enterprise RPA Governance',
  trustPillarsRightDescription: 'Kangqore helps organizations select the most appropriate RPA operating & governance model, assess and prioritize automation opportunities, build validated business cases, and implement scalable solutions — from simple screen automation to cognitive robots.',
  trustPillarsRightButton: 'Get in Touch',

  technologiesTitle: 'Tools & Technologies',
  technologiesDescription: 'We implement on your preferred stack and integrate with enterprise systems across IT and business operations.',
  technologies: [
    { category: 'RPA Platforms', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate'] },
    { category: 'Process Discovery', items: ['Celonis', 'Signavio', 'UiPath Process Mining', 'Minit'] },
    { category: 'Workflow & Orchestration', items: ['ServiceNow', 'Camunda', 'Appian', 'Pega', 'Salesforce Flow'] },
  ],

  whyKangqoreIntro: 'At Kangqore, we work with companies of all sizes to create a digital workforce that is reliable, secure, and scalable. Whether you want to start your RPA journey or have already deployed RPA and want to start intelligent automation, our experts can help you.',
  whyKangqore: [
    { title: 'End-to-End RPA Services', description: 'From process assessment and opportunity discovery to bot development, deployment, and managed services — we cover the full RPA lifecycle.' },
    { title: 'IT & Business Process Expertise', description: 'Deep expertise in automating both IT processes (operations, service management, security) and business processes (HR, finance, insurance, customer experience).' },
    { title: 'Proven POC Methodology', description: 'Structured POC approach — from selection (1–2 days) to process reengineering (2 days) to development and testing (5–7 days) — ensuring rapid time-to-value.' },
    { title: 'AI & Cognitive Integration', description: 'Go beyond basic screen automation with cognitive robots that leverage AI, ML, and knowledge-based systems for intelligent process automation.' },
    { title: 'Scalable Governance', description: 'Select the right operating model, governance framework, and change management plan to scale from pilot to enterprise-wide automation with confidence.' },
  ],

  industriesTitle: 'Enterprise Automation Across Industries',
  industries: [
    { name: 'Banking, Financial Services & Insurance' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Energy' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Hi-Tech & Media' },
  ],

  customFAQs: [
    {
      question: 'What is RPA and how can it help my organization?',
      answer: 'RPA (Robotic Process Automation) deploys software bots that mimic human actions on applications to execute high-volume, rules-based tasks. It helps organizations reduce operational cost, improve accuracy, increase efficiency, and free up employees to focus on higher-value work. RPA can automate both IT processes and business processes across your enterprise.',
    },
    {
      question: 'What IT processes can be automated with RPA?',
      answer: 'Our IT Process Automation covers IT Operations Management (reducing downtime, improving incident management), IT Services Management (automating L1/L2 support), Security Operations (threat detection, alerts, compliance testing), and repetitive control activities (ensuring consistent controls across systems for easier audits).',
    },
    {
      question: 'What business processes can be automated?',
      answer: 'We automate across Human Resources (onboarding, offboarding, candidate notifications), Finance & Accounting (payment processing, fund accounting, credit operations), Insurance (claims processing, underwriting, corporate reporting), and Customer Experience Management (360-degree engagement, customer data management, and insight discovery).',
    },
    {
      question: 'How does the Proof of Concept process work?',
      answer: 'Our structured POC approach has three phases: POC Selection (1–2 days) to determine complexity and estimate business value, Process Reengineering (2 days) to interview stakeholders and evaluate process efficiency, and Development & Testing (5–7 days) to install the RPA platform and develop the automation solution.',
    },
    {
      question: 'How do you select and prioritize automation opportunities?',
      answer: 'We assess and prioritize automation opportunities according to current automation rates, transactional volume, and ease of implementation. We help build a business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders.',
    },
    {
      question: 'Can RPA integrate with AI and cognitive technologies?',
      answer: "Yes. Kangqore's RPA services are designed to integrate with AI, machine learning, and knowledge-based systems. Beyond simple screen automation, we develop cognitive robots that can handle complex processes requiring document understanding, decision support, and intelligent data processing.",
    },
  ],

  preWhyKangqoreSections: (
    <>
      {rpaCoESection}
      {rpaUseCasesSection}
    </>
  ),
  postFAQSections: rpaRelatedOfferings,
};

// ─── 4. business-process-management ───────────────────────────────────────────

const bpmWhatKangqoreBringsSection = (
  <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black" id="capabilities">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
          Our Approach
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
          What Kangqore Brings <span className="text-transparent bg-clip-text bg-brand-gradient italic">to the Table.</span>
        </h2>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
          Six foundational pillars that power our BPM delivery and set us apart.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: <BrainCircuit className="w-6 h-6" />, title: 'Technology-led, GenAI-enabled Innovation', items: ['Advanced technologies (automation, AI, GenAI) that elevate business operations', 'Scalable, tech-enabled models that reduce cost through smart process automation', 'Continuous productivity, efficiency, and cost savings', 'Tailored BPM services and operating models for enterprise needs'] },
          { icon: <Heart className="w-6 h-6" />, title: 'Customer Experience at the Core', items: ['Experience-led transformation using CX labs, BPM programs, analytics, and operational insights', 'Persona-based requirements to remove redundancies in operations', 'Zero-friction and zero-touch digital processes', 'Strong digital governance and execution cadence'] },
          { icon: <Layers className="w-6 h-6" />, title: 'Flexible Structures', items: ['Carve-outs of existing teams', 'Build or ramp-up from scratch', 'Build-Operate-Transfer (BOT) model', 'Joint ventures / SPVs for specialized delivery'] },
          { icon: <Users className="w-6 h-6" />, title: 'Unparalleled Domain Expertise', items: ['Hiring top talent across BPM + operations domains', 'Ongoing upskilling of teams', 'Best practices spanning end-to-end operating models for seamless execution'] },
          { icon: <Shield className="w-6 h-6" />, title: 'Compliance and Quality', items: ['Three lines of defense embedded into BPM models', 'Dedicated compliance officers for risk mitigation', 'Risk-based quality framework for consistent outcomes'] },
          { icon: <Globe className="w-6 h-6" />, title: 'Strong Partner Ecosystem', items: ['Best-of-breed solutions and integrations (CRM, supply chain, operations platforms)', 'Partner-led accelerators to deliver value faster', 'Platform-agnostic execution across leading BPM tools'] },
        ].map((pillar, idx) => (
          <div key={idx} className="group bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-500">
            <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
              {pillar.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-4">{pillar.title}</h3>
            <ul className="space-y-2.5">
              {pillar.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-sm text-gray-500 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue/40 shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const bpmMetricsStripSection = (
  <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
        {[
          { label: 'Multi-domain Delivery', sub: 'BPM + Automation + Data + AI' },
          { label: 'CoE-ready Governance', sub: 'Enterprise operating models' },
          { label: 'Platform-agnostic', sub: 'Execution across leading tools' },
          { label: 'Rapid POC-to-Scale', sub: 'Structured delivery model' },
          { label: 'Enterprise Security', sub: 'Hardened posture' },
          { label: '24/7 Support-ready', sub: 'Operational readiness' },
        ].map((metric, idx) => (
          <div key={idx} className="text-center group">
            <div className="text-lg lg:text-xl font-bold text-white tracking-tight mb-1 group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors">
              {metric.label}
            </div>
            <div className="text-xs text-white/50 font-medium tracking-wide uppercase">
              {metric.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const bpmRelatedOfferings = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="lg:w-2/3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
          Related Offerings
        </div>
        <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
          Related <br />
          <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
        </h2>
        <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
          Kangqore offers a range of services designed to aid and speed up digital transformation across a variety of journeys.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {[
          { name: 'Robotic Process Automation', link: '/services/robotic-process-automation', icon: <Bot className="w-5 h-5" />, desc: 'Deploy secure, scalable software bots that automate high-volume, repetitive tasks across IT and business operations.' },
          { name: 'Digital Process Automation', link: '/services/digital-process-automation', icon: <Workflow className="w-5 h-5" />, desc: 'End-to-end workflow orchestration combining process, digital, and cognitive automation layers.' },
          { name: 'AI & Cognitive Computing', link: '/services/ai-cognitive-computing', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Couple augmented intelligence with cognitive computing for smarter decision-making workflows.' },
          { name: 'GenAI', link: '/services/genai-business-services', icon: <Target className="w-5 h-5" />, desc: 'Drive innovation at scale with responsible and secure Generative AI capabilities.' },
          { name: 'Data Science & AI', link: '/services/data-science-ai', icon: <LineChart className="w-5 h-5" />, desc: 'Unlock actionable insights with advanced analytics and data-driven decision making.' },
          { name: 'Agentic AI', link: '/services/agentic-ai', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Empower enterprises with intelligent agents that act, decide, and collaborate autonomously.' },
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
    </div>
  </section>
);

const businessProcessManagement = {
  titleLine1: 'Business Process',
  titleHighlight: 'Management',
  description: 'Driving 360° operational excellence to build future-ready enterprises.',
  videoBackground: '/videos/working-machine-4751312.mp4',
  fullDescription: (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Driving 360° operational excellence to build future-ready enterprises.</h2>
      <p className="font-light tracking-tight leading-snug opacity-80">
        Kangqore helps organizations redesign, govern, and continuously improve business processes—combining BPM, automation, analytics, and AI to deliver scalable operating models and measurable outcomes.
      </p>
    </div>
  ),
  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  hideGenericMidPageCta: true,
  hideGenericFaq: true,

  stats: [
    { value: 'Optimize', label: 'Business processes', color: 'text-blue-500' },
    { value: 'Reduce', label: 'Operational cost', color: 'text-brand-blue' },
    { value: 'Enhance', label: 'Customer experience', color: 'text-indigo-500' },
    { value: 'Drive', label: '360° excellence', color: 'text-purple-500' },
  ],

  highFidelity: {
    narrative: {
      badge: 'OPERATIONAL EXCELLENCE :: 2026',
      titleLine1: 'Creating Real Impact',
      titleHighlight: 'through Intelligent',
      titleLine2: 'Business Experiences.',
      description: 'Dynamic markets demand dynamic operations. Kangqore helps organizations redesign, govern, and continuously improve business processes—combining BPM, automation, analytics, and AI to deliver scalable operating models and measurable outcomes. Our approach brings structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise.',
      bottleneckLabel: 'The Challenge',
      bottleneckText: 'Fragmented workflows, rising operational costs, inconsistent service delivery, and siloed processes that block agility and scale.',
      requirementLabel: 'Our Approach',
      requirementText: 'Technology-led BPM with GenAI-enabled innovation, experience-driven design, flexible structures, and three lines of defense for compliance and quality.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
      statusLabel: 'Process Maturity',
      statusValue: 'Optimized',
    },
    philosophy: {
      icon: <Workflow className="w-7 h-7 text-brand-blue" />,
      title: 'BPM',
      titleHighlight: 'Excellence-Driven.',
      description: 'We bring structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise with automation, AI, and domain expertise.',
      pills: ['Process Design', 'Hyper-Automation', 'Analytics & AI', 'Compliance & Quality'],
    },
    matrix: {
      engineId: 'Engine :: BPM_Core_V3',
      title: 'BPM Delivery Model',
      subtext: 'A structured, domain-led approach to process transformation — from assessment to continuous optimization.',
      layers: [
        { title: 'Assess & Model', id: 'BPM_ASSESS', icon: <Search />, desc: '3-Level business process modeling with standardization, elimination of redundancies, and automation opportunity identification.' },
        { title: 'Design & Architect', id: 'BPM_DESIGN', icon: <Layers />, desc: 'Experience-led process design using CX labs, BPM programs, analytics, and operational insights for zero-friction workflows.' },
        { title: 'Implement & Automate', id: 'BPM_IMPL', icon: <Zap />, desc: 'Deploy RPA, cognitive automation, and AI-powered workflows across sales, finance, HR, supply chain, and customer operations.' },
        { title: 'Govern & Optimize', id: 'BPM_GOV', icon: <Shield />, desc: 'Three lines of defense, dedicated compliance officers, KPI dashboards, and continuous improvement cadence.' },
      ],
    },
    schematic: {
      titleLine1: 'Drive',
      titleHighlight: 'Agility.',
      description: 'Your operations should enable scale, not impede it. We build the foundations for 360° operational excellence.',
      stats: [
        { label: 'Quality', val: 'HARDENED' },
        { label: 'Compliance', val: 'EMBEDDED' },
        { label: 'Scale', val: 'ENTERPRISE' },
      ],
    },
  },

  capabilities: [
    { title: 'Sales Operations', bgImage: '/images/capabilities/business-strategy.png', description: 'Streamline your sales lifecycle with process automation, pipeline governance, and data-driven insights that accelerate revenue growth.', items: ['Lead-to-cash process automation', 'Pipeline management & forecasting', 'Sales analytics & performance dashboards', 'CRM workflow optimization', 'Order management & fulfillment'] },
    { title: 'Customer Experience Management (CXM)', bgImage: '/images/capabilities/ux-design.png', description: 'Deliver consistent, personalized customer experiences across every touchpoint with intelligent process orchestration and real-time insights.', items: ['360-degree customer engagement', 'Omnichannel service orchestration', 'Customer journey mapping & optimization', 'Voice of Customer (VoC) analytics', 'Service quality monitoring & SLA management'] },
    { title: 'Hyper-Intelligent Automation', bgImage: '/images/capabilities/quality-testing.png', description: 'Combine RPA, AI, and cognitive technologies to automate complex, judgment-intensive processes at scale across the enterprise.', items: ['Robotic Process Automation (RPA)', 'Intelligent Document Processing (IDP)', 'AI-powered decision automation', 'Cognitive workflow orchestration', 'GenAI-enabled process augmentation'] },
    { title: 'Finance & Accounting', bgImage: '/images/capabilities/finance.png', description: 'Transform financial operations with automated workflows, real-time reporting, and compliance-ready processes that reduce cost and risk.', items: ['Procure-to-pay automation', 'Order-to-cash optimization', 'Record-to-report streamlining', 'Treasury & cash management', 'Regulatory reporting & compliance'] },
    { title: 'Supply Chain Management', bgImage: '/images/capabilities/ai-cognitive.png', description: 'Build resilient, agile supply chains with end-to-end process visibility, predictive analytics, and automated procurement workflows.', items: ['Procurement & vendor management', 'Inventory optimization & demand planning', 'Logistics & fulfillment automation', 'Supply chain risk management', 'Supplier performance analytics'] },
    { title: 'Marketing Operations & Content', bgImage: '/images/capabilities/growth-marketing.png', description: 'Scale marketing execution with automated campaign workflows, content operations, and performance analytics for measurable ROI.', items: ['Campaign management & automation', 'Content lifecycle management', 'Marketing analytics & attribution', 'Brand compliance & governance', 'Digital asset management'] },
    { title: 'Human Resource Services', bgImage: '/images/capabilities/business-strategy.png', description: 'Modernize HR operations with automated employee lifecycle management, compliance-ready processes, and workforce analytics.', items: ['Employee onboarding & offboarding', 'Payroll & benefits administration', 'Talent acquisition & management', 'Workforce planning & analytics', 'Learning & development programs'] },
  ],

  trustPillars: [
    { title: 'Technology-led Innovation', tag: 'GenAI-enabled', description: 'Advanced technologies including automation, AI, and GenAI that elevate business operations. Scalable, tech-enabled models that reduce cost through smart process automation with continuous productivity gains.' },
    { title: 'Customer Experience at the Core', tag: 'CX-first', description: 'Experience-led transformation using CX labs, BPM programs, analytics, and operational insights. Persona-based design to remove redundancies, enabling zero-friction and zero-touch digital processes.' },
    { title: 'Flexible Engagement Models', tag: 'Adaptable', description: 'Choose from carve-outs of existing teams, build or ramp-up from scratch, or Build-Operate-Transfer (BOT) models — structured to fit your organizational needs and growth trajectory.' },
    { title: 'Compliance & Quality Framework', tag: 'Risk-aware', description: 'Three lines of defense embedded into BPM models with dedicated compliance officers. Risk-based quality framework for consistent outcomes, proactive risk identification, and regulatory readiness.' },
  ],
  trustPillarsRightTitle: 'Our Operational Approach',
  trustPillarsRightDescription: 'Kangqore combines technology-led innovation, customer-first design, flexible engagement models, and embedded compliance to deliver BPM programs that scale with confidence and measurable results.',
  trustPillarsRightButton: 'Request Assessment',

  technologiesTitle: 'Tools & Technologies',
  technologiesDescription: 'We implement on your preferred stack — integrating with leading BPM platforms, RPA tools, analytics engines, and enterprise systems.',
  technologies: [
    { category: 'BPM Platforms', items: ['Appian', 'Pega', 'ServiceNow', 'Camunda', 'Bizagi', 'IBM BPM', 'Nintex', 'Kissflow'] },
    { category: 'RPA & Automation', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion', 'NICE', 'Kofax', 'Kryon'] },
    { category: 'Analytics & AI', items: ['Celonis', 'Tableau', 'Power BI', 'OpenAI', 'Google Document AI', 'Azure AI', 'AWS SageMaker', 'Dataiku'] },
    { category: 'CRM & Operations', items: ['Salesforce', 'SAP', 'Oracle', 'Workday', 'Microsoft Dynamics', 'HubSpot', 'Zoho', 'NetSuite'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'] },
    { category: 'DevOps & QA', items: ['Jenkins', 'GitLab CI', 'Selenium', 'Jira', 'Confluence', 'SonarQube', 'Postman'] },
    { category: 'Integration & Middleware', items: ['MuleSoft', 'Dell Boomi', 'Apache Kafka', 'Talend', 'Informatica', 'SnapLogic'] },
  ],

  whyKangqoreIntro: 'Kangqore combines domain expertise, technology-led innovation, and a proven governance framework to deliver BPM solutions that create real, measurable impact across the enterprise.',
  whyKangqore: [
    { title: '3-Level Business Process Modeling', description: 'Process standardization to drive elimination, agility, and automation. Controls established for regulatory compliance across strategic, operational, and task-level workflows.' },
    { title: 'Robotic Process Automation (RPA)', description: 'Deploy bots that remove repetitive manual work at scale — integrating seamlessly with existing systems for 24/7 operational capacity and measurable cost savings.' },
    { title: 'Impactful Analytics', description: 'Operational analytics + KPI dashboards to measure outcomes and continuously optimize. Real-time visibility into process performance and improvement opportunities.' },
    { title: 'Three Lines of Defense', description: 'Embed risk ownership, compliance oversight, and independent assurance into your operating model — helping teams meet regulatory expectations and build a strong risk culture.' },
    { title: 'Transition Management Academy', description: 'Build transition-ready teams with structured training and certification — equipping SMEs and managers with process analysis, governance, and improvement skills for smooth BPM execution.' },
    { title: 'Quality & Compliance Framework', description: 'Drive consistent outcomes with a risk-based quality framework — proactively identifying process risks, strengthening controls, and improving compliance readiness across operations.' },
  ],

  industryTitle: 'Industry Solutions that Drive Real Value.',
  industries: [
    { name: 'Banking' },
    { name: 'Capital Markets' },
    { name: 'Insurance' },
    { name: 'Mortgage' },
    { name: 'Healthcare' },
    { name: 'Life Sciences' },
    { name: 'Retail' },
    { name: 'Consumer Packaged Goods' },
    { name: 'High Tech & Manufacturing' },
    { name: 'Utilities' },
    { name: 'Telecom' },
  ],

  customFAQs: [
    { question: 'How does Kangqore enable 360° operational excellence?', answer: 'We combine 3-level process modeling, hyper-intelligent automation, analytics-driven insights, and embedded compliance frameworks to redesign and continuously optimize operations across every business function — from sales and finance to HR and supply chain.' },
    { question: "Which technologies power Kangqore's BPM and automation solutions?", answer: 'We work across leading BPM platforms (Appian, Pega, ServiceNow, Camunda), RPA tools (UiPath, Automation Anywhere, Power Automate), analytics engines (Celonis, Tableau, Power BI), and AI/GenAI capabilities — selecting the right stack for your environment.' },
    { question: 'How does GenAI enhance business process management and automation?', answer: 'GenAI enables intelligent document processing, automated decision support, predictive process optimization, and natural-language workflow orchestration — extending automation beyond rules-based tasks into judgment-intensive processes.' },
    { question: 'What are the benefits of automation and AI in operations?', answer: 'Key benefits include reduced operational costs, faster cycle times, improved accuracy and compliance, enhanced customer experience, real-time visibility into process performance, and the ability to scale without proportional increases in headcount.' },
    { question: 'What kind of post-implementation support does Kangqore provide?', answer: 'We offer ongoing process monitoring, KPI dashboards, continuous optimization sprints, upskilling programs through our Transition Management Academy, and dedicated compliance oversight to ensure sustained value from your BPM investment.' },
    { question: 'How are solutions tailored to different users, teams, and industries?', answer: 'We start with persona-based requirements analysis to remove redundancies, then apply industry-specific process templates and domain expertise. Our flexible engagement models — carve-outs, build-from-scratch, or Build-Operate-Transfer — adapt to your organizational structure.' },
    { question: "Which industries benefit most from Kangqore's BPM services?", answer: 'We serve Banking, Capital Markets, Insurance, Mortgage, Healthcare, Life Sciences, Retail, CPG, High Tech & Manufacturing, Utilities, and Telecom — each with industry-aligned operating models and compliance frameworks.' },
    { question: 'How do you ensure automation is secure, compliant, and scalable?', answer: 'Our three-lines-of-defense model embeds risk ownership, compliance oversight, and independent assurance into every operating model. Dedicated compliance officers, enterprise-grade security controls, and scalable architecture ensure readiness at any scale.' },
    { question: 'How quickly can BPM and digital process automation be deployed?', answer: 'Initial process assessment and modeling typically takes 2–4 weeks. A focused automation POC can be delivered in 4–6 weeks. Enterprise-wide BPM programs scale in phased sprints, with measurable outcomes visible from the first phase.' },
  ],

  preWhyKangqoreSections: (
    <>
      {bpmWhatKangqoreBringsSection}
      {bpmMetricsStripSection}
    </>
  ),

  postWhyKangqoreSections: (
    <>
      <BPMProcessRedesignSection />
      <BPMPreferenceSection />
    </>
  ),

  postIndustrySections: (
    <section className="py-20 lg:py-28 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-1.5 bg-brand-blue/20 rounded-full mx-auto mb-10"></div>
        <p className="text-3xl lg:text-[2.75rem] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.2] font-display">
          When growth outpaces structure, complexity becomes the bottleneck. <span className="text-transparent bg-clip-text bg-brand-gradient italic">Kangqore brings discipline to operations</span>—designing BPM programs that deliver measurable outcomes, not slideware.
        </p>
        <div className="w-16 h-1.5 bg-brand-blue/20 rounded-full mx-auto mt-10"></div>
      </div>
    </section>
  ),

  postFAQSections: bpmRelatedOfferings,
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const COGNITION_AUTOMATION_SECTIONS = {
  'intelligent-automation': intelligentAutomation,
  'digital-process-automation': digitalProcessAutomation,
  'robotic-process-automation': roboticProcessAutomation,
  'business-process-management': businessProcessManagement,
};
