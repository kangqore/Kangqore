import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Terminal, Shield, Cpu, Layers, Rocket, CheckCircle2, 
  Copy, Download, ExternalLink, Box, Sparkles, FileText, Lock
} from 'lucide-react';

export default function DeveloperPortalPage() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, app-builder, sdk, cli, manifest
  const [appName, setAppName] = useState('My AI Workspace App');
  const [publisherEmail, setPublisherEmail] = useState('dev@company.com');
  const [category, setCategory] = useState('AI_NATIVE');
  const [generatedApp, setGeneratedApp] = useState(null);
  const [copied, setCopied] = useState(false);

  // preview-only credential strings for the UI mockup — not persisted or sent
  // anywhere. Uses the CSPRNG so CodeQL's insecure-randomness rule stays quiet.
  const rand = (n) =>
    Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, n);

  const handleCreateApp = (e) => {
    e.preventDefault();
    const slug = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const appId = `app-dev-${slug}-${rand(4)}`;
    const apiKey = `kq_dev_${Date.now().toString(36)}_${rand(6)}`;
    const clientSecret = `sec_${rand(12)}`;

    setGeneratedApp({
      appId,
      name: appName,
      version: '1.0.0',
      apiKey,
      clientSecret,
      category,
      manifest: {
        manifestVersion: '1.0',
        appId,
        name: appName,
        version: '1.0.0',
        category,
        publisher: { name: 'Developer User', email: publisherEmail },
        description: 'AI-native enterprise app for Kangqore View OS',
        permissions: [
          { resource: 'WorkItem', action: 'READ', reason: 'Read project items' },
          { resource: 'OntologyObject', action: 'WRITE', reason: 'Sync ontology state' }
        ],
        ontologyBindings: [
          { objectType: 'WorkItem', relationshipTypes: ['dependsOn', 'blocks'] }
        ],
        actions: [
          {
            name: 'executeWorkflowStep',
            displayName: 'Execute Workflow Step',
            description: 'Executes app workflow within HANUMANAS sandbox',
            parameters: [{ name: 'stepName', type: 'string', required: true }]
          }
        ]
      }
    });
  };

  const tsCode = `import { KangqoreClient } from '@kangqore/view-sdk';

const client = new KangqoreClient({
  apiKey: '${generatedApp ? generatedApp.apiKey : 'kq_dev_sample_key_12345'}'
});

// Query enterprise ontology object
const item = await client.getObject('item-9921');

// Execute governed action inheriting HANUMANAS policy & audit
const result = await client.executeAction('createWorkItem', {
  title: 'Audit SLA Compliance',
  priority: 'HIGH'
});`;

  const pyCode = `from kangqore_view_sdk import KangqoreClient

client = KangqoreClient(api_key="${generatedApp ? generatedApp.apiKey : 'kq_dev_sample_key_12345'}")

# Query enterprise ontology
item = client.get_object("item-9921")

# Run autonomous agent with inherited governance
res = client.run_agent("agent-copilot", "Reallocate resources for delayed project")`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Code className="w-3.5 h-3.5" />
            developers.kangqoreview.com
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
            Kangqore View Developer Platform
          </h1>
          <p className="text-lg text-slate-400">
            Build AI-native, governed enterprise applications in a day. Harness native Enterprise Ontology, KIMMP Intelligence, and inherited HANUMANAS security.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Layers },
            { id: 'app-builder', label: 'Build App in 10 Min', icon: Sparkles },
            { id: 'sdk', label: 'Open SDKs (NPM / PyPI)', icon: Code },
            { id: 'cli', label: 'Developer CLI', icon: Terminal },
            { id: 'manifest', label: 'App Manifest Standard', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Ontology & Action SDK</h3>
              <p className="text-sm text-slate-400">
                Connect your app directly to Enterprise Objects (WorkItem, Customer, Project). Actions execute with typed parameters and atomic write-back.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Inherited HANUMANAS Governance</h3>
              <p className="text-sm text-slate-400">
                Zero custom auth code needed. Apps automatically inherit tenant isolation, RBAC/ABAC policy engine, audit logging, and cost guardrails.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Agent & UI Extensions</h3>
              <p className="text-sm text-slate-400">
                Deploy autonomous AI agent personas and custom UI widgets into Board, Timeline, and Executive Command Center views.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Build App in 10 Min */}
        {activeTab === 'app-builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  "Build an App in a Day" Wizard
                </h3>
                <p className="text-sm text-slate-400">Generate your app manifest, OAuth API credentials, and SDK boilerplate instantly.</p>
              </div>

              <form onSubmit={handleCreateApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">App Name</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={e => setAppName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Publisher Email</label>
                  <input
                    type="email"
                    value={publisherEmail}
                    onChange={e => setPublisherEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="AI_NATIVE">AI-Native App</option>
                    <option value="ENTERPRISE_READY">Enterprise-Ready Sync</option>
                    <option value="GOVERNED">Governed Security & ITIL</option>
                    <option value="CERTIFIED">Certified Integration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Generate App & Credentials
                </button>
              </form>
            </div>

            {/* Generated Output */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-xl font-bold text-white">App Credentials & Manifest</h3>
              {generatedApp ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">App ID:</span> <span className="text-blue-400">{generatedApp.appId}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">API Key:</span> <span className="text-emerald-400">{generatedApp.apiKey}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Client Secret:</span> <span className="text-purple-400">{generatedApp.clientSecret}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 max-h-48 overflow-y-auto">
                    <pre className="text-slate-300">{JSON.stringify(generatedApp.manifest, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  Fill out the form to generate app credentials and a validated manifest.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Open SDKs */}
        {activeTab === 'sdk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-white">TypeScript / JavaScript SDK</span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">npm i @kangqore/view-sdk</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-xs text-blue-300 font-mono overflow-x-auto border border-slate-800">
                  {tsCode}
                </pre>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-white">Python SDK (PyPI)</span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">pip install kangqore-view-sdk</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-xs text-emerald-300 font-mono overflow-x-auto border border-slate-800">
                  {pyCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Developer CLI */}
        {activeTab === 'cli' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              Kangqore App Developer CLI (`npx kangqore-app`)
            </h3>
            <pre className="p-4 rounded-xl bg-slate-950 text-sm text-amber-300 font-mono overflow-x-auto border border-slate-800">
{`# 1. Initialize a new Kangqore App project
npx kangqore-app init my-custom-app

# 2. Validate manifest schema
npx kangqore-app validate

# 3. Test actions in HANUMANAS policy sandbox
npx kangqore-app test

# 4. Publish to Kangqore View Marketplace
npx kangqore-app publish`}
            </pre>
          </div>
        )}

        {/* Tab 5: App Manifest Standard */}
        {activeTab === 'manifest' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white">kangqore.manifest.json Standard Spec</h3>
            <p className="text-sm text-slate-400">Declarative app manifest defining permissions, ontology bindings, action parameters, and agent capabilities.</p>
            <pre className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300 font-mono overflow-x-auto border border-slate-800">
{`{
  "manifestVersion": "1.0",
  "appId": "app-custom-integration",
  "name": "Custom Integration App",
  "version": "1.0.0",
  "category": "AI_NATIVE",
  "publisher": { "name": "Enterprise Team", "email": "dev@company.com" },
  "description": "Custom enterprise workflow application",
  "permissions": [
    { "resource": "WorkItem", "action": "READ", "reason": "Query work items" },
    { "resource": "OntologyObject", "action": "WRITE", "reason": "Sync object state" }
  ],
  "ontologyBindings": [
    { "objectType": "WorkItem", "relationshipTypes": ["blocks", "dependsOn"] }
  ],
  "actions": [
    {
      "name": "customAction",
      "displayName": "Custom Action",
      "description": "Executes custom governed logic",
      "parameters": [
        { "name": "targetId", "type": "string", "required": true }
      ]
    }
  ]
}`}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
