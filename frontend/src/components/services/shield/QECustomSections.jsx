import React from 'react';
import { Network, Link2, GitMerge, Bot, ShieldCheck, Search, Layers, Server, Activity, Cpu, Shield, Code2 } from 'lucide-react';
import {
  EditorialQuoteSection,
  WhyThisServiceSection,
  ValueAccordionSection,
  DiamondCoESection,
  DeliveryModelSection,
  ExecutionEcosystemSection,
  FutureReadySection
} from '../../ServiceCustomSections';

// ═══════════════════════════════════════════════════════════════════════════════
// Quality Engineering Custom Sections — Benchmark Layout
// Uses the shared ServiceCustomSections library for Blockchain-parity layout
// ═══════════════════════════════════════════════════════════════════════════════

export const QECustomSectionsBlock1 = () => (
  <div className="flex flex-col w-full">
    <EditorialQuoteSection
      image="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=format&fit=crop&w=1260&q=80"
      quote="Quality is easy to promise."
      highlightText="Harder to sustain at velocity."
      imageAlt="Quality Engineering Pipeline"
    />
    <WhyThisServiceSection
      badgeText="The Bottleneck"
      badgeIcon={Search}
      title="Moving Beyond"
      highlightWord="Reactive Testing."
      intro="Quality Engineering becomes meaningful only when testing is embedded directly into delivery pipelines — not bolted on as an afterthought. At Kangqore, we approach QE as continuous validation architecture, not manual bottleneck management."
      foundation={{ label: 'The Foundation', text: 'True quality engineering replaces manual test cycles with algorithmic validation gates, self-healing automation, and predictive defect analytics embedded directly into your CI/CD backbone.' }}
      challenge={{ label: 'The Pressure', text: 'Manual regression testing takes weeks. CI/CD pipelines fracture under load. Production rollbacks erode user trust and bleed revenue. The cost of finding defects post-release is 10x pre-release.' }}
    />
    <ValueAccordionSection
      badgeText="Value Delivered"
      badgeIcon={Activity}
      title="Value We Deliver with"
      highlightWord="Quality Engineering."
      intro="We help engineering teams eliminate testing bottlenecks, compress release cycles, and achieve zero-defect confidence at continuous delivery velocity."
      values={[
        { title: 'Eliminate manual regression drag', desc: 'We compress week-long manual regression cycles into thirty-minute automated sweeps using self-healing headless browser swarms and predictive test routing.' },
        { title: 'Shift-left pipeline confidence', desc: 'By wiring quality gates directly into your CI/CD commit triggers, we force defects to surface before they infect production — not after.' },
        { title: 'Bulletproof data-driven decisions', desc: 'We ensure executive dashboards report mathematically flawless metrics by enforcing high-volume ETL sanitization and automated data lake integrity audits.' },
        { title: 'De-risk massive ERP migrations', desc: 'By validating SAP, Oracle, and Dynamics workflows with strict RBAC enforcement, we prevent enterprise migrations from paralyzing daily operations.' },
        { title: 'Absorb execution risk entirely', desc: 'In our Testing-as-a-Service (TaaS) model, Kangqore manages the infrastructure, provides elite engineer pools elastically, and answers directly for final release certification.' },
        { title: 'Scale omnichannel validation', desc: 'We hook release cycles directly into massive real-device clouds, validating omnichannel state paths from mobile to web to wearable dynamically.' }
      ]}
    />
    <DiamondCoESection
      coeHighlight="Quality Engineering CoE"
      coeParagraph1="defines the right test architecture, automation framework, and governance protocols before test debt compounds into delivery risk."
      coeParagraph2="By unifying shift-left pipeline integration, algorithmic automation, SRE chaos engineering, and outcome-based TaaS, we ensure your release confidence is absolute."
      quadrants={[
        { title: 'Pipeline\nIntegrity', items: ['CI/CD Gating', 'Shift-Left Automation', 'DevOps Integration', 'Release Governance'], gradient: 'from-blue-600 to-blue-800' },
        { title: 'Algorithmic\nAutomation', items: ['Self-Healing Scripts', 'Predictive Regression', 'Cognitive Routing', 'Synthetic Data'], gradient: 'from-blue-400 to-blue-600' },
        { title: 'Data\nResilience', items: ['ETL Sanitization', 'Schema Validation', 'BI Dashboard Proofs', 'PII Masking'], gradient: 'from-blue-900 to-slate-900' },
        { title: 'Experience\nFidelity', items: ['WCAG Auditing', 'Omnichannel Sync', 'Cross-Browser Checks', 'A/B Validation'], gradient: 'from-cyan-500 to-cyan-700' }
      ]}
      differentiators={[
        { num: 1, title: 'We Eliminate Operational Drag', text: 'We rip out broken testing cultures and mandate strict TCoE engineering protocols so developers build, not debug.' },
        { num: 2, title: 'Algorithmic Self-Healing', text: 'Our automation frameworks identify regression risks dynamically and repair their own execution paths without human intervention.' },
        { num: 3, title: 'Elite Delivery Accountability', text: 'We partner where zero-defect deployments matter. We absorb execution risk and own release certification outcomes.' },
        { num: 4, title: 'Unified SRE Depth', text: 'We test limits before users hit them — from extreme chaos engineering to deep microservice state assertions.' },
        { num: 5, title: 'Full-Stack Validation', text: 'From API contracts and ERP workflows to mobile UX and IoT telemetry, we cover every layer without blind spots.' },
        { num: 6, title: 'Scalable Managed Execution', text: 'Our TaaS model scales elastically with your release velocity — zero capex, SLA-driven, outcome-based.' }
      ]}
    />
    <DeliveryModelSection
      badgeText="Delivery Model"
      badgeIcon={Network}
      title="Our Quality Engineering"
      highlightWord="Delivery Model."
      intro="Quality Engineering delivery is structured as a shift-left, automation-first model — designed to embed validation into your pipeline from day one and scale to enterprise production."
      phases={[
        { phase: 'ASSESS', icon: <Search className="w-7 h-7" />, title: 'Pipeline Assessment & Baselining', desc: 'Map existing test coverage gaps, CI/CD bottlenecks, and total cost of quality to establish a defensible ROI baseline.', gradient: 'from-slate-600 to-slate-800' },
        { phase: 'ARCHITECT', icon: <Layers className="w-7 h-7" />, title: 'Framework & IaC Injection', desc: 'Deploy standardized code-first automation frameworks (Cypress/Playwright) and provision ephemeral cloud testing environments via Terraform.', gradient: 'from-blue-500 to-blue-700', kangqore: true },
        { phase: 'INTEGRATE', icon: <Server className="w-7 h-7" />, title: 'Shift-Left Pipeline Gating', desc: 'Wire automation suites directly into Jenkins/GitLab triggers, enforcing absolute quality thresholds before merge commits.', gradient: 'from-brand-blue to-indigo-600', kangqore: true },
        { phase: 'SCALE', icon: <Activity className="w-7 h-7" />, title: 'Outcome Certification & Handover', desc: 'Execute final blast-radius chaos testing. Hand over an observable, dashboard-driven Quality Center of Excellence aligned to your release SLAs.', gradient: 'from-cyan-400 to-cyan-600', kangqore: true }
      ]}
      stats={[
        { label: 'Phases', value: '04' },
        { label: 'Cycle', value: 'Shift-Left' },
        { label: 'Control', value: 'MAX' }
      ]}
    />
  </div>
);

