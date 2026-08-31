#!/usr/bin/env node
// ─── Bot Prerender Generator ───────────────────────────────────────────────────
// The site is a client-rendered SPA: the raw HTML payload is an empty
// <div id="root">. Googlebot renders JS eventually, but GPTBot, ClaudeBot,
// PerplexityBot and CCBot do not — so every service page was invisible to the
// crawlers that feed AI answer engines.
//
// This emits a static, fully-populated HTML snapshot per service page into
// frontend/public/prerender/services/<slug>.html. A backend middleware serves
// these to known bot user-agents; humans keep getting the React app.
//
// Snapshots are generated from servicesData.js — the same source the React app
// renders from — so the two cannot describe different things.
//
// Usage:  node scripts/generate-prerender.mjs [--check]
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const DATA_DIR = path.join(repoRoot, 'frontend', 'src', 'data');
const OUT_DIR = path.join(repoRoot, 'frontend', 'public', 'prerender', 'services');
const BASE_URL = 'https://kangqore.com';

// Kept in step with REVIEWER in frontend/src/seo/serviceSchema.js. Every field
// is already published on the site — the home page byline carries the name,
// title and both profiles, and /leadership carries the role.
const REVIEWER = {
  '@type': 'Person',
  '@id': `${BASE_URL}/#mahesh-kumar`,
  name: 'Mahesh Kumar',
  jobTitle: 'Founder & CEO',
  url: `${BASE_URL}/leadership`,
  image: `${BASE_URL}/images/leadership/ceo-mahesh-kumar.png`,
  worksFor: { '@id': `${BASE_URL}/#organization` },
  sameAs: ['https://in.linkedin.com/in/maheshkumario', 'https://x.com/maheshkumarx'],
};

/** Import a source file as ESM, optionally rewriting it first. */
async function importAsEsm(file, transform = (s) => s) {
  const src = transform(fs.readFileSync(file, 'utf8'));
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kq-prerender-')), 'mod.mjs');
  fs.writeFileSync(tmp, src);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
  }
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** JSON-LD must not contain a literal </script> sequence. */
const escJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function splitItem(item) {
  const i = item.indexOf(':');
  return i === -1
    ? { name: item, desc: '' }
    : { name: item.slice(0, i).trim(), desc: item.slice(i + 1).trim() };
}

function buildGraph({ svc, deptName, deptSlug, url, title, description }) {
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${url}#service` },
      inLanguage: 'en',
      // Mirrors seo/serviceSchema.js — the crawler that never runs our JS is
      // the one this signal exists for. Emitted only where the service carries
      // a hand-set `lastReviewed`, so no page claims a review that did not
      // happen. Every REVIEWER field is already published on the site.
      ...(svc.lastReviewed
        ? {
            dateModified: svc.lastReviewed,
            author: { '@id': `${BASE_URL}/#organization` },
            reviewedBy: REVIEWER,
          }
        : {}),
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: svc.name,
      serviceType: svc.name,
      description: svc.fullDescription || svc.shortDescription,
      url,
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: ['United Kingdom', 'United States', 'European Union', 'India'],
      audience: { '@type': 'Audience', audienceType: 'Enterprise' },
      ...(deptName ? { category: deptName } : {}),
      ...(svc.capabilityAreas?.length
        ? {
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `${svc.name} Capabilities`,
              itemListElement: svc.capabilityAreas.map((a) => ({
                '@type': 'OfferCatalog',
                name: a.title,
                description: a.desc,
                itemListElement: (a.items || []).map((it) => {
                  const { name, desc } = splitItem(it);
                  return { '@type': 'Offer', itemOffered: { '@type': 'Service', name, description: desc || name } };
                }),
              })),
            },
          }
        : {}),
    },
  ];

  const faqs = resolveServiceFaqs(svc);
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        // Flat text: answers may carry paragraph breaks for rendering, and
        // schema.org wants plain text in acceptedAnswer.
        acceptedAnswer: { '@type': 'Answer', text: faqPlainText(f.a) },
      })),
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      ...(deptName ? [{ '@type': 'ListItem', position: 3, name: deptName, item: `${BASE_URL}/departments/${deptSlug}` }] : []),
      { '@type': 'ListItem', position: deptName ? 4 : 3, name: svc.name, item: url },
    ],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

