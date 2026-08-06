// ─── /trust/governance-native-vs-retrofitted ────────────────────────────────
// Overshadow Roadmap P1.2 — technical whitepaper for a CIO/CISO/technical
// evaluator audience, arguing the sequencing case: governance built into the
// request path from the first agent run vs. governance layered on top of an
// existing platform years later. ServiceNow facts below are sourced (see the
// footer) and current as of publication; Kangqore's own claims are scoped to
// verifiable architecture, not business metrics.

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';
import useSeo from '../seo/useSeo';

const SITE_URL = 'https://kangqore.com';

const SOURCES = [
  { label: 'ServiceNow Newsroom — AI Control Tower launch', url: 'https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-Launches-AI-Control-Tower-a-Centralized-Command-Center-to-Govern-Manage-Secure-and-Realize-Value-From-Any-AI-Agent-Model-and-Workflow/default.aspx' },
  { label: 'ServiceNow Newsroom — Moveworks acquisition announcement', url: 'https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-to-extend-leading-agentic-AI-to-every-employee-for-every-corner-of-the-business-with-acquisition-of-Moveworks-03-10-2025-traffic/default.aspx' },
  { label: 'ServiceNow Newsroom — Moveworks acquisition completed', url: 'https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-completes-acquisition-of-Moveworks/default.aspx' },
  { label: 'Everest Group — $2.85B Moveworks acquisition analysis', url: 'https://www.everestgrp.com/blog/servicenows-2-85b-moveworks-acquisition-evaluating-the-strategic-impact-blog.html' },
  { label: 'ServiceNow — AI Control Tower product page', url: 'https://www.servicenow.com/products/ai-control-tower.html' },
  { label: 'ServiceNow Newsroom — AI Control Tower / Microsoft Agent 365 expansion, Knowledge 2026', url: 'https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-expands-AI-agent-governance-through-deeper-integration-with-Microsoft/default.aspx' },
];

function Section({ title, children }) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 text-[17px] leading-relaxed text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

