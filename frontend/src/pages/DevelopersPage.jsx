// ─── /developers — public developer landing page ────────────────────────────
// Overshadow Roadmap P6.3: "invest in documentation, sample apps, and a
// developer community program." This is the part that was structurally
// missing — every existing SDK/developer surface lived behind an admin
// login. Real SDK, real methods, a real public docs link, and an honest
// note about what self-serve access doesn't do yet.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, KeyRound, Webhook } from 'lucide-react';
import useSeo from '../seo/useSeo';

const SITE_URL = 'https://kangqore.com';

const SDK_METHODS = [
  { name: 'kq.getOIS()', desc: 'Fetch recent Operational Intelligence Score snapshots' },
  { name: 'kq.createOISSnapshot()', desc: 'Record a new OIS snapshot' },
  { name: 'kq.getSignals()', desc: 'List KIMMP signals, paginated and filterable' },
  { name: 'kq.createSignal()', desc: 'Ingest a new KIMMP signal' },
  { name: 'kq.getDecisions()', desc: 'List strategic decisions, paginated' },
  { name: 'kq.createDecision()', desc: 'Record a new strategic decision' },
  { name: 'kq.selectDecision()', desc: 'Record which option was selected' },
  { name: 'kq.getBlueprints()', desc: 'List deployment blueprints, paginated' },
  { name: 'kq.createBlueprint()', desc: 'Publish a new deployment blueprint' },
];

const WEBHOOK_EVENTS = [
  { type: 'object.created', desc: 'A new Ontology object was created' },
  { type: 'object.updated', desc: 'An existing Ontology object was updated' },
  { type: 'eval.drift_alert', desc: 'A benchmark run scored a significant regression' },
  { type: 'budget.exceeded', desc: 'A per-user token budget was exceeded' },
];

const CODE = `import { KangqoreClient } from './kangqore-sdk'

const kq = new KangqoreClient({ apiKey: 'kq_live_...' })

const { data: signals } = await kq.getSignals({ severity: 'HIGH' })

const { data: decision } = await kq.createDecision({
  question: 'Should we expand into the EU market in Q3?',
  reasoning: 'Pipeline velocity and TAM analysis',
  options: [/* ... */],
})`;

const DevelopersPage = () => {
  const pageUrl = `${SITE_URL}/developers`;
  const title = 'Developers — Kangqore SDK, API Docs & Webhooks';
  const description = 'The real Kangqore TypeScript and Python SDK, public API documentation, and the four webhook events the platform actually emits — no fictional package, no vanity numbers.';

  useSeo({
    title, description, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'website', url: pageUrl, title, description, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F] dark:text-white">Developers</h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-2xl">
            The real SDK — TypeScript and Python — with the methods it actually has, the four
            webhook events it actually emits, and a public API reference. Nothing here describes
            a package that doesn&apos;t exist.
          </p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-14 lg:py-20">
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-blue" /> The SDK
          </h2>
          <p className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
            <code className="text-sm bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">KangqoreClient</code> is
            downloaded directly from an authenticated endpoint — there is no npm or PyPI package
            published yet, so don&apos;t <code className="text-sm bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">npm install</code> anything
            for it. Once you have API access, the download is a single authenticated request.
          </p>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#0a0f1a] overflow-hidden mb-6">
            <div className="px-4 py-2.5 border-b border-white/10 text-xs font-mono text-gray-400">TypeScript</div>
            <pre className="p-5 text-[13px] leading-relaxed text-blue-200 overflow-x-auto"><code>{CODE}</code></pre>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {SDK_METHODS.map((m) => (
              <div key={m.name} className="flex items-center gap-4 px-5 py-3">
                <code className="text-[13px] font-mono text-brand-blue whitespace-nowrap">{m.name}</code>
                <span className="text-sm text-gray-500 dark:text-gray-400">{m.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <Webhook className="w-5 h-5 text-brand-blue" /> Webhooks
          </h2>
          <p className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
            Exactly four event types are deliverable today, HMAC-signed via <code className="text-sm bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">X-Kangqore-Signature</code>.
          </p>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {WEBHOOK_EVENTS.map((e) => (
              <div key={e.type} className="flex items-center gap-4 px-5 py-3">
                <code className="text-[13px] font-mono text-brand-blue whitespace-nowrap">{e.type}</code>
                <span className="text-sm text-gray-500 dark:text-gray-400">{e.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-blue" /> API reference
          </h2>
          <p className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
            The full OpenAPI 3.1 spec is public — no login required.
          </p>
          <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all">
            Open the API docs <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </section>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-950/60 p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-blue flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              There&apos;s no self-serve signup yet — API keys are issued by a Kangqore admin. Ask and we&apos;ll set one up.
            </span>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all whitespace-nowrap">
            Request API access <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
};

export default DevelopersPage;
