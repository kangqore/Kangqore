// ─── /marketplace — Agent & Governed Action Marketplace ─────────────────────
// Overshadow Roadmap P3.2: App Engine's ecosystem depth comes partly from
// years of accumulated templates and partner apps. This is the public,
// honest start of Kangqore's equivalent — real starter templates and real
// governed actions, not a fabricated catalog size. Reads from
// /api/public/marketplace/agents (aggregate-only, no auth).

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, ShieldCheck, Sparkles } from 'lucide-react';
import useSeo from '../seo/useSeo';

const API = import.meta.env.VITE_BACKEND_URL || '';
const SITE_URL = 'https://kangqore.com';

function useMarketplace() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/api/public/marketplace/agents`)
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);
  return { data, error, loading };
}

function TemplateCard({ t }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{t.iconEmoji ?? '🤖'}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">{t.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {t.manifest?.suggestedTools?.map((tool) => (
          <span key={tool} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{tool}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="capitalize">{t.category}</span>
        <span>{t.installCount} use{t.installCount === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}

function ActionRow({ a }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <ShieldCheck className="w-4 h-4 text-brand-blue flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.displayName}</span>
        <span className="text-sm text-gray-400"> — {a.description}</span>
      </div>
      <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">{a.executions} call{a.executions === 1 ? '' : 's'}</span>
    </div>
  );
}

const AgentMarketplacePage = () => {
  const { data, error, loading } = useMarketplace();
  const pageUrl = `${SITE_URL}/marketplace`;
  const title = 'Agent & Governed Action Marketplace — Kangqore';
  const description = 'Real starter templates and governed, tool-callable actions available in Kangqore Agent Studio — not a fabricated catalog, an honest count.';

  useSeo({
    title, description, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'website', url: pageUrl, title, description, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Blocks className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F] dark:text-white">Agent Marketplace</h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl">
            Real starter templates and governed actions available in Agent Studio today. This catalog is
            young — we&apos;re publishing the honest size of it now and growing it in the open, not
            waiting until it looks bigger.
          </p>
          <Link to="/trust/agent-studio-benchmark" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all">
            <Sparkles className="w-4 h-4" /> See the build benchmark <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Starter templates</h2>
            {data && <span className="text-sm text-gray-400">{data.agentTemplates.length} published</span>}
          </div>
          {error && <p className="text-sm text-gray-400">Marketplace temporarily unavailable.</p>}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />)}
            </div>
          )}
          {data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.agentTemplates.map((t) => <TemplateCard key={t.id} t={t} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900 bg-[#FAFAFA] dark:bg-gray-950/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Governed actions</h2>
            {data && <span className="text-sm text-gray-400">{data.governedActions.length} tool-callable</span>}
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-3xl mb-8">
            Actions any Agent Studio agent can be given, each opted in explicitly and executed under the
            same AEGIS audit trail as everything else on the platform — see{' '}
            <Link to="/trust" className="text-brand-blue hover:underline">Trust &amp; Governance</Link>.
          </p>
          {data && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
              {data.governedActions.map((a) => <ActionRow key={a.name} a={a} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AgentMarketplacePage;
