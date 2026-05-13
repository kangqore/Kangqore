import { prisma } from '../../lib/prisma';

export interface ResolvedMetadata {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
}

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

export class MetadataResolver {
  static async resolve(url: string): Promise<ResolvedMetadata | null> {
    const blueprint = await prisma.kangqoreVisPageBlueprint.findUnique({ where: { url } });
    if (!blueprint) return null;

    return {
      url,
      title: blueprint.metaTitle ?? blueprint.pageName,
      description: blueprint.metaDescription ?? '',
      keywords: [
        blueprint.primaryKeyword,
        ...blueprint.secondaryKeywords,
      ].filter(Boolean) as string[],
      canonical: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      ogImage: blueprint.ogImage ?? undefined,
    };
  }
}
