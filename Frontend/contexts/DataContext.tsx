// Data Context for managing real-time data throughout the app
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Investment, Transaction, Goal, Expense, BankAccount, Article } from '@/types';
import { realTimeDataProvider, mockTransactions, mockGoals, mockExpenses, mockBankAccounts, mockArticles, expenseCategories } from '@/data/realTimeData';
import { testApiConnection } from '@/config/api';

interface DataContextType {
  // Data
  investments: Investment[];
  transactions: Transaction[];
  goals: Goal[];
  expenses: Expense[];
  bankAccounts: BankAccount[];
  articles: Article[];
  portfolioData: { data: number[]; labels: string[] };
  exchangeRateData: { data: number[]; labels: string[] };
  marketInsights: string[];
  expenseCategories: { [key: string]: number };
  
  // State
  isLoading: boolean;
  isRealTimeEnabled: boolean;
  lastUpdated: Date | null;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  toggleRealTime: () => void;
  clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // State
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolioData, setPortfolioData] = useState<{ data: number[]; labels: string[] }>({
    data: [67, 72, 69, 75, 78, 82],
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  });
  const [exchangeRateData, setExchangeRateData] = useState<{ data: number[]; labels: string[] }>({
    data: [83.2, 83.5, 83.1, 83.3, 83.6, 83.4, 83.7],
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
  });
  const [marketInsights, setMarketInsights] = useState<string[]>([
    'Tech stocks showing mixed performance amid market volatility',
    'Federal Reserve policy decisions continue to impact market sentiment',
    'Energy sector gains momentum with rising commodity prices'
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Static data (doesn't change)
  const transactions = mockTransactions;
  const goals = mockGoals;
  const expenses = mockExpenses;
  const bankAccounts = mockBankAccounts;
  const articles = mockArticles;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-refresh data every 2 minutes when real-time is enabled and app is active
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      // Only refresh if not currently loading to prevent overlapping requests
      if (!isLoading) {
        refreshData();
      }
    }, 2 * 60 * 1000); // 2 minutes (more frequent for better UX)

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, isLoading]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if real-time data is available with timeout
      const isAvailable = await Promise.race([
        realTimeDataProvider.isRealTimeDataAvailable(),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);

      if (isAvailable && isRealTimeEnabled) {
        console.log('✅ Loading real-time data...');
        await loadRealTimeData();
        setError(null); // Clear any previous errors
      } else {
        console.log('📱 Loading fallback data...');
        await loadFallbackData();
        if (!isAvailable) {
          setError('📡 Real-time data unavailable. Using offline data.');
        }
      }
    } catch (err) {
      console.error('❌ Error loading initial data:', err);
      setError('🔄 Connection failed. Using offline data.');
      await loadFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      // Load all real-time data in parallel
      const [
        realTimeInvestments,
        realTimePortfolio,
        realTimeExchangeRates,
        realTimeInsights
      ] = await Promise.all([
        realTimeDataProvider.getRealTimeInvestments(),
        realTimeDataProvider.getRealTimePortfolioData(),
        realTimeDataProvider.getRealTimeExchangeRates(),
        realTimeDataProvider.getMarketInsights()
      ]);

      setInvestments(realTimeInvestments);
      setPortfolioData(realTimePortfolio);
      setExchangeRateData(realTimeExchangeRates);
      setMarketInsights(realTimeInsights);
      setLastUpdated(new Date());
      setError(null);

      console.log('Real-time data loaded successfully');
    } catch (err) {
      console.error('Error loading real-time data:', err);
      throw err;
    }
  };

  const loadFallbackData = async () => {
    // Use the fallback data from realTimeDataProvider
    const fallbackInvestments = await realTimeDataProvider['getFallbackInvestments']();
    setInvestments(fallbackInvestments);
    
    // Keep existing portfolio and exchange rate data as fallback
    setLastUpdated(new Date());
  };

  const refreshData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous refreshes

    setIsLoading(true);
    setError(null);

    try {
      if (isRealTimeEnabled) {
        // Check if backend is still available
        const isAvailable = await testApiConnection();
        
        if (isAvailable) {
          await realTimeDataProvider.refreshAllData();
          await loadRealTimeData();
        } else {
          setError('Backend unavailable. Using cached data.');
          setIsRealTimeEnabled(false);
        }
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled);
    setError(null);
    
    if (!isRealTimeEnabled) {
      // Re-enabling real-time, try to load fresh data
      refreshData();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: DataContextType = {
    // Data
    investments,
    transactions,
    goals,
    expenses,
    bankAccounts,
    articles,
    portfolioData,
    exchangeRateData,
    marketInsights,
    expenseCategories,
    
    // State
    isLoading,
    isRealTimeEnabled,
    lastUpdated,
    error,
    
    // Actions
    refreshData,
    toggleRealTime,
    clearError,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Custom hook for investments with additional utilities
export const useInvestments = () => {
  const { investments, isLoading, refreshData } = useData();
  
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalPurchaseValue = investments.reduce((sum, inv) => sum + inv.purchaseValue, 0);
  const totalGainLoss = totalValue - totalPurchaseValue;
  const totalGainLossPercent = totalPurchaseValue > 0 ? (totalGainLoss / totalPurchaseValue) * 100 : 0;
  
  return {
    investments,
    isLoading,
    refreshData,
    totalValue,
    totalPurchaseValue,
    totalGainLoss,
    totalGainLossPercent,
  };
};

// Custom hook for portfolio performance
export const usePortfolio = () => {
  const { portfolioData, isLoading, refreshData } = useData();
  
  const currentValue = portfolioData.data[portfolioData.data.length - 1] || 0;
  const previousValue = portfolioData.data[portfolioData.data.length - 2] || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;
  
  return {
    portfolioData,
    isLoading,
    refreshData,
    currentValue,
    change,
    changePercent,
  };
};
