import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck, BrainCircuit, Workflow, Target, Bot } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const DevopsAsAService = () => {
  const service = {
    name: 'DevOps as a Service (DaaS)',
    titleLine1: 'Absolute',
    titleHighlight: 'Resilience.',
    slug: 'devops-as-a-service',
    shortDescription: 'Accelerate deployment cycles. Engineer self-healing environments. Scale with unyielding certainty across any cloud architecture.',
    videoBackground: '/videos/network-loop.mp4', // Use an appropriate background video or image
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Kangqore dominates operations engineering, eliminating delivery friction to guarantee absolute platform stability.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          We recognize that today's deployment operations demand more than just automation. We architect governed, immutable, and natively scalable infrastructures that radically accelerate your delivery velocity while definitively neutralizing operational risk.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
    stats: [
      { value: 'Optimize', label: 'Delivery Pipelines', color: 'text-blue-500' },
      { value: 'Eradicate', label: 'Deployment Friction', color: 'text-brand-blue' },
      { value: 'Secure', label: 'Maximum Resilience', color: 'text-indigo-500' },
      { value: 'Govern', label: 'Cloud Infrastructure', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    highFidelity: {
      narrative: {
        badge: 'Enterprise Excellence :: 2026',
        titleLine1: 'Enterprise',
        titleHighlight: 'DevOps as a Service.',
        titleLine2: 'At Scale.',
        description: 'We architect absolute deployment supremacy. Moving beyond incremental pipeline optimization, Kangqore embeds immutable governance, cognitive automation, and measurable business velocity into your enterprise DNA. We engineer the operational foundation required to dominate your market.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Manual friction, brittle legacy architectures, and systemic delivery bottlenecks paralyzing enterprise scaling velocity.',
        requirementLabel: 'The Requirement',
        requirementText: 'Zero-trust, completely autonomous, and natively scalable operations ecosystems engineered for unyielding resilience.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
        statusLabel: 'Deployment Velocity',
        statusValue: 'Maximized'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'DevOps',
        titleHighlight: 'Outcome-First Design.',
        description: 'We mandate that every infrastructure transformation delivers exponential enterprise value. We don\'t just build pipelines; we forge autonomous, self-healing operational capabilities engineered for high-confidence, zero-downtime execution.',
        pills: ['Zero-Trust Security', 'Immutable Infrastructure', 'Continuous Delivery', 'Advanced Observability']
      },
      matrix: {
        engineId: 'Engine :: DEVOPS-A_V3',
        title: 'Enablement Matrix',
        subtext: 'The ultimate DevOps lifecycle, deconstructed into autonomous, heavily governed, enterprise-grade execution layers.',
        layers: [
          { title: 'Assess', id: 'DEVO_ASSESS', icon: <Search />, desc: 'Discovery, architecture assessment, and strategic DevOps roadmap alignment.' },
          { title: 'Design', id: 'DEVO_DESIGN', icon: <Layers />, desc: 'Zero-trust infrastructure design and intelligent solution planning.' },
          { title: 'Deliver', id: 'DEVO_DEL', icon: <Activity />, desc: 'Structured implementation of GitOps workflows and CI/CD pipelines.' },
          { title: 'Govern', id: 'DEVO_GOV', icon: <ShieldCheck />, desc: 'State visualization, continuous monitoring, and infrastructure cost optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Guarantee',
        titleHighlight: 'Stability.',
        description: 'Your technical infrastructure must drive market dominance. We engineer the delivery frameworks that transform deployment metrics from unpredictable variables into guaranteed, absolute outcomes.',
        stats: [
          { label: 'Reliability', val: 'UNCOMPROMISING' },
          { label: 'Speed', val: 'ACCELERATED' },
          { label: 'Security', val: 'EMBEDDED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform your business with cutting-edge product engineering solutions.'
  };

  const capabilities = [
    {
      title: 'DevOps Advisory',
      description: 'Architect an enterprise-grade DevOps transformation roadmap. Our elite advisory team consists of highly-skilled experts who deliver irrefutable proposals to improve and elevate your operational maturity.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Architecture gap analysis',
        'DevOps maturity assessment',
        'Transformation roadmap development',
        'Toolchain standardization',
        'Value stream mapping'
      ]
    },
    {
      title: 'Immutable Infrastructure & GitOps',
      description: 'Deploy zero-trust, tamper-proof environments. Kangqore builds environments that support immutable container images that cannot be tampered with, guaranteeing absolute consistency and security.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'Infrastructure as Code (IaC) implementation',
        'Container orchestration (Kubernetes)',
        'GitOps workflow design',
        'Security & compliance automation',
        'Multi-cloud environment provisioning'
      ]
    },
    {
      title: 'CI/CD Pipeline Development',
      description: 'Accelerate your delivery lifecycle. Kangqore engineers pipelines that include the latest tools to support continuous integration and continuous delivery for hyper-velocity releases.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Automated testing integration',
        'Zero-downtime deployment pipelines',
        'Artifact management & security scanning',
        'Build performance optimization',
        'DevSecOps integration'
      ]
    },
    {
      title: 'Deployment Strategies',
      description: 'Eliminate manual friction and deployment risk. Kangqore supports advanced Canary and Blue-Green deployment strategies through robust automation, ensuring seamless rollouts.',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Canary release automation',
        'Blue-Green deployment architectures',
        'A/B testing infrastructure',
        'Automated rollback mechanisms',
        'Traffic routing rules & service mesh'
      ]
    },
    {
      title: 'System State Visualization & Dashboards',
      description: 'Achieve total operational clarity. Kangqore uses best of breed toolsets such as Grafana/Kibana to develop enhanced visualizations, reports, and real-time dashboards.',
      image: 'https://images.unsplash.com/photo-1543286386-713bdd548b11?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Centralized log management',
        'Distributed tracing (OpenTelemetry)',
        'Custom KPI dashboards (Grafana)',
        'Predictive alerting systems',
        'Cloud cost optimization analytics'
      ]
    }
  ];

  const technologies = [
    { category: 'CI/CD & Version Control', items: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD', 'Bitbucket Pipelines'] },
    { category: 'Infrastructure & Provisioning', items: ['Terraform', 'Pulumi', 'AWS CloudFormation', 'Ansible', 'Packer'] },
    { category: 'Containerization & Orchestration', items: ['Kubernetes', 'Docker', 'Amazon EKS', 'Google GKE', 'Azure AKS'] },
    { category: 'Observability & Monitoring', items: ['Datadog', 'Prometheus', 'Grafana', 'ELK Stack / Kibana', 'New Relic'] },
    { category: 'Security & Compliance', items: ['HashiCorp Vault', 'SonarQube', 'Snyk', 'Aqua Security', 'Trivy'] }
  ];

  const trustPillars = [
    {
      title: 'DevOps Assessment',
      tag: 'Strategic Advisory',
      description: 'Request a comprehensive landscape analysis and receive: an architecture baseline, your top deployment constraints, an actionable implementation roadmap to achieve GitOps maturity. Learn More →'
    },
    {
      title: 'Immutable Architectures',
      tag: 'Infrastructure',
      description: 'Stop treating servers as pets. We deploy Infrastructure as Code (IaC) to guarantee environments that are consistent, reproducible, and impervious to manual drift configuration errors. Learn More →'
    },
    {
      title: 'Zero-Downtime Delivery',
      tag: 'Automation',
      description: 'Traditional pipelines halt features. Advanced CI/CD orchestrates flow. We embed automated testing and security checks into continuous delivery ecosystems utilizing Canary and Blue-Green strategies. Learn More →'
    },
    {
      title: 'Operational Omniscience',
      tag: 'Observability',
      description: 'Visibility must transcend basic metrics. We architect centralized telemetry, enabling predictive alerting and deep system state visualization across distributed microservices. Learn More →'
    }
  ];

  const whyKangqoreIntro = `Kangqore secures stability and deployment velocity simultaneously. We obliterate the friction between development and operations by architecting immutable infrastructure tied to automated delivery systems.`;

  const whyKangqore = [
    { 
      title: 'Uncompromising Stability', 
      description: 'We radically reduce platform outages and degraded experiences by engineering self-healing infrastructure topologies.' 
    },
    { 
      title: 'Real-Time Mitigation', 
      description: 'Detect incidents instantaneously as they happen and execute automated mitigation strategies to minimize customer impact.' 
    },
    { 
      title: 'Predictive Defense Mechanisms', 
      description: 'Analyze telemetry to predict when issues or bottlenecks are likely to take place, then deploy prophylactic safeguards against catastrophic failure.' 
    },
    { 
      title: 'Accelerated Scaling', 
      description: 'Achieve total DevOps scalability with modular architectures that adapt instantly to variable market demands without structural refactoring.' 
    },
    { 
      title: 'Value-First Governance', 
      description: 'Every pipeline and environment configuration is tied to live KPIs, ROI dashboards, and compliance checkpoints — securing operational excellence.' 
    }
  ];

  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'SaaS Platforms & Independent Software Vendors' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'E-commerce & Retail' },
    { name: 'Technology, Media & Telecom' }
  ];

  const customFAQs = [
    {
      question: `How does Kangqore achieve DevOps stability for our clients?`,
      answer: `We ensure DevOps stability in the following ways:\n• Reduce platform outages and degraded experiences.\n• Detect incidents when they happen and develop mitigation strategies in real-time to minimize customer impact.\n• Predict when issues/problems are likely to take place and then develop defense mechanisms against a catastrophic failure.`
    },
    {
      question: `How does Kangqore improve DevOps resilience for our clients?`,
      answer: `We build highly-available, multi-region architectures leveraging Kubernetes and immutable infrastructure patterns. By decoupling stateful components and utilizing traffic routing policies with service meshes, our environments automatically redirect load around degraded nodes—guaranteeing uninterrupted user experiences.`
    },
    {
      question: `How does Kangqore achieve DevOps scalability for our clients?`,
      answer: `We utilize cloud-native horizontal pod auto-scaling and elasticity parameters governed by metrics like CPU, memory, and custom queues. Accompanied by Infrastructure as Code (IaC), this allows enterprises to seamlessly scale resources vertically and horizontally instantaneously to meet demand volatility.`
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
              Operations Ecosystem
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Engineering <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Solutions.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Elevate your DevOps maturity by integrating resilient infrastructure with our broader product engineering and cloud mastery portfolio.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Cloud & Infrastructure Services', 
                  link: '/services/cloud-engineering',
                  icon: <Layers className="w-5 h-5" />,
                  desc: 'Build the foundational infrastructure hosting your pipelines.'
                },
                { 
                  name: 'Digital Process Automation', 
                  link: '/services/automation/digital-process-automation',
                  icon: <Workflow className="w-5 h-5" />,
                  desc: 'Scale automation outside the engineering department.'
                },
                { 
                  name: 'Quality Engineering', 
                  link: '/services/product-engineering/quality-engineering-assurance',
                  icon: <ShieldCheck className="w-5 h-5" />,
                  desc: 'Automate test paradigms directly into your deployment cycle.'
                },
                { 
                  name: 'SaaS Product Development', 
                  link: '/services/product-engineering/saas-product-development',
                  icon: <Target className="w-5 h-5" />,
                  desc: 'Architect multi-tenant products built to leverage DevOps efficiency.'
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
                // ARCHITECTING_RESILIENCE...
              </div>
            </div>
          </div>

          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              {/* Added animated elements similar to DPA */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Activity className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>

               <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="devo-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#devo-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
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

  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'CI/CD & Infrastructure Architectures We Excel In',
      technologiesDescription: "A platform-agnostic automation stack integrating the world's leading deployment, orchestration, and observational frameworks.",
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Immutable Enterprise Optimization',
      trustPillarsRightDescription: 'Kangqore provides end-to-end DevOps optimization that helps organizations accelerate deployment cycles, eliminate manual bottlenecks, and operate at unprecedented scale. By combining intelligent pipelines and deep platform engineering insights, we engineer ecosystems that are secure, cognitive, and natively scalable.',
      trustPillarsRightButton: 'Request Infrastructure Assessment',
      trustPillarsVideo: '/videos/network-loop.mp4',
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Industry-Specific Pipeline Optimization',
      industries,
      customFAQs,
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

export default DevopsAsAService;

