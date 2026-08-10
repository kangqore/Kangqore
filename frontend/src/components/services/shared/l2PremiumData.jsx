// ─── Phase F — L2-uplift data for the 6 cloud + analytics services ──────────
// Feeds the shared <PremiumAnimatedSections> kit. Each object gives the 6
// previously-Level-2 services the same flagship CoE / Value / Journey /
// Future-Ready sections their L3 peers carry — no per-service bespoke files.
// ────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Search, Layers, Cloud, Activity, Database, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';

// Shared 4-phase journey style presets (matches the lifted L3 sections).
const PH = [
  { gradient: 'from-slate-600 to-slate-800', ring: 'border-slate-400', glow: 'shadow-slate-400/40' },
  { gradient: 'from-blue-500 to-blue-700', ring: 'border-blue-400', glow: 'shadow-blue-500/40', kangqore: true },
  { gradient: 'from-brand-blue to-indigo-600', ring: 'border-brand-blue', glow: 'shadow-brand-blue/40', kangqore: true },
  { gradient: 'from-emerald-500 to-emerald-700', ring: 'border-emerald-400', glow: 'shadow-emerald-500/40', kangqore: true },
];
const ic = (C) => <C className="w-7 h-7" />;

// ─── 1. cloud-computing ───────────────────────────────────────────────────────
export const cloudComputingPremiumData = {
  coe: {
    label: 'Cloud Engineering CoE',
    intro: 'provides a structured blueprint that surrounds every cloud initiative with four layers of architectural validation — before scale, cost, or risk compound.',
    body: 'We replace "lift-and-hope" with "architect-and-prove." By unifying assessment, landing-zone design, migration, and continuous operations, your cloud estate becomes a controlled performance asset rather than an unpredictable cost center.',
    quadrants: [
      { lines: ['Cloud', 'Assessment'], items: ['Workload discovery', 'Dependency mapping', 'TCO baseline', 'Migration readiness'] },
      { lines: ['Architecture', 'Design'], items: ['Landing-zone blueprint', 'Network & identity model', 'Well-Architected review', 'Scalability planning'] },
      { lines: ['Migration', 'Execution'], items: ['Phased cutover waves', 'Rollback-ready moves', 'Data-integrity validation', 'Zero-downtime patterns'] },
      { lines: ['Continuous', 'Operations'], items: ['FinOps cost control', 'Observability & SLOs', 'Security hardening', 'Performance tuning'] },
    ],
    differentiators: [
      { num: 1, title: 'Assess Before You Migrate', text: 'Structured discovery and dependency mapping remove guesswork before any workload moves.' },
      { num: 2, title: 'Architecture Built for Longevity', text: 'Landing zones and governance designed for multi-year scale — not just a first deployment.' },
      { num: 3, title: 'Cost Governed From Day One', text: 'FinOps discipline is engineered in, so cloud spend stays a decision rather than a surprise.' },
      { num: 4, title: 'Security as a Default', text: 'Identity-first controls, encryption, and compliance baked into the platform, not bolted on.' },
      { num: 5, title: 'Full-Lifecycle Accountability', text: 'From assessment through run-state operations, one model owns the whole cloud journey.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'Cloud Computing.',
    items: [
      { title: 'Clarity before migration begins', desc: 'Workload discovery, dependency mapping, and a TCO baseline align the move to real business priorities.' },
      { title: 'Architecture designed for scale', desc: 'Landing zones, networking, and identity models built to grow without re-platforming later.' },
      { title: 'Migration without disruption', desc: 'Phased, rollback-ready cutovers protect data integrity and user experience throughout the move.' },
      { title: 'Predictable, governed cost', desc: 'FinOps practices convert cloud spend from a variable liability into a controlled, visible investment.' },
      { title: 'Security and compliance by design', desc: 'Zero-trust identity, encryption, and audit-ready controls embedded into every environment.' },
      { title: 'Operations that stay reliable', desc: 'Observability, SLOs, and continuous optimization keep the platform fast, available, and efficient.' },
    ],
  },
  journey: {
    title: 'Our Cloud Adoption', titleHighlight: 'Delivery Model.',
    intro: 'At Kangqore, cloud adoption is a disciplined engineering model — built to assess clearly, migrate safely, and operate continuously.',
    phases: [
      { phase: 'ASSESS', icon: ic(Search), title: 'Discover & Plan', desc: 'Map workloads, dependencies, cost baselines, and migration readiness across the estate.', ...PH[0] },
      { phase: 'ARCHITECT', icon: ic(Layers), title: 'Design the Foundation', desc: 'Define landing zones, networking, identity, and a Well-Architected target state.', ...PH[1] },
      { phase: 'MIGRATE', icon: ic(Cloud), title: 'Move & Validate', desc: 'Execute phased, rollback-ready migration waves with integrity and performance checks.', ...PH[2] },
      { phase: 'OPERATE', icon: ic(Activity), title: 'Run & Optimize', desc: 'Govern cost, monitor SLOs, harden security, and tune performance continuously.', ...PH[3] },
    ],
    stats: [{ label: 'Phases', value: '04' }, { label: 'Timeline', value: '6-16' }, { label: 'Confidence', value: '100%' }],
  },
  future: {
    intro: 'Kangqore helps clients build beyond a first migration — combining core cloud engineering with the capabilities that shape the next decade of digital infrastructure.',
    items: [
      { title: 'Cloud-Native Modernization', desc: 'Refactor workloads toward containers, serverless, and event-driven patterns for elastic scale and lower run-cost.' },
      { title: 'Multi-Cloud & Hybrid', desc: 'Govern workloads consistently across AWS, Azure, GCP, and on-premises with unified controls and visibility.' },
      { title: 'AI-Ready Infrastructure', desc: 'Structure data, compute, and pipelines so AI and ML workloads can be adopted safely and at scale.' },
      { title: 'FinOps Maturity', desc: 'Move from reactive cost-cutting to a continuous financial-operations practice that compounds savings.' },
    ],
  },
};

// ─── 2. aws ───────────────────────────────────────────────────────────────────
export const awsPremiumData = {
  coe: {
    label: 'AWS Engineering CoE',
    intro: 'surrounds every AWS initiative with four layers of architectural validation, aligned to the AWS Well-Architected Framework.',
    body: 'We replace ad-hoc AWS adoption with a governed, Well-Architected practice. By unifying strategy, modernization, automation, and security, your AWS environment becomes a foundation for advantage rather than accumulating cloud debt.',
    quadrants: [
      { lines: ['Adoption', 'Strategy'], items: ['Business-aligned roadmap', 'Account & org design', 'Landing-zone setup', 'Cost forecasting'] },
      { lines: ['Workload', 'Modernization'], items: ['Containers & EKS', 'Serverless with Lambda', 'Database migration', 'Event-driven design'] },
      { lines: ['DevOps', 'Automation'], items: ['CI/CD pipelines', 'Infrastructure-as-Code', 'Automated testing', 'Release governance'] },
      { lines: ['Security', 'Governance'], items: ['IAM & zero-trust', 'Guardrails & policy', 'Compliance alignment', 'FinOps optimization'] },
    ],
    differentiators: [
      { num: 1, title: 'Well-Architected by Default', text: 'Every AWS environment is designed and reviewed against the five Well-Architected pillars.' },
      { num: 2, title: 'Modernization, Not Just Migration', text: 'We move workloads toward cloud-native AWS services — not just rehost VMs in EC2.' },
      { num: 3, title: 'Automation-First Delivery', text: 'IaC and CI/CD pipelines make AWS environments reproducible, auditable, and fast to change.' },
      { num: 4, title: 'Security and Cost Governed', text: 'IAM rigor and FinOps practices keep AWS estates both hardened and cost-disciplined.' },
      { num: 5, title: 'Full-Lifecycle Ownership', text: 'From account strategy to run-state operations, one accountable AWS engineering model.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'AWS.',
    items: [
      { title: 'An AWS roadmap tied to outcomes', desc: 'Account structure, landing zones, and adoption sequencing aligned to real business goals.' },
      { title: 'Cloud-native workload modernization', desc: 'Containers, serverless, and managed databases that reduce run-cost and operational overhead.' },
      { title: 'Reproducible infrastructure', desc: 'Infrastructure-as-Code and CI/CD make every AWS environment consistent and auditable.' },
      { title: 'Hardened, compliant environments', desc: 'IAM, zero-trust networking, and guardrails meeting SOC 2, ISO, HIPAA, and PCI needs.' },
      { title: 'Disciplined AWS spend', desc: 'FinOps rightsizing, savings plans, and anomaly detection keep cost predictable and low.' },
      { title: 'Reliable, observable operations', desc: 'Monitoring, SLOs, and automated response keep AWS workloads available and performant.' },
    ],
  },
  journey: {
    title: 'Our AWS Engineering', titleHighlight: 'Delivery Model.',
    intro: 'At Kangqore, AWS engagements follow a Well-Architected delivery model — adopt with intent, modernize for scale, automate everything, govern always.',
    phases: [
      { phase: 'ADOPT', icon: ic(Search), title: 'Strategy & Landing Zone', desc: 'Account/org design, landing zones, and an AWS roadmap aligned to business outcomes.', ...PH[0] },
      { phase: 'MODERNIZE', icon: ic(RefreshCw), title: 'Cloud-Native Workloads', desc: 'Refactor toward EKS, Lambda, and managed data services for elastic, efficient scale.', ...PH[1] },
      { phase: 'AUTOMATE', icon: ic(Layers), title: 'DevOps & IaC', desc: 'CI/CD pipelines and Infrastructure-as-Code make AWS reproducible and fast to evolve.', ...PH[2] },
      { phase: 'GOVERN', icon: ic(Activity), title: 'Secure & Optimize', desc: 'IAM hardening, guardrails, compliance alignment, and continuous FinOps optimization.', ...PH[3] },
    ],
    stats: [{ label: 'Phases', value: '04' }, { label: 'Timeline', value: '8-20' }, { label: 'Confidence', value: '100%' }],
  },
  future: {
    intro: 'Kangqore helps organizations build beyond initial AWS adoption — extending into the services that define the next generation of cloud-native platforms.',
    items: [
      { title: 'Serverless-First Architecture', desc: 'Adopt Lambda, Step Functions, and event-driven patterns for elastic, pay-per-use compute.' },
      { title: 'Containers & Kubernetes', desc: 'Run portable, resilient workloads on EKS with GitOps-driven delivery and scaling.' },
      { title: 'Data & AI on AWS', desc: 'Build analytics and ML pipelines on SageMaker, Bedrock, and the AWS data stack.' },
      { title: 'AWS FinOps', desc: 'Mature cost governance with savings plans, rightsizing, and continuous spend visibility.' },
    ],
  },
};

// ─── 3. microsoft-services (Azure) ────────────────────────────────────────────
export const microsoftServicesPremiumData = {
  coe: {
    label: 'Microsoft Azure CoE',
    intro: 'surrounds every Azure and Microsoft-ecosystem initiative with four layers of architectural validation, aligned to the Azure Well-Architected Framework.',
    body: 'We replace fragmented Microsoft adoption with a governed Azure practice. By unifying strategy, modernization, automation, and identity-led security, your Microsoft estate becomes a connected, compliant, and cost-controlled platform.',
    quadrants: [
      { lines: ['Azure', 'Strategy'], items: ['Cloud Adoption Framework', 'Management-group design', 'Landing-zone setup', 'Licensing optimization'] },
      { lines: ['Workload', 'Modernization'], items: ['AKS & containers', 'Azure Functions', 'SQL & Cosmos DB', 'App modernization'] },
      { lines: ['DevOps', 'Automation'], items: ['Azure DevOps & GitHub', 'Bicep / Terraform IaC', 'Pipeline automation', 'Release governance'] },
      { lines: ['Identity', 'Governance'], items: ['Entra ID & zero-trust', 'Azure Policy guardrails', 'Defender & compliance', 'Cost Management'] },
    ],
    differentiators: [
      { num: 1, title: 'Cloud Adoption Framework-Led', text: 'Azure environments designed against Microsoft\'s Cloud Adoption and Well-Architected guidance.' },
      { num: 2, title: 'Identity-First Security', text: 'Entra ID and zero-trust principles secure the whole Microsoft ecosystem, not just the network.' },
      { num: 3, title: 'Ecosystem-Connected', text: 'Azure, Microsoft 365, Power Platform, and Dynamics integrated into one coherent operating model.' },
      { num: 4, title: 'Automation-First Delivery', text: 'Azure DevOps, GitHub, and IaC make environments reproducible, governed, and quick to change.' },
      { num: 5, title: 'Full-Lifecycle Ownership', text: 'From adoption strategy to run-state governance, one accountable Azure engineering model.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'Microsoft Azure.',
    items: [
      { title: 'A Cloud Adoption Framework roadmap', desc: 'Management groups, landing zones, and sequencing aligned to Microsoft best practice.' },
      { title: 'Modernized Microsoft workloads', desc: 'AKS, Azure Functions, and managed databases that cut run-cost and operational toil.' },
      { title: 'Identity-led security', desc: 'Entra ID, conditional access, and Defender deliver zero-trust across the estate.' },
      { title: 'Reproducible Azure environments', desc: 'Bicep/Terraform and Azure DevOps pipelines make every environment consistent and auditable.' },
      { title: 'Connected Microsoft ecosystem', desc: 'Azure, Microsoft 365, Power Platform, and Dynamics integrated rather than siloed.' },
      { title: 'Governed, optimized cost', desc: 'Azure Cost Management and licensing optimization keep Microsoft spend disciplined.' },
    ],
  },
  journey: {
    title: 'Our Microsoft Azure', titleHighlight: 'Delivery Model.',
    intro: 'At Kangqore, Microsoft engagements follow the Cloud Adoption Framework — adopt with structure, modernize for scale, automate delivery, govern with identity.',
    phases: [
      { phase: 'ADOPT', icon: ic(Search), title: 'Strategy & Landing Zone', desc: 'Management-group design, landing zones, and an Azure roadmap aligned to business goals.', ...PH[0] },
      { phase: 'MODERNIZE', icon: ic(RefreshCw), title: 'Modernize Workloads', desc: 'Refactor toward AKS, Functions, and managed data services for elastic, efficient scale.', ...PH[1] },
      { phase: 'AUTOMATE', icon: ic(Layers), title: 'DevOps & IaC', desc: 'Azure DevOps, GitHub, and Bicep/Terraform make environments reproducible and fast.', ...PH[2] },
      { phase: 'GOVERN', icon: ic(Activity), title: 'Secure & Optimize', desc: 'Entra ID hardening, Azure Policy guardrails, Defender, and continuous cost optimization.', ...PH[3] },
    ],
    stats: [{ label: 'Phases', value: '04' }, { label: 'Timeline', value: '8-20' }, { label: 'Confidence', value: '100%' }],
  },
  future: {
    intro: 'Kangqore helps organizations build beyond initial Azure adoption — extending into the Microsoft capabilities that shape modern enterprise platforms.',
    items: [
      { title: 'Azure AI & Copilot', desc: 'Adopt Azure OpenAI and Copilot capabilities safely, with governance and grounding built in.' },
      { title: 'Power Platform & Automation', desc: 'Extend the estate with low-code apps, automated workflows, and citizen-developer governance.' },
      { title: 'Containers on AKS', desc: 'Run portable, resilient workloads on AKS with GitOps-driven delivery and scaling.' },
      { title: 'Azure FinOps', desc: 'Mature cost governance with Cost Management, reservations, and licensing optimization.' },
    ],
  },
};

// ─── 4. google-cloud-services ─────────────────────────────────────────────────
export const googleCloudServicesPremiumData = {
  coe: {
    label: 'Google Cloud CoE',
    intro: 'surrounds every Google Cloud initiative with four layers of architectural validation, aligned to the Google Cloud Architecture Framework.',
    body: 'We replace unstructured GCP adoption with a governed engineering practice. By unifying strategy, modernization, data engineering, and security, your Google Cloud estate becomes a scalable, data-driven, and cost-controlled platform.',
    quadrants: [
      { lines: ['GCP', 'Strategy'], items: ['Architecture Framework', 'Resource hierarchy', 'Landing-zone setup', 'Cost forecasting'] },
      { lines: ['Workload', 'Modernization'], items: ['GKE & containers', 'Cloud Run serverless', 'Database migration', 'Anthos hybrid'] },
      { lines: ['Data', 'Engineering'], items: ['BigQuery analytics', 'Dataflow pipelines', 'Pub/Sub streaming', 'Vertex AI readiness'] },
      { lines: ['Security', 'Governance'], items: ['IAM & zero-trust', 'Org policy guardrails', 'Compliance alignment', 'Cost optimization'] },
    ],
    differentiators: [
      { num: 1, title: 'Architecture Framework-Led', text: 'GCP environments designed and reviewed against Google\'s Cloud Architecture Framework.' },
      { num: 2, title: 'Data and AI at the Core', text: 'BigQuery, Dataflow, and Vertex AI make Google Cloud a genuine data-and-intelligence platform.' },
      { num: 3, title: 'Modernization, Not Rehosting', text: 'We move workloads toward GKE, Cloud Run, and managed services — not just lifted VMs.' },
      { num: 4, title: 'Security and Cost Governed', text: 'IAM rigor and continuous optimization keep GCP estates hardened and cost-disciplined.' },
      { num: 5, title: 'Full-Lifecycle Ownership', text: 'From resource hierarchy to run-state operations, one accountable GCP engineering model.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'Google Cloud.',
    items: [
      { title: 'A GCP roadmap aligned to outcomes', desc: 'Resource hierarchy, landing zones, and sequencing built on the Architecture Framework.' },
      { title: 'Cloud-native modernization', desc: 'GKE, Cloud Run, and managed databases reduce run-cost and operational overhead.' },
      { title: 'A genuine data platform', desc: 'BigQuery, Dataflow, and Pub/Sub turn Google Cloud into an analytics and streaming backbone.' },
      { title: 'Reproducible environments', desc: 'Infrastructure-as-Code and CI/CD make every GCP environment consistent and auditable.' },
      { title: 'Hardened, compliant estates', desc: 'IAM, org policy, and zero-trust networking meeting SOC 2, ISO, and HIPAA needs.' },
      { title: 'Disciplined GCP spend', desc: 'Committed-use discounts, rightsizing, and visibility keep cost predictable and low.' },
    ],
  },
  journey: {
    title: 'Our Google Cloud', titleHighlight: 'Delivery Model.',
    intro: 'At Kangqore, Google Cloud engagements follow the Architecture Framework — adopt with structure, modernize for scale, engineer the data layer, govern always.',
    phases: [
      { phase: 'ADOPT', icon: ic(Search), title: 'Strategy & Landing Zone', desc: 'Resource hierarchy, landing zones, and a GCP roadmap aligned to business outcomes.', ...PH[0] },
      { phase: 'MODERNIZE', icon: ic(RefreshCw), title: 'Modernize Workloads', desc: 'Refactor toward GKE, Cloud Run, and managed services for elastic, efficient scale.', ...PH[1] },
      { phase: 'ENGINEER', icon: ic(Database), title: 'Build the Data Layer', desc: 'Stand up BigQuery, Dataflow, and Pub/Sub for analytics, streaming, and AI readiness.', ...PH[2] },
      { phase: 'GOVERN', icon: ic(Activity), title: 'Secure & Optimize', desc: 'IAM hardening, org-policy guardrails, compliance, and continuous cost optimization.', ...PH[3] },
    ],
    stats: [{ label: 'Phases', value: '04' }, { label: 'Timeline', value: '8-20' }, { label: 'Confidence', value: '100%' }],
  },
  future: {
    intro: 'Kangqore helps organizations build beyond initial GCP adoption — extending into the Google Cloud capabilities that define data-driven, intelligent platforms.',
    items: [
      { title: 'BigQuery Data Platform', desc: 'Make BigQuery the analytical core — serverless, governed, and ready for enterprise scale.' },
      { title: 'Vertex AI & GenAI', desc: 'Adopt Vertex AI and Gemini models with governance, grounding, and MLOps discipline.' },
      { title: 'GKE & Anthos', desc: 'Run portable workloads across GKE and hybrid environments with consistent control.' },
      { title: 'GCP FinOps', desc: 'Mature cost governance with committed-use discounts, rightsizing, and spend visibility.' },
    ],
  },
};

// ─── 5. managed-cloud-services ────────────────────────────────────────────────
export const managedCloudServicesPremiumData = {
  coe: {
    label: 'Managed Cloud CoE',
    intro: 'surrounds your running cloud estate with four operational layers — so reliability, cost, and security are engineered, not improvised.',
    body: 'We replace reactive "break-fix" support with an engineered operations practice built on SRE, FinOps, and SecOps principles. Your cloud becomes a continuously optimized, always-on platform — not a queue of incidents.',
    quadrants: [
      { lines: ['Reliability', 'Engineering'], items: ['SLO-driven operations', '24/7 monitoring', 'Incident response', 'Backup & DR'] },
      { lines: ['Cost', 'Governance'], items: ['FinOps practice', 'Rightsizing & savings', 'Anomaly detection', 'Spend transparency'] },
      { lines: ['Security', 'Operations'], items: ['Zero-trust controls', 'Vulnerability management', 'Patch automation', 'Compliance audits'] },
      { lines: ['Continuous', 'Optimization'], items: ['Performance tuning', 'Automation of toil', 'Capacity planning', 'Architecture reviews'] },
    ],
    differentiators: [
      { num: 1, title: 'Operations as Engineering', text: 'We run your cloud with SRE discipline — SLOs and automation, not ticket queues.' },
      { num: 2, title: 'Cost Treated as a Discipline', text: 'FinOps governance turns cloud spend from a variable liability into a controlled investment.' },
      { num: 3, title: 'Security Embedded in Run-State', text: 'Zero-trust controls, patching, and audits are continuous — not periodic projects.' },
      { num: 4, title: 'Proactive, Not Reactive', text: 'We predict and prevent incidents through observability rather than waiting for outages.' },
      { num: 5, title: 'Multi-Cloud Accountability', text: 'One operating model governs AWS, Azure, and GCP estates with unified visibility.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'Managed Cloud.',
    items: [
      { title: 'SRE-grade reliability', desc: 'SLO-driven operations, 24/7 monitoring, and disciplined incident response keep platforms available.' },
      { title: 'Governed, lower cost', desc: 'FinOps rightsizing, savings plans, and anomaly detection typically cut spend 15-35%.' },
      { title: 'Security maintained continuously', desc: 'Zero-trust controls, patch automation, and audits keep estates hardened over time.' },
      { title: 'Resilience you can prove', desc: 'Backup, disaster-recovery design, and recovery drills make continuity testable, not assumed.' },
      { title: 'Less operational toil', desc: 'Automation of routine operations frees your engineers to focus on product, not maintenance.' },
      { title: 'Unified multi-cloud visibility', desc: 'One pane of cost, performance, and security signals across AWS, Azure, and GCP.' },
    ],
  },
  journey: {
    title: 'Our Managed Cloud', titleHighlight: 'Operating Model.',
    intro: 'At Kangqore, managed cloud is a structured operating model — onboard cleanly, run reliably, optimize relentlessly, secure continuously.',
    phases: [
      { phase: 'ONBOARD', icon: ic(Search), title: 'Assess & Transition', desc: 'Estate review, runbook capture, observability setup, and a clean operations handover.', ...PH[0] },
      { phase: 'RUN', icon: ic(Activity), title: 'Operate to SLOs', desc: '24/7 monitoring, SLA/SLO management, backup, DR, and disciplined incident response.', ...PH[1] },
      { phase: 'OPTIMIZE', icon: ic(TrendingUp), title: 'Cost & Performance', desc: 'FinOps rightsizing, performance tuning, and automation of operational toil.', ...PH[2] },
      { phase: 'SECURE', icon: ic(RefreshCw), title: 'Harden & Comply', desc: 'Continuous vulnerability management, patch automation, and compliance audits.', ...PH[3] },
    ],
    stats: [{ label: 'Pillars', value: '04' }, { label: 'Coverage', value: '24/7' }, { label: 'Reliability', value: 'SLO' }],
  },
  future: {
    intro: 'Kangqore helps clients evolve cloud operations beyond keeping the lights on — toward an automated, intelligent, continuously improving practice.',
    items: [
      { title: 'AIOps & Predictive Operations', desc: 'Use ML-assisted signals to predict capacity and reliability issues before they impact users.' },
      { title: 'FinOps Maturity', desc: 'Move from cost-cutting to a continuous financial-operations practice that compounds savings.' },
      { title: 'Platform Engineering', desc: 'Give product teams self-service, golden-path infrastructure with governance built in.' },
      { title: 'Automated Compliance', desc: 'Policy-as-code and continuous controls keep audit-readiness a default state, not a scramble.' },
    ],
  },
};

// ─── 6. analytics ─────────────────────────────────────────────────────────────
export const analyticsPremiumData = {
  coe: {
    label: 'Analytics CoE',
    intro: 'surrounds every analytics initiative with four layers of validation — so data becomes a decision asset rather than a dashboard backlog.',
    body: 'We replace "report-and-hope" with "model-and-prove." By unifying data foundations, modeling, visualization, and activation, analytics moves from descriptive reporting to genuine decision intelligence.',
    quadrants: [
      { lines: ['Data', 'Foundation'], items: ['Source assessment', 'Quality & governance', 'Pipeline design', 'Warehouse / lakehouse'] },
      { lines: ['Modeling', '& Insight'], items: ['Semantic modeling', 'Metric definitions', 'Statistical analysis', 'Predictive models'] },
      { lines: ['Visualization', '& Reporting'], items: ['Decision dashboards', 'Self-service BI', 'KPI frameworks', 'Narrative reporting'] },
      { lines: ['Activation', '& Adoption'], items: ['Embedded analytics', 'Alerting & triggers', 'Decision workflows', 'Data literacy'] },
    ],
    differentiators: [
      { num: 1, title: 'Foundations Before Dashboards', text: 'Reliable pipelines and governed data come first — visualization is built on solid ground.' },
      { num: 2, title: 'Metrics That Mean One Thing', text: 'A governed semantic layer ends the "whose number is right" debate across teams.' },
      { num: 3, title: 'Insight, Not Just Reporting', text: 'We move past descriptive dashboards into diagnostic and predictive decision intelligence.' },
      { num: 4, title: 'Built for Adoption', text: 'Analytics is embedded into workflows and decisions — not left as a portal nobody opens.' },
      { num: 5, title: 'AI-Ready by Design', text: 'Clean, modeled, governed data is the foundation every AI and ML initiative depends on.' },
    ],
  },
  value: {
    title: 'Value We Deliver with', titleHighlight: 'Analytics.',
    items: [
      { title: 'Trustworthy data foundations', desc: 'Governed pipelines, quality controls, and a warehouse or lakehouse built for confident analysis.' },
      { title: 'One agreed set of metrics', desc: 'A semantic layer gives every team the same definitions — ending conflicting numbers.' },
      { title: 'Decisions, not just dashboards', desc: 'KPI frameworks and decision-focused design turn data into action, not wall-art.' },
      { title: 'Predictive and diagnostic insight', desc: 'Move beyond what happened into why it happened and what is likely next.' },
      { title: 'Analytics people actually use', desc: 'Embedded analytics and data-literacy support drive real adoption across the business.' },
      { title: 'An AI-ready data estate', desc: 'Clean, modeled, governed data becomes the launchpad for AI and ML initiatives.' },
    ],
  },
  journey: {
    title: 'Our Analytics', titleHighlight: 'Delivery Model.',
    intro: 'At Kangqore, analytics is a disciplined model — fix the foundation, model with rigor, visualize for decisions, and drive real adoption.',
    phases: [
      { phase: 'FOUNDATION', icon: ic(Search), title: 'Assess & Engineer Data', desc: 'Source assessment, quality, governance, and pipelines into a warehouse or lakehouse.', ...PH[0] },
      { phase: 'MODEL', icon: ic(Database), title: 'Model & Analyze', desc: 'Semantic models, agreed metrics, statistical analysis, and predictive modeling.', ...PH[1] },
      { phase: 'VISUALIZE', icon: ic(BarChart3), title: 'Design for Decisions', desc: 'Decision dashboards, self-service BI, and KPI frameworks built around real questions.', ...PH[2] },
      { phase: 'ACTIVATE', icon: ic(TrendingUp), title: 'Embed & Adopt', desc: 'Embed analytics into workflows, add alerting, and build lasting data literacy.', ...PH[3] },
    ],
    stats: [{ label: 'Phases', value: '04' }, { label: 'Timeline', value: '6-14' }, { label: 'Confidence', value: '100%' }],
  },
  future: {
    intro: 'Kangqore helps organizations build beyond reporting — toward the capabilities that turn analytics into a durable competitive advantage.',
    items: [
      { title: 'Decision Intelligence', desc: 'Combine analytics, context, and automation so insight flows directly into decisions.' },
      { title: 'AI & Machine Learning', desc: 'Use a governed data foundation to adopt prediction, forecasting, and ML safely at scale.' },
      { title: 'Real-Time Analytics', desc: 'Move from batch reporting to streaming insight for operational, in-the-moment decisions.' },
      { title: 'Data Governance & Trust', desc: 'Lineage, quality, and access controls make analytics dependable and audit-ready.' },
    ],
  },
};
