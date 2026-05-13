import { prisma } from '../../lib/prisma';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export class FaqBank {
  static list(filter?: { categorySlug?: string; blueprintId?: string }) {
    return prisma.kangqoreVisFAQ.findMany({
      where: {
        published: true,
        category: filter?.categorySlug ? { slug: filter.categorySlug } : undefined,
        blueprintId: filter?.blueprintId ?? undefined,
      },
      include: { category: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });
  }

  static async upsertCategory(slug: string, name: string) {
    return prisma.kangqoreVisFAQCategory.upsert({
      where: { slug },
      create: { slug, name },
      update: { name },
    });
  }

  static async addFaq(data: {
    question: string;
    answer: string;
    categorySlug?: string;
    blueprintId?: string;
    source?: string;
    position?: number;
  }) {
    let categoryId: string | undefined;
    if (data.categorySlug) {
      const cat = await this.upsertCategory(data.categorySlug, data.categorySlug.replace(/-/g, ' '));
      categoryId = cat.id;
    }
    return prisma.kangqoreVisFAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        categoryId,
        blueprintId: data.blueprintId,
        source: data.source ?? 'manual',
        position: data.position ?? 0,
      },
    });
  }

  static async importFromKB(): Promise<{ created: number }> {
    const candidates = [
      path.resolve(process.cwd(), 'knowledge-base/04-faqs.md'),
      path.resolve(__dirname, '../../../knowledge-base/04-faqs.md'),
      path.resolve(__dirname, '../../../../backend/knowledge-base/04-faqs.md'),
    ];
    const filePath = candidates.find((p) => existsSync(p));
    if (!filePath) return { created: 0 };

    const raw = await readFile(filePath, 'utf-8');
    const parsed = matter(raw);
    const body = parsed.content;

    const lines = body.split('\n');
    let created = 0;
    let currentQuestion: string | null = null;
    let currentAnswer: string[] = [];

    const flush = async () => {
      if (currentQuestion && currentAnswer.join('\n').trim()) {
        const exists = await prisma.kangqoreVisFAQ.findFirst({ where: { question: currentQuestion } });
        if (!exists) {
          await this.addFaq({
            question: currentQuestion,
            answer: currentAnswer.join('\n').trim(),
            categorySlug: 'general',
            source: 'kb',
          });
          created++;
        }
      }
      currentQuestion = null;
      currentAnswer = [];
    };

    for (const line of lines) {
      if (/^##+\s+/.test(line)) {
        await flush();
        currentQuestion = line.replace(/^##+\s+/, '').trim();
      } else if (currentQuestion) {
        currentAnswer.push(line);
      }
    }
    await flush();

    return { created };
  }
}
