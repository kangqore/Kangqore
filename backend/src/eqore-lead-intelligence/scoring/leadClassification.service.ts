/**
 * Service to classify the type of visitor interacting with eQORE.
 */
export class EqoreLeadClassificationService {
  /**
   * Classifies a visitor based on their message history and context.
   * Hardened Phase 1 categorizes into the 10 canonical visitor types.
   */
  static classifyVisitorType(messages: { content: string; role: string }[]): string {
    const userMessages = messages.filter(m => m.role === 'USER').map(m => m.content.toLowerCase());
    const combinedText = userMessages.join(' ');

    if (/(job|hiring|internship|fresher|resume|career|assignment|college)/i.test(combinedText)) return 'Job Seeker';
    if (/(student|university|school|homework)/i.test(combinedText)) return 'Student';
    if (/(competitor|vs kangqore|compare to)/i.test(combinedText)) return 'Competitor';
    if (/(partner|partnership|resell|affiliate|agency)/i.test(combinedText)) return 'Partner Prospect';
    if (/(startup|founder|seed|series a|mvp)/i.test(combinedText)) return 'Startup Founder';
    
    // Enterprise/Serious signals
    if (/(enterprise|modernization|migration|cloud|aws|azure|consulting|quote|pricing|cost|budget|timeline)/i.test(combinedText)) {
      if (/(urgent|asap|this week|budget of)/i.test(combinedText)) return 'Serious Buyer';
      return 'Enterprise Prospect';
    }

    if (/(research|what do you do|services|explain|how does it work)/i.test(combinedText)) return 'Researcher';

    return 'Casual Visitor'; // Default
  }
}
