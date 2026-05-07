import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Layout,
  RefreshCw,
  Box,
  Database,
  Workflow,
  Smartphone,
  Shield,
  Eye,
  Lock,
  Cpu,
  TrendingUp,
  Target,
  Users,
  PieChart,
  Network,
  Cloud,
  ChevronRight
} from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const DigitalTransformation = () => {
  // ============================================
  // SERVICE INFORMATION
  // Edit below to customize this service page
  // ============================================
  
  const service = {
    name: 'Digital Transformation',
    slug: 'digital-transformation',
    shortDescription: 'STRATEGIZE. EXECUTE. SCALE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Digital Transformation That Moves the Needle</h2>
        <p>Transformation is no longer optional. It is the operating model of modern enterprises. Kangqore partners with organizations to re-architect systems, processes, and experiences — driving measurable business impact through AI, cloud, automation, and platform modernization.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    primaryButton: { text: 'Request Transformation Assessment', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    highFidelity: {
      narrative: {
        badge: 'ENTERPRISE VELOCITY :: 2026',
        titleLine1: 'Digital',
        titleHighlight: 'Transformation',
        titleLine2: 'That Moves the Needle.',
        description: 'Transformation is no longer optional. It is the operating model of modern enterprises. Kangqore partners with organizations to re-architect systems, processes, and experiences — driving measurable business impact through AI, cloud, automation, and platform modernization.',
        bottleneckLabel: 'The Constraint',
        bottleneckText: 'Legacy silos & fragmented delivery.',
        requirementLabel: 'The Mandate',
        requirementText: 'Outcome-driven digital capital at scale.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Operating Model',
        statusValue: 'AI_FIRST'
      },
      philosophy: {
        icon: <TrendingUp className="w-7 h-7 text-brand-blue" />,
        title: 'Strategic',
        titleHighlight: 'Resilience.',
        description: 'We go beyond modernization to unlock digital capital, transforming complexity into capability through an AI-native transformation framework.',
        pills: ['Platform-Centric', 'AI-Driven', 'Experience-Led', 'Scalable']
      },
      matrix: {
        engineId: 'Engine :: KQ_Delivery_V1',
        title: 'The Kangqore Delivery Approach',
        subtext: 'A structured, insight-led way to take initiatives from strategy to measurable outcomes.',
        layers: [
          { title: 'WHY', id: 'KQ_OUTCOMES', icon: <Target />, desc: 'Outcomes First: Revenue growth, Margin improvement, Cost reduction, Risk reduction.' },
          { title: 'WHAT', id: 'KQ_VALUE', icon: <PieChart />, desc: 'Value Streams: Customer experience, Operations, Data/AI, Platforms, Security.' },
          { title: 'HOW', id: 'KQ_EXECUTION', icon: <Workflow />, desc: 'Engineering Execution: Product engineering, Cloud/DevOps, DevSecOps, QA automation, Observability.' },
          { title: 'RESULT', id: 'KQ_IMPACT', icon: <Zap />, desc: 'Measurable Impact: Faster releases, Lower incidents, Better UX, Lower TCO, Stronger security posture.' }
        ]
      },
      schematic: {
        titleLine1: 'From Legacy.',
        titleHighlight: 'To Leverage.',
        description: 'Digital transformation is the catalyst for global digital dominance. We engineer the delivery frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Impact', val: 'EXPONENTIAL' },
          { label: 'Adaptation', val: 'REAL-TIME' },
          { label: 'Capital', val: 'UNLOCKED' }
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
  // CUSTOM CONTENT SECTIONS
  // Add or modify content below as needed
  // ============================================

  // Additional service details (optional)
  const additionalInfo = {
    overview: `With deep expertise in digital transformation & modernization, we deliver digital transformation solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.`,
    
    // You can add custom benefits here
    benefits: [
      'Accelerated time to value',
      'Reduced operational costs',
      'Improved efficiency and productivity',
      'Scalable solutions that grow with your business'
    ],
    
    // Add specific use cases or success stories
    useCases: [
      'Enterprise-scale implementations',
      'Digital transformation initiatives',
      'Legacy system modernization',
      'Cloud migration and optimization'
    ]
  };

  // Technologies and tools (customize as needed)
  const technologies = [
    { category: 'Strategic AI', items: ['GenAI Strategy', 'Agentic Workflows', 'AI Governance', 'Decision Intelligence', 'MLOps'] },
    { category: 'Transformation Enablers', items: ['Cloud-Native Architecture', 'Platform Engineering', 'API-First Design', 'DevSecOps', 'Microservices'] },
    { category: 'Data & Analytics', items: ['Enterprise Data Fabric', 'Real-time Analytics', 'Predictive Modeling', 'Data Governance', 'Lakehouse'] },
    { category: 'Automation & Integration', items: ['RPA', 'iPaaS', 'Low-Code / No-Code', 'Workflow Orchestration', 'Event-Driven Architecture'] },
    { category: 'Experience & Channels', items: ['Headless CMS', 'Progressive Web Apps', 'Mobile-First', 'Omnichannel Platforms', 'UX Design Systems'] },
    { category: 'Security & Compliance', items: ['Zero Trust Architecture', 'IAM / RBAC', 'SIEM / SOAR', 'GRC Automation', 'Cloud Security Posture'] }
  ];

  const capabilities = [
    {
      title: 'Digital Insights',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Digital insights driven business models are the truth of the customer-centric economy. However, identifying the possibilities hidden away in the tremendous amount of data is becoming increasingly difficult for organizations. As traditional analytical methods become obsolete, businesses need to reinvent the way they utilize data to glean actionable insights.',
      items: [
        'Leverage cutting-edge data analytics solutions',
        'Derive near real-time actionable insights',
        'Discover innovative solutions to business problems',
        'Drive informed decision making'
      ]
    },
    {
      title: 'Rapid Innovation',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Developing for competitive differentiation requires more than just an innovative idea, it requires organizations to deliver fast and deliver smart. Competitive advantage lies in the ability to bring ideas to life at the speed of light, gather and incorporate feedback, and accelerate time to market to morph into the next-gen of delivery ecosystem.',
      items: [
        'Inspire ingenuity by hyper accelerating idea-to-prototype process.',
        'Share vision and opportunities for digital transformation with all the stakeholders.',
        'Garner quick feedback, adapt, build, test, and deploy solutions.',
        'Identify the best-of-breed concepts and deliver them with speed.'
      ]
    },
    {
      title: 'Digital Experience',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Market dynamics are shifting at unprecedented rates, forcing organizations to respond to change with equal urgency. Technology has become central to digital businesses blurring the digital and physical worlds and enabling dynamic and complex interaction of people, businesses, and intelligent "things".',
      items: [
        'Create digitally enhanced omnichannel experiences.',
        'Amplify customer understanding using capabilities like IoT, analytics, and mobility.',
        'Define path-to-purchase customer journey from awareness to decision.',
        'Customize offerings using predictive analytics and recommendation engines.',
        'Optimize and enhance interactions throughout the customer lifecycle.',
        'Leverage Mindful Thinking approach to enhance efficiency and deliver Digital Capital faster.'
      ]
    },
    {
      title: 'AI-Enabled Modernization',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Our Digital Enabled Application Services aim to empower organizations across the entire application life cycle. From design to building and managing the applications, our experts work with our clients to facilitate application-centric transformation. We enable organizations to:',
      items: [
        'Redesign enterprise architecture to accelerate digital capital creation.',
        'Transform enterprise content management strategy to deliver highly contextual experiences.',
        'Enhance omnichannel capabilities by leveraging latest technologies.',
        'Design purpose built applications to resolve unique business problems.',
        'Manage high volume inventory to ensure accurate and up-to-date product information.',
        'Embrace open source technologies to create new, reliable, robust, scalable, and economical applications faster.'
      ]
    },
    {
      title: 'Legacy Transformation',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'One of the biggest challenges for CIOs today is to ensure technology and business process evolution are in sync and systems, people, and processes are future ready. Modernization delivers competitive advantages of agile business processes based on new technologies and architecture. It also helps mitigate risks and reduces the cost of ownership. We empower organizations to:',
      items: [
        'Reengineer business processes and accelerate development cycle by enabling innovation.',
        'Tap in to the resource base of modern skill sets.',
        'Drive higher ROI by improving business and operational efficiency.',
        'Overcome application design limitations and support new business requirements.',
        'Build an easy to adopt, low cost, secure, and scalable solution.'
      ]
    },
    {
      title: 'Enterprise Platforms',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Digital Platforms empower organizations with information and interactions to hyper accelerate value creation. Our unique IPs leverage emerging technologies like augmented intelligence, robotic process automation, big data analytics, internet of things and augmented reality enabling companies to become customer centric, frugal & insight driven. We build innovation systems through a process of Mindful Thinking to help our clients:',
      items: [
        'Focus on consistent & intuitive experiences: Link every journey, no isolations.',
        'Built to adapt and scale: Take ‘one’ to ‘millions’.',
        'Deliver with speed: Fast to market, key to winning the market.',
        'Place users at the center of everything: And yet, treat every customer as ‘one’.'
      ]
    }
  ];

  const solutions = [
    { 
      title: 'AI Contact Center Modernization', 
      description: 'Transform customer support with agentic AI that automates complex resolutions and delivers hyper-personalized experiences.' 
    },
    { 
      title: 'Intelligent Customer Onboarding', 
      description: 'Streamline onboarding processes with AI-driven validation, identity checks, and automated workflow orchestration.' 
    },
    { 
      title: 'Enterprise Data Platform (EDP)', 
      description: 'A unified, AI-native data fabric that breaks silos and provides real-time insights across the entire organization.' 
    },
    { 
      title: 'AI-Powered Proximity & Retail Intelligence', 
      description: 'Leverage computer vision and spatial AI to optimize retail operations and enhance in-store customer engagement.' 
    },
    { 
      title: 'Digital Content & Workflow Orchestration', 
      description: 'Automate content lifecycles and enterprise workflows with intelligent agents that ensure consistency and speed.' 
    }
  ];

  // Custom FAQs for this service
  const customFAQs = [
    {
      question: `What is Digital Transformation and how can it benefit my organization?`,
      answer: `Digital Transformation helps organizations end-to-end digital transformation strategy and execution. By implementing digital transformation, you can improve efficiency, reduce costs, and gain competitive advantage.`
    },
    {
      question: `How long does a typical digital transformation project take?`,
      answer: `Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.`
    },
    {
      question: `What industries do you serve for digital transformation?`,
      answer: `We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements.`
    },
    {
      question: 'How do you ensure successful delivery?',
      answer: 'We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.'
    },
    {
      question: 'What post-implementation support do you offer?',
      answer: 'We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.'
    }
  ];

  // ============================================
  // WHY KANGQORE (Fully Editable)
  // Customize the reasons to choose Kangqore
  // ============================================
  
  const whyKangqore = [
    { 
      title: 'Strategic Consulting Discipline', 
      description: `We combine the rigor of elite management consulting with the execution depth of a modern engineering firm.`,
      icon: Target
    },
    { 
      title: 'AI-Native Architecture Expertise', 
      description: 'We don’t just bolt on AI — we build from an AI-first perspective, ensuring systems are ready for agentic autonomy.',
      icon: Cpu
    },
    { 
      title: 'Cloud-First Infrastructure', 
      description: 'Scalable, secure, and resilient infrastructure tailored for global enterprise delivery.',
      icon: Cloud
    },
    { 
      title: 'Security-by-Design Governance', 
      description: 'Identity-first security and compliance embedded into every stage of the transformation lifecycle.',
      icon: Shield
    },
    { 
      title: 'Continuous Innovation', 
      description: 'Accelerate idea-to-market cycles through structured experimentation and AI modeling.',
      icon: Zap
    },
    { 
      title: 'Measured ROI & Outcomes', 
      description: 'Sustainable digital capital tracked through granular KPIs and enterprise-grade reporting.',
      icon: PieChart
    }
  ];

  // ============================================
  // INDUSTRY EXPERTISE (Fully Editable)
  // Customize the industries you serve
  // ============================================
  
  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Manufacturing' },
    { name: 'Technology' },
    { name: 'Professional Services' },
    { name: 'Telecommunications' },
    { name: 'Energy & Utilities' },
    { name: 'Education' },
    { name: 'Government' },
    { name: 'Transportation & Logistics' },
    { name: 'Media & Entertainment' }
  ];

  // Custom 3D Animation Styles
  const animationStyles = `
    @keyframes portal-pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.5; }
    }
    @keyframes orbit-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes counter-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
    @keyframes float-3d {
      0%, 100% { transform: translateZ(20px) translateY(0); }
      50% { transform: translateZ(50px) translateY(-10px); }
    }
    .perspective-2000 { perspective: 2000px; }
    .preserve-3d { transform-style: preserve-3d; }
    .animate-portal { animation: portal-pulse 4s ease-in-out infinite; }
    .animate-orbit { animation: orbit-slow 20s linear infinite; }
    .animate-counter-rotate { animation: counter-rotate 20s linear infinite; }
    .animate-float-3d { animation: float-3d 6s ease-in-out infinite; }
  `;

  const customSections = (
    <>
      {/* Strategic Context: The Mandate Has Shifted */}
      <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-t border-gray-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-blue-100">
                Strategic Mandate
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display">
                The Mandate Has <span className="text-transparent bg-clip-text bg-brand-gradient italic">Shifted</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Markets have moved from product-centric to platform-centric — and now to experience-centric. Legacy systems and siloed data prevent organizations from moving at digital speed.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {[
                  'Operate in real-time',
                  'Deliver hyper-personalized experiences',
                  'Scale without proportional cost',
                  'Leverage data as a strategic asset',
                  'Integrate AI across core operations'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-blue flex-shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-3xl border border-gray-100 italic text-gray-600 dark:text-gray-400 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient"></div>
                "Kangqore transforms complexity into capability, unlocking digital capital that goes beyond mere modernization."
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Enterprise Digital Transformation" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold opacity-60 tracking-widest uppercase">Global Operations</div>
                      <div className="text-lg font-bold">Real-time Enterprise Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Kangqore Delivery Approach */}
      <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 overflow-hidden relative border-t border-gray-100">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              The Kangqore <span className="text-transparent bg-clip-text bg-brand-gradient">Delivery Approach</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A structured, insight-led way to take initiatives from strategy to measurable outcomes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'WHY — Outcomes First',
                icon: <Target className="w-8 h-8" />,
                items: ['Revenue growth', 'Margin improvement', 'Cost reduction', 'Risk reduction'],
                color: 'text-blue-600',
                bg: 'bg-blue-50'
              },
              {
                title: 'WHAT — Value Streams',
                icon: <PieChart className="w-8 h-8" />,
                items: ['Customer experience', 'Operations', 'Data/AI', 'Platforms', 'Security'],
                color: 'text-purple-600',
                bg: 'bg-purple-50'
              },
              {
                title: 'HOW — Engineering Execution',
                icon: <Workflow className="w-8 h-8" />,
                items: ['Product engineering', 'Cloud/DevOps', 'DevSecOps', 'QA automation', 'Observability'],
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
              }
            ].map((pillar, idx) => (
              <div key={idx} className="p-10 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-[2.5rem] group hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
                <div className={`w-16 h-16 ${pillar.bg} ${pillar.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">{pillar.title}</h3>
                <ul className="space-y-4">
                  {pillar.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${pillar.color.replace('text', 'bg')}`}></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gradient text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
              RESULT: Faster releases • Lower incidents • Better UX • Lower TCO
            </div>
          </div>
        </div>
      </section>

      {/* Visual Model: Transformation Pillars */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Transformation Pillars</h2>
              <div className="space-y-6">
                {[
                  { title: 'Innovation Acceleration', desc: 'AI-led business model innovation and data monetization strategies.', color: 'border-emerald-500', icon: '🟢', lightBg: 'bg-emerald-50' },
                  { title: 'Informed Decision Systems', desc: 'Real-time analytics and predictive intelligence with embedded AI insights.', color: 'border-blue-500', icon: '🔵', lightBg: 'bg-blue-50' },
                  { title: 'Cost & Efficiency Optimization', desc: 'Cloud enablement and automation-first operating models.', color: 'border-yellow-500', icon: '🟡', lightBg: 'bg-yellow-50' },
                  { title: 'Workforce & Experience Enablement', desc: 'Digital sales enablement and connected, knowledge-driven operations.', color: 'border-purple-500', icon: '🟣', lightBg: 'bg-purple-50' }
                ].map((pillar, idx) => (
                  <div key={idx} className={`p-6 ${pillar.lightBg} rounded-3xl border-l-4 ${pillar.color} hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{pillar.icon}</span>
                      <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{pillar.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 relative flex items-center justify-center perspective-2000 group">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2564ea 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
              
              {/* 3D Visual Model Container */}
              <div className="relative w-full aspect-square max-w-[450px] preserve-3d animate-float-3d">
                {/* Orbital Path Rings */}
                <div className="absolute inset-4 border border-blue-200/50 rounded-full"></div>
                <div className="absolute inset-16 border border-dashed border-blue-100/30 rounded-full animate-spin-slow"></div>
                
                {/* Central Portal Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 preserve-3d z-20">
                  <div className="absolute inset-0 bg-brand-gradient rounded-full opacity-20 blur-2xl animate-portal"></div>
                  <div className="absolute inset-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-xl border border-blue-50 flex flex-col items-center justify-center text-center p-8 preserve-3d overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
                    <div className="w-16 h-1 bg-brand-gradient rounded-full mb-4"></div>
                    <div className="text-brand-blue font-black text-xl leading-tight uppercase tracking-tighter max-w-[120px]">
                      AI-Native Modernization
                    </div>
                    <div className="mt-4 flex gap-1">
                      {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-blue-200 rounded-full"></div>)}
                    </div>
                  </div>
                </div>

                {/* Animated 3D Satellites (Orbits) */}
                <div className="absolute inset-0 animate-orbit preserve-3d">
                  {[
                    { angle: '0deg', bg: 'bg-emerald-500', icon: <TrendingUp className="text-white w-6 h-6" />, label: 'Growth' },
                    { angle: '90deg', bg: 'bg-blue-500', icon: <PieChart className="text-white w-6 h-6" />, label: 'Insights' },
                    { angle: '180deg', bg: 'bg-yellow-500', icon: <Cpu className="text-white w-6 h-6" />, label: 'compute' },
                    { angle: '270deg', bg: 'bg-purple-500', icon: <Users className="text-white w-6 h-6" />, label: 'Users' }
                  ].map((sat, i) => (
                    <div key={i} 
                         className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 preserve-3d"
                         style={{ transform: `rotate(${sat.angle}) translateX(180px) rotate(-${sat.angle})` }}>
                      <div className="animate-counter-rotate preserve-3d">
                        <div className={`w-16 h-16 ${sat.bg} rounded-2xl shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 relative z-30`}>
                          {sat.icon}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            {sat.label}
                          </div>
                        </div>
                        {/* 3D Depth Effect shadows */}
                        <div className="absolute inset-0 bg-black/10 blur-xl translate-y-4 translate-z-[-20px] rounded-2xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Optical Data Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 500">
                  <circle cx="250" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" className="text-blue-500" />
                  <line x1="250" y1="70" x2="250" y2="430" stroke="currentColor" strokeWidth="0.5" className="text-blue-200" />
                  <line x1="70" y1="250" x2="430" y2="250" stroke="currentColor" strokeWidth="0.5" className="text-blue-200" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Offerings Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
                Enterprise Synergies
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
                Strategic Digital <span className="text-transparent bg-clip-text bg-brand-gradient">Synergies</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                Transformation is the catalyst. Integrate these core capabilities to accelerate your global digital dominance.
              </p>
              <div className="space-y-4">
                {[
                  { 
                    name: 'GenAI & Autonomous Systems', 
                    link: '/services/ai-cognitive/agentic-ai',
                    icon: <Cpu className="w-5 h-5" />,
                    desc: 'Enterprise-grade generative AI, agentic workflows, and AI governance frameworks.'
                  },
                  { 
                    name: 'Agentic AI Orchestration', 
                    link: '/services/ai-cognitive/agentic-ai',
                    icon: <Network className="w-5 h-5" />,
                    desc: 'Deploy AI agents across enterprise workflows to automate and scale operations.'
                  },
                  { 
                    name: 'Application Modernization', 
                    link: '/services/digital-transformation-modernization/application-modernization',
                    icon: <RefreshCw className="w-5 h-5" />,
                    desc: 'Re-architect enterprise systems into modular, cloud-native architectures.'
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
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative perspective-2000 group">
              {/* Perspective background grid */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2564ea 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
              
              <div className="relative z-10 flex items-center justify-center p-8">
                {/* 3D Visual Model */}
                <div className="relative w-[400px] aspect-square preserve-3d animate-float-3d">
                  {/* Central Core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 preserve-3d z-20">
                    <div className="absolute inset-0 bg-brand-gradient rounded-[2rem] opacity-20 blur-2xl animate-pulse"></div>
                    <div className="absolute inset-0 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] shadow-2xl border border-blue-50 flex flex-col items-center justify-center text-center p-6 preserve-3d">
                      <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-brand-blue font-black text-sm uppercase tracking-tighter">
                        Strategic Catalyst
                      </div>
                    </div>
                  </div>

                  {/* Orbital Elements - Logically linked to services */}
                  <div className="absolute inset-0 animate-orbit preserve-3d">
                    {[
                      { icon: <Cpu className="w-5 h-5" />, label: 'GenAI & Autonomous', angle: '0deg', color: 'bg-blue-600' },
                      { icon: <Network className="w-5 h-5" />, label: 'Agentic AI', angle: '120deg', color: 'bg-emerald-600' },
                      { icon: <RefreshCw className="w-5 h-5" />, label: 'Modernization', angle: '240deg', color: 'bg-purple-600' }
                    ].map((node, i) => (
                      <div 
                        key={i}
                        className="absolute top-1/2 left-1/2 w-16 h-16 -ml-8 -mt-8 preserve-3d"
                        style={{ transform: `rotate(${node.angle}) translateX(150px) rotate(-${node.angle})` }}
                      >
                        <div className="animate-counter-rotate preserve-3d">
                          <div className={`w-14 h-14 ${node.color} rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-125 transition-transform duration-500`}>
                            {node.icon}
                            <div className="absolute -bottom-8 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                              {node.label}
                            </div>
                          </div>
                          {/* Shadow for 3D effect */}
                          <div className="absolute inset-0 bg-black/5 blur-lg translate-y-6 translate-z-[-20px] rounded-2xl"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technical Accents */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#2564ea" strokeWidth="1" strokeDasharray="10 10" />
                    <line x1="200" y1="50" x2="200" y2="350" stroke="#2564ea" strokeWidth="0.5" />
                    <line x1="50" y1="200" x2="350" y2="200" stroke="#2564ea" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>

              {/* Stat Overlay (Glassmorphic) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] grid grid-cols-2 gap-4">
                {[
                  { label: 'DELIVERY', value: 'AGILE' },
                  { label: 'STACK', value: 'NATIVE' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-xl hover:-translate-y-1 transition-transform">
                    <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-brand-blue">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Combine all data for the template
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      solutions,
      whyKangqore,
      whyKangqoreIntro: `Kangqore is an AI-first digital engineering firm built for modern enterprises. We do not deliver presentations; we deliver production-ready systems.`,
      industries,
      customFAQs,
      additionalInfo,
      customSections,
      industryTitle: 'Global Industry Impact',
      industryIntro: 'Kangqore delivers end-to-end digital transformation across sectors including BFSI, Healthcare, Retail, Manufacturing, and the Public Sector.',
      ctaTitle: 'Ready to Transform at Enterprise Scale?',
      ctaDescription: 'Digital transformation requires clarity, discipline, and execution. Kangqore partners with you from strategy to scale — embedding AI, automation, and modern architecture into the core of your enterprise.',
      ctaButtonText: 'Schedule Executive Consultation'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default DigitalTransformation;
