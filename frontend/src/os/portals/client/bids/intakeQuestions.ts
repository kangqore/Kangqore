// ─── BIDS™ Intake — Full question framework (6 engines, 16 pillars) ──────────
// Industry-tagged hints fire when specific answers are selected.

import { IntakeEngine, IntakeQuestion } from './intakeTypes'

// ─── Shared option libraries ──────────────────────────────────────────────────

const MATURITY_OPTS = [
  { value: '1', label: 'Foundational — early stage, largely manual or absent' },
  { value: '2', label: 'Developing — some capability, inconsistently applied' },
  { value: '3', label: 'Capable — functional, moderately applied' },
  { value: '4', label: 'Advanced — well-established, proactively managed' },
  { value: '5', label: 'Leading — best-in-class, competitive differentiator' },
]

const SIZE_OPTS = [
  { value: '1-10',     label: '1–10 employees (Micro)' },
  { value: '11-50',    label: '11–50 employees (Small)' },
  { value: '51-200',   label: '51–200 employees (SME)' },
  { value: '201-500',  label: '201–500 employees (Mid-market)' },
  { value: '501-1000', label: '501–1,000 employees (Growth)' },
  { value: '1000+',    label: '1,000+ employees (Enterprise)' },
]

const INDUSTRY_OPTS = [
  { value: 'Manufacturing',        label: 'Manufacturing' },
  { value: 'Education',            label: 'Education' },
  { value: 'Healthcare',           label: 'Healthcare' },
  { value: 'Financial Services',   label: 'Financial Services' },
  { value: 'Retail & Commerce',    label: 'Retail & Commerce' },
  { value: 'SaaS & Technology',    label: 'SaaS & Technology' },
  { value: 'Government',           label: 'Government' },
  { value: 'Startup',              label: 'Startup' },
  { value: 'Enterprise',           label: 'Enterprise' },
  { value: 'Non-Profit',           label: 'Non-Profit' },
]

const TRIGGER_OPTS = [
  { value: 'board_mandate',         label: 'Board / investor mandate' },
  { value: 'competitive_pressure',  label: 'Competitive pressure' },
  { value: 'failed_transformation', label: 'Previous transformation fell short' },
  { value: 'growth_plateau',        label: 'Growth plateau' },
  { value: 'ai_readiness',          label: 'AI readiness / strategy' },
  { value: 'compliance',            label: 'Regulatory / compliance requirement' },
  { value: 'cost_reduction',        label: 'Cost optimisation' },
  { value: 'ma_activity',           label: 'M&A or restructuring activity' },
]

// ─── Section 1: Cognition Intelligence Engine™ ───────────────────────────────
// Pillars: 11 (Data), 12 (AI), 13 (Automation)