export const QECustomSectionsBlock2 = () => (
  <div className="flex flex-col w-full">
    <ExecutionEcosystemSection
      badgeText="Automation Ecosystem"
      badgeIcon={Cpu}
      title="The Quality Engineering"
      highlightWord="Automation Stack."
      intro="Sustained testing velocity requires more than scripts. It requires pipeline integration, algorithmic intelligence, SRE resilience, and data governance working as one unified ecosystem."
      centerIcon={Shield}
      orbit1={[{ label: 'Selenium', pos: 'top' }, { label: 'Cypress', pos: 'bottom' }]}
      orbit2={[{ label: 'AI\nEngine', pos: 'topRight' }, { label: 'SRE', pos: 'bottomLeft' }]}
      orbit3={[{ label: 'Jenkins', pos: 'topRight' }, { label: 'K8s', pos: 'bottomRight' }, { label: 'Datadog', pos: 'left' }]}
    />
    <FutureReadySection
      badgeText="Quality Imperatives"
      badgeIcon={ShieldCheck}
      title="What Zero-Defect Delivery"
      highlightWord="Requires."
      intro="We help engineering teams navigate the four critical quality pillars that separate reactive bug-fixing from proactive, governed quality engineering."
      requirements={[
        { title: 'Embedded Pipeline Automation', desc: 'Testing must be wired natively into CI/CD commit triggers — not bolted on as a late-stage gate. Only then can defects surface before they infect production.' },
        { title: 'Algorithmic Self-Healing', desc: 'Manual script maintenance is the single biggest drag on automation ROI. Self-healing locators and predictive regression routing eliminate this bottleneck entirely.' },
        { title: 'Observability-Driven Validation', desc: 'Quality metrics must flow into the same SIEM and APM dashboards as production telemetry. Siloed quality reporting creates blind spots that cost revenue.' },
        { title: 'Outcome-Based Accountability', desc: 'The testing function must be measured by release certification outcomes, not by script execution counts. SLA-driven TaaS models enforce this accountability.' }
      ]}
    />
  </div>
);

// Legacy default export for backward compatibility
const QECustomSections = () => <QECustomSectionsBlock1 />;
export default QECustomSections;
