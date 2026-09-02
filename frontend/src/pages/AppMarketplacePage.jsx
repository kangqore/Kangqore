import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Cpu, Cloud, CheckCircle, 
  Download, Star, Box, Tag, Filter, Layers, ExternalLink 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'CERTIFIED', label: 'Certified' },
  { id: 'GOVERNED', label: 'Governed' },
  { id: 'AI_NATIVE', label: 'AI-Native' },
  { id: 'ENTERPRISE_READY', label: 'Enterprise-Ready' },
  { id: 'COMMUNITY', label: 'Community' },
  { id: 'PARTNER', label: 'Partner' },
];

const APPS = [
  {
    appId: 'app-salesforce-sync',
    name: 'Salesforce Enterprise Sync',
    version: '2.4.0',
    category: 'ENTERPRISE_READY',
    publisher: 'Kangqore Official',
    description: 'Bi-directional real-time account, lead, opportunity, and custom object sync with Ontology object mapping.',
    rating: 4.9,
    downloads: 14200,
    governanceScore: 100,
    certifiedBadge: true,
    features: ['Ontology Auto-mapping', 'HANUMANAS RBAC Sync', 'Real-time Webhook Triggers'],
  },
  {
    appId: 'app-jira-agile',
    name: 'Jira Software & Service Desk Bridge',
    version: '3.1.0',
    category: 'CERTIFIED',
    publisher: 'Atlassian Certified Partner',
    description: 'Connect Jira projects, sprints, epics, and issues directly to Kangqore WorkItems and Dependency Graphs.',
    rating: 4.8,
    downloads: 18900,
    governanceScore: 98,
    certifiedBadge: true,
    features: ['Sprint to Portfolio Rollup', 'WorkItem Synchronization', 'Automated Issue Triage'],
  },
  {
    appId: 'app-ai-copilot-studio',
    name: 'Autonomous AI Agent Studio',
    version: '1.8.0',
    category: 'AI_NATIVE',
    publisher: 'Kangqore AI Labs',
    description: 'Build, benchmark, and deploy custom autonomous AI agent personas with HANUMANAS budget limits and tool registries.',
    rating: 5.0,
    downloads: 24500,
    governanceScore: 100,
    certifiedBadge: true,
    features: ['Custom Persona Prompt Registry', 'HANUMANAS Budget Guardrails', 'Multi-Agent Debate Framework'],
  },
  {
    appId: 'app-servicenow-itsm',
    name: 'ServiceNow ITSM & Incident Governor',
    version: '2.1.0',
    category: 'GOVERNED',
    publisher: 'Enterprise Solutions Inc',
    description: 'Governed incident response, change management approvals, and ITIL v4 SLA escalation framework.',
    rating: 4.7,
    downloads: 9400,
    governanceScore: 99,
    certifiedBadge: true,
    features: ['ITIL v4 Governance', 'PendingApproval Lock', 'Automated Root Cause Triage'],
  },
  {
    appId: 'app-datadog-observability',
    name: 'Datadog Telemetry & Incident Automator',
    version: '1.5.0',
    category: 'PARTNER',
    publisher: 'Datadog Partner Engine',
    description: 'Ingest Datadog metrics, APM traces, and security alerts directly into Kangqore Signal Ledger.',
    rating: 4.9,
    downloads: 11200,
    governanceScore: 97,
    certifiedBadge: true,
    features: ['Signal Ledger Ingestion', 'Auto-Trigger Actions', 'SLA Breach Telemetry'],
  },
  {
    appId: 'app-stripe-revenue-ops',
    name: 'Stripe Revenue & Subscription Governor',
    version: '2.0.1',
    category: 'COMMUNITY',
    publisher: 'FinTech Community Devs',
    description: 'Sync Stripe invoices, customer subscriptions, and payment disputes to Kangqore Financial Ontology.',
    rating: 4.6,
    downloads: 8100,
    governanceScore: 95,
    certifiedBadge: false,
    features: ['Financial Ontology Sync', 'Dispute Guardrails', 'Automated Refund Governance'],
  },
];

export default function AppMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingApp, setInstallingApp] = useState(null);
  const [installedApps, setInstalledApps] = useState(['app-ai-copilot-studio']);

  const filteredApps = APPS.filter(app => {
    const matchesCat = selectedCategory === 'ALL' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleInstall = (appId) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps([...installedApps, appId]);
    }
    setInstallingApp(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Box className="w-3.5 h-3.5" />
            Kangqore View Enterprise Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            AI-Native & Governed Integration Apps
          </h1>
          <p className="text-lg text-slate-400">
            Marketplace applications automatically inherit Identity, HANUMANAS Security Policy, Audit Logging, Billing, and Observability.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search apps, integrations, connectors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => {
            const isInstalled = installedApps.includes(app.appId);

            return (
              <div
                key={app.appId}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between gap-6 group"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
                      {app.category}
                    </span>

                    {app.certifiedBadge && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Governed Score {app.governanceScore}/100
                      </span>
                    )}
                  </div>

                  {/* Title & Publisher */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs text-slate-500">by {app.publisher} • v{app.version}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-1.5 pt-2">
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle className="w-3 h-3 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {app.rating}
                    </span>
                    <span>•</span>
                    <span>{app.downloads.toLocaleString()} installs</span>
                  </div>

                  <button
                    onClick={() => setInstallingApp(app)}
                    disabled={isInstalled}
                    className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                      isInstalled
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isInstalled ? 'Installed' : 'Install App'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Installation Confirmation */}
        {installingApp && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{installingApp.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">HANUMANAS Verified</span>
                </div>
                <p className="text-xs text-slate-400">Review governance inheritance before enabling in your tenant.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Governance Inherited</span>
                </div>
                <ul className="space-y-1 pl-6 list-disc text-slate-400">
                  <li>Tenant Data Isolation enforced</li>
                  <li>RBAC / HANUMANAS Policy Engine enforced</li>
                  <li>Full Audit Log tracing enabled</li>
                  <li>Cost & Credit tracking active</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setInstallingApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleInstall(installingApp.appId)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                >
                  Confirm & Install
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
