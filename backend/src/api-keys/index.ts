/**
 * API Keys Module - External service credentials management
 * 
 * This module centralizes all API key management and external service configurations
 */

// Environment-based API keys
export const API_KEYS = {
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  VOYAGE_API_KEY: process.env.VOYAGE_API_KEY || '',
  
  // Email Services
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || '',
  
  // Storage Services
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  
  // OAuth Providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || '',
  
  // Analytics
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || '',
  
  // Payment Services
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
};

// Validate required API keys
export function validateRequiredKeys(keys: (keyof typeof API_KEYS)[]): { valid: boolean; missing: string[] } {
  const missing = keys.filter(key => !API_KEYS[key]);
  return {
    valid: missing.length === 0,
    missing
  };
}

// Get service credentials
export function getServiceCredentials(service: 'openai' | 'sendgrid' | 'aws' | 'google' | 'stripe') {
  switch (service) {
    case 'openai':
      return { apiKey: API_KEYS.OPENAI_API_KEY };
    case 'sendgrid':
      return { apiKey: API_KEYS.SENDGRID_API_KEY };
    case 'aws':
      return {
        accessKeyId: API_KEYS.AWS_ACCESS_KEY_ID,
        secretAccessKey: API_KEYS.AWS_SECRET_ACCESS_KEY
      };
    case 'google':
      return {
        clientId: API_KEYS.GOOGLE_CLIENT_ID,
        clientSecret: API_KEYS.GOOGLE_CLIENT_SECRET
      };
    case 'stripe':
      return {
        secretKey: API_KEYS.STRIPE_SECRET_KEY,
        webhookSecret: API_KEYS.STRIPE_WEBHOOK_SECRET
      };
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}

// Check if a service is configured
export function isServiceConfigured(service: keyof typeof API_KEYS): boolean {
  return Boolean(API_KEYS[service]);
}

export default API_KEYS;
