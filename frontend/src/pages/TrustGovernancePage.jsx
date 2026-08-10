// ─── /trust — Trust & Governance ────────────────────────────────────────────
// Overshadow Roadmap P1 ("Publish the Proof"): makes AEGIS's governance-native
// posture, the live capability scorecard, and the eval/drift pipeline
// independently verifiable — not just a claim in a competitive playbook.
// All three data sections read from /api/public/trust/*, which is aggregate-
// only (counts, percentages, category labels) — see backend/src/routes/
// public-trust.ts for what is deliberately never exposed here.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ChevronRight, Radio, Eye, Wallet, Activity,
  CheckCircle2, Circle, TrendingUp, FileText, ArrowRight,
} from 'lucide-react';
import useSeo from '../seo/useSeo';

const API = import.meta.env.VITE_BACKEND_URL || '';
const SITE_URL = 'https://kangqore.com';

function useTrustData(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aborted = false;
    fetch(`${API}/api/public/trust/${path}`)
      .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json(); })
      .then((json) => { if (!aborted) { setData(json); setLoading(false); } })
      .catch(() => { if (!aborted) { setError(true); setLoading(false); } });
    return () => { aborted = true; };
  }, [path]);

  return { data, error, loading };
}

function SkeletonRow() {
  return <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />;
}

function CapabilityCard({ c }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{c.label}</span>
        {c.live ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3" /> Live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Circle className="w-3 h-3" /> Pending
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{c.metric}</p>
    </div>
  );
}

