import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  Database, 
  Layers, 
  Zap, 
  Workflow, 
  RefreshCw, 
  Activity, 
  Search, 
  ShieldCheck, 
  Globe, 
  LineChart, 
  Box, 
  Cpu, 
  Eye, 
  Lock,
  ArrowRight,
  ChevronRight,
  Download,
  MessageSquare,
  BrainCircuit,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BigData = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Big Data',
    slug: 'big-data',
    shortDescription: 'DATA. SCALE. INTELLIGENCE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Build Scalable Data Foundations That Power Intelligent Enterprises</h2>
        <p>Design, modernize, and operationalize enterprise-grade data ecosystems that enable real-time intelligence, advanced analytics, and AI-driven growth.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true, // Enabled for MNC-grade wide layout
    keyFeatures: [
      'Enterprise Data Warehouse Optimization',
      'Data Lakes & Lakehouse Architecture',
      'Real-Time Stream Processing',
      'Automated RDBMS to NoSQL Migration',
      'Hadoop Ecosystem Modernization'
    ],
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    stats: [
      { value: 'PB+', label: 'Data Managed', color: 'text-cyan-400' },
      { value: 'Real-time', label: 'Processing', color: 'text-blue-400' },
      { value: 'Zero', label: 'Migration Errors', color: 'text-emerald-400' },
      { value: '99.9%', label: 'Uptime', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'Market Disruption :: 2026',
        titleLine1: 'The Data',
        titleHighlight: 'Explosion',
        titleLine2: 'is Real.',
        description: 'Modern enterprises are generating unimaginable volumes of data. Most are not just unready — they are operationally paralyzed by the sheer scale of fragmented information.',
        bottleneckLabel: 'The Bottleneck',
        bottleneckText: 'Incoherent cloud platforms & fragmented legacy systems.',
        requirementLabel: 'The Consequence',
        requirementText: 'Reactive scaling & skyrocketing architectural debt.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Latency Check',
        statusValue: '4ms_Target'
      },
      philosophy: {
        icon: <Database className="w-7 h-7 text-brand-blue" />,
        title: 'Big Data',
        titleHighlight: 'Logic-First.',
        description: 'We architect ecosystems that prioritize relevance and governance over simple collection — turning reactive datasets into proactive strategic assets.',
        pills: ['Enterprise ROI', 'Hardened Security', 'Reactive Autonomy', 'Zero Data Debt']
      },
      matrix: {
        engineId: 'Engine :: Kang_V4',
        title: 'Enablement Matrix',
        subtext: 'Comprehensive deconstruction of the enterprise data lifecycle into modular, governed intelligence layers.',
        layers: [
          { title: 'Acquisition', id: 'AQ_STRAT', icon: <RefreshCw />, desc: 'Intelligent multi-modal data capture pipelines.' },
          { title: 'Unification', id: 'UN_CORE', icon: <Layers />, desc: 'Semantic deconstruction of distributed silos.' },
          { title: 'Processing', id: 'PR_ENGINE', icon: <Cpu />, desc: 'AI-native streaming and transformation modules.' },
          { title: 'Assurance', id: 'AS_HARD', icon: <ShieldCheck />, desc: 'End-to-end provenance and governance fabric.' }
        ]
      },
      schematic: {
        titleLine1: 'Accelerate',
        titleHighlight: 'Everything.',
        description: 'Your data should not overwhelm your systems. It should be the fuel for undisputed competitive advantage.',
        stats: [
          { label: 'Latency', val: 'ZERO' },
          { label: 'ROI', val: 'EXPONENTIAL' },
          { label: 'Security', val: 'ABSOLUTE' }
        ]
      }
    }
  };

  const department = {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Transform your data into a strategic advantage with scalable engineering.'
  };

  // Technologies (categorised lookup)
  const technologies = [
    {
      category: 'Data Processing',
      items: ['Apache Hadoop', 'Apache Spark', 'Kafka', 'Flink', 'Presto', 'Hive']
    },
    {
      category: 'Databases',
      items: ['MongoDB', 'PostgreSQL', 'Snowflake', 'BigQuery', 'Cassandra', 'Redis']
    },
    {
      category: 'Cloud Platforms',
      items: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'IBM Cloud']
    },
    {
      category: 'Orchestration & Governance',
      items: ['Airflow', 'dbt', 'Data Catalog Tools', 'Data Governance Frameworks', 'Purview']
    }
  ];

  // Capabilities (Implementing verbose descriptions and bullet points for 1:1 visibility)
  const capabilities = [
    {
      title: 'EDW Optimization',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Equip your Enterprise Data Warehouse to tackle the growing demands of big data. Build a central data repository that unifies heterogeneous sources, maintains data quality, and gives you access to the information you need – when you need it. Kangqore EDW Optimization offering helps you with:',
      items: [
        'Modernization of legacy warehouses',
        'ELT / Offload Architecture',
        'Data Archiving Solutions',
        'Datastore, Governance & Security Management',
        'Self Service BI / Discovery Enablement'
      ]
    },
    {
      title: 'Lakehouse Architecture',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Define, design, and develop the capabilities of dealing with data of any size, shape, and speed. Empower your developers, data scientists and analysts with the right tools to leverage quintillions of bytes of data. Kangqore Data Lakes/Lakehouse offering helps you with:',
      items: [
        'Strategy & Roadmap Development',
        'Prototyping & Tool Evaluation',
        'Data Integration, Access & Services',
        'Scalable Storage & Processing Architecture',
        'Construction & Go-Live Enablement'
      ]
    },
    {
      title: 'Stream & Real-Time',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Redefine real-time processing with Kangqore Stream Analytics offering. Garner insights from data streams generating from disparate sources as and when the event occurs. We implement cutting-edge solutions that help you with:',
      items: [
        'Real-time Data Ingestion',
        'Scalable Data Processing & Storage',
        'Event-driven Architecture & Flow',
        'Dashboards, Alerting & Monitoring Systems'
      ]
    },
    {
      title: 'Migration & Integration',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Platform consolidation and large-scale data absorption across multi-source environments. We ensure seamless transitions and data integrity during complex enterprise transformation initiatives.',
      items: [
        'Large-scale data absorption & ingestion',
        'Platform consolidation & unification',
        'Multi-source integration frameworks',
        'Structured & unstructured data handling'
      ]
    },
    {
      title: 'Hadoop-Based Platforms',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Leverage the power of distributed processing for cost-effective enterprise storage and high-concurrency analysis. We modernize Hadoop ecosystems for active archiving and scalable compute.',
      items: [
        'Hadoop as Enterprise Data Warehouse',
        'Hadoop as Active Archive Solution',
        'Large-scale concurrent processing',
        'Cost-effective long-term storage & retrieval'
      ]
    },
    {
      title: 'RDBMS to NoSQL (R2M)',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Automated conversion of legacy relational data into modern document-based schemas for high performance. Reduce manual migration errors and optimize for cloud-native speed.',
      items: [
        'Automated schema conversion & mapping',
        'Replication & integrity validation',
        'Performance optimization for NoSQL',
        'Reduced manual migration overhead'
      ]
    },
    {
      title: 'Managed Data Services',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Reliable 24/7 managed support for data platforms, ensuring continuous uptime, performance tuning, and ongoing governance for your intelligence ecosystem.',
      items: [
        'Platform monitoring & health checks',
        'Continuous performance optimization',
        'Ongoing governance & compliance',
        'Managed analytics operations'
      ]
    }
  ];

  // Side carousel / Trust Pillars (6 sliding cards)
  const trustPillars = [
    {
      title: 'Data Migration & Integration Services',
      tag: 'Absorption',
      description: 'Unified pipelines to absorb massive datasets from silos into a cohesive, governed data ecosystem. Learn More →'
    },
    {
      title: 'Managed Big Data Services',
      tag: 'Operations',
      description: 'Reliable 24/7 managed support for data platforms, ensuring continuous uptime and performance tuning. Learn More →'
    },
    {
      title: 'Data Analysis Platform',
      tag: 'Intelligence',
      description: 'Self-service analytics hubs that allow business users to discover insights without technical overhead. Learn More →'
    },
    {
      title: 'Hadoop Data Warehouse',
      tag: 'Scalability',
      description: 'High-concurrency data warehousing solutions built on distributed processing frameworks for enterprise scale. Learn More →'
    },
    {
      title: 'Hadoop Active Archive',
      tag: 'Cost Optimization',
      description: 'Move cold data to cost-effective storage while keeping it queryable and accessible for historical analysis. Learn More →'
    },
    {
      title: 'RDBMS to NoSQL Migration',
      tag: 'Modernization',
      description: 'Automated conversion of legacy relational data into modern document-based schemas for high performance. Learn More →'
    }
  ];

  // Custom Full-Width Section (Related Offerings)
  const customSections = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      {/* Background Micro-details */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left Side: Content & List */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Portfolio Ecosystem
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Related Analytics <span className="text-transparent bg-clip-text bg-brand-gradient">Offerings</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Accelerate your data journey by combining Big Data engineering with our broader portfolio of intelligence services.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'AI & Cognitive Computing', 
                  link: '/services/ai-cognitive/agentic-ai',
                  icon: <BrainCircuit className="w-5 h-5" />,
                  desc: 'Autonomous systems and agentic intelligence.'
                },
                { 
                  name: 'Business Intelligence & Data Warehouse', 
                  link: '/services/analytics-insights/analytics',
                  icon: <BarChart3 className="w-5 h-5" />,
                  desc: 'Modern EDW and descriptive analytics.'
                },
                { 
                  name: 'Data Science', 
                  link: '/services/analytics-insights/data-science',
                  icon: <LineChart className="w-5 h-5" />,
                  desc: 'Predictive modeling and statistical analysis.'
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
                Explore Services 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // CONNECTING_ECOSYSTEM...
              </div>
            </div>
          </div>

          {/* Right Side: Technical Schematic Graphic (Premium Level) */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              {/* Background Orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              
              {/* Radial Grid */}
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              {/* Technical Annotations (Micro-labels) */}
              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_BD_01</span></div>
                <div className="flex justify-between gap-4"><span>SCALE:</span> <span>PB_LEVEL</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">OPTIMIZED</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Core System</div>
                <div>SECURE_TUNNEL_ENABLED</div>
                <div>LATENCY: 4MS</div>
              </div>

              {/* Central Core (Data Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Database className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                {/* Floating Micro-nodes inside central hub */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters */}
              {/* Top: AI Ecosystem */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <BrainCircuit className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Intelligence</span>
                </div>
              </div>

              {/* Left: Analytics Dash */}
              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <BarChart3 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">99%</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Visualization</span>
                </div>
              </div>

              {/* Right: Data Science */}
              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <LineChart className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Prediction</span>
                </div>
              </div>

              {/* Data Flow SVG (Super Technical) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                
                {/* Main Connection Lines with Flowing Dots */}
                {/* Center to Top */}
                <path d="M250,250 L250,140" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-flow" fill="none" />
                <circle r="4" fill="#2564ea">
                  <animateMotion path="M250,250 L250,140" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Center to Left */}
                <path d="M250,250 L140,380" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-flow" fill="none" />
                <circle r="4" fill="#22d3ee">
                  <animateMotion path="M250,250 L140,380" dur="4s" repeatCount="indefinite" />
                </circle>

                {/* Center to Right */}
                <path d="M250,250 L360,380" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-flow" fill="none" />
                <circle r="4" fill="#10b981">
                  <animateMotion path="M250,250 L360,380" dur="5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Why Kangqore Content
  const whyKangqoreIntro = `We don’t just implement tools. We build future-ready data platforms that solve architectural complexity and drive measurable growth.`;

  const whyKangqore = [
    { title: 'AI-native architecture', description: 'Data platforms built with embedded intelligence for next-gen AI applications.' },
    { title: 'Enterprise-grade governance', description: 'End-to-end security and compliance integrated directly into the pipeline.' },
    { title: 'Scalable cloud-first infrastructure', description: 'Native multi-cloud and hybrid architectures that grow with your enterprise.' },
    { title: 'Performance-optimized engineering', description: 'Eliminating bottlenecks to ensure lightning-fast processing at extreme scale.' },
    { title: 'Strategic technology partnerships', description: 'Leveraging top-tier relationships with Snowflake, Databricks, and Cloud giants.' },
    { title: 'Outcomes-focused delivery', description: 'Engineering defined by business impact, not just storage volume.' }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'End-to-End Data Transformation Solutions',
      trustPillarsRightDescription: 'We design scalable, secure, and agile data ecosystems that accelerate innovation, improve operational efficiency, and enable smooth customer experiences tailored to your digital transformation journey.',
      trustPillarsRightButton: 'Request a Consultation',
      whyKangqoreIntro,
      whyKangqore,
      postIndustrySections: customSections,
      ctaTitle: 'Turn Data Chaos Into Competitive Advantage',
      ctaDescription: 'Let’s design your next-generation data platform.',
      ctaButtonText: 'Schedule a Strategy Call'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default BigData;