const COGNITION_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'data_quality',
    type:        'maturity_slider',
    label:       'How accessible and trusted is your organisation\'s data?',
    description: 'Consider whether teams can find, trust, and use data to make decisions without constant IT involvement.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [11],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Low data accessibility is the #1 blocker for AI readiness. The diagnostic will flag this as a priority constraint across Pillars 11 and 12 — without trusted data, AI investments cannot deliver expected returns.' },
      { condition: v => Number(v) >= 4, text: 'Strong data foundation detected. This positions you well for AI deployment. WAANDA will look at whether your AI and automation layers are keeping pace with your data maturity.' },
    ],
  },
  {
    id:          'ai_deployment',
    type:        'yes_no_expand',
    label:       'Has your organisation deployed any AI or machine learning systems in production?',
    required:    true,
    expandLabel: 'Which types of AI systems are in production?',
    expandType:  'multi_select',
    expandOptions: [
      { value: 'predictive_analytics', label: 'Predictive analytics / forecasting' },
      { value: 'nlp_classification',   label: 'NLP / text classification' },
      { value: 'computer_vision',      label: 'Computer vision / image recognition' },
      { value: 'recommender',          label: 'Recommendation systems' },
      { value: 'genai',                label: 'Generative AI (ChatGPT, Claude, Gemini, etc.)' },
      { value: 'rpa',                  label: 'Robotic process automation (RPA)' },
      { value: 'anomaly_detection',    label: 'Anomaly detection / fraud prevention' },
    ],
    pillarIds:   [12],
    waandaHints: [
      { condition: v => v === false || v === 'false', text: 'No AI in production is not a critical gap — it is an opportunity. Many organisations that rush into AI without a diagnostic foundation waste significant capital. BIDS™ will identify exactly where to start.' },
      { condition: v => v === true || v === 'true', text: 'Existing AI deployment is a strong signal. WAANDA will assess whether these systems are governed, measured, and aligned to strategic outcomes — or operating as isolated pilots.' },
    ],
  },
  {
    id:          'genai_adoption',
    type:        'multi_select',
    label:       'Which GenAI tools has your organisation evaluated or deployed?',
    required:    false,
    options: [
      { value: 'chatgpt',     label: 'ChatGPT / OpenAI' },
      { value: 'claude',      label: 'Claude / Anthropic' },
      { value: 'gemini',      label: 'Gemini / Google' },
      { value: 'copilot',     label: 'Microsoft Copilot' },
      { value: 'midjourney',  label: 'Midjourney / image generation' },
      { value: 'custom_llm',  label: 'Custom / fine-tuned LLM' },
      { value: 'none',        label: 'None evaluated yet' },
    ],
    pillarIds:   [12],
  },
  {
    id:          'ai_governance',
    type:        'yes_no_expand',
    label:       'Do you have documented AI governance policies?',
    required:    true,
    expandLabel: 'Which AI governance elements are in place?',
    expandType:  'multi_select',
    expandOptions: [
      { value: 'acceptable_use',  label: 'AI acceptable use policy' },
      { value: 'model_review',    label: 'Model review / approval process' },
      { value: 'bias_testing',    label: 'Bias and fairness testing' },
      { value: 'explainability',  label: 'Explainability requirements' },
      { value: 'audit_trail',     label: 'AI decision audit trails' },
    ],
    pillarIds:   [12, 15],
    waandaHints: [
      { condition: v => v === false || v === 'false', text: 'Absence of AI governance is the most common and most expensive blind spot as AI deployment scales. WAANDA will prioritise this in the diagnostic — regulators across the EU and UK are accelerating AI Act enforcement.' },
    ],
  },
  {
    id:          'automation_coverage',
    type:        'range_select',
    label:       'What percentage of your operational processes are currently automated?',
    required:    true,
    options: [
      { value: '0-10',  label: 'Less than 10% — mostly manual' },
      { value: '10-25', label: '10–25% — some automation in pockets' },
      { value: '25-50', label: '25–50% — moderate automation' },
      { value: '50-75', label: '50–75% — well-automated core processes' },
      { value: '75+',   label: '75%+ — highly automated organisation' },
    ],
    pillarIds:   [13],
  },
  {
    id:          'data_silos',
    type:        'maturity_slider',
    label:       'How unified is your data across departments?',
    description: 'Do teams share a single view of customers, operations, and performance — or does every department have its own version of the truth?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [11],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Data silos are one of the most common hidden constraints BIDS™ uncovers. They block AI, slow decisions, and create compliance risk. This will be a priority finding.' },
    ],
  },
  {
    id:          'ml_talent',
    type:        'yes_no_expand',
    label:       'Do you have in-house data science or machine learning engineering capability?',
    required:    true,
    expandLabel: 'Approximate team size:',
    expandType:  'single_select',
    expandOptions: [
      { value: '1', label: '1 person' },
      { value: '2-5', label: '2–5 people' },
      { value: '6-15', label: '6–15 people' },
      { value: '15+', label: '15+ people' },
    ],
    pillarIds:   [12, 13],
  },
]

// ─── Section 2: Foundry Intelligence Engine™ ─────────────────────────────────
// Pillars: 9 (Technology), 10 (Cloud & Infrastructure)

