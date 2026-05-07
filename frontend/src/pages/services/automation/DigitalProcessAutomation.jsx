import React from 'react';
import { Layers, Search, ShieldCheck, Workflow, Zap, Target, Bot, Activity, BrainCircuit, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const DigitalProcessAutomation = () => {
  const service = {
    name: 'Digital Process Automation',
    titleLine1: 'Digital Process',
    titleHighlight: 'Automation',
    slug: 'digital-process-automation',
    shortDescription: 'Automate intelligently. Orchestrate seamlessly. Scale sustainably.',
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
    stats: [
      { value: 'Optimize', label: 'Business processes', color: 'text-blue-500' },
      { value: 'Reduce', label: 'Manual intervention', color: 'text-brand-blue' },
      { value: 'Increase', label: 'Operational efficiency', color: 'text-indigo-500' },
      { value: 'Improve', label: 'Compliance & governance', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
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
        statusValue: 'Maximized'
      },
      philosophy: {
        icon: <Workflow className="w-7 h-7 text-brand-blue" />,
        title: 'Our',
        titleHighlight: 'Automation Framework.',
        description: 'At Kangqore, DPA is structured across four integrated layers to ensure scalability, adaptability, and continuous operational intelligence.',
        pills: ['Consulting', 'Process Automation', 'Digital Automation', 'Cognitive Automation']
      },
      matrix: {
        engineId: 'Engine :: DPA_Flow_V1',
        title: '4-Layer Automation Architecture',
        subtext: 'We deconstruct the complexity of enterprise operations into manageable, automated execution layers.',
        layers: [
          { title: 'Consulting', id: 'DPA_C', icon: <Search />, desc: 'Discover + prioritize ROI use cases via readiness assessments, process mining, and CoE governance.' },
          { title: 'Process', id: 'DPA_P', icon: <Layers />, desc: 'Orchestrate workflows + RPA at scale with end-to-end business process automation and monitoring.' },
          { title: 'Digital', id: 'DPA_D', icon: <Zap />, desc: 'Low-code apps + modernization to bridge gaps — extending ERP, digitizing touchpoints, enabling omnichannel.' },
          { title: 'Cognitive', id: 'DPA_AI', icon: <BrainCircuit />, desc: 'IDP + conversational AI + decision automation powered by GenAI for intelligent, self-improving workflows.' }
        ]
      },
      schematic: {
        titleLine1: 'Synthesize',
        titleHighlight: 'Operations.',
        description: 'Design ecosystems where humans and digital workers collaborate seamlessly, tied to KPIs, ROI, and measurable business outcomes.',
        stats: [
          { label: 'Efficiency', val: 'OPTIMIZED' },
          { label: 'Throughput', val: 'MAXIMIZED' },
          { label: 'Costs', val: 'REDUCED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge intelligent automation solutions.'
  };

  const capabilities = [
    {
      title: 'Automation Consulting',
      description: 'Establish the strategy, governance, and roadmap required to scale automation across the enterprise. We begin with clarity, delivering a prioritized automation blueprint aligned to business value.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', // Dark dashboard graph 
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Automation readiness assessment',
        'Process discovery & mining',
        'Automation strategy & roadmap',
        'Center of Excellence (CoE) setup',
        'Governance & ROI modeling'
      ]
    },
    {
      title: 'Process Automation',
      description: 'Eliminate repetitive work. Orchestrate workflows intelligently to achieve reduced manual workload, faster cycle times, and improved accuracy.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80', // Stressed worker at laptop
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Robotic Process Automation (RPA)',
        'Workflow automation & orchestration',
        'End-to-end business process automation',
        'IT process automation',
        'Monitoring & performance optimization'
      ]
    },
    {
      title: 'Digital Automation',
      description: 'Modernize applications and digitize core systems using low-code platforms for faster development, improved productivity, and scalable digital systems.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80', // Dark dusty circuit board
      bgImage: '/images/capabilities/quality-testing.png',
      items: [
        'Low-code / no-code application development',
        'Legacy modernization',
        'ERP & mission-critical system extension',
        'Customer touchpoint digitization',
        'Omnichannel workflow enablement'
      ]
    },
    {
      title: 'Cognitive Automation',
      description: 'Embed intelligence into automation systems integrating AI and GenAI to enable intelligent decision-making workflows that adapt, learn, and scale.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80', // Abstract AI Network
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Conversational AI & bots',
        'Intelligent Document Processing (IDP)',
        'AI-powered decision automation',
        'Risk assessment automation',
        'GenAI-enabled process augmentation'
      ]
    }
  ];

  const technologies = [
    { category: 'Process Consulting & Discovery', items: ['Celonis', 'UiPath Process Mining', 'Signavio', 'Minit', 'ARIS'] },
    { category: 'Robotic Process Automation', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion'] },
    { category: 'Digital Automation & Orchestration', items: ['Appian', 'Pega', 'ServiceNow', 'Camunda', 'Salesforce Flow'] },
    { category: 'Low-Code / No-Code (LCNC)', items: ['OutSystems', 'Mendix', 'Power Apps', 'Bubble', 'Betty Blocks'] },
    { category: 'Cognitive & AI Automation', items: ['OpenAI / ChatGPT', 'ABBYY Vantage', 'Google Document AI', 'Amazon Textract', 'Kore.ai'] }
  ];

  const trustPillars = [
    {
      title: 'Automation Center of Excellence',
      tag: 'Governance',
      description: 'Request an Automation Assessment and receive: a process heatmap, your top 10 automation candidates, an ROI model with implementation roadmap, and a governance + CoE setup plan. Learn More →'
    },
    {
      title: 'Process Mining & Discovery',
      tag: 'Intelligence',
      description: 'Stop guessing where the bottlenecks are. We deploy advanced process mining to map your actual enterprise workflows in real-time, uncovering hidden inefficiencies and automation candidates. Learn More →'
    },
    {
      title: 'Cognitive Workflows',
      tag: 'AI-Driven',
      description: 'Traditional automation handles tasks. Cognitive automation handles decisions. We embed AI + GenAI into workflows to process unstructured data, make predictions, and trigger intelligent actions. Learn More →'
    },
    {
      title: 'Enterprise Scalability',
      tag: 'Growth',
      description: 'Automation should not break when you grow. We architect resilient, cloud-native systems that scale dynamically across geographies, departments, and regulatory environments. Learn More →'
    }
  ];

  const whyKangqoreIntro = `Kangqore secures ROI and operational excellence simultaneously. We bridge the gap between legacy friction and digital velocity by integrating intelligent automation into the core of your operational architecture.`;

  const whyKangqore = [
    { 
      title: 'Industry-Embedded Expertise', 
      description: 'Deep domain fluency in BFSI, healthcare, manufacturing, and retail — we don\'t just automate, we re-engineer processes with sector-specific precision.' 
    },
    { 
      title: 'Reusable Automation Accelerators', 
      description: 'Pre-built bots, workflow templates, and integration connectors that cut deployment time by 40–60% and reduce total cost of automation.' 
    },
    { 
      title: 'Human + Digital Orchestration', 
      description: 'Unified execution ecosystems where human judgment handles exceptions and digital workers handle volume — orchestrated through a single pane of glass.' 
    },
    { 
      title: 'AI-Integrated Automation', 
      description: 'GenAI-powered document processing, predictive decision engines, and conversational bots embedded directly into production workflows.' 
    },
    { 
      title: 'Value-First Governance', 
      description: 'Every bot, workflow, and AI model is tied to live KPIs, ROI dashboards, and compliance checkpoints — zero unmonitored automation.' 
    }
  ];

  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Supply Chain' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology & Telecom' }
  ];

  // Technical Schematic Section - Adapted from ITSecurityServices
  const customSections = (
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
                { 
                  name: 'AI & Cognitive Computing', 
                  link: '/services/data-ai/cognitive-services',
                  icon: <BrainCircuit className="w-5 h-5" />,
                  desc: 'Infuse intelligence into every enterprise workflow.'
                },
                { 
                  name: 'Robotic Process Automation', 
                  link: '/services/automation/robotic-process-automation',
                  icon: <Bot className="w-5 h-5" />,
                  desc: 'Eliminate manual friction at massive scale.'
                },
                { 
                  name: 'Big Data Engineering', 
                  link: '/services/data-ai/data-engineering',
                  icon: <Layers className="w-5 h-5" />,
                  desc: 'Architect the data pipelines that power automation.'
                },
                { 
                  name: 'GenAI & Agentic AI', 
                  link: '/services/data-ai/generative-ai',
                  icon: <Target className="w-5 h-5" />,
                  desc: 'Deploy autonomous agents for complex decisioning.'
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
                        {/* Note: In ITSecurityServices.jsx, ChevronRight is imported but in DigitalProcessAutomation.jsx it lacked import. Added below manually without extra import to rely on existing lucide-react */}
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

          {/* Technical Schematic: Automation Execution Hub */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_DPA_EXEC</span></div>
                <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ENTERPRISE</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">ORCHESTRATED</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Workflow Engine</div>
                <div>SYNTHESIZING_TASKS...</div>
                <div>EFFICIENCY: +94%</div>
              </div>

              {/* Central Core (Automation Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Workflow className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Infrastructure, Identity, Data) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Layers className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Systems</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">KPI</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Metrics</span>
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
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Cognitive AI</span>
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

  // ============================================
  // AUTOMATION CENTER OF EXCELLENCE SECTION
  // Diamond diagram + Key Differentiators
  // ============================================
  const automationCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ==================== TWO-COLUMN LAYOUT: INTRO + DIAGRAM ==================== */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          {/* LEFT: Intro Text */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                Kangqore's Digital Process Automation Center of Excellence (CoE) is built on four interconnected capability layers — <strong className="text-brand-blue">Automation Consulting</strong>, <strong className="text-brand-blue">Process Automation</strong>, <strong className="text-brand-blue">Digital Automation</strong>, and <strong className="text-brand-blue">Cognitive Automation</strong> — forming a unified automation architecture.
              </p>
              <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                From strategic advisory and process discovery to intelligent orchestration, low-code modernization, and AI-driven decision systems, we deliver end-to-end automation that transforms how work flows across the enterprise. Our model enhances efficiency, enables personalization, strengthens omnichannel engagement, and embeds data-driven intelligence into core operations.
              </p>
            </div>
          </div>

          {/* RIGHT: Diamond Diagram */}
          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            {/* Desktop Diamond Layout */}
            <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
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
                {/* Perspective container */}
                <div className="relative z-10 w-[300px] h-[300px]" style={{
                  perspective: '900px',
                  perspectiveOrigin: '50% 40%'
                }}>
                  {/* 3D tilted diamond — rotateX gives depth foreshortening */}
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{
                      transformStyle: 'preserve-3d'
                    }}>
                      {/* Top Left -> Automation Consulting */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        {/* Specular top edge highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        {/* Ambient occlusion bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        {/* Left edge bevel */}
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Consulting</span>
                        </div>
                      </div>
                      {/* Top Right -> Digital Automation */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.15) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.12), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Digital</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                        </div>
                      </div>
                      {/* Bottom Left -> Process Automation */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)',
                        transform: 'translateZ(2px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Process</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Automation</span>
                        </div>
                      </div>
                      {/* Bottom Right -> Cognitive Automation */}
                      <div className="relative overflow-hidden flex items-center justify-center" style={{
                        background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, transparent 100%)' }}></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.10), transparent)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Cognitive</span>
                          <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Automation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== BULLET LABELS (simple text) ===== */}
                {/* Top-Left: Automation Consulting bullets */}
                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Automation advisory and process excellence</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Automation Strategy</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Process Mining</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Center of Excellence</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Top-Right: Digital Automation bullets */}
                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Modernize legacy applications</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Extend ERP /mission critical system life</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Scale customer touch points</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Digitization of processes</span>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Left: Process Automation bullets */}
                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Robotic Process Automation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Workflow Automation/Orchestration</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>End to end Business process Automation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Automation Monitoring</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>IT Automation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                {/* Bottom-Right: Cognitive Automation bullets */}
                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Conversational Bots</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Intelligent Process Automation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Intelligent Document Processing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Automated Risk Assessment</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Infrastructure Automation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

           {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { 
                title: 'Automation Consulting', 
                gradient: 'from-[#2564ea] to-[#3b82f6]',
                dotColor: 'bg-[#2564ea]',
                items: ['Automation advisory & process excellence', 'Automation Strategy', 'Process Mining', 'Center of Excellence']
              },
              { 
                title: 'Digital Automation', 
                gradient: 'from-[#3b82f6] to-[#60a5fa]',
                dotColor: 'bg-[#3b82f6]',
                items: ['Modernize legacy applications', 'Extend ERP / mission critical system life', 'Scale customer touch points', 'Digitization of processes']
              },
              { 
                title: 'Process Automation', 
                gradient: 'from-[#1e40af] to-[#2564ea]',
                dotColor: 'bg-[#1e40af]',
                items: ['Robotic Process Automation', 'Workflow Automation/Orchestration', 'End to end Business process Automation', 'Automation Monitoring', 'IT Automation']
              },
              { 
                title: 'Cognitive Automation', 
                gradient: 'from-[#4ab6d4] to-[#38bdf8]',
                dotColor: 'bg-[#4ab6d4]',
                items: ['Conversational Bots', 'Intelligent Process Automation', 'Intelligent Document Processing', 'Automated Risk Assessment', 'Infrastructure Automation']
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
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Domain Expertise in Focus Verticals',
                text: 'Healthcare, Manufacturing, CPG/Retail, BFSI, etc. — provides a vital edge in process re-engineering and optimisation consulting, which is an integral part of any successful enterprise automation initiative.'
              },
              {
                num: 2,
                title: 'Leverage of Digital Capital',
                text: 'Driven by standardization of tools and technology processes, enabling reusable methodologies, accelerators, and frameworks to assist our clients in achieving their objectives faster.'
              },
              {
                num: 3,
                title: 'Focus on Bridging Process & Application Gaps',
                text: 'Rather than just focusing on improving and bridging gaps in processes, we focus on identifying application gaps leveraging low-code/no-code platforms to improve the overall business process efficiency and posture to create an ecosystem of well-orchestrated human and digital workers.'
              },
              {
                num: 4,
                title: 'Cognitive Automation Focus',
                text: 'Improve automated capture of data, automated decision-making, and scale automation. Leverage of Gen AI as part of cognitive automation brings other extended capabilities such as Human-in-the-Loop, language understanding, image recognition, interpreting meaning in text and images, translation, and decision-making.'
              },
              {
                num: 5,
                title: 'People-Centric Value Delivery',
                text: "Our philosophy of 'Engineering the future with accountability' enables us to adopt a people-centric approach to bring value to our customers."
              }
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

  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Tools & Technologies We Excel In',
      technologiesDescription: "A platform-agnostic automation stack integrating the world's leading RPA, process mining, and cognitive AI engines.",
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Intelligent Enterprise Optimization',
      trustPillarsRightDescription: 'Kangqore provides end-to-end digital process automation that helps organizations accelerate throughput, eliminate systemic bottlenecks, and operate at unprecedented scale. By combining intelligent workflow platforms and deep industry insights, we engineer ecosystems that are agile, cognitive, and natively scalable.',
      trustPillarsRightButton: 'Request Automation Assessment',
      trustPillarsVideo: '/videos/working-machine-4751312.mp4',
      preWhyKangqoreSections: automationCoESection,
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industry-Specific Process Automation Services',
      industries,
      postFAQSections: customSections
    },
    department
  };

  return (
    <ServicePageTemplate 
      service={pageData.service} 
      department={department} 
      primaryButton={pageData.service.primaryButton}
      secondaryButton={pageData.service.secondaryButton}
    />
  );
};

export default DigitalProcessAutomation;

