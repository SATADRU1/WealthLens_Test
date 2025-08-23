export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'expense' | 'income';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

export interface Investment {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'mutual-fund';
  currentValue: number;
  purchaseValue: number;
  quantity: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}