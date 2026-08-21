import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  Cloud, 
  Server, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  RefreshCw, 
  Lock, 
  LineChart, 
  Database, 
  ArrowRight,
  ChevronRight,
  Activity,
  Workflow,
  Search,
  Globe,
  Settings,
  Layout,
  Container,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AWS = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'AWS Cloud Engineering',
    slug: 'aws',
    shortDescription: 'SECURE. SCALABLE. CLOUD-NATIVE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Accelerate cloud-native transformation with secure, scalable, and performance-optimized AWS architectures.</h2>
        <p>Kangqore helps enterprises design, migrate, modernize, and optimize workloads on AWS — combining deep cloud engineering expertise with governance-first execution.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true, // Enabled for MNC-grade wide layout
    keyFeatures: [
      'AWS Well-Architected Framework',
      'Immutable Infrastructure as Code',
      'Cloud-Native Modernization',
      'FinOps & Cost Optimization',
      'DevSecOps Automation'
    ],
    primaryButton: { text: 'Request a Consultation', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '99.99%', label: 'Availability', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Zero', label: 'Migration Downtime', color: 'text-blue-400' },
      { value: '40%+', label: 'Cost Reduction', color: 'text-emerald-400' },
      { value: '10x', label: 'Deployment Speed', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'Cloud Transformation :: 2026',
        titleLine1: 'Cloud',
        titleHighlight: 'Resilience',
        titleLine2: 'at Scale.',
        description: 'Most organizations move to AWS for agility, yet struggle with architecture complexity, uncontrolled spend, and security misconfigurations.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Fragmented modernization & skyrocketing cloud waste.',
        requirementLabel: 'The Requirement',
        requirementText: 'Observable, secure, and performance-optimized systems.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Cloud Health',
        statusValue: 'AWS_Optimized'
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-brand-blue" />,
        title: 'AWS',
        titleHighlight: 'Well-Architected by Default.',
        description: 'We engineer cloud-native ecosystems that are resilient, observable, secure, and optimized for scale — moving beyond basic adoption into high-velocity execution.',
        pills: ['Enterprise ROI', 'Hardened Security', 'DevOps Velocity', 'Zero Cloud Debt']
      },
      matrix: {
        engineId: 'Engine :: AWS_WellArchi',
        title: 'Enablement Matrix',
        subtext: 'End-to-end AWS cloud engineering deconstructed into modular, scalable, and governed delivery layers.',
        layers: [
          { title: 'Adoption', id: 'AWS_STRAT', icon: <Layers />, desc: 'AWS roadmaps aligned with business outcomes.' },
          { title: 'Modernization', id: 'AWS_CORE', icon: <RefreshCw />, desc: 'Transform legacy workloads into cloud-native architectures.' },
          { title: 'DevOps', id: 'AWS_AUTOM', icon: <Settings />, desc: 'Automated CI/CD pipelines and Infrastructure as Code.' },
          { title: 'Governance', id: 'AWS_SEC', icon: <ShieldCheck />, desc: 'Hardened security frameworks and FinOps optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Accelerate',
        titleHighlight: 'Innovation.',
        description: 'Your AWS environment should not be a technical burden. It should be the foundation for undisputed digital advantage.',
        stats: [
          { label: 'Security', val: 'HARDENED' },
          { label: 'Cost', val: 'OPTIMIZED' },
          { label: 'Agility', val: 'MAXIMIZED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Cloud Engineering',
    slug: 'cloud-engineering',
    description: 'Transform your business with cutting-edge cloud engineering solutions.'
  };

  // Technologies (categorized lookup)
  const technologies = [
    {
      category: 'Core AWS Services',
      items: ['EC2', 'S3', 'RDS', 'Aurora', 'DynamoDB', 'Lambda', 'ECS', 'EKS', 'API Gateway', 'CloudFront', 'VPC', 'Route53']
    },
    {
      category: 'Security & Governance',
      items: ['IAM', 'AWS Organizations', 'Control Tower', 'GuardDuty', 'Security Hub', 'WAF', 'Shield']
    },
    {
      category: 'DevOps & Automation',
      items: ['CloudFormation', 'Terraform', 'CodePipeline', 'CodeBuild', 'GitHub Actions', 'Jenkins']
    },
    {
      category: 'Data & Analytics',
      items: ['Redshift', 'Glue', 'EMR', 'Kinesis', 'Athena', 'QuickSight']
    },
    {
      category: 'AI/ML on AWS',
      items: ['SageMaker', 'Bedrock', 'Personalize', 'Rekognition', 'Comprehend']
    }
  ];

  // Capabilities
  const capabilities = [
    {
      title: 'Cloud Strategy & Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Accelerate your cloud journey with data-driven readiness assessments, TCO analysis, and tailored migration roadmaps. We ensure secure, structured cloud adoption without disruption. Kangqore Strategy offering helps you with:',
      items: [
        'AWS readiness assessment',
        'Migration roadmap & TCO analysis',
        'Lift-and-shift & re-platforming',
        'Application re-architecture',
        'Multi-account landing zone setup',
        'Hybrid & multi-cloud integration'
      ]
    },
    {
      title: 'Cloud-Native Engineering',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Build resilient, automated, and scalable cloud-native systems using containerization, serverless architectures, and Infrastructure as Code. Kangqore Cloud-Native offering helps you with:',
      items: [
        'Containerization (EKS, ECS)',
        'Serverless architectures (Lambda, API Gateway)',
        'Infrastructure as Code (Terraform / CloudFormation)',
        'CI/CD pipeline automation',
        'GitOps & DevSecOps integration',
        'Observability & monitoring frameworks'
      ]
    },
    {
      title: 'Optimization & Governance',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Enhance your AWS environment with performance, control, and measurable ROI through Well-Architected reviews and FinOps strategies. Kangqore Optimization offering helps you with:',
      items: [
        'AWS Well-Architected Framework review',
        'Cost optimization & FinOps strategy',
        'IAM & access control hardening',
        'Compliance-ready cloud architecture',
        'Disaster recovery & high availability',
        'Continuous performance tuning'
      ]
    },
    {
      title: 'AWS Data & AI Enablement',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Transform AWS into an AI-ready digital backbone with data lakes, real-time streaming, and MLOps pipelines. Kangqore Data/AI offering helps you with:',
      items: [
        'Data lakes & analytics on AWS',
        'Real-time streaming (Kinesis)',
        'AI/ML deployment (SageMaker)',
        'MLOps pipelines',
        'Personalization & intelligent services',
        'Generative AI (Bedrock) integration'
      ]
    }
  ];

  // Solutions Carousel
  const solutions = [
    {
      title: 'AWS Landing Zone',
      description: 'Enterprise-ready multi-account AWS foundation with security and governance built-in.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      tags: ['Governance', 'Scalability'],
      link: '/contact'
    },
    {
      title: 'FinOps Strategy',
      description: 'Reduce waste, implement FinOps strategy, and achieve measurable savings on AWS.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      tags: ['Cost Control', 'ROI'],
      link: '/contact'
    },
    {
      title: 'Serverless Acceleration',
      description: 'Build scalable, event-driven architectures using Lambda, API Gateway, and DynamoDB.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=800&q=80',
      tags: ['Efficiency', 'Scale'],
      link: '/contact'
    },
    {
      title: 'Kubernetes on AWS (EKS)',
      description: 'Cloud-native container orchestration with scalable microservices architecture.',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
      tags: ['EKS', 'Microservices'],
      link: '/contact'
    },
    {
      title: 'AWS Data Platform',
      description: 'Scalable data pipelines, analytics frameworks, and AI-ready infrastructure.',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
      tags: ['Data Lake', 'AI-Ready'],
      link: '/contact'
    }
  ];

  const whyKangqore = [
    { 
      title: 'Architecture Frameworks', 
      description: 'Enterprise-grade AWS Well-Architected deployments tailored for high-scale environments.' 
    },
    { 
      title: 'Security-First Approach', 
      description: 'Hardened IAM, access controls, and compliance-ready architectures built into every layer.' 
    },
    { 
      title: 'Multi-Industry Delivery', 
      description: 'Proven experience delivering complex AWS solutions for BFSI, Retail, and Healthcare.' 
    },
    { 
      title: 'DevOps-Integrated Cloud', 
      description: 'Native CI/CD and IaC execution patterns for high-velocity software delivery.' 
    },
    { 
      title: 'AI & Data-Driven Strategy', 
      description: 'Forward-looking cloud roadmaps designed for long-term AI and data innovation.' 
    }
  ];

  const industries = [
    { name: 'BFSI (Banking & Insurance)' },
    { name: 'Retail & eCommerce' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'SaaS & Technology Startups' },
    { name: 'Manufacturing' },
    { name: 'Media & Technology' }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      solutions,
      whyKangqore,
      industries,
      ctaTitle: 'Build Your AWS Cloud with Confidence',
      ctaDescription: 'Whether you’re migrating, modernizing, or optimizing — Kangqore helps you design AWS environments that drive performance.',
      ctaButtonText: 'Schedule an AWS Strategy Session'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default AWS;
