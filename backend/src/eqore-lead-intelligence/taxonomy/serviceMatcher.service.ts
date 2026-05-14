import { KANGQORE_SERVICES, KangqoreService } from './kangqoreServiceTaxonomy';
import logger from '../../utils/logger';

export interface ServiceMatchResult {
  primaryDepartment: string;
  secondaryDepartments: { department: string; fitScore: number; reason: string }[];
  matchedServices: { service: string; slug: string; department: string; fitScore: number; reason: string }[];
  departmentFitScores: Record<string, number>;
  serviceFitScores: Record<string, number>;
  recommendedSolutionPackage: string;
  serviceMatchReason: string;
  nextBestQuestion: string;
}

export class ServiceMatcherService {
  /**
   * Matches a transcript against the Kangqore Service Taxonomy.
   * Implementation of the CTO's deterministic fit score formula.
   */
  static matchServices(transcript: string): ServiceMatchResult {
    const text = transcript.toLowerCase();
    const serviceScores: Record<string, number> = {};
    const serviceReasons: Record<string, string[]> = {};
    const departmentScores: Record<string, number> = {};

    // 1. Calculate Individual Service Scores
    Object.values(KANGQORE_SERVICES).forEach((service) => {
      let score = 0;
      const reasons: string[] = [];

      // Exact keyword match (+30)
      const matchedKeywords = service.signalKeywords.filter(k => text.includes(k.toLowerCase()));
      if (matchedKeywords.length > 0) {
        score += 30;
        reasons.push(`Exact keyword match: ${matchedKeywords[0]}`);
      }

      // Buyer signal match (+25)
      const matchedBuyerSignals = service.buyerSignals.filter(s => text.includes(s.toLowerCase()));
      if (matchedBuyerSignals.length > 0) {
        score += 25;
        reasons.push(`Buyer intent signal: ${matchedBuyerSignals[0]}`);
      }

      // Pain point match (+15)
      const matchedPainPoints = service.painPointSignals.filter(p => text.includes(p.toLowerCase()));
      if (matchedPainPoints.length > 0) {
        score += 15;
        reasons.push(`Pain point identified: ${matchedPainPoints[0]}`);
      }

      // Strategic priority boost (+5)
      if (score > 0 && service.priorityLevel === 'strategic') {
        score += 5;
        reasons.push('Strategic priority alignment');
      }

      if (score > 0) {
        serviceScores[service.slug] = Math.min(100, score);
        serviceReasons[service.slug] = reasons;

        // Aggregate to department
        const dept = service.departmentName;
        departmentScores[dept] = Math.max(departmentScores[dept] || 0, serviceScores[service.slug]);
      }
    });

    // 2. Sort and filter
    const sortedServices = Object.entries(serviceScores)
      .sort(([, a], [, b]) => b - a)
      .map(([slug, score]) => ({
        slug,
        score,
        service: KANGQORE_SERVICES[slug]
      }));

    if (sortedServices.length === 0) {
      return this.getEmptyResult();
    }

    const primaryService = sortedServices[0];
    const primaryDept = primaryService.service.departmentName;

    // 3. Recommended Solution Package (Pick from primary service)
    const recommendedSolutionPackage = primaryService.service.recommendedSolutionPackages[0] || "Strategic Consultation";

    // 4. Next Best Question (Pick from primary service)
    const nextBestQuestion = primaryService.service.recommendedQuestions[0] || "How can we best support your transformation goals?";

    // 5. Construct Result
    return {
      primaryDepartment: primaryDept,
      secondaryDepartments: Object.entries(departmentScores)
        .filter(([dept]) => dept !== primaryDept)
        .map(([dept, score]) => ({
          department: dept,
          fitScore: score,
          reason: `Associated service interest detected.`
        })),
      matchedServices: sortedServices.slice(0, 3).map(s => ({
        service: s.service.name,
        slug: s.slug,
        department: s.service.departmentName,
        fitScore: s.score,
        reason: serviceReasons[s.slug].join('. ')
      })),
      departmentFitScores: departmentScores,
      serviceFitScores: serviceScores,
      recommendedSolutionPackage,
      serviceMatchReason: `Matched primarily to ${primaryService.service.name} because: ${serviceReasons[primaryService.slug].join(', ')}.`,
      nextBestQuestion
    };
  }

  private static getEmptyResult(): ServiceMatchResult {
    return {
      primaryDepartment: 'Unassigned',
      secondaryDepartments: [],
      matchedServices: [],
      departmentFitScores: {},
      serviceFitScores: {},
      recommendedSolutionPackage: 'General Business Consultation',
      serviceMatchReason: 'No specific service signals detected in transcript.',
      nextBestQuestion: 'Could you tell me more about the business challenges you are looking to solve?'
    };
  }
}
