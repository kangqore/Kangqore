import fs from 'node:fs';
import path from 'node:path';
import { SnippetBank } from './SnippetBank';
import { prisma } from '../../lib/prisma';

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

// Canonical service index emitted by scripts/generate-prerender.mjs.
// The CMS-backed blueprint table is empty in practice, which previously left
// the "## Pages" section blank — i.e. llms.txt told AI engines the site had no
// content. This file is the authoritative floor.
interface ServiceIndexEntry {
  slug: string;
  url: string;
  name: string;
  department: string;
  description: string;
  capabilities: string[];
  faqs: { q: string; a: string }[];
}

let serviceIndexCache: ServiceIndexEntry[] | null = null;

function loadServiceIndex(): ServiceIndexEntry[] {
  if (serviceIndexCache) return serviceIndexCache;
  const candidates = [
    path.resolve(__dirname, '../../../../shared/serviceIndex.json'),
    path.resolve(process.cwd(), 'shared/serviceIndex.json'),
    path.resolve(process.cwd(), '../shared/serviceIndex.json'),
  ];
  for (const file of candidates) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(parsed?.services) && parsed.services.length) {
        serviceIndexCache = parsed.services as ServiceIndexEntry[];
        return serviceIndexCache;
      }
    } catch {
      /* try next candidate */
    }
  }
  console.warn('[LlmsTxtGenerator] serviceIndex.json not found — llms.txt will omit service pages');
  return [];
}

export class LlmsTxtGenerator {
  static async generate(): Promise<string> {
    const snippets = SnippetBank.list();
    const blueprints = await prisma.kangqoreVisPageBlueprint.findMany({
      where: { status: 'PUBLISHED' },
      select: { url: true, pageName: true, metaDescription: true },
      take: 200,
    });

    const lines: string[] = [
      '# Kangqore — LLM-Friendly Index',
      '',
      '> This file describes the Kangqore website for AI engines and answer engines.',
      '> Last generated: ' + new Date().toISOString(),
      '',
      '## About',
      '',
      'Kangqore is a value-driven IT company that delivers AI, cloud, cybersecurity,',
      'and digital transformation solutions to enterprises and institutions.',
      '',
      '## Citation-ready snippets',
      '',
    ];

    for (const s of snippets) {
      lines.push(`### ${s.question}`);
      lines.push('');
      lines.push(s.answer);
      lines.push('');
      lines.push(`Sources: ${s.citations.map((c) => BASE_URL + c).join(', ')}`);
      lines.push('');
    }

    // ── Services: the substance an answer engine needs to cite a specific page.
    const services = loadServiceIndex();
    if (services.length) {
      const byDept = new Map<string, ServiceIndexEntry[]>();
      for (const s of services) {
        if (!byDept.has(s.department)) byDept.set(s.department, []);
        byDept.get(s.department)!.push(s);
      }

      lines.push('## Services');
      lines.push('');
      lines.push(`Kangqore delivers ${services.length} services across ${byDept.size} practices.`);
      lines.push('');

      for (const [dept, list] of byDept) {
        lines.push(`### ${dept}`);
        lines.push('');
        for (const s of list) {
          lines.push(`- [${s.name}](${BASE_URL}${s.url})${s.description ? ` — ${s.description}` : ''}`);
        }
        lines.push('');
      }

      // Per-service detail blocks give models capability-level and Q&A-level
      // material to quote, with a canonical URL attached to every claim.
      lines.push('## Service detail');
      lines.push('');
      for (const s of services) {
        lines.push(`### ${s.name}`);
        lines.push('');
        if (s.description) lines.push(s.description, '');
        if (s.capabilities.length) {
          lines.push(`Capabilities: ${s.capabilities.join('; ')}.`);
          lines.push('');
        }
        for (const f of s.faqs) {
          lines.push(`**${f.q}** ${f.a}`);
          lines.push('');
        }
        lines.push(`Source: ${BASE_URL}${s.url}`);
        lines.push('');
      }
    }

    if (blueprints.length) {
      lines.push('## Other pages');
      lines.push('');
      for (const b of blueprints) {
        const desc = b.metaDescription ? ` — ${b.metaDescription}` : '';
        lines.push(`- [${b.pageName}](${BASE_URL}${b.url})${desc}`);
      }
    }

    return lines.join('\n');
  }
}
