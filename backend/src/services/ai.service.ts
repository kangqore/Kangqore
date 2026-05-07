import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';

interface AIQueryRequest {
  message: string;
  conversationHistory?: Array<{role: string; content: string}>;
  userId?: string;
}

interface AIQueryResponse {
  response: string;
  confidence?: number;
}

/**
 * Service to communicate with Python AI intelligence layer
 */
export class AIService {
  private static fallbackResponses = [
    "I'm eQORE, Kangqore's AI assistant. I can help you with information about our services, technology solutions, and answer questions about modernizing business operations. How can I assist you today?",
    "That's an interesting question! While I'm still learning about that specific topic, I'd be happy to connect you with one of our specialists who can provide detailed insights. What specifically would you like to know?",
    "As Kangqore's AI assistant, I can provide information about our Digital Transformation, Cloud Solutions, AI & Analytics, and Custom Software Development services. What area interests you most?",
    "I understand you're asking about that. Let me help you better understand Kangqore's approach. We specialize in engineering modern business solutions. Would you like to learn more about a specific service area?",
    "That's a great question! Kangqore partners with businesses to improve everyday life through innovative technology solutions. Can I provide more specific information about any of our service offerings?"
  ];

  /**
   * Send a query to the AI service
   */
  static async query(request: AIQueryRequest): Promise<string> {
    try {
      // Attempt to call Python AI service
      const response = await axios.post<AIQueryResponse>(
        `${PYTHON_SERVICE_URL}/api/chat/query`,
        {
          message: request.message,
          conversation_history: request.conversationHistory || [],
          user_id: request.userId
        },
        {
          timeout: 5000, // 5 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.response;
    } catch (error) {
      // Fallback if Python service is unavailable
      console.warn('Python AI service unavailable, using fallback response:', error);
      return this.getFallbackResponse(request.message);
    }
  }

  /**
   * Generate a contextual fallback response when Python service is unavailable
   */
  private static getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return "Kangqore specializes in Digital Transformation, Cloud Solutions, AI & Analytics, and Custom Software Development. We help businesses modernize their operations and leverage cutting-edge technology. Which area would you like to learn more about?";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return "You can reach out to Kangqore through our contact page. We'd be happy to discuss how we can help transform your business with our technology solutions.";
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
      return "Pricing varies based on your specific needs and project scope. I'd recommend scheduling a consultation with our team to discuss your requirements and receive a customized quote. Would you like me to help you get in touch?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm eQORE, Kangqore's AI assistant. I'm here to help you learn about our services and how we can help modernize your business. What would you like to know?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! If you have any other questions about Kangqore's services or solutions, feel free to ask. I'm here to help!";
    }

    // Default fallback
    const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length);
    return this.fallbackResponses[randomIndex];
  }
}
