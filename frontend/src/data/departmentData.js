import { 
  Brain, Cloud, Database, Code, Cog, Cpu, Shield, Zap, Users, 
  Sparkles, BarChart3, Settings, Lock, Rocket, Bot, Server, 
  Briefcase, Lightbulb, Globe, Leaf, Megaphone, TrendingUp, Activity 
} from 'lucide-react';

// Slugify helper function
const slugify = (text) => {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

export const departmentData = [
  // A. AI & Cognitive
  {
    name: 'AI & Cognitive',
    slug: 'ai-cognitive',
    icon: Brain,
    description: 'Transform your business with cutting-edge AI and cognitive computing solutions that drive innovation and competitive advantage.',
    image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/849313437/neural-172557.mp4?width=1280&hash=8f8d55c7a3683225cca86d0ecf9b9b81b1e734e5',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    benefits: [
      { title: 'Intelligent Automation', description: 'Automate complex decision-making processes' },
      { title: 'Data-Driven Insights', description: 'Extract valuable insights from your data' },
      { title: 'Scalable AI Solutions', description: 'Grow your AI capabilities with your business' }
    ],
    services: [
      {
        name: 'Agentic AI',
        slug: 'agentic-ai',
        shortDescription: 'Build autonomous AI agents that can reason, plan, and execute complex tasks',
        fullDescription: 'Deploy intelligent AI agents capable of autonomous decision-making, multi-step reasoning, and goal-oriented task execution for your business processes.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        keyFeatures: ['Autonomous decision-making', 'Multi-step reasoning', 'Goal-oriented execution', 'Self-improvement capabilities', 'Human-in-the-loop integration']
      },
      {
        name: 'AI & Cognitive Computing',
        slug: 'ai-cognitive-computing',
        shortDescription: 'Leverage cognitive technologies to mimic human thought processes',
        fullDescription: 'Implement cognitive computing solutions that understand, reason, and learn from data to enhance business operations.',
        image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
        keyFeatures: ['Natural language understanding', 'Pattern recognition', 'Machine reasoning', 'Knowledge management', 'Cognitive insights']
      },
      {
        name: 'AI Governance',
        slug: 'ai-governance',
        shortDescription: 'Establish frameworks for responsible and ethical AI deployment',
        fullDescription: 'Create comprehensive AI governance frameworks ensuring ethical, transparent, and compliant AI implementations.',
        image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80',
        keyFeatures: ['Ethical AI guidelines', 'Bias detection and mitigation', 'Model explainability', 'Compliance monitoring', 'Risk assessment']
      },
      {
        name: 'Data Science & AI',
        slug: 'data-science-ai',
        shortDescription: 'Extract insights and build predictive models from your data',
        fullDescription: 'Combine data science expertise with AI capabilities to uncover insights, build models, and drive data-driven decisions.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
        keyFeatures: ['Predictive modeling', 'Statistical analysis', 'Feature engineering', 'Model deployment', 'Data visualization']
      },
      {
        name: 'GenAI Business Services',
        slug: 'genai-business-services',
        shortDescription: 'Implement generative AI solutions for business transformation',
        fullDescription: 'Leverage generative AI technologies including LLMs, image generation, and content creation for business applications.',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        keyFeatures: ['LLM implementation', 'Custom model fine-tuning', 'Content generation', 'Code generation', 'Enterprise AI assistants']
      },
      {
        name: 'MLOps',
        slug: 'mlops',
        shortDescription: 'Streamline ML model development, deployment, and operations',
        fullDescription: 'Implement MLOps practices for efficient machine learning lifecycle management from development to production.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['Model versioning', 'Automated pipelines', 'Continuous training', 'Model monitoring', 'Feature stores']
      }
    ]
  },

  // B. Analytics & Insights
  {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    icon: BarChart3,
    description: 'Turn data into actionable insights with advanced analytics and big data solutions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/869313437/data-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    benefits: [
      { title: 'Data-Driven Decisions', description: 'Make informed choices backed by data' },
      { title: 'Predictive Insights', description: 'Anticipate trends and opportunities' },
      { title: 'Real-Time Analytics', description: 'Get insights when you need them' }
    ],
    services: [
      {
        name: 'Analytics',
        slug: 'analytics',
        shortDescription: 'Comprehensive analytics solutions for business intelligence',
        fullDescription: 'Implement end-to-end analytics solutions including dashboards, reports, and advanced analytics capabilities.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        keyFeatures: ['Business intelligence', 'Dashboard development', 'KPI tracking', 'Self-service analytics', 'Data storytelling']
      },
      {
        name: 'Big Data',
        slug: 'big-data',
        shortDescription: 'Handle massive datasets with scalable big data infrastructure',
        fullDescription: 'Build and manage big data platforms that process, store, and analyze large volumes of data efficiently.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['Data lakes', 'Distributed processing', 'Real-time streaming', 'Data warehousing', 'ETL pipelines']
      }
    ]
  },

  // C. Cloud Engineering
  {
    name: 'Cloud Engineering',
    slug: 'cloud-engineering',
    icon: Cloud,
    description: 'Modernize your infrastructure with scalable, secure, and cost-effective cloud solutions.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/855313437/cloud-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
    benefits: [
      { title: 'Scalability', description: 'Scale resources up or down based on demand' },
      { title: 'Cost Optimization', description: 'Pay only for what you use' },
      { title: 'Global Reach', description: 'Deploy applications worldwide instantly' }
    ],
    services: [
      {
        name: 'Managed Cloud Services',
        slug: 'managed-cloud-services',
        shortDescription: 'End-to-end cloud management and optimization',
        fullDescription: 'Comprehensive managed services for your cloud infrastructure including monitoring, optimization, and support.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
        keyFeatures: ['24/7 monitoring', 'Cost optimization', 'Security management', 'Performance tuning', 'Compliance support']
      },
      {
        name: 'AWS',
        slug: 'aws',
        shortDescription: 'Amazon Web Services implementation and management',
        fullDescription: 'Expert AWS services from architecture design to migration and ongoing management.',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
        keyFeatures: ['AWS architecture', 'Migration services', 'Cost optimization', 'Security best practices', 'DevOps on AWS']
      },
      {
        name: 'Microsoft Services',
        slug: 'microsoft-services',
        shortDescription: 'Microsoft Azure and M365 solutions',
        fullDescription: 'Complete Microsoft cloud solutions including Azure infrastructure, Microsoft 365, and Power Platform.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        keyFeatures: ['Azure implementation', 'Microsoft 365', 'Power Platform', 'Dynamics 365', 'Security & compliance']
      },
      {
        name: 'Google Cloud Services',
        slug: 'google-cloud-services',
        shortDescription: 'Google Cloud Platform expertise and implementation',
        fullDescription: 'Leverage Google Cloud for data analytics, machine learning, and enterprise applications.',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
        keyFeatures: ['GCP architecture', 'BigQuery analytics', 'AI/ML on GCP', 'Kubernetes (GKE)', 'Data solutions']
      },
      {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        shortDescription: 'Multi-cloud and hybrid cloud strategies',
        fullDescription: 'Design and implement cloud computing strategies that align with your business goals.',
        image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
        keyFeatures: ['Cloud strategy', 'Multi-cloud management', 'Hybrid solutions', 'Cloud native development', 'FinOps']
      }
    ]
  },

  // D. Cybersecurity
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    icon: Shield,
    description: 'Protect your organization from cyber threats with comprehensive security solutions.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/858313437/security-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    benefits: [
      { title: 'Threat Protection', description: 'Defend against cyber attacks and breaches' },
      { title: 'Compliance', description: 'Meet regulatory and industry requirements' },
      { title: 'Risk Management', description: 'Identify and mitigate security risks' }
    ],
    services: [
      {
        name: 'IT Security Services',
        slug: 'it-security-services',
        shortDescription: 'Comprehensive IT security assessment and implementation',
        fullDescription: 'End-to-end IT security services including assessment, implementation, monitoring, and incident response.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
        keyFeatures: ['Security assessment', 'Threat detection', 'Incident response', 'Security operations', 'Compliance management']
      }
    ]
  },

  // E. Digital Transformation & Modernization
  {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    icon: Rocket,
    description: 'Transform your business for the digital age with comprehensive modernization solutions.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/861313437/digital-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    benefits: [
      { title: 'Business Agility', description: 'Respond quickly to market changes' },
      { title: 'Innovation', description: 'Enable new business models and offerings' },
      { title: 'Efficiency', description: 'Streamline operations with modern technology' }
    ],
    services: [
      {
        name: 'Application Modernization',
        slug: 'application-modernization',
        shortDescription: 'Modernize legacy applications for cloud-native performance',
        fullDescription: 'Transform legacy applications to modern architectures including microservices, containers, and cloud-native.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
        keyFeatures: ['Legacy assessment', 'Re-platforming', 'Re-architecting', 'Containerization', 'API enablement']
      },
      {
        name: 'Digital Transformation',
        slug: 'digital-transformation',
        shortDescription: 'End-to-end digital transformation strategy and execution',
        fullDescription: 'Comprehensive digital transformation from strategy through execution, enabling new business capabilities.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        keyFeatures: ['Digital strategy', 'Operating model design', 'Technology enablement', 'Change management', 'Value realization']
      },
      {
        name: 'Legacy Modernization',
        slug: 'legacy-modernization',
        shortDescription: 'Transform aging systems into modern platforms',
        fullDescription: 'Modernize legacy systems to reduce technical debt, improve performance, and enable innovation.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['Assessment', 'Migration planning', 'Data migration', 'Testing', 'Cutover management']
      },
      {
        name: 'Technology Modernization',
        slug: 'technology-modernization',
        shortDescription: 'Update technology stack for improved performance',
        fullDescription: 'Modernize your technology stack to leverage latest capabilities and improve business outcomes.',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
        keyFeatures: ['Technology assessment', 'Roadmap development', 'Implementation', 'Integration', 'Optimization']
      },
      {
        name: 'Technology Transformation',
        slug: 'technology-transformation',
        shortDescription: 'Fundamental technology change for business value',
        fullDescription: 'Drive fundamental technology changes that deliver significant business value and competitive advantage.',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
        keyFeatures: ['Vision & strategy', 'Architecture design', 'Transformation execution', 'Change enablement', 'Value measurement']
      },
      {
        name: 'Digital Business Transformation',
        slug: 'digital-business-transformation',
        shortDescription: 'Transform business models through digital innovation',
        fullDescription: 'Reimagine business models and operations through digital technologies and innovation.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        keyFeatures: ['Business model innovation', 'Digital products', 'Customer experience', 'Operational excellence', 'Data monetization']
      }
    ]
  },

  // F. Automation
  {
    name: 'Automation',
    slug: 'automation',
    icon: Bot,
    description: 'Automate business processes to increase efficiency, reduce costs, and improve accuracy.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/864313437/automation-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    benefits: [
      { title: 'Cost Reduction', description: 'Reduce operational costs through automation' },
      { title: 'Increased Productivity', description: 'Free employees for higher-value work' },
      { title: 'Error Reduction', description: 'Minimize human errors in repetitive tasks' }
    ],
    services: [
      {
        name: 'Digital Process Automation (DPA)',
        slug: 'digital-process-automation',
        shortDescription: 'Automate and optimize digital business processes',
        fullDescription: 'Implement comprehensive digital process automation to streamline workflows and improve efficiency.',
        image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
        keyFeatures: ['Process discovery', 'Workflow automation', 'Integration', 'Monitoring', 'Optimization']
      },
      {
        name: 'Robotic Process Automation (RPA)',
        slug: 'robotic-process-automation',
        shortDescription: 'Deploy software robots for repetitive tasks',
        fullDescription: 'Implement RPA solutions to automate rule-based, repetitive business processes.',
        image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80',
        keyFeatures: ['Process assessment', 'Bot development', 'Attended/unattended automation', 'Bot monitoring', 'CoE setup']
      },

      {
        name: 'Business Process Management',
        slug: 'business-process-management',
        shortDescription: 'Design, execute, and optimize business processes',
        fullDescription: 'Implement BPM solutions to model, automate, and improve business processes.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        keyFeatures: ['Process modeling', 'Workflow automation', 'Process orchestration', 'Business rules', 'Process analytics']
      },
      {
        name: 'Intelligent Automation',
        slug: 'intelligent-automation',
        shortDescription: 'AI-powered automation for complex processes',
        fullDescription: 'Combine AI with automation for intelligent decision-making and complex process handling.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        keyFeatures: ['AI decision automation', 'NLP integration', 'Document intelligence', 'Cognitive automation', 'Process orchestration']
      }
    ]
  },

  // G. Product Engineering
  {
    name: 'Product Engineering',
    slug: 'product-engineering',
    icon: Code,
    description: 'Build innovative digital products with modern engineering practices and cutting-edge technologies.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/867313437/engineering-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    benefits: [
      { title: 'Rapid Development', description: 'Accelerate time-to-market' },
      { title: 'Scalable Architecture', description: 'Build systems that grow with your business' },
      { title: 'Quality Assurance', description: 'Ensure robust and reliable products' }
    ],
    services: [
      {
        name: 'Embedded Design Systems & IT/OT',
        slug: 'embedded-design-systems',
        shortDescription: 'Design embedded systems and IT/OT convergence solutions',
        fullDescription: 'Develop embedded systems and bridge the gap between IT and operational technology.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
        keyFeatures: ['Embedded design', 'Firmware development', 'IT/OT integration', 'IoT connectivity', 'Edge computing']
      },
      {
        name: 'Engineering Foundry',
        slug: 'engineering-foundry',
        shortDescription: 'Innovation hub for engineering excellence',
        fullDescription: 'Access our engineering foundry for rapid prototyping, experimentation, and innovation.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        keyFeatures: ['Rapid prototyping', 'Innovation sprints', 'Technical POCs', 'Experimentation', 'Technology scouting']
      },
      {
        name: 'Engineering R&D Services',
        slug: 'engineering-rd-services',
        shortDescription: 'Research and development for product innovation',
        fullDescription: 'Partner with our R&D team to research, develop, and innovate new product capabilities.',
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80',
        keyFeatures: ['Technology research', 'Innovation labs', 'IP development', 'Patent support', 'Academic partnerships']
      },
      {
        name: 'Product Digital Engineering Services',
        slug: 'product-digital-engineering',
        shortDescription: 'Digital engineering for connected products',
        fullDescription: 'Transform physical products with digital capabilities and connected experiences.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
        keyFeatures: ['Product digitization', 'Connected products', 'Digital twins', 'Smart features', 'Data integration']
      },

      {
        name: 'Quality Engineering & Assurance',
        slug: 'quality-engineering-assurance',
        shortDescription: 'Comprehensive quality engineering services',
        fullDescription: 'Ensure product quality through comprehensive testing and quality assurance practices.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        keyFeatures: ['Test strategy', 'Test automation', 'Performance testing', 'Security testing', 'Quality metrics']
      },
      {
        name: 'DevOps as a Service (DaaS)',
        slug: 'devops-as-a-service',
        shortDescription: 'Managed DevOps for accelerated delivery',
        fullDescription: 'Implement DevOps practices as a service for faster, more reliable software delivery.',
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
        keyFeatures: ['CI/CD pipelines', 'Infrastructure as code', 'Container orchestration', 'Monitoring', 'SRE practices']
      }
    ]
  },

  // H. Infrastructure, Networks & Operations
  {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    icon: Server,
    description: 'Manage and modernize IT infrastructure for reliability, performance, and scalability.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/870313437/infrastructure-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    benefits: [
      { title: 'Reliability', description: 'Ensure infrastructure uptime and performance' },
      { title: 'Scalability', description: 'Scale infrastructure with business needs' },
      { title: 'Cost Efficiency', description: 'Optimize infrastructure costs' }
    ],
    services: [

      {
        name: 'Managed Infrastructure Services',
        slug: 'managed-infrastructure-services',
        shortDescription: 'End-to-end infrastructure management',
        fullDescription: 'Comprehensive managed services for your entire IT infrastructure.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['24/7 monitoring', 'Incident management', 'Capacity planning', 'Performance optimization', 'Automation']
      },
      {
        name: 'Modernization Infrastructure',
        slug: 'modernization-infrastructure',
        shortDescription: 'Modernize legacy infrastructure',
        fullDescription: 'Transform legacy infrastructure to modern, cloud-ready architecture.',
        image: 'https://images.unsplash.com/photo-1560732488-6b0df240254a?w=800&q=80',
        keyFeatures: ['Assessment', 'Modernization roadmap', 'Cloud migration', 'Hybrid infrastructure', 'IaC']
      },
      {
        name: 'Managed Services',
        slug: 'managed-services',
        shortDescription: 'Comprehensive IT managed services',
        fullDescription: 'Full suite of managed IT services to optimize operations and reduce costs.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['Service desk', 'Application management', 'Infrastructure management', 'Security services', 'Cloud management']
      },
      {
        name: 'Support And Maintenance',
        slug: 'support-maintenance',
        shortDescription: 'Ongoing support and maintenance services',
        fullDescription: 'Reliable support and maintenance to keep your systems running smoothly.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        keyFeatures: ['Helpdesk support', 'Application support', 'System maintenance', 'Patch management', 'SLA management']
      },
      {
        name: 'Operation Technology (OT)',
        slug: 'operation-technology',
        shortDescription: 'Operational technology management and security',
        fullDescription: 'Manage and secure operational technology environments for industrial operations.',
        image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
        keyFeatures: ['OT assessment', 'OT security', 'IT/OT convergence', 'SCADA systems', 'Industrial IoT']
      }
    ]
  },

  // I. Consulting & Advisory
  {
    name: 'Consulting & Advisory',
    slug: 'consulting-advisory',
    icon: Lightbulb,
    description: 'Strategic consulting to transform your business and achieve your goals.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/873313437/consulting-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80',
    benefits: [
      { title: 'Expert Guidance', description: 'Access to industry-leading expertise' },
      { title: 'Objective Insights', description: 'Unbiased perspective on challenges' },
      { title: 'Accelerated Results', description: 'Achieve goals faster with proven methods' }
    ],
    services: [
      {
        name: 'Technology Consulting',
        slug: 'technology-consulting',
        shortDescription: 'Expert technology guidance and advisory',
        fullDescription: 'Get expert advice on technology strategy, architecture, and implementation.',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
        keyFeatures: ['Technology strategy', 'Architecture advisory', 'Vendor selection', 'Technology roadmaps', 'IT governance']
      },
      {
        name: 'Strategy Consulting',
        slug: 'strategy-consulting',
        shortDescription: 'Develop winning business and technology strategies',
        fullDescription: 'Work with our strategists to define and execute strategies that drive growth.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        keyFeatures: ['Business strategy', 'Digital strategy', 'Market analysis', 'Competitive positioning', 'Growth strategy']
      },
      {
        name: 'Discover & Frame Workshops',
        slug: 'discover-frame-workshops',
        shortDescription: 'Collaborative workshops for problem-solving and innovation',
        fullDescription: 'Engage in structured workshops to discover opportunities and frame solutions.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        keyFeatures: ['Design thinking', 'Problem framing', 'Ideation sessions', 'Solution design', 'Roadmap development']
      }
    ]
  },

  // J. Digital Engineering
  {
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    icon: Cpu,
    description: 'Build innovative products and platforms with modern engineering practices.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/876313437/digital-eng-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    benefits: [
      { title: 'Rapid Innovation', description: 'Accelerate product development cycles' },
      { title: 'Scalable Platforms', description: 'Build platforms that grow with you' },
      { title: 'Quality Products', description: 'Deliver reliable, high-quality software' }
    ],
    services: [
      {
        name: 'MVP Acceleration',
        slug: 'mvp-acceleration',
        shortDescription: 'Rapidly build and validate minimum viable products',
        fullDescription: 'Accelerate your path to market with rapid MVP development and validation.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        keyFeatures: ['Rapid prototyping', 'Agile sprints', 'User validation', 'Iterative development', 'Launch support'],
        link: '/services/digital-engineering/mvp-acceleration'
      },
      {
        name: 'Product Strategy & Experience Design',
        slug: 'product-strategy-experience-design',
        shortDescription: 'Strategic product planning and UX design',
        fullDescription: 'Define product strategy and create exceptional user experiences.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        keyFeatures: ['Product vision', 'User research', 'UX/UI design', 'Design systems', 'Usability testing'],
        link: '/services/digital-engineering/product-strategy-experience-design'
      },

      {
        name: 'Software Development',
        slug: 'software-development',
        shortDescription: 'Custom software development services',
        fullDescription: 'Build custom software solutions tailored to your business needs.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
        keyFeatures: ['Full-stack development', 'Agile methodology', 'Code quality', 'CI/CD', 'Documentation'],
        link: '/services/digital-engineering/software-development'
      },
      {
        name: 'API & Microservices Engineering',
        slug: 'api-microservices-engineering',
        shortDescription: 'Design and build modern API-first architectures',
        fullDescription: 'Implement API-first and microservices architectures for scalable applications.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['API design', 'Microservices architecture', 'API gateway', 'Service mesh', 'API management'],
        link: '/services/digital-engineering/api-microservices-engineering'
      }
    ]
  },

  // K. Enterprise Applications
  {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    icon: Cog,
    description: 'Implement and optimize enterprise software platforms to streamline operations.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/879313437/apps-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    benefits: [
      { title: 'Integrated Systems', description: 'Connect your business processes seamlessly' },
      { title: 'Best Practices', description: 'Leverage industry-leading platform capabilities' },
      { title: 'Expert Implementation', description: 'Certified consultants ensure success' }
    ],
    services: [
      {
        name: 'Enterprise Platform Integration',
        slug: 'enterprise-platform-integration',
        shortDescription: 'Integrate enterprise platforms and applications',
        fullDescription: 'Connect your enterprise applications for seamless data flow and process automation.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['Integration strategy', 'API development', 'ESB implementation', 'Data integration', 'iPaaS solutions']
      },
      {
        name: 'Pimcore',
        slug: 'pimcore',
        shortDescription: 'Pimcore PIM/DAM implementation and customization',
        fullDescription: 'Implement Pimcore for product information management and digital asset management.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        keyFeatures: ['PIM implementation', 'DAM setup', 'Data modeling', 'Integration', 'Custom development']
      },
      {
        name: 'Salesforce',
        slug: 'salesforce',
        shortDescription: 'Salesforce implementation and customization',
        fullDescription: 'Transform customer relationships with Salesforce solutions.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        keyFeatures: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Custom development', 'Integration']
      },
      {
        name: 'ServiceNow',
        slug: 'servicenow',
        shortDescription: 'ServiceNow implementation and optimization',
        fullDescription: 'Implement ServiceNow for IT service management and beyond.',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
        keyFeatures: ['ITSM', 'ITOM', 'HR Service Delivery', 'Custom apps', 'Integration']
      },

    ]
  },

  // L. Emerging Technologies
  {
    name: 'Emerging Technologies',
    slug: 'emerging-technologies',
    icon: Sparkles,
    description: 'Explore and implement cutting-edge technologies to gain competitive advantage.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/882313437/future-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80',
    benefits: [
      { title: 'Innovation', description: 'Stay ahead with emerging technologies' },
      { title: 'Competitive Edge', description: 'Differentiate with advanced solutions' },
      { title: 'Future Ready', description: 'Prepare for tomorrow today' }
    ],
    services: [
      {
        name: 'Blockchain',
        slug: 'blockchain',
        shortDescription: 'Decentralized solutions with blockchain technology',
        fullDescription: 'Implement blockchain solutions for transparency, security, and efficiency.',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
        keyFeatures: ['Blockchain strategy', 'Smart contracts', 'Private networks', 'DeFi solutions', 'Supply chain']
      },

      {
        name: 'Internet Of Things (IoT)',
        slug: 'internet-of-things',
        shortDescription: 'Connected device solutions and IoT platforms',
        fullDescription: 'Build comprehensive IoT solutions from device connectivity to analytics.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
        keyFeatures: ['IoT architecture', 'Device connectivity', 'IoT analytics', 'Platform integration', 'Security']
      }
    ]
  },

  // M. Business Operations
  {
    name: 'Business Operations',
    slug: 'business-operations',
    icon: Briefcase,
    description: 'Optimize business operations for efficiency, compliance, and growth.',
    image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/885313437/business-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=1200&q=80',
    benefits: [
      { title: 'Operational Excellence', description: 'Streamline and optimize operations' },
      { title: 'Risk Management', description: 'Identify and mitigate business risks' },
      { title: 'Growth Enablement', description: 'Scale operations efficiently' }
    ],
    services: [
      {
        name: 'Finance & Risk Management',
        slug: 'finance-risk-management',
        shortDescription: 'Finance transformation and risk management solutions',
        fullDescription: 'Transform finance operations and implement comprehensive risk management.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        keyFeatures: ['Finance transformation', 'Risk assessment', 'Compliance', 'Financial planning', 'Audit support']
      },
      {
        name: 'Global Capability Centers (GCC)',
        slug: 'global-capability-centers',
        shortDescription: 'Establish and optimize global capability centers',
        fullDescription: 'Build and scale global capability centers for operational excellence.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        keyFeatures: ['GCC setup', 'Operating model', 'Talent management', 'Process excellence', 'Technology enablement']
      },
      {
        name: 'Talent & Organization',
        slug: 'talent-organization',
        shortDescription: 'Talent management and organizational effectiveness',
        fullDescription: 'Transform talent management and organizational capabilities.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        keyFeatures: ['Talent strategy', 'Org design', 'Change management', 'Learning & development', 'HR technology']
      },
      {
        name: 'Supply Chain',
        slug: 'supply-chain',
        shortDescription: 'Supply chain optimization and transformation',
        fullDescription: 'Optimize and transform supply chain operations for efficiency and resilience.',
        image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
        keyFeatures: ['Supply chain strategy', 'Planning & forecasting', 'Logistics optimization', 'Visibility', 'Sustainability']
      },
      {
        name: 'Unified Services Management (USM)',
        slug: 'unified-services-management',
        shortDescription: 'Unified approach to service management',
        fullDescription: 'Implement unified service management for consistent service delivery.',
        image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&q=80',
        keyFeatures: ['Service strategy', 'Process design', 'Tool implementation', 'Governance', 'Continuous improvement']
      }
    ]
  },

  // O. Digital Marketing
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: Megaphone,
    description: 'Transforming marketing into a revenue engine through MarTech, Data Sovereignty, and AI-driven growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/888313437/marketing-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    benefits: [
      { title: 'Data Sovereignty', description: 'Build and own your first-party customer data assets' },
      { title: 'AI Efficiency', description: 'Reduce creative and operational costs with GenAI' },
      { title: 'Predictive ROI', description: 'Advanced attribution modeling for measurable growth' }
    ],
    services: [
      {
        name: 'Customer Data Strategy.',
        slug: 'cdp-strategy',
        link: '/services/digital-marketing/cdp-strategy',
        shortDescription: 'Build a "single source of truth" for customer data to combat the death of cookies.',
        fullDescription: 'Architect a robust first-party data ecosystem that connects every touchpoint, ensuring data sovereignty and highly personalized customer experiences.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keyFeatures: ['First-party data strategy', 'Unified customer profiles', 'Real-time segmentation', 'Data privacy & compliance', 'Cross-channel activation']
      },
      {
        name: 'Marketing AI Readiness',
        slug: 'marketing-ai-readiness',
        link: '/services/digital-marketing/marketing-ai-readiness',
        shortDescription: 'Audit and optimize creative operations with GenAI to save 40%+ in costs.',
        fullDescription: 'Deploy cutting-edge Generative AI across your marketing workflows to accelerate creative production, personalize content at scale, and drastically reduce operational overhead.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        keyFeatures: ['Creative ops audit', 'GenAI implementation roadmap', 'Content personalization at scale', 'Workflow automation', 'AI-driven asset generation']
      },
      {
        name: 'Social Media Management',
        slug: 'social-media-management',
        link: '/services/digital-marketing/social-media-management',
        shortDescription: 'Comprehensive social media strategy and management',
        fullDescription: 'Build and manage your social media presence across all platforms.',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
        keyFeatures: ['Strategy development', 'Content creation', 'Community management', 'Analytics']
      },
      {
        name: 'Performance Marketing',
        slug: 'performance-marketing',
        link: '/services/digital-marketing/performance-marketing',
        shortDescription: 'Data-driven marketing for measurable results',
        fullDescription: 'Drive measurable results with performance-based digital marketing.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        keyFeatures: ['PPC advertising', 'Social ads', 'Retargeting', 'Conversion optimization', 'Attribution']
      },
      {
        name: 'SEO & Organic Growth Strategy',
        slug: 'seo-organic-growth-strategy',
        link: '/services/digital-marketing/seo-organic-growth-strategy',
        shortDescription: 'Dominate search visibility with technical SEO architecture.',
        fullDescription: 'Answer user intent better than anyone else while ensuring your site architecture makes that content accessible.',
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80',
        keyFeatures: ['Technical SEO', 'Content clustering', 'Off-page footprint', 'Core Web Vitals']
      }
    ]
  },
  
  // Q. Conversion Engineering
  {
    name: 'Conversion Engineering',
    slug: 'conversion-engineering',
    icon: Activity,
    description: 'Specialized optimization to transform traffic into measurable business outcomes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    videoBackground: 'https://cdn.pixabay.com/vimeo/891313437/growth-172557.mp4',
    defaultCapabilityImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    benefits: [
      { title: 'Funnel Yield', description: 'Maximize revenue from every visitor interaction' },
      { title: 'Friction Removal', description: 'Identify and eliminate conversion bottlenecks' },
      { title: 'Data-Led Growth', description: 'A/B testing driven performance scaling' }
    ],
    services: [
      {
        name: 'Growth Funnels & Conversion Engineering',
        slug: 'growth-funnels-conversion-engineering',
        link: '/services/conversion-engineering/growth-funnels-conversion-engineering',
        shortDescription: 'Engineer growth through optimized funnels',
        fullDescription: 'Design and optimize growth funnels for maximum conversion and revenue.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        keyFeatures: ['Funnel design', 'A/B testing', 'Conversion optimization', 'Growth hacking', 'Analytics']
      },
      {
        name: 'Conversion Rate Optimization (CRO)',
        slug: 'conversion-rate-optimization',
        link: '/services/conversion-engineering/conversion-rate-optimization',
        shortDescription: 'Engineer maximum yield from your existing traffic.',
        fullDescription: 'Merge deep psychological user research with rigorous quantitative A/B testing to identify friction.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        keyFeatures: ['A/B Testing', 'Behavior Analytics', 'Heuristic Analysis', 'Friction Audits']
      },
      {
        name: 'Campaign Planning',
        slug: 'campaign-planning',
        link: '/services/conversion-engineering/campaign-planning',
        shortDescription: 'Strategic marketing campaign planning and execution',
        fullDescription: 'Plan and execute marketing campaigns that deliver results.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        keyFeatures: ['Campaign strategy', 'Channel planning', 'Creative development', 'Execution', 'Optimization']
      }
    ]
  }
];

// Helper function to get department by slug
export const getDepartmentBySlug = (slug) => {
  return departmentData.find(d => d.slug === slug);
};

// Helper function to get service by department and service slug
export const getServiceBySlug = (departmentSlug, serviceSlug) => {
  const department = getDepartmentBySlug(departmentSlug);
  if (!department) return null;
  return department.services.find(s => s.slug === serviceSlug);
};
