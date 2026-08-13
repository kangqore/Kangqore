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

  // The React page renders these two sections from `toolsStack` and
  // `dataBoundary`, but the snapshot did not carry either — so bots and AI
  // crawlers received the page without its method or its security posture,
  // the two highest-value blocks on it. Emitted here as real HTML.
  const blockList = (items, key, val) =>
    items.map((i) => `          <li><strong>${esc(i[key])}</strong>: ${esc(i[val])}</li>`).join('\n');

  const heading = (o) => esc([o.title, o.titleHighlight].filter(Boolean).join(' '));

  const method = svc.toolsStack
    ? `    <h2>${heading(svc.toolsStack)}</h2>
    ${svc.toolsStack.subtitle ? `<p>${esc(svc.toolsStack.subtitle)}</p>` : ''}
      <ul>
${blockList(svc.toolsStack.items || [], 'title', 'desc')}
      </ul>`
    : '';

  const boundary = svc.dataBoundary
    ? `    <h2>${heading(svc.dataBoundary)}</h2>
    ${svc.dataBoundary.lede ? `<p>${esc(svc.dataBoundary.lede)}</p>` : ''}
      <ul>
${blockList(svc.dataBoundary.blocks || [], 'label', 'body')}
      </ul>`
    : '';

  const metrics = (svc.businessMetrics || [])
    .map((m) => `        <li><strong>${esc(m.value)}${esc(m.suffix || '')}</strong> ${esc(m.metricLabel || m.title)} — ${esc(m.desc)}</li>`)
    .join('\n');

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
    <h1>${esc(heroH1)}</h1>
    <p>${esc(svc.fullDescription || svc.shortDescription || '')}</p>
    ${svc.shortDescription && svc.fullDescription ? `<p>${esc(svc.shortDescription)}</p>` : ''}
    ${svc.whatIsPara2 ? `<p>${esc(svc.whatIsPara2)}</p>` : ''}
    ${svc.whatIsPara3 ? `<p>${esc(svc.whatIsPara3)}</p>` : ''}
    ${svc.whatIsPara4 ? `<p>${esc(svc.whatIsPara4)}</p>` : ''}
    ${svc.whatIsPara5 ? `<p>${esc(svc.whatIsPara5)}</p>` : ''}

    ${metrics ? `<h2>Business Outcomes</h2>\n      <ul>\n${metrics}\n      </ul>` : ''}

    ${capabilities ? `<h2>${esc(svc.capabilitiesSectionTitle || 'Capabilities')} ${esc(svc.capabilitiesSectionHighlight || '')}</h2>\n${capabilities}` : ''}

    ${method}

    ${boundary}

    ${faqs ? `<h2>Frequently Asked Questions</h2>\n${faqs}` : ''}

    ${related ? `<h2>Related Services</h2>\n      <ul>\n${related}\n      </ul>` : ''}
    ${siblings ? `<h2>More in ${esc(deptName || 'this practice')}</h2>\n      <ul>\n${siblings}\n      </ul>` : ''}

    <h2>Next Step</h2>
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
        method: (svc.toolsStack?.items || []).map((i) => ({ rule: i.title, detail: i.desc })),
        dataHandling: (svc.dataBoundary?.blocks || []).map((b) => ({ topic: b.label, detail: b.body })),
      };
    }),
  };
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`wrote ${path.relative(repoRoot, indexPath)} (${index.services.length} services)`);
}
