import axios from 'axios';
import { createError } from '../../middleware/errorHandler';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export class IntelligenceService {
  static async getInsights(params?: {
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const response = await axios.get(`${PYTHON_SERVICE_URL}/api/insights`, {
        params,
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(`Intelligence service error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
      } else if (error.request) {
        throw createError('Intelligence service unavailable', 503);
      }
      throw createError('Failed to fetch insights', 500);
    }
  }

  static async createInsight(data: {
    title: string;
    category: string;
    content: string;
    tags?: string;
    authorId: string;
    authorName: string;
    authorCompany: string;
  }) {
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/api/insights`, data, {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(`Intelligence service error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
      } else if (error.request) {
        throw createError('Intelligence service unavailable', 503);
      }
      throw createError('Failed to create insight', 500);
    }
  }

  static async getAnalytics(params?: {
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    try {
      const response = await axios.get(`${PYTHON_SERVICE_URL}/api/analytics`, {
        params,
        timeout: 15000
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(`Intelligence service error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
      } else if (error.request) {
        throw createError('Intelligence service unavailable', 503);
      }
      throw createError('Failed to fetch analytics', 500);
    }
  }

  static async generateRecommendations(userId: string) {
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/api/recommendations`, {
        userId
      }, {
        timeout: 20000
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw createError(`Intelligence service error: ${error.response.data.message || 'Unknown error'}`, error.response.status);
      } else if (error.request) {
        throw createError('Intelligence service unavailable', 503);
      }
      throw createError('Failed to generate recommendations', 500);
    }
  }
}