const FOUNDRY_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'cloud_posture',
    type:        'multi_select',
    label:       'Where does your primary infrastructure run?',
    required:    true,
    options: [
      { value: 'on_prem',    label: 'On-premises (physical servers)' },
      { value: 'aws',        label: 'Amazon Web Services (AWS)' },
      { value: 'azure',      label: 'Microsoft Azure' },
      { value: 'gcp',        label: 'Google Cloud Platform (GCP)' },
      { value: 'hybrid',     label: 'Hybrid (on-prem + cloud)' },
      { value: 'multi_cloud', label: 'Multi-cloud (2+ providers)' },
      { value: 'managed',    label: 'Managed hosting / colocation' },
    ],
    pillarIds:   [10],
    waandaHints: [
      { condition: v => Array.isArray(v) && v.includes('on_prem') && !v.includes('aws') && !v.includes('azure') && !v.includes('gcp'), text: 'Fully on-premises infrastructure is often the single largest constraint on AI, scalability, and cost efficiency. BIDS™ will assess your cloud migration readiness in depth.' },
    ],
  },
  {
    id:          'engineering_maturity',
    type:        'maturity_slider',
    label:       'How would you rate your software engineering practices?',
    description: 'Consider code quality standards, testing coverage, architectural decisions, and team effectiveness.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [9],
  },
  {
    id:          'tech_debt',
    type:        'maturity_slider',
    label:       'How would you describe your legacy systems burden?',
    description: '1 = critical legacy debt blocking all modernisation. 5 = minimal legacy, modern architecture throughout.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [9, 16],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Severe legacy debt is a transformation blocker. It inflates costs, creates security vulnerabilities, and limits your ability to integrate AI. WAANDA will flag this as a high-priority finding in the Reimagine Engine™.' },
    ],
  },
  {
    id:          'sla_target',
    type:        'single_select',
    label:       'What is your typical system availability target?',
    required:    false,
    options: [
      { value: 'no_sla',  label: 'No formal SLA defined' },
      { value: '99',      label: '99% (87.6 hours downtime/year)' },
      { value: '99.9',    label: '99.9% (8.7 hours downtime/year)' },
      { value: '99.99',   label: '99.99% (52 minutes downtime/year)' },
      { value: '99.999',  label: '99.999% (5 minutes downtime/year)' },
    ],
    pillarIds:   [10],
  },
  {
    id:          'devops',
    type:        'yes_no_expand',
    label:       'Does your team use CI/CD pipelines and infrastructure-as-code?',
    required:    true,
    expandLabel: 'Which DevOps practices are in place?',
    expandType:  'multi_select',
    expandOptions: [
      { value: 'ci_cd',            label: 'CI/CD pipelines (automated build + deploy)' },
      { value: 'iac',              label: 'Infrastructure-as-code (Terraform, Pulumi, etc.)' },
      { value: 'containerisation', label: 'Containerisation (Docker, Kubernetes)' },
      { value: 'monitoring',       label: 'Automated monitoring and alerting' },
      { value: 'gitops',           label: 'GitOps / version-controlled infrastructure' },
    ],
    pillarIds:   [9],
  },
  {
    id:          'platform_resilience',
    type:        'maturity_slider',
    label:       'How well does your tech stack handle unexpected load or failure?',
    description: 'Consider auto-scaling, disaster recovery, failover, and your last significant outage.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [10],
  },
]

// ─── Section 3: Reimagine Intelligence Engine™ ───────────────────────────────
// Pillars: 1 (Business Strategy), 4 (Operational), 16 (Transformation)

