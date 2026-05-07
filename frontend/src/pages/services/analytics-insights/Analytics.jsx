import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  Database, 
  BrainCircuit, 
  Workflow, 
  Gauge, 
  RefreshCw, 
  TrendingUp, 
  BarChart3, 
  Settings2, 
  Search, 
  Share2, 
  ShieldCheck, 
  Globe, 
  LineChart, 
  Zap,
  Layers,
  Activity,
  Box,
  Cpu,
  Eye,
  Lock
} from 'lucide-react';

const Analytics = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Analytics',
    slug: 'analytics',
    shortDescription: 'Unlock the Value of Data to Drive Smarter, Faster Decisions',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Engineering Decision Systems for the Modern Enterprise</h2>
        <p>Transform raw data into actionable intelligence through modern analytics architectures, predictive modeling, and AI-powered insights — engineered for scale, governance, and business impact.</p>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <p className="font-bold text-cyan-300 mb-1">We don’t just build dashboards.</p>
          <p className="font-medium text-white italic">We build decision systems.</p>
        </div>
      </div>
    ),
    stats: [
      { value: '5X', label: 'Faster Insights', color: 'text-cyan-400' },
      { value: '10X', label: 'Model Performance', color: 'text-blue-400' },
      { value: '30%', label: 'Cost Savings', color: 'text-emerald-400' },
      { value: 'Governed', label: 'Decision Systems', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'Strategic Intelligence :: 2026',
        titleLine1: 'Analytics',
        titleHighlight: 'Precision',
        titleLine2: 'for Decisions.',
        description: 'Data without context is noise. We engineer decision systems that bridge the gap between fragmented raw data and executive-ready intelligence.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Incoherent data lakes & siloed analytics reports.',
        requirementLabel: 'The Requirement',
        requirementText: 'Observable, governed, and AI-native decision pipelines.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Decision Velocity',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <LineChart className="w-7 h-7 text-brand-blue" />,
        title: 'Analytics',
        titleHighlight: 'Logic-First Intelligence.',
        description: 'We move beyond standard reporting into cognitive intelligence — architecting systems that prioritize relevance, provenance, and actionable outcomes.',
        pills: ['Predictive ROI', 'Hardened Governance', 'MLOps Ready', 'Zero Insight Debt']
      },
      matrix: {
        engineId: 'Engine :: Insights_V4',
        title: 'Enablement Matrix',
        subtext: 'Our end-to-end analytics engineering deconstructed into modular, governed intelligence layers.',
        layers: [
          { title: 'Ingestion', id: 'AN_AQ', icon: <Database />, desc: 'Multi-modal data capture and multi-source integration.' },
          { title: 'Unification', id: 'AN_UNI', icon: <Layers />, desc: 'Semantic modeling and distributed data lakehouse unification.' },
          { title: 'Intelligence', id: 'AN_IQ', icon: <BrainCircuit />, desc: 'Predictive modeling and cognitive intelligence modules.' },
          { title: 'Delivery', id: 'AN_DLV', icon: <Activity />, desc: 'Executive KPI command centers and real-time triggers.' }
        ]
      },
      schematic: {
        titleLine1: 'Transform',
        titleHighlight: 'Information.',
        description: 'Your data should stay as a strategic asset, not a technical burden. We build the foundations for undisputed competitive advantage.',
        stats: [
          { label: 'Accuracy', val: 'ABSOLUTE' },
          { label: 'Latency', val: 'ZERO' },
          { label: 'Velocity', val: 'EXPONENTIAL' }
        ]
      }
    }
  };

  const department = {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Transform your business with cutting-edge analytics & insights solutions.'
  };

  // Technologies (categorised lookup)
  const technologies = [
    {
      category: 'Data Platforms & Lakehouse',
      items: ['Snowflake', 'Databricks', 'BigQuery', 'Redshift', 'Azure Synapse']
    },
    {
      category: 'ETL / ELT & Orchestration',
      items: ['Airflow', 'dbt', 'Fivetran', 'Azure Data Factory', 'Talend']
    },
    {
      category: 'Real-Time & Streaming',
      items: ['Kafka', 'Kinesis', 'Spark Streaming', 'Flink', 'Pub/Sub']
    },
    {
      category: 'BI & Visualization',
      items: ['Power BI', 'Tableau', 'Looker', 'Superset', 'Metabase']
    },
    {
      category: 'ML & Predictive Analytics',
      items: ['Scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'Prophet']
    },
    {
      category: 'Governance & Observability',
      items: ['Great Expectations', 'Collibra', 'Monte Carlo', 'Purview', 'OpenLineage']
    }
  ];

  // Capabilities (Implementing 5 core types)
  const capabilities = [
    {
      title: 'Descriptive & Diagnostic',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { 
          heading: 'Descriptive Analytics', 
          description: `Understand what happened. Exploratory data analysis, KPI tracking, and executive reporting to provide visibility.` 
        },
        { 
          heading: 'Diagnostic Analytics', 
          description: `Understand why it happened. Root cause analysis, variance tracking, and segmentation to enable corrective actions.` 
        }
      ]
    },
    {
      title: 'Predictive & Prescriptive',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { 
          heading: 'Predictive Analytics', 
          description: `Understand what is likely to happen. Time-series forecasting and ML models for proactive business strategy.` 
        },
        { 
          heading: 'Prescriptive Solutions', 
          description: `Understand what action to take. Optimization modeling and decision engines to move from insight to execution.` 
        }
      ]
    },
    {
      title: 'Cognitive Intelligence',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        { 
          heading: 'Cognitive Analytics', 
          description: `AI-augmented systems using NLP, Graph analytics, and pattern detection to embed AI into analytics workflows.` 
        }
      ]
    }
  ];

  // Custom FAQs
  const customFAQs = [
    {
      question: `What is Analytics?`,
      answer: `Analytics is the process of transforming data into insights through statistical analysis, modeling, and visualization to support better decision-making.`
    },
    {
      question: `What are the types of analytics?`,
      answer: `We specialize in Descriptive (what happened), Diagnostic (why it happened), Predictive (likelyhood), Prescriptive (actions to take), and Cognitive (AI-augmented intelligence).`
    },
    {
      question: `What is Cognitive Analytics?`,
      answer: `AI-augmented analytics using NLP, ML, graph systems, and semantic intelligence to extract deeper contextual meaning from data.`
    },
    {
      question: `How does Kangqore ensure data quality?`,
      answer: `Through data validation pipelines, governance frameworks, lineage tracking, and continuous monitoring systems.`
    },
    {
      question: `Do you support real-time analytics?`,
      answer: `Yes. We design streaming architectures using event-driven pipelines (Kafka/Kinesis) and real-time dashboards.`
    }
  ];

  // Use Case Carousel Data
  const trustPillars = [
    {
      title: 'Executive KPI Command Center',
      tag: 'Decision Velocity',
      description: 'Real-time C-level dashboards and business health metrics with drill-down intelligence for strategic oversight.'
    },
    {
      title: 'Customer 360 & Segmentation',
      tag: 'Growth Intelligence',
      description: 'Unified customer profiles and cohort analysis paired with CLV and churn prediction for personalized marketing.'
    },
    {
      title: 'Demand Forecasting',
      tag: 'Predictive Analytics',
      description: 'Time-series modeling and inventory optimization using scenario simulations for resilient supply chains.'
    },
    {
      title: 'Operational Efficiency Analytics',
      tag: 'Operational Excellence',
      description: 'SLA tracking and bottleneck identification to eliminate cost leakage and improve process throughput.'
    },
    {
      title: 'Fraud & Risk Analytics',
      tag: 'Risk Intelligence',
      description: 'Anomaly detection and risk scoring engines providing real-time alerts for enterprise security.'
    },
    {
      title: 'Marketing Attribution & ROI',
      tag: 'Revenue Analytics',
      description: 'Multi-touch attribution and campaign performance tracking to optimize CAC and maximize ROAS.'
    },
    {
      title: 'Real-Time Streaming Analytics',
      tag: 'Real-Time Systems',
      description: 'Event streaming dashboards and live triggers for high-frequency operational intelligence.'
    },
    {
      title: 'Cognitive Analytics Modules',
      tag: 'AI-Augmented Analytics',
      description: 'Document intelligence and sentiment analysis using knowledge graphs for deeper contextual insights.'
    }
  ];

  // Why Kangqore Content
  const whyKangqoreIntro = `Kangqore is an AI-driven digital engineering company building the next generation of intelligent, autonomous, and scalable enterprise systems. We move analytics from reporting → prediction → intelligent automation.`;

  const whyKangqore = [
    { title: 'Engineering-first design', description: 'Analytics architected for technical precision and performance.' },
    { title: 'Governance by default', description: 'Security, compliance, and lineage are embedded at the core.' },
    { title: 'AI-ready architecture', description: 'Built to seamlessly integrate with ML models and cognitive agents.' },
    { title: 'Industry-aligned frameworks', description: 'Tailored solutions that speak the language of your specific sector.' },
    { title: 'Business-outcome focus', description: 'We measure success by the impact on your bottom line.' },
    { title: 'Scalable & secure', description: 'Enterprise-grade implementations designed to grow with your data.' }
  ];

  const industryIntro = `We design industry-specific analytics solutions that address real-world business challenges:`;

  const industries = [
    { name: 'BFSI', description: 'Risk scoring, fraud analytics, credit modeling.' },
    { name: 'Retail & E-commerce', description: 'Demand forecasting, customer segmentation, pricing optimization.' },
    { name: 'Manufacturing', description: 'Predictive maintenance, OEE monitoring, quality analytics.' },
    { name: 'Healthcare', description: 'Clinical analytics, patient risk modeling, outcome forecasting.' },
    { name: 'Public Sector', description: 'Data modernization, citizen service intelligence, performance monitoring.' }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      customFAQs,
      trustPillars,
      whyKangqoreIntro,
      whyKangqore,
      industryIntro,
      industries,
      trustPillarsRightTitle: 'Analytics Systems Built for Speed, Accuracy & Governance',
      trustPillarsRightDescription: 'Kangqore builds modern analytics ecosystems that turn fragmented data into trusted insights. From data ingestion to BI to predictive modeling, we architect scalable pipelines, semantic layers, and governance controls — so leaders get faster decisions without compromising accuracy, privacy, or compliance.',
      trustPillarsRightButton: 'Get an Analytics Assessment',
      primaryButton: { text: "Talk To Our Experts", link: "/contact" },
      secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
      ctaTitle: 'Build a Scalable Analytics Foundation',
      ctaSubtitle: 'Turn your data into a strategic advantage.',
      ctaButtonText: 'Request a Consultation'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default Analytics;