function buildHtml({ slug, svc, seo, deptName, deptSlug, servicesData }) {
  const url = `${BASE_URL}/services/${slug}`;
  const title = seo?.title || `${svc.name} | Kangqore`;
  const description = seo?.description || svc.shortDescription || svc.fullDescription || '';
  const heroH1 = (svc.heroTitle || svc.name).replace(/\n/g, ' ');
  const ogImage = `${BASE_URL}/og/default.png`;

  const capabilities = (svc.capabilityAreas || [])
    .map(
      (a) => `      <section>
        <h3>${esc(a.title)}</h3>
        ${a.desc ? `<p>${esc(a.desc)}</p>` : ''}
        <ul>
${(a.items || []).map((it) => { const { name, desc } = splitItem(it); return `          <li><strong>${esc(name)}</strong>${desc ? `: ${esc(desc)}` : ''}</li>`; }).join('\n')}
        </ul>
      </section>`,
    )
    .join('\n');

  const faqs = (svc.customFAQs || [])
    .map((f) => {
      // One <p> per paragraph, matching the React page. Emitting the raw
      // string put a literal newline inside a single <p>, which HTML
      // collapses — the snapshot showed a wall of text where the page shows
      // four paragraphs.
      const body = faqParagraphs(f.a).map((para) => `<p>${esc(para)}</p>`).join('');
      // Citations are the reason an answer engine trusts the claim above them,
      // so they have to exist for the crawler that never runs our JS — which is
      // the crawler that matters here. Real anchors, not text.
      const cites = Array.isArray(f.sources) && f.sources.length
        ? `<p>Sources: ${f.sources
            .map((s) => `<a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label)}</a>`)
            .join(' · ')}</p>`
        : '';
      return `      <section><h3>${esc(f.q)}</h3>${body}${cites}</section>`;
    })
    .join('\n');

  // ── Blocks the snapshot never carried ──────────────────────────────────────
  // Measured coverage before this: a crawler received 845 of 2,894 words on
  // /services/data-science-ai, so seven words in ten were invisible to the
  // audience the snapshot exists for. The missing blocks were not filler --
  // the comparison table, the industry grid, the outcome narratives, the
  // engagement packages and the closing argument are the most persuasive
  // content on these pages.
  //
  // Internal links inside them are emitted as real anchors, because a crawler
  // that cannot see a link cannot follow it.

  // `href` first: that is the key both renderers actually read
  // (GeminiComparisonSection uses `row.link.href`, AIToolsSection uses
  // `item.link.href`), and every contextual link in servicesData is written
  // that way. This helper only checked `to`, so none of them reached the
  // snapshot — the crawler received the comparison table and the toolchain
  // with their internal links silently stripped. `to` is kept for any future
  // caller written against the router prop name.
  const linkTo = (l) => {
    const href = l && (l.href || l.to);
    return href ? ` <a href="${BASE_URL}${esc(href)}">${esc(l.label || href)}</a>` : '';
  };

  // `hideComparison` suppresses this band on the page, so the snapshot has to
  // honor it too. Emitting it here regardless would describe a section the
  // visitor never sees — the same page-versus-snapshot mismatch that put stale
  // content in front of crawlers on two other services.
  const comparison = svc.comparisonTable && !svc.hideComparison
    ? `    <h2>${esc(svc.comparisonTable.heading || 'How this differs')}</h2>
    ${svc.comparisonTable.lede ? `<p>${esc(svc.comparisonTable.lede)}</p>` : ''}
      <table>
        <caption>${esc(svc.comparisonTable.beforeLabel || 'Before')} compared with ${esc(svc.comparisonTable.afterLabel || 'After')}</caption>
        <thead><tr><th scope="col">Dimension</th><th scope="col">${esc(svc.comparisonTable.beforeLabel || 'Before')}</th><th scope="col">${esc(svc.comparisonTable.afterLabel || 'After')}</th></tr></thead>
        <tbody>
${(svc.comparisonTable.rows || []).map((r) => `          <tr><th scope="row">${esc(r.dimension)}</th><td>${esc(r.before)}</td><td>${esc(r.after)}${linkTo(r.link)}</td></tr>`).join('\n')}
        </tbody>
      </table>`
    : '';

  const architecture = (svc.architectureNodes || []).length
    ? `    <h2>${esc([svc.architectureTitle, svc.architectureTitleHighlight].filter(Boolean).join(' ') || 'How it works')}</h2>
    ${svc.architectureLede ? `<p>${esc(svc.architectureLede)}</p>` : ''}
${svc.architectureNodes.map((n) => `      <section>
        <h3>${esc(n.title)}</h3>
        ${n.description ? `<p>${esc(n.description)}</p>` : ''}
        <ul>
