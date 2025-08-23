// API service for chatbot backend communication
import { getApiUrl, getEndpointUrl, API_CONFIG } from '@/config/api';

export interface ChatbotRequest {
  query: string;
  deep_search?: boolean;
}

export interface ChatbotResponse {
  answer: {
    answer: string;
    deep_research_log?: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isDeepResearch?: boolean;
}

class ChatbotApiService {
  private baseUrl: string;

  constructor() {
    // Use the centralized API configuration
    this.baseUrl = getApiUrl();
    console.log('Chatbot API Service initialized with base URL:', this.baseUrl);
  }

  /**
   * Send a query to the chatbot backend
   */
  async sendQuery(query: string, deepSearch: boolean = false): Promise<string> {
    try {
      const endpoint = getEndpointUrl(API_CONFIG.ENDPOINTS.QUERY);
      console.log(`Sending query to ${endpoint}:`, { query, deep_search: deepSearch });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 
        deepSearch ? API_CONFIG.TIMEOUT.DEEP_RESEARCH : API_CONFIG.TIMEOUT.QUERY
      );

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          deep_search: deepSearch,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend response data:', data);
      
      // Handle the current backend response format: {answer: {answer: "text", deep_research_log: ""}}
      if (data.answer && typeof data.answer === 'object' && 'answer' in data.answer) {
        return data.answer.answer;
      } 
      // Handle legacy formats for backward compatibility
      else if (data.answer && typeof data.answer === 'string') {
        return data.answer;
      } 
      else if (data.response) {
        return data.response;
      }
      // If we can't parse the response, return a fallback
      else {
        console.warn('Unexpected response format:', data);
        return 'I received an unexpected response format. Please try again.';
      }
    } catch (error) {
      console.error('Error sending query:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Failed to connect to the server. Please check if the backend is running and accessible.');
      }
      
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timed out. Please try again or check your connection.');
      }
      
      throw error;
    }
  }

  /**
   * Test connection to the backend
   */
  async testConnection(): Promise<boolean> {
    try {
      // First try the health endpoint
      const healthEndpoint = getEndpointUrl(API_CONFIG.ENDPOINTS.HEALTH);
      const healthController = new AbortController();
      const healthTimeoutId = setTimeout(() => healthController.abort(), API_CONFIG.TIMEOUT.CONNECTION_TEST);

      const healthResponse = await fetch(healthEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: healthController.signal,
      });

      clearTimeout(healthTimeoutId);
      
      if (healthResponse.ok) {
        return true;
      }
      
      // Fallback to query endpoint if health endpoint doesn't work
      const queryEndpoint = getEndpointUrl(API_CONFIG.ENDPOINTS.QUERY);
      const queryController = new AbortController();
      const queryTimeoutId = setTimeout(() => queryController.abort(), API_CONFIG.TIMEOUT.CONNECTION_TEST);

      const response = await fetch(queryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'test',
          deep_search: false,
        }),
        signal: queryController.signal,
      });

      clearTimeout(queryTimeoutId);
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get fallback response for when backend is unavailable
   */
  getFallbackResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! I'm your AI Finance Assistant. I'm currently unable to connect to my advanced AI backend, but I'm here to help with basic financial questions.";
    } else if (lowerQuery.includes('investment') || lowerQuery.includes('stock')) {
      return "For investment advice, I recommend consulting with a financial advisor and doing thorough research. I'm currently unable to access real-time market data, but I can help with general investment principles when my backend is available.";
    } else if (lowerQuery.includes('budget') || lowerQuery.includes('saving')) {
      return "Budgeting is crucial for financial health. Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. I can provide more detailed guidance when my AI backend is connected.";
    } else {
      return "I'm your AI Finance Assistant, but I'm currently unable to connect to my advanced AI backend. Please check your internet connection and try again, or contact support if the issue persists.";
    }
  }
}

export const chatbotApi = new ChatbotApiService();
