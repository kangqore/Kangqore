import { prisma } from '../../lib/prisma';

export interface LinkSuggestion {
  url: string;
  pageName: string;
  reason: string;
  weight: number;
}

export class LinkSuggester {
  static async suggestForBlueprint(blueprintId: string, limit = 5): Promise<LinkSuggestion[]> {
    const blueprint = await prisma.kangqoreVisPageBlueprint.findUnique({
      where: { id: blueprintId },
      include: { parentHub: { include: { spokes: { include: { blueprints: true } } } } },
    });
    if (!blueprint) return [];

    const suggestions: LinkSuggestion[] = [];

    if (blueprint.parentHub) {
      const siblingBlueprints = blueprint.parentHub.spokes.flatMap((s) => s.blueprints);
      for (const sibling of siblingBlueprints) {
        if (sibling.id === blueprint.id) continue;
        suggestions.push({
          url: sibling.url,
          pageName: sibling.pageName,
          reason: 'same-hub-sibling',
          weight: 0.8,
        });
      }
    }

    if (blueprint.parentHub) {
      suggestions.push({
        url: blueprint.parentHub.url ?? '/',
        pageName: blueprint.parentHub.name,
        reason: 'parent-hub',
        weight: 1.0,
      });
    }

    return suggestions.slice(0, limit);
  }
}
