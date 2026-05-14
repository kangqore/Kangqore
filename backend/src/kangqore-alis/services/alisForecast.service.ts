import { TimeRange } from './alisUtils';
import { getDepartments, getServices } from './alisDemandTrend.service';
import { getBuyerIntent } from './alisAggregation.service';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Strategic Forecast & Growth Recommendations Service
// Deterministic rule-based executive growth recommendations
// ---------------------------------------------------------------------------

export async function getGrowthRecs(range: TimeRange = '30d') {
  const [deptData, svcData, intentData] = await Promise.all([
    getDepartments(range),
    getServices(range),
    getBuyerIntent(range),
  ]);

  const recs: { priority: string; category: string; title: string; reasoning: string }[] = [];

  // Department-based recommendations
  const topDept = deptData.departments[0];
  if (topDept && topDept.leadCount >= 3) {
    recs.push({
      priority: 'HIGH',
      category: 'DEMAND',
      title: `Double down on ${topDept.name}`,
      reasoning: `${topDept.name} leads with ${topDept.leadCount} leads and $${topDept.totalRevenue.toLocaleString()} potential ACV. Conversion rate: ${topDept.conversionRate}%.`,
    });
  }

  // Service ACV optimization
  const highAcvService = svcData.services.find(s => s.totalAcv > 0);
  if (highAcvService) {
    recs.push({
      priority: 'MEDIUM',
      category: 'REVENUE',
      title: `Optimize ${highAcvService.name} consultation flow`,
      reasoning: `${highAcvService.name} has ${highAcvService.mentions} interested leads with $${highAcvService.totalAcv.toLocaleString()} total ACV potential.`,
    });
  }

  // Visitor segment insights
  const enterpriseSegment = intentData.visitorSegments.find(s => s.type.toLowerCase().includes('enterprise'));
  if (enterpriseSegment) {
    recs.push({
      priority: 'HIGH',
      category: 'TARGETING',
      title: `Enterprise segment requires dedicated nurture track`,
      reasoning: `${enterpriseSegment.count} enterprise visitors with avg score ${enterpriseSegment.avgScore}. Build a dedicated ABM campaign.`,
    });
  }

  // Low-conversion department
  const lowConvDept = deptData.departments.find(d => d.leadCount >= 3 && d.conversionRate < 15);
  if (lowConvDept) {
    recs.push({
      priority: 'MEDIUM',
      category: 'CONVERSION',
      title: `Fix ${lowConvDept.name} booking funnel`,
      reasoning: `${lowConvDept.name} has ${lowConvDept.leadCount} leads but only ${lowConvDept.conversionRate}% booking rate. Review service page and eQORE consultation prompts.`,
    });
  }

  return { recommendations: recs };
}
