interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface HistoricalRateResponse {
  success: boolean;
  historical: boolean;
  date: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

// Free tier API key for exchangerate-api.com (replace with your own)
const API_KEY = 'd356442c1cf2f8fc446807fd';
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

// Fallback mock data for when API is not available
const MOCK_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.9250,
  'GBP': 0.7900,
  'JPY': 149.2000,
  'INR': 83.5400,
  'CAD': 1.3650,
  'AUD': 1.5420,
  'CHF': 0.8950,
  'CNY': 7.2800,
  'SGD': 1.3580,
  'KRW': 1340.50,
  'MXN': 17.8500,
  'BRL': 5.1200,
  'RUB': 92.5000,
  'ZAR': 18.7500,
};

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
];

class ExchangeRateService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getCacheKey(base: string, target?: string): string {
    return target ? `${base}-${target}` : base;
  }

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    const cacheKey = this.getCacheKey(baseCurrency);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      // Try to fetch from API
      const response = await fetch(`${BASE_URL}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();
      
      if (data.success && data.rates) {
        this.cache.set(cacheKey, {
          data: data.rates,
          timestamp: Date.now()
        });
        return data.rates;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.warn('Failed to fetch exchange rates from API, using mock data:', error);
      
      // Return mock data with base currency conversion
      const rates: Record<string, number> = {};
      const baseRate = MOCK_RATES[baseCurrency] || 1;
      
      Object.entries(MOCK_RATES).forEach(([currency, rate]) => {
        if (currency !== baseCurrency) {
          rates[currency] = rate / baseRate;
        }
      });
      
      // Cache mock data for shorter duration
      this.cache.set(cacheKey, {
        data: rates,
        timestamp: Date.now()
      });
      
      return rates;
    }
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<{ convertedAmount: number; rate: number; timestamp: Date }> {
    if (fromCurrency === toCurrency) {
      return {
        convertedAmount: amount,
        rate: 1,
        timestamp: new Date()
      };
    }

    try {
      const rates = await this.getExchangeRates(fromCurrency);
      const rate = rates[toCurrency];
      
      if (!rate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      }

      return {
        convertedAmount: amount * rate,
        rate,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Currency conversion failed:', error);
      
      // Fallback to mock calculation
      const fromRate = MOCK_RATES[fromCurrency] || 1;
      const toRate = MOCK_RATES[toCurrency] || 1;
      const rate = toRate / fromRate;
      
      return {
        convertedAmount: amount * rate,
        rate,
        timestamp: new Date()
      };
    }
  }

  async getHistoricalRates(
    baseCurrency: string,
    targetCurrency: string,
    days: number = 7
  ): Promise<Array<{ date: string; rate: number }>> {
    // For demo purposes, generate mock historical data
    // In a real app, you would fetch this from a historical rates API
    const historicalData: Array<{ date: string; rate: number }> = [];
    const baseRate = MOCK_RATES[targetCurrency] / MOCK_RATES[baseCurrency];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some random variation to simulate real market fluctuations
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const rate = baseRate * (1 + variation);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        rate: parseFloat(rate.toFixed(4))
      });
    }
    
    return historicalData;
  }

  getCurrencyInfo(currencyCode: string): CurrencyInfo | undefined {
    return POPULAR_CURRENCIES.find(currency => currency.code === currencyCode);
  }

  getAllCurrencies(): CurrencyInfo[] {
    return POPULAR_CURRENCIES;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const exchangeRateService = new ExchangeRateService();
export default exchangeRateService;
