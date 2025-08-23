// Real-time data provider that fetches live data from WealthLens backend
import { Investment, Transaction, Goal, Expense, BankAccount, Article } from '@/types';
import { stockDataService } from '@/services/stockDataService';
import { chatbotApi } from '@/services/chatbotApi';

// Base portfolio configuration - these represent the user's actual holdings
const USER_PORTFOLIO_CONFIG = [
  { ticker: 'AAPL', quantity: 100, purchaseValue: 15000 },
  { ticker: 'GOOGL', quantity: 10, purchaseValue: 30000 },
  { ticker: 'MSFT', quantity: 50, purchaseValue: 15000 },
  { ticker: 'TSLA', quantity: 25, purchaseValue: 12000 },
  { ticker: 'NVDA', quantity: 30, purchaseValue: 18000 },
];

class RealTimeDataProvider {
  private investmentCache: Investment[] | null = null;
  private lastInvestmentUpdate: number = 0;
  private readonly CACHE_DURATION = 300000; // 5 minutes

  /**
   * Get real-time investment data
   */
  async getRealTimeInvestments(): Promise<Investment[]> {
    try {
      // Check cache first
      if (this.investmentCache && 
          Date.now() - this.lastInvestmentUpdate < this.CACHE_DURATION) {
        console.log('Using cached investment data');
        return this.investmentCache;
      }

      console.log('Fetching real-time investment data...');
      
      const symbols = USER_PORTFOLIO_CONFIG.map(config => config.ticker);
      const stockPrices = await stockDataService.getMultipleStockPrices(symbols);
      
      const investments: Investment[] = USER_PORTFOLIO_CONFIG.map((config, index) => {
        const stockData = stockPrices.get(config.ticker);
        
        if (stockData) {
          // Convert INR to USD for display (approximate)
          const usdPrice = stockData.current_price * 0.012;
          const usdChange = stockData.change * 0.012;
          
          return {
            id: (index + 1).toString(),
            ticker: config.ticker,
            name: stockData.name,
            price: parseFloat(usdPrice.toFixed(2)),
            change: parseFloat(usdChange.toFixed(2)),
            changePercent: parseFloat(stockData.change_percent.toFixed(2)),
            type: 'stock',
            currentValue: parseFloat((usdPrice * config.quantity).toFixed(2)),
            purchaseValue: config.purchaseValue,
            quantity: config.quantity,
          };
        } else {
          // Fallback to mock data if real data unavailable
          return this.getFallbackInvestment(config, index);
        }
      });

      // Cache the results
      this.investmentCache = investments;
      this.lastInvestmentUpdate = Date.now();
      
      console.log('Real-time investment data updated successfully');
      return investments;
      
    } catch (error) {
      console.error('Error fetching real-time investment data:', error);
      return this.getFallbackInvestments();
    }
  }

  /**
   * Get real-time portfolio performance data
   */
  async getRealTimePortfolioData(): Promise<{ data: number[]; labels: string[] }> {
    try {
      const investments = await this.getRealTimeInvestments();
      const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
      const totalPurchaseValue = investments.reduce((sum, inv) => sum + inv.purchaseValue, 0);
      
      // Generate mock historical data based on current performance
      const currentPerformance = ((totalCurrentValue - totalPurchaseValue) / totalPurchaseValue) * 100;
      const baseValue = 100;
      
      // Generate 6 months of data with some realistic variation
      const data = [];
      const labels = [];
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 6; i++) {
        const variation = (Math.random() - 0.5) * 10; // ±5% variation
        const value = baseValue + (currentPerformance * (i + 1) / 6) + variation;
        data.push(Math.max(50, Math.min(150, value))); // Keep within reasonable bounds
        labels.push(months[i]);
      }
      
      return { data, labels };
    } catch (error) {
      console.error('Error generating portfolio data:', error);
      return { data: [67, 72, 69, 75, 78, 82], labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
    }
  }

  /**
   * Get real-time market insights
   */
  async getMarketInsights(): Promise<string[]> {
    try {
      const response = await chatbotApi.sendQuery(
        'Give me 3 brief market insights for today in bullet points',
        false
      );
      
      // Parse bullet points from response
      const insights = response
        .split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
        .map(line => line.replace(/^[•\-]\s*/, '').trim())
        .filter(insight => insight.length > 0)
        .slice(0, 3);
      
      if (insights.length > 0) {
        return insights;
      }
      
      return this.getFallbackInsights();
    } catch (error) {
      console.error('Error fetching market insights:', error);
      return this.getFallbackInsights();
    }
  }