const REIMAGINE_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'strategic_clarity',
    type:        'maturity_slider',
    label:       'How clearly defined is your 3–5 year strategic direction?',
    description: 'Does leadership have a shared, documented strategy that drives resource allocation and hiring decisions?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [1],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Strategic ambiguity is the most expensive hidden cost in any enterprise. Every function below it (tech, people, operations) is making assumptions about direction. WAANDA will flag this as a root-cause finding.' },
      { condition: v => Number(v) >= 4, text: 'Clear strategy detected. WAANDA will assess whether your operational and technology execution is aligned to that strategy — strong strategy with weak execution is equally common.' },
    ],
  },
  {
    id:          'prior_transformation',
    type:        'yes_no_expand',
    label:       'Has your organisation attempted a major digital transformation in the past 5 years?',
    required:    true,
    expandLabel: 'What was the primary outcome?',
    expandType:  'single_select',
    expandOptions: [
      { value: 'succeeded',    label: 'Largely successful — delivered intended outcomes' },
      { value: 'partial',      label: 'Partial success — some goals achieved, others missed' },
      { value: 'stalled',      label: 'Stalled or paused — lost momentum' },
      { value: 'failed',       label: 'Did not deliver intended outcomes' },
      { value: 'in_progress',  label: 'Currently in progress' },
    ],
    pillarIds:   [16],
    waandaHints: [
      { condition: v => v === 'failed' || v === 'stalled', text: 'Prior transformation failure is diagnostic gold. It almost always points to one of three root causes: unclear strategy, insufficient change management capability, or technology chosen before the problem was fully diagnosed. BIDS™ exists to solve this.' },
    ],
  },
  {
    id:          'operational_friction',
    type:        'multi_select',
    label:       'Which operational areas create the most friction in your organisation?',
    required:    true,
    options: [
      { value: 'supply_chain',   label: 'Supply chain / procurement' },
      { value: 'hr_people',      label: 'HR / people operations' },
      { value: 'finance',        label: 'Finance / reporting' },
      { value: 'customer_ops',   label: 'Customer operations / support' },
      { value: 'reporting',      label: 'Data reporting / analytics' },
      { value: 'compliance',     label: 'Compliance / regulatory reporting' },
      { value: 'sales_ops',      label: 'Sales operations / CRM' },
      { value: 'it_operations',  label: 'IT operations / helpdesk' },
    ],
    pillarIds:   [4],
  },
  {
    id:          'change_appetite',
    type:        'maturity_slider',
    label:       'How would you rate your organisation\'s readiness for significant change?',
    description: 'Consider past change initiatives, leadership appetite, and how employees typically respond to transformation.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [16],
  },
  {
    id:          'modernisation_priority',
    type:        'priority_rank',
    label:       'Rank your top 3 modernisation priorities (most urgent first)',
    required:    true,
    options: [
      { value: 'legacy_systems',    label: 'Replace legacy core systems' },
      { value: 'data_platform',     label: 'Build a modern data platform' },
      { value: 'customer_digital',  label: 'Improve digital customer experience' },
      { value: 'ai_ml',             label: 'Implement AI / machine learning' },
      { value: 'cloud_migration',   label: 'Cloud migration' },
      { value: 'automation',        label: 'Process automation' },
      { value: 'security',          label: 'Security and compliance modernisation' },
      { value: 'workforce',         label: 'Workforce capability / digital skills' },
    ],
    pillarIds:   [1, 16],
  },
  {
    id:          'process_documentation',
    type:        'maturity_slider',
    label:       'How standardised and documented are your core business processes?',
    description: 'If a key person left tomorrow, would critical processes be documented clearly enough to continue?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [4],
  },
]

// ─── Section 4: Shield Intelligence Engine™ ──────────────────────────────────
// Pillars: 14 (Cybersecurity), 15 (Governance & Risk)

