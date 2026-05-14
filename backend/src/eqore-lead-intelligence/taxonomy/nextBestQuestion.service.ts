import { KANGQORE_SERVICES } from './kangqoreServiceTaxonomy';

export class NextBestQuestionService {
  /**
   * Generates or selects the single best qualifying question.
   */
  static getNextBestQuestion(
    matchedServices: string[],
    buyingStage: string,
    existingQuestion?: string
  ): string {
    // If Claude generated a high-quality question, use it as a base
    if (existingQuestion && existingQuestion.length > 20 && existingQuestion.includes('?')) {
      return existingQuestion;
    }

    // Otherwise, pick from the primary matched service
    if (matchedServices.length > 0) {
      const primaryService = KANGQORE_SERVICES[matchedServices[0]];
      if (primaryService && primaryService.recommendedQuestions.length > 0) {
        // Simple rotation or logic based on stage
        if (buyingStage === 'Ready To Talk') {
          return "Would you like to schedule a deep-dive consultation with our technical architects to discuss this implementation?";
        }
        return primaryService.recommendedQuestions[0];
      }
    }

    // Fallback for general inquiries
    return "Could you tell me more about the specific business outcomes you are looking to achieve with this transformation?";
  }
}