const GovernanceNativeWhitepaperPage = () => {
  const pageUrl = `${SITE_URL}/trust/governance-native-vs-retrofitted`;
  const title = 'Governance-Native vs. Governance-Retrofitted — Kangqore';
  const description = 'A technical comparison of building AI governance into the request path from day one versus adding a control layer on top of an existing platform years later.';

  useSeo({
    title, description, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'article', url: pageUrl, title, description, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-14 lg:pt-40 lg:pb-16 bg-[#F5F5F7] dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <Link to="/trust" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Trust &amp; Governance
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-[#1D1D1F] rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase text-brand-blue">Technical whitepaper</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1D1D1F] dark:text-white leading-[1.15] mb-4">
            Governance-Native vs. Governance-Retrofitted
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
            Why the order you build in matters as much as what you build. Written for CIOs, CISOs, and
            technical evaluators comparing AI governance architectures.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-14 lg:py-20">
        <Section title="The claim this paper tests">
          <p>
            Every enterprise buying AI agents in 2026 is asking some version of the same question: when
            something goes wrong — a hallucinated action, a PII leak, an agent that spends past its
            budget — is there a record of it, and could it have been stopped before it happened? The
            honest answer depends less on which vendor you ask and more on <em>when in that vendor&apos;s
            history</em> the governance layer was built relative to the AI system it governs.
          </p>
          <p>
            This paper makes a narrow, checkable argument: a governance layer designed into the request
            path from the first AI call behaves differently — in what it can prevent, not just record —
            than a governance layer added on top of an AI platform that has already been running for
            years. We use ServiceNow&apos;s AI Control Tower as the comparison point because it is the
            most prominent recent example of the retrofit pattern, and because ServiceNow has been
            transparent about its own timeline.
          </p>
        </Section>

        <Section title="The sequencing argument">
          <p>
            ServiceNow launched AI Control Tower in 2025 as a centralized command center to govern,
            manage, secure, and account for AI agents, models, and workflows already running across the
            Now Platform. In March 2025 ServiceNow announced its acquisition of Moveworks, an enterprise
            AI assistant and search company, for $2.85 billion in cash and stock; the deal closed in
            December 2025 at a final purchase consideration of roughly $2.4 billion. Through 2026,
            ServiceNow has continued extending AI Control Tower&apos;s governance reach outward — most
            recently to Microsoft Agent 365 and NVIDIA-secured agent runtimes announced at Knowledge
            2026.
          </p>
          <p>
            None of that is a criticism — it is a large, well-resourced platform doing the hard, correct
            thing: building a governance layer wide enough to sit on top of workflows, models, and now
            acquired products that were not originally designed to share one. But a control tower built
            to sit <em>on top of</em> existing systems inherits a structural constraint: it can observe
            and, where the integration allows, intervene — but it cannot enforce a rule that a call was
            never routed through it in the first place. Coverage grows connector by connector, product
            line by product line, acquisition by acquisition.
          </p>
          <p>
            Kangqore&apos;s governance layer, AEGIS, was not added to an existing AI system — it is the
            layer every AI call passes through by construction. There has never been a version of the
            Kangqore platform where an AI action could execute without first clearing an audit write, a
            PII scan, and a budget check, because those three checks live in the same code path as the
            call itself, not in a separate product bolted alongside it.
          </p>
        </Section>

        <Section title="What 'native' means concretely">
          <p>
            Three claims, each independently checkable on the live scorecard at{' '}
            <Link to="/trust" className="text-brand-blue font-medium hover:underline">kangqore.com/trust</Link>:
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Audit trail timing.</strong> Every AI-initiated
            action — an activation, an autonomous run, an access denial, a knowledge-asset write — is
            written to AEGIS&apos;s immutable ledger <em>before</em> the action executes, not sampled or
            reconstructed from logs after the fact. The write is synchronous with the call.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">PII handling as policy, not configuration.</strong>{' '}
            Every prompt and response passes a PII scan before it is logged, governed by one of three
            modes: AUDIT (flag and record), REDACT (replace matches before storage), or BLOCK (refuse the
            call outright). This is a platform-wide policy evaluated on every call, not a setting a
            developer has to remember to enable per integration.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Budget enforcement pre-call, not post-hoc.</strong>{' '}
            Token spend is checked against a per-user monthly budget before a call is allowed to proceed.
            A hard-stop budget blocks the call itself and fires a <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">budget.exceeded</code>{' '}
            event to any registered subscriber — enforcement is a gate, not a bill you discover at the
            end of the month.
          </p>
        </Section>

        <Section title="What this means for your evaluation">
          <p>
            If you are evaluating AI governance as part of a platform decision, the sequencing argument
            translates into three concrete questions worth asking any vendor, including us:
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">1. Can an AI action execute without passing through the audit layer?</strong>{' '}
            If governance was added after the AI system existed, the answer is often &quot;not by design, but
            technically yes for anything not yet integrated.&quot; Ask for the exception list.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">2. Is PII policy enforced platform-wide, or per connector?</strong>{' '}
            A retrofitted control tower typically governs what it has been connected to. Ask what
            percentage of AI-touched data flows are currently outside that boundary.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">3. Is cost enforcement preventive or observational?</strong>{' '}
            A dashboard that reports spend after the fact is not the same control as a gate that blocks a
            call before it runs. Ask which one you are actually getting.
          </p>
          <p>
            We do not think architecture alone wins an enterprise deal — depth of ecosystem, analyst
            validation, and years of enterprise trust are real, earned advantages that a retrofitted
            control tower built by an incumbent still carries, and we say so plainly in our own
            competitive research. This paper argues one thing only: that the sequencing question is worth
            asking, and that it has a different answer depending on which platform you put it to.
          </p>
        </Section>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-950/60 p-6 mb-14">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Every number in the &quot;What &apos;native&apos; means concretely&quot; section above is computed live, not
            asserted in this document.
          </p>
          <Link to="/trust" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all">
            View the live capability scorecard <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Section title="Sources">
          <ul className="space-y-2 list-none pl-0">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline break-words">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 pt-2">
            ServiceNow facts current as of publication and independently verifiable at the links above.
            Kangqore&apos;s own claims in this document are scoped to platform architecture, verifiable at{' '}
            <Link to="/trust" className="text-brand-blue hover:underline">kangqore.com/trust</Link>, not
            business metrics.
          </p>
        </Section>
      </article>
    </div>
  );
};

export default GovernanceNativeWhitepaperPage;