const SHIELD_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'security_team',
    type:        'yes_no_expand',
    label:       'Do you have a dedicated cybersecurity function?',
    required:    true,
    expandLabel: 'How is your security function structured?',
    expandType:  'single_select',
    expandOptions: [
      { value: 'ciso',        label: 'CISO + dedicated security team (in-house)' },
      { value: 'security_eng', label: 'Security engineers embedded in engineering' },
      { value: 'mssp',        label: 'Managed security service provider (MSSP)' },
      { value: 'fractional',  label: 'Fractional CISO / virtual CISO (vCISO)' },
    ],
    pillarIds:   [14],
    waandaHints: [
      { condition: v => v === false || v === 'false', text: 'No dedicated security function is a significant risk signal, especially for organisations with customer data or regulated industries. WAANDA will assess the actual exposure rather than applying a blanket penalty.' },
    ],
  },
  {
    id:          'compliance_frameworks',
    type:        'multi_select',
    label:       'Which regulatory and compliance frameworks apply to your organisation?',
    required:    true,
    options: [
      { value: 'soc2',      label: 'SOC 2 (Type I or II)' },
      { value: 'iso27001',  label: 'ISO 27001' },
      { value: 'gdpr',      label: 'GDPR (EU data protection)' },
      { value: 'hipaa',     label: 'HIPAA (US healthcare)' },
      { value: 'pci_dss',   label: 'PCI DSS (payment card data)' },
      { value: 'nist',      label: 'NIST Cybersecurity Framework' },
      { value: 'fedramp',   label: 'FedRAMP (US government cloud)' },
      { value: 'uk_cyber',  label: 'UK Cyber Essentials / Cyber Essentials+' },
      { value: 'none',      label: 'No formal compliance framework' },
    ],
    pillarIds:   [15],
  },
  {
    id:          'risk_framework',
    type:        'maturity_slider',
    label:       'How mature is your organisation\'s risk management framework?',
    description: 'Consider risk identification, assessment, treatment, and ongoing monitoring practices.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [15],
  },
  {
    id:          'incident_history',
    type:        'yes_no_expand',
    label:       'Has your organisation experienced a significant security incident in the past 2 years?',
    sensitive:   true,
    required:    false,
    expandLabel: 'Type of incident (this data is confidential and used only for diagnostic purposes):',
    expandType:  'single_select',
    expandOptions: [
      { value: 'ransomware',      label: 'Ransomware or malware attack' },
      { value: 'data_breach',     label: 'Data breach / exfiltration' },
      { value: 'phishing',        label: 'Phishing / social engineering (successful)' },
      { value: 'insider_threat',  label: 'Insider threat' },
      { value: 'ddos',            label: 'DDoS / availability attack' },
      { value: 'supply_chain',    label: 'Third-party / supply chain compromise' },
    ],
    pillarIds:   [14],
  },
  {
    id:          'ai_policy',
    type:        'yes_no_expand',
    label:       'Do you have policies governing AI or automated decision-making?',
    required:    true,
    expandLabel: 'What does your AI policy cover?',
    expandType:  'multi_select',
    expandOptions: [
      { value: 'approved_tools',  label: 'Approved AI tools list' },
      { value: 'data_handling',   label: 'Data handling with AI tools' },
      { value: 'output_review',   label: 'Human review of AI outputs' },
      { value: 'ip_protection',   label: 'IP and confidentiality protections' },
      { value: 'ethics',          label: 'AI ethics guidelines' },
    ],
    pillarIds:   [12, 15],
  },
  {
    id:          'audit_readiness',
    type:        'maturity_slider',
    label:       'How prepared is your organisation for a regulatory or compliance audit today?',
    description: 'If an auditor arrived this week, how confident would you be in your documentation, controls, and evidence?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [15],
  },
]

// ─── Section 5: Platforms Intelligence Engine™ ───────────────────────────────
// Focus: platform utilisation, integration complexity, process maturity