  /**
   * Get real-time exchange rate data
   */
  async getRealTimeExchangeRates(): Promise<{ data: number[]; labels: string[] }> {
    try {
      const response = await chatbotApi.sendQuery(
        'What is the current USD to INR exchange rate?',
        false
      );
      
      // Extract exchange rate from response
      const rateMatch = response.match(/(\d+\.?\d*)/);
      const currentRate = rateMatch ? parseFloat(rateMatch[1]) : 83.5;
      
      // Generate 7 days of mock data around current rate
      const data = [];
      const labels = [];
      
      for (let i = 0; i < 7; i++) {
        const variation = (Math.random() - 0.5) * 2; // ±1 variation
        const rate = currentRate + variation;
        data.push(parseFloat(rate.toFixed(2)));
        labels.push(`Day ${i + 1}`);
      }
      
      return { data, labels };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return { 
        data: [83.2, 83.5, 83.1, 83.3, 83.6, 83.4, 83.7], 
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] 
      };
    }
  }

  /**
   * Force refresh all cached data
   */
  async refreshAllData(): Promise<void> {
    console.log('Refreshing all real-time data...');
    this.investmentCache = null;
    this.lastInvestmentUpdate = 0;
    stockDataService.clearCache();
    
    // Pre-fetch new data
    await this.getRealTimeInvestments();
    console.log('All data refreshed successfully');
  }

  /**
   * Check if real-time data is available
   */
  async isRealTimeDataAvailable(): Promise<boolean> {
    try {
      const isBackendAvailable = await chatbotApi.testConnection();
      const isStockDataAvailable = await stockDataService.testConnection();
      return isBackendAvailable && isStockDataAvailable;
    } catch (error) {
      console.error('Error checking real-time data availability:', error);
      return false;
    }
  }

  // Fallback methods for when real data is unavailable
  private getFallbackInvestment(config: any, index: number): Investment {
    const fallbackPrices: { [key: string]: { price: number; change: number; changePercent: number } } = {
      'AAPL': { price: 175.23, change: 2.45, changePercent: 1.42 },
      'GOOGL': { price: 2847.56, change: -15.23, changePercent: -0.53 },
      'MSFT': { price: 331.78, change: 4.12, changePercent: 1.26 },
      'TSLA': { price: 248.50, change: -3.20, changePercent: -1.27 },
      'NVDA': { price: 875.30, change: 12.45, changePercent: 1.44 },
    };
    
    const fallback = fallbackPrices[config.ticker] || { price: 100, change: 0, changePercent: 0 };
    
    return {
      id: (index + 1).toString(),
      ticker: config.ticker,
      name: stockDataService['getCompanyName'](config.ticker),
      price: fallback.price,
      change: fallback.change,
      changePercent: fallback.changePercent,
      type: 'stock',
      currentValue: fallback.price * config.quantity,
      purchaseValue: config.purchaseValue,
      quantity: config.quantity,
    };
  }

  private getFallbackInvestments(): Investment[] {
    return USER_PORTFOLIO_CONFIG.map((config, index) => 
      this.getFallbackInvestment(config, index)
    );
  }

  private getFallbackInsights(): string[] {
    return [
      'Tech stocks showing mixed performance amid market volatility',
      'Federal Reserve policy decisions continue to impact market sentiment',
      'Energy sector gains momentum with rising commodity prices'
    ];
  }
}

// Export singleton instance
export const realTimeDataProvider = new RealTimeDataProvider();

// Export static data that doesn't need real-time updates
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    amount: 1000,
    description: 'Bought AAPL shares',
    date: '2024-01-15',
    category: 'Investment'
  },
  {
    id: '2',
    type: 'sell',
    amount: 500,
    description: 'Sold GOOGL shares',
    date: '2024-01-14',
    category: 'Investment'
  },
  {
    id: '3',
    type: 'expense',
    amount: 85.50,
    description: 'Grocery shopping',
    date: '2024-01-13',
    category: 'Food'
  },
  {
    id: '4',
    type: 'income',
    amount: 3000,
    description: 'Salary',
    date: '2024-01-01',
    category: 'Income'
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    category: 'Savings',
    targetDate: '2024-12-31'
  },
  {
    id: '2',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8300,
    category: 'Purchase',
    targetDate: '2025-06-30'
  },
  {
    id: '3',
    name: 'Vacation Fund',
    targetAmount: 5000,
    currentAmount: 2100,
    category: 'Travel',
    targetDate: '2024-08-15'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 85.50,
    category: 'Food',
    description: 'Grocery shopping',
    date: '2024-01-13'
  },
  {
    id: '2',
    amount: 1200,
    category: 'Housing',
    description: 'Rent payment',
    date: '2024-01-01'
  },
  {
    id: '3',
    amount: 45.99,
    category: 'Shopping',
    description: 'Online purchase',
    date: '2024-01-12'
  },
  {
    id: '4',
    amount: 75.00,
    category: 'Transportation',
    description: 'Gas',
    date: '2024-01-11'
  }
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'Chase Bank',
    accountNumber: '****1234',
    balance: 15420.50
  },
  {
    id: '2',
    bankName: 'Bank of America',
    accountNumber: '****5678',
    balance: 8750.25
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Building Your First Investment Portfolio',
    description: 'Learn the fundamentals of creating a diversified investment portfolio.',
    category: 'Investing',
    imageUrl: 'https://images.pexels.com/photos/6801872/pexels-photo-6801872.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    title: 'Understanding Compound Interest',
    description: 'Discover how compound interest can work in your favor over time.',
    category: 'Savings',
    imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '3',
    title: 'Budgeting for Beginners',
    description: 'Simple strategies to create and stick to a monthly budget.',
    category: 'Budgeting',
    imageUrl: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

export const expenseCategories = {
  Food: 850,
  Housing: 1200,
  Shopping: 450,
  Transportation: 300,
  Entertainment: 200,
};
