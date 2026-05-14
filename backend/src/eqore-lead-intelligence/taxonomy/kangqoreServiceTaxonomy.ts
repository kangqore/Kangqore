export type KangqoreService = {
  slug: string;
  name: string;
  departmentSlug: string;
  departmentName: string;
  description: string;
  signalKeywords: string[];
  buyerSignals: string[];
  painPointSignals: string[];
  recommendedQuestions: string[];
  recommendedSolutionPackages: string[];
  priorityLevel: 'standard' | 'high' | 'strategic';
};

export type KangqoreDepartment = {
  name: string;
  slug: string;
  description: string;
  services: string[]; // List of service slugs
};

export const KANGQORE_DEPARTMENTS: KangqoreDepartment[] = [
  {
    name: 'AI & Cognitive Solutions',
    slug: 'ai-cognitive-solutions',
    description: 'Transform your business with cutting-edge AI and cognitive computing solutions.',
    services: [
      'agentic-ai',
      'ai-cognitive-computing',
      'ai-governance',
      'data-science-ai',
      'genai-business-services',
      'mlops'
    ]
  },
  {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Turn data into actionable insights with advanced analytics and big data solutions.',
    services: ['analytics', 'big-data']
  },
  {
    name: 'Cloud Engineering',
    slug: 'cloud-engineering',
    description: 'Modernize your infrastructure with scalable, secure, and cost-effective cloud solutions.',
    services: ['managed-cloud-services', 'aws', 'microsoft-services', 'google-cloud-services', 'cloud-computing']
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Protect your organization from cyber threats with comprehensive security solutions.',
    services: ['it-security-services']
  },
  {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    description: 'Transform your business for the digital age with comprehensive modernization solutions.',
    services: [
      'application-modernization',
      'digital-transformation',
      'legacy-modernization',
      'technology-modernization',
      'technology-transformation',
      'digital-business-transformation'
    ]
  },
  {
    name: 'Automation',
    slug: 'automation',
    description: 'Automate business processes to increase efficiency, reduce costs, and improve accuracy.',
    services: [
      'digital-process-automation',
      'robotic-process-automation',
      'business-process-management',
      'intelligent-automation'
    ]
  },
  {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Build innovative digital products with modern engineering practices.',
    services: [
      'embedded-design-systems',
      'engineering-foundry',
      'engineering-rd-services',
      'product-digital-engineering',
      'quality-engineering-assurance',
      'devops-as-a-service'
    ]
  },
  {
    name: 'Infrastructure, Networks & Operations',
    slug: 'infrastructure-networks-operations',
    description: 'Manage and modernize IT infrastructure for reliability and performance.',
    services: [
      'managed-infrastructure-services',
      'modernization-infrastructure',
      'managed-services',
      'support-maintenance',
      'operation-technology'
    ]
  },
  {
    name: 'Consulting & Advisory',
    slug: 'consulting-advisory',
    description: 'Strategic consulting to transform your business and achieve your goals.',
    services: ['technology-consulting', 'strategy-consulting', 'discover-frame-workshops']
  },
  {
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    description: 'Build innovative products and platforms with modern engineering practices.',
    services: [
      'mvp-acceleration',
      'product-strategy-experience-design',
      'software-development',
      'api-microservices-engineering'
    ]
  },
  {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Implement and optimize enterprise software platforms.',
    services: ['enterprise-platform-integration', 'pimcore', 'salesforce', 'servicenow']
  },
  {
    name: 'Emerging Technologies',
    slug: 'emerging-technologies',
    description: 'Explore and implement cutting-edge technologies.',
    services: ['blockchain', 'internet-of-things']
  },
  {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Optimize business operations for efficiency and growth.',
    services: [
      'finance-risk-management',
      'global-capability-centers',
      'talent-organization',
      'supply-chain',
      'unified-services-management'
    ]
  },
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Transforming marketing into a revenue engine.',
    services: [
      'cdp-strategy',
      'marketing-ai-readiness',
      'social-media-management',
      'performance-marketing',
      'seo-organic-growth-strategy'
    ]
  },
  {
    name: 'Conversion Engineering',
    slug: 'conversion-engineering',
    description: 'Specialized optimization to transform traffic into measurable business outcomes.',
    services: [
      'growth-funnels-conversion-engineering',
      'conversion-rate-optimization',
      'campaign-planning'
    ]
  }
];

