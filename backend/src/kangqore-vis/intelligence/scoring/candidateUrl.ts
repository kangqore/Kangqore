/**
 * The URL a page for these entities would live at if drafted. Shared by
 * VisOpportunityActioner (which creates the blueprint at this URL) and
 * scoreEffort (which checks whether that URL already has one) — both must
 * agree on the same calculation or "page already exists" would silently
 * check the wrong page.
 */
export function candidateUrl(entitySlugs: string[]): string | null {
  const slugs = [...new Set(entitySlugs)].sort();
  if (slugs.length < 2) return null;
  const [slugA, slugB] = slugs;
  return `/industries/${slugA}/${slugB}`;
}
