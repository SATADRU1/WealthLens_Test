// API Configuration for WealthLens Frontend
import { Platform } from 'react-native';

// Auto-detect local IP for mobile development
const getLocalIP = (): string => {
  // Priority order: environment variable, then common local IPs
  if (process.env.EXPO_PUBLIC_LOCAL_IP) {
    return process.env.EXPO_PUBLIC_LOCAL_IP;
  }

  // Default to the correct IP from backend configuration
  return '192.168.0.140';
};

export const API_CONFIG = {
  // Base API URL - can be overridden by environment variables
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',

  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    QUERY: '/query',
    STOCK_PRICE: '/stock-price',
    TEST_MARKDOWN: '/test-markdown',
  },

  // Development settings
  DEV: {
    // For mobile development, you might need to use your computer's IP address
    LOCAL_IP: getLocalIP(),
    // Automatically use local IP for mobile platforms
    USE_LOCAL_IP: Platform.OS === 'android' || Platform.OS === 'ios',
  },

  // Timeout settings
  TIMEOUT: {
    CONNECTION_TEST: 10000, // 10 seconds (increased for mobile)
    QUERY: 45000, // 45 seconds (increased for mobile)
    DEEP_RESEARCH: 90000, // 90 seconds (increased for mobile)
    STOCK_DATA: 15000, // 15 seconds for stock data
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second between retries
  },
};

// Helper function to get the correct API URL
export const getApiUrl = (): string => {
  // Check if we're in development mode and should use local IP
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

  if (isDevelopment && API_CONFIG.DEV.USE_LOCAL_IP) {
    const url = `http://${API_CONFIG.DEV.LOCAL_IP}:8000`;
    console.log(`Using local IP for ${Platform.OS}: ${url}`);
    return url;
  }

  console.log(`Using base URL: ${API_CONFIG.BASE_URL}`);
  return API_CONFIG.BASE_URL;
};

// Helper function to check if we can reach a URL
export const checkUrlReachability = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper function to get the best available API URL
export const getBestApiUrl = async (): Promise<string> => {
  const urls = [
    `http://${API_CONFIG.DEV.LOCAL_IP}:8000`,
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    API_CONFIG.BASE_URL
  ];

  for (const url of urls) {
    if (await checkUrlReachability(url)) {
      console.log(`Found working API URL: ${url}`);
      return url;
    }
  }

  console.warn('No working API URL found, using default');
  return API_CONFIG.BASE_URL;
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return `${getApiUrl()}${endpoint}`;
};

// Helper function to test if we can reach the API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT.CONNECTION_TEST);

    const response = await fetch(getEndpointUrl(API_CONFIG.ENDPOINTS.HEALTH), {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Helper function for retrying failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxAttempts: number = API_CONFIG.RETRY.MAX_ATTEMPTS
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Request attempt ${attempt} failed:`, error);

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY.DELAY * attempt));
      }
    }
  }

  throw lastError!;
};
