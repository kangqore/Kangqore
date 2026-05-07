/* Multi-source KB extractor.
 *
 * Reads several frontend content sources, sanitizes them at extract time
 * (strips currency claims, banned superlatives, forbidden client names, fake
 * stat-card numbers), and writes clean KB markdown files.
 *
 * Sources → outputs:
 *   contentData.js (blogs/whitepapers/events/brochures) → 08-insights-and-resources.md
 *   contentData.js (caseStudiesData)                    → 03-case-studies.md (replaces stub)
 *   FAQs.jsx                                            → 04-faqs.md (replaces stub)
 *   pages/industries/*.jsx                              → 09-industries.md
 *
 * Run:  npx tsx scripts/build-content-kb.ts
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(__dirname, '../..');
const KB = path.resolve(__dirname, '../knowledge-base');

const FRONTEND = path.join(ROOT, 'frontend/src');

// ---------- sanitization ----------

const FORBIDDEN_NAMES = [
  'Microsoft',
  'Bupa',
  'Bupa Hong Kong',
  'Storebrand',
  'Storebrand Bank',
  'Mead Johnson',
  'Mead Johnson Nutrition',
  'Blue Cross NC',
  'Blue Cross Blue Shield',
  'Everest Group',
  'Fortune 500 Bank',
  'Fortune 500',
];

const BANNED_PHRASES = [
  'cutting-edge',
  'cutting edge',
  'industry-leading',
  'industry leading',
  'world-class',
  'world class',
  'best-in-class',
  'best in class',
  'best in india',
  'best in asia',
  'next-generation',
  'next generation',
  'state-of-the-art',
  'state of the art',
  'revolutionary',
  'game-changing',
  'game changing',
];

// Strip a sentence/line if it contains currency claims, percentages, or fabricated numbers.
const NUMERIC_BAN = [
  /\$\s?\d/,
  /\bUSD\s?\d/i,
  /\bINR\s?\d/i,
  /₹\s?\d/,
  /\d+\s?(lakhs?|crores?)/i,
  /\b\d+\s?%/,
  /\b\d+x\b/i,
];

function stripBannedPhrases(text: string): string {
  let out = text;
  for (const phrase of BANNED_PHRASES) {
    const rx = new RegExp(phrase, 'gi');
    out = out.replace(rx, '');
  }
  // Collapse leftover artifacts ("with  AI" → "with AI", "  and " → " and ")
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([.,;])/g, '$1');
  return out.trim();
}

function sanitizeSentence(text: string): string | null {
  if (!text) return null;
  let cleaned = text;
  // Reject if it claims a number / currency / percentage that we can't verify
  for (const rx of NUMERIC_BAN) {
    if (rx.test(cleaned)) return null;
  }
  // Reject if it asserts a forbidden client/partner name
  for (const name of FORBIDDEN_NAMES) {
    const rx = new RegExp(`\\b${name.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (rx.test(cleaned)) return null;
  }
  cleaned = stripBannedPhrases(cleaned);
  if (cleaned.trim().length < 10) return null;
  return cleaned;
}

function sanitizeBlock(text: string): string {
  // Sentence-by-sentence sanitize; rejoin survivors.
  const sentences = text.split(/(?<=[.!?])\s+/);
  const kept: string[] = [];
  for (const s of sentences) {
    const ok = sanitizeSentence(s);
    if (ok) kept.push(ok);
  }
  return kept.join(' ');
}

// ---------- safe loader for ESM data files ----------

function loadDataModule<T = any>(absPath: string, exportName: string): T {
  const raw = fs.readFileSync(absPath, 'utf-8');
  const transformed = raw
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?$/gm, '')
    .replace(/icon:\s*\w+\s*,/g, '')
    .replace(/^export\s+const\s+/gm, 'const ')
    .replace(/^export\s+default\s+/gm, 'const __default__ = ');
  const code = `${transformed}\nmodule.exports = (typeof ${exportName} !== 'undefined') ? { ${exportName} } : {};`;
  const sandbox: any = { module: { exports: {} }, exports: {}, require: () => ({}) };
  vm.runInNewContext(code, sandbox);
  return sandbox.module.exports[exportName];
}

// ---------- frontmatter ----------

function frontmatter(meta: Record<string, any>): string {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (Array.isArray(v)) lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(', ')}]`);
    else if (typeof v === 'string') lines.push(`${k}: ${v}`);
    else if (typeof v === 'boolean') lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

// ---------- FAQs.jsx ----------

interface Faq {
  question: string;
  answer: string;
}

function extractFaqs(): Faq[] {
  const raw = fs.readFileSync(path.join(FRONTEND, 'components/FAQs.jsx'), 'utf-8');
  const arrayMatch = raw.match(/const\s+faqs\s*=\s*\[([\s\S]*?)\];/);
  if (!arrayMatch) return [];
  const body = arrayMatch[1];
  const items: Faq[] = [];

  // Match each `{ question: "...", answer: ... }` object loosely.
  const objectRx = /\{\s*question:\s*"([^"]+)",\s*answer:\s*([\s\S]*?)\s*\},?\s*(?=\{|$)/g;
  let m: RegExpExecArray | null;
  while ((m = objectRx.exec(body))) {
    const question = m[1].trim();
    let answerRaw = m[2].trim();
    // answer may be: "..." or <>...</>
    if (answerRaw.startsWith('"')) {
      answerRaw = answerRaw.replace(/^"|"$/g, '');
    } else {
      // JSX fragment — strip tags + empty fragments + JSX expressions, decode &amp;
      answerRaw = answerRaw
        .replace(/<\/?>/g, '')
        .replace(/<\/?[A-Za-z][^>]*>/g, '')
        .replace(/\{[^{}]*\}/g, '')
        .replace(/&amp;/g, '&')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }
    items.push({ question, answer: answerRaw });
  }
  return items;
}

function buildFaqsMd(): string {
  const faqs = extractFaqs();
  const fm = frontmatter({
    id: '04-faqs',
    title: 'Frequently Asked Questions',
    tags: ['faqs', 'general'],
    populated: true,
    source: 'frontend/src/components/FAQs.jsx',
  });
  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated from FAQs.jsx via scripts/build-content-kb.ts. Sanitized to remove banned phrases. -->',
    '',
    `Common questions visitors ask about Kangqore, with concise answers.`,
    '',
  ];
  for (const f of faqs) {
    const sanitized = stripBannedPhrases(f.answer);
    if (!sanitized) continue;
    out.push(`# ${f.question}`);
    out.push('');
    out.push(sanitized);
    out.push('');
  }
  return out.join('\n').trim() + '\n';
}

// ---------- contentData.js: case studies ----------

interface CaseStudy {
  id: string;
  title: string;
  industry?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  duration?: string;
  technologies?: string[];
  client?: string;
  outcome?: string;
  result?: string;
}

function buildCaseStudiesMd(): string {
  const data = loadDataModule<CaseStudy[]>(
    path.join(FRONTEND, 'data/contentData.js'),
    'caseStudiesData'
  );
  const fm = frontmatter({
    id: '03-case-studies',
    title: 'Case Studies (Representative)',
    tags: ['case-studies'],
    populated: true,
    source: 'frontend/src/data/contentData.js',
    note: 'Anonymized representative engagements. Specific client names and unverified percentages are deliberately excluded.',
  });
  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated. Specific dollar amounts, percentages, and client names are filtered at extract time. -->',
    '',
    'These are representative examples of engagement types Kangqore has worked on. Client names are anonymized; specific outcome metrics are redacted until verified by Marketing/Legal. For a detailed walk-through of a relevant engagement, a Kangqore consultant can share more in a discovery conversation.',
    '',
  ];
  if (!Array.isArray(data) || data.length === 0) return out.join('\n');

  for (const cs of data) {
    if (!cs?.title) continue;
    const desc = sanitizeBlock(cs.description || '');
    const challenge = sanitizeBlock(cs.challenge || '');
    const solution = sanitizeBlock(cs.solution || '');
    if (!desc && !challenge && !solution) continue;
    out.push(`# ${stripBannedPhrases(cs.title)}`);
    out.push('');
    if (cs.industry) {
      out.push(`**Industry:** ${cs.industry}`);
    }
    if (cs.duration) {
      out.push(`**Engagement length:** ${cs.duration}`);
    }
    if (Array.isArray(cs.technologies) && cs.technologies.length > 0) {
      out.push(`**Technologies:** ${cs.technologies.join(', ')}`);
    }
    out.push('');
    if (desc) out.push(`**Overview.** ${desc}`);
    if (challenge) out.push(`**Challenge.** ${challenge}`);
    if (solution) out.push(`**Approach.** ${solution}`);
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- contentData.js: insights, white papers, events, brochures ----------

function buildInsightsMd(): string {
  const blogs = loadDataModule<any[]>(path.join(FRONTEND, 'data/contentData.js'), 'blogsData') || [];
  const wps = loadDataModule<any[]>(path.join(FRONTEND, 'data/contentData.js'), 'whitePapersData') || [];
  const events = loadDataModule<any[]>(path.join(FRONTEND, 'data/contentData.js'), 'eventsData') || [];
  const brochures = loadDataModule<any[]>(path.join(FRONTEND, 'data/contentData.js'), 'brochuresData') || [];

  const fm = frontmatter({
    id: '08-insights-and-resources',
    title: 'Insights, White Papers, Events & Brochures',
    tags: ['insights', 'whitepapers', 'events', 'brochures', 'resources'],
    populated: true,
    source: 'frontend/src/data/contentData.js',
  });
  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated. Titles + summaries; full article bodies are not yet ingested. -->',
    '',
    'Resources Kangqore publishes for visitors. Use these to point visitors to relevant published material; full articles live on the website (link to /blogs, /white-papers, /events, /brochures).',
    '',
  ];

  if (blogs.length > 0) {
    out.push('# Insights & Articles');
    out.push('');
    for (const b of blogs) {
      const excerpt = sanitizeBlock(b.excerpt || '');
      if (!b.title || !excerpt) continue;
      out.push(`## ${stripBannedPhrases(b.title)}`);
      if (b.category) out.push(`*Category: ${b.category}*  `);
      out.push(excerpt);
      if (Array.isArray(b.tags) && b.tags.length) out.push(`Tags: ${b.tags.join(', ')}`);
      out.push('');
    }
  }

  if (wps.length > 0) {
    out.push('# White Papers');
    out.push('');
    for (const w of wps) {
      const desc = sanitizeBlock(w.description || '');
      if (!w.title || !desc) continue;
      out.push(`## ${stripBannedPhrases(w.title)}`);
      out.push(desc);
      if (Array.isArray(w.topics) && w.topics.length) out.push(`Topics: ${w.topics.join(', ')}`);
      out.push('');
    }
  }

  if (events.length > 0) {
    out.push('# Events');
    out.push('');
    for (const e of events) {
      const desc = sanitizeBlock(e.description || e.excerpt || '');
      if (!e.title) continue;
      out.push(`## ${stripBannedPhrases(e.title)}`);
      if (e.date) out.push(`*Date: ${e.date}*  `);
      if (e.location) out.push(`*Location: ${e.location}*  `);
      if (desc) out.push(desc);
      out.push('');
    }
  }

  if (brochures.length > 0) {
    out.push('# Brochures');
    out.push('');
    for (const b of brochures) {
      const desc = sanitizeBlock(b.description || '');
      if (!b.title) continue;
      out.push(`## ${stripBannedPhrases(b.title)}`);
      if (desc) out.push(desc);
      out.push('');
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- industry pages (12 JSX files) ----------

interface IndustryPage {
  name: string;
  description: string;
  services: { title: string; description: string }[];
}

function extractIndustry(filePath: string): IndustryPage | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.jsx');
  // Try to grab PageHero description prop:
  const descMatch = raw.match(/description=\{?["']([^"'`]{20,300})["']\}?/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Grab `services` array of {icon, title, description} objects.
  const servicesArr = raw.match(/const\s+services\s*=\s*\[([\s\S]*?)\];/);
  const services: { title: string; description: string }[] = [];
  if (servicesArr) {
    const itemRx = /\{\s*[^}]*title:\s*['"]([^'"]+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = itemRx.exec(servicesArr[1]))) {
      services.push({ title: m[1].trim(), description: m[2].trim() });
    }
  }

  // Grab the human-readable industry name from the badge or title.
  const badgeMatch = raw.match(/badge=["']([^"']+)["']/);
  const titleMatch = raw.match(/title=["']([^"']+)["']/);
  const titleHL = raw.match(/titleHighlight=["']([^"']+)["']/);
  let name = '';
  if (titleMatch && titleHL) name = `${titleMatch[1].trim()} ${titleHL[1].trim()}`.trim();
  else if (badgeMatch) name = badgeMatch[1].trim();
  else name = fileName.replace(/([A-Z])/g, ' $1').trim();

  if (!description && services.length === 0) return null;
  return { name, description, services };
}

function buildIndustriesMd(): string {
  const dir = path.join(FRONTEND, 'pages/industries');
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.jsx'))
    .sort();
  const pages: IndustryPage[] = [];
  for (const f of files) {
    const p = extractIndustry(path.join(dir, f));
    if (p) pages.push(p);
  }
  const fm = frontmatter({
    id: '09-industries',
    title: 'Industries Kangqore Serves',
    tags: ['industries', 'verticals'],
    populated: true,
    source: 'frontend/src/pages/industries/*',
  });
  const out: string[] = [
    fm,
    '',
    `<!-- Auto-generated from ${files.length} industry pages. Stat cards (e.g. "100+ clients", "$2B+ transactions") are deliberately not ingested — those are unverified marketing numbers. -->`,
    '',
    `Kangqore works across ${pages.length} industries. For each, the description below summarizes our positioning and the most common solution areas we deliver.`,
    '',
  ];
  for (const p of pages) {
    out.push(`# ${stripBannedPhrases(p.name)}`);
    out.push('');
    if (p.description) {
      const cleanedDesc = stripBannedPhrases(p.description);
      if (cleanedDesc) out.push(cleanedDesc);
      out.push('');
    }
    if (p.services.length > 0) {
      out.push('Common solution areas in this industry:');
      for (const s of p.services) {
        const desc = stripBannedPhrases(s.description);
        if (desc) out.push(`- **${s.title}** — ${desc}`);
      }
      out.push('');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- deep service pages (77 files under pages/services/<dept>/<service>.jsx) ----------

interface DeepServiceFields {
  name: string;
  description: string;
  fullDescription: string;
  keyFeatures: string[];
  narrative: { description: string; bottleneck: string; requirement: string };
  philosophy: { description: string; pills: string[] };
  matrixSubtext: string;
  matrixLayers: { title: string; desc: string }[];
}

function extractFieldString(block: string, key: string): string {
  // matches: key: 'value' OR key: "value" OR key: `value`
  const rx = new RegExp(
    `\\b${key}\\s*:\\s*(?:'((?:\\\\.|[^'\\\\])*)'|"((?:\\\\.|[^"\\\\])*)"|\`((?:\\\\.|[^\`\\\\])*)\`)`,
    'm'
  );
  const m = block.match(rx);
  return (m?.[1] || m?.[2] || m?.[3] || '').replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
}

function extractStringArray(block: string, key: string): string[] {
  const rx = new RegExp(`\\b${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'm');
  const m = block.match(rx);
  if (!m) return [];
  const inner = m[1];
  const items: string[] = [];
  const itemRx = /(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`)/g;
  let it: RegExpExecArray | null;
  while ((it = itemRx.exec(inner))) {
    items.push((it[1] || it[2] || it[3] || '').trim());
  }
  return items;
}

function extractObjectBlock(block: string, key: string): string | null {
  // greedy match for nested object — find balanced braces after `key:`
  const idx = block.search(new RegExp(`\\b${key}\\s*:\\s*\\{`));
  if (idx < 0) return null;
  const start = block.indexOf('{', idx);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) return block.slice(start + 1, i);
    }
  }
  return null;
}

function extractArrayOfObjects(block: string, key: string): string[] {
  const idx = block.search(new RegExp(`\\b${key}\\s*:\\s*\\[`));
  if (idx < 0) return [];
  const start = block.indexOf('[', idx);
  if (start < 0) return [];
  let depth = 0;
  let end = -1;
  for (let i = start; i < block.length; i++) {
    if (block[i] === '[') depth++;
    else if (block[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end < 0) return [];
  const inner = block.slice(start + 1, end);
  // split into top-level objects
  const objs: string[] = [];
  let dep = 0;
  let cur = '';
  for (const ch of inner) {
    if (ch === '{') {
      if (dep === 0) cur = '';
      dep++;
    }
    if (dep > 0) cur += ch;
    if (ch === '}') {
      dep--;
      if (dep === 0) {
        objs.push(cur);
        cur = '';
      }
    }
  }
  return objs;
}

function extractDeepService(filePath: string): DeepServiceFields | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const svcMatch = raw.match(/const\s+service\s*=\s*\{([\s\S]*?)\n\s*\};/);
  if (!svcMatch) return null;
  const block = svcMatch[1];

  const name =
    extractFieldString(block, 'name') ||
    path.basename(filePath, '.jsx');

  const description = extractFieldString(block, 'description');
  const fullDescription = extractFieldString(block, 'fullDescription');
  const keyFeatures = extractStringArray(block, 'keyFeatures');

  const hf = extractObjectBlock(block, 'highFidelity') || '';
  const narrativeBlock = extractObjectBlock(hf, 'narrative') || '';
  const narrative = {
    description: extractFieldString(narrativeBlock, 'description'),
    bottleneck: extractFieldString(narrativeBlock, 'bottleneckText'),
    requirement: extractFieldString(narrativeBlock, 'requirementText'),
  };
  const philosophyBlock = extractObjectBlock(hf, 'philosophy') || '';
  const philosophy = {
    description: extractFieldString(philosophyBlock, 'description'),
    pills: extractStringArray(philosophyBlock, 'pills'),
  };
  const matrixBlock = extractObjectBlock(hf, 'matrix') || '';
  const matrixSubtext = extractFieldString(matrixBlock, 'subtext');
  const layerObjs = extractArrayOfObjects(matrixBlock, 'layers');
  const matrixLayers = layerObjs
    .map((o) => ({
      title: extractFieldString(o, 'title'),
      desc: extractFieldString(o, 'desc'),
    }))
    .filter((l) => l.title && l.desc);

  return {
    name: name.replace(/\.$/, '').trim(),
    description,
    fullDescription,
    keyFeatures,
    narrative,
    philosophy,
    matrixSubtext,
    matrixLayers,
  };
}

function buildServiceDetailsMd(): { md: string; pageCount: number } {
  const root = path.join(FRONTEND, 'pages/services');
  const depts = fs
    .readdirSync(root)
    .filter((d) => fs.statSync(path.join(root, d)).isDirectory())
    .sort();

  const fm = frontmatter({
    id: '10-service-details',
    title: 'Service Detail Pages',
    tags: ['services', 'details', 'deep'],
    populated: true,
    source: 'frontend/src/pages/services/*/*.jsx',
  });

  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated from 77 deep service pages. Sanitized: stat cards (e.g. "70% reduction"), banned superlatives, and forbidden client names are filtered at extract time. -->',
    '',
    'Detailed descriptions for individual services. Use the high-level catalog (02-services-catalog) for the short answer; use this when a visitor asks for a deeper walk-through of a specific service.',
    '',
  ];

  let pageCount = 0;
  const deptHumanName = (slug: string) =>
    slug
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(' ');

  for (const dept of depts) {
    const deptDir = path.join(root, dept);
    const files = fs
      .readdirSync(deptDir)
      .filter((f) => f.endsWith('.jsx'))
      .sort();
    if (files.length === 0) continue;
    const heading = deptHumanName(dept);
    const sectionParts: string[] = [`# ${heading}`, ''];

    for (const file of files) {
      const svc = extractDeepService(path.join(deptDir, file));
      if (!svc) continue;
      // Build sanitized content per service
      const longestDesc = sanitizeBlock(svc.description || svc.fullDescription || '');
      const narrDesc = sanitizeBlock(svc.narrative.description || '');
      const philDesc = sanitizeBlock(svc.philosophy.description || '');
      const bottleneck = sanitizeBlock(svc.narrative.bottleneck || '');
      const requirement = sanitizeBlock(svc.narrative.requirement || '');
      const matrixSubtext = sanitizeBlock(svc.matrixSubtext || '');

      const features = svc.keyFeatures
        .map((f) => sanitizeSentence(f))
        .filter((f): f is string => Boolean(f));
      const pills = svc.philosophy.pills
        .map((p) => sanitizeSentence(p))
        .filter((p): p is string => Boolean(p));
      const layers = svc.matrixLayers
        .map((l) => ({ title: stripBannedPhrases(l.title), desc: sanitizeBlock(l.desc) }))
        .filter((l) => l.title && l.desc);

      // If nothing survived sanitization, skip this service entirely.
      if (
        !longestDesc &&
        !narrDesc &&
        !philDesc &&
        features.length === 0 &&
        layers.length === 0
      ) {
        continue;
      }

      sectionParts.push(`## ${stripBannedPhrases(svc.name)}`);
      sectionParts.push('');
      if (longestDesc) {
        sectionParts.push(longestDesc);
        sectionParts.push('');
      }
      if (narrDesc) {
        sectionParts.push(`**Why this matters.** ${narrDesc}`);
        sectionParts.push('');
      }
      if (bottleneck && requirement) {
        sectionParts.push(`**The challenge.** ${bottleneck}`);
        sectionParts.push(`**Our approach.** ${requirement}`);
        sectionParts.push('');
      }
      if (philDesc) {
        sectionParts.push(`**Philosophy.** ${philDesc}`);
        sectionParts.push('');
      }
      if (features.length > 0) {
        sectionParts.push('Key features:');
        for (const f of features) sectionParts.push(`- ${f}`);
        sectionParts.push('');
      }
      if (pills.length > 0) {
        sectionParts.push(`Capabilities: ${pills.join(', ')}.`);
        sectionParts.push('');
      }
      if (layers.length > 0) {
        if (matrixSubtext) {
          sectionParts.push(matrixSubtext);
          sectionParts.push('');
        }
        sectionParts.push('Process steps:');
        for (const l of layers) sectionParts.push(`- **${l.title}** — ${l.desc}`);
        sectionParts.push('');
      }
      pageCount++;
    }

    if (sectionParts.length > 2) {
      out.push(...sectionParts);
    }
  }

  return { md: out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n', pageCount };
}