${(n.features || []).map((f) => `          <li>${esc(f)}</li>`).join('\n')}
        </ul>
      </section>`).join('\n')}`
    : '';

  const industries = (svc.industryUseCases || []).length
    ? `    <h2>${esc([svc.industryHeading, svc.industryHeadingHighlight].filter(Boolean).join(' ') || 'By industry')}</h2>
    ${svc.industryLede ? `<p>${esc(svc.industryLede)}</p>` : ''}
${svc.industryUseCases.map((u) => `      <section>
        <h3>${esc(u.industry)}</h3>
        ${u.headline ? `<p>${esc(u.headline)}</p>` : ''}
        <ul>
${(u.items || u.agents || []).map((it) => `          <li>${esc(it)}</li>`).join('\n')}
        </ul>
      </section>`).join('\n')}`
    : '';

  // Narrative case studies. `metrics` above already emits the headline numbers.
  // `hideOutcomeCards` suppresses this band on the page, so the snapshot drops
  // it too — otherwise crawlers are served case studies no visitor can see.
  const outcomes = svc.hideOutcomeCards ? [] : [svc.outcomeCard, svc.outcomeCard2].filter(Boolean);
  const outcomeBlock = outcomes.length
    ? `    <h2>${esc([svc.outcomesHeading, svc.outcomesHeadingHighlight].filter(Boolean).join(' ') || 'Engagement outcomes')}</h2>
${outcomes.map((o) => `      <section>
        <h3>${esc(o.industry || 'Engagement')}${o.metric ? ` — ${esc(o.metric)} ${esc(o.metricLabel || '')}` : ''}</h3>
        ${o.problem ? `<p>${esc(o.problem)}</p>` : ''}
        ${o.outcome ? `<p>${esc(o.outcome)}</p>` : ''}
        ${o.illustrative ? '<p>Illustrative figures — modeled on typical engagement patterns, not a specific client result.</p>' : ''}
      </section>`).join('\n')}`
    : '';

  // `hideEngagement` suppresses this band on the page, so the snapshot drops it
  // too — a service can keep authored packages in the data with the section
  // off, and neither the visitor nor the crawler should then see them.
  const packages = (svc.hideEngagement ? [] : (svc.servicePackages || [])).length
    ? `    <h2>${esc([svc.engagementHeading, svc.engagementHeadingHighlight].filter(Boolean).join(' ') || 'How we engage')}</h2>
    ${svc.engagementLede ? `<p>${esc(svc.engagementLede)}</p>` : ''}
${svc.servicePackages.map((k) => `      <section>
        <h3>${esc(k.name)}${k.duration ? ` (${esc(k.duration)})` : ''}</h3>
        ${k.description ? `<p>${esc(k.description)}</p>` : ''}
        <ul>
