import { Investment, Transaction, Goal, Expense, BankAccount, Article } from '@/types';

export const mockInvestments: Investment[] = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 175.23,
    change: 2.45,
    changePercent: 1.42,
    type: 'stock',
    currentValue: 17523,
    purchaseValue: 15000,
    quantity: 100
  },
  {
    id: '2',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2847.56,
    change: -15.23,
    changePercent: -0.53,
    type: 'stock',
    currentValue: 28475.6,
    purchaseValue: 30000,
    quantity: 10
  },
  {
    id: '3',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    price: 331.78,
    change: 4.12,
    changePercent: 1.26,
    type: 'stock',
    currentValue: 16589,
    purchaseValue: 15000,
    quantity: 50
  },
  {
    id: '4',
    ticker: 'VFIAX',
    name: 'Vanguard S&P 500 Index',
    price: 425.67,
    change: 3.21,
    changePercent: 0.76,
    type: 'mutual-fund',
    currentValue: 21283.5,
    purchaseValue: 20000,
    quantity: 50
  },
  {
    id: '5',
    ticker: 'FXNAX',
    name: 'Fidelity Total Bond',
    price: 10.45,
    change: -0.05,
    changePercent: -0.48,
    type: 'mutual-fund',
    currentValue: 10450,
    purchaseValue: 11000,
    quantity: 1000
  }
];

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

export const portfolioData = [67, 72, 69, 75, 78, 82];
export const portfolioLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const expenseCategories = {
  Food: 850,
  Housing: 1200,
  Shopping: 450,
  Transportation: 300,
  Entertainment: 200,
};

export const exchangeRateData = [1.32, 1.35, 1.31, 1.33, 1.36, 1.34, 1.37];
export const exchangeRateLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];