export const KANGQORE_SERVICES: Record<string, KangqoreService> = {
  'agentic-ai': {
    slug: 'agentic-ai',
    name: 'Agentic AI',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Build autonomous AI agents that can reason, plan, and execute complex tasks.',
    signalKeywords: ["ai agent","agentic ai","autonomous agent","llm agent"],
    buyerSignals: ['implement agentic ai', 'need agentic ai expertise'],
    painPointSignals: ['slow agentic ai', 'legacy agentic ai'],
    recommendedQuestions: ['What are your primary goals for agentic ai?'],
    recommendedSolutionPackages: ['Agentic AI Strategy Audit', 'Agentic AI Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'ai-cognitive-computing': {
    slug: 'ai-cognitive-computing',
    name: 'AI & Cognitive Computing',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Advanced neural networks and cognitive models for human-like reasoning.',
    signalKeywords: ["cognitive computing","neural networks","deep learning"],
    buyerSignals: ['implement ai & cognitive computing', 'need ai & cognitive computing expertise'],
    painPointSignals: ['slow ai & cognitive computing', 'legacy ai & cognitive computing'],
    recommendedQuestions: ['What are your primary goals for ai & cognitive computing?'],
    recommendedSolutionPackages: ['AI & Cognitive Computing Strategy Audit', 'AI & Cognitive Computing Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'ai-governance': {
    slug: 'ai-governance',
    name: 'AI Governance',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Frameworks for ethical, compliant, and transparent AI implementation.',
    signalKeywords: ["ai ethics","ai compliance","responsible ai"],
    buyerSignals: ['implement ai governance', 'need ai governance expertise'],
    painPointSignals: ['slow ai governance', 'legacy ai governance'],
    recommendedQuestions: ['What are your primary goals for ai governance?'],
    recommendedSolutionPackages: ['AI Governance Strategy Audit', 'AI Governance Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'data-science-ai': {
    slug: 'data-science-ai',
    name: 'Data Science & AI',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Transforming raw data into predictive models and actionable intelligence.',
    signalKeywords: ["predictive modeling","data science","statistical analysis"],
    buyerSignals: ['implement data science & ai', 'need data science & ai expertise'],
    painPointSignals: ['slow data science & ai', 'legacy data science & ai'],
    recommendedQuestions: ['What are your primary goals for data science & ai?'],
    recommendedSolutionPackages: ['Data Science & AI Strategy Audit', 'Data Science & AI Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'genai-business-services': {
    slug: 'genai-business-services',
    name: 'GenAI Business Services',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Generative AI strategies for content, code, and creative automation.',
    signalKeywords: ["genai","generative ai","llm","content automation"],
    buyerSignals: ['implement genai business services', 'need genai business services expertise'],
    painPointSignals: ['slow genai business services', 'legacy genai business services'],
    recommendedQuestions: ['What are your primary goals for genai business services?'],
    recommendedSolutionPackages: ['GenAI Business Services Strategy Audit', 'GenAI Business Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'mlops': {
    slug: 'mlops',
    name: 'MLOps',
    departmentSlug: 'ai-cognitive-solutions',
    departmentName: 'AI & Cognitive Solutions',
    description: 'Operationalizing machine learning with robust CI/CD and monitoring.',
    signalKeywords: ["mlops","model deployment","ml pipeline"],
    buyerSignals: ['implement mlops', 'need mlops expertise'],
    painPointSignals: ['slow mlops', 'legacy mlops'],
    recommendedQuestions: ['What are your primary goals for mlops?'],
    recommendedSolutionPackages: ['MLOps Strategy Audit', 'MLOps Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'analytics': {
    slug: 'analytics',
    name: 'Advanced Analytics',
    departmentSlug: 'analytics-insights',
    departmentName: 'Analytics & Insights',
    description: 'End-to-end analytics from data collection to visualization.',
    signalKeywords: ["analytics","bi","dashboards","data visualization"],
    buyerSignals: ['implement advanced analytics', 'need advanced analytics expertise'],
    painPointSignals: ['slow advanced analytics', 'legacy advanced analytics'],
    recommendedQuestions: ['What are your primary goals for advanced analytics?'],
    recommendedSolutionPackages: ['Advanced Analytics Strategy Audit', 'Advanced Analytics Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'big-data': {
    slug: 'big-data',
    name: 'Big Data Engineering',
    departmentSlug: 'analytics-insights',
    departmentName: 'Analytics & Insights',
    description: 'Scalable data lakes and processing pipelines for massive datasets.',
    signalKeywords: ["big data","hadoop","spark","data lake"],
    buyerSignals: ['implement big data engineering', 'need big data engineering expertise'],
    painPointSignals: ['slow big data engineering', 'legacy big data engineering'],
    recommendedQuestions: ['What are your primary goals for big data engineering?'],
    recommendedSolutionPackages: ['Big Data Engineering Strategy Audit', 'Big Data Engineering Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'managed-cloud-services': {
    slug: 'managed-cloud-services',
    name: 'Managed Cloud Services',
    departmentSlug: 'cloud-engineering',
    departmentName: 'Cloud Engineering',
    description: 'Ongoing management and optimization of cloud infrastructure.',
    signalKeywords: ["managed cloud","cloud operations","cloud support"],
    buyerSignals: ['implement managed cloud services', 'need managed cloud services expertise'],
    painPointSignals: ['slow managed cloud services', 'legacy managed cloud services'],
    recommendedQuestions: ['What are your primary goals for managed cloud services?'],
    recommendedSolutionPackages: ['Managed Cloud Services Strategy Audit', 'Managed Cloud Services Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'aws': {
    slug: 'aws',
    name: 'AWS Cloud Services',
    departmentSlug: 'cloud-engineering',
    departmentName: 'Cloud Engineering',
    description: 'Expert AWS architecture, migration, and management.',
    signalKeywords: ["aws","amazon web services","cloud migration"],
    buyerSignals: ['implement aws cloud services', 'need aws cloud services expertise'],
    painPointSignals: ['slow aws cloud services', 'legacy aws cloud services'],
    recommendedQuestions: ['What are your primary goals for aws cloud services?'],
    recommendedSolutionPackages: ['AWS Cloud Services Strategy Audit', 'AWS Cloud Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'microsoft-services': {
    slug: 'microsoft-services',
    name: 'Microsoft Azure Services',
    departmentSlug: 'cloud-engineering',
    departmentName: 'Cloud Engineering',
    description: 'Comprehensive Azure cloud solutions for enterprise workloads.',
    signalKeywords: ["azure","microsoft cloud","azure migration"],
    buyerSignals: ['implement microsoft azure services', 'need microsoft azure services expertise'],
    painPointSignals: ['slow microsoft azure services', 'legacy microsoft azure services'],
    recommendedQuestions: ['What are your primary goals for microsoft azure services?'],
    recommendedSolutionPackages: ['Microsoft Azure Services Strategy Audit', 'Microsoft Azure Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'google-cloud-services': {
    slug: 'google-cloud-services',
    name: 'Google Cloud Services',
    departmentSlug: 'cloud-engineering',
    departmentName: 'Cloud Engineering',
    description: 'Modernizing applications with GCP-native services.',
    signalKeywords: ["gcp","google cloud","gcp modernization"],
    buyerSignals: ['implement google cloud services', 'need google cloud services expertise'],
    painPointSignals: ['slow google cloud services', 'legacy google cloud services'],
    recommendedQuestions: ['What are your primary goals for google cloud services?'],
    recommendedSolutionPackages: ['Google Cloud Services Strategy Audit', 'Google Cloud Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'cloud-computing': {
    slug: 'cloud-computing',
    name: 'Cloud Computing Strategy',
    departmentSlug: 'cloud-engineering',
    departmentName: 'Cloud Engineering',
    description: 'Strategic roadmaps for cloud adoption and modernization.',
    signalKeywords: ["cloud strategy","multi-cloud","hybrid cloud"],
    buyerSignals: ['implement cloud computing strategy', 'need cloud computing strategy expertise'],
    painPointSignals: ['slow cloud computing strategy', 'legacy cloud computing strategy'],
    recommendedQuestions: ['What are your primary goals for cloud computing strategy?'],
    recommendedSolutionPackages: ['Cloud Computing Strategy Audit', 'Cloud Computing Strategy Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'it-security-services': {
    slug: 'it-security-services',
    name: 'IT Security Services',
    departmentSlug: 'cybersecurity',
    departmentName: 'Cybersecurity',
    description: 'End-to-end security audits, threat detection, and remediation.',
    signalKeywords: ["cybersecurity","it security","penetration testing","soc"],
    buyerSignals: ['implement it security services', 'need it security services expertise'],
    painPointSignals: ['slow it security services', 'legacy it security services'],
    recommendedQuestions: ['What are your primary goals for it security services?'],
    recommendedSolutionPackages: ['IT Security Services Strategy Audit', 'IT Security Services Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'application-modernization': {
    slug: 'application-modernization',
    name: 'Application Modernization',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Refactoring legacy applications into cloud-native microservices.',
    signalKeywords: ["modernization","refactoring","cloud-native"],
    buyerSignals: ['implement application modernization', 'need application modernization expertise'],
    painPointSignals: ['slow application modernization', 'legacy application modernization'],
    recommendedQuestions: ['What are your primary goals for application modernization?'],
    recommendedSolutionPackages: ['Application Modernization Strategy Audit', 'Application Modernization Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'digital-transformation': {
    slug: 'digital-transformation',
    name: 'Digital Transformation',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Holistic business transformation through digital technology.',
    signalKeywords: ["digital transformation","dx","business evolution"],
    buyerSignals: ['implement digital transformation', 'need digital transformation expertise'],
    painPointSignals: ['slow digital transformation', 'legacy digital transformation'],
    recommendedQuestions: ['What are your primary goals for digital transformation?'],
    recommendedSolutionPackages: ['Digital Transformation Strategy Audit', 'Digital Transformation Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'legacy-modernization': {
    slug: 'legacy-modernization',
    name: 'Legacy Modernization',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Transforming old systems into agile, modern platforms.',
    signalKeywords: ["legacy systems","mainframe modernization","tech debt"],
    buyerSignals: ['implement legacy modernization', 'need legacy modernization expertise'],
    painPointSignals: ['slow legacy modernization', 'legacy legacy modernization'],
    recommendedQuestions: ['What are your primary goals for legacy modernization?'],
    recommendedSolutionPackages: ['Legacy Modernization Strategy Audit', 'Legacy Modernization Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'technology-modernization': {
    slug: 'technology-modernization',
    name: 'Technology Modernization',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Updating the core technology stack for better performance.',
    signalKeywords: ["stack update","tech refresh","modern architecture"],
    buyerSignals: ['implement technology modernization', 'need technology modernization expertise'],
    painPointSignals: ['slow technology modernization', 'legacy technology modernization'],
    recommendedQuestions: ['What are your primary goals for technology modernization?'],
    recommendedSolutionPackages: ['Technology Modernization Strategy Audit', 'Technology Modernization Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'technology-transformation': {
    slug: 'technology-transformation',
    name: 'Technology Transformation',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Strategic overhaul of technology operations and culture.',
    signalKeywords: ["tech transformation","it operating model"],
    buyerSignals: ['implement technology transformation', 'need technology transformation expertise'],
    painPointSignals: ['slow technology transformation', 'legacy technology transformation'],
    recommendedQuestions: ['What are your primary goals for technology transformation?'],
    recommendedSolutionPackages: ['Technology Transformation Strategy Audit', 'Technology Transformation Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'digital-business-transformation': {
    slug: 'digital-business-transformation',
    name: 'Digital Business Transformation',
    departmentSlug: 'digital-transformation-modernization',
    departmentName: 'Digital Transformation & Modernization',
    description: 'Reimagining business models for the digital economy.',
    signalKeywords: ["business transformation","digital strategy"],
    buyerSignals: ['implement digital business transformation', 'need digital business transformation expertise'],
    painPointSignals: ['slow digital business transformation', 'legacy digital business transformation'],
    recommendedQuestions: ['What are your primary goals for digital business transformation?'],
    recommendedSolutionPackages: ['Digital Business Transformation Strategy Audit', 'Digital Business Transformation Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'digital-process-automation': {
    slug: 'digital-process-automation',
    name: 'Digital Process Automation',
    departmentSlug: 'automation',
    departmentName: 'Automation',
    description: 'Automating end-to-end digital workflows.',
    signalKeywords: ["dpa","workflow automation","process digitizing"],
    buyerSignals: ['implement digital process automation', 'need digital process automation expertise'],
    painPointSignals: ['slow digital process automation', 'legacy digital process automation'],
    recommendedQuestions: ['What are your primary goals for digital process automation?'],
    recommendedSolutionPackages: ['Digital Process Automation Strategy Audit', 'Digital Process Automation Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'robotic-process-automation': {
    slug: 'robotic-process-automation',
    name: 'Robotic Process Automation',
    departmentSlug: 'automation',
    departmentName: 'Automation',
    description: 'Deploying software bots to handle repetitive tasks.',
    signalKeywords: ["rpa","bots","task automation"],
    buyerSignals: ['implement robotic process automation', 'need robotic process automation expertise'],
    painPointSignals: ['slow robotic process automation', 'legacy robotic process automation'],
    recommendedQuestions: ['What are your primary goals for robotic process automation?'],
    recommendedSolutionPackages: ['Robotic Process Automation Strategy Audit', 'Robotic Process Automation Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'business-process-management': {
    slug: 'business-process-management',
    name: 'Business Process Management',
    departmentSlug: 'automation',
    departmentName: 'Automation',
    description: 'Optimizing and automating complex business processes.',
    signalKeywords: ["bpm","process optimization","workflow design"],
    buyerSignals: ['implement business process management', 'need business process management expertise'],
    painPointSignals: ['slow business process management', 'legacy business process management'],
    recommendedQuestions: ['What are your primary goals for business process management?'],
    recommendedSolutionPackages: ['Business Process Management Strategy Audit', 'Business Process Management Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'intelligent-automation': {
    slug: 'intelligent-automation',
    name: 'Intelligent Automation',
    departmentSlug: 'automation',
    departmentName: 'Automation',
    description: 'Combining AI and RPA for smart process automation.',
    signalKeywords: ["intelligent automation","ai-rpa","smart workflow"],
    buyerSignals: ['implement intelligent automation', 'need intelligent automation expertise'],
    painPointSignals: ['slow intelligent automation', 'legacy intelligent automation'],
    recommendedQuestions: ['What are your primary goals for intelligent automation?'],
    recommendedSolutionPackages: ['Intelligent Automation Strategy Audit', 'Intelligent Automation Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'embedded-design-systems': {
    slug: 'embedded-design-systems',
    name: 'Embedded Design Systems',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Creating reusable UI frameworks integrated with development.',
    signalKeywords: ["design systems","ui framework","embedded design"],
    buyerSignals: ['implement embedded design systems', 'need embedded design systems expertise'],
    painPointSignals: ['slow embedded design systems', 'legacy embedded design systems'],
    recommendedQuestions: ['What are your primary goals for embedded design systems?'],
    recommendedSolutionPackages: ['Embedded Design Systems Strategy Audit', 'Embedded Design Systems Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'engineering-foundry': {
    slug: 'engineering-foundry',
    name: 'Engineering Foundry',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Accelerated engineering teams for rapid product delivery.',
    signalKeywords: ["foundry","rapid engineering","dev team"],
    buyerSignals: ['implement engineering foundry', 'need engineering foundry expertise'],
    painPointSignals: ['slow engineering foundry', 'legacy engineering foundry'],
    recommendedQuestions: ['What are your primary goals for engineering foundry?'],
    recommendedSolutionPackages: ['Engineering Foundry Strategy Audit', 'Engineering Foundry Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'engineering-rd-services': {
    slug: 'engineering-rd-services',
    name: 'Engineering R&D Services',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Research and development for innovative engineering solutions.',
    signalKeywords: ["rd","innovation engineering","research"],
    buyerSignals: ['implement engineering r&d services', 'need engineering r&d services expertise'],
    painPointSignals: ['slow engineering r&d services', 'legacy engineering r&d services'],
    recommendedQuestions: ['What are your primary goals for engineering r&d services?'],
    recommendedSolutionPackages: ['Engineering R&D Services Strategy Audit', 'Engineering R&D Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'product-digital-engineering': {
    slug: 'product-digital-engineering',
    name: 'Product & Digital Engineering',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Full-lifecycle product engineering from ideation to launch.',
    signalKeywords: ["product engineering","digital engineering"],
    buyerSignals: ['implement product & digital engineering', 'need product & digital engineering expertise'],
    painPointSignals: ['slow product & digital engineering', 'legacy product & digital engineering'],
    recommendedQuestions: ['What are your primary goals for product & digital engineering?'],
    recommendedSolutionPackages: ['Product & Digital Engineering Strategy Audit', 'Product & Digital Engineering Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'quality-engineering-assurance': {
    slug: 'quality-engineering-assurance',
    name: 'Quality Engineering & Assurance',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Ensuring product excellence through automated testing.',
    signalKeywords: ["qa","quality engineering","automation testing"],
    buyerSignals: ['implement quality engineering & assurance', 'need quality engineering & assurance expertise'],
    painPointSignals: ['slow quality engineering & assurance', 'legacy quality engineering & assurance'],
    recommendedQuestions: ['What are your primary goals for quality engineering & assurance?'],
    recommendedSolutionPackages: ['Quality Engineering & Assurance Strategy Audit', 'Quality Engineering & Assurance Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'devops-as-a-service': {
    slug: 'devops-as-a-service',
    name: 'DevOps As A Service',
    departmentSlug: 'product-engineering',
    departmentName: 'Product Engineering',
    description: 'Managed DevOps, CI/CD, and site reliability engineering.',
    signalKeywords: ["devops","cicd","sre","managed devops"],
    buyerSignals: ['implement devops as a service', 'need devops as a service expertise'],
    painPointSignals: ['slow devops as a service', 'legacy devops as a service'],
    recommendedQuestions: ['What are your primary goals for devops as a service?'],
    recommendedSolutionPackages: ['DevOps As A Service Strategy Audit', 'DevOps As A Service Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'managed-infrastructure-services': {
    slug: 'managed-infrastructure-services',
    name: 'Managed Infrastructure Services',
    departmentSlug: 'infrastructure-networks-operations',
    departmentName: 'Infrastructure, Networks & Operations',
    description: 'Full-stack infrastructure management and monitoring.',
    signalKeywords: ["it infrastructure","managed services","it ops"],
    buyerSignals: ['implement managed infrastructure services', 'need managed infrastructure services expertise'],
    painPointSignals: ['slow managed infrastructure services', 'legacy managed infrastructure services'],
    recommendedQuestions: ['What are your primary goals for managed infrastructure services?'],
    recommendedSolutionPackages: ['Managed Infrastructure Services Strategy Audit', 'Managed Infrastructure Services Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'modernization-infrastructure': {
    slug: 'modernization-infrastructure',
    name: 'Infrastructure Modernization',
    departmentSlug: 'infrastructure-networks-operations',
    departmentName: 'Infrastructure, Networks & Operations',
    description: 'Updating networks and data centers for the cloud era.',
    signalKeywords: ["network modernization","data center refresh"],
    buyerSignals: ['implement infrastructure modernization', 'need infrastructure modernization expertise'],
    painPointSignals: ['slow infrastructure modernization', 'legacy infrastructure modernization'],
    recommendedQuestions: ['What are your primary goals for infrastructure modernization?'],
    recommendedSolutionPackages: ['Infrastructure Modernization Strategy Audit', 'Infrastructure Modernization Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'managed-services': {
    slug: 'managed-services',
    name: 'Managed Services',
    departmentSlug: 'infrastructure-networks-operations',
    departmentName: 'Infrastructure, Networks & Operations',
    description: 'Reliable, outsourced IT management and support.',
    signalKeywords: ["it managed services","outsourced it"],
    buyerSignals: ['implement managed services', 'need managed services expertise'],
    painPointSignals: ['slow managed services', 'legacy managed services'],
    recommendedQuestions: ['What are your primary goals for managed services?'],
    recommendedSolutionPackages: ['Managed Services Strategy Audit', 'Managed Services Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'support-maintenance': {
    slug: 'support-maintenance',
    name: 'Support & Maintenance',
    departmentSlug: 'infrastructure-networks-operations',
    departmentName: 'Infrastructure, Networks & Operations',
    description: 'Continuous support and maintenance for legacy and modern apps.',
    signalKeywords: ["it support","app maintenance","ticketing"],
    buyerSignals: ['implement support & maintenance', 'need support & maintenance expertise'],
    painPointSignals: ['slow support & maintenance', 'legacy support & maintenance'],
    recommendedQuestions: ['What are your primary goals for support & maintenance?'],
    recommendedSolutionPackages: ['Support & Maintenance Strategy Audit', 'Support & Maintenance Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'operation-technology': {
    slug: 'operation-technology',
    name: 'Operation Technology',
    departmentSlug: 'infrastructure-networks-operations',
    departmentName: 'Infrastructure, Networks & Operations',
    description: 'Specialized technology for industrial and operational control.',
    signalKeywords: ["ot","industrial it","operational tech"],
    buyerSignals: ['implement operation technology', 'need operation technology expertise'],
    painPointSignals: ['slow operation technology', 'legacy operation technology'],
    recommendedQuestions: ['What are your primary goals for operation technology?'],
    recommendedSolutionPackages: ['Operation Technology Strategy Audit', 'Operation Technology Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'technology-consulting': {
    slug: 'technology-consulting',
    name: 'Technology Consulting',
    departmentSlug: 'consulting-advisory',
    departmentName: 'Consulting & Advisory',
    description: 'Expert advice on technology strategy and architecture.',
    signalKeywords: ["tech consulting","it strategy","advisory"],
    buyerSignals: ['implement technology consulting', 'need technology consulting expertise'],
    painPointSignals: ['slow technology consulting', 'legacy technology consulting'],
    recommendedQuestions: ['What are your primary goals for technology consulting?'],
    recommendedSolutionPackages: ['Technology Consulting Strategy Audit', 'Technology Consulting Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'strategy-consulting': {
    slug: 'strategy-consulting',
    name: 'Strategy Consulting',
    departmentSlug: 'consulting-advisory',
    departmentName: 'Consulting & Advisory',
    description: 'Business strategy aligned with digital capability.',
    signalKeywords: ["business strategy","digital strategy"],
    buyerSignals: ['implement strategy consulting', 'need strategy consulting expertise'],
    painPointSignals: ['slow strategy consulting', 'legacy strategy consulting'],
    recommendedQuestions: ['What are your primary goals for strategy consulting?'],
    recommendedSolutionPackages: ['Strategy Consulting Strategy Audit', 'Strategy Consulting Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'discover-frame-workshops': {
    slug: 'discover-frame-workshops',
    name: 'Discover & Frame Workshops',
    departmentSlug: 'consulting-advisory',
    departmentName: 'Consulting & Advisory',
    description: 'Collaborative workshops to define product and tech vision.',
    signalKeywords: ["workshops","discovery","framing"],
    buyerSignals: ['implement discover & frame workshops', 'need discover & frame workshops expertise'],
    painPointSignals: ['slow discover & frame workshops', 'legacy discover & frame workshops'],
    recommendedQuestions: ['What are your primary goals for discover & frame workshops?'],
    recommendedSolutionPackages: ['Discover & Frame Workshops Strategy Audit', 'Discover & Frame Workshops Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'mvp-acceleration': {
    slug: 'mvp-acceleration',
    name: 'MVP Acceleration',
    departmentSlug: 'digital-engineering',
    departmentName: 'Digital Engineering',
    description: 'Rapidly building and launching Minimum Viable Products.',
    signalKeywords: ["mvp","rapid prototyping","startup acceleration"],
    buyerSignals: ['implement mvp acceleration', 'need mvp acceleration expertise'],
    painPointSignals: ['slow mvp acceleration', 'legacy mvp acceleration'],
    recommendedQuestions: ['What are your primary goals for mvp acceleration?'],
    recommendedSolutionPackages: ['MVP Acceleration Strategy Audit', 'MVP Acceleration Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'product-strategy-experience-design': {
    slug: 'product-strategy-experience-design',
    name: 'Product Strategy & UX Design',
    departmentSlug: 'digital-engineering',
    departmentName: 'Digital Engineering',
    description: 'Combining strategic vision with user-centric design.',
    signalKeywords: ["ux design","product strategy","user experience"],
    buyerSignals: ['implement product strategy & ux design', 'need product strategy & ux design expertise'],
    painPointSignals: ['slow product strategy & ux design', 'legacy product strategy & ux design'],
    recommendedQuestions: ['What are your primary goals for product strategy & ux design?'],
    recommendedSolutionPackages: ['Product Strategy & UX Design Strategy Audit', 'Product Strategy & UX Design Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'software-development': {
    slug: 'software-development',
    name: 'Software Development',
    departmentSlug: 'digital-engineering',
    departmentName: 'Digital Engineering',
    description: 'Custom software engineering across all major platforms.',
    signalKeywords: ["app dev","custom software","web dev"],
    buyerSignals: ['implement software development', 'need software development expertise'],
    painPointSignals: ['slow software development', 'legacy software development'],
    recommendedQuestions: ['What are your primary goals for software development?'],
    recommendedSolutionPackages: ['Software Development Strategy Audit', 'Software Development Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'api-microservices-engineering': {
    slug: 'api-microservices-engineering',
    name: 'API & Microservices Engineering',
    departmentSlug: 'digital-engineering',
    departmentName: 'Digital Engineering',
    description: 'Building scalable, decoupled architectures with modern APIs.',
    signalKeywords: ["api","microservices","rest","graphql"],
    buyerSignals: ['implement api & microservices engineering', 'need api & microservices engineering expertise'],
    painPointSignals: ['slow api & microservices engineering', 'legacy api & microservices engineering'],
    recommendedQuestions: ['What are your primary goals for api & microservices engineering?'],
    recommendedSolutionPackages: ['API & Microservices Engineering Strategy Audit', 'API & Microservices Engineering Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'enterprise-platform-integration': {
    slug: 'enterprise-platform-integration',
    name: 'Enterprise Platform Integration',
    departmentSlug: 'enterprise-applications',
    departmentName: 'Enterprise Applications',
    description: 'Connecting complex enterprise platforms for seamless data flow.',
    signalKeywords: ["integration","middleware","enterprise bus"],
    buyerSignals: ['implement enterprise platform integration', 'need enterprise platform integration expertise'],
    painPointSignals: ['slow enterprise platform integration', 'legacy enterprise platform integration'],
    recommendedQuestions: ['What are your primary goals for enterprise platform integration?'],
    recommendedSolutionPackages: ['Enterprise Platform Integration Strategy Audit', 'Enterprise Platform Integration Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'pimcore': {
    slug: 'pimcore',
    name: 'Pimcore Development',
    departmentSlug: 'enterprise-applications',
    departmentName: 'Enterprise Applications',
    description: 'Specialized Pimcore implementation for MDM and PIM.',
    signalKeywords: ["pimcore","mdm","pim","digital asset management"],
    buyerSignals: ['implement pimcore development', 'need pimcore development expertise'],
    painPointSignals: ['slow pimcore development', 'legacy pimcore development'],
    recommendedQuestions: ['What are your primary goals for pimcore development?'],
    recommendedSolutionPackages: ['Pimcore Development Strategy Audit', 'Pimcore Development Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'salesforce': {
    slug: 'salesforce',
    name: 'Salesforce Services',
    departmentSlug: 'enterprise-applications',
    departmentName: 'Enterprise Applications',
    description: 'Customizing and integrating Salesforce for CRM excellence.',
    signalKeywords: ["salesforce","crm","sales cloud","service cloud"],
    buyerSignals: ['implement salesforce services', 'need salesforce services expertise'],
    painPointSignals: ['slow salesforce services', 'legacy salesforce services'],
    recommendedQuestions: ['What are your primary goals for salesforce services?'],
    recommendedSolutionPackages: ['Salesforce Services Strategy Audit', 'Salesforce Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'servicenow': {
    slug: 'servicenow',
    name: 'ServiceNow Services',
    departmentSlug: 'enterprise-applications',
    departmentName: 'Enterprise Applications',
    description: 'Implementing ServiceNow for ITSM and business workflows.',
    signalKeywords: ["servicenow","itsm","workflow automation"],
    buyerSignals: ['implement servicenow services', 'need servicenow services expertise'],
    painPointSignals: ['slow servicenow services', 'legacy servicenow services'],
    recommendedQuestions: ['What are your primary goals for servicenow services?'],
    recommendedSolutionPackages: ['ServiceNow Services Strategy Audit', 'ServiceNow Services Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'blockchain': {
    slug: 'blockchain',
    name: 'Blockchain & Web3',
    departmentSlug: 'emerging-technologies',
    departmentName: 'Emerging Technologies',
    description: 'Decentralized solutions and smart contract development.',
    signalKeywords: ["blockchain","web3","smart contracts"],
    buyerSignals: ['implement blockchain & web3', 'need blockchain & web3 expertise'],
    painPointSignals: ['slow blockchain & web3', 'legacy blockchain & web3'],
    recommendedQuestions: ['What are your primary goals for blockchain & web3?'],
    recommendedSolutionPackages: ['Blockchain & Web3 Strategy Audit', 'Blockchain & Web3 Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'internet-of-things': {
    slug: 'internet-of-things',
    name: 'Internet of Things (IoT)',
    departmentSlug: 'emerging-technologies',
    departmentName: 'Emerging Technologies',
    description: 'Connecting devices and processing edge data for real-time insights.',
    signalKeywords: ["iot","edge computing","connected devices"],
    buyerSignals: ['implement internet of things (iot)', 'need internet of things (iot) expertise'],
    painPointSignals: ['slow internet of things (iot)', 'legacy internet of things (iot)'],
    recommendedQuestions: ['What are your primary goals for internet of things (iot)?'],
    recommendedSolutionPackages: ['Internet of Things (IoT) Strategy Audit', 'Internet of Things (IoT) Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'finance-risk-management': {
    slug: 'finance-risk-management',
    name: 'Finance & Risk Management',
    departmentSlug: 'business-operations',
    departmentName: 'Business Operations',
    description: 'Modernizing finance operations and risk assessment tools.',
    signalKeywords: ["finance tech","risk management","compliance"],
    buyerSignals: ['implement finance & risk management', 'need finance & risk management expertise'],
    painPointSignals: ['slow finance & risk management', 'legacy finance & risk management'],
    recommendedQuestions: ['What are your primary goals for finance & risk management?'],
    recommendedSolutionPackages: ['Finance & Risk Management Strategy Audit', 'Finance & Risk Management Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'global-capability-centers': {
    slug: 'global-capability-centers',
    name: 'Global Capability Centers (GCC)',
    departmentSlug: 'business-operations',
    departmentName: 'Business Operations',
    description: 'Setting up and managing offshore capability centers.',
    signalKeywords: ["gcc","offshore center","global delivery"],
    buyerSignals: ['implement global capability centers (gcc)', 'need global capability centers (gcc) expertise'],
    painPointSignals: ['slow global capability centers (gcc)', 'legacy global capability centers (gcc)'],
    recommendedQuestions: ['What are your primary goals for global capability centers (gcc)?'],
    recommendedSolutionPackages: ['Global Capability Centers (GCC) Strategy Audit', 'Global Capability Centers (GCC) Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'talent-organization': {
    slug: 'talent-organization',
    name: 'Talent & Organization',
    departmentSlug: 'business-operations',
    departmentName: 'Business Operations',
    description: 'Technology for HR, talent management, and organizational growth.',
    signalKeywords: ["hr tech","talent management","people ops"],
    buyerSignals: ['implement talent & organization', 'need talent & organization expertise'],
    painPointSignals: ['slow talent & organization', 'legacy talent & organization'],
    recommendedQuestions: ['What are your primary goals for talent & organization?'],
    recommendedSolutionPackages: ['Talent & Organization Strategy Audit', 'Talent & Organization Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'supply-chain': {
    slug: 'supply-chain',
    name: 'Supply Chain Optimization',
    departmentSlug: 'business-operations',
    departmentName: 'Business Operations',
    description: 'Digitizing and optimizing end-to-end supply chains.',
    signalKeywords: ["supply chain","logistics tech","inventory management"],
    buyerSignals: ['implement supply chain optimization', 'need supply chain optimization expertise'],
    painPointSignals: ['slow supply chain optimization', 'legacy supply chain optimization'],
    recommendedQuestions: ['What are your primary goals for supply chain optimization?'],
    recommendedSolutionPackages: ['Supply Chain Optimization Strategy Audit', 'Supply Chain Optimization Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'unified-services-management': {
    slug: 'unified-services-management',
    name: 'Unified Services Management',
    departmentSlug: 'business-operations',
    departmentName: 'Business Operations',
    description: 'Integrated management of all business services.',
    signalKeywords: ["unified services","esm","service management"],
    buyerSignals: ['implement unified services management', 'need unified services management expertise'],
    painPointSignals: ['slow unified services management', 'legacy unified services management'],
    recommendedQuestions: ['What are your primary goals for unified services management?'],
    recommendedSolutionPackages: ['Unified Services Management Strategy Audit', 'Unified Services Management Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'cdp-strategy': {
    slug: 'cdp-strategy',
    name: 'CDP Strategy & Implementation',
    departmentSlug: 'digital-marketing',
    departmentName: 'Digital Marketing',
    description: 'Unified customer data platforms for personalized marketing.',
    signalKeywords: ["cdp","customer data","segmentation"],
    buyerSignals: ['implement cdp strategy & implementation', 'need cdp strategy & implementation expertise'],
    painPointSignals: ['slow cdp strategy & implementation', 'legacy cdp strategy & implementation'],
    recommendedQuestions: ['What are your primary goals for cdp strategy & implementation?'],
    recommendedSolutionPackages: ['CDP Strategy & Implementation Strategy Audit', 'CDP Strategy & Implementation Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'marketing-ai-readiness': {
    slug: 'marketing-ai-readiness',
    name: 'Marketing AI Readiness',
    departmentSlug: 'digital-marketing',
    departmentName: 'Digital Marketing',
    description: 'Preparing marketing teams to leverage AI tools effectively.',
    signalKeywords: ["marketing ai","ai readiness","martech"],
    buyerSignals: ['implement marketing ai readiness', 'need marketing ai readiness expertise'],
    painPointSignals: ['slow marketing ai readiness', 'legacy marketing ai readiness'],
    recommendedQuestions: ['What are your primary goals for marketing ai readiness?'],
    recommendedSolutionPackages: ['Marketing AI Readiness Strategy Audit', 'Marketing AI Readiness Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'social-media-management': {
    slug: 'social-media-management',
    name: 'Social Media Management',
    departmentSlug: 'digital-marketing',
    departmentName: 'Digital Marketing',
    description: 'Strategic social media operations driven by data.',
    signalKeywords: ["social media","engagement","brand management"],
    buyerSignals: ['implement social media management', 'need social media management expertise'],
    painPointSignals: ['slow social media management', 'legacy social media management'],
    recommendedQuestions: ['What are your primary goals for social media management?'],
    recommendedSolutionPackages: ['Social Media Management Strategy Audit', 'Social Media Management Implementation Roadmap'],
    priorityLevel: 'standard'
  },
  'performance-marketing': {
    slug: 'performance-marketing',
    name: 'Performance Marketing',
    departmentSlug: 'digital-marketing',
    departmentName: 'Digital Marketing',
    description: 'Data-driven marketing focused on measurable ROI.',
    signalKeywords: ["paid ads","performance marketing","roi"],
    buyerSignals: ['implement performance marketing', 'need performance marketing expertise'],
    painPointSignals: ['slow performance marketing', 'legacy performance marketing'],
    recommendedQuestions: ['What are your primary goals for performance marketing?'],
    recommendedSolutionPackages: ['Performance Marketing Strategy Audit', 'Performance Marketing Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'seo-organic-growth-strategy': {
    slug: 'seo-organic-growth-strategy',
    name: 'SEO & Organic Growth',
    departmentSlug: 'digital-marketing',
    departmentName: 'Digital Marketing',
    description: 'Technical SEO and content strategy for organic visibility.',
    signalKeywords: ["seo","organic growth","search ranking"],
    buyerSignals: ['implement seo & organic growth', 'need seo & organic growth expertise'],
    painPointSignals: ['slow seo & organic growth', 'legacy seo & organic growth'],
    recommendedQuestions: ['What are your primary goals for seo & organic growth?'],
    recommendedSolutionPackages: ['SEO & Organic Growth Strategy Audit', 'SEO & Organic Growth Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'growth-funnels-conversion-engineering': {
    slug: 'growth-funnels-conversion-engineering',
    name: 'Conversion Engineering',
    departmentSlug: 'conversion-engineering',
    departmentName: 'Conversion Engineering',
    description: 'Specialized optimization of growth funnels and checkout flows.',
    signalKeywords: ["conversion engineering","funnel optimization"],
    buyerSignals: ['implement conversion engineering', 'need conversion engineering expertise'],
    painPointSignals: ['slow conversion engineering', 'legacy conversion engineering'],
    recommendedQuestions: ['What are your primary goals for conversion engineering?'],
    recommendedSolutionPackages: ['Conversion Engineering Strategy Audit', 'Conversion Engineering Implementation Roadmap'],
    priorityLevel: 'strategic'
  },
  'conversion-rate-optimization': {
    slug: 'conversion-rate-optimization',
    name: 'Conversion Rate Optimization (CRO)',
    departmentSlug: 'conversion-engineering',
    departmentName: 'Conversion Engineering',
    description: 'A/B testing and UX improvements to increase conversion.',
    signalKeywords: ["cro","ab testing","conversion"],
    buyerSignals: ['implement conversion rate optimization (cro)', 'need conversion rate optimization (cro) expertise'],
    painPointSignals: ['slow conversion rate optimization (cro)', 'legacy conversion rate optimization (cro)'],
    recommendedQuestions: ['What are your primary goals for conversion rate optimization (cro)?'],
    recommendedSolutionPackages: ['Conversion Rate Optimization (CRO) Strategy Audit', 'Conversion Rate Optimization (CRO) Implementation Roadmap'],
    priorityLevel: 'high'
  },
  'campaign-planning': {
    slug: 'campaign-planning',
    name: 'Campaign Planning',
    departmentSlug: 'conversion-engineering',
    departmentName: 'Conversion Engineering',
    description: 'Strategic planning for high-conversion marketing campaigns.',
    signalKeywords: ["campaigns","marketing planning","conversion"],
    buyerSignals: ['implement campaign planning', 'need campaign planning expertise'],
    painPointSignals: ['slow campaign planning', 'legacy campaign planning'],
    recommendedQuestions: ['What are your primary goals for campaign planning?'],
    recommendedSolutionPackages: ['Campaign Planning Strategy Audit', 'Campaign Planning Implementation Roadmap'],
    priorityLevel: 'standard'
  }
};