function ScorecardSection() {
  const { data, error, loading } = useTrustData('scorecard');
  return (
    <section className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-brand-blue mb-3">
          <Radio className="w-3.5 h-3.5" /> Live, computed on every page load
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Kangqore Live Capability Scorecard
          </h2>
          {data && (
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {data.overall.liveCount} / {data.overall.totalCount} capabilities live in production
            </div>
          )}
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl mb-10">
          Ten capabilities, ten real queries against the production database — not a hand-maintained
          slide. Every card below reflects what is actually running right now, refreshed each time this
          page loads.
        </p>
        {error && (
          <p className="text-sm text-gray-400">Scorecard temporarily unavailable — try again shortly.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          {data && data.capabilities.map((c) => <CapabilityCard key={c.key} c={c} />)}
        </div>
        {data && (
          <p className="text-xs text-gray-400 mt-6">
            Computed {new Date(data.computedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}
      </div>
    </section>
  );
}

function GovernanceSection() {
  const { data, error, loading } = useTrustData('governance-summary');
  return (
    <section className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900 bg-[#FAFAFA] dark:bg-gray-950/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          How AEGIS governs every AI action
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl mb-10">
          Audit, PII detection, and budget enforcement are native to the request path — every AI call
          passes through all three before it executes, not as a bolt-on control tower added years later.
        </p>
        {error && <p className="text-sm text-gray-400">Governance summary temporarily unavailable.</p>}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        )}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <Eye className="w-6 h-6 text-brand-blue mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Audit Trail</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{data.auditTrail.description}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-gray-400">Activations logged</dt><dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.auditTrail.totalActivations.toLocaleString()}</dd></div>
                <div><dt className="text-gray-400">Autonomous runs</dt><dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.auditTrail.totalAutonomous.toLocaleString()}</dd></div>
                <div><dt className="text-gray-400">Access denials</dt><dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.auditTrail.totalDenied.toLocaleString()}</dd></div>
                <div><dt className="text-gray-400">Systems tracked</dt><dd className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.auditTrail.systemsTracked}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <ShieldCheck className="w-6 h-6 text-brand-blue mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">PII Detection</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{data.piiPolicy.description}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Categories detected</p>
              <ul className="flex flex-wrap gap-1.5 mb-4">
                {data.piiPolicy.categoriesDetected.map((cat) => (
                  <li key={cat} className="text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{cat}</li>
                ))}
              </ul>
              <div className="text-sm"><span className="text-gray-400">Mode</span> <span className="font-semibold text-gray-900 dark:text-white">{data.piiPolicy.mode}</span> · <span className="text-gray-400">flagged</span> <span className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.piiPolicy.incidentsFlagged.toLocaleString()}</span></div>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <Wallet className="w-6 h-6 text-brand-blue mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Budget Enforcement</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{data.budgetEnforcement.description}</p>
              <div className="text-sm"><span className="text-gray-400">Active budgets</span> <span className="font-semibold text-gray-900 dark:text-white tabular-nums">{data.budgetEnforcement.activeBudgets}</span></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EvalHealthSection() {
  const { data, error, loading } = useTrustData('eval-health');
  return (
    <section id="eval-pipeline" className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          Eval &amp; drift pipeline
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl mb-10">
          {data?.goldenPromptSet?.description ||
            'A fixed golden-prompt benchmark runs against production routing and flags regressions automatically.'}
        </p>
        {error && <p className="text-sm text-gray-400">Eval health temporarily unavailable.</p>}
        {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><SkeletonRow /><SkeletonRow /></div>}
        {data && data.latest && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-brand-blue" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Latest run</h3>
                <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${data.latest.gate === 'PASS' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'}`}>
                  Gate {data.latest.gate}
                </span>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums mb-1">
                {data.latest.totalScore.toFixed(0)}<span className="text-lg text-gray-400 font-medium">/100</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {data.latest.passCount} passed · {data.latest.failCount} failed
                {data.latest.driftAlert ? ' · drift alert on this run' : ' · no drift detected'}
              </p>
              <p className="text-xs text-gray-400">
                Run started {new Date(data.latest.startedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-brand-blue" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Score by category</h3>
              </div>
              <div className="space-y-2.5">
                {data.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-32 shrink-0 capitalize">{cat.category.replace('-', ' ')}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full bg-brand-blue rounded-full" style={{ width: `${cat.avgScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums w-10 text-right">{cat.avgScore}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GateBadge({ flag, label, status }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex items-center gap-3">
      <span className="text-lg">{flag}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1">{label}</span>
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{status}</span>
    </div>
  );
}

function ComplianceReadinessSection() {
  const { data, error, loading } = useTrustData('compliance-readiness');
  return (
    <section id="compliance" className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900 bg-[#FAFAFA] dark:bg-gray-950/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          Compliance readiness
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl mb-4">
          Not a certification page — an honest readiness view across the four programs we're actually
          working through: SOC 2 Type II, ISO 27001:2022, FedRAMP, and IRAP.
        </p>
        {data && (
          <p className="text-sm text-gray-400 max-w-3xl mb-10">{data.disclaimer}</p>
        )}
        {error && <p className="text-sm text-gray-400">Compliance readiness temporarily unavailable.</p>}
        {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><SkeletonRow /><SkeletonRow /></div>}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[{ key: 'soc2', label: 'SOC 2 Type II' }, { key: 'iso27001', label: 'ISO 27001:2022' }].map(({ key, label }) => {
              const fw = data[key];
              return (
                <div key={key} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                    <span className="text-xl font-bold text-brand-blue tabular-nums">{fw.readinessPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: `${fw.readinessPct}%` }} />
                  </div>
                  <div className="flex gap-5 text-sm">
                    <span><span className="font-semibold text-gray-900 dark:text-white tabular-nums">{fw.controls.in_place}</span> <span className="text-gray-400">in place</span></span>
                    <span><span className="font-semibold text-gray-900 dark:text-white tabular-nums">{fw.controls.partial}</span> <span className="text-gray-400">partial</span></span>
                    <span><span className="font-semibold text-gray-900 dark:text-white tabular-nums">{fw.controls.missing}</span> <span className="text-gray-400">missing</span></span>
                  </div>
                </div>
              );
            })}
            <GateBadge flag="🇺🇸" label="FedRAMP Moderate" status={data.fedramp.status} />
            <GateBadge flag="🇦🇺" label="IRAP" status={data.irap.status} />
          </div>
        )}
      </div>
    </section>
  );
}

const TrustGovernancePage = () => {
  const pageUrl = `${SITE_URL}/trust`;

  useSeo({
    title: 'Trust & Governance — Kangqore',
    description: 'The Kangqore live capability scorecard, AEGIS audit trail, PII policy, and eval/drift pipeline — independently verifiable, computed on every page load.',
    canonical: pageUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    lang: 'en',
    og: { type: 'website', url: pageUrl, title: 'Trust & Governance — Kangqore', description: 'Governance-native AI, made independently verifiable.', site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title: 'Trust & Governance — Kangqore', description: 'Governance-native AI, made independently verifiable.' },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] dark:bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-1.5 text-xs font-medium mb-6 text-gray-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gray-700 dark:text-gray-300 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Trust &amp; Governance</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F] dark:text-white">Trust &amp; Governance</h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-3xl">
            AEGIS governs every AI action Kangqore takes — audit, PII detection, and budget enforcement,
            all native to the request path since the first agent ran. This page doesn&apos;t ask you to take
            that on faith: every number below is a live query against production, not a static claim.
          </p>
          <Link
            to="/trust/governance-native-vs-retrofitted"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all"
          >
            <FileText className="w-4 h-4" /> Read the technical whitepaper <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <ScorecardSection />
      <GovernanceSection />
      <EvalHealthSection />
      <ComplianceReadinessSection />

      {/* Agent Studio cross-links — Overshadow Roadmap P3 */}
      <section className="py-10 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-wrap gap-6">
          <Link to="/trust/agent-studio-benchmark" className="text-sm font-semibold text-brand-blue hover:underline">
            Agent Studio build benchmark vs. App Engine →
          </Link>
          <Link to="/marketplace" className="text-sm font-semibold text-brand-blue hover:underline">
            Agent &amp; governed action marketplace →
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 lg:py-20 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="rounded-3xl bg-[#1D1D1F] dark:bg-gray-900 px-8 py-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">Want the architecture case, not just the numbers?</h2>
              <p className="text-gray-400 max-w-xl">
                The whitepaper walks through why governance-native beats governance-retrofitted, sourced
                and written for a technical evaluator.
              </p>
            </div>
            <Link
              to="/trust/governance-native-vs-retrofitted"
              className="inline-flex items-center gap-2 bg-white text-[#1D1D1F] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Read the whitepaper <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustGovernancePage;
