import { SnippetBank } from './SnippetBank';
import { prisma } from '../../lib/prisma';

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

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

    lines.push('## Pages');
    lines.push('');
    for (const b of blueprints) {
      const desc = b.metaDescription ? ` — ${b.metaDescription}` : '';
      lines.push(`- [${b.pageName}](${BASE_URL}${b.url})${desc}`);
    }

    return lines.join('\n');
  }
}
