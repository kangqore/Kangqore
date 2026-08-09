// ─── Service FAQ resolution ───────────────────────────────────────────────────
// One source for the FAQ list, shared by the three things that need it:
//
//   1. UniversalServicePage      — renders the accordion
//   2. seo/serviceSchema.js      — builds the runtime JSON-LD graph
//   3. scripts/generate-prerender.mjs — builds the bot snapshot
//
// All three previously did their own thing. The page fell back to a generic
// six-question list when a service defined no `customFAQs`; both schema builders
// gated FAQPage on `svc.customFAQs` directly. Since only 4 of 62 services define
// it, 58 pages rendered a visible FAQ that carried no markup at all — the
// highest-value structured data on a service page, emitted on 6% of them.
//
// Google requires FAQ markup to match content visible on the page, so the fix
// has to be a shared resolver rather than schema-side invention: whatever the
// accordion shows is exactly what gets marked up.
//
// Plain .js, not .jsx, because the prerender generator imports it from Node.
// ────────────────────────────────────────────────────────────────────────────────

/**
 * "a" or "an" for a service name. 17 of the 62 names begin with a vowel sound
 * ("Agentic AI Services", "AI Governance", "Analytics"), and the acronyms are
 * the awkward part: "an MLOps engagement" and "an RPA bot" are correct because
 * the letter is read aloud, so the rule follows pronunciation, not spelling.
 */
export function article(name = '') {
  const first = String(name).trim().charAt(0).toUpperCase();
  const second = String(name).trim().charAt(1) || '';
  // A leading capital followed by another capital is read letter-by-letter
  // (MLOps -> "em-el-ops", RPA -> "ar-pee-ay"), so the vowel test applies to
  // the letter's spoken name rather than the letter itself.
  const spokenVowel = 'AEFHILMNORSX';
  const isAcronym = /[A-Z]/.test(second);
  if (isAcronym) return spokenVowel.includes(first) ? 'an' : 'a';
  return 'AEIOU'.includes(first) ? 'an' : 'a';
}

/**
 * Service names are mixed-case deliberately — MLOps, RPA, DevOps, AWS, IT/OT,
 * GenAI. A blanket `.toLowerCase()` put "Comprehensive mlops assessment" on the
 * live page. Fold only words that are plain Capitalised or already lowercase;
 * anything carrying internal or repeated capitals is an acronym or a camel-cased
 * product name and is left as written.
 *
 *   'MLOps'                            -> 'MLOps'
 *   'Big Data'                         -> 'big data'
 *   'AI & Cognitive Computing'         -> 'AI & cognitive computing'
 *   'Robotic Process Automation (RPA)' -> 'robotic process automation (RPA)'
 */
export function lowerServiceName(name = '') {
  return String(name)
    .split(' ')
    .map((w) => (/^[A-Z]?[a-z]+$/.test(w) ? w.toLowerCase() : w))
    .join(' ');
}

/**
 * The generic list. Used when a service has not been given its own FAQs.
 *
 * These questions are vendor-shaped ("what makes your approach unique") rather
 * than query-shaped ("what is X", "X vs Y"), which is why they are a fallback
 * and not a destination: they keep a page from having an empty FAQ, but a
 * service that wants to be cited by an answer engine needs `customFAQs` written
 * against the questions buyers actually type.
 */
export function genericServiceFaqs(service) {
  const name = service?.name || 'Enterprise Service';
  const an = article(name);
  return [
    {
      q: `What makes Kangqore's approach to ${name} unique?`,
      a: `Kangqore combines deep domain engineering with automated governance, robust architecture standards, and measurable business KPIs. We don't just deliver tools — we engineer end-to-end capabilities that compound value over time.`,
    },
    {
      q: `How quickly can we see initial results from ${an} ${name} engagement?`,
      a: `Our Strategy & Audit completes in 2–3 weeks, delivering a clear architecture and execution roadmap. A Pilot Pod delivers a production-grade capability in 8 weeks, giving you immediate operational ROI.`,
    },
    {
      q: 'How do you handle integration with our existing systems?',
      a: 'We design reusable API layers, containerized microservices, and standardized connectors. Whether you run legacy mainframes, cloud-native meshes, or hybrid SaaS platforms, our architectures integrate seamlessly without interrupting live operations.',
    },
    {
      q: 'What governance and compliance standards are enforced?',
      a: 'Governance is built into every layer. Depending on your industry, we align controls with ISO 27001, SOC 2, GDPR, HIPAA, SOX, and NIST frameworks — producing immutable audit logs and real-time compliance dashboards.',
    },
    {
      q: 'Can you customize the solution for our specific industry requirements?',
      a: 'Yes. Every engagement leverages our industry-specific blueprints across Banking, Healthcare, Manufacturing, Retail, Technology, and Public Sector — ensuring domain compliance and business alignment from day one.',
    },
    {
      q: 'What ongoing operational support does Kangqore provide?',
      a: 'We offer Managed Operations and Continuous Scale packages — providing 24/7 monitoring, automated alerting, performance tuning, and periodic capability upgrades so your systems evolve with your business.',
    },
  ];
}

/** The FAQ list a service page actually shows — and therefore what gets marked up. */
export function resolveServiceFaqs(service) {
  return service?.customFAQs?.length ? service.customFAQs : genericServiceFaqs(service);
}

// An answer may carry paragraph breaks as a blank line. `a` stays a plain
// string so the schema builders, the prerender generator and llms.txt keep
// consuming it unchanged; only the two renderers split it.
//
// A 145-word answer set as one block is accurate and unreadable — the MLOps
// answers below run to five distinct points each, and a wall of text buries the
// fourth and fifth. Breaking on the argument boundaries costs nothing and loses
// nothing, since the sentences are unchanged.

/** Paragraphs of an answer, for rendering. */
export function faqParagraphs(answer = '') {
  return String(answer).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

/**
 * The answer as one flat string, for `acceptedAnswer.text`. Schema.org wants
 * plain text there, and a quotable block should not carry layout characters an
 * answer engine would have to strip.
 */
export function faqPlainText(answer = '') {
  return faqParagraphs(answer).join(' ');
}

/** The five engagement tiers, when a service has not defined its own. */
export function genericServicePackages(service) {
  const n = lowerServiceName(service?.name || 'enterprise service');
  return [
    { name: 'Strategy & Audit', description: `Comprehensive ${n} assessment, architecture review, and strategic execution roadmap.`, duration: '2–3 weeks', tier: 'Advisory' },
    { name: 'Pilot Pod', description: `Targeted deployment of core ${n} capability for one high-impact business unit.`, duration: '8 weeks', tier: 'Pilot' },
    { name: 'Platform Build', description: `Engineering enterprise-wide ${n} architecture, automated pipelines, and core system integration.`, duration: '16–24 weeks', tier: 'Platform' },
    { name: 'Managed Operations', description: '24/7 production monitoring, incident response, performance optimization, and operational management.', duration: 'Ongoing', tier: 'Managed' },
    { name: 'Continuous Scale', description: 'Enterprise-wide optimization, periodic capability upgrades, and continuous strategic tuning.', duration: 'Ongoing', tier: 'Enterprise' },
  ];
}