${(k.deliverables || []).map((d) => `          <li>${esc(d)}</li>`).join('\n')}
        </ul>
      </section>`).join('\n')}`
    : '';

  // The carousel is a horizontal scroller, so a crawler that does not run the
  // rail still needs every card. Emitted flat.
  //
  // Carries its own indentation and trailing blank line, and is interpolated at
  // the start of a line below, so a service without a carousel emits nothing at
  // all. The first version wrapped it in newlines like the blocks around it,
  // which put two blank lines into the 61 snapshots that have no carousel and
  // failed check:prerender in CI on pure whitespace. Same trap the concierge
  // chips below already document.
  const carousel = (svc.solutionsCarousel?.items || []).length
    ? `    <h2>${esc([svc.solutionsCarousel.title, svc.solutionsCarousel.titleHighlight].filter(Boolean).join(' '))}</h2>\n`
      + (svc.solutionsCarousel.subtitle ? `    <p>${esc(svc.solutionsCarousel.subtitle)}</p>\n` : '')
      + svc.solutionsCarousel.items.map((s) => `      <section>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>${s.href ? `\n        <p><a href="${esc(s.href)}">${esc(s.linkLabel || 'Learn more')}</a></p>` : ''}
      </section>`).join('\n') + '\n\n'
    : '';

  const closing = svc.closingCta
    ? `    <h2>${esc([svc.closingCta.title, svc.closingCta.highlight].filter(Boolean).join(' '))}</h2>
    ${svc.closingCta.body ? `<p>${esc(svc.closingCta.body)}</p>` : ''}`
    : '';

  // The eQORE concierge occupies about a thousand pixels of the second-most-read
  // position on the page and reached the snapshot as nothing at all, so a crawler
  // that never runs our JS saw the page without it. Emitted only where a service
  // has written its own prompts: the template fallback is identical on every
  // page, and publishing the same four strings across 62 URLs would be worse
  // than leaving them out.
  //
  // The block carries its own indentation and trailing blank line so that a
  // service without prompts emits nothing at all: interpolating an empty string
  // into the body below left two blank lines in all 58 snapshots that have no
  // chips, which is 58 files of diff noise for no content.
  // The heading and intro carry the section's argument; emitting only the
  // prompts left the crawler with a list and no context.
  const chipsIntro = [
    svc.conciergeHeading ? `    <p>${esc(svc.conciergeHeading)}</p>\n` : '',
    svc.conciergeIntro ? `    <p>${esc(svc.conciergeIntro)}</p>\n` : '',
  ].join('');

  const chips = Array.isArray(svc.conciergeChips) && svc.conciergeChips.length
    ? `    <h2>Ask eQORE AI about ${esc(svc.name)}</h2>\n${chipsIntro}      <ul>\n${svc.conciergeChips
        .map((c) => `        <li>${esc(c)}</li>`)
        .join('\n')}\n      </ul>\n\n`
    : '';

  // The React page renders these two sections from `toolsStack` and
  // `dataBoundary`, but the snapshot did not carry either — so bots and AI
  // crawlers received the page without its method or its security posture,
  // the two highest-value blocks on it. Emitted here as real HTML.
  const blockList = (items, key, val) =>
    items.map((i) => `          <li><strong>${esc(i[key])}</strong>: ${esc(i[val])}</li>`).join('\n');

  const heading = (o) => esc([o.title, o.titleHighlight].filter(Boolean).join(' '));

  // The named tools themselves live in `managed` and `selfHosted`, and the
  // page renders them unhidden because they are the substance of the section.
  // blockList only carried title and desc, so the snapshot listed ten headings
  // and ten paragraphs while every product name on the page — the part a
  // retrieval engine matches a "does Kangqore use Playwright" question against
  // — was invisible to it.
  const toolRow = (i) => {
    // Mirrors the per-item label overrides the page renders, so the snapshot
    // does not describe a column as "Managed" where the page calls it
    // something else.
    const named = [i.managed && `${esc(i.managedLabel || 'Managed')}: ${esc(i.managed)}`,
                   i.selfHosted && `${esc(i.selfHostedLabel || 'Self-hosted')}: ${esc(i.selfHosted)}`]
      .filter(Boolean).join('. ');
    return `          <li><strong>${esc(i.title)}</strong>: ${esc(i.desc)}${named ? ` ${named}.` : ''}${linkTo(i.link)}</li>`;
  };

  // `hideToolsStack` suppresses this band on the page, so the snapshot has to
  // drop it too — otherwise crawlers are served a section no visitor can see.
  const method = svc.toolsStack && !svc.hideToolsStack
    ? `    <h2>${heading(svc.toolsStack)}</h2>
    ${svc.toolsStack.subtitle ? `<p>${esc(svc.toolsStack.subtitle)}</p>` : ''}
      <ul>
${(svc.toolsStack.items || []).map(toolRow).join('\n')}
      </ul>`
    : '';

  const boundary = svc.dataBoundary
    ? `    <h2>${heading(svc.dataBoundary)}</h2>
    ${svc.dataBoundary.lede ? `<p>${esc(svc.dataBoundary.lede)}</p>` : ''}
      <ul>
${blockList(svc.dataBoundary.blocks || [], 'label', 'body')}
      </ul>`
    : '';

  // `hideMetrics` suppresses the stats row on the page, so the snapshot drops
  // it too — otherwise crawlers receive figures no visitor can see.
  const metrics = (svc.hideMetrics ? [] : (svc.businessMetrics || []))
    .map((m) => `        <li><strong>${esc(m.value)}${esc(m.suffix || '')}</strong> ${esc(m.metricLabel || m.title)} — ${esc(m.desc)}</li>`)
    .join('\n');

  // ── Blocks added with the twenty-area rebuild ──────────────────────────────
  // Each renders a real section on the page, so each has to reach the crawler
  // that never runs our JS. The architecture stack in particular is drawn from
  // data precisely so its node names survive as text here rather than being
  // locked inside an SVG.

  const entArch = svc.enterpriseArchitecture
    ? `    <h2>${heading(svc.enterpriseArchitecture)}</h2>
    ${svc.enterpriseArchitecture.lede ? `<p>${esc(svc.enterpriseArchitecture.lede)}</p>` : ''}
${(svc.enterpriseArchitecture.layers || []).map((l) => `      <section>
        <h3>${esc(l.label)}</h3>
        ${l.role ? `<p>${esc(l.role)}</p>` : ''}
        <ul>
