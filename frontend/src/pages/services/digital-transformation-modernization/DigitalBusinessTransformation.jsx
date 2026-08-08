import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  Layers,
  Activity,
  Target,
  Brain,
  Rocket,
  ShieldCheck,
  Search,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Cpu,
  Globe,
  Lock,
  Eye,
  Network,
  Fingerprint
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DigitalBusinessTransformation = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Digital Business Transformation',
    slug: 'digital-business-transformation',
    shortDescription: 'ARCHITECT. ORCHESTRATE. EVOLVE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Enterprise Orchestration</h2>
        <p>Transformation is no longer an option; it is the substrate of enterprise survival. Fragmented legacy systems and siloed operations are the primary bottlenecks to market-led growth.</p>
        <p>Kangqore architects the digitally enabled enterprise by redesigning how your business creates value — integrating strategy, engineering, data intelligence, and governance into a unified digital flow.</p>
      </div>
    ),
    image: '/assets/images/services/digital-business-transformation-hero.png',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Start Your Transformation', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '74%', label: 'Value Realization', color: 'text-cyan-400' },
      { value: '100%', label: 'Digital Alignment', color: 'text-blue-400' },
      { value: 'Unified', label: 'Orchestration Flow', color: 'text-purple-400' },
      { value: 'ROI', label: 'Driven Strategy', color: 'text-orange-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'DIGITAL EVOLUTION :: 2026',
        titleLine1: 'Architect the.',
        titleHighlight: 'Digitally Enabled.',
        titleLine2: 'Enterprise.',
        description: "Transformation is not about adopting tools. It's about redesigning how your business creates value through scalable digital solutions and engineering excellence.",
        bottleneckLabel: 'The Friction',
        bottleneckText: 'Fragmented legacy silos & operational inertia.',
        requirementLabel: 'The Evolution',
        requirementText: 'Unified enterprise orchestration & market-led growth.',
        image: '/assets/images/services/digital-business-transformation-hero.png',
        statusLabel: 'Maturity State',
        statusValue: 'ORCHESTRATED'
      },
      philosophy: {
        icon: <Brain className="w-7 h-7 text-brand-blue" />,
        title: 'Business',
        titleHighlight: 'Intelligence.',
        description: 'We approach transformation as an architectural discipline, ensuring every technology investment is anchored to strategic ROI and operational agility.',
        pills: ['ROI-Driven', 'Cloud-Native', 'AI-First', 'Agile Flow']
      },
      matrix: {
        engineId: 'Engine :: Transformed_Enterprise_V2',
        title: 'Transformation Velocity Model',
        subtext: 'A structured methodology that moves your organization from digital intent to absolute market-led excellence.',
        layers: [
          { title: 'Strategize', id: 'TRANS_STRAT', icon: <Target />, desc: 'Align business ambition with digital execution through maturity assessment & ROI modeling.' },
          { title: 'Architect', id: 'TRANS_ARC', icon: <Layers />, desc: 'Design target operating models and core architecture blueprints for scalable growth.' },
          { title: 'Engineer', id: 'TRANS_BUILD', icon: <Rocket />, desc: 'Deploy high-performing digital products and experience systems aligned to business goals.' },
          { title: 'Orchestrate', id: 'TRANS_FLOW', icon: <Zap />, desc: 'Integrate AI-powered software delivery and automated governance across the enterprise.' },
          { title: 'Evolve', id: 'TRANS_GO', icon: <Activity />, desc: 'Ensure transformation adoption through change enablement and continuous optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Measurable Impact.',
        titleHighlight: 'Value Orchestrated.',
        description: 'Your transformation should deliver undisputed business outcomes. It is the foundation for your next decade of competitive reliability.',
        stats: [
          { label: 'Value', val: 'INCREMENTAL' },
          { label: 'Maturity', val: 'MAXIMIZED' },
          { label: 'Velocity', val: 'ACCELERATED' }
        ]
      }
    }
  };

  const department = {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    description: 'Transforming legacy business models into high-velocity digital enterprises through core engineering and strategic innovation.'
  };

  const technologies = [
    { category: 'Strategy & Research', items: ['Market Intelligence', 'ROI Modeling', 'Miro', 'Lucidchart', 'Google Analytics'] },
    { category: 'Product & UX Design', items: ['Figma', 'Storybook', 'Adobe Creative Cloud', 'Framer', 'UserTesting'] },
    { category: 'AI-Powered SDLC', items: ['GitHub Copilot', 'SonarQube', 'Jenkins', 'GitLab CI', 'Intelligent Test Automation'] },
    { category: 'Enterprise Platforms', items: ['Pimcore', 'Salesforce', 'ServiceNow', 'SAP S/4HANA', 'Microsoft Dynamics'] },
    { category: 'Cloud & Innovation', items: ['AWS / Azure / GCP', 'Kubernetes', 'Azure OpenAI', 'Agentic AI', 'MLOps'] }
  ];

  const capabilities = [
    {
      title: 'Transformation Advisory',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Identify and understand opportunity and impact areas for digital transformation. Define your transformation solution, roadmap, target outcomes, and metrics for tracking progress.',
      items: [
        'Digital maturity assessment & gap analysis',
        'Target Operating Model (TOM) design',
        'Value case & ROI modeling',
        'KPI architecture & measurement design',
        'Executive governance & steering frameworks'
      ]
    },
    {
      title: 'Transformation Execution & Governance',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Define an organizational structure and ways of working to support your transformation journey. Execute your roadmap across people, processes, and technologies, measuring and tracking success.',
      items: [
        'Program governance frameworks (PMO design)',
        'Milestone & dependency management',
        'OKR-based performance tracking',
        'Risk management & escalation models',
        'Transformation dashboards & reporting'
      ]
    },
    {
      title: 'User and Market Research',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Gather data, then turn it into insights and actionable plans. We help you deeply understand your market and audience to drive product-market fit, growth, and user satisfaction.',
      items: [
        'Customer journey mapping',
        'Product-market fit analysis',
        'Quantitative & qualitative research',
        'Competitive benchmarking',
        'Growth & revenue opportunity modeling'
      ]
    },
    {
      title: 'Product and UX/UI Design',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'User wireframes, user flows, sitemaps, component libraries, and more to design the product experience – crafting the structure, look, and functionality while considering brand and accessibility.',
      items: [
        'Product architecture & platform strategy',
        'UX/UI design systems & component libraries',
        'Accessibility & usability optimization',
        'Secure engineering standards',
        'Mobile-first & responsive design'
      ]
    },
    {
      title: 'AI-Powered SDLC',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Reinvent software development with AI-driven precision and productivity, harnessing AI-driven, human-guided approaches to work smarter and get to market faster.',
      items: [
        'AI-assisted development workflows',
        'Intelligent test automation',
        'DevOps & Infrastructure-as-Code',
        'Predictive defect & quality analytics',
        'Engineering productivity optimization'
      ]
    },
    {
      title: 'AI-Enabled Agile',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Pioneer innovation solutions that shape the future of software development by harnessing our expertise in AI practices and Agile operating models.',
      items: [
        'Agile transformation frameworks',
        'Squad-based operating models',
        'AI-driven workflow automation',
        'Continuous integration & experimentation',
        'Digital capability enablement programs'
      ]
    },
    {
      title: 'Product Launch and Adoption',
      bgImage: '/images/capabilities/business-strategy.png',
      description: "Prepare for a smooth launch and drive adoption through change management and strategic launch plans that consider your users, culture, and constraints.",
      items: [
        'Change management frameworks',
        'Enterprise rollout planning',
        'Adoption KPI tracking',
        'Stakeholder engagement models',
        'Post-launch optimization cycles'
      ]
    }
  ];

  const trustPillars = [
    {
      title: 'Value Reinvention',
      tag: 'Strategy',
      description: 'At Kangqore, digital transformation is not a project. It is a structured, measurable reinvention of how your business creates value.'
    },
    {
      title: 'Engineered Excellence',
      tag: 'Engineering',
      description: 'Our scalable engineering teams deliver robust, flexible, enterprise-grade systems designed for long-term performance.'
    },
    {
      title: 'Intelligence-Led',
      tag: 'Data',
      description: 'We integrate data and AI across transformation initiatives to ensure decisions are measurable, optimized, and outcome-driven.'
    },
    {
      title: 'Agile Governance',
      tag: 'Governance',
      description: 'Ensuring every transformation milestone is aligned to commercial outcomes and risk-mitigated strategies.'
    }
  ];

  const customSections = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Orchestration Ecosystem
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Related Transformation <span className="text-transparent bg-clip-text bg-brand-gradient">Offerings</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Accelerate your digital evolution by integrating core transformation with our specialized modernization and growth services.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Technology Modernization', 
                  link: '/services/digital-transformation-modernization/technology-modernization',
                  icon: <Rocket className="w-5 h-5" />,
                  desc: 'Redesigning the tech stack for high-velocity delivery.'
                },
                { 
                  name: 'AI Strategy & Governance', 
                  link: '/services/ai-cognitive/ai-governance',
                  icon: <Brain className="w-5 h-5" />,
                  desc: 'Embedding intelligence at the core of enterprise systems.'
                },
                { 
                  name: 'Application Modernization', 
                  link: '/services/digital-transformation-modernization/application-modernization',
                  icon: <Layers className="w-5 h-5" />,
                  desc: 'Refactoring legacy software into cloud-native assets.'
                },
                { 
                  name: 'Cloud Computing', 
                  link: '/services/cloud-engineering/cloud-computing',
                  icon: <Globe className="w-5 h-5" />,
                  desc: 'Infrastructure agility for distributed business models.'
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
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
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
                Explore All Services 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Technical Schematic: Transformation Center Cluster */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              {/* Central Core (Digital Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Target className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Strategy, Engineering, Data) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Brain className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Strategy</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <Layers className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">CORE</div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Engineering</span>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <Fingerprint className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data Fabric</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="trans-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#trans-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const whyKangqoreIntro = `Kangqore accelerates transformation by bridging the gap between business ambition and engineering execution. We design digital systems that don't just solve problems, but create enduring competitive advantage.`;

  const whyKangqore = [
    { title: 'Value-First Advisory', description: 'Ensuring every digital initiative is anchored to measurable ROI and strategic intent.' },
    { title: 'Scalable Engineering', description: 'Building core digital platforms that support exponential business growth and operational flow.' },
    { title: 'Data-Driven Governance', description: 'Integrating intelligence and automated tracking across transformation programs for total visibility.' },
    { title: 'Omnichannel Excellence', description: 'Designing seamless user experiences across all digital touchpoints to maximize desirability.' },
    { title: 'Agile Operating Models', description: 'Modernizing organizational ways of working to support high-velocity digital innovation.' },
    { title: 'Change-Proof Adoption', description: 'Ensuring long-term success through structured rollout and enterprise change enablement.' }
  ];

  const pageData = {
    service: {
      ...service,
      technologiesTitle: 'Tools & Technologies We Excel In',
      technologiesDescription: 'A comprehensive suite of enterprise-grade tools, platforms, and intelligent systems carefully selected to drive measurable business transformation and scalable growth.',
      technologies,
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'End-to-End Enterprise Transformation',
      trustPillarsRightDescription: 'Kangqore provides next-generation digital business transformation solutions that help organizations accelerate innovation, enhance operational efficiency, and experience smoother customer interactions. By combining advanced engineering technology and deep strategic advisory, we enable businesses to initiate Agile, Scalable, and Secure digital journeys according to their specific requirements.',
      trustPillarsRightButton: 'Request Consultation',
      whyKangqoreIntro,
      whyKangqore,
      postIndustrySections: customSections,
      ctaTitle: 'Architect Your Digital Future',
      ctaDescription: 'Move from digital intent to measurable business impact. Let’s design your high-velocity enterprise.',
      ctaButtonText: 'Book a Transformation Session'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default DigitalBusinessTransformation;
