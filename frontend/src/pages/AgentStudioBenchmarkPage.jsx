// ─── /trust/agent-studio-benchmark ──────────────────────────────────────────
// Overshadow Roadmap P3.1 — "publish the comparison, favorable or not."
// Kangqore's numbers are computed live from /api/public/trust/agent-studio-
// benchmark (real agent-creation/run data, honestly flagged when the sample
// is too small to trust). App Engine's numbers are its own vendor-commissioned
// Forrester study, reported as-is with the source linked — not re-verified,
// not disputed, just disclosed for what it is.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, TriangleAlert } from 'lucide-react';
import useSeo from '../seo/useSeo';

const API = import.meta.env.VITE_BACKEND_URL || '';
const SITE_URL = 'https://kangqore.com';

function useBenchmark() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`${API}/api/public/trust/agent-studio-benchmark`)
      .then((r) => { if (!r.ok) throw new Error('bad'); return r.json(); })
      .then(setData)
      .catch(() => setError(true));
  }, []);
  return { data, error };
}

function StatRow({ label, value, sub }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right">
        <span className="text-base font-semibold text-gray-900 dark:text-white tabular-nums">{value}</span>
        {sub && <span className="block text-xs text-gray-400">{sub}</span>}
      </span>
    </div>
  );
}

const AgentStudioBenchmarkPage = () => {
  const { data, error } = useBenchmark();
  const pageUrl = `${SITE_URL}/trust/agent-studio-benchmark`;
  const title = 'Agent Studio vs. App Engine — The Build Benchmark — Kangqore';
  const description = 'A live comparison of Kangqore Agent Studio’s real build metrics against ServiceNow App Engine’s own vendor-reported figures — published as-is, favorable or not.';

  useSeo({
    title, description, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'article', url: pageUrl, title, description, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description },
  });

  const k = data?.kangqore;
  const ae = data?.appEngine;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-14 lg:pt-40 lg:pb-16 bg-[#F5F5F7] dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <Link to="/trust" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Trust &amp; Governance
          </Link>
          <span className="text-xs font-semibold tracking-wide uppercase text-brand-blue">Live benchmark · Overshadow Roadmap P3.1</span>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1D1D1F] dark:text-white leading-[1.15] mt-3 mb-4">
            Agent Studio vs. App Engine — the build benchmark
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
            We said we&apos;d publish this comparison whether it favoured us or not. Here it is, computed
            live, not written once and left to go stale.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-14 lg:py-20">
        {error && <p className="text-sm text-gray-400">Benchmark temporarily unavailable — try again shortly.</p>}

        {k && (
          <div className="rounded-2xl border-2 border-amber-300/50 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-5 mb-10 flex gap-3">
            <TriangleAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Read this honestly:</strong> Kangqore&apos;s
              side is a young, small-sample number from a platform Agent Studio just shipped on. App
              Engine&apos;s side is a mature, vendor-commissioned study of paying customers. This is not yet
              an apples-to-apples comparison — it&apos;s two real numbers, disclosed with their actual
              context, not smoothed into a false equivalence.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Kangqore Agent Studio</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">LIVE DATA</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Computed from this platform, right now.</p>
            {k ? (
              <div>
                <StatRow label="Starter templates" value={k.templateCount} />
                <StatRow label="Governed tool-callable actions" value={k.toolCallableActionCount} />
                <StatRow label="Agents created" value={k.totalAgentsCreated} />
                <StatRow
                  label="Median build-to-first-run"
                  value={k.buildToFirstRun.insufficientData ? '—' : `${k.buildToFirstRun.medianMinutes.toFixed(1)} min`}
                  sub={k.buildToFirstRun.insufficientData ? `Only ${k.buildToFirstRun.sampleSize} data point${k.buildToFirstRun.sampleSize === 1 ? '' : 's'} so far — too few to trust a median` : `n = ${k.buildToFirstRun.sampleSize}`}
                />
              </div>
            ) : <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />}
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">ServiceNow App Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">VENDOR-REPORTED</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Forrester TEI study, commissioned by ServiceNow.</p>
            {ae ? (
              <div>
                <StatRow label="ROI" value={`${ae.roiPct}%`} sub={`${ae.paybackMonths}-month payback`} />
                <StatRow label="End-user task efficiency gain" value={`${ae.endUserEfficiencyGainPct}%`} />
                <StatRow label="Developer efficiency" value={ae.developerEfficiencyMultiple} />
                <StatRow label="Interview sample" value={`${ae.interviewSampleSize} decision-makers`} sub="vendor-selected" />
              </div>
            ) : <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">How we measured our own side</h2>
          <div className="space-y-4 text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
            <p>
              &quot;Build-to-first-run&quot; is the real elapsed time between when a KimmpAgent row is created
              and when it first successfully executes, taken from production timestamps — not a
              stopwatch demo, not a curated best case. When fewer than five agents have both a creation
              time and a first run, we report that plainly instead of publishing a median that would
              imply more confidence than the sample supports.
            </p>
            <p>
              The starter-template count and governed tool-callable-action count are exact row counts
              from the same database the builder reads from — the same numbers you&apos;d see if you
              opened Agent Studio yourself right now.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">What App Engine&apos;s numbers are, precisely</h2>
          <div className="space-y-4 text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
            <p>
              The 230% ROI and 9-month payback come from a Forrester Total Economic Impact™ study
              commissioned and published by ServiceNow, based on interviews with six decision-makers at
              App Engine customer organisations. The 50–75% figure is Forrester&apos;s reported gain in
              <em> end-user</em> task efficiency; the 4x figure is separately reported <em>developer</em>{' '}
              efficiency — two different populations, worth not collapsing into one claim.
            </p>
            <p>
              We are not disputing these numbers or re-running the study. We&apos;re disclosing exactly
              what they are — vendor-commissioned, small-sample, real — the same standard we&apos;re
              holding our own numbers to on the left.
            </p>
          </div>
        </section>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-950/60 p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-blue flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">See the templates and governed actions this benchmark is built on.</span>
          </div>
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all whitespace-nowrap">
            View the marketplace <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ae && (
          <p className="text-xs text-gray-400 mt-8">
            Source: <a href={ae.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{ae.source} ↗</a>
          </p>
        )}
      </article>
    </div>
  );
};

export default AgentStudioBenchmarkPage;
