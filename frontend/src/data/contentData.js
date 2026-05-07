// Content data for Blogs, Case Studies, White Papers, Events, and Brochures
// This file serves as the source of truth for all content pages

export const blogsData = [
  {
    id: 'future-ai-enterprise',
    slug: 'future-ai-enterprise',
    title: 'The Future of AI in Enterprise',
    excerpt: 'Exploring how artificial intelligence is reshaping business operations and driving innovation across industries.',
    content: 'Full article content goes here...',
    author: 'Dr. Sarah Chen',
    date: 'Dec 20, 2024',
    category: 'AI & ML',
    readTime: '5 min',
    tags: ['AI', 'Enterprise', 'Innovation'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
  },
  {
    id: 'cloud-migration-best-practices',
    slug: 'cloud-migration-best-practices',
    title: 'Cloud Migration Best Practices',
    excerpt: 'A comprehensive guide to successful cloud transformation with real-world examples and expert insights.',
    content: 'Full article content goes here...',
    author: 'Michael Rodriguez',
    date: 'Dec 18, 2024',
    category: 'Cloud',
    readTime: '8 min',
    tags: ['Cloud', 'Migration', 'Best Practices'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
  },
  {
    id: 'cybersecurity-trends-2025',
    slug: 'cybersecurity-trends-2025',
    title: 'Cybersecurity Trends 2025',
    excerpt: 'What enterprises need to know about emerging security threats and defense strategies.',
    content: 'Full article content goes here...',
    author: 'Emily Johnson',
    date: 'Dec 15, 2024',
    category: 'Security',
    readTime: '6 min',
    tags: ['Security', 'Trends', 'Enterprise'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'
  },
  {
    id: 'digital-transformation-roi',
    slug: 'digital-transformation-roi',
    title: 'Digital Transformation ROI',
    excerpt: 'Measuring the real business impact of digital initiatives and maximizing return on investment.',
    content: 'Full article content goes here...',
    author: 'David Kumar',
    date: 'Dec 12, 2024',
    category: 'Strategy',
    readTime: '7 min',
    tags: ['Strategy', 'ROI', 'Transformation'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  },
  {
    id: 'microservices-architecture-guide',
    slug: 'microservices-architecture-guide',
    title: 'Microservices Architecture Guide',
    excerpt: 'Building scalable applications with modern architecture patterns and best practices.',
    content: 'Full article content goes here...',
    author: 'Lisa Wong',
    date: 'Dec 10, 2024',
    category: 'Engineering',
    readTime: '10 min',
    tags: ['Architecture', 'Microservices', 'Development'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
  },
  {
    id: 'data-analytics-decision-making',
    slug: 'data-analytics-decision-making',
    title: 'Data Analytics for Decision Making',
    excerpt: 'Leveraging data to drive strategic business decisions and competitive advantage.',
    content: 'Full article content goes here...',
    author: 'Robert Taylor',
    date: 'Dec 8, 2024',
    category: 'Analytics',
    readTime: '6 min',
    tags: ['Analytics', 'Data', 'Strategy'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
  }
];

export const caseStudiesData = [
  {
    id: 'global-bank-transformation',
    slug: 'global-bank-transformation',
    title: 'Global Bank Digital Transformation',
    industry: 'Banking',
    result: '40% cost reduction',
    description: 'Complete digital overhaul of legacy banking systems with cloud migration and AI integration.',
    challenge: 'Legacy systems, regulatory compliance, customer experience',
    solution: 'Cloud-native architecture, AI-powered services, agile transformation',
    outcome: '40% cost reduction, 3x faster processing, 95% customer satisfaction',
    client: 'Fortune 500 Bank',
    duration: '18 months',
    technologies: ['AWS', 'Kubernetes', 'React', 'Python', 'TensorFlow'],
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800'
  },
  {
    id: 'healthcare-platform-modernization',
    slug: 'healthcare-platform-modernization',
    title: 'Healthcare Platform Modernization',
    industry: 'Healthcare',
    result: '3x faster processing',
    description: 'Cloud migration and AI integration for patient care improvement.',
    challenge: 'Data security, system integration, scalability',
    solution: 'HIPAA-compliant cloud platform, ML-powered diagnostics',
    outcome: '3x faster processing, 99.9% uptime, improved patient outcomes',
    client: 'Major Healthcare Provider',
    duration: '12 months',
    technologies: ['Azure', 'Node.js', 'MongoDB', 'Python'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
  },
  {
    id: 'retail-analytics-implementation',
    slug: 'retail-analytics-implementation',
    title: 'Retail Analytics Implementation',
    industry: 'Retail',
    result: '25% revenue increase',
    description: 'Real-time analytics platform for customer insights and personalization.',
    challenge: 'Data silos, real-time processing, customer insights',
    solution: 'Unified data platform, real-time analytics, ML recommendations',
    outcome: '25% revenue increase, 60% better conversion, personalized experiences',
    client: 'Leading Retail Chain',
    duration: '9 months',
    technologies: ['Google Cloud', 'BigQuery', 'React', 'Python'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
  },
  {
    id: 'insurance-claims-automation',
    slug: 'insurance-claims-automation',
    title: 'Insurance Claims Automation',
    industry: 'Insurance',
    result: '80% faster claims',
    description: 'AI-powered claims processing system with automated validation.',
    challenge: 'Manual processes, fraud detection, customer satisfaction',
    solution: 'AI claims processing, automated fraud detection, mobile app',
    outcome: '80% faster processing, 50% cost reduction, improved accuracy',
    client: 'Insurance Company',
    duration: '10 months',
    technologies: ['AWS', 'Python', 'TensorFlow', 'React Native'],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800'
  },
  {
    id: 'manufacturing-iot-solution',
    slug: 'manufacturing-iot-solution',
    title: 'Manufacturing IoT Solution',
    industry: 'Manufacturing',
    result: '50% efficiency gain',
    description: 'Smart factory implementation with IoT sensors and predictive maintenance.',
    challenge: 'Equipment downtime, quality control, operational efficiency',
    solution: 'IoT sensors, predictive maintenance AI, real-time monitoring',
    outcome: '50% efficiency gain, 70% less downtime, improved quality',
    client: 'Global Manufacturer',
    duration: '15 months',
    technologies: ['Azure IoT', 'Python', 'Power BI', 'Edge Computing'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
  },
  {
    id: 'edtech-learning-platform',
    slug: 'edtech-learning-platform',
    title: 'EdTech Learning Platform',
    industry: 'Education',
    result: '2M+ users',
    description: 'Scalable e-learning platform with personalized learning paths.',
    challenge: 'Scalability, engagement, personalization',
    solution: 'Cloud-native platform, AI personalization, gamification',
    outcome: '2M+ active users, 85% completion rate, global reach',
    client: 'Education Technology Company',
    duration: '14 months',
    technologies: ['AWS', 'React', 'Node.js', 'MongoDB', 'ML'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
  }
];

export const whitePapersData = [
  {
    id: 'state-enterprise-ai-2025',
    slug: 'state-enterprise-ai-2025',
    title: 'The State of Enterprise AI 2025',
    description: 'Comprehensive analysis of AI adoption trends and best practices across industries.',
    date: 'Dec 2024',
    downloads: '2,500+',
    pages: 45,
    fileUrl: '/assets/whitepapers/enterprise-ai-2025.pdf',
    topics: ['AI Adoption', 'Best Practices', 'ROI Analysis', 'Case Studies'],
    authors: ['Dr. Sarah Chen', 'Michael Rodriguez']
  },
  {
    id: 'cloud-security-framework',
    slug: 'cloud-security-framework',
    title: 'Cloud Security Framework',
    description: 'A strategic approach to securing cloud infrastructure with proven methodologies.',
    date: 'Nov 2024',
    downloads: '1,800+',
    pages: 38,
    fileUrl: '/assets/whitepapers/cloud-security-framework.pdf',
    topics: ['Security', 'Compliance', 'Best Practices', 'Architecture'],
    authors: ['Emily Johnson', 'David Kumar']
  },
  {
    id: 'digital-transformation-roadmap',
    slug: 'digital-transformation-roadmap',
    title: 'Digital Transformation Roadmap',
    description: 'Step-by-step guide to successful digital initiatives and transformation strategy.',
    date: 'Oct 2024',
    downloads: '3,200+',
    pages: 52,
    fileUrl: '/assets/whitepapers/digital-transformation-roadmap.pdf',
    topics: ['Strategy', 'Implementation', 'Change Management', 'ROI'],
    authors: ['Lisa Wong', 'Robert Taylor']
  },
  {
    id: 'future-work-report',
    slug: 'future-work-report',
    title: 'Future of Work Report',
    description: 'How technology is reshaping the modern workplace and workforce dynamics.',
    date: 'Sep 2024',
    downloads: '2,100+',
    pages: 41,
    fileUrl: '/assets/whitepapers/future-of-work.pdf',
    topics: ['Remote Work', 'Collaboration', 'AI Tools', 'Productivity'],
    authors: ['Dr. Sarah Chen', 'Emily Johnson']
  },
  {
    id: 'data-analytics-maturity-model',
    slug: 'data-analytics-maturity-model',
    title: 'Data Analytics Maturity Model',
    description: 'Assessing and advancing your analytics capabilities for competitive advantage.',
    date: 'Aug 2024',
    downloads: '1,500+',
    pages: 35,
    fileUrl: '/assets/whitepapers/analytics-maturity-model.pdf',
    topics: ['Analytics', 'Data Strategy', 'Maturity Assessment', 'Implementation'],
    authors: ['Robert Taylor', 'Michael Rodriguez']
  },
  {
    id: 'microservices-best-practices',
    slug: 'microservices-best-practices',
    title: 'Microservices Best Practices',
    description: 'Architecture patterns for scalable applications with real-world examples.',
    date: 'Jul 2024',
    downloads: '1,900+',
    pages: 43,
    fileUrl: '/assets/whitepapers/microservices-guide.pdf',
    topics: ['Architecture', 'Scalability', 'DevOps', 'Cloud Native'],
    authors: ['Lisa Wong', 'David Kumar']
  }
];

export const eventsData = [
  {
    id: 'ai-summit-2025',
    slug: 'ai-summit-2025',
    title: 'AI Summit 2025',
    date: 'Jan 15-17, 2025',
    location: 'New York, NY',
    type: 'Conference',
    format: 'In-Person',
    description: 'Join industry leaders to explore the latest in AI and machine learning.',
    agenda: ['Keynotes from AI pioneers', 'Technical workshops', 'Networking sessions'],
    speakers: ['Dr. Sarah Chen', 'Michael Rodriguez', 'Industry Experts'],
    registrationUrl: 'https://example.com/register',
    status: 'upcoming'
  },
  {
    id: 'cloud-transformation-workshop',
    slug: 'cloud-transformation-workshop',
    title: 'Cloud Transformation Workshop',
    date: 'Jan 22, 2025',
    location: 'Virtual',
    type: 'Workshop',
    format: 'Online',
    description: 'Hands-on workshop for planning and executing cloud transformation.',
    agenda: ['Cloud strategy', 'Migration planning', 'Security best practices'],
    speakers: ['Emily Johnson', 'David Kumar'],
    registrationUrl: 'https://example.com/register',
    status: 'upcoming'
  },
  {
    id: 'digital-leaders-forum',
    slug: 'digital-leaders-forum',
    title: 'Digital Leaders Forum',
    date: 'Feb 5, 2025',
    location: 'London, UK',
    type: 'Forum',
    format: 'Hybrid',
    description: 'Executive forum for digital transformation leadership and strategy.',
    agenda: ['Leadership insights', 'Panel discussions', 'Networking dinner'],
    speakers: ['C-Level Executives', 'Industry Leaders'],
    registrationUrl: 'https://example.com/register',
    status: 'upcoming'
  },
  {
    id: 'cybersecurity-masterclass',
    slug: 'cybersecurity-masterclass',
    title: 'Cybersecurity Masterclass',
    date: 'Feb 12, 2025',
    location: 'Virtual',
    type: 'Training',
    format: 'Online',
    description: 'Advanced training on enterprise security and threat protection.',
    agenda: ['Threat landscape', 'Security architecture', 'Hands-on labs'],
    speakers: ['Emily Johnson', 'Security Experts'],
    registrationUrl: 'https://example.com/register',
    status: 'upcoming'
  },
  // Past Events
  {
    id: 'tech-innovation-summit-2024',
    slug: 'tech-innovation-summit-2024',
    title: 'Tech Innovation Summit 2024',
    date: 'Nov 20, 2024',
    location: 'San Francisco, CA',
    attendees: '500+',
    type: 'Conference',
    format: 'In-Person',
    status: 'past'
  },
  {
    id: 'enterprise-ai-conference',
    slug: 'enterprise-ai-conference',
    title: 'Enterprise AI Conference',
    date: 'Oct 15, 2024',
    location: 'Boston, MA',
    attendees: '350+',
    type: 'Conference',
    format: 'In-Person',
    status: 'past'
  },
  {
    id: 'cloud-strategy-workshop',
    slug: 'cloud-strategy-workshop',
    title: 'Cloud Strategy Workshop',
    date: 'Sep 28, 2024',
    location: 'Virtual',
    attendees: '200+',
    type: 'Workshop',
    format: 'Online',
    status: 'past'
  }
];

export const brochuresData = [
  {
    id: 'company-overview',
    slug: 'company-overview',
    title: 'Company Overview',
    description: 'Complete overview of Kangqore services and capabilities.',
    pages: 24,
    fileUrl: '/assets/brochures/kangqore-company-overview.pdf',
    fileSize: '8.5 MB',
    lastUpdated: 'Dec 2024',
    category: 'Company'
  },
  {
    id: 'ai-ml-solutions',
    slug: 'ai-ml-solutions',
    title: 'AI & Machine Learning Solutions',
    description: 'Our comprehensive AI service offerings and capabilities.',
    pages: 16,
    fileUrl: '/assets/brochures/ai-ml-solutions.pdf',
    fileSize: '5.2 MB',
    lastUpdated: 'Dec 2024',
    category: 'Services'
  },
  {
    id: 'cloud-transformation-guide',
    slug: 'cloud-transformation-guide',
    title: 'Cloud Transformation Guide',
    description: 'End-to-end cloud migration and management services.',
    pages: 20,
    fileUrl: '/assets/brochures/cloud-transformation.pdf',
    fileSize: '6.8 MB',
    lastUpdated: 'Nov 2024',
    category: 'Services'
  },
  {
    id: 'cybersecurity-services',
    slug: 'cybersecurity-services',
    title: 'Cybersecurity Services',
    description: 'Enterprise security solutions and assessments.',
    pages: 12,
    fileUrl: '/assets/brochures/cybersecurity-services.pdf',
    fileSize: '4.3 MB',
    lastUpdated: 'Nov 2024',
    category: 'Services'
  },
  {
    id: 'digital-transformation-playbook',
    slug: 'digital-transformation-playbook',
    title: 'Digital Transformation Playbook',
    description: 'Strategic guide for digital initiatives and implementation.',
    pages: 32,
    fileUrl: '/assets/brochures/digital-transformation-playbook.pdf',
    fileSize: '10.2 MB',
    lastUpdated: 'Oct 2024',
    category: 'Strategy'
  },
  {
    id: 'industry-solutions',
    slug: 'industry-solutions',
    title: 'Industry Solutions',
    description: 'Tailored solutions for key industries and verticals.',
    pages: 28,
    fileUrl: '/assets/brochures/industry-solutions.pdf',
    fileSize: '9.1 MB',
    lastUpdated: 'Oct 2024',
    category: 'Industry'
  }
];