${(l.nodes || []).map((n) => `          <li>${esc(n)}</li>`).join('\n')}
        </ul>
      </section>`).join('\n')}
    ${svc.enterpriseArchitecture.principle ? `<p>${esc(svc.enterpriseArchitecture.principle)}</p>` : ''}`
    : '';

  // The journey section renders on every service page, but the snapshot never
  // carried it — so the delivery model, which is exactly what an answer engine
  // quotes for "how does an engagement run", was invisible on all 62.
  const journey = (svc.customJourney || []).length
    ? `    <h2>How a ${esc(svc.name)} engagement runs</h2>
      <ol>
${svc.customJourney.map((p) => `        <li><strong>${esc(p.phase)} — ${esc(p.title)}</strong>: ${esc(p.desc)}</li>`).join('\n')}
      </ol>`
    : '';

  const accel = svc.accelerators
    ? `    <h2>${heading(svc.accelerators)}</h2>
    ${svc.accelerators.lede ? `<p>${esc(svc.accelerators.lede)}</p>` : ''}
${(svc.accelerators.items || []).map((a) => `      <section>
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.desc)}</p>
        <ul>
${(a.functions || []).map((f) => `          <li>${esc(f)}</li>`).join('\n')}
        </ul>
      </section>`).join('\n')}
    ${svc.accelerators.footnote ? `<p>${esc(svc.accelerators.footnote)}</p>` : ''}`
    : '';

  // The disclaimer is emitted with the figures rather than after them: a
  // crawler may lift any single element out of this block, and every number
  // here is a worked example rather than a measurement.
  const cc = svc.commandCenter;
  const commandCenter = cc
    ? `    <h2>${heading(cc)}</h2>
    ${cc.lede ? `<p>${esc(cc.lede)}</p>` : ''}
    <p>Illustrative console — every figure below is a worked example of the shape this reporting takes, not a measured client result.</p>
    <p><strong>${esc(cc.headline.label)}: ${esc(cc.headline.value)} / ${esc(cc.headline.outOf)}</strong> — ${esc(cc.headline.note)}</p>
      <ul>
${(cc.domains || []).map((d) => `        <li>${esc(d.label)}: ${esc(d.value)} / 100</li>`).join('\n')}
${(cc.signals || []).map((s) => `        <li>${esc(s.label)}: ${esc(s.value)}</li>`).join('\n')}
      </ul>
    <h3>${esc(cc.risksLabel || 'Open risks')}</h3>
      <ul>
${(cc.risks || []).map((r) => `        <li>${esc(r.item)} — ${esc(r.level)}</li>`).join('\n')}
      </ul>`
    : '';

  const related = (svc.relatedServiceSlugs || [])
    .map((s) => `        <li><a href="${BASE_URL}/services/${s}">${esc(servicesData[s]?.name || s)}</a></li>`)
    .join('\n');

  // Sibling services in the same department: gives crawlers a real topical
  // cluster to traverse instead of a dead-end leaf page.
  const siblings = Object.keys(servicesData)
    .filter((s) => s !== slug && servicesData[s].departmentSlug === svc.departmentSlug)
    .slice(0, 12)
    .map((s) => `        <li><a href="${BASE_URL}/services/${s}">${esc(servicesData[s].name)}</a></li>`)
    .join('\n');

  const graph = buildGraph({ svc, deptName, deptSlug, url, title, description });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${seo?.keywords ? `<meta name="keywords" content="${esc(seo.keywords)}">` : ''}
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kangqore">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@kangqore">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${escJson(graph)}</script>
</head>
<body>
<main>
  <article>
    ${svc.heroBadge ? `<p>${esc(svc.heroBadge)}</p>` : ''}
    <h1>${esc(heroH1)}</h1>
    <p>${esc(svc.fullDescription || svc.shortDescription || '')}</p>
    ${svc.shortDescription && svc.fullDescription ? `<p>${esc(svc.shortDescription)}</p>` : ''}
    ${svc.whatIsPara2 ? `<p>${esc(svc.whatIsPara2)}</p>` : ''}
    ${svc.whatIsPara3 ? `<p>${esc(svc.whatIsPara3)}</p>` : ''}
    ${svc.whatIsPara4 ? `<p>${esc(svc.whatIsPara4)}</p>` : ''}
    ${svc.whatIsPara5 ? `<p>${esc(svc.whatIsPara5)}</p>` : ''}

    ${metrics ? `<h2>${esc([svc.outcomesHeading, svc.outcomesHeadingHighlight].filter(Boolean).join(' ') || 'Business Outcomes')}</h2>\n      <ul>\n${metrics}\n      </ul>` : ''}

    ${capabilities ? `<h2>${esc(svc.capabilitiesSectionTitle || 'Capabilities')} ${esc(svc.capabilitiesSectionHighlight || '')}</h2>\n${svc.capabilitiesLede ? `      <p>${esc(svc.capabilitiesLede)}</p>\n` : ''}${capabilities}` : ''}