const PLATFORMS_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'current_platforms',
    type:        'multi_select',
    label:       'Which enterprise platforms does your organisation currently use?',
    required:    true,
    options: [
      { value: 'salesforce',    label: 'Salesforce (CRM)' },
      { value: 'sap',           label: 'SAP (ERP)' },
      { value: 'servicenow',    label: 'ServiceNow' },
      { value: 'ms365',         label: 'Microsoft 365 / SharePoint' },
      { value: 'workday',       label: 'Workday (HR / Finance)' },
      { value: 'oracle',        label: 'Oracle (ERP / Database)' },
      { value: 'hubspot',       label: 'HubSpot (CRM / Marketing)' },
      { value: 'jira',          label: 'Jira / Atlassian' },
      { value: 'slack',         label: 'Slack / Teams (Collaboration)' },
      { value: 'netsuite',      label: 'NetSuite (ERP)' },
      { value: 'custom_built',  label: 'Primarily custom-built systems' },
      { value: 'other',         label: 'Other enterprise platforms' },
    ],
    pillarIds:   [9],
  },
  {
    id:          'integration_health',
    type:        'maturity_slider',
    label:       'How well-integrated are your key business systems?',
    description: 'Can data flow between CRM, ERP, finance, HR, and operations without manual data exports or rekeying?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [9],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Poor system integration means your organisation is running on manual connective tissue — spreadsheets, email chains, and copy-paste workflows. This inflates operational cost and prevents AI from operating effectively.' },
    ],
  },
  {
    id:          'system_count',
    type:        'range_select',
    label:       'Approximately how many separate software systems does your team use for daily operations?',
    required:    true,
    options: [
      { value: '1-5',   label: '1–5 systems' },
      { value: '6-10',  label: '6–10 systems' },
      { value: '11-20', label: '11–20 systems' },
      { value: '21-50', label: '21–50 systems' },
      { value: '50+',   label: '50+ systems (high complexity)' },
    ],
    pillarIds:   [9],
    waandaHints: [
      { condition: v => v === '21-50' || v === '50+', text: 'High system count is a major consolidation opportunity. The Platforms Engine™ diagnostic will identify where rationalisation would have the highest ROI.' },
    ],
  },
  {
    id:          'consolidation_intent',
    type:        'yes_no_expand',
    label:       'Are you looking to consolidate or replace any platforms in the next 18 months?',
    required:    true,
    expandLabel: 'Which platform categories are under consideration for change?',
    expandType:  'multi_select',
    expandOptions: [
      { value: 'crm',          label: 'CRM / customer data' },
      { value: 'erp',          label: 'ERP / finance' },
      { value: 'hr',           label: 'HR / people systems' },
      { value: 'collaboration', label: 'Collaboration / productivity' },
      { value: 'data_platform', label: 'Data / analytics platform' },
      { value: 'itsm',         label: 'IT service management' },
      { value: 'ecommerce',    label: 'E-commerce / customer portal' },
    ],
    pillarIds:   [9, 16],
  },
  {
    id:          'data_flow',
    type:        'maturity_slider',
    label:       'How smoothly does data flow between your systems without manual intervention?',
    description: 'Consider API integrations, ETL pipelines, webhooks, and how often teams resort to Excel as the integration layer.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [9, 11],
  },
  {
    id:          'vendor_dependency',
    type:        'maturity_slider',
    label:       'How dependent is your organisation on a single vendor\'s ecosystem?',
    description: '1 = single vendor controls most of your tech stack. 5 = well-diversified, minimal lock-in.',
    required:    false,
    options:     MATURITY_OPTS,
    pillarIds:   [9],
  },
]

// ─── Section 6: Growth Intelligence Engine™ ──────────────────────────────────
// Pillars: 2 (Leadership), 3 (Financial), 5 (Workforce), 6 (Customer), 7 (Sales), 8 (Growth)