// ---------- top-level pages (AboutUs, Eqore, Leadership, BrandIdentity, CareersPage, CommunitiesPage) ----------

const TOP_LEVEL_PAGES = [
  { file: 'AboutUs.jsx', label: 'About Kangqore' },
  { file: 'Eqore.jsx', label: 'Meet eQORE — the AI Assistant' },
  { file: 'Leadership.jsx', label: 'Leadership' },
  { file: 'BrandIdentity.jsx', label: 'Brand Identity' },
  { file: 'CareersPage.jsx', label: 'Careers' },
  { file: 'CommunitiesPage.jsx', label: 'Communities' },
  { file: 'ContactUs.jsx', label: 'Contact Us' },
];

interface PageBlock {
  kind: 'h2' | 'h3' | 'p' | 'li';
  text: string;
  position: number;
}

function cleanJsxText(s: string): string {
  return s
    .replace(/<\/?[A-Za-z][^>]*>/g, '')
    .replace(/<\/?>/g, '')
    .replace(/\{[^{}]*\}/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&[#a-z0-9]+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPageBlocks(raw: string): PageBlock[] {
  const blocks: PageBlock[] = [];
  const tagRx = /<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRx.exec(raw))) {
    const kind = m[1] as PageBlock['kind'];
    const text = cleanJsxText(m[2]);
    if (!text) continue;
    if (kind === 'p' && text.length < 25) continue;
    if ((kind === 'h2' || kind === 'h3') && text.length < 3) continue;
    if (kind === 'li' && text.length < 8) continue;
    blocks.push({ kind, text, position: m.index });
  }
  blocks.sort((a, b) => a.position - b.position);
  return blocks;
}

