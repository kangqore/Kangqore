import React from 'react';
import { 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Cloud, 
  Code, 
  Terminal, 
  TrendingUp, 
  BarChart3, 
  Target,
  Building2, 
  Heart, 
  ShoppingCart, 
  Factory, 
  Plane,
  Film,
  Home,
  RefreshCw,
  Workflow,
  Shield,
  Layout,
  Globe,
  Lightbulb,
  CheckCircle2,
  DollarSign,
  Settings,
  Brain,
  Rocket,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const TechnologyTransformation = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Technology Transformation',
    slug: 'technology-transformation',
    shortDescription: 'TRANSFORM. DON\'T JUST UPGRADE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Technology Transformation That Drives Measurable Advantage</h2>
        <p>Markets are unstable. Technology cycles are compressing. AI is redefining competitive baselines.</p>
        <p>Kangqore transforms enterprises by rebuilding strategy, architecture, and operating models around scalable, AI-native systems.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Start Transformation Assessment', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '200%', label: 'Systemic Volatility', color: 'text-cyan-400' },
      { value: '97%', label: 'Leaders on Tech', color: 'text-blue-400' },
      { value: '21%', label: 'True Integration', color: 'text-emerald-400' },
      { value: '38%', label: 'CXO Disruption Fear', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'GROWTH ENGINEERING :: 2026',
        titleLine1: 'Growth Engineering',
        titleHighlight: 'Through Technology.',
        titleLine2: 'At Enterprise Scale.',
        description: 'Kangqore transforms enterprises by rebuilding strategy, architecture, and operating models around scalable, AI-native systems. We don\'t sell workshops — we engineer transformation.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Static planning, fragmented delivery, and misaligned technology strategy limiting enterprise impact.',
        requirementLabel: 'The Outcome',
        requirementText: 'Platform-driven growth ecosystems powered by data, AI, and composable architectures.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Transformation Engine',
        statusValue: 'ACTIVE'
      },
      philosophy: {
        icon: <Rocket className="w-7 h-7 text-brand-blue" />,
        title: 'Our Approach is',
        titleHighlight: 'Growth Engineering.',
        description: 'Technology must lead business strategy — not follow it. We align business ambition with technical capability to create sustainable competitive advantage.',
        pills: ['Platform-Driven', 'AI-Native', 'Outcome-Linked', 'Governance-First']
      },
      matrix: {
        engineId: 'Framework :: TRANSFORM_V3',
        title: 'Transformation Framework',
        subtext: 'Our structured methodology for rebuilding enterprise strategy, architecture, and operating models.',
        layers: [
          { title: 'Assess', id: 'TF_ASSESS', icon: <Search />, desc: 'Strategic assessment, technology audit, and competitive positioning analysis.' },
          { title: 'Strategize', id: 'TF_STRAT', icon: <Target />, desc: 'Platform-centric business model design and technology investment prioritization.' },
          { title: 'Architect', id: 'TF_ARCH', icon: <Layers />, desc: 'Cloud-native, AI-ready enterprise architecture and data modernization.' },
          { title: 'Execute', id: 'TF_EXEC', icon: <Zap />, desc: 'Agile execution, DevSecOps integration, and value stream alignment.' },
          { title: 'Govern', id: 'TF_GOV', icon: <ShieldCheck />, desc: 'KPI-driven governance, continuous ROI tracking, and capital allocation optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Transform.',
        titleHighlight: 'Don\'t Just Upgrade.',
        description: 'Your transformation journey should fuel undisputed competitive advantage. We engineer the frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Infra Cost', val: '35% LESS' },
          { label: 'Deploy Velocity', val: '40% FASTER' },
          { label: 'Release Cycles', val: '2.5X' }
        ]
      }
    }
  };

  const department = {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    description: 'Transform your business with cutting-edge digital transformation & modernization solutions.'
  };

  // ============================================
  // CUSTOM SECTIONS
  // ============================================

  // Section that appears right after Our Capabilities
  const postCapabilitiesSections = (
    <>
      {/* Why Transformation Can't Wait */}
      <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-y border-gray-100">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
              <AlertTriangle className="w-4 h-4" /> Why Transformation Can't Wait
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              The Market Won't <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Wait For You</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Global markets are shifting faster than traditional organizations can adapt. Kangqore positions you in the prepared category.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '200%', label: 'Increase in systemic volatility', desc: 'Global markets are shifting faster than traditional organizations can adapt.' },
              { value: '97%', label: 'Leaders depend on tech for reinvention', desc: 'Technology is no longer a support function — it defines competitiveness.' },
              { value: '21%', label: 'Truly integrate tech into strategy', desc: 'Most companies experiment. Few architect.' },
              { value: '38%', label: 'CXOs fear AI-led disruption', desc: 'Disruption favors prepared systems, not reactive ones.' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-500 group text-center">
                <div className="text-4xl lg:text-5xl font-bold text-brand-blue mb-3 group-hover:scale-110 transition-transform duration-500 tracking-tighter">
                  {stat.value}
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest mb-3">{stat.label}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const customSections = (
    <>
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              We Don't Sell <span className="text-transparent bg-clip-text bg-brand-gradient italic">Workshops.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              We engineer transformation systems that deliver compounding enterprise value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'AI-Native Architectures', desc: 'Systems designed from the ground up with AI at the core, not bolted on as an afterthought.' },
              { icon: Target, title: 'Outcome-Linked Modernization', desc: 'Every transformation initiative is tied to measurable business KPIs and value realization.' },
              { icon: Rocket, title: 'Execution-Led Transformation', desc: 'We don\'t just advise — we architect and build scalable systems alongside your teams.' },
              { icon: TrendingUp, title: 'Measurable ROI Systems', desc: 'KPI-driven governance with continuous tracking, milestone management, and capital optimization.' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-500 group">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-gradient transition-all duration-300">
                  <item.icon className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Impact Snapshot */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-gray-100 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-xl shadow-gray-100/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
            
            <div className="relative z-10 text-center">
              <div className="font-mono text-[11px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Transformation Impact</div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[0.95] font-display mb-12">
                Proof, Not <span className="text-transparent bg-clip-text bg-brand-gradient italic">Promises.</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '35%', label: 'Infrastructure Cost Reduction', sub: 'Optimized spend' },
                  { value: '40%', label: 'Deployment Velocity', sub: 'Faster releases' },
                  { value: '2.5x', label: 'Release Cycle Improvement', sub: 'Product acceleration' },
                  { value: '100%', label: 'AI-Led Automation', sub: 'Core workflows' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 group-hover:text-brand-blue transition-all tracking-tighter duration-500">
                      {stat.value}
                    </div>
                    <div className="font-bold text-brand-blue text-xs uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-[11px] text-gray-500 font-mono italic">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // ============================================
  // CAPABILITIES (7 Service Cards)
  // ============================================
  const capabilities = [
    {
      title: 'Technology-Led Growth Strategy',
      bgImage: '/images/capabilities/software-engineering.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/growth-strategy',
      description: 'Rebuild business strategy with technology at the core. We help organizations shift from static planning to platform-driven growth models powered by data, AI, and scalable digital capabilities.',
      items: [
        'Platform-centric business models',
        'Digital product strategy',
        'Data-led competitive positioning',
        'Technology investment alignment'
      ]
    },
    {
      title: 'Tech Value & Cost Optimization',
      bgImage: '/images/capabilities/software-engineering.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/value-optimization',
      description: 'Turn technology spend into measurable business value. We create transparency across IT investments, reduce technical debt, and shift capital from maintenance-heavy systems to innovation-led initiatives.',
      items: [
        'Spend visibility & cost intelligence',
        'Portfolio rationalization',
        'Technical debt reduction',
        'ROI-linked governance frameworks'
      ]
    },
    {
      title: 'Digital Core & Enterprise Architecture',
      bgImage: '/images/capabilities/software-engineering.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/digital-core',
      description: 'Modern architecture is the foundation of speed, scale, and resilience. We design AI-ready, cloud-native enterprise architectures that support continuous innovation.',
      items: [
        'Cloud-native infrastructure design',
        'API-led ecosystems',
        'Data architecture modernization',
        'AI-ready system integration'
      ]
    },
    {
      title: 'Operating Model Reinvention',
      bgImage: '/images/capabilities/ai-cognitive.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/operating-model',
      description: 'Technology transformation fails without structural alignment. We redesign operating models to support agile execution, DevSecOps maturity, and data-driven decision systems.',
      items: [
        'Agile & product-based operating models',
        'DevSecOps transformation',
        'Cross-functional value stream alignment',
        'AI-enabled workflow redesign'
      ]
    },
    {
      title: 'Transformation Governance & Value Management',
      bgImage: '/images/capabilities/digital-transformation.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/governance',
      description: 'Transformation must be measurable. We establish execution discipline through KPI-driven governance, milestone tracking, and value realization frameworks.',
      items: [
        'Enterprise transformation office setup',
        'Program & portfolio governance',
        'Continuous ROI tracking',
        'Capital allocation optimization'
      ]
    },
    {
      title: 'Cloud Strategy & Platform Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/cloud-platform',
      description: 'Cloud is not migration — it\'s reinvention. We design scalable, secure, and cost-efficient cloud architectures that enable performance and flexibility.',
      items: [
        'Multi-cloud architecture strategy',
        'Infrastructure automation',
        'FinOps & cost optimization',
        'Platform modernization'
      ]
    },
    {
      title: 'AI Strategy & Enterprise Embedding',
      bgImage: '/images/capabilities/ai-cognitive.png',
      detailLink: '/services/digital-transformation-modernization/technology-transformation/ai-strategy',
      description: 'Move beyond experimentation to operational AI. We embed AI across enterprise workflows, products, and decision systems to create sustainable competitive advantage.',
      items: [
        'Generative AI integration',
        'Intelligent automation',
        'AI governance frameworks',
        'Continuous improvement systems'
      ]
    }
  ];

  // ============================================
  // TRUST PILLARS CAROUSEL
  // ============================================
  const trustPillars = [
    {
      title: 'AI-Native Architecture Design',
      tag: 'Architecture',
      description: 'We design enterprise architectures with AI embedded at the core — not bolted on as an afterthought. Our systems are built for composability, scalability, and intelligent automation from day one, enabling organizations to leverage AI across every workflow and decision point.'
    },
    {
      title: 'Outcome-Linked Delivery',
      tag: 'Governance',
      description: 'Every transformation initiative at Kangqore is tied to measurable business outcomes. We don\'t measure success by deliverables shipped — we measure it by KPIs moved, costs reduced, and revenue unlocked. Our governance frameworks ensure continuous value realization.'
    },
    {
      title: 'Execution-Led Engineering',
      tag: 'Engineering',
      description: 'We don\'t stop at strategy decks and advisory reports. Kangqore engineers build, deploy, and scale transformation systems alongside your teams. Our execution-first culture ensures that architectural vision translates into production-grade systems.'
    },
    {
      title: 'Platform-Driven Growth',
      tag: 'Strategy',
      description: 'Organizations that treat technology as infrastructure struggle to scale. We help enterprises shift from cost-centric IT models to platform-driven growth ecosystems — powered by data, AI, and composable architectures that create sustainable competitive advantage.'
    }
  ];

  // ============================================
  // TECH STACK (Categorized)
  // ============================================
  const technologies = [
    { category: 'Cloud & Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform'] },
    { category: 'Frameworks & Languages', items: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'Go', '.Net Core'] },
    { category: 'DevOps & Tooling', items: ['GitHub Actions', 'Jenkins', 'Ansible', 'Prometheus', 'Grafana', 'ArgoCD'] },
    { category: 'AI & Data', items: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face', 'MongoDB', 'PostgreSQL', 'Redis'] }
  ];

  // ============================================
  // WHY KANGQORE
  // ============================================
  const whyKangqoreIntro = "We don't sell workshops. We engineer AI-native architectures, outcome-linked modernization, execution-led transformation, and measurable ROI systems. Kangqore is built for enterprises that demand results, not reports.";
  const whyKangqore = [
    { title: 'Engineers-First Culture', icon: Terminal, description: 'Deep technical thinking is in our DNA. We solve complex architectural problems, not just tickets.' },
    { title: 'Architecture-First', icon: Layers, description: 'We never code without a robust, governed architectural foundation designed for your specific scale.' },
    { title: 'AI-Native Approach', icon: Cpu, description: 'We embed AI across enterprise workflows, products, and decision systems — not as a feature, but as a foundation.' },
    { title: 'Governance Baked-In', icon: ShieldCheck, description: 'Compliance, security, and observability are core requirements, not afterthoughts.' },
    { title: 'ROI Focus', icon: TrendingUp, description: 'Every transformation wave is measured against deployment velocity, cost, and quality metrics.' },
    { title: 'Strategic Partnerships', icon: Globe, description: 'Multi-cloud ecosystem partnerships, enterprise SaaS alliances, and AI & data ecosystem collaborators.' }
  ];

  // ============================================
  // INDUSTRIES
  // ============================================
  const industryTitle = 'Enterprise Transformation Across Industries';
  const industryIntro = 'Kangqore brings deep domain knowledge to deliver technology transformation solutions tailored to industry-specific challenges and regulatory requirements.';
  const industries = [
    { name: 'Banking & Financial Services', icon: Building2, description: 'Core banking modernization, real-time payment systems, and regulatory compliance automation.' },
    { name: 'Healthcare & Life Sciences', icon: Heart, description: 'Clinical data platforms, EHR modernization, and AI-powered diagnostic systems.' },
    { name: 'Retail & Consumer Goods', icon: ShoppingCart, description: 'Omnichannel platforms, supply chain intelligence, and personalized customer experiences.' },
    { name: 'Manufacturing', icon: Factory, description: 'Smart factory systems, IoT integration, and predictive maintenance platforms.' },
    { name: 'Media & Technology', icon: Film, description: 'Content delivery platforms, streaming infrastructure, and data monetization.' },
    { name: 'Travel & Hospitality', icon: Plane, description: 'Booking platform modernization, dynamic pricing engines, and guest experience systems.' }
  ];

  // ============================================
  // FAQs
  // ============================================
  const customFAQs = [
    {
      question: 'What makes Kangqore\'s approach to technology transformation different?',
      answer: 'We don\'t advise from the sidelines. Kangqore engineers work alongside your teams to architect, build, and deploy transformation systems. Every initiative is tied to measurable business outcomes — not just deliverables. Our approach combines AI-native architecture design with execution-led engineering and KPI-driven governance.'
    },
    {
      question: 'How long does a typical technology transformation engagement take?',
      answer: 'A strategic assessment typically takes 4-6 weeks. Full transformation programs are phased over 6-18 months depending on scope, with measurable ROI delivered within the first 90 days. We define clear milestones and track value realization continuously.'
    },
    {
      question: 'How do you handle the risk of large-scale transformation?',
      answer: 'Risk mitigation is built into our methodology. We use phased execution with controlled migration waves, parallel environments, and continuous monitoring. Our governance framework includes milestone tracking, value gates, and rollback protocols to ensure business continuity.'
    },
    {
      question: 'How does AI fit into your transformation approach?',
      answer: 'AI is not a bolt-on feature — it\'s embedded into every layer of our framework. From AI-powered technical debt mapping to intelligent automation and generative AI integration, we help enterprises move beyond experimentation to operational AI that drives sustainable competitive advantage.'
    },
    {
      question: 'What industries do you serve?',
      answer: 'We serve enterprises across Banking, Healthcare, Retail, Manufacturing, Media & Technology, Travel & Hospitality, Energy, and more. Our industry-specific expertise ensures solutions are tailored to your sector\'s unique regulatory, operational, and competitive requirements.'
    }
  ];

  // ============================================
  // ASSEMBLE PAGE DATA
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      postCapabilitiesSections,
      trustPillars,
      trustPillarsRightTitle: 'Empowering Enterprise Transformation With Engineered Capabilities',
      trustPillarsRightDescription: 'Kangqore combines deep engineering expertise with AI-native thinking to deliver transformation systems that create lasting competitive advantage. Our approach goes beyond advisory — we build, deploy, and scale.',
      trustPillarsRightButton: 'Request Consultation',
      whyKangqoreIntro,
      whyKangqore,
      industryTitle,
      industryIntro,
      industries,
      customFAQs,
      postIndustrySections: customSections,
      ctaTitle: 'Transform. Don\'t Just Upgrade.',
      ctaDescription: 'Let\'s engineer your next technology chapter together. Strategy, architecture, and execution — aligned for measurable advantage.',
      ctaButtonText: 'Start Transformation Assessment'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default TechnologyTransformation;
