import { prisma } from '../../lib/prisma';
import { TimeRange, whereCreatedAt } from './alisUtils';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Content Gap Analysis Service
// Identifies unanswered questions and recommends content creation
// ---------------------------------------------------------------------------

export async function getContentGaps(range: TimeRange = '30d') {
  const dateFilter = whereCreatedAt(range);

  const leads = await prisma.eqoreLead.findMany({
    where: { ...dateFilter, nextBestQuestion: { not: null } },
    select: { nextBestQuestion: true, primaryDepartment: true },
  });

  const questionMap: Record<string, { count: number; departments: Set<string> }> = {};
  for (const l of leads) {
    const q = l.nextBestQuestion!;
    if (!questionMap[q]) questionMap[q] = { count: 0, departments: new Set() };
    questionMap[q].count++;
    if (l.primaryDepartment) questionMap[q].departments.add(l.primaryDepartment);
  }

  const gaps = Object.entries(questionMap)
    .map(([question, d]) => ({
      question,
      frequency: d.count,
      departments: Array.from(d.departments),
      recommendation: d.count >= 3 ? 'Create dedicated blog post' : d.count >= 2 ? 'Add to service page FAQ' : 'Monitor',
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 15);

  return { gaps, totalUnanswered: leads.length };
}