function extractPageHero(raw: string): { description: string; titleParts: string[] } {
  const description = (raw.match(/description=\{?["']([^"'`]{20,400})["']\}?/) || [])[1] || '';
  const title = (raw.match(/title=\{?["']([^"']+)["']\}?/) || [])[1] || '';
  const titleHL = (raw.match(/titleHighlight=\{?["']([^"']+)["']\}?/) || [])[1] || '';
  const titleParts = [title, titleHL].filter(Boolean);
  return { description, titleParts };
}

function buildCompanyPagesMd(): { md: string; pageCount: number } {
  const fm = frontmatter({
    id: '11-company-pages',
    title: 'Company Pages',
    tags: ['company', 'about', 'leadership', 'careers', 'eqore'],
    populated: true,
    source: 'frontend/src/pages/*.jsx',
  });

  const out: string[] = [
    fm,
    '',
    '<!-- Auto-generated. Hero stat cards (unverified numbers like "50+ Projects Delivered") are deliberately skipped. -->',
    '',
    `Content from Kangqore's company-info pages: about, eQORE, leadership, brand identity, careers, communities, contact.`,
    '',
  ];

  let pageCount = 0;
  for (const p of TOP_LEVEL_PAGES) {
    const fp = path.join(FRONTEND, 'pages', p.file);
    if (!fs.existsSync(fp)) continue;
    const raw = fs.readFileSync(fp, 'utf-8');
    const hero = extractPageHero(raw);
    const heroDesc = sanitizeBlock(hero.description);
    const blocks = extractPageBlocks(raw);

    if (!heroDesc && blocks.length === 0) continue;

    out.push(`# ${p.label}`);
    out.push('');
    if (hero.titleParts.length > 0) {
      out.push(`*Page heading: ${hero.titleParts.join(' ')}*`);
      out.push('');
    }
    if (heroDesc) {
      out.push(heroDesc);
      out.push('');
    }

    // Render blocks preserving structure. H2/H3 become sub-headings inside the page section,
    // P becomes paragraphs, LI becomes bulleted list items (grouped consecutively).
    let pendingList: string[] = [];
    const flushList = () => {
      if (pendingList.length === 0) return;
      for (const item of pendingList) out.push(`- ${item}`);
      out.push('');
      pendingList = [];
    };
    for (const b of blocks) {
      const cleaned = sanitizeBlock(b.text);
      if (!cleaned) continue;
      if (b.kind !== 'li') flushList();
      if (b.kind === 'h2') {
        out.push(`## ${cleaned}`);
        out.push('');
      } else if (b.kind === 'h3') {
        out.push(`### ${cleaned}`);
        out.push('');
      } else if (b.kind === 'p') {
        out.push(cleaned);
        out.push('');
      } else if (b.kind === 'li') {
        pendingList.push(cleaned);
      }
    }
    flushList();
    pageCount++;
  }

  return { md: out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n', pageCount };
}

// ---------- main ----------

function main(): void {
  const serviceDetails = buildServiceDetailsMd();
  const companyPages = buildCompanyPagesMd();
  const writes: { file: string; content: string; label: string }[] = [
    { file: '04-faqs.md', content: buildFaqsMd(), label: 'FAQs' },
    { file: '03-case-studies.md', content: buildCaseStudiesMd(), label: 'Case studies' },
    { file: '08-insights-and-resources.md', content: buildInsightsMd(), label: 'Insights/whitepapers/events/brochures' },
    { file: '09-industries.md', content: buildIndustriesMd(), label: 'Industries' },
    { file: '10-service-details.md', content: serviceDetails.md, label: `Service details (${serviceDetails.pageCount} services)` },
    { file: '11-company-pages.md', content: companyPages.md, label: `Company pages (${companyPages.pageCount} pages)` },
  ];
  for (const w of writes) {
    fs.writeFileSync(path.join(KB, w.file), w.content, 'utf-8');
    const lines = w.content.split('\n').length;
    console.log(`Wrote ${w.file} — ${w.label} (${lines} lines)`);
  }
}

main();