const GROWTH_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'leadership_alignment',
    type:        'maturity_slider',
    label:       'How aligned is your leadership team on strategic priorities?',
    description: 'Would every member of your executive team independently describe your top 3 priorities identically?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [2],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Leadership misalignment is the hidden accelerant behind most failed strategies. It manifests as conflicting resource decisions, unclear KPIs, and teams pulling in different directions. This will be a priority Leadership Intelligence™ finding.' },
    ],
  },
  {
    id:          'financial_position',
    type:        'single_select',
    label:       'How would you describe your organisation\'s current financial position?',
    required:    true,
    options: [
      { value: 'investing_aggressively', label: 'Investing aggressively — growth mode, high capex' },
      { value: 'growing_steadily',       label: 'Growing steadily — healthy cash flow, measured investment' },
      { value: 'stable',                 label: 'Stable — maintaining position, limited discretionary spend' },
      { value: 'cautious',               label: 'Cautious — conserving capital, prioritising efficiency' },
      { value: 'under_pressure',         label: 'Under financial pressure — cost reduction is a priority' },
    ],
    pillarIds:   [3],
    waandaHints: [
      { condition: v => v === 'under_pressure', text: 'Financial pressure contexts require BIDS™ to prioritise cost reduction and efficiency findings above growth recommendations. WAANDA will calibrate the diagnostic accordingly — the ROI Projection Report™ will focus on savings potential, not expansion.' },
    ],
  },
  {
    id:          'workforce_readiness',
    type:        'maturity_slider',
    label:       'Does your workforce have the skills to execute your 3-year strategy?',
    description: 'Consider digital literacy, specialist capability gaps, and whether your hiring pipeline supports your strategic direction.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [5],
  },
  {
    id:          'cx_maturity',
    type:        'maturity_slider',
    label:       'How satisfied are your customers with their digital experience?',
    description: 'Based on NPS, CSAT, churn rates, or customer feedback — not your internal perception.',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [6],
    waandaHints: [
      { condition: v => Number(v) <= 2, text: 'Poor customer digital experience is directly correlated with churn and competitive vulnerability. WAANDA will cross-reference this against your Technology and Growth pillar scores to identify the root cause.' },
    ],
  },
  {
    id:          'revenue_challenge',
    type:        'multi_select',
    label:       'What are your primary growth challenges? (Select all that apply)',
    required:    true,
    options: [
      { value: 'new_markets',      label: 'New market / geographic entry' },
      { value: 'retention',        label: 'Customer retention / churn' },
      { value: 'digital_conversion', label: 'Digital conversion / online sales' },
      { value: 'brand_awareness',  label: 'Brand awareness / reach' },
      { value: 'sales_cycle',      label: 'Sales cycle length / win rate' },
      { value: 'pricing',          label: 'Pricing power / margin compression' },
      { value: 'talent',           label: 'Talent acquisition for growth roles' },
      { value: 'product_market',   label: 'Product-market fit refinement' },
    ],
    pillarIds:   [7, 8],
  },
  {
    id:          'digital_revenue',
    type:        'range_select',
    label:       'Approximately what percentage of your revenue comes through digital channels?',
    required:    false,
    options: [
      { value: '0-10',  label: 'Less than 10% — predominantly offline / direct' },
      { value: '10-25', label: '10–25% — limited digital revenue' },
      { value: '25-50', label: '25–50% — meaningful digital contribution' },
      { value: '50-75', label: '50–75% — digital-first business' },
      { value: '75+',   label: '75%+ — predominantly digital' },
    ],
    pillarIds:   [8],
  },
  {
    id:          'growth_data_driven',
    type:        'maturity_slider',
    label:       'How data-driven is your growth and marketing strategy?',
    description: 'Are acquisition, retention, and conversion decisions driven by analytics and experimentation — or primarily by intuition and experience?',
    required:    true,
    options:     MATURITY_OPTS,
    pillarIds:   [8],
  },
]

// ─── Foundation Questions (Section 0 — before engine sections) ───────────────

export const FOUNDATION_QUESTIONS: IntakeQuestion[] = [
  {
    id:          'industry',
    type:        'single_select',
    label:       'Which industry best describes your organisation?',
    required:    true,
    options:     INDUSTRY_OPTS,
    pillarIds:   [],
  },
  {
    id:          'company_size',
    type:        'single_select',
    label:       'How many people work in your organisation?',
    required:    true,
    options:     SIZE_OPTS,
    pillarIds:   [],
  },
  {
    id:          'hq_country',
    type:        'open_text',
    label:       'Where is your organisation headquartered?',
    description: 'Country (and city if relevant)',
    required:    true,
    maxLength:   80,
    pillarIds:   [],
  },
  {
    id:          'biggest_challenge',
    type:        'open_text',
    label:       'What is the single biggest challenge your organisation faces right now?',
    description: 'Be direct and specific. This is the primary diagnostic lens WAANDA applies to your entire assessment.',
    required:    true,
    maxLength:   500,
    pillarIds:   [],
    waandaHints: [
      { condition: v => typeof v === 'string' && v.length > 20, text: 'WAANDA has logged your primary challenge. This will be used as the interpretive lens across all 16 pillars — findings will be connected back to this root statement throughout the diagnostic.' },
    ],
  },
  {
    id:          'assessment_trigger',
    type:        'multi_select',
    label:       'What prompted this BIDS™ diagnostic assessment?',
    required:    true,
    options:     TRIGGER_OPTS,
    pillarIds:   [],
  },
]