${carousel}    ${entArch}

    ${svc.midCta ? `<p>${esc(svc.midCta)}</p>` : ''}

    ${comparison}

    ${architecture}

    ${industries}

    ${outcomeBlock}

    ${commandCenter}

    ${journey}

    ${packages}

    ${method}

    ${accel}

    ${boundary}

    ${faqs ? `<h2>Frequently Asked Questions</h2>\n${faqs}` : ''}

    ${related ? `<h2>Related Services</h2>\n      <ul>\n${related}\n      </ul>` : ''}
    ${siblings ? `<h2>More in ${esc(deptName || 'this practice')}</h2>\n      <ul>\n${siblings}\n      </ul>` : ''}

    ${closing}

${chips}    <h2>Next Step</h2>
    <p><a href="${BASE_URL}/contact">Talk to our experts about ${esc(svc.name)}</a></p>
  </article>
  <nav>
    <a href="${BASE_URL}/">Home</a>
    <a href="${BASE_URL}/services">All Services</a>
    ${deptSlug ? `<a href="${BASE_URL}/departments/${deptSlug}">${esc(deptName)}</a>` : ''}
    <a href="${BASE_URL}/contact">Contact</a>
  </nav>
</main>
</body>
</html>
`;
}

// ─── Run ───────────────────────────────────────────────────────────────────────

const { servicesData } = await importAsEsm(path.join(DATA_DIR, 'servicesData.js'));

// Same resolver the React page and the runtime schema builder use, so the
// snapshot cannot describe a different FAQ from the one a visitor sees.
const { resolveServiceFaqs, faqParagraphs, faqPlainText } = await importAsEsm(path.join(DATA_DIR, 'serviceFaqs.js'));

// seoData imports a JSON module, which plain ESM import cannot resolve here.
// Stub it out — only serviceSEO's flat title/description/keywords are needed.
let serviceSEO = {};
try {
  const mod = await importAsEsm(path.join(DATA_DIR, 'seoData.js'), (s) =>
    s.replace(/^import\s+legacyRedirectsGenerated\s+from\s+.*$/m, 'const legacyRedirectsGenerated = {};'),
  );
  serviceSEO = mod.serviceSEO || {};
} catch (err) {
  console.warn(`WARN: seoData.js not importable (${err.message}) — falling back to servicesData copy`);
}

// Department display names, read from departmentsData without importing it
// (that file pulls in lucide-react icons, which are not resolvable here).
const deptSrc = fs.readFileSync(path.join(DATA_DIR, 'departmentsData.js'), 'utf8');
const deptNames = {};
for (const m of deptSrc.matchAll(/slug:\s*'([a-z-]+)',[\s\S]{0,400}?shortName:\s*'([^']+)'/g)) {
  deptNames[m[1]] = m[2];
}

const slugs = Object.keys(servicesData);
const files = [];
for (const slug of slugs) {
  const svc = servicesData[slug];
  const deptSlug = svc.departmentSlug;
  files.push({
    file: path.join(OUT_DIR, `${slug}.html`),
    html: buildHtml({ slug, svc, seo: serviceSEO[slug], deptName: deptNames[deptSlug] || '', deptSlug, servicesData }),
  });
}

if (process.argv.includes('--check')) {
  const drifted = files.filter((f) => !fs.existsSync(f.file) || fs.readFileSync(f.file, 'utf8') !== f.html);
  if (drifted.length) {
    console.error(`DRIFT: ${drifted.length} prerender snapshot(s) stale. Run \`node scripts/generate-prerender.mjs\`.`);
    process.exit(1);
  }
  console.log(`no drift — ${files.length} prerender snapshots verified`);
} else {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const f of files) fs.writeFileSync(f.file, f.html);
  console.log(`wrote ${files.length} prerender snapshots to ${path.relative(repoRoot, OUT_DIR)}`);

  // Rich service index for llms.txt. Like the sitemap, the LLM index was driven
  // solely by a CMS table that is empty in practice, so its "## Pages" section
  // shipped blank — telling AI engines the site has no pages.
  const indexPath = path.join(repoRoot, 'shared', 'serviceIndex.json');
  const index = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    services: slugs.map((slug) => {
      const svc = servicesData[slug];
      return {
        slug,
        url: `/services/${slug}`,
        name: svc.name,
        department: deptNames[svc.departmentSlug] || svc.departmentSlug,
        description: (serviceSEO[slug]?.description || svc.shortDescription || '').trim(),
        capabilities: (svc.capabilityAreas || []).map((a) => a.title),
        // Deliberately `customFAQs` and not the resolver used for the page's
        // FAQPage markup. On-page markup should describe what a visitor sees,
        // so a generic FAQ still gets marked up. llms.txt is a curated index —
        // emitting the same six generic questions under 58 services would fill
        // it with duplicates and bury the services that have real answers.
        faqs: (svc.customFAQs || []).slice(0, 3).map((f) => ({ q: f.q, a: faqPlainText(f.a) })),
        method: (svc.hideToolsStack ? [] : (svc.toolsStack?.items || [])).map((i) => ({ rule: i.title, detail: i.desc })),
        dataHandling: (svc.dataBoundary?.blocks || []).map((b) => ({ topic: b.label, detail: b.body })),
      };
    }),
  };
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`wrote ${path.relative(repoRoot, indexPath)} (${index.services.length} services)`);
}
