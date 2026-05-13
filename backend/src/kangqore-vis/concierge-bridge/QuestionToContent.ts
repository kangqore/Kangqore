import { prisma } from '../../lib/prisma';

export class QuestionToContent {
  static slugify(question: string): string {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  static async createBlueprintStub(question: string): Promise<{ id: string; url: string }> {
    const slug = this.slugify(question);
    const url = `/insights/${slug}`;
    const existing = await prisma.kangqoreVisPageBlueprint.findUnique({ where: { url } });
    if (existing) return { id: existing.id, url: existing.url };

    const created = await prisma.kangqoreVisPageBlueprint.create({
      data: {
        pageName: question.slice(0, 120),
        url,
        pageType: 'INSIGHT',
        primaryKeyword: question.slice(0, 60),
        metaTitle: question.slice(0, 70),
        metaDescription: `Kangqore answer: ${question}`,
        status: 'DRAFT',
        source: 'concierge-question',
      },
    });
    return { id: created.id, url: created.url };
  }
}