// ─── Engine definitions ───────────────────────────────────────────────────────

export const INTAKE_ENGINES: IntakeEngine[] = [
  {
    id:        1,
    name:      'Cognition Intelligence Engine™',
    tagline:   'AI readiness, data maturity, and automation potential',
    icon:      '🧠',
    color:     '#4ab6d4',
    pillarIds: [11, 12, 13],
    questions: COGNITION_QUESTIONS,
  },
  {
    id:        2,
    name:      'Foundry Intelligence Engine™',
    tagline:   'Infrastructure health, cloud readiness, and engineering maturity',
    icon:      '⚙️',
    color:     '#2564ea',
    pillarIds: [9, 10],
    questions: FOUNDRY_QUESTIONS,
  },
  {
    id:        3,
    name:      'Reimagine Intelligence Engine™',
    tagline:   'Strategy clarity, transformation readiness, and operational efficiency',
    icon:      '🔄',
    color:     '#9333ea',
    pillarIds: [1, 4, 16],
    questions: REIMAGINE_QUESTIONS,
  },
  {
    id:        4,
    name:      'Shield Intelligence Engine™',
    tagline:   'Security posture, risk management, and governance maturity',
    icon:      '🛡️',
    color:     '#e2445c',
    pillarIds: [14, 15],
    questions: SHIELD_QUESTIONS,
  },
  {
    id:        5,
    name:      'Platforms Intelligence Engine™',
    tagline:   'Enterprise platform utilisation, integration complexity, and consolidation opportunity',
    icon:      '🏗️',
    color:     '#fdab3d',
    pillarIds: [9, 10],
    questions: PLATFORMS_QUESTIONS,
  },
  {
    id:        6,
    name:      'Growth Intelligence Engine™',
    tagline:   'Revenue engine health, leadership effectiveness, and digital growth maturity',
    icon:      '📈',
    color:     '#00c875',
    pillarIds: [2, 3, 5, 6, 7, 8],
    questions: GROWTH_QUESTIONS,
  },
]

export const ALL_PILLARS = [
  { id: 1,  name: 'Business Strategy Intelligence™',      engineId: 3 },
  { id: 2,  name: 'Leadership Intelligence™',             engineId: 6 },
  { id: 3,  name: 'Financial Intelligence™',              engineId: 6 },
  { id: 4,  name: 'Operational Intelligence™',            engineId: 3 },
  { id: 5,  name: 'Workforce Intelligence™',              engineId: 6 },
  { id: 6,  name: 'Customer Intelligence™',               engineId: 6 },
  { id: 7,  name: 'Sales Intelligence™',                  engineId: 6 },
  { id: 8,  name: 'Growth Intelligence™',                 engineId: 6 },
  { id: 9,  name: 'Technology Intelligence™',             engineId: 2 },
  { id: 10, name: 'Cloud & Infrastructure Intelligence™', engineId: 2 },
  { id: 11, name: 'Data Intelligence™',                   engineId: 1 },
  { id: 12, name: 'AI Intelligence™',                     engineId: 1 },
  { id: 13, name: 'Automation Intelligence™',             engineId: 1 },
  { id: 14, name: 'Cybersecurity Intelligence™',          engineId: 4 },
  { id: 15, name: 'Governance & Risk Intelligence™',      engineId: 4 },
  { id: 16, name: 'Transformation Intelligence™',         engineId: 3 },
]